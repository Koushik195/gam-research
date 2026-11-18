// Forecast + DCF engine. Generic three-statement projection driven by a per-company
// assumptions file (data/raw/<SYM>/research/assumptions.json). Revenue is either
// volume × revenue-per-unit (if `volume` is given) or a plain growth path.
//
// Balance-sheet logic (kept deliberately simple and auditable):
//   net worth  += PAT − dividends
//   net block  += capex − depreciation           (CWIP held flat)
//   operating working capital = owc% × revenue   (Maruti's is negative: suppliers fund it)
//   cash + investments is the plug: absorbs FCF after dividends
const isNum = v => typeof v === 'number' && Number.isFinite(v);
const at = (arr, i) => (Array.isArray(arr) ? arr[Math.min(i, arr.length - 1)] : arr);
const r0 = v => (isNum(v) ? Math.round(v) : null);
const r1 = v => (isNum(v) ? Math.round(v * 10) / 10 : null);
const r2 = v => (isNum(v) ? Math.round(v * 100) / 100 : null);

function project(A, as) {
  const b = A.labels.length - 1; // base year index
  const n = as.years.length;
  const shares = A.shares[b];
  // otherTreasury: bank deposits reported inside 'other assets' that are really treasury (e.g. Swiggy)
  const otherTreasury = as.otherTreasury?.base || 0;
  const opDebt = as.operatingDebt?.base || 0; // e.g. gold metal loans: working-capital funding, not financing debt
  const owcPct = isNum(as.owcPctOfSales) ? as.owcPctOfSales : ((A.otherAssets[b] - (A.cash[b] || 0) - otherTreasury) - A.otherLiab[b] - opDebt) / A.sales[b] * 100;
  const F = { years: as.years, volume: [], revPerUnit: [], sales: [], ebitda: [], ebitdaMargin: [], dep: [], ebit: [], otherIncome: [], interest: [], pbt: [], tax: [], pat: [], eps: [], dps: [], dividends: [],
    capex: [], netBlock: [], grossBlock: [], owc: [], owcChange: [], cfo: [], fcf: [], netWorth: [], treasury: [], bvps: [], roe: [], roce: [], coreRoce: [], salesGrowth: [], ebitdaGrowth: [], patGrowth: [], epsGrowth: [] };
  let vol = as.volume?.base, rpu = vol ? A.sales[b] * 1e7 / vol : null;
  let sales = A.sales[b], nw = A.netWorth[b], netBlock = A.fixedAssets[b], gross = A.grossBlock[b];
  let treasury = (A.cash[b] || 0) + (A.investments[b] || 0) + otherTreasury - ((A.borrowings[b] || 0) - opDebt);
  let owc = owcPct / 100 * sales, prevEbitda = A.ebitda[b], prevPat = A.pat[b], prevEps = A.eps[b];
  const depRate = isNum(as.depRateOnGrossBlock) ? as.depRateOnGrossBlock : A.dep[b] / ((A.grossBlock[b] + A.grossBlock[b - 1]) / 2) * 100;
  // Segment-driven businesses (platforms): each segment's driver (e.g. GOV) grows, revenue and
  // adjusted EBITDA are % of the driver; consolidated EBITDA = Σ segments − unallocated costs − ESOP.
  const segs = as.segments ? as.segments.map(s => ({ ...s, driver: s.base })) : null;
  if (segs) { F.seg = Object.fromEntries(segs.map(s => [s.key, { name: s.name, driver: [], revenue: [], adjEbitda: [] }])); F.unalloc = []; }
  for (let i = 0; i < n; i++) {
    let margin, ebitda;
    if (segs) {
      let rev = 0, e = 0;
      for (const s of segs) {
        s.driver *= 1 + at(s.growth, i) / 100;
        const r = s.driver * at(s.revPct, i) / 100, x = s.driver * at(s.marginPct, i) / 100;
        F.seg[s.key].driver.push(s.driver); F.seg[s.key].revenue.push(r); F.seg[s.key].adjEbitda.push(x);
        rev += r; e += x;
      }
      sales = rev;
      (F.gov ||= []).push(segs.filter(s => s.driverLabel === 'GOV').reduce((t, s) => t + s.driver, 0));
      ebitda = e - (at(as.unallocated, i) || 0) - (at(as.esop, i) || 0);
      F.unalloc.push(ebitda - e); // reported EBITDA less sum of segments (negative = corporate cost)
      margin = ebitda / sales * 100;
    } else {
      if (vol) {
        vol *= 1 + at(as.volume.growth, i) / 100;
        rpu *= 1 + at(as.revPerUnitGrowth, i) / 100;
        sales = vol * rpu / 1e7;
      } else sales *= 1 + at(as.revenueGrowth, i) / 100;
      margin = at(as.ebitdaMargin, i);
      ebitda = sales * margin / 100;
    }
    const capex = at(as.capex, i);
    const grossOpen = gross;
    gross += capex;
    const dep = depRate / 100 * (grossOpen + gross) / 2;
    netBlock += capex - dep;
    const ebit = ebitda - dep;
    const otherIncome = at(as.treasuryYield, i) / 100 * Math.max(treasury, 0) + (at(as.otherIncome, i) || 0); // + non-treasury other income
    const interest = at(as.interest, i) ?? 0;
    const pbt = ebit + otherIncome - interest;
    const tax = Math.max(pbt, 0) * at(as.taxRate, i) / 100; // no tax credit booked on losses
    const pat = pbt - tax;
    const eps = pat / shares;
    const dps = eps * at(as.payout, i) / 100;
    const dividends = dps * shares;
    const newOwc = owcPct / 100 * sales;
    const owcChange = newOwc - owc; // negative = cash inflow
    owc = newOwc;
    const esopNC = segs ? (at(as.esop, i) || 0) : 0; // share-based pay is a non-cash cost, credited to equity
    const cfo = pat + dep + esopNC - owcChange - otherIncome * (1 - at(as.taxRate, i) / 100); // operating cash excl. treasury income
    const fcf = cfo - capex;
    const nwOpen = nw;
    nw += pat - dividends + esopNC;
    const treasuryOpen = treasury;
    treasury += fcf + otherIncome * (1 - at(as.taxRate, i) / 100) - dividends;
    const opCapital = (netBlock + A.cwip[b] + owc);
    Object.entries({ volume: vol, revPerUnit: rpu, sales, ebitda, ebitdaMargin: margin, dep, ebit, otherIncome, interest, pbt, tax, pat, eps, dps, dividends, capex, netBlock, grossBlock: gross, owc, owcChange, cfo, fcf, netWorth: nw, treasury })
      .forEach(([k, v]) => F[k].push(v));
    F.bvps.push(nw / shares);
    F.roe.push(pat / ((nw + nwOpen) / 2) * 100);
    F.roce.push((ebit + otherIncome) / ((nw + nwOpen) / 2) * 100);
    F.coreRoce.push(ebit / opCapital * 100);
    F.salesGrowth.push((sales / (i ? F.sales[i - 1] : A.sales[b]) - 1) * 100);
    F.ebitdaGrowth.push((ebitda / prevEbitda - 1) * 100);
    F.patGrowth.push((pat / prevPat - 1) * 100);
    F.epsGrowth.push((eps / prevEps - 1) * 100);
    prevEbitda = ebitda; prevPat = pat; prevEps = eps;
  }
  F.owcPct = owcPct; F.depRate = depRate; F.shares = shares;
  return F;
}

