// Authoring source for the Asahi India Glass initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; minorities negligible). Part B
// (ASAHIINDIA.research.js + part2-6, shared ASAHIINDIA.ctx.js) adds the research chapters.
// ASAHIINDIA.val.js first syncs the derived multiples into assumptions.json. Usage: node tools/authoring/ASAHIINDIA.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ASAHIINDIA', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(1[6-9]|2\d)$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const MA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'ASAHIINDIA.json'), 'utf8')).annual;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sumR = (k, a, z) => MA[k].slice(MA.labels.indexOf(a), MA.labels.indexOf(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cash6 = { cfo: [sumR('cfo', 'FY21', 'FY23'), sumR('cfo', 'FY24', 'FY26')], capex: [sumR('capex', 'FY21', 'FY23'), sumR('capex', 'FY24', 'FY26')], div: [sumR('dividendsPaid', 'FY21', 'FY23'), sumR('dividendsPaid', 'FY24', 'FY26')] };
const net = i => cash6.cfo[i] - cash6.capex[i] - cash6.div[i];

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue doubled in five years; profit is where it was in FY22 because float glass and new capacity swung the margin',
  blocks: [
    { p: 'AIS\'s revenue was ₹2,421 cr in FY21 and ₹4,982 cr in FY26: 15.5% a year. Automotive glass did most of the work (gross segment revenue ₹1,346 cr to ₹3,383 cr) as Indian car output recovered from Covid and each car carried more and better glass. Profit did not follow. Net profit jumped from ₹131 cr (FY21) to ₹343 cr (FY22) when import prices of float glass soared and AIS\'s float business earned a 34% EBITDA margin, then stalled at ₹325-367 cr for four years as float prices normalised, energy and soda ash rose (auto EBITDA margin 12% in FY23) and the new Soniyana float line and Patan auto capacity added depreciation (₹160 cr in FY23, ₹285 cr in FY26) and interest (₹105 cr to ₹204 cr) before they added profit. Because of the Sep-2025 QIP, FY26 EPS (₹13.8 reported, on weighted shares) was lower than in FY22 (₹14.2). The turn came in H2FY26: EBITDA of ₹250 cr, ₹287 cr and then ₹325 cr in Q1FY27 (23.0% margin), with profit ₹149 cr in Q1FY27 alone.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹2,421 cr in FY21, ₹4,982 cr in FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: a jump in FY22, then flat for four years', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 24% at the float-glass peak (FY22), 17% in FY24-25, 18% in FY26', unit: 'EBITDA margin excl. other income (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 26, source: SRC.co },
      { type: 'column', title: 'Depreciation and interest: ₹265 cr in FY23, ₹489 cr in FY26', unit: '₹ crore', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Depreciation', ref: 'fin.dep', fmt: 'num' }, { name: 'Finance cost', ref: 'fin.interest', fmt: 'num' }], labels: 'none', source: SRC.co + '. Soniyana float line (FY25), Patan phase 2 and Kharkhoda (FY25-26).' },
    ] },
    { callout: '**Our view:** AIS is two businesses with different economics. Automotive glass is a near-monopoly supplier to Indian car makers with steady 15-17% EBITDA margins and no pricing power over its customers. Float glass is a commodity whose profit is set by import prices, energy and trade policy; it made AIS look brilliant in FY22-23 and ordinary in FY24-25. The earnings recovery since H2FY26 is real, but most of it comes from float glass, the part of the business we trust least.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: `₹${n0(cash6.capex[1])} cr of capex in three years, paid for with debt and a ₹1,000 cr QIP; returns have halved`,
  blocks: [
    { p: `Over FY21-23 AIS generated ₹${n0(cash6.cfo[0])} cr of operating cash, spent ₹${n0(cash6.capex[0])} cr on capex and cut net debt from ₹1,693 cr (FY20) to ₹1,171 cr (FY23). Then it ran the largest investment programme in its history: ₹${n0(cash6.capex[1])} cr in FY24-26 (the third float line at Soniyana, Rajasthan; the Roorkee float cold repair; Patan phase 2; an on-site assembly unit inside Maruti's Kharkhoda plant), against ₹${n0(cash6.cfo[1])} cr of operating cash. Net debt rose to ₹2,481 cr (FY25, 3.2x EBITDA) until a ₹1,000 cr QIP in Sep-2025 (1.18 crore shares at ₹845, +4.9% to the share count) repaid debt: ₹1,875 cr at Mar-2026 on Screener's basis (₹2,059 cr of borrowings on the company's). In Jan-2026 the board approved up to ₹2,000 cr more for greenfield float, coatings and processing capacity. Returns fell: ROCE 21% in FY22-23, 11% in FY26 (Screener), ROE 10.5%.` },
    { pair: [
      { type: 'column', title: 'Capex ran ahead of operating cash in FY24-26', unit: '₹ crore', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 21% at the float peak, 11% in FY26', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 25, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(cash6.cfo[0]), n0(cash6.cfo[1]), n0(cash6.cfo[0] + cash6.cfo[1])],
      ['Capex (cash)', n0(cash6.capex[0]), n0(cash6.capex[1]), n0(cash6.capex[0] + cash6.capex[1])],
      ['Dividends paid', n0(cash6.div[0]), n0(cash6.div[1]), n0(cash6.div[0] + cash6.div[1])],
      { hl: true, cells: ['**Left over (debt or equity raised if negative)**', `**${n0(net(0))}**`, `**${n0(net(1))}**`, `**${n0(net(0) + net(1))}**`] },
      ['Memo: QIP proceeds (Sep-2025, net)', '', '994', '994'],
      ['Memo: greenfield capex approved (Jan-2026)', '', '', 'up to 2,000'],
    ], source: 'Screener.in cash flow (consolidated); AR FY26; Q3FY26 results letter (30-Jan-2026)' } },
    { callout: '**The capital question:** the chairman writes that "the next phase must be about consolidation, optimisation, superior cash generation and higher returns" (AR FY26). Yet the next ₹2,000 cr is already approved, mostly for float glass, the business whose margin depends on import prices. If it is spent over FY27-29 as we assume, free cash flow stays near zero and net debt near ₹2,200 cr until the new capacity earns.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net debt ₹1,875 cr (2.1x EBITDA) after the QIP; inventory is the big working-capital item',
  blocks: [
    { p: 'At Mar-2026 AIS had ₹2,198 cr of borrowings incl. leases (₹2,059 cr of debt on the company\'s basis: debt-equity 0.52x, debt/EBITDA 2.15x, down from 0.96x and 3.17x) against ₹323 cr of cash and investments: net debt ₹1,875 cr, 2.1x FY26 EBITDA. Net worth rose to ₹3,932 cr with the QIP. Glass making needs stocks of sand, soda ash and finished glass across 15 plants and 11 warehouses: inventories were ₹1,227 cr (~90 days of revenue), receivables only ₹509 cr (~37 days; car makers pay fast) and payables ₹891 cr. A ₹329 cr state capital grant for Soniyana was booked in FY26 as deferred income (in other liabilities) and is released into revenue at ~₹18 cr a year.' },
    { pair: [
      { type: 'line', title: 'Working-capital days: inventory is high, receivables low', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in (days on cost of materials, so inventory and payable days look large)' },
      { type: 'column', title: 'Net debt: ₹1,065 cr in FY22, ₹2,481 cr in FY25, ₹1,875 cr after the QIP', unit: 'Net debt (₹ crore), Screener basis', x: 'A.labels', from: 'FY16', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co + '. Borrowings incl. leases less cash and investments.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Mar-26 net worth includes the ₹1,000 cr QIP.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: AGC, the Labroo family and Maruti hold 51.6%; institutions only ~10%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Institutions doubled their stake in the Sep-2025 QIP quarter', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters diluted from 54.1% to 51.6% by the QIP', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 60, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (excl. other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation', flag: { type: 'pct', th: 30 } },
      { key: 'otherIncome', name: 'Other income (history: net of exceptional items)', flag: { type: 'pct', th: 50 } },
      { key: 'interest', name: 'Finance cost', flag: { type: 'pct', th: 30 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex', flag: { type: 'pct', th: 50 } },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (excl. other income)' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (net of exceptional items)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'interest', name: 'Finance cost' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./ASAHIINDIA.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'ASAHIINDIA.research.js')) ? require('./ASAHIINDIA.research') : null;
  const report = {
    symbol: 'ASAHIINDIA', listing: 'NSE: ASAHIINDIA · BSE: 515030', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  // research JSONs write rupees as 'Rs'; show them as ₹ in the report
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1).replace(/(^|[^A-Za-z])Rs ?(?=[0-9~])/g, '$1₹'));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
