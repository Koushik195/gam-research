// M&M (standalone basis): put Screener's standalone P&L on a "core auto + farm" footing. Applied in memory by
// src/model.js on every build (this file never rewrites screener.json; a fresh fetch cannot undo it).
//
// 1. Investment income out of revenue. From FY23 M&M reports "Income from investments related to subsidiaries,
//    associates and joint ventures" (dividends from Tech Mahindra, M&M Finance and others, interest on loans to
//    group companies, profit on selling stakes) inside "Total income from operations", and Screener's "Sales"
//    includes it. Before FY23 the same income sat in other income. We move it back to other income, so revenue =
//    revenue from operations (vehicles, tractors, spares, services) and EBITDA = operating profit of the auto and farm
//    businesses only. PBT and PAT do not change.
//    Annual (AR FY24 note 26 and segment note 44; AR FY26 note 25 and note 44): FY23 1,684.37; FY24 2,456.00;
//    FY25 2,140.85; FY26 2,189.58 (₹ cr).
//    Quarterly (Screener sales less reported standalone revenue from operations): Sep-23 25,762 − 24,394.79 (Q2FY25
//    results, Upstox 7-Nov-2024); Dec-23 25,737 − 25,288.51 (Business Standard 14-Feb-2024); Mar-24 25,434 − 25,108.97
//    (Business Standard 16-May-2024); Jun-24 27,133 − 27,038.79 and Sep-24 28,919 − 27,553.26 and Dec-24 30,964 −
//    30,538.23 and Mar-25 31,609 − 31,353.40 (Q3FY26 results PDF: Q3FY25 and 9MFY25 columns; Upstox 7-Nov-2024; AR FY26);
//    Jun-25 34,143 − 34,083.23, Sep-25 35,080 − 33,421.60, Dec-25 38,942 − 38,516.81, Mar-26 39,601 − 39,554.13
//    (Q3FY26 results PDF; AR FY26 revenue from operations 1,45,575.77); Jun-26 41,959 − 41,920 (Q1FY27 results as
//    reported by the press, 30-Jul-2026).
// 2. "Loss from investments related to subsidiaries, associates and joint ventures" (write-downs of group companies:
//    FY23 63, FY24 253, FY25 847.91, FY26 677.31; AR FY26 ten-year summary and note 32) sits in Screener's annual
//    expenses. We move it out of expenses and treat it as an exceptional item inside other income (no tax shield:
//    impairment of investments in subsidiaries is a capital loss). Screener's quarterly data already shows these
//    losses as exceptional items, so quarters need no change for this.
// Cost ratios (material, employee, other % of revenue) are recomputed on the new revenue: annual FY23-FY26 from the
// AR ten-year summary (materials, employee benefits, other expenses), quarters by rescaling Screener's ratios.
// Originals are kept under _gamPatch. Idempotent. Check: node "tools/authoring/M&M.patch.js"
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'M&M', 'screener.json');

const ANNUAL = { // Δ = investment income moved out of sales; L = loss from investments moved out of expenses; costs from AR
  'Mar 2023': { d: 1684.37, l: 63, mat: 64558, emp: 3650, oth: 6310 },
  'Mar 2024': { d: 2456.00, l: 253, mat: 73995, emp: 4463, oth: 7494 },
  'Mar 2025': { d: 2140.85, l: 847.91, mat: 86340, emp: 4881, oth: 8140 },
  'Mar 2026': { d: 2189.58, l: 677.31, mat: 110766, emp: 5290, oth: 8542 },
};
const QUARTER = { 'Sep 2023': 25762 - 24394.79, 'Dec 2023': 25737 - 25288.51, 'Mar 2024': 25434 - 25108.97, 'Jun 2024': 27133 - 27038.79,
  'Sep 2024': 28919 - 27553.26, 'Dec 2024': 30964 - 30538.23, 'Mar 2025': 31609 - 31353.40, 'Jun 2025': 34143 - 34083.23,
  'Sep 2025': 35080 - 33421.60, 'Dec 2025': 38942 - 38516.81, 'Mar 2026': 39601 - 39554.13, 'Jun 2026': 41959 - 41920 };
