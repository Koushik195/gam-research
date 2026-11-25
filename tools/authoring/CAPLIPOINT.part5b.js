// Caplin Point report, part 5b: valuation. P/E primary (the only broker that discloses a method uses it; the house method for
// thinly covered pharma) on Sep-28E EPS; the multiple = Caplin's own one-year-forward P/E median since Apr-2021 (house
// forwardMedian, reported EPS) x the pharma factor for names outside the nine-peer set (+8.2%, PLAYBOOK §7c A21);
// EV/EBITDA (+7.5% analogue) and DCF cross-checks.
const X = require('./CAPLIPOINT.ctx');
const { D, F, V, SC, n0, n1, pc, pc1, ASOF_TXT, price, mv, MULT, EPSC, SENS, val, valCcps, epsSep, epsU, HB, HX, HW, H24, W24, sector24, FWDFY, sBase, epsRep, epsExc, troughRows, troughYrs, pre26,
  PEERS, P, MED5, MED5EV, derate, derateEv, PEER_SET, EXCL, CONTEXT, sectorCalc, sectorEvCalc, SECTOR, SECTOR_EV, k, kev, shortName, HEV, EVM, EVM_PE, ebitdaT27, treasT27,
  peFy27, peFy28, peTtm, SHARES, epsCagr, ebitdaCagr, salesCagr, atOurs, CC, ccpsEps, ccpsEpsSep, CSL_PAT_MARGIN, icici, A, b } = X;
