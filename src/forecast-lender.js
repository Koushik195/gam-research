// Lender forecast and valuation (NBFCs first; built so banks can follow). Profit is built from the
// balance sheet, the way lenders are analysed:
//   AUM_t = AUM_t-1 × (1 + growth);  average AUM = (opening + closing) / 2
//   interest income = yield × average AUM;  fee & other operating income = fee % × average AUM
//   interest expense = cost of funds × average borrowings
//   borrowings = total assets − net worth − other liabilities, with total assets (loans & other
//     assets + liquidity + fixed assets) and other liabilities held as % of AUM (FY26 levels by default)
//   operating expenses (incl. depreciation) = opex % × average AUM;  provisions = credit cost × average AUM
//   PBT = NII + fees − opex − provisions + other income;  PAT = PBT × (1 − tax)
//   minority interest = minority % × PAT;  EPS = attributable PAT ÷ shares;  DPS = EPS × payout
// Interest depends on closing borrowings, which depend on the profit retained in the same year. That
// loop is solved in closed form (no circular reference), so the Excel model reproduces every number
// without iterative calculation:
//   PAT = (1 − t) × [X − CoF/2 × (B_open + K)] ÷ [1 − (1 − t) × CoF/2 × r]
//   X = profit before interest expense and tax;  K = total assets − other liabilities − opening net
//   worth − equity raised (borrowings needed before this year's retained profit);
//   r = (1 − minority %) × (1 − payout) (net worth retained per rupee of PAT);  B_close = K − r × PAT.
// Screener mapping (NBFC layout): Revenue = interest income + fees & other operating income;
// Interest = finance cost; Expenses = opex excl. depreciation + impairment (provisions);
// Financing Profit = Revenue − Interest − Expenses; Other Income = non-operating items incl. exceptional;
// PBT = Financing Profit + Other Income − Depreciation = PPOP − provisions + other income.
// AUM, provisions and fee income are not on Screener: they come from assumptions.history (or
// research company.annualKpis) and must include the base year.
const fs = require('fs');
const path = require('path');

const isNum = v => typeof v === 'number' && Number.isFinite(v);
const at = (arr, i) => (Array.isArray(arr) ? arr[Math.min(i, arr.length - 1)] : arr);
const r0 = v => (isNum(v) ? Math.round(v) : null);
const r1 = v => (isNum(v) ? Math.round(v * 10) / 10 : null);
const r2 = v => (isNum(v) ? Math.round(v * 100) / 100 : null);
const readJson = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
const avg = (a, b) => (isNum(a) && isNum(b) ? (a + b) / 2 : null);
const sub = (a, b) => (isNum(a) && isNum(b) ? a - b : null);
const pct = (a, b) => (isNum(a) && isNum(b) && b !== 0 ? (a / b) * 100 : null);
const grow = (a, b) => (isNum(a) && isNum(b) && b > 0 ? (a / b - 1) * 100 : null);

// Scenario deltas (added to every forecast year) → driver they move.
const SCEN_DELTAS = { aumGrowthDelta: 'aumGrowth', yieldDelta: 'yieldOnAum', feeDelta: 'feeIncomePct', cofDelta: 'costOfFunds', opexDelta: 'opexPct', creditCostDelta: 'creditCost', payoutDelta: 'payout' };

