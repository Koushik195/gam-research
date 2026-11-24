// JBM Auto report, part 5: the street and the valuation (P/E on Sep-28E EPS, multiple derived from the stock's own
// forward P/E history since Apr-2021 and the auto-component de-rating; EV/EBITDA and DCF cross-checks; scenarios; peers).
const X = require('./JBMA.ctx');
const { D, F, V, n0, n1, pc, price, shares, mv, FM, FMapr22, fmP25, fmP75, weeklyMed, exHypeMed, buckets, sectorDr, sectorDrAll, sectorDrCr, k, derate, P, PEERS, USED, EXCL, shortName,
  MULT, SENS, epsSep, evMed, evP25, evNow, evMULT, evConv, ttmEbitda, ebitdaSep28, medOf, sepNow, peg, epsCagrFwd, trailPe, ASOF_TXT } = X;
const r10 = v => Math.round(v / 10) * 10, E = epsSep.base;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const peerPe = medOf(USED.map(s => P[s].pe));
const evNet = mv('ev').value * shares - evMULT.base * ebitdaSep28; // net cash (negative = net debt) used by the EV method
const dcfPe = mv('dcf').value / E;
const { ratingFor } = require('../../src/ratings');
const exHypeRating = ratingFor((r10(SENS.exHype * E) / price - 1) * 100);

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: no broker note we could find dated on or before 30-Sep-2026',
  blocks: [
    { p: rup(`${D.street._note} ${D.street.methodView}`) },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Source'], wide: [0], rows: D.critiques.map(c => [rup(c), 'GAM Research from company disclosures and Crisil']), source: 'Annual reports, exchange filings, Crisil (5-Aug-2026); GAM Research' } },
    { callout: '**What the bulls say** (in press coverage, not broker notes): JBM is the e-bus leader in a market the government is building, its plant has room for 20,000 buses a year, and outside investors in its operating JV and possibly its EV business (Bain report, Aug-2026) will crystallise value. **What the bears say:** the growth is financed by the group itself, cash flow is negative and the stock already fell 50% from its 2024 peak for good reasons.' },
  ],
};

