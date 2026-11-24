// Vishal Mega Mart report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, store engine, categories and own brands, moat, Q1FY27, earnings quality, ownership, governance, forecasts,
// street, valuation, verdict, glossary, statement notes). Shared inputs in VMM.ctx.js; forecast and valuation figures are
// live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./VMM.ctx');
const { F, V, SA, SQ, n0, n1, n2, price, mv, PE12, sector12, MULT, epsSep, rating, postQ1, medTp, Q1, build, BL, C } = X;
const P2 = require('./VMM.part2'), P3 = require('./VMM.part3'), P4 = require('./VMM.part4'), P5 = require('./VMM.part5'), P6 = require('./VMM.part6');

const cover = {
  headline: 'Small-town India\'s value department store, still compounding at ~18% with double-digit same-store growth; the PE overhang and the retail de-rating have halved the multiple: BUY',
  lead: `Vishal Mega Mart runs ${Q1.stores} leased stores (${n1(Q1.areaMnSqft)} mn sq ft, ${Q1.cities} cities, ~74% in Tier 2 and smaller towns) selling apparel, general merchandise and FMCG, three-quarters under its own brands. Q1FY27: revenue +${Q1.growthPct}%, same-store sales growth (SSSG) ${Q1.sssgPct}% (DMart 5.5%), profit +${Math.round((Q1.pat / Q1.patQ1FY26 - 1) * 100)}%. Management plans ~100 large stores a year plus small-format stores. We forecast EPS of ₹${n2(F.eps[0])} / ₹${n2(F.eps[1])} / ₹${n2(F.eps[2])} for FY27-29E, a little below the street. The street values VMM on **one-year-forward P/E** (44-55x). VMM listed in Dec-2024, so the house rule uses its own forward P/E median over the last 12 months (${n1(PE12.med)}x) cut by the ${Math.abs(sector12).toFixed(1)}% fall in retail peers' P/E over the same window: **${MULT.base}x Sep-28E EPS of ₹${n2(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF only ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A same-store growth machine', p: `Adjusted SSSG of 12.3% in FY25, 11.0% in FY26 and ${Q1.sssgPct}% in Q1FY27, driven by volume: 7-8% more customers and ~3% more spend each. Own brands (${C.business.ownBrandsPct.Q1FY27}% of Q1 revenue) price 30-50% below national FMCG leaders and carry 100% of apparel, so VMM gains share when budgets are squeezed.` },
    { h: 'A long, cheap runway', p: `~100 large-format stores a year (line of sight on ~400 over four years, ~2,000 in time) plus small formats in saturated UP and Haryana. We model ${BL.netAdds.join(' / ')} net additions (${build[2].stores} stores, ${n1(build[2].area)} mn sq ft by FY29E). Stores are leased: cash capex is ~₹3 cr per store and payback ~19 months (IPO-era RedSeer data).` },
    { h: 'What holds the stock back', p: `The sponsors (Kedaara Capital, Partners Group) sold ~33% in two blocks eight months apart and still own 40.1%; the forward P/E fell from ~${Math.round(PE12.max)}x to ~${Math.round(X.fwdNow)}x in 12 months with no earnings miss. Apparel competition (Zudio, V2 Retail, V-Mart) is intense, inflation squeezes VMM's mass-market shoppers, and rent and minimum wages rise every year.` },
    { h: 'Valuation: the de-rating has gone far enough', p: `At ₹${n0(price)} VMM trades at ${n1(X.fwdNow)}x our FY28E and ${n1(X.sepNow)}x Sep-28E EPS, below even the de-rated ${MULT.base}x. Our {{dcf.tp|inr}} is below every post-Q1 broker target (₹140-170, median ₹${n1(medTp)}). The DCF (₹${n0(mv('dcf').value)} at an 11.9% cost of capital) says the price already assumes 15+ years of growth, so this is a BUY on the multiple rule, not a deep-value call.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'GREEN' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): Durga Puja falls in Q3FY27 (Q2 last year), so Q2 SSSG will look soft and Q3 strong; watch H1 together.',
    'Store openings: ~833 stores at the Sep-2026 analyst meet (+38 since March); the ~100-a-year large-format pace plus 4-5 small stores a quarter.',
    'The sponsors\' remaining 40.1%: a further block would add supply (two blocks so far, Jun-2025 and Feb-2026); a clean exit would remove the overhang.',
    'Inflation: fabric and petroleum-linked input costs (West Asia); VMM keeps entry prices fixed and passes increases only at higher price points.',
    'New format pilot (younger, more affluent shoppers; first store in Delhi), the four-hub DC network and RFID roll-out (NCR first).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const AK = C.annualKpis, Fy = F.years, q8 = SQ.slice(-9);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Stores: 501 in FY22, 795 in FY26, ${build[2].stores} in FY29E on our numbers`, unit: 'Stores at year end', x: [...AK.map(r => r.fy), ...Fy], series: [{ name: 'Stores', values: [...AK.map(r => r.stores), ...build.map(r => r.stores)], fmt: 'num' }], labels: 'all', source: 'Company KPI tables and presentations; GAM estimates FY27-29E' },
      { type: 'line', title: 'Same-store growth: 10% or more in eight of the last nine quarters', unit: 'Adjusted SSSG, stores open 15+ months (%)', x: q8.map(q => q.q), series: [{ name: 'SSSG', values: q8.map(q => q.sssgPct), fmt: 'pct' }], labels: 'all', min: 0, max: 16, source: 'Company presentations (Q3FY26 adjusted for Durga Puja falling in Q2; 6.1% reported)' },
    ] },
    { pair: [
      { type: 'column', title: 'Revenue per sq ft: +9-10% a year in FY25-26', unit: 'Revenue per average sq ft of retail area (₹)', x: [...SA.filter(r => r.revPerAvgSqft).map(r => r.fy), ...Fy], series: [{ name: 'Revenue per sq ft', values: [...SA.filter(r => r.revPerAvgSqft).map(r => r.revPerAvgSqft), ...build.map(r => Math.round(r.rps))], fmt: 'num' }], labels: 'all', source: 'GAM calculation: revenue ÷ average of opening and closing retail area; FY27-29E from our store build' },
      { type: 'column', title: 'Three categories growing together', unit: 'Revenue by category (₹ crore)', x: SA.map(r => r.fy), series: [{ name: 'Apparel', values: SA.map(r => r.apparel), fmt: 'num' }, { name: 'General merchandise', values: SA.map(r => r.gm), fmt: 'num' }, { name: 'FMCG', values: SA.map(r => r.fmcg), fmt: 'num' }], labels: 'none', source: 'Q4FY25 presentation KPI table; FY26 presentation' },
    ] },
    { pair: [
      { type: 'line', title: 'Operating margin (pre-Ind AS 116): up y/y in every quarter, strongly seasonal', unit: 'Operating EBITDA margin, before rent accounting and ESOP (%)', x: q8.map(q => q.q), series: [{ name: 'Operating EBITDA margin', values: q8.map(q => q.operatingMarginPct), fmt: 'pct' }], labels: 'all', min: 0, max: 15, source: 'Company presentations' },
      { type: 'column', title: 'The sponsor has sold down from 76% to 40%', unit: 'Promoter (Samayat Services LLP) holding (%)', x: 'SH.periods', series: [{ name: 'Promoter', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 0, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(X.fwdNow)}x now vs a ${n1(PE12.med)}x median over the last 12 months`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; FY26 reported EPS, GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q1 notes)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes and press reports, 23-Jul to 25-Sep-2026 (see street table); median ₹${n1(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.stores, P3.categories, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
