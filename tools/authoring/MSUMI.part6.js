// Motherson Sumi Wiring India report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./MSUMI.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, n2, price, MULT, FM, rating, buyBelow, sellAbove, medTp, epsSep, cust1 } = X;
const epsPerPp = pp => F.sales[1] * pp / 100 * (1 - 0.252) / F.shares; // FY28E EPS change for a margin change (₹)
const tpPerPp = pp => MULT.base * (F.sales[1] + F.sales[2]) / 2 * pp / 100 * (1 - 0.252) / F.shares;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: India's harness leader at ${n1(X.sepNow)}x Sep-28E EPS; ${rating}, but the case is the multiple`,
  blocks: [
    { callout: `**What you are buying:** the incumbent wiring-harness supplier to most of India\'s best-selling cars, growing well ahead of car production, with ROCE near 40%, no debt beyond leases and a ~62% payout. You are also buying into a structure where the two promoters supply ~${Math.round(X.rpPurchPct)}% of the materials, take ${n1(X.feesPct)}% of revenue in fees and decide which customers MSWIL serves, and where one customer takes ${Math.round(cust1)}% of output.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for ~${Math.round(X.epsCagrFwd)}% a year EPS growth (mostly margin recovery). Since listing the market has paid a median ${n1(FM.median)}x forward for MSWIL; today it pays ${n1(X.fwdNow)}x, close to the lowest it has ever paid. The street\'s targets (median ₹${n0(medTp)}) sit between today\'s price and ours.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Customers agree to monthly copper resets', 'Medium', 'Management is negotiating; Q2/Q3FY27 calls'],
      ['NCR wage increase recovered from customers', 'Medium', 'Employee cost as % of revenue (17.7% in Q1FY27); management commentary'],
      ['Greenfields at company margins; Pune finds volumes', 'Medium', 'Greenfield EBITDA (−₹14 cr in Q4FY26); a new customer or the delayed model launch'],
      ['EV and hybrid share keeps rising', 'Medium-High', 'EV share of revenue (8.5% in Q1FY27); high-voltage harness wins'],
      ['Lower fees or a cap on related-party charges', 'Low', 'AGM approvals (royalty and management fee ceilings ₹75 cr each for FY27)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Copper keeps rising; the lag never closes', 'Medium', `Each 0.5 point of FY28E margin ≈ ₹${n2(epsPerPp(0.5))} of EPS (~${Math.round(epsPerPp(0.5) / F.eps[1] * 100)}%)`],
      ['Wage increases spread to other states without compensation', 'Medium', 'Staff cost is 16-18% of revenue: a 10% wage rise is ~1.7 points of margin before recovery'],
      ['Car production slows against the GST-cut base from H2FY27', 'Medium', 'Revenue growth falls towards single digits; greenfields stay under-used'],
      ['Customer 1 loses share or moves business', 'Low-Medium', `${Math.round(cust1)}% of revenue; its new plants decide where MSWIL builds next`],
      ['Related-party terms move against minorities', 'Low-Medium', 'Higher fees or component prices from SAMIL/SWS would cut margins directly'],
      ['Simpler vehicle architectures (zonal, 48V) shorten harnesses', 'Low (5 years)', 'Content per vehicle could fall in the long run; not visible in India yet'],
      ['The multiple never returns to its history', 'Medium', `At the street\'s low end (30x) our EPS gives ₹${n0(30 * epsSep.base)}; at the bear case {{scen.bear.tp|inr}}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD above ~₹${n1(buyBelow)}** and to SELL above ~₹${n1(sellAbove)} on today\'s numbers.`,
      `**This is a multiple call more than an earnings call.** Our EPS is below the street; our ${MULT.base}x is above the street\'s 30-35x because the house rule anchors on MSWIL\'s own ${n1(FM.median)}x history. At the street\'s 35x our EPS still gives ₹${n0(35 * epsSep.base)} (+${Math.round((35 * epsSep.base / price - 1) * 100)}%), and even the bear case is above today\'s price; the DCF (₹${n0(X.mv('dcf').value)}) is the one method that is not.`,
      `**Biggest swing factor:** the margin. Each 1x of multiple is ~₹${n2(epsSep.base)} a share; each point of EBITDA margin in FY28-29E moves the target by ~₹${n1(tpPerPp(1))}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Q1FY27 revenue growth', v: '+37%', d: '~30% excl. copper' },
      { k: 'EBITDA margin', v: '7.6%', d: 'Q1FY27; 13.0% in FY22' },
      { k: 'Fees to JV partners', v: `${n1(X.feesPct)}%`, d: 'of FY26 revenue' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(X.sepNow)}x`, d: `median since listing: ${n1(FM.median)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Wiring harness', 'The bundle of wires, terminals, connectors, junction boxes and protective tubes that carries power and signals around a vehicle.'],
      ['Low-voltage / high-voltage harness', 'Harnesses for the normal 12V electrical system / for the battery and motor of an electric or hybrid vehicle.'],
      ['OEM', 'Original equipment manufacturer: the vehicle maker.'],
      ['JV (joint venture)', 'A company owned jointly by partners: here SAMIL (33.4%) and Sumitomo Wiring Systems (25.1%).'],
      ['SAMIL / SWS', 'Samvardhana Motherson International (formerly Motherson Sumi Systems) / Sumitomo Wiring Systems, a subsidiary of Sumitomo Electric Industries of Japan.'],
      ['Demerger', 'Splitting a business out of a company into a new company whose shares go to the same shareholders.'],
      ['Bonus issue', 'Free extra shares to existing holders; the share count rises and the price falls in proportion, value unchanged.'],
      ['Pass-through (with a lag)', 'Raw-material price changes are billed to customers at cost, but only after the next price reset (here 3-6 months).'],
      ['Greenfield', 'A new plant built from scratch on a new site.'],
      ['Related-party transaction', 'A deal between the company and its promoters or their companies; needs audit-committee and, above a size, shareholder approval.'],
      ['Royalty / management fee', 'Payments for the use of technology (to SWS) and for management services (to SAMIL), each ~0.5% of revenue.'],
      ['Ind AS 116 (leases)', 'The accounting rule that shows leased buildings as assets and lease liabilities as debt; rent becomes depreciation plus interest.'],
      ['ROCE', 'Return on capital employed: operating profit ÷ (equity + debt).'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY22': 'First year as a separate company (demerger effective from 1-Apr-2021); +43% on the ₹3,938 cr of FY21 (Covid-hit year).',
  'otherIncome@FY22': 'Net of a ₹65 cr exceptional charge: MSWIL\'s share of the costs of the reorganisation scheme.',
  'pat@FY22': '₹457 cr before the ₹46 cr (post-tax) reorganisation charge.',
  'ebitdaMargin@FY23': '11.2% from 13.0%: raw materials rose to 66% of revenue from 64%.',
  'pat@FY24': '+31%: margin back to 12.2%.',
  'pat@FY25': '−5%: greenfield start-up losses (₹122 cr) and copper.',
  'sales@FY26': '+23%: volumes, content and ₹1,040 cr from greenfields (₹258 cr in FY25); copper pass-through.',
  'ebitdaMargin@FY26': '9.2%: 11.4% excluding ₹127 cr of greenfield losses; copper lag in H2.',
  'dep@FY26': '+21%: new plants (mostly leased, so depreciation includes right-of-use assets).',
  'cfo@FY25': 'Receivables +₹348 cr: working capital absorbed half the profit.',
  'cfo@FY26': 'Payables (incl. ₹1,108 cr to the JV partners) rose faster than stock and receivables.',
  'sales@Q4FY26': '+33%: ~5 points from copper; greenfields ₹443 cr.',
  'opm@Q4FY26': '8.2%: copper rose 18% in the quarter; existing plants 10.0%.',
  'sales@Q1FY27': '+37%: 7 points from copper; PV industry +17%.',
  'opm@Q1FY27': '7.6%: copper +7% QoQ and NCR minimum wages +35-40%.',
};

module.exports = { risks, glossary, statementNotes };
