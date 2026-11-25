// COALINDIA: data corrections applied in memory by src/model.js on every build (a fresh Screener fetch cannot undo them).
// 1. Stripping activity adjustment back into operating costs for FY25 and FY26. Coal India capitalises overburden
//    removal above the expected stripping ratio ("stripping activity adjustment", a credit inside total expenses:
//    Rs4,103.03 cr FY25, Rs4,070.72 cr FY26; AR FY26 consolidated P&L and ten-year table). Up to FY24, and in every
//    quarter, Screener leaves that credit inside expenses (EBITDA includes it). For FY25 and FY26 only, Screener moves it
//    to Other Income (FY26: 11,275.68 other income + 758 JV share + 4,070.72 = Screener's 16,104). That breaks the
//    EBITDA series in FY25 (OPM 33% -> 25%) and inflates other income. We put it back in expenses, so FY25/FY26 EBITDA
//    are Rs47,205 cr / Rs41,243 cr (the same as ICICI Direct 30-Jul-2026 and PL 28-Jul-2026 reported EBITDA) and the
//    annual figures agree with the sum of Screener's quarters. PBT and profit do not change.
// 2. Minorities: Net Profit -> Screener's "Profit for EPS" (owners' share; UPL/MOTHERSON precedent). After the BCCL (Jan-
//    2026) and CMPDI (Mar-2026) listings, minorities exist but are small (FY26: owners Rs31,094 cr vs Rs31,071 cr total).
//    With it the engine's implied share count is the actual 616.27 crore.
// Usage (check only): node tools/authoring/COALINDIA.patch.js
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'COALINDIA', 'screener.json');
const STRIP = { 'Mar 2025': 4103.03, 'Mar 2026': 4070.72 }; // AR FY26 consolidated (FY25 restated comparative)

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'FY25/FY26 stripping activity adjustment moved from Other Income back into Expenses (as in FY24 and earlier, and in all quarters); Net Profit = Profit for EPS (owners). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  const pl = S.tables['profit-loss'];
  for (const [p, x] of Object.entries(STRIP)) {
    const j = pl.periods.indexOf(p); if (j < 0) continue;
    keep.original[p] = { Expenses: pl.rows.Expenses[j], 'Operating Profit': pl.rows['Operating Profit'][j], 'Other Income': pl.rows['Other Income'][j], 'OPM %': pl.rows['OPM %'][j] };
    pl.rows.Expenses[j] = Math.round(pl.rows.Expenses[j] - x);
    pl.rows['Operating Profit'][j] = Math.round(pl.rows['Operating Profit'][j] + x);
    pl.rows['Other Income'][j] = Math.round(pl.rows['Other Income'][j] - x);
    pl.rows['OPM %'][j] = Math.round(pl.rows['Operating Profit'][j] / pl.rows.Sales[j] * 100);
    const oi = S.schedules?.['profit-loss']?.['Other Income']?.['Other income normal'];
    if (oi && p in oi) oi[p] = Math.round(oi[p] - x);
    const ex = S.schedules?.['profit-loss']?.Expenses?.['Other Expenses %'];
    if (ex && p in ex) ex[p] = Math.round(ex[p] - x / pl.rows.Sales[j] * 100);
  }
  const pfe = S.schedules?.['profit-loss']?.['Net Profit']?.['Profit for EPS'];
  if (pfe) pl.periods.forEach((p, j) => { if (/^Mar \d{4}$/.test(p) && typeof pfe[p] === 'number') { (keep.original.netProfit ||= {})[p] = pl.rows['Net Profit'][j]; pl.rows['Net Profit'][j] = pfe[p]; } });
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, STRIP };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  const pl = S.tables['profit-loss'];
  console.log(pl.periods.slice(-5).join(' | '));
  for (const k of ['Sales', 'Expenses', 'Operating Profit', 'OPM %', 'Other Income', 'Net Profit', 'EPS in Rs']) console.log(k, pl.rows[k].slice(-5).join(' | '));
}
