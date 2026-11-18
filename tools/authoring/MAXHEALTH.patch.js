// MAXHEALTH: put Screener's "Net Profit" on the attributable basis (Screener's own "Profit for EPS" schedule).
// Why: the two rows agree in every year except FY19 (Net Profit 0 vs Profit for EPS -3, after a -3 minority share;
// EPS -0.06) and Q1FY27 (323 vs 322, after Kalinga's 41.72% minority from 18-May-2026). The FY19 zero makes the Excel
// model's "free cash flow / net profit" ratio divide by zero. FY26 is unchanged (1,442 both), so the share count the
// engine infers (Net Profit / EPS = 97.30 cr vs 97.33 cr actual) is unaffected. Same approach as RAINBOW.patch.js.
// The original rows are kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/MAXHEALTH.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'MAXHEALTH', 'screener.json');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`MAXHEALTH patch: no Profit for EPS schedule for ${tab}`);
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
  const pl = S.tables['profit-loss'], i = pl.periods.indexOf('Mar 2026'), j = pl.periods.indexOf('Mar 2019');
  console.log('in-memory check | FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(actual 97.33 cr) | FY19', pl.rows['Net Profit'][j]);
}
