// Lenskart report, part 5: the street and the valuation (EV/EBITDA on Sep-28E EBITDA, as the street does; multiple derived
// from the stock's own forward EV/EBITDA since listing and the retail peers' EV/EBITDA move over the same window; P/E and
// DCF cross-checks; scenarios; peers).
const X = require('./LENSKART.ctx');
const { D, F, V, S, n0, n1, n2, pc, pc1, price, shares, mv, PEL, EVL, EVA, EVX, sectorL, sector5, sectorLvmm, sectorNet, evSectorL, evSector5, kEv, k, drL, dr5, evDrL, evDr5, P, PEERS, USED, EXCL, NET, shortName,
  MULT, ALT, evMULT, evALT, epsSep, ebitdaSep28, ebitdaSepSc, preSep28, preEbitda, rent, leases, pickTreas, preMultAt, streetAtOurs, rating, ST, post, medTp, medAll, nBuy, ASOF, ASOF_TXT, LISTED, medOf, half, firstMedPx, treas0, evNow, evSepNow } = X;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const sd = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}-${y.slice(2)}`; };
const evAt = m => n0((m * ebitdaSep28 + pickTreas) / shares);
const drTxt = s => `${shortName(s)} ${pc1(evDrL[s])}`;
const months = ((new Date(ASOF) - new Date(LISTED)) / 2.63e9).toFixed(1);
const peerEv = medOf(USED.map(s => P[s].evEbitda));
const tpPre = preMultAt(V.tp);
const conf = D.street.brokers.filter(s => s.mult);

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ${nBuy} of ${post.length} post-results notes are Buy; median target ₹${n0(medTp)}, all on EV/EBITDA after rent`,
  blocks: [
    { p: `Coverage began after the IPO quiet period (Jefferies, Macquarie, Emkay and Avendus in Nov-Dec 2025; Ambit published a Sell before listing) and widened in 2026 (Antique, Motilal Oswal, Elara, CLSA, BofA, J.P. Morgan, Nomura, ICICI Securities). After the Q1FY27 results (12-Aug-2026) ${post.length} houses published dated targets: median ₹${n0(medTp)} (${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n2(price)}); including the older notes still standing, the median is ₹${n0(medAll)}. ${nBuy} are Buy or equivalent, Citi and HSBC are neutral and Ambit is the lone Sell (₹496). ${rup(D.street.methodSummary)}` },
    { p: rup(D.street.consensus) },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], wide: [0], rows: D.critiques.map(r => [rup(r)]), source: 'Broker notes and company filings as cited; GAM Research' } },
  ],
};

