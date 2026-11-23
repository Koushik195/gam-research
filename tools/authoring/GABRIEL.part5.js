// Gabriel India report, part 5: the street and the valuation (P/E on Sep-28E EPS, multiple derived from the stock's own
// forward P/E since the scheme was announced and the auto-component move over the same window; EV/EBITDA and DCF
// cross-checks; scenarios; peers).
const X = require('./GABRIEL.ctx');
const { D, F, V, n0, n1, pc, price, shares, mv, FMs, FMhouse, oldMed, fullMed, buckets, sectorW, sectorWAll, sector5, k, k5, drW, dr5, P, PEERS, USED, EXCL, shortName,
  MULT, SENS, epsSep, evMed, evP25, evNow, evMULT, evConv, scrEbitda, ebitdaSep28, rating, ST, postQ1, medTp, shortDate, ASOF_TXT, medOf, sepNow, epsCagrFwd, trailPe, exJupEps, MEDW } = X;
const r10 = v => Math.round(v / 10) * 10, E = epsSep.base;
const rup = s => String(s).replace(/Rs ?(?=[0-9])/g, '₹');
const drTxt = s => `${shortName(s)} ${pc(drW[s])}`;
const peerPe = medOf(USED.map(s => P[s].pe));
const evNet = mv('ev').value * shares - evMULT.base * ebitdaSep28;
const evAt = m => r10((m * ebitdaSep28 + evNet) / shares);

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street after Q1 and Jupiter: three Buys, one Reduce; targets ₹1,315-1,674',
  blocks: [
    { p: `Four notes followed the Q1FY27 results and Project Jupiter (21-Jul-2026). **Motilal Oswal** (Buy, ₹1,664) and **ICICI Securities** (Buy, ₹1,650) both pay ~40x FY28E EPS for a "diversified mobility platform" and the group's consolidation path; ICICI's FY28E PAT of ₹787 cr sums standalone, sunroof, group-company and HL Mando Anand profits. **Arihant** (Buy, ₹1,674) uses a sum of the parts (Dana and Henkel at 14x EV/EBITDA, the Jupiter stakes at deal value, the core at 37x). **Choice** (Reduce, ₹1,315) raised its multiple from 28x to 32x but says the rally has run ahead. Median target ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. Before the results: Motilal Oswal ₹1,266 (initiation, 35x FY28E, 9-Jun-2026), Elara ₹1,381, Choice ₹1,050 (28x).` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Source'], wide: [0], rows: D.critiques.map(c => [rup(c), 'GAM Research from company disclosures']), source: 'Exchange filings, results, decks and calls; GAM Research' } },
  ],
};

