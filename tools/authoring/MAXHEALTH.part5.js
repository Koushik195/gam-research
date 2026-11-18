// Max Healthcare report, part 5: street view, valuation (EV/EBITDA primary on consolidated EBITDA), risks & honest summary.
const X = require('./MAXHEALTH.ctx');
const { streetBlocks } = require('./valuation-blend');
const { ruleText } = require('../../src/ratings');
const { D, F, V, A, AS, n0, n1, pc, ASOF_TXT, price, mcap, mv, evMult, ebitdaSep28, peMult, epsSep28, treasurySep28, evTarget, HEV, HEVy, evNow, evNow27, troughEv, FM, HPEA, fwdEv, fwdPeAdj, peNow,
  PEERS, P, drEv, drPe, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, allDrEv, evAfter, peAfter, peAfterRep, evBullAfter, evBearAfter, shortName, rating, buyBelow, sellAbove, ST, pl, mosl, avgPost,
  plOnOurs, ourInPl, ourOnFy28, impliedWacc, dcfAtTarget, netDebt26, epsCagrAdj, ebitdaCagrFwd, ebitdaCagrHist, shortDate, b, Q1, CONS_TO_NET } = X;
const CS = D.street.consensus;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: nearly all Buy, targets ₹1,150-1,410, all on EV/EBITDA of Network EBITDA`,
  blocks: [
    { p: `Four houses published after the Q1FY27 results: Motilal Oswal (Buy, ₹1,410; SOTP with hospitals at 33x 12-month-forward EV/EBITDA), ICICI Securities (Buy, ₹1,275), Anand Rathi (Buy, ₹1,220; 32x FY28E EV/EBITDA for hospitals) and Prabhudas Lilladher (Buy, ₹1,150; 30x FY28E EV/EBITDA), an average of ~₹${n0(avgPost)}. Antique initiated with Hold at ₹1,170 in June (30x FY28E for hospitals). The S&P Global consensus on StockAnalysis showed ${CS.analysts} analysts with an average target of ₹${n0(CS.avgTp)} (range ₹${n0(CS.lowTp)}-${n0(CS.highTp)}) on 29-Sep-2026. The stock was ~₹1,010 when the August notes came out and fell to ₹${n0(price)} by 30-Sep-2026 (−5.3% on the day of the Supreme Court's drug-markup remarks), so the street saw 14-52% upside at the as-of date. Bulls argue new towers will add EBITDA quickly at ~80% occupancy and that oncology normalises from Q3; the debate is how much of the ~4,000-bed build-out is already in the price.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(X.rup)), source: 'Broker notes, earnings calls, filings and press to 30-Sep-2026' } },
  ],
};

