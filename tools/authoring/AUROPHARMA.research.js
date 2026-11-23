// Aurobindo Pharma report, part B: cover, story in charts, and the merger of part2-8 (business, history, industry, tailwind
// test, US, injectables, Europe, growth markets/ARV/APIs, biosimilars & CMO, moat, Q1FY27, earnings quality, ownership,
// governance, forecasts, street, valuation, risks, glossary, statement notes). Shared inputs in AUROPHARMA.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) or computed from the model. As of 30-Sep-2026.
const X = require('./AUROPHARMA.ctx');
const { F, V, A, n0, n1, pc, SQ, QL, Q1, FY26, b, price, mv, MULT, EPS_SEP, epsPost, HA, FM, fwdAdj, rating, idir, mosl, pl_, postQ1, avgTp, peFY27, peFY28, lines, YRS, BL, fxPp27, lannettPp27, lannett27, SECTOR_SET, dcfPost } = X;
X.assertSynced();
const P2 = require('./AUROPHARMA.part2'), P3 = require('./AUROPHARMA.part3'), P4 = require('./AUROPHARMA.part4'), P5 = require('./AUROPHARMA.part5'), P6 = require('./AUROPHARMA.part6'), P7 = require('./AUROPHARMA.part7'), P8 = require('./AUROPHARMA.part8');

