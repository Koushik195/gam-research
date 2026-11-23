// Authoring source for the Apollo Tyres initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated). Part B (APOLLOTYRE.research.js +
// part2-6, shared APOLLOTYRE.ctx.js) adds the research chapters. APOLLOTYRE.val.js first syncs the derived multiples into
// assumptions.json. Usage: node tools/authoring/APOLLOTYRE.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'APOLLOTYRE', 'research');
const ROOT = path.join(__dirname, '..', '..');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'APOLLOTYRE.json'), 'utf8'));
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
const AE = C.adjEps, EY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 74% in six years; profit has swung with rubber, Europe and one-offs',
  blocks: [
    { p: `Apollo's revenue was ₹${n0(A.sales[ix('FY20')])} cr in FY20 and ₹${n0(A.sales[ix('FY26')])} cr in FY26 (${cagr('sales', 'FY20', 'FY26', 6).toFixed(1)}% a year), almost all of it from India: the APMEA segment grew from ₹11,061 cr to ₹19,039 cr while Europe went from ₹5,165 cr to ₹8,371 cr, helped by a weaker rupee. Profit has been far more volatile. The EBITDA margin swung between ${Math.min(...A.ebitdaMargin.slice(ix('FY18'))).toFixed(0)}% and ${Math.max(...A.ebitdaMargin.slice(ix('FY18'))).toFixed(0)}% since FY18 with natural rubber and crude, and reported profit carries large one-offs: ₹608 cr of exceptional charges in FY21 (Europe), ₹169 cr in FY25 and ₹1,034 cr in FY26 (the Enschede closure), plus a ~₹570 cr deferred-tax write-back in FY26. Before one-offs EPS was ₹${AE.FY21} in FY21, ₹${AE.FY24} at the FY24 peak, ₹${AE.FY25} in FY25 and ₹${AE.FY26} in FY26 (MOSL basis); reported EPS was ₹${A.eps[ix('FY26')].toFixed(1)}.` },
    { pair: [
      { type: 'column', title: 'Revenue: steady growth, ₹28,471 cr in FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'EPS: reported vs before one-offs; FY24 was the peak', unit: '₹ per share', x: EY, series: [{ name: 'Reported EPS', values: EY.map(y => A.eps[ix(y)]), fmt: 'n1' }, { name: 'EPS before one-offs', values: EY.map(y => AE[y]), fmt: 'n1' }], labels: 'all', source: 'Screener.in (reported); MOSL adjusted EPS (7-Aug-2026): exceptional items and the FY26 tax write-back removed' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 11-18% since FY18, set by rubber and crude', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 5, max: 20, source: SRC.co },
      { type: 'column', title: 'Exceptional charges: Europe in FY21, Enschede in FY25-26', unit: 'Exceptional items before tax (₹ crore; + = charge)', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Exceptional items', values: [608, 6, -23, 77, 169, 1034], fmt: 'num' }], labels: 'all', source: 'Annual reports FY21-FY26 (consolidated segment notes and note B31)' },
    ] },
    { callout: '**Our view:** Apollo is a cyclical business with a structural problem it has finally addressed. The India business earns a normal tyre-industry margin that moves with rubber; Europe, a quarter of revenue, has earned 13-15% EBITDA margins since FY24 on a high-cost Dutch plant, and its restructuring has cost ₹1,128 cr of charges in FY25-26. Read reported EPS with care: FY26\'s ₹21.6 is depressed by the closure and flattered by a tax write-back; ₹26.7 is the cleaner number.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Five years of small capex repaired the balance sheet; a ₹5,800 cr expansion starts now',
  blocks: [
    { p: `Apollo spent heavily in FY17-20 (Hungary and the Andhra Pradesh greenfield: ₹${n0(sum('capex', 'FY17', 'FY20'))} cr of capex in four years) and borrowings rose to ₹${n0(A.borrowings[ix('FY21')])} cr. Then it switched to "bite-sized" capex: ₹${n0(sum('capex', 'FY22', 'FY26'))} cr in FY22-26, below depreciation in most years, against ₹${n0(cf[0][1])} cr of operating cash. Borrowings (incl. leases) fell to ₹${n0(A.borrowings[ix('FY26')])} cr and net debt to EBITDA from 3.2x (Mar-2020) to 0.4x (Mar-2026). ROCE recovered to 11-16% in FY24-26 (Screener basis; company 13.4% in FY26), still short of the company's 15% target. The cycle has turned: utilisation is in the 90s and the board approved ₹5,800 cr for Andhra Pradesh over FY27-29 (+17-18% India PCR and +20% TBR capacity) on top of a Hungary PCR expansion. FY27 capex is guided at ₹3,000-3,500 cr, two to three times FY26.` },
    { pair: [
      { type: 'column', title: 'Capex below operating cash since FY21; rising again from FY27', unit: '₹ crore', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 5-10% in FY19-23, 11-16% since', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY18-21', 'FY22-26', 'Nine years'], rows: [
      ['Cash from operations', n0(cf[0][0]), n0(cf[0][1]), n0(cf[0][0] + cf[0][1])],
      ['Capex (cash)', n0(cf[1][0]), n0(cf[1][1]), n0(cf[1][0] + cf[1][1])],
      ['Dividends paid', n0(cf[2][0]), n0(cf[2][1]), n0(cf[2][0] + cf[2][1])],
      { hl: true, cells: ['**Left over (negative = borrowed or equity)**', `**${n0(left[0])}**`, `**${n0(left[1])}**`, `**${n0(left[0] + left[1])}**`] },
      ['Memo: borrowings incl. leases at the end of the period', n0(A.borrowings[ix('FY21')]), n0(A.borrowings[ix('FY26')]), ''],
      ['Memo: capex plan FY27-29', '', '', '~₹8,700 cr (GAM; AP ₹5,800 cr + Hungary + maintenance)'],
    ], source: 'Screener.in cash flow (consolidated); Q3FY26 and Q4FY26 calls (capex plan)' } },
    { callout: '**The capital question:** the last time Apollo built big (FY17-21) ROE fell to 3-9% for five years. This time the plan is in its home market, where demand is outrunning capacity, at ~₹17 cr per tonne a day, and the balance sheet starts at 0.4x net debt to EBITDA. We model net debt rising to ~₹3,000 cr (incl. leases) in FY27-28E before falling, and ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}} for FY27-29E: adequate, not exciting.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: `Net debt of ₹${n0(C.balanceMar26.borrowings - C.balanceMar26.cash - C.balanceMar26.investments)} cr at Mar-26 (₹${n0(A.netDebt[ix('FY26')])} cr with leases): the strongest in a decade`,
  blocks: [
    { p: `At Mar-2026 Apollo had ₹${n0(C.balanceMar26.borrowings)} cr of bank borrowings and debentures and ₹${n0(C.balanceMar26.leases)} cr of lease liabilities against ₹${n0(C.balanceMar26.cash)} cr of cash: net debt of ₹${n0(C.balanceMar26.borrowings - C.balanceMar26.cash - C.balanceMar26.investments)} cr before leases (the company says ~₹1,600 cr, 0.4x EBITDA) and ~₹1,700 cr at Jun-26. Two items to watch: current provisions jumped to ₹${n0(C.balanceMar26.currentProvisions)} cr (₹${n0(C.balanceMar26.currentProvisionsPrior)} cr) mostly for the Enschede social plan, ~EUR55 mn+ of which is paid in cash in FY27 (not in our P&L, as it was provided in FY26); and deferred tax liabilities of ₹${n0(C.balanceMar26.deferredTaxLiab)} cr fell by ~₹340 cr after the move to the 25% tax regime. Working capital is moderate: ~${Math.round(A.inventoryDays[ix('FY26')] || 0)} days of inventory, ~${Math.round(A.debtorDays[ix('FY26')] || 0)} of receivables and ~${Math.round(A.payableDays[ix('FY26')] || 0)} of payables (Screener).` },
    { pair: [
      { type: 'line', title: 'Working capital days: stable', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt (incl. leases) halved since FY21', unit: 'Net debt incl. lease liabilities (₹ crore)', x: 'A.labels', from: 'FY16', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-21', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.6|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.6|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.6|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.6|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.6|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.6|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.6|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Borrowings include lease liabilities (₹1,044 cr at Mar-26).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Kanwar family 36.9%, Indian funds and insurers 29%, a 9.9% foreign strategic holder',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions up, foreign funds down', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter holding ~37% since FY21', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 20, max: 50, source: 'BSE shareholding pattern, Screener.in' },
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
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./APOLLOTYRE.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'APOLLOTYRE.research.js')) ? require('./APOLLOTYRE.research') : null;
  const report = {
    symbol: 'APOLLOTYRE', listing: 'NSE: APOLLOTYRE · BSE: 500877', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
