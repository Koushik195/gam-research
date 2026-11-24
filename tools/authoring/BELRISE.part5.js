// Belrise Industries report, part 5: the street and the valuation (P/E on Sep-28E EPS; multiple derived from the stock's
// own forward P/E over the 12 months to 30-Sep-2026 and the same-window auto-component sector move; EV/EBITDA and DCF
// cross-checks; scenarios; peers).
const X = require('./BELRISE.ctx');
const { D, F, V, n0, n1, n2, pc, pc1, price, mv, PE12, PEL, PE6, PEH2, PEIPO, FM12, sector12, sector12All, sector5, k, k5, dr12, dr5, P, PEERS, USED, EXCL, shortName,
  MULT, epsSep, evMed, evP25, evMULT, rest, ttmEbitda, ebitdaSep28, rating, ST, live, medTp, medTpAll, ASOF_TXT, medOf, half, sd, epsMerged, mergerAccretion, ownDr12, ownMed12 } = X;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const tpAt = m => n0(m * epsSep.base);
const peerPe = medOf(USED.map(s => P[s].pe));
const drTxt = s => `${shortName(s)} ${pc1(dr12[s])}`;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: all Buy, targets ₹250-280 in 2026; median ₹${n0(medTp)}`,
  blocks: [
    { p: `Every house that covers Belrise rates it Buy. In 2026: Jefferies raised its target to ₹280 after Q1FY27 (19-Aug-2026; ₹250 at 26x FY28E in May), HSBC initiated at ₹270 (by 9-Jun-2026) and JM Financial has ₹250 at 26x FY28E (26-May-2026). Investec (₹185, Sep-2025) and LKP (₹192, Sep-2025) have not updated in a year. Median of the 2026 targets ₹${n0(medTp)} (${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n2(price)}); all five ₹${n0(medTpAll)}. Those that state a method use **P/E on FY28E EPS** at 26x. ${D.street.note}` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Calls and filings as cited; GAM Research' } },
  ],
};

const ourAt = s => { const m = String(s.multiple).match(/(\d+(?:\.\d+)?)x/); return s.method === 'P/E' && m ? n0(+m[1] * epsSep.base) : '–'; };
const mergedMult = half(PE12.med * k / (1 + mergerAccretion / 100));
const sens = [
  ['Five-year sector move instead of the same-window move', `Peers vs their five-year medians ${pc1(sector5)} instead of ${pc1(sector12)}: ${n1(PE12.med)}x → ${half(PE12.med * k5)}x`, tpAt(half(PE12.med * k5))],
  ['Sector move including Bharat Forge and Gabriel', `${pc1(sector12All)} instead of ${pc1(sector12)}`, tpAt(half(PE12.med * (1 + sector12All / 100)))],
  ['Whole history since listing (incl. IPO months)', `Forward P/E median ${n1(PEL.med)}x since 28-May-2025, with the move`, tpAt(half(PEL.med * k))],
  ['Last six months only (Apr-Sep 2026)', `Forward P/E median ${n1(PE6.med)}x, with the move`, tpAt(half(PE6.med * k))],
  ['Belrise\'s own move instead of the sector\'s (not allowed by §7c)', `Trailing P/E ${ownDr12 == null ? 'n.a.' : pc1(ownDr12)} vs its 12-month median (${n1(ownMed12)}x): ${n1(PE12.med)}x → ${half(PE12.med * (1 + (ownDr12 || 0) / 100))}x`, tpAt(half(PE12.med * (1 + (ownDr12 || 0) / 100)))],
  ['Merger in our EPS, same multiple', `Sep-28E EPS ₹${n2(epsMerged)} (+${n1(mergerAccretion)}%) at ${MULT.base}x. Overstates: the history would then also be on merged EPS (from Feb-2026), i.e. a lower multiple`, n0(MULT.base * epsMerged)],
  ['Merger in, history restated', `${MULT.base}x ÷ ${n2(1 + mergerAccretion / 100)} ≈ ${mergedMult}x on merged EPS`, n0(mergedMult * epsMerged)],
  ['Street multiple (26x FY28E) on our Sep-28E EPS', '26x', tpAt(26)],
  ['Growth premium (PEG-style)', `EPS ~${Math.round(X.epsCagrFwd)}% a year FY26-29E, partly interest on the QIP cash; no faster than what the market paid for over the window`, 'not applied'],
  ['Returns discount', 'ROCE 14-15% vs a 12.5% cost of equity: thin, but unchanged through the window', 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the market pays ${n1(X.sepNow)}x`,
  blocks: [
    { h: 'How the street values Belrise' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our Sep-28E EPS.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${sd(s.date)})${s.stale ? ' – stale' : ''}`, s.rating, n0(s.tp), s.method, s.multiple, s.on, ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Good operator; per-share growth diluted by the QIP; the merger and acquisitions are upside we do not pay for yet'] },
    ], source: 'Press reports of the notes: Equitybulls (19-Aug-2026), Multibagg (26-May and 9-Jun-2026), Business Today (26-May-2026, Sep-2025), Business Standard (Sep-2025). The notes themselves were not available to us.' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c; recently listed)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (used)', `Price ÷ next full-year EPS on every weekly close from 1-Oct-2025 to ${ASOF_TXT} (${PE12.n} weeks): median ${n1(PE12.med)}x, 25th-75th percentile ${n1(PE12.p25)}-${n1(PE12.p75)}x, range ${n1(PE12.min)}-${n1(PE12.max)}x; Oct-25 to Mar-26 ${n1(PEH2.med)}x, Apr-Sep 2026 ${n1(PE6.med)}x. House forwardMedian (every 5th week) ${n1(FM12.median)}x. No trough years (forward EPS never below half the prior peak)`, `**Starting point: ${n1(PE12.med)}x**`],
      ['2. IPO months skipped', `Listed 28-May-2025 at ₹90; Jun-Sep 2025 traded at ${n1(PEIPO.min)}-${n1(PEIPO.max)}x (median ${n1(PEIPO.med)}x) while the stock re-rated from ₹94 to ₹157: a post-listing discovery phase, left out (§7c, as Hyundai and Ather)`, 'Window Oct-2025 to Sep-2026'],
      ['3. EPS basis', 'FY26 pro forma for the QIP (₹5.14 on 96.7 cr shares); FY27-28E ours, before the pending merger. Before Jul-2026 the price related to 89 cr shares, but the QIP at ₹220 was near the market price and its cash earns interest in our EPS, so per-share earnings are almost unchanged', 'No adjustment'],
      ['4. Sector move (same window)', `Auto-component peers\' trailing P/E on ${ASOF_TXT} vs their own medians since 1-Oct-2025: ${USED.map(drTxt).join(', ')}; median ${pc1(sector12)}. Excluded: ${EXCL.map(s => `${shortName(s)} (${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join('; ')}; with them ${pc1(sector12All)}. Belrise itself not used. Five-year version: ${pc1(sector5)}`, `× ${k.toFixed(3)}`],
      ['5. Growth vs the street', 'The street\'s 26x FY28E comes with ~27% a year EPS growth FY26-28E (consensus, incl. the merger); ours is lower per share', 'No adjustment (§7c); see sensitivity'],
      ['6. Peers', `Peer median trailing P/E ${n1(peerPe)}x; Belrise ${n1(P.BELRISE.pe)}x with ROCE ~15% (peers mostly 15-25%)`, 'No extra signal'],
      ['7. Result (nearest half-turn)', `${n1(PE12.med)}x × ${k.toFixed(3)} = ${n1(PE12.med * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n2(epsSep.base)}**`],
      ['8. Bull / bear', `Bull: no sector move (${n1(PE12.med)}x). Bear: 25th percentile with the move (${n1(PE12.p25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in weekly prices and peer P/E to ${ASOF_TXT}; GAM EPS; tools/authoring/valuation-blend.js forwardMedian as a check` } },
    { pair: [
      { type: 'line', title: `Forward P/E since listing: ${n1(PE12.med)}x median over the last 12 months`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: PE12.med, text: `12-month median ${n1(PE12.med)}x`, color: '#8c8c8c' }], source: 'Screener.in weekly prices; EPS FY26 pro forma, GAM FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, Math.round(price)], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n2(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|n1}}**', '–', '{{scen.bull.blend.methods.0.value|n1}}', '{{scen.bear.blend.methods.0.value|n1}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr plus net cash`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|n1}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|n1}}', '{{scen.bear.blend.methods.1.value|n1}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|n1}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|n1}}', '{{scen.bear.blend.methods.2.value|n1}}'],
      { hl: true, cells: ['**12-month target (rounded to ₹5)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA plus net cash) gives ₹${n0(mv('ev').value)}, ${pc(mv('ev').vsTarget)} vs the target: ${evMULT.base}x is Belrise\'s ${n1(evMed)}x median trailing EV/EBITDA over the same 12 months with the same move, restated from trailing (₹${n0(ttmEbitda)} cr in the year to Jun-26) to Sep-28E EBITDA (× ${rest.toFixed(3)}). The DCF gives only ₹${n0(mv('dcf').value)} at a ${n1(V.ke)}% cost of equity and 6% terminal growth: with capex at ~5% of revenue and a 12-13% EBITDA margin, free cash flow is thin, so the market is paying for growth well beyond our horizon or for acquisitions not yet made. **All three methods sit at or below the price.**` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, own de-rating, other windows, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector move).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, with the move).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Net cash at Mar-27 (incl. leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|n1}}'],
      { hl: true, cells: ['**12-month DCF value (rolled forward 6 months at Ke)**', '**₹{{dcf.blend.methods.2.value|n1}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Net cash after the QIP, so the cost of equity (beta 1.0) is the discount rate.' } },
    { exhibit: { type: 'table', title: 'Listed auto-component peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 12-month median', 'vs 5-yr median', 'ROE'], rows: PEERS.map(p => [p.symbol === 'BELRISE' ? '**Belrise**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : 'Dec year', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.pe != null ? n1(p.pe) : '–', p.symbol === 'BELRISE' ? (ownDr12 == null ? '–' : pc(ownDr12)) : pc(dr12[p.symbol]), p.symbol === 'BELRISE' ? 'n.a.' : pc(dr5[p.symbol]), p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Schaeffler reports on December years. Belrise's trailing P/E is on reported (pre-QIP weighted) EPS.` } },
  ],
};

module.exports = { street, valuation };
