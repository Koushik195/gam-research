// CAPLIPOINT: two corrections to Screener's consolidated data, applied in memory by src/model.js on every build.
// (1) NET PROFIT ON THE ATTRIBUTABLE BASIS. Screener's "Net Profit" row is profit BEFORE minority interests (FY26 Rs650 cr =
// company "profit for the period" Rs649.73 cr), while "EPS in Rs" is AFTER them (Rs84.36 on Rs641.24 cr attributable to
// owners; non-controlling interests Rs8.49 cr, mainly the 31% of Nuevos Eticos Neo Ethicals S.A., Guatemala, that the group
// does not own; AR FY26 consolidated P&L, Board's report and note 43). The engine infers shares as Net Profit / EPS, which
// gives 7.70 cr shares instead of the real 7.601 cr (7,60,11,696 shares of Rs2, AR FY26 note 14). As LALPATHLAB.patch.js,
// ALKEM.patch.js and IPCALAB.patch.js do, we replace the annual and quarterly rows with Screener's own "Profit for EPS"
// schedule (profit attributable to owners). FY26: Rs641 cr, 7.60 cr shares; Q1FY27: Rs177 cr (EPS Rs23.27).
// NOT changed, on purpose:
//  - the balance sheet. Screener files the Rs216.57 cr Series A compulsorily convertible preference shares (CCPS) that
//    Caplin Steriles Ltd issued to Eight Roads Ventures (70%) and F-Prime Capital (30%) in Jan-2019 as "Preference
//    Capital" inside Borrowings. The company shows them inside equity (Rs74.58 cr "instruments entirely equity in nature"
//    + Rs141.99 cr securities premium; AR FY26 notes 15-16), but they are not Caplin Point's equity: on conversion (term
//    19 years) the holders get at least 25.29% of Caplin Steriles on a fully diluted basis (AR FY19 note 13). Leaving them
//    in Borrowings makes the engine deduct them (at book value) from net cash in the DCF and EV/EBITDA cross-checks, which is
//    the right direction; CAPLIPOINT.ctx.js adds back the yield the engine therefore misses on the gross treasury book.
//  - EPS, sales, EBITDA and the TTM column (the as-of freeze recomputes TTM from the four quarters released by
//    30-Sep-2026). forwardMedian / forwardSeries read the unpatched screener.json but use only "EPS in Rs".
// Originals are kept under _gamPatch. Idempotent. Usage: node tools/authoring/CAPLIPOINT.patch.js (prints the checks).
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'CAPLIPOINT', 'screener.json');
const SHARES_ACTUAL = 7.6011696; // crore, AR FY26 note 14

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS" (attributable to owners); P&L period "Mar 2016 9m" renamed "Mar 2016". Originals below.', fetchedAt: S.fetchedAt, original: {} };
  // (0) PERIOD LABEL. Screener labels the nine-month FY16 P&L column "Mar 2016 9m" but the balance sheet, cash flow, ratios
  //     and schedules use "Mar 2016"; the engine aligns tables on the P&L period string, so FY16's balance sheet came out
  //     blank and the Excel Model sheet divided by a zero FY16 net worth (Debt / equity). Renaming aligns the columns; the
  //     figures are unchanged (FY16 is still a nine-month year, flagged in the statement notes).
  const plp = S.tables['profit-loss'].periods, i9 = plp.indexOf('Mar 2016 9m');
  if (i9 >= 0) { keep.original.plPeriod = plp[i9]; plp[i9] = 'Mar 2016'; }
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`CAPLIPOINT patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_ACTUAL };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'];
  for (const p of ['Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} (was ${S._gamPatch.original['profit-loss'][i]}) | EPS ${pl.rows['EPS in Rs'][i]} | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(3)} cr (actual ${SHARES_ACTUAL.toFixed(3)} cr)`);
  }
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log(`Q1FY27 | Net Profit ${q.rows['Net Profit'][j]} | EPS ${q.rows['EPS in Rs'][j]} | implied shares ${(q.rows['Net Profit'][j] / q.rows['EPS in Rs'][j]).toFixed(3)} cr`);
}
