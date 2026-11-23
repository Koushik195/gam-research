// Sona Comstar report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, driveline, motors & DENSO, railway, new verticals, moat, Q1FY27, earnings quality, ownership,
// governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in SONACOMS.ctx.js;
// forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./SONACOMS.ctx');
const { F, V, A, C, SA, n0, n1, n2, pc, price, mv, FM, sectorDr, MULT, epsSep, rating, postQ1, medTp, sellAbove, DN, sepNow, trailPe, b } = X;
const P2 = require('./SONACOMS.part2'), P3 = require('./SONACOMS.part3'), P4 = require('./SONACOMS.part4'), P5 = require('./SONACOMS.part5'), P6 = require('./SONACOMS.part6');
const E = epsSep.base;

const cover = {
  headline: 'A genuine engineering franchise, priced at its own median multiple while the sector de-rates',
  lead: `Sona Comstar makes differential gears and assemblies, starter motors, EV traction and suspension motors and, since Jun-2025, railway brakes and couplers, for 7 of the world's top-10 car makers and India's EV leaders. Q1FY27 was its best quarter (revenue +54%, BEV revenue +107% to 44% of automotive sales), and the 22-Jul-2026 DENSO joint ventures gave it a way into high-voltage and hybrid powertrains. The stock doubled in a year to ₹${n0(price)} (${n1(trailPe)}x trailing EPS). We forecast EPS of ₹${n2(F.eps[0])} / ₹${n2(F.eps[1])} / ₹${n2(F.eps[2])} for FY27-29E (+18% a year) at EBITDA margins in the lower half of the guided 23-25% band. The street values Sona on **P/E on one-year-forward EPS** (Jefferies 55x FY28E). The house multiple, its ${n1(FM.median)}x forward-P/E median since mid-2022 cut by the ${Math.abs(sectorDr).toFixed(1)}% auto-component de-rating, is **${MULT.base}x Sep-28E EPS of ₹${n2(E)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The franchise is real: engineering, global share and the EV head start', p: '8.7% of the world\'s differential gears and 55-90% of India\'s; 19 products designed and scaled in-house in seven years (~₹1,800 cr of annualised revenue); 69 EV programmes with 36 customers; a ₹24,000 cr order book (5.4x revenue, 64% EV). DENSO will pay Sona royalties for its 2W/3W motor technology. Net cash ~₹1,000 cr.' },
    { h: 'But FY26 growth was bought and margins have stepped down', p: 'FY26 revenue +25%, but by our estimate the automotive business was flat: the railway purchase (₹1,643 cr) supplied the growth while BEV revenue fell 6%. The EBITDA margin fell from 27.4% (FY25) to 24.7% and 23.1% in Q1FY27 (company basis); the guided band has been cut twice (25-27% at the IPO, now 23-25%). ROE halved from 21% to 11% after the QIP.' },
    { h: 'Q1FY27 is a strong restart, and we model it', p: `BEV revenue more than doubled and India, Europe and China grew. We model revenue +{{F.salesGrowth.0|n1}}% in FY27E, then +15% and +14%, margins of {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}} (Screener basis) and EPS +17% / +19% / +19%. The DENSO deal (completion by Mar-2027) brings ~₹${n0(DN.cash)} cr of cash and a 49% minority in the 2W/3W motor business: roughly EPS-neutral, so it is not in our numbers.` },
    { h: 'Valuation: the price is at the stock\'s own median while the sector is 9% below', p: `At ₹${n0(price)} Sona trades at ${n1(sepNow)}x Sep-28E EPS, the same as its ${n1(FM.median)}x forward median since Jun-2022 (we leave out the first year after listing, when it paid up to ${Math.round(X.buckets[0].hi)}x). Auto-component peers were ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026; the house rule applies that to Sona too. The call is narrow: we would be at HOLD below ~₹${n0(sellAbove)}. Robotics and physical AI (₹800 cr order book) is optionality management itself says matters only beyond three years.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether commodity pass-through lifts the margin back towards 24% (company basis), and whether BEV revenue holds near Q1\'s record.',
    'Completion of the DENSO share subscription in Sona eDrive (by 31-Mar-2027) and the incorporation of the HV joint venture (JV2); first JV2 customer nominations.',
    'US EV demand and tariffs: the anchor EV customer\'s volumes and any India-US trade deal; the EU-India FTA.',
    'Robotics and physical AI: start of production of the first of three orders (one "this quarter", the rest within 15 months).',
    'Railway: HVAC and electric-panel orders, and any disclosure of the business\'s revenue and margin.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yrs = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const bev = C.bev, QB = ['Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹1,038 cr (FY20) to ₹4,449 cr (FY26), ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E (railway from Jun-2025)' },
      { type: 'column', title: 'BEV revenue: from ₹23 cr to ₹1,224 cr in five years, then a dip in FY26', unit: 'BEV revenue (₹ crore)', x: yrs, series: [{ name: 'BEV revenue', values: yrs.map(y => Math.round(bev.annual[y])), fmt: 'num' }], labels: 'all', source: 'Company presentations (Q4FY26, Q1FY27)' },
    ] },
    { pair: [
      { type: 'line', title: 'BEV share of automotive revenue: a record 44% in Q1FY27', unit: 'BEV share of automotive product revenue (%)', x: QB, series: [{ name: 'BEV share', values: QB.map(q => bev.quarterlyShare[q]), fmt: 'pct0' }], labels: 'all', min: 0, max: 50, source: 'Quarterly presentations' },
      { type: 'hbar', title: 'India became the largest market in FY26 (railway and US EV weakness)', unit: 'Share of revenue (%)', x: ['India', 'Europe', 'North America', 'Asia ex-India'], series: [{ name: 'FY25', values: [29, 24, 41, 6], fmt: 'pct0' }, { name: 'FY26', values: [51, 27, 17, 5], fmt: 'pct0' }], labels: 'all', source: 'AR FY26, revenue mix by geography' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 28% in FY24, ~23% in our forecasts (Screener basis)', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 15, max: 32, source: 'Screener.in; GAM estimates' },
      { type: 'line', title: 'ROE: 21% in FY24, 11% in FY26, ~14% by FY29E against a 12.5% cost of equity', unit: 'Return on equity (%)', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 25, lines: [{ v: Math.round(V.ke * 10) / 10, text: `Cost of equity ${n1(V.ke)}%` }], source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${Math.round(X.fwdNow)}x FY28E (${Math.round(sepNow)}x Sep-28E) vs a ${Math.round(FM.median)}x median since mid-2022`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdWeekly.filter(x => x[0] >= X.SKIP_TO).map(x => x[0]), series: [{ name: 'Forward P/E', values: X.fwdWeekly.filter(x => x[0] >= X.SKIP_TO).map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median: ${n1(FM.median)}x` }, { v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E; from Jun-2022 (first year after listing left out)' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Trendlyne (MOSL 23-Jul-2026); Univest (Nomura 24-Jul, Jefferies 23-Jul-2026); median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.driveline, P3.motors, P3.railway, P3.newv, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
