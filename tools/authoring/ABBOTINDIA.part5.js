// Abbott India report, part 5: street view, valuation (P/E primary on the street's method; multiple = own forward
// median since Apr-2021 x the pharma sector factor; EV/EBITDA and DCF cross-checks; sensitivities; scenarios; peers),
// risks & honest summary.
const X = require('./ABBOTINDIA.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, A, AS, SC, n0, n1, pc, pc1, pc2, rup, ASOF, ASOF_TXT, price, mcap, SHARES, mv, sep, FM, HR, HX, HW, FWDFY, sAllWk, peFY27, peFY28, peSep28, peTtm, fwdNowVsMed, troughCheck,
  PEERS, P, MED5, MED5EV, derate, derateEv, USED, EXCL, sectorCalc, sectorEv, sectorAll, SET_FACTOR, FACTOR_DIFF, k, kev, ownDr, ownDrEv, sectorLarge, shortName,
  MULT, derived, epsSep, val, epsCagrHist, epsCagrFwd, keV, roeSus, gSus, justPe, pegWin, pegMult, SENS, evHist, HEV, HEVS, EVM, EVM_PEK, EVM_SCR, evTtmNow, evFy28, ebitdaT27, treasT27,
  rating, ruleText, buyBelow, sellAbove, ST, bob, idir, isec, withTp, medTp, avgTp, CONS, divYield, fcfYield, bobAtOurs, idirAtOurs, shortDate, Q1, b, BL, netCash26 } = X;
const r10 = v => Math.round(v / 10) * 10;
const vsCmp = v => pc((v / price - 1) * 100);
const evVal = m => (m * ebitdaT27 + treasT27) / SHARES;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: three Buys, targets ₹${n0(Math.min(...withTp.map(s => s.tp)))}-${n0(Math.max(...withTp.map(s => s.tp)))}, all on P/E; the latest note cut its multiple from 40x to 32x`,
  blocks: [
    { p: `Coverage of Abbott India is thin: the company holds no calls and few houses publish. Three notes were standing on ${ASOF_TXT}, all Buy and all on P/E. **BOB Capital Markets** (3-Sep-2026) cut its target to ₹${n0(bob.tp)} from ₹${n0(bob.prevTp)} by lowering its multiple to 32x Sep-28E EPS (from 40x Jun-28E), because growth is normalising to 8-9% while the Novo portfolio declines. **ICICI Direct** (13-Aug-2026) values it at 36x FY28E EPS (₹${n0(idir.tp)}), arguing that power brands offset "Novo-led fluctuations" and that Q1 may be an aberration. **ICICI Securities** (institutional; Nov-2025, not updated by 30-Sep) used 38x FY27E (₹${n0(isec.tp)}). The median target is ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} from ₹${n0(price)}. Bloomberg consensus EPS is ₹${n1(CONS.epsFY27E)} / ${n1(CONS.epsFY28E)} for FY27-28E. The debate is about the multiple a slower-growing Abbott deserves, not about quality.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(([a, w]) => [rup(a), rup(w)]), source: 'Broker notes, annual report and filings to 30-Sep-2026' } },
  ],
};

