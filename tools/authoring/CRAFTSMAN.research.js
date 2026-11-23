// Craftsman Automation report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, powertrain, aluminium, industrial & engineering, moat, Q1FY27, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in CRAFTSMAN.ctx.js; forecast and
// valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./CRAFTSMAN.ctx');
X.assertBuild(); X.assertOi();
const { F, V, A, C, SA, n0, n1, n2, pc, price, mv, FM, sectorDr, MULT, epsSep, rating, postQ1, medTp, buyBelow, sepNow, trailPe, b, nd0, ndEbitda, bld } = X;
const P2 = require('./CRAFTSMAN.part2'), P3 = require('./CRAFTSMAN.part3'), P4 = require('./CRAFTSMAN.part4'), P5 = require('./CRAFTSMAN.part5'), P6 = require('./CRAFTSMAN.part6');
const E = epsSep.base;
const fy = SA.map(a => a.fy);

const cover = {
  headline: 'A capable machinist that has become a capital-hungry aluminium caster; the price assumes more than the numbers show',
  lead: `Craftsman Automation machines engine blocks and heads for trucks, tractors and gensets, casts and machines aluminium parts for car and two-wheeler makers, and builds storage and material-handling systems. Revenue grew 5.2x in five years to ₹8,069 cr (FY26), mostly in aluminium and partly through acquisitions; the EBITDA margin halved to 15%. Q1FY27 was strong (revenue +36%, PAT +116%) and a ₹2,000 cr QIP in Jun-2026 cut net debt to ~₹${n0(nd0)} cr. We forecast EPS of ₹${n0(F.eps[0])} / ₹${n0(F.eps[1])} / ₹${n0(F.eps[2])} for FY27-29E on the post-QIP share count, below the street's ~₹350 for FY28E, because depreciation and interest absorb much of the EBITDA growth. The street values Craftsman on **P/E on FY28E EPS** (Motilal Oswal 28x; Emkay uses 17x EV/EBITDA). The house multiple, its ${n1(FM.median)}x forward-P/E median since Apr-2021 cut by the ${Math.abs(sectorDr).toFixed(1)}% auto-component de-rating, is **${MULT.base}x Sep-28E EPS of ₹${n0(E)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A real engineering base, and a growth engine in aluminium', p: '35+ years of machining cylinder blocks and heads, in-house special-purpose machines, 31 plants, and a place in the supply chains of Indian and global engine makers. Aluminium revenue grew from ₹330 cr (FY21) to ₹4,789 cr (FY26); large-engine castings for data-centre gensets (US$100 mn a year by FY30, orders from 4-5 of 6 customers) and an industrial upcycle add new legs.' },
    { h: 'But the growth has cost a lot of capital and margin', p: 'Capex of ₹2,800 cr and ~₹800 cr of acquisitions in FY24-26, two QIPs (₹3,200 cr) in two years, borrowings up to ₹3,623 cr, EBITDA margin 28% → 15%, ROCE ~20% → 12-14% (Screener). Sunbeam, bought in Oct-2024, still earned single-digit EBITDA margins in FY26. One customer was 24% of standalone revenue.' },
    { h: 'Q1FY27 was good, and we model it', p: `Revenue +36%, EBITDA margin 15.8%, PAT +116%. We model revenue +{{F.salesGrowth.0|n1}}% in FY27E, then +16% and +15%, and an EBITDA margin rising from {{F.ebitdaMargin.0|pct}} to {{F.ebitdaMargin.2|pct}} as Sunbeam recovers. But capex of ₹1,500 cr in FY27 lifts depreciation and keeps net debt near ₹2,200-2,500 cr: our FY28E EPS (₹${n0(F.eps[1])}) is ~${Math.round((1 - F.eps[1] / 347.6) * 100)}% below the street's, and ROE only reaches ~{{F.roe.2|pct}} by FY29E.` },
    { h: 'Valuation: the stock trades well above its own history', p: `At ₹${n0(price)} Craftsman trades at ${n1(sepNow)}x our Sep-28E EPS and ${n1(trailPe)}x trailing earnings, against a ${n1(FM.median)}x forward-P/E median since Apr-2021, while auto-component peers trade ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians. Even the street's post-Q1 targets (₹9,699-11,900) would mean ${n1(9699 / F.eps[1])}-${n1(11900 / F.eps[1])}x our FY28E EPS. We would turn HOLD only below ~₹${n0(X.sellAbove)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Balance sheet', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether aluminium pass-through and Sunbeam\'s exits lift the margin, and the first half-year balance sheet after the QIP (net debt, working capital).',
    'The board\'s capex decision for FY27-28 (management said it would decide in Q3/Q4 whether to raise the ~₹1,500 cr plan).',
    'Sale of Sunbeam\'s Gurgaon land ("close to signing a deal", Jul-2026): ~₹400 cr of debt reduction implied by the CMD.',
    'Large-engine castings: approval of the cast parts (about a year) and first volume supplies in FY28.',
    'Merger of DR Axion, Suprash and Srikara into Sunbeam (scheme filed); commissioning of DR Axion\'s Sriperumbudur plant (by Dec-2026).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹1,560 cr (FY21) to ₹8,069 cr (FY26), ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'stacked', title: 'Aluminium went from 21% to 59% of revenue in five years', unit: 'Segment revenue (₹ crore)', x: fy, series: [{ name: 'Powertrain', values: SA.map(a => Math.round(a.ptRev)), fmt: 'num' }, { name: 'Aluminium products', values: SA.map(a => Math.round(a.alRev)), fmt: 'num' }, { name: 'Industrial & engineering', values: SA.map(a => Math.round(a.ieRev)), fmt: 'num' }], source: 'Annual reports FY22, FY24, FY26 (segment notes)' },
    ] },
    { pair: [
      { type: 'line', title: 'Segment EBIT margins: powertrain 17%, aluminium 10%, industrial 4% (FY26)', unit: 'Segment EBIT margin (%)', x: fy, series: [{ name: 'Powertrain', values: SA.map(a => Math.round(a.ptEbit / a.ptRev * 1000) / 10), fmt: 'pct' }, { name: 'Aluminium', values: SA.map(a => Math.round(a.alEbit / a.alRev * 1000) / 10), fmt: 'pct' }, { name: 'Industrial & eng.', values: SA.map(a => Math.round(a.ieEbit / a.ieRev * 1000) / 10), fmt: 'pct' }], labels: 'last', min: 0, max: 30, source: 'Annual reports (segment result before unallocable costs, other income and interest)' },
      { type: 'line', title: 'EBITDA margin: 28% in FY21, 15% in FY25-26, ~16.6% by FY29E', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 32, source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'Capex ₹631 / 992 / 1,188 cr in FY24-26 and ₹1,500 cr planned for FY27', unit: 'Capex (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'all', source: 'Screener.in; management (Q1FY27 call); GAM estimates' },
      { type: 'column', title: 'Net debt / EBITDA: 2.4x at Mar-26, ~1.2x after the QIP, ~1.4x by Mar-27E', unit: 'Net debt ÷ EBITDA (x)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY26 PF', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Net debt / EBITDA', values: [1.3, 1.6, 1.7, 2.3, 2.4, Math.round(nd0 / A.ebitda[b] * 10) / 10, ...ndEbitda.map(x => Math.round(x * 10) / 10)], fmt: 'x' }], labels: 'all', source: 'Company presentations FY22-26 (company basis, excludes leases); FY26 PF = Screener basis incl. leases, pro forma for the Jun-2026 QIP; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${Math.round(sepNow)}x Sep-28E vs a ${Math.round(FM.median)}x median since Apr-2021`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdWeekly.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.fwdWeekly.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median: ${n1(FM.median)}x` }, { v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; actual EPS (as reported), GAM estimates for FY27-28E (post-QIP shares)' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Emkay (31-Jul-2026); Motilal Oswal (30-Jul-2026, via DSIJ); median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.powertrain, P3.aluminium, P3.industrial, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