const r10 = v => n0(Math.round(v / 10) * 10);
const vs = v => pc(v / V.tp * 100 - 100);
const sortDesc = (arr, by) => [...arr].sort((a, c) => by[c] - by[a]);
const evPe = (EVM_PE * ebitdaT27 + treasT27) / SHARES;
const oiQ1 = (X.Q1.otherIncome * 4 - F.otherIncome[1]) * (1 - X.AS.taxBuild.taxOnPbt[1] / 100) / SHARES; // FY28E EPS if other income ran at Q1FY27 x4

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the stock trades at ${n1(peFy28)}x our FY28E EPS, far above its ${n1(HB.med)}x history`,
  blocks: [
    { h: 'How the street values Caplin' },
    { p: `The only broker note standing on ${ASOF_TXT} that discloses a method, ICICI Securities (13-Aug-2026), values Caplin on **P/E**: 26x FY28E EPS. ICICI used EV/EBITDA until Feb-2026 and switched in August. With one broker, "the majority" is that broker; P/E is also the house method for thinly covered pharma names (the WOCKPHARMA / FORCEMOT precedent). We value Caplin on **P/E on Sep-28E EPS (half FY28E, half FY29E)**. The model's EPS is EPS to shareholders (minorities in the tax line) and the company reports no exceptional items, so it is the right base. EV/EBITDA and a DCF are cross-checks only.` },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { p: `The house rule (PLAYBOOK §4, §7c): Caplin's own one-year-forward P/E (price ÷ next full fiscal year's EPS) from Apr-2021 to ${ASOF_TXT}, every fifth weekly close (${HB.n} points; house forwardMedian), leaving out trough years (none: EPS rose every year; each year's EPS was at least ${Math.round(Math.min(...troughRows.map(t => t.eps / t.peak)) * 100)}% of the prior three-year peak, against the 50% test); multiplied by the pharma sector factor for names outside the nine-peer set (the median move of all nine peers' trailing P/E at the ${ASOF_TXT} close against their five-year medians: +${SECTOR}%, PLAYBOOK §7c A21; our reproduction ${pc1(sectorCalc)}); rounded to the nearest half-turn. **The turnaround rule does not apply:** earnings did not break upward (no loss or near-zero years); what changed was the multiple, from ~10-15x in 2021-23 to 20-30x since 2024. That re-rating is precisely what the rule asks us not to assume will persist; the post-Apr-2024 window is shown as a sensitivity. **Exceptional items:** the company reports none; Screener tags ~₹15 cr of FY26 other income (mostly realised investment gains) as exceptional, which changes nothing (${SENS.exc}x).` },
    { exhibit: { type: 'table', title: 'Deriving the target multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Its own history', `Forward P/E since Apr-2021 on reported EPS: median **${n1(HB.med)}x** (25th-75th percentile ${n1(HB.p25)}-${n1(HB.p75)}x; range ${n1(HB.min)}-${n1(HB.max)}x). By forward year: ${FWDFY.map(f => `${f.fy} ${n1(f.med)}x`).join(', ')}. No trough years${troughYrs.length ? ` (excluded: ${troughYrs.join(', ')})` : ''}. Every weekly close: ${n1(HW.med)}x; windows on actual EPS only (to Mar-2025): ${n1(pre26.med)}x; since Apr-2024: ${n1(H24.med)}x`, `Starting point: ${n1(HB.med)}x`],
      ['2. Sector move', `Nine pharma peers' trailing P/E at the ${ASOF_TXT} close vs each one's five-year median (table below): median **+${SECTOR}%** (our reproduction ${pc1(sectorCalc)}). Pharma trades above its medians, so the factor lifts the multiple`, `${n1(HB.med)}x × ${k} = ${n1(HB.med * k)}x → **${MULT.base}x**`],
      ['3. Growth', `EPS ${Math.round(epsCagr)}% a year FY26-29E on our numbers (${Math.round(X.epsCagrHist)}% FY21-26); revenue ~${Math.round(salesCagr)}%, EBITDA ~${Math.round(ebitdaCagr)}%`, 'No premium or discount (sensitivity below)'],
      ['4. Peers', `Trailing P/E on ${ASOF_TXT}: Ajanta ${n1(P.AJANTPHARM.pe)}x, Gland ${n1(P.GLAND.pe)}x, Ipca ${n1(P.IPCALAB.pe)}x, Alkem ${n1(P.ALKEM.pe)}x, Natco ${n1(P.NATCOPHARM.pe)}x, Marksans ${n1(P.MARKSANS.pe)}x; Caplin ${n1(P.CAPLIPOINT.pe)}x (${pc1(derate.CAPLIPOINT)} vs its own five-year median)`, `${MULT.base}x Sep-28E ≈ ${n1(MULT.base * epsSep / epsU[0])}x FY27E: below most branded peers, above Natco and Marksans`],
      ['5. Returns', 'ROE 18% and ROCE 24% in FY26 (Screener), diluted by ₹1,480 cr of cash; core ROCE far higher; vs a 12.5% cost of equity', 'Supports a premium to the market, already in its own history'],
      ['6. Street basis', 'ICICI Securities 26x FY28E (₹2,840)', `Our multiple is lower; on our FY28E EPS 26x = ₹${n0(atOurs.icici)}`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; GAM estimates (FY27-28E EPS in the forward history); peers' Screener files (asof-peers.js)` } },
    { exhibit: { type: 'table', title: `Pharma sector factor: trailing P/E at the ${ASOF_TXT} close vs five-year median (and the EV/EBITDA analogue)`, head: ['Company', 'P/E (x)', '5-yr median (x)', 'vs median', 'EV/EBITDA (x)', '5-yr median (x)', 'vs median'], rows: [
      ...sortDesc(PEER_SET, derate).map(s => [shortName(s), n1(P[s].pe), n1(MED5[s]), pc1(derate[s]), n1(P[s].evEbitda), n1(MED5EV[s]), pc1(derateEv[s])]),
      { hl: true, cells: ['**Median of the nine (set: P/E +8.2%, EV/EBITDA +7.5%)**', '', '', `**${pc1(sectorCalc)}**`, '', '', `**${pc1(sectorEvCalc)}**`] },
      ['Caplin Point (outside the set; not in its own factor)', n1(P.CAPLIPOINT.pe), n1(MED5.CAPLIPOINT), pc1(derate.CAPLIPOINT), n1(P.CAPLIPOINT.evEbitda), n1(MED5EV.CAPLIPOINT), pc1(derateEv.CAPLIPOINT)],
      ...EXCL.map(s => [shortName(s), '', '', '', '', '', `Excluded: ${D.peers.excluded[s]}`]),
    ], source: `Screener.in "Price to Earning" and "EV Multiple" series from 30-Sep-2021 to ${ASOF_TXT}, scaled to the NSE close (asof-peers.js); peer set and factors per PLAYBOOK §7c (A21); reproduced with tools/authoring/sector-factor.js (P/E +8.20%, EV/EBITDA +7.50%).` } },
    { exhibit: { type: 'table', title: 'EPS bases (₹)', head: ['', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { hl: true, cells: ['**Reported EPS to shareholders (base; FY27-29E model)**', ...[2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029].map(y => `**${n1(epsRep[y])}**`)] },
      ['Screener EPS before "exceptional items" (sensitivity)', ...[2022, 2023, 2024, 2025, 2026].map(y => n1(epsExc[y])), ...epsU.map(n1)],
      [`After the CCPS holders' minimum ${CC.minStakePct}% of Caplin Steriles (sensitivity)`, '–', '–', '–', '–', n1(epsRep[2026] - X.ccpsEps26), ...epsU.map((e, i) => n1(e - ccpsEps[i]))],
    ], source: `Screener.in; AR FY26 (CSL PAT ₹${X.FY26.lines.cslPat} cr); AR FY19 note 13; GAM (CSL PAT at ${CSL_PAT_MARGIN}% of USA revenue in FY27-29E)` } },
    { pair: [
      { type: 'line', title: `Forward P/E since Apr-2021: our ${MULT.base}x vs a ${n1(HB.med)}x median`, unit: 'Price ÷ next full-year EPS (x)', x: sBase.map(x => x[0]), series: [{ name: 'Forward P/E', values: sBase.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HB.med, text: `Median: ${n1(HB.med)}x` }, { v: MULT.base, text: `Our target: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices (every 5th, house forwardMedian); actual EPS to FY26, GAM FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'ICICI Securities', 'Share price today'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), icici.tp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research; ICICI Securities' },
    ] },
    { exhibit: { type: 'table', title: 'From multiple to target', head: ['', 'Base', 'Note'], wide: [2], rows: [
      ['Sep-28E EPS (₹)', n1(epsSep), `Half FY28E (₹${n1(epsU[1])}) + half FY29E (₹${n1(epsU[2])})`],
      ['× target multiple', `${MULT.base}x`, `Own median ${n1(HB.med)}x × ${k}`],
      ['= Value per share (₹)', n0(MULT.base * epsSep), ''],
      { hl: true, cells: ['**12-month target (rounded)**', '**{{dcf.tp|inr}}**', `vs CMP ₹${n0(price)}: {{dcf.upside|chg}}`] },
    ], source: 'GAM Research (checked in CAPLIPOINT.ctx.js)' } },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Trailing EBITDA at the target date ₹${n0(ebitdaT27)} cr; net cash Sep-27E ₹${n0(treasT27)} cr (after the CCPS)`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF, 12.5%, g 5.5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA: Caplin's median trailing EV/EBITDA since Apr-2021 is ${n1(HEV.med)}x (Screener); times the EV analogue of the sector factor (+${SECTOR_EV}%) that is ${EVM.base}x, worth ₹${n0(mv('ev').value)} on trailing EBITDA at the target date plus net cash, ${pc(mv('ev').vsTarget)} vs the target (EBITDA ignores the rising depreciation and the cash is added at par). The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below: at a 12.5% cost of capital and 5.5% terminal growth, with ~59 paise of working capital tied up for every extra rupee of sales and ₹250-320 cr of capex a year, free cash flow is modest. Neither supports today's price; both bracket our target.` },
    { exhibit: { type: 'table', title: 'Sensitivity: other ways to value it (not used in the base)', head: ['Alternative', 'Multiple', 'Applied to', 'Value (₹)', 'vs base'], wide: [0], rows: [
      ['Screener EPS before "exceptional items"', `${SENS.exc}x`, `Sep-28E ₹${n1(epsSep)}`, n0(val(SENS.exc)), vs(val(SENS.exc))],
      ['Every weekly close instead of every fifth', `${SENS.weekly}x`, `₹${n1(epsSep)}`, n0(val(SENS.weekly)), vs(val(SENS.weekly))],
      ['History on actual EPS only (forward windows to Mar-2025)', `${SENS.pre26}x`, `₹${n1(epsSep)}`, n0(val(SENS.pre26)), vs(val(SENS.pre26))],
      ['No sector factor (own median only)', `${SENS.noFactor}x`, `₹${n1(epsSep)}`, n0(val(SENS.noFactor)), vs(val(SENS.noFactor))],
      [`Post-re-rating window: own median since Apr-2024 (${n1(H24.med)}x) × peers' move vs their medians over the same window (${pc1(sector24)})`, `${SENS.w24}x`, `₹${n1(epsSep)}`, n0(val(SENS.w24)), vs(val(SENS.w24))],
      [`Caplin's own five-year move instead of the sector's (${pc1(derate.CAPLIPOINT)})`, `${SENS.own}x`, `₹${n1(epsSep)}`, n0(val(SENS.own)), vs(val(SENS.own))],
      [`Midpoint of sector (+${SECTOR}%) and own (${pc1(derate.CAPLIPOINT)}) moves`, `${SENS.mid}x`, `₹${n1(epsSep)}`, n0(val(SENS.mid)), vs(val(SENS.mid))],
      [`EPS after the CCPS holders' ${CC.minStakePct}% of Caplin Steriles`, `${MULT.base}x`, `₹${n1(epsSep - ccpsEpsSep)}`, n0(valCcps), vs(valCcps)],
      ['ICICI Securities\' 26x on our FY28E EPS', '26x', `FY28E ₹${n1(epsU[1])}`, r10(atOurs.icici), vs(atOurs.icici)],
      ['Other income at the Q1FY27 run-rate (x4, incl. FX) in FY28E', `${MULT.base}x`, `₹${n1(epsSep + oiQ1)}`, r10(MULT.base * (epsSep + oiQ1)), vs(MULT.base * (epsSep + oiQ1))],
      ['EV/EBITDA with the P/E factor instead of the EV analogue', `${EVM_PE}x`, `Trailing EBITDA ₹${n0(ebitdaT27)} cr`, r10(evPe), vs(evPe)],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +2.5pp a year, margin +1pp; ${MULT.bull}x (75th percentile × sector factor) on Sep-28E EPS of ₹${n1(EPSC.bull)}.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; tax 20.5% + minorities; ${MULT.base}x Sep-28E EPS of ₹${n1(epsSep)}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −3pp a year, margin −2pp; ${MULT.bear}x (25th percentile × sector factor) on ₹${n1(EPSC.bear)}.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Plus: net cash at Mar-27 (engine, after the ₹217 cr CCPS at book and leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Ke 12.5% (rf 6.5%, beta 1.0, ERP 6%); terminal growth 5.5%; revenue growth fades to 7% and margin to 33% by FY42; capex 5% of sales; working capital 59% of incremental sales; tax 21.5% incl. minorities.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: `Listed pharma peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.filter(p => !p.missing).map(p => [p.symbol === 'CAPLIPOINT' ? '**Caplin Point**' : shortName(p.symbol) + (CONTEXT.includes(p.symbol) ? ' (context; not in the factor set)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), derate[p.symbol] != null ? pc1(derate[p.symbol]) : '–', n1(p.evEbitda), p.roe + '%']), source: `Screener.in, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js). EBITDA margin on Screener's basis. Caplin's ROE is on Screener's equity (incl. the ₹217 cr CCPS in borrowings).` } },
  ],
};

module.exports = { valuation };
