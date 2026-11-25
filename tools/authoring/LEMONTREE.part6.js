// Lemon Tree report, part 6: glossary and statement notes.
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Keys / rooms', 'Hotel rooms. Operating rooms are open; pipeline rooms are signed but not yet open.'],
      ['Occupancy', 'Rooms sold ÷ rooms available in the period.'],
      ['ARR', 'Average room rate: room revenue ÷ rooms sold (Lemon Tree reports it for owned and leased hotels).'],
      ['RevPAR', 'Revenue per available room = occupancy × average room rate.'],
      ['Owned / leased / managed / franchised', 'Owned and leased hotels: Lemon Tree books all revenue and costs (leased: it rents the building). Managed: owned by others, run by Lemon Tree for a fee. Franchised: the owner runs the hotel under a Lemon Tree brand and pays a fee.'],
      ['Network revenue', 'Revenue of all hotels under Lemon Tree\'s brands, owned and managed.'],
      ['Aurika / Lemon Tree Premier / Lemon Tree / Red Fox / Keys', 'Lemon Tree\'s brands, from upscale (Aurika) to economy (Red Fox, Keys Lite).'],
      ['Fleur Hotels', 'The subsidiary that owns most of Lemon Tree\'s hotels: 58.91% Lemon Tree, 41.09% Warburg Pincus (APG until 22-May-2026). Under the scheme it takes all the hotels and the debt and lists separately.'],
      ['Composite scheme of arrangement', 'The court-approved (NCLT) plan, approved by the board on 9-Jan-2026, that merges and demerges hotels into Fleur so Lemon Tree becomes an asset-light manager.'],
      ['Minorities / non-controlling interest', 'The share of a subsidiary\'s profit and equity that belongs to outside partners (here Warburg\'s 41.09% of Fleur).'],
      ['GST impact', 'Since Sep-2025, rooms sold below ₹7,500 a night carry GST without input-tax credit, so the hotel bears the tax on its own costs.'],
      ['SAR', 'Stock appreciation rights: cash bonuses linked to the share price, provided for as a cost.'],
      ['Ind AS 116 (leases)', 'Accounting rule that puts leases on the balance sheet: rent becomes depreciation and interest, and future rent a lease liability.'],
      ['EV/EBITDA, P/E', 'Enterprise value (market value plus net debt incl. lease liabilities and, in our history, minorities) ÷ operating EBITDA; share price ÷ earnings per share.'],
      ['SOTP', 'Sum of the parts: here 100% of EBITDA at a multiple, less the minorities\' share of the equity value, less net debt.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move (de-rating)', 'How far peers\' trailing EV/EBITDA on 30-Sep-2026 sat below (or above) their own medians over the same window.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the blended required return on debt and equity (11.3% here).'],
    ], source: 'GAM Research; company definitions' } },
  ],
};

const statementNotes = {
  'sales@FY20': '+22%: CWIP of ₹664 cr moved into fixed assets as projects opened; Covid hit only in March.',
  'capex@FY20': 'Peak capex (₹644 cr) for Aurika Mumbai and other owned projects.',
  'sales@FY21': 'Covid: revenue −62%.',
  'pat@FY21': 'Attributable loss of ₹127 cr.',
  'pat@FY22': 'Attributable loss of ₹87 cr (Omicron in Q4FY22).',
  'sales@FY23': '+118%: first full post-Covid year; record rates.',
  'ebitdaMargin@FY23': '51%: rates up faster than costs; Covid-era savings kept.',
  'sales@FY24': '+22%: Aurika Mumbai Skycity open from 3-Oct-2023.',
  'interest@FY24': 'Finance cost peaks at ₹208 cr (incl. leases).',
  'ebitdaMargin@FY26': '47.8%: renovation (~4.2% of revenue), technology and half a year of the GST change.',
  'otherIncome@FY26': 'Includes the −₹33 cr labour-code exceptional charge.',
  'pat@FY26': '₹245 cr before exceptional items; minorities took ₹61 cr.',
  'otherIncome@Q3FY26': 'Includes the labour-code charge.',
  'sales@Q1FY27': '+9%: occupancy +314 bps, ARR +2% (West Asia shock).',
  'opm@Q1FY27': '43%: GST input-credit loss (2.3% of revenue) and SAR provision (0.8%).',
  'sales@FY27E': 'GAM: owned hotels +8%, third-party fees +30%.',
  'ebitdaMargin@FY28E': 'Renovation and GST costs fall to ~3.7% of revenue (guide).',
  'pat@FY27E': 'Tax plus minorities at 41% of PBT; no exceptional items.',
};

module.exports = { glossary, statementNotes };
