// Meesho report, part 6: risks & honest summary, glossary.
const C = require('./MEESHO.ctx');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const { n0, n2, q1, V, mcap, nmvSep, impliedX, PM, OWN } = C;

const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const risks = rating => ({
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a strong franchise at a full price',
  blocks: [
    { callout: `**What you are buying:** India's largest e-commerce platform by buyers and orders, growing NMV ~30%, with a real cost advantage (zero commission, Valmo), ₹${n0(q1.cash)} cr of cash and a business that funds its own growth. Our sum of the parts gives {{dcf.tp|inr}} ({{dcf.upside|chg}}).` },
    { callout: `**What you are paying for:** ~₹${n0(mcap)} cr of market value for a marketplace that still loses 1.2% of NMV. The price implies ~${n2(impliedX)}x our Sep-28E NMV, above the stock's own median (${n2(OWN.med)}x) since January and our ${PM.mult}x. To justify it, ads must lift margins to the street's 3-4% of NMV by FY30-31 while growth stays above 25%. We think margins rise more slowly because Meesho reinvests its savings in lower prices.` },
    { exhibit: { type: 'table', title: 'Key risks', head: ['Risk', 'Likelihood', 'Impact', 'What we watch'], wide: [3], rows: [
      ['Upside: ads scale faster (take rate toward 3% of NMV)', 'Medium', 'High: the bull case and the street\'s targets', 'Contribution margin above 5% of NMV; revenue growth ahead of NMV'],
      ['Competition: Flipkart Shopsy, Amazon Bazaar, quick commerce', 'Medium-high', 'High: slower growth or more spending', 'NMV growth vs the 25% guide; growth spend % of NMV'],
      ['Falling order values erode unit economics (Macquarie\'s case)', 'Medium', 'Medium', 'AOV (−5% a year by design); contribution per order'],
      ['Supply overhang from venture investors (~40%)', 'High', 'Medium: price pressure around block deals', 'Bulk/block deals; next lock-in milestone Jun-2027'],
      ['GST on Valmo freight (GTA model) and ₹2,072 cr of income-tax demands', 'Low-medium', 'Medium: up to ~₹4 a share for tax demands', 'Tax notices; appeals; disclosure of contingent liabilities'],
      ['Logistics disruption (as in Q2-Q3FY26)', 'Low-medium', 'Medium', 'Contribution margin, RTO and cancellation rates'],
      ['Credit risk in financial services (first-loss guarantees)', 'Low', 'Low-medium', 'Size of guaranteed loan book; new-initiative losses vs the ₹200 cr cap'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Buy below ~₹${n0(buyBelow)}**, or if contribution margin moves above 5.5% of NMV with NMV growth above 25% (it would put our bull case in play).`,
      `**Sell above ~₹${n0(sellAbove)}** (our sell line), or if contribution margin falls back below 4% or NMV growth across Q2+Q3FY27 drops below 20%.`,
      '**Position size:** an underweight. The franchise is real, but the stock has doubled from its IPO price on a multiple above its own history, and supply from venture holders will keep coming.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'NMV, Q1FY27', v: `₹${n0(q1.nmv)} cr`, d: `+${q1.nmvYoYPct}% YoY` },
      { k: 'Contribution margin', v: `${q1.cmPct}% of NMV`, d: 'Q1FY27; 2.3% at the Q3FY26 low' },
      { k: 'Marketplace adj. EBITDA', v: `${q1.mpAePct}% of NMV`, d: 'break-even in FY28E (GAM)' },
      { k: 'Price implies', v: `${n2(impliedX)}x NMV`, d: `Sep-28E; we use ${PM.mult}x` },
      { k: 'Target / bear', v: '{{dcf.tp|inr}}', d: 'bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
});

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['NMV (net merchandise value)', 'Value of orders actually delivered and not returned, after checkout discounts, including taxes. Meesho\'s headline activity measure.'],
      ['GMV (gross merchandise value)', 'Value of all orders placed, including cancelled, returned and undelivered ones.'],
      ['ATU', 'Annual transacting users: people who placed at least one order in the last twelve months.'],
      ['AOV', 'Average order value: NMV ÷ orders.'],
      ['Zero commission', 'Sellers pay no percentage of the sale price; Meesho earns from delivery fees and ads instead.'],
      ['Valmo', 'Meesho\'s logistics platform: it pools small truckers, sorting centres and couriers rather than owning them.'],
      ['GTA', 'Goods Transport Agency: a GST category for road-freight operators, taxed at 5% instead of 18%.'],
      ['RTO', 'Return to origin: a parcel that could not be delivered and goes back to the seller.'],
      ['Contribution margin', 'Revenue less the costs of each order (delivery, payments, order handling), as a % of NMV.'],
      ['Adjusted EBITDA', 'Meesho\'s segment profit: before ESOP cost, exceptional items, depreciation, interest and other income.'],
      ['LTM FCF / FCFE', 'Free cash flow over the last twelve months; FCFE adds treasury income.'],
      ['Re-domicile (reverse flip)', 'Moving the parent company from the US to India, completed in 2025.'],
      ['Lock-in', 'The six months after an IPO during which pre-IPO shareholders may not sell.'],
      ['ESOP', 'Employee stock options: a non-cash cost in the accounts that dilutes existing shareholders.'],
      ['SOTP', 'Sum of the parts: valuing each part separately and adding them up.'],
      ['EV/NMV, EV/EBITDA, EV/sales', 'Enterprise value (market value less net cash) divided by order value, EBITDA or revenue.'],
      ['Sep-28E', 'The 12 months to September 2028: the average of our FY28E and FY29E figures, the basis of our 12-month target.'],
      ['bp / pp', '100 basis points (bp) = 1 percentage point (pp).'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = { risks, glossary, buyBelow, sellAbove };
