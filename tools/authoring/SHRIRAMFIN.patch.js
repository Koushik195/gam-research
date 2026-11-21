// SHRIRAMFIN: put Screener's FY25 consolidated P&L on the audited continuing-operations basis.
// Why: Screener's FY25 annual row (Revenue ₹43,941 cr, Interest ₹18,529 cr, Expenses ₹12,279 cr, Other
// income ₹157 cr) does not match the audited FY25 consolidated statement of profit and loss (FY25 annual
// report p387: revenue from operations ₹41,834.42 cr, finance costs ₹18,454.58 cr, fees & commission
// expenses ₹572.46 cr + impairment ₹5,311.66 cr + employee ₹3,651.16 cr + other ₹2,275.04 cr = ₹11,810.32 cr,
// depreciation ₹645.32 cr). It appears to gross Shriram Housing Finance (sold 11-Dec-2024, a discontinued
// operation) into revenue and expenses, which inflates FY25 yield and NIM on our standalone AUM by ~0.8pp.
// We replace Revenue, Interest, Expenses, Financing Profit and margin with the audited figures and put the
// rest (exceptional gain on the SHFL sale ₹1,553.66 cr + SHFL's own profit to the sale date ₹182.82 cr
// pre-tax + other income ₹25.05 cr, less a ~₹42 cr gap in Screener's PBT) in Other Income, so that PBT
// (₹12,644 cr), tax and net profit (₹9,576 cr) stay exactly as Screener has them. FY24 and earlier are
// untouched (they include SHFL, which was consolidated then). Originals kept under _gamPatch.
// Applied in memory by src/model.js on every build; idempotent.
const FY = 'Mar 2025';
const NEW = { Revenue: 41834, Interest: 18455, Expenses: 11810 };

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const T = S.tables['profit-loss'], i = T.periods.indexOf(FY);
  if (i < 0) throw new Error('SHRIRAMFIN patch: no Mar 2025 column');
  const R = T.rows, keep = { note: 'FY25 P&L put on the audited continuing-operations basis (see tools/authoring/SHRIRAMFIN.patch.js). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  const pbt = R['Profit before tax'][i], dep = R['Depreciation'][i];
  for (const k of ['Revenue', 'Interest', 'Expenses', 'Financing Profit', 'Financing Margin %', 'Other Income', 'Revenue growth']) if (R[k]) keep.original[k] = R[k].slice();
  for (const [k, v] of Object.entries(NEW)) R[k][i] = v;
  const fp = NEW.Revenue - NEW.Interest - NEW.Expenses;
  R['Financing Profit'][i] = fp;
  if (R['Financing Margin %']) R['Financing Margin %'][i] = Math.round(fp / NEW.Revenue * 100);
  R['Other Income'][i] = pbt - fp + dep; // keeps Screener's PBT and net profit unchanged
  if (R['Revenue growth']) {
    const j = T.periods.indexOf('Mar 2026');
    R['Revenue growth'][i] = Math.round((NEW.Revenue / R.Revenue[i - 1] - 1) * 100);
    if (j > 0) R['Revenue growth'][j] = Math.round((R.Revenue[j] / NEW.Revenue - 1) * 100);
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
