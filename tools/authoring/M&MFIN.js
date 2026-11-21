// Authoring source for the Mahindra & Mahindra Financial Services (M&M Finance) initiating-coverage report
// (as of 30-Sep-2026, Q1FY27 basis), on the `lender` engine (src/forecast-lender.js).
// Part A (this file): chapters built on reported financials (Screener consolidated + company history).
// Part B (M&MFIN.research.js + part2-6, shared M&MFIN.ctx.js) adds the research chapters.
// Usage: node "tools/authoring/M&MFIN.js"
const fs = require('fs');
const path = require('path');
const SYM = 'M&MFIN';
const RD = path.join(__dirname, '..', '..', 'data', 'raw', SYM, 'research');
const SRC = { co: 'Company presentations (Q4FY20-Q1FY27), annual reports, Screener.in (consolidated), GAM Research', est: 'Company, Screener.in; GAM Research estimates (FY27-29E)' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Ten years, three collapses: profit has never compounded for long',
  blocks: [
    { p: 'M&M Finance\'s consolidated profit was ₹925 cr in FY15 and ₹2,861 cr in FY26: about 11% a year, but the path was anything but smooth. Profit fell 15% in FY16 and 33% in FY17 (two droughts in a row hit rural borrowers), recovered to a record ₹1,867 cr in FY19, then fell 42% in FY20 and 28% more in FY21 (the IL&FS funding squeeze, then Covid), and only passed the FY19 peak in FY23. Since then it has grown in fits: −6% in FY24 (vehicle-finance losses and the Aizawl fraud), +16% in FY25 (helped by a provision release) and +27% in FY26. Return on equity has been between 6% and 12% in every year since FY20, below the 13-14% cost of equity in all of them.' },
    { pair: [
      { type: 'column', title: 'Net profit: big swings, a new high only in FY23', unit: 'Consolidated net profit (₹ crore)', x: 'fin.labels', from: 'FY15', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'ROE: below the cost of equity for seven years', unit: 'Return on average equity (%); line = our 13.4% cost of equity', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 20, lines: [{ v: 13.4, text: 'Cost of equity 13.4%', color: '#b4232a' }], source: SRC.est },
    ] },
    { pair: [
      { type: 'column', title: 'NII up only ~40% in five years', unit: 'Net interest income (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'NII', ref: 'fin.nii', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'Cost-to-income near 48% (incl. insurance-broking payouts)', unit: 'Operating expenses ÷ net total income (%), consolidated', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Cost-to-income', ref: 'fin.costToIncome', fmt: 'pct' }], labels: 'all', min: 25, max: 55, source: SRC.est },
    ] },
    { callout: '**Our view:** this is a cyclical, not a compounding, franchise. The good news is that the last two years have been the cleanest in a decade: credit cost back inside the 1.3-1.7% band, Stage 3 down to 3.4%, and profit up 75% in Q1FY27. The bad news is that even the good years have produced only ~12% ROE, because margins have been squeezed by competition in vehicle loans and costs are high. We forecast EPS of {{F.eps.0|n2}} / {{F.eps.1|n2}} / {{F.eps.2|n2}} for FY27-29E and ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}}: better than history, still around the cost of equity.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet', kicker: 'Balance sheet', title: 'A ₹1.59 lakh crore balance sheet, levered ~5x and rising',
  blocks: [
    { p: 'At Mar-2026 the group had ₹1,58,644 cr of assets: ₹1,39,265 cr of loans (net of provisions), ₹15,000 cr of cash, bank deposits and investments, and ₹1,300 cr of fixed assets. It was funded by ₹26,639 cr of shareholders\' equity, ₹1,28,370 cr of borrowings (including ₹14,130 cr of public fixed deposits, which an upper-layer deposit-taking NBFC may accept) and ₹3,635 cr of other liabilities. Borrowings were 4.8x equity, down from 5.5x a year earlier because of the ₹2,996 cr rights issue in June 2025. Group AUM was 5.3x equity, far less than Chola (~7.4x): M&M Finance runs with more capital, which is one reason its ROE is lower.' },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore, consolidated)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Group lending AUM', '{{fin.aum.7|num}}', '{{fin.aum.9|num}}', '{{fin.aum.10|num}}', '{{fin.aum.11|num}}'],
      ['Shareholders\' equity (net worth)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. deposits)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Investments and cash (Screener)', '{{fin.liquidity.7|num}}', '{{fin.liquidity.9|num}}', '{{fin.liquidity.10|num}}', '{{fin.liquidity.11|num}}'],
      ['Total assets', '{{A.totalAssets.7|num}}', '{{A.totalAssets.9|num}}', '{{A.totalAssets.10|num}}', '{{A.totalAssets.11|num}}'],
      ['Borrowings ÷ equity (x)', '{{fin.debtEquity.7|n2}}', '{{fin.debtEquity.9|n2}}', '{{fin.debtEquity.10|n2}}', '{{fin.debtEquity.11|n2}}'],
      ['Equity ÷ AUM (%)', '{{fin.equityToAum.7|pct}}', '{{fin.equityToAum.9|pct}}', '{{fin.equityToAum.10|pct}}', '{{fin.equityToAum.11|pct}}'],
    ], source: SRC.co } },
    { pair: [
      { type: 'stacked', title: 'Equity raised three times in nine years to keep up with borrowings', unit: '₹ \'000 crore at March', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Borrowings', ref: 'fin.borrowings', scale: 0.001, fmt: 'num' }, { name: 'Net worth', ref: 'fin.netWorth', scale: 0.001, fmt: 'num' }], minLabel: 12, source: SRC.est },
      { type: 'line', title: 'Cash flow is negative whenever the book grows', unit: 'Cash from operations (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }], labels: 'last', source: 'Screener.in cash flow (consolidated)' },
    ] },
    { callout: '**Read this right:** a lender\'s operating cash flow is negative whenever its loan book grows, because new loans count as an operating outflow. What matters is whether equity keeps up with the book. M&M Finance pays out ~36% of profit, so at a 12-13% ROE its equity grows only ~8% a year from retained profit. At our 14-15% AUM growth, AUM ÷ equity rises from {{fin.leverage.11|n2}}x (FY26) to {{fin.leverage.14|n2}}x (FY29E) and borrowings ÷ equity to {{fin.debtEquity.14|n2}}x, inside the "6-plus" the CFO is comfortable with. Growing at the 16-18% management wants would bring the next equity raise forward to around FY30, as in FY18, FY21 and FY26.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: M&M controls 52.5%; Indian institutions own almost a third, foreigners under 10%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions dominate; foreign funds stay small', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'M&M took up more than its share of the 2025 rights issue', unit: 'Promoter (M&M) holding (%)', x: 'SH.periods', series: [{ name: 'Promoter', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 54, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials (lender format)',
  blocks: [
    { p: 'Screener\'s NBFC layout, rebuilt into a lender income statement. Revenue = interest income + fees and other operating income (insurance commission, loan fees, insurance-broking income of MIBL, lease rentals); operating expenses include depreciation and "fees and commission expense" (mostly MIBL\'s broker payouts); provisions = impairment on financial instruments. Other income is non-operating income plus the share of the AMC and US joint ventures, and exceptional items (FY26: −₹133 cr for the new labour codes). AUM = MMFSL business assets + MRHFL net loans. Interest income and NII start in FY19, the first year whose revenue split we sourced.' },
    { statement: { title: 'Lender P&L and balance sheet, FY15–FY29E', rows: [
      { key: 'aum', name: 'Group lending AUM (year-end)', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'sales', name: 'Total income' },
      { key: 'interest', name: 'Interest expense' },
      { key: 'nii', name: 'Net interest income', flag: { type: 'pct', th: 20 }, hl: true },
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
      { key: 'sales', name: 'Total income', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'interest', name: 'Interest expense' },
      { key: 'expenses', name: 'Opex excl. depreciation + provisions', yoy: true, flag: { type: 'pct', th: 25 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, yoy: true, flag: { type: 'pct', th: 30 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
    ] } },
  ],
};

module.exports = { financials, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, `${SYM}.research.js`)) ? require(`./${SYM}.research`) : null;
  const report = {
    symbol: SYM, listing: 'NSE: M&MFIN · BSE: 532720', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Financials (NBFCs)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, balance, ownershipBase, statements }) : [financials, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
