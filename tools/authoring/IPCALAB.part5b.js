// Ipca Laboratories report, part 5b: valuation. P/E primary (the street's majority method) on consolidated EPS after
// minorities, with the multiple from Ipca's own forward P/E since the Unichem deal on EPS before exceptional items and
// one-offs x the pharma sector factor (+10.25%, set excluding Ipca); EV/EBITDA and DCF cross-checks; Unichem treatment.
const X = require('./IPCALAB.ctx');
const { D, F, V, SC, A, n0, n1, n2, pc, pc1, ASOF_TXT, DEAL_DAY, price, mv, MULT, EPSC, epsSep, epsU, epsBase, epsRep, epsCoBase, BAYSHORE_PS, HB, HR, HC, HPRE, H22, HALL, yearWin, sBase, FM, TROUGH_BASE, TROUGH_REP, troughRow, epsRepAll,
  PEERS, P, MED5, dr5, MED5EV, dr5ev, PEER_SET, EXCL, USED, sectorCalc, sectorAll9, sectorAll, SECTOR, k, sectorEv, kev, shortName, half, HEV, EVM, EVM_PEFACTOR, ebitdaSep, treasSep, evNowFwd, icici18,
  multRep, multCo, mult22, multAll, multHouse, multNoK, multOwnMid, fwdNow, fwdNow27, trailPe, rating, mosl, pl_, choice, hsie, SHARES, UD, uniMcap, stakeMv, stakeNet, uniSepPat, ipcaShareUniSep, exUniEpsSep, sotpVal, uniAtOurMult, uniPe, minMv, epsCagr, ebitdaCagr, TB } = X;
