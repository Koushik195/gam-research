// HDB Financial Services report, part 6b: risks and honest summary, glossary, statement notes.
const X = require('./HDBFS.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, AS, n0, n1, n2, price, pbMult, bvSep28, fwdPbNow, fwdPeNow, trailPb, PB12, rating, buyBelow, sellAbove, mv, Q1, F26 } = X;
const bp10 = F.avgAum[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100; // 10bp of margin or credit cost, % of FY28E profit
const insHit = F26.insuranceCommission / F26.pbt * 100;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good lender at a fair price, waiting for growth',
  blocks: [
    { callout: `**What you are buying:** a diversified retail lender with HDFC Bank's name and AAA funding, 23.9 mn customers in small-town India, an 8%+ margin, a cleaned-up book (Stage 3 ${Q1.stage3Pct}%) and record profit (ROA ${Q1.roaAssets}%, ROE ${n1(Q1.roe)}% in Q1FY27). No forced seller: HDFC Bank holds 74.1% and need not sell. Profit grows ~28% in FY27 in our model and 11-14% a year after; book value ~13-14% a year.` },
    { callout: `**What you are paying:** ${n1(trailPb)}x trailing book, ${n1(fwdPbNow)}x our FY28E book and ${n1(fwdPeNow)}x FY28E EPS for an ROE of ~${n1(F.roe[1])}% against a ${n1(V.ke)}% cost of equity. The street's method at our derived multiple gives {{dcf.tp|inr}} ({{dcf.upside|chg}}), a ${rating}; our justified P/B (₹${n0(mv('jpb').value)}) and residual income (₹${n0(mv('ri').value)}) are 20-30% below the price. The market is paying for a return to ~18% ROE; we see ~14.5%.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Asset finance and business loans grow again; AUM growth back to 16-18% without a rise in Stage 2', 'Medium', 'Q2FY27 results (due by mid-November 2026) and the H2 disbursement run-rate'],
      ['Credit cost settles nearer 2.0-2.1% (management\'s AI collections target is −20bp)', 'Low-Medium', 'Quarterly loan losses and Stage 2 flows'],
      ['IRDAI\'s final rules leave insurance commission largely intact', 'Medium', 'Final regulations after the 25-Oct-2026 comment deadline'],
      [`A price at or below ~₹${n0(buyBelow)} (our buy-below level)`, 'Medium', 'Price; the stock was ₹579 in Apr-2026'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['A weak monsoon / El Nino hits truck, tractor and rural borrowers', 'Medium', `Each 10bp of credit cost is ~${n1(bp10)}% of FY28E profit; bear case (+50bp) target {{scen.bear.tp|inr}}`],
      ['Repo hike: funding reprices before fixed-rate loans', 'Medium-High (expected by most economists in late Sep-2026)', `Each 10bp of NIM is ~${n1(bp10)}% of FY28E profit; bear case adds 25bp to funding cost`],
      ['IRDAI caps loan-linked insurance commissions harder than we assume', 'Medium', `Insurance commission was ₹${n0(F26.insuranceCommission)} cr in FY26 (${n0(insHit)}% of PBT); we cut a third from FY28E`],
      ['Growth stays at ~11% (asset finance does not turn)', 'Medium', 'EPS growth ~10% a year; the multiple drifts toward the 1.8x post-listing low'],
      ['HDFC Bank narrows HDB\'s role (takes BPO in-house, keeps more products to itself)', 'Low', 'BPO is ~2% of profit; product boundaries matter more'],
      ['Another unsecured or vehicle-credit cycle like FY25-FY26', 'Medium', 'Credit cost back to 2.5%+, ROE ~13% (bear case)'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**On today's numbers we would buy below ~₹${n0(buyBelow)} and turn sellers above ~₹${n0(sellAbove)}.** The 30-Sep price (₹${n0(price)}) is mid-band. The rating is sensitive to the multiple: at 2.1x Sep-28E book the target is ~₹${n0(Math.round(2.1 * bvSep28 / 10) * 10)} (BUY); at 1.6x (justified P/B) ~₹${n0(Math.round(1.6 * bvSep28 / 10) * 10)} (SELL).`,
      `**Biggest swing factors:** the multiple (0.1x ≈ ₹${n0(0.1 * bvSep28)} a share), loan losses and margin (10bp of either ≈ ${n1(bp10)}% of FY28E profit), and growth.`,
      '**Portfolio fit:** a quality retail-credit holding for investors who want exposure to small-business and vehicle lending with a bank parent behind it; not yet a growth story, and not cheap enough to be a value one.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'NIM, Q1FY27', v: `${Q1.nimLoans}%`, d: 'management floor 8%' },
      { k: 'Credit cost, Q1FY27', v: `${Q1.creditCostLoans}%`, d: 'steady state ~2.3%' },
      { k: 'ROE, FY27E', v: '{{F.roe.0|pct}}', d: `cost of equity ${n1(V.ke)}%` },
      { k: 'Price ÷ FY28E book', v: `${n1(fwdPbNow)}x`, d: `12-month median ${n2(PB12.med)}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['NBFC', 'Non-banking financial company: a lender regulated by the RBI that cannot take current or savings deposits.'],
      ['Upper-layer NBFC', 'The largest non-bank lenders under the RBI\'s scale-based regulation; they face bank-like rules and must be listed.'],
      ['AUM / gross loan book', 'Assets under management: all loans HDB manages (₹1,18,733 cr, Mar-26); the gross loan book is the on-balance-sheet part (₹1,18,493 cr).'],
      ['Enterprise lending, asset finance, consumer finance', 'HDB\'s three verticals: loans to small businesses (incl. LAP); loans for trucks, equipment and tractors; loans to consumers for durables, cars, two-wheelers and personal needs.'],
      ['LAP, CV, CE', 'Loan against property; commercial vehicle; construction equipment.'],
      ['BPO services', 'Business process outsourcing: sales support, back-office and collection services HDB provides to HDFC Bank for a fee.'],
      ['NII, NTI, NIM', 'Net interest income; net total income (NII + fees); net interest margin (company: NII ÷ average gross loans; our model: NII ÷ average AUM).'],
      ['Cost of funds / cost of borrowings', 'Company: finance cost ÷ average gross loans (cost of funds) or ÷ average borrowings (cost of borrowings). Our model: interest ÷ average borrowings.'],
      ['Cost-to-income', 'Operating expenses ÷ net total income. The company quotes it for lending only (~40%); our model includes BPO (~45%).'],
      ['Credit cost', 'Loan losses and provisions ÷ average loans (company) or AUM (our model).'],
      ['Stage 1 / 2 / 3, ECL', 'Ind AS 109 buckets: performing, 30-90 days overdue, 90+ days overdue (non-performing). ECL = expected credit loss provisions.'],
      ['GNPA / NNPA, PCR', 'Gross / net non-performing (Stage 3) loans as % of loans; provision cover = provisions on Stage 3 ÷ Stage 3 loans.'],
      ['CRAR, Tier 1', 'Capital ÷ risk-weighted assets (minimum 15% for NBFCs); Tier 1 is the core equity part.'],
      ['LCR', 'Liquidity coverage ratio: liquid assets ÷ 30-day stressed outflows.'],
      ['Forms of business (RBI)', 'The Dec-2025 RBI directions on which businesses a bank and its group companies may run; overlap is allowed with a board-recorded rationale.'],
      ['IRDAI', 'Insurance Regulatory and Development Authority of India; its Sep-2026 consultation proposes caps on commissions lenders earn selling loan-linked insurance.'],
      ['Leverage', 'Total assets ÷ net worth.'],
      ['ROA, ROE', 'Profit ÷ average total assets; profit ÷ average shareholders\' equity.'],
      ['P/B, justified P/B', 'Price ÷ book value per share. Justified P/B = (ROE − g) ÷ (cost of equity − g): the multiple a steady ROE and growth rate support.'],
      ['Residual income', 'Book value plus the present value of future profit above the cost of equity.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the book value (or EPS) the market will look at in September 2027.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'aum@FY22': '−0.2%: Covid; book flat for a third year (FY20-FY22).',
  'aum@FY23': '+14%: recovery across verticals.',
  'aum@FY24': '+29%: strongest growth in the period.',
  'aum@FY25': '+19%.',
  'aum@FY26': '+11%: HDB cut back used/high-value CVs and unsecured business loans.',
  'provisions@FY21': 'Covid: 5.1% of loans.', 'provisions@FY22': '4.0% of loans; provision cover raised to 54%.',
  'provisions@FY23': '−46%: credit cycle turns.', 'provisions@FY24': '−20%: 1.3% of loans, the low of the cycle.',
  'provisions@FY25': '+98%: stress in CVs and unsecured business loans.', 'provisions@FY26': '+33%: 2.5% of loans, the peak of the FY25-26 cycle.',
  'feeIncome@FY24': 'BPO revenue fell to ₹1,950 cr from ₹2,634 cr.', 'feeIncome@FY25': 'BPO revenue fell to ₹1,217 cr.',
  'feeIncome@FY26': 'BPO ₹1,224 cr + lending fees ₹1,417 cr (insurance commission ₹455 cr, +64%).',
  'opex@FY26': 'Incl. ₹61 cr new labour codes charge; BPO costs ₹1,143 cr.',
  'pat@FY22': '+159%: Covid recovery.', 'pat@FY23': '+94%: credit cost halves.', 'pat@FY24': '+26%: ROE peak 19.5%.',
  'pat@FY25': '−12%: credit cost up from 1.3% to 2.1%.', 'pat@FY26': '+17%: margin up; ₹61 cr labour-code charge.',
  'netWorth@FY26': '+31%: ₹2,500 cr IPO fresh issue (Jun-2025).',
  'nim@FY25': 'Funding costs peaked (cost of funds 7.8% on borrowings).', 'nim@FY26': '2025 rate cuts lower funding costs.',
  'roe@FY24': 'Peak.', 'roe@FY25': 'Credit cost up.', 'roe@FY26': 'IPO equity; credit cost peak.',
  'aum@FY27E': 'GAM: +14% (gross loans +11.4% YoY in Q1FY27).', 'provisions@FY27E': 'GAM: 2.35% of AUM vs ~2.3% steady state.',
  'feeIncome@FY28E': 'GAM: a third of insurance commission cut (IRDAI proposal).', 'pat@FY27E': 'GAM: between Emkay and Motilal Oswal.',
  'creditCost@FY22': 'Covid tail.', 'creditCost@FY24': 'Cycle low.', 'creditCost@FY26': 'Cycle peak.',
  'pat@Q4FY25': '−19% YoY: credit cost elevated.', 'pat@Q3FY26': '+36% YoY; ₹42 cr labour-code charge (PAT ₹686 cr without it).',
  'pat@Q4FY26': '+41% YoY: NIM 8.23%, credit cost down.', 'pat@Q1FY27': '+38% YoY: record quarter; NIM 8.35%, Stage 3 2.34%.',
  'expenses@Q1FY26': 'Loan losses ₹670 cr (+ Stage 2 build in Q1).', 'sales@Q1FY27': '+11% YoY: loans +11.4%.',
};

module.exports = { risks, glossary, statementNotes };
