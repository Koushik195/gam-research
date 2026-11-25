// Urban Company report, part 6: risks & honest summary, glossary.
const C = require('./URBANCO.ctx');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const { n0, n2, q1, V, mcap, coreSep, impliedX, PI, OWN, ihPvBase, shares } = C;

const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const risks = rating => ({
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good core, an expensive experiment, a full price',
  blocks: [
    { callout: `**What you are buying:** India's only scaled, trusted online home-services brand, with a core that grows ~20-30% and earns rising margins (India services ${q1.icsAePct}% of NTV in Q1FY27), profitable international operations, a Native products arm near breakeven, ₹${n0(q1.cash)} cr of cash and no debt. Our sum of the parts gives {{dcf.tp|inr}} ({{dcf.upside|chg}}).` },
    { callout: `**What you are paying for:** ~₹${n0(mcap)} cr of market value. With InstaHelp at the present value of its losses (−₹${n0(ihPvBase)} cr), the price implies ~${n2(impliedX)}x our Sep-28E core NTV, above the stock's own median (${n2(OWN.med)}x) and our ${PI.mult}x, at a time when internet stocks have de-rated. To justify it, either India services must reach its 9-10% margin target sooner while growing 25%+, or InstaHelp must turn from a ₹500 cr-a-year cost into a valuable business. Both are possible; neither is in our base case.` },
    { exhibit: { type: 'table', title: 'Key risks', head: ['Risk', 'Likelihood', 'Impact', 'What we watch'], wide: [3], rows: [
      ['Upside: India services keeps growing ~30% with margins toward 9-10% of NTV', 'Medium', 'High: the bull case and the street bulls', 'Q2-Q3FY27 NTV growth (the Q1 base was weak); margin on an annual basis'],
      ['Upside: InstaHelp wins the category and prices rise to ~₹200 an hour', 'Low-medium', 'High: a positive value instead of −₹6 a share', 'Loss per order (₹346 in Q1FY27); AOV; rivals\' funding'],
      ['InstaHelp subsidy war lasts longer or costs more', 'Medium-high', `Medium-high: each year of ₹480 cr losses ~₹${n0(480 / shares)} a share`, 'Quarterly InstaHelp loss vs ₹132 cr; Snabbit/Pronto fund-raises'],
      ['Partner supply, social-security costs and protests', 'Medium', 'Medium: labour codes cost 1-2% of turnover (capped at 5% of payouts)', 'Partner earnings and churn; state gig-worker rules'],
      ['Supply overhang from venture funds (~40%)', 'High', 'Medium: price pressure around block deals', 'Bulk/block deals; Accel, VY, Bessemer, Elevation, Prosus stakes'],
      ['Middle East conflict and rupee', 'Medium', 'Low-medium: International is ~16% of NTV', 'UAE demand; Native and B2B2C input costs'],
      ['Tax: further reversal of ₹151 cr deferred-tax assets; GST disputes (₹116 cr contingent)', 'Low-medium', 'Low: up to ~₹1-2 a share', 'Tax notes; GST orders'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Buy below ~₹${n0(buyBelow)}**, or if InstaHelp's quarterly loss falls clearly below ₹100 cr while India services keeps growing above 25% (it would put our bull case in play).`,
      `**Sell above ~₹${n0(sellAbove)}** (our sell line), or if India services growth falls back below 20% or the InstaHelp loss rises above ₹150 cr a quarter.`,
      '**Position size:** underweight. The core franchise is real and improving, but the price already discounts the good outcome for InstaHelp, the sector has de-rated, and venture holders keep selling.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'India services NTV, Q1FY27', v: `₹${n0(q1.icsNtv)} cr`, d: `+${q1.icsNtvYoYPct}% YoY; ${q1.icsAePct}% margin` },
      { k: 'Core adj. EBITDA', v: `₹${q1.adjEbitdaExIH} cr`, d: 'Q1FY27; ₹106 cr in all of FY26' },
      { k: 'InstaHelp loss', v: `₹${-q1.ihAe} cr`, d: 'Q1FY27; ₹346 per order' },
      { k: 'Price implies', v: `${n2(impliedX)}x core NTV`, d: `Sep-28E; we use ${PI.mult}x` },
      { k: 'Target / bear', v: '{{dcf.tp|inr}}', d: 'bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
});

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['NTV (net transaction value)', 'What customers pay for services booked on the platform (incl. taxes, after discounts and cancellations) plus Native product sales. Urban Company\'s headline activity measure.'],
      ['Take rate', 'Revenue as a % of NTV: the share of what the customer pays that Urban Company keeps (commission, fees, product sales).'],
      ['Full-stack / managed marketplace', 'The platform does not just list providers: it trains, equips, prices, insures and rates them, and handles complaints.'],
      ['Service partner', 'An independent professional (beautician, electrician, cleaner) who delivers jobs booked through the app.'],
      ['Contribution profit', 'Revenue less the costs of each job: products, payment and support costs, partner incentives, refunds, cloud costs.'],
      ['Adjusted EBITDA', 'Urban Company\'s segment profit: after rent, before ESOP cost, one-offs, the Saudi JV loss, depreciation, interest and other income.'],
      ['InstaHelp', 'On-demand house help (daily cleaning, housekeeping) booked by the hour; launched in 2025.'],
      ['Native', 'Urban Company\'s own-brand water purifiers and electronic door locks.'],
      ['Yammak / KSA JV', 'Urban Company\'s 50:50 joint venture in Saudi Arabia with SMASCO; equity-accounted.'],
      ['ATU', 'Annual transacting users: customers who ordered at least once in the last twelve months.'],
      ['ESOP / ESOP trust', 'Employee stock options; the trust holds shares bought to settle them (treasury shares).'],
      ['DTA', 'Deferred-tax asset: future tax savings from past losses, booked as an asset; written back if the losses may lapse.'],
      ['Lock-in', 'The six months after an IPO during which pre-IPO shareholders may not sell (ended 17-Mar-2026).'],
      ['SOTP', 'Sum of the parts: valuing each business separately and adding them up.'],
      ['EV/NTV, EV/sales, EV/EBITDA', 'Enterprise value (market value less net cash) divided by NTV, revenue or EBITDA.'],
      ['PV of losses', 'The present value of the losses a start-up still has to fund before it breaks even, deducted from value.'],
      ['Sep-28E', 'The 12 months to September 2028: the average of our FY28E and FY29E figures, the basis of our 12-month target.'],
      ['bp / pp', '100 basis points (bp) = 1 percentage point (pp).'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = { risks, glossary, buyBelow, sellAbove };
