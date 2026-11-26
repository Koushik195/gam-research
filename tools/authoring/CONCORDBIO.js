// Authoring source for the Concord Biotech initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated from FY20; FY15-19 standalone), patched by
// CONCORDBIO.patch.js (attributable profit; the Nov-2026 1:1 bonus undone so per-share data match the 30-Sep price). Part B
// (CONCORDBIO.research.js + part2-6, shared CONCORDBIO.ctx.js / ctx2.js) adds the research chapters, cover, rating and
// statement notes. Usage: node tools/authoring/CONCORDBIO.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'CONCORDBIO', 'research');
const X = fs.existsSync(path.join(__dirname, 'CONCORDBIO.ctx2.js')) ? require('./CONCORDBIO.ctx2') : null;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const FYS = ['FY18', 'FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const financials = X && (() => {
  const { A, epsRep, epsU, n1, ai, OIN, FY26 } = X;
  const at = (k, y) => A[k][ai(y)];
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Eight years of high-teens growth at 40%+ margins, then FY26: revenue −12%, EBITDA −27%, EPS ₹35.5 to ₹24.9',
    blocks: [
      { p: `Concord's revenue grew from ₹340 cr in FY18 to ₹1,200 cr in FY25, ~${Math.round(X.cagr(340, 1200, 7))}% a year, with the EBITDA margin at 37-53% (40-42% in FY23-25) and almost no debt. The only dip before FY26 was FY22 (EPS ₹22.5 to ₹16.7), when the new Limbasi API plant (Unit III) added ~₹22 cr of depreciation and start-up costs before it had volume. **FY26 broke the pattern:** revenue fell 12% to ₹1,055 cr, EBITDA 27% to ₹368 cr and EPS 30% to ₹24.9. Three things hit at once: US customers bought in small quarterly lots instead of bulk, EU supplies stopped for ~3 months while the regulator's written confirmation was pending, and Middle East and US Veterans Affairs tenders (~₹25 cr each) did not happen. On top, the new injectable plant and the US front end (Stellon Biotech) added ~₹48 cr of costs with little revenue. EPS figures are on the 10.46 cr shares that traded on 30-Sep-2026 (before the 1:1 bonus approved on 23-Sep-2026 and not yet allotted).` },
      { pair: [
        { type: 'column', title: 'Revenue: ₹340 cr (FY18) to ₹1,200 cr (FY25), then ₹1,055 cr', unit: 'Revenue (₹ crore)', x: FYS, series: [{ name: 'Revenue', values: FYS.map(y => at('sales', y)), fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (FY18-19 standalone, FY20 onwards consolidated)' },
        { type: 'line', title: 'EBITDA margin: 40-42% in FY23-25, 35% in FY26', unit: 'EBITDA margin (%), before other income', x: FYS, series: [{ name: 'EBITDA margin', values: FYS.map(y => Math.round(at('ebitdaMargin', y) * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 60, source: 'Screener.in' },
      ] },
      { pair: [
        { type: 'column', title: 'EPS: ₹35.5 (FY25) to ₹24.9 (FY26); we forecast a return above FY25 only in FY28E', unit: 'EPS (₹, pre-bonus share count)', x: [...FYS.slice(3), ...X.YRS], series: [{ name: 'EPS', values: [...FYS.slice(3).map(y => epsRep[2000 + +y.slice(2)]), ...epsU.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (bonus restatement undone); GAM estimates FY27-29E' },
        { type: 'line', title: 'Return on equity: 20-27% to FY25, 13.6% in FY26', unit: 'Return on equity (%)', x: FYS.slice(2), series: [{ name: 'ROE', values: FYS.slice(2).map(y => Math.round(at('roe', y) * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: 'Screener.in (net profit ÷ average equity)' },
      ] },
      { exhibit: { type: 'table', title: 'FY24 → FY26: where the profit went (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Note'], wide: [4], rows: [
        ['Revenue', '{{A.sales.8|num}}', '{{A.sales.9|num}}', '{{A.sales.10|num}}', 'APIs ₹828 → 940 → 829 cr; formulations ₹189 → 260 → 226 cr'],
        ['Gross margin (company)', '77.5%', '74.5%', '76.7%', 'Mix and lower raw-material costs; no price increases'],
        ['EBITDA before other income', '{{A.ebitda.8|num}}', '{{A.ebitda.9|num}}', '{{A.ebitda.10|num}}', `Margin 42.5% → 42.2% → 34.9%; ex-injectables and Stellon ${FY26.ebitdaExNewPct}% (company)`],
        ['Other income', '{{A.otherIncome.8|num}}', '{{A.otherIncome.9|num}}', '{{A.otherIncome.10|num}}', `FY26: treasury ₹${n1(X.tr26)} cr, forex ₹${n1(OIN.FY26.forex)} cr, incentives ₹${n1(OIN.FY26.subsidy)} cr`],
        ['Depreciation', '{{A.dep.8|num}}', '{{A.dep.9|num}}', '{{A.dep.10|num}}', 'Injectable plant from Mar-2025'],
        { hl: true, cells: ['**Net profit (attributable)**', '**{{A.pat.8|num}}**', '**{{A.pat.9|num}}**', '**{{A.pat.10|num}}**', 'FY26 after a ₹1.7 cr minority share of Stellon\'s loss and a ₹3.3 cr labour-code charge'] },
        ['EPS (₹, pre-bonus)', String(epsRep[2024]), String(epsRep[2025]), String(epsRep[2026]), 'AR FY26 basic EPS ₹24.78 (on total profit)'],
      ], source: 'Screener.in; Q4FY24-Q4FY26 decks; AR FY26 note 25' } },
      { callout: `**Our view:** FY26 looks like a timing shock on a sound franchise, not a broken one: gross margins rose, there was no write-off, and Q1FY27 revenue grew 26%. But it also showed that Concord's revenue depends on how a few hundred generic customers time their orders, and that the new businesses cost ~4-5 points of margin until they scale. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E (~${Math.round(X.epsCagr)}% a year from FY26's low base): FY25's ₹35.5 is regained only in FY28E.` },
    ],
  };
})();

const seasons = X && {
  id: 'seasons', nav: 'Lumpy quarters', kicker: 'Quarters', title: 'Q4 is the big quarter, Q1 the small one; FY26 swapped bulk Q4 orders for staggered quarterly buying',
  blocks: [
    { p: 'Concord\'s customers (generic formulators and a few innovators) buy APIs in campaigns, and many place their largest orders before their own financial year-end: Q4 brought 31% of revenue in FY24 and 36% in FY25 (₹430 cr), while Q1 is usually the smallest quarter. In FY26 customers "shifted from bulk purchases to a more staggered quarter-on-quarter procurement approach" (Q4FY26 call): Q4FY26 revenue fell 24% to ₹326 cr even though Q3FY26 grew 14%. Margins follow revenue because ~45-50% of costs (employees 17%, power and fuel ~20% of costs) are fixed: the EBITDA margin ranged from 30% (Q1FY26) to 44% (Q4FY25).' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: Q4FY25 ₹430 cr, Q1FY26 ₹204 cr', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated)' },
      { type: 'line', title: 'Quarterly EBITDA margin: 30% to 44%', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 50, source: 'Screener.in' },
    ] },
    { callout: `**What to watch:** our FY27 forecast (₹${n0(X.F.sales[0])} cr) needs ₹${n0(X.q2to4Need)} cr from Q2-Q4 after Q1's ₹257.5 cr, ${Math.round((X.q2to4Need / X.q2to4Prev - 1) * 100)}% above the same quarters of FY26 (₹${n0(X.q2to4Prev)} cr). The whole year hinges on Q4: whether customers return to bulk year-end orders or keep buying quarterly. Q2FY27 results are due by mid-November 2026.` },
  ],
};

const balance = X && (() => {
  const { cashPath, n1, TRE, Q1, NONYIELD } = X;
  return {
    id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'No debt and ₹442 cr of cash (Jun-26), but working capital swallowed 61% of FY26 sales as inventory rose to ₹326 cr',
    blocks: [
      { p: `Concord has had no meaningful debt since FY24 and held ₹${n1(TRE.mar26.yieldBearing)} cr of cash and debt funds at Mar-26 (>₹442 cr at Jun-26), plus ₹${n1(TRE.mar26.palvella)} cr of shares in Palvella Therapeutics, a US biotech, and ₹${n1(TRE.mar26.jv)} cr in its Japan JV. The weak spot is working capital. Fermentation takes 30-50 days, the last 1-5% of processing waits for an order, and customers get 115-120 days of credit (ICRA): working capital was ~53% of sales in FY25 and 63% in FY26 (ICRA). In FY26 inventory rose from ₹240 cr to ₹326 cr (485 days of material cost) as customers deferred orders, while receivables fell from ₹522 cr to ₹460 cr. Operating cash flow was still ₹267 cr and free cash flow ~₹172 cr (Screener), most of it paid out (₹112 cr of dividends) or parked in debt funds.` },
      { pair: [
        { type: 'column', title: 'Cash and investments less leases: ₹148 cr (Mar-23) to ₹503 cr (Mar-26)', unit: 'Net cash (₹ crore), Screener basis', x: ['Mar-23', 'Mar-24', 'Mar-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Net cash', values: [148, 283, 333, Math.round(cashPath[0]), Math.round(X.NC_JUN26)], fmt: 'num' }], labels: 'all', highlight: 'Jun-26', source: `Screener.in balance sheets; Jun-26 = company cash ₹${Q1.cash} cr + Palvella and JV (₹${n1(NONYIELD)} cr) − leases` },
        { type: 'line', title: 'Inventory days jumped to 485 in FY26; receivable days 159', unit: 'Days', x: FYS.slice(2), series: [{ name: 'Receivable days', values: X.A.debtorDays.slice(-7), fmt: 'num' }, { name: 'Inventory days', values: X.A.inventoryDays.slice(-7), fmt: 'num' }], labels: 'last', source: 'Screener.in (inventory days on material cost)' },
      ] },
      { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
        ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}'],
        ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}'],
        ['Cash and investments (incl. Palvella shares)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}'],
        ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.8|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}'],
        ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.8|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}'],
        ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.8|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}'],
        ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}'],
        ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}'],
      ], source: 'Screener.in (consolidated); Q4FY26 deck p.12; AR FY26' } },
      { callout: `**Cash in the model.** The engine starts from ₹${n0(cashPath[0])} cr at Mar-26 (incl. the Palvella shares, less ₹2 cr of leases) and builds it to ₹${n0(cashPath[1])} / ${n0(cashPath[2])} / ${n0(cashPath[3])} cr by Mar-27/28/29E after capex of ₹90-110 cr a year and a 30% payout. It holds working capital at FY26's ~61% of sales, so if inventory unwinds towards FY25's ~53% as management expects, cash would be ~₹80-100 cr higher. We assume no acquisition, although management is "exploring" inorganic moves.` },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Vaid family owns 44.1% and the Jhunjhunwala trusts 24.1%; Quadria sold its entire 20% in the IPO',
  blocks: [
    { pair: [
      { type: 'line', title: 'Institutions hold only ~17%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'Public (incl. Jhunjhunwala trusts)', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 44.08%, unchanged since listing', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 30, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Standalone to FY19, consolidated from FY20 (Screener). Net profit is attributable to owners (25% of Stellon Biotech belongs to outsiders); EPS is on the 10.46 cr shares in issue on 30-Sep-2026, before the 1:1 bonus approved on 23-Sep-2026. EBITDA is before other income. Forecast other income is treasury income at 6.0% on average yield-bearing cash plus Gujarat incentives, write-backs and the Japan JV share; no forex gains are forecast.' },
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA (before other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 400 } }, { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹, pre-bonus)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, seasons, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'CONCORDBIO.research.js')) ? require('./CONCORDBIO.research') : null;
  const report = {
    symbol: 'CONCORDBIO', listing: 'NSE: CONCORDBIO · BSE: 543960', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Pharmaceuticals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
