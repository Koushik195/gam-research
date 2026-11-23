// WIPRO: put Screener's data on the basis of the company that trades on 30-Sep-2026.
// (1) Net Profit -> Screener's "Profit for EPS" (attributable, after minorities), annual and quarterly. Screener's
//     consolidated "Net Profit" is before minorities (FY26 Rs13,266 cr) while EPS is after (Rs12.58).
// (2) PRO-FORMA FY26 FOR THE JUNE-2026 BUYBACK. Wipro bought back 60 cr shares at Rs250 (Rs15,000 cr) in a tender
//     offer (11-17 Jun 2026, settled 24-Jun) and extinguished them on 30-Jun-2026: shares went from 1,050.35 cr to
//     990.35 cr (extinguishment filing, 30-Jun-2026). The engine takes its share count from FY26 profit / EPS
//     (1,054.5 cr on Screener's rows, 1,049.0 cr on attributable profit): ~6% more shares than trade today, so every
//     forecast EPS and per-share value would be understated. FY26 EPS is therefore restated to attributable profit
//     (Rs13,197 cr) / 990.35 cr post-buyback shares = Rs13.33 (reported Rs12.58), and the Mar-26 balance sheet is
//     made pro-forma for the cash that left after Mar-26:
//       - buyback Rs15,000 cr: investments -15,000; equity capital to Rs1,980.7 cr (990.35 cr x Rs2); reserves take
//         the rest, so net worth falls by exactly Rs15,000 cr;
//       - acquisitions closed after Mar-26 (AR FY26 note 39): Mindsprint $375 mn (May-2026), Alpha Net contracts
//         $70.8 mn, 20% more of Aggne $28.5 mn = $474.3 mn x Rs93.5 = Rs4,435 cr: investments -4,435 and CWIP
//         +4,435 (the acquired businesses' net assets). CWIP is used because the engine holds it flat and
//         src/excel-model.js reads gross block from Screener's schedules; their amortisation is captured through
//         the depreciation rate (calibrated on Q1FY27, which has two months of Mindsprint).
//     Result: Screener-basis net cash at Mar-26 goes from Rs37,051 cr to Rs17,616 cr; the company's Jun-26 balance
//     sheet (after one quarter of cash generation) gives Rs21,420 cr on the same basis. Borrowings, other liabilities,
//     cash, gross block, cash flow and quarterly rows stay as reported. Originals kept under _gamPatch. Idempotent;
//     applied in memory by src/model.js on every build.
// Usage: node tools/authoring/WIPRO.patch.js  (prints the checks)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'WIPRO', 'screener.json');
const SHARES = 990.3549797; // crore, after the 30-Jun-2026 extinguishment
const BUYBACK = 15000, ACQ = 4435, EQCAP = Math.round(SHARES * 2 * 100) / 100;

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit -> Profit for EPS; FY26 EPS on post-buyback shares; Mar-26 balance sheet pro-forma for the buyback and post-Mar-26 acquisitions. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab], pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`WIPRO patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  keep.original.epsFY26 = pl.rows['EPS in Rs'][j];
  pl.rows['EPS in Rs'][j] = Math.round(pl.rows['Net Profit'][j] / SHARES * 10000) / 10000;
  // (3) Dividend payout: Screener's row is one year out of step at the end (Mar 2025 shows 5%, Mar 2026 48%, TTM 87%),
  //     while Wipro paid Rs6 a share for FY25 and Rs11 for FY26 (AR FY26). Set payout so DPS = EPS x payout gives Rs6.0
  //     and Rs11.0 (FY26 on the pro-forma EPS).
  const dp = pl.rows['Dividend Payout %'], j5 = pl.periods.indexOf('Mar 2025');
  keep.original.payout = dp.slice();
  dp[j5] = Math.round(6 / pl.rows['EPS in Rs'][j5] * 1000) / 10;
  dp[j] = Math.round(11 / pl.rows['EPS in Rs'][j] * 1000) / 10;
  const bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026');
  keep.original.bs = Object.fromEntries(['Equity Capital', 'Reserves', 'Investments', 'CWIP', 'Total Liabilities', 'Total Assets'].map(r => [r, bs.rows[r][k]]));
  const nw0 = bs.rows['Equity Capital'][k] + bs.rows.Reserves[k];
  bs.rows['Equity Capital'][k] = EQCAP;
  bs.rows.Reserves[k] = Math.round((nw0 - BUYBACK - EQCAP) * 100) / 100;
  bs.rows.Investments[k] -= BUYBACK + ACQ;
  bs.rows.CWIP[k] += ACQ;
  bs.rows['Total Liabilities'][k] -= BUYBACK;
  bs.rows['Total Assets'][k] -= BUYBACK;
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES, BUYBACK, ACQ };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'], i = pl.periods.indexOf('Mar 2026'), bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026');
  const o = S._gamPatch;
  console.log('reported FY26 | Net Profit', o.original['profit-loss'][i], 'EPS', o.original.epsFY26, 'implied shares', (o.original['profit-loss'][i] / o.original.epsFY26).toFixed(1), '| attributable', pl.rows['Net Profit'][i], '->', (pl.rows['Net Profit'][i] / o.original.epsFY26).toFixed(1));
  console.log('pro-forma FY26 | EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(actual 990.35 cr after 30-Jun-2026)');
  const sch = S.schedules['balance-sheet']['Other Assets']['Cash Equivalents']['Mar 2026'];
  const R = bs.rows, nc = sch + R.Investments[k] - R.Borrowings[k];
  console.log('pro-forma Mar-26 | net worth', (R['Equity Capital'][k] + R.Reserves[k]).toFixed(0), 'investments', R.Investments[k], 'CWIP', R.CWIP[k], 'net cash (Screener basis)', nc.toFixed(0), '| balance', (R['Equity Capital'][k] + R.Reserves[k] + R.Borrowings[k] + R['Other Liabilities'][k] - R['Fixed Assets'][k] - R.CWIP[k] - R.Investments[k] - R['Other Assets'][k]).toFixed(0));
}
