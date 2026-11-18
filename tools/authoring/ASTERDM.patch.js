// ASTERDM: put Screener's data on the basis of the company that trades today, Aster DM Quality Care Ltd.
// (1) Net Profit -> Screener's "Profit for EPS" (after minorities), as RAINBOW.patch.js does. Screener's FY26
//     "Net Profit" (Rs427 cr) is before minorities while EPS (Rs7.49) is after, which implies 57.0 cr shares;
//     on "Profit for EPS" (Rs388 cr) FY26 implies 51.8 cr, the real pre-merger count (51,81,21,029, AR FY26).
// (2) Screener books the Rs374.38 cr "equity component of compulsorily convertible preference shares" (AR FY26,
//     other equity) as borrowings. The Excel model reads Screener's borrowing schedules directly, so the row is left
//     as is and neutralised inside the FY26 treasury plug below (FY22-FY25 history keeps Screener's treatment).
// (3) FY26 (Mar 2026) is replaced by a PRO-FORMA COMBINED year (Aster + Quality Care India, QCIL). Why: QCIL
//     merged into Aster with effect from 1-Jul-2026 (NCLT Hyderabad order 19-Jun-2026; 35,35,51,410 new shares
//     allotted 13-Jul-2026 at 977 Aster shares per 1,000 QCIL shares; 87,16,72,439 shares since). On 30-Sep-2026
//     the share price is the price of the merged company, the scheme uses pooling of interests (book values,
//     Ind AS 103), and the company reports the two businesses as one (pro-forma FY24-FY26, Q1FY27). The engine
//     projects from the last actual year with one share count, so the base year must be the combined company.
//     Sourced: revenue Rs9,273 cr (Aster 4,643 + QCIL 4,630, Q1FY27 deck p.29); EBITDA = Aster post-Ind AS
//     Rs901 cr (FY26 deck p.22) + QCIL operating EBITDA Rs1,066 cr (deck p.20); Aster's other income 125.6,
//     finance cost 123, depreciation 264, tax 143, associates -37, minorities 39 (AR FY26 / deck p.22);
//     combined net debt excluding leases Rs763 cr at Mar-26 (Aster net cash 626, QCIL net debt 1,388: June-2026
//     investor presentation p.9); Aster balance sheet (Screener / AR FY26); QCIL net worth incl. minorities
//     Rs6,135 cr (Sep-25, scheme notice p.47) and minorities Rs1,518 cr (FY24, scheme deck note); Aster's 5%
//     QCIL stake at cost Rs849 cr (1,90,46,028 shares at Rs445.83) eliminated on merger.
//     GAM estimates (listed in deep.json gaps): QCIL other income 20, finance cost 200, depreciation 300, tax
//     25%, minorities' share of profit 81; QCIL leases ~267 (Sep-25 net debt incl. leases 476 less 209 excl.);
//     QCIL working capital +Rs216 cr (standalone Sep-25 balance sheet scaled by revenue x3.37).
//     HOW THE BALANCE SHEET IS PATCHED: src/excel-model.js reads borrowings, other liabilities, gross block and
//     current-asset schedules from the unpatched Screener file, and only equity, reserves, CWIP, investments and
//     cash from the model. To keep the engine and the Excel identical, only those five lines change for Mar-26:
//     equity 871.67 and reserves to give attributable net worth Rs8,343 cr (Aster 4,575 incl. the CCPS reserve +
//     QCIL 4,617 [6,135 less 1,518 minorities] - Aster's 849 QCIL stake); INVESTMENTS = -Rs1,280 cr, a treasury
//     plug = Aster investments 1,167 - QCIL stake 849 - associates 318 - QCIL net debt and leases 1,655 + the
//     CCPS reserve 374 that Screener counts as debt (net debt incl. leases Rs2,549 cr = company Rs763 cr + leases
//     Rs1,785 cr); CWIP = Rs7,007 cr, the balancing line = Aster CWIP 420 + QCIL net operating assets (fixed
//     assets incl. goodwill, CWIP, working capital) + associates 318 - QCIL minorities. Borrowings (Rs2,594 cr),
//     other liabilities (incl. Aster's Rs258 cr minorities), net block and gross block stay Aster's, so QCIL's
//     depreciation is captured through a higher depreciation rate on the gross block (assumptions.json) and the
//     working-capital ratio is Aster's (-3.9% of revenue). Cash flow and quarterly rows stay as reported.
// Originals are kept under _gamPatch. Applied in memory by src/model.js on every build. Idempotent.
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ASTERDM', 'screener.json');
const SHARES = 87.1672439; // crore, after the 13-Jul-2026 allotment

