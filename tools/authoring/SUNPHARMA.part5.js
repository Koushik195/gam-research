// Sun Pharma report, part 5: our forecasts vs the street, the street view, and the valuation (P/E on standalone Sep-28E EPS
// plus the Organon deal at cost, carried as an implied P/E; EV/EBITDA and DCF cross-checks; scenarios; DCF detail; peers).
const X = require('./SUNPHARMA.ctx');
const { D, F, V, A, AS, SC, n0, n1, pc, rup, price, mv, FM, ADJ, HOUSE, adjByFy, MULT, houseMult, ORG, epsSep, k, SET_FACTOR, derate, P, PEERS, MED5, USED, EXCL, ALL15, sectorDr, sectorDrAll, ownDr, shortName,
  evMed, evP25, evP75, evMULT, ttmEbitda, ebitdaSep28, rating, ST, postQ1, medTp, avgTp, CONS, shortDate, ASOF_TXT, fwdNow, fwdNowSep, buyBelow, sellAbove, ruleText, cashUsedPs, cashIncPs, synergyPs, shortfallPs, half } = X;
const r10 = v => Math.round(v / 10) * 10;
const PL = D.street.plEstimates, EM = D.street.emkayMay;
const gap = (a, c) => `${pc((a / c - 1) * 100)}`;
const O = ORG.base;

