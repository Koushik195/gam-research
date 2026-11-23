// Lupin report, part 5: street view and valuation (P/E primary, derived multiple with the trough year left out, EPS before
// exceptional items, per-peer sector factor, cross-checks, sensitivities, DCF, scenarios, peers). Risks in part5b.
const X = require('./LUPIN.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, A, AS, SC, n0, n1, pc, pc1, rup, ASOF_TXT, price, mv, peMult, epsSep28, evMult, ebitdaSep28, FM, HA, HALL, FWDFY, troughPe, PRE, TROUGH, fwdAdj, fwdEv, HEV, EVM, kev, sectorEv, peFY28, peSep28, peTtm, epsExc, excAt26,
  PEER_SET, EXCL, PEERS, P, MED5, derate, sectorDrCalc, sectorDrAll, sectorDrLarge, SECTOR_DR, k, derived, shortName, SENS, val, roeSus, gSus, keV, justPe, eps72Sep, epsBuSep,
  rating, ST, mosl, pl_, bob, postQ1, avgTp, medTp, tpLo, tpHi, buys, sells, shortDate, epsCagrFwd, epsCagrHist, CONS, evFy28, b, FY26 } = X;
const P5B = require('./LUPIN.part5b');

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street after Q1: ${buys} of ${postQ1.length} positive, ${sells} Sells, targets ₹${n0(tpLo)}-${n0(tpHi)}, all disclosed methods on P/E`,
  blocks: [
    { p: `Eight houses published after the Q1FY27 results (8-27 Aug 2026). ${buys} are positive: BOB Capital Markets Buy ₹3,095 (26x Jun-28E EPS), Bernstein Outperform ₹2,707, Emkay Add ₹2,500, Prabhudas Lilladher Accumulate ₹2,500 (25x FY28E) and Deven Choksey Accumulate ₹2,444. Motilal Oswal is Neutral (₹2,500, 22x 12-month-forward EPS); ICICI Securities (₹2,200) and Citi (₹2,050, downgraded from Buy on 27-Aug) are Sells. The average target is ₹${n0(avgTp)} (median ₹${n0(medTp)}), ${pc((avgTp / price - 1) * 100)} from the ₹${n0(price)} close on ${ASOF_TXT}; the stock was ₹2,364 when most notes came out. Even the positive houses expect flat-to-lower earnings in FY27-28; they differ on how fast the US recovers. Bloomberg consensus EPS (as printed by BOB on 8-Aug): ₹${CONS.FY27E} for FY27E and ₹${CONS.FY28E} for FY28E.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

