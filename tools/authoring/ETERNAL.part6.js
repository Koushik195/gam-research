// Eternal report, part 6: risks & honest summary, glossary.
const C = require('./ETERNAL.ctx');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const { n0, n1, q1, V, mcap, cashNow, impliedQcX, PQ } = C;

const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const risks = rating => ({
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: the best business in Indian consumer internet, priced for much of its success',
  blocks: [
    { callout: `**What you are buying:** India's leading food-delivery app (5.6% margin, growing 20%) and the leading, already-profitable quick-commerce network (growing ~86%), plus ₹${n0(cashNow)} cr of cash, for a market value of ~₹${n0(mcap)} cr. Our sum of the parts gives {{dcf.tp|inr}} ({{dcf.upside|chg}}).` },
    { callout: `**What you are paying for:** valuing food, District, Hyperpure and cash as we do, the price implies ~${n1(impliedQcX)}x Blinkit's Sep-28E order value (we use ${PQ.mult}x). That is a bet that Blinkit keeps growing ~50% a year and gets to its 6% margin target. If competition keeps margins near 1-2% (our bear case), the stock is worth {{scen.bear.tp|inr}}.` },
    { exhibit: { type: 'table', title: 'Key risks', head: ['Risk', 'Likelihood', 'Impact', 'What we watch'], wide: [3], rows: [
      ['Quick-commerce price war lasts longer (Zepto, Instamart, Flipkart Minutes, Amazon Now)', 'Medium-high', 'High: Blinkit margin stuck near 1-2%', 'Blinkit adjusted EBITDA % of NOV; rivals\' discounts and funding'],
      ['Blinkit growth slows sharply', 'Medium', 'High: Blinkit is ~55% of our value', 'QoQ NOV growth, store additions, NOV per store per day'],
      ['Price-led food entrants (Toing, Ownly) erode take rates', 'Medium', 'Medium', 'Food adjusted revenue % of NOV; NOV growth vs Swiggy'],
      ['Capital intensity rises (capex per store, inventory)', 'Medium', 'Medium: lower free cash flow', 'Capex per store, net working capital days, inventory losses'],
      ['Regulation: gig-worker levies, GST on delivery fees, inventory (FDI) rules, competition-law complaints', 'Medium', 'Low-medium', 'Social Security Code notifications; state levies; CCI'],
      ['Higher tax rate for longer', 'Medium', 'Low (EPS, not SOTP)', 'Quarterly effective tax rate'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Buy below ~₹${n0(buyBelow)}**, or if Blinkit's margin reaches 2% of NOV while NOV growth stays above 60%.`,
      `**Sell above ~₹${n0(sellAbove)}**, or if Blinkit's margin turns negative again for two quarters or food NOV growth falls below 15%.`,
      '**Position size:** a full weight is justified by the quality of the franchise; add on price weakness around results rather than chasing rallies.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'B2C order value, Q1FY27', v: `₹${n0(q1.b2cNov)} cr`, d: `+${q1.b2cNovYoYPct}% YoY` },
      { k: 'Food margin, Q1FY27', v: `${q1.foodAePctNov}% of NOV`, d: 'top of 5-6% target range' },
      { k: 'Blinkit adj. EBITDA, Q1FY27', v: `₹${q1.qcAdjEbitda} cr`, d: `${q1.qcAePctNov}% of NOV; target 6%` },
      { k: 'Implied Blinkit value', v: `${n1(impliedQcX)}x NOV`, d: `Sep-28E; we use ${PQ.mult}x` },
      { k: 'Target / bear', v: '{{dcf.tp|inr}}', d: 'bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
});

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['NOV (net order value)', 'Value of orders after all discounts. Eternal\'s headline activity measure from Q1FY27.'],
      ['GOV (gross order value)', 'Value of orders before discounts, including taxes and fees. Eternal stopped disclosing it in Q1FY27; Swiggy still reports it.'],
      ['B2C', 'The consumer businesses: food delivery, quick commerce and going-out.'],
      ['Take rate', 'Revenue as a % of order value: commissions, customer fees and advertising.'],
      ['Contribution', 'Profit on each order after delivery costs, discounts and (in quick commerce) store costs, before head-office and technology costs.'],
      ['Adjusted revenue', 'Reported revenue plus customer delivery charges and platform fees in food delivery that are not booked as revenue.'],
      ['Adjusted EBITDA', 'Eternal\'s profit measure: EBITDA before ESOP cost, with rent counted as an operating cost.'],
      ['Reported EBITDA', 'Operating profit under accounting rules: includes ESOP cost, excludes rent (moved to depreciation and interest by Ind AS 116).'],
      ['1P / inventory model', 'The platform buys and owns the goods it sells, booking the full sale value as revenue.'],
      ['IOCC', 'Indian-owned and controlled company: required to run an inventory model in e-commerce.'],
      ['Dark store', 'A small warehouse closed to the public, used only to pack quick-commerce orders.'],
      ['ESOP', 'Employee stock options: a non-cash cost in the accounts that dilutes existing shareholders.'],
      ['QIP', 'Qualified institutional placement: a share sale to institutional investors.'],
      ['SOTP', 'Sum of the parts: valuing each business separately and adding them up.'],
      ['EV/EBITDA, EV/NOV, EV/sales', 'Enterprise value (market value less net cash) divided by EBITDA, order value or revenue.'],
      ['Sep-28E', 'The 12 months to September 2028: the average of our FY28E and FY29E figures, the basis of our 12-month target.'],
      ['bp / pp', '100 basis points (bp) = 1 percentage point (pp).'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = { risks, glossary, buyBelow, sellAbove };
