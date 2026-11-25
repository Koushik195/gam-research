// EIH report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry, tailwind test, hotels,
// flight catering and pipeline, Wildflower Hall, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street,
// valuation, verdict, glossary, statement notes). Shared inputs in EIHOTEL.ctx.js / ctx2.js. Forecast and valuation figures
// are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./EIHOTEL.ctx');
const { C, F, V, n0, n1, pc, Q1, FY26, price, mv, hm, HEV, evNow, rating, sectorDrEv, drEv, impliedWacc, impliedHotelMult, fwdEvChart, axis, shortDate, epsCagrFwd } = X;
const P2 = require('./EIHOTEL.part2'), P3 = require('./EIHOTEL.part3'), P4 = require('./EIHOTEL.part4'), P5 = require('./EIHOTEL.part5'), P6 = require('./EIHOTEL.part6');
const PF = C.portfolio, SA = X.SA, f25 = X.ann('FY25'), f26 = X.ann('FY26');

const cover = {
  headline: 'The best hotels in India at a multiple that looks cheap, until you see the whole sector fell and the next new rooms are three years away',
  lead: `EIH owns and runs the Oberoi and Trident hotels (${n0(PF.keysIndia)} keys in India, ${PF.keysIntl} abroad), flight kitchens and a 36.81% stake in listed EIH Associated Hotels; Reliance (18.8%) and ITC (16.1%) sit beside the Oberoi family (32.9%). Q1FY27 revenue rose ${n1(Q1.revenueGrowthPct)}% and owned-hotel RevPAR ${Math.round((Q1.ownedRevpar / Q1.ownedRevparPy - 1) * 100)}%, but operating EBITDA only ${Math.round((Q1.opEbitda / Q1.opEbitdaPy - 1) * 100)}% (Rajgarh ramp-up, renovations, labour-code wages). Coverage is thin: Axis Capital initiated with Buy at ₹${axis.tp} on ${shortDate(axis.date)}; hotel stocks are valued on **EV/EBITDA**. EIH trades at ${n1(evNow.gross)}x one-year-forward EV/EBITDA, below its post-Covid median of ${n1(HEV.med)}x, but its three usable listed peers (IHCL ${pc(drEv.INDHOTEL)}, ITC Hotels ${pc(drEv.ITCHOTELS)}, Lemon Tree ${pc(drEv.LEMONTREE)}) had de-rated by a median ${pc(sectorDrEv)} by ${X.ASOF_TXT}. The house rule gives **${hm.base}x Sep-28E EBITDA** and a sum of the parts of **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** We forecast EBITDA of ₹${n0(F.ebitda[0])} / ${n0(F.ebitda[1])} / ${n0(F.ebitda[2])} cr and EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} (FY27-29E). Cross-checks are lower (P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}). Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A true luxury franchise', p: `In FY26 Oberoi hotels earned RevPAR of ₹${n0(C.kpis.FY26.oberoiRevpar)} (+${Math.round((C.kpis.FY26.oberoiRevpar / C.kpis.FY26.oberoiRevparPy - 1) * 100)}%), ${n1(C.kpis.FY26.oberoiRevpar / 11549)}x India's luxury-segment average; 14 of 15 benchmarked hotels rank first or second in their markets and owned-hotel occupancy was ${C.kpis.FY26.ownedOccPct}%. No other listed Indian hotel company has this concentration of top-end assets.` },
    { h: 'But growth has stalled and will stay rate-led until FY29', p: `Revenue grew 9% in FY25 and 7% in FY26 with almost no new rooms; the Grand Kolkata (209 keys) and Trident Jaipur are shut for renovation, Wildflower Hall is run on an interim contract, and the 825 owned pipeline keys open mostly in 2028-30. We model revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}} and EPS growth of ~${Math.round(epsCagrFwd)}% a year (FY26-29E, before one-offs).` },
    { h: 'Rich balance sheet, governance to watch', p: `No bank debt, ~₹1,340 cr of net cash after leases, CARE AA+. Against that: a reported family dispute over the promoter holding, the two executive Oberois paid ~₹16 cr each (465-470x the median employee), a royalty to a promoter company, a ₹30 cr political donation in FY26, and exceptional items in five of the last six years.` },
    { h: 'Valuation: cheaper than its history, as is the sector', p: `At ₹${n0(price)} the market pays ~${n1(impliedHotelMult)}x Sep-28E EBITDA once the other parts are valued our way; our derived multiple is ${hm.base}x. Axis's ₹${axis.tp} needs ~${n1(X.streetMultFor(axis.tp))}x, close to EIH's own median with no sector adjustment. The DCF needs a ~${n1(impliedWacc)}% discount rate to justify the price, below our 12.2%. We would buy below ~₹${n0(X.buyBelow)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): renovations end in Q2; management said Q2 business on books was "very positive" and expected foreign guests to stay weak until Q3.',
    'Wildflower Hall: the Himachal government\'s auction for a long-term operator (EIH bid; qualifying bids were due 10-Sep-2026, a live auction follows). Winning on acceptable terms removes a risk; losing removes one of the group\'s best resorts.',
    'Peak season (Oct-Mar): foreign arrivals after the West Asia conflict, BRICS 2026 and Aero India events in Delhi and Bengaluru, Rajgarh\'s first full winter.',
    'Project milestones: Trident Visakhapatnam (associate, 2027), The Oberoi Grand reopening (~Sep-2028), Goa, London, Tirupati, Hebbal; any new owned or managed signings.',
    'The promoter family dispute and any change in Reliance\'s or ITC\'s holdings.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'hbar', title: 'Oberoi and Trident earn far more per room than their segments', unit: 'RevPAR, all domestic hotels incl. managed, FY26 (₹)', x: ['The Oberoi hotels', 'India luxury segment', 'Trident hotels', 'India upper upscale segment'], series: [{ name: 'RevPAR', values: [C.kpis.FY26.oberoiRevpar, 11549, C.kpis.FY26.tridentRevpar, 6996], fmt: 'num' }], labels: 'all', highlight: 'The Oberoi hotels', source: 'Q4FY26 deck slides 6-7 (CoStar)' },
      { type: 'stacked', title: 'Revenue: rooms grow fastest; F&B includes flight catering', unit: 'Revenue from operations by stream (₹ crore)', x: ['FY25', 'FY26', ...F.years], series: [{ name: 'Rooms', values: [f25.room, f26.room, ...X.stream.room.map(Math.round)], fmt: 'num' }, { name: 'Food & beverage (incl. flight catering)', values: [f25.fnb, f26.fnb, ...X.stream.fnb.map(Math.round)], fmt: 'num' }, { name: 'Other services', values: [f25.other, f26.other, ...X.stream.other.map(Math.round)], fmt: 'num' }], minLabel: 300, source: 'AR FY26 note 30; GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'Growth slowed to 7-9% with no new rooms', unit: 'Revenue growth, consolidated (%)', x: ['FY24', 'FY25', 'FY26', 'Q1FY27', ...F.years], series: [{ name: 'Growth', values: [24.4, 9.2, 7.2, Q1.revenueGrowthPct, ...F.salesGrowth.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', source: 'Screener.in; GAM estimates' },
      { type: 'line', title: 'Margins peaked at 37.5% in FY25', unit: 'Operating EBITDA margin (%)', x: ['FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'Margin', values: [29.7, 36.9, 37.5, 34.8, ...F.ebitdaMargin.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', min: 20, max: 45, source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Most new keys come after FY28, and most are managed', unit: 'Pipeline keys by expected year of opening', x: ['2026', '2027', '2028', '2029', '2030', '2031+'], series: [{ name: 'Owned (incl. associate)', values: [0, 150, 111, 124, 440, 0], fmt: 'num' }, { name: 'Managed', values: [60, 14, 144, 508, 1012, 95], fmt: 'num' }], labels: 'all', source: 'Q1FY27 deck slides 22-23 (company years; the AR puts Goa in late 2029)' },
      { type: 'hbar', title: 'Hotel stocks de-rated in 2026; EIH with them', unit: `Trailing EV/EBITDA on ${X.ASOF_TXT} vs median since Apr-2022 (ITC Hotels since Apr-2025) (%)`, x: X.PEER_SYMS.map(X.shortName), series: [{ name: 'Move', values: X.PEER_SYMS.map(s => Math.round(drEv[s] * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'EIH (Oberoi)', source: 'Screener.in; GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(HEV.med)}x since Apr-2022, ${n1(evNow.gross)}x now`, unit: 'EV (market value grossed up for minorities, plus net debt incl. leases) ÷ next full-year EBITDA (x)', x: fwdEvChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEvChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: hm.base, text: `Our target: ${hm.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street and our cross-checks', unit: `₹ per share; CMP ₹${n0(price)}`, x: [`Axis Capital (${shortDate(axis.date)})`, 'GAM bull', 'GAM (base)', 'GAM P/E check', 'GAM DCF check', 'GAM bear'], series: [{ name: 'Value', values: [axis.tp, X.SC.bull.tp, V.tp, Math.round(mv('pe').value), Math.round(mv('dcf').value), X.SC.bear.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Business Upturn (29-Sep-2026); GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.hotels, P3.ofs, P3.wildflower, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
