// Lupin report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// US, India, other markets, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street, valuation, risks,
// glossary, statement notes). Shared inputs in LUPIN.ctx.js. Forecast and valuation figures are live tokens ({{...}}) or
// computed from the model, so they follow assumptions.json. As of 30-Sep-2026.
const X = require('./LUPIN.ctx');
const { F, V, n0, n1, SQ, QL, Q1, FY26, price, mv, peMult, epsSep28, HA, fwdAdj, rating, postQ1, avgTp, medTp, peFY27, peFY28, lines, YRS, BL, k, CONS, sellLineTp } = X;
const P2 = require('./LUPIN.part2'), P3 = require('./LUPIN.part3'), P4 = require('./LUPIN.part4'), P5 = require('./LUPIN.part5'), P6 = require('./LUPIN.part6');

const cover = {
  headline: 'Three US exclusivities made FY26; competition is now taking them away. The base business is better than ever, but the price already pays for the replacements',
  lead: `Lupin is India's eighth-largest drug maker and the third-largest generic company in the US by prescriptions. FY26 was a record (EPS ₹${n1(X.A.eps[X.b])}, EBITDA margin 29%) because three US products had little or no competition: generic Spiriva (an inhaler), Mirabegron and Tolvaptan. Brokers estimate the three were about half of earnings. Q1FY27 was another record (US $${Q1.usUsdMn}mn, margin ${Q1.ebitdaMarginPct}%), but management guides US sales back to $250-280mn a quarter as Apotex and Teva enter Tolvaptan, and an EBITDA margin of ~25% for FY27. The stock is ₹${n0(price)} (19% below its July high): ${n1(peFY27)}x our FY27E EPS and ${n1(peFY28)}x FY28E, with ₹${n0(Q1.netCashCr)} cr of net cash. The street values Lupin on **P/E (22-26x forward EPS)**. We forecast EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} for FY27-29E, a little below consensus (₹${CONS.FY27E} / ${CONS.FY28E} for FY27-28E). Applying **${peMult}x to Sep-28E EPS of ₹${n1(epsSep28)}** (Lupin's own forward median of ${n1(HA.med)}x since 2021 on EPS before exceptional items, leaving out the FY23 trough, re-rated by the pharma sector's +8.2%) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The windfall is being competed away, on schedule', p: `Tolvaptan (sole generic since May-2025) gets two rivals from Q2FY27 and possibly a third in September; Mirabegron got a third generic in Q1 and broad entry from Sep-2027; Spiriva has no generic rival yet but its market is moving to the Respimat version. Management guides US sales of $1.1-1.2bn for FY27 (FY26 US$${n0(FY26.usUsdMn)}mn). We model US$${n0(BL.usdMn[0])}mn / ${n0(BL.usdMn[1])}mn / ${n0(BL.usdMn[2])}mn for FY27-29E and EPS ${X.pc(F.epsGrowth[0])} in FY27E.` },
    { h: 'The business underneath is much stronger than in FY23', p: `Outside the US, organic growth was over 20% in Q1FY27: India +${Q1.indiaGrowthPct}% (prescriptions +${Q1.indiaRxGrowthPct}% vs the market's ${Q1.ipmGrowthPct}%, 67% chronic), Europe +${Q1.europeGrowthPct}% with VISUfarma, Brazil +${Q1.brazilLcGrowthPct}% in local currency. Gross margin is 74.6% against ~59% in FY23. That is why we expect margins to settle at ~23-24%, not to fall back to the 10% of FY23.` },
    { h: 'The replacements are real but arrive late', p: 'The apixaban oral suspension was tentatively approved on 25-Sep-2026 and should launch around summer 2027 with 10-12 months before generics; pegfilgrastim (a biosimilar) launches in H2FY27; Lupin won its ivacaftor patent case in August; Dulera, Spiriva Respimat and more biosimilars follow in FY28-29. Management expects US growth to resume in FY28. Emkay calls that optimistic; Citi sees US sales falling to $975mn by FY29.' },
    { h: 'Valuation: the price already assumes the replacements work', p: `At ${n1(peFY28)}x FY28E Lupin trades above its own ${n1(HA.med)}x forward median since 2021 (trough year left out): the market paid ~16x forward when the forward year held the windfall. ${peMult}x Sep-28E gives {{dcf.tp|inr}}, ${X.pc((V.tp / price - 1) * 100)} from here and within ${n0(Math.abs(V.tp - sellLineTp) / price * 100)}% of the SELL line. EV/EBITDA is kinder (₹${n0(mv('ev').value)}), the DCF harsher (₹${n0(mv('dcf').value)}); the street's ₹${n0(medTp)} median target is ${n1(medTp / CONS.FY28E)}x consensus FY28E EPS.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first quarter with Apotex and Teva in Tolvaptan; US sales against the $250-280mn guide and margin against ~25% for the year.',
    'US launches in H2FY27: pegfilgrastim (via Valorum), ranibizumab, raltegravir (exclusive first-to-file), dalbavancin and fluticasone nasal spray.',
    'Apixaban oral suspension: final approval and launch (commercial quantities from Jan-2027, launch around summer 2027); ivacaftor launch after the Aug-2026 court win.',
    'Competition: a possible fourth Tolvaptan generic; broad Mirabegron entry from Sep-2027; any generic Spiriva approval.',
    'USFDA: Pithampur Unit-2 (OAI) remediation; warning letters at Tarapur and Mandideep; use of cash for specialty acquisitions.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const usQ = SQ.map(q => q.usUsd), inQ = SQ.map(q => q.india);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'US sales: $231mn to $371mn a quarter; guided back to $250-280mn', unit: 'US sales (US$ mn); last bar = guidance midpoint for Q2-Q4FY27', x: [...QL, 'Guide'], series: [{ name: 'US', values: [...usQ, 265], fmt: 'num' }], labels: 'all', highlight: 'Guide', source: 'Company releases; Q1FY27 call' },
      { type: 'column', title: 'India: ₹2,380 cr in Q1FY27, +14%', unit: 'India sales (₹ crore)', x: QL, series: [{ name: 'India', values: inQ, fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company releases' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 23% to 31% in four quarters; ~25% guided for FY27', unit: 'EBITDA margin (%), company basis', x: SQ.filter(q => q.ebitdaMarginPct).map(q => q.q), series: [{ name: 'EBITDA margin', values: SQ.filter(q => q.ebitdaMarginPct).map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'all', min: 15, max: 35, source: 'Company releases and calls' },
      { type: 'column', title: 'EPS: a FY26 peak, a lower plateau after', unit: 'EPS (₹); reported to FY26, GAM estimates FY27-29E', x: 'fin.labels', from: 'FY21', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in, GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E (before exceptional items, ex-trough): median ${n1(HA.med)}x since 2021`, unit: 'Price ÷ next full-year EPS before exceptional items (x); FY23 trough dates left out', x: fwdAdj.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdAdj.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HA.med, text: `Median ${n1(HA.med)}x` }, { v: peMult, text: `Our target ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; company EPS before exceptional items; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => `${s.broker} (${s.rating})`), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and aggregators, 8-27 Aug 2026; GAM Research' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Growth now comes from India, Europe and emerging markets', unit: 'Product sales by market (₹ crore); FY27-29E = GAM build', x: ['FY26', ...YRS], series: [{ name: 'US', values: [BL.base.us, ...lines.us], fmt: 'num' }, { name: 'India', values: [BL.base.india, ...lines.india], fmt: 'num' }, { name: 'Other developed', values: [BL.base.odm, ...lines.odm], fmt: 'num' }, { name: 'Emerging + API', values: [BL.base.em + BL.base.api, ...lines.em.map((v, i) => v + lines.api[i])], fmt: 'num' }], minLabel: 2000, source: 'Q4FY26 press release; GAM estimates' },
      { type: 'hbar', title: 'Target, cross-checks and scenarios', unit: '₹ per share', x: ['Bear case', 'DCF', 'GAM target', 'CMP', 'EV/EBITDA', 'Street average', 'Bull case'], series: [{ name: 'Value', values: [X.SC.bear.tp, Math.round(mv('dcf').value), V.tp, price, Math.round(mv('ev').value), Math.round(avgTp), X.SC.bull.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM target', source: 'GAM Research; street average of the eight post-Q1 targets' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.us, P3.pipeline, P3.india, P3.others, P3.moat, p.financials, p.margins, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
