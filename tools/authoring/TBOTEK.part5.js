// TBO Tek report, part 5: the street and the valuation (P/E on Sep-28E EPS; multiple = own 12-month forward P/E median x
// the same-window move of the widened travel + internet peer set; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./TBOTEK.ctx');
const { D, F, V, n0, n1, pc, price, mv, PE12, PEX, PEL, PEH1, PEH2, FM, fwdPe, MV, k, SET, TRAVEL, NET, IRS, PEERS, P, dr12, MED12, MED5, dr5, shortName, MULT, SENS, epsSep, at, evMed, evMULT, evSt, rating, ST, medTp, shortDate, ASOF_TXT, sepNow, fwdNow, R12 } = X;
const drTxt = s => `${shortName(s)} ${pc(dr12[s])}`;
const ourAt = s => { const m = String(s.multiple).match(/(\d+(?:\.\d+)?)x/); if (!m) return '–'; const e = s.on === 'FY28E' ? F.eps[1] : epsSep.base; return n0(Math.round(+m[1] * e / 10) * 10); };

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: three Buys and a Hold, targets ₹1,550-2,200, all on 35-40x FY28E-29E earnings`,
  blocks: [
    { p: `Four broker views stood on ${ASOF_TXT}. After the Q1FY27 results (30-Jul-2026) Motilal Oswal kept Buy at ₹1,850 (35x FY28E), Anand Rathi raised its target to ₹2,200 (~40x FY28E) and ICICI Securities kept Hold at ₹1,550, citing the Middle East as an overhang. Choice initiated on 22-Sep-2026 with Buy and ₹2,075 (35x the FY28-29E average EPS of ₹52.4/₹66.1). Median: ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. Targets rose through the year as the stock recovered from its March low: MOSL ₹1,360 (Mar) → ₹1,485 (May) → ₹1,765 (Jun) → ₹1,850. Brokers agree on the method (P/E on FY28E) and disagree on the multiple and on how fast the Middle East comes back.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes and press as cited; company letters and calls; GAM Research' } },
  ],
};

