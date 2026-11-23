// Samvardhana Motherson report, part 5: the street and the valuation (P/E on Sep-28E EPS primary; EV/EBITDA and
// DCF cross-checks; derivation table; sensitivities; scenarios; DCF detail; peers).
const X = require('./MOTHERSON.ctx');
const { D, F, V, n0, n1, n2, pc, price, mv, FM, FMall, fmP25, fmP75, adjMed, buckets, sectorDr, sectorDrAll, k, derate, PEERS, USED, EXCL, shortName,
  MULT, epsSep, evMed, evP25, evMULT, ttmEbitda, ebitdaSep28, rating, ST, postQ1, medTp, shortDate, ASOF_TXT, half } = X;
const E = epsSep.base, at = x => Math.round(x * E);
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const ourAt = s => { const mm = String(s.multiple || '').match(/(\d+(?:\.\d+)?)x/); if (!mm || s.method !== 'P/E') return '–'; const e = /Jun-28/.test(s.on) ? F.eps[1] * 0.75 + F.eps[2] * 0.25 : F.eps[1]; return n0(+mm[1] * e); };

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: almost all Buy, targets ₹115-195 (median ₹${n0(medTp)}), on 23-26x FY28E EPS`,
  blocks: [
    { p: `Twelve houses published targets around the Q1FY27 results (6-7 Aug 2026): ICICI Securities ₹195, Jefferies ₹190, CLSA ₹190, Investec ₹185, Emkay ₹180, Motilal Oswal ₹178, Nuvama ₹178, Morgan Stanley ₹173, JPMorgan ₹170, HDFC Securities ₹165, Goldman Sachs ₹158 and Citi ₹115 (the lowest): median ₹${n0(medTp)}, ~${Math.round((medTp / price - 1) * 100)}% above the ${ASOF_TXT} close of ₹${n2(price)}. Where the method is disclosed it is **P/E on FY28E (or Jun-28E) EPS: 23-26x**. The bulls see content growth, consolidation and consumer electronics; the street's FY28E EPS (₹7.1-7.5) assumes ~37-46% growth in FY27 and ~30-38% in FY28.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes and call transcripts to 30-Sep-2026' } },
  ],
};

