// Wockhardt report, part 5c: valuation detail. Peer factor table (same window), sensitivity rows (never in the base),
// amortisation sensitivity, Zaynich risked NPV and what the price implies, scenarios, DCF detail and listed peers.
const X = require('./WOCKPHARMA.ctx'), Y = require('./WOCKPHARMA.ctx2');
const { F, V, AS, SC, n0, n1, pc, pc1, ASOF_TXT, price, peMult, epsSep28, OWN, HEV, FAC, PEW, EVW, PEERS, P, PEER_SET, EXCL, shortName, SENS, val, S21, FM, ALTW, win, evWin, evMult, k } = X;
const vs = t => pc((t / price - 1) * 100);
const SR = X.C.successRates;

const factorTable = { exhibit: { type: 'table', title: 'The peer factor, peer by peer: trailing multiple at the 30-Sep-2026 close vs its own median since 1-Oct-2025', head: ['Company', 'P/E now (x)', 'P/E median (x)', 'P/E move', 'EV/EBITDA now (x)', 'EV/EBITDA median (x)', 'EV/EBITDA move'], rows: [
  ...PEW.map((r, i) => [shortName(r.s), n1(r.cur), n1(r.med), pc1(r.move), n1(EVW[i].cur), n1(EVW[i].med), pc1(EVW[i].move)]),
  { hl: true, cells: ['**Median of the nine**', '', '', `**${pc1(X.facPe)}**`, '', '', `**${pc1(X.facEv)}**`] },
], source: `Screener.in weekly multiples, current scaled to the NSE close (asof-peers); tools/authoring/sector-factor.js --from 2025-10-01 reproduces +${FAC.pe}% (P/E) and +${FAC.ev}% (EV/EBITDA). Excluded as distorted (PLAYBOOK §7c): ${EXCL.map(shortName).join(', ')}` } };

const sens = (label, m, basis, why, eps = epsSep28) => [label, `${m}x${basis ? ` (${basis})` : ''}`, n0(val(m, eps)), vs(val(m, eps)), why];
const sensTable = { exhibit: { type: 'table', title: 'Sensitivity of the target (none of these is in the base case)', head: ['View', 'Multiple', 'Target (₹)', 'vs CMP', 'Why we do not use it in the base'], wide: [4], rows: [
  sens('Since-2021 median, EPS before exceptional items, × five-year factor (+8.2%)', SENS.since21, `${n1(S21.med)}x`, 'Mixes the transition year (FY26-forward dates) with the new regime; turnaround rule'),
  sens('Since-2021 house median on reported EPS × five-year factor', SENS.since21rep, `${n1(FM.median)}x`, 'Reported FY26 EPS carries ₹85 cr of exceptional charges (A18 sensitivity row)'),
  sens('Window from 1-Apr-2025 × peers over the same window (+17.3%)', SENS.alt, `${n1(ALTW.med)}x`, 'Includes the Apr-Jun 2025 loss quarter, before the break'),
  sens('Own window with no sector factor', SENS.noFactor, `${n1(OWN.med)}x`, 'The house rule applies the peers\' move (§7c)'),
  [`Sum of the parts: base business at the peers' ${n1(Y.peerPe)}x P/E on Sep-28E EPS without Zaynich (₹${n1(Y.exZSep)}) + Zaynich risked NPV (GAM peak)`, '–', n0(Y.sotpTp), vs(Y.sotpTp), 'No broker uses it; shown because Zaynich earnings come after FY29'],
  ['Same, Zaynich at management\'s US$1.5bn peak', '–', n0(Y.sotpMgmt), vs(Y.sotpMgmt), 'Management guidance, no year given'],
  { hl: true, cells: ['**Base**', `**${peMult}x × ₹${n1(epsSep28)}**`, '**{{dcf.tp|num}}**', '**{{dcf.upside|chg}}**', 'Own window from the break × peers over the same window'] },
], source: 'GAM Research. Wockhardt\'s own re-rating is not blended in (§7c); its five-year median is meaningless (loss years).' } };

const amortTable = { exhibit: { type: 'table', title: 'The target if Zaynich amortisation starts or runs differently (not disclosed by the company)', head: ['Amortisation path', 'FY27E / FY28E / FY29E (₹ cr)', 'EPS FY27E / FY28E / FY29E (₹)', 'Multiple', 'Target (₹)', 'vs CMP'], wide: [0], rows: [
  { hl: true, cells: ['**Base: from launch (~Jan-2027), ~13 years**', `**${Y.Z_AMORT.join(' / ')}**`, `**${F.eps.map(n1).join(' / ')}**`, `**${peMult}x**`, '**{{dcf.tp|num}}**', '**{{dcf.upside|chg}}**'] },
  ...Y.AMORT_CASES.map(c => [c.label, c.alt.join(' / '), c.eps.map(n1).join(' / '), `${c.mult}x`, n0(c.tp), vs(c.tp)]),
], source: 'GAM Research: EPS restated each year and the forward P/E window re-derived (same factor and rounding). It matters because FY27E EPS sets half of the historical window.' } };

