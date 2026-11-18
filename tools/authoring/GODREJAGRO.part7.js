// Godrej Agrovet initiation, part 7: valuation (street table, SOTP, multiple derivation with trough
// years left out, cross-checks, scenarios, DCF, peers).
const X = require('./GODREJAGRO.ctx');
const { F, V, AS, n0, n1, price, sh, P, VP, mv, BR, dmy, rating, peFm, peByFy, evMed, evMedAll, evTroughYears, evByFy, evChart, sectorDerate, sectorDerateEv, derivedPe, derivedGroup,
  PEERS, PEER_SYMS, FEED, DAIRY, OIL, AGRO, pname, opsMult, impliedOpsMult, evAtClose, tpEvFy28, ASOF_TXT, opsEbitda, unallocSep28, GA } = X;
const partRows = P.map((p, i) => [`**${p.name}**`, p.metric != null && !VP[i].netCash ? `{{dcf.sotp.parts.${i}.metric|num}}` : '–', VP[i].multiple ? `${p.mult}x` : '–', `{{dcf.sotp.parts.${i}.value|num}}`, `{{dcf.sotp.parts.${i}.perShare|num}}`, VP[i].note || VP[i].metricLabel || '']);
const pe = mv('pe'), dc = mv('dcf'), so = mv('sotp');
const pctv = v => `${v >= 0 ? '+' : ''}${Math.round(v)}%`;
const r = v => Math.round(v);
const mlt = k => VP.find(p => p.seg === k).multiple;
const peerTxt = syms => syms.map(s => `${pname(PEERS[s])} ${n1(PEERS[s].evEbitda)}x`).join(', ');

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: sum of the parts gives {{dcf.tp|inr}}',
  blocks: [
    { h: 'How the street values Godrej Agrovet' },
    { p: 'Brokers value GAVL as a **sum of the parts (SOTP)**: each business on EV/EBITDA (enterprise value to operating profit) for FY28E, the listed Astec stake at market value less a holding-company discount, the Bangladesh JV separately, less net debt. Motilal Oswal publishes the full build (Aug-2026); ICICI Securities also uses SOTP. A single group P/E would mix a 20%-margin plantation business with 2%-margin dairy and a loss-making chemicals company, so we use the street\'s method; the differences are in the inputs.' },
    { exhibit: { type: 'table', title: 'How the street values the stock (latest note per broker, to 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Method', 'Multiples', 'Thesis / note'], wide: [5, 6], rows: [
      ...BR.map(b => [b.broker, b.rating, n0(b.tp), dmy(b.date), b.method || 'n.d.', b.multiple || 'n.d.', b.thesis]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '30-Sep-26', '**SOTP EV/EBITDA, Sep-28E**', `**Feed ${mlt('an').base}x, oil palm ${mlt('veg').base}x, crop care ${mlt('cc').base}x, dairy ${mlt('dairy').base}x, foods ${mlt('food').base}x; Astec at market −20%**`, 'Palm-oil profits normalise; weak businesses recover slowly'] },
    ], source: 'Broker notes and research-report records to 30-Sep-2026; n.d. = not disclosed in the public summary' } },
    { h: 'Our sum of the parts' },
    { p: 'The target is a 12-month price, so each business is valued on the EBITDA the market will look at in September 2027: **Sep-28E** (half FY28E, half FY29E). Astec is valued at its 30-Sep-2026 market value less 20%; because Astec\'s market value is already net of its own debt, we add its debt back to the consolidated net debt. The ACI JV is valued on P/E and its book value removed from the model\'s net cash. Central costs are valued at the EBITDA-weighted average of the business multiples.' },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case)', head: ['Part', 'Sep-28E EBITDA (₹ cr)', 'EV/EBITDA', 'Value (₹ cr)', '₹ / share', 'Basis'], wide: [5], rows: [
      ...partRows,
      { hl: true, cells: ['**Equity value / target (rounded)**', '', '', '**{{dcf.sotp.equity|num}}**', '**{{dcf.tp|num}}**', 'vs price ₹{{P.last|num}}: {{dcf.upside|chg}}'] },
    ], source: 'GAM Research' } },
    { h: 'How we derive the multiples' },
    { p: `House rule: start from the stock's own one-year-forward multiple since Apr-2021, leaving out trough years (forward earnings a loss or below half the best of the previous three years). There are none for GAVL: the worst year, FY23, still earned 75% of FY22. The forward P/E median is ${n1(peFm.median)}x and the forward EV/EBITDA median ${n1(evMed)}x. Then we cut for how far comparable stocks have de-rated by ${ASOF_TXT}. EV/EBITDA is the street's yardstick and the one our SOTP uses; P/E is our relative cross-check.` },
    { exhibit: { type: 'table', title: 'Deriving the multiples', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Own forward P/E (house rule)', `Median ${n1(peFm.median)}x since Apr-2021, no trough years left out (${peFm.troughYears.length ? peFm.troughYears.join(', ') : 'none qualify'}). By forward year: ${Object.entries(peByFy).map(([k, v]) => `${k} ${v}x`).join(', ')}`, `P/E cross-check: ${n1(peFm.median)}x × ${(1 + sectorDerate / 100).toFixed(2)} = **${n1(derivedPe)}x** Sep-28E EPS`],
      ['2. Own forward EV/EBITDA (same rule)', `Median ${n1(evMed)}x since Apr-2021 (${evTroughYears.length ? 'excl. ' + evTroughYears.join(', ') : 'no trough years'}; ${n1(evMedAll)}x on all dates). By forward year: ${Object.entries(evByFy).map(([k, v]) => `${k} ${v}x`).join(', ')}. ${n1(evAtClose)}x FY28E at the ${ASOF_TXT} close`, 'The market has paid 13-18x forward EBITDA in most years'],
      ['3. Sector de-rating', `Twelve feed, dairy, edible-oil and crop-protection peers: median P/E ${r(sectorDerate)}% and EV/EBITDA ${r(sectorDerateEv)}% vs their five-year medians (Avanti ${r(PEERS.AVANTIFEED.evVs)}%, Venky's ${r(PEERS.VENKEYS.evVs)}%, Dodla ${r(PEERS.DODLA.evVs)}%, Bayer ${r(PEERS.BAYERCROP.evVs)}%, Dhanuka ${r(PEERS.DHANUKA.evVs)}%, PI ${r(PEERS.PIIND.evVs)}% on EV/EBITDA). GAVL itself: P/E ${r(GA.peVs)}%, EV/EBITDA ${r(GA.evVs)}%`, `Group: ${n1(evMed)}x × ${(1 + sectorDerateEv / 100).toFixed(2)} ≈ **${n1(derivedGroup)}x** EV/EBITDA`],
      ['4. Peers by business (trailing, 30-Sep-2026)', `Feed: ${peerTxt(FEED)}. Dairy: ${peerTxt(DAIRY)}. Edible oil: ${peerTxt(OIL)}. Crop protection: ${peerTxt(AGRO.filter(s => s !== 'UPL'))}`, `Spread around the group multiple: dairy and crop care above, feed and oil palm at or below`],
      ['5. Growth and quality', `Sep-28E EBITDA ₹${n0(opsEbitda - unallocSep28)} cr ex-Astec (FY26 ₹${n0(864 + 4)} cr); oil palm and feed grow, but palm margins fall from war-time levels; dairy and foods earn 3-6% margins and ~5-10% ROCE`, 'No premium to the derived multiple'],
      ['6. Street', `Motilal Oswal: 10x FY28E standalone (feed, palm, crop protection), 11x Creamline, Godrej Foods and ACI; Astec at market −20%`, 'Our multiples are ~1x higher, on lower EBITDA'],
      ['**Result**', `Feed ${mlt('an').base}x, oil palm ${mlt('veg').base}x, crop care ${mlt('cc').base}x, dairy ${mlt('dairy').base}x, foods ${mlt('food').base}x: an EBITDA-weighted **${n1(opsMult)}x** after central costs. Our target implies ${n1(tpEvFy28)}x FY28E on the yardstick-2 basis (incl. Astec and the JV)`, `In line with the ${n1(derivedGroup)}x derived group multiple`],
    ], source: `Screener.in (prices, balance sheets, peer multiples to ${ASOF_TXT}), Motilal Oswal (6-Aug-2026), GAM Research` } },
    { pair: [
      { type: 'line', title: 'Forward EV/EBITDA since 2021 and our derived multiple', unit: 'EV ÷ next full-year EBITDA (x)', x: evChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: evChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: evMed, text: `Median: ${n1(evMed)}x` }, { v: derivedGroup, text: `De-rated: ${n1(derivedGroup)}x`, color: '#cf8f1f' }], source: 'Screener.in; EV = market value + borrowings − cash − investments; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['Sum of the parts (target)', 'P/E (cross-check)', 'DCF (cross-check)', 'Share price'], series: [{ name: 'Value', values: [r(so.value), r(pe.value), r(dc.value), price], fmt: 'inr' }], labels: 'all', highlight: 'Sum of the parts (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**Sum of the parts**', '**Target**', 'Sep-28E EBITDA by business; Astec at market −20%; ACI on P/E', `blend ${n1(opsMult)}x (±2x per business in bull/bear)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['P/E', 'Cross-check', `Sep-28E EPS ₹${n1(pe.metric)}`, `${pe.mult}x (bull ${pe.multiple.bull}x, bear ${pe.multiple.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pctv(pe.vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', '12-year FCFF, WACC 11.9%, g 5.5%', `implies ${n1(V.intrinsicTp / F.eps[2])}x FY29E EPS`, '{{dcf.blend.methods.2.value|num}}', pctv(dc.vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs price', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** P/E on the stock's own de-rated history gives ₹${n0(pe.value)}: GAVL's P/E has been more generous than its EV/EBITDA because peers de-rated less on P/E (${r(sectorDerate)}%) than on EV/EBITDA (${r(sectorDerateEv)}%), and because the P/E counts Astec's and the JV's profits at the group multiple. The DCF gives ₹${n0(dc.value)}: it assumes the group EBITDA margin fades to 9% and capex keeps running, i.e. no premium for oil palm's long growth. The SOTP sits between the two. At the market price the six businesses are valued at ~${n1(impliedOpsMult)}x Sep-28E EBITDA after central costs, against our ${n1(opsMult)}x: the stock prices a little less than our base case, not a lot less.` },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs price', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} FY28E EPS ₹${n1(X.SC.bull.eps[1])}; multiples +2x (half the sector de-rating reverses); Astec at −10%.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Feed margin 8.0%, oil palm 20.5% / 19.5% / 19.5%, crop care 28-30%, Astec 3-9%, dairy 2.5-4%, foods 5-6.5%; FY28E EPS ₹${n1(F.eps[1])}; blend ${n1(opsMult)}x Sep-28E EBITDA.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} FY28E EPS ₹${n1(X.SC.bear.eps[1])}; multiples −2x (peers' current levels); Astec at −30%.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { p: `FCFF from FY28E to FY39E: explicit FY28-29E, then revenue growth fading to 8%, EBITDA margin to 9% (the FY20-26 range was 6-9%), capex to 2.8% and depreciation 2.2% of revenue; terminal growth 5.5%. The engine discounts at one rate: we set beta 0.9 so that it equals our WACC of ~11.9% (cost of equity ~12.5% at beta 1.0, weighted ~91%; post-tax cost of debt ~6%, ~9%). Model net debt at Mar-27E (₹${n0(-F.treasury[0])} cr) is deducted; the DCF does not separately add Astec's market value or the JV, and it ignores Astec's minorities.` },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-39E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: model net cash at Mar-27E (negative = net debt)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): WACC down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers (trailing multiples at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'ROE', 'P/E (x)', '5-yr median P/E', 'EV/EBITDA (x)', '5-yr median EV/EBITDA'], rows: PEER_SYMS.map(s => PEERS[s]).map(p => [p.symbol === 'GODREJAGRO' ? '**Godrej Agrovet**' : `${pname(p)}${FEED.includes(p.symbol) ? ' (feed)' : DAIRY.includes(p.symbol) ? ' (dairy)' : OIL.includes(p.symbol) ? ' (edible oil)' : AGRO.includes(p.symbol) ? ' (crop prot.)' : ' (subsidiary)'}`, n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', p.roe + '%', p.pe > 0 && p.pe < 80 ? n1(p.pe) : 'n.m.', p.pe5 && p.pe5 < 60 ? n1(p.pe5) : 'n.m.', p.evEbitda > 0 ? n1(p.evEbitda) : 'n.m.', p.ev5 && p.ev5 < 60 ? n1(p.ev5) : 'n.m.']), source: `Screener.in: trailing P/E and EV/EBITDA at the NSE close on ${ASOF_TXT}; five-year medians of weekly values (Oct-2021 to Sep-2026; n.m. above 60x); ROE on Screener total profit` } },
  ],
};

module.exports = { valuation };
