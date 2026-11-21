// Bajaj Housing Finance: repair Screener's FY20 (Mar 2020) column, which is in the wrong unit.
// Why: Screener shows FY20 revenue ₹265 cr, net profit ₹42 cr and equity capital ₹488 cr, exactly one
// tenth of the company's reported figures (total income ₹2,646 cr, PAT ₹421 cr; FY21 equity capital
// ₹4,883 cr with no capital raised in FY21). Left alone, FY21 ROE, cost of funds and growth are garbage.
// Fix (applied in memory by src/model.js on every build; screener.json is never edited):
//  - P&L: company-reported FY20 lines from the 9-year snapshot in the Q1FY27 investor presentation
//    (p10, 29-Jul-2026): total income 2,646, interest 1,616, PBT 567, PAT 421; depreciation = Screener ×10;
//    expenses = total income − interest − (PBT + depreciation); EPS on Screener's FY21 share basis.
//  - Balance sheet and cash flow: Screener's FY20 values × 10 (±₹10 cr rounding; no better source on file).
// Idempotent. Usage: node tools/authoring/BAJAJHFL.patch.js (prints the patched FY20 column).
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'BAJAJHFL', 'screener.json');
const P = 'Mar 2020';
const CO = { Revenue: 2646, Interest: 1616, 'Profit before tax': 567, 'Net Profit': 421 }; // company, FY20

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'FY20 column restored: P&L from company 9-year snapshot (Q1FY27 presentation p10), balance sheet and cash flow = Screener x10. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  const pl = S.tables['profit-loss'], i = pl.periods.indexOf(P);
  if (i < 0 || !(pl.rows['Net Profit'][i] < 100)) { S._gamPatch = { ...keep, note: 'FY20 column not found or already on the right unit; no change' }; return S; }
  keep.original['profit-loss'] = Object.fromEntries(Object.entries(pl.rows).map(([k, v]) => [k, v[i]]));
  const dep = pl.rows.Depreciation[i] * 10, oi = (pl.rows['Other Income'][i] || 0) * 10;
  const set = (k, v) => { if (pl.rows[k]) pl.rows[k][i] = v; };
  Object.entries(CO).forEach(([k, v]) => set(k, v));
  set('Depreciation', dep);
  set('Other Income', oi);
  const finProfit = CO['Profit before tax'] + dep - oi;
  set('Financing Profit', finProfit);
  set('Expenses', CO.Revenue - CO.Interest - finProfit);
  set('Financing Margin %', Math.round(finProfit / CO.Revenue * 100));
  const j = i + 1; // FY21: shares implied by Screener's EPS basis
  set('EPS in Rs', Math.round(CO['Net Profit'] * pl.rows['EPS in Rs'][j] / pl.rows['Net Profit'][j] * 100) / 100);
  set('Tax %', Math.round((1 - CO['Net Profit'] / CO['Profit before tax']) * 100));
  // the engine reads attributable profit from the 'Profit for EPS' schedule: put FY20 on the same basis
  const np = S.schedules?.['profit-loss']?.['Net Profit'];
  if (np) { keep.original.schedules = {}; for (const k of ['Profit for EPS', 'Profit for PE', 'Profit excl Excep']) if (np[k] && typeof np[k][P] === 'number') { keep.original.schedules[k] = np[k][P]; np[k][P] = CO['Net Profit']; } }
  set('Revenue growth', null);
  if (pl.rows['Revenue growth']) pl.rows['Revenue growth'][j] = Math.round((pl.rows.Revenue[j] / CO.Revenue - 1) * 100);
  for (const tab of ['balance-sheet', 'cash-flow']) {
    const T = S.tables[tab], k = T.periods.indexOf(P);
    if (k < 0) continue;
    keep.original[tab] = Object.fromEntries(Object.entries(T.rows).map(([n, v]) => [n, v[k]]));
    for (const n of Object.keys(T.rows)) if (typeof T.rows[n][k] === 'number' && !/%/.test(n)) T.rows[n][k] = T.rows[n][k] * 10;
  }
  // FY21 equity capital is ₹4,883 cr and no capital was raised in FY21: use it for FY20 too (×10 gives 4,880)
  const bs = S.tables['balance-sheet'], b = bs.periods.indexOf(P);
  if (b >= 0) { const d = bs.rows['Equity Capital'][b + 1] - bs.rows['Equity Capital'][b]; bs.rows['Equity Capital'][b] += d; bs.rows.Reserves[b] -= d; }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };

if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  for (const tab of ['profit-loss', 'balance-sheet', 'cash-flow']) {
    const T = S.tables[tab], k = T.periods.indexOf(P);
    console.log(`== ${tab} ${P}`, Object.fromEntries(Object.entries(T.rows).map(([n, v]) => [n, v[k]])));
  }
}
