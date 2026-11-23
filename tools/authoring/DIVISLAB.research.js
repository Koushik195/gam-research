// Divi's Laboratories report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, custom synthesis, generics, nutraceuticals, capacity, moat, margins, earnings quality, capital,
// ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in
// DIVISLAB.ctx.js. Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./DIVISLAB.ctx');
const { D, F, V, A, AS, C, n0, n1, pc, price, mv, epsSep28, peMult, evMult, rating, FM, FMS, K, sectorDr, LINES, HIST, QH, fwdPe, ST, postQ1, medTp, avgEps, P, SET, dr1, shortName, buyBelow, fwdNow, peFY27, Q1, shortDate, SA, csShare } = X;
const P2 = require('./DIVISLAB.part2'), P3 = require('./DIVISLAB.part3'), P4 = require('./DIVISLAB.part4'), P5 = require('./DIVISLAB.part5'), P6 = require('./DIVISLAB.part6');

const cover = {
  headline: 'A world-class chemistry franchise priced ahead of its pipeline: the history supports ~59x earnings, and that is below today\'s price',
  lead: `Divi's Laboratories is India's largest maker of active pharmaceutical ingredients (APIs) and one of the world's ten largest small-molecule contract manufacturers. Of FY26 revenue of ₹10,560 cr, 55% was custom synthesis for big pharma, 36% generic APIs and 9% nutraceuticals. Q1FY27 was exceptional: revenue +28% (only ~10% in constant currency), EBITDA margin 40.7%, as validation batches of three dedicated projects (~₹2,000 cr of capex) shipped and the rupee slumped. The stock rose from ~₹6,700 in June to ₹${n0(price)} on 30-Sep-2026, above the ₹${n0(medTp)} median of the post-results targets. The street values Divi's on **P/E** (Motilal Oswal 55x 12-month forward, BOBCAPS 56x Mar-28E) or EV/EBITDA (JM 41x, HDFC 39x). We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, ~5-10% below the post-results street. Divi's own one-year-forward P/E median since 2021 (${n1(FM.median)}x) times the pharma sector factor (×${K}) gives **${peMult}x Sep-28E EPS of ₹${n1(epsSep28)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The franchise is real', p: "Divi's works for 12 of the world's 20 largest drug makers, 18-20 of its projects are commercial or being commercialised, and customers prepaid ₹1,207 cr in FY26 to reserve capacity. It is the largest maker of ten generic APIs, backward-integrated through a new plant at Kakinada, and has had clean USFDA outcomes since 2017. Few Indian companies can claim this; we do not dispute the quality." },
    { h: 'The growth the price needs is not yet visible', p: `Constant-currency growth was 6.8% in FY26 and ~10% in Q1FY27. The three dedicated projects are validated, but commercial volumes wait for customers' regulatory approvals ("by 2027"; the first was once targeted for Jan-2027). Peptide and GLP-1 work is promising and undisclosed. We already model custom synthesis +${AS.businessLines.growth.cs[0]}% / +${AS.businessLines.growth.cs[1]}% / +${AS.businessLines.growth.cs[2]}% (to ${Math.round(csShare(2))}% of sales by FY29E).` },
    { h: 'Q1FY27 is not the new run-rate', p: "The 68% gross margin came with a ~₹500 cr inventory build (a three-month raw-material stockpile at war-inflated solvent prices, plus validation work in progress). Management says the gross margin will not hold at that level and FY27's EBITDA margin will be 'similar' to FY26's 32.6%. We model 35.5% for FY27E (Q2-Q4 ~34%), already giving credit for the weak rupee." },
    { h: 'Valuation is the problem', p: `At ₹${n0(price)} the stock trades at ${n1(peFY27)}x our FY27E and ${n1(fwdNow)}x FY28E EPS. Our ${peMult}x target multiple is not stingy: it is Divi's own median since 2021 lifted ~5% for a sector that trades above its history, and it still sits below today's price. The DCF (₹${n0(mv('dcf').value)}) says cash flows support far less. Below ~₹${n0(buyBelow)} the rule would turn us buyers.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether the gross margin stays near 60%+ as the stockpile is used, and whether custom synthesis holds ~60% of revenue without validation batches.',
    "Customers' regulatory approvals for the three dedicated projects (management: commercialisation 'by 2027'); any SEBI disclosure of a new contract or the Kakinada Phase 2 (four blocks) decision.",
    'The second iodine contrast-media long-term contract (expected within months of Aug-2026) and commercial volumes from four new generic DMFs (3-6 months).',
    'The rupee and West Asia: a ceasefire would cut solvent costs but also remove part of the currency tailwind in rupee revenue.',
    'US policy: Section 232 tariffs on patented APIs (live from 31-Jul / 29-Sep-2026) and the BIOSECURE Act, which may move work from Chinese CDMOs to India.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const H = HIST.filter(h => h.fy >= 'FY22');
const tpRows = postQ1.slice().sort((a, c) => c.tp - a.tp);
const NA = C.geography.rows;
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Custom synthesis drives the growth; generics barely move', unit: 'Revenue by business (₹ crore)', x: [...H.map(h => h.fy), ...F.years], series: [{ name: 'Custom synthesis', values: [...H.map(h => Math.round(h.cs)), ...LINES.cs.map(Math.round)], fmt: 'num' }, { name: 'Generic APIs', values: [...H.map(h => Math.round(h.gen)), ...LINES.generics.map(Math.round)], fmt: 'num' }, { name: 'Nutraceuticals', values: [...H.map(h => h.nutra), ...LINES.nutra.map(Math.round)], fmt: 'num' }], minLabel: 1500, source: "Company split (generics include nutraceuticals) and nutraceutical revenue from earnings calls; GAM estimates FY27-29E" },
      { type: 'column', title: 'Reported growth vs constant currency: the rupee did a lot of the work', unit: 'Revenue growth, YoY (%)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Reported (₹)', values: [...['FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(A.salesGrowth[A.labels.indexOf(y)] * 10) / 10), Math.round((Q1.revenue / Q1.revenuePrior - 1) * 1000) / 10], fmt: 'pct' }, { name: 'Constant currency', values: [...SA.filter(a => a.fy >= 'FY23').map(a => a.ccGrowthPct), Q1.ccGrowthStandalonePct], fmt: 'pct' }], labels: 'all', source: 'Screener.in; constant-currency growth from the CFO on each Q4 call and the Q1FY27 call (standalone)' },
    ] },
    { pair: [
      { type: 'line', title: 'Q1FY27 margins broke out of a two-year range', unit: '% of revenue', x: QH.map(q => q.q), series: [{ name: 'Gross margin', values: QH.map(q => q.gm), fmt: 'pct' }, { name: 'EBITDA margin', values: QH.map(q => q.em), fmt: 'pct' }], labels: 'last', min: 0, max: 75, source: 'Screener.in (gross margin = 100 − material cost %)' },
      { type: 'column', title: 'Capex at 24% of sales in FY26, twice the old norm', unit: 'Capex, % of revenue', x: 'fin.labels', from: 'FY17', series: [{ name: 'Capex / revenue', ref: 'fin.capexToSales', fmt: 'pct0' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'column', title: 'North America: the Covid boom and bust in one chart', unit: 'Standalone revenue from North America (₹ crore)', x: NA.map(r => r.fy), series: [{ name: 'North America', values: NA.map(r => r['North America']), fmt: 'num' }, { name: 'Europe', values: NA.map(r => r.Europe), fmt: 'num' }], labels: 'all', source: "AR FY26 (sales by geography)" },
      { type: 'line', title: `Forward P/E: median ${n1(FM.median)}x since 2021, ${n1(fwdNow)}x now`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.filter(x => x[0] >= '2019-04-01').map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.filter(x => x[0] >= '2019-04-01').map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median since Apr-2021: ${n1(FM.median)}x` }, { v: peMult, text: `Target: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; reported EPS; GAM estimates FY27-28E' },
    ] },
    { pair: [
      { type: 'hbar', title: 'The price is above most post-results targets', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...tpRows.map(s => `${s.broker} (${s.rating})`), 'GAM (base)'], series: [{ name: 'Target', values: [...tpRows.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes 31-Jul to 4-Aug-2026 as cited in deep.json; GAM Research' },
      { type: 'hbar', title: `Pharma trades above its five-year P/E: median ${pc(sectorDr)}`, unit: 'Trailing P/E at 30-Sep-2026 vs own five-year median (%)', x: [...SET.map(shortName), "Divi's"], series: [{ name: 'vs median', values: [...SET.map(dr1), dr1('DIVISLAB')], fmt: 'pct' }], labels: 'all', highlight: "Divi's", source: 'Screener.in P/E history; NSE closes on 30-Sep-2026; PLAYBOOK §7c peer set' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.cs, P3.generics, P3.nutra, P3.capacity, P4.moat, p.seasons, p.financials, P4.margins, P4.quality, p.balance, P4.capital, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
