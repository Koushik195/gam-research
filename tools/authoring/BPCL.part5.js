// Bharat Petroleum report, part 5: the street and the valuation (SOTP on Sep-28E EV/EBITDA; P/E and DCF cross-checks;
// scenarios; peers). Own forward core EV/EBITDA median since Apr-2021 × OMC/refiner move vs five-year medians (§4, §7c).
const X = require('./BPCL.ctx');
const { D, F, n0, n1, pc1, price, mv, OWN, evByFy, evTroughFy, grossMed, sectorMv, k, evMove, peMove, P, PEERS, USED, EXCL, SENSMV, shortName,
  MULT, PEMULT, PEOWN, peTroughFy, FM, SP, ebSep, epsSep, rating, ST, medTp, medPost, POSTQ1, ASOF_TXT, fwdEvNow, STK, listedMv, listedBook, reval, epInv, EPI, shares } = X;
const r5 = v => Math.round(v / 5) * 5;
const rest = SP.filter(p => !p.name.startsWith('Downstream')).reduce((s, p) => s + p.value, 0);
const equity = SP.reduce((s, p) => s + p.value, 0);
const atMult = m => n0(r5((ebSep * m + rest) / shares));
const atMv = mvPct => n0(r5((equity - reval.base + (listedMv * (1 - mvPct / 100) - listedBook)) / shares));
const MOSL_UP = 21; // ₹/share: Motilal Oswal's Mozambique ₹15 + other upstream ₹6 (23-Jul-2026)
const atStreetUp = n0(r5((equity - epInv - EPI.investees + MOSL_UP * shares) / shares));
const brk = ST.filter(s => s.method).map(s => `${s.broker} ${s.multiple} ${s.on}`).join('; ');

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ₹270-518, median ₹${n0(medTp)}; after Q1 four notes, median ₹${n0(medPost)}`,
  blocks: [
    { p: `${ST.length} fundamental targets stood on ${ASOF_TXT}: four written after the Q1FY27 results (${POSTQ1.map(s => `${s.broker} ${s.rating} ₹${s.tp}`).join(', ')}, all on 23/24-Jul-2026) and eight from May-2026, after Q4FY26 and before the Q1 loss (${ST.filter(s => s.date < '2026-07-01').map(s => `${s.broker} ₹${s.tp}`).join(', ')}). Median ₹${n0(medTp)} (${X.pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n1(price)}); the post-Q1 median is ₹${n0(medPost)}. Most notes that disclose a method use EV/EBITDA plus investments (${brk}); PL uses P/B. Targets fell when the war started and rose again after the Q1 beat (Motilal Oswal ₹395 in Jan → ₹265 in May → ₹330; ICICI Securities ₹360 → ₹415; PL ₹270 → ₹305). ${D.street.notCounted.join(' ')}` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes and call participants as cited; GAM Research' } },
  ],
};

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E downstream EBITDA plus upstream and stakes gives {{dcf.tp|inr}}; the stock trades at ${n1(fwdEvNow)}x FY28E core EBITDA`,
  blocks: [
    { h: 'How the street values BPCL' },
    { exhibit: { type: 'table', title: 'How the street values the stock (standing on 30-Sep-2026)', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [s.broker, s.date.split('-').reverse().join('-'), s.rating, n0(s.tp), s.method || 'n.d.', s.multiple || '–', s.on || '–', s.thesis]),
      { hl: true, cells: ['**GAM Research**', '30-09-2026', `**${rating}**`, '**{{dcf.tp|num}}**', '**SOTP: EV/EBITDA + upstream at book + stakes at market less 20%**', `**${MULT.base}x**`, '**Sep-28E**', 'Best assets of the three PSU marketers, policy-capped margins; own history pays ~4.5x core EBITDA'] },
    ], source: 'PL, Motilal Oswal and JM Financial notes read in full; Emkay via investmentguruindia.com (24-Jul-2026); ICICI Securities, BOB Capital and Geojit via Trendlyne\'s report list; Nuvama, Antique, UBS, HDFC Securities and CLSA via businesstoday.in (21-May-2026). n.d. = not disclosed' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { p: `House rule (PLAYBOOK §4, §7c), with the method set by our published IOC report: start from the stock's own one-year-forward multiple from Apr-2021 to ${ASOF_TXT}, leave out trough years, then apply the sector's move against its five-year medians. Because the street values BPCL on EV/EBITDA plus investments, we measure the same thing: EV less ALL investments at their latest book value (so the stakes we add back separately are not counted twice), divided by the next full year's consolidated EBITDA (realised for past years, our FY27E-FY28E for recent dates), on every weekly close. FY27 is left out as a trough (our EBITDA ₹${n0(F.ebitda[0])} cr, below half of FY24's ₹44,082 cr). Our ${MULT.base}x applies to EBITDA before other income, like the street's.` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own history since Apr-2021', `Forward core EV/EBITDA, ${OWN.n} weekly points: median ${n1(OWN.med)}x (25th-75th percentile ${n1(OWN.p25)}-${n1(OWN.p75)}x). Trough year left out: ${evTroughFy.join(', ')}; with it ${n1(OWN.all)}x. By forward year: ${Object.entries(evByFy).map(([fy, v]) => `${fy} ${n1(v.med)}x${v.trough ? ' (trough)' : ''}`).join(', ')}`, `Starting point ${n1(OWN.med)}x`],
      ['2. Sector move', `OMC/refiner peers' trailing EV/EBITDA on ${ASOF_TXT} vs five-year medians: ${USED.map(s => `${shortName(s)} ${pc1(evMove[s])}`).join(', ')}; median ${pc1(sectorMv)}. Excluded: HPCL (${pc1(evMove.HINDPETRO)}; Q1 marketing loss collapsed its trailing EBITDA). BPCL itself (${pc1(evMove.BPCL)}) is not in the set`, `× ${k.toFixed(3)}`],
      ['3. Result (nearest half-turn)', `${n1(OWN.med)}x × ${k.toFixed(3)} = ${n1(OWN.med * k)}x`, `**${MULT.base}x**`],
      ['4. Bull / bear', `Bull: no sector move (${n1(OWN.med)}x). Bear: 25th percentile, moved (${n1(OWN.p25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
      ['5. Street multiples', `5.5-6.5x EBITDA plus investments. On the same weekly data, EV WITHOUT deducting investments has a median of ${n1(grossMed)}x: the street's multiples sit at or above the gross figure, and it then adds the investments again`, 'Shown, not applied'],
      ['6. vs IOC', `IOC's own median is lower (its report: 4.2x → 3.5x). BPCL's premium (five-year trailing EV/EBITDA median 5.5x vs IOC 5.1x) reflects its better refining and retail assets and is already in its own history`, 'Shown, not applied'],
      ['7. Returns', `ROE ${n1(F.roe[1])}% and ${n1(F.roe[2])}% in FY28-29E (cost of equity 12.5%); FY22-26 average ~23% including a trough`, 'Shown, not applied'],
    ], source: `Screener.in prices and balance sheets to ${ASOF_TXT}; GAM estimates FY27-28E EBITDA; peers from their Screener files at the NSE close` } },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case)', head: ['Part', 'Basis', 'Multiple', 'Value (₹ cr)', '₹ / share'], wide: [1], rows: [
      ...SP.map(p => [p.name, p.name.startsWith('Downstream') ? `₹${n0(p.metric)} cr Sep-28E EBITDA` : p.name.includes('net debt') ? `₹${n0(-p.metric)} cr net debt` : p.name.startsWith('E&P') ? `₹${n0(EPI.assets)} − ${n0(EPI.liabilities)} − ${n0(EPI.investees)} cr (Mar-26 book)` : '–', p.mult ? `${p.mult}x` : '–', n0(p.value), n1(p.perShare)]),
      { hl: true, cells: ['**Equity value / target (rounded)**', '', '', `**${n0(equity)}**`, '**{{dcf.tp|num}}**'] },
    ], source: `GAM Research. Listed stakes: ${STK.map(s => `${s.name} ${n1(s.shares)} cr sh × ₹${s.px.toFixed(2)}`).join('; ')} = ₹${n0(listedMv)} cr; Mar-26 book ₹${n0(listedBook)} cr. Shares 427.26 cr (net of the treasury trust). No minorities.` } },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**Sum of the parts (EV/EBITDA)**', '**Target**', `Sep-28E downstream EBITDA ₹${n0(ebSep)} cr + upstream + stakes − net debt`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['P/E', 'Cross-check', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${PEMULT.base}x (bull ${PEMULT.bull}x, bear ${PEMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', X.pc(mv('pe').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-37E, WACC {{dcf.ke|n1}}%, g 4%', '–', '{{dcf.blend.methods.2.value|num}}', X.pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { pair: [
      { type: 'line', title: `Forward core EV/EBITDA since Apr-2021: median ${n1(OWN.med)}x`, unit: 'EV less investments ÷ next year\'s EBITDA (x)', x: X.evRows.map(r => r.d), series: [{ name: 'Forward EV/EBITDA', values: X.evRows.map(r => Math.round(r.m * 100) / 100), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in; GAM' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['SOTP (target)', 'P/E', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('sotp').value), Math.round(mv('pe').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'SOTP (target)', source: 'GAM Research' },
    ] },
    { callout: `**What the cross-checks tell us.** Both sit below the target, and both leave out the upstream invested value and the stake revaluation. P/E: own forward P/E since Apr-2021 has a median of only ${n1(PEOWN.med)}x (${peTroughFy.join(', ')} left out as troughs; the house function on Screener's EPS gives ${n1(FM.median)}x), and OMC/refiner P/Es are near their medians (${pc1(SENSMV.pe)}): ${PEMULT.base}x Sep-28E EPS gives ₹${n0(mv('pe').value)}. The DCF (₹${n0(mv('dcf').value)}) says a 5.5% mid-cycle margin with capex at 3% of revenue does not cover a 10.4% WACC by much. Neither supports paying more than our target; the SOTP is the more generous of the three because it credits ₹${n0(epInv / shares)} a share of upstream that earns nothing yet.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: [
      ['Sector move incl. HPCL', `${pc1(SENSMV.withHpcl)} → ${X.half(OWN.med * (1 + SENSMV.withHpcl / 100))}x`, atMult(X.half(OWN.med * (1 + SENSMV.withHpcl / 100)))],
      ['Widened oil & gas set (+ Reliance, ONGC, Oil India, GAIL, Petronet)', `${pc1(SENSMV.wide)} → ${X.half(OWN.med * (1 + SENSMV.wide / 100))}x`, atMult(X.half(OWN.med * (1 + SENSMV.wide / 100)))],
      ['No sector move (bull multiple)', `${MULT.bull}x`, atMult(MULT.bull)],
      ['Trough year kept in the median', `${n1(OWN.all)}x × ${k.toFixed(3)} → ${X.half(OWN.all * k)}x`, atMult(X.half(OWN.all * k))],
      ['Listed stakes at full market value', 'No 20% discount', atMv(0)],
      ['All upstream at Motilal Oswal\'s value', `₹${MOSL_UP} a share instead of invested value plus upstream JVs at book (₹${n0((epInv + EPI.investees) / shares)})`, atStreetUp],
      ['Street median target', `₹${n0(medTp)} = ${n1((medTp * shares - rest) / ebSep)}x Sep-28E downstream EBITDA on our other parts`, n0(medTp)],
    ], source: 'GAM Research. Per PLAYBOOK §7c, sub-sets, alternative windows and street views are shown, not used for the target.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} ${MULT.bull}x; stakes at market.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Downstream EBITDA ₹3,600 / 5,400 / 5,500 per tonne; EBITDA {{F.ebitda.0|num}} / {{F.ebitda.1|num}} / {{F.ebitda.2|num}} cr; ${MULT.base}x Sep-28E; upstream at book; stakes at market less 20%.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} ${MULT.bear}x; stakes less 30%; upstream invested value less ${X.EP_BEAR}%. Each ₹1,000 cr of EBITDA is ~₹${n1(1000 * MULT.base / shares)} a share.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of explicit free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt (investments at book)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Discount rate = WACC 10.4% (beta set to 0.65 so the engine\'s rate equals our WACC; cost of equity 12.5%). Upstream invested value and stake revaluation not added.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Oil marketing, refining and wider oil & gas peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr', 'EV/EBITDA (x)', 'vs 5-yr', 'ROE'], rows: PEERS.map(p => [p.symbol === 'BPCL' ? '**BPCL**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : USED.includes(p.symbol) ? '' : ' (widened set)'), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc1(peMove[p.symbol]), n1(p.evEbitda), pc1(evMove[p.symbol]), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; five-year medians from 30-Sep-2021. BPCL's Screener market value uses 433.85 cr shares.` } },
  ],
};

module.exports = { street, valuation };
