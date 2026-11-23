// Laurus Labs report, part 5b: scenarios, DCF detail and sensitivity, reverse-DCF test, peers (valuation, continued).
const X = require('./LAURUSLABS.ctx');
const { AS, V, F, n0, n1, pc1, mv, peMult, MULT, P, SET, CDMO, derate, r1, shortName, ASOF_TXT, price } = X;
const pm = mv('pe').multiple;
const peerTab = [...new Set(['LAURUSLABS', ...CDMO, ...SET])].map(s => P[s]).filter(p => p && !p.missing);

const blocks = [
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +${AS.scenarios.bull.revenueGrowthDelta}pp a year, margin +${AS.scenarios.bull.marginDelta}pp; ${pm.bull}x Sep-28E EPS (75th percentile of the forward P/E since 2021 × ${X.K}).`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +${n1(AS.revenueGrowth[0])}% / +${n1(AS.revenueGrowth[1])}% / +${n1(AS.revenueGrowth[2])}% (FY27-29E), EBITDA margin ${n1(AS.ebitdaMargin[0])}-${n1(AS.ebitdaMargin[2])}%; ${peMult}x Sep-28E EPS.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth ${AS.scenarios.bear.revenueGrowthDelta}pp a year, margin ${AS.scenarios.bear.marginDelta}pp; ${pm.bear}x (25th percentile × ${X.K}).`],
  ], source: 'GAM Research' } },
  { callout: `**Even the bull case sits below the price.** Bull earnings (FY28E EPS ₹{{scen.bull.eps.1|n1}}, ~${Math.round((X.SC.bull.eps[1] / F.eps[1] - 1) * 100)}% above our base) at the 75th-percentile multiple give {{scen.bull.tp|inr}}. To reach ₹${n0(price)} on our base earnings needs ~${n1(X.impliedPeAtPrice)}x Sep-28E EPS, a multiple Laurus has sustained only in the recent months and in the trough years when earnings had collapsed. The rule would turn BUY only below ~₹${n0(X.buyBelow)}.` },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Less: net debt at Mar-27E (shown as negative net cash)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ['Implied P/E on FY28E EPS', `${n1(V.intrinsicTp / F.eps[1])}x`],
  ], source: `GAM Research: discount rate ${n1(V.ke)}% (rf 6.5% + 0.97 × 6%, set equal to WACC), terminal growth ${AS.dcf.terminalGrowth}%, growth fading to ${AS.dcf.fadeGrowthTo}% and capex to ${AS.dcf.fadeCapexPctTo}% of sales by FY42E` } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { p: `Even at an ${n1(V.sens.waccs[0])}% discount rate and ${V.sens.gs[4]}% terminal growth the DCF gives only ₹${n0(V.sens.grid[0][4])}. Our reverse test uses the same mechanics with a flat growth rate for FY28-42E: 15% a year gives ~₹${n0(X.dcfAt15)}, 20% ~₹${n0(X.dcfAt20)}, and the price needs ~${n1(X.gNeeded)}% a year for fifteen years at a ~31% margin. Laurus grew revenue ~14% a year over the last decade, including a boom. A DCF of a capital-hungry business with ~33% of sales tied up in working capital will always sit well below a premium multiple; the point is how far below.` },
  { exhibit: { type: 'table', title: `Listed peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: peerTab.map(p => [p.symbol === 'LAURUSLABS' ? '**Laurus Labs**' : shortName(p.symbol) + (CDMO.includes(p.symbol) ? ' (CDMO)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', p.pe > 0 && p.pe < 150 ? n1(p.pe) : 'n.m.', derate[p.symbol] != null && p.pe > 0 && p.pe < 150 ? pc1(r1(derate[p.symbol])) : 'n.m.', n1(p.evEbitda), p.roe + '%']), source: `Screener.in (consolidated), multiples scaled to the NSE close on ${ASOF_TXT}; CDMO peers have short or loss-affected histories in places` } },
  { callout: `**Peers in one line:** Laurus (${n1(P.LAURUSLABS.pe)}x trailing) trades above Divi's (${n1(P.DIVISLAB.pe)}x), the best-run Indian CDMO, and at ~3x the P/E of diversified pharma (Sun, Cipla, Zydus at ${n1(P.ZYDUSLIFE.pe)}-${n1(P.SUNPHARMA.pe)}x), with lower margins and ROE than Divi's and net debt instead of net cash. Its growth is faster from a lower base; the market is already paying for that.` },
];

module.exports = { blocks };
