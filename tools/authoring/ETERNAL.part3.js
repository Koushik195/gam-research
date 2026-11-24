// Eternal report, part 3: segment chapters (food delivery, Blinkit, District / Hyperpure / new bets) and moat.
const C = require('./ETERNAL.ctx');
const { n0, n1, QL, qv, pctOf, A25, A26, q1, q1y, SW, Qs, roll } = C;
const SRC = 'Eternal shareholders\' letters, GAM Research';
const SRCX = 'Eternal and Swiggy Q1FY27 shareholders\' letters, GAM Research';
const g = (a, b) => ((a / b - 1) * 100).toFixed(0);

// ---------------------------------------------------------------- Food delivery
const food = {
  id: 'food', nav: 'Food delivery (Zomato)', kicker: 'Segment 1', title: 'Food delivery: growth re-accelerating at a 5.6% margin',
  blocks: [
    { p: `Food delivery is the profit engine. Net order value rose from ₹${n0(A25.foodNov)} cr in FY25 to ₹${n0(A26.foodNov)} cr in FY26 (+${g(A26.foodNov, A25.foodNov)}%) and adjusted EBITDA from ₹${n0(A25.foodAdjEbitda)} cr to ₹${n0(A26.foodAdjEbitda)} cr. Growth has accelerated for four straight quarters, from +13.1% in Q1FY26 to +${q1.foodNovYoYPct}% in Q1FY27 (₹${n0(q1.foodNov)} cr), driven by more customers (${q1.foodMtcMn} mn a month, up from ${q1y.foodMtcMn} mn). Margin rose to ${q1.foodAePctNov}% of NOV, near the top of management's 5-6% steady-state range. Contribution (profit after delivery costs and discounts, before fixed costs) is steady at ~10% of NOV, so the margin gain comes from spreading fixed costs over more orders.` },
    { pair: [
      { type: 'column', title: 'Food order value: growth back above 20%', unit: 'Food NOV by quarter (₹ crore)', x: QL, series: [{ name: 'Food NOV', values: qv('foodNov'), fmt: 'num' }], labels: 'ends', source: SRC },
      { type: 'line', title: 'Margin up from 3.9% to 5.6% of NOV in two years', unit: 'Food adjusted EBITDA, % of NOV', x: QL, series: [{ name: 'Margin', values: qv('foodAePctNov'), fmt: 'pct' }], labels: 'all', source: SRC },
    ] },
    { exhibit: { type: 'table', title: 'Zomato vs Swiggy in food delivery, Q1FY27', head: ['', 'Zomato (Eternal)', 'Swiggy', 'What it tells you'], wide: [3], rows: [
      ['Order value (₹ cr)', `${n0(q1.foodNov)} (NOV)`, `${n0(SW.foodGov)} (GOV)`, 'Zomato larger even on the stricter NOV measure'],
      ['Growth YoY', `+${q1.foodNovYoYPct}% (NOV)`, `+${SW.foodGovYoYPct}% (GOV)`, 'Zomato growing faster; its GOV grew "a few points" faster than NOV'],
      ['Adjusted EBITDA (₹ cr)', n0(q1.foodAdjEbitda), n0(SW.foodAdjEbitda), `Zomato ${n1(q1.foodAdjEbitda / SW.foodAdjEbitda)}x`],
      ['Margin', `${q1.foodAePctNov}% of NOV`, `${SW.foodAePctGov}% of GOV`, 'Zomato roughly 2.5pp higher'],
      ['Monthly customers (mn)', n1(q1.foodMtcMn), n1(SW.foodMtu), 'Zomato ~40% more'],
    ], source: SRCX } },
    { p: `**The new price fighters.** Swiggy launched Toing, a budget-meals app, and Rapido launched Ownly, both with lower restaurant commissions and delivery fees. Management says the impact has been "limited": the same restaurants, similar or longer delivery times and lower prices paid for by thinner economics. Its answer is Bistro (10-minute food at ₹50-150 from its own kitchens), reported under "Others". Zomato's Q1FY27 growth acceleration suggests the entrants have not dented it yet; the risk is that price-led entrants push the whole category's take rates down.` },
    { callout: `**Our view:** food delivery is a profitable, growing duopoly position in which Zomato is the clear leader. We forecast NOV growth of 20% / 18% / 17% for FY27-29E and margins of 5.6% / 5.8% / 5.9% of NOV, giving adjusted EBITDA of {{F.seg.food.adjEbitda.0|num}} / {{F.seg.food.adjEbitda.1|num}} / {{F.seg.food.adjEbitda.2|num}} cr. Margin upside is limited (management guides 5-6% steady state), so from here profit growth tracks order growth.` },
  ],
};