const drRow = s => [shortName(s) + (EXCL.includes(s) ? ' (excluded)' : s === 'ABBOTINDIA' ? ' (the company itself)' : ''), n1(P[s].pe), n1(MED5[s]), pc1(derate[s]), n1(P[s].evEbitda), n1(MED5EV[s]), pc1(derateEv[s]), EXCL.includes(s) ? rup(D.peers.excluded[s]) : s === 'ABBOTINDIA' ? 'Not used (own de-rating: sensitivity only)' : 'Used'];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the house method says Abbott has de-rated too far, the DCF says it has not`,
  blocks: [
    ...streetBlocks('ABBOTINDIA', {
      rating,
      streetIntro: `Every note with a disclosed method values Abbott India on **P/E**: BOB Capital Markets 32x Sep-28E EPS, ICICI Direct 36x FY28E, ICICI Securities 38x FY27E. We use the same method on the EPS a buyer will look at in September 2027 (**Sep-28E: half FY28E, half FY29E**, ₹${n1(epsSep.base)}). Exceptional items are immaterial, so history and forecasts are on reported EPS.`,
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', rup(s.thesis)]),
      ourThesis: 'Own brands compound with the market; the partner third shrinks; de-rated while the sector re-rated',
      streetSource: 'BOBCAPS company update (3-Sep-2026, PDF); ICICI Direct result update (13-Aug-2026, PDF); ICICI Securities institutional (9-Nov-2025: Trendlyne listing and press summary). Superseded: BOBCAPS ₹37,431 (40x Jun-28E, 13-Aug-2026). n.d. = not disclosed',
      derivationIntro: `We start from Abbott India's own one-year-forward P/E since Apr-2021 (house forwardMedian), apply the pharma sector factor set for Abbott in PLAYBOOK §7c (+${SET_FACTOR}%: the other eight names in the nine-company pharma set) and round to the nearest half-turn. Abbott's own de-rating and its slower growth are shown as sensitivities, not in the base (§7c).`,
      derivation: [
        ['1. Its own history', `House forwardMedian (reported EPS, every 5th week since Apr-2021, ${HR.n} points): **${n1(HR.med)}x** (25th-75th percentile ${n1(HR.p25)}-${n1(HR.p75)}x; range ${n1(HR.min)}-${n1(HR.max)}x). No trough years: forward EPS was always above its prior three-year peak (lowest: ${Math.round(Math.min(...troughCheck.map(t => t.ratio)) * 100)}% of that peak). On EPS before exceptional items the median is also ${n1(HX.med)}x (exceptional items ≤ ₹6 cr a year); on all weekly closes ${n1(HW.med)}x. By forward year: ${FWDFY.map(f => `${f.fy} ${n1(f.med)}x`).join(', ')}`, `Starting point: ${n1(HR.med)}x`],
        ['2. Sector factor', `The other eight pharma-set names' trailing P/E at the ${ASOF_TXT} close vs their five-year medians (table below): median **+${SET_FACTOR}%** (PLAYBOOK §7c, A20; our reproduction ${pc2(sectorCalc)}; all 14 names ex-Abbott ${pc2(sectorAll)}). Pharma trades above its history, so this is a re-rating`, `${n1(HR.med)}x × ${k} = ${n1(derived)}x → **${MULT.base}x**`],
        ['3. Growth', `EPS grew ${n1(epsCagrHist)}% a year FY21-26 (margin expansion and interest income); we forecast ${n1(epsCagrFwd)}% a year FY26-29E. The median was paid for faster growth than we now expect`, 'Argues for a lower multiple; no adjustment in the base (§7c), sensitivity below'],
        ['4. Peers', `Trailing P/E on ${ASOF_TXT}: Torrent ${n1(P.TORNTPHARM.pe)}x, Divi's ${n1(P.DIVISLAB.pe)}x, Ipca ${n1(P.IPCALAB.pe)}x, Sun ${n1(P.SUNPHARMA.pe)}x, Cipla ${n1(P.CIPLA.pe)}x, Alkem ${n1(P.ALKEM.pe)}x, Aurobindo ${n1(P.AUROPHARMA.pe)}x, Zydus ${n1(P.ZYDUSLIFE.pe)}x; Abbott ${n1(P.ABBOTINDIA.pe)}x (${pc1(ownDr)} vs its own five-year median, the most de-rated name in the set)`, `${MULT.base}x Sep-28E = ${n1(V.tp / F.eps[1])}x our FY28E: below Torrent and Divi's, above Sun and Ipca today`],
        ['5. Returns', `ROE ~${Math.round(F.roe[1])}% (FY28E) with ₹4,400 cr of cash; return on operating capital far higher; cost of equity ${n1(keV)}%. A Gordon-growth P/E at ${n1(roeSus)}% ROE and ${gSus}% growth is ~${n1(justPe)}x`, 'High returns, but the Gordon P/E is below the market\'s history: sensitivity only'],
        ['6. Street', `BOBCAPS 32x Sep-28E (cut from 40x), ICICI Direct 36x FY28E, ICICI Securities 38x FY27E. Our target is ${n1(V.tp / F.eps[1])}x our FY28E EPS (₹${n0(F.eps[1])}) and ${n1(V.tp / idir.eps.FY28E)}x ICICI Direct's`, 'Same method; higher multiple, lower EPS'],
      ],
      derivationSource: `Screener.in prices, EPS and P/E history to ${ASOF_TXT}; peersAsOf at the NSE close; broker notes; GAM Research (computed in ABBOTINDIA.ctx.js)`,
      history: { field: 'eps', from: '2016-04-01', median: FM.median, label: `Median since Apr-2021: ${n1(FM.median)}x`, title: 'Forward P/E on reported EPS since 2016 (house series)', yearStep: 2 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA: Abbott's own trailing EV/EBITDA since Apr-2021 (market value less all cash and deposits, over operating EBITDA) has a median of ${n1(HEV.med)}x (Screener's own series, which counts other income in EBITDA and ignores long deposits, ${n1(HEVS.med)}x); times the EV/EBITDA analogue of the sector factor (${pc1(sectorEv)}) that is ${EVM.base}x, worth ₹${n0(mv('ev').value)} on trailing EBITDA at the target date, ${pc(mv('ev').vsTarget)} vs the target. It agrees with the P/E that, against its own history, the stock is cheap: Abbott trades at ${n1(evTtmNow)}x trailing EBITDA today. The DCF (₹${n0(mv('dcf').value)}, ${pc(mv('dcf').vsTarget)} vs the target and ${vsCmp(mv('dcf').value)} vs the price) disagrees: at an ${n1(keV)}% cost of equity and 6% terminal growth, cash flows that yield ~${n1(fcfYield)}% today do not support even the current price. The market (and our target) capitalise Abbott as a safe, high-return franchise at a low discount rate; if growth stays near 8% and the market prices it like the DCF, the multiple has further to fall. That is the main risk to the call.`,
    }),
    { exhibit: { type: 'table', title: `The sector factor, peer by peer (trailing multiples at the ${ASOF_TXT} close vs five-year medians)`, head: ['Company', 'P/E (x)', '5-yr median (x)', 'vs median', 'EV/EBITDA (x)', '5-yr median (x)', 'vs median', 'Status'], wide: [7], rows: [
      ...[...USED].sort((a, c) => derate[c] - derate[a]).map(drRow), drRow('ABBOTINDIA'), ...EXCL.map(drRow),
      { hl: true, cells: ['**Median of the eight used**', '', '', `**${pc2(sectorCalc)}**`, '', '', `**${pc2(sectorEv)}**`, `Set factor +${SET_FACTOR}% (P/E); EV/EBITDA analogue used only for the cross-check${FACTOR_DIFF ? '; reproduction differs' : '; reproduction matches'}`] },
    ], source: `Screener.in P/E and EV/EBITDA charts, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js); five-year window Sep-2021 to Sep-2026; PLAYBOOK §7c pharma set` } },
    { exhibit: { type: 'table', title: 'Sensitivity of the target to the multiple (not in the base case)', head: ['View', 'Multiple', 'Value (₹)', 'vs CMP', 'Why we do not use it in the base'], wide: [4], rows: [
      ['EPS before exceptional items × factor (A18 practice)', `${SENS.preExc}x (${n1(HX.med)}x × ${k})`, n0(val(SENS.preExc)), vsCmp(val(SENS.preExc)), 'Same as the base: exceptional items are immaterial'],
      ['All weekly closes instead of every 5th week', `${SENS.allWeeks}x (${n1(HW.med)}x)`, n0(val(SENS.allWeeks)), vsCmp(val(SENS.allWeeks)), 'House function samples every 5th week'],
      ['No sector factor (own median only)', `${SENS.noFactor}x`, n0(val(SENS.noFactor)), vsCmp(val(SENS.noFactor)), 'House rule applies the sector factor'],
      [`Abbott's own de-rating (${pc1(ownDr)}) instead of the sector's`, `${SENS.own}x`, n0(val(SENS.own)), vsCmp(val(SENS.own)), 'House rule: sector factor only, no own de-rating (§7c)'],
      [`Midpoint of sector (+${SET_FACTOR}%) and own (${pc1(ownDr)})`, `${SENS.mid}x`, n0(val(SENS.mid)), vsCmp(val(SENS.mid)), 'No blending (§7c)'],
      ['Large-cap sub-set (Sun, Divi\'s, Torrent, Zydus)', `${SENS.large}x (${pc1(sectorLarge)})`, n0(val(SENS.large)), vsCmp(val(SENS.large)), 'Hand-picked sub-set (§7c)'],
      [`Growth-adjusted: PEG held at its window level (${n1(pegWin)}x × ${n1(epsCagrFwd)}% growth)`, `${SENS.peg}x`, n0(val(SENS.peg)), vsCmp(val(SENS.peg)), 'No growth adjustment in the base (§7c); the market has never priced Abbott on PEG'],
      [`Returns-based (Gordon: ROE ${n1(roeSus)}%, g ${gSus}%, Ke ${n1(keV)}%)`, `${SENS.gordon}x`, n0(val(SENS.gordon)), vsCmp(val(SENS.gordon)), 'No returns adjustment in the base (§7c)'],
      ['Street: BOBCAPS 32x Sep-28E / ICICI Direct 36x FY28E on our EPS', '32x / 36x', `${n0(r10(bobAtOurs))} / ${n0(r10(idirAtOurs))}`, `${vsCmp(bobAtOurs)} / ${vsCmp(idirAtOurs)}`, 'Street multiples are judgement calls, not derived'],
      ['De-rating persists: today\'s forward P/E held', `${n1(peSep28)}x Sep-28E`, n0(r10(peSep28 * epsSep.base)), '0%', 'By construction: the price already assumes it'],
      { hl: true, cells: ['**Base**', `**${MULT.base}x**`, '**{{dcf.tp|num}}**', '**{{dcf.upside|chg}}**', 'Own forward median × sector factor'] },
    ], source: 'GAM Research (ABBOTINDIA.ctx.js)' } },
    { pair: [
      { type: 'line', title: `Forward P/E since Apr-2021: median ${n1(HR.med)}x, ${n1(peFY28)}x now on FY28E`, unit: 'Price ÷ next full-year EPS (x), every weekly close', x: sAllWk.map(x => x[0]), series: [{ name: 'Forward P/E', values: sAllWk.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HR.med, text: `Median ${n1(HR.med)}x` }, { v: MULT.base, text: `Target ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; reported EPS FY22-26, GAM estimates FY27-28E' },
      { type: 'line', title: `Own EV/EBITDA: median ${n1(HEV.med)}x since Apr-2021, ${n1(evTtmNow)}x now`, unit: 'Market value less all cash and deposits ÷ trailing operating EBITDA (x)', x: evHist.map(x => x[0]), series: [{ name: 'EV/EBITDA', values: evHist.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median ${n1(HEV.med)}x` }, { v: EVM.base, text: `Cross-check ${EVM.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and quarterly margins; AR net cash (Mar-25/26; earlier years approximated); GAM' },
    ] },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +2.5pp a year, margin +1pp (EPS ₹${n0(SC.bull.eps[1])} FY28E); ${MULT.bull}x (75th percentile × factor).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −3pp a year, margin −1.5pp (EPS ₹${n0(SC.bear.eps[1])} FY28E); ${MULT.bear}x (25th percentile × factor). The bear multiple is still above today's ${n1(peSep28)}x Sep-28E: if the de-rating persists, the bear value is ~₹${n0(r10(peSep28 * epsSep.bear))}.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'], ['Cost of equity (rf 6.5% + 0.8 × 6%)', '{{dcf.ke|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: `Listed pharma peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'ABBOTINDIA' ? '**Abbott India**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), derate[p.symbol] == null ? '–' : pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js); ROE on FY26 profit (Screener basis); Mankind has no five-year median (listed May-2023)` } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a high-quality franchise at a de-rated price; the upside needs the market to pay its old multiple for slower growth',
  blocks: [
    { callout: `**What you are buying:** India's largest listed MNC pharma franchise: trusted brands in thyroid, liver, gastro, CNS and women's health growing ~10-11%, a 34% ROE, no debt, ₹${n0(netCash26)} cr of net cash and a ~${n1(divYield)}% dividend yield, with no royalty to the parent. **What you are not buying:** a pipeline, pricing power, control over the Novo third of revenue, or a management team that talks to investors.` },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(peTtm)}x trailing EPS, ${n1(peFY27)}x FY27E, ${n1(peFY28)}x FY28E and ${n1(peSep28)}x Sep-28E: FY28E is ${Math.abs(Math.round(fwdNowVsMed))}% below Abbott's ${n1(HR.med)}x forward median while pharma peers trade ${SET_FACTOR}% above theirs. On the street's method and our (below-consensus) EPS, the house multiple of ${MULT.base}x gives {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating} under our rule. The DCF (₹${n0(mv('dcf').value)}) says the opposite. The honest reading: the stock is cheap against its own history and its sector, but that history was made while EPS grew ~18% a year; at ~9% the de-rating may be partly deserved (BOBCAPS' 32x, or the midpoint sensitivity at ${SENS.mid}x, ₹${n0(val(SENS.mid))}).` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Reported growth back to 9-10% as the partner decline annualises (from Q1FY28)', 'Medium', 'Quarterly revenue; IQVIA/Pharmarack own-brand growth'],
      ['Extensior and Ryzodeg stabilise the diabetes bag', 'Low-medium', 'IQVIA semaglutide share; Novo portfolio decisions'],
      ['Udiliv and Duphaston return to market growth', 'Medium', 'Monthly Pharmarack data; dydrogesterone pricing'],
      ['Better disclosure (own vs partner split, investor calls)', 'Low', 'Annual report FY27; any analyst meet'],
      ['Higher payout or special dividend from the ₹4,400 cr cash', 'Medium', 'May-2027 dividend declaration'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Novo narrows the portfolio further or ends the arrangement', 'Medium', 'Revenue −5% to −35%; EBITDA −1% to −6%'],
      ['Growth stays ~8% and the market keeps de-rating (BOBCAPS 32x)', 'Medium', `At 32x Sep-28E the value is ~₹${n0(r10(bobAtOurs))} (${vsCmp(bobAtOurs)})`],
      ['A royalty or brand fee to the parent', 'Low', `Each 1% of revenue ≈ ₹${n0(F.sales[1] / 100 * (1 - AS.taxRate[1] / 100) / SHARES)} of FY28E EPS (~${n0(F.sales[1] / 100 * (1 - AS.taxRate[1] / 100) / F.pat[1] * 100)}%)`],
      ['New NLEM list or lower WPI adds price control on more brands', 'Low-medium', 'Own-brand price growth below 4%'],
      ['Generic erosion in Duphaston, Udiliv, Digene', 'Medium', 'Gastro/women\'s health growth in low single digits'],
      ['Falling deposit rates', 'Medium', 'Each 1pp on ₹4,500 cr ≈ ₹16 of EPS (2%)'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The rule gives BUY below ~₹${n0(buyBelow)}** (where upside to our target is 15%), HOLD up to ~₹${n0(sellAbove)} and SELL above, on today's numbers.`,
      `**Biggest swing factor: the multiple.** Each 1x on the P/E is ~₹${n0(epsSep.base)} a share; the own-de-rating sensitivity (${SENS.own}x) would put fair value at ~₹${n0(val(SENS.own))}, below today's price. Each 1pp of FY28-29E EBITDA margin is ~₹${n0((F.sales[1] + F.sales[2]) / 2 / 100 * (1 - AS.taxRate[1] / 100) / SHARES)} of Sep-28E EPS (~₹${n0((F.sales[1] + F.sales[2]) / 2 / 100 * (1 - AS.taxRate[1] / 100) / SHARES * MULT.base)} a share at ${MULT.base}x).`,
      '**Position size:** given thin liquidity (~US$3mn a day), the DCF gap and the lack of company communication, we would build a position gradually and treat it as a low-volatility compounder, not a re-rating trade.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Own-brand growth, Q1FY27', v: '~+11%', d: 'reported revenue +4.3% (Novo brands fell)' },
      { k: 'EBITDA margin, Q1FY27', v: `${Q1.ebitdaMarginPct}%`, d: 'gross margin 48.6%, +283bp' },
      { k: 'Net cash', v: `₹${n0(netCash26)} cr`, d: '7% of market value; no royalty to the parent' },
      { k: 'Forward P/E (FY28E)', v: `${n1(peFY28)}x`, d: `median ${n1(HR.med)}x since Apr-2021` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, valuation, risks };
