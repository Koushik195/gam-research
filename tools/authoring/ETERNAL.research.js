// Eternal report, part B: research chapters. This file holds the cover, the story in charts and the
// business chapter, and merges part2 (history, industry, tailwind), part3 (segments, moat), part4
// (earnings quality, cash, ownership, governance, forecasts) and part5 (street, valuation, risks, glossary).
// Written as of 30-Sep-2026 (Q1FY27 basis). Forecast and valuation figures are live tokens.
const C = require('./ETERNAL.ctx');
const { n0, n1, QL, qv, A26, q1, q1y, SW, mcap, cashNow, PQ, PF, impliedQc, impliedQcX, fromHigh, D, V } = C;
const P2 = require('./ETERNAL.part2'), P3 = require('./ETERNAL.part3'), P4 = require('./ETERNAL.part4'), P5 = require('./ETERNAL.part5'), P6 = require('./ETERNAL.part6');
const SRC = 'Eternal shareholders\' letters, GAM Research';
const ST = D.street;

const cover = {
  headline: P5.headline,
  lead: `Eternal owns India's #1 food-delivery app (Zomato), the #1 quick-commerce network (Blinkit), a going-out app (District) and a restaurant-supplies business (Hyperpure). At ₹{{P.last|num}} the stock is ${Math.abs(Math.round(fromHigh))}% below its 52-week high. Q1FY27 was strong: B2C order value +54%, food-delivery margin 5.6% of order value, and Blinkit profitable for a third quarter while adding 200 stores. But at a market value of ~₹${n0(mcap)} cr the market already pays for most of the quick-commerce plan: valuing the other parts as we do, the price implies ~${n1(impliedQcX)}x Blinkit's Sep-28E order value. Our sum of the parts gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${P5.rating}.** Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}} ({{scen.bear.upside|chg}}).`,
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
    'Q2FY27 results (due by mid-November 2026): Blinkit order growth after Q1\'s +19% QoQ, and whether its margin keeps rising while competitors subsidise grocery.',
    'Food delivery: does NOV growth hold at ~20% against Swiggy\'s Toing and Rapido\'s Ownly price-led entries?',
    'District: losses narrowing toward breakeven while order value grows 50%+.',
    'Tax: the parent\'s carried-forward losses run out in FY27, so the tax rate stays high until Blinkit\'s profits can be sheltered.',
  ],
};

