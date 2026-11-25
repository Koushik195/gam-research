// IndiaMART report, part 5: the street and the valuation (P/E on Sep-28E EPS; multiple = own forward P/E median since
// Apr-2021 on EPS before strategic fair-value gains × the three-name sector move (Info Edge, Just Dial, Matrimony.com);
// EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./INDIAMART.ctx');
const { D, F, V, n0, n1, pc, price, mv, FM, p25, p75, two, byFy, medOf, cleanMed, repMed, MV, SET, NET, CLS, PEERS, P, dr5, MED5, shortName, MULT, SENS, epsSep, at, evMed, evP25, evMULT, rating, ST, medTp, shortDate, ASOF_TXT, sepNow, kBase, cleanS } = X;
const drTxt = s => `${shortName(s)} ${pc(dr5[s])}`;
const ourAt = s => { const m = String(s.multiple).match(/^(\d+(?:\.\d+)?)x/); if (!m || s.on !== 'FY28E') return s.method === 'DCF' ? `${n1(s.tp / F.eps[1])}x our FY28E` : '–'; return n0(Math.round(+m[1] * F.eps[1] / 10) * 10); };
const CS = D.street.consensus;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: split ${X.nBuy} Buy/Add, ${ST.length - X.nBuy - X.nSell} Hold, ${X.nSell} Sell; targets ₹1,650-2,300, all cut after Q1FY27`,
  blocks: [
    { p: `Every broker visible to us cut its target after the Q1FY27 results (21-22 Jul-2026), when paying suppliers fell for a third quarter. Motilal Oswal (Buy, ₹2,250, DCF) and ICICI Securities (Buy, ₹2,300) argue that the valuation already discounts the churn problem; Choice (Add, ₹2,060) cut its multiple to 20x FY28E from 22x; Axis (Hold, ₹2,060) and Centrum (downgraded to Neutral, ₹2,073) sit in the middle; Nomura (Reduce, ₹1,810), DAM Capital (₹1,680) and Jefferies (Underperform, ₹1,650) see the stalled base as structural. Median of these eight: ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. Bloomberg consensus on 22-Jul-2026: ₹${n0(CS.tp)} (${CS.buy} Buy, ${CS.hold} Hold, ${CS.sell} Sell). Targets have roughly halved in two years: MOSL ₹3,500 (Oct-2024) to ₹2,250; Axis ₹3,620 to ₹2,060. The stock closed at ₹1,918 the day the results came out (MOSL) and at ₹${n0(price)} on ${ASOF_TXT}, 15% lower.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes and press as cited; company calls; GAM Research' } },
  ],
};

