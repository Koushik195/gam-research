// KIMS: data corrections applied in memory by src/model.js on every build (a fresh Screener fetch cannot undo them).
// 1. Profit on the attributable basis. Screener's consolidated "Net Profit" is BEFORE minorities while "EPS in Rs" is
//    AFTER them; minorities were large in FY23-25 (Rs26-30 cr a year), so we use Screener's own "Profit for EPS"
//    schedule (= profit attributable to owners: FY26 Rs241 cr vs AR Rs241.4 cr), as RAINBOW.patch.js does.
// 2. Share count and balance sheet pro forma for the equity raised after March 2026 and before the 30-Sep-2026 as-of
//    date. The engine infers shares as FY26 profit / EPS (40.0 cr) and starts the forecast from the Mar-26 balance sheet,
//    so without this every per-share value and the net debt would be wrong:
//    - QIP: 1,98,67,549 shares at Rs755 (Rs1,500 cr gross, Rs23.55 cr issue expenses: net Rs1,476.45 cr), issue
//      16-19 Jun 2026 (CARE monitoring agency report, 3-Aug-2026). Shares after QIP: 42,00,06,484 (Rs84.0 cr capital).
//    - Promoter warrants: 77,02,182 at Rs779 (Rs600 cr; 25% = Rs150 cr received, allotted 19-Aug-2026; balance Rs450 cr
//      payable on conversion within 18 months; NSE filing 20-Aug-2026). We treat them as converted (fully diluted:
//      42.77 cr shares) and count all Rs600 cr as cash.
//    So Mar-26 equity capital +Rs5.51 cr, reserves +Rs2,070.94 cr, investments (treasury) +Rs2,076.45 cr; and FY26 EPS is
//    restated to attributable profit / 42.7708 cr (pro forma; reported EPS Rs6.03 is kept in _gamPatch and in the text).
// 3. Minority interests (book Rs311 cr, inside Screener's "Other Liabilities") are NOT moved here: the Excel builder reads
//    the unpatched schedules. They are counted as debt through assumptions.otherTreasury.base = -311 instead, which
//    takes them out of working capital and into net debt identically in the engine and the Excel model.
// Usage (check only): node tools/authoring/KIMS.patch.js
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'KIMS', 'screener.json');
const PF = { qipShares: 19867549, qipNetCr: 1476.45, warrants: 7702182, warrantCashCr: 600, sharesMar26: 400138935, fv: 2 };
PF.sharesCr = (PF.sharesMar26 + PF.qipShares + PF.warrants) / 1e7; // 42.7708 cr, fully diluted
PF.capitalCr = (PF.qipShares + PF.warrants) * PF.fv / 1e7; // Rs5.51 cr
PF.cashCr = PF.qipNetCr + PF.warrantCashCr; // Rs2,076.45 cr

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS" (attributable); Mar-26 pro forma for the Jun-26 QIP and Aug-26 promoter warrants (fully diluted 42.77 cr shares). Originals below.', fetchedAt: S.fetchedAt, pf: PF, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab], pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`KIMS patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[`${tab}.Net Profit`] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  // Mar-26 pro forma for the QIP and warrants (tables only: src/excel.js reads the unpatched schedules, so schedules stay as reported)
  const bs = S.tables['balance-sheet'], j = bs.periods.indexOf('Mar 2026');
  keep.original['bs.Mar26'] = { equity: bs.rows['Equity Capital'][j], reserves: bs.rows.Reserves[j], investments: bs.rows.Investments[j] };
  bs.rows['Equity Capital'][j] += PF.capitalCr; bs.rows.Reserves[j] += PF.cashCr - PF.capitalCr; bs.rows.Investments[j] += PF.cashCr;
  bs.rows['Total Liabilities'][j] += PF.cashCr; bs.rows['Total Assets'][j] += PF.cashCr;
  const pl = S.tables['profit-loss'], k = pl.periods.indexOf('Mar 2026');
  keep.original['pl.EPS FY26'] = pl.rows['EPS in Rs'][k];
  pl.rows['EPS in Rs'][k] = Math.round(pl.rows['Net Profit'][k] / PF.sharesCr * 1e4) / 1e4;
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, PF };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  const pl = S.tables['profit-loss'], o = S._gamPatch.original;
  for (const p of ['Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p), np = pl.rows['Net Profit'][i], eps = pl.rows['EPS in Rs'][i];
    console.log(p, '| profit (attributable)', np, '| original', o['profit-loss.Net Profit'][i], '| EPS', eps, '| implied shares', (np / eps).toFixed(2), 'cr');
  }
  console.log('FY26 reported EPS', o['pl.EPS FY26'], '| pro forma shares', PF.sharesCr.toFixed(4), 'cr | cash added Rs', PF.cashCr, 'cr | Mar-26 orig', JSON.stringify(o['bs.Mar26']));
}
