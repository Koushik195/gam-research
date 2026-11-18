// Authoring source for the Kalyan Jewellers initiating-coverage report.
// Part A (this file): chapters built on reported financials (Screener, consolidated).
// Part B (KALYANKJIL.research.js) adds business, industry, segment, moat, ownership, governance,
// forecast, valuation and verdict chapters from research/company.json and deep.json.
// Usage: node tools/authoring/KALYANKJIL.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'KALYANKJIL', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2)), invDays = SCR.rows['Inventory Days'];
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue has quadrupled in five years; margins have not moved',
  blocks: [
    { p: 'Kalyan\'s revenue rose from ₹8,573 cr in FY21 (a COVID year) to ₹35,743 cr in FY26, about 33% a year, and was up 46% in Q1FY27. Net profit rose faster, from a small loss to ₹1,350 cr, because interest and other fixed costs grew much more slowly than sales. But the EBITDA margin has stayed in a narrow 6-8% band for a decade. Jewellery retail is a high-volume, thin-margin trade: most of the selling price is the gold itself.' },
    { pair: [
      { type: 'column', title: 'Revenue: ~33% a year since FY21', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY18', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: up 6x since FY22', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY18', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: stuck at 6-8%', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY18', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 10, source: SRC.co },
      { type: 'column', title: 'Interest has barely grown while revenue tripled', unit: 'Interest cost (₹ crore)', x: 'A.labels', from: 'FY18', series: [{ name: 'Interest', ref: 'A.interest', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** the profit story is operating leverage, not pricing power. Interest was ₹390 cr in FY18 and ₹499 cr in FY26 while revenue grew 3.4x, so interest fell from 3.7% to 1.4% of sales. The franchise (FOCO) model lets Kalyan open stores with partners\' capital, which is why debt has not grown with the business.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Working capital & debt', kicker: 'Balance sheet', title: 'Inventory is the business: ₹14,175 cr of gold on the shelves',
  blocks: [
    { p: 'A jeweller\'s main asset is its stock. Kalyan held ₹14,175 cr of inventory at March 2026, about 70% of total assets. It funds this with three sources: (1) gold metal loans and working-capital debt from banks (short-term borrowings ₹4,111 cr), (2) advances from customers, mostly monthly gold-savings schemes (₹4,396 cr), and (3) suppliers and franchise partners. Inventory days have fallen from 272 in FY21 to ~165, mainly because franchise stores carry less company-funded stock.' },
    { pair: [
      { type: 'line', title: 'Inventory days have fallen by 100+ days', unit: 'Inventory days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: invDays, fmt: 'num' }], labels: 'all', source: 'Screener.in' },
      { type: 'column', title: 'Operating cash flow positive every year since FY21', unit: 'Cash from operations (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'CFO', ref: 'fin.cfo', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.4|num}}', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}', '{{A.netWorth.8|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.4|num}}', '{{A.borrowings.6|num}}', '{{A.borrowings.7|num}}', '{{A.borrowings.8|num}}'],
      ['Other liabilities (payables, customer advances)', '{{A.otherLiab.4|num}}', '{{A.otherLiab.6|num}}', '{{A.otherLiab.7|num}}', '{{A.otherLiab.8|num}}'],
      ['Fixed assets', '{{A.fixedAssets.4|num}}', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.8|num}}'],
      ['Other assets (mainly inventory)', '{{A.otherAssets.4|num}}', '{{A.otherAssets.6|num}}', '{{A.otherAssets.7|num}}', '{{A.otherAssets.8|num}}'],
    ], source: SRC.co } },
    { callout: '**What to watch:** borrowings rose to ₹6,117 cr in FY26 (₹4,111 cr bank and gold loans plus ₹2,006 cr lease liabilities) because the gold price jump made every gram of stock more expensive. Gold metal loans are partly a natural hedge: the loan is denominated in gold, so a rise in the gold price raises the liability and the inventory together. Note also that reported operating cash flow counts new gold loans as an operating inflow (₹1,251 cr in FY26); excluding them, FY26 operating cash flow was close to zero. Growth is funded by gold borrowing.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: a promoter-controlled company, with foreign investors stepping back',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs have halved their stake since 2023; DIIs tripled theirs', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters hold ~63%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 70, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 30 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 100 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 60 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 40 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'interest', name: 'Interest' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {
  'sales@FY21': 'COVID lockdowns closed stores for much of Q1FY21.',
  'sales@FY22': 'Post-COVID recovery; pent-up wedding demand.',
  'sales@FY23': 'Strong wedding season and store additions; gold price up.',
  'sales@FY24': 'FOCO-led store expansion outside South India, plus higher gold prices.',
  'sales@FY26': 'Gold price surge (~+40-50% YoY) plus ~170 new stores, mostly franchise.',
  'pat@FY22': 'Recovery from the COVID-hit FY21 loss.',
  'pat@FY23': 'Operating leverage: revenue +30%, interest flat.',
  'pat@FY26': 'Revenue +43% with interest up only 18%; margin held.',
  'ebitdaMargin@FY25': 'Customs duty on gold cut from 15% to 6% (Jul-2024): inventory losses on high-duty stock and pass-through of lower prices.',
};

module.exports = { financials, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'KALYANKJIL.research.js')) ? require('./KALYANKJIL.research') : null;
  const report = {
    symbol: 'KALYANKJIL', listing: 'NSE: KALYANKJIL · BSE: 543278', date: '24 October 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer & Retail',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, balance, ownershipBase, statements }) : [financials, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
