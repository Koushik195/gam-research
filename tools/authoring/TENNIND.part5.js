// Tenneco Clean Air India report, part 5: the street and the valuation (P/E on Sep-28E EPS; multiple derived from the
// stock's own forward P/E since listing and the auto-component peers' move over the same window; EV/EBITDA and DCF
// cross-checks; scenarios; peers).
const X = require('./TENNIND.ctx');
const { D, F, V, S, n0, n1, n2, pc, pc1, price, mv, PEL, PEA, PEB, PEX, FM, firstWeeks, sectorL, sectorLAll, sector5, k, k5, drL, dr5, MEDL, P, PEERS, USED, EXCL, shortName,
  MULT, ALT, epsSep, evMed, evP25, evMULT, rest, ttmEbitda, ebitdaSep28, rating, ST, latest, medTp, ASOF, ASOF_TXT, LISTED, medOf, half, trailPe } = X;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const sd = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}-${y.slice(2)}`; };
const tpAt = m => n0(m * epsSep.base);
const drTxt = s => `${shortName(s)} ${pc1(drL[s])}`;
const ownTrail = S.charts.pe['Price to Earning'].filter(([d, x]) => d >= LISTED && d <= ASOF && x > 0).map(x => x[1]);
const ownTrailMed = medOf(ownTrail), ownMove = (trailPe / ownTrailMed - 1) * 100;
const peerPe = medOf(USED.map(s => P[s].pe));
const months = ((new Date(ASOF) - new Date(LISTED)) / 2.63e9).toFixed(1);
const jm = ST.find(s => s.broker === 'JM Financial' && s.current);

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: all Buy, targets ₹650-680; median ₹${n0(medTp)}`,
  blocks: [
    { p: `Coverage started after the IPO quiet period. JM Financial initiated on 7-Jan-2026 (Buy, ₹610, 28x FY28E) and moved to ₹680 at 29x FY28E after Q4FY26 (3-Jun-2026); Citi initiated on 1-Apr-2026 (Buy, ₹650); Axis Capital raised its target to ₹660 after Q4FY26; Motilal Oswal initiated on 15-Sep-2026 (Buy, ₹673, 30x Sep-28E). We found no note updated after the Q1FY27 results (6-Aug-2026) other than Motilal Oswal's initiation. Median of the latest targets ₹${n0(medTp)} (${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n2(price)}). Every house that shows its method uses **P/E on one-year-forward EPS** at 28-30x.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], wide: [0], rows: D.critiques.map(r => [rup(r)]), source: 'Broker notes and company filings as cited; GAM Research' } },
  ],
};

const ourAt = s => { const m = String(s.multiple).match(/(\d+(?:\.\d+)?)x/); return s.method === 'P/E' && m ? n0(+m[1] * epsSep.base) : '–'; };
const sens = [
  ['Five-year sector move instead of the same-window move', `Peers vs their five-year medians ${pc1(sector5)} instead of ${pc1(sectorL)}: ${n1(PEL.med)}x → ${ALT.five}x`, tpAt(ALT.five)],
  ['Only the months valued on FY28E (Apr-Sep 2026)', `Own forward median ${n1(PEA.med)}x (Nov-25 to Mar-26 on FY27E: ${n1(PEB.med)}x) → ${ALT.fy28only}x`, tpAt(ALT.fy28only)],
  ['Skip the listing weeks (calendar 2026 only)', `Own median ${n1(PEX.med)}x → ${ALT.cal26}x`, tpAt(ALT.cal26)],
  ['Sector move including Bharat Forge and Gabriel', `${pc1(sectorLAll)} (vs ${pc1(sectorL)} without them): no change`, tpAt(half(PEL.med * (1 + sectorLAll / 100)))],
  ['Tenneco\'s own move instead of the sector\'s (not allowed by §7c)', `Trailing P/E ${n1(trailPe)}x vs ${n1(ownTrailMed)}x median since listing (${pc1(ownMove)}): ${half(PEL.med * (1 + ownMove / 100))}x`, tpAt(half(PEL.med * (1 + ownMove / 100)))],
  ['Street multiple (Motilal Oswal 30x Sep-28E)', '30x on our Sep-28E EPS', tpAt(30)],
  ['Street EPS at our multiple', `${MULT.base}x on JM Financial's FY28E EPS (₹${n2(jm.eps.FY28E)})`, n0(MULT.base * jm.eps.FY28E)],
  ['Growth premium', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E vs ~${Math.round(X.epsCagrHist)}% FY23-26: similar to what the listing-period multiple already priced`, 'not applied'],
  ['Returns premium', 'ROE above 40% vs a 12.2% cost of equity; but returns are inflated by the pre-IPO payout and will fall as cash builds', 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(X.sepNow)}x`,
  blocks: [
    { h: 'How the street values Tenneco India' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our Sep-28E EPS.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${sd(s.date)})${s.current ? '' : ' – superseded'}`, s.rating, n0(s.tp), s.method, s.multiple, s.on, ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Ride control carries growth; exhaust re-accelerates from FY28; margin below the FY26 record; parent overhang'] },
    ], source: 'JM Financial (7-Jan-2026, 3-Jun-2026, reports read); Citi (Business Upturn, 1-Apr-2026); Axis Capital (Stockopedia; date inferred from the stated 15.7% upside to the 3-Jun-2026 close); Motilal Oswal (Business Today, 15-Sep-2026)' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c; recently listed)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Window', `Listed ${sd(LISTED)}: ${months} months of history to ${ASOF_TXT}, less than the 12 months used for other recent listings. We use the whole period, on every daily close (${PEL.n} points), and measure the sector over the same window. IPO-premium check: the listing weeks (Nov-Dec 2025) traded at a median ${n1(medOf(firstWeeks))}x forward, in line with the full-period median, and the price then (~₹485) was below its later range, so no months are skipped`, 'Window: listing to 30-Sep-2026'],
      ['2. Own forward P/E (used)', `Price ÷ next full-year EPS (FY27E to Mar-2026, FY28E from Apr-2026, our estimates): median ${n1(PEL.med)}x, 25th-75th percentile ${n1(PEL.p25)}-${n1(PEL.p75)}x, range ${n1(PEL.min)}-${n1(PEL.max)}x; no trough years. House forwardMedian (every 5th close): ${n1(FM.median)}x`, `**Starting point: ${n1(PEL.med)}x**`],
      ['3. One-offs', 'Labour-code charge (FY26) and Motocare income (Q1FY26) fall in FY26, which is never the forward year inside the window', 'No adjustment'],
      ['4. Sector move (same window)', `Auto-component peers' trailing P/E on ${ASOF_TXT} vs their medians since ${sd(LISTED)}: ${USED.map(drTxt).join(', ')}; median ${pc1(sectorL)}. Excluded: ${EXCL.map(s => `${shortName(s)} (${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join('; ')}; with them ${pc1(sectorLAll)}. Five-year medians (shown): ${pc1(sector5)}. Tenneco itself is not used`, `× ${k.toFixed(3)}`],
      ['5. Growth vs the street', `JM's 29x and Motilal Oswal's 30x come with higher EPS (JM FY28E ₹${n2(jm.eps.FY28E)} vs our ₹${n2(F.eps[1])})`, 'No adjustment (§7c); see sensitivity'],
      ['6. Peers', `Peer median trailing P/E ${n1(peerPe)}x; Tenneco ${n1(P.TENNIND.pe)}x with ROCE 61% (Screener)`, 'Tenneco trades well below most peers: no extra signal'],
      ['7. Result (nearest half-turn)', `${n1(PEL.med)}x × ${k.toFixed(3)} = ${n1(PEL.med * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n2(epsSep.base)}**`],
      ['8. Bull / bear', `Bull: no sector move (${n1(PEL.med)}x). Bear: 25th-percentile forward P/E with the move (${n1(PEL.p25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in daily prices and EPS to ${ASOF_TXT}; tools/authoring/valuation-blend.js forwardMedian; GAM estimates for FY27-28E EPS` } },
    { pair: [
      { type: 'line', title: `Forward P/E since listing: median ${n1(PEL.med)}x; ${n1(X.fwdNow)}x FY28E now`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in daily prices; FY27-28E EPS GAM estimates (the step in Apr-2026 is the switch from FY27E to FY28E EPS)' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, Math.round(price)], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n2(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|n1}}**', '–', '{{scen.bull.blend.methods.0.value|n1}}', '{{scen.bear.blend.methods.0.value|n1}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr plus net cash`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|n1}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|n1}}', '{{scen.bear.blend.methods.1.value|n1}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|n1}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|n1}}', '{{scen.bear.blend.methods.2.value|n1}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA plus net cash) gives ₹${n0(mv('ev').value)}, ${pc(mv('ev').vsTarget)} vs the target: ${evMULT.base}x is Tenneco's ${n1(evMed)}x median trailing EV/EBITDA since listing, moved by the same ${pc1(sectorL)} and restated from trailing (₹${n0(ttmEbitda)} cr in the year to Jun-26) to Sep-28E EBITDA (× ${rest.toFixed(3)}). It is lower than the P/E value because our EBITDA grows more slowly than our EPS (other income on a growing cash pile adds to EPS, not EBITDA). The DCF gives ₹${n0(mv('dcf').value)}, about today's price, at a ${n1(V.ke)}% cost of equity and 6% terminal growth with the margin fading to 16.5% of revenue as EVs take exhaust content. **The BUY rests on the market continuing to pay its own ten-month median multiple for earnings that grow ~${Math.round(X.epsCagrFwd)}% a year**; cash-flow value alone says the stock is fairly priced.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, own moves, sub-windows, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector move).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}} of revenue; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, with the sector move).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|n1}}'],
      { hl: true, cells: ['**12-month DCF value (rolled forward 6 months at Ke)**', '**₹{{dcf.blend.methods.2.value|n1}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. No debt, so the cost of equity is the discount rate.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of equity down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke / g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed auto-component peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs median since Nov-25', 'vs 5-yr median', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'TENNIND' ? '**Tenneco Clean Air India**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : 'Dec year', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.pe != null ? n1(p.pe) : '–', drL[p.symbol] != null ? pc(drL[p.symbol]) : (p.symbol === 'TENNIND' ? pc(ownMove) : 'n.a.'), dr5[p.symbol] != null ? pc(dr5[p.symbol]) : 'n.a.', p.evEbitda != null ? n1(p.evEbitda) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Schaeffler reports on December years. Tenneco's EBITDA margin is on revenue including substrates; its ROE is flattered by the pre-IPO payout.` } },
  ],
};

module.exports = { street, valuation };
