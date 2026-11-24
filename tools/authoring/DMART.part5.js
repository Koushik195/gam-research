// DMart report, part 5: the street and the valuation (P/E on Sep-28E EPS, multiple derived from the stock's own forward P/E
// history on reported EPS and the retail-sector de-rating; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./DMART.ctx');
const { D, F, V, n0, n1, pc, price, mv, HA, FM, byFy, medExOneOff, two, sectorDr, sens, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, epsSep, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, rating, ST, postQ1, medTp, ASOF_TXT, medOf, half, MED5 } = X;
const r10 = v => Math.round(v / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const peerPe = medOf(USED.map(s => P[s].pe));
const tpAt = m => n0(r10(m * epsSep.base));
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const fac = d => (1 + d / 100);
const row = (label, d) => [label, `Sector ${pc(d)}: ${n1(HA.med)}x × ${fac(d).toFixed(3)} = ${half(HA.med * fac(d))}x`, tpAt(half(HA.med * fac(d)))];

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street after Q1: mostly Hold, targets ₹3,700-4,700, median ₹${n0(medTp)}`,
  blocks: [
    { p: `After the Q1FY27 results (11-Jul-2026) and the analyst meet (28-Jul) the street moved to the middle. Motilal Oswal downgraded to Neutral with ₹4,015 (35x Sep-28E pre-Ind AS EV/EBITDA, ~60x P/E), from Buy at ₹4,800 two weeks earlier; HDFC Securities kept Add at ₹4,100 (DCF, ~58x Jun-28E P/E); Prabhudas Lilladher Hold at ₹4,000 (DCF; ~65x FY28E); Nuvama Hold at ₹4,383 (from ₹4,974); Emkay Sell at ₹3,700 (DCF, ~54x FY28E standalone EPS); Elara Accumulate at ₹4,700. Median of the six: ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. ${D.street.methodSummary}` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], wide: [0], rows: D.critiques.map(c => [c]), source: 'Broker notes and the analyst meet as cited; GAM Research' } },
  ],
};

// P/E equivalent: the number inside brackets when the brackets hold the P/E (e.g. "35x (~60x P/E)"), else the first number
const ourAt = s => { const t = String(s.multiple || ''); if (!/P\/E/.test(t) && s.method !== 'P/E') return '–'; const inP = (t.match(/\(([^)]*)\)/) || [])[1] || ''; const m = (/P\/E/.test(inP) ? inP : t).match(/(\d+(?:\.\d+)?)x/); return m ? tpAt(+m[1]) : '–'; };
const sensRows = [
  ['EPS before the FY23 and FY25 one-off tax gains', `Median ${n1(medExOneOff)}x × ${k.toFixed(3)} = ${half(medExOneOff * k)}x`, tpAt(half(medExOneOff * k))],
  row('Peer set without Trent (2021-22 trough points in its median)', sens.exTrent),
  row('Peer set without Bata (FY26 profit −60%)', sens.exBata),
  row('Peer set without Trent and Bata', sens.exBoth),
  row('Peer set without Metro Brands (listed Dec-2021)', sens.exMetro),
  row('Vishal Mega Mart added (listed Dec-2024; median since listing)', sens.withVmm),
  ['Only the last two years (since Oct-2024)', `Median ${n1(two)}x, de-rated ${half(two * k)}x`, tpAt(half(two * k))],
  ['No sector de-rating', `${MULT.bull}x on base EPS`, tpAt(MULT.bull)],
  ['DMart\'s own de-rating instead of the sector\'s', `DMart's trailing P/E is ${pc(derate.DMART)} vs its five-year median: ${half(HA.med * fac(derate.DMART))}x`, tpAt(half(HA.med * fac(derate.DMART)))],
  ['Street multiples (54x Emkay, 58x HSIE, ~60x MOSL, 65x JM/PL)', 'Applied to our Sep-28E EPS', `${tpAt(54)} / ${tpAt(58)} / ${tpAt(60)} / ${tpAt(65)}`],
  ['Growth premium', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E, area-led, no margin help`, 'not applied'],
  ['Returns view', `ROE {{F.roe.1|pct}} in FY28E vs an ~11% cost of equity: covers it, without much room`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(X.sepNow)}x`,
  blocks: [
    { h: 'How the street values DMart' },
    { p: 'Brokers use DCF (HSIE, PL, Emkay), EV/EBITDA (MOSL) or P/E (JM), but each states the one-year-forward P/E its target implies, so P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E) is our primary method. The "At our numbers" column applies each broker\'s P/E to our Sep-28E EPS.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our numbers (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})${s.pre ? ' – pre-Q1' : ''}`, s.rating, s.tp ? n0(s.tp) : '–', s.method || 'n.d.', s.multiple || '–', s.on || '–', ourAt(s), s.thesis]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Best-in-class store economics; growth now ~15% and area-led; QC caps metro LFL; fair after the sector de-rating'] },
    ], source: 'HSIE (4-Aug-2026), PL (3-May-2026), JM Financial (5-Apr-2026) and MOSL (3-May-2026) PDFs; DSIJ summaries of MOSL and PL (28-Jul-2026); Business Today (13-Jul-2026: Nuvama, Emkay, Elara, MOSL); Goodreturns (HDFC Securities, 13-Jul); n.d. = method not disclosed to us' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (base)', `One-year-forward P/E since Apr-2021 on reported EPS (our FY27-28E for the latest forward years; forwardMedian): median ${n1(HA.med)}x (25th-75th percentile ${n1(HA.p25)}-${n1(HA.p75)}x; range ${n1(HA.min)}-${n1(HA.max)}x). Trough years left out: ${FM.troughYears.join(', ') || 'none (EPS never fell below half its previous peak)'}. By forward year: ${Object.entries(byFy).map(([f, v]) => `FY${String(f).slice(2)} ${n1(medOf(v))}x`).join(', ')}`, `**Starting point: ${n1(HA.med)}x**`],
      ['2. One-offs (§4)', `One-off tax gains of ₹138.8 cr (FY23) and ₹36.0 cr (FY25) lift those years' EPS by ~6% and ~1%; the median on EPS before them is ${n1(medExOneOff)}x`, 'Immaterial; use reported EPS (house function)'],
      ['3. Sector de-rating', `Listed retailers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded: ${EXCL.map(s => `${shortName(s)} (${D.peers.excluded[s].split(':')[0].replace(/\.$/, '')})`).join('; ')}. DMart itself (${pc(derate.DMART)}) is not used. Every sub-set gives ${pc(Math.min(...Object.values(sens), sectorDr))} to ${pc(Math.max(...Object.values(sens), sectorDr))}`, `× ${k.toFixed(3)}`],
      ['4. Growth vs the street', `The street's implied 54-65x comes with FY28E EPS of ₹64-73 (MOSL May, HSIE standalone); ours is ₹${n1(F.eps[1])} consolidated. Growth is now ~15% revenue and ~16% EPS, slower than the 20%+ of FY17-24`, 'No adjustment (§7c); see sensitivity'],
      ['5. Peers', `Peer median trailing P/E ${n1(peerPe)}x; DMart ${n1(P.DMART.pe)}x (Screener basis at the 30-Sep close). DMart still carries a premium for predictability and its cost moat`, 'DMart has de-rated less than the sector'],
      ['6. Returns vs cost of capital', `ROE ${n1(X.A.roe[X.b])}% in FY26 and {{F.roe.2|pct}} in FY29E vs an ~11% cost of equity; pre-Covid ROE was 18-20%`, 'Supports not paying above the de-rated median'],
      ['7. Result (nearest half-turn)', `${n1(HA.med)}x × ${k.toFixed(3)} = ${n1(HA.med * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}**`],
      ['8. Bull / bear', `Bull: no de-rating (${n1(HA.med)}x). Bear: 25th-percentile forward P/E, de-rated (${n1(HA.p25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; peer multiples at the NSE close; GAM estimates for FY27-28E EPS in the forward series` } },
    { pair: [
      { type: 'line', title: `Forward P/E since 2021: median ${n1(HA.med)}x; our ${MULT.base}x`, unit: 'Price ÷ next full-year EPS (x)', x: X.HS.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.HS.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: HA.med, text: `Median ${n1(HA.med)}x`, color: '#6b7280' }], source: 'Screener.in prices and EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr less net debt incl. leases`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, cost of capital {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is DMart's ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating and restated from trailing (₹${n0(ttmEbitda)} cr in the year to Jun-26) to Sep-28E EBITDA (× ${evConv.toFixed(3)}); MOSL uses 35x. The DCF gives only ₹${n0(mv('dcf').value)}: 15 years of growth fading from ~16% to 9%, an ~8% margin and capex fading to 3.5% of revenue, at an 11% cost of capital, explain about a quarter of the price. The market is paying for growth well beyond 15 years, or for a lower cost of capital than ours. That is the main reason we rate Valuation RED even though the P/E rule lands on HOLD.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sensRows, source: 'GAM Research. Per PLAYBOOK §7c, peer sub-sets, own-history windows, own de-rating, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +3pp a year, margin +0.3pp; multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −4pp a year, margin −0.5pp; multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt incl. leases at Mar-27 (negative = debt)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm; beta 0.75, so the cost of equity (11.0%) is the discount rate (debt is ~1% of market value).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed Indian retail peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', '5-yr median P/E', 'vs median', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'DMART' ? '**DMart**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.pe != null ? n1(p.pe) : '–', MED5[p.symbol] != null ? n1(MED5[p.symbol]) : '–', derate[p.symbol] != null ? pc(derate[p.symbol]) : '–', p.evEbitda != null ? n1(p.evEbitda) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; five-year median trailing P/E from Oct-2021 (Metro Brands from its Dec-2021 listing, Vishal Mega Mart from Dec-2024). Page Industries is on a standalone basis.` } },
  ],
};

module.exports = { street, valuation };
