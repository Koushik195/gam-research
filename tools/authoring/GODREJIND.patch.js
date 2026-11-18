// GODREJIND: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs2,412 cr) while
// "EPS in Rs" is AFTER minorities (Rs36.83). The engine infers shares as Net Profit / EPS, which gives
// ~65.5 cr shares instead of the real 33.68 cr, and every per-share value goes wrong. Godrej Industries'
// minorities are very large: 55.23% of Godrej Properties, 34.95% of Godrej Agrovet and 8.89% of Godrej
// Capital belong to other shareholders (Rs1,171 cr of FY26 profit). We replace the row with Screener's
// own "Profit for EPS" schedule (= profit attributable to owners), as TATACHEM.patch.js and UPL.patch.js do.
// The original row is kept under _gamPatch. Applied in memory by src/model.js on every build, so a fresh
// Screener fetch cannot undo it; this file never rewrites screener.json.
// Check: node tools/authoring/GODREJIND.patch.js  (prints implied shares before and after)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'GODREJIND', 'screener.json');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`GODREJIND patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
if (require.main === module) {
  const S = JSON.parse(fs.readFileSync(F, 'utf8'));
  const pl = S.tables['profit-loss'], i = pl.periods.indexOf('Mar 2026');
  const before = pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i];
  patchRaw(S);
  const after = pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i];
  console.log(`FY26 implied shares: before ${before.toFixed(2)} cr, after ${after.toFixed(2)} cr (actual 33.68 cr: 336,804,842 shares at 31-Mar-2026)`);
}
