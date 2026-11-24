// Authoring source for the Anthem Biosciences initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; the standalone FY19 column dropped by
// ANTHEM.patch.js). Part B (ANTHEM.research.js + part2-6, shared ANTHEM.ctx.js) adds the research chapters, cover, rating
// and statement notes. Usage: node tools/authoring/ANTHEM.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ANTHEM', 'research');
const X = fs.existsSync(path.join(__dirname, 'ANTHEM.ctx.js')) ? require('./ANTHEM.ctx') : null;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const FYS = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const financials = X && (() => {
  const { A, F, epsRep, epsU, n1, cagr, b, salesCagr6, FY26 } = X;
  const eps = FYS.map((y, i) => A.eps[i]);
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue ×3.4 in six years with one down year; margins of 36-46% before other income; EPS ₹1.7 to ₹10.5',
    blocks: [
      { p: `Anthem grew revenue from ₹633 cr in FY20 to ₹2,124 cr in FY26, ${n1(salesCagr6)}% a year. The path was not smooth. FY21 jumped 74% and FY22 another 12% as commercial molecules scaled; FY23 fell 14% when a client's Phase III molecule failed and another client withdrew a commercial product (RHP risk factor 3); FY24-25 rebounded 34% and 30%; FY26 slowed to 15% as customers ran down stocks. The EBITDA margin before other income has stayed high through all of it: 46% at the FY22 peak, 36% in FY24-25 when one key intermediate was bought from China, 39% in FY26 once it was made in-house. Profit grew faster than revenue in FY26 (+31%) because of that margin, ₹156 cr of other income (incl. ₹58 cr of forex gains) and a falling ESOP charge, despite a 28% tax rate.` },
      { pair: [
        { type: 'column', title: 'Revenue: ₹633 cr to ₹2,124 cr, with a dip in FY23', unit: 'Revenue (₹ crore)', x: FYS, series: [{ name: 'Revenue', values: FYS.map((_, i) => A.sales[i]), fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (consolidated; FY19 standalone column dropped)' },
        { type: 'line', title: 'EBITDA margin: 36-46%, the highest among Indian CRDMOs', unit: 'EBITDA margin (%), before other income', x: FYS, series: [{ name: 'EBITDA margin', values: FYS.map((_, i) => Math.round(A.ebitdaMargin[i] * 10) / 10), fmt: 'pct' }], labels: 'all', min: 20, max: 50, source: 'Screener.in (company EBITDA includes other income: 43.4% in FY26)' },
      ] },
      { pair: [
        { type: 'column', title: 'EPS: ₹1.7 to ₹10.5; flat in FY23-24', unit: 'EPS (₹), reported', x: FYS, series: [{ name: 'EPS', values: eps, fmt: 'n1' }], labels: 'all', source: 'Screener.in (FY23 includes a ₹41 cr after-tax exceptional gain; FY26 a ₹16 cr labour-code charge)' },
        { type: 'line', title: 'Return on equity: ~20-22% since FY23 despite a growing cash pile', unit: 'Return on equity (%)', x: FYS.slice(1), series: [{ name: 'ROE', values: FYS.slice(1).map((_, i) => Math.round(A.roe[i + 1] * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 55, source: 'Screener.in' },
      ] },
      { exhibit: { type: 'table', title: 'FY24 → FY26: where the profit came from (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Note'], wide: [4], rows: [
        ['Revenue', '{{A.sales.4|num}}', '{{A.sales.5|num}}', '{{A.sales.6|num}}', 'CRDMO ₹1,083 → 1,506 → 1,773 cr; specialty ingredients ₹336 → 338 → 352 cr'],
        ['Gross margin (company)', '57.8%', '59.7%', '61.8%', 'One intermediate bought from China in FY24-25; made in-house from H2FY26'],
        ['EBITDA before other income (Screener)', '{{A.ebitda.4|num}}', '{{A.ebitda.5|num}}', '{{A.ebitda.6|num}}', 'Company EBITDA incl. other income: ₹990 cr in FY26 (43.4%)'],
        ['Other income (Screener; FY26 net of exceptional)', '{{A.otherIncome.4|num}}', '{{A.otherIncome.5|num}}', '{{A.otherIncome.6|num}}', 'FY26: treasury ₹89 cr, forex ₹58 cr, incentives ₹5 cr; labour-code charge −₹24 cr'],
        ['Depreciation', '{{A.dep.4|num}}', '{{A.dep.5|num}}', '{{A.dep.6|num}}', 'Unit II expansion and Unit III commissioned in FY26'],
        ['Tax rate', '23%', '31%', '28%', 'NeoAnthem (Unit III) losses get no tax credit'],
        { hl: true, cells: ['**Net profit**', '**{{A.pat.4|num}}**', '**{{A.pat.5|num}}**', '**{{A.pat.6|num}}**', ''] },
        ['EPS (₹)', String(epsRep[2024]), String(epsRep[2025]), String(epsRep[2026]), `₹${n1(X.epsFY26ex)} in FY26 before the labour-code charge`],
      ], source: 'Screener.in; AR FY26 (P&L, notes 24, 35); RHP (gross margin FY24-25)' } },
      { callout: `**Our view:** Anthem has compounded revenue at ~${Math.round(salesCagr6)}% a year at margins few manufacturers anywhere earn, but its revenue follows a handful of client molecules: one failure and one withdrawal took 14% off revenue in FY23, and destocking cut FY26 growth to 15%. FY26 profit also had help that will not repeat at the same size (₹58 cr of forex gains). We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, ~${Math.round(X.epsCagr)}% a year.` },
    ],
  };
})();

const seasons = {
  id: 'seasons', nav: 'Quarterly pattern', kicker: 'Quarters', title: 'Lumpy, not seasonal: quarters swing 15-25% with client delivery schedules; Q4 has been the biggest quarter two years running',
  blocks: [
    { p: 'Anthem ships campaigns, not monthly volumes: a commercial client orders a year\'s material in a few lots, and a biotech orders the next clinical batch when its trial reads out. Quarters therefore move with delivery dates. Q3FY26 revenue fell 15% (₹423 cr) and Q1FY27 fell 23% (₹418 cr), while Q4FY26 (₹611 cr, +26%) was a record. Management says the same thing every quarter: judge the year, not the quarter, and do not treat a "bumper quarter" as the run-rate (CEO, 22-Jul-2026). The gross margin has been the steadier line: 64.7-66.3% for three quarters since the backward integration.' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: from ₹339 cr to ₹611 cr and back to ₹418 cr', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated)' },
      { type: 'line', title: 'Quarterly EBITDA margin: 32-44% before other income', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 20, max: 50, source: 'Screener.in' },
    ] },
    { callout: '**What to watch:** management put ~60% of FY27 revenue in the order book after Q1 and said deferred deliveries move to Q2-Q4. Our FY27 forecast needs ~₹2,000 cr from those three quarters (+19% YoY). Q2FY27 results are due by mid-November 2026.' },
  ],
};

const balance = X && (() => {
  const { F, cashPath, TRE, CO_NC0, Q1, n1, grossTreasury26 } = X;
  return {
    id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: `Net cash of ₹1,374 cr at Mar-26 and ₹1,720 cr at Jun-26, mostly in NBFC bonds; Unit IV is funded without debt`,
    blocks: [
      { p: `Anthem raised no money in its IPO (a pure offer for sale) and needs none. Company net cash rose from ₹624 cr at Mar-25 to ₹1,374 cr at Mar-26 and ₹1,720 cr at Jun-26, helped by ₹844 cr of operating cash flow in FY26 as inventory built for FY25 deliveries (₹340 cr) was shipped. Gross treasury was ₹${n0(grossTreasury26)} cr at Mar-26: ₹${n0(TRE.bondsAndMlds)} cr of corporate bonds and market-linked debentures (mostly NBFC and housing-finance paper), ₹${n0(TRE.mutualFunds)} cr of debt and arbitrage funds, ₹${n0(TRE.cashAndDeposits)} cr of cash and short deposits and ₹${n0(TRE.nonCurrentBankBalances)} cr of longer deposits; borrowings were only ₹${n0(TRE.borrowings)} cr. Working capital is lumpy: receivables were ₹591 cr (~101 days) and inventory ₹125 cr at Mar-26, against ₹340 cr of inventory a year earlier.` },
      { pair: [
        { type: 'column', title: 'Net cash: ₹624 cr to ₹1,720 cr in five quarters', unit: 'Net cash (₹ crore), company, quarter-end', x: ['Mar-25', 'Jun-25', 'Sep-25', 'Dec-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Net cash', values: [624, 785, 993, 1231, 1374, 1720], fmt: 'num' }], labels: 'all', highlight: 'Jun-26', source: 'Company investor presentations' },
        { type: 'line', title: 'Receivable and inventory days: high and volatile', unit: 'Days', x: ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Receivable days', values: X.A.debtorDays.slice(), fmt: 'num' }, { name: 'Inventory days', values: X.A.inventoryDays.slice(), fmt: 'num' }], labels: 'last', source: 'Screener.in (inventory days on material cost)' },
      ] },
      { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
        ['Net worth', '{{A.netWorth.3|num}}', '{{A.netWorth.4|num}}', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}'],
        ['Borrowings (incl. leases)', '{{A.borrowings.3|num}}', '{{A.borrowings.4|num}}', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}'],
        ['Cash and investments (Screener)', '{{A.cashAndInvestments.3|num}}', '{{A.cashAndInvestments.4|num}}', '{{A.cashAndInvestments.5|num}}', '{{A.cashAndInvestments.6|num}}'],
        ['Inventories', '{{A.inventories.3|num}}', '{{A.inventories.4|num}}', '{{A.inventories.5|num}}', '{{A.inventories.6|num}}'],
        ['Trade receivables', '{{A.receivables.3|num}}', '{{A.receivables.4|num}}', '{{A.receivables.5|num}}', '{{A.receivables.6|num}}'],
        ['Trade payables', '{{A.payables.3|num}}', '{{A.payables.4|num}}', '{{A.payables.5|num}}', '{{A.payables.6|num}}'],
        ['Net fixed assets', '{{A.fixedAssets.3|num}}', '{{A.fixedAssets.4|num}}', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.6|num}}'],
        ['Capital work in progress', '{{A.cwip.3|num}}', '{{A.cwip.4|num}}', '{{A.cwip.5|num}}', '{{A.cwip.6|num}}'],
      ], source: 'Screener.in (consolidated). Screener\'s cash excludes ₹158 cr of non-current deposits (in other assets) at Mar-26' } },
      { callout: `**Cash in the model.** The engine's net cash starts at ₹${n0(cashPath[0])} cr at Mar-26 (Screener cash and investments plus the ₹158 cr of non-current deposits, less borrowings; the company's ₹${n0(CO_NC0)} cr excludes ₹15 cr of captive-power stakes). It then dips to ₹${n0(cashPath[1])} cr at Mar-27E as ₹700 cr of capex runs ahead of cash flow, and recovers to ₹${n0(cashPath[3])} cr by Mar-29E. Two caveats: the engine holds working capital at Mar-26's unusually low 28.6% of sales, which flatters forecast cash by ~₹250-300 cr; and the company already reported ₹${n0(Q1.netCash)} cr at Jun-26, so the near-term path is if anything conservative on timing. Neither changes the P/E target by more than ~₹5 a share.` },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: founders and family 71.4%, domestic institutions 13.5%, a ~29% free float; the PE investor has gone and one promoter-group member has sold out',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions have bought the blocks', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter group: 74.7% → 71.4% (Jun-2026 sale)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Consolidated. History FY20-FY26 (the standalone FY19 column is dropped). EBITDA is before other income; Screener nets exceptional items into other income (FY23 +₹54 cr, FY26 −₹22 cr). Forecast other income is treasury income at 6.0% on average net cash plus export incentives and miscellaneous items; no forex gains are forecast.' },
    { statement: { title: 'Profit & loss, FY20–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA (before other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (history incl. exceptional items)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income incl. exceptional' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, seasons, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'ANTHEM.research.js')) ? require('./ANTHEM.research') : null;
  const report = {
    symbol: 'ANTHEM', listing: 'NSE: ANTHEM · BSE: 544449', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Pharmaceuticals & CRDMO',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
