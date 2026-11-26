// Concord Biotech report, part 5d: valuation (second half: target build, cross-checks, sensitivities, scenarios, DCF, peers).
const X = require('./CONCORDBIO.ctx2');
const { F, V, SC, n0, n1, pc, pc1, ASOF_TXT, price, mv, MULT, epsU, sep, epsSep28, HB, k, EVH, EVM, EVM_PEF, SECTOR, SECTOR_EV, ebitdaSep, treasSep, SENS, gNeeded, dcfAt20, SHARES, PEERS, CTX, shortName, fwdNow, trailPe, P, OWN, implPeAtPrice, evTrough, ke } = X;
const vs = v => pc(v / V.tp * 100 - 100);
const evVal = m => Math.round((m * ebitdaSep + treasSep) / SHARES / 10) * 10;

const blocks = [
  { exhibit: { type: 'table', title: 'From multiple to target', head: ['', 'Base', 'Note'], wide: [2], rows: [
    ['Sep-28E EPS (₹, pre-bonus)', n1(epsSep28), `Half FY28E (₹${n1(epsU[1])}) + half FY29E (₹${n1(epsU[2])})`],
    ['× target multiple', `${MULT.base}x`, `Own median ${n1(HB.med)}x since 1-Jan-2024 × ${k.toFixed(3)}`],
    ['= Value per share (₹)', n0(mv('pe').value), ''],
    { hl: true, cells: ['**12-month target (rounded)**', '**{{dcf.tp|inr}}**', `vs CMP ₹${n0(price)}: {{dcf.upside|chg}} → ${X.rating}; ₹${n0(V.tp / 2)} after the 1:1 bonus`] },
  ], source: 'GAM Research (checked in CONCORDBIO.ctx2.js)' } },
  { pair: [
    { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case, pre-bonus)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Share price today'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    { type: 'line', title: `Forward EV/EBITDA since listing: median ${n1(EVH.med)}x since Jan-24`, unit: 'EV ÷ next full-year EBITDA (x)', x: X.sEvAll.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.sEvAll.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 0, max: 80, lines: [{ v: EVM.base, text: `Cross-check: ${EVM.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; 10.46 cr shares; Screener-basis net cash; GAM estimates FY27-28E' },
  ] },
  { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
    ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep28)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
    ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr + net cash ₹${n0(treasSep)} cr`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
    ['DCF', 'Cross-check', `FCFF, ${n1(ke)}%, g 5.5%, 15 years`, '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
    { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
  ], source: 'GAM Research' } },
  { callout: `**What the cross-checks tell us.** EV/EBITDA: Concord's forward EV/EBITDA since 1-Jan-2024 has a median of ${n1(EVH.med)}x (no trough year: FY26 EBITDA ₹${n0(evTrough[2026].e)} cr vs a ₹${n0(evTrough[2026].line)} cr line); times the peers' same-window EV/EBITDA move (+${SECTOR_EV}%) that is ${EVM.base}x, worth ₹${n0(mv('ev').value)}, ${Math.abs(Math.round(mv('ev').vsTarget))}% ${mv('ev').vsTarget < 0 ? 'below' : 'above'} the target: the two market methods agree because both read the same short, rich history. The DCF (₹${n0(mv('dcf').value)}) disagrees sharply: at a ${n1(ke)}% cost of capital, with working capital held at 61% of sales and margins fading to 34%, even today's ₹${n0(price)} needs revenue growth of ~${Math.round(gNeeded)}% a year for 15 years (at 20% a year the DCF gives ~₹${n0(Math.round(dcfAt20 / 10) * 10)}). Concord grew ~${Math.round(X.salesCagr9)}% a year in FY16-25. **The market methods say cheap against its own past; the cash-flow method says expensive against its future.** We take the target from the street's method, as the house rule requires, and flag the gap.` },
  { exhibit: { type: 'table', title: 'Sensitivity: other ways to value it (not used in the base)', head: ['Alternative', 'Multiple', 'Basis', 'Value (₹)', 'vs base', 'vs CMP'], wide: [0], rows: [
    ...SENS.slice(1).map(r => [r.name, `${r.mult}x`, r.why, n0(r.tp), vs(r.tp), pc(r.up)]),
    [`EV/EBITDA with the P/E factor (+${SECTOR}%)`, `${EVM_PEF}x`, `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr`, n0(evVal(EVM_PEF)), vs(evVal(EVM_PEF)), pc(evVal(EVM_PEF) / price * 100 - 100)],
    ['The share price, for reference', `${n1(implPeAtPrice)}x`, `Sep-28E EPS ₹${n1(epsSep28)}`, n0(price), vs(price), '–'],
  ], source: 'GAM Research; same-window factors from the nine-peer set (sector-factor.js logic)' } },
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} ${MULT.bull}x (75th percentile × sector factor) on Sep-28E EPS of ₹${n1(sep(SC.bull.eps))}.`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS of ₹${n1(epsSep28)}.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} ${MULT.bear}x (25th percentile × sector factor) on ₹${n1(sep(SC.bear.eps))}. Even the bear multiple is above the street's 25-40x: the history has no cheap period after listing.`],
  ], source: 'GAM Research' } },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Plus: net cash at Mar-27 (engine, incl. Palvella shares)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
  ], source: `GAM Research. ${n1(ke)}% = cost of equity (beta 1.0); no debt, so WACC is the same. Growth fades from FY29E to 7% by FY42E, margin to 34%, capex to 5% of sales; working capital held at FY26's 61% of sales (an engine limit).` } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: `Listed API and fermentation peers (context only; trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'ROE'], rows: [...PEERS.filter(p => CTX.includes(p.symbol)), OWN].sort((a, c) => c.mcapCr - a.mcapCr).map(p => [p.symbol === 'CONCORDBIO' ? '**Concord Biotech**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js). Concord's row is ours (pre-bonus 10.46 cr shares; TTM to Jun-26): asof-peers.js would read Screener's bonus-adjusted file and double its market value. Context only; the factor uses the nine-peer pharma set (PLAYBOOK §7c).` } },
  { callout: `**Where Concord sits:** at ${n1(trailPe)}x trailing EPS and ${n1(OWN.evEbitda)}x trailing EV/EBITDA, Concord is priced above generic API makers (Granules ${n1(P.GRANULES.pe)}x, Ipca ${n1(P.IPCALAB.pe)}x) and near Neuland (${n1(P.NEULANDLAB.pe)}x), below the CDMOs (Divi's ${n1(P.DIVISLAB.pe)}x, Anthem ${n1(P.ANTHEM.pe)}x, Sai Life ${n1(P.SAILIFE.pe)}x). Its margins (${OWN.ebitdaMargin}% in FY26, 42% in FY25) are among the best in the group; its ROE (${OWN.roe}%) is held down by cash and working capital.` },
];

module.exports = { blocks };
