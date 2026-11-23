// Bharat Forge report, part 5: the street and the valuation (P/E on Sep-28E EPS; EV/EBITDA and DCF cross-checks).
const X = require('./BHARATFORG.ctx');
const { D, F, V, n0, n1, pc, rup, price, mv, FM, houseP25, houseMult, adjMed, adjP25, adjP75, adjTrough, adjSeries, sectorDr, sectorDrAll, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, epsSep, evMed, evP25, evMULT, ebitdaSep28, netDebtSep28, qipPerShare, rating, ST, postQ1, medTp, shortDate, ASOF_TXT, two, epsCagrFwd } = X;
const r10 = v => Math.round(v / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: split between Buy and Hold, targets ₹1,931-2,400, median ₹${n0(medTp)}`,
  blocks: [
    { p: `Six houses published after the Q1FY27 results (10-11 Aug-2026): Emkay Buy ₹2,400, ICICI Securities Buy ₹2,400, Nomura Neutral ₹2,260, CLSA Hold ₹2,106, InCred Hold ₹2,103 and Motilal Oswal Neutral ₹1,931: median ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} from the ${ASOF_TXT} close of ₹${n0(price)}. Earlier notes still standing: ICICI Direct Buy ₹2,360 (Jun), Geojit Sell ₹1,732 (May), Axis Direct Buy ₹2,095 (Apr). ${rup(D.street.methodNote)} Bulls focus on defence and aerospace; the holds on valuation and the overseas drag.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes and call transcripts to 30-Sep-2026' } },
  ],
};

