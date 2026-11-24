// BELRISE (Belrise Industries): in-memory fixes applied by src/model.js on every build (patchRaw); idempotent.
// 1) Standalone columns dropped. Screener's FY18, FY20 and FY21 columns are standalone ("(S)") and sit next to consolidated
//    FY22-26 figures; mixing them would distort growth and margins, so they are dropped from every table (MSUMI/CRAFTSMAN
//    precedent). Screener's Mar-2022 balance sheet shows fixed assets and CWIP of zero and ₹4,913 cr of "other assets"
//    (a mis-mapping of the first consolidated filing). It is kept (equity and borrowings are right, and blanking it breaks
//    the Excel debt/equity cell); the report's balance-sheet tables and ratio charts start at FY23.
// 2) Share count and balance sheet pro forma for the QIP. Belrise allotted 7,72,72,727 shares at ₹220 (₹1,700 cr gross;
//    net proceeds ₹1,657.26 cr per the CRISIL monitoring-agency report) on 17-Jul-2026, before our 30-Sep-2026 as-of date
//    (paid-up capital ₹444.94 cr → ₹483.58 cr; NSE/BSE allotment filing, 17-Jul-2026). Shares went from 88,98,79,192 to
//    96,71,51,919. The engine fixes the share count at FY26 profit ÷ EPS and starts the forecast from the Mar-26 balance
//    sheet, so (KIMS.patch.js precedent, tables only; src/excel.js reads the unpatched schedules): Mar-26 equity capital
//    +₹38.64 cr, reserves +₹1,618.62 cr, investments (treasury) +₹1,657.26 cr; FY26 EPS restated to ₹497 cr ÷ 96.7152 cr
//    (pro forma ₹5.14; reported ₹5.58 is kept in _gamPatch and quoted in the text).
//    The pending merger of the two promoter companies (BAPL and EITSPL; 4,71,90,220 = 4.72 cr new shares) needed NCLT approval that
//    had not been given by 30-Sep-2026, so it is NOT in the share count or the forecasts (see BELRISE.ctx.js, sensitivity).
// Usage (check only): node tools/authoring/BELRISE.patch.js
const fs = require('fs');
const path = require('path');
const PF = { sharesMar26: 889879192, qipShares: 77272727, qipPrice: 220, qipNetCr: 1657.26, fv: 5 };
PF.sharesCr = (PF.sharesMar26 + PF.qipShares) / 1e7; // 96.7152 cr
PF.capitalCr = Math.round(PF.qipShares * PF.fv / 1e5) / 100; // ₹38.64 cr

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Standalone FY18/FY20/FY21 dropped; Mar-26 pro forma for the Jul-2026 QIP (96.72 cr shares). Originals below.', fetchedAt: S.fetchedAt, pf: PF, original: {} };
  for (const tab of ['profit-loss', 'balance-sheet', 'cash-flow', 'ratios']) {
    const T = S.tables[tab]; if (!T) continue;
    const drop = T.periods.map((p, i) => (/\(S\)/.test(p) ? i : -1)).filter(i => i >= 0);
    T.periods = T.periods.filter((_, i) => !drop.includes(i));
    for (const r of Object.keys(T.rows)) T.rows[r] = T.rows[r].filter((_, i) => !drop.includes(i));
  }
  const bs = S.tables['balance-sheet'], j = bs.periods.indexOf('Mar 2026');
  keep.original['bs.Mar26'] = { equity: bs.rows['Equity Capital'][j], reserves: bs.rows.Reserves[j], investments: bs.rows.Investments[j] };
  bs.rows['Equity Capital'][j] += PF.capitalCr; bs.rows.Reserves[j] += PF.qipNetCr - PF.capitalCr; bs.rows.Investments[j] += PF.qipNetCr;
  bs.rows['Total Liabilities'][j] += PF.qipNetCr; bs.rows['Total Assets'][j] += PF.qipNetCr;
  const pl = S.tables['profit-loss'], k = pl.periods.indexOf('Mar 2026');
  keep.original['pl.EPS FY26'] = pl.rows['EPS in Rs'][k];
  pl.rows['EPS in Rs'][k] = Math.round(pl.rows['Net Profit'][k] / PF.sharesCr * 1e4) / 1e4;
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, PF };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'BELRISE', 'screener.json'), 'utf8')));
  const pl = S.tables['profit-loss']; console.log(pl.periods.join(' | ')); console.log(pl.rows['Net Profit'].join(' | ')); console.log(pl.rows['EPS in Rs'].join(' | '));
  const bs = S.tables['balance-sheet']; console.log(bs.periods.join(' | ')); console.log(bs.rows['Equity Capital'].join(' | '), '|', bs.rows.Investments.join(' | '));
  console.log('shares', PF.sharesCr.toFixed(4), 'capital +', PF.capitalCr, 'orig', JSON.stringify(S._gamPatch.original));
}
