// Indian Hotels report, part 6: glossary and statement notes.
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Keys', 'Hotel rooms (each room has a key). Operating keys are open; pipeline keys are signed but not yet open.'],
      ['Occupancy', 'Rooms sold ÷ rooms available in the period.'],
      ['ARR / ADR', 'Average room rate: room revenue ÷ rooms sold.'],
      ['RevPAR', 'Revenue per available room = occupancy × average room rate. The main measure of a hotel\'s pricing power.'],
      ['TRevPAR', 'Total revenue (rooms, food, other) per available room.'],
      ['Like-for-like (LFL)', 'The same hotels in both periods, excluding new openings and hotels under major renovation.'],
      ['Owned / leased', 'Hotels IHCL owns or rents; it books all their revenue and costs. Revenue-share ("capital-light") leases: the owner pays for the building and IHCL pays a share of revenue.'],
      ['Managed / franchised', 'Hotels owned by others and run (or branded) by IHCL for a fee; only the fee is IHCL revenue.'],
      ['Management fees', 'Base fee (share of revenue) plus incentive fee (share of profit) from managed hotels, plus brand fees from branded residences.'],
      ['License fees', 'Payments under revenue-share leases and some long-term arrangements, booked as operating costs.'],
      ['TajSATS', 'IHCL\'s airline catering company (51% IHCL, 49% SATS of Singapore), consolidated since Aug-2024.'],
      ['New businesses / growth brands', 'Ginger (midscale hotels), Qmin (food), ama (homestays), Tree of Life (boutique leisure).'],
      ['Minorities / non-controlling interest', 'The share of a subsidiary\'s profit and equity that belongs to partners (e.g. SATS\'s 49% of TajSATS).'],
      ['Exceptional items', 'Gains and charges the company reports separately because they are not part of normal trading (e.g. the Taj GVK stake sale).'],
      ['Ind AS 116 (leases)', 'Accounting rule that puts leases on the balance sheet: rent becomes depreciation and interest, and future rent a lease liability.'],
      ['EV/EBITDA, P/E', 'Enterprise value (market value plus net debt, here including lease liabilities and, in our history, minorities) ÷ EBITDA; share price ÷ earnings per share.'],
      ['SOTP', 'Sum of the parts: each business valued separately, then added up, less minorities, plus net cash.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move (de-rating)', 'How far peers\' trailing EV/EBITDA on 30-Sep-2026 sat below (or above) their own medians over the same window.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity, 12.2%, as IHCL has net cash).'],
    ], source: 'GAM Research; company definitions' } },
  ],
};

const statementNotes = {
  'sales@FY21': 'Covid: hotels shut for months; revenue −65%.',
  'ebitda@FY21': 'Operating loss of ₹362 cr.',
  'pat@FY21': 'Attributable loss of ₹720 cr.',
  'sales@FY22': 'Partial recovery; Omicron in Q4FY22.',
  'sales@FY23': '+90%: first full post-Covid year; record room rates.',
  'ebitdaMargin@FY23': '31%: rates up faster than costs; cost savings kept from the Covid years.',
  'sales@FY25': '+23%: TajSATS consolidated from 1-Aug-2024 (₹717 cr); hotels +13%.',
  'otherIncome@FY25': 'Includes ₹307 cr fair-value gain on TajSATS becoming a subsidiary (exceptional).',
  'pat@FY25': '₹1,603 cr before exceptional items.',
  'sales@FY26': '+16%: TajSATS full year; ANK/Pride from Dec-2025, Atmantan from Jan-2026; hotels +11%.',
  'otherIncome@FY26': 'Includes ₹399 cr gain on selling the Taj GVK stake, less key money, labour-code and other charges (Screener exceptional ₹309 cr).',
  'pat@FY26': '₹1,849 cr before exceptional items.',
  'capex@FY26': '₹1,037 cr plus ₹422 cr for ANK/Pride and Atmantan.',
  'otherIncome@Q2FY25': 'Includes the ₹307 cr TajSATS fair-value gain.',
  'otherIncome@Q3FY26': 'Includes the Taj GVK gain (net exceptional ₹276 cr).',
  'sales@Q1FY27': '+15%: hotels +17%, TajSATS +3% (West Asia); Brij from 21-Apr-2026.',
  'opm@Q1FY27': '29%: seasonal low quarter; ~₹12-15 cr of Frankfurt and Noida start-up costs.',
  'sales@FY27E': 'GAM: hotels +14% (room +14.5%, fees +19%, Atmantan full year), TajSATS +7%.',
  'capex@FY27E': 'Company guide ₹1,100-1,300 cr plus ~₹100 cr of new leases (Frankfurt).',
  'pat@FY27E': 'Tax plus minorities less associates at 31% of PBT; no exceptional items.',
};

module.exports = { glossary, statementNotes };
