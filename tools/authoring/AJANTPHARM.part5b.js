// Ajanta Pharma report, part 5b: valuation. P/E primary (every broker that discloses a method uses it) on Sep-28E EPS; the
// multiple = Ajanta's own one-year-forward P/E median since Apr-2021 (house forwardMedian, reported EPS) x the pharma factor
// for names outside the nine-peer set (+8.2%, PLAYBOOK §7c A21); EV/EBITDA (+7.5% analogue) and DCF cross-checks.
const X = require('./AJANTPHARM.ctx');
const { D, F, V, SC, n0, n1, pc, pc1, ASOF_TXT, price, mv, MULT, EPSC, SENS, val, epsSep, epsU, HB, HX, HW, FWDFY, sBase, FM, epsRep, epsExc, troughRows, troughYrs, pre26,
  PEERS, P, MED5, MED5EV, derate, derateEv, PEER_SET, EXCL, CONTEXT, sectorCalc, sectorEvCalc, SECTOR, SECTOR_EV, k, kev, LARGE, sectorLarge, BRANDED, sectorBranded, shortName, HEV, EVM, EVM_PE, ebitdaT27, treasT27, evFy28,
  peFy27, peFy28, peSep28, peTtm, SHARES, epsCagr, ebitdaCagr, salesCagr, atOurs, jun28, A, b } = X;