const r10 = v => n0(Math.round(v / 10) * 10);
const vs = v => pc(v / V.tp * 100 - 100);
const peV = (m, e) => Math.round(m * e / 10) * 10;
const sortDesc = (arr, by) => [...arr].sort((a, c) => by[c] - by[a]);
const tb = troughRow(epsBase), tr = troughRow(epsRepAll);

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}, ${pc(V.upside)} from ₹${n0(price)}: HOLD`,
  blocks: [
    { h: 'How the street values Ipca' },
    { p: `Of the notes standing on ${ASOF_TXT} that disclose a method, six value Ipca on **P/E** (Motilal Oswal 30x 12-month-forward EPS, Prabhudas Lilladher 30x FY28E, Choice 25x FY28E, HDFC Securities 28x Q3FY28E, Sharekhan 45x FY28E, and Emkay on Sep-28E EPS with Unichem at a separate multiple) and one on **EV/EBITDA** (ICICI Direct 18x FY28E). We follow the majority: **P/E on Sep-28E EPS (half FY28E, half FY29E)**, the EPS a buyer will look at one year from now. Like the street we value **consolidated EPS after minorities**, so Unichem enters through Ipca's 52.67% share of its profit and is not counted again as a listed stake; a sum-of-the-parts with the stake at market less 20% is shown as a sensitivity. EV/EBITDA (ICICI Direct's method) and a DCF are cross-checks.` },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { p: `The house rule (PLAYBOOK §4) starts from the stock's own one-year-forward P/E since Apr-2021, leaving out trough years. Two things make Ipca's history need care. **(1) Exceptional items** were large in FY24-26 (−₹108 / −205 / −86 cr) and FY26 also carried a ₹60 cr one-off gain on deconsolidating Bayshore; as in our Sun Pharma, Cipla and Torrent reports, the base uses **EPS before exceptional items and one-offs** (forecasts carry none) and the reported-EPS median is a sensitivity. **(2) Unichem.** From FY24 every EPS figure includes Unichem (and the deal's financing), while share prices before the deal (24-Apr-2023) priced Ipca without it. To keep history and forecasts on one basis, the base window starts on **${DEAL_DAY}**, the first trading day after the deal: every point then divides a price that includes Unichem by EPS that includes Unichem. We use every weekly close plus the ${ASOF_TXT} close (${HB.n} points), multiply the median by the pharma sector factor (+${SECTOR}%, the median of the other eight peers, PLAYBOOK §7c A20) and round to the nearest half-turn. No own de-rating, growth or returns adjustment enters the base.` },
    { exhibit: { type: 'table', title: 'The trough rule, checked on both EPS bases', head: ['Forward year', 'EPS (₹)', 'Highest of previous three years (₹)', 'Half of it (₹)', 'Trough?', 'Dates affected'], wide: [5], rows: [
      ['FY23, reported', n2(tr[0].eps), n2(tr[0].peak), n2(tr[0].half), '**Yes**', 'Apr-2021 to Mar-2022'],
      ['FY24, reported', n2(tr[1].eps), n2(tr[1].peak), n2(tr[1].half), '**Yes** (by ₹0.90)', 'Apr-2022 to Mar-2023'],
      ['FY23, before exceptional items', n2(tb[0].eps), n2(tb[0].peak), n2(tb[0].half), '**Yes**', 'Apr-2021 to Mar-2022'],
      ['FY24, before exceptional items', n2(tb[1].eps), n2(tb[1].peak), n2(tb[1].half), '**No**', 'Apr-2022 to Mar-2023 would come back in'],
      ['FY25-FY28E (both bases)', '29.1-68.0', '', '', 'No', ''],
    ], source: 'Screener.in EPS; AR FY24 and FY26 note 34; GAM. FY21 (₹44.9) was the COVID hydroxychloroquine peak.' } },
    { p: `**The judgment call.** On reported EPS the rule removes FY23 and FY24, so the house function's window already starts in Apr-2023 (median ${n1(FM.median)}x every fifth week, ${n1(HR.med)}x on all weeks since the deal). On EPS before exceptional items, FY24 (₹25.82) clears the half-peak test (₹${n1(tb[1].half)}), so the year before the deal would re-enter, with a median of ${n1(HPRE.med)}x: pre-deal prices divided by an FY24 EPS that already contained eight months of Unichem, its acquisition interest and a recovery the market could only guess at. We leave those dates out for consistency across the Unichem consolidation, not because of the trough rule, and show the alternative (${mult22}x, ₹${r10(mult22 * epsSep)}, a BUY) as a sensitivity. It is the most important judgment in this report.` },
    { exhibit: { type: 'table', title: 'Deriving the target multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Its own history', `Forward P/E since ${DEAL_DAY} on EPS before exceptional items and one-offs: median **${n1(HB.med)}x** (25th-75th percentile ${n1(HB.p25)}-${n1(HB.p75)}x; range ${n1(HB.min)}-${n1(HB.max)}x). By year of forward EPS: ${yearWin.map(w => `${w.fy} ${n1(w.med)}x`).join(', ')}. Trough years: ${TROUGH_BASE.join(', ')} on this basis (outside the window); ${TROUGH_REP.join(', ')} on reported EPS. Reported-EPS median ${n1(HR.med)}x; house forwardMedian ${n1(FM.median)}x`, `Starting point: ${n1(HB.med)}x`],
      ['2. Sector move', `Eight pharma peers' trailing P/E at the ${ASOF_TXT} close vs their five-year medians (table below): median **+${SECTOR}%** (PLAYBOOK §7c A20; our reproduction ${pc1(sectorCalc)}). Pharma trades above its history, so the factor lifts the multiple`, `${n1(HB.med)}x × ${k.toFixed(4)} = ${n1(HB.med * k)}x → **${MULT.base}x**`],
      ['3. Growth', `EPS ${Math.round(epsCagr)}% a year FY26-29E on the same basis (EBITDA ${Math.round(ebitdaCagr)}%); history's median years had 27-36% EPS growth (FY25-26)`, 'No premium; slower growth argues against one (sensitivity below)'],
      ['4. Peers', `Trailing P/E on ${ASOF_TXT}: Sun ${n1(P.SUNPHARMA.pe)}x, Abbott ${n1(P.ABBOTINDIA.pe)}x, Cipla ${n1(P.CIPLA.pe)}x, Alkem ${n1(P.ALKEM.pe)}x, Aurobindo ${n1(P.AUROPHARMA.pe)}x, Zydus ${n1(P.ZYDUSLIFE.pe)}x; Ipca ${n1(P.IPCALAB.pe)}x`, `${MULT.base}x Sep-28E EPS = ${n1(MULT.base * epsSep / epsU[0])}x FY27E EPS, about where Ipca, Sun and Abbott trade on trailing EPS today`],
      ['5. Returns', 'ROE 15.2% in FY26, {{F.roe.0|pct}} / {{F.roe.2|pct}} in FY27E / FY29E vs an 11.6% cost of equity', 'No premium'],
      ['6. Street basis', `MOSL and PL 30x, Choice 25x, HDFC Securities 28x forward EPS`, `Our ${MULT.base}x is in the street's range`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; AR note 34; GAM estimates; peers' Screener files (asof-peers.js)` } },
    { exhibit: { type: 'table', title: `Pharma sector factor: trailing P/E at the ${ASOF_TXT} close vs five-year median`, head: ['Company', 'P/E (x)', '5-yr median (x)', 'vs median', 'EV/EBITDA (x)', '5-yr median (x)', 'vs median'], rows: [
      ...sortDesc(USED, dr5).map(s => [shortName(s), n1(P[s].pe), n1(MED5[s]), pc1(dr5[s]), n1(P[s].evEbitda), n1(MED5EV[s]), pc1(dr5ev[s])]),
      { hl: true, cells: ['**Median of the eight (P/E factor set at +10.25%)**', '', '', `**${pc1(sectorCalc)}**`, '', '', `**${pc1(sectorEv)}**`] },
      ['Ipca (excluded: own stock)', n1(P.IPCALAB.pe), n1(MED5.IPCALAB), pc1(dr5.IPCALAB), n1(P.IPCALAB.evEbitda), n1(MED5EV.IPCALAB), pc1(dr5ev.IPCALAB)],
      ['All nine incl. Ipca (for reference)', '', '', pc1(sectorAll9), '', '', ''],
      ...EXCL.map(s => [shortName(s), n1(P[s].pe), n1(MED5[s]), pc1(dr5[s]), '', '', `Excluded: ${D.peers.excluded[s]}`]),
    ], source: `Screener.in "Price to Earning" and "EV Multiple" series since 30-Sep-2021, scaled to the NSE close on ${ASOF_TXT} (asof-peers.js); peer set per PLAYBOOK §7c. The batch P/E figure (+10.25%) matches our reproduction; the EV/EBITDA analogue (+${n1(sectorEv)}%) is used only for the EV/EBITDA cross-check.` } },
    { exhibit: { type: 'table', title: 'One basis for history and forecasts: EPS before exceptional items and one-offs (₹)', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Reported EPS (Screener; FY27-29E model, after minorities)', n2(epsRep[2024]), n2(epsRep[2025]), n2(epsRep[2026]), ...epsU.map(n2)],
      ['Company EPS before exceptional items (AR note 34)', '25.82', '35.14', '46.94', '–', '–', '–'],
      ['Less one-off gain in other income (Bayshore deconsolidation)', '–', '–', `−${n2(BAYSHORE_PS)}`, '–', '–', '–'],
      { hl: true, cells: ['**EPS on our basis**', `**${n2(epsBase[2024])}**`, `**${n2(epsBase[2025])}**`, `**${n2(epsBase[2026])}**`, ...epsU.map(v => `**${n2(v)}**`)] },
    ], source: 'Screener.in; AR FY24 and FY26 notes 24, 32, 34; GAM. FY24\'s company figure adds back the full ₹107.75 cr of exceptional items (incl. the Unichem EU fine before minorities).' } },
    { pair: [
      { type: 'line', title: `Forward P/E since the Unichem deal: our ${MULT.base}x vs a ${n1(HB.med)}x median`, unit: 'Price ÷ next full-year EPS before exceptional items and one-offs (x)', x: sBase.map(x => x[0]), series: [{ name: 'Forward P/E', values: sBase.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HB.med, text: `Median: ${n1(HB.med)}x` }, { v: MULT.base, text: `Our target: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; actual EPS FY25-26, GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'SOTP (Unichem at market −20%)', 'DCF', 'Share price today'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(sotpVal), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'From multiple to target', head: ['', 'Base', 'Note'], wide: [2], rows: [
      ['Sep-28E EPS to shareholders (₹)', n1(epsSep), `Half FY28E (₹${n1(epsU[1])}) + half FY29E (₹${n1(epsU[2])}); after minorities of ₹${TB.minorities[1]}-${TB.minorities[2]} cr`],
      ['× target multiple', `${MULT.base}x`, `Own median ${n1(HB.med)}x × ${k.toFixed(4)}`],
      ['= Value per share (₹)', n0(MULT.base * epsSep), 'The Excel model carries the same multiple on the same EPS'],
      { hl: true, cells: ['**12-month target (rounded)**', '**{{dcf.tp|inr}}**', `vs CMP ₹${n0(price)}: {{dcf.upside|chg}}`] },
    ], source: 'GAM Research (checked in IPCALAB.ctx.js)' } },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr; net cash Sep-28E ₹${n0(treasSep)} cr (engine)`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF after minorities, 11.6%, g 5.5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA: Ipca's one-year-forward EV/EBITDA since the deal has a median of ${n1(HEV.med)}x (EV as Screener defines it, without the minorities' claim; history and target alike); times the peers' EV/EBITDA move (${pc1(sectorEv)}) that is ${EVM.base}x, worth ₹${n0(mv('ev').value)} on Sep-28E EBITDA, ${pc(mv('ev').vsTarget)} from the target: the two market methods agree (ICICI Direct's 18x FY28E on our numbers gives ₹${r10(icici18)}). The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below: at an 11.6% cost of capital, with capex at 6-7% of revenue and working capital at ~39% of incremental sales, today's free cash flow yield (~2%) does not support the price, as for most of Indian pharma. We use the market method the street uses; the DCF says the multiple, not the cash flow, carries the target.` },
    { h: 'Unichem: counted once' },
    { p: `Unichem is listed and Ipca owns 52.67%. There are two clean ways to value it, and they must not be mixed. **The street's way (our base):** value Ipca's consolidated EPS after minorities, so Ipca's share of Unichem's profit (~₹${n0(ipcaShareUniSep)} cr in Sep-28E, ₹${n1(ipcaShareUniSep / SHARES)} of EPS) is valued at ${MULT.base}x, implicitly ₹${n0(uniAtOurMult)} cr for the stake. **The sum of the parts:** value Ipca without Unichem (EPS ₹${n1(exUniEpsSep)}) at ${MULT.base}x and add the stake at its ${ASOF_TXT} market value less 20% (PLAYBOOK §7c holding discount): ₹${n0(stakeMv)} cr × 0.8 = ₹${n0(stakeNet)} cr (₹${n0(stakeNet / SHARES)} a share). That gives ₹${r10(sotpVal)}, ${vs(sotpVal)} vs our target. The two are close because Unichem is a small part of Ipca's EPS (₹${n1(ipcaShareUniSep / SHARES)} of ₹${n1(epsSep)}). The consolidated method implicitly values the stake at ₹${n0(uniAtOurMult)} cr, above its ₹${n0(stakeMv)} cr market value (Unichem trades at ~${n1(uniPe)}x its own trailing earnings, which include a land-sale gain), so the sum of the parts comes out ₹${n0(MULT.base * epsSep - sotpVal)} a share lower. We keep the street's consolidated method; the gap would close if Unichem's margin reaches the mid-teens we assume.` },
    { exhibit: { type: 'table', title: 'Unichem: consolidated vs sum of the parts', head: ['', 'Consolidated (base)', 'Sum of the parts (sensitivity)'], wide: [0], rows: [
      ['Ipca ex-Unichem Sep-28E EPS (₹)', '–', n1(exUniEpsSep)],
      ['Ipca\'s share of Unichem profit, Sep-28E (₹ cr)', n0(ipcaShareUniSep), 'Not in EPS'],
      ['Multiple', `${MULT.base}x consolidated EPS`, `${MULT.base}x ex-Unichem EPS`],
      ['Unichem stake', `In EPS (implied ₹${n0(uniAtOurMult)} cr)`, `₹${n0(stakeMv)} cr at ₹${UD.close30Sep} less 20% = ₹${n0(stakeNet)} cr`],
      { hl: true, cells: ['**Value per share (₹)**', `**${n0(MULT.base * epsSep)}**`, `**${n0(sotpVal)}**`] },
    ], source: `NSE close ${ASOF_TXT} (Unichem ₹${UD.close30Sep}; ${UD.sharesTotalCr} cr shares, Ipca ${UD.stakePct}%); GAM` } },
    { exhibit: { type: 'table', title: 'Sensitivity: other ways to value it (not used in the base)', head: ['Alternative', 'Multiple', 'Applied to', 'Value (₹)', 'vs base'], wide: [0], rows: [
      ['Reported EPS in history (all weeks since the deal)', `${multRep}x`, `Sep-28E EPS ₹${n1(epsSep)}`, r10(multRep * epsSep), vs(multRep * epsSep)],
      ['House forwardMedian on reported EPS (every 5th week, troughs FY23-24 out)', `${multHouse}x`, `₹${n1(epsSep)}`, r10(multHouse * epsSep), vs(multHouse * epsSep)],
      ['Company EPS before exceptional items (FY26 incl. the Bayshore gain)', `${multCo}x`, `₹${n1(epsSep)}`, r10(multCo * epsSep), vs(multCo * epsSep)],
      ['Window from Apr-2022 (trough rule alone on EPS before exceptional items; pre-deal year included)', `${mult22}x`, `₹${n1(epsSep)}`, r10(mult22 * epsSep), vs(mult22 * epsSep)],
      ['Whole window from Apr-2021, no trough exclusion', `${multAll}x`, `₹${n1(epsSep)}`, r10(multAll * epsSep), vs(multAll * epsSep)],
      ['No sector factor (own median only)', `${multNoK}x`, `₹${n1(epsSep)}`, r10(multNoK * epsSep), vs(multNoK * epsSep)],
      [`Midpoint of sector (+${SECTOR}%) and own (${pc1(dr5.IPCALAB)}) moves`, `${multOwnMid}x`, `₹${n1(epsSep)}`, r10(multOwnMid * epsSep), vs(multOwnMid * epsSep)],
      ['Sum of the parts: Unichem stake at market less 20%', `${MULT.base}x ex-Unichem`, `₹${n1(exUniEpsSep)} + ₹${n0(stakeNet / SHARES)}`, r10(sotpVal), vs(sotpVal)],
      ['EV/EBITDA with the P/E factor', `${EVM_PEFACTOR}x`, `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr`, r10((EVM_PEFACTOR * ebitdaSep + treasSep) / SHARES), vs((EVM_PEFACTOR * ebitdaSep + treasSep) / SHARES)],
      ['Street: MOSL / PL 30x, Choice 25x on our EPS', '30x / 25x', `Sep-28E ₹${n1(epsSep)} / FY28E ₹${n1(epsU[1])}`, `${r10(30 * epsSep)} / ${r10(25 * epsU[1])}`, vs(30 * epsSep)],
      ['Street: ICICI Direct 18x FY28E EV/EBITDA on our numbers', '18x', `FY28E EBITDA ₹${n0(F.ebitda[1])} cr`, r10(icici18), vs(icici18)],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +2pp a year, margin +1pp; ${MULT.bull}x (75th percentile × sector factor) on Sep-28E EPS of ₹${n1(EPSC.bull)}.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS of ₹${n1(epsSep)}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −2.5pp a year, margin −1.5pp; ${MULT.bear}x (25th percentile × sector factor) on ₹${n1(EPSC.bear)}.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (engine)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. The tax rate in the cash flows includes the minorities\' share (engine workaround), so the value is after minorities; net cash is not reduced by the NCI again.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: `Listed pharma peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.filter(p => !p.missing).map(p => [p.symbol === 'IPCALAB' ? '**Ipca Labs**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), dr5[p.symbol] != null ? pc1(dr5[p.symbol]) : '–', n1(p.evEbitda), p.roe + '%']), source: `Screener.in, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js). Ipca's ROE is on profit before minorities in Screener's peer calculation; Mankind has no five-year history.` } },
  ],
};

module.exports = { valuation };
