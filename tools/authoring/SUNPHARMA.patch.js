// SUNPHARMA: put Screener's consolidated "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's "Net Profit" row is profit BEFORE minorities (FY26 Rs11,509 cr) while "EPS in Rs" is AFTER minorities
// (Rs47.84; AR FY26 note 51: profit attributable Rs114,794.2 mn on 2,399,334,970 shares). The engine infers shares as
// Net Profit / EPS, which gives 240.6 cr shares instead of the real 239.93 cr: a 0.3% error in every per-share value.
// Minorities are small since Sun bought out Taro's minority (Jun-2024): non-controlling interests Rs29 cr in FY26
// (Screener 'Minority share'), Rs6 cr in Q1FY27, against Rs34-1,113 cr a year before FY25. We replace the row with
// Screener's own "Profit for EPS" schedule (= profit attributable to owners), as RAINBOW.patch.js and APOLLOHOSP.patch.js do.
// The original rows are kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/SUNPHARMA.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'SUNPHARMA', 'screener.json');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`SUNPHARMA patch: no Profit for EPS schedule for ${tab}`);
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
  console.log('in-memory check | FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(actual 239.93 cr)');
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log('Q1FY27 | Net Profit', q.rows['Net Profit'][j], 'EPS', q.rows['EPS in Rs'][j], 'implied shares', (q.rows['Net Profit'][j] / q.rows['EPS in Rs'][j]).toFixed(2));
}
