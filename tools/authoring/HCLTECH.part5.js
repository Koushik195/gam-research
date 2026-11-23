// HCL Technologies report, part 5: street view and valuation (street table, multiple derivation, cross-checks,
// scenarios, DCF detail and sensitivity, peers).
const fs = require('fs');
const path = require('path');
const X = require('./HCLTECH.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, A, AS, n0, n1, pc, rup, ASOF_TXT, price, mv, epsSep28, peMult, evMult, FM, H21, H16, H1620, exOneOff, fwdNow, evMed, ttmEbitda, ebitdaSep28, P, derate, OTHERS, sectorDr, sectorDrAll, tier1Dr, afterDerate, shortName, rating, ST, withTp, medTp, avgTp, nBuy, nSell, shortDate, epsCagrHist, epsCagrFwd, epsCagr2729, b, PEERS, PEER_SYMS } = X;
const tps = withTp.map(s => s.tp);
const ttmEps = A.ttm?.eps || X.M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0);
const ddm = AS.payout[1] / 100 / ((V.ke - AS.dcf.terminalGrowth) / 100);
const g3 = s => { const T = JSON.parse(fs.readFileSync(path.join(X.ROOT, 'data', 'raw', s, 'screener.json'), 'utf8')).tables['profit-loss']; const i = p => T.periods.indexOf(p); return Math.round((Math.pow(T.rows.Sales[i('Mar 2026')] / T.rows.Sales[i('Mar 2023')], 1 / 3) - 1) * 1000) / 10; };

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: split, targets ₹${n0(Math.min(...tps))}-${n0(Math.max(...tps))}, median ₹${n0(medTp)}, flat on the price`,
  blocks: [
    { p: `We found ${withTp.length} targets dated between 23-Jun and 19-Aug 2026, almost all published around the Q1FY27 results (13-14 Jul). Ratings we could see: ${nBuy} Buy/Add (Motilal Oswal ₹1,450, Geojit ₹1,459, UBS ₹1,390, Nomura ₹1,290, Equirus ₹1,290, HSBC ₹1,255, HDFC ₹1,160 pre-results), ${nSell} Sell/Underweight/Reduce (Citi ₹1,040, JPMorgan ₹1,060, Jefferies ₹1,070, Kotak ₹1,200) and Holds (PL ₹1,160, ICICI Securities ₹1,140); others published targets only. The median target is ₹${n0(medTp)} (average ₹${n0(avgTp)}), mostly set when the stock was ₹1,167-1,221; at ₹${n0(price)} on ${ASOF_TXT} that is ~${Math.round((medTp / price - 1) * 100)}% upside. Every house that discloses a method uses **P/E on FY28E (or one-year-forward) EPS, at 15-19x**; the most common multiple is 15x, cut from 17-18x after the April guidance. Bulls point to bookings, AI positioning and capital returns; bears to fading growth leadership, AI deflation and the premium to TCS and Infosys.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, calls and filings to 30-Sep-2026' } },
  ],
};

