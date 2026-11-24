// ITC Hotels report, Part A (2): balance sheet, ownership base, annotated statements.
const fs = require('fs');
const path = require('path');
const SCR = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'ITCHOTELS', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'No debt, ~₹3,175 cr of net cash and ₹1,240 cr of unsold Colombo apartments: about 13% of the market value sits outside the hotels',
  blocks: [
    { p: 'At Mar-2026 ITC Hotels had **₹3,250 cr of cash, deposits and investments** (₹766 cr of cash and bank balances, ₹826 cr of mutual funds, ₹1,004 cr of bonds and listed associates, ₹529 cr of long bank deposits) and no bank debt; lease liabilities were ₹74 cr. Net cash was therefore ~₹3,175 cr (~₹15 a share), including ₹126 cr of associates at book (International Travel House 48.96%, a JV in WelcomHeritage). Screener shows only ₹2,721 cr of cash and investments because the long deposits sit in "other assets"; our model adds them back. The second large item is **₹1,240 cr of inventory**: the unsold apartments at Sapphire Residences, Colombo, carried at cost. They turn into cash only as buyers take handover (₹211 cr of revenue in FY26, ₹38 cr in Q1FY27). Equity is ₹11,658 cr, mostly hotels carried at ITC\'s historical book value.' },
    { pair: [
      { type: 'column', title: 'Cash and investments rose with the demerger and since', unit: 'Cash, bank and investments on Screener (₹ crore; excl. ₹529 cr of long deposits at Mar-26)', x: 'A.labels', from: 'FY25', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: 'Screener.in; AR FY26 note 6' },
      { type: 'line', title: 'Guests pay quickly: receivables ~20 days', unit: 'Days (consolidated)', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Working capital days', values: SCR.rows['Working Capital Days'], fmt: 'num' }], labels: 'last', source: 'Screener.in (FY24 = ~8 months)' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.1|num}}', '{{A.netWorth.2|num}}'],
      ['Borrowings (all lease liabilities)', '{{A.borrowings.1|num}}', '{{A.borrowings.2|num}}'],
      ['Cash, bank and investments (Screener)', '{{A.cashAndInvestments.1|num}}', '{{A.cashAndInvestments.2|num}}'],
      ['Bank deposits over 12 months (in other assets)', '7', '529'],
      { hl: true, cells: ['**Net cash incl. long deposits, after leases**', '**~2,264**', '**~3,175**'] },
      ['Inventory (Sapphire Residences apartments at cost)', '{{A.inventories.1|num}}', '{{A.inventories.2|num}}'],
      ['Net fixed assets incl. right-of-use', '{{A.fixedAssets.1|num}}', '{{A.fixedAssets.2|num}}'],
      ['Capital work in progress', '{{A.cwip.1|num}}', '{{A.cwip.2|num}}'],
    ], source: 'Screener.in; AR FY26 consolidated balance sheet and notes 5, 6, 10, 13, 14' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: ITC 39.85%; BAT halved its stake, foreign funds fell from 25% to 12% and Indian funds and retail took the shares',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs down from 25.4% to 11.6%; DIIs and retail up', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'Public', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in (to Jun-2026)' },
      { type: 'column', title: 'ITC steady at 39.85%', unit: 'Promoter (ITC Ltd) holding (%)', x: 'SH.periods', series: [{ name: 'ITC Ltd', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 0, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY24–FY29E (consolidated; FY24 = ~8 months from incorporation)', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA (company definition)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation and amortisation' },
      { key: 'otherIncome', name: 'Other income (actuals incl. associates and exceptional items)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex (forecasts incl. acquisitions)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (consolidated)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income (incl. exceptional)' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

module.exports = { balance, ownershipBase, statements };