const drTxt = (s, m) => `${shortName(s)} ${pc(m[s])}`;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${evMult}x Sep-28E EBITDA gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('MAXHEALTH', {
      rating, noOurEps: true,
      streetIntro: 'Every dated note we found values Max on **EV/EBITDA on FY28E or 12-month-forward EBITDA**: Prabhudas Lilladher 30x, Anand Rathi 32x and Antique 30x for the hospital business, Motilal Oswal 33x; Max Lab and Max@Home are small add-ons in the SOTPs. We use the same method on the EBITDA the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). One difference matters: the street applies its multiple to **Network** EBITDA, which includes the three partner societies Max does not own, and uses Network net debt (excluding leases). We use **MHIL consolidated EBITDA** (what the shares own; Screener\'s basis, on which Max\'s and its peers\' multiple history is measured) with **lease liabilities in net debt**. Each basis is consistent on its own; the translation is in the table below.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', X.rup(s.thesis)]),
      ourThesis: 'Best-in-class franchise; returns fall during the build-out; fair value close to the price',
      streetSource: 'MOSL and PL notes (PDF); Anand Rathi via DSIJ; Antique via Business Today; ICICI Securities, Geojit and Axis via Trendlyne; Jefferies via MarketScreener snippet. n.d. = method not disclosed in what we read',
      derivationIntro: 'We start from Max\'s own one-year-forward EV/EBITDA since Apr-2021, computed in our files on the same basis as the target (EV = market value + borrowings incl. lease liabilities − cash; EBITDA consolidated, post-Ind AS), adjust for how far listed hospital peers had de-rated by 30-Sep-2026, then check growth, peers, returns and the street\'s basis.',
      derivation: [
        ['1. Its own history', `One-year-forward EV/EBITDA since Apr-2021: median ${n1(HEV.med)}x (25th-75th percentile ${n1(HEV.p25)}-${n1(HEV.p75)}x; low ${n1(HEV.min)}x in 2021, peak ${n1(HEV.max)}x in 2024); calendar medians 2021 ${n1(HEVy('2021').med)}x, 2022 ${n1(HEVy('2022').med)}x, 2023 ${n1(HEVy('2023').med)}x, 2024 ${n1(HEVy('2024').med)}x, 2025 ${n1(HEVy('2025').med)}x, 2026 ${n1(HEVy('2026').med)}x. Trough years left out: ${troughEv ? troughEv + ' points' : 'none (forward EBITDA never fell below half its prior three-year peak)'}. On ${ASOF_TXT}: ${n1(evNow)}x our FY28E, ${n1(evNow27)}x FY27E`, `Starting point: ${n1(HEV.med)}x`],
        ['2. Sector de-rating', `Trailing EV/EBITDA vs each stock's five-year median on ${ASOF_TXT}: ${CORE.map(s => drTxt(s, drEv)).join(', ')} (median ${pc(sectorDrEv)}); Max itself ${pc(drEv.MAXHEALTH)}. Left out: ${LEFT_OUT.map(s => drTxt(s, drEv)).join(', ')} (new-hospital losses and the 2024 GCC demerger inflate their current multiples); with them the median is ${pc(allDrEv)}`, `${n1(HEV.med)}x × ${(1 + sectorDrEv / 100).toFixed(3)} ≈ ${n1(evAfter)}x → **${evMult}x**`],
        ['3. Growth', `EBITDA grew ${Math.round(ebitdaCagrHist)}% a year in FY23-26 (with ~1,300 acquired beds); we forecast ~${Math.round(ebitdaCagrFwd)}% for FY26-29E with capex and leases of ~₹${n0(Math.round((F.capex[0] + F.capex[1] + F.capex[2]) / 100) * 100)} cr over three years`, 'No premium, no further discount'],
        ['4. Peers', `Trailing EV/EBITDA on ${ASOF_TXT}: Narayana ${n1(P.NH.evEbitda)}x, Jupiter ${n1(P.JLHL.evEbitda)}x, Rainbow ${n1(P.RAINBOW.evEbitda)}x, Fortis ${n1(P.FORTIS.evEbitda)}x, Apollo ${n1(P.APOLLOHOSP.evEbitda)}x, Medanta ${n1(P.MEDANTA.evEbitda)}x; Max ${n1(P.MAXHEALTH.evEbitda)}x`, `${evMult}x Sep-28E = ${n1(ourOnFy28)}x our FY28E: a premium to every large peer, as Max has always had`],
        ['5. Returns', `Company pre-tax ROCE 21.8% (FY26; ~31% for units over four years old) vs a ${n1(V.ke)}% cost of equity; reported ROE ${n1(A.roe[b])}% (merger goodwill), falling to {{F.roe.0|pct}} in FY27E before recovering to {{F.roe.2|pct}}`, 'Supports a premium, not a re-rating'],
        ['6. Street basis', `PL's 30x FY28E Network EBITDA = ~${n1(plOnOurs)}x our FY28E consolidated EBITDA (same equity value, our net debt incl. leases); our target equals ~${n1(ourInPl)}x PL's FY28E Network EBITDA`, 'Our multiple is ~10% below PL\'s and ~20% below MOSL\'s'],
      ],
      derivationSource: `Screener.in prices, balance sheets and multiples to ${ASOF_TXT}; broker notes; GAM Research`,
      crossNote: `**What the cross-checks tell us.** P/E (${peMult}x Sep-28E EPS of ₹${n1(epsSep28)}) gives ₹${n0(mv('pe').value)}: ${peMult}x is Max's ${n1(HPEA.med)}x forward P/E median since Apr-2021 on EPS before one-offs (${n1(FM.median)}x on reported EPS) cut by the ${Math.abs(Math.round(sectorDrPe))}% P/E de-rating of the same six peers. It is below the EV/EBITDA value because depreciation and interest on the new capacity weigh on earnings before the beds mature. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below the target: at an ${n1(V.ke)}% cost of capital and 6% terminal growth, 15 years of cash flows after heavy capex support well under half of today's price. Our cash flows justify the share price only at a ~${n1(impliedWacc)}% discount rate (the target needs ~${n1(dcfAtTarget)}%). That is the honest summary of hospital valuations in India in 2026: the market prices Max on scarcity and a long growth runway, not on near-term cash.`,
    }),
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA since Apr-2021: median ${n1(HEV.med)}x; our target ${evMult}x`, unit: 'EV (incl. lease liabilities) ÷ next full-year EBITDA, consolidated (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [...(Math.abs(HEV.med - evMult) >= 2 ? [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }] : []), { v: evMult, text: `Our target: ${evMult}x`, color: '#cf8f1f' }], source: 'Screener.in; GAM estimates for FY27-29E' },
      { type: 'line', title: `Forward P/E (EPS before one-offs): median ${n1(HPEA.med)}x, ${n1(peNow)}x now`, unit: 'Price ÷ next full-year EPS before one-offs (x)', x: fwdPeAdj.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPeAdj.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HPEA.med, text: `Median: ${n1(HPEA.med)}x` }, { v: peMult, text: `Cross-check: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in; company notes on one-offs; GAM estimates' },
    ] },
    ...require('./MAXHEALTH.part5b').valuationTail,
  ],
};

module.exports = { street, valuation, risks: require('./MAXHEALTH.part5b').risks };
