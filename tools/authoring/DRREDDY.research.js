// Dr. Reddy's report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, North America, semaglutide, biosimilars and FDA, branded markets, Europe/NRT/consumer, PSAI, moat,
// margins and earnings quality, ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes).
// Shared inputs in DRREDDY.ctx.js; forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
// As of 30-Sep-2026.
const X = require('./DRREDDY.ctx');
const { M, F, V, A, SA, SQ, QL, BL, n0, n1, pc, price, mv, HA, FM, MULT, epsSep, rating, postQ1, medTp, tpLo, tpHi, UE, Q1, peSep, peFY28, avgEps, fwdAdj, SEMA_AT } = X;
const P2 = require('./DRREDDY.part2'), P3 = require('./DRREDDY.part3'), P3b = require('./DRREDDY.part3b'), P4 = require('./DRREDDY.part4'), P5 = require('./DRREDDY.part5'), P5b = require('./DRREDDY.part5b'), P6 = require('./DRREDDY.part6');
const q = Q1.ifrs;

const cover = {
  headline: 'The gRevlimid years are over; semaglutide and abatacept are late, and the price already allows for both',
  lead: `Dr. Reddy's is a ₹34,000 cr generics company that is half branded (India, Russia and emerging markets, Nicotinell) and half unbranded (US and European generics, APIs). FY23-FY25 were windfall years: generic Revlimid lifted EBITDA margins to 26-28% and EPS to ₹68. The windfall ended in Jan-2026: Q4FY26 EPS was ₹2.6 and Q1FY27 ₹5.3, after a ₹240 cr provision when the semaglutide API failed validation at scale and supplies stopped until ~Nov-2026. The street values Dr. Reddy's on **P/E on one-year-forward EPS (20-23x FY28E)**. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, below the street on margins. Dr. Reddy's own forward P/E since Apr-2021 has a median of ${n1(HA.med)}x on EPS before one-offs; times the pharma sector factor (+8.2%) that gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}})**. **We initiate with ${rating}.** Cross-checks agree within ±15% (EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}). Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'North America has fallen off the cliff and is not growing underneath', p: `US$ sales went from US$400 mn in Q1FY26 to US$${q.naUsdMn} mn in Q1FY27 as lenalidomide went generic. The base left behind (~US$950 mn a year) is about where it was in FY22 despite ~100 launches; the CEO concedes R&D misses in complex generics. Bosutinib and sugammadex (first to market in 2026) help FY27; after that, growth needs semaglutide in Canada and abatacept. We model US${BL.naUsdMn.map(n0).join(' / ')} mn for FY27-29E.` },
    { h: 'The branded half is good and growing', p: 'India grew 17% in Q1FY27 (15.5% organic) against a market growing 13.5%; emerging markets +31% (Russia +28%, Rest of World +42%); Nicotinell (bought from Haleon for GBP458 mn) grows high single digit to low double digit. These businesses were 52% of Q1FY27 revenue and carry the margin today.' },
    { h: 'Two big launches, both delayed once already', p: `Semaglutide: first to market in India and Canada, then an API scale-up failure in Jul-2026; 6-7 mn pens promised for Nov-26 to Mar-27 (was 10-11 mn). Abatacept (biosimilar Orencia): goal date mid-Dec-2026; the biologics plant passed muster for rituximab in Aug-2026. We include ~₹${n0(BL.memo.semaglutideRs[0])} cr of semaglutide in FY27E and US$${BL.memo.abataceptUsdMn[1]} mn of abatacept in FY28E: real, but below management's plan.` },
    { h: 'Valuation: fair on the street\'s own method', p: `At ₹${n0(price)} the stock trades at ${n1(peFY28)}x our FY28E EPS and ${n1(peSep)}x Sep-28E, against a ${n1(HA.med)}x median since 2021 (25th-75th percentile ${n1(HA.p25)}-${n1(HA.p75)}x). The post-Q1 street median target is ₹${n0(medTp)} (range ₹${n0(tpLo)}-${n0(tpHi)}). Our ${MULT.base}x is in the middle of the street's 20-23x; the debate is earnings, not the multiple.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Semaglutide re-validation result (management targeted around 22-23 Sep-2026) and the restart of commercial supplies via OneSource from Oct, pens to market from Nov-2026; Brazil approval (expected "in the next few weeks" in Jul-2026).',
    'Q2FY27 results (due by mid-November 2026; the company\'s calendar says the fourth week of October): the first quarter with bosutinib exclusivity and sugammadex, and the base margin without semaglutide ("neighbourhood of 20%" IFRS guided).',
    'Abatacept IV: US FDA goal date mid-December 2026; response to the Bachupally Form 483; EU IV filing; SC filing in the US.',
    'Use of the ~₹3,000 cr net cash: management is "engaging" on deals in generics, innovation and biosimilars.',
    'US tariff on generics (announced 22-Jul-2026) and USFDA follow-up at Srikakulam (Form 483, 3 observations, Jul-2026).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const epsRep = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => A.eps[A.labels.indexOf(l)]);
const epsUnd = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => UE[l]);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'North America: US$400 mn a quarter in Q1FY26, US$236 mn in Q1FY27', unit: 'North America revenue (US$ mn a quarter; Q4FY26 after the ~US$50 mn SSA)', x: QL, series: [{ name: 'North America', values: SQ.map(s => s.naUsd), fmt: 'num' }], labels: 'all', source: 'Company calls; Q1FY26 implied from the -41% YoY in Q1FY27' },
      { type: 'stacked', title: 'The mix: North America 45% of FY25 revenue, 34% of FY26', unit: 'Revenue by market (₹ crore, IFRS)', x: SA.map(a => a.fy), series: [{ name: 'North America', values: SA.map(a => a.na), fmt: 'num' }, { name: 'Emerging Markets', values: SA.map(a => a.em), fmt: 'num' }, { name: 'India', values: SA.map(a => a.india), fmt: 'num' }, { name: 'Europe', values: SA.map(a => a.europe), fmt: 'num' }], minLabel: 2500, source: 'Annual reports FY22, FY24, FY26' },
    ] },
    { pair: [
      { type: 'line', title: 'Margins halved in two quarters', unit: 'IFRS EBITDA margin (%): reported vs before specific items', x: QL, series: [{ name: 'Reported', values: SQ.map(s => s.ebitdaMarginPct), fmt: 'pct' }, { name: 'Before specific items', values: SQ.map(s => s.ebitdaAdjPct ?? s.ebitdaMarginPct), fmt: 'pct' }], labels: 'all', min: 5, max: 30, source: 'Company releases and presentations' },
      { type: 'column', title: 'EPS before one-offs: ₹67 at the FY25 peak, ~₹38 in FY27E', unit: 'EPS (₹): reported vs before one-off items', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Reported', values: [...epsRep, ...F.eps], fmt: 'n1' }, { name: 'Before one-offs', values: [...epsUnd, F.eps[0] + SEMA_AT, F.eps[1], F.eps[2]], fmt: 'n1' }], labels: 'none', source: 'Screener.in; MOSL adjusted EPS (23-Jul-2026); GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'India and emerging markets kept growing through the cliff', unit: 'India + Emerging Markets revenue (₹ crore a quarter, IFRS)', x: QL, series: [{ name: 'India + EM', values: SQ.map(s => Math.round(s.india + s.em)), fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation' },
      { type: 'column', title: 'Semaglutide pens guided for FY27: 12 mn in May, 6-7 mn in July; we assume ~5 mn', unit: 'Semaglutide pens for FY27 (mn)', x: ['May guide', 'Jul guide', 'Q1 sold', 'GAM FY27E'], series: [{ name: 'Pens (mn)', values: [12, 6.5, 0.18, 5], fmt: 'n1' }], labels: 'all', source: 'Q4FY26 call; semaglutide update and Q1FY27 calls; GAM estimate' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${Math.round(peSep)}x Sep-28E now vs a ${n1(HA.med)}x median since 2021`, unit: 'Price ÷ next full-year EPS before one-offs (x)', x: fwdAdj.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdAdj.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HA.med, text: `Median: ${n1(HA.med)}x` }], source: 'Screener.in prices; MOSL adjusted EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q1 targets)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker.replace(' (ICICI Securities retail)', '')), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes and press reports 23-24 Jul-2026 (median ₹${n0(medTp)}), GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.us, P3.sema, P3.bio, P3b.branded, P3b.consumer, P3b.psai, P3b.moat, p.financials, P4.margins, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P5b.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
