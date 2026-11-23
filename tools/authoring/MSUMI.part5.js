// Motherson Sumi Wiring India report, part 5: the street and the valuation (P/E on Sep-28E EPS, multiple derived from the
// stock's own forward P/E history since listing and the auto-component de-rating; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./MSUMI.ctx');
const { D, F, V, n0, n1, n2, pc, pc1, price, mv, FM, fmP25, fmP75, allMed, firstQ, twoYr, buckets, sectorDr, sectorDrAll, sectorDrL, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, epsSep, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, rating, ST, postQ1, medTp, medTpAll, ASOF_TXT, medOf, half } = X;
const drTxt = s => `${shortName(s)} ${pc1(derate[s])}`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const peerPe = medOf(USED.map(s => P[s].pe));
const tpAt = m => n0(m * epsSep.base);
const sd = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}-${y.slice(2)}`; };
const ownDr = derate.MSUMI;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: Buy/Add, targets ₹44-50; post-Q1 median ₹${n0(medTp)}`,
  blocks: [
    { p: `Four houses updated after the Q1FY27 results (4-Aug-2026): Motilal Oswal (Buy, ₹48, 35x FY28E), Emkay (upgraded to Buy, ₹50, 30x Jun-28E), ICICI Securities (Buy, ₹50) and Choice (downgraded to Add, ₹44, on FY28E EPS). JM Financial\'s post-Q4 note (Buy, ₹48, 33x FY28E, Apr-2026) is the latest we found from JM. Post-Q1 median ₹${n0(medTp)} (${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n2(price)}); all five ₹${n0(medTpAll)}. The stock fell from ~₹40 at the results to ₹${n2(price)} by end-September. Every house that shows its method uses **P/E on one-year-forward EPS**, at 30-35x; their FY28E EPS (₹1.33-1.58) is mostly above ours.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes and company filings as cited; GAM Research' } },
  ],
};

const ourAt = s => { const m = String(s.multiple).match(/(\d+(?:\.\d+)?)x/); return s.method === 'P/E' && m ? n0(+m[1] * epsSep.base) : '–'; };
const sens = [
  ['Sector move over the same window as MSWIL\'s own history (peers vs their medians since Apr-2022)', `${pc1(sectorDrL)} instead of ${pc1(sectorDr)}: ${n1(FM.median)}x → ${half(FM.median * (1 + sectorDrL / 100))}x`, tpAt(half(FM.median * (1 + sectorDrL / 100)))],
  ['Sector de-rating including all peers', `${pc1(sectorDrAll)} instead of ${pc1(sectorDr)}`, tpAt(half(FM.median * (1 + sectorDrAll / 100)))],
  ['Only the last two years (since Oct-2024)', `Forward P/E median ${n1(twoYr)}x, de-rated ${n1(twoYr * k)}x`, tpAt(half(twoYr * k))],
  ['MSWIL\'s own de-rating instead of the sector\'s (not allowed by §7c)', `Trailing P/E ${pc1(ownDr)} vs its median since listing: ${n1(FM.median)}x → ${half(FM.median * (1 + ownDr / 100))}x`, tpAt(half(FM.median * (1 + ownDr / 100)))],
  ['Street multiple (MOSL 35x FY28E)', '35x on our Sep-28E EPS', tpAt(35)],
  ['Lowest street multiple (Emkay 30x)', '30x on our Sep-28E EPS', tpAt(30)],
  ['Street EPS at our multiple', `${MULT.base}x on the post-Q1 street-median FY28E EPS (₹${n2(X.medEps('FY28E'))})`, n0(MULT.base * X.medEps('FY28E'))],
  ['Growth premium (PEG-style)', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E vs ~${Math.round(X.epsCagrHist)}% FY22-26: more growth than the history paid for, but it is margin recovery, not new demand`, 'not applied'],
  ['Returns premium', 'ROCE ~40% vs a 12.2% cost of equity, the same as through the history: no change to justify a different multiple', 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(X.sepNow)}x`,
  blocks: [
    { h: 'How the street values MSWIL' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our Sep-28E EPS.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${sd(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple, s.on, ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Growth above the market continues; margins recover only partly; the price already discounts a permanent squeeze'] },
    ], source: 'MOSL (4-Aug-2026), Choice, Emkay (5-Aug-2026) result updates; ICICI Securities from the Trendlyne listing (5-Aug-2026, note not read); JM Financial (28-Apr-2026). Earlier: MOSL ₹46 and ICICI Securities ₹50 (Apr-2026), Emkay ₹45 at 30x Mar-28E (29-Apr-2026)' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (used)', `Price ÷ next full-year EPS since listing (28-Mar-2022): median ${n1(FM.median)}x (all weekly closes: ${n1(allMed)}x), 25th-75th percentile ${n1(fmP25)}-${n1(fmP75)}x; no trough years. Listing-premium check: the first three months traded at ${n1(Math.min(...firstQ))}-${n1(Math.max(...firstQ))}x, below the median, so no months are skipped. By forward year: ${buckets.map(x => `${x.fy} ${n1(x.med)}x`).join(', ')}`, `**Starting point: ${n1(FM.median)}x**`],
      ['2. One-offs', 'The only exceptional item (FY22 reorganisation costs) falls in a year that is never the forward year inside the window', 'No adjustment'],
      ['3. Sector de-rating', `Auto-component peers\' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc1(sectorDr)}. Excluded as distorted: ${EXCL.map(s => `${shortName(s)} (${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join('; ')}; with them ${pc1(sectorDrAll)}. MSWIL itself (${pc1(ownDr)} vs its median since listing) is not used`, `× ${k.toFixed(3)}`],
      ['4. Growth vs the street', `MOSL\'s 35x and JM\'s 33x come with FY26-28E EPS growth of ~20-24% a year; ours is ~${Math.round(X.epsCagrFwd)}% over FY26-29E`, 'No adjustment (§7c); see sensitivity'],
      ['5. Peers', `Peer median trailing P/E ${n1(peerPe)}x; MSWIL ${n1(P.MSUMI.pe)}x trailing with ROCE ~40%`, 'MSWIL trades below most peers: no extra signal'],
      ['6. Result (nearest half-turn)', `${n1(FM.median)}x × ${k.toFixed(3)} = ${n1(FM.median * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n2(epsSep.base)}**`],
      ['7. Bull / bear', `Bull: no de-rating (${n1(FM.median)}x). Bear: 25th-percentile forward P/E, de-rated (${n1(fmP25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; tools/authoring/valuation-blend.js forwardMedian (from listing); GAM estimates for FY27-28E EPS in the forward series` } },
    { pair: [
      { type: 'line', title: `Forward P/E since listing: median ${n1(FM.median)}x; ${n1(X.fwdNow)}x FY28E now`, unit: 'Price ÷ next full-year EPS (x)', x: X.allWk.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.allWk.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: FM.median, text: `Median ${n1(FM.median)}x`, color: '#8c8c8c' }], source: 'Screener.in weekly prices and EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, Math.round(price)], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n2(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|n1}}**', '–', '{{scen.bull.blend.methods.0.value|n1}}', '{{scen.bear.blend.methods.0.value|n1}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr less net debt incl. leases`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|n1}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|n1}}', '{{scen.bear.blend.methods.1.value|n1}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|n1}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|n1}}', '{{scen.bear.blend.methods.2.value|n1}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA less net debt) gives ₹${n0(mv('ev').value)}, ${pc(mv('ev').vsTarget)} vs the target: ${evMULT.base}x is MSWIL\'s ${n1(evMed)}x median trailing EV/EBITDA since listing, cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating and restated from trailing (₹${n0(ttmEbitda)} cr in the year to Jun-26) to Sep-28E EBITDA (× ${evConv.toFixed(3)}); it is lower because our EBITDA recovery is slower than our EPS recovery (depreciation and interest are small). The DCF gives ₹${n0(mv('dcf').value)}, below the price, at a ${n1(V.ke)}% cost of equity, 6% terminal growth and a 9.5% long-run margin: the market, like the house rule, is pricing either faster growth for longer or a lower cost of capital. **The BUY rests on the multiple returning towards MSWIL\'s own history, not on cash-flow value**; the honest caveat is that the history was built when margins were 11-13%.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, own de-rating, own-history windows, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Net cash at Mar-27 (negative = net debt incl. leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|n1}}'],
      { hl: true, cells: ['**12-month DCF value (rolled forward 6 months at Ke)**', '**₹{{dcf.blend.methods.2.value|n1}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Debt is almost all lease liabilities, so the cost of equity is the discount rate. Lease payments are not in free cash flow (the engine treats leases as debt).' } },
    { callout: "The engine's DCF sensitivity grid rounds every value to the nearest ₹10, too coarse for a ₹34 stock, so we do not show it as a table: across a cost of equity of 11.2-13.2% and terminal growth of 5-7% it runs from ~₹20 to ~₹40 a share. No combination in that range reaches the {{dcf.tp|inr}} target or much exceeds today's price." },
    { exhibit: { type: 'table', title: 'Listed auto-component peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'MSUMI' ? '**Motherson Sumi Wiring**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : 'Dec year', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.pe != null ? n1(p.pe) : '–', derate[p.symbol] != null ? pc(derate[p.symbol]) : 'n.a.', p.evEbitda != null ? n1(p.evEbitda) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Schaeffler reports on December years. MSWIL's median is since listing (Mar-2022).` } },
  ],
};

module.exports = { street, valuation };
