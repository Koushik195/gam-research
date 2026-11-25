// Lemon Tree report, part 5: street view and valuation (SOTP on EV/EBITDA primary; multiple derivation; cross-checks in part5b).
const X = require('./LEMONTREE.ctx');
const { D, F, V, AS, n0, n1, pc, ASOF_TXT, WIN, ITC_WIN, price, sh, mv, P, VP, part, hm, hotelSep28, HEV, HEVplain, HEV21, HEVy, evNow, troughEv,
  PR, MED, drEv, CORE, LEFT_OUT, sectorDrEv, sens, evAfter, shortName, ST, medAll, impliedHotelMult, streetMultFor, ebitdaCagrHist, ebitdaCagrFwd, shortDate, MIN_PCT, minPs, tpAt, schemeUpliftPs } = X;
const SD = D.street;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: six Buys, median target ₹${n0(medAll)}, all on EV/EBITDA on FY28E with the Fleur minority taken out`,
  blocks: [
    { p: `${SD.note} The median of the six targets is **₹${n0(medAll)}**, ${Math.round((medAll / price - 1) * 100)}% above the ${ASOF_TXT} close of ₹${n0(price)}. The disclosed methods differ in how they treat Fleur: ICICI Direct puts 20x on consolidated FY28E EBITDA after removing APG's 41.09% of Fleur's EBITDA (but deducts all the group's debt); Motilal Oswal puts 17x on standalone EBITDA and Lemon Tree's share of Fleur and 30x on the management company; PL puts 22x on the fee business and 20x on the owned business. On our numbers the median target implies ~${n1(streetMultFor(medAll))}x Sep-28E EBITDA. ${SD.trend}` },
    { exhibit: { type: 'table', title: `Street views standing on ${ASOF_TXT}`, head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'Implied Sep-28E EV/EBITDA on our numbers'], wide: [5], rows: ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method || 'not public', s.multiple || '–', s.on || '–', `${n1(streetMultFor(s.tp))}x`]), source: 'Trendlyne report list; ICICI Direct and PL notes (11-Aug-2026); DSIJ summary of Motilal Oswal (10-Aug-2026); GAM Research' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(r => [r]), source: 'Company filings and calls, CRISIL, broker notes to 30-Sep-2026; GAM Research' } },
  ],
};

const partRows = P.map((p, i) => [`**${p.name}**`, VP[i].seg || VP[i].netCash ? `{{dcf.sotp.parts.${i}.metric|num}}` : '–', VP[i].multiple ? `${n1(p.mult)}x` : '–', `{{dcf.sotp.parts.${i}.value|num}}`, `{{dcf.sotp.parts.${i}.perShare|num}}`, VP[i].metricLabel || '']);
const drTxt = s => `${shortName(s)} ${pc(drEv[s])}`;
const so = mv('sotp'), pe = mv('pe');
const WF = [part(/^Hotels/).perShare, part(/minorities/).perShare, part(/^Net debt/).perShare].map(v => Math.round(v * 10) / 10);
WF.push(Math.round(WF.reduce((t, v) => t + v, 0)));
const variant = (name, m, d) => { const mult = Math.round(m * (1 + d / 100) * 2) / 2; return [name, n1(m), pc(d), `${mult}x`, n0(tpAt(mult))]; };

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${hm.base}x Sep-28E EBITDA, less minorities and net debt, gives {{dcf.tp|inr}}; the stock has de-rated twice as far as the sector`,
  blocks: [
    { h: 'How the street values Lemon Tree' },
    { p: 'Hotel companies in India are valued on **EV/EBITDA** (enterprise value ÷ operating profit before depreciation): every broker that disclosed a method for Lemon Tree uses FY28E EBITDA, with the Fleur minority taken out, and the published IHCL, EIH and ITC Hotels reports use the same yardstick. We use Sep-28E EBITDA (½ FY28E + ½ FY29E, the 12-month-forward year the market will look at in September 2027) in a sum of the parts: 100% of consolidated EBITDA at the derived multiple, less the minorities\' share of the resulting equity value, less net debt including leases.' },
    { h: 'Our sum of the parts' },
    { p: `The hotels and the management business are valued on 100% of Sep-28E operating EBITDA (₹${n0(hotelSep28)} cr), with lease liabilities in net debt. Minorities (almost all Warburg Pincus's 41.09% of Fleur) took ${X.C.minorities.pctOfProfitFy26}% of FY26 profit after tax (${X.C.minorities.pctOfProfitFy25}% in FY25, ${X.C.minorities.pctOfProfitQ1}% in Q1FY27), so we deduct ${MIN_PCT}% of the equity value (hotel EV less net debt): ₹${n0(minPs)} a share. This is the same gross-up we apply to the price history, so the multiple and the deduction are consistent. Net debt is the model's Sep-28E figure: free cash flow repays bank debt in our forecasts, and we add nothing for Warburg's capital or Fleur's acquisitions. The scheme, if approved on its terms, would add ~₹${n0(schemeUpliftPs)} a share (Fleur split chapter).` },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case)', head: ['Part', 'Sep-28E metric (₹ cr)', 'Multiple', 'Value (₹ cr)', '₹ / share', 'Basis'], wide: [5], rows: [
      ...partRows,
      { hl: true, cells: ['**Equity value / target (rounded)**', '', '', '**{{dcf.sotp.equity|num}}**', '**{{dcf.tp|num}}**', 'vs price ₹{{P.last|num}}: {{dcf.upside|chg}}'] },
    ], source: 'GAM Research' } },
    { pair: [
      { type: 'waterfall', title: 'Minorities take a fifth of the hotel value; net debt ~5%', unit: '₹ per share (base case)', x: ['Hotels (100%)', 'Minorities', 'Net debt Sep-28E', 'SOTP value'], series: [{ name: '₹/share', values: WF }], fmt: 'num', totalFmt: 'num', source: 'GAM Research' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['Sum of the parts (target)', 'P/E cross-check', 'DCF cross-check', 'Street median', 'Share price'], series: [{ name: 'Value', values: [Math.round(so.value), Math.round(pe.value), Math.round(mv('dcf').value), Math.round(medAll), price], fmt: 'inr' }], labels: 'all', highlight: 'Sum of the parts (target)', source: 'GAM Research; broker notes (Jun-Aug 2026)' },
    ] },
    { h: 'How we derive the multiple' },
    { p: `House rule: start from the stock's own one-year-forward EV/EBITDA, adjust for how far the sector had moved against its own history by ${ASOF_TXT}, then test growth, peers, returns and the street. (1) **Window.** Lemon Tree's EBITDA broke from the Covid trough (FY21 ₹57 cr, FY22 ₹119 cr) to ₹448 cr in FY23; on realised forward EBITDA the 2021-22 multiples look artificially low, because the market could not see the rebound, so the turnaround rule starts the window at the break (1-Apr-2022), as for IHCL and EIH, and measures the peers' move over the same window; the since-2021 median is a sensitivity. (2) **EV includes minorities**, because the SOTP values 100% of EBITDA and then deducts them (gross-up ~18-21%); without it the median is ${n1(HEVplain.med)}x. (3) **Peers.** Three usable peers (IHCL, EIH, ITC Hotels), the minimum, so the set is not widened: Chalet is out (residential flat sales in its trailing EBITDA) and ITC Hotels is measured over the window it has (since ${shortDate(ITC_WIN)}, listing months skipped). Subsets are sensitivity rows.` },
    { exhibit: { type: 'table', title: 'Deriving the EV/EBITDA multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Own history', `One-year-forward EV/EBITDA since ${shortDate(WIN)}: median ${n1(HEV.med)}x (25th-75th percentile ${n1(HEV.p25)}-${n1(HEV.p75)}x); calendar medians 2022 ${n1(HEVy('2022').med)}x, 2023 ${n1(HEVy('2023').med)}x, 2024 ${n1(HEVy('2024').med)}x, 2025 ${n1(HEVy('2025').med)}x, 2026 ${n1(HEVy('2026').med)}x. Trough years left out: ${troughEv.length ? troughEv.join(', ') : 'none (FY23 onwards are the forward years)'}. On ${ASOF_TXT}: ${n1(evNow.gross)}x FY28E`, `Starting point: ${n1(HEV.med)}x`],
      ['2. Sector move', `Trailing EV/EBITDA on ${ASOF_TXT} vs each stock's median over the window: ${CORE.map(drTxt).join(', ')} (median ${pc(sectorDrEv)}); Lemon Tree itself ${pc(drEv.LEMONTREE)}. Left out: ${LEFT_OUT.map(drTxt).join(', ')} (residential flat sales in trailing EBITDA)`, `${n1(HEV.med)}x × ${(1 + sectorDrEv / 100).toFixed(3)} = ${n1(evAfter)}x → **${hm.base}x**`],
      ['3. Growth', `Operating EBITDA grew ${Math.round(ebitdaCagrHist)}% a year over FY23-26 (Aurika Mumbai and the post-Covid rebound); we forecast ~${Math.round(ebitdaCagrFwd)}% for FY26-29E`, 'Slower than the history the median was earned on: no premium'],
      ['4. Peers', `Trailing EV/EBITDA on ${ASOF_TXT}: Lemon Tree ${n1(PR.LEMONTREE.evEbitda)}x, IHCL ${n1(PR.INDHOTEL.evEbitda)}x, EIH ${n1(PR.EIHOTEL.evEbitda)}x, ITC Hotels ${n1(PR.ITCHOTELS.evEbitda)}x, Chalet ${n1(PR.CHALET.evEbitda)}x`, `Lemon Tree's median is below IHCL's and ITC Hotels' ( ${n1(MED.LEMONTREE.ev)}x vs ${n1(MED.INDHOTEL.ev)}x and ${n1(MED.ITCHOTELS.ev)}x): mid-market rates, debt, minorities`],
      ['5. Returns', `ROCE ${Math.round(X.A.roce[X.b])}% (FY26, Screener) vs an ${n1(V.ke)}% WACC; ROE ~18% on a leveraged balance sheet`, 'Returns only just above the cost of capital: no premium to history'],
      ['6. Street and market', `Street median ₹${n0(medAll)} ≈ ${n1(streetMultFor(medAll))}x Sep-28E on our numbers; at the ${ASOF_TXT} price the market pays ~${n1(impliedHotelMult)}x`, `Our ${hm.base}x sits between the market and the street`],
    ], source: `Screener.in prices, balance sheets and multiples to ${ASOF_TXT}; GAM Research` } },
    { exhibit: { type: 'table', title: 'Sensitivity of the multiple and target to the derivation choices', head: ['Variant', 'Own median', 'Sector move', 'Multiple', 'Approx. target (₹)'], rows: [
      [`**Base: since ${shortDate(WIN)}, EV incl. minorities, IHCL + EIH + ITC Hotels**`, n1(HEV.med), pc(sectorDrEv), `${hm.base}x`, '{{dcf.tp|num}}'],
      variant('Since Apr-2021 (no turnaround window)', HEV21.med, sectorDrEv), variant('EV without the minority gross-up', HEVplain.med, sectorDrEv),
      variant('Five-year peer medians', HEV.med, sens.five), variant('Adding Chalet', HEV.med, sens.withChalet), variant('Without ITC Hotels (IHCL + EIH)', HEV.med, sens.exItc),
      variant('Without IHCL (EIH + ITC Hotels)', HEV.med, sens.exIhcl), variant('Without EIH (IHCL + ITC Hotels)', HEV.med, sens.exEih),
      variant('Lemon Tree\'s own move instead of the sector\'s (not the house rule)', HEV.med, drEv.LEMONTREE), variant('No sector adjustment (own median only)', HEV.med, 0),
    ], source: 'GAM Research (each row re-prices the hotels, net of minorities, at the variant multiple, all else equal)' } },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(HEV.med)}x since Apr-2022, target ${hm.base}x`, unit: 'EV incl. minorities and leases ÷ next full-year EBITDA (x)', x: X.fwdEvChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.fwdEvChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: hm.base, text: `Target: ${hm.base}x`, color: '#cf8f1f' }], source: 'Screener.in; GAM estimates for FY27-29E' },
      { type: 'hbar', title: 'Peers: trailing EV/EBITDA now vs their medians', unit: `EV/EBITDA (x), ${ASOF_TXT} vs median since Apr-2022 (ITC Hotels since Apr-2025)`, x: X.PEER_SYMS.map(shortName), series: [{ name: `${ASOF_TXT}`, values: X.PEER_SYMS.map(s => PR[s].evEbitda), fmt: 'x' }, { name: 'Median', values: X.PEER_SYMS.map(s => Math.round(MED[s].ev * 10) / 10), fmt: 'x' }], labels: 'all', source: 'Screener.in' },
    ] },
    ...require('./LEMONTREE.part5b').blocks,
  ],
};

module.exports = { street, valuation, risks: require('./LEMONTREE.part5b').risks };
