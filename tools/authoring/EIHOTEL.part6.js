// EIH report, part 6: glossary and statement notes.
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Keys', 'Hotel rooms (each room has a key). Operating keys are open; pipeline keys are signed but not yet open.'],
      ['Occupancy', 'Rooms sold ÷ rooms available in the period.'],
      ['ARR', 'Average room rate: room revenue ÷ rooms sold.'],
      ['RevPAR', 'Revenue per available room = occupancy × average room rate. The main measure of a hotel\'s pricing power.'],
      ['MPI / ARI / RGI', 'Occupancy, rate and RevPAR of a hotel as an index of its competitive set (100 = in line). RGI 191 means 91% more RevPAR than the set.'],
      ['Owned / associate / managed', 'Owned hotels: EIH books all revenue and costs. Associate: owned by EIH Associated Hotels (EIH 36.81%), run by EIH. Managed: owned by others, run by EIH for a fee.'],
      ['Oberoi / Trident / Vilas', 'Oberoi: EIH\'s luxury brand; the Vilas are its leisure resorts (Amarvilas, Udaivilas, Rajvilas and others). Trident: its five-star brand.'],
      ['OFS', 'Oberoi Flight Services: EIH\'s airline catering kitchens (Mumbai, Delhi, Chennai, Kolkata).'],
      ['Mashobra / Wildflower Hall', 'Mashobra Resort Ltd, the former EIH-Himachal joint venture that owned Wildflower Hall, Shimla; handed to the State on 31-Mar-2025.'],
      ['Surplus funds', 'The company\'s measure of cash and liquid investments net of debt.'],
      ['Minorities / non-controlling interest', 'The share of a subsidiary\'s profit and equity that belongs to partners (e.g. 40% of Svara Hotels).'],
      ['Exceptional items', 'Gains and charges reported separately because they are not part of normal trading (e.g. the Mashobra settlement, the labour-code charge).'],
      ['Labour codes', 'Four national labour laws in force from 21-Nov-2025; they raised gratuity and leave liabilities (₹30 cr one-off at EIH) and ongoing staff costs.'],
      ['Ind AS 116 (leases)', 'Accounting rule that puts leases on the balance sheet: rent becomes depreciation and interest, and future rent a lease liability.'],
      ['EV/EBITDA, P/E', 'Enterprise value (market value plus net debt incl. lease liabilities and, in our history, minorities) ÷ operating EBITDA; share price ÷ earnings per share.'],
      ['SOTP', 'Sum of the parts: the business valued on EV/EBITDA, less minorities, plus the listed associate at market less 20%, plus net cash.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move (de-rating)', 'How far peers\' trailing EV/EBITDA on 30-Sep-2026 sat below (or above) their own medians over the same window.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity, 12.2%, as EIH has net cash).'],
    ], source: 'GAM Research; company definitions' } },
  ],
};

const statementNotes = {
  'sales@FY21': 'Covid: hotels shut for months; revenue −69%.',
  'ebitda@FY21': 'Operating loss of ₹354 cr.',
  'pat@FY21': 'Attributable loss of ₹370 cr.',
  'ebitda@FY22': 'Still a small operating loss (−₹34 cr); Omicron in Q4FY22.',
  'sales@FY23': '+105%: first full post-Covid year; record room rates.',
  'ebitdaMargin@FY23': '30%: rates up faster than costs; Covid-era savings kept.',
  'ebitdaMargin@FY24': '37%: peak rates; bank debt fully repaid.',
  'sales@FY26': '+7%: almost no new rooms; the Grand Kolkata and Trident Jaipur shut for renovation; Wildflower Hall on interim terms; flight catering strong.',
  'ebitdaMargin@FY26': '34.8%: flight-catering mix and airport levy, a ₹30 cr political donation, repairs, CSR.',
  'otherIncome@FY26': 'Includes −₹132 cr of exceptional items (Mashobra settlement net −₹102 cr, labour codes −₹30 cr) and ₹57 cr share of associates.',
  'pat@FY26': '₹715 cr before exceptional items (Screener, attributable).',
  'capex@FY26': 'Includes ~₹330 cr to convert the Mumbai hotel land to freehold.',
  'otherIncome@Q1FY26': 'Includes the −₹110 cr Mashobra charge (fair value of the shares).',
  'sales@Q1FY27': '+15%: owned RevPAR +14%; flight catering ₹154 cr.',
  'opm@Q1FY27': '25%: Rajgarh ramp-up, renovation write-offs (₹7.5 cr), marketing, fuel, labour-code wages.',
  'sales@FY27E': 'GAM: rooms +13%, F&B incl. flight catering +10%, other services +12%.',
  'capex@FY27E': 'Guide ₹600-700 cr a year for one to two years, higher towards FY29-30.',
  'pat@FY27E': 'Tax plus minorities at 30% of PBT; no exceptional items.',
};

module.exports = { glossary, statementNotes };
