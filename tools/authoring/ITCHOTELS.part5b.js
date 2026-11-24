// ITC Hotels report, part 5b: cross-checks, scenarios, DCF, peers (valuation chapter, continued) and risks & honest summary.
const X = require('./ITCHOTELS.ctx');
const { F, V, AS, n0, n1, pc, ASOF_TXT, price, sh, mv, hm, pem, hotelSep28, HPE, FM, peNow, PEERS, drEv, drPe, CORE, sectorDrPe, peAfter, shortName, rating,
  buyBelow, sellAbove, ruleText, Q1, SEG, impliedHotelMult, impliedWacc, WIN, shortDate, HEV, evNow, perTurn, tpAt, INV } = X;
const so = mv('sotp'), pe = mv('pe'), dc = mv('dcf');
const pctv = v => `${v >= 0 ? '+' : ''}${Math.round(v)}%`;
const mgn = i => n1(SEG.hotel.adjEbitda[i] / SEG.hotel.revenue[i] * 100);

const blocks = [
  { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
    ['**Sum of the parts (EV/EBITDA)**', '**Target**', 'Sep-28E hotel EBITDA; apartments at 80% of book; net cash', `${hm.base}x (bull ${hm.bull}x, bear ${hm.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
    ['P/E', 'Cross-check', `Sep-28E EPS ₹${pe.metric.toFixed(2)}`, `${pe.mult}x (bull ${pem.bull}x, bear ${pem.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pctv(pe.vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
    ['DCF', 'Cross-check', `15-year FCFF, ${n1(V.ke)}% discount rate, g ${V.terminalGrowth}%`, `implies ${n1(V.intrinsicTp / F.eps[1])}x FY28E EPS`, '{{dcf.blend.methods.2.value|num}}', pctv(dc.vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
    { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs price', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
  ], source: 'GAM Research' } },
  { callout: `**What the cross-checks tell us.** The P/E check uses ITC Hotels' own one-year-forward P/E since ${shortDate(WIN)} (median ${n1(HPE.med)}x; the house forwardMedian gives ${n1(FM.median)}x), cut by the ${Math.abs(Math.round(sectorDrPe))}% P/E move of the same peers (${CORE.map(s => `${shortName(s)} ${pc(drPe[s])}`).join(', ')}) = ${n1(peAfter)}x → ${pe.mult}x: ₹${n0(pe.value)}, ${pctv(pe.vsTarget)} vs the target, so the two market-based methods agree. The DCF (₹${n0(dc.value)}) is the warning: at a ${n1(V.ke)}% cost of equity the cash flows we forecast are worth well below today's price; the price needs a ~${n1(impliedWacc)}% discount rate. Hotel stocks in India have always traded above what a ~12% cost of equity justifies on 10-12% growth; buyers of ITC Hotels are paying for a long runway, not for the next three years.` },
  { exhibit: { type: 'table', title: 'What moves the target', head: ['Item', '₹ per share', 'Why it matters'], wide: [2], rows: [
    ['Each 1x on Sep-28E hotel EBITDA', `~${n0(perTurn)}`, `So ${hm.base}x → the ${n1(HEV.med)}x own median (no sector adjustment) adds ~₹${n0((Math.round(HEV.med * 2) / 2 - hm.base) * perTurn)} a share.`],
    ['Each 1 pp of hotel margin in FY28-29E', `~${n0(SEG.hotel.revenue[1] / 100 * hm.base / sh)}`, `~₹${n0(SEG.hotel.revenue[1] / 100)} cr of EBITDA at ${hm.base}x.`],
    ['Sapphire inventory at book instead of 80%', `+${n0(INV * 0.2 / sh)}`, 'If every apartment sells at cost or better and soon.'],
    ['Net cash at Sep-28E', `${n0(X.netCashSep28 / sh)}`, `~₹${n0(3175 / sh)} a share of today's price is cash (Mar-26) earning ~7% before tax; it grows to ₹${n0(X.netCashSep28 / sh)} by Sep-28E.`],
  ], source: 'GAM Research' } },
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Hotel growth +2 pp a year and margin +1 pp; apartments at 90% of book; ${hm.bull}x (75th percentile of the own history after the sector move).`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; hotel margin ${mgn(0)}% → ${mgn(2)}%; ${hm.base}x Sep-28E hotel EBITDA.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Hotel growth −3 pp a year and margin −1.5 pp; apartments at 70% of book; ${hm.bear}x (25th percentile after the sector move).`],
  ], source: 'GAM Research' } },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Add: model net cash at Mar-27E', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
  ], source: `GAM Research; the tax line includes minorities (${AS.taxRate[0]}%); the DCF does not add the Colombo inventory separately` } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: `Listed hotel peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'vs median since Apr-25', 'P/E (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'ITCHOTELS' ? '**ITC Hotels**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.evEbitda), pc(drEv[p.symbol]), p.pe > 0 && p.pe < 200 ? n1(p.pe) : 'n.m.', p.roe + '%']), source: `Screener.in, scaled to the NSE close on ${ASOF_TXT} (ITC Hotels' Screener EBITDA is ~₹55 cr above the audited figure). Peer set for hotel reports: IHCL, EIH, Chalet, Lemon Tree, ITC Hotels.` } },
];

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a fine hotel company at a fair-to-cheap price after a ${Math.abs(Math.round(drEv.ITCHOTELS))}% de-rating`,
  blocks: [
    { callout: `**What you are buying:** some of India's best city luxury hotels, a RevPAR premium of ~${X.FY26.revparPremiumPct}% to the market, a growing fee stream (+${Q1.streamGrowthPct.fees}% in Q1FY27), ~₹3,175 cr of net cash (Mar-26) and ₹${n0(INV)} cr of Colombo apartments to sell, with ITC as the anchor shareholder. Earnings should grow ~12-14% a year (FY26-29E, before one-offs). What you are not buying: high returns (ROE ~7%) or fast growth.` },
    { callout: `**What you are paying:** ${n1(evNow.hot)}x one-year-forward hotel EV/EBITDA (its own median since Apr-2025 is ${n1(HEV.med)}x) and ${n1(peNow)}x our FY28E EPS. The stock fell ${Math.abs(Math.round(drEv.ITCHOTELS))}% against its own trailing-multiple median, more than the peers' ${Math.abs(Math.round(X.sectorDrEv))}%. On the street's method, our inputs and the house rule, the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The rating rests on the multiple: the market pays only ~${n1(impliedHotelMult)}x Sep-28E hotel EBITDA today, and the DCF does not support the price at a 12.2% discount rate.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Hotel peers re-rate as travel normalises after West Asia', 'Medium', 'IHCL, EIH and Lemon Tree EV/EBITDA vs their medians'],
      ['Room-rate growth back to high single digits', 'Medium', 'Q2-Q3 FY27 ARR in the owned hotels'],
      ['Cash put to work at good returns (acquisitions, managed growth) or returned', 'Medium', 'Use of the ~₹3,100 cr surplus'],
      ['Faster Sapphire sales', 'Low-medium', 'Quarterly handovers above ₹50 cr'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['The West Asia shock lasts into the Oct-Mar peak season', 'Medium', 'Inbound and MICE; bear case {{scen.bear.tp|inr}}'],
      ['New luxury supply in Delhi NCR, Mumbai, Bengaluru, Goa from 2027-28', 'Medium', 'Rate growth stays mid-single digit'],
      ['Sri Lanka: currency, taxes, tourism', 'Medium', 'Book value (OCI), apartment sales, Ratnadipa profits'],
      ['Overhang from further sales by BAT or other holders', 'Medium', 'Share price, not value'],
      ['Large owned projects (Delhi, Vizag) overrun', 'Low-medium', 'ROCE stays ~11%'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Rating bands on today's target:** BUY below ~₹${n0(buyBelow)}, HOLD between ~₹${n0(buyBelow)} and ~₹${n0(sellAbove)}, SELL above ~₹${n0(sellAbove)}.`,
      `**Biggest swing factor:** the multiple. Each 1x on Sep-28E hotel EBITDA is ~₹${n0(perTurn)} a share; the bear multiple (${hm.bear}x) with base earnings gives ~₹${n0(tpAt(hm.bear))}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'RevPAR premium to market', v: `${X.FY26.revparPremiumPct}%`, d: `FY26; ${Q1.revparPremiumPct}% YTD May-26` },
      { k: 'Management fees, FY26', v: `₹${X.FY26.streams.fees} cr`, d: `+28%; Q1FY27 +${Q1.streamGrowthPct.fees}%` },
      { k: 'Forward EV/EBITDA now', v: `${n1(evNow.hot)}x`, d: `median ${n1(HEV.med)}x since Apr-25` },
      { k: 'Hotel peers vs median', v: `${Math.round(X.sectorDrEv)}%`, d: 'IHCL, EIH, Lemon Tree' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { blocks, risks };
