// UPL: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 ₹2,220 cr) while
// "EPS in Rs" is AFTER minorities (₹22.78). The engine infers shares as Net Profit ÷ EPS, which gives
// 97.5 cr shares instead of the real 84.4 cr, and every per-share value (EPS, SOTP, DCF) goes wrong.
// UPL's minorities are large (PE investors own 22.2% of UPL Corp, 9.1% of UPL SAS and 21.8% of
// Advanta), so we replace the row with Screener's own "Profit for EPS" schedule (= PATMI). The
// original row is kept under _gamPatch. Idempotent: run again after any Screener re-fetch.
// Usage: node tools/authoring/UPL.patch.js
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'UPL', 'screener.json');

// In-memory version, applied by src/model.js on every build (so a fresh Screener fetch can never
// leave the model on the wrong basis). Returns the same object, patched once.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`UPL patch: no Profit for EPS schedule for ${tab}`);
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
    if (!T || !pfe) throw new Error(`UPL patch: no Profit for EPS schedule for ${tab}`);
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
