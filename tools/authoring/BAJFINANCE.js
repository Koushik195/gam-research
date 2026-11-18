// Authoring source for the Bajaj Finance initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// The library's first lender report, on the `lender` engine (src/forecast-lender.js).
// Part A (this file): chapters built on reported financials (Screener consolidated + company history).
// Part B (BAJFINANCE.research.js + part2-6, shared BAJFINANCE.ctx.js) adds the research chapters.
// Usage: node tools/authoring/BAJFINANCE.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'BAJFINANCE', 'research');
const SRC = { co: 'Company presentations (Q4FY23-Q1FY27), Screener.in (consolidated), GAM Research', est: 'Company, GAM Research estimates (FY27-29E)' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Ten years of 30%+ profit growth, slowing to the low 20s',
  blocks: [
    { p: 'Bajaj Finance grew net profit from ₹1,279 cr in FY16 to ₹19,332 cr in FY26, about 31% a year, and book value per share about 30% a year. Only Covid broke the run: profit fell 16% in FY21 as loan losses jumped to 4% of loans. The pace has slowed since FY24. Profit grew 26% in FY24, 16% in FY25 and 15% in FY26, held back first by rising losses in unsecured consumer and small-business loans and then, in FY26, by ₹1,813 cr of one-off charges (an accelerated ₹1,406 cr provision, a ₹265 cr Labour Code charge and a ₹142 cr overlay). Before them FY26 profit grew 24%.' },
    { pair: [
      { type: 'column', title: 'Net profit: 31% a year for ten years', unit: 'Consolidated net profit (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'ends', source: SRC.est },
      { type: 'line', title: 'ROE: 20-23% except in the Covid years', unit: 'Return on average equity (%), attributable', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 10, max: 26, source: SRC.est },
    ] },
    { pair: [
      { type: 'column', title: 'NII grew 2.5x in four years', unit: 'Net interest income (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'NII', ref: 'fin.nii', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'Cost-to-income has drifted down from 35% to 33%', unit: 'Operating expenses ÷ net total income (%)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Cost-to-income', ref: 'fin.costToIncome', fmt: 'pct' }], labels: 'all', min: 28, max: 38, source: SRC.est },
    ] },
    { callout: '**Our view:** the machine still compounds, but at a lower gear. AUM growth has come down from 30%+ (FY19, FY24) to 22-26%, margins are slipping as the mix moves to cheaper secured loans, and the next leg of profit growth in FY27 comes largely from lower credit costs after two expensive years. We forecast EPS growth of {{F.epsGrowth.0|pct}} in FY27E (about 25% on FY26 profit before one-offs) and ~18% a year after that.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet', kicker: 'Balance sheet', title: 'A ₹5.6 lakh crore balance sheet funded 4:1 by debt, with a deposit franchise',
  blocks: [
    { p: 'At Mar-2026 the group had ₹5.60 lakh cr of assets: ₹5.25 lakh cr of loans and other assets, ₹46,300 cr of cash and investments (the liquidity buffer) and ₹4,066 cr of fixed assets. It was funded by ₹1.14 lakh cr of shareholders\' equity, ₹4.35 lakh cr of borrowings (including ₹68,533 cr of public and corporate deposits) and ₹10,841 cr of other liabilities, of which ₹2,987 cr is the minority shareholders\' stake in Bajaj Housing Finance. Borrowings were 3.8x equity; AUM was 4.5x equity. Bajaj Finance is one of very few NBFCs allowed to take deposits, and deposits are now 15% of group borrowings.' },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['AUM (incl. off-book)', '{{fin.aum.7|num}}', '{{fin.aum.9|num}}', '{{fin.aum.10|num}}', '{{fin.aum.11|num}}'],
      ['Shareholders\' equity (net worth)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. deposits', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{fin.liquidity.7|num}}', '{{fin.liquidity.9|num}}', '{{fin.liquidity.10|num}}', '{{fin.liquidity.11|num}}'],
      ['Total assets', '{{A.totalAssets.7|num}}', '{{A.totalAssets.9|num}}', '{{A.totalAssets.10|num}}', '{{A.totalAssets.11|num}}'],
      ['Borrowings ÷ equity (x)', '{{fin.debtEquity.7|n2}}', '{{fin.debtEquity.9|n2}}', '{{fin.debtEquity.10|n2}}', '{{fin.debtEquity.11|n2}}'],
      ['Equity ÷ AUM (%)', '{{fin.equityToAum.7|pct}}', '{{fin.equityToAum.9|pct}}', '{{fin.equityToAum.10|pct}}', '{{fin.equityToAum.11|pct}}'],
    ], source: SRC.co } },
    { pair: [
      { type: 'stacked', title: 'Equity has kept pace with borrowings', unit: '₹ \'000 crore at March', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Borrowings', ref: 'fin.borrowings', scale: 0.001, fmt: 'num' }, { name: 'Net worth', ref: 'fin.netWorth', scale: 0.001, fmt: 'num' }], minLabel: 40, source: SRC.est },
      { type: 'line', title: 'Cash flow is negative by design: loans grow faster than profit', unit: 'Cash from operations (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }], labels: 'last', source: 'Screener.in cash flow (consolidated)' },
    ] },
    { callout: '**Read this right:** a lender\'s operating cash flow is negative whenever its loan book grows, because new loans are an operating outflow. What matters is whether equity grows fast enough to support the book. Retained profit added 16-23% a year to equity in FY24-26 against AUM growth of 22-34%. The gap has been filled by equity raises every two to four years (₹4,538 cr in FY18, ₹8,568 cr in FY20, ₹9,067 cr in FY24, per the cash-flow statement) and by gains on selling Bajaj Housing Finance shares. A fifth raise was put to the board in late September 2026 (see the capital chapter).' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Bajaj Finserv controls 51%, domestic funds are buying',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions up, foreign funds down', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter group steady near 54.7%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 58, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials (lender format)',
  blocks: [
    { p: 'Screener\'s NBFC layout, rebuilt into a lender income statement. Revenue = interest income + fees and other operating income; operating expenses include depreciation; provisions = loan losses and provisions. FY18-FY24 provisions are on the old basis (recoveries of written-off loans in income) and FY25-FY26 on the new basis (netted in provisions), as in the accounts Screener uses; profit is the same either way. Interest income and NII start in FY22 because the income split before that is not in our sources.' },
    { statement: { title: 'Lender P&L and balance sheet, FY15–FY29E', rows: [
      { key: 'aum', name: 'AUM (year-end)', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'sales', name: 'Total income' },
      { key: 'interest', name: 'Interest expense' },
      { key: 'nii', name: 'Net interest income', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'feeIncome', name: 'Fees & other operating income' },
      { key: 'opex', name: 'Operating expenses (incl. depreciation)' },
      { key: 'ppop', name: 'Pre-provision operating profit' },
      { key: 'provisions', name: 'Loan losses & provisions', flag: { type: 'pct', th: 30 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (before minorities)', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹, split- and bonus-adjusted)', fmt: 'n2' },
      { key: 'bvps', name: 'Book value per share (₹)', fmt: 'n1' },
      { key: 'netWorth', name: 'Net worth' },
      { key: 'borrowings', name: 'Borrowings incl. deposits' },
      { key: 'nim', name: 'NIM (NII ÷ average AUM) %', fmt: 'pct', flag: { type: 'bps', th: 40 } },
      { key: 'creditCost', name: 'Credit cost (provisions ÷ average AUM) %', fmt: 'pct', flag: { type: 'bps', th: 50 }, inverse: true },
      { key: 'roe', name: 'ROE %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (Screener NBFC layout)', rows: [
      { key: 'sales', name: 'Total income', yoy: true, flag: { type: 'pct', th: 30 }, hl: true },
      { key: 'interest', name: 'Interest expense' },
      { key: 'expenses', name: 'Opex excl. depreciation + provisions', yoy: true, flag: { type: 'pct', th: 30 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, yoy: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
    ] } },
  ],
};

module.exports = { financials, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'BAJFINANCE.research.js')) ? require('./BAJFINANCE.research') : null;
  const report = {
    symbol: 'BAJFINANCE', listing: 'NSE: BAJFINANCE · BSE: 500034', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Financials (NBFCs)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, balance, ownershipBase, statements }) : [financials, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