const ourAt = s => { const m = String(s.multiple).match(/^(\d+(?:\.\d+)?)x$/); return s.method === 'P/E' && m ? n0(r10(+m[1] * epsSep.base)) : '–'; };
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the stock trades at ${n1(price / epsSep.base)}x`,
  blocks: [
    { h: 'How the street values Bharat Forge' },
    { p: 'The houses that disclose a method mostly use consolidated P/E on FY28E earnings; Emkay uses EV/EBITDA. We use P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies a broker\'s P/E to our Sep-28E EPS.' },
    { exhibit: { type: 'table', title: 'How the street values the stock (notes standing on 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple, s.on, ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Good Indian franchise; defence promise priced in; overseas still a drag'] },
    ], source: 'Emkay PDF (10-Aug-26); MOSL via Investment Guru (11-Aug-26); ICICI Securities, ICICI Direct, Geojit, Axis Direct via Trendlyne; Nomura, CLSA, InCred via Investing.com / Moneycontrol roundups (11-Aug-26). n.d. = not disclosed on the pages we could read.' } },
    { h: `Our multiple: ${MULT.base}x, and how we get there` },
    { exhibit: { type: 'table', title: 'Deriving the target multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1a. Own history, reported EPS (house)', `One-year-forward P/E since Apr-2021 on reported EPS: median ${n1(FM.median)}x (all dates ${n1(FM.medianAll)}x); trough year left out: ${FM.troughYears.join(', ')} (EPS ₹11.35, below half of FY22's ₹23.23)`, `${n1(FM.median)}x (shown, not used)`],
      ['1b. Own history, EPS before exceptional items (used)', `Same series on EPS before exceptional items (FY22 ₹20.5, FY23 ₹12.3, FY24 ₹20.7, FY25 ₹23.0, FY26 ₹25.8; FY27E ₹${n1(X.adj27)}): median ${n1(adjMed)}x, 25th-75th percentile ${n1(adjP25)}-${n1(adjP75)}x; trough years ${adjTrough.length ? adjTrough.join(', ') : 'none'}. Used because reported EPS carries large one-offs both ways (FY22 +₹205 cr gain; FY25-FY27 charges) and our Sep-28E EPS has none`, `Starting point: ${n1(adjMed)}x`],
      ['2. Sector de-rating', `Auto-component peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded as distorted: ${EXCL.map(s => `${shortName(s)} (${pc(derate[s])}; ${D.peers.excluded[s].split(':')[1].trim()})`).join('; ')}; with it the median is ${pc(sectorDrAll)}. Bharat Forge itself (${pc(derate.BHARATFORG)}) is not used`, `× ${k.toFixed(3)}`],
      ['3. Result (nearest half-turn)', `${n1(adjMed)}x × ${k.toFixed(3)} = ${n1(adjMed * k)}x`, `**${MULT.base}x Sep-28E EPS**`],
      ['4. Bull / bear', `Bull: no de-rating (${n1(adjMed)}x). Bear: 25th percentile de-rated (${n1(adjP25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
      ['5. Growth and returns (not applied)', `EPS CAGR FY26-29E ~${Math.round(epsCagrFwd)}% (before exceptional items) vs ~flat EPS over FY19-FY26; ROE ~18-20% by FY28-29E vs Ke ${n1(V.ke)}%`, 'Sensitivity rows only (§7c)'],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; Emkay (adjusted EPS FY22-FY26); GAM estimates for FY27-28E` } },
    { pair: [
      { type: 'line', title: `Forward P/E on EPS before exceptional items: ${n1(price / epsSep.base)}x Sep-28E now, ${n1(adjMed)}x median`, unit: 'Price ÷ next full-year EPS (x)', x: adjSeries.map(x => x[0]), series: [{ name: 'Forward P/E (adjusted EPS)', values: adjSeries.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: Math.round(adjMed), text: `Median: ${n1(adjMed)}x` }], source: 'Screener.in prices; adjusted EPS (Emkay), GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr less net debt ₹${n0(netDebtSep28)} cr`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks say.** EV/EBITDA: ${evMULT.base}x is the stock's own one-year-forward EV/EBITDA median since Apr-2021 (${n1(evMed)}x) cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating; it gives ₹${n0(mv('ev').value)}. The DCF (Ke ${n1(V.ke)}%, 6% terminal growth) gives only ₹${n0(mv('dcf').value)}: working capital of ~28% of revenue and heavy capex leave little free cash flow, so today's price assumes growth well beyond our 15 years. Both cross-checks miss the ~₹${n0(qipPerShare)} a share of QIP cash raised in Sep-2026 (the engine starts from the Mar-2026 balance sheet); adding it does not change the picture: the P/E target is the most generous of the three methods.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: [
      ['House median on reported EPS', `${n1(FM.median)}x × ${k.toFixed(3)} = ${houseMult}x`, n0(r10(houseMult * epsSep.base))],
      ['Only the last two years of history', `Adjusted forward P/E median since Oct-2024: ${n1(two)}x (de-rated ${n1(X.half(two * k))}x)`, n0(r10(X.half(two * k) * epsSep.base))],
      ['No sector de-rating', `${MULT.bull}x on base EPS`, n0(r10(MULT.bull * epsSep.base))],
      ['Street EPS (Emkay/MOSL FY28E ~₹47.6, on 48.87 cr shares ~₹46.6) at our multiple', `${MULT.base}x on Sep-28E street EPS ≈ ₹${n1(((47.6 + 60.0) / 2) * X.dil)}`, n0(r10(MULT.base * ((47.6 + 60.0) / 2) * X.dil))],
      ['Defence re-rating (KSSL at a defence-PSU multiple)', `Defence PSUs trade at ${D.peers.defence.map(s => shortName(s) + ' ' + n1(P[s].pe) + 'x').join(', ')} trailing; KSSL is ~${Math.round(X.segE('kssl')[1] / F.ebitda[1] * 100)}% of our FY28E EBITDA`, 'not applied'],
    ], source: 'GAM Research. Per PLAYBOOK §7c, growth and returns views are shown, not added to the base multiple. Emkay is the only house with FY29E EPS (₹60.0).' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|n1}}% / +{{F.salesGrowth.1|n1}}% / +{{F.salesGrowth.2|n1}}%; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27 (before the Sep-2026 QIP cash)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. The engine discounts at the cost of equity; with ~0.4x net debt/equity a WACC would be ~1pp lower (first rows of the grid).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers (auto components, with defence PSUs for reference)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'BHARATFORG' ? '**Bharat Forge**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : D.peers.defence.includes(p.symbol) ? ' (reference)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : 'n.d.', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : 'n.d.', n1(p.pe), derate[p.symbol] != null ? pc(derate[p.symbol]) : '–', n1(p.evEbitda), p.roe != null ? p.roe + '%' : 'n.d.']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Schaeffler India and CIE Automotive report on December years (n.d.). Market values on Screener's current share counts.` } },
  ],
};

module.exports = { street, valuation };
