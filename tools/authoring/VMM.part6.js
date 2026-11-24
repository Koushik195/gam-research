// Vishal Mega Mart report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./VMM.ctx');
const { ruleText } = require('../../src/ratings');
const { F, AS, n0, n1, n2, price, MULT, PE12, rating, buyBelow, sellAbove, medTp, epsSep, sector12, build } = X;
const r5 = v => Math.round(v / 5) * 5;
const epsPer10bp = F.sales[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.shares; // 10bp of EBITDA margin, FY28E
const epsPerRps = build[1].rev * 0.01 * AS.ebitdaMargin[1] / 100 * (1 - AS.taxRate[1] / 100) / F.shares; // 1% revenue per sq ft at the FY28E margin

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a well-run growth retailer at a de-rated price, with a seller on the register; ${rating}`,
  blocks: [
    { callout: `**What you are buying:** India's largest listed value retailer for small towns, growing revenue ~17-20% a year from ~10% more space and ~9-10% more sales per sq ft, with three-quarters of sales under its own brands, no debt, leased stores and cash piling up. The weaknesses: no pricing power by design, intense apparel competition in the same towns, rent and wage inflation, mass-market shoppers who feel inflation first, and a private-equity owner still holding 40%.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS. The forward P/E has fallen from ~${Math.round(PE12.max)}x a year ago to ~${Math.round(X.fwdNow)}x; its 12-month median is ${n1(PE12.med)}x, and listed retailers' P/E fell ${Math.abs(sector12).toFixed(1)}% against their own medians over the same window, which gives ${MULT.base}x Sep-28E EPS and {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating} on our rule. EV/EBITDA (₹${n0(X.mv('ev').value)}) agrees; a DCF at an 11.9% cost of capital (₹${n0(X.mv('dcf').value)}) is below the price.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['SSSG at management\'s double-digit target through FY27 (we assume ~8.5-9%)', 'Medium', 'H1FY27 SSSG (festival shift into Q3); new-customer growth'],
      ['The sponsor exits cleanly (one large placement or a strategic buyer)', 'Medium', 'Samayat\'s 40.1%; bulk-deal filings'],
      ['Small formats scale (20+ a year) at large-store returns', 'Medium', 'Small-store count (16 at Jun-26) and disclosure of their economics'],
      ['A dividend or buy-back policy for the growing cash pile', 'Low-Medium', 'Board decision; cash ₹1,714 cr at Mar-26'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Another PE block at a discount', 'High', 'Short-term price pressure; Feb-2026 block priced ~8% below market and the stock fell ~8% that day'],
      ['SSSG falls to 5% (inflation, weak rural incomes, competition)', 'Medium', `Each 1% of revenue per sq ft ≈ ₹${n2(epsPerRps)} of FY28E EPS (~₹${n1(epsPerRps * MULT.base)} a share at ${MULT.base}x)`],
      ['Apparel price war (Zudio, V2 Retail, V-Mart, Style Bazaar)', 'Medium', `Each 10bp of EBITDA margin ≈ ₹${n2(epsPer10bp)} of FY28E EPS (~₹${n1(epsPer10bp * MULT.base)} a share)`],
      ['Minimum wages and rents outrun SSSG', 'Medium', 'Staff cost +25% y/y in Q1FY27; rent escalates ~5% a year'],
      ['Key-man and succession (CEO 65; COO changed in Jul-2026)', 'Low-Medium', 'CEO re-appointed to Aug-2031 eases the near term'],
      ['Retail stocks de-rate further', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS the stock is worth ~₹${n0(r5(MULT.bear * epsSep.base))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The rule would turn HOLD above ~₹${n0(buyBelow)}** and SELL above ~₹${n0(sellAbove)} on today's numbers. We would raise the target if SSSG holds at 10%+ through the festival quarters and the sponsor overhang clears; we would cut it if SSSG falls towards 5% or margins slip on wages and inflation.`,
      `**This is mainly a multiple call.** Our Sep-28E EPS (₹${n2(epsSep.base)}) is ~5% below the street; our ${MULT.base}x is below every broker's implied 44-55x, which is why our {{dcf.tp|inr}} is under the post-Q1 median of ₹${n1(medTp)}.`,
      `**Biggest swing factor:** the multiple. Each 5x of P/E is ~₹${n0(5 * epsSep.base)} a share; each 1pp of SSSG is ~₹${n2(epsPerRps)} of FY28E EPS.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Stores at Jun-2026', v: String(X.Q1.stores), d: '99 net added in FY26; ~100 large a year planned' },
      { k: 'SSSG Q1FY27', v: `${X.Q1.sssgPct}%`, d: 'DMart 5.5%; FY26 11.0%' },
      { k: 'Own brands', v: `${X.C.business.ownBrandsPct.Q1FY27}%`, d: 'of Q1FY27 revenue' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(price / epsSep.base)}x`, d: `12-month forward median: ${n1(PE12.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['SSSG (adjusted)', 'Same-store sales growth: revenue growth of stores open at least 15 months, excluding stores not comparable (refurbishment, area cuts, cannibalisation).'],
      ['Value retail', 'Stores selling everyday clothing, household goods and groceries at low prices to middle- and lower-income families.'],
      ['Own brands / private labels', 'Products sold under the retailer\'s own brand names, made by contract manufacturers.'],
      ['Opening (entry) price points', 'The cheapest items in each category, which VMM keeps unchanged even in inflation.'],
      ['LFS / SFS', 'Large-format stores (~17-18k sq ft) / small-format stores (~8k sq ft) for smaller or saturated towns.'],
      ['Tier 1 / Tier 2 / Tier 3', 'Cities with populations above 1 mn / 200k-1 mn / below 200k (2011 census).'],
      ['Ind AS 116', 'Lease accounting rule: rent becomes depreciation of a "right-of-use" asset plus interest on a lease liability, so EBITDA excludes rent.'],
      ['Operating EBITDA', 'The company\'s measure before Ind AS 116 (rent treated as a cost) and before ESOP charges.'],
      ['ESOP', 'Employee stock options; their fair value is charged to profit over the vesting period.'],
      ['PE overhang', 'The risk that a private-equity owner sells more shares into the market.'],
      ['Block deal', 'A large negotiated sale of shares on the exchange, usually at a discount.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus lease liabilities less cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move', 'How far comparable stocks trade above or below their own median P/E over a window, on the valuation date.'],
      ['DCF / cost of capital', 'Discounted cash flow valuation; the cost of capital is the required annual return used to discount future cash.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '−16%: Covid lockdowns.',
  'sales@FY23': '+36%: post-Covid recovery, SSSG 25.2%, 56 net new stores.',
  'ebitdaMargin@FY26': '14.9% reported (after Ind AS 116); company operating margin 10.2% (8.4% in FY24).',
  'interest@FY26': '₹204 cr on Screener: lease interest ₹170 cr + bank charges ₹32 cr (company finance cost ₹171.5 cr).',
  'otherIncome@FY26': '₹84 cr (company ₹86 cr): mostly liquid-fund gains as cash doubled to ₹1,714 cr.',
  'pat@FY26': '₹839 cr, +33%: SSSG 11%, 99 net new stores, operating leverage on rent.',
  'eps@FY26': 'Reported ₹1.80 (diluted ₹1.79); shown on 468.43 cr Jun-2026 shares.',
  'capex@FY26': '₹325 cr cash capex; plus ₹718 cr of new leases (right-of-use assets), not in this line.',
  'sales@Q2FY26': '+22%: Durga Puja fell in Q2 this year.',
  'sales@Q3FY26': '+17%: festive demand split across Q2 and Q3; SSSG 9.6% adjusted, 6.1% reported.',
  'sales@Q4FY26': '+22%: SSSG 13.2% (consumption uptick after tax and GST cuts); 24 net stores.',
  'sales@Q1FY27': '+18.7%: SSSG 10.0%; 24 net stores; inflation and minimum wages.',
  'pat@Q1FY27': '₹259 cr, +26%: ESOP cost down, other income ₹33 cr.',
  'sales@FY27E': 'GAM: 105 net stores, area +10.6%, revenue per sq ft +6.5%.',
  'capex@FY27E': 'GAM: ₹360 cr cash capex + ₹800 cr new leases.',
  'pat@FY28E': 'GAM: 110 net stores; margin 15.0% on rent leverage.',
};

module.exports = { risks, glossary, statementNotes };
