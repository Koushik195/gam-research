// Ramkrishna Forgings report, part 5: the street and the valuation (P/E on Sep-28E EPS; EV/EBITDA and DCF cross-checks).
const X = require('./RKFORGE.ctx');
const { D, F, V, n0, n1, n2, pc, price, mv, OWN, INV, POST23, FM, buckets, sectorDr, sectorDrAll, k, derate, P, PEERS, USED, EXCL, FORG, shortName,
  MULT, SENS, epsSep, evMed, evP25, evMULT, evConv, ebitdaSep28, rating, ST, CONS, medTp, ASOF_TXT, sepNow, fy27Threshold, cleanBy, INV25 } = X;
const r10 = v => Math.round(v / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const DB = ST[0];

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: thin coverage, mostly Hold; targets ₹550-680, one Buy at ₹${n0(DB.tp)}`,
  blocks: [
    { p: `Few brokers publish on RKFL and most notes are behind logins. The S&P Global consensus on 31-Jul-2026 (after Q1FY27) had four analysts: three Hold and one Sell, average target ₹${n0(CONS.avgTp)} (range ₹${n0(CONS.lowTp)}-${n0(CONS.highTp)}), ${pc((CONS.avgTp / price - 1) * 100)} from the ${ASOF_TXT} close of ₹${n0(price)}. The one note we could read in full, Dalal & Broacha's management-meet note of 1-Jun-2026, rates it Buy with a ₹${n0(DB.tp)} target (27x FY28E EPS of ₹${n1(DB.eps.FY28E)}). Nuvama was at Reduce (₹540) in Aug-2025; we found no later note. The stock rose from ₹581 to ~₹750 in the five weeks after Q1FY27, above most targets.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], wide: [0], rows: D.critiques.map(r => [r]), source: 'GAM Research; AR FY26; rating rationales; shareholding pattern Jun-2026' } },
  ],
};

