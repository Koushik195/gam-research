// Indian Hotels report, part 5: street view and valuation (SOTP on EV/EBITDA primary; multiple derivation; cross-checks in part5b).
const X = require('./INDHOTEL.ctx');
const { D, F, V, AS, n0, n1, pc, ASOF_TXT, WIN, price, sh, mcap, mv, P, VP, part, hm, hotelSep28, acSep28, netCashSep28, HEV, HEVplain, HEV21, HEVy, evNow, troughEv,
  HPE, HPErep, FM, peNow, PR, MEDEV, MED5EV, drEv, drPe, dr5Ev, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, sens, evAfter, evBull, evBear, peAfter, shortName, rating, ST,
  mosl, isec, idir, avgPost, medAll, impliedHotelMult, streetMultOnOurs, ebitdaCagrHist, ebitdaCagrFwd, shortDate, HOTEL_MIN_PCT, minPs, ann } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: ten of thirteen Buy, targets ₹676-925, all on EV/EBITDA FY28E at 23-30x',
  blocks: [
    { p: `After the Q1FY27 results (21-Jul-2026) the houses that published raised or kept their targets: ICICI Securities ₹${n0(isec.tp)} (SOTP, 30x Jun-28E EV/EBITDA, kept on 27-Aug), Jefferies ₹875 (reiterated 17-Sep), Motilal Oswal ₹${n0(mosl.tp)} (SOTP, 28x FY28E), ICICI Direct ₹${n0(idir.tp)} (29x FY28E), Anand Rathi ₹845 (~26x), Macquarie ₹840, Axis ₹830 (27x), Nomura ₹830 (~23x); Morgan Stanley stays Equal-weight (₹783). Post-Q1 targets average ~₹${n0(avgPost)}; the median of all thirteen standing notes is ₹${n0(medAll)}. Earlier and more cautious: Nuvama Hold ₹676 and Elara Accumulate ₹716 (both 12-May-2026, after the West Asia shock). Bulls argue the hotel upcycle has years to run (supply ~5% a year vs demand 8-10%), IHCL will beat its 12-14% guide, and fees and Ginger make the model lighter every year. No note we found adjusted the multiple for the sector's 2026 de-rating.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(r => [r]), source: 'Broker notes, earnings calls, filings and press to 30-Sep-2026; GAM Research' } },
  ],
};

const streetRows = ST.map(s => [s.broker, s.rating, n0(s.tp), shortDate(s.date), s.method || 'n.d.', s.multiple || '–', s.on || '–', s.thesis]);
const partRows = P.map((p, i) => [`**${p.name}**`, VP[i].seg ? `{{dcf.sotp.parts.${i}.metric|num}}` : (VP[i].netCash ? `{{dcf.sotp.parts.${i}.metric|num}}` : '–'), VP[i].multiple ? `${n1(p.mult)}x` : '–', `{{dcf.sotp.parts.${i}.value|num}}`, `{{dcf.sotp.parts.${i}.perShare|num}}`, VP[i].metricLabel || '']);
const drTxt = (s, m) => `${shortName(s)} ${pc(m[s])}`;
const so = mv('sotp'), pe = mv('pe');
const WF = [part(/^Hotels/).perShare, part(/^TajSATS/).perShare, part(/minorities in hotel/).perShare, part(/^Oriental/).perShare + part(/Brij/).perShare, part(/^Net cash/).perShare].map(Math.round);
WF.push(WF.reduce((t, v) => t + v, 0));

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${hm.base}x Sep-28E EBITDA in a sum of the parts gives {{dcf.tp|inr}}; the sector has re-priced and IHCL has not`,
  blocks: [
    { h: 'How the street values IHCL' },
    { p: 'Every house that discloses a method uses **EV/EBITDA** (enterprise value ÷ operating profit) on FY28E or Jun-28E EBITDA. Three (Motilal Oswal, ICICI Securities, Anand Rathi) turn it into a sum of the parts: hotels on EV/EBITDA, TajSATS at IHCL\'s 51%, Oriental Hotels at market value, less minorities, plus net cash. We do the same so the target is comparable, on Sep-28E EBITDA (the 12-month-forward year the market will look at in September 2027).' },
    { exhibit: { type: 'table', title: 'How the street values IHCL (latest note per broker, to 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Method', 'Multiple', 'On', 'Thesis / note'], wide: [5, 7], rows: [
      ...streetRows,
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '30-Sep-26', '**SOTP: EV/EBITDA**', `**${hm.base}x (TajSATS 51% at the same multiple)**`, '**Sep-28E**', 'Great franchise; the sector de-rated and IHCL has not'] },
    ], source: 'Broker PDFs (MOSL, ICICI Direct, Axis), DSIJ, Business Today, Moneycontrol and Trendlyne summaries; n.d. = not disclosed' } },
    { h: 'Our sum of the parts' },
    { p: `Hotels are valued on 100% of Sep-28E hotel EBITDA (₹${n0(hotelSep28)} cr, post-Ind AS) with lease liabilities in net cash. TajSATS is valued at IHCL's 51% on the same multiple, so SATS's 49% never enters the value. Minorities are deducted only where we count 100%: partners took ~${HOTEL_MIN_PCT}% of hotel profit before minorities (₹78 cr of ~₹1,790 cr in FY26, ~4.6% in Q1FY27, rising with the 49% partners in ANK, Pride, Atmantan and Brij), so we deduct ${HOTEL_MIN_PCT}% of the hotel EV (₹${n0(minPs)} a share). Oriental Hotels (listed associate, 35.86% effective) is at market less 20%, replacing its book value in the model's cash (the house rule for listed stakes inside an operating company). Net cash is the model's Sep-28E figure (cash and investments less borrowings and leases), less the ₹222 cr paid for Brij in Apr-2026.` },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case)', head: ['Part', 'Sep-28E metric (₹ cr)', 'Multiple', 'Value (₹ cr)', '₹ / share', 'Basis'], wide: [5], rows: [
      ...partRows,
      { hl: true, cells: ['**Equity value / target (rounded)**', '', '', '**{{dcf.sotp.equity|num}}**', '**{{dcf.tp|num}}**', 'vs price ₹{{P.last|num}}: {{dcf.upside|chg}}'] },
    ], source: 'GAM Research. The TajSATS multiple shown is the effective one (hotel multiple × 51%).' } },
    { pair: [
      { type: 'waterfall', title: 'Hotels are ~90% of the value', unit: '₹ per share (base case)', x: ['Hotels', 'TajSATS (51%)', 'Minorities', 'Oriental Hotels less Brij paid', 'Net cash Sep-28E', 'SOTP value'], series: [{ name: '₹/share', values: WF }], fmt: 'num', totalFmt: 'num', source: 'GAM Research' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['Sum of the parts (target)', 'P/E cross-check', 'DCF cross-check', 'Share price'], series: [{ name: 'Value', values: [Math.round(so.value), Math.round(pe.value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'Sum of the parts (target)', source: 'GAM Research' },
    ] },
    { h: 'How we derive the multiple' },
    { p: `House rule: start from the stock's own one-year-forward EV/EBITDA, adjust for how far the sector had moved against its own history by ${ASOF_TXT}, then test growth, peers, returns and the street. Two choices follow the settled rules. (1) **Window.** IHCL's EBITDA broke from a Covid loss (FY21 −₹362 cr, FY22 ₹405 cr) to ₹1,805 cr in FY23; on realised forward EBITDA the 2021-22 multiples look artificially low (13-18x) because the market could not see the rebound. The turnaround rule starts the window at the break (1-Apr-2022) and measures the peers' move over the same window; the since-2021 median is a sensitivity row. (2) **EV includes minorities.** Because the SOTP values 100% of hotel EBITDA and then deducts minorities, the history grosses market value up by each year's minority share of profit (5-7%); without it the median is ${n1(HEVplain.med)}x.` },
    { exhibit: { type: 'table', title: 'Deriving the EV/EBITDA multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Own history', `One-year-forward EV/EBITDA since ${shortDate(WIN)}: median ${n1(HEV.med)}x (25th-75th percentile ${n1(HEV.p25)}-${n1(HEV.p75)}x); calendar medians 2022 ${n1(HEVy('2022').med)}x, 2023 ${n1(HEVy('2023').med)}x, 2024 ${n1(HEVy('2024').med)}x, 2025 ${n1(HEVy('2025').med)}x, 2026 ${n1(HEVy('2026').med)}x. Trough years left out: ${troughEv.length ? troughEv.join(', ') : 'none'}. On ${ASOF_TXT}: ${n1(evNow.gross)}x FY28E`, `Starting point: ${n1(HEV.med)}x`],
      ['2. Sector move', `Trailing EV/EBITDA on ${ASOF_TXT} vs each stock's median since ${shortDate(WIN)}: ${CORE.map(s => drTxt(s, drEv)).join(', ')} (median ${pc(sectorDrEv)}); IHCL itself ${pc(drEv.INDHOTEL)}. Left out: ${LEFT_OUT.map(s => drTxt(s, drEv)).join(', ')} (Chalet's trailing EBITDA includes ₹163 cr from residential flat sales; ITC Hotels listed Jan-2025)`, `${n1(HEV.med)}x × ${(1 + sectorDrEv / 100).toFixed(3)} = ${n1(evAfter)}x → **${hm.base}x**`],
      ['3. Growth', `EBITDA grew ${Math.round(ebitdaCagrHist)}% a year over FY23-26 (incl. TajSATS consolidation and deals); we forecast ~${Math.round(ebitdaCagrFwd)}% for FY26-29E`, 'Slower growth than the history the median was earned on: no premium'],
      ['4. Peers', `Trailing EV/EBITDA on ${ASOF_TXT}: IHCL ${n1(PR.INDHOTEL.evEbitda)}x, ITC Hotels ${n1(PR.ITCHOTELS.evEbitda)}x, Chalet ${n1(PR.CHALET.evEbitda)}x, EIH ${n1(PR.EIHOTEL.evEbitda)}x, Lemon Tree ${n1(PR.LEMONTREE.evEbitda)}x`, `${hm.base}x Sep-28E ≈ ${n1(hm.base * (hotelSep28 + acSep28) / 3196)}x trailing FY26 EBITDA: still the highest in the group`],
      ['5. Returns', `Company ROCE 17.4% (FY26) vs a ${n1(V.ke)}% cost of equity; standalone hotels much higher, leased and international hotels lower`, 'Supports a premium to peers, not to its own history'],
      ['6. Street and market', `Street 23-30x FY28E; 29x (ICICI Direct) on our FY28E EBITDA and net cash = ₹${n0(streetMultOnOurs(29))} a share. At the ${ASOF_TXT} price the market pays ~${n1(impliedHotelMult)}x Sep-28E hotel EBITDA once the other parts are valued our way`, `Our ${hm.base}x is well below both`],
    ], source: `Screener.in prices, balance sheets and multiples to ${ASOF_TXT}; broker notes; GAM Research` } },
    { exhibit: { type: 'table', title: 'Sensitivity of the multiple and target to the derivation choices', head: ['Variant', 'Own median', 'Sector move', 'Multiple', 'Approx. target (₹)'], rows: [
      [`**Base: since ${shortDate(WIN)}, EV incl. minorities, EIH + Lemon Tree**`, n1(HEV.med), pc(sectorDrEv), `${hm.base}x`, '{{dcf.tp|num}}'],
      ...[['Since Apr-2021 (no turnaround window)', HEV21.med, sectorDrEv], ['EV without the minority gross-up', HEVplain.med, sectorDrEv], ['Five-year peer medians', HEV.med, sens.five], ['Adding Chalet', HEV.med, sens.withChalet], ['All four peers (adding Chalet and ITC Hotels)', HEV.med, sens.all4], ['No sector adjustment (own median only)', HEV.med, 0]].map(([n, m, d]) => { const mult = Math.round(m * (1 + d / 100) * 2) / 2, tp = (V.sotp.equity + (mult - hm.base) * (hotelSep28 * (1 - HOTEL_MIN_PCT / 100) + acSep28 * 0.51)) / sh; return [n, n1(m), pc(d), `${mult}x`, n0(Math.round(tp / 10) * 10)]; }),
    ], source: 'GAM Research (each row re-prices hotels and TajSATS at the variant multiple, all else equal)' } },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA since 2021: median ${n1(HEV.med)}x since Apr-2022, target ${hm.base}x`, unit: 'EV incl. minorities and leases ÷ next full-year EBITDA (x)', x: X.fwdEvChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.fwdEvChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: hm.base, text: `Target: ${hm.base}x`, color: '#cf8f1f' }], source: 'Screener.in; GAM estimates for FY27-29E' },
      { type: 'hbar', title: 'Peers: trailing EV/EBITDA now vs their medians since Apr-2022', unit: `EV/EBITDA (x), ${ASOF_TXT} vs median`, x: X.PEER_SYMS.map(shortName), series: [{ name: `${ASOF_TXT}`, values: X.PEER_SYMS.map(s => PR[s].evEbitda), fmt: 'x' }, { name: 'Median since Apr-2022', values: X.PEER_SYMS.map(s => MEDEV[s]), fmt: 'x' }], labels: 'all', source: 'Screener.in' },
    ] },
    ...require('./INDHOTEL.part5b').blocks,
  ],
};

module.exports = { street, valuation, risks: require('./INDHOTEL.part5b').risks };