// Two-stage DCF on free cash flow to firm (ex treasury income), valued at the end of the
// first forecast year, then rolled forward to a 12-month target price.
function dcf(A, F, as, price) {
  const d = as.dcf;
  const ke = d.rf + d.beta * d.erp; // all-equity: Maruti carries no debt
  const wacc = isNum(d.wacc) ? d.wacc : ke;
  const t = at(as.taxRate, F.years.length - 1) / 100;
  // Stage 1 = explicit forecast years after the first; stage 2 fades growth/margin/capex to terminal.
  const rows = [];
  let sales = F.sales[0];
  const years = d.years || 10;
  for (let k = 1; k <= years; k++) {
    let g, m, cx;
    if (k < F.years.length) {
      g = F.salesGrowth[k]; m = F.ebitdaMargin[k]; cx = F.capex[k] / F.sales[k] * 100;
    } else {
      const s = (k - F.years.length + 1) / (years - F.years.length + 1); // 0→1 fade
      const g0 = F.salesGrowth[F.years.length - 1], m0 = F.ebitdaMargin[F.years.length - 1], c0 = F.capex[F.years.length - 1] / F.sales[F.years.length - 1] * 100;
      g = g0 + (d.fadeGrowthTo - g0) * s; m = m0 + (d.fadeMarginTo - m0) * s; cx = c0 + (d.fadeCapexPctTo - c0) * s;
    }
    sales *= 1 + g / 100;
    const ebitda = sales * m / 100;
    const dep = sales * d.depPctOfSales / 100;
    const nopat = (ebitda - dep) * (1 - t);
    const capex = sales * cx / 100;
    const dWc = F.owcPct / 100 * sales * (g / (100 + g)); // change in (negative) working capital
    const fcff = nopat + dep - capex - dWc;
    const disc = 1 / Math.pow(1 + wacc / 100, k - 0.5); // mid-year
    rows.push({ year: `FY${26 + 1 + k}E`, sales, growth: g, margin: m, ebitda, capex, fcff, disc, pv: fcff * disc });
  }
  const last = rows[rows.length - 1];
  const tv = last.fcff * (1 + d.terminalGrowth / 100) / ((wacc - d.terminalGrowth) / 100);
  const pvTv = tv / Math.pow(1 + wacc / 100, years);
  const pvExplicit = rows.reduce((s, r) => s + r.pv, 0);
  const ev = pvExplicit + pvTv;
  const netCash = F.treasury[0]; // at end of first forecast year (valuation date)
  const equity = ev + netCash;
  const perShare = equity / F.shares;
  const months = d.rollForwardMonths ?? 6; // valuation date (end-FY27) → 12m target date
  const tp = Math.round(perShare * Math.pow(1 + ke / 100, months / 12) / 10) * 10;
  // Sensitivity of TP to WACC and terminal growth
  const sens = { waccs: [-1, -0.5, 0, 0.5, 1].map(x => wacc + x), gs: [-1, -0.5, 0, 0.5, 1].map(x => d.terminalGrowth + x), grid: [] };
  for (const w of sens.waccs) {
    sens.grid.push(sens.gs.map(gT => {
      const pv = rows.reduce((s, r, k) => s + r.fcff / Math.pow(1 + w / 100, k + 0.5), 0);
      const tvx = last.fcff * (1 + gT / 100) / ((w - gT) / 100) / Math.pow(1 + w / 100, years);
      return Math.round(((pv + tvx + netCash) / F.shares) * Math.pow(1 + ke / 100, months / 12) / 10) * 10;
    }));
  }
  return { ke, wacc, terminalGrowth: d.terminalGrowth, rows, pvExplicit, pvTv, tv, ev, netCash, equity, perShare, tp, upside: (tp / price - 1) * 100, tvShare: pvTv / ev * 100, sens,
    impliedPe: tp / F.eps[1], impliedPeLabel: F.years[1], impliedEvEbitda: (tp * F.shares - netCash) / F.ebitda[1] };
}

