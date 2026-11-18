// DEEPAKFERT: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 ₹739 cr) while "EPS in
// Rs" is AFTER minorities (₹58.40 on ₹737.25 cr attributable to owners). The engine infers shares as
// Net Profit / EPS: 739 / 58.4 = 12.65 cr instead of the actual 12.62 cr (12,62,37,825 shares, FY26
// annual report note 19). Minorities were small (Platinum Blasting's 15% until Nov-2025, ₹1.5 cr in
// FY26; ₹11 cr in FY25), but the gap still distorts every per-share number by ~0.2%. We replace the row
// with Screener's own "Profit for EPS" schedule (= profit attributable to owners), as UPL.patch.js and
// TATACHEM.patch.js do. In-memory only: src/model.js applies patchRaw on every build, so screener.json
// is never edited and a re-fetch cannot undo it. The original row is kept under _gamPatch.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) continue; // nothing to patch: leave the row as fetched
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}
module.exports = { patchRaw };
