// Trent report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// store engine, Star & Zara, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street, valuation, verdict,
// glossary, statement notes). Shared inputs in TRENT.ctx.js; forecast and valuation figures are live tokens ({{...}}) that
// follow assumptions.json. As of 30-Sep-2026.
const X = require('./TRENT.ctx');
const { F, V, SA, SQ, n0, n1, price, mv, HA, sectorDr, MULT, epsSep, rating, postQ1, medTp, Q1, build, BL, rpsBase, rpsFY25 } = X;
const P2 = require('./TRENT.part2'), P3 = require('./TRENT.part3'), P4 = require('./TRENT.part4'), P5 = require('./TRENT.part5'), P6 = require('./TRENT.part6');
const QC = Q1.consolidated, QS = Q1.standalone;

const cover = {
  headline: 'India\'s best fashion retailer, now growing by adding space faster than sales: still priced above what the de-rated sector justifies',
  lead: `Trent runs Zudio (982 value-fashion stores) and Westside (301 department stores), ${n1(Q1.kpi.areaMnSqft)} mn sq ft in ${Q1.kpi.cities} cities at Jun-2026, all selling its own brands, plus equity-accounted stakes in Star (groceries, with Tesco) and Zara (with Inditex). Q1FY27 showed the new shape of growth: revenue +${Math.round(QC.growthPct)}% on ~33% more space, like-for-like growth "in the low single digits", a better gross margin, and profit +${Math.round((QC.pat / QC.patQ1FY26 - 1) * 100)}% as depreciation rose 40%. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E (consolidated, post-bonus). The street's SOTPs boil down to **one-year-forward P/E** (58-64x FY28E). The house rule (Trent's forward P/E median since 2021, ${n1(HA.med)}x, cut by the ${Math.abs(sectorDr).toFixed(1)}% de-rating of listed retailers) gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**, close to the HOLD line. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A superb operator with a long runway', p: `Own brands sold only in its own stores, an India-based supply chain and stable pricing gave Trent ~19% EBITDA margins and ~28% ROE while revenue grew ~34% a year over FY20-26. Management plans ~50 Westside and 200-250 Zudio stores a year towards ~700 and ~5,000; we model ${BL.storeAdds.join(' / ')} net openings for FY27-29E (${n0(build[2].stores)} stores, ${n1(build[2].area)} mn sq ft by FY29E).` },
    { h: 'But each sq ft now earns less', p: `Revenue per effective sq ft fell from ₹${n0(rpsFY25)} in FY25 to ₹${n0(rpsBase)} in FY26 and ~10% more in Q1FY27: like-for-like growth is low single digit, >80% of new Zudio stores open in smaller towns where sales per sq ft are ~18% below the metros, and Trent fills in its own catchments. We assume another −8% in FY27E, then roughly flat.` },
    { h: 'EBITDA growth flatters profit growth', p: `Rent on leased stores sits in depreciation and interest under Ind AS 116. Depreciation was 6.8% of revenue in FY26 and 7.1% in Q1FY27 (5.2% in FY25), so EBITDA +33% became profit +12% in FY26 (+22% in Q1). Star is still loss-making and a ₹2,500 cr equity raise is approved but not launched.` },
    { h: 'Valuation: the street pays for the old growth', p: `At ₹${n0(price)} Trent trades at ${n1(price / F.eps[1])}x our FY28E and ${n1(X.sepNow)}x Sep-28E EPS. Listed retailers were ${Math.abs(sectorDr).toFixed(1)}% below their five-year P/E medians on 30-Sep-2026; on the house rule Trent is worth ${MULT.base}x. The street's median target (₹${n0(medTp)}) uses 58-64x on higher standalone EPS. A DCF at a 12.2% cost of capital supports about half the price.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 business update (early October) and results (due by mid-November 2026): store openings in the festive half and whether revenue per sq ft stops falling.',
    'Festive and wedding season demand in H2FY27, against input-cost inflation that Trent is absorbing through sourcing and a "calibrated" price architecture.',
    'The ₹2,500 cr equity raise: timing, route (rights issue or QIP) and price.',
    'A new chairman after Noel Tata retires (he turns 70 in November 2026).',
    'Competition in value fashion: Reliance\'s Yousta, Landmark\'s Max, Vishal Mega Mart and quick-commerce fashion in the towns Zudio is entering.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const AK = X.C.annualKpis, Fy = F.years;
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Zudio stores: 233 in FY22, 963 in FY26; Westside 200 to 300`, unit: 'Stores at year end', x: AK.map(r => r.fy), series: [{ name: 'Zudio', values: AK.map(r => r.zudio), fmt: 'num' }, { name: 'Westside', values: AK.map(r => r.westside), fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation (Zudio incl. shop-in-shops in Star and the UAE)' },
      { type: 'column', title: 'FY26 openings were back-ended: 131 of ~250 net adds in Q4', unit: 'Net Westside + Zudio stores added in the quarter', x: SQ.filter(q => q.westsideAdds != null).map(q => q.q), series: [{ name: 'Net adds', values: SQ.filter(q => q.westsideAdds != null).map(q => q.westsideAdds + q.zudioAdds), fmt: 'num' }], labels: 'all', source: 'Q4FY26 and Q1FY27 presentations' },
    ] },
    { pair: [
      { type: 'column', title: 'Revenue per sq ft peaked in FY24-25 and fell ~13% in FY26', unit: 'Standalone revenue per average sq ft of retail area (₹)', x: [...SA.filter(r => r.revPerAvgSqft).map(r => r.fy), ...Fy], series: [{ name: 'Revenue per sq ft', values: [...SA.filter(r => r.revPerAvgSqft).map(r => r.revPerAvgSqft), ...build.map(r => Math.round(r.st * 10 / ((r.area - r.adds * BL.sqftPerNewStore + r.area) / 2)))], fmt: 'num' }], labels: 'all', source: 'GAM calculation: standalone revenue ÷ average of opening and closing retail area; FY27-29E from our store build on the same basis' },
      { type: 'line', title: 'Standalone revenue growth has settled at 16-20%', unit: 'Standalone revenue growth y/y (%)', x: SQ.filter(q => q.standaloneRevYoY != null).map(q => q.q), series: [{ name: 'Revenue growth', values: SQ.filter(q => q.standaloneRevYoY != null).map(q => q.standaloneRevYoY), fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: 'Screener.in (standalone quarterly results)' },
    ] },
    { pair: [
      { type: 'line', title: 'Margin up, but depreciation is rising too', unit: '% of revenue (consolidated)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...Fy], series: [{ name: 'EBITDA margin', values: [...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(X.A.ebitdaMargin[X.A.labels.indexOf(y)] * 10) / 10), ...F.ebitdaMargin.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }, { name: 'Depreciation', values: [...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(X.A.dep[X.A.labels.indexOf(y)] / X.A.sales[X.A.labels.indexOf(y)] * 1000) / 10), ...X.daPct.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Star: ~₹800-885 cr a quarter, growing mid-to-high single digits', unit: 'Star revenue, excl. GST (₹ crore)', x: SQ.filter(q => q.starRev).map(q => q.q), series: [{ name: 'Star revenue', values: SQ.filter(q => q.starRev).map(q => q.starRev), fmt: 'num' }], labels: 'all', source: 'Company presentations (incl. Zudio shop-in-shops; Q2-Q3 not available to us)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(X.sepNow)}x Sep-28E now vs a ${n1(HA.med)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: X.HS.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.HS.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and reported EPS (bonus-adjusted); GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q1 notes)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Business Today (7-Aug and 13-Aug-2026), DSIJ summaries of MOSL and ICICI Securities; median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.stores, P3.star, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
