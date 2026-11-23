// Zydus Lifesciences report, part 5: the street and the valuation (P/E on Sep-28E EPS per post-buyback share;
// EV/EBITDA and DCF cross-checks; sensitivities; scenarios; DCF detail; peers).
const X = require('./ZYDUSLIFE.ctx');
const { D, F, V, A, AS, SC, n0, n1, pc, pc1, rup, price, mv, FM, HA, HH, fyMed, fwdAdj, troughAdj, MULT, IMPLIED, houseMult, epsSep, k, SECTOR_SET, sectorCalc, sectorCalcAll, derate, MED5, P, PEERS, USED, EXCL_SYMS, shortName,
  evMed, evP25, evP75, evMULT, ttmEbitda, ebitdaSep28, restate, rating, ST, postQ1, medTp, shortDate, ASOF_TXT, fwdNow, sepNow, SH_ADJ, SH_POST, SH_ENGINE, zwAtMarketPs, zwInPe, zwMinMkt, zwMinBook, half, pctl } = X;
const r10 = v => Math.round(v / 10) * 10;
const eps = epsSep.base, val = m => r10(m * eps);
const two = pctl(fwdAdj.filter(x => x[0] >= '2024-10-01').map(x => x[1]), 0.5);
const evPs = mv('ev').value * SH_ENGINE / SH_POST, evLessMinMkt = (mv('ev').value * SH_ENGINE - zwMinMkt) / SH_POST, evLessMinBook = (mv('ev').value * SH_ENGINE - zwMinBook) / SH_POST;
const dcfPs = mv('dcf').value * SH_ENGINE / SH_POST;
const drTxt = s => `${shortName(s)} ${pc1(derate[s])}`;
const ourAt = s => { const m = parseFloat(s.multiple); if (!m || s.method !== 'P/E') return '–'; const e = /FY27/.test(s.on) ? F.eps[0] : /12m|Sep-27/.test(s.on) ? (F.eps[0] + F.eps[1]) / 2 : /FY28|Mar-28/.test(s.on) ? F.eps[1] : null; return e ? n0(r10(m * e)) : '–'; };

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: Hold-ish, targets ₹970-1,255, all on 20-25x one-year-forward EPS`,
  blocks: [
    { p: `Three houses published after the Q1FY27 results (11-12 Aug-2026): Prabhudas Lilladher Accumulate ₹1,200 (25x FY28E), Motilal Oswal Neutral ₹1,125 (23x 12-month forward) and Deven Choksey Hold ₹1,255: median ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. Earlier notes still standing: JM Financial Reduce ₹970 (24x Mar-28 EPS, May-2026), Sharekhan Hold ₹990 (20x FY28E, Feb-2026), Systematix Buy ₹1,038 (25x FY27E, Jan-2026), ICICI Securities Hold ₹900 (Nov-2025). An S&P Global poll of 30 analysts in May-2026 averaged Hold and ₹1,067. Every house that discloses its method uses **P/E on one-year-forward consolidated EPS**; none values Zydus Wellness separately. The bulls point to India, emerging markets and the pipeline; the sceptics to US erosion and slow EPS growth.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes and call transcripts to 30-Sep-2026' } },
  ],
};

