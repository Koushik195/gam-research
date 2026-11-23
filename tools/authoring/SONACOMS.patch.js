// SONACOMS: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs629 cr) while "EPS in Rs" is
// attributable to owners (Rs10.29). The minorities are NOVELIC's outside shareholders, whose share of NOVELIC's
// losses ADDS to Sona's attributable profit (FY26 Rs640 cr = company-reported PAT Rs641 cr). The engine infers shares
// as Net Profit / EPS: 629 / 10.29 = 61.1 cr shares instead of the actual 62.18 cr (AR FY26 note 13A), so every
// per-share value would be ~1.7% off. We replace the row with Screener's own "Profit for EPS" schedule, as
// MOTHERSON.patch.js / UPL.patch.js do (FY26 640 / 10.29 = 62.2 cr shares). Quarterly Jun-2026 becomes Rs180 cr
// (company: Rs180.5 cr). Applied in memory by src/model.js on every build; the original row is kept under _gamPatch.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`SONACOMS patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  // Annual history starts at FY19. Screener's FY15-FY17 columns are standalone ("(S)"), and FY18 is the year of the
  // Comstar transaction: its consolidated balance sheet shows zero net worth (equity Rs28 cr, reserves -Rs28 cr), which
  // makes every FY18 equity ratio a division by zero (the Excel model's debt/equity cell errors) and is not comparable.
  keep.droppedYears = [];
  for (const tab of ['profit-loss', 'balance-sheet', 'cash-flow', 'ratios']) {
    const T = S.tables[tab]; if (!T) continue;
    const idx = T.periods.map((p, i) => (/^Mar 201[5-8]/.test(p) ? i : -1)).filter(i => i >= 0);
    if (tab === 'profit-loss') keep.droppedYears = idx.map(i => T.periods[i]);
    T.periods = T.periods.filter((_, i) => !idx.includes(i));
    for (const k of Object.keys(T.rows)) T.rows[k] = T.rows[k].filter((_, i) => !idx.includes(i));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
