// POONAWALLA: put Screener's FY24 consolidated P&L on the audited continuing-operations basis.
// Why: Screener's FY24 annual row (Revenue ₹5,418 cr, Expenses ₹880 cr, Other income −₹1,363 cr) grosses the
// one-off items of that year into revenue and other income. The audited FY24 consolidated statement of profit
// and loss (FY25 annual report, comparatives, p372-373) shows revenue from operations ₹3,109.01 cr (interest
// income ₹2,899.56 cr), finance costs ₹950.30 cr, impairment ₹72.02 cr + employee ₹444.42 cr + other expenses
// ₹303.63 cr = ₹820.07 cr, depreciation ₹59.31 cr, other income ₹38.32 cr, and below that an exceptional net gain
// of ₹816.52 cr (gain of ₹2,308.97 cr on selling Grihum Housing Finance, formerly Poonawalla Housing Finance,
// to TPG, less a one-time ₹1,298.31 cr provision and ₹174.95 cr write-off on the legacy book, and ₹19.19 cr of
// other items) plus ₹42.07 cr pre-tax profit of the discontinued housing business. Left alone, Screener's row
// makes FY24 yield on AUM ~25% instead of ~14%. We replace Revenue, Expenses, Financing Profit and margin with
// the audited figures and put the rest in Other Income, so that PBT (₹2,166 cr), tax and net profit
// (₹1,683 cr) stay exactly as Screener has them. Other years are untouched. Originals kept under _gamPatch.
// Applied in memory by src/model.js on every build; idempotent.
const FY = 'Mar 2024';
const NEW = { Revenue: 3109, Interest: 950, Expenses: 820 };

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const T = S.tables['profit-loss'], i = T.periods.indexOf(FY);
  if (i < 0) throw new Error('POONAWALLA patch: no Mar 2024 column');
  const R = T.rows, keep = { note: 'FY24 P&L put on the audited continuing-operations basis (see tools/authoring/POONAWALLA.patch.js). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  const pbt = R['Profit before tax'][i], dep = R['Depreciation'][i];
  for (const k of ['Revenue', 'Interest', 'Expenses', 'Financing Profit', 'Financing Margin %', 'Other Income', 'Revenue growth']) if (R[k]) keep.original[k] = R[k].slice();
  for (const [k, v] of Object.entries(NEW)) R[k][i] = v;
  const fp = NEW.Revenue - NEW.Interest - NEW.Expenses;
  R['Financing Profit'][i] = fp;
  if (R['Financing Margin %']) R['Financing Margin %'][i] = Math.round(fp / NEW.Revenue * 100);
  R['Other Income'][i] = pbt - fp + dep; // keeps Screener's PBT and net profit unchanged
  if (R['Revenue growth']) {
    const j = T.periods.indexOf('Mar 2025');
    R['Revenue growth'][i] = Math.round((NEW.Revenue / R.Revenue[i - 1] - 1) * 100);
    if (j > 0) R['Revenue growth'][j] = Math.round((R.Revenue[j] / NEW.Revenue - 1) * 100);
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };

if (require.main === module) {
  const S = patchRaw(JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'data', 'raw', 'POONAWALLA', 'screener.json'), 'utf8')));
  const T = S.tables['profit-loss'], i = T.periods.indexOf(FY);
  console.log(Object.fromEntries(Object.entries(T.rows).map(([k, v]) => [k, v[i]])));
}
