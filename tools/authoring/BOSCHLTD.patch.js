// BOSCHLTD: data corrections applied in memory by src/model.js on every build (a fresh Screener fetch cannot undo them).
// 1. Quarters as they were reported by 30-Sep-2026. Bosch bought Bosch Chassis Systems India (RBIC) from its parent in
//    Jul-2026 (common-control deal, no goodwill). Its Q2FY27 filing (Nov-2026, after our as-of date) restated the prior
//    quarters to include RBIC, and Screener replaced two columns with those restated numbers: Sep 2025 (Q2FY26: Rs5,969
//    cr revenue vs Rs4,795 cr reported) and Jun 2026 (Q1FY27: Rs7,167 cr vs Rs5,842 cr reported on 10-Aug-2026). That is
//    look-ahead data, so we put back the numbers known on 30-Sep-2026:
//    - Q2FY26 = FY26 (AR FY26, consolidated, which excludes RBIC) less Screener's Q1, Q3 and Q4 FY26 (all as reported);
//      it agrees with the standalone Q2FY26 in MOSL's 11-Aug-2026 note (sales Rs47,948 m, EBITDA Rs6,171 m, PAT Rs5,542 m).
//    - Q1FY27 = consolidated results of 10-Aug-2026: revenue Rs5,841.9 cr, total income Rs6,067.6 cr, total expenses
//      Rs5,125.8 cr, PBT Rs941.8 cr, tax Rs236.9 cr, PAT Rs706.1 cr, EPS Rs239.41 (Kotak Neo results page, 11-Aug-2026);
//      depreciation Rs98.9 cr and interest Rs6.1 cr from the standalone results (MOSL 11-Aug-2026; subsidiaries are tiny).
// 2. Mar-26 balance sheet pro forma for the RBIC purchase (KIMS.patch.js precedent: tables only; src/excel.js reads the
//    unpatched schedules, and the working-capital lines are untouched, so engine and Excel agree). The engine has no
//    acquisition line and starts the forecast from Mar-26, so without this it would keep ~Rs8,000 cr of cash Bosch no
//    longer has. Cash paid = consideration Rs9,068.68 cr less 2,460 new shares at Rs35,200 (Rs8.66 cr) = Rs9,060.02 cr;
//    RBIC brings ~Rs1,032.8 cr of its own cash (equity value Rs9,068.68 cr less 10.6x FY25 EBITDA of Rs758.1 cr; Apr-2026
//    deck). Net treasury change -Rs8,027.2 cr, taken out of investments (Rs8,020 cr, i.e. to zero; the Rs7.2 cr left is
//    immaterial). Under common-control (pooling) accounting equity falls by the cash paid less RBIC's book net worth;
//    we take reserves down by the same Rs8,020 cr, i.e. we
//    do not add RBIC's ~Rs380 cr of non-cash net assets (net worth Rs1,410 cr at Mar-25 less its cash; its Mar-26 net
//    worth was not published by 30-Sep-2026). The 2,460 new shares (0.008% of 2.949 cr) are ignored.
// Usage (check only): node tools/authoring/BOSCHLTD.patch.js
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'BOSCHLTD', 'screener.json');
const PF = { consideration: 9068.68, shareIssue: 2460 * 35200 / 1e7, rbicCash: 1032.8 };
PF.cashPaid = Math.round((PF.consideration - PF.shareIssue) * 100) / 100; // 9,060.02
PF.netOut = Math.round((PF.cashPaid - PF.rbicCash) * 10) / 10; // 8,027.2

