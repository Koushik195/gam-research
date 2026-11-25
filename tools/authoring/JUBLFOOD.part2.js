// Jubilant FoodWorks report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./JUBLFOOD.ctx');
const { C, D, n0, n1, f26, f25, Q1, CO } = X;
const AR = 'AR FY26', P4 = 'Q4FY26 presentation (20-May-2026)', L1 = 'Q1FY27 letter and call (13-Aug-2026)';
const BZ = C.business, ST = BZ.stores, m26 = ST['Mar-26'];
const share = (a, t) => Math.round(a / t * 1000) / 10;

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: `A pizza-delivery machine with two growth add-ons: ${n0(m26.total)} stores in six countries, 72% of revenue from India`,
  blocks: [
    { p: `${BZ.summary} In FY26 revenue was ₹${n0(CO.revenue)} cr: sales within India ₹${n0(f26.indiaRev)} cr (${share(f26.indiaRev, CO.revenue)}%; Domino's ₹${n0(BZ.dominosIndia.revenueFY26)} cr) and outside India ₹${n0(f26.intlRev)} cr (DP Eurasia ₹${n0(BZ.dpEurasia.revenueFY26)} cr, Sri Lanka ₹${n0(BZ.sriLanka.revenueFY26)} cr, Bangladesh ₹${n0(BZ.bangladesh.revenueFY26)} cr). Group system sales, including sub-franchisees' stores, were ₹10,984 cr.` },
    { exhibit: { type: 'table', title: 'The businesses (FY26, continuing operations)', head: ['Business', 'Revenue (₹ cr)', 'Growth', 'Stores (Mar-26)', 'What it is'], wide: [4], rows: [
      ['Domino\'s India', n0(BZ.dominosIndia.revenueFY26), `+${BZ.dominosIndia.growthFY26}%`, n0(m26.dominosIndia), '76% delivery, own app and rider fleet; 540 cities at Jun-2026; LFL 6.5% in FY26, 2.5% in Q1FY27'],
      ['Popeyes + Hong\'s Kitchen (India)', n0(f26.emergingRev), '–', `${m26.popeyes} + ${m26.hongs}`, 'Popeyes fried chicken (US franchise, mall-led, SSG 28% in FY26); Hong\'s Indo-Chinese (own brand, not being expanded)'],
      ['DP Eurasia (93.65%)', n0(BZ.dpEurasia.revenueFY26), `+${BZ.dpEurasia.growthFY26}%`, `${m26.dpeuDominos} + ${m26.coffy} COFFY`, 'Domino\'s master franchise in Turkey, Azerbaijan and Georgia (incl. sub-franchised stores) and COFFY cafes; PAT ₹204 cr (8.3%)'],
      ['Sri Lanka / Bangladesh', `${n0(BZ.sriLanka.revenueFY26)} / ${n0(BZ.bangladesh.revenueFY26)}`, `+${BZ.sriLanka.growthFY26}% / +${BZ.bangladesh.growthFY26}%`, `${m26.sriLanka} / ${m26.bangladesh}`, 'Domino\'s; Bangladesh is a 51:49 joint venture'],
      ['Discontinued: Dunkin\' India, Russia', '32 (Dunkin\')', '–', '27 (Dunkin\')', 'Dunkin\' rights not renewed (Mar-2026); Russia sold in FY26'],
    ], source: `${P4} slides 5-6, 19-21; ${AR} notes 43 and 45. Popeyes + Hong's revenue derived as sales within India less Domino's India.` } },
    { pair: [
      { type: 'donut', title: 'India is 72% of revenue', unit: '% of FY26 revenue', x: ['Domino\'s India', 'Popeyes and Hong\'s', 'DP Eurasia', 'Sri Lanka + Bangladesh'], series: [{ name: 'Share', values: [share(BZ.dominosIndia.revenueFY26, CO.revenue), share(f26.emergingRev, CO.revenue), share(BZ.dpEurasia.revenueFY26, CO.revenue), share(f26.intlRev - BZ.dpEurasia.revenueFY26, CO.revenue)], fmt: 'pct' }], source: `${AR}; ${P4}` },
      { type: 'stacked', title: `Stores: ${n0(ST['Mar-25'].total)} (Mar-25) to ${n0(m26.total)} (Mar-26) and ${n0(ST['Jun-26'].total)} (Jun-26)`, unit: 'Stores (period end, ex-Dunkin\')', x: ['Mar-25', 'Mar-26'], series: [{ name: 'Domino\'s India', values: [ST['Mar-25'].dominosIndia, m26.dominosIndia], fmt: 'num' }, { name: 'Popeyes + Hong\'s', values: [ST['Mar-25'].popeyes + ST['Mar-25'].hongs, m26.popeyes + m26.hongs], fmt: 'num' }, { name: 'DP Eurasia (Domino\'s + COFFY)', values: [ST['Mar-25'].dpeuDominos + ST['Mar-25'].coffy, m26.dpeuDominos + m26.coffy], fmt: 'num' }, { name: 'Sri Lanka + Bangladesh', values: [ST['Mar-25'].sriLanka + ST['Mar-25'].bangladesh, m26.sriLanka + m26.bangladesh], fmt: 'num', color: '#7a6fb0' }], minLabel: 80, source: P4 },
    ] },
    { callout: '**How it makes money:** JFL buys and processes its own ingredients in central commissaries, delivers through its own riders, and keeps a ~75% gross margin on Domino\'s India. Out of that it pays staff (~17% of revenue), royalties to Domino\'s Pizza Inc., rent (~7.5% of India revenue), marketing, energy and delivery costs. What is left is ~20% EBITDA before rent and ~12.6% after it in India. Scale is the business model: more stores in the same city lower the delivery time and the supply-chain cost per order.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From one Domino\'s store in 1996 to a multi-country group: the Turkey deal changed the numbers more than anything else',
  blocks: [
    { exhibit: { type: 'table', title: 'Corporate history and what it did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['1995-96', 'Incorporated by the Jubilant Bhartia group; first Domino\'s store in 1996', 'Domino\'s master franchisee for India; Sri Lanka and Bangladesh added later'],
      ['FY20', 'Ind AS 116 adopted', 'Rent left EBITDA (margin up ~5 points) and lease liabilities entered borrowings (₹1,670 cr)'],
      ['FY23', 'Shares split to ₹2 face value', '~66 cr shares since; per-share history adjusted'],
      ['1-Feb-2024', 'Control of DP Eurasia (Turkey, Azerbaijan, Georgia, Russia) after a tender offer; 94.33% by Mar-2024', '₹770 cr for the additional stake; ₹170 cr remeasurement gain (exceptional, FY24); FY25 revenue +43%; euro acquisition loans'],
      ['FY26', 'Russia (Pizza Restaurants LLC) sold', '₹85 cr gain in discontinued operations; bankruptcy claims provision written back'],
      ['Nov-2025', 'Labour Codes notified', '₹34 cr exceptional charge in Q3FY26 (gratuity and leave)'],
      ['30-Mar-2026', 'Dunkin\' India rights not renewed', 'Re-presented as discontinued (FY26 loss ₹24 cr); 15 stores left at Jun-2026'],
      ['Mar-2026', 'Mumbai supply-chain centre commissioned', 'Depreciation up in Q1FY27; "major supply chain capacity investments now largely complete"'],
    ], source: `${AR} notes 45 and 41; AR FY24 note 41; ${P4}; ${L1}` } },
    { callout: '**What it means for the numbers:** comparisons across FY24-FY26 need care. FY24 includes two months of Turkey and a one-off gain; FY25 is the first full Turkey year; FY25-26 were re-presented without Dunkin\'; and Turkey has been hyperinflationary since 30-Jun-2022, so DP Eurasia reports under IAS 29 (Ind AS 29) (IAS 29), restating each quarter to the latest price level and translating at the closing lira rate.' },
  ],
};