const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('HCLTECH', {
      rating,
      streetIntro: 'The brokers that disclose a method value HCLTech on **P/E on FY28E EPS** (Motilal Oswal 18x, Geojit 19x, PL, ICICI Securities and HDFC 15x), on June-2028 EPS (Kotak 15x) or one-year-forward EPS at Sep-2027 (Equirus 16x). None values HCLSoftware separately. We use the same method so our target is comparable, applied to the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our EPS for its year: the gap to the street is the multiple, not the earnings.',
      street: ST.filter(s => s.tp).map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating || 'n.d.', s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', rup(s.thesis || '–')]),
      ourThesis: 'A well-run, cash-rich franchise whose growth AI is shrinking to 3-4%; the sector de-rating is lasting',
      streetSource: 'Motilal Oswal, Equirus, PL Capital and ICICI Securities notes (PDFs); Kotak Neo Research; Business Today (14-Jul and 23-Jun 2026); NiftyTrader; Geojit via DSIJ. n.d. = not disclosed in the sources we saw',
      derivationIntro: 'We start from the stock\'s own one-year-forward P/E since April 2021 (the house rule, leaving out trough years), cut it by how far comparable IT stocks had de-rated by 30-Sep-2026, and then check growth, peers and returns.',
      derivation: [
        ['1. Its own history', `One-year-forward P/E since Apr-2021: median ${n1(FM.median)}x (25th-75th percentile ${n1(H21.p25)}-${n1(H21.p75)}x; range ${n1(H21.min)}-${n1(H21.max)}x); trough years: ${FM.troughYears.length ? FM.troughYears.join(', ') : 'none'}. On EPS before one-offs (FY25 State Street JV gain, FY26 Labour Codes charge) ${n1(exOneOff)}x. ${n1(H16.med)}x since 2016; ${n1(H1620.med)}x in FY17-20 (range ${n1(H1620.min)}-${n1(H1620.max)}x); ${n1(fwdNow)}x on ${ASOF_TXT} on our FY28E`, `Starting point: ${n1(FM.median)}x (house rule; the one-off version differs by ${n1(Math.abs(exOneOff - FM.median))}x)`],
        ['2. Sector de-rating', `On ${ASOF_TXT} eight IT peers traded below their five-year median P/E: ${OTHERS.map(drTxt).join(', ')} (median ${pc(sectorDr)}). Left out: HCLTech itself (${pc(derate.HCLTECH)}) and Tech Mahindra (${pc(derate.TECHM)}), whose FY24-25 earnings trough inflates both its median and its current P/E; with it the median is ${pc(sectorDrAll)}; the tier-1 four alone ${pc(tier1Dr)}`, `${n1(FM.median)}x × ${(1 + sectorDr / 100).toFixed(3)} ≈ ${n1(afterDerate)}x`],
        ['3. Growth', `EPS grew ${n1(epsCagrHist)}% a year in FY21-26 (3.9% in FY23-26); we forecast ~${Math.round(epsCagrFwd)}% for FY26-29E from the ₹64.0 normalised base, but ~${Math.round(epsCagr2729)}% after FY27's rupee boost; US$ growth ~3-4% vs 5-14% (constant currency) in FY22-25. The slowdown is what the sector de-rating prices`, `No further adjustment: **${peMult}x**`],
        ['4. Peers', `Trailing P/E: TCS ${n1(P.TCS.pe)}x, Infosys ${n1(P.INFY.pe)}x, Wipro ${n1(P.WIPRO.pe)}x, LTIMindtree ${n1(P.LTM.pe)}x, Mphasis ${n1(P.MPHASIS.pe)}x; HCLTech ${n1(P.HCLTECH.pe)}x`, `${peMult}x Sep-28E = ${n1(V.tp / F.eps[1])}x our FY28E and ${n1(V.tp / ttmEps)}x trailing EPS: still a premium to TCS and Infosys, as growth and payout justify`],
        ['5. Returns', `ROE ${n1(A.roe[b])}% in FY26, ~${Math.round(F.roe[1])}% in our FY28E; ROIC 40.7%; cost of equity ${n1(V.ke)}%. Dividend-discount P/E with a ${AS.payout[1]}% payout and ${AS.dcf.terminalGrowth}% growth: ${n1(ddm)}x; a free-cash-flow DCF including net cash gives more (₹${n0(mv('dcf').value)})`, 'Supports 13-16x; we keep the market-derived 13x'],
      ],
      derivationSource: `Screener.in (P/E history to ${ASOF_TXT}), broker notes, GAM Research`,
      history: { field: 'eps', from: '2016-04-01', median: Math.round(FM.median), label: `Median since 2021: ${Math.round(FM.median)}x`, title: `One-year-forward P/E: our ${peMult}x vs history`, yearStep: 2 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (${evMult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr plus net cash) gives ₹${n0(mv('ev').value)}, within ~${Math.abs(Math.round(mv('ev').vsTarget))}% of the P/E target: ${evMult}x is the ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same sector de-rating and restated for Sep-28E EBITDA being ${Math.round((ebitdaSep28 / ttmEbitda - 1) * 100)}% above the twelve months to Jun-26 (₹${n0(ttmEbitda)} cr). The DCF (₹${n0(mv('dcf').value)}, ${pc(mv('dcf').vsTarget)} vs our target) is higher because it assumes HCLTech's rupee revenue grows 5% a year forever at a ~21% EBITDA margin, i.e. that AI does not shrink the business; at a 12.9% cost of equity and 4% terminal growth it gives ₹${n0(V.sens.grid[4][0])}. The gap between the DCF and the market-based multiples is the AI question in one number: the market (and our target) price a smaller terminal value than a "business as usual" DCF.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${V.blend.methods[0].multiple.bull}x (half the sector de-rating reverses).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `US$ revenue +${n1(X.usdGrowth[0])}% / +${n1(X.usdGrowth[1])}% / +${n1(X.usdGrowth[2])}% (FY27-29E); EBIT margin ${n1(X.ebitM[0])}% → ${n1(X.ebitM[2])}%; ₹95.5-95.8 per US$; ${peMult}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${V.blend.methods[0].multiple.bear}x (the tier-1 peers' ${Math.abs(Math.round(tier1Dr))}% de-rating).`],
    ], source: 'GAM Research. Scenario changes apply to all three forecast years, including FY27 (one quarter already reported).' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-37E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: `GAM Research. Cost of equity ${n1(V.ke)}% (risk-free 6.5%, beta ${AS.dcf.beta}, equity premium 6%); terminal growth ${AS.dcf.terminalGrowth}%; EBITDA margin fading to ${AS.dcf.fadeMarginTo}%, capex to ${AS.dcf.fadeCapexPctTo}% of revenue.` } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { pair: [
      { type: 'scatter', title: 'Growth is what the market pays for: HCLTech sits between the tiers', points: PEER_SYMS.map(s => ({ x: g3(s), y: P[s].pe, label: shortName(s), hl: s === 'HCLTECH' })), xtitle: 'Revenue growth FY23-26, a year (%)', ytitle: 'Trailing P/E at 30-Sep-2026 (x)', xfmt: 'n1', yfmt: 'x', source: 'Screener.in; NSE closes 30-Sep-2026' },
      { type: 'hbar', title: 'Trailing P/E at the 30-Sep-2026 close', unit: 'P/E (x)', x: PEER_SYMS.map(shortName), series: [{ name: 'P/E', values: PEER_SYMS.map(s => P[s].pe), fmt: 'x' }], labels: 'all', highlight: 'HCLTech', source: 'Screener.in, scaled to NSE closes' },
    ] },
    { exhibit: { type: 'table', title: 'Listed peers: Indian IT services', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'HCLTECH' ? '**HCLTech**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Forward P/E on FY28E at Equirus' estimates and 14-Jul prices: TCS 13.1x, Infosys 13.4x, Wipro 12.2x, Tech Mahindra 16.8x, LTIMindtree 17.5x, HCLTech 15.7x (Equirus, 14-Jul-2026).` } },
  ],
};

module.exports = { street, valuation };
