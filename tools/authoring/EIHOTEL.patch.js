// EIHOTEL: one correction to Screener's consolidated data, applied in memory by src/model.js on every build.
// Net Profit on the attributable basis. Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs657 cr)
// while "EPS in Rs" is AFTER minorities (Rs10.05). The engine infers shares as Net Profit / EPS, which gives 65.4 cr shares
// instead of the real 62.54 cr (62,53,63,999 shares of Rs2; Jun-2026 shareholding pattern: promoters 20,54,23,072 = 32.85%),
// a 4.5% error in every per-share value. Minorities are small but real: Rs29 cr in FY26 (Svara Hotels, ex-Mumtaz, 40% held by
// partners; Oberoi Kerala Hotels 20%; PT Widja Putra Karya 30%; PT Waka Oberoi 10%; PT Astina Graha Ubud 40%; AR FY26 note 48)
// and Rs3 cr in Q1FY27. We replace the row with Screener's own "Profit for EPS" schedule (= profit attributable to owners),
// as INDHOTEL.patch.js / UPL.patch.js do. The Jun-2026 quarter on Screener matches the results filed on 6-Aug-2026
// (revenue Rs657 cr, PAT Rs120 cr before minorities; Q1FY27 deck slide 18), so no quarter is reset. Later quarters
// (Sep-2026) are dropped by the as-of freeze in src/model.js.
// Originals are kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/EIHOTEL.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'EIHOTEL', 'screener.json');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`EIHOTEL patch: no Profit for EPS schedule for ${tab}`);
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
  console.log('in-memory check | FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(actual 62.54 cr)');
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log('Q1FY27 | sales', q.rows.Sales[j], 'EBITDA', q.rows['Operating Profit'][j], 'PBT', q.rows['Profit before tax'][j], 'attributable PAT', q.rows['Net Profit'][j], 'EPS', q.rows['EPS in Rs'][j]);
}
