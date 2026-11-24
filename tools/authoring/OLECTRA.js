// Authoring source for the Olectra Greentech initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated, attributable profit via
// OLECTRA.patch.js). Part B (OLECTRA.research.js + part2-6, shared OLECTRA.ctx.js) adds the research chapters.
// OLECTRA.ctx.js first syncs the segment build and the derived multiples into assumptions.json.
// Usage: node tools/authoring/OLECTRA.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'OLECTRA', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
const RT = SCR.tables.ratios;
const keepR = RT.periods.map(p => /^Mar 20(19|2[0-6])$/.test(p));
const RL = RT.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => RT.rows[k].filter((_, i) => keepR[i]);
const CF = SCR.schedules['cash-flow'];
const cf = (par, item, yrs) => yrs.reduce((s, y) => s + (CF[par][item][`Mar ${y}`] || 0), 0);
const Y1 = [2021, 2022, 2023], Y2 = [2024, 2025, 2026];
const cash = yrs => { const cfo = cf('Cash from Operating Activity', 'Profit from operations', yrs) + cf('Cash from Operating Activity', 'Working capital changes', yrs) + cf('Cash from Operating Activity', 'Direct taxes', yrs);
  const capex = -cf('Cash from Investing Activity', 'Fixed assets purchased', yrs), inv = -cf('Cash from Investing Activity', 'Investments purchased', yrs) - cf('Cash from Investing Activity', 'Other investing items', yrs) - cf('Cash from Investing Activity', 'Interest received', yrs);
  const int = -cf('Cash from Financing Activity', 'Interest paid fin', yrs);
  const debt = cf('Cash from Financing Activity', 'Proceeds from borrowings', yrs) + cf('Cash from Financing Activity', 'Repayment of borrowings', yrs);
  const wc = -cf('Cash from Operating Activity', 'Working capital changes', yrs);
  return { cfo, capex, inv, int, wc, left: cfo - capex - inv - int, debt }; };
