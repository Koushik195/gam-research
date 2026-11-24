// NYKAA: in-memory fixes applied by src/model.js on every build (patchRaw); idempotent.
// 1. Minorities. Screener's consolidated "Net Profit" is profit BEFORE minorities (FY26 ₹204 cr) while
//    "EPS in Rs" is after them (₹0.70). Minorities hold 49% of Dot & Key and ~25% of Earth Rhythm, so the
//    engine's implied share count (Net Profit ÷ EPS = 291 cr) would be wrong. We replace Net Profit with
//    Screener's "Profit for EPS" schedule (attributable to owners), as UPL.patch.js does.
// 2. Share count. FY26 profit attributable to owners was ₹199.44 cr (FY26 annual report, consolidated P&L)
//    and 286.33 cr shares of ₹1 were in issue at Mar-26 (equity share capital ₹286.33 cr). Screener's EPS is
//    rounded to ₹0.70, which would give 284.9 cr shares, so FY26 EPS is restated to ₹199.44 cr ÷ 286.33 cr.
const SHARES = 286.33; // crore, issued shares at Mar-26 (FY26 annual report, published 1-Aug-2026)
const PAT26 = 199.44; // ₹ crore, profit attributable to equity holders of the parent, FY26

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit → Screener "Profit for EPS" (after minorities); FY26 EPS restated on 286.33 cr issued shares. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`NYKAA patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  if (j < 0) throw new Error('NYKAA patch: no Mar 2026 column');
  keep.eps26 = pl.rows['EPS in Rs'][j];
  pl.rows['Net Profit'][j] = PAT26;
  pl.rows['EPS in Rs'][j] = Math.round(PAT26 / SHARES * 1e5) / 1e5;
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES };
