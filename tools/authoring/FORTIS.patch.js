// FORTIS: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs1,064 cr) while
// "EPS in Rs" is AFTER minorities (Rs13.80). The engine infers shares as Net Profit / EPS, which gives
// 77.1 cr shares instead of the real 75.5 cr (754.87 mn shares at Jun-2026; no change since the Nov-2018 IHH
// preferential issue): a 2% gap, so every per-share value would be wrong. Fortis's minorities are mainly
// the 11.68% of Agilus Diagnostics not owned by Fortis (42.89% until the FY25 buyout, hence Rs235 cr of
// minority profit in FY22), plus small stakes in other subsidiaries: Rs22 cr in FY26, Rs6.4 cr in Q1FY27.
// We replace the row with Screener's own "Profit for EPS" schedule (= PATMI, incl. exceptional items),
// as RAINBOW.patch.js does. The original row is kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/FORTIS.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'FORTIS', 'screener.json');

// In-memory version, applied by src/model.js on every build so a fresh Screener fetch cannot undo it.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`FORTIS patch: no Profit for EPS schedule for ${tab}`);
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
  console.log('in-memory check | FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(actual 75.50 cr)');
  const q = S.tables.quarters; console.log('quarters', q.periods.slice(-5).join('|'), q.rows['Net Profit'].slice(-5).join('|'));
}