function scenarios(A, as, price) {
  const out = {};
  for (const [name, s] of Object.entries(as.scenarios || {})) {
    const a2 = JSON.parse(JSON.stringify(as));
    if (s.volumeGrowthDelta && a2.volume) a2.volume.growth = a2.volume.growth.map(g => g + s.volumeGrowthDelta);
    if (s.revenueGrowthDelta && a2.revenueGrowth) a2.revenueGrowth = a2.revenueGrowth.map(g => g + s.revenueGrowthDelta);
    if (s.marginDelta) a2.ebitdaMargin = a2.ebitdaMargin.map(m => m + s.marginDelta);
    if (s.revPerUnitDelta) a2.revPerUnitGrowth = a2.revPerUnitGrowth.map(g => g + s.revPerUnitDelta);
    if (s.fadeMarginTo) a2.dcf.fadeMarginTo = s.fadeMarginTo;
    for (const seg of a2.segments || []) {
      const d = s.segments?.[seg.key]; if (!d) continue;
      if (d.growthDelta) seg.growth = seg.growth.map(g => g + d.growthDelta);
      if (d.marginDelta) seg.marginPct = seg.marginPct.map(m => m + d.marginDelta);
    }
    const F = project(A, a2);
    const v = dcf(A, F, a2, price), b2 = blend(F, v, a2, name);
    const tp = b2 ? b2.tp : v.tp;
    out[name] = { label: s.label, narrative: s.narrative, eps: F.eps.map(r1), ebitdaMargin: F.ebitdaMargin.map(r1), tp, upside: r1((tp / price - 1) * 100), pe: r1(tp / F.eps[1]), dcfTp: v.tp, blend: b2 };
  }
  return out;
}

