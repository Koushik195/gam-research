// WOCKPHARMA: put Screener's consolidated "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's "Net Profit" row is profit BEFORE minorities (FY26 Rs199 cr, FY25 -Rs57 cr), while "EPS in Rs" is AFTER
// minorities. Wockhardt owns 85.85% of Wockhardt Bio AG (Switzerland; holds the UK, Irish, EU and US subsidiaries and the
// Zaynich NDA), so 14.15% of Bio AG's result belongs to minorities (AR FY26 note 42). Bio AG lost Rs97 cr in FY26, so the
// minorities ABSORBED Rs14 cr of losses: profit attributable to owners was Rs213 cr (AR FY26 consolidated P&L), above the
// Rs199 cr Screener shows as Net Profit. The engine infers shares as Net Profit / EPS: unpatched, FY26 gives 199 / 13.11 =
// 15.2 cr shares instead of the real 16.249 cr (162,492,169 shares at Rs5, shareholding pattern 31-Mar-2026). We replace
// the row with Screener's own "Profit for EPS" schedule (= profit attributable to owners), as GLENMARK.patch.js and
// LUPIN.patch.js do. FY26 then gives 213 / 13.11 = 16.25 cr shares. The original rows are kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/WOCKPHARMA.patch.js (prints the check; src/model.js applies patchRaw in memory on every build,
// so a re-fetch cannot undo it).
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'WOCKPHARMA', 'screener.json');
const SHARES_ASOF = 16.2492169; // crore shares, shareholding pattern 31-Mar-2026 (unchanged at 30-Jun-2026)

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after the 14.15% minority in Wockhardt Bio AG). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`WOCKPHARMA patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_ASOF };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  const pl = S.tables['profit-loss'];
  for (const p of ['Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} (was ${S._gamPatch.original['profit-loss'][i]}) | EPS ${pl.rows['EPS in Rs'][i]} | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)} cr`);
  }
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log(`Q1FY27 | Net Profit ${q.rows['Net Profit'][j]} (was ${S._gamPatch.original.quarters[j]}) | EPS ${q.rows['EPS in Rs'][j]} | implied shares ${(q.rows['Net Profit'][j] / q.rows['EPS in Rs'][j]).toFixed(2)} cr (actual ${SHARES_ASOF.toFixed(2)} cr)`);
}
