// Authoring source for the HCL Technologies initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the attributable
// basis via HCLTECH.patch.js). Part B (HCLTECH.research.js + part2-5, shared HCLTECH.ctx.js) adds the research
// chapters. Usage: node tools/authoring/HCLTECH.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'HCLTECH', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar \d{4}$/.test(p) && +p.slice(-4) >= 2017 && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated; profit attributable to shareholders), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'A decade of double-digit rupee growth; EPS has slowed to ~4% a year since FY23',
  blocks: [
    { p: 'HCLTech\'s revenue grew from ₹47,568 cr in FY17 to ₹1,30,144 cr in FY26, about 11.8% a year, helped by the IBM software purchase (2019), steady acquisitions and a weaker rupee. Profit attributable to shareholders went from ₹8,606 cr to ₹16,642 cr (7.6% a year). The last three years were slower: revenue grew 8.7% a year in rupees but only ~5% in dollars (FY24 +5.4%, FY25 +4.7%, FY26 +3.9% in constant currency), and EPS rose from ₹54.7 (FY23) to ₹61.3 (FY26), 3.9% a year. FY26 carried a ₹956 cr one-time charge for India\'s new Labour Codes and ~65 bp of restructuring; before them EPS was ₹64.0.' },
    { pair: [
      { type: 'column', title: 'Revenue: 11.8% a year in rupees since FY17', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'ends', source: SRC.co },
      { type: 'column', title: 'EPS: steady climb, but flat in FY26 (Labour Codes charge)', unit: 'EPS (₹, attributable; adjusted for the 2019 bonus)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin peaked at 26.6% in FY21 and has slid to 20.6%', unit: 'EBITDA margin (%), Screener basis', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 15, max: 30, source: SRC.co },
      { type: 'line', title: 'People cost rose from 48% to 57% of revenue', unit: 'Employee cost (% of revenue)', x: 'A.labels', from: 'FY17', series: [{ name: 'Employee cost', ref: 'A.employeePct', fmt: 'pct0' }], labels: 'all', min: 40, max: 60, source: 'Screener.in' },
    ] },
    { callout: '**Our view:** HCLTech has been the fastest-growing tier-1 Indian IT company for three years, but that growth has not reached EPS: margins slipped (FY21 was a Covid-era peak, wages and sub-contracting rose, software margins swing), and the rupee did much of the work. In dollars and constant currency, this is now a 3-4% grower. The FY27 EPS jump we forecast (+18%) is mostly the rupee (₹95.5 per US$ vs ₹88.7 in FY26) and the absence of FY26\'s one-offs, not faster business growth.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'Almost all the cash goes back to shareholders; the new bets are AI start-ups and data centres',
  blocks: [
    { p: 'HCLTech needs little capital: capex was ₹1,048-1,661 cr a year in FY22-26 (about 1-2% of revenue). Since FY22 a formal policy returns at least 75% of net income; the company actually paid out 89.9% over FY22-26 (US$8.5 bn) and extended the policy for five more years in April 2026. Return on capital employed was 30% in FY26 (Screener) and the company\'s own ROIC 40.3% (Services 47%). What changed in FY27 is the use of the remaining cash: a US$150 m stake in Sarvam AI, Jaspersoft (US$240 m) and HPE Telco Solutions (~₹1,400 cr), and an AI data-centre business with up to ₹3,500 cr of initial investment.' },
    { pair: [
      { type: 'column', title: 'Cash from operations dwarfs capex', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'column', title: 'Dividends jumped after the FY22 payout policy', unit: 'Dividends paid (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Dividends paid', ref: 'A.dividendsPaid', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '54,527', '64,684', '1,19,211'],
      ['Capex', '5,210', '3,578', '8,788'],
      ['Dividends paid', '27,642', '44,941', '72,583'],
      { hl: true, cells: ['**Left over (for acquisitions, buybacks of RSU shares, debt repayment, cash build)**', '**21,675**', '**16,165**', '**37,840**'] },
      ['Memo: cash and investments at the end (Screener basis, excl. long-term deposits)', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.11|num}}', ''],
    ], source: 'Screener.in cash flow (consolidated). FY21 included Rs6,488 cr of deferred consideration for the IBM software products (financing/investing).' } },
    { callout: '**The capital question:** the dividend is secure: FY27E free cash flow before the one-off investments is ~₹20,000 cr against ~₹17,700 cr of dividends at a 90% payout. The data-centre plan is the risk to watch. Management says ₹3,500 cr is only "a fraction" of the 50 MW ambition, to be funded partly by partners, client commitments and debt, "not at the expense of our stated payout policy". An analyst on the July call put a full-stack 50 MW build at ~₹30,000 cr; the CEO agreed with the economics but not the plan to fund it alone. We model ₹3,500 cr over FY27-29.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ₹33,000 cr at Mar-26, ₹26,900 cr after the June dividend and Sarvam',
  blocks: [
    { p: 'HCLTech has no meaningful debt. At Mar-2026 it held ₹33,447 cr of gross cash (cash ₹8,265 cr, deposits ₹18,222 cr, investment securities ₹6,960 cr) against ₹159 cr of borrowings, so net cash was ₹33,288 cr (company basis); lease liabilities of ₹5,056 cr are the only other debt-like item. By Jun-2026 net cash was ₹26,907 cr after paying the ₹24 final dividend (₹6,492 cr) and investing ₹1,427 cr in Sarvam. Receivables are the main use of working capital: 88 days of revenue at Mar-26 on Screener\'s basis (DSO 61 days billed, 84-86 days including unbilled), up from 81 days a year earlier.' },
    { pair: [
      { type: 'column', title: 'Cash and investments (Screener basis) rose to ₹30,515 cr', unit: '₹ crore; excludes ₹3,012 cr of long-term and inter-corporate deposits', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Receivable days: 88 at Mar-26, up from 64 in FY17', unit: 'Debtor days (of revenue)', x: RL, series: [{ name: 'Debtor days', values: RR('Debtor Days'), fmt: 'num' }], labels: 'all', min: 50, max: 100, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (excl. minorities)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (Screener)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets incl. goodwill and IP', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Trade receivables (billed)', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
    ], source: SRC.co + '. Borrowings at Mar-26: leases Rs5,056 cr, bank debt Rs159 cr (US$252 m HCL America notes repaid in Mar-2026).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Nadar family holds 60.9%; domestic funds have replaced foreign ones',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions up from 15% to 19%; foreign funds down from 19% to 15%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at ~60.9%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 65, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY17–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'otherIncome', name: 'Other income (Screener: incl. forex and exceptional items)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 15 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex (forecasts incl. acquisitions)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'HCLTECH.research.js')) ? require('./HCLTECH.research') : null;
  const report = {
    symbol: 'HCLTECH', listing: 'NSE: HCLTECH · BSE: 532281', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — IT Services',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