// Reported history aligned to the Screener fiscal years (A.labels).
function lenderHistory(model, as) {
  const A = model.annual, L = A.labels, b = L.length - 1;
  const raw = model.raw || readJson(path.join(__dirname, '..', 'data', 'raw', model.meta.symbol, 'screener.json')) || {};
  const sch = (sec, par, item) => { const s = raw.schedules?.[sec]?.[par]?.[item]; return A.periods.map(p => (s && isNum(s[p]) ? s[p] : null)); };
  const ak = model.research?.company?.annualKpis || [];
  const hist = (...keys) => L.map(l => {
    for (const k of keys) { const v = as.history?.[k]?.[l]; if (isNum(v)) return v; }
    for (const k of keys) { const v = ak.find(r => r.fy === l)?.[k]; if (isNum(v)) return v; }
    return null;
  });
  const H = { labels: L, b, aum: hist('aum'), provisions: hist('provisions', 'creditCostCr', 'impairment'), feeIncome: hist('feeIncome') };
  H.feeKnown = H.feeIncome.some(isNum);
  if (!H.feeKnown) H.feeIncome = L.map(() => 0); // no split disclosed: all revenue treated as interest income
  // Attributable profit: Screener's "Profit for EPS" (after minority interest); minority = the gap.
  const pfe = sch('profit-loss', 'Net Profit', 'Profit for EPS'), mis = sch('profit-loss', 'Net Profit', 'Minority share');
  H.patAttrib = L.map((_, i) => (isNum(pfe[i]) ? pfe[i] : isNum(A.pat[i]) ? A.pat[i] + (mis[i] || 0) : null));
  H.minority = L.map((_, i) => sub(A.pat[i], H.patAttrib[i]));
  H.shares = L.map((_, i) => (isNum(H.patAttrib[i]) && isNum(A.eps[i]) && A.eps[i] !== 0 ? H.patAttrib[i] / A.eps[i] : null));
  H.borrowings = L.map((_, i) => (isNum(A.borrowings[i]) || isNum(A.deposits?.[i]) ? (A.borrowings[i] || 0) + (A.deposits?.[i] || 0) : null));
  H.liquidity = L.map((_, i) => (isNum(A.investments[i]) || isNum(A.cash[i]) ? (A.investments[i] || 0) + (A.cash[i] || 0) : null));
  H.fixedAssets = L.map((_, i) => (isNum(A.fixedAssets[i]) ? A.fixedAssets[i] + (A.cwip[i] || 0) : null));
  H.loans = L.map((_, i) => (isNum(A.totalAssets[i]) ? A.totalAssets[i] - (H.liquidity[i] || 0) - (H.fixedAssets[i] || 0) : null));
  return H;
}

// Base-year (last reported year) values and the balance-sheet ratios held in the forecast by default.
function baseOf(model, as, H) {
  const A = model.annual, b = H.b, fy = A.labels[b];
  const need = (v, what) => { if (!isNum(v)) throw new Error(`${model.meta.symbol}: the lender model needs ${what} for ${fy} (assumptions.history or company.annualKpis)`); return v; };
  const aum = need(H.aum[b], 'closing AUM (history.aum)');
  const prov = need(H.provisions[b], 'provisions / impairment (history.provisions)');
  const opex = A.expenses[b] - prov + A.dep[b];
  const shares = isNum(as.base?.shares) ? as.base.shares : H.shares[b];
  const ratio = x => ((x || 0) / aum) * 100;
  return {
    fy, aum, prov, fee: H.feeIncome[b] || 0, opex, shares, nw: A.netWorth[b], bor: H.borrowings[b] || 0, ol: A.otherLiab[b] || 0, ta: A.totalAssets[b],
    sales: A.sales[b], interest: A.interest[b], pat: A.pat[b], eps: A.eps[b], ebitda: A.ebitda[b],
    minorityPct: H.minority[b] > 0 && A.pat[b] > 0 ? (H.minority[b] / A.pat[b]) * 100 : 0,
    loansPct: ratio(H.loans[b]), liqPct: ratio(H.liquidity[b]), fixedPct: ratio(H.fixedAssets[b]), olPct: ratio(A.otherLiab[b]), depShare: (A.dep[b] / opex) * 100,
  };
}

// Every driver as a full per-year array (scalars and short arrays are extended, as elsewhere in the engine).
function drivers(as, B) {
  const arr = (x, d) => as.years.map((_, i) => (x == null ? d : at(x, i)));
  const req = k => { if (as[k] == null) throw new Error(`lender assumptions: '${k}' is required`); return arr(as[k]); };
  const bs = as.bs || {};
  return {
    aumGrowth: req('aumGrowth'), yieldOnAum: req('yieldOnAum'), feeIncomePct: arr(as.feeIncomePct, 0), costOfFunds: req('costOfFunds'), opexPct: req('opexPct'), creditCost: req('creditCost'),
    taxRate: req('taxRate'), payout: arr(as.payout, 0), minorityPct: arr(as.minorityPct, B.minorityPct), otherIncome: arr(as.otherIncome, 0), capitalRaise: arr(as.capitalRaise, 0), newShares: arr(as.newShares, 0),
    loansPct: arr(bs.loansPctOfAum, B.loansPct), liqPct: arr(bs.liquidityPctOfAum, B.liqPct), fixedPct: arr(bs.fixedPctOfAum, B.fixedPct), olPct: arr(bs.otherLiabPctOfAum, B.olPct), depShare: arr(as.depShareOfOpex, B.depShare),
  };
}

