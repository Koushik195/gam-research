// Authoring source for the SBI Cards and Payment Services initiating-coverage report (as of 30-Sep-2026,
// Q1FY27 basis), on the `lender` engine (src/forecast-lender.js). 'AUM' = gross card receivables.
// Part A (this file): chapters built on reported financials (Screener standalone + annual reports).
// Part B (SBICARD.research.js + part2-6, shared SBICARD.ctx.js) adds the research chapters.
// Usage: node tools/authoring/SBICARD.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'SBICARD', 'research');
const SRC = { co: 'Annual reports FY20-FY26, company presentations, Screener.in (standalone), GAM Research', est: 'Company, GAM Research estimates (FY27-29E)' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'From 25% ROE to 15% in two years; the way back runs through credit costs, not growth',
  blocks: [
    { p: 'SBI Card grew net profit from ₹284 cr in FY16 to a peak of ₹2,408 cr in FY24, about 31% a year, with returns on equity of 22-32% in most years. Then the model broke. Receivables growth fell from 25-30% a year (FY22-FY24) to 10% in FY25 and 2% in FY26, and loan losses rose to 9% of receivables as unsecured borrowers who had taken too much credit stopped paying. Profit fell 20% in FY25 to ₹1,916 cr and recovered only 13% in FY26 to ₹2,167 cr; ROE halved to under 15%. Q1FY27 is the first quarter that looks better: profit ₹664 cr (+20%) as credit costs fell to 6.5%.' },
    { pair: [
      { type: 'column', title: 'Net profit: a decade of growth, two lost years, a recovery in FY27E', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'ROE: from the mid-20s to 15%, back to ~17% in our model', unit: 'Return on average equity (%)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 36, source: SRC.est },
    ] },
    { pair: [
      { type: 'column', title: 'Income still grows, but slowly: fees now exceed interest', unit: 'Interest income and fees & other operating income (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Interest income', ref: 'fin.interestIncome', fmt: 'num' }, { name: 'Fees & other', ref: 'fin.feeIncome', fmt: 'num' }], labels: 'none', source: SRC.est },
      { type: 'line', title: 'Credit cost decides the year: 6% in FY23, 9% in FY25, 6.6% in FY27E', unit: 'Gross credit cost: impairment ÷ average receivables (%)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Credit cost', ref: 'fin.creditCost', fmt: 'pct' }], labels: 'all', min: 0, max: 12, source: SRC.est },
    ] },
    { callout: '**Our view:** the FY27-29E profit recovery is mostly a credit-cost story. Pre-provision profit barely grew in FY26 (+3%) and fell 12% year on year in Q1FY27 as margins slipped and costs rose with spends. We forecast EPS of {{F.eps.0|n2}} / {{F.eps.1|n2}} / {{F.eps.2|n2}} for FY27-29E (growth {{F.epsGrowth.0|pct}}, {{F.epsGrowth.1|pct}}, {{F.epsGrowth.2|pct}}). All of FY27E\'s gain comes from lower loan losses: pre-provision profit is flat in our model ({{fin.ppop.11|num}} → {{F.ppop.0|num}} cr) and only starts growing again in FY28E as receivables pick up. ROE returns to ~17%, not to the 22-26% of FY22-FY24.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet', kicker: 'Balance sheet', title: 'A ₹66,000 crore balance sheet that is now over-capitalised: 4.2x assets to equity and falling',
  blocks: [
    { p: 'At Mar-2026 SBI Card had ₹66,328 cr of assets: ₹54,984 cr of card loans net of provisions (gross receivables ₹56,926 cr), ₹6,374 cr of investments (mostly government securities held for liquidity) and ₹2,320 cr of cash. It was funded by ₹15,726 cr of equity, ₹44,064 cr of borrowings and ₹6,539 cr of other liabilities (mostly payables to merchants and networks, and provisions). Equity capital has barely moved since FY20 (₹939 cr to ₹952 cr, employee options only): every rupee of equity growth since the 2020 listing has come from retained profit.' },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Gross card receivables', '{{fin.aum.7|num}}', '{{fin.aum.9|num}}', '{{fin.aum.10|num}}', '{{fin.aum.11|num}}'],
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Investments (liquidity)', '{{fin.liquidity.7|num}}', '{{fin.liquidity.9|num}}', '{{fin.liquidity.10|num}}', '{{fin.liquidity.11|num}}'],
      ['Total assets', '{{A.totalAssets.7|num}}', '{{A.totalAssets.9|num}}', '{{A.totalAssets.10|num}}', '{{A.totalAssets.11|num}}'],
      ['Borrowings ÷ equity (x)', '{{fin.debtEquity.7|n2}}', '{{fin.debtEquity.9|n2}}', '{{fin.debtEquity.10|n2}}', '{{fin.debtEquity.11|n2}}'],
      ['Equity ÷ receivables (%)', '{{fin.equityToAum.7|pct}}', '{{fin.equityToAum.9|pct}}', '{{fin.equityToAum.10|pct}}', '{{fin.equityToAum.11|pct}}'],
    ], source: SRC.co } },
    { pair: [
      { type: 'stacked', title: 'Equity is growing faster than borrowings again', unit: '₹ \'000 crore at March', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Borrowings', ref: 'fin.borrowings', scale: 0.001, fmt: 'n1' }, { name: 'Net worth', ref: 'fin.netWorth', scale: 0.001, fmt: 'n1' }], minLabel: 8, source: SRC.est },
      { type: 'line', title: 'Cash flow turned positive in FY26 because the book stopped growing', unit: 'Cash from operations (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }], labels: 'last', source: 'Screener.in cash flow (standalone)' },
    ] },
    { callout: '**Read this right:** a lender\'s operating cash flow is negative whenever its book grows, because new loans are an operating outflow. SBI Card\'s turned positive in FY26 (₹493 cr) for the wrong reason: receivables grew only 2%. With a 12% payout and receivables growing 8-13%, equity compounds faster than assets in our model, so leverage keeps falling ({{fin.assetsToEquity.11|n2}}x assets to equity in FY26 to {{fin.assetsToEquity.14|n2}}x in FY29E). That caps ROE unless growth returns or more cash is paid out.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: State Bank of India controls 69%; domestic funds have replaced foreign ones',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions up, foreign funds down', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter (SBI) steady near 69%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 72, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials (lender format)',
  blocks: [
    { p: 'Screener\'s NBFC layout, rebuilt into a lender income statement. Total income = interest income + fees and other operating income (interchange, fees, membership, network incentives); operating expenses include fees and commission paid and depreciation (the company\'s "operating cost"); provisions = impairment on financial instruments (write-offs plus the change in expected-loss provisions). Recoveries of written-off loans are in other income, so the company\'s "net credit cost" is provisions minus part of other income. Ratios use year-end averages, so they differ slightly from the company\'s monthly-average ratios.' },
    { statement: { title: 'Lender P&L and balance sheet, FY15–FY29E', rows: [
      { key: 'aum', name: 'Gross card receivables (year-end)', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'sales', name: 'Total income (interest + fees)' },
      { key: 'interest', name: 'Interest expense' },
      { key: 'nii', name: 'Net interest income', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'feeIncome', name: 'Fees & other operating income' },
      { key: 'opex', name: 'Operating expenses (incl. fees paid, depreciation)' },
      { key: 'ppop', name: 'Pre-provision operating profit' },
      { key: 'provisions', name: 'Impairment (gross credit cost)', flag: { type: 'pct', th: 30 }, inverse: true },
      { key: 'otherIncome', name: 'Other income (mainly recoveries)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
      { key: 'bvps', name: 'Book value per share (₹)', fmt: 'n1' },
      { key: 'netWorth', name: 'Net worth' },
      { key: 'borrowings', name: 'Borrowings' },
      { key: 'nim', name: 'NIM (NII ÷ average receivables) %', fmt: 'pct', flag: { type: 'bps', th: 50 } },
      { key: 'creditCost', name: 'Credit cost (impairment ÷ average receivables) %', fmt: 'pct', flag: { type: 'bps', th: 100 }, inverse: true },
      { key: 'roe', name: 'ROE %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (Screener NBFC layout)', rows: [
      { key: 'sales', name: 'Total income', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'interest', name: 'Interest expense' },
      { key: 'expenses', name: 'Opex excl. depreciation + impairment', yoy: true, flag: { type: 'pct', th: 20 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, yoy: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
    ] } },
  ],
};

module.exports = { financials, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'SBICARD.research.js')) ? require('./SBICARD.research') : null;
  const report = {
    symbol: 'SBICARD', listing: 'NSE: SBICARD · BSE: 543066', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Financials (NBFCs)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, balance, ownershipBase, statements }) : [financials, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
