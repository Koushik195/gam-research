// DEVYANI: in-memory fix applied by src/model.js on every build (patchRaw); idempotent. Never edit screener.json.
// Net Profit on the attributable basis. Screener's consolidated "Net Profit" is profit BEFORE minorities (FY26 -Rs43 cr,
// Q1FY27 Rs17.1 cr) while "EPS in Rs" is after them (owners -Rs38.6 cr in FY26, Rs14.6 cr in Q1FY27; AR FY26 consolidated
// P&L and note 51; Q1FY27 results). Minorities: 49% of Devyani International DMCC (Camas, a Temasek affiliate; 52.45%
// effective NCI in the Thai KFC business), 12.69% of RV Enterprizes (Nigeria) and, until 7-Mar-2026, the Sky Gate founders.
// The engine infers shares as Net Profit / EPS, which is meaningless when profit is near zero and minorities flip its sign,
// so we replace the row with Screener's own "Profit for EPS" schedule (UPL / TATACHEM / JUBLFOOD precedent). The Sep-2026
// quarter and balance-sheet columns are dropped by the as-of freeze.
const SHARES_MAR26 = 123.2939791; // crore (AR FY26 directors' report)

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables?.[tab], pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`DEVYANI patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  // Base-year precision: with a loss of ~Rs39 cr, Screener's rounded figures (-39 / -0.31) imply 125.8 cr shares. Use the
  // AR FY26 figures instead: owners' loss Rs386.31 mn (note 33) on 1,23,29,39,791 shares outstanding at Mar-2026.
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  if (j >= 0) {
    keep.original.eps = pl.rows['EPS in Rs'].slice();
    pl.rows['Net Profit'][j] = -38.631;
    pl.rows['EPS in Rs'][j] = -38.631 / SHARES_MAR26;
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_MAR26 };
if (require.main === module) {
  const S = patchRaw(JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'data', 'raw', 'DEVYANI', 'screener.json'), 'utf8')));
  for (const t of ['profit-loss', 'quarters']) console.log(t, S.tables[t].periods.join(' | '), '\n', S.tables[t].rows['Net Profit'].join(' | '), '\n', S.tables[t].rows['EPS in Rs'].join(' | '));
}
