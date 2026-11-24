// Trent report, part 5: the street and the valuation (P/E on Sep-28E consolidated EPS, multiple derived from the stock's own
// forward P/E history and the retail-sector de-rating; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./TRENT.ctx');
const { D, F, V, n0, n1, pc, price, mv, HA, FM, byFy, medExOneOff, two, post22, sectorDr, sens, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, epsSep, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, rating, ST, postQ1, medTp, ASOF_TXT, medOf, half, MED5, eps24, eps24x } = X;
const r10 = v => Math.round(v / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const peerPe = medOf(USED.map(s => P[s].pe));
const tpAt = m => n0(r10(m * epsSep.base));
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const fac = d => (1 + d / 100);
const row = (label, d) => [label, `Sector ${pc(d)}: ${n1(HA.med)}x × ${fac(d).toFixed(3)} = ${half(HA.med * fac(d))}x`, tpAt(half(HA.med * fac(d)))];
const streetPe = { 'Motilal Oswal': 62, 'Elara Securities': 64 }; // the P/E each target equals (stated by the broker or the summary)
const lo = Math.min(...postQ1.map(s => s.tp)), hi = Math.max(...postQ1.map(s => s.tp));
const sotpAdj = [r10((2774 * 0.5 * 2 + 204 * 0.2 * 40) / X.shares + 65 / X.shares * MULT.base), r10((2774 * 0.5 * 2.5 + 204 * 0.2 * 40) / X.shares + 65 / X.shares * MULT.base)];

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street after Q1: 11 of 15 positive, one Sell, targets ₹${n0(lo)}-${n0(hi)}, median ₹${n0(medTp)}`,
  blocks: [
    { p: `After the Q1FY27 results (6-Aug-2026) brokers raised targets on the margin beat. Motilal Oswal kept Buy at ₹3,775 (SOTP: 40x pre-Ind AS EBITDA for Westside and Zudio; ~62x FY28E EPS); ICICI Direct Buy ₹3,599 (SOTP); Elara Accumulate ₹3,500 (64x Sep-28E standalone P/E, Star 2x EV/Sales, Zara 40x P/E); Nuvama Buy ₹3,591 (from ₹3,219); UBS Buy ₹3,800; Macquarie Outperform ₹3,600; Antique ₹4,455 at the top; Goldman Sachs Neutral ₹3,000 and Citi Sell ₹2,950 at the bottom. Median of the ${postQ1.length}: ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}; Business Today's consensus target was ₹3,454. ${D.street.methodSummary}` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], wide: [0], rows: D.critiques.map(c => [c]), source: 'Company documents and broker notes as cited; GAM Research' } },
  ],
};

