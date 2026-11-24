// Alkem Laboratories report, part 5b: valuation. P/E primary (the street's method) on Sep-28E EPS to shareholders, with the
// multiple from Alkem's own one-year-forward P/E since Apr-2021 (EPS before exceptional items) x the pharma factor (+10.25%,
// PLAYBOOK §7c A20); EV/EBITDA (EV analogue factor) and DCF cross-checks.
const X = require('./ALKEM.ctx');
const { D, F, V, SC, n0, n1, pc, pc1, ASOF_TXT, price, mv, MULT, ENGINE, EPSC, tpOwn, SENS, val, epsSep, ownersSep, ownersEps, minPs, MIN, HB, HR, FWDFY, sBase, FM, byBase, epsRep, EXC_AT, SHR, troughBase, fyOf, pctl,
  PEERS, P, MED5, MED5EV, derate, derateEv, PEER_SET, EXCL, sectorCalc, sectorEv, SECTOR, k, kev, LARGE, sectorLarge, shortName, half, HEV, EVM, EVM_PE, ebitdaT27, treasT27, evTtm, evFy28,
  peFy27, peFy28, peSep28, peTtm, rating, mosl, bob, choice, atOurs, jun28, SHARES, epsCagr, ebitdaCagr, salesCagr, ex26, FY26 } = X;
