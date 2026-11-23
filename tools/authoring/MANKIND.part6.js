// Mankind Pharma report, part 6: glossary and statement notes.
const X = require('./MANKIND.ctx');
const { n1, adjEps, ownersEps, ppaPs } = X;

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['IPM', 'Indian pharmaceutical market: sales of medicines through chemists, measured by IQVIA at retail prices'],
      ['IQVIA / secondary sales', 'The data firm that tracks chemist sales; "secondary" sales are from distributors to chemists, "primary" from the company to distributors'],
      ['Covered market', 'The part of the IPM made up of molecules a company actually sells'],
      ['Acute / chronic', 'Acute: short courses (antibiotics, antacids, pain). Chronic: long-term treatment (blood pressure, diabetes, asthma), which repeats and is stickier'],
      ['Branded generic', 'An off-patent medicine sold under a company brand and promoted to doctors'],
      ['Field force / MR / PCPM', 'Medical representatives who visit doctors; PCPM = sales per representative per month'],
      ['NLEM / DPCO', 'National List of Essential Medicines and the Drug Price Control Order: medicines on the list have capped prices that rise with wholesale inflation'],
      ['GLP-1', 'A class of diabetes and obesity drugs (semaglutide, tirzepatide); semaglutide\'s Indian patent expired in Mar-2026'],
      ['BSV', 'Bharat Serums and Vaccines, bought by Mankind in Oct-2024: biologics for women\'s health, fertility and critical care'],
      ['Anti-D', 'An antibody injection that protects the next baby of an Rh-negative mother; BSV makes the only recombinant (lab-grown) version'],
      ['rFSH / HMG', 'Hormones used in IVF to stimulate egg production; recombinant FSH (Foligraf) is made with cell lines, HMG (Humog) from urine'],
      ['Purchase-price allocation / amortisation', 'After an acquisition, part of the price is booked as brands and other intangibles and written off over their life; for BSV ~₹450 cr a year, which costs profit but not cash'],
      ['Deferred tax liability (DTL)', 'Tax that will be payable later; BSV\'s DTL unwinds as the amortisation is booked, lowering book tax but not cash tax'],
      ['Exceptional items', 'One-off gains or charges outside normal business (FY25 Mahananda sale gain; FY26 labour-code charge)'],
      ['NCD / commercial paper / QIP', 'Non-convertible debentures (bonds) and short-term notes used to fund the deal; QIP = qualified institutional placement of new shares'],
      ['EPS before BSV amortisation', `Profit to shareholders plus the BSV amortisation net of its tax credit (₹${n1(ppaPs)} a share a year), divided by shares: the basis of our target`],
      ['Forward P/E', 'Share price ÷ next full fiscal year\'s EPS'],
      ['EV / EBITDA', 'Enterprise value (market value plus net debt) ÷ operating profit before depreciation'],
      ['Sector factor', 'How far the nine pharma peers\' P/E at the 30-Sep-2026 close sits above their own medians over the same window (+11.0%)'],
      ['DCF / WACC', 'Discounted cash flow value; WACC is the cost of capital used to discount (11.3% here, equal to the cost of equity because debt is small)'],
      ['ROCE', 'Return on capital employed: operating profit ÷ capital (equity plus debt)'],
      ['MPS', 'Minimum public shareholding: listed companies must have at least 25% held by the public'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY22': '+25%: domestic +26%; Panacea Biotec brands acquired.',
  'ebitdaMargin@FY23': '−390bp: material costs up from 31.1% to 33.3% of sales (Screener).',
  'pat@FY23': '−11%: margin squeeze; D&A ₹326 cr vs ₹167 cr (Panacea brands).',
  'pat@FY24': '+49%: margin recovery (+280bp) and higher other income (fund gains).',
  'sales@FY25': '+19%: BSV consolidated from 23-Oct-2024 (160 days); exports ×1.9.',
  'dep@FY25': '+64%: BSV assets and acquired intangibles (amortisation +₹200 cr).',
  'otherIncome@FY25': 'Includes ₹164 cr gain on selling Mahananda Spa & Resorts (exceptional per Screener).',
  'pat@FY25': '+4%: deal interest (₹432 cr finance cost) and amortisation offset BSV EBITDA and the Mahananda gain.',
  'sales@FY26': '+17%: first full year of BSV; organic domestic ex-consumer +8.6%.',
  'dep@FY26': '₹886 cr: full year of BSV amortisation (~₹450 cr).',
  'otherIncome@FY26': 'Net of ₹130 cr exceptional charges (labour codes, trademark assignment, BSV project write-down); fund gains ₹127 cr, FX ₹70 cr.',
  'pat@FY26': '−4%: finance cost ₹644 cr and amortisation; tax rate 16.9%; before exceptional items ~₹2,015 cr.',
  'eps@FY26': '₹46.34 reported; ₹48.8 before exceptional items; ₹57.0 also before BSV amortisation.',
  'sales@Q3FY25': '+23%: BSV from 23-Oct-2024.',
  'interest@Q3FY25': 'Acquisition NCDs and commercial paper.',
  'otherIncome@Q4FY25': 'Includes the ₹164 cr Mahananda gain.',
  'otherIncome@Q3FY26': '−₹31 cr: ₹107 cr exceptional charge (labour codes etc.).',
  'pat@Q1FY27': '+30%: margin +250bp, finance cost −36%; tax rate 25.4% (17.7% a year earlier).',
  'sales@FY27E': 'GAM build: domestic Rx +11%, consumer +7%, exports +20%.',
  'ebitdaMargin@FY27E': 'Middle of the 25.5-26.5% guidance.',
  'eps@FY27E': `To shareholders ₹${n1(ownersEps[0])}; before BSV amortisation ₹${n1(adjEps[0])}. Tax rate 25% (17% in FY26).`,
  'eps@FY29E': `To shareholders ₹${n1(ownersEps[2])}; before BSV amortisation ₹${n1(adjEps[2])}; net cash.`,
};

module.exports = { glossary, statementNotes };
