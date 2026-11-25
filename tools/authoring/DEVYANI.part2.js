// Devyani report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./DEVYANI.ctx');
const { C, n0, n1, Q1, A, b, f26, f25 } = X;
const AR = 'AR FY26', P4 = 'Q4FY26 presentation (15-May-2026)', P1 = 'Q1FY27 presentation and call (29-Jul-2026)';
const BZ = C.business, J = BZ.storesJun26, M26 = BZ.storesMar26;
const pctOf = v => `${n1(v / f26.revenue * 100)}%`;

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'India\'s largest Yum! franchisee: 2,255 restaurants, two-thirds of the money from KFC',
  blocks: [
    { p: `${BZ.summary} Devyani does not own KFC or Pizza Hut: it pays Yum! a royalty and continuing fees (₹${n0(BZ.royaltyFY26.value)} cr, ${BZ.royaltyFY26.pctOfRevenue}% of FY26 revenue) for exclusive development rights in its territories, and Costa Coffee similarly. Its own brands (Vaango, Biryani By Kilo, Goila Butter Chicken) are 5% of revenue.` },
    { exhibit: { type: 'table', title: 'The business lines (FY26)', head: ['Line', 'Revenue (₹ cr)', 'Share', 'Growth', 'Stores (Jun-2026)', 'What it is'], wide: [5], rows: [
      ['KFC India', n0(f26.kfcRev), pctOf(f26.kfcRev), `+${n1((f26.kfcRev / f25.kfcRev - 1) * 100)}%`, n0(J.KFC), 'Chicken; ~45% delivery, ~55% dine-in and takeaway; SSSG -0.8% in FY26, +3.3% in Q1FY27'],
      ['Pizza Hut India', n0(f26.phRev), pctOf(f26.phRev), `${n1((f26.phRev / f25.phRev - 1) * 100)}%`, n0(J.PizzaHut), 'No.2 pizza brand behind Domino\'s; daily sales per store ~₹32k (KFC ~₹98k); brand contribution negative'],
      ['Own brands', n0(f26.ownRev), pctOf(f26.ownRev), `+${n0((f26.ownRev / f25.ownRev - 1) * 100)}%`, n0(J.ownBrands), 'Vaango (South Indian), Biryani By Kilo and Goila Butter Chicken (Sky Gate, from 10-Jun-2025), incl. 23 BBK Express'],
      ['Costa and other franchisee brands', n0(f26.franchRev), pctOf(f26.franchRev), `+${n1((f26.franchRev / f25.franchRev - 1) * 100)}%`, n0(J.franchiseeBrands), 'Costa Coffee, New York Fries, Sanook Kitchen (Tea Live discontinued in FY27)'],
      ['Food courts and other India', n0(f26.indiaRev - f26.kfcRev - f26.phRev - f26.ownRev - f26.franchRev), pctOf(f26.indiaRev - f26.kfcRev - f26.phRev - f26.ownRev - f26.franchRev), '–', n0(J.foodCourts), 'The Food Street (highways, malls, airports)'],
      ['Thailand (KFC)', n0(f26.thailandRev), pctOf(f26.thailandRev), `+${n1((f26.thailandRev / f25.thailandRev - 1) * 100)}%`, n0(J.thailand), 'Restaurants Development Co., one of three KFC franchisees in Thailand; 51:49 with Camas (Temasek)'],
      ['Nigeria and Nepal', n0(f26.rowRev), pctOf(f26.rowRev), `+${n1((f26.rowRev / f25.rowRev - 1) * 100)}%`, `${J.nigeria} / ${J.nepal}`, 'KFC and Pizza Hut; Nigeria 87.31% owned (via Singapore), Nepal 100%'],
    ], source: `${AR} note 49; ${P4}; ${P1}` } },
    { pair: [
      { type: 'donut', title: 'India 67% of revenue, Thailand 30%', unit: '% of FY26 revenue', x: ['India', 'Thailand', 'Nigeria and Nepal'], series: [{ name: 'Share', values: [f26.indiaRev, f26.thailandRev, f26.rowRev].map(v => Math.round(v / f26.revenue * 1000) / 10), fmt: 'pct' }], source: `${AR} note 49` },
      { type: 'stacked', title: 'Stores: 2,039 (Mar-25) to 2,255 (Jun-26)', unit: 'Stores (period end)', x: ['Mar-25', 'Mar-26', 'Jun-26'], series: [{ name: 'India', values: [BZ.storesMar25.india, M26.india, J.india], fmt: 'num' }, { name: 'International', values: [BZ.storesMar25.international, M26.thailand + M26.nigeria + M26.nepal, J.thailand + J.nigeria + J.nepal], fmt: 'num' }], labels: 'all', source: `Merger presentation (1-Jan-2026); ${P1}` },
    ] },
    { callout: '**How it makes money:** a KFC store sells ~₹98,000 a day (₹3.2 cr a year). Food and packaging take ~31% (gross margin ~69%); staff, rent, utilities, aggregator commissions, marketing and Yum!\'s royalty take most of the rest, leaving a "brand contribution" of ~17% at KFC (Q1FY27). Head-office costs then take ~4-5 points, leaving ~9.6% "operating EBITDA" after rent for the group. Pizza Hut\'s stores sell a third as much from a similar cost base and lose money. Everything therefore hinges on daily sales per store (ADS): management says KFC margins pass 20% at ₹105-110k.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Built by Yum! franchises and acquisitions: Thailand (2024), Biryani By Kilo (2025), and now Sapphire',
  blocks: [
    { exhibit: { type: 'table', title: 'Corporate history and what it did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['1991 / 1997', 'Incorporated in the RJ Corp group of Ravi Jaipuria (also behind Varun Beverages, PepsiCo\'s bottler); first Pizza Hut in Jaipur in 1997', 'Yum! franchisee for north, east and central India'],
      ['Aug-2021', 'IPO at ₹90: ₹440 cr fresh issue, ~₹1,398 cr offer for sale by RJ Corp and Dunearn (Temasek)', 'Debt repaid; Dunearn still held 2.87% in Jun-2026'],
      ['17-Jan-2024', 'Thailand: Devyani International DMCC (51% Devyani, 49% Camas, a Temasek affiliate) bought Restaurants Development Co. (KFC Thailand) for THB 4,682 mn (~₹1,091 cr incl. shareholder loan)', 'Revenue +~₹1,500-1,700 cr a year at a lower margin; minorities rose from nil to ₹343 cr of book equity; territory rights ₹413 cr'],
      ['10-Jun-2025', 'Sky Gate Hospitality (Biryani By Kilo, Goila Butter Chicken): 80.72% for ~₹420 cr paid in 2.37 cr new shares at ₹176.78; 100% from 7-Mar-2026', 'Own-brand revenue ₹75 cr (FY25) to ₹306 cr (FY26); brand ₹495 cr and goodwill ₹171 cr booked; ₹58.5 cr paid in FY26 to minority holders (cash flow: transactions with non-controlling interests)'],
      ['FY26', 'Thai equity infusion ₹357 cr (₹118 cr loan from Devyani, ₹240 cr bridge loan repaid in April 2026); Tea Live discontinued', 'Year-end short-term debt ₹575 cr'],
      ['1-Jan-2026', 'Merger of Sapphire Foods into Devyani announced: 177 Devyani shares per 100 Sapphire shares; Arctic International (RJ Corp group) to buy 18.5% of Sapphire', 'Not effective by 30-Sep-2026 (see the merger chapter)'],
      ['1-Apr-2026', 'Manish Dawar (CFO) becomes President & Group CEO; Virag Joshi retires; new COO, CTO and CMO; Cognizant hired to build technology', '"DIL 2.0": dine-in focus at KFC, Pizza Hut "back to basics"'],
      ['Jun-Aug 2026', 'Exchange observation letters (12-Jun); Arctic purchase dropped (26-Aug); CCI and NCLT pending', 'Merged company would have 180.18 cr shares, RJ Corp group 41.99%'],
    ], source: `${AR} (notes 48, 51, 53, 57, directors' report); merger presentation (1-Jan-2026); IPO: Chittorgarh, Business Standard (16-Aug-2021); exchange letters and press (Jun-Aug 2026)` } },
    { callout: '**Why it matters:** about a third of revenue came through acquisitions in the last three years, and both deals added more revenue than profit: Thailand\'s margin is below India\'s and Temasek owns half of it; BBK only turned brand-positive in FY26. The Sapphire merger would be the largest step yet, paid in shares.' },
  ],
};