const sensRows = [
  ['EPS before the FY24 lease-reassessment gain', `FY24 EPS ₹${n1(eps24x)} instead of ₹${n1(eps24)}: median ${n1(medExOneOff)}x × ${k.toFixed(3)} = ${half(medExOneOff * k)}x`, tpAt(half(medExOneOff * k))],
  row('Peer set without DMart (least de-rated peer)', sens.exDmart),
  row('Peer set without Bata (FY26 profit fell)', sens.exBata),
  row('Peer set without Metro Brands (listed Dec-2021)', sens.exMetro),
  row('Vishal Mega Mart added (listed Dec-2024; median since listing)', sens.withVmm),
  ['Own history from Apr-2022 (after the Covid recovery year)', `Median ${n1(post22)}x, de-rated ${half(post22 * k)}x`, tpAt(half(post22 * k))],
  ['Only the last two years (since Oct-2024)', `Median ${n1(two)}x, de-rated ${half(two * k)}x`, tpAt(half(two * k))],
  ['No sector de-rating', `${MULT.bull}x on base EPS`, tpAt(MULT.bull)],
  ['Trent\'s own de-rating instead of the sector\'s', `Trent's trailing P/E is ${pc(derate.TRENT)} vs its five-year median: ${half(HA.med * fac(derate.TRENT))}x`, tpAt(half(HA.med * fac(derate.TRENT)))],
  ['Street multiples (58x Nuvama at CMP, 62x MOSL, 64x Elara)', 'Applied to our consolidated Sep-28E EPS (the street\'s are on higher standalone EPS)', `${tpAt(58)} / ${tpAt(62)} / ${tpAt(64)}`],
  ['Street-style SOTP for Star and Zara', 'Star at 2-2.5x sales (50%), Zara at 40x P/E (20%), instead of equity-accounting Star\'s losses', `+${n0(sotpAdj[0])} to +${n0(sotpAdj[1])}`],
  ['Growth premium', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E, space-led, depreciation outgrowing revenue`, 'not applied'],
  ['Returns view', 'ROE {{F.roe.1|pct}} in FY28E vs a ~12% cost of equity: high returns, already in the history', 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(X.sepNow)}x`,
  blocks: [
    { h: 'How the street values Trent' },
    { p: 'Brokers that show their working use a sum of the parts, but ~95% of every SOTP is Westside + Zudio on a P/E (Elara 64x Sep-28E) or an EV/EBITDA that equals one (MOSL 40x pre-Ind AS EBITDA = 62x FY28E EPS). Star and the Inditex stakes are equity-accounted in consolidated EPS. So P/E on consolidated EPS for the year the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E) is our primary method; the SOTP difference for Star and Zara is a sensitivity row. Note the street\'s multiples sit on standalone EPS, which is ~10-15% higher than consolidated.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our numbers (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp ? n0(s.tp) : '–', s.method || 'n.d.', s.multiple || '–', s.on || '–', streetPe[s.broker] ? tpAt(streetPe[s.broker]) : '–', s.thesis]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Best operator in Indian fashion; growth now space-led with falling sales per sq ft; depreciation caps EPS growth; still above the de-rated multiple'] },
    ], source: 'DSIJ summaries of MOSL (6-Aug-2026) and ICICI Securities (7-Aug-2026); Business Today (7-Aug-2026 and 13-Aug-2026) for the other brokers; n.d. = not disclosed to us' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (base)', `One-year-forward P/E since Apr-2021 on reported EPS (our FY27-28E for the latest forward years; forwardMedian): median ${n1(HA.med)}x (25th-75th percentile ${n1(HA.p25)}-${n1(HA.p75)}x; range ${n1(HA.min)}-${n1(HA.max)}x). Trough years left out: ${FM.troughYears.join(', ') || 'none (forward EPS never a loss or below half the prior peak)'}. By forward year: ${Object.entries(byFy).map(([f, v]) => `FY${String(f).slice(2)} ${n1(medOf(v))}x`).join(', ')}`, `**Starting point: ${n1(HA.med)}x**`],
      ['2. One-offs (§4)', `FY24 EPS includes a ₹439 cr after-tax lease gain (₹${n1(eps24)} reported, ₹${n1(eps24x)} before it); the median on EPS before it is ${n1(medExOneOff)}x (the FY24 points stay below the median either way)`, 'No change; reported EPS (house function)'],
      ['3. Sector de-rating', `Listed retailers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded: ${EXCL.map(s => `${shortName(s)} (${D.peers.excluded[s].split(':')[0].replace(/\.$/, '')})`).join('; ')}. Trent itself (${pc(derate.TRENT)}) is not used. Sub-sets give ${pc(Math.min(...Object.values(sens), sectorDr))} to ${pc(Math.max(...Object.values(sens), sectorDr))}`, `× ${k.toFixed(3)}`],
      ['4. Growth vs the street', `The street's 58-64x comes with ~20% EPS growth on standalone numbers; ours is ~${Math.round(X.epsCagrFwd)}% consolidated over FY26-29E, slower than the 30%+ of FY22-26`, 'No adjustment (§7c); see sensitivity'],
      ['5. Peers', `Peer median trailing P/E ${n1(peerPe)}x; Trent ${n1(P.TRENT.pe)}x (Screener basis at the 30-Sep close). Trent still trades at a premium for growth and returns`, 'Trent has de-rated more than the sector, from a higher base'],
      ['6. Returns vs cost of capital', 'ROE ~28% in FY26 and {{F.roe.2|pct}} in FY29E vs a ~12% cost of equity', 'Supports a premium multiple; already in the history'],
      ['7. Result (nearest half-turn)', `${n1(HA.med)}x × ${k.toFixed(3)} = ${n1(HA.med * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}**`],
      ['8. Bull / bear', `Bull: no de-rating (${n1(HA.med)}x). Bear: 25th-percentile forward P/E, de-rated (${n1(HA.p25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; peer multiples at the NSE close; GAM estimates for FY27-28E EPS in the forward series` } },
    { pair: [
      { type: 'line', title: `Forward P/E since 2021: median ${n1(HA.med)}x; our ${MULT.base}x`, unit: 'Price ÷ next full-year EPS (x)', x: X.HS.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.HS.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: HA.med, text: `Median ${n1(HA.med)}x`, color: '#6b7280' }], source: 'Screener.in prices and EPS (bonus-adjusted); GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr less net debt incl. leases`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E after lease payments, cost of capital {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is Trent's ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same ${Math.abs(sectorDr).toFixed(1)}% and restated from trailing (₹${n0(ttmEbitda)} cr, year to Jun-26) to Sep-28E EBITDA (× ${evConv.toFixed(3)}). It is higher than the P/E value because Ind AS EBITDA grows faster than EPS (rent sits in depreciation and interest); on profit, which is what shareholders get, the P/E is the better guide. The DCF gives only ₹${n0(mv('dcf').value)}: 15 years of growth fading from ~19% to 10% at an ~18-19% EBITDA margin, after capex and lease payments, at a 12.2% cost of capital, explain about half of the price. That is why we rate Valuation RED.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sensRows, source: 'GAM Research. Per PLAYBOOK §7c, peer sub-sets, own-history windows, own de-rating, SOTP variants, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +4pp a year, margin +0.5pp; multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −5pp a year, margin −1pp; multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt incl. leases at Mar-27 (negative = debt)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm after capex and lease payments; beta 0.95, so the cost of equity (12.2%) is the discount rate (no debt other than leases).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed Indian retail peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', '5-yr median P/E', 'vs median', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'TRENT' ? '**Trent**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.pe != null ? n1(p.pe) : '–', MED5[p.symbol] != null ? n1(MED5[p.symbol]) : '–', derate[p.symbol] != null ? pc(derate[p.symbol]) : '–', p.evEbitda != null ? n1(p.evEbitda) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; five-year median trailing P/E from Oct-2021 (Metro Brands from its Dec-2021 listing, Vishal Mega Mart from Dec-2024). Page Industries is on a standalone basis.` } },
  ],
};

module.exports = { street, valuation };
