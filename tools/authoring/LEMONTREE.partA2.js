// Lemon Tree report, Part A (2): balance sheet, ownership base, annotated statements.
const fs = require('fs');
const path = require('path');
const SCR = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'LEMONTREE', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Debt is falling but still heavy: ₹1,500 cr of bank debt plus ₹503 cr of leases, 2.6x EBITDA; minorities own a third of the equity',
  blocks: [
    { p: 'Unlike IHCL, EIH and ITC Hotels, which hold net cash, Lemon Tree is a borrower. At Mar-2026 it owed ₹1,500 cr to banks (₹1,699 cr a year earlier) and ₹503 cr of lease liabilities, against ₹171 cr of cash, bank balances and investments, so **net debt including leases was ₹1,833 cr** on Screener\'s figures (2.6x FY26 operating EBITDA; CRISIL 2.63x). Bank debt fell to ₹1,475 cr at Jun-2026 at a 7.48% cost. The equity side is unusual: of ₹2,079 cr of total equity, **₹687 cr (33%) belongs to minorities**, mostly the 41.09% of Fleur Hotels that APG sold to Warburg Pincus on 22-May-2026. CRISIL rates the bank lines A+ on "Watch Developing" until the scheme is approved; ICRA reviewed its rating in Aug-2026. After the scheme, all the group\'s debt moves to Fleur and Lemon Tree becomes debt-free.' },
    { pair: [
      { type: 'column', title: 'Borrowings incl. leases peaked at ₹2,336 cr in FY24', unit: 'Borrowings incl. lease liabilities (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: 'Screener.in (bank debt ₹1,500 cr + leases ₹503 cr at Mar-26)' },
      { type: 'line', title: 'Guests pay quickly: receivable days ~22-29', unit: 'Days (consolidated)', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Minority interest (mainly Fleur Hotels\' 41.09%)', 'n.a.', 'n.a.', '626', '687'],
      ['Borrowings incl. lease liabilities', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['  of which bank debt / leases (company)', 'n.a.', 'n.a.', '1,699 / 449', '1,500 / 503'],
      ['Cash, bank and investments', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      { hl: true, cells: ['**Net debt incl. leases (Screener basis)**', '**{{A.netDebt.8|num}}**', '**{{A.netDebt.9|num}}**', '**{{A.netDebt.10|num}}**', '**{{A.netDebt.11|num}}**'] },
      ['Net fixed assets incl. right-of-use', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
    ], source: 'Screener.in; Q4FY26 deck slide 17; AR FY26 consolidated balance sheet; CRISIL (17-Jul-2026) (n.a. = not taken from the filings for this report)' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the founder 22%, APG 15%, institutions falling; retail holders now own 44%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign investors down from ~27% to 19%; DIIs from ~21% to 14%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in (to Jun-2026)' },
      { type: 'column', title: 'Promoters steady at ~22.3%', unit: 'Promoter group holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 0, max: 40, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E (consolidated; profit attributable to owners)', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'Operating EBITDA (post-Ind AS, ex other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation and amortisation' },
      { key: 'interest', name: 'Finance cost (bank debt + leases)' },
      { key: 'otherIncome', name: 'Other income incl. finance income (actuals incl. exceptional items)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (consolidated)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true }, { key: 'ebitda', name: 'Operating EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income (incl. exceptional)' },
      { key: 'interest', name: 'Finance cost' }, { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

module.exports = { balance, ownershipBase, statements };