const F_KEYS = ['aum', 'avgAum', 'interestIncome', 'feeIncome', 'sales', 'interest', 'nii', 'nti', 'opexExDep', 'dep', 'opex', 'ppop', 'provisions', 'otherIncome', 'pbt', 'tax', 'pat', 'minority', 'patAttrib',
  'sharesOut', 'eps', 'dps', 'dividends', 'netWorth', 'bvps', 'borrowings', 'avgBorrowings', 'otherLiab', 'loans', 'liquidity', 'fixedAssets', 'totalAssets', 'treasury', 'ebitda', 'ebitdaMargin', 'expenses',
  'yieldOnAum', 'costOfFunds', 'spread', 'nim', 'feePct', 'ntiPct', 'opexPct', 'costToIncome', 'creditCost', 'ppopPct', 'roaAum', 'roa', 'roe', 'leverage', 'assetsToEquity', 'equityToAum', 'debtEquity', 'taxRate', 'payout',
  'aumGrowth', 'salesGrowth', 'niiGrowth', 'ppopGrowth', 'ebitdaGrowth', 'patGrowth', 'epsGrowth', 'bvpsGrowth'];

function projectLender(model, as, B) {
  const D = drivers(as, B), n = as.years.length;
  const F = { years: as.years, shares: B.shares };
  F_KEYS.forEach(k => (F[k] = []));
  let aum = B.aum, nw = B.nw, bor = B.bor, ta = B.ta, shares = B.shares;
  let prev = { sales: B.sales, nii: B.sales - B.fee - B.interest, ppop: B.sales - B.interest - B.opex, ebitda: B.ebitda, pat: B.pat, eps: B.eps, bvps: B.nw / B.shares };
  for (let i = 0; i < n; i++) {
    const aumOpen = aum, nwOpen = nw, borOpen = bor, taOpen = ta;
    aum = aumOpen * (1 + D.aumGrowth[i] / 100);
    const avgAum = (aumOpen + aum) / 2;
    const ii = (D.yieldOnAum[i] / 100) * avgAum, fee = (D.feeIncomePct[i] / 100) * avgAum;
    const opex = (D.opexPct[i] / 100) * avgAum, prov = (D.creditCost[i] / 100) * avgAum, oi = D.otherIncome[i];
    const loans = (D.loansPct[i] / 100) * aum, liq = (D.liqPct[i] / 100) * aum, fixed = (D.fixedPct[i] / 100) * aum, ol = (D.olPct[i] / 100) * aum;
    ta = loans + liq + fixed;
    // closed-form solution of the interest ↔ retained-profit loop (see header)
    const t = D.taxRate[i] / 100, cof = D.costOfFunds[i] / 100, raise = D.capitalRaise[i];
    const X = ii + fee - opex - prov + oi;
    const K = ta - ol - nwOpen - raise;
    const r = (1 - D.minorityPct[i] / 100) * (1 - D.payout[i] / 100);
    const patSolved = ((1 - t) * (X - (cof / 2) * (borOpen + K))) / (1 - (1 - t) * (cof / 2) * r);
    bor = K - r * patSolved;
    const ie = (cof / 2) * (borOpen + bor);
    const pbt = X - ie, tax = pbt * t, pat = pbt - tax;
    const minority = (pat * D.minorityPct[i]) / 100, patAttrib = pat - minority;
    shares += D.newShares[i];
    const eps = patAttrib / shares, dps = (eps * D.payout[i]) / 100, dividends = dps * shares;
    nw = nwOpen + patAttrib - dividends + raise;
    const nii = ii - ie, nti = nii + fee, dep = (opex * D.depShare[i]) / 100, ppop = nti - opex, ebitda = nti - (opex - dep) - prov;
    const avgBor = (borOpen + bor) / 2, avgNw = (nwOpen + nw) / 2, avgTa = (taOpen + ta) / 2, bvps = nw / shares;
    const row = {
      aum, avgAum, interestIncome: ii, feeIncome: fee, sales: ii + fee, interest: ie, nii, nti, opexExDep: opex - dep, dep, opex, ppop, provisions: prov, otherIncome: oi, pbt, tax, pat, minority, patAttrib,
      sharesOut: shares, eps, dps, dividends, netWorth: nw, bvps, borrowings: bor, avgBorrowings: avgBor, otherLiab: ol, loans, liquidity: liq, fixedAssets: fixed, totalAssets: ta, treasury: liq,
      ebitda, ebitdaMargin: (ebitda / (ii + fee)) * 100, expenses: opex - dep + prov,
      yieldOnAum: (ii / avgAum) * 100, costOfFunds: (ie / avgBor) * 100, spread: (ii / avgAum - ie / avgBor) * 100, nim: (nii / avgAum) * 100, feePct: (fee / avgAum) * 100, ntiPct: (nti / avgAum) * 100,
      opexPct: (opex / avgAum) * 100, costToIncome: (opex / nti) * 100, creditCost: (prov / avgAum) * 100, ppopPct: (ppop / avgAum) * 100, roaAum: (patAttrib / avgAum) * 100, roa: (patAttrib / avgTa) * 100,
      roe: (patAttrib / avgNw) * 100, leverage: aum / nw, assetsToEquity: ta / nw, equityToAum: (nw / aum) * 100, debtEquity: bor / nw, taxRate: D.taxRate[i], payout: D.payout[i],
      aumGrowth: D.aumGrowth[i], salesGrowth: grow(ii + fee, prev.sales), niiGrowth: grow(nii, prev.nii), ppopGrowth: grow(ppop, prev.ppop), ebitdaGrowth: grow(ebitda, prev.ebitda),
      patGrowth: grow(pat, prev.pat), epsGrowth: grow(eps, prev.eps), bvpsGrowth: grow(bvps, prev.bvps),
    };
    F_KEYS.forEach(k => F[k].push(row[k]));
    prev = { sales: ii + fee, nii, ppop, ebitda, pat, eps, bvps };
  }
  return F;
}