const sens = [
  [`Base: four-name travel + internet set (${SET.map(drTxt).join(', ')}; median ${pc(MV.set)})`, `${n1(PE12.med)}x × ${k.toFixed(3)} = ${MULT.base}x`, n0(at(MULT.base))],
  ['No sector move (own 12-month median)', `${n1(PE12.med)}x → ${SENS.none}x`, n0(at(SENS.none))],
  [`Travel names only (${TRAVEL.map(drTxt).join(', ')}; median ${pc(MV.travel)})`, `${n1(PE12.med)}x × ${(1 + MV.travel / 100).toFixed(3)} = ${SENS.travel}x`, n0(at(SENS.travel))],
  [`Internet platforms only (${NET.map(drTxt).join(', ')}; median ${pc(MV.net)})`, `${n1(PE12.med)}x × ${(1 + MV.net / 100).toFixed(3)} = ${SENS.net}x`, n0(at(SENS.net))],
  [`IRCTC's five-name set (${IRS.map(drTxt).join(', ')}; median ${pc(MV.irctc)})`, `${n1(PE12.med)}x × ${(1 + MV.irctc / 100).toFixed(3)} = ${SENS.irctc}x`, n0(at(SENS.irctc))],
  [`Base set plus ixigo (${drTxt('IXIGO')}; median ${pc(MV.ixigo)})`, `${n1(PE12.med)}x × ${(1 + MV.ixigo / 100).toFixed(3)} = ${SENS.ixigo}x`, n0(at(SENS.ixigo))],
  ['Longer window: since Nov-2024 (IPO-premium months skipped)', `${n1(PEX.med)}x × ${k.toFixed(3)} = ${SENS.postIpo}x`, n0(at(SENS.postIpo))],
  ['Last six months only (Apr-Sep 2026, on FY28E EPS)', `${n1(PEH2.med)}x × ${k.toFixed(3)} = ${SENS.h2}x`, n0(at(SENS.h2))],
  ['Street multiples', 'MOSL 35x FY28E; Anand Rathi 40x FY28E; Choice 35x Sep-28E', `${ourAt(ST[0])} / ${ourAt(ST[1])} / ${ourAt(ST[3])}`],
  ['Growth view (not applied)', `~${Math.round(X.epsCagrFwd)}% EPS CAGR FY26-29E (Choice: 42% PAT CAGR) would support more than a market multiple`, 'would argue for more'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(sepNow)}x`,
  blocks: [
    { h: 'How the street values TBO' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our EPS for the same year.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple, s.on, ourAt(s), s.thesis]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'A good platform with operating leverage, priced near its own recent multiple; our FY27-28E EPS is below the street, so we see less upside'] },
    ], source: 'DSIJ summaries of MOSL and Anand Rathi notes (30-Jul-2026); Trendlyne report list (I-Sec, 30-Jul-2026); Choice initiation PDF (22-Sep-2026)' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c; recently listed)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (used)', `Listed 15-May-2024, so we skip the IPO-premium months and use the 12 months to ${ASOF_TXT} (as for HYUNDAI and HDBFS): price ÷ next full-year EPS on every weekly close, median ${n1(PE12.med)}x (25th-75th percentile ${n1(PE12.p25)}-${n1(PE12.p75)}x, n = ${PE12.n}). No trough years (forward EPS FY27E-28E is above FY26). Oct-25 to Mar-26 on FY27E EPS: ${n1(PEH1.med)}x; Apr-Sep 2026 on FY28E: ${n1(PEH2.med)}x. House function (every fifth week): ${n1(FM.median)}x. Since Nov-2024: ${n1(PEX.med)}x`, `**Starting point: ${n1(PE12.med)}x**`],
      ['2. Sector move (same window)', `No listed Indian B2B travel peer. Usable travel names: IRCTC and Thomas Cook only (Easy Trip loss-making; ixigo had a Q2FY26 loss and a 254x P/E inside the window). Fewer than three, so per the thin-peer rule we widen to the internet platforms with a usable P/E history (Info Edge, IndiaMART; Eternal, Nykaa, PB Fintech, Paytm, Swiggy excluded: losses or P/E of 70-1,800x). Trailing P/E at the 30-Sep close vs each name's own median over the same 12 months: ${SET.map(drTxt).join(', ')}. Median of all four: ${pc(MV.set)}. Sub-sets are sensitivity rows`, `**× ${k.toFixed(3)}**`],
      ['3. Growth vs the street\'s multiples', `MOSL's 35x and Anand Rathi's 40x FY28E come with ~50-55% EPS CAGR (FY26-28E); ours is ~${Math.round(X.epsCagrFwd)}% a year to FY29E from a lower FY27E`, 'No adjustment (§7c); see sensitivity'],
      ['4. Peers', `Trailing P/E on ${ASOF_TXT}: TBO ${n1(P.TBOTEK.pe)}x (on depressed FY26-27 earnings), ixigo ${n1(P.IXIGO.pe)}x, Info Edge ${n1(P.NAUKRI.pe)}x, IRCTC ${n1(P.IRCTC.pe)}x, Thomas Cook ${n1(P.THOMASCOOK.pe)}x, IndiaMART ${n1(P.INDIAMART.pe)}x`, 'TBO trades at a growth premium on trailing earnings'],
      ['5. Returns vs cost of capital', 'ROE 18% in FY26 (IPO cash, goodwill), ~19-26% in FY27-29E vs a 12.8% cost of equity', 'Supports a premium multiple, already in the history'],
      ['6. Result (nearest half-turn)', `${n1(PE12.med)}x × ${k.toFixed(3)} = ${n1(PE12.med * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}**`],
      ['7. Bull / bear', `Bull: own median, no sector move (${n1(PE12.med)}x) on bull EPS. Bear: 25th-percentile forward P/E × the four-name move (${n1(PE12.p25)}x × ${k.toFixed(3)}) on bear EPS`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in weekly prices from listing to ${ASOF_TXT}; actual EPS (FY25-26) and GAM estimates (FY27-28E) in the forward series; peers' trailing P/E vs their medians from 1-Oct-2025 to ${ASOF_TXT}` } },
    { pair: [
      { type: 'line', title: `Forward P/E since listing: 12-month median ${n1(PE12.med)}x, now ${n1(fwdNow)}x FY28E`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: SENS.none, text: `12-month median: ${SENS.none}x` }], source: 'Screener.in weekly prices; actual EPS FY25-26, GAM estimates FY27-28E. The step in Apr-2026 is the roll from FY27E to FY28E EPS.' },
      { type: 'hbar', title: 'Target, cross-checks and sensitivities vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'No sector move', 'Since Nov-2024', 'Street median', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), at(SENS.none), at(SENS.postIpo), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(mv('ev').metric)} cr + net cash`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA: TBO's own forward EV/EBITDA median over the same 12 months, ${n1(evMed)}x (25th-75th ${n1(evSt.p25)}-${n1(evSt.p75)}x), × the same ${k.toFixed(3)} sector factor, plus net cash) gives ₹${n0(mv('ev').value)}, close to the P/E value. The DCF gives ₹${n0(mv('dcf').value)}: at a ${n1(V.ke)}% cost of equity, 6% terminal growth and a margin rising to 26% of revenue, but it is flattered by our engine's working-capital inflow (see earnings quality) and ~${n0(V.tvShare)}% of it is terminal value. Both say the price is roughly fair to modestly cheap if our earnings come through; neither supports the 40x the most bullish broker pays.` },
    { exhibit: { type: 'table', title: 'Base and sensitivity rows (peer set, window, street)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c and the thin-peer rule, sub-sets, windows, growth and street views are shown, not added to the base multiple; the base uses the full widened four-name set.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (own median, no sector move).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile × the four-name move).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm excludes treasury income; discounted at the cost of equity (net cash; the acquisition loan is netted in net cash).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed comparables (none is a clean peer)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', '12-month median P/E', 'vs median', '5-yr median P/E', 'ROE'], rows: PEERS.map(p => [p.symbol === 'TBOTEK' ? '**TBO Tek**' : shortName(p.symbol) + (SET.includes(p.symbol) ? '' : ['IXIGO', 'EASEMYTRIP'].includes(p.symbol) ? ' (excluded)' : ' (IRCTC set)'), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', n1(p.pe), n1(MED12[p.symbol]), pc(dr12[p.symbol]), MED5[p.symbol] ? n1(MED5[p.symbol]) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; 12-month medians 1-Oct-2025 to ${ASOF_TXT} (used); five-year medians shown for reference (Screener's P/E history is shorter for IRCTC, TBO and ixigo).` } },
  ],
};

module.exports = { street, valuation };
