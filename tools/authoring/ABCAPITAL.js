// Authoring source for the Aditya Birla Capital initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis), on the
// `lender` engine (src/forecast-lender.js) run on the STANDALONE accounts (ABCL = the NBFC after the 2025 merger),
// with the subsidiaries valued in a sum of the parts (ABCAPITAL.ctx.js / ctx2 / ctx3; ABCAPITAL.sotp.js carries the
// SOTP into the engine as an implied multiple of standalone Sep-28E book).
// Part A (this file): chapters on reported financials + the writer. Part B: ABCAPITAL.research.js + part2-6.
// Usage: node tools/authoring/ABCAPITAL.js   (run node src/model.js ABCAPITAL before and after)
const fs = require('fs');
const path = require('path');
const { syncSotp } = require('./ABCAPITAL.sotp');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ABCAPITAL', 'research');
const SRC = { co: 'ABCL presentations (Q4FY23-Q1FY27), annual reports FY25-FY26, Screener.in (standalone), GAM Research', est: 'Company, Screener.in (standalone); GAM Research estimates (FY27-29E)' };
// Standalone figures before FY24 (index 9 on fin.labels) are the old holding company: hidden in the statement.
const hide10 = key => `i < 10 ? null : g('fin.${key}')[i]`; // ratios on averages need FY24 as the opening year
const hide = key => `i < 9 ? null : g('fin.${key}')[i]`;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'The lender has compounded profit ~19% a year; the group less so',
  blocks: [
    { p: 'Two sets of numbers matter. **The NBFC** (Aditya Birla Finance until April 2025, now ABCL itself) grew profit from ₹1,108 cr in FY22 to ₹3,001 cr in FY26, about 28% a year, while its loan book tripled to ₹1.60 lakh cr. **The group** (consolidated, after partners\' shares) earned ₹3,764 cr in FY26, up from ₹1,660 cr-odd in FY22 on Screener\'s basis but with large one-off gains in between (₹2,739 cr when ADIA invested in health insurance in FY23, ₹433 cr and ₹191 cr from selling AMC shares in FY24-25). Before one-offs, group profit grew from ₹2,057 cr (FY23) to ₹3,797 cr (FY26), ~23% a year. Return on equity has been the weak spot: 12% at group level in FY25-FY26, because the insurers and the AMC tie up equity that earns little or is shared with partners.' },
    { pair: [
      { type: 'column', title: 'NBFC profit: ₹1,108 cr to ₹3,001 cr in four years', unit: 'NBFC profit after tax (₹ crore)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'NBFC PAT', values: [1108, 1554, 2221, 2501, 3001], fmt: 'num' }], labels: 'all', source: 'Q4FY23-Q4FY26 presentations' },
      { type: 'column', title: 'Standalone profit (the NBFC plus the AMC dividend) to FY29E', unit: 'Standalone net profit (₹ crore)', x: 'fin.labels', from: 'FY24', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.est },
    ] },
    { pair: [
      { type: 'line', title: 'Standalone ROE sits below 13% because ₹9,000 cr is parked in subsidiaries at cost', unit: 'Return on average standalone equity (%)', x: 'fin.labels', from: 'FY25', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 8, max: 16, source: SRC.est },
      { type: 'line', title: 'Cost-to-income rose from 29% to ~33%; gold branches keep it there', unit: 'Operating expenses ÷ net total income (%)', x: 'fin.labels', from: 'FY25', to: 'FY29E', series: [{ name: 'Cost-to-income', ref: 'fin.costToIncome', fmt: 'pct' }], labels: 'all', min: 25, max: 40, source: SRC.est },
    ] },
    { callout: '**Our view:** the NBFC is a good lender that has finally reached scale (ROA 2.3-2.4%), but ABCL is not just the NBFC. The standalone return on equity ({{F.roe.0|pct}} in FY27E) is held down by ₹9,000 cr of investments in subsidiaries carried at cost, and the group\'s consolidated ROE (~13% in our FY27-28E rebuild) only just clears a 13.4% cost of equity. Profit growth will be strong (FY27E standalone {{F.patGrowth.0|chg}}, helped by the ₹4,000 cr raise that cuts borrowing), but returns are what the valuation has to pay for.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet', kicker: 'Balance sheet', title: 'A ₹1.7 lakh crore standalone balance sheet, now carrying ₹33,700 cr of equity',
  blocks: [
    { p: 'At Mar-2026 the standalone company had ₹1,70,586 cr of assets: ₹1,50,635 cr of loans, ₹16,691 cr of investments (of which ₹8,991 cr were its stakes in the housing-finance company, the insurers, the AMC and smaller subsidiaries, at cost) and small fixed assets. It was funded by ₹28,701 cr of equity, ₹1,38,415 cr of borrowings and ₹3,470 cr of other liabilities. In June the ₹4,000 cr preferential issue lifted equity to ₹33,700 cr, Tier 1 capital from 13.8% to 16.0% and cut borrowings ÷ equity from 4.8x to 4.2x. Because the RBI deducts investments in subsidiaries from Tier 1, ABCL needs more equity than a pure lender of the same size.' },
    { exhibit: { type: 'table', title: 'Standalone balance sheet snapshot (₹ crore)', head: ['', 'Mar-24', 'Mar-25', 'Mar-26', 'Mar-27E'], rows: [
      ['NBFC AUM', '{{fin.aum.9|num}}', '{{fin.aum.10|num}}', '{{fin.aum.11|num}}', '{{F.aum.0|num}}'],
      ['Net worth', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}', '{{F.netWorth.0|num}}'],
      ['Borrowings', '{{fin.borrowings.9|num}}', '{{fin.borrowings.10|num}}', '{{fin.borrowings.11|num}}', '{{F.borrowings.0|num}}'],
      ['Investments incl. subsidiaries at cost, and cash', '{{fin.liquidity.9|num}}', '{{fin.liquidity.10|num}}', '{{fin.liquidity.11|num}}', '{{F.liquidity.0|num}}'],
      ['Total assets', '{{A.totalAssets.9|num}}', '{{A.totalAssets.10|num}}', '{{A.totalAssets.11|num}}', '{{F.totalAssets.0|num}}'],
      ['Borrowings ÷ equity (x)', '{{fin.debtEquity.9|n2}}', '{{fin.debtEquity.10|n2}}', '{{fin.debtEquity.11|n2}}', '{{F.debtEquity.0|n2}}'],
      ['Equity ÷ AUM (%)', '{{fin.equityToAum.9|pct}}', '{{fin.equityToAum.10|pct}}', '{{fin.equityToAum.11|pct}}', '{{F.equityToAum.0|pct}}'],
    ], source: SRC.co + '; Mar-24 is the FY25 annual report\'s restatement for the merger' } },
    { pair: [
      { type: 'stacked', title: 'Equity jumps in FY27E with the June raise, then leverage creeps back up', unit: '₹ \'000 crore at March', x: 'fin.labels', from: 'FY24', to: 'FY29E', series: [{ name: 'Borrowings', ref: 'fin.borrowings', scale: 0.001, fmt: 'num' }, { name: 'Net worth', ref: 'fin.netWorth', scale: 0.001, fmt: 'num' }], minLabel: 20, source: SRC.est },
      { type: 'column', title: 'Investments in group companies at cost: ₹6,622 cr to ₹8,991 cr in a year', unit: 'ABCL\'s investments in subsidiaries, JVs and associates at cost (₹ crore)', x: ['Mar-25', 'Mar-26', 'Mar-27E', 'Mar-28E', 'Mar-29E'], series: [{ name: 'At cost', values: [6622, 8991, 9800, 10300, 10800], fmt: 'num' }], labels: 'all', source: 'Annual Report FY26 note 8 and related-party note; GAM estimates' },
    ] },
    { callout: '**Read this right:** operating cash flow is negative by design (−₹24,024 cr standalone in FY26) because new loans count as an operating outflow. What matters is whether equity keeps up with the book: ABCL pays no dividend, so profit (~₹4,000 cr a year) plus the June raise fund ~25% AUM growth, and the CFO says no new equity is needed for three years. The other call on equity is the subsidiaries: ₹2,369 cr went into them in FY26 (mostly the HFC before Advent arrived) and ₹608 cr more in July 2026.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Grasim and the Birla family control 69%; domestic funds have replaced foreign ones',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions up, foreign funds down', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter group steady near 69%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 66, max: 71, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials (standalone, lender format)',
  blocks: [
    { p: 'Screener\'s standalone NBFC layout rebuilt into a lender income statement. Standalone figures before FY24 belong to the old holding company (revenue of ₹100-450 cr a year) and are hidden; FY24 is the FY25 annual report\'s restatement for the merger. Revenue = interest income + fees and other operating income (fees and commission, assignment and fair-value gains, the AMC dividend, and in FY24-25 gains on selling AMC shares); operating expenses include depreciation; provisions = impairment on financial instruments. AUM is the NBFC\'s lending AUM.' },
    { statement: { title: 'Standalone lender P&L and balance sheet, FY24–FY29E', source: SRC.est, rows: [
      { key: 'aum', name: 'NBFC AUM (year-end)', fn: hide('aum'), flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'sales', name: 'Total income', fn: hide('sales') },
      { key: 'interest', name: 'Interest expense', fn: hide('interest') },
      { key: 'nii', name: 'Net interest income', fn: hide('nii'), flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'feeIncome', name: 'Fees & other operating income', fn: hide('feeIncome') },
      { key: 'opex', name: 'Operating expenses (incl. depreciation)', fn: hide('opex') },
      { key: 'ppop', name: 'Pre-provision operating profit', fn: hide('ppop') },
      { key: 'provisions', name: 'Loan losses & provisions', fn: hide('provisions'), flag: { type: 'pct', th: 30 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax', fn: hide('pbt') },
      { key: 'pat', name: 'Net profit', fn: hide('pat'), hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fn: hide('eps'), fmt: 'n2' },
      { key: 'bvps', name: 'Book value per share (₹)', fn: hide('bvps'), fmt: 'n1' },
      { key: 'netWorth', name: 'Net worth', fn: hide('netWorth'), flag: { type: 'pct', th: 20 } },
      { key: 'borrowings', name: 'Borrowings', fn: hide('borrowings') },
      { key: 'nim', name: 'NIM (NII ÷ average AUM) %', fn: hide10('nim'), fmt: 'pct', flag: { type: 'bps', th: 40 } },
      { key: 'creditCost', name: 'Credit cost (provisions ÷ average AUM) %', fn: hide10('creditCost'), fmt: 'pct', flag: { type: 'bps', th: 50 }, inverse: true },
      { key: 'roe', name: 'ROE % (standalone)', fn: hide10('roe'), fmt: 'pct', flag: { type: 'bps', th: 300 } },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (standalone, Screener NBFC layout)', source: 'Screener.in (standalone); quarters before Sep-2024 mix holding-company and restated figures', rows: [
      { key: 'sales', name: 'Total income', yoy: true, hl: true },
      { key: 'interest', name: 'Interest expense' },
      { key: 'expenses', name: 'Opex excl. depreciation + provisions' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
    ] } },
  ],
};

module.exports = { financials, balance, ownershipBase, statements, RD, SRC };

if (require.main === module) {
  syncSotp(); // keeps the engine's implied SOTP multiple in step with the built model
  const B = fs.existsSync(path.join(__dirname, 'ABCAPITAL.research.js')) ? require('./ABCAPITAL.research') : null;
  const report = {
    symbol: 'ABCAPITAL', listing: 'NSE: ABCAPITAL · BSE: 540691', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Financials (NBFCs and financial conglomerates)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, balance, ownershipBase, statements }) : [financials, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
