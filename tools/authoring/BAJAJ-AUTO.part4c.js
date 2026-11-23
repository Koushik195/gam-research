// Bajaj Auto report, part 4c: scenarios, DCF detail and sensitivity, listed peers (end of the valuation chapter).
const X = require('./BAJAJ-AUTO.ctx');
const { V, n0, n1, pc, ASOF_TXT, PEERS, derate, EXCL, shortName, SOTP, CORE, KS, BACL_PB } = X;

const tail = [
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Core ${CORE.bull}x on Sep-28E standalone EPS of ₹${n1(SOTP.bull.eps)}; BACL ${BACL_PB.bull}x book; KTM discount ${KS.discountPct.bull}%.`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Standalone revenue +${X.AS.segments[0].growth[0].toFixed(1)}% / +${X.AS.segments[0].growth[1].toFixed(1)}% / +${X.AS.segments[0].growth[2].toFixed(1)}% (FY27-29E) at ${X.AS.segments[0].marginPct[0]}% / ${X.AS.segments[0].marginPct[1]}% / ${X.AS.segments[0].marginPct[2]}% EBITDA margin; core ${CORE.base}x Sep-28E standalone EPS of ₹${n1(SOTP.base.eps)}; BACL ${BACL_PB.base}x; KTM at market less ${KS.discountPct.base}%.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Core ${CORE.bear}x on ₹${n1(SOTP.bear.eps)}; BACL ${BACL_PB.bear}x; KTM discount ${KS.discountPct.bear}%.`],
  ], source: 'GAM Research' } },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary (consolidated)', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Add: net cash at Mar-27 (excl. BACL\'s operating borrowings)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27, FY26 share count)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
  ], source: 'GAM Research. The engine discounts at the cost of equity (Bajaj has no group debt outside BACL and KTM). It includes 100% of KTM (no deduction for the 25.06% minority) and BACL\'s after-funding-cost cash flows; both make it read high.' } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: 'Listed peers: Indian auto OEMs', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'BAJAJ-AUTO' ? '**Bajaj Auto**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excl. from de-rating)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Bajaj's row is Screener's (consolidated, before our patch). M&M and TVS Motor are on Screener's standalone basis; Ashok Leyland's P/E history starts in 2023.` } },
];

module.exports = { tail };