const ourAt = s => { const m = String(s.multiple).match(/(\d+(?:\.\d+)?)x/); if (!m || s.method !== 'P/E') return '–'; return n0(r10(+m[1] * F.eps[1])); };
const sens = [
  ['House forwardMedian (every 5th weekly point, post-Jupiter EPS throughout) since Jul-2025', `${n1(FMhouse.median)}x × ${k.toFixed(3)} = ${SENS.house}x`, n0(r10(SENS.house * E))],
  ['Same median, five-year sector move instead of the same-window move', `${n1(FMs.median)}x × ${k5.toFixed(3)} (${pc(sector5)}) = ${SENS.five}x`, n0(r10(SENS.five * E))],
  ['Bharat Forge kept in the peer set (same window)', `move ${pc(sectorWAll)} → ${SENS.withBf}x`, n0(r10(SENS.withBf * E))],
  ['Full history since Apr-2021 (old-company EPS to Jun-2025, then post-scheme), five-year sector move', `${n1(fullMed)}x × ${k5.toFixed(3)} = ${SENS.full}x`, n0(r10(SENS.full * E))],
  ['Pre-scheme company only (Apr-2021 to Jun-2025)', `${n1(oldMed)}x × ${k5.toFixed(3)} = ${SENS.old}x`, n0(r10(SENS.old * E))],
  ['No sector move (bull multiple)', `${MULT.bull}x`, n0(r10(MULT.bull * E))],
  ['Motilal Oswal / ICICI Securities: ~40x on our FY28E EPS', `40x × ₹${n1(F.eps[1])}`, n0(r10(40 * F.eps[1]))],
  ['Choice: 32x on our FY28E EPS', `32x × ₹${n1(F.eps[1])}`, n0(r10(32 * F.eps[1]))],
  ['Growth premium', `EPS +${Math.round(epsCagrFwd)}% a year FY26-29E (restated base, today's shares), much of it from buying stakes; the post-scheme median already prices the new structure, so no premium is added (§7c)`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(sepNow)}x`,
  blocks: [
    { h: 'How the street values Gabriel' },
    { p: 'We use P/E on one-year-forward EPS, the method three of the four post-Q1 notes use (on FY28E) and the house method for auto components, and test it against EV/EBITDA and a DCF. Our earnings year is Sep-28E (half FY28E, half FY29E): what the market will look at in September 2027. "At our numbers" applies a broker\'s P/E to our FY28E EPS.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp ? n0(s.tp) : 'n.d.', s.method, s.multiple || 'n.d.', s.on || 'n.d.', ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'A sound franchise plus better-quality stakes; the price already pays the post-scheme multiple on EPS above ours'] },
    ], source: 'Broker notes and summaries as cited in deep.json (22-24 Jul-2026); Trendlyne report list.' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { p: `The scheme changed what a Gabriel share is: before Jul-2025 it was a single-product ride-control company trading at ~${Math.round(oldMed)}x forward earnings; since the board approved the scheme (30-Jun-2025) the market has priced the restructured company, with stakes in group JVs. Like the Motherson and Aster DM initiations, we start the own-history window at that event. Because the window is ~15 months, we compare it with the peers' move against their own medians over the same window (the Hyundai precedent), not five years. Forward EPS in the window is what the market could know: the post-scheme company without the Jupiter stakes until 20-Jul-2026 (₹${n1(exJupEps[0])} FY27E, ₹${n1(exJupEps[1])} FY28E on 17.72 cr shares), our post-Jupiter EPS after.` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E since the scheme', `Price ÷ next full year's EPS, every weekly close from 1-Jul-2025 to ${ASOF_TXT} (${FMs.n} points): median ${n1(FMs.median)}x (25th-75th percentile ${n1(FMs.p25)}-${n1(FMs.p75)}x); no trough years. By period: ${buckets.map(x => `${x.k} ${n1(x.med)}x`).join('; ')}. House forwardMedian on the same window: ${n1(FMhouse.median)}x`, `**Starting point: ${n1(FMs.median)}x**`],
      ['2. Sector move (same window)', `Auto-component peers' trailing P/E on ${ASOF_TXT} vs their own medians since 1-Jul-2025: ${USED.map(drTxt).join(', ')}; median ${pc(sectorW)}. Excluded: ${EXCL.map(s => `${shortName(s)} (${pc(drW[s])}; ${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join('; ')}; all ten ${pc(sectorWAll)}. Against five-year medians the move is ${pc(sector5)}. Gabriel itself is not used`, `× ${k.toFixed(3)}`],
      ['3. Growth vs the street', `Brokers pay 32-40x for FY28E EPS of ₹35-41; ours is ₹${n1(F.eps[1])}. EPS +${Math.round(epsCagrFwd)}% a year FY26-29E on our numbers, two-thirds of it from FY28E's full year of HL Mando Anand`, 'No adjustment (§7c); see sensitivity'],
      ['4. Peers', `Peer median trailing P/E ${n1(peerPe)}x; Gabriel ${n1(trailPe)}x on restated TTM EPS and today's shares (Screener ${n1(P.GABRIEL.pe)}x on its mixed TTM)`, `Gabriel trades at a ${pc((trailPe / peerPe - 1) * 100)} premium to peers`],
      ['5. Returns', `ROE ~{{F.roe.1|pct}} in FY28E in our model vs a ${n1(V.ke)}% cost of equity; restated FY26 profit on restated Mar-26 equity ~22%`, 'Slightly above the cost of equity: no case for a premium'],
      ['6. Result (nearest half-turn)', `${n1(FMs.median)}x × ${k.toFixed(3)} = ${n1(FMs.median * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(E)}**`],
      ['7. Bull / bear', `Bull: no sector move (${n1(FMs.median)}x). Bear: 25th-percentile forward P/E since the scheme, with the move (${n1(FMs.p25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; GAM estimates for forward EPS (pre-Jupiter until 20-Jul-2026)` } },
    { pair: [
      { type: 'line', title: `Forward P/E: ~${Math.round(oldMed)}x before the scheme, ${n1(FMs.median)}x median since`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdAll.map(x => x[0]), series: [{ name: 'Forward P/E (weekly)', values: X.fwdAll.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FMs.median, text: `Median since Jul-25: ${n1(FMs.median)}x` }, { v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; old-company EPS (standalone FY22-23, consolidated FY24-26 as reported) to Jun-2025; GAM post-scheme EPS after' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(E)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr plus net cash and stakes at book`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF of the operations FY28-42E, Ke {{dcf.ke|n1}}%, g 5.5%, plus net cash and stakes at book', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us, and their limits.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA) gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is Gabriel's ${n1(evMed)}x median trailing EV/EBITDA since Jul-2025 (Screener), cut by the same ${Math.abs(sectorW).toFixed(1)}% move and restated from Screener's trailing EBITDA (₹${n0(scrEbitda)} cr) to our Sep-28E (× ${evConv.toFixed(3)}). The DCF gives ₹${n0(mv('dcf').value)}. Both value only the operations on cash flow and add the stakes at book (~₹3,700 cr plus retained profits), which understates Dana Anand and Henkel Anand (book ~₹395 cr; at Arihant's 14x EV/EBITDA they would be worth ~₹3,100 cr, ~₹160 a share more). With that added, the DCF would still be below the price: on our cash flows the operations alone are worth ~₹${n0(r10(V.ev / shares))} a share before debt, because ~9-10% EBITDA margins and steady capex leave modest free cash. The P/E method is the one that captures the stakes at a market-like multiple, which is why the street and we use it.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, window choices, peer sub-sets, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector move). JV profits as in the base.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; JV share ₹${X.jvTot.map(n0).join(' / ')} cr; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile since the scheme, with the move).`],
    ], source: 'GAM Research. Scenarios flex the operations; a 20% shortfall in JV profits would take a further ~₹' + n0(X.jvTot[1] * 0.2 / shares * MULT.base) + ' a share off any case.' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow (operations)', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value of the operations', '{{dcf.ev|num}}'],
      ['Plus: net cash and JV/associate stakes at book, Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm of the consolidated operations (the JV share is excluded); the engine discounts at the cost of equity.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed auto-component peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs median since Jul-25', 'vs 5-yr median', 'ROE'], rows: PEERS.map(p => [p.symbol === 'GABRIEL' ? '**Gabriel India**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), p.symbol === 'GABRIEL' ? n0(price * shares) : n0(p.mcapCr), p.symbol === 'GABRIEL' ? '5,245 (restated)' : p.revenue ? n0(p.revenue) : 'Dec year', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.symbol === 'GABRIEL' ? n1(trailPe) : n1(p.pe), drW[p.symbol] != null ? pc(drW[p.symbol]) : '–', dr5[p.symbol] != null ? pc(dr5[p.symbol]) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; Gabriel at 19.16 cr shares and restated TTM EPS (its EBITDA margin and ROE are Screener's FY26 as reported). Schaeffler reports on December years. Same peer set as the Endurance and Craftsman initiations.` } },
  ],
};

module.exports = { street, valuation };
