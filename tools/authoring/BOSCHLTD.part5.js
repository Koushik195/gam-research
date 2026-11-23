// Bosch Ltd report, part 5: the street and the valuation (P/E on Sep-28E EPS, multiple derived from the stock's own clean
// forward P/E history and the auto-component de-rating; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./BOSCHLTD.ctx');
const { D, F, V, SC, n0, n1, pc, rup, price, mv, FM, cleanMed, cleanP25, cleanP75, houseP25, cleanSeries, sectorDr, sectorDrAll, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, houseMult, epsSep, evMed, evP25, evMULT, evConv, ttmEbitda, rbicTtmEbitda, ebitdaSep28, rating, ST, postQ1, medTp, shortDate, ASOF_TXT, two, byFy, houseByFy, medOf, exRbicEps27, medOf: md } = X;
const r10 = v => Math.round(v / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const peerPe = medOf(USED.map(s => P[s].pe));

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street after Q1: Neutral to Reduce on valuation, targets ₹35,000-54,000`,
  blocks: [
    { p: `Coverage of Bosch is thin and mostly cautious. After the Q1FY27 results (10-Aug-2026) Motilal Oswal kept Neutral with ₹43,728 (~40x FY28E EPS of ₹1,093), calling the stock fairly valued at 44.6x/41.4x FY27E/FY28E; a Reduce-rated broker raised EPS 3-4% but kept ₹34,984, calling a 40-plus P/E rich for mid-teen growth; the highest target in coverage was ₹54,050 (Business Standard roundup, 31-Aug-2026, broker not visible to us). UBS had upgraded to Buy (₹45,530) in June on the RBIC deal and the JVs. Median of the three post-Q1 targets: ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. Every house that shows its method uses **P/E on one-year-forward EPS**. The bulls focus on RBIC, regulation-led content and the margin recovery; the bears on valuation and on ICE exposure.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes and press as cited; annual reports; GAM Research' } },
  ],
};

const ourAt = s => { const m = String(s.multiple).match(/(\d+(?:\.\d+)?)x/); return s.method === 'P/E' && m ? n0(r10(+m[1] * epsSep.base)) : '–'; };
const sens = [
  ['House median on reported EPS (no one-off adjustment)', `${n1(FM.median)}x × ${k.toFixed(3)} = ${houseMult}x`, n0(r10(houseMult * epsSep.base))],
  ['Only the last two years (since Oct-2024)', `Clean forward P/E median ${n1(two)}x, de-rated ${n1(two * k)}x`, n0(r10(X.half(two * k) * epsSep.base))],
  ['No sector de-rating', `${MULT.bull}x on base EPS`, n0(r10(MULT.bull * epsSep.base))],
  ['Street multiple (MOSL ~40x FY28E)', `40x on our Sep-28E EPS`, n0(r10(40 * epsSep.base))],
  ['Growth premium (PEG-style)', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E (incl. RBIC) vs ~${Math.round(X.epsCagrHistClean)}% in FY21-26 before one-offs: no case for a premium`, 'not applied'],
  ['Returns premium', 'ROE rises to ~35-40% only because pooling cuts book equity; on Bosch\'s pre-deal equity ROE was 16-22% (FY24-26), similar to the history that set the median', 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${Math.round(X.sepNow)}x`,
  blocks: [
    { h: 'How the street values Bosch' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our Sep-28E EPS.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple, s.on, ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Good earnings, rising RBIC mix; the price already assumes more than the stock\'s own history pays for them'] },
    ], source: 'MOSL notes (PDFs, 9-Apr and 11-Aug-2026); Business Standard roundup (31-Aug-2026, via search excerpt; site blocks automated reading); India Blooms/NDTV Profit (UBS, 12-Jun-2026); Trendlyne listing (Geojit)' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E, reported EPS', `One-year-forward P/E since Apr-2021: median ${n1(FM.median)}x (no trough years). But the FY24 and FY26 business-sale gains inflate the EPS used for Apr-2022 to Mar-2023 and Apr-2024 to Mar-2025 (median ${n1(md(houseByFy[2024]))}x and ${n1(md(houseByFy[2026]))}x on reported EPS)`, `${n1(FM.median)}x (shown as a sensitivity)`],
      ['2. Own forward P/E, clean EPS (used)', `Same dates on EPS before exceptional items, and for dates before the 8-Apr-2026 RBIC announcement on our FY27E EPS without RBIC (₹${n1(exRbicEps27)}): median ${n1(cleanMed)}x (25th-75th percentile ${n1(cleanP25)}-${n1(cleanP75)}x). By forward year: ${Object.entries(byFy).map(([f, v]) => `FY${String(f).slice(2)} ${n1(md(v))}x`).join(', ')}`, `**Starting point: ${n1(cleanMed)}x**`],
      ['3. Sector de-rating', `Auto-component peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded as distorted: ${EXCL.map(s => `${shortName(s)} (${pc(derate[s])}; ${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join(', ')}; with it ${pc(sectorDrAll)}. Bosch itself (${pc(derate.BOSCHLTD)}) is not used`, `× ${k.toFixed(3)}`],
      ['4. Growth vs the street', `MOSL's ~40x FY28E comes with FY26-28E EPS growth of ~17% a year (incl. RBIC); ours is ~${Math.round(X.epsCagrFwd)}% over FY26-29E`, 'No adjustment (§7c); see sensitivity'],
      ['5. Peers', `Peer median trailing P/E ${n1(peerPe)}x; Bosch ${n1(P.BOSCHLTD.pe)}x on trailing EPS that excludes RBIC`, 'In line with peers on trailing EPS, which excludes RBIC: no extra signal'],
      ['6. Result (nearest half-turn)', `${n1(cleanMed)}x × ${k.toFixed(3)} = ${n1(cleanMed * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}**`],
      ['7. Bull / bear', `Bull: no de-rating (${n1(cleanMed)}x). Bear: 25th-percentile clean forward P/E, de-rated (${n1(cleanP25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; AR note 40 (exceptional items); GAM estimates for FY27-29E EPS in the forward series` } },
    { pair: [
      { type: 'line', title: 'Forward P/E since 2021: reported vs clean EPS', unit: 'Price ÷ next full-year EPS (x)', x: cleanSeries.map(x => x[0]), series: [{ name: 'Clean EPS (used)', values: cleanSeries.map(x => x[1]), fmt: 'x', thin: true }, { name: 'Reported EPS', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; EPS before exceptional items; GAM estimates for FY27-28E (ex-RBIC FY27E before 8-Apr-2026)' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr + net cash`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA plus net cash) gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is Bosch's ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating and restated from trailing to Sep-28E EBITDA using a pro forma trailing base (₹${n0(ttmEbitda)} cr in the year to Jun-26 plus ~₹${n0(rbicTtmEbitda)} cr for RBIC). The DCF gives ₹${n0(mv('dcf').value)} at an ${n1(V.ke)}% cost of equity and 6% terminal growth: even at ${n1(V.sens.waccs[0])}% and ${n1(V.sens.gs[4])}% terminal growth (the most generous corner of the grid below) it gives only ₹${n0(V.sens.grid[0][4])}, against a price of ₹${n0(price)}. All three methods sit well below the share price.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, own-history windows, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research. Even the bull case is below the 30-Sep-2026 price.' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (after the RBIC payment)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm excludes treasury income; the cost of equity is used as the discount rate (no debt).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed auto-component peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'BOSCHLTD' ? '**Bosch**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : 'Dec year', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Bosch's revenue, margin and ROE are before RBIC (ROE on reported equity: 19.4%). Schaeffler reports on December years.` } },
  ],
};

module.exports = { street, valuation };
