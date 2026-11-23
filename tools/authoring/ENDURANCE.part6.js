// Endurance Technologies report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./ENDURANCE.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, price, MULT, FM, rating, buyBelow, sellAbove, medTp, epsSep, k, sectorDr, seg } = X;
const indRev = seg('india').revenue, epsPerPp = pp => indRev[1] * pp / 100 * (1 - 0.255) / F.shares; // EPS change for a margin change in FY28E

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a well-run two-wheeler supplier priced at ${n1(X.sepNow)}x Sep-28E EPS; ${rating}`,
  blocks: [
    { callout: '**What you are buying:** India\'s leading maker of two-wheeler suspension and brakes and a large aluminium caster, with net cash, a clean balance sheet and a credible pipeline of new content (ABS, inverted forks, alloy wheels, 4W castings, battery packs) that should keep India growing well ahead of vehicle volumes. Attached is a European castings business with high margins but no organic growth, and a dependence on Bajaj Auto for a third of income. Margins are set by metal prices and customers, not by Endurance.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for ~${Math.round(X.epsCagrFwd)}% a year EPS growth. Since 2021 the market has paid a median ${n1(FM.median)}x forward for Endurance, and auto-component stocks were ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026. On the street's own method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. The street's higher targets rest on higher EPS, not a higher multiple.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Medium', `The stock would have to fall ~${Math.round((1 - buyBelow / price) * 100)}%`],
      ['India margin back above 13% as metal and conversion costs are recovered', 'Medium', 'Q2-Q3FY27 standalone margin; raw-material share of income (68.4% in Q1)'],
      ['ABS made mandatory for smaller motorcycles', 'Low-Medium', 'Final government notification; ABS volumes (0.28 mn in FY26)'],
      ['Battery packs and Shendra castings ramp on time at company-average margins', 'Medium', 'Battery-pack margin disclosure (promised for the Q2 call); Shendra revenue (>₹200 cr in FY27)'],
      ['Europe wins hybrid/EV work from failing suppliers or buys well', 'Medium', 'Mercedes programme (Jan-2027); order intake; any acquisition'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Two-wheeler volumes slow against the GST-boosted base from Q3FY27', 'Medium', 'FY28E EPS 8-12% below ours; multiple compresses'],
      ['Metal and energy costs recovered late or partly', 'Medium', `Each 0.5pp of India margin ≈ ₹${n1(epsPerPp(0.5))} of FY28E EPS (~${Math.round(epsPerPp(0.5) / F.eps[1] * 100)}%)`],
      ['Bajaj Auto loses share, in-sources or squeezes prices', 'Low-Medium', '35% of income; motorcycles ~70% of India income while the market shifts to scooters'],
      ['Europe: faster ICE run-off, energy spikes, OEM restructuring (VW, Mercedes)', 'Medium', 'Europe EBITDA (~₹800 cr in FY27E) is about a third of group EBITDA on the company basis'],
      ['Acquisition risk', 'Medium', 'Management says more European deals are coming; Europe is the low-growth part of the group'],
      ['Auto sector de-rates further', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS the stock is worth ~₹${n0(Math.round(MULT.bear * epsSep.base / 10) * 10)}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to BUY below ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers, or to BUY sooner if the India margin recovers faster than we assume (the street's case).`,
      `**This is an earnings call more than a multiple call.** Our ${MULT.base}x is close to the street's 30-32x; our Sep-28E EPS (₹${n1(epsSep.base)}) is well below theirs. At ${MULT.base}x on the street-median FY28E EPS the stock would be worth ~₹${n0(Math.round(MULT.base * X.medEps('FY28E') / 10) * 10)}, near the post-Q1 median target of ₹${n0(medTp)}.`,
      `**Biggest swing factor:** India's margin. Each 1x of multiple is ~₹${n0(epsSep.base)} a share; each 1pp of India margin in FY28-29E moves the target by ~₹${n0(Math.round((indRev[1] + indRev[2]) / 2 * 0.01 * (1 - 0.255) / F.shares * MULT.base / 10) * 10)}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Q1FY27 India growth', v: '+36%', d: '~24% excl. metal pass-through' },
      { k: 'India EBITDA margin', v: '11.2%', d: 'Q1FY27; 13.7% in FY25' },
      { k: 'Bajaj Auto share of income', v: '35%', d: 'FY26 (38% in FY25)' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(X.sepNow)}x`, d: `median since 2021: ${n1(FM.median)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Tier-1 supplier', 'A company that sells parts and systems directly to vehicle makers (OEMs).'],
      ['OEM', 'Original equipment manufacturer: the vehicle maker (Bajaj Auto, Honda, Royal Enfield, VW, Mercedes and others).'],
      ['Standalone', 'The listed Indian company on its own (here: the India business), before adding subsidiaries.'],
      ['Total income / company EBITDA', 'Endurance reports total income (revenue plus other income) and EBITDA including other income; Screener and our model show EBITDA excluding other income.'],
      ['Die-casting / machined castings', 'Shaping molten aluminium in steel moulds under pressure; machining then cuts the casting to its final precise shape.'],
      ['Inverted front fork (USD fork)', 'A premium motorcycle front suspension with the tubes upside down, stiffer and lighter than a conventional fork.'],
      ['ABS / CBS', 'Anti-lock braking system (electronic, prevents wheel lock) / combined braking system (one lever brakes both wheels).'],
      ['BMS', 'Battery-management system: the electronics that monitor and protect an EV battery.'],
      ['RMC', 'Raw-material cost as a share of income; metal price changes are passed to customers, usually a quarter later.'],
      ['SOP / RFQ', 'Start of production of a new programme / request for quotation from a customer.'],
      ['PSI', 'Maharashtra\'s Package Scheme of Incentives: state-GST refunds for investment in the state, booked in revenue.'],
      ['Put/call option (Stöferle)', 'Agreements under which Endurance can buy, and the sellers can sell, the remaining 40% of Stöferle in 8% steps each year to 2030.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY20': '−8%: the 2019-20 two-wheeler downturn.',
  'pat@FY20': '+14% despite lower sales: the new 25% corporate tax rate (tax 24% vs 32%).',
  'sales@FY21': '−5%: Covid lockdowns.',
  'ebitdaMargin@FY22': '12.8% from 15.9%: aluminium and energy costs (passed through at cost and late).',
  'pat@FY24': '+42%: margin back to 13% and other income ₹86 cr.',
  'sales@FY26': '+26%: Stöferle (from Apr-2025) added ~₹840 cr; ~19% without it.',
  'dep@FY26': '+36%: Stöferle and new Indian plants (Bidkin).',
  'otherIncome@FY26': '₹103 cr = other income ₹124 cr less the ₹21 cr labour-code exceptional charge.',
  'pat@FY26': '+14% after the labour-code charge.',
  'capex@FY26': '₹1,296 cr (Screener): India ~₹828 cr, Europe EUR45 mn.',
  'otherIncome@Q3FY26': 'Net of the ₹21 cr labour-code exceptional charge.',
  'sales@Q4FY26': '+38%: India +31%, Europe +56% in rupees (Stöferle, strong production).',
  'sales@Q1FY27': '+30%: India +36% (incl. ~13 points of metal pass-through), Europe +14% in rupees (+1% in euros).',
  'opm@Q1FY27': '12.4%: India billed on Q4 metal rates; gas, fuel and wage costs up.',
  'dep@Q1FY27': '+35%: new plants and accelerated depreciation of Europe ICE-programme assets (EUR11.6 mn vs EUR8.5 mn).',
  'sales@FY27E': 'GAM: India +23%, Europe +2% in euros (+9.5% in rupees), Maxwell +50%.',
  'ebitdaMargin@FY27E': 'GAM: India margin 12.0% (11.2% in Q1, ~12.3% for Q2-Q4).',
  'otherIncome@FY27E': 'GAM: treasury income ₹40 cr + recurring items ₹75 cr; no currency gains.',
  'pat@FY28E': 'GAM: margin recovery in India and new plants at scale.',
};

module.exports = { risks, glossary, statementNotes };
