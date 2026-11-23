// ATHERENERG: in-memory fixes applied by src/model.js on every build (patchRaw); idempotent. Never edit screener.json.
// 1) Missing quarter. Screener's quarterly table skips Dec-2025 (Q3FY26), so the trailing-four-quarter
//    figures would be wrong. We insert Q3FY26 as FY26 (annual report, consolidated) less Q1, Q2 and Q4:
//    revenue ₹953.6 cr (matches 9MFY26 revenue ₹2,497.1 cr less H1 in the Q3FY26 presentation, 2-Feb-2026),
//    loss ₹84.8 cr (9M loss ₹416.9 cr less H1 = ₹84.6 cr). EPS on 38.2 cr shares.
// 2) Cash-flow table shifted one year. Screener's "Cash from Operating/Investing/Financing" rows are one
//    column late (its "Mar 2026" column holds FY25: CFO −₹721 cr, which is FY25 in the AR FY26 cash flow
//    statement). We move each row back one year and fill FY26 from the AR FY26 cash-flow statement:
//    CFO +₹31.89 cr, CFI −₹2,526.51 cr, net change in cash +₹42.14 cr (so CFF +₹2,536.76 cr),
//    capex ₹506.07 cr. The schedules (sub-items) are already on the right years.
// 3) Gross block at Mar-2026 is blank on Screener. Filled from AR FY26 note 2: PPE gross ~₹523 cr (net
//    ₹307.31 cr + accumulated depreciation ~₹216 cr), right-of-use ₹322.60 cr, intangibles ₹438.94 cr and
//    intangibles under development ₹237.57 cr (Screener's net fixed assets ₹865 cr include the last) = ₹1,522 cr.
// 4) Equity raised after Mar-2026 but before our 30-Sep-2026 as-of date. The engine has no share-issue line
//    for industrial companies, so the Mar-2026 balance sheet is put on a pro forma basis:
//    QIP 1,08,15,307 shares at ₹1,202 (₹1,299.99 cr, allotted 20-Jul-2026); preferential 16,26,016 shares at
//    ₹1,230 to the India Japan Fund (₹199.99 cr, 25-Aug-2026); 79,36,507 warrants at ₹1,260 to Hero MotoCorp
//    and the two founders (₹999.99 cr: 25% paid, 75% due on conversion within 18 months, i.e. before the
//    Sep-2028 target date; in the money at ₹1,425). We add the full ₹2,500 cr to investments and equity and
//    count the warrants as shares: 39,61,19,200 shares after the 25-Aug allotment (exchange filing) + 79,36,507
//    = 40.4055 cr fully diluted. FY26 EPS is restated pro forma (−₹517 cr ÷ 40.4055 cr); reported −₹13.51.
//    Issue costs of the QIP were not disclosed by 30-Sep (gap): we use gross proceeds.
const SHARES_FD = 40.40556; // crore, fully diluted at 30-Sep-2026
const RAISE = 2500; // ₹ crore: QIP 1,300 + IJF 200 + warrants 1,000 (incl. 750 due on conversion)

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'ATHERENERG.patch.js: Q3FY26 inserted; cash-flow rows realigned; FY26 gross block; Mar-26 pro forma for the Jul/Aug-2026 equity raise.', fetchedAt: S.fetchedAt };
  // 1) Q3FY26
  const q = S.tables.quarters;
  if (q && !q.periods.includes('Dec 2025')) {
    const j = q.periods.indexOf('Mar 2026');
    const OP = 953.64 - 1025.45, OI = 36.77, INT = 19.33, DEP = 30.43, PBT = OP + OI - INT - DEP;
    const add = { Sales: 953.64, 'YoY Sales growth': null, Expenses: 1025.45, 'Operating Profit': OP, 'OPM %': OP / 953.64 * 100, 'Other Income': OI, Interest: INT, Depreciation: DEP, 'Profit before tax': PBT, 'Tax %': 0, 'Net Profit': PBT, 'EPS in Rs': PBT / 38.2, 'Raw PDF': null };
    q.periods.splice(j, 0, 'Dec 2025');
    for (const k of Object.keys(q.rows)) q.rows[k].splice(j, 0, k in add ? (add[k] == null ? null : Math.round(add[k] * 100) / 100) : null);
  }
  // 2) Cash-flow rows one year late
  const cf = S.tables['cash-flow'];
  if (cf) {
    keep.cashFlowOriginal = JSON.parse(JSON.stringify(cf.rows));
    const fy26 = { 'Cash from Operating Activity': 31.89, 'Cash from Investing Activity': -2526.51, 'Cash from Financing Activity': 2536.76, 'Net Cash Flow': 42.14, 'Free Cash Flow': 31.89 - 506.07 };
    for (const k of Object.keys(cf.rows)) {
      const r = cf.rows[k], n = r.length;
      cf.rows[k] = [...r.slice(1), null];
      const key = Object.keys(fy26).find(x => k === x || k.startsWith(x));
      cf.rows[k][n - 1] = key ? fy26[key] : null;
    }
  }
  // 3) Gross block Mar-2026
  const fa = S.schedules?.['balance-sheet']?.['Fixed Assets'];
  if (fa?.['Gross Block'] && fa['Gross Block']['Mar 2026'] == null) { fa['Gross Block']['Mar 2026'] = 1522; if (fa['Accumulated Depreciation']) fa['Accumulated Depreciation']['Mar 2026'] = 657; }
  // 4) Pro forma equity raise
  const bs = S.tables['balance-sheet'], i = bs.periods.indexOf('Mar 2026');
  if (i >= 0) {
    keep.bsOriginal = Object.fromEntries(['Equity Capital', 'Reserves', 'Investments', 'Total Liabilities', 'Total Assets'].map(k => [k, bs.rows[k]?.[i]]));
    bs.rows['Equity Capital'][i] = 40;
    bs.rows.Reserves[i] += RAISE - 2;
    bs.rows.Investments[i] += RAISE;
    bs.rows['Total Liabilities'][i] += RAISE;
    bs.rows['Total Assets'][i] += RAISE;
  }
  const pl = S.tables['profit-loss'], j26 = pl.periods.indexOf('Mar 2026');
  if (j26 >= 0) { keep.epsOriginal = pl.rows['EPS in Rs'][j26]; pl.rows['EPS in Rs'][j26] = pl.rows['Net Profit'][j26] / SHARES_FD; }
  // 5) Screener labels the standalone years "Mar 2024 (S)" in the tables but "Mar 2024" in the schedules, so
  //    the engine finds no capex, cash, gross block or cost split before FY26. Copy each schedule value to the
  //    "(S)" key the tables use (the originals stay).
  const sPeriods = new Set(Object.values(S.tables).flatMap(t => t.periods.filter(p => / \(S\)$/.test(p))));
  for (const sec of Object.values(S.schedules || {})) for (const par of Object.values(sec || {})) for (const item of Object.values(par || {})) {
    if (!item || typeof item !== 'object') continue;
    for (const p of sPeriods) { const k = p.replace(' (S)', ''); if (item[p] === undefined && item[k] !== undefined) item[p] = item[k]; }
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_FD, RAISE };
