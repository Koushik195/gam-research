// Authoring source for the JBM Auto initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated, attributable profit and a Mar-26 balance
// sheet pro forma for the Rs410 cr that JBM Ecolife upstreamed in Jun-2026, via JBMA.patch.js). Part B (JBMA.research.js +
// part2-6, shared JBMA.ctx.js) adds the research chapters. JBMA.ctx.js first syncs the segment build and the derived
// multiples into assumptions.json. Usage: node tools/authoring/JBMA.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'JBMA', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
const RT = SCR.tables.ratios;
const keepR = RT.periods.map(p => /^Mar 20(19|2[0-6])$/.test(p));
const RL = RT.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => RT.rows[k].filter((_, i) => keepR[i]);
const CF = SCR.schedules['cash-flow'];
const cf = (par, item, yrs) => yrs.reduce((s, y) => s + (CF[par][item][`Mar ${y}`] || 0), 0);
const Y1 = [2021, 2022, 2023], Y2 = [2024, 2025, 2026];
const cash = yrs => { const cfo = cf('Cash from Operating Activity', 'Profit from operations', yrs) + cf('Cash from Operating Activity', 'Working capital changes', yrs) + cf('Cash from Operating Activity', 'Direct taxes', yrs);
  const capex = -cf('Cash from Investing Activity', 'Fixed assets purchased', yrs), jv = -cf('Cash from Investing Activity', 'Other investing items', yrs) - cf('Cash from Investing Activity', 'Investments purchased', yrs) - cf('Cash from Investing Activity', 'Investments sold', yrs);
  const div = -cf('Cash from Financing Activity', 'Dividends paid', yrs), int = -cf('Cash from Financing Activity', 'Interest paid fin', yrs);
  const debt = cf('Cash from Financing Activity', 'Proceeds from borrowings', yrs) + cf('Cash from Financing Activity', 'Repayment of borrowings', yrs) + cf('Cash from Financing Activity', 'Proceeds from debentures', yrs);
  return { cfo, capex, jv, div, int, left: cfo - capex - jv - div - int, debt }; };
