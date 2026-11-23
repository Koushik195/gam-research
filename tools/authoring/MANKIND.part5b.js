// Mankind Pharma report, part 5b: valuation. P/E primary (the street's majority method) on EPS before the BSV amortisation,
// with the multiple from Mankind's own forward P/E since 1-Nov-2023 x the same-window pharma factor (+11.0%); EV/EBITDA
// and DCF cross-checks.
const X = require('./MANKIND.ctx');
const { D, F, V, SC, n0, n1, pc, pc1, rup, ASOF_TXT, price, mv, MULT, ENGINE, EPSC, tpAdj, adjSep, epsSep, ownersSep, adjEps, ownersEps, ppaPs, minPs, HB, HR, HI, HB_pre, HB_mid, HB_post, sBase, FM, byBase, byRep, epsRep, EXC_AT, SHR, amortPs, BSV_DAYS25,
  PEERS, P, MEDW, MED5, drW, dr5, PEER_SET, EXCL, sectorCalc, sector5, SECTOR, k, MEDWEV, drWev, sectorEv, kev, shortName, half, EVH, EVM, EVM_PEFACTOR, EVM_ALL, ebitdaT27, treasT27, evNowFwd, evNowTtm, jm22, multRepSens, multInclSens, multHouse,
  fwdNowAdj, fwdNowRep, trailPe, rating, ST, moslAtOurs, geoAtOurs, shortDate, SHARES, ebitdaCagr, epsCagrAdj } = X;
