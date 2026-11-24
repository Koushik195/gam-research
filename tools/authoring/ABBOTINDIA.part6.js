// Abbott India report, part 6: glossary and statement notes.
const X = require('./ABBOTINDIA.ctx');
const { n0, n1, F, SET_FACTOR, BL } = X;

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['IPM', 'Indian pharmaceutical market: sales of medicines through chemists, measured at retail prices'],
      ['IQVIA / Pharmarack', 'Data firms that track chemist ("secondary") sales by brand; company revenue ("primary" sales to distributors at trade prices) runs below these retail values'],
      ['MAT', 'Moving annual total: sales over the latest twelve months (e.g. MAT Jul-26 = Aug-2025 to Jul-2026)'],
      ['Own brands / core portfolio', 'Brands Abbott India markets as its own (Thyronorm, Udiliv, Duphaston...), including Abbott global brands used under free marketing rights'],
      ['Partner brands', 'Novo Nordisk products (insulins, Rybelsus, Extensior) that Abbott India buys and distributes for a margin'],
      ['MNC', 'Multinational company; here, an Indian listed subsidiary of a foreign drug maker'],
      ['Promoter / free float', 'The controlling shareholder (Abbott Laboratories, 74.99%) / shares held by everyone else (25.01%)'],
      ['Related-party transaction', 'A deal with a company in the same group (purchases from Abbott Products Operations AG, services with Abbott Healthcare)'],
      ['Royalty / marketing rights', 'A fee for using a brand or know-how; Abbott India pays none for the Abbott brands it sells'],
      ['NLEM / DPCO / NPPA', 'National List of Essential Medicines; Drug Price Control Order; National Pharmaceutical Pricing Authority, which caps prices of listed medicines and allows increases in line with wholesale inflation (WPI) each April'],
      ['Dydrogesterone / levothyroxine / ursodeoxycholic acid', 'The molecules in Duphaston (pregnancy support), Thyronorm (thyroid) and Udiliv (liver)'],
      ['GLP-1 / semaglutide', 'A class of diabetes and obesity drugs; semaglutide (Ozempic, Rybelsus) lost its Indian patent on 20-Mar-2026'],
      ['Penfill / FlexPen', 'Novo Nordisk\'s insulin cartridge and pre-filled pen formats, being discontinued in India'],
      ['EBITDA', 'Operating profit before depreciation, interest, tax and other income; Abbott\'s own "EBITDA" adds other income'],
      ['Treasury yield', 'Interest earned on cash and bank deposits ÷ average balance (6.27% in FY26)'],
      ['Forward P/E', 'Share price ÷ next full fiscal year\'s EPS; Sep-28E EPS = half FY28E + half FY29E, the forward EPS one year from now'],
      ['Sector factor', `How far the other eight pharma-set companies' P/E at the 30-Sep-2026 close sits above their five-year medians (+${SET_FACTOR}%)`],
      ['EV / EBITDA', 'Enterprise value (market value less net cash) ÷ EBITDA'],
      ['DCF / cost of equity', 'Discounted cash flow value; the cost of equity (11.3%) is the return shareholders require, used as the discount rate (Abbott has no debt)'],
      ['ROE / ROCE', 'Return on equity (profit ÷ shareholders\' funds) / return on capital employed'],
      ['PEG / Gordon P/E', 'P/E divided by EPS growth / the P/E implied by return on equity, growth and the cost of equity: (1 − g/ROE) ÷ (Ke − g)'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY20': '+11%; Ind AS 116 from FY20 moved office rent into depreciation and interest.',
  'dep@FY20': '₹60 cr vs ₹17 cr: leased offices now depreciated (Ind AS 116).',
  'sales@FY21': '+5%: Covid year (acute therapies weak).',
  'pat@FY21': '+16% despite slow sales: margin +290bp.',
  'sales@FY22': '+14%: post-Covid recovery; own brands +16% (company split).',
  'otherIncome@FY23': '₹154 cr vs ₹77 cr: higher deposit rates and balances.',
  'otherIncome@FY24': '₹248 cr: higher deposit rates (repo 6.5% from Feb-2023) on larger balances.',
  'ebitdaMargin@FY24': '+230bp: own-brand mix and cost control.',
  'pat@FY24': '+26%: margin and other income.',
  'sales@FY26': '+8.1%: Novo brands weaker from Q1FY26 (insulin formats discontinued).',
  'ebitdaMargin@FY26': '27.3%: includes ₹18 cr labour-code charge (Q3).',
  'interest@FY26': '₹25 cr: lease interest on the new office (₹18 cr).',
  'eps@FY26': '₹730.4; dividend ₹656 (₹525 + ₹131 special), ~90% payout.',
  'sales@Q1FY26': '+12%: last quarter before the Novo decline showed.',
  'opm@Q3FY26': 'Labour-code charge and salary cycle.',
  'sales@Q1FY27': '+4.3%: Novo brands fell; own portfolio ~+11% (Pharmarack).',
  'opm@Q1FY27': '28.8%: gross margin +283bp on mix.',
  'pat@Q1FY27': '+17%.',
  'sales@FY27E': `GAM build: own brands +${BL.growth.own[0]}%, Novo partner brands ${BL.growth.partner[0]}%.`,
  'ebitdaMargin@FY27E': 'Q1FY27 28.8%; mix shift continues.',
  'otherIncome@FY27E': 'Treasury yield 6.0% on opening net cash; no one-offs.',
  'eps@FY29E': `EPS ₹${n1(F.eps[2])}; ~9% a year FY26-29E.`,
};

module.exports = { glossary, statementNotes };
