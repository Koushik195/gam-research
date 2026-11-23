// Uno Minda report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./UNOMINDA.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, price, MULT, FM, rating, buyBelow, sellAbove, medTp, epsSep, k, sectorDr } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a well-run compounder priced at ${n1(X.sepNow)}x Sep-28E EPS; ${rating}`,
  blocks: [
    { callout: '**What you are buying:** a broad, promoter-run Indian auto-parts maker that has grown revenue ~23% a year for a decade by adding products and customers, with Japanese partners in its best JVs, 18-20% returns on capital, moderate debt and a pipeline of new plants (EV powertrain, alloy wheels, PV seats, sunroofs) that should keep revenue growing 17-19% a year to FY29E. Margins are ordinary (~11%) and will stay so: this is volume and content growth, not pricing power.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for ~${Math.round(X.epsCagrFwd)}% a year EPS growth. Since 2021 the market has paid a median ${n1(FM.median)}x forward for Uno Minda, and auto-component stocks were ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026. On the street's own method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. The upside needs the multiple to rise back to the 45-50x of 2024-25, not better earnings.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Medium', `The stock would have to fall ~${Math.round((1 - buyBelow / price) * 100)}%`],
      ['Margin back to 11.5-12% as costs are passed on and new plants mature', 'Medium', 'Q2-Q3FY27 margins; gross margin trend (down three quarters in a row)'],
      ['4W EV powertrain ramps on time with the Inovance JV approved', 'Low-Medium', 'Chinese approval; Khed start-up (H2FY27); EDU orders'],
      ['Outperformance vs production widens again (share gains at Maruti and others)', 'Medium', 'Quarterly growth vs SIAM production and key-client volumes'],
      ['Exports scale to >₹1,500 cr (from ~₹600 cr)', 'Medium', 'Seating and switch export orders; quarterly exports (₹228 cr in Q1)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Volumes slow against the GST-boosted base from Q3FY27', 'Medium', 'FY28E EPS 8-12% below ours; multiple compresses'],
      ['Commodity and wage inflation recovered late or partly', 'Medium', 'Each 0.5pp of margin ≈ 6% of EPS'],
      ['New plants ramp slowly (start-up losses, low utilisation)', 'Medium', 'Depreciation and interest rise before revenue: ROCE dips'],
      ['Inovance JV blocked by Chinese technology-export rules', 'Medium', 'The 4W EV plan (₹1,200 cr of capex) needs a new technology source'],
      ['Share loss at a key 4W client continues', 'Medium', 'Lighting and switch growth below our build'],
      ['Auto sector de-rates further', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS the stock is worth ~₹${n0(Math.round(MULT.bear * epsSep.base / 10) * 10)}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to BUY below ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers, or sooner if margins recover faster than we assume.`,
      `**This is a valuation call, not a business call.** Our FY28E EPS is within a few per cent of the street's. The stock trades at ${n1(X.sepNow)}x Sep-28E EPS; its own history (${n1(FM.median)}x) less the sector de-rating (× ${k.toFixed(3)}) supports ${MULT.base}x. At MOSL's 45x our target would be ~₹${n0(Math.round(45 * epsSep.base / 10) * 10)}, close to the post-Q1 street median of ₹${n0(medTp)}.`,
      `**Biggest swing factor:** the multiple. Each 1x is ~₹${n0(epsSep.base)} a share; each 0.5pp of EBITDA margin is ~₹${n0(Math.round(F.sales[1] * 0.005 * 0.755 / F.shares * MULT.base / 10) * 10)} at our multiple.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Q1FY27 revenue growth', v: '+26%', d: 'normalised; production +22%' },
      { k: 'EBITDA margin band since FY17', v: '10.6-12.3%', d: 'Q1FY27: 10.3%' },
      { k: 'JV share of owners\' profit', v: '21%', d: '₹249 cr in FY26' },
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
      ['OEM', 'Original equipment manufacturer: the vehicle maker (Maruti Suzuki, Hero, Bajaj, Tata Motors and others).'],
      ['Kit value', 'The value of all the parts a supplier could sell into one vehicle model.'],
      ['SOB / SOP', 'Share of business (a supplier\'s share of a customer\'s purchases of a part) / start of production of a new programme.'],
      ['Alloy wheel (LPDC, GDC, HPDC)', 'Aluminium wheels cast at low pressure, by gravity or at high pressure; lighter than steel wheels.'],
      ['EDU / DHT', 'Electric drive unit (motor, inverter and gearbox for an electric car) / dedicated hybrid transmission.'],
      ['Green Mobility', 'Uno Minda\'s division for EV parts and CNG (alternate-fuel) systems, reported separately from Q4FY26.'],
      ['JV / share of JV profit', 'Joint venture; Uno Minda books its share of the JV\'s after-tax profit as one line below EBITDA (equity method), not its revenue.'],
      ['Minority interests', 'The part of a subsidiary\'s profit that belongs to the other shareholders (e.g. Tokai Rika\'s 49% of Uno Mindarika).'],
      ['Prior-period income', 'Income that relates to earlier periods (here customer price settlements) booked when agreed.'],
      ['PSI 2013', 'Maharashtra\'s Package Scheme of Incentives: subsidies for investment in the state, booked as revenue.'],
      ['Labour codes', 'Four national laws in force from Nov-2025 that changed wage definitions, gratuity and minimum wages.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY20': '+5%: a weak vehicle year before Covid.',
  'pat@FY20': '−46%: lower margin (10.8%) and higher depreciation and interest.',
  'sales@FY22': '+30%: recovery from the Covid year.',
  'sales@FY23': '+35%: the fastest growth of the decade.',
  'pat@FY23': '+84%: margin up to 11.1% and other income (incl. JV share) ₹149 cr.',
  'sales@FY26': '+17%: includes ₹69 cr of prior-period income (Q1FY26); +17% on the normalised ₹19,589 cr too.',
  'ebitdaMargin@FY26': '11.5% reported; 11.1% without the ₹69 cr prior-period income.',
  'otherIncome@FY26': '₹256 cr = other income ₹34 cr + share of JV profit ₹249 cr − labour-code exceptional charge ₹28 cr.',
  'pat@FY26': '+27%: owners\' share ₹1,197 cr (₹1,166 cr normalised); minorities ₹87 cr.',
  'cfo@FY26': '₹1,720 cr: lower working capital (receivable days 54 → 50).',
  'capex@FY25': '₹1,656 cr, the highest ever (9.9% of revenue).',
  'sales@Q1FY26': 'Includes ₹69 cr of prior-period income (normalised ₹4,420 cr).',
  'pat@Q1FY26': '₹291 cr incl. the prior-period income (normalised ₹239 cr).',
  'pat@Q3FY26': 'After a ₹22 cr (after tax) labour-code exceptional charge.',
  'sales@Q1FY27': '+24% reported, +26% normalised: castings +32%, Green Mobility +78%, seating +28%.',
  'opm@Q1FY27': '10.3%: commodity and wage inflation; ~40bp dilution from at-cost pass-through.',
  'sales@FY27E': 'GAM: +{{F.salesGrowth.0|pct0}} from the division build.',
  'ebitdaMargin@FY27E': 'GAM: in line with guidance (11% ±50bp).',
  'otherIncome@FY27E': 'GAM: recurring ₹28 cr + (JV share ₹270 cr − minorities ₹97 cr) ÷ (1 − 24.5%).',
  'capex@FY27E': 'GAM: ₹1,750 cr, as guided.',
  'pat@FY28E': 'GAM: new plants (CSN wheels and EV powertrain, PV seating) and a margin recovery.',
};

module.exports = { risks, glossary, statementNotes };
