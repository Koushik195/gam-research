// ANTHEM: one correction to Screener's consolidated data, applied in memory by src/model.js on every build.
// DROP THE STANDALONE "Mar 2019 (S)" COLUMN. Screener's consolidated annual tables start with a Mar 2019 column marked
// "(S)" = standalone figures (Anthem listed on 21-Jul-2025; its prospectus carries restated consolidated accounts only
// from FY23, Screener fills FY20-22 from filings). Kept, FY19 would mix a standalone year into a consolidated history,
// and the engine reads the label as 'FY19'. The model history therefore runs FY20-FY26.
// Not changed (checked): Net Profit equals Screener's "Profit for EPS" in every year and quarter (no minority interests:
// NeoAnthem Lifesciences is 100% owned), so no attributable-profit patch is needed; implied FY26 shares = 592 / 10.54 =
// 56.17 cr, matching 561,713,851 shares at Mar-2026 (AR FY26 note 15). The IPO was a pure offer for sale whose expenses
// were borne by the selling shareholders (AR FY26 note 48), so there is no IPO-related item in the P&L to adjust.
// Screener nets the FY26 labour-code exceptional charge (-Rs22 cr pre-tax) into "Other Income" (Rs131 cr = Rs153 cr
// normal - Rs22 cr); ANTHEM.ctx.js uses the schedule split. The TTM column is recomputed by the as-of freeze.
// Originals are kept under _gamPatch. Idempotent. Usage: node tools/authoring/ANTHEM.patch.js (prints the checks).
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ANTHEM', 'screener.json');
const DROP = /^Mar 2019 \(S\)$/;

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Standalone "Mar 2019 (S)" annual column dropped (consolidated history FY20-FY26). Originals below.', fetchedAt: S.fetchedAt, dropped: {} };
  for (const tab of ['profit-loss', 'balance-sheet', 'cash-flow', 'ratios']) {
    const T = S.tables?.[tab];
    if (!T) continue;
    const idx = T.periods.map((p, i) => (DROP.test(p) ? i : -1)).filter(i => i >= 0);
    if (!idx.length) continue;
    keep.dropped[tab] = { periods: idx.map(i => T.periods[i]), rows: Object.fromEntries(Object.entries(T.rows).map(([k, v]) => [k, idx.map(i => v[i])])) };
    T.periods = T.periods.filter((_, i) => !idx.includes(i));
    for (const k of Object.keys(T.rows)) if (Array.isArray(T.rows[k])) T.rows[k] = T.rows[k].filter((_, i) => !idx.includes(i));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'], pfe = S.schedules['profit-loss']['Net Profit']['Profit for EPS'];
  console.log('annual periods', pl.periods.join(' | '));
  for (const p of ['Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} | Profit for EPS ${pfe[p]} | EPS ${pl.rows['EPS in Rs'][i]} | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)} cr`);
  }
}