const ourAt = m => n0(r10(m * epsSep.base));
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the stock trades at ${n1(sepNow)}x`,
  blocks: [
    { h: 'How the street values Ramkrishna Forgings' },
    { p: 'The houses that disclose a method use P/E on FY28E earnings (Dalal & Broacha 27x; the consensus houses do not disclose a method in our sources). We use P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). "At our EPS" applies a broker\'s P/E to our Sep-28E EPS.' },
    { exhibit: { type: 'table', title: 'How the street values the stock (standing on 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      [`${DB.broker} (1-Jun-26)`, DB.rating, n0(DB.tp), 'P/E', DB.multiple, DB.on, ourAt(27), DB.thesis],
      [`S&P consensus, ${CONS.analysts} analysts (31-Jul-26)`, `${CONS.rating} (${CONS.split})`, `${n0(CONS.avgTp)} avg`, 'n.d.', '–', '–', '–', `Range ₹${n0(CONS.lowTp)}-${n0(CONS.highTp)}; names not shown`],
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Recovery real; trust, leverage and returns not yet; price ~2x own history'] },
    ], source: 'Dalal & Broacha PDF (1-Jun-2026); S&P Global consensus via StockAnalysis. n.d. = not disclosed.' } },
    { h: `Our multiple: ${MULT.base}x, and how we get there` },
    { exhibit: { type: 'table', title: 'Own one-year-forward P/E by period (price ÷ next full-year EPS)', head: ['Dates', 'Forward year', 'EPS before one-offs (₹)', 'Median P/E', 'Reported EPS (₹)', 'Median P/E (reported)'], rows: buckets.map(x => [x.period, x.fy, `${n2(x.clean)}${x.trough ? ' (trough)' : ''}`, x.trough ? `${n1(x.med)}x (left out)` : `${n1(x.med)}x`, `${n2(x.rep)}${x.repTrough ? ' (trough)' : ''}`, x.repTrough ? `${n1(x.repMed)}x (left out)` : `${n1(x.repMed)}x`]), source: 'Screener.in weekly prices (every fifth point, the house grid); EPS before one-offs from AR FY26; FY27-28E GAM estimates' } },
    { exhibit: { type: 'table', title: 'Deriving the target multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1a. Own history, EPS before one-offs (used)', `One-year-forward P/E since Apr-2021, trough years left out (forward EPS below half the previous three years' high): ${OWN.troughYears.join(', ')} (₹${cleanBy[2025]} and ₹${cleanBy[2026]} vs FY24's ₹16.1). Median ${n1(OWN.med)}x, 25th-75th percentile ${n1(OWN.p25)}-${n1(OWN.p75)}x. Used because FY25 reported EPS carries ~₹17 of one-offs (deferred-tax credit, sale gain) and our forecasts carry none (§4; Bharat Forge, Force Motors and pharma batch precedent)`, `Starting point: ${n1(OWN.med)}x`],
      ['1b. Own history, reported EPS (house function)', `forwardMedian on reported EPS: median ${n1(FM.median)}x (all dates ${n1(FM.medianAll)}x); trough year ${FM.troughYears.join(', ')}. FY25's inflated ₹22.9 keeps Apr-2023 to Mar-2024 in the sample. FY27E (₹${n1(F.eps[0])}) passes the trough test narrowly (threshold ₹${n1(fy27Threshold)})`, `${n1(FM.median)}x (sensitivity)`],
      ['2. Sector de-rating', `Auto-component peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded as distorted: ${EXCL.map(s => `${shortName(s)} (${pc(derate[s])}: ${D.peers.excluded[s].split(':')[0]})`).join('; ')}; with them ${pc(sectorDrAll)}. RKFL itself (${pc(derate.RKFORGE)}) left out`, `× ${k.toFixed(3)}`],
      ['3. Result (nearest half-turn)', `${n1(OWN.med)}x × ${k.toFixed(3)} = ${n1(OWN.med * k)}x`, `**${MULT.base}x Sep-28E EPS**`],
      ['4. Bull / bear', `Bull: no de-rating (${n1(OWN.med)}x). Bear: 25th percentile de-rated (${n1(OWN.p25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
      ['5. Growth and returns (not applied)', `EPS from ₹3.9 (FY26) to ₹${n1(F.eps[2])} (FY29E) is a recovery to above FY24's ₹16.1, not a new growth path; ROE {{F.roe.2|pct}} in FY29E vs a ~12.5% cost of capital`, 'Sensitivity only (§7c)'],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; AR FY26; GAM estimates for FY27-28E` } },
    { callout: `**Why the history reads so low.** The kept dates fall into two groups: Apr-2021 to Mar-2023, when the stock re-rated from ~7x to ~17x forward on rising earnings, and Apr-2025 onwards, when it paid 26-58x for a recovery from trough profits. The median sits at the top of the first group. The rule as written gives ${MULT.base}x; we show the alternative readings below and none of them supports today's price.` },
    { pair: [
      { type: 'line', title: `Forward P/E (EPS before one-offs): ${n1(sepNow)}x Sep-28E now, ${n1(OWN.med)}x median`, unit: 'Price ÷ next full-year EPS (x); trough years left out', x: OWN.kept.map(x => x[0]), series: [{ name: 'Forward P/E', values: OWN.kept.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x (median ${n1(OWN.med)}x)`, color: '#cf8f1f' }], source: 'Screener.in prices; AR FY26; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street (avg of D&B and consensus)', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), Math.round(medTp), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr less net debt`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, 12.5%, g 5.5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks say.** EV/EBITDA: the stock's trailing EV/EBITDA median since Apr-2021 (${n1(evMed)}x) × the ${Math.abs(sectorDr).toFixed(1)}% de-rating, restated to Sep-28E EBITDA (×${n2(evConv)}: TTM EBITDA is ${Math.round(evConv * 100)}% of Sep-28E), gives ${evMULT.base}x and ₹${n0(mv('ev').value)}. It is higher than the P/E value because EBITDA never collapsed the way EPS did: depreciation and interest took the hit. The DCF (12.5%, 5.5% terminal growth) gives ₹${n0(mv('dcf').value)}: capex and working capital leave little free cash flow. All three methods sit well below the price.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: [
      ['House median on reported EPS', `${n1(FM.median)}x × ${k.toFixed(3)} = ${SENS.house}x`, ourAt(SENS.house)],
      ['FY25 before the ₹170 cr inventory charge too', `FY25 EPS ₹${n1(cleanBy[2025] + INV25)} is no longer a trough: median ${n1(INV.median ?? INV.med)}x × ${k.toFixed(3)} = ${SENS.inv}x`, ourAt(SENS.inv)],
      ['History since Apr-2023 only (post-QIP)', `Median ${n1(POST23.med)}x (FY27-28E forward only, i.e. the recovery itself) → ${SENS.post23}x`, ourAt(SENS.post23)],
      ['Sector set incl. Craftsman and CIE', `De-rating ${pc(X.sectorDrCr)} → ${SENS.withCr}x`, ourAt(SENS.withCr)],
      ['Dalal & Broacha multiple', '27x on our Sep-28E EPS', ourAt(27)],
      ['Price-implied multiple', `₹${n0(price)} ÷ ₹${n1(epsSep.base)}`, `${n1(sepNow)}x`],
    ], source: 'GAM Research. Per PLAYBOOK §7c, alternative windows, sub-sets and growth views are shown, not used. Only the post-2023 window, which is the current recovery valuation itself, supports the price.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|n1}}% / +{{F.salesGrowth.1|n1}}% / +{{F.salesGrowth.2|n1}}%; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. The engine discounts at the cost of equity; beta 1.0 sets it at 12.5%, close to our WACC estimate (~12.6%).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers (auto components and forgers)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'RKFORGE' ? '**Ramkrishna Forgings**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : !USED.includes(p.symbol) ? ' (reference)' : ''), n0(p.mcapCr), p.revenue && p.fy === 'FY26' ? n0(p.revenue) : 'n.d.', p.ebitdaMargin != null && p.fy === 'FY26' ? p.ebitdaMargin + '%' : 'n.d.', n1(p.pe), derate[p.symbol] != null ? pc(derate[p.symbol]) : '–', n1(p.evEbitda), p.roe != null && p.fy === 'FY26' ? p.roe + '%' : 'n.d.']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Schaeffler India and CIE Automotive report on December years (n.d.); Happy Forgings listed Dec-2023 (five-year median covers its history only). Market values on Screener's current share counts.` } },
  ],
};

module.exports = { street, valuation };
