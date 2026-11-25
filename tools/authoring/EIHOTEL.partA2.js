// EIH report, Part A (2): balance sheet, ownership base, annotated statements.
const fs = require('fs');
const path = require('path');
const SCR = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'EIHOTEL', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'No bank debt, ~₹1,340 cr of net cash after leases, CARE AA+: the balance sheet is not the issue',
  blocks: [
    { p: 'EIH repaid its last bank loans in FY24 (bank borrowings ₹571 cr at Mar-23, nil since; AR ten-year table). At Mar-2026 the only debt was ₹252 cr of lease liabilities. Cash and bank balances were ₹934 cr and investments ₹656 cr (including the 36.81% stake in listed EIH Associated Hotels at ₹240 cr of book value and the Avis India, Oberoi Mauritius and La Roseraie stakes), so **net cash after leases was ~₹1,338 cr** on Screener\'s figures, close to the company\'s "surplus funds" of ₹1,335 cr (₹1,368 cr at Jun-2026). Minority interest is small (₹147 cr). CARE assigned an AA+ (Stable) issuer rating in Dec-2025 and expects capex to be funded from cash and accruals with no debt. The Mashobra settlement removed a ₹91 cr user-fee provision and a ₹136 cr receivable from Mashobra Resort (half of it written off) from the balance sheet in FY26.' },
    { pair: [
      { type: 'column', title: 'Borrowings are now only lease liabilities', unit: 'Borrowings incl. lease liabilities (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: 'Screener.in (bank debt nil since FY24)' },
      { type: 'line', title: 'Working capital is negative: guests pay before suppliers are paid', unit: 'Days (consolidated)', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in (payable days on material cost)' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Minority interest', '97', '147', '131', '147'],
      ['Borrowings incl. lease liabilities', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['  of which lease liabilities', '181', '199', '265', '252'],
      ['Cash, bank and investments (Screener, incl. strategic stakes at book)', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      { hl: true, cells: ['**Net cash after leases (Screener basis)**', '**605**', '**890**', '**1,195**', '**1,338**'] },
      ['Memo: company surplus funds', '468', '744', '1,051', '1,335'],
      ['Net fixed assets incl. right-of-use', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
    ], source: 'Screener.in (borrowing and minority schedules); Q4FY26 deck slide 18; AR FY26; CARE (15-Dec-2025)' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Oberoi family 32.9%, Reliance 18.8%, ITC 16.1%; only ~32% is truly free float',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign investors up from 3.7% to 6.7%; DIIs ~14%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in (to Jun-2026)' },
      { type: 'column', title: 'Promoters steady at 32.85%', unit: 'Promoter group holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 0, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E (consolidated; profit attributable to owners)', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'Operating EBITDA (post-Ind AS, ex other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation and amortisation' },
      { key: 'otherIncome', name: 'Other income incl. associates (actuals incl. exceptional items)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (consolidated)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true }, { key: 'ebitda', name: 'Operating EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income incl. associates (incl. exceptional)' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

module.exports = { balance, ownershipBase, statements };
