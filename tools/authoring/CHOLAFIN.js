// Authoring source for the Cholamandalam Investment & Finance initiating-coverage report (as of 30-Sep-2026,
// Q1FY27 basis), on the `lender` engine (src/forecast-lender.js).
// Part A (this file): chapters built on reported financials (Screener consolidated + company history).
// Part B (CHOLAFIN.research.js + part2-6, shared CHOLAFIN.ctx.js) adds the research chapters.
// Usage: node tools/authoring/CHOLAFIN.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'CHOLAFIN', 'research');
const SRC = { co: 'Company presentations (Q4FY24-Q1FY27), annual reports, Screener.in (consolidated), GAM Research', est: 'Company, Screener.in; GAM Research estimates (FY27-29E)' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Ten years of ~25% profit growth with only one down year',
  blocks: [
    { p: 'Chola grew net profit from ₹575 cr in FY16 to ₹5,233 cr in FY26, about 25% a year, and book value per share from ₹47 to ₹357, about 22% a year. The only down year was FY20 (−12%), when Covid provisions pushed loan losses to 1.6% of assets; profit then grew 44% in FY21 and 42% in FY22. Since FY23 the pattern has been steady: profit +24%, +28%, +25% and +23% a year, as fast loan growth (21-38% a year) was partly eaten by rising credit costs in vehicle finance and the new unsecured loans. Return on equity has stayed in a narrow 19-21% band for five years.' },
    { pair: [
      { type: 'column', title: 'Net profit: ~25% a year for ten years', unit: 'Consolidated net profit (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'ends', source: SRC.est },
      { type: 'line', title: 'ROE: 19-21% in every normal year', unit: 'Return on average equity (%)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 10, max: 25, source: SRC.est },
    ] },
    { pair: [
      { type: 'column', title: 'NII has tripled in five years', unit: 'Net interest income (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'NII', ref: 'fin.nii', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'Cost-to-income rose with the new businesses and is now ~39%', unit: 'Operating expenses ÷ net total income (%)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Cost-to-income', ref: 'fin.costToIncome', fmt: 'pct' }], labels: 'all', min: 25, max: 48, source: SRC.est },
    ] },
    { callout: '**Our view:** Chola is a steady compounder, not a cyclical. Profit growth has been 23-28% for four years running, and we forecast {{F.patGrowth.0|pct}} in FY27E (Q1 was +46% off a weak base) and ~18-20% a year after that. What has not improved is the cost of running the business: cost-to-income went from 32% in FY21 to ~40% as Chola built six new businesses and, from FY26, a gold-loan branch network. Operating leverage is the missing lever; management does not expect it for "another year or so".' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet', kicker: 'Balance sheet', title: 'A ₹2.45 lakh crore balance sheet funded ~7:1 by debt',
  blocks: [
    { p: 'At Mar-2026 the group had ₹2.45 lakh cr of assets: ₹2.22 lakh cr of loans and other assets, ₹21,300 cr of cash, bank deposits and government securities (the liquidity buffer) and ₹1,900 cr of fixed assets. It was funded by ₹30,458 cr of shareholders\' equity, ₹2.11 lakh cr of borrowings and ₹3,920 cr of other liabilities. Borrowings were 6.9x equity and business AUM 7.4x equity, much higher than Bajaj Finance (~4x) because Chola\'s loans are secured (vehicles, property, gold) and carry lower risk weights. Unlike Bajaj Finance, Chola does not take public deposits.' },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Business AUM', '{{fin.aum.7|num}}', '{{fin.aum.9|num}}', '{{fin.aum.10|num}}', '{{fin.aum.11|num}}'],
      ['Shareholders\' equity (net worth)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. CCDs)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash, deposits and investments', '{{fin.liquidity.7|num}}', '{{fin.liquidity.9|num}}', '{{fin.liquidity.10|num}}', '{{fin.liquidity.11|num}}'],
      ['Total assets', '{{A.totalAssets.7|num}}', '{{A.totalAssets.9|num}}', '{{A.totalAssets.10|num}}', '{{A.totalAssets.11|num}}'],
      ['Borrowings ÷ equity (x)', '{{fin.debtEquity.7|n2}}', '{{fin.debtEquity.9|n2}}', '{{fin.debtEquity.10|n2}}', '{{fin.debtEquity.11|n2}}'],
      ['Equity ÷ AUM (%)', '{{fin.equityToAum.7|pct}}', '{{fin.equityToAum.9|pct}}', '{{fin.equityToAum.10|pct}}', '{{fin.equityToAum.11|pct}}'],
    ], source: SRC.co } },
    { pair: [
      { type: 'stacked', title: 'Equity has kept pace with borrowings since the FY24 raise', unit: '₹ \'000 crore at March', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Borrowings', ref: 'fin.borrowings', scale: 0.001, fmt: 'num' }, { name: 'Net worth', ref: 'fin.netWorth', scale: 0.001, fmt: 'num' }], minLabel: 20, source: SRC.est },
      { type: 'line', title: 'Cash flow is negative by design: loans grow faster than profit', unit: 'Cash from operations (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }], labels: 'last', source: 'Screener.in cash flow (consolidated)' },
    ] },
    { callout: '**Read this right:** a lender\'s operating cash flow is negative whenever its loan book grows, because new loans count as an operating outflow (−₹30,021 cr in FY26). What matters is whether equity keeps up with the book. With a dividend of only ₹2 a share, Chola retains ~97% of profit, so equity grows ~20% a year from profit alone; the gap to 21-38% AUM growth (FY23-FY26) was filled by the FY24 composite QIP (₹2,000 cr of shares plus ₹2,000 cr of convertible debentures, all converted by 30-Sep-2026). At our forecast growth, leverage stays near today\'s level without new equity.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Murugappa group controls 49%, domestic funds are buying',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions up, foreign funds down', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter group slipping below 50% as CCDs convert', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 46, max: 52, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials (lender format)',
  blocks: [
    { p: 'Screener\'s NBFC layout, rebuilt into a lender income statement. Revenue = interest income + fees and other operating income (insurance commission, loan fees, assignment gains); operating expenses include depreciation; provisions = impairment on loans. Other income is mostly recoveries of loans written off earlier. AUM is business AUM (loans), not the company\'s larger "total AUM", which adds cash and investments. Interest income and NII start in FY21, the first year whose revenue split we sourced.' },
    { statement: { title: 'Lender P&L and balance sheet, FY15–FY29E', rows: [
      { key: 'aum', name: 'Business AUM (year-end)', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'sales', name: 'Total income' },
      { key: 'interest', name: 'Interest expense' },
      { key: 'nii', name: 'Net interest income', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'feeIncome', name: 'Fees & other operating income' },
      { key: 'opex', name: 'Operating expenses (incl. depreciation)' },
      { key: 'ppop', name: 'Pre-provision operating profit' },
      { key: 'provisions', name: 'Loan losses & provisions', flag: { type: 'pct', th: 30 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
      { key: 'bvps', name: 'Book value per share (₹)', fmt: 'n1' },
      { key: 'netWorth', name: 'Net worth' },
      { key: 'borrowings', name: 'Borrowings' },
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
  const B = fs.existsSync(path.join(__dirname, 'CHOLAFIN.research.js')) ? require('./CHOLAFIN.research') : null;
  const report = {
    symbol: 'CHOLAFIN', listing: 'NSE: CHOLAFIN · BSE: 511243', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Financials (NBFCs)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, balance, ownershipBase, statements }) : [financials, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
