// Eternal report, part 2: history & corporate actions, industry & competition, tailwind test.
const C = require('./ETERNAL.ctx');
const { n0, n1, A25, A26, q1, SW, D, SG } = C;
const IV = D.industryView;
const ann = SG.annual;

// ---------------------------------------------------------------- History
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From restaurant listings to a quick-commerce leader in five deals',
  blocks: [
    { p: 'Zomato began in 2008 as a restaurant-listings site (Foodiebay) and later built food delivery on top of it. Five corporate actions made the company you buy today: the Uber Eats India deal (2020) that left a two-player food market; the 2021 IPO that built the cash pile; the Blinkit purchase (2022) that created the quick-commerce business, now the largest part of the value; the Paytm ticketing deal (2024) behind District; and the 2025 cap on foreign ownership that let Blinkit own its inventory. Each changed the numbers, as the table shows.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: D.historyRows, source: D.historySource } },
    { pair: [
      { type: 'column', title: 'Consolidated adjusted EBITDA: losses to profit in three years', unit: 'Adjusted EBITDA (₹ crore)', x: ann.map(a => a.fy), series: [{ name: 'Adj. EBITDA', values: ann.map(a => a.adjEbitda), fmt: 'num' }], labels: 'all', source: 'Eternal Q4 letters (FY22 before the rent deduction), sum of quarters FY25-26' },
      { type: 'column', title: 'Blinkit stores: from 377 to 2,443 in three years', unit: 'Stores at year end (Q1FY27 = Jun-26)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Stores', values: [...ann.filter(a => a.qcStores).map(a => a.qcStores), q1.qcStores], fmt: 'num' }], labels: 'all', source: 'Eternal shareholders\' letters' },
    ] },
    { h: 'Capital raised and what it cost shareholders' },
    { exhibit: { type: 'table', title: 'Corporate actions', head: ['Action', 'Date', 'Amount (₹ cr)', 'Effect on shareholders'], wide: [3], rows: [
      ['IPO at ₹76', 'Jul-2021', '9,375 (9,000 fresh)', 'Funded the losses of FY22-23 and most of today\'s cash.'],
      ['Blinkit acquisition (in shares)', 'Jun-Aug 2022', '~4,447', `62.9 cr new shares at ~₹70.8. Bought at the bottom of the cycle: Blinkit is now worth ~₹${n0(C.PQ.value)} cr in our SOTP.`],
      ['Paytm ticketing (cash)', 'Aug-2024', '2,048', 'Created the going-out business (District); still loss-making.'],
      ['QIP at ₹252.62', 'Nov-2024', '8,500', '33.6 cr new shares (~3.5% dilution); funded Blinkit\'s stores and inventory.'],
      ['Shares issued to the ESOP trust', 'FY25', '–', '47.8 cr shares (incl. bonus) parked for employee options; 45.7 cr still in the trust at Mar-26 (4.7%).'],
      ['49.5% foreign-ownership cap', 'Apr/May-2025', '–', 'Indian-owned status let Blinkit hold inventory; foreign index weight cut.'],
      ['Dividends / buybacks', 'Never', '–', 'All cash is retained for growth.'],
    ], source: 'Company filings, FY26 annual report, Business Standard' } },
    { callout: '**What this means:** management has been a good allocator of capital. The two big deals were paid largely in shares at low prices (Uber Eats, Blinkit) and both businesses now lead their markets. The cost is dilution: shares in issue have risen to 965 cr, and ESOPs add ~1% a year.' },
  ],
};

