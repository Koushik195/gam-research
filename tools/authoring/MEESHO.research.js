// Meesho report, part B: research chapters. This file holds the cover, the story in charts and the business chapter,
// and merges part2 (history, industry, tailwind), part3 (marketplace economics, logistics & ads, new initiatives, moat),
// part4 (earnings quality, cash, ownership, governance, forecasts), part5 (street, valuation) and part6 (risks, glossary).
// Written as of 30-Sep-2026 (Q1FY27 basis). Forecast and valuation figures are live tokens.
const C = require('./MEESHO.ctx');
const { n0, n1, QL, qv, A26, q1, q1y, mcap, cashNow, nmvSep, impliedX, fromHigh, vsIssue, D, V, SO, medTp } = C;
const P2 = require('./MEESHO.part2'), P3 = require('./MEESHO.part3'), P4 = require('./MEESHO.part4'), P5 = require('./MEESHO.part5'), P6 = require('./MEESHO.part6');
const SRC = 'Meesho shareholders\' letters and FY26 annual report, GAM Research';
const ST = D.street;

const cover = {
  headline: P5.headline,
  lead: `Meesho is India's largest e-commerce platform by buyers and orders: 274 million people bought on it in the year to Jun-2026, mostly outside the big cities, from ~1 million small sellers who pay no commission. Order value delivered (NMV) grew 34% in Q1FY27 to ₹${n0(q1.nmv)} cr and the marketplace loss narrowed to 1.2% of NMV. The stock has doubled from ₹111 at the Dec-2025 IPO to ₹{{P.last|num}} and trades at ~${C.n2(C.fwdNow)}x next year's NMV, against a median of ${C.n2(C.OWN.med)}x since January. Our sum of the parts gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${P5.rating}.** Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}} ({{scen.bear.upside|chg}}). The street's median target is ₹${medTp}.`,
  arguments: P5.coverArguments,
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Balance sheet', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): NMV growth will look soft because the big sale moved into Q3, and growth spending rises; the test is Q2 and Q3 together.',
    'Contribution margin: can it keep rising from 4.6% of NMV as ads grow, while logistics savings are passed on to buyers?',
    'Supply: venture investors still hold ~40% after the Jun-2026 lock-in expiry; block sales have continued every month.',
    'GST on Valmo\'s freight (InGovern letter to SEBI, Jul-2026) and ₹2,072 cr of contested income-tax demands.',
  ],
};

