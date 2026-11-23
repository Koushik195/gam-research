// TMPV (Tata Motors Passenger Vehicles): put Screener's "Net Profit" on the attributable basis (after minorities).
// Why: Screener's consolidated "Net Profit" is profit BEFORE minorities (FY26 Rs82,645 cr) while "EPS in Rs" is
// after them (Rs223.74). The engine infers shares as Net Profit / EPS (369.4 cr instead of the real 368.24 cr) and
// forecasts profit with no minority line. Minorities are small (Tata Technologies' public holders own 46.65%;
// FY26 minority share Rs255 cr), but we keep the model on the owners' basis: Net Profit rows are replaced by
// Screener's own "Profit for EPS" schedule (FY26 Rs82,390 cr = AR FY26 profit attributable to shareholders).
// History note (not patched, explained in the report): Screener's FY15-FY24 columns are the old Tata Motors
// (passenger + commercial vehicles); FY25 revenue/EBITDA are the re-presented continuing business (PV + JLR)
// while FY25 profit still includes the demerged CV business as discontinued operations; FY26 profit includes
// the CV business to Sep-2025 and the Rs82,616 cr non-cash demerger gain. Applied in memory by src/model.js on
// every build (patchRaw); idempotent; screener.json itself is never edited.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`TMPV patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
