// MRF report, part 5: the street and the valuation (P/E on Sep-28E EPS, multiple derived from the stock's own forward
// P/E history and the tyre-sector de-rating; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./MRF.ctx');
const { D, F, V, n0, n1, pc, price, mv, FM, fP25, fP75, fMin, fMax, byFy, exFy23, two, sectorDr, sectorDrAll, sectorDrExCeat, k, derate, P, PEERS, USED, EXCL, MED5, shortName,
  MULT, epsSep, evMed, evMULT, evConv, ttmEbitda, ebitdaSep28, rating, ST, medTp, shortDate, ASOF_TXT, medOf, half } = X;
const r10 = v => Math.round(v / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc(derate[s])} (${n1(P[s].pe)}x vs ${n1(MED5[s])}x)`;
const peerPe = medOf(USED.map(s => P[s].pe));
const at = m => n0(r10(m * epsSep.base));

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street after Q1: two Sells, two Buys; targets ₹1.14-1.65 lakh, median ₹${n0(medTp)}`,
  blocks: [
    { p: `Coverage of MRF is thin and split. After the Q1FY27 results (11-Aug-2026) Motilal Oswal kept Sell with ₹1,13,936 (19x FY28E EPS of ₹5,997), calling 25.5x/21.9x FY27E/FY28E "expensive" for ~10% returns; Kotak Securities kept Sell with ₹1,25,000 on commodity headwinds and industry-like growth; Axis Capital raised its Buy target to ₹1,46,000; CLSA stayed Outperform with ₹1,65,240, expecting margins to recover on price increases. Median of the four: ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. The only house whose method we can see uses **P/E on one-year-forward EPS** (MOSL: 19x FY28E in August, 20x Dec-27E in February). The debate is not about demand; it is about how fast the rubber spread recovers and what multiple ~10-12% ROE deserves.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes and press as cited; AR FY26; GAM Research' } },
  ],
};

const ourAt = s => { const m = String(s.multiple || '').match(/(\d+(?:\.\d+)?)x/); return s.method === 'P/E' && m ? at(+m[1]) : '–'; };
const sens = [
  ['All five tyre peers (TVS Srichakra included)', `Sector ${pc(sectorDrAll)}: ${n1(FM.median)}x × ${n1(1 + sectorDrAll / 100)} → ${half(FM.median * (1 + sectorDrAll / 100))}x`, at(half(FM.median * (1 + sectorDrAll / 100)))],
  ['Peers without CEAT as well', `Sector ${pc(sectorDrExCeat)} → ${half(FM.median * (1 + sectorDrExCeat / 100))}x`, at(half(FM.median * (1 + sectorDrExCeat / 100)))],
  ['Own history without the FY22-23 rubber-trough year', `Forward P/E median ${n1(exFy23)}x (dates Apr-2021 to Mar-2022 left out: ~43x on FY23 EPS of ₹1,813), de-rated ${half(exFy23 * k)}x`, at(half(exFy23 * k))],
  ['No sector de-rating', `${MULT.bull}x on base EPS`, at(MULT.bull)],
  ['Street multiple (MOSL 19x FY28E)', '19x on our Sep-28E EPS', at(19)],
  ['Returns discount', `ROE of {{F.roe.1|pct}} in FY28E against a ~12% cost of equity: a fair P/E on ~9% growth is closer to the high teens; not applied (§7c)`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(X.sepNow)}x`,
  blocks: [
    { h: 'How the street values MRF' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our Sep-28E EPS.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method || 'n.d.', s.multiple || '–', s.on || '–', ourAt(s), s.thesis + (s.superseded ? ' (superseded)' : s.stale ? ' (no update found by 30-Sep-2026)' : '')]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'A cyclical margin trough in a strong franchise; the stock already trades below its own forward-P/E history'] },
    ], source: 'MOSL PDF (11-Aug-2026); Business Upturn (Kotak, 12-Aug-2026); Investing.com analyst table (Axis Capital, 12-Aug-2026); Moneycontrol via TradingView (CLSA, 12-Aug-2026); Trendlyne research listing. n.d. = method not disclosed' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (used)', `One-year-forward P/E on reported EPS, Apr-2021 to ${ASOF_TXT}: median ${n1(FM.median)}x (25th-75th percentile ${n1(fP25)}-${n1(fP75)}x; range ${n1(fMin)}-${n1(fMax)}x). Trough years excluded: none (FY23 EPS of ₹1,813 is above half the FY20 peak of ₹3,354). By forward year: ${Object.entries(byFy).map(([f, v]) => `FY${String(f).slice(2)} ${n1(medOf(v))}x`).join(', ')}`, `**Starting point: ${n1(FM.median)}x**`],
      ['2. Sector de-rating', `Tyre makers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)} (${n1(sectorDr)}%). Excluded as distorted: ${EXCL.map(s => `${shortName(s)} (${pc(derate[s])}; FY25 EPS −81%, P/E up to ~148x inside the window)`).join(', ')}; with it ${n1(sectorDrAll)}%. MRF itself (${pc(derate.MRF)}) is not used`, `× ${k.toFixed(3)}`],
      ['3. Growth vs the street', `MOSL's 19x FY28E comes with ~1% EPS CAGR over FY26-28E; ours is ~${Math.round(X.epsCagrFwd)}% over FY26-29E (FY27 dip, FY28-29 recovery)`, 'No adjustment (§7c); see sensitivities'],
      ['4. Peers', `Peer median trailing P/E ${n1(peerPe)}x; MRF ${n1(P.MRF.pe)}x on trailing EPS (Q2FY26-Q1FY27)`, 'MRF trades at a premium to Apollo and JK, a discount to BKT: no extra signal'],
      ['5. Returns vs cost of capital', 'ROE 10-13% in normal years against a cost of equity of ~11.9%', 'Argues against any premium; shown as a sensitivity'],
      ['6. Result (nearest half-turn)', `${n1(FM.median)}x × ${k.toFixed(3)} = ${n1(FM.median * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n0(epsSep.base)}**`],
      ['7. Bull / bear', `Bull: no de-rating (${n1(FM.median)}x). Bear: 25th-percentile forward P/E, de-rated (${n1(fP25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; GAM estimates for FY27-28E EPS in the forward series; forwardMedian (valuation-blend.js)` } },
    { pair: [
      { type: 'line', title: `Forward P/E since 2021: median ${n1(FM.median)}x; ${n1(X.fwdNow)}x FY28E now`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Forward P/E', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n0(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr + net cash`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-39E, Ke {{dcf.ke|n1}}%, g 5.5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA plus net cash) gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is MRF's ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating and restated from trailing (₹${n0(ttmEbitda)} cr, year to Jun-26) to Sep-28E EBITDA (× ${evConv.toFixed(2)}). The DCF gives ₹${n0(mv('dcf').value)} at an ${n1(V.ke)}% cost of equity and 5.5% terminal growth, ${pc(mv('dcf').vsTarget)} vs our target: on cash flows MRF is worth about today's price, because heavy capex (~6% of revenue) eats much of the EBITDA. The P/E target rests on margin recovery being priced the way the market has priced MRF since 2021.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, peer sub-sets, own-history windows, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research. The range is wide because both the margin and the multiple move with the rubber cycle.' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-39E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (after bank loans and leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm excludes treasury income; the cost of equity is the discount rate (debt is small against treasury).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research. Values rounded to ₹10.' } },
    { exhibit: { type: 'table', title: 'Listed tyre peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'MRF' ? '**MRF**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}` } },
  ],
};

module.exports = { street, valuation };
