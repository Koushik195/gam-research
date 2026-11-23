// Authoring source for the Motherson Sumi Wiring India (MSWIL) initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, standalone; MSWIL has no subsidiaries). Part B
// (MSUMI.research.js + part2-6, shared MSUMI.ctx.js) adds the research chapters. MSUMI.patch.js drops the pre-demerger
// FY21 column and restates EPS on 663.17 cr shares. MSUMI.val.js first syncs the derived multiples into assumptions.json.
// Usage: node tools/authoring/MSUMI.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'MSUMI', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(2[2-9])$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (standalone), GAM Research' };
const MA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'MSUMI.json'), 'utf8')).annual;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sumR = (k, a, z) => MA[k].slice(MA.labels.indexOf(a), MA.labels.indexOf(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cash5 = { cfo: sumR('cfo', 'FY22', 'FY26'), capex: sumR('capex', 'FY22', 'FY26'), div: sumR('dividendsPaid', 'FY22', 'FY26') };
const left = cash5.cfo - cash5.capex - cash5.div;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue doubled in four years; the EBITDA margin fell from 13% to 9%, so profit grew only half as fast',
  blocks: [
    { p: 'MSWIL\'s revenue was ₹5,635 cr in FY22, its first year as a separate company, and ₹11,478 cr in FY26: 19% a year (the demerged business had ₹3,938 cr in FY21). Net profit rose from ₹411 cr (₹457 cr before its share of the reorganisation-scheme costs) to ₹625 cr: 11% a year on the reported figure, 8% on the clean one. The difference is the margin. EBITDA was 13.0% of revenue in FY22 and 9.2% in FY26, for three reasons: copper prices rose and are passed on at cost (more revenue, no more profit); the new greenfield plants lost ₹122-127 cr a year in FY25-26 while they ramped up; and wages rose faster than the price customers pay for assembly. Depreciation doubled (₹106 cr to ₹216 cr) as new plants, mostly leased from SAMIL, came in.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹5,635 cr in FY22, ₹11,478 cr in FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: +11% a year, flat for three years', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY22 after a ₹46 cr (post-tax) charge for reorganisation-scheme costs.' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 13% in FY22, 9.2% in FY26', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY22', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 6, max: 14, source: SRC.co },
      { type: 'line', title: 'Raw materials rose to 67% of revenue; staff cost stays at 16-17%', unit: '% of revenue', x: 'fin.labels', from: 'FY22', to: 'FY26', series: [{ name: 'Materials', ref: 'A.materialPct', fmt: 'pct0' }, { name: 'Employees', ref: 'A.employeePct', fmt: 'pct0' }], labels: 'all', source: 'Screener.in cost split' },
    ] },
    { callout: '**Our view:** MSWIL is a high-return assembler, not a high-margin one. Each rupee of fixed assets turns over ~15 times a year, so even a 9% margin gives ROCE near 40%. What has gone wrong is the margin, and most of that is either timing (copper lag, greenfield start-up) or permanent arithmetic (copper at a higher price inflates revenue). The part that is a real cost, wages, depends on how much customers agree to pay.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: `Little capital needed: ₹${n0(cash5.capex)} cr of capex in five years, ₹${n0(cash5.div)} cr paid out as dividends`,
  blocks: [
    { p: `Over FY22-26 MSWIL generated ₹${n0(cash5.cfo)} cr of operating cash, spent ₹${n0(cash5.capex)} cr on capex and paid ₹${n0(cash5.div)} cr of dividends (55-65% of profit). Capex is small because most buildings are leased (largely from SAMIL; lease liabilities ₹223 cr at Mar-2026) and harness assembly needs jigs, test boards and crimping machines rather than heavy plant. FY26 capex of ₹201 cr went ₹126 cr to greenfields and ₹75 cr to existing plants; FY27 is guided at ~₹200 cr from internal cash. Operating cash swings with working capital: ₹761 cr in FY26 but ₹365 cr in FY25. Returns stay very high: ROCE 39-48% in FY23-26 on Screener's basis (88% in FY22 on a part-year balance sheet).` },
    { pair: [
      { type: 'column', title: 'Operating cash covers capex several times over', unit: '₹ crore', x: 'A.labels', from: 'FY22', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }, { name: 'Dividends paid', ref: 'A.dividendsPaid', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 44-48% in FY23-24, 39% in FY26', unit: 'Return on capital employed (%), Screener basis', x: RL.slice(1), series: [{ name: 'ROCE', values: RR('ROCE %').slice(1), fmt: 'pct0' }], labels: 'all', min: 0, max: 60, source: 'Screener.in (FY22 omitted: part-year capital base after the demerger)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went, FY22-FY26 (₹ crore)', head: ['', 'Five years'], rows: [
      ['Cash from operations', n0(cash5.cfo)], ['Capex (cash)', n0(cash5.capex)], ['Dividends paid', n0(cash5.div)],
      { hl: true, cells: ['**Left over (before lease payments)**', `**${n0(left)}**`] },
      ['Memo: lease payments to SAMIL and others, FY26', '~115'], ['Memo: FY27E capex guidance', '~200'],
    ], source: 'Screener.in cash flow; AR FY26 note 31 (lease payments ₹95 cr to SAMIL, ₹20 cr to other related parties); Q4FY26 call' } },
    { callout: '**The capital question:** there is not much of one. MSWIL pays out ~62% of profit and still has no net debt outside leases. The question is the other way round: because the JV partners make the parts and own the buildings, a large share of the capital (and of the value) in this chain sits with SAMIL and Sumitomo, not with MSWIL\'s minority shareholders.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Debt-free except leases; working capital jumped in FY26 with copper',
  blocks: [
    { p: 'At Mar-2026 MSWIL had ₹10 cr of bank debt and ₹223 cr of lease liabilities against ₹66-69 cr of cash: net debt ₹167 cr including leases, net cash ₹56 cr without them (company basis). By Jun-2026 bank debt rose to ₹61 cr and cash fell to ₹21 cr (net debt ₹40 cr before leases), as higher copper prices tied up money in stock and receivables. Inventory rose from ₹1,282 cr to ₹1,730 cr in FY26 and receivables from ₹1,244 cr to ₹1,884 cr; payables rose too (₹1,179 cr to ₹1,983 cr), and ₹1,108 cr of the payables are owed to the two JV partners, which therefore fund part of MSWIL\'s working capital.' },
    { pair: [
      { type: 'line', title: 'Receivable days rose from 39 to 60 in two years', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt including leases (negative = net cash)', unit: 'Net debt incl. lease liabilities (₹ crore)', x: 'A.labels', from: 'FY22', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co + '. Borrowings (incl. leases) less cash.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.0|num}}', '{{A.netWorth.2|num}}', '{{A.netWorth.3|num}}', '{{A.netWorth.4|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.0|num}}', '{{A.borrowings.2|num}}', '{{A.borrowings.3|num}}', '{{A.borrowings.4|num}}'],
      ['Cash', '{{A.cashAndInvestments.0|num}}', '{{A.cashAndInvestments.2|num}}', '{{A.cashAndInvestments.3|num}}', '{{A.cashAndInvestments.4|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.0|num}}', '{{A.fixedAssets.2|num}}', '{{A.fixedAssets.3|num}}', '{{A.fixedAssets.4|num}}'],
      ['Inventories', '{{A.inventories.0|num}}', '{{A.inventories.2|num}}', '{{A.inventories.3|num}}', '{{A.inventories.4|num}}'],
      ['Trade receivables', '{{A.receivables.0|num}}', '{{A.receivables.2|num}}', '{{A.receivables.3|num}}', '{{A.receivables.4|num}}'],
      ['Trade payables', '{{A.payables.0|num}}', '{{A.payables.2|num}}', '{{A.payables.3|num}}', '{{A.payables.4|num}}'],
    ], source: SRC.co + '. Q1FY27 presentation p5 (Jun-2026 debt and cash).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: SAMIL 33.4%, Sumitomo 25.1%, Indian funds 17.9%, foreign funds down to 8.9%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds down from 11% to 9%; Indian institutions up to 18%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter stake fixed at 61.7% since listing', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 70, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY22–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 100 } },
      { key: 'dep', name: 'Depreciation (incl. leased buildings)' },
      { key: 'otherIncome', name: 'Other income (history: net of exceptional items)', flag: { type: 'pct', th: 60 } },
      { key: 'interest', name: 'Finance cost (mostly lease interest)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
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
  require('./MSUMI.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'MSUMI.research.js')) ? require('./MSUMI.research') : null;
  const report = {
    symbol: 'MSUMI', listing: 'NSE: MSUMI · BSE: 543498', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  // research JSONs write rupees as 'Rs'; show them as ₹ in the report
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1).replace(/(^|[^A-Za-z])Rs ?(?=[0-9~])/g, '$1₹'));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
