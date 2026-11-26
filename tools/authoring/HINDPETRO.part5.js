// HPCL report, part 5: the street and the valuation (SOTP on Sep-28E EV/EBITDA; P/E and DCF cross-checks; scenarios;
// peers). Own forward core EV/EBITDA median since Apr-2021 × OMC/refiner move vs five-year medians (§4, §7c; IOC template).
const X = require('./HINDPETRO.ctx');
const { D, F, n0, n1, pc1, price, mv, OWN, evByFy, evTroughFy, grossMed, sectorMv, k, evMove, peMove, P, PEERS, USED, SENSMV, shortName,
  MULT, PEMULT, PEOWN, peTroughFy, kPe, FM, SP, ebSep, epsSep, rating, ST, medTp, medPost, ASOF_TXT, fwdEvNow, STK, listedMv, listedBook, reval, shares, HR, HM, hrrlBear, MID } = X;
const r5 = v => Math.round(v / 5) * 5;
const segV = SP.find(p => p.name.startsWith('Refining'))?.value || 0, rest = SP.reduce((s, p) => s + p.value, 0) - segV;
const atMult = m => n0(r5((ebSep * m + rest) / shares));
const atAdj = d => n0(r5((ebSep * MULT.base + rest + d) / shares));
const brk = s => s.broker.replace(' Institutional Equities', '').replace(' Capital Markets', ' Capital');
const dmy = d => d.split('-').reverse().join('-');

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ₹350-495, median ₹${n0(medTp)}; after Q1, median ₹${n0(medPost)}`,
  blocks: [
    { p: `Nine fundamental targets stood on ${ASOF_TXT}: six written after the Q1FY27 results on 22-Jul-2026 (Motilal Oswal Buy ₹470, ICICI Securities Buy ₹495, BOB Capital Hold ₹427, Emkay Add ₹410, Prabhudas Lilladher Reduce ₹350, Nomura Neutral ₹420) and three from before them (Kotak Reduce ₹400 in June, Geojit Hold ₹420 and Nuvama Reduce ₹372 in May). Median ₹${n0(medTp)} (${X.pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n1(price)}); the post-Q1 median is ₹${n0(medPost)}. Three of the four that disclose a method use 6x EV/EBITDA on standalone EBITDA (Dec-27E to Jun-28E) plus investments; PL uses 1.1x FY28E book. Targets fell through the year (MOSL ₹600 in Jan → 455 → 470; BOB ₹464 → 438 → 427; PL ₹427 in May → 386 → 350). ${D.street.notCounted.join(' ')}` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes and Cabinet approval as cited; GAM Research' } },
  ],
};

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EBITDA plus stakes gives {{dcf.tp|inr}}; the stock trades at ${n1(fwdEvNow)}x FY28E core EBITDA`,
  blocks: [
    { h: 'How the street values HPCL' },
    { exhibit: { type: 'table', title: 'How the street values the stock (standing on 30-Sep-2026)', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [brk(s), dmy(s.date), s.rating, n0(s.tp), s.method || 'n.d.', s.multiple || '–', s.on || '–', s.thesis]),
      { hl: true, cells: ['**GAM Research**', '30-09-2026', `**${rating}**`, '**{{dcf.tp|num}}**', '**SOTP: EV/EBITDA + stakes at market less 20% + HRRL loan**', `**${MULT.base}x**`, '**Sep-28E**', 'Most marketing-heavy OMC; own history pays ~4x core EBITDA; leverage cuts both ways'] },
    ], source: 'PL, BOB Capital and Emkay notes read in full; Motilal Oswal via DSIJ (23-Jul-2026); ICICI Securities and Geojit via Trendlyne; Nomura via a dated-by-price secondary report; Kotak via whalesbook.com (22-Jun-2026); Nuvama via businesstoday.in (14-May-2026). n.d. = not disclosed' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { p: `House rule (PLAYBOOK §4, §7c), as in our IOC initiation: start from the stock's own one-year-forward multiple from Apr-2021 to ${ASOF_TXT}, leave out trough years, then apply the sector's move against its five-year medians. Because the street values HPCL on EV/EBITDA plus investments, we measure the same thing: EV less ALL investments at their latest book value (so the stakes we add back are not counted twice), divided by the next full year's consolidated EBITDA (realised for past years, our FY27E-FY28E for recent dates), on every weekly close. Two forward years are troughs and left out: FY23 (an EBITDA loss of ₹7,192 cr) and FY27E (₹${n0(F.ebitda[0])} cr, below half of FY26's ₹30,645 cr). HPCL's history is badly distorted by these swings (weeks pricing FY23 show a median of ${n1(evByFy.FY23.med)}x; weeks pricing FY27E ${n1(evByFy.FY27.med)}x; weeks pricing FY24's record ${n1(evByFy.FY24.med)}x), so we also show the median on a mid-cycle denominator and with the troughs kept, as sensitivity rows.` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own history since Apr-2021', `Forward core EV/EBITDA, ${OWN.n} weekly points kept: median ${n1(OWN.med)}x (25th-75th percentile ${n1(OWN.p25)}-${n1(OWN.p75)}x). Trough years left out: ${evTroughFy.join(', ')}. By forward year: ${Object.entries(evByFy).map(([fy, v]) => `${fy} ${n1(v.med)}x${v.trough ? ' (trough)' : ''}`).join(', ')}`, `Starting point ${n1(OWN.med)}x`],
      ['2. Sector move', `OMC/refiner peers' trailing EV/EBITDA on ${ASOF_TXT} vs five-year medians: ${USED.map(s => `${shortName(s)} ${pc1(evMove[s])}`).join(', ')}; median ${pc1(sectorMv)}. HPCL itself (${pc1(evMove.HINDPETRO)}, distorted by the Q1 loss) is not in the set`, `× ${k.toFixed(3)}`],
      ['3. Result (nearest half-turn)', `${n1(OWN.med)}x × ${k.toFixed(3)} = ${n1(OWN.med * k)}x`, `**${MULT.base}x**`],
      ['4. Bull / bear', `Bull: no sector move (${n1(OWN.med)}x). Bear: 25th percentile, moved (${n1(OWN.p25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
      ['5. Street multiples', `6x standalone EBITDA plus investments. On the same weekly data, EV WITHOUT deducting investments has a median of ${n1(grossMed)}x: the street's 6x is above even the gross figure, and it then adds the investments again`, 'Shown, not applied'],
      ['6. Returns', `ROE ~${Math.round((F.roe[1] + F.roe[2]) / 2)}% on FY28-29E (cost of equity 12.5%); FY22-26 consolidated average ~${Math.round(X.A.roe.slice(-5).reduce((s, v) => s + v, 0) / 5)}% including a loss year`, 'Shown, not applied'],
    ], source: `Screener.in prices and balance sheets to ${ASOF_TXT}; GAM estimates FY27-28E EBITDA; peers from their Screener files at the NSE close` } },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case)', head: ['Part', 'Basis', 'Multiple', 'Value (₹ cr)', '₹ / share'], wide: [1], rows: [
      ...SP.map(p => [p.name, p.mult ? `₹${n0(p.metric)} cr` : (p.name.includes('net debt') ? `₹${n0(-p.metric)} cr net debt` : '–'), p.mult ? `${p.mult}x` : '–', n0(p.value), n1(p.perShare)]),
      { hl: true, cells: ['**Equity value / target (rounded)**', '', '', `**${n0(SP.reduce((s, p) => s + p.value, 0))}**`, '**{{dcf.tp|num}}**'] },
    ], source: `GAM Research. Listed stakes: ${STK.map(s => `${s.sym} ${n1(s.shares)} cr sh × ₹${s.px.toFixed(2)}`).join('; ')} = ₹${n0(listedMv)} cr; Mar-26 book ₹${n0(listedBook)} cr. Net debt includes HRRL (₹${n0(HR.carrying)} cr), HMEL (₹${n0(HM.carrying)} cr) and other JVs at book. Shares 212.78 cr.` } },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**Sum of the parts (EV/EBITDA)**', '**Target**', `Sep-28E EBITDA ₹${n0(ebSep)} cr + stakes − net debt`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['P/E', 'Cross-check', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${PEMULT.base}x (bull ${PEMULT.bull}x, bear ${PEMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', X.pc(mv('pe').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-37E, WACC {{dcf.ke|n1}}%, g 4%', '–', '{{dcf.blend.methods.2.value|num}}', X.pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { pair: [
      { type: 'line', title: `Forward core EV/EBITDA since Apr-2021 (troughs out): median ${n1(OWN.med)}x`, unit: 'EV less investments ÷ next year\'s EBITDA (x)', x: X.evKept.map(r => r.d), series: [{ name: 'Forward EV/EBITDA', values: X.evKept.map(r => Math.round(r.m * 100) / 100), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in; GAM' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['SOTP (target)', 'P/E', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('sotp').value), Math.round(mv('pe').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'SOTP (target)', source: 'GAM Research' },
    ] },
    { callout: `**What the cross-checks tell us.** P/E: HPCL's own forward P/E since Apr-2021 has a median of only ${n1(PEOWN.med)}x (${peTroughFy.join(', ')} left out as troughs; the house function gives ${n1(FM.median)}x), and OMC/refiner P/Es have re-rated (${pc1(X.SENSMV.pe)}): ${PEMULT.base}x Sep-28E EPS gives ₹${n0(mv('pe').value)}, below our target because interest and depreciation take a large bite out of EBITDA. The DCF (₹${n0(mv('dcf').value)}) is well above the price: if HPCL earned a 4% EBITDA margin on growing volumes for a decade with capex at 2.2% of revenue, it would be worth much more. The market has never priced HPCL that way, because the state decides when that margin is earned. We treat the DCF as the upside if policy turns benign, not as fair value.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: [
      ['OMC-only sector move (IOC, BPCL)', `${pc1(SENSMV.omc)} → ${X.half(OWN.med * (1 + SENSMV.omc / 100))}x`, atMult(X.half(OWN.med * (1 + SENSMV.omc / 100)))],
      ['Widened oil & gas set (+ Reliance, ONGC, Oil India, GAIL, Petronet)', `${pc1(SENSMV.wide)} → ${X.half(OWN.med * (1 + SENSMV.wide / 100))}x`, atMult(X.half(OWN.med * (1 + SENSMV.wide / 100)))],
      ['No sector move (bull multiple)', `${MULT.bull}x`, atMult(MULT.bull)],
      ['Trough years kept (positive weeks)', `${n1(OWN.all)}x × ${k.toFixed(3)} → ${X.half(OWN.all * k)}x`, atMult(X.half(OWN.all * k))],
      ['Mid-cycle denominator (forward volume × ₹' + n0(MID) + '/t, all weeks)', `${n1(OWN.mid)}x × ${k.toFixed(3)} → ${X.half(OWN.mid * k)}x`, atMult(X.half(OWN.mid * k))],
      ['HRRL and HMEL at nil (BOB, Emkay)', `Remove ₹${n0(HR.carrying + HR.subDebt + HM.carrying)} cr of book value and loan`, atAdj(-(HR.carrying + HR.subDebt + HM.carrying))],
      ['HRRL at 0.8x invested capital (MOSL)', `₹${n0(0.8 * X.hrrlInvested)} cr instead of ₹${n0(HR.carrying + HR.subDebt)} cr`, atAdj(hrrlBear - HR.subDebt)],
      ['Listed stakes at full market value', 'No 20% discount', atAdj(reval.bull - reval.base)],
      ['Street method on its own terms: 6x standalone-like EBITDA + stakes', '6x on our Sep-28E EBITDA, other parts unchanged', atMult(6)],
      ['Street median target', `₹${n0(medTp)} = ${n1((medTp * shares - rest) / ebSep)}x Sep-28E EBITDA on our other parts`, n0(medTp)],
    ], source: 'GAM Research. Per PLAYBOOK §7c, sub-sets, alternative windows and street views are shown, not used for the target.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} ${MULT.bull}x; stakes at market.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `EBITDA ₹700 / 4,300 / 4,500 per tonne; EBITDA {{F.ebitda.0|num}} / {{F.ebitda.1|num}} / {{F.ebitda.2|num}} cr; ${MULT.base}x Sep-28E; stakes at market less 20%; HRRL and HMEL at book.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} ${MULT.bear}x; stakes less 30%; HRRL at 0.8x invested. Leverage magnifies: each ₹1,000 cr of EBITDA is ~₹${n1(1000 * MULT.base / shares)} a share.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of explicit free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt (investments at book)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Discount rate = WACC 9.4% (beta set to 0.48 so the engine\'s rate equals our WACC; cost of equity 12.5%). The HRRL loan is not added in the DCF.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Oil marketing, refining and wider oil & gas peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr', 'EV/EBITDA (x)', 'vs 5-yr', 'ROE'], rows: PEERS.map(p => [p.symbol === 'HINDPETRO' ? '**HPCL**' : shortName(p.symbol) + (USED.includes(p.symbol) ? '' : ' (widened set)'), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc1(peMove[p.symbol]), n1(p.evEbitda), pc1(evMove[p.symbol]), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; five-year medians from 30-Sep-2021. HPCL's trailing multiples include the Q1FY27 loss.` } },
  ],
};

module.exports = { street, valuation };
