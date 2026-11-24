// GLAXO: two corrections to Screener's consolidated data, applied in memory by src/model.js on every build.
// (1) FY15 PERIOD LABEL. Screener names the first P&L column "Mar 2015 15m" (the 15-month period Jan-2014 to Mar-2015
//     after the year-end moved to March) while the balance sheet, cash flow and ratio tables call it "Mar 2015". The
//     model matches the tables by period name, so FY15 had no balance sheet and the Excel Model sheet's FY15 debt/equity
//     cell divided by zero. We rename the P&L period to "Mar 2015"; values are unchanged (FY15 stays a 15-month year,
//     flagged in the statement notes).
// (2) TAX BALANCES AND LONG-DATED PROVISIONS OUT OF WORKING CAPITAL (engine workaround, as MANKIND.patch.js note 3 and
// TORNTPHARM.patch.js note 2). Screener's Mar-26 "Other Liabilities" (Rs2,023 cr) and "Other Assets" (Rs2,618 cr) carry
// items that are not working capital and do not grow with sales (AR FY26 consolidated balance sheet and notes 19, 24,
// 25, 39, 44): current tax liabilities (net) Rs545.99 cr, less current tax assets (net) Rs178.53 cr and the net deferred
// tax asset Rs133.85 cr (disputed and settled-later tax balances), plus provisions for pricing matters Rs123.42 cr (the
// 1981-87 betamethasone DPEA interest demand, under litigation), divestment/restructuring Rs1.93 cr and "others"
// Rs359.89 cr (mainly indirect-tax matters, incl. Rs6.59 cr for Zinetac). Net Rs718.87 cr of non-operating liabilities.
// Left in, the engine's working capital is -20% of sales and every rupee of growth would release 20 paise of cash (and
// inflate the DCF), when the trade cycle (inventory + receivables + other operating items - payables - accruals) is
// about -1% to -2% of sales. assumptions.json sets otherTreasury.base = -(718.87 + 27.37) = -Rs746.24 cr: the
// Rs718.87 cr above, which the engine and the Excel both take out of working capital, plus Rs27.37 cr of earmarked
// balances that are not treasury (unclaimed-dividend accounts Rs25.05 cr, margin money Rs1.45 cr, the Rs0.87 cr Clean
// Max equity stake). Investments are raised here by the Rs718.87 cr so that the model's opening net cash stays at the
// company's Rs2,755.48 cr of cash, deposits and liquid mutual funds less Rs33.27 cr of leases (Rs2,722 cr), and CWIP
// is lowered by the same amount (Rs33 cr - 718.87 = -Rs686 cr: the non-operating liabilities netted against the asset
// base, a modelling line the engine holds flat) so the balance sheet still balances. src/excel.js reads other
// assets/liabilities from the unpatched schedules and investments/CWIP from the model, so the Excel model matches.
// Not changed: P&L, EPS, quarterly data and the TTM column. forwardMedian / forwardSeries read the unpatched file
// but use only "EPS in Rs" and prices. GLAXO.ctx.js shows the Rs718.87 cr as a debt-like item in the DCF discussion.
// Originals are kept under _gamPatch. Idempotent. Usage: node tools/authoring/GLAXO.patch.js (prints the checks).
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'GLAXO', 'screener.json');
const NONWC = { taxLiab: 545.9952, taxAsset: 178.5262, dta: 133.8460, pricing: 123.4206, divest: 1.9296, others: 359.8946 };
const X = Math.round((NONWC.taxLiab - NONWC.taxAsset - NONWC.dta + NONWC.pricing + NONWC.divest + NONWC.others) * 100) / 100; // 718.87
const EARMARKED = Math.round((25.0543 + 1.4491 + 0.8667) * 100) / 100; // 27.37
const OT = -Math.round((X + EARMARKED) * 100) / 100; // assumptions.otherTreasury.base
const COMPANY_TREASURY = 2755.48, LEASES = 33.27; // AR FY26 notes 10, 12, 13; leases notes 18, 20
const r2 = v => Math.round(v * 100) / 100;

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026');
  if (k < 0) throw new Error('GLAXO patch: no Mar 2026 balance sheet');
  const keep = { note: `Mar-26 Investments +${X} / CWIP -${X} (tax balances and long-dated provisions out of working capital). Originals below.`, fetchedAt: S.fetchedAt, original: { bsMar26: { Investments: bs.rows.Investments[k], CWIP: bs.rows.CWIP[k] } } };
  bs.rows.Investments[k] = r2(bs.rows.Investments[k] + X);
  bs.rows.CWIP[k] = r2(bs.rows.CWIP[k] - X);
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2015 15m');
  if (j >= 0) { keep.original.plPeriod = pl.periods[j]; pl.periods[j] = 'Mar 2015'; }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, NONWC, X, EARMARKED, OT, COMPANY_TREASURY, LEASES };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026'), R = bs.rows, pl = S.tables['profit-loss'];
  const cash = S.schedules['balance-sheet']['Other Assets']['Cash Equivalents']['Mar 2026'];
  const tl = R['Equity Capital'][k] + R.Reserves[k] + R.Borrowings[k] + R['Other Liabilities'][k], ta = R['Fixed Assets'][k] + R.CWIP[k] + R.Investments[k] + R['Other Assets'][k];
  const sales = pl.rows.Sales[pl.periods.indexOf('Mar 2026')];
  console.log(`Mar-26 | X ${X} earmarked ${EARMARKED} otherTreasury ${OT} | liabilities ${r2(tl)} assets ${r2(ta)}`);
  console.log(`engine opening net cash ${r2(cash + R.Investments[k] + OT - R.Borrowings[k])} vs company ${r2(COMPANY_TREASURY - LEASES)}`);
  console.log(`working capital % of sales: patched ${((R['Other Assets'][k] - cash - OT - R['Other Liabilities'][k]) / sales * 100).toFixed(2)} | unpatched ${((R['Other Assets'][k] - cash + EARMARKED - R['Other Liabilities'][k]) / sales * 100).toFixed(2)} | CWIP ${R.CWIP[k]} investments ${R.Investments[k]}`);
}
