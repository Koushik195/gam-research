// Minda Corporation report, part 5: the street and the valuation (P/E on Sep-28E EPS, multiple derived from the stock's
// own forward P/E history on EPS before one-offs and the auto-component de-rating; EV/EBITDA and DCF cross-checks;
// scenarios; peers).
const X = require('./MINDACORP.ctx');
const { D, F, V, C, n0, n1, pc, pc1, price, mv, FM, fmP25, adjMed, adjP25, adjP75, multRep, twoYr, buckets, sectorDr, sectorDrAll, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, epsSep, evMed, evMULT, evConv, ttmEbitda, ebitdaSep28, rating, ST, medTp, medTpAll, ASOF_TXT, medOf, BL, shares, SH_OUT, SH_DIL } = X;
const r10 = v => Math.round(v / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc1(derate[s])}`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const peerPe = medOf(USED.map(s => P[s].pe));
const shortDate = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}-${y.slice(2)}`; };

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: all Buy, post-Q1 targets ₹815-867 (median ₹${n0(medTp)}) on 32-34x`,
  blocks: [
    { p: `Three houses updated after the Q1FY27 results (13-Aug-2026): Emkay (Buy, ₹850, 33x Jun-28E EPS), MNCL (Buy, ₹867, 34x Jun-28E) and Axis Securities (Buy, ₹815, 32x FY28E). Earlier notes still standing on ${ASOF_TXT}: Geojit (Buy, ₹790, Jun-2026), DR Choksey (Buy, ₹730, May-2026) and Choice (Buy, ₹700, DCF, equal to 28x FY28E, May-2026). Post-Q1 median target ₹${n0(medTp)} (${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}); all six notes ₹${n0(medTpAll)}. Every house that shows its method uses **P/E on one-year-forward EPS** (Choice's DCF is cross-referenced to P/E). No broker dilutes EPS for the promoter warrants. The bulls focus on premiumisation, order wins, Flash's EV growth and Vision 2030; we found no bear.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes and press as cited; company calls; GAM Research' } },
  ],
};

