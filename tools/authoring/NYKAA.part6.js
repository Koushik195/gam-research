// Nykaa report, part 6: risks & honest summary, glossary.
const C = require('./NYKAA.ctx');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const { n0, n1, q1, V, mcap, impliedBX, PB, PF } = C;

const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const dcfV = V.blend.methods[1];
const risks = rating => ({
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a better business than the 2023 market thought, at a price that already says so',
  blocks: [
    { callout: `**What you are buying:** India's leading specialist beauty retailer (Beauty GMV +${q1.bGmvYoY}% at a ${q1.bEbitdaPctNsv}% margin on NSV), a portfolio of owned brands, and a Fashion business that has just reached breakeven, for a market value of ~₹${n0(mcap)} cr. Our sum of the parts gives {{dcf.tp|inr}} ({{dcf.upside|chg}}).` },
    { callout: `**What you are paying for:** with Fashion at our value, ~${Math.round(impliedBX)}x Beauty's Sep-28E EBITDA (we use ${PB.mult}x, the street's median), or ~${Math.round(C.price / ((C.F.eps[1] + C.F.eps[2]) / 2))}x our Sep-28E EPS. Our DCF at a 12.5% cost of equity gives only ₹${n0(dcfV.value)}: to justify today's price on cash flows you need fast growth for 15+ years. If quick commerce slows Beauty to ~21% and Fashion stalls (our bear case), the stock is worth {{scen.bear.tp|inr}}.` },
    { exhibit: { type: 'table', title: 'Key risks', head: ['Risk', 'Likelihood', 'Impact', 'What we watch'], wide: [3], rows: [
      ['Quick commerce (Blinkit, Zepto, Instamart, Flipkart Minutes) takes mass beauty', 'Medium-high', 'High: Beauty growth and the 50x multiple', 'Beauty order growth (+19% in Q1FY27) and AOV; Nykaa Now share of orders'],
      ['Reliance (Tira) and Myntra spend to win beauty share', 'Medium', 'Medium-high', 'Beauty marketing as % of NSV; exclusive brand launches'],
      ['Fashion growth fades after Nike laps (Q4FY27)', 'Medium', 'Medium: Fashion is ~15% of our value', 'Fashion GMV growth ex-Nike; EBITDA staying positive'],
      ['Superstore (eB2B) losses persist', 'Medium', 'Low-medium', 'Superstore GMV growth (+17% in Q1FY27); any loss disclosure'],
      ['Valuation de-rating of Indian internet stocks', 'Medium', 'High: Info Edge and IndiaMART trade 38-59% below their five-year P/E medians', 'Sector multiples; FII flows'],
      ['Dot & Key buy-out costs more than booked', 'Low', 'Low (₹270 cr liability today)', 'Put-option revaluation'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Buy below ~₹${n0(buyBelow)}**, or if Beauty NSV growth holds near 30% while its margin passes 11% of NSV.`,
      `**Sell above ~₹${n0(sellAbove)}**, or if Beauty NSV growth falls below 20% for two quarters (the quick-commerce risk showing up).`,
      '**Position size:** a market weight; the business deserves to be owned, but the margin of safety is thin and the DCF gap is wide.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Beauty GMV growth, Q1FY27', v: `+${q1.bGmvYoY}%`, d: `NSV +${n0(q1.bNsvYoY)}%` },
      { k: 'Beauty margin, Q1FY27', v: `${q1.bEbitdaPctNsv}% of NSV`, d: 'target: healthy double digit' },
      { k: 'Fashion EBITDA, Q1FY27', v: `₹${q1.fEbitda} cr`, d: `GMV +${n0(q1.fGmvYoY)}%` },
      { k: 'SOTP target', v: '{{dcf.tp|inr}}', d: '{{dcf.upside|chg}} vs ₹{{P.last|num}}' },
      { k: 'DCF value', v: `₹${n0(dcfV.value)}`, d: 'at 12.5% cost of equity' },
    ], source: 'Nykaa Q1FY27 presentation, GAM Research' } },
  ],
});

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Glossary', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'Meaning'], wide: [1], rows: [
      ['GMV', 'Gross merchandise value: the price of goods ordered, before discounts, cancellations, returns and taxes.'],
      ['NSV', 'Net sales value: GMV after discounts, cancellations, returns and taxes. Nykaa quotes vertical margins as a % of NSV.'],
      ['Revenue from operations', 'Sales of goods Nykaa owns plus commissions, advertising and logistics income. Close to NSV in Beauty (inventory model), much smaller in Fashion (marketplace).'],
      ['EBITDA', 'Earnings before interest, tax, depreciation and amortisation; at Nykaa, after share-based pay and before store rent (Ind AS 116).'],
      ['Contribution margin', 'Gross profit less fulfilment, marketing and selling costs, as a % of NSV.'],
      ['AOV / AUTC', 'Average order value; annual unique transacting customers.'],
      ['House of Nykaa (HoN)', 'Nykaa\'s owned brands: Nykaa Cosmetics, Kay Beauty, Dot & Key, Earth Rhythm and others.'],
      ['Superstore / eB2B', 'Nykaa\'s business supplying beauty products to small retailers via an app (electronic business-to-business).'],
      ['Nykaa Now', 'Nykaa\'s 60-minute delivery service in 13 cities.'],
      ['Quick commerce', 'Apps delivering groceries and household goods in 10-30 minutes from small local warehouses (Blinkit, Zepto, Instamart).'],
      ['Sum of the parts (SOTP)', 'Valuing each business separately and adding them up, less net debt and minorities.'],
      ['EV/EBITDA; EV/GMV', 'Enterprise value (market value plus net debt) divided by EBITDA or by GMV.'],
      ['Sep-28E', 'The average of our FY28E and FY29E forecasts, i.e. the twelve months to September 2028: the earnings a buyer will look at in a year.'],
      ['Put option', 'A promise to buy the remaining 49% of Dot & Key from its founders, booked as a liability (₹270 cr at Mar-26).'],
      ['Ind AS 116', 'The accounting rule that moves rent on leased stores and warehouses below EBITDA (into depreciation and interest).'],
      ['DCF', 'Discounted cash flow: the value today of future free cash flows, discounted at the cost of capital.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = { risks, glossary };
