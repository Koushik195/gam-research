// TORNTPHARM: put Screener's data on the basis of the company that trades on 30-Sep-2026: Torrent Pharma with
// 100% of J.B. Chemicals & Pharmaceuticals (JB) merged in, on 38.04 cr shares.
// WHY. Torrent bought 46.39% of JB from KKR's Tau Investment Holdings for Rs11,917 cr on 21-Jan-2026 and 2.41% from
// JB employees for Rs620 cr (23-Jan and 3-Feb-2026): 48.80%, consolidated from 21-Jan-2026 with a 51.20%
// non-controlling interest (AR FY26 note 42). JB then merged into Torrent: NCLT Ahmedabad sanctioned the scheme,
// effective 8-Jul-2026 (appointed date 21-Jan-2026; Q1FY27 call, 30-Jul-2026); 4,19,22,416 new Torrent shares
// were allotted on 20-Jul-2026 to JB's other shareholders at 51 Torrent shares per 100 JB shares (record date
// 17-Jul-2026), taking Torrent from 33,84,45,440 to 38,03,67,856 shares. The scheme was approved and effective well
// before 30-Sep-2026, so the share count and the balance sheet are made PRO FORMA for the merger. The engine projects
// from the last actual year with one share count (FY26 profit / EPS), so FY26 must be the combined company.
// (1) FY26 (Mar 2026) P&L = PRO-FORMA COMBINED YEAR, as if JB had been owned 100% from 1-Apr-2025 and the
//     acquisition debt had been raised then. Sourced: revenue Rs17,352 cr and PBT Rs2,570 cr "net of amortisation
//     and depreciation on fair value of identified assets" (AR FY26 note 42F, Torrent reported + JB before
//     21-Jan-2026); Torrent reported EBITDA Rs4,558 cr, D&A Rs1,119 cr (incl. Rs257 cr of JB purchase-price
//     amortisation for the 70 days from 21-Jan; Q4FY26 call), interest Rs385 cr, other income incl. exceptional
//     items -Rs182 cr, tax Rs734 cr (AR FY26 consolidated P&L); JB's own quarters to Dec-2025 (Screener JBCHEPHARM):
//     D&A 43+44+45, other income 15+15+18, interest 1+1+2. Derived: JB pre-completion D&A Rs143 cr (incl. 20/90 of
//     its Mar-26 quarter), other income Rs45 cr, interest Rs4 cr; purchase-price amortisation for the 295 days before
//     21-Jan at the stub run-rate (Rs257 cr / 70 days) = Rs1,083 cr; EBITDA = the balancing figure that reproduces
//     the AR's Rs2,570 cr pro forma PBT = Rs5,441 cr (JB pre-completion Rs883 cr vs Rs907 cr in JB's Apr-Dec books:
//     JB's own Jan-26 quarter carried change-of-control charges). Check: Mar-26 net debt Rs12,684 cr / 5,441 =
//     2.33x vs the company's "2.3x on JB's full-year FY26 EBITDA" (Q4FY26 call). Added (GAM): interest for 295 days
//     on the Rs12,500 cr acquisition debt at its 7.66% average NCD coupon = Rs774 cr. Tax: Torrent Rs734 cr + JB
//     pre-completion 25.17% x Rs781 cr - deferred-tax credit on the extra amortisation (25.17% x 1,083) - tax
//     saved on the added interest (25.17% x 774) = Rs463 cr. Result: PBT Rs1,796 cr, profit Rs1,333 cr, all
//     attributable (no minorities once merged), EPS Rs35.04 on 38.0368 cr shares (reported FY26: Rs2,163 cr to
//     owners, EPS Rs63.92 on 33.84 cr shares). Payout = FY26 dividends declared (Rs29 interim + Rs9 final = Rs38 on
//     33.84 cr shares = Rs1,286 cr) / pro forma profit = 96.5%.
// (2) Mar-26 BALANCE SHEET pro forma for the merger: the Rs9,196.40 cr non-controlling interest becomes owners'
//     equity (Ind AS: buying out a minority for shares is an equity transaction at carrying value); equity capital
//     Rs190.18 cr (38.0368 cr x Rs5), reserves take the rest (net worth Rs17,584 cr).
//     HOW, so that the engine and the Excel model stay identical: src/excel.js reads borrowings, other liabilities,
//     gross block, accumulated depreciation and current-asset schedules from the UNPATCHED Screener file, and only
//     equity, reserves, CWIP, investments and cash from the model (as ASTERDM.patch.js notes). Other liabilities
//     (Rs20,200 cr) therefore still contain the NCI and the Rs5,670.04 cr deferred tax liability (Rs4,969 cr of it on
//     JB's brands; AR notes 24/42). Neither is working capital: left in, working capital would be -72% of sales
//     (-19% without the NCI) and every rupee of growth would release cash. So assumptions.json sets
//     otherTreasury.base = -(NCI + DTL) = -Rs14,866.44 cr, which the engine and the Excel both take out of working
//     capital (13.45% of pro forma sales, in line with the business) and add to net cash; Investments are raised by
//     the same Rs14,866.44 cr so net debt is unchanged (Rs12,913 cr incl. leases); and CWIP is lowered by the DTL
//     (Rs641 cr - 5,670 cr = -Rs5,029 cr: the DTL netted against the asset base, a modelling line held flat) so the
//     balance sheet balances. Engine limit (reported): the DTL unwinds by ~Rs337 cr a year (book tax is lower than
//     cash tax because the brand amortisation is not tax-deductible); the engine treats book tax as cash, so our own
//     net-debt path in TORNTPHARM.ctx.js deducts it.
// (3) Quarterly: Q4FY26 profit to owners Rs389 cr (FY26 Rs2,163.37 cr less Q1-Q3), EPS Rs11.51 (63.92 less
//     Q1-Q3 EPS); Q1FY27 EPS Rs14.87 as reported (computed on the post-merger share count; profit Rs566 cr, NCI nil;
//     NSE results filing 30-Jul-2026). Screener shows 10.76 and 16.72.
// Originals are kept under _gamPatch. Applied in memory by src/model.js on every build. Idempotent.
// Usage: node tools/authoring/TORNTPHARM.patch.js  (prints the checks)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'TORNTPHARM', 'screener.json');
const SHARES = 38.0367856; // crore, after the 20-Jul-2026 allotment
const NCI = 9196.40, DTL = 5670.04, OFFSET = NCI + DTL; // assumptions.otherTreasury.base = -OFFSET
const PPA_DAY = 257 / 70; // Rs cr a day of JB purchase-price amortisation (Q4FY26 stub)

