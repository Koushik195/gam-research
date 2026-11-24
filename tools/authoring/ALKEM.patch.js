// ALKEM: two corrections to Screener's consolidated data, applied in memory by src/model.js on every build.
// (1) NET PROFIT ON THE ATTRIBUTABLE BASIS. Screener's "Net Profit" row is profit BEFORE minority interests (FY26
//     Rs2,351 cr = company "profit for the year" Rs2,351.16 cr), while "EPS in Rs" is AFTER them (Rs192.51 on
//     Rs2,301.80 cr attributable to owners; minorities Rs49.36 cr: 49% of Indchemie Health Specialities, 39.4% of
//     Cachet Pharmaceuticals and 0.45% of Enzene Biosciences; AR FY26 consolidated P&L and note 3.37). The engine infers
//     shares as Net Profit / EPS, which gives 12.21 cr shares instead of the real 11.957 cr (equity capital Rs23.91 cr at
//     Rs2 a share, AR FY26). We replace the annual and quarterly rows with Screener's own "Profit for EPS" schedule
//     (profit attributable to owners), as CIPLA.patch.js and MANKIND.patch.js do. FY26: Rs2,302 cr, 11.958 cr shares.
// (2) DEFERRED TAX AND MINORITIES OUT OF WORKING CAPITAL (engine workaround, as MANKIND.patch.js note 3). Screener's
//     Mar-26 "Other Assets" (Rs14,836 cr) include the Rs1,819.35 cr net deferred tax asset (of which Rs1,484.70 cr is MAT
//     credit; AR FY26 note 3.7C) and "Other Liabilities" (Rs4,991 cr) include Rs528.83 cr of non-controlling interests
//     (minority equity) and a Rs15.12 cr deferred tax liability. None of these is working capital: left in, the engine's
//     working capital is 31.4% of sales and every rupee of growth would tie up 31 paise, when the trade cycle is ~23%.
//     assumptions.json sets otherTreasury.base = Rs4,770.7 cr = (a) Rs3,495.3 cr of bank and NBFC deposits held in other
//     financial assets, which bring the model's opening net cash to the company's Rs5,474 cr at Mar-26 (Q4FY26 deck) less
//     Rs423.7 cr of lease liabilities, plus (b) the Rs1,804.2 cr net deferred tax, less (c) the Rs528.8 cr minorities.
//     Parts (b) and (c) are not cash, so Investments are lowered here by their net Rs1,275.4 cr (net cash stays at the
//     company figure) and CWIP is raised by the same amount (a modelling line the engine holds flat) so the balance sheet
//     still balances. src/excel.js reads other assets/liabilities from Screener's schedules and investments/CWIP from
//     the model, so the Excel model matches. The MAT credit (Rs1,485 cr) will lower cash tax under the new regime the
//     company adopted from FY27 (AR FY26 note 3.7C, Finance Act 2026); its pace is not disclosed, so neither the engine
//     nor our net-cash path counts it (ALKEM.ctx.js shows it as an unmodelled asset).
// Not changed: the quarterly and annual EPS, sales and EBITDA; the TTM column (the as-of freeze recomputes it from the
// four quarters released by 30-Sep-2026). forwardMedian / forwardSeries read the unpatched screener.json, but they use
// only "EPS in Rs", which this patch does not touch.
// Originals are kept under _gamPatch. Idempotent. Usage: node tools/authoring/ALKEM.patch.js (prints the checks).
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ALKEM', 'screener.json');
const DTA = 1819.35, DTL = 15.12, NCI = 528.83, DEPOSITS = 3495.3;
const NONCASH = Math.round((DTA - DTL - NCI) * 10) / 10; // 1,275.4: moved Investments -> CWIP
const OT = Math.round((DEPOSITS + DTA - DTL - NCI) * 10) / 10; // assumptions.otherTreasury.base
const r2 = v => Math.round(v * 100) / 100;

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS" (attributable to owners); Mar-26 Investments -1,275.4 / CWIP +1,275.4 (deferred tax and minorities out of working capital). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`ALKEM patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  const bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026');
  if (k < 0) throw new Error('ALKEM patch: no Mar 2026 balance sheet');
  keep.original.bsMar26 = { Investments: bs.rows.Investments[k], CWIP: bs.rows.CWIP[k] };
  bs.rows.Investments[k] = r2(bs.rows.Investments[k] - NONCASH);
  bs.rows.CWIP[k] = r2(bs.rows.CWIP[k] + NONCASH);
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, DTA, DTL, NCI, DEPOSITS, NONCASH, OT };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'];
  for (const p of ['Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} (was ${S._gamPatch.original['profit-loss'][i]}) | EPS ${pl.rows['EPS in Rs'][i]} | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(3)} cr (actual 11.957 cr)`);
  }
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log(`Q1FY27 | Net Profit ${q.rows['Net Profit'][j]} | EPS ${q.rows['EPS in Rs'][j]} | implied shares ${(q.rows['Net Profit'][j] / q.rows['EPS in Rs'][j]).toFixed(3)} cr`);
  const bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026'), R = bs.rows, cash = S.schedules['balance-sheet']['Other Assets']['Cash Equivalents']['Mar 2026'];
  const tl = R['Equity Capital'][k] + R.Reserves[k] + R.Borrowings[k] + R['Other Liabilities'][k], ta = R['Fixed Assets'][k] + R.CWIP[k] + R.Investments[k] + R['Other Assets'][k];
  console.log(`Mar-26 | liabilities ${r2(tl)} assets ${r2(ta)} | engine net cash with otherTreasury ${OT}: ${r2(cash + R.Investments[k] + OT - R.Borrowings[k])} (target 5,474 - 423.7 leases = 5,050.3) | working capital % of sales ${((R['Other Assets'][k] - cash - OT - R['Other Liabilities'][k]) / pl.rows.Sales[pl.periods.indexOf('Mar 2026')] * 100).toFixed(2)}`);
}
