// Cipla report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, India, US, Africa & EMEU, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street,
// valuation, risks, glossary, statement notes). Shared inputs in CIPLA.ctx.js. Forecast and valuation figures are
// live tokens ({{...}}) or computed from the model, so they follow assumptions.json. As of 30-Sep-2026.
const X = require('./CIPLA.ctx');
const { F, V, A, n0, n1, pc, SQ, QL, Q1, FY26, b, price, mv, peMult, epsSep28, HA, FM, fwdAdj, rating, ST, ela, idir, postQ1, avgTp, peFY27, peFY28, sectorDr, lines, YRS, BL } = X;
const P2 = require('./CIPLA.part2'), P3 = require('./CIPLA.part3'), P4 = require('./CIPLA.part4'), P5 = require('./CIPLA.part5'), P6 = require('./CIPLA.part6');

const cover = {
  headline: 'The gRevlimid hangover is in the price; the inhaler relaunch in the US and the Indian franchise are not. Patience required',
  lead: `Cipla is one of India's three largest drug makers and its respiratory leader (26% of the Indian respiratory market), with half its revenue in India, a quarter in the US and the rest in Africa, emerging markets and Europe. Its profit fell 26% in FY26 when a US windfall ended: a generic of the blood-cancer drug Revlimid, sold under a settlement that kept prices high, stopped in the December 2025 quarter, and its lanreotide partner's plant was barred from the US. Q1FY27 EBITDA margin was 16.7% (25.6% a year earlier) and US revenue $162mn a quarter, against management's goal of a $1bn annual run-rate by March 2027. The stock has moved {{P.returns.1y|chg}} in a year to ₹${n0(price)}: ${n1(peFY27)}x our FY27E EPS and ${n1(peFY28)}x FY28E, with ₹${n0(Q1.netCash)} cr of net cash. The street values Cipla on **P/E on FY28E EPS (19-25x)**. We forecast EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} for FY27-29E, below the street: our US build is more cautious than management's. Applying **${peMult}x to Sep-28E EPS of ₹${n1(epsSep28)}** (Cipla's own forward median on EPS before exceptional items, ${n1(HA.med)}x, re-rated by the pharma sector's +${n1(sectorDr)}%) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}; the DCF is the warning. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'India is the anchor, and it is accelerating', p: `One India (₹${n0(FY26.india)} cr, 45% of revenue) grew ${Q1.indiaGrowthPct}% in Q1FY27, the prescription business ${Q1.rxSecondaryGrowthPct}% (183bp ahead of the market). Cipla owns Indian respiratory (Foracort is the country's No.1 inhaler brand at ~₹1,070 cr), is the largest company by volume, runs the biggest trade-generics network and added Eli Lilly's tirzepatide (Yurpeak, ~₹80 cr in its first full quarter). We model India at +11% / +10% / +10%.` },
    { h: 'The US cliff is behind; the relaunch depends on approvals', p: `North America fell from $250mn a quarter (Q1FY25) to $${Q1.naUsdMn}mn. The rebuild is in complex inhalers and peptides: gVentolin (approved Apr-2026, six months of exclusivity), gAdvair (approved 27-Jul-2026, but with three or four rivals), gSymbicort, a third inhaler and a first-to-file peptide still pending. We model $${BL.usdMn[0]}mn / $${BL.usdMn[1]}mn / $${BL.usdMn[2]}mn for FY27-29E, below management's ~$1bn exit run-rate, because Pithampur (seven USFDA observations in Aug-2026) and competition keep slipping the timeline.` },
    { h: 'Margins bottomed in Q4FY26; EPS should rebound ~30% in FY28', p: `We model EBITDA margins of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}: the bottom of the 18.5-20% FY27 guidance, then back to the pre-windfall ~21% as high-margin in-house inhalers fill US plants that are already staffed. FY28E EPS (₹${n1(F.eps[1])}) is ${Math.round((1 - F.eps[1] / idir.eps.FY28E) * 100)}% below ICICI Direct and ${Math.round((1 - F.eps[1] / ela.eps.FY28E) * 100)}% below Elara, whose FY28 includes a one-off first-to-file exclusivity.` },
    { h: 'Valuation: fair to cheap on history, expensive on cash flows', p: `At ${n1(peFY28)}x FY28E Cipla trades below its ${n1(HA.med)}x forward median since 2021, while pharma peers trade ~${Math.round(sectorDr)}% above their own five-year medians. That gives ${peMult}x and {{dcf.tp|inr}}. But ROE is ~12% against an ${n1(V.ke)}% cost of equity and the DCF says ₹${n0(mv('dcf').value)}: the target needs the launches to arrive and the market to keep paying a growth multiple for them.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first quarter with gAdvair and a ramping gVentolin; margin against the 18.5-20% guidance.',
    'USFDA approvals for gSymbicort, the third respiratory asset (filed from Goa) and the first-to-file peptide, all expected in FY27.',
    'Pithampur: Cipla\'s response to the seven observations of Aug-2026 and the site classification; the warning letter has been in place since Nov-2023.',
    'Competition: gVentolin\'s six-month exclusivity runs out around the end of 2026; the number of gAdvair rivals.',
    'Lanreotide: partner remediation or the alternate US site (filing targeted by Q4FY27); use of ₹9,500 cr of net cash.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const naQ = SQ.map(q => q.naUsd), inQ = SQ.map(q => q.india);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'The US cliff: $250mn a quarter to $155-162mn', unit: 'North America revenue (US$ mn)', x: QL, series: [{ name: 'North America', values: naQ, fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations' },
      { type: 'column', title: 'India: +12% in Q1FY27, the highest quarter yet', unit: 'One India revenue (₹ crore)', x: QL, series: [{ name: 'One India', values: inQ, fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 28% (Q3FY25) to 15% (Q4FY26); 16.7% in Q1FY27', unit: 'EBITDA margin (%), company basis', x: QL, series: [{ name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'all', min: 10, max: 30, source: 'Company presentations' },
      { type: 'column', title: 'EPS: back to the FY25 peak only by FY29E', unit: 'EPS (₹); reported to FY26, GAM estimates FY27-29E', x: 'fin.labels', from: 'FY22', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in, GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E (before exceptional items): median ${n1(HA.med)}x since 2021`, unit: 'Price ÷ next full-year EPS before exceptional items (x)', x: fwdAdj.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdAdj.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HA.med, text: `Median ${n1(HA.med)}x` }, { v: peMult, text: `Our target ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; company EPS before exceptional items; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => `${s.broker} (${s.rating})`), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and aggregators, 23-27 Jul 2026; GAM Research' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Where growth comes from: India and the US relaunch', unit: 'Revenue by business (₹ crore); FY27-29E = GAM build', x: ['FY26', ...YRS], series: [{ name: 'India', values: [X.BL.base.india, ...lines.india], fmt: 'num' }, { name: 'USA', values: [X.BL.base.usa, ...lines.usa], fmt: 'num' }, { name: 'One Africa', values: [X.BL.base.africa, ...lines.africa], fmt: 'num' }, { name: 'Rest of world', values: [X.BL.base.row, ...lines.row], fmt: 'num' }], minLabel: 3000, source: 'AR FY26 note 53; GAM estimates' },
      { type: 'hbar', title: 'Target, cross-checks and scenarios', unit: '₹ per share', x: ['Bear case', 'DCF', 'CMP', 'EV/EBITDA', 'Street average', 'GAM target', 'Bull case'], series: [{ name: 'Value', values: [X.SC.bear.tp, Math.round(mv('dcf').value), price, Math.round(mv('ev').value), Math.round(avgTp), V.tp, X.SC.bull.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM target', source: 'GAM Research; street average of the ten post-Q1 targets' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.india, P3.us, P3.africa, P3.moat, p.financials, p.margins, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
