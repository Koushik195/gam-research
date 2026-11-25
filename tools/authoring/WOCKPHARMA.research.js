// Wockhardt report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// Zaynich, pipeline, earnings without Zaynich, regions, moat, Q1FY27, earnings quality, ownership, governance, forecasts,
// street, valuation, risks, glossary, statement notes). Shared inputs in WOCKPHARMA.ctx.js / ctx2.js. Forecast and valuation
// figures are live tokens ({{...}}) or computed from the model, so they follow assumptions.json. As of 30-Sep-2026.
const X = require('./WOCKPHARMA.ctx'), Y = require('./WOCKPHARMA.ctx2');
const { F, V, SC, n0, n1, pc, SQ, QL, Q1, price, mv, peMult, epsSep28, OWN, k, rating, lines, baseRev, YRS, peSep28, S21, SENS, val, FAC } = X;
const P2 = require('./WOCKPHARMA.part2'), P3 = require('./WOCKPHARMA.part3'), P3B = require('./WOCKPHARMA.part3b'), P4 = require('./WOCKPHARMA.part4'), P4B = require('./WOCKPHARMA.part4b'), P5 = require('./WOCKPHARMA.part5'), P6 = require('./WOCKPHARMA.part6');

const cover = {
  headline: 'Zaynich is a real scientific win, but the price already pays for more than management\'s own peak-sales guidance',
  lead: `Wockhardt sells generics in the UK and Ireland, insulin biosimilars in emerging markets and branded drugs in India, and in May 2026 won USFDA and Indian approval for Zaynich, the first antibiotic discovered in India to clear the FDA. After a decade of losses, profit turned in the Jul-Sep 2025 quarter: FY26 profit to owners was ₹213 cr and Q1FY27 ₹106 cr on 26% sales growth. Zaynich launches in India around Dec-2026/Jan-2027 and in the US in early 2027; management expects a slow first 12-18 months, a small loss and then a "hockey stick" towards US$1.5-2bn of peak sales. We forecast EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} for FY27-29E: Zaynich lowers EPS until FY29 (launch costs and amortisation). No broker standing on 30-Sep discloses a method, so we use **P/E**, the house and sector yardstick. Under the turnaround rule the window starts at the earnings break (1-Oct-2025, also the day after the Zaynich NDA was filed): Wockhardt's own forward P/E median of ${n1(OWN.med)}x × the nine pharma peers' +${FAC.pe}% move over the same window = **${peMult}x Sep-28E EPS of ₹${n1(epsSep28)}**, a target of **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The science is genuine and de-risked in two markets', p: 'Zaynich (cefepime + zidebactam) is approved by the USFDA (30-May-2026, cUTI, priority review, QIDP) and CDSCO (27-May-2026); the EMA file is under accelerated assessment. It covers carbapenem-resistant Enterobacterales and Pseudomonas, beat meropenem in phase 3, and has patent cover to 2038. Five in-house antibiotics have completed phase 3; Emrok and Miqnaf already sell in India.' },
    { h: 'But near-term earnings are the old business', p: `Excluding Zaynich, EPS would be ₹${n1(Y.exZ[0].eps)} / ${n1(Y.exZ[1].eps)} / ${n1(Y.exZ[2].eps)} in FY27-29E: launch losses and amortisation of the ₹1,055 cr capitalised Zaynich cost cut EPS by ₹${n1(-Y.zDrag[0])} and ₹${n1(-Y.zDrag[1])} in FY27-28E. The base business (UK generics, insulin, India) grows ~10% a year beyond FY27 and earns a 21-22% EBITDA margin that leaves most R&D capitalised.` },
    { h: 'A balance sheet repaired with other people\'s money', p: 'Debt fell from ₹3,582 cr (FY20) to ₹2,233 cr after an asset sale, a rights issue and two QIPs (₹2,216 cr of equity in five years); ~₹950 cr is still owed to the promoters, 18.8% of their shares are pledged, and a ₹3,000 cr fund-raise enabler went to the 2026 AGM. Three Indian plants remain on USFDA import alert since 2013-16.' },
    { h: 'Valuation: fair on the house method, rich on everything else', p: `At ₹${n0(price)} the stock trades at ${n1(peSep28)}x Sep-28E EPS. Our ${peMult}x target multiple already includes the market's pipeline premium of the past year. Every cross-check is lower: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}, and a sum of the parts (base business at the peers' ${n1(Y.peerPe)}x P/E plus a Zaynich risked NPV) ₹${n0(Y.sotpTp)}. Valuing the base business at the peers' EV/EBITDA, the price implies Zaynich peak sales of ~US$${(Y.PEAK_IMPLIED / 1000).toFixed(1)}bn, above management's US$1.5-2bn.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): Zaynich pre-launch costs, emerging-market insulin tenders, depreciation once the Zaynich intangible is capitalised.',
    'Zaynich India launch (expected Dec-2026/Jan-2027) and US launch (early 2027): hospital formulary wins, first quarterly sales, launch-cost run-rate.',
    'EMA opinion on Zaynich (management expects approval by end-2026); 7-8 emerging-market filings; any UK NHS subscription award.',
    'HAP/VAP trial start for Zaynich (label expansion); Foviscu India NDA filing (planned Q3FY27); WCK 6777 phase 2 decision.',
    'Use of the ₹3,000 cr fund-raise enabler; repayment or renewal of ~₹950 cr of promoter loans due by 20-Jun-2027.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const SQ2 = SQ.filter(q => q.ebitdaCo != null);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Quarterly profit turned in Jul-Sep 2025 and has stayed positive', unit: 'Net profit to owners (₹ crore)', x: 'Q.labels', series: [{ name: 'Net profit', ref: 'Q.pat', fmt: 'num' }], labels: 'all', highlight: 'Q2FY26', source: 'Screener.in (consolidated, after minorities)' },
      { type: 'column', title: 'Emerging markets (insulin) are the growth engine', unit: 'Emerging-market revenue (₹ crore)', x: QL, series: [{ name: 'Emerging markets', values: SQ.map(q => q.em), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company press releases (Q2FY26 derived)' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Zaynich is small until FY29E', unit: 'Revenue (₹ crore): base business vs Zaynich; FY26 actual, FY27-29E GAM', x: ['FY26', ...YRS], series: [{ name: 'Base business', values: [3373, ...baseRev.map(Math.round)], fmt: 'num' }, { name: 'Zaynich', values: [0, ...lines.zaynich.map(Math.round)], fmt: 'num' }], minLabel: 200, source: 'Company; GAM estimates' },
      { type: 'column', title: 'EPS with and without Zaynich: the new drug costs money first', unit: 'EPS (₹), GAM estimates', x: YRS, series: [{ name: 'Reported (with Zaynich)', values: F.eps.map(v => Math.round(v * 10) / 10), fmt: 'n1' }, { name: 'Without Zaynich', values: Y.exZ.map(e => Math.round(e.eps * 10) / 10), fmt: 'n1' }], labels: 'all', source: 'GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E since the earnings break: median ${n1(OWN.med)}x`, unit: 'Price ÷ next full-year EPS (x), weekly from 1-Oct-2025; FY27E/FY28E GAM', x: X.win.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.win.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: OWN.med, text: `Median ${n1(OWN.med)}x` }, { v: peMult, text: `Target ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; GAM estimates' },
      { type: 'hbar', title: 'What the price implies for Zaynich peak sales vs guidance', unit: 'Zaynich global peak sales (US$ mn)', x: ['GAM base peak', 'Management low end', 'Management high end', 'Implied by the 30-Sep price'], series: [{ name: 'Peak sales', values: [Y.PEAK_GAM, 1500, 2000, Y.PEAK_IMPLIED], fmt: 'num' }], labels: 'all', highlight: 'Implied by the 30-Sep price', source: 'Investor meet (4-Jun-2026); GAM risked NPV (valuation chapter)' },
    ] },
    { pair: [
      { type: 'column', title: 'Debt down a third since FY20; promoters still lend ~₹950 cr', unit: 'Borrowings (₹ crore)', x: ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Borrowings', values: [3582, 2674, 2198, 2184, 2356, 2021, 2233], fmt: 'num' }], labels: 'all', source: 'Screener.in; ICRA (promoter loans)' },
      { type: 'hbar', title: 'Target, cross-checks and scenarios', unit: '₹ per share', x: ['DCF', 'Bear case', 'Sum of the parts', 'EV/EBITDA', 'CMP', 'GAM target', 'Bull case'], series: [{ name: 'Value', values: [Math.round(mv('dcf').value), SC.bear.tp, Y.sotpTp, Math.round(mv('ev').value), price, V.tp, SC.bull.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM target', source: 'GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.zaynich, P3.pipeline, P3.withoutZ, P3B.regions, P3B.moat, p.financials, p.margins, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4B.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
