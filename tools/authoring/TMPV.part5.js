// TMPV report, part 5: the street and the valuation (SOTP: JLR EV/EBITDA + India PV EV/EBITDA + Tata Technologies at
// market - net debt - minority claims; consolidated EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./TMPV.ctx');
const { D, F, V, n0, n1, pc, rup, price, shares, mv, SP, MULT, jlrSep, pvSep, netSep, TTL_VAL, MINOR, INV_BOOK, sotpAt, sectorDr, sectorDrAll, k, derate, PEERS, USED, EXCL, shortName,
  marMed, marP25, marP75, marKept, marTroughs, jlrMed, jlrP25, jlrP75, jlrNow, consMed, consP25, consNow, own, rating, ST, postQ1, medTp, shortDate, ASOF_TXT } = X;
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const ourAt = s => ({ 'ICICI Securities (retail)': sotpAt(1.5, 14, 0.2), 'Motilal Oswal': sotpAt(2, 13), Nuvama: sotpAt(2, 11), Emkay: sotpAt(1, 20, 0.2) }[s.broker]);
const val = re => SP.find(p => re.test(p.name)).value;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: split from Sell ₹300 to Buy ₹452; everyone uses a sum of the parts with JLR at 1-2x EBITDA`,
  blocks: [
    { p: `Nine houses published after the Q1FY27 results (13-14 Aug-2026): CLSA Outperform ₹452, Nuvama Buy ₹450, Nomura Neutral ₹389, JM Financial Add ₹375, ICICI Securities Hold ₹360, HSBC Hold ₹360, Motilal Oswal Sell ₹310, Citi Sell ₹305 and Jefferies Underperform ₹300: median ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} from the ${ASOF_TXT} close of ₹${n1(price)}. Emkay (Add ₹390) and ICICI Securities' institutional desk (Hold ₹370) last published in June. Every house that discloses a method uses a **sum of the parts: India PV at 11-14x EV/EBITDA (Emkay: 1.4x EV/sales), JLR at 1-2x EV/EBITDA (JM: 3x EV/EBIT), Tata Technologies at market (often less 20%) and investments at book, less net debt.** The bulls bet on India share gains and JLR's launches; the bears on JLR's margins, China and costs. The stock fell ~15% between the results and 30-Sep (₹334.5 weekly close on 14-Aug); we found no company-specific news in that window.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes and summaries to 30-Sep-2026; GAM Research' } },
  ],
};

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: a sum of the parts gives {{dcf.tp|inr}}; at ₹${n1(price)} the market values JLR at ~${n1(jlrNow)}x EBITDA`,
  blocks: [
    { h: 'How the street values TMPV' },
    { p: 'We use the street\'s method so our target is comparable: JLR and India PV separately on EV/EBITDA, on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E), Tata Technologies at its market price, less net debt at the target date (Sep-27E) and the claims of minority investors. The "At our numbers" column applies each broker\'s multiples to our Sep-28E EBITDA and net debt.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our numbers (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple, s.on, ourAt(s) ? n0(ourAt(s)) : '–', rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**SOTP**', `**JLR ${MULT.jlr.base}x, India PV ${MULT.pv.base}x EV/EBITDA; TTL at market**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'The market prices JLR below its own post-demerger history and India PV below Maruti'] },
    ], source: 'ICICI Direct and Emkay notes (PDFs); MOSL June note (PDF) and Aug update; Nuvama, CLSA, HSBC via Business Today (14/17-Aug-2026); JM via TradingView/Moody\'s; Nomura, Citi via Moneycontrol/TradingView; Jefferies via Business Standard headline; ICICI Securities institutional via Trendlyne' } },
    { h: `Our sum of the parts: JLR ${MULT.jlr.base}x, India PV ${MULT.pv.base}x` },
    { exhibit: { type: 'table', title: 'Sum of the parts (₹ crore unless stated)', head: ['Part', 'Metric', 'Multiple (bull / bear)', 'Value', '₹ / share', 'Basis'], wide: [5], rows: [
      ['**Jaguar Land Rover**', `Sep-28E EBITDA ${n0(jlrSep)}`, `${MULT.jlr.base}x (${MULT.jlr.bull}x / ${MULT.jlr.bear}x)`, n0(val(/Jaguar/)), n0(val(/Jaguar/) / shares), 'Company EBITDA definition (incl. R&D credits)'],
      ['**Tata Passenger Vehicles (India)**', `Sep-28E EBITDA ${n0(pvSep)}`, `${MULT.pv.base}x (${MULT.pv.bull}x / ${MULT.pv.bear}x)`, n0(val(/India/)), n0(val(/India/) / shares), 'Incl. PLI in FY28E, none in FY29E'],
      ['Tata Technologies (53.35%)', `₹${X.closes.TATATECH} x 40.61 cr shares`, 'market', n0(TTL_VAL), n0(TTL_VAL / shares), 'No holding discount (street: 20%)'],
      ['Less: minority claims outside TTL', 'Book', '', `(${n0(MINOR)})`, `(${n0(MINOR / shares)})`, 'NCI less TTL\'s share, plus CCPS liability of the EV subsidiary'],
      ['Less: net debt at Sep-27E', 'Model', '', `(${n0(-netSep)})`, `(${n0(-netSep / shares)})`, `Company-basis net debt less ₹${n0(INV_BOOK)} cr of investments at book (China JV, associates)`],
      { hl: true, cells: ['**Equity value / target**', '', '', `**${n0(V.sotp.equity)}**`, '**{{dcf.tp|inr}}**', 'vs CMP ₹{{P.last|n1}}: {{dcf.upside|chg}}'] },
      ['Bull / bear', '', '', '', '{{scen.bull.tp|inr}} / {{scen.bear.tp|inr}}', 'Scenario earnings and multiples'],
    ], source: 'GAM Research (assumptions.json valuation.parts; multiples written by TMPV.sotp.js)' } },
    { exhibit: { type: 'table', title: 'Deriving the multiples (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own history: from the demerger only', `Before 14-Oct-2025 the stock included trucks, and FY26 earnings include the cyber attack and an ₹82,616 cr demerger gain, so the house forward-P/E median is not usable (every post-demerger forward year is a "trough" against FY26's inflated EPS). We measure TMPV's own EV/EBITDA on ${own.length} weekly closes from 17-Oct-2025 to ${ASOF_TXT}, against our forward EBITDA (FY27E to Mar-26, FY28E after).`, '12-month window, as allowed for new listings (§7c)'],
      ['2. India PV proxy: Maruti Suzuki', `Maruti's one-year-forward EV/EBITDA (market value less net cash, on reported next-year EBITDA) on ${marKept.length} dates, Apr-2021 to Mar-2025: median ${n1(marMed)}x (25th-75th ${n1(marP25)}-${n1(marP75)}x)${marTroughs.length ? '; trough years left out: ' + marTroughs.join(', ') : '; no trough years'}`, `Starting point for India PV: ${n1(marMed)}x`],
      ['3. JLR: what TMPV\'s own price implied', `Each week: market value + company net debt + minority claims − investments at book − Tata Technologies at market − India PV at ${n1(marMed)}x forward EBITDA, divided by JLR forward EBITDA. Median ${n1(jlrMed)}x (25th-75th ${n1(jlrP25)}-${n1(jlrP75)}x); ${n1(jlrNow)}x on ${ASOF_TXT}`, `Starting point for JLR: ${n1(jlrMed)}x`],
      ['4. Sector de-rating', `Auto-OEM peers' trailing P/E on ${ASOF_TXT} vs five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded as distorted: ${EXCL.map(s => `${shortName(s)} (${pc(derate[s])})`).join(', ')}; with them ${pc(sectorDrAll)}. Hyundai (listed 2024) has no five-year history`, `× ${k.toFixed(3)}`],
      ['5. Result (nearest half-turn)', `JLR ${n1(jlrMed)}x × ${k.toFixed(3)} = ${n1(jlrMed * k)}x; India PV ${n1(marMed)}x × ${k.toFixed(3)} = ${n1(marMed * k)}x`, `**JLR ${MULT.jlr.base}x; India PV ${MULT.pv.base}x**`],
      ['6. Bull / bear', 'Bull: no de-rating. Bear: 25th percentile, de-rated', `JLR ${MULT.jlr.bull}x / ${MULT.jlr.bear}x; India PV ${MULT.pv.bull}x / ${MULT.pv.bear}x`],
      ['7. Against the street', 'Street JLR 1-2x EV/EBITDA, India PV 11-14x', 'Our multiples sit inside the street ranges'],
    ], source: `Screener.in prices to ${ASOF_TXT}; company net debt by quarter (published dates); GAM estimates for forward EBITDA` } },
    { pair: [
      { type: 'line', title: `JLR multiple implied by TMPV's price: ~3x in late 2025, ${n1(jlrNow)}x now`, unit: 'Implied JLR EV ÷ forward EBITDA (x)', x: own.map(o => o.d), series: [{ name: 'Implied JLR EV/EBITDA', values: own.map(o => o.jlr), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: MULT.jlr.base, text: `Our JLR multiple: ${MULT.jlr.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; company net debt; GAM forward EBITDA; India PV at Maruti\'s median' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['SOTP (target)', 'EV/EBITDA (consolidated)', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('sotp').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'SOTP (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**Sum of the parts**', '**Target**', 'Sep-28E EBITDA by segment; net debt Sep-27E', `JLR ${MULT.jlr.base}x, India PV ${MULT.pv.base}x`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA (consolidated)', 'Cross-check', `Sep-28E EBITDA ₹${n0(X.sep(F.ebitda))} cr (Screener basis) + net cash`, `${MULT.ev.base}x (bull ${MULT.ev.bull}x, bear ${MULT.ev.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-37E, WACC {{dcf.ke|n1}}%, g 5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** TMPV's own consolidated forward EV/EBITDA since the demerger has a median of ${n1(consMed)}x (${n1(consNow)}x on ${ASOF_TXT}); de-rated and rounded, ${MULT.ev.base}x on Sep-28E EBITDA gives ₹${n0(mv('ev').value)}. It is above the SOTP because it ignores the minority claims and values Tata Technologies at its EBITDA. The DCF (₹${n0(mv('dcf').value)}) is above both but fragile: terminal value is ${Math.round(V.tvShare)}% of it, and the bear-case DCF is close to zero. All three methods say the stock is cheap on our earnings; the risk is the earnings.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: [
      ['Street median multiples', 'JLR 2x, India PV 12x', n0(sotpAt(2, 12))],
      ['Street holding discount on Tata Technologies', '20% off market value', n0(sotpAt(MULT.jlr.base, MULT.pv.base, 0.2))],
      ['JLR at the market\'s current implied multiple', `JLR ${n1(jlrNow)}x`, n0(sotpAt(jlrNow, MULT.pv.base))],
      ['India PV at a margin-adjusted Maruti multiple', `Maruti ${n1(marMed * k)}x × (TMPV India margin ÷ Maruti's ~11%) ≈ 7x`, n0(sotpAt(MULT.jlr.base, 7))],
      ['No sector de-rating', `JLR ${n1(jlrMed)}x, India PV ${n1(marMed)}x`, n0(sotpAt(jlrMed, marMed))],
      ['Returns view', 'JLR ROCE below 10% until FY29E; India PV returns low: a discount, if anything', 'not applied (§7c)'],
    ], source: 'GAM Research. Per PLAYBOOK §7c, growth and returns views are shown, not added to the base multiples.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiples: JLR ${MULT.jlr.bull}x, India PV ${MULT.pv.bull}x.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `JLR revenue GBP25.5bn / 27.3bn / 28.8bn at 8.8% / 11.0% / 11.8% EBITDA; India volumes +20% / +12% / +11%; JLR ${MULT.jlr.base}x, India PV ${MULT.pv.base}x Sep-28E.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiples: JLR ${MULT.jlr.bear}x, India PV ${MULT.pv.bear}x.`],
    ], source: 'GAM Research. Net debt, Tata Technologies and minority claims as in the base.' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-37E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27E (Screener basis; negative = net debt)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. The engine discounts at one rate; beta 0.75 sets it at our 11% WACC. Minority claims are not deducted in the DCF.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): WACC down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed auto peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), derate[p.symbol] == null ? '–' : pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']).concat([['**Tata Motors PV**', n0(X.mcap), n0(X.A26.consRev), '5.6%', 'n.m.', '–', 'n.m.', 'n.m.']]), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT} (EV on Screener's definition, cash only). M&M on Screener's standalone basis. TMPV's trailing P/E and ROE are distorted by the FY26 demerger gain.` } },
  ],
};

module.exports = { street, valuation };
