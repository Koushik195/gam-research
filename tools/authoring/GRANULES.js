// Authoring source for the Granules India initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Mar-26 balance sheet and FY26 EPS pro forma for the
// 16-Sep-2026 warrant conversion via GRANULES.patch.js). Part B (GRANULES.research.js + part2-6, shared GRANULES.ctx.js) adds the
// research chapters, cover, rating and statement notes. Usage: node tools/authoring/GRANULES.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'GRANULES', 'research');
const X = fs.existsSync(path.join(__dirname, 'GRANULES.ctx.js')) ? require('./GRANULES.ctx') : null;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const FYS = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const financials = X && (() => {
  const { A, epsRep, n1, ai, SA, FY26, cagr } = X;
  const at = (k, y) => A[k][ai(y)];
  const H = SA.map(s => s.fy);
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue stuck at ~₹4,500 cr for three years, then +20% in FY26; gross margin up 15 points since FY22, EBITDA margin up only 3; EPS ₹17-24 for five years',
    blocks: [
      { p: `Granules grew revenue from ₹2,279 cr in FY19 to ₹3,238 cr in FY21, the COVID year, when the EBITDA margin peaked at 26%. Then growth stopped: revenue was ₹4,512 cr in FY23, ₹4,506 cr in FY24 and ₹4,482 cr in FY25. Three things hit it: API prices fell after the COVID spike (API revenue more than halved from ₹1,341 cr in FY23 to ₹619 cr in FY25), a cyber attack in May-2023 disrupted FY24 production, and the FDA's August-2024 inspection of Gagillapur, its biggest plant, led to a pause in September-2024 (Q2FY25 revenue −19%). FY26 broke out: revenue +20% to ₹5,366 cr as finished dosages grew 16% (complex generics from 31% to 43% of FD) and Senn added ₹159 cr. Over five years EPS went nowhere: ₹${epsRep[2021]} in FY21, ₹${epsRep[2026]} in FY26 (${n1(cagr(epsRep[2021], epsRep[2026], 5))}% a year), and ₹${n1(A.eps[ai('FY26')])} on the 27.28 cr shares outstanding after the Sep-2026 warrant conversion.` },
      { p: `The striking number is the gap between gross and EBITDA margin. Gross margin rose from 50.0% (FY22) to 65.0% (FY26) as the mix moved from API to tablets and to complex generics. EBITDA margin moved only from 19.3% to 22.1%. Where did the 12 points go? Into manpower (10.7% → 16.6% of sales: tablets need far more people than bulk API), other expenses (20.0% → 26.3%: plant overheads, freight, ~₹60 cr of FDA consultants in FY26), R&D (~3% → 5.3%) and Senn's ₹44.5 cr EBITDA loss. Some of that is temporary (remediation, Senn losses); most is the cost of running a formulation business.` },
      { pair: [
        { type: 'column', title: 'Revenue: flat FY23-FY25, +20% in FY26', unit: 'Revenue (₹ crore)', x: FYS, series: [{ name: 'Revenue', values: FYS.map(y => at('sales', y)), fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (consolidated)' },
        { type: 'line', title: 'Gross margin +15 points since FY22; EBITDA margin +3', unit: '% of revenue', x: H, series: [{ name: 'Gross margin (company)', values: SA.map(s => s.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: H.map(y => Math.round(at('ebitdaMargin', y) * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 75, source: 'Company decks (gross margin); Screener.in (EBITDA before other income)' },
      ] },
      { pair: [
        { type: 'column', title: 'EPS: ₹22 in FY21, ₹24 in FY26 - five years of no growth', unit: 'EPS (₹), reported', x: FYS, series: [{ name: 'EPS', values: FYS.map(y => epsRep[2000 + +y.slice(2)]), fmt: 'n1' }], labels: 'all', source: 'Screener.in (profit ÷ year-end shares; FY26 ₹21.8 on post-conversion shares)' },
        { type: 'line', title: 'Return on equity: 27% in FY21, 13-14% since FY24', unit: 'Return on equity (%)', x: FYS, series: [{ name: 'ROE', values: FYS.map(y => Math.round(at('roe', y) * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: 'Screener.in (FY26 on pro forma equity incl. the warrant money: understated)' },
      ] },
      { exhibit: { type: 'table', title: 'FY24 → FY26: where the profit came from (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Note'], wide: [4], rows: [
        ['Revenue', '{{A.sales.9|num}}', '{{A.sales.10|num}}', '{{A.sales.11|num}}', 'FD ₹2,909 → 3,434 → 3,989 cr; API ₹987 → 619 → 682 cr; CDMO ₹159 cr in FY26'],
        ['Gross margin (company)', '55.1%', '61.5%', '65.0%', 'Complex generics and less API'],
        ['EBITDA before other income', '{{A.ebitda.9|num}}', '{{A.ebitda.10|num}}', '{{A.ebitda.11|num}}', `FY26 includes Senn's ₹${FY26.ascelisEbitdaLoss} cr loss and ~₹60 cr of remediation`],
        ['Depreciation', '{{A.dep.9|num}}', '{{A.dep.10|num}}', '{{A.dep.11|num}}', 'Genome Valley, Senn and the MUPS block'],
        ['Interest', '{{A.interest.9|num}}', '{{A.interest.10|num}}', '{{A.interest.11|num}}', 'Incl. ~₹43 cr a year of other borrowing costs'],
        ['Other income (Screener: incl. exceptional items)', '{{A.otherIncome.9|num}}', '{{A.otherIncome.10|num}}', '{{A.otherIncome.11|num}}', 'FY25 +₹31 cr insurance claim (cyber incident); FY26 −₹10 cr net exceptional, other income ₹20 cr'],
        ['Tax rate', '25%', '24%', '24%', ''],
        { hl: true, cells: ['**Net profit**', '**{{A.pat.9|num}}**', '**{{A.pat.10|num}}**', '**{{A.pat.11|num}}**', 'All subsidiaries 100% owned'] },
        ['EPS (₹, reported)', String(epsRep[2024]), String(epsRep[2025]), String(epsRep[2026]), 'FY26 AR basic ₹24.47 (weighted shares); ₹21.81 pro forma on 27.28 cr shares'],
      ], source: 'Screener.in; AR FY26 (P&L, notes 16, 20, 23); Q4FY26 deck' } },
      { callout: `**Our view:** FY26 was a genuine recovery, built on complex generics in the US rather than on commodity prices, and Q1FY27 kept it going (+22%). But the record is uneven: three flat years, a margin that never kept the gross-margin gains, and EPS that took five years to climb back to the FY21 level. We forecast EPS of ₹${n1(X.epsU[0])} / ${n1(X.epsU[1])} / ${n1(X.epsU[2])} for FY27-29E on 27.28 cr shares, ~${Math.round(X.epsCagrPf)}% a year from the pro forma FY26 base, helped by lower remediation costs, Senn turning profitable and interest on the warrant money.` },
    ],
  };
})();

const seasons = {
  id: 'seasons', nav: 'Quarterly trend', kicker: 'Quarters', title: 'Quarters: the Gagillapur pause in Q2FY25, then six quarters of sequential growth; Q1FY27 was flat on Q4',
  blocks: [
    { p: 'Granules is not a seasonal business; its quarters move with US orders, launches and plant events. Revenue fell to ₹967 cr in Q2FY25 when the company paused Gagillapur for risk assessments after the FDA inspection, then grew every quarter for six quarters to ₹1,471 cr in Q4FY26. Q1FY27 was ₹1,477 cr, flat on Q4 (Europe −4% QoQ as Granules held back some legacy-molecule supply it could not reprice; CDMO −14% QoQ on project timing). The EBITDA margin rose from 20% to 24% over FY26 and was 23% in Q1FY27.' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: dip in Q2FY25, then steady growth', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated)' },
      { type: 'line', title: 'Quarterly EBITDA margin: 20% → 24% → 23%', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 10, max: 30, source: 'Screener.in' },
    ] },
    X && (() => { const rest = X.F.sales[0] - 1476.8, base = 1297.0 + 1387.9 + 1470.6; return { callout: `**What to watch:** our FY27 forecast needs ~₹${n0(rest)} cr from Q2-Q4, ${X.pc(rest / base * 100 - 100)} on a year earlier and ~₹${n0(rest / 3)} cr a quarter, against ₹1,477 cr in Q1. Gross margin is the swing item: the CFO said Q1 was insulated by US inventory bought before the West Asia cost spike. Q2FY27 results are due by mid-November 2026.` }; })(),
  ],
};

seasons.blocks = seasons.blocks.filter(Boolean);

const balance = X && (() => {
  const { cashPath, BS, n1, PF, FY26 } = X;
  const nd = [696.6, 767.1, 842.1, 706.1, 402.1, 101.2], ndPf = 101.2 - PF.cashCr;
  return {
    id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'From ₹842 cr of net debt (Mar-24) to net cash after ₹1,762 cr of promoter-led equity; working capital stays heavy at ~30% of sales',
    blocks: [
      { p: `Granules carried ₹700-840 cr of net debt (company basis, excluding leases) through FY22-FY25 while it built Genome Valley and bought Senn. Three things changed that. Operating cash flow was ₹867 cr in FY25 and ₹793 cr in FY26 (67% of EBITDA). The ₹1,762.5 cr preferential issue at ₹585 brought in ₹665.6 cr in Feb-2026 (₹300 cr of shares to eight non-promoter investors and 25% on 2.5 cr warrants, mostly the promoter group's), so net debt fell to ₹${n0(FY26.netDebtCompany)} cr at Mar-26 and ₹${n1(101.2)} cr at Jun-26 after a strong Q1 (₹387 cr of operating cash). On 16-Sep-2026 the warrants were converted and ₹1,096 cr more arrived: on our arithmetic Granules had ~₹${n0(-ndPf)} cr of net cash before Q2's cash flow, and the CFO called it "consolidated net cash" on 29-Sep-2026. Debt at Mar-26 was ₹${n0(BS.mar26.loansTotal)} cr of loans (mostly dollar packing credit at 4.2-4.6%) plus ₹${n0(BS.mar26.leases)} cr of leases; ICRA upgraded the rating to AA (Stable) in Jan-2026.` },
      { pair: [
        { type: 'column', title: 'Net debt: ₹842 cr (Mar-24) to net cash after the warrant money', unit: 'Net debt (₹ crore), company basis excl. leases; negative = net cash', x: ['Mar-22', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26', 'Jun-26', 'Jun-26 + Sep warrants*'], series: [{ name: 'Net debt', values: [...nd.map(Math.round), Math.round(ndPf)], fmt: 'num' }], labels: 'all', highlight: 'Jun-26 + Sep warrants*', source: 'Company decks (Mar-22 to Jun-26); *GAM: Jun-26 less the ₹1,096.9 cr balance due on the warrants (₹1,096.1 cr received 16-Sep-2026)' },
        { type: 'line', title: 'Inventory days high and rising; receivable days falling', unit: 'Days', x: FYS.slice(1), series: [{ name: 'Inventory days', values: X.A.inventoryDays.slice(5), fmt: 'num' }, { name: 'Receivable days', values: X.A.debtorDays.slice(5), fmt: 'num' }], labels: 'last', source: 'Screener.in (inventory days on material cost)' },
      ] },
      { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26 reported', 'Mar-26 pro forma*'], rows: [
        ['Net worth', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', n0(BS.mar26.equity), '{{A.netWorth.11|num}}'],
        ['Borrowings incl. leases', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', n0(BS.mar26.borrowingsInclLeases), '{{A.borrowings.11|num}}'],
        ['Cash, bank balances and investments', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', n0(BS.mar26.cash + BS.mar26.otherBank + BS.mar26.investments), '{{A.cashAndInvestments.11|num}}'],
        ['Inventories', '{{A.inventories.8|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', n0(BS.mar26.inventories), '{{A.inventories.11|num}}'],
        ['Trade receivables', '{{A.receivables.8|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', n0(BS.mar26.receivables), '{{A.receivables.11|num}}'],
        ['Trade payables', '{{A.payables.8|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', n0(BS.mar26.payables), '{{A.payables.11|num}}'],
        ['Net fixed assets (incl. goodwill, intangibles, leases)', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}', '{{A.fixedAssets.11|num}}'],
        ['Capital work in progress', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}', '{{A.cwip.11|num}}'],
      ], source: 'Screener.in (consolidated); AR FY26. *Pro forma for the 16-Sep-2026 warrant conversion: +₹1,096.9 cr cash and equity, 27.28 cr shares (GRANULES.patch.js)' } },
      { callout: `**Cash in the model.** The engine starts from ₹${n0(cashPath[0])} cr of net cash at Mar-26 pro forma (Screener cash ₹949 cr + investments ₹1 cr − borrowings incl. leases ₹1,512 cr + ₹1,097 cr warrant money) and builds it to ₹${n0(cashPath[1])} / ${n0(cashPath[2])} / ${n0(cashPath[3])} cr by Mar-27/28/29E after capex of ₹600-650 cr a year and working capital at ~37% of incremental sales (Screener basis; the company's own measure is 29-33%). That is a cash case, not a forecast of buy-backs: management is "very actively" looking at acquisitions, and the use of the preferential money (capex, working capital, R&D, inorganic growth) is not yet specific.` },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the founder family holds ~38%; the CMD sold shares in May-2024 and Sep-2026 and bought warrants in between',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic funds sold in FY26; foreign funds came back in 2026', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in (to Jun-2026)' },
      { type: 'column', title: 'Promoters: 42.0% → 38.0% (May-2024 sale, Feb-2026 issue)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 30, max: 45, source: 'BSE shareholding pattern, Screener.in (to Jun-2026)' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Consolidated. History FY17-FY26; all subsidiaries are 100% owned. EBITDA is before other income; Screener nets exceptional items into other income (FY25 +₹28 cr, FY26 −₹13 cr on its basis). The Mar-26 balance sheet and FY26 EPS are pro forma for the Sep-2026 warrant conversion (27.28 cr shares; reported FY26 EPS ₹24.01). Forecast other income is interest on gross cash above the Mar-26 level plus recurring items; no forex gains are forecast.' },
    { statement: { title: 'Profit & loss, FY17–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA (before other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (history incl. exceptional items)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹; FY26 pro forma)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income incl. exceptional' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

module.exports = { financials, seasons, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'GRANULES.research.js')) ? require('./GRANULES.research') : null;
  const report = {
    symbol: 'GRANULES', listing: 'NSE: GRANULES · BSE: 532482', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Pharmaceuticals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  const rup = o => JSON.parse(JSON.stringify(o).replace(/\bRs ?(?=[0-9])/g, '₹')); // research JSONs write Rs; the report uses ₹
  report.cover = rup(report.cover); report.sections = rup(report.sections);
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
