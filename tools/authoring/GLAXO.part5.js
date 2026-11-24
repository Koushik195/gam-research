// GSK India report, part 5: street view, valuation (P/E primary on the street's method; multiple = own forward median since
// Apr-2021 on EPS before one-offs x the pharma sector factor for names outside the set; EV/EBITDA and DCF cross-checks;
// sensitivities; scenarios; peers), risks & honest summary.
const X = require('./GLAXO.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, AS, SC, n0, n1, pc, pc1, pc2, rup, ASOF_TXT, price, mv, sep, FM, HB, HR, HRA, HBW, FWDFY, sBaseWk, troughRows, peFY27, peFY28, peSep28, peTtm, fwdNowVsMed, medOf,
  PEERS, P, MED5, MED5EV, derate, derateEv, SET, EXCL, sectorCalc, sectorEv, sectorAll, SET_FACTOR, SET_FACTOR_EV, FACTOR_DIFF, FACTOR_DIFF_EV, k, kev, ownDr, sectorLarge, shortName, half,
  MULT, derived, epsSep, val, epsCagrHist, epsCagrFwd, keV, roeSus, gSus, justPe, pegWin, SENS, evHist, HEV, HEVS, EVM, evTtmNow, ebitdaT27, treasT27,
  rating, ruleText, buyBelow, sellAbove, ST, mosl, isec, nb, withTp, medTp, divYield, fcfYield, moslAtOurs, nbAtOurs, shortDate, Q1, netCash26, TR, PATCH, debtLikePs, innovShare } = X;
const r10 = v => Math.round(v / 10) * 10;
const vsCmp = v => pc((v / price - 1) * 100);
const all16 = medOf([...SET, ...EXCL, 'GLAXO'].map(s => derate[s]).filter(v => v != null)), SENS16 = half(HB.med * (1 + all16 / 100));
const minRatio = Math.min(...troughRows.map(t => t.baseRatio));

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: thin coverage, targets ₹${n0(Math.min(...withTp.map(s => s.tp)))}-${n0(Math.max(...withTp.map(s => s.tp)))}; both houses that disclose a method use P/E`,
  blocks: [
    { p: `Few houses publish on GSK India. Three notes were standing on ${ASOF_TXT}. **Motilal Oswal** (3-Aug-2026, after Q1FY27) rates it Neutral with a ₹${n0(mosl.tp)} target (cut from ₹${n0(mosl.prevTp)}), valuing it at 35x 12-month forward EPS; it models 14% revenue growth, margins rising to 37% and 18% EPS growth a year to FY28E, but sees "limited upside". **ICICI Securities** (institutional, 9-Nov-2025) upgraded to Hold with a ₹${n0(isec.tp)} target after the fire-hit Q2FY26; we could read only a listing and a press summary, and its method is not disclosed; we found no later ICICI Securities note dated by 30-Sep-2026. **Nirmal Bang** (29-Aug-2025) put a Buy and ₹${n0(nb.tp)} on 50x FY27E EPS, arguing GSK plc's India focus had re-rated the stock into a 33-53x band; the note is 13 months old. The median target is ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} from ₹${n0(price)}. The debate is whether the innovation portfolio can lift growth enough to justify a high-30s multiple on a business that has grown 5-6% a year.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(([a, w]) => [rup(a), rup(w)]), source: 'Broker notes, annual reports, call transcripts and filings to 30-Sep-2026' } },
  ],
};

