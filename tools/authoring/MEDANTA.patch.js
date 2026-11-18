// MEDANTA: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs554 cr = Rs5,540.7 mn)
// while "EPS in Rs" is AFTER minorities (Rs20.71 on Rs5,564.6 mn attributable). The engine infers shares as
// Net Profit / EPS, which gives 26.77 cr shares instead of the real 26.87 cr (26,86,90,382 issued at
// Mar-2026; weighted basic 26,87,53,171, AR FY26 notes 19 and 38): a 0.4% gap. The minority is DLF's 50% of
// GHL Hospital Ltd (the South Delhi hospital company Medanta controls), consolidated from FY26; its share is
// a small LOSS (Rs2.4 cr in FY26, ~Rs1.5 cr in Q1FY27), so owners' profit is slightly ABOVE Screener's Net
// Profit. We replace the row with Screener's own "Profit for EPS" schedule (= profit to owners), as
// RAINBOW.patch.js does. The original row is kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/MEDANTA.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'MEDANTA', 'screener.json');

// In-memory version, applied by src/model.js on every build so a fresh Screener fetch cannot undo it.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`MEDANTA patch: no Profit for EPS schedule for ${tab}`);
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
  console.log('in-memory check | FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(actual 26.87 cr)');
}
