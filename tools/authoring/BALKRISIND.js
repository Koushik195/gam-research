// Authoring source for the Balkrishna Industries (BKT) initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated). Part B (BALKRISIND.research.js +
// part2-6, shared BALKRISIND.ctx.js) adds the research chapters. BALKRISIND.val.js first syncs the derived multiples into
// assumptions.json. Usage: node tools/authoring/BALKRISIND.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'BALKRISIND', 'research');
const ROOT = path.join(__dirname, '..', '..');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'BALKRISIND.json'), 'utf8'));
const A = M.annual, ix = l => A.labels.indexOf(l);
const keepR = SCR.periods.map(p => /^Mar 20(1[6-9]|2\d)$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sum = (k, a, z) => A[k].slice(ix(a), ix(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cagr = (k, a, z, y) => (Math.pow(A[k][ix(z)] / A[k][ix(a)], 1 / y) - 1) * 100;
const cf = ['cfo', 'capex', 'dividendsPaid'].map(k => [sum(k, 'FY21', 'FY23'), sum(k, 'FY24', 'FY26')]);
const left = cf[0].map((_, j) => cf[0][j] - cf[1][j] - cf[2][j]);

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue tripled in ten years; profit has not grown since FY21',
  blocks: [
    { p: `BKT's revenue was ₹${n0(A.sales[ix('FY16')])} cr in FY16 and ₹${n0(A.sales[ix('FY26')])} cr in FY26: ${cagr('sales', 'FY16', 'FY26', 10).toFixed(1)}% a year. Most of that came in one jump: the post-Covid farm and construction boom lifted revenue 43% in FY22. Since then growth has been slow (${cagr('sales', 'FY22', 'FY26', 4).toFixed(1)}% a year FY22-26) and profit has gone sideways: EPS was ₹${A.eps[ix('FY21')].toFixed(1)} in FY21 and ₹${A.eps[ix('FY26')].toFixed(1)} in FY26. Three things explain it. The EBITDA margin fell from 31% (FY21) to 18% (FY23) on freight and raw materials and has not gone back above 24%; depreciation and interest grew with a ₹6,800 cr capex plan; and in FY26 currency turned against BKT. The rupee fell below the rates at which BKT had sold its euros and dollars forward, and a US import duty of 50% (from mid-Q2FY26) stopped its US shipments. FY26 EPS fell 25% to ₹64.3.` },
    { pair: [
      { type: 'column', title: 'Revenue: one jump in FY22, slow growth since', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit peaked in FY25 and fell 25% in FY26', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 25-31% to FY21, 18-24% since', unit: 'EBITDA margin (%), FX gains/losses in expenses', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 35, source: SRC.co },
      { type: 'column', title: 'Other income was 11-30% of pre-tax profit (treasury; FX gains in FY25)', unit: 'Other income, % of profit before tax', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Share of PBT', ref: 'fin.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** BKT is still one of the most profitable tyre makers in the world for its size, but the last five years show the limits of the model. Its margin depends on three things it does not control: farm and mining cycles in Europe and the Americas, freight and crude-linked raw materials, and the rupee against its hedge book. FY26 was a currency year as much as a business year: standalone FX moved from a ₹209 cr gain (FY25) to a ₹308 cr loss, a ₹517 cr swing, more than the ₹406 cr fall in standalone profit. That swing partly reverses in FY27 only because the hedges now sit at higher rates.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'A ₹6,800 cr build-out has turned BKT from net cash to net debt and ROCE to 11%',
  blocks: [
    { p: `BKT funds growth itself. Over FY21-26 it generated ₹${n0(cf[0][0] + cf[0][1])} cr of operating cash, spent ₹${n0(cf[1][0] + cf[1][1])} cr on capex and paid ₹${n0(cf[2][0] + cf[2][1])} cr of dividends; borrowings rose from ₹${n0(A.borrowings[ix('FY21')])} cr to ₹${n0(A.borrowings[ix('FY26')])} cr. The current plan is the largest in its history: ₹6,800 cr to FY29 for carbon black (now 360,000 MTPA), captive power, CV radial and passenger-car tyres, more OHT capacity (to 425,000 MTPA) and automation. ₹2,984 cr went out in FY26 and ~₹1,000 cr in Q1FY27, with ₹1,500-2,000 cr more due in FY27. ROCE fell from 24% (FY21-22) to 11% (FY26) on Screener's basis, because capital employed rose faster than profit and CWIP reached ₹2,472 cr.` },
    { pair: [
      { type: 'column', title: 'Capex ran ahead of operating cash in three of the last five years', unit: '₹ crore', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 22-24% in good years, 11% in FY26', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(cf[0][0]), n0(cf[0][1]), n0(cf[0][0] + cf[0][1])],
      ['Capex (cash)', n0(cf[1][0]), n0(cf[1][1]), n0(cf[1][0] + cf[1][1])],
      ['Dividends paid', n0(cf[2][0]), n0(cf[2][1]), n0(cf[2][0] + cf[2][1])],
      { hl: true, cells: ['**Left over (negative = borrowed or from treasury)**', `**${n0(left[0])}**`, `**${n0(left[1])}**`, `**${n0(left[0] + left[1])}**`] },
      ['Memo: borrowings at the end of the period', n0(A.borrowings[ix('FY23')]), n0(A.borrowings[ix('FY26')]), ''],
      ['Memo: capex plan still to spend (Jun-2026)', '', '', '~3,000 (of 6,800 to FY29)'],
    ], source: 'Screener.in cash flow (consolidated); Q1FY27 call (capex plan)' } },
    { callout: '**The capital question:** BKT is spending ₹6,800 cr, about two-thirds of its Mar-26 net worth, mostly on businesses it has never run at scale: passenger-car and truck radials in India against MRF, Apollo, CEAT and JK, and carbon black sold to other tyre makers at "industry average" margins. The OHT part of the plan is the proven one. Management says ROCE will not fall significantly once the projects run fully; on our numbers ROE recovers only to ~14-15% by FY29E, below the 15-22% of FY22-25.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: `Net debt of ₹${n0(A.borrowings[ix('FY26')] - A.cashAndInvestments[ix('FY26')])} cr at Mar-26 and ₹1,725 cr at Jun-26: modest, but rising`,
  blocks: [
    { p: `At Mar-2026 BKT had ₹${n0(A.borrowings[ix('FY26')])} cr of borrowings, mostly short-term export credit (₹3,218 cr) plus ₹750 cr of NCDs at 7.20-7.55% (2029-31) and term loans, against ₹3,124 cr of investments and ₹65 cr of cash. ₹637 cr of the investments is strategic equity (₹593 cr in NSE shares, start-ups) and ₹424 cr is in alternative and real-estate funds, so the liquid treasury is ~₹2,000-2,500 cr. On the company's basis net debt was ₹895 cr at Mar-26 and ₹1,725 cr at Jun-26 (standalone). Working capital is heavy for an exporter: ~126 days of inventory, ~49 of receivables and ~64 of payables in FY26. The balance sheet also carries the hedge book: a ₹575 cr loss on cash-flow hedges went through other comprehensive income in FY26.` },
    { pair: [
      { type: 'line', title: 'Inventory days: 100-160 for a decade; 126 in FY26', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Borrowings up 4x since FY20 to fund capex', unit: 'Borrowings (₹ crore)', x: 'A.labels', from: 'FY16', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }, { name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Cash and investments include the ₹593 cr NSE stake.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Poddar family 58.3%, Indian funds and insurers 24.6%, foreign funds 10.3%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions up, foreign funds down', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter holding unchanged at 58.3%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 70, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 250 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income', flag: { type: 'pct', th: 40 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
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

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./BALKRISIND.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'BALKRISIND.research.js')) ? require('./BALKRISIND.research') : null;
  const report = {
    symbol: 'BALKRISIND', listing: 'NSE: BALKRISIND · BSE: 502355', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
