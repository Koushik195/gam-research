// Poly Medicure report, part A2: balance sheet & cash, ownership base charts, annotated statements (merged by POLYMED.js).
const X = require('./POLYMED.ctx');
const { FYS, IX } = { FYS: ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], IX: l => X.A.labels.indexOf(l) };
const n0 = v => Math.round(v).toLocaleString('en-IN');

const balance = (() => {
  const { FY26, grossCash, DEBT, netCash, F, n1, YRS, C } = X;
  return {
    id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Balance sheet: still net cash (₹489 cr), but the QIP pile has shrunk by a third and working capital now ties up 44% of sales',
    blocks: [
      { p: `At Mar-26 Polymed held ₹${n0(FY26.cash)} cr of cash, deposits and mutual funds (₹1,227 cr a year earlier) against ₹${n1(FY26.debt)} cr of borrowings (₹${n1(FY26.debtShortTerm)} cr short-term working-capital lines, ₹${n1(FY26.debtLongTerm)} cr long-term, mostly Citieffe's) and ₹${n1(FY26.leases)} cr of leases: net cash of ₹${n0(netCash[0])} cr, ~3% of the market value. Cash was ₹${C.q1fy27.cash} cr at Jun-26. The weak spot is working capital: standalone receivables rose to 98 days (78) as Polymed gave export customers longer terms, inventory is ~150 days (2.5-3 months of raw material is kept deliberately), and suppliers are paid in ~35 days, so the standalone cash conversion cycle is 215 days (183). Consolidated, Screener's working-capital items are ~44% of sales, and every ₹100 cr of extra revenue needs ~₹44 cr of cash. Other items: goodwill ₹${n0(FY26.goodwill)} cr and acquired intangibles ~₹131 cr (16% of net worth together), a 10% minority in PendraCare (₹43 cr), ~₹39 cr of contingent deal payments, and ₹33 cr paid for Himalayan Mineral Water (IBC). CRISIL raised the outlook to AA-/Positive in Jun-2026.` },
      { pair: [
        { type: 'column', title: 'Gross cash: ₹314 cr → ₹1,227 cr (QIP) → ₹842 cr', unit: '₹ crore (cash + investments, Screener); FY27-29E = GAM', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'Cash and investments', values: [361, 309, 314, 1227, 843, ...grossCash.slice(1).map(v => Math.round(v))], fmt: 'num' }], labels: 'all', highlight: 'FY25', source: 'Screener.in balance sheet; GAM (engine net cash plus borrowings)' },
        { type: 'line', title: 'Cash conversion cycle: up from ~180 to ~335 days', unit: 'Days (Screener, inventory and payables on material cost)', x: FYS, series: [{ name: 'Receivable days', values: FYS.map(l => X.A.debtorDays[IX(l)]), fmt: 'num' }, { name: 'Cash conversion cycle', values: FYS.map(l => X.A.ccc[IX(l)]), fmt: 'num' }], labels: 'last', source: 'Screener.in (company standalone basis: 183 → 215 days)' },
      ] },
      { exhibit: { type: 'table', title: 'Cash, debt and our path (₹ crore)', head: ['', 'Mar-26', 'Mar-27E', 'Mar-28E', 'Mar-29E'], rows: [
        ['Cash, deposits and mutual funds (gross)', ...grossCash.map(n0)],
        ['Borrowings and leases', ...DEBT.map(n0)],
        { hl: true, cells: ['**Net cash (engine)**', ...netCash.map(v => `**${n0(v)}**`)] },
        ['Working capital (engine, 44% of sales)', n0(X.A.otherAssets[X.b] - X.A.cash[X.b] - X.A.otherLiab[X.b]), ...F.owc.map(n0)],
        ['Free cash flow (engine)', '−59', ...F.fcf.map(n0)],
      ], source: 'Screener.in; AR FY26; GAM. Engine net cash = cash + investments − borrowings (incl. leases); forecasts hold working capital at FY26\'s 44% of sales, which includes acquired working capital against only 4-6 months of acquired revenue (pro-forma ~41%), so the cash path is conservative by ~₹70 cr in FY27E.' } },
      { callout: '**What to watch.** (1) Receivables: management expects a similar cycle in FY27; a return to ~80 days would free ~₹80 cr. (2) The ₹484 cr still in funds: management calls it a strategic reserve for acquisitions and capex at two new plants. (3) Debt: ₹250 cr of revolving lines in the parent is cheap insurance, but it means net cash is lower than the headline cash.' },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Baid family owns 62%; domestic funds have replaced foreign investors since the QIP',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs out, domestic institutions in', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 53% → 66% (Jun-24) → 62% after the QIP', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 45, max: 70, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Net profit is profit attributable to shareholders (Screener "Profit for EPS"; PendraCare\'s 10% minority is a small share of losses). EPS is Screener\'s, on year-end shares (FY25 ₹33.41 vs the company\'s ₹34.1 on weighted shares after the Aug-2024 QIP). Other income in the history includes the Egyptian associate\'s share of profit and, for FY26, is net of the ₹6.8 cr labour-code charge. Screener labels FY25-26 mutual-fund gains "exceptional"; they are treasury income. In the forecasts the tax line carries tax plus minorities, so profit and EPS are to Polymed\'s shareholders.' },
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 18 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'otherIncome', name: 'Other income (incl. associate)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation & amortisation' }, { key: 'interest', name: 'Interest' }, { key: 'pat', name: 'Net profit (owners)', hl: true },
    ] } },
  ],
};

module.exports = { balance, ownershipBase, statements };
