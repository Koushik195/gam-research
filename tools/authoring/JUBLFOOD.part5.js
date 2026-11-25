// Jubilant FoodWorks report, part 5: the street and the valuation (SOTP on EV/EBITDA, Sep-28E, one group multiple derived from
// the stock's own forward EV/EBITDA since Apr-2021 and the QSR peers' five-year EV/EBITDA move; minorities deducted; P/E and
// DCF cross-checks; scenarios; peers).
const X = require('./JUBLFOOD.ctx');
const { D, F, V, n0, n1, n2, pc, pc1, price, shares, mv, HEV, HEV24, HPE, FM, sectorEv, sectorPeRet, sens, kEv, kPe, dr5Ev, dr5Pe, MED5EV, P, PEERS, USED, EXCL, RET, QSR, shortName, evMULT, peMULT, evALT,
  ebitdaSep28, netCashSep28, evAt, preSep28, preEbitda, leases, preMultAt, streetAtOurs, rating, ST, post, medTp, medAll, nBuy, ASOF_TXT, evNow, evSepNow, mShare, SEG, yi, epsBei, troughEv } = X;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const sd = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}-${y.slice(2)}`; };
const drTxt = s => `${shortName(s).split(' (')[0]} ${pc1(dr5Ev[s])}`;
const tpPre = preMultAt(V.tp), SP = V.sotp.parts, part = re => SP.find(p => re.test(p.name));
const sepSeg = k => (SEG[k].adjEbitda[yi('FY28E')] + SEG[k].adjEbitda[yi('FY29E')]) / 2;
const intlLow = ((sepSeg('india') * evMULT.base + sepSeg('intl') * evMULT.base * 0.6 + netCashSep28) * (1 - mShare)) / shares;
const epsSep = (F.eps[1] + F.eps[2]) / 2, qsrEv = X.medOf(USED.map(s => P[s].evEbitda));

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ${nBuy} of ${post.length} post-results notes are Buy-rated; median target ₹${n0(medTp)}, on SOTP EV/EBITDA after rent`,
  blocks: [
    { p: `After the Q1FY27 results (13-Aug-2026) ${post.length} houses published dated targets: median ₹${n0(medTp)} (${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n2(price)}); including older notes still standing, the median is ₹${n0(medAll)}. ${nBuy} are Buy or Outperform, ${post.length - nBuy - 1} are Hold/Neutral and Axis Capital initiated at Sell (₹505). Targets were raised after Q1 (Jefferies ₹600→650, Emkay ₹550→600, CLSA ₹520→554, Macquarie ₹375→520 with an upgrade), but the multiples are far below the start of the year. ${rup(D.street.methodSummary)}` },
    { p: rup(D.street.consensusText) },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], wide: [0], rows: D.critiques.map(r => [rup(r)]), source: 'Broker notes and company filings as cited; GAM Research' } },
  ],
};

