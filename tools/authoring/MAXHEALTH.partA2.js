// Max Healthcare report, Part A (2): balance sheet, ownership base, annotated statements.
const fs = require('fs');
const path = require('path');
const SCR = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'MAXHEALTH', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));

const balance = {
  id: 'balance', nav: 'Balance sheet & debt', kicker: 'Balance sheet', title: 'From net cash to ₹2,800 cr of net debt in three years; still under 1.3x EBITDA',
  blocks: [
    { p: 'At Mar-2026 MHIL (consolidated) had ₹2,907 cr of borrowings (term loans and an ECB, partly hedged), ₹572 cr of lease liabilities and ₹701 cr of cash and bank balances: **net debt of ₹2,772 cr including leases**, 1.2x FY26 EBITDA. In Q1FY27 the Kalinga purchase (₹298 cr, ECB-funded) and YPPL added ~₹480 cr more on the company\'s Network measure (₹1,908 cr → ₹2,384 cr, which excludes leases and nets the PHF societies\' cash). Two other items matter: ₹746 cr of interest-bearing loans to the Gujarmal Modi society that owns Max Smart (an asset we leave out of net debt; its ₹69 cr of interest sits in other income), and ~₹6,000 cr of goodwill and intangibles from the 2020 merger and acquisitions, which inflate capital employed and depress reported ROE. CARE rates the company AA+ (Stable).' },
    { pair: [
      { type: 'column', title: 'Borrowings incl. leases tripled after the FY25 acquisitions', unit: 'Borrowings incl. lease liabilities (₹ crore)', x: 'A.labels', from: 'FY21', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: 'Screener.in (lease liabilities ₹572 cr at Mar-26)' },
      { type: 'line', title: 'Receivable days rising with government-scheme patients', unit: 'Days (consolidated)', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in; Network DSO 95 days at Jun-26 (company)' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. lease liabilities', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash, bank and investments', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      { hl: true, cells: ['**Net debt incl. leases (negative = net cash)**', '**−780**', '**198**', '**2,325**', '**2,772**'] },
      ['Memo: Network net debt (company; excl. leases, incl. PHFs)', '–', '–', '1,576', '1,908'],
      ['Loans to Partner Healthcare Facilities (AR note 13)', '–', '–', '383', '746'],
      ['Net fixed assets incl. goodwill and intangibles', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
    ], source: 'Screener.in; AR FY26; Q4FY26 and Q1FY27 releases (Network net debt). Network net debt was ₹2,384 cr at Jun-26.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Abhay Soi at 23.7%; foreign funds selling, Indian funds buying',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs down from 55% to 42% in a year; DIIs up from 17% to 30%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in (to Jun-2026)' },
      { type: 'column', title: 'Promoter steady at ~23.7% (Abhay Soi)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 0, max: 40, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E (MHIL consolidated)', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA (post-Ind AS)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation and amortisation' },
      { key: 'otherIncome', name: 'Other income (after exceptional items)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex (forecasts incl. acquisitions paid, PHF funding and new leases)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (consolidated)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

module.exports = { balance, ownershipBase, statements };
