// Asahi India Glass report, part 5: the street and the valuation (EV/EBITDA on Sep-28E EBITDA, multiple derived from the
// stock's own forward EV/EBITDA history and the auto-component EV/EBITDA de-rating; P/E and DCF cross-checks; scenarios; peers).
const X = require('./ASAHIINDIA.ctx');
const { D, F, V, A, b, n0, n1, pc, pc1, price, shares, mv, HEV, evBuckets, evTwoYr, evPreQip, evTroughYears, sectorEv, sectorEvAll, sectorDr, kev, k, derate, derateEv, P, PEERS, USED, EXCL, shortName,
  EVM, MULT, FM, fmP25, fmP75, epsSep, ebitdaSep, ndSep, evNowSep, evNow28, evNowTtm, peNowSep, rating, ST, isec, ASOF_TXT, medOf, half, ND26 } = X;
const r10 = v => Math.round(v / 10) * 10;
const evVal = m => r10((m * ebitdaSep - ndSep) / shares);
const drTxt = s => `${shortName(s)} ${pc1(derateEv[s])}`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const peerEv = medOf(USED.map(s => P[s].evEbitda));
const sd = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}-${y.slice(2)}`; };

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: one broker, Buy, ₹${n0(isec.tp)} on 22x FY28E EV/EBITDA`,
  blocks: [
    { p: `AIS is thinly covered. The only dated broker target we could verify as standing on ${ASOF_TXT} is ICICI Securities' Buy with ₹${n0(isec.tp)} (raised from ₹${n0(isec.prevTp)}), published after the Q4FY26 results (${sd(isec.date)}): **22x FY28E EV/EBITDA**, on a ~10% EBIT CAGR over FY26-28E driven by value-added auto glass and the float ramp-up. Trendlyne's consensus page also showed a single analyst at ₹1,050. No broker note after the Q1FY27 results (5-Aug-2026) was visible to us. The stock closed at ₹${n0(price)} on ${ASOF_TXT}, ${pc((isec.tp / price - 1) * 100)} below ICICI's target. ICICI Securities was a seller of the stock in 2023-24 (Sell at ₹484-503).` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes and company filings as cited; GAM Research' } },
  ],
};