// ---------------------------------------------------------------- Industry
const industry = {
  id: 'industry', nav: 'Industry & competition', kicker: 'Industry', title: 'Two markets: a profitable duopoly and a crowded race',
  blocks: [
    { p: `**Food delivery** is a two-player market (Zomato and Swiggy) in which both now make money. ${IV.foodServices} Zomato is the larger and more profitable player: in Q1FY27 its food NOV (₹${n0(q1.foodNov)} cr) exceeded Swiggy's GOV (₹${n0(SW.foodGov)} cr) even though NOV is the stricter measure, and it earned twice Swiggy's food profit. New price-led apps (Swiggy's Toing, Rapido's Ownly) are the first challenge to the duopoly's pricing in years.` },
    { p: `**Quick commerce** (groceries and essentials in 10-20 minutes) is the growth market and far more crowded. ${IV.qc} Scale decides who makes money: a store breaks even only when it handles enough orders a day (~1,100-1,200 by Business Today's estimate), and Blinkit is the only major player that is profitable.` },
    { exhibit: { type: 'table', title: 'Quick commerce: who is who', head: ['Player', 'Stores', 'Date', 'Economics'], wide: [3], rows: IV.stores.map(([p, s, d, e]) => [p.startsWith('Blinkit') ? `**${p}**` : p, n0(s), d, e]), source: IV.storesSource } },
    { pair: [
      { type: 'hbar', title: 'Quick-commerce order value, Q1FY27: Blinkit ~3x Instamart', unit: 'Net order value (₹ crore)', x: ['Blinkit', 'Instamart'], series: [{ name: 'NOV', values: [q1.qcNov, SW.imNov], fmt: 'num' }], labels: 'all', highlight: 'Blinkit', source: 'Eternal and Swiggy Q1FY27 letters (Zepto is private and does not report quarterly)' },
      { type: 'hbar', title: 'Food delivery order value, Q1FY27: Zomato ahead', unit: '₹ crore (Zomato NOV; Swiggy GOV, a broader measure)', x: ['Zomato', 'Swiggy'], series: [{ name: 'Order value', values: [q1.foodNov, SW.foodGov], fmt: 'num' }], labels: 'all', highlight: 'Zomato', source: 'Eternal and Swiggy Q1FY27 letters' },
    ] },
    { exhibit: { type: 'table', title: 'Regulation: what could change the economics', head: ['Theme', 'Direction', 'Detail'], wide: [2], rows: [
      ['Foreign-ownership rules for inventory e-commerce', 'Tailwind (already used)', 'Only Indian-owned and controlled companies may hold inventory. Eternal capped foreign ownership at 49.5% (2025) and Blinkit moved to 1P in FY26; Swiggy is about a year behind.'],
      ['Gig-worker social security (Code on Social Security, in force Nov-2025)', 'Headwind', 'Aggregators must pay 1-2% of turnover, capped at 5% of payouts to gig workers. Rate and start date were still not notified by 30-Sep-2026; not in our numbers.'],
      ['GST on delivery charges', 'Headwind', 'From 22-Sep-2025 platforms pay 18% GST on delivery by unregistered riders. Legacy demands of ~₹447 cr (2019-24) are contested.'],
      ['Competition Commission (CCI)', 'Headwind', 'Investigation into food-delivery practices open since FY22; restaurant and distributor complaints about quick-commerce pricing.'],
    ], source: 'FY26 annual report (note 37), Q4FY26 letter, Outlook Business, Inc42' } },
  ],
};

// ---------------------------------------------------------------- Tailwind test
const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Eternal captures the growth in both markets',
  blocks: [
    { p: 'A company in a growing industry is not automatically a winner. The test is whether it captures its share of each tailwind. Eternal passes on most counts; the exceptions are cost headwinds that hit every platform.' },
    { verdicts: [
      ['Online food delivery growing ~20% a year', 'Yes', `Zomato NOV +${q1.foodNovYoYPct}% in Q1FY27 vs Swiggy food GOV +${SW.foodGovYoYPct}%.`, 'Gaining share, at a higher margin.'],
      ['Quick-commerce adoption', 'Yes', `Blinkit NOV +${q1.qcNovYoYPct}% vs Instamart +${SW.imNovYoYPct}%; ${n0(q1.qcStores)} stores.`, 'Takes most of the new demand among listed players.'],
      ['Scale economics in dark stores', 'Yes', `Blinkit adjusted EBITDA +₹${q1.qcAdjEbitda} cr in Q1FY27; rivals lose money on every order.`, 'The economics favour the leader.'],
      ['Inventory (1P) model', 'Yes', 'Owned inventory since Q2FY26; gross profit 27.5% of NOV in Q1FY27.', 'A year ahead of Swiggy.'],
      ['Going-out (movies, events, dining)', 'Partly', `District NOV +${q1.goNovYoYPct}% but still loss-making (${q1.goAePctNov}% of NOV).`, 'Growth captured; profit not yet.'],
      ['Price-led food entrants (Toing, Ownly)', 'Headwind', 'Lower commissions and fees; management says impact "limited" so far.', 'Caps take-rate increases.'],
      ['Gig-worker levies and GST on delivery', 'Headwind', '1-2% of turnover levy pending; GST on delivery charges since Sep-2025.', 'A cost for all platforms; not in our numbers.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: 'Eternal and Swiggy Q1FY27 letters, GAM Research' },
  ],
};

module.exports = { history, industry, tailwind };
