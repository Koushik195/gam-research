// Piramal Pharma report, Part A continued: balance sheet & leverage, ownership charts, annotated statements.
// Built on reported financials (Screener, consolidated) and AR FY26; loaded by PPLPHARMA.js.
const { A, b, ix, n0, n1, nd, RR, RL, SRC, FY } = require('./PPLPHARMA.base');

const balance = {
  id: 'balance', nav: 'Balance sheet & debt', kicker: 'Balance sheet', title: `Net debt ₹4,140 cr (3.6x company EBITDA, 4.3x on CARE's basis): above the rating trigger, and rising again in FY27`,
  blocks: [
    { p: `At March 2026 Piramal had ₹5,495 cr of borrowings plus ₹179 cr of leases against ₹1,224 cr of cash and bank balances and ₹132 cr of liquid investments: net debt ₹4,140 cr on the company's basis (₹4,199 cr a year earlier), ${n1(4140 / 1135)}x its own EBITDA including other income and ${n1(4140 / A.ebitda[b])}x Screener's EBITDA. Long-term borrowings rose from ₹3,214 cr to ₹4,300 cr in FY26 while short-term debt fell. CARE (AA, Stable, reaffirmed 17-Jul-2026) puts net debt at 4.28x its operating profit, above the 3.5x level it names as a downgrade trigger, and expects it below 3.5x in FY27. Liquidity is fine: ~₹1,332 cr of unencumbered cash and liquid investments, working-capital lines of ₹2,702 cr less than half used, and repayments of ₹630-800 cr a year. Management expects net debt/EBITDA to stay at about 3.6x through FY27 while it spends US$120-135 mn on capex and pays for Kenalog; its long-term goal is ~1x.` },
    { p: `Equity has hardly moved: ₹${n0(A.netWorth[ix('FY24')])} cr at Mar-24 after the ₹1,050 cr rights issue (Aug-2023, ₹81 a share), ₹${n0(A.netWorth[b])} cr at Mar-26, as currency gains on the overseas plants offset the FY26 loss. Working capital is heavy and lumpy: inventory ₹${n0(A.inventories[b])} cr (${RR('Inventory Days').at(-1)} days of material cost on Screener's basis, up from ${RR('Inventory Days')[RL.indexOf('FY25')]}) and receivables ₹${n0(A.receivables[b])} cr. FY26 operating cash flow of ₹${n0(A.cfo[b])} cr was flattered by ₹945 cr more payables; management warns some of that may reverse.` },
    { pair: [
      { type: 'column', title: 'Net debt: ₹3,800-4,700 cr every year since FY23 (Screener basis incl. leases)', unit: 'Net debt (₹ crore), borrowings incl. leases less cash and all investments', x: FY, series: [{ name: 'Net debt', values: FY.map(nd), fmt: 'num' }], labels: 'all', source: `${SRC.co}; the company's own basis excludes leases and equity-accounted investments (₹4,140 cr at Mar-26)` },
      { type: 'line', title: 'Inventory days jumped in FY26; payables financed it', unit: 'Days (Screener basis)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Equity', '{{A.netWorth.2|num}}', '{{A.netWorth.3|num}}', '{{A.netWorth.4|num}}', '{{A.netWorth.5|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.2|num}}', '{{A.borrowings.3|num}}', '{{A.borrowings.4|num}}', '{{A.borrowings.5|num}}'],
      ['Cash and investments (incl. ₹244 cr equity-accounted at Mar-26)', '{{A.cashAndInvestments.2|num}}', '{{A.cashAndInvestments.3|num}}', '{{A.cashAndInvestments.4|num}}', '{{A.cashAndInvestments.5|num}}'],
      ['Net fixed assets incl. goodwill and intangibles', '{{A.fixedAssets.2|num}}', '{{A.fixedAssets.3|num}}', '{{A.fixedAssets.4|num}}', '{{A.fixedAssets.5|num}}'],
      ['Capital work in progress', '{{A.cwip.2|num}}', '{{A.cwip.3|num}}', '{{A.cwip.4|num}}', '{{A.cwip.5|num}}'],
      ['Inventories', '{{A.inventories.2|num}}', '{{A.inventories.3|num}}', '{{A.inventories.4|num}}', '{{A.inventories.5|num}}'],
      ['Trade receivables', '{{A.receivables.2|num}}', '{{A.receivables.3|num}}', '{{A.receivables.4|num}}', '{{A.receivables.5|num}}'],
      ['Trade payables', '{{A.payables.2|num}}', '{{A.payables.3|num}}', '{{A.payables.4|num}}', '{{A.payables.5|num}}'],
      { hl: true, cells: ['**Net debt, company basis (excl. leases)**', '–', '–', '**4,199**', '**4,140**'] },
    ], source: `${SRC.co}; AR FY26 (goodwill ₹1,257 cr, intangibles ₹2,584 cr, intangibles under development ₹301 cr at Mar-26); company net debt from the Q4FY26 presentation. Piramal does not publish a June balance sheet.` } },
    { callout: '**Debt in the model:** the forecast "net cash" row is cash and all investments less borrowings incl. leases (−₹4,014 cr at Mar-26 on Screener\'s figures). With capex of ₹1,580 cr in FY27E (incl. Kenalog) and working capital growing with sales, it reaches about {{F.treasury.0|num}} cr at Mar-27E and {{F.treasury.2|num}} cr at Mar-29E. The up-to-US$65 mn Kenalog contingent payment is not in the model.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Piramal family 34.8%, Carlyle ~18% and looking for the exit, domestic funds ~15%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic funds doubled to ~15%; the June "FII" drop is a reclassification', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in (to Jun-2026); see the note on Carlyle below' },
      { type: 'column', title: 'Promoter holding steady at ~35%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 30, max: 40, source: 'BSE shareholding pattern, Screener.in (to Jun-2026)' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY21–FY29E (consolidated)', rows: [
      { key: 'sales', name: 'Revenue from operations', flag: { type: 'pct', th: 10 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (before other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation and amortisation' },
      { key: 'otherIncome', name: 'Other income incl. associates (actuals after exceptional items)' },
      { key: 'interest', name: 'Interest' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 50 } },
      { key: 'eps', name: 'EPS (₹; FY26 on 132.92 cr shares)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex (FY27E incl. Kenalog)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (Screener basis)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (before other income)' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income incl. associates (after exceptional items)' },
      { key: 'interest', name: 'Interest' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

module.exports = { balance, ownershipBase, statements };