// ---------------------------------------------------------------------------------------
// Non-life insurer model. Profit = underwriting result + investment income:
//   NWP = GWP × retention;  NEP = NWP × earned ratio (premium is earned over the policy term)
//   underwriting result = NEP × (1 − loss ratio) − NWP × expense ratio (commission + opex)
//   investment income = yield × average investment book (float + shareholders' funds)
// Valued on price-to-book against sustainable ROE (Gordon growth): P/B = (ROE − g) / (Ke − g).
function projectInsurer(as) {
  const b = as.base, n = as.years.length;
  const F = { years: as.years, gwp: [], nwp: [], nep: [], netClaims: [], lossRatio: [], expenseRatio: [], combinedRatio: [], uwResult: [], aum: [], investmentIncome: [], pbt: [], tax: [], pat: [], eps: [], dps: [], netWorth: [], bvps: [], roe: [], gwpGrowth: [], patGrowth: [], epsGrowth: [], dividends: [] };
  let gwp = b.gwp, aum = b.aum, nw = b.netWorth, prevPat = b.pat, prevEps = b.pat / b.shares;
  for (let i = 0; i < n; i++) {
    const g = at(as.gwpGrowth, i);
    gwp *= 1 + g / 100;
    const nwp = gwp * at(as.retention, i) / 100;
    const nep = nwp * at(as.earnedRatio, i) / 100;
    const lr = at(as.lossRatio, i), er = at(as.expenseRatio, i);
    const claims = nep * lr / 100;
    const uw = nep - claims - nwp * er / 100;
    // Float grows with the premium base (unearned premium + claim reserves ≈ floatToNwp × NWP).
    const aumOpen = aum;
    const aumClose = as.floatToNwp * nwp + nw;
    const inv = at(as.investmentYield, i) / 100 * (aumOpen + aumClose) / 2;
    const pbt = uw + inv - (at(as.otherCosts, i) || 0);
    const tax = pbt * at(as.taxRate, i) / 100;
    const pat = pbt - tax;
    const eps = pat / b.shares;
    const dps = eps * (at(as.payout, i) || 0) / 100;
    const nwOpen = nw;
    nw += pat - dps * b.shares + (at(as.capitalRaise, i) || 0);
    aum = as.floatToNwp * nwp + nw;
    Object.entries({ gwp, nwp, nep, netClaims: claims, lossRatio: lr, expenseRatio: er, combinedRatio: lr + er, uwResult: uw, aum, investmentIncome: inv, pbt, tax, pat, eps, dps, netWorth: nw, dividends: dps * b.shares }).forEach(([k, v]) => F[k].push(v));
    F.bvps.push(nw / b.shares);
    F.roe.push(pat / ((nw + nwOpen) / 2) * 100);
    F.gwpGrowth.push(g);
    F.patGrowth.push((pat / prevPat - 1) * 100);
    F.epsGrowth.push((eps / prevEps - 1) * 100);
    prevPat = pat; prevEps = eps;
  }
  F.shares = b.shares;
  return F;
}

