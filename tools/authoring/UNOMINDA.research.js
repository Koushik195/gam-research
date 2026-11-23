// Uno Minda report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, divisions, JVs and minorities, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street, valuation,
// verdict, glossary, statement notes). Shared inputs in UNOMINDA.ctx.js; forecast and valuation figures are live tokens
// ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./UNOMINDA.ctx');
const { F, V, A, SQ, QL, BL, n0, n1, pc, price, mv, FM, sectorDr, MULT, epsSep, rating, postQ1, medTp, C, shortDate } = X;
const P2 = require('./UNOMINDA.part2'), P3 = require('./UNOMINDA.part3'), P4 = require('./UNOMINDA.part4'), P5 = require('./UNOMINDA.part5'), P6 = require('./UNOMINDA.part6');
const Q = C.q1fy27;

const cover = {
  headline: 'A proven compounder at a fair price: the multiple, not the business, caps the upside',
  lead: `Uno Minda is India's largest maker of automotive switches and horns, a top-three lighting maker and a fast-growing supplier of alloy wheels, seats, sensors and EV parts, with Japanese-partnered JVs in airbags, filters and infotainment. Revenue grew 25% a year over FY21-26 at a steady ~11% EBITDA margin, and Q1FY27 revenue rose 26% (normalised). We forecast owners' EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, a little below the street. The street values Uno Minda on **P/E on one-year-forward EPS** (MOSL 45x FY28E). The house rule (its own forward P/E median since 2021, ${n1(FM.median)}x, cut by the ${Math.abs(sectorDr).toFixed(1)}% auto-component de-rating) gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The growth engine is real and broad', p: `Revenue grew ~23% a year over FY16-26 against 4-5% a year for car and two-wheeler production (Jefferies, Mar-2026), by adding products per vehicle and customers. Q1FY27: switches +20%, lighting +14%, castings +32%, seating +28%, Green Mobility +78% (EV systems, 4W electric drive units, CNG). FY27 brings seven new or expanded plants, the first EV-powertrain and sunroof lines, and a PV seating plant for FY28. We model revenue +{{F.salesGrowth.0|pct0}} / +{{F.salesGrowth.1|pct0}} / +{{F.salesGrowth.2|pct0}}.` },
    { h: 'But it is a tier-1 supplier with tier-1 margins', p: `The EBITDA margin has stayed in a 10.6-12.3% band for ten years; Q1FY27 was 10.3% as commodity and wage inflation (Haryana minimum wages +~35%) were recovered late and at cost. Management guides 11% ±50bp. Capex runs at ~8% of revenue, so free cash flow is thin (₹${n0(A.fcf.at(-1))} cr in FY26) and net debt rises in FY27.` },
    { h: 'A fifth of profit comes from JVs it does not control', p: `Toyoda Gosei (airbags), Roki (filters), Denso Ten (infotainment) and Tokai Rika (seatbelts) earned Uno Minda ₹249 cr in FY26 (21% of owners' profit), and ~7% of consolidated profit goes to minority partners (mainly Tokai Rika's 49% of Uno Mindarika). The JV income is in EPS but not in EBITDA, which flatters P/E-based comparisons with peers and is invisible to a DCF of consolidated cash flows.` },
    { h: 'Valuation: fair, not cheap', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[1])}x FY28E and ${n1(price / epsSep.base)}x Sep-28E EPS, close to its own forward median since 2021 (${n1(FM.median)}x) and below its two-year median (${n1(X.twoYr)}x); auto-component stocks sat ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026. The street's 39-46x multiples need ~23% EPS growth for years; at 45x our target would be ~₹${n0(Math.round(45 * epsSep.base / 10) * 10)}. We like the business; the price already pays for most of it.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'GREEN' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether margins recover towards 11% as commodity and wage costs are passed on, and the first quarter against the GST-boosted base from Q3.',
    'Commissioning of the Khed EV-powertrain plant and the Bawal 2W alloy-wheel lines (H2FY27), the Farrukhnagar 4W switch plant (Q3FY27) and sunroof (Q4FY27).',
    'China\'s decision on the Inovance EV-powertrain JV (Indian Press Note 3 approval received; Chinese approval pending under tighter technology-export rules).',
    'Festive-season production (Oct-Dec 2026) and Maruti Suzuki volumes: Uno Minda lagged its key 4W client by ~12% in Q1 (Emkay).',
    'New orders: PV seating customers beyond the anchor, sunroof (order book >₹500 cr), exports (target >₹1,500 cr from ~₹600 cr).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yoyQ = X.M.quarterly.sales.map((s, i, a) => (i >= 4 ? Math.round((s / a[i - 4] - 1) * 1000) / 10 : null)).slice(-8);
const DIV = X.DIV, DIVN = X.DIVN;
const mi = [57, 47, 44, 78, 87], jvH = [null, null, null, 180, 249];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹19,658 cr in FY26; ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Q1FY27: +24% reported, +26% excluding last year\'s one-off income', unit: 'Revenue growth year on year (%), as reported', x: X.M.quarterly.labels.slice(-8), series: [{ name: 'Revenue growth', values: yoyQ, fmt: 'pct' }], labels: 'all', source: 'Quarterly results as reported (Q1FY26 includes ₹69 cr of prior-period income)' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Six divisions, none above a quarter of revenue', unit: 'Revenue by division (₹ crore)', x: QL, series: DIV.map((k, i) => ({ name: DIVN[k], values: SQ.map(q => q[k]), fmt: 'num', ...(i === 4 ? { color: '#7a5195' } : i === 5 ? { color: '#8c8c8c' } : {}) })), minLabel: 400, source: 'Q4FY26 and Q1FY27 presentations (new division basis; Q1FY26 excludes prior-period income)' },
      { type: 'hbar', title: 'Q1FY27 growth by division: EV and CNG lead', unit: 'Revenue growth year on year (%)', x: DIV.map(k => DIVN[k]), series: [{ name: 'Growth', values: DIV.map(k => Q.divisions[k][1]), fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 presentation and call (4-Aug-2026)' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: a 10.6-12.3% band for a decade', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 8, max: 14, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'JV profits outgrow the minorities Uno Minda pays away', unit: '₹ crore (FY27-29E: GAM)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Share of JV profit', values: [...jvH, ...BL.jv], fmt: 'num' }, { name: 'Minority interests', values: [...mi, ...BL.minorities], fmt: 'num' }], labels: 'all', source: 'AR FY25-26 (JV share; earlier years not separated in our sources); Screener.in (minorities); GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${Math.round(price / epsSep.base)}x Sep-28E now vs a ${n1(FM.median)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Forward P/E', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q1 notes)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes, 4/5-Aug-2026 (Jefferies via TipRanks/StockAnalysis); median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.core, P3.castings, P3.newbiz, P3.jv, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