// Pro forma FY26 build (Rs crore)
const B = {
  sales: 17352, // AR note 42F
  tor: { ebitda: 4558, dep: 1119, oi: -182, interest: 385, pbt: 2872, tax: 734 }, // Torrent reported (Screener / AR)
  jb: { dep: 43 + 44 + 45 + 20 / 90 * 50, oi: 15 + 15 + 18 + 20 / 90 * -15, interest: 1 + 1 + 2 + 20 / 90 * 1 }, // JB before 21-Jan-2026
  ppaPre: PPA_DAY * 295,
  arPbt: 2570, // AR pro forma PBT before acquisition interest
  acqDebt: 12500, coupon: 7.66, days: 295, t: 25.168,
};
B.dep = B.tor.dep + B.jb.dep + B.ppaPre;
B.oi = B.tor.oi + B.jb.oi;
B.ebitda = B.arPbt + B.dep - B.oi + B.tor.interest + B.jb.interest; // balancing: reproduces the AR's PBT
B.acqInt = B.acqDebt * B.coupon / 100 * B.days / 365;
B.interest = B.tor.interest + B.jb.interest + B.acqInt;
B.pbt = B.ebitda - B.dep + B.oi - B.interest;
B.jbPbtPre = B.arPbt - B.tor.pbt + B.ppaPre; // JB's own pre-completion PBT implied by the AR
B.tax = B.tor.tax + B.t / 100 * B.jbPbtPre - B.t / 100 * B.ppaPre - B.t / 100 * B.acqInt;
B.pat = B.pbt - B.tax;
B.eps = B.pat / SHARES;
B.divDeclared = 38 * 33.8445440;
B.payout = B.divDeclared / B.pat * 100;
const r2 = v => Math.round(v * 100) / 100;

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'FY26 = pro forma Torrent + 100% JB (merger effective 8-Jul-2026, 38.04 cr shares); Mar-26 NCI moved to equity, DTL netted against intangibles; Q4FY26/Q1FY27 EPS as reported. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  keep.original.pl = JSON.parse(JSON.stringify(pl.rows));
  const set = (k, v) => { pl.rows[k][j] = r2(v); };
  set('Sales', B.sales); set('Operating Profit', B.ebitda); set('Expenses', B.sales - B.ebitda);
  pl.rows['OPM %'][j] = Math.round(B.ebitda / B.sales * 100);
  set('Other Income', B.oi); set('Interest', B.interest); set('Depreciation', B.dep); set('Profit before tax', B.pbt);
  pl.rows['Tax %'][j] = Math.round(B.tax / B.pbt * 100);
  set('Net Profit', B.pat);
  pl.rows['EPS in Rs'][j] = Math.round(B.eps * 1e6) / 1e6;
  pl.rows['Dividend Payout %'][j] = Math.round(B.payout * 10) / 10;
  if (pl.rows['Sales growth']) pl.rows['Sales growth'][j] = Math.round((B.sales / pl.rows.Sales[j - 1] - 1) * 100);
  const ps = S.schedules['profit-loss'];
  keep.original.plSched = JSON.parse(JSON.stringify({ oi: ps['Other Income'], np: ps['Net Profit'] }));
  ps['Other Income']['Other income normal']['Mar 2026'] = r2(ps['Other Income']['Other income normal']['Mar 2026'] + B.jb.oi);
  ps['Net Profit']['Profit for EPS']['Mar 2026'] = r2(B.pat);
  ps['Net Profit']['Minority share']['Mar 2026'] = 0;
  ps['Net Profit']['Profit excl Excep']['Mar 2026'] = r2(B.pat - ps['Net Profit']['Exceptional items AT']['Mar 2026']);
  ps['Net Profit']['Profit for PE']['Mar 2026'] = ps['Net Profit']['Profit excl Excep']['Mar 2026'];
  // (2) balance sheet (tables only; see note 2)
  const bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026');
  keep.original.bs = Object.fromEntries(Object.entries(bs.rows).map(([r, v]) => [r, v[k]]));
  const nw = bs.rows['Equity Capital'][k] + bs.rows.Reserves[k];
  bs.rows['Equity Capital'][k] = r2(SHARES * 5);
  bs.rows.Reserves[k] = r2(nw + NCI - SHARES * 5);
  bs.rows.Investments[k] = r2(bs.rows.Investments[k] + OFFSET);
  bs.rows.CWIP[k] = r2(bs.rows.CWIP[k] - DTL);
  bs.rows['Total Liabilities'][k] = r2(bs.rows['Total Liabilities'][k] + NCI);
  bs.rows['Total Assets'][k] = r2(bs.rows['Total Assets'][k] + NCI);
  // (3) quarterly
  const q = S.tables.quarters, q4 = q.periods.indexOf('Mar 2026'), q1 = q.periods.indexOf('Jun 2026');
  keep.original.q = { np: q.rows['Net Profit'].slice(), eps: q.rows['EPS in Rs'].slice() };
  if (q4 >= 0) { q.rows['Net Profit'][q4] = 389; q.rows['EPS in Rs'][q4] = 11.51; S.schedules.quarters['Net Profit']['Profit for EPS']['Mar 2026'] = 389; }
  if (q1 >= 0) q.rows['EPS in Rs'][q1] = 14.87;
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES, NCI, DTL, OFFSET, B, PPA_DAY };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'], i = pl.periods.indexOf('Mar 2026'), bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026');
  console.log('pro forma FY26 | sales', pl.rows.Sales[i], 'EBITDA', pl.rows['Operating Profit'][i], 'D&A', pl.rows.Depreciation[i], 'OI', pl.rows['Other Income'][i], 'interest', pl.rows.Interest[i], 'PBT', pl.rows['Profit before tax'][i], 'tax', r2(B.tax), 'PAT', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(4), 'payout', pl.rows['Dividend Payout %'][i]);
  console.log('  JB pre-completion EBITDA', r2(B.ebitda - B.tor.ebitda), '| PBT before acquisition interest', r2(B.pbt + B.acqInt), '(AR 2,570) | ND/EBITDA', (12684 / B.ebitda).toFixed(2));
  const R = bs.rows, tl = R['Equity Capital'][k] + R.Reserves[k] + R.Borrowings[k] + R['Other Liabilities'][k], ta = R['Fixed Assets'][k] + R.CWIP[k] + R.Investments[k] + R['Other Assets'][k];
  const sch = S.schedules['balance-sheet'], cash = sch['Other Assets']['Cash Equivalents']['Mar 2026'];
  console.log('pro forma Mar-26 | liabilities', r2(tl), 'assets', r2(ta), '| net worth', r2(R['Equity Capital'][k] + R.Reserves[k]), '| CWIP', R.CWIP[k], 'investments', R.Investments[k]);
  console.log('  with otherTreasury -' + r2(OFFSET) + ': net debt', r2(R.Borrowings[k] - cash - R.Investments[k] + OFFSET), '| working capital % of pro forma sales', ((R['Other Assets'][k] - cash + OFFSET - R['Other Liabilities'][k]) / pl.rows.Sales[i] * 100).toFixed(2));
}