function pbRoe(F, as, price) {
  const v = as.valuation;
  const ke = v.rf + v.beta * v.erp;
  const roe = isNum(v.sustainableRoe) ? v.sustainableRoe : F.roe[F.roe.length - 1];
  const fair = (r, k, g) => (r - g) / (k - g);
  const k = F.years.indexOf(v.bookYear || F.years[1]);
  const book = F.bvps[k >= 0 ? k : 1];
  const pb = fair(roe, ke, v.g);
  // Value on the forward book, discounted back from the book date to the 12-month target date.
  const tp = Math.round(pb * book / Math.pow(1 + ke / 100, (v.discountMonths ?? 6) / 12) / 5) * 5;
  const sens = { waccs: [-1, -0.5, 0, 0.5, 1].map(x => ke + x), gs: [-3, -1.5, 0, 1.5, 3].map(x => roe + x), grid: [] };
  for (const kk of sens.waccs) sens.grid.push(sens.gs.map(r => Math.round(fair(r, kk, v.g) * book / Math.pow(1 + kk / 100, (v.discountMonths ?? 6) / 12) / 5) * 5));
  const ix = F.years.indexOf(v.peYear || F.years[1]);
  return { method: 'P/B–ROE', ke, wacc: ke, terminalGrowth: v.g, sustainableRoe: roe, justifiedPb: pb, bookYear: F.years[k >= 0 ? k : 1], book, tp, upside: (tp / price - 1) * 100, sens,
    sensRowLabel: 'Cost of equity', sensColLabel: 'Sustainable ROE', impliedPe: tp / F.eps[ix >= 0 ? ix : 1], impliedPeLabel: F.years[ix >= 0 ? ix : 1], impliedPb: tp / F.bvps[ix >= 0 ? ix : 1], currentPb: price / F.bvps[0] };
}

// Residual-income valuation (book value + present value of profits earned above the cost of equity).
// ROE fades from the last forecast year to a sustainable level; payout rises as growth matures.
// Valued at the end of the first forecast year, rolled forward to a 12-month target.
function residualIncome(F, as, price, override = {}) {
  const v = { ...as.valuation, ...override };
  const ke = isNum(v.ke) ? v.ke : v.rf + v.beta * v.erp;
  const n = F.years.length, years = v.years || 15, fade = v.fadeYears || 8;
  const roe0 = v.roePath ? v.roePath[n - 1] : F.roe[n - 1];
  // Optional Ind AS basis: book uplift (deferred acquisition costs etc.) and an explicit ROE path for forecast years.
  let book = F.bvps[0] + (v.bookUpliftPerShare || 0);
  const B0 = book;
  const rows = [];
  let pv = 0;
  for (let k = 1; k <= years; k++) {
    let roe;
    if (k < n) roe = v.roePath ? v.roePath[k] : F.roe[k];
    else { const s = Math.min(1, (k - n + 1) / fade); roe = roe0 + (v.sustainableRoe - roe0) * s; }
    const payout = k < n ? 0 : Math.min(v.payoutTo || 30, (v.payoutTo || 30) * (k - n + 1) / fade);
    const ri = (roe - ke) / 100 * book;
    const disc = 1 / Math.pow(1 + ke / 100, k);
    pv += ri * disc;
    rows.push({ year: `FY${String(+F.years[0].slice(2, 4) + k)}E`, roe, bookOpen: book, ri, disc, pv: ri * disc });
    book *= 1 + roe / 100 * (1 - payout / 100);
  }
  const last = rows[rows.length - 1];
  const tvRi = (v.sustainableRoe - ke) / 100 * book;
  const tv = tvRi * (1 + v.terminalGrowth / 100) / ((ke - v.terminalGrowth) / 100);
  const pvTv = tv / Math.pow(1 + ke / 100, years);
  const perShare = B0 + pv + pvTv;
  const tp = Math.round(perShare * Math.pow(1 + ke / 100, (v.rollForwardMonths ?? 6) / 12) / 5) * 5;
  return { ke, B0, pvRi: pv, pvTv, perShare, tp, rows, last };
}

