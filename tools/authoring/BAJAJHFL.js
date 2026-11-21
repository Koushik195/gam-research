// Authoring source for the Bajaj Housing Finance initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Lender engine (src/forecast-lender.js). Part A (this file): chapters built on reported financials
// (Screener standalone, FY20 column repaired by BAJAJHFL.patch.js, + company history).
// Part B (BAJAJHFL.research.js + part2-6, shared BAJAJHFL.ctx.js) adds the research chapters.
// Usage: node tools/authoring/BAJAJHFL.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'BAJAJHFL', 'research');
const SRC = { co: 'Company presentations and annual reports (FY25-Q1FY27), Screener.in (standalone), GAM Research', est: 'Company, Screener.in; GAM Research estimates (FY27-29E)' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Profit up 41% a year since FY21, but returns peaked in FY24 and growth is settling near 18%',
  blocks: [
    { p: 'Bajaj Housing Finance grew net profit from ₹453 cr in FY21 to ₹2,560 cr in FY26 (41% a year) and its loan book (AUM) from ₹38,871 cr to ₹1,40,706 cr (29% a year). Profit grew faster than the book for three reasons: operating costs fell from 28% of net income to 20% as the business scaled, loan losses fell from 0.8% of loans (FY21, Covid) to under 0.2%, and leverage rose. Those tailwinds are now used up. Return on equity peaked at 15.2% in FY24, fell to 13.4% in FY25 when ₹5,560 cr of new equity arrived (rights issue and IPO) and to 12.1% in FY26 as margins narrowed. FY26 profit grew 18%; we forecast 17-18% a year for FY27-29E.' },
    { pair: [
      { type: 'column', title: 'Net profit: from ₹453 cr to ₹2,560 cr in five years', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'ROE peaked at 15% in FY24; IPO capital and thinner margins pulled it to 12%', unit: 'Return on average equity (%)', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 18, source: SRC.est },
    ] },
    { pair: [
      { type: 'column', title: 'Net interest income grew 4x since FY21, but only 11% a year from here', unit: 'Net interest income (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'NII', ref: 'fin.nii', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'Cost-to-income halved from 33% to 20%: the big efficiency gain is behind it', unit: 'Operating expenses ÷ net total income (%)', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'Cost-to-income', ref: 'fin.costToIncome', fmt: 'pct' }], labels: 'all', min: 10, max: 36, source: SRC.est },
    ] },
    { callout: '**Our view:** the easy gains are done. Costs are already among the lowest of any Indian lender (~20% of income) and loan losses are close to zero, so neither can fall much further. From here profit growth depends on AUM growth (21-23%) minus margin erosion (NIM down 20-25bp in FY27). That is why we forecast EPS growth of {{F.epsGrowth.0|pct}} / {{F.epsGrowth.1|pct}} / {{F.epsGrowth.2|pct}} for FY27-29E, below AUM growth, with ROE edging up only as leverage rises ({{F.roe.0|pct}} → {{F.roe.2|pct}}).' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet', kicker: 'Balance sheet', title: 'A ₹1.27 lakh crore balance sheet: 98% loans, funded 4.6:1 by debt',
  blocks: [
    { p: 'At Mar-2026 BHFL had ₹1,27,147 cr of assets: ₹1,24,491 cr of loans and other assets, ₹2,502 cr of investments (its liquidity buffer) and ₹154 cr of fixed assets. They were funded by ₹22,523 cr of equity, ₹1,03,704 cr of borrowings and ₹920 cr of other liabilities. Borrowings were 4.6x equity and total assets 5.6x. A further ~₹17,000 cr of loans (12% of AUM) has been sold to other lenders (including ₹3,645 cr to the parent in FY26) and is still serviced by BHFL; it counts in AUM but not in the balance sheet. The cash buffer is thin by NBFC standards (₹2,516 cr in Jun-26, 2% of assets) because borrowings are long-dated: the behavioural maturity profile shows a surplus in every bucket up to one year.' },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['AUM (incl. assigned loans)', '{{fin.aum.2|num}}', '{{fin.aum.4|num}}', '{{fin.aum.5|num}}', '{{fin.aum.6|num}}'],
      ['Shareholders\' equity (net worth)', '{{A.netWorth.2|num}}', '{{A.netWorth.4|num}}', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}'],
      ['Borrowings', '{{A.borrowings.2|num}}', '{{A.borrowings.4|num}}', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}'],
      ['Cash and investments', '{{fin.liquidity.2|num}}', '{{fin.liquidity.4|num}}', '{{fin.liquidity.5|num}}', '{{fin.liquidity.6|num}}'],
      ['Total assets', '{{A.totalAssets.2|num}}', '{{A.totalAssets.4|num}}', '{{A.totalAssets.5|num}}', '{{A.totalAssets.6|num}}'],
      ['Borrowings ÷ equity (x)', '{{fin.debtEquity.2|n2}}', '{{fin.debtEquity.4|n2}}', '{{fin.debtEquity.5|n2}}', '{{fin.debtEquity.6|n2}}'],
      ['Equity ÷ AUM (%)', '{{fin.equityToAum.2|pct}}', '{{fin.equityToAum.4|pct}}', '{{fin.equityToAum.5|pct}}', '{{fin.equityToAum.6|pct}}'],
    ], source: SRC.co } },
    { pair: [
      { type: 'stacked', title: 'Equity jumped in FY25 (rights issue + IPO); borrowings carry the growth', unit: '₹ \'000 crore at March', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'Borrowings', ref: 'fin.borrowings', scale: 0.001, fmt: 'num' }, { name: 'Net worth', ref: 'fin.netWorth', scale: 0.001, fmt: 'num' }], minLabel: 15, source: SRC.est },
      { type: 'line', title: 'Cash flow is negative by design: loans grow faster than profit', unit: 'Cash from operations (₹ crore)', x: 'A.labels', from: 'FY21', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }], labels: 'last', source: 'Screener.in cash flow (standalone)' },
    ] },
    { callout: '**Read this right:** a lender\'s operating cash flow is negative whenever its loan book grows, because new loans are an operating outflow. What matters is whether equity keeps pace. BHFL retains all its profit (no dividend yet), which grows equity ~13% a year against AUM growth of 20%+, so leverage creeps up: from {{fin.assetsToEquity.6|n2}}x assets to equity in FY26 to {{fin.assetsToEquity.9|n2}}x by FY29E in our model, still below its own 8x ceiling. It needs no new equity in our forecast period (see the capital chapter).' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the parent holds 86.7% and must sell 11.7% by Sep-2029; institutions own under 2%',
  blocks: [
    { pair: [
      { type: 'column', title: 'Bajaj Finance\'s stake: 88.75% at listing, 86.70% now, 75% required', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoter', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 70, max: 90, lines: [{ v: 75, text: 'Required by 15-Sep-2029: 75%', color: '#b4232a' }], source: 'BSE shareholding pattern, Screener.in' },
      { type: 'line', title: 'Retail holds the float; foreign and domestic funds hold ~1% each', unit: '% of shares', x: 'SH.periods', series: [{ name: 'Public (retail and others)', ref: 'SH.rows.Public', fmt: 'pct' }, { name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials (lender format)',
  blocks: [
    { p: 'Screener\'s NBFC layout rebuilt into a lender income statement. Total income = interest income + fees and other income (insurance commissions, charges, fair-value gains and income on assigned loans); operating expenses include depreciation; provisions = loan losses and provisions. Ratios are on AUM, which includes assigned loans, so they read lower than the company\'s ratios on loan assets. Screener\'s FY20 column is one tenth of the reported figures; we restored it (company P&L; balance sheet ×10). Book value per share starts in FY25 because Screener\'s earlier per-share figures use an adjusted share count, not the shares then in issue.' },
    { statement: { title: 'Lender P&L and balance sheet, FY20–FY29E', rows: [
      { key: 'aum', name: 'AUM (year-end)', flag: { type: 'pct', th: 30 }, hl: true },
      { key: 'sales', name: 'Total income' },
      { key: 'interest', name: 'Interest expense' },
      { key: 'nii', name: 'Net interest income', flag: { type: 'pct', th: 30 }, hl: true },
      { key: 'feeIncome', name: 'Fees & other income' },
      { key: 'opex', name: 'Operating expenses (incl. depreciation)' },
      { key: 'ppop', name: 'Pre-provision operating profit' },
      { key: 'provisions', name: 'Loan losses & provisions', flag: { type: 'pct', th: 50 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 30 } },
      { key: 'eps', name: 'EPS (₹, Screener basis)', fmt: 'n2' },
      { key: 'bvps', name: 'Book value per share (₹)', fmt: 'n1', fn: "i < 5 ? null : g('fin.bvps')[i]" },
      { key: 'netWorth', name: 'Net worth', flag: { type: 'pct', th: 40 } },
      { key: 'borrowings', name: 'Borrowings' },
      { key: 'nim', name: 'NIM (NII ÷ average AUM) %', fmt: 'pct', flag: { type: 'bps', th: 25 } },
      { key: 'creditCost', name: 'Credit cost (provisions ÷ average AUM) %', fmt: 'n2', flag: { type: 'bps', th: 10 }, inverse: true },
      { key: 'roe', name: 'ROE %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
    ], source: 'Company (AUM, fees, provisions), Screener.in (standalone; FY20 repaired), GAM Research estimates FY27-29E' } },
    { statement: { quarterly: true, title: 'Quarterly P&L (Screener NBFC layout)', rows: [
      { key: 'sales', name: 'Total income', yoy: true, flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'interest', name: 'Interest expense' },
      { key: 'expenses', name: 'Opex excl. depreciation + provisions', yoy: true, flag: { type: 'pct', th: 30 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, yoy: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
    ], source: 'Screener.in (standalone), company results' } },
  ],
};

module.exports = { financials, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'BAJAJHFL.research.js')) ? require('./BAJAJHFL.research') : null;
  const report = {
    symbol: 'BAJAJHFL', listing: 'NSE: BAJAJHFL · BSE: 544252', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Financials (NBFCs and housing finance)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, balance, ownershipBase, statements }) : [financials, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