const r10 = v => n0(Math.round(v / 10) * 10);
const vs = v => pc(v / V.tp * 100 - 100);
const peV = (m, e) => Math.round(m * e / 10) * 10;
const sortDesc = (arr, by) => [...arr].sort((a, c) => by[c] - by[a]);
const multOwnMid = half(HB.med * (1 + (SECTOR + drW.MANKIND) / 2 / 100)), multPost = half(HB_post.med * k), mult5 = half(HB.med * (1 + sector5 / 100)), multNoK = half(HB.med);

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS before the BSV amortisation gives {{dcf.tp|inr}}`,
  blocks: [
    { h: 'How the street values Mankind' },
    { p: `Of the notes standing on ${ASOF_TXT} that disclose a method, three value Mankind on **P/E** (Motilal Oswal 40x 12-month-forward EPS, Geojit 37x FY28E, HDFC Securities 34x Q2FY28E) and one on **EV/EBITDA** (JM Financial 22x Jun-28E). We follow the majority: **P/E on Sep-28E EPS (half FY28E, half FY29E)**, the EPS a buyer will look at one year from now. The deal makes one adjustment necessary. BSV added ~₹450 cr a year of non-cash amortisation (₹${n1(ppaPs)} a share after its deferred-tax credit) from 23-Oct-2024, so reported EPS in Mankind's short history mixes years with none, 160 days and a full year of it, while the market priced the pre-deal months (Nov-2023 to Jul-2024) on standalone earnings. As in our Torrent Pharma report, we put the history and the forecasts on one basis: **EPS before the BSV amortisation and before exceptional items, after minorities**. EV/EBITDA (JM's method, neutral to the amortisation) and a DCF are cross-checks.` },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { p: `Mankind listed on 9-May-2023, so there is no five-year history. Following the batch rule (PLAYBOOK §7c), we use its own one-year-forward P/E **since 1-Nov-2023**, skipping the IPO months, on every weekly close plus the ${ASOF_TXT} close (${HB.n} points): price ÷ the next full fiscal year's EPS, actual FY25-26 and our FY27-28E. We multiply the median by the nine-peer pharma factor measured over the **same window** (+${SECTOR}%) and round to the nearest half-turn. No own de-rating, growth or returns adjustment enters the base; those are sensitivities below.` },
    { exhibit: { type: 'table', title: 'Deriving the target multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Its own history', `Forward P/E since 1-Nov-2023 on EPS before exceptional items and the BSV amortisation: median **${n1(HB.med)}x** (25th-75th percentile ${n1(HB.p25)}-${n1(HB.p75)}x; range ${n1(HB.min)}-${n1(HB.max)}x). Before the deal (to 24-Jul-2024) ${n1(HB_pre.med)}x, through the BSV transition ${n1(HB_mid.med)}x, since Oct-2025 ${n1(HB_post.med)}x. No trough years. On reported EPS the median is ${n1(HR.med)}x (house forwardMedian, every 5th week: ${n1(FM.median)}x)`, `Starting point: ${n1(HB.med)}x`],
      ['2. Sector move, same window', `Nine pharma peers' trailing P/E at the ${ASOF_TXT} close vs each one's median since 1-Nov-2023 (table below): median **+${SECTOR}%** (PLAYBOOK §7c; our reproduction ${pc1(sectorCalc)}). The five-year version for names with full histories is +${n1(sector5)}%`, `${n1(HB.med)}x × ${k.toFixed(3)} = ${n1(HB.med * k)}x → **${MULT.base}x**`],
      ['3. Growth', `EPS before amortisation grows ~${Math.round(epsCagrAdj)}% a year FY26-29E (FY26 base before exceptional items; tax rate up from 17% to 25%); EBITDA ~${Math.round(ebitdaCagr)}% a year`, 'No premium or discount (sensitivity below)'],
      ['4. Peers', `Trailing P/E on ${ASOF_TXT}: Torrent ${n1(P.TORNTPHARM.pe)}x, Divi's ${n1(P.DIVISLAB.pe)}x, Abbott ${n1(P.ABBOTINDIA.pe)}x, Ipca ${n1(P.IPCALAB.pe)}x, Sun ${n1(P.SUNPHARMA.pe)}x, Cipla ${n1(P.CIPLA.pe)}x, Alkem ${n1(P.ALKEM.pe)}x; Mankind ${n1(P.MANKIND.pe)}x`, `${MULT.base}x adjusted ≈ ${n1(ENGINE.base)}x reported Sep-28E EPS: Abbott/Ipca territory one year out`],
      ['5. Returns', 'ROE 12.5% in FY26, {{F.roe.0|pct}} / {{F.roe.2|pct}} in FY27E / FY29E vs an 11.3% cost of equity; ~40% ROCE excluding the acquisition (company)', 'No premium while returns are diluted by the deal'],
      ['6. Street basis', `MOSL 40x, Geojit 37x, HSIE 34x on reported EPS: below Mankind's ${n1(HR.med)}x reported median since Nov-2023; they assume the de-rating since mid-2025 persists`, 'We are above the P/E houses'],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; GAM estimates; peers' Screener files (asof-peers.js)` } },
    { exhibit: { type: 'table', title: `Pharma sector factor over Mankind's window: trailing P/E at the ${ASOF_TXT} close vs median since 1-Nov-2023`, head: ['Company', 'P/E (x)', 'Median since Nov-23 (x)', 'vs median', '5-yr median (x)', 'vs 5-yr median'], rows: [
      ...sortDesc(PEER_SET, drW).map(s => [shortName(s), n1(P[s].pe), n1(MEDW[s]), pc1(drW[s]), n1(MED5[s]), pc1(dr5[s])]),
      { hl: true, cells: ['**Median of the nine (set at +11.0%)**', '', '', `**${pc1(sectorCalc)}**`, '', pc1(sector5)] },
      ['Mankind (not in the set: own stock, no five-year history)', n1(P.MANKIND.pe), n1(MEDW.MANKIND), pc1(drW.MANKIND), '–', '–'],
      ...EXCL.map(s => [shortName(s), '', '', '', '', `Excluded: ${D.peers.excluded[s]}`]),
    ], source: `Screener.in "Price to Earning" series to ${ASOF_TXT}, scaled to the NSE close (asof-peers.js); peer set per PLAYBOOK §7c. The batch figure (+11.0%) matches our reproduction.` } },
    { exhibit: { type: 'table', title: 'One basis for history and forecasts: EPS before exceptional items and the BSV amortisation (₹)', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Reported EPS (Screener; FY27-29E model, incl. minorities)', n1(epsRep[2025]), n1(epsRep[2026]), ...X.epsU.map(n1)],
      ['Less exceptional items after tax / minorities (forecasts)', `−${n1(EXC_AT[2025] / SHR[2025])} (Mahananda gain)`, `+${n1(-EXC_AT[2026] / SHR[2026])} (labour codes etc.)`, ...minPs.map(v => `−${n1(v)}`)],
      ['Add BSV amortisation after its tax credit', `+${n1(amortPs(2025))} (${BSV_DAYS25} days)`, `+${n1(amortPs(2026))}`, `+${n1(ppaPs)}`, `+${n1(ppaPs)}`, `+${n1(ppaPs)}`],
      { hl: true, cells: ['**EPS on our basis**', `**${n1(byBase[2025])}**`, `**${n1(byBase[2026])}**`, ...adjEps.map(v => `**${n1(v)}**`)] },
    ], source: 'Screener.in (EPS; exceptional items after tax); AR FY25 note 53 and Q1FY27 call (amortisation ~₹450 cr a year, not tax-deductible, deferred tax unwinding at 25.17%); GAM' } },
    { pair: [
      { type: 'line', title: `Forward P/E since Nov-2023: our ${MULT.base}x vs a ${n1(HB.med)}x median`, unit: 'Price ÷ next full-year EPS before exceptional items and BSV amortisation (x)', x: sBase.map(x => x[0]), series: [{ name: 'Forward P/E', values: sBase.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HB.med, text: `Median: ${n1(HB.med)}x` }, { v: MULT.base, text: `Our target: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; actual EPS FY25-26, GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Share price today'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'From multiple to target', head: ['', 'Base', 'Note'], wide: [2], rows: [
      ['Sep-28E EPS before BSV amortisation (₹)', n1(adjSep), `Half FY28E (₹${n1(adjEps[1])}) + half FY29E (₹${n1(adjEps[2])}); after minorities`],
      ['× target multiple', `${MULT.base}x`, `Own median ${n1(HB.med)}x × ${k.toFixed(3)}`],
      ['= Value per share (₹)', n0(MULT.base * adjSep), ''],
      ['Same value in the engine: reported Sep-28E EPS × equivalent multiple', `₹${n1(epsSep)} × ${ENGINE.base}x`, `${MULT.base} × ${n1(adjSep)} ÷ ${n1(epsSep)}; the Excel model carries this multiple`],
      { hl: true, cells: ['**12-month target (rounded)**', '**{{dcf.tp|inr}}**', `vs CMP ₹${n0(price)}: {{dcf.upside|chg}}`] },
    ], source: 'GAM Research (checked in MANKIND.ctx.js)' } },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS before BSV amortisation ₹${n1(adjSep)} (reported ₹${n1(epsSep)})`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Trailing EBITDA at the target date ₹${n0(ebitdaT27)} cr; net debt Sep-27E ₹${n0(-treasT27)} cr`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF, 11.3%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA: Mankind's trailing EV/EBITDA since Nov-2023 has a median of ${n1(EVH.clean.med)}x once the BSV transition is left out (23-Oct-2024 to 30-Sep-2025, when enterprise value carried all the deal debt but trailing EBITDA held less than four quarters of BSV; ${n1(EVH.all.med)}x with it); times the peers' EV/EBITDA move over the same window (${pc1(sectorEv)}) that is ${EVM.base}x, worth ₹${n0(mv('ev').value)} on trailing EBITDA at the target date, ${Math.round(mv('ev').vsTarget)}% from the target: the two market-based methods agree. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below: at an 11.3% cost of capital and 6% terminal growth, today's cash flows (FCF yield ~2-3%) do not support the price, as for most of the sector. We use the market method the street uses, but the DCF is a reminder that the multiple, not the cash flow, carries the target.` },
    { exhibit: { type: 'table', title: 'Sensitivity: other ways to value it (not used in the base)', head: ['Alternative', 'Multiple', 'Applied to', 'Value (₹)', 'vs base'], wide: [0], rows: [
      ['Reported EPS throughout (history and forecasts), all weekly closes', `${multRepSens}x`, `EPS to shareholders ₹${n1(ownersSep)}`, n0(peV(multRepSens, ownersSep)), vs(peV(multRepSens, ownersSep))],
      ['House forwardMedian on reported EPS (every 5th week)', `${multHouse}x`, `₹${n1(ownersSep)}`, n0(peV(multHouse, ownersSep)), vs(peV(multHouse, ownersSep))],
      ['Including exceptional items (A18 sensitivity), before amortisation', `${multInclSens}x`, `₹${n1(adjSep)}`, n0(peV(multInclSens, adjSep)), vs(peV(multInclSens, adjSep))],
      ['No sector factor (own median only)', `${multNoK}x`, `₹${n1(adjSep)}`, n0(peV(multNoK, adjSep)), vs(peV(multNoK, adjSep))],
      ['Five-year pharma factor (+8.2%) instead of the same window', `${mult5}x`, `₹${n1(adjSep)}`, n0(peV(mult5, adjSep)), vs(peV(mult5, adjSep))],
      [`Midpoint of sector (+${SECTOR}%) and own (${pc1(drW.MANKIND)}) moves`, `${multOwnMid}x`, `₹${n1(adjSep)}`, n0(peV(multOwnMid, adjSep)), vs(peV(multOwnMid, adjSep))],
      ['De-rating since Oct-2025 is permanent (post-Oct-25 median × factor)', `${multPost}x`, `₹${n1(adjSep)}`, n0(peV(multPost, adjSep)), vs(peV(multPost, adjSep))],
      ['EV/EBITDA with the P/E factor / full window incl. transition', `${EVM_PEFACTOR}x / ${EVM_ALL}x`, `Trailing EBITDA ₹${n0(ebitdaT27)} cr`, `${r10((EVM_PEFACTOR * ebitdaT27 + treasT27) / SHARES)} / ${r10((EVM_ALL * ebitdaT27 + treasT27) / SHARES)}`, vs((EVM_PEFACTOR * ebitdaT27 + treasT27) / SHARES)],
      ['Street: MOSL 40x / Geojit 37x on our EPS to shareholders', '40x / 37x', `Sep-28E ₹${n1(ownersSep)} / FY28E ₹${n1(ownersEps[1])}`, `${r10(moslAtOurs)} / ${r10(geoAtOurs)}`, vs(moslAtOurs)],
      ['Street: JM 22x Jun-28E EV/EBITDA on our numbers', '22x', `Jun-28E EBITDA ₹${n0(0.75 * F.ebitda[1] + 0.25 * F.ebitda[2])} cr`, r10(jm22), vs(jm22)],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +2pp a year, margin +1pp; ${MULT.bull}x (75th percentile × sector factor) on adjusted EPS of ₹${n1(EPSC.bull.adj)}.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E adjusted EPS of ₹${n1(adjSep)}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −2.5pp a year, margin −1.5pp; ${MULT.bear}x (25th percentile × sector factor) on ₹${n1(EPSC.bear.adj)}. Note the bear multiple is above today's ${n1(fwdNowAdj)}x FY28E: if the de-rating persists, see the sensitivity above.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27 (engine)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Tax shield only on tax-deductible D&A (3% of revenue); the BSV amortisation saves no tax.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: `Listed pharma peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs median since Nov-23', 'EV/EBITDA (x)', 'vs median since Nov-23', 'ROE'], rows: PEERS.map(p => [p.symbol === 'MANKIND' ? '**Mankind**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc1(drW[p.symbol]), n1(p.evEbitda), pc1(drWev[p.symbol]), p.roe + '%']), source: `Screener.in, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js). Mankind's ROE is on reported profit after the BSV amortisation.` } },
  ],
};

module.exports = { valuation };
