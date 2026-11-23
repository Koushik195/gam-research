// ZF CV India report, part 5: the street and the valuation (P/E on Sep-28E EPS, multiple derived from the stock's own
// forward P/E history and the auto-component de-rating; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./ZFCVINDIA.ctx');
const { D, F, V, n0, n1, pc, rup, price, mv, FM, fmP25, fmP75, adjMed, buckets, twoYr, sectorDr, sectorDrAll, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, epsSep, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, rating, ST, standing, postQ1, medTp, shortDate, ASOF_TXT, medOf, arn, tre0 } = X;
const r10 = v => Math.round(v / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const peerPe = medOf(USED.map(s => P[s].pe));

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: Buy-rated everywhere, targets ₹2,620-3,170 (post-bonus)`,
  blocks: [
    { p: `Coverage is thin and uniformly positive. After Q1FY27 ICICI Securities kept Buy with ₹2,800 (28-Jul-2026), calling the quarter operationally "muted" (margin 190bp below its estimate) but expecting higher content to drive growth. ICICI Direct's last note before our date (24-Jun-2026, after the bonus) has Buy and ₹3,170. Anand Rathi's latest visible note (13-Feb-2026) has Buy and ₹18,800 before the bonus (₹${n0(arn.tp)} after), at **${arn.multiple} ${arn.on} P/E**; Geojit's last note (Sep-2025) was Accumulate at ₹2,624 post-bonus. Median of the four standing targets: ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. The one broker whose method we can see (Anand Rathi) uses **P/E on one-year-forward EPS**; the others' methods are behind logins, but their targets sit at 45-54x our Sep-28E EPS, consistent with P/E. The bulls focus on the ESC/ADAS mandate and the truck cycle; nobody in our sources is negative.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes and calls as cited; AR FY26; GAM Research' } },
  ],
};

