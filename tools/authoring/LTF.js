// Authoring source for the L&T Finance initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis), on the
// `lender` engine (src/forecast-lender.js).
// Part A (this file): chapters built on reported financials (Screener consolidated + company history).
// Part B (LTF.research.js + part2-6, shared LTF.ctx.js) adds the research chapters.
// Usage: node tools/authoring/LTF.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'LTF', 'research');
const SRC = { co: 'Company presentations (Q4FY20-Q1FY27), annual reports, Screener.in (consolidated), GAM Research', est: 'Company, Screener.in; GAM Research estimates (FY27-29E)' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'A lost decade for shareholders, then four years of repair: profit has nearly tripled since FY22, ROE is still only 11%',
  blocks: [
    { p: 'L&T Finance\'s ten-year record has two halves. Up to FY19 it was a fast-growing wholesale-plus-retail lender: profit rose from ₹855 cr (FY15) to ₹2,232 cr (FY19) and ROE reached 18%. Then the infrastructure and real-estate book went bad after the IL&FS default (2018), Covid hit, and profit fell to ₹949 cr in FY21 (ROE 5.8%). FY22-FY23 were clean-up years: the wholesale book was sold down, a ₹2,687 cr fair-value loss was booked in FY23 (offset by the ₹2,575 cr gain on selling the mutual-fund business), and continuing operations lost money that year. Since FY24 the business has been a retail lender, and profit has grown 13-51% a year to ₹2,983 cr in FY26. But because book value kept growing, ROE has only climbed from 10.3% to 11.1%.' },
    { pair: [
      { type: 'column', title: 'Net profit: back above the FY19 peak only in FY25', unit: 'Consolidated net profit (₹ crore); FY23 includes the mutual-fund sale gain', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'ROE: 18% in FY19, 5-6% in FY21-22, 11% now', unit: 'Return on average equity (%)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: SRC.est },
    ] },
    { pair: [
      { type: 'column', title: 'NII grew 66% in four years on a book that grew 38%', unit: 'Net interest income (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'NII', ref: 'fin.nii', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'Cost-to-income rose from 30% to ~40% with the retail build-out', unit: 'Operating expenses ÷ net total income (%)', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'Cost-to-income', ref: 'fin.costToIncome', fmt: 'pct' }], labels: 'all', min: 20, max: 50, source: SRC.est },
    ] },
    { callout: '**Our view:** the repair is real (a 98% retail book, NIM up from ~6% to ~9% of AUM on our basis, a clean wholesale exit), but the returns are not there yet. FY26 ROE of {{fin.roe.11|pct}} is below any reasonable cost of equity (~13%). We forecast EPS growth of {{F.epsGrowth.0|pct}} in FY27E as credit costs fall, then {{F.epsGrowth.1|pct}} in FY28E (our insurance-commission haircut) and {{F.epsGrowth.2|pct}} in FY29E, taking ROE to {{F.roe.2|pct}}: an improvement, but short of the 16-18% LTF targets for FY31.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet', kicker: 'Balance sheet', title: 'A ₹1.42 lakh crore balance sheet, levered only ~4x, with ₹4,800 cr of legacy security receipts still on it',
  blocks: [
    { p: 'At Mar-2026 the group had ₹1.42 lakh cr of assets: ₹1.18 lakh cr of loans (net of provisions), ₹10,564 cr of investments (including ₹4,808 cr of security receipts, SRs, received for wholesale loans sold to asset-reconstruction companies) and ₹7,959 cr of cash and bank balances. It was funded by ₹27,983 cr of equity, ₹1.10 lakh cr of borrowings and ₹3,903 cr of other liabilities. AUM was only 4.35x equity (Cholamandalam ~7.4x), because LTF shrank its book for four years while keeping its capital; leverage is now rising quickly as the book grows 25% a year and equity ~10%.' },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Loan book (AUM)', '{{fin.aum.7|num}}', '{{fin.aum.9|num}}', '{{fin.aum.10|num}}', '{{fin.aum.11|num}}'],
      ['Shareholders\' equity (net worth)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. lease liabilities)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash, bank and investments (incl. SRs)', '{{fin.liquidity.7|num}}', '{{fin.liquidity.9|num}}', '{{fin.liquidity.10|num}}', '{{fin.liquidity.11|num}}'],
      ['Total assets', '{{A.totalAssets.7|num}}', '{{A.totalAssets.9|num}}', '{{A.totalAssets.10|num}}', '{{A.totalAssets.11|num}}'],
      ['Borrowings ÷ equity (x)', '{{fin.debtEquity.7|n2}}', '{{fin.debtEquity.9|n2}}', '{{fin.debtEquity.10|n2}}', '{{fin.debtEquity.11|n2}}'],
      ['AUM ÷ equity (x)', '{{fin.leverage.7|n2}}', '{{fin.leverage.9|n2}}', '{{fin.leverage.10|n2}}', '{{fin.leverage.11|n2}}'],
    ], source: SRC.co } },
    { pair: [
      { type: 'stacked', title: 'Borrowings shrank for five years, now grow ~20% a year', unit: '₹ \'000 crore at March', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Borrowings', ref: 'fin.borrowings', scale: 0.001, fmt: 'num' }, { name: 'Net worth', ref: 'fin.netWorth', scale: 0.001, fmt: 'num' }], minLabel: 15, source: SRC.est },
      { type: 'line', title: 'Cash flow turned negative again once the book started growing', unit: 'Cash from operations (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }], labels: 'last', source: 'Screener.in cash flow (consolidated)' },
    ] },
    { callout: '**Read this right:** a lender\'s operating cash flow is negative whenever its loan book grows (−₹14,189 cr in FY26); in FY20-FY23 it was positive only because the book was shrinking. What matters is capital: Tier 1 was 17.14% in Jun-2026 (CRAR 17.89%, minimum 15%), down from 21% in FY24 as growth resumed. At our forecast growth and a 23% payout, AUM reaches ~{{fin.leverage.14|n1}}x equity by FY29E; that is still conservative for a lender, so LTF does not need equity before FY29, but the free capital cushion is being used up.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: L&T owns two-thirds; domestic funds have doubled their stake in two years',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions up, retail investors down', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'Public', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'L&T steady at ~66%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 70, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials (lender format)',
  blocks: [
    { p: 'Screener\'s NBFC layout, rebuilt into a lender income statement. Revenue = interest income + fees and other operating income (insurance distribution, processing fees, fair-value gains); operating expenses include depreciation; "credit losses" = impairment + write-offs (loss on derecognition) + fair-value losses on security receipts and wholesale assets, plus the FY23 exceptional fair-value loss. AUM is the consolidated book (retail + wholesale). FY24 revenue and expenses are on the audited basis (Screener grosses ~₹675 cr into both). Interest income and NII start in FY21, the first year whose revenue split we sourced. FY21-FY23 profit includes discontinued businesses (wealth management, mutual fund).' },
    { statement: { title: 'Lender P&L and balance sheet, FY15–FY29E', rows: [
      { key: 'aum', name: 'Loan book (year-end)', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'sales', name: 'Total income' },
      { key: 'interest', name: 'Interest expense' },
      { key: 'nii', name: 'Net interest income', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'feeIncome', name: 'Fees & other operating income' },
      { key: 'opex', name: 'Operating expenses (incl. depreciation)' },
      { key: 'ppop', name: 'Pre-provision operating profit' },
      { key: 'provisions', name: 'Credit losses & provisions', flag: { type: 'pct', th: 30 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
      { key: 'bvps', name: 'Book value per share (₹)', fmt: 'n1' },
      { key: 'netWorth', name: 'Net worth' },
      { key: 'borrowings', name: 'Borrowings' },
      { key: 'nim', name: 'NIM (NII ÷ average AUM) %', fmt: 'pct', flag: { type: 'bps', th: 50 } },
      { key: 'creditCost', name: 'Credit cost (losses ÷ average AUM) %', fmt: 'pct', flag: { type: 'bps', th: 50 }, inverse: true },
      { key: 'roe', name: 'ROE %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (Screener NBFC layout)', rows: [
      { key: 'sales', name: 'Total income', yoy: true, flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'interest', name: 'Interest expense' },
      { key: 'expenses', name: 'Opex excl. depreciation + credit losses', yoy: true, flag: { type: 'pct', th: 30 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, yoy: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
    ] } },
  ],
};

module.exports = { financials, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'LTF.research.js')) ? require('./LTF.research') : null;
  const report = {
    symbol: 'LTF', listing: 'NSE: LTF · BSE: 533519', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Financials (NBFCs)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, balance, ownershipBase, statements }) : [financials, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
