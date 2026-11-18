// Data-driven commentary: plain-English observations computed from the model, per chapter.
// Works for any company with no research input; the hand-written / Claude-generated story
// (research/story.json) sits alongside these, it doesn't replace them.
const isNum = v => typeof v === 'number' && Number.isFinite(v);
const f0 = v => (isNum(v) ? Math.round(v).toLocaleString('en-IN') : '–');
const f1 = v => (isNum(v) ? (Math.round(v * 10) / 10).toFixed(1) : '–');
const cr = v => (isNum(v) ? `₹${f0(v)} cr` : '–');
const lastIdx = arr => { for (let i = arr.length - 1; i >= 0; i--) if (isNum(arr[i])) return i; return -1; };
const range = arr => { const v = arr.filter(isNum); return v.length ? [Math.min(...v), Math.max(...v)] : [null, null]; };
const argmax = (arr, labels) => { let b = -1; arr.forEach((v, i) => { if (isNum(v) && (b < 0 || v > arr[b])) b = i; }); return labels[b]; };
const argmin = (arr, labels) => { let b = -1; arr.forEach((v, i) => { if (isNum(v) && (b < 0 || v < arr[b])) b = i; }); return labels[b]; };

function businessType(m) {
  const p = (m.meta.sectorPath || []).join(' ').toLowerCase();
  if (m.forecast?.type === 'insurer' || /insurance/.test(p)) return 'insurer';
  if (m.research?.assumptions?.type === 'lender') return 'lender';
  if (/bank|finance|nbfc|lending|housing finance/.test(p)) return 'lender';
  return 'operating';
}

