// Ajanta Pharma report, part 6: glossary and forecast statement notes.
const X = require('./AJANTPHARM.ctx');
const { n1, epsU, BL, AS, SECTOR } = X;

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Branded generic', 'An off-patent medicine sold under the company\'s own brand name and promoted to doctors (most medicines in India, Asia and Africa are sold this way)'],
      ['US generic', 'An unbranded copy of an off-patent US medicine, sold on price to wholesalers and pharmacy chains'],
      ['First to market', 'The first company to launch a molecule or combination in a country'],
      ['IPM / IQVIA / MAT', 'Indian pharmaceutical market; the data firm that tracks chemist sales; moving annual total (the last twelve months)'],
      ['Acute / chronic', 'Short courses (antibiotics, pain) vs long-term treatment (heart, diabetes, eye pressure), which repeats and is stickier'],
      ['NLEM', 'National List of Essential Medicines: listed drugs have capped prices in India'],
      ['MR / PCPM', 'Medical representative; productivity per MR per month (sales ÷ reps ÷ months)'],
      ['Institutional (tender) business', 'Anti-malarials sold to aid agencies through tenders, not promoted to doctors'],
      ['ANDA / US FDA', 'Abbreviated New Drug Application, the filing to sell a generic in the US / the US Food and Drug Administration'],
      ['Form 483 / VAI / EIR', 'A list of problems an FDA inspector found / "Voluntary Action Indicated": issues to fix, no regulatory action / Establishment Inspection Report that closes the inspection'],
      ['Price erosion', 'The yearly fall in US generic prices as more makers enter'],
      ['Section 232', 'A US trade law under which tariffs on pharmaceutical imports were studied; generics were exempt until Apr-2027'],
      ['Semaglutide / GLP-1', 'A diabetes and weight-loss medicine (Ozempic/Wegovy); generics are launching as patents expire in many countries'],
      ['Factoring', 'Selling receivables to a bank for cash before customers pay; stopping it raises receivables and lowers operating cash flow'],
      ['Mark-to-market hedge loss', 'The loss on forward currency contracts when the rupee falls; Ajanta books it in other expenses while FX gains on exports go to other income'],
      ['Adjusted EBITDA', 'Operating profit before depreciation, interest, tax and the hedge loss (the company\'s and our basis)'],
      ['Forward P/E', 'Share price ÷ next full fiscal year\'s EPS'],
      ['Sep-28E EPS', 'Half FY28E plus half FY29E EPS: the earnings a buyer will look at one year from the target date'],
      ['Sector factor', `How far the nine pharma peers' P/E at the 30-Sep-2026 close sits above their own five-year medians (+${SECTOR}% for names outside the set)`],
      ['EV / EBITDA', 'Enterprise value (market value less net cash) ÷ EBITDA'],
      ['DCF / WACC', 'Discounted cash flow value; the cost of capital used to discount (11.3% here, the cost of equity, as Ajanta has net cash)'],
      ['ROE / ROCE', 'Return on equity: profit ÷ shareholders\' funds. Return on capital employed: operating profit ÷ capital'],
      ['Pledge', 'Shares given as security for a loan; if the loan is not repaid the lender can sell them'],
      ['Block-period return (section 158BC)', 'A return the tax department asks for after a search, covering past years (here Apr-2019 to Nov-2025)'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY27E': `GAM build: India +${BL.growth.india[0]}%, Asia +${BL.growth.asia[0]}%, Africa +${BL.growth.africa[0]}%, US +${BL.growth.us[0]}%, institutional +${BL.growth.inst[0]}%.`,
  'ebitdaMargin@FY27E': 'Inside the 27% ±1pp guidance (before FX); Q1FY27 27.9%.',
  'otherIncome@FY27E': 'Excludes FX gains (net FX assumed nil).',
  'capex@FY27E': '~₹400 cr guided: ~₹300 cr Pithampur expansion, ~₹100 cr maintenance.',
  'eps@FY27E': `₹${n1(epsU[0])}: tax ${AS.taxRate[0]}% (23.3% in FY26).`,
  'sales@FY28E': `US slows to +${BL.growth.us[1]}% (price erosion); branded generics +13-15%.`,
  'eps@FY29E': `₹${n1(epsU[2])}.`,
};

module.exports = { glossary, statementNotes };
