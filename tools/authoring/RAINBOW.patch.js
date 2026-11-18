// RAINBOW: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs282 cr) while
// "EPS in Rs" is AFTER minorities (Rs27.40). The engine infers shares as Net Profit / EPS, which gives
// 10.29 cr shares instead of the real 10.16 cr (10,15,57,000-odd shares; promoter group 5,06,16,873 =
// 49.84%, AR FY26): a 1.3% gap, so every per-share value would be wrong. Rainbow's minorities are the 24%
// held by the sellers of Prashanthi Medicare (Warangal, from Jul-2025) and Pratiksha Women & Child Care
// (Guwahati, from Aug-2025): Rs1-3 cr a year before FY26, Rs3 cr in FY26 and Rs2 cr in Q1FY27 alone.
// We replace the row with Screener's own "Profit for EPS" schedule (= PATMI), as ASIANPAINT.patch.js
// does. The original row is kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/RAINBOW.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'RAINBOW', 'screener.json');

// In-memory version, applied by src/model.js on every build so a fresh Screener fetch cannot undo it.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`RAINBOW patch: no Profit for EPS schedule for ${tab}`);
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
  console.log('in-memory check | FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(actual 10.16 cr)');
}
