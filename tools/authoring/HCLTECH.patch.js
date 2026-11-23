// HCLTECH: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs16,652 cr) while
// "EPS in Rs" (Rs61.33) is on profit attributable to owners (Rs16,642 cr, AR FY26 note 3.27). The engine
// infers shares as Net Profit / EPS, which gives 271.51 cr shares instead of the 271.37 cr in issue
// (2,71,36,65,096 shares, AR FY26 note 3.12). The gap is small (~0.05%: minorities are Rs6-24 cr a year,
// mainly a few majority-owned subsidiaries) but we keep the share count real, as ASIANPAINT.patch.js does:
// the row is replaced with Screener's own "Profit for EPS" schedule. The original row is kept under
// _gamPatch. Idempotent. Usage: node tools/authoring/HCLTECH.patch.js (prints the check; src/model.js
// applies patchRaw in memory on every build).
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'HCLTECH', 'screener.json');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below. P&L period "Mar 2016 9m" renamed "Mar 2016" so the FY16 balance sheet and cash flow (keyed "Mar 2016") line up.', fetchedAt: S.fetchedAt, original: {} };
  // HCLTech moved its year-end from June to March in 2015-16; Screener labels that 9-month P&L column "Mar 2016 9m"
  // while the balance sheet, cash flow and schedules use "Mar 2016". Without this the FY16 balance sheet is blank and
  // the Excel model divides by an empty FY16 net worth.
  for (const T of Object.values(S.tables)) if (T?.periods) T.periods = T.periods.map(p => (p === 'Mar 2016 9m' ? 'Mar 2016' : p));
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`HCLTECH patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  const pl = S.tables['profit-loss'], i = pl.periods.indexOf('Mar 2026');
  console.log('in-memory check | FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(in issue 271.37 cr)');
}
