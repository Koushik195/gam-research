// FIRSTCRY (Brainbees Solutions): in-memory fixes applied by src/model.js on every build (patchRaw); idempotent.
// Never edit screener.json.
// 1. Minorities. Screener's consolidated "Net Profit" is the loss BEFORE minorities (FY26 −₹204 cr) while "EPS in Rs" is
//    after them (−₹2.69). Minorities own 48.32% of Globalbees (FirstCry holds 51.68%, FY26 annual report) and absorbed
//    ₹63.4 cr of the FY26 loss, so the engine's implied share count (Net Profit ÷ EPS) would be wrong. We replace Net Profit
//    with Screener's "Profit for EPS" schedule (attributable to owners), as NYKAA.patch.js / UPL.patch.js do.
// 2. Share count. The FY26 loss attributable to owners was ₹140.22 cr (FY26 annual report, consolidated P&L). We value the
//    company on the company's own fully diluted count: 522.1 mn basic shares at 30-Jun-2026 (incl. 36.5 mn held by the
//    Brainbees ESOP Trust) + 0.5 mn time-based and 9.8 mn performance-based options = 532.4 mn (Q1FY27 investor
//    presentation, 13-Aug-2026, slide 43; JM Financial also uses 533 mn diluted). FY26 EPS is restated on 53.24 cr shares.
// 3. Leaks after the as-of date: Screener carries a Sep-2026 quarter, a Sep-2026 half-year balance sheet and a Sep-2026
//    shareholding column. The engine's as-of freeze drops all three (released after 30-Sep-2026); nothing else to restore.
const SHARES_FD = 53.24; // crore, fully diluted (company definition) at 30-Jun-2026
const PAT26 = -140.22; // ₹ crore, loss attributable to owners of the company, FY26

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'FIRSTCRY.patch.js: Net Profit → Screener "Profit for EPS" (after minorities); FY26 EPS on 53.24 cr fully diluted shares.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`FIRSTCRY patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  if (j < 0) throw new Error('FIRSTCRY patch: no Mar 2026 column');
  keep.eps26 = pl.rows['EPS in Rs'][j];
  pl.rows['Net Profit'][j] = PAT26;
  pl.rows['EPS in Rs'][j] = Math.round(PAT26 / SHARES_FD * 1e5) / 1e5;
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_FD };
