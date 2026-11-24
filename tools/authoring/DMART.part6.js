// DMart report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./DMART.ctx');
const { ruleText } = require('../../src/ratings');
const { F, AS, n0, n1, price, MULT, HA, rating, buyBelow, sellAbove, medTp, epsSep, sectorDr, build } = X;
const r10 = v => Math.round(v / 10) * 10;
const epsPerPp = F.sales[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.shares; // 10bp of margin
const epsPerRps = build[1].st * 0.01 * AS.build.standaloneMargin[1] / 100 * (1 - AS.taxRate[1] / 100) / F.shares; // 1% revenue per sq ft

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a great business at a full price; ${rating}`,
  blocks: [
    { callout: `**What you are buying:** India's lowest-cost large grocery retailer, run by a disciplined, owner-aligned team, adding ~15% more stores a year with a 2-3 year land pipeline and a margin it will not chase. Growth has slowed to ~15% as same-store sales fade in crowded metros (quick commerce takes the small baskets) and new stores in smaller towns ramp slowly. Capital needs are rising: capex is above operating cash, borrowings are back and ROE is ~13%. The online arm loses ~₹300 cr a year.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS. DMart's own forward P/E has a median of ${n1(HA.med)}x since 2021; listed retailers were ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026, which gives ${MULT.base}x Sep-28E EPS and {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating} on our rule. EV/EBITDA (₹${n0(X.mv('ev').value)}) is a little below; a DCF at an 11% cost of capital (₹${n0(X.mv('dcf').value)}) is far below.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Like-for-like growth back to 8-10%', 'Medium', 'Quarterly LFL; bills per store; metro store growth (flat in Q1FY27)'],
      ['Openings at or above 15% of the base, with faster ramp-up in new states', 'Medium-High', 'H2FY27 openings (5 by 28-Jul); revenue per sq ft of the FY26 cohort'],
      ['DMart Ready losses halve in its 11 cities', 'Low-Medium', 'Consolidated less standalone EBITDA (−₹28 cr in Q1FY27)'],
      ['A further fall in the share price without an earnings cut', 'Medium', `Below ~₹${n0(buyBelow)} the stock would be a BUY on our rule`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Quick commerce takes the stock-up basket and spreads to Tier 2 towns', 'Medium', `Each 1% of revenue per sq ft ≈ ₹${n1(epsPerRps)} of FY28E EPS, ~₹${n0(r10(epsPerRps * MULT.base))} a share at ${MULT.base}x`],
      ['Price war: DMart cuts prices to defend traffic', 'Low-Medium', `Each 10bp of EBITDA margin ≈ ₹${n1(epsPerPp)} of FY28E EPS (~₹${n0(r10(epsPerPp * MULT.base))} a share)`],
      ['Land and approvals delay openings', 'Medium', '60 openings a year instead of 75-95 would cut FY29E store revenue by ~7%'],
      ['Wage inflation (labour codes, minimum wages) outruns productivity', 'Medium', 'Staff cost rose 32% in FY26; 20,994 permanent and 75,577 contract staff'],
      ['Leadership transition: strategy drifts (leases, tech, smaller stores)', 'Low', 'Returns on new stores fall; capex per store rises'],
      ['Retail stocks de-rate further', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS the stock is worth ~₹${n0(r10(MULT.bear * epsSep.base))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn BUY below ~₹${n0(buyBelow)}** and SELL above ~₹${n0(sellAbove)} on today's numbers; we would raise the target if like-for-like growth recovers towards 8-10% with openings on plan, and cut it if LFL stays near 5% and openings slip.`,
      `**This is mainly a multiple call.** Our Sep-28E EPS (₹${n1(epsSep.base)}) is a little below the street; our ${MULT.base}x sits inside the 54-65x the street's targets imply. The post-Q1 street median is ₹${n0(medTp)}.`,
      `**Biggest swing factor:** the multiple. Each 5x of P/E is ~₹${n0(r10(5 * epsSep.base))} a share; each 1% of revenue per sq ft is ~₹${n1(epsPerRps)} of FY28E EPS.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Stores at Jun-2026', v: '503', d: '85 added in FY26; ~15% a year planned' },
      { k: 'Like-for-like growth Q1FY27', v: '5.5%', d: '7.1% a year earlier; metro stores flat' },
      { k: 'DMart Ready loss FY26', v: '₹307 cr', d: 'now in 11 cities, down from 25' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(price / epsSep.base)}x`, d: `own median since 2021: ${n1(HA.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['EDLC / EDLP', 'Everyday low cost / everyday low price: keep costs low and pass the savings to customers as permanently low prices instead of promotions.'],
      ['LFL / SSSG', 'Like-for-like (same-store) sales growth: revenue growth of stores open for at least 24 months.'],
      ['Retail business area', 'Selling space in DMart stores, in million sq ft; "effective" area in our model weights stores by the part of the year they were open.'],
      ['Bill cuts', 'Number of customer bills (transactions).'],
      ['GM&A', 'General merchandise and apparel: kitchenware, plastics, home textiles, toys, garments and footwear.'],
      ['Quick commerce (QC)', 'Delivery of groceries in 10-30 minutes from small "dark stores" (Blinkit, Instamart, Zepto, Flipkart Minutes, Amazon Now).'],
      ['DMart Ready', 'DMart\'s online grocery service (Avenue E-Commerce), delivering large baskets within six hours.'],
      ['Standalone / consolidated', 'Avenue Supermarts alone (the stores) / the group including DMart Ready and other subsidiaries.'],
      ['Ind AS 116 / lease liabilities', 'Accounting rule that puts leased stores on the balance sheet; rent becomes depreciation plus interest.'],
      ['Commercial paper / NCD', 'Short-term (under one year) borrowing / non-convertible debentures (longer-term bonds).'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / cost of capital', 'Discounted cash flow valuation; the cost of capital is the required annual return used to discount future cash.'],
      ['ROE / ROCE', 'Return on equity (profit ÷ net worth) / return on capital employed (operating profit ÷ debt plus equity).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '−2.9%: Covid lockdowns; LFL −13.1%.',
  'ebitdaMargin@FY21': '7.2%: Covid lockdowns.',
  'sales@FY23': '+38%: post-Covid recovery (LFL 24.2%) and 40 new stores.',
  'pat@FY23': 'Includes a ₹138.8 cr one-off tax benefit.',
  'pat@FY25': 'Includes a ₹36.0 cr one-off tax benefit.',
  'sales@FY26': '+15.9%: 85 new stores (58 in Q4), LFL 8.1%.',
  'otherIncome@FY26': '₹74 cr: interest on deposits ₹54 cr as cash was spent on capex.',
  'pat@FY26': '₹2,970 cr, +9.7%: staff cost +32%, depreciation +19%, finance cost doubled.',
  'capex@FY26': '₹4,113 cr: record openings plus land for future years; capital commitments ₹5,294 cr at Mar-26.',
  'sales@Q3FY26': '+13%: staples deflation (CEO).',
  'sales@Q4FY26': '+19%: March pantry-loading; LFL 10.8%; 58 stores opened.',
  'sales@Q1FY27': '+14.9%: LFL 5.5%, 3 stores added; DMart Ready +~5%.',
  'interest@Q1FY27': '₹54 cr: lease interest and commercial paper.',
  'pat@Q1FY27': '₹860 cr, +11.3%: depreciation +24%, finance cost +86%.',
  'sales@FY27E': 'GAM: 75 openings, effective area +18%, revenue per sq ft −2.5%.',
  'ebitdaMargin@FY27E': 'GAM: stores 7.8%, DMart Ready loss −₹60 cr.',
  'capex@FY27E': 'GAM: ₹4,300 cr for ~15% store growth.',
  'pat@FY28E': 'GAM: FY26-27 store cohorts ramp up; margin 7.7%.',
};

module.exports = { risks, glossary, statementNotes };
