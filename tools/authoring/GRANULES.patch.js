// GRANULES: data correction applied in memory by src/model.js on every build (a fresh Screener fetch cannot undo it).
// Net Profit needs no change: every subsidiary is 100% owned (AR FY26, AOC-1 and note 39), so Screener's "Net Profit" equals
// its "Profit for EPS" schedule in every year and quarter (FY26 Rs595 cr; FY25 Rs502 cr).
// What does need fixing is the share count and the balance sheet. The engine infers shares as FY26 profit / EPS (24.78 cr,
// the Mar-26 count) and starts the forecast from the Mar-26 balance sheet. But before our 30-Sep-2026 as-of date the
// promoter group converted its warrants:
//  - Preferential issue at Rs585 (allotted 23-Feb-2026, BSE filing): 51,28,205 equity shares to eight non-promoter investors
//    (Rs300 cr) and 2,50,00,000 convertible warrants to five investors incl. the promoter group, 25% paid up front
//    (Rs365.625 cr). Paid-up shares went from 24,26,68,716 to 24,77,96,921; fully diluted 27,27,96,921. The Rs665.6 cr
//    received in Feb-2026 is already in the Mar-26 balance sheet (AR FY26: money received against warrants Rs365.63 cr).
//  - Conversion on 16-Sep-2026 (exchange filing): 2,49,82,906 warrants converted on payment of the 75% balance (promoter
//    group Rs1,093 cr for 2,49,14,530 warrants); paid-up capital Rs27,27,79,827; 17,094 warrants still outstanding.
//    The company called itself "consolidated net cash" after this money arrived (CFO, IIFL webinar, 29-Sep-2026).
// So we put the Mar-26 balance sheet on a fully diluted, pro forma basis (KIMS.patch.js precedent): 27,27,96,921 shares and
// the whole 75% balance on 2.5 cr warrants (Rs1,096.875 cr; Rs1,096.13 cr received on 16-Sep-2026, Rs0.75 cr due on the
// 17,094 outstanding) added to cash (investments row) and equity. FY26 EPS is restated to Rs595.02 cr / 27.2797 cr = Rs21.81
// (pro forma; reported Rs24.01 on Screener's year-end basis, AR basic Rs24.47 on weighted shares) so that every forecast EPS
// and the target are on the post-conversion share count. The house forward-P/E history (valuation-blend.js) reads
// Screener's unpatched EPS, so the multiple history is unaffected. Tables only: src/excel.js reads the unpatched schedules.
// Usage (check only): node tools/authoring/GRANULES.patch.js
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'GRANULES', 'screener.json');
const PF = { sharesMar26: 247796921, warrants: 25000000, price: 585, balancePct: 0.75, fv: 1 };
PF.sharesCr = (PF.sharesMar26 + PF.warrants) / 1e7;                     // 27.2797 cr, fully diluted
PF.capitalCr = PF.warrants * PF.fv / 1e7;                                // Rs2.5 cr
PF.cashCr = PF.warrants * PF.price * PF.balancePct / 1e7;               // Rs1,096.875 cr

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Mar-26 pro forma for the 16-Sep-2026 warrant conversion (fully diluted 27.28 cr shares; Rs1,096.9 cr balance money as cash); FY26 EPS restated to the diluted count. Originals below.', fetchedAt: S.fetchedAt, pf: PF, original: {} };
  const bs = S.tables['balance-sheet'], j = bs.periods.indexOf('Mar 2026');
  if (j < 0) throw new Error('GRANULES patch: no Mar 2026 balance sheet');
  keep.original['bs.Mar26'] = { equity: bs.rows['Equity Capital'][j], reserves: bs.rows.Reserves[j], investments: bs.rows.Investments[j], total: bs.rows['Total Assets'][j] };
  bs.rows['Equity Capital'][j] += PF.capitalCr;
  bs.rows.Reserves[j] += PF.cashCr - PF.capitalCr;
  bs.rows.Investments[j] += PF.cashCr;
  bs.rows['Total Liabilities'][j] += PF.cashCr;
  bs.rows['Total Assets'][j] += PF.cashCr;
  const pl = S.tables['profit-loss'], k = pl.periods.indexOf('Mar 2026');
  keep.original['pl.EPS FY26'] = pl.rows['EPS in Rs'][k];
  pl.rows['EPS in Rs'][k] = Math.round(pl.rows['Net Profit'][k] / PF.sharesCr * 1e4) / 1e4;
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, PF };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'], o = S._gamPatch.original, sch = S.schedules['profit-loss']['Net Profit']['Profit for EPS'];
  for (const p of ['Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p), np = pl.rows['Net Profit'][i], eps = pl.rows['EPS in Rs'][i];
    console.log(p, '| Net Profit', np, '| Profit for EPS', sch[p], '| EPS', eps, '| implied shares', (np / eps).toFixed(4), 'cr');
  }
  console.log('FY26 reported EPS', o['pl.EPS FY26'], '| pro forma shares', PF.sharesCr.toFixed(4), 'cr | cash added Rs', PF.cashCr, 'cr | Mar-26 original', JSON.stringify(o['bs.Mar26']));
}
