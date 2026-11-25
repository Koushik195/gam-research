// Reliance Industries: put Screener's "Net Profit" on the attributable basis (after minorities).
// Why: Screener's consolidated "Net Profit" is profit BEFORE minorities (FY26 Rs95,754 cr) while "EPS in Rs" is after
// them (Rs59.69). The engine infers shares as Net Profit / EPS (1,604 cr instead of the real 1,353.2 cr) and forecasts
// profit with no minority line. Minorities are large and growing: outside investors own 33.57% of Jio Platforms (Meta,
// Google, PIF, KKR and others), 16.44% of Reliance Retail Ventures and of Reliance Consumer Products, and roughly half of
// JioStar; FY26 minority share Rs14,979 cr. So the Net Profit rows are replaced by Screener's own "Profit for EPS"
// schedule (FY26 Rs80,775 cr = AR FY26 profit attributable to owners). In forecasts the tax line carries the minority
// share (assumptions.json _taxWhy). Applied in memory by src/model.js on every build (patchRaw); idempotent;
// screener.json itself is never edited.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`RELIANCE patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
