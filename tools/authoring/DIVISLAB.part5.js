// Divi's report, part 5: our forecasts vs the street (incl. the other-income build), street view and critiques, valuation.
const X = require('./DIVISLAB.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, A, AS, n0, n1, pc, pc1, rup, shortDate, b, price, mv, epsSep28, peMult, evMult, ebitdaSep28, BL, LINES, FM, FMS, preExcMed, exCovidMed, FYMED, preCovidMed, FEV, SET, EXCL, CDMO, P, MED5, derate, dr1, sectorDr, sectorDrRaw, sectorDrAll, K, ownDr, shortName, SENS, OIN, openNet26, oiFY27, oiExFx26, ttmOiExFx, avgCash26, yield26, rating, ST, br, postQ1, medTp, avgTp, avgEps, nBuy, nHold, nSell, epsCagr10, epsCagrFwd, fwdNow, ASOF_TXT, FY22EPS, FY24EPS, PEERS } = X;
const L = k => LINES[k].map(n0), g = k => BL.growth[k].map(v => pc1(v));

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS +18% a year to FY29E, 5-10% below the post-results street because we fade the Q1 margin and forecast no forex gains',
  blocks: [
    { p: `We forecast consolidated revenue as one line and check it against a three-line build. FY27E revenue rises ${n1(AS.revenueGrowth[0])}% (Q1 +28%, then ~16% as the currency tailwind fades); FY28-29E grow ${n1(AS.revenueGrowth[1])}% and ${n1(AS.revenueGrowth[2])}% as the dedicated projects start. EBITDA margin ${n1(AS.ebitdaMargin[0])}% / ${n1(AS.ebitdaMargin[1])}% / ${n1(AS.ebitdaMargin[2])}%. Depreciation rises to ~₹${n0(F.dep[2])} cr with the new plants; tax 24.5%; payout keeps the dividend near ₹30-33. Every assumption is in the Excel model's Assumptions sheet, which recalculates this report's target price.` },
    { exhibit: { type: 'table', title: 'Three-line revenue build (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Custom synthesis', n0(BL.base.cs), ...L('cs')], ['  growth', '+20.5%', ...g('cs')],
      ['Generic APIs (ex-nutraceuticals)', n0(BL.base.generics), ...L('generics')], ['  growth', '+1.3%', ...g('generics')],
      ['Nutraceuticals', n0(BL.base.nutra), ...L('nutra')], ['  growth', '+21.1%', ...g('nutra')],
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
    ], source: 'Company split and nutraceutical revenue (FY26); GAM estimates; the build sums to model revenue' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income (actuals incl. forex and exceptionals)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (net of borrowings in forecasts)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { h: 'Other income is built, not plugged' },
    { exhibit: { type: 'table', title: 'Other-income build and reconciliation (₹ crore)', head: ['', 'FY25', 'FY26', 'TTM Jun-26', 'FY27E', 'Basis'], wide: [5], rows: [
      ['Interest on deposits (treasury)', OIN.FY25.interest, OIN.FY26.interest, '~284', n0(oiFY27.treasury), `FY27E: ${AS.treasuryYield[0]}% on opening net cash of ₹${n0(openNet26)} cr; FY26 yield ${n1(yield26)}% on average cash of ₹${n0(avgCash26)} cr`],
      ['Miscellaneous and fair-value gains', OIN.FY25.misc + OIN.FY25.fvChange + OIN.FY25.redemptionGain, OIN.FY26.misc + OIN.FY26.fvChange, '–', n0(oiFY27.misc), 'AR note 17: misc ₹8 cr, fair value ₹4 cr (FY26)'],
      { hl: true, cells: ['**Other income ex forex**', `**${OIN.FY25.total - OIN.FY25.forex}**`, `**${oiExFx26}**`, `**${n0(ttmOiExFx)}**`, `**${n0(oiFY27.total)}**`, 'FY27E below FY26: lower deposit yields after the 2025 rate cuts and cash spent on capex'] },
      ['Net forex gain', OIN.FY25.forex, OIN.FY26.forex, '165', '0', 'Follows the rupee; not forecast'],
      ['Reported other income', OIN.FY25.total, OIN.FY26.total, '–', n0(oiFY27.total), 'Screener\'s FY26 line (₹433 cr) also nets the ₹74 cr Labour Codes charge'],
    ], source: "AR FY26 note 17 (standalone); quarter-end cash and forex from the Q1FY26-Q1FY27 calls; GAM estimates" } },
    { exhibit: { type: 'table', title: 'GAM vs management and the street (estimates standing on 30-Sep-2026)', head: ['', 'FY27E', 'FY28E', 'FY29E', 'Comment'], wide: [4], rows: [
      ['GAM revenue growth', '{{F.salesGrowth.0|chg}}', '{{F.salesGrowth.1|chg}}', '{{F.salesGrowth.2|chg}}', 'Management: "double-digit growth no matter what"; PL +19.0% / +17.2%; JM +20.4% / +24.4%; HDFC +22.0% / +20.4%'],
      ['GAM EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'Management: "similar as last year" (32.6%); PL 35.5% / 36.1%; HDFC 36.6% / 37.5%; JM 38.3% / 38.5%'],
      { hl: true, cells: ['**GAM EPS (₹)**', '**{{F.eps.0|n1}}**', '**{{F.eps.1|n1}}**', '**{{F.eps.2|n1}}**', 'No forex gains forecast'] },
      [`PL (${shortDate(br('Prabhudas Lilladher').date)})`, '119.5', '142.0', '–', 'Accumulate, ₹8,600'],
      [`JM Financial (${shortDate(br('JM Financial').date)})`, '127.5', '156.1', '–', 'Buy, ₹9,510'],
      [`HDFC Securities (${shortDate(br('HDFC Securities').date)})`, '125.7', '155.6', '184.3', 'Buy, ₹9,230'],
      ['Average of the three', n1(avgEps('FY27E')), n1(avgEps('FY28E')), '–', `GAM is ${Math.round((1 - F.eps[0] / avgEps('FY27E')) * 100)}% / ${Math.round((1 - F.eps[1] / avgEps('FY28E')) * 100)}% below`],
    ], source: 'Broker notes of 3-Aug-2026 (PL PDF, JM Financial, HDFC Securities Results Daily); GAM Research' } },
    { callout: `**Where we could be wrong:** our FY26-29E EPS growth (~${n1(epsCagrFwd)}% a year) is double Divi's ~${n1(epsCagr10)}% of FY16-26. Upside risk: the dedicated projects and peptide fragments ramp faster, the Q1 margin proves sticky, and the rupee stays weak, which is close to our bull case (FY28E EPS ₹{{scen.bull.eps.1|n1}}). Downside: approvals slip a year and the inventory gain reverses (bear FY28E EPS ₹{{scen.bear.eps.1|n1}}).` },
  ],
};

const tpRows = postQ1.slice().sort((a, c) => c.tp - a.tp);
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ${nBuy} Buy, ${nHold} Hold, ${nSell} Sell after Q1FY27; median target ₹${n0(medTp)}, below the ₹${n0(price)} price`,
  blocks: [
    { p: `We found ${postQ1.length} notes dated 31-Jul to 4-Aug-2026, after Q1FY27. Citi is highest (Buy, ₹11,700; GLP-1 and complex oral peptides from CY27), then Jefferies and Macquarie (₹10,200), JM Financial (₹9,510, 41x FY28E EV/EBITDA), HDFC Securities (₹9,230, 39x Q1FY29E EV/EBITDA, "56.5x P/E"), Morgan Stanley (₹9,111) and JPMorgan (₹9,100). The cautious end: PL Accumulate ₹8,600, DRChoksey Hold ₹8,521, Systematix Hold ₹7,959, Motilal Oswal Neutral ₹7,720 (55x 12-month forward EPS: "limited upside from current valuations") and ICICI Securities, which downgraded to Sell at ₹6,500. The average is ~₹${n0(avgTp)} and the median ₹${n0(medTp)}; the stock then rose another ~10-15% in August-September to ₹${n0(price)}. Pre-results calls still standing include BOBCAPS Hold ₹7,500 (56x Mar-28E), Ambit Sell ₹6,230 and Kotak Sell ₹5,850. We found no September notes.` },
    { exhibit: { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs post-results street targets', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...tpRows.map(s => `${s.broker} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...tpRows.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and Reuters/press reports as cited in deep.json; GAM Research' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Calls, filings, broker notes and press to 30-Sep-2026; GAM' } },
  ],
};

