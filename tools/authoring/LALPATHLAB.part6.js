// Dr Lal PathLabs report, part 6: glossary and statement notes.
const X = require('./LALPATHLAB.ctx');
const { n1, epsU, epsBase, MIN, SECTOR } = X;

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Pathology', 'Testing of blood, urine and tissue samples in a laboratory (Dr Lal\'s core business)'],
      ['Radiology', 'Imaging: X-ray, ultrasound, CT, MRI (<5% of Dr Lal\'s revenue)'],
      ['Hub and spoke', 'A network where collection points (spokes) send samples to satellite labs and reference labs (hubs), spreading costly machines over large volumes'],
      ['PSC / PUP', 'Patient service centre (a collection centre, mostly franchised) / pick-up point (a doctor, clinic or small lab that hands over samples)'],
      ['B2C / B2B', 'Business-to-consumer: patients paying directly (~75% of revenue). Business-to-business: hospitals, institutions, government schemes and other labs (~25%)'],
      ['Revenue per patient (RPP)', 'Revenue ÷ patients; rises with more tests per visit, richer mix or price'],
      ['SwasthFit', 'Dr Lal\'s bundled preventive health packages (27% of revenue in FY26)'],
      ['CGHS / ECHS', 'Central Government Health Scheme / Ex-servicemen Contributory Health Scheme: government schemes with a common rate card for tests; a 2026 revision lifted Dr Lal\'s revenue by 2-3%'],
      ['NABL / CAP', 'Indian and US (College of American Pathologists) laboratory accreditations'],
      ['Aggregator', 'An online platform that sells tests from many labs or its own, often at a discount (e.g. Tata 1mg, PharmEasy)'],
      ['Suburban', 'Suburban Diagnostics, Mumbai, bought in 2021 for ₹925 cr and merged into the parent in Mar-2025'],
      ['Tier-3+', 'Towns below the top two tiers of cities; 39% of Dr Lal\'s revenue'],
      ['Labour Codes', 'India\'s new labour laws (from Nov-2025); widened the wage base for gratuity, causing a one-time ₹30 cr charge'],
      ['Ind AS 116', 'The lease accounting standard: rent becomes depreciation and interest, so EBITDA excludes it'],
      ['Exceptional items', 'One-off gains or charges outside normal business (FY25 tax credit, FY26 labour-code charge)'],
      ['EPS before exceptional items', `Profit to shareholders excluding exceptional items, per share: the basis of our multiple's history (FY26 ₹${n1(epsBase[2026])})`],
      ['Forward P/E', 'Share price ÷ next full fiscal year\'s EPS'],
      ['EV / EBITDA', 'Enterprise value (market value plus net debt, here less net cash) ÷ operating profit before depreciation'],
      ['Sector factor', `How far the three diagnostics peers' P/E at the 30-Sep-2026 close sits against their own five-year medians (${SECTOR}%, excluding Dr Lal)`],
      ['Trough rule', 'Years whose forward EPS is a loss or below half the best of the previous three years are left out of the multiple history (none here)'],
      ['DCF / WACC', 'Discounted cash flow value; WACC is the cost of capital used to discount (11.6%, equal to the cost of equity because Dr Lal has no debt)'],
      ['ROCE / ROE', 'Return on capital employed and return on equity'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '+19%: COVID testing began (RT-PCR) while routine testing recovered.',
  'sales@FY22': '+32%: COVID testing ₹242 cr; Suburban consolidated from 12-Nov-2021.',
  'sales@FY23': '−3%: COVID testing fell to ₹25 cr; non-COVID revenue +8%.',
  'sales@FY24': '+10%: patients +2.6%, revenue per patient +7.6%.',
  'sales@FY25': '+11%: patients +4.3%; SwasthFit 24% of revenue.',
  'sales@FY26': '+12%: patients +5.3%, samples +10.4%; GST cut passed on in Q3.',
  'ebitdaMargin@FY23': '24.3%: COVID volumes gone; Suburban\'s lower margin for a full year.',
  'ebitdaMargin@FY24': '+305bp: operating leverage; reagent cost 20.3% of revenue (22.2%).',
  'dep@FY22': '+40%: Suburban\'s assets and acquisition intangibles from Nov-2021.',
  'dep@FY23': '₹150 cr: full year of Suburban brand and customer amortisation.',
  'interest@FY22': 'Term loan taken for Suburban (₹345 cr); repaid FY23-25.',
  'otherIncome@FY26': 'Net of the ₹30.1 cr labour-code charge (Screener books it here); ₹101 cr before it.',
  'pat@FY22': '+18%: COVID peak (EPS ₹20.7).',
  'pat@FY23': '−31%: COVID testing gone, Suburban amortisation and interest (EPS ₹14.3).',
  'pat@FY24': '+50%: margin recovery, lower interest.',
  'pat@FY25': '+36%: incl. a ₹40.8 cr one-time deferred-tax credit on the Suburban liquidation; +24% before it.',
  'pat@FY26': '+4%: after the ₹30.1 cr labour-code charge and against FY25\'s tax credit; normalised PAT +18%.',
  'sales@Q1FY27': '+19.1%: patients +8.2%, revenue per patient +10% (CGHS/ECHS 2-3pp).',
  'ebitda@Q1FY27': 'Margin 31.0% (+232bp): operating leverage, CGHS pass-through.',
  'otherIncome@Q3FY26': 'Net of the ₹30.1 cr labour-code charge.',
  'pat@Q3FY26': 'After the labour-code charge (₹21 cr after tax).',
  'pat@Q4FY25': 'Includes the ₹40.8 cr Suburban-liquidation tax credit.',
  'sales@FY27E': 'GAM build: patients +7%, revenue per patient +8%.',
  'ebitdaMargin@FY27E': 'Guidance 27-28% (reinvest the excess); Q1 31.0%.',
  'dep@FY27E': 'Engine rate 6.4% of gross block; bottom-up schedule ₹162 cr (brand amortisation ends).',
  'eps@FY27E': `₹${n1(epsU[0])} to shareholders after ₹${MIN[0]} cr of minorities (tax line).`,
  'eps@FY29E': `₹${n1(epsU[2])}; minorities ₹${MIN[2]} cr; cash pile rising.`,
};

module.exports = { glossary, statementNotes };
