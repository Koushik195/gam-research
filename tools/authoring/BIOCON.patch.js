// BIOCON: put Screener's consolidated "Net Profit" on the attributable basis and set the share count to the one on the
// as-of date. Why: Screener's "Net Profit" row is profit BEFORE minorities (FY26 Rs369 cr, Q1FY27 Rs137 cr) while the
// minorities were large until January 2026: Viatris, Serum, Tata Capital and Activ Pine owned 23.2% of Biocon Biologics
// (AR FY26 note 39) and the public owns 47.6% of Syngene. FY25 profit before minorities was Rs1,429 cr against Rs1,013 cr
// attributable; in FY26 minorities took a share of BBL's loss (Rs-17 cr). The engine infers shares as Net Profit / EPS,
// so the unpatched FY26 row gives 155 cr shares instead of the real 162.97 cr. We replace the row with Screener's own
// "Profit for EPS" schedule (= profit attributable to owners), as SUNPHARMA.patch.js does. Screener's FY26 "EPS in Rs"
// (2.38) is not the reported EPS either (basic EPS was Rs2.82 on 136.7 cr weighted shares, AR FY26 note 31); it divides
// Rs386 cr by the 162.09 cr shares after the January 2026 QIP. We set FY26 EPS to Rs386 cr / 162.97 cr shares, the count
// after the 8.79 mn shares issued on 29-Jun-2026 for the last 0.8% of BBL (MOSL 6-Aug-2026: 1,630 mn shares; balance sheet
// 30-Jun-2026: share capital Rs815 cr at Rs5 a share), so per-share values use the share count on the as-of date. The
// original rows are kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/BIOCON.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'BIOCON', 'screener.json');
const SHARES_ASOF = 162.97; // crore shares at 30-Jun-2026 (162.09 after the Jan-2026 QIP + 0.879 issued on 29-Jun-2026)

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities); FY26 EPS set to Profit for EPS / 162.97 cr shares (count at 30-Jun-2026). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`BIOCON patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  const pl = S.tables['profit-loss'], i26 = pl.periods.indexOf('Mar 2026');
  if (i26 >= 0) {
    keep.original.eps = pl.rows['EPS in Rs'].slice();
    pl.rows['EPS in Rs'][i26] = Math.round(pl.rows['Net Profit'][i26] / SHARES_ASOF * 10000) / 10000;
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_ASOF };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  const pl = S.tables['profit-loss'];
  ['Mar 2024', 'Mar 2025', 'Mar 2026'].forEach(p => { const i = pl.periods.indexOf(p); console.log(p, '| Net Profit (attributable)', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)); });
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log('Q1FY27 | Net Profit', q.rows['Net Profit'][j], 'EPS', q.rows['EPS in Rs'][j], 'implied shares', (q.rows['Net Profit'][j] / q.rows['EPS in Rs'][j]).toFixed(2), '(actual 162.97 cr)');
}
