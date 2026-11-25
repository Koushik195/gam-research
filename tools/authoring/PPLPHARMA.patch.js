// PPLPHARMA: share count only. Screener's consolidated "Net Profit" already equals profit attributable to owners
// (its "Profit for EPS" schedule is identical for FY21-FY26 and the minority share is nil up to Jun-2026), so no profit
// row is touched. The engine infers shares as FY26 Net Profit / EPS; Screener's FY26 EPS is rounded (-2.45), which gives
// 133.06 cr shares. The company reports basic EPS of -Rs2.46 on 132.54 cr weighted shares, with 132,92,48,130 shares in
// issue at 31-Mar-2026 (AR FY26 note 15; 45.04 lakh of them held by the employee welfare trust). We set FY26 EPS to
// Net Profit / 132.92 cr so per-share values use the shares in issue (the market-cap basis). Original row kept under
// _gamPatch. Idempotent. Usage: node tools/authoring/PPLPHARMA.patch.js (prints the check; src/model.js applies patchRaw).
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'PPLPHARMA', 'screener.json');
const SHARES = 132.9248; // crore shares in issue at 31-Mar-2026 (AR FY26 note 15)

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const pl = S.tables['profit-loss'], i26 = pl.periods.indexOf('Mar 2026');
  const pfe = S.schedules?.['profit-loss']?.['Net Profit']?.['Profit for EPS'];
  if (i26 < 0 || !pfe) throw new Error('PPLPHARMA patch: FY26 column or Profit for EPS schedule missing');
  const np = pl.rows['Net Profit'][i26];
  if (Math.abs(np - pfe['Mar 2026']) > 1) throw new Error(`PPLPHARMA patch: Net Profit ${np} differs from Profit for EPS ${pfe['Mar 2026']}; revisit the patch`);
  const keep = { note: 'FY26 EPS set to Net Profit / 132.92 cr shares in issue (AR FY26 note 15). Net Profit = Profit for EPS, unchanged.', fetchedAt: S.fetchedAt, original: { eps: pl.rows['EPS in Rs'].slice() } };
  pl.rows['EPS in Rs'][i26] = Math.round(np / SHARES * 10000) / 10000;
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  const pl = S.tables['profit-loss'], i = pl.periods.indexOf('Mar 2026');
  console.log(`FY26 Net Profit ${pl.rows['Net Profit'][i]}, EPS ${pl.rows['EPS in Rs'][i]} (was ${S._gamPatch.original.eps[i]}), implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)} cr`);
}
