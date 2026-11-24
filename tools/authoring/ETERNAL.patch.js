// ETERNAL: one in-memory fix applied by src/model.js on every build (patchRaw); idempotent.
// Share count. The engine fixes forecast shares at FY26 profit ÷ FY26 EPS; with EPS rounded to ₹0.38
// that gives 963.2 cr shares. Eternal had 965.04 cr shares in issue at Mar-26 and Jun-26 (FY26 annual
// report: 9,65,03,50,647; no shares were issued in FY26), of which 45.65 cr sit in the employee ESOP
// trust to meet options already granted. We value the company on all 965.04 cr issued shares (the
// trust shares go to employees as options are exercised; brokers use ~954-967 cr), so FY26 EPS is
// restated to ₹366 cr ÷ 965.04 cr = ₹0.3793 (reported ₹0.38, on the weighted count net of the trust).
const SHARES = 965.04; // crore, issued shares at Mar-26 / Jun-26 (FY26 annual report, published 28-Jul-2026)

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  if (j < 0) throw new Error('ETERNAL patch: no Mar 2026 column');
  const keep = { note: `FY26 EPS restated on ${SHARES} cr issued shares (incl. ESOP trust). Original below.`, fetchedAt: S.fetchedAt, eps: pl.rows['EPS in Rs'][j] };
  pl.rows['EPS in Rs'][j] = Math.round(pl.rows['Net Profit'][j] / SHARES * 1e5) / 1e5;
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES };
