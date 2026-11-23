// Eicher Motors report, part 5: the street and the valuation (SOTP: Royal Enfield P/E + VECV P/E, carried in the
// engine as an implied P/E on consolidated Sep-28E EPS; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./EICHERMOT.ctx');
const { D, F, V, A, AS, SC, n0, n1, pc, rup, price, mv, FM, ASH, ashP25, reSeries, reMed, reP25, reP75, sectorDr, sectorDrAll, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, SOTP, epsSep, vecvSep28, consMultAlt, evMed, evP25, evMULT, ttmEbitda, ebitdaSep28, rating, ST, postQ1, medTp, shortDate, ASOF_TXT, fwdNow } = X;
const S = SOTP.base, SB = SOTP.bull, SR = SOTP.bear;
const r10 = v => Math.round(v / 10) * 10;
const two = (a => a[Math.floor(a.length / 2)])(FM.series.filter(x => x[0] >= '2024-10-01').map(x => x[1]).sort((x, y) => x - y));
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: mostly Buy/Add, targets ₹7,600-9,200, all on 27-35x for Royal Enfield`,
  blocks: [
    { p: `Six houses published around the Q1FY27 results (29-Jul to 30-Sep-2026): ICICI Securities Buy ₹9,160, Prabhudas Lilladher Accumulate ₹8,300, Choice Add ₹8,200, Kotak Add ₹8,200, Baroda BNP Paribas Hold ₹7,791 and Motilal Oswal Neutral ₹7,598: median ₹${n0(medTp)}, ~${Math.round((medTp / price - 1) * 100)}% above the ${ASOF_TXT} close of ₹${n0(price)}. Earlier notes still standing include Elara Buy ₹9,001, Nuvama Buy ₹8,100 and JM Financial Reduce ₹7,240 (May-2026), and Jefferies ₹8,800, Citi ₹8,300, CLSA ₹8,066 and Macquarie ₹7,479 (Feb-2026). Almost every house uses a **sum of the parts: Royal Enfield on 27-35x FY28E P/E (median ~30x) and VECV on 10-13x EV/EBITDA or 18-25x P/E**. Bulls focus on premiumisation, capacity and exports; the neutrals on margins (volume over profit), exports and valuation.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes and call transcripts to 30-Sep-2026' } },
  ],
};

const ourAt = s => { const m = s.multiple.match(/RE (\d+(?:\.\d+)?)x P\/E/) || s.multiple.match(/(?:Core|2W) (\d+(?:\.\d+)?)x/); return m ? n0(r10(+m[1] * S.reEps + S.ve)) : '–'; };
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: a sum of the parts gives {{dcf.tp|inr}}; the market pays ~${Math.round(price / F.eps[1])}x FY28E against a ${Math.round(FM.median)}x history`,
  blocks: [
    { h: 'How the street values Eicher' },
    { p: 'We use the street\'s method so our target is comparable: Royal Enfield on P/E and VECV separately, on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s Royal Enfield multiple to our Sep-28E Royal Enfield EPS and adds our VECV value: most of the gap to the street is the multiple.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple, s.on, ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**SOTP**', `**RE ${MULT.re.base}x P/E; VECV ${MULT.vecv.base}x P/E**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Great franchise; the multiple the market pays is above its own history'] },
    ], source: 'ICICI Direct, PL and MOSL notes (PDFs); Kotak PCG one-pager; Choice via Investment Guru; Baroda BNP via search summary (site check blocked); Nuvama, Elara, JM via Business Today (25-May-2026); Jefferies, Citi, CLSA, Macquarie via Business Today (11-Feb-2026)' } },
    { h: `Our sum of the parts: Royal Enfield ${MULT.re.base}x, VECV ${MULT.vecv.base}x` },
    { exhibit: { type: 'table', title: 'Sum of the parts (₹ per share)', head: ['Part', 'Metric (Sep-28E)', 'Multiple', 'Value', 'Bull', 'Bear', 'Basis'], wide: [6], rows: [
      ['**Royal Enfield** (incl. treasury income)', `EPS ex-VECV ₹${n1(S.reEps)}`, `${MULT.re.base}x (bull ${MULT.re.bull}x, bear ${MULT.re.bear}x)`, n0(S.re), n0(SB.re), n0(SR.re), 'Consolidated Sep-28E EPS less Eicher\'s VECV share per share'],
      ['**VECV (54.4%)**', `Share of profit ₹${n1(vecvSep28)}`, `${MULT.vecv.base}x (bull ${MULT.vecv.bull}x, bear ${MULT.vecv.bear}x)`, n0(S.ve), n0(SB.ve), n0(SR.ve), 'No holding discount: Eicher books the profit directly'],
      { hl: true, cells: ['**Sum of the parts**', '', '', `**${n0(S.perShare)}**`, `**${n0(SB.perShare)}**`, `**${n0(SR.perShare)}**`, ''] },
      ['Implied P/E on consolidated Sep-28E EPS', `₹${n1(epsSep.base)}`, '', `${n1(S.implied)}x`, `${n1(SB.implied)}x`, `${n1(SR.implied)}x`, 'How the engine carries the SOTP (EICHERMOT.sotp.js)'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '**{{dcf.tp|inr}}**', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}', 'vs CMP ₹{{P.last|num}}: {{dcf.upside|chg}}'] },
    ], source: 'GAM Research. Treasury income stays inside Royal Enfield\'s EPS, as the street does (no separate cash line, so nothing is counted twice).' } },
    { exhibit: { type: 'table', title: 'Deriving the multiples (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Royal Enfield\'s own history', `One-year-forward P/E of the stock since Apr-2021: median ${n1(FM.median)}x (no trough years). Stripping out VECV (valued at the proxy's ${n1(ASH.median)}x on each date) gives Royal Enfield's own forward P/E: median ${n1(reMed)}x (25th-75th percentile ${n1(reP25)}-${n1(reP75)}x)`, `Starting point for RE: ${n1(reMed)}x`],
      ['2. VECV\'s own history (proxy)', `VECV is unlisted; the closest listed truck maker is Ashok Leyland: forward P/E median ${n1(ASH.median)}x on dates whose forward-year EPS is reported (Apr-2021 to Mar-2025; 25th percentile ${n1(ashP25)}x; no trough years)`, `Starting point for VECV: ${n1(ASH.median)}x`],
      ['3. Sector de-rating', `Auto-OEM peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded as distorted: ${EXCL.map(s => `${shortName(s)} (${pc(derate[s])})`).join(', ')}; with them the median is also ${pc(sectorDrAll)}. Eicher itself (${pc(derate.EICHERMOT)}) is not used`, `× ${k.toFixed(3)}`],
      ['4. Result (nearest half-turn)', `RE ${n1(reMed)}x × ${k.toFixed(3)} = ${n1(reMed * k)}x; VECV ${n1(ASH.median)}x × ${k.toFixed(3)} = ${n1(ASH.median * k)}x`, `**RE ${MULT.re.base}x; VECV ${MULT.vecv.base}x**`],
      ['5. Bull / bear', `Bull: no de-rating (RE ${n1(reMed)}x, VECV ${n1(ASH.median)}x). Bear: each part's 25th-percentile forward P/E, de-rated (RE ${n1(reP25)}x, VECV ${n1(ashP25)}x)`, `RE ${MULT.re.bull}x / ${MULT.re.bear}x; VECV ${MULT.vecv.bull}x / ${MULT.vecv.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; investor presentations (VECV share); GAM estimates for FY27-28E EPS in the forward series` } },
    { pair: [
      { type: 'line', title: `Forward P/E since 2021: consolidated vs Royal Enfield ex-VECV`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Eicher (consolidated)', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }, { name: 'Royal Enfield ex-VECV', values: reSeries.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.re.base, text: `Our RE multiple: ${MULT.re.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS and VECV share, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['SOTP (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'SOTP (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**SOTP (RE P/E + VECV P/E)**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)} (RE ₹${n1(S.reEps)} + VECV ₹${n1(vecvSep28)})`, `RE ${MULT.re.base}x, VECV ${MULT.vecv.base}x (= ${n1(S.implied)}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr + net cash`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA plus net cash) gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is Eicher's ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating and restated from trailing to Sep-28E EBITDA (₹${n0(ebitdaSep28)} cr vs ₹${n0(ttmEbitda)} cr in the year to Jun-26). The DCF gives ₹${n0(mv('dcf').value)} at an ${n1(V.ke)}% cost of equity and 6% terminal growth. Both count VECV only at its ₹3,723 cr book value inside net cash (we value it at ~₹${n0(Math.round(S.ve * F.shares / 100) * 100)} cr), so both understate it by ~₹${n0((S.ve * F.shares - 3723) / F.shares)} a share; even adjusted, they sit near our target. Three methods agree: ~₹6,000-6,500 is what the earnings support on history-based multiples.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: [
      ['Use the consolidated forward median for Royal Enfield', `${n1(FM.median)}x × ${k.toFixed(3)} = ${consMultAlt}x on RE EPS`, n0(r10(consMultAlt * S.reEps + S.ve))],
      ['Only the last two years of history', `Forward P/E median since Oct-2024: ${n1(two)}x consolidated (de-rated ${n1(two * k)}x)`, n0(r10(X.half(two * k) * epsSep.base))],
      ['No sector de-rating', `RE ${MULT.re.bull}x, VECV ${MULT.vecv.bull}x on base earnings`, n0(r10(MULT.re.bull * S.reEps + MULT.vecv.bull * vecvSep28))],
      ['Street median Royal Enfield multiple', 'RE 30x, VECV at ours', n0(r10(30 * S.reEps + S.ve))],
      ['Growth premium (PEG-style)', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E vs ~33% in FY21-26: if anything a discount`, 'not applied'],
      ['Returns premium', `ROE ~22-24% vs Ke ${n1(V.ke)}%; but it was similar through the history that set the median`, 'not applied'],
    ], source: 'GAM Research. Per PLAYBOOK §7c, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiples: RE ${MULT.re.bull}x, VECV ${MULT.vecv.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Volume +{{as.volume.growth.0|n1}}% / +{{as.volume.growth.1|n1}}% / +{{as.volume.growth.2|n1}}%; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; RE ${MULT.re.base}x, VECV ${MULT.vecv.base}x Sep-28E.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiples: RE ${MULT.re.bear}x, VECV ${MULT.vecv.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research. VECV profit is held at our base in all three scenarios; only its multiple changes.' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value (Royal Enfield)', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (incl. VECV at book value)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. The DCF values Royal Enfield\'s operating cash flows; VECV enters only at its carrying value inside net cash.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed auto peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'EICHERMOT' ? '**Eicher Motors**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. M&M and TVS Motor on Screener's standalone basis. Eicher's P/E includes the VECV share; its revenue excludes VECV.` } },
  ],
};

module.exports = { street, valuation };
