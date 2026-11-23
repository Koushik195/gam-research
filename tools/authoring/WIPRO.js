// Authoring source for the Wipro initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the attributable
// basis and FY26 pro-forma for the June-2026 buyback via WIPRO.patch.js). Part B (WIPRO.research.js + part2-4,
// shared WIPRO.ctx.js) adds the research chapters. Usage: node tools/authoring/WIPRO.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'WIPRO', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated, Ind AS; profit attributable to shareholders), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'A decade of 6% rupee growth, mostly from the rupee and acquisitions; dollar revenue has shrunk for three years',
  blocks: [
    { p: 'Wipro\'s revenue grew from ₹51,244 cr in FY16 to ₹92,624 cr in FY26, about 6.1% a year, and profit attributable to shareholders from ₹8,908 cr to ₹13,197 cr, about 4.0% a year. Most of the rupee growth came from two sources that are not organic demand: acquisitions (Capco and others lifted FY22 revenue 28%) and a weaker rupee (₹65-70 per dollar in FY17-20, ₹87.9 in FY26). In dollars, IT Services revenue peaked at $11.23 bn in FY23 and has fallen every year since, to $10.48 bn in FY26: −4.4%, −2.3% and −1.6% in constant currency. EPS (adjusted for the 2024 bonus) went from ₹9.85 in FY21 to ₹12.58 in FY26, 5% a year, helped by three buybacks.' },
    { pair: [
      { type: 'column', title: 'Rupee revenue: 6% a year, flat between FY23 and FY25', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'ends', source: SRC.co },
      { type: 'column', title: 'Dollar revenue peaked in FY23 and has fallen since', unit: 'IT Services revenue ($ million)', x: ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'IT Services revenue', values: [8120, 8256, 8137, 10454, 11234, 10805, 10512, 10478], fmt: 'num' }], labels: 'all', source: 'Wipro Q1FY27 investor presentation (p.5)' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 24% in the FY21 boom, ~19% since FY23', unit: 'EBITDA margin (%, Screener basis, before other income)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 14, max: 26, source: SRC.co },
      { type: 'column', title: 'Profit grew 4% a year; FY26 was flat', unit: 'Net profit attributable to shareholders (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'ends', source: SRC.co },
    ] },
    { callout: '**Our view:** Wipro\'s accounts look stable (EBITDA margin 19-20%, profit up a little each year) only because three things have offset falling dollar revenue: a cheaper rupee, cost cuts (employee cost fell from 61% to 60% of revenue) and buybacks. None of these is growth. The business has not grown organically since FY23, and FY27 will be the fourth year in a row of falling organic dollar revenue on our numbers.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'Capital allocation: generous returns, mixed acquisitions',
  blocks: [
    { p: 'Wipro is a cash machine: operating cash flow was ₹17,622 cr in FY24, ₹16,943 cr in FY25 and ₹14,932 cr in FY26 (113% of profit), against capex of only ₹1,000-1,600 cr a year. Most of that cash goes back to shareholders. Since FY20 Wipro has run four tender buybacks (₹10,500 cr in 2019, ₹9,500 cr in 2020-21, ₹12,000 cr in 2023 and ₹15,000 cr in June 2026) and raised dividends to ₹11 a share in FY26. Its policy since FY26 is to return at least 70% of net income over three years; it returned ~88% over FY24-26. The promoter group, which owns ~72.6%, receives most of it: it tendered ~42.8 cr shares (~₹10,700 cr) into the 2026 buyback.' },
    { pair: [
      { type: 'column', title: 'Cash from operations dwarfs capex', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 27% in FY15, 18% in FY26', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went, FY21-FY27 (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'FY27 so far'], rows: [
      ['Cash from operations', '38,895', '49,497', '3,288 (Q1)'],
      ['Capex (fixed assets purchased)', '5,456', '4,115', '338 (Q1)'],
      ['Dividends paid', '4,583', '18,407', 'Interim ₹2 declared (Jul-2026)'],
      ['Buybacks (incl. tax and costs)', '~9,500 (FY21)', '14,647 (FY24)', '15,000 (Jun-2026)'],
      ['Acquisitions', 'Capco and others (FY22)', 'AVT ₹284 cr; DTS ₹3,404 cr', 'Mindsprint, Alpha Net, Aggne: ~$474 mn'],
      { hl: true, cells: ['**Memo: gross cash and investments at the end**', '₹{{A.cashAndInvestments.8|num}} cr (Mar-23)', '₹57,342 cr (Mar-26)', '$4.3 bn (Jun-26)'] },
    ], source: 'Screener.in cash flow (consolidated); AR FY26; Q1FY27 press release. FY21 buyback value = 23.75 cr shares × ₹400. Mar-26 memo is reported (before the pro-forma buyback adjustment).' } },
    { callout: '**The capital question:** returning cash is the right call for a business that does not need it, and buying back stock at ₹250 (~20x FY26 EPS, a ~22% premium to the ~₹204 price in the week it was announced) looks expensive with hindsight: the stock was ₹158.50 on 30 September. The weaker record is acquisitions: Capco has not turned Wipro\'s BFSI business into a grower, and FY27\'s growth depends on DTS and Mindsprint. We model no further buybacks or acquisitions, ~₹8 of dividends in FY27 and a 70% payout after that.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash fell by half after the buyback but is still ~₹21,400 cr',
  blocks: [
    { p: 'At Mar-2026 Wipro held ₹57,342 cr of cash and investments (mostly Indian corporate bonds, mutual funds and deposits, plus ~₹2,160 cr of start-up stakes) against ₹20,291 cr of borrowings and leases, so net cash was ₹37,051 cr on Screener\'s basis. In June it paid ₹15,000 cr for the buyback and ~$474 mn for Mindsprint and two smaller deals; net cash was ₹21,420 cr at Jun-2026 (company balance sheet, same basis). Borrowings are short-term loans that fund working capital and hedging (the $750 mn bond due Jun-2026 was refinanced). Receivable days rose from 47 (FY24) to 54 (FY26), which is why cash conversion fell from 159% of profit in FY24 to 113%.' },
    { pair: [
      { type: 'line', title: 'Receivable days crept up in FY26', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }], labels: 'all', min: 30, max: 80, source: 'Screener.in' },
      { type: 'column', title: 'Cash and investments: pro-forma ₹37,907 cr at Mar-26', unit: 'Cash and investments (₹ crore; FY26 pro-forma for the buyback and acquisitions)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26 pro-forma'], rows: [
      ['Net worth (excl. minorities)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets (incl. ~₹38,700 cr goodwill)', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Trade receivables', '{{A.receivables.8|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.8|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Mar-26 is pro-forma: reported net worth ₹88,019 cr and investments ₹46,786 cr, less the ₹15,000 cr buyback and ₹4,435 cr of acquisitions (shown in CWIP); see WIPRO.patch.js.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Premji family controls 72.6%; domestic funds sold in 2026',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions fell to 5.2% in Jun-2026', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'Public', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at ~72.6%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 10 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'otherIncome', name: 'Other income (treasury, FX; incl. exceptional items)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 12 } },
      { key: 'eps', name: 'EPS (₹; FY26 pro-forma)', fmt: 'n2' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 8 }, hl: true },
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
  const B = fs.existsSync(path.join(__dirname, 'WIPRO.research.js')) ? require('./WIPRO.research') : null;
  const report = {
    symbol: 'WIPRO', listing: 'NSE: WIPRO · BSE: 507685 · NYSE: WIT', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — IT Services',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
