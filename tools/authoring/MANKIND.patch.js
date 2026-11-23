// MANKIND: two corrections to Screener's consolidated data, applied in memory by src/model.js on every build.
// (1) NET PROFIT ON THE ATTRIBUTABLE BASIS. Screener's "Net Profit" row is profit BEFORE minority interests (FY26
//     Rs1,938.10 cr = company "profit for the year"), while "EPS in Rs" is AFTER them (Rs46.34 on Rs1,912.93 cr
//     attributable to owners; minorities Rs25.17 cr, mainly the outside partners in Penta Latex LLP and other
//     partnership subsidiaries; AR FY26 consolidated P&L). The engine infers shares as Net Profit / EPS, which gives
//     41.82 cr shares instead of the real 41.28 cr (equity capital Rs41.28 cr at Rs1 a share, AR FY26 note 20). We
//     replace the annual and quarterly rows with Screener's own "Profit for EPS" schedule (profit attributable to
//     owners), as CIPLA.patch.js and UPL.patch.js do. FY26: Rs1,913 cr, 41.28 cr shares.
// (2) DROP THE ISOLATED "Mar 2015" COLUMN. Mankind listed in May-2023; Screener's annual tables jump from Mar 2015
//     (from the IPO prospectus) to Mar 2020, with FY16-FY19 missing. Kept, it shows as a fake five-year step in the
//     FY-axis charts and growth rates. The model history therefore runs FY20-FY26 (seven years).
// (3) DEFERRED TAX OUT OF WORKING CAPITAL (engine workaround, as TORNTPHARM.patch.js note 2). Screener's Mar-26
//     "Other Liabilities" (₹5,143 cr) include the ₹1,839.98 cr deferred tax liability (almost all of it the ₹1,799.87 cr
//     created on BSV's acquired intangibles; AR FY25 note 53) and "Other Assets" include ₹324.70 cr of deferred tax
//     assets (AR FY26 balance sheet). Neither is working capital: left in, the engine's working capital is 2.8% of
//     sales against the company's 52 days of net operating working capital (~14%), and growth would need almost no
//     cash. assumptions.json sets otherTreasury.base = -(DTL - DTA) = -₹1,515.28 cr, which the engine and the Excel
//     both take out of working capital (13.4% of FY26 sales) and add to net cash; Investments are raised by the same
//     amount here so net debt is unchanged; CWIP is lowered by the same amount (a modelling line the engine holds
//     flat) so the balance sheet still balances. src/excel.js reads other liabilities from the unpatched file and
//     investments/CWIP from the model, so the Excel model matches. Engine limit (reported): the BSV DTL unwinds by ~₹113
//     cr a year (book tax is below cash tax because the amortisation is not deductible); MANKIND.ctx.js deducts it in
//     our own net-debt path.
// Not changed: the quarterly and annual EPS, sales and EBITDA; the TTM column (the as-of freeze recomputes it from the
// four quarters released by 30-Sep-2026). forwardMedian / forwardSeries read the unpatched screener.json, but they
// use only "EPS in Rs", which this patch does not touch.
// Originals are kept under _gamPatch. Idempotent. Usage: node tools/authoring/MANKIND.patch.js (prints the checks).
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'MANKIND', 'screener.json');
const DROP = /^Mar 2015$/;
const DTL = 1839.98, DTA = 324.70, OFFSET = Math.round((DTL - DTA) * 100) / 100; // assumptions.otherTreasury.base = -OFFSET
const r2 = v => Math.round(v * 100) / 100;

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS" (attributable to owners); Mar 2015 annual column dropped (FY16-19 missing). Originals below.', fetchedAt: S.fetchedAt, original: {}, dropped: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`MANKIND patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  for (const tab of ['profit-loss', 'balance-sheet', 'cash-flow', 'ratios']) {
    const T = S.tables?.[tab];
    if (!T) continue;
    const idx = T.periods.map((p, i) => (DROP.test(p) ? i : -1)).filter(i => i >= 0);
    if (!idx.length) continue;
    keep.dropped[tab] = { periods: idx.map(i => T.periods[i]), rows: Object.fromEntries(Object.entries(T.rows).map(([k, v]) => [k, idx.map(i => v[i])])) };
    T.periods = T.periods.filter((_, i) => !idx.includes(i));
    for (const k of Object.keys(T.rows)) if (Array.isArray(T.rows[k])) T.rows[k] = T.rows[k].filter((_, i) => !idx.includes(i));
  }
  const bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026');
  keep.original.bsMar26 = { Investments: bs.rows.Investments[k], CWIP: bs.rows.CWIP[k] };
  bs.rows.Investments[k] = r2(bs.rows.Investments[k] + OFFSET);
  bs.rows.CWIP[k] = r2(bs.rows.CWIP[k] - OFFSET);
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, DTL, DTA, OFFSET };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'];
  console.log('annual periods', pl.periods.join(' | '));
  for (const p of ['Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p), o = S._gamPatch.original['profit-loss'][pl.periods.indexOf(p) + 1];
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} (was ${o}) | EPS ${pl.rows['EPS in Rs'][i]} | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)} cr (actual 40.06 cr to FY24, 41.26 cr FY25, 41.28 cr FY26)`);
  }
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log(`Q1FY27 | Net Profit ${q.rows['Net Profit'][j]} | EPS ${q.rows['EPS in Rs'][j]} | implied shares ${(q.rows['Net Profit'][j] / q.rows['EPS in Rs'][j]).toFixed(2)} cr`);
  const bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026'), R = bs.rows, cash = S.schedules['balance-sheet']['Other Assets']['Cash Equivalents']['Mar 2026'];
  const tl = R['Equity Capital'][k] + R.Reserves[k] + R.Borrowings[k] + R['Other Liabilities'][k], ta = R['Fixed Assets'][k] + R.CWIP[k] + R.Investments[k] + R['Other Assets'][k];
  console.log(`Mar-26 | liabilities ${r2(tl)} assets ${r2(ta)} | net debt with otherTreasury -${OFFSET}: ${r2(R.Borrowings[k] - cash - R.Investments[k] + OFFSET)} | working capital % of sales ${((R['Other Assets'][k] - cash + OFFSET - R['Other Liabilities'][k]) / pl.rows.Sales[pl.periods.indexOf('Mar 2026')] * 100).toFixed(2)}`);
}
