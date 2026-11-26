// OneSource report, Part A (2): balance sheet and cash, ownership base, annotated statements and statement notes.
const X = require('./ONESOURCE.ctx');
const { A, F, BS, C, n0, n1, cashPath, ndAt, ndLease, AS, sep } = X;
const NDP = C.netDebtPublished;

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: `Net debt rose from ₹471 cr to ₹1,176 cr in a year as capex and working capital ran ahead of revenue; lenders waived FY26 covenants`,
  blocks: [
    { p: `OneSource raised ₹801 cr of equity before listing (Nov-2024) and used it to prepay expensive debt and start its US$100m capex programme. In FY26 it spent ₹569 cr on capex and absorbed ₹277 cr of working capital, while operating cash flow before working capital was ₹294 cr: operating cash flow was only ₹9 cr (Screener; ₹8.5 cr in the AR). Company net debt (excluding leases) rose from ₹471 cr at Mar-25 to ₹903 cr at Sep-25 and ₹${n0(ndAt(X.ASOF))} cr at Mar-26 (borrowings ₹${n0(BS.borrowings)} cr less cash and bank balances of ~₹${n0(BS.cash + BS.otherBank + BS.liquidFunds)} cr); lease liabilities add ₹${n0(BS.leases)} cr. Receivables were ₹${n0(BS.receivables)} cr (177 days of sales) and inventory ₹${n0(BS.inventories)} cr, built for semaglutide launches and, the CFO says, paid for by customers (customer advances ~₹250 cr). The lenders granted waivers because financial covenants on several loans were not met for FY26. Credit ratings have risen five notches since listing into the 'A' category and the borrowing cost is below 9%.` },
    { pair: [
      { type: 'column', title: 'Company net debt: ₹471 cr → ₹1,176 cr in twelve months', unit: 'Net debt (₹ crore), excl. leases', x: ['Mar-25', 'Sep-25', 'Dec-25 (CARE)', 'Mar-26'], series: [{ name: 'Net debt', values: NDP.map(x => Math.round(x.netDebt)), fmt: 'num' }], labels: 'all', highlight: 'Mar-26', source: 'Company (Q2FY26 call), CARE (5-Mar-2026), AR FY26' },
      { type: 'line', title: 'Receivable and inventory days jumped in FY26', unit: 'Days', x: A.labels.slice(1), series: [{ name: 'Receivable days', values: A.debtorDays.slice(1), fmt: 'num' }, { name: 'Inventory days', values: A.inventoryDays.slice(1), fmt: 'num' }], labels: 'all', source: 'Screener.in (inventory days on material cost)' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-25', 'Mar-26', 'Note'], wide: [3], rows: [
      ['Net worth', '{{A.netWorth.1|num}}', '{{A.netWorth.2|num}}', `Includes goodwill of ₹${n0(BS.goodwill)} cr and other intangibles of ₹${n0(BS.otherIntangibles)} cr from the merger`],
      ['Borrowings (excl. leases)', '{{A.borrowings.1|num}}', '{{A.borrowings.2|num}}', `Lease liabilities ₹171 cr → ₹${n0(BS.leases)} cr (in Screener's other liabilities)`],
      ['Cash and investments (Screener)', '{{A.cashAndInvestments.1|num}}', '{{A.cashAndInvestments.2|num}}', 'Cash and margin-money deposits'],
      ['Inventories (Screener)', '{{A.inventories.1|num}}', '{{A.inventories.2|num}}', `AR: ₹158 cr → ₹${n0(BS.inventories)} cr`],
      ['Trade receivables', '{{A.receivables.1|num}}', '{{A.receivables.2|num}}', `₹154 cr due from Strides-group and promoter entities at Mar-26`],
      ['Trade payables', '{{A.payables.1|num}}', '{{A.payables.2|num}}', ''],
      ['Net fixed assets (incl. goodwill and intangibles)', '{{A.fixedAssets.1|num}}', '{{A.fixedAssets.2|num}}', ''],
      ['Capital work in progress (incl. intangibles under development)', '{{A.cwip.1|num}}', '{{A.cwip.2|num}}', `₹${n0(BS.iaudSuspended)} cr of intangible projects 'temporarily suspended' for 3+ years`],
    ], source: 'Screener.in (consolidated); AR FY26 balance sheet and notes 4F, 8, 12, 13, 32' } },
    { callout: `**Cash in the model.** The engine's net debt starts at ₹${n0(-cashPath[0])} cr at Mar-26 (Screener cash and investments less borrowings), rises to ₹${n0(-cashPath[1])} cr at Mar-27E as capex (₹${n0(AS.capex[0])} cr) and working capital absorb cash, and falls to ₹${n0(-cashPath[3])} cr by Mar-29E. Two caveats. First, the engine holds working capital at Mar-26's 31% of sales, which already nets the ₹${n0(BS.leases)} cr of leases; true operating working capital was ~47% of FY26 sales. Counting leases as debt instead (Sep-28E net debt ₹${n0(-ndLease)} cr rather than ₹${n0(-sep(F.treasury))} cr) and letting working capital settle at ~33% of sales gives almost the same answer; leases alone are worth ~₹${n0((X.V.tp - X.leaseTp))} a share. Second, net debt/EBITDA is ~${n1(-cashPath[1] / F.ebitda[0])}x at Mar-27E on our numbers, above the company's 1.5x guide, and ~${n1(-cashPath[2] / F.ebitda[1])}x at Mar-28E: leverage falls only if EBITDA rises as we forecast.` },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Arun Kumar group owns 30.5% (37% of it pledged); institutions 42.6%; the promoter group sold ~8 points within six months of listing',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions have kept buying', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter group: 37.8% → 30.5%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 20, max: 40, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Consolidated. FY24 is Stelis Biopharma before the merger (not comparable); FY25 is the first year of the combined company. EBITDA is before other income; Screener nets exceptional items into other income (FY25 −₹112 cr, FY26 −₹10 cr). Depreciation includes ₹137.8 cr a year of amortisation of the merger intangibles. Forecast other income is interest on a ~₹100 cr cash buffer plus small recurring items; interest is built on average borrowings.' },
    { statement: { title: 'Profit & loss, FY24–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 30 }, hl: true }, { key: 'ebitda', name: 'EBITDA (before other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 500 } }, { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'otherIncome', name: 'Other income (history incl. exceptional items)' }, { key: 'interest', name: 'Finance costs' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income incl. exceptional' },
      { key: 'interest', name: 'Finance costs' }, { key: 'dep', name: 'Depreciation & amortisation' }, { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {
  'sales@FY24': 'Stelis Biopharma alone, before the merger (pro-forma combined FY24: ₹1,082 cr).',
  'sales@FY25': 'First year of the combined company (merger effective 1-Apr-2024).',
  'ebitdaMargin@FY25': '32%: high-margin MSA development fees from GLP-1 customers.',
  'otherIncome@FY25': 'Net of ₹112 cr of exceptional listing and scheme costs.',
  'pat@FY25': 'Loss after ₹141 cr of scheme amortisation and ₹111 cr of exceptional costs; tax credit ₹50 cr.',
  'sales@FY26': '−2%: Canadian semaglutide approvals delayed; no new DDC MSAs taken from Q3.',
  'ebitdaMargin@FY26': '21%: fixed costs ahead of the new lines; includes a ₹31 cr forex gain.',
  'cfo@FY26': '₹9 cr: receivables +₹190 cr, inventory +₹281 cr.',
  'capex@FY26': '₹569 cr: second and third cartridge lines.',
  'sales@Q3FY26': '−26% YoY: Canadian approvals delayed.',
  'pat@Q3FY26': 'Loss of ₹89 cr (EBITDA ₹17 cr).',
  'sales@Q4FY26': '+47% QoQ: India semaglutide launch at the end of the quarter.',
  'sales@Q1FY27': '+37% YoY: Canada and India semaglutide supply.',
  'pat@Q1FY27': '₹25 cr: tax credit; ₹4 cr Prestige legal costs (exceptional).',
  'sales@FY27E': 'GAM: DDC & biologics ~2.1x, base business +6%.',
  'interest@FY27E': '8.25% on average borrowings + leases and bank charges.',
  'pat@FY27E': 'Tax 10%: brought-forward losses.',
  'pat@FY29E': 'Full 25.2% tax assumed.',
};

module.exports = { balance, ownershipBase, statements, statementNotes };
