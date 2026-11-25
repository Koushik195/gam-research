// BLS: data corrections applied in memory by src/model.js on every build (patchRaw; idempotent). Never edit screener.json.
// 1. Profit on the attributable basis. Screener's consolidated "Net Profit" is BEFORE minorities (FY26 Rs724 cr) while
//    "EPS in Rs" is AFTER them (Rs16.68). The engine infers shares as Net Profit / EPS (43.4 cr instead of 41.17 cr), so we
//    use Screener's own "Profit for EPS" schedule (FY26 Rs687 cr = 41.19 cr shares), as UPL / KIMS do. Minorities are
//    ~47% of BLS E-Services (listed digital arm), 43% of Aadifidelis and 9% of Zero Mass: Rs37 cr in FY26, Rs12 cr in Q1FY27.
// 2. Mar-26 balance sheet pro forma for cash spent on acquisitions after March and before the 30-Sep-2026 as-of date
//    (BOSCHLTD / KIMS precedent: tables only, because src/excel.js reads cash and gross block from the unpatched
//    schedules; investments and CWIP come from the tables, so engine and Excel agree):
//    - Atyati Technologies: 100% bought by BLS E-Services on 2-Jul-2026 for Rs156.82 cr in cash (company release; the
//      Rs138 cr re-allocated from the subsidiary's IPO proceeds plus internal cash). Atyati's own cash and debt were not
//      published by 30-Sep-2026 (gap), so we take the full price out of treasury (investments) and hold the acquired
//      business as a non-depreciating asset in CWIP (the engine keeps CWIP flat; goodwill is not amortised).
//    - BLS E-Services shares: BLS bought 2.21% more in the market in Apr-Aug 2026 for Rs45.22 cr (filing, 20-Aug-2026):
//      an equity transaction with minorities, so investments and reserves both fall by Rs45.22 cr (the small fall in
//      the minorities' book value is ignored).
// Usage (check only): node tools/authoring/BLS.patch.js
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'BLS', 'screener.json');
const PF = { atyati: 156.82, blseStake: 45.22 };
const r1 = v => Math.round(v * 10) / 10;

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS" (attributable); Mar-26 pro forma for the Atyati purchase (2-Jul-2026) and BLS E-Services share purchases (Apr-Aug 2026). Originals below.', fetchedAt: S.fetchedAt, pf: PF, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab], pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`BLS patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[`${tab}.Net Profit`] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  const bs = S.tables['balance-sheet'], j = bs.periods.indexOf('Mar 2026');
  if (j < 0) throw new Error('BLS patch: no Mar 2026 balance sheet');
  keep.original['bs.Mar26'] = Object.fromEntries(['Investments', 'CWIP', 'Reserves', 'Total Liabilities', 'Total Assets'].map(k => [k, bs.rows[k][j]]));
  bs.rows.Investments[j] = r1(bs.rows.Investments[j] - PF.atyati - PF.blseStake);
  bs.rows.CWIP[j] = r1(bs.rows.CWIP[j] + PF.atyati);
  for (const k of ['Reserves', 'Total Liabilities', 'Total Assets']) bs.rows[k][j] = r1(bs.rows[k][j] - PF.blseStake);
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, PF };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  const pl = S.tables['profit-loss'], i = pl.periods.indexOf('Mar 2026'), bs = S.tables['balance-sheet'], j = bs.periods.indexOf('Mar 2026');
  console.log('FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2));
  console.log('Mar-26', Object.fromEntries(Object.keys(bs.rows).map(k => [k, bs.rows[k][j]])), JSON.stringify(S._gamPatch.original['bs.Mar26']));
}
