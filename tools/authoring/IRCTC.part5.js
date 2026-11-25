// IRCTC report, part 5: the street and the valuation (P/E on Sep-28E EPS; multiple = own forward P/E median since Apr-2021;
// × the five-name sector move (internet platforms + railway-PSU services); EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./IRCTC.ctx');
const { D, F, V, n0, n1, pc, rup, price, mv, FM, p25, p75, two, byFy, medOf, cleanMed, med22, MV, NET, RAIL, PEERS, P, dr5, MED5, shortName, MULT, SENS, epsSep, at, evMed, evP25, evMULT, rating, ST, medTp, shortDate, ASOF_TXT, sepNow, kNet, kBase } = X;
const drTxt = s => `${shortName(s)} ${pc(dr5[s])}`;
const ourAt = s => { const m = String(s.multiple).match(/(\d+(?:\.\d+)?)x/); if (!m) return '–'; const e = s.on === 'FY28E' ? F.eps[1] : epsSep.base; return n0(Math.round(+m[1] * e / 10) * 10); };

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: Buy across the board, targets ₹560-706, multiples cut from 40x to 25-35x this year`,
  blocks: [
    { p: `All three brokers with a note after the Q1FY27 results rate IRCTC Buy. PL Capital (14-Aug-2026) values it at 35x FY28E EPS (₹706), after cutting its multiple from 40x in May; IDBI Capital (14-Aug-2026) kept ₹610 (method not visible to us); Choice initiated on 22-Sep-2026 at 25x the average of FY28E-29E EPS (₹560), arguing the monopoly "warrants a premium multiple". Median: ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. Targets have fallen all year: PL ₹850 (Feb) to ₹712 (May) to ₹706; IDBI ₹715 (Feb) to ₹610 (May). The bulls focus on the monopoly, cash and catering growth; the bears on stalled ticketing, the margin and policy risk.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes and press as cited; company calls; GAM Research' } },
  ],
};

