// GLENMARK: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities, while "EPS in Rs" is AFTER minorities. While
// Glenmark Life Sciences (GLS) was 82.84% owned (IPO Jul-2021 to its sale to Nirma in Mar-2024), the minorities were
// material: FY22 Net Profit Rs994 cr vs Rs942 cr attributable, FY23 Rs377 cr vs Rs297 cr, FY24 -Rs1,434 cr vs -Rs1,502 cr.
// The engine infers shares as Net Profit / EPS, which gives 29.8 cr (FY22) and 35.8 cr (FY23) shares instead of the real
// 28.22 cr (equity capital Rs28.22 cr at Rs1 a share, AR FY26 balance sheet). FY25-26 minorities are nil (FY26 Rs0.1 cr),
// so the base year is unaffected, but the history (ROE, per-share series) is. We replace the row with Screener's own
// "Profit for EPS" schedule (= profit attributable to owners), as LUPIN.patch.js and CIPLA.patch.js do. The original row
// is kept under _gamPatch. Idempotent. Usage: node tools/authoring/GLENMARK.patch.js (prints the check; src/model.js
// applies patchRaw in memory on every build, so a re-fetch cannot undo it).
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'GLENMARK', 'screener.json');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`GLENMARK patch: no Profit for EPS schedule for ${tab}`);
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
  for (const p of ['Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} (was ${S._gamPatch.original['profit-loss'][i]}) | EPS ${pl.rows['EPS in Rs'][i]} | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)} cr (actual 28.22 cr)`);
  }
}
