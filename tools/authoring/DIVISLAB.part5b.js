// Divi's report, part 5b: scenarios, DCF detail and sensitivity, peers (valuation chapter, continued).
const X = require('./DIVISLAB.ctx');
const { AS, V, n0, n1, pc1, mv, peMult, evMult, MULT, P, SET, CDMO, derate, dr1, shortName, ASOF_TXT } = X;
const pm = mv('pe').multiple;
const peerTab = [...new Set(['DIVISLAB', ...CDMO, ...SET])].map(s => P[s]).filter(p => p && !p.missing);

const blocks = [
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +${AS.scenarios.bull.revenueGrowthDelta}pp a year, margin +${AS.scenarios.bull.marginDelta}pp; ${pm.bull}x Sep-28E EPS (75th percentile of the forward P/E since 2021 × ${X.K}).`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +${n1(AS.revenueGrowth[0])}% / +${n1(AS.revenueGrowth[1])}% / +${n1(AS.revenueGrowth[2])}% (FY27-29E), EBITDA margin ${n1(AS.ebitdaMargin[0])}-${n1(AS.ebitdaMargin[2])}%; ${peMult}x Sep-28E EPS.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth ${AS.scenarios.bear.revenueGrowthDelta}pp a year, margin ${AS.scenarios.bear.marginDelta}pp; ${pm.bear}x (25th percentile × ${X.K}).`],
  ], source: 'GAM Research' } },
  { callout: `**Asymmetry:** the bear case is further from the price than the bull case, because a slip in approvals would hit both earnings and the multiple at once. On today's numbers the rule would turn BUY only below ~₹${n0(X.buyBelow)}; see the honest summary.` },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Add: net cash at Mar-27E', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ['Implied P/E on FY28E EPS', `${n1(V.intrinsicTp / X.F.eps[1])}x`],
  ], source: `GAM Research: cost of equity ${n1(V.ke)}% (rf 6.5% + 0.85 × 6%), terminal growth ${AS.dcf.terminalGrowth}%, growth fading to ${AS.dcf.fadeGrowthTo}% and capex to ${AS.dcf.fadeCapexPctTo}% of sales by FY42E` } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { p: `Even at a ${n1(V.sens.waccs[0])}% discount rate and ${V.sens.gs[4]}% terminal growth the DCF gives only ₹${n0(V.sens.grid[0][4])}, far below the price. To justify ₹${n0(X.price)} on cash flows, Divi's would need revenue growth of ~25-26% a year for fifteen years at a ~36% margin (our test: 22% a year gives ~₹6,800, 26% ~₹9,600), or working capital far lighter than its ~44% of sales. That is possible for a company that wins several GLP-1-scale contracts; it is not what the disclosed pipeline shows yet.` },
  { exhibit: { type: 'table', title: `Listed peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: peerTab.map(p => [p.symbol === 'DIVISLAB' ? "**Divi's**" : shortName(p.symbol) + (CDMO.includes(p.symbol) ? ' (CDMO)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', p.pe > 0 && p.pe < 150 ? n1(p.pe) : 'n.m.', derate[p.symbol] != null && p.pe < 150 ? pc1(dr1(p.symbol)) : 'n.m.', n1(p.evEbitda), p.roe + '%']), source: `Screener.in (consolidated), multiples scaled to the NSE close on ${ASOF_TXT}; Sai Life and Piramal Pharma have short or loss-affected histories` } },
  { callout: "**Peers in one line:** Divi's trades with the high-growth Indian CDMOs (Laurus ~98x, Sai Life ~88x trailing) rather than with diversified pharma (Sun, Cipla, Zydus at 24-35x), and at ~2.5x the P/E of Syngene. Its margins and ROE are among the best of the CDMOs, which justifies a premium; it does not tell us the premium should keep widening." },
];

module.exports = { blocks };
