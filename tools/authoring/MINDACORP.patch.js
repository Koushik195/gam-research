// MINDACORP: in-memory fixes applied by src/model.js on every build (patchRaw); idempotent.
// 1) Attributable profit. Screener's consolidated "Net Profit" row is before minorities (FY26 Rs358 cr; minorities were
//    a small loss) while "EPS in Rs" (Rs15.07) is on profit attributable to owners (Rs360.3 cr). We put Net Profit on
//    Screener's own "Profit for EPS" basis, as UPL/UNOMINDA/BHARATFORG do. Minorities grow from FY27 (50% of Minda Vast,
//    consolidated from 1-Apr-2026; 40% of the Toyodenso switch JV): the forecast deducts them (see assumptions.json).
// 2) Promoter warrants. 76,50,000 warrants were allotted to Minda Capital (promoter) on 2-Jun-2025 at Rs550; 25%
//    (Rs105.19 cr) was paid and the balance (Rs315.56 cr) is due on conversion within 18 months, i.e. by Dec-2026.
//    At the 30-Sep-2026 close (Rs692.85) they are deep in the money, so we treat them as converted: FY26 EPS is
//    restated to a pro forma Rs14.60 on 24.673 cr shares (23.908 cr + 0.765 cr), and the Rs315.56 cr balance is added
//    to cash and to equity in the Mar-2026 balance sheet (pro forma). Every forecast EPS, the DCF and the target are then
//    on the fully diluted count. The engine has no share-issue line for industrial companies (it fixes shares at FY26
//    profit / EPS). Reported FY26 EPS was Rs15.07 (statement note). The house forward-P/E history reads Screener's
//    unpatched EPS, so the multiple history is unaffected.
// Screener's quarters to Jun-2026 match the company's Q1FY27 deck (revenue Rs1,846 cr, EBITDA Rs212 cr, PAT Rs206 cr);
// the Sep-2026 columns (Q2FY27 and the half-year balance sheet, filed Nov-2026) are dropped by the engine's as-of freeze.
const SHARES_DILUTED = 24.6729428; // crore: 23,90,79,428 outstanding (AR FY26) + 76,50,000 warrants
const WARRANT_BALANCE = 315.56; // Rs crore, 75% of Rs550 x 76.5 lakh

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS"; FY26 EPS pro forma on 24.673 cr fully diluted shares; Mar-2026 cash and reserves + Rs315.56 cr warrant balance. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`MINDACORP patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  if (j < 0) throw new Error('MINDACORP patch: no Mar 2026 column');
  keep.original.eps = pl.rows['EPS in Rs'].slice();
  pl.rows['EPS in Rs'][j] = Math.round(pl.rows['Net Profit'][j] / SHARES_DILUTED * 100) / 100;
  const bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026');
  if (k < 0) throw new Error('MINDACORP patch: no Mar 2026 balance sheet');
  keep.original.bs = { reserves: bs.rows.Reserves[k], otherAssets: bs.rows['Other Assets'][k], totalLiab: bs.rows['Total Liabilities'][k], totalAssets: bs.rows['Total Assets'][k] };
  bs.rows.Reserves[k] += WARRANT_BALANCE;
  bs.rows['Other Assets'][k] += WARRANT_BALANCE;
  bs.rows['Total Liabilities'][k] += WARRANT_BALANCE;
  bs.rows['Total Assets'][k] += WARRANT_BALANCE;
  const cash = S.schedules?.['balance-sheet']?.['Other Assets']?.['Cash Equivalents'];
  if (!cash || typeof cash['Mar 2026'] !== 'number') throw new Error('MINDACORP patch: no Mar 2026 cash schedule');
  keep.original.cash = cash['Mar 2026'];
  cash['Mar 2026'] += WARRANT_BALANCE;
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_DILUTED, WARRANT_BALANCE };
