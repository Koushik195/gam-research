// Poly Medicure report, part 6: glossary and statement notes.
const X = require('./POLYMED.ctx');
const { n1, epsU, epsBase, MIN, SECTOR, HB } = X;

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Medical disposables / consumables', 'Single-use devices such as IV cannulae, infusion sets, catheters and blood bags (most of Polymed\'s revenue)'],
      ['IV cannula', 'A thin tube inserted into a vein to give fluids or drugs; Polymed makes ~600 mn a year (~11% of the world)'],
      ['Infusion therapy / vascular access', 'Devices that deliver fluids into veins / long-term lines into large veins (PICC, central venous catheters, ports)'],
      ['Renal care / dialyser', 'Kidney-failure treatment; a dialyser is the filter used in each haemodialysis session'],
      ['DES / DEB / PTCA', 'Drug-eluting stent / drug-eluting balloon / balloon angioplasty, used to open heart arteries'],
      ['Guiding catheter', 'A tube that guides stents and balloons to the heart; PendraCare\'s main product'],
      ['Trauma implants / fixators', 'Nails, plates and frames that hold broken bones; Citieffe\'s products'],
      ['OEM', 'Original equipment maker: a company that sells another maker\'s product under its own brand'],
      ['CE / EU MDR', 'European conformity mark / the EU Medical Device Regulation 2017/745 that every device sold in the EU must meet'],
      ['FDA 510(k)', 'US clearance for a device shown to be equivalent to one already on the market'],
      ['CDSCO / NPPA / ANVISA', 'India\'s device regulator / India\'s drug and device price regulator (it caps stent prices) / Brazil\'s regulator'],
      ['Anti-dumping duty', 'A tariff on imports sold below fair value (sought by Polymed on Chinese and Malaysian dialysers)'],
      ['QIP', 'Qualified institutions placement: a share sale to institutional investors (₹400 cr in 2020, ₹1,000 cr in Aug-2024)'],
      ['Organic growth', 'Growth excluding businesses acquired in the last year (PendraCare, Citieffe)'],
      ['Operating EBITDA (company)', 'Polymed\'s EBITDA before other income, including its Egyptian associate\'s profit and before one-offs; Screener\'s EBITDA excludes the associate'],
      ['Treasury income', 'Interest and mutual-fund gains on cash (₹64 cr in FY26); Screener labels the fund gains "exceptional"'],
      ['Labour Codes', 'India\'s new labour laws (Nov-2025), which forced a one-time ₹6.8 cr gratuity and leave provision'],
      ['Cash conversion cycle', 'Receivable days + inventory days − payable days: how long cash is tied up in working capital'],
      ['Forward P/E', 'Market value ÷ next full fiscal year\'s profit (here computed on the share count at each date)'],
      ['EV / EBITDA', 'Enterprise value (market value plus net debt, here less net cash) ÷ EBITDA'],
      ['Sector factor', `How far the nine pharma peers' P/E at the 30-Sep-2026 close sits against their five-year medians (+${SECTOR}%); used because listed med-tech peers are too few`],
      ['Trough rule', 'Years whose forward EPS is a loss or below half the best of the previous three years are left out of the multiple history (none here)'],
      ['EPS before one-offs', `Profit to shareholders excluding the FY26 labour-code and acquisition costs, per share (FY26 ₹${n1(epsBase[2026])})`],
      ['DCF / WACC', 'Discounted cash flow value; WACC is the cost of capital (12.2%, equal to the cost of equity because Polymed has net cash)'],
      ['ROCE / ROE / ROIC', 'Return on capital employed / on equity / on invested capital (the company\'s ROIC leaves out cash, unused assets and subsidiaries)'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '+14%: COVID-era demand for infusion and critical-care consumables.',
  'sales@FY22': '+17%: exports recovered; first QIP (Sep-2020) funding capacity.',
  'sales@FY23': '+21%: India +16%, Europe +14%, RoW +32%.',
  'sales@FY24': '+23%: Europe +36%; infusion +20%, renal +24%.',
  'sales@FY25': '+21%: Europe +23%, RoW +24%; renal +60%.',
  'sales@FY26': '+12%: organic +5% (exports −1%); PendraCare and Citieffe ₹117 cr.',
  'ebitdaMargin@FY21': '27.5%: COVID mix and operating leverage.',
  'ebitdaMargin@FY26': '−3.5pp: acquisitions (low margin), wages, R&D, ₹6.8 cr labour-code charge.',
  'dep@FY26': '+40%: Haridwar and Faridabad plants, acquired plants and intangibles.',
  'otherIncome@FY25': '+57%: treasury income on the Aug-2024 QIP cash (mutual-fund gains ₹44 cr).',
  'otherIncome@FY26': 'Treasury ₹64 cr, forex ₹39 cr, grants/misc ₹15 cr, associate ₹6 cr; net of the labour-code charge.',
  'pat@FY24': '+44%: margin +2.4pp; treasury and forex income.',
  'pat@FY25': '+31%: QIP treasury income; tax 25%.',
  'pat@FY26': '−5%: acquisitions lost ₹14 cr before tax; ₹16.5 cr one-offs; D&A +40%.',
  'sales@Q3FY26': '+16%: Citieffe consolidated from 7-Nov-2025.',
  'pat@Q3FY26': '−17%: labour-code charge ₹6.8 cr and deal costs ₹6.5 cr.',
  'pat@Q4FY26': '−28%: acquisitions\' Q4 losses and ~₹9 cr of one-time regulatory/staff provisions in a subsidiary.',
  'sales@Q1FY27': '+30%: organic +12.4%; acquisitions ₹72 cr.',
  'pat@Q1FY27': '−8%: D&A +55%, interest +120%, other income −20%.',
  'sales@FY27E': 'GAM build: India +18%, international organic +11.5%, acquisitions ₹292 cr.',
  'ebitdaMargin@FY27E': 'Guidance 23-25% consolidated; Q1 23.8% (Screener basis).',
  'eps@FY27E': `₹${n1(epsU[0])} to shareholders (minority share of losses ₹${-MIN[0]} cr added back via the tax line).`,
  'eps@FY29E': `₹${n1(epsU[2])}; ${n1(HB.med)}x median forward P/E since 2021.`,
};

module.exports = { glossary, statementNotes };
