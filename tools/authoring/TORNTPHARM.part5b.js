// Torrent Pharma report, part 5b: valuation. EV/EBITDA primary (the street's majority method; neutral to the JB
// amortisation and the new debt); P/E on EPS before the JB amortisation and the DCF as cross-checks.
const X = require('./TORNTPHARM.ctx');
const { D, F, V, SC, n0, n1, pc, pc1, rup, ASOF_TXT, price, mv, MULT, ENGINE, tpAdj, repMultSens, adjSep, epsSep, adjEps, ppaPs, FM, medExc, medPre, medPostRep, medPostAdj, EXC_AT, sExc, multAdjRep, EXC_P25, EXC_P75,
  PEERS, P, MED5, derate, MED5EV, derateEv, USED, EXCL, sectorDrCalc, sectorDrAll, SECTOR_DR, k, sectorEvCalc, sectorEvAll, SECTOR_EV, kev, shortName, half, fwdEv, HEV, HEVpre, HEVpost, EVM, ebitdaSep, evNow, evNow27, treasSep, ndSepOwn, rating, ST, streetEvAt, moslAtOurs, shortDate, ebitdaCagr, SHARES } = X;
const evVal = (m, e = ebitdaSep, nd = -treasSep) => (m * e - nd) / SHARES;
const r10 = v => n0(Math.round(v / 10) * 10);
const vs = v => pc(v / V.tp * 100 - 100);
const peV = (m, e) => Math.round(m * e / 10) * 10;
const impliedFy28 = EVM.base * ebitdaSep / F.ebitda[1];
const sortDesc = (arr, by) => [...arr].sort((a, c) => by[c] - by[a]);

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${EVM.base}x Sep-28E EBITDA gives {{dcf.tp|inr}}`,
  blocks: [
    { h: 'How the street values Torrent' },
    { p: `Of the post-Q1 notes that disclose a method, two value Torrent on **EV/EBITDA on FY28E** (Prabhudas Lilladher 28x, ICICI Direct 27x) and one on **P/E** (Motilal Oswal, 50x 12-month-forward EPS); PL and MOSL used the same methods before the deal. We follow the majority: **EV/EBITDA on Sep-28E EBITDA (half FY28E, half FY29E), less net debt at the same date.** It is also the cleanest yardstick across the JB deal: EBITDA is not touched by the ~₹1,340 cr a year of brand amortisation the purchase accounting created (₹${n1(ppaPs(1))} a share after its tax credit), and enterprise value is not changed by funding the deal with debt rather than shares. P/E needs an adjustment for both; we show it, on EPS before the JB amortisation, as a cross-check with the DCF.` },
    { exhibit: { type: 'table', title: 'How the street values the stock (notes standing on 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'Thesis'], wide: [6], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method || 'n.d.', s.multiple || '–', s.on || '–', rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**EV/EBITDA**', `**${EVM.base}x (≈ ${n1(impliedFy28)}x FY28E)**`, '**Sep-28E EBITDA**', 'Strong franchise, deal working; price above Torrent\'s own history'] },
    ], source: 'PL and ICICI Direct notes (PDF); MOSL via DSIJ; ICICI Securities and Geojit via Trendlyne. n.d. = not disclosed' } },
    { h: `Our target multiple: ${EVM.base}x, and why` },
    { p: 'We start from Torrent\'s own one-year-forward EV/EBITDA since Apr-2021, computed in our files: before the deal (to 27-Jun-2025), market value on 33.84 cr shares plus the latest published March net debt, over the next full year\'s standalone EBITDA; after the announcement, market value on the 38.04 cr shares the merger created plus the deal debt (Mar-26 net debt ₹12,913 cr incl. leases), over combined forward EBITDA (FY27E, then FY28E). We then apply the pharma sector\'s EV/EBITDA re-rating and round to the nearest half-turn. No growth, returns or own de-rating adjustments enter the base; those are sensitivities below.' },
    { exhibit: { type: 'table', title: 'Deriving the target multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Its own history', `Forward EV/EBITDA since Apr-2021, ${fwdEv.length} points: median **${n1(HEV.med)}x** (25th-75th percentile ${n1(HEV.p25)}-${n1(HEV.p75)}x; range ${n1(HEV.min)}-${n1(HEV.max)}x). Pre-deal median ${n1(HEVpre)}x, post-announcement ${n1(HEVpost)}x. No trough years: forward EBITDA rose every year. On ${ASOF_TXT}: ${n1(evNow)}x our FY28E, ${n1(evNow27)}x FY27E`, `Starting point: ${n1(HEV.med)}x`],
      ['2. Sector re-rating', `Pharma peers' trailing EV/EBITDA on ${ASOF_TXT} vs their five-year medians (table below), excluding Torrent: median **+${SECTOR_EV}%** (set by GAM; our reproduction ${pc1(sectorEvCalc)}, a rounding difference; all 14 peers give the same). The EV/EBITDA analogue of the PLAYBOOK §7c P/E factor (+${SECTOR_DR}%), as hospitals use`, `${n1(HEV.med)}x × ${kev.toFixed(4)} = ${n1(HEV.med * kev)}x → **${EVM.base}x**`],
      ['3. Growth', `EBITDA grows ~${Math.round(ebitdaCagr)}% a year FY26-29E on the pro forma base (synergies, India), vs ~17% a year FY23-26 as reported`, 'No premium (sensitivity below)'],
      ['4. Peers', `Trailing EV/EBITDA on ${ASOF_TXT}: Sun ${n1(P.SUNPHARMA.evEbitda)}x, Abbott ${n1(P.ABBOTINDIA.evEbitda)}x, Ipca ${n1(P.IPCALAB.evEbitda)}x, Cipla ${n1(P.CIPLA.evEbitda)}x, Alkem ${n1(P.ALKEM.evEbitda)}x, Zydus ${n1(P.ZYDUSLIFE.evEbitda)}x, Aurobindo ${n1(P.AUROPHARMA.evEbitda)}x, Divi's ${n1(P.DIVISLAB.evEbitda)}x; Torrent ${n1(P.TORNTPHARM.evEbitda)}x reported (JB for 70 days of EBITDA)`, `${EVM.base}x Sep-28E ≈ ${n1(impliedFy28)}x FY28E: in line with Sun and Abbott`],
      ['5. Returns', 'ROE falls from 27% (FY25) to {{F.roe.0|pct}} in FY27E and recovers to {{F.roe.2|pct}} by FY29E vs an 11.2% cost of capital', 'No premium while returns are reset'],
      ['6. Street basis', `PL 28x and ICICI Direct 27x FY28E EBITDA are ${Math.round((27 / impliedFy28 - 1) * 100)}-${Math.round((28 / impliedFy28 - 1) * 100)}% above our ${n1(impliedFy28)}x FY28E-equivalent: they price in the post-deal re-rating (post-announcement median ${n1(HEVpost)}x)`, 'We are below the EV/EBITDA houses'],
    ], source: `Screener.in prices, balance sheets and EV multiples to ${ASOF_TXT}; GAM estimates; peers' Screener files (asof-peers.js)` } },
    { exhibit: { type: 'table', title: 'Pharma EV/EBITDA factor: trailing EV/EBITDA at the 30-Sep-2026 close vs five-year median', head: ['Company', 'EV/EBITDA (x)', '5-yr median (x)', 'vs median', 'Used?'], rows: [
      ...sortDesc(USED, derateEv).map(s => [shortName(s), n1(P[s].evEbitda), n1(MED5EV[s]), pc1(derateEv[s]), 'Yes']),
      { hl: true, cells: ['**Median of the 8 (excl. Torrent)**', '', '', `**${pc1(sectorEvCalc)}**`, `Set at +${SECTOR_EV}%`] },
      ['Torrent (excluded: own stock; deal-distorted)', n1(P.TORNTPHARM.evEbitda), n1(MED5EV.TORNTPHARM), pc1(derateEv.TORNTPHARM), 'No'],
      ...EXCL.map(s => [shortName(s), n1(P[s].evEbitda), n1(MED5EV[s]), pc1(derateEv[s]), `No: ${D.peers.excluded[s]}`]),
      ['All 14 peers excl. Torrent', '', '', pc1(sectorEvAll), 'Same median'],
    ], source: `Screener.in "EV Multiple" series (five years to ${ASOF_TXT}), scaled to the NSE close (asof-peers.js); peer set and exclusions per PLAYBOOK §7c` } },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA since Apr-2021: our ${EVM.base}x vs a ${n1(HEV.med)}x median`, unit: 'EV ÷ next full-year EBITDA (x); merged basis from the Jun-2025 announcement', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: EVM.base, text: `Our target: ${EVM.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; GAM estimates FY27-29E' },
      { type: 'line', title: `P/E cross-check basis: ${MULT.base}x vs a ${n1(medExc)}x median`, unit: 'Price ÷ next full-year EPS before exceptional items (x); FY26-29E before JB amortisation', x: sExc.map(x => x[0]), series: [{ name: 'Forward P/E', values: sExc.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: medExc, text: `Median: ${n1(medExc)}x` }, { v: MULT.base, text: `Cross-check: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in; GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'From EV to target price (₹ crore unless stated)', head: ['', 'Base', 'Note'], wide: [2], rows: [
      ['Sep-28E EBITDA', n0(ebitdaSep), 'Half FY28E ({{F.ebitda.1|num}}) + half FY29E ({{F.ebitda.2|num}})'],
      ['× target multiple', `${EVM.base}x`, 'Own forward median × EV/EBITDA sector factor'],
      ['= Enterprise value', n0(EVM.base * ebitdaSep), ''],
      ['Less: net debt incl. leases, Sep-28E (model)', n0(-treasSep), `Our own path, with the extra tax on non-deductible amortisation: ₹${n0(ndSepOwn)} cr (−₹${n0((ndSepOwn + treasSep) / SHARES)} a share)`],
      ['= Equity value', n0(EVM.base * ebitdaSep + treasSep), ''],
      { hl: true, cells: ['**÷ 38.04 cr shares = target (rounded)**', '**{{dcf.tp|inr}}**', `vs CMP ₹${n0(price)}: {{dcf.upside|chg}}`] },
    ], source: 'GAM Research (checked in TORNTPHARM.ctx.js)' } },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**EV/EBITDA**', '**Target**', `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr, net debt ₹${n0(-treasSep)} cr`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['P/E', 'Cross-check', `Sep-28E EPS before JB amortisation ₹${n1(adjSep)} (reported ₹${n1(epsSep)})`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('pe').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF, 11.2%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** The P/E cross-check (${MULT.base}x Sep-28E EPS before JB amortisation: Torrent's ${n1(medExc)}x forward median on EPS before exceptional items × ${k.toFixed(4)}) gives ₹${n0(mv('pe').value)}, ${Math.round(mv('pe').vsTarget)}% above the target. The two methods disagree because the merged company turns more of each rupee of EBITDA into adjusted earnings than pre-deal Torrent did (JB's tangible depreciation is low and the deal debt costs 7.7% pre-tax against a ~2% earnings yield), so a historical P/E implies a higher EV/EBITDA (${n1((mv('pe').value * SHARES - treasSep) / ebitdaSep)}x Sep-28E) than Torrent has ever traded at for long. EV/EBITDA is neutral to amortisation and funding and is the street's majority method, so we use it. The DCF (₹${n0(mv('dcf').value)}) is lower still: at 11.2% and 6% terminal growth the cash flows support ~₹3,400. Both the target and the DCF say the ₹${n0(price)} price assumes the post-deal re-rating (${n1(evNow)}x FY28E vs a ${n1(HEV.med)}x median) persists.` },
    { exhibit: { type: 'table', title: 'Sensitivity: other ways to value it (not used in the base)', head: ['Alternative', 'Multiple', 'Applied to', 'Value (₹)', 'vs base'], wide: [0], rows: [
      ['Post-announcement EV/EBITDA median × sector factor', `${half(HEVpost * kev)}x`, `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr`, r10(evVal(half(HEVpost * kev))), vs(evVal(half(HEVpost * kev)))],
      ['Pre-deal EV/EBITDA median × sector factor', `${half(HEVpre * kev)}x`, 'Sep-28E EBITDA', r10(evVal(half(HEVpre * kev))), vs(evVal(half(HEVpre * kev)))],
      ['No sector factor (own median only)', `${half(HEV.med)}x`, 'Sep-28E EBITDA', r10(evVal(half(HEV.med))), vs(evVal(half(HEV.med)))],
      ['Net debt on our own path (extra cash tax on non-deductible amortisation)', `${EVM.base}x`, `Net debt ₹${n0(ndSepOwn)} cr`, r10(evVal(EVM.base, ebitdaSep, ndSepOwn)), vs(evVal(EVM.base, ebitdaSep, ndSepOwn))],
      ['Street EV/EBITDA: PL 28x / ICICI Direct 27x on our FY28E EBITDA', '28x / 27x', `FY28E ₹${n0(F.ebitda[1])} cr`, `${r10(streetEvAt(28, F.ebitda[1]))} / ${r10(streetEvAt(27, F.ebitda[1]))}`, vs(streetEvAt(28, F.ebitda[1]))],
      ['P/E: house forwardMedian on reported EPS, applied to reported EPS (ignores the basis change)', `${repMultSens}x`, `Reported ₹${n1(epsSep)}`, n0(peV(repMultSens, epsSep)), vs(peV(repMultSens, epsSep))],
      ['P/E: house forwardMedian (reported history) on EPS before JB amortisation', `${multAdjRep}x`, `Adjusted ₹${n1(adjSep)}`, n0(peV(multAdjRep, adjSep)), vs(peV(multAdjRep, adjSep))],
      ['P/E: MOSL\'s 50x on our Sep-28E reported EPS', '50x', `Reported ₹${n1(epsSep)}`, n0(moslAtOurs), vs(moslAtOurs)],
    ], source: 'GAM Research. Own de-rating is not shown: Torrent\'s trailing multiples are distorted by the deal (P/E +43%, EV/EBITDA vs five-year median in the table above).' } },
    { exhibit: { type: 'table', title: 'P/E cross-check: pharma P/E factor (PLAYBOOK §7c) and Torrent\'s P/E history', head: ['Item', 'Value', 'Note'], wide: [2], rows: [
      ['Pharma P/E factor (8 peers excl. Torrent)', `+${SECTOR_DR}% (reproduced ${pc1(sectorDrCalc)})`, USED.map(s => `${shortName(s)} ${pc1(derate[s])}`).join(', ')],
      ['Forward P/E median, EPS before exceptional items and JB amortisation', `${n1(medExc)}x (p25-p75 ${n1(EXC_P25)}-${n1(EXC_P75)}x)`, `Exceptional items after tax: FY23 +₹${EXC_AT[2023]} cr, FY24 +₹${EXC_AT[2024]} cr, FY25 −₹${-EXC_AT[2025]} cr, FY26 −₹${-EXC_AT[2026]} cr`],
      ['Same on reported forecast EPS (house forwardMedian)', `${n1(FM.median)}x`, `Post-deal points ${n1(medPostRep)}x vs ${n1(medPostAdj)}x adjusted: two bases mixed`],
      ['Pre-deal window (Apr-2021 to Mar-2025)', `${n1(medPre)}x`, 'Actual EPS only'],
      { hl: true, cells: ['**Cross-check multiple**', `**${MULT.base}x adjusted (= ${ENGINE.base.toFixed(2)}x reported)**`, `${n1(medExc)}x × ${k.toFixed(4)} = ${n1(medExc * k)}x; value ₹${n0(tpAdj.base)}`] },
    ], source: 'Screener.in; GAM Research' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +2pp a year, margin +1pp; ${EVM.bull}x (75th percentile × sector factor).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}} like-for-like; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${EVM.base}x Sep-28E EBITDA.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −3pp a year, margin −1.5pp; ${EVM.bear}x (25th percentile × sector factor).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27 (engine)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Tax shield only on tax-deductible D&A (5% of revenue); the JB brand amortisation saves no tax.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed pharma peers (trailing, at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'vs 5-yr median', 'P/E (x)', 'vs 5-yr median', 'ROE'], rows: PEERS.filter(p => [...USED, 'TORNTPHARM'].includes(p.symbol)).map(p => [p.symbol === 'TORNTPHARM' ? '**Torrent (reported, pre-merger shares)**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.evEbitda), pc1(derateEv[p.symbol]), n1(p.pe), pc1(derate[p.symbol]), p.roe + '%']), source: `Screener.in, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js). Torrent's row is Screener's reported basis (FY26 with JB for 70 days; 33.84 cr shares).` } },
  ],
};

module.exports = { valuation };
