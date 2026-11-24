// Indian Hotels report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// hotels, fees and growth brands, TajSATS, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street, valuation,
// verdict, glossary, statement notes). Shared inputs in INDHOTEL.ctx.js / ctx2.js. Forecast and valuation figures are live
// tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./INDHOTEL.ctx');
const { C, F, V, A, n0, n1, pc, Q1, FY26, b, price, mv, hm, hotelSep28, HEV, evNow, rating, ST, sectorDrEv, drEv, avgPost, impliedWacc, impliedHotelMult, fwdEvChart, shortDate, epsCagrFwd } = X;
const P2 = require('./INDHOTEL.part2'), P3 = require('./INDHOTEL.part3'), P4 = require('./INDHOTEL.part4'), P5 = require('./INDHOTEL.part5'), P6 = require('./INDHOTEL.part6');
const PF = C.portfolio.jun26, HS = C.hotelRevenueStreams;

const cover = {
  headline: 'India\'s best hotel franchise, priced as if the 2026 hotel-stock sell-off never happened',
  lead: `IHCL owns or runs 382 hotels (33,609 keys) under Taj, Vivanta, Gateway, SeleQtions and Ginger, plus 51% of airline caterer TajSATS, and has another ~32,600 keys signed, 81% of them managed for a fee. Q1FY27 revenue rose ${n0(Q1.revenueGrowthPct)}% and management fees ${Q1.mgmtFeesGrowthPct}%; the company guides 12-14% growth for FY27. The street values IHCL on **EV/EBITDA on FY28E (23-30x)** and is almost all Buy (post-Q1 targets average ₹${n0(avgPost)}). We forecast EBITDA of ₹${n0(F.ebitda[0])} / ${n0(F.ebitda[1])} / ${n0(F.ebitda[2])} cr and EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} (FY27-29E), close to the street. The difference is the multiple. Listed hotel peers had de-rated ~${Math.abs(Math.round(sectorDrEv))}% against their own medians by ${X.ASOF_TXT} (EIH ${pc(drEv.EIHOTEL)}, Lemon Tree ${pc(drEv.LEMONTREE)}); IHCL had not (it sat at ${n1(evNow.gross)}x one-year-forward EV/EBITDA, at its post-Covid median of ${n1(HEV.med)}x). Applying the house rule gives **${hm.base}x Sep-28E EBITDA** and a sum of the parts of **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks agree: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A real moat at the top end', p: `Taj is India's strongest brand five years running (Brand Finance); IHCL owns irreplaceable city and palace hotels and is the largest operator in the country. Standalone occupancy was ${Q1.standaloneOccupancyPct}% in Q1FY27 and hotel operating margins ~34% for FY26. Management fees (₹${n0(C.mgmtFeeHistory.FY26)} cr in FY26, +22%) are ~${n1(X.feeShare[0])}% of hotel revenue and almost all profit.` },
    { h: 'Growth is good but partly bought', p: `Of the 12-14% FY27 guide, 4-5 points come from new hotels and acquisitions (ANK/Pride, Atmantan, Brij, ₹250 cr+ of revenue); like-for-like growth is 7-9%, mostly rate. TajSATS (51%) grew 3% in Q1 and earns ~20-24% margins. We model revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}} and EPS growth of ~${Math.round(epsCagrFwd)}% a year (FY26-29E, before one-offs).` },
    { h: 'Rich balance sheet, shrinking share of the profit', p: `Net cash ~₹4,300 cr before leases (AAA). But minorities took ~7% of profit in FY26 and ~8% in Q1FY27 (TajSATS 49%, PIEM, Benares, and 49% of every 2025-26 acquisition), and exceptional items appear every year. ROCE is 17.4% against a 20%+ target.` },
    { h: 'Valuation: the sector re-priced, IHCL did not', p: `At ₹${n0(price)} the market pays ~${n1(impliedHotelMult)}x Sep-28E hotel EBITDA once the other parts are valued our way; our derived multiple is ${hm.base}x. The DCF says the same thing from another angle: today's price needs a ~${n1(impliedWacc)}% discount rate against our 12.2% cost of equity. We would buy below ~₹${n0(X.buyBelow)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): management expected Q2 growth to match or beat Q1\'s 14.6%; watch like-for-like RevPAR, the TajSATS recovery and the Frankfurt ramp-up.',
    'The West Asia conflict and airline capacity: inbound, MICE and international hotels (Dubai, London, The Pierre) and TajSATS volumes.',
    'The Oriental Hotels merger (25 IHCL shares for 117 OHL shares; ~2.32 cr new shares, ~1.6% dilution): approvals through FY27, completion targeted in H2FY28.',
    'Peak season (Oct-Mar): weddings (40+ auspicious dates in the rest of FY27), BRICS 2026, Aero India and Vibrant Gujarat events.',
    'Further deals: management says M&A is "an ongoing exercise"; each 51% deal adds revenue but also minorities.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Two-thirds of future keys belong to someone else', unit: 'Keys at 30-Jun-2026', x: ['Operating', 'Pipeline'], series: [{ name: 'Owned / leased', values: [PF.ownedLeasedKeys, PF.pipelineOwnedKeys], fmt: 'num' }, { name: 'JV / associate', values: [PF.jvAssocKeys, 0], fmt: 'num' }, { name: 'Managed / franchised', values: [PF.managedKeys, PF.pipelineManagedKeys], fmt: 'num' }], labels: 'all', source: 'Q1FY27 deck slides 34-35' },
      { type: 'stacked', title: 'Hotel revenue: rooms grow fastest, fees steadily', unit: 'Hotel segment operating revenue (₹ crore)', x: ['FY24', 'FY25', 'FY26'], series: [{ name: 'Rooms', values: [HS.FY24.room, HS.FY25.room, HS.FY26.room], fmt: 'num' }, { name: 'Food & beverage', values: [HS.FY24.fnb, HS.FY25.fnb, HS.FY26.fnb], fmt: 'num' }, { name: 'Other operating', values: [HS.FY24.other, HS.FY25.other, HS.FY26.other], fmt: 'num' }, { name: 'Management fees', values: [HS.FY24.fees, HS.FY25.fees, HS.FY26.fees], fmt: 'num' }], minLabel: 400, source: 'FY25 and FY26 decks (FY24 derived from FY25 growth rates)' },
    ] },
    { pair: [
      { type: 'column', title: 'Management fees: ₹177 cr (FY17) to ₹685 cr (FY26)', unit: 'Management fees, consolidated (₹ crore); FY27E-29E GAM', x: ['FY17', 'FY20', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Fees', values: [177, 212, 399, 497, 562, 685, ...X.stream.fees.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Q4FY26 deck slide 37; GAM estimates' },
      { type: 'line', title: 'Hotels earn ~34%; TajSATS ~20-24%', unit: 'Operating EBITDA margin by segment (%)', x: ['FY25', 'FY26', 'Q1FY26', 'Q1FY27', ...F.years], series: [{ name: 'Hotels', values: [34.0, 34.3, 29.0, 30.1, ...F.years.map((_, i) => Math.round(X.SEG.hotel.adjEbitda[i] / X.SEG.hotel.revenue[i] * 1000) / 10)], fmt: 'pct' }, { name: 'Air catering (TajSATS)', values: [24.7, 23.7, 23.0, 19.5, ...F.years.map((_, i) => Math.round(X.SEG.ac.adjEbitda[i] / X.SEG.ac.revenue[i] * 1000) / 10)], fmt: 'pct' }], labels: 'all', min: 0, max: 45, source: 'Company decks (TajSATS from Aug-2024); GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'Exceptional gains flatter reported profit in FY25-26', unit: 'Profit attributable to owners (₹ crore)', x: ['FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Before exceptional items', values: [956, 1242, C.fy25.patBei, FY26.patBei], fmt: 'num' }, { name: 'Reported', values: [1003, 1259, 1908, 2084], fmt: 'num' }], labels: 'all', source: 'Company decks (FY25-26); Screener exceptional items after tax (FY23-24)' },
      { type: 'hbar', title: `Hotel stocks de-rated in 2026; IHCL much less`, unit: `Trailing EV/EBITDA on ${X.ASOF_TXT} vs median since Apr-2022 (%)`, x: X.PEER_SYMS.map(X.shortName), series: [{ name: 'Move', values: X.PEER_SYMS.map(s => Math.round(drEv[s] * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'IHCL', source: 'Screener.in; GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(HEV.med)}x since Apr-2022, ${n1(evNow.gross)}x now`, unit: 'EV (market value grossed up for minorities, plus net debt incl. leases) ÷ next full-year EBITDA (x)', x: fwdEvChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEvChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: hm.base, text: `Our target: ${hm.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => `${s.broker} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes, roundups and aggregators (May-Sep 2026)' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.hotels, P3.fees, P3.tajsats, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