// Pro-forma FY26 (Rs crore)
const PF = {
  pl: { Sales: 9273, 'Operating Profit': 1967, 'Other Income': 146, Interest: 323, Depreciation: 564, 'Profit before tax': 1226, 'Net Profit': 779 },
  tax: 290, // Aster 143 + QCIL 25% x 586
  payoutPct: 34, // FY26 DPS Rs3.0 (interim) on EPS 8.94
  bs: { 'Equity Capital': 871.67, Reserves: 7471.33, Investments: -1280, CWIP: 7007, 'Total Liabilities': 12217, 'Total Assets': 12217 },
};

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit -> Profit for EPS; CCPS equity component moved from borrowings to reserves; FY26 = pro-forma Aster + QCIL. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  // (1) attributable profit, annual and quarterly
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab], pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`ASTERDM patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  const bs = S.tables['balance-sheet'];
  keep.original.bs = JSON.parse(JSON.stringify(bs.rows));
  // (3) pro-forma FY26
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  keep.original.pl = JSON.parse(JSON.stringify(pl.rows));
  for (const [k, v] of Object.entries(PF.pl)) pl.rows[k][j] = v;
  pl.rows.Expenses[j] = PF.pl.Sales - PF.pl['Operating Profit'];
  pl.rows['OPM %'][j] = Math.round(PF.pl['Operating Profit'] / PF.pl.Sales * 100);
  pl.rows['Tax %'][j] = Math.round(PF.tax / PF.pl['Profit before tax'] * 100);
  pl.rows['EPS in Rs'][j] = Math.round(PF.pl['Net Profit'] / SHARES * 10000) / 10000;
  pl.rows['Dividend Payout %'][j] = PF.payoutPct;
  const psch = S.schedules['profit-loss'];
  psch['Other Income']['Exceptional items']['Mar 2026'] = 0; psch['Other Income']['Other income normal']['Mar 2026'] = PF.pl['Other Income'];
  psch['Net Profit']['Profit for EPS']['Mar 2026'] = PF.pl['Net Profit']; psch['Net Profit']['Minority share']['Mar 2026'] = -120;
  psch['Net Profit']['Profit excl Excep']['Mar 2026'] = PF.pl['Net Profit']; psch['Net Profit']['Exceptional items AT']['Mar 2026'] = 0;
  const k = bs.periods.indexOf('Mar 2026');
  for (const [r, v] of Object.entries(PF.bs)) bs.rows[r][k] = v;
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, PF, SHARES };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'], i = pl.periods.indexOf('Mar 2026'), bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026');
  const orig = S._gamPatch.original.pl;
  console.log('reported FY26 | Net Profit (Screener)', S._gamPatch.original['profit-loss'][i], 'Profit for EPS', 388, 'EPS', orig['EPS in Rs'][i], 'implied shares', (388 / orig['EPS in Rs'][i]).toFixed(2), '(actual 51.81 cr pre-merger)');
  console.log('pro-forma FY26 | Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(actual 87.17 cr after 13-Jul-2026)');
  const R = bs.rows, tl = R['Equity Capital'][k] + R.Reserves[k] + R.Borrowings[k] + R['Other Liabilities'][k], ta = R['Fixed Assets'][k] + R.CWIP[k] + R.Investments[k] + R['Other Assets'][k];
  const nd = R.Borrowings[k] - 1325 - R.Investments[k];
  console.log('pro-forma Mar-26 balance sheet | liabilities', tl, 'assets', ta, '| attributable net worth', R['Equity Capital'][k] + R.Reserves[k], '| net debt incl. leases', nd, 'excl. leases', nd - 1785, '(company 763)');
}