const AS_REPORTED = {
  'Sep 2025': { Sales: 4794, 'YoY Sales growth': 9, Expenses: 4178, 'Operating Profit': 617, 'OPM %': 13, 'Other Income': 210, Interest: 5, Depreciation: 92, 'Profit before tax': 731, 'Tax %': 24, 'Net Profit': 554, 'EPS in Rs': 188.01 },
  'Jun 2026': { Sales: 5842, 'YoY Sales growth': 22, Expenses: 5021, 'Operating Profit': 821, 'OPM %': 14, 'Other Income': 226, Interest: 6, Depreciation: 99, 'Profit before tax': 942, 'Tax %': 25, 'Net Profit': 706, 'EPS in Rs': 239.41 },
};
const MARGINS = { '2025-09-30': { 'Quarter Sales': 4794.8, OPM: 12.87, NPM: 11.56, GPM: 35.4 }, '2026-06-30': { 'Quarter Sales': 5841.9, OPM: 14.05, NPM: 12.09, GPM: 33.5 } };
const QSCHED = { 'Sep 2025': { 'Other income normal': 210, 'Exceptional items': 0, 'Profit excl Excep': 554, 'Profit for PE': 554, 'Profit for EPS': 554 },
  'Jun 2026': { 'Other income normal': 226, 'Exceptional items': 0, 'Profit excl Excep': 706, 'Profit for PE': 706, 'Profit for EPS': 706 } };

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Quarters Sep-2025 and Jun-2026 as reported by 30-Sep-2026 (Screener shows the Nov-2026 RBIC-restated figures); Mar-26 balance sheet pro forma for the RBIC purchase (Jul-2026). Originals below.', fetchedAt: S.fetchedAt, pf: PF, original: {} };
  const q = S.tables.quarters;
  for (const [p, vals] of Object.entries(AS_REPORTED)) {
    const j = q.periods.indexOf(p); if (j < 0) continue;
    keep.original[`q.${p}`] = {};
    for (const [k, v] of Object.entries(vals)) if (q.rows[k]) { keep.original[`q.${p}`][k] = q.rows[k][j]; q.rows[k][j] = v; }
  }
  for (const [p, vals] of Object.entries(QSCHED)) for (const [par, items] of Object.entries(S.schedules?.quarters || {}))
    for (const [it, obj] of Object.entries(items || {})) if (obj && typeof obj === 'object' && it in vals && p in obj) obj[p] = vals[it];
  for (const [d, vals] of Object.entries(MARGINS)) for (const [k, v] of Object.entries(vals)) {
    const s = S.charts?.margins?.[k]; const pt = s && s.find(x => x[0] === d); if (pt) pt[1] = v;
  }
  // 3. Align Screener's FY15 label across tables (Bosch moved from a December to a March year-end: a 15-month FY15,
  //    'Mar 2015 (S) 15m' in the P&L but 'Mar 2015 (S)' elsewhere; EICHERMOT.patch.js precedent), so the engine keeps
  //    the FY15 balance sheet and cash flow instead of dropping them.
  const OLD = 'Mar 2015 (S)', NEW = 'Mar 2015 (S) 15m';
  for (const [key, t] of Object.entries(S.tables || {})) if (key !== 'profit-loss' && key !== 'quarters') t.periods = t.periods.map(p => (p === OLD ? NEW : p));
  for (const [sec, o] of Object.entries(S.schedules || {})) { if (sec === 'quarters') continue;
    for (const par of Object.values(o || {})) for (const item of Object.values(par || {})) if (item && typeof item === 'object' && OLD in item) { item[NEW] = item[OLD]; delete item[OLD]; } }
  const bs = S.tables['balance-sheet'], j = bs.periods.indexOf('Mar 2026');
  keep.original['bs.Mar26'] = { investments: bs.rows.Investments[j], reserves: bs.rows.Reserves[j], total: bs.rows['Total Assets'][j] };
  // Screener's Mar-26 investments are Rs8,020 cr, Rs7.2 cr short of the net outflow: we take investments to zero and
  // leave the Rs7.2 cr (Rs2 a share) in deposits (inside otherTreasury) rather than show negative investments.
  const cut = Math.min(PF.netOut, bs.rows.Investments[j]); PF.cut = cut;
  for (const k of ['Investments', 'Reserves', 'Total Liabilities', 'Total Assets']) bs.rows[k][j] = Math.round((bs.rows[k][j] - cut) * 10) / 10;
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, PF, AS_REPORTED };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  console.log(JSON.stringify(S._gamPatch, null, 1));
  const q = S.tables.quarters; console.log(q.periods.join(' | ')); console.log(q.rows.Sales.join(' | ')); console.log(q.rows['Net Profit'].join(' | '));
}