const npvTable = { exhibit: { type: 'table', title: 'Zaynich risked NPV and what the 30-Sep price implies (sensitivity)', head: ['Case', 'Global peak sales', 'NPV (₹ cr)', '₹ per share'], rows: [
  ['GAM base: US$1bn US market × 22.5% share ÷ US 40% of global (all chairman\'s figures)', `US$${Y.PEAK_GAM}mn`, n0(Y.Z_GAM.npv), n0(Y.Z_GAM.perShare)],
  ['Management low end', 'US$1,500mn', n0(Y.Z_MGMT.npv), n0(Y.Z_MGMT.perShare)],
  ['Management high end', 'US$2,000mn', n0(Y.Z_MGMT2.npv), n0(Y.Z_MGMT2.perShare)],
  { hl: true, cells: ['**Implied by the price** (EV ₹' + n0(Y.evMkt) + ' cr less the base business at the peers\' ' + n1(Y.peerEv) + 'x FY27E EBITDA = ₹' + n0(Y.baseValue) + ' cr)', `**US$${n0(Y.PEAK_IMPLIED)}mn**`, `**${n0(Y.impliedZ)}**`, `**${n0(Y.impliedZ / X.SHARES)}**`] },
], source: `GAM Research. Our FY27-29E Zaynich build, a straight-line ramp to the peak in FY34, flat to FY38 (patent), then −35% a year; EBITDA margin rising to 40%; tax 25%; working capital 20% of the revenue increase; ${n1(V.ke)}% cost of equity; EU/EM revenue × ${SR.ndaToApproval}% (BIO 2011-20 filing-to-approval); non-India value × 85.85% (Bio AG minority). WCK 6777 (phase 2, ~15% historical odds, no peak sales guided) not valued.` } };

const valueLines = [
  { pair: [
    { type: 'line', title: `Forward P/E since 1-Oct-2025: median ${n1(OWN.med)}x; target ${peMult}x`, unit: 'Price ÷ next full-year EPS (x), weekly; FY27E/FY28E GAM', x: win.map(x => x[0]), series: [{ name: 'Forward P/E', values: win.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: OWN.med, text: `Median ${n1(OWN.med)}x` }, { v: peMult, text: `Target ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; GAM estimates' },
    { type: 'line', title: `Forward EV/EBITDA since 1-Oct-2025: median ${n1(HEV.med)}x`, unit: 'EV ÷ next full-year EBITDA (x), weekly', x: evWin.map(x => x[0]), series: [{ name: 'EV/EBITDA', values: evWin.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: HEV.med, text: `Median ${n1(HEV.med)}x` }, { v: evMult, text: `Cross-check ${evMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; AR balance sheets; GAM estimates' },
  ] },
];

const scenarios = { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
  ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +4pp a year, margin +2pp (EPS ₹${n1(SC.bull.eps[1])} FY28E, ₹${n1(SC.bull.eps[2])} FY29E); ${AS.valuation.blend.methods[0].multiple.bull}x (75th percentile × factor).`],
  { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / {{F.salesGrowth.1|pct}} / {{F.salesGrowth.2|pct}}; Zaynich ₹${X.lines.zaynich.map(n0).join(' / ')} cr; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${peMult}x Sep-28E EPS.`] },
  ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −4pp a year, margin −2.5pp (EPS ₹${n1(SC.bear.eps[1])} FY28E); ${AS.valuation.blend.methods[0].multiple.bear}x (25th percentile × factor).`],
], source: 'GAM Research' } };

const dcf = [
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Add: model net cash at Mar-27 (negative = net debt, incl. promoter loans and the Bio AG minority)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'], ['Cost of equity (rf 6.5% + 1.15 × 6%)', '{{dcf.ke|pct}}'],
  ], source: 'GAM Research' } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: `Listed pharma peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.filter(p => p.symbol === 'WOCKPHARMA' || PEER_SET.includes(p.symbol)).map(p => [p.symbol === 'WOCKPHARMA' ? '**Wockhardt**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), `${p.ebitdaMargin}%`, n1(p.pe), n1(p.evEbitda), `${p.roe}%`]), source: `Screener.in, trailing multiples scaled to the NSE close on ${ASOF_TXT}; ROE on FY26 profit (Screener basis, Wockhardt before minorities)` } },
];

module.exports = { blocks: [factorTable, ...valueLines, sensTable, amortTable, npvTable, scenarios, ...dcf] };
