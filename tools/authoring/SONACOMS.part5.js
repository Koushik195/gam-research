// Sona Comstar report, part 5: the street and the valuation (P/E on Sep-28E EPS, multiple derived from the stock's own
// forward P/E history since Jun-2022 and the auto-component de-rating; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./SONACOMS.ctx');
const { D, F, V, n0, n1, pc, price, mv, FM, FMall, FMapr, fmP25, fmP75, weeklyMed, buckets, sectorDr, sectorDrAll, sectorDrBf, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, SENS, epsSep, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, rating, ST, postQ1, medTp, shortDate, ASOF_TXT, medOf, sepNow, peg, epsCagrFwd } = X;
const r10 = v => Math.round(v / 10) * 10, E = epsSep.base;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const peerPe = medOf(USED.map(s => P[s].pe));

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street after Q1: split between Buy and Neutral, targets ₹652-848`,
  blocks: [
    { p: `Coverage visible to us is split. Motilal Oswal has been Neutral since the IPO and kept Neutral with ₹652 after Q1 (23-Jul-2026), calling the "10x in 10 years" ambition ambitious. Nomura raised its target to ₹848 (Buy, 24-Jul) on the DENSO JV's four-wheeler opportunity. Jefferies kept Buy with ₹700 on the DENSO news (23-Jul) and, on 28-Sep, published a thematic note valuing Sona at 55x FY28E EPS (target not in the press report), above the 44x average multiple since listing, for its shift to higher-value engineering. Median of the three post-Q1 targets: ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}: the stock ran past most targets. Every house that shows a method uses **P/E on one-year-forward EPS**.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Source'], wide: [0], rows: D.critiques.map(c => [rup(c), 'GAM Research from company disclosures']), source: 'Annual reports, presentations, DENSO filing; GAM Research' } },
  ],
};

const ourAt = s => { const m = String(s.multiple).match(/(\d+(?:\.\d+)?)x/); return s.method === 'P/E' && m ? n0(r10(+m[1] * (/FY28/.test(s.on) ? F.eps[1] : E))) : '–'; };
const sens = [
  ['From listing (Jun-2021), IPO months included', `${n1(FMall.median)}x × ${k.toFixed(3)}`, n0(r10(SENS.listing * E))],
  ['From Apr-2022', `${n1(FMapr.median)}x × ${k.toFixed(3)}`, n0(r10(SENS.apr22 * E))],
  ['Every weekly close (not every fifth) since Jun-2022', `${n1(weeklyMed)}x × ${k.toFixed(3)}`, n0(r10(SENS.weekly * E))],
  ['Bharat Forge kept in the peer set', `de-rating ${pc(sectorDrBf)} → ${SENS.withBf}x`, n0(r10(SENS.withBf * E))],
  ['No sector de-rating (bull multiple)', `${MULT.bull}x`, n0(r10(MULT.bull * E))],
  ['Jefferies\' 55x on FY28E EPS', `55x × ₹${n1(F.eps[1])}`, n0(r10(55 * F.eps[1]))],
  ['Growth premium', `EPS +${Math.round(epsCagrFwd)}% a year FY26-29E; PEG at our multiple ${peg.toFixed(1)}x. The Jun-2022 to Sep-2026 median was paid for next-year EPS growth of 6-31% (FY24-28E), much like our forecast, so no premium is warranted`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${Math.round(sepNow)}x`,
  blocks: [
    { h: 'How the street values Sona' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies a broker\'s disclosed multiple to our EPS for the same year.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp ? n0(s.tp) : 'n.d.', s.method, s.multiple || 'n.d.', s.on || 'n.d.', ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Good franchise and a strong Q1; the price already pays the stock\'s own median multiple while the sector trades below its own'] },
    ], source: 'Trendlyne report list (MOSL); Univest (Nomura, Jefferies, Jul-2026); Business Today (Jefferies, 28-Sep-2026). Full notes are behind logins.' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (house function)', `One-year-forward P/E (price ÷ next full year's EPS; actuals, then ours) from 24-Jun-2022, leaving out the first 12 months after the Jun-2021 listing, when it was ${Math.round(buckets[0].lo)}-${Math.round(buckets[0].hi)}x: median ${n1(FM.median)}x (25th-75th percentile ${n1(fmP25)}-${n1(fmP75)}x); no trough years. By forward year: ${buckets.map(x => `${x.fy} ${n1(x.med)}x`).join(', ')}`, `**Starting point: ${n1(FM.median)}x**`],
      ['2. Sector de-rating', `Auto-component peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded: ${EXCL.map(s => `${shortName(s)} (${pc(derate[s])}; ${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join('; ')}; all ten ${pc(sectorDrAll)}. Sona itself (${pc(derate.SONACOMS)}) is not used`, `× ${k.toFixed(3)}`],
      ['3. Growth vs the street', `Jefferies pays 55x FY28E for the "higher-value engineering" story; our EPS grows ~${Math.round(epsCagrFwd)}% a year over FY26-29E, below the 23% revenue CAGR of FY21-26`, 'No adjustment (§7c); see sensitivity'],
      ['4. Peers', `Peer median trailing P/E ${n1(peerPe)}x; Sona ${n1(P.SONACOMS.pe)}x with a 24% EBITDA margin but 11% ROE`, `Sona already trades at a ${pc((P.SONACOMS.pe / peerPe - 1) * 100)} premium to peers`],
      ['5. Returns', `ROE ${n1(X.A.roe[X.b])}% in FY26, ~{{F.roe.2|pct}} by FY29E vs a ${n1(V.ke)}% cost of equity`, 'Barely above the cost of equity: no case for a premium'],
      ['6. Result (nearest half-turn)', `${n1(FM.median)}x × ${k.toFixed(3)} = ${n1(FM.median * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(E)}**`],
      ['7. Bull / bear', `Bull: no de-rating (${n1(FM.median)}x). Bear: 25th-percentile forward P/E, de-rated (${n1(fmP25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; GAM estimates for FY27-28E EPS in the forward series` } },
    { pair: [
      { type: 'line', title: `Forward P/E since mid-2022: median ${n1(FM.median)}x; now ${n1(sepNow)}x on Sep-28E`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdWeekly.map(x => x[0]), series: [{ name: 'Forward P/E (weekly)', values: X.fwdWeekly.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median since Jun-22: ${n1(FM.median)}x` }, { v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices from listing; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(E)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr + net cash`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA plus net cash) gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is Sona's ${n1(evMed)}x median trailing EV/EBITDA since Jun-2022, cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating and restated from trailing (₹${n0(ttmEbitda)} cr to Jun-26) to Sep-28E EBITDA (× ${evConv.toFixed(3)}). The DCF gives only ₹${n0(mv('dcf').value)} at a ${n1(V.ke)}% cost of equity: even at ${n1(V.sens.waccs[0])}% and ${n1(V.sens.gs[4])}% terminal growth it is ₹${n0(V.sens.grid[0][4])}. A ~23% margin business that reinvests ~8% of revenue and grows 14-15% a year does not generate enough free cash in 15 years to justify ₹${n0(price)}: the price assumes decades of high growth (robotics, DENSO JVs) that a DCF cannot see.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, window choices, peer sub-sets, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm excludes treasury income; the cost of equity is the discount rate (net cash).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed auto-component peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'SONACOMS' ? '**Sona Comstar**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : 'Dec year', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', n1(p.pe), derate[p.symbol] != null ? pc(derate[p.symbol]) : '–', n1(p.evEbitda), p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Schaeffler reports on December years. Same peer set as the Bosch and Motherson initiations.` } },
  ],
};

module.exports = { street, valuation };
