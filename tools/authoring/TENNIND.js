// Authoring source for the Tenneco Clean Air India initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; FY23-FY26 are the pooled, restated
// accounts after the Mar-2025 common-control combination; TENNIND.patch.js drops the FY21-22 standalone shell years).
// Part B (TENNIND.research.js + part2-6, shared TENNIND.ctx.js) adds the research chapters. TENNIND.val.js first syncs
// the derived multiples into assumptions.json. Usage: node tools/authoring/TENNIND.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'TENNIND', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(2[3-9])$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated, restated after the Mar-2025 combination), GAM Research' };
const MA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'TENNIND.json'), 'utf8')).annual;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sumR = (k, a, z) => MA[k].slice(MA.labels.indexOf(a), MA.labels.indexOf(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cash4 = { cfo: sumR('cfo', 'FY23', 'FY26'), capex: sumR('capex', 'FY23', 'FY26'), div: sumR('dividendsPaid', 'FY23', 'FY26') };
const left = cash4.cfo - cash4.capex - cash4.div;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue grew 4% a year in FY23-26 but EBITDA 17%: the margin story is mix and pass-through, not volume',
  blocks: [
    { p: 'Reported revenue went from ₹4,827 cr in FY23 to ₹5,404 cr in FY26, only 4% a year, and fell 11% in FY25. That understates the business: revenue includes substrates (ceramic catalysts coated with platinum, palladium and rhodium) that Tenneco buys at the customer\'s direction and bills at cost. Substrates were ₹925-1,199 cr in FY23-24 and ~₹490-510 cr in FY25-26 (the company does not explain the drop; precious-metal prices and customer sourcing both move it). Value-added revenue (VAR, revenue less substrates) grew 8% a year, from ₹3,902 cr to ₹4,918 cr. EBITDA rose from ₹571 cr to ₹925 cr (17% a year): 14.6% of VAR in FY23, 18.8% in FY26. Net profit rose from ₹381 cr to ₹604 cr (₹624 cr before the FY26 labour-code charge).' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹4,827 cr in FY23, ₹5,404 cr in FY26 (substrates swing it)', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY23', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: ₹381 cr to ₹604 cr, +17% a year', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY23', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY26 after a ₹20 cr (post-tax) labour-code charge.' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin on revenue: 11.8% in FY23, 17.1% in FY26', unit: 'EBITDA margin on revenue (%)', x: 'fin.labels', from: 'FY23', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 8, max: 20, source: SRC.co },
      { type: 'line', title: 'Materials fell from 71% to 65% of revenue as substrates left the bill', unit: '% of revenue', x: 'fin.labels', from: 'FY23', to: 'FY26', series: [{ name: 'Materials', ref: 'A.materialPct', fmt: 'pct0' }, { name: 'Employees', ref: 'A.employeePct', fmt: 'pct0' }], labels: 'all', source: 'Screener.in cost split' },
    ] },
    { callout: '**Our view:** judge Tenneco India on VAR, as management does, but remember the royalty (2.5%) is charged on revenue including substrates. The real improvement is the VAR margin: +4 points in three years, from P3 cost programmes, better plant loading and a richer ride-control mix. Volume growth was ordinary until FY26 (VAR +5.9% a year FY23-25, per the company); FY26 (+12.3%) and Q1FY27 (+18.4%) are the first years of faster growth.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: `Little capital, a lot of cash: ₹${n0(cash4.capex)} cr of capex in four years, ₹${n0(cash4.div)} cr paid to the parent`,
  blocks: [
    { p: `Over FY23-26 the business generated ₹${n0(cash4.cfo)} cr of operating cash (~₹2,350 cr without the ₹663 cr Motocare receipt in FY26), spent ₹${n0(cash4.capex)} cr on capex and paid ₹${n0(cash4.div)} cr of dividends, all of it to Tenneco before the IPO. Capex has been only 1-2% of revenue because the plants were built for BS-VI and were under-used; that is changing. FY27 capex is guided at ₹350-450 cr ('indicative', from internal cash), including ₹140 cr for two greenfields (Kharkhoda, Haryana, Clean Air; western India, ride control). The company reports ROCE of 57% for FY25 and 94% for FY26 (Screener: 57% and 61%); the gap is capital employed: after the pre-IPO dividends, equity fell to ₹1,198 cr at Mar-2026.` },
    { pair: [
      { type: 'column', title: 'Operating cash covered capex many times; dividends took the rest', unit: '₹ crore', x: 'A.labels', from: 'FY23', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }, { name: 'Dividends paid', ref: 'A.dividendsPaid', fmt: 'num' }], labels: 'none', source: SRC.co + '. FY26 operating cash includes the ₹663 cr Motocare collection.' },
      { type: 'line', title: 'ROCE (Screener basis): 33% in FY23, 61% in FY26', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 80, source: 'Screener.in. Company-reported ROCE: 57% (FY25), 94% (FY26).' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went, FY23-FY26 (₹ crore)', head: ['', 'Four years'], rows: [
      ['Cash from operations', n0(cash4.cfo)], ['of which Motocare sale proceeds collected (FY26, other working-capital items)', '663'], ['Capex (cash)', n0(cash4.capex)], ['Dividends paid (all to Tenneco, pre-IPO)', n0(cash4.div)],
      { hl: true, cells: ['**Left over**', `**${n0(left)}**`] },
      ['Memo: FY27E capex guidance', '350-450'], ['Memo: cash at Mar-2026', '571'],
    ], source: 'Screener.in cash flow and schedules; AR FY26 (dividends, note 39 Motocare); Q1FY27 call (capex)' } },
    { callout: '**The capital question:** for four years the cash went to the parent. Now the company says it will fund ₹350-450 cr of capex and keep options open for acquisitions; it paid no final dividend for FY26. Minority shareholders should watch two things: whether capex earns the returns of the old plants, and whether any acquisition is bought from the Tenneco group (a related-party deal) rather than from outside.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'No debt, negative working capital, ₹571 cr of cash at Mar-2026',
  blocks: [
    { p: 'At Mar-2026 Tenneco India had no bank debt, ₹51 cr of lease liabilities and ₹571 cr of cash: net cash ₹520 cr. Working capital is negative (company: −8 days of net working capital excluding cash; cash-conversion cycle −23 days) because suppliers are paid in ~111 days while customers pay in ~43 and stock turns in ~35. Equity is small (₹1,198 cr) after ₹1,037 cr of pre-IPO dividends, which is why returns on equity (~43%) and capital look so high.' },
    { pair: [
      { type: 'line', title: 'Payables run far ahead of receivables and stock', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net cash (negative = net cash): ₹520 cr at Mar-2026', unit: 'Net debt incl. lease liabilities (₹ crore)', x: 'A.labels', from: 'FY23', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co + '. Borrowings (leases only) less cash.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.0|num}}', '{{A.netWorth.1|num}}', '{{A.netWorth.2|num}}', '{{A.netWorth.3|num}}'],
      ['Borrowings (lease liabilities)', '{{A.borrowings.0|num}}', '{{A.borrowings.1|num}}', '{{A.borrowings.2|num}}', '{{A.borrowings.3|num}}'],
      ['Cash', '{{A.cashAndInvestments.0|num}}', '{{A.cashAndInvestments.1|num}}', '{{A.cashAndInvestments.2|num}}', '{{A.cashAndInvestments.3|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.0|num}}', '{{A.fixedAssets.1|num}}', '{{A.fixedAssets.2|num}}', '{{A.fixedAssets.3|num}}'],
      ['Inventories', '{{A.inventories.0|num}}', '{{A.inventories.1|num}}', '{{A.inventories.2|num}}', '{{A.inventories.3|num}}'],
      ['Trade receivables', '{{A.receivables.0|num}}', '{{A.receivables.1|num}}', '{{A.receivables.2|num}}', '{{A.receivables.3|num}}'],
      ['Trade payables', '{{A.payables.0|num}}', '{{A.payables.1|num}}', '{{A.payables.2|num}}', '{{A.payables.3|num}}'],
    ], source: SRC.co + '. Mar-2025 other assets include the ₹829 cr Motocare consideration receivable (collected in FY26).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Tenneco 74.8% at Jun-2026, then a 15% block sale in August',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds up from 8.4% to 9.7%; Indian funds ~11-13%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter stake 74.79% from listing to Jun-2026', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 80, source: 'BSE shareholding pattern, Screener.in. The Aug-2026 block (15.0%) falls in the Sep-2026 quarter.' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY23–FY29E', rows: [
      { key: 'sales', name: 'Revenue (incl. pass-through substrates)', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin % (on revenue)', fmt: 'pct', flag: { type: 'bps', th: 100 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (history: net of exceptional items)', flag: { type: 'pct', th: 60 } },
      { key: 'interest', name: 'Finance cost' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
      { key: 'cfo', name: 'Cash from operations', flag: { type: 'pct', th: 60 } },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin % (on revenue)', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (net of exceptional items)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./TENNIND.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'TENNIND.research.js')) ? require('./TENNIND.research') : null;
  const report = {
    symbol: 'TENNIND', listing: 'NSE: TENNIND · BSE: 544612', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  // research JSONs write rupees as 'Rs'; show them as ₹ in the report
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1).replace(/(^|[^A-Za-z])Rs ?(?=[0-9~])/g, '$1₹'));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
