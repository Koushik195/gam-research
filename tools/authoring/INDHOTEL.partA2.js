// Indian Hotels report, Part A (2): balance sheet, ownership base, annotated statements.
const fs = require('fs');
const path = require('path');
const SCR = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'INDHOTEL', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ~₹4,300 cr before leases; ~₹1,500 cr after leases; minorities are now ₹1,887 cr of the balance sheet',
  blocks: [
    { p: 'At Mar-2026 IHCL had ₹4,345 cr of cash and liquid investments and only ₹51 cr of bank debt: **net cash of ₹4,294 cr** on the company\'s measure (₹4,439 cr gross at Jun-2026). Lease liabilities of ₹2,786 cr (hotels run on long leases, e.g. The Pierre in New York, St James Court in London, Frankfurt from Jun-2026) are debt-like, so **net cash after leases was ~₹1,510 cr**. Screener counts ₹1,107 cr of strategic investments (JVs and associates at ₹567 cr of book value, plus equity stakes) as investments too, which takes its net cash measure, and our model\'s, to ₹2,600 cr. Two other items matter for valuation: minorities rose from ₹672 cr (Mar-24) to ₹1,887 cr (Mar-26) as TajSATS and the 51% acquisitions came in, and goodwill rose to ₹1,121 cr. ICRA upgraded IHCL to AAA (Stable) in FY26.' },
    { pair: [
      { type: 'column', title: 'Borrowings are now almost all lease liabilities', unit: 'Borrowings incl. lease liabilities (₹ crore)', x: 'A.labels', from: 'FY20', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: 'Screener.in (Mar-26: bank debt ₹51 cr, leases ₹2,786 cr)' },
      { type: 'line', title: 'Working capital is negative: guests pay before suppliers are paid', unit: 'Days (consolidated)', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Minority interest', '660', '672', '1,255', '1,887'],
      ['Borrowings incl. lease liabilities', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['  of which lease liabilities', '2,321', '2,476', '2,860', '2,785'],
      ['Cash, bank and investments (Screener, incl. strategic stakes)', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      { hl: true, cells: ['**Net cash incl. leases (Screener basis; negative = net debt)**', '**−195**', '**1,011**', '**1,377**', '**2,600**'] },
      ['Memo: company gross cash / net cash before leases', '–', '–', '3,073 / 2,848', '4,345 / 4,294'],
      ['Net fixed assets incl. goodwill and right-of-use', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
    ], source: 'Screener.in (borrowing and minority schedules); Q4FY26 deck slides 30, 50; AR FY26' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Tata group 38.1%; foreign funds selling, Indian funds and insurers buying',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs down from 27.8% to 21.7%; DIIs up from 18.4% to 24.5%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in (to Jun-2026)' },
      { type: 'column', title: 'Tata group steady at 38.1%', unit: 'Promoter group holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 0, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E (consolidated; profit attributable to owners)', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'Operating EBITDA (post-Ind AS)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation and amortisation' },
      { key: 'otherIncome', name: 'Other income (actuals incl. exceptional items)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex (forecasts incl. new leases)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (consolidated)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true }, { key: 'ebitda', name: 'Operating EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income (incl. exceptional)' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

module.exports = { balance, ownershipBase, statements };
