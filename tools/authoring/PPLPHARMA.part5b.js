// Piramal Pharma report, part 5b: scenarios, DCF detail and sensitivity, listed peers (valuation chapter, continued).
const X = require('./PPLPHARMA.ctx');
const { AS, V, F, n0, n1, pc1, mv, MULT, P, SET, CTX, shortName, ASOF_TXT, price, DCFV, buyBelow, sellAbove, sh } = X;
const peerTab = [...new Set(['PPLPHARMA', ...SET, ...CTX])].map(s => P[s]).filter(p => p && !p.missing);

const blocks = [
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +${AS.scenarios.bull.revenueGrowthDelta}pp a year, margin +${AS.scenarios.bull.marginDelta}pp; ${MULT.bull}x Sep-28E EBITDA (75th percentile × the factor).`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +${n1(AS.revenueGrowth[0])}% / +${n1(AS.revenueGrowth[1])}% / +${n1(AS.revenueGrowth[2])}% (FY27-29E), EBITDA margin ${n1(AS.ebitdaMargin[0])}-${n1(AS.ebitdaMargin[2])}%; ${MULT.base}x Sep-28E EBITDA plus the JV, less net debt.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth ${AS.scenarios.bear.revenueGrowthDelta}pp a year, margin ${AS.scenarios.bear.marginDelta}pp; ${MULT.bear}x (25th percentile × the factor).`],
  ], source: 'GAM Research' } },
  { callout: `**Asymmetry:** the bull case is further from the price than the bear case because Piramal's operating leverage is extreme: each percentage point of FY28E margin is ~₹${n0(F.sales[1] / 100)} cr of EBITDA, worth ~₹${n0(F.sales[1] / 100 * MULT.base / sh)} a share at ${MULT.base}x. Leverage cuts the other way too: net debt (~₹${n0(-X.tSep28)} cr at Sep-28E) is ~${Math.round(-X.tSep28 / (MULT.bear * X.SOTP.bear.eb) * 100)}% of bear-case operating value. On today's numbers the rule says BUY below ~₹${n0(buyBelow)}, HOLD up to ~₹${n0(sellAbove)}, SELL above.` },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Add: net cash at Mar-27E (negative = net debt)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ['Same, with tax at 25% from FY28E (management\'s "at scale" rate)', `₹${n0(DCFV.tax25)}`],
    ['Same, with margins fading to 25% (management\'s FY30 goal)', `₹${n0(DCFV.m25)}`],
    ['Both: 25% tax and 25% margins', `₹${n0(DCFV.both)}`],
  ], source: `GAM Research: WACC = cost of equity ${n1(V.ke)}% (rf 6.5% + ${AS.dcf.beta} × 6%; beta set so the rate equals our WACC), terminal growth ${AS.dcf.terminalGrowth}%, growth fading to ${AS.dcf.fadeGrowthTo}%, margin to ${AS.dcf.fadeMarginTo}% and capex to ${AS.dcf.fadeCapexPctTo}% of sales by FY42E; the engine taxes all years at the FY29E rate (${AS.taxRate[2]}%); variants computed with the same mechanics` } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { p: `Even with management's long-run tax rate and margin goal the DCF (₹${n0(DCFV.both)}) stays below the ₹${n0(price)} price. The reasons are structural: heavy working capital (~27% of sales on Screener's balance sheet), capex that stays at 8-15% of sales through FY27-29E, and depreciation on plants that are not yet full. A cash-flow investor needs margins well above 25% or a much lower cost of capital to pay today's price; an EV/EBITDA investor needs only the history to repeat. We use the street's method for the target and show the DCF so readers can see the gap.` },
  { exhibit: { type: 'table', title: `Listed peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'ROE', 'Role'], rows: peerTab.map(p => [p.symbol === 'PPLPHARMA' ? '**Piramal Pharma**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), `${p.ebitdaMargin}%`, p.pe > 0 && p.pe < 150 ? n1(p.pe) : 'n.m.', n1(p.evEbitda), `${p.roe}%`, p.symbol === 'PPLPHARMA' ? 'Subject' : SET.includes(p.symbol) ? 'Factor peer' : 'Context']), source: `Screener.in (consolidated), multiples scaled to the NSE close on ${ASOF_TXT}; trailing EV/EBITDA uses Screener's EBITDA incl. other income` } },
  { callout: `**Peers in one line:** on trailing EV/EBITDA Piramal (~${n1(P.PPLPHARMA.evEbitda)}x) sits above diversified pharma (Zydus, Cipla, Aurobindo at 12-18x) and Syngene (~${n1(P.SYNGENE.evEbitda)}x) and far below the high-margin CDMOs (Divi's, Laurus, Sai Life, Anthem at 46-55x), with the lowest margin and return on equity of the group. The market is valuing it as a recovering CDMO, not on what it earns today.` },
];

module.exports = { blocks };
