// POLYMED: one correction to Screener's consolidated data, applied in memory by src/model.js on every build.
// NET PROFIT ON THE ATTRIBUTABLE BASIS. Since the PendraCare purchase (22-Sep-2025, 90% via Risor Holding B.V.; the sellers
// keep 10%) the group has a non-controlling interest, and because PendraCare makes losses the minorities' share is NEGATIVE:
// profit attributable to Polymed's shareholders is slightly ABOVE Screener's "Net Profit" row (FY26 ₹322 cr vs ₹321 cr;
// Q1FY27 ₹86 cr vs ₹85 cr; Screener "Minority share" schedule). "EPS in Rs" (₹31.78 for FY26) is on the attributable figure,
// so the engine's share count (Net Profit / EPS) comes out at 10.10 cr instead of the real 10.136 cr (10,13,59,490 shares of
// ₹5, AR FY26 note 14). As LALPATHLAB.patch.js / IPCALAB.patch.js do, we replace the annual and quarterly Net Profit rows with
// Screener's own "Profit for EPS" schedule (identical to Net Profit before FY26). Not changed: EPS, sales, EBITDA, other
// income, the balance sheet and the TTM column (the as-of freeze recomputes it from the quarters released by 30-Sep-2026).
// Screener's "exceptional items" for FY25-26 (₹44 cr / ₹46 cr) are mutual-fund gains, i.e. treasury income: left as they are.
// Originals are kept under _gamPatch. Idempotent. Usage: node tools/authoring/POLYMED.patch.js (prints the checks).
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'POLYMED', 'screener.json');
const SHARES_ACTUAL = 10.135949; // crore, AR FY26 note 14 (Mar-26)

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS" (attributable to owners). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`POLYMED patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_ACTUAL };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'];
  for (const p of ['Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} (was ${S._gamPatch.original['profit-loss'][i]}) | EPS ${pl.rows['EPS in Rs'][i]} | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(3)} cr (Mar-26 actual ${SHARES_ACTUAL.toFixed(3)} cr)`);
  }
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log(`Q1FY27 | Net Profit ${q.rows['Net Profit'][j]} (was ${S._gamPatch.original.quarters[j]}) | EPS ${q.rows['EPS in Rs'][j]} | implied shares ${(q.rows['Net Profit'][j] / q.rows['EPS in Rs'][j]).toFixed(2)} cr`);
}
