// JUBLFOOD: in-memory fix applied by src/model.js on every build (patchRaw); idempotent. Never edit screener.json.
// Net Profit on the attributable basis. Screener's consolidated "Net Profit" is profit BEFORE minorities (FY26 Rs444 cr)
// while "EPS in Rs" is after them (owners Rs428.5 cr, AR FY26 consolidated P&L; non-controlling interest Rs15.8 cr in FY26:
// DP Eurasia's ~6.35% outside holders and the 49% partner in Jubilant Golden Harvest, Bangladesh). The engine infers
// shares as Net Profit / EPS, which would give ~68 cr shares instead of ~66 cr, so we replace the row with Screener's own
// "Profit for EPS" schedule (UPL / TATACHEM / LENSKART precedent). Other Screener quirks checked: FY25-FY26 annual rows are
// the re-presented continuing-operations figures (Dunkin' discontinued, AR FY26); Q1-Q2FY26 quarters are as first
// reported (Dunkin' still inside); the Sep-2026 quarter and balance-sheet columns are dropped by the as-of freeze.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables?.[tab], pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`JUBLFOOD patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
if (require.main === module) {
  const S = patchRaw(JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'data', 'raw', 'JUBLFOOD', 'screener.json'), 'utf8')));
  for (const t of ['profit-loss', 'quarters']) console.log(t, S.tables[t].periods.join(' | '), '\n', S.tables[t].rows['Net Profit'].join(' | '), '\n', S.tables[t].rows['EPS in Rs'].join(' | '));
}
