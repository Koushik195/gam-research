// Authoring source for the CEAT initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated). Part B (CEATLTD.research.js +
// part2-6, shared CEATLTD.ctx.js) adds the research chapters. CEATLTD.val.js first syncs the derived multiples into
// assumptions.json. Usage: node tools/authoring/CEATLTD.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'CEATLTD', 'research');
const ROOT = path.join(__dirname, '..', '..');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'CEATLTD.json'), 'utf8'));
const C = JSON.parse(fs.readFileSync(path.join(RD, 'company.json'), 'utf8'));
const A = M.annual, ix = l => A.labels.indexOf(l);
const keepR = SCR.periods.map(p => /^Mar 20(1[6-9]|2\d)$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sum = (k, a, z) => A[k].slice(ix(a), ix(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cagr = (k, a, z, y) => (Math.pow(A[k][ix(z)] / A[k][ix(a)], 1 / y) - 1) * 100;
const cf = ['cfo', 'capex', 'dividendsPaid'].map(k => [sum(k, 'FY18', 'FY21'), sum(k, 'FY22', 'FY26')]);
const left = cf[0].map((_, j) => cf[0][j] - cf[1][j] - cf[2][j]);
const EY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], AE = C.adjEps, BS = C.balanceMar26;
const mg = A.ebitdaMargin.slice(ix('FY18'), ix('FY26') + 1);

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: `Revenue up ${Math.round((A.sales[ix('FY26')] / A.sales[ix('FY20')] - 1) * 100)}% in six years; profit has swung with rubber and crude`,
  blocks: [
    { p: `CEAT's revenue was ₹${n0(A.sales[ix('FY20')])} cr in FY20 and ₹${n0(A.sales[ix('FY26')])} cr in FY26 (${cagr('sales', 'FY20', 'FY26', 6).toFixed(1)}% a year): volume growth in two-wheeler, car and export tyres, price increases after the FY22-23 cost spike, and, in FY26, seven months of Camso (₹421 cr). Profit has been far more volatile. The EBITDA margin swung between ${Math.min(...mg).toFixed(1)}% and ${Math.max(...mg).toFixed(1)}% since FY18 because raw materials are ~60% of revenue (natural and synthetic rubber alone ~31% in FY26) and price increases follow costs with a lag. EPS went from ₹${A.eps[ix('FY21')].toFixed(0)} in FY21 to ₹${A.eps[ix('FY22')].toFixed(0)} in FY22, back to ₹${A.eps[ix('FY24')].toFixed(0)} in FY24 and ₹${A.eps[ix('FY26')].toFixed(0)} in FY26. Exceptional items are small (₹71 cr in FY26 for the new labour codes and VRS), so reported and adjusted EPS tell the same story (MOSL adjusted FY26 EPS ₹${AE.FY26}).` },
    { pair: [
      { type: 'column', title: `Revenue: ₹${n0(A.sales[ix('FY26')])} cr in FY26, more than double FY20`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'EPS: a boom-bust pattern, FY22 near zero, FY26 a record', unit: '₹ per share', x: EY, series: [{ name: 'Reported EPS', values: EY.map(y => A.eps[ix(y)]), fmt: 'n1' }, { name: 'Adjusted EPS (MOSL)', values: EY.map(y => AE[y]), fmt: 'n1' }], labels: 'all', source: 'Screener.in (reported); MOSL 1QFY27 update, 17-Jul-2026 (adjusted for exceptional items)' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 7.7-13.8% since FY18, set by rubber and crude', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 18, source: SRC.co },
      { type: 'column', title: 'Raw material cost: ~60% of revenue, rubber is half of it', unit: 'Raw materials consumed, FY26 (₹ crore)', x: ['Natural & synthetic rubber', 'Carbon black', 'Fabrics', 'Chemicals', 'Others'], series: [{ name: 'FY26', values: [4911, 1435, 756, 661, 1745], fmt: 'num' }], labels: 'all', source: 'AR FY26, consolidated note 30' },
    ] },
    { callout: '**Our view:** CEAT is a well-run, brand-led tyre maker in a commodity-cost business. In good years (FY24, FY26) it earns 13-14% EBITDA margins and ROE of 15-17%; in bad years (FY22-23) margins fall to 8% and ROE to 2-6%. FY27 has started as a bad year: raw materials up 16-18% in one quarter cut the Q1 margin to 8.5%. Anyone buying CEAT is buying the cycle and the management\'s ability to push prices through.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Heavy capex every year, an acquisition in FY26 and returns that only beat the cost of capital in good years',
  blocks: [
    { p: `CEAT has built capacity almost every year: ₹${n0(sum('capex', 'FY18', 'FY21'))} cr of capex in FY18-21 (Nagpur, Chennai, Ambernath) and ₹${n0(sum('capex', 'FY22', 'FY26'))} cr in FY22-26 against ₹${n0(cf[0][1])} cr of operating cash. On top came the Camso purchase: ₹1,186 cr paid on 1-Sep-2025, with ~₹420 cr (USD44 mn) more due for the Camso brand three years after closing and ~USD44 mn of finished goods to buy from Michelin over 12 months. Borrowings (incl. leases) rose from ₹${n0(A.borrowings[ix('FY25')])} cr to ₹${n0(A.borrowings[ix('FY26')])} cr in FY26. ROCE (Screener) was ${RR('ROCE %').slice(-6).join('%, ')}% in FY21-26: below a ~12% cost of capital in FY22-23, above it in the good years. The next leg is already approved: ₹1,300-1,400 cr of India capex in FY27 (car tyres at Chennai, two-wheelers at Nagpur), USD20-25 mn for Camso's upstream mixers and calenders, and a further ₹1,205 cr for 53,000 two-wheeler tyres a day by FY31.` },
    { pair: [
      { type: 'column', title: 'Capex absorbs most of the operating cash', unit: '₹ crore', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 6-9% in the FY22-23 cost spike, 15-20% since', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY18-21', 'FY22-26', 'Nine years'], rows: [
      ['Cash from operations', n0(cf[0][0]), n0(cf[0][1]), n0(cf[0][0] + cf[0][1])],
      ['Capex (cash)', n0(cf[1][0]), n0(cf[1][1]), n0(cf[1][0] + cf[1][1])],
      ['Dividends paid', n0(cf[2][0]), n0(cf[2][1]), n0(cf[2][0] + cf[2][1])],
      { hl: true, cells: ['**Left over before acquisitions**', `**${n0(left[0])}**`, `**${n0(left[1])}**`, `**${n0(left[0] + left[1])}**`] },
      ['Camso acquisition (cash, FY26)', '', '1,120', '1,120'],
      ['Memo: borrowings incl. leases at the end of the period', n0(A.borrowings[ix('FY21')]), n0(A.borrowings[ix('FY26')]), ''],
      ['Memo: capex plan FY27-29E (GAM)', '', '', '~₹5,000 cr incl. the Camso brand'],
    ], source: 'Screener.in cash flow (consolidated); AR FY26 cash-flow statement (payment towards business combination ₹1,120 cr); Q4FY26 and Q1FY27 calls' } },
    { callout: '**The capital question:** CEAT keeps reinvesting at ~8% of revenue and has now added a ₹1,600 cr acquisition (incl. the brand) that has not yet made money. Returns are fine at the top of the cycle (ROE 16% in FY26) and poor at the bottom. We model ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}} for FY27-29E and thin free cash flow until FY28E.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: `Net debt of ₹${n0(BS.borrowings - BS.cash - BS.otherBank)} cr at Mar-26 (₹3,243 cr of debt at Jun-26): comfortable, but rising`,
  blocks: [
    { p: `At Mar-2026 CEAT had ₹${n0(BS.borrowings)} cr of borrowings (₹${n0(BS.borrowingsNonCurrent)} cr long-term) and ~₹260 cr of lease liabilities against just ₹${n0(BS.cash + BS.otherBank)} cr of cash: net debt of ₹${n0(BS.borrowings - BS.cash - BS.otherBank)} cr before leases, 1.46x EBITDA and 0.6x equity (company). Debt rose to ₹3,243 cr at Jun-26 (1.58x LTM EBITDA) on capex and ₹138 cr more working capital. CEAT runs on supplier and dealer money: payables of ~${Math.round(A.payableDays[ix('FY26')])} days and ₹${n0(BS.dealerDeposits)} cr of dealer deposits fund ~${Math.round(A.inventoryDays[ix('FY26')])} days of inventory and ~${Math.round(A.debtorDays[ix('FY26')])} of receivables (Screener), so working capital is negative. Off the balance sheet: ₹${n0(BS.capitalCommitments)} cr of capital commitments (₹${n0(BS.capitalCommitmentsPrior)} cr a year earlier), the USD44 mn Camso brand payment and ₹${n0(BS.contingentLiabilities)} cr of contingent liabilities (mostly GST and excise disputes). India Ratings reaffirmed AA (Positive) in Q1FY27.` },
    { pair: [
      { type: 'line', title: 'Working capital days: negative cash cycle', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt (incl. leases) jumped in FY26 with Camso', unit: 'Net debt incl. lease liabilities (₹ crore)', x: 'A.labels', from: 'FY16', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co + ' (cash and investments include the ₹173 cr Sri Lanka JV)' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-21', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.6|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.6|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (incl. JV)', '{{A.cashAndInvestments.6|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.6|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.6|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.6|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.6|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Borrowings include lease liabilities (~₹260 cr at Mar-26).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the RPG group 47.3%, Indian funds 22%, foreign funds down to 14%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions up, foreign funds down', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter holding steady at ~47%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 30, max: 60, source: 'BSE shareholding pattern, Screener.in' },
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
      { key: 'otherIncome', name: 'Other income (actuals net of exceptional items)', flag: { type: 'pct', th: 60 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (net of exceptional items)' },
      { key: 'interest', name: 'Finance cost' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./CEATLTD.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'CEATLTD.research.js')) ? require('./CEATLTD.research') : null;
  const report = {
    symbol: 'CEATLTD', listing: 'NSE: CEATLTD · BSE: 500878', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
