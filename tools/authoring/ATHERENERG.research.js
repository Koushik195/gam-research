// Ather Energy report, part B: cover, the story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, competition, volumes & capacity, unit economics, moat, Q1FY27, earnings quality,
// ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in
// ATHERENERG.ctx.js; forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./ATHERENERG.ctx');
const { F, V, SA, SQ, QL, n0, n1, price, mv, EVS, MULT, sector12, rating, medTp, medStreetMult, ST, evNow, evSep, salesSep, C } = X;
const P2 = require('./ATHERENERG.part2'), P3 = require('./ATHERENERG.part3'), P4 = require('./ATHERENERG.part4'), P5 = require('./ATHERENERG.part5'), P6 = require('./ATHERENERG.part6');
const QK = C.quarterlyKpis.filter(q => q.marketSharePct != null);

const cover = {
  headline: 'The best e-scooter brand in India, priced as if it had already won',
  lead: `Ather Energy makes premium electric scooters (450, Rizta and, from Sep-2026, the cheaper Konarc) at Hosur and, from early 2027, at a new 5-lakh-a-year plant at AURIC near Aurangabad. It sold ${n0(X.A26.units)} scooters in FY26 (+69%) for ₹${n0(X.A26.revenue)} cr and lost ₹517 cr; in Q1FY27 it reached EBITDA breakeven on its own definition. Demand is running ahead of supply (1.5 lakh pre-orders in Q1, dealer stock 3 days), but its market share slipped to 16-17% as TVS and Bajaj grew faster. The street values the stock on **EV/Sales (5.5-7x Sep-28E or FY29E)**, with no Sell among the eight houses we track (median target ₹${n0(medTp)}). We forecast revenue of ₹${n0(F.sales[0])} / ${n0(F.sales[1])} / ${n0(F.sales[2])} cr for FY27-29E. Applying the house rule, **${MULT.base}x Sep-28E revenue of ₹${n0(salesSep.base)} cr** (the stock's own 12-month forward median of ${n1(EVS.med)}x, less the auto sector's ${Math.abs(sector12).toFixed(1)}% move) plus net cash gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks are lower: DCF ₹${n0(mv('dcf').value)}, EV/EBITDA on FY29E ₹${n0(mv('ev').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Growth is real and capacity-bound', p: `Wholesale volumes rose 81% in Q1FY27 to 83,173; registrations +102%. Hosur tops out at ~35,000 a month; AURIC Phase 1 adds 42,000 a month from January 2027 (4-5 month ramp). We model {{F.volume.0|num}} / {{F.volume.1|num}} / {{F.volume.2|num}} scooters in FY27-29E, about 3.3x FY26 by FY29E.` },
    { h: 'The margin turn has started, but from a low base', p: 'EBITDA margin (before other income) improved from −26% in FY25 to −11% in FY26 and −2.7% in Q1FY27 on operating leverage and price rises, despite a 5.6pp commodity hit to gross margin. Konarc lowers revenue per scooter (from ₹99,999) and AURIC adds fixed costs from Q4. We model {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}.' },
    { h: 'No moat against TVS, Bajaj and Hero yet', p: 'Ather\'s brand, software (94% buy the AtherStack Pro pack) and charging network are real advantages, and its prices are the highest in the segment. But incumbents fund their e-scooters from profitable petrol-bike businesses, and Ather\'s share fell from 18.6% (Q4FY26) to 15.9% in Aug-2026 while it waited for capacity. Hero MotoCorp, its 30% shareholder, competes with Vida.' },
    { h: 'Valuation: the price assumes the bull case', p: `At ₹${n0(price)} Ather trades on ${n1(evNow)}x our FY28E and ${n1(evSep)}x Sep-28E revenue, against a 12-month forward median of ${n1(EVS.med)}x; the multiple more than doubled from ~3x in April to 6.6x in September 2026. P/E cannot be used: FY27E is a loss and FY28E EPS (₹${n1(F.eps[1])}) gives a meaningless ~${Math.round(price / F.eps[1])}x. The street's ₹1,398-2,200 targets rest on 5.5-7x multiples (median ${medStreetMult}x) that the stock held only in its last two months.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Governance (Hero as shareholder and rival)', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): first full quarter at Hosur\'s capacity and of June\'s price rises; whether EBITDA stays positive.',
    'AURIC Phase 1: trial output in the festive season, reliable output from January 2027, 42,000 a month by end-Q4FY27 or early FY28.',
    'Konarc deliveries (phased from mid-Sep-2026; entry variant from Q1 2027) and its effect on Rizta, revenue per scooter and AtherStack Pro attach (guided 75%+).',
    'Monthly Vahan registrations: does Ather regain share once supply improves, or do TVS, Bajaj and Hero keep gaining?',
    'AURIC Phase 2 decision (management: firmer timelines "in a quarter or two"); commodity prices (lithium, copper, aluminium); state EV policies (Delhi, Haryana).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Quarterly volumes: 23k in Q1FY25, 83k in Q1FY27', unit: 'Scooters sold (wholesale)', x: QL, series: [{ name: 'Units', values: SQ.map(q => q.units), fmt: 'num' }], labels: 'all', source: 'Investor presentations' },
      { type: 'line', title: 'Market share: 18.8% peak in Q3FY26, then capacity bit', unit: 'Ather share of e-2W registrations (%)', x: QK.map(q => q.q), series: [{ name: 'Market share', values: QK.map(q => q.marketSharePct), fmt: 'pct' }], labels: 'all', min: 8, max: 22, source: 'Company (Vahan + Telangana portal)' },
    ] },
    { pair: [
      { type: 'line', title: 'Quarterly EBITDA margin: −36% to −2.7% in eight quarters', unit: 'EBITDA margin before other income (%)', x: QL, series: [{ name: 'EBITDA margin', values: SQ.map(q => q.marginPct), fmt: 'pct' }], labels: 'all', lines: [{ v: 0, text: 'Breakeven', color: '#b4232a' }], source: 'Screener.in (Q3FY26 derived); GAM Research' },
      { type: 'column', title: 'Gross margin without subsidy: 12% in FY25, 21% in FY26', unit: 'Adjusted gross margin (% of total income)', x: SA.map(a => a.fy), series: [{ name: 'With subsidy', values: C.annualKpis.map(a => a.agmPct), fmt: 'pct0' }, { name: 'Without subsidy', values: C.annualKpis.map(a => a.agmExIncentivePct), fmt: 'pct0' }], labels: 'all', source: 'AR FY26 MD&A; Q4FY26 presentation' },
    ] },
    { pair: [
      { type: 'column', title: `Volumes: 2.6 lakh in FY26, ${n1(F.volume[2] / 1e5)} lakh by FY29E`, unit: 'Scooters sold', x: 'fin.labels', from: 'FY24', to: 'FY29E', series: [{ name: 'Volume', ref: 'kpi.units', fmt: 'num' }], labels: 'all', source: 'Company; GAM estimates FY27-29E' },
      { type: 'column', title: `Revenue: ₹${n0(Math.round(F.sales[2] / 100) * 100)} cr by FY29E, ${n1(F.sales[2] / X.A26.revenue)}x FY26`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/Sales: ${n1(evNow)}x now vs ${n1(EVS.med)}x 12-month median`, unit: 'EV ÷ next full-year revenue (x)', x: X.evs.map(x => x[0]), series: [{ name: 'Forward EV/Sales', values: X.evs.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; GAM estimates of FY27-28E revenue; shares and net cash step up with the Jul/Aug-2026 raise' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes, 4-Aug to 10-Sep-2026 (median ₹${n0(medTp)}), GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P2.competition, P3.volumes, P3.economics, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
