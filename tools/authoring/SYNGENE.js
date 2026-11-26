// Authoring source for the Syngene International initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; no patch needed: Net Profit equals "Profit for
// EPS" in every year and quarter, all three subsidiaries are 100% owned, and implied FY26 shares of 40.33 cr match the 40.29 cr
// outstanding at Mar-26). Part B (SYNGENE.research.js + part2-6, shared SYNGENE.ctx.js / ctx2.js) adds the research chapters,
// cover, rating and statement notes. Usage: node tools/authoring/SYNGENE.js (runs SYNGENE.mult.js first to keep the built other
// income, interest and multiples in step with the model).
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'SYNGENE', 'research');
if (require.main === module) { require('./SYNGENE.mult').syncAll(); for (const m of ['./SYNGENE.ctx', './SYNGENE.ctx2']) delete require.cache[require.resolve(m)]; }
const X = require('./SYNGENE.ctx2');
const n0 = v => Math.round(v).toLocaleString('en-IN');
const FYS = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const ix = FYS.map(f => X.ai(f));

const financials = (() => {
  const { A, n1, epsU, F } = X;
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue doubled in seven years at a ~30% margin; then FY26 stalled (+3%), the margin fell to 25% and profit before exceptional items fell 20%',
    blocks: [
      { p: `Syngene grew revenue from ₹1,826 cr in FY19 to ₹3,739 cr in FY26, ~11% a year, while holding an EBITDA margin of 29-31% (Screener basis, which is the company's 'operating EBITDA': forex hedge results inside, other income outside). Growth came in two legs: discovery and dedicated centres for big pharma (BMS above all), and commercial biologics manufacturing for Zoetis's dog-arthritis antibody Librela under a 2018 long-term contract. That second leg has now gone into reverse. FY25 revenue grew only 4%, FY26 3% (US$ revenue fell from US$430 mn to US$419 mn), and in FY26 the margin dropped to ${n1(A.ebitdaMargin[X.b])}%: Librela volumes fell, the newly capitalised Unit 3 biologics plant added cost without much revenue, staff costs rose 14%, and hedges booked at ~₹87/$ lost money as the rupee fell (₹61 cr). Profit before exceptional items fell from ₹475 cr to ₹380 cr; reported profit from ₹496 cr to ₹317 cr after labour-code and severance charges.` },
      { pair: [
        { type: 'column', title: 'Revenue: ₹1,826 cr (FY19) to ₹3,739 cr (FY26), flat for three years', unit: 'Revenue (₹ crore)', x: FYS, series: [{ name: 'Revenue', values: ix.map(i => A.sales[i]), fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (consolidated)' },
        { type: 'line', title: 'EBITDA margin: 29-31% for six years, 24.6% in FY26', unit: 'EBITDA margin (%), Screener basis', x: FYS, series: [{ name: 'EBITDA margin', values: ix.map(i => Math.round(A.ebitdaMargin[i] * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: 'Screener.in (= company operating EBITDA, incl. forex hedge results)' },
      ] },
      { pair: [
        { type: 'column', title: 'Net profit: peaked at ₹510 cr in FY24, ₹317 cr in FY26', unit: 'Net profit (₹ crore)', x: FYS, series: [{ name: 'Net profit', values: ix.map(i => A.pat[i]), fmt: 'num' }], labels: 'all', source: 'Screener.in (reported, after exceptional items)' },
        { type: 'line', title: 'Return on equity: 18-20% in FY19-20, 11-13% in FY22-25, 6.6% in FY26', unit: 'Return on equity (%)', x: FYS, series: [{ name: 'ROE', values: ix.map(i => Math.round(A.roe[i] * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: 'Screener.in' },
      ] },
      { exhibit: { type: 'table', title: 'FY24 → FY26: where the profit went (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Note'], wide: [4], rows: [
        ['Revenue', '{{A.sales.6|num}}', '{{A.sales.7|num}}', '{{A.sales.8|num}}', 'US$418 mn → 430 mn → 419 mn; Librela destocking from the start of FY26'],
        ['EBITDA (operating, Screener)', '{{A.ebitda.6|num}}', '{{A.ebitda.7|num}}', '{{A.ebitda.8|num}}', 'FY26: staff +14% (32.9% of revenue), Unit 3 costs, ₹61 cr hedge loss'],
        ['Depreciation', '{{A.dep.6|num}}', '{{A.dep.7|num}}', '{{A.dep.8|num}}', 'Unit 3 capitalised in Q1FY26'],
        ['Other income (Screener, net of exceptional items)', '{{A.otherIncome.6|num}}', '{{A.otherIncome.7|num}}', '{{A.otherIncome.8|num}}', 'FY26: ₹71 cr of treasury income less ₹77 cr of pre-tax exceptional charges; FY25 incl. the insurance gain'],
        ['Interest', '{{A.interest.6|num}}', '{{A.interest.7|num}}', '{{A.interest.8|num}}', 'Mostly lease interest (₹38 cr in FY26)'],
        { hl: true, cells: ['**Net profit**', '**{{A.pat.6|num}}**', '**{{A.pat.7|num}}**', '**{{A.pat.8|num}}**', 'Before exceptional items: ₹521 cr (Screener) / ₹475 cr / ₹380 cr'] },
        ['EPS (₹)', '{{A.eps.6|n1}}', '{{A.eps.7|n1}}', '{{A.eps.8|n1}}', `Before exceptional items: ₹${n1(X.epsEx[2024])} / ₹${n1(X.epsEx[2025])} / ₹${n1(X.epsEx[2026])}`],
      ], source: 'Screener.in; AR FY26 MD&A p.193 and notes 19, 23, 36; Q4FY26 deck p.27' } },
      { callout: `**Our view:** FY26 was not a one-quarter wobble. Underlying (ex-Librela) growth was 'high single digits' in constant currency (CFO), but that was before Q1FY27, when revenue fell 16% and research services also lost clients. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E: FY27 is the trough, and FY29 only gets back to FY23's EPS. Operating cash flow stays healthy (₹915 cr in FY26) and the balance sheet is net cash, so this is an earnings problem, not a solvency one.` },
    ],
  };
})();

const seasons = {
  id: 'seasons', nav: 'Quarterly pattern', kicker: 'Quarters', title: 'Q4 is always the strongest quarter and Q1 the weakest; Q1FY27 (₹736 cr, 12% margin) was the worst quarter in four years',
  blocks: [
    { p: 'Customer advances arrive in January-March and many contracts close at the fiscal year-end, so Q4 is Syngene\'s biggest quarter (₹1,018 cr in Q4FY25, ₹1,036 cr in Q4FY26, with 29-34% margins) and Q1 its smallest. In Q1FY27 revenue fell 16% to ₹736 cr with almost no Librela; the operating margin fell to 12.4% (Screener) after a ₹50 cr forex hedge loss, and the company made a ₹9 cr loss after a ₹10 cr severance charge. Management guides to an H2 that is "much stronger" than H1.' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: Q4 peaks, Q1 troughs; Q1FY27 -16%', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated)' },
      { type: 'line', title: 'Quarterly EBITDA margin: 22-35% until Q1FY27\'s 12%', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 40, source: 'Screener.in' },
    ] },
    { callout: `**What to watch:** our FY27 forecast needs ~₹${n0(X.F.sales[0] - X.Q1.revenue)} cr of revenue in Q2-Q4, -4% on last year's ₹2,864 cr, at a ~${(Math.round((X.F.ebitda[0] - 91) / (X.F.sales[0] - X.Q1.revenue) * 1000) / 10).toFixed(1)}% margin. Management's 'mid-20s' full-year margin would need ~29%. Q2FY27 results are due by mid-November 2026.` },
  ],
};

const balance = (() => {
  const { cashPath, NC_CO, LEASES, TRE, n1 } = X;
  return {
    id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: `A strong balance sheet: ₹1,800 cr of net cash at Mar-26 (before ₹449 cr of leases), rising to ~₹${n0(Math.round(NC_CO[3] / 100) * 100)} cr by Mar-29E; customers fund part of the working capital`,
    blocks: [
      { p: `Syngene has run with net cash for years. At Mar-26 it held ₹${n0(TRE.mar26.gross)} cr of cash, bank deposits, inter-corporate deposits and liquid funds against ₹${n0(TRE.mar26.borrowings)} cr of bank debt: net cash of ₹1,800 cr on the company's definition, or ₹${n0(cashPath[0])} cr after ₹${n0(LEASES)} cr of lease liabilities (our engine basis). Cash swings within the year (₹902 cr at Dec-25, ₹1,541 cr at Jun-26) because customers pay advances in January-March. Working capital is negative: ₹664 cr of customer advances and deferred revenue for customer-funded assets exceed receivables (₹509 cr, ~50 days) and inventory (₹141 cr). Capital work in progress is large (₹1,040 cr), mostly the Bayview site that is not yet capitalised.` },
      { pair: [
        { type: 'column', title: `Net cash (company basis, excl. leases): ₹1,280 cr → ₹1,800 cr → ~₹${n0(NC_CO[3])} cr`, unit: 'Net cash excl. leases (₹ crore), March year-end', x: ['FY25', 'FY26', ...X.YRS], series: [{ name: 'Net cash', values: [Math.round(TRE.mar25.netCompany), Math.round(TRE.mar26.netCompany), ...NC_CO.slice(1).map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'AR FY26 notes 5, 6, 11, 13; GAM estimates (engine net cash + leases − strategic stakes)' },
        { type: 'line', title: 'Receivable days down from ~70 to ~50', unit: 'Days', x: FYS, series: [{ name: 'Receivable days', values: ix.map(i => X.A.debtorDays[i]), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      ] },
      { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
        ['Net worth', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}', '{{A.netWorth.8|num}}'],
        ['Borrowings incl. leases', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}', '{{A.borrowings.7|num}}', '{{A.borrowings.8|num}}'],
        ['Cash and bank balances', '{{A.cash.5|num}}', '{{A.cash.6|num}}', '{{A.cash.7|num}}', '{{A.cash.8|num}}'],
        ['Investments (liquid funds, ICDs, strategic stakes)', '{{A.investments.5|num}}', '{{A.investments.6|num}}', '{{A.investments.7|num}}', '{{A.investments.8|num}}'],
        ['Trade receivables', '{{A.receivables.5|num}}', '{{A.receivables.6|num}}', '{{A.receivables.7|num}}', '{{A.receivables.8|num}}'],
        ['Net fixed assets', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.8|num}}'],
        ['Capital work in progress', '{{A.cwip.5|num}}', '{{A.cwip.6|num}}', '{{A.cwip.7|num}}', '{{A.cwip.8|num}}'],
      ], source: 'Screener.in (consolidated). Screener leaves ₹275 cr of bank deposits over 12 months (Mar-26) in other assets; the model adds them to treasury' } },
      { callout: `**Cash in the model.** The engine's net cash (incl. leases) is ₹${n0(cashPath[0])} cr at Mar-26 and ₹${n0(cashPath[1])} / ${n0(cashPath[2])} / ${n0(cashPath[3])} cr at Mar-27E/28E/29E: free cash flow of ₹${n0(X.F.fcf[0])} / ${n0(X.F.fcf[1])} / ${n0(X.F.fcf[2])} cr after capex of ₹400-500 cr. Net cash is ~${n1(cashPath[0] / X.mcap * 100)}% of market value: a cushion, not the investment case.` },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Biocon 52.4%, domestic funds 28.0%, foreign investors 11.8% (from 20.9% in Mar-24)',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic funds bought what foreign investors sold', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'Public', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter (Biocon group): 54.8% → 52.6% after Biocon\'s Dec-2024 sale', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 45, max: 60, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Consolidated. History FY18-FY26. EBITDA is on Screener\'s basis, the same as the company\'s operating EBITDA (forex hedge results inside, other income outside). Screener nets exceptional items into other income (FY26 -₹77 cr pre-tax). Forecast other income is treasury income on gross cash (no exceptional items); forecast interest is mostly lease interest.' },
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA (operating)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (history net of exceptional items)' }, { key: 'interest', name: 'Interest' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income net of exceptional items' },
      { key: 'interest', name: 'Interest' }, { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

module.exports = { financials, seasons, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = require('./SYNGENE.research');
  const report = {
    symbol: 'SYNGENE', listing: 'NSE: SYNGENE · BSE: 539268', date: '30 September 2026', rating: B.rating, analysts: 'GAM Research — Pharmaceuticals & CRDMO',
    cover: B.cover, sections: B.sections({ financials, seasons, balance, ownershipBase, statements }), statementNotes: B.statementNotes,
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