const ourAt = s => { const m = String(s.multiple).match(/(\d+(?:\.\d+)?)x/); return s.method === 'P/E' && m ? n0(r10(+m[1] * epsSep.base)) : '–'; };
const sens = [
  ['Own median on reported EPS (incl. FY22-23 one-offs)', `${n1(FM.median)}x × ${k.toFixed(3)} = ${n1(FM.median * k)}x → ${multRep}x`, n0(r10(multRep * epsSep.base))],
  ['Only the last two years (since Oct-2024, after Flash)', `Forward P/E median ${n1(twoYr)}x, de-rated ${n1(twoYr * k)}x`, n0(r10(X.half(twoYr * k) * epsSep.base))],
  ['No sector de-rating', `${MULT.bull}x on base EPS`, n0(r10(MULT.bull * epsSep.base))],
  ['Sector de-rating including all eleven peers', `${pc1(sectorDrAll)} instead of ${pc1(sectorDr)}`, n0(r10(X.half(adjMed * (1 + sectorDrAll / 100)) * epsSep.base))],
  ['Minda Corp\'s own de-rating (not blended, §7c)', `Trailing P/E ${pc1(derate.MINDACORP)} vs its five-year median`, n0(r10(X.half(adjMed * (1 + derate.MINDACORP / 100)) * epsSep.base))],
  ['Undiluted share count (as the street)', `${MULT.base}x on Sep-28E EPS of ₹${n1(epsSep.base * SH_DIL / SH_OUT)} (23.91 cr shares)`, n0(r10(MULT.base * epsSep.base * SH_DIL / SH_OUT))],
  ['Street multiple (Emkay 33x Jun-28E)', '33x on our Sep-28E EPS', n0(r10(33 * epsSep.base))],
  ['Growth premium (PEG-style)', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E, close to the ~27% a year (normalised) of FY22-26 that the median already paid for`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(X.sepNow)}x`,
  blocks: [
    { h: 'How the street values Minda Corp' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our Sep-28E EPS (fully diluted).' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method || 'n.d.', s.multiple || '–', s.on || '–', ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Good growth, but the price already pays more than the stock\'s own historical multiple, on EPS the street does not dilute'] },
    ], source: 'Broker notes: Emkay and Choice PDFs (via InvestmentGuruIndia), MNCL PDF, Axis Direct blog (14-Aug-2026); Geojit and DR Choksey via Trendlyne (method not disclosed: n.d.)' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E', `Price ÷ next full-year EPS since Apr-2021: median ${n1(FM.median)}x on reported EPS; no trough years (no forward EPS below half the prior three-year peak). By forward year (EPS before one-offs): ${buckets.map(x => `${x.fy} ${n1(x.med)}x`).join(', ')}`, `Reported: ${n1(FM.median)}x`],
      ['2. One-offs (used)', `FY22-23 profit included exceptional gains and a one-time tax benefit (normalised PAT ₹137 cr / ₹219 cr vs ₹192 cr / ₹284 cr). On EPS before one-offs the median is ${n1(adjMed)}x (25th-75th percentile ${n1(adjP25)}-${n1(adjP75)}x). The market priced the normalised earnings, and our forecasts carry no one-offs, so we use it (PLAYBOOK §4)`, `**Starting point: ${n1(adjMed)}x**`],
      ['3. Sector de-rating', `Auto-component peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc1(sectorDr)}. Excluded as distorted: ${EXCL.map(s => `${shortName(s)} (${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join('; ')}; with them ${pc1(sectorDrAll)}. Minda Corp itself (${pc1(derate.MINDACORP)}) is not used`, `× ${k.toFixed(3)}`],
      ['4. Growth vs the street', `Emkay's 33x and MNCL's 34x Jun-28E come with FY26-29E EPS growth of ~25% a year on undiluted EPS; ours is ~${Math.round(X.epsCagrFwd)}% from a diluted base`, 'No adjustment (§7c); see sensitivity'],
      ['5. Peers', `Peer median trailing P/E ${n1(peerPe)}x; Minda Corp ${n1(P.MINDACORP.pe)}x trailing, which includes associate profit (Flash)`, 'In line with peers: no extra signal'],
      ['6. Returns', 'ROE 14-16% forecast vs a 12.5% cost of equity: positive but thin spread, diluted by the Flash goodwill', 'Supports no premium'],
      ['7. Result (nearest half-turn)', `${n1(adjMed)}x × ${k.toFixed(3)} = ${n1(adjMed * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}**`],
      ['8. Bull / bear', `Bull: no de-rating (${n1(adjMed)}x). Bear: 25th-percentile forward P/E, de-rated (${n1(adjP25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; company normalised PAT (Q4FY24 presentation); tools/authoring/valuation-blend.js forwardMedian; GAM estimates for FY27-28E EPS in the forward series` } },
    { pair: [
      { type: 'line', title: `Forward P/E since 2021: median ${n1(adjMed)}x (EPS before one-offs)`, unit: 'Price ÷ next full-year EPS (x)', x: X.adjSeries.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.adjSeries.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: adjMed, text: `Median ${n1(adjMed)}x`, color: '#8c8c8c' }], source: 'Screener.in prices and EPS; company normalised PAT FY22-23; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr plus net cash incl. Flash at book`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is Minda Corp's ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating and restated from trailing (₹${n0(ttmEbitda)} cr in the year to Jun-26) to Sep-28E EBITDA (× ${evConv.toFixed(3)}); the engine adds the Flash and JV stakes at book value (₹${n0(C.flash.carryingMar26)} cr for Flash) through net cash. It agrees with the P/E value. The DCF gives ₹${n0(mv('dcf').value)} at a ${n1(V.ke)}% cost of equity and 6% terminal growth on consolidated cash flows plus Flash at book. Flash at a market value rather than book would add more: at our ${MULT.base}x on its share of Sep-28E profit (~₹${n0(X.sep(BL.associates))} cr) it is worth ~₹${n0(r10(X.sep(BL.associates) * MULT.base))} cr vs ₹${n0(C.flash.carryingMar26)} cr at book, ~₹${n0(r10((X.sep(BL.associates) * MULT.base - C.flash.carryingMar26) / shares))} a share more (~₹${n0(r10(mv('dcf').value + (X.sep(BL.associates) * MULT.base - C.flash.carryingMar26) / shares))} in all), still well below the price: the market is paying for growth well beyond our forecast horizon.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, own-history windows, the stock\'s own de-rating, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Plus: net cash at Mar-27 (Flash and JV stakes at book, less debt incl. leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27, diluted)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm excludes associate profit; the cost of equity is used as the discount rate (debt is ~5% of enterprise value).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed auto-component peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'MINDACORP' ? '**Minda Corp**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : 'Dec year', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.pe != null ? n1(p.pe) : '–', derate[p.symbol] != null ? pc(derate[p.symbol]) : 'n.a.', p.evEbitda != null ? n1(p.evEbitda) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Schaeffler reports on December years.` } },
  ],
};

module.exports = { street, valuation };
