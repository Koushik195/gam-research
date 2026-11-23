// Infosys report, part 2b: verticals (the US$ revenue build and the rupee path) and the operating engine
// (deals, people, utilisation, costs, margin mechanics).
const X = require('./INFY.ctx');
const { C, F, A, AS, n0, n1, pc, pc1, rup, SA, SQ, QL, A26, A25, Q1, FY26, b, UB, FX, VK, usdV, usdTot, usdG, fxG, ebitM, ebitHist } = X;
const VN = UB.names;
const cst = FY26.costs, c25 = FY26.costsFy25, pct = (x, s) => n1(x / s * 100) + '%';

const verticals = {
  id: 'verticals', nav: 'Verticals & the US$ build', kicker: 'Segments', title: 'The US$ build: ~2% growth in FY27 (half of it bought), ~3-3.5% after that',
  blocks: [
    { p: `We forecast revenue the way Infosys reports it: in US dollars, by vertical, then converted at a stated rupee rate. FY26 was US$${n0(FY26.usdRev)} mn (+${FY26.usdGrowthPct}% reported, +${FY26.ccGrowthPct}% in constant currency, of which ~${FY26.acqContributionPct} points from acquisitions). For FY27 the company guides 1.5-3.0% in constant currency, including ~1.7 points from Optimum Healthcare IT and Stratus; organic growth at the midpoint is ~0.5%. We model ${n1(usdG[0])}% for FY27, ${n1(usdG[1])}% for FY28 and ${n1(usdG[2])}% for FY29. Life sciences jumps on the Optimum acquisition; manufacturing shrinks as one large European client cuts spending and Infosys walks away from deals it calls uneconomic.` },
    { exhibit: { type: 'table', title: 'US$ revenue by vertical: history and forecasts (US$ mn)', head: ['Vertical', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Growth FY27E / 28E / 29E'], wide: [6], rows: [
      ...VK.map(k => [VN[k], n0(A25[k + 'Rev']), n0(A26[k + 'Rev']), ...usdV[k].map(n0), UB.growth[k].map(x => pc1(x)).join(' / ')]),
      { hl: true, cells: ['**Total US$ revenue**', `**${n0(A25.usdRev)}**`, `**${n0(A26.usdRev)}**`, ...usdTot.map(v => `**${n0(v)}**`), `**${usdG.map(pc1).join(' / ')}**`] },
      ['Rs per US$ (average)', n1(A25.inrPerUsd), n1(A26.inrPerUsd), ...FX.map(n1), fxG.map(pc1).join(' / ')],
      { hl: true, cells: ['**Rupee revenue (₹ crore)**', `**${n0(A.sales[b - 1])}**`, `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**', '**{{F.salesGrowth.0|chg}} / {{F.salesGrowth.1|chg}} / {{F.salesGrowth.2|chg}}**'] },
    ], source: 'Infosys fact sheets (history: quarterly mix x US$ revenue); GAM Research estimates. The authoring script checks that US$ revenue x Rs/US$ equals model revenue.' } },
    { exhibit: { type: 'table', title: 'Why we expect what we expect, by vertical', head: ['Vertical', 'Our reasoning'], wide: [1], rows: VK.map(k => [VN[k], rup(UB.growthWhy[k])]), source: 'Q1FY27 call (23-Jul-2026), Q4FY26 call (23-Apr-2026), fact sheets; GAM Research' } },
    { pair: [
      { type: 'column', title: 'US$ revenue: we assume no return to the FY22-23 pace', unit: 'US$ revenue (US$ mn)', x: [...SA.map(a => a.fy), ...F.years], series: [{ name: 'US$ revenue', values: [...SA.map(a => a.usdRev), ...usdTot.map(Math.round)], fmt: 'num' }], labels: 'ends', source: 'Infosys fact sheets; GAM estimates FY27-29E' },
      { type: 'line', title: 'The rupee did a lot of the work: ₹71 to ₹95.5 per dollar', unit: 'Average Rs per US$ (Infosys conversion), FY27-29E assumed', x: [...SA.map(a => a.fy), ...F.years], series: [{ name: 'Rs/US$', values: [...SA.map(a => a.inrPerUsd), ...FX], fmt: 'n1' }], labels: 'all', min: 60, source: 'Infosys fact sheets (₹ revenue ÷ US$ revenue); GAM assumptions' },
    ] },
    { callout: `**Geography:** North America is 56% of revenue and has barely grown (Q1FY27 +3.2% cc YoY); Europe rose from 28% to 32% in two years on large deals (+2.8% cc in Q1FY27), but is now where the European-manufacturing and auto weakness sits. We do not forecast geographies separately. **Currency:** ${rup(AS.fx._why)}` },
  ],
};

const engine = {
  id: 'engine', nav: 'Deals, people & margins', kicker: 'Operating engine', title: 'Deals up, people flat, margin held by price, utilisation and the rupee',
  blocks: [
    { pair: [
      { type: 'column', title: 'Large-deal TCV: US$11.6 bn (FY25), US$14.9 bn (FY26)', unit: 'Large-deal TCV (US$ bn)', x: SA.map(a => a.fy), series: [{ name: 'TCV', values: SA.map(a => a.tcvLargeBn), fmt: 'n1' }], labels: 'all', source: 'Infosys fact sheets' },
      { type: 'line', title: 'Attrition back to ~13% from 28% in FY22', unit: 'Voluntary attrition, LTM, IT services (%)', x: SA.filter(a => a.attritionPct).map(a => a.fy), series: [{ name: 'Attrition', values: SA.filter(a => a.attritionPct).map(a => a.attritionPct), fmt: 'pct' }], labels: 'all', min: 0, source: 'Infosys fact sheets' },
    ] },
    { exhibit: { type: 'table', title: 'Operating KPIs by quarter', head: ['', ...QL], rows: [
      ['Large-deal TCV (US$ bn)', ...SQ.map(q => n1(q.tcvLargeBn))],
      ['Employees (\'000)', ...SQ.map(q => n1(q.headcount / 1000))],
      ['Utilisation excl. trainees (%)', ...SQ.map(q => n1(q.utilExTraineesPct))],
      ['Voluntary attrition, LTM (%)', ...SQ.map(q => n1(q.attritionPct))],
      ['Onsite effort (%)', ...SQ.map(q => n1(q.onsitePct))],
      ['EBIT margin, adjusted (%)', ...SQ.map(q => n1(q.opMarginAdjPct))],
      ['Free cash flow (US$ mn)', ...SQ.map(q => n0(q.fcfUsd))],
    ], source: 'Infosys fact sheets' } },
    { p: `**Costs.** People are the business: employee costs were ₹${n0(cst.employee)} cr in FY26 (${pct(cst.employee, A.sales[b])} of revenue, ${pct(c25.employee, A.sales[b - 1])} in FY25) and subcontractors ₹${n0(cst.subcontractors)} cr (${pct(cst.subcontractors, A.sales[b])}, up from ${pct(c25.subcontractors, A.sales[b - 1])}). Third-party software and hardware bought for clients fell to ${pct(cst.softwarePackagesThirdParty, A.sales[b])} of revenue (${pct(c25.softwarePackagesThirdParty, A.sales[b - 1])}), which management says cut reported growth by ~1 point but helped margins. Wage hikes come in October 2026 (most staff) and January 2027 (seniors); FY26's hikes came in January and April 2025, so FY27 bears less of a full-year effect.` },
    { exhibit: { type: 'table', title: 'Q1FY27 operating-margin bridge (vs Q4FY26: 20.9% to 21.1%)', head: ['Item', 'Impact'], rows: [...Q1.marginBridge, { hl: true, cells: ['**Net change**', '**+20 bp**'] }], source: 'Infosys Q1FY27 earnings call (CFO, 23-Jul-2026)' } },
    { exhibit: { type: 'table', title: 'From the company\'s EBIT margin to our EBITDA margin', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['EBITDA margin (Screener basis; model driver)', n1(A.ebitdaMargin[b - 1]) + '%', n1(A.ebitdaMargin[b]) + '%', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}'],
      ['less D&A, % of revenue', n1(A.dep[b - 1] / A.sales[b - 1] * 100) + '%', n1(A.dep[b] / A.sales[b] * 100) + '%', ...[0, 1, 2].map(i => n1(F.dep[i] / F.sales[i] * 100) + '%')],
      { hl: true, cells: ['**EBIT margin (our model)**', `**${n1(ebitHist(b - 1))}%**`, `**${n1(ebitHist(b))}%**`, ...[0, 1, 2].map(i => `**${n1(ebitM(i))}%**`)] },
      ['Company operating margin (IFRS, adjusted)', '21.1%', '21.0%', 'Guidance 20-22%', '–', '–'],
    ], source: 'Screener.in; Infosys fact sheets; GAM Research. FY26 EBITDA excludes the ₹1,289 cr Labour Codes charge (Screener puts it in other income); the ~0.1-point gap to the company is a ₹165 cr property gain that IFRS shows in operating profit.' } },
    { callout: '**So what:** the engine has changed. Before FY23 Infosys grew by adding people (headcount from 242,000 to 343,000 in three years). Since FY24 it has grown revenue per person instead: US$56,200 (FY24) to US$61,800 (FY26), helped by price increases, a lower onsite mix and AI tools. That protects margins while it lasts, but price increases are getting harder (Q1FY27) and the AI productivity gain is being passed to clients. We hold the EBIT margin at ~21% and assume no margin expansion.' },
  ],
};

module.exports = { verticals, engine };