// ---------------------------------------------------------------- 1. Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Order value: up 54% in a year, Blinkit now the biggest part', unit: 'B2C net order value by quarter (₹ crore)', x: QL, series: [{ name: 'Food delivery', values: qv('foodNov'), fmt: 'num' }, { name: 'Quick commerce', values: qv('qcNov'), fmt: 'num' }, { name: 'Going-out', values: qv('goNov'), fmt: 'num' }], stacked: true, labels: 'ends', source: SRC },
      { type: 'column', title: 'Adjusted EBITDA: food earns it, Blinkit has turned positive', unit: 'Adjusted EBITDA by quarter (₹ crore)', x: QL, series: [{ name: 'Food delivery', values: qv('foodAdjEbitda'), fmt: 'num' }, { name: 'Quick commerce', values: qv('qcAdjEbitda'), fmt: 'num' }], labels: 'ends', source: SRC },
    ] },
    { pair: [
      { type: 'hbar', title: 'Quick commerce, Q1FY27: Blinkit ~3x Instamart, and profitable', unit: 'Net order value (₹ crore)', x: ['Blinkit (Eternal)', 'Instamart (Swiggy)'], series: [{ name: 'NOV', values: [q1.qcNov, SW.imNov], fmt: 'num' }], labels: 'all', highlight: 'Blinkit (Eternal)', source: 'Eternal and Swiggy Q1FY27 letters' },
      { type: 'hbar', title: 'Food delivery, Q1FY27: Zomato earns ~2x Swiggy\'s profit', unit: 'Adjusted EBITDA (₹ crore)', x: ['Zomato (Eternal)', 'Swiggy food'], series: [{ name: 'Adj. EBITDA', values: [q1.foodAdjEbitda, SW.foodAdjEbitda], fmt: 'num' }], labels: 'all', highlight: 'Zomato (Eternal)', source: 'Eternal and Swiggy Q1FY27 letters' },
    ] },
    { pair: [
      { type: 'line', title: `Share price: ${Math.abs(Math.round(fromHigh))}% below the 52-week high`, unit: '₹, weekly', x: 'P.series[].0', series: [{ name: 'Price', ref: 'P.series[].1', fmt: 'num', thin: true }], labels: 'extremes', yearTicks: true, yearStep: 1, source: 'Screener.in, NSE' },
      { type: 'column', title: 'Cash steady at ~₹18,000 cr: the business funds its own build-out', unit: 'Cash balance, quarter end (₹ crore)', x: QL.slice(4), series: [{ name: 'Cash', values: qv('cash').slice(4), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { pair: [
      { type: 'column', title: 'Our forecast: EBITDA rises ~4x by FY29E', unit: 'Reported EBITDA (₹ crore)', x: 'fin.labels', from: 'FY22', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
      { type: 'hbar', title: 'Sum of the parts: Blinkit and food are ~90% of the value', unit: '₹ per share', x: C.S.parts.map(p => p.name.replace(/ \(.*\)/, '').replace(/ at end-FY27E.*/, '')), series: [{ name: '₹/share', values: C.S.parts.map(p => Math.round(p.perShare)), fmt: 'num' }], labels: 'all', source: 'GAM Research estimates' },
    ] },
  ],
};

// ---------------------------------------------------------------- 2. Business
const pctN = (a, b) => (a / b * 100).toFixed(1) + '%';
const business = {
  id: 'business', nav: 'What Eternal does', kicker: 'The business', title: 'Four businesses on one delivery network',
  blocks: [
    { p: 'Eternal (called Zomato until 2025) runs consumer apps that connect customers with restaurants, stores and events, and delivers the order, usually in 10-30 minutes. Its headline measure is **net order value (NOV)**: the value of orders after discounts. In food delivery and going-out it earns a **take rate** (commissions, customer fees and advertising). In quick commerce it now buys and sells the goods itself (the **inventory or "1P" model**), so revenue there is close to the full sale value and margin is best read as a share of order value.' },
    { exhibit: { type: 'table', title: 'The businesses in FY26', head: ['Business', 'What it is', 'NOV (₹ cr)', 'Adj. revenue (₹ cr)', 'Adj. EBITDA (₹ cr)', 'Margin, % of NOV'], wide: [1], rows: [
      ['**Food delivery (Zomato)**', 'Restaurant delivery; the original business', n0(A26.foodNov), n0(A26.foodRev), n0(A26.foodAdjEbitda), pctN(A26.foodAdjEbitda, A26.foodNov)],
      ['**Quick commerce (Blinkit)**', 'Groceries and household goods in ~10 minutes from 2,243 stores (Mar-26); owns its inventory', n0(A26.qcNov), n0(A26.qcRev), n0(A26.qcAdjEbitda), pctN(A26.qcAdjEbitda, A26.qcNov)],
      ['**Going-out (District)**', 'Restaurant bookings, movie and event tickets', n0(A26.goNov), n0(A26.goRev), n0(A26.goAdjEbitda), pctN(A26.goAdjEbitda, A26.goNov)],
      ['**B2B supplies (Hyperpure)**', 'Supplies ingredients and goods to restaurants', '–', n0(A26.hpRev), n0(A26.hpAdjEbitda), '–'],
      ['**Others**', 'New bets: Bistro (10-minute food), Nugget (AI customer support)', '–', n0(A26.othRev), n0(A26.othAdjEbitda), '–'],
      { hl: true, cells: ['**Total**', '', n0(A26.b2cNov), n0(A26.adjRevenue), n0(A26.adjEbitda), pctN(A26.adjEbitda, A26.b2cNov)] },
    ], source: 'Eternal shareholders\' letters (sum of FY26 quarters)' } },
    { pair: [
      { type: 'hbar', title: 'Order value: Blinkit overtook food in FY26', unit: 'NOV, FY26 (₹ crore)', x: ['Quick commerce', 'Food delivery', 'Going-out'], series: [{ name: 'NOV', values: [A26.qcNov, A26.foodNov, A26.goNov], fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'hbar', title: 'Profit: food delivery earns all of it (FY26)', unit: 'Adjusted EBITDA, FY26 (₹ crore)', x: ['Food delivery', 'B2B supplies', 'Others', 'Quick commerce', 'Going-out'], series: [{ name: 'Adj. EBITDA', values: [A26.foodAdjEbitda, A26.hpAdjEbitda, A26.othAdjEbitda, A26.qcAdjEbitda, A26.goAdjEbitda], fmt: 'num' }], labels: 'all', highlight: 'Food delivery', source: SRC },
    ] },
    { exhibit: { type: 'tiles', title: 'Eternal in numbers (Q1FY27)', tiles: [
      { k: 'Food customers', v: `${q1.foodMtcMn} mn`, d: 'average monthly transacting' },
      { k: 'Blinkit customers', v: `${q1.qcMtcMn} mn`, d: `${n1(q1.qcOrdersMn)} mn orders in the quarter` },
      { k: 'Blinkit stores', v: n0(q1.qcStores), d: `+200 in Q1; ₹${(q1.qcNovPerStoreDayK / 100).toFixed(2)} lakh NOV per store a day` },
      { k: 'Delivery partners', v: `${n0(q1.foodRidersK)}k food`, d: `${n0(q1.qcRidersK)}k Blinkit (monthly active)` },
      { k: 'Cash balance', v: `₹${n0(cashNow)} cr`, d: 'Jun-2026; no debt besides leases' },
    ], source: 'Eternal Q1FY27 shareholders\' letter' } },
    { callout: `**Why "adjusted" EBITDA?** Eternal's segment profit (adjusted EBITDA) leaves out ESOP cost and counts rent as an operating cost. Reported EBITDA does the reverse on rent (Ind AS 116 moves it below EBITDA). In FY26 adjusted EBITDA was ₹${n0(A26.adjEbitda)} cr and reported EBITDA ₹${n0(A26.ebitda)} cr: ESOP cost of ₹${n0(A26.esop)} cr was roughly offset by rent of ₹${n0(A26.rent)} cr. The earnings-quality chapter walks through the bridge.` },
  ],
};

const rating = P5.rating;
module.exports = {
  rating, cover,
  sections: p => [narrative, business, P2.history, P2.industry, P2.tailwind, P3.food, P3.blinkit, P3.others, P3.moat, p.financials, P4.earnings,
    { ...p.cash, blocks: [...p.cash.blocks, ...P4.cashBridge.blocks] }, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks(P5.rating), p.statements, P6.glossary],
  statementNotes: { ...P4.statementNotes },
};
