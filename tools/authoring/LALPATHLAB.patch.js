// LALPATHLAB: one correction to Screener's consolidated data, applied in memory by src/model.js on every build.
// NET PROFIT ON THE ATTRIBUTABLE BASIS. Screener's "Net Profit" row is profit BEFORE minority interests (FY26 Rs510 cr =
// AR FY26 "profit for the year" Rs509.75 cr), while "EPS in Rs" is AFTER them (Rs30.13 on Rs504.78 cr attributable to
// owners; non-controlling interests Rs4.98 cr: the 20% of Paliwal Diagnostics and APRL PathLabs, 30% of Centrapath and
// Chanre Laboratory and 28.17% of Dr Lal Path Labs Bangladesh that the company does not own; AR FY26 consolidated P&L
// and BRSR list of subsidiaries). The engine infers shares as Net Profit / EPS, which gives 16.93 cr shares instead of
// the real 16.76 cr (16,75,55,020 shares of Rs10 after the Dec-2025 1:1 bonus, AR FY26 note 34). As IPCALAB.patch.js,
// CIPLA.patch.js and UPL.patch.js do, we replace the annual and quarterly rows with Screener's own "Profit for EPS"
// schedule (profit attributable to owners). FY26: Rs505 cr, 16.76 cr shares; Q1FY27: Rs170 cr (EPS Rs10.11).
// Not changed: EPS, sales, EBITDA, the balance sheet (non-controlling interest is only Rs33 cr inside other liabilities)
// and the TTM column (the as-of freeze recomputes it from the four quarters released by 30-Sep-2026). forwardMedian /
// forwardSeries read the unpatched screener.json but use only "EPS in Rs", which this patch does not touch.
// Originals are kept under _gamPatch. Idempotent. Usage: node tools/authoring/LALPATHLAB.patch.js (prints the checks).
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'LALPATHLAB', 'screener.json');
const SHARES_ACTUAL = 16.7555020; // crore, AR FY26 note 34

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS" (attributable to owners). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`LALPATHLAB patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_ACTUAL };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'];
  for (const p of ['Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} (was ${S._gamPatch.original['profit-loss'][i]}) | EPS ${pl.rows['EPS in Rs'][i]} | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)} cr (actual ${SHARES_ACTUAL.toFixed(2)} cr)`);
  }
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log(`Q1FY27 | Net Profit ${q.rows['Net Profit'][j]} | EPS ${q.rows['EPS in Rs'][j]} | implied shares ${(q.rows['Net Profit'][j] / q.rows['EPS in Rs'][j]).toFixed(2)} cr`);
}