const sens = [
  [`Base: five-name sector move (internet platforms + railway-PSU services, ${pc(MV.all)})`, `${n1(FM.median)}x × ${kBase.toFixed(3)} = ${MULT.base}x`, n0(at(MULT.base))],
  ['No sector move (own median since Apr-2021)', `${n1(FM.median)}x → ${SENS.none}x`, n0(at(SENS.none))],
  [`Railway-PSU service peers only (${RAIL.map(drTxt).join(', ')}; median ${pc(MV.rail)})`, `${n1(FM.median)}x × ${(1 + MV.rail / 100).toFixed(3)} = ${SENS.rail}x`, n0(at(SENS.rail))],
  [`Internet-platform peers only (${NET.map(drTxt).join(', ')}; median ${pc(MV.net)})`, `${n1(FM.median)}x × ${kNet.toFixed(3)} = ${SENS.net}x`, n0(at(SENS.net))],
  ['Last two years only (since Oct-2024)', `Forward P/E median ${n1(two)}x × ${kBase.toFixed(3)} = ${SENS.two}x`, n0(at(SENS.two))],
  ['Since Apr-2022 (leaves out the 2021 rally)', `${n1(med22)}x × ${kBase.toFixed(3)} = ${SENS.since22}x`, n0(at(SENS.since22))],
  ['EPS before exceptional items', `${n1(cleanMed)}x × ${kBase.toFixed(3)} (one-offs are 1-5% of profit)`, n0(at(SENS.clean))],
  ['Street multiples', 'PL 35x FY28E; Choice 25x Sep-28E', `${ourAt(ST[0])} / ${ourAt(ST[2])}`],
  ['Growth view (not applied)', `EPS grew 11.5% a year in FY23-26 when the median was set; we forecast ~${Math.round(X.epsCagrFwd)}% for FY26-29E`, 'would argue for less'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(sepNow)}x`,
  blocks: [
    { h: 'How the street values IRCTC' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our EPS for the same year.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple, s.on + (s.onNote ? ` (${s.onNote})` : ''), ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'A cash-rich monopoly at half its own historical multiple; growth has slowed and policy risk is real, but the de-rating looks overdone if earnings hold'] },
    ], source: 'PL Capital note (PDF, 14-Aug-2026); IDBI Capital via Trendlyne (14-Aug-2026); Business Today on Choice (22-Sep-2026)' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (used)', `Price ÷ next full-year EPS, Apr-2021 to ${ASOF_TXT}: median ${n1(FM.median)}x (25th-75th percentile ${n1(p25)}-${n1(p75)}x); no trough years (the Covid-hit FY21-22 EPS never enters, as the forward year for Apr-2021 is FY23). By forward year: ${Object.entries(byFy).map(([f, v]) => `FY${String(f).slice(2)} ${n1(medOf(v))}x`).join(', ')}`, `**Starting point: ${n1(FM.median)}x**`],
      ['2. Sector move', `No clean peer. Brokers group IRCTC with travel and internet platforms; only Info Edge and IndiaMART have a usable five-year P/E history (${NET.map(drTxt).join(', ')} vs five-year medians; median ${pc(MV.net)}). Excluded: Easy Trip Planners (loss-making; ${pc(dr5.EASEMYTRIP)}), Eternal, Swiggy, Nykaa, Paytm, PB Fintech (losses or no history), ixigo, TBO Tek, RateGain (listed 2021-24). The market trades IRCTC with railway PSUs (Nifty India Railways PSU index; DIPAM's OFS pipeline): Container Corp, RailTel and RITES are the service businesses among them with a five-year history (${RAIL.map(drTxt).join(', ')}; IRFC, RVNL and IRCON are a lender and contractors). These five are the only names with a usable five-year P/E history, so we use all five (§7c: full peer set): median ${pc(MV.all)}. Sub-sets are sensitivity rows`, `**× ${kBase.toFixed(3)}**`],
      ['3. Growth vs the street\'s multiples', `PL's 35x FY28E comes with ~8% EPS growth (FY26-28E); Choice's 25x with a margin dip to ~29%. Ours: ~${Math.round(X.epsCagrFwd)}% a year`, 'No adjustment (§7c); see sensitivity'],
      ['4. Peers', `Trailing P/E on ${ASOF_TXT}: IRCTC ${n1(P.IRCTC.pe)}x (${pc(dr5.IRCTC)} vs its trailing median since May-2024, where Screener's P/E history for IRCTC starts), Info Edge ${n1(P.NAUKRI.pe)}x, IndiaMART ${n1(P.INDIAMART.pe)}x, Container Corp ${n1(P.CONCOR.pe)}x, RITES ${n1(P.RITES.pe)}x`, 'IRCTC has de-rated as much as the platforms, more than the PSUs'],
      ['5. Returns vs cost of capital', 'ROE ~30-35% on a cash-heavy balance sheet vs an 11.9% cost of equity', 'Supports a premium multiple, already in the history'],
      ['6. Result (nearest half-turn)', `${n1(FM.median)}x × ${kBase.toFixed(3)} = ${n1(FM.median * kBase)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}**`],
      ['7. Bull / bear', `Bull: own median, no sector move (${n1(FM.median)}x) on bull EPS. Bear: 25th-percentile forward P/E × the five-name move (${n1(p25)}x × ${kBase.toFixed(3)}) on bear EPS`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; GAM estimates for FY27-28E EPS in the forward series; peers' trailing P/E vs five-year medians (Sep-2021 to Sep-2026)` } },
    { pair: [
      { type: 'line', title: `Forward P/E since 2021: median ${n1(FM.median)}x, now ${n1(price / F.eps[1])}x`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Forward P/E', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: SENS.none, text: `Own median: ${SENS.none}x` }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target, cross-checks and sensitivities vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'No sector move', 'Internet move only', 'Street median', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), at(SENS.none), at(SENS.net), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(mv('ev').metric)} cr + net treasury`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA, IRCTC's own forward EV/EBITDA median since 2021 of ${n1(evMed)}x × the same ${kBase.toFixed(3)} sector factor, plus net treasury) gives ₹${n0(mv('ev').value)}, close to the P/E value because both rest on the same history. The DCF gives only ₹${n0(mv('dcf').value)}: at an ${n1(V.ke)}% cost of equity, 6% terminal growth and a margin fading to 27%, IRCTC's cash flows justify ~${n1(mv('dcf').value / F.eps[0])}x FY27E earnings, close to today's price. Put plainly: the stock is cheap against what the market paid for it in 2021-25, not against its cash flows. Our target assumes the multiple recovers to its own history less the sector's de-rating (${MULT.base}x vs ${n1(sepNow)}x today); the sensitivities below show how much depends on the peer set.` },
    { exhibit: { type: 'table', title: 'Base and sensitivity rows (peer set, window, one-offs)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, sub-sets, growth and returns views are shown, not added to the base multiple; the base uses the full five-name set.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (own median, no sector move).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile × the five-name sector move).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net treasury at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm excludes treasury income; the cost of equity is the discount rate (no debt).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed comparables (none is a clean peer)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', '5-yr median P/E', 'vs median', 'ROE'], rows: PEERS.map(p => [p.symbol === 'IRCTC' ? '**IRCTC**' : shortName(p.symbol) + (p.symbol === 'EASEMYTRIP' ? ' (excluded)' : RAIL.includes(p.symbol) ? ' (rail PSU)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', n1(p.pe), n1(MED5[p.symbol]), pc(dr5[p.symbol]), p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; five-year medians Sep-2021 to Sep-2026 (IRCTC: May-2024 to Sep-2026, the length of Screener's P/E history; not used in the derivation).` } },
  ],
};

module.exports = { street, valuation };
