// KANSAINER: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs575.84 cr) while
// "EPS in Rs" is AFTER minorities (Rs7.29, on Rs589.47 cr attributable to owners). The engine infers
// shares as Net Profit / EPS, which gives 79.0 cr shares instead of the real 80.87 cr (2.3% too few),
// and every per-share value goes wrong. The gap is the 45% minority in the loss-making Bangladesh
// subsidiary (and, until Dec-2025, the 40% minority in Sri Lanka), which absorbs part of the losses:
// non-controlling interests were -Rs13.63 cr in FY26 and -Rs33.62 cr in FY25 (AR FY26, consolidated
// P&L). We replace the row with Screener's own "Profit for EPS" schedule (= profit attributable to
// owners), as TATACHEM.patch.js and UPL.patch.js do. The original row is kept under _gamPatch.
// Idempotent: run again after a re-fetch. src/model.js applies patchRaw on every build.
// Usage: node tools/authoring/KANSAINER.patch.js   (prints the check; does not need to write the file)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'KANSAINER', 'screener.json');
const NOTE = 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.';

// In-memory version, applied by src/model.js on every build so a fresh Screener fetch cannot undo it.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: NOTE, fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`KANSAINER patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    // TTM is recomputed from the released quarters by the as-of freeze, so it is left alone here.
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  const pl = S.tables['profit-loss'];
  for (const p of ['Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(p, '| Net Profit (attributable)', pl.rows['Net Profit'][i], '| EPS', pl.rows['EPS in Rs'][i], '| implied shares (cr)', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2));
  }
}
