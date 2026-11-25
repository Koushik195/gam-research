// Jubilant FoodWorks report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./JUBLFOOD.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, n0, n1, n2, price, shares, evMULT, HEV, rating, buyBelow, sellAbove, medTp, ebitdaSep28, Q1, evSepNow, preMultAt, mShare, C } = X;
const perX = ebitdaSep28 * (1 - mShare) / shares, perPp = evMULT.base * (F.sales[1] + F.sales[2]) / 2 / 100 * (1 - mShare) / shares;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a slower but sound business at ${n1(evSepNow)}x Sep-28E EBITDA; ${rating} on valuation`,
  blocks: [
    { callout: `**What you are buying:** India's largest QSR (2,455 Domino's stores, 76% delivery on its own app and fleet), a supply chain built for ~5,000 stores, Popeyes growing ~100%, and a cash-generating Turkish franchise (DP Eurasia, ₹204 cr PAT in FY26). Growth has slowed: Domino's LFL ${C.business.dominosIndia.lfl.Q1FY27}% in Q1FY27, revenue per store flat, margins ~20% before rent and ~13% after it.` },
    { callout: `**What you are paying:** ₹${n2(price)} is ${n1(evSepNow)}x Sep-28E EBITDA (leases in debt), ≈${n1(preMultAt(price))}x after rent on the street's basis, and ${n1(price / F.eps[1])}x FY28E EPS. Since Apr-2021 the stock has traded at a median ${n1(HEV.med)}x forward EBITDA; QSR peers trade ~${Math.abs(Math.round(X.sectorEv))}% below their five-year medians, JFL ~${Math.abs(Math.round(X.dr5Ev.JUBLFOOD))}% below its own. The rule gives ${evMULT.base}x; the street median is ₹${n0(medTp)}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Domino\'s LFL back in the 5-7% range', 'Medium', 'Q2FY27 LFL (management: better than Q1); dine-in/takeaway trend in the ~400 upgraded stores'],
      ['After-rent margin +200 bp by FY28 as guided', 'Medium-Low', 'Standalone adjusted EBITDA margin 12.6% in FY26; we model ~+125 bp over three years'],
      ['Popeyes EBITDA break-even', 'Medium', '35-40 openings a year; ADS above ₹1 lakh in more cities'],
      ['Aggregators raise minimum order values again', 'Low-Medium', 'Would restore Domino\'s ticket sizes and dine-in traffic'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['LFL stays near zero as aggregators and rivals compete on price', 'Medium', 'India growth only from stores; revenue per store falls further'],
      ['Input inflation (LPG, cheese, oil, chicken) and wage codes', 'Medium-High', 'Margin flat or down; more price increases risk orders'],
      ['Lira collapse or a hyperinflation shock in Turkey', 'Medium', 'Lower rupee EBITDA and dividends; a weaker rupee also raises the euro loans'],
      ['Refinancing of ~₹1,183 cr of euro loans due in FY27', 'Low', 'Interest cost up if refinanced at higher rates; cash if repaid'],
      ['Cannibalisation from ~250 Domino\'s openings a year', 'Medium', 'New stores split catchments; store-level returns fall'],
      ['Franchise terms (Domino\'s Pizza Inc., RBI for Popeyes)', 'Low', 'Royalty or renewal changes would hit margins'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD above ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers.`,
      `**This is a multiple call, not an earnings call.** Our EPS matches consensus (FY28E ₹${n2(F.eps[1])} vs ₹9.1). The stock has de-rated by more than its peers (trailing EV/EBITDA ${n1(X.P.JUBLFOOD.evEbitda)}x vs a ${n1(X.MED5EV.JUBLFOOD)}x five-year median), and our ${evMULT.base}x only assumes it trades like its peers relative to its own history.`,
      `**Biggest swing factors:** the multiple (each 1x of Sep-28E EBITDA is ~₹${n0(perX)} a share) and the margin (each point of Sep-28E EBITDA margin moves the target by ~₹${n0(perPp)}).`,
      '**What would change our mind:** a second year of LFL below 3% with flat margins would argue that the old multiple history no longer applies; we would then lean on the post-Turkey window (sensitivity row: 15.5x).',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Domino\'s India LFL', v: `${C.business.dominosIndia.lfl.Q1FY27}%`, d: 'Q1FY27; guide 5-7%' },
      { k: 'Order growth', v: `+${C.business.dominosIndia.q1fy27.orderGrowth}%`, d: 'Q1FY27, Domino\'s India' },
      { k: 'Popeyes revenue', v: `+${C.business.popeyes.revenueGrowthQ1FY27}%`, d: 'Q1FY27; 88 stores' },
      { k: 'EV ÷ Sep-28E EBITDA', v: `${n1(evSepNow)}x`, d: `median since Apr-2021: ${n1(HEV.med)}x forward` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['QSR', 'Quick-service restaurant: fast food sold over the counter, for takeaway or delivery.'],
      ['LFL', 'Like-for-like growth: revenue growth of mature stores (Domino\'s: non-split stores opened before the previous financial year).'],
      ['ADS', 'Average daily sales per store.'],
      ['DITA', 'Dine-in and takeaway: orders placed or collected in the store.'],
      ['MOV', 'Minimum order value for free delivery (₹99 at Domino\'s, cut from ₹149; ₹49-99 at aggregators).'],
      ['Aggregators', 'Food-delivery apps (Zomato, Swiggy) that list many restaurants and deliver for them.'],
      ['Master franchisee', 'A company licensed to run and sub-license a global brand in a country, paying royalties to the brand owner.'],
      ['Ind AS 116', 'The lease rule: rent is booked as depreciation of a right-of-use asset plus interest on a lease liability, not as an operating cost.'],
      ['EBITDA (reported / post-Ind AS)', 'Earnings before interest, tax, depreciation and amortisation as reported; it excludes rent.'],
      ['EBITDA after rent (pre-Ind AS / adjusted)', 'EBITDA less rent; the basis of management\'s margin targets and the street\'s multiples.'],
      ['IAS 29 / hyperinflation accounting', 'Rules for economies with very high inflation (Turkey since 2022): figures are restated to the latest price level, and a monetary gain or loss is booked on net monetary items.'],
      ['Monetary gain/loss (MGL)', 'The gain (or loss) from holding net monetary liabilities (or assets) while prices rise; inside DP Eurasia\'s reported EBITDA.'],
      ['Discontinued operations', 'Businesses being exited (Dunkin\' India, Russia), shown in one line below continuing profit; prior years are re-presented.'],
      ['Minorities (non-controlling interest)', 'Outside shareholders of subsidiaries (6.35% of DP Eurasia, 49% of the Bangladesh company).'],
      ['SOTP', 'Sum of the parts: each business valued separately and added up, less debt and minorities.'],
      ['EV/EBITDA, P/E', 'Enterprise value (market value plus debt incl. leases and minorities, less cash) ÷ EBITDA; share price ÷ earnings per share.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move', 'How far comparable stocks trade above or below their own five-year median multiple on the valuation date.'],
      ['DCF', 'Discounted cash flow valuation; one discount rate (here ~11.9%), lease principal treated as capex.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '−16%: Covid lockdowns.',
  'sales@FY22': '+33%: recovery with delivery-led growth.',
  'pat@FY24': 'Includes a ₹170 cr pre-tax gain on remeasuring the earlier DP Eurasia stake (control from 1-Feb-2024); ~₹273 cr before it.',
  'sales@FY24': 'DP Eurasia consolidated for February-March 2024.',
  'sales@FY25': '+43%: first full year of DP Eurasia; re-presented without Dunkin\'.',
  'pat@FY25': 'Discontinued Dunkin\' and Russia losses ₹33 cr; continuing profit before one-offs ₹245 cr.',
  'interest@FY25': 'Includes ₹217 cr of bank interest (DP Eurasia lira loans, euro acquisition loans).',
  'interest@FY26': 'Bank interest down to ₹99 cr after lira loans moved to euro; lease interest ₹337 cr.',
  'otherIncome@FY26': 'Screener line includes the ₹34 cr Labour Code charge, the +₹58 cr discontinued result (Russia gain) and associates.',
  'pat@FY26': 'After ₹15.8 cr of minorities; ~₹401 cr to owners before exceptional and discontinued items.',
  'ebitda@FY26': 'Company EBITDA ₹1,888 cr; Screener ₹1,902 cr (store-discard losses below EBITDA).',
  'cfo@FY26': 'Before ₹641 cr of lease payments (principal and interest, financing cash flow).',
  'capex@FY27E': 'Forecast capex includes lease principal (₹345 cr in FY27E).',
  'otherIncome@Q2FY26': 'Includes the Russia sale gain (discontinued operations).',
  'pat@Q2FY26': 'Includes the Russia sale gain; as first reported (Dunkin\' inside).',
  'pat@Q4FY24': 'Includes the DP Eurasia remeasurement gain.',
  'otherIncome@Q3FY26': 'Net of the ₹34 cr Labour Code exceptional charge.',
  'opm@Q1FY27': '19.6%; standalone 19.5% with gross margin 75.5%.',
};

module.exports = { risks, glossary, statementNotes };