function riValuation(F, as, price) {
  const v = as.valuation;
  const base = residualIncome(F, as, price);
  const ke = base.ke;
  const sens = { waccs: [-1, -0.5, 0, 0.5, 1].map(x => ke + x), gs: [-4, -2, 0, 2, 4].map(x => v.sustainableRoe + x), grid: [] };
  for (const k of sens.waccs) sens.grid.push(sens.gs.map(r => residualIncome(F, as, price, { ke: k, sustainableRoe: r }).tp));
  // Long-run ROE the market is implying at today's price (bisection on sustainable ROE).
  let lo = 0, hi = 60;
  for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (residualIncome(F, as, price, { sustainableRoe: mid, rollForwardMonths: 0 }).perShare < price) lo = mid; else hi = mid; }
  const ix = F.years.indexOf(v.peYear || F.years[1]);
  return { method: 'Residual income (P/B–ROE)', ke, wacc: ke, terminalGrowth: v.terminalGrowth, sustainableRoe: v.sustainableRoe, book: base.B0, bookYear: F.years[0],
    pvRi: base.pvRi, pvTv: base.pvTv, perShare: base.perShare, tp: base.tp, upside: (base.tp / price - 1) * 100, rows: base.rows, sens,
    impliedRoe: (lo + hi) / 2, justifiedPb: base.perShare / base.B0, currentPb: price / base.B0, basis: v.basis || "IGAAP",
    impliedPe: base.tp / F.eps[ix >= 0 ? ix : 1], impliedPeLabel: F.years[ix >= 0 ? ix : 1], impliedPb: base.tp / F.bvps[ix >= 0 ? ix : 1], tvShare: base.pvTv / (base.perShare - base.B0 || 1) * 100 };
}

function buildInsurerForecast(model, as) {
  const price = model.price?.last;
  const F = projectInsurer(as);
  const value = as.valuation?.method === 'residual-income' ? riValuation : pbRoe;
  const V = applyBlend(F, value(F, as, price), as, price);
  F.pe = F.eps.map(e => price / e);
  F.pb = F.bvps.map(x => price / x);
  const scen = {};
  for (const [name, s] of Object.entries(as.scenarios || {})) {
    const a2 = JSON.parse(JSON.stringify(as));
    if (s.gwpGrowthDelta) a2.gwpGrowth = a2.gwpGrowth.map(g => g + s.gwpGrowthDelta);
    if (s.combinedRatioDelta) a2.lossRatio = a2.lossRatio.map(l => l + s.combinedRatioDelta);
    if (s.yieldDelta) a2.investmentYield = a2.investmentYield.map(y => y + s.yieldDelta);
    if (isNum(s.sustainableRoe)) a2.valuation.sustainableRoe = s.sustainableRoe;
    const F2 = projectInsurer(a2), v2 = value(F2, a2, price), b2 = blend(F2, v2, a2, name);
    if (b2) { v2.tp = b2.tp; v2.upside = (b2.tp / price - 1) * 100; }
    scen[name] = { label: s.label, narrative: s.narrative, eps: F2.eps.map(r2), combinedRatio: F2.combinedRatio.map(r1), roe: F2.roe.map(r1), tp: v2.tp, upside: r1(v2.upside), blend: b2, pe: r1(v2.tp / F2.eps[1]), pb: r2(v2.justifiedPb) };
  }
  const round = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Array.isArray(v) ? v.map(x => (isNum(x) ? (Math.abs(x) >= 100 ? r0(x) : r2(x)) : x)) : v]));
  return { type: 'insurer', assumptions: as, F: round(F), dcf: V, scenarios: scen };
}

// Manual valuation (lean reports, e.g. loss-making platforms valued on sum-of-the-parts): estimates
// and target price are entered in assumptions.json; upside is recomputed from the live price.
function buildManualForecast(model, as) {
  const price = model.price?.last;
  const up = tp => (tp / price - 1) * 100;
  const scen = Object.fromEntries(Object.entries(as.scenarios || {}).map(([k, s]) => [k, { ...s, upside: r1(up(s.tp)) }]));
  return { type: 'manual', assumptions: as, F: as.F, dcf: { ...as.valuation, tp: as.valuation.tp, upside: up(as.valuation.tp) }, scenarios: scen };
}