const peerRows = PEERS.map(p => [p.symbol === 'ZYDUSLIFE' ? '**Zydus Lifesciences**' : shortName(p.symbol) + (EXCL_SYMS.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), n1(MED5[p.symbol]), pc1(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']);
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ~${Math.round(sepNow)}x against an ${n1(HA.med)}x history`,
  blocks: [
    { h: 'How the street values Zydus' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our EPS for the same year; most of the gap to the street is the multiple, not the earnings.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple, s.on, ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'India and specialty are good; the US windfalls are gone and the multiple already assumes the replacement'] },
    ], source: 'PL and MOSL Q1FY27 notes; JM Financial (Business Standard broker tips PDF, May-2026); Sharekhan (Feb-2026); Systematix via Business Today (Jan-2026); Deven Choksey and ICICI Securities via the Trendlyne listing (reports behind a login)' } },
    { h: `Our multiple: ${MULT.base}x, derived` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1a. Own history, reported EPS (house forwardMedian)', `One-year-forward P/E since Apr-2021: median ${n1(FM.median)}x (25th-75th ${n1(HH.p25)}-${n1(HH.p75)}x). Trough years left out: ${FM.troughYears.join(', ')}. FY23 is flagged only because FY22's EPS (₹43.8) includes the animal-health sale gain; FY23's own EPS (₹19.4) carries ₹428 cr of exceptional charges`, `${n1(FM.median)}x (shown, not used)`],
      ['1b. Own history, EPS before one-offs (used)', `Same window and sampling on EPS before exceptional items and the FY22 gain (₹23.5 / 20.8 / 25.4 / 38.3 / 47.2 / 54.2 for FY21-26): median ${n1(HA.med)}x (25th-75th ${n1(HA.p25)}-${n1(HA.p75)}x; ${HA.n} points); no trough years${troughAdj.length ? ' except ' + troughAdj.join(', ') : ''}. By forward year: FY23 ${n1(fyMed.FY23.med)}x, FY24 ${n1(fyMed.FY24.med)}x, FY25 ${n1(fyMed.FY25.med)}x, FY26 ${n1(fyMed.FY26.med)}x, FY27 ${n1(fyMed.FY27.med)}x, FY28 ${n1(fyMed.FY28.med)}x`, `Starting point: ${n1(HA.med)}x`],
      ['2. Sector factor', `Pharma peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc1(sectorCalc)} (all 15 incl. the excluded: ${pc1(sectorCalcAll)}). PLAYBOOK §7c sets +${SECTOR_SET}% for Zydus; our reproduction differs by 0.02 points because Screener P/Es are rounded to one decimal. Pharma trades above its medians, so this is a re-rating. Zydus itself (${pc1(derate.ZYDUSLIFE)}) is not used`, `× ${k.toFixed(4)}`],
      ['3. Result (nearest half-turn)', `${n1(HA.med)}x × ${k.toFixed(4)} = ${n1(HA.med * k)}x`, `**${MULT.base}x**`],
      ['4. Applied to', `Sep-28E EPS per post-buyback share ₹${n1(eps)} (99.75 cr shares after the Jun-2026 buyback). The engine's EPS uses the FY26 count of 100.62 cr, so it carries ${IMPLIED.base}x of its own EPS (ZYDUSLIFE.mult.js): the same value`, `${MULT.base}x × ₹${n1(eps)} = ₹${n0(MULT.base * eps)}`],
      ['5. Bull / bear', `Bull: 75th percentile × factor (${n1(HA.p75)}x → ${MULT.bull}x). Bear: 25th percentile × factor (${n1(HA.p25)}x → ${MULT.bear}x). The low quartile is the FY24-25 forward years, when the market refused to capitalise windfall gRevlimid EPS`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices to ${ASOF_TXT}; company adjusted PAT (Aug-2026 corporate presentation); GAM estimates for FY27-28E EPS in the forward series` } },
    { exhibit: { type: 'table', title: 'Sector factor: pharma peers vs their own five-year median P/E (30-Sep-2026 close)', head: ['Company', 'Trailing P/E', '5-yr median', 'Premium / (discount)', 'Used?'], rows: [...USED, 'ZYDUSLIFE', ...EXCL_SYMS].map(s => [shortName(s), n1(P[s].pe), n1(MED5[s]), pc1(derate[s]), s === 'ZYDUSLIFE' ? 'No (self)' : EXCL_SYMS.includes(s) ? `No: ${D.peers.excluded[s]}` : 'Yes']).concat([[ '**Median of the eight peers used**', '', '', `**${pc1(sectorCalc)}**`, `PLAYBOOK §7c: +${SECTOR_SET}%`]]), source: 'Screener.in (trailing P/E at the NSE close; five-year median from 30-Sep-2021); peersAsOf' } },
    { pair: [
      { type: 'line', title: 'Forward P/E since 2021: reported vs before one-offs', unit: 'Price ÷ next full-year EPS (x)', x: fwdAdj.map(x => x[0]), series: [{ name: 'EPS before one-offs', values: fwdAdj.map(x => x[1]), fmt: 'x', thin: true }, { name: 'Reported EPS (house)', values: fwdAdj.map(x => (FM.series.find(y => y[0] === x[0]) || [])[1] ?? null), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; company adjusted EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case, per post-buyback share)', x: ['P/E (target)', 'EV/EBITDA (before minorities)', 'EV/EBITDA (less ZW minority at market)', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(evPs), Math.round(evLessMinMkt), Math.round(dcfPs), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(eps)} (post-buyback)`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr + engine net cash`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 5.5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research. Cross-check values are on the engine\'s FY26 share count (100.62 cr); per post-buyback share they are ~0.9% higher.' } },
    { callout: `**What the cross-checks tell us, honestly.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA: Zydus's ${n1(evMed)}x median trailing EV/EBITDA since 2021 × the sector factor, restated from trailing to Sep-28E EBITDA, ₹${n0(ebitdaSep28)} cr vs ₹${n0(ttmEbitda)} cr in the year to Jun-26) gives ₹${n0(evPs)} per post-buyback share, or ₹${n0(evLessMinMkt)} after deducting the Zydus Wellness minority at market (₹${n0(evLessMinBook)} at book). The DCF gives ₹${n0(dcfPs)} at an ${n1(V.ke)}% cost of equity. Both sit 20-30% above our P/E target, for one reason: they look through the jump in amortisation, interest and minorities that the acquisitions brought, while EPS (and so P/E) does not. D&A plus interest rise from 15% of EBITDA (FY25) to ~39% (FY27E). If those deals earn their keep, the EV-based values are the better guide and the stock is roughly fairly priced; until they do, EPS is what shareholders receive. We stay with the street's method.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: [
      ['House median on reported EPS', `${n1(FM.median)}x × ${k.toFixed(4)} = ${n1(FM.median * k)}x → ${houseMult}x`, n0(val(houseMult))],
      ['Only the last two years of history', `Forward P/E median since Oct-2024 (before one-offs): ${n1(two)}x → ${half(two * k)}x with the factor`, n0(val(half(two * k)))],
      ['No sector factor', `${half(HA.med)}x`, n0(val(half(HA.med)))],
      ['Street multiples on our EPS', '23x (MOSL) / 25x (PL) on Sep-28E', `${n0(val(23))} / ${n0(val(25))}`],
      ['Zydus Wellness at market, not inside the P/E', `Its share of Sep-28E EPS (~₹${n1(X.zwEpsSep)}) is worth ~₹${n0(zwInPe)} at ${MULT.base}x; the 57.59% stake is worth ₹${n0(zwAtMarketPs)} a share at market`, n0(r10(MULT.base * (eps - X.zwEpsSep) + zwAtMarketPs))],
      ['Ex-gRevlimid median (windfall rule, PLAYBOOK §7c)', 'Would raise the FY24-25 forward P/Es; gRevlimid sales were never disclosed (JM puts gRevlimid + Mirabegron at ~36% of US sales; PL at >45% of FY25 EPS)', 'not computable'],
      ['Growth premium', `EPS ${pc(X.epsCagrFwd)} a year FY26-29E (reported) vs ~18% a year FY21-26 before one-offs: if anything a discount`, 'not applied'],
      ['Returns premium', `ROE 13-15% in FY27-29E vs Ke ${n1(V.ke)}%; it was ~20% through the history that set the median`, 'not applied'],
    ], source: 'GAM Research. Per PLAYBOOK §7c, growth, returns and own-history views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +3 points a year, margin +1.5 points; ${MULT.bull}x.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{as.revenueGrowth.0|n1}}% / +{{as.revenueGrowth.1|n1}}% / +{{as.revenueGrowth.2|n1}}%; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −3 points a year, margin −2 points; ${MULT.bear}x.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: engine net cash at Mar-27 (incl. JV stakes, less leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27, FY26 share count)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. The tax rate in the DCF includes minorities, so free cash flow is roughly Zydus\'s share. Working capital is the engine\'s 10.5% of revenue, lower than Zydus\'s actual: the DCF is generous on cash.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed pharma peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', '5-yr median P/E', 'vs median', 'EV/EBITDA (x)', 'ROE'], rows: peerRows, source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; Zydus's P/E and ROE on Screener's basis (profit before minorities).` } },
  ],
};

module.exports = { street, valuation };
