// Vishal Mega Mart report, part 5: the street and the valuation (P/E on Sep-28E EPS; multiple derived from VMM's own
// forward P/E over the 12 months to 30-Sep-2026 and the retail peers' same-window P/E move; EV/EBITDA and DCF cross-checks).
const X = require('./VMM.ctx');
const { D, F, n0, n1, n2, pc, price, mv, PE12, PEL, PEIPO, PEH1, PEH2, FM12, sector12, sector5, sens, k, k5, dr12, dr5, MED12, MED5, P, PEERS, USED, EXCL, shortName,
  MULT, epsSep, evMed, evP25, evMULT, evConv, scrEbitda, ebitdaSep28, rating, ST, postQ1, medTp, ASOF_TXT, medOf, half, shortDate, A, b } = X;
const r5 = v => Math.round(v / 5) * 5;
const tpAt = m => n0(r5(m * epsSep.base));
const drTxt = s => `${shortName(s)} ${pc(dr12[s])}`;
const peerPe = medOf(USED.map(s => P[s].pe));
const row = (label, d) => [label, `Sector ${pc(d)}: ${n1(PE12.med)}x × ${(1 + d / 100).toFixed(3)} = ${half(PE12.med * (1 + d / 100))}x`, tpAt(half(PE12.med * (1 + d / 100)))];
const tangRoe = A.pat[b] / (((A.netWorth[b] - 4283.6) + (A.netWorth[b - 1] - 4283.6)) / 2) * 100;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street after Q1: eight Buy/Overweight calls, targets ₹140-170, median ₹${n1(medTp)}`,
  blocks: [
    { p: `Every named broker with a post-Q1 note is positive. Emkay (₹170, 55x Jun-28E EPS) and MOSL (₹165, DCF = ~34x Sep-28E pre-Ind AS EV/EBITDA, ~51x P/E) are the most bullish and kept their calls after the Sep-2026 analyst meet; Jefferies (₹160), Elara (₹159), ICICI Securities and Aditya Birla Money (₹150 each) sit in the middle; Morgan Stanley (Overweight, ₹146) and HSIE (₹140, DCF = ~44x Sep-28E EPS) are the most cautious. The median of the eight, ₹${n1(medTp)}, is ${pc((medTp / price - 1) * 100)} above the ${ASOF_TXT} close of ₹${n0(price)}. Targets were cut through 2026 (MOSL ₹180 in Nov-2025, Emkay ₹180 in Dec-2025) as the stock fell. ${D.street.methodSummary}` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], wide: [0], rows: D.critiques.map(c => [c]), source: 'Broker notes and press reports as cited; GAM Research' } },
  ],
};

const ourAt = s => { const t = String(s.multiple || ''); const m = (t.match(/\(~?(\d+(?:\.\d+)?)x P\/E\)/) || t.match(/^~?(\d+(?:\.\d+)?)x(?! pre)/) || [])[1]; return m && (/P\/E/.test(t) || s.method === 'P/E') ? tpAt(+m) : '–'; };
const sensRows = [
  ['Since listing, IPO-premium months included', `Median ${n1(PEL.med)}x (Dec-24 to Sep-25 alone: ${n1(PEIPO.med)}x) × ${k.toFixed(3)} = ${half(PEL.med * k)}x`, tpAt(half(PEL.med * k))],
  ['House function (every fifth weekly point)', `forwardMedian since Oct-2025: ${n1(FM12.median)}x × ${k.toFixed(3)} = ${half(FM12.median * k)}x`, tpAt(half(FM12.median * k))],
  ['Five-year sector move instead of the same window', `Peers ${pc(sector5)} vs five-year medians: ${n1(PE12.med)}x × ${k5.toFixed(3)} = ${half(PE12.med * k5)}x`, tpAt(half(PE12.med * k5))],
  row('Peer set without DMart', sens.exDmart),
  row('Peer set without Trent', sens.exTrent),
  row('Peer set without Page Industries', sens.exPage),
  row('DMart only (the other listed hypermarket)', sens.grocery),
  ['Only the last six months (Apr-Sep 2026, on FY28E EPS)', `Median ${n1(PEH2.med)}x × ${k.toFixed(3)} = ${half(PEH2.med * k)}x`, tpAt(half(PEH2.med * k))],
  ['No sector move', `${MULT.bull}x on base EPS`, tpAt(MULT.bull)],
  ['VMM\'s own move instead of the sector\'s', `VMM's trailing P/E is ${pc(dr12.VMM)} vs its 12-month median: ${half(PE12.med * (1 + dr12.VMM / 100))}x`, tpAt(half(PE12.med * (1 + dr12.VMM / 100)))],
  ['Street multiples (44x HSIE, ~51x MOSL, 55x Emkay)', 'Applied to our Sep-28E EPS', `${tpAt(44)} / ${tpAt(51)} / ${tpAt(55)}`],
  ['Growth premium', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E`, 'not applied'],
  ['Returns view', `ROE ex-goodwill ~${Math.round(tangRoe)}% (reported {{F.roe.1|pct}} in FY28E) vs an 11.9% cost of equity`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(X.sepNow)}x`,
  blocks: [
    { h: 'How the street values VMM' },
    { p: 'Brokers use P/E directly (Emkay) or DCF stated as a one-year-forward P/E (HSIE, MOSL), so P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E) is our primary method. The "At our numbers" column applies each broker\'s P/E to our Sep-28E EPS.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our numbers (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})${s.pre ? ' – pre-Q1' : ''}`, s.rating, s.tp ? n0(s.tp) : '–', s.method || 'n.d.', s.multiple || '–', s.on || '–', ourAt(s), s.thesis]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Best-run value retailer in small towns; ~18% growth; multiple set by a de-rated sector and a PE overhang'] },
    ], source: 'Emkay (23-Jul-2026) and HSIE (25-Sep-2026, 13-Apr-2026) PDFs; MOSL sector update (25-Sep-2026) and Goodreturns (24-Jul-2026); Business Today (24-Aug and 24-Sep-2026); DSIJ (Emkay, 23-Sep-2026); Trendlyne research list (ICICI Securities, Aditya Birla Money, MOSL Jan-2026); n.d. = method not disclosed to us' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (base)', `VMM listed on 18-Dec-2024. One-year-forward P/E (price ÷ next full fiscal year's EPS: our FY27E to Mar-26, FY28E from Apr-26) on every weekly close from 1-Oct-2025 to ${ASOF_TXT} (${PE12.n} points): median ${n1(PE12.med)}x (25th-75th percentile ${n1(PE12.p25)}-${n1(PE12.p75)}x; range ${n1(PE12.min)}-${n1(PE12.max)}x). Oct-25 to Mar-26 ${n1(PEH1.med)}x; Apr to Sep-26 ${n1(PEH2.med)}x. No trough years (EPS has risen every year). House function on every fifth point: ${n1(FM12.median)}x`, `**Starting point: ${n1(PE12.med)}x**`],
      ['2. Window (§7c, recently listed)', `The first nine months after listing (Dec-24 to Sep-25) traded on listing enthusiasm with a free float of under 25%: median ${n1(PEIPO.med)}x. Skipped; the 12-month window is the HYUNDAI / HDBFS / EMCURE precedent. Since listing: ${n1(PEL.med)}x (sensitivity)`, 'Use the 12 months to 30-Sep-2026'],
      ['3. Sector move, same window', `Retail peers' trailing P/E on ${ASOF_TXT} vs their own medians over Oct-25 to Sep-26: ${USED.map(drTxt).join(', ')}; median ${pc(sector12)}. Excluded: ${EXCL.map(s => `${shortName(s)} (${D.peers.excluded[s].split(':')[0].replace(/\.$/, '')})`).join('; ')}. VMM itself (${pc(dr12.VMM)}) is not used. Against five-year medians the same peers are ${pc(sector5)} (sensitivity)`, `× ${k.toFixed(3)}`],
      ['4. Growth vs the street', `The street's 44-55x come with FY28E EPS of ₹2.9 (HSIE, Emkay); ours is ₹${n2(F.eps[1])}. Revenue growth ~17% and EPS ~${Math.round(X.epsCagrFwd)}% a year to FY29E`, 'No adjustment (§7c); see sensitivity'],
      ['5. Peers', `Peer median trailing P/E ${n1(peerPe)}x; VMM ${n1(P.VMM.pe)}x (Screener basis at the 30-Sep close), below DMart and Trent, close to Metro Brands and Page`, 'VMM has de-rated more than the sector'],
      ['6. Returns vs cost of capital', `ROE ${n1(A.roe[b])}% reported in FY26 (~${Math.round(tangRoe)}% excluding the ₹4,284 cr buyout goodwill) vs an 11.9% cost of equity`, 'Supports a premium multiple; not added (§7c)'],
      ['7. Result (nearest half-turn)', `${n1(PE12.med)}x × ${k.toFixed(3)} = ${n1(PE12.med * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n2(epsSep.base)}**`],
      ['8. Bull / bear', `Bull: no sector move (${n1(PE12.med)}x). Bear: 25th-percentile forward P/E with the move (${n1(PE12.p25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in weekly prices and peer P/E to ${ASOF_TXT}; GAM estimates for FY27-28E EPS in the forward series` } },
    { pair: [
      { type: 'line', title: `Forward P/E since listing: ${n1(PE12.med)}x median over the last 12 months; our ${MULT.base}x`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: PE12.med, text: `12-month median ${n1(PE12.med)}x`, color: '#6b7280' }], source: 'Screener.in weekly prices; FY26 reported EPS; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n2(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr plus net cash after leases`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E (new leases as capex), cost of capital {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded to ₹5)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is VMM's ${n1(evMed)}x median trailing EV/EBITDA over the same 12 months, cut by the same ${Math.abs(sector12).toFixed(1)}% sector move and restated from Screener's trailing EBITDA (₹${n0(scrEbitda)} cr incl. other income) to Sep-28E EBITDA (× ${evConv.toFixed(3)}); MOSL's ~34x is on pre-Ind AS EBITDA and is not comparable. The DCF gives only ₹${n0(mv('dcf').value)}: 15 years of growth fading from ~16% to 9% at a 15.2% margin, with every new lease charged as capex, at an 11.9% cost of capital. The market price assumes growth for longer, or a lower cost of capital. That is why we rate Valuation AMBER even though the P/E rule gives a BUY.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sensRows, source: 'GAM Research. Per PLAYBOOK §7c, other windows, peer sub-sets, own de-rating, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +3pp a year, margin +0.4pp; multiple ${MULT.bull}x (no sector move).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −4pp a year, margin −0.6pp; multiple ${MULT.bear}x (25th percentile with the sector move).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Plus: cash less lease liabilities at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|n1}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm after new leases (treated as capex); beta 0.9, so the cost of equity (11.9%) is the discount rate (no bank debt).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed Indian retail peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', '12-month median P/E', 'vs 12m median', '5-yr median P/E', 'vs 5-yr', 'ROE'], rows: PEERS.map(p => [p.symbol === 'VMM' ? '**Vishal Mega Mart**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.pe != null ? n1(p.pe) : '–', MED12[p.symbol] ? n1(MED12[p.symbol]) : '–', dr12[p.symbol] != null ? pc(dr12[p.symbol]) : '–', MED5[p.symbol] ? n1(MED5[p.symbol]) : '–', dr5[p.symbol] != null ? pc(dr5[p.symbol]) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; 12-month medians Oct-2025 to Sep-2026; five-year medians from Oct-2021 (Metro Brands from Dec-2021, Vishal Mega Mart from Dec-2024). Aditya Birla Fashion has no 12-month median (losses).` } },
  ],
};

module.exports = { street, valuation };
