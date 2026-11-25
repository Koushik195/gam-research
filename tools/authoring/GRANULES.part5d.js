// Granules India report, part 5d: valuation (second half: target build, cross-checks, sensitivities, scenarios, DCF, peers).
const X = require('./GRANULES.ctx');
const { F, V, SC, n0, n1, pc, pc1, ASOF_TXT, price, mv, MULT, sep, epsSep28, HB, k, EVH, EVM, EVM_PEF, kev, SECTOR_EV, ebitdaSep, treasSep, SENS, gNeeded, dcfAt12, dcfAt15, SHARES, rating, PEERS, CTX, MW, MWEV, shortName, fwdNow, trailPe, P, implPeAtPrice } = X;
const vs = v => pc(v / V.tp * 100 - 100);
const evVal = m => Math.round((m * ebitdaSep + treasSep) / SHARES / 10) * 10;

const blocks = [
  { exhibit: { type: 'table', title: 'From multiple to target', head: ['', 'Base', 'Note'], wide: [2], rows: [
    ['Sep-28E EPS (₹)', n1(epsSep28), `Half FY28E (₹${n1(F.eps[1])}) + half FY29E (₹${n1(F.eps[2])}), on 27.28 cr shares`],
    ['× target multiple', `${MULT.base}x`, `Own median ${n1(HB.med)}x × ${k.toFixed(3)}`],
    ['= Value per share (₹)', n0(mv('pe').value), ''],
    { hl: true, cells: ['**12-month target (rounded)**', '**{{dcf.tp|inr}}**', `vs CMP ₹${n0(price)}: {{dcf.upside|chg}} → ${rating}`] },
  ], source: 'GAM Research (checked in GRANULES.ctx.js)' } },
  { pair: [
    { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Share price today'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    { type: 'line', title: `Forward EV/EBITDA since Apr-2021: median ${n1(EVH.med)}x`, unit: 'EV ÷ next full-year EBITDA (x)', x: X.sEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.sEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 0, max: 18, lines: [{ v: EVM.base, text: `Cross-check: ${EVM.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; shares and net debt from filings (fully diluted after Feb-2026); GAM estimates FY27-28E' },
  ] },
  { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
    ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep28)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
    ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr + net cash ₹${n0(treasSep)} cr`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
    ['DCF', 'Cross-check', 'FCFF, 12.5%, g 5.5%, 15 years', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
    { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
  ], source: 'GAM Research' } },
  { callout: `**What the cross-checks tell us.** EV/EBITDA: Granules' forward EV/EBITDA since Apr-2021 has a median of ${n1(EVH.med)}x; times the peers' EV/EBITDA move (${pc1(SECTOR_EV)}) that is ${EVM.base}x, worth ₹${n0(mv('ev').value)}, ${Math.abs(Math.round(mv('ev').vsTarget))}% ${mv('ev').vsTarget < 0 ? 'below' : 'above'} the target: the two market methods agree. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below: at a 12.5% cost of capital, with working capital at ~37% of sales and margins fading to 23%, the price of ₹${n0(price)} needs revenue growth of ~${Math.round(gNeeded)}% a year from FY28 to FY41, faster than the 15% Granules managed over FY16-26 (at 12% a year the DCF gives ~₹${n0(Math.round(dcfAt12 / 10) * 10)}; at 15%, ~₹${n0(Math.round(dcfAt15 / 10) * 10)}). Every method we use puts value below the price.` },
  { exhibit: { type: 'table', title: 'Sensitivity: other ways to value it (not used in the base)', head: ['Alternative', 'Multiple', 'Basis', 'Value (₹)', 'vs base', 'vs CMP'], wide: [0], rows: [
    ...SENS.slice(1).map(r => [r.name, `${r.mult}x`, r.why, n0(r.tp), vs(r.tp), pc(r.up)]),
    ['EV/EBITDA with the P/E factor (+8.2%)', `${EVM_PEF}x`, `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr`, n0(evVal(EVM_PEF)), vs(evVal(EVM_PEF)), pc(evVal(EVM_PEF) / price * 100 - 100)],
    ['The share price, for reference', `${n1(implPeAtPrice)}x`, `Sep-28E EPS ₹${n1(epsSep28)}`, n0(price), vs(price), '–'],
  ], source: 'GAM Research' } },
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} ${MULT.bull}x (75th percentile × sector factor) on Sep-28E EPS of ₹${n1(sep(SC.bull.eps))}.`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS of ₹${n1(epsSep28)}.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} ${MULT.bear}x (25th percentile × sector factor) on ₹${n1(sep(SC.bear.eps))}. At the lowest forward P/E since Apr-2021 (${n1(HB.min)}x) the bear EPS is worth ~₹${n0(Math.round(HB.min * sep(SC.bear.eps) / 10) * 10)}.`],
  ], source: 'GAM Research' } },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Plus: net cash at Mar-27 (engine, incl. leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
  ], source: 'GAM Research. 12.5% = cost of equity (beta 1.0); net cash, so WACC is the same. Growth fades from FY29E to 7% by FY42E, margin to 23%, capex to 6% of sales.' } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: `Listed peers (context only; trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.filter(p => [...CTX, 'GRANULES'].includes(p.symbol)).sort((a, c) => c.mcapCr - a.mcapCr).map(p => [p.symbol === 'GRANULES' ? '**Granules**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js). API/US-generics peers as context; the factor uses the nine-peer pharma set (PLAYBOOK §7c). Granules' Screener multiples use its post-conversion share count` } },
  { callout: `**Where Granules sits:** at ${n1(trailPe)}x trailing EPS (Screener: ${n1(P.GRANULES.pe)}x) and ${n1(fwdNow)}x our FY28E, Granules trades above Aurobindo (${n1(P.AUROPHARMA.pe)}x), Zydus (${n1(P.ZYDUSLIFE.pe)}x) and Cipla (${n1(P.CIPLA.pe)}x), all larger US-generics companies with clean or cleaner plants, and close to Ipca (${n1(P.IPCALAB.pe)}x). Its own P/E is ${pc1(MW.GRANULES.mv)} above its five-year median (EV/EBITDA ${pc1(MWEV.GRANULES.mv)}), against +8.2% for the pharma set: the gap is the downside in our target.` },
];

module.exports = { blocks };
