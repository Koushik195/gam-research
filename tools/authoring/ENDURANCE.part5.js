// Endurance Technologies report, part 5: the street and the valuation (P/E on Sep-28E EPS, multiple derived from the
// stock's own forward P/E history and the auto-component de-rating; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./ENDURANCE.ctx');
const { D, F, V, n0, n1, pc, pc1, price, mv, FM, fmP25, fmP75, adjMed, twoYr, buckets, sectorDr, sectorDrAll, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, epsSep, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, rating, ST, postQ1, medTp, medTpAll, ASOF_TXT, medOf } = X;
const r10 = v => Math.round(v / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc1(derate[s])}`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const peerPe = medOf(USED.map(s => P[s].pe));
const sd = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}-${y.slice(2)}`; };

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: Buy, targets ₹2,880-3,380; post-Q1 median ₹${n0(medTp)}`,
  blocks: [
    { p: `Two houses published full updates after the Q1FY27 results (13-Aug-2026): Motilal Oswal (Buy, ₹3,350, 32x FY28E) and Choice Institutional (upgraded to Buy, ₹3,380, 30x FY28E). Earlier targets still standing on ${ASOF_TXT}: Geojit (Accumulate, ₹3,000, Jun-2026) and Axis Securities (Buy, ₹2,880, May-2026). Post-Q1 median ₹${n0(medTp)} (${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}); all four ₹${n0(medTpAll)}. The stock fell from ~₹2,900 in mid-August to ₹${n0(price)} by the end of September. Every house that shows its method uses **P/E on one-year-forward EPS**, and the multiples (30-32x) are close to ours; the difference is EPS: the brokers have FY28E EPS of ₹105-113, 16-25% above ours.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes and company calls as cited; GAM Research' } },
  ],
};

const ourAt = s => { const m = String(s.multiple).match(/(\d+(?:\.\d+)?)x/); return s.method === 'P/E' && m ? n0(r10(+m[1] * epsSep.base)) : '–'; };
const sens = [
  ['Own median on EPS before exceptional items', `${n1(adjMed)}x × ${k.toFixed(3)} = ${n1(adjMed * k)}x`, n0(r10(X.half(adjMed * k) * epsSep.base))],
  ['Only the last two years (since Oct-2024)', `Forward P/E median ${n1(twoYr)}x, de-rated ${n1(twoYr * k)}x`, n0(r10(X.half(twoYr * k) * epsSep.base))],
  ['No sector de-rating', `${MULT.bull}x on base EPS`, n0(r10(MULT.bull * epsSep.base))],
  ['Sector de-rating including all peers', `${pc1(sectorDrAll)} instead of ${pc1(sectorDr)}`, n0(r10(X.half(FM.median * (1 + sectorDrAll / 100)) * epsSep.base))],
  ['Street multiple (MOSL 32x FY28E)', '32x on our Sep-28E EPS', n0(r10(32 * epsSep.base))],
  ['Street EPS at our multiple', `${MULT.base}x on the street-median FY28E EPS (₹${n1(X.medEps('FY28E'))})`, n0(r10(MULT.base * X.medEps('FY28E')))],
  ['Growth premium (PEG-style)', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E, close to the ~${Math.round(X.epsCagrHist)}% of FY21-26 that the median already paid for`, 'not applied'],
  ['Returns premium', 'ROE ~15% forecast, the same as FY24-26 (14.5-15.6%): no change in returns to justify a higher multiple', 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(X.sepNow)}x`,
  blocks: [
    { h: 'How the street values Endurance' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our Sep-28E EPS.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${sd(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple, s.on, ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Real content growth in India, little in Europe; margins recover only partly; the price already pays the stock\'s own historical multiple'] },
    ], source: 'MOSL and Choice result updates (14-Aug-2026); Geojit and Axis targets from Trendlyne listings (23-Jun-2026, 18-May-2026); earlier: Choice 27x FY28E (16-May-2026), JM Financial initiation ₹3,435 (Oct-2025)' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (used)', `Price ÷ next full-year EPS (reported) since Apr-2021: median ${n1(FM.median)}x, 25th-75th percentile ${n1(fmP25)}-${n1(fmP75)}x; no trough years (no forward EPS below half the prior three-year peak). By forward year: ${buckets.map(x => `${x.fy} ${n1(x.med)}x`).join(', ')}`, `**Starting point: ${n1(FM.median)}x**`],
      ['2. One-offs', `On EPS before exceptional items the median is ${n1(adjMed)}x: exceptional items are 1-7% of profit and change sign, so we keep reported EPS (PLAYBOOK §4)`, 'Sensitivity only'],
      ['3. Sector de-rating', `Auto-component peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc1(sectorDr)}. Excluded as distorted: ${EXCL.map(s => `${shortName(s)} (${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join('; ')}; with them ${pc1(sectorDrAll)}. Endurance itself (${pc1(derate.ENDURANCE)}) is not used`, `× ${k.toFixed(3)}`],
      ['4. Growth vs the street', `MOSL's 32x and Choice's 30x FY28E come with FY26-28E EPS growth of ~23-28% a year; ours is ~${Math.round(X.epsCagrFwd)}% over FY26-29E`, 'No adjustment (§7c); see sensitivity'],
      ['5. Peers', `Peer median trailing P/E ${n1(peerPe)}x; Endurance ${n1(P.ENDURANCE.pe)}x trailing, below most peers despite net cash`, 'Endurance already trades at a discount to peers: no extra signal'],
      ['6. Result (nearest half-turn)', `${n1(FM.median)}x × ${k.toFixed(3)} = ${n1(FM.median * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}**`],
      ['7. Bull / bear', `Bull: no de-rating (${n1(FM.median)}x). Bear: 25th-percentile forward P/E, de-rated (${n1(fmP25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; tools/authoring/valuation-blend.js forwardMedian; GAM estimates for FY27-28E EPS in the forward series` } },
    { pair: [
      { type: 'line', title: `Forward P/E since 2021: median ${n1(FM.median)}x`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Forward P/E', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: FM.median, text: `Median ${n1(FM.median)}x`, color: '#8c8c8c' }], source: 'Screener.in prices and EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr plus net cash`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA plus net cash) gives ₹${n0(mv('ev').value)}, close to the target: ${evMULT.base}x is Endurance's ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating and restated from trailing (₹${n0(ttmEbitda)} cr in the year to Jun-26) to Sep-28E EBITDA (× ${evConv.toFixed(3)}). The DCF gives ₹${n0(mv('dcf').value)} at a ${n1(V.ke)}% cost of equity and 6% terminal growth, well below the price: like most Indian auto-component stocks, Endurance trades on growth that lasts well beyond 15 years at margins near today's, and on a lower cost of capital than our 12.5%.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, own-history windows, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Plus: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Net cash company: the cost of equity is the discount rate. The Stöferle deferred consideration (~₹246 cr) is not deducted (the engine has no line for it): ~₹17 a share.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed auto-component peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'ENDURANCE' ? '**Endurance**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : 'Dec year', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.pe != null ? n1(p.pe) : '–', derate[p.symbol] != null ? pc(derate[p.symbol]) : 'n.a.', p.evEbitda != null ? n1(p.evEbitda) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Schaeffler reports on December years.` } },
  ],
};

module.exports = { street, valuation };
