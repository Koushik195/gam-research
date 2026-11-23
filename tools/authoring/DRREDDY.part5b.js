// Dr. Reddy's report, part 5b: valuation (P/E on Sep-28E EPS; EV/EBITDA and DCF cross-checks; sensitivities;
// scenarios; DCF detail; peers).
const X = require('./DRREDDY.ctx');
const { D, F, V, A, n0, n1, pc, pc1, rup, price, mv, FM, HA, HR, FWDFY, thrA, thrR, exFY27, preCliff, fwdAdj, troughAdj, MULT, SENS, epsSep, val, k, SECTOR_SET, sectorCalc, sectorCalcAll, sectorEvCalc, kev,
  derate, derateEv, MED5, MED5EV, P, PEERS, USED, EXCL_SYMS, shortName, HEV, evMULT, ebitdaSep, rating, ST, medTp, shortDate, ASOF_TXT, peSep, peFY28, peFY27, SEMA_AT, UE, epsCagrFwd } = X;
const eps = epsSep.base;
const ourAt = s => { const m = parseFloat(s.multiple); if (!m || s.method !== 'P/E' || /core/.test(s.multiple)) return '–'; const e = /12m/.test(s.on) ? (F.eps[1] + F.eps[2]) / 2 : /Jun-28/.test(s.on) ? 0.75 * F.eps[1] + 0.25 * F.eps[2] : /FY28/.test(s.on) ? F.eps[1] : null; return e ? n0(Math.round(m * e / 10) * 10) : '–'; };
const drTxt = s => `${shortName(s)} ${pc1(derate[s])}`;
const fy = l => FWDFY.find(x => x.fy === l) || { med: NaN, eps: NaN };

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the stock is fairly priced on the street's own method`,
  blocks: [
    { h: "How the street values Dr. Reddy's" },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our EPS for the same period (a 12-month-forward multiple is read as our Sep-28E).' },
    { exhibit: { type: 'table', title: 'How the street values the stock (notes standing on 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.filter(s => s.method !== 'n.d.').map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple, s.on, ourAt(s), rup(s.thesis)]),
      ...ST.filter(s => s.method === 'n.d.').map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), 'n.d.', '–', '–', '–', rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Branded markets are solid; the US windfall is gone; semaglutide and abatacept are real but late; fair value is about today\'s price'] },
    ], source: 'Broker notes (MOSL, PL, Elara, Emkay, ICICI Direct, BOB; ICICI Securities May-2026); Business Today and Outlook Business (23-Jul-2026) for Nuvama, JM Financial and global houses. n.d. = method not disclosed in the source.' } },
    { h: `Our multiple: ${MULT.base}x, derived` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1a. Own history, reported EPS (house forwardMedian)', `One-year-forward P/E since Apr-2021 (every 5th weekly close, ${FM.series.length} points): median ${n1(FM.median)}x (25th-75th ${n1(HR.p25)}-${n1(HR.p75)}x). Trough years: ${FM.troughYears.length ? FM.troughYears.join(', ') : 'none'}. Reported EPS carries large one-offs (FY26 ₹981 cr of specific items, FY23-FY24 one-off gains), so per A18 practice this is a sensitivity`, `${n1(FM.median)}x (shown, not used)`],
      ['1b. Own history, EPS before one-offs (used)', `Same window and sampling on EPS before one-off items (MOSL adjusted EPS ₹${n1(UE.FY23)} / ${n1(UE.FY24)} / ${n1(UE.FY25)} / ${n1(UE.FY26)} for FY23-26; FY27E ₹${n1(F.eps[0] + SEMA_AT)} = our ₹${n1(F.eps[0])} + the Q1 semaglutide provision after tax; FY28E ₹${n1(F.eps[1])}): median ${n1(HA.med)}x (25th-75th ${n1(HA.p25)}-${n1(HA.p75)}x; ${HA.n} points). No trough years${troughAdj.length ? ' except ' + troughAdj.join(', ') : ''}. By forward year: FY23 ${n1(fy('FY23').med)}x, FY24 ${n1(fy('FY24').med)}x, FY25 ${n1(fy('FY25').med)}x, FY26 ${n1(fy('FY26').med)}x, FY27 ${n1(fy('FY27').med)}x, FY28 ${n1(fy('FY28').med)}x`, `Starting point: ${n1(HA.med)}x`],
      ['1c. Trough rule check', `FY27E EPS before one-offs ₹${n1(fy('FY27').eps)} vs half the best of FY24-26 (₹${n1(thrA(2027))}): not a trough. On reported EPS ₹${n1(F.eps[0])} vs ₹${n1(thrR(2027))}: not a trough, narrowly. The FY27 forward year (Apr-25 to Mar-26 prices) shows ${n1(fy('FY27').med)}x because the market looked through the gRevlimid cliff`, 'Keep FY27 (rule followed)'],
      ['2. Sector factor', `Pharma peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median of the nine ${pc1(sectorCalc)}. PLAYBOOK §7c sets +${SECTOR_SET}% for Dr. Reddy's (outside the set; its own ${pc1(derate.DRREDDY)} is trough-distorted and not used). Pharma trades above its medians, so this is a re-rating`, `× ${k.toFixed(3)}`],
      ['3. Result (nearest half-turn)', `${n1(HA.med)}x × ${k.toFixed(3)} = ${n1(HA.med * k)}x`, `**${MULT.base}x**`],
      ['4. Applied to', `Sep-28E EPS ₹${n1(eps)} (½ FY28E ₹${n1(F.eps[1])} + ½ FY29E ₹${n1(F.eps[2])}; 834.66 mn shares)`, `${MULT.base}x × ₹${n1(eps)} = ₹${n0(MULT.base * eps)}`],
      ['5. Bull / bear', `Bull: 75th percentile × factor (${n1(HA.p75)}x → ${MULT.bull}x) on bull EPS. Bear: 25th percentile × factor (${n1(HA.p25)}x → ${MULT.bear}x) on bear EPS. The low quartile is the FY24 forward year, when the market refused to pay for windfall gRevlimid EPS`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices to ${ASOF_TXT}; MOSL adjusted EPS (23-Jul-2026); GAM estimates for FY27-28E EPS in the forward series` } },
    { exhibit: { type: 'table', title: 'Sector factor: pharma peers vs their own five-year median P/E (30-Sep-2026 close)', head: ['Company', 'Trailing P/E', '5-yr median', 'Premium / (discount)', 'EV/EBITDA vs median', 'Used?'], rows: [...USED, ...EXCL_SYMS].map(s => [shortName(s), n1(P[s].pe), n1(MED5[s]), pc1(derate[s]), pc1(derateEv[s]), s === 'DRREDDY' ? 'No (self)' : EXCL_SYMS.includes(s) ? `No: ${D.peers.excluded[s]}` : 'Yes']).concat([['**Median of the nine peers used**', '', '', `**${pc1(sectorCalc)}**`, `**${pc1(sectorEvCalc)}**`, `PLAYBOOK §7c: +${SECTOR_SET}% (P/E)`], ['Memo: all 14 names excluding Dr. Reddy\'s', '', '', pc1(sectorCalcAll), '', 'Sensitivity only']]), source: 'Screener.in (trailing multiples at the NSE close; five-year medians from 30-Sep-2021); peersAsOf' } },
    { pair: [
      { type: 'line', title: 'Forward P/E since 2021: before one-offs vs reported', unit: 'Price ÷ next full-year EPS (x)', x: fwdAdj.map(x => x[0]), series: [{ name: 'EPS before one-offs', values: fwdAdj.map(x => x[1]), fmt: 'x', thin: true }, { name: 'Reported EPS (house)', values: fwdAdj.map(x => (FM.series.find(y => y[0] === x[0]) || [])[1] ?? null), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; MOSL adjusted EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research; street median of post-Q1 targets' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(eps)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr + engine net cash`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 5.5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us, honestly.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA: Dr. Reddy's ${n1(HEV.med)}x median one-year-forward EV/EBITDA since 2021 × the nine peers' EV/EBITDA factor of ${pc1(sectorEvCalc)}) gives ₹${n0(mv('ev').value)}, ${pc(mv('ev').vsTarget)} vs the target, because it credits the ~₹9,700 cr of net cash the engine builds by Sep-28E with no deals. The DCF gives ₹${n0(mv('dcf').value)} (${pc(mv('dcf').vsTarget)}) at an ${n1(V.ke)}% cost of equity with heavy working capital (34% of revenue) and a 21% long-run margin. Both sit within ±15% of the P/E target: the methods agree that the stock is roughly fairly priced. Neither is weighted into the target (PLAYBOOK §4).` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: [
      ['House median on reported EPS', `${n1(HR.med)}x × ${k.toFixed(3)} = ${n1(HR.med * k)}x → ${SENS.reported}x`, n0(val(SENS.reported))],
      ['FY27 treated as a trough year', `Median without the FY27 forward year ${n1(exFY27.med)}x → ${SENS.exFY27}x`, n0(val(SENS.exFY27))],
      ['Only forward years FY23-FY26 (gRevlimid in the denominator)', `${n1(preCliff.med)}x → ${SENS.preCliff}x`, n0(val(SENS.preCliff))],
      ['No sector factor', `${SENS.noFactor}x`, n0(val(SENS.noFactor))],
      ['All 14 pharma names excl. Dr. Reddy\'s as the factor', `${pc1(sectorCalcAll)} → ${SENS.all14}x`, n0(val(SENS.all14))],
      ['Own re-rating (trailing P/E vs own five-year median)', `${pc1(derate.DRREDDY)}: trailing EPS is trough-depressed; not meaningful`, 'not applied'],
      ['Street multiples on our EPS', '20x (MOSL) / 22x (ICICI Direct) / 23x (PL) on Sep-28E', `${n0(val(20))} / ${n0(val(22))} / ${n0(val(23))}`],
      ['Ex-gRevlimid median (windfall rule, PLAYBOOK §7c)', 'Would raise the FY23-FY26 forward P/Es; lenalidomide sales and profit were never disclosed', 'not computable'],
      ['Growth premium', `EPS ${pc(epsCagrFwd)} a year FY26-29E on the before-one-offs base (₹${n1(UE.FY26)} → ₹${n1(F.eps[2])}): no case for a premium`, 'not applied'],
    ], source: 'GAM Research. Per PLAYBOOK §7c, growth, returns and own-history views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +3 points a year, margin +2 points; ${MULT.bull}x.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{as.revenueGrowth.0|n1}}% / +{{as.revenueGrowth.1|n1}}% / +{{as.revenueGrowth.2|n1}}%; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −3 points a year, margin −2.5 points; ${MULT.bear}x.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: engine net cash at Mar-27 (incl. term deposits and equity stakes, less leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Working capital at the engine\'s 34% of revenue (Screener basis).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed pharma peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', '5-yr median P/E', 'vs median', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'DRREDDY' ? "**Dr Reddy's**" : shortName(p.symbol) + (EXCL_SYMS.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), n1(MED5[p.symbol]), pc1(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; Screener basis (profit before minorities for ROE).` } },
  ],
};

module.exports = { valuation };
