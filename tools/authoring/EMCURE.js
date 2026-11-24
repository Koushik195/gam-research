// Authoring source for the Emcure Pharmaceuticals initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the attributable basis,
// see EMCURE.patch.js). Part B (EMCURE.research.js + part2-6, shared EMCURE.ctx.js) adds the research chapters.
// Usage: node tools/authoring/EMCURE.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'EMCURE', 'research');
const X = fs.existsSync(path.join(__dirname, 'EMCURE.ctx.js')) ? require('./EMCURE.ctx') : null;
const n0 = v => Math.round(v).toLocaleString('en-IN');

const FYS = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const financials = X && (() => {
  const { A, EXC_AT, SHR, epsRep, byBase, epsU, n1, TRUEUP, FY26 } = X;
  const yrs = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const exEps = yrs.map((y, i) => (y === 2026 ? Math.round(byBase[2026] * 10) / 10 : Math.round((A.eps[i] - (EXC_AT[y] || 0) / (A.pat[i] / A.eps[i])) * 10) / 10));
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue ×2 in seven years and margins up from 14% to 19%; EPS stalled in FY23-24 and has compounded since the IPO cut the debt',
    blocks: [
      { p: `Emcure's revenue grew from ₹4,717 cr in FY19 to ₹9,204 cr in FY26 (10% a year), but unevenly: +7% in FY20, flat in FY21 (the year the US business was demerged), +16% in FY22, flat in FY23, then +11% / +19% / +17% in FY24-26 as the Sanofi cardiac brands (from Mar-2024), Mantra in Canada (Nov-2023) and new launches in Europe and the rest of the world kicked in. EBITDA margin rose from 14-16% before FY21 to 23-24% in FY21-22 and has settled at 18-20% since FY23 (FY26 19.4% on the company basis). **Profit is where the change shows.** Profit to shareholders fell from ₹662 cr in FY22 to ₹498 cr in FY24 (higher interest, depreciation and a weaker margin), then rose to ₹681 cr in FY25 and ₹924 cr in FY26 (EPS ₹${n1(epsRep[2026])}; ₹${n1(byBase[2026])} before exceptional items and the ₹${n1(TRUEUP)} cr Mantra earn-out true-up) as IPO money repaid debt, the margin improved and foreign-exchange gains (₹${n0(FY26.fxGain)} cr) helped. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E.` },
      { pair: [
        { type: 'column', title: 'Revenue: ₹4,717 cr to ₹9,204 cr, accelerating since FY24', unit: 'Revenue (₹ crore)', x: FYS, series: [{ name: 'Revenue', values: A.sales, fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (consolidated)' },
        { type: 'line', title: 'EBITDA margin: COVID peak, then a 18.5-19.5% band', unit: 'EBITDA margin (%), revenue less operating costs (Screener)', x: FYS, series: [{ name: 'EBITDA margin', values: A.ebitdaMargin.map(v => Math.round(v * 10) / 10), fmt: 'pct' }], labels: 'all', min: 10, max: 26, source: 'Screener.in; FY26 company basis 19.4% (Screener books the ₹43 cr earn-out true-up in costs)' },
      ] },
      { pair: [
        { type: 'hbar', title: 'Where each rupee of FY26 revenue went', unit: 'FY26, % of revenue (company)', x: ['Materials and traded goods', 'Other expenses (incl. R&D 4.2%)', 'Employees', 'EBITDA'], series: [{ name: 'Share', values: [39.7, 24.0, 16.9, 19.4], fmt: 'pct' }], labels: 'all', highlight: 'EBITDA', source: 'AR FY26 consolidated P&L (traded goods ₹2,397 cr = 26% of revenue)' },
        { type: 'column', title: 'EPS: flat for three years, then +31% and +36%', unit: 'EPS (₹)', x: FYS, series: [{ name: 'Reported', values: A.eps, fmt: 'n1' }, { name: 'Before exceptional items (FY26 also before the earn-out true-up)', values: exEps, fmt: 'n1' }], labels: 'all', source: 'Screener.in (exceptional items after tax); AR FY26 note 63' },
      ] },
      { exhibit: { type: 'table', title: 'FY24 → FY26: what drove the profit recovery (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Note'], wide: [4], rows: [
        ['Revenue', '{{A.sales.5|num}}', '{{A.sales.6|num}}', '{{A.sales.7|num}}', 'Sanofi cardiac brands from Mar-2024; Mantra (Canada) from Nov-2023'],
        ['EBITDA (Screener)', '{{A.ebitda.5|num}}', '{{A.ebitda.6|num}}', '{{A.ebitda.7|num}}', 'Company EBITDA ₹1,230 / 1,469 / 1,789 cr (FY26 excl. the ₹43 cr earn-out true-up)'],
        ['Depreciation & amortisation', '{{A.dep.5|num}}', '{{A.dep.6|num}}', '{{A.dep.7|num}}', 'Intangibles ₹106 cr and leases ₹53 cr of FY26'],
        ['Finance cost', '{{A.interest.5|num}}', '{{A.interest.6|num}}', '{{A.interest.7|num}}', '₹600 cr of IPO money repaid debt in FY25'],
        ['Other income (incl. exchange gains and exceptional items)', '{{A.otherIncome.5|num}}', '{{A.otherIncome.6|num}}', '{{A.otherIncome.7|num}}', `FY26: exchange gains ₹${n0(FY26.fxGain)} cr, other income ₹13 cr, exceptional −₹31 cr`],
        ['Tax rate', '25%', '27%', '27%', 'FY26 26% before exceptional items'],
        ['Minorities (Zuventus, Gennova)', '29', '26', '17', 'Nil from FY27 (both wholly owned)'],
        { hl: true, cells: ['**Profit to shareholders**', '**{{A.pat.5|num}}**', '**{{A.pat.6|num}}**', '**{{A.pat.7|num}}**', ''] },
        ['EPS reported / before exceptional items (₹)', `${epsRep[2024]} / ${n1(exEps[5])}`, `${epsRep[2025]} / ${n1(exEps[6])}`, `${epsRep[2026]} / ${n1(byBase[2026])}`, 'FY26 also before the earn-out true-up (no tax)'],
      ], source: 'Screener.in; AR FY26 notes 30, 35-37, 57, 63; Q4FY26 deck; GAM' } },
      { callout: `**Our view:** Emcure's growth since FY24 is real but has three parts of different quality: a domestic franchise growing ~10% (only 6-8% excluding in-licensed brands), international generics and ARV growing 20%+ (helped by a weaker rupee), and lower interest after the IPO. Margins have improved slowly (+90bp in two years) because the faster-growing parts carry lower gross margins. We forecast EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and EPS growth of ${Math.round((epsU[0] / byBase[2026] - 1) * 100)}% / ${Math.round((epsU[1] / epsU[0] - 1) * 100)}% / ${Math.round((epsU[2] / epsU[1] - 1) * 100)}% (FY27E on FY26 EPS before exceptional items; no exchange gains forecast).` },
    ],
  };
})();

const capital = X && (() => {
  const { FY26, n1, EARNOUT, GENNOVA, CUTIMED } = X;
  const spent = FY26.zuventusNciPaid + EARNOUT + GENNOVA + CUTIMED;
  return {
    id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'The IPO repaid debt; then ~₹1,330 cr went on buying out minorities and earn-outs. Returns are good (ROCE ~24%), the latest buyouts less so',
    blocks: [
      { p: `Emcure raised ₹800.6 cr of new money in the Jul-2024 IPO (₹758.9 cr net), used ₹600 cr to repay borrowings and the rest for general corporate purposes (fully used by Mar-25). Net debt fell from ₹1,558 cr (Mar-24) to ₹434 cr (Mar-25). Since then the cash has gone mostly to tidying up the group rather than to growth assets: ₹724.9 cr for the 20.42% minority of Zuventus (Oct-2025), ₹335.8 cr to settle the Mantra earn-out (Jul-2026), ₹231.9 cr for the 12.05% minority of Gennova (Jul-2026) and up to ₹33.8 cr for Cutimed (Apr-2026), on top of the Manx product portfolio in the UK (~£19.7 mn, 2025). Capex has stayed modest at ₹276-488 cr a year (3-5% of revenue), and R&D at 3.6-4.4% of revenue.` },
      { pair: [
        { type: 'column', title: 'Cash from operations vs capex: conversion is weak', unit: '₹ crore', x: FYS, series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex (incl. intangibles)', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: 'Screener.in cash flow' },
        { type: 'line', title: 'ROCE: 19% to 24% as the IPO cut debt', unit: 'Return on capital employed (%)', x: FYS.slice(1), series: [{ name: 'ROCE (Screener)', values: [11, 22, 26, 21, 19, 20, 24], fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in (company: 19.4% / 22.0% / 23.7% in FY24-26, EBIT ÷ equity plus net debt)' },
      ] },
      { exhibit: { type: 'table', title: 'Where the cash went, FY24-FY26 (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26'], rows: [
        ['Cash from operations', '{{A.cfo.5|num}}', '{{A.cfo.6|num}}', '{{A.cfo.7|num}}'],
        ['Capex (PP&E and intangibles)', '{{A.capex.5|num}}', '{{A.capex.6|num}}', '{{A.capex.7|num}}'],
        ['Acquisitions (Mantra FY24; Zuventus minority FY26)', '345', '–', '725'],
        ['IPO proceeds (fresh issue, net of costs paid)', '–', '779', '7 (ESOPs)'],
        ['Interest paid', '208', '129', '95'],
        ['Dividends', '62', '–', '57'],
        { hl: true, cells: ['**Net borrowing raised / (repaid)**', '**+168**', '**−1,406**', '**+551**'] },
      ], source: 'Screener.in cash-flow schedules; AR FY26 notes 57, 64; Sep-2026 deck p41' } },
      { exhibit: { type: 'table', title: 'The four deals since the IPO and what they cost', head: ['Deal', 'Price', 'What it bought', 'Our arithmetic'], wide: [2, 3], rows: [
        ['Zuventus minority (20.42%), Oct-2025', '₹724.9 cr', 'Full control of the acute-focused India subsidiary (~40% of the field force; FY26 revenue ₹1,041 cr, −4%; profit ₹157 cr)', '~23x Zuventus FY26 profit. The minority profit recaptured (~₹32 cr) is below the post-tax interest on the price (~₹40 cr at 7.5%): neutral to slightly dilutive until Zuventus grows again'],
        ['Mantra earn-out, paid Jul-2026', '₹335.8 cr (CAD 50.23 mn)', 'Final payment for the Nov-2023 Quebec acquisition (CAD 94.5 mn upfront)', `Earn-out came in above the CAD 44 mn first estimated because Mantra performed better than expected (CFO); ₹${n1(FY26.earnoutTrueUp)} cr true-up charged in FY26`],
        ['Gennova minority (12.05%), Jul-2026', '₹231.9 cr', 'Full control of the biologics arm (Tenectase, biosimilars) from its CEO and other individuals; mRNA business spun out to the CEO', 'Implies ~₹1,924 cr for a company that earned ₹5.4 cr in FY26 (revenue ₹492 cr): a strategic, related-party price, dilutive to EPS'],
        ['Cutimed (Canada), Apr-2026', 'Up to ₹33.8 cr', 'Dermatology and cosmetics brands in Quebec', 'Small bolt-on for the Canadian front end'],
      ], source: 'AR FY26 notes 57, 63, 65; Kotak Neo (14-Jul-2026); GAM' } },
      { callout: `**Our read:** the IPO did what it promised (₹600 cr of debt repaid) and returns on capital are respectable for a generics-heavy business (ROCE ~24%). But in the last twelve months Emcure spent ~₹${n0(spent)} cr buying out minorities and settling an earn-out, about three years of FY25-26 free cash flow (₹445 cr and ₹396 cr), and the Gennova price is hard to justify on its earnings. The simpler structure (all subsidiaries now 100% owned) removes minority leakage and related-party friction inside the group; the test is whether Zuventus and Gennova now grow.` },
    ],
  };
})();

const balance = X && (() => {
  const { ndCo, lev, grossDebt, grossCash, F, FY26, Q1, YRS, intBuild, EARNOUT, GENNOVA, CUTIMED, LEASE_PRIN } = X;
  const fmtNd = v => (v >= 0 ? n0(v) : '(' + n0(-v) + ')');
  return {
    id: 'balance', nav: 'Debt & IPO proceeds', kicker: 'Balance sheet', title: `Net debt: ₹1,558 cr before the IPO, ₹434 cr after it, ₹1,054 cr after the Zuventus buyout; on our path ~nil by Mar-28 and net cash by Mar-29`,
    blocks: [
      { p: `Gross borrowings were ₹${n0(FY26.grossDebt)} cr at Mar-26 against ₹${n0(FY26.cashAndLiquid)} cr of cash and liquid investments: net debt ₹${n0(FY26.netDebtCompany)} cr (0.6x EBITDA), excluding ₹${n0(FY26.leases)} cr of lease liabilities and the ₹${n0(EARNOUT)} cr Mantra earn-out payable. Most of the debt is short-term working-capital finance (₹795 cr), plus a ₹194 cr rupee term loan (raised in FY26, secured on plant and brands) and ₹212 cr of Canadian-dollar term loans at Mantra and Marcan guaranteed by the parent. Net debt was ₹${n0(Q1.netDebt)} cr at Jun-26 and rose to ~₹1,560 cr in August after the July payouts (Mantra ₹336 cr, Gennova ₹232 cr); the CFO expects ~₹1,450 cr at Sep-26 and net cash by end-FY28. Our path, which adds the Gennova and Cutimed payments and lease principal (~₹${LEASE_PRIN} cr a year) that the engine does not see, gives net debt of ₹${fmtNd(ndCo[1])} cr at Mar-27, ₹${fmtNd(ndCo[2])} cr at Mar-28 and net cash of ₹${n0(-ndCo[3])} cr at Mar-29.` },
      { pair: [
        { type: 'column', title: 'Net debt: the IPO cut it, the buyouts put it back', unit: 'Net debt (₹ crore), company basis (ex-leases); FY27-29E = GAM', x: ['Mar-24', 'Mar-25', 'Mar-26', 'Jun-26', 'Sep-26 (guided)', ...YRS], series: [{ name: 'Net debt', values: [1558, 434, 1054, 1103, 1450, ...ndCo.slice(1).map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'Jun-26', source: 'Company decks and calls (Q4FY26, Q1FY27); GAM Research' },
        { type: 'line', title: 'Net debt / EBITDA: never stretched; below zero by FY29E', unit: 'Net debt ÷ EBITDA (x); FY27-29E = GAM', x: ['Mar-24', 'Mar-25', 'Mar-26', ...YRS], series: [{ name: 'Net debt / EBITDA', values: [1.3, 0.3, Math.round(lev[0] * 100) / 100, ...lev.slice(1).map(v => Math.round(v * 100) / 100)], fmt: 'x' }], labels: 'all', min: -0.5, max: 1.5, source: 'Company decks; GAM Research' },
      ] },
      { exhibit: { type: 'table', title: 'Borrowings at Mar-26 and our path (₹ crore)', head: ['', 'Mar-26', 'Mar-27E', 'Mar-28E', 'Mar-29E'], rows: [
        ['Working-capital loans and cash credit (Mar-26)', '795', '', '', ''],
        ['Rupee term loan (secured on PP&E and brands)', '197', '', '', ''],
        ['Canadian-dollar term loans (Mantra, Marcan)', '212', '', '', ''],
        ['Gross borrowings (ex-leases)', ...grossDebt.map(n0)],
        ['Cash and liquid investments', ...grossCash.map(n0)],
        { hl: true, cells: ['**Net debt / (net cash), company basis**', ...ndCo.map(v => `**${fmtNd(v)}**`)] },
        ['Net debt / EBITDA', ...lev.map(v => v.toFixed(2) + 'x')],
        ['Finance cost (year to; model)', n0(FY26.financeCost), ...F.interest.map(n0)],
        ['Memo: outflows the engine does not see (FY27)', '–', `${n0(GENNOVA + CUTIMED)} + ${LEASE_PRIN}`, `${LEASE_PRIN}`, `${LEASE_PRIN}`],
      ], source: `AR FY26 notes 19-20, 36, 63; Q1FY27 call; GAM Research. Gross debt = net debt + ₹150 cr operating cash, floored at ₹300 cr (subsidiary loans). Interest = 7.5% on average gross debt + leases ₹27 cr + other borrowing costs ₹18 cr + advance-tax interest ₹3 cr + earn-out unwind ₹5 cr (FY27): ${intBuild.map(n0).join(' / ')} cr (checked in EMCURE.ctx.js).` } },
      { callout: '**What to watch.** (1) Working capital: inventory and receivables rose ₹1,027 cr in FY26 (payables +₹328 cr); working capital absorbed ₹530 cr of cash and operating cash flow was 53% of company EBITDA. If that persists, deleveraging slows. (2) Further buyouts or acquisitions: management has spent ~₹1,330 cr in twelve months on group simplification. (3) ₹197 cr owed by the promoter-owned US company (Avet) at Mar-26.' },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Mehta family owns 77.8%; Bain has gone; the promoters must still sell ~2.8% to meet the public-float rule',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic funds bought Bain\'s blocks', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'Public (incl. Bain until Jun-26)', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 78.1% → 77.8%, above the 75% cap', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 70, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Net profit is profit attributable to shareholders (after minorities; EMCURE.patch.js). Other income in the history includes foreign-exchange gains and exceptional items (FY26: exchange gains ₹119 cr, exceptional items −₹31 cr). Screener\'s FY26 EBITDA includes the ₹43 cr Mantra earn-out true-up as a cost. Forecasts carry no minorities, exchange gains or exceptional items.' },
    { statement: { title: 'Profit & loss, FY19–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'otherIncome', name: 'Other income (history incl. FX gains and exceptional items)' }, { key: 'interest', name: 'Finance cost' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA (Screener; quarters incl. FX gains)' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income incl. exceptional' },
      { key: 'dep', name: 'Depreciation & amortisation' }, { key: 'interest', name: 'Interest' }, { key: 'pat', name: 'Net profit (owners)', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'EMCURE.research.js')) ? require('./EMCURE.research') : null;
  const report = {
    symbol: 'EMCURE', listing: 'NSE: EMCURE · BSE: 544210', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
