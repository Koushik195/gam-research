// Fortis report, part 5: street view, valuation (SOTP primary: hospitals and Agilus on EV/EBITDA), risks & honest summary.
const X = require('./FORTIS.ctx');
const { streetBlocks } = require('./valuation-blend');
const { ruleText } = require('../../src/ratings');
const { D, F, V, A, AS, n0, n1, pc, ASOF_TXT, price, mcap, mv, SP, pHosp, pEsop, pDiag, pMin, pNet, hospMult, diagMult, peMult, epsSep28, hospSep28, diagSep28, esopSep28, ebitdaSep28,
  HEV, HEVbook, HEVy, troughEv, evNow, evNow27, evNowSep28, evToday, FM, fwdEv, fwdPe, peNow, peNow27, HPE, P, PEERS, DPEERS, drEv, drPe, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, allDrEv, diagDrEv,
  evAfter, peAfter, shortName, PFW, pfCore, ourFy28Equiv, rating, buyBelow, sellAbove, ST, mosl, isec, pl, avgPost, netDebtSep27, isecOnOurs, moslOnOurs, buyoutFwd, AGILUS, nciImplied, shortDate, b, Q1 } = X;
const ebitdaCagrFwd = (Math.pow(F.ebitda[2] / A.ebitda[b], 1 / 3) - 1) * 100, ebitdaCagrHist = (Math.pow(A.ebitda[b] / A.ebitda[b - 3], 1 / 3) - 1) * 100;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: five Buys and a Neutral, targets ₹1,030-1,150, all far above the price`,
  blocks: [
    { p: `Four houses published after the Q1FY27 results. Motilal Oswal (Buy, ₹1,130; 30x hospitals and 23x diagnostics on 12-month-forward EV/EBITDA), ICICI Securities (upgraded to Buy, ₹1,075; 27x / 24x FY28E) and Prabhudas Lilladher (Buy, ₹1,120; 30x FY28E hospital EBITDA plus the Agilus stake) all use a sum of the parts; Nomura stayed Neutral (₹1,030). MOSL and ICICI Securities kept their calls after the Delhi High Court ordered the forensic audit (4 and 6-Sep-2026), calling it "neutral to operations" and "an overhang on price". The post-Q1 average target is ₹${n0(avgPost)}: ${pc((avgPost / price - 1) * 100)} from the ₹${n0(price)} close on ${ASOF_TXT}, after the stock fell 19% from end-July. The bull case everyone shares: ~2,000 brownfield beds, 25% margins by FY28 and an Agilus recovery. We found no Sell, and no consensus dated before 30-Sep-2026.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, earnings calls, court reports and filings to 30-Sep-2026' } },
    { callout: `**Where we differ:** not on revenue but on the multiple. Applying ICICI Securities' multiples (27x / 24x FY28E) to our own estimates gives ~₹${n0(isecOnOurs)} a share and MOSL's (30x / 23x) ~₹${n0(moslOnOurs)}: the street's targets are mostly the multiple. Listed hospital peers traded at a median ~${n1(pfCore)}x FY28E EBITDA on ${ASOF_TXT}, and Fortis's own forward multiple has averaged ~${n1(HEV.med)}x since 2021. A 27-30x multiple assumes a re-rating that the sector was moving away from in September 2026.` },
  ],
};

