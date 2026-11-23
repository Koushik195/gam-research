// Authoring source for the Uno Minda initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; net profit on the owners' basis,
// see UNOMINDA.patch.js). Part B (UNOMINDA.research.js + part2-6, shared UNOMINDA.ctx.js) adds the research chapters.
// UNOMINDA.val.js first syncs the derived multiples into assumptions.json. Usage: node tools/authoring/UNOMINDA.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'UNOMINDA', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(1[6-9]|2\d)$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated; net profit attributable to owners), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up eight times in eleven years at a steady 11% margin: growth is the whole story',
  blocks: [
    { p: 'Uno Minda\'s revenue was ₹2,527 cr in FY16 and ₹19,658 cr in FY26: 23% a year for a decade, and 25% a year since the Covid year FY21, against Indian vehicle production that grew low-to-mid single digits a year over the same decade. The growth came from three sources: more products per vehicle (lighting, alloy wheels, seats, sensors, EV chargers), more customers and higher share with each, and acquisitions or buy-outs of partners (Harita Seating, Kosei\'s alloy-wheel ventures, Rinder, Clarton, FRIWO\'s EV stake). What did not change is the margin: EBITDA has stayed between 10.6% and 12.3% of revenue since FY17. Owners\' EPS went from ₹3.8 (FY21) to ₹20.7 (FY26), 40% a year off a Covid base, and from ₹5.9 (FY18, the pre-Covid peak) at 17% a year.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹2,527 cr in FY16, ₹19,658 cr in FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Owners\' profit: a Covid dip in FY20-21, then 42% a year', unit: 'Net profit attributable to owners (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 10.6-12.3% for ten years', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 6, max: 14, source: SRC.co + '. FY26 includes ₹69 cr of prior-period income (11.1% without it).' },
      { type: 'column', title: 'JV profits are 15-23% of pre-tax profit', unit: 'Other income incl. share of JV profit and exceptional items, % of profit before tax', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Share of PBT', ref: 'fin.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: SRC.co + '. Screener adds the post-tax share of JV profit (₹249 cr in FY26) to other income.' },
    ] },
    { callout: '**Our view:** Uno Minda is a growth compounder with ordinary unit economics. Each rupee of revenue earns the same ~11 paise of EBITDA it did ten years ago; returns are good (ROE 17-19% since FY23) because assets turn ~4 times a year, not because margins are high. A fifth of pre-tax profit comes from Japanese-partnered JVs (Toyoda Gosei airbags, Roki filters, Denso Ten infotainment, Tokai Rika seatbelts) that it does not consolidate, and ~7% of profit belongs to minority partners in subsidiaries it does consolidate. Both matter for valuation: the JVs are in EPS but not in EBITDA.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Growth eats the cash: ₹6,100 cr of capex in six years, free cash flow near zero',
  blocks: [
    { p: 'Uno Minda reinvests almost everything. Over FY21-26 it generated ₹5,299 cr of operating cash, spent ₹6,129 cr on capex, ₹452 cr on acquisitions and partner buy-outs (Screener), and paid ₹524 cr of dividends (payout 12-14% of profit). Net debt (borrowings incl. leases less cash and investments, which include ₹924 cr of JV stakes at book) rose from ₹390 cr to ₹1,431 cr; on the company\'s definition (excluding leases and JV book value) it was ₹2,179 cr at Mar-2026, 0.30x equity. FY27 capex is guided at ₹1,750 cr, the highest ever, with ₹3,788 cr of announced projects (₹1,406 cr already spent by Jun-2026). Returns have held up: ROCE 18-20% on Screener\'s basis since FY23 (the company\'s 19.2% in FY26 includes land and CWIP not yet earning).' },
    { pair: [
      { type: 'column', title: 'Capex has matched or beaten operating cash flow in most years', unit: '₹ crore', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 20% before Covid, 11% in FY20-21, 18-20% since FY23', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '1,529', '3,770', '5,299'],
      ['Capex (cash)', '1,852', '4,277', '6,129'],
      ['Acquisitions and partner buy-outs', '299', '153', '452'],
      ['Dividends paid', '113', '411', '524'],
      { hl: true, cells: ['**Funded by debt and equity**', '**−735**', '**−1,071**', '**−1,806**'] },
      ['Memo: FY27E guided capex', '', '', '1,750'],
    ], source: 'Screener.in cash flow (consolidated); Q4FY26 call (FY27 capex). Equity issued: ESOPs and shares for business combinations only (no QIP since FY21).' } },
    { callout: '**The capital question:** the business needs ~8% of revenue as capex to grow ~20% a year (FY22-26 average 8.2%), so free cash flow stays thin while growth lasts. That is fine at 18-20% ROCE. The risk is the new categories (EV powertrain ₹1,200 cr, PV seating ₹320 cr, sunroof): management promises ">2x" asset turns and target margins "in the third full year of production", but the 4W EV plant depends on a Chinese partner (Inovance) whose approvals are still pending.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Moderate debt (~1x EBITDA) to fund the build-out; working capital tight at 12 days',
  blocks: [
    { p: 'At Mar-2026 Uno Minda had ₹2,537 cr of borrowings (₹1,069 cr long term, ₹1,468 cr short term) and ₹203 cr of lease liabilities, against ₹358 cr of cash and bank balances: net debt ₹2,179 cr on the company\'s definition, ~1.0x FY26 EBITDA and 0.30x equity. Its investments of ₹951 cr are mostly the JV stakes at book value (₹924 cr); the market value of those JVs is far higher (our FY27E share of their profit is ₹{{as.build.jv.0|num}} cr). Working capital is lean: receivables 50 days, inventory 62 days, payables 75 days. In our model net debt peaks in FY27E (capex ₹1,750 cr) and falls from FY28E as the new plants earn.' },
    { pair: [
      { type: 'line', title: 'Receivable days down from 69 to 50; payables down from 120 to 75', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt (incl. leases, net of JV book value) rose with capex', unit: 'Net debt (₹ crore), Screener basis', x: 'A.labels', from: 'FY16', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co + '. Investments (mostly JV stakes at book) are netted; company net debt FY26 ₹2,179 cr.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (incl. JV stakes at book)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Minority interests (₹431 cr at Mar-26) sit outside owners\' net worth.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Minda family 68.4%, Indian institutions 17.5%, foreign funds 8%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds down from 10% to 8%; Indian institutions up to 17.5%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter stake steady at ~68.4%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 75, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 100 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income incl. JV share (forecast: net of minorities, grossed up for tax)', flag: { type: 'pct', th: 40 } },
      { key: 'interest', name: 'Finance cost' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 30 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income incl. JV share and exceptional items' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (owners)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./UNOMINDA.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'UNOMINDA.research.js')) ? require('./UNOMINDA.research') : null;
  const report = {
    symbol: 'UNOMINDA', listing: 'NSE: UNOMINDA · BSE: 532539', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  // research JSONs write rupees as 'Rs'; show them as ₹ in the report
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1).replace(/(^|[^A-Za-z])Rs ?(?=[0-9~])/g, '$1₹'));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
