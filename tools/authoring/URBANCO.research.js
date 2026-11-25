// Urban Company report, part B: research chapters. This file holds the cover, the story in charts and the business chapter,
// and merges part2 (history, industry, tailwind), part3 (India services, International & Native, InstaHelp, moat),
// part4 (earnings quality, cash, ownership, governance, forecasts), part5 (street, valuation) and part6 (risks, glossary).
// Written as of 30-Sep-2026 (Q1FY27 basis). Forecast and valuation figures are live tokens.
const C = require('./URBANCO.ctx');
const { n0, n1, n2, QL, qv, A26, q1, cashNow = C.q1.cash, coreSep, impliedX, vsIssue, SO, medTp, OWN, fwdNow, sectorMs, pc1 } = C;
const P2 = require('./URBANCO.part2'), P3 = require('./URBANCO.part3'), P4 = require('./URBANCO.part4'), P5 = require('./URBANCO.part5'), P6 = require('./URBANCO.part6');
const SRC = 'Urban Company shareholders\' letters and FY26 annual report, GAM Research';
const fromHigh = (C.price / C.M.price.high52 - 1) * 100;

const cover = {
  headline: P5.headline,
  lead: `Urban Company is India's largest online home-services platform: 9.3 million customers booked beauty, cleaning and repair jobs from ~79,000 trained partners in the year to Jun-2026. The core is accelerating (India services NTV +${q1.icsNtvYoYPct}% in Q1FY27 at a ${q1.icsAePct}% margin) and International and Native are profitable or close. But InstaHelp, its on-demand house-help service, lost ₹${-q1.ihAe} cr in the quarter, twice what the core earned. The stock trades at ₹{{P.last|num}}, ${Math.round(vsIssue)}% above the ₹103 IPO price, and ~${n2(fwdNow)}x next year's core NTV against a median of ${n2(OWN.med)}x since November. Our sum of the parts gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${P5.rating}.** Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}} ({{scen.bear.upside|chg}}). The street's median target is ₹${n1(medTp).replace(/\.0$/, '')}.`,
  arguments: P5.coverArguments,
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Balance sheet', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): does India services growth hold above 25% against a tougher base, and does the InstaHelp loss stop rising?',
    'InstaHelp pricing and rivals: average order value (₹138) and loss per order (₹346); Snabbit and Pronto fund-raising.',
    'Supply: venture funds still hold ~40%; block sales by Accel, VY Capital and Bessemer have met every rally.',
    'Guidance test: group adjusted EBITDA breakeven by Q3FY28 needs the InstaHelp loss to roughly halve within 18 months.',
  ],
};

