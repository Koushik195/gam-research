// Amara Raja report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./ARE&M.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, price, MULT, coreMed, rating, buyBelow, sellAbove, medTp, epsSep, k, sectorDr, shares, aract, oiB, BL } = X;
const coreEps = epsSep.base;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: an ordinary-margin battery franchise at a below-average price, with a lithium option valued at cost; ${rating}`,
  blocks: [
    { callout: '**What you are buying:** India\'s number-two lead-acid battery franchise (Amaron; OEM and telecom relationships; growing home energy), nearly debt-free and cash-generative, in a good volume cycle (post-GST OEM boom, a replacement wave to come, data-centre UPS). Margins have slid to ~10-11% and underlying EPS has barely grown in five years. Attached: ARACT, a lithium subsidiary with ₹1,900 cr of equity, a profitable-ish pack business, a cheap BESS line and a cell plant that will not produce until 2027.' },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E standalone EPS. Net of the subsidiaries, the core trades at ${n1(X.coreNowSep)}x Sep-28E EPS against a ${n1(coreMed)}x median since 2021, while auto-component stocks were ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026. Our sum of the parts gives {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. The street's median target (₹${n0(medTp)}) is higher still; it was set before the stock fell ~22% in seven weeks. We do not pay for BESS profits or a cell ramp; the upside is in the core.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Margins back to 12%+ as the June and August price increases land and strategic spending fades', 'Medium', 'Q2-Q3FY27 gross margin and other expenses as a share of sales'],
      ['BESS plant fills fast (5 GWh within 6-7 months) at 5-8% margins', 'Medium', 'Order book with EPC players; ARACT losses in the consolidated accounts'],
      ['Cell approvals at OEMs and telecom; PLI award under the re-opened 10 GWh tranche', 'Low-Medium', 'B and C samples, PLI results, the 2 GWh line on time (Q2-CY2027)'],
      ['Exports recover (Middle East shipping)', 'Medium', 'Quarterly export revenue (−20% in Q1FY27)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['ARACT needs much more money (cell capacity beyond 2 GWh) before it earns', 'Medium', `The parent's FY28-29E cash (₹${n0(oiB[2].treasury)} cr of treasury income in FY29E) goes to ARACT; value only if returns beat 12.5%`],
      ['ARACT losses larger or longer (approvals, yields, Chinese material curbs)', 'Medium', `Bear case: half of book: ARACT worth ~₹${n0(aract.bear.value / shares)} a share vs ₹${n0(aract.base.value / shares)}`],
      ['Alloy, acid and plastic costs keep outrunning price increases', 'Medium', `Each 0.5pp of margin ≈ ₹${n1(F.sales[1] * 0.005 * (1 - X.TAX) / shares)} of FY28E EPS`],
      ['Auto-OEM growth reverses against the post-GST base from Q3FY27', 'Medium', 'FY28E EPS 5-10% below ours'],
      ['Lithium takes telecom, e-rickshaw and inverter batteries faster', 'Medium', 'Lower industrial and home-energy growth'],
      ['Governance: family pay, related-party flows, a combined Chairman-MD role', 'Low-Medium', 'A higher discount to peers'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD above ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers; a Q2 margin below ~10.5% or a large new ARACT commitment would make us revisit the target.`,
      `**This is a valuation call on the core, not a lithium call.** Our FY28E EPS is ~in line with the street. We use a lower core multiple than most (${MULT.base}x: own core history ${n1(coreMed)}x × ${k.toFixed(3)} vs the street's 12-18x) and value ARACT below the bulls (₹${n0(aract.base.value / shares)} vs ₹306-356 a share).`,
      `**Biggest swing factors:** each 1x on the core is ~₹${n0(coreEps)} a share; ARACT at Nuvama's 2x book instead of book less losses adds ~₹${n0((2 * aract.base.book - aract.base.value) / shares)}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Q1FY27 revenue growth', v: '+20.6%', d: 'EBITDA margin 10.1%' },
      { k: 'EBITDA margin', v: '11.4%', d: 'FY26; 15-18% in FY15-21' },
      { k: 'Equity in ARACT', v: '₹1,900 cr', d: '₹104 a share; FY26 loss ₹73 cr' },
      { k: 'Core P/E (Sep-28E)', v: `${n1(X.coreNowSep)}x`, d: `median since 2021: ${n1(coreMed)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Lead-acid battery', 'The standard car starter, inverter and industrial battery: lead plates in sulphuric acid. Cheap, recyclable, heavy.'],
      ['Tubular battery', 'A deep-cycle lead-acid battery used with home inverters and solar.'],
      ['VRLA', 'Valve-regulated (sealed) lead-acid battery, used in telecom and UPS.'],
      ['Lithium-ion cell (NMC, LFP)', 'The cell used in EVs and modern storage. NMC (nickel-manganese-cobalt) is energy-dense; LFP (lithium iron phosphate) is cheaper and safer, used in storage and 3W.'],
      ['Pack', 'Cells assembled with electronics and casing into a battery for a vehicle, a tower or a building.'],
      ['GWh', 'Gigawatt-hour: a measure of battery capacity. 1 GWh = 1,000,000 kWh.'],
      ['BESS', 'Battery energy storage system: large batteries for the grid, solar plants or factories (C&I = commercial and industrial).'],
      ['CQP', 'Customer Qualification Plant: a pilot line that makes sample cells for customers to test.'],
      ['ACC PLI', 'The government\'s production-linked incentive for advanced chemistry cell plants.'],
      ['OEM / aftermarket', 'Batteries fitted in new vehicles / bought later as replacements.'],
      ['Trading (traded goods)', 'Products bought from other makers and resold under the company\'s brands.'],
      ['ARACT, ARCSPL, ARPSL', 'Amara Raja Advanced Cell Technologies (lithium), Amara Raja Circular Solutions (lead recycling), Amara Raja Power Systems (chargers): 100% subsidiaries.'],
      ['Standalone / consolidated', 'Accounts of the listed company alone (the lead-acid business) / of the whole group including the subsidiaries.'],
      ['Exceptional items', 'Large one-off gains or losses shown separately (here fire-related insurance and a labour-code charge).'],
      ['Sum of the parts (SOTP)', 'Valuing each part separately (core business, ARACT, other subsidiaries) and adding them up.'],
      ['Book value / PV of losses', 'Equity on the balance sheet / today\'s value of losses still to come, discounted at the cost of equity.'],
      ['P/E, core P/E', 'Share price ÷ EPS; core P/E takes the subsidiaries out of the price.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / cost of equity', 'Discounted cash flow valuation; the required annual return used to discount future cash.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'ebitdaMargin@FY22': '11.8% (15.6% in FY21): lead and other input costs rose faster than prices.',
  'pat@FY22': '₹511 cr: margin squeeze.',
  'sales@FY22': '+22%: price increases and volume recovery after Covid.',
  'sales@FY23': '+19%: volumes and prices; New Energy packs still inside the company until Jun-2023.',
  'pat@FY23': '₹731 cr after a ₹47.65 cr net fire charge (Chittoor tubular plant).',
  'sales@FY24': '+8%: the New Energy business moved to ARACT from 1-Jun-2023.',
  'otherIncome@FY25': '₹199 cr: includes ₹111 cr of insurance income (exceptional).',
  'otherIncome@FY26': '₹344 cr: includes ₹259 cr of net exceptional income (insurance ₹303 cr less labour code ₹44 cr).',
  'pat@FY26': '₹970 cr reported; ~₹776 cr before exceptional items.',
  'ebitdaMargin@FY26': '11.4%: alloys, acid and plastics up; more traded goods and OEM mix.',
  'capex@FY25': '₹752 cr: capacity, including reinstating the tubular plant after the fire.',
  'otherIncome@Q3FY25': '₹140 cr: includes ₹111 cr of insurance income.',
  'otherIncome@Q2FY26': '₹146 cr: includes ₹122 cr business-interruption insurance.',
  'otherIncome@Q3FY26': '−₹17 cr: after the ₹44 cr labour-code charge.',
  'otherIncome@Q4FY26': '₹209 cr: includes ₹181 cr insurance settlement.',
  'sales@Q1FY27': '+21%: OEM 4W +24%, 2W +35%, home energy +60%; exports −20%.',
  'opm@Q1FY27': '10.1%: input costs, warranty, freight and ~0.9pp of strategic spending.',
  'sales@FY27E': 'GAM: +{{F.salesGrowth.0|pct0}} from the three-line build.',
  'ebitdaMargin@FY27E': 'GAM: Q1 10.1%, then ~11.0% for Q2-Q4 as price increases land.',
  'otherIncome@FY27E': 'GAM: no exceptional items; the parent is in net debt while funding ARACT.',
  'otherIncome@FY29E': 'GAM: interest on cash rebuilt from FY28E (no further ARACT infusion assumed).',
  'pat@FY27E': 'GAM: below FY26 reported (insurance income), +8% on FY26 before one-offs.',
  'capex@FY27E': 'GAM: ~₹400 cr for lead-acid, as guided; lithium capex sits in ARACT.',
};

module.exports = { risks, glossary, statementNotes };