const drRow = s => [shortName(s) + (EXCL.includes(s) ? ' (excluded)' : s === 'GLAXO' ? ' (the company itself)' : ''), n1(P[s].pe), n1(MED5[s]), pc1(derate[s]), n1(P[s].evEbitda), n1(MED5EV[s]), pc1(derateEv[s]), EXCL.includes(s) ? rup(D.peers.excluded[s]) : s === 'GLAXO' ? 'Outside the set; own de-rating used only as a sensitivity' : 'Used'];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; history and peers say fair-to-cheap, the DCF says expensive`,
  blocks: [
    ...streetBlocks('GLAXO', {
      rating,
      streetIntro: `Both notes standing on 30-Sep-2026 that disclose a method value GSK India on **P/E**: Motilal Oswal 35x 12-month forward EPS, Nirmal Bang 50x FY27E. We use the same method on the EPS a buyer will look at in September 2027 (**Sep-28E: half FY28E, half FY29E**, ₹${n1(epsSep.base)}). Because GSK India's history is full of large one-offs, the multiple is derived on EPS before them (our forecasts carry none); the reported-EPS medians are sensitivity rows.`,
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.broker === 'Motilal Oswal' ? '12-month forward EPS (≈FY28E)' : (s.on || '–'), rup(s.thesis)]),
      ourThesis: 'Base business back to 8-10% growth; innovation compounds from 7% of sales; cash-rich, high payout',
      streetSource: 'Motilal Oswal results update (3-Aug-2026, PDF); Nirmal Bang monthly pick (29-Aug-2025, PDF); ICICI Securities institutional (9-Nov-2025: Trendlyne listing and press summary). Superseded: Motilal Oswal ₹3,000 (Aug-2025), ICICI Securities Sell ₹2,600 (May-2025). n.d. = not disclosed',
      derivationIntro: `We start from GSK India's own one-year-forward P/E since Apr-2021 on EPS before one-offs (house sampling and median), apply the pharma sector factor set in PLAYBOOK §7c for names outside the nine-company set (+${SET_FACTOR}%, the median of all nine) and round to the nearest half-turn. GSK India's own de-rating and its slower growth are sensitivities, not part of the base (§7c).`,
      derivation: [
        ['1. Its own history', `Every 5th weekly close since Apr-2021 (${HB.n} points), price ÷ next year's EPS before one-offs: median **${n1(HB.med)}x** (25th-75th percentile ${n1(HB.p25)}-${n1(HB.p75)}x; range ${n1(HB.min)}-${n1(HB.max)}x). No trough years on this basis (forward EPS was never below ${Math.round(minRatio * 100)}% of its prior three-year peak). The house forwardMedian on reported EPS is ${n1(FM.median)}x: it drops FY23-24 as "troughs" only because FY22's reported EPS (₹100) includes the ₹77.56 a share brand-sale gain (ratio ${troughRows[0].repRatio.toFixed(2)} and ${troughRows[1].repRatio.toFixed(2)}); without that exclusion reported EPS gives ${n1(HRA.med)}x. By forward year: ${FWDFY.map(f => `${f.fy} ${n1(f.med)}x`).join(', ')}`, `Starting point: ${n1(HB.med)}x`],
        ['2. Sector factor', `Median of the nine pharma-set names' trailing P/E at the ${ASOF_TXT} close vs their five-year medians (table below): **+${SET_FACTOR}%** (PLAYBOOK §7c, A21, for names outside the set; our reproduction ${pc2(sectorCalc)}; all 15 other names ${pc2(sectorAll)}; with GSK India itself in a 16-name set ${pc2(all16)}). Pharma trades above its history, so this is a re-rating`, `${n1(HB.med)}x × ${k} = ${n1(derived)}x → **${MULT.base}x**`],
        ['3. Growth', `EPS before one-offs grew ${n1(epsCagrHist)}% a year FY21-26, almost all from margin expansion; we forecast ${n1(epsCagrFwd)}% a year FY26-29E, from revenue. The median was paid for faster EPS growth than we now expect, but for slower revenue growth`, 'Mixed; no adjustment in the base (§7c), sensitivity below'],
        ['4. Peers', `Trailing P/E on ${ASOF_TXT}: Divi's ${n1(P.DIVISLAB.pe)}x, Torrent ${n1(P.TORNTPHARM.pe)}x, Abbott India ${n1(P.ABBOTINDIA.pe)}x, Ipca ${n1(P.IPCALAB.pe)}x, Sun ${n1(P.SUNPHARMA.pe)}x, Cipla ${n1(P.CIPLA.pe)}x, Alkem ${n1(P.ALKEM.pe)}x; GSK India ${n1(P.GLAXO.pe)}x (${pc1(ownDr)} vs its own five-year median of ${n1(MED5.GLAXO)}x)`, `${MULT.base}x Sep-28E = ${n1(V.tp / F.eps[1])}x our FY28E: a premium to Abbott India and Sun, below Torrent and Divi's`],
        ['5. Returns', `ROE ~${Math.round(F.roe[1])}% (FY28E; inflated by the 90% payout); cost of equity ${n1(keV)}%. A Gordon-growth P/E at ${n1(roeSus)}% ROE and ${gSus}% growth is ~${n1(justPe)}x`, 'The Gordon P/E is below the market\'s history: sensitivity only'],
        ['6. Street', `Motilal Oswal 35x 12-month forward (≈FY28E), Nirmal Bang 50x FY27E. Our target is ${n1(V.tp / F.eps[1])}x our FY28E EPS (₹${n1(F.eps[1])}) and ${n1(V.tp / mosl.eps.FY28E)}x Motilal Oswal's (₹${n1(mosl.eps.FY28E)})`, 'Same method; higher multiple, lower EPS than Motilal Oswal'],
      ],
      derivationSource: `Screener.in prices; annual reports (EPS before one-offs); peersAsOf at the NSE close; broker notes; GAM Research (computed in GLAXO.ctx.js)`,
      history: { field: 'eps', from: '2021-04-01', median: FM.median, label: `House median (reported EPS, FY23-24 dropped): ${n1(FM.median)}x`, title: 'Forward P/E on reported EPS since Apr-2021 (house series, before trough exclusion)', yearStep: 1 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA: GSK India's own trailing EV/EBITDA since Apr-2021 (market value less company net cash after each August dividend, over operating EBITDA) has a median of ${n1(HEV.med)}x (Screener's own series ${n1(HEVS.med)}x); times the EV/EBITDA factor for names outside the set (+${SET_FACTOR_EV}%) that is ${EVM.base}x, worth ₹${n0(mv('ev').value)} on trailing EBITDA at the target date, ${pc(mv('ev').vsTarget)} vs the target. It agrees that, against its own history, the stock is not expensive: GSK India trades at ${n1(evTtmNow)}x trailing EBITDA today. The DCF (₹${n0(mv('dcf').value)}, ${pc(mv('dcf').vsTarget)} vs the target and ${vsCmp(mv('dcf').value)} vs the price) disagrees: at an ${n1(keV)}% cost of equity and 6% terminal growth, cash flows that yield ~${n1(fcfYield)}% today do not support the current price, and deducting the ₹${n0(PATCH.X)} cr of tax and legal provisions would take another ~₹${n0(debtLikePs)} a share off. The market (and our target) price GSK India as a safe, high-return franchise with a growth option at a low discount rate; if growth stalls near 6-7%, the multiple has room to fall. That is the main risk to the call.`,
    }),
    { exhibit: { type: 'table', title: `The sector factor, peer by peer (trailing multiples at the ${ASOF_TXT} close vs five-year medians)`, head: ['Company', 'P/E (x)', '5-yr median (x)', 'vs median', 'EV/EBITDA (x)', '5-yr median (x)', 'vs median', 'Status'], wide: [7], rows: [
      ...[...SET].sort((a, c) => derate[c] - derate[a]).map(drRow), drRow('GLAXO'), ...EXCL.map(drRow),
      { hl: true, cells: ['**Median of the nine set names**', '', '', `**${pc2(sectorCalc)}**`, '', '', `**${pc2(sectorEv)}**`, `Set factors +${SET_FACTOR}% (P/E) and +${SET_FACTOR_EV}% (EV/EBITDA, cross-check only)${FACTOR_DIFF || FACTOR_DIFF_EV ? '; reproduction differs' : '; reproduction matches'}`] },
    ], source: `Screener.in P/E and EV/EBITDA charts, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js); five-year window Sep-2021 to Sep-2026; PLAYBOOK §7c pharma set` } },
    { exhibit: { type: 'table', title: 'Sensitivity of the target to the multiple (not in the base case)', head: ['View', 'Multiple', 'Value (₹)', 'vs CMP', 'Why we do not use it in the base'], wide: [4], rows: [
      ['House forwardMedian on reported EPS (FY23-24 dropped as troughs) × factor', `${SENS.house}x (${n1(FM.median)}x)`, n0(val(SENS.house)), vsCmp(val(SENS.house)), 'The "troughs" are created by the FY22 one-off gain, not by weak earnings; one-offs are material (A18 practice)'],
      ['Reported EPS, no trough exclusion × factor', `${SENS.repAll}x (${n1(HRA.med)}x)`, n0(val(SENS.repAll)), vsCmp(val(SENS.repAll)), 'Reported EPS mixes in exceptional items'],
      ['All weekly closes instead of every 5th week', `${SENS.allWeeks}x (${n1(HBW.med)}x)`, n0(val(SENS.allWeeks)), vsCmp(val(SENS.allWeeks)), 'House function samples every 5th week'],
      ['No sector factor (own median only)', `${SENS.noFactor}x`, n0(val(SENS.noFactor)), vsCmp(val(SENS.noFactor)), 'House rule applies the sector factor'],
      [`GSK India's own de-rating (${pc1(ownDr)}) instead of the sector's`, `${SENS.own}x`, n0(val(SENS.own)), vsCmp(val(SENS.own)), 'House rule: sector factor only, no own de-rating (§7c)'],
      [`Midpoint of sector (+${SET_FACTOR}%) and own (${pc1(ownDr)})`, `${SENS.mid}x`, n0(val(SENS.mid)), vsCmp(val(SENS.mid)), 'No blending (§7c)'],
      [`All 16 names incl. GSK India (${pc1(all16)})`, `${SENS16}x`, n0(val(SENS16)), vsCmp(val(SENS16)), 'The nine-name set governs (§7c)'],
      ['Large-cap sub-set (Sun, Divi\'s, Torrent, Zydus)', `${SENS.large}x (${pc1(sectorLarge)})`, n0(val(SENS.large)), vsCmp(val(SENS.large)), 'Hand-picked sub-set (§7c)'],
      [`Growth-adjusted: PEG held at its window level (${n1(pegWin)}x × ${n1(epsCagrFwd)}% growth)`, `${SENS.peg}x`, n0(val(SENS.peg)), vsCmp(val(SENS.peg)), 'Window EPS growth was margin-driven; no growth adjustment in the base (§7c)'],
      [`Returns-based (Gordon: ROE ${n1(roeSus)}%, g ${gSus}%, Ke ${n1(keV)}%)`, `${SENS.gordon}x`, n0(val(SENS.gordon)), vsCmp(val(SENS.gordon)), 'No returns adjustment in the base (§7c)'],
      ['Street on our EPS: Motilal Oswal 35x FY28E / Nirmal Bang 50x FY27E', '35x / 50x', `${n0(r10(moslAtOurs))} / ${n0(r10(nbAtOurs))}`, `${vsCmp(moslAtOurs)} / ${vsCmp(nbAtOurs)}`, 'Street multiples are judgement calls, not derived'],
      ['Today\'s forward P/E held', `${n1(peSep28)}x Sep-28E`, n0(r10(peSep28 * epsSep.base)), '0%', 'By construction: the price already assumes it'],
      { hl: true, cells: ['**Base**', `**${MULT.base}x**`, '**{{dcf.tp|num}}**', '**{{dcf.upside|chg}}**', 'Own forward median (EPS before one-offs) × sector factor'] },
    ], source: 'GAM Research (GLAXO.ctx.js)' } },
    { pair: [
      { type: 'line', title: `Forward P/E since Apr-2021: median ${n1(HB.med)}x, ${n1(peFY28)}x now on FY28E`, unit: 'Price ÷ next full-year EPS before one-offs (x), every weekly close', x: sBaseWk.map(x => x[0]), series: [{ name: 'Forward P/E', values: sBaseWk.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HB.med, text: `Median ${n1(HB.med)}x` }, { v: MULT.base, text: `Target ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; EPS before one-offs FY23-26 (annual reports), GAM estimates FY27-28E' },
      { type: 'line', title: `Own EV/EBITDA: median ${n1(HEV.med)}x since Apr-2021, ${n1(evTtmNow)}x now`, unit: 'Market value less company net cash ÷ trailing operating EBITDA (x)', x: evHist.map(x => x[0]), series: [{ name: 'EV/EBITDA', values: evHist.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median ${n1(HEV.med)}x` }, { v: EVM.base, text: `Cross-check ${EVM.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and quarterly margins; AR net cash (Mar-22 to Mar-26; Mar-20/21 approximated) less each August dividend; GAM' },
    ] },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +3pp a year, margin +1.5pp (EPS ₹${n1(SC.bull.eps[1])} FY28E); ${MULT.bull}x (75th percentile × factor).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −3pp a year, margin −2pp (EPS ₹${n1(SC.bear.eps[1])} FY28E); ${MULT.bear}x (25th percentile × factor). If the market instead holds today's ${n1(peSep28)}x Sep-28E, the bear value is ~₹${n0(r10(peSep28 * epsSep.bear))}.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'], ['Cost of equity (rf 6.5% + 0.8 × 6%)', '{{dcf.ke|pct}}'],
      ['Memo: tax balances and long-dated provisions not deducted', `₹${n0(PATCH.X)} cr (~₹${n0(debtLikePs)} a share)`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: `Listed pharma peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'GLAXO' ? '**GSK India**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), derate[p.symbol] == null ? '–' : pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js); ROE on FY26 profit (Screener basis); Mankind has no five-year median (listed May-2023). MNC peers Pfizer and Sanofi India not on file (see gaps)` } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a trusted franchise with a real growth option, priced near its history; the upside needs the launches to deliver',
  blocks: [
    { callout: `**What you are buying:** India's #2 MNC drug maker: brands doctors have trusted for decades (Augmentin, Calpol, T-Bact, Ceftum, Betnovate), the leading private vaccine business, and first access in India to GSK plc's patented pipeline (Shingrix, Nucala, Jemperli; Blenrep, Arexvy, bepirovirsen next). ROE ~45%, no debt, ₹${n0(X.netCashCo)} cr of net cash, a ~${n1(divYield)}% dividend yield and no royalty to the parent. **What you are not buying:** pricing power (~40% of sales price-controlled), a presence in chronic therapies, a record of double-digit growth, or control over the pipeline and assets, which sit with GSK plc.` },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(peTtm)}x trailing EPS, ${n1(peFY27)}x FY27E, ${n1(peFY28)}x FY28E and ${n1(peSep28)}x Sep-28E: FY28E is ${Math.abs(Math.round(fwdNowVsMed))}% below the ${n1(HB.med)}x forward median since 2021, while pharma peers trade ${SET_FACTOR}% above theirs. On the street's method and our EPS (below Motilal Oswal's), the house multiple of ${MULT.base}x gives {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating} under our rule. The DCF (₹${n0(mv('dcf').value)}) says the opposite. The honest reading: the stock is reasonably priced against its own history and its sector only if revenue really compounds at 10%+; the history was made while margins rose 14 points, and that lever is spent.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Q2-Q3FY27 base-business growth of 9-10% on a normal base', 'Medium', 'Quarterly revenue; IQVIA evolution indices'],
      [`Innovation above our ${n1(innovShare(0))}% of FY27E sales (management: 10-15%)`, 'Medium', 'Innovation % in decks; Blenrep and Arexvy uptake'],
      ['Bepirovirsen approval with a government partnership', 'Low-medium', 'Regulatory news; pricing'],
      ['Margins above 35% without starving launches', 'Low-medium', 'Gross margin and selling-cost ratio'],
      ['Special dividend or higher payout from ₹2,755 cr of cash', 'Low', 'May-2027 dividend declaration'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['General medicines slip back to 3-5% growth (price control, generics, supply)', 'Medium', 'Bear case: revenue −3pp a year'],
      ['Another supply disruption at a contract manufacturer', 'Low-medium', '₹25-30 cr of sales a quarter in FY26'],
      ['New NLEM list adds large brands', 'Low-medium', 'Price cuts on part of ~60% of uncontrolled sales'],
      ['Launches ramp slowly in a self-pay market; patient-assistance costs rise', 'Medium', 'Innovation share stuck near 7-8%; margin pressure'],
      ['De-rating persists: Motilal Oswal\'s 35x on our FY28E', 'Medium', `~₹${n0(r10(moslAtOurs))} (${vsCmp(moslAtOurs)})`],
      ['Related-party terms: higher transfer prices from GSK Biologicals; asset sales to the group', 'Low', 'Gross margin; one-offs'],
      ['Falling deposit rates', 'Medium', 'Each 1pp on ~₹2,800 cr ≈ ₹1.2 of EPS (~1.6%)'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The rule gives BUY below ~₹${n0(buyBelow)}** (where upside to our target is 15%), HOLD up to ~₹${n0(sellAbove)} and SELL above, on today's numbers.`,
      `**Biggest swing factor: the multiple.** Each 1x on the P/E is ~₹${n0(epsSep.base)} a share; the own-de-rating sensitivity (${SENS.own}x) would put fair value at ~₹${n0(val(SENS.own))}, below today's price. Each 1pp of FY28-29E EBITDA margin is ~₹${n1((F.sales[1] + F.sales[2]) / 2 / 100 * (1 - AS.taxRate[1] / 100) / X.SHARES)} of Sep-28E EPS (~₹${n0((F.sales[1] + F.sales[2]) / 2 / 100 * (1 - AS.taxRate[1] / 100) / X.SHARES * MULT.base)} a share at ${MULT.base}x).`,
      '**Position size:** the upside depends on delivery that GSK India has promised before and missed; we would build a position in steps around quarterly results (Q2FY27 first) and treat the DCF gap as the reason not to chase the stock above ~₹3,000.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Revenue growth, Q1FY27', v: `+${Q1.revenueGrowthPct}%`, d: '9-10% underlying; FY26 +1.9%' },
      { k: 'Innovation share of sales', v: `${Q1.innovationSharePct}%`, d: `vs ${Q1.innovationSharePrevPct}% a year earlier` },
      { k: 'Net cash', v: `₹${n0(X.netCashCo)} cr`, d: '~6% of market value; no royalty' },
      { k: 'Forward P/E (FY28E)', v: `${n1(peFY28)}x`, d: `median ${n1(HB.med)}x since Apr-2021` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, valuation, risks };
