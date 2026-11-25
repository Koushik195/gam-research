// Coal India report, part 5: the street and the valuation (EV/EBITDA on Sep-28E, multiple derived from the stock's own
// forward EV/EBITDA history and the upstream/mining peers' move; P/E and DCF cross-checks; scenarios; peers).
const X = require('./COALINDIA.ctx');
const { D, F, V, n0, n1, pc, price, mv, MULT, peMULT, evMed, evP25, evP75, evMed22, evMed24, evByFy, evTroughYears, evSeries, evMove, peMove, kEv, kPe, sens, MV, P, PEERS, USED, EXCL, SUB, shortName,
  FM, ebitdaSep, ncSep, epsSep, evAt, rating, ST, medTp, half, medOf, ASOF_TXT, shares, evNowFy28, evP25k, ev22k, ev24k } = X;
const sd = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const mvTxt = (s, k) => `${shortName(s)} ${pc(MV[s][k])}`;
const ourAt = s => { const m = String(s.multiple || '').match(/(\d+(?:\.\d+)?)x/); return s.method === 'EV/EBITDA' && m ? n0(evAt(+m[1])) : '–'; };
const CR = D.critiques;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street after Q1: split from Sell ₹370 to Buy ₹520; median ₹${n0(medTp)}`,
  blocks: [
    { p: `Eleven brokers updated after the Q1FY27 results (27-Jul to 10-Sep-2026). The Buys (MOSL ₹510, Anand Rathi ₹520, Jefferies ₹500) lean on the ~7% dividend yield, net cash and a stock at 4-5x FY28E EV/EBITDA; the Neutrals (Citi, JPMorgan ₹430, Morgan Stanley ₹420, ICICI Direct ₹480, Nuvama ₹454, Equirus ₹450, PL ₹472) see cheap valuation but no trigger; Kotak (Sell, ₹370) sees limited medium-term growth. Two upgrades in September (Nuvama, Equirus) were on e-auction premiums. The median target is ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. Every broker that discloses a method uses **EV/EBITDA on FY28E (or one year forward), at 4.5-6x**.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['What the bulls say', 'What the bears say'], rows: CR.bull.map((x, i) => [x, CR.bear[i] || ''].map(t => t.replace(/Rs ?/g, '₹'))), source: 'Broker notes and press as cited (Jul-Sep 2026)' } },
  ],
};

