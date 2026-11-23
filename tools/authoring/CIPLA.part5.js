// Cipla report, part 5: street view, valuation (P/E primary, derived multiple, per-peer sector factor, cross-checks,
// sensitivities, DCF, scenarios, peers), risks & honest summary.
const X = require('./CIPLA.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, A, AS, SC, n0, n1, pc, pc1, rup, ASOF_TXT, price, mcap, mv, peMult, epsSep28, evMult, ebitdaSep27, FM, HA, HR, FWDFY, POST, fwdAdj, fwdPe, peFY27, peFY28, peSep28, peTtm,
  PEER_SYMS, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, sectorDrLarge, k, derived, shortName, SENS, val, roeSus, gSus, keV, justPe,
  HEV, ttmEbitda, evTtm, evFy28, rating, ruleText, buyBelow, sellAbove, epsCagrFwd, epsCagrRep, epsCagrHist, ST, idir, ela, postQ1, avgTp, medTp, tpLo, tpHi, buys, shortDate, Q1, b, BL } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street after Q1: ${buys} of ${postQ1.length} positive, targets ₹${n0(tpLo)}-${n0(tpHi)}, all on P/E`,
  blocks: [
    { p: `Ten houses published after the Q1FY27 results (23-27 Jul 2026). ${buys} are positive: ICICI Direct ₹1,645 (24x FY28E), ICICI Securities ₹1,610, Nirmal Bang ₹1,615 (cut from ₹1,883), JPMorgan ₹1,600, Deven Choksey ₹1,592, Axis ₹1,532 (25x FY28E) and Nomura ₹1,510. Motilal Oswal is Neutral (₹1,420), Elara Reduce (₹1,349: 19x FY28E core EPS plus cash) and Morgan Stanley Underweight (₹1,218). The average target is ₹${n0(avgTp)} (median ₹${n0(medTp)}), ${pc((avgTp / price - 1) * 100)} from the ₹${n0(price)} close on ${ASOF_TXT}; the stock was ~₹1,393-1,416 when the notes came out. Bulls argue that the US launch wave plus India's double-digit growth restore earnings in FY28; bears doubt the US run-rate and note that FY28 includes one-off exclusivities. No note dated in Aug-Sep 2026 changed a rating that we could find.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

