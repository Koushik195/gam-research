// CEAT report, part 5: the street and the valuation (P/E on Sep-28E EPS, multiple derived from the stock's own forward P/E
// history on reported EPS and the tyre-sector de-rating; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./CEATLTD.ctx');
const { D, F, V, n0, n1, pc, price, mv, HA, FM, byFy, medAdj, exFy27, two, sectorDr, sectorDrAll, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, epsSep, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, rating, ST, postQ1, medTp, ASOF_TXT, medOf, half, MED5 } = X;
const r10 = v => Math.round(v / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const peerPe = medOf(USED.map(s => P[s].pe));
const tpAt = m => n0(r10(m * epsSep.base));
const evAt = m => n0(r10((m * ebitdaSep28 + (F.treasury[1] + F.treasury[2]) / 2) / F.shares));
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street after Q1: mostly Buy, targets ₹4,015-4,500, median ₹${n0(medTp)}`,
  blocks: [
    { p: `After the Q1FY27 results (16-17 Jul-2026) Motilal Oswal kept Buy with ₹4,228 (~18x FY28E EPS of ₹${n1(X.mosl.eps.FY28E)}), cutting FY27E EPS by 22% for the interest hit but leaving FY28E unchanged; Emkay kept Buy at ₹4,500 (18x FY28E in its 6-Jul sector note, which upgraded CEAT from Reduce; rolled to a Jun-27 target on 18-Jul), arguing margins have bottomed; ICICI Securities had Buy at ₹4,300 (20-Jul); Nomura Buy at ₹4,266 (20-Jul, from ₹4,276); Nirmal Bang moved to Hold at ₹4,015 (July). Median of the five post-Q1 targets: ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. Before Q1, Nuvama (Hold, ₹3,900 at 16x FY28E), JM Financial (Add, ₹4,090) and Anand Rathi (Hold, ₹3,850) were more cautious. Everyone who discloses a method uses **P/E on one-year-forward EPS**; none we read used EV/EBITDA or a sum of the parts on or before 30-Sep-2026.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes and calls as cited; GAM Research' } },
  ],
};

