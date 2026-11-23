// Apollo Tyres report, part 5: the street and the valuation (P/E on Sep-28E EPS, multiple derived from the stock's own
// forward P/E history on EPS before one-offs and the tyre-sector de-rating; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./APOLLOTYRE.ctx');
const { C, D, F, V, n0, n1, pc, rup, price, mv, HA, FM, byFy, exFy25, two, sectorDr, sectorDrAll, sectorDrExCeat, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, epsSep, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, rating, ST, postQ1, medTp, shortDate, ASOF_TXT, medOf, half, MED5, troughYearsAdj } = X;
const r10 = v => Math.round(v / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const peerPe = medOf(USED.map(s => P[s].pe));
const tpAt = m => n0(r10(m * epsSep.base));
const evAt = m => n0(r10((m * ebitdaSep28 + (F.treasury[1] + F.treasury[2]) / 2) / F.shares));

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street after Q1: mostly Buy, targets ₹460-590, median ₹${n0(medTp)}`,
  blocks: [
    { p: `After the Q1FY27 results (7-Aug-2026) Motilal Oswal kept Buy with ₹528 (16x FY28E EPS), expecting margins to revive fully in FY28 on normal costs and Europe's restructuring; Emkay kept Buy and raised its target to ₹575 (18x Jun-28E EPS) on pricing power; ICICI Direct kept Buy at ₹510 (7x FY28E EV/EBITDA; its text also cites ₹425); ICICI Securities had Buy at ₹530; Nomura stayed Neutral (₹468) on margin and capex risk; JPMorgan Neutral at ₹460; UBS upgraded to Buy at ₹590 (23-Aug-2026). Median of the seven post-Q1 targets: ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. The two houses that publish full models value Apollo on **P/E on one-year-forward EPS**; EV/EBITDA (6.3-7x FY28E) is the other method in use. Some notes value India and Europe separately; none we read did so on or before 30-Sep-2026.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes and calls as cited; GAM Research' } },
  ],
};

