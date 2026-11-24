// Glenmark report, part 5: street view and valuation (P/E primary on core EPS, multiple derived from Glenmark's own forward
// P/E history before exceptional items and the ISB 2001 income, trough years left out, x the nine-peer sector factor;
// EV/EBITDA and DCF cross-checks; sensitivities; scenarios; DCF detail; peers). Risks in part5b.
const X = require('./GLENMARK.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, A, AS, SC, n0, n1, pc, pc1, rup, ASOF_TXT, price, mv, peMult, epsSep28, evMult, ebitdaSep28, FM, HA, HALL, HALT, FWDFY, TROUGH, TROUGH_EV, fwdAdj, fwdEv, HEV, kev, sectorEv, peFY28, peSep28, peSep28Rep, peTtm, epsExc, repEps, sep,
  PEER_SET, EXCL, PEERS, P, MED5, derate, sectorDrCalc, sectorDrAll, sectorDrLarge, SECTOR_DR, k, derived, shortName, SENS, ISB_NPV_MOSL, val, roeSus, gSus, keV, justPe, eps26Alt, ONE_OPEX,
  rating, ST, mosl, choice, dcpl, postQ1, avgTp, medTp, tpLo, tpHi, buys, sells, shortDate, epsCagrFwd, b, FY26 } = X;
const P5B = require('./GLENMARK.part5b');
const lowN = fwdAdj.filter(x => x[1] < 21).length, highN = fwdAdj.filter(x => x[1] > 28).length;
const repSep = sep(repEps);

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street after Q1: ${buys} of ${postQ1.length} positive, no Sells, targets ₹${n0(tpLo)}-${n0(tpHi)}; the disclosed methods are P/E`,
  blocks: [
    { p: `Four houses published after the Q1FY27 results (3-7 Aug 2026). Motilal Oswal (Buy, ₹2,570) values Glenmark at 25x twelve-month-forward EPS plus ₹${ISB_NPV_MOSL} a share for ISB 2001; Choice (Buy, ₹2,590) cites a PEG of 0.8x (~25x its FY28E EPS of ₹${n1(choice.eps.FY28E)}); Deven Choksey (Accumulate, ₹2,563) used 25x Sep-27E EPS in its previous note; ICICI Securities stayed at Hold (₹2,100). Earlier: Geojit Accumulate ₹2,505 (1-Jul), Investec Buy ₹2,750 and Axis Capital Buy ₹2,325 (June). The post-Q1 average target is ₹${n0(avgTp)} (median ₹${n0(medTp)}), ${pc((avgTp / price - 1) * 100)} from the ₹${n0(price)} close on ${ASOF_TXT}. Every broker model we could read keeps the deferred ISB 2001 income in its EPS; none forecasts milestones explicitly.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