// ---------------------------------------------------------------- 1. Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Order value delivered: ₹${n0(q1.nmv)} cr in Q1FY27, +${q1.nmvYoYPct}%`, unit: 'Net merchandise value (NMV) by quarter (₹ crore)', x: QL, series: [{ name: 'NMV', values: qv('nmv'), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'line', title: 'Contribution margin is back above 4% after the Valmo dip', unit: '% of NMV', x: QL, series: [{ name: 'Contribution margin', values: qv('cmPct'), fmt: 'pct' }, { name: 'Marketplace adj. EBITDA', values: qv('mpAePct'), fmt: 'pct' }], labels: 'all', source: SRC },
    ] },
    { pair: [
      { type: 'column', title: 'Buyers: 274 million a year, +29%', unit: 'Annual transacting users (million, last twelve months)', x: QL, series: [{ name: 'Users', values: qv('atuMn'), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'Free cash flow turned negative in FY26 and is recovering', unit: 'Free cash flow, last twelve months (₹ crore)', x: QL, series: [{ name: 'LTM FCF', values: qv('ltmFcf'), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { pair: [
      { type: 'line', title: `Share price: ${vsIssue >= 0 ? '+' : ''}${Math.round(vsIssue)}% since the ₹111 IPO, ${Math.abs(Math.round(fromHigh))}% off the high`, unit: '₹, daily', x: 'P.series[].0', series: [{ name: 'Price', ref: 'P.series[].1', fmt: 'num', thin: true }], labels: 'extremes', maxTicks: 6, source: 'Screener.in, NSE' },
      { type: 'line', title: `The market now pays ${C.n2(C.fwdNow)}x forward NMV; the median since January is ${C.n2(C.OWN.med)}x`, unit: 'EV ÷ next full year NMV (x)', x: C.fwd.filter(x => x[0] >= C.FROM).map(x => x[0]), series: [{ name: 'EV/forward NMV', values: C.fwd.filter(x => x[0] >= C.FROM).map(x => x[1]), fmt: 'n2', thin: true }], labels: 'last', maxTicks: 6, lines: [{ v: C.OWN.med, text: `Median ${C.n2(C.OWN.med)}x (our multiple ${SO.parts[0].mult}x)` }], source: 'Screener.in prices; NMV actual and GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'Our forecast: EBITDA turns positive in FY29E', unit: 'Reported EBITDA (₹ crore)', x: 'fin.labels', from: 'FY23', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
      { type: 'hbar', title: 'Sum of the parts: the marketplace is all of the value', unit: '₹ per share', x: SO.parts.filter(p => Math.abs(p.perShare) >= 0.05).map(p => p.name), series: [{ name: '₹/share', values: SO.parts.filter(p => Math.abs(p.perShare) >= 0.05).map(p => Math.round(p.perShare * 10) / 10), fmt: 'n1' }], labels: 'all', source: 'GAM Research estimates' },
    ] },
  ],
};

// ---------------------------------------------------------------- 2. Business
const business = {
  id: 'business', nav: 'What Meesho does', kicker: 'The business', title: 'A zero-commission marketplace for Bharat, paid for by delivery fees and ads',
  blocks: [
    { p: 'Meesho runs an online marketplace where small sellers (mostly unbranded apparel, home, kitchen and beauty products) sell to price-conscious buyers, most of them outside India\'s big cities. Sellers pay **no commission**. Meesho earns instead from (1) **fulfilment fees**: sellers pay for delivery, which Meesho arranges through **Valmo**, its own logistics platform that pools thousands of small truckers, sorting centres and couriers, or through third-party couriers; (2) **advertising**: sellers pay to rank higher in search and feeds (about two-thirds of sellers by GMV advertise); and (3) platform and other fees. Its headline measure is **NMV**, the value of orders actually delivered and kept, after discounts.' },
    { exhibit: { type: 'table', title: 'Meesho in FY26 and Q1FY27', head: ['Measure', 'FY26', 'Q1FY27', 'What it tells you'], wide: [3], rows: [
      ['Annual transacting users', `${A26.atuMn} mn`, `${q1.atuMn} mn`, 'More buyers than any Indian e-commerce app'],
      ['Placed orders', `${n0(A26.ordersMn)} mn`, `${q1.ordersMn} mn`, `~${n1(q1.freq)} orders per buyer a year`],
      ['NMV (₹ cr)', n0(A26.nmv), n0(q1.nmv), `+${Math.round((A26.nmv / C.A25.nmv - 1) * 100)}% in FY26; +${q1.nmvYoYPct}% in Q1`],
      ['Revenue, % of NMV', `${n1(A26.mpRev / A26.nmv * 100)}%`, `${n1(q1.mpRev / q1.nmv * 100)}%`, 'Fees and ads; no commission'],
      ['Contribution margin, % of NMV', `${A26.cmPct}%`, `${q1.cmPct}%`, 'Profit per order before fixed costs'],
      ['Marketplace adj. EBITDA, % of NMV', `${n1(A26.mpAdjEbitda / A26.nmv * 100)}%`, `${q1.mpAePct}%`, 'Still a loss, narrowing'],
      ['Cash balance (₹ cr)', n0(A26.cash), n0(q1.cash), 'No debt'],
    ], source: 'FY26 annual report, Q1FY27 shareholders\' letter' } },
    { pair: [
      { type: 'waterfall', title: `Q1FY27: from marketplace revenue to adjusted EBITDA`, unit: '₹ crore', x: ['Revenue', 'Order-linked costs', 'Contribution', 'Growth spend', 'Server & software', 'Other fixed costs', 'Adj. EBITDA'], series: [{ name: 'Bridge', values: [q1.mpRev, q1.cm - q1.mpRev, q1.cm, -Math.round(q1.growthSpendPct / 100 * q1.nmv), -Math.round(q1.serverPct / 100 * q1.nmv), q1.mpAdjEbitda - q1.cm + Math.round(q1.growthSpendPct / 100 * q1.nmv) + Math.round(q1.serverPct / 100 * q1.nmv), q1.mpAdjEbitda] }], fmt: 'num', totalFmt: 'num', source: 'Q1FY27 letter (costs given as % of NMV; GAM arithmetic)' },
      { type: 'hbar', title: 'Prepaid orders, Mall and creators: the newer growth lines', unit: 'Q1FY27 (% or YoY growth %)', x: ['Prepaid share of orders', 'Meesho Mall NMV growth', 'Content-commerce NMV growth', 'Seller growth'], series: [{ name: 'Q1FY27', values: [q1.prepaidPct, q1.mallNmvYoYPct, q1.contentNmvYoYPct, q1.atsYoYPct], fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 shareholders\' letter' },
    ] },
    { exhibit: { type: 'tiles', title: 'Meesho in numbers (Q1FY27)', tiles: [
      { k: 'Buyers', v: `${q1.atuMn} mn`, d: 'annual transacting users, +29%' },
      { k: 'Sellers', v: `${q1.atsMn} mn`, d: `+${q1.atsYoYPct}%; 45% from Tier 2 towns and smaller` },
      { k: 'Orders', v: `${q1.ordersMn} mn`, d: 'in the quarter; AOV ~₹265 and falling by design' },
      { k: 'Meesho Mall', v: '~1,200 brands', d: `NMV +${q1.mallNmvYoYPct}%` },
      { k: 'Cash', v: `₹${n0(cashNow)} cr`, d: 'Jun-2026; no debt' },
    ], source: 'Q1FY27 shareholders\' letter; AOV from Macquarie (Jun-2026)' } },
    { callout: '**Two numbers matter most.** Contribution margin (what is left from revenue after delivery, payments and order-handling costs) shows whether each order makes money: 4.6% of NMV in Q1FY27. Below it sit costs that do not scale with orders (marketing 2.1% of NMV, servers 1.9%, staff and other 1.7%). The business breaks even when contribution margin exceeds those costs; in Q1FY27 the gap was 1.2% of NMV.' },
  ],
};

const rating = P5.rating;
module.exports = {
  rating, cover,
  sections: p => [narrative, business, P2.history, P2.industry, P2.tailwind, P3.economics, P3.logistics, P3.newBets, P3.moat, p.financials, P4.earnings,
    { ...p.cash, blocks: [...p.cash.blocks, ...P4.cashBridge.blocks] }, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks(P5.rating), p.statements, P6.glossary],
  statementNotes: { ...P4.statementNotes },
};
