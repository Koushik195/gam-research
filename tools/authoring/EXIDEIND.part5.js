// Exide report, part 5: the street and the valuation (sum of the parts: core P/E on Sep-28E standalone EPS, HDFC Life at
// market less a discount, EESL at book less PV of losses, other investments at book; P/E and DCF cross-checks).
const X = require('./EXIDEIND.ctx');
const { D, F, V, n0, n1, pc, pc1, price, mv, FM, adjMed, coreMed, coreP25, coreP75, buckets, sectorDr, sectorDrAll, sectorDrExAre, k, derate, P, PEERS, USED, EXCL, shortName,
  atCost, MULT, peMULT, epsSep, rating, ST, postQ1, medTp, shortDate, ASOF_TXT, medOf, shares, hdfcDivPS, parts, eesl, hdfcMV, hdfcVal, DISC, otherVal, BL, half } = X;
const r10 = v => Math.round(v / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc1(derate[s])}`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const B = parts.base, sumB = (B.core + B.hdfc + B.eesl + B.other) / shares, coreEps = epsSep.base - hdfcDivPS;
const tpWith = d => n0(r10(sumB + d / shares));
const peerPe = medOf(USED.map(s => P[s].pe));

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street after Q1: four Buys, one Neutral, one Sell; median target ₹${n0(medTp)}`,
  blocks: [
    { p: `Six houses updated after the Q1FY27 results (3/4-Aug-2026): Buy from ICICI Securities (₹520), J.P. Morgan (₹514), Citi (₹510) and Nomura (₹492), Neutral from Motilal Oswal (₹419) and Sell from Kotak (₹325). The median target is ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}; the stock had traded at ~₹450 in early August. The two houses that publish their method both use a **sum of the parts**: the core on FY28E standalone EPS (16x MOFSL, 18x ICICI), the lithium-ion plant at book or invested capital (₹82 and ₹70 a share) and the HDFC Life stake separately (₹45; ICICI ₹90 a share including other subsidiaries). Before Q1, Nuvama had cut to Reduce (₹300) on cost pressure. The bulls focus on the OEM-led cycle and the cell plant starting up; the bears on returns from lithium.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(r => [rup(r)]), source: 'Broker notes as cited; company calls; GAM Research' } },
  ],
};

const coreAt = s => { const m = String(s.multiple).match(/(\d+(?:\.\d+)?)x/); return m && s.method === 'SOTP' ? n0(+m[1] * (F.eps[1] - hdfcDivPS)) : '–'; };
const sens = [
  ['Core at MOFSL\'s 16x', `16x vs ${MULT.base}x on Sep-28E core EPS ₹${n1(coreEps)}`, tpWith((16 - MULT.base) * coreEps * shares)],
  ['Core at ICICI Securities\' 18x', `18x vs ${MULT.base}x`, tpWith((18 - MULT.base) * coreEps * shares)],
  ['No sector de-rating', `${MULT.bull}x (own core median, nearest half-turn)`, tpWith((MULT.bull - MULT.base) * coreEps * shares)],
  ['Sector move with all peers / without Amara Raja', `${pc1(sectorDrAll)} → ${half(coreMed * (1 + sectorDrAll / 100))}x; ${pc1(sectorDrExAre)} → ${half(coreMed * (1 + sectorDrExAre / 100))}x`, `${tpWith((half(coreMed * (1 + sectorDrAll / 100)) - MULT.base) * coreEps * shares)} / ${tpWith((half(coreMed * (1 + sectorDrExAre / 100)) - MULT.base) * coreEps * shares)}`],
  ['Lithium plant at cost (not book) in the core-P/E history', `Core median ${n1(atCost.med)}x (vs ${n1(coreMed)}x) × ${k.toFixed(3)} → ${atCost.mult}x (vs ${MULT.base}x)`, `${n0(atCost.tp)} (${pc1(atCost.upside)}: ${atCost.rating} under our rule)`],
  ['EESL at 1x invested capital (street style)', `₹6,202 cr (₹4,802 cr at Mar-26 + ₹1,400 cr FY27) vs our ₹${n0(eesl.base.value)} cr`, tpWith(6202 - eesl.base.value)],
  ['HDFC Life at full market value', `₹${n0(hdfcMV)} cr vs ₹${n0(hdfcVal.base)} cr`, tpWith(hdfcMV - hdfcVal.base)],
  ['Growth premium', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E vs ~${Math.round(X.epsCagrHist)}% FY21-26: partly a margin recovery and cash interest, not a better business`, 'not applied'],
  ['Returns', 'Core ROCE is high, but group ROE ~8-10% (forecast) stays below the 12.5% cost of equity while EESL is loss-making', 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: sum of the parts gives {{dcf.tp|inr}}; the core at ${MULT.base}x Sep-28E EPS`,
  blocks: [
    { h: 'How the street values Exide' },
    { p: 'We use the street\'s method so our target is comparable: the lead-acid business on P/E (on Sep-28E: half FY28E, half FY29E standalone EPS) plus the investments separately. "Core at our EPS" applies each broker\'s core multiple to our FY28E standalone EPS (before the HDFC Life dividend).' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Core multiple', 'On', 'Core at our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple, s.on, coreAt(s), rup(s.parts ? `${s.parts}. ${s.thesis}` : s.thesis)]),
      ...D.street.earlier.map(([br, d, r, tp, m]) => [`${br} (${shortDate(d)}, earlier)`, r, n0(tp), m, '–', '–', '–', 'Pre-Q1 view']),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**SOTP**', `**${MULT.base}x core**`, '**Sep-28E**', `**${n0(MULT.base * (F.eps[1] - hdfcDivPS))}**`, 'Good core, fairly priced; the lithium plant valued at book less losses to come'] },
    ], source: 'MOFSL (3-Aug-2026) and ICICI Securities (4-Aug-2026) PDFs; Citi, Nomura, J.P. Morgan, Kotak via aggregators (askfuzz.ai, investing.com); earlier views via Trendlyne and Business Today' } },
    { h: 'The sum of the parts' },
    { exhibit: { type: 'table', title: 'Sum of the parts (₹ crore unless stated)', head: ['Part', 'Basis', 'Bull', 'Base', 'Bear', 'Base ₹/share'], wide: [1], rows: [
      ['Lead-acid core', `Sep-28E standalone EPS less HDFC Life dividend: ₹${n1(epsSep.bull - hdfcDivPS)} / ₹${n1(coreEps)} / ₹${n1(epsSep.bear - hdfcDivPS)} × ${MULT.bull}x / ${MULT.base}x / ${MULT.bear}x`, n0(parts.bull.core), n0(B.core), n0(parts.bear.core), n0(B.core / shares)],
      ['HDFC Life stake', `Market value ₹${n0(hdfcMV)} cr less ${DISC.bull}% / ${DISC.base}% / ${DISC.bear}%`, n0(parts.bull.hdfc), n0(B.hdfc), n0(parts.bear.hdfc), n0(B.hdfc / shares)],
      ['EESL (lithium-ion)', 'Book at Sep-27E × 1 / 1 / 0.5, less PV of losses to breakeven', n0(parts.bull.eesl), n0(B.eesl), n0(parts.bear.eesl), n0(B.eesl / shares)],
      ['Other investments', 'Book (Mar-26)', n0(otherVal), n0(otherVal), n0(otherVal), n0(otherVal / shares)],
      { hl: true, cells: ['**Equity value**', '', `**${n0(Object.values(parts.bull).reduce((s, x) => s + x, 0))}**`, `**${n0(Object.values(B).reduce((s, x) => s + x, 0))}**`, `**${n0(Object.values(parts.bear).reduce((s, x) => s + x, 0))}**`, `**${n0(sumB)}**`] },
      { hl: true, cells: ['**12-month target (rounded)**', `${shares.toFixed(2)} cr shares`, '**{{scen.bull.tp|inr}}**', '**{{dcf.tp|inr}}**', '**{{scen.bear.tp|inr}}**', '{{dcf.upside|chg}} vs CMP'] },
    ], source: 'GAM Research; EXIDEIND.ctx.js. No net cash line: the standalone company has ~₹420 cr of liquid funds (all needed for EESL in FY27) and its interest is inside EPS.' } },
    { h: `Our core multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the core multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E, house series', `Price ÷ next full-year reported EPS since Apr-2021: median ${n1(FM.median)}x (all points ${n1(FM.medianAll)}x). Distorted: FY22 EPS of ₹55 includes the Exide Life gain, which puts the Apr-2021 to Mar-2022 points at ~4-8x and makes FY23-25 look like "trough years" (${FM.troughYears.join(', ')} left out)`, 'Not usable as it stands'],
      ['2. One-offs removed (PLAYBOOK §4)', `On EPS before the FY22 gain (₹10.0) and the FY26 labour-code charge, the whole-stock median since Apr-2021 is ${n1(adjMed)}x; no trough years`, `Whole stock: ${n1(adjMed)}x (used for the P/E cross-check)`],
      ['3. Core only (used)', `The share price also carries the HDFC Life stake and EESL. Price less HDFC Life at market (−${DISC.base}%) and EESL at book, ÷ next-year EPS less the HDFC Life dividend, since the sale closed (Jan-2022): median ${n1(coreMed)}x, 25th-75th percentile ${n1(coreP25)}-${n1(coreP75)}x. By forward year: ${buckets.map(x => `${x.fy} ${n1(x.med)}x`).join(', ')}`, `**Starting point: ${n1(coreMed)}x** (EESL at cost instead: ${n1(atCost.med)}x)`],
      ['4. Sector de-rating', `Auto-component peers and Amara Raja, trailing P/E on ${ASOF_TXT} vs five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc1(sectorDr)}. Excluded: ${EXCL.map(s => `${shortName(s)} (${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join('; ')}; with them ${pc1(sectorDrAll)}. Exide itself is not used`, `× ${k.toFixed(3)}`],
      ['5. Growth vs the street', `MOFSL's 16x and ICICI's 18x core come with FY26-28E EPS growth of ~17-23% a year; ours is ~${Math.round(X.epsCagrFwd)}% over FY26-29E`, 'No adjustment (§7c); see sensitivity'],
      ['6. Peers', `Amara Raja (the only listed lead-acid peer) ${n1(P['ARE&M'].pe)}x trailing vs its five-year median ${n1(X.MED5['ARE&M'])}x; auto-component median ${n1(peerPe)}x`, 'Supports a mid-to-high-teens core multiple'],
      ['7. Result (nearest half-turn)', `${n1(coreMed)}x × ${k.toFixed(3)} = ${n1(coreMed * k)}x`, `**${MULT.base}x Sep-28E core EPS of ₹${n1(coreEps)}**`],
      ['8. Bull / bear', `Bull: no de-rating (${n1(coreMed)}x). Bear: 25th percentile, de-rated (${n1(coreP25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; HDFC Life prices (Screener.in); EESL book from Form AOC-1; tools/authoring/valuation-blend.js forwardMedian; GAM estimates for FY27-28E EPS` } },
    { callout: `**Why book, and why it matters.** In the core-P/E history we subtract EESL at book value (equity put in less losses so far), because that is how the plant is valued in the sum of the parts; mixing cost in the history with book in the target would count its losses twice. At cost the history gives ${n1(atCost.med)}x, a ${atCost.mult}x core multiple and a target of ~₹${n0(atCost.tp)} (${pc1(atCost.upside)}, ${atCost.rating} under our rule): the rating sits close to the HOLD/SELL line.` },
    { pair: [
      { type: 'line', title: `Core forward P/E since Jan-2022: median ${n1(coreMed)}x`, unit: 'Core price ÷ next full-year core EPS (x)', x: X.coreSeries.map(x => x[0]), series: [{ name: 'Core forward P/E', values: X.coreSeries.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: coreMed, text: `Median ${n1(coreMed)}x`, color: '#8c8c8c' }], source: 'Screener.in prices; GAM adjustments (investments per share, EPS before one-offs)' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['SOTP (target)', 'P/E on standalone EPS', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('sotp').value), Math.round(mv('pe').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'SOTP (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**Sum of the parts**', '**Target**', 'Core + HDFC Life + EESL + other', `core ${MULT.base}x`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['P/E on standalone EPS', 'Cross-check', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${peMULT.base}x (bull ${peMULT.bull}x, bear ${peMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('pe').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-37E, Ke {{dcf.ke|n1}}%, g 5.5%, + investments at book', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** P/E on all standalone EPS (${peMULT.base}x: the whole-stock median of ${n1(adjMed)}x less the same de-rating) gives ₹${n0(mv('pe').value)}: it leaves EESL and HDFC Life to the multiple, which priced them in the past but now has to carry a bigger, loss-making plant. The DCF gives ₹${n0(mv('dcf').value)}: the core's free cash flow at a ${n1(V.ke)}% cost of equity and 5.5% terminal growth plus liquid funds, HDFC Life at its Mar-26 fair value and EESL at cost (₹${n0(V.netCash)} cr at Mar-27E); valuing EESL at cost (not book less losses) and HDFC Life above today's price is why it sits above the SOTP. All three land within ~10% of each other and of the share price.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Target (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, street multiples, peer sub-sets, growth and returns views are shown, not added to the base.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Core ${MULT.bull}x (no de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; core ${MULT.base}x Sep-28E EPS; EESL breakeven FY30E.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Core ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary (standalone)', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-37E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value (lead-acid)', '{{dcf.ev|num}}'],
      ['Add: liquid funds, HDFC Life (Mar-26 fair value), EESL and other investments at cost, less leases (Mar-27E)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Ten-year FCFF; the cost of equity is the discount rate (no debt).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers: Amara Raja and auto components', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'EXIDEIND' ? '**Exide (standalone financials; P/E as shown by Screener)**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : 'Dec year', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.pe != null ? n1(p.pe) : '–', derate[p.symbol] != null ? pc(derate[p.symbol]) : 'n.a.', p.evEbitda != null ? n1(p.evEbitda) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Schaeffler reports on December years.` } },
  ],
};

module.exports = { street, valuation };
