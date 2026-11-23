// Apollo Tyres report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./APOLLOTYRE.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, AS, n0, n1, price, MULT, HA, rating, buyBelow, sellAbove, medTp, epsSep, sectorDr } = X;
const r10 = v => Math.round(v / 10) * 10;
const epsPerPp = F.sales[1] * 0.01 * (1 - AS.taxRate[1] / 100) / F.shares;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a cyclical leader at a cyclical low; ${rating}`,
  blocks: [
    { callout: `**What you are buying:** one of India's two largest truck-tyre makers, growing faster than the market with a strong replacement brand, plus a European business that has under-earned for years and has just shut its highest-cost plant. Earnings are at a cyclical low: raw materials are up ~25% in two quarters and price increases lag; Europe is mid-restructuring. Capex triples in FY27-28 for new Indian capacity, so free cash flow is thin and net debt rises for two years.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS. Apollo's own forward P/E on EPS before one-offs has a median of ${n1(HA.med)}x since 2021; Indian tyre stocks were ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026, which gives ${MULT.base}x Sep-28E EPS and {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating} on our rule. The DCF (₹${n0(X.mv('dcf').value)}) supports it; EV/EBITDA (₹${n0(X.mv('ev').value)}) does not, because it leans hardest on the margin recovery.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Natural rubber back towards ₹200/kg while prices hold', 'Medium', 'Kottayam RSS-4 after the monsoon; Q3FY27 margins'],
      ['Europe margin back to 15%+ in FY28', 'Medium', 'H2FY27 Europe margin without Enschede; Hungary ramp-up; agri offtake'],
      ['India share gains continue as AP capacity starts', 'Medium-High', 'Standalone volume growth vs the industry; TBR share'],
      ['Capex discipline: FY28 capex at or below ₹3,000 cr', 'Medium', 'FY28 guidance; net debt/EBITDA below 1x'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Rubber and crude stay high (Middle East); price increases fall short', 'Medium', `Each 1pp of consolidated margin ≈ ₹${n1(epsPerPp)} of FY28E EPS, ~₹${n0(r10(epsPerPp * MULT.base))} a share at ${MULT.base}x`],
      ['Demand slows on fuel prices and a high base (El Niño, freight)', 'Medium', 'India volume growth falls to the industry\'s 4-5%; new capacity under-used'],
      ['Europe fails to recover (agri lost, flat market, wage inflation)', 'Medium', 'Europe margin stuck at 10-12%: FY28E EPS ~₹3-4 lower'],
      ['Capex overrun or a new large project', 'Low-Medium', 'Net debt above ₹4,000 cr; ROE stuck near 10%'],
      ['More exceptional charges in Europe', 'Low-Medium', 'Cash and book value hit; credibility'],
      ['Tyre sector de-rates further', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS the stock is worth ~₹${n0(r10(MULT.bear * epsSep.base))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would stay BUY below ~₹${n0(buyBelow)}**, move to HOLD above it and to SELL above ~₹${n0(sellAbove)} on today's numbers; we would cut the target if Q2-Q3FY27 margins stay near 12% with rubber falling, which would mean the price increases are not sticking.`,
      `**This is mainly a multiple call on normal earnings.** Our FY28E EPS (₹${n1(F.eps[1])}) is within the street's range; our ${MULT.base}x sits below the street's 16-18x. At MOSL's 16x our target would be ~₹${n0(r10(16 * epsSep.base))}; the post-Q1 street median is ₹${n0(medTp)}.`,
      `**Biggest swing factor:** the margin. Each 1pp of EBITDA margin is ~₹${n1(epsPerPp)} of FY28E EPS; each 1x of multiple is ~₹${n0(epsSep.base)} a share.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Q1FY27 India revenue', v: '+15.6%', d: 'fastest in 14 quarters' },
      { k: 'Raw materials Q1 + Q2', v: '~+25%', d: '~11% of price taken; 15-16% needed' },
      { k: 'Enschede charges FY25-26', v: '₹1,128 cr', d: 'production stopped Jun-2026' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(price / epsSep.base)}x`, d: `own median since 2021: ${n1(HA.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['TBR, TBB, PCR, UHP', 'Truck and bus radial tyres; truck and bus bias (cross-ply) tyres; passenger-car radial tyres; ultra-high-performance car tyres (large, fast, premium).'],
      ['Replacement / OEM', 'Tyres sold to vehicle owners through dealers to replace worn ones / tyres sold to vehicle makers for new vehicles.'],
      ['APMEA', 'Asia Pacific, Middle East and Africa: Apollo\'s segment for India and nearby markets.'],
      ['Vredestein, ReifenCom', 'Apollo\'s premium European tyre brand (from the Enschede, Netherlands business) / its German tyre distribution business.'],
      ['Offtake partner', 'Another manufacturer that makes tyres to Apollo\'s specification for Apollo to sell.'],
      ['Exceptional items', 'Large one-off gains or charges (plant closures, impairments, restructuring) shown separately in the accounts.'],
      ['EPS before one-offs', 'Earnings per share without exceptional items and the FY26 deferred-tax write-back (MOSL\'s "adjusted EPS").'],
      ['Deferred-tax write-back', 'A one-off gain when future tax rates fall, so the tax the company expects to pay on past items is restated lower.'],
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
  'sales@FY20': '−7%: vehicle slowdown in India before Covid.',
  'pat@FY20': 'Depreciation up to ₹1,138 cr (₹813 cr in FY19) after the FY17-20 capex; interest ₹300 cr.',
  'ebitdaMargin@FY21': '16.2%: cheap rubber after Covid.',
  'otherIncome@FY21': 'Includes ₹608 cr of exceptional charges (₹596 cr in Europe), netted by Screener.',
  'pat@FY21': 'EPS ₹5.5 reported, ₹10.4 before one-offs (MOSL).',
  'sales@FY22': '+20%: post-Covid demand and price increases.',
  'ebitdaMargin@FY22': '12.4%: raw-material spike.',
  'ebitdaMargin@FY24': '17.6%: falling rubber and crude; the decade\'s peak.',
  'pat@FY24': '₹1,722 cr; EPS ₹27.1 reported, ₹29.3 before one-offs.',
  'pat@FY25': '−35%: margin back to 13.8%; ₹169 cr of exceptional items (Enschede impairment ₹128 cr).',
  'otherIncome@FY26': '₹133 cr of other income less ₹1,034 cr of exceptional items (Enschede ₹1,000 cr, labour codes ₹26 cr, VRS ₹7 cr).',
  'pat@FY26': '+22% reported thanks to a ~₹570 cr deferred-tax write-back (25% regime from FY27); ₹1,698 cr before one-offs (MOSL), +37%.',
  'capex@FY26': '₹1,403 cr: Hungary PCR expansion, start of the AP plan; ₹3,000-3,500 cr guided for FY27.',
  'otherIncome@Q1FY26': 'Includes ₹370 cr of Enschede restructuring charges.',
  'pat@Q1FY26': '₹13 cr after the ₹370 cr Enschede charge.',
  'otherIncome@Q4FY26': 'Includes ₹456 cr of exceptional items (EUR43 mn Enschede fixed-asset write-off and closure costs).',
  'pat@Q4FY26': '₹631 cr incl. the ~₹570 cr deferred-tax write-back (tax −290%).',
  'sales@Q1FY27': '+13%: India +15.6% (volume ~+12%), Europe +0.5% in euros.',
  'opm@Q1FY27': '11.7%: raw materials +17% q/q; Europe 8.9% with Enschede overlap costs.',
  'otherIncome@Q1FY27': 'Includes a ₹23.5 cr exceptional gain (IL&FS recovery).',
  'sales@FY27E': 'GAM: APMEA +15%, Europe +8% (incl. the euro), Others +5%.',
  'ebitdaMargin@FY27E': 'GAM: H1 ~12%, H2 ~13.5-14.5% as price increases, OEM pass-through and Enschede savings arrive.',
  'capex@FY27E': 'GAM: ₹3,200 cr (guidance ₹3,000-3,500 cr); AP expansion.',
  'pat@FY28E': 'GAM: margin recovery; depreciation and interest up with capex.',
};

module.exports = { risks, glossary, statementNotes };
