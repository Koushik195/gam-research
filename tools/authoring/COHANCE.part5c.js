// Cohance Lifesciences report, part 5c: valuation, second half (target build, cross-checks, sensitivities, scenarios, DCF, peers).
const X = require('./COHANCE.ctx');
const { F, V, SC, AS, n0, n1, n2, pc, pc1, ASOF_TXT, price, mv, MULT, epsU, sep, epsSep28, HB, k, EVH, EVM, kev, SECTOR_EV, ebitdaSep, treasSep, SENS, gNeeded, gNeeded30, dcfAt15, SHARES, rating, PEERS, CTX, shortName, fwdNow, trailPe, P, implPeAtPrice, sEv } = X;
const vs = v => pc(v / V.tp * 100 - 100);

const blocks = [
  { exhibit: { type: 'table', title: 'From multiple to target', head: ['', 'Base', 'Note'], wide: [2], rows: [
    ['Sep-28E EPS (₹)', n2(epsSep28), `Half FY28E (₹${n2(epsU[1])}) + half FY29E (₹${n2(epsU[2])}); attributable, after minorities`],
    ['× target multiple', `${MULT.base}x`, `Own median since Apr-2021 (trough years out) ${n1(HB.med)}x × ${k.toFixed(3)}`],
    ['= Value per share (₹)', n0(mv('pe').value), ''],
    { hl: true, cells: ['**12-month target (rounded)**', '**{{dcf.tp|inr}}**', `vs CMP ₹${n0(price)}: {{dcf.upside|chg}} → ${rating}`] },
  ], source: 'GAM Research (checked in COHANCE.ctx.js)' } },
  { pair: [
    { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Share price today'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    { type: 'line', title: `Forward EV/EBITDA on the same dates: median ${n1(EVH.med)}x`, unit: 'EV ÷ next full-year EBITDA (x)', x: sEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: sEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 0, max: 45, lines: [{ v: EVM.base, text: `Cross-check: ${EVM.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; Suven (FY23-24) and merged pro forma (FY25) net cash and EBITDA' },
  ] },
  { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
    ['**P/E**', '**Target**', `Sep-28E EPS ₹${n2(epsSep28)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
    ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr less net debt ₹${n0(-treasSep)} cr (incl. leases and the ₹696 cr buy-out liability)`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
    ['DCF', 'Cross-check', 'FCFF, 12.8%, g 5.5%, 15 years', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
    { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
  ], source: 'GAM Research' } },
  { callout: `**What the cross-checks tell us.** EV/EBITDA: the forward EV/EBITDA on the same dates has a median of ${n1(EVH.med)}x; times the peers' EV/EBITDA move (${pc1(SECTOR_EV)}) that is ${EVM.base}x, worth ₹${n0(mv('ev').value)}, ${Math.abs(Math.round(mv('ev').vsTarget))}% ${mv('ev').vsTarget < 0 ? 'below' : 'above'} the target. It is higher than P/E because EBITDA ignores the heavier depreciation, interest and NJ Bio's losses below EBITDA that the merged company now carries; it is still below the price. The DCF (₹${n0(mv('dcf').value)}) is far lower: at a 12.8% cost of capital, with working capital at ~38% of sales and margins fading only to 25%, the price of ₹${n0(price)} needs revenue growth of ~${Math.round(gNeeded)}% a year from FY28 to FY41 (~${Math.round(gNeeded30)}% if margins reached 30%); at 15% growth the DCF gives ~₹${n0(Math.round(dcfAt15 / 10) * 10)}. Every method we use says the price is ahead of the cash flows we can see.` },
  { exhibit: { type: 'table', title: 'Sensitivity: other ways to value it (not used in the base)', head: ['Alternative', 'Multiple', 'Basis', 'Value (₹)', 'vs base', 'vs CMP'], wide: [0], rows: [
    ...SENS.slice(1).map(r => [r.name, r.mult ? `${r.mult}x` : '–', r.why, r.tp ? n0(r.tp) : '–', r.tp ? vs(r.tp) : '–', r.up != null ? pc(r.up) : '–']),
    ['The share price, for reference', `${n1(implPeAtPrice)}x`, `Sep-28E EPS ₹${n2(epsSep28)}`, n0(price), vs(price), '–'],
  ], source: 'GAM Research' } },
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} ${MULT.bull}x (75th percentile × sector factor) on Sep-28E EPS of ₹${n2(sep(SC.bull.eps))}.`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS of ₹${n2(epsSep28)}.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} ${MULT.bear}x (25th percentile × sector factor) on ₹${n2(sep(SC.bear.eps))}.`],
  ], source: 'GAM Research' } },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Net cash (negative = net debt) at Mar-27E: incl. leases and the ₹696 cr buy-out liability, plus the Raisin stake (engine)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
  ], source: 'GAM Research. 12.8% = cost of equity (beta 1.05); net debt is ~7% of market value, so WACC is close. Growth fades from FY29E to 7% by FY42E, margin to 25%, capex to 6.5% of sales; working capital 38.5% of sales.' } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: `Listed CDMO peers (context only; trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'FY26 revenue growth', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.filter(p => [...CTX, 'COHANCE'].includes(p.symbol)).sort((a, c) => c.mcapCr - a.mcapCr).map(p => [p.symbol === 'COHANCE' ? '**Cohance**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), { SAILIFE: '+29%', ACUTAAS: '+33%', ANTHEM: '+15%', NEULANDLAB: '+37%', LAURUSLABS: '+23%', SYNGENE: '+3%', PPLPHARMA: '−3%', DIVISLAB: '+13%', COHANCE: '−13%' }[p.symbol] || '', p.ebitdaMargin + '%', n1(p.pe), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js). Context only; the factor uses the nine-name pharma set (PLAYBOOK §7c).` } },
  { callout: `**Where Cohance sits:** ${n1(trailPe)}x trailing EPS and ${n1(fwdNow)}x our FY28E, priced like the growing CDMOs (Divi's ${n1(P.DIVISLAB.pe)}x, Sai Life ${n1(P.SAILIFE.pe)}x, Anthem ${n1(P.ANTHEM.pe)}x) although its revenue fell 13% while theirs grew 13-37%. The market is valuing FY29-30 earnings and Umang Vohra's track record. Our rule values the earnings we can forecast.` },
];

module.exports = { blocks };