const drRow = s => [shortName(s) + (EXCL.includes(s) ? ' (excluded)' : s === 'CIPLA' ? ' (not used)' : ''), n1(P[s].pe), n1(MED5[s]), pc1(derate[s]), EXCL.includes(s) ? rup(D.peers.excluded[s]) : s === 'CIPLA' ? 'The company itself' : 'Used'];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E EPS gives {{dcf.tp|inr}}; the DCF says the price already discounts a lot`,
  blocks: [
    ...streetBlocks('CIPLA', {
      rating,
      streetIntro: 'Every note with a disclosed method values Cipla on **P/E on FY28E EPS**: ICICI Direct 24x, Axis 25x, ICICI Securities 23x (Apr-2026), Elara 19x core EPS plus cash. We use the same method on the EPS the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E), which smooths the one-off launch exclusivities of FY28.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', rup(s.thesis)]),
      ourThesis: 'India compounds; US relaunch rebuilds earnings in FY28; cheap to own history, not to cash flows',
      streetSource: 'Elara and ICICI Direct notes (PDF); ICICI Securities Apr-2026 note (PDF); Axis Direct blog; TradeBrains (Nomura, JPMorgan, Morgan Stanley); Business Standard via search summary (Nirmal Bang); Trendlyne (dates, MOSL, Deven Choksey, PL, BOB). n.d. = not disclosed',
      derivationIntro: 'We start from Cipla\'s own one-year-forward P/E since Apr-2021, correct it for genuine exceptional items (but not for gRevlimid, a windfall rather than a one-off: PLAYBOOK §7c), apply the pharma sector factor and test the result against growth, peers, returns and the street.',
      derivation: [
        ['1. Its own history', `House forwardMedian (reported EPS): ${n1(FM.median)}x since Apr-2021, no trough years (forward EPS never fell below half its prior three-year peak). On EPS before exceptional items (FY23 goodwill impairment, FY24 Pulmazole impairment, FY26 labour-code charge and associate impairment) the median is ${n1(HA.med)}x (25th-75th percentile ${n1(HA.p25)}-${n1(HA.p75)}x; range ${n1(HA.min)}-${n1(HA.max)}x). By forward year: ${FWDFY.map(f => `${f.fy} ${n1(f.med)}x`).join(', ')}: low when the forward year carried the windfall (FY24-25), high when it did not (FY26-27)`, `Starting point: ${n1(HA.med)}x (one-offs rule)`],
        ['2. Sector factor', `Pharma peers' trailing P/E at the ${ASOF_TXT} close vs their five-year medians (table below): median of the eight-company set excluding Cipla ${pc1(sectorDr)}; with all 14 peers also ${pc1(sectorDrAll)}. Pharma trades above its history, so this is a re-rating`, `${n1(HA.med)}x × ${k.toFixed(3)} = ${n1(derived)}x → **${peMult}x**`],
        ['3. Growth', `EPS before exceptional items: ${n1(epsCagrHist)}% a year FY21-26 (incl. the windfall); we forecast ${n1(epsCagrFwd)}% a year FY26-29E (${n1(epsCagrRep)}% on reported FY26 EPS). Growth is lower than the history the median was paid for, but the median was also paid during the windfall's fade`, 'No adjustment (sensitivity only)'],
        ['4. Peers', `Trailing P/E on ${ASOF_TXT}: Zydus ${n1(P.ZYDUSLIFE.pe)}x, Aurobindo ${n1(P.AUROPHARMA.pe)}x, Alkem ${n1(P.ALKEM.pe)}x, Sun ${n1(P.SUNPHARMA.pe)}x, Ipca ${n1(P.IPCALAB.pe)}x, Abbott India ${n1(P.ABBOTINDIA.pe)}x, Torrent ${n1(P.TORNTPHARM.pe)}x, Divi's ${n1(P.DIVISLAB.pe)}x; Cipla ${n1(P.CIPLA.pe)}x on trailing (trough) earnings`, `${peMult}x Sep-28E is ${n1(V.tp / F.eps[1])}x our FY28E: below the trailing P/E of Sun, Ipca and Abbott, above Zydus and Aurobindo`],
        ['5. Returns', `ROE ${n1(A.roe[b])}% (FY26) and {{F.roe.1|pct}} (FY28E) vs an ${n1(keV)}% cost of equity; ~₹10,000 cr of cash earns ~6%. A Gordon-growth P/E at ${n1(roeSus)}% ROE and ${gSus}% growth is only ~${n1(justPe)}x`, 'Argues for a lower multiple: we show it as a sensitivity, not in the base (§7c)'],
        ['6. Street', `Buy-rated houses use 23-25x FY28E on EPS of ~₹61-69; Elara 19x core. Our target is ${n1(V.tp / F.eps[1])}x our (lower) FY28E EPS and ${n1(V.tp / idir.eps.FY28E)}x ICICI Direct's`, 'Same method; higher multiple, lower EPS'],
      ],
      derivationSource: `Screener.in prices, EPS and P/E history to ${ASOF_TXT}; company exceptional items (AR FY24, FY26); peersAsOf at the NSE close; broker notes; GAM Research`,
      history: { field: 'eps', from: '2016-04-01', median: FM.median, label: `Median since Apr-2021 (reported EPS): ${n1(FM.median)}x`, title: 'Forward P/E on reported EPS since 2016 (house series)', yearStep: 2 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (${evMult}x trailing EBITDA at the target date, ₹${n0(ebitdaSep27)} cr, plus net cash) gives ₹${n0(mv('ev').value)}, ${Math.abs(Math.round(mv('ev').vsTarget))}% below the target: ${evMult}x is Cipla's ${n1(HEV.med)}x trailing median since 2021 times the same sector factor; it ignores the ~₹800 cr of other income that P/E captures. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below the target and below today's price: at an ${n1(keV)}% cost of equity, 5.5% terminal growth and a 21% margin, Cipla's cash flows (working capital is ~33% of revenue, capex ~4.5%) support ~₹${n0(mv('dcf').value)} a share. In other words, the market, and our target, pay for a US relaunch and a sector re-rating that the cash flows alone do not justify. That is the main risk to the call.`,
    }),
    { exhibit: { type: 'table', title: 'The sector factor, peer by peer (trailing P/E at the 30-Sep-2026 close vs five-year median)', head: ['Company', 'P/E at 30-Sep (x)', '5-yr median (x)', 'vs median', 'Status'], wide: [4], rows: [
      ...[...USED, 'CIPLA', ...EXCL].map(drRow),
      { hl: true, cells: ['**Median of the eight used**', '', '', `**${pc1(sectorDr)}**`, `Factor ${k.toFixed(3)}; all 14 peers ${pc1(sectorDrAll)}; four large caps (Sun, Divi's, Torrent, Zydus) ${pc1(sectorDrLarge)}`] },
    ], source: `Screener.in (P/E charts), multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers); five-year window Sep-2021 to Sep-2026; PLAYBOOK §7c pharma set` } },
    { exhibit: { type: 'table', title: 'Sensitivity of the target to the multiple (not in the base case)', head: ['View', 'Multiple', 'Target (₹)', 'vs CMP', 'Why we do not use it in the base'], wide: [4], rows: [
      ['Reported-EPS median × sector factor', `${SENS.reported}x`, n0(val(SENS.reported)), pc((val(SENS.reported) / price - 1) * 100), 'Includes impairments and the labour-code charge in the denominator'],
      ['Post-windfall window only (forward year FY27E+, since Apr-2025)', `${SENS.post}x (${n1(POST.med)}x × ${k.toFixed(3)})`, n0(val(SENS.post)), pc((val(SENS.post) / price - 1) * 100), '18 months of data; priced on FY27 hopes our EPS does not meet. Proxy for an ex-gRevlimid median, which cannot be sourced'],
      ['Cipla\'s own re-rating instead of the sector\'s', `${SENS.own}x (${pc1(derate.CIPLA)})`, n0(val(SENS.own)), pc((val(SENS.own) / price - 1) * 100), 'House rule: sector factor only (§7c)'],
      ['Large-cap sub-set (Sun, Divi\'s, Torrent, Zydus)', `${SENS.large}x (${pc1(sectorDrLarge)})`, n0(val(SENS.large)), pc((val(SENS.large) / price - 1) * 100), 'Hand-picked sub-set (§7c)'],
      ['Returns-based (Gordon, ROE vs cost of equity)', `~${n1(justPe)}x`, n0(val(justPe)), pc((val(justPe) / price - 1) * 100), 'No returns adjustment in the base (§7c); the market has never paid this for Cipla'],
      { hl: true, cells: ['**Base**', `**${peMult}x**`, '**{{dcf.tp|num}}**', '**{{dcf.upside|chg}}**', 'Own median before exceptional items × sector factor'] },
    ], source: 'GAM Research' } },
    { pair: [
      { type: 'line', title: `Forward P/E before exceptional items: ${n1(HA.med)}x median, ${n1(peFY28)}x now on FY28E`, unit: 'Price ÷ next full-year EPS before exceptional items (x)', x: fwdAdj.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdAdj.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HA.med, text: `Median ${n1(HA.med)}x` }, { v: peMult, text: `Target ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; company EPS before exceptional items; GAM estimates FY27-28E' },
      { type: 'line', title: `Trailing EV/EBITDA: median ${n1(HEV.med)}x since 2021`, unit: 'EV ÷ trailing EBITDA (x), Screener', x: X.S.charts.evEbitda['EV Multiple'].filter(([d]) => d >= '2021-04-01' && d <= X.ASOF).map(x => x[0]), series: [{ name: 'EV/EBITDA', values: X.S.charts.evEbitda['EV Multiple'].filter(([d]) => d >= '2021-04-01' && d <= X.ASOF).map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median ${n1(HEV.med)}x` }, { v: evMult, text: `Cross-check ${evMult}x`, color: '#cf8f1f' }], source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +3pp a year, margin +1.5pp (EPS ₹${n1(SC.bull.eps[1])} FY28E); ${V.blend.methods[0].multiple.bull}x (75th percentile).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; US $${BL.usdMn.join(' / ')}mn; ${peMult}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −3pp a year, margin −2pp (EPS ₹${n1(SC.bear.eps[1])} FY28E); ${V.blend.methods[0].multiple.bear}x (25th percentile).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'], ['Cost of equity (rf 6.5% + 0.8 × 6%)', '{{dcf.ke|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed pharma peers (trailing, at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'CIPLA' ? '**Cipla**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples scaled to the NSE close on ${ASOF_TXT}; ROE on FY26 profit (Screener basis)` } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: own the Indian franchise and the US option, but size it for the DCF',
  blocks: [
    { callout: '**What you are buying:** India\'s respiratory leader and a top-three domestic franchise growing ~10-12%, a solid South African business, ~₹9,500 cr of net cash, and a US business that is rebuilding from a windfall-driven peak with a credible inhaler and peptide pipeline. Accounts are clean; the family is a minority holder and the company is professionally run.' },
    { callout: `**What you are paying:** ${n1(peFY28)}x our FY28E EPS and ${n1(peSep28)}x Sep-28E, below Cipla's ${n1(HA.med)}x forward median, at a time when pharma peers trade above theirs. On the street's method and our (below-street) inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The DCF (₹${n0(mv('dcf').value)}) is the counter-argument: on cash flows alone the stock is fully priced, so the upside depends on the US launches arriving and on the market continuing to pay a growth multiple for pharma.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['gSymbicort and the peptide approved in FY27, limited competition', 'Medium', 'USFDA approvals; US revenue run-rate above $220mn a quarter'],
      ['Pithampur classified VAI and the warning letter lifted', 'Low-medium', 'Response to the seven observations; re-filings from Indore'],
      ['India Rx keeps beating the market by 2pp+', 'Medium-high', 'IQVIA monthly data; chronic share above 61%'],
      ['Capital returned or a value-adding US/Europe acquisition', 'Low', 'Use of ₹9,500 cr of cash'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['US approvals slip into FY28, or rivals enter gVentolin and gAdvair fast', 'Medium', 'US stuck near $650-700mn; bear case {{scen.bear.tp|inr}}'],
      ['FY27 margin below the 18.5% floor (war costs, launch delays)', 'Medium', 'Each 1pp ≈ ₹310 cr of EBITDA in FY27E'],
      ['New regulatory action (Pithampur OAI, import alert at another partner)', 'Medium', 'Delays filings; write-offs'],
      ['India price controls or a weak acute season', 'Low-medium', 'India growth nearer 8% than 11%'],
      ['NPPA liability crystallises (₹2,011 cr)', 'Low', '~₹25 a share'],
      ['Sector de-rating reverses (pharma back to its five-year medians)', 'Medium', 'At 24.5x the target would be ~₹' + n0(val(24.5))],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would stay buyers below ~₹${n0(buyBelow)}** and turn sellers above ~₹${n0(sellAbove)} on today's numbers; we would cut the multiple if the US run-rate is still below $200mn a quarter after Q3FY27.`,
      `**Biggest swing factors:** US launches and FY28 margin. Every $50mn of US revenue is ~₹190 cr of EBITDA (~₹${n0(190 * 0.74 / F.shares * peMult)} a share at ${peMult}x); every 1pp of FY28E margin ~₹${n0(F.sales[1] / 100 * 0.74 / F.shares * peMult)} a share.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'EBITDA margin, Q1FY27', v: `${Q1.ebitdaMarginPct}%`, d: 'guided 18.5-20% for FY27' },
      { k: 'US revenue, Q1FY27', v: `$${Q1.naUsdMn}mn`, d: 'goal ~$250mn a quarter by Q4FY27' },
      { k: 'India growth, Q1FY27', v: `+${Q1.indiaGrowthPct}%`, d: 'Rx +15.4% vs market ~13.6%' },
      { k: 'Forward P/E (FY28E)', v: `${n1(peFY28)}x`, d: `median ${n1(HA.med)}x before one-offs` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, valuation, risks };
