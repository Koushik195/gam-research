// Authoring source for the Endurance Technologies initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; no minorities). Part B
// (ENDURANCE.research.js + part2-6, shared ENDURANCE.ctx.js) adds the research chapters.
// ENDURANCE.val.js first syncs the derived multiples into assumptions.json. Usage: node tools/authoring/ENDURANCE.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ENDURANCE', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(1[6-9]|2\d)$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const MA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'ENDURANCE.json'), 'utf8')).annual;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sumR = (k, a, z) => MA[k].slice(MA.labels.indexOf(a), MA.labels.indexOf(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cash6 = { cfo: [sumR('cfo', 'FY21', 'FY23'), sumR('cfo', 'FY24', 'FY26')], capex: [sumR('capex', 'FY21', 'FY23'), sumR('capex', 'FY24', 'FY26')], acq: [sumR('acquisitions', 'FY21', 'FY23'), sumR('acquisitions', 'FY24', 'FY26')], div: [sumR('dividendsPaid', 'FY21', 'FY23'), sumR('dividendsPaid', 'FY24', 'FY26')] };
const net = i => cash6.cfo[i] - cash6.capex[i] - cash6.acq[i] - cash6.div[i];

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue nearly three times in a decade; margins slipped from 16% to 13% as metal costs and Europe diluted them',
  blocks: [
    { p: 'Endurance\'s revenue was ₹4,917 cr in FY15 and ₹14,596 cr in FY26: 10% a year over eleven years, 17% a year since the Covid year FY21. Two things drove it: Indian two-wheeler content (suspension, brakes, ABS, alloy wheels on more and bigger bikes) and Europe, where the Stöferle purchase in April 2025 alone added ~₹840 cr in FY26 (EUR82 mn). Margins went the other way: EBITDA was 15-16% of revenue in FY19-21 and 12-14% since FY22, because aluminium prices rose (metal cost passed through at cost inflates revenue but not profit) and European energy prices tripled from 2021 levels. EPS went from ₹35 (FY19, the pre-Covid high) to ₹68 (FY26), 10% a year; from FY21, 13% a year.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹6,547 cr in FY21, ₹14,596 cr in FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: dipped in FY20-23, then +26% a year', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 15-16% in FY19-21, 12-14% since', unit: 'EBITDA margin excl. other income (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 8, max: 18, source: SRC.co + '. The company\'s own EBITDA includes other income (FY26 14.2% of total income).' },
      { type: 'column', title: 'Depreciation jumped 36% in FY26 with Stöferle and new plants', unit: 'Depreciation (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Depreciation', ref: 'fin.dep', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY26 includes Stöferle; Q1FY27 adds accelerated depreciation of Europe ICE assets.' },
    ] },
    { callout: '**Our view:** Endurance is a steady grower with good, not great, returns. ROE fell from 20-23% before Covid to 11-16% since FY22: margins dropped, the balance sheet carries ~₹1,900 cr of cash and investments, and Europe earns high EBITDA margins but needs heavy depreciation. The earnings line that matters most is India\'s margin, which swings with how fast aluminium and steel costs are passed on to Bajaj Auto and other two-wheeler makers.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: `Self-funded growth: ₹${n0(cash6.capex[0] + cash6.capex[1])} cr of capex and ₹${n0(cash6.acq[0] + cash6.acq[1])} cr of acquisitions in six years, still net cash`,
  blocks: [
    { p: `Over FY21-26 Endurance generated ₹${n0(cash6.cfo[0] + cash6.cfo[1])} cr of operating cash, spent ₹${n0(cash6.capex[0] + cash6.capex[1])} cr on capex, ₹${n0(cash6.acq[0] + cash6.acq[1])} cr on acquisitions (Maxwell, Frenotecnica and New Fren, Stöferle) and paid ₹${n0(cash6.div[0] + cash6.div[1])} cr of dividends (payout 16-21%). It stayed net cash throughout: ₹579 cr at Mar-2026 (cash and investments ₹1,906 cr less borrowings ₹1,327 cr), plus a ₹246 cr deferred liability for the rest of Stöferle. India capex is guided at ~₹800 cr in FY27, the same as FY26, spread across brakes, ABS, alloy wheels, castings and battery packs; Europe spent EUR45 mn in FY26. Returns: ROCE 17-18% on Screener's basis in FY24-26, below the 21-25% of FY17-20.` },
    { pair: [
      { type: 'column', title: 'Operating cash covers capex in every year', unit: '₹ crore', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 21-25% before Covid, 14% in FY22-23, 17-18% since', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(cash6.cfo[0]), n0(cash6.cfo[1]), n0(cash6.cfo[0] + cash6.cfo[1])],
      ['Capex (cash)', n0(cash6.capex[0]), n0(cash6.capex[1]), n0(cash6.capex[0] + cash6.capex[1])],
      ['Acquisitions (net of cash acquired)', n0(cash6.acq[0]), n0(cash6.acq[1]), n0(cash6.acq[0] + cash6.acq[1])],
      ['Dividends paid', n0(cash6.div[0]), n0(cash6.div[1]), n0(cash6.div[0] + cash6.div[1])],
      { hl: true, cells: ['**Left over (debt raised if negative)**', `**${n0(net(0))}**`, `**${n0(net(1))}**`, `**${n0(net(0) + net(1))}**`] },
      ['Memo: FY27E India capex guidance', '', '', '~800'],
    ], source: 'Screener.in cash flow (consolidated); Q4FY26 and Q1FY27 calls. Share count unchanged at 14.07 crore since FY17.' } },
    { callout: '**The capital question:** capex runs at ~9% of revenue (FY25-26), high for a business growing 15-20%. The new spending goes into products that should earn more than the core (ABS with in-house electronics, inverted front forks, 4W machined castings for export, battery packs), but each also comes with start-up costs, and battery packs carry a high material content. The European business needs capex just to hold its place as programmes move from combustion engines to hybrids and EVs.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ₹579 cr; suppliers fund the working capital',
  blocks: [
    { p: 'At Mar-2026 Endurance had ₹1,327 cr of borrowings (mostly in Europe, incl. Stöferle\'s) against ₹875 cr of cash and ₹1,031 cr of investments (mainly liquid and debt funds): net cash ₹579 cr. The India business alone had ₹416 cr of net cash at Jun-2026 even after paying >₹300 cr of commodity increases up front. Goodwill rose to ~₹729 cr (MOSL; Stöferle ₹349 cr and Maxwell ₹104 cr per the AR), and a ₹246 cr deferred consideration for the remaining 40% of Stöferle sits in other liabilities; 8% is bought each year from Jun-2026 (68% owned after Q1FY27). Working capital is close to zero: payables of ~100 days fund receivables (~46 days) and inventory (~50 days).' },
    { pair: [
      { type: 'line', title: 'Payables (~100 days) fund receivables and inventory', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net cash since FY20 (negative = net cash)', unit: 'Net debt (₹ crore), Screener basis', x: 'A.labels', from: 'FY16', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co + '. Borrowings less cash and investments.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Stöferle consolidated from Apr-2025 (FY26 non-current assets outside India ₹3,288 cr vs ₹2,025 cr).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Jain family 75%, foreign funds 12.7%, Indian institutions 10.1%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds up from 8% to 13%; Indian institutions down from 15% to 10%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter stake fixed at 75%, the legal maximum', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (excl. other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 100 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (history: net of exceptional items)', flag: { type: 'pct', th: 40 } },
      { key: 'interest', name: 'Finance cost' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (excl. other income)' },
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
  require('./ENDURANCE.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'ENDURANCE.research.js')) ? require('./ENDURANCE.research') : null;
  const report = {
    symbol: 'ENDURANCE', listing: 'NSE: ENDURANCE · BSE: 540153', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  // research JSONs write rupees as 'Rs'; show them as ₹ in the report
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1).replace(/(^|[^A-Za-z])Rs ?(?=[0-9~])/g, '$1₹'));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