const r0 = v => Math.round(v), r1 = v => Math.round(v * 10) / 10;

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  if (S.basis !== 'standalone') return S; // the patch is for the standalone file only
  const keep = { note: 'Investment income from group companies moved from Sales to Other Income; loss from investments moved from Expenses to exceptional items (annual). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  const apply = (tab, per, d, l, cost) => {
    const T = S.tables[tab], j = T.periods.indexOf(per); if (j < 0) return;
    const R = T.rows, sch = S.schedules?.[tab] || {};
    const o = { sales: R.Sales[j], exp: R.Expenses[j], op: R['Operating Profit'][j], oi: R['Other Income'][j] };
    keep.original[`${tab}:${per}`] = o;
    const sales = o.sales - d, exp = o.exp - l, op = sales - exp;
    R.Sales[j] = r0(sales); R.Expenses[j] = r0(exp); R['Operating Profit'][j] = r0(op); R['OPM %'][j] = r0(op / sales * 100);
    R['Other Income'][j] = r0(o.oi + d - l);
    const ex = sch['Other Income'] || {};
    if (ex['Other income normal'] && typeof ex['Other income normal'][per] === 'number') ex['Other income normal'][per] = r0(ex['Other income normal'][per] + d);
    if (l && ex['Exceptional items'] && typeof ex['Exceptional items'][per] === 'number') ex['Exceptional items'][per] = r0(ex['Exceptional items'][per] - l);
    const np = sch['Net Profit'] || {};
    if (l) {
      if (np['Exceptional items AT']?.[per] != null) np['Exceptional items AT'][per] = r0(np['Exceptional items AT'][per] - l);
      for (const k of ['Profit excl Excep', 'Profit for PE']) if (np[k]?.[per] != null) np[k][per] = r0(np[k][per] + l);
    }
    const ce = sch.Expenses || {};
    if (cost) { ce['Material Cost %'][per] = r1(cost.mat / sales * 100); ce['Employee Cost %'][per] = r1(cost.emp / sales * 100); ce['Other Expenses %'][per] = r1(cost.oth / sales * 100); }
    else for (const k of ['Material Cost %', 'Employee Cost %', 'Other Expenses %']) if (typeof ce[k]?.[per] === 'number') ce[k][per] = r1(ce[k][per] * o.sales / sales);
  };
  for (const [per, v] of Object.entries(ANNUAL)) apply('profit-loss', per, v.d, v.l, v);
  for (const [per, d] of Object.entries(QUARTER)) apply('quarters', per, d, 0, null);
  // YoY growth rows on the patched quarters
  const q = S.tables.quarters, g = q.rows['YoY Sales growth'];
  if (g) q.periods.forEach((p, j) => { const [m, y] = p.split(' '), k = q.periods.indexOf(`${m} ${+y - 1}`); if (k >= 0 && QUARTER[p] != null && QUARTER[q.periods[k]] != null) g[j] = r0((q.rows.Sales[j] / q.rows.Sales[k] - 1) * 100); });
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, ANNUAL, QUARTER };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'], q = S.tables.quarters;
  for (const p of Object.keys(ANNUAL)) { const i = pl.periods.indexOf(p); console.log(p, 'sales', pl.rows.Sales[i], 'EBITDA', pl.rows['Operating Profit'][i], 'OPM', pl.rows['OPM %'][i], 'OI', pl.rows['Other Income'][i], 'PBT', pl.rows['Profit before tax'][i], '| PBT check', pl.rows['Operating Profit'][i] + pl.rows['Other Income'][i] - pl.rows.Interest[i] - pl.rows.Depreciation[i]); }
  for (const p of Object.keys(QUARTER)) { const i = q.periods.indexOf(p); console.log(p, 'sales', q.rows.Sales[i], 'EBITDA', q.rows['Operating Profit'][i], 'OPM', q.rows['OPM %'][i], 'OI', q.rows['Other Income'][i], 'PBT check', q.rows['Operating Profit'][i] + q.rows['Other Income'][i] - q.rows.Interest[i] - q.rows.Depreciation[i], 'vs', q.rows['Profit before tax'][i]); }
}
