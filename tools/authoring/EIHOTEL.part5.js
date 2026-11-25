// EIH report, part 5: street view and valuation (SOTP on EV/EBITDA primary; multiple derivation; cross-checks in part5b).
const X = require('./EIHOTEL.ctx');
const { D, F, V, AS, n0, n1, pc, ASOF_TXT, WIN, ITC_WIN, price, sh, mv, P, VP, part, hm, hotelSep28, HEV, HEVplain, HEV21, HEVy, evNow, troughEv,
  PR, MED, drEv, CORE, LEFT_OUT, sectorDrEv, sens, evAfter, shortName, rating, ST, axis, impliedHotelMult, streetMultFor, ebitdaCagrHist, ebitdaCagrFwd, shortDate, MIN_PCT, minPs, tpAt, EA, eaMv } = X;
const SD = D.street;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: almost no coverage; one fresh Buy (Axis Capital, ₹385), method not public',
  blocks: [
    { p: `EIH is one of the least-covered large hotel stocks in India. The only standing view we could date on or before ${ASOF_TXT} is **Axis Capital's initiation (${shortDate(axis.date)}): Buy, target ₹${axis.tp}** (~30% above the ₹295 close of 28-Sep), arguing that EIH owns marquee assets, its pipeline is reviving, its RevPAR beats peers and its valuation is at a 12-year low, so "a re-rating is due". The note itself is not public, so its multiple, earnings year and estimates are unknown. Aggregators show a second Buy at ~₹350 from an unnamed house whose date we cannot check; we leave it out. Earlier coverage (ICICI Securities and ICICI Direct, 2020-23) valued EIH on **EV/EBITDA two years forward** (19-20x FY24E-FY25E in 2023). On our numbers Axis's ₹${axis.tp} implies ~${n1(streetMultFor(axis.tp))}x Sep-28E EBITDA.` },
    { exhibit: { type: 'table', title: 'Earlier notes: how the street valued EIH (method history, not standing views)', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On'], rows: SD.methodHistory.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method, s.multiple, s.on]), source: 'Trendlyne report list; ICICI Direct research page; a 2022 hotel sector initiation (Scribd)' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(r => [r]), source: 'Company filings and calls, CARE, broker and press summaries to 30-Sep-2026; GAM Research' } },
  ],
};

const partRows = P.map((p, i) => [`**${p.name}**`, VP[i].seg || VP[i].netCash ? `{{dcf.sotp.parts.${i}.metric|num}}` : '–', VP[i].multiple ? `${n1(p.mult)}x` : '–', `{{dcf.sotp.parts.${i}.value|num}}`, `{{dcf.sotp.parts.${i}.perShare|num}}`, VP[i].metricLabel || '']);
const drTxt = s => `${shortName(s)} ${pc(drEv[s])}`;
const so = mv('sotp'), pe = mv('pe');
const WF = [part(/^Hotels/).perShare, part(/minorities/).perShare, part(/^EIH Associated/).perShare, part(/^Net cash/).perShare].map(v => Math.round(v * 10) / 10);
WF.push(Math.round(WF.reduce((t, v) => t + v, 0)));
const variant = (name, m, d) => { const mult = Math.round(m * (1 + d / 100) * 2) / 2; return [name, n1(m), pc(d), `${mult}x`, n0(tpAt(mult))]; };

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${hm.base}x Sep-28E EBITDA in a sum of the parts gives {{dcf.tp|inr}}; EIH is cheap against its past, but so is the whole sector`,
  blocks: [
    { h: 'How the street values EIH' },
    { p: 'Hotel companies in India are valued on **EV/EBITDA** (enterprise value ÷ operating profit before depreciation): the published IHCL and ITC Hotels reports and every broker that disclosed a method for them use FY28E or Jun-28E EBITDA, and EIH\'s own coverage used two-year-forward EV/EBITDA. We use the same method on Sep-28E EBITDA (½ FY28E + ½ FY29E, the 12-month-forward year the market will look at in September 2027), in a sum of the parts that deducts minorities, adds the listed associate at market value less 20% and adds net cash, as for IHCL.' },
    { h: 'Our sum of the parts' },
    { p: `The hotels (incl. flight catering) are valued on 100% of Sep-28E operating EBITDA (₹${n0(hotelSep28)} cr), with lease liabilities in net cash. Minorities took ~${MIN_PCT}% of profit before minorities in FY25-26, so we deduct ${MIN_PCT}% of the hotel EV (₹${n0(minPs)} a share). EIH Associated Hotels (36.81%, listed) is at its ${ASOF_TXT} market value (₹${n0(eaMv)} cr) less 20%, replacing its ₹${EA.bookCr} cr book value in the model's cash; the other JVs (Avis India, Oberoi Mauritius, La Roseraie) stay at book. Net cash is the model's Sep-28E figure (cash and investments less lease liabilities).` },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case)', head: ['Part', 'Sep-28E metric (₹ cr)', 'Multiple', 'Value (₹ cr)', '₹ / share', 'Basis'], wide: [5], rows: [
      ...partRows,
      { hl: true, cells: ['**Equity value / target (rounded)**', '', '', '**{{dcf.sotp.equity|num}}**', '**{{dcf.tp|num}}**', 'vs price ₹{{P.last|num}}: {{dcf.upside|chg}}'] },
    ], source: 'GAM Research' } },
    { pair: [
      { type: 'waterfall', title: 'The hotels are ~90% of the value', unit: '₹ per share (base case)', x: ['Hotels', 'Minorities', 'EIH Associated Hotels uplift', 'Net cash Sep-28E', 'SOTP value'], series: [{ name: '₹/share', values: WF }], fmt: 'num', totalFmt: 'num', source: 'GAM Research' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['Sum of the parts (target)', 'P/E cross-check', 'DCF cross-check', 'Axis Capital', 'Share price'], series: [{ name: 'Value', values: [Math.round(so.value), Math.round(pe.value), Math.round(mv('dcf').value), axis.tp, price], fmt: 'inr' }], labels: 'all', highlight: 'Sum of the parts (target)', source: 'GAM Research; Business Upturn (29-Sep-2026)' },
    ] },
    { h: 'How we derive the multiple' },
    { p: `House rule: start from the stock's own one-year-forward EV/EBITDA, adjust for how far the sector had moved against its own history by ${ASOF_TXT}, then test growth, peers, returns and the street. (1) **Window.** EIH's EBITDA broke from Covid losses (FY21 −₹354 cr, FY22 −₹34 cr) to ₹599 cr in FY23; on realised forward EBITDA the 2021-22 multiples look artificially low because the market could not see the rebound, so the turnaround rule starts the window at the break (1-Apr-2022), as for IHCL, and measures the peers' move over the same window; the since-2021 median is a sensitivity. (2) **EV includes minorities**, because the SOTP values 100% of EBITDA and then deducts them (gross-up ~4-6%); without it the median is ${n1(HEVplain.med)}x. (3) **Peers.** Three usable peers remain (IHCL, ITC Hotels, Lemon Tree), the minimum, so the set is not widened: Chalet is out (residential flat sales in its trailing EBITDA) and ITC Hotels is measured over the window it has (since ${shortDate(ITC_WIN)}, listing months skipped). Subsets are sensitivity rows.` },
    { exhibit: { type: 'table', title: 'Deriving the EV/EBITDA multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Own history', `One-year-forward EV/EBITDA since ${shortDate(WIN)}: median ${n1(HEV.med)}x (25th-75th percentile ${n1(HEV.p25)}-${n1(HEV.p75)}x); calendar medians 2022 ${n1(HEVy('2022').med)}x, 2023 ${n1(HEVy('2023').med)}x, 2024 ${n1(HEVy('2024').med)}x, 2025 ${n1(HEVy('2025').med)}x, 2026 ${n1(HEVy('2026').med)}x. Trough years left out: ${troughEv.length ? troughEv.join(', ') : 'none'}. On ${ASOF_TXT}: ${n1(evNow.gross)}x FY28E`, `Starting point: ${n1(HEV.med)}x`],
      ['2. Sector move', `Trailing EV/EBITDA on ${ASOF_TXT} vs each stock's median over the window: ${CORE.map(drTxt).join(', ')} (median ${pc(sectorDrEv)}); EIH itself ${pc(drEv.EIHOTEL)}. Left out: ${LEFT_OUT.map(drTxt).join(', ')} (residential flat sales in trailing EBITDA)`, `${n1(HEV.med)}x × ${(1 + sectorDrEv / 100).toFixed(3)} = ${n1(evAfter)}x → **${hm.base}x**`],
      ['3. Growth', `Operating EBITDA grew ${Math.round(ebitdaCagrHist)}% a year over FY23-26 (the post-Covid rebound); we forecast ~${Math.round(ebitdaCagrFwd)}% for FY26-29E with no new owned rooms before FY29`, 'Slower than the history the median was earned on: no premium'],
      ['4. Peers', `Trailing EV/EBITDA on ${ASOF_TXT}: EIH ${n1(PR.EIHOTEL.evEbitda)}x, IHCL ${n1(PR.INDHOTEL.evEbitda)}x, ITC Hotels ${n1(PR.ITCHOTELS.evEbitda)}x, Lemon Tree ${n1(PR.LEMONTREE.evEbitda)}x, Chalet ${n1(PR.CHALET.evEbitda)}x`, `EIH has traded at a discount to IHCL throughout (medians ${n1(MED.EIHOTEL.ev)}x vs ${n1(MED.INDHOTEL.ev)}x): slower growth, owned model`],
      ['5. Returns', `ROCE ${Math.round(X.A.roce[X.b])}% (FY26, Screener) vs a ${n1(V.ke)}% cost of equity on a net-cash balance sheet`, 'Supports a multiple in line with its own history, not above'],
      ['6. Street and market', `Axis Capital ₹${axis.tp} ≈ ${n1(streetMultFor(axis.tp))}x Sep-28E on our numbers; at the ${ASOF_TXT} price the market pays ~${n1(impliedHotelMult)}x`, `Our ${hm.base}x is close to the market, below Axis`],
    ], source: `Screener.in prices, balance sheets and multiples to ${ASOF_TXT}; GAM Research` } },
    { exhibit: { type: 'table', title: 'Sensitivity of the multiple and target to the derivation choices', head: ['Variant', 'Own median', 'Sector move', 'Multiple', 'Approx. target (₹)'], rows: [
      [`**Base: since ${shortDate(WIN)}, EV incl. minorities, IHCL + ITC Hotels + Lemon Tree**`, n1(HEV.med), pc(sectorDrEv), `${hm.base}x`, '{{dcf.tp|num}}'],
      variant('Since Apr-2021 (no turnaround window)', HEV21.med, sectorDrEv), variant('EV without the minority gross-up', HEVplain.med, sectorDrEv),
      variant('Five-year peer medians', HEV.med, sens.five), variant('Adding Chalet', HEV.med, sens.withChalet), variant('Without ITC Hotels (IHCL + Lemon Tree)', HEV.med, sens.exItc),
      variant('Without IHCL (ITC Hotels + Lemon Tree)', HEV.med, sens.exIhcl), variant('EIH\'s own move instead of the sector\'s (not the house rule)', HEV.med, drEv.EIHOTEL), variant('No sector adjustment (own median only)', HEV.med, 0),
    ], source: 'GAM Research (each row re-prices the hotels, net of minorities, at the variant multiple, all else equal)' } },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(HEV.med)}x since Apr-2022, target ${hm.base}x`, unit: 'EV incl. minorities and leases ÷ next full-year EBITDA (x)', x: X.fwdEvChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.fwdEvChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: hm.base, text: `Target: ${hm.base}x`, color: '#cf8f1f' }], source: 'Screener.in; GAM estimates for FY27-29E' },
      { type: 'hbar', title: 'Peers: trailing EV/EBITDA now vs their medians', unit: `EV/EBITDA (x), ${ASOF_TXT} vs median since Apr-2022 (ITC Hotels since Apr-2025)`, x: X.PEER_SYMS.map(shortName), series: [{ name: `${ASOF_TXT}`, values: X.PEER_SYMS.map(s => PR[s].evEbitda), fmt: 'x' }, { name: 'Median', values: X.PEER_SYMS.map(s => Math.round(MED[s].ev * 10) / 10), fmt: 'x' }], labels: 'all', source: 'Screener.in' },
    ] },
    ...require('./EIHOTEL.part5b').blocks,
  ],
};

module.exports = { street, valuation, risks: require('./EIHOTEL.part5b').risks };
