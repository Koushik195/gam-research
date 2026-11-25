// FirstCry report, part 6: risks & honest summary, glossary.
const C = require('./FIRSTCRY.ctx');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const { n0, n2, q1, V, mcap, attSep, impliedX, PI, OWN, shares, sectorMs, pc1 } = C;

const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const risks = rating => ({
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a real franchise, a broken margin, a cheap price',
  blocks: [
    { callout: `**What you are buying:** India's largest specialist in baby and kids' products, online and in 1,188 stores, with its own brands at more than half of sales, growth re-accelerating (India revenue +${q1.imcRevYoYPct}% in Q1FY27), net cash and no need for new equity. Plus a loss-making Gulf business, half of a D2C brand roll-up and a small, profitable preschool chain. Our sum of the parts gives {{dcf.tp|inr}} ({{dcf.upside|chg}}).` },
    { callout: `**What you are paying for:** ~₹${n0(mcap)} cr of market value, ~${n2(impliedX)}x our Sep-28E attributable sales (₹${n0(attSep)} cr), below the stock's own 12-month median (${n2(OWN.med)}x) and our ${PI.mult}x, after internet stocks de-rated ${pc1(sectorMs)}. The price assumes the India gross margin does not recover. If it does (input costs passed on, the diaper war cools), the stock is cheap; if quick commerce keeps diapers as a permanent loss-leader, our bear case (~flat) is the outcome. The company still reports a loss, and the DCF (₹{{dcf.blend.methods.1.value|num}}) does not support the price on today's margins.` },
    { exhibit: { type: 'table', title: 'Key risks', head: ['Risk', 'Likelihood', 'Impact', 'What we watch'], wide: [3], rows: [
      ['Upside: India gross margin recovers fully and growth stays at 15%+', 'Medium', 'High: the bull case', 'India gross margin and adjusted EBITDA % in Q2-Q3FY27; diaper pricing'],
      ['Quick commerce makes diapers and essentials a permanent price war', 'Medium-high', 'High: India margin stuck at ~6-7%; the bear case', 'Diaper share of GMV; gross margin; new-customer GMV'],
      ['Store expansion disappoints or cannibalises', 'Medium', 'Medium', 'Net store additions (90-100 guided for FY27); offline GMV growth'],
      ['International losses persist; Gulf conflict', 'Medium', `Medium: each ₹50 cr of extra loss ~₹${n0(50 / shares)} a share a year`, 'International adjusted EBITDA % (−7% in Q1FY27)'],
      ['More Globalbees impairments, write-offs or earn-out payments', 'Medium', 'Low-medium', 'Exceptional items; consideration payable (₹388 cr)'],
      ['Supply from SoftBank, Mahindra and other pre-IPO holders', 'High', 'Medium: price pressure', 'Bulk and block deals; quarterly shareholding'],
      ['ESOP dilution and pay', 'Medium', 'Low: 10.3 mn options (~2%)', 'New grants; performance-option vesting'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Buy below ~₹${n0(buyBelow)}**, and add if Q2-Q3FY27 show the India adjusted EBITDA margin back above 8% with revenue growth above 15%.`,
      `**Sell above ~₹${n0(sellAbove)}** (our sell line), or if the India margin stays near Q1FY27's ${q1.imcAePct}% through Q3FY27 (the seasonal high).`,
      '**Position size:** small. The franchise is real and the price is low against the stock\'s own history, but margins and reported profit have not turned yet and the evidence for the recovery is one quarter of management commentary.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'India revenue growth', v: `+${q1.imcRevYoYPct}%`, d: 'Q1FY27; 7.5% a year earlier' },
      { k: 'India margin', v: `${q1.imcAePct}%`, d: 'Q1FY27 adj. EBITDA; 8.8% in FY26' },
      { k: 'Owners\' loss', v: `₹${-q1.patOwners} cr`, d: 'Q1FY27; ₹140 cr in FY26' },
      { k: 'Price implies', v: `${n2(impliedX)}x sales`, d: `Sep-28E; we use ${PI.mult}x` },
      { k: 'Target / bear', v: '{{dcf.tp|inr}}', d: 'bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
});

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['GMV (gross merchandise value)', 'The value of orders on FirstCry\'s apps, websites and stores (incl. franchise stores) at MRP incl. taxes, before discounts, returns and after cancellations. Globalbees and preschools are not in GMV.'],
      ['India multi-channel', 'FirstCry\'s Indian business: online plus stores plus home-brand manufacturing.'],
      ['Home brands', 'FirstCry\'s own brands (e.g., BabyHug), made by contract or in-house manufacturers; higher margin than third-party brands.'],
      ['FOFO / COCO', 'Franchise-owned, franchise-operated stores / company-owned, company-operated stores.'],
      ['RocketBees', 'FirstCry\'s own last-mile delivery network (asset-light, using local delivery partners on its technology).'],
      ['FirstCry Qwik', 'FirstCry\'s 2-3 hour delivery service from stores, warehouses and small dark stores.'],
      ['Quick commerce', '10-30 minute grocery and essentials delivery apps (Blinkit, Instamart, Zepto and others).'],
      ['Globalbees', 'FirstCry\'s 51.68%-owned roll-up of direct-to-consumer (D2C) brands.'],
      ['Earn-out / consideration payable', 'Money Globalbees owes to founders of brands it acquired, for the stakes it still has to buy.'],
      ['Minorities (NCI)', 'Non-controlling interests: the 48.32% of Globalbees owned by other shareholders.'],
      ['Adjusted EBITDA', 'Company measure: EBITDA before ESOP cost, exceptional items and acquisition-related pay; before rent under Ind AS 116.'],
      ['Ind AS 116 / pre-Ind AS', 'Lease accounting: rent is shown as depreciation and interest, not as an operating cost. "Pre-Ind AS" EBITDA deducts rent.'],
      ['ESOP / ESOP trust', 'Employee stock options; the trust holds shares to settle them (36.5 mn shares).'],
      ['AUTC', 'Annual unique transacting customers: customers who bought at least once in the last twelve months.'],
      ['AOV', 'Average order value: GMV ÷ orders.'],
      ['SOTP', 'Sum of the parts: valuing each business separately and adding them up.'],
      ['EV/sales, EV/EBITDA', 'Enterprise value (market value less net cash, after leases) divided by revenue or EBITDA.'],
      ['Sep-28E', 'The 12 months to September 2028: the average of our FY28E and FY29E figures, the basis of our 12-month target.'],
      ['bp / pp', '100 basis points (bp) = 1 percentage point (pp).'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = { risks, glossary, buyBelow, sellAbove };
