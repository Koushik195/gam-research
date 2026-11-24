// Authoring source for the Nykaa (FSN E-Commerce Ventures) initiating-coverage report.
// Part A (this file): chapters built on reported financials. Part B (NYKAA.research.js, merging
// NYKAA.part2.js … part6.js) adds the business, segment, street and valuation chapters.
// Usage: node tools/authoring/NYKAA.js   (then node src/model.js NYKAA)
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'NYKAA', 'research');
const SRC = { co: 'Company filings, Screener.in (consolidated; profit attributable to owners), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 4x in five years; profit finally scaling',
  blocks: [
    { p: 'Nykaa\'s revenue rose from ₹2,441 cr in FY21 to ₹10,022 cr in FY26 (33% a year), and growth has sped up again: +26% in FY26 and +29% in Q1FY27, the fastest in 13 quarters. Unlike most Indian internet companies, Nykaa has made a profit every year since FY21, but it was tiny until recently: profit attributable to shareholders was ₹19 cr in FY23 and ₹32 cr in FY24, as stores, warehouses, Fashion and the eB2B arm (Superstore) absorbed the profit from beauty. FY26 was the break-out year: EBITDA +59% to ₹752 cr and profit to ₹199 cr. Q1FY27 added EBITDA +68% and profit ₹80 cr.' },
    { pair: [
      { type: 'column', title: 'Revenue: 33% a year since FY21', unit: 'Revenue from operations (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Profit: small for years, then tripled in FY26', unit: 'Net profit attributable to owners (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Quarterly EBITDA has nearly tripled in two years', unit: 'Reported EBITDA, quarterly (₹ crore)', x: 'Q.labels', series: [{ name: 'EBITDA', ref: 'Q.ebitda', fmt: 'num' }], labels: 'ends', source: SRC.co },
      { type: 'line', title: 'EBITDA margin: from ~5% to 8.5% of revenue', unit: 'EBITDA margin, quarterly (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct' }], labels: 'ends', source: SRC.co },
    ] },
    { callout: '**Our view:** the margin gains are real and come from three places: a higher gross margin (45.9% of revenue in Q1FY27 vs 44.6% a year earlier, from owned brands, premium brands and advertising income from brands), lower marketing as a share of sales in Fashion, and overheads growing slower than revenue. But reported net profit is still only 2.9% of revenue, because depreciation (3.2% of revenue, including leased stores), interest (~1%) and a high tax rate (38%) sit between EBITDA and earnings. That is why the P/E looks so high.' },
  ],
};

const cash = {
  id: 'cash', nav: 'Cash & balance sheet', kicker: 'Balance sheet', title: 'Balance sheet: small net debt, funded by suppliers and short-term loans',
  blocks: [
    { p: 'Nykaa holds ₹320 cr of cash and bank balances (Mar-26) against ₹747 cr of bank borrowings (almost all short-term working-capital loans) and ₹491 cr of lease liabilities on stores and warehouses: net debt of ₹918 cr including leases, or ₹427 cr without them. The business needs inventory (₹1,642 cr at Mar-26: it buys much of what it sells in Beauty), partly funded by suppliers (trade payables ₹732 cr). Cash from operations turned solidly positive in FY25 (₹467 cr) and FY26 (₹644 cr), and capex is light (₹154 cr in FY26), so free cash flow now covers the business; the company repaid debt in FY25-FY26 (cash from financing negative).' },
    { pair: [
      { type: 'column', title: 'Operating cash flow positive and rising since FY25', unit: 'Cash from operations (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'CFO', ref: 'fin.cfo', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'IPO money came in FY22; since FY25 cash goes out to lenders', unit: 'Cash from financing (₹ crore)', x: 'A.labels', from: 'FY21', series: [{ name: 'CFF', ref: 'A.cff', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}', '{{A.netWorth.8|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.6|num}}', '{{A.borrowings.7|num}}', '{{A.borrowings.8|num}}'],
      ['Cash & bank', '{{A.cash.6|num}}', '{{A.cash.7|num}}', '{{A.cash.8|num}}'],
      ['Inventories', '{{A.inventories.6|num}}', '{{A.inventories.7|num}}', '{{A.inventories.8|num}}'],
      ['Fixed assets (incl. right-of-use)', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.8|num}}'],
      ['Cash from operations', '{{A.cfo.6|num}}', '{{A.cfo.7|num}}', '{{A.cfo.8|num}}'],
    ], source: SRC.co } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Nayar family controls 52%; Indian funds are the next-largest owners',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs own nearly twice what FIIs own', unit: '% of shares', x: 'SH.periods', series: [{ name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter stake steady at ~52%', unit: '% of shares held by promoters', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY20–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 40 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation', flag: { type: 'pct', th: 40 }, inverse: true },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true },
      { key: 'cfo', name: 'Cash from operations' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 35 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (owners)', hl: true },
    ] } },
  ],
};

const statementNotes = {
  'sales@FY21': 'COVID year (stores shut for part of it): revenue +38% and the first full-year profit (₹62 cr).',
  'sales@FY22': 'IPO year (Nov-2021); revenue +55%.',
  'pat@FY23': 'Profit fell to ₹19 cr: losses in Fashion and the new eB2B arm (Superstore) and higher depreciation from stores and warehouses.',
  'dep@FY23': 'Warehouse and store build-out (depreciation +80%).',
  'cfo@FY22': 'Inventory build (₹372 cr) as Nykaa bought more stock for owned and exclusive brands.',
  'pat@FY26': 'Profit tripled: Beauty margin 9.6% of NSV (8.9%), Fashion losses cut to ₹37 cr (₹93 cr); ₹17 cr exceptional charge.',
  'ebitdaMargin@FY26': 'Gross margin +132bp (owned brands, premium mix, ad income) and overhead leverage.',
};

module.exports = { financials, cash, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'NYKAA.research.js')) ? require('./NYKAA.research') : null;
  const report = {
    symbol: 'NYKAA', listing: 'NSE: NYKAA · BSE: 543384', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Internet & Consumer Platforms',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, cash, ownershipBase, statements }) : [financials, cash, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