const sens = [
  ['Sector factor from P/E instead of EV/EBITDA', `${pc1(sectorDr)} → ${n1(HEV.med)}x × ${k.toFixed(3)} = ${n1(HEV.med * k)}x → ${half(HEV.med * k)}x`, n0(evVal(half(HEV.med * k)))],
  ['Sector factor including all peers', `${pc1(sectorEvAll)} instead of ${pc1(sectorEv)} → ${half(HEV.med * (1 + sectorEvAll / 100))}x`, n0(evVal(half(HEV.med * (1 + sectorEvAll / 100))))],
  ['Only the last two years (since Oct-2024)', `Forward EV/EBITDA median ${n1(evTwoYr)}x, de-rated ${n1(evTwoYr * kev)}x`, n0(evVal(half(evTwoYr * kev)))],
  ['Before the QIP only', `Median ${n1(evPreQip)}x to Sep-2025, de-rated`, n0(evVal(half(evPreQip * kev)))],
  ['No sector de-rating', `${EVM.bull}x on base EBITDA`, n0(evVal(EVM.bull))],
  ['Street multiple (ICICI 22x)', '22x on our Sep-28E EBITDA less net debt', n0(evVal(22))],
  ['Growth premium', `EBITDA growth ~${Math.round(X.ebitdaCagrFwd)}% a year FY26-29E vs ~${Math.round(X.ebitdaCagrHist)}% over FY21-26, but most of it is FY27E (float); FY28-29E ~7-8% a year`, 'not applied'],
  ['Returns premium', 'ROE ~13-15% forecast vs 10.5% in FY26 and a ~12% cost of capital; ROCE has not beaten the cost of capital for three years', 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${EVM.base}x Sep-28E EBITDA gives {{dcf.tp|inr}}; the market pays ${n1(evNowSep)}x`,
  blocks: [
    { h: 'How the street values AIS' },
    { p: 'We use the street\'s method so our target is comparable: EV/EBITDA on the EBITDA the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E), less net debt at the same date. EV/EBITDA suits AIS better than P/E: it carries ~₹2,000 cr of debt and heavy, uneven depreciation from new float lines.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our numbers (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${sd(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple, s.on, n0(r10(X.isecAtOurs)), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**EV/EBITDA**', `**${EVM.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Good franchise in car glass; float profits lean on trade protection; capital-hungry; the price already pays above the de-rated own-history multiple'] },
    ], source: 'ICICI Securities via Moneycontrol/Tradingview and Trendlyne (Jun-2026). "At our numbers" = 22x our FY28E EBITDA less our FY28E net debt.' } },
    { h: `Our target multiple: ${EVM.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c, EV/EBITDA analogue)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward EV/EBITDA (used)', `EV ÷ next full-year EBITDA, weekly since Apr-2021 (${HEV.n} points; shares 24.31 cr before the Sep-2025 QIP and 25.49 cr after; net debt at the latest published March, less the QIP cash): median ${n1(HEV.med)}x, 25th-75th percentile ${n1(HEV.p25)}-${n1(HEV.p75)}x; ${evTroughYears.length ? 'trough years left out: ' + evTroughYears.join(', ') : 'no trough years (no forward EBITDA below half the prior three-year peak)'}. By forward year: ${evBuckets.map(x => `${x.fy} ${n1(x.med)}x`).join(', ')}`, `**Starting point: ${n1(HEV.med)}x**`],
      ['2. One-offs', 'EBITDA excludes exceptional items and other income; grants (~₹54 cr in FY26) are recurring for now and kept', 'None'],
      ['3. Sector de-rating', `Auto-component peers' trailing EV/EBITDA on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc1(sectorEv)}. Excluded as distorted: ${EXCL.map(s => `${shortName(s)} (${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join('; ')}; with them ${pc1(sectorEvAll)}. AIS itself (${pc1(derateEv.ASAHIINDIA)}) is not used. The P/E factor on the same peers is ${pc1(sectorDr)} (P/E cross-check)`, `× ${kev.toFixed(3)}`],
      ['4. Growth vs the street', `ICICI's 22x came with ~10% EBIT growth (FY26-28E); our EBIT grows faster after Q1FY27, almost all of it in FY27E`, 'No adjustment (§7c); see sensitivity'],
      ['5. Peers', `Peer median trailing EV/EBITDA ${n1(peerEv)}x; AIS ${n1(P.ASAHIINDIA.evEbitda)}x trailing (${n1(evNowTtm)}x on our numbers), ${n1(evNow28)}x our FY28E`, 'AIS trades a little below the peer median on trailing numbers, with lower returns: no extra signal'],
      ['6. Result (nearest half-turn)', `${n1(HEV.med)}x × ${kev.toFixed(3)} = ${n1(HEV.med * kev)}x`, `**${EVM.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep)} cr**`],
      ['7. Bull / bear', `Bull: no de-rating (${n1(HEV.med)}x). Bear: 25th-percentile forward EV/EBITDA, de-rated (${n1(HEV.p25)}x × ${kev.toFixed(3)})`, `${EVM.bull}x / ${EVM.bear}x`],
    ], source: `Screener.in prices, net debt and EBITDA to ${ASOF_TXT}; GAM estimates for FY27-28E EBITDA in the forward series; peers from tools/authoring/asof-peers.js` } },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA since 2021: median ${n1(HEV.med)}x`, unit: 'EV ÷ next full-year EBITDA (x)', x: X.fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: EVM.base, text: `Our multiple: ${EVM.base}x`, color: '#cf8f1f' }, { v: HEV.med, text: `Median ${n1(HEV.med)}x`, color: '#8c8c8c' }], source: 'Screener.in prices, net debt, EBITDA; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['EV/EBITDA (target)', 'P/E', 'DCF', 'ICICI Securities', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('ev').value), Math.round(mv('pe').value), Math.round(mv('dcf').value), isec.tp, price], fmt: 'inr' }], labels: 'all', highlight: 'EV/EBITDA (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**EV/EBITDA**', '**Target**', `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr less net debt ₹${n0(ndSep)} cr`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['P/E', 'Cross-check', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('pe').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, WACC {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** P/E (${MULT.base}x Sep-28E EPS: AIS's ${n1(FM.median)}x forward P/E median since 2021, 25th-75th ${n1(fmP25)}-${n1(fmP75)}x, cut by the ${Math.abs(sectorDr).toFixed(1)}% auto-component P/E de-rating) gives ₹${n0(mv('pe').value)}, a little above the target because the P/E factor is milder than the EV/EBITDA factor; today the stock is on ${n1(peNowSep)}x Sep-28E EPS. The DCF gives only ₹${n0(mv('dcf').value)} at a ${n1(V.ke)}% WACC and 6% terminal growth: it charges the ₹2,000 cr greenfield capex in FY27-29E and fades capex slowly, without crediting revenue from that capacity, and it assumes the EBITDA margin settles at 20% (the FY21-26 average). Even allowing for that bias, cash flows do not support today's price; the market is paying for growth well beyond our horizon at margins near the Q1FY27 peak.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, own-history windows, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${EVM.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${EVM.base}x Sep-28E EBITDA less net debt.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${EVM.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27 (shown as negative net cash)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. The engine discounts at the cost of equity; beta 0.92 sets it to our 12.0% WACC (8% debt at 6.2% after tax).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed auto-component peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'vs 5-yr median EV/EBITDA', 'P/E (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'ASAHIINDIA' ? '**Asahi India Glass**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : 'Dec year', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.evEbitda != null ? n1(p.evEbitda) : '–', derateEv[p.symbol] != null ? pc(derateEv[p.symbol]) : 'n.a.', p.pe != null ? n1(p.pe) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Schaeffler reports on December years. No listed Indian glass maker is comparable.` } },
  ],
};

module.exports = { street, valuation };
