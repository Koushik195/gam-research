// Godrej Agrovet report, part B: merges GODREJAGRO.part2-7.js (built on GODREJAGRO.ctx.js) and adds the
// verdict, glossary and statement notes. Written as of 30-Sep-2026 (Q1FY27 basis). Prose numbers come from
// research/company.json, deep.json, segments.json and the built model; forecast and valuation figures are
// live tokens ({{...}}) that follow assumptions.json.
const X = require('./GODREJAGRO.ctx');
const P2 = require('./GODREJAGRO.part2'), P3 = require('./GODREJAGRO.part3'), P4 = require('./GODREJAGRO.part4'), P5 = require('./GODREJAGRO.part5'), P6 = require('./GODREJAGRO.part6'), P7 = require('./GODREJAGRO.part7');
const { F, SC, n0, n1, pctChg, price, rating, buyBelow, sellAbove, ruleText, opsMult, vegPt, mv, A26 } = X;
const pe28 = price / F.eps[1];

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a better-run company than three years ago, fairly priced',
  blocks: [
    { callout: '**What you are buying:** India\'s largest cattle-feed maker and largest crude palm oil producer, a high-margin but narrow crop-care brand, a loss-making listed chemicals subsidiary, a sub-scale dairy and a young chicken brand, run by a new CEO who is pruning the portfolio. Two businesses earn ~70% of the profit, and both depend on prices the company does not set: maize and soymeal for feed, world palm-oil prices and Indian import duties for oil palm. The stock has returned nothing over five years (₹624 vs ~₹630-650 in late Sep-2021, plus dividends).' },
    { callout: `**What you are paying:** ${n1(pe28)}x our FY28E EPS (our SOTP applies ${n1(opsMult)}x Sep-28E EBITDA to the businesses), against a forward P/E median of ${n1(X.peFm.median)}x and forward EV/EBITDA median of ${n1(X.evMed)}x since 2021. Our target is {{dcf.tp|inr}} ({{dcf.upside|chg}}). The upside needs the weak businesses to recover and palm-oil margins to hold up better than we assume.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (the BUY line on our target)`, 'Medium', 'Share price after Q2FY27 and the CPO price reaction to the duty cut'],
      ['Crop care back to a 30%+ EBIT margin with diversified products', 'Medium', 'H2FY27 standalone EBIT; Ashitaka/Takai scale-up; FY27 guidance after September'],
      ['Astec resolved: profitable CDMO growth, or a structure that stops GAVL funding it', 'Low-medium', 'Group announcement promised within 2-3 quarters of May-2026'],
      ['Creamline and Godrej Foods back to 5%+ EBITDA margins', 'Medium', 'Milk procurement prices; B2C share in foods'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['CPO prices fall (duty cut, lower crude, Indonesian/Malaysian supply)', 'Medium-high', `Each 1 point of oil-palm margin is ~₹${n1(vegPt)} of FY28E EPS; bear case FY28E EPS ₹${n1(SC.bear.eps[1])}, ${Math.abs(pctChg(SC.bear.eps[1], F.eps[1]))}% below base`],
      ['Another poor monsoon in the cotton belt', 'Medium', 'Crop care has fallen two years running; FY27 already started −38% (Q1)'],
      ['Maize/soymeal spike like FY23', 'Medium', 'Feed margins fell to 4.6% in FY23; passes on only 60-70% of cost'],
      ['Supplier financing withdrawn or repriced', 'Low', 'Working capital would rise by several hundred crore; net debt up'],
      ['More money into low-return businesses (Astec, dairy)', 'Medium', 'Capital allocation record since FY25 is the main governance concern'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Turn positive (BUY) below ~₹${n0(buyBelow)}**, or on evidence that crop care and Astec recover while oil-palm margins hold near 20% after the duty cut. **Turn negative above ~₹${n0(sellAbove)}** without an earnings upgrade.`,
      `**Biggest swing factor:** the CPO price. Our FY28-29E oil-palm margin of 19.5% is below FY26's 21.4% but above FY21's 15.4%; a return to FY21 margins would remove ~₹${n1(vegPt * 4)} of FY28E EPS.`,
      `**Second swing factor:** the multiple. The street uses ~10-11x; the stock's own history says ~15x before the sector de-rating. At bull multiples (+2x) on base earnings the SOTP would be ~₹${n0(X.V.tp + 2 * (X.opsEbitda - X.unallocSep28) / X.sh / 10 * 10)}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Oil palm + feed share of FY26 segment EBITDA', v: `${Math.round(X.segShare26('an') + X.segShare26('veg'))}%`, d: 'dairy + foods 9% on 22% of revenue' },
      { k: 'CPO realisation, Q1FY27', v: '₹1,34,783/t', d: '+18% YoY; duty cut 24-Sep-2026' },
      { k: 'Crop Care standalone EBIT, Q1FY27', v: '−38%', d: 'margin 31.7% vs 42.2%' },
      { k: 'Paid for minorities, FY25-26', v: '₹1,245 cr', d: 'Godrej Foods and Creamline' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'Company, Business Today (24-Sep-2026), GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Compound feed', 'Factory-made animal feed mixing grains (maize), oilmeals (soymeal), minerals and additives to a formula.'],
      ['FFB', 'Fresh fruit bunches: the fruit of the oil palm, bought from farmers and crushed within a day.'],
      ['CPO / PKO', 'Crude palm oil (from the fruit flesh) and palm kernel oil (from the seed).'],
      ['OER', 'Oil extraction ratio: tonnes of oil per tonne of FFB processed (18.8% in Q1FY27).'],
      ['Factory zone', 'An area allotted by a state government to one processor, which must buy the FFB grown there at the state-set price.'],
      ['NMEO-OP', 'National Mission on Edible Oils (Oil Palm): central scheme subsidising oil palm planting to cut imports.'],
      ['Basic customs duty', 'Import tax on edible oils; with cesses, the effective rate on crude palm oil fell from 16.5% to 11% on 24-Sep-2026.'],
      ['In-house vs in-licensed', 'Crop protection products made from the company\'s own registrations vs products licensed from other companies (lower margins).'],
      ['CDMO', 'Contract development and manufacturing for other companies (Astec\'s growth focus).'],
      ['VAP', 'Value-added dairy products (curd, paneer, flavoured milk), with higher margins than liquid milk.'],
      ['Live birds / B2C', 'Chickens sold live to traders vs branded packaged products sold to consumers.'],
      ['Supplier financing / vendor invoice discounting', 'Banks pay the company\'s suppliers early and the company pays the bank later; a form of short-term debt shown as payables.'],
      ['Minorities (NCI)', 'The share of a subsidiary\'s profit or loss belonging to its other shareholders (32.97% of Astec).'],
      ['Segment result / EBITDA', 'Segment profit before interest and tax (result); EBITDA adds back the segment\'s depreciation.'],
      ['SOTP', 'Sum of the parts: valuing each business separately and adding them up, less net debt.'],
      ['EV/EBITDA; P/E', 'Enterprise value (market value + net debt) ÷ EBITDA; share price ÷ earnings per share.'],
      ['Holding-company discount', 'A cut to the market value of a listed stake held through a parent (20% for Astec in our base case).'],
      ['DCF / WACC', 'Discounted cash flow; WACC is the weighted average cost of debt and equity (~11.9% here).'],
      ['Trough year', 'A year whose forward earnings were a loss or below half the best of the previous three; left out of multiple medians.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover: P2.cover,
  sections: p => [P2.narrative, P2.business, P2.history, P3.industry, P3.tailwind, P3.an, P3.veg, P4.crop, P4.consumer, P4.moat, p.financials, p.capital, P5.quality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P6.forecasts, P6.street, P7.valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY17': 'Revenue +31% (FY17 segment detail not reviewed).',
    'ebitdaMargin@FY16': 'Margin fell to 4.6% (FY16 detail not reviewed); other income of ₹315 cr that year included one-off gains.',
    'ebitdaMargin@FY17': 'Margin back to 9.0% (FY17 detail not reviewed).',
    'pat@FY16': 'Other income ₹315 cr incl. exceptional items of ₹97 cr after tax (Screener).',
    'pat@FY19': 'PBT +28%; includes ₹83 cr of exceptional gains after tax (Screener).',
    'sales@FY20': 'Feed revenue ₹3,718 cr; real-estate revenue ₹135 cr (segment result ₹78 cr).',
    'ebitdaMargin@FY21': 'Covid year: feed revenue −17% but margins up (segment EBITDA margin 7.6%); Godrej Foods profitable.',
    'sales@FY22': 'Commodity inflation: feed +41% to ₹4,350 cr; vegetable oil +78% to ₹1,265 cr.',
    'pat@FY22': 'Oil palm segment result ₹241 cr (+188%) on high CPO prices.',
    'ebitdaMargin@FY23': 'Maize/soymeal spike (feed margin 4.6%), dairy loss, crop protection result −46%.',
    'pat@FY23': 'Crop protection segment result fell from ₹234 cr to ₹126 cr; dairy lost ₹44 cr.',
    'ebitdaMargin@FY24': 'Feed margin recovered to 5.9%; dairy back to profit; crop care (incl. Astec) 21.5% EBITDA margin.',
    'pat@FY25': 'Oil palm and feed up; Astec loss ₹135 cr (minorities absorbed ₹48 cr); profit attributable +19%.',
    'pat@FY26': 'Oil palm segment result +68%; land gains ~₹34 cr; ₹30 cr wage-code charge (exceptional).',
    'dep@FY26': 'D&A ₹229 cr: stable; new oil-palm assets capitalise from FY27.',
    'sales@Q1FY27': 'Feed +12.6% (volume +7%), oil palm +29% (CPO +18%), crop care −17%, dairy +11%.',
    'pat@Q1FY27': 'Crop care segment result −38% after a dry June; dairy and foods EBITDA halved on input costs.',
    'pat@Q4FY26': 'Includes ~₹29 cr after tax of land-sale gains; feed result ₹132 cr incl. pet-food income.',
    'pat@Q2FY26': 'Crop care −62% (heavy rain); oil palm +88%.',
  },
};