// History + forecast on one axis (fin.labels) for the lender lines; merged into model.fin by model.js.
function finSeries(model, H, B, F) {
  const A = model.annual, L = A.labels, idx = L.map((_, i) => i);
  const h = {};
  h.aum = H.aum;
  h.avgAum = idx.map(i => (i ? avg(H.aum[i - 1], H.aum[i]) : null));
  h.feeIncome = H.feeKnown ? H.feeIncome : idx.map(() => null);
  h.interestIncome = idx.map(i => sub(A.sales[i], H.feeIncome[i]));
  h.interest = A.interest;
  h.nii = idx.map(i => sub(h.interestIncome[i], A.interest[i]));
  h.nti = idx.map(i => sub(A.sales[i], A.interest[i]));
  h.provisions = H.provisions;
  h.opexExDep = idx.map(i => sub(A.expenses[i], H.provisions[i]));
  h.opex = idx.map(i => (isNum(h.opexExDep[i]) ? h.opexExDep[i] + (A.dep[i] || 0) : null));
  h.ppop = idx.map(i => sub(h.nti[i], h.opex[i]));
  h.expenses = A.expenses;
  h.tax = idx.map(i => sub(A.pbt[i], A.pat[i]));
  h.minority = H.minority; h.patAttrib = H.patAttrib; h.sharesOut = H.shares;
  h.borrowings = H.borrowings; h.otherLiab = A.otherLiab; h.totalAssets = A.totalAssets; h.loans = H.loans; h.liquidity = H.liquidity; h.fixedAssets = H.fixedAssets;
  h.avgBorrowings = idx.map(i => (i ? avg(H.borrowings[i - 1], H.borrowings[i]) : null));
  h.bvps = idx.map(i => (isNum(A.netWorth[i]) && H.shares[i] ? A.netWorth[i] / H.shares[i] : null));
  h.yieldOnAum = idx.map(i => pct(h.interestIncome[i], h.avgAum[i]));
  h.costOfFunds = idx.map(i => pct(A.interest[i], h.avgBorrowings[i]));
  h.spread = idx.map(i => sub(h.yieldOnAum[i], h.costOfFunds[i]));
  h.nim = idx.map(i => pct(h.nii[i], h.avgAum[i]));
  h.feePct = idx.map(i => (H.feeKnown ? pct(H.feeIncome[i], h.avgAum[i]) : null));
  h.ntiPct = idx.map(i => pct(h.nti[i], h.avgAum[i]));
  h.opexPct = idx.map(i => pct(h.opex[i], h.avgAum[i]));
  h.costToIncome = idx.map(i => pct(h.opex[i], h.nti[i]));
  h.creditCost = idx.map(i => pct(H.provisions[i], h.avgAum[i]));
  h.ppopPct = idx.map(i => pct(h.ppop[i], h.avgAum[i]));
  h.roaAum = idx.map(i => pct(H.patAttrib[i], h.avgAum[i]));
  h.roa = idx.map(i => pct(H.patAttrib[i], i ? avg(A.totalAssets[i - 1], A.totalAssets[i]) : null));
  h.roe = idx.map(i => pct(H.patAttrib[i], i ? avg(A.netWorth[i - 1], A.netWorth[i]) : null));
  h.leverage = idx.map(i => (isNum(H.aum[i]) && A.netWorth[i] ? H.aum[i] / A.netWorth[i] : null));
  h.assetsToEquity = idx.map(i => (isNum(A.totalAssets[i]) && A.netWorth[i] ? A.totalAssets[i] / A.netWorth[i] : null));
  h.equityToAum = idx.map(i => pct(A.netWorth[i], H.aum[i]));
  h.debtEquity = idx.map(i => (isNum(H.borrowings[i]) && A.netWorth[i] ? H.borrowings[i] / A.netWorth[i] : null));
  h.taxRate = idx.map(i => pct(h.tax[i], A.pbt[i]));
  h.payout = A.payout;
  h.aumGrowth = idx.map(i => (i ? grow(H.aum[i], H.aum[i - 1]) : null));
  h.niiGrowth = idx.map(i => (i ? grow(h.nii[i], h.nii[i - 1]) : null));
  h.ppopGrowth = idx.map(i => (i ? grow(h.ppop[i], h.ppop[i - 1]) : null));
  h.bvpsGrowth = idx.map(i => (i ? grow(h.bvps[i], h.bvps[i - 1]) : null));
  const out = {};
  for (const k of Object.keys(h)) out[k] = [...h[k], ...(F[k] || F.years.map(() => null))];
  return out;
}

