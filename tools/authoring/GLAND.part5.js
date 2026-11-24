// Gland report, part 5: our forecasts vs the street (incl. the other-income build), street view and critiques, valuation.
const X = require('./GLAND.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, A, AS, BL, LINES, LEB, HB, n0, n1, pc1, rup, shortDate, b, price, mv, epsSep28, peMult, evMult, ebitdaSep28, FM21, FMA, FM24, FMS, FMS21, EXA, EX21, WKA, FYMED, FEV, FEV21, SET, EXCL, P, F5, FW, F24, K5, K5EV, KW, KWEV, K24, ownDr5, ownDrW, sectorDrAll, shortName, SENS, OIN, OI_BUILD, treasOpen, BORR, MISC, oiExFx26, oiExFx25, ttmOiExFx, avgCash26, yield26, rating, ST, br, postQ1, medTp, avgTp, nBuy, nSell, nNd, tpAbove, idir, elara, epsCagrFwd, epsCagr6, fwdNow, peFY27, ASOF_TXT, ACQ_TXT, TR25, excPct26, excPct23, streetPeAvg } = X;
const L = k => LINES[k].map(n0), g = k => BL.growth[k].map(v => pc1(v));
const h26 = HB.find(h => h.fy === 'FY26');

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: `Our forecasts: EPS +${Math.round(epsCagrFwd)}% a year to FY29E on revenue +14-17% and margins rising to 30%; close to the street, below management's ambition`,
  blocks: [
    { p: `We forecast consolidated revenue and EBITDA as one line and check them against a two-line build (base business and Cenexi). Revenue grows ${n1(AS.revenueGrowth[0])}% / ${n1(AS.revenueGrowth[1])}% / ${n1(AS.revenueGrowth[2])}% (FY27-29E) and the EBITDA margin rises from 25.3% (FY26) to ${n1(AS.ebitdaMargin[0])}% / ${n1(AS.ebitdaMargin[1])}% / ${n1(AS.ebitdaMargin[2])}%. Depreciation rises to ~₹${n0(F.dep[2])} cr with the new lines; tax falls from 27% to 25.5% as Cenexi turns profitable; payout ~25%. We forecast no forex gains. Every assumption is in the Excel model's Assumptions sheet, which recalculates this report's target price.` },
    { exhibit: { type: 'table', title: 'Two-line build (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Base business revenue', n0(h26.base), ...L('base')], ['  growth', '+10.6%', ...g('base')],
      ['  EBITDA margin', '36.5%', ...BL.ebitdaMargin.base.map(v => `${n1(v)}%`)],
      ['Cenexi revenue', n0(h26.cenexi), ...L('cenexi')], ['  growth (₹)', '+25.3%', ...g('cenexi')],
      ['  EBITDA margin', '−1.8%', ...BL.ebitdaMargin.cenexi.map(v => `${n1(v)}%`)],
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
      { hl: true, cells: ['**EBITDA (model)**', `**${n0(A.ebitda[b])}**`, '**{{F.ebitda.0|num}}**', '**{{F.ebitda.1|num}}**', '**{{F.ebitda.2|num}}**'] },
    ], source: 'Investor presentations (FY26 split); GAM estimates; the build sums to model revenue and EBITDA' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income (actuals incl. forex and exceptionals)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (net of borrowings in forecasts)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { h: 'Other income is built, not plugged' },
    { exhibit: { type: 'table', title: 'Other-income build and reconciliation (₹ crore)', head: ['', 'FY25', 'FY26', 'TTM Jun-26', 'FY27E', 'FY28E', 'Basis'], wide: [6], rows: [
      ['Interest on deposits: treasury yield × opening net cash', n1(OIN.FY25.interestDeposits + OIN.FY25.interestOther), n1(OIN.FY26.interestDeposits + OIN.FY26.interestOther), '–', n1(OI_BUILD[0].treasury), n1(OI_BUILD[1].treasury), `${AS.treasuryYield[0]}% / ${AS.treasuryYield[1]}% on ₹${n0(treasOpen[0])} cr / ₹${n0(treasOpen[1])} cr; FY26 yield ${n1(yield26)}% on average gross cash of ₹${n0(avgCash26)} cr`],
      ['Interest on cash held against Cenexi debt and leases', '(in line above)', '(in line above)', '–', n1(OI_BUILD[0].grossUp), n1(OI_BUILD[1].grossUp), `Same yield on ₹${n0(BORR)} cr (the engine nets borrowings); matching cost in interest`],
      ['Miscellaneous, investment gains, write-backs', n1(OIN.FY25.misc + OIN.FY25.gainInvestments + OIN.FY25.writeBacks), n1(OIN.FY26.misc + OIN.FY26.gainInvestments + OIN.FY26.writeBacks), '–', n1(MISC), n1(MISC), 'AR note 25: misc ₹14.8 cr, gains ₹3.3 cr (FY26)'],
      { hl: true, cells: ['**Other income ex forex**', `**${n1(oiExFx25)}**`, `**${n1(oiExFx26)}**`, `**${n1(ttmOiExFx)}**`, `**${n1(OI_BUILD[0].total)}**`, `**${n1(OI_BUILD[1].total)}**`, 'FY27E in line with FY26 and the TTM: more cash, lower deposit rates'] },
      ['Net forex gain', n1(OIN.FY25.forex), n1(OIN.FY26.forex), n1(OIN.quarterlyForex.Q2Q3FY26 + OIN.quarterlyForex.Q4FY26), '0', '0', 'Follows the rupee; not forecast (Q1FY27 loss of ₹3.6 cr sits in other expenses)'],
      ['Reported other income', n1(OIN.FY25.total), n1(OIN.FY26.total), '–', '{{F.otherIncome.0|num}}', '{{F.otherIncome.1|num}}', "Screener's FY26 line (₹292 cr) also nets the ₹24 cr Labour Codes charge"],
    ], source: 'AR FY26 note 25 (consolidated); Q1FY26-Q1FY27 presentations and calls; GAM estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs management and the street (estimates standing on 30-Sep-2026)', head: ['', 'FY27E', 'FY28E', 'FY29E', 'Comment'], wide: [4], rows: [
      ['GAM revenue growth', '{{F.salesGrowth.0|chg}}', '{{F.salesGrowth.1|chg}}', '{{F.salesGrowth.2|chg}}', `Management: ≥15% constant currency in FY27, ~20% CAGR for four years; ICICI Direct +17.2% / +16.3%; Nomura 13-15% a year`],
      ['GAM EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'Management: ~30% adjusted near term; ICICI Direct 26.6% / 27.0%; Elara (May) 26.3% / 27.7% / 28.7%'],
      { hl: true, cells: ['**GAM EPS (₹)**', '**{{F.eps.0|n1}}**', '**{{F.eps.1|n1}}**', '**{{F.eps.2|n1}}**', 'No forex gains forecast'] },
      [`ICICI Direct (${shortDate(idir.date)})`, n1(idir.eps.FY27E), n1(idir.eps.FY28E), '–', 'Buy, ₹3,150 (33x FY28E)'],
      [`Elara (${shortDate('2026-05-16')}, pre-Q1)`, n1(elara.eps.FY27E), n1(elara.eps.FY28E), n1(elara.eps.FY29E), 'Core EPS raised 5-10% after Q1; Accumulate, ₹2,956'],
      ['Implied by growth statements', '–', '~91', '~128', 'Motilal Oswal: 21% earnings CAGR FY26-28; Kotak: 27% EPS CAGR FY26-29 (applied to FY26 EPS ₹62.35)'],
    ], source: 'Broker notes and press reports of 16-May to 11-Aug-2026 as cited in deep.json; GAM Research' } },
    { callout: `**Where we could be wrong:** our FY26-29E EPS growth (~${Math.round(epsCagrFwd)}% a year) is far above Gland's ~${n1(epsCagr6)}% of FY20-26, which included the FY23 shock and Cenexi's losses. Upside: management's ~20% growth plays out, Cenexi reaches mid-teens margins and GLP-1 partners launch early (bull FY28E EPS ₹{{scen.bull.eps.1|n1}}). Downside: price erosion returns, Saudi stays lost and Cenexi stalls (bear FY28E EPS ₹{{scen.bear.eps.1|n1}}).` },
  ],
};

const tpRows = postQ1.slice().sort((a, c) => c.tp - a.tp);
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ${nBuy} of ${postQ1.length} post-results notes positive, ${nSell} Sell, ${nNd} undisclosed; median target ₹${n0(medTp)}, near the ₹${n0(price)} price`,
  blocks: [
    { p: `We found ${postQ1.length} targets dated 10-11 Aug 2026, after Q1FY27, and no September notes. The range is unusually wide: Jefferies upgraded to Buy at ₹3,350 (from ₹2,080), Nomura (Buy, 27.5x FY28-29E average EPS) and Investec are at ₹3,330, ICICI Direct at ₹3,150 (33x FY28E EPS of ₹95.4), Motilal Oswal at ₹3,080 (30x 12-month forward), Kotak Add ₹3,050, Equirus ₹2,985 (30x Sep-27E) and Elara, which downgraded to Accumulate after a ~40% three-month rise, ₹2,956. Nirmal Bang (₹2,885), 360 ONE (₹2,835), ICICI Securities (₹2,825) and IIFL (₹2,435) sit near or below the price; Goldman Sachs stays at Sell (₹2,125) and Ambit has the street's lowest target (₹1,940). The median is ₹${n0(medTp)} and the average ~₹${n0(avgTp)}; ${tpAbove} of ${postQ1.length} targets were above ₹${n0(price)} on 30-Sep. An aggregator count before the revisions showed 12 Buy, 2 Hold and 4 Sell among 18 analysts.` },
    { exhibit: { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs post-results street targets', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...tpRows.map(s => `${s.broker} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...tpRows.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press reports as cited in deep.json; GAM Research' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Calls, filings, broker notes and press to 30-Sep-2026; GAM' } },
  ],
};

const streetRows = postQ1.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method, s.multiple || null, s.on || null, rup(s.thesis).slice(0, 110)]);
const peerRow = (s, F0) => [shortName(s), n1(P[s].pe), n1(F0.med[s]), pc1(r1x(F0.dr[s])), SET.includes(s) ? 'Yes' : s === 'GLAND' ? 'Self (excluded)' : 'No'];
const r1x = x => Math.round(x * 10) / 10;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E earnings gives {{dcf.tp|inr}}, close to the price`,
  blocks: [
    ...streetBlocks('GLAND', {
      rating,
      streetIntro: `Every broker that discloses a method uses **P/E on forward EPS**: Motilal Oswal 30x 12-month forward, ICICI Direct 33x FY28E, Nomura 27.5x FY28-29E average, Equirus 30x Sep-27E, and Elara P/E on core EPS plus cash per share. We use P/E on Sep-28E EPS (half FY28E, half FY29E): the earnings the market will look at in twelve months. Their multiples average ${n1(streetPeAvg)}x.`,
      street: streetRows,
      ourThesis: 'Strong core, Cenexi turning; fairly priced on post-acquisition history',
      streetSource: 'Broker notes and press/aggregator reports as cited in deep.json; n.d. = not disclosed in the sources we saw',
      derivationIntro: `House rule (PLAYBOOK §4, §7c): the stock's own one-year-forward P/E median, leaving out trough years, times the pharma sector factor, rounded to the nearest half-turn. Gland's window starts at the Cenexi completion (${ACQ_TXT}) so that the multiple's history and our forecast EPS are both on Gland-plus-Cenexi earnings; a window shorter than five years pairs with the peers' move over the same window. No blend with Gland's own re-rating and no growth uplift; those are sensitivities below.`,
      derivation: [
        ['1. Own history (base window)', `forwardMedian from ${ACQ_TXT}: ${n1(FMA.median)}x (${FMS.n} points; 25th-75th percentile ${n1(FMS.p25)}-${n1(FMS.p75)}x; range ${n1(FMS.min)}-${n1(FMS.max)}x). By fiscal year of the date: FY24 ${n1(FYMED.FY24)}x (on FY25 EPS depressed by Cenexi's losses), FY25 ${n1(FYMED.FY25)}x, FY26 ${n1(FYMED.FY26)}x, FY27 to date ${n1(FYMED.FY27)}x`, `Starting point: ${n1(FMA.median)}x`],
        ['2. Why not since Apr-2021', `The since-2021 median is ${n1(FM21.median)}x, but before the deal the price was for standalone Gland while forward EPS from FY24 includes Cenexi's losses, and FY22's dates sat at ~${Math.round(FYMED.FY22)}x on EPS that then fell 36%. Five-year factor ×${K5} would give ${n1(FM21.median * K5)}x`, 'Sensitivity only'],
        ['3. Trough rule', `No trough years: FY25 EPS ₹${n1(TR25.eps)} stayed above half the prior three-year peak (₹${n1(TR25.half)}; FY22 ₹73.75); FY26-28 are higher. Median with every date: ${n1(FMA.medianAll)}x`, 'Nothing excluded'],
        ['4. One-offs rule', `Exceptional items inside the window are immaterial (FY26 Labour Codes ₹15 cr after tax, ${n1(excPct26)}% of profit): the median on EPS before them is ${n1(EXA.med)}x. (In the since-2021 window FY23's Athenex provision is ${n1(excPct23)}%: ${n1(EX21.med)}x before it)`, `Base stays on reported EPS, ${n1(FMA.median)}x`],
        ['5. Sector factor', `Nine pharma peers' trailing P/E vs their medians since ${ACQ_TXT}, at the ${ASOF_TXT} close: median ${pc1(FW.pe)} (each peer rounded to 0.1pt). Five-year check: ${pc1(F5.pe)} P/E, ${pc1(F5.ev)} EV/EBITDA, matching PLAYBOOK §7c (+8.2% / +7.5%)`, `${n1(FMA.median)}x × ${KW.toFixed(3)} = ${n1(FMA.median * KW)}x → **${peMult}x**`],
        ['6. Own re-rating', `Gland trades ${pc1(ownDrW)} above its own median trailing P/E since ${ACQ_TXT} (${pc1(ownDr5)} vs five years)`, 'Not blended (PLAYBOOK §7c); sensitivity row'],
        ['7. Growth and returns', `We forecast ~${Math.round(epsCagrFwd)}% EPS growth a year FY26-29E (FY20-26: ~${n1(epsCagr6)}%); ROE ${n1(F.roe[0])}-${n1(F.roe[2])}% vs an ${n1(V.ke)}% cost of equity`, 'Growth is high but starts from a depressed base, and returns only reach the cost of equity by FY29E; no uplift'],
      ],
      derivationSource: `Screener.in (prices, EPS, peer P/E histories); NSE closes on ${ASOF_TXT}; GAM Research`,
      history: { field: 'eps', from: '2021-04-01', median: FMA.median, label: `Median since ${ACQ_TXT}: ${n1(FMA.median)}x`, title: `Forward P/E: ${n1(fwdNow)}x FY28E today vs our ${peMult}x`, yearStep: 1 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA on the same basis (Gland's own one-year-forward median since ${ACQ_TXT}, ${n1(FEV.med)}x, × the peers' EV/EBITDA move over that window ${KWEV.toFixed(3)} = ${evMult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr, plus Sep-28E net cash) gives ₹${n0(mv('ev').value)}, within ${Math.abs(Math.round(mv('ev').vsTarget))}% of the target. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% lower: at an ${n1(V.ke)}% cost of equity, with working capital at ~38% of sales, fifteen years of 8-14% growth at a ~30% margin are worth less than today's price; the price needs ~${n1(X.gNeeded)}% a year for fifteen years. Like most Indian pharma, Gland trades on multiples well above what a cash-flow model supports.`,
    }),
    { exhibit: { type: 'table', title: `Sector factor over the base window, peer by peer (trailing P/E at the ${ASOF_TXT} close vs median since ${ACQ_TXT})`, head: ['Company', 'P/E now (x)', 'Median (x)', 'vs median', 'In the set?'], wide: [4], rows: [...SET, 'GLAND'].map(s => peerRow(s, FW)), source: `Screener.in P/E history (weekly, ${ACQ_TXT} to ${ASOF_TXT}), scaled to NSE closes; PLAYBOOK §7c pharma set; median of the nine ${pc1(FW.pe)} (EV/EBITDA ${pc1(FW.ev)})` } },
    { exhibit: { type: 'table', title: `Five-year sector factor, peer by peer (PLAYBOOK §7c reproduction: P/E ${pc1(F5.pe)}, EV/EBITDA ${pc1(F5.ev)})`, head: ['Company', 'P/E now (x)', '5-yr median (x)', 'vs median', 'In the set?'], wide: [4], rows: [...SET, 'GLAND'].map(s => peerRow(s, F5)), source: `Screener.in P/E history (weekly, 30-Sep-2021 to ${ASOF_TXT}), scaled to NSE closes; all 14 other names give ${pc1(sectorDrAll)}; the nine-name set governs` } },
    { exhibit: { type: 'table', title: 'Target multiple sensitivity (Sep-28E EPS ₹' + n1(epsSep28) + ')', head: ['Case', 'Multiple', 'Target (₹)', 'vs CMP', 'Basis'], wide: [4], rows: SENS.map((r, i) => (i === 0 ? { hl: true, cells: [`**${r.name}**`, `**${r.mult}x**`, `**${n0(r.tp)}**`, `**${pc1(r.up)}**`, r.why] } : [r.name, `${r.mult}x`, n0(r.tp), pc1(r.up), r.why])), source: 'GAM Research; only the first row is the house method' } },
    ...require('./GLAND.part5b').blocks,
  ],
};

module.exports = { forecasts, street, valuation };
