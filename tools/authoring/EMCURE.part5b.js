// Emcure report, part 5b: valuation. P/E primary (every broker that discloses a method uses P/E), with the multiple from
// Emcure's own forward P/E since 1-Jan-2025 x the same-window pharma factor (+16.0%); EV/EBITDA and DCF cross-checks.
const X = require('./EMCURE.ctx');
const { D, F, V, SC, n0, n1, pc, pc1, ASOF_TXT, price, mv, MULT, EPSC, epsSep, epsU, HB, HR, HB_fy26, HB_fy27, HB_fy28, HB_ipo, sBase, FM, byBase, byRep, epsRep, EXC_AT, SHR, TRUEUP, excPs26,
  PEERS, P, MEDW, MED5, drW, dr5, PEER_SET, EXCL, sectorCalc, sector5, SECTOR, k, MEDWEV, drWev, sectorEvCalc, SECTOR_EV, kev, shortName, half, EVH, EVM, EVM_PEFACTOR, ebitdaT27, treasT27, ndCoSep27, evOwnPath, evNowTtm,
  multRepSens, multHouse, multNoK, mult5, multOwnMid, fwdNow, fwdNowSep, trailPe, rating, moslAtOurs, iciciAtOurs, bobAtOurs, SHARES, ebitdaCagr, epsCagr, salesCagr } = X;
