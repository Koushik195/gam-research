// Authoring source for the PI Industries initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated).
// Part B (PIIND.research.js) adds business, history, industry, segments, moat, earnings quality,
// ownership, governance, forecasts, street, valuation and verdict chapters from research/*.json.
// Usage: node tools/authoring/PIIND.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'PIIND', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Five years of compounding, then two years of decline',
  blocks: [
    { p: 'PI\'s revenue grew from ₹3,366 cr in FY20 to ₹7,978 cr in FY25, about 19% a year, and net profit from ₹457 cr to a peak of ₹1,682 cr in FY24, as its export (CSM) business scaled up a handful of patented molecules for global agrochemical companies. Then growth stopped. Revenue was flat in FY25 (+4%) and fell 16% in FY26 to ₹6,714 cr as global customers cut orders and PI\'s largest molecule met generic competition. Net profit fell to ₹1,321 cr, and that includes a one-off ₹126 cr gain. Q1FY27 was weaker still: revenue −10%, profit −39%.' },
    { pair: [
      { type: 'column', title: 'Revenue: doubled in four years, then fell 16%', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: peaked in FY24', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 28% at the peak, falling since', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 30, source: SRC.co },
      { type: 'column', title: 'Other income is now a quarter of pre-tax profit', unit: 'Other income as % of profit before tax', x: 'A.labels', from: 'FY19', series: [{ name: 'Other income share', ref: 'A.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: 'Screener.in (consolidated; FY26 includes ₹97 cr of net exceptional gains)' },
    ] },
    { callout: '**Our view:** the FY20-24 boom rested on a few molecules, above all one herbicide (pyroxasulfone) whose customer was 44% of FY25 revenue. As that molecule goes generic and the agchem cycle stays weak, revenue and margins fall together. Meanwhile PI is spending more on new businesses (pharma, global biologicals, electronic chemicals, its own molecules): employee costs rose from 10% to 14% of revenue in FY26. Interest on the cash pile now props up profit.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'More capital, less return: ROCE has halved since FY24',
  blocks: [
    { p: 'Over FY21-26 PI generated ₹6,678 cr of operating cash, spent ₹3,690 cr on plants and R&D assets, ₹989 cr on acquisitions (pharma in FY24, Plant Health Care in FY25) and ₹881 cr on dividends. It also raised ₹2,000 cr in a QIP (July 2020). Gross block went from ₹2,747 cr to ₹6,615 cr and capital work in progress to ₹1,030 cr. The returns have not followed: ROCE fell from 24% in FY24 to 15% in FY26, and ROE to 12%, because revenue fell while the new capacity, new businesses and a growing cash pile all sit in the denominator.' },
    { pair: [
      { type: 'column', title: 'Capex has risen as cash generation fell', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: from 24% to 15% in two years', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '2,755', '3,923', '6,678'],
      ['Capex', '1,102', '2,588', '3,690'],
      ['Acquisitions', '0', '989', '989'],
      ['Dividends paid', '251', '630', '881'],
      { hl: true, cells: ['**Left over**', '**1,402**', '**−284**', '**1,118**'] },
      ['Memo: QIP proceeds (Jul-2020)', '2,000', '–', '2,000'],
    ], source: SRC.co } },
    { callout: '**The test ahead:** management guides ₹700-800 cr of capex a year and says new plants take 4-5 years to ramp up. HSBC put it bluntly on the May-2026 call: ~₹2,600 cr of capex over three years and asset turns down from ~2.5x to ~1.5x. Capacity utilisation was ~80% in FY26. Until the new molecules fill the plants, returns stay low.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ₹3,800 cr, but working capital doubled in FY26',
  blocks: [
    { p: 'PI has almost no debt (₹342 cr incl. leases at Mar-2026) and ₹3,542 cr of cash and investments, so it is net cash (₹3,794 cr on the company\'s count at Jun-2026, ~11% of its market value). The weak spot is working capital. Net working capital rose from 73 days of sales at Mar-2025 to 139 days at Mar-2026: inventories up, receivables up as PI extended credit to Indian distributors, and "contract assets" (inventory built for contract-manufacturing customers, recognised as revenue before shipment) up from ₹404 cr to ₹698 cr. Operating cash flow fell to ₹474 cr in FY26 from ₹1,413 cr. Q1FY27 released ₹300 cr (120 days), a good start.' },
    { pair: [
      { type: 'line', title: 'Working-capital days jumped in FY26', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }], labels: 'last', source: 'Screener.in (receivables exclude contract assets)' },
      { type: 'column', title: 'Cash and investments: the 2020 QIP plus retained cash', unit: 'Cash and investments (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
    ], source: SRC.co } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Singhal family at 46%, Indian funds buying as foreigners sell',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs down to 14.8%; DIIs up to 31.5%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at 46.1%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 30, max: 60, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'PIIND.research.js')) ? require('./PIIND.research') : null;
  const report = {
    symbol: 'PIIND', listing: 'NSE: PIIND · BSE: 523642', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Agrochemicals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
