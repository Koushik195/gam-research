// Amara Raja report, part 5: the street and the valuation (sum of the parts: core P/E on Sep-28E standalone EPS, ARACT at
// book less PV of losses, other subsidiaries at book; P/E and DCF cross-checks).
const X = require('./ARE&M.ctx');
const { D, F, V, n0, n1, pc, pc1, price, mv, FM, adjMed, coreMed, coreP25, coreP75, buckets, sectorDr, sectorDrAll, sectorDrExExide, k, derate, P, PEERS, USED, EXCL, shortName,
  atCost, MULT, peMULT, epsSep, rating, ST, postQ1, medTp, shortDate, ASOF_TXT, medOf, shares, parts, aract, otherVal, BL, half, MED5 } = X;
const r10 = v => Math.round(v / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc1(derate[s])}`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const B = parts.base, sumB = (B.core + B.aract + B.other) / shares, coreEps = epsSep.base;
const tpWith = d => n0(r10(sumB + d / shares));
const peerPe = medOf(USED.map(s => P[s].pe));
const invested = 1500 + BL.aract.infusion[0];

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street after Q1: one Buy, five Hold/Neutral; median target ₹${n0(medTp)}`,
  blocks: [
    { p: `Six houses updated after the Q1FY27 results (10-Aug-2026): Buy from Nuvama (₹1,130); Hold or Neutral from 360 ONE (₹1,195), Anand Rathi (₹1,080), J.P. Morgan (₹1,070), Nomura (₹1,048) and Motilal Oswal (₹944). The median target is ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} above the ${ASOF_TXT} close of ₹${n0(price)}. But those targets were set with the stock at ~₹970; it then fell ~22% to ₹755 by 30-Sep-2026 (Exide fell ~13% from mid-August) without any change in ratings that we could find. Four of the six publish a method and all value **standalone FY28E EPS** at 12-18x; MOFSL, Nuvama and Anand Rathi add the New Energy business separately (₹92 to ₹356 a share). Before Q1, ICICI Direct (Hold, ₹960) and Avendus Spark (Add, ₹975) used the same structure. The bulls focus on the OEM and replacement cycle and on BESS; the bears on margins and on returns from lithium.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(r => [rup(r)]), source: 'Broker notes as cited; company calls; AR FY26; GAM Research' } },
  ],
};

const coreAt = s => { const m = String(s.multiple).match(/(\d+(?:\.\d+)?)x/); return m && (s.method === 'SOTP' || s.method === 'P/E') ? n0(+m[1] * F.eps[1]) : '–'; };
const sens = [
  ['Core at MOFSL\'s and Nuvama\'s 15x', `15x vs ${MULT.base}x on Sep-28E EPS ₹${n1(coreEps)}`, tpWith((15 - MULT.base) * coreEps * shares)],
  ['Core at Anand Rathi\'s 12x', `12x vs ${MULT.base}x`, tpWith((12 - MULT.base) * coreEps * shares)],
  ['Whole stock at 360 ONE\'s 18x (no separate ARACT)', `18x Sep-28E EPS, ARACT and other subsidiaries left to the multiple`, n0(r10(18 * coreEps))],
  ['No sector de-rating', `${MULT.bull}x (own core median, nearest half-turn)`, tpWith((MULT.bull - MULT.base) * coreEps * shares)],
  ['Sector move with all peers / without Exide', `${pc1(sectorDrAll)} → ${half(coreMed * (1 + sectorDrAll / 100))}x; ${pc1(sectorDrExExide)} → ${half(coreMed * (1 + sectorDrExExide / 100))}x`, `${tpWith((half(coreMed * (1 + sectorDrAll / 100)) - MULT.base) * coreEps * shares)} / ${tpWith((half(coreMed * (1 + sectorDrExExide / 100)) - MULT.base) * coreEps * shares)}`],
  ['Subsidiaries at cost (not book) in the core-P/E history', `Core median ${n1(atCost.med)}x (vs ${n1(coreMed)}x) × ${k.toFixed(3)} → ${atCost.mult}x (vs ${MULT.base}x)`, `${n0(atCost.tp)} (${pc1(atCost.upside)}: ${atCost.rating} under our rule)`],
  ['ARACT at 1x invested capital (MOFSL style)', `₹${n0(invested)} cr (₹1,500 cr at Mar-26 + ₹${n0(BL.aract.infusion[0])} cr FY27) vs our ₹${n0(aract.base.value)} cr`, tpWith(invested - aract.base.value)],
  ['ARACT at 2x book (Nuvama style)', `2 × ₹${n0(aract.base.book)} cr vs our ₹${n0(aract.base.value)} cr`, tpWith(2 * aract.base.book - aract.base.value)],
  ['Growth premium', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E (before one-offs) vs ~${Math.round(X.epsCagrHist)}% FY21-26: mostly a margin rebuild and cash interest, not a better business`, 'not applied'],
  ['Returns', 'Core ROCE ~18% excluding investments, but standalone ROE ~10-12% (forecast) is at or below the 12.5% cost of equity while ARACT is loss-making', 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: sum of the parts gives {{dcf.tp|inr}}; the core at ${MULT.base}x Sep-28E EPS`,
  blocks: [
    { h: 'How the street values Amara Raja' },
    { p: 'We use the street\'s method so our target is comparable: the lead-acid business on P/E (on Sep-28E: half FY28E, half FY29E standalone EPS) plus the subsidiaries separately. "Core at our EPS" applies each broker\'s core (or whole-stock) multiple to our FY28E standalone EPS.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Core multiple', 'On', 'Core at our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple, s.on, coreAt(s), rup(s.parts ? `${s.parts}. ${s.thesis}` : s.thesis)]),
      ...D.street.earlier.map(([br, d, r, tp, m]) => [`${br} (${shortDate(d)}, pre-Q1)`, r, n0(tp), rup(m), '–', 'FY28E', '–', 'Pre-Q1 view, not updated in what we could see']),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**SOTP**', `**${MULT.base}x core**`, '**Sep-28E**', `**${n0(MULT.base * F.eps[1])}**`, 'Good core at a de-rated price; ARACT valued at book less losses to come'] },
    ], source: 'MOFSL (11-Aug-2026), Nuvama (11-Aug-2026), 360 ONE (11-Aug-2026), Anand Rathi (13-Aug-2026), ICICI Direct (4-Jun-2026) and Avendus Spark (27-May-2026) PDFs; Nomura and J.P. Morgan via Moneycontrol (12-Aug-2026). Kotak (11-Aug-2026) not retrievable.' } },
    { h: 'The sum of the parts' },
    { exhibit: { type: 'table', title: 'Sum of the parts (₹ crore unless stated)', head: ['Part', 'Basis', 'Bull', 'Base', 'Bear', 'Base ₹/share'], wide: [1], rows: [
      ['Lead-acid core', `Sep-28E standalone EPS ₹${n1(epsSep.bull)} / ₹${n1(coreEps)} / ₹${n1(epsSep.bear)} × ${MULT.bull}x / ${MULT.base}x / ${MULT.bear}x`, n0(parts.bull.core), n0(B.core), n0(parts.bear.core), n0(B.core / shares)],
      ['ARACT (lithium-ion)', 'Book at Sep-27E × 1 / 1 / 0.5, less PV of losses to breakeven', n0(parts.bull.aract), n0(B.aract), n0(parts.bear.aract), n0(B.aract / shares)],
      ['Other subsidiaries', 'Book (Mar-26): ARCSPL, ARPSL, ARBME', n0(otherVal), n0(otherVal), n0(otherVal), n0(otherVal / shares)],
      { hl: true, cells: ['**Equity value**', '', `**${n0(Object.values(parts.bull).reduce((s, x) => s + x, 0))}**`, `**${n0(Object.values(B).reduce((s, x) => s + x, 0))}**`, `**${n0(Object.values(parts.bear).reduce((s, x) => s + x, 0))}**`, `**${n0(sumB)}**`] },
      { hl: true, cells: ['**12-month target (rounded)**', `${shares.toFixed(2)} cr shares`, '**{{scen.bull.tp|inr}}**', '**{{dcf.tp|inr}}**', '**{{scen.bear.tp|inr}}**', '{{dcf.upside|chg}} vs CMP'] },
    ], source: 'GAM Research; ARE&M.ctx.js. No net cash line: the parent had ~₹156 cr of net debt at Mar-26 and its interest cost and income are inside EPS.' } },
    { h: `Our core multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the core multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E, house series', `Price ÷ next full-year reported EPS since Apr-2021: median ${n1(FM.median)}x (all points ${n1(FM.medianAll)}x); no trough years. Reported FY25-26 EPS includes insurance income (₹4.5 and ₹10.6 a share) and FY23 a fire charge`, 'Distorted by one-offs'],
      ['2. One-offs removed (PLAYBOOK §4)', `On EPS before exceptional items (FY23 ₹44.9, FY25 ₹48.1, FY26 ₹42.4), whole-stock median since Apr-2021 ${n1(adjMed)}x; 25th percentile ${n1(adjP25())}x`, `Whole stock: ${n1(adjMed)}x (used for the P/E cross-check)`],
      ['3. Core only (used)', `The price also carries the subsidiaries (₹${n1(X.invNow)} a share at book by Aug-2026; ~nil before FY23). Price less subsidiaries at book, ÷ next-year EPS before one-offs, since Apr-2021: median ${n1(coreMed)}x, 25th-75th percentile ${n1(coreP25)}-${n1(coreP75)}x. By forward year: ${buckets.map(x => `${x.fy} ${n1(x.med)}x`).join(', ')}`, `**Starting point: ${n1(coreMed)}x** (subsidiaries at cost: ${n1(atCost.med)}x)`],
      ['4. Sector de-rating', `Auto-component peers and Exide, trailing P/E on ${ASOF_TXT} vs five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc1(sectorDr)}. Excluded: ${EXCL.map(s => `${shortName(s)} (${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join('; ')}; with them ${pc1(sectorDrAll)}. Amara Raja itself (${pc1(derate['ARE&M'])}) is not used`, `× ${k.toFixed(3)}`],
      ['5. Growth vs the street', `The street's 12-18x come with FY26-28E EPS growth of ~15-25% a year from their adjusted FY26 bases; ours is ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E from EPS before one-offs`, 'No adjustment (§7c); see sensitivity'],
      ['6. Peers', `Exide (the only listed lead-acid peer) ${n1(P.EXIDEIND.pe)}x trailing vs its five-year median ${n1(MED5.EXIDEIND)}x; Amara Raja ${n1(P['ARE&M'].pe)}x vs ${n1(MED5['ARE&M'])}x; auto-component median ${n1(peerPe)}x`, `Amara Raja trades ~${Math.round((1 - P['ARE&M'].pe / P.EXIDEIND.pe) * 100)}% below Exide on trailing P/E; supports a low-to-mid-teens core multiple`],
      ['7. Result (nearest half-turn)', `${n1(coreMed)}x × ${k.toFixed(3)} = ${n1(coreMed * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(coreEps)}**`],
      ['8. Bull / bear', `Bull: no de-rating (${n1(coreMed)}x). Bear: 25th percentile, de-rated (${n1(coreP25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; subsidiaries' book value from Form AOC-1; tools/authoring/valuation-blend.js forwardMedian; GAM estimates for FY27-29E EPS` } },
    { callout: `**Why the stock looks cheap on our numbers.** At ₹${n0(price)} the core (price less ₹${n0(X.invNow)} of subsidiaries) trades at ${n1(X.coreNowSep)}x Sep-28E EPS, the bottom of its own five-year range (25th percentile ${n1(coreP25)}x), after a ~22% fall from mid-August. Our ${MULT.base}x sits inside the brokers' 12-18x and below the stock's own median; the upside comes from the price, not from generous assumptions. With the core at Anand Rathi's 12x the target would be ~₹${tpWith((12 - MULT.base) * coreEps * shares)} (${X.pc1((r10(sumB + (12 - MULT.base) * coreEps) / price - 1) * 100)}).` },
    { pair: [
      { type: 'line', title: `Core forward P/E since Apr-2021: median ${n1(coreMed)}x`, unit: 'Core price ÷ next full-year EPS before one-offs (x)', x: X.coreSeries.map(x => x[0]), series: [{ name: 'Core forward P/E', values: X.coreSeries.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: coreMed, text: `Median ${n1(coreMed)}x`, color: '#8c8c8c' }], source: 'Screener.in prices; GAM adjustments (subsidiaries per share at book, EPS before exceptional items)' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['SOTP (target)', 'P/E on standalone EPS', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('sotp').value), Math.round(mv('pe').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'SOTP (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**Sum of the parts**', '**Target**', 'Core + ARACT + other subsidiaries', `core ${MULT.base}x`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['P/E on standalone EPS', 'Cross-check', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${peMULT.base}x (bull ${peMULT.bull}x, bear ${peMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('pe').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-37E, Ke {{dcf.ke|n1}}%, g 5.5%, + net liquid funds and subsidiaries at cost', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** P/E on all standalone EPS (${peMULT.base}x: the whole-stock median of ${n1(adjMed)}x less the same de-rating) gives ₹${n0(mv('pe').value)}: it leaves ARACT and the other subsidiaries to the multiple, which priced them when they were small. The DCF gives ₹${n0(mv('dcf').value)}: the core's free cash flow at a ${n1(V.ke)}% cost of equity and 5.5% terminal growth plus the subsidiaries at cost (₹${n0(V.netCash)} cr of "net cash and investments" at Mar-27E); it sits above the SOTP because it counts ARACT at cost and the margin fades up to 12.5%. All three sit well above the share price.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Target (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, street multiples, peer sub-sets, growth and returns views are shown, not added to the base.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Core ${MULT.bull}x (no de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; core ${MULT.base}x Sep-28E EPS; ARACT breakeven FY30E.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Core ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary (standalone)', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-37E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value (lead-acid)', '{{dcf.ev|num}}'],
      ['Add: net liquid funds and investments in subsidiaries at cost (Mar-27E)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Ten-year FCFF; the cost of equity is the discount rate (debt is negligible).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers: Exide and auto components', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'ARE&M' ? '**Amara Raja (standalone financials; P/E as shown by Screener)**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : '') + (p.symbol === 'EXIDEIND' ? ' (standalone)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : 'Dec year', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.pe != null ? n1(p.pe) : '–', derate[p.symbol] != null ? pc(derate[p.symbol]) : 'n.a.', p.evEbitda != null ? n1(p.evEbitda) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Schaeffler reports on December years.` } },
  ],
};

function adjP25() { return X.adjP25; }

module.exports = { street, valuation };
