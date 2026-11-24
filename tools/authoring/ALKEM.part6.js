// Alkem Laboratories report, part 6: glossary and statement notes.
const X = require('./ALKEM.ctx');
const { n1, ownersEps, byBase, SECTOR } = X;

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['IPM', 'Indian pharmaceutical market: sales of medicines through chemists, measured by IQVIA at retail prices'],
      ['IQVIA / secondary sales', 'The data firm that tracks chemist sales; "secondary" sales are from distributors to chemists, "primary" from the company to distributors'],
      ['Acute / chronic', 'Acute: short courses (antibiotics, antacids, pain killers). Chronic: long-term treatment (diabetes, blood pressure, nerves), which repeats and is stickier'],
      ['Branded generic / trade generic', 'An off-patent medicine sold under a company brand and promoted to doctors / sold unbranded and cheaply to distributors and chemists, without doctor promotion'],
      ['Field force / MR', 'Medical representatives who visit doctors to promote brands'],
      ['NLEM / DPCO', 'National List of Essential Medicines and the Drug Price Control Order: listed medicines have capped prices that rise only with wholesale inflation'],
      ['UCPMP', 'Uniform Code for Pharmaceutical Marketing Practices (2024): bans gifts, cash, travel and hospitality for doctors by drug companies'],
      ['ANDA / USFDA', 'Abbreviated New Drug Application, the filing to sell a generic in the US / the US Food and Drug Administration'],
      ['Form 483 / OAI / warning letter', 'A list of problems an FDA inspector found / "Official Action Indicated": the FDA may act (often no new approvals from the site) / a formal letter that usually blocks approvals until fixed'],
      ['EIR', 'Establishment Inspection Report: the FDA closes an inspection as acceptable'],
      ['Price erosion', 'The yearly fall in US generic prices as more makers enter'],
      ['Biosimilar', 'A near-copy of a biological (protein) medicine such as denosumab, made from living cells'],
      ['CDMO', 'Contract development and manufacturing organisation: makes medicines for other companies'],
      ['Occluder / ASD / PFO', 'A small implant that closes a hole in the heart wall (atrial septal defect, patent foramen ovale)'],
      ['Sikkim / 80-IE tax holiday', 'Income-tax exemption for plants in the North-East (incl. Sikkim) for ten years; Alkem\'s ended, so its tax rate rises from FY27'],
      ['MAT credit', 'Minimum Alternate Tax paid while profits were exempt; it can be set off against future tax, so it is worth cash later'],
      ['New tax regime (115BAA)', 'A 25.17% corporate tax rate without most exemptions; Alkem opted for it from FY27'],
      ['Exceptional items', 'One-off gains or charges outside normal business (FY26: labour-code gratuity charge, real-estate impairment, plant-sale gain)'],
      ['Minorities (non-controlling interests)', 'The share of subsidiaries\' profit that belongs to outside owners (49% of Indchemie, 39% of Cachet, 45% of Occlutech)'],
      ['EPS to shareholders', 'Profit after minorities ÷ 11.96 cr shares: the basis of our target'],
      ['Forward P/E', 'Share price ÷ next full fiscal year\'s EPS'],
      ['Sector factor', `How far the eight pharma peers\' P/E at the 30-Sep-2026 close sits above their own five-year medians (+${SECTOR}%)`],
      ['EV / EBITDA', 'Enterprise value (market value less net cash) ÷ operating profit before depreciation'],
      ['DCF / WACC', 'Discounted cash flow value; WACC is the cost of capital used to discount (11.3% here, the cost of equity, as Alkem has net cash)'],
      ['ROE / ROCE', 'Return on equity: profit ÷ shareholders\' funds. Return on capital employed: operating profit ÷ capital'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '+6%: COVID year; India +5%, US +11%.',
  'ebitdaMargin@FY21': '21.9%: peak margin on COVID-led acute demand and lower promotion spend.',
  'sales@FY22': '+20%: India +30% as acute demand rebounded.',
  'ebitdaMargin@FY23': '−530bp to 14.0%: US price erosion, raw-material inflation.',
  'pat@FY23': '−40%: margin collapse and ₹173 cr of exceptional charges (pre-tax).',
  'pat@FY24': '+83%: margin back to 17.8%; tax rate 10.5%.',
  'sales@FY25': '+2%: US −10% (price erosion); India +7%.',
  'otherIncome@FY25': '₹494 cr: treasury income on ₹5,800 cr of gross cash and deposits.',
  'sales@FY26': '+13.5%: US +20% (sacubitril-valsartan), other international +27%, India +9.7%.',
  'otherIncome@FY26': 'Net of ₹175 cr exceptional items (labour codes ₹113 cr, real estate ₹75 cr, Indore gain ₹14 cr); before them ₹583 cr.',
  'pat@FY26': `+6%: tax rate up to 18.0% (12.3%); before exceptional items EPS ₹${n1(byBase[2026])}.`,
  'eps@FY26': `₹192.51 reported; ₹${n1(byBase[2026])} before exceptional items.`,
  'opm@Q4FY25': '12.4%: Q4 carries the year\'s peak R&D; low gross margin (59%).',
  'opm@Q4FY26': '14.4%: R&D 6.4% of sales; ₹135 cr exceptional charges sit in other income.',
  'otherIncome@Q4FY26': 'Net of ₹135 cr exceptional items (labour codes ₹60 cr, real estate ₹75 cr).',
  'pat@Q4FY26': 'Tax rate 40.5% on PBT cut by ₹135 cr of exceptional charges.',
  'pat@Q1FY27': '−22%: tax rate 32.4% (13.3% a year earlier); EBITDA +4%.',
  'sales@FY27E': 'GAM build: India +11%, US +6%, other international +18%, Occlutech ₹400 cr.',
  'ebitdaMargin@FY27E': 'Bottom of the 20-21% guidance; Occlutech at breakeven dilutes ~50bp.',
  'capex@FY27E': 'Includes up to ₹1,100 cr for 55% of Occlutech.',
  'eps@FY27E': `To shareholders ₹${n1(ownersEps[0])}: tax 31% (18% in FY26) takes EPS below FY26.`,
  'eps@FY29E': `To shareholders ₹${n1(ownersEps[2])}; tax 29%.`,
};

module.exports = { glossary, statementNotes };
