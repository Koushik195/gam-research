// Authoring source for the Linde India Ltd initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated) and the main writer.
// Part B (LINDEINDIA.research.js + part2-6, shared inputs in LINDEINDIA.ctx.js) adds business, history,
// industry, segments, the parent and Praxair India, moat, earnings quality, ownership, governance,
// forecasts, street, valuation and verdict chapters.
// Note on periods: Dec16-Dec21 are calendar years; FY23 is a 15-month period (Jan-2022 to Mar-2023);
// FY24 onwards April-March. Usage: node tools/authoring/LINDEINDIA.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'LINDEINDIA', 'research');
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
// Screener labels the 15-month FY23 column 'Mar 2023 15m' in the P&L but 'Mar 2023' elsewhere; GAM relabelled the other
// tables in screener.json to match (see its _gamNote). These two charts read the raw tables to label FY23 as 15 months.
const RAW = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables;
const BSY = ['Dec 2019', 'Dec 2020', 'Dec 2021', 'Mar 2023 15m', 'Mar 2024', 'Mar 2025', 'Mar 2026'], BSL = ['Dec19', 'Dec20', 'Dec21', 'FY23 (15m)', 'FY24', 'FY25', 'FY26'];
const raw = (t, r) => BSY.map(p => RAW[t].rows[r][RAW[t].periods.indexOf(p)]);
const SCH = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).schedules;
const cash = BSY.map(p => SCH['balance-sheet']['Other Assets']['Cash Equivalents'][p]);
const capexRaw = BSY.map(p => -SCH['cash-flow']['Cash from Investing Activity']['Fixed assets purchased'][p]);

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Flat revenue since FY24, higher margins, and a FY26 profit flattered by one-offs',
  blocks: [
    { p: 'Linde India\'s revenue was ₹2,769 cr in FY24, ₹2,485 cr in FY25 and ₹2,531 cr in FY26 (FY23 was a 15-month year, so it looks bigger). The FY25 fall was all Project Engineering, whose external revenue dropped from ₹768 cr to ₹445 cr; Gases grew only 2% and 4% a year, partly because on-site power costs, which are passed through to customers, fell. Margins rose a lot: EBITDA margin was 25% in FY24, 31% in FY25 and 36% in FY26, as merchant liquid gas sold well and fewer low-margin projects went through the P&L. But FY26 profit of ₹549 cr (+21%) includes a ₹90 cr reversal of liabilities and a ~₹49 cr one-off from a joint venture being wound up; without them profit was ~₹444 cr, roughly the ₹449 cr of FY25 before exceptional items.' },
    { pair: [
      { type: 'column', title: 'Revenue: no growth since FY24 (FY23 = 15 months)', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'Dec18', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'EBITDA margin: 15% in CY18, 36% in FY26 (32% without the one-off)', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'Dec18', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 40, source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Net profit: FY26 includes ~₹105 cr of one-offs after tax', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'Dec18', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'ROE 12-14%, falling below 10% as new plants add capital first', unit: 'Return on equity (%)', x: 'fin.labels', from: 'Dec21', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: SRC.co },
    ] },
    { callout: '**Our view:** this is a good-quality, contract-backed business whose profits have barely grown since FY23 (EPS ₹50.9 in FY24, ₹53.3 in FY25, ~₹52 underlying in FY26). Margins are now high, so the next leg must come from volume: the new on-site plants for Tata Steel, SAIL, JSL and Electrosteel. Those plants add depreciation and interest before they add much profit, which is why our FY27E EPS falls.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'From ₹980 cr of cash to borrowing again: two years of heavy capex used up the cash pile',
  blocks: [
    { p: 'After selling its South Region business to Air Water India in 2019 (₹1,380 cr) and repaying all debt, Linde India built up cash: ₹980 cr at Mar-2024. Then the capex cycle started: cash capex was ₹572 cr in FY24, ₹1,331 cr in FY25 and ₹766 cr in FY26, against operating cash flow of ₹437 cr, ₹584 cr and ₹786 cr. Cash fell to ₹147 cr (Mar-2025) and ₹112 cr (Mar-2026); capital work in progress rose to ₹1,343 cr, and ₹755 cr of advances had been paid for plants still to be delivered (capital commitments ₹695 cr on top). The company had no bank debt at Mar-2026, only ₹79 cr of lease liabilities. In Q1FY27 finance cost doubled from the March quarter and unallocated liabilities rose by ~₹568 cr; the company did not say why, but borrowing to fund capex is the likely reason.' },
    { pair: [
      { type: 'column', title: 'Capex has run ahead of operating cash flow since FY24', unit: '₹ crore', x: BSL, series: [{ name: 'Cash from operations', values: raw('cash-flow', 'Cash from Operating Activity'), fmt: 'num' }, { name: 'Capex', values: capexRaw, fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Cash ran down as plants under construction piled up', unit: '₹ crore (year end)', x: BSL, series: [{ name: 'Cash', values: cash, fmt: 'num' }, { name: 'Capital work in progress', values: raw('balance-sheet', 'CWIP'), fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Dec-21', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.5|num}}', '{{A.netWorth.7|num}}', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}'],
      ['Borrowings (lease liabilities only)', '{{A.borrowings.5|num}}', '{{A.borrowings.7|num}}', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}'],
      ['Cash and bank', '{{A.cash.5|num}}', '{{A.cash.7|num}}', '{{A.cash.8|num}}', '{{A.cash.9|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}'],
      ['Capital work in progress', '{{A.cwip.5|num}}', '{{A.cwip.7|num}}', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}'],
      ['Trade receivables', '{{A.receivables.5|num}}', '{{A.receivables.7|num}}', '{{A.receivables.8|num}}', '{{A.receivables.9|num}}'],
      ['Advances from customers', '{{A.customerAdvances.5|num}}', '{{A.customerAdvances.7|num}}', '{{A.customerAdvances.8|num}}', '{{A.customerAdvances.9|num}}'],
      ['Trade payables', '{{A.payables.5|num}}', '{{A.payables.7|num}}', '{{A.payables.8|num}}', '{{A.payables.9|num}}'],
    ], source: SRC.co } },
    { callout: '**Two notes on the model.** (1) The forecast "cash & investments" row is net cash: it includes the ₹82 cr of shares in renewable-power suppliers and subtracts lease liabilities, and it turns negative (net debt) from FY27E. (2) The engine sets working capital at a fixed 28% of revenue because the balance sheet\'s "other assets" include the ₹755 cr of capital advances; the real operating working capital is negative (customer advances and payables exceed receivables and stock). This makes our forecast net debt and the DCF a little too gloomy, by about ₹200 a share in the DCF; it does not affect earnings or the P/E target.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital allocation & returns', kicker: 'Returns', title: 'Capital allocation: ₹2,100 cr into new plants in two years, a flat ₹12 dividend, and returns heading below the cost of capital',
  blocks: [
    { p: 'Gross block including work in progress rose from ₹3,757 cr at Mar-2024 to ₹5,322 cr at Mar-2026 (+42%), while EBITDA excluding one-offs rose from ₹702 cr (FY24) to ~₹819 cr (FY26, +17%). New on-site plants take 18-30 months to build and earn their fixed fees only once commissioned, so returns dip before they recover. The dividend has been ₹12 a share (₹102 cr) for four years, including a special dividend each year: 19-23% of profit, the rest reinvested. ROE (Screener basis) was 12.5% in FY24-25 and 13.6% in FY26, against our 11.6% cost of equity; on our numbers it falls to ~10% in FY27-29E.' },
    { pair: [
      { type: 'column', title: 'Capex was 3-6x depreciation in FY24-26', unit: '₹ crore', x: 'fin.labels', from: 'FY24', to: 'FY29E', series: [{ name: 'Capex', ref: 'fin.capex', fmt: 'num' }, { name: 'Depreciation', ref: 'fin.dep', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'column', title: 'Dividend held at ₹12 while EPS moved', unit: '₹ per share', x: ['Dec21', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'EPS', values: [59.47, 63.09, 50.9, 53.33, 64.37], fmt: 'n1' }, { name: 'Dividend', values: [13.5, 12, 12, 12, 12], fmt: 'n1' }], labels: 'all', source: 'Screener.in; annual report ten-year data (FY23 = 15 months)' },
    ] },
    { callout: '**So what:** management is reinvesting ~80% of profit at returns that are, for now, below the cost of equity. That is normal early in a plant cycle, and on-site contracts make the eventual returns fairly predictable, but the company does not disclose project costs or expected returns, so shareholders are asked to take them on trust.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: 75% Linde plc, 6-7% Indian institutions, a thin and angry float',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs ~7%; FIIs ~2%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter fixed at the 75% maximum', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoter', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Columns Dec16-Dec21 are calendar years; FY23 covers 15 months (Jan-2022 to Mar-2023), so its growth rates and the FY24 decline are not like-for-like.' },
    { statement: { title: 'Profit & loss, CY16–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, balance, capital, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'LINDEINDIA.research.js')) ? require('./LINDEINDIA.research') : null;
  const report = {
    symbol: 'LINDEINDIA', listing: 'NSE: LINDEINDIA · BSE: 523457', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Chemicals & Industrials',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, balance, capital, ownershipBase, statements }) : [financials, balance, capital, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