const sens = [
  [`Base: three-name sector move (${SET.map(drTxt).join(', ')}; median ${pc(MV.all)})`, `${n1(cleanMed)}x × ${kBase.toFixed(3)} = ${MULT.base}x`, n0(at(MULT.base))],
  ['No sector move (own median since Apr-2021, before one-offs)', `${n1(cleanMed)}x → ${SENS.none}x`, n0(at(SENS.none))],
  [`Internet platform only (${NET.map(drTxt).join(', ')})`, `${n1(cleanMed)}x × ${(1 + MV.net / 100).toFixed(3)} = ${SENS.net}x`, n0(at(SENS.net))],
  [`Online classifieds only (${CLS.map(drTxt).join(', ')}; median ${pc(MV.cls)})`, `${n1(cleanMed)}x × ${(1 + MV.cls / 100).toFixed(3)} = ${SENS.cls}x`, n0(at(SENS.cls))],
  [`Set without Just Dial (FY22 trough; median ${pc(MV.exJd)})`, `${n1(cleanMed)}x × ${(1 + MV.exJd / 100).toFixed(3)} = ${SENS.exJd}x`, n0(at(SENS.exJd))],
  ['Reported EPS (incl. start-up fair-value gains; house forwardMedian)', `${n1(repMed)}x × ${kBase.toFixed(3)} = ${SENS.rep}x`, n0(at(SENS.rep))],
  ['Last two years only (since Oct-2024: the stalled-base period)', `Median ${n1(two)}x × ${kBase.toFixed(3)} = ${SENS.two}x`, n0(at(SENS.two))],
  ['Street multiples', 'Choice 20x FY28E; MOSL DCF ≈ 21x FY28E', `${n0(Math.round(20 * F.eps[1] / 10) * 10)} / ${n0(Math.round(21.2 * F.eps[1] / 10) * 10)}`],
  ['Growth view (not applied)', `EPS before one-offs grew ~${Math.round(X.epsCagrHist)}% a year in FY23-26 (margin recovery); we forecast ~${Math.round(X.epsCagrFwd)}% for FY26-29E with flat customer numbers`, 'would argue for less'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(sepNow)}x`,
  blocks: [
    { h: 'How the street values IndiaMART' },
    { p: 'The street values IndiaMART on P/E on FY28E EPS: Choice at 20x FY28E; Motilal Oswal\'s DCF target is ~21x its FY28E EPS; the other brokers\' methods are not visible to us. We use the same method on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). No broker visible to us values the start-up stakes separately; neither do we (they are inside net cash only in the EV/EBITDA and DCF cross-checks).' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple, s.on, ourAt(s), s.thesis]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'A cash-rich, high-margin platform priced for decline; the house multiple says the de-rating has gone further than its peers\', but the stalled customer base is a real reason for part of it'] },
    ], source: 'MOSL (21-Jul-2026) and Choice (22-Jul-2026) notes; ICICI Securities and Axis via Trendlyne (22-Jul-2026); Centrum, Nomura, Jefferies, DAM Capital via Business Today (22-Jul-2026)' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (used)', `Price ÷ next full-year EPS before fair-value gains on start-up stakes, Apr-2021 to ${ASOF_TXT}: median ${n1(cleanMed)}x (25th-75th percentile ${n1(p25)}-${n1(p75)}x); on reported EPS ${n1(repMed)}x (house function ${n1(FM.median)}x). No trough years. By forward year: ${Object.entries(byFy).map(([f, v]) => `FY${String(f).slice(2)} ${n1(medOf(v))}x`).join(', ')}. One-offs removed: ₹84 cr (FY23), ₹29 cr (FY24), ₹72 cr (FY25), ₹78 cr (FY26) before 25% tax`, `**Starting point: ${n1(cleanMed)}x**`],
      ['2. Sector move', `Natural set (internet platforms): only Info Edge has a usable five-year P/E history (Eternal, Nykaa, PB Fintech: P/E above 1,000x; Paytm, Swiggy: losses). Too thin, so we widen to the group Screener and brokers put IndiaMART in, online classifieds: Just Dial and Matrimony.com (CarTrade excluded: FY22 loss). Trailing P/E at the ${ASOF_TXT} close vs five-year medians: ${SET.map(drTxt).join(', ')}; median ${pc(MV.all)}. IndiaMART itself: ${pc(dr5.INDIAMART)} (excluded). Sub-sets are sensitivity rows`, `**× ${kBase.toFixed(3)}**`],
      ['3. Growth vs the street\'s multiples', `Choice's 20x FY28E comes with ~12% EPS growth FY27-29E; MOSL's ~21x with 11% revenue growth. Ours: ~${Math.round(X.epsCagrFwd)}% EPS growth FY26-29E`, 'No adjustment (§7c); see sensitivity'],
      ['4. Peers', `Trailing P/E on ${ASOF_TXT}: IndiaMART ${n1(P.INDIAMART.pe)}x, Info Edge ${n1(P.NAUKRI.pe)}x, Just Dial ${n1(P.JUSTDIAL.pe)}x, Matrimony.com ${n1(P.MATRIMONY.pe)}x, CarTrade ${n1(P.CARTRADE.pe)}x`, 'IndiaMART is the cheapest classifieds name on trailing P/E'],
      ['5. Returns vs cost of capital', `ROE ~21-23% (FY27-29E) although cash and treasury (₹3,280 cr at Mar-26) exceed net worth (₹2,400 cr): customers' prepayments fund the business, so returns on operating capital are far higher. Cost of equity ${n1(V.ke)}%`, 'Supports a market multiple or better'],
      ['6. Result (nearest half-turn)', `${n1(cleanMed)}x × ${kBase.toFixed(3)} = ${n1(cleanMed * kBase)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}**`],
      ['7. Bull / bear', `Bull: own median, no sector move (${n1(cleanMed)}x) on bull EPS. Bear: 25th-percentile forward P/E × the sector move (${n1(p25)}x × ${kBase.toFixed(3)}) on bear EPS`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; AR FY24/FY26 (one-offs); GAM estimates for FY27-28E EPS in the forward series; peers' trailing P/E vs five-year medians (Sep-2021 to Sep-2026)` } },
    { pair: [
      { type: 'line', title: `Forward P/E before one-offs: median ${n1(cleanMed)}x since 2021, now ${n1(price / F.eps[1])}x`, unit: 'Price ÷ next full-year EPS before start-up gains (x)', x: cleanS.map(x => x[0]), series: [{ name: 'Forward P/E', values: cleanS.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: SENS.none, text: `Own median: ${SENS.none}x` }], source: 'Screener.in prices; EPS before strategic fair-value gains (AR FY24/FY26); GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target, cross-checks and sensitivities vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'No sector move', 'Last two years', 'Street median', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), at(SENS.none), at(SENS.two), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA (after associates) ₹${n0(mv('ev').metric)} cr + net treasury incl. stakes`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 5.5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA after associates: IndiaMART's own forward EV/EBITDA median since 2021 of ${n1(evMed)}x × the same ${kBase.toFixed(3)} factor, plus ₹${n0(V.netCash)} cr of net treasury and stakes) gives ₹${n0(mv('ev').value)}; the DCF (Ke ${n1(V.ke)}%, growth fading to 7% and 5.5% terminal, margin held at 30%) gives ₹${n0(mv('dcf').value)}. Both are above the P/E value because IndiaMART's cash (~₹${n0(V.netCash / X.shares)} a share incl. stakes by Mar-27) earns only a treasury yield inside P/E. Put plainly: at ₹${n0(price)} the market pays ~${n1(X.exCashPe)}x FY28E operating EPS (after-tax treasury income removed) for the business after its cash and stakes (~₹${n0(X.cashPs)} a share at Jun-26), a price that assumes decline. The honest counter-argument is in the sensitivity table: on the last two years' multiples alone (the period in which the customer base stalled) the value is ₹${n0(at(SENS.two))}, barely above today's price.` },
    { exhibit: { type: 'table', title: 'Base and sensitivity rows (peer set, window, one-offs)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, sub-sets, growth and returns views are shown, not added to the base multiple; the base uses the full three-name set.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (own median, no sector move).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin (after associates) {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile × the sector move).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net treasury incl. strategic stakes at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm excludes treasury income; the cost of equity is the discount rate (no debt).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed comparables', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', '5-yr median P/E', 'vs median', 'ROE'], rows: PEERS.map(p => [p.symbol === 'INDIAMART' ? '**IndiaMART**' : shortName(p.symbol) + (SET.includes(p.symbol) ? '' : ' (excluded)'), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.pe ? n1(p.pe) : '–', MED5[p.symbol] ? n1(MED5[p.symbol]) : '–', dr5[p.symbol] != null ? pc(dr5[p.symbol]) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; five-year medians Sep-2021 to Sep-2026. Excluded names: losses or P/E above 1,000x inside the window (see deep-dive notes).` } },
  ],
};

module.exports = { street, valuation };
