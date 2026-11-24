// Indian Hotels report, part 5b: cross-checks, scenarios, DCF, peers (valuation chapter, continued) and risks & honest summary.
const X = require('./INDHOTEL.ctx');
const { F, V, AS, n0, n1, pc, ASOF_TXT, price, sh, mv, hm, pem, hotelSep28, acSep28, HPE, HPErep, FM, peNow, PEERS, drEv, drPe, CORE, sectorDrPe, peAfter, shortName, rating,
  buyBelow, sellAbove, ruleText, Q1, SEG, impliedHotelMult, impliedWacc, HOTEL_MIN_PCT, OHL, ohlSwapValue, mergedOhlEv, WIN, shortDate, HEV, evNow } = X;
const so = mv('sotp'), pe = mv('pe'), dc = mv('dcf');
const pctv = v => `${v >= 0 ? '+' : ''}${Math.round(v)}%`;
const perTurn = (hotelSep28 * (1 - HOTEL_MIN_PCT / 100) + acSep28 * 0.51) / sh;

const blocks = [
  { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
    ['**Sum of the parts (EV/EBITDA)**', '**Target**', 'Sep-28E EBITDA; TajSATS at 51%; less minorities', `${hm.base}x (bull ${hm.bull}x, bear ${hm.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
    ['P/E', 'Cross-check', `Sep-28E EPS ₹${n1(pe.metric)}`, `${pe.mult}x (bull ${pem.bull}x, bear ${pem.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pctv(pe.vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
    ['DCF', 'Cross-check', `15-year FCFF, ${n1(V.ke)}% discount rate, g ${V.terminalGrowth}%`, `implies ${n1(V.intrinsicTp / F.eps[1])}x FY28E EPS`, '{{dcf.blend.methods.2.value|num}}', pctv(dc.vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
    { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs price', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
  ], source: 'GAM Research' } },
  { callout: `**What the cross-checks tell us.** The P/E check uses IHCL's own one-year-forward P/E since ${shortDate(WIN)} on EPS before exceptional items (median ${n1(HPE.med)}x; ${n1(HPErep.med)}x on reported EPS; forwardMedian since Apr-2021 ${n1(FM.median)}x), cut by the ${Math.abs(Math.round(sectorDrPe))}% P/E move of the same peers (${CORE.map(s => `${shortName(s)} ${pc(drPe[s])}`).join(', ')}) = ${n1(peAfter)}x → ${pe.mult}x: ₹${n0(pe.value)}, ${pctv(pe.vsTarget)} vs the target. The DCF (₹${n0(dc.value)}) is the strongest warning: at a ${n1(V.ke)}% cost of equity the cash flows we forecast are worth well below the price; the price needs a ~${n1(impliedWacc)}% discount rate, i.e. investors are paying for growth well beyond our horizon. All three methods put fair value below ₹${n0(price)}.` },
  { exhibit: { type: 'table', title: 'Street basis vs ours', head: ['Item', '₹ per share', 'Why it matters'], wide: [2], rows: [
    ['ICICI Direct\'s 29x on our FY28E EBITDA and net cash (no minority deduction)', n0(X.streetMultOnOurs(29)), 'Our estimates give a street-like value with a street-like multiple: the gap is the multiple.'],
    ['Each 1x on Sep-28E EBITDA (hotels net of minorities + 51% of TajSATS)', `~${n0(perTurn)}`, `So ${n1(hm.base)}x → 29x adds ~₹${n0((29 - hm.base) * perTurn)} a share.`],
    ['Minorities in hotel subsidiaries', `−${n0(X.minPs)}`, `${HOTEL_MIN_PCT}% of hotel EV; brokers deduct ₹15-20 a share at book or market.`],
    ['Oriental Hotels merger (sensitivity)', '', `At 25:117 IHCL issues ~${OHL.newShares} cr shares (~₹${n0(ohlSwapValue)} cr at today's price) and gets 100% of OHL (FY26 EBITDA ₹${OHL.ohlFy26.opEbitda} cr, worth ~₹${n0(mergedOhlEv)} cr at ${hm.base}x) instead of a 35.86% stake; roughly neutral to our target.`],
  ], source: 'Broker notes; OHL merger deck (24-Aug-2026); GAM Research' } },
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Hotel growth +2 pp a year and margin +1 pp; TajSATS growth +3 pp, margin +1 pp; ${hm.bull}x (75th percentile of the own history after the sector move).`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; hotel margin ${n1(SEG.hotel.adjEbitda[0] / SEG.hotel.revenue[0] * 100)}% → ${n1(SEG.hotel.adjEbitda[2] / SEG.hotel.revenue[2] * 100)}%; ${hm.base}x Sep-28E EBITDA.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Hotel growth −3 pp a year and margin −1.5 pp; TajSATS growth −4 pp, margin −1.5 pp; ${hm.bear}x (25th percentile after the sector move).`],
  ], source: 'GAM Research' } },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow (capex incl. new leases)', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Add: model net cash at Mar-27E (after lease liabilities)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
  ], source: `GAM Research; the tax line includes minorities less associates (${AS.taxRate[0]}%); consolidated cash flows` } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: `Listed hotel peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'vs median since Apr-22', 'P/E (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'INDHOTEL' ? '**IHCL**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.evEbitda), pc(drEv[p.symbol]), p.pe > 0 && p.pe < 200 ? n1(p.pe) : 'n.m.', p.roe + '%']), source: `Screener.in (post-Ind AS EBITDA; EV includes lease liabilities), scaled to the NSE close on ${ASOF_TXT}. Peer set for hotel reports: IHCL, EIH, Chalet, Lemon Tree, ITC Hotels.` } },
];

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: buy the franchise, not at this price',
  blocks: [
    { callout: `**What you are buying:** India's strongest hotel brand and its best trophy assets, ~${Q1.standaloneOccupancyPct}% occupancy in the owned Indian hotels, a fee stream compounding at ~20%, a fast-growing midscale arm, ~₹4,400 cr of cash and a Tata parent. Earnings should grow ~13-15% a year.` },
    { callout: `**What you are paying:** ${n1(evNow.gross)}x one-year-forward EV/EBITDA (its own post-Covid median is ${n1(HEV.med)}x) and ${n1(peNow)}x our FY28E EPS, while listed hotel peers trade ~${Math.abs(Math.round(X.sectorDrEv))}% below their own medians. On the street's method with our inputs and the house rule for the multiple, the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The rating rests on the sector adjustment; without it the same SOTP gives roughly ₹${n0(Math.round((V.sotp.equity + (Math.round(HEV.med * 2) / 2 - hm.base) * perTurn * sh) / sh / 10) * 10)} (a HOLD).` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Hotel peers re-rate back towards their medians (travel normalises)', 'Medium', 'EIH and Lemon Tree EV/EBITDA vs ~20-24x medians'],
      ['Like-for-like RevPAR stays at 10%+ (Jefferies case) and fees grow 20%+', 'Medium', 'Q2-Q3 FY27 RevPAR, signings to openings'],
      ['TajSATS returns to double-digit growth at 23%+ margins', 'Medium', 'Q2-Q3 air catering'],
      ['A pull-back', 'n.a.', `Below ~₹${n0(buyBelow)} the rule turns BUY`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['West Asia conflict and airline capacity cuts last into the peak season', 'Medium', 'Inbound, MICE, TajSATS; bear case {{scen.bear.tp|inr}}'],
      ['Supply catches up in Goa, Bengaluru, Delhi (signings +8% in H1 CY26)', 'Medium', 'Rate growth slows to mid-single digits'],
      ['More 51% acquisitions', 'High', 'Revenue up, minority share up, returns diluted'],
      ['Owned greenfields (Bandstand ~450 keys) overrun', 'Low-medium', 'ROCE stays below 20%'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and HOLD between ~₹${n0(buyBelow)} and ~₹${n0(sellAbove)} on today's numbers; a re-rating of the listed hotel peers would lift our multiple mechanically.`,
      `**Biggest swing factor:** the multiple. Each 1x on Sep-28E EBITDA is ~₹${n0(perTurn)} a share; each 1 pp of hotel margin is ~₹${n0(SEG.hotel.revenue[1] / 100)} cr of FY28E EBITDA (~₹${n0(SEG.hotel.revenue[1] / 100 * hm.base / sh)} a share at our multiple).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Standalone occupancy, Q1FY27', v: `${Q1.standaloneOccupancyPct}%`, d: `${Q1.standaloneOccupancyPyPct}% a year earlier` },
      { k: 'Management fees, FY26', v: '₹685 cr', d: '+22%; Q1FY27 +26%' },
      { k: 'Forward EV/EBITDA now', v: `${n1(evNow.gross)}x`, d: `median ${n1(HEV.med)}x since Apr-22` },
      { k: 'Hotel peers vs median', v: `${Math.round(X.sectorDrEv)}%`, d: 'EIH, Lemon Tree' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { blocks, risks };
