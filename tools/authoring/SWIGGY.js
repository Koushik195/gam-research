// Authoring source for the Swiggy initiating-coverage report (lean edition).
// Part A (this file): chapters built on reported financials. Part B (SWIGGY.research.js) adds the
// platform-economics, competition, street and valuation chapters from research/swiggy.json.
// Usage: node tools/authoring/SWIGGY.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'SWIGGY', 'research');
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue is compounding; losses are not shrinking fast enough',
  blocks: [
    { p: 'Swiggy\'s revenue grew from ₹2,547 cr in FY21 to ₹23,053 cr in FY26, about 55% a year, and was up 37% year-on-year in Q1FY27 to ₹6,812 cr. But the company has never made an operating profit. The operating loss (EBITDA) was ₹3,235 cr in FY26 and the net loss ₹4,154 cr, larger than in FY24 or FY25, because the quick-commerce build-out (Instamart dark stores) is absorbing everything food delivery earns.' },
    { pair: [
      { type: 'column', title: 'Revenue: up 9x in five years', unit: 'Revenue from operations (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net loss: bigger in FY26 than in FY24', unit: 'Net profit / (loss), ₹ crore', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'Net loss', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'The quarterly operating-loss margin is narrowing', unit: 'EBITDA margin (%), quarterly', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', source: SRC.co },
      { type: 'column', title: '…but absolute quarterly losses are still ~₹800 cr', unit: 'Quarterly net loss (₹ crore)', x: 'Q.labels', series: [{ name: 'Net loss', ref: 'Q.pat', fmt: 'num' }], labels: 'ends', source: SRC.co },
    ] },
    { callout: '**Our view:** the margin trend is genuinely improving (EBITDA margin from −23% to −10% in three years), but because revenue is growing fast, the absolute loss has not fallen. Depreciation has doubled (₹612 cr in FY25 → ₹1,217 cr in FY26) as dark stores are added, so the path from EBITDA breakeven to net profit is longer still.' },
  ],
};

const cash = {
  id: 'cash', nav: 'Cash burn & balance sheet', kicker: 'Balance sheet', title: 'Cash burn: funded for now, but every quarter costs ~₹700 cr',
  blocks: [
    { p: 'Swiggy has burned operating cash every year: ₹2,898 cr in FY26 and ₹2,169 cr in FY25. Free cash flow (after capex) was −₹3,809 cr in FY26. The gap has been funded by equity: the November-2024 IPO (₹4,499 cr fresh) and the December-2025 QIP (₹10,000 cr at ₹375), plus the ₹2,399 cr sale of the Rapido stake. "Borrowings" of ~₹2,550 cr are almost entirely lease liabilities for dark stores and offices; there is no bank debt to speak of. Note that ~₹5,000 cr of bank deposits sit inside "other assets" on the balance sheet, so the company\'s own cash figure (₹15,053 cr at Mar-26) is higher than cash plus investments shown below.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow has been negative every year', unit: 'Cash from operations (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'CFO', ref: 'fin.cfo', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Equity raised to fund the build-out', unit: 'Cash from financing (₹ crore)', x: 'A.labels', from: 'FY21', series: [{ name: 'CFF', ref: 'A.cff', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.4|num}}', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}'],
      ['Borrowings (mostly leases)', '{{A.borrowings.4|num}}', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}'],
      ['Investments', '{{A.investments.4|num}}', '{{A.investments.5|num}}', '{{A.investments.6|num}}'],
      ['Fixed assets', '{{A.fixedAssets.4|num}}', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.6|num}}'],
      ['Cash from operations', '{{A.cfo.4|num}}', '{{A.cfo.5|num}}', '{{A.cfo.6|num}}'],
    ], source: SRC.co } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: foreign investors exiting, domestic funds absorbing',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs have tripled their stake in a year; FIIs are held back by the foreign cap', unit: '% of shares', x: 'SH.periods', series: [{ name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Public float (incl. Prosus and VCs) shrinking as institutions buy', unit: '% of shares in the Public bucket', x: 'SH.periods', series: [{ name: 'Public', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'all', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY20–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 30 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 500 } },
      { key: 'dep', name: 'Depreciation', flag: { type: 'pct', th: 40 }, inverse: true },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit / (loss)', hl: true },
      { key: 'cfo', name: 'Cash from operations' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 40 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit / (loss)', hl: true },
    ] } },
  ],
};

const statementNotes = {
  'sales@FY22': 'Post-COVID recovery in food delivery; Instamart launched (Aug-2020) and scaled.',
  'sales@FY23': 'Food delivery growth and Instamart expansion.',
  'sales@FY25': 'Instamart scale-up and IPO-year growth.',
  'sales@FY26': 'Quick-commerce expansion (more dark stores, larger stores) plus food delivery growth.',
  'dep@FY25': 'Dark-store build-out.',
  'dep@FY26': 'Depreciation doubled as dark stores (leases and fit-outs) were added.',
  'ebitdaMargin@FY24': 'Food delivery turned profitable at the adjusted EBITDA level; Instamart losses narrowed before the 2024-25 quick-commerce war.',
};

module.exports = { financials, cash, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'SWIGGY.research.js')) ? require('./SWIGGY.research') : null;
  const report = {
    symbol: 'SWIGGY', listing: 'NSE: SWIGGY · BSE: 544285', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Internet & Consumer Platforms',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, cash, ownershipBase, statements }) : [financials, cash, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