// Sum-of-the-parts: each part = metric (a segment's forecast driver / EBITDA in a chosen year, or
// blended across two years with `roll`; `unalloc` = corporate costs not in any segment) ×
// multiple + adjustment (e.g. PV of losses still to come); plus net cash at the end of the first
// forecast year (or at the `year` / `roll` date given). Multiples/adjustments carry base/bull/bear values.
function sotp(F, as, price, kase = 'base') {
  const v = as.valuation;
  const yi = y => F.years.indexOf(y);
  const pick = (a, p) => (p.roll ? a[yi(p.roll[0])] * (1 - p.roll[2]) + a[yi(p.roll[1])] * p.roll[2] : a[Math.max(0, yi(p.year))]);
  const parts = v.parts.map(p => {
    let metric = null;
    if (p.seg) metric = pick(F.seg[p.seg][p.field], p);
    else if (p.unalloc) metric = pick(F.unalloc, p);
    const mult = p.multiple ? p.multiple[kase] ?? p.multiple.base : 0;
    const adj = p.adj ? p.adj[kase] ?? p.adj.base : 0;
    if (p.netCash) metric = p.roll || p.year ? pick(F.treasury, p) : F.treasury[0];
    const value = p.netCash ? metric : (metric || 0) * mult + adj;
    return { name: p.name, note: p.note, metric, mult, adj, value, perShare: value / F.shares };
  });
  const equity = parts.reduce((s, p) => s + p.value, 0);
  const tp = Math.round(equity / F.shares / (v.round || 5)) * (v.round || 5);
  return { method: 'Sum of the parts', tp, upside: (tp / price - 1) * 100, parts, equity, shares: F.shares, ke: v.ke, impliedPeLabel: F.years[1], impliedPe: null };
}

// Holistic valuation: the target price blends an intrinsic value (DCF or SOTP) with relative
// multiples (P/E, EV/EBITDA, P/B, EV/sales on a chosen forecast year), weighted per sector.
// Relative values: P/E and P/B = metric × multiple; EV multiples add that year's net cash.
function blend(F, V, as, kase = 'base') {
  const b = as.valuation?.blend; if (!b) return null;
  const methods = b.methods.map(m => {
    const mult = m.multiple ? (m.multiple[kase] ?? m.multiple.base) : null;
    let metric = null, value;
    if (m.method === 'dcf') value = V.perShare * Math.pow(1 + V.ke / 100, (as.dcf?.rollForwardMonths ?? 6) / 12);
    else if (m.method === 'sotp') value = (V.sotp || V).equity / F.shares;
    else if (m.method === 'ri') value = V.perShare * Math.pow(1 + V.ke / 100, (as.valuation?.rollForwardMonths ?? 6) / 12);
    else {
      const arr = { pe: F.eps, pb: F.bvps, evEbitda: F.ebitda, evSales: F.sales, evGov: F.gov }[m.method];
      // m.roll = [fromYear, toYear, weightOnTo] blends two forecast years (12-month-forward basis)
      const pick = a => (m.roll ? a[F.years.indexOf(m.roll[0])] * (1 - m.roll[2]) + a[F.years.indexOf(m.roll[1])] * m.roll[2] : a[Math.max(0, F.years.indexOf(m.year))]);
      metric = pick(arr);
      value = m.method.startsWith('ev') ? (metric * mult + pick(F.treasury)) / F.shares : metric * mult;
    }
    return { key: m.key || m.method, name: m.name, method: m.method, year: m.year, role: m.role, metric, mult, value, weight: m.weight, why: m.why, multiple: m.multiple };
  });
  const r = b.round || 10;
  const prim = methods.find(m => m.role === 'primary');
  if (prim) { // target = the method the street prices the stock on; the rest are cross-checks
    methods.forEach(m => (m.vsTarget = (m.value / prim.value - 1) * 100));
    return { methods, primary: prim, value: prim.value, tp: Math.round(prim.value / r) * r, label: prim.year ? `${prim.name} on ${prim.year}${prim.mult != null ? ` (${prim.mult}x)` : ''}` : prim.name };
  }
  const wsum = methods.reduce((s, m) => s + m.weight, 0);
  const value = methods.reduce((s, m) => s + m.value * m.weight, 0) / wsum;
  return { methods, value, tp: Math.round(value / r) * r, label: methods.map(m => `${m.name} ${Math.round(m.weight / wsum * 100)}%`).join(' · ') };
}
const applyBlend = (F, V, as, price) => {
  const B = blend(F, V, as); if (!B) return V;
  return { ...V, intrinsicTp: V.tp, intrinsicMethod: V.method || 'DCF', tp: B.tp, upside: (B.tp / price - 1) * 100, blend: B, method: B.label, impliedPe: B.tp / F.eps[1], impliedPeLabel: F.years[1] };
};

