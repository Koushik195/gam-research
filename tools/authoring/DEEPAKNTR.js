// Authoring source for the Deepak Nitrite initiating-coverage report (as of 30-Sep-2026).
// Part A (this file): chapters built on reported financials (Screener, consolidated).
// Part B (DEEPAKNTR.research.js) adds business, history, industry, segments, projects, moat,
// earnings quality, ownership, governance, forecasts, street, valuation and verdict chapters.
// Usage: node tools/authoring/DEEPAKNTR.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'DEEPAKNTR', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'A phenol boom, four years of falling profits, and a record quarter',
  blocks: [
    { p: 'Deepak Nitrite\'s revenue rose from ₹1,651 cr in FY18 to ₹6,802 cr in FY22 as the Dahej phenol complex came on stream and the Covid-era phenol shortage lifted prices. Net profit peaked at ₹1,067 cr (EPS ₹78) in FY22. Then it fell for four straight years, to ₹551 cr (EPS ₹40) in FY26, while revenue stayed flat at ₹7,700-8,300 cr: Chinese capacity pushed down phenol spreads and the prices of its nitration chemicals. Q1FY27 broke the trend: revenue +36%, net profit ₹345 cr (+207%), the best quarter ever, as the Middle East war widened phenol spreads.' },
    { pair: [
      { type: 'column', title: 'Revenue: flat for four years after the FY19-22 jump', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit has halved since FY22', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 29% at the peak, 12.5% in FY26', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: SRC.co },
      { type: 'column', title: 'Quarterly profit: Q1FY27 is three times a normal quarter', unit: 'Net profit (₹ crore)', x: 'Q.labels', series: [{ name: 'Net profit', ref: 'Q.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** this is a cyclical business. Profit follows the phenol spread and the price of Chinese intermediates, not a steady growth line. FY21-22 earnings were a boom; FY25-26 were close to a trough; Q1FY27 is another spike. Neither extreme is a good base for valuation, which is why we value the stock on Sep-28E earnings after spreads normalise.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Ten years of capex ate all the cash, and returns have fallen from 44% to 11%',
  blocks: [
    { p: 'Over FY17-26 Deepak Nitrite generated ₹5,571 cr of operating cash and spent ₹5,457 cr on plants: 98 paise of every rupee. The first half of that money (FY17-21, mainly the Dahej phenol complex) earned superbly: ROCE reached 40-44% in FY21-22. The second half (FY22-26) went into nitric acid, nitration, hydrogenation and fluorination plants, and into the start of the polycarbonate project. So far it has earned little: ROCE fell to 11% in FY26, below any reasonable cost of capital, and the AI segment\'s own pre-tax ROCE was under 5%.' },
    { pair: [
      { type: 'column', title: 'Capex vs operating cash flow', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: from 44% (FY22) to 11% (FY26)', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 50, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY17-21', 'FY22-26', 'Ten years'], rows: [
      ['Cash from operations', '2,059', '3,512', '5,571'],
      ['Capex', '1,806', '3,651', '5,457'],
      ['Free cash flow', '253', '−139', '114'],
      ['Dividends paid', '157', '476', '633'],
      { hl: true, cells: ['**Left after dividends**', '**96**', '**−615**', '**−519**'] },
    ], source: SRC.co } },
    { callout: '**The bigger bill is still to come.** FY27-29 capex is guided and modelled at ~₹8,600 cr, 1.6x the previous ten years combined, for the ₹11,500 cr propylene-to-polycarbonate programme, a ₹2,500 cr BPA plant and smaller projects. Polycarbonate is not expected to start before H2 FY28-29. Until then shareholders carry the debt, interest and depreciation without the revenue.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'From net cash to ~₹7,500 cr of net debt in three years',
  blocks: [
    { p: 'Deepak Nitrite had net cash in FY22-24. Borrowings rose from ₹286 cr (Mar-24) to ₹1,638 cr (Mar-26) as DCTL spent on new plants, and net debt reached ₹1,156 cr, about 1.2x FY26 EBITDA. The polycarbonate debt is fully tied up (60:40 debt to equity); management expects peak borrowing of ₹8,000-8,500 cr including working capital and says debt will stay below equity. Our model has net debt of ~₹3,000 cr at Mar-27 and ~₹7,500 cr at Mar-29 (~5x FY29E EBITDA). Working capital is the other strain: receivable days rose from 56 to 70 in FY26 as the company moved some customers to a dealer/consignment model.' },
    { pair: [
      { type: 'line', title: 'Working-capital days: receivables up to 70', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt: back above ₹1,000 cr, heading much higher', unit: 'Net debt (₹ crore; negative = net cash)', x: 'A.labels', from: 'FY17', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
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
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: a Mehta family company held mainly by Indian institutions',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs ~24%, FIIs only ~6%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at ~49%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 55, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
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
  const B = fs.existsSync(path.join(__dirname, 'DEEPAKNTR.research.js')) ? require('./DEEPAKNTR.research') : null;
  const report = {
    symbol: 'DEEPAKNTR', listing: 'NSE: DEEPAKNTR · BSE: 506401', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Chemicals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
