// Devyani report, part 5: the street and the valuation (SOTP on EV/EBITDA, Sep-28E, with Camas's share of Thailand deducted;
// multiple derived from the stock's own forward EV/EBITDA since listing and the QSR peers' EV/EBITDA move against their
// five-year medians; P/E and DCF cross-checks; scenarios; merger kept out; peers).
const X = require('./DEVYANI.ctx');
const { D, F, V, n0, n1, n2, pc, pc1, price, shares, mv, HEV, HEVplain, HEV22, HEV24, FM, sectorEv, sens, kEv, dr5Ev, P, PEERS, USED, EXCL, RET, QSR, shortName, evMULT, evALT, peMULT,
  ebitdaSep28, netCashSep28, preSep28, preEbitda, leases, preMultAt, streetAtOurs, evAt, rating, ST, post, medTp, medAll, nBuy, ASOF_TXT, LISTED, medOf, evNow, evSepNow, phiSep, phiHist, SP = X.V.sotp.parts, evCount, PF } = X;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const sd = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}-${y.slice(2)}`; };
const vAt = m => n0(evAt(m));
const drTxt = s => `${shortName(s)} ${pc1(dr5Ev[s])}`;
const peerEv = medOf(USED.map(s => P[s].evEbitda));
const tpPre = preMultAt(V.tp), minPart = SP.find(p => /minorities/.test(p.name));
const preBasis = s => /pre-Ind AS/.test(s.method);

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: all ${ST.length} dated notes are Buy; post-results median target ₹${n0(medTp)}, mostly on EV/EBITDA after rent`,
  blocks: [
    { p: `After the Q1FY27 results (29-Jul-2026) four houses published dated targets: Motilal Oswal ₹160 (25x Mar-28E EV/EBITDA after rent, cut from ₹172 on weak FY25-26 and the sector de-rating), Emkay ₹160 (26x Jun-28E), Anand Rathi ₹160 (16x FY28E) and BOB Capital Markets ₹140 (DCF). Median ₹${n0(medTp)} (${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n2(price)}); including older notes still standing (JM Financial ₹175 in Feb-2026, Jefferies ₹145, Deven Choksey ₹133) the median is ₹${n0(medAll)}. All value Devyani standalone, before the merger; none of the notes we read deducts Temasek's share of Thailand explicitly. Targets have been cut through 2026 (Motilal ₹180 in Feb, ₹172 before Q1; JM ₹180 to ₹175).` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Detail'], wide: [1], rows: D.critiques.map(r => [`**${r.view}**`, rup(r.detail)]), source: 'Broker notes and company filings as cited; GAM Research' } },
  ],
};