const c1 = cash(Y1), c2 = cash(Y2);
const f0 = v => Math.round(v).toLocaleString('en-IN');
const SRC = { co: 'Company filings, Screener.in (consolidated; attributable profit), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue 8x in five years on e-buses; EPS 22x from a near-zero base, but FY26 profit growth came from insulators',
  blocks: [
    { p: 'Olectra\'s consolidated revenue rose from ₹281 cr in FY21 to ₹2,312 cr in FY26 (Screener basis): 52% a year. Almost all of it came from electric vehicles, whose revenue grew from ₹160 cr to ₹1,987 cr as state bus companies moved to e-buses on gross-cost contracts, with Olectra\'s sister company Evey Trans as the operator. The insulator business, the company\'s original one, earned ₹108-143 cr a year until FY24 and then jumped to ₹180 cr (FY25) and ₹325 cr (FY26) on transmission spending and exports. The EBITDA margin (Screener basis, before other income) rose from 7% in FY21 to 13-15% from FY22. Net profit attributable to shareholders went from ₹8 cr to ₹177 cr; EPS from ₹0.98 to ₹21.62. In FY26 revenue grew 28% and EPS 28%, but the Mobility Division\'s segment EBIT rose only 1% (₹193 cr to ₹195 cr): the insulator division\'s EBIT rose 144% (₹46 cr to ₹112 cr) and supplied almost all of the profit growth.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹281 cr (FY21) to ₹2,312 cr (FY26)', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: a loss in FY19, ₹177 cr in FY26', unit: 'Net profit, attributable (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY20 includes a ₹20 cr exceptional gain.' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 13-15% since FY22, 11.8% in Q1FY27', unit: 'EBITDA margin (%), Screener basis', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: -10, max: 20, source: SRC.co + '. Screener\'s EBITDA excludes other income and the share of associates.' },
      { type: 'column', title: 'Interest: ₹8 cr (FY21) to ₹61 cr (FY26); ₹24 cr in Q1FY27 alone', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Interest', ref: 'A.interest', fmt: 'num' }, { name: 'Depreciation', ref: 'A.dep', fmt: 'num' }], labels: 'none', source: SRC.co + '. FY26 interest is after ₹13.7 cr capitalised into the new plant.' },
    ] },
    { callout: '**Our view:** the growth is real and the bus market is real. But two things flatter FY26. First, insulators earned a 34.5% EBIT margin on a one-year doubling of revenue; that margin was 22% in Q1FY27. Second, interest on the new plant was capitalised until Dec-2025; from Q1FY27 it runs through the P&L (₹23.6 cr, +97%). That is why Q1FY27 revenue rose 66% and attributable profit did not rise at all.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Cash & capital', kicker: 'Capital allocation', title: `FY24-26: ₹${f0(c2.cfo)} cr of operating cash, ₹${f0(c2.capex)} cr of capex: a new plant paid for with debt`,
  blocks: [],
};
capital.blocks = [
  { p: `Over FY24-26 Olectra generated ₹${f0(c2.cfo)} cr of cash from operations (before interest) against ₹393 cr of net profit, because working capital absorbed ₹${f0(c2.wc)} cr: receivables rose by ₹${f0(180 + 294 - 117)} cr net while suppliers funded part of it. It spent ₹${f0(c2.capex)} cr on fixed assets (mostly the Seetharampur plant), ₹${f0(c2.inv)} cr net on investments (equity in Evey Trans SPVs and deposits) and ₹${f0(c2.int)} cr on interest. The gap, ₹${f0(-c2.left)} cr, was filled with ₹${f0(c2.debt)} cr of new borrowing. The last equity raise was in FY18-19, when the MEIL group took control. ROCE (Screener) rose from 2% (FY21) to 21% (FY25-26) as the plant base stayed small; it will fall as the ₹500 cr-plus plant and the new platforms are depreciated.` },
  { pair: [
    { type: 'column', title: 'Operating cash flow vs capex: free cash flow negative in FY25 and FY26', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
    { type: 'line', title: 'ROCE: 2% (FY21) to 21% (FY25-26)', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: -5, max: 25, source: 'Screener.in' },
  ] },
  { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26'], rows: [
    ['Cash from operations (before interest)', f0(c1.cfo), f0(c2.cfo)],
    ['of which: working capital absorbed', f0(c1.wc), f0(c2.wc)],
    ['Capex', f0(c1.capex), f0(c2.capex)],
    ['Investments (SPV equity, deposits), net of interest received', f0(c1.inv), f0(c2.inv)],
    ['Interest paid', f0(c1.int), f0(c2.int)],
    { hl: true, cells: ['**Left over**', `**${f0(c1.left)}**`, `**${f0(c2.left)}**`] },
    ['Funded by: net borrowing', f0(c1.debt), f0(c2.debt)],
  ], source: 'Screener.in cash flow schedules (consolidated). Dividends are under ₹5 cr a year.' } },
  { callout: '**The capital question:** Olectra makes the buses; its parent\'s other company, Evey, owns and runs them for the states and pays Olectra out of project loans and state payments. So far Olectra has needed only modest debt (net debt ₹{{A.netDebt.7|num}} cr at Mar-26) because Evey\'s SPVs drew project debt and paid (ICRA). Our model, which holds working capital at the FY26 ratio of ~30% of revenue and adds ₹650 cr of capex over three years, has free cash flow of ₹{{F.fcf.0|num}} / ₹{{F.fcf.1|num}} / ₹{{F.fcf.2|num}} cr in FY27-29E and net debt rising to ~₹500 cr.' },
];

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net debt only ~₹110 cr, but ₹987 cr of receivables, 72% of them owed by the parent\'s companies',
  blocks: [
    { p: 'At Mar-2026 Olectra had ₹380 cr of borrowings (₹170 cr SBI term loan for the plant, ₹148 cr working-capital loans, ₹43 cr current maturities, ₹19 cr from Evey Trans) against ₹172 cr of cash and bank balances (mostly deposits held as margin money for letters of credit and guarantees) and ₹94 cr of investments (equity in Evey Trans SPVs), so net debt was ~₹114 cr on the engine\'s basis. The bigger item is working capital: trade receivables of ₹987 cr (43% of revenue; ₹694 cr a year earlier), of which ₹718 cr is owed by related parties, chiefly Evey Trans (MSR) for MSRTC (₹345 cr), Evey Trans (TEL) (₹137 cr) and Evey Trans (MUM) for BEST (₹109 cr). Receivables not yet due were ₹462 cr; ₹419 cr were up to six months overdue and ₹112 cr older. Ratings: ICRA A- and India Ratings A-, both with a positive outlook.' },
    { pair: [
      { type: 'line', title: 'Receivable days: 140 (FY25) to 156 (FY26)', unit: 'Days', x: RL, series: [{ name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Borrowings: ₹8 cr (FY21) to ₹380 cr (FY26)', unit: 'Borrowings (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.3|num}}', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}'],
      ['Borrowings', '{{A.borrowings.3|num}}', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}', '{{A.borrowings.7|num}}'],
      ['Cash, bank balances and investments (incl. SPV equity)', '{{A.cashAndInvestments.3|num}}', '{{A.cashAndInvestments.5|num}}', '{{A.cashAndInvestments.6|num}}', '{{A.cashAndInvestments.7|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.3|num}}', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.7|num}}'],
      ['Inventories', '{{A.inventories.3|num}}', '{{A.inventories.5|num}}', '{{A.inventories.6|num}}', '{{A.inventories.7|num}}'],
      ['Trade receivables', '{{A.receivables.3|num}}', '{{A.receivables.5|num}}', '{{A.receivables.6|num}}', '{{A.receivables.7|num}}'],
      ['Trade payables', '{{A.payables.3|num}}', '{{A.payables.5|num}}', '{{A.payables.6|num}}', '{{A.payables.7|num}}'],
    ], source: SRC.co + '. Related-party receivables from AR FY26 note 33.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: MEIL Holdings 50.02%; foreign funds ~8%, Indian institutions under 1%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds 5-8%, domestic institutions under 1%: a retail stock', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter (MEIL Holdings): 50.02% in every quarter', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 0, max: 60, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY19–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 30 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (before other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation', flag: { type: 'pct', th: 30 } },
      { key: 'otherIncome', name: 'Other income (incl. associates; exceptional items in actual years)', flag: { type: 'pct', th: 50 } },
      { key: 'interest', name: 'Interest', flag: { type: 'pct', th: 30 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 30 } },
      { key: 'eps', name: 'EPS (₹, on 8.21 cr shares)', fmt: 'n2' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 30 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. associates)' },
      { key: 'interest', name: 'Interest' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD, c1, c2 };

if (require.main === module) {
  const X = require('./OLECTRA.ctx');
  if (X.syncBuild() || X.syncMultiples()) { console.log('Assumptions changed: run node src/model.js OLECTRA, then this script again.'); process.exit(0); }
  const B = fs.existsSync(path.join(__dirname, 'OLECTRA.research.js')) ? require('./OLECTRA.research') : null;
  const report = {
    symbol: 'OLECTRA', listing: 'NSE: OLECTRA · BSE: 532439', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