const r10 = v => n0(Math.round(v / 10) * 10);
const vs = v => pc(v / V.tp * 100 - 100);
const sortDesc = (arr, by) => [...arr].sort((a, c) => by[c] - by[a]);
const evPe = (EVM_PE * ebitdaT27 + treasT27) / SHARES;

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the stock already trades above that, at ${n1(peFy28)}x our FY28E EPS`,
  blocks: [
    { h: 'How the street values Ajanta' },
    { p: `Every note standing on ${ASOF_TXT} that discloses a method values Ajanta on **P/E**: Motilal Oswal 32x 12-month-forward EPS, PL and ICICI Direct 32x FY28E, BOBCAPS 30x Jun-28E (all 30-Jul to 3-Aug-2026) and ICICI Securities 28x FY28E (per a secondary source); Jefferies does not publish its method. ICICI Direct used EV/EBITDA until May-2026 and switched to P/E in August. We follow the majority: **P/E on Sep-28E EPS (half FY28E, half FY29E)**. Ajanta has no minority interests and reports no exceptional items, so the model's EPS is the right base. EV/EBITDA and a DCF are cross-checks only.` },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { p: `The house rule (PLAYBOOK §4, §7c): Ajanta's own one-year-forward P/E (price ÷ next full fiscal year's EPS) from Apr-2021 to ${ASOF_TXT}, every fifth weekly close (${HB.n} points; house forwardMedian), leaving out trough years (none: the lowest year, FY23's ₹${n1(troughRows[1].eps)}, was ${Math.round(troughRows[1].eps / troughRows[1].peak * 100)}% of the prior three-year peak); then multiplied by the pharma sector factor for names outside the nine-peer set (the median move of all nine peers' trailing P/E at the ${ASOF_TXT} close against their five-year medians: +${SECTOR}%, PLAYBOOK §7c A21; our reproduction ${pc1(sectorCalc)}), and rounded to the nearest half-turn. **On exceptional items:** the company reports none; Screener treats the FY26 hedge loss as one (−₹73 cr after tax) while leaving the ₹97 cr FX gain it hedged in profit. We therefore use reported EPS for the base and show Screener's "before exceptional items" EPS as a sensitivity (it gives ${SENS.exc}x, the same answer). No own-move, growth or returns adjustment enters the base.` },
    { exhibit: { type: 'table', title: 'Deriving the target multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Its own history', `Forward P/E since Apr-2021 on reported EPS: median **${n1(HB.med)}x** (25th-75th percentile ${n1(HB.p25)}-${n1(HB.p75)}x; range ${n1(HB.min)}-${n1(HB.max)}x). By forward year: ${FWDFY.map(f => `${f.fy} ${n1(f.med)}x`).join(', ')}. No trough years${troughYrs.length ? ` (excluded: ${troughYrs.join(', ')})` : ''}. Every weekly close: ${n1(HW.med)}x; Screener EPS before exceptional items: ${n1(HX.med)}x; windows on actual EPS only (to Mar-2025): ${n1(pre26.med)}x`, `Starting point: ${n1(HB.med)}x`],
      ['2. Sector move', `Nine pharma peers' trailing P/E at the ${ASOF_TXT} close vs each one's five-year median (table below): median **+${SECTOR}%** (our reproduction ${pc1(sectorCalc)}). Pharma trades above its medians, so the factor lifts the multiple`, `${n1(HB.med)}x × ${k} = ${n1(HB.med * k)}x → **${MULT.base}x**`],
      ['3. Growth', `EPS ${Math.round(epsCagr)}% a year FY26-29E on our numbers (street ~16-21% FY26-28); revenue ~${Math.round(salesCagr)}%, EBITDA ~${Math.round(ebitdaCagr)}%`, 'No premium or discount (sensitivity below)'],
      ['4. Peers', `Trailing P/E on ${ASOF_TXT}: Ipca ${n1(P.IPCALAB.pe)}x, Alkem ${n1(P.ALKEM.pe)}x, Torrent ${n1(P.TORNTPHARM.pe)}x, Abbott ${n1(P.ABBOTINDIA.pe)}x, J.B. Chemicals ${n1(P.JBCHEPHARM.pe)}x, Mankind ${n1(P.MANKIND.pe)}x; Ajanta ${n1(P.AJANTPHARM.pe)}x (${pc1(derate.AJANTPHARM)} vs its own five-year median)`, `${MULT.base}x Sep-28E ≈ ${n1(MULT.base * epsSep / epsU[0])}x FY27E: below Ajanta's own trailing ${n1(peTtm)}x today`],
      ['5. Returns', 'ROCE 33% and ROE 25% in FY26 (company), net cash, vs an 11.3% cost of equity', 'Supports a premium to the market, already in its own history'],
      ['6. Street basis', 'MOSL, PL and ICICI Direct 32x, BOBCAPS 30x, ICICI Securities 28x, mostly one year forward from today', 'Our multiple is in the street range; our EPS is lower'],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; GAM estimates (FY27-28E EPS in the forward history); peers' Screener files (asof-peers.js)` } },
    { exhibit: { type: 'table', title: `Pharma sector factor: trailing P/E at the ${ASOF_TXT} close vs five-year median (and the EV/EBITDA analogue)`, head: ['Company', 'P/E (x)', '5-yr median (x)', 'vs median', 'EV/EBITDA (x)', '5-yr median (x)', 'vs median'], rows: [
      ...sortDesc(PEER_SET, derate).map(s => [shortName(s), n1(P[s].pe), n1(MED5[s]), pc1(derate[s]), n1(P[s].evEbitda), n1(MED5EV[s]), pc1(derateEv[s])]),
      { hl: true, cells: ['**Median of the nine (set: P/E +8.2%, EV/EBITDA +7.5%)**', '', '', `**${pc1(sectorCalc)}**`, '', '', `**${pc1(sectorEvCalc)}**`] },
      ['Ajanta (outside the set; not in its own factor)', n1(P.AJANTPHARM.pe), n1(MED5.AJANTPHARM), pc1(derate.AJANTPHARM), n1(P.AJANTPHARM.evEbitda), n1(MED5EV.AJANTPHARM), pc1(derateEv.AJANTPHARM)],
      ...EXCL.map(s => [shortName(s), '', '', '', '', '', `Excluded: ${D.peers.excluded[s]}`]),
    ], source: `Screener.in "Price to Earning" and "EV Multiple" series from 30-Sep-2021 to ${ASOF_TXT}, scaled to the NSE close (asof-peers.js); peer set and factors per PLAYBOOK §7c (A21). Our reproduction matches the set figures.` } },
    { exhibit: { type: 'table', title: 'EPS bases (₹)', head: ['', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { hl: true, cells: ['**Reported EPS (base; FY27-29E model)**', ...[2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029].map(y => `**${n1(epsRep[y])}**`)] },
      ['Screener EPS before "exceptional items" (sensitivity)', ...[2022, 2023, 2024, 2025, 2026].map(y => n1(epsExc[y])), ...epsU.map(n1)],
    ], source: 'Screener.in; GAM. The company reports no exceptional items; the FY26 gap is the hedge loss' } },
    { pair: [
      { type: 'line', title: `Forward P/E since Apr-2021: our ${MULT.base}x vs a ${n1(HB.med)}x median`, unit: 'Price ÷ next full-year EPS (x)', x: sBase.map(x => x[0]), series: [{ name: 'Forward P/E', values: sBase.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HB.med, text: `Median: ${n1(HB.med)}x` }, { v: MULT.base, text: `Our target: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices (every 5th, house forwardMedian); actual EPS to FY26, GAM FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Share price today'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'From multiple to target', head: ['', 'Base', 'Note'], wide: [2], rows: [
      ['Sep-28E EPS (₹)', n1(epsSep), `Half FY28E (₹${n1(epsU[1])}) + half FY29E (₹${n1(epsU[2])})`],
      ['× target multiple', `${MULT.base}x`, `Own median ${n1(HB.med)}x × ${k}`],
      ['= Value per share (₹)', n0(MULT.base * epsSep), ''],
      { hl: true, cells: ['**12-month target (rounded)**', '**{{dcf.tp|inr}}**', `vs CMP ₹${n0(price)}: {{dcf.upside|chg}}`] },
    ], source: 'GAM Research (checked in AJANTPHARM.ctx.js)' } },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Trailing EBITDA at the target date ₹${n0(ebitdaT27)} cr; net cash Sep-27E ₹${n0(treasT27)} cr`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF, 11.3%, g 5.5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA: Ajanta's median trailing EV/EBITDA since Apr-2021 is ${n1(HEV.med)}x (Screener); times the EV/EBITDA analogue of the sector factor (+${SECTOR_EV}%) that is ${EVM.base}x, worth ₹${n0(mv('ev').value)} on trailing EBITDA at the target date, ${pc(mv('ev').vsTarget)} vs the target: a trailing multiple on EBITDA a year out gives more credit for growth than a forward P/E does, and EBITDA is before the rising tax rate. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below: at an 11.3% cost of capital and 5.5% terminal growth, with ₹36 of working capital tied up for every ₹100 of extra sales, today's free cash flow (FCF yield ~2%) does not support even our target. Both cross-checks bracket the target; neither supports the current price by much.` },
    { exhibit: { type: 'table', title: 'Sensitivity: other ways to value it (not used in the base)', head: ['Alternative', 'Multiple', 'Applied to', 'Value (₹)', 'vs base'], wide: [0], rows: [
      ['Screener EPS before "exceptional items" (FY26 ex hedge loss)', `${SENS.exc}x`, `Sep-28E ₹${n1(epsSep)}`, n0(val(SENS.exc)), vs(val(SENS.exc))],
      ['Every weekly close instead of every fifth', `${SENS.weekly}x`, `₹${n1(epsSep)}`, n0(val(SENS.weekly)), vs(val(SENS.weekly))],
      ['History on actual EPS only (forward windows to Mar-2025)', `${SENS.pre26}x`, `₹${n1(epsSep)}`, n0(val(SENS.pre26)), vs(val(SENS.pre26))],
      ['No sector factor (own median only)', `${SENS.noFactor}x`, `₹${n1(epsSep)}`, n0(val(SENS.noFactor)), vs(val(SENS.noFactor))],
      [`Ajanta's own move instead of the sector's (${pc1(derate.AJANTPHARM)})`, `${SENS.own}x`, `₹${n1(epsSep)}`, n0(val(SENS.own)), vs(val(SENS.own))],
      [`Midpoint of sector (+${SECTOR}%) and own (${pc1(derate.AJANTPHARM)}) moves`, `${SENS.mid}x`, `₹${n1(epsSep)}`, n0(val(SENS.mid)), vs(val(SENS.mid))],
      [`Large-cap sub-set factor (${LARGE.map(shortName).join(', ')}: ${pc1(sectorLarge)})`, `${SENS.large}x`, `₹${n1(epsSep)}`, n0(val(SENS.large)), vs(val(SENS.large))],
      [`India-branded sub-set (${BRANDED.map(shortName).join(', ')}: ${pc1(sectorBranded)})`, `${SENS.branded}x`, `₹${n1(epsSep)}`, n0(val(SENS.branded)), vs(val(SENS.branded))],
      ['Street multiples on our EPS: MOSL 32x Sep-28E / PL and ICICI Direct 32x FY28E / BOBCAPS 30x Jun-28E / ICICI Sec 28x FY28E', '32x / 32x / 30x / 28x', `₹${n1(epsSep)} / ₹${n1(epsU[1])} / ₹${n1(jun28)} / ₹${n1(epsU[1])}`, `${r10(atOurs.mosl)} / ${r10(atOurs.pl)} / ${r10(atOurs.bob)} / ${r10(atOurs.isec)}`, vs(atOurs.mosl)],
      ['Our multiple on Bloomberg consensus EPS (FY28E ₹111.2; FY29E at our growth)', `${MULT.base}x`, `₹${n1((111.2 + 111.2 * epsU[2] / epsU[1]) / 2)}`, r10(MULT.base * (111.2 + 111.2 * epsU[2] / epsU[1]) / 2), vs(MULT.base * (111.2 + 111.2 * epsU[2] / epsU[1]) / 2)],
      ['EV/EBITDA with the P/E factor instead of the EV analogue', `${EVM_PE}x`, `Trailing EBITDA ₹${n0(ebitdaT27)} cr`, r10(evPe), vs(evPe)],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +2.5pp a year, margin +1pp; ${MULT.bull}x (75th percentile × sector factor) on Sep-28E EPS of ₹${n1(EPSC.bull)}.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; tax 26%; ${MULT.base}x Sep-28E EPS of ₹${n1(epsSep)}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −3pp a year, margin −1.5pp; ${MULT.bear}x (25th percentile × sector factor) on ₹${n1(EPSC.bear)}.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Plus: net cash at Mar-27 (engine, after leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Ke 11.3% (rf 6.5%, beta 0.8, ERP 6%); terminal growth 5.5%; revenue growth fades to 7% and margin holds at 28% by FY42; capex 4.5% of sales; working capital 36% of incremental sales; tax 26%.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: `Listed pharma peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'AJANTPHARM' ? '**Ajanta Pharma**' : shortName(p.symbol) + (CONTEXT.includes(p.symbol) ? ' (context; not in the factor set)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), derate[p.symbol] != null ? pc1(derate[p.symbol]) : '–', n1(p.evEbitda), p.roe + '%']), source: `Screener.in, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js). EBITDA margin on Screener's basis.` } },
  ],
};

module.exports = { valuation };
