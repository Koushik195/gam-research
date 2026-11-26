// OneSource report, part 5c: scenarios, DCF detail and sensitivity, listed CDMO peers (appended to the valuation chapter).
const X = require('./ONESOURCE.ctx');
const { F, SC, n0, n1, pc1, ASOF_TXT, EVM, EVH, EVH1, sep, PEERS, CDMO, P, W, shortName, price, evNowFwd, evTrail, SECTOR_EV, AS, SHARES } = X;
const bev = SC.bear.blend.methods.find(m => m.key === 'ev'), bevNd = bev.value * SHARES - bev.metric * bev.mult;

const blocks = [
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +${AS.scenarios.bull.revenueGrowthDelta}pp a year, margin +${AS.scenarios.bull.marginDelta}pp; ${EVM.bull}x (75th percentile × sector factor) on Sep-28E EBITDA.`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${EVM.base}x Sep-28E EBITDA of ₹${n0(X.ebitdaSep)} cr.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth ${AS.scenarios.bear.revenueGrowthDelta}pp a year, margin ${AS.scenarios.bear.marginDelta}pp; ${EVM.bear}x (25th percentile × sector factor). In a real setback the multiple would also fall: at the lowest forward multiple since Apr-2026 (${n1(EVH1.min)}x) the bear EBITDA is worth ~₹${n0(Math.round((EVH1.min * bev.metric + bevNd) / SHARES / 10) * 10)}.`],
  ], source: 'GAM Research' } },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Less: net debt at Mar-27E (engine)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
  ], source: `GAM Research. 12.8% = cost of equity (beta ${AS.dcf.beta}), used as WACC (net debt is ~6% of EV). Growth fades from FY29E to ${AS.dcf.fadeGrowthTo}% by FY42E, margin to ${AS.dcf.fadeMarginTo}%, capex to ${AS.dcf.fadeCapexPctTo}% of sales; tax ${AS.taxRate[2]}%.` } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: `Listed CDMO and injectables peers (context only; trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'EV/EBITDA vs median since 13-May-26', 'ROE'], rows: PEERS.filter(p => [...CDMO, 'ONESOURCE'].includes(p.symbol)).sort((a, c) => c.mcapCr - a.mcapCr).map(p => [p.symbol === 'ONESOURCE' ? '**OneSource**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', p.symbol === 'ONESOURCE' ? 'n.m.' : n1(p.pe), n1(p.evEbitda), pc1(W.ev[p.symbol].mv), p.roe + '%']), source: `Screener.in, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js). OneSource's P/E is not meaningful (trailing loss). These names are context; the factor uses the nine-peer pharma set (PLAYBOOK §7c).` } },
  { callout: `**Where OneSource sits:** at ${n1(evTrail)}x trailing EBITDA it looks like the most expensive CDMO listed in India, and at ${n1(evNowFwd)}x our FY28E like one of the cheapest; both are true because FY26 EBITDA was a trough and FY28E is a forecast. The market price assumes most of the ramp happens; our target adds the value of it happening on our (slower) timetable, at a multiple the stock has itself traded at since the turnaround (median ${n1(EVH.med)}x), with no lift from the sector (${pc1(SECTOR_EV)} over the window).` },
];

module.exports = { blocks };
