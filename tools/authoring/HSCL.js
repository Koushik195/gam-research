// Authoring source for the Himadri Speciality Chemical (HSCL) initiating-coverage report, as of 30-Sep-2026.
// Part A (this file): chapters built on reported financials (Screener, consolidated).
// Part B (HSCL.research.js, merging HSCL.part2-4.js) adds business, history, industry, segments, battery materials,
// tyres, moat, earnings quality, ownership, governance, forecasts, street, valuation and verdict chapters.
// Usage: node tools/authoring/HSCL.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'HSCL', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k];
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Flat revenue, five-fold profit: FY22-26 was a margin story',
  blocks: [
    { p: 'Himadri\'s numbers fall into two eras. Until FY22 it was a coal tar processor with thin, volatile margins: in FY21-22 raw-material costs ran ahead of prices, the EBITDA margin fell to 6% and net profit to ₹39 cr. Since then revenue has gone up only 67% (₹2,791 cr to ₹4,661 cr, and almost flat from FY23 to FY26), but EBITDA rose six-fold and net profit nearly twenty-fold to ₹755 cr. The driver was EBITDA per tonne: about ₹4,400 in FY22, ₹17,300 in FY26 and ~₹23,700 in Q1FY27, as more of the coal tar went into speciality carbon black, high-grade pitch and oils, and costs came down. Q1FY27 revenue rose 28% (₹1,432 cr) and net profit 27% (₹228 cr), the first quarter with real top-line growth.' },
    { pair: [
      { type: 'column', title: 'Revenue: almost flat from FY23 to FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: ₹39 cr to ₹755 cr in four years', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 6% in FY22, 21% in FY26', unit: 'EBITDA margin (%, after forex)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: 'Screener.in (annual accounts basis: forex inside expenses)' },
      { type: 'column', title: 'Other income jumped to ₹171 cr in FY26', unit: 'Other income (₹ crore)', x: 'A.labels', from: 'FY20', series: [{ name: 'Other income', ref: 'A.otherIncome', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** the improvement is real and has lasted four years, but it came mostly from margin, not volume (standalone volume +52% since FY22, +2% in FY26). FY26 profit also had help from other income of ₹171 cr, of which ₹100 cr was a fair-value gain on start-up investments. From FY27 growth must come from new capacity: speciality black, pitch exports, anthraquinone, tyres and, later, battery materials.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Lean capex until FY25; now the biggest investment cycle in its history',
  blocks: [
    { p: 'For four years Himadri spent little on plants: capex was ₹23-171 cr a year in FY22-25, so most of the ₹1,619 cr of operating cash in FY22-26 went to paying down debt and building cash. That changed in FY26 (capex ₹450 cr, the 70 kt speciality black line) and changes more in FY27-28: management plans ~₹1,000 cr of capex in each year (LFP ₹1,125 cr, tyres ~₹500 cr, CNT, SSCB, anthraquinone). The other big use of cash has been investments outside the plant: ₹1,029 cr of investments bought in FY24-26, mainly Dalmia Bharat Refractories NCDs that fund the Birla Tyres plant (₹487 cr at Mar-26), IBC, Sicona and mutual funds. Returns are good: Screener ROCE 22%, the company\'s own figure 32% (it leaves out investments and CWIP).' },
    { pair: [
      { type: 'column', title: 'Capex was tiny until FY26', unit: '₹ crore', x: 'A.labels', from: 'FY22', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'ROCE: 5% in FY22, 22% since FY25', unit: 'Return on capital employed (%)', x: RL.slice(-5), series: [{ name: 'ROCE', values: RR('ROCE %').slice(-5), fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went, FY22-26 (₹ crore)', head: ['', 'FY22-23', 'FY24-26', 'Five years'], rows: [
      ['Cash from operations', '385', '1,234', '1,619'],
      ['Capex', '106', '674', '780'],
      ['Free cash flow', '279', '560', '839'],
      ['Investments bought, net (NCDs, IBC, Sicona, funds)', 'n.m.', '891', '891'],
      ['Warrant money received (₹316 a share)', '–', '342', '342'],
      ['Dividends paid', '14', '66', '80'],
      { hl: true, cells: ['**Borrowings at the end (₹770 cr at Mar-26)**', '', '', ''] },
    ], source: 'Screener.in cash flow (investments bought FY24-26: ₹422 + 98 + 509 cr less ₹138 cr sold), FY26 annual report' } },
    { callout: '**Where it went right and wrong:** the speciality carbon black and pitch investments paid back quickly: EBITDA per tonne quadrupled. The open question is the next ₹2,000 cr. Batteries (₹1,245 cr committed to LFP and anode) have no orders yet, and tyres have absorbed ~₹490 cr of NCD funding plus ~₹500 cr of planned capex for ₹187 cr of FY26 revenue at about break-even. On our numbers ROE slips from 18% to ~16% in FY28E while that capital ramps up.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash, but less of it than the headline suggests',
  blocks: [
    { p: 'The company reported net cash of ₹121 cr at March 2026 (₹113 cr in the July deck), down from ~₹390 cr a year earlier despite record profit. Screener\'s cash and investments (₹1,795 cr) less borrowings (₹770 cr) gives ₹1,025 cr, but ~₹860 cr of that is long-term investments that cannot pay for capex: DBRL NCDs and preference shares (the Birla Tyres funding), ₹183 cr of preference shares in the promoter holding company Modern Hi-Rise, and the IBC and Sicona stakes. Borrowings rose from ₹313 cr to ₹770 cr: management uses its bank lines and commercial paper and parks the money in deposits for a spread. Working capital rose too: inventory days went from 68 to 96 in FY26. With ~₹2,000 cr of capex in FY27-28, we expect free cash flow to be negative for two years.' },
    { pair: [
      { type: 'line', title: 'Inventory days back up to 96', unit: 'Days (Screener basis)', x: RL.slice(-5), series: [{ name: 'Inventory days', values: RR('Inventory Days').slice(-5), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days').slice(-5), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Borrowings more than doubled in FY26', unit: 'Borrowings (₹ crore)', x: 'A.labels', from: 'FY22', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (incl. strategic and tyre-funding investments)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net debt (negative = net cash), Screener basis', '{{A.netDebt.7|num}}', '{{A.netDebt.9|num}}', '{{A.netDebt.10|num}}', '{{A.netDebt.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
    ], source: SRC.co + '. Company-defined net cash at Mar-26: ₹121 cr' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Choudhary family holds 52.5%; institutions barely 10%',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs up to 6.8%; domestic funds only 3.3%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter stake up from 44.8% to 52.5%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 55, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (after forex)' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'interest', name: 'Interest' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'HSCL.research.js')) ? require('./HSCL.research') : null;
  const report = {
    symbol: 'HSCL', listing: 'NSE: HSCL · BSE: 500184', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Chemicals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
