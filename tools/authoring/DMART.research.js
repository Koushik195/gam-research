// DMart report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// store engine, DMart Ready, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street, valuation, verdict,
// glossary, statement notes). Shared inputs in DMART.ctx.js; forecast and valuation figures are live tokens ({{...}}) that
// follow assumptions.json. As of 30-Sep-2026.
const X = require('./DMART.ctx');
const { F, V, SA, SQ, n0, n1, price, mv, HA, sectorDr, MULT, epsSep, rating, postQ1, medTp, Q1, build, BL } = X;
const P2 = require('./DMART.part2'), P3 = require('./DMART.part3'), P4 = require('./DMART.part4'), P5 = require('./DMART.part5'), P6 = require('./DMART.part6');
const QC = Q1.consolidated, QS = Q1.standalone;

const cover = {
  headline: 'India\'s best-run value grocer, now growing at ~15% with quick commerce at the metro gates: fairly priced after the retail de-rating',
  lead: `DMart runs 503 owned-or-leased hypermarkets (20.7 mn sq ft) selling food, FMCG and general merchandise at everyday low prices, plus a loss-making online arm (DMart Ready). Q1FY27 showed the new shape of growth: standalone revenue +${QS.growthPct}% on ~19% more selling area, like-for-like growth down to ${QS.lflPct}% (older metro stores flat), consolidated profit +${Math.round((QC.pat / QC.patQ1FY26 - 1) * 100)}%. Management's plan is to add ~15% to the store base a year and keep gross margin at 14-15%. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E. The street's targets are DCF, EV/EBITDA or P/E, but every note translates into a **one-year-forward P/E** (54-65x). The house rule (DMart's forward P/E median since 2021, ${n1(HA.med)}x, cut by the ${Math.abs(sectorDr).toFixed(1)}% de-rating of listed retailers) gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF only ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The store engine still runs', p: `500 stores at Mar-26 after a record 85 openings in FY26 (58 in Q4), and a 2-3 year pipeline of land. Management's internal benchmark is ~15% more stores a year; we model ${BL.storeAdds.join(' / ')} openings for FY27-29E (${build[2].stores} stores, ${n1(build[2].area)} mn sq ft by FY29E). New stores in Tier 1-2 towns ramp well; land, not capital or people, is the bottleneck.` },
    { h: 'But each sq ft is earning less', p: `Same-store growth fell from ~10% in FY24 to ~8% in FY26 and ${QS.lflPct}% in Q1FY27. Dense metro stores are full and losing small baskets to Blinkit, Instamart, Zepto, Flipkart Minutes and Amazon Now, whose prices are now within 4-13% of DMart's (Emkay). Our revenue per effective sq ft falls 2.5% in FY27E and grows only 1-1.5% after that.` },
    { h: 'A fixed margin and heavier capital', p: `EBITDA margin stays in its 7.5-8% band by choice; growth below EBITDA is slower as depreciation, lease interest and new borrowings rise (₹965 cr of commercial paper at Mar-26, ~₹2,000 cr expected by Mar-27). DMart Ready lost ₹307 cr in FY26 and has retreated to 11 cities. ROE is ~13%, against 18-20% before Covid.` },
    { h: 'Valuation: fair, not cheap', p: `At ₹${n0(price)} DMart trades at ${n1(price / F.eps[1])}x our FY28E and ${n1(X.sepNow)}x Sep-28E EPS, below its ${n1(HA.med)}x median since 2021 but in line with what the de-rated sector justifies. Listed retailers were ${Math.abs(sectorDr).toFixed(1)}% below their five-year P/E medians on 30-Sep-2026. Our {{dcf.tp|inr}} is close to the post-Q1 street median (₹${n0(medTp)}). A DCF at an 11% cost of capital supports barely a quarter of the price: the stock pays for decades of growth in advance.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'GREEN' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 business update (early October) and results (due by mid-October 2026): store openings in H1 (5 by 28-Jul) against a ~75-store year, and whether like-for-like growth recovers from 5.5%.',
    'Festive season and FMCG price increases: DMart passes inflation straight through, so pricing helps revenue per sq ft in H2.',
    'DMart Ready after the exit from 7 cities: whether the loss (₹75 cr in Q1FY27) narrows in H2FY27.',
    'Quick commerce in Tier 2 towns: Blinkit, Instamart and Zepto expanding into the next 50-100 cities where most new DMart stores open.',
    'Funding: the ₹1,000 cr NCD and commercial paper; borrowings to ~₹2,000 cr by Mar-27.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const AK = X.C.annualKpis, Fy = F.years;
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Stores: 131 in FY17, 500 in FY26, ${build[2].stores} in FY29E on our numbers`, unit: 'Stores at year end', x: [...AK.map(r => r.fy), ...Fy], series: [{ name: 'Stores', values: [...AK.map(r => r.stores), ...build.map(r => r.stores)], fmt: 'num' }], labels: 'all', source: 'Company presentations and AR FY26; GAM estimates FY27-29E' },
      { type: 'column', title: 'FY26 openings were back-ended: 58 of 85 stores in Q4', unit: 'Stores added in the quarter', x: SQ.map(q => q.q), series: [{ name: 'Stores added', values: SQ.map(q => q.storeAdds), fmt: 'num' }], labels: 'all', source: 'HSIE store-addition table (4-Aug-2026); company presentations' },
    ] },
    { pair: [
      { type: 'line', title: 'Like-for-like growth: from double digits to 5.5%', unit: 'LFL growth, stores older than 24 months (%)', x: [...AK.filter(r => r.lflPct != null && r.fy >= 'FY22').map(r => r.fy), 'Q1FY27'], series: [{ name: 'LFL growth', values: [...AK.filter(r => r.lflPct != null && r.fy >= 'FY22').map(r => r.lflPct), QS.lflPct], fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: 'FY26 and Q1FY27 presentations (FY23 reflects the Covid base)' },
      { type: 'column', title: 'Revenue per effective sq ft has stalled since FY24', unit: 'Standalone revenue per average sq ft of retail area (₹)', x: [...SA.filter(r => r.revPerAvgSqft && r.fy >= 'FY22').map(r => r.fy), ...Fy], series: [{ name: 'Revenue per sq ft', values: [...SA.filter(r => r.revPerAvgSqft && r.fy >= 'FY22').map(r => r.revPerAvgSqft), ...build.map(r => Math.round(r.st * 10 / ((r.area - r.adds * BL.sqftPerNewStore + r.area) / 2)))], fmt: 'num' }], labels: 'all', source: 'GAM calculation: standalone revenue ÷ average of opening and closing retail area; FY27-29E from our store build on the same basis' },
    ] },
    { pair: [
      { type: 'line', title: 'Standalone revenue growth has settled at ~15%', unit: 'Standalone revenue growth y/y (%)', x: SQ.slice(4).map(q => q.q), series: [{ name: 'Revenue growth', values: SQ.slice(4).map(q => q.standaloneRevYoY), fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: 'Screener.in (standalone quarterly results)' },
      { type: 'column', title: 'DMart Ready and subsidiaries: growth fell to ~5%, losses widened', unit: 'Consolidated less standalone (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'Revenue', values: SQ.map(q => Math.round(q.subsRev)), fmt: 'num' }, { name: 'EBITDA', values: SQ.map(q => Math.round(q.subsEbitda)), fmt: 'num' }], labels: 'all', source: 'Screener.in standalone and consolidated quarterly data; GAM calculation' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(X.sepNow)}x Sep-28E now vs a ${n1(HA.med)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: X.HS.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.HS.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and reported EPS; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q1 notes)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `MOSL and PL (28-Jul), HSIE (4-Aug), Nuvama, Emkay and Elara (13-Jul-2026); median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.stores, P3.ready, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
