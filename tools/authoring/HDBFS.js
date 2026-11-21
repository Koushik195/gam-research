// Authoring source for the HDB Financial Services initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Lender engine (src/forecast-lender.js). Part A (this file): chapters built on reported financials
// (Screener standalone; HDB has no subsidiaries). Part B (HDBFS.research.js + part2-6, shared HDBFS.ctx.js)
// adds the research chapters. BPO revenue sits in fees & other income and BPO costs in opex, as on Screener.
// Usage: node tools/authoring/HDBFS.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'HDBFS', 'research');
const SRC = { co: 'Company presentations and annual reports (FY23-Q1FY27), Screener.in (standalone), GAM Research', est: 'Company, Screener.in; GAM Research estimates (FY27-29E)' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Profit has doubled since FY22, but ROE peaked at 19.5% in FY24 and the IPO reset it to ~14-15%',
  blocks: [
    { p: 'HDB\'s net profit went from ₹1,011 cr in FY22 to ₹2,544 cr in FY26, and its AUM from ₹61,444 cr to ₹1,18,733 cr (18% a year). The path was not smooth. FY21-FY22 were Covid years (loan losses of 5.1% and 4.0% of loans, ROE 4.8% and 11.2%). FY23-FY24 were the best years in its history: loan losses fell to 1.3-2.0% and ROE reached 19.5%. Then stress in commercial vehicles and unsecured business loans pushed loan losses back to 2.1% (FY25) and 2.5% (FY26); profit fell 12% in FY25 and recovered 17% in FY26. ROE fell to 13.9% in FY26 because of those losses and because the IPO added ₹2,500 cr of equity in Jun-2025. Q1FY27 was the best quarter yet (PAT ₹785 cr, ROE 15.0%).' },
    { pair: [
      { type: 'column', title: 'Net profit: Covid trough, FY24 peak, FY25 dip, record FY26', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'ROE: 19.5% at the FY24 peak, ~14.5% in our forecast', unit: 'Return on average equity (%)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 22, source: SRC.est },
    ] },
    { pair: [
      { type: 'column', title: 'Net interest income: up 77% since FY22', unit: 'Net interest income (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'NII', ref: 'fin.nii', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'Loan losses swing between 1.3% and 4%: the number that drives profit', unit: 'Provisions ÷ average AUM (%)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'Credit cost', ref: 'fin.creditCost', fmt: 'pct' }], labels: 'all', min: 0, max: 4.5, source: SRC.est },
    ] },
    { callout: '**Our view:** HDB earns a high margin (NIM ~8% on AUM) and pays for it with high costs (~3.7% of loans to run a 1,700-branch retail network) and high loan losses (~2.3% in a normal year). What is left is a 2.2-2.5% ROA. Small changes in loan losses move profit a lot: each 0.1pp of credit cost is ~3% of profit. We forecast EPS growth of {{F.epsGrowth.0|pct}} / {{F.epsGrowth.1|pct}} / {{F.epsGrowth.2|pct}} for FY27-29E and ROE of {{F.roe.0|pct}} → {{F.roe.2|pct}}: a recovery to the mid-teens, not a return to FY24\'s 19.5%.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet', kicker: 'Balance sheet', title: 'A ₹1.24 lakh crore balance sheet: 93% loans, funded 4.8:1 by debt',
  blocks: [
    { p: 'At Mar-2026 HDB had ₹1,23,651 cr of assets: ₹1,14,690 cr of loans (net of provisions), ₹3,748 cr of investments and ₹1,673 cr of cash (its liquidity buffer), ₹1,337 cr of derivative assets (hedges on foreign-currency borrowings) and ₹773 cr of fixed assets. They were funded by ₹20,664 cr of equity, ₹99,230 cr of borrowings and ₹3,757 cr of other liabilities. Borrowings were 4.8x equity and total assets 6.0x, the lowest leverage in at least six years, thanks to the IPO money. Almost all of AUM is on the balance sheet (AUM ₹1,18,733 cr vs gross loans ₹1,18,493 cr); securitisation is only ~4% of funding.' },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['AUM', '{{fin.aum.1|num}}', '{{fin.aum.3|num}}', '{{fin.aum.4|num}}', '{{fin.aum.5|num}}'],
      ['Shareholders\' equity (net worth)', '{{A.netWorth.1|num}}', '{{A.netWorth.3|num}}', '{{A.netWorth.4|num}}', '{{A.netWorth.5|num}}'],
      ['Borrowings', '{{A.borrowings.1|num}}', '{{A.borrowings.3|num}}', '{{A.borrowings.4|num}}', '{{A.borrowings.5|num}}'],
      ['Cash and investments', '{{fin.liquidity.1|num}}', '{{fin.liquidity.3|num}}', '{{fin.liquidity.4|num}}', '{{fin.liquidity.5|num}}'],
      ['Total assets', '{{A.totalAssets.1|num}}', '{{A.totalAssets.3|num}}', '{{A.totalAssets.4|num}}', '{{A.totalAssets.5|num}}'],
      ['Borrowings ÷ equity (x)', '{{fin.debtEquity.1|n2}}', '{{fin.debtEquity.3|n2}}', '{{fin.debtEquity.4|n2}}', '{{fin.debtEquity.5|n2}}'],
      ['Equity ÷ AUM (%)', '{{fin.equityToAum.1|pct}}', '{{fin.equityToAum.3|pct}}', '{{fin.equityToAum.4|pct}}', '{{fin.equityToAum.5|pct}}'],
    ], source: SRC.co } },
    { pair: [
      { type: 'stacked', title: 'Equity jumped in FY26 (IPO); borrowings carry the growth', unit: '₹ \'000 crore at March', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'Borrowings', ref: 'fin.borrowings', scale: 0.001, fmt: 'num' }, { name: 'Net worth', ref: 'fin.netWorth', scale: 0.001, fmt: 'num' }], minLabel: 12, source: SRC.est },
      { type: 'line', title: 'Cash flow is negative by design: loans grow faster than profit', unit: 'Cash from operations (₹ crore)', x: 'A.labels', from: 'FY21', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }], labels: 'last', source: 'Screener.in cash flow (standalone)' },
    ] },
    { callout: '**Read this right:** a lender\'s operating cash flow is negative whenever its loan book grows, because new loans count as an operating outflow (FY22 was positive because the book shrank in Covid). What matters is whether equity keeps pace. HDB pays out ~13% of profit, so equity grows ~13-14% a year against AUM growth of 14-17% in our forecast: leverage edges up from {{fin.assetsToEquity.5|n2}}x assets to equity (FY26) to {{fin.assetsToEquity.8|n2}}x (FY29E), still below the 6.7-6.9x of FY24-FY25. No new equity is needed.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: HDFC Bank 74.1%, domestic funds 12%, foreign funds 3.6%; no forced sale',
  blocks: [
    { pair: [
      { type: 'column', title: 'HDFC Bank\'s stake: 94.3% before the IPO, 74.1% now', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoter', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 60, max: 80, lines: [{ v: 75, text: 'Ceiling for a 25% public float: 75%', color: '#b4232a' }], source: 'BSE shareholding pattern, Screener.in' },
      { type: 'line', title: 'Domestic funds hold three times what foreign funds do', unit: '% of shares', x: 'SH.periods', series: [{ name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'Public (retail and others)', ref: 'SH.rows.Public', fmt: 'pct' }, { name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials (lender format)',
  blocks: [
    { p: 'Screener\'s NBFC layout rebuilt into a lender income statement. Total income = interest income + fees and other income; fees and other income include BPO revenue from HDFC Bank (₹1,224 cr in FY26) and lending fees, charges and insurance commission (₹1,417 cr). Operating expenses include depreciation and the BPO business\'s costs (₹1,143 cr in FY26). Provisions = impairment on loans. Ratios are on AUM. FY21 fee split not available, so FY21 margin ratios are blank. Book value per share uses the shares in issue each year (79.5 cr before the Jun-2025 IPO, 83.0 cr after).' },
    { statement: { title: 'Lender P&L and balance sheet, FY21–FY29E', rows: [
      { key: 'aum', name: 'AUM (year-end)', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'sales', name: 'Total income' },
      { key: 'interest', name: 'Interest expense' },
      { key: 'nii', name: 'Net interest income', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'feeIncome', name: 'Fees & other income (incl. BPO revenue)' },
      { key: 'opex', name: 'Operating expenses (incl. depreciation and BPO costs)' },
      { key: 'ppop', name: 'Pre-provision operating profit' },
      { key: 'provisions', name: 'Loan losses & provisions', flag: { type: 'pct', th: 30 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹, Screener basis)', fmt: 'n2' },
      { key: 'bvps', name: 'Book value per share (₹)', fmt: 'n1' },
      { key: 'netWorth', name: 'Net worth', flag: { type: 'pct', th: 25 } },
      { key: 'borrowings', name: 'Borrowings' },
      { key: 'nim', name: 'NIM (NII ÷ average AUM) %', fmt: 'pct', flag: { type: 'bps', th: 30 } },
      { key: 'creditCost', name: 'Credit cost (provisions ÷ average AUM) %', fmt: 'n2', flag: { type: 'bps', th: 40 }, inverse: true },
      { key: 'roe', name: 'ROE %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
    ], source: 'Company (AUM, fees, provisions), Screener.in (standalone), GAM Research estimates FY27-29E' } },
    { statement: { quarterly: true, title: 'Quarterly P&L (Screener NBFC layout)', rows: [
      { key: 'sales', name: 'Total income', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'interest', name: 'Interest expense' },
      { key: 'expenses', name: 'Opex excl. depreciation + provisions', yoy: true, flag: { type: 'pct', th: 20 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, yoy: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
    ], source: 'Screener.in (standalone), company results' } },
  ],
};

module.exports = { financials, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'HDBFS.research.js')) ? require('./HDBFS.research') : null;
  const report = {
    symbol: 'HDBFS', listing: 'NSE: HDBFS · BSE: 544429', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Financials (NBFCs)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, balance, ownershipBase, statements }) : [financials, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
