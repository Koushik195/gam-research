// CIPLA: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs3,862 cr; company
// "profit for the period") while "EPS in Rs" is AFTER minorities (Rs48.02 on Rs3,879 cr attributable to
// shareholders; minorities absorbed a Rs17 cr loss in FY26). The engine infers shares as Net Profit / EPS,
// which gives 80.43 cr shares instead of the real 80.78 cr (equity capital Rs161.56 cr at Rs2 a share,
// AR FY26 note 20): a 0.4% gap in FY26 and up to 3% in earlier years (FY15-18, FY22-24), when minorities
// in Cipla Quality Chemicals (Uganda, divested Q3FY24) and South African partners were larger. We replace
// the row with Screener's own "Profit for EPS" schedule (= profit attributable to shareholders), as
// UPL.patch.js and RAINBOW.patch.js do. The original row is kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/CIPLA.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'CIPLA', 'screener.json');

// In-memory version, applied by src/model.js on every build so a fresh Screener fetch cannot undo it.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`CIPLA patch: no Profit for EPS schedule for ${tab}`);
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
  const pl = S.tables['profit-loss'];
  for (const p of ['Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} (was ${S._gamPatch.original['profit-loss'][i]}) | EPS ${pl.rows['EPS in Rs'][i]} | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)} cr (actual 80.7-80.8 cr)`);
  }
}
