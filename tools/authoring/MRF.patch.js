// MRF: drop the two columns that are not twelve-month March years. MRF used a September year until
// Sep-2014 and then moved to March, so Screener's annual tables start with "Sep 2014" (12 months to
// Sep-2014) and "Mar 2016 18m" (18 months, Oct-2014 to Mar-2016; balance sheet "Mar 2016"). Kept in the
// model they show a fake +51% / -34% revenue swing (FY16 / FY17) and break growth rates, ratios and the
// FY-axis charts. From FY17 every column is a normal April-March year, so the model history starts at
// FY17 (ten years). Nothing else is changed: Net Profit equals profit attributable to owners (minorities
// ₹0.01 cr) and EPS = Net Profit / 42,41,143 shares. Applied in memory by src/model.js on every build;
// the dropped columns are kept under _gamPatch. forwardSeries/forwardMedian read screener.json directly
// and use only "Mar" columns from Apr-2021, so the house P/E median is unaffected.
const DROP = /^(Sep 2014|Mar 2016)/;

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Sep 2014 (September year) and Mar 2016 (18-month transition period) removed from annual tables.', fetchedAt: S.fetchedAt, dropped: {} };
  for (const tab of ['profit-loss', 'balance-sheet', 'cash-flow', 'ratios']) {
    const T = S.tables?.[tab];
    if (!T) continue;
    const idx = T.periods.map((p, i) => (DROP.test(p) ? i : -1)).filter(i => i >= 0);
    if (!idx.length) continue;
    keep.dropped[tab] = idx.map(i => T.periods[i]);
    T.periods = T.periods.filter((_, i) => !idx.includes(i));
    for (const k of Object.keys(T.rows)) if (Array.isArray(T.rows[k])) T.rows[k] = T.rows[k].filter((_, i) => !idx.includes(i));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