const ourAt = s => { const m = String(s.multiple || '').match(/(\d+(?:\.\d+)?)x/); if (!m) return '–'; return /P\/E/.test(s.method || '') ? tpAt(+m[1]) : /EV/.test(s.method || '') ? evAt(+m[1]) : '–'; };
const sens = [
  ['Reported EPS instead of EPS before one-offs (forwardMedian)', `Median ${n1(FM.median)}x × ${k.toFixed(3)} = ${half(FM.median * k)}x`, tpAt(half(FM.median * k))],
  ['TVS Srichakra kept in the peer set', `Sector ${pc(sectorDrAll)}: ${n1(HA.med)}x × ${(1 + sectorDrAll / 100).toFixed(3)} = ${half(HA.med * (1 + sectorDrAll / 100))}x`, tpAt(half(HA.med * (1 + sectorDrAll / 100)))],
  ['CEAT left out of the peer set', `Sector ${pc(sectorDrExCeat)}: ${half(HA.med * (1 + sectorDrExCeat / 100))}x`, tpAt(half(HA.med * (1 + sectorDrExCeat / 100)))],
  ['Own median without the FY25 forward year (EPS dip)', `${n1(exFy25)}x × ${k.toFixed(3)} = ${half(exFy25 * k)}x`, tpAt(half(exFy25 * k))],
  ['Only the last two years (since Oct-2024)', `Median ${n1(two)}x, de-rated ${half(two * k)}x`, tpAt(half(two * k))],
  ['No sector de-rating', `${MULT.bull}x on base EPS`, tpAt(MULT.bull)],
  ['Apollo\'s own de-rating instead of the sector\'s', `Apollo's trailing P/E is ${pc(derate.APOLLOTYRE)} vs its five-year median (Screener trailing basis): ${half(HA.med * (1 + derate.APOLLOTYRE / 100))}x`, tpAt(half(HA.med * (1 + derate.APOLLOTYRE / 100)))],
  ['Street multiples (MOSL 16x FY28E, Emkay 18x Jun-28E)', 'Applied to our Sep-28E EPS', `${tpAt(16)} / ${tpAt(18)}`],
  ['Street EV/EBITDA (ICICI Direct 7x FY28E)', 'Applied to our Sep-28E EBITDA less net debt', evAt(7)],
  ['Growth premium', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E (before one-offs), partly price recovery and new capacity`, 'not applied'],
  ['Returns discount', `ROE {{F.roe.1|pct}} in FY28E vs a cost of equity of {{dcf.ke|n1}}%: below the cost of capital during the capex cycle`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(X.sepNow)}x`,
  blocks: [
    { h: 'How the street values Apollo' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our numbers" column applies each broker\'s multiple to our Sep-28E EPS (P/E) or EBITDA less net debt (EV/EBITDA).' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our numbers (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp ? n0(s.tp) : '–', s.method || 'n.d.', s.multiple || '–', s.on || '–', ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'India share gains and a margin recovery with a lag; Europe self-help; cheap against its own history even after the sector de-rating'] },
    ], source: 'MOSL, Emkay and ICICI Direct PDFs (7-10 Aug-2026); Trendlyne listing (ICICI Securities, Geojit); Univest (Nomura, 10-Aug-2026); Investing.com analyst table (JPMorgan 11-Aug, UBS 23-Aug-2026); n.d. = method not disclosed to us' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E, EPS before one-offs (base)', `One-year-forward P/E since Apr-2021 on EPS before exceptional items and the FY26 tax write-back (MOSL adjusted EPS FY22-26, our FY27-28E): median ${n1(HA.med)}x (25th-75th percentile ${n1(HA.p25)}-${n1(HA.p75)}x). Trough years: ${troughYearsAdj.length ? troughYearsAdj.join(', ') : 'none'} (no forward EPS below half the prior three-year peak). By forward year: ${Object.entries(byFy).map(([f, v]) => `FY${String(f).slice(2)} ${n1(medOf(v))}x`).join(', ')}`, `**Starting point: ${n1(HA.med)}x**`],
      ['2. One-offs (§4)', `Reported EPS carries ₹608 cr (FY21), ₹169 cr (FY25) and ₹1,034 cr (FY26) of exceptional charges and a ~₹570 cr FY26 tax write-back; forecasts carry none. The same median on reported EPS (forwardMedian) is ${n1(FM.median)}x: shown as a sensitivity row`, 'Use EPS before one-offs (batch practice)'],
      ['3. Sector de-rating', `Tyre peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded as distorted: ${EXCL.map(s => `${shortName(s)} (${pc(derate[s])}; FY25 EPS collapse, P/E ~148x in the window)`).join(', ')}; with it ${pc(sectorDrAll)}. Apollo itself (${pc(derate.APOLLOTYRE)}) is not used`, `× ${k.toFixed(3)}`],
      ['4. Growth vs the street', `The street's 16-18x comes with FY28E EPS of ₹${n1(X.mosl.eps.FY28E)}-${n1(X.emkay.eps.FY28E)}; ours is ₹${n1(F.eps[1])}. EPS growth of ~${Math.round(X.epsCagrFwd)}% a year FY26-29E is margin recovery plus new capacity`, 'No adjustment (§7c); see sensitivity'],
      ['5. Peers', `Peer median trailing P/E ${n1(peerPe)}x; Apollo ${n1(P.APOLLOTYRE.pe)}x (Screener's trailing basis at the 30-Sep close). Apollo has long traded at a discount to MRF, CEAT and BKT on lower returns and Europe`, 'Supports staying below peers'],
      ['6. Returns vs cost of capital', `ROE ${n1(X.A.roe[X.b])}% in FY26 (reported) and {{F.roe.2|pct}} in FY29E vs a {{dcf.ke|n1}}% cost of equity`, 'Supports not paying above the de-rated median'],
      ['7. Result (nearest half-turn)', `${n1(HA.med)}x × ${k.toFixed(3)} = ${n1(HA.med * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}**`],
      ['8. Bull / bear', `Bull: no de-rating (${n1(HA.med)}x). Bear: 25th-percentile forward P/E, de-rated (${n1(HA.p25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices to ${ASOF_TXT}; MOSL adjusted EPS (7-Aug-2026); GAM estimates for FY27-28E EPS in the forward series` } },
    { pair: [
      { type: 'line', title: `Forward P/E (EPS before one-offs) since 2021: median ${n1(HA.med)}x; our ${MULT.base}x`, unit: 'Price ÷ next full-year EPS before one-offs (x)', x: X.HS.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.HS.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: HA.med, text: `Median ${n1(HA.med)}x`, color: '#6b7280' }], source: 'Screener.in prices; MOSL adjusted EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr less net debt incl. leases`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-39E, Ke {{dcf.ke|n1}}%, g 5.5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** The DCF gives ₹${n0(mv('dcf').value)} at a ${n1(V.ke)}% cost of equity and 5.5% terminal growth: once the AP capex is spent, Apollo converts a ~15% EBITDA margin into real free cash flow. EV/EBITDA gives only ₹${n0(mv('ev').value)}: ${evMULT.base}x is Apollo's ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating and restated from trailing (₹${n0(ttmEbitda)} cr in the year to Jun-26) to Sep-28E EBITDA (× ${evConv.toFixed(3)}), less ~₹3,000 cr of net debt including leases. It is the method most exposed to our margin-recovery assumption, and ICICI Direct's 7x would give ~₹${evAt(7)}. We take the P/E answer, on which the street and our rule rest, and note that one of the two cross-checks is below the price.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, peer sub-sets, own-history windows, own de-rating, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-39E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt incl. leases at Mar-27 (negative = debt)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm; the cost of equity (12.5%) is used as the discount rate (debt is ~6% of market value; WACC would be ~12.1%).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed Indian tyre peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', '5-yr median P/E', 'vs median', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'APOLLOTYRE' ? '**Apollo Tyres**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', n1(p.pe), n1(MED5[p.symbol]), pc(derate[p.symbol]), n1(p.evEbitda), p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; five-year median trailing P/E from Sep-2021.` } },
  ],
};

module.exports = { street, valuation };
