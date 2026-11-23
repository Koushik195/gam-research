// Laurus Labs report, part 5: our forecasts vs the street (incl. the other-income and interest builds), street view
// and critiques, valuation (street table, multiple derivation, sector factor, sensitivities).
const X = require('./LAURUSLABS.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, A, AS, n0, n1, pc, pc1, rup, shortDate, b, price, mv, epsSep28, peMult, evMult, ebitdaSep28, BL, LINES, KEYS, YRS, FM, FMS, EXM, FYMED, FYMED_ALL, postBustMed, boomMed, FEV, SET, EXCL, P, MED5, MED5EV, derate, derateEv, r1, sectorDr, sectorDrRaw, sectorDrAll, sectorEv, sectorEvRaw, K, KEV, ownDr, shortName, SENS, OIN, OI_BUILD, oiExFx26, ttmOi, intBuild, loans, KD, OTHER_FIN, netDebtCo, lev, rating, ST, br, postQ1, medTp, avgTp, avgEps, withEps, nBuy, nHold, nSell, aboveCmp, epsCagrFwd, salesCagr10, fwdNow, peSep, ASOF_TXT, FY21EPS, FY23EPS, FY24EPS, FY25EPS, FY22EPS, evAnalogueBase, epsExc } = X;
const LBL = { cdmo: 'CDMO small molecules', bio: 'Laurus Bio', api: 'Generic API', fdf: 'Formulations (FDF)' };
const L = k => LINES[k].map(n0), g = k => BL.growth[k].map(v => pc1(v));
const g26 = { cdmo: '+38.0%', bio: '+15.0%', api: '+12.6%', fdf: '+25.6%' };

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS +25% a year to FY29E, in line with the street; the debate is the multiple, not the earnings',
  blocks: [
    { p: `We forecast consolidated revenue as one line and check it against a four-line build. FY27E revenue +${n1(AS.revenueGrowth[0])}% (CDMO +${BL.growth.cdmo[0]}% on the Q1 run-rate, generics +${n1((F.sales[0] - LINES.cdmo[0] - LINES.bio[0]) / (BL.base.api + BL.base.fdf) * 100 - 100)}%); FY28-29E +${n1(AS.revenueGrowth[1])}% and +${n1(AS.revenueGrowth[2])}% as new CDMO capacity fills. EBITDA margin ${n1(AS.ebitdaMargin[0])}% / ${n1(AS.ebitdaMargin[1])}% / ${n1(AS.ebitdaMargin[2])}%. Depreciation rises to ~₹${n0(F.dep[2])} cr; interest ~₹185-200 cr; tax 25%; payout 12%. Every assumption is in the Excel model's Assumptions sheet, which recalculates this report's target price.` },
    { exhibit: { type: 'table', title: 'Four-line revenue build (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ...KEYS.flatMap(k => [[LBL[k], n0(BL.base[k]), ...L(k)], ['  growth', g26[k], ...g(k)]]),
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
      ['CDMO (incl. Bio), % of revenue', `${n1((BL.base.cdmo + BL.base.bio) / A.sales[b] * 100)}%`, ...YRS.map((_, i) => `${n1(X.cdmoShare(i))}%`)],
    ], source: 'Q4FY26 presentation (FY26); GAM estimates; the build sums to model revenue' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income (actuals incl. exceptionals)', ref: 'fin.otherIncome' },
      { name: 'Net profit (attributable)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (net of borrowings in forecasts)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { h: 'Other income and interest are built, not plugged' },
    { exhibit: { type: 'table', title: 'Other-income build and reconciliation (₹ crore)', head: ['', 'FY25', 'FY26', 'TTM Jun-26', 'FY27E', 'FY28E', 'Basis'], wide: [6], rows: [
      ['Interest on deposits and others', OIN.FY25.interest, OIN.FY26.interest, '–', n1(OI_BUILD[0].interest + 1.6), n1(OI_BUILD[1].interest), 'Gross cash ~₹110 cr plus deposits; FY27E includes ~₹1.6 cr in Q1'],
      ['Miscellaneous and write-backs', n1(OIN.FY25.misc + OIN.FY25.writeBacks), n1(OIN.FY26.misc + OIN.FY26.writeBacks), '–', n1(OI_BUILD[0].misc + 2.6), n1(OI_BUILD[1].misc), 'FY25-26 average ~₹8.8 cr a year; FY27E includes Q1'],
      ['Net forex gain', OIN.FY25.forex, OIN.FY26.forex, '–', '5.0', '0', 'Q1FY27 ₹5 cr (CFO); not forecast after'],
      ['Land / PPE gain (Screener: exceptional)', OIN.FY25.ppeGain, '0', '0', '0', '0', 'FY25 land sale to the KRKA JV'],
      { hl: true, cells: ['**Total other income**', `**${n1(OIN.FY25.total)}**`, `**${n1(OIN.FY26.total)}**`, `**${n0(ttmOi)}**`, `**${n0(AS.otherIncome[0])}**`, `**${n0(AS.otherIncome[1])}**`, 'FY27E below TTM: no forex gains after Q1 and FY26\'s high miscellaneous income not repeated'] },
    ], source: 'AR FY26 notes 18 and 23A; Screener quarterly other income; Q1FY27 call; GAM estimates (FY27E total = Q1 actual ₹9.2 cr + Q2-Q4 build)' } },
    { exhibit: { type: 'table', title: 'Interest build (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Term + working-capital loans, year end', n0(loans[0]), ...loans.slice(1).map(n0)],
      [`Interest at ${KD}% on average loans + ~₹${OTHER_FIN} cr other`, '171 (actual)', ...intBuild.map(n0)],
      ['Interest in the model', '171', ...AS.interest.map(n0)],
      ['Net debt (company basis), year end', n0(netDebtCo[0]), ...netDebtCo.slice(1).map(n0)],
      ['Net debt ÷ EBITDA', `${lev[0].toFixed(2)}x`, ...lev.slice(1).map(x => `${x.toFixed(2)}x`)],
    ], source: 'AR FY26 note 23B (₹150.6 cr on average loans of ₹2,546 cr = 5.9%); loans follow the model\'s net debt plus ~₹110 cr cash and ₹309 cr investments, less ₹121 cr leases' } },
    { exhibit: { type: 'table', title: 'GAM vs management and the street (estimates standing on 30-Sep-2026)', head: ['', 'FY27E', 'FY28E', 'FY29E', 'Comment'], wide: [4], rows: [
      ['GAM revenue growth', '{{F.salesGrowth.0|chg}}', '{{F.salesGrowth.1|chg}}', '{{F.salesGrowth.2|chg}}', 'Street FY27E revenue ₹8,189-8,470 cr (MOSL, ICICI Sec, BOBCAPS, Choice)'],
      ['GAM EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'Management ">30% from FY27+" (own basis); Choice 27.7%, MOSL 28.6%, ICICI Sec 29.3%, BOBCAPS 32.0%'],
      { hl: true, cells: ['**GAM EPS (₹)**', '**{{F.eps.0|n1}}**', '**{{F.eps.1|n1}}**', '**{{F.eps.2|n1}}**', 'No forex gains or exceptionals forecast'] },
      ...withEps.map(s => [`${s.broker} (${shortDate(s.date)})`, n1(s.eps.FY27E), n1(s.eps.FY28E), s.eps.FY29E ? n1(s.eps.FY29E) : '–', `${s.rating}, ₹${n0(s.tp)}`]),
      [`Average of the ${withEps.length}`, n1(avgEps('FY27E')), n1(avgEps('FY28E')), '–', `GAM is ${pc1((F.eps[0] / avgEps('FY27E') - 1) * 100)} / ${pc1((F.eps[1] / avgEps('FY28E') - 1) * 100)} vs the average`],
    ], source: 'Broker notes of 24-27 Jul-2026 (MOSL, ICICI Direct, Choice, BOBCAPS PDFs); GAM Research' } },
    { callout: `**Where we could be wrong:** our FY26-29E EPS growth (~${n1(epsCagrFwd)}% a year) assumes the CDMO run-rate holds and capacity fills. Upside: Phase III programmes convert faster, a peptide contract lands, Laurus Bio's plant fills (bull FY28E EPS ₹{{scen.bull.eps.1|n1}}). Downside: launch stocking pauses as the FY23 order did, ARV prices fall (bear FY28E EPS ₹{{scen.bear.eps.1|n1}}).` },
  ],
};

const tpRows = postQ1.slice().sort((a, c) => c.tp - a.tp);
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ${nBuy} positive, ${nHold} Hold, ${nSell} Sell after Q1FY27; median target ₹${n0(medTp)}, below the ₹${n0(price)} price`,
  blocks: [
    { p: `We found ${postQ1.length} broker views dated 24-29 Jul-2026, after Q1FY27. InCred is highest (Add, ₹1,990, upgraded from Hold) with Motilal Oswal (Buy, ₹1,980, 65x 12-month forward EPS), then ICICI Securities (Buy, ₹1,890, 38x FY28E EV/EBITDA), DRChoksey (Accumulate, ₹1,830) and DAM Capital (Buy, ₹1,820). The cautious end: BOBCAPS Hold ₹1,708 (55x Jun-28E EPS: "all optimism baked in to valuations"), Choice Add ₹1,705 (PEG 1.7x), Jefferies Hold ₹1,700 and Kotak Sell ₹1,125. The average is ~₹${n0(avgTp)} and the median ₹${n0(medTp)}; the stock then rose a further ~24%, from ₹1,601 on results day to ₹${n0(price)}, so only ${aboveCmp} of the ${postQ1.length} targets reach the price. Pre-results calls still standing include HDFC Securities Reduce ₹1,040 (26x Q3FY28E EV/EBITDA, Jan-2026) and Sharekhan Hold ₹1,101 (47x FY28E EPS, Mar-2026). LSEG showed 13 analysts with a 'hold' average and a ₹1,045 median target in May-2026. We found no September notes.` },
    { exhibit: { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs post-results street targets', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...tpRows.map(s => `${s.broker} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...tpRows.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press/aggregator reports as cited in deep.json; GAM Research' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Calls, filings, broker notes and press to 30-Sep-2026; GAM' } },
  ],
};

