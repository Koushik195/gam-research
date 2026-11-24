// Olectra Greentech report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./OLECTRA.ctx');
const { ruleText } = require('../../src/ratings');
const { F, AS, n0, n1, price, shares, MULT, FM, rating, buyBelow, sellAbove, epsSep, k, sepNow, SENS, mv, bld } = X;
const E = epsSep.base, r10 = v => Math.round(v / 10) * 10;
const marginRs = Math.round((F.sales[1] + F.sales[2]) / 2 * 0.01 * (1 - AS.taxRate[1] / 100) / shares * MULT.base / 10) * 10;
const per100 = Math.round(100 * (F.sales[1] / bld[1].units) * 0.095 * (1 - AS.taxRate[1] / 100) / shares * MULT.base / 10) * 10; // ₹ a share per 100 vehicles a year at the Mobility EBIT margin

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a real e-bus franchise run through the parent's operator, at ${Math.round(sepNow)}x Sep-28E EPS; ${rating} on the house multiple`,
  blocks: [
    { callout: '**What you are buying:** India\'s first and one of its two or three largest e-bus makers (~24% of FY26 units), an order book of over 8,000 buses, a new plant able to make 5,000 vehicles a year, an insulator business with 25-35% margins, and a parent (MEIL) that funds the operator, guarantees the plant loan and will be the first e-truck customer. If deliveries double, EPS can grow ~20% a year to FY29E.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for a business with a ~12% EBITDA margin, negative free cash flow and three-quarters of its sales going to its own group. That is cheap against the stock's ${n1(FM.median)}x forward-P/E median since Apr-2021, which is why our rule gives ${rating} with a target of {{dcf.tp|inr}} ({{dcf.upside|chg}}). It is not cheap against cash: the DCF says ₹${n0(mv('dcf').value)}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Deliveries of 500+ a quarter for two quarters (FY27 guidance met)', 'Medium', 'Quarterly vehicle counts'],
      ['MSRTC deliveries on the Dec-2026 schedule; BMTC contract signed', 'Medium', 'State and company announcements'],
      ['Receivables from related parties fall as Evey SPVs draw project debt', 'Medium', 'Half-year balance sheet; ICRA review'],
      ['Mobility EBIT margin back above 11% as the plant fills', 'Low-Medium', 'Segment results'],
      ['E-truck orders from outside the MEIL group', 'Low', 'Order announcements after the Q4FY27 launch'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Deliveries miss again (BYD parts, depots, Evey funding)', 'Medium-High', `Each 100 vehicles a year ≈ ₹${n0(per100)} a share at our multiple`],
      ['A state cancels or cuts an order (MSRTC threatened to in May-2025)', 'Medium', 'Lower volumes; idle capacity at the new plant'],
      ['Evey or the states pay late', 'Medium', 'Receivables and interest rise; Olectra funds its group\'s customers'],
      ['Tender prices fall as Tata, Switch, PMI and JBM compete', 'Medium', `Each 1pp of FY28-29E EBITDA margin ≈ ₹${n0(marginRs)} a share at our multiple`],
      ['Insulator margin stays at Q1FY27\'s 22% or lower', 'Medium', 'Insulators were 37% of FY26 segment EBIT'],
      ['India-China tension disrupts BYD supplies', 'Low-Medium', 'Production stops until local platforms are ready'],
      ['Sentiment: a retail stock 44% below its 2024 peak', 'Medium', 'The multiple can fall well below our bear case'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The case rests on volumes and the multiple.** ${MULT.base}x Sep-28E EPS (${n1(FM.median)}x median × ${k.toFixed(3)}) is what the house rule gives; a 12-month window gives ${SENS.r12}x (~₹${n0(r10(SENS.r12 * E))}). Investors who doubt the market will again pay 60x for a group bus maker should treat the target as the top of a range.`,
      `**We would move to HOLD above ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers.`,
      `**Biggest swing factor:** deliveries. 1,850 vehicles in FY27E and 2,400 in FY28E are below guidance but double FY26; each 1x of multiple is ~₹${n1(E)} a share.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Related-party share of revenue', v: '75%', d: 'FY26; 79% in FY25' },
      { k: 'Vehicles: guided vs delivered', v: '~2,000 vs 1,280', d: 'FY26' },
      { k: 'Q1FY27 revenue / profit growth', v: '+66% / 0%', d: 'interest +97%' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(sepNow)}x`, d: `median since Apr-21: ${n1(FM.median)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Gross cost contract (GCC) / wet lease', 'A private operator buys, runs and maintains buses; the state pays it a fixed fee per kilometre for 10-12 years and keeps the fares.'],
      ['STU / MSRTC / BEST / TGSRTC / BMTC', 'State transport undertakings: Maharashtra State Road Transport Corporation, Mumbai\'s BEST, Telangana State RTC and Bengaluru Metropolitan Transport Corporation.'],
      ['CESL, PM E-DRIVE, PM e-Bus Sewa', 'Convergence Energy Services runs pooled central tenders for e-buses under the PM E-DRIVE and PM e-Bus Sewa schemes.'],
      ['Evey Trans / SPV', 'A MEIL Holdings company that operates buses; each contract sits in a special-purpose company (SPV) that buys the buses from Olectra.'],
      ['Related party', 'A company or person connected to Olectra\'s owner or management; deals with them need audit-committee and often shareholder approval.'],
      ['Associate', 'A company in which Olectra holds a minority stake with significant influence; only its share of profit appears in Olectra\'s accounts.'],
      ['Letter of comfort (LOC)', 'An undertaking to a lender; here Olectra must repay REC if buses financed under Evey\'s facility are not delivered in time.'],
      ['Composite polymer insulator', 'A lightweight insulator made of fibreglass and silicone rubber that holds power lines on transmission towers.'],
      ['Segment EBIT', 'Segment profit before interest and tax, as the company reports it (here it includes other income).'],
      ['Capitalised interest', 'Interest on a loan for a plant under construction, added to the plant\'s cost instead of the P&L until it starts operating.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the blended required return on debt and equity used to discount future cash.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'pat@FY19': 'Loss of ₹16 cr (Screener): EBITDA −₹15 cr in the first years of e-bus production.',
  'otherIncome@FY20': '₹44 cr incl. a ₹20 cr exceptional gain (Screener).',
  'sales@FY22': '+111%: e-bus revenue ₹485 cr (FY21 ₹160 cr); 259 vehicles.',
  'sales@FY23': '+84%: 580 vehicles; e-tippers first sold (₹23 cr).',
  'interest@FY23': '₹31 cr (+3.5x): working-capital loans for bus orders.',
  'sales@FY24': '+6%: 541 vehicles (580 in FY23).',
  'sales@FY25': '+56%: 972 vehicles; insulators +26%.',
  'pat@FY25': '+81%: Mobility EBIT 11.9%.',
  'sales@FY26': '+28%: 1,280 vehicles (+32%); insulators +81% to ₹325 cr.',
  'pat@FY26': '+28%: insulator EBIT +144%, Mobility EBIT +1%; ₹13.7 cr of interest capitalised.',
  'capex@FY26': 'Seetharampur plant; commercial operation from 31-Dec-2025.',
  'cfo@FY26': 'Receivables +₹293 cr, 72% of the total owed by related parties.',
  'sales@Q4FY26': '+44%: 359 vehicles; insulators ₹106 cr at a 38% EBIT margin.',
  'pat@Q4FY26': 'Record quarter: insulators supplied 42% of segment EBIT.',
  'sales@Q1FY27': '+66%: 358 vehicles (161); insulators +47%.',
  'interest@Q1FY27': '+97%: no more interest capitalised; working-capital loans up.',
  'pat@Q1FY27': 'Flat at ₹26 cr: EBITDA margin 11.8%, interest and depreciation up.',
  'sales@FY27E': `GAM: ${n0(bld[0].units)} vehicles × ₹${AS.build.revPerUnit[0]} cr; insulators +${AS.build.enGrowth[0]}%.`,
  'interest@FY27E': 'GAM: Q1FY27 run-rate (₹23.6 cr a quarter).',
  'pat@FY28E': `GAM: ${n0(bld[1].units)} vehicles as the new plant fills.`,
};

module.exports = { risks, glossary, statementNotes };
