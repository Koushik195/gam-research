// Bajaj Finance report, part 6b: risks and honest summary, glossary, statement notes.
const X = require('./BAJFINANCE.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, AS, fin, n0, n1, n2, pc, price, pbMult, bvSep28, fwdPbNow, PB21, rating, buyBelow, sellAbove, mv, Q1, epsAdj26 } = X;
const cc10 = F.avgAum[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a BUY on the street\'s yardstick, with no margin for a second disappointment',
  blocks: [
    { callout: `**What you are buying:** India's largest and most profitable diversified consumer lender: 124 million customers, ten lending businesses, AAA funding with a deposit franchise, ~33% cost-to-income, a ~20% ROE through most of a decade, excellent disclosure, and a credit cycle that has just turned in its favour (Q1FY27 loan losses 1.31% before overlays, ₹2,200 cr of extra provisions already taken).` },
    { callout: `**What you are paying:** ${n1(fwdPbNow)}x our FY28E book and ${n1(price / F.eps[1])}x FY28E EPS. That is below the stock's ${PB21.med}x median since 2021, which is why the street's method gives {{dcf.tp|inr}} ({{dcf.upside|chg}}) and a ${rating}. It is not cheap on fundamentals: at a ${n1(V.ke)}% cost of equity the price already implies a ~{{dcf.impliedRoe|pct0}} ROE for ever, and our justified P/B (₹${n0(mv('jpb').value)}) and residual income (₹${n0(mv('ri').value)}) are both below the price. The upside depends on the market continuing to pay for the franchise.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Q2FY27 guidance upgrade (AUM toward 25%, credit cost toward the low end of 1.45-1.60%)', 'Medium', 'Q2FY27 results (due by mid-November 2026)'],
      ['RBI softens or narrows the revolving-credit draft', 'Low-Medium', 'Final directions; company commentary on the flexi book'],
      ['A clear successor to Rajeev Jain named well before Mar-2028', 'Medium', 'Board announcements'],
      ['Equity raise priced well above book, mostly taken by Bajaj Finserv', 'Medium', 'Board outcome in early October'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Revolving credit banned as drafted; flexi customers leave on conversion', 'Medium', 'Yield −30bp and growth −5pp in our bear case: target {{scen.bear.tp|inr}}'],
      ['Credit costs back above 2% (MSME, personal loans, a weak monsoon or West Asia shock)', 'Low-Medium', `Each 10bp of credit cost is ~${n1(cc10)}% of FY28E profit; 2.1% (bear) cuts FY28E EPS to ₹{{scen.bear.eps.1|n2}}`],
      ['Succession goes badly in 2027-28', 'Medium', 'Multiple compression toward the bear 3.4x'],
      ['Personal-loan competition from banks and fintechs', 'High', 'Yield and growth below our base'],
      ['Further RBI product or capital actions on consumer credit', 'Medium', 'Higher capital need; more frequent equity raises'],
      ['Gold price falls sharply', 'Low-Medium', 'Gold-loan growth (now 4% of AUM) stalls'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**On today's numbers we would stay buyers below ~₹${n0(buyBelow)} and turn sellers above ~₹${n0(sellAbove)}.** The rating is sensitive to the multiple: at 3.8x Sep-28E book the target is ~₹${n0(Math.round(3.8 * bvSep28 / 10) * 10)} (HOLD); at 4.2x (Nomura) ~₹${n0(Math.round(4.2 * bvSep28 / 10) * 10)}.`,
      `**Biggest swing factors:** credit cost (10bp ≈ ${n1(cc10)}% of FY28E EPS) and the multiple (0.5x ≈ ₹${n0(0.5 * bvSep28)} a share). For a long-term holder, the succession decision due by early 2028 matters more than either.`,
      '**Portfolio fit:** a core financials holding for investors who accept regulatory risk and a full price for quality; not a value stock. Position sizing should allow for a bear case near {{scen.bear.tp|inr}}.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Customers, Jun-2026', v: '124 million', d: '+5.1 million in Q1FY27' },
      { k: 'Loan losses, Q1FY27', v: '1.31%', d: 'before the ₹296 cr overlay; 2.09% in FY26' },
      { k: 'ROE, FY27E', v: '{{F.roe.0|pct}}', d: 'guidance 19-20%' },
      { k: 'Price ÷ FY28E book', v: `${n1(fwdPbNow)}x`, d: `median since 2021: ${PB21.med}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['NBFC', 'Non-banking financial company: a lender regulated by the RBI that cannot take current or savings deposits. "Upper layer" NBFCs (the largest) face bank-like rules.'],
      ['AUM / AUF', 'Assets under management: all loans the group manages (incl. any sold or securitised). Assets under finance: loans on the balance sheet. AUF is ~2% below AUM.'],
      ['NII, NIM', 'Net interest income = interest earned − interest paid. Net interest margin = NII ÷ average AUM (our basis).'],
      ['Net total income (NTI)', 'NII plus fees and other operating income: the lender\'s "revenue" after funding costs.'],
      ['Cost-to-income', 'Operating expenses ÷ net total income ("opex to NTI").'],
      ['Credit cost / loan losses', 'Loan losses and provisions ÷ average AUM (our basis) or average AUF (company basis).'],
      ['Stage 1 / 2 / 3, ECL', 'Ind AS 109 buckets: performing, under-performing (30-90 days overdue) and non-performing (90+ days) loans. ECL = expected credit loss provisions held against them.'],
      ['GNPA / NNPA, PCR', 'Gross / net non-performing assets (Stage 3) as % of loans; provision coverage ratio = provisions on Stage 3 ÷ Stage 3 loans.'],
      ['Overlay', 'An extra provision booked on management\'s judgement (e.g. for macro risks), on top of the model-based ECL.'],
      ['CRAR, Tier 1', 'Capital ÷ risk-weighted assets (regulatory minimum 15% for NBFCs); Tier 1 is the core equity part.'],
      ['Risk weight', 'The share of a loan counted as "risky" for capital: 125% for unsecured consumer loans since Nov-2023.'],
      ['Leverage', 'Total assets (or AUM) ÷ net worth.'],
      ['ROA, ROE', 'Profit ÷ average assets; profit ÷ average shareholders\' equity (attributable to Bajaj Finance shareholders).'],
      ['P/B, justified P/B', 'Price ÷ book value per share. Justified P/B = (ROE − g) ÷ (cost of equity − g): the multiple a steady ROE and growth rate support.'],
      ['Residual income', 'Book value plus the present value of future profit above the cost of equity.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the book value (or EPS) the market will look at in September 2027.'],
      ['Flexi loan / revolving credit', 'A credit line the borrower can draw, repay and redraw (like a card limit), as opposed to a term loan with a fixed schedule.'],
      ['LAS / MTF, LRD, LAP', 'Loans against securities / margin trade finance; lease rental discounting (loans against office rents); loan against property.'],
      ['ETB / NTB', 'Existing-to-Bajaj and new-to-Bajaj customers.'],
      ['QIP / preferential issue', 'Qualified institutions placement (new shares sold to institutions) / new shares sold to named buyers such as the promoter.'],
      ['BHFL, MPS', 'Bajaj Housing Finance (listed subsidiary); minimum public shareholding, the rule that pushes BFL\'s stake down to 75%.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'aum@FY19': '+41%: rapid expansion across consumer, SME and new mortgage business (BHFL scaled up).',
  'aum@FY20': '+27%: growth slowed in Q4FY20 as Covid hit.',
  'aum@FY22': '+29%: post-Covid rebound.',
  'aum@FY23': '+25%: broad-based growth; customer franchise +20%.',
  'aum@FY24': '+34%: fastest growth in five years, despite the RBI ban on eCOM/Insta EMI Card lending from Nov-2023.',
  'aum@FY25': '+26%: mortgages and personal loans; captive 2W began to shrink.',
  'nii@FY23': '+31%: AUM growth with a stable 10%+ margin.',
  'nii@FY24': '+29%: AUM +34%, margin slipped as funding costs rose.',
  'provisions@FY19': '+46%: book growth (old basis: recoveries in income).',
  'provisions@FY20': '+162%: Covid provisions in Q4FY20.',
  'provisions@FY21': '+52%: Covid losses; 4.0% of AUF.',
  'provisions@FY22': '−20%: Covid losses fading.',
  'provisions@FY23': '−34%: benign credit year; 0.96% of AUF.',
  'provisions@FY24': '+45%: rising stress in unsecured loans.',
  'provisions@FY25': 'New basis from FY25 (recoveries netted): ₹7,088 cr vs ₹7,966 cr on the old basis; incl. ₹359 cr extra ECL in Q4.',
  'provisions@FY26': '+34%: incl. ₹1,406 cr accelerated ECL (Q3) and ₹142 cr overlay (Q4).',
  'pat@FY16': '+42%: AUM +36%.', 'pat@FY17': '+44%.', 'pat@FY18': '+36%.', 'pat@FY19': '+60%: AUM +41% with lower cost-to-income.', 'pat@FY20': '+32% despite Q4 Covid provisions.',
  'pat@FY21': '−16%: Covid loan losses.', 'pat@FY22': '+59%: recovery from Covid.', 'pat@FY23': '+64%: credit cost at a record low 0.96%.', 'pat@FY24': '+26%: AUM +34%; ₹9,097 cr equity raised.',
  'nim@FY25': '−50bp: funding costs peaked (7.97%) and the mix moved to mortgages.',
  'creditCost@FY20': 'Covid.', 'creditCost@FY21': 'Covid peak.', 'creditCost@FY22': 'Normalising.', 'creditCost@FY23': 'Cycle low.',
  'roe@FY21': 'Covid year; plus ₹8,568 cr raised in FY20.', 'roe@FY22': 'Recovery.', 'roe@FY23': 'Peak returns: low credit cost.', 'roe@FY24': 'Diluted by the ₹9,097 cr raise.',
  'aum@FY27E': 'GAM: +24% (top of the 22-24% guidance; record Q1 addition).',
  'provisions@FY27E': 'GAM: credit cost 1.50% of avg AUM (≈1.53% of AUF) vs 1.45-1.60% guidance; no repeat of FY26 one-offs.',
  'pat@FY27E': 'GAM: +34% reported, ~26% on FY26 profit before one-offs.',
  'nim@FY27E': 'GAM: −10bp (guided 10-15bp moderation).',
  'pat@Q3FY26': '₹1,406 cr accelerated ECL and ₹265 cr Labour Code charge.',
  'expenses@Q3FY26': 'Includes the ₹1,406 cr accelerated ECL provision.',
  'expenses@Q2FY25': '+36%: loan losses rising in unsecured and small-business loans (FY25 credit cost 1.93% of AUF vs 1.33% in FY24) on top of opex growth with the book (FY25 AUM +26%).',
  'expenses@Q3FY25': '+35%: the same credit-cost upswing; MSME and personal-loan stress.',
  'expenses@Q4FY25': '+33%: includes a ₹359 cr additional ECL provision.',
  'pat@Q4FY26': '+22%: ₹142 cr overlay; ₹5,660 cr before one-offs (+27%).',
  'pat@Q1FY27': '+28% despite a ₹296 cr macro overlay; ROE 20.4%.',
  'sales@Q2FY24': 'Total income +34% year on year.',
};

module.exports = { risks, glossary, statementNotes };
