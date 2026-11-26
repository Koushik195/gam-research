// Poly Medicure report, part 5c: valuation, second half (EPS basis, charts, target build, cross-checks, sensitivities,
// scenarios, DCF detail, peers). Merged into the valuation section by part5b.
const X = require('./POLYMED.ctx');
const { F, V, n0, n1, n2, pc, pc1, ASOF_TXT, price, mv, MULT, EPSC, epsSep, epsU, epsBase, epsRepAll, C, HB, HEV, EVM, EVM_PEFACTOR, ebitdaSep, treasSep, evNowFwd, evValAt, sBase, k, SECTOR, SECTOR_EV, ownMove, SENS, PEERS, PE5, shortName, SHARES, waya, oiFx, fwdEv } = X;
const r10 = v => n0(Math.round(v / 10) * 10);
const vs = v => pc(v / V.tp * 100 - 100);
const fxEps = (oiFx[1] + oiFx[2]) / 2 * (1 - 0.253) / SHARES;

const blocksB = [
  { exhibit: { type: 'table', title: 'One basis for history and forecasts (₹)', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
    ['Profit to shareholders (₹ cr)', n0(X.patRep[2024]), n0(X.patRep[2025]), n0(X.patRep[2026]), ...F.pat.map(n0)],
    ['Add: labour-code and acquisition costs after tax (₹ cr)', '–', '–', `+${n1(C.exceptional.FY26.afterTax)}`, '–', '–', '–'],
    ['Shares at year-end (cr)', n2(X.shYE[2024]), n2(X.shYE[2025]), n2(X.shYE[2026]), n2(SHARES), n2(SHARES), n2(SHARES)],
    ['Reported EPS (₹)', n2(epsRepAll[2024]), n2(epsRepAll[2025]), n2(epsRepAll[2026]), ...epsU.map(n2)],
    { hl: true, cells: ['**EPS on our basis (₹)**', `**${n2(epsBase[2024])}**`, `**${n2(epsBase[2025])}**`, `**${n2(epsBase[2026])}**`, ...epsU.map(v => `**${n2(v)}**`)] },
  ], source: 'Screener.in ("Profit for EPS"); AR FY25 note 50, AR FY26 note 14; Q3-Q4FY26 PPTs; GAM. In the P/E history each weekly point uses market value at that date (9.60 cr shares before 22-Aug-2024, 10.13 cr after) ÷ the next year\'s profit.' } },
  { pair: [
    { type: 'line', title: `Forward P/E since 2021: ${n1(X.fwdNow)}x now vs a ${n1(HB.med)}x median; target ${MULT.base}x`, unit: 'Market value ÷ next full-year profit (x); FY26 before one-offs', x: sBase.map(x => x[0]), series: [{ name: 'Forward P/E', values: sBase.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Target ${MULT.base}x (median ${n1(HB.med)}x × ${k.toFixed(3)})`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; actual profit FY23-26, GAM FY27-28E' },
    { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'EV/EBITDA with the P/E factor', 'DCF', 'Share price today'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(evValAt(EVM_PEFACTOR)), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
  ] },
  { exhibit: { type: 'table', title: 'From multiple to target', head: ['', 'Base', 'Note'], wide: [2], rows: [
    ['Sep-28E EPS to shareholders (₹)', n1(epsSep), `Half FY28E (₹${n1(epsU[1])}) + half FY29E (₹${n1(epsU[2])})`],
    ['× target multiple', `${MULT.base}x`, `Own median ${n1(HB.med)}x × ${k.toFixed(3)}`],
    ['= Value per share (₹)', n0(MULT.base * epsSep), 'The Excel model carries the same multiple on the same EPS'],
    { hl: true, cells: ['**12-month target (rounded)**', '**{{dcf.tp|inr}}**', `vs ₹${n0(price)} on ${ASOF_TXT}: {{dcf.upside|chg}}`] },
  ], source: 'GAM Research (checked in POLYMED.ctx.js)' } },
  { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
    ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
    ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr; net cash Sep-28E ₹${n0(treasSep)} cr`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
    ['DCF', 'Cross-check', 'FCFF, 12.2%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
    { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
  ], source: 'GAM Research' } },
  { callout: `**What the cross-checks tell us.** EV/EBITDA: Polymed's one-year-forward EV/EBITDA since Apr-2021 (QIP cash counted from the allotment) has a median of ${n1(HEV.med)}x; times the pharma EV/EBITDA factor (+${SECTOR_EV}%) that is ${EVM.base}x, worth ₹${n0(mv('ev').value)} on Sep-28E EBITDA, ${pc(mv('ev').vsTarget)} from the target; the stock trades at ${n1(evNowFwd)}x FY28E today. The two market methods agree. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below: at 12.2%, a business that ties up ~44% of each extra rupee of sales in working capital and spends 9% of sales on capex generates little free cash for years, so even 13% growth and a 24% margin cannot support today's price. That is true of most Indian medical-technology and healthcare stocks; the market pays for growth duration. We use the method the street uses and flag that the price rests on the multiple.` },
  { pair: [
    { type: 'line', title: `Forward EV/EBITDA since 2021: median ${n1(HEV.med)}x; cross-check ${EVM.base}x`, unit: 'EV ÷ next full-year EBITDA (x); QIP cash counted from 22-Aug-2024', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: EVM.base, text: `${EVM.base}x (median × 1.075)`, color: '#cf8f1f' }], source: 'Screener.in prices, balance sheets and EBITDA; GAM FY27-28E' },
    { type: 'column', title: 'Median forward P/E by forward year: 33x to 68x', unit: 'Median of weekly points (x), by the fiscal year whose profit is the denominator', x: X.yearWin.map(w => w.fy), series: [{ name: 'Median', values: X.yearWin.map(w => Math.round(w.med * 10) / 10), fmt: 'x' }], labels: 'all', highlight: 'FY26', source: 'GAM (FY26 forward = prices Apr-2024 to Mar-2025, the bubble year)' },
  ] },
  { exhibit: { type: 'table', title: 'Sensitivity: other ways to value it (not used in the base)', head: ['Alternative', 'Multiple', 'Applied to', 'Value (₹)', 'vs base'], wide: [0], rows: [
    ['Reported profit in history (FY26 after one-offs)', `${SENS.rep}x`, `Sep-28E EPS ₹${n1(epsSep)}`, r10(SENS.rep * epsSep), vs(SENS.rep * epsSep)],
    ['Screener-style EPS on year-end shares (ignores the QIP date)', `${SENS.ye}x`, `₹${n1(epsSep)}`, r10(SENS.ye * epsSep), vs(SENS.ye * epsSep)],
    ['House forwardMedian (Screener EPS, every 5th week)', `${SENS.house}x`, `₹${n1(epsSep)}`, r10(SENS.house * epsSep), vs(SENS.house * epsSep)],
    ['Window from 1-Apr-2022 (drops the 2021 post-QIP rally)', `${SENS.from22}x`, `₹${n1(epsSep)}`, r10(SENS.from22 * epsSep), vs(SENS.from22 * epsSep)],
    ['Last three years only (from Oct-2023; includes the 2024 bubble)', `${SENS.last3}x`, `₹${n1(epsSep)}`, r10(SENS.last3 * epsSep), vs(SENS.last3 * epsSep)],
    ['No sector factor (own median only)', `${SENS.noK}x`, `₹${n1(epsSep)}`, r10(SENS.noK * epsSep), vs(SENS.noK * epsSep)],
    [`Midpoint of sector (+${SECTOR}%) and own (${pc1(ownMove)}) moves`, `${SENS.ownMid}x`, `₹${n1(epsSep)}`, r10(SENS.ownMid * epsSep), vs(SENS.ownMid * epsSep)],
    ['Wider healthcare factor', `${SENS.wide}x`, `₹${n1(epsSep)}`, r10(SENS.wide * epsSep), vs(SENS.wide * epsSep)],
    ['Laxmi Dental\'s same-window move (one med-tech name)', `${SENS.medtech}x`, `₹${n1(epsSep)}`, r10(SENS.medtech * epsSep), vs(SENS.medtech * epsSep)],
    ['Pharma nine over Laxmi Dental\'s window', `${SENS.pharmaSame}x`, `₹${n1(epsSep)}`, r10(SENS.pharmaSame * epsSep), vs(SENS.pharmaSame * epsSep)],
    ['No forex gains in forecasts (flat rupee)', `${MULT.base}x`, `₹${n1(epsSep - fxEps)}`, r10(MULT.base * (epsSep - fxEps)), vs(MULT.base * (epsSep - fxEps))],
    ['EV/EBITDA with the P/E factor', `${EVM_PEFACTOR}x`, `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr`, r10(evValAt(EVM_PEFACTOR)), vs(evValAt(EVM_PEFACTOR))],
    [`Waya's 50x on its FY28E EPS (₹${waya.eps.FY28E})`, '50x', `₹${waya.eps.FY28E}`, r10(50 * waya.eps.FY28E), vs(50 * waya.eps.FY28E)],
  ], source: 'GAM Research' } },
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +2.5pp a year, margin +1pp; ${MULT.bull}x (75th percentile × factor) on Sep-28E EPS of ₹${n1(EPSC.bull)}.`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS of ₹${n1(epsSep)}.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −3pp a year, margin −1.5pp; ${MULT.bear}x (25th percentile × factor) on ₹${n1(EPSC.bear)}.`],
  ], source: 'GAM Research' } },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Add: net cash at Mar-27 (engine)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
  ], source: 'GAM Research. Cost of equity 12.2% (6.5% + 0.95 × 6%) ≈ WACC (net cash); working capital grows at FY26\'s 44% of sales.' } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: `Healthcare peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs own median', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.filter(p => !p.missing && (X.PHARMA.includes(p.symbol) || X.MT.includes(p.symbol) || p.symbol === 'POLYMED')).map(p => [p.symbol === 'POLYMED' ? '**Poly Medicure**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc1(PE5[p.symbol].move), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js); medians over five years (Laxmi Dental from May-2025). ROE on profit before minorities.` } },
];

module.exports = { blocksB, fxEps };
