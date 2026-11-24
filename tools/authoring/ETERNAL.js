// Authoring source for the Eternal (Zomato + Blinkit) initiating-coverage report.
// Part A (this file): chapters built on reported financials. Part B (ETERNAL.research.js, merging
// ETERNAL.part2.js … part5.js) adds the platform-economics, competition, street and valuation chapters.
// Usage: node tools/authoring/ETERNAL.js   (then node src/model.js ETERNAL)
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ETERNAL', 'research');
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue has jumped 27x in five years; profit is still thin',
  blocks: [
    { p: 'Eternal\'s reported revenue rose from ₹1,994 cr in FY21 to ₹54,364 cr in FY26. Two things drove it: food delivery kept growing (order value up ~80% from FY22 to FY25), and quick commerce (Blinkit, bought in 2022) grew into the largest business. The FY26 jump (+169%) is mostly an accounting change: from Q2FY26 Blinkit owns the goods it sells (the "1P" or inventory model), so revenue now includes the full sale value, not just a commission. The company turned profitable in FY24 (₹351 cr), but profit is small against a ~₹3 lakh crore market value: ₹366 cr in FY26 and ₹92 cr in Q1FY27, after a sharp rise in tax.' },
    { pair: [
      { type: 'column', title: 'Revenue: the FY26 jump is mostly Blinkit\'s switch to owning inventory', unit: 'Revenue from operations (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: positive since FY24, but small', unit: 'Net profit / (loss), ₹ crore', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Quarterly EBITDA has risen five quarters in a row', unit: 'Reported EBITDA, quarterly (₹ crore)', x: 'Q.labels', series: [{ name: 'EBITDA', ref: 'Q.ebitda', fmt: 'num' }], labels: 'ends', source: SRC.co },
      { type: 'column', title: '…but quarterly profit fell in Q1FY27 as tax jumped', unit: 'Quarterly net profit (₹ crore)', x: 'Q.labels', series: [{ name: 'Net profit', ref: 'Q.pat', fmt: 'num' }], labels: 'ends', source: SRC.co },
    ] },
    { callout: '**Our view:** reported margins look tiny (EBITDA 2.2% of revenue in FY26) because Blinkit\'s revenue is now gross sale value. The better yardstick is profit as a share of order value: adjusted EBITDA was 1.2% of B2C net order value in FY26 and 1.8% in Q1FY27. Depreciation nearly doubled in FY26 (₹863 cr → ₹1,597 cr) as stores and warehouses were added, and tax will take a larger bite from FY27 because the parent company\'s past losses are used up. The path from EBITDA to earnings per share is therefore slower than the order growth suggests.' },
  ],
};

const cash = {
  id: 'cash', nav: 'Cash & balance sheet', kicker: 'Balance sheet', title: 'Cash: ₹18,288 cr, no debt, and the business now funds itself',
  blocks: [
    { p: 'Eternal holds ₹18,288 cr of cash and treasury investments (Jun-2026, company figure), built mostly from the IPO (Jul-2021) and an ₹8,500 cr share placement (QIP) in Nov-2024. It has no bank debt: the "borrowings" on the balance sheet (₹4,592 cr at Mar-26) are lease liabilities for stores, warehouses and offices. The cash pile has been broadly flat for a year (₹18,824 cr at Mar-25, ₹17,972 cr at Mar-26) because operating profit plus treasury income roughly paid for capex and the inventory that Blinkit now holds. Note that the company\'s own cash figure is higher than "cash + investments" below because ~₹1,600 cr of bank deposits sit inside other assets.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow positive since FY24', unit: 'Cash from operations (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'CFO', ref: 'fin.cfo', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Equity raised in FY21-FY22 (private rounds, IPO) and FY25 (QIP)', unit: 'Cash from financing (₹ crore)', x: 'A.labels', from: 'FY21', series: [{ name: 'CFF', ref: 'A.cff', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (lease liabilities only)', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Investments', '{{A.investments.9|num}}', '{{A.investments.10|num}}', '{{A.investments.11|num}}'],
      ['Cash & equivalents', '{{A.cash.9|num}}', '{{A.cash.10|num}}', '{{A.cash.11|num}}'],
      ['Fixed assets (incl. right-of-use)', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Cash from operations', '{{A.cfo.9|num}}', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}'],
    ], source: SRC.co } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: foreign investors out, Indian funds in',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs now own more than FIIs', unit: '% of shares', x: 'SH.periods', series: [{ name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Retail and other public holders steady at ~26-29%', unit: '% of shares in the Public bucket', x: 'SH.periods', series: [{ name: 'Public', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'all', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY20–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 40 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 500 } },
      { key: 'dep', name: 'Depreciation', flag: { type: 'pct', th: 40 }, inverse: true },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit / (loss)', hl: true },
      { key: 'cfo', name: 'Cash from operations' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 60 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit / (loss)', hl: true },
    ] } },
  ],
};

const statementNotes = {
  'sales@FY21': 'COVID year: revenue fell 23%; Uber Eats India (bought for shares in Jan-2020) folded in.',
  'sales@FY22': 'Recovery from COVID; IPO year (Jul-2021).',
  'sales@FY23': 'Blinkit consolidated from 10-Aug-2022 (acquired for ~₹4,447 cr in shares).',
  'sales@FY25': 'Blinkit order value (GOV) +127%; going-out enlarged by the Paytm ticketing purchase (Aug-2024).',
  'sales@FY26': 'Blinkit switched to owning inventory (1P) from Q2FY26: revenue now includes the full sale value. Like-for-like growth ~64%.',
  'dep@FY23': 'Blinkit consolidated from 10-Aug-2022 (stores and warehouses).',
  'dep@FY26': 'Store and warehouse build-out (2,243 Blinkit stores at Mar-26 vs 1,301 a year earlier) and leases.',
  'pat@FY24': 'First full-year profit: food delivery margins rose and treasury income covered Blinkit\'s losses.',
  'pat@FY26': 'Profit fell as Blinkit expansion, District losses and new bets (Bistro, Nugget) absorbed food profits.',
};

module.exports = { financials, cash, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'ETERNAL.research.js')) ? require('./ETERNAL.research') : null;
  const report = {
    symbol: 'ETERNAL', listing: 'NSE: ETERNAL · BSE: 543320', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Internet & Consumer Platforms',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, cash, ownershipBase, statements }) : [financials, cash, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
