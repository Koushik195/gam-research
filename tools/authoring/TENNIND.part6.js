// Tenneco Clean Air India report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./TENNIND.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, n2, price, MULT, PEL, rating, buyBelow, sellAbove, medTp, epsSep, feesPct, Q1 } = X;
const tax = 1 - 0.255;
const epsPerPp = pp => F.sales[1] * pp / 100 * tax / F.shares; // FY28E EPS change for a margin change (₹)
const tpPerPp = pp => MULT.base * (F.sales[1] + F.sales[2]) / 2 * pp / 100 * tax / F.shares;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a market leader at ${n1(X.sepNow)}x Sep-28E EPS; ${rating}, with a parent overhang`,
  blocks: [
    { callout: `**What you are buying:** India's leading truck and off-highway exhaust supplier and car shock-absorber maker, net cash, negative working capital, with Tenneco's technology and an order book that covers FY28. Ride control (+${Q1.artGrowth}% in Q1FY27) is growing fast and is not hurt by EVs. You are also buying a company whose parent takes ${n1(feesPct)}% of revenue in fees, owns most of its export customers and has sold 37% of the company in nine months.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for ~${Math.round(X.epsCagrFwd)}% a year EPS growth. Since listing the market has paid a median ${n1(PEL.med)}x forward; today it pays ${n1(X.fwdNow)}x, near the bottom of its ${n1(PEL.min)}-${n1(PEL.max)}x range, after the August block. The street's targets (median ₹${n0(medTp)}) are above ours because their EPS is higher.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Non-indexed cost increases recovered; listing costs absorbed', 'Medium-High', 'EBITDA on VAR back above 18.5% (17.9% in Q1FY27)'],
      ['DCx and semi-active dampers lift ART margins', 'Medium', 'ART share rising without the company margin falling'],
      ['CAFE-3 on time; clean-air entry at the largest PV maker', 'Medium', 'CA&PT growth back to double digits from FY28'],
      ['Exports scale towards 20% of VAR', 'Low-Medium', 'Half-yearly export order book; third-party share of export orders (~30% now)'],
      ['Parent states it will hold the remaining ~60%', 'Low-Medium', 'Disclosures after the 90-day lock-up ends'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Further promoter sales', 'Medium-High', 'Supply overhang; the August block went at ~₹525 and the stock fell to ₹508 by end-September'],
      ['Commodity and listing costs stay unrecovered', 'Medium', `Each 0.5 point of FY28E margin ≈ ₹${n2(epsPerPp(0.5))} of EPS (~${Math.round(epsPerPp(0.5) / F.eps[1] * 100)}%)`],
      ['Car and truck demand fades after the GST-cut year', 'Medium', 'VAR growth falls to high single digits; ART plants under-used after the new capacity'],
      ['Battery EVs take share faster', 'Low-Medium (3 years)', '~20% of VAR (PV clean air) has no EV content'],
      ['BS-VII watered down or delayed; CAFE-3 slips', 'Medium', 'CA&PT content growth slower; the Japanese PV entry later'],
      ['Parent raises fees or redirects export programmes', 'Low-Medium', 'Fees are ~15% of EBITDA; exports mostly intra-group'],
      ['A related-party acquisition', 'Low-Medium', 'Surplus cash (₹{{F.treasury.2|num}} cr by FY29E in our model) bought assets from the group'],
      ['The multiple de-rates further', 'Medium', `At the bear multiple (${MULT.bear}x) our EPS gives ₹${n0(MULT.bear * epsSep.base)}; bear case {{scen.bear.tp|inr}}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD above ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers.`,
      `**This is an earnings-and-multiple call.** Our EPS is below the street and our ${MULT.base}x is just below the street's 29-30x; the upside comes from the stock trading at ${n1(X.sepNow)}x Sep-28E EPS after the block sale. The DCF (₹${n0(X.mv('dcf').value)}) only supports today's price.`,
      `**Biggest swing factors:** the multiple (each 1x is ~₹${n0(epsSep.base)} a share) and the margin (each point of EBITDA margin in FY28-29E moves the target by ~₹${n0(tpPerPp(1))}).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'ART VAR growth', v: `+${Q1.artGrowth}%`, d: `Q1FY27; CA&PT +${Q1.caGrowth}%` },
      { k: 'EBITDA on VAR', v: `${Q1.ebitdaVarPct}%`, d: 'Q1FY27; 18.8% in FY26' },
      { k: 'Fees to the parent', v: `${n1(feesPct)}%`, d: 'of FY26 revenue' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(X.sepNow)}x`, d: `median since listing: ${n1(PEL.med)}x forward` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Clean air / after-treatment', 'The parts of an exhaust system that clean the gas: catalytic converters (hot end), filters (DPF, GPF), SCR systems that inject urea, and the mufflers and pipes (cold end).'],
      ['Substrate', 'The ceramic honeycomb inside a catalytic converter, coated with platinum, palladium or rhodium; bought at the customer\'s direction and billed at cost.'],
      ['VAR (value-added revenue)', 'Revenue from operations less substrates: the revenue on which Tenneco adds value. Management quotes margins on VAR.'],
      ['ART (Advanced Ride Technologies)', 'Shock absorbers and struts: conventional (passive), passive-plus (DCx DaVinci, mechanical) and semi-active (electronically controlled).'],
      ['BS-VI / BS-VII', 'Bharat Stage emission standards for vehicles; BS-VI since Apr-2020, BS-VII not yet notified.'],
      ['CAFE-3', 'Corporate Average Fuel Efficiency norms for car makers (CO2 per km), third stage expected from 2027 (management: "mid of 2027").'],
      ['TREM-V', 'Emission norms for tractors (stage V).'],
      ['OEM', 'Original equipment manufacturer: the vehicle maker.'],
      ['Offer for sale (OFS)', 'An IPO in which existing shareholders sell; the company gets no money.'],
      ['Common-control combination (pooling)', 'Merging companies owned by the same parent at book value, restating past years as if they had always been combined.'],
      ['Royalty / network fees', 'Payments to the parent for technology and trademarks / for group services.'],
      ['APA', 'Advance pricing agreement with the tax authorities on transfer prices between group companies.'],
      ['Order book (lifetime)', 'Value of orders confirmed by customers but not yet in production, over the programme life (5-6 years).'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move', 'How far comparable stocks trade above or below their own median P/E over a window on the valuation date.'],
      ['DCF', 'Discounted cash flow valuation; here discounted at the cost of equity (no debt).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY24': '+13%: higher substrate pass-through (~₹1,200 cr); VAR +9%.',
  'sales@FY25': '−11%: substrates fell to ~₹510 cr; VAR +2.6%.',
  'ebitdaMargin@FY25': '16.7% from 11.2%: substrates out of revenue and P3 cost savings (18.6% of VAR).',
  'pat@FY25': '+33%: margin step-up.',
  'sales@FY26': '+10.5%: VAR +12.3% (ART +19.7%, CA&PT +5.5%).',
  'otherIncome@FY26': 'Net of a ₹27 cr labour-code exceptional charge; ₹59 cr before it, incl. a Q1 Motocare-related one-off.',
  'pat@FY26': '₹624 cr before the ₹20 cr (post-tax) labour-code charge.',
  'cfo@FY26': 'Includes ~₹663 cr of the Motocare sale consideration collected from a fellow subsidiary.',
  'otherIncome@Q1FY26': 'Includes a one-off from the Motocare sale and other one-off income.',
  'otherIncome@Q3FY26': '₹27 cr labour-code charge netted here (exceptional item).',
  'pat@Q3FY26': '₹139 cr before the ₹20 cr labour-code charge.',
  'sales@Q4FY26': '+17%: VAR +17.5%, ART +26%.',
  'sales@Q1FY27': '+20%: VAR +18.4%; ART +27.9%, CA&PT +9.6%; substrates ₹163 cr.',
  'opm@Q1FY27': '17.9% of VAR (19.6% a year earlier): listing costs and non-indexed commodities.',
};

module.exports = { risks, glossary, statementNotes };