const r10 = v => n0(Math.round(v / 10) * 10);
const vs = v => pc(v / V.tp * 100 - 100);
const peV = (m, e) => Math.round(m * e / 10) * 10;
const sortDesc = (arr, by) => [...arr].sort((a, c) => by[c] - by[a]);

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the stock has already re-rated with the sector`,
  blocks: [
    { h: 'How the street values Emcure' },
    { p: `Every note standing on ${ASOF_TXT} that discloses a method values Emcure on **P/E**: ICICI Direct 30x FY28E EPS (4-Sep-2026), Motilal Oswal 28x 12-month-forward EPS (7-Aug-2026), BOB Capital Markets 25x Mar-28E EPS (6-May-2026) and JM Financial 24x Sep-27E EPS (Nov-2025). We follow them: **P/E on Sep-28E EPS (half FY28E, half FY29E)**, the earnings a buyer will look at one year from now. EV/EBITDA and a DCF are cross-checks, not weights. Forecasts carry no exceptional items or currency gains, so the multiple applies directly to model EPS.` },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { p: `Emcure listed on 10-Jul-2024, so there is no five-year history. Following the batch rule (PLAYBOOK §7c), we use its own one-year-forward P/E **since 1-Jan-2025**, skipping the IPO months (Jul-Dec 2024, median ${n1(HB_ipo.med)}x), on every weekly close plus the ${ASOF_TXT} close (${HB.n} points): price ÷ the next full fiscal year's EPS (FY26 actual before exceptional items and the earn-out true-up, then our FY27-28E). We multiply the median by the nine-peer pharma factor measured over the **same window** (+${SECTOR}%) and round to the nearest half-turn. No own move, growth or returns adjustment enters the base; those are sensitivities below.` },
    { exhibit: { type: 'table', title: 'Deriving the target multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Its own history', `Forward P/E since 1-Jan-2025 on EPS before exceptional items: median **${n1(HB.med)}x** (25th-75th percentile ${n1(HB.p25)}-${n1(HB.p75)}x; range ${n1(HB.min)}-${n1(HB.max)}x). Points priced on FY26 EPS (Jan-Mar 2025) ${n1(HB_fy26.med)}x, on FY27E ${n1(HB_fy27.med)}x, on FY28E ${n1(HB_fy28.med)}x: the multiple has risen through the window. No trough years. Reported-EPS median ${n1(HR.med)}x; house forwardMedian (every 5th week) ${n1(FM.median)}x`, `Starting point: ${n1(HB.med)}x`],
      ['2. Sector move, same window', `Nine pharma peers' trailing P/E at the ${ASOF_TXT} close vs each one's median since 1-Jan-2025 (table below): median **+${SECTOR}%** (PLAYBOOK §7c; our reproduction ${pc1(sectorCalc)}). Emcure itself: ${pc1(drW.EMCURE)}`, `${n1(HB.med)}x × ${k.toFixed(3)} = ${n1(HB.med * k)}x → **${MULT.base}x**`],
      ['3. Growth', `EPS ~${Math.round(epsCagr)}% a year FY26-29E (FY26 before exceptional items), EBITDA ~${Math.round(ebitdaCagr)}%, revenue ~${Math.round(salesCagr)}%; FY27E carries no currency gains`, 'No premium or discount (sensitivity below)'],
      ['4. Peers', `Trailing P/E on ${ASOF_TXT}: Torrent ${n1(P.TORNTPHARM.pe)}x, Divi's ${n1(P.DIVISLAB.pe)}x, Mankind ${n1(P.MANKIND.pe)}x, Abbott ${n1(P.ABBOTINDIA.pe)}x, Ipca ${n1(P.IPCALAB.pe)}x, Sun ${n1(P.SUNPHARMA.pe)}x, Cipla ${n1(P.CIPLA.pe)}x, Alkem ${n1(P.ALKEM.pe)}x, Aurobindo ${n1(P.AUROPHARMA.pe)}x; Emcure ${n1(P.EMCURE.pe)}x`, `${MULT.base}x Sep-28E ≈ ${n1(MULT.base * epsSep / epsU[0])}x FY27E: between the India-led and the export-led peers, where Emcure's mix puts it`],
      ['5. Returns', 'ROE {{F.roe.0|pct}} / {{F.roe.2|pct}} in FY27E / FY29E vs an 11.9% cost of equity; company ROCE 23.7% in FY26', 'Returns cover the cost of capital; no premium for governance'],
      ['6. Street basis', 'ICICI Direct 30x FY28E, Motilal Oswal 28x 12-month forward, BOB 25x Mar-28E, JM 24x Sep-27E', `We sit inside the street's 24-30x range`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; GAM estimates; peers' Screener files (asof-peers.js)` } },
    { exhibit: { type: 'table', title: `Pharma sector factor over Emcure's window: trailing P/E at the ${ASOF_TXT} close vs median since 1-Jan-2025`, head: ['Company', 'P/E (x)', 'Median since Jan-25 (x)', 'vs median', 'EV/EBITDA (x)', 'Median since Jan-25 (x)', 'vs median'], rows: [
      ...sortDesc(PEER_SET, drW).map(s => [shortName(s), n1(P[s].pe), n1(MEDW[s]), pc1(drW[s]), n1(P[s].evEbitda), n1(MEDWEV[s]), pc1(drWev[s])]),
      { hl: true, cells: ['**Median of the nine (set at +16.0% P/E, +10.8% EV/EBITDA)**', '', '', `**${pc1(sectorCalc)}**`, '', '', `**${pc1(sectorEvCalc)}**`] },
      ['Emcure (not in the set: own stock, listed Jul-2024)', n1(P.EMCURE.pe), n1(MEDW.EMCURE), pc1(drW.EMCURE), n1(P.EMCURE.evEbitda), n1(MEDWEV.EMCURE), pc1(drWev.EMCURE)],
      ['Mankind (reference: recently listed India branded)', n1(P.MANKIND.pe), n1(MEDW.MANKIND), pc1(drW.MANKIND), n1(P.MANKIND.evEbitda), n1(MEDWEV.MANKIND), pc1(drWev.MANKIND)],
      ...EXCL.map(s => [shortName(s), '', '', '', '', '', `Excluded: ${D.peers.excluded[s]}`]),
    ], source: `Screener.in "Price to Earning" and "EV Multiple" series to ${ASOF_TXT}, scaled to the NSE close (asof-peers.js); peer set per PLAYBOOK §7c. The batch figures (+16.0% / +10.8%) match our reproduction.` } },
    { exhibit: { type: 'table', title: 'EPS used for the history and the target (₹)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Reported EPS (Screener; FY27-29E model)', n1(epsRep[2026]), ...epsU.map(n1)],
      ['Add back exceptional items after tax (labour codes, legal, consultancy)', `+${n1(-EXC_AT[2026] / SHR[2026])}`, '–', '–', '–'],
      ['Add back the Mantra earn-out true-up (₹42.86 cr, no tax)', `+${n1(TRUEUP / SHR[2026])}`, '–', '–', '–'],
      { hl: true, cells: ['**EPS before exceptional items (our basis)**', `**${n1(byBase[2026])}**`, ...epsU.map(v => `**${n1(v)}**`)] },
      ['Memo: company adjusted EPS (adjusted PAT ₹1,008 cr less ₹17 cr minorities) / brokers\' adjusted EPS (MOSL, BOB, ICICI Direct)', '~52.3 / 52.4-52.7', '', '', ''],
    ], source: 'Screener.in (EPS; exceptional items after tax); AR FY26 notes 37, 63; Q4FY26 deck (adjusted PAT ₹1,008 cr); GAM' } },
    { pair: [
      { type: 'line', title: `Forward P/E since Jan-2025: our ${MULT.base}x vs a ${n1(HB.med)}x median`, unit: 'Price ÷ next full-year EPS before exceptional items (x)', x: sBase.map(x => x[0]), series: [{ name: 'Forward P/E', values: sBase.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HB.med, text: `Median: ${n1(HB.med)}x` }, { v: MULT.base, text: `Our target: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; actual EPS FY26, GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Share price today'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'From multiple to target', head: ['', 'Base', 'Note'], wide: [2], rows: [
      ['Sep-28E EPS (₹)', n1(epsSep), `Half FY28E (₹${n1(epsU[1])}) + half FY29E (₹${n1(epsU[2])})`],
      ['× target multiple', `${MULT.base}x`, `Own median ${n1(HB.med)}x × ${k.toFixed(3)}, nearest half-turn`],
      ['= Value per share (₹)', n0(MULT.base * epsSep), ''],
      { hl: true, cells: ['**12-month target (rounded)**', '**{{dcf.tp|inr}}**', `vs CMP ₹${n0(price)}: {{dcf.upside|chg}}`] },
    ], source: 'GAM Research (checked in EMCURE.ctx.js)' } },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Trailing EBITDA at the target date ₹${n0(ebitdaT27)} cr; net debt Sep-27E ₹${n0(-treasT27)} cr (engine, incl. leases)`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF, 11.9%, g 5.5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA: Emcure's trailing EV/EBITDA since Jan-2025 has a median of ${n1(EVH.med)}x; times the peers' EV/EBITDA move over the same window (+${SECTOR_EV}%) that is ${EVM.base}x, worth ₹${n0(mv('ev').value)} on trailing EBITDA at the target date, ${pc(mv('ev').vsTarget)} vs the target (₹${r10(evOwnPath)} on our company-basis net debt, which excludes leases and includes the Gennova payment): the two market methods agree. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below: at an 11.9% cost of capital and 5.5% terminal growth, today's free cash flow (yield ~2%, held back by working capital) does not support the price. We use the market method the street uses; the DCF is a reminder that the sector multiple, not cash flow, carries the target.` },
    { exhibit: { type: 'table', title: 'Sensitivity: other ways to value it (not used in the base)', head: ['Alternative', 'Multiple', 'Applied to', 'Value (₹)', 'vs base'], wide: [0], rows: [
      ['Reported EPS in the history (A18 sensitivity)', `${multRepSens}x`, `Sep-28E ₹${n1(epsSep)}`, n0(peV(multRepSens, epsSep)), vs(peV(multRepSens, epsSep))],
      ['House forwardMedian on reported EPS (every 5th week)', `${multHouse}x`, `₹${n1(epsSep)}`, n0(peV(multHouse, epsSep)), vs(peV(multHouse, epsSep))],
      ['No sector factor (own median only)', `${multNoK}x`, `₹${n1(epsSep)}`, n0(peV(multNoK, epsSep)), vs(peV(multNoK, epsSep))],
      ['Five-year all-nine pharma factor (+8.2%) instead of the same window', `${mult5}x`, `₹${n1(epsSep)}`, n0(peV(mult5, epsSep)), vs(peV(mult5, epsSep))],
      [`Midpoint of sector (+${SECTOR}%) and own (${pc1(drW.EMCURE)}) moves`, `${multOwnMid}x`, `₹${n1(epsSep)}`, n0(peV(multOwnMid, epsSep)), vs(peV(multOwnMid, epsSep))],
      ['Including the IPO months (Jul-Dec 2024) in the history', `${X.multAll}x`, `₹${n1(epsSep)}`, n0(peV(X.multAll, epsSep)), vs(peV(X.multAll, epsSep))],
      ['EV/EBITDA with the P/E factor', `${EVM_PEFACTOR}x`, `Trailing EBITDA ₹${n0(ebitdaT27)} cr`, r10((EVM_PEFACTOR * ebitdaT27 + treasT27) / SHARES), vs((EVM_PEFACTOR * ebitdaT27 + treasT27) / SHARES)],
      ['Street: Motilal Oswal 28x 12-month forward on our EPS', '28x', `Sep-27E-to-Sep-28E blend ₹${n1(moslAtOurs / 28)}`, r10(moslAtOurs), vs(moslAtOurs)],
      ['Street: ICICI Direct 30x / BOB 25x FY28E on our EPS', '30x / 25x', `FY28E ₹${n1(epsU[1])}`, `${r10(iciciAtOurs)} / ${r10(bobAtOurs)}`, `${vs(iciciAtOurs)} / ${vs(bobAtOurs)}`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +2.5pp a year, margin +1pp; ${MULT.bull}x (75th percentile × sector factor) on Sep-28E EPS of ₹${n1(EPSC.bull)}.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS of ₹${n1(epsSep)}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −3pp a year, margin −1.5pp; ${MULT.bear}x (25th percentile × sector factor) on ₹${n1(EPSC.bear)}.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27 (engine, incl. leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Cost of equity 6.5% + 0.9 × 6% = 11.9% (≈ WACC; net debt is small and guided to nil by FY28).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: `Listed pharma peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs median since Jan-25', 'EV/EBITDA (x)', 'vs median since Jan-25', 'ROE'], rows: PEERS.map(p => [p.symbol === 'EMCURE' ? '**Emcure**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc1(drW[p.symbol]), n1(p.evEbitda), pc1(drWev[p.symbol]), p.roe + '%']), source: `Screener.in, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js). Emcure's EBITDA margin is Screener's (19.0%; company 19.4%).` } },
  ],
};

module.exports = { valuation };