const c1 = cash(Y1), c2 = cash(Y2);
const f0 = v => Math.round(v).toLocaleString('en-IN');
const SRC = { co: 'Company filings, Screener.in (consolidated; attributable profit), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue tripled in five years on e-buses; the EBITDA margin stayed at 10-12% and net profit grew more slowly than debt',
  blocks: [
    { p: 'JBM Auto\'s consolidated revenue rose from ₹1,982 cr in FY21 to ₹6,088 cr in FY26 (Screener basis): 25% a year. Two engines drove it. The component division grew from ₹1,295 cr to ₹3,443 cr as Indian car and utility-vehicle output recovered and JBM won more content per vehicle. The OEM division (electric buses) grew from ₹459 cr to ₹2,307 cr, almost all of it after FY23, as city bus tenders under FAME II, PM e-Bus Sewa and state programmes were awarded on gross-cost contracts. The EBITDA margin did not move much: 10-12% every year since FY19, because buses earn a segment EBIT margin of ~11%, similar to the group. Net profit attributable to shareholders rose from ₹49 cr to ₹219 cr, but interest rose from ₹55 cr to ₹318 cr and other income (mostly interest charged to the group\'s own bus-operating JV) from ₹12 cr to ₹126 cr. FY26 EPS was ₹9.25, +8%.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹1,982 cr (FY21) to ₹6,088 cr (FY26)', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: ₹49 cr (FY21) to ₹219 cr (FY26); +8% in FY26', unit: 'Net profit, attributable (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + '. After the 15% minority in JBM Electric Vehicles.' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: stuck at 10-12% through the e-bus boom', unit: 'EBITDA margin (%), Screener basis', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: SRC.co + '. Screener\'s operating profit is after the share of JV losses.' },
      { type: 'column', title: 'Interest: ₹55 cr (FY21) to ₹318 cr (FY26), now as large as PBT', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Interest', ref: 'A.interest', fmt: 'num' }, { name: 'Profit before tax', ref: 'A.pbt', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { callout: '**Our view:** JBM Auto has grown fast, but the growth has not improved the quality of its earnings. The component business is a steady, low-margin supplier. The e-bus business has given it scale and a leading market share, but its profit comes with a large balance sheet: receivables, unbilled revenue and loans to the group\'s own operator. In FY26 interest absorbed 47% of EBITDA and other income was 41% of profit before tax.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Cash & capital', kicker: 'Capital allocation', title: 'FY21-26: a ₹2,600 cr cash shortfall after interest, paid for with debt',
  blocks: [
    { p: `JBM Auto is not a heavy capex spender (₹${f0(c2.capex)} cr in FY24-26); its cash goes into working capital and into its own bus-operating JV. Over FY24-26 cash from operations was only ₹${f0(c2.cfo)} cr (FY26: −₹60 cr) because receivables rose by ~₹2,350 cr; investments in and loans to the JV and other investing took ₹${f0(c2.jv)} cr; interest paid was ₹${f0(c2.int)} cr. The gap, ₹${f0(-c2.left)} cr, was filled with ₹${f0(c2.debt)} cr of net new borrowing. ROCE on Screener's basis has been 12-15% for five years and ROE 13-19%.` },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex: cash from operations was negative in FY22 and FY26', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE 12-15% since FY22: about the cost of capital', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 25, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26'], rows: [
      ['Cash from operations (before interest)', f0(c1.cfo), f0(c2.cfo)],
      ['Capex', f0(c1.capex), f0(c2.capex)],
      ['Investments in and loans to JVs, other investing', f0(c1.jv), f0(c2.jv)],
      ['Interest paid', f0(c1.int), f0(c2.int)],
      ['Dividends paid', f0(c1.div), f0(c2.div)],
      { hl: true, cells: ['**Left over**', `**${f0(c1.left)}**`, `**${f0(c2.left)}**`] },
      ['Funded by: net borrowing (incl. debentures)', f0(c1.debt), f0(c2.debt)],
      ['Memo: JBM Ecolife upstreaming used to repay debt (Jun-2026)', '', '~410'],
    ], source: 'Screener.in cash flow schedules (consolidated). FY25-26 other investing = mainly preference shares in and loans to JBM Ecolife Mobility (AR FY26 notes 5 and 13).' } },
    { callout: '**The capital question:** the group has chosen to be both the bus maker and, through JBM Ecolife, the bus operator. That wins tenders and fills the factory, but it means JBM Auto carries part of its customer\'s funding. Outside money (ADB/AIIB, IFC US$100 mn in Sep-2025, Motilal Oswal ₹750 cr in Jun-2026) now funds Ecolife directly; whether it keeps doing so decides whether JBM Auto\'s cash flow turns positive. Our model, which keeps working capital at the pro forma FY26 ratio, has free cash flow of only ₹{{F.fcf.0|num}} / ₹{{F.fcf.1|num}} / ₹{{F.fcf.2|num}} cr in FY27-29E.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net debt ~₹2,080 cr pro forma; receivables and unbilled revenue are now two-thirds of revenue',
  blocks: [
    { p: 'At Mar-2026 JBM Auto had ₹3,029 cr of borrowings on Screener\'s basis (Crisil: ₹3,204 cr on its adjusted basis), against ₹130 cr of cash and ₹409 cr of investments, most of which are preference shares in and equity of its own JVs. Crisil put debt at 4.5x EBITDA and interest cover at 2.2x for FY26 (rating A/Stable, reaffirmed 5-Aug-2026). In Jun-2026 JBM Ecolife used part of Motilal Oswal\'s ₹750 cr to repay ₹400-420 cr to JBM Auto, which cut debt; we move ₹410 cr from working capital to net cash in our Mar-26 base (pro forma net debt ~₹2,080 cr, counting the JV investments as quasi-cash). The bigger issue is working capital: trade receivables of ₹2,185 cr (₹1,007 cr a year earlier; ₹366 cr overdue 6-12 months) and contract assets (unbilled revenue) of ₹1,511 cr, against FY26 revenue of ₹6,088 cr. Crisil expects gross current assets to fall from 297 days to ~250 days by Mar-27; our model does not assume that, so our net debt stays near ₹2,100-2,150 cr.' },
    { pair: [
      { type: 'line', title: 'Receivable days doubled in FY26 to 131', unit: 'Days', x: RL, series: [{ name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in (trade receivables only; contract assets come on top)' },
      { type: 'column', title: 'Borrowings: ₹845 cr (FY21) to ₹3,029 cr (FY26); ~₹2,620 cr after the Jun-2026 repayment', unit: 'Borrowings incl. leases (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: SRC.co + '. As reported; Crisil: ₹400-420 cr repaid by Jun-2026 out of the JV\'s Motilal Oswal money.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.3|num}}', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.3|num}}', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}', '{{A.borrowings.7|num}}'],
      ['Cash and investments (incl. JV preference shares)', '{{A.cashAndInvestments.3|num}}', '{{A.cashAndInvestments.5|num}}', '{{A.cashAndInvestments.6|num}}', '{{A.cashAndInvestments.7|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.3|num}}', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.7|num}}'],
      ['Inventories', '{{A.inventories.3|num}}', '{{A.inventories.5|num}}', '{{A.inventories.6|num}}', '{{A.inventories.7|num}}'],
      ['Trade receivables', '{{A.receivables.3|num}}', '{{A.receivables.5|num}}', '{{A.receivables.6|num}}', '{{A.receivables.7|num}}'],
      ['Trade payables', '{{A.payables.3|num}}', '{{A.payables.5|num}}', '{{A.payables.6|num}}', '{{A.payables.7|num}}'],
    ], source: SRC.co + '. As reported (before the ₹410 cr repaid in Jun-2026). Contract assets (₹1,511 cr) and the ₹336 cr JV loan sit in other assets, not shown.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Arya family holds 67.5%; institutions own almost none of it',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds ~2%, domestic institutions ~0.2%: a retail stock', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 67.53% in every quarter', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 0, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY19–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (after share of JV losses)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items in actual years)', flag: { type: 'pct', th: 50 } },
      { key: 'interest', name: 'Interest', flag: { type: 'pct', th: 30 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹, on 23.65 cr shares)', fmt: 'n2' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items)' },
      { key: 'interest', name: 'Interest' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD, c1, c2 };

if (require.main === module) {
  const X = require('./JBMA.ctx');
  if (X.syncBuild() || X.syncMultiples()) { console.log('Assumptions changed: run node src/model.js JBMA, then this script again.'); process.exit(0); }
  const B = fs.existsSync(path.join(__dirname, 'JBMA.research.js')) ? require('./JBMA.research') : null;
  const report = {
    symbol: 'JBMA', listing: 'NSE: JBMA · BSE: 532605', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