const I = X.D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: `Indian QSR: a US$${I.qsrUsdBn2026} bn market growing ~9% a year, now fought out on delivery apps`,
  blocks: [
    { p: `The company's annual report puts India's food-services market at ~US$${I.foodServicesUsdBn2026} bn in 2026, growing to ~US$${I.foodServicesUsdBn2031} bn by 2031 (~${I.foodServicesCagr}% a year), and quick-service restaurants (QSR) at ~US$${I.qsrUsdBn2026} bn growing to ~US$${I.qsrUsdBn2031} bn (~${I.qsrCagr}% a year). Growth drivers are the usual ones: incomes, urbanisation, nuclear families, women in work, and delivery apps. Management points to biryani alone as a ₹${I.biryaniMarketRsCr} cr market whose largest brand sells only ₹300-350 cr.` },
    { bullets: I.notes.map(t => t) },
    { exhibit: { type: 'table', title: 'The listed QSR operators', head: ['Company', 'Brands', 'Territory', 'Note'], wide: [3], rows: [
      ['Jubilant FoodWorks', 'Domino\'s, Popeyes, Hong\'s Kitchen; DP Eurasia (Turkey)', 'All India', 'Market leader in pizza; the QSR peer with real profits'],
      ['Devyani International', 'KFC, Pizza Hut, Costa, BBK, Vaango; KFC Thailand', 'North, east, central India; Thailand, Nigeria, Nepal', 'Largest Yum! franchisee'],
      ['Sapphire Foods', 'KFC, Pizza Hut; Sri Lanka', 'South and west India, Sri Lanka', 'Merging into Devyani'],
      ['Westlife Foodworld', 'McDonald\'s', 'West and south India', 'Master franchisee of McDonald\'s'],
      ['Restaurant Brands Asia', 'Burger King; Indonesia', 'All India', 'Loss-making'],
    ], source: 'Company filings; GAM Research' } },
    { callout: '**So what:** the market grows ~9-10% a year, so a franchisee adding ~10% more stores a year needs positive same-store sales just to keep its margins. The structural change since Covid is delivery: it now eats into dine-in rather than adding to it, aggregators run their own cheap meals, and new chicken and pizza chains enter cheaply. That is why Devyani is pushing customers back into the stores.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach the company?', title: 'Partly: chicken and travel formats benefit; pizza and delivery economics work against it',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Reaches Devyani?', 'Evidence'], wide: [2], rows: [
      ['Eating out grows with incomes', 'Yes, slowly', `India revenue +13% in FY26 and +${n1((X.SQ.at(-1).indiaRev / X.SQ[0].indiaRev - 1) * 100)}% in Q1FY27, but only ~8% excluding the BBK base effect; KFC SSSG +${Q1.kfcSssg}%`],
      ['Chicken is the fastest-growing QSR category', 'Yes', 'KFC revenue +9% in FY26 and +12% in Q1FY27 with 87 new stores in FY26'],
      ['Delivery apps', 'Against', 'Delivery rose from <10% to ~45% of KFC sales and now cannibalises dine-in; commissions and discounts are higher on delivery'],
      ['Pizza', 'No', `Pizza Hut revenue -1.6% in FY26 and Q1FY27; stores cut to ${n0(BZ.storesJun26.PizzaHut)}; Domino\'s dominates`],
      ['Indian cuisine (biryani, South Indian)', 'Early', `Own brands ₹${n0(Q1.ownBrandsRev)} cr in Q1FY27; BBK SSSG +${Q1.bbkSssg}%, Vaango +${Q1.vaangoSssg}%`],
      ['Travel (highways, airports, food courts)', 'Yes', 'Costa SSSG +10.2% in Q1FY27; BBK launched at airports and in food courts'],
      ['Weaker rupee', 'Mixed', 'International revenue +20.7% in Q1FY27 partly on currency; imported inputs and LPG cost more'],
    ], source: `${P4}; ${P1}; GAM Research` } },
    { callout: '**Verdict:** the tailwind reaches Devyani through KFC and travel formats, not through Pizza Hut or delivery. The past three years show that growth in eating out does not by itself lift a franchisee\'s profits: store openings outran demand and delivery shifted value to aggregators.' },
  ],
};

module.exports = { business, history, industry, tailwind };
