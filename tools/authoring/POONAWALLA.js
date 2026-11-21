// Authoring source for the Poonawalla Fincorp initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Lender engine (src/forecast-lender.js). FY24 Screener row patched to the audited basis (POONAWALLA.patch.js).
// Part A (this file): chapters built on reported financials (Screener consolidated + company history).
// Part B (POONAWALLA.research.js + part2-6, shared POONAWALLA.ctx.js) adds the research chapters.
// Usage: node tools/authoring/POONAWALLA.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'POONAWALLA', 'research');
const SRC = { co: 'Company presentations (Q4FY24-Q1FY27), Annual Reports FY25-FY26, Screener.in (consolidated), GAM Research', est: 'Company, Screener.in; GAM Research estimates (FY27-29E)' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Five years, three different companies: Magma, a flattered FY24, a FY25 loss, and now a rebuild',
  blocks: [
    { p: 'Read Poonawalla\'s history in three acts. **FY21-FY23**: Magma Fincorp is recapitalised by the Poonawalla group (₹3,456 cr in 2021) and cleans up; profit is small. **FY24**: reported profit of ₹1,683 cr and an ROE of 22% look superb, but they are flattered twice: by a ₹2,309 cr gain on selling the housing arm (partly used to provide ₹1,473 cr against the old Magma book) and by provision write-backs that put credit cost near zero (₹72 cr on a ₹25,000 cr book). Before exceptional items FY24 profit was ₹1,045 cr and ROE ~14%. **FY25**: the short-ticket personal-loan book blows up, a ₹666 cr accelerated provision follows, and the year ends in a ₹98 cr loss. **FY26**: a new team grows AUM 69% and profit recovers to ₹542 cr, an ROE of only ~6%.' },
    { pair: [
      { type: 'column', title: 'Net profit: the FY24 peak was not a normal year', unit: 'Consolidated net profit (₹ crore); FY24 includes a ₹816 cr net exceptional gain', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'ROE: back to low teens only by FY28-29E', unit: 'Return on average equity (%); FY24 incl. one-offs (~14% before them)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: -5, max: 25, source: SRC.est },
    ] },
    { pair: [
      { type: 'column', title: 'Net interest income has grown faster than profit', unit: 'Net interest income excl. fees (₹ crore)', x: 'fin.labels', from: 'FY24', to: 'FY29E', series: [{ name: 'NII', ref: 'fin.nii', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'Cost-to-income: 52% in FY26, still high for a lender', unit: 'Operating expenses ÷ net total income (%)', x: 'fin.labels', from: 'FY24', to: 'FY29E', series: [{ name: 'Cost-to-income', ref: 'fin.costToIncome', fmt: 'pct' }], labels: 'all', min: 30, max: 60, source: SRC.est },
    ] },
    { callout: '**Our view:** the profit line is now heading the right way, quarter after quarter (₹63 cr in Q1FY26 to ₹308 cr in Q1FY27). But the starting point is low: FY26 ROE was ~6%, and even our FY29E ROE of {{F.roe.2|pct}} is below the ~14% return a shareholder should demand from a fast-growing, mostly retail lender. We forecast EPS of ₹{{F.eps.0|n2}} / ₹{{F.eps.1|n2}} / ₹{{F.eps.2|n2}} for FY27-29E on growing share counts.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet', kicker: 'Balance sheet', title: 'A ₹60,000 cr balance sheet that has doubled in two years and needs fresh equity to keep growing',
  blocks: [
    { p: 'At Mar-2026 Poonawalla had ₹60,272 cr of assets: ₹57,061 cr of loans and other assets, ₹2,784 cr of cash and investments and ₹427 cr of fixed assets. It was funded by ₹10,348 cr of equity, ₹48,436 cr of borrowings (incl. lease liabilities) and ₹1,488 cr of other liabilities. Borrowings were 4.7x equity, up from 1.9x two years earlier: the book grew much faster than retained profit. The ₹2,500 cr QIP in April 2026 brought debt-to-equity back to 3.82x (Jun-2026).' },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['AUM', '{{fin.aum.8|num}}', '{{fin.aum.9|num}}', '{{fin.aum.10|num}}', '{{fin.aum.11|num}}'],
      ['Shareholders\' equity (net worth)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. lease liabilities)', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Total assets', '{{A.totalAssets.8|num}}', '{{A.totalAssets.9|num}}', '{{A.totalAssets.10|num}}', '{{A.totalAssets.11|num}}'],
      ['Borrowings ÷ equity (x)', '{{fin.debtEquity.8|n2}}', '{{fin.debtEquity.9|n2}}', '{{fin.debtEquity.10|n2}}', '{{fin.debtEquity.11|n2}}'],
      ['Equity ÷ AUM (%)', '{{fin.equityToAum.8|pct}}', '{{fin.equityToAum.9|pct}}', '{{fin.equityToAum.10|pct}}', '{{fin.equityToAum.11|pct}}'],
    ], source: `${SRC.co}. Mar-23 balance sheet still consolidates the housing arm held for sale (AUM is standalone), so its ratios are indicative only.` } },
    { pair: [
      { type: 'stacked', title: 'Borrowings have outrun equity', unit: '₹ \'000 crore at March', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'Borrowings', ref: 'fin.borrowings', scale: 0.001, fmt: 'n1' }, { name: 'Net worth', ref: 'fin.netWorth', scale: 0.001, fmt: 'n1' }], minLabel: 4, source: `${SRC.est} (incl. the Apr-2026 QIP and an assumed ₹3,000 cr raise in FY28E)` },
      { type: 'line', title: 'Cash flow is negative by design: loans grow faster than profit', unit: 'Cash from operations (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }], labels: 'last', source: 'Screener.in cash flow (consolidated)' },
    ] },
    { callout: '**Read this right:** a lender\'s operating cash flow is negative whenever its loan book grows, because new loans are an operating outflow (₹21,786 cr in FY26). What matters is whether equity keeps up. It has not: equity was 17% of AUM at Mar-2026 against 33% at Mar-2024, and the gap was closed only by new money from the promoter (₹1,500 cr, Sep-2025) and institutions (₹2,500 cr, Apr-2026). At 30-40% growth and a ~12% ROE, that will keep happening.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Poonawalla family controls 59%; the QIP brought in domestic funds',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions doubled their stake in a year', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter stake: up on the preferential issue, down on the QIP', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 66, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials (lender format)',
  blocks: [
    { p: 'Screener\'s NBFC layout, rebuilt into a lender income statement. Revenue = interest income + fees and other operating income; operating expenses include depreciation; provisions = impairment plus losses on selling bad loans (the company\'s "credit cost"). FY24 is on the audited continuing-operations basis (Screener\'s row grosses the housing-sale gain into revenue; see the patch note); its net profit includes the ₹816 cr net exceptional gain. Lender lines start in FY24: before that the accounts consolidate the housing arm, which was sold.' },
    { statement: { title: 'Lender P&L and balance sheet, FY15–FY29E', rows: [
      { key: 'aum', name: 'AUM (year-end)', flag: { type: 'pct', th: 40 }, hl: true },
      { key: 'sales', name: 'Total income' },
      { key: 'interest', name: 'Interest expense' },
      { key: 'nii', name: 'Net interest income', flag: { type: 'pct', th: 40 }, hl: true },
      { key: 'feeIncome', name: 'Fees & other operating income' },
      { key: 'opex', name: 'Operating expenses (incl. depreciation)' },
      { key: 'ppop', name: 'Pre-provision operating profit' },
      { key: 'provisions', name: 'Credit cost (impairment + loss on NPA sales)', flag: { type: 'pct', th: 50 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 40 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
      { key: 'bvps', name: 'Book value per share (₹)', fmt: 'n1' },
      { key: 'netWorth', name: 'Net worth' },
      { key: 'borrowings', name: 'Borrowings' },
      { key: 'nim', name: 'NIM (NII ÷ average AUM) %', fmt: 'pct', flag: { type: 'bps', th: 50 } },
      { key: 'creditCost', name: 'Credit cost (÷ average AUM) %', fmt: 'pct', flag: { type: 'bps', th: 75 }, inverse: true },
      { key: 'roe', name: 'ROE %', fmt: 'pct', flag: { type: 'bps', th: 400 } },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (Screener NBFC layout)', rows: [
      { key: 'sales', name: 'Total income', yoy: true, flag: { type: 'pct', th: 40 }, hl: true },
      { key: 'interest', name: 'Interest expense' },
      { key: 'expenses', name: 'Opex excl. depreciation + provisions', yoy: true, flag: { type: 'pct', th: 40 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, yoy: true, flag: { type: 'pct', th: 40 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
    ] } },
  ],
};

module.exports = { financials, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'POONAWALLA.research.js')) ? require('./POONAWALLA.research') : null;
  const report = {
    symbol: 'POONAWALLA', listing: 'NSE: POONAWALLA · BSE: 524000', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Financials (NBFCs)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, balance, ownershipBase, statements }) : [financials, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