const growth27 = (F.sales[0] / A.sales[b] - 1) * 100, organicPp = growth27 - fxPp27 - lannettPp27;
const cover = {
  headline: 'The rupee, Lannett and Pen-G lift FY27; the US base is flat and Eugia is stuck behind the FDA. At 18x, the price is about right',
  lead: `Aurobindo is India's largest generics exporter to the US by approved products (737 final approvals) and a top-ten generics company in eight European countries. FY26 revenue was ₹${n0(FY26.revenue)} cr: US 43%, Europe 31%, APIs 12%, Growth Markets 10%, ARV 4%. Q1FY27 revenue rose ${Q1.revenueYoYPct}% and operating EBITDA ${pc((Q1.opEbitda / Q1.ebitdaPrior - 1) * 100)} to ₹${n0(Q1.opEbitda)} cr (21.0% margin), but about two-thirds of the revenue growth was the weaker rupee (₹94.5 vs ₹85.5 per dollar); US sales in dollars were $${Q1.usUsdMn}mn, below the $426mn of two years earlier. The stock has risen {{P.returns.1y|chg}} in a year to ₹${n0(price)}: ${n1(peFY27)}x our FY27E EPS and ${n1(peFY28)}x FY28E. The street values Aurobindo on **P/E on FY28E or 12-month-forward EPS (18-20x)**. We forecast EPS of ₹${n1(epsPost[0])} / ${n1(epsPost[1])} / ${n1(epsPost[2])} for FY27-29E (per post-buyback share), in line with PL and Motilal Oswal and far below ICICI Direct. Applying **${MULT.base}x to Sep-28E EPS of ₹${n1(EPS_SEP.base)}** (Aurobindo's own forward median on EPS before exceptional items, ${n1(HA.med)}x, re-rated by the pharma sector's +${SECTOR_SET}%) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'FY27 growth is mostly the rupee and Lannett', p: `Of our ${n1(growth27)}% FY27E revenue growth, ~${n1(fxPp27)} points are currency and ~${n1(lannettPp27)} points Lannett (the US generics maker bought for $250mn, closed 29-Jun-2026); organic growth is ~${n1(organicPp)}%. US revenue fell 7% in dollars in FY26 as generic Revlimid faded; ex-Revlimid it grew 5% quarter on quarter in Q1. Lannett adds ~$60mn a quarter, a US plant at 40% utilisation and a generic Advair launch.` },
    { h: 'Europe and the API backbone are the real improvement', p: `Europe passed EUR1bn in FY26 and grew 11% in constant currency in Q1 (EUR${Q1.europeEurMn}mn) with EBITDA margins now above 20%, up from single digits four years ago, as products move to Aurobindo's own plants in India and China. The Pen-G plant (₹3,058 cr) now supplies the company's penicillins, with PLI support and a minimum import price to Jan-2027. Gross margin reached 61.3% in Q4FY26.` },
    { h: 'Injectables are stuck behind the FDA', p: 'Eugia, the ~$500mn injectables arm, has Unit III under a warning letter since Aug-2024 and re-classified OAI in 2026, and Unit I received a warning letter on 13-Aug-2026. Management guides single-digit growth. Biosimilars (four EU/UK approvals, US filings due) and the MSD biologics contract plant are options that pay mostly after FY28.' },
    { h: 'Valuation: fair, not cheap', p: `At ${n1(peFY28)}x FY28E Aurobindo trades above its ${n1(HA.med)}x forward median since 2021 (on EPS before exceptional items), after a 53% rally. Our ${MULT.base}x target multiple equals ICICI Direct's and PL's. ROE is ~11% against an ${n1(V.ke)}% cost of equity and the DCF (₹${n0(mv('dcf').value)}) sits below the price: the bull case needs the US base and Eugia to grow again.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹, FY26 count)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first quarter with Lannett and generic Advair; whether EBITDA reaches the ~₹2,200 cr a quarter management is aiming for.',
    'Eugia: the response to the Unit I warning letter (13-Aug-2026) and the Unit III remediation; any FDA re-inspection.',
    'Biosimilars: EMA filing of omalizumab (due Q3 2026) and the first US filings (omalizumab, denosumab, bevacizumab) promised for 2026.',
    'US trade policy: the 21-Jul-2026 proposal of a 100% tariff on imported generics from 2028 unless made in the US; Lannett is Aurobindo\'s hedge.',
    'Pen-G: renewal or lapse of the minimum import price (expires Jan-2027) and the FY26 PLI payment; TheraNym Unit 1 qualification from Nov-2026.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const usQ = SQ.map(q => q.usUsd), euQ = SQ.map(q => q.europeEur);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'US sales in dollars: no growth in two years', unit: 'US formulations revenue (US$ mn)', x: QL, series: [{ name: 'US', values: usQ, fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations' },
      { type: 'column', title: 'Europe in euros: +21% in two years', unit: 'Europe formulations revenue (EUR mn)', x: QL, series: [{ name: 'Europe', values: euQ, fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations' },
    ] },
    { pair: [
      { type: 'waterfall', title: `FY27E revenue: +${n1(growth27)}%, but only ~${n1(organicPp)}% organic`, unit: 'Revenue (₹ crore), FY26 to FY27E; GAM estimates', x: ['FY26', 'Weaker rupee', 'Lannett (Q2-Q4)', 'Organic', 'FY27E'], series: [{ name: '₹ cr', values: [A.sales[b], Math.round(fxPp27 / 100 * A.sales[b]), Math.round(lannett27), Math.round(F.sales[0] - A.sales[b] - fxPp27 / 100 * A.sales[b] - lannett27), Math.round(F.sales[0])], fmt: 'num' }], fmt: 'num', totalFmt: 'num', source: 'GAM estimates: FY26 business volumes at FY27E exchange rates; Lannett ~US$195mn in Q2-Q4' },
      { type: 'line', title: 'EBITDA margin: 20-21% for nine quarters', unit: 'EBITDA margin (%), company basis', x: QL, series: [{ name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'all', min: 15, max: 25, source: 'Company presentations' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E (before exceptional items): median ${n1(HA.med)}x since 2021`, unit: 'Price ÷ next full-year EPS before exceptional items (x)', x: fwdAdj.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdAdj.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HA.med, text: `Median ${n1(HA.med)}x` }, { v: MULT.base, text: `Our target ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; EPS before exceptional items (Screener schedules); GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => `${s.broker} (${s.rating})`), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and aggregators, 6-Aug to 1-Sep 2026; GAM Research' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Where revenue comes from: the US stays ~43%', unit: 'Revenue by business (₹ crore); FY27-29E = GAM build', x: ['FY26', ...YRS], series: [{ name: 'US', values: [BL.base.us, ...lines.us], fmt: 'num' }, { name: 'Europe', values: [BL.base.europe, ...lines.europe], fmt: 'num' }, { name: 'Growth Markets + ARV', values: [BL.base.gm + BL.base.arv, ...lines.gm.map((v, i) => v + lines.arv[i])], fmt: 'num' }, { name: 'APIs', values: [BL.base.api, ...lines.api], fmt: 'num' }], minLabel: 3000, source: 'Q4FY26 presentation; GAM estimates' },
      { type: 'hbar', title: 'Target, cross-checks and scenarios', unit: '₹ per share', x: ['Bear case', 'DCF', 'EV/EBITDA', 'CMP', 'GAM target', 'Street average', 'Bull case'], series: [{ name: 'Value', values: [X.SC.bear.tp, Math.round(mv('dcf').value), Math.round(mv('ev').value), price, V.tp, Math.round(avgTp), X.SC.bull.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM target', source: 'GAM Research; street average of the six post-Q1 targets' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.us, P3.injectables, P4.europe, P4.growth, P4.biosimilars, P5.moat, p.financials, p.margins, P5.guidance, p.capital, P5.quality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P6.forecasts, P6.street, P7.valuation, P7.risks, p.statements, P8.glossary],
  statementNotes: P8.statementNotes,
};
