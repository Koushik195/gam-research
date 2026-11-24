// Olectra Greentech report, part 5: the street and the valuation (P/E on Sep-28E EPS, multiple derived from the stock's own
// forward P/E history since Apr-2021 and the auto-OEM de-rating; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./OLECTRA.ctx');
const { D, F, V, n0, n1, pc, price, shares, mv, FM, fmP25, fmP75, weeklyMed, breakMed, r12Med, exHypeMed, buckets, sectorDr, sectorBreak, sector12, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, SENS, epsSep, evMed, evP25, evNow, evMULT, evConv, ttmEbitda, ebitdaSep28, medOf, sepNow, peg, epsCagrFwd, ASOF_TXT, ST, medTp } = X;
const r10 = v => Math.round(v / 10) * 10, E = epsSep.base;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const peerPe = medOf(USED.map(s => P[s].pe));
const evNet = mv('ev').value * shares - evMULT.base * ebitdaSep28; // net cash (negative = net debt) used by the EV method
const dcfPe = mv('dcf').value / E;
const { ratingFor } = require('../../src/ratings');
const rt = m => ratingFor((r10(m * E) / price - 1) * 100);

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: one standing target (₹${n0(medTp)}, Jul-2026) and an expired Geojit call`,
  blocks: [
    { p: rup(`${D.street._note} ${D.street.methodView}`) },
    { exhibit: { type: 'table', title: 'Broker and research targets found (as they stood on 30-Sep-2026)', head: ['Source', 'Date', 'Rating', 'Target (₹)', 'Method', 'Standing on 30-Sep-2026?'], wide: [4], rows: ST.map(s => [s.broker, s.date, s.rating, n0(s.tp), rup(s.method), s.standing ? 'Yes' : `No: ${rup(s.standingNote)}`]), source: 'Trendlyne research list (Geojit BNP Paribas); Univest blog (Uniresearch Global, SEBI RA INH000013776). Aggregator \'consensus\' pages without named brokers or dates are not used.' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Source'], wide: [0], rows: D.critiques.map(c => [rup(c), 'GAM Research from company disclosures, ICRA and press']), source: 'AR FY26; ICRA (6-Oct-2025); Free Press Journal (26-May-2025); The Hitavada (1-Apr-2026); call summaries' } },
    { callout: '**What the bulls say:** India is electrifying its buses with central money, Olectra has one of the largest order books and a new 5,000-bus plant, trucks and insulators add options, and the stock is 44% below its peak. **What the bears say:** the order book belongs to the parent\'s operator, the company missed its FY26 delivery target by a third, profits stalled in Q1FY27 even as revenue rose 66%, and the cash flow is negative.' },
  ],
};

const sens = [
  ['Rule as written, every weekly close (not every fifth)', `${n1(weeklyMed)}x × ${k.toFixed(3)} = ${SENS.weekly}x`, n0(r10(SENS.weekly * E))],
  ['Turnaround check: window starting at the FY22 earnings break (Apr-2022), peers vs their medians over the same window', `${n1(breakMed)}x × ${(1 + sectorBreak / 100).toFixed(3)} = ${SENS.break}x`, n0(r10(SENS.break * E))],
  ['Last 12 months only (Oct-2025 to Sep-2026), peers vs their 12-month medians', `${n1(r12Med)}x × ${(1 + sector12 / 100).toFixed(3)} = ${SENS.r12}x`, n0(r10(SENS.r12 * E))],
  ['Leaving out the e-bus re-rating (prices Apr-2022 to Mar-2025, forward P/E 60-75x; not a trough under the house rule)', `${n1(exHypeMed)}x × ${k.toFixed(3)} = ${SENS.exHype}x`, n0(r10(SENS.exHype * E))],
  ['No sector de-rating (bull multiple)', `${MULT.bull}x`, n0(r10(MULT.bull * E))],
  ['JBM Auto\'s trailing P/E (the other listed e-bus maker)', `${n1(P.JBMA.pe)}x`, n0(r10(SENS.jbma * E))],
  ['Auto-OEM peer median trailing P/E', `${n1(peerPe)}x`, n0(r10(peerPe * E))],
  ['P/E implied by our DCF', `₹${n0(mv('dcf').value)} ÷ ₹${n1(E)} = ${n1(dcfPe)}x`, n0(r10(mv('dcf').value))],
  ['Growth premium or discount', `EPS +${Math.round(epsCagrFwd)}% a year FY26-29E; PEG at our multiple ${peg.toFixed(1)}x. Not applied (§7c)`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the DCF says the cash flows do not support it`,
  blocks: [
    { h: 'How we value Olectra' },
    { p: 'The market quotes Olectra on P/E, and the one broker with a published record of calls (Geojit) valued it on P/E. We use P/E on one-year-forward EPS at the target date: Sep-28E (half FY28E, half FY29E), what the market will look at in September 2027. EV/EBITDA and a DCF are cross-checks only. A sum-of-the-parts (insulators valued like an electrical-equipment maker) would add little: insulators are 14% of revenue, and no note we found values them separately.' },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (house function)', `One-year-forward P/E (price ÷ next full year's EPS; reported EPS, then ours) from Apr-2021: median ${n1(FM.median)}x (25th-75th percentile ${n1(fmP25)}-${n1(fmP75)}x). No trough years: forward EPS (FY23 onwards, ₹7.99 to ₹${n1(F.eps[1])}) never fell below half its prior three-year high. By forward year: ${buckets.map(x => `${x.fy} ${n1(x.med)}x`).join(', ')}`, `**Starting point: ${n1(FM.median)}x**`],
      ['2. Turnaround check', `EPS broke out of near-zero in FY22 (₹0.98 in FY21, ₹4.31 in FY22), but the forward EPS in the window starts at FY23 (₹7.99) and rises steadily, and the early years carry a high P/E, not a low one; the turnaround rule (start at the break) does not apply as written. Starting at Apr-2022 anyway gives ${n1(breakMed)}x (sensitivity)`, 'Rule as written'],
      ['3. Sector de-rating', `Auto-OEM peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)} (${sectorDr.toFixed(1)}%). Excluded: ${EXCL.map(s => `${shortName(s)} (${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join('; ')}; the same median with them. Olectra itself (${pc(derate.OLECTRA)}) is not used. Why OEMs: ${rup(D.peers.notSelf.split('Why auto OEMs: ')[1].split(' The auto-component')[0])}`, `× ${k.toFixed(3)}`],
      ['4. Growth', `EPS +${Math.round(epsCagrFwd)}% a year FY26-29E on our numbers, back-loaded (FY27E ${pc(F.epsGrowth[0])}). No broker EPS to compare`, 'No adjustment (§7c)'],
      ['5. Peers', `Auto-OEM peer median trailing P/E ${n1(peerPe)}x; Olectra ${n1(P.OLECTRA.pe)}x; JBM Auto ${n1(P.JBMA.pe)}x`, `Olectra trades at a ${pc((P.OLECTRA.pe / peerPe - 1) * 100)} premium to OEM peers`],
      ['6. Returns', `ROE 15.8% in FY26 (Screener), {{F.roe.0|pct}} → {{F.roe.2|pct}} in our model vs a ${n1(V.ke)}% cost of equity`, 'At or above the cost of equity: no case for a discount on returns alone'],
      ['7. Result (nearest half-turn)', `${n1(FM.median)}x × ${k.toFixed(3)} = ${n1(FM.median * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(E)}**`],
      ['8. Bull / bear', `Bull: no de-rating (${n1(FM.median)}x). Bear: 25th-percentile forward P/E, de-rated (${n1(fmP25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; GAM estimates for FY27-28E EPS in the forward series` } },
    { callout: `**The honest caveat.** The ${n1(FM.median)}x median is not a trough artefact, but it is built on the 2022-25 years when the market priced Olectra as India's e-bus champion at 60-75x forward earnings. Without them the median is ${n1(exHypeMed)}x and the target ~₹${n0(r10(SENS.exHype * E))} (${rt(SENS.exHype)}); on the last twelve months alone, ${SENS.r12}x and ~₹${n0(r10(SENS.r12 * E))} (${rt(SENS.r12)}). All the P/E versions point the same way because the stock trades at only ${n1(sepNow)}x our Sep-28E EPS. The real risk to the target is our EPS: FY28-29E need 2,400-2,800 vehicles a year, roughly double FY26.` },
    { pair: [
      { type: 'line', title: `Forward P/E since Apr-2021: median ${n1(FM.median)}x; now ${n1(sepNow)}x on Sep-28E`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdWeekly.map(x => x[0]), series: [{ name: 'Forward P/E (weekly)', values: X.fwdWeekly.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median since Apr-21 ${n1(FM.median)}x; our multiple ${MULT.base}x` }], source: 'Screener.in weekly prices; reported EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(E)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr less net debt`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-37E, rate {{dcf.ke|n1}}%, g 6%, less net debt', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA less ~₹${n0(-evNet)} cr of net debt) gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is Olectra's ${n1(evMed)}x median trailing EV/EBITDA since Apr-2021 (Screener; now ${n1(evNow)}x), cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating and restated from trailing (₹${n0(ttmEbitda)} cr to Jun-26) to Sep-28E EBITDA (× ${evConv.toFixed(3)}). It agrees with the P/E. The DCF gives only ₹${n0(mv('dcf').value)}: a business that earns a ~12% EBITDA margin, keeps ~30% of every extra rupee of revenue in working capital and grows into a 11% long-run margin produces little free cash. The market price (and our target) assume either much faster growth for much longer, or that working capital falls. That gap is the core risk of owning the stock.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, window choices, peer sub-sets, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-37E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27 (shown negative)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm, discounted at the cost of equity (beta 1.15, 13.4%); with net debt of only ~3% of enterprise value this is close to the WACC.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers: auto OEMs (de-rating set) and the other e-bus maker', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'OLECTRA' ? '**Olectra Greentech**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : p.symbol === 'JBMA' ? ' (not in set)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : '–', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', n1(p.pe), derate[p.symbol] != null ? pc(derate[p.symbol]) : '–', n1(p.evEbitda), p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. House auto-OEM set (as in the Hyundai, Eicher and Force Motors initiations); JBM Auto shown for reference.` } },
  ],
};

module.exports = { street, valuation };