const drTxt = (s, m) => `${shortName(s)} ${pc(m[s])}`;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: sum of the parts gives {{dcf.tp|inr}} ({{dcf.upside|chg}}): the stock prices in more than the business delivers`,
  blocks: [
    ...streetBlocks('FORTIS', {
      rating, noOurEps: true,
      streetIntro: 'Every post-Q1 note with a disclosed method values Fortis on a **sum of the parts**: hospitals and diagnostics on separate EV/EBITDA multiples, less net debt, with the Agilus stake at Fortis\'s 88%. We do the same, on Sep-28E EBITDA (half FY28E, half FY29E: what the market will look at in September 2027), with three things done explicitly that brokers often skip: the ESOP charge is capitalised at the hospital multiple, the 11.68% Agilus minority is deducted, and lease liabilities are in net debt (EBITDA is post-Ind AS, as reported).',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', X.rup(s.thesis)]),
      ourThesis: 'Good hospitals, but priced above peers and its own history while the legal overhang returns and margins disappoint the target',
      streetSource: 'MOSL and PL notes (PDF); ICICI Securities via Trendlyne, Moneycontrol and DSIJ summaries; Nomura via Whalesbook (10-Aug-2026); Geojit and Axis Direct via Trendlyne. n.d. = method not disclosed',
      derivationTitle: `Our multiples: ${hospMult}x hospitals, ${diagMult}x Agilus, and why`,
      derivationIntro: 'We start from Fortis\'s own one-year-forward EV/EBITDA since Apr-2021 (computed in our files: EV = market value + borrowings incl. leases − cash and investments + minorities; EBITDA of the next full fiscal year, actual then our estimates), cut it by how far listed hospital peers had de-rated by 30-Sep-2026, and check the result against peers\' forward multiples, growth and returns. Agilus is anchored on the price Fortis itself paid for 31% of it and on listed diagnostics peers.',
      derivation: [
        ['1. Fortis\'s own history', `One-year-forward EV/EBITDA since Apr-2021: median ${n1(HEV.med)}x with minorities at the value implied by the FY25 Agilus buyout (${n1(HEVbook.med)}x with minorities at book); 25th-75th percentile ${n1(HEV.p25)}-${n1(HEV.p75)}x; calendar medians 2021 ${n1(HEVy('2021').med)}x, 2022 ${n1(HEVy('2022').med)}x, 2023 ${n1(HEVy('2023').med)}x, 2024 ${n1(HEVy('2024').med)}x, 2025 ${n1(HEVy('2025').med)}x, 2026 ${n1(HEVy('2026').med)}x. Trough years: ${troughEv ? troughEv + ' points' : 'none (forward EBITDA never fell below half its prior three-year peak)'}. On ${ASOF_TXT}: ${n1(evNow)}x our FY28E, ${n1(evNow27)}x FY27E`, `Starting point: ${n1(HEV.med)}x`],
        ['2. Sector de-rating', `Trailing EV/EBITDA vs each stock's five-year median on ${ASOF_TXT}: ${CORE.map(s => drTxt(s, drEv)).join(', ')} (median ${pc(sectorDrEv)}); Fortis itself ${pc(drEv.FORTIS)}. Left out: ${LEFT_OUT.map(s => drTxt(s, drEv)).join(', ')} (new-hospital losses and Aster's 2024 GCC demerger inflate their multiples); with them the median is ${pc(allDrEv)}`, `${n1(HEV.med)}x × ${(1 + sectorDrEv / 100).toFixed(3)} ≈ ${n1(evAfter)}x → **${hospMult}x hospitals**`],
        ['3. Growth', `EBITDA grew ${Math.round(ebitdaCagrHist)}% a year in FY23-26 (margin repair, Agilus recovery, acquisitions); we forecast ~${Math.round(ebitdaCagrFwd)}% for FY26-29E, after ESOP, with the margin gain mostly behind it`, 'No premium to history'],
        ['4. Peers', `FY28E EV/EBITDA (MOSL estimates) at the 30-Sep close: ${PFW.filter(r => CORE.includes(r.s)).map(r => `${shortName(r.s)} ${n1(r.e28)}x`).join(', ')}; median ${n1(pfCore)}x; Fortis ${n1(PFW.find(r => r.s === 'FORTIS').e28)}x (MOSL) / ${n1(evNow)}x (ours)`, `${hospMult}x Sep-28E ≈ ${n1(ourFy28Equiv)}x our FY28E hospital EBITDA after ESOP: at the peer median, below Fortis's current premium`],
        ['5. Returns', `ROE ${n1(A.roe[b])}% and ROCE 13% (FY26; ₹4,722 cr of goodwill in the base) vs an ${n1(V.ke)}% cost of capital; our ROE rises to {{F.roe.2|pct}} by FY29E`, 'Returns just above the cost of capital: no re-rating case'],
        ['6. Agilus', `Fortis paid ₹${n0(AGILUS.buyoutCr)} cr for 31.21% in FY25 (~₹${n0(AGILUS.implied100)} cr for 100%, ~${n1(buyoutFwd)}x next-year EBITDA); Metropolis ${n1(P.METROPOLIS.evEbitda)}x and Dr Lal ${n1(P.LALPATHLAB.evEbitda)}x trailing (diagnostics median ${pc(diagDrEv)} vs five-year medians: no de-rating); Agilus grew 4% a year in FY23-26`, `**${diagMult}x Sep-28E**: a small premium to the buyout, below Metropolis`],
      ],
      derivationSource: `Screener.in prices, balance sheets and multiples to ${ASOF_TXT}; AR FY26 (Agilus buyout); MOSL peer table (4-Sep-2026) scaled to 30-Sep closes; GAM Research`,
      crossNote: `**What the cross-checks tell us.** P/E (${peMult}x Sep-28E EPS of ₹${n1(epsSep28)}) gives ₹${n0(mv('pe').value)}: ${peMult}x is Fortis's ${n1(FM.median)}x forward P/E median since Apr-2021 (no trough years) cut by the ${Math.abs(Math.round(sectorDrPe))}% P/E de-rating of the same six peers. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below the target: at an ${n1(V.ke)}% cost of capital, capex of ~10% of revenue to FY29E and a 24% long-run margin, cash flows support well under today's price. All three methods sit below ₹${n0(price)}. The stock needs either the street's 27-30x multiples or management's 25% margin (after ESOP) by FY28 to be worth more than it costs; we assume neither.`,
    }),
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA since 2021: median ${n1(HEV.med)}x, ${n1(evNow)}x now`, unit: 'EV (incl. leases and minorities) ÷ next full-year EBITDA, post-Ind AS (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: hospMult, text: `Hospitals target: ${hospMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; AR FY26 (Agilus buyout value for minorities); GAM estimates FY27-29E' },
      { type: 'line', title: `Forward P/E since 2021: median ${n1(FM.median)}x, ${n1(peNow)}x now`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median: ${n1(FM.median)}x` }, { v: peMult, text: `Cross-check: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in; GAM estimates (forwardMedian)' },
    ] },
  ],
};

module.exports = { street, valuation };
Object.assign(module.exports, require('./FORTIS.part5b'));