const r10 = v => n0(Math.round(v / 10) * 10);
const vs = v => pc(v / V.tp * 100 - 100);
const sortDesc = (arr, by) => [...arr].sort((a, c) => by[c] - by[a]);
const exFy23 = pctl(sBase.filter(([d]) => fyOf(d) !== 2023).map(x => x[1]), 0.5), multExFy23 = half(exFy23 * k);
const evPe = (EVM_PE * ebitdaT27 + treasT27) / SHARES;
const enzVal = FY26 && X.C.enzene.impliedValue * 0.8899 / SHARES;

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the upside is the sector's re-rating, which Alkem has not shared`,
  blocks: [
    { h: 'How the street values Alkem' },
    { p: `Every note standing on ${ASOF_TXT} that discloses a method for Alkem uses **P/E** except one old one: Motilal Oswal 27x 12-month-forward EPS (15-Aug-2026), Choice 25x FY28E (set May-2026, kept Aug-2026) and BOBCAPS 21x Jun-28E (14-Aug-2026); Nuvama's last public note (Nov-2025) used a sum of the parts. We follow the majority: **P/E on Sep-28E EPS (half FY28E, half FY29E)**, the EPS a buyer will look at one year from now. We use EPS to shareholders (after minorities: ₹${MIN.join(' / ')} cr in FY27-29E, which the engine cannot separate) and forecast no exceptional items. EV/EBITDA and a DCF are cross-checks only.` },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { p: `The house rule (PLAYBOOK §4, §7c): Alkem's own one-year-forward P/E (price ÷ next full fiscal year's EPS) from Apr-2021 to ${ASOF_TXT}, every fifth weekly close (${HB.n} points), leaving out trough years (none: forward EPS never fell below half of its prior three-year peak; FY23's ₹${n1(byBase[2023])} was 65% of FY22's ₹${n1(byBase[2022])}); EPS before exceptional items because Alkem booked material exceptional charges in FY23, FY24 and FY26 (A18); then multiplied by the pharma sector factor, the median move of the eight peers' trailing P/E at the ${ASOF_TXT} close against their five-year medians (+${SECTOR}%, set for Alkem in PLAYBOOK §7c A20; our reproduction ${pc1(sectorCalc)}), and rounded to the nearest half-turn. No own de-rating, growth or returns adjustment enters the base; those are sensitivities below.` },
    { exhibit: { type: 'table', title: 'Deriving the target multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Its own history', `Forward P/E since Apr-2021 on EPS before exceptional items: median **${n1(HB.med)}x** (25th-75th percentile ${n1(HB.p25)}-${n1(HB.p75)}x; range ${n1(HB.min)}-${n1(HB.max)}x). By forward year: ${FWDFY.map(f => `${f.fy} ${n1(f.med)}x`).join(', ')}. No trough years${troughBase.length ? ` (excluded: ${troughBase.join(', ')})` : ''}. On reported EPS: ${n1(HR.med)}x; house forwardMedian (engine EPS incl. minorities): ${n1(FM.median)}x`, `Starting point: ${n1(HB.med)}x`],
      ['2. Sector move', `Eight pharma peers' trailing P/E at the ${ASOF_TXT} close vs each one's five-year median (table below): median **+${SECTOR}%** (our reproduction ${pc1(sectorCalc)}). The sector is re-rated, so the factor lifts the multiple`, `${n1(HB.med)}x × ${k} = ${n1(HB.med * k)}x → **${MULT.base}x**`],
      ['3. Growth', `EPS to shareholders ${Math.round(epsCagr)}% a year FY26-29E from FY26's ₹${n1(ex26)} before exceptional items (FY27E falls on tax); EBITDA ~${Math.round(ebitdaCagr)}% a year; revenue ~${Math.round(salesCagr)}%`, 'No premium or discount (sensitivity below)'],
      ['4. Peers', `Trailing P/E on ${ASOF_TXT}: Sun ${n1(P.SUNPHARMA.pe)}x, Cipla ${n1(P.CIPLA.pe)}x, Ipca ${n1(P.IPCALAB.pe)}x, Abbott ${n1(P.ABBOTINDIA.pe)}x, Zydus ${n1(P.ZYDUSLIFE.pe)}x, Aurobindo ${n1(P.AUROPHARMA.pe)}x; Alkem ${n1(P.ALKEM.pe)}x`, `${MULT.base}x Sep-28E ≈ ${n1(MULT.base * ownersSep / ownersEps[0])}x FY27E: Ipca/Sun territory`],
      ['5. Returns', 'ROE 17.8% in FY26 (tax-holiday aided), {{F.roe.0|pct}} / {{F.roe.2|pct}} in FY27E / FY29E vs an 11.3% cost of equity', 'No premium: returns fall with the tax reset'],
      ['6. Street basis', `MOSL 27x, Choice 25x, BOBCAPS 21x one year forward from today; Alkem's own reported median is ${n1(HR.med)}x`, 'We are above the P/E houses on multiple and year'],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; GAM estimates; peers' Screener files (asof-peers.js)` } },
    { exhibit: { type: 'table', title: `Pharma sector factor: trailing P/E at the ${ASOF_TXT} close vs five-year median (and the EV/EBITDA analogue)`, head: ['Company', 'P/E (x)', '5-yr median (x)', 'vs median', 'EV/EBITDA (x)', '5-yr median (x)', 'vs median'], rows: [
      ...sortDesc(PEER_SET, derate).map(s => [shortName(s), n1(P[s].pe), n1(MED5[s]), pc1(derate[s]), n1(P[s].evEbitda), n1(MED5EV[s]), pc1(derateEv[s])]),
      { hl: true, cells: ['**Median of the eight (P/E set at +10.25%)**', '', '', `**${pc1(sectorCalc)}**`, '', '', `**${pc1(sectorEv)}**`] },
      ['Alkem (excluded from its own factor)', n1(P.ALKEM.pe), n1(MED5.ALKEM), pc1(derate.ALKEM), n1(P.ALKEM.evEbitda), n1(MED5EV.ALKEM), pc1(derateEv.ALKEM)],
      ...EXCL.map(s => [shortName(s), '', '', '', '', '', `Excluded: ${D.peers.excluded[s]}`]),
    ], source: `Screener.in "Price to Earning" and "EV Multiple" series from 30-Sep-2021 to ${ASOF_TXT}, scaled to the NSE close (asof-peers.js); peer set per PLAYBOOK §7c. Our reproduction matches the batch figure (+10.25%).` } },
    { exhibit: { type: 'table', title: 'EPS bases used for history and forecasts (₹)', head: ['', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Reported EPS (Screener; FY27-29E model, incl. minorities)', ...[2023, 2024, 2025, 2026].map(y => n1(epsRep[y])), ...X.epsU.map(n1)],
      ['Less exceptional items after tax / minorities (forecasts)', ...[2023, 2024, 2025, 2026].map(y => `${EXC_AT[y] <= 0 ? '+' : '−'}${n1(Math.abs(EXC_AT[y] / SHR[y]))}`), ...minPs.map(v => `−${n1(v)}`)],
      { hl: true, cells: ['**EPS on our basis**', ...[2023, 2024, 2025, 2026, 2027, 2028, 2029].map(y => `**${n1(byBase[y])}**`)] },
    ], source: 'Screener.in (EPS; exceptional items after tax); GAM' } },
    { pair: [
      { type: 'line', title: `Forward P/E since Apr-2021: our ${MULT.base}x vs a ${n1(HB.med)}x median`, unit: 'Price ÷ next full-year EPS before exceptional items (x)', x: sBase.map(x => x[0]), series: [{ name: 'Forward P/E', values: sBase.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HB.med, text: `Median: ${n1(HB.med)}x` }, { v: MULT.base, text: `Our target: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices (every 5th); actual EPS FY23-26, GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Share price today'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'From multiple to target', head: ['', 'Base', 'Note'], wide: [2], rows: [
      ['Sep-28E EPS to shareholders (₹)', n1(ownersSep), `Half FY28E (₹${n1(ownersEps[1])}) + half FY29E (₹${n1(ownersEps[2])})`],
      ['× target multiple', `${MULT.base}x`, `Own median ${n1(HB.med)}x × ${k}`],
      ['= Value per share (₹)', n0(MULT.base * ownersSep), ''],
      ['Same value in the engine: engine Sep-28E EPS × equivalent multiple', `₹${n1(epsSep)} × ${ENGINE.base}x`, `${MULT.base} × ${n1(ownersSep)} ÷ ${n1(epsSep)}; the engine's EPS includes minorities; the Excel model carries this multiple`],
      { hl: true, cells: ['**12-month target (rounded)**', '**{{dcf.tp|inr}}**', `vs CMP ₹${n0(price)}: {{dcf.upside|chg}}`] },
    ], source: 'GAM Research (checked in ALKEM.ctx.js)' } },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS to shareholders ₹${n1(ownersSep)} (engine ₹${n1(epsSep)})`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Trailing EBITDA at the target date ₹${n0(ebitdaT27)} cr; net cash Sep-27E ₹${n0(treasT27)} cr`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF, 11.3%, g 5.5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA: Alkem's median trailing EV/EBITDA since Apr-2021 is ${n1(HEV.med)}x (Screener); times the EV/EBITDA analogue of the sector factor (${pc1(sectorEv)}, same eight peers) that is ${EVM.base}x, worth ₹${n0(mv('ev').value)} on trailing EBITDA at the target date, ${pc(mv('ev').vsTarget)} vs the target. It is higher because Alkem's EV/EBITDA has de-rated more than its P/E (${pc1(derateEv.ALKEM)} vs ${pc1(derate.ALKEM)}): other income and the tax holiday made P/E look cheaper than the operating business, and Screener's EV ignores ~₹3,500 cr of deposits held in other assets, which flatters the history. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below: at an 11.3% cost of capital, 5.5% terminal growth and a ~30% tax rate, today's free cash flow (FCF yield ~3%) does not support the price, as for most of the sector. Both market methods point above today's price; the DCF says the multiple, not the cash flow, carries the target.` },
    { exhibit: { type: 'table', title: 'Sensitivity: other ways to value it (not used in the base)', head: ['Alternative', 'Multiple', 'Applied to', 'Value (₹)', 'vs base'], wide: [0], rows: [
      ['Reported EPS throughout (A18 sensitivity row)', `${SENS.reported}x`, `Sep-28E ₹${n1(ownersSep)}`, n0(val(SENS.reported)), vs(val(SENS.reported))],
      ['House forwardMedian (engine EPS incl. minorities)', `${SENS.house}x`, `₹${n1(ownersSep)}`, n0(val(SENS.house)), vs(val(SENS.house))],
      ['Leave out the FY23 forward window (depressed EPS; not a trough under the rule)', `${multExFy23}x`, `₹${n1(ownersSep)}`, n0(val(multExFy23)), vs(val(multExFy23))],
      ['No sector factor (own median only)', `${SENS.noFactor}x`, `₹${n1(ownersSep)}`, n0(val(SENS.noFactor)), vs(val(SENS.noFactor))],
      [`Alkem's own move instead of the sector's (${pc1(derate.ALKEM)})`, `${SENS.own}x`, `₹${n1(ownersSep)}`, n0(val(SENS.own)), vs(val(SENS.own))],
      [`Midpoint of sector (+${SECTOR}%) and own (${pc1(derate.ALKEM)}) moves`, `${SENS.mid}x`, `₹${n1(ownersSep)}`, n0(val(SENS.mid)), vs(val(SENS.mid))],
      [`Large-cap sub-set factor (${LARGE.map(shortName).join(', ')}: ${pc1(sectorLarge)})`, `${SENS.large}x`, `₹${n1(ownersSep)}`, n0(val(SENS.large)), vs(val(SENS.large))],
      ['Street: MOSL 27x / Choice 25x / BOBCAPS 21x on our EPS', '27x / 25x / 21x', `Sep-28E ₹${n1(ownersSep)} / FY28E ₹${n1(ownersEps[1])} / Jun-28E ₹${n1(jun28)}`, `${r10(atOurs.mosl)} / ${r10(atOurs.choice)} / ${r10(atOurs.bob)}`, vs(atOurs.mosl)],
      ['EV/EBITDA with the P/E factor instead of the EV analogue', `${EVM_PE}x`, `Trailing EBITDA ₹${n0(ebitdaT27)} cr`, r10(evPe), vs(evPe)],
      ['Unmodelled: MAT credit (cash value, undiscounted) / Alkem\'s share of Enzene at the Feb-2026 round', '–', `₹${n0(FY26.matCredit)} cr / ₹${n0(X.C.enzene.impliedValue * 0.8899)} cr`, `+${n0(FY26.matCredit / SHARES)} / ${n0(enzVal)} a share`, 'Context only'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +2pp a year, margin +1pp; ${MULT.bull}x (75th percentile × sector factor) on Sep-28E EPS of ₹${n1(EPSC.bull.own)}.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; tax 31% → 29%; ${MULT.base}x Sep-28E EPS of ₹${n1(ownersSep)}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −2.5pp a year, margin −1.5pp; ${MULT.bear}x (25th percentile × sector factor) on ₹${n1(EPSC.bear.own)}.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Plus: net cash at Mar-27 (engine, after leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Ke 11.3% (rf 6.5%, beta 0.8, ERP 6%); terminal growth 5.5%; margin fades to 21.5%; tax 29%. Minorities (~2% of profit) and the MAT credit are not in the DCF.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: `Listed pharma peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'ALKEM' ? '**Alkem**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc1(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js). Alkem's ROE uses Screener's net profit before minorities.` } },
  ],
};

module.exports = { valuation };
