// TMPV report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind,
// competition, JLR, India PV, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street, valuation,
// verdict, glossary, statement notes). Shared inputs in TMPV.ctx.js; forecast and valuation figures are live tokens.
const X = require('./TMPV.ctx');
const { F, V, SQ, QL, n0, n1, pc, price, mv, MULT, jlrSep, pvSep, jlrNow, jlrMed, marMed, rating, postQ1, medTp, own, seg, C, sotpAt } = X;
const P2 = require('./TMPV.part2'), P3 = require('./TMPV.part3'), P4 = require('./TMPV.part4'), P5 = require('./TMPV.part5'), P6 = require('./TMPV.part6');
const Q = C.q1fy27;

const cover = {
  headline: 'The market prices JLR near the bottom of its own post-demerger range: cheap, if the new Range Rovers deliver',
  lead: `Tata Motors Passenger Vehicles is Jaguar Land Rover (81% of revenue) plus India's #2 car maker, after trucks were demerged in Oct-2025. JLR lost FY26 to tariffs, China and a cyber attack (EBIT 0.7%) and made only 2.8% in Q1FY27; India grew volumes 46% but earned a 4.3% EBITDA margin. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, assuming JLR misses its c.4% FY27 guidance but recovers to ~11-12% EBITDA margins as four new models and GBP1.7bn of savings arrive. The street values the stock on a **sum of the parts**; on the house rule we apply **JLR ${MULT.jlr.base}x and India PV ${MULT.pv.base}x Sep-28E EV/EBITDA** plus Tata Technologies at market, less net debt and minority claims: **{{dcf.tp|inr}} ({{dcf.upside|chg}}). We initiate with ${rating}.** Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}: a wide range, because JLR's margin is the whole case.`,
  arguments: [
    { h: 'India: share gains are real, profits are not yet', p: `Wholesales +46% in Q1FY27 (industry +24%), Vahan share ${Q.pv.vahanSharePct}%, ~40% of India's EV market and bookings ~3.5x pre-crisis. But commodities took 4.5% of revenue and price rises only 1%: EBITDA ${Q.pv.ebitdaPct}% incl. PLI. We model ₹${n0(seg('pv').revenue[0])} cr of revenue in FY27E at 5.8%, rising to 7.0% in FY28E before PLI ends.` },
    { h: 'JLR: FY27 is a bridge year; FY28 is the test', p: `FY27 guidance (GBP26bn, c.4% EBIT, FCF breakeven) needs ~4.4% for the rest of the year after Q1's 2.8%; we assume ~3.5%. FY28 brings Range Rover Electric and Sport Electric, Range Rover GT and Jaguar Type 01, ASP "well north of GBP80,000" and the cost programme: we model 11.0% EBITDA, in line with Emkay's 5.7% EBIT.` },
    { h: 'Debt is manageable, but it is JLR\'s', p: 'Net debt ₹42.2K cr at Jun-2026 (JLR GBP3.6bn; India net cash ₹8K cr) after a GBP2.2bn FY26 outflow; liquidity GBP5.9bn. JLR invests GBP3.7bn a year, so EBITDA overstates cash: one reason the market pays only 1-3x for it.' },
    { h: 'Valuation: the price implies ~' + n1(jlrNow) + 'x for JLR', p: `Valuing India PV like Maruti (${n1(marMed)}x forward EV/EBITDA since 2021) and Tata Technologies at market, TMPV's price implied a median ${n1(jlrMed)}x EBITDA for JLR since the demerger and ${n1(jlrNow)}x on 30-Sep-2026. De-rated, ${MULT.jlr.base}x on Sep-28E EBITDA of ₹${n0(jlrSep)} cr gives our target; at the market's current ${n1(jlrNow)}x it would be ₹${n0(sotpAt(jlrNow, MULT.pv.base))}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): JLR margin against the c.4% guidance, Range Rover Electric ramp-up, India margin after another ~3% commodity hit.',
    'JLR detailed cost-programme update promised with the Q2 results; any change to FY27 guidance.',
    'India festive season (Oct-Nov 2026) and PLI certification of the new EVs from Q3FY27.',
    'Stellantis US production agreement (targeted by end-2026); US tariff and China luxury-tax developments.',
    'Range Rover GT and Jaguar Type 01 start of production (early 2027).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'JLR revenue: GBP29bn in FY24-25, GBP22.9bn in FY26, GBP28.8bn by FY29E', unit: 'JLR revenue (GBP m, IFRS)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Revenue', values: [18300, 22800, 29000, 28961, 22911, ...X.AS.jlrBuild.revGbp], fmt: 'num' }], labels: 'all', source: 'JLR Investor Day and results; GAM estimates' },
      { type: 'line', title: 'JLR quarterly EBIT margin: 10.7% to −8.6% to 9.2% to 2.8%', unit: 'Adjusted EBIT margin (%)', x: QL, series: [{ name: 'JLR EBIT', values: SQ.map(q => Math.round(q.jlrEbitGbp / q.jlrRevGbp * 1000) / 10), fmt: 'pct' }], labels: 'all', min: -10, max: 12, source: 'Company presentations' },
    ] },
    { pair: [
      { type: 'column', title: 'India PV volumes: 1.25 lakh to 2 lakh a quarter in a year', unit: 'Wholesales incl. exports', x: QL.slice(2), series: [{ name: 'Units', values: SQ.slice(2).map(q => q.pvUnits), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'line', title: 'But India EBITDA margin swings 4-9%, incl. PLI', unit: 'India PV EBITDA margin (%)', x: QL, series: [{ name: 'India PV', values: SQ.map(q => Math.round(q.pvEbitda / q.pvRev * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 10, source: 'Company presentations' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Our EBITDA by segment: JLR is ~85% of it', unit: 'Company-definition EBITDA (₹ crore)', x: ['FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'JLR', values: [44956, 18321, ...seg('jlr').adjEbitda.map(Math.round)], fmt: 'num' }, { name: 'India PV', values: [3357, 4061, ...seg('pv').adjEbitda.map(Math.round)], fmt: 'num' }, { name: 'Others', values: [810, 529, ...seg('oth').adjEbitda.map(Math.round)], fmt: 'num' }], minLabel: 2500, source: 'Company presentations; GAM estimates' },
      { type: 'column', title: `EPS: near zero in FY26 (ex-gain), ₹${Math.round(F.eps[2])} by FY29E`, unit: 'EPS (₹); FY26 shown ex the demerger gain', x: ['FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'EPS', values: [54.0, -4.4, ...F.eps.map(e => Math.round(e * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'AR FY26 (continuing EPS to owners, FY25 re-presented); GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `JLR multiple implied by the share price: ${n1(jlrNow)}x now vs ${n1(jlrMed)}x median`, unit: 'Implied JLR EV ÷ forward EBITDA (x)', x: own.map(o => o.d), series: [{ name: 'Implied JLR multiple', values: own.map(o => o.jlr), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: Math.round(jlrMed * 10) / 10, text: `Median since the demerger: ${n1(jlrMed)}x` }], source: 'Screener.in prices; company net debt; India PV at Maruti\'s forward median; GAM forward EBITDA' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-2026)', unit: `₹ per share; CMP ₹${n1(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes, 13-14 Aug-2026 (median ₹${n0(medTp)}), GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P2.competition, P3.jlr, P3.pv, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
