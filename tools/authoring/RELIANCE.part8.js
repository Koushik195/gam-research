// Reliance report, part 8: glossary and statement notes (explain every big change in the annotated financials).
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'Meaning'], wide: [1], rows: [
      ['O2C', 'Oil-to-chemicals: RIL\'s refining, petrochemicals and fuel-marketing segment.'],
      ['Crack / crack spread', 'The price of a fuel (diesel, petrol, jet) minus the price of the crude it is made from, in $/bbl.'],
      ['GRM', 'Gross refining margin: what a refinery earns per barrel of crude processed.'],
      ['SAED / export duty', 'Special additional excise duty and export levies on diesel, petrol and jet fuel, reviewed every two weeks; the government\'s windfall tax.'],
      ['Under-recovery', 'The loss on fuel sold below cost because pump prices are held down.'],
      ['Ethane cracking', 'Making ethylene from US ethane rather than naphtha; cheaper when naphtha tracks high crude prices.'],
      ['KG-D6', 'RIL\'s deep-water gas fields off the Krishna-Godavari coast.'],
      ['MMSCMD / MMBtu', 'Million standard cubic metres per day (gas volume) / million British thermal units (gas energy, price unit).'],
      ['ARPU', 'Average revenue per user per month.'],
      ['FWA', 'Fixed wireless access: home broadband over 5G radio (Jio AirFiber).'],
      ['DRHP', 'Draft red herring prospectus: the IPO document filed with SEBI before the price is set.'],
      ['Hyper-local / quick commerce', 'Delivery within ~30 minutes from nearby stores or dark stores.'],
      ['EBITDA', 'Earnings before interest, tax, depreciation and amortisation. "Company definition" includes other income attributed to segments; "Screener basis" excludes all other income.'],
      ['EV/EBITDA', 'Enterprise value (market value + net debt + minority interest) divided by EBITDA.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the earnings the market will look at in September 2027, our target date.'],
      ['SOTP', 'Sum of the parts: each business valued separately, then added up, less net debt.'],
      ['Minority interest', 'The share of a subsidiary owned by other shareholders (e.g., 33.57% of Jio Platforms).'],
      ['Holding-company discount', 'A discount applied to a stake in a subsidiary because the parent\'s shareholders cannot access its cash directly.'],
      ['Deferred payment liabilities', 'Spectrum bought at auction and paid for in yearly instalments: debt in all but name.'],
      ['JDFPL', 'Jio Digital Fibre Pvt Ltd: the fibre-infrastructure company in which RIL holds ₹98,881 cr of preference shares.'],
      ['Sector move', 'How far a peer group\'s multiples sit above or below their own five-year medians on the as-of date (our §7c factor).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'otherIncome@FY21': 'Includes a ₹5,642 cr exceptional gain; Jio Platforms and Reliance Retail had sold minority stakes in 2020.',
  'sales@FY22': '+49%: crude prices recovered; O2C EBITDA ₹52,722 cr.',
  'ebitda@FY22': 'E&P EBITDA rises from ₹258 cr to ₹5,457 cr as the new KG-D6 fields ramp up.',
  'sales@FY23': '+26% on high crude prices and cracks.',
  'dep@FY23': '₹40,303 cr (+35%): Jio network and KG-D6 assets capitalised.',
  'ebitda@FY24': '+14%: E&P +49%, Retail +28%.',
  'eps@FY25': 'All years shown on the post-bonus share count (1:1 bonus, Oct-2024).',
  'ebitda@FY25': 'O2C EBITDA −12% as cracks normalise; Jio +15%.',
  'otherIncome@FY26': '₹28,846 cr includes the ₹8,924 cr gain on Asian Paints shares (~₹5.4 of EPS).',
  'pat@FY26': 'Attributable ₹80,775 cr after ₹14,979 cr to minorities; ex the gain ~₹73,400 cr.',
  'sales@FY27E': '+17%: Brent ~$95 assumed (Q1FY27 $104.5); O2C windfall partly taxed by export duties.',
  'interest@FY27E': '₹33,500 cr: interest on 5G spectrum no longer capitalised (Q1FY27 ₹8,337 cr).',
  'pat@FY28E': 'Tax line includes 14% of PAT for minorities (Jio 33.57%, Retail 16.44%).',
  'capex@FY29E': 'Capex eases to ₹1.3 lakh cr; New Energy still valued at cost.',
};

module.exports = { glossary, statementNotes };
