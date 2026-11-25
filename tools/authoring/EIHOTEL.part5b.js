// EIH report, part 5b: cross-checks, scenarios, DCF, peers (valuation chapter, continued) and risks & honest summary.
const X = require('./EIHOTEL.ctx');
const { F, V, AS, n0, n1, pc, ASOF_TXT, price, mv, hm, pem, HPE, HPErep, FM, peNow, PEERS, drEv, drPe, CORE, sectorDrPe, peAfter, shortName, rating,
  buyBelow, sellAbove, ruleText, Q1, SEG, impliedHotelMult, impliedWacc, MIN_PCT, perTurn, tpAt, WIN, shortDate, HEV, evNow, axis, streetMultFor } = X;
const so = mv('sotp'), pe = mv('pe'), dc = mv('dcf');
const pctv = v => `${v >= 0 ? '+' : ''}${Math.round(v)}%`;

const blocks = [
  { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
    ['**Sum of the parts (EV/EBITDA)**', '**Target**', 'Sep-28E EBITDA; less minorities; associate at market', `${hm.base}x (bull ${hm.bull}x, bear ${hm.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
    ['P/E', 'Cross-check', `Sep-28E EPS ₹${n1(pe.metric)}`, `${pe.mult}x (bull ${pem.bull}x, bear ${pem.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pctv(pe.vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
    ['DCF', 'Cross-check', `15-year FCFF, ${n1(V.ke)}% discount rate, g ${V.terminalGrowth}%`, `implies ${n1(V.intrinsicTp / F.eps[1])}x FY28E EPS`, '{{dcf.blend.methods.2.value|num}}', pctv(dc.vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
    { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs price', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
  ], source: 'GAM Research' } },
  { callout: `**What the cross-checks tell us.** The P/E check uses EIH's own one-year-forward P/E since ${shortDate(WIN)} on attributable EPS before exceptional items (median ${n1(HPE.med)}x; ${n1(HPErep.med)}x on reported EPS; forwardMedian since Apr-2021 ${n1(FM.median)}x), cut by the ${Math.abs(Math.round(sectorDrPe))}% P/E move of the same peers (${CORE.map(s => `${shortName(s)} ${pc(drPe[s])}`).join(', ')}) = ${n1(peAfter)}x → ${pe.mult}x: ₹${n0(pe.value)}, ${pctv(pe.vsTarget)} vs the target. The DCF (₹${n0(dc.value)}) is lower still: at a ${n1(V.ke)}% cost of equity, an owner that must keep spending ~15-20% of revenue on capex to grow does not generate enough free cash to justify ₹${n0(price)}; the price needs a ~${n1(impliedWacc)}% discount rate. Both cross-checks sit below the target, so we see no margin of safety at ₹${n0(price)}.` },
  { exhibit: { type: 'table', title: 'What moves the target', head: ['Item', '₹ per share', 'Why it matters'], wide: [2], rows: [
    ['Each 1x on Sep-28E EBITDA (net of minorities)', `~${n0(perTurn)}`, `So ${hm.base}x → ${n1(HEV.med)}x (own median, no sector move) adds ~₹${n0((HEV.med - hm.base) * perTurn)} a share.`],
    [`Axis Capital's ₹${axis.tp}`, n0(axis.tp), `Needs ~${n1(streetMultFor(axis.tp))}x Sep-28E on our numbers: the own median with no allowance for the sector's 2026 de-rating.`],
    ['Minorities in hotel subsidiaries', `−${n0(X.minPs)}`, `${MIN_PCT}% of the hotel EV (Svara 40%, Oberoi Kerala 20%, Indonesia).`],
    ['EIH Associated Hotels at market less 20% vs book', `+${n0(X.part(/^EIH Associated/).perShare)}`, `Market value ₹${n0(X.eaMv)} cr vs ₹${X.EA.bookCr} cr book.`],
    ['Losing Wildflower Hall', 'n.q.', 'Not disclosed; one of 14 Oberoi hotels in India (85 keys); in the bear case.'],
  ], source: 'GAM Research (n.q. = not quantifiable from disclosures)' } },
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +2 pp a year, margin +1.5 pp; ${hm.bull}x (75th percentile of the own history after the sector move).`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin ${n1(F.ebitdaMargin[0])}% → ${n1(F.ebitdaMargin[2])}%; ${hm.base}x Sep-28E EBITDA.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −4 pp a year, margin −2 pp; ${hm.bear}x (25th percentile after the sector move).`],
  ], source: 'GAM Research' } },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Add: model net cash at Mar-27E (after lease liabilities)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
  ], source: `GAM Research; the tax line includes minorities (${AS.taxRate[0]}%); capex fades from ~20% of revenue (FY29E) to ${AS.dcf.fadeCapexPctTo}%` } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: `Listed hotel peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'vs median', 'P/E (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'EIHOTEL' ? '**EIH (Oberoi)**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.evEbitda), pc(drEv[p.symbol]), p.pe > 0 && p.pe < 200 ? n1(p.pe) : 'n.m.', p.roe + '%']), source: `Screener.in (post-Ind AS EBITDA; EV includes lease liabilities), scaled to the NSE close on ${ASOF_TXT}. Medians since Apr-2022; ITC Hotels since Apr-2025.` } },
];

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a superb hotel company at a fair price for a business that cannot grow its rooms for three years',
  blocks: [
    { callout: `**What you are buying:** the finest hotels in India (Oberoi RevPAR ~1.9x the luxury segment), owned-hotel occupancy ~77%, no bank debt and ~₹1,340 cr of net cash, Reliance and ITC on the register, and a pipeline that would add ~20% more owned keys from FY29. Earnings should grow ~${Math.round(X.epsCagrFwd)}% a year on rates alone.` },
    { callout: `**What you are paying:** ${n1(evNow.gross)}x one-year-forward EV/EBITDA (its own post-Covid median is ${n1(HEV.med)}x) and ${n1(peNow)}x our FY28E EPS, while its listed peers trade ~${Math.abs(Math.round(X.sectorDrEv))}% below their own medians. On the street's method with our inputs and the house rule for the multiple, the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. Without the sector adjustment the same SOTP gives ~₹${n0(tpAt(Math.round(HEV.med * 2) / 2))}, close to Axis Capital's ₹${axis.tp} (a BUY on the rule), so the rating rests on the sector move.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Hotel peers re-rate back towards their medians (foreign travel normalises)', 'Medium', 'IHCL, ITC Hotels and Lemon Tree EV/EBITDA vs their medians'],
      ['EIH wins Wildflower Hall on a long contract', 'Medium', 'The State auction (qualifying bids due 10-Sep-2026)'],
      ['New owned or managed signings that open before FY29', 'Low-medium', 'Pipeline updates each quarter'],
      ['A pull-back', 'n.a.', `Below ~₹${n0(buyBelow)} the rule turns BUY`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Foreign travel stays weak into the peak season (West Asia, air quality, airline capacity)', 'Medium', 'Oberoi hotels most exposed; bear case {{scen.bear.tp|inr}}'],
      ['Wildflower Hall lost or won on a high revenue share', 'Medium', 'Lower Oberoi leisure profit'],
      ['Project delays and cost overruns (Grand, Goa, Gandikota, Hebbal)', 'Medium-high', 'Capex earns nothing for longer; ROCE falls'],
      ['Promoter dispute or a change in the Reliance / ITC holdings', 'Low-medium', 'Overhang on a stock with ~32% free float'],
      ['Labour codes and shorter working hours raise staff costs', 'High', 'Margin below our 35-36.5% path'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and sellers above ~₹${n0(sellAbove)} on today's numbers; a re-rating of the listed hotel peers would lift our multiple mechanically.`,
      `**Biggest swing factor:** the multiple. Each 1x on Sep-28E EBITDA is ~₹${n0(perTurn)} a share; each 1 pp of margin is ~₹${n0(SEG.hotel.revenue[1] / 100)} cr of FY28E EBITDA (~₹${n0(SEG.hotel.revenue[1] / 100 * hm.base / X.sh)} a share at our multiple).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Oberoi RevPAR, FY26', v: `₹${n0(X.C.kpis.FY26.oberoiRevpar)}`, d: '+10%; ~1.9x the luxury segment' },
      { k: 'Revenue growth, FY26', v: '+7%', d: `Q1FY27 +${Q1.revenueGrowthPct}%` },
      { k: 'Forward EV/EBITDA now', v: `${n1(evNow.gross)}x`, d: `median ${n1(HEV.med)}x since Apr-22` },
      { k: 'Hotel peers vs median', v: `${Math.round(X.sectorDrEv)}%`, d: 'IHCL, ITC Hotels, Lemon Tree' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { blocks, risks };