function buildForecast(model, as) {
  if (as.type === 'lender') return require('./forecast-lender').buildLenderForecast(model, as, { residualIncome }); // NBFCs/banks: src/forecast-lender.js
  if (as.type === 'manual') return buildManualForecast(model, as);
  if (as.valuation?.method === 'sotp') {
    const A = model.annual, price = model.price?.last;
    const F = project(A, as);
    // With a DCF block the DCF is computed too (a cross-check); the SOTP sits under V.sotp.
    const withDcf = (F1, a1, S) => (a1.dcf ? { ...dcf(A, F1, a1, price), sotp: S } : S);
    const V = applyBlend(F, withDcf(F, as, sotp(F, as, price)), as, price);
    const scen = {};
    for (const [name, s] of Object.entries(as.scenarios || {})) {
      const a2 = JSON.parse(JSON.stringify(as));
      if (s.fadeMarginTo && a2.dcf) a2.dcf.fadeMarginTo = s.fadeMarginTo;
      for (const seg of a2.segments || []) {
        const d = s.segments?.[seg.key]; if (!d) continue;
        if (d.growthDelta) seg.growth = seg.growth.map(g => g + d.growthDelta);
        if (d.marginDelta) seg.marginPct = seg.marginPct.map(m => m + d.marginDelta);
      }
      const F2 = project(A, a2), v2 = sotp(F2, a2, price, name), w2 = withDcf(F2, a2, v2), b2 = blend(F2, w2, a2, name);
      if (b2) { v2.tp = b2.tp; v2.upside = (b2.tp / price - 1) * 100; v2.blend = b2; }
      scen[name] = { label: s.label, narrative: s.narrative, tp: v2.tp, blend: v2.blend, upside: r1(v2.upside), eps: F2.eps.map(r2), ebitdaMargin: F2.ebitdaMargin.map(r1), ...(a2.dcf ? { dcfTp: w2.tp, pe: r1(v2.tp / F2.eps[1]) } : {}) };
    }
    const mcap = price * F.shares;
    F.pe = F.eps.map(e => price / e); F.pb = F.bvps.map(b => price / b); F.evSales = F.sales.map((x, i) => (mcap - F.treasury[i]) / x);
    F.evEbitda = F.ebitda.map((e, i) => (mcap - F.treasury[i]) / e);
    F.divYield = F.dps.map(d => d / price * 100); F.fcfYield = F.fcf.map(f => f / mcap * 100);
    return { assumptions: as, F, dcf: V, scenarios: scen };
  }
  if (as.type === 'insurer') return buildInsurerForecast(model, as);
  const A = model.annual, price = model.price?.last;
  const F = project(A, as);
  const V = applyBlend(F, dcf(A, F, as, price), as, price);
  const mcap = price * F.shares;
  F.pe = F.eps.map(e => price / e);
  F.evEbitda = F.ebitda.map((e, i) => (mcap - F.treasury[i]) / e);
  F.pb = F.bvps.map(b => price / b);
  F.divYield = F.dps.map(d => d / price * 100);
  F.fcfYield = F.fcf.map(f => f / mcap * 100);
  const round = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Array.isArray(v) ? v.map(x => (isNum(x) ? (Math.abs(x) >= 100 ? r0(x) : r2(x)) : x)) : v]));
  return { assumptions: as, F: round(F), dcf: V, scenarios: scenarios(A, as, price) };
}

module.exports = { buildForecast };
