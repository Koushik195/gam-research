// Authoring source for the Bharat Forge initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the
// attributable basis and FY26 EPS pro forma for the Sep-2026 QIP, see BHARATFORG.patch.js). Part B
// (BHARATFORG.research.js + part2-6, shared BHARATFORG.ctx.js) adds the research chapters. BHARATFORG.sync.js
// first writes the derived multiples into assumptions.json. Usage: node tools/authoring/BHARATFORG.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'BHARATFORG', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated; net profit after minorities), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'A decade of cycles: revenue 2.2x since FY16, EPS barely higher than in FY19',
  blocks: [
    { p: 'Consolidated revenue went from ₹6,809 cr in FY16 to ₹16,812 cr in FY26 (9.5% a year), but profit did not follow. EPS was ₹22.17 in FY19 and ₹22.58 in FY26: seven years with no net earnings growth. Three things ate the growth: (1) the overseas plants (Germany, Sweden, the US aluminium plants) added revenue but earned EBITDA margins of 0-4% and lost ₹330-470 cr a year before tax in FY24-FY26; (2) the e-mobility venture lost ₹67-138 cr a year at EBITDA before being written down; (3) exceptional charges in most years. The Indian forging business did well throughout: standalone EBITDA margins of 25-29%.' },
    { pair: [
      { type: 'column', title: 'Revenue: three down-cycles (FY16-17, FY20-21, FY25) in ten years', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: ₹1,032 cr in FY19, ₹1,080 cr in FY26', unit: 'Net profit after minorities (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'Consolidated EBITDA margin 13-21%: the group dilutes India\'s 27%', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 5, max: 25, source: SRC.co },
      { type: 'line', title: 'ROCE: 20% in FY19, 12-13% since FY24', unit: 'Return on capital employed (%), Screener basis', x: RL, from: 'FY16', series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 25, source: 'Screener.in' },
    ] },
    { callout: '**Our view:** Bharat Forge is two companies in one set of accounts. The Indian business (standalone forgings, defence, castings, axles) earned ₹2,758 cr of EBITDA on ₹11,308 cr of revenue in FY26 (24.4%). The overseas and e-mobility units earned ₹163 cr on ₹5,503 cr and lost ₹380 cr before tax (before exchange differences and exceptional items). The investment case is that the first keeps growing and the second stops losing money; the history says the second has repeatedly disappointed.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Capital-hungry: working capital ~28% of revenue, two QIPs in two years, ROCE stuck at 12-13%',
  blocks: [
    { p: 'Bharat Forge needs a lot of capital to grow. Inventories run at ~195 days and receivables ~85 days (FY26, Screener basis), so working capital is ~28% of revenue; every ₹1,000 cr of growth ties up ~₹280 cr of cash. Over FY21-FY26 the group generated ₹7,767 cr of operating cash flow and spent ₹8,073 cr on capex and acquisitions; free cash flow after dividends was negative and the gap was filled with debt and equity (₹1,650 cr QIP in Dec-2024, ₹2,000 cr QIP in Sep-2026). ROCE has been 8-13% since FY22, at or below the cost of capital.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow barely covers capex and acquisitions', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'Inventory ~195 days: the cost of a long export supply chain', unit: 'Days', x: RL, from: 'FY16', series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '2,820', '4,947', '7,767'],
      ['Capex (fixed assets purchased)', '2,978', '4,114', '7,092'],
      ['Acquisitions (JS Autocast, K Drive)', '482', '499', '981'],
      ['Dividends paid', '489', '1,182', '1,671'],
      ['Equity raised (QIP)', '–', '1,650', '1,650'],
    ], source: 'Screener.in cash flow (consolidated). The Sep-2026 QIP (₹2,000 cr) falls in FY27.' } },
    { callout: '**The capital question:** management is now spending ~₹1,800 cr of growth capex in 12-18 months and looking at Indian acquisitions, funded by the new QIP. The Indian bolt-ons have worked (JS Autocast was valued at 3.5-4x its cost when Premji Invest bought 23%); the overseas and EV bets did not. We would like to see the CDP exit lift group ROCE before more capital goes in.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net debt ~₹3,900-4,300 cr (0.4x equity), mostly working-capital lines; AA+ rated',
  blocks: [
    { p: 'At Jun-2026 the group had ₹2,152 cr of long-term debt and ₹4,845 cr of working-capital loans and bill discounting against ₹2,730 cr of cash and liquid investments: net debt ~₹4,267 cr, 0.45x equity and 1.4x EBITDA. Standalone Bharat Forge is almost net cash (0.18x). Since then the QIP has added ~₹2,000 cr of cash (Sep-2026), which the engine does not show (it starts from the Mar-2026 balance sheet). ICRA and CARE rate the company AA+ (Stable); ICRA reaffirmed on 22-Sep-2026.' },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (incl. JV stakes)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Company-basis cash (₹2,931 cr at Mar-26) includes bank balances held in other assets.' } },
    { pair: [
      { type: 'column', title: 'Borrowings rose with the overseas build-out; QIPs paid part down', unit: 'Borrowings incl. leases (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Gross debt to equity: 1.1x in FY23-24, 0.8x in FY26', unit: 'Gross debt ÷ net worth (x)', x: 'A.labels', from: 'FY17', series: [{ name: 'Debt / equity', ref: 'A.debtEquity', fmt: 'x' }], labels: 'all', source: SRC.co },
    ] },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Kalyani family at 44%, Indian funds 32%, foreign funds 15%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Indian institutions bought, foreign funds sold (2024-26)', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters 45.3% to 44.1% after the Dec-2024 QIP', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 35, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (after exceptional items)' },
      { key: 'interest', name: 'Interest' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (after minorities)', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (after exceptional items)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./BHARATFORG.sync').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'BHARATFORG.research.js')) ? require('./BHARATFORG.research') : null;
  const report = {
    symbol: 'BHARATFORG', listing: 'NSE: BHARATFORG · BSE: 500493', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Auto Components & Defence',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
