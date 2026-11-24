// ITC Hotels report, part 5: street view and valuation (SOTP on EV/EBITDA primary; multiple derivation; cross-checks in part5b).
const X = require('./ITCHOTELS.ctx');
const { D, F, V, AS, n0, n1, pc, ASOF, ASOF_TXT, WIN, LISTED, price, sh, mv, P, VP, part, hm, hotelSep28, HEV, HEVcons, HEVlist, HEVy, evNow, PR, MED, drEv, CORE, LEFT_OUT,
  sectorDrEv, sens, evAfter, evBull, evBear, shortName, rating, ST, medAll, impliedHotelMult, streetMultOnOurs, ebitdaCagrFwd, shortDate, tpAt, perTurn, INV } = X;

const SN = D.street || {};
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: SN.title || 'The street',
  blocks: [
    { p: SN.text || '' },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: (D.critiques || []).map(r => [r]), source: 'Broker notes, filings and press to 30-Sep-2026; GAM Research' } },
  ],
};

const streetRows = ST.map(s => [s.broker, s.rating, n0(s.tp), shortDate(s.date), s.method || 'n.d.', s.multiple || '–', s.on || '–', s.thesis]);
const partRows = P.map((p, i) => [`**${p.name}**`, VP[i].seg || VP[i].netCash ? `{{dcf.sotp.parts.${i}.metric|num}}` : '–', VP[i].multiple ? `${n1(p.mult)}x` : '–', `{{dcf.sotp.parts.${i}.value|num}}`, `{{dcf.sotp.parts.${i}.perShare|num}}`, VP[i].metricLabel || '']);
const drTxt = s => `${shortName(s)} ${pc(drEv[s])}`;
const so = mv('sotp'), pe = mv('pe');
const WF = [part(/^Hotels/).perShare, part(/^Sapphire/).perShare, part(/^Net cash/).perShare].map(Math.round); WF.push(WF.reduce((t, v) => t + v, 0));
const variant = (n, m, d) => { const mult = Math.round(m * (1 + d / 100) * 2) / 2; return [n, n1(m), pc(d), `${mult}x`, n0(tpAt(mult))]; };

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${hm.base}x Sep-28E hotel EBITDA plus cash and the Colombo apartments gives {{dcf.tp|inr}}; the stock fell further than its peers`,
  blocks: [
    { h: 'How the street values ITC Hotels' },
    { p: SN.methodText || '' },
    { exhibit: { type: 'table', title: 'How the street values ITC Hotels (latest note per broker, to 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Method', 'Multiple', 'On', 'Thesis / note'], wide: [5, 7], rows: [
      ...streetRows,
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '30-Sep-26', '**SOTP: EV/EBITDA**', `**${hm.base}x hotel EBITDA**`, '**Sep-28E**', 'Fine hotels, ordinary growth; the de-rating went further than the sector\'s'] },
    ], source: SN.src || 'Broker notes as cited in deep.json; n.d. = not disclosed' } },
    { h: 'Our sum of the parts' },
    { p: `Hotels are valued on Sep-28E hotel EBITDA excluding the Colombo apartments (₹${n0(hotelSep28)} cr). The apartments are valued as an asset, not a profit stream: the ₹${n0(INV)} cr of unsold inventory at cost (Mar-2026) at 80% (bull 90%, bear 70%) for the time it will take to sell and the Sri Lankan tax and currency risk; the margin on apartments handed over by Sep-28E is in our net cash. Net cash is the model's Sep-28E figure: cash, deposits and investments (incl. ₹126 cr of associates at book) less ₹74 cr of leases, after our capex, acquisitions and dividends. Minorities are ~0.4% of profit and sit in the tax line, so no separate deduction.` },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case)', head: ['Part', 'Sep-28E metric (₹ cr)', 'Multiple', 'Value (₹ cr)', '₹ / share', 'Basis'], wide: [5], rows: [
      ...partRows,
      { hl: true, cells: ['**Equity value / target (rounded)**', '', '', '**{{dcf.sotp.equity|num}}**', '**{{dcf.tp|num}}**', 'vs price ₹{{P.last|num}}: {{dcf.upside|chg}}'] },
    ], source: 'GAM Research' } },
    { pair: [
      { type: 'waterfall', title: 'Hotels are ~90% of the value', unit: '₹ per share (base case)', x: ['Hotels', 'Sapphire inventory', 'Net cash Sep-28E', 'SOTP value'], series: [{ name: '₹/share', values: WF }], fmt: 'num', totalFmt: 'num', source: 'GAM Research' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['Sum of the parts (target)', 'P/E cross-check', 'DCF cross-check', 'Share price'], series: [{ name: 'Value', values: [Math.round(so.value), Math.round(pe.value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'Sum of the parts (target)', source: 'GAM Research' },
    ] },
    { h: 'How we derive the multiple' },
    { p: `House rule: start from the stock's own one-year-forward EV/EBITDA, adjust for how far the sector had moved against its own history by ${ASOF_TXT}, then test growth, peers, returns and the street. Three choices follow the settled rules. (1) **Window.** ITC Hotels listed on ${shortDate(LISTED)}; there is no earlier price. Following the recently-listed rule we skip the listing months (Feb-Mar 2025, when index funds and ITC holders who did not want a hotel stock sold and before the first stand-alone annual results) and start on ${shortDate(WIN)}: ${HEV.n} weekly closes to ${ASOF_TXT}. (2) **Same-window sector move.** The peers' move is measured against their own medians over the same window, not five years. The hotel peer set is IHCL's: IHCL, EIH and Lemon Tree; Chalet is excluded as in IHCL's report (₹163 cr of flat-sale EBITDA in its trailing numbers) and shown as a sensitivity. Three usable peers remain, the minimum we accept; we say so plainly. (3) **Hotel EV.** EV is market value less net cash (latest March balance sheet published by each date) less the apartment inventory at 80% of book, divided by next-year hotel EBITDA (FY27E for Apr-25 to Mar-26 dates, FY28E after), consistent with the SOTP; the consolidated version gives ${n1(HEVcons.med)}x.` },
    { exhibit: { type: 'table', title: 'Deriving the EV/EBITDA multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Own history', `One-year-forward hotel EV/EBITDA since ${shortDate(WIN)}: median ${n1(HEV.med)}x (25th-75th percentile ${n1(HEV.p25)}-${n1(HEV.p75)}x; range ${n1(HEV.min)}-${n1(HEV.max)}x); Apr-Dec 2025 ${n1(HEVy('2025-04-01', '2025-12-31').med)}x, 2026 ${n1(HEVy('2026-01-01', ASOF).med)}x. No trough years. On ${ASOF_TXT}: ${n1(evNow.hot)}x FY28E`, `Starting point: ${n1(HEV.med)}x`],
      ['2. Sector move (same window)', `Trailing EV/EBITDA on ${ASOF_TXT} vs each stock's median since ${shortDate(WIN)}: ${CORE.map(drTxt).join(', ')} (median ${pc(sectorDrEv)}). ITC Hotels itself ${pc(drEv.ITCHOTELS)} (not used). Left out: ${LEFT_OUT.map(drTxt).join(', ')} (flat sales in trailing EBITDA)`, `${n1(HEV.med)}x × ${(1 + sectorDrEv / 100).toFixed(3)} = ${n1(evAfter)}x → **${hm.base}x**`],
      ['3. Growth', `We forecast EBITDA growth of ~${Math.round(ebitdaCagrFwd)}% a year over FY26-29E (hotels ~${Math.round((Math.pow(X.SEG.hotel.adjEbitda[2] / 1360, 1 / 3) - 1) * 100)}%); the median was set when the market expected a faster asset-light story`, 'No premium'],
      ['4. Peers', `Trailing EV/EBITDA on ${ASOF_TXT}: IHCL ${n1(PR.INDHOTEL.evEbitda)}x, ITC Hotels ${n1(PR.ITCHOTELS.evEbitda)}x, Chalet ${n1(PR.CHALET.evEbitda)}x, EIH ${n1(PR.EIHOTEL.evEbitda)}x, Lemon Tree ${n1(PR.LEMONTREE.evEbitda)}x`, `${hm.base}x Sep-28E ≈ ${n1(hm.base * hotelSep28 / 1360)}x FY26 hotel EBITDA: below IHCL, above EIH`],
      ['5. Returns', `ROE ~7% and pre-tax ROCE ~11% (FY26) vs a ${n1(V.ke)}% cost of equity`, 'Argues against any premium'],
      ['6. Street and market', `${SN.streetMultTxt || 'Street multiples: see table'}. At the ${ASOF_TXT} price the market pays ~${n1(impliedHotelMult)}x Sep-28E hotel EBITDA once cash and the apartments are valued our way`, `Our ${hm.base}x sits between the market and the street`],
    ], source: `Screener.in prices, balance sheets and multiples to ${ASOF_TXT}; broker notes; GAM Research` } },
    { exhibit: { type: 'table', title: 'Sensitivity of the multiple and target to the derivation choices', head: ['Variant', 'Own median', 'Sector move', 'Multiple', 'Approx. target (₹)'], rows: [
      [`**Base: since ${shortDate(WIN)}, IHCL + EIH + Lemon Tree, same window**`, n1(HEV.med), pc(sectorDrEv), `${hm.base}x`, '{{dcf.tp|num}}'],
      variant(`Since listing (${shortDate(LISTED)}), peers over the same window`, HEVlist.med, sens.listing),
      variant('Five-year peer medians (not the same window)', HEV.med, sens.five),
      variant('Adding Chalet (four peers)', HEV.med, sens.withChalet),
      variant('Without IHCL (EIH + Lemon Tree only)', HEV.med, sens.exIhcl),
      variant('Consolidated EV/EBITDA history (apartments not stripped)', HEVcons.med, sectorDrEv),
      variant('No sector adjustment (own median only)', HEV.med, 0),
    ], source: 'GAM Research (each row re-prices the hotels at the variant multiple, all else equal)' } },
    { pair: [
      { type: 'line', title: `Forward hotel EV/EBITDA since listing: median ${n1(HEV.med)}x since Apr-25, ${n1(evNow.hot)}x now`, unit: 'EV (market value less net cash and 80% of apartment inventory) ÷ next full-year hotel EBITDA (x)', x: X.fwdEvChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.fwdEvChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: hm.base, text: `Target: ${hm.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; AR FY25-26 balance sheets; FY26 actual, GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Peers: trailing EV/EBITDA now vs their medians since Apr-2025', unit: `EV/EBITDA (x), ${ASOF_TXT} vs median`, x: X.PEER_SYMS.map(shortName), series: [{ name: ASOF_TXT, values: X.PEER_SYMS.map(s => PR[s].evEbitda), fmt: 'x' }, { name: 'Median since Apr-2025', values: X.PEER_SYMS.map(s => Math.round(MED[s].ev * 10) / 10), fmt: 'x' }], labels: 'all', source: 'Screener.in' },
    ] },
    ...require('./ITCHOTELS.part5b').blocks,
  ],
};

module.exports = { street, valuation, risks: require('./ITCHOTELS.part5b').risks };
