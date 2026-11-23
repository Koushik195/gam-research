// Authoring source for the ZF Commercial Vehicle Control Systems India initiating-coverage report (as of 30-Sep-2026, Q1FY27
// basis). Part A (this file): chapters built on reported financials (Screener, consolidated; one small subsidiary, no
// minorities; per-share figures after the 5:1 bonus of Jun-2026). Part B (ZFCVINDIA.research.js + part2-6, shared
// ZFCVINDIA.ctx.js) adds the research chapters. ZFCVINDIA.val.js first syncs the derived multiples into assumptions.json.
// Usage: node tools/authoring/ZFCVINDIA.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ZFCVINDIA', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(1[6-9]|2\d)$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated from FY22; standalone before), GAM Research' };
const MA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'ZFCVINDIA.json'), 'utf8')).annual;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sumR = (k, a, z) => MA[k].slice(MA.labels.indexOf(a), MA.labels.indexOf(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cash5 = { cfo: [sumR('cfo', 'FY22', 'FY23'), sumR('cfo', 'FY24', 'FY26')], capex: [sumR('capex', 'FY22', 'FY23'), sumR('capex', 'FY24', 'FY26')], div: [sumR('dividendsPaid', 'FY22', 'FY23'), sumR('dividendsPaid', 'FY24', 'FY26')] };
const net = i => cash5.cfo[i] - cash5.capex[i] - cash5.div[i];
const tot = k => cash5[k][0] + cash5[k][1];

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue doubled from the Covid trough; margins back to ~16%, a fifth of pre-tax profit is treasury and FX income',
  blocks: [
    { p: 'ZF CV India\'s revenue was ₹2,854 cr in FY19, fell to ₹1,864 cr in FY21 (BS-VI and Covid emptied truck factories) and reached ₹4,119 cr in FY26: 17% a year from the trough, 5% a year from the FY19 peak. The truck cycle explains most of it. FY25 was a flat year (revenue +0.4%); in FY26 truck and bus production above 6 tonnes grew 16.6% after the GST cut. The mix also changed: services billed to ZF (₹504 cr) and goods exported to ZF (₹781 cr to one group company) are now ~30% of revenue. The EBITDA margin (excluding other income) recovered from 10% in FY22 to 15-16.5% in FY24-26, close to the 14-16% of FY15-FY19 but no higher. EPS (post-bonus) went from ₹24.8 (FY19) to ₹45.4 (FY26); other income, mostly interest on a ₹2,200 cr cash pile plus FX gains, was 25% of FY26 pre-tax profit.' },
    { pair: [
      { type: 'column', title: 'Revenue: a deep Covid/BS-VI hole, then +17% a year', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: ₹104 cr in FY21, ₹517 cr in FY26', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 10% in FY22, back to 15-16.5% since FY24', unit: 'EBITDA margin excl. other income (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 6, max: 20, source: SRC.co + '. The company\'s own EBITDA includes other income (FY26: 20.2% of total income).' },
      { type: 'column', title: 'Other income: 15-25% of pre-tax profit since FY23', unit: 'Other income, % of profit before tax', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Share of PBT', ref: 'fin.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: SRC.co + '. FY26 includes ₹61 cr of FX gains (AR note 19).' },
    ] },
    { callout: '**Our view:** this is a cyclical business with a structural kicker. Indian truck production sets the base (it fell by half in FY20-21), regulation adds content per vehicle (ABS, then bus ESC in 2025, all-vehicle ESC and ADAS from Oct-2027), and the parent adds exports and engineering services that smooth the cycle but earn cost-plus margins. Returns on equity are held down to ~14% by the cash pile: the operating business earns far more on its capital.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: `Self-funded and cash-rich: ₹${n0(tot('cfo'))} cr of operating cash in five years, ₹${n0(tot('capex'))} cr of capex, ₹${n0(tot('div'))} cr of dividends`,
  blocks: [
    { p: `Over FY22-26 ZF CV India generated ₹${n0(tot('cfo'))} cr of operating cash, spent ₹${n0(tot('capex'))} cr on capex (new capacity at Oragadam and Mahindra World City, the ESC test track) and paid only ₹${n0(tot('div'))} cr of dividends: the rest went into deposits and mutual funds. Net treasury rose from ₹1,269 cr (Mar-23) to ₹2,177 cr (Mar-26), ~₹191 a share and ~8% of the market value at the as-of price. Operating cash was weak in FY24-25 (receivables rose to 107 days in FY25: ZF CV Systems Global alone owed ₹437 cr at Mar-25, ₹192 cr at Mar-26) and strong in FY26 (₹810 cr) as they were collected. Capex guidance for FY27 is ₹180-190 cr. There is no buyback and the payout is ~9%: the minority's return depends on the parent's view of what to do with the cash.` },
    { pair: [
      { type: 'column', title: 'Operating cash covers capex except in FY22 and FY24', unit: '₹ crore', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co + '. FY21 capex not in the consolidated series (standalone ₹70 cr).' },
      { type: 'line', title: 'ROCE: 21-27% before Covid, 7% in FY22, ~19-21% since', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in (incl. cash in capital employed)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY22-23', 'FY24-26', 'Five years'], rows: [
      ['Cash from operations', n0(cash5.cfo[0]), n0(cash5.cfo[1]), n0(tot('cfo'))],
      ['Capex (cash)', n0(cash5.capex[0]), n0(cash5.capex[1]), n0(tot('capex'))],
      ['Dividends paid', n0(cash5.div[0]), n0(cash5.div[1]), n0(tot('div'))],
      { hl: true, cells: ['**Left over (into treasury)**', `**${n0(net(0))}**`, `**${n0(net(1))}**`, `**${n0(net(0) + net(1))}**`] },
      ['Memo: FY27E capex guidance', '', '', '180-190'],
    ], source: 'Screener.in cash flow (consolidated); Q4FY26 call (15-May-2026)' } },
    { callout: '**The capital question:** the business needs ~3-5% of revenue as capex and has funded every expansion from cash flow, yet it keeps ~₹2,200 cr earning ~6% before tax. For a minority holder that cash is worth less than its face value: dividends are ₹4 a share (~0.2% yield), and the parent, which owns 60%, has chosen to sell shares rather than ask for payouts. A special dividend or buyback would lift ROE; nothing has been signalled.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'No debt, ₹2,177 cr of net treasury; receivables are the swing item',
  blocks: [
    { p: 'At Mar-2026 ZF CV India held ₹1,435 cr of bank deposits, ₹604 cr of debt mutual funds and ₹192 cr of cash against ₹55 cr of lease liabilities and no borrowings: net treasury ₹2,177 cr (₹1,432 cr a year earlier). Net worth was ₹3,690 cr. Receivables (₹942 cr, 83 days) are the largest operating asset: they include ~₹210 cr owed by group companies (₹192 cr by ZF CV Systems Global, down from ₹437 cr a year earlier), and their swings (107 days at Mar-25) explain most of the year-to-year volatility in operating cash. Inventory rose to 43 days at Mar-26 as the company held more stock during the aluminium shortage. Contingent liabilities are small except a new ₹57 cr GST claim that management contests.' },
    { pair: [
      { type: 'line', title: 'Receivable days 80-107; payables 58-79', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Cash and investments: ₹2,232 cr at Mar-26', unit: 'Cash, deposits and investments (₹ crore)', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co + '. Includes bank deposits.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Lease liabilities (no borrowings)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash, deposits and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '; AR FY26 consolidated balance sheet and notes 4.1, 9, 12, 35 (contingent liabilities) and 35.2 (group receivables).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: ZF (via WABCO Asia) 60%, Indian institutions 25%, foreign funds 6%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Indian institutions bought what ZF sold: 16% to 25%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter: 75% until Mar-2024, 60% since Jun-2025', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (excl. other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (history: net of exceptional items)', flag: { type: 'pct', th: 40 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹, post-bonus)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (excl. other income)' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. FX)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./ZFCVINDIA.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'ZFCVINDIA.research.js')) ? require('./ZFCVINDIA.research') : null;
  const report = {
    symbol: 'ZFCVINDIA', listing: 'NSE: ZFCVINDIA · BSE: 533023', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  // research JSONs write rupees as 'Rs'; show them as ₹ in the report
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1).replace(/(^|[^A-Za-z])Rs ?(?=[0-9~])/g, '$1₹'));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
