// IPCALAB: two corrections to Screener's consolidated data, applied in memory by src/model.js on every build.
// (1) NET PROFIT ON THE ATTRIBUTABLE BASIS. Screener's "Net Profit" row is profit BEFORE minority interests (FY26
//     Rs1,184 cr = AR FY26 "profit before non-controlling interest" Rs1,183.78 cr), while "EPS in Rs" is AFTER them
//     (Rs44.98 on Rs1,141.12 cr attributable to owners; non-controlling interest Rs42.66 cr: the 47.33% of Unichem
//     Laboratories Ipca does not own and the 41.12% of Trophic Wellness; AR FY26 consolidated P&L and BRSR list of
//     subsidiaries). The engine infers shares as Net Profit / EPS, which gives 26.32 cr shares instead of the real
//     25.37 cr (25,37,04,218 shares of Re1, AR FY26 note 34). As CIPLA.patch.js, MANKIND.patch.js and UPL.patch.js do,
//     we replace the annual and quarterly rows with Screener's own "Profit for EPS" schedule (profit attributable to
//     owners). FY26: Rs1,141 cr, 25.37 cr shares; Q1FY27: Rs402 cr (EPS Rs15.84).
// (2) NON-CONTROLLING INTEREST AND DEFERRED TAX OUT OF WORKING CAPITAL (engine workaround, as TORNTPHARM.patch.js
//     note 2 and MANKIND.patch.js note 3). Screener's Mar-26 "Other Liabilities" (Rs3,477 cr) include the Rs1,460.25 cr
//     non-controlling interest (Unichem's and Trophic's outside shareholders; AR FY26 consolidated balance sheet) and
//     the Rs244.86 cr net deferred tax liability; "Other Assets" include Rs20.54 cr of deferred tax assets. None of
//     these is working capital: left in, the engine's working capital is 21.5% of FY26 sales against the company's
//     ~144 days of net working capital (~39%; PL, 16-Aug-2026), and growth would need far too little cash.
//     assumptions.json sets otherTreasury.base = -(NCI + DTL - DTA) = -Rs1,684.57 cr, which the engine and the Excel
//     both take out of working capital (39.1% of FY26 sales) and add to net cash; Investments are raised here by the
//     same amount, so net cash is unchanged (Rs600 cr incl. leases and the Rs184 cr of equity-accounted Krebs/Lyka
//     stakes); and CWIP is lowered by the same amount (a modelling line the engine holds flat; Rs773 cr -> -Rs912 cr)
//     so the balance sheet still balances. src/excel.js reads other liabilities from the unpatched file and
//     investments/CWIP from the model, so the Excel model matches. Why net cash is NOT reduced by the NCI: the
//     minorities' share of future profit is carried in the forecast tax line (assumptions.taxBuild), so the DCF's
//     cash flows are already after minorities; deducting the NCI again would count it twice.
// Not changed: EPS, sales, EBITDA (Screener basis), the TTM column (the as-of freeze recomputes it from the four
// quarters released by 30-Sep-2026). forwardMedian / forwardSeries read the unpatched screener.json but use only
// "EPS in Rs", which this patch does not touch.
// Originals are kept under _gamPatch. Idempotent. Usage: node tools/authoring/IPCALAB.patch.js (prints the checks).
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'IPCALAB', 'screener.json');
const NCI = 1460.25, DTL = 244.86, DTA = 20.54, OFFSET = Math.round((NCI + DTL - DTA) * 100) / 100; // = 1684.57
const r2 = v => Math.round(v * 100) / 100;

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS" (attributable to owners); Mar-26 Investments +NCI+net DTL, CWIP -same (working-capital workaround). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`IPCALAB patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  const bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026');
  if (k < 0) throw new Error('IPCALAB patch: no Mar 2026 balance sheet');
  keep.original.bsMar26 = { Investments: bs.rows.Investments[k], CWIP: bs.rows.CWIP[k] };
  bs.rows.Investments[k] = r2(bs.rows.Investments[k] + OFFSET);
  bs.rows.CWIP[k] = r2(bs.rows.CWIP[k] - OFFSET);
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, NCI, DTL, DTA, OFFSET };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'];
  for (const p of ['Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} (was ${S._gamPatch.original['profit-loss'][i]}) | EPS ${pl.rows['EPS in Rs'][i]} | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)} cr (actual 25.37 cr)`);
  }
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log(`Q1FY27 | Net Profit ${q.rows['Net Profit'][j]} | EPS ${q.rows['EPS in Rs'][j]} | implied shares ${(q.rows['Net Profit'][j] / q.rows['EPS in Rs'][j]).toFixed(2)} cr`);
  const bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026'), R = bs.rows, cash = S.schedules['balance-sheet']['Other Assets']['Cash Equivalents']['Mar 2026'];
  const tl = R['Equity Capital'][k] + R.Reserves[k] + R.Borrowings[k] + R['Other Liabilities'][k], ta = R['Fixed Assets'][k] + R.CWIP[k] + R.Investments[k] + R['Other Assets'][k];
  console.log(`Mar-26 | liabilities ${r2(tl)} assets ${r2(ta)} | net cash with otherTreasury -${OFFSET}: ${r2(cash + R.Investments[k] - OFFSET - R.Borrowings[k])} | working capital % of sales ${((R['Other Assets'][k] - cash + OFFSET - R['Other Liabilities'][k]) / pl.rows.Sales[pl.periods.indexOf('Mar 2026')] * 100).toFixed(2)}`);
}
