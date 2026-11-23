// DRREDDY: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs4,158 cr; Ind AS "profit for the
// year" Rs4,157.6 cr, AR FY26 consolidated P&L) while "EPS in Rs" (Rs50.27) is AFTER minorities. The minority is
// Nestle India's 49% of the nutraceuticals subsidiary "Dr. Reddy's and Nestle Health Science Limited" (AR FY26 note
// 2.39 A): it absorbed a Rs38.4 cr loss in FY26 and took Rs70.1 cr of profit in FY25. The engine infers shares as
// Net Profit / EPS, which gives 82.71 cr shares for FY26 instead of the real 83.47 cr (835 mn shares of Re1, equity
// capital Rs83.5 cr; 834.7 mn per the PL and Emkay notes of Jul-2026), a 0.9% error in every per-share value, and
// 84.5 cr for FY25. We replace the row with Screener's own "Profit for EPS" schedule (= profit attributable to equity
// holders: FY26 Rs4,196 cr, FY25 Rs5,655 cr; Q1FY27 Rs444 cr vs Rs443.5 cr in the IFRS release of 22-Jul-2026), as
// CIPLA.patch.js and ZYDUSLIFE.patch.js do. The Jun-2026 quarter on Screener matches the filing (revenue Rs8,099.8 cr,
// EBITDA Rs861 cr, PBT Rs553 cr, PAT Rs435.5 cr: ICICI Direct result note of 24-Jul-2026), so no quarter is reset.
// The original rows are kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/DRREDDY.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'DRREDDY', 'screener.json');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to equity holders, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`DRREDDY patch: no Profit for EPS schedule for ${tab}`);
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
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} (was ${S._gamPatch.original['profit-loss'][i]}) | EPS ${pl.rows['EPS in Rs'][i]} | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)} cr (actual ~83.4 cr)`);
  }
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log('Q1FY27 | sales', q.rows.Sales[j], 'EBITDA', q.rows['Operating Profit'][j], 'PBT', q.rows['Profit before tax'][j], 'attributable PAT', q.rows['Net Profit'][j], 'EPS', q.rows['EPS in Rs'][j]);
}
