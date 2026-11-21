// L&T Finance: put Screener's FY24 (Mar 2024) consolidated P&L on the audited basis.
// Why: Screener's FY24 row shows Revenue ₹14,252 cr and Expenses ₹6,195 cr. The audited FY24 consolidated
// statement of profit and loss (restated comparatives in the FY25 annual report, p592) has revenue from
// operations ₹13,576.51 cr and, excluding finance costs and depreciation, expenses of ₹5,530.06 cr (net loss on
// fair value changes 356.89 + loss on derecognition 457.71 + impairment 1,322.36 + employee 1,806.37 + other
// 1,586.73). Screener grosses the same ~₹675 cr into both lines (financing profit ₹2,670 cr, other income
// ₹474 cr and PBT ₹3,029 cr are right), which inflates FY24 fee income and opex as a % of AUM by ~0.8pp each.
// We take ₹675 cr out of Revenue and out of Expenses (Expenses keep Screener's usual ~₹10 cr lease-interest
// shift to Interest), so Financing Profit, Other Income, PBT and Net Profit are unchanged. Other years tie to
// the annual reports and are untouched. Originals kept under _gamPatch. Applied in memory by src/model.js on
// every build; idempotent. Usage (check only): node tools/authoring/LTF.patch.js
const fs = require('fs');
const path = require('path');
const FY = 'Mar 2024';
const GROSS = 675; // Screener FY24 revenue 14,252 − audited 13,576.51 ≈ Screener expenses 6,195 − (5,530.06 − ~10)

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const T = S.tables['profit-loss'], i = T.periods.indexOf(FY);
  if (i < 0) throw new Error('LTF patch: no Mar 2024 column');
  const R = T.rows, keep = { note: 'FY24 revenue and expenses put on the audited basis (see tools/authoring/LTF.patch.js). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  if (!(R.Revenue[i] > 14000)) { S._gamPatch = { ...keep, note: 'FY24 revenue already on the audited basis; no change' }; return S; }
  for (const k of ['Revenue', 'Expenses', 'Financing Margin %', 'Revenue growth']) if (R[k]) keep.original[k] = R[k].slice();
  R.Revenue[i] -= GROSS;
  R.Expenses[i] -= GROSS;
  if (R['Financing Margin %']) R['Financing Margin %'][i] = Math.round(R['Financing Profit'][i] / R.Revenue[i] * 100);
  if (R['Revenue growth']) {
    R['Revenue growth'][i] = Math.round((R.Revenue[i] / R.Revenue[i - 1] - 1) * 100);
    R['Revenue growth'][i + 1] = Math.round((R.Revenue[i + 1] / R.Revenue[i] - 1) * 100);
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };

if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'LTF', 'screener.json'), 'utf8')));
  const T = S.tables['profit-loss'], i = T.periods.indexOf(FY);
  console.log(Object.fromEntries(Object.entries(T.rows).map(([k, v]) => [k, v[i]])), S._gamPatch.note);
}