const meth = s => (s.method === 'n.d.' ? 'n.d.' : s.method === 'PEG (P/E)' ? 'P/E' : s.method);
const streetRows = [...postQ1, br('HDFC Securities'), br('Sharekhan (Mirae Asset)')].map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, meth(s), s.method === 'PEG (P/E)' ? 'PEG 1.7x' : s.multiple || null, s.on || null, rup(s.thesis).slice(0, 110)]);
const peerRow = s => [shortName(s), n1(P[s].pe), n1(MED5[s]), pc1(r1(derate[s])), n1(P[s].evEbitda), n1(MED5EV[s]), pc1(r1(derateEv[s])), SET.includes(s) ? 'Yes' : s === 'LAURUSLABS' ? 'No: self (and boom-bust)' : `No: ${D.peers.excluded[s].split(/[;:(]/)[0].trim()}`];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E earnings gives {{dcf.tp|inr}}, far below the price`,
  blocks: [
    ...streetBlocks('LAURUSLABS', {
      rating,
      streetIntro: `Brokers that disclose a method mostly use **P/E on forward EPS**: Motilal Oswal 65x 12-month forward, BOBCAPS 55x Jun-28E, Choice a PEG of 1.7x (P/E relative to growth) and Sharekhan 47x FY28E (Mar-2026). ICICI Securities (38x FY28E) and HDFC Securities (26x Q3FY28E, Jan-2026) use EV/EBITDA; five others do not disclose. P/E is the majority, 4 to 2. We use P/E on Sep-28E EPS (half FY28E, half FY29E): the earnings the market will look at in twelve months.`,
      street: streetRows,
      ourThesis: 'Real transformation; the price runs far ahead of the history-derived multiple',
      streetSource: 'Broker notes and press/aggregator reports as cited in deep.json; n.d. = method not disclosed in the sources we saw',
      derivationIntro: `House rule (PLAYBOOK §4, §7c): Laurus's own one-year-forward P/E median since Apr-2021, leaving out trough years, times the pharma sector factor, rounded to the nearest half-turn. Exceptional items are material in FY25 (the land-sale gain was 11% of profit), so, as in the A18 batch, the base median uses EPS before exceptional items and the reported-EPS median is a sensitivity. No blend with Laurus's own re-rating and no growth uplift; those are sensitivities below.`,
      derivation: [
        ['1. Own history', `Median since Apr-2021 on EPS before exceptional items: ${n1(EXM.med)}x (${EXM.n} points; 25th-75th percentile ${n1(EXM.p25)}-${n1(EXM.p75)}x). By fiscal year of the date: FY22 ${n1(FYMED.FY22)}x, FY25 ${n1(FYMED.FY25)}x, FY26 ${n1(FYMED.FY26)}x, FY27 to date ${n1(FYMED.FY27)}x. House forwardMedian on reported EPS: ${n1(FM.median)}x`, `Starting point: ${n1(EXM.med)}x`],
        ['2. Trough rule', `Dates priced on FY24 and FY25 EPS are left out: FY24 EPS ₹${n1(FY24EPS)} and FY25 ₹${n1(epsExc[2025])} (₹${n1(FY25EPS)} reported) were below half the prior three-year peak (FY21 ₹${n1(FY21EPS)}, then FY22 ₹${n1(FY22EPS)}). Those dates traded at ${n1(FYMED_ALL.FY23)}x and ${n1(FYMED_ALL.FY24)}x; with every date the median is ${n1(EXM.all)}x`, 'FY24 and FY25 excluded'],
        ['3. One-offs and the boom', `EPS before exceptional items removes the FY25 land-sale gain (₹39 cr after tax) and the FY26 PPE loss; the base moves ${n1(EXM.med - FM.median).replace("-", "−")}x. The FY21-23 ARV/Covid boom and the FY23 order were windfalls, not §4 one-offs, so the base keeps them; leaving out the boom-priced dates (using only dates from Apr-2024) gives ${n1(postBustMed)}x, and the boom-year dates alone ${n1(boomMed)}x: the history is stable either way`, `Base ${n1(EXM.med)}x; variants shown as sensitivities`],
        ['4. Sector factor', `Nine-peer pharma set's trailing P/E vs five-year medians at the ${ASOF_TXT} close: median ${pc1(sectorDr)} (per peer rounded to 0.1pt; +${sectorDrRaw.toFixed(2)}% unrounded). Laurus is outside the set, so the full nine-peer median applies (PLAYBOOK §7c). All 14 other pharma names give ${pc1(sectorDrAll)} (sensitivity)`, `${n1(EXM.med)}x × ${K} = ${n1(EXM.med * K)}x → **${peMult}x**`],
        ['5. Own re-rating', `Laurus trades ${pc1(ownDr)} above its five-year median trailing P/E (${n1(P.LAURUSLABS.pe)}x vs ${n1(MED5.LAURUSLABS)}x), the most in the sector`, 'Not blended (PLAYBOOK §7c); sensitivity row'],
        ['6. Growth and returns', `We forecast ~${n1(epsCagrFwd)}% EPS growth a year FY26-29E (from a recovering base) and ROE ~20-23% vs a ${n1(V.ke)}% cost of capital; revenue grew ~${n1(salesCagr10)}% a year in FY16-26`, 'Supports a premium, which the history already contains (it includes the FY21-22 growth years); no uplift'],
      ],
      derivationSource: `Screener.in (prices, EPS, exceptional items, peer P/E histories); NSE closes on ${ASOF_TXT}; GAM Research`,
      history: { field: 'eps', from: '2019-04-01', median: EXM.med, label: `Median since Apr-2021 (troughs out): ${n1(EXM.med)}x`, title: `Forward P/E: ${n1(fwdNow)}x FY28E today vs our ${peMult}x`, yearStep: 1, min: 0 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA on the same basis (Laurus's own one-year-forward median since 2021, ${n1(FEV.med)}x with the FY24 trough left out, × ${K} = ${evMult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr, less net debt; the EV/EBITDA analogue of the sector factor, ${pc1(sectorEv)}, gives the same ${evAnalogueBase}x) gives ₹${n0(mv('ev').value)}, within ${Math.abs(Math.round(mv('ev').vsTarget))}% of the target: the two yardsticks agree. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% lower: at a ${n1(V.ke)}% cost of capital, with working capital at ~33% of sales and capex at 14-24% of sales to FY29E, fifteen years of 8-13% growth support far less than the price. To justify ₹${n0(price)} on cash flows, revenue would have to grow ~${n1(X.gNeeded)}% a year for fifteen years. The market is paying for a much longer and faster runway than any cash-flow model of today's business supports.`,
    }),
    { exhibit: { type: 'table', title: `Sector factor, peer by peer (trailing multiples at the ${ASOF_TXT} close vs five-year medians)`, head: ['Company', 'P/E now (x)', '5-yr median P/E', 'vs median', 'EV/EBITDA now', '5-yr median EV/EBITDA', 'vs median', 'In the set?'], wide: [7], rows: [...SET, 'LAURUSLABS', ...EXCL].map(peerRow), source: `Screener.in P/E and EV-multiple histories (weekly, 30-Sep-2021 to 30-Sep-2026), scaled to NSE closes; nine-peer medians: P/E ${pc1(sectorDr)}, EV/EBITDA ${pc1(sectorEv)} (PLAYBOOK §7c)` } },
    { exhibit: { type: 'table', title: 'Target multiple sensitivity (Sep-28E EPS ₹' + n1(epsSep28) + ')', head: ['Case', 'Multiple', 'Target (₹)', 'vs CMP', 'Basis'], wide: [4], rows: SENS.map((r, i) => (i === 0 ? { hl: true, cells: [`**${r.name}**`, `**${r.mult}x**`, `**${n0(r.tp)}**`, `**${pc1(r.up)}**`, r.why] } : [r.name, `${r.mult}x`, n0(r.tp), pc1(r.up), r.why])), source: 'GAM Research; only the first row is the house method' } },
    ...require('./LAURUSLABS.part5b').blocks,
  ],
};

module.exports = { forecasts, street, valuation };