const two = (a => a[Math.floor(a.length / 2)])(FM.series.filter(x => x[0] >= '2024-10-01').map(x => x[1]).sort((x, y) => x - y));
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the street pays ~24x on earnings we think are too high`,
  blocks: [
    { h: 'How the street values SAMIL' },
    { p: `We use the street's method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker's multiple to our EPS for the year it uses. Of the ₹${n0(medTp - V.tp)} gap between the street median and our target, ~₹${n0(medTp - 24 * F.eps[1])} is earnings (24x our FY28E EPS gives ₹${n0(24 * F.eps[1])}) and ~₹${n0(24 * F.eps[1] - V.tp)} the multiple net of the later earnings year.` },
    { exhibit: { type: 'table', title: 'How the street values the stock (notes standing on 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp ? n0(s.tp) : 'n.d.', s.method, s.multiple || '–', s.on || '–', ourAt(s), s.thesis]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Good franchise, thin margins; growth is mostly bought; returns near the cost of capital'] },
    ], source: 'MOSL and Emkay notes (PDFs); Nuvama, ICICI Securities, Jefferies, CLSA, Investec, Morgan Stanley, JPMorgan, HDFC Securities, Goldman Sachs, Citi and Nomura via Business Today (7-Aug-2026); n.d. = not disclosed' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. The stock\'s own history', `One-year-forward P/E since the Jan-2022 reorganisation (the current company; PLAYBOOK "from demerger"): median ${n1(FM.median)}x, 25th-75th percentile ${n1(fmP25)}-${n1(fmP75)}x. No trough years (forward EPS never below half the prior three-year peak). By forward year: ${buckets.map(x => `${x.fy} ${n1(x.med)}x`).join(', ')}`, `Starting point: ${n1(FM.median)}x`],
      ['   One-offs check', `On EPS before exceptional items the median is ${n1(adjMed)}x. We keep the reported-EPS median (house default): restructuring charges recur (FY24, FY26), so they are part of normal earnings for this company; the difference does not change the rounded multiple`, 'Reported basis kept'],
      ['2. Sector de-rating', `Auto-component peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded: ${EXCL.map(s => `${shortName(s)} (${pc(derate[s])}): ${D.peers.excluded[s].split(':')[0].toLowerCase()}`).join('; ')}; with them the median is ${pc(sectorDrAll)}. SAMIL itself (${pc(derate.MOTHERSON)}) is not used`, `× ${k.toFixed(3)}`],
      ['3. Growth vs what the street assumes', `The street's 23-26x sits on FY28E EPS of ₹7.1-7.5 (EPS +37% in FY27); ours is ₹${n2(F.eps[1])}. History already includes FY23-26, when EPS grew ~36% a year off a depressed base`, 'No uplift (§7c); shown as sensitivity'],
      ['4. Peers', `Indian component peers trade at 36-73x trailing (table below) but grow faster from a domestic base with higher margins and ROE; MSWIL, SAMIL's closest listed relative, is at ${n1(X.P.MSUMI.pe)}x`, 'Not a basis for a premium'],
      ['5. Returns vs cost of capital', `ROE {{F.roe.0|pct}} → {{F.roe.2|pct}} (FY27-29E) against a cost of equity of {{dcf.ke|n1}}%; company ROCE 16.1% (FY26)`, 'Supports no premium'],
      ['Result (nearest half-turn)', `${n1(FM.median)}x × ${k.toFixed(3)} = ${n1(FM.median * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n2(E)} = ₹${n0(MULT.base * E)}**`],
      ['Bull / bear multiples', `Bull: no de-rating (${n1(FM.median)}x). Bear: 25th-percentile forward P/E, de-rated (${n1(fmP25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; GAM estimates for FY27-29E in the forward series; peers from their Screener data` } },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(price / F.eps[1])}x our FY28E now vs a ${n1(FM.median)}x median since 2022`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Forward P/E', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-29E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, Math.round(price)], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n2(E)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr + net cash/(debt)`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-39E, {{dcf.ke|n1}}%, g 5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded to ₹1)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA: SAMIL's median trailing EV/EBITDA since 2022 is ${n1(evMed)}x; cut by the same ${Math.abs(sectorDr).toFixed(1)}% and restated from trailing EBITDA (₹${n0(ttmEbitda)} cr in the year to Jun-26) to Sep-28E (₹${n0(ebitdaSep28)} cr) it is ${evMULT.base}x, worth ₹${n0(mv('ev').value)}. The DCF (12.5%, 5% terminal growth) gives ₹${n0(mv('dcf').value)}. Both count the JV stakes only at book value (₹6,651 cr; MSWIL alone was worth ₹8,179 cr at market in Mar-26, ~₹4 a share more) and ignore minorities (~₹2.5 a share less): roughly a wash. Three methods agree on ~₹115-135.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: [
      ['History from Apr-2021 (incl. pre-reorganisation MSSL)', `Median ${n1(FMall.median)}x × ${k.toFixed(3)} = ${n1(half(FMall.median * k))}x`, n0(half(FMall.median * k) * E)],
      ['EPS before exceptional items in the history', `Median ${n1(adjMed)}x × ${k.toFixed(3)} = ${n1(half(adjMed * k))}x`, n0(half(adjMed * k) * E)],
      ['Last two years only (since Oct-2024)', `Median ${n1(two)}x, de-rated ${n1(half(two * k))}x`, n0(half(two * k) * E)],
      ['Sector de-rating incl. Bharat Forge and Gabriel', `${pc(sectorDrAll)}: ${n1(half(FM.median * (1 + sectorDrAll / 100)))}x`, n0(half(FM.median * (1 + sectorDrAll / 100)) * E)],
      ['No sector de-rating', `${MULT.bull}x on base EPS`, n0(MULT.bull * E)],
      ['Street multiple on our EPS', '24x Sep-28E', n0(24 * E)],
      ['Street multiple on street EPS (MOSL)', '24x FY28E ₹7.5', n0(24 * 7.5)],
    ], source: 'GAM Research. Per PLAYBOOK §7c, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.salesGrowth.0|pct}} / {{F.salesGrowth.1|pct}} / {{F.salesGrowth.2|pct}}; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-39E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash/(debt) at Mar-27E (JV stakes at book; CCDs as debt)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|n1}}'],
      { hl: true, cells: ['**12-month DCF value (engine rounds to ₹10)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Discount rate = cost of equity 12.5% (beta 1.0), set close to our WACC because the engine has no separate WACC input.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research (engine rounds each cell to ₹10)' } },
    { exhibit: { type: 'table', title: 'Auto-component peers and the sector de-rating', head: ['Company', 'Market value (₹ cr)', 'Trailing P/E (x)', '5-yr median P/E (x)', 'vs median', 'EV/EBITDA (x)'], rows: PEERS.map(p => [p.symbol === 'MOTHERSON' ? '**Samvardhana Motherson**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n1(p.pe), n1(X.MED5[p.symbol]), pc(derate[p.symbol]), n1(p.evEbitda)]), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; five-year median of weekly P/E from Sep-2021 (shorter where the series is shorter: MSWIL, ZF CV, Schaeffler)` } },
  ],
};

module.exports = { street, valuation };
