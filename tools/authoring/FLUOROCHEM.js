// Authoring source for the Gujarat Fluorochemicals (GFL) initiating-coverage report, as of 30-Sep-2026.
// Part A (this file): chapters built on reported financials (Screener, consolidated).
// Part B (FLUOROCHEM.research.js) adds business, history, industry, segments, battery materials, moat,
// earnings quality, ownership, governance, forecasts, street, valuation and verdict chapters from research/*.json.
// Usage: node tools/authoring/FLUOROCHEM.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'FLUOROCHEM', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k];
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'A boom in FY23, a bust in FY24, and a slow climb back',
  blocks: [
    { p: 'GFL\'s results swing with fluoropolymer and refrigerant prices. Revenue rose 44% to ₹5,685 cr in FY23, when PTFE and refrigerant prices were high and the EBITDA margin reached 35%; net profit was a record ₹1,323 cr. In FY24 Chinese supply and customer destocking cut revenue by 25% and net profit by 67% (₹435 cr). Since then the recovery has been slow: FY26 revenue was ₹4,996 cr, still 12% below FY23, and net profit ₹574 cr, 57% below. Q1FY27 was the best quarter since FY23: revenue ₹1,588 cr (+24%) and net profit ₹219 cr (+20%), helped by the new R32 refrigerant plant. (Figures before FY22 are distorted by the 2019 demerger and one-off tax items, so we start the story in FY22.)' },
    { pair: [
      { type: 'column', title: 'Revenue: FY23 peak not yet regained', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: still less than half of FY23', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 35% at the peak, 21-24% since', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY22', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 40, source: 'Screener.in (annual accounts basis: excludes forex gains)' },
      { type: 'column', title: 'Depreciation up 79% in four years as plants were added', unit: 'Depreciation (₹ crore)', x: 'A.labels', from: 'FY22', series: [{ name: 'Depreciation', ref: 'A.dep', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** GFL is a capital-heavy business in the middle of its biggest investment cycle. Gross block rose from ₹3,680 cr in FY22 to ₹7,053 cr in FY26 and another ₹1,900 cr sits in plants not yet finished. Depreciation and interest have grown faster than profit, and the battery business has added losses (₹104 cr after tax in FY26). Return on equity has been 8% for three years, well below the cost of equity.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Five years of capex funded by operating cash and debt; returns have fallen to 8%',
  blocks: [
    { p: 'Over FY22-26 GFL generated ₹3,612 cr of operating cash and spent ₹4,510 cr on plants: ₹1.25 for every rupee of operating cash. Dividends were small (₹154 cr in five years). The gap was closed with debt and, in FY26, with ₹430 cr from the International Finance Corporation (IFC) at the battery subsidiary. About ₹2,000 cr of the spending went into battery materials, which earned ₹33 cr of segment revenue and lost ₹80 cr at the EBITDA level in FY26. Screener\'s return on capital employed (ROCE) fell from 30% in FY23 to 10% in FY24-26.' },
    { pair: [
      { type: 'column', title: 'Capex has exceeded operating cash for three years', unit: '₹ crore', x: 'A.labels', from: 'FY22', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'ROCE: 30% in FY23, 10% since', unit: 'Return on capital employed (%)', x: RL.slice(-5), series: [{ name: 'ROCE', values: RR('ROCE %').slice(-5), fmt: 'pct0' }], labels: 'all', min: 0, max: 35, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went, FY22-26 (₹ crore)', head: ['', 'FY22-23', 'FY24-26', 'Five years'], rows: [
      ['Cash from operations', '1,480', '2,132', '3,612'],
      ['Capex', '1,405', '3,105', '4,510'],
      ['Free cash flow', '75', '−973', '−898'],
      ['Dividends paid', '66', '88', '154'],
      { hl: true, cells: ['**Left after dividends**', '**9**', '**−1,061**', '**−1,052**'] },
    ], source: SRC.co } },
    { callout: '**Where it went right and wrong:** in FY26 the Chemicals segment earned ₹1,371 cr of EBITDA on ₹6,313 cr of capital employed: a healthy business. The battery segment had ₹1,599 cr of capital employed (₹2,793 cr of assets) and lost money. The company\'s own ROCE (14.05%) and ROE (12.17%) for FY26 leave out capital in capacity added over the last two years and plants still being built; on all of its equity GFL earned about 7.6%. The next two years will test whether the battery spending earns its cost of capital.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Debt is rising with the battery build-out; working capital is heavy',
  blocks: [
    { p: 'Net debt (borrowings less cash and investments) was ₹2,094 cr at March 2026, about 1.7x Screener EBITDA. Borrowings of ₹2,721 cr include ₹430 cr of IFC\'s convertible preference shares in GFCL EV, which carry no interest but will become equity in the subsidiary. Working capital is the other big use of money: inventories were ₹1,933 cr (453 days of revenue on Screener\'s cost basis) because GFL keeps 30-90 days of stock in warehouses in the US and Germany and runs integrated chains from fluorspar to polymer. Management cut working-capital days from 192 to 149 in Q1FY27. With ₹3,150 cr of capex planned for FY27 and ~₹2,400 cr more in FY28, we expect net debt to more than triple by FY28.' },
    { pair: [
      { type: 'line', title: 'Inventory days: ~450 for three years', unit: 'Days (of revenue, Screener basis)', x: RL.slice(-5), series: [{ name: 'Inventory days', values: RR('Inventory Days').slice(-5), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days').slice(-5), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt has climbed since FY23', unit: 'Net debt (₹ crore)', x: 'A.labels', from: 'FY22', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.4|num}}', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}', '{{A.netWorth.8|num}}'],
      ['Borrowings (incl. leases and IFC CCPS)', '{{A.borrowings.4|num}}', '{{A.borrowings.6|num}}', '{{A.borrowings.7|num}}', '{{A.borrowings.8|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.4|num}}', '{{A.cashAndInvestments.6|num}}', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.8|num}}'],
      ['Net debt', '{{A.netDebt.4|num}}', '{{A.netDebt.6|num}}', '{{A.netDebt.7|num}}', '{{A.netDebt.8|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.4|num}}', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.8|num}}'],
      ['Capital work in progress', '{{A.cwip.4|num}}', '{{A.cwip.6|num}}', '{{A.cwip.7|num}}', '{{A.cwip.8|num}}'],
      ['Inventories', '{{A.inventories.4|num}}', '{{A.inventories.6|num}}', '{{A.inventories.7|num}}', '{{A.inventories.8|num}}'],
      ['Trade receivables', '{{A.receivables.4|num}}', '{{A.receivables.6|num}}', '{{A.receivables.7|num}}', '{{A.receivables.8|num}}'],
    ], source: SRC.co } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Jain family holds 61%, down from 68% in 2020',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs up from 8.6% to 13.3%; FIIs ~4.4%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter stake drifting down', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 70, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'interest', name: 'Interest' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'FLUOROCHEM.research.js')) ? require('./FLUOROCHEM.research') : null;
  const report = {
    symbol: 'FLUOROCHEM', listing: 'NSE: FLUOROCHEM · BSE: 542812', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Chemicals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