// ---------------------------------------------------------------- 1. Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Group NTV: ₹${n0(q1.ntv)} cr in Q1FY27, +${q1.ntvYoYPct}%`, unit: 'Net transaction value by quarter (₹ crore)', x: QL, series: [{ name: 'NTV', values: qv('ntv'), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'line', title: 'India services growth has accelerated for four quarters', unit: 'India services NTV growth, YoY %', x: QL, series: [{ name: 'NTV growth', values: qv('icsNtvYoYPct'), fmt: 'pct0' }], labels: 'all', source: SRC },
    ] },
    { pair: [
      { type: 'column', title: 'The core earns more each year (Q1 is the seasonal high)...', unit: 'Adjusted EBITDA excl. InstaHelp (₹ crore)', x: QL, series: [{ name: 'Core adj. EBITDA', values: qv('adjEbitdaExIH'), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: '...and InstaHelp spends more than all of it', unit: 'InstaHelp adjusted EBITDA (₹ crore)', x: QL, series: [{ name: 'InstaHelp', values: qv('ihAe'), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { pair: [
      { type: 'line', title: `Share price: +${Math.round(vsIssue)}% on the ₹103 IPO price, ${Math.abs(Math.round(fromHigh))}% off the 52-week high`, unit: '₹, daily', x: 'P.series[].0', series: [{ name: 'Price', ref: 'P.series[].1', fmt: 'num', thin: true }], labels: 'extremes', maxTicks: 6, source: 'Screener.in, NSE' },
      { type: 'line', title: `The market pays ${n2(fwdNow)}x forward core NTV; the median since November is ${n2(OWN.med)}x`, unit: 'EV ÷ next full year core NTV (x)', x: C.fwd.filter(x => x[0] >= C.FROM).map(x => x[0]), series: [{ name: 'EV/forward core NTV', values: C.fwd.filter(x => x[0] >= C.FROM).map(x => x[1]), fmt: 'n2', thin: true }], labels: 'last', maxTicks: 6, lines: [{ v: OWN.med, text: `Median ${n2(OWN.med)}x (our multiple ${SO.parts[0].mult}x, after a ${pc1(sectorMs)} sector move)` }], source: 'Screener.in prices; NTV actual and GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'Our forecast: EBITDA turns positive in FY29E', unit: 'EBITDA, Screener definition (₹ crore)', x: 'fin.labels', from: 'FY23', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
      { type: 'hbar', title: 'Sum of the parts: India services is most of the value', unit: '₹ per share', x: SO.parts.map(p => p.name), series: [{ name: '₹/share', values: SO.parts.map(p => Math.round(p.perShare * 10) / 10), fmt: 'n1' }], labels: 'all', source: 'GAM Research estimates' },
    ] },
  ],
};

// ---------------------------------------------------------------- 2. Business
const business = {
  id: 'business', nav: 'What Urban Company does', kicker: 'The business', title: 'A managed marketplace for jobs inside the home',
  blocks: [
    { p: 'Urban Company runs an app on which households book services at home: beauty and spa, cleaning and pest control, electricians, plumbers, carpenters, appliance repair and painting. It is a **full-stack** (managed) marketplace: it does not just list providers but trains them, sells them tools and consumables, sets prices, checks quality through ratings and stands behind the job. Partners are independent; Urban Company keeps a commission plus fees (its "take rate"). It also sells its own **Native** water purifiers and smart locks, runs the same model in the **UAE and Singapore** (and Saudi Arabia through a JV), and since 2025 offers **InstaHelp**, on-demand house help. Its headline measure is **NTV**, what customers pay for services and Native products.' },
    { exhibit: { type: 'table', title: 'Urban Company in FY26 and Q1FY27', head: ['Measure', 'FY26', 'Q1FY27', 'What it tells you'], wide: [3], rows: [
      ['Annual transacting users', `${A26.atuMn} mn`, `${q1.atuMn} mn`, '+21% in India services; Tier 2 cities growing fastest'],
      ['Orders', `${n1(A26.ordersMn)} mn`, `${n1(q1.ordersMn)} mn`, `+79% YoY, mostly InstaHelp (${(q1.ihOrdersK / 1000).toFixed(1)} mn)`],
      ['Group NTV (₹ cr)', n0(A26.ntv), n0(q1.ntv), `+31% in FY26; +${q1.ntvYoYPct}% in Q1`],
      ['Revenue, % of NTV', `${n1(A26.revenue / A26.ntv * 100)}%`, `${n1(q1.revenue / q1.ntv * 100)}%`, 'Commission, fees and products'],
      ['India services adj. EBITDA, % of NTV', `${n1(A26.icsAe / A26.icsNtv * 100)}%`, `${q1.icsAePct}%`, 'Rising; target 9-10%'],
      ['Group adj. EBITDA (₹ cr)', n0(A26.adjEbitda), n0(q1.adjEbitda), `Core +${q1.adjEbitdaExIH}, InstaHelp ${q1.ihAe} in Q1`],
      ['Monthly active partners', n0(A26.partners), n0(q1.partners), 'Average rating 4.79/5'],
      ['Cash (₹ cr)', n0(A26.cash), n0(q1.cash), 'No debt'],
    ], source: 'Q4FY26 and Q1FY27 shareholders\' letters' } },
    { pair: [
      { type: 'hbar', title: 'India services is three-quarters of NTV', unit: 'Q1FY27 NTV by segment (₹ crore)', x: ['India services', 'International', 'Native', 'InstaHelp'], series: [{ name: 'NTV', values: [q1.icsNtv, q1.intlNtv, q1.nativeNtv, Math.round(q1.ihNtv)], fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'waterfall', title: 'Q1FY27: from segment profit to group adjusted EBITDA', unit: '₹ crore', x: ['India services', 'International', 'Native', 'InstaHelp', 'Group'], series: [{ name: 'Bridge', values: [q1.icsAe, q1.intlAe, q1.nativeAe, q1.ihAe, q1.adjEbitda] }], fmt: 'num', totalFmt: 'num', source: SRC },
    ] },
    { exhibit: { type: 'tiles', title: 'Urban Company in numbers (Q1FY27)', tiles: [
      { k: 'Customers', v: `${q1.atuMn} mn`, d: 'annual transacting users' },
      { k: 'Partners', v: n0(q1.partners), d: 'monthly active' },
      { k: 'Cities', v: '51', d: 'India, UAE, Singapore (+ KSA JV)' },
      { k: 'Core margin', v: `${q1.icsAePct}%`, d: 'India services, % of NTV' },
      { k: 'Cash', v: `₹${n0(cashNow)} cr`, d: 'Jun-2026; no debt' },
    ], source: 'Q1FY27 shareholders\' letter' } },
    { callout: '**Two numbers matter most.** The India-services margin (adjusted EBITDA as a % of NTV) shows whether the core is turning scale into profit: 4.1% in FY26, 6.9% in Q1FY27 (seasonally strong), target 9-10%. The InstaHelp loss shows how much of that profit is being reinvested: ₹132 cr in Q1FY27. The group breaks even when the first outgrows the second.' },
  ],
};

const rating = P5.rating;
module.exports = {
  rating, cover,
  sections: p => [narrative, business, P2.history, P2.industry, P2.tailwind, P3.ics, P3.intlNative, P3.instahelp, P3.moat, p.financials, P4.earnings,
    { ...p.cash, blocks: [...p.cash.blocks, ...P4.cashBridge.blocks] }, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks(P5.rating), p.statements, P6.glossary],
  statementNotes: { ...P4.statementNotes },
};