function buildInsights(m) {
  const kind = businessType(m);
  const fin = kind !== 'operating';
  const A = m.annual, Q = m.quarterly, V = m.valuation, P = m.price;
  const L = A.labels, n = lastIdx(A.sales), first = L[0], lastL = L[n];
  const out = {};
  const add = (ch, tone, text) => (out[ch] ||= []).push({ tone, text });

  // ---- growth ----
  const c = A.cagr;
  if (isNum(c.sales['10y'])) add('growth', c.sales['10y'] >= 12 ? 'pos' : 'neu', `Revenue compounded at ${f1(c.sales['10y'])}% a year over 10 years (5y: ${f1(c.sales['5y'])}%, 3y: ${f1(c.sales['3y'])}%), from ${cr(A.sales[n - 10])} to ${cr(A.sales[n])}.`);
  if (isNum(c.pat['10y']) && isNum(c.sales['10y'])) {
    const gap = c.pat['10y'] - c.sales['10y'];
    add('growth', gap > 1 ? 'pos' : gap < -1 ? 'neg' : 'neu', `Profit grew ${f1(c.pat['10y'])}% a year over the same decade — ${gap > 1 ? 'faster than revenue, i.e. operating leverage' : gap < -1 ? 'slower than revenue, i.e. margins leaked' : 'in line with revenue, i.e. flat margins'}.`);
  }
  const worstPat = argmin(A.patGrowth, L), bestPat = argmax(A.patGrowth, L);
  if (worstPat && A.patGrowth[L.indexOf(worstPat)] < 0) add('growth', 'neu', `Worst profit year: ${worstPat} (${f1(A.patGrowth[L.indexOf(worstPat)])}%); best: ${bestPat} (+${f1(A.patGrowth[L.indexOf(bestPat)])}%).`);
  if (Q) {
    const qi = lastIdx(Q.sales);
    if (qi >= 0 && isNum(Q.salesYoY[qi])) {
      const tone = Q.salesYoY[qi] > 0 && Q.patYoY[qi] < 0 ? 'neg' : Q.salesYoY[qi] > 0 ? 'pos' : 'neg';
      add('growth', tone, `Latest quarter ${Q.labels[qi]}: revenue ${Q.salesYoY[qi] >= 0 ? '+' : ''}${f1(Q.salesYoY[qi])}% YoY, profit ${Q.patYoY[qi] >= 0 ? '+' : ''}${f1(Q.patYoY[qi])}% YoY${tone === 'neg' && Q.salesYoY[qi] > 0 ? ' — growth is not reaching the bottom line' : ''}.`);
    }
  }

  // ---- margins ----
  if (!fin) {
  const [oLo, oHi] = range(A.ebitdaMargin);
  if (isNum(A.ebitdaMargin[n])) add('margins', 'neu', `EBITDA margin has ranged ${f1(oLo)}%–${f1(oHi)}% since ${first} (peak ${argmax(A.ebitdaMargin, L)}, trough ${argmin(A.ebitdaMargin, L)}); ${lastL} was ${f1(A.ebitdaMargin[n])}%.`);
  if (m.longQuarterly?.length > 8) {
    const lq = m.longQuarterly, cur = lq[lq.length - 1], opms = lq.map(r => r.opm).filter(isNum);
    const below = opms.filter(v => v < cur.opm).length / opms.length * 100;
    add('margins', below < 25 ? 'neg' : below > 75 ? 'pos' : 'neu', `${cur.label} operating margin of ${f1(cur.opm)}% is lower than ${f1(100 - below)}% of the ${opms.length} quarters on record — ${below < 25 ? 'near the bottom of its history' : below > 75 ? 'near the top of its history' : 'mid-range for the company'}.`);
  }
  if (isNum(A.materialPct[n]) && isNum(A.materialPct[n - 1]) && A.materialPct[n] !== A.materialPct[n - 1]) {
    const d = A.materialPct[n] - A.materialPct[n - 1];
    add('margins', d > 0 ? 'neg' : 'pos', `Raw-material cost moved from ${A.materialPct[n - 1]}% to ${A.materialPct[n]}% of sales in ${lastL} (${d > 0 ? '+' : ''}${d} pts) — the single biggest swing factor in the cost base.`);
  }
  if (isNum(A.otherIncomeShare[n]) && A.otherIncomeShare[n] > 15) add('margins', 'neu', `Other income (largely treasury yield on the cash pile) made up ${f1(A.otherIncomeShare[n])}% of pre-tax profit in ${lastL}; reported profit flatters core operations.`);

  }
  // ---- returns ----
  if (isNum(A.roe[n])) {
    const [lo, hi] = range(A.roe);
    add('returns', A.roe[n] >= 15 ? 'pos' : A.roe[n] < 10 ? 'neg' : 'neu', `ROE was ${f1(A.roe[n])}% in ${lastL} (range ${f1(lo)}–${f1(hi)}% since ${first}).`);
  }
  if (!fin && isNum(A.coreRoce[n]) && isNum(A.roce[n])) add('returns', A.coreRoce[n] > A.roce[n] ? 'pos' : 'neu', `Stripping out cash and investments, return on operating capital was ${f1(A.coreRoce[n])}% vs headline ROCE of ${f1(A.roce[n])}% — ${A.coreRoce[n] > A.roce[n] + 5 ? 'the idle cash is diluting reported returns' : 'little distortion from the treasury book'}.`);
  if (!fin && isNum(A.leverage[n])) add('returns', 'neu', `DuPont ${lastL}: net margin ${f1(A.npm[n])}% × asset turnover ${f1(A.assetTurnover[n])}x × leverage ${f1(A.leverage[n])}x.`);

  // ---- balance sheet & cash ----
  if (fin) {
    if (kind === 'insurer' && isNum(A.investments[n])) add('balance', 'neu', `Investments of ${cr(A.investments[n])} are mostly policyholders' money (premiums held to pay future claims), not surplus cash; shareholders' net worth is ${cr(A.netWorth[n])}.`);
    const LND = kind === 'lender' && m.research?.assumptions?.type === 'lender', debt = (A.borrowings[n] || 0) + (A.deposits?.[n] || 0); // lender model: funding and leverage
    if (LND && debt > 0 && A.netWorth[n] > 0) add('balance', 'neu', `Borrowings${A.deposits?.[n] ? ' and deposits' : ''} of ${cr(debt)} fund the loan book, ${f1(debt / A.netWorth[n])}x net worth. Total assets are ${f1(A.totalAssets[n] / A.netWorth[n])}x equity, so losing 1% of assets would cost about ${f1(A.totalAssets[n] / A.netWorth[n])}% of equity.`);
    if (LND && isNum(A.roa[n]) && isNum(A.roe[n])) add('returns', A.roa[n] >= 2 ? 'pos' : A.roa[n] < 1 ? 'neg' : 'neu', `Return on assets was ${f1(A.roa[n])}% in ${lastL}; with assets at ${f1(A.leverage[n])}x equity that gives the ${f1(A.roe[n])}% ROE (ROA × leverage).`);
    if (!LND && isNum(A.otherIncome[n]) && isNum(A.pbt[n]) && A.pbt[n] > 0) add('balance', 'neu', `Investment and other income was ${f1((A.otherIncome[n] / A.pbt[n]) * 100)}% of pre-tax profit in ${lastL}.`);
  } else {
  if (isNum(A.netDebt[n])) add('balance', A.netDebt[n] < 0 ? 'pos' : A.debtEquity[n] > 1 ? 'neg' : 'neu', A.netDebt[n] < 0 ? `Net cash of ${cr(-A.netDebt[n])} (cash + investments less borrowings), ${f1((-A.netDebt[n] / A.netWorth[n]) * 100)}% of net worth.` : `Net debt of ${cr(A.netDebt[n])}; debt/equity ${f1(A.debtEquity[n])}x.`);
  const cum = A.cumulative;
  if (cum.cfo) add('cash', cum.cfo / cum.pat > 1 ? 'pos' : 'neg', `Over ${cum.years} years the business generated ${cr(cum.cfo)} of operating cash flow (${f1((cum.cfo / cum.pat) * 100)}% of reported profit), spent ${cr(cum.capex)} on capex and paid ${cr(cum.dividends)} in dividends.`);
  if (isNum(A.capexToDep[n])) add('cash', 'neu', `${lastL} capex was ${f1(A.capexToDep[n])}x depreciation and ${f1(A.capexToSales[n])}% of sales — ${A.capexToDep[n] > 1.5 ? 'an expansion phase' : 'maintenance-level spending'}.`);
  if (isNum(A.ccc[n])) add('cash', A.ccc[n] < 0 ? 'pos' : 'neu', `Cash conversion cycle of ${A.ccc[n]} days in ${lastL}${A.ccc[n] < 0 ? ' — suppliers fund the working capital' : ''}.`);

  }
  // ---- valuation ----
  const span = V.pe?.series?.length ? (new Date(V.pe.series[V.pe.series.length - 1][0]) - new Date(V.pe.series[0][0])) / (365.25 * 864e5) : 0;
  const hist = span >= 9.5 ? '10-year' : `since-listing (${f1(span)}-year)`;
  const val = (key, name) => {
    const v = V[key]; const w = v?.windows?.['10y'];
    if (!w) return;
    const tone = w.percentile < 25 ? 'pos' : w.percentile > 75 ? 'neg' : 'neu';
    add('valuation', tone, `${name} of ${f1(v.current)}x vs ${hist} median ${f1(w.median)}x (range ${f1(w.min)}–${f1(w.max)}x); cheaper than ${f1(100 - w.percentile)}% of that period${span < 5 ? ' (short history: treat with caution)' : ''}.`);
  };
  val('pe', 'P/E'); if (!fin) val('evEbitda', 'EV/EBITDA'); val('pb', 'P/B');
  if (V.pe?.impliedPriceAtMedian && P) add('valuation', 'neu', `At its ${hist} median P/E on current earnings, the stock would be ~₹${f0(V.pe.impliedPriceAtMedian)} vs ₹${f0(P.last)} today (${f1((V.pe.impliedPriceAtMedian / P.last - 1) * 100)}%).`);

  // ---- price ----
  if (P) {
    add('price', P.returns['1y'] < 0 ? 'neg' : 'pos', `Stock ${P.returns['1y'] >= 0 ? 'up' : 'down'} ${f1(Math.abs(P.returns['1y']))}% over 1 year; ${isNum(P.returns['5y']) ? `5y CAGR ${f1(P.returns['5y'])}%, ` : ''}${isNum(P.returns['10y']) ? `10y CAGR ${f1(P.returns['10y'])}%.` : ''} Currently ${f1(Math.abs(P.currentDrawdown))}% below its all-time high of ₹${f0(P.allTimeHigh)}.`);
    const R = P.relative;
    if (R?.index1y != null) add('price', R.stock1y > R.index1y ? 'pos' : 'neg', `Versus BSE-500: ${f1(R.stock1y)}% vs ${f1(R.index1y)}% over 1 year; since ${R.start.slice(0, 4)}, ${f1(R.stockCagr)}% vs ${f1(R.indexCagr)}% a year.`);
  }

  // ---- ownership ----
  const sh = m.shareholding;
  if (sh) {
    const row = k => sh.rows[k] || [];
    for (const [k, name] of [['FIIs', 'Foreign institutions'], ['DIIs', 'Domestic institutions'], ['Promoters', 'Promoters']]) {
      const r = row(k); const a = r.find(isNum), b = r[lastIdx(r)];
      if (isNum(a) && isNum(b) && Math.abs(b - a) >= 0.5) add('ownership', 'neu', `${name} ${b > a ? 'raised' : 'cut'} their stake from ${f1(a)}% to ${f1(b)}% over ${r.length} quarters.`);
    }
  }
  return out;
}

module.exports = { buildInsights };
