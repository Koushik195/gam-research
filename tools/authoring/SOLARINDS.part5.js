// Solar Industries report, part 5: street view, valuation, risks & honest summary, glossary, statement notes.
const X = require('./SOLARINDS.ctx');
const { streetBlocks } = require('./valuation-blend');
const { ruleText } = require('../../src/ratings');
const { D, F, V, A, n0, n1, pc, ASOF_TXT, price, mv, epsSep28, peMult, evMult, FM, H21, H16, H2y, fwdNow, evMed, ttmEbitda, ebitdaSep28, P, rerate, OTHERS, sectorRr, afterRr, shortName, rating, buyBelow, sellAbove, ST, tpMed, nBuy, nSell, shortDate, epsCagrHist, epsCagr3, epsCagrFwd, b, PEERS, A26, omValue } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ${nBuy} of ${ST.length} positive, targets bunched at ₹22,000-24,500, two Kotak sells far below`,
  blocks: [
    { p: `We found ${ST.length} notes standing on ${ASOF_TXT}: ${nBuy} Buy/Overweight and ${nSell} Sell. Targets range from ₹${n0(X.tps[0])} to ₹${n0(X.tps.at(-1))}, median ₹${n0(tpMed)}. Every broker that discloses a relative method uses **P/E**, at 50-70x on FY28E to Dec-28E earnings: Jefferies 70x Sep-28E (₹28,160), PL 62x Sep-28E (₹23,124), Antique 60x (₹24,418), Nuvama 55x Sep-28E (₹23,435), ICICI Direct 70x FY28E (₹23,200) and MOFSL 50x Dec-28E including Omnia (₹23,000; it cut the multiple because Omnia raises the non-defence share). The two sells (Kotak Institutional Equities ₹11,200, Kotak's private-client desk ₹10,300) use DCF. On Omnia the street is split: PL and Goldman Sachs keep it out of their base estimates, MOFSL includes it. Bulls focus on defence (Jefferies: defence from 27% to 40% of sales, 31% EPS CAGR); bears on valuation and the debt Omnia brings.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(X.rup)), source: 'Broker notes, company calls and filings to 30-Sep-2026' } },
  ],
};

