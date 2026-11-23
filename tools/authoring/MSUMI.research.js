// Motherson Sumi Wiring India report, part B: cover, the story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, greenfields, copper and margins, the JV and related parties, moat, Q1FY27, earnings quality,
// ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in MSUMI.ctx.js;
// forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./MSUMI.ctx');
const { F, V, SQ, QL, C, n0, n1, n2, price, mv, FM, sectorDr, MULT, epsSep, rating, postQ1, medTp, medEps, feesPct, rpPurchPct, cust1 } = X;
const P2 = require('./MSUMI.part2'), P3 = require('./MSUMI.part3'), P4 = require('./MSUMI.part4'), P5 = require('./MSUMI.part5'), P6 = require('./MSUMI.part6');
const sd = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}`; };

const cover = {
  headline: 'India\'s wiring-harness leader on a trough multiple: the margin squeeze is mostly timing, the JV toll is permanent',
  lead: `Motherson Sumi Wiring India (MSWIL) assembles the wiring harnesses in most Indian cars; it is a joint venture of Samvardhana Motherson (33.4%) and Sumitomo Wiring Systems (25.1%), and one customer (Maruti Suzuki, per Emkay) buys ${Math.round(cust1)}% of its output. Revenue grew 23% in FY26 and 37% in Q1FY27, but the EBITDA margin fell to 7.6% as copper ran ahead of price resets, NCR minimum wages jumped 35-40% and new plants ramped up; profit was flat. We forecast EPS of ₹${n2(F.eps[0])} / ₹${n2(F.eps[1])} / ₹${n2(F.eps[2])} for FY27-29E, below the street. The street values MSWIL on **P/E on one-year-forward EPS** (MOSL 35x and JM 33x FY28E, Emkay 30x Jun-28E). The house rule (its own forward P/E median since listing, ${n1(FM.median)}x, cut by the ${Math.abs(sectorDr).toFixed(1)}% auto-component de-rating) gives **${MULT.base}x Sep-28E EPS of ₹${n2(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}, below the price. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Growth is real and well ahead of car production', p: `Revenue rose 23% in FY26 against passenger-vehicle production growth of 9.4%, and 37% in Q1FY27 (30% without copper) against industry volumes of +17%. The drivers are content (more features, SUVs, EV and hybrid programmes at 8.5% of revenue and 1.5-1.7x the harness value of a petrol car) and three new plants that already sell ~₹450 cr a quarter. We model revenue +{{as.revenueGrowth.0|pct0}} / +{{as.revenueGrowth.1|pct0}} / +{{as.revenueGrowth.2|pct0}}.` },
    { h: 'Two of the three margin hits are temporary; the third is a negotiation', p: `Copper is passed on at cost with a 3-6 month lag (the CFO put the Q4FY26 hit at 2-2.5 points of margin), and the greenfields, which lost ₹127 cr in FY26, were at breakeven excluding that lag by Q4FY26. The NCR wage increase is a real cost that customers must agree to share; there is no timeline. Copper also inflates revenue for ever, so the old 12-13% margin will not come back at today's copper price. We assume {{as.ebitdaMargin.0|pct}} / {{as.ebitdaMargin.1|pct}} / {{as.ebitdaMargin.2|pct}}, below every broker.` },
    { h: 'The JV toll: minority holders get the assembly margin', p: `About ${Math.round(rpPurchPct)}% of raw-material purchases come from SAMIL and Sumitomo, which also take a royalty, an equal management fee and support fees: ${n1(feesPct)}% of revenue and a quarter of EBITDA in FY26. Hyundai and Kia are served by a different SAMIL JV. Returns are still ~40% ROCE because the business needs little capital, but growth in the value chain accrues partly outside MSWIL.` },
    { h: 'Valuation: the price assumes the squeeze is permanent', p: `At ₹${n2(price)} the stock trades at ${n1(X.fwdNow)}x our FY28E and ${n1(X.sepNow)}x Sep-28E EPS, against a ${n1(FM.median)}x forward median since listing; its trailing P/E sits 27% below its median since listing while auto-component peers sit ${Math.abs(sectorDr).toFixed(1)}% below theirs. Our ${MULT.base}x is above the street's 30-35x because the house rule anchors on MSWIL's own history; at the street's 35x our EPS still gives ₹${n0(35 * epsSep.base)}. The DCF (₹${n0(mv('dcf').value)}) does not support the price: the case rests on the multiple.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether the Q1 copper increase and part of the NCR wage increase have been recovered from customers, and the greenfields\' first profit.',
    'Shorter copper resets: management is asking customers for monthly (or even 15-day) price resets instead of 3-6 months; any agreement removes most of the timing squeeze.',
    'New expansion plans "in the next few quarters" (COO, Aug-2026): new plants backed by firm orders, e.g. for customers\' new car plants.',
    'Festive-season car production (Oct-Dec 2026) against the GST-cut base; EV and hybrid launches by MSWIL\'s customers.',
    'Pune and Chennai greenfields: a new customer or the delayed model launch would lift utilisation from ~50%.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yoyQ = X.M.quarterly.sales.map((s, i, a) => (i >= 4 ? Math.round((s / a[i - 4] - 1) * 1000) / 10 : null)).slice(-8);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹11,478 cr in FY26; ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Growth accelerated six quarters in a row, to 37% in Q1FY27', unit: 'Revenue growth year on year (%)', x: X.M.quarterly.labels.slice(-8), series: [{ name: 'Revenue growth', values: yoyQ, fmt: 'pct' }], labels: 'all', source: 'Quarterly results as reported (Screener.in)' },
    ] },
    { pair: [
      { type: 'stacked', title: 'New plants: ₹5 cr in Q1FY25, ~₹450 cr a quarter now', unit: 'Revenue (₹ crore)', x: QL, series: [{ name: 'Existing plants', values: SQ.map(q => q.existing), fmt: 'num' }, { name: 'Greenfields', values: SQ.map(q => q.greenfield), fmt: 'num' }], minLabel: 300, source: 'Company decks; Emkay Exhibit 4 (Q1FY27 greenfield split is an Emkay estimate)' },
      { type: 'line', title: 'Even the old plants slipped from 12-13% to ~9-10%', unit: 'EBITDA margin (%)', x: QL, series: [{ name: 'Existing plants', values: SQ.map(q => Math.round(q.existingEbitda / q.existing * 1000) / 10), fmt: 'pct' }, { name: 'Reported', values: SQ.map(q => Math.round(q.ebitda / q.revenue * 1000) / 10), fmt: 'pct' }], labels: 'last', min: 6, max: 14, source: 'Company decks; Emkay Exhibit 4; GAM (Q1FY27 existing plants = reported EBITDA plus Emkay\'s greenfield-loss estimate)' },
    ] },
    { pair: [
      { type: 'line', title: 'Copper: ₹883/kg in Q1FY26, ₹1,348/kg in Q1FY27 (+53%)', unit: 'Average copper price (₹ per kg)', x: C.copperQuarterly.labels, series: [{ name: 'Copper', values: C.copperQuarterly.inrKg, fmt: 'num' }], labels: 'all', source: 'Company decks; Emkay Exhibit 6' },
      { type: 'line', title: `EBITDA margin: 13% in FY22, 9.2% in FY26; ${n1(F.ebitdaMargin[2])}% in FY29E`, unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 6, max: 14, source: 'Screener.in; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(X.fwdNow)}x FY28E now vs a ${n1(FM.median)}x median since listing`, unit: 'Price ÷ next full-year EPS (x)', x: X.allWk.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.allWk.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices and EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q1 notes)', unit: `₹ per share; CMP ₹${n2(price)}`, x: [...postQ1.map(s => `${s.broker} (${sd(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `MOSL (4-Aug-2026), Choice, Emkay and ICICI Securities (5-Aug-2026); median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.greenfields, P3.margins, P3.jv, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
