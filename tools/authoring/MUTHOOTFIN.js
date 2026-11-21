// Authoring source for the Muthoot Finance initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Lender engine (src/forecast-lender.js), consolidated: the standalone gold-loan NBFC plus Muthoot Money,
// Belstar Microfinance, Muthoot Homefin, Asia Asset Finance and insurance broking.
// Part A (this file): chapters built on reported financials (Screener consolidated + company history).
// Part B (MUTHOOTFIN.research.js + part2-6, shared MUTHOOTFIN.ctx.js) adds the research chapters.
// Usage: node tools/authoring/MUTHOOTFIN.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'MUTHOOTFIN', 'research');
const SRC = { co: 'Company presentations (Q4FY20-Q1FY27), Screener.in (consolidated), GAM Research', est: 'Company, Screener.in; GAM Research estimates (FY27-29E)' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Profit doubled in FY26 on the gold price; FY27 resets to a slower, cleaner base',
  blocks: [
    { p: 'Muthoot Finance grew consolidated net profit from ₹672 cr in FY15 to ₹10,607 cr in FY26, about 28% a year, but the path was anything but smooth. Profit rose 51% in FY20 and 21% in FY21 as gold surged in the Covid years, slipped 10% in FY23 when gold went sideways and lenders cut rates, grew 20-23% in FY24-25, and then doubled (+98%) in FY26 as the gold price rose ~65% and the company collected one-off income on old loans. Q1FY27 showed the reset: profit was +43% year on year but 17% below Q4FY26 as the yield on loans fell from 20.8% to 17.9%.' },
    { pair: [
      { type: 'column', title: 'Net profit: flat in FY21-23, then doubled in FY26', unit: 'Consolidated net profit (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'ROE: 31% in FY26, back to the low-to-mid 20s', unit: 'Return on average equity (%), attributable', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 10, max: 34, source: SRC.est },
    ] },
    { pair: [
      { type: 'column', title: 'NII grew 2.5x in four years', unit: 'Net interest income (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'NII', ref: 'fin.nii', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'Cost-to-income fell to ~25% as loan size outran branch costs', unit: 'Operating expenses ÷ net total income (%)', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'Cost-to-income', ref: 'fin.costToIncome', fmt: 'pct' }], labels: 'all', min: 15, max: 40, source: SRC.est },
    ] },
    { callout: '**Our view:** Muthoot\'s profit is a gold-price derivative with a very efficient machine attached. When gold rises, the same customers borrow more against the same jewellery and the machine (5,000+ branches, ~₹32 cr of gold loans per branch) turns that into profit at a 25-30% ROE. When gold stalls, growth slows and competition squeezes yields. FY26 was the best case of both. We forecast EPS growth of {{F.epsGrowth.0|pct}} in FY27E and ~11-13% a year after that, with ROE easing from {{F.roe.0|pct}} to {{F.roe.2|pct}} as yields fall.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet', kicker: 'Balance sheet', title: 'A ₹1.96 lakh crore balance sheet funded ~4:1 by debt, with jewellery as collateral',
  blocks: [
    { p: 'At Mar-2026 the group had ₹1.96 lakh cr of assets: ₹1.79 lakh cr of loans (95% of the standalone book is secured by gold jewellery), ₹12,600 cr of cash and ₹550 cr of investments. It was funded by ₹39,130 cr of shareholders\' equity, ₹1.52 lakh cr of borrowings (bank loans, listed debentures, dollar bonds and commercial paper) and ₹4,784 cr of other liabilities, of which ₹644 cr is the minority shareholders\' stake in Belstar and Asia Asset Finance. Borrowings were 3.9x equity; AUM was 4.6x equity, up from 3.5x in FY24 as the book grew faster than retained profit.' },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['AUM (consolidated loan principal)', '{{fin.aum.7|num}}', '{{fin.aum.9|num}}', '{{fin.aum.10|num}}', '{{fin.aum.11|num}}'],
      ['Shareholders\' equity (net worth)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Total assets', '{{A.totalAssets.7|num}}', '{{A.totalAssets.9|num}}', '{{A.totalAssets.10|num}}', '{{A.totalAssets.11|num}}'],
      ['Borrowings ÷ equity (x)', '{{fin.debtEquity.7|n2}}', '{{fin.debtEquity.9|n2}}', '{{fin.debtEquity.10|n2}}', '{{fin.debtEquity.11|n2}}'],
      ['Equity ÷ AUM (%)', '{{fin.equityToAum.7|pct}}', '{{fin.equityToAum.9|pct}}', '{{fin.equityToAum.10|pct}}', '{{fin.equityToAum.11|pct}}'],
    ], source: SRC.co } },
    { pair: [
      { type: 'stacked', title: 'Borrowings grew faster than equity in FY25-26', unit: '₹ \'000 crore at March', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Borrowings', ref: 'fin.borrowings', scale: 0.001, fmt: 'num' }, { name: 'Net worth', ref: 'fin.netWorth', scale: 0.001, fmt: 'num' }], minLabel: 15, source: SRC.est },
      { type: 'line', title: 'Operating cash flow is negative whenever the book grows', unit: 'Cash from operations (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }], labels: 'last', source: 'Screener.in cash flow (consolidated)' },
    ] },
    { callout: '**Read this right:** for a lender, new loans are an operating outflow, so cash from operations was −₹47,393 cr in FY26, the year the book grew ₹59,700 cr. What matters is whether equity keeps pace. Muthoot has not issued meaningful equity since a ₹418 cr placement in 2015; retained profit alone has funded growth, which is why standalone capital adequacy has fallen from 31.8% (Mar-23) to 20.3% (Jun-26). At our 12% payout and ~24% ROE, book grows faster than our 13-18% AUM growth, so leverage falls back in our forecast.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Muthoot family owns 73%, domestic funds are buying',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds sold in Q1FY27, domestic funds bought', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter group flat at 73.35%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 70, max: 76, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials (lender format)',
  blocks: [
    { p: 'Screener\'s NBFC layout, rebuilt into a lender income statement. Revenue = interest income + fees and other operating income; operating expenses include depreciation; provisions = impairment of financial instruments (latest restated figures). AUM is the consolidated loan principal reported by the company. Interest income, NII and the ratios start in FY19 because our sources for the income split begin there.' },
    { statement: { title: 'Lender P&L and balance sheet, FY15–FY29E', rows: [
      { key: 'aum', name: 'AUM (year-end)', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'sales', name: 'Total income' },
      { key: 'interest', name: 'Interest expense' },
      { key: 'nii', name: 'Net interest income', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'feeIncome', name: 'Fees & other operating income' },
      { key: 'opex', name: 'Operating expenses (incl. depreciation)' },
      { key: 'ppop', name: 'Pre-provision operating profit' },
      { key: 'provisions', name: 'Impairment (loan losses & provisions)', flag: { type: 'pct', th: 50 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (before minorities)', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
      { key: 'bvps', name: 'Book value per share (₹)', fmt: 'n1' },
      { key: 'netWorth', name: 'Net worth' },
      { key: 'borrowings', name: 'Borrowings' },
      { key: 'nim', name: 'NIM (NII ÷ average AUM) %', fmt: 'pct', flag: { type: 'bps', th: 100 } },
      { key: 'creditCost', name: 'Credit cost (impairment ÷ average AUM) %', fmt: 'pct', flag: { type: 'bps', th: 40 }, inverse: true },
      { key: 'roe', name: 'ROE %', fmt: 'pct', flag: { type: 'bps', th: 400 } },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (Screener NBFC layout)', rows: [
      { key: 'sales', name: 'Total income', yoy: true, flag: { type: 'pct', th: 40 }, hl: true },
      { key: 'interest', name: 'Interest expense' },
      { key: 'expenses', name: 'Opex excl. depreciation + impairment', yoy: true, flag: { type: 'pct', th: 30 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, yoy: true, flag: { type: 'pct', th: 40 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
    ] } },
  ],
};

module.exports = { financials, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'MUTHOOTFIN.research.js')) ? require('./MUTHOOTFIN.research') : null;
  const report = {
    symbol: 'MUTHOOTFIN', listing: 'NSE: MUTHOOTFIN · BSE: 533398', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Financials (NBFCs)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, balance, ownershipBase, statements }) : [financials, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
