// NAUKRI: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE non-controlling interests (FY26 Rs1,763 cr) while
// "EPS in Rs" is AFTER them (Rs22.36). The engine infers shares as Net Profit / EPS, which would give ~78.8 cr shares
// instead of the real 64.84 cr. Info Edge's minorities are mostly the outside investors in its controlled AIF trusts
// (Info Edge Venture Fund I/II, Capital 2B), whose share of the funds' fair-value gains was Rs313 cr in FY26 and
// Rs348 cr in FY25. We replace the row with Screener's own "Profit for EPS" schedule (= profit attributable to owners),
// as UPL.patch.js and TIINDIA.patch.js do. FY26: 1,450 / 22.36 = 64.85 cr shares (64.84 cr at Jun-2026). EPS needs no
// patch. Applied in memory by src/model.js on every build (patchRaw); the original rows are kept under _gamPatch.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`NAUKRI patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
