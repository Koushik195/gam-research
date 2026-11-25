// Dr Lal PathLabs report, part 5c: valuation, second half (EPS basis, charts, target build, cross-checks, sensitivities,
// scenarios, DCF detail, peers). Merged into the valuation section by part5b.
const X = require('./LALPATHLAB.ctx');
const { F, V, n0, n1, n2, pc, pc1, ASOF_TXT, price, mv, MULT, EPSC, epsSep, epsU, epsBase, epsRep, C, HB, HEV, HEV22, EVM, EVM_PEFACTOR, ebitdaSep, treasSep, evNowFwd, evValAt, sBase, k, SECTOR, SECTOR_EV, dr5, multRep, mult22, mult22R, multHouse, multNoK, multOwnMid, multEvK, multGrowth, PEERS, shortName, SNG, jm, nom, hsie, SHARES } = X;
const r10 = v => n0(Math.round(v / 10) * 10);
const vs = v => pc(v / V.tp * 100 - 100);

const blocksB = [
  { exhibit: { type: 'table', title: 'One basis for history and forecasts: EPS before exceptional items (₹, bonus-adjusted)', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
    ['Reported EPS (Screener; FY27-29E model, after minorities)', n2(epsRep[2024]), n2(epsRep[2025]), n2(epsRep[2026]), ...epsU.map(n2)],
    ['Less: Suburban-liquidation tax credit (₹40.8 cr)', '–', `−${n2(C.exceptional.FY25.afterTax / 16.6586)}`, '–', '–', '–', '–'],
    ['Add: labour-code charge after tax (₹22.5 cr)', '–', '–', `+${n2(C.exceptional.FY26.afterTax / 16.6914)}`, '–', '–', '–'],
    { hl: true, cells: ['**EPS on our basis**', `**${n2(epsBase[2024])}**`, `**${n2(epsBase[2025])}**`, `**${n2(epsBase[2026])}**`, ...epsU.map(v => `**${n2(v)}**`)] },
  ], source: 'Screener.in; AR FY26 notes 33, 34, 41; Q4FY26 PPT; GAM. Company weighted shares (16.66 / 16.69 cr) for FY25-26 adjustments; the reported EPS row is Screener\'s (16.76 cr basis).' } },
  { pair: [
    { type: 'line', title: `Forward P/E since 2021: our ${MULT.base}x vs a ${n1(HB.med)}x median`, unit: 'Price ÷ next full-year EPS before exceptional items (x); points above 80x clipped', x: sBase.map(x => x[0]), series: [{ name: 'Forward P/E', values: sBase.map(x => Math.min(x[1], 80)), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our target ${MULT.base}x (median ${n1(HB.med)}x)`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; actual EPS FY22-26, GAM estimates FY27-28E' },
    { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'EV/EBITDA with the P/E factor', 'DCF', 'Share price today'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(evValAt(EVM_PEFACTOR)), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
  ] },
  { exhibit: { type: 'table', title: 'From multiple to target', head: ['', 'Base', 'Note'], wide: [2], rows: [
    ['Sep-28E EPS to shareholders (₹)', n1(epsSep), `Half FY28E (₹${n1(epsU[1])}) + half FY29E (₹${n1(epsU[2])})`],
    ['× target multiple', `${MULT.base}x`, `Own median ${n1(HB.med)}x × ${k.toFixed(3)}`],
    ['= Value per share (₹)', n0(MULT.base * epsSep), 'The Excel model carries the same multiple on the same EPS'],
    { hl: true, cells: ['**12-month target (rounded)**', '**{{dcf.tp|inr}}**', `vs ₹${n0(price)} on ${ASOF_TXT}: {{dcf.upside|chg}}`] },
  ], source: 'GAM Research (checked in LALPATHLAB.ctx.js)' } },
  { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
    ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
    ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr; net cash Sep-28E ₹${n0(treasSep)} cr (engine)`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
    ['DCF', 'Cross-check', 'FCFF, 11.6%, g 6%; capex incl. leases', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
    { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
  ], source: 'GAM Research' } },
  { callout: `**What the cross-checks tell us.** EV/EBITDA: Dr Lal's one-year-forward EV/EBITDA since Apr-2021 has a median of ${n1(HEV.med)}x (${n1(HEV22.med)}x from Apr-2022); times the peers' EV/EBITDA move (+${SECTOR_EV}%) that is ${EVM.base}x, worth ₹${n0(mv('ev').value)} on Sep-28E EBITDA, ${pc(mv('ev').vsTarget)} from the target. With the P/E factor instead (${EVM_PEFACTOR}x) it would be ₹${r10(evValAt(EVM_PEFACTOR))}: the whole gap between the two market methods is the choice of sector factor, i.e. Thyrocare's profit recovery. Today the stock trades at ${n1(evNowFwd)}x FY28E EV/EBITDA. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below: at an 11.6% cost of capital, even 12-16% growth, a ~29% margin fading to 27% and capex (with leases) of 6-7% of revenue leave a free-cash-flow yield of ~2% at today's price. Emkay's DCF reaches ₹2,100 with a lower discount rate and higher terminal assumptions. We use the market method the street uses; the DCF says the multiple, not near-term cash flow, carries the price.` },
  { exhibit: { type: 'table', title: 'Sensitivity: other ways to value it (not used in the base)', head: ['Alternative', 'Multiple', 'Applied to', 'Value (₹)', 'vs base'], wide: [0], rows: [
    ['Reported EPS in history (all weeks since Apr-2021)', `${multRep}x`, `Sep-28E EPS ₹${n1(epsSep)}`, r10(multRep * epsSep), vs(multRep * epsSep)],
    ['House forwardMedian on reported EPS (every 5th week; no trough years)', `${multHouse}x`, `₹${n1(epsSep)}`, r10(multHouse * epsSep), vs(multHouse * epsSep)],
    ['Window from 1-Apr-2022 (drops the COVID-boom prices), EPS before exceptional items', `${mult22}x`, `₹${n1(epsSep)}`, r10(mult22 * epsSep), vs(mult22 * epsSep)],
    ['Window from 1-Apr-2022, reported EPS', `${mult22R}x`, `₹${n1(epsSep)}`, r10(mult22R * epsSep), vs(mult22R * epsSep)],
    ['No sector factor (own median only)', `${multNoK}x`, `₹${n1(epsSep)}`, r10(multNoK * epsSep), vs(multNoK * epsSep)],
    [`Midpoint of sector (${SECTOR}%) and own (${pc1(dr5.LALPATHLAB)}) moves`, `${multOwnMid}x`, `₹${n1(epsSep)}`, r10(multOwnMid * epsSep), vs(multOwnMid * epsSep)],
    [`EV/EBITDA sector factor (+${SECTOR_EV}%) applied to the P/E`, `${multEvK}x`, `₹${n1(epsSep)}`, r10(multEvK * epsSep), vs(multEvK * epsSep)],
    ['10% premium for faster EPS growth than the history priced', `${multGrowth}x`, `₹${n1(epsSep)}`, r10(multGrowth * epsSep), vs(multGrowth * epsSep)],
    ['EV/EBITDA with the P/E factor', `${EVM_PEFACTOR}x`, `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr`, r10(evValAt(EVM_PEFACTOR)), vs(evValAt(EVM_PEFACTOR))],
    ['SN Genelab and Ghana included (EPS effect, less cash)', `${MULT.base}x`, `₹${n1(epsSep + SNG.epsEffectAll)}`, r10(MULT.base * (epsSep + SNG.epsEffectAll)), vs(MULT.base * (epsSep + SNG.epsEffectAll))],
    ['Street: JM 48x Jun-28E, Nomura 45x, HDFC Sec 44x on our EPS', '48x / 45x / 44x', `Jun-28E ₹${n1(epsU[1] * 0.75 + epsU[2] * 0.25)} / FY28E ₹${n1(epsU[1])} / Dec-27E ₹${n1(epsU[0] * 0.25 + epsU[1] * 0.75)}`, `${r10(48 * (epsU[1] * 0.75 + epsU[2] * 0.25))} / ${r10(45 * epsU[1])} / ${r10(44 * (epsU[0] * 0.25 + epsU[1] * 0.75))}`, vs(48 * (epsU[1] * 0.75 + epsU[2] * 0.25))],
  ], source: 'GAM Research' } },
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +2pp a year, margin +1pp; ${MULT.bull}x (75th percentile × sector factor) on Sep-28E EPS of ₹${n1(EPSC.bull)}.`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS of ₹${n1(epsSep)}.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −2.5pp a year, margin −1.5pp; ${MULT.bear}x (25th percentile × sector factor) on ₹${n1(EPSC.bear)}.`],
  ], source: 'GAM Research' } },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Add: net cash after leases at Mar-27 (engine)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
  ], source: 'GAM Research. Capex includes new leases (EBITDA excludes rent); the tax rate includes the minorities\' small share.' } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: `Listed diagnostics peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.filter(p => !p.missing).map(p => [p.symbol === 'LALPATHLAB' ? '**Dr Lal PathLabs**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc1(dr5[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js). ROE on profit before minorities in Screener's calculation.` } },
];

module.exports = { blocksB };
