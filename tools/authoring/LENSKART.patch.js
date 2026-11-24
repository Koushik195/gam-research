// LENSKART: in-memory fix applied by src/model.js on every build (patchRaw); idempotent. Never edit screener.json.
// Net Profit on the attributable basis. Screener's consolidated "Net Profit" is profit BEFORE minorities (FY26 ₹501 cr)
// while "EPS in Rs" is after them (owners ₹493.6 cr, AR FY26 P&L; minorities ₹7.3 cr in FY26, ₹7 cr in Q1FY27 alone,
// mainly Owndays and the Thailand/Middle East partner entities). The engine infers shares as Net Profit ÷ EPS, which
// would give ~176 cr shares instead of ~174 cr, so we replace the row with Screener's own "Profit for EPS" schedule
// (UPL / TATACHEM precedent). Screener's other quirks checked for this recent listing: no "(S)" labels, cash-flow rows
// on the right years (FY26 CFO ₹1,670 cr = AR ₹1,669.6 cr), and the post-as-of Sep-2026 quarter, balance sheet and
// shareholding columns are dropped by the engine's as-of freeze (assumptions.asOf).
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables?.[tab], pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`LENSKART patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
if (require.main === module) {
  const S = patchRaw(JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'data', 'raw', 'LENSKART', 'screener.json'), 'utf8')));
  for (const t of ['profit-loss', 'quarters']) console.log(t, S.tables[t].periods.join(' | '), '\n', S.tables[t].rows['Net Profit'].join(' | '), '\n', S.tables[t].rows['EPS in Rs'].join(' | '));
}