const rrTxt = s => `${shortName(s)} ${pc(rerate[s])}`;
const tr = FM.troughYears.length ? FM.troughYears.join(', ') : 'none (EPS rose every year)';
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('SOLARINDS', {
      rating,
      streetIntro: 'The brokers that disclose a relative method value Solar on **P/E**, mostly on Sep-28E or FY28E earnings. We use the same method, applied to the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E), on organic estimates (Omnia excluded until it closes). The "At our EPS" column applies each broker\'s multiple to our EPS for its year: most of the gap to the street is the multiple, not the earnings.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', X.rup(s.thesis)]),
      ourThesis: 'Strong business; defence growth is priced in; Omnia adds debt, not value',
      streetSource: 'PL and MOFSL initiation PDFs; Kotak PCG PDF; Business Today (Jefferies, Nuvama, Morgan Stanley, Antique, Goldman Sachs, DAM, ICICI Direct); DSIJ (Kotak IE, ICICI Direct); Trendlyne listing (ICICI Securities). n.d. = method not disclosed in the sources we saw',
      derivationIntro: 'We start from the stock\'s own one-year-forward P/E since April 2021 (the house window), adjust for how far defence and explosives peers had re-rated by 30-Sep-2026, and then check growth, peers and returns.',
      derivation: [
        ['1. Its own history', `One-year-forward P/E: median ${n1(H21.med)}x since Apr-2021 (trough years excluded: ${tr}); 25th-75th percentile ${n1(H21.p25)}-${n1(H21.p75)}x; ${n1(H16.med)}x since 2016; ${n1(H2y.med)}x over the last two years; ${n1(fwdNow)}x on ${ASOF_TXT} on our FY28E`, `Starting point: ${n1(H21.med)}x`],
        ['2. Sector re-rating', `On ${ASOF_TXT} defence and explosives peers traded above their five-year median P/E: ${OTHERS.map(rrTxt).join(', ')} (median ${pc(sectorRr)}); Solar itself ${pc(rerate.SOLARINDS)}`, `${n1(H21.med)}x × ${(1 + sectorRr / 100).toFixed(2)} ≈ ${n1(afterRr)}x`],
        ['3. Growth', `EPS grew ${Math.round(epsCagrHist)}% a year in FY21-26 and ${Math.round(epsCagr3)}% in FY23-26, the years in which the median was set and defence went from 5% to 27% of sales; we forecast ~${Math.round(epsCagrFwd)}% for FY26-29E (PL ~30%)`, `~5% discount: **${peMult}x**`],
        ['4. Peers', `Trailing P/E: Bharat Electronics ${n1(P.BEL.pe)}x, Hindustan Aeronautics ${n1(P.HAL.pe)}x, Bharat Dynamics ${n1(P.BDL.pe)}x, Premier Explosives ${n1(P.PREMEXPLN.pe)}x; Solar ${n1(P.SOLARINDS.pe)}x`, `${peMult}x Sep-28E = ${n1(peMult * epsSep28 / F.eps[1])}x our FY28E: a premium to BEL and HAL for faster growth`],
        ['5. Returns', `ROE ${n1(A.roe[b])}% and ROCE 38% in FY26 against a ${n1(V.ke)}% cost of equity; returns will fall as capex and (with Omnia) debt rise`, 'Supports a premium, not a further re-rating'],
        ['6. What the price implies', `${n1(price / epsSep28)}x our Sep-28E EPS. Our DCF reaches only ~₹${n0(V.sens.grid[0][4])} even at a ${n1(V.sens.waccs[0])}% discount rate and ${n1(V.sens.gs[4])}% terminal growth`, 'The price assumes defence keeps compounding well beyond FY29'],
      ],
      derivationSource: `Screener.in (P/E history to ${ASOF_TXT}), broker notes, GAM Research`,
      history: { field: 'eps', from: '2016-04-01', median: H21.med, label: `Median since 2021: ${n1(H21.med)}x`, title: `One-year-forward P/E: our ${peMult}x vs history`, yearStep: 2 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (${evMult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr, less net debt) gives ₹${n0(mv('ev').value)}, below the P/E target: ${evMult}x comes from Solar's ${n1(evMed)}x median trailing EV/EBITDA since 2021, raised by the same sector re-rating and restated for Sep-28E EBITDA being ${Math.round((ebitdaSep28 / ttmEbitda - 1) * 100)}% above the twelve months to Jun-26 (₹${n0(ttmEbitda)} cr). The DCF (₹${n0(mv('dcf').value)}) is far lower: at a ${n1(V.ke)}% discount rate, with capex at 9-15% of revenue for three years, working capital held at FY26's bloated 23% of revenue, and growth fading from ~17% to 9% over 15 years, the cash flows support about a third of today's price. Kotak's DCF (₹11,200) is less harsh but tells the same story. Solar's price rests on its multiple, and the multiple rests on defence.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${V.blend.methods[0].multiple.bull}x (its 75th-percentile forward P/E since 2021).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr (FY27-29E), defence to {{as.businessLines.FY29E.defence|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${peMult}x Sep-28E EPS; Omnia excluded.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${V.blend.methods[0].multiple.bear}x (its 25th-percentile forward P/E since 2021, where it traded before defence scaled up).`],
      ['Omnia (not in any case)', `${pc(omValue(6) / V.tp * 100)} to ${pc(omValue(10) / V.tp * 100)} of target`, '', `Value per share of ${X.sgn(omValue(6))} to ${X.sgn(omValue(10))} at 6-10x EV/EBITDA after acquisition debt (Omnia chapter).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (negative = net debt)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Rate \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers: defence and explosives', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'SOLARINDS' ? '**Solar Industries**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(rerate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT} (BDL standalone). Global explosives peers (Orica, Dyno Nobel, EPC) trade at ~7-8x CY26E EV/EBITDA (PL, Bloomberg).` } },
  ],
};
module.exports = { street, valuation };
