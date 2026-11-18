// Swiggy report, part B: the full research chapters (business, history, industry, segments, moat,
// earnings, ownership, governance, forecasts, street, sum-of-the-parts valuation, verdict, glossary).
// Written as of 30-Sep-2026 (Q1FY27 basis): numbers in prose come from research/segments.json,
// deep.json, swiggy.json, asof-2026-09-30.json and the built model; forecast and valuation figures
// are live tokens ({{...}}) so they follow assumptions.json.
const fs = require('fs');
const path = require('path');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'SWIGGY', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const D = rd('deep.json'), SG = rd('segments.json'), AS = rd('asof-2026-09-30.json');
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'SWIGGY.json'), 'utf8'));
const V = M.forecast.dcf, F = M.forecast.F;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const SRC = 'Swiggy shareholder letters, GAM Research';
const SRCX = 'Swiggy and Eternal shareholder letters (Q1FY27), broker notes as cited, GAM Research';
const ASOF_TXT = '30-Sep-2026';

// ---- quarterly segment series (Q1FY25 → Q1FY27) ----
const Qs = SG.quarterly, QL = Qs.map(q => q.q);
const qv = k => Qs.map(q => q[k] ?? null);
const pctOf = (a, b) => Qs.map(q => (q[a] != null && q[b] ? Math.round(q[a] / q[b] * 1000) / 10 : null));
const ann = fy => SG.annual.find(a => a.fy === fy);
const A25 = ann('FY25'), A26 = ann('FY26'), q1 = Qs[Qs.length - 1];
const ET = AS.competition.eternalQ1FY27, ZF = ET.foodDelivery, BL = ET.blinkit;
const W52 = AS.events.week52, ST = AS.street;

// ---- valuation arithmetic used in prose (from the built model) ----
const mcap = M.price.last * F.shares;
const cashNow = q1.cash; // company-reported cash & investments, Jun-26
const exInstamart = V.parts.filter(p => !p.name.startsWith('Instamart')).reduce((s, p) => s + p.value, 0);
const impliedIm = mcap - exInstamart; // what the market implies for Instamart if everything else is worth our base value
const foodFy28 = F.seg.food.adjEbitda[1];
const impliedFoodX = (mcap - cashNow) / foodFy28;
const imZero = V.parts.find(p => p.name.startsWith('Instamart')).perShare;
const fromHigh = (M.price.last / W52.highIntraday - 1) * 100;