const drRow = s => [shortName(s) + (EXCL.includes(s) ? (s === 'LUPIN' ? ' (the company; not used)' : ' (excluded)') : ''), n1(P[s].pe), n1(MED5[s]), pc1(derate[s]), EXCL.includes(s) ? rup(D.peers.excluded[s]) : 'Used'];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E EPS gives {{dcf.tp|inr}}: the stock already prices the replacements`,
  blocks: [
    ...streetBlocks('LUPIN', {
      rating,
      streetIntro: 'Every note that discloses a method values Lupin on **P/E**: Motilal Oswal 22x 12-month-forward EPS, Prabhudas Lilladher 25x FY28E, BOB Capital Markets 26x Jun-28E (Nomura used 28x Dec-27E in Nov-2025). We use the same method on the EPS the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E).',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', rup(s.thesis)]),
      ourThesis: 'Windfall fades on schedule; base business strong; replacements back-ended; priced for success',
      streetSource: 'MOSL, PL, Emkay and BOB notes (PDF); Trendlyne (ICICI Securities, Deven Choksey); StockGro 27-Aug-2026 (Citi, Bernstein). n.d. = not disclosed. Older notes: Nuvama Hold ₹2,600 and Nomura Buy ₹2,580 (May-2026), Geojit Buy ₹2,606 (Jun-2026)',
      derivationIntro: `We start from Lupin's own one-year-forward P/E since Apr-2021, leave out the trough year (§4), take out the FY26 exceptional items (batch practice A18: the base uses EPS before them; forecasts carry none), keep the windfalls in (they are real operating profit, §7c), apply the pharma sector factor and test the result against growth, peers, returns and the street.`,
      derivation: [
        ['1. Its own history', `House forwardMedian (reported EPS): ${n1(FM.median)}x since Apr-2021 after leaving out the trough year ${FM.troughYears.join(', ')} (forward EPS ₹9.45, below half of FY21's ₹26.81; those dates traded at ${n1(troughPe.min)}-${n1(troughPe.max)}x); ${n1(FM.medianAll)}x on all dates. On EPS before exceptional items (FY26: ₹558 cr net charge, ₹${n0(excAt26)} cr after tax; EPS ₹${n1(epsExc[2026])} vs ₹${FY26.epsBasic.toFixed(2)} reported) the ex-trough median is ${n1(HA.med)}x (25th-75th percentile ${n1(HA.p25)}-${n1(HA.p75)}x), ${n1(HALL.med)}x with the trough. By forward year: ${FWDFY.map(f => `${f.fy} ${n1(f.med)}x`).join(', ')}: ~16x whenever the forward year held the windfall`, `Starting point: ${n1(HA.med)}x (ex-trough, before exceptional items)`],
        ['2. Sector factor', `Nine-peer pharma set's trailing P/E at the ${ASOF_TXT} close vs their five-year medians (table below): median ${pc1(sectorDrCalc)} (PLAYBOOK §7c: +8.2%; Lupin is outside the set as distorted). Pharma trades above its history, so this is a re-rating`, `${n1(HA.med)}x × ${k.toFixed(3)} = ${n1(derived)}x → **${peMult}x**`],
        ['3. Growth', `EPS before exceptional items grew ${n1(epsCagrHist)}% a year FY21-26 (a recovery from a trough plus the windfall); we forecast ${n1(epsCagrFwd)}% a year FY26-29E. The history the median was paid for had better growth than the next three years`, 'Argues lower; no adjustment in the base (§7c)'],
        ['4. Peers', `Trailing P/E on ${ASOF_TXT}: Zydus ${n1(P.ZYDUSLIFE.pe)}x, Aurobindo ${n1(P.AUROPHARMA.pe)}x, Alkem ${n1(P.ALKEM.pe)}x, Cipla ${n1(P.CIPLA.pe)}x, Sun ${n1(P.SUNPHARMA.pe)}x, Ipca ${n1(P.IPCALAB.pe)}x; Lupin ${n1(P.LUPIN.pe)}x on peak (windfall) earnings`, `${peMult}x Sep-28E = ${n1(V.tp / F.eps[1])}x our FY28E: below Sun and Cipla, near Zydus and Aurobindo`],
        ['5. Returns', `ROE ${n1(A.roe[b])}% (FY26, peak) falling to {{F.roe.1|pct}} (FY28E) vs an ${n1(keV)}% cost of equity; a Gordon-growth P/E at ${n1(roeSus)}% ROE and ${gSus}% growth is only ~${n1(justPe)}x`, 'Argues lower: sensitivity only (§7c)'],
        ['6. Street', `MOSL 22x, PL 25x, BOB 26x on EPS of ₹99-114 (FY28E). Our target is ${n1(V.tp / F.eps[1])}x our FY28E EPS and ${n1(V.tp / CONS.FY28E)}x consensus FY28E`, 'Same method; lower multiple and slightly lower EPS'],
      ],
      derivationSource: `Screener.in prices, EPS and P/E history to ${ASOF_TXT}; AR FY26 note 37 (exceptional items); peersAsOf at the NSE close; broker notes; GAM Research`,
      history: { field: 'eps', from: '2022-04-01', median: FM.median, label: `Median since Apr-2021, ex-trough (reported EPS): ${n1(FM.median)}x`, title: 'Forward P/E on reported EPS since Apr-2022 (after the trough dates)', yearStep: 1 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (${evMult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr plus net cash) gives ₹${n0(mv('ev').value)}, ${pc(mv('ev').vsTarget)} vs the target: ${evMult}x is Lupin's ${n1(HEV.med)}x forward median since 2021 times the EV/EBITDA analogue of the sector factor (${pc1(sectorEv)}). It is higher because EBITDA leaves out what has changed below it: D&A up ~₹450 cr a year (the Mirabegron licence, VISUfarma and other intangibles), the tax rate up from 22% to 27%, and ~₹9,000-13,000 cr of cash that earns 5.5% before tax but counts at face value (and the engine adds cash a year past the target date). The DCF (₹${n0(mv('dcf').value)}) is ${pc(mv('dcf').vsTarget)} vs the target: at an ${n1(keV)}% cost of equity, 5.5% terminal growth and margins fading to 22%, cash flows support less than today's price. We give the P/E answer the weight the street does, and note that two of three methods sit below the price.`,
    }),
    { exhibit: { type: 'table', title: 'The sector factor, peer by peer (trailing P/E at the 30-Sep-2026 close vs five-year median)', head: ['Company', 'P/E at 30-Sep (x)', '5-yr median (x)', 'vs median', 'Status'], wide: [4], rows: [
      ...[...PEER_SET, ...EXCL].map(drRow),
      { hl: true, cells: ['**Median of the nine used**', '', '', `**${pc1(sectorDrCalc)}**`, `PLAYBOOK factor +${SECTOR_DR}% (×${k.toFixed(3)}); all 14 others ${pc1(sectorDrAll)}; EV/EBITDA analogue (nine) ${pc1(sectorEv)}`] },
    ], source: `Screener.in (P/E charts), multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers); five-year window Sep-2021 to Sep-2026; PLAYBOOK §7c pharma set` } },
    { exhibit: { type: 'table', title: 'Sensitivity of the target (not in the base case)', head: ['View', 'Multiple / EPS', 'Target (₹)', 'vs CMP', 'Why we do not use it in the base'], wide: [4], rows: [
      ['Reported-EPS median × sector factor', `${SENS.reported}x (${n1(FM.median)}x)`, n0(val(SENS.reported)), pc((val(SENS.reported) / price - 1) * 100), 'Includes the FY26 exceptional charge in the denominator (A18 sensitivity row)'],
      ['Trough year kept in (all dates)', `${SENS.all}x (${n1(HALL.med)}x)`, n0(val(SENS.all)), pc((val(SENS.all) / price - 1) * 100), `§4: in ${TROUGH.join(', ')} the P/E ballooned to ~100x because EPS collapsed`],
      ['Pre-windfall window (forward year FY24 only)', `${SENS.pre}x (${n1(PRE.med)}x)`, n0(val(SENS.pre)), pc((val(SENS.pre) / price - 1) * 100), 'One year of data; proxy for an ex-windfall median, which cannot be built (no product data)'],
      ['All 14 other pharma names for the factor', `${SENS.allPeers}x (${pc1(sectorDrAll)})`, n0(val(SENS.allPeers)), pc((val(SENS.allPeers) / price - 1) * 100), 'Includes the distorted names (§7c)'],
      ['Five large caps (Sun, Divi\'s, Torrent, Zydus, Cipla)', `${SENS.large}x (${pc1(sectorDrLarge)})`, n0(val(SENS.large)), pc((val(SENS.large) / price - 1) * 100), 'Hand-picked sub-set (§7c)'],
      ['D&A at 7.2% of gross block (FY27E = Q1 run-rate)', `${peMult}x × ₹${n1(eps72Sep)}`, n0(val(peMult, eps72Sep)), pc((val(peMult, eps72Sep) / price - 1) * 100), 'Overstates FY28-29E D&A once the Mirabegron licence lapses'],
      ['D&A bottom-up (licence lapses Sep-2027)', `${peMult}x × ₹${n1(epsBuSep)}`, n0(val(peMult, epsBuSep)), pc((val(peMult, epsBuSep) / price - 1) * 100), 'Not possible with one engine rate; base is calibrated to the three-year total'],
      ['Returns-based (Gordon, ROE vs cost of equity)', `~${n1(justPe)}x`, n0(val(justPe)), pc((val(justPe) / price - 1) * 100), 'No returns adjustment in the base (§7c)'],
      ['Street multiples on our EPS: MOSL 22x Sep-28E / PL 25x FY28E', '22x / 25x', `${n0(val(22))} / ${n0(Math.round(25 * F.eps[1] / 10) * 10)}`, `${pc((val(22) / price - 1) * 100)} / ${pc((25 * F.eps[1] / price - 1) * 100)}`, 'Not derived; above Lupin\'s own history'],
      { hl: true, cells: ['**Base**', `**${peMult}x × ₹${n1(epsSep28)}**`, '**{{dcf.tp|num}}**', '**{{dcf.upside|chg}}**', 'Own ex-trough median before exceptional items × sector factor'] },
    ], source: `GAM Research. Lupin's own re-rating is not shown: its trailing P/E (${n1(P.LUPIN.pe)}x on peak earnings) against a five-year median inflated by loss years (${n1(MED5.LUPIN)}x) gives ${pc1(derate.LUPIN)}, which is meaningless.` } },
    { pair: [
      { type: 'line', title: `Forward P/E before exceptional items (ex-trough): ${n1(HA.med)}x median; ${n1(peFY28)}x now on FY28E`, unit: 'Price ÷ next full-year EPS before exceptional items (x)', x: fwdAdj.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdAdj.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HA.med, text: `Median ${n1(HA.med)}x` }, { v: peMult, text: `Target ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; company EPS before exceptional items; GAM estimates FY27-28E' },
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(HEV.med)}x since 2021`, unit: 'EV ÷ next full-year EBITDA (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median ${n1(HEV.med)}x` }, { v: evMult, text: `Cross-check ${evMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets (net debt at the latest March); GAM estimates FY27-28E' },
    ] },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +3pp a year, margin +2pp (EPS ₹${n1(SC.bull.eps[1])} FY28E); ${AS.valuation.blend.methods[0].multiple.bull}x (75th percentile × factor).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; US US$${X.BL.usdMn.map(n0).join(' / ')}mn; ${peMult}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −3pp a year, margin −2.5pp (EPS ₹${n1(SC.bear.eps[1])} FY28E); ${AS.valuation.blend.methods[0].multiple.bear}x (25th percentile × factor).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'], ['Cost of equity (rf 6.5% + 0.9 × 6%)', '{{dcf.ke|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed pharma peers (trailing, at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'LUPIN' ? '**Lupin**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples scaled to the NSE close on ${ASOF_TXT}; ROE on FY26 profit (Screener basis); Abbott India standalone` } },
  ],
};

module.exports = { street, valuation, risks: P5B.risks };
