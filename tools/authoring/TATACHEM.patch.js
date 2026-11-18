// TATACHEM: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs-1,715 cr) while
// "EPS in Rs" is AFTER minorities (Rs-74.41). The engine infers shares as Net Profit / EPS, which gives
// 23.05 cr shares instead of the real 25.48 cr, and every per-share value goes wrong. Tata Chemicals'
// minorities are material: 44.96% of Rallis India and 50% of ALCAD (a US partnership), together
// Rs152-181 cr a year. We replace the row with Screener's own "Profit for EPS" schedule (= PATMI), as
// UPL.patch.js does. The original row is kept under _gamPatch. Idempotent: run again after a re-fetch.
// Usage: node tools/authoring/TATACHEM.patch.js
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'TATACHEM', 'screener.json');

// In-memory version, applied by src/model.js on every build so a fresh Screener fetch cannot undo it.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`TATACHEM patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

function patch() {
  const S = JSON.parse(fs.readFileSync(F, 'utf8'));
  const done = S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt;
  if (done) return { changed: false, note: 'already patched' };
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const [tab, sec] of [['profit-loss', 'profit-loss'], ['quarters', 'quarters']]) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[sec]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`TATACHEM patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => {
      if (p === 'TTM') return row[i]; // recomputed from quarters by the as-of freeze
      const v = pfe[p];
      return typeof v === 'number' ? v : row[i];
    });
  }
  S._gamPatch = keep;
  fs.writeFileSync(F, JSON.stringify(S));
  return { changed: true, note: 'patched' };
}

module.exports = { patch, patchRaw };
if (require.main === module) {
  const r = patch();
  const S = JSON.parse(fs.readFileSync(F, 'utf8'));
  const pl = S.tables['profit-loss'], i = pl.periods.indexOf('Mar 2026');
  console.log(r.note, '| FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2));
}
