// GABRIEL: data corrections applied in memory by src/model.js on every build (patchRaw; idempotent). Never edit screener.json.
// 1. FY26 on the post-scheme basis ("Project Rise"). The composite scheme (Anchemco merged into Asia Investments, AIPL's
//    automotive undertaking demerged into Gabriel: Anchemco fluids, 76% of Anand CY Myutec, 25.1% of Dana Anand, 49% of
//    Henkel Anand; NCLT 11-May-2026, effective 22-May-2026) was accounted for by pooling of interests, and the Q1FY27
//    results (21-Jul-2026) restated FY26: revenue Rs5,245.19 cr (reported Rs4,666.9 cr), PAT to shareholders Rs430.57 cr
//    (Rs252 cr), EPS Rs24.29 (Rs17.55). Screener's annual FY26 column is still the as-reported one, so we put in the
//    restated figures (consolidated results statement, Rs mn / 10). Other income = other income Rs28.62 cr + share of
//    equity-accounted investees Rs157.63 cr - exceptional (labour codes) Rs15.25 cr, Screener's convention.
// 2. Share count. 3,35,86,083 shares were allotted to AIPL's shareholders under the scheme (9-Jun-2026; 17,72,30,023
//    after) and 1,44,04,204 to AIPL at Rs1,305.89 for 28.99% of HL Mando Anand ("Project Jupiter", 11-Sep-2026): 19,16,34,227
//    shares on 30-Sep-2026. The engine fixes shares at FY26 profit / EPS, so FY26 EPS is put on 19.1634 cr shares
//    (Rs22.47); every forecast EPS and the target are on today's share count.
// 3. Quarters. Screener mixes bases: Q1FY26 and Q4FY26 are restated (from the Q1FY27 filing), Q2/Q3FY26 are as reported.
//    Restated Q2+Q3 = restated FY26 less restated Q1 and Q4 (exact as a half-year); we split it between the two quarters
//    in proportion to the reported figures (share of JV profit and other income evenly; the labour-code charge in Q3).
//    FY26 quarterly EPS on the 17.72 cr post-scheme shares, as the company restated them (Q1FY26 Rs5.94, Q4FY26 Rs6.67).
// 4. FY19-FY23 history from the standalone accounts (Screener shows consolidated accounts only from FY24, when the
//    sunroof subsidiary started; before that the standalone company was the group). FY24-FY25 stay as reported
//    (pre-scheme, not restated): growth from FY25 to FY26 mixes bases (flagged in the report).
// 5. Mar-26 balance sheet pro forma for the scheme and Project Jupiter (BOSCHLTD / CRAFTSMAN precedent). Scheme: restated
//    consolidated reserves Rs1,935.49 cr (Q1FY27 results); Dana / Henkel stakes at their share of Mar-26 net worth
//    (25.1% x Rs1,125 cr + 49% x Rs229 cr = Rs394.6 cr, Q1FY27 deck); Anchemco's debt Rs84.4 cr (Jun-26) and ACYM's
//    Rs43 cr; ACYM minorities 24% x Rs75 cr; the remaining operating assets of Anchemco and ACYM as the balancing item
//    (GAM estimate; the restated Mar-26 balance sheet was not published by 30-Sep-2026). Jupiter: HL Mando Anand at the Rs2,231 cr price (shares Rs1,881.03 cr + cash Rs350 cr), HL Klemove
//    at US$98.44 mn = Rs948 cr (Rs711 cr paid at closing, Rs237 cr deferred, held as debt), Rs1,000 cr of 8.15% NCDs
//    (10-Sep-2026). Only the tables change (see step 5 below): the engine's "treasury" = net cash + the stakes.
const fs = require('fs');
const path = require('path');
const SH = { preScheme: 14.364394, postScheme: 17.7230023, now: 19.1634227 }; // crore shares
const R = { sales: 5245.194, exp: 4743.089, oi: 28.623, jv: 157.633, exc: 15.25, int: 26.351, dep: 123.579, pbt: 523.181, tax: 91.045, pat: 430.573, eps: 24.29, payout: 21 };
const Q1r = { sales: 1234.357, exp: 1116.129, oi: 4.463, jv: 38.72, exc: 0, int: 4.979, dep: 30.655, pbt: 125.777, pat: 105.256, eps: 5.94 };
const Q4r = { sales: 1380.788, exp: 1247.575, oi: 10.406, jv: 43.903, exc: 1.083, int: 8.428, dep: 30.585, pbt: 147.426, pat: 118.252, eps: 6.67 };
const PF = { reserves26: 1935.489, jvBook: 0.251 * 1125 + 0.49 * 229, debtRise: 84.4 + 43, nciRise: 0.24 * 75, fixedRise: 100, grossRise: 130,
  hmai: 2231, hmaiShares: 1881.03, hmaiCash: 350, klemove: 948, klemovePaid: 711, klemoveDeferred: 237, ncd: 1000 };