const IN = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Indian QSR: a small, fast-growing category where aggregators now set the price of convenience',
  blocks: [
    { p: IN.summary.replace(/Rs ?/g, '₹') },
    { p: `${IN.dominosShare} ${IN.turkey}` },
    { exhibit: { type: 'table', title: 'What drives the category (and what is against it)', head: ['Factor', 'Direction', 'Evidence'], wide: [2], rows: [
      ['Under-penetration of eating out', 'Tailwind', 'Management: 6-7 mn Indians eat pizza in a month, ~3 of 1,000 meals a year; chains ~6% of foodservice (company presentation)'],
      ['Delivery and digital adoption', 'Tailwind for Domino\'s', 'Delivery 76% of Domino\'s India revenue; own apps 19.5 mn monthly active users (+21%)'],
      ['Aggregator price war on convenience', 'Headwind', 'Minimum orders cut to ₹99 and ₹49; Domino\'s matched at ₹99 ("a lagging action... it hurts the economics")'],
      ['Cost inflation (LPG, cheese, oil, wages)', 'Headwind', '~200 bp margin headwind seen for FY27, ~20 bp after pricing and productivity in Q1'],
      ['Shift from dine-in', 'Headwind', 'Solo orders under ₹250 fell most; ~400 dine-in-heavy stores being upgraded'],
      ['Peers\' weak same-store sales', 'Mixed', 'Devyani, Sapphire and RBA loss-making in FY26; Macquarie (26-Aug-2026) saw Q2 SSSG ahead of Q1 across QSR'],
    ], source: `${P4}; ${L1}; Screener.in; Macquarie via Business Upturn (26-Aug-2026)` } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach the company?', title: 'Partly: JFL wins the delivery share, but the aggregators take the economics of small orders',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Reaches JFL?', 'Evidence'], wide: [2], rows: [
      ['More Indians ordering food online', 'Yes', 'Domino\'s orders +10.4% in Q4FY26 and +6.5% in Q1FY27; delivery share +80 bp among the top 25 QSRs (NielsenIQ)'],
      ['Higher spend per order', 'No', 'Average order value fell with the ₹99 minimum order; LFL (2.5%) below order growth (6.5%) despite 140 bp of price'],
      ['Smaller towns joining organised QSR', 'Yes', '19 new cities in Q1FY27 (540 in all); smaller delivery-and-carry-out stores (600-700 sq ft)'],
      ['Protein and chicken demand', 'Yes', 'Popeyes LFL 40%+, revenue +97%; Chicken Maxxx at Domino\'s'],
      ['Turkish consumption', 'In lira, yes; in real terms, no', `Domino's Turkey LFL +${BZ.dpEurasia.q1fy27.lflDominosTry}% in lira, ${BZ.dpEurasia.q1fy27.lflDominosInflAdj}% after inflation (Q1FY27)`],
    ], source: `${P4}; ${L1}` } },
    { callout: '**Verdict:** the volume tailwind reaches JFL, and it is gaining share in delivery. The value tailwind does not, at least not now: aggregators have made small orders cheap, so Domino\'s sells more orders at lower tickets, and LFL lags order growth. Popeyes is the cleaner beneficiary of the protein trend.' },
  ],
};

module.exports = { business, history, industry, tailwind };