const ourAt = s => (s.mult && preBasis(s) ? n0(streetAtOurs(s.mult)) : s.mult ? `${vAt(s.mult)} (post-Ind AS)` : '–');
const sensRows = [
  ['Restaurant Brands Asia added to the peer set', `QSR move ${pc1(sens.withRba)} (vs ${pc1(sectorEv)}) → ${evALT.withRba}x`, vAt(evALT.withRba)],
  ['Sapphire left out (its price follows Devyani\'s since the merger)', `Jubilant and Westlife only: ${pc1(sens.exSapphire)} → ${evALT.exSap}x`, vAt(evALT.exSap)],
  ['Retail set instead of QSR (DMART.ctx.js)', `${RET.map(s => shortName(s)).join(', ')}: ${pc1(sens.retailEv)} → ${evALT.retail}x`, vAt(evALT.retail)],
  ['Widened set (QSR + retail)', `${pc1(sens.widened)} → ${evALT.widened}x`, vAt(evALT.widened)],
  ['Skip the IPO year (own window from Apr-2022, same-window peer move)', `Own median ${n1(HEV22.med)}x, peers ${pc1(sens.qsr22)} → ${evALT.since22}x`, vAt(evALT.since22)],
  ['Only the Thailand years (own window from Apr-2024, same-window peer move)', `Own median ${n1(HEV24.med)}x, peers ${pc1(sens.qsr24)} → ${evALT.since24}x`, vAt(evALT.since24)],
  ['No sector move', `${n1(HEV.med)}x → ${evALT.noMove}x`, vAt(evALT.noMove)],
  ['Street multiple on our numbers (Motilal Oswal 25x after rent)', `25x our Sep-28E after-rent EBITDA (₹${n0(preSep28)} cr), net debt before leases, less minorities`, n0(streetAtOurs(25))],
  ['Street multiple on our numbers (JM Financial 27x after rent)', '27x, same basis', n0(streetAtOurs(27))],
  ['No deduction for Camas\'s share of Thailand', `Adds back ₹${n0(-minPart.value)} cr`, n0((V.sotp.equity - minPart.value) / shares)],
  ['Sapphire merger completes (Case A, Sapphire at market, no synergies)', 'See the merger chapter', n0(PF.mktNoSyn)],
  ['Sapphire merger completes with full synergies (Case B)', 'See the merger chapter', n0(PF.mktSyn)],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${evMULT.base}x Sep-28E EBITDA less Temasek's share gives {{dcf.tp|inr}}; the market pays ${n1(evSepNow)}x`,
  blocks: [
    { h: 'How the street values Devyani' },
    { p: `The street uses EV/EBITDA on EBITDA after rent ("pre-Ind AS 116"), about 1.5-2 years forward (Mar-28E to Jun-28E), at 25-27x; one house uses a DCF. We use the same method on the same date (Sep-28E: half FY28E, half FY29E) but on reported EBITDA before rent, with lease liabilities (₹${n0(leases)} cr at Mar-2026) counted as debt: the same economics, and the basis on which the stock's own history and the peers' multiples can be measured. Because ~${n1(phiSep * 100)}% of the group's EBITDA belongs to Camas (Temasek) through Thailand, we value the parts at the group multiple and deduct the minorities' share. To compare, our target equals **${n1(tpPre)}x** Sep-28E EBITDA after rent (₹${n0(preSep28)} cr) on the street's basis, with Mar-2026 leases deducted.` },
    { exhibit: { type: 'table', title: 'How the street values the stock (latest dated note per broker, standing on 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EBITDA (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${sd(s.date)})${s.postQ1 ? '' : ' – before Q1'}`, s.rating, n0(s.tp), s.method, s.multiple || '–', s.on, ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**SOTP on EV/EBITDA (reported, leases as debt), less minorities**', `**${evMULT.base}x (≈${n1(tpPre)}x after rent)**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'KFC recovery priced well below the stock\'s own history; merger upside not in the base'] },
    ], source: 'Broker PDFs and dated summaries as listed in deep.json. "At our EBITDA" applies each after-rent multiple to our after-rent EBITDA (net debt before leases, minorities deducted); Anand Rathi\'s basis is not stated, so its multiple is applied to our reported EBITDA.' } },
    { h: `Our target multiple: ${evMULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Window', `Listed ${sd(LISTED)}, so the window runs from listing (not Apr-2021) to ${ASOF_TXT}: ${HEV.n} weekly closes, five years. The listing months traded above the issue price (₹90) but not out of line with the next year; skipping them is shown as a sensitivity`, 'Window: listing to 30-Sep-2026'],
      ['2. Own forward EV/EBITDA (used)', `EV = price × shares (120.63 cr before the Sky Gate issue, 123.29 cr after) grossed up for minorities from the Thai deal (Camas's share: ${n1(phiHist[2025] * 100)}% of FY25 EBITDA, ${n1(phiHist[2026] * 100)}% of FY26) + net debt incl. leases (latest March balance sheet public, Mar-2024 from the Thai deal date) ÷ next full-year EBITDA (company basis; FY27E-FY28E ours). Median ${n1(HEV.med)}x, 25th-75th percentile ${n1(HEV.p25)}-${n1(HEV.p75)}x, range ${n1(HEV.min)}-${n1(HEV.max)}x. Without the minorities gross-up: ${n1(HEVplain.med)}x`, `**Starting point: ${n1(HEV.med)}x**`],
      ['3. Trough and turnaround check', `EBITDA never fell below half its previous peak inside the window (FY21's Covid low is before listing), so no trough years are excluded and there is no structural break in EBITDA. EPS is distorted: losses or near-zero EPS in FY24-FY26, so the house forward P/E function (forwardMedian) gives ${n0(FM.median)}x after excluding ${FM.troughYears.join(' and ')} (${n0(FM.medianAll)}x including them): not usable. Sub-windows (from Apr-2022, from Apr-2024) are shown as sensitivities, as in FORCEMOT`, 'EV/EBITDA, not P/E; no adjustment'],
      ['4. Sector move (five-year)', `QSR peers' trailing EV/EBITDA (Screener, leases in EV) on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc1(sectorEv)}. Excluded: Devyani itself; ${EXCL.map(s => `${shortName(s)} (no complete five-year EV/EBITDA history: ${evCount(s)} of 261 weeks)`).join('; ')}. Set as in JUBLFOOD.ctx.js. Sapphire is kept although its price has followed Devyani's since Jan-2026 (ex-Sapphire row below)`, `× ${kEv.toFixed(3)}`],
      ['5. Growth vs the street', `The street's 25-27x after-rent multiples sit on higher EBITDA (Motilal Oswal FY28E ₹746 cr after rent vs our ₹${n0(preEbitda[1])} cr)`, 'No adjustment (§7c); see sensitivity'],
      ['6. Peers', `QSR peer median trailing EV/EBITDA ${n1(peerEv)}x; Devyani ${n1(P.DEVYANI.evEbitda)}x trailing (Screener, no minorities gross-up)`, 'In line with peers on trailing numbers'],
      ['7. Returns vs cost of capital', 'Screener ROCE ~5-6% (incl. right-of-use assets and goodwill) against an ~11.6% cost of capital: returns do not justify a premium', 'No adjustment (§7c); the DCF cross-check shows it'],
      ['8. Result (nearest half-turn)', `${n1(HEV.med)}x × ${kEv.toFixed(3)} = ${n1(HEV.med * kEv)}x`, `**${evMULT.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr**`],
      ['9. Bull / bear', `75th / 25th percentile forward EV/EBITDA with the move (${n1(HEV.p75)}x / ${n1(HEV.p25)}x × ${kEv.toFixed(3)})`, `${evMULT.bull}x / ${evMULT.bear}x`],
    ], source: `Screener.in prices to ${ASOF_TXT}; company EBITDA; GAM estimates for FY27-28E; peers' Screener EV/EBITDA series` } },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case, ₹ crore)', head: ['Part', 'Metric', 'Multiple', 'Value (₹ cr)', '₹ per share'], wide: [0], rows: [
      ...SP.map(p => [p.name, p.metric != null && !/Net cash/.test(p.name) ? n0(p.metric) : /Net cash/.test(p.name) ? n0(p.metric) : '–', p.mult ? `${p.mult}x` : '–', n0(p.value), n1(p.value / shares)]),
      { hl: true, cells: ['**Equity value / target (rounded to ₹5)**', '', '', `**${n0(V.sotp.equity)}**`, '**{{dcf.tp|num}}**'] },
    ], source: `GAM Research. Minorities: ${rup(minPart.note || '')}` } },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA since listing: median ${n1(HEV.med)}x; ${n1(evNow)}x FY28E now`, unit: 'EV (incl. leases, minorities grossed up) ÷ next full-year EBITDA (x)', x: X.fwdEvChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.fwdEvChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: evMULT.base, text: `Our multiple: ${evMULT.base}x`, color: '#cf8f1f' }, { v: Math.round(HEV.med * 10) / 10, text: `Median ${n1(HEV.med)}x`, color: '#8c8c8c' }], source: 'Screener.in weekly prices; company EBITDA; FY27-28E GAM estimates' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['EV/EBITDA SOTP (target)', 'P/E', 'DCF (before minorities)', 'Street median (post-Q1)', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('sotp').value), Math.round(mv('pe').value), Math.round(mv('dcf').value), Math.round(medTp), Math.round(price)], fmt: 'inr' }], labels: 'all', highlight: 'EV/EBITDA SOTP (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**EV/EBITDA (SOTP)**', '**Target**', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr, net debt incl. leases, less minorities`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '**{{dcf.blend.methods.0.value|n1}}**', '–', '{{scen.bull.blend.methods.0.value|n1}}', '{{scen.bear.blend.methods.0.value|n1}}'],
      ['P/E', 'Cross-check', `Sep-28E EPS ₹${n2((F.eps[1] + F.eps[2]) / 2)}`, `${peMULT.base}x (Jubilant FoodWorks' derived forward P/E)`, '{{dcf.blend.methods.1.value|n1}}', pc(mv('pe').vsTarget), '{{scen.bull.blend.methods.1.value|n1}}', '{{scen.bear.blend.methods.1.value|n1}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E (lease principal as capex), discount rate {{dcf.ke|n1}}%, g 5.5%; before minorities', '–', '{{dcf.blend.methods.2.value|n1}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|n1}}', '{{scen.bear.blend.methods.2.value|n1}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** Neither supports the price. Devyani's own P/E history is unusable, so we test its earnings at Jubilant FoodWorks' derived ${peMULT.base}x forward P/E: Sep-28E EPS of ₹${n2((F.eps[1] + F.eps[2]) / 2)} is worth ₹${n0(mv('pe').value)}. The DCF (${n1(V.ke)}% discount rate, 5.5% terminal growth, EBITDA margin fading up to 18.5%) gives ₹${n0(mv('dcf').value)} before minorities, ~₹${n0(mv('dcf').value * (1 - phiSep))} after: store and lease spending absorb most of the EBITDA for years. **The rating rests on the multiple: Devyani trades at ${n1(evSepNow)}x Sep-28E EBITDA against a ${n1(HEV.med)}x median since listing, a larger discount than the QSR sector's ${pc1(sectorEv)}. If the market keeps valuing QSR on cash returns rather than on its own history, the upside will not come.**` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sensRows, source: 'GAM Research. Per PLAYBOOK §7c, sub-windows, other peer sets, street multiples and the pending merger are shown, not added to the base.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${evMULT.bull}x (75th percentile, with the sector move).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${evMULT.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr less minorities.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${evMULT.bear}x (25th percentile, with the sector move).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary (before minorities)', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Net debt incl. lease liabilities at Mar-27 (negative = debt)', '{{dcf.netCash|num}}'], ['Equity value (before minorities)', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|n1}}'],
      { hl: true, cells: ['**12-month DCF value (rolled forward 6 months)**', '**₹{{dcf.blend.methods.2.value|n1}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. The engine discounts at one rate: beta 0.85 sets it at ~11.6%, our WACC with leases and bank debt at ~17% of EV. It has no minority line: deduct ~15% for Camas\'s share.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'r / g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed QSR peers (and the retail set used for sensitivity)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'Five-year median (x)', 'vs median', 'ROE'], rows: [...PEERS, ...RET.map(s => P[s])].map(p => [p.symbol === 'DEVYANI' ? '**Devyani**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : RET.includes(p.symbol) ? ' (retail, sensitivity)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : '–', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.evEbitda != null ? n1(p.evEbitda) : '–', X.MED5EV[p.symbol] ? n1(X.MED5EV[p.symbol]) : '–', dr5Ev[p.symbol] != null ? pc(dr5Ev[p.symbol]) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing EV/EBITDA (leases in EV) at the NSE close on ${ASOF_TXT}; five-year medians Oct-2021 to Sep-2026. P/E is not shown: Devyani, Sapphire and Westlife earn close to nothing.` } },
  ],
};

module.exports = { street, valuation };