const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs street', kicker: 'Our forecasts', title: `Our standalone EPS is ~8-11% below the street: higher tax, no forex gains, slower US`,
  blocks: [
    { p: `Our forecasts are for **standalone Sun** (no Organon). Revenue grows ${n1(F.salesGrowth[0])}% / ${n1(F.salesGrowth[1])}% / ${n1(F.salesGrowth[2])}% in FY27-29E, EBITDA margin before forex is ${n1(F.ebitdaMargin[0])}% / ${n1(F.ebitdaMargin[1])}% / ${n1(F.ebitdaMargin[2])}%, and EPS ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])}: ~${Math.round(X.epsCagrFwd)}% a year from FY26's reported ₹47.8 (or ~8% from the adjusted ₹51.7, which included ₹1,240 cr of forex gains). The street's standalone estimates are higher: Prabhudas Lilladher ₹${PL.eps.FY27E} / ₹${PL.eps.FY28E}, Emkay ₹${EM.eps.FY27E} / ₹${EM.eps.FY28E} (May; cut ~5% in August), Geojit implies ~₹69 for FY28E.` },
    { exhibit: { type: 'table', title: 'GAM vs the street (standalone Sun, ₹ crore unless stated)', head: ['', 'GAM FY27E', 'PL FY27E', 'Emkay FY27E', 'GAM FY28E', 'PL FY28E', 'Emkay FY28E', 'GAM FY29E', 'Emkay FY29E'], rows: [
      ['Revenue', n0(F.sales[0]), n0(PL.revenue.FY27E), n0(EM.revenue.FY27E), n0(F.sales[1]), n0(PL.revenue.FY28E), n0(EM.revenue.FY28E), n0(F.sales[2]), n0(EM.revenue.FY29E)],
      ['EBITDA', n0(F.ebitda[0]), n0(PL.ebitda.FY27E), '–', n0(F.ebitda[1]), n0(PL.ebitda.FY28E), '–', n0(F.ebitda[2]), '–'],
      ['EBITDA margin (before forex)', `${n1(F.ebitdaMargin[0])}%`, `${n1(PL.ebitda.FY27E / PL.revenue.FY27E * 100)}%`, `${EM.ebitdaMarginPct.FY27E}% (incl. forex)`, `${n1(F.ebitdaMargin[1])}%`, `${n1(PL.ebitda.FY28E / PL.revenue.FY28E * 100)}%`, `${EM.ebitdaMarginPct.FY28E}% (incl. forex)`, `${n1(F.ebitdaMargin[2])}%`, '–'],
      ['Tax rate', `${AS.taxRate[0]}%`, `${PL.taxPct}%`, `${EM.taxPct}%`, `${AS.taxRate[1]}%`, `${PL.taxPct}%`, `${EM.taxPct}%`, `${AS.taxRate[2]}%`, `${EM.taxPct}%`],
      { hl: true, cells: ['**EPS (₹)**', `**${n1(F.eps[0])}**`, `**${PL.eps.FY27E}**`, `**${EM.eps.FY27E}**`, `**${n1(F.eps[1])}**`, `**${PL.eps.FY28E}**`, `**${EM.eps.FY28E}**`, `**${n1(F.eps[2])}**`, `**${EM.eps.FY29E}**`] },
      ['GAM vs broker', '', gap(F.eps[0], PL.eps.FY27E), gap(F.eps[0], EM.eps.FY27E), '', gap(F.eps[1], PL.eps.FY28E), gap(F.eps[1], EM.eps.FY28E), '', gap(F.eps[2], EM.eps.FY29E)],
    ], source: 'GAM estimates; Prabhudas Lilladher Q1FY27 note (3-Aug-2026); Emkay Q4FY26 note (24-May-2026; Emkay cut estimates ~5% on 4-Aug-2026 without publishing the new figures here)' } },
    { exhibit: { type: 'table', title: 'Why we are below the street', head: ['Driver', 'GAM', 'Street', 'Effect on FY28E EPS'], wide: [1, 2], rows: [
      ['Tax rate', `${AS.taxRate[1]}% (CFO: Q1 range until Organon closes; India benefits exhausted)`, 'Emkay 24.5% (pre-Q1); PL 28%', '~−4% vs a 24.5% rate'],
      ['Forex gains', 'Only Q1FY27\'s ₹122 cr; none after', 'Company "EBITDA" and some estimates include them (₹1,240 cr in FY26)', '~−3% to −6% if FY26-like gains recur'],
      ['US dollar growth', '−4% in FY27E, +6% after', 'Higher specialty ramp in some notes', '~−1% to −2%'],
      ['EBITDA margin', `${n1(F.ebitdaMargin[1])}% before forex`, `PL ${n1(PL.ebitda.FY28E / PL.revenue.FY28E * 100)}%`, '~−3%'],
    ], source: 'GAM Research' } },
    { pair: [
      { type: 'column', title: 'Revenue: +8-10% a year (standalone)', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates' },
      { type: 'line', title: 'ROE: ~14-15% standalone as cash piles up', unit: 'Return on equity (%)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: 'Screener.in; GAM estimates' },
    ] },
    { callout: `**What would make us wrong:** a faster ramp of Leqselvi and Unloxcyt (each $100 mn of extra specialty sales adds ~₹1-2 to EPS), FDA clearance of Halol or Baska, or the tax rate settling near 25% (+₹1.6 on FY28E). Organon is the big swing: on the street's numbers it adds 30-40% to FY28E EPS, but with debt and a lower-quality earnings stream.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: mostly Buy, targets ₹2,070-2,310, split on how to treat Organon`,
  blocks: [
    { p: `Five houses published after the Q1FY27 results (2-Aug to 21-Sep-2026): Motilal Oswal Buy ₹2,310, Prabhudas Lilladher Buy ₹2,150, Emkay Add ₹2,100, ICICI Securities Hold ₹2,090 and Geojit Buy ₹2,070: median ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} above the ${ASOF_TXT} close of ₹${n0(price)}. Notes from the Organon announcement still standing include Nirmal Bang ₹2,320, HDFC Securities ₹2,030 and Nuvama ₹2,000 (all Buy, 28-Apr-2026). ${rup(D.street.methodSummary)} The bulls point to India, specialty and accretion; the cautious notes to US weakness, Organon's quality and leverage, and the tax rate.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes and call transcripts to 30-Sep-2026' } },
  ],
};

const ourAt = s => { if (s.method !== 'P/E') return '–'; const m = String(s.multiple).match(/^(\d+(?:\.\d+)?)x/); if (!m) return '–'; return /combined/i.test(s.on) ? 'n.m. (combined EPS)' : n0(r10(+m[1] * (/12-month/.test(s.on) ? epsSep.base : F.eps[1]))); };
const drRow = s => [shortName(s), n1(P[s].pe), n1(MED5[s]), pc(derate[s])];
const sensRows = [
  ['House median on reported EPS (incl. exceptional charges)', `${n1(HOUSE.med)}x × ${k.toFixed(4)} = ${houseMult}x`, n0(r10(houseMult * epsSep.base + O.adj))],
  ['No sector factor (own adjusted median only)', `${half(ADJ.med)}x`, n0(r10(half(ADJ.med) * epsSep.base + O.adj))],
  ['Last two years of history only (FY26-28 forward years)', `~${n1(adjByFy.FY27)}x (FY27 forward-year median)`, n0(r10(half(adjByFy.FY27) * epsSep.base + O.adj))],
  ['Street median 12-month multiple (Motilal 38x, Geojit 30x)', '34x on our EPS', n0(r10(34 * epsSep.base + O.adj))],
  ['Ignore the cash adjustment (Organon fully neutral)', `${MULT.base}x, no adjustment`, n0(r10(MULT.base * epsSep.base))],
  ['Organon synergies in the base', `+₹${n1(synergyPs)} a share`, n0(r10(MULT.base * epsSep.base + O.adj + synergyPs))],
  ['Growth premium (PEG-style)', `EPS growth ~${Math.round(X.epsCagrFwd)}% FY26-29E vs ~13% FY23-26 (adjusted): no premium`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x standalone Sep-28E EPS plus Organon at cost gives {{dcf.tp|inr}}; the stock is fairly priced`,
  blocks: [
    { h: 'How the street values Sun' },
    { p: 'The street values Sun on P/E: Motilal Oswal 38x 12-month-forward EPS, Geojit 30x FY28E, Prabhudas Lilladher 25x FY28E combined-entity EPS, Nuvama on P/E; ICICI Securities (EV/EBITDA) and Emkay use a sum of the parts that includes Organon. We use the same method on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each P/E multiple to our standalone EPS of the same period.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method, rup(s.multiple), s.on, ourAt(s), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E + Organon at cost**', `**${MULT.base}x standalone (${n1(O.implied)}x implied)**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Best Indian pharma franchise; fair price; Organon adds risk, not yet value'] },
    ], source: 'ICICI Direct and PL notes (PDFs); Motilal Oswal, Emkay and Geojit via Investment Guru India; Nirmal Bang, HDFC Securities and Nuvama via Business Today (28-Apr-2026); n.d. = not disclosed' } },
    { h: `Our multiple: ${MULT.base}x standalone, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Sun\'s own history (house rule)', `One-year-forward P/E since Apr-2021 on reported EPS (forwardMedian): median ${n1(HOUSE.med)}x, 25th-75th percentile ${n1(HOUSE.p25)}-${n1(HOUSE.p75)}x; no trough years`, `${n1(HOUSE.med)}x (sensitivity)`],
      ['2. One-offs (PLAYBOOK §4)', `Reported EPS carries an exceptional charge every year (₹0.6-4.0 a share in FY23-26, after tax and tax one-offs). On the company's adjusted EPS (FY23-26: 36.0 / 42.0 / 49.9 / 51.7) the same median is ${n1(ADJ.med)}x (${n1(ADJ.p25)}-${n1(ADJ.p75)}x). We use this one: our forecasts and the street's multiples are on EPS before exceptional items, so it is like-for-like`, `**Starting point: ${n1(ADJ.med)}x**`],
      ['3. Sector factor', `Pharma peers' trailing P/E on ${ASOF_TXT} vs their five-year medians (table below): median ${pc(sectorDr)} (settled factor +${SET_FACTOR}%). Pharma trades above its history, so the factor is a re-rating. Sun itself is ${pc(ownDr)} vs its own five-year median (not used)`, `× ${k.toFixed(4)}`],
      ['4. Result (nearest half-turn)', `${n1(ADJ.med)}x × ${k.toFixed(4)} = ${n1(ADJ.med * k)}x`, `**${MULT.base}x standalone**`],
      ['5. Organon (pending)', `Valued at cost; base adjustment −₹${n1(Math.abs(O.adj))} a share (cash leaves at face value, ₹${n0(cashUsedPs)}, while the P/E valued its interest at ₹${n0(MULT.base * cashIncPs)})`, `**Implied ${n1(O.implied)}x on standalone Sep-28E EPS**`],
      ['6. Growth, returns', `EPS growth ~${Math.round(X.epsCagrFwd)}% a year FY26-29E (standalone) vs ~13% FY23-26 adjusted; ROE ~14-15% vs ~11% cost of equity: neither argues for a premium; shown as sensitivity rows only (§7c)`, 'No adjustment'],
      ['7. Bull / bear', `Bull: 75th percentile ${n1(ADJ.p75)}x × factor = ${MULT.bull}x, plus synergies; bear: 25th percentile ${n1(ADJ.p25)}x × factor = ${MULT.bear}x, less an Organon EBITDA shortfall`, `${n1(ORG.bull.implied)}x / ${n1(ORG.bear.implied)}x implied`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; company adjusted EPS (investor presentations); GAM estimates for FY27-28E EPS in the forward series` } },
    { exhibit: { type: 'table', title: `Pharma sector factor: trailing P/E on ${ASOF_TXT} vs five-year median (Sep-2021 to Sep-2026)`, head: ['Company', 'P/E at 30-Sep-26 (x)', 'Five-year median (x)', 'vs median'], rows: [
      ...USED.map(drRow),
      { hl: true, cells: ['**Median of the eight (factor)**', '', '', `**${pc(sectorDr)}**`] },
      ...EXCL.map(s => { const r = drRow(s); r[0] = `${r[0]} (excluded)`; return r; }),
      ['Median of all 14 non-Sun names', '', '', pc(sectorDrAll)],
      ['Sun Pharma (not used)', n1(P.SUNPHARMA.pe), n1(MED5.SUNPHARMA), pc(ownDr)],
    ], source: 'Screener.in P/E series and NSE closes on 30-Sep-2026 (asof-peers.js); exclusions per PLAYBOOK §7c: Lupin and Glenmark (loss years), Biocon and Laurus (boom-bust EPS, P/E >100x), Dr Reddy\'s (gRevlimid windfall then cliff), Mankind (listed May-2023)' } },
    { pair: [
      { type: 'line', title: `Forward P/E since 2021: reported vs adjusted EPS`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Reported EPS', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }, { name: 'Adjusted EPS', values: X.fwdAdj.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our standalone multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; reported and company-adjusted EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E + Organon (target)', 'EV/EBITDA (standalone)', 'DCF (standalone)', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E + Organon (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E (standalone) + Organon at cost**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}; Organon −₹${n1(Math.abs(O.adj))}`, `${MULT.base}x (= ${n1(O.implied)}x implied; bull ${n1(ORG.bull.implied)}x, bear ${n1(ORG.bear.implied)}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr + net cash`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', `FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g ${AS.dcf.terminalGrowth}%`, '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research. Cross-checks are standalone; the Organon base adjustment (−₹' + n1(Math.abs(O.adj)) + ' a share) would apply to them too.' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA plus net cash) gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is Sun's ${n1(evMed)}x median trailing EV/EBITDA since 2021 × the +${SET_FACTOR}% factor, restated from trailing to Sep-28E EBITDA (₹${n0(ebitdaSep28)} cr vs ₹${n0(ttmEbitda)} cr in the year to Jun-26 on Screener's basis, which includes forex). It sits ${pc(mv('ev').vsTarget)} above the target because it values the growing cash pile at face value rather than through EPS. The DCF gives only ₹${n0(mv('dcf').value)} at an ${n1(V.ke)}% cost of equity and ${AS.dcf.terminalGrowth}% terminal growth: Sun's heavy working capital (~27% of sales) absorbs a third of each year's operating cash, so free cash flow is well below profit. The market price (₹${n0(price)}) needs either more growth or a lower discount rate than our DCF assumes; the P/E on history says the price is fair.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sensRows, source: 'GAM Research' } },
    { h: 'Scenarios' },
    { exhibit: { type: 'table', title: 'Bull, base and bear', head: ['', 'Bear', 'Base', 'Bull'], rows: [
      ['Revenue growth vs base (pp a year)', `${AS.scenarios.bear.revenueGrowthDelta}`, '0', `+${AS.scenarios.bull.revenueGrowthDelta}`],
      ['EBITDA margin vs base (pp)', `${AS.scenarios.bear.marginDelta}`, '0', `+${AS.scenarios.bull.marginDelta}`],
      ['FY28E EPS (₹)', n1(SC.bear.eps[1]), n1(F.eps[1]), n1(SC.bull.eps[1])],
      ['Sep-28E EPS (₹)', n1(epsSep.bear), n1(epsSep.base), n1(epsSep.bull)],
      ['Standalone multiple', `${MULT.bear}x`, `${MULT.base}x`, `${MULT.bull}x`],
      ['Organon part (₹ a share)', n1(ORG.bear.adj), n1(ORG.base.adj), `+${n1(ORG.bull.adj)}`],
      { hl: true, cells: ['**Target (₹)**', '**{{scen.bear.tp|inr}}**', '**{{dcf.tp|inr}}**', '**{{scen.bull.tp|inr}}**'] },
      ['Upside', '{{scen.bear.upside|chg}}', '{{dcf.upside|chg}}', '{{scen.bull.upside|chg}}'],
      ['What has to happen', rup(AS.scenarios.bear.narrative), 'Our forecasts; Organon closes in Q4FY27 at cost', rup(AS.scenarios.bull.narrative)],
    ], source: 'GAM Research' } },
    { h: 'DCF detail' },
    { pair: [
      { type: 'table', title: 'DCF summary (standalone, ₹ crore)', head: ['', 'Value'], rows: [
        ['Cost of equity (rf 6.5% + 0.8 × 6%)', `${n1(V.ke)}%`], ['Terminal growth', `${AS.dcf.terminalGrowth}%`], ['PV of FCFF, FY28-42E', n0(V.pvExplicit)], ['PV of terminal value', `${n0(V.pvTv)} (${Math.round(V.tvShare)}% of EV)`],
        ['Net cash at Mar-27E', n0(V.netCash)], ['Equity value per share (Mar-27)', n0(V.perShare)], ['Rolled to Sep-27 (12-month value)', n0(mv('dcf').value)],
      ], source: 'GAM Research (engine DCF)' },
      { type: 'table', title: 'DCF value per share: cost of equity vs terminal growth', head: ['Ke \\ g', ...V.sens.gs.map(g => `${n1(g)}%`)], rows: V.sens.waccs.map((w, i) => [`${n1(w)}%`, ...V.sens.grid[i].map(n0)]), source: 'GAM Research' },
    ] },
    { h: 'Peers on 30-Sep-2026' },
    { exhibit: { type: 'table', title: 'Indian pharma peers at the 30-Sep-2026 close', head: ['Company', 'Price (₹)', 'Market cap (₹ cr)', 'Trailing P/E (x)', 'EV/EBITDA (x)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'ROE'], rows: PEERS.filter(p => !p.missing).map(p => [p.symbol === 'SUNPHARMA' ? '**Sun Pharma**' : shortName(p.symbol), n0(p.price), n0(p.mcapCr), n1(p.pe), n1(p.evEbitda), n0(p.revenue), `${n1(p.ebitdaMargin)}%`, `${n1(p.roe)}%`]), source: 'Screener.in via asof-peers.js (NSE closes on 30-Sep-2026; FY26 financials)' } },
    { callout: `**Rating: ${rating}.** ${ruleText} At ₹${n0(price)} the upside to {{dcf.tp|inr}} is {{dcf.upside|chg}}. We would turn buyers below ~₹${n0(buyBelow)} and sellers above ~₹${n0(sellAbove)}, on unchanged estimates.` },
  ],
};

module.exports = { forecasts, street, valuation };
