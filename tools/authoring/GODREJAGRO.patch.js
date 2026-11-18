// GODREJAGRO: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs445 cr) while "EPS in
// Rs" is AFTER minorities (Rs24.58). Minorities have taken a share of LOSSES (mainly 32.97-35.25% of Astec
// LifeSciences, which lost Rs81 cr in FY26 and Rs137 cr in FY25), so profit attributable to owners
// (Rs473 cr) is higher than total profit. The engine infers shares as Net Profit / EPS, which gives
// 18.11 cr shares instead of the real 19.22 cr, and every per-share value goes wrong. We replace the row
// with Screener's own "Profit for EPS" schedule (= profit attributable to owners), as TATACHEM.patch.js
// and UPL.patch.js do. The original row is kept under _gamPatch. Idempotent; applied in memory by
// src/model.js on every build, so a fresh Screener fetch cannot undo it.
// Usage (check only): node tools/authoring/GODREJAGRO.patch.js
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'GODREJAGRO', 'screener.json');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`GODREJAGRO patch: no Profit for EPS schedule for ${tab}`);
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
  for (const p of ['Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p), np = pl.rows['Net Profit'][i], eps = pl.rows['EPS in Rs'][i];
    console.log(p, '| Net Profit (attributable)', np, '| original', S._gamPatch.original['profit-loss'][i], '| EPS', eps, '| implied shares', (np / eps).toFixed(2), 'cr');
  }
}
