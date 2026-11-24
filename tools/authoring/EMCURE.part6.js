// Emcure report, part 6: glossary and statement notes.
const X = require('./EMCURE.ctx');
const { n1, epsU, byBase } = X;

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['IPM', 'Indian pharmaceutical market: sales of medicines through chemists, measured by IQVIA at retail prices'],
      ['Branded generic', 'An off-patent medicine sold under a company brand and promoted to doctors'],
      ['In-licensing / distribution deal', 'Selling another company\'s brand (here Sanofi, Novo Nordisk, Roche) for a margin; the owner keeps the brand and usually makes the product'],
      ['Acute / chronic', 'Acute: short courses (antibiotics, pain). Chronic: long-term treatment (blood pressure, diabetes), which repeats and is stickier'],
      ['Chiral molecule', 'A drug made of only the active "mirror-image" form of a molecule (e.g. S-metoprolol), allowing lower doses'],
      ['Ferric carboxymaltose (FCM)', 'An injectable iron for anaemia; Emcure was first to launch it in India (Orofer FCM)'],
      ['Tenecteplase', 'A clot-dissolving biologic for stroke and heart attack; Emcure\'s Tenectase has 100% of its category'],
      ['Liposomal amphotericin B', 'An antifungal injection in fat-like spheres; hard to copy; Emcure has the first EU generic'],
      ['Semaglutide / GLP-1', 'A diabetes and weight-loss drug class; Poviztra is Novo Nordisk\'s second Indian brand of semaglutide, distributed by Emcure'],
      ['ARV / PrEP', 'Anti-retroviral (anti-HIV) medicines; PrEP = medicine taken to prevent HIV infection (lenacapavir, alimatravir)'],
      ['Voluntary licence', 'Permission from a patent holder (e.g. Gilead, MSD) to make a generic for low- and middle-income countries'],
      ['Tender', 'A bulk purchase by a government or donor, awarded mainly on price'],
      ['Front end', 'A company\'s own sales and distribution operation in a market (Tillomed in the UK, Marcan/Mantra in Canada)'],
      ['Earn-out', 'Part of an acquisition price paid later if the business hits targets (Mantra: CAD 50.2 mn paid in Jul-2026)'],
      ['Minority (non-controlling) interest', 'The part of a subsidiary owned by outsiders; Emcure bought out Zuventus (Oct-2025) and Gennova (Jul-2026)'],
      ['MPS', 'Minimum public shareholding: listed companies must have at least 25% held by the public; Emcure\'s promoters own 77.8%'],
      ['Exceptional items', 'One-off gains or charges outside normal business (FY26: labour-code charge, legal settlement)'],
      ['EPS before exceptional items', `Profit to shareholders before exceptional items and the FY26 earn-out true-up ÷ shares (FY26 ₹${n1(byBase[2026])}); the basis of the multiple's history`],
      ['Forward P/E', 'Share price ÷ next full fiscal year\'s EPS'],
      ['EV / EBITDA', 'Enterprise value (market value plus net debt) ÷ operating profit before depreciation'],
      ['Sector factor', 'How far the nine pharma peers\' P/E at the 30-Sep-2026 close sits above their own medians since 1-Jan-2025 (+16.0%)'],
      ['DCF / WACC', 'Discounted cash flow value; WACC is the cost of capital used to discount (11.9% here, equal to the cost of equity because debt is small)'],
      ['ROCE', 'Return on capital employed: operating profit ÷ capital (equity plus net debt)'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY20': '+7%; includes the US business demerged in 2020-21 (company timeline).',
  'pat@FY20': '−57%: exceptional charges ₹108 cr; margin 14%.',
  'ebitdaMargin@FY21': '+1,000bp to 24%, in the year the US business was demerged.',
  'pat@FY21': '×5 to ₹419 cr on the margin step-up (exceptional charges ₹193 cr pre-tax).',
  'sales@FY22': '+16%.',
  'ebitdaMargin@FY23': '−300bp to 20%.',
  'pat@FY23': '−20%: margin squeeze; higher interest (₹214 cr).',
  'sales@FY24': '+11%: Mantra (Canada) from Nov-2023; Sanofi cardiac brands from Mar-2024.',
  'pat@FY24': '−6%: interest ₹237 cr; D&A +20%.',
  'sales@FY25': '+19%: first full year of the Sanofi brands and Mantra; India +16%.',
  'interest@FY25': '−26%: ₹600 cr of IPO money repaid debt (Jul-2024).',
  'pat@FY25': '+37%: lower interest; ₹38 cr asset-sale gain in other income.',
  'sales@FY26': '+17%: Europe +25.5%, rest of world +21.8%, Canada +18.7%, India +10%.',
  'ebitda@FY26': 'Screener ₹1,746 cr includes the ₹43 cr Mantra earn-out true-up; company ₹1,789 cr (19.4%).',
  'otherIncome@FY26': 'Exchange gains ₹119 cr + other income ₹13 cr − exceptional items ₹31 cr (labour codes ₹26 cr).',
  'pat@FY26': '+36%: profit to owners after ₹17 cr minorities; adjusted PAT (company) ₹1,008 cr.',
  'eps@FY26': `₹48.76 reported; ₹${n1(byBase[2026])} before exceptional items and the earn-out true-up.`,
  'cfo@FY26': '53% of company EBITDA: working capital absorbed ₹530 cr.',
  'sales@Q4FY26': '+17%: India only +5% (Zuventus restructuring); international +26%.',
  'otherIncome@Q3FY26': 'Includes −₹38 cr exceptional (labour codes).',
  'sales@Q1FY27': '+23%: international +34% (~12pp currency), India +10%.',
  'ebitda@Q1FY27': 'Screener ₹532 cr includes ~₹23 cr exchange gain; company EBITDA ₹508 cr (19.7%).',
  'pat@Q1FY27': '+42% (owners): margin, no minorities, ~₹23 cr exchange gain.',
  'sales@FY27E': 'GAM build: India +10.5%, Europe +18%, Canada +15%, rest of world +20%.',
  'ebitdaMargin@FY27E': '+80bp on the company basis (guidance 70-100bp).',
  'eps@FY27E': `₹${n1(epsU[0])}: no minorities, no exchange gains; interest up after the July payouts.`,
  'eps@FY29E': `₹${n1(epsU[2])}; close to net cash.`,
};

module.exports = { glossary, statementNotes };