const drRow = s => [shortName(s) + (EXCL.includes(s) ? (s === 'GLENMARK' ? ' (the company; not used)' : ' (excluded)') : ''), n1(P[s].pe), n1(MED5[s]), pc1(derate[s]), EXCL.includes(s) ? rup(D.peers.excluded[s]) : 'Used'];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E core EPS gives {{dcf.tp|inr}}: the price already pays for the Investor Day plan`,
  blocks: [
    ...streetBlocks('GLENMARK', {
      rating,
      streetIntro: `Both brokers that disclose a method value Glenmark on **P/E**: Motilal Oswal 25x twelve-month-forward EPS (plus ₹${ISB_NPV_MOSL} for ISB 2001) and Deven Choksey 25x Sep-27E. We use the same method on the EPS the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E), on a core basis (no licensing income).`,
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', rup(s.thesis) + (s.addOn ? ` (${s.addOn})` : '')]),
      ourThesis: 'Good India franchise; US recovery late; reported EPS flattered by deferred licensing income to FY28; price already pays for the plan',
      streetSource: 'MOSL and Choice notes (PDF); Trendlyne (Deven Choksey, ICICI Securities, Geojit); investing.com (Investec, Axis Capital). n.d. = not disclosed',
      derivationIntro: `We start from Glenmark's own one-year-forward P/E since Apr-2021, on EPS before exceptional items (batch practice A18) and before the ISB 2001 income (the upfront is a one-off), leave out trough years (§4), apply the pharma sector factor and test the result against growth, peers, returns and the street.`,
      derivation: [
        ['1. Its own history', `Base series (EPS before exceptional items and licensing income): median ${n1(HA.med)}x since Apr-2021 after leaving out the trough years ${TROUGH.join(' and ')} (FY24 a loss; FY26 core EPS ₹${n1(epsExc[2026])}, below half of FY25's ₹${n1(epsExc[2025])}); 25th-75th percentile ${n1(HA.p25)}-${n1(HA.p75)}x. The series has two regimes: ${lowN} of ${HA.n} points below 21x (forward years FY23 and FY25, when Glenmark carried debt and warning letters) and ${highN} above 28x (forward years FY27-28, after the deal), so the median sits in the gap. By forward year: ${FWDFY.filter(f => !f.trough).map(f => `${f.fy} ${n1(f.med)}x`).join(', ')}. House forwardMedian on reported EPS: ${n1(FM.median)}x (trough ${FM.troughYears.join(', ')}); all dates with positive EPS: ${n1(HALL.med)}x`, `Starting point: ${n1(HA.med)}x (ex-trough, before exceptional items and licensing income)`],
        ['2. Sector factor', `Nine-peer pharma set's trailing P/E at the ${ASOF_TXT} close vs their five-year medians (table below): median ${pc1(sectorDrCalc)} (PLAYBOOK §7c A20: +8.2%; Glenmark is outside the set). Pharma trades above its history, so this is a re-rating`, `${n1(HA.med)}x × ${k.toFixed(3)} = ${n1(derived)}x → **${peMult}x**`],
        ['3. Growth', `Core EPS from ₹${n1(epsExc[2025])} (FY25, before exceptional items) to ₹${n1(F.eps[2])} (FY29E): ${n1(epsCagrFwd)}% a year, faster than in the years behind the low-regime points`, 'Argues higher; no adjustment in the base (§7c)'],
        ['4. Peers', `Trailing P/E on ${ASOF_TXT}: Zydus ${n1(P.ZYDUSLIFE.pe)}x, Aurobindo ${n1(P.AUROPHARMA.pe)}x, Alkem ${n1(P.ALKEM.pe)}x, Cipla ${n1(P.CIPLA.pe)}x, Sun ${n1(P.SUNPHARMA.pe)}x; Glenmark ${n1(P.GLENMARK.pe)}x on trailing EPS that includes licensing income`, `${peMult}x Sep-28E = ${n1(V.tp / F.eps[1])}x our FY28E core EPS: in line with Zydus and Aurobindo, below Cipla and Sun`],
        ['5. Returns', `ROE ~{{F.roe.1|pct}} (FY28E) vs a ${n1(keV)}% cost of equity; a Gordon-growth P/E at ${n1(roeSus)}% ROE and ${gSus}% growth is only ~${n1(justPe)}x`, 'Argues lower: sensitivity only (§7c)'],
        ['6. Street', `MOSL 25x 12M-forward (+₹${ISB_NPV_MOSL} ISB NPV), Deven Choksey 25x Sep-27E, both on reported EPS incl. deferred licensing income. Our target is ${n1(V.tp / repSep)}x Sep-28E EPS on that reported basis`, 'Same method; lower multiple and a stricter EPS'],
      ],
      derivationSource: `Screener.in prices and EPS to ${ASOF_TXT}; AR FY26 note 40 and five-year scorecard; Q4FY23/Q4FY24 presentations (exceptional items, taxed at 25%); peersAsOf at the NSE close; broker notes; GAM Research`,
      history: { field: 'eps', from: '2023-04-01', median: FM.median, label: `House median, reported EPS: ${n1(FM.median)}x`, title: 'Forward P/E on reported EPS since Apr-2023 (after the reported-basis trough dates)', yearStep: 1 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (${evMult}x Sep-28E core EBITDA of ₹${n0(ebitdaSep28)} cr plus model net cash) gives ₹${n0(mv('ev').value)}, ${pc(mv('ev').vsTarget)} vs the target: ${evMult}x is Glenmark's ${n1(HEV.med)}x forward median since 2021 (trough ${TROUGH_EV.join(', ')} left out) times the EV/EBITDA analogue of the sector factor (${pc1(sectorEv)}). The DCF (₹${n0(mv('dcf').value)}) is ${pc(mv('dcf').vsTarget)} vs the target: at a ${n1(keV)}% cost of equity, 5.5% terminal growth, a core margin fading to 21% and working capital of ~29% of sales, cash flows support much less than today's price. All three methods sit below the price.`,
    }),
    { exhibit: { type: 'table', title: 'The sector factor, peer by peer (trailing P/E at the 30-Sep-2026 close vs five-year median)', head: ['Company', 'P/E at 30-Sep (x)', '5-yr median (x)', 'vs median', 'Status'], wide: [4], rows: [
      ...[...PEER_SET, ...EXCL].map(drRow),
      { hl: true, cells: ['**Median of the nine used**', '', '', `**${pc1(sectorDrCalc)}**`, `PLAYBOOK factor +${SECTOR_DR}% (×${k.toFixed(3)}); all 14 others ${pc1(sectorDrAll)}; EV/EBITDA analogue (nine) ${pc1(sectorEv)}`] },
    ], source: `Screener.in (P/E charts), multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers); five-year window Sep-2021 to Sep-2026; PLAYBOOK §7c pharma set` } },
    { exhibit: { type: 'table', title: 'Sensitivity of the target (not in the base case)', head: ['View', 'Multiple / EPS', 'Target (₹)', 'vs CMP', 'Why we do not use it in the base'], wide: [4], rows: [
      ['Reported-EPS median × sector factor', `${SENS.reported}x (${n1(FM.median)}x)`, n0(val(SENS.reported)), pc((val(SENS.reported) / price - 1) * 100), 'Reported EPS carries five years of exceptional items and the FY26 licensing income (A18 sensitivity row)'],
      ['Trough years kept (all dates with positive EPS)', `${SENS.all}x (${n1(HALL.med)}x)`, n0(val(SENS.all)), pc((val(SENS.all) / price - 1) * 100), `§4: FY26-forward dates trade at ~200x core EPS of ₹${n1(epsExc[2026])}`],
      [`FY26 core EPS with an estimate of the undisclosed one-time costs added back (₹${n1(eps26Alt)}; FY26 no longer a trough)`, `${SENS.alt}x (${n1(HALT.med)}x)`, n0(val(SENS.alt)), pc((val(SENS.alt) / price - 1) * 100), `The ~₹${n0(ONE_OPEX)} cr add-back is our estimate from cost lines, not a company figure`],
      ['All 14 other pharma names for the factor', `${SENS.allPeers}x (${pc1(sectorDrAll)})`, n0(val(SENS.allPeers)), pc((val(SENS.allPeers) / price - 1) * 100), 'Includes the distorted names (§7c)'],
      ['Five large caps (Sun, Divi\'s, Torrent, Zydus, Cipla)', `${SENS.large}x (${pc1(sectorDrLarge)})`, n0(val(SENS.large)), pc((val(SENS.large) / price - 1) * 100), 'Hand-picked sub-set (§7c)'],
      ['Base multiple on reported-basis EPS (incl. deferred ISB income)', `${peMult}x × ₹${n1(repSep)}`, n0(val(peMult, repSep)), pc((val(peMult, repSep) / price - 1) * 100), 'The deferred income is part of a one-off upfront and stops in Mar-2028'],
      ['Base + ISB 2001 NPV (Motilal Oswal\'s ₹290)', `${peMult}x + ₹${ISB_NPV_MOSL}`, n0(V.tp + ISB_NPV_MOSL), pc(((V.tp + ISB_NPV_MOSL) / price - 1) * 100), 'Only one of the two brokers that disclose a method adds it; milestones cannot be timed'],
      ['MOSL-style: 25x reported-basis Sep-28E EPS + ₹290', `25x × ₹${n1(repSep)} + ₹${ISB_NPV_MOSL}`, n0(Math.round((25 * repSep + ISB_NPV_MOSL) / 10) * 10), pc(((25 * repSep + ISB_NPV_MOSL) / price - 1) * 100), 'Street multiple, not derived; reported EPS'],
      ['Returns-based (Gordon, ROE vs cost of equity)', `~${n1(justPe)}x`, n0(val(justPe)), pc((val(justPe) / price - 1) * 100), 'No returns adjustment in the base (§7c)'],
      { hl: true, cells: ['**Base**', `**${peMult}x × ₹${n1(epsSep28)}**`, '**{{dcf.tp|num}}**', '**{{dcf.upside|chg}}**', 'Own ex-trough median (before exceptional items and licensing income) × sector factor'] },
    ], source: `GAM Research. Glenmark's own re-rating is not shown: its trailing P/E (${n1(P.GLENMARK.pe)}x, on earnings that include licensing income) equals its distorted five-year median (${n1(MED5.GLENMARK)}x).` } },
    { pair: [
      { type: 'line', title: `Forward P/E (core, ex-trough): two regimes, median ${n1(HA.med)}x; ${n1(peSep28)}x now on Sep-28E`, unit: 'Price ÷ next full-year EPS before exceptional items and licensing income (x)', x: fwdAdj.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdAdj.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HA.med, text: `Median ${n1(HA.med)}x` }, { v: peMult, text: `Target ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; company EPS before exceptional items (taxed at 25%); GAM core estimates FY27-28E' },
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(HEV.med)}x since 2021`, unit: 'EV ÷ next full-year EBITDA (x); FY26 EBITDA core', x: fwdEv.map(x => x[0]), series: [{ name: 'EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median ${n1(HEV.med)}x` }, { v: evMult, text: `Cross-check ${evMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets (net debt at the latest March); GAM estimates FY27-28E' },
    ] },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +3pp a year, core margin +2pp (EPS ₹${n1(SC.bull.eps[1])} FY28E); ${AS.valuation.blend.methods[0].multiple.bull}x (75th percentile × factor).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Core revenue {{F.salesGrowth.1|pct}} / {{F.salesGrowth.2|pct}} in FY28-29E; core margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; NA US$${X.BL.naUsdMn.join(' / ')}mn; ${peMult}x Sep-28E core EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −3pp a year, core margin −2.5pp (EPS ₹${n1(SC.bear.eps[1])} FY28E); ${AS.valuation.blend.methods[0].multiple.bear}x (25th percentile × factor).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: model net cash at Mar-27 (after debt-like items)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'], ['Cost of equity (rf 6.5% + 1.0 × 6%)', '{{dcf.ke|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed pharma peers (trailing, at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'GLENMARK' ? '**Glenmark** (FY26 incl. licensing income)' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples scaled to the NSE close on ${ASOF_TXT}; ROE on FY26 profit (Screener basis); Abbott India standalone` } },
  ],
};

module.exports = { street, valuation, risks: P5B.risks };