const rating = 'HOLD';
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const cover = {
  headline: 'Food delivery plus cash is about what the market pays; Instamart is the swing factor',
  lead: `Swiggy runs India's #2 food-delivery app and the #3 quick-commerce network (Instamart). At ₹{{P.last|num}} the stock is ${Math.abs(Math.round(fromHigh))}% below its October-2025 high. Q1FY27 showed progress: food delivery earned ₹${q1.foodAdjEbitda} cr (3.1% of order value) and Instamart's contribution margin reached breakeven in May. But Instamart still lost ₹${-q1.imAdjEbitda} cr in the quarter while Blinkit, its larger rival, made a profit, and in September MSCI dropped the stock as foreign ownership hit the new 49.5% cap. Our view: food delivery and ~₹${n0(cashNow)} cr of cash are worth roughly the whole market value, so the market gives Instamart little. Our sum of the parts gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**, just short of our BUY line: **we initiate with HOLD (high risk).** Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}} ({{scen.bear.upside|chg}}).`,
  arguments: [
    { h: 'Food delivery is profitable and improving, but losing share', p: `Adjusted EBITDA was ₹${q1.foodAdjEbitda} cr in Q1FY27, 3.1% of order value (GOV), up from 0.9% two years ago. Order value grew 17.4%. But Zomato grew faster (net order value +20.1%) and earns 5.6%. Swiggy is a solid #2 that is not closing the gap.` },
    { h: 'Instamart: margins turning, losses still deep', p: `Instamart lost ₹${-q1.imAdjEbitda} cr in Q1FY27 (−9.8% of GOV); Blinkit made ₹${BL.adjEbitda} cr. Blinkit has ${n0(BL.stores)} dark stores to Instamart's ${n0(q1.imStores)} and grew net order value 86% to Instamart's 39%. Management reached contribution breakeven in May, but says EBITDA breakeven needs ~2.5x today's scale and gives no date.` },
    { h: 'The cash buys time, not victory', p: `Cash and investments were ₹${n0(cashNow)} cr at June 2026, with no debt other than leases; Q1 burn was ~₹700 cr. The CFO expects to break even on cash over the next two quarters (food profits and interest covering Instamart). Swiggy will not need new money soon, but every year of losses uses up value that shareholders already own.` },
    { h: 'The market gives Instamart little; so do we', p: `At ₹{{P.last|num}}, market value (~₹${n0(mcap)} cr) less cash leaves ~₹${n0(mcap - cashNow)} cr for all the businesses: about ${impliedFoodX.toFixed(0)}x our FY28E food EBITDA, with nothing left for Instamart. We value food at 30x and Instamart at a small positive (0.2x order value less the losses still to fund), so our target sits {{dcf.upside|chg}} above the price. The street's median target is ₹${n0(ST.summary.medianTp)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'RED' },
    { k: 'Balance sheet', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (late Oct-2026): does Instamart\'s order value re-accelerate (management hopes for double-digit growth on the quarter) while contribution stays within 0 to −1%?',
    'Instamart moves to an inventory (1P) model within 2-4 quarters of the Aug-2026 approval: watch contribution margin and working capital.',
    'Food delivery growth against Zomato: does the gap narrow?',
    'Forced selling: MSCI and NSE index deletions (Sep-2026) as foreign ownership sits at the 49.5% cap.',
  ],
};

// ---------------------------------------------------------------- 1. Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Two businesses going in opposite directions', unit: 'Adjusted EBITDA by quarter (₹ crore)', x: QL, series: [{ name: 'Food delivery', values: qv('foodAdjEbitda'), fmt: 'num' }, { name: 'Instamart', values: qv('imAdjEbitda'), fmt: 'num' }], labels: 'ends', source: SRC },
      { type: 'hbar', title: 'Quick commerce, Q1FY27: Blinkit profitable, Instamart not', unit: 'Adjusted EBITDA (₹ crore)', x: ['Blinkit (Eternal)', 'Instamart (Swiggy)'], series: [{ name: 'Adj. EBITDA', values: [BL.adjEbitda, q1.imAdjEbitda], fmt: 'num' }], labels: 'all', highlight: 'Instamart (Swiggy)', source: 'Eternal and Swiggy Q1FY27 results' },
    ] },
    { pair: [
      { type: 'hbar', title: 'The growth gap: Blinkit is pulling away', unit: 'Order value growth YoY, Q1FY27 (%)', x: ['Blinkit NOV', 'Instamart NOV', 'Zomato food NOV', 'Swiggy food GOV'], series: [{ name: 'Growth', values: [BL.novYoYPct, 38.9, ZF.novYoYPct, q1.foodGovYoYPct], fmt: 'pct' }], labels: 'all', source: SRCX },
      { type: 'hbar', title: 'Dark stores: Blinkit has twice as many', unit: 'Dark stores, latest reported', x: ['Blinkit (Jun-26)', 'Instamart (Jun-26)', 'Zepto (Mar-26)', 'Flipkart Minutes*', 'BigBasket Now*'], series: [{ name: 'Stores', values: [BL.stores, q1.imStores, 1139, 627, 497], fmt: 'num' }], labels: 'all', highlight: 'Instamart (Jun-26)', source: 'Company letters, CLSA (*top-10 cities only, Aug-26)' },
    ] },
    { pair: [
      { type: 'line', title: `Share price: ${Math.abs(Math.round(fromHigh))}% below the 52-week high`, unit: '₹, weekly', x: 'P.series[].0', series: [{ name: 'Price', ref: 'P.series[].1', fmt: 'num', thin: true }], labels: 'extremes', yearTicks: true, yearStep: 1, source: 'Screener.in, NSE' },
      { type: 'column', title: 'Cash: topped up by the QIP and Rapido sale; burn ~₹700 cr a quarter', unit: 'Cash & investments, quarter end (₹ crore)', x: QL, series: [{ name: 'Cash', values: qv('cash'), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { pair: [
      { type: 'column', title: 'Our forecast: EBITDA turns positive only in FY29', unit: 'Reported EBITDA (₹ crore)', x: 'fin.labels', from: 'FY21', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
      { type: 'hbar', title: 'Sum of the parts: where the value sits', unit: '₹ per share', x: V.parts.map(p => p.name.replace(' (quick commerce)', '').replace(/ at end-FY27E.*/, '')), series: [{ name: '₹/share', values: V.parts.map(p => Math.round(p.perShare)), fmt: 'num' }], labels: 'all', source: 'GAM Research estimates' },
    ] },
  ],
};

// ---------------------------------------------------------------- 2. Business
const business = {
  id: 'business', nav: 'What Swiggy does', kicker: 'The business', title: 'One app, five businesses: how Swiggy makes money',
  blocks: [
    { p: `Swiggy is a consumer app that connects customers with restaurants and stores and delivers the order, usually in 10-40 minutes. It does not cook the food or (for now) own the groceries. It earns a **take rate**: commissions from restaurants and sellers, delivery and platform fees from customers, and advertising. The headline measure of activity is **gross order value (GOV)**, the total value of orders placed. Revenue is the slice of GOV that Swiggy keeps.` },
    { exhibit: { type: 'table', title: 'The five segments in FY26', head: ['Segment', 'What it is', 'GOV (₹ cr)', 'Revenue (₹ cr)', 'Adj. EBITDA (₹ cr)', 'Margin, % of GOV'], wide: [1], rows: [
      ['**Food delivery**', 'Restaurant delivery; the original business (2014)', n0(A26.foodGov), n0(A26.foodRev), n0(A26.foodAdjEbitda), (A26.foodAdjEbitda / A26.foodGov * 100).toFixed(1) + '%'],
      ['**Instamart**', 'Groceries and essentials in ~10 minutes from dark stores (2020)', n0(A26.imGov), n0(A26.imRev), n0(A26.imAdjEbitda), (A26.imAdjEbitda / A26.imGov * 100).toFixed(1) + '%'],
      ['**Out-of-home**', 'Dineout table bookings, restaurant bill payments, events', n0(A26.oohGov), n0(A26.oohRev), n0(A26.oohAdjEbitda), (A26.oohAdjEbitda / A26.oohGov * 100).toFixed(1) + '%'],
      ['**Supply chain & distribution**', 'Sells goods wholesale to the sellers who list on Instamart', '–', n0(A26.scRev), n0(A26.scAdjEbitda), '–'],
      ['**Platform innovations**', 'New bets: Toing (budget meals), Pyng, Crew', '–', n0(A26.piRev), n0(A26.piAdjEbitda), '–'],
      { hl: true, cells: ['**Total**', '', n0(A26.gov), n0(A26.revenue), n0(A26.adjEbitda), (A26.adjEbitda / A26.gov * 100).toFixed(1) + '%'] },
    ], source: 'Swiggy Q4FY26 shareholder letter' } },
    { pair: [
      { type: 'hbar', title: 'Order value: food and Instamart are now almost equal', unit: 'GOV, FY26 (₹ crore)', x: ['Food delivery', 'Instamart', 'Out-of-home'], series: [{ name: 'GOV', values: [A26.foodGov, A26.imGov, A26.oohGov], fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'hbar', title: 'Profit: only food delivery makes real money', unit: 'Adjusted EBITDA, FY26 (₹ crore)', x: ['Food delivery', 'Out-of-home', 'Supply chain', 'Platform innovations', 'Instamart'], series: [{ name: 'Adj. EBITDA', values: [A26.foodAdjEbitda, A26.oohAdjEbitda, A26.scAdjEbitda, A26.piAdjEbitda, A26.imAdjEbitda], fmt: 'num' }], labels: 'all', highlight: 'Food delivery', source: SRC },
    ] },
    { exhibit: { type: 'tiles', title: 'Swiggy in numbers (Q1FY27)', tiles: [
      { k: 'Monthly transacting users', v: `${q1.mtu} mn`, d: `food ${q1.foodMtu} mn · Instamart ${q1.imMtu} mn` },
      { k: 'Restaurant partners', v: `${n0(q1.restaurantPartnersK * 1000)}`, d: 'active, quarterly' },
      { k: 'Delivery partners', v: `${n0(q1.deliveryPartnersK * 1000)}`, d: 'average monthly' },
      { k: 'Dark stores', v: n0(q1.imStores), d: `${q1.imSqftMn} mn sq ft · ${q1.imCities} cities` },
      { k: 'Instamart orders', v: `${q1.imOrdersMn} mn`, d: `average order ₹${q1.imAov}` },
    ], source: 'Swiggy Q1FY27 shareholder letter' } },
    { callout: `**Why "adjusted" EBITDA?** Swiggy reports segment profit as adjusted EBITDA: it leaves out share-based pay (ESOP) and treats rent as an operating cost. Reported EBITDA does the reverse on rent (accounting rule Ind AS 116 moves it below EBITDA). In FY26 adjusted EBITDA was −₹2,871 cr and reported EBITDA −₹3,245 cr. The earnings-quality chapter walks through the bridge.` },
  ],
};

// ---------------------------------------------------------------- 3. History & corporate actions
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Twelve years: from a Bengaluru food app to a cash-rich, loss-making platform',
  blocks: [
    { p: `Swiggy started delivering food in Bengaluru in August 2014. It raised money privately for a decade, peaking at a US$10.7bn valuation in 2022 before investors marked it down to ~US$5.5bn in the 2023 tech downturn. It listed in November 2024 at ₹390. Since then it has raised ₹10,000 cr more through a QIP (Dec-2025, at ₹375), sold its stake in Rapido (₹2,399 cr) and agreed to sell a small distribution unit (Lynks). Each of these changed the numbers, as the table shows.` },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['Aug-2014', 'Food delivery launched in Bengaluru (company set up Aug-2013)', 'The core marketplace'],
      ['Jan-2018', 'Acquired Scootsy Logistics', 'Later became the dark-store and logistics arm'],
      ['Aug-2020', 'Instamart launched', 'Start of quick commerce; losses begin to build from FY22'],
      ['Jan-2022', 'US$700m round led by Invesco at US$10.7bn', 'Peak private valuation; funded the FY22-23 expansion (biggest losses: ₹4,179 cr in FY23)'],
      ['Jun-2022', 'Bought Dineout from Times Internet (US$120m, in shares)', 'Created the out-of-home segment'],
      ['2023', 'Investors marked Swiggy down to ~US$5.5bn', 'Cost cuts: EBITDA loss halved in FY24'],
      ['Nov-2024', 'IPO at ₹390 (₹4,499 cr fresh + ₹6,828 cr sale by investors)', 'Preference shares converted; net worth turned positive'],
      ['May-2025', 'Pre-IPO investor lock-in ended', 'Supply overhang; stock fell to ₹297'],
      ['Sep-2025', 'Rapido stake sold (₹2,399 cr); Instamart moved into a subsidiary', 'Cash inflow in Q4FY26'],
      ['Dec-2025', 'QIP: ₹10,000 cr at ₹375', '~9.6% more shares; cash rose to ~₹13,500-15,000 cr'],
      ['Apr-2026', 'Co-founder Nandan Reddy resigned', 'Leadership reshuffle'],
      ['Jul-2026', 'Domestic ownership passes 50%; Instamart CEO changes (Amitesh Jha to Nandita Sinha)', 'First step to an Indian-owned (IOCC) structure'],
      ['Aug-2026', 'Capital Markets Day (FY31 target ₹10,000 cr adjusted EBITDA); AGM approves a 49.5% foreign-ownership cap', 'Clears the way for Instamart to hold inventory'],
      ['Sep-2026', 'MSCI and NSE drop Swiggy from foreign-investor indices; Lynks sale agreed (FY26 revenue ₹668 cr)', 'Forced selling (~US$340-500m estimated); supply-chain revenue to fall'],
    ], source: 'Company filings and press (Entrackr, Inc42, Outlook Business, Ventura)' } },
    { h: 'Corporate actions and their impact' },
    { exhibit: { type: 'table', title: 'Capital raised and returned', head: ['Action', 'Date', 'Amount (₹ cr)', 'Effect on shareholders'], wide: [3], rows: [
      ['IPO: fresh issue + offer for sale at ₹390', 'Nov-2024', '4,499 fresh + 6,828 OFS', 'Fresh money funded dark stores and tech; OFS let early investors sell. Preference shares (shown as ~₹16,000 cr of "borrowings" in FY22-24) converted to equity.'],
      ['QIP at ₹375 (4% below the floor price)', 'Dec-2025', '10,000', '~26.7 cr new shares, ~9.6% dilution. Over 80% taken by Indian investors (mutual funds ~37%).'],
      ['Rapido stake sold to Prosus and WestBridge', 'Sep-2025 (cash Q4FY26)', '2,399', '~2.3-2.5x return. Prosus is also Swiggy\'s largest shareholder: an arm\'s-length question worth noting.'],
      ['Instamart moved into a subsidiary (slump sale)', 'FY26', '–', 'Ring-fences quick commerce; no effect on consolidated numbers.'],
      ['Foreign ownership capped at 49.5%', 'Aug-2026 (AGM)', '–', 'Lets Swiggy qualify as Indian-owned and so hold inventory in Instamart. Foreign investors must stay below the cap, which triggered index deletions.'],
      ['ESOP grants', 'Every year', '966 cost in FY26', 'Non-cash cost, but dilutes shareholders; CEO\'s FY26 pay of ~₹551 cr was mostly ESOP exercise.'],
    ], source: 'Company filings, Entrackr, Inc42' } },
    { callout: `**What this means:** Swiggy has raised ~₹14,500 cr from public shareholders in two years and spent most of the pre-QIP money. Its survival is not in doubt, but the per-share value now depends on Instamart's losses shrinking before the cash does.` },
  ],
};

// ---------------------------------------------------------------- 4. Industry
const sh = D.industry.food.shareHistory.filter(s => s.zomatoPct);
const industry = {
  id: 'industry', nav: 'Industry & competition', kicker: 'Industry', title: 'Two markets, one dominant winner: Eternal',
  blocks: [
    { p: `**Food delivery** in India is a two-player market: Eternal's Zomato and Swiggy. It became rational and profitable for both from 2023, once discount wars stopped. Zomato is bigger (its share of the two-player market has risen from ~54% in FY22 to ~57-58%), more profitable and growing faster. The market itself grows mid-to-high teens a year, helped by more users in smaller cities and more orders per user.` },
    { p: `**Quick commerce** (groceries in 10-20 minutes) is the growth market: ~US$13-14bn of order value in FY26 and forecast at US$30bn by FY28 and US$50-57bn by FY30 (HSBC, Morgan Stanley). It is far more crowded: Blinkit (Eternal), Zepto, Instamart, Flipkart Minutes, BigBasket Now, Amazon Now and JioMart. Scale matters because a dark store is profitable only when it handles enough orders a day. Blinkit added ${BL.netStoresAdded} stores in Q1FY27 alone and guides to net order value growth "north of 60%" a year for three years.` },
    { pair: [
      { type: 'stacked', title: 'Food delivery share: Zomato has been gaining', unit: 'Share of Zomato + Swiggy food order value (%)', x: sh.map(s => s.period), series: [{ name: 'Zomato', values: sh.map(s => s.zomatoPct), fmt: 'pct0' }, { name: 'Swiggy', values: sh.map(s => s.swiggyPct), fmt: 'pct0' }], source: 'Motilal Oswal, Angel One; later share not published' },
      { type: 'column', title: 'Quick commerce market: expected to ~4x by FY30', unit: 'Order value, US$ bn', x: ['FY26', 'FY28E', 'FY30E'], series: [{ name: 'Market GOV', values: [13.5, 30, 50], fmt: 'num' }], labels: 'all', source: 'Redseer (FY26), HSBC (FY28E, FY30E)' },
    ] },
    { exhibit: { type: 'table', title: 'Quick commerce: who is who', head: ['Player', 'Owner', 'Dark stores', 'Position'], wide: [3], rows: [
      ['Blinkit', 'Eternal (listed)', `${n0(BL.stores)} (Jun-26)`, `Leader; net order value +${BL.novYoYPct}% YoY in Q1FY27; profitable at adjusted EBITDA (₹${BL.adjEbitda} cr); already holds inventory`],
      ['Zepto', 'Private (IPO approved, postponed)', '1,139 (Mar-26)', 'FY26 revenue ₹22,624 cr, net loss ~₹5,905 cr'],
      ['**Instamart**', '**Swiggy**', `**${n0(q1.imStores)} (Jun-26)**`, `**#3 by orders; net order value +39%; lost ₹${-q1.imAdjEbitda} cr in Q1FY27**`],
      ['Flipkart Minutes', 'Walmart', '627 (top-10 cities)', 'Expanding fast with Flipkart\'s balance sheet'],
      ['BigBasket Now', 'Tata', '497 (top-10 cities)', 'Grocery specialist'],
      ['Amazon Now', 'Amazon', 'targets 1,000+', 'Deepest pockets in the market'],
    ], source: 'Company filings (Q1FY27), CLSA (Aug-2026), Zepto DRHP coverage' } },
    { exhibit: { type: 'table', title: 'Regulation and policy: what could change the economics', head: ['Theme', 'Direction', 'Detail'], wide: [2], rows: [
      ['Foreign-ownership rules for inventory', 'Tailwind', 'Only Indian-owned companies may hold inventory in e-commerce. Swiggy capped foreign ownership at 49.5% (AGM, 18-Aug-2026) and expects to move Instamart to an inventory model within 2-4 quarters, worth ~80bp of contribution margin. Blinkit already made this switch.'],
      ['Index eligibility', 'Headwind', 'With foreign ownership at the cap, MSCI deleted Swiggy (Sep-2026) and NSE removed it from its FPI index; estimated forced selling US$340-500m.'],
      ['Competition regulator (CCI) on predatory pricing', 'Headwind', 'Distributors complained in 2024 that quick-commerce firms sell below cost. CCI is at a preliminary review; no order yet.'],
      ['Gig-worker social security (central law)', 'Headwind', 'Platforms must pay 1-2% of turnover (capped at 5% of payouts to gig workers). Rate and start date await notification; not in our numbers.'],
      ['State gig-worker laws (Karnataka, Rajasthan)', 'Headwind', 'Karnataka charges a 1% fee on deliveries; the High Court refused a stay (Jul-2026) and ordered platforms to deposit the fee.'],
      ['GST on delivery fees', 'Headwind', 'Tax authorities claim 18% GST on delivery fees for 2017-23 (~₹350-400 cr for Swiggy). Swiggy contests it.'],
    ], source: 'GAM research compilation (Inc42, Free Press Journal, Deccan Herald, company letters, Ventura)' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Swiggy rides the growth, but rarely leads it',
  blocks: [
    { p: 'A company in a growing industry is not automatically a winner. The test is whether it captures its share of each tailwind. Swiggy passes on participation and fails on leadership.' },
    { verdicts: [
      ['Food delivery growing high-teens', 'Partly', `Swiggy food GOV +${q1.foodGovYoYPct}% in Q1FY27 vs Zomato NOV +${ZF.novYoYPct}%.`, 'Growth captured, but share still drifting to Zomato.'],
      ['Quick-commerce adoption', 'Partly', `Instamart net order value +39% vs Blinkit +${BL.novYoYPct}%.`, 'Participates as a distant #2-3; most of the new demand goes to Blinkit.'],
      ['Scale economics in dark stores', 'No', `Blinkit has ${(BL.stores / q1.imStores).toFixed(1)}x the stores and is profitable; Instamart loses ~10% of GOV.`, 'The economics favour the leader.'],
      ['Inventory (1P) model for quick commerce', 'Partly', 'Allowed only once Swiggy is Indian-owned (approved Aug-2026); Blinkit already switched.', '~80bp better contribution, but a year behind.'],
      ['Out-of-home dining (Dineout)', 'Yes', `GOV +${AS.q1fy27.outOfHome.govYoYPct}% in Q1FY27, small and just profitable.`, 'Real, but too small to move the stock.'],
      ['Advertising and membership (Swiggy One)', 'Partly', `Take rate in food rose from 22.6% of GOV (FY26) to ${(q1.foodRev / q1.foodGov * 100).toFixed(1)}% (Q1FY27).`, 'Helps margins; Zomato does the same.'],
      ['Gig-worker social security levies', 'No', 'Central code: 1-2% of turnover (capped at 5% of payouts); Karnataka 1% levy.', 'A cost headwind for both players; not yet in numbers.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRCX },
  ],
};

// ---------------------------------------------------------------- 5. Food delivery
const food = {
  id: 'food', nav: 'Food delivery', kicker: 'Segment 1', title: 'Food delivery: the engine, now earning ~3% of order value',
  blocks: [
    { p: `Food delivery is Swiggy's profit engine. Order value rose from ₹${n0(A25.foodGov)} cr in FY25 to ₹${n0(A26.foodGov)} cr in FY26 (+${((A26.foodGov / A25.foodGov - 1) * 100).toFixed(0)}%) and adjusted EBITDA from ₹${A25.foodAdjEbitda} cr to ₹${n0(A26.foodAdjEbitda)} cr. In Q1FY27 GOV was ₹${n0(q1.foodGov)} cr (+${q1.foodGovYoYPct}%) and margin 3.1%, a seasonal dip from wage hikes and rider incentives. Contribution margin (profit after delivery and discounts, before fixed costs) is stable at ~7.6-7.8%, so the improvement comes from spreading fixed costs over more orders. Management guides to 18-20% GOV growth in FY27 and a 5% steady-state margin.` },
    { pair: [
      { type: 'column', title: 'Food order value keeps growing 17-23% a year', unit: 'Food GOV by quarter (₹ crore)', x: QL, series: [{ name: 'Food GOV', values: qv('foodGov'), fmt: 'num' }], labels: 'ends', source: SRC },
      { type: 'line', title: 'Margin has tripled in two years', unit: 'Food adjusted EBITDA, % of GOV', x: QL, series: [{ name: 'Margin', values: pctOf('foodAdjEbitda', 'foodGov'), fmt: 'pct' }], labels: 'all', source: SRC },
    ] },
    { exhibit: { type: 'table', title: 'Swiggy food vs Zomato food, Q1FY27', head: ['', 'Swiggy', 'Zomato (Eternal)', 'Gap'], rows: [
      ['Order value (₹ cr)', n0(q1.foodGov) + ' (GOV)', n0(ZF.nov) + ' (NOV)', 'Zomato ~13% larger on a stricter measure'],
      ['Growth YoY', `+${q1.foodGovYoYPct}%`, `+${ZF.novYoYPct}%`, 'Swiggy slower'],
      ['Adjusted EBITDA (₹ cr)', n0(q1.foodAdjEbitda), n0(ZF.adjEbitda), `Zomato ${(ZF.adjEbitda / q1.foodAdjEbitda).toFixed(1)}x`],
      ['Margin', '3.1% of GOV', `${ZF.adjEbitdaPctNov}% of NOV`, 'Zomato ~2.5pp higher'],
      ['Monthly users (food)', `${q1.foodMtu} mn`, `${ZF.mtuMn} mn`, 'Zomato ~40% more users'],
    ], source: SRCX } },
    { p: `**Toing** is the wrinkle. It is a separate budget-meals app (~50 cities) that Swiggy reports under "platform innovations", not food. Platform innovations lost ₹${-q1.piAdjEbitda} cr in Q1FY27, almost half of food's profit, mostly on Toing marketing. Management argues it brings in new and lapsed users (two in three of its users); sceptics argue it cannibalises Swiggy's own food orders. By September, app data put Toing's weekly users (~33 mn) close to Zomato's (CLSA). We assume losses shrink from FY28 but do not assume it is closed.` },
    { callout: `**Our view:** food delivery deserves a profit multiple, not a loss narrative. We forecast margin of 3.4% / 3.9% / 4.3% of GOV for FY27-29E (management's path is 5%; Zomato is already at 5.6%), giving adjusted EBITDA of {{F.seg.food.adjEbitda.0|num}} / {{F.seg.food.adjEbitda.1|num}} / {{F.seg.food.adjEbitda.2|num}} cr. The honest weakness: Swiggy is a permanent #2 with lower margins, and it is not winning share.` },
  ],
};

// ---------------------------------------------------------------- 6. Instamart
const instamart = {
  id: 'instamart', nav: 'Instamart', kicker: 'Segment 2', title: 'Instamart: margins turning, losses deep, and a rival that has already won the scale race',
  blocks: [
    { p: `Instamart delivers groceries and household items in ~10 minutes from ${n0(q1.imStores)} dark stores in ${q1.imCities} cities. Order value grew from ₹${n0(A25.imGov)} cr in FY25 to ₹${n0(A26.imGov)} cr in FY26, almost doubling, as Swiggy opened bigger stores and pushed into new cities. The cost was an adjusted EBITDA loss of ₹${n0(-A26.imAdjEbitda)} cr in FY26, more than three times what food delivery earned. In Q1FY27 order value was flat on the quarter (+40% on the year) as Swiggy cut unprofitable users, contribution margin reached breakeven in May, and the loss narrowed to ₹${-q1.imAdjEbitda} cr.` },
    { pair: [
      { type: 'column', title: 'Order value: growth has slowed from ~100% to ~40%', unit: 'Instamart GOV by quarter (₹ crore)', x: QL, series: [{ name: 'GOV', values: qv('imGov'), fmt: 'num' }], labels: 'ends', source: SRC },
      { type: 'column', title: 'Losses: ₹780-910 cr every quarter for five quarters', unit: 'Instamart adjusted EBITDA (₹ crore)', x: QL, series: [{ name: 'Adj. EBITDA', values: qv('imAdjEbitda'), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { pair: [
      { type: 'line', title: 'Loss as % of order value is improving slowly', unit: '% of GOV', x: QL, series: [{ name: 'Adjusted EBITDA', values: pctOf('imAdjEbitda', 'imGov'), fmt: 'pct' }, { name: 'Contribution margin', values: qv('imContribPct'), fmt: 'pct' }], labels: 'last', source: SRC },
      { type: 'column', title: 'Store openings have slowed', unit: 'Dark stores, quarter end', x: QL, series: [{ name: 'Stores', values: qv('imStores'), fmt: 'num' }], labels: 'ends', source: SRC },
    ] },
    { exhibit: { type: 'table', title: 'Instamart vs Blinkit, Q1FY27', head: ['', 'Instamart', 'Blinkit', 'What it tells you'], wide: [3], rows: [
      ['Net order value (₹ cr)', n0(q1.imNov), n0(BL.nov), `Blinkit ~${(BL.nov / q1.imNov).toFixed(1)}x larger`],
      ['Growth YoY', '+38.9% (NOV)', `+${BL.novYoYPct}%`, 'The gap is widening, not closing'],
      ['Adjusted EBITDA (₹ cr)', n0(q1.imAdjEbitda), `+${BL.adjEbitda}`, 'Blinkit already profitable'],
      ['Dark stores', `${n0(q1.imStores)} (+28 in Q1)`, `${n0(BL.stores)} (+${BL.netStoresAdded} in Q1)`, 'Blinkit adds in one quarter a sixth of Instamart\'s network'],
      ['Inventory model', 'Approved Aug-2026; switch within 2-4 quarters', 'Already 1P', 'Swiggy ~a year behind on margins'],
    ], source: SRCX } },
    { h: 'What has to happen for Instamart to break even' },
    { p: `Management's own arithmetic (Q1 call and Capital Markets Day): Instamart needs ~₹60,000 cr of annualised net order value (about 2.5x today's ~₹${n0(q1.imNov * 4)} cr) and a contribution margin of 5-6% (~₹30 per order) to break even at adjusted EBITDA. At ~30% growth that takes about three and a half years, so breakeven is roughly FY30, not FY28. For the next couple of quarters management guides contribution of 0 to −1% while growth accelerates (~75 new stores in Q2). The move to an inventory model should add ~80bp to contribution.` },
    { callout: `**Our view:** we model losses of {{F.seg.im.adjEbitda.0|num}} / {{F.seg.im.adjEbitda.1|num}} / {{F.seg.im.adjEbitda.2|num}} cr for FY27-29E, i.e. still losing money in FY29. Revenue will jump in our forecast (Instamart revenue % of GOV rises from ~16% to ~55%) because the 1P model books the full sale value as revenue. That is an accounting change, not more profit. **Brutal truth:** Blinkit proves quick commerce can be profitable, but only for the leader. Instamart has half the stores, less than half the growth, and needs Blinkit to stay rational to reach breakeven.` },
  ],
};

// ---------------------------------------------------------------- 7. Other segments
const others = {
  id: 'others', nav: 'Out-of-home & new bets', kicker: 'Segments 3-5', title: 'Out-of-home, supply chain and new bets: small, and mostly about costs',
  blocks: [
    { exhibit: { type: 'table', title: 'Smaller segments by quarter (₹ crore)', head: ['', ...QL.slice(-6)], rows: [
      ['Out-of-home GOV', ...Qs.slice(-6).map(q => n0(q.oohGov))],
      ['Out-of-home adj. EBITDA', ...Qs.slice(-6).map(q => n0(q.oohAdjEbitda))],
      ['Supply chain revenue', ...Qs.slice(-6).map(q => n0(q.scRev))],
      ['Supply chain adj. EBITDA', ...Qs.slice(-6).map(q => n0(q.scAdjEbitda))],
      ['Platform innovations revenue', ...Qs.slice(-6).map(q => n0(q.piRev))],
      ['Platform innovations adj. EBITDA', ...Qs.slice(-6).map(q => n0(q.piAdjEbitda))],
    ], source: SRC } },
    { bullets: [
      `**Out-of-home (Dineout, events):** GOV ₹${n0(A26.oohGov)} cr in FY26 and ₹${n0(q1.oohGov)} cr in Q1FY27 (+45%), just profitable. Management targets scale and ~₹1,000 cr EBITDA by FY31. A genuine small positive; we value it at {{dcf.parts.2.value|num}} cr.`,
      `**Supply chain & distribution:** a low-margin wholesale business (₹${n0(A26.scRev)} cr revenue, −₹${-A26.scAdjEbitda} cr EBITDA in FY26) that sells to Instamart's sellers. It will shrink as Instamart buys stock directly and Lynks is sold (agreed Sep-2026). It matters for revenue, not value.`,
      `**Platform innovations (Toing, Pyng, Crew):** losses rose from ₹58 cr in Q4FY26 to ₹${-q1.piAdjEbitda} cr in Q1FY27 as Toing scaled. We deduct three years of FY28E losses ({{dcf.parts.4.value|num}} cr) from our valuation.`,
    ] },
  ],
};

// ---------------------------------------------------------------- 8. Moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in food, absent in quick commerce',
  blocks: [
    { verdicts: [
      ['Food-delivery network (restaurants, riders, users)', 'Advantage', `${n0(q1.restaurantPartnersK * 1000)} restaurants, ${n0(q1.deliveryPartnersK * 1000)} delivery partners, ${q1.foodMtu} mn monthly food users: one of only two national networks.`, 'Supports the valuation floor.'],
      ['Scale vs Eternal in food', 'Disadvantage', `Zomato food NOV ₹${n0(ZF.nov)} cr (+${ZF.novYoYPct}%) at ${ZF.adjEbitdaPctNov}% margin vs Swiggy GOV ₹${n0(q1.foodGov)} cr (+${q1.foodGovYoYPct}%) at 3.1% (Q1FY27).`, 'Limits returns versus Eternal.'],
      ['Quick-commerce scale', 'Disadvantage', `Blinkit ${n0(BL.stores)} stores and profitable; Instamart ${n0(q1.imStores)} stores and −9.8% of GOV (Q1FY27).`, 'The economics favour the leader.'],
      ['Membership, ads and cross-sell (Swiggy One)', 'Parity', 'Food take rate up to 23.3% of GOV; Zomato and Blinkit run the same playbook.', 'Keeps Swiggy in the game; does not win it.'],
      ['Inventory model (1P)', 'Parity', 'Approved Aug-2026; switch within 2-4 quarters; Blinkit is already 1P.', 'A catch-up, not an edge.'],
      ['Balance sheet', 'Advantage', `₹${n0(cashNow)} cr of cash (Jun-2026), no debt other than leases.`, 'Funds the losses for years; cash is not a moat.'],
    ], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard vs Eternal', source: SRCX },
    { callout: `**Honest verdict:** Swiggy has a **durable position** in food delivery: it is one of only two national networks, with ~2.7 lakh restaurants, ~6.5 lakh delivery partners and a brand most urban Indians use. That position is hard to copy, which is why food earns money. But Swiggy has **no advantage over Eternal**, which is bigger, more profitable and growing faster in both food and quick commerce. In quick commerce, Swiggy has **no competitive advantage today**. Its strongest asset is its balance sheet, and cash is not a moat.` },
  ],
};

// ---------------------------------------------------------------- 9. Earnings quality bridge
const earnings = {
  id: 'earnings', nav: 'Reported vs adjusted', kicker: 'Earnings quality', title: 'Reported vs adjusted profit: the gap is ESOPs and rent',
  blocks: [
    { p: 'Swiggy\'s headline "adjusted EBITDA" is ₹374 cr better than reported EBITDA in FY26. Two items explain it. Share-based pay (₹966 cr) is excluded, which flatters adjusted EBITDA. Rent (₹607 cr) is included as a cost in adjusted EBITDA but moved below EBITDA in reported numbers, which flatters reported EBITDA. Neither number is the full picture: ESOPs are a real cost to shareholders (they are diluted), and rent is a real cash cost.' },
    { pair: [
      { type: 'waterfall', title: 'FY26: from adjusted to reported EBITDA', unit: '₹ crore', x: ['Adjusted EBITDA', 'ESOP cost', 'Rent moved below EBITDA', 'Exceptional & associate', 'Reported EBITDA'], series: [{ name: 'Bridge', values: [-2871, -966, 607, -14, -3245] }], fmt: 'num', totalFmt: 'num', source: 'Swiggy Q4FY26 shareholder letter' },
      { type: 'column', title: 'ESOP cost is falling but still large', unit: 'Share-based payment expense (₹ crore)', x: ['FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'ESOP', values: [596, 1173, 966, q1.esop], fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { p: `Two further accounting points: (1) Instamart's move to an inventory model will lift reported revenue sharply once it starts (within 2-4 quarters of the Aug-2026 approval) while cutting margins as a % of revenue; compare growth on order value, not revenue. (2) Instamart metrics are disclosed on both GOV and NOV (net of discounts) bases, and third-party reports mix them up; we use the company's letters throughout.` },
    { callout: '**Accounting flag: AMBER.** No sign of aggressive accounting, but large ESOPs, adjusted metrics that exclude them, and a coming change in revenue recognition all make headline numbers harder to read.' },
  ],
};

// ---------------------------------------------------------------- 10. Cash
const cashBridge = {
  blocks: [
    { exhibit: { type: 'waterfall', title: 'FY26 cash bridge: the QIP and Rapido sale paid for the burn', unit: 'Cash & investments, ₹ crore', x: ['Mar-25 cash', 'Adj. EBITDA', 'Working capital', 'Capex', 'Treasury income', 'Other', 'QIP (net)', 'Rapido sale', 'Mar-26 cash'], series: [{ name: 'Cash', values: [6695, -2871, -670, -911, 301, 179, 9931, 2399, 15053] }], fmt: 'num', totalFmt: 'num', source: 'Swiggy Q4FY26 shareholder letter' } },
    { callout: `**Runway:** cash fell from ₹15,053 cr (Mar-26) to ₹${n0(cashNow)} cr (Jun-26), a burn of ~₹700 cr in the quarter. The CFO expects to break even on cash over the next two quarters (excluding Toing). Our forecast has free cash flow of {{F.fcf.0|num}} / {{F.fcf.1|num}} / {{F.fcf.2|num}} cr in FY27-29E. In our bear case (Instamart losses stay near 10% of GOV) the cash pile keeps shrinking and another raise becomes likely by FY29.` },
  ],
};

// ---------------------------------------------------------------- 11. Ownership additions
const HN = AS.holders.namedAbove1Pct, cat = name => AS.holders.categories.find(c => c.category.trim().startsWith(name));
const ownership = base => ({ ...base, blocks: [
  { p: `Swiggy has **no promoter**. The largest holders are Prosus (21.1%), SoftBank (6.3%) and the CEO (4.6%); Indian mutual funds own ${cat('Mutual funds').pct}% and foreign portfolio investors ${cat('Foreign portfolio').pct}% (Jun-2026). Two things are reshaping the register: **(1) the 49.5% foreign-ownership cap** (approved Aug-2026), which keeps Swiggy Indian-owned so it can hold Instamart inventory, but which led MSCI and NSE to drop the stock from foreign-investor indices in September; and **(2) the ₹10,000 cr QIP** (Dec-2025), over 80% bought by Indian investors.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who owns Swiggy (Jun-2026)', head: ['Holder', 'Type', 'Stake'], wide: [0], rows: [
    ...HN.slice(0, 10).map(h => [h.name, h.category, h.pct + '%']),
    ['All mutual funds', 'Aggregate', cat('Mutual funds').pct + '%'],
    ['Foreign portfolio investors', 'Aggregate', cat('Foreign portfolio').pct + '%'],
  ], source: 'BSE shareholding pattern (quarter to Jun-2026, the latest public on 30-Sep-2026)' } },
  { callout: '**Our read:** the FII exit is largely forced by the foreign cap, not a verdict on the business. But with no promoter and a large free float, the stock has no natural buyer of last resort; supply from Prosus, SoftBank or Accel can hit the price at any time, and the index deletions add short-term selling.' },
] });

// ---------------------------------------------------------------- 12. Governance
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: professional, but founder pay and ESOPs need watching',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: [
      ['Sriharsha Majety', 'Co-founder, MD & Group CEO', 'FY26 pay ~₹551 cr, mostly ESOP exercise; owns 4.6%'],
      ['Rahul Bothra', 'Group CFO', ''],
      ['Phani Kishan Addepalli', 'Co-founder', ''],
      ['Rohit Kapoor', 'CEO, Food Marketplace', ''],
      ['Nandita Sinha', 'CEO, Instamart (from 3-Aug-2026)', 'Replaced Amitesh Jha, who resigned in Jul-2026'],
      ['Anand Kripalu', 'Independent Chairperson', 'Former Diageo India CEO'],
    ], source: 'Company press releases and filings to Sep-2026' } },
    { verdicts: [
      ['Board and chair', 'Strong', 'Independent chair (Anand Kripalu); Prosus has a nominee.', 'Normal for a professionally run, promoter-less company.'],
      ['Founder pay and ESOPs', 'Weak', 'CEO\'s FY26 pay ~₹551 cr (mostly ESOP exercise); ESOP cost ₹966 cr in FY26; more options granted at ₹1 in Jul-2026.', 'Large transfer of value to management while the company loses money.'],
      ['Related-party dealings', 'Moderate', 'Rapido stake sold to Prosus (largest shareholder) and WestBridge.', 'Price looked fair (~2.3-2.5x cost), but worth monitoring.'],
      ['Leadership stability', 'Moderate', 'Co-founder Nandan Reddy resigned Apr-2026; the Instamart CEO changed in Jul/Aug-2026.', 'Core team intact; churn at the top of quick commerce.'],
      ['Guidance credibility', 'Moderate', 'Contribution breakeven in Instamart was delivered (May-2026); EBITDA breakeven has no date and growth targets keep being reset.', 'We haircut management targets.'],
      ['Tax and legal cases', 'Moderate', 'GST notice on delivery fees (~₹350-400 cr), income-tax demand ~₹158 cr, CCI review of quick-commerce pricing, Karnataka gig-worker fee.', 'Manageable relative to cash; not provided for in our numbers.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

// ---------------------------------------------------------------- 13. Forecasts
const segRow = (k, name, field, fmt = 'num') => [name, `${n0(A26[{ food: { driver: 'foodGov', revenue: 'foodRev', adjEbitda: 'foodAdjEbitda' }, im: { driver: 'imGov', revenue: 'imRev', adjEbitda: 'imAdjEbitda' }, ooh: { driver: 'oohGov', revenue: 'oohRev', adjEbitda: 'oohAdjEbitda' }, sc: { driver: 'scRev', revenue: 'scRev', adjEbitda: 'scAdjEbitda' }, pi: { driver: 'piRev', revenue: 'piRev', adjEbitda: 'piAdjEbitda' } }[k][field]])}`, ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|${fmt}}}`)];
const CQ = AS.consensus.snapshots[0];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: losses narrow, but profit only arrives in FY29',
  blocks: [
    { p: `We build the forecast business by business. Each segment's order value (or revenue) grows at our assumed rate; revenue and adjusted EBITDA are set as a % of it. Group reported EBITDA is the sum of the segments, less ESOP cost, plus rent (moved below EBITDA by accounting rules). Every assumption is listed, with our reasoning, in the Assumptions sheet of the Excel model, which recalculates this report's target price.` },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Food delivery' }, segRow('food', 'GOV', 'driver'), segRow('food', 'Revenue', 'revenue'), segRow('food', 'Adjusted EBITDA', 'adjEbitda'),
      { sec: 'Instamart' }, segRow('im', 'GOV', 'driver'), segRow('im', 'Revenue (1P from late FY27)', 'revenue'), segRow('im', 'Adjusted EBITDA', 'adjEbitda'),
      { sec: 'Out-of-home' }, segRow('ooh', 'GOV', 'driver'), segRow('ooh', 'Adjusted EBITDA', 'adjEbitda'),
      { sec: 'Supply chain & distribution' }, segRow('sc', 'Revenue', 'revenue'), segRow('sc', 'Adjusted EBITDA', 'adjEbitda'),
      { sec: 'Platform innovations' }, segRow('pi', 'Revenue', 'revenue'), segRow('pi', 'Adjusted EBITDA', 'adjEbitda'),
    ], source: 'Company (FY26), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'Reported EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit / (loss)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' },
      { name: 'Cash from operations', ref: 'fin.cfo' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs consensus (S&P Capital IQ, 6-Aug-2026)', head: ['', 'GAM FY27E', 'Consensus FY27E', 'GAM FY28E', 'Consensus FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(CQ.FY27E.revenue.avg), '{{F.sales.1|num}}', n0(CQ.FY28E.revenue.avg)],
      ['EPS (₹)', '{{F.eps.0|n1}}', CQ.FY27E.eps.avg.toFixed(1), '{{F.eps.1|n1}}', CQ.FY28E.eps.avg.toFixed(1)],
    ], source: 'S&P Capital IQ consensus via Trendlyne (after Q1, on Capital Markets Day), GAM Research' } },
    { pair: [
      { type: 'column', title: 'Revenue jumps as Instamart books full sale value', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY22', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: 'Company, GAM Research estimates' },
      { type: 'column', title: 'Net loss narrows; breakeven in FY29', unit: 'Net profit / (loss), ₹ crore', x: 'fin.labels', from: 'FY22', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
    ] },
    { exhibit: { type: 'table', title: 'Our FY29E vs management\'s FY31 targets', head: ['', 'GAM FY29E', 'Management FY31 target', 'Our comment'], wide: [3], rows: [
      ['Group GOV (₹ cr)', n0(F.seg.food.driver[2] + F.seg.im.driver[2] + F.seg.ooh.driver[2]), '~2,50,000', `We are on a ~${Math.round((Math.pow((F.seg.food.driver[2] + F.seg.im.driver[2] + F.seg.ooh.driver[2]) / A26.gov, 1 / 3) - 1) * 100)}% a year path; the target needs 30%+ every year to FY31.`],
      ['Group adjusted EBITDA (₹ cr)', n0(Object.values(F.seg).reduce((s, x) => s + x.adjEbitda[2], 0)), '~10,000 (~4% of GOV)', 'Needs Instamart to swing ~₹5,000 cr from today. Possible only if Blinkit stays rational.'],
      ['Food adjusted EBITDA (₹ cr)', n0(F.seg.food.adjEbitda[2]), '~5,000', 'Plausible direction, ambitious size.'],
      ['Instamart GOV (₹ cr)', n0(F.seg.im.driver[2]), '1,50,000+', 'Requires growth to re-accelerate to ~40%; we do not assume it.'],
    ], source: 'Swiggy Capital Markets Day (6-Aug-2026), GAM Research' } },
  ],
};

// ---------------------------------------------------------------- 14. Street
const SB = ST.brokers.filter(b => b.tp);
const shortMethod = b => (!b.method ? 'n.d.' : /DCF/.test(b.method) && !/SOTP/.test(b.method) ? 'DCF' : /SOTP|Food|food/.test(b.method) ? 'SOTP' : 'n.d.');
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ${ST.summary.buyEquivalent} Buys, ${ST.summary.holdEquivalent} Holds, ${ST.summary.sellEquivalent} Sells after Q1`,
  blocks: [
    { exhibit: { type: 'table', title: 'Broker calls standing on 30-Sep-2026', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Method'], wide: [0], rows: SB.map(b => [b.broker.replace(/ \(.*\)/, ''), b.rating, n0(b.tp), b.date, shortMethod(b)]), source: 'Broker notes and press reports to 30-Sep-2026; n.d. = not disclosed' } },
    { pair: [
      { type: 'hbar', title: `Targets range from ₹${ST.summary.lowTp} to ₹${ST.summary.highTp}; we are below most`, unit: '₹ per share', x: [...SB.map(b => b.broker.replace(/ \(.*\)/, '')), 'GAM (base)'], series: [{ name: 'Target', values: [...SB.map(b => b.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes, GAM Research' },
      { type: 'hbar', title: 'What brokers pay for Swiggy food', unit: 'EV/EBITDA multiple on food EBITDA (x)', x: ['HDFC Securities', 'Elara', 'JM Financial', 'Equirus', 'Motilal Oswal', 'Anand Rathi', 'GAM (base)'], series: [{ name: 'Multiple', values: [40, 38, 35, 35, 30, 30, 30], fmt: 'x' }], labels: 'all', highlight: 'GAM (base)', source: 'Broker notes as cited (FY28E / Jun-28 / Sep-28 bases), GAM Research' },
    ] },
    { p: `Most brokers stayed Buy after Q1 (Motilal Oswal, HDFC Securities, ICICI Securities, Nomura, Jefferies, Citi, UBS, JPMorgan, Bernstein, Nuvama) on the argument we share: food plus cash is worth about the market value, and Instamart is turning. CLSA, Morgan Stanley and HSBC are neutral; Macquarie (Underperform) and JM (Sell) worry about the burn. The median target is ₹${n0(ST.summary.medianTp)}. Our food multiple (30x) is at the low end of the 30-40x range, and we give Instamart a small positive value (0.2x order value) where JM gives it zero.` },
  ],
};

// ---------------------------------------------------------------- 15. Valuation
const vrow = (p, i) => [p.name, (assume => assume ? assume.metricLabel || '' : '')(M.forecast.assumptions.valuation.parts[i]), p.metric != null ? n0(p.metric) : '–', p.mult ? (p.mult < 2 ? p.mult.toFixed(2) + 'x' : p.mult.toFixed(0) + 'x') : '–', p.adj ? n0(p.adj) : '–', `{{dcf.parts.${i}.value|num}}`, `{{dcf.parts.${i}.perShare|num}}`];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: sum of the parts, the street\'s method, gives {{dcf.tp|inr}}',
  blocks: [
    ...require('./valuation-blend').streetBlocks('SWIGGY', {
      rating: 'HOLD (high risk)', noOurEps: true,
      streetIntro: 'Brokers value Swiggy **part by part (sum of the parts)**: food delivery on EV/EBITDA two years out (30-40x), Instamart on anything from zero to 0.5x net order value or a DCF, plus cash. ICICI Securities (and probably Emkay) use a whole-company DCF. We use the same method; P/E is meaningless while Swiggy loses money. The real debate is the food multiple and what Instamart is worth.',
      street: [
        ['Motilal Oswal', 'Buy', 350, 'SOTP', 'Food 30x', 'FY28E', 'Instamart: DCF'],
        ['HDFC Securities', 'Buy', 470, 'SOTP', 'Food 40x', 'Jun-28', 'Instamart: 0.5x NOV'],
        ['ICICI Securities', 'Buy', 520, 'DCF', '–', '–', 'Whole-company DCF'],
        ['Elara', 'Accumulate', 350, 'SOTP', 'Food 38x', '–', 'Instamart: 60% discount to Blinkit'],
        ['Equirus', 'Long', 375, 'SOTP', 'Food 35x', 'Sep-28', 'Instamart: 0.25x NOV'],
        ['JM Financial', 'Sell', 250, 'SOTP', 'Food 35x', 'Jun-27', 'Instamart: zero; cash zero'],
        ['Nomura', 'Buy', 435, 'SOTP', 'n.d.', '–', 'Cut for higher QC losses'],
        ['Macquarie', 'Underperform', 230, 'n.d.', '–', '–', 'Cash burn up; breakeven "aspirational"'],
      ],
      ourThesis: 'Food 30x FY28E EBITDA; Instamart 0.2x GOV less losses to fund',
      streetSource: 'Broker notes (Jul-Sep 2026); n.d. = not disclosed',
      derivationTitle: 'Our food-delivery multiple: 30x, and why',
      derivation: [
        ['1. The anchor: Eternal\'s food business', 'Elara values Zomato food at 42x Sep-28E EV/EBITDA (Jul-2026), with a 5.6% margin and faster growth', 'Starting point: ~42x'],
        ['2. Swiggy\'s discount', 'Lower margin (3.1% vs 5.6% of order value), slower growth (17% vs 20%), Toing cannibalisation risk', '~30% discount: **30x**'],
        ['3. The street on Swiggy food', '30x (Motilal Oswal, Anand Rathi), 35x (JM, Equirus), 38x (Elara), 40x (HDFC Securities)', 'We sit at the low end'],
        ['4. Instamart', 'Brokers: zero (JM), 0.25x NOV (Equirus), 0.5x NOV (HDFC Securities), DCF (Motilal Oswal), 60% discount to Blinkit (Elara)', 'We use 0.2x FY28E GOV (≈0.27x NOV) less ₹3,500 cr of losses still to fund'],
      ],
      crossNote: `EV/GOV, the yardstick used for loss-making delivery platforms, gives a value ~${Math.abs(Math.round(V.blend.methods[1].vsTarget))}% below our SOTP, so the target is not resting on an aggressive food multiple alone. The swing factor is Instamart: valued at zero (as JM does), our target would fall by ~₹${Math.round(imZero)} a share.`,
    }),
    { h: 'Sum of the parts in detail' },
    { p: 'A loss-making group of businesses cannot be valued on earnings. We value each business separately on our FY28E forecasts (sum of the parts), add the net cash we expect at March 2027, and deduct the cost of the new bets. Every input is live in the SOTP sheet of the Excel model, with Base / Bull / Bear switches.' },
    { exhibit: { type: 'table', title: 'Sum-of-the-parts valuation (base case)', head: ['Business', 'Method', 'Metric (₹ cr)', 'Multiple', 'Adjustment (₹ cr)', 'Value (₹ cr)', '₹ / share'], wide: [1], rows: [
      ...V.parts.map(vrow),
      { hl: true, cells: ['**Equity value**', '', '', '', '', '{{dcf.equity|num}}', n0(V.equity / V.shares)] },
      { hl: true, cells: ['**SOTP value (rounded)**', '', '', '', '', '', '{{dcf.intrinsicTp|inr}}'] },
    ], source: 'GAM Research estimates' } },
    { bullets: V.parts.map((p, i) => `**${p.name}:** ${M.forecast.assumptions.valuation.parts[i].note}`) },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Value / share', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}}'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', 'Food margin rises to ~4.3% of GOV by FY29 and earns 30x; Instamart losses narrow from −9.8% of GOV but it still loses money in FY29; valued at 0.2x GOV less losses to come.'] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}}'],
    ], source: 'GAM Research estimates' } },
    { callout: `**Cross-check: what is the market paying for?** Market value is ~₹${n0(mcap)} cr. If food, out-of-home, supply chain, new bets and cash are worth what we think (₹${n0(exInstamart)} cr), the market is valuing Instamart at about **${impliedIm < 0 ? '−' : ''}₹${n0(Math.abs(impliedIm))} cr**. Put differently, with Instamart at zero, the price buys the food business at ~${impliedFoodX.toFixed(0)}x FY28E EBITDA, against ~42x that brokers apply to Zomato's food business. That gap is the upside case; Instamart's burn is the risk to it.` },
    { exhibit: { type: 'table', title: 'Peers and reference valuations', head: ['Company', 'Market value', 'How it is valued'], wide: [2], rows: [
      ['**Swiggy**', `₹${n0(mcap)} cr`, `Loss-making; EV (market value less cash) ~₹${n0(mcap - cashNow)} cr ≈ ${((mcap - cashNow) / A26.gov).toFixed(1)}x FY26 GOV`],
      ['Eternal (Zomato + Blinkit)', `~₹3 lakh cr (₹${AS.competition.eternalValuation.closeOn30Sep} a share)`, 'Brokers\' sum of the parts: food at ~42x and Blinkit at ~52x Sep-28E EV/EBITDA (Elara, Jul-2026)'],
      ['Zepto (private)', 'US$7bn (last round, Oct-2025)', 'FY26 revenue ₹22,624 cr, loss ~₹5,905 cr; IPO approved but postponed'],
    ], source: `NSE closes on ${ASOF_TXT}, broker notes, press` } },
  ],
};

// ---------------------------------------------------------------- 16. Risks & verdict
const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: fairly priced for the food business; Instamart decides the rest',
  blocks: [
    { callout: `**What you are buying:** a profitable, improving #2 food-delivery business plus ~₹${n0(cashNow)} cr of cash, at a price that gives quick commerce little value. Our target {{dcf.tp|inr}} ({{dcf.upside|chg}}) sits just short of our 15% BUY line.` },
    { callout: '**What can go wrong:** Instamart keeps losing ₹3,000 cr+ a year against a dominant, profitable Blinkit; growth targets keep being reset; food delivery keeps ceding share to Zomato; Toing keeps leaking cash; gig-worker levies and GST demands add costs. In that world the cash shrinks every quarter and the "food + cash" floor erodes. That is our bear case of {{scen.bear.tp|inr}}.' },
    { exhibit: { type: 'table', title: 'Key risks', head: ['Risk', 'Likelihood', 'Impact', 'What we watch'], wide: [3], rows: [
      ['Instamart losses do not fall', 'Medium', 'High: −₹50-90/share', 'Quarterly adjusted EBITDA; contribution margin vs 0 to −1% guidance'],
      ['Price war in quick commerce (Zepto, Amazon, Flipkart)', 'Medium-high', 'High', 'Discounts (GOV − NOV gap), store additions by rivals'],
      ['Food share loss to Zomato accelerates', 'Medium', 'Medium', 'Food GOV growth vs Zomato NOV growth'],
      ['Forced selling around the foreign-ownership cap', 'Medium', 'Price, not value', 'Index changes; FPI holdings vs the 49.5% cap'],
      ['Regulation: gig-worker levies, GST on delivery fees, CCI', 'Medium', 'Low-medium', 'Notifications under the Social Security Code; court rulings'],
      ['Supply overhang: Prosus / SoftBank / Accel selling', 'Medium', 'Price, not value', 'Bulk and block deals'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: HOLD (high risk), target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Buy below ~₹${n0(buyBelow)}**, or if Instamart\'s quarterly loss falls below ₹600 cr while order value grows double digits on the quarter.`,
      `**Sell above ~₹${n0(sellAbove)}**, or if Instamart losses stay above ₹900 cr for two quarters, cash falls below ₹10,000 cr, or food growth drops below 15%.`,
      '**Position size if bought:** half a normal weight, built in tranches around results.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Food adj. EBITDA, Q1FY27', v: `₹${n0(q1.foodAdjEbitda)} cr`, d: '3.1% of GOV, up from 0.9% two years ago' },
      { k: 'Instamart loss, Q1FY27', v: `−₹${n0(-q1.imAdjEbitda)} cr`, d: `Blinkit +₹${BL.adjEbitda} cr` },
      { k: 'Cash & investments (Jun-26)', v: `₹${n0(cashNow)} cr`, d: `~${(cashNow / mcap * 100).toFixed(0)}% of market value` },
      { k: 'Implied food multiple', v: `~${impliedFoodX.toFixed(0)}x`, d: 'FY28E EBITDA, Instamart at zero' },
      { k: 'Target / bear', v: '{{dcf.tp|inr}}', d: 'bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

// ---------------------------------------------------------------- Glossary
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['GOV (gross order value)', 'Total value of orders placed by customers, including taxes, fees and tips, before discounts. The basic measure of how much business flows through the app.'],
      ['NOV (net order value)', 'Order value after all discounts. Instamart reports both; Blinkit reports NOV.'],
      ['Take rate', 'Revenue as a % of order value: the share Swiggy keeps through commissions, fees and advertising.'],
      ['Contribution margin', 'Profit on each order after delivery costs and discounts, before fixed costs such as technology and head office.'],
      ['Adjusted EBITDA', 'Swiggy\'s own profit measure: operating profit before ESOP cost, with rent treated as an operating cost.'],
      ['Reported EBITDA', 'Operating profit under accounting rules: includes ESOP cost, excludes rent (moved to depreciation and interest under Ind AS 116).'],
      ['Dark store', 'A small warehouse closed to the public, used only to pack quick-commerce orders.'],
      ['1P / inventory model', 'The platform buys and owns the goods it sells (first party), booking the full sale value as revenue. The marketplace model only earns a fee on others\' sales.'],
      ['IOCC', 'Indian-owned and controlled company. Only these may run an inventory e-commerce model; it requires foreign ownership below 50%.'],
      ['MTU', 'Monthly transacting users: customers who ordered at least once in the month.'],
      ['ESOP', 'Employee stock options. A non-cash cost in the accounts, but it dilutes existing shareholders.'],
      ['QIP', 'Qualified institutional placement: a share sale to institutional investors.'],
      ['SOTP', 'Sum of the parts: valuing each business separately and adding them up.'],
      ['EV/EBITDA, EV/GOV', 'Enterprise value (market value less net cash) divided by EBITDA or by order value; used to value businesses that are not yet profitable.'],
      ['bp / pp', '100 basis points (bp) = 1 percentage point (pp).'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, business, history, industry, tailwind, food, instamart, others, moat, p.financials, earnings, { ...p.cash, blocks: [...p.cash.blocks, ...cashBridge.blocks] }, ownership(p.ownershipBase), governance, forecasts, street, valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY24': 'Food delivery growth plus Instamart; supply-chain (wholesale) revenue also scaled.',
    'ebitdaMargin@FY21': 'COVID year: revenue fell 27% but costs were cut harder (marketing, staff).',
    'ebitdaMargin@FY22': 'Growth spending resumed after the US$700m round: discounts, marketing and Instamart expansion.',
    'ebitdaMargin@FY23': 'Revenue grew faster than costs as discounting eased; still the peak loss year in rupees (₹4,179 cr).',
    'dep@FY23': 'More leased dark stores and offices (Ind AS 116 right-of-use assets).',
    'dep@FY24': 'Dark-store expansion continued.',
    'sales@Q4FY25': 'Instamart GOV doubled YoY; supply-chain revenue up with it.',
    'sales@Q1FY26': 'Instamart GOV +108% YoY as larger "megapod" stores opened.',
    'sales@Q2FY26': 'Instamart and supply-chain growth; food +19%.',
    'sales@Q3FY26': 'Instamart GOV +103% YoY; food +20.5%.',
    'sales@Q4FY26': 'Growth slowed as Instamart GOV stalled QoQ.',
    'pat@FY27E': 'GAM estimate: Instamart losses narrow slowly from −9.8% of GOV in Q1; Toing losses ~₹650 cr.',
    'sales@FY28E': 'Revenue jumps mainly because Instamart books full sale value under the inventory (1P) model.',
    'ebitdaMargin@FY29E': 'First year of positive reported EBITDA in our forecast.',
  },
};
