// Craftsman Automation report, part 5: the street and the valuation (P/E on Sep-28E EPS, multiple derived from the stock's
// own forward P/E history since Apr-2021 and the auto-component de-rating; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./CRAFTSMAN.ctx');
const { D, F, V, A, b, n0, n1, pc, price, shares, mv, FM, FMapr22, fmP25, fmP75, weeklyMed, exFy25Med, buckets, sectorDr, sectorDrAll, sectorDrBf, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, SENS, epsSep, evMed, evP25, evNow, evMULT, evConv, ttmEbitda, ebitdaSep28, rating, ST, postQ1, medTp, shortDate, ASOF_TXT, medOf, sepNow, peg, epsCagrFwd, trailPe } = X;
const r10 = v => Math.round(v / 10) * 10, E = epsSep.base;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const peerPe = medOf(USED.map(s => P[s].pe));
const evNet = mv('ev').value * shares - evMULT.base * ebitdaSep28; // net cash (negative = net debt) used by the EV method
const evAt = m => r10((m * ebitdaSep28 + evNet) / shares);

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street after Q1: one Buy (EV/EBITDA), one Neutral (P/E); the stock ran past the Neutral target',
  blocks: [
    { p: `Two notes after the Q1FY27 results were visible to us. **Emkay** (Buy, 31-Jul-2026) raised its target 14% to ₹11,900 at 17x Jun-28E EV/EBITDA (from 15x), arguing that Craftsman is "entering a strong growth phase" as large-engine castings, Sunbeam's turnaround and new aluminium capacity pay off. **Motilal Oswal** (Neutral since 2024) moved to ₹9,699 at 28x FY28E EPS, saying the run-up already prices in the strong delivery. Both forecast FY28E EPS of ~₹347-349. Median of the two targets: ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. An S&P consensus of eight analysts showed an average target of ₹11,371 (31-Jul-2026). The stock rose from ~₹10,050 on results day to ₹${n0(price)}.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Source'], wide: [0], rows: D.critiques.map(c => [rup(c), 'GAM Research from company disclosures']), source: 'Annual reports, presentations, exchange filings; GAM Research' } },
  ],
};

const ourAt = s => { const m = String(s.multiple).match(/(\d+(?:\.\d+)?)x/); if (!m) return '–'; return s.method === 'P/E' ? n0(r10(+m[1] * F.eps[1])) : s.method === 'EV/EBITDA' ? n0(evAt(+m[1])) : '–'; };
const sens = [
  ['From Apr-2022 (first year after listing left out)', `${n1(FMapr22.median)}x × ${k.toFixed(3)} = ${SENS.apr22}x`, n0(r10(SENS.apr22 * E))],
  ['Every weekly close (not every fifth) since Apr-2021', `${n1(weeklyMed)}x × ${k.toFixed(3)} = ${SENS.weekly}x`, n0(r10(SENS.weekly * E))],
  ['Leaving out FY25 as a forward year (Apr-23 to Mar-24 prices on FY25 EPS that fell 43% on Sunbeam and the QIP; not a trough under the house rule)', `${n1(exFy25Med)}x × ${k.toFixed(3)} = ${SENS.exFy25}x`, n0(r10(SENS.exFy25 * E))],
  ['Bharat Forge kept in the peer set', `de-rating ${pc(sectorDrBf)} → ${SENS.withBf}x`, n0(r10(SENS.withBf * E))],
  ['No sector de-rating (bull multiple)', `${MULT.bull}x`, n0(r10(MULT.bull * E))],
  ['Motilal Oswal\'s 28x on our FY28E EPS', `28x × ₹${n1(F.eps[1])}`, n0(r10(28 * F.eps[1]))],
  ['Emkay\'s 17x EV/EBITDA on our Sep-28E EBITDA', `17x × ₹${n0(ebitdaSep28)} cr less net debt`, n0(evAt(17))],
  ['Growth premium', `EPS +${Math.round(epsCagrFwd)}% a year FY26-29E (pro forma base); PEG at our multiple ${peg.toFixed(1)}x. The Apr-2021 to Sep-2026 median already covers years of 40%+ revenue growth, so no premium is added (§7c)`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${Math.round(sepNow)}x`,
  blocks: [
    { h: 'How the street values Craftsman' },
    { p: 'We use P/E on one-year-forward EPS, the method Motilal Oswal has used in every note since 2024 (24x Sep-27E, 25x Dec-27E, now 28x FY28E) and the house method for auto components, and test it against Emkay\'s EV/EBITDA. Our earnings year is Sep-28E (half FY28E, half FY29E): what the market will look at in September 2027. "At our numbers" applies a broker\'s multiple to our EPS or EBITDA for its year.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our numbers (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp ? n0(s.tp) : 'n.d.', s.method, s.multiple || 'n.d.', s.on || 'n.d.', ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Capable operator, but returns are mediocre and the price is far above the stock\'s own forward-P/E history while the sector trades below its own'] },
    ], source: 'Emkay result note (31-Jul-2026); DSIJ summary of the MOSL note (30-Jul-2026); Trendlyne report list. Earlier: ICICI Securities Buy ₹7,900 (Nov-2025, not updated in our sources).' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (house function)', `One-year-forward P/E (price ÷ next full year's EPS; reported EPS, then ours on post-QIP shares) from Apr-2021 (listed 25-Mar-2021): median ${n1(FM.median)}x (25th-75th percentile ${n1(fmP25)}-${n1(fmP75)}x); no trough years (FY25 EPS ₹81.6 was above half the FY24 peak of ₹144.1). By forward year: ${buckets.map(x => `${x.fy} ${n1(x.med)}x`).join(', ')}`, `**Starting point: ${n1(FM.median)}x**`],
      ['2. Sector de-rating', `Auto-component peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded: ${EXCL.map(s => `${shortName(s)} (${pc(derate[s])}; ${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join('; ')}; all eleven ${pc(sectorDrAll)}. Craftsman itself (${pc(derate.CRAFTSMAN)}) is not used`, `× ${k.toFixed(3)}`],
      ['3. Growth vs the street', `Brokers forecast FY28E EPS of ~₹347-349 and pay 28x (MOSL); we forecast ₹${n1(F.eps[1])} because of higher depreciation and interest. EPS +${Math.round(epsCagrFwd)}% a year FY26-29E on our numbers`, 'No adjustment (§7c); see sensitivity'],
      ['4. Peers', `Peer median trailing P/E ${n1(peerPe)}x; Craftsman ${n1(P.CRAFTSMAN.pe)}x (TTM on post-QIP shares ${n1(trailPe)}x) with a 15% EBITDA margin and 12-13% ROE`, `Craftsman trades at a ${pc((P.CRAFTSMAN.pe / peerPe - 1) * 100)} premium to peers`],
      ['5. Returns', `ROE ~12.5% in FY26 (Screener), ~{{F.roe.2|pct}} by FY29E in our model vs a ${n1(V.ke)}% cost of equity`, 'At or below the cost of equity: no case for a premium'],
      ['6. Result (nearest half-turn)', `${n1(FM.median)}x × ${k.toFixed(3)} = ${n1(FM.median * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(E)}**`],
      ['7. Bull / bear', `Bull: no de-rating (${n1(FM.median)}x). Bear: 25th-percentile forward P/E, de-rated (${n1(fmP25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; GAM estimates for FY27-28E EPS in the forward series` } },
    { pair: [
      { type: 'line', title: `Forward P/E since Apr-2021: median ${n1(FM.median)}x; now ${n1(sepNow)}x on Sep-28E`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdWeekly.map(x => x[0]), series: [{ name: 'Forward P/E (weekly)', values: X.fwdWeekly.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median since Apr-21: ${n1(FM.median)}x` }, { v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; reported EPS, GAM estimates for FY27-28E. The FY24-period spike is FY25 EPS falling 43%.' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(E)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr less net debt`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 6%, less net debt', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA less net debt) gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is Craftsman's ${n1(evMed)}x median trailing EV/EBITDA since Apr-2021 (Screener), cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating and restated from trailing (₹${n0(ttmEbitda)} cr to Jun-26) to Sep-28E EBITDA (× ${evConv.toFixed(3)}). The stock trades at ${n1(evNow)}x trailing EBITDA, far above that median. Emkay's 17x on our Sep-28E EBITDA would give ~₹${n0(evAt(17))}, above the price, but 17x forward is about twice what the stock's own history implies once restated to forward EBITDA. The DCF gives ₹${n0(mv('dcf').value)} at a ${n1(V.ke)}% cost of equity (₹${n0(V.sens.grid[0][4])} at ${n1(V.sens.waccs[0])}% and ${n1(V.sens.gs[4])}% growth): a business that reinvests 8-15% of revenue for ~16% EBITDA margins does not produce enough free cash to justify ₹${n0(price)}. All three of our methods point below the share price.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, window choices, peer sub-sets, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated). Leverage magnifies the EPS fall.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27 (shown negative)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm; the engine discounts at the cost of equity (net debt is ~5-8% of enterprise value after the QIP, so a WACC would be only slightly lower: see the grid).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed auto-component peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'CRAFTSMAN' ? '**Craftsman**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : 'Dec year', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', n1(p.pe), derate[p.symbol] != null ? pc(derate[p.symbol]) : '–', n1(p.evEbitda), p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT} (Craftsman on reported TTM EPS). Schaeffler reports on December years. Same peer set as the Bosch, Motherson, Uno Minda and Sona initiations.` } },
  ],
};

module.exports = { street, valuation };