// Valuation. Methods (valuation.blend.methods, role 'primary' + cross-checks, no weights):
//   pe  = EPS × multiple          pb = book value per share × multiple   (year, or roll [from, to, w])
//   jpb = justified P/B × book: P/B = (sustainable ROE − g) ÷ (Ke − g) (Gordon growth); book at the
//         method's year/roll (default: the 12-month target date, 50% FY27E + 50% FY28E)
//   ri  = residual income (the insurer engine's residualIncome), rolled forward to 12 months
function lenderValue(F, as, price, deps, kase = 'base') {
  const v = as.valuation || {};
  const ke = isNum(v.ke) ? v.ke : v.rf + v.beta * v.erp;
  const g = isNum(v.g) ? v.g : v.terminalGrowth;
  const S = isNum(v.sustainableRoe) ? v.sustainableRoe : F.roe[F.roe.length - 1];
  if (!(ke > g)) throw new Error(`lender valuation: cost of equity (${ke}) must exceed g (${g})`);
  const yi = y => F.years.indexOf(y);
  const pickOf = m => a => (m.roll ? a[yi(m.roll[0])] * (1 - m.roll[2]) + a[yi(m.roll[1])] * m.roll[2] : a[Math.max(0, yi(m.year))]);
  const jpb = (S - g) / (ke - g);
  const ri = deps.residualIncome(F, as, price, { sustainableRoe: S });
  const riValue = ri.perShare * Math.pow(1 + ri.ke / 100, (v.rollForwardMonths ?? 6) / 12);
  const list = v.blend?.methods || [
    { key: 'jpb', method: 'jpb', name: 'Justified P/B', role: 'primary' },
    { key: 'ri', method: 'ri', name: 'Residual income', role: 'cross-check' },
  ];
  const methods = list.map(m => {
    const mult = m.multiple ? (m.multiple[kase] ?? m.multiple.base) : null;
    const roll = m.method === 'jpb' && !m.roll && !m.year ? [F.years[0], F.years[1], 0.5] : m.roll;
    const pick = pickOf({ ...m, roll });
    let metric = null, used = mult, value;
    if (m.method === 'pe') { metric = pick(F.eps); value = metric * mult; }
    else if (m.method === 'pb') { metric = pick(F.bvps); value = metric * mult; }
    else if (m.method === 'jpb') { metric = pick(F.bvps); used = jpb; value = (metric * jpb) / Math.pow(1 + ke / 100, (m.discountMonths || 0) / 12); }
    else if (m.method === 'ri') value = riValue;
    else throw new Error(`lender valuation: method '${m.method}' is not supported (use pe, pb, jpb or ri)`);
    return { key: m.key || m.method, name: m.name, method: m.method, year: m.year, roll, role: m.role, metric, mult: used, value, weight: m.weight, why: m.why, multiple: m.multiple, discountMonths: m.discountMonths };
  });
  const rnd = v.blend?.round || 10;
  const prim = methods.find(m => m.role === 'primary');
  let B;
  if (prim) { // target = the street's method; the rest are cross-checks (as in forecast.js blend)
    methods.forEach(m => (m.vsTarget = (m.value / prim.value - 1) * 100));
    const mx = prim.mult != null ? ` (${prim.method === 'jpb' ? r2(prim.mult) : prim.mult}x)` : '';
    B = { methods, primary: prim, value: prim.value, tp: Math.round(prim.value / rnd) * rnd, label: prim.year ? `${prim.name} on ${prim.year}${mx}` : `${prim.name}${mx}` };
  } else {
    const wsum = methods.reduce((s, m) => s + (m.weight || 0), 0);
    const value = methods.reduce((s, m) => s + m.value * (m.weight || 0), 0) / wsum;
    B = { methods, value, tp: Math.round(value / rnd) * rnd, label: methods.map(m => `${m.name} ${Math.round(((m.weight || 0) / wsum) * 100)}%`).join(' · ') };
  }
  const jm = methods.find(m => m.method === 'jpb');
  return { ke, g, S, jpb, ri, riValue, B, rnd, jpbBook: jm ? jm.metric : pickOf({ roll: [F.years[0], F.years[1], 0.5] })(F.bvps), jpbDisc: jm?.discountMonths || 0 };
}

