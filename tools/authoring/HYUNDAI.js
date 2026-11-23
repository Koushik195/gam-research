// Authoring source for the Hyundai Motor India initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; FY19-FY20 standalone).
// Part B (HYUNDAI.research.js + part2-6, shared HYUNDAI.ctx.js) adds the research chapters. HYUNDAI.mult.js
// first writes the derived multiples into assumptions.json. Usage: node tools/authoring/HYUNDAI.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'HYUNDAI', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => `${p.slice(4, 8)}-05-30` <= '2026-09-30' && /^Mar \d{4}$/.test(p));
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(6, 8));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated from FY21; FY19-FY20 standalone), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 73% since FY21, but profit peaked in FY24 and has fallen for two years',
  blocks: [
    { p: 'Hyundai India\'s revenue went from ₹40,972 cr in FY21, a Covid year, to ₹69,829 cr in FY24 (+19% a year) as chip supply returned, SUVs (Creta, Venue, then Exter) took over the range and exports grew. Then growth stopped: revenue was ₹69,193 cr in FY25 and ₹70,763 cr in FY26 (+2%), because domestic volumes fell two years running (614,721 → 598,666 → 584,906) while M&M, Tata and Maruti launched more SUVs. EBITDA margin peaked at 13.0% in FY24 and slid to 12.1% in FY26 and 9.3% in Q1FY27. Net profit peaked at ₹6,060 cr (EPS ₹74.6) in FY24 and fell to ₹5,432 cr (₹66.9) in FY26; the year to Jun-2026 was ₹4,950 cr (₹60.9).' },
    { pair: [
      { type: 'column', title: 'Revenue: fast to FY24, flat since', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit peaked at ₹6,060 cr in FY24', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 13.0% in FY24, 12.1% in FY26', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 8, max: 15, source: SRC.co },
      { type: 'column', title: 'Other income is 12-19% of pre-tax profit', unit: 'Other income, % of profit before tax', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Share of PBT', ref: 'fin.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** FY21-FY24 was a cyclical recovery plus a product cycle (Creta, Venue, Exter, Alcazar) that Hyundai has not repeated since; FY25-FY26 show what happens when rivals out-launch it. Depreciation is the other drag: the ₹6,986 cr Pune plant came on stream in Oct-2025 and Hyundai plans ₹45,000 cr of investment over FY26-FY30, so depreciation will grow faster than revenue for a few years.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'High returns on a lean balance sheet; capex now doubling and dividends to the parent first',
  blocks: [
    { p: 'Hyundai runs on negative working capital: suppliers are paid in ~52 days while inventory is ~26 days and customers pay in ~11, so dealers and suppliers fund the business. Over FY21-FY26 cash from operations was ₹38,043 cr, capex ₹18,928 cr and dividends ₹19,994 cr, of which ₹15,436 cr went out in FY24 (mostly to Hyundai Motor Company) before the IPO. Reported ROE of 30-42% in FY24-FY26 is inflated by that pre-IPO payout, which shrank equity to ₹10,666 cr at Mar-2024. On a normal balance sheet returns are still high (ROCE 38% in FY26 on Screener\'s basis), but they are falling as capex rises: ₹4,266 cr in FY26, ~₹7,500 cr guided for FY27, and a ₹45,000 cr plan to FY30 (Pune Phase 2 and 3, electrification, 26 launches).' },
    { pair: [
      { type: 'column', title: 'Capex is catching up with operating cash flow', unit: '₹ crore', x: 'A.labels', from: 'FY21', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 23% in FY21, 54% in FY25 (shrunken equity), 38% in FY26', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 60, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '17,125', '20,918', '38,043'],
      ['Capex', '6,109', '12,819', '18,928'],
      ['Dividends paid', '2,852', '17,142', '19,994'],
      { hl: true, cells: ['**Left over**', '**8,164**', '**−9,043**', '**−879**'] },
      ['Memo: cash and bank balances at the end', '17,741 (Mar-23)', '10,552 (Mar-26)', ''],
    ], source: 'Screener.in cash flow (consolidated). FY24 dividends of ₹15,436 cr were paid before the Oct-2024 IPO.' } },
    { callout: '**The capital question:** the IPO raised nothing for Hyundai India (Hyundai Motor Company sold 17.5% for ₹27,859 cr), and the cash pile was largely paid to the parent beforehand. With capex of ₹7,500-8,500 cr a year and a ~32% payout, we expect free cash flow near zero in FY27E and modest after that; net cash falls from ~₹9,500 cr to ~₹7,000-8,000 cr. That is still a strong balance sheet, but it is no longer a cash story.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ~₹9,500 cr, negative working capital and a new ₹7,000 cr plant',
  blocks: [
    { p: 'At Mar-2026 Hyundai held ₹10,552 cr of cash and bank deposits against ₹1,098 cr of borrowings (mainly a Tamil Nadu sales-tax soft loan and leases): ~₹9,450 cr net, ~₹116 a share. Net fixed assets almost doubled to ₹13,070 cr after the Pune (Talegaon) plant, acquired from General Motors in Aug-2023 and re-equipped for ₹6,986 cr, was capitalised; CWIP fell from ₹4,718 cr to ₹725 cr. Other current financial assets (₹663 cr) are mainly incentives due from the Tamil Nadu and Maharashtra governments. Contingent liabilities are material but old: a ₹420 cr Competition Commission penalty under appeal, tax and duty demands (GST cess ₹259 cr plus an equal penalty, stayed by the Madras High Court).' },
    { pair: [
      { type: 'line', title: 'Suppliers fund the business: payables twice inventory', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Cash fell by half in FY24 (pre-IPO dividends) and is rebuilding', unit: 'Cash and bank balances (₹ crore)', x: 'A.labels', from: 'FY21', series: [{ name: 'Cash', ref: 'A.cash', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.3|num}}', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.3|num}}', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}', '{{A.borrowings.7|num}}'],
      ['Cash and bank balances', '{{A.cash.3|num}}', '{{A.cash.5|num}}', '{{A.cash.6|num}}', '{{A.cash.7|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.3|num}}', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.7|num}}'],
      ['Capital work in progress', '{{A.cwip.3|num}}', '{{A.cwip.5|num}}', '{{A.cwip.6|num}}', '{{A.cwip.7|num}}'],
      ['Inventories', '{{A.inventories.3|num}}', '{{A.inventories.5|num}}', '{{A.inventories.6|num}}', '{{A.inventories.7|num}}'],
      ['Trade receivables', '{{A.receivables.3|num}}', '{{A.receivables.5|num}}', '{{A.receivables.6|num}}', '{{A.receivables.7|num}}'],
      ['Trade payables', '{{A.payables.3|num}}', '{{A.payables.5|num}}', '{{A.payables.6|num}}', '{{A.payables.7|num}}'],
    ], source: SRC.co + '. Contingent liabilities: AR FY26 note 35.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Hyundai Motor Company 82.5%; a 17.5% float now held mostly by Indian funds',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds halved their holding; Indian funds bought', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Retail shareholders: 12.6 lakh after the IPO, 7.7 lakh now', unit: 'Number of shareholders', x: 'SH.periods', series: [{ name: 'Shareholders', ref: 'SH.rows.No. of Shareholders', fmt: 'num' }], labels: 'ends', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY19–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 100 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 15 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 8 }, hl: true },
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
  require('./HYUNDAI.mult').syncMult();
  const B = fs.existsSync(path.join(__dirname, 'HYUNDAI.research.js')) ? require('./HYUNDAI.research') : null;
  const report = {
    symbol: 'HYUNDAI', listing: 'NSE: HYUNDAI · BSE: 544274', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