const ourAt = s => { const m = String(s.multiple || '').match(/(\d+(?:\.\d+)?)x/); if (!m) return '–'; return /P\/E/.test(s.method || '') ? tpAt(+m[1]) : '–'; };
const sens = [
  ['MOSL adjusted EPS (exceptional items removed) instead of reported', `Median ${n1(medAdj)}x × ${k.toFixed(3)} = ${half(medAdj * k)}x`, tpAt(half(medAdj * k))],
  ['TVS Srichakra kept in the peer set', `Sector ${pc(sectorDrAll)}: ${n1(HA.med)}x × ${(1 + sectorDrAll / 100).toFixed(3)} = ${half(HA.med * (1 + sectorDrAll / 100))}x`, tpAt(half(HA.med * (1 + sectorDrAll / 100)))],
  ['Own median without the FY27E forward year (Q1 squeeze inflates it)', `${n1(exFy27)}x × ${k.toFixed(3)} = ${half(exFy27 * k)}x`, tpAt(half(exFy27 * k))],
  ['Only the last two years (since Oct-2024)', `Median ${n1(two)}x, de-rated ${half(two * k)}x`, tpAt(half(two * k))],
  ['No sector de-rating', `${MULT.bull}x on base EPS`, tpAt(MULT.bull)],
  ['CEAT\'s own de-rating instead of the sector\'s', `CEAT's trailing P/E is ${pc(derate.CEATLTD)} vs its five-year median: ${half(HA.med * (1 + derate.CEATLTD / 100))}x`, tpAt(half(HA.med * (1 + derate.CEATLTD / 100)))],
  ['Street multiples (Nuvama 16x, MOSL and Emkay ~18x FY28E)', 'Applied to our Sep-28E EPS', `${tpAt(16)} / ${tpAt(18)}`],
  ['Growth premium', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E, almost all margin recovery after a squeeze`, 'not applied'],
  ['Returns discount', `ROE {{F.roe.1|pct}} in FY28E vs a cost of equity of ~12.8%: only just covers it at mid-cycle`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(X.sepNow)}x`,
  blocks: [
    { h: 'How the street values CEAT' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our numbers" column applies each broker\'s P/E to our Sep-28E EPS.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our numbers (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp ? n0(s.tp) : '–', s.method || 'n.d.', s.multiple || '–', s.on || '–', ourAt(s), s.thesis]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Strong brand and volumes; margin recovery with a lag; Camso a drag until FY28; fair after the sector de-rating'] },
    ], source: 'MOSL (17-Jul-2026) and Emkay (6 and 18-Jul-2026) PDFs; Trendlyne listing (ICICI Securities, Anand Rathi); MarketScreener entries seen via search (Nomura, Nirmal Bang); Business Today and Business Standard (Nuvama, JM Financial, Apr-2026); n.d. = method not disclosed to us' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (base)', `One-year-forward P/E since Apr-2021 on reported EPS (our FY27-28E for the latest forward years; forwardMedian): median ${n1(HA.med)}x (25th-75th percentile ${n1(HA.p25)}-${n1(HA.p75)}x; all years ${n1(FM.medianAll)}x). Trough year left out: ${FM.troughYears.join(', ') || 'none'} (FY23 EPS ₹46 was below half of FY21's ₹107). By forward year: ${Object.entries(byFy).map(([f, v]) => `FY${String(f).slice(2)} ${n1(medOf(v))}x`).join(', ')}`, `**Starting point: ${n1(HA.med)}x**`],
      ['2. One-offs (§4)', `Exceptional items are small (₹30-71 cr a year, VRS and labour codes; MOSL's adjusted FY26 EPS is 7% above reported). The median on MOSL adjusted EPS is ${n1(medAdj)}x: a sensitivity row`, 'Use reported EPS (house function)'],
      ['3. Sector de-rating', `Tyre peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded as distorted: ${EXCL.map(s => `${shortName(s)} (${pc(derate[s])}; FY25 EPS collapse, P/E ~148x in the window)`).join(', ')}; with it ${pc(sectorDrAll)}. CEAT itself (${pc(derate.CEATLTD)}) is not used`, `× ${k.toFixed(3)}`],
      ['4. Growth vs the street', `The street's 16-18x comes with FY28E EPS of ₹${n1(X.mosl.eps.FY28E)}-${n1(X.emkay.eps.FY28E)}; ours is ₹${n1(F.eps[1])}. FY28E doubling is a recovery from a squeezed FY27, not structural growth`, 'No adjustment (§7c); see sensitivity'],
      ['5. Peers', `Peer median trailing P/E ${n1(peerPe)}x; CEAT ${n1(P.CEATLTD.pe)}x on trailing EPS that still includes FY26's strong quarters (Screener basis at the 30-Sep close)`, 'CEAT has de-rated less than MRF and Apollo'],
      ['6. Returns vs cost of capital', `ROE ${n1(X.A.roe[X.b])}% in FY26 and {{F.roe.2|pct}} in FY29E vs a ~12.8% cost of equity; 2-6% in the FY22-23 squeeze`, 'Supports not paying above the de-rated median'],
      ['7. Result (nearest half-turn)', `${n1(HA.med)}x × ${k.toFixed(3)} = ${n1(HA.med * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}**`],
      ['8. Bull / bear', `Bull: no de-rating (${n1(HA.med)}x). Bear: 25th-percentile forward P/E, de-rated (${n1(HA.p25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; peer multiples at the NSE close; GAM estimates for FY27-28E EPS in the forward series` } },
    { pair: [
      { type: 'line', title: `Forward P/E since 2021: median ${n1(HA.med)}x; our ${MULT.base}x`, unit: 'Price ÷ next full-year EPS (x)', x: X.HS.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.HS.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: HA.med, text: `Median ${n1(HA.med)}x`, color: '#6b7280' }], source: 'Screener.in prices and EPS; GAM estimates for FY27-28E (FY23 forward year excluded as a trough)' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr less net debt incl. leases`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-39E, WACC {{dcf.ke|n1}}%, g 5.5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** The DCF gives ₹${n0(mv('dcf').value)} at an ${n1(V.ke)}% WACC and 5.5% terminal growth: it assumes the margin settles at 12.5% and capex fades to 6% of revenue, so it says the long-run franchise is worth more than the cycle-adjusted multiple. EV/EBITDA gives only ₹${n0(mv('ev').value)}: ${evMULT.base}x is CEAT's ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating and restated from trailing (₹${n0(ttmEbitda)} cr in the year to Jun-26) to Sep-28E EBITDA (× ${evConv.toFixed(3)}), less ~₹3,200 cr of net debt including leases. The two bracket our target; we take the P/E answer, on which the street and our rule rest.` },
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
    ], source: 'GAM Research. Free cash flow to the firm. The engine discounts at the cost of equity, so beta is set at 0.85 to give our ~11.6% WACC (debt ~19% of EV at ~6.3% after tax; cost of equity ~12.8%).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed Indian tyre peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', '5-yr median P/E', 'vs median', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'CEATLTD' ? '**CEAT**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', n1(p.pe), n1(MED5[p.symbol]), pc(derate[p.symbol]), n1(p.evEbitda), p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; five-year median trailing P/E from Sep-2021.` } },
  ],
};

module.exports = { street, valuation };
