// Lemon Tree report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// owned hotels, the fee business, the Fleur scheme, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street,
// valuation, verdict, glossary, statement notes). Shared inputs in LEMONTREE.ctx.js / ctx2.js. Forecast and valuation figures
// are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./LEMONTREE.ctx');
const { C, F, V, n0, n1, pc, Q1, price, mv, hm, HEV, evNow, rating, sectorDrEv, drEv, impliedWacc, impliedHotelMult, fwdEvChart, shortDate, epsCagrFwd, medAll, ST, MIN_PCT } = X;
const P2 = require('./LEMONTREE.part2'), P3 = require('./LEMONTREE.part3'), P4 = require('./LEMONTREE.part4'), P5 = require('./LEMONTREE.part5'), P6 = require('./LEMONTREE.part6');
const PF = C.portfolio, K = C.kpis, f25 = X.ann('FY25'), f26 = X.ann('FY26');
const g = (a, c) => Math.round((a / c - 1) * 100);

const cover = {
  headline: 'India\'s mid-market hotel leader at ~30% below its post-Covid multiple; the margin promise and the Fleur split are the triggers, the debt and the minorities are the catch',
  lead: `Lemon Tree runs ${PF.operational.hotels} hotels (${n0(PF.operational.rooms)} rooms) under Aurika, Lemon Tree, Red Fox and Keys; it owns or leases ${n0(PF.owned.rooms)} rooms (mostly through Fleur Hotels, 41.09% owned by Warburg Pincus) and manages ${n0(PF.managed.rooms)} for others, with ${n0(PF.pipeline.rooms)} more signed. Q1FY27 revenue rose ${g(Q1.revenueOp, Q1.revenueOpPy)}% but room rates only ${g(Q1.arr, Q1.arrPy)}% (the West Asia shock hit corporate travel) and the operating margin fell to 43.4% (GST, stock-appreciation rights). The street values the stock on **EV/EBITDA on FY28E**, adjusted for the Fleur minority (six Buys, median target ₹${n0(medAll)}). Lemon Tree trades at ${n1(evNow.gross)}x one-year-forward EV/EBITDA against a post-Covid median of ${n1(HEV.med)}x; its three usable listed peers (IHCL ${pc(drEv.INDHOTEL)}, EIH ${pc(drEv.EIHOTEL)}, ITC Hotels ${pc(drEv.ITCHOTELS)}) had de-rated by a median ${pc(sectorDrEv)} by ${X.ASOF_TXT}. The house rule gives **${hm.base}x Sep-28E EBITDA**; less minorities (${MIN_PCT}% of equity value) and net debt, the sum of the parts is **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** We forecast EBITDA of ₹${n0(F.ebitda[0])} / ${n0(F.ebitda[1])} / ${n0(F.ebitda[2])} cr and EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} (FY27-29E). Cross-checks are higher (P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}). Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The leader of a supply-short segment', p: `Owned hotels ran at ${K.FY26.occPct}% occupancy in FY26 with ARR of ₹${n0(K.FY26.arr)} (+${g(K.FY26.arr, K.FY25.arr)}%), the best year in the company's history; ${n0(PF.managed.rooms)} managed rooms and a ${n0(PF.pipeline.rooms)}-room signed pipeline make it the largest mid-market platform in India. Third-party fees grew ${g(Q1.fees3p, Q1.fees3pPy)}% in Q1FY27.` },
    { h: 'Margins should recover as renovation ends', p: `Renovation, technology and the GST change cost 5.8% of revenue in FY26; management guides ~3.7% from FY28 and a margin of at least 50% (operating 47.8% in FY26, 43.4% in Q1FY27). We model {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and EPS growth of ~${Math.round(epsCagrFwd)}% a year (FY26-29E, before one-offs) as interest falls.` },
    { h: 'But debt, minorities and a complex split', p: `Net debt incl. leases was ₹1,833 cr at Mar-26 (2.6x EBITDA); Warburg Pincus owns 41.09% of Fleur, and minorities took ${C.minorities.pctOfProfitFy26}% of FY26 profit after tax. The scheme that makes Lemon Tree asset-light and lists Fleur still needs SEBI, NCLT and shareholder approval (management: CY2027), and Fleur plans to spend ₹2,500-3,000 cr on growth.` },
    { h: 'Valuation: the stock fell further than the sector', p: `At ₹${n0(price)} the market pays ~${n1(impliedHotelMult)}x Sep-28E EBITDA on our numbers; our derived multiple is ${hm.base}x. Lemon Tree's own trailing EV/EBITDA sits ${Math.abs(Math.round(drEv.LEMONTREE))}% below its median, against ${Math.abs(Math.round(sectorDrEv))}% for the peers. The DCF needs a ~${n1(impliedWacc)}% discount rate to justify the price, above our 11.3%. The rule stays BUY below ~₹${n0(X.buyBelow)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): management called July "great" and August "solid" and expects double-digit growth from Q2, with ARR back as the driver.',
    'The scheme: SEBI and stock-exchange observations, then the NCLT filing and shareholder and creditor meetings; Fleur listing in CY2027 on management\'s estimate.',
    'Warburg Pincus\'s up to ₹960 cr primary investment in Fleur and the "bunch of announcements" on acquisitions management expects within ~6 months of 10-Aug-2026.',
    'Peak season (Oct-Mar): corporate travel after the West Asia shock, 40+ wedding dates and the MICE calendar; ARR above ₹7,500 cuts the GST cost.',
    'Openings: Aurika Shimla (90 rooms, FY27), ~2,000 managed keys targeted in FY27, Aurika Shillong (H2FY28).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const B = C.portfolio.brandsOwned;
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'hbar', title: 'Five brands from upscale to economy; Aurika earns 2.3x Red Fox per room', unit: 'RevPAR, owned and leased hotels, Q1FY27 (₹; rooms in brackets)', x: B.map(([n, r]) => `${n} (${n0(r)})`), series: [{ name: 'RevPAR', values: [6548, 6095, 4619, 2785, 2885], fmt: 'num' }], labels: 'all', highlight: `Aurika Hotels & Resorts (808)`, source: 'Q1FY27 deck slide 14' },
      { type: 'stacked', title: 'Revenue: owned hotels are ~95%; third-party fees grow fastest', unit: 'Revenue from operations by stream (₹ crore)', x: ['FY25', 'FY26', ...F.years], series: [{ name: 'Owned and leased hotels', values: [f25.owned, f26.owned, ...X.stream.owned.map(Math.round)], fmt: 'num' }, { name: 'Fees from third-party hotels', values: [f25.fees3p, f26.fees3p, ...X.stream.fees.map(Math.round)], fmt: 'num' }], minLabel: 60, source: 'Q4FY26 call (fees); Screener; GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'Room rates rose 8-10% a year until the 2026 shock', unit: 'Average room rate, owned and leased hotels (₹)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'Q1FY26', 'Q1FY27'], series: [{ name: 'ARR', values: [K.FY23.arr, K.FY24.arr, K.FY25.arr, K.FY26.arr, Q1.arrPy, Q1.arr], fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Q1FY27 deck slides 11, 22' },
      { type: 'line', title: 'Margins: 51% in FY23, 48% in FY26, ~50% again by FY28E', unit: 'Operating EBITDA margin (%)', x: ['FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'Margin', values: [51.2, 48.8, 49.3, 47.8, ...F.ebitdaMargin.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', min: 35, max: 60, source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'Signings now run far ahead of openings', unit: 'Managed and franchised rooms (company)', x: ['FY26 opened', 'FY26 signed', 'Q1FY27 opened', 'Q1FY27 signed', 'FY27 opening target'], series: [{ name: 'Rooms', values: [PF.fy26Openings.rooms, PF.fy26Signings.rooms, PF.openedQ1fy27.rooms, PF.signedQ1fy27.rooms, PF.openingsTargetFy27Keys], fmt: 'num' }], labels: 'all', source: 'Q4FY26 and Q1FY27 calls; Q1FY27 deck slides 24-25' },
      { type: 'hbar', title: 'Hotel stocks de-rated in 2026; Lemon Tree the most', unit: `Trailing EV/EBITDA on ${X.ASOF_TXT} vs median since Apr-2022 (ITC Hotels since Apr-2025) (%)`, x: X.PEER_SYMS.map(X.shortName), series: [{ name: 'Move', values: X.PEER_SYMS.map(s => Math.round(drEv[s] * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'Lemon Tree', source: 'Screener.in; GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(HEV.med)}x since Apr-2022, ${n1(evNow.gross)}x now`, unit: 'EV (market value grossed up for minorities, plus net debt incl. leases) ÷ next full-year EBITDA (x)', x: fwdEvChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEvChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: hm.base, text: `Our target: ${hm.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street and our cross-checks', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => `${s.broker} (${shortDate(s.date)})`), 'GAM bull', 'GAM (base)', 'GAM bear'], series: [{ name: 'Value', values: [...ST.map(s => s.tp), X.SC.bull.tp, V.tp, X.SC.bear.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Trendlyne, broker notes and DSIJ (Jun-Aug 2026); GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.hotels, P3.fees, P3.scheme, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
