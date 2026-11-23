// AUROPHARMA: two small corrections to Screener's consolidated data, applied in memory by src/model.js on every build.
// 1. Net Profit on the attributable basis. Screener's consolidated "Net Profit" row is profit for the period BEFORE
//    minorities (FY26 Rs3,503 cr = company "profit after tax") while "EPS in Rs" (Rs60.34) is on profit attributable to
//    owners (Rs3,505 cr; minorities absorbed a Rs2 cr loss: Q4FY26 presentation, AR FY26 consolidated P&L). The engine
//    infers shares as Net Profit / EPS, which gives 58.05 cr instead of 58.09 cr. The gap is tiny for Aurobindo (minorities
//    are small: CCPS holders in CuraTeQ, a few partly owned subsidiaries), but we put the row on the same basis as EPS,
//    as CIPLA.patch.js and ZYDUSLIFE.patch.js do: Net Profit -> Screener's own "Profit for EPS" schedule.
// 2. Jun-2026 quarter EPS as filed. Screener shows Rs17.95 (Rs1,033 cr / 57.54 cr shares outstanding after the Apr-May
//    2026 buyback); the company reported Rs17.86 on the weighted average share count (Q1FY27 presentation, 5-Aug-2026).
// The post-buyback share count (575,377,895 shares, shareholding pattern 30-Jun-2026) is NOT patched here: the engine
// keeps the FY26 count and the report converts per-share values (see AUROPHARMA.ctx.js / AUROPHARMA.mult.js).
// Originals are kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/AUROPHARMA.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'AUROPHARMA', 'screener.json');
const EPS_AS_FILED = { 'Jun 2026': 17.86 };

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities); Jun-2026 EPS as filed. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`AUROPHARMA patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  const q = S.tables.quarters;
  keep.original.eps = {};
  for (const [per, v] of Object.entries(EPS_AS_FILED)) { const j = q.periods.indexOf(per); if (j >= 0) { keep.original.eps[per] = q.rows['EPS in Rs'][j]; q.rows['EPS in Rs'][j] = v; } }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  const pl = S.tables['profit-loss'];
  for (const p of ['Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} (was ${S._gamPatch.original['profit-loss'][i]}) | EPS ${pl.rows['EPS in Rs'][i]} | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)} cr`);
  }
  console.log('Jun 2026 EPS', S._gamPatch.original.eps, '->', EPS_AS_FILED);
}
