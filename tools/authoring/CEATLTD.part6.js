// CEAT report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./CEATLTD.ctx');
const { ruleText } = require('../../src/ratings');
const { F, AS, n0, n1, price, MULT, HA, rating, buyBelow, sellAbove, medTp, epsSep, sectorDr } = X;
const r10 = v => Math.round(v / 10) * 10;
const epsPerPp = F.sales[1] * 0.01 * (1 - AS.taxRate[1] / 100) / F.shares;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a good brand at a cyclical low, priced about right; ${rating}`,
  blocks: [
    { callout: `**What you are buying:** India's two-wheeler tyre leader and a strong car-tyre brand, growing volume at double digits, with ~20% of revenue from exports and a newly bought global off-highway niche (Camso). Earnings are at a cyclical low: raw materials rose ~25% in two quarters and price increases lag; Camso is loss-making until FY28; a currency loss hit Q1. Debt is up to ₹3,243 cr after the acquisition and capex continues at ~8% of revenue.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS. CEAT's own forward P/E has a median of ${n1(HA.med)}x since 2021; Indian tyre stocks were ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026, which gives ${MULT.base}x Sep-28E EPS and {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating} on our rule. The DCF (₹${n0(X.mv('dcf').value)}) is above, EV/EBITDA (₹${n0(X.mv('ev').value)}) below.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Natural rubber back towards ₹200-220/kg while prices hold', 'Medium', 'Kottayam RSS-4 after the monsoon; Q3FY27 gross margin back above 37%'],
      ['Camso EBITDA positive in H2FY27 on direct billing', 'Medium', 'Consolidated less standalone EBITDA; management\'s Camso revenue run-rate'],
      ['Price discipline holds across the industry', 'Medium-High', 'MRF and Apollo price moves; replacement volume growth'],
      ['A further de-rating of the stock without an earnings cut', 'Medium', `Below ~₹${n0(buyBelow)} the stock would be a BUY on our rule`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Rubber and crude stay high (West Asia); price increases fall short', 'Medium', `Each 1pp of consolidated margin ≈ ₹${n1(epsPerPp)} of FY28E EPS, ~₹${n0(r10(epsPerPp * MULT.base))} a share at ${MULT.base}x`],
      ['Demand slows on 15%+ price increases and El Nino', 'Medium', 'Volume growth falls to the industry\'s 4-5%; new capacity under-used'],
      ['Camso transition goes wrong (customers lost, OEM programmes slow)', 'Medium', 'Camso stays loss-making: ~₹17-25 of FY28E EPS at risk'],
      ['Sri Lankan rupee weakens again', 'Medium', 'Each 5% fall ≈ ₹25-30 cr of finance cost on the ~USD56 mn loan left after conversion'],
      ['Capex overrun or another acquisition', 'Low-Medium', 'Net debt above ₹4,000 cr; ROE stuck near 10%'],
      ['Tyre sector de-rates further', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS the stock is worth ~₹${n0(r10(MULT.bear * epsSep.base))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn BUY below ~₹${n0(buyBelow)}** and SELL above ~₹${n0(sellAbove)} on today's numbers; we would raise the target if Q2-Q3FY27 show the gross margin recovering towards 38-40% and Camso breaking even, and cut it if margins stay near 9% into Q3.`,
      `**This is mainly a multiple call.** Our FY28E EPS (₹${n1(F.eps[1])}) is close to MOSL's; our ${MULT.base}x sits below the street's 16-18x because tyre stocks have de-rated. At 16x our target would be ~₹${n0(r10(16 * epsSep.base))}; the post-Q1 street median is ₹${n0(medTp)}.`,
      `**Biggest swing factor:** the margin. Each 1pp of EBITDA margin is ~₹${n1(epsPerPp)} of FY28E EPS; each 1x of multiple is ~₹${n0(epsSep.base)} a share.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Q1FY27 standalone revenue', v: '+18.3%', d: 'volume +13-14%' },
      { k: 'Gross margin Q1FY27', v: '33.5%', d: 'normal 40-41%; ~15-16% of price needed' },
      { k: 'Camso outlay', v: '~₹1,600 cr', d: 'incl. the brand due in 2028; EBITDA negative in Q1' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(price / epsSep.base)}x`, d: `own median since 2021: ${n1(HA.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['TBR, PCR, OHT', 'Truck and bus radial tyres; passenger-car radial tyres; off-highway tyres (tractors, construction and mining machines).'],
      ['Replacement / OEM', 'Tyres sold to vehicle owners through dealers to replace worn ones / tyres sold to vehicle makers for new vehicles.'],
      ['Camso', 'Michelin\'s former construction-equipment bias tyres and rubber tracks business (Sri Lanka plant), owned by CEAT since 1-Sep-2025.'],
      ['Upstream (mixers, calenders)', 'Machines that mix rubber compounds and roll them into sheets; Camso\'s plant buys compounds from Michelin until its own are installed.'],
      ['Standalone / consolidated', 'CEAT Ltd alone (the Indian plants) / the group including subsidiaries such as Camso; the difference is mostly Camso.'],
      ['JV share', 'CEAT\'s share of the profit of CEAT Kelani, its Sri Lankan joint venture, shown as one line.'],
      ['Gross margin', 'Revenue less raw materials and other direct material costs, as a % of revenue.'],
      ['Exceptional items', 'Large one-off gains or charges (VRS, labour-code past-service cost) shown separately in the accounts.'],
      ['CWIP', 'Capital work in progress: plants being built, not yet in use or depreciated.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash.'],
      ['ROCE / ROE', 'Return on capital employed (operating profit ÷ debt plus equity) / return on equity (profit ÷ net worth).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '+12%: post-Covid replacement demand.',
  'ebitdaMargin@FY21': '13.0%: cheap rubber after Covid.',
  'ebitdaMargin@FY22': '7.7%: raw-material spike; price increases lagged.',
  'pat@FY22': '₹71 cr; EPS ₹17.6, the trough.',
  'pat@FY23': '₹182 cr: margin still 8.6%.',
  'ebitdaMargin@FY24': '13.8%: rubber and crude fell; record margin.',
  'pat@FY24': '₹635 cr; EPS ₹159.',
  'ebitdaMargin@FY25': '11.2%: rubber rose again.',
  'sales@FY26': '+18.6%: standalone +15.5% (GST cut in H2) plus seven months of Camso (₹421 cr).',
  'otherIncome@FY26': '₹40 cr of other income less ₹71 cr of exceptional items (labour codes ₹58 cr, VRS ₹13 cr), netted by Screener.',
  'pat@FY26': '₹697 cr, +48%; EPS ₹172.8 (MOSL adjusted ₹185).',
  'capex@FY26': 'Capex ₹1,076 cr plus ₹236 cr of Camso intangibles; the ₹1,120 cr Camso payment is separate.',
  'sales@Q2FY26': 'Camso consolidated from 1-Sep-2025.',
  'otherIncome@Q3FY26': 'Includes ₹58 cr of labour-code past-service cost (exceptional).',
  'sales@Q1FY27': '+22%: standalone +18.3% (volume +13-14%), Camso ₹155 cr.',
  'opm@Q1FY27': '8.5%: raw materials +16-18% q/q; gross margin 33.9%; Camso EBITDA negative.',
  'interest@Q1FY27': '₹146 cr incl. a ₹48 cr Sri Lankan-rupee loss on the USD80 mn loan to the Camso entity.',
  'pat@Q1FY27': '₹4 cr (standalone ₹98 cr); tax 103% as subsidiary losses get no credit.',
  'sales@FY27E': 'GAM: standalone +14.8% (price ~9-10%, volume ~5-6%), Camso ₹800 cr.',
  'ebitdaMargin@FY27E': 'GAM: standalone ~9% in Q2, ~11.5% in Q3, ~13% in Q4; Camso break-even.',
  'capex@FY27E': 'GAM: ₹1,600 cr (India ₹1,350-1,400 cr guided plus Camso upstream).',
  'pat@FY28E': 'GAM: margins normalise and Camso turns profitable.',
  'capex@FY29E': 'GAM: ₹1,500 cr plus ~₹420 cr for the Camso brand (USD44 mn).',
};

module.exports = { risks, glossary, statementNotes };
