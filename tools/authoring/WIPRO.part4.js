// Wipro report, part 4: street view and valuation. Risks, glossary and statement notes in part4b.
const X = require('./WIPRO.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, A, AS, n0, n1, pc, ASOF_TXT, price, mv, epsSep28, peMult, evMult, FM, H21, H16, Hpre, H2y, fwdNow, evMed, ttmEbitda, ebitdaSep28, P, derate, USED, LEFT_OUT, INCUMB, sectorDr, incDr, withTm, afterDerate, shortName, rating, ST, CONS, medTp, avgTp, tpSorted, shortDate, epsCagrHist, epsCagrFwd, b, PEERS, impliedG, dcfAt } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: mostly Reduce or Sell, targets ₹${tpSorted[0]}-${tpSorted.at(-1)}, all on P/E`,
  blocks: [
    { p: `At least 14 houses cut their targets after the Q1FY27 results on 16-Jul-2026 (Reuters: median target ₹${CONS.medianTp}, from ₹${CONS.priorMedianTp}). Of the ${ST.length} views we collected, only Nomura, Nuvama and Deven Choksey rate it a Buy; Motilal Oswal and Axis are Neutral/Hold; PL, Emkay, Choice, ICICI Securities, Elara, Kotak, Jefferies and JPMorgan are Reduce, Sell or Underperform. Targets run from ₹${tpSorted[0]} to ₹${tpSorted.at(-1)} (median ₹${n0(medTp)}, average ₹${n0(avgTp)}), set when the stock was ~₹175-178; by ${ASOF_TXT} it was ₹${n1(price)}. Every house that discloses a method uses **P/E, mostly on FY28E EPS, at 10-15x (clustered at 11-13x)**. No broker changed its view on fundamentals in Aug-Sep 2026 that we could find; JPMorgan reiterated Underweight (₹155) on 10-Sep. Bears cite the weakest growth among large peers, AI deflation, margins below the band and falling bookings; bulls cite the ~5% dividend yield, cheap valuation and margin normalisation.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, calls and filings to 30-Sep-2026' } },
  ],
};

const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const ddm = 0.88 / (V.ke / 100 - 0.05);
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('WIPRO', {
      rating,
      streetIntro: 'The brokers that disclose a method value Wipro on **P/E**: Motilal Oswal 11x, PL and Choice 12x, Axis 13x, HDFC 14x and Deven Choksey 15x on FY28E; Emkay 12x and Kotak 10x on Jun-28E. We use the same method on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our EPS for its year: the gap to the street is almost entirely the multiple, since our EPS is slightly lower than theirs.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method ? s.method.replace(/ \(.*/, '') : 'n.d.', s.multiple || '–', s.on || '–', X.rup(s.thesis)]),
      ourThesis: 'No turnaround yet, but the price assumes permanent decline; ~5% yield and net cash cap the downside',
      streetSource: 'MOSL, PL, Emkay, Choice and Deven Choksey notes (PDFs); Axis, HDFC, ICICI Securities and Elara via Business Today (17-Jul-2026); Kotak via Kotak Neo; Nomura and Jefferies via Moneycontrol; Nuvama via IndMoney; JPMorgan via Business Today (10-Sep-2026). n.d. = method not disclosed in the sources we saw',
      derivationIntro: 'We start from Wipro\'s own one-year-forward P/E since April 2021 (the house rule, leaving out trough years), cut it by how far the IT peer set had de-rated by 30-Sep-2026 (the same eight-company set for every IT report in this library), and then check growth, peers and returns.',
      derivation: [
        ['1. Its own history', `One-year-forward P/E since Apr-2021: median ${n1(FM.median)}x (25th-75th percentile ${n1(H21.p25)}-${n1(H21.p75)}x; peak ${Math.round(H21.max)}x in the 2021 boom); trough years excluded: ${FM.troughYears.length ? FM.troughYears.join(', ') : 'none (EPS never fell below half of its prior peak)'}. ${n1(Hpre.med)}x in FY17-FY20 before the boom; ${n1(H2y.med)}x over the last two years; ${n1(fwdNow)}x on ${ASOF_TXT} on our FY28E`, `Starting point: ${n1(FM.median)}x`],
        ['2. Sector de-rating', `On ${ASOF_TXT} the eight IT peers traded below their five-year median P/E: ${USED.map(drTxt).join(', ')} (median ${pc(sectorDr)}). Left out: Wipro itself (${pc(derate.WIPRO)}) and Tech Mahindra (${pc(derate.TECHM)}; its FY24-25 earnings trough distorts both its median and its current P/E; with it the median is ${pc(withTm)})`, `${n1(FM.median)}x × ${(1 + sectorDr / 100).toFixed(2)} ≈ ${n1(afterDerate)}x → **${peMult}x**`],
        ['Sensitivity: incumbents only', `TCS, Infosys, HCLTech and LTIMindtree, the firms most like Wipro, de-rated more (median ${pc(incDr)})`, `${n1(FM.median * (1 + incDr / 100))}x (₹${n0(Math.round(FM.median * (1 + incDr / 100) * epsSep28 / 5) * 5)}): our bear multiple`],
        ['3. Growth', `EPS grew ${n1(epsCagrHist)}% a year in FY21-26 (reported, with buybacks and Capco); we forecast ~${Math.round(epsCagrFwd)}% for FY26-29E on post-buyback shares. Wipro was already slow, so its slowdown is smaller than the sector's; the AI risk sits in our forecasts (dollar revenue ${n1(X.usdGrowth[0])}% / ${n1(X.usdGrowth[1])}% / ${n1(X.usdGrowth[2])}%, margins below the band)`, 'No adjustment'],
        ['4. Peers', `Trailing P/E: TCS ${n1(P.TCS.pe)}x, Infosys ${n1(P.INFY.pe)}x, HCLTech ${n1(P.HCLTECH.pe)}x, LTIMindtree ${n1(P.LTM.pe)}x; Wipro ${n1(P.WIPRO.pe)}x. Wipro traded at a 22-33% discount to TCS and Infosys on five-year medians; today 8-14%`, `${peMult}x Sep-28E = ${n1(peMult * epsSep28 / F.eps[1])}x our FY28E: above where TCS and Infosys trade today, a risk we flag`],
        ['5. Returns', `ROE ${n1(F.roe[1])}% in our FY28E against an ${n1(V.ke)}% cost of equity. Dividend-discount check: 88% payout (FY24-26 actual) ÷ (${n1(V.ke)}% − 5% growth) = ${n1(ddm)}x`, `${n1(ddm)}x would give ₹${n0(Math.round(ddm * epsSep28 / 5) * 5)}: still a BUY`],
      ],
      derivationSource: `Screener.in (P/E history to ${ASOF_TXT}, NSE closes), broker notes, GAM Research`,
      history: { field: 'eps', from: '2016-04-01', median: Math.round(FM.median), label: `Median since 2021: ${Math.round(FM.median)}x`, title: `One-year-forward P/E: our ${peMult}x vs history`, yearStep: 2 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (${evMult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr plus net cash) gives ₹${n0(mv('ev').value)}, close to the P/E target: ${evMult}x comes from Wipro's ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same ${Math.abs(Math.round(sectorDr))}% de-rating and restated for Sep-28E EBITDA being ${Math.round((ebitdaSep28 / ttmEbitda - 1) * 100)}% above the twelve months to Jun-26 (₹${n0(ttmEbitda)} cr). The DCF (₹${n0(mv('dcf').value)}) is higher still: at an ${n1(V.ke)}% cost of equity, 5% terminal growth in rupees (~3% in dollars) and an IT Services margin of ~16%, Wipro's cash flows are worth far more than the price. Turned around, the ₹${n1(price)} price is what a DCF gives if Wipro's rupee cash flows **shrink ~${Math.abs(n1(impliedG))}% a year forever** (about −4% a year in dollars). Our base case is not optimistic, but it is not that.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${V.blend.methods[0].multiple.bull}x (half the sector de-rating reverses).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `US$ revenue ${X.usdGrowth.map(g => (g >= 0 ? '+' : '') + n1(g) + '%').join(' / ')} (FY27-29E); EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${peMult}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${V.blend.methods[0].multiple.bear}x (the incumbents' ${Math.abs(Math.round(incDr))}% de-rating).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-37E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
      ['Price-implied perpetual rupee growth (same model)', `${n1(impliedG)}%`], ['DCF value with 3% perpetual rupee growth', `₹${n0(Math.round(dcfAt(3) / 5) * 5)}`],
    ], source: 'GAM Research. The DCF values operating cash flows only; treasury income is captured through net cash.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers: Indian IT services', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'WIPRO' ? '**Wipro**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; Wipro's market value on post-buyback shares. Tech Mahindra's P/E is inflated by depressed trailing earnings.` } },
  ],
};

module.exports = { street, valuation, ...require('./WIPRO.part4b') };
