// MOTHERSON: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs4,086 cr) while
// "EPS in Rs" is AFTER minorities (Rs3.66). The engine infers shares as Net Profit / EPS, which gives
// 1,116 cr shares instead of the real 1,055 cr, and every per-share value goes wrong. Samvardhana
// Motherson's minorities are material (Rs226 cr in FY26, Rs343 cr in FY25; before the Jan-2022
// reorganisation the 49% of SMRP BV owned by SAMIL made them Rs300-660 cr a year), so we replace the row
// with Screener's own "Profit for EPS" schedule (= profit attributable to owners), as UPL.patch.js and
// TATACHEM.patch.js do. EPS needs no patch: Screener already restates it for the 1:2 bonus issues of
// Oct-2022 and Jul-2025 (FY26 3,860 / 3.66 = 1,055 cr shares = 10,554 mn shares at Mar-2026).
// Applied in memory by src/model.js on every build (patchRaw); the original row is kept under _gamPatch.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`MOTHERSON patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