const sensRows = [
  ['Own median since Apr-2022 (drops the year whose forward EBITDA was the FY23 windfall)', `${n1(evMed22)}x × ${kEv.toFixed(3)} → ${ev22k}x`, n0(evAt(ev22k))],
  ['Own median since Apr-2024', `${n1(evMed24)}x × ${kEv.toFixed(3)} → ${ev24k}x`, n0(evAt(ev24k))],
  ['Upstream peers only (ONGC, OIL)', `move ${pc(sens.upstreamEv)} → ${half(evMed * (1 + sens.upstreamEv / 100))}x`, n0(evAt(half(evMed * (1 + sens.upstreamEv / 100))))],
  ['Upstream + NMDC (mining PSU)', `move ${pc(sens.minersEv)} → ${half(evMed * (1 + sens.minersEv / 100))}x`, n0(evAt(half(evMed * (1 + sens.minersEv / 100))))],
  ['Upstream + NMDC + SAIL (SAIL distorted)', `move ${pc(sens.minersSailEv)} → ${half(evMed * (1 + sens.minersSailEv / 100))}x`, n0(evAt(half(evMed * (1 + sens.minersSailEv / 100))))],
  ['Adding MRPL and Chennai Petroleum (the brief refiner list)', `move ${pc(sens.refinersEv)} → ${half(evMed * (1 + sens.refinersEv / 100))}x`, n0(evAt(half(evMed * (1 + sens.refinersEv / 100))))],
  ['25th percentile of own history (2021-23 pricing)', `${n1(evP25)}x × ${kEv.toFixed(3)} → ${evP25k}x`, n0(evAt(evP25k))],
  ['Street multiples (4.5x / 5x / 6x)', 'On our Sep-28E EBITDA and net cash', `${n0(evAt(4.5))} / ${n0(evAt(5))} / ${n0(evAt(6))}`],
  ['Dividend-yield floor (7% on FY28E DPS)', `FY28E DPS ₹${n1(F.dps[1])} ÷ 7%`, n0(Math.round(F.dps[1] / 0.07 / 10) * 10)],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EV/EBITDA gives {{dcf.tp|inr}}; the stock is at fair value`,
  blocks: [
    { h: 'How the street values Coal India' },
    { p: 'We use the street\'s method so our target is comparable: EV/EBITDA on the EBITDA the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E), plus net cash at that date. The "At our numbers" column applies each broker\'s multiple to our Sep-28E EBITDA and net cash.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our numbers (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${sd(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple || '–', s.on || '–', ourAt(s), s.thesis.replace(/Rs ?/g, '₹')]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**EV/EBITDA**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'High, safe yield; volume growth capped; no pricing power; fair on its own history'] },
    ], source: 'PL and ICICI Direct PDFs; Goodreturns, Kotak Neo, Tradebrains and Business Today roundups (27-Jul to 10-Sep-2026). JM Financial (Mar-2026) predates Q1 and is not in the median. n.d. = method not disclosed.' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward EV/EBITDA (used)', `Weekly since Apr-2021: market value less net cash (cash + investments − debt, last March balance sheet) ÷ next full-year EBITDA. Median ${n1(evMed)}x (25th-75th ${n1(evP25)}-${n1(evP75)}x); trough years: ${evTroughYears.length ? evTroughYears.join(', ') : 'none'}. By forward year: ${Object.entries(evByFy).map(([f, v]) => `FY${String(f).slice(2)} ${n1(medOf(v))}x`).join(', ')}`, `**Starting point: ${n1(evMed)}x**`],
      ['2. One-offs in history', 'FY23-24 EBITDA carried an e-auction windfall (premiums 228% / 99%) the market could not see a year ahead, so FY23-24 forward multiples look very low (1.7-2.1x). Per §4 and the batch precedent (a windfall is not a one-off), the base uses reported EBITDA; later windows are sensitivity rows', 'No adjustment to the base'],
      ['3. Sector move', `Peers' EV/EBITDA on ${ASOF_TXT} vs their five-year medians: ${USED.map(s => mvTxt(s, 'ev')).join(', ')}; median ${pc(evMove)}. Upstream (ONGC, OIL) is only two names, so per the thin-peer rule the set widens to the oil, gas and consumable fuels group (the set the published ONGC initiation uses). Excluded: ${EXCL.map(s => `${shortName(s)} (${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join('; ')}. Coal India itself (${pc(MV.COALINDIA.ev)}) is not used`, `× ${kEv.toFixed(3)}`],
      ['4. Growth vs the street', `Our EBITDA grows ~${Math.round((Math.pow(F.ebitda[2] / 41243, 1 / 3) - 1) * 100)}% a year FY26-29E; ICICI Direct's 4.5x comes with ~13% EBITDA growth FY26-28E; the 6x houses do not show their EBITDA in our sources`, 'No adjustment (§7c); see sensitivity'],
      ['5. Peers', `Trailing EV/EBITDA: ${USED.map(s => `${shortName(s)} ${n1(P[s].evEbitda)}x`).join(', ')}, NMDC ${n1(P.NMDC.evEbitda)}x; Coal India ${n1(P.COALINDIA.evEbitda)}x (Screener basis)`, 'Coal India in the middle of the range'],
      ['6. Returns', 'ROE 28% in FY26 and ~22-25% FY27-29E against a 12.5% cost of equity; supports a cash-rich PSU multiple but is already in the history', 'No adjustment'],
      ['7. Result (nearest half-turn)', `${n1(evMed)}x × ${kEv.toFixed(3)} = ${n1(evMed * kEv)}x`, `**${MULT.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep.base)} cr + ₹${n0(ncSep)} cr net cash**`],
      ['8. Bull / bear', `± 1 turn (the 75th percentile × move is also ${X.evP75k}x; the 25th, ${evP25k}x, reflects the 2021-23 windfall pricing and is a sensitivity row)`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices, balance sheets and EBITDA (patched) to ${ASOF_TXT}; GAM estimates for FY27-28E EBITDA in the forward series` } },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA since 2021: ${n1(evNowFy28)}x FY28E now`, unit: 'EV ÷ next full-year EBITDA (x)', x: evSeries.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: evSeries.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in; GAM estimates' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['EV/EBITDA (target)', 'P/E', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('ev').value), Math.round(mv('pe').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'EV/EBITDA (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**EV/EBITDA**', '**Target**', `Sep-28E EBITDA ₹${n0(ebitdaSep.base)} cr + net cash ₹${n0(ncSep)} cr`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['P/E', 'Cross-check', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${peMULT.base}x (bull ${peMULT.bull}x, bear ${peMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('pe').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 4%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** P/E (${peMULT.base}x: the own forward P/E median since 2021 of ${n1(FM.median)}x moved by the same peers' P/E change of ${pc(peMove)}) gives ₹${n0(mv('pe').value)}, lower because P/E ignores the ~₹${n0(ncSep / shares)} a share of net cash we expect by Sep-2028 and because 2021-23 P/Es were 4-5x. The DCF gives ₹${n0(mv('dcf').value)} at a ${n1(V.ke)}% cost of equity and only 4% terminal growth: on cash flows the stock is not expensive, but ~${Math.round(V.tvShare)}% of that value sits beyond FY42, in a coal market we expect to plateau. We anchor on the street's method; the DCF is the reason we do not call the stock a sell.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sensRows, source: 'GAM Research. Per PLAYBOOK §7c, other windows, sub-sets and growth views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `EBITDA {{F.ebitda.0|num}} / {{F.ebitda.1|num}} / {{F.ebitda.2|num}} cr; ${MULT.base}x Sep-28E EBITDA plus net cash.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. FCFF excludes treasury income; cost of equity used as the discount rate (net cash). The engine treats provisions inside other liabilities as working capital, so growth releases a little cash (engine limit).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Peers: oil, gas and consumable fuels (set) and mining PSUs (sensitivity)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'P/E vs 5-yr median', 'EV/EBITDA (x)', 'EV/EBITDA vs 5-yr median', 'ROE'], rows: PEERS.map(p => [p.symbol === 'COALINDIA' ? '**Coal India**' : shortName(p.symbol) + (EXCL.includes(p.symbol) || p.symbol === SUB.sail ? ' (excluded)' : USED.includes(p.symbol) ? ' (set)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : '–', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', n1(p.pe), pc(MV[p.symbol].pe), n1(p.evEbitda), pc(MV[p.symbol].ev), p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT} (ONGC standalone). Coal India's trailing EV/EBITDA is on Screener's basis (FY25-26 stripping credit outside EBITDA).` } },
  ],
};

module.exports = { street, valuation };