// ---------------------------------------------------------------- Blinkit
const blinkit = {
  id: 'blinkit', nav: 'Quick commerce (Blinkit)', kicker: 'Segment 2', title: 'Blinkit: the market leader, profitable and still growing ~86%',
  blocks: [
    { p: `Blinkit delivers groceries and household goods in about ten minutes from ${n0(q1.qcStores)} stores (Jun-2026). Order value more than doubled from ₹${n0(A25.qcNov)} cr in FY25 to ₹${n0(A26.qcNov)} cr in FY26, and reached ₹${n0(q1.qcNov)} cr in Q1FY27 (+${q1.qcNovYoYPct}% YoY, +19% QoQ). Since Q2FY26 Blinkit has owned its inventory (the 1P model, allowed once Eternal became Indian-owned and controlled), which raised gross profit to ${n1(q1.qcGrossProfit / q1.qcNov * 100)}% of NOV. Adjusted EBITDA has improved for five quarters, from −₹${-q1y.qcAdjEbitda} cr in Q1FY26 to +₹${q1.qcAdjEbitda} cr in Q1FY27 (${q1.qcAePctNov}% of NOV), while 900 stores were added in a year.` },
    { pair: [
      { type: 'column', title: 'Blinkit order value: up ~4x in two years', unit: 'Quick-commerce NOV by quarter (₹ crore)', x: QL, series: [{ name: 'NOV', values: qv('qcNov'), fmt: 'num' }], labels: 'ends', source: SRC },
      { type: 'column', title: 'Adjusted EBITDA turned positive in Q3FY26', unit: 'Quick-commerce adjusted EBITDA (₹ crore)', x: QL, series: [{ name: 'Adj. EBITDA', values: qv('qcAdjEbitda'), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { pair: [
      { type: 'line', title: 'Contribution has stepped up; EBITDA margin is following', unit: '% of NOV', x: QL, series: [{ name: 'Contribution', values: qv('qcContribPct'), fmt: 'pct' }, { name: 'Adjusted EBITDA', values: qv('qcAePctNov'), fmt: 'pct' }], labels: 'last', source: SRC },
      { type: 'column', title: 'Stores: ~200 added every quarter', unit: 'Blinkit stores, quarter end', x: QL.slice(4), series: [{ name: 'Stores', values: qv('qcStores').slice(4), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { exhibit: { type: 'table', title: 'Blinkit vs Swiggy Instamart, Q1FY27', head: ['', 'Blinkit', 'Instamart', 'What it tells you'], wide: [3], rows: [
      ['Net order value (₹ cr)', n0(q1.qcNov), n0(SW.imNov), `Blinkit ~${n1(q1.qcNov / SW.imNov)}x larger`],
      ['Growth YoY', `+${q1.qcNovYoYPct}%`, `+${SW.imNovYoYPct}%`, 'The gap is widening'],
      ['Adjusted EBITDA (₹ cr)', `+${q1.qcAdjEbitda}`, n0(SW.imAdjEbitda), 'Blinkit profitable; Instamart loses ~10% of GOV'],
      ['Stores', `${n0(q1.qcStores)} (+200 in Q1)`, `${n0(SW.imStores)}`, 'Blinkit has ~2x the network'],
      ['Inventory model', 'Owns inventory since Q2FY26', 'Approved Aug-2026; switch within 2-4 quarters', 'Blinkit about a year ahead'],
    ], source: SRCX } },
    { h: 'Management\'s steady-state economics (Q1FY27 letter)' },
    { exhibit: { type: 'table', title: 'What a mature Blinkit store is meant to earn', head: ['Item', 'Steady state (Q1FY27)', 'Earlier assumption', 'Today (Q1FY27)'], rows: [
      ['Capex per store (incl. warehousing)', '₹2.5 cr', '₹1 cr', '~₹700 cr capex for 200 stores in Q1 (lumpy warehousing)'],
      ['Net working capital', '12 days of NOV (3.3%)', '18 days (5%)', `₹2,545 cr (~14 days)`],
      ['NOV per store per day', '₹11 lakh', '₹7 lakh', `₹${(q1.qcNovPerStoreDayK / 100).toFixed(2)} lakh`],
      ['Adjusted EBITDA, % of NOV', '6%', '5-6%', `${q1.qcAePctNov}%`],
      ['EBIT, % of NOV (after ESOP, depreciation)', '4%', '4%', 'negative'],
      ['Pre-tax return on capital', '~42%', '–', 'not yet'],
    ], source: 'Eternal Q1FY27 shareholders\' letter and call (22-Jul-2026)' } },
    { p: `Two risks sit under these numbers. **Competition:** Q1FY27 was "the peak of competitive intensity" (CEO Albinder Dhindsa), with Zepto, Instamart, Flipkart Minutes, Amazon Now and BigBasket subsidising groceries and delivery fees; Blinkit says it will not match discount-led growth. **Capital intensity:** capex per store has risen to ₹2.5 cr and owning stock ties up working capital; inventory losses are ~1.8% of NOV. A 42% return on capital needs both the 6% margin and ₹11 lakh a day per store, neither achieved yet.` },
    { callout: `**Our view:** Blinkit has won the scale race and is the main reason to own Eternal. We model NOV growth of 72% / 55% / 45% (guidance: "north of 60%" a year for three years) and adjusted EBITDA margins of 1.0% / 2.5% / 3.8% of NOV, giving {{F.seg.qc.adjEbitda.0|num}} / {{F.seg.qc.adjEbitda.1|num}} / {{F.seg.qc.adjEbitda.2|num}} cr. Even our FY29E margin is well short of the 6% target. **Brutal truth:** quick commerce is a capital-hungry retail business in a seven-player market; the leader can earn good returns, but only if rivals stop subsidising, and the current share price already assumes much of that success.` },
  ],
};

// ---------------------------------------------------------------- District, Hyperpure, Others
const others = {
  id: 'others', nav: 'District, Hyperpure & new bets', kicker: 'Segments 3-5', title: 'District, Hyperpure and new bets: small, growing, and mostly loss-making',
  blocks: [
    { exhibit: { type: 'table', title: 'Smaller segments by quarter (₹ crore)', head: ['', ...QL.slice(-5)], rows: [
      ['Going-out NOV', ...Qs.slice(-5).map(q => n0(q.goNov))],
      ['Going-out adjusted EBITDA', ...Qs.slice(-5).map(q => n0(q.goAdjEbitda))],
      ['Hyperpure revenue', ...Qs.slice(-5).map(q => n0(q.hpRev))],
      ['Hyperpure adjusted EBITDA', ...Qs.slice(-5).map(q => n0(q.hpAdjEbitda))],
      ['Others revenue (Bistro, Nugget)', ...Qs.slice(-5).map(q => n0(q.othRev))],
      ['Others adjusted EBITDA', ...Qs.slice(-5).map(q => n0(q.othAdjEbitda))],
    ], source: SRC } },
    { bullets: [
      `**Going-out (District):** movie and event tickets, table bookings and dining payments, enlarged by the Paytm ticketing purchase (Aug-2024). NOV ₹${n0(A26.goNov)} cr in FY26 and ₹${n0(q1.goNov)} cr in Q1FY27 (+${q1.goNovYoYPct}%); losses narrowed to ${q1.goAePctNov}% of NOV. Management targets US$3bn of NOV by FY30. We assume breakeven during FY29E and value it at {{dcf.sotp.parts.2.value|num}} cr.`,
      `**B2B supplies (Hyperpure):** ingredients and supplies for restaurants. Revenue fell from ₹${n0(q1y.hpRev)} cr in Q1FY26 to ~₹1,000 cr a quarter once quick-commerce sellers' supplies moved inside Blinkit; the restaurant business grew 27% like-for-like in Q1FY27 at a 0.6% margin. Low-margin distribution; we value it at {{dcf.sotp.parts.3.value|num}} cr.`,
      `**Others (Bistro, Nugget):** losses rose from ₹${-q1y.othAdjEbitda} cr in Q1FY26 to ₹${-q1.othAdjEbitda} cr in Q1FY27, mostly R&D at Nugget and kitchen build-out at Bistro. Management calls it "the cost of experimentation" and says it will shut what does not work. We deduct three years of FY28E losses ({{dcf.sotp.parts.4.value|num}} cr).`,
    ] },
  ],
};

// ---------------------------------------------------------------- Moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: scale leadership in both big markets',
  blocks: [
    { verdicts: [
      ['Food-delivery network', 'Advantage', `${q1.foodMtcMn} mn monthly customers, ${n0(q1.foodRestK * 1000)} restaurants, ${n0(q1.foodRidersK * 1000)} delivery partners; one of two national networks and the larger one.`, 'Pricing power: 5.6% margin vs Swiggy 3.1%.'],
      ['Quick-commerce scale and density', 'Advantage', `${n0(q1.qcStores)} stores; NOV ~${n1(q1.qcNov / SW.imNov)}x Instamart's; profitable while rivals lose 10%+ of order value.`, 'Scale lowers cost per order; the leader can out-invest rivals.'],
      ['Supply chain and inventory (1P)', 'Advantage', 'Owns stock since Q2FY26 with a warehouse network (~19 mn sq ft); rivals are only now converting.', 'Better margins and assortment; but capital-hungry.'],
      ['Customer loyalty', 'Parity', 'Blinkit cohorts: 46-50% still order four quarters later and spend ~3x after three years; but switching apps costs a customer nothing.', 'Habit, not lock-in.'],
      ['Price-led competition (Toing, Ownly, Zepto, Amazon, Flipkart)', 'Threat', 'Well-funded rivals subsidise groceries and delivery fees; Q1FY27 was the peak so far.', 'Caps how fast margins can rise.'],
      ['Balance sheet', 'Advantage', `₹${n0(C.cashNow)} cr of cash (Jun-2026), no debt other than leases.`, 'Can fund store growth from profits and cash.'],
    ], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: SRCX },
    { callout: '**Honest verdict:** Eternal has a **real scale advantage** in both its big markets: it is the larger, more profitable food-delivery network, and Blinkit has won the quick-commerce scale race (profitable while every rival loses money). That is a moat of scale and density, not of lock-in: customers can switch apps in seconds, and deep-pocketed rivals (Amazon, Flipkart, Reliance) can keep subsidising. The advantage is durable as long as Eternal keeps investing, which is why margins will rise more slowly than the order value.' },
  ],
};

module.exports = { food, blinkit, others, moat };
