// Paradeep initiation, part 6: valuation (street table, multiple derivation, forward P/E on a merger-consistent
// basis, cross-checks, scenarios, DCF detail and sensitivity, peers).
const X = require('./PARADEEP.ctx');
const { streetBlocks } = require('./valuation-blend');
const { F, V, SC, n0, n1, r, price, mult, epsSep28, ebitdaSep28, pe28, peSep28, dcfV, evV, peV, rating, PEERS, PEER_SYMS, FERT, sectorDerate, sectorDerateEv, derateExNfl, fertPe, PP, pname, FM, fwdKept, fwdAll, fwdMed, fwdMedAll, troughYears, fwdYear, derived, BR, PLE, ASOF_TXT, mv, nd, ndEbitda } = X;
const sg = v => `${v > 0 ? '+' : ''}${r(v)}%`;
const pv = s => sg(PEERS[s].peVs);

const derivation = [
  ['1. The street', 'Prabhudas Lilladher 13x FY28E EPS (31-Jul-2026; 10x in Mar-2026, 11x in May-Jun); Elara Capital 8.0x FY28E EV/EBITDA (May-2026, cut from 11.5x for leverage)', 'P/E 10-13x; EV/EBITDA 8x'],
  ['2. Paradeep\'s own history', `One-year-forward P/E median since listing (May-2022): ${n1(fwdMed)}x on EPS investors could see (FY25 ₹6.77 before the merger was announced, ₹6.39 restated after), leaving out the ${troughYears.join(', ')} trough year (forward EPS ₹1.23 < half of FY22's ₹6.92); ${n1(fwdMedAll)}x including it. On Screener's unadjusted EPS the house tool gives ${n1(FM.median)}x. Yearly medians: ${Object.entries(fwdYear).map(([y, v]) => `${y} ${n1(v)}x`).join(', ')} (FY27-28 on our EPS)`, `Starting point: ${n1(fwdMed)}x`],
  ['3. Sector de-rating', `On ${ASOF_TXT} seven listed fertiliser peers traded a median ${Math.abs(r(sectorDerate))}% below their five-year median P/E (Chambal ${pv('CHAMBLFERT')}, RCF ${pv('RCF')}, GNFC ${pv('GNFC')}, GSFC ${pv('GSFC')}, NFL ${pv('NFL')}; Coromandel ${pv('COROMANDEL')} and Deepak ${pv('DEEPAKFERT')} re-rated on diversification). Without NFL: ${r(derateExNfl)}%; on EV/EBITDA: ${r(sectorDerateEv)}%. Paradeep itself: ${sg(PP.peVs)} vs its trailing median`, `${n1(fwdMed)}x × ${(1 + sectorDerate / 100).toFixed(2)} ≈ ${n1(derived)}x → **${mult}x**`],
  ['4. Growth vs the street', `Our EPS: ₹9.6 (FY26) → ₹${n1(F.eps[0])} → ₹${n1(F.eps[1])} → ₹${n1(F.eps[2])} (FY29E), ~10% a year with FY27 down; PL's 13x comes with FY28E EPS of ₹12.6`, 'No upward adjustment'],
  ['5. Peers', `Trailing P/E on ${ASOF_TXT}: fertiliser peers' median ${n1(fertPe)}x; Paradeep ${n1(PP.pe)}x on TTM EPS that includes Q1FY27's inventory gains`, `${mult}x forward is above the peer median: fair for its volume growth`],
  ['6. Returns and leverage', `ROE ~${r(F.roe[1])}-${r(F.roe[2])}% in FY28-29E vs a ~13% cost of equity; net debt ${n1(ndEbitda(0))}x EBITDA (Mar-27E) falling to ${n1(ndEbitda(2))}x (Mar-29E) with ~₹3,900 cr of capex`, 'No premium; supports a single-digit multiple'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${mult}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('PARADEEP', {
      rating,
      streetIntro: 'The latest published method is **P/E on FY28E earnings**: Prabhudas Lilladher (13x, after Q1FY27). Elara Capital, the other published voice, uses EV/EBITDA (8x FY28E, May-2026); we use that as our relative cross-check. "At our EPS" applies each P/E broker\'s multiple to our FY28E EPS.',
      street: BR.map(b => [b.broker, b.rating, b.tp, b.method, b.multiple, b.on, `${b.thesis} (${b.date})`]),
      streetSource: 'Broker notes to 30-Sep-2026 (latest call per broker); Elara via investmentguruindia.com summary',
      ourThesis: 'FY27 squeezed by costs and subsidy lag; integration helps from FY28 but is debt-funded and later than guided',
      derivationIntro: `The target is a 12-month price, so we apply a one-year-forward multiple to the earnings the market will look at in September 2027: **Sep-28E EPS of ₹${n1(epsSep28)}** (half FY28E, half FY29E). Paradeep listed in May-2022, so its history starts then. The MCFL merger distorts Screener's EPS series (FY25 ₹8.12 is restated profit over pre-merger shares), so we compute the forward P/E ourselves and show the house tool's figure alongside.`,
      derivation,
      derivationSource: `Screener.in (prices, P/E and EV/EBITDA history to ${ASOF_TXT}); annual reports FY25-26 (EPS bases); broker notes; GAM Research`,
      crossNote: `**What the cross-checks tell us.** EV/EBITDA at ${mv('ev').mult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr, less ~₹${n0(-(F.treasury[1] + F.treasury[2]) / 2)} cr of net debt, gives ₹${n0(evV)}; the DCF gives ₹${n0(dcfV)}. Both are below the share price. EV/EBITDA is above our P/E value because it ignores the rising depreciation and finance cost that sit between EBITDA and EPS; the DCF is lowest because it charges the working capital that growth needs (31% of revenue) and the FY28-29 project spend, and deducts ~₹${n0(nd(0))} cr of Mar-27E net debt. The share price implies either management's ₹7,000/t arriving on time or the street's 13x multiple.`,
    }),
    { pair: [
      { type: 'line', title: `One-year-forward P/E: ${n1(pe28)}x our FY28E vs ${mult}x target`, unit: 'Price ÷ next full-year EPS (x)', x: fwdAll.filter(x => x[0] >= '2023-04-01').map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdAll.filter(x => x[0] >= '2023-04-01').map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(fwdMed * 10) / 10, text: `Median ex-trough: ${n1(fwdMed)}x` }, { v: mult, text: `Our target: ${mult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; FY25 EPS ₹6.77/₹6.39 (pre/post merger announcement), FY26 ₹9.60, GAM estimates FY27-28E; FY24-forward (trough) not shown' },
      { type: 'hbar', title: `Peers vs their five-year median P/E: median ${r(sectorDerate)}%`, unit: 'Trailing P/E vs own five-year median (%)', x: PEER_SYMS.map(s => pname(PEERS[s])), series: [{ name: 'vs median', values: PEER_SYMS.map(s => r(PEERS[s].peVs)), fmt: 'num' }], labels: 'all', highlight: 'Paradeep Phosphates', source: `Screener.in weekly P/E (Oct-2021 to Sep-2026; Paradeep from listing), NSE close ${ASOF_TXT}` },
    ] },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} FY28E EPS ₹${n1(SC.bull.eps[1])}; ${mv('pe').multiple.bull}x Sep-28E EPS.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Volumes ${X.B.volumeMt.join(' / ')} mt, EBITDA ₹${X.B.ebitdaPerTonne.map(n0).join(' / ₹')} per tonne (FY27-29E); FY28E EPS ₹${n1(F.eps[1])}; ${mult}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} FY28E EPS ₹${n1(SC.bear.eps[1])}; ${mv('pe').multiple.bear}x Sep-28E EPS.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { p: `FCFF from FY28E to FY39E: explicit FY28-29E, then revenue growth fading to 6%, EBITDA margin to 10.5% (~₹6,100/t) and capex to 3% of revenue, depreciation at 2.2% of revenue, working capital at 31% of revenue, terminal growth 5.5%. **Engine note:** the engine discounts at a single rate labelled the cost of equity; because Paradeep is indebted we enter a WACC of 11.0% (cost of equity ~13.1% at beta 1.1, post-tax cost of debt ~6%, ~70/30 weights) as beta 0.75, and deduct net debt at Mar-27E (₹${n0(nd(0))} cr).` },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-39E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27E (negative = net debt)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27; 103.75 cr shares)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value**', `**₹${n0(dcfV)}**`] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed fertiliser peers (trailing multiples at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'ROE', 'P/E (x)', '5-yr median P/E (x)', 'vs median', 'EV/EBITDA (x)', '5-yr median EV/EBITDA (x)'], rows: PEER_SYMS.map(s => PEERS[s]).map(p => [p.symbol === 'PARADEEP' ? '**Paradeep Phosphates**' : pname(p), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', p.roe + '%', n1(p.pe), n1(p.pe5), sg(p.peVs), n1(p.evEbitda), n1(p.ev5)]), source: `Screener.in: trailing P/E and EV/EBITDA at the NSE close on ${ASOF_TXT}; five-year median of weekly values (Oct-2021 to Sep-2026; Paradeep from listing in May-2022). FACT excluded (P/E not meaningful on near-zero profit)` } },
  ],
};

module.exports = { valuation };
