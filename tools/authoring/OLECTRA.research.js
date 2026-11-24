// Olectra Greentech report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, mobility, energy, the Evey model, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street,
// valuation, verdict, glossary, statement notes). Shared inputs in OLECTRA.ctx.js; forecast and valuation figures are live
// tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./OLECTRA.ctx');
X.assertBuild(); X.assertOi();
const { F, A, SA, SQ, n0, n1, price, mv, FM, sectorDr, MULT, epsSep, rating, sepNow, trailPe, SENS, bld, medTp } = X;
const P2 = require('./OLECTRA.part2'), P3 = require('./OLECTRA.part3'), P4 = require('./OLECTRA.part4'), P5 = require('./OLECTRA.part5'), P6 = require('./OLECTRA.part6');
const E = epsSep.base, r1 = v => Math.round(v * 10) / 10, r10 = v => Math.round(v / 10) * 10;
const fy = SA.map(a => a.fy), fyU = SA.filter(a => a.units).map(a => a.fy);
const RP = [['FY25', 1420.2, 1801.9, 589.3, 697.7], ['FY26', 1725.8, 2312.2, 717.9, 993.1]]; // related-party sales and receivables (AR FY26 note 33, note 11)

const cover = {
  headline: 'India\'s first e-bus maker sells three-quarters of its output to its parent\'s operator: the house multiple says BUY, the cash flows say be careful',
  lead: `Olectra Greentech makes electric buses (86% of FY26 revenue) and composite insulators (14%). Its parent, the MEIL group, also owns Evey Trans, which wins state gross-cost contracts and buys the buses: 75% of FY26 revenue and 72% of receivables were with related parties. Revenue grew 8x in five years to ₹2,312 cr and EPS reached ₹21.62, but FY26 profit growth came from insulators, and Q1FY27 revenue +66% brought no profit growth as interest doubled. We forecast ${n0(bld[0].units)} / ${n0(bld[1].units)} / ${n0(bld[2].units)} vehicles (guidance 2,000-2,500 for FY27) and EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E. The market and the one broker with a record of calls value Olectra on P/E: the stock's ${n1(FM.median)}x forward-P/E median since Apr-2021, cut by the ${Math.abs(sectorDr).toFixed(1)}% auto-OEM de-rating, gives **${MULT.base}x Sep-28E EPS of ₹${n1(E)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating} under our rule.** Every window we tested gives a BUY (12-month window ${SENS.r12}x ≈ ₹${n0(r10(SENS.r12 * E))}), because the stock now trades at ${n1(sepNow)}x. The cross-checks split: EV/EBITDA ₹${n0(mv('ev').value)}, DCF only ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Demand is real and Olectra has a seat at the table', p: 'Domestic e-bus sales were ~5,400 in FY26 (+30%), ~46,000 buses are awarded for the next 2-3 years and over 10,000 more tenders are expected in 12 months. Olectra sold 1,280 vehicles (~24% share), has an order book of over 8,000 buses (MSRTC ~4,000, BEST ~2,000, TGSRTC 1,085, BMTC 700) and a new plant able to build 5,000 a year.' },
    { h: 'The customer is the family', p: 'Evey Trans, a subsidiary of Olectra\'s own parent, bids for the contracts and buys the buses. Prices are set by "comparable market benchmarking" and were "jointly worked out" with Evey before bidding. Olectra\'s cash depends on Evey\'s SPVs drawing project loans and on states paying them; ₹718 cr of its ₹993 cr of receivables were owed by related parties at Mar-26.' },
    { h: 'Execution, not demand, is the swing factor', p: `Olectra guided ~2,000 vehicles for FY26 and delivered 1,280; MSRTC threatened to cancel its 5,150-bus order in May-2025 and had ~1,200 by Apr-2026. FY27 guidance slipped from 2,500 to 2,000-2,500 between June and August. We assume ${n0(bld[0].units)} and a Mobility EBIT margin of ${X.BL.mobMargin[0]}%, below FY25-26.` },
    { h: 'Cheap against its own past, expensive against its cash', p: `At ₹${n0(price)} Olectra trades at ${n1(sepNow)}x our Sep-28E EPS and ${n1(trailPe)}x trailing, against a ${n1(FM.median)}x forward-P/E median since Apr-2021 and −44% from its Feb-2024 peak. The house rule gives ${MULT.base}x and a ${rating}; a DCF that holds working capital at ~30% of revenue says ₹${n0(mv('dcf').value)}. The target assumes the market keeps paying a growth multiple for a bus maker whose cash flow is negative.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Balance sheet', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): deliveries against the ~500 management expects for the quarter, the half-year balance sheet and receivables.',
    'MSRTC deliveries against the extended Dec-2026 deadline, and signing of the 700-bus BMTC (Bengaluru) contract that was pending in June.',
    'New bus platform (Q3FY27) and the e-truck launch (Q4FY27, 28-55 tonnes; MEIL as the first customer).',
    'Award of the 10,000+ e-bus tenders the company expects in the 12 months from Jun-2026 (PM E-DRIVE, PM e-Bus Sewa).',
    'Insulator margins: back towards FY26\'s 34.5% or down to Q1FY27\'s 22%.',
  ],
};

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹281 cr (FY21) to ₹2,312 cr (FY26), ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: `Vehicles sold: 259 (FY22) to 1,280 (FY26); ${n0(bld[0].units)} in our FY27E`, unit: 'Electric vehicles sold', x: [...fyU, 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Vehicles', values: [...SA.filter(a => a.units).map(a => a.units), ...bld.map(r => r.units)], fmt: 'num' }], labels: 'all', source: 'Company presentations (FY22-26); GAM estimates. FY27 guidance: 2,000-2,500.' },
    ] },
    { pair: [
      { type: 'line', title: 'Segment EBIT margin: insulators 34.5%, buses 9.8% (FY26)', unit: 'Segment EBIT margin (%)', x: fy, series: [{ name: 'Mobility (e-buses)', values: SA.map(a => r1(a.mobEbit / a.mobRev * 100)), fmt: 'pct' }, { name: 'Energy (insulators)', values: SA.map(a => r1(a.enEbit / a.enRev * 100)), fmt: 'pct' }], labels: 'last', min: 0, max: 40, source: 'Annual reports FY21, FY23, FY25, FY26 (segment result before interest and tax)' },
      { type: 'column', title: 'Insulators: 14% of FY26 revenue, 37% of segment EBIT', unit: 'Segment EBIT (₹ crore)', x: fy, series: [{ name: 'Mobility', values: SA.map(a => Math.round(a.mobEbit)), fmt: 'num' }, { name: 'Energy', values: SA.map(a => Math.round(a.enEbit)), fmt: 'num' }], labels: 'none', source: 'Annual reports (segment notes)' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Related parties: 75% of FY26 revenue, 72% of receivables', unit: '% of total', x: ['Share of revenue', 'Share of trade receivables'], series: RP.map(([f, s, rev, rcv, rt]) => ({ name: f, values: [r1(s / rev * 100), r1(rcv / rt * 100)], fmt: 'pct' })), labels: 'all', source: 'AR FY26 notes 11 and 33 (sales to associates, MEIL and MEIL group companies; gross receivables)' },
      { type: 'column', title: 'Trade receivables: ₹513 cr (FY24) to ₹987 cr (FY26)', unit: 'Trade receivables (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Receivables', ref: 'A.receivables', fmt: 'num' }], labels: 'all', source: 'Screener.in' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${Math.round(sepNow)}x Sep-28E vs a ${Math.round(FM.median)}x median since Apr-2021`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdWeekly.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.fwdWeekly.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median ${n1(FM.median)}x; our multiple ${MULT.base}x` }], source: 'Screener.in weekly prices; reported EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} against the cross-checks', unit: `₹ per share; CMP ₹${n0(price)}`, x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'P/E, 12-month window', 'Street (Uniresearch)', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), r10(SENS.r12 * E), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research; Uniresearch (2-Jul-2026, method not disclosed)' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.mobility, P3.evey, P3.energy, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
