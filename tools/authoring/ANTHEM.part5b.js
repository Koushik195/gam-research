// Anthem Biosciences report, part 5b: valuation. P/E primary (the street's majority method) with the multiple from Anthem's
// own forward P/E since 1-Oct-2025 x the same-window pharma factor (+17.2%); EV/EBITDA and DCF cross-checks; CRDMO peers.
const X = require('./ANTHEM.ctx');
const { D, F, V, SC, AS, n0, n1, pc, pc1, ASOF_TXT, price, mv, MULT, epsU, sep, epsSep28, HB, HALL, HB_h1, HB_h2, FM, sPe, PEER_SET, CDMO, P, MEDW, MED5, MEDWEV, drW, dr5, drWev, sectorCalc, sectorEvCalc, sector5, SECTOR, SECTOR_EV, k, kev, shortName, EVH, EVM, EVM_PEF, evNowFwd, ebitdaSep, treasSep, fwdNow, peFY27, peSep, trailPe, SENS, gNeeded, dcfAt20, dcfAt25, epsCagr, salesCagr, ebitdaCagr, SHARES, implPeAtPrice, rating, epsRep, PEERS } = X;
const vs = v => pc(v / V.tp * 100 - 100);
const sortDesc = (arr, by) => [...arr].sort((a, c) => by[c] - by[a]);
const evVal = m => Math.round((m * ebitdaSep + treasSep) / SHARES / 10) * 10;

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the DCF says the price already assumes ~${Math.round(gNeeded)}% growth for 15 years`,
  blocks: [
    { h: 'How the street values Anthem' },
    { p: `Of the brokers that disclose a method, four value Anthem on **P/E** (Jefferies 65x Sep-28E, BOBCAPS 57x Jun-28E, PL 55x FY28E, Nomura 50x Dec-27E) and two on **EV/EBITDA** (HDFC Securities 35x Q3FY28E, JM Financial 40x Sep-27E). We follow the majority: **P/E on Sep-28E EPS (half FY28E, half FY29E)**, the earnings a buyer will look at one year from now. Anthem has no minorities, no acquisition amortisation and no exceptional items in our forecasts, so reported EPS needs no adjustment. EV/EBITDA and a DCF are cross-checks.` },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { p: `Anthem listed on 21-Jul-2025, so it has 14 months of history, not five years. Following the batch rule (PLAYBOOK §7c), we use its own one-year-forward P/E **since 1-Oct-2025**, skipping the first months after listing, on every weekly close plus the ${ASOF_TXT} close (${HB.n} points): price ÷ the next full fiscal year's EPS, which is our FY27E (₹${n1(epsU[0])}) for dates to Mar-2026 and our FY28E (₹${n1(epsU[1])}) after. These forecasts carry no exceptional items, so the median before exceptional items and on reported EPS is the same. We multiply the median by the nine pharma peers' move over the **same window** (+${SECTOR}%) and round to the nearest half-turn. Anthem's own move, growth and returns do not enter the base; they are sensitivities below.` },
    { exhibit: { type: 'table', title: 'Deriving the target multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Its own history', `Forward P/E since 1-Oct-2025: median **${n1(HB.med)}x** (25th-75th percentile ${n1(HB.p25)}-${n1(HB.p75)}x; range ${n1(HB.min)}-${n1(HB.max)}x). Oct-25 to Mar-26 ${n1(HB_h1.med)}x, Apr-26 to Sep-26 ${n1(HB_h2.med)}x; from listing ${n1(HALL.med)}x. No trough years (EPS has risen every year since FY24). House forwardMedian (every 5th week): ${n1(FM.median)}x`, `Starting point: ${n1(HB.med)}x`],
      ['2. Sector move, same window', `Nine pharma peers' trailing P/E at the ${ASOF_TXT} close vs each one's median since 1-Oct-2025 (table below): median **+${SECTOR}%** (PLAYBOOK §7c; our reproduction ${pc1(sectorCalc)}). The five-year version is ${pc1(sector5)}`, `${n1(HB.med)}x × ${k.toFixed(3)} = ${n1(HB.med * k)}x → **${MULT.base}x**`],
      ['3. Growth', `EPS ~${Math.round(epsCagr)}% a year FY26-29E (revenue ~${Math.round(salesCagr)}%, EBITDA ~${Math.round(ebitdaCagr)}%); street EPS growth 15-20%`, `No premium or discount (a PEG view gives far less; sensitivity below)`],
      ['4. Peers', `Trailing P/E on ${ASOF_TXT}: Divi's ${n1(P.DIVISLAB.pe)}x, Laurus ${n1(P.LAURUSLABS.pe)}x, Sai Life ${n1(P.SAILIFE.pe)}x, Neuland ${n1(P.NEULANDLAB.pe)}x, Syngene ${n1(P.SYNGENE.pe)}x; Anthem ${n1(P.ANTHEM.pe)}x`, `${MULT.base}x Sep-28E ≈ ${n1(MULT.base * epsSep28 / X.trailEps)}x trailing EPS today: the top of the listed CRDMO band (Syngene ${n1(P.SYNGENE.pe)}x to Laurus ${n1(P.LAURUSLABS.pe)}x)`],
      ['5. Returns', 'ROE 21.7% in FY26, {{F.roe.0|pct}} / {{F.roe.2|pct}} in FY27E / FY29E vs a 12.5% cost of equity; core returns far higher ex cash', 'No premium: returns are good but diluted by cash and Unit IV'],
      ['6. Street basis', 'Jefferies 65x Sep-28E (the same multiple and year); BOBCAPS 57x Jun-28E; PL 55x FY28E; Nomura 50x Dec-27E', 'We sit with Jefferies, above the domestic brokers'],
    ], source: `Screener.in weekly prices to ${ASOF_TXT}; GAM estimates; peers' Screener files (asof-peers.js)` } },
    { exhibit: { type: 'table', title: `Pharma sector factor over Anthem's window: trailing P/E at the ${ASOF_TXT} close vs median since 1-Oct-2025`, head: ['Company', 'P/E (x)', 'Median since Oct-25 (x)', 'vs median', 'EV/EBITDA vs median since Oct-25', '5-yr P/E median (x)', 'vs 5-yr'], rows: [
      ...sortDesc(PEER_SET, drW).map(s => [shortName(s), n1(P[s].pe), n1(MEDW[s]), pc1(drW[s]), pc1(drWev[s]), n1(MED5[s]), pc1(dr5[s])]),
      { hl: true, cells: [`**Median of the nine (set at +${SECTOR}% / +${SECTOR_EV}%)**`, '', '', `**${pc1(sectorCalc)}**`, `**${pc1(sectorEvCalc)}**`, '', pc1(sector5)] },
      ['Anthem (not in the set: own stock, listed Jul-2025)', n1(P.ANTHEM.pe), n1(MEDW.ANTHEM), pc1(drW.ANTHEM), pc1(drWev.ANTHEM), '–', '–'],
      ...Object.entries(D.peers.excluded).map(([s, why]) => [shortName(s), '', '', '', '', '', `Excluded: ${why}`]),
    ], source: `Screener.in "Price to Earning" and "EV Multiple" series to ${ASOF_TXT}, scaled to the NSE close (asof-peers.js); peer set per PLAYBOOK §7c. The batch figures (+17.2% / +6.7%) match our reproduction.` } },
    { pair: [
      { type: 'line', title: `Forward P/E since Oct-2025: our ${MULT.base}x vs a ${n1(HB.med)}x median`, unit: 'Price ÷ next full-year EPS (x)', x: sPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: sPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 40, max: 75, lines: [{ v: HB.med, text: `Median: ${n1(HB.med)}x` }, { v: MULT.base, text: `Our target: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Share price today'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'From multiple to target', head: ['', 'Base', 'Note'], wide: [2], rows: [
      ['Sep-28E EPS (₹)', n1(epsSep28), `Half FY28E (₹${n1(epsU[1])}) + half FY29E (₹${n1(epsU[2])})`],
      ['× target multiple', `${MULT.base}x`, `Own median ${n1(HB.med)}x × ${k.toFixed(3)}`],
      ['= Value per share (₹)', n0(mv('pe').value), ''],
      { hl: true, cells: ['**12-month target (rounded)**', '**{{dcf.tp|inr}}**', `vs CMP ₹${n0(price)}: {{dcf.upside|chg}} → ${rating}`] },
    ], source: 'GAM Research (checked in ANTHEM.ctx.js)' } },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep28)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr + net cash ₹${n0(treasSep)} cr`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF, 12.5%, g 6%, 15 years', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA: Anthem's forward EV/EBITDA since Oct-2025 (EV at each weekly close less the last reported net cash, over our next-year EBITDA) has a median of ${n1(EVH.med)}x; times the peers' EV/EBITDA move over the same window (${pc1(SECTOR_EV)}) that is ${EVM.base}x, worth ₹${n0(mv('ev').value)}, ${Math.abs(Math.round(mv('ev').vsTarget))}% ${mv('ev').vsTarget < 0 ? 'below' : 'above'} the target: the two market methods broadly agree (the gap is the smaller EV/EBITDA factor). The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below. At a 12.5% cost of capital the price of ₹${n0(price)} needs revenue growth of ~${Math.round(gNeeded)}% a year from FY28 to FY41 with margins near 40% (at 20% a year the DCF gives ~₹${n0(Math.round(dcfAt20 / 10) * 10)}). Like the rest of Indian CRDMO, Anthem is priced on the multiple, not on cash flows we can see.` },
    { exhibit: { type: 'table', title: 'Sensitivity: other ways to value it (not used in the base)', head: ['Alternative', 'Multiple', 'Basis', 'Value (₹)', 'vs base'], wide: [0], rows: [
      ...SENS.slice(1).map(r => [r.name, `${r.mult}x`, r.why, n0(r.tp), vs(r.tp)]),
      ['EV/EBITDA with the P/E factor (+17.2%)', `${EVM_PEF}x`, `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr`, n0(evVal(EVM_PEF)), vs(evVal(EVM_PEF))],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +5pp a year, margin +2pp; ${MULT.bull}x (75th percentile × sector factor) on Sep-28E EPS of ₹${n1(sep(SC.bull.eps))}.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS of ₹${n1(epsSep28)}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −7pp a year, margin −3pp; ${MULT.bear}x (25th percentile × sector factor) on ₹${n1(sep(SC.bear.eps))}. In a real FY23-style setback the multiple would also fall: at Anthem's lowest forward P/E since Oct-2025 (${n1(HB.min)}x) the bear EPS is worth ~₹${n0(Math.round(HB.min * sep(SC.bear.eps) / 10) * 10)}.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Plus: net cash at Mar-27 (engine)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. 12.5% = cost of equity (beta 1.0); no debt, so WACC is the same. Growth fades from FY29E to 8% by FY42E, margin to 38%, capex to 8% of sales.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: `Listed CRDMO peers (context only; trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs median since Oct-25', 'EV/EBITDA (x)', 'vs median since Oct-25', 'ROE'], rows: PEERS.filter(p => [...CDMO, 'ANTHEM'].includes(p.symbol)).sort((a, c) => c.mcapCr - a.mcapCr).map(p => [p.symbol === 'ANTHEM' ? '**Anthem**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc1(drW[p.symbol]), n1(p.evEbitda), pc1(drWev[p.symbol]), p.roe + '%']), source: `Screener.in, multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers.js). Piramal Pharma's P/E reflects depressed profit. These names are context; the factor uses the nine-peer pharma set (PLAYBOOK §7c).` } },
    { callout: `**Where Anthem sits:** at ${n1(trailPe)}x trailing EPS (Screener: ${n1(P.ANTHEM.pe)}x) and ${n1(fwdNow)}x our FY28E, Anthem is priced like Divi's and Sai Life, below Laurus, with the best margin and ROE of the group but the smallest revenue and the most concentrated customer list. Its own P/E is ${pc1(drW.ANTHEM)} above its median since Oct-2025, less than the pharma set's +${SECTOR}%; that gap is the upside in our target.` },
  ],
};

module.exports = { valuation };
