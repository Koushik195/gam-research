// BLS report, part 5: the street and the valuation (P/E on Sep-28E EPS; multiple = own forward P/E median since Apr-2021
// x the sector move of TBO Tek's widened travel + internet set vs five-year medians; EV/EBITDA and DCF cross-checks; peers).
const X = require('./BLS.ctx');
const { D, F, V, n0, n1, pc, price, mv, FM, p25, p75, postMed, byFy, medOf, MV, SET, TRAVEL, NET, IRS, PEERS, dr5, MED5, shortName, MULT, SENS, epsSep, at, evMed, evP25, evMULT, rating, ST, cur, medTp, shortDate, ASOF_TXT, sepNow, fwdNow, trailPe, k, idbi } = X;
const drTxt = s => `${shortName(s)} ${pc(dr5[s])}`;
const kf = x => (1 + x / 100).toFixed(3);

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: one active broker (IDBI Capital, Buy, ₹330), whose target has fallen from ₹445 in six months',
  blocks: [
    { p: `BLS is thinly covered. The only broker with a current target on ${ASOF_TXT} is IDBI Capital: Buy, ₹${n0(idbi.tp)} (21-May-2026, after the Q4FY26 results), ${pc((idbi.tp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. IDBI initiated on 3-Dec-2025 at ₹445 (21.5x FY27E EPS of ₹20.7) and cut to ₹389 in Feb-2026 and ₹330 in May; its later multiple and earnings year are behind a login. Edelweiss's last note (₹604, Nov-2024) is long stale. The bulls point to quasi-annuity government contracts, a 40% visa margin, the Aadhaar order and net cash; the share price says the market does not believe the growth: the stock has fallen ${Math.abs(Math.round(X.M.price.returns['1y']))}% in a year and trades at ${n1(trailPe)}x trailing earnings.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], wide: [0], rows: D.critiques.map(r => [r]), source: 'Company calls and filings; AR FY26; GAM Research' } },
  ],
};

const sens = [
  [`**Base: four-name travel + internet set** (${SET.map(drTxt).join(', ')}; median ${pc(MV.set)})`, `${n1(FM.median)}x × ${k.toFixed(3)} = ${MULT.base}x`, n0(at(MULT.base))],
  ['No sector move (own median since Apr-2021)', `${n1(FM.median)}x → ${SENS.none}x`, n0(at(SENS.none))],
  [`Travel names only (${TRAVEL.map(drTxt).join(', ')}; median ${pc(MV.travel)})`, `${n1(FM.median)}x × ${kf(MV.travel)} = ${SENS.travel}x`, n0(at(SENS.travel))],
  [`Internet platforms only (${NET.map(drTxt).join(', ')}; median ${pc(MV.net)})`, `${n1(FM.median)}x × ${kf(MV.net)} = ${SENS.net}x`, n0(at(SENS.net))],
  [`IRCTC's five-name set (${IRS.map(drTxt).join(', ')}; median ${pc(MV.irctc)})`, `${n1(FM.median)}x × ${kf(MV.irctc)} = ${SENS.irctc}x`, n0(at(SENS.irctc))],
  [`Post-transition window (since Apr-2023, after the move to self-managed centres), with the four peers' move over the same window (${pc(MV.post)})`, `${n1(postMed)}x × ${kf(MV.post)} = ${SENS.post}x`, n0(at(SENS.post))],
  ['Street multiple', `IDBI 21.5x FY27E (Dec-2025)`, n0(Math.round(21.5 * F.eps[0] / 10) * 10)],
  ['Own de-rating (not applied, §7c)', `BLS's trailing P/E ${n1(X.P.BLS.pe)}x is ${Math.abs(Math.round(dr5.BLS))}% below its own five-year median, far more than the peers`, 'would argue for much less'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(sepNow)}x`,
  blocks: [
    { h: 'How the street values BLS' },
    { p: 'The only published method is P/E on forward earnings (IDBI Capital). We use P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies a broker\'s multiple to our EPS for the same year.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})${s.standing ? '' : ' – superseded'}`, s.rating, n0(s.tp), s.method, s.multiple, s.on, s.multiple === '21.5x' ? n0(Math.round(21.5 * F.eps[0] / 10) * 10) : '–', s.thesis]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'A cash-rich, 40%-margin visa franchise at under 10x Sep-28E earnings, but with flat volumes, rising leakage to tax and minorities, and a sector that has de-rated by a third'] },
    ], source: 'IDBI Capital via Trendlyne (21-May-2026, 9-Feb-2026) and its initiation report (Dec-2025, on the company website); Trendlyne (Edelweiss, Nov-2024)' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (used)', `Price ÷ next full-year EPS, Apr-2021 to ${ASOF_TXT}: median ${n1(FM.median)}x (25th-75th percentile ${n1(p25)}-${n1(p75)}x); no trough years (EPS rose every year). By calendar year: ${Object.entries(byFy).map(([y, v]) => `${y} ${n1(medOf(v))}x`).join(', ')}. The 2021-22 values are low because realised forward EPS grew 80-120% a year; EPS never fell to a loss or near zero, so the turnaround exception (§7c) does not apply. A since-Apr-2023 window is a sensitivity row`, `**Starting point: ${n1(FM.median)}x**`],
      ['2. Sector move', `No listed visa outsourcer. Thin-peer rule: we use the set already used for TBO Tek: the two travel names with a usable P/E history (${TRAVEL.map(drTxt).join(', ')}) widened to the internet platforms brokers use (${NET.map(drTxt).join(', ')}), each vs its own five-year median: median ${pc(MV.set)}. Excluded: BLS itself; TBO Tek and ixigo (listed 2024, no five-year history); Easy Trip Planners (loss-making); BLS E-Services (BLS's own subsidiary). Sub-sets are sensitivity rows`, `**× ${k.toFixed(3)}**`],
      ['3. Growth vs the street\'s multiple', `IDBI's 21.5x FY27E came with ~16% EPS growth in FY27E; we forecast ~${Math.round(X.epsCagrFwd)}% a year for FY26-29E (FY27E +${Math.round(F.epsGrowth[0])}%)`, 'No adjustment (§7c); see sensitivity'],
      ['4. Peers', `Trailing P/E on ${ASOF_TXT}: BLS ${n1(X.P.BLS.pe)}x (${pc(dr5.BLS)} vs its five-year median of ${n1(MED5.BLS)}x), IRCTC ${n1(X.P.IRCTC.pe)}x, Thomas Cook ${n1(X.P.THOMASCOOK.pe)}x, Info Edge ${n1(X.P.NAUKRI.pe)}x, IndiaMART ${n1(X.P.INDIAMART.pe)}x`, 'BLS has de-rated far more than its peers'],
      ['5. Returns vs cost of capital', 'ROE ~24-33% (falling as cash and goodwill build) vs a 12.5% cost of equity', 'Supports a multiple above the market\'s 10x, already in the history'],
      ['6. Result (nearest half-turn)', `${n1(FM.median)}x × ${k.toFixed(3)} = ${n1(FM.median * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}**`],
      ['7. Bull / bear', `Bull: own median, no sector move (${n1(FM.median)}x) on bull EPS. Bear: 25th-percentile forward P/E × the four-name move (${n1(p25)}x × ${k.toFixed(3)}) on bear EPS`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; GAM estimates for FY27-28E EPS in the forward series; peers' trailing P/E vs five-year medians (Sep-2021 to Sep-2026)` } },
    { pair: [
      { type: 'line', title: `Forward P/E since 2021: median ${n1(FM.median)}x, now ${n1(fwdNow)}x`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Forward P/E', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: SENS.none, text: `Own median: ${SENS.none}x` }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target, cross-checks and sensitivities vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'No sector move', 'IRCTC five-name set', 'Street (IDBI)', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), at(SENS.none), at(SENS.irctc), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(mv('ev').metric)} cr + net treasury`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA: BLS's own forward EV/EBITDA median since 2021 of ${n1(evMed)}x × the same ${k.toFixed(3)} factor, plus net treasury) gives ₹${n0(mv('ev').value)}, above the P/E value because it credits the growing cash pile in full. The DCF gives ₹${n0(mv('dcf').value)}: on ${n1(V.ke)}% cost of equity, 6% terminal growth and a margin fading to 24%, BLS's cash flows are worth ~${n1(mv('dcf').value / price)}x today's price, and the DCF counts minorities only at book. Both say the stock is cheap on cash flows if the visa business keeps its contracts; the market is pricing a much higher risk of losing them, or of the cash being spent on low-return deals. Our P/E target sits between the market and the cross-checks.` },
    { exhibit: { type: 'table', title: 'Base and sensitivity rows (peer set, window, street)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, sub-sets, windows and own-de-rating views are shown, not added to the base multiple; the base uses the full four-name set.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (own median, no sector move).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}} (Screener basis); ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile × the four-name move).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net treasury at Mar-27 (after leases and minorities at book)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm excludes treasury income; the cost of equity is the discount rate (net cash).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed comparables (none is a clean peer)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', '5-yr median P/E', 'vs median', 'ROE'], rows: PEERS.map(p => [p.symbol === 'BLS' ? '**BLS International**' : shortName(p.symbol) + (SET.includes(p.symbol) ? '' : IRS.includes(p.symbol) ? ' (IRCTC set; sensitivity)' : ' (excluded)'), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', n1(p.pe), MED5[p.symbol] ? n1(MED5[p.symbol]) : '–', dr5[p.symbol] != null ? pc(dr5[p.symbol]) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; five-year medians Sep-2021 to Sep-2026 (shorter where the listing or Screener's P/E history is shorter: TBO Tek, ixigo, IRCTC). Excluded names are shown for reference only.` } },
  ],
};

module.exports = { street, valuation };
