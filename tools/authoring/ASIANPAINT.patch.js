// ASIANPAINT: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs4,395 cr) while
// "EPS in Rs" is AFTER minorities (Rs45.09). The engine infers shares as Net Profit / EPS, which gives
// 97.47 cr shares instead of the real 95.92 cr (95,91,97,790 shares, Mar-2026 shareholding pattern):
// a 1.6% gap, so every per-share value would be wrong. Asian Paints' minorities are the 50% PPG share of
// Asian Paints PPG (industrial coatings) plus minority holders in Nepal, Egypt, Ethiopia, Weatherseal and
// the UAE white-cement unit: Rs42-97 cr a year. We replace the row with Screener's own "Profit for EPS"
// schedule (= PATMI), as TATACHEM.patch.js does. The original row is kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/ASIANPAINT.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'ASIANPAINT', 'screener.json');

// In-memory version, applied by src/model.js on every build so a fresh Screener fetch cannot undo it.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`ASIANPAINT patch: no Profit for EPS schedule for ${tab}`);
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
  console.log('in-memory check | FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(actual 95.92 cr)');
}