const ourAt = s => (s.mult ? n0(streetAtOurs(s.mult)) : '–');
const sens = [
  ['Five-year sector move instead of the same-window move', `Retail peers vs their five-year EV/EBITDA medians ${pc1(evSector5)} instead of ${pc1(evSectorL)}: ${n1(EVL.med)}x → ${evALT.five}x`, evAt(evALT.five)],
  ['Only the months valued on FY28E (Apr-Sep 2026)', `Own forward median ${n1(EVA.med)}x → ${evALT.fy28only}x`, evAt(evALT.fy28only)],
  ['Skip the listing weeks (calendar 2026 only)', `Own median ${n1(EVX.med)}x → ${evALT.cal26}x`, evAt(evALT.cal26)],
  ['Retail set including Vishal Mega Mart', `${pc1(X.evSectorLvmm)} (vs ${pc1(evSectorL)}) → ${evALT.vmm}x`, evAt(evALT.vmm)],
  ['Internet platforms instead of retailers', `Eternal, Info Edge, IndiaMART, Nykaa: ${pc1(X.evSectorNet)} → ${evALT.net}x`, evAt(evALT.net)],
  ['No sector move (bull multiple)', `${n1(EVL.med)}x → ${evMULT.bull}x`, evAt(evMULT.bull)],
  ['Street multiple on our numbers (Motilal Oswal 49x Sep-28E after rent)', `49x our Sep-28E pre-IndAS EBITDA (₹${n0(preSep28)} cr) plus net cash before leases`, n0(streetAtOurs(49))],
  ['Street median-type multiple (Emkay 56x)', `56x our Sep-28E pre-IndAS EBITDA`, n0(streetAtOurs(56))],
  ['Growth premium', `EBITDA after rent grows ~${n0((Math.pow(preEbitda[2] / X.preEbitda26, 1 / 3) - 1) * 100)}% a year FY26-29E in our model; the listing-period multiple already priced fast growth`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${evMULT.base}x Sep-28E EBITDA gives {{dcf.tp|inr}}; the market pays ${n1(evSepNow)}x`,
  blocks: [
    { h: 'How the street values Lenskart' },
    { p: `The street uses EV/EBITDA on EBITDA after rent ("pre-IndAS 116"), 1.5-2 years forward, at 48-58x. We use the same method on the same date (Sep-28E: half FY28E, half FY29E) but on reported EBITDA before rent, with lease liabilities (₹${n0(leases)} cr at Mar-2026) counted as debt. The two are equivalent ways of treating rent; ours is the one on which the stock's own history and our model can be measured consistently. To compare, our target equals **${n1(tpPre)}x** Sep-28E EBITDA after rent (₹${n0(preSep28)} cr, our estimate) on the street's basis. The "At our EBITDA" column applies each broker's multiple to our after-rent EBITDA.` },
    { exhibit: { type: 'table', title: 'How the street values the stock (latest dated note per broker)', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EBITDA (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${sd(s.date)})${s.exclMedian ? ' – not in median' : ''}`, s.rating, n0(s.tp), s.method, s.multiple, s.on, ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**EV/EBITDA (reported, leases as debt)**', `**${evMULT.base}x (≈${n1(tpPre)}x after rent)**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'A quality compounder priced for more than its own listed history supports; supply overhang'] },
    ], source: `${rup(D.street.notInTable)} Sources: broker PDFs and dated press reports as listed in deep.json (12-Aug to 30-Sep-2026 for post-results notes).` } },
    { h: `Our target multiple: ${evMULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c; recently listed)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Window', `Listed ${sd(LISTED)}: ${months} months to ${ASOF_TXT}, under the 12 months used for other recent listings (TENNIND precedent). Whole period on every daily close (${EVL.n} points); the sector is measured over the same window. IPO-premium check: the listing weeks (Nov-Dec 2025, median price ₹${n0(firstMedPx)}) traded near the ₹402 issue price and well below the later range, so no months are skipped`, 'Window: listing to 30-Sep-2026'],
      ['2. Own forward EV/EBITDA (used)', `EV (price × ${n1(shares)} cr shares less ₹${n0(treas0)} cr net cash after leases) ÷ next full-year reported EBITDA (FY27E to Mar-2026, FY28E from Apr-2026, our estimates): median ${n1(EVL.med)}x, 25th-75th percentile ${n1(EVL.p25)}-${n1(EVL.p75)}x, range ${n1(EVL.min)}-${n1(EVL.max)}x; no loss or trough years`, `**Starting point: ${n1(EVL.med)}x**`],
      ['3. One-offs', 'FY25\'s Owndays gain and FY26 exceptional items sit below EBITDA and in years that are never the forward year inside the window', 'No adjustment'],
      ['4. Sector move (same window)', `Retail peers' trailing EV/EBITDA on ${ASOF_TXT} vs their medians since ${sd(LISTED)}: ${USED.map(drTxt).join(', ')}; median ${pc1(evSectorL)} (P/E basis ${pc1(sectorL)}). Excluded: ${EXCL.map(s => shortName(s)).join(', ')} (DMART retail set). Five-year medians (shown): ${pc1(evSector5)}. Lenskart itself is not used`, `× ${kEv.toFixed(3)}`],
      ['5. Growth vs the street', `The street's 48-58x after-rent multiples come with higher EBITDA for some (Motilal Oswal FY28E ₹2,370 cr after rent vs our ₹${n0(preEbitda[1])} cr) and similar for others (Emkay ₹2,020 cr)`, 'No adjustment (§7c); see sensitivity'],
      ['6. Peers', `Retail peer median trailing EV/EBITDA ${n1(peerEv)}x; Lenskart ${n1(P.LENSKART.evEbitda)}x trailing`, 'Lenskart is the most expensive retailer on trailing numbers, justified only by growth'],
      ['7. Result (nearest half-turn)', `${n1(EVL.med)}x × ${kEv.toFixed(3)} = ${n1(EVL.med * kEv)}x`, `**${evMULT.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr**`],
      ['8. Bull / bear', `Bull: no sector move (${n1(EVL.med)}x). Bear: 25th-percentile forward EV/EBITDA with the move (${n1(EVL.p25)}x × ${kEv.toFixed(3)})`, `${evMULT.bull}x / ${evMULT.bear}x`],
    ], source: `Screener.in daily prices to ${ASOF_TXT}; GAM estimates for FY27-28E EBITDA; peers' Screener EV/EBITDA series` } },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA since listing: median ${n1(EVL.med)}x; ${n1(evNow)}x FY28E now`, unit: 'EV ÷ next full-year EBITDA, after Ind AS 116 (x)', x: X.fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: evMULT.base, text: `Our multiple: ${evMULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in daily prices; FY27-28E EBITDA GAM estimates (the step in Apr-2026 is the switch from FY27E to FY28E)' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['EV/EBITDA (target)', 'P/E', 'DCF', 'Street median (post-Q1)', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('ev').value), Math.round(mv('pe').value), Math.round(mv('dcf').value), Math.round(medTp), Math.round(price)], fmt: 'inr' }], labels: 'all', highlight: 'EV/EBITDA (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**EV/EBITDA**', '**Target**', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr plus net cash after leases`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '**{{dcf.blend.methods.0.value|n1}}**', '–', '{{scen.bull.blend.methods.0.value|n1}}', '{{scen.bear.blend.methods.0.value|n1}}'],
      ['P/E', 'Cross-check', `Sep-28E EPS ₹${n2(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '{{dcf.blend.methods.1.value|n1}}', pc(mv('pe').vsTarget), '{{scen.bull.blend.methods.1.value|n1}}', '{{scen.bear.blend.methods.1.value|n1}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E (lease principal as capex), Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|n1}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|n1}}', '{{scen.bear.blend.methods.2.value|n1}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** P/E (${MULT.base}x Sep-28E EPS of ₹${n2(epsSep.base)}: Lenskart's ${n1(PEL.med)}x forward median since listing × the retail peers' ${pc1(sectorL)} P/E move) gives ₹${n0(mv('pe').value)}, close to the EV/EBITDA value. The DCF gives ₹${n0(mv('dcf').value)}: at a ${n1(V.ke)}% cost of equity, 6% terminal growth and EBITDA fading up to 27% of revenue (consistent with the ~25% after-rent aim), cash flows support well under today's price, because store and lease spending absorb most of the EBITDA for years. **The stock at ₹${n2(price)} prices ${n1(evSepNow)}x Sep-28E EBITDA, above the ${n1(EVL.med)}x it has commanded on average since listing; with retail multiples ~${Math.abs(Math.round(evSectorL))}% below their own averages over the same months, the rule gives a lower value.**` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, sub-windows, other peer sets, street multiples and growth views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${evMULT.bull}x (no sector move) on Sep-28E EBITDA of ₹${n0(ebitdaSepSc.bull)} cr.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${evMULT.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${evMULT.bear}x (25th percentile, with the sector move) on ₹${n0(ebitdaSepSc.bear)} cr.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Net cash after lease liabilities at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|n1}}'],
      { hl: true, cells: ['**12-month DCF value (rolled forward 6 months at Ke)**', '**₹{{dcf.blend.methods.2.value|n1}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Bank debt is negligible and leases are deducted as debt, so the cost of equity is the discount rate.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of equity down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke / g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed retail peers (and internet platforms for reference)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'EV/EBITDA vs median since Nov-25', 'P/E vs median since Nov-25', 'ROE'], rows: [...PEERS, ...NET.map(s => P[s])].map(p => [p.symbol === 'LENSKART' ? '**Lenskart**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : NET.includes(p.symbol) ? ' (internet, reference)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : '–', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.pe != null ? n1(p.pe) : '–', p.evEbitda != null ? n1(p.evEbitda) : '–', evDrL[p.symbol] != null ? pc(evDrL[p.symbol]) : '–', drL[p.symbol] != null ? pc(drL[p.symbol]) : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Lenskart's EV/EBITDA is on trailing reported EBITDA with leases in debt.` } },
  ],
};

module.exports = { street, valuation };