function buildLenderForecast(model, as, deps = {}) {
  if (typeof deps.residualIncome !== 'function') throw new Error('buildLenderForecast needs deps.residualIncome (from forecast.js)');
  const price = model.price?.last;
  const H = lenderHistory(model, as);
  const B = baseOf(model, as, H);
  const F = projectLender(model, as, B);
  const val = lenderValue(F, as, price, deps, 'base');
  const v = as.valuation || {};
  const scen = {};
  for (const [name, s] of Object.entries(as.scenarios || {})) {
    const a2 = JSON.parse(JSON.stringify(as));
    for (const [d, k] of Object.entries(SCEN_DELTAS)) if (isNum(s[d])) a2[k] = as.years.map((_, i) => (at(a2[k], i) ?? 0) + s[d]);
    if (isNum(s.sustainableRoe)) (a2.valuation ||= {}).sustainableRoe = s.sustainableRoe;
    const F2 = projectLender(model, a2, B), v2 = lenderValue(F2, a2, price, deps, name);
    scen[name] = {
      label: s.label, narrative: s.narrative, tp: v2.B.tp, upside: r1((v2.B.tp / price - 1) * 100), blend: v2.B,
      eps: F2.eps.map(r2), bvps: F2.bvps.map(r2), roe: F2.roe.map(r1), roa: F2.roa.map(r2), nim: F2.nim.map(r2), creditCost: F2.creditCost.map(r2), aum: F2.aum.map(r0),
      pe: r1(v2.B.tp / F2.eps[1]), pb: r2(v2.B.tp / F2.bvps[1]), justifiedPb: r2(v2.jpb), riValue: r0(v2.riValue), sustainableRoe: v2.S,
    };
  }
  const { ke, g, S, jpb, ri, riValue } = val, Bv = val.B, prim = Bv.primary;
  const disc = k => Math.pow(1 + k / 100, val.jpbDisc / 12);
  const sens = { waccs: [-1, -0.5, 0, 0.5, 1].map(x => ke + x), gs: [-3, -1.5, 0, 1.5, 3].map(x => S + x), grid: [] };
  for (const k of sens.waccs) sens.grid.push(sens.gs.map(r => Math.round((((r - g) / (k - g)) * val.jpbBook) / disc(k) / val.rnd) * val.rnd));
  let sensPrimary = null;
  if (prim && ['pe', 'pb'].includes(prim.method)) {
    const cases = ['bear', 'base', 'bull'].filter(c => c === 'base' || scen[c]);
    const metricOf = c => (c === 'base' ? prim.metric : scen[c].blend.methods.find(m => m.key === prim.key)?.metric);
    const mults = [-1, -0.5, 0, 0.5, 1].map(x => r2(prim.mult + x));
    sensPrimary = { method: prim.method, mults, cases, metrics: cases.map(metricOf), grid: mults.map(x => cases.map(c => Math.round((x * metricOf(c)) / val.rnd) * val.rnd)) };
  }
  // Long-run ROE the market implies at today's price (residual income, bisection), and via Gordon P/B.
  let lo = 0, hi = 60;
  for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (deps.residualIncome(F, as, price, { sustainableRoe: mid, rollForwardMonths: 0 }).perShare < price) lo = mid; else hi = mid; }
  const bvpsA = B.nw / B.shares, primBook = prim && ['pb', 'jpb'].includes(prim.method) ? prim.metric : null;
  const V = {
    method: Bv.label, ke, wacc: ke, g, terminalGrowth: v.terminalGrowth, sustainableRoe: S, justifiedPb: jpb, book: val.jpbBook, bookYear: (Bv.methods.find(m => m.method === 'jpb') || {}).year || 'Sep-27E',
    tp: Bv.tp, upside: (Bv.tp / price - 1) * 100, blend: Bv, intrinsicTp: Math.round(riValue / 5) * 5, intrinsicMethod: 'Residual income',
    perShare: ri.perShare, pvRi: ri.pvRi, pvTv: ri.pvTv, riValue, riB0: ri.B0, rows: ri.rows, impliedRoe: (lo + hi) / 2,
    currentPb: price / bvpsA, currentBvps: bvpsA, forwardPb: price / F.bvps[0], impliedRoeJpb: g + (price / bvpsA) * (ke - g),
    impliedPe: Bv.tp / F.eps[1], impliedPeLabel: F.years[1], impliedPb: Bv.tp / (primBook || F.bvps[1]), impliedPbLabel: primBook ? prim.year || 'target book' : F.years[1],
    sens, sensRowLabel: 'Cost of equity', sensColLabel: 'Sustainable ROE', sensTitle: 'Justified P/B value per share (₹)', sensPrimary,
  };
  F.pe = F.eps.map(e => price / e);
  F.pb = F.bvps.map(x => price / x);
  F.divYield = F.dps.map(d => (d / price) * 100);
  const finExtra = finSeries(model, H, B, F);
  // Per-share history on attributable profit (Screener's implied shares use consolidated profit,
  // which overstates the share count once there are minority interests).
  const A = model.annual;
  A.shares = H.shares.map((s, i) => s ?? A.shares[i]);
  A.bvps = A.netWorth.map((nw, i) => (isNum(nw) && A.shares[i] ? nw / A.shares[i] : null));
  const last = A.labels.length - 1, cg = (e, s, y) => (e > 0 && s > 0 ? r1((Math.pow(e / s, 1 / y) - 1) * 100) : null);
  if (A.cagr) A.cagr.bvps = Object.fromEntries([3, 5, 10].map(y => [`${y}y`, last - y >= 0 ? cg(A.bvps[last], A.bvps[last - y], y) : null]));
  const PS = new Set(['eps', 'dps', 'bvps']);
  const round = o => Object.fromEntries(Object.entries(o).map(([k, x]) => [k, Array.isArray(x) ? x.map(y => (isNum(y) ? (PS.has(k) ? r2(y) : Math.abs(y) >= 100 ? r0(y) : r2(y)) : y)) : x]));
  return { type: 'lender', assumptions: as, F: round(F), dcf: V, scenarios: scen, finExtra, base: { ...B, feeKnown: H.feeKnown } };
}

module.exports = { buildLenderForecast, lenderHistory, baseOf, drivers, projectLender, lenderValue, SCEN_DELTAS };
