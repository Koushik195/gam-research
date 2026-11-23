// Authoring source for the Infosys initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the attributable
// basis via INFY.patch.js). Part B (INFY.research.js + part2-4b, shared INFY.ctx.js) adds the research chapters.
// Usage: node tools/authoring/INFY.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'INFY', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated; profit attributable to shareholders), GAM Research' };
const SG = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8'));
const SA = SG.annual;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'A decade of 11% rupee growth; since FY23 the dollar engine has slowed to ~3% a year',
  blocks: [
    { p: 'Infosys\'s revenue grew from ₹62,441 cr in FY16 to ₹1,78,650 cr in FY26, about 11% a year, and profit attributable to shareholders from ₹13,489 cr to ₹29,440 cr, about 8% a year. In dollars the story has two halves. FY21-23 was the post-Covid digital boom: US$ revenue rose from US$12.8 bn (FY20) to US$18.2 bn (FY23), 12.5% a year. Since then growth has been 1.9% (FY24), 3.9% (FY25) and 4.6% (FY26), about 3.4% a year, and in FY26 almost all of it came from price, not volume. A weaker rupee did much of the work in rupee terms: Infosys converted each dollar at ₹71 in FY20 and ₹88.6 in FY26.' },
    { pair: [
      { type: 'column', title: 'US$ revenue: boom to FY23, ~3% a year since', unit: 'Revenue (US$ mn)', x: SA.map(a => a.fy), series: [{ name: 'US$ revenue', values: SA.map(a => a.usdRev), fmt: 'num' }], labels: 'all', source: 'Infosys fact sheets' },
      { type: 'column', title: 'Rupee revenue grew faster: the rupee fell from ₹71 to ₹88.6 per dollar', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'ends', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'Constant-currency growth: 20% in FY22, ~3% now', unit: 'Revenue growth in constant currency (%)', x: SA.map(a => a.fy), series: [{ name: 'CC growth', values: SA.map(a => a.ccGrowthPct), fmt: 'pct' }], labels: 'all', min: 0, source: 'Infosys fact sheets' },
      { type: 'line', title: 'Operating (EBIT) margin: 24.5% in FY21, ~21% for four years', unit: 'Company operating margin (%), FY26 adjusted for the Labour Codes charge', x: SA.map(a => a.fy), series: [{ name: 'EBIT margin', values: SA.map(a => a.opMarginAdjPct), fmt: 'pct' }], labels: 'all', min: 15, max: 27, source: 'Infosys fact sheets' },
    ] },
    { pair: [
      { type: 'column', title: 'Profit has compounded at ~8% a year', unit: 'Net profit attributable to shareholders (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'ends', source: SRC.co },
      { type: 'line', title: 'EBITDA margin (Screener basis) drifted from 28% to ~24%', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 15, max: 32, source: SRC.co },
    ] },
    { callout: '**Our view:** Infosys is a mature, very profitable business that has stopped growing in real terms. The FY22-23 boom was a one-off catch-up in digital spending; since then volumes are flat and the company grows by raising prices, buying small firms and riding a weaker rupee. Margins have been remarkably stable at ~21% EBIT through the boom, the wage spike and the slump. That stability, plus cash conversion above 100%, is what the shares rest on now - not growth.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'Almost all the cash goes back to shareholders: ₹1.3 lakh cr in six years',
  blocks: [
    { p: 'Infosys needs little capital: capex is ~1.5% of revenue and working capital grows slowly. Over FY21-26 it generated ₹1,64,466 cr of operating cash and spent ₹14,012 cr on capex. It returned ₹89,197 cr in dividends and ~₹41,000 cr through three buybacks (FY22, FY23 and the ₹18,000 cr tender at ₹1,800 in Dec-2025). The policy since FY25 is to return ~85% of free cash flow over five years through dividends and buybacks and to raise the dividend every year; FY25-26 returned 82.1%. Acquisitions are small and frequent (four in the last 18 months, the largest up to US$465 mn).' },
    { pair: [
      { type: 'column', title: 'Cash from operations dwarfs capex', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'column', title: 'Dividends paid have doubled since FY21', unit: 'Dividends paid (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Dividends paid', ref: 'A.dividendsPaid', fmt: 'num' }], labels: 'all', source: 'Screener.in cash flow' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went, FY21-26 (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '69,576', '94,890', '1,64,466'],
      ['Capex', '6,847', '7,165', '14,012'],
      ['Dividends paid', '35,521', '53,676', '89,197'],
      ['Buybacks (cash outflow incl. taxes and costs)', '22,863', '18,308', '41,171'],
      ['Other investing outflows, net (incl. acquisitions)', '4,893', '6,822', '11,715'],
      { hl: true, cells: ['**Left over (before investment flows and FX)**', '**−548**', '**8,919**', '**8,371**'] },
      ['Memo: cash and investments at year-end (company definition)', '31,286 (Mar-23)', '43,075 (Mar-26)', ''],
    ], source: 'Screener.in cash flow (consolidated; buybacks = "other financing items" in FY22, FY23, FY26); Infosys fact sheets for cash and investments' } },
    { callout: '**The capital question:** the policy is shareholder-friendly and has been followed. The question for the next five years is not how much cash comes back but what Infosys buys: management says it has "a good pipeline" of acquisitions in healthcare, telecom, financial services and AI-led service lines, and has decided not to invest in data centres. Small, bolt-on deals at ~1-2% of revenue a year are fine; a large AI acquisition at a high price would be the risk. Our model keeps dividends at ~68% of profit and lets the rest (the buyback share of the policy) build up as cash earning ~6.7%.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Debt-free, ₹43,075 cr of cash and investments, receivables the only big asset',
  blocks: [
    { p: 'Infosys has no financial debt; its only borrowings are ₹9,176 cr of lease liabilities (offices). At Mar-2026 it held ₹43,075 cr of cash and investments on the company\'s definition (₹22,201 cr of cash and ₹21,880 cr of investments on Screener\'s, which also includes ~₹1,000 cr of strategic equity stakes), down from ₹54,809 cr in Sep-2025 because of the ₹18,000 cr buyback. By Jun-2026 it was ₹37,065 cr after the ₹25 final dividend (₹10,117 cr) and the Optimum and Stratus acquisitions. Trade receivables (₹35,234 cr) and unbilled revenue are the big operating assets; DSO fell to 63 days in Q1FY27, the lowest in years.' },
    { pair: [
      { type: 'line', title: 'Receivable days: ~65-75 for a decade', unit: 'Debtor days (Screener basis)', x: RL, series: [{ name: 'Debtor days', values: RR('Debtor Days'), fmt: 'num' }], labels: 'last', min: 50, max: 80, source: 'Screener.in' },
      { type: 'column', title: 'Cash and investments rebuilt after each buyback', unit: 'Cash and investments, company definition (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'Cash and investments', values: SA.map(a => a.cashInvCr), fmt: 'num' }], labels: 'all', source: 'Infosys fact sheets' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (excl. minorities)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (all lease liabilities)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (Screener basis)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets (incl. goodwill and leased offices)', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Minorities (₹445 cr at Mar-26) are in other liabilities on Screener.' } },
    { callout: '**So what:** the balance sheet is a cushion, not a growth engine. Net cash (after leases) of ~₹34,900 cr at Mar-26 is ~9% of the market value at the 30-Sep-2026 price, and the hedge book (₹38,021 cr of forwards and options, 97% maturing within three months) means currency moves reach the P&L quickly.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: domestic institutions now own 43%, foreign funds have sold down to 27%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Indian institutions up from 36% to 43%; foreign funds down from 34% to 27%', unit: '% of shares (excl. ADRs)', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Founder families: 13.8% after the Jun-2026 reclassification', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 10, max: 16, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'otherIncome', name: 'Other income (Screener: incl. exceptional items)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 12 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex (FY27E incl. ~₹4,400 cr acquisitions)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'INFY.research.js')) ? require('./INFY.research') : null;
  const report = {
    symbol: 'INFY', listing: 'NSE: INFY · BSE: 500209 · NYSE: INFY', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — IT Services',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
