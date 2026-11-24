// RKFORGE: in-memory fixes applied by src/model.js on every build (patchRaw); idempotent.
// No minority interests (Screener "Profit for EPS" = "Net Profit"), so profit is left as reported.
// 1) Post-conversion share count. Promoter warrants were converted into shares before our 30-Sep-2026 as-of date:
//    3,35,000 on 9-Jun-2026 (Riddhi Portfolio, Rs1,575 balance each = Rs52.76 cr) and 34,00,000 on 24-Sep-2026
//    (Chaitanya Jalan, Rs441 balance each = Rs149.94 cr). Shares went from 18,18,35,017 (Mar-26) to 18,55,70,017.
//    The engine has no share-issue line (it fixes shares at FY26 profit / EPS), so we restate FY26 EPS to a pro
//    forma Rs3.88 (Rs72 cr / 18.557 cr); every forecast EPS and the target are on the post-conversion share count.
//    Reported FY26 EPS was Rs3.95. The house forward-P/E history (forwardMedian) reads Screener's unpatched EPS.
// 2) Mar-26 balance sheet pro forma for the warrant money received after Mar-26 (CRAFTSMAN.patch.js precedent,
//    tables only): +Rs202.70 cr to Investments and Reserves. Management used it to cut debt (net debt Rs1,990 cr at
//    Mar-26, Rs1,900 cr at Jun-26); holding it as cash gives the same net debt.
const fs = require('fs');
const path = require('path');
const SHARES_POST = 18.557; // crore, 18,55,70,017 shares after the 24-Sep-2026 conversion
const WARRANT_CASH = 52.76 + 149.94; // Rs crore received Jun and Sep-2026

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'FY26 EPS pro forma on 18.557 cr shares (warrant conversions Jun/Sep-2026); Mar-26 investments and reserves +Rs202.70 cr (warrant balance money). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  if (j >= 0) {
    keep.original.eps = pl.rows['EPS in Rs'].slice();
    pl.rows['EPS in Rs'][j] = Math.round(pl.rows['Net Profit'][j] / SHARES_POST * 100) / 100;
  }
  const bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026');
  if (k >= 0) {
    keep.original['bs.Mar26'] = { investments: bs.rows.Investments[k], reserves: bs.rows.Reserves[k], total: bs.rows['Total Assets'][k] };
    for (const r of ['Investments', 'Reserves', 'Total Liabilities', 'Total Assets']) bs.rows[r][k] = Math.round((bs.rows[r][k] + WARRANT_CASH) * 100) / 100;
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_POST, WARRANT_CASH };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'RKFORGE', 'screener.json'), 'utf8')));
  const pl = S.tables['profit-loss']; console.log(pl.periods.join(' | ')); console.log(pl.rows['EPS in Rs'].join(' | '));
  const bs = S.tables['balance-sheet']; console.log(bs.periods.join(' | ')); console.log(bs.rows.Investments.join(' | '), '/', bs.rows.Reserves.join(' | '));
}
