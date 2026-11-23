// BKT report, part 5: the street and the valuation (P/E on Sep-28E EPS, multiple derived from the stock's own forward P/E
// history and the tyre-sector de-rating; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./BALKRISIND.ctx');
const { D, F, V, n0, n1, pc, rup, price, mv, FM, fP25, fP75, byFy, exFy26, two, sectorDr, sectorDrAll, sectorDrExCeat, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, epsSep, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, rating, ST, postQ1, medTp, shortDate, ASOF_TXT, medOf, half, MED5 } = X;
const r10 = v => Math.round(v / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const peerPe = medOf(USED.map(s => P[s].pe));
const tpAt = m => n0(r10(m * epsSep.base));

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street after Q1: split between Buy and Neutral, targets ₹2,259-2,950, all on FY28E P/E',
  blocks: [
    { p: `After the Q1FY27 results (29/30-Jul-2026) Motilal Oswal kept Neutral with ₹2,259 (22x FY28E), saying the record volume was offset by margin pressure and that PCR/TBR and carbon black will dilute returns; ICICI Direct kept Hold with ₹2,525 (27x FY28E) after the post-results rally; Anand Rathi upgraded to Buy with ₹2,950 (28x FY28E: 30x for OHT, 10x for the new businesses); Nomura stayed Neutral, preferring CEAT. Before the results Geojit had a Buy (₹2,547, 26x FY28E) and Deven Choksey an Accumulate (₹2,350). Median of the three post-Q1 targets: ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. Every house that shows its method uses **P/E on one-year-forward (FY28E) EPS**; the spread in targets comes from both the multiple (22-28x) and the EPS (₹94-105).` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes and calls as cited; GAM Research' } },
  ],
};

const ourAt = s => { const m = String(s.multiple || '').match(/(\d+(?:\.\d+)?)x/); return /P\/E/.test(s.method || '') && m ? tpAt(+m[1]) : '–'; };
const sens = [
  ['TVS Srichakra kept in the peer set', `Sector ${pc(sectorDrAll)}: ${n1(FM.median)}x × ${(1 + sectorDrAll / 100).toFixed(3)} = ${half(FM.median * (1 + sectorDrAll / 100))}x`, tpAt(half(FM.median * (1 + sectorDrAll / 100)))],
  ['CEAT left out of the peer set', `Sector ${pc(sectorDrExCeat)}: ${half(FM.median * (1 + sectorDrExCeat / 100))}x`, tpAt(half(FM.median * (1 + sectorDrExCeat / 100)))],
  ['Own median without the FY26 forward year (FX-hit EPS)', `${n1(exFy26)}x × ${k.toFixed(3)} = ${half(exFy26 * k)}x`, tpAt(half(exFy26 * k))],
  ['Only the last two years (since Oct-2024)', `Median ${n1(two)}x, de-rated ${half(two * k)}x`, tpAt(half(two * k))],
  ['No sector de-rating', `${MULT.bull}x on base EPS`, tpAt(MULT.bull)],
  ['Street multiples (MOSL 22x, ICICI Direct 27x, Anand Rathi 28x FY28E)', 'Applied to our Sep-28E EPS', `${tpAt(22)} / ${tpAt(27)} / ${tpAt(28)}`],
  ['Growth premium', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E but only ~${Math.round(X.epsCagrFrom25)}% from FY25: a rebound, not a new growth rate`, 'not applied'],
  ['Returns discount', `ROE {{F.roe.1|pct}} in FY28E vs a cost of equity of {{dcf.ke|n1}}%: the capex has not yet earned its cost`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(X.sepNow)}x`,
  blocks: [
    { h: 'How the street values BKT' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our Sep-28E EPS.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp ? n0(s.tp) : '–', s.method || '–', s.multiple || '–', s.on || '–', ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'A real niche recovering from a currency year; new businesses and raw materials cap the margin; fair after the rally'] },
    ], source: 'ICICI Direct PDF (31-Jul-2026); DSIJ summaries of MOSL (30-Jul), Anand Rathi (2-Aug) and Geojit (4-Jun-2026) notes; Trendlyne listing (Deven Choksey); press roundups (Nomura). Nuvama (Buy, ₹2,600, Business Standard 28-Aug-2026) seen only as a search excerpt: not included.' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (reported EPS)', `One-year-forward P/E since Apr-2021: median ${n1(FM.median)}x (25th-75th percentile ${n1(fP25)}-${n1(fP75)}x). No trough years: FY23 EPS (₹54.7) and FY26 EPS (₹64.3) were above half the prior three-year peak. By forward year: ${Object.entries(byFy).map(([f, v]) => `FY${String(f).slice(2)} ${n1(medOf(v))}x`).join(', ')}`, `**Starting point: ${n1(FM.median)}x**`],
      ['2. One-offs', 'No exceptional items in reported EPS. Screener tags treasury gains (₹171-213 cr a year in FY24-26) as "exceptional"; they recur with the treasury book, so we use reported EPS (§4)', 'No adjustment'],
      ['3. Sector de-rating', `Tyre peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded as distorted: ${EXCL.map(s => `${shortName(s)} (${pc(derate[s])}; FY25 EPS collapse, P/E ~148x in the window)`).join(', ')}; with it ${pc(sectorDrAll)}. BKT itself (${pc(derate.BALKRISIND)}) is not used`, `× ${k.toFixed(3)}`],
      ['4. Growth vs the street', `The street's 22-28x FY28E comes with EPS of ₹94-105; ours is ₹${n1(F.eps[1])}. EPS growth of ~${Math.round(X.epsCagrFwd)}% a year FY26-29E is mostly recovery from a currency-hit FY26`, 'No adjustment (§7c); see sensitivity'],
      ['5. Peers', `Peer median trailing P/E ${n1(peerPe)}x; BKT ${n1(P.BALKRISIND.pe)}x, a premium for higher margins and the export niche that the own-history median already reflects`, 'No extra signal'],
      ['6. Returns vs cost of capital', `ROE ${n1(X.A.roe[X.b])}% in FY26 and {{F.roe.2|pct}} in FY29E vs a {{dcf.ke|n1}}% cost of equity`, 'Supports not paying above the de-rated median'],
      ['7. Result (nearest half-turn)', `${n1(FM.median)}x × ${k.toFixed(3)} = ${n1(FM.median * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}**`],
      ['8. Bull / bear', `Bull: no de-rating (${n1(FM.median)}x). Bear: 25th-percentile forward P/E, de-rated (${n1(fP25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; GAM estimates for FY27-28E EPS in the forward series` } },
    { pair: [
      { type: 'line', title: `Forward P/E since 2021: median ${n1(FM.median)}x; our ${MULT.base}x`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Forward P/E', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: FM.median, text: `Median ${n1(FM.median)}x`, color: '#6b7280' }], source: 'Screener.in prices and EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr less net debt`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-39E, Ke {{dcf.ke|n1}}%, g 5.5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is BKT's ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating and restated from trailing (₹${n0(ttmEbitda)} cr in the year to Jun-26) to Sep-28E EBITDA (× ${evConv.toFixed(3)}); it is lower than the P/E value because depreciation and interest now take a bigger bite of EBITDA than in the history. The DCF gives ₹${n0(mv('dcf').value)} at a ${n1(V.ke)}% cost of equity and 5.5% terminal growth: BKT must keep investing ~7% of revenue to grow, so free cash flow is thin. Both cross-checks sit below the price; only the P/E method, on which the street and our rating rest, gives upside.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, peer sub-sets, own-history windows, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-39E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm excludes treasury income; the cost of equity is used as the discount rate (net debt is small).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed Indian tyre peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', '5-yr median P/E', 'vs median', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'BALKRISIND' ? '**BKT**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', n1(p.pe), n1(MED5[p.symbol]), pc(derate[p.symbol]), n1(p.evEbitda), p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; five-year median trailing P/E from Sep-2021.` } },
  ],
};

module.exports = { street, valuation };
