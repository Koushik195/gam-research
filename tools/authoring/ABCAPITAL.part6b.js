// Aditya Birla Capital report, part 6b: risks and honest summary, glossary, statement notes.
const X = require('./ABCAPITAL.ctx3');
const { F, V, S, SB, CONS, n0, n1, n2, price, rating, buyBelow, sellAbove, ruleText, discNow, discMedRecent, discMedAll, cFwdPbNow, CPB, sharesNow } = X;
const nbfc01 = SB.parts[0].metric * 0.1 * (1 - SB.disc / 100) / sharesNow;
const cc10 = F.avgAum[1] * 0.001 * (1 - 0.252) / F.patAttrib[1] * 100;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a good business at a fair price, so a ${rating}`,
  blocks: [
    { callout: `**What you are buying:** a ₹1.67 lakh crore NBFC that has fixed its asset quality (Stage 3 1.3%, credit cost ~1%) and now earns a 2.4% ROA, an 86% stake in a housing-finance company growing 50% a year with 0.4% Stage 3, half of a life insurer whose margins have doubled, 45% of a listed AMC and 46% of the fastest-growing health insurer. Capital for three years is in the bank, and the Birla group stands behind it.` },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(cFwdPbNow)}x our FY28E consolidated book (median since 2021: ${n1(CPB.med)}x) and only ~${n0(discNow.disc)}% below the look-through value of the parts at our multiples, against a ${n0(discMedRecent)}% two-year median discount and ${n0(discMedAll)}% since 2022. Consolidated ROE of ~13% barely clears a ${n1(V.ke)}% cost of equity. Our sum of the parts gives {{dcf.tp|inr}} ({{dcf.upside|chg}}).` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['NBFC margins finally widen (NIM incl. fees back above 6.3%) as personal loans and gold rise', 'Medium', 'Q2FY27 results (due by mid-November 2026) and Q3'],
      ['Health insurer reaches a 100% combined ratio; life margins above 20% for a full year', 'Medium', 'Quarterly IFRS results; FY27 EV walk'],
      ['A listing or sale that crystallises value (e.g. an HFC IPO) and narrows the discount for good', 'Low-Medium', 'Board announcements (none by 30-Sep-2026)'],
      ['A share-price fall that widens the discount back towards 17-20% at unchanged fundamentals', 'Medium', `Below ~₹${n0(buyBelow)} we would be buyers`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Credit cycle turns in MSME or unsecured loans (rate hikes, slower growth)', 'Medium', `Each 10bp of credit cost is ~${n1(cc10)}% of FY28E standalone profit; bear case 1.5-1.6%`],
      ['IRDAI caps loan-linked insurance commissions', 'Medium', 'Base cuts NBFC fees ~6bp of AUM from FY28E; bear doubles it; ABSLI\'s group credit-life sales could slow'],
      ['The holding discount widens back to its long-run median', 'Medium', `At ${n0(discMedAll)}% (bear) the parts are worth ~₹${n0(SB.grossPs * (1 - discMedAll / 100))} at base multiples`],
      ['Insurers or the digital platform need more capital than planned', 'Low-Medium', 'More investments at cost; dilution if ABCL has to raise again'],
      ['Funding costs rise faster than yields (30% floating borrowings, 56% floating loans)', 'Low', 'Cost of funds +25bp in the bear case'],
      ['AMC keeps losing equity share; markets fall', 'Medium', 'AMC value moves with its share price (₹47 a share at 30-Sep)'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**On today's numbers we would turn buyers below ~₹${n0(buyBelow)} and sellers above ~₹${n0(sellAbove)}.** The 30-Sep price of ₹${n0(price)} sits inside the band.`,
      `**Biggest swing factors:** the holding discount (5 points ≈ ₹${n0(SB.grossPs * 0.05)} a share), the NBFC multiple (0.1x ≈ ₹${n0(nbfc01)} a share) and credit cost (10bp ≈ ${n1(cc10)}% of FY28E standalone profit).`,
      '**Portfolio fit:** for investors who want diversified exposure to Indian financial services with a strong parent; not a high-return compounder at group level and not cheap after doubling since March 2025. Size positions for a bear case near {{scen.bear.tp|inr}}.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'NBFC AUM, Jun-2026', v: '₹1.67 lakh cr', d: '+28% YoY; ROA 2.39%' },
      { k: 'Group PAT, Q1FY27', v: '₹1,175 cr', d: '+40% YoY' },
      { k: 'Consolidated ROE, FY27E', v: `${n1(CONS[0].roe)}%`, d: `cost of equity ${n1(V.ke)}%` },
      { k: 'Discount to look-through', v: `${n0(discNow.disc)}%`, d: `two-year median ${n0(discMedRecent)}%` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['NBFC, NBFC-ICC, upper layer', 'Non-banking financial company; ICC = investment and credit company; the RBI\'s "upper layer" carries bank-like rules (CRAR ≥15%, Tier 1 ≥10%).'],
      ['Standalone vs consolidated', 'Standalone = ABCL alone (the NBFC, with subsidiaries at cost). Consolidated = the group, adding ABCL\'s share of each subsidiary\'s profit and book.'],
      ['SOTP, look-through value', 'Sum of the parts: each business valued separately and added up for ABCL\'s stake. Look-through value = that sum before any holding discount.'],
      ['Holding (holdco) discount', 'How far the listed parent trades below the value of its parts, because investors cannot control or cash in the stakes.'],
      ['AUM, disbursements', 'Assets under management (the loan book); new loans paid out in a period.'],
      ['NII, NIM, yield, cost of funds', 'Net interest income = interest earned − interest paid; NIM = NII ÷ average AUM (company basis: on the lending book, incl. fees).'],
      ['Credit cost, Stage 1/2/3, PCR', 'Loan-loss provisions ÷ average loans; Ind AS buckets for performing, 30-90 days overdue and 90+ days overdue loans; provision cover on Stage 3.'],
      ['ROA, ROE, Tier 1, CRAR', 'Profit ÷ average assets; profit ÷ average equity; core capital and total capital ÷ risk-weighted assets.'],
      ['HFC', 'Housing finance company (NHB/RBI regulated).'],
      ['EV, VNB, VNB margin, RoEV', 'Embedded value = a life insurer\'s net worth + present value of future profits on policies in force; value of new business written in a year; VNB ÷ new-business premium; operating return on opening EV.'],
      ['GWP, SAHI, combined ratio, 1/n', 'Gross written premium; standalone health insurer; claims + expenses ÷ premium (above 100% = underwriting loss); 1/n = the rule spreading multi-year premiums over the policy term.'],
      ['QAAUM, SIP', 'Quarterly average assets under management of a mutual fund; systematic investment plan.'],
      ['P/B, P/EV, P/GWP, P/E', 'Price ÷ book value, embedded value, premium, earnings.'],
      ['Justified P/B, residual income', 'P/B = (ROE − g) ÷ (cost of equity − g); value = book + present value of profits above the cost of equity.'],
      ['Preferential allotment, QIP, rights issue', 'New shares sold to chosen investors (here promoters and IFC); qualified institutions placement; new shares offered to existing shareholders pro rata.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'aum@FY26': 'NBFC AUM +27% to ₹1,59,916 cr: personal & consumer +38%, secured business +27%, unsecured business +47%, corporate +15% (Q4FY26 presentation).',
  'sales@FY24': 'FY24 is the FY25 annual report\'s restatement for the merger of Aditya Birla Finance (appointed date 1-Apr-2024, effective 1-Apr-2025); revenue includes ₹636 cr of gains on selling AMC shares.',
  'pat@FY25': 'Includes ₹283 cr (pre-tax) of gains on selling AMC shares (₹243 cr after tax); profit before one-offs ₹2,714 cr.',
  'pat@FY26': 'Profit ₹3,109 cr after a ₹12 cr labour-code charge; the AMC dividend contributed ₹311 cr of revenue.',
  'netWorth@FY27E': 'Includes the ₹4,000 cr preferential allotment at ₹356.02 (June 2026).',
  'eps@FY27E': 'On 273.2 cr shares after the June allotment (261.96 cr at Mar-26).',
};

module.exports = { risks, glossary, statementNotes };
