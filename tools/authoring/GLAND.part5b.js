// Gland report, part 5b: scenarios, DCF detail and sensitivity, peers (valuation chapter, continued).
const X = require('./GLAND.ctx');
const { AS, V, F, n0, n1, pc1, mv, peMult, MULT, P, SET, CTX, F5, shortName, ASOF_TXT, KW, gNeeded, dcfAt12, dcfAt16, price } = X;
const pm = mv('pe').multiple;
const peerTab = [...new Set(['GLAND', ...CTX, ...SET])].map(s => P[s]).filter(p => p && !p.missing);
const dr5 = s => (F5.dr[s] != null ? pc1(Math.round(F5.dr[s] * 10) / 10) : 'n.m.');

const blocks = [
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +${AS.scenarios.bull.revenueGrowthDelta}pp a year, margin +${AS.scenarios.bull.marginDelta}pp; ${pm.bull}x Sep-28E EPS (75th percentile of the forward P/E since the Cenexi deal × ${KW.toFixed(3)}).`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +${n1(AS.revenueGrowth[0])}% / +${n1(AS.revenueGrowth[1])}% / +${n1(AS.revenueGrowth[2])}% (FY27-29E), EBITDA margin ${n1(AS.ebitdaMargin[0])}-${n1(AS.ebitdaMargin[2])}%; ${peMult}x Sep-28E EPS.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth ${AS.scenarios.bear.revenueGrowthDelta}pp a year, margin ${AS.scenarios.bear.marginDelta}pp; ${pm.bear}x (25th percentile × ${KW.toFixed(3)}).`],
  ], source: 'GAM Research' } },
  { callout: `**Asymmetry:** the bull case is further from the price than the bear case, because Gland's operating leverage is high (a few launches moved the base margin from 35% to 40% in a quarter) and the forward multiple has ranged from ~18x to ~45x since 2023. On today's numbers the rule would turn BUY below ~₹${n0(X.buyBelow)} and SELL above ~₹${n0(X.sellAbove)}.` },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Add: net cash at Mar-27E', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ['Implied P/E on FY28E EPS', `${n1(V.intrinsicTp / F.eps[1])}x`],
  ], source: `GAM Research: cost of equity ${n1(V.ke)}% (rf 6.5% + ${AS.dcf.beta} × 6%), terminal growth ${AS.dcf.terminalGrowth}%, growth fading to ${AS.dcf.fadeGrowthTo}%, margin to ${AS.dcf.fadeMarginTo}% and capex to ${AS.dcf.fadeCapexPctTo}% of sales by FY42E` } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { p: `Even at a ${n1(V.sens.waccs[0])}% discount rate and ${V.sens.gs[4]}% terminal growth the DCF gives ₹${n0(V.sens.grid[0][4])}. Holding our FY28-29E margins and capex and applying one flat growth rate for FY28-42E, the DCF reaches today's ₹${n0(price)} only at ~${n1(gNeeded)}% a year for fifteen years (12% gives ~₹${n0(dcfAt12)}, 16% ~₹${n0(dcfAt16)}). That is roughly management's medium-term ambition sustained for three times as long; it is possible if the CDMO, GLP-1 and complex pipelines all deliver, but it is not our base case.` },
  { exhibit: { type: 'table', title: `Listed peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: peerTab.map(p => [p.symbol === 'GLAND' ? '**Gland**' : shortName(p.symbol) + (SET.includes(p.symbol) ? '' : ' (context)'), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', p.pe > 0 && p.pe < 150 ? n1(p.pe) : 'n.m.', SET.includes(p.symbol) || p.symbol === 'GLAND' ? dr5(p.symbol) : '–', n1(p.evEbitda), p.roe + '%']), source: `Screener.in (consolidated), multiples scaled to the NSE close on ${ASOF_TXT}; Caplin Point fetched for this report; Piramal Pharma's P/E is not meaningful (near-zero profit)` } },
  { callout: "**Peers in one line:** Gland trades at ~42x trailing earnings, above diversified pharma (Sun, Cipla, Zydus, Aurobindo at 24-35x) and Caplin Point (~31x), but well below the Indian small-molecule CDMOs (Divi's ~83x, Laurus ~98x, Sai Life ~88x). Its base-business margin is among the best in generics; its group ROE (~10%) is among the lowest, which is the Cenexi and cash drag the market is looking through." },
];

module.exports = { blocks };