const meth = s => (s.method === 'n.d.' ? 'n.d.' : s.method);
const streetRows = [...postQ1, br('BOB Capital Markets')].map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, meth(s), s.multiple || null, s.on || null, rup(s.thesis).slice(0, 110)]);
const peerRow = s => [shortName(s), n1(P[s].pe), n1(MED5[s]), pc1(dr1(s)), SET.includes(s) ? 'Yes' : s === 'DIVISLAB' ? 'Self (excluded)' : `No: ${D.peers.excluded[s].split(';')[0].split(':')[0]}`];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E earnings gives {{dcf.tp|inr}}, below the price`,
  blocks: [
    ...streetBlocks('DIVISLAB', {
      rating,
      streetIntro: `Brokers that disclose a method mostly use **P/E on forward EPS**: Motilal Oswal 55x 12-month forward, BOBCAPS 56x Mar-28E, JPMorgan P/E (55x Mar-28E at its 2025 initiation), PL's target equals ~61x FY28E. JM Financial, HDFC Securities and Macquarie use EV/EBITDA, which for a debt-free company is nearly the same yardstick (HDFC's 39x is 56.5x P/E). We use P/E on Sep-28E EPS (half FY28E, half FY29E): the earnings the market will look at in twelve months.`,
      street: streetRows,
      ourThesis: 'Great franchise, but the price runs ahead of the history-derived multiple',
      streetSource: 'Broker notes and press/aggregator reports as cited in deep.json; n.d. = method not disclosed in the sources we saw',
      derivationIntro: `House rule (PLAYBOOK §4, §7c): Divi's own one-year-forward P/E median since Apr-2021, leaving out trough years, times the pharma sector factor, rounded to the nearest half-turn. No blend with Divi's own re-rating and no growth uplift; those are sensitivities below.`,
      derivation: [
        ['1. Own history', `forwardMedian since Apr-2021: ${n1(FM.median)}x (${FMS.n} points; 25th-75th percentile ${n1(FMS.p25)}-${n1(FMS.p75)}x; range ${n1(FMS.min)}-${n1(FMS.max)}x). By fiscal year of the date: FY22 ${n1(FYMED.FY22)}x, FY23 ${n1(FYMED.FY23)}x, FY24 ${n1(FYMED.FY24)}x, FY25 ${n1(FYMED.FY25)}x, FY26 ${n1(FYMED.FY26)}x, FY27 to date ${n1(FYMED.FY27)}x. Before Covid (FY17-20) it was ~${n1(preCovidMed)}x`, `Starting point: ${n1(FM.median)}x`],
        ['2. Trough rule', `No trough years: forward EPS never fell below half the prior three-year peak. FY23 (₹68.7) and FY24 (₹${n1(FY24EPS)}) stayed above half of FY22's Covid-boosted ₹${n1(FY22EPS)} (₹${n1(FY22EPS / 2)}). Median with every year: ${n1(FM.medianAll)}x`, 'Nothing excluded'],
        ['3. One-offs rule', `Exceptional items are small (FY26 Labour Codes ₹55 cr after tax): the median on EPS before them is ${n1(preExcMed)}x. Molnupiravir and other Covid products were a limited-competition windfall, not a §4 one-off (PLAYBOOK §7c), so the base keeps reported EPS; leaving out the Covid-priced dates (from Apr-2022) gives ${n1(exCovidMed)}x`, `Base stays ${n1(FM.median)}x; both variants shown as sensitivities`],
        ['4. Sector factor', `Pharma peers' trailing P/E vs their five-year medians at the ${ASOF_TXT} close (eight-name set, excluding Divi's): median ${pc1(sectorDr)} (each peer rounded to 0.1pt; ${pc1(sectorDrRaw)} unrounded; ${pc1(sectorDrAll)} with all 14 names). Pharma trades above its history, so the factor lifts the multiple`, `${n1(FM.median)}x × ${K} = ${n1(FM.median * K)}x → **${peMult}x**`],
        ['5. Own re-rating', `Divi's itself trades ${pc1(ownDr)} above its five-year median trailing P/E (${n1(P.DIVISLAB.pe)}x vs ${n1(MED5.DIVISLAB)}x)`, 'Not blended (PLAYBOOK §7c); sensitivity row'],
        ['6. Growth and returns', `We forecast ~${n1(epsCagrFwd)}% EPS growth a year FY26-29E vs ~${n1(epsCagr10)}% in FY16-26; ROE ~17-18% vs an ${n1(V.ke)}% cost of equity`, 'Supports a premium multiple, which the history already contains; no uplift'],
      ],
      derivationSource: `Screener.in (prices, EPS, peer P/E histories); NSE closes on ${ASOF_TXT}; GAM Research`,
      history: { field: 'eps', from: '2019-04-01', median: FM.median, label: `Median since Apr-2021: ${n1(FM.median)}x`, title: `Forward P/E: ${n1(fwdNow)}x FY28E today vs our ${peMult}x`, yearStep: 1 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA on the same basis (Divi's own one-year-forward median since 2021, ${n1(FEV.med)}x, × ${K} = ${evMult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr, plus net cash) gives ₹${n0(mv('ev').value)}, within ${Math.abs(Math.round(mv('ev').vsTarget))}% of the target: the two yardsticks agree. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% lower: at an ${n1(V.ke)}% cost of equity, with working capital at ~44% of sales and capex fading only to 8% of sales, 15 years of ~9-14% growth do not come close to today's price. The market is paying for a much longer runway, or a much lower discount rate, than a DCF can justify. That is common for Indian CDMOs, but it means the price rests on the multiple holding.`,
    }),
    { exhibit: { type: 'table', title: `Sector factor, peer by peer (trailing P/E at the ${ASOF_TXT} close vs five-year median)`, head: ['Company', 'P/E now (x)', '5-yr median (x)', 'vs median', 'In the set?'], wide: [4], rows: [...SET, 'DIVISLAB', ...EXCL].map(peerRow), source: 'Screener.in P/E history (weekly, 30-Sep-2021 to 30-Sep-2026), scaled to NSE closes; PLAYBOOK §7c pharma set' } },
    { exhibit: { type: 'table', title: 'Target multiple sensitivity (Sep-28E EPS ₹' + n1(epsSep28) + ')', head: ['Case', 'Multiple', 'Target (₹)', 'vs CMP', 'Basis'], wide: [4], rows: SENS.map((r, i) => (i === 0 ? { hl: true, cells: [`**${r.name}**`, `**${r.mult}x**`, `**${n0(r.tp)}**`, `**${pc1(r.up)}**`, r.why] } : [r.name, `${r.mult}x`, n0(r.tp), pc1(r.up), r.why])), source: 'GAM Research; only the first row is the house method' } },
    ...require('./DIVISLAB.part5b').blocks,
  ],
};

module.exports = { forecasts, street, valuation };
