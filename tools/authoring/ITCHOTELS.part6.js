// ITC Hotels report, part 6: glossary and statement notes.
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Demerger', 'A company splits off a business into a new listed company; the parent\'s shareholders receive shares in it. ITC Hotels was demerged from ITC Ltd on 1-Jan-2025 (1 share for every 10 ITC shares).'],
      ['Keys', 'Hotel rooms (each room has a key). Operating keys are open; pipeline keys are signed but not yet open.'],
      ['Occupancy', 'Rooms sold ÷ rooms available in the period.'],
      ['ARR / ADR', 'Average room rate: room revenue ÷ rooms sold.'],
      ['RevPAR', 'Revenue per available room = occupancy × average room rate. The main measure of a hotel\'s pricing power.'],
      ['RevPAR premium', 'How far a hotel\'s RevPAR is above the market\'s (here the luxury, upper-upscale and upscale market measured by CoStar).'],
      ['Owned hotels', 'Hotels ITC Hotels owns; it books all their revenue and costs and carries the capital.'],
      ['Managed / franchised hotels', 'Hotels owned by others and run (or branded) by ITC Hotels for a fee; only the fee is ITC Hotels\' revenue.'],
      ['Management fees', 'Base fee (share of revenue) plus incentive fee (share of profit) from managed hotels.'],
      ['Luxury Collection', 'A Marriott International brand; the large ITC hotels are franchised into it for global distribution and loyalty.'],
      ['Sapphire Residences / real estate segment', 'Branded apartments next to ITC Ratnadipa in Colombo; revenue is booked when an apartment is handed over.'],
      ['MICE', 'Meetings, incentives, conferences and exhibitions: group business for hotels.'],
      ['EBITDA', 'Operating profit before depreciation, interest, tax and other income. We use the company\'s definition (audited accounts).'],
      ['EV/EBITDA, P/E', 'Enterprise value (market value less net cash; here also less the Colombo apartment inventory) ÷ EBITDA; share price ÷ earnings per share.'],
      ['SOTP', 'Sum of the parts: each business valued separately, then added up, plus net cash.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move (de-rating)', 'How far peers\' trailing EV/EBITDA on 30-Sep-2026 sat below (or above) their own medians over the same window as our own history (from 1-Apr-2025).'],
      ['OCI', 'Other comprehensive income: gains and losses that go straight to equity, here mainly currency translation of the Sri Lankan subsidiary.'],
      ['ROE / ROCE', 'Return on equity (profit ÷ shareholders\' equity) and return on capital employed (operating profit ÷ equity plus debt).'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity, 12.2%, as ITC Hotels has no debt).'],
    ], source: 'GAM Research; company definitions' } },
  ],
};

const statementNotes = {
  'sales@FY24': 'Not a full year: the restated comparative covers ~8 months (28-Jul-2023 to 31-Mar-2024).',
  'pat@FY24': '~8 months (restated comparative).',
  'sales@FY25': 'First year of ITC Hotels\' own accounts (hotels business of ITC restated for the full year); "+60%" vs FY24 is an artefact of the 8-month FY24.',
  'ebitda@FY25': '₹1,211 cr on the audited split (Screener ₹1,253 cr; see the patch note).',
  'otherIncome@FY25': '₹66 cr other income + ₹16 cr associates.',
  'sales@FY26': '+16%: hotels +10% (₹3,928 cr), Sapphire Residences handovers ₹211 cr from Q3.',
  'ebitda@FY26': '₹1,424 cr incl. ₹64 cr from apartments; hotels ₹1,360 cr (34.6%).',
  'otherIncome@FY26': '₹192 cr other income (mostly interest) + ₹12 cr associates − ₹80 cr exceptional items (labour codes ₹54 cr, cyclone Ditwah ₹26 cr).',
  'pat@FY26': '₹888 cr before exceptional items (company, before minorities).',
  'capex@FY26': '₹410 cr; low against cash generation.',
  'otherIncome@Q3FY26': 'Negative: includes the ₹80 cr of exceptional items (labour codes; cyclone Ditwah).',
  'sales@Q3FY26': '+21%: first Sapphire handovers (₹82 cr); hotels +13%.',
  'sales@Q4FY26': '+18%: Sapphire ₹130 cr; hotels +6% as West Asia hit inbound travel.',
  'sales@Q1FY27': '+15%: hotels +10% (RevPAR +8%), Sapphire ₹38 cr; weak April, recovery in May-June.',
  'sales@FY27E': 'GAM: hotels +10% (rooms +9%, F&B +9%, fees +25%); Sapphire ₹160 cr.',
  'capex@FY27E': 'Organic ~₹480 cr plus Kumarakom, Welcomhotel Ahmedabad (EV ₹155 cr) and part of the Yashobhoomi land premium.',
  'pat@FY27E': 'Tax and minorities at 26.8% of PBT; no exceptional items.',
};

module.exports = { glossary, statementNotes };
