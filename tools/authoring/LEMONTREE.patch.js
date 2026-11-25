// LEMONTREE: one correction to Screener's consolidated data, applied in memory by src/model.js on every build.
// Net Profit on the attributable basis. Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs288 cr)
// while "EPS in Rs" is AFTER minorities (Rs2.87). The engine infers shares as Net Profit / EPS, which gives ~100 cr shares
// instead of the real 79.22 cr (79,22,46,464 shares of Rs10; AR FY26 note 16), a ~21% error in every per-share value.
// Minorities are large: Rs61 cr in FY26 (21% of profit before minorities), almost all of it the 41.09% of Fleur Hotels held by
// APG until 22-May-2026 and by Warburg Pincus since (AR FY26 note 18; Q4FY26 call). We replace the row with Screener's own
// "Profit for EPS" schedule (= profit attributable to owners), as EIHOTEL.patch.js / UPL.patch.js do. The Jun-2026 quarter on
// Screener matches the results filed on 7-Aug-2026 (revenue Rs344.6 cr, PAT Rs57.3 cr before minorities, Rs46.0 cr attributable;
// Q1FY27 deck slide 11; PL 11-Aug-2026), so no quarter is reset. Later quarters (Sep-2026) are dropped by the as-of freeze.
// Originals are kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/LEMONTREE.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'LEMONTREE', 'screener.json');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`LEMONTREE patch: no Profit for EPS schedule for ${tab}`);
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
  console.log('in-memory check | FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(actual 79.22 cr)');
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log('Q1FY27 | sales', q.rows.Sales[j], 'EBITDA', q.rows['Operating Profit'][j], 'PBT', q.rows['Profit before tax'][j], 'attributable PAT', q.rows['Net Profit'][j], 'EPS', q.rows['EPS in Rs'][j]);
}