const sens = [
  ['From Apr-2022 (one year later start)', `${n1(FMapr22.median)}x × ${k.toFixed(3)} = ${SENS.apr22}x`, n0(r10(SENS.apr22 * E))],
  ['Every weekly close (not every fifth) since Apr-2021', `${n1(weeklyMed)}x × ${k.toFixed(3)} = ${SENS.weekly}x`, n0(r10(SENS.weekly * E))],
  ['Leaving out the e-bus re-rating (prices Apr-2023 to Mar-2025, forward P/E 47-114x; not a trough under the house rule)', `${n1(exHypeMed)}x × ${k.toFixed(3)} = ${SENS.exHype}x`, n0(r10(SENS.exHype * E))],
  ['All eleven peers (Bharat Forge and Gabriel kept)', `de-rating ${pc(sectorDrAll)} → ${SENS.allEleven}x`, n0(r10(SENS.allEleven * E))],
  ['Craftsman added to the peer set', `de-rating ${pc(sectorDrCr)} → ${SENS.withCr}x`, n0(r10(SENS.withCr * E))],
  ['No sector de-rating (bull multiple)', `${MULT.bull}x`, n0(r10(MULT.bull * E))],
  ['Olectra Greentech\'s trailing P/E (closest listed e-bus maker)', `${n1(P.OLECTRA.pe)}x (Olectra is ${pc(derate.OLECTRA)} vs its own five-year median)`, n0(r10(SENS.olectra * E))],
  ['P/E implied by our DCF', `₹${n0(mv('dcf').value)} ÷ ₹${n1(E)} = ${n1(dcfPe)}x`, n0(r10(mv('dcf').value))],
  ['Growth premium', `EPS +${Math.round(epsCagrFwd)}% a year FY26-29E; PEG at our multiple ${peg.toFixed(1)}x. Not added (§7c)`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the cash-flow cross-checks are far lower`,
  blocks: [
    { h: 'How we value JBM Auto' },
    { p: 'With no broker note dated on or before 30-Sep-2026, we follow how the market quotes the stock and how the house values auto-component makers: P/E on one-year-forward EPS. Our earnings year is Sep-28E (half FY28E, half FY29E), what the market will look at in September 2027. EV/EBITDA and a DCF are cross-checks only. A sum-of-the-parts would split the bus business from components, but the bus economics are shared between JBM Auto (manufacturing, 85% owned) and an equity-accounted JV whose accounts are not public, so we do not build one.' },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own forward P/E (house function)', `One-year-forward P/E (price ÷ next full year's EPS; reported EPS, then ours) from Apr-2021: median ${n1(FM.median)}x (25th-75th percentile ${n1(fmP25)}-${n1(fmP75)}x); no trough years (EPS never fell below half its prior three-year peak). By forward year: ${buckets.map(x => `${x.fy} ${n1(x.med)}x`).join(', ')}`, `**Starting point: ${n1(FM.median)}x**`],
      ['2. Sector de-rating', `Auto-component peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${USED.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded: ${EXCL.map(s => `${shortName(s)} (${pc(derate[s])}; ${D.peers.excluded[s].split(':')[0].toLowerCase()})`).join('; ')}; all eleven ${pc(sectorDrAll)}. JBM Auto itself (${pc(derate.JBMA)}) is not used`, `× ${k.toFixed(3)}`],
      ['3. Growth', `EPS +${Math.round(epsCagrFwd)}% a year FY26-29E on our numbers, helped by lower interest; revenue +13-15%. No broker EPS to compare`, 'No adjustment (§7c); see sensitivity'],
      ['4. Peers', `Auto-component peer median trailing P/E ${n1(peerPe)}x; JBM Auto ${n1(P.JBMA.pe)}x; Olectra ${n1(P.OLECTRA.pe)}x; Ashok Leyland ${n1(P.ASHOKLEY.pe)}x`, `JBM trades at a ${pc((P.JBMA.pe / peerPe - 1) * 100)} premium to component peers`],
      ['5. Returns', `ROE ~15% in FY26 (Screener), ~{{F.roe.2|pct}} by FY29E in our model vs a ${n1(V.ke)}% cost of equity; ROCE 12-15%`, 'About the cost of capital: no case for a premium'],
      ['6. Result (nearest half-turn)', `${n1(FM.median)}x × ${k.toFixed(3)} = ${n1(FM.median * k)}x`, `**${MULT.base}x Sep-28E EPS of ₹${n1(E)}**`],
      ['7. Bull / bear', `Bull: no de-rating (${n1(FM.median)}x). Bear: 25th-percentile forward P/E, de-rated (${n1(fmP25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and EPS to ${ASOF_TXT}; GAM estimates for FY27-28E EPS in the forward series` } },
    { callout: `**The honest caveat.** The ${n1(FM.median)}x median is not distorted by a trough, but it includes two years (Apr-2023 to Mar-2025) when the market priced JBM as an e-bus growth story at 47-114x forward earnings. The house rule keeps them, and we apply it as written. Without them the median is ${n1(exHypeMed)}x and the target would be ~₹${n0(r10(SENS.exHype * E))}, a ${exHypeRating}. The stock now trades at ${n1(sepNow)}x our Sep-28E EPS, below every version of its own median, which is why the rule gives a ${X.rating}.` },
    { pair: [
      { type: 'line', title: `Forward P/E since Apr-2021: median ${n1(FM.median)}x; now ${n1(sepNow)}x on Sep-28E`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdWeekly.map(x => x[0]), series: [{ name: 'Forward P/E (weekly)', values: X.fwdWeekly.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median since Apr-21: ${n1(FM.median)}x` }, { v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; reported EPS, GAM estimates for FY27-28E. The 2023-24 hump is the e-bus re-rating.' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(E)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr less net debt`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-37E, rate {{dcf.ke|n1}}%, g 6%, less net debt', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x Sep-28E EBITDA less ~₹${n0(-evNet)} cr of net debt) gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is JBM's ${n1(evMed)}x median trailing EV/EBITDA since Apr-2021 (Screener), cut by the same ${Math.abs(sectorDr).toFixed(1)}% de-rating and restated from trailing (₹${n0(ttmEbitda)} cr to Jun-26) to Sep-28E EBITDA (× ${evConv.toFixed(3)}). It is lower than the P/E value because net debt is large and P/E capitalises the fall in interest. The DCF gives only ₹${n0(mv('dcf').value)}: with a ~11% EBITDA margin and working capital of ~30% of every extra rupee of revenue, little cash is left for shareholders. That is the bear case in numbers: unless working capital falls (as Crisil expects), the business does not throw off the cash that ${MULT.base}x earnings implies.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, window choices, peer sub-sets, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated). Interest and leverage magnify the EPS fall.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-37E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27 (shown negative)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Free cash flow to the firm. The engine discounts at the cost of equity; we set beta at 1.05 so that the rate (12.8%) equals our WACC (Ke ~13.7%, after-tax cost of debt ~6.5%, 14% debt). No deduction for the 15% minority in the EV subsidiary, so the DCF is if anything generous.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers: auto components (de-rating set) and e-bus makers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'JBMA' ? '**JBM Auto**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ['CRAFTSMAN', 'OLECTRA', 'ASHOKLEY'].includes(p.symbol) ? ' (not in set)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : 'Dec year', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', n1(p.pe), derate[p.symbol] != null ? pc(derate[p.symbol]) : '–', n1(p.evEbitda), p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Schaeffler reports on December years. Same de-rating set as the Bosch, Motherson, Uno Minda, Sona and Craftsman initiations; Craftsman, Olectra and Ashok Leyland shown for reference.` } },
  ],
};

module.exports = { street, valuation };