const STANDALONE_YEARS = ['Mar 2019', 'Mar 2020', 'Mar 2021', 'Mar 2022', 'Mar 2023'];
const r2 = v => Math.round(v * 100) / 100;

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'FY26 restated for the scheme (Q1FY27 results); FY26 EPS on 19.1634 cr shares (post-scheme and post-Jupiter); Q2/Q3FY26 restated by allocation; FY19-23 standalone; Mar-26 balance sheet pro forma for the scheme and Project Jupiter. Originals below.', fetchedAt: S.fetchedAt, pf: PF, shares: SH, original: {} };
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  keep.original.fy26 = Object.fromEntries(Object.entries(pl.rows).map(([k, v]) => [k, v[j]]));
  const set = (T, k, idx, v) => { if (T.rows[k]) T.rows[k][idx] = v; };
  const op = R.sales - R.exp, oiAll = R.oi + R.jv - R.exc;
  Object.entries({ Sales: R.sales, Expenses: R.exp, 'Operating Profit': op, 'OPM %': Math.round(op / R.sales * 100), 'Other Income': oiAll, Interest: R.int, Depreciation: R.dep,
    'Profit before tax': R.pbt, 'Tax %': Math.round((R.pbt - R.pat) / R.pbt * 100), 'Net Profit': R.pat, 'EPS in Rs': Math.round(R.pat / SH.now * 1e4) / 1e4, 'Dividend Payout %': R.payout }).forEach(([k, v]) => set(pl, k, j, k === 'EPS in Rs' ? v : r2(v)));
  const sch = S.schedules['profit-loss'];
  sch['Other Income']['Other income normal']['Mar 2026'] = r2(R.oi + R.jv); sch['Other Income']['Exceptional items']['Mar 2026'] = -R.exc;
  ['Profit excl Excep', 'Profit for PE'].forEach(k => (sch['Net Profit'][k]['Mar 2026'] = r2(R.pat + R.exc * 0.75)));
  sch['Net Profit']['Profit for EPS']['Mar 2026'] = R.pat; sch['Net Profit']['Exceptional items AT']['Mar 2026'] = r2(-R.exc * 0.75);

  // 3) quarters
  const Q = S.tables.quarters, qi = p => Q.periods.indexOf(p), qr = (k, p) => Q.rows[k][qi(p)];
  keep.original.quarters = Object.fromEntries(['Jun 2025', 'Sep 2025', 'Dec 2025', 'Mar 2026'].map(p => [p, Object.fromEntries(Object.keys(Q.rows).map(k => [k, qr(k, p)]))]));
  const resid = k => R[k] - Q1r[k] - Q4r[k];
  const s2 = qr('Sales', 'Sep 2025'), s3 = qr('Sales', 'Dec 2025'), o2 = qr('Operating Profit', 'Sep 2025'), o3 = qr('Operating Profit', 'Dec 2025');
  const opRes = resid('sales') - resid('exp');
  const mk = (sales, opq, oi, exc, int, dep) => ({ sales, op: opq, oi: oi - exc, int, dep, pbt: opq + oi - exc - int - dep });
  const q2 = mk(resid('sales') * s2 / (s2 + s3), opRes * o2 / (o2 + o3), (resid('oi') + resid('jv')) / 2, 0, resid('int') / 2, resid('dep') / 2);
  const q3 = mk(resid('sales') * s3 / (s2 + s3), opRes * o3 / (o2 + o3), (resid('oi') + resid('jv')) / 2, resid('exc'), resid('int') / 2, resid('dep') / 2);
  const leak = (q2.pbt + q3.pbt) - resid('pat');
  q2.pat = q2.pbt - leak * q2.pbt / (q2.pbt + q3.pbt); q3.pat = q3.pbt - leak * q3.pbt / (q2.pbt + q3.pbt);
  const putQ = (p, q, eps) => { const i = qi(p); Object.entries({ Sales: q.sales, Expenses: q.sales - q.op, 'Operating Profit': q.op, 'OPM %': Math.round(q.op / q.sales * 100), 'Other Income': q.oi, Interest: q.int, Depreciation: q.dep,
    'Profit before tax': q.pbt, 'Tax %': Math.round((q.pbt - q.pat) / q.pbt * 100), 'Net Profit': q.pat, 'EPS in Rs': eps }).forEach(([k, v]) => { if (Q.rows[k]) Q.rows[k][i] = r2(v); }); };
  putQ('Sep 2025', q2, q2.pat / SH.postScheme); putQ('Dec 2025', q3, q3.pat / SH.postScheme);
  Q.rows['EPS in Rs'][qi('Jun 2025')] = Q1r.eps; Q.rows['EPS in Rs'][qi('Mar 2026')] = Q4r.eps;
  const qs = S.schedules.quarters;
  for (const [p, q] of [['Sep 2025', q2], ['Dec 2025', q3]]) {
    qs['Other Income']['Other income normal'][p] = r2(p === 'Dec 2025' ? q.oi + resid('exc') : q.oi); qs['Other Income']['Exceptional items'][p] = p === 'Dec 2025' ? -r2(resid('exc')) : 0;
    ['Profit excl Excep', 'Profit for PE', 'Profit for EPS'].forEach(k => (qs['Net Profit'][k][p] = r2(q.pat)));
  }
  keep.q2q3 = { q2, q3 };
  // TTM column = the four quarters to Jun-2026 on the patched basis; EPS on today's shares
  const t = pl.periods.indexOf('TTM'), last4 = ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026'].map(qi);
  if (t >= 0) { for (const k of ['Sales', 'Expenses', 'Operating Profit', 'Other Income', 'Interest', 'Depreciation', 'Profit before tax', 'Net Profit']) pl.rows[k][t] = r2(last4.reduce((s, i) => s + Q.rows[k][i], 0));
    pl.rows['EPS in Rs'][t] = r2(pl.rows['Net Profit'][t] / SH.now); pl.rows['OPM %'][t] = Math.round(pl.rows['Operating Profit'][t] / pl.rows.Sales[t] * 100); }

  // 4) FY19-FY23 from the standalone accounts
  const STD = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'GABRIEL', 'research', 'screener-standalone.json'), 'utf8'));
  for (const tab of ['profit-loss', 'balance-sheet', 'cash-flow', 'ratios']) {
    const T = S.tables[tab], U = STD.tables[tab]; if (!T || !U || T.periods.includes('Mar 2023')) continue;
    const idx = STANDALONE_YEARS.map(p => U.periods.indexOf(p));
    T.periods = [...STANDALONE_YEARS, ...T.periods];
    for (const k of Object.keys(T.rows)) T.rows[k] = [...idx.map(i => (U.rows[k] && i >= 0 ? U.rows[k][i] : null)), ...T.rows[k]];
    for (const [par, items] of Object.entries(STD.schedules[tab] || {})) for (const [item, vals] of Object.entries(items || {})) {
      const tgt = S.schedules[tab]?.[par]?.[item]; if (!tgt || typeof vals !== 'object') continue;
      STANDALONE_YEARS.forEach(p => { if (vals[p] != null && tgt[p] == null) tgt[p] = vals[p]; });
    }
  }
  keep.standaloneYears = STANDALONE_YEARS;

  // 5) Mar-26 balance sheet pro forma (tables and the matching schedules)
  const bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026'), B = n => bs.rows[n][k], bsch = S.schedules['balance-sheet'];
  keep.original.bsMar26 = Object.fromEntries(Object.keys(bs.rows).map(n => [n, B(n)]));
  const eqCap = SH.now, reserves = PF.reserves26 + PF.hmaiShares - (SH.now - SH.preScheme);
  const debtAdd = PF.debtRise + PF.ncd + PF.klemoveDeferred, cashAdd = PF.ncd - PF.hmaiCash - PF.klemovePaid;
  const invAdd = PF.jvBook + PF.hmai + PF.klemove;
  // Tables only (BOSCHLTD precedent): src/excel.js reads the unpatched Screener schedules (borrowings, gross block, cash,
  // working-capital items), so borrowings, fixed assets, other assets and other liabilities stay as reported and the
  // whole change in equity is booked against Investments: it holds the stakes (~Rs3,694 cr incl. Mar-26 investments)
  // less the new debt (Rs1,364 cr), less the Rs61 cr of cash spent, plus the scheme's other net operating assets
  // (~Rs313 cr, GAM estimate). Engine and Excel then agree; the display pro forma is in PFBS below.
  const liabTotal = eqCap + reserves + B('Borrowings') + B('Other Liabilities');
  const invNew = liabTotal - B('Fixed Assets') - B('CWIP') - B('Other Assets');
  Object.entries({ 'Equity Capital': eqCap, Reserves: reserves, 'Total Liabilities': liabTotal, Investments: invNew, 'Total Assets': liabTotal }).forEach(([n, v]) => (bs.rows[n][k] = r2(v)));
  keep.bsDelta = { eqCap, reserves, debtAdd, cashAdd, invAdd, invNew: r2(invNew), riseOpAssets: r2(invNew - (keep.original.bsMar26.Investments + invAdd - debtAdd + cashAdd - PF.nciRise)) };
  // Market value on today's share count (Screener's top ratios still imply the 17.72 cr post-scheme shares)
  const num = s => Number(String(s).replace(/[^0-9.]/g, ''));
  if (S.topRatios?.['Current Price']) { keep.original.marketCap = S.topRatios['Market Cap']; S.topRatios['Market Cap'] = `₹ ${Math.round(num(S.topRatios['Current Price']) * SH.now).toLocaleString('en-IN')} Cr.`; }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SH, R, Q1r, Q4r, PF };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'GABRIEL', 'screener.json'), 'utf8')));
  const pl = S.tables['profit-loss'], q = S.tables.quarters, bs = S.tables['balance-sheet'];
  console.log(pl.periods.join(' | ')); for (const r of ['Sales', 'Operating Profit', 'Other Income', 'Profit before tax', 'Net Profit', 'EPS in Rs']) console.log(r, pl.rows[r].join(' | '));
  console.log(q.periods.slice(-6).join(' | ')); for (const r of ['Sales', 'Operating Profit', 'Other Income', 'Net Profit', 'EPS in Rs']) console.log(r, q.rows[r].slice(-6).join(' | '));
  console.log(bs.periods.join(' | ')); for (const r of Object.keys(bs.rows)) console.log(r, bs.rows[r].join(' | '));
  console.log(JSON.stringify(S._gamPatch.bsDelta), JSON.stringify(S._gamPatch.q2q3));
}
