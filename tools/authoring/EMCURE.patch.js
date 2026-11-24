// EMCURE: one correction to Screener's consolidated data, applied in memory by src/model.js on every build.
// NET PROFIT ON THE ATTRIBUTABLE BASIS. Screener's "Net Profit" row is profit BEFORE minority interests (FY26 Rs941 cr =
// the company's "profit for the year" of Rs9,412.69 mn), while "EPS in Rs" is AFTER them (Rs48.77 on Rs9,243.61 mn
// attributable to owners; non-controlling interests Rs169.08 mn: the 20.42% of Zuventus Healthcare held by outsiders until
// 3-Oct-2025 and the 12.05% of Gennova Biopharmaceuticals held by outsiders until Jul-2026; AR FY26 consolidated P&L and
// note 57). The engine infers shares as Net Profit / EPS, which gives 19.30 cr shares instead of the real 18.96 cr (equity
// capital Rs1,895.90 mn at Rs10 a share). We replace the annual and quarterly rows with Screener's own "Profit for EPS"
// schedule (profit attributable to owners), as UPL.patch.js and MANKIND.patch.js do. FY26: Rs924 cr, 18.95 cr shares.
// From FY27 both subsidiaries are wholly owned, so forecasts need no minority line.
// Not changed: sales, EBITDA, EPS, the balance sheet; the TTM column (the as-of freeze recomputes it from the four quarters
// released by 30-Sep-2026). forwardMedian / forwardSeries read the unpatched screener.json but use only "EPS in Rs".
// Originals are kept under _gamPatch. Idempotent. Usage: node tools/authoring/EMCURE.patch.js (prints the checks).
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'EMCURE', 'screener.json');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS" (attributable to owners). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`EMCURE patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'];
  for (const p of ['Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} (was ${S._gamPatch.original['profit-loss'][i]}) | EPS ${pl.rows['EPS in Rs'][i]} | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)} cr (actual 18.12 cr to FY24, 18.95 cr FY25, 18.96 cr FY26)`);
  }
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log(`Q1FY27 | Net Profit ${q.rows['Net Profit'][j]} | EPS ${q.rows['EPS in Rs'][j]} | implied shares ${(q.rows['Net Profit'][j] / q.rows['EPS in Rs'][j]).toFixed(2)} cr`);
}