const sensRows = [
  ['Own window since the Turkey consolidation (Apr-2024)', `Own median ${n1(HEV24.med)}x × QSR move over the same window (${pc1(sens.qsr24)}) → ${evALT.since24}x`, n0(evAt(evALT.since24))],
  ['QSR set including Restaurant Brands Asia', `${pc1(sens.withRba)} instead of ${pc1(sectorEv)} → ${evALT.withRba}x`, n0(evAt(evALT.withRba))],
  ['Devyani out (merging with Sapphire; prices linked since Jan-2026)', `Westlife + Sapphire ${pc1(sens.exDevyani)} → ${evALT.exDev}x`, n0(evAt(evALT.exDev))],
  ['Retail set (DMART.ctx.js) on EV/EBITDA instead of QSR', `${pc1(sens.retailEv)} → ${evALT.retail}x`, n0(evAt(evALT.retail))],
  ['International at 60% of the group multiple (the street\'s India/International ratio)', `India ${evMULT.base}x, International ${n1(evMULT.base * 0.6)}x`, n0(intlLow)],
  ['No sector move', `${n1(HEV.med)}x → ${evALT.noMove}x`, n0(evAt(evALT.noMove))],
  ['Street multiple on our numbers: Emkay 21x after rent (blended)', `21x our Sep-28E after-rent EBITDA (₹${n0(preSep28)} cr), EV without leases`, n0(streetAtOurs(21))],
  ['Street India multiple for the whole group: Prabhudas Lilladher 26x', '26x after rent, all of EBITDA', n0(streetAtOurs(26))],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${evMULT.base}x Sep-28E EBITDA less minorities gives {{dcf.tp|inr}}; the market pays ${n1(evSepNow)}x`,
  blocks: [
    { h: 'How the street values JFL' },
    { p: `The street uses a sum of the parts on EV/EBITDA after rent ("pre-Ind AS 116"): India at 24-30x FY28E/Jun-28E and International at 15-18x, or DP Eurasia on P/E. We use EV/EBITDA on the same horizon (Sep-28E: half FY28E, half FY29E), but on reported EBITDA before rent with lease liabilities (₹${n0(leases)} cr at Mar-2026) counted as debt, the basis on which the stock's own history can be measured. We apply one group multiple to India and International (the history has included Turkey since FY25) and deduct minorities (${(mShare * 100).toFixed(1)}% of equity value). On the street's basis our target equals **${n1(tpPre)}x** Sep-28E after-rent EBITDA (₹${n0(preSep28)} cr), inside its 21-26x blended range. The "At our EBITDA" column applies each broker's headline multiple to our after-rent EBITDA.` },
    { exhibit: { type: 'table', title: 'How the street values the stock (latest dated note per broker on or before 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EBITDA (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${sd(s.date)})${s.stale ? ' – stale' : ''}${s.aggregator ? ' †' : ''}`, s.rating, n0(s.tp), s.method, s.multiple, s.on, s.mult && /EV\/EBITDA/.test(s.method) ? n0(streetAtOurs(s.mult)) : '–', rup(s.thesis).slice(0, 220)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**EV/EBITDA SOTP (reported, leases as debt)**', `**${evMULT.base}x (≈${n1(tpPre)}x after rent)**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Volume growth intact; the multiple has fallen further than the peers\''] },
    ], source: `† aggregator row, no primary note found. ${rup(D.street.notInTable)} "At our EBITDA" applies the India/standalone or blended multiple to all of our after-rent EBITDA, so it overstates SOTPs with a lower International multiple.` } },
    { h: `Our target multiple: ${evMULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward EV/EBITDA since Apr-2021 (used)', `EV (market value grossed up for minorities, plus net debt incl. leases from the latest March balance sheet) ÷ next full-year EBITDA (realised; FY27E-28E ours), ${HEV.n} weekly closes: median ${n1(HEV.med)}x, 25th-75th percentile ${n1(HEV.p25)}-${n1(HEV.p75)}x, range ${n1(HEV.min)}-${n1(HEV.max)}x. Trough years (forward EBITDA below half the prior three-year peak): ${troughEv.length ? troughEv.join(', ') : 'none'}`, `**Starting point: ${n1(HEV.med)}x**`],
      ['2. One-offs', 'The FY24 remeasurement gain, FY26 Labour Code charge and discontinued operations all sit below EBITDA', 'No adjustment'],
      ['3. Sector move (five years)', `QSR peers' trailing EV/EBITDA on ${ASOF_TXT} vs their five-year medians (Screener): ${USED.map(drTxt).join(', ')}; median ${pc1(sectorEv)}. Excluded: ${EXCL.map(s => shortName(s)).join(', ')} (${rup(D.peers.excluded.RBA).split(':')[0]}). JFL itself ${pc1(dr5Ev.JUBLFOOD)} (not used). Three usable names; the move is in the base and wider sets are sensitivity rows`, `× ${kEv.toFixed(3)}`],
      ['4. Growth vs the street', `Our EBITDA and EPS match consensus (FY28E EPS ₹${n2(F.eps[1])} vs ₹9.1); the street's own India multiples have fallen from 33-36x (Feb-2026) to 24-30x`, 'No adjustment (§7c)'],
      ['5. Peers', `QSR peer median trailing EV/EBITDA ${n1(qsrEv)}x; JFL ${n1(P.JUBLFOOD.evEbitda)}x trailing, below Westlife and Devyani, above Sapphire, and the only one with material net profits`, 'JFL is not expensive against peers on EBITDA'],
      ['6. Returns', 'ROCE ~15% (Screener) against a ~12% cost of capital; standalone pre-Ind AS ROCE 18.9%', 'Supports a market multiple, not a premium'],
      ['7. Result (nearest half-turn)', `${n1(HEV.med)}x × ${kEv.toFixed(3)} = ${n1(HEV.med * kEv)}x`, `**${evMULT.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr**`],
      ['8. Bull / bear', `75th / 25th percentile forward EV/EBITDA with the move: ${n1(HEV.p75)}x / ${n1(HEV.p25)}x × ${kEv.toFixed(3)}`, `${evMULT.bull}x / ${evMULT.bear}x`],
    ], source: `Screener.in weekly prices to ${ASOF_TXT}; GAM estimates for FY27-28E EBITDA; peers' Screener EV/EBITDA series` } },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA since Apr-2021: median ${n1(HEV.med)}x; ${n1(evNow)}x FY28E now`, unit: 'EV ÷ next full-year EBITDA, after Ind AS 116 (x)', x: X.fwdEvChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.fwdEvChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: evMULT.base, text: `Our multiple: ${evMULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; GAM estimates for FY27-28E (2021-22 values reflect the post-Covid delivery boom)' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['EV/EBITDA SOTP (target)', 'P/E', 'DCF', 'Street median (post-Q1)', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('sotp').value), Math.round(mv('pe').value), Math.round(mv('dcf').value), Math.round(medTp), Math.round(price)], fmt: 'inr' }], labels: 'all', highlight: 'EV/EBITDA SOTP (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case, Sep-28E)', head: ['Part', 'Basis', 'Multiple', 'Value (₹ cr)', '₹ per share'], rows: [
      ...SP.map(p => [p.name, rup(X.VP.find(v => v.name === p.name).metricLabel), p.mult ? `${p.mult}x` : '–', n0(p.value), n1(p.perShare)]),
      { hl: true, cells: ['**Equity value / target**', '', '', `**${n0(V.sotp.equity)}**`, '**{{dcf.tp|inr}}**'] },
    ], source: 'GAM Research (JUBLFOOD.val.js sets the multiples and the minorities line)' } },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**EV/EBITDA SOTP**', '**Target**', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr, net debt incl. leases, less minorities`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '**{{dcf.blend.methods.0.value|n1}}**', '–', '{{scen.bull.blend.methods.0.value|n1}}', '{{scen.bear.blend.methods.0.value|n1}}'],
      ['P/E', 'Cross-check', `Sep-28E EPS ₹${n2(epsSep)}`, `${peMULT.base}x (bull ${peMULT.bull}x, bear ${peMULT.bear}x)`, '{{dcf.blend.methods.1.value|n1}}', pc(mv('pe').vsTarget), '{{scen.bull.blend.methods.1.value|n1}}', '{{scen.bear.blend.methods.1.value|n1}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E (lease principal as capex), discount rate {{dcf.ke|n1}}%, g {{as.dcf.terminalGrowth|n1}}%', '–', '{{dcf.blend.methods.2.value|n1}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|n1}}', '{{scen.bear.blend.methods.2.value|n1}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** P/E (${peMULT.base}x Sep-28E EPS: JFL's ${n1(HPE.med)}x forward median on EPS before one-offs since Apr-2021 × the retail set's ${pc1(sectorPeRet)} P/E move; QSR peers have no usable P/E) gives ₹${n0(mv('pe').value)}, well above the target: EPS before one-offs fell from ₹${n2(epsBei[2022])} (FY22) to ₹${n2(epsBei[2025])} (FY25) while the price held up, so the P/E history is inflated by a near-trough earnings period (the house function on reported EPS gives ${n1(FM.median)}x). That is why the street and we use EV/EBITDA. The DCF gives ₹${n0(mv('dcf').value)}: at {{dcf.ke|n1}}%, {{as.dcf.terminalGrowth|n1}}% terminal growth and EBITDA fading to {{as.dcf.fadeMarginTo|n1}}% of revenue, store and lease spending absorb much of the cash, so the DCF supports less than today's price. **We weight neither; the rule gives ${evMULT.base}x, and the market pays ${n1(evSepNow)}x.**` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sensRows, source: 'GAM Research. Per PLAYBOOK §7c, other windows, peer sets, street multiples and segment splits are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${evMULT.bull}x (75th percentile, with the sector move).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${evMULT.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${evMULT.bear}x (25th percentile, with the sector move).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Net debt incl. lease liabilities at Mar-27 (negative = debt)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|n1}}'],
      { hl: true, cells: ['**12-month DCF value (rolled forward 6 months)**', '**₹{{dcf.blend.methods.2.value|n1}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Beta 0.9 sets the single discount rate at ~11.9%, our WACC with debt and leases at ~13% of EV; minorities are not deducted in the DCF (~3% of value).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Rate / g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed QSR peers (and the retail set used for the P/E move)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'EV/EBITDA vs 5-yr median', 'P/E vs 5-yr median', 'ROE'], rows: [...PEERS, ...RET.map(s => P[s])].map(p => [p.symbol === 'JUBLFOOD' ? '**Jubilant FoodWorks**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : RET.includes(p.symbol) ? ' (retail, P/E move)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : '–', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.pe != null && p.pe < 500 ? n1(p.pe) : 'n.m.', p.evEbitda != null ? n1(p.evEbitda) : '–', dr5Ev[p.symbol] != null ? pc(dr5Ev[p.symbol]) : '–', dr5Pe[p.symbol] != null && P[p.symbol].pe < 500 ? pc(dr5Pe[p.symbol]) : 'n.m.', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT} (EV includes lease liabilities). n.m. = not meaningful (profit near zero or negative).` } },
  ],
};

module.exports = { street, valuation };
