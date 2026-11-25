// Authoring source for the Acutaas Chemicals (formerly Ami Organics) initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit patched to profit attributable
// to owners by ACUTAAS.patch.js). Part B (ACUTAAS.research.js + part2-6, shared ACUTAAS.ctx.js) adds the research chapters,
// cover, rating and statement notes. Usage: node tools/authoring/ACUTAAS.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ACUTAAS', 'research');
const X = fs.existsSync(path.join(__dirname, 'ACUTAAS.ctx.js')) ? require('./ACUTAAS.ctx') : null;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const FYS = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const financials = X && (() => {
  const { A, epsRep, epsU, n1, ai, salesCagr6, eps24ex, OIN, SA } = X;
  const at = (k, y) => A[k][ai(y)];
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue ×5.6 in six years; the EBITDA margin doubled to 36% in FY26 when the darolutamide CDMO contract scaled; EPS ₹4.1 to ₹43.5',
    blocks: [
      { p: `Acutaas grew revenue from ₹240 cr in FY20 to ₹1,339 cr in FY26, ${n1(salesCagr6)}% a year. For five years the margin barely moved: EBITDA was 17-24% of sales from FY20 to FY25 because most products were generic intermediates sold on price, and the FY22 purchase of two Gujarat Organics plants added low-margin commodity chemicals. FY26 broke the pattern. CDMO revenue (mostly five intermediates for darolutamide, Bayer's prostate-cancer drug Nubeqa, supplied to Orion's API arm Fermion) rose from ₹57 cr in FY24 to ₹282 cr in FY25 and ~₹635 cr in FY26 (PL, company data), while low-margin generic products were dropped. Gross margin went from 45.2% to 57.7%, EBITDA doubled to ₹480 cr (35.9%) and attributable profit rose 124% to ₹356 cr, helped by ₹32 cr of forex gains. FY24 is distorted by a ₹32 cr write-off of a US research joint venture (EPS ₹5.80 reported, ~₹${n1(eps24ex)} before it).` },
      { pair: [
        { type: 'column', title: 'Revenue: ₹240 cr to ₹1,339 cr, +33% a year', unit: 'Revenue (₹ crore)', x: FYS, series: [{ name: 'Revenue', values: FYS.map(y => at('sales', y)), fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (consolidated)' },
        { type: 'line', title: 'EBITDA margin: 17-24% for five years, then 36%', unit: 'EBITDA margin (%), before other income', x: FYS, series: [{ name: 'EBITDA margin', values: FYS.map(y => Math.round(at('ebitdaMargin', y) * 10) / 10), fmt: 'pct' }, { name: 'Gross margin', values: SA.map(s => s.grossMarginPct), fmt: 'pct' }], labels: 'all', min: 0, max: 65, source: 'Screener.in; gross margin = 100 − material cost %' },
      ] },
      { pair: [
        { type: 'column', title: 'EPS: ₹4.1 to ₹43.5; FY24 hit by a JV write-off', unit: 'EPS (₹), reported', x: FYS, series: [{ name: 'EPS', values: FYS.map(y => epsRep[2000 + +y.slice(2)]), fmt: 'n1' }], labels: 'all', source: 'Screener.in (FY24 includes the ₹32.1 cr impairment of the Ami Oncotheranostics JV, no tax effect)' },
        { type: 'line', title: 'Return on equity: diluted by the IPO and QIP, back to 24% in FY26', unit: 'Return on equity (%)', x: FYS, series: [{ name: 'ROE', values: FYS.map(y => Math.round(at('roe', y) * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 45, source: 'Screener.in (attributable profit ÷ average equity)' },
      ] },
      { exhibit: { type: 'table', title: 'FY24 → FY26: where the profit came from (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Note'], wide: [4], rows: [
        ['Revenue', '{{A.sales.7|num}}', '{{A.sales.8|num}}', '{{A.sales.9|num}}', 'CDMO ₹57 → 282 → 635 cr (PL); pharma ex-CDMO ₹511 → 572 → 539 cr'],
        ['Gross margin (100 − material cost)', '42.6%', '45.2%', '57.7%', 'Darolutamide intermediates and dropping low-margin generics'],
        ['EBITDA before other income', '{{A.ebitda.7|num}}', '{{A.ebitda.8|num}}', '{{A.ebitda.9|num}}', 'Margin 17.9% → 23.0% → 35.9%'],
        ['Other income (Screener; FY24 net of the exceptional item)', '{{A.otherIncome.7|num}}', '{{A.otherIncome.8|num}}', '{{A.otherIncome.9|num}}', `FY26: interest ₹${n1(OIN.FY26.interest)} cr, forex ₹${n1(OIN.FY26.forex)} cr; FY24: −₹32 cr JV impairment`],
        ['Depreciation', '{{A.dep.7|num}}', '{{A.dep.8|num}}', '{{A.dep.9|num}}', 'Ankleshwar rebuilt (3x), battery Phase 1'],
        ['Tax rate', '40.5%', '25.8%', '26.2%', 'FY24: no tax credit on the impairment'],
        { hl: true, cells: ['**Net profit (attributable)**', '**{{A.pat.7|num}}**', '**{{A.pat.8|num}}**', '**{{A.pat.9|num}}**', 'After minorities (BFC 45%, Indichem 25%)'] },
        ['EPS (₹)', String(epsRep[2024]), String(epsRep[2025]), String(epsRep[2026]), `₹${n1(eps24ex)} in FY24 before the impairment; AR basic FY25 ₹19.81 (weighted for the QIP)`],
      ], source: 'Screener.in; AR FY26 (P&L, notes 27, 50); Q4FY26 deck (adjusted FY24 PAT ₹80.8 cr); PL initiation (CDMO revenue)' } },
      { callout: `**Our view:** this is a business whose economics changed in one year because one contract scaled. FY26's 36% margin is real and Q4FY26 (42%) shows its power, but it rests largely on a single molecule for a single customer, and the base business of generic intermediates did not grow in FY24-26. FY26 profit also had ₹32 cr of forex gains that did not repeat in Q1FY27. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, ~${Math.round(X.epsCagr)}% a year, with margins easing as battery chemicals grow.` },
    ],
  };
})();

const seasons = {
  id: 'seasons', nav: 'Quarterly pattern', kicker: 'Quarters', title: 'Strongly seasonal: Q1 is always the weakest quarter and Q4 the strongest; H1 is ~40% of the year',
  blocks: [
    { p: 'Acutaas says the same thing every year: "Q1 is lower than Q2, Q2 is lower than Q3, Q3 is lower than Q4. In last 15 years, it is like that" (CMD, 30-Apr-2026). With ~600 customers and 100+ products ordering at different times, H1 brings ~40% of revenue and H2 ~60%. The pattern held in FY25 (₹177 cr in Q1 to ₹308 cr in Q4) and FY26 (₹207 cr to ₹433 cr), and Q1FY27 fell 24% from Q4FY26 to ₹330 cr while growing 59% YoY. Margins follow revenue because a third of costs are fixed: the EBITDA margin was 24.6% in Q1FY26 and 42.4% in Q4FY26.' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: a saw-tooth that resets every Q1', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated)' },
      { type: 'line', title: 'Quarterly EBITDA margin: 15% to 42%', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 50, source: 'Screener.in' },
    ] },
    { callout: '**What to watch:** our FY27 forecast needs ~₹1,342 cr from Q2-Q4, +19% on a year earlier, against +59% in Q1. Judge Q2 against Q2FY26 (₹306 cr), not against Q4. Q2FY27 results are due by mid-November 2026.' },
  ],
};

const balance = X && (() => {
  const { cashPath, TRE, CO_NC0, Q1, n1 } = X;
  return {
    id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ₹198 cr at Mar-26 and ₹314 cr at Jun-26 after a ₹400 cr QIP; working capital is heavy at ~120 days',
    blocks: [
      { p: `Acutaas has raised equity twice since listing: ₹200 cr of new shares in the Sep-2021 IPO (₹300 cr of equity inflow in FY22) and a ₹400 cr QIP in Jun-2024 (₹499 cr of equity inflow in FY25 including warrant money). Debt went from ₹217 cr at Mar-24 (Baba Fine Chemicals purchase and the Ankleshwar rebuild) to ₹13 cr a year later. At Mar-26 cash and bank balances were ₹${n1(TRE.mar26.cash + TRE.mar26.otherBank)} cr against ₹${n1(TRE.mar26.borrowings)} cr of short-term debt: company net cash ₹${n1(CO_NC0)} cr, rising to ₹${n0(Q1.netCash)} cr at Jun-26. Working capital is the weak spot. Receivables were ₹363 cr (99 days of sales; credit terms of 90-360 days) and inventory ₹231 cr; the company counts 120 days of working capital for FY26 (114 in FY25) and 99 days in Q1FY27. Operating cash flow was ₹292 cr in FY26 (61% of EBITDA).` },
      { pair: [
        { type: 'column', title: 'Net debt to net cash: −₹164 cr (Mar-24) to +₹314 cr (Jun-26)', unit: 'Net cash (₹ crore), year-end', x: ['Mar-22', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Net cash', values: [99, 55, -164, 236, 198, Q1.netCash], fmt: 'num' }], labels: 'all', highlight: 'Jun-26', source: 'Screener.in (Mar-22 to Mar-25); AR FY26; Q1FY27 call' },
        { type: 'line', title: 'Receivable and inventory days: high, typical of intermediates', unit: 'Days', x: FYS, series: [{ name: 'Receivable days', values: X.A.debtorDays.slice(3), fmt: 'num' }, { name: 'Inventory days', values: X.A.inventoryDays.slice(3), fmt: 'num' }], labels: 'last', source: 'Screener.in (inventory days on material cost)' },
      ] },
      { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
        ['Net worth (owners; minority interest of ₹57 cr excluded)', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}'],
        ['Borrowings (incl. leases)', '{{A.borrowings.6|num}}', '{{A.borrowings.7|num}}', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}'],
        ['Cash and bank balances', '{{A.cashAndInvestments.6|num}}', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}'],
        ['Inventories', '{{A.inventories.6|num}}', '{{A.inventories.7|num}}', '{{A.inventories.8|num}}', '{{A.inventories.9|num}}'],
        ['Trade receivables', '{{A.receivables.6|num}}', '{{A.receivables.7|num}}', '{{A.receivables.8|num}}', '{{A.receivables.9|num}}'],
        ['Trade payables', '{{A.payables.6|num}}', '{{A.payables.7|num}}', '{{A.payables.8|num}}', '{{A.payables.9|num}}'],
        ['Net fixed assets (incl. goodwill)', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}'],
        ['Capital work in progress', '{{A.cwip.6|num}}', '{{A.cwip.7|num}}', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}'],
      ], source: 'Screener.in (consolidated). Goodwill ₹104 cr at Mar-26 (Gujarat Organics units ₹20 cr, BFC ₹37 cr, Indichem ₹47.5 cr)' } },
      { callout: `**Cash in the model.** The engine starts from ₹${n0(cashPath[0])} cr of net cash at Mar-26 (Screener cash less borrowings and ₹9 cr of leases; the company's ₹${n1(CO_NC0)} cr excludes leases) and builds it to ₹${n0(cashPath[1])} / ${n0(cashPath[2])} / ${n0(cashPath[3])} cr by Mar-27/28/29E after capex of ₹175-250 cr a year. That is our cash case, not a forecast of buy-backs: the company is spending on a new R&D centre, land and a ₹212 cr electronic-chemicals plant, and amounts beyond FY27 are not yet announced. Working capital is held at ~29% of sales, in line with history.` },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: two founders own 32.7% after selling 3.3% in Jun-2025; foreign and domestic institutions have added ~33 points of ownership since Mar-2022',
  blocks: [
    { pair: [
      { type: 'line', title: 'Institutions have taken over the free float', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 39.9% → 32.7% (QIP, then a sale)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 20, max: 45, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Consolidated. History FY17-FY26; net profit and EPS are attributable to owners (after minorities in Baba Fine Chemicals and Indichem). EBITDA is before other income; Screener nets the FY24 exceptional item (−₹32 cr JV impairment) into other income. Forecast other income is treasury income at 3.5% on average net cash plus ₹0.5 cr; no forex gains are forecast.' },
    { statement: { title: 'Profit & loss, FY17–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 25 }, hl: true }, { key: 'ebitda', name: 'EBITDA (before other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (history incl. exceptional items)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 30 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income incl. exceptional' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, seasons, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'ACUTAAS.research.js')) ? require('./ACUTAAS.research') : null;
  const report = {
    symbol: 'ACUTAAS', listing: 'NSE: ACUTAAS · BSE: 543349', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Pharmaceuticals & Specialty Chemicals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