const ourAt = s => { const m = String(s.multiple).match(/(\d+(?:\.\d+)?)x/); return s.method === 'P/E' && m ? n0(r10(+m[1] * epsSep.base)) : '–'; };
const sens = [
  ['Own median on EPS before Screener\'s exceptional items', `${n1(adjMed)}x × ${k.toFixed(3)} = ${n1(adjMed * k)}x`, n0(r10(X.half(adjMed * k) * epsSep.base))],
  ['Only the last two years (since Oct-2024)', `Forward P/E median ${n1(twoYr)}x, de-rated ${n1(twoYr * k)}x`, n0(r10(X.half(twoYr * k) * epsSep.base))],
  ['No sector de-rating', `${MULT.bull}x on base EPS`, n0(r10(MULT.bull * epsSep.base))],
  ['Sector de-rating incl. Bharat Forge and Gabriel', `${n1(FM.median)}x × ${(1 + sectorDrAll / 100).toFixed(3)}`, n0(r10(X.half(FM.median * (1 + sectorDrAll / 100)) * epsSep.base))],
  ['Street multiple (Anand Rathi 50x)', '50x on our Sep-28E EPS', n0(r10(50 * epsSep.base))],
  ['Own de-rating (ZF CV\'s trailing P/E vs its five-year median)', `${pc(derate.ZFCVINDIA)}: would cut the multiple to ~${n1(FM.median * (1 + derate.ZFCVINDIA / 100))}x; not blended (§7c)`, n0(r10(X.half(FM.median * (1 + derate.ZFCVINDIA / 100)) * epsSep.base))],
  ['Growth premium', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E, back-loaded into the ESC step; not applied`, 'not applied'],
  ['Cash adjustment', `Net treasury ₹${n0(tre0)} cr (~₹${n0(tre0 / X.shares)} a share) already earns ~6% inside EPS; not added on top`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${Math.round(X.sepNow)}x`,
  blocks: [
    { h: 'How the street values ZF CV India' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). Pre-bonus targets are divided by six. The "At our EPS" column applies each broker\'s multiple to our Sep-28E EPS.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp) + (s.tpPreBonus ? ` (pre-bonus ${n0(s.tpPreBonus)})` : ''), s.method, s.multiple, s.on, ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'The right franchise for the 2027 safety rules, at a price that already discounts most of the step-up'] },
    ], source: 'Trendlyne research listing and note summaries (ICICI Securities 28-Jul-2026, ICICI Direct 24-Jun-2026, Geojit 9-Sep-2025); Anand Rathi company updates (PDF, 13-Feb-2026 and 6-Nov-2025)' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E', `One-year-forward P/E since Apr-2021 (bonus-adjusted prices and EPS): median ${n1(FM.median)}x, no trough years left out (25th-75th percentile ${n1(fmP25)}-${n1(fmP75)}x). By forward year: ${buckets.map(x => `${x.fy} ${n1(x.med)}x`).join(', ')}`, `**Starting point: ${n1(FM.median)}x**`],
      ['2. Sector de-rating', `Auto-component peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded: ${EXCL.map(s => `${shortName(s)} (${pc(derate[s])}; ${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join(', ')}; with them ${pc(sectorDrAll)}. ZF CV itself (${pc(derate.ZFCVINDIA)}) is not used`, `× ${k.toFixed(3)}`],
      ['3. Growth vs the street', `Anand Rathi's 50x Mar-28E came with FY25-28E EPS growth of ~16% a year (Feb-2026); ours is ~${Math.round(X.epsCagrFwd)}% over FY26-29E, from a lower FY27E base`, 'No adjustment (§7c); see sensitivity'],
      ['4. Peers', `Peer median trailing P/E ${n1(peerPe)}x; ZF CV ${n1(P.ZFCVINDIA.pe)}x on trailing EPS that includes FX gains`, 'A premium to peers, as in its history: no extra signal'],
      ['5. Returns', 'ROE ~14% (diluted by ~₹2,200 cr of cash), operating ROCE far higher; cost of equity 11.9%', 'Supports a premium multiple, already in the history'],
      ['6. Result (nearest half-turn)', `${n1(FM.median)}x × ${k.toFixed(3)} = ${n1(FM.median * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}**`],
      ['7. Bull / bear', `Bull: no de-rating (${n1(FM.median)}x). Bear: 25th-percentile forward P/E, de-rated (${n1(fmP25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT} (bonus-adjusted); GAM estimates for FY27-28E EPS in the forward series` } },
    { pair: [
      { type: 'line', title: `Forward P/E since 2021: median ${n1(FM.median)}x; ${n1(X.sepNow)}x Sep-28E now`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Forward P/E', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr + net cash`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA plus net cash) gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is ZF CV's ${n1(evMed)}x median trailing EV/EBITDA since May-2022, cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating and restated from trailing (₹${n0(ttmEbitda)} cr in the year to Jun-26) to Sep-28E EBITDA. It sits ~${Math.abs(Math.round(mv('ev').vsTarget))}% below the P/E value: the EV/EBITDA history is shorter and the cash is added at book value, so the two agree reasonably. The DCF gives only ₹${n0(mv('dcf').value)} at an ${n1(V.ke)}% cost of equity and 6% terminal growth: even the most generous corner of the grid below (${n1(V.sens.waccs[0])}%, ${n1(V.sens.gs[4])}%) gives ₹${n0(V.sens.grid[0][4])}. Like most Indian auto-component leaders, the stock prices in decades of growth that a 15-year cash-flow model does not reach.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, own-history windows, own de-rating, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm excludes treasury income; the cost of equity is used as the discount rate (no debt).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed auto-component peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'ZFCVINDIA' ? '**ZF CV India**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : 'Dec year', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', n1(p.pe), derate[p.symbol] == null ? '–' : pc(derate[p.symbol]), n1(p.evEbitda), p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Schaeffler reports on December years. ZF CV's P/E history on Screener starts May-2022.` } },
  ],
};

module.exports = { street, valuation };
