// INFY: put Screener's "Net Profit" on the attributable basis (profit after non-controlling interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs29,474 cr) while
// "EPS in Rs" (Rs72.59) is after minorities AND on the post-buyback share count. The engine infers shares
// as Net Profit / EPS: 29,474 / 72.59 = 406.03 cr. Screener's own "Profit for EPS" schedule (Rs29,440 cr,
// = profit attributable to owners, AR FY26 p.289) gives 29,440 / 72.59 = 405.57 cr, which matches the
// actual issued count after the Dec-2025 buyback: 405,55,91,723 shares at 31-Mar-2026 (AR FY26, share
// capital table: 415,32,63,455 less 10,00,00,000 bought back plus 23,28,268 ESOP allotments).
// Note: the company's reported FY26 basic EPS is Rs71.58 on 411.28 cr WEIGHTED shares (the buyback closed
// on 4-Dec-2025); Screener restates FY26 EPS on the year-end count. We keep Screener's EPS (consistent with
// the forecast share count) and say so in the report. Minorities are tiny (Rs34-41 cr a year).
// The original rows are kept under _gamPatch. Idempotent. src/model.js applies patchRaw on every build.
// Usage: node tools/authoring/INFY.patch.js  (prints the check)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'INFY', 'screener.json');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`INFY patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  const pl = S.tables['profit-loss'], i = pl.periods.indexOf('Mar 2026');
  console.log('in-memory check | FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(actual 405.56 cr at 31-Mar-2026)');
}
