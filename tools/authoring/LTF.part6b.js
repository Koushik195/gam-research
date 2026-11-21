// L&T Finance report, part 6b: risks and honest summary, glossary, statement notes.
const X = require('./LTF.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, AS, n0, n1, n2, pc, price, pbMult, bvSep28, fwdPbNow, PBR, rating, buyBelow, sellAbove, mv, Q1, cc10, feeCutEps28, distInc, distPctPbt } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a good repair job, priced as if the next one is already done (${rating})`,
  blocks: [
    { callout: `**What you are buying:** a lender that has finished an impressive clean-up: 98% retail, a AAA rating from its L&T parentage, growth of 25-27% across every business, credit cost falling from the 2025 microfinance peak, a proven underwriting engine in two-wheelers and a wholesale legacy down to ~5% of the book. Profit has nearly tripled since FY22 and Q1FY27 ROE was 12.7%, the best in seven years.` },
    { callout: `**What you are paying:** ${n1(fwdPbNow)}x our FY28E book and ${n1(price / F.eps[1])}x FY28E EPS, above LTF's ${PBR.med}x median forward P/B since it became a retail lender, for an ROE ({{F.roe.0|pct}} in FY27E) that only passes the ${n1(V.ke)}% cost of equity in FY28E on our numbers. On the street's method, with a multiple derived from LTF's own retail-era history, that gives {{dcf.tp|inr}} ({{dcf.upside|chg}}) and a ${rating}. The price already implies a ~{{dcf.impliedRoe|pct0}} ROE for ever, the top of the FY31 target range; justified P/B (₹${n0(mv('jpb').value)}) and residual income (₹${n0(mv('ri').value)}) are ${n0((1 - mv('jpb').value / price) * 100)}-${n0((1 - mv('ri').value / price) * 100)}% below it. And ~${n0(distPctPbt)}% of last year's profit came from insurance commission that IRDAI proposes to cap.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Credit cost reaches 2.0-2.2% by Q4FY27 with no provision releases', 'Medium', 'Q2FY27 results (due by mid-November 2026) and Q3'],
      ['IRDAI softens or drops the credit-life commission cap', 'Low-Medium', 'Final rules after the 25-Oct-2026 comment deadline'],
      ['Personal loans and microfinance hold quality through a weak monsoon', 'Medium', 'PAR and 0-DPD trends; Cyclops cohort data for personal loans (due after 24 months)'],
      ['Faster SR resolutions release capital and remove the ~20bp ROA drag', 'Low-Medium', 'Net SR book (₹4,808 cr at Mar-26)'],
      [`A price below ~₹${n0(buyBelow)} (≈${n1(buyBelow / F.bvps[1])}x FY28E book)`, '–', 'The target would then be 15%+ away (BUY under our rule)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Another microfinance cycle (weak monsoon, over-indebtedness returns)', 'Medium', `Each 10bp of credit cost is ~${n1(cc10)}% of FY28E profit; ~3% (bear) cuts FY28E EPS to ₹{{scen.bear.eps.1|n2}}`],
      ['IRDAI caps remove most loan-linked commission', 'Medium', `Base takes ~₹${n1(feeCutEps28)} off FY28E EPS; the bear case doubles the cut (₹${n0(distInc)} cr of FY26 income at stake)`],
      ['Personal-loan losses rise as the book seasons', 'Medium', '13% of the book, +80% in a year; higher credit cost and slower growth'],
      ['Rate hikes and tighter NBFC funding', 'Medium-High', 'Cost of funds +25bp in the bear case; AAA and priority-sector loans soften it'],
      ['Gold-branch build-out costs more and earns less than planned', 'Medium', 'Opex stays above 4% of the book; no operating leverage'],
      ['Multiple de-rates to the pre-2025 range', 'Medium', `Bear ${AS.valuation.blend.methods[0].multiple.bear}x Sep-28E book: {{scen.bear.tp|inr}}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**On today's numbers we would turn buyers below ~₹${n0(buyBelow)} and stay sellers above ~₹${n0(sellAbove)}.** The 30-Sep price of ₹${n0(price)} is above the sell line even after the ~15% fall in late September.`,
      `**Biggest swing factors:** the multiple (0.1x ≈ ₹${n0(0.1 * bvSep28)} a share), credit cost (10bp ≈ ${n1(cc10)}% of FY28E EPS) and the IRDAI outcome (~${n1(feeCutEps28 / F.eps[1] * 100)}% of FY28E EPS in our base).`,
      '**Portfolio fit:** not a short-term short (a well-run, well-capitalised lender with momentum and a strong parent can stay expensive), but we would not own it at this price: the risk-reward is skewed to the downside until either the price or the returns move. Re-assess after the IRDAI final rules and Q3FY27 credit costs.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Book, Jun-2026', v: '₹1.30 lakh cr', d: '+27% YoY; 98% retail' },
      { k: 'Credit cost, Q1FY27', v: '2.54%', d: 'target 2.0-2.2% by Q4FY27' },
      { k: 'Insurance income ÷ PBT, FY26', v: `~${n0(distPctPbt)}%`, d: 'IRDAI proposes caps' },
      { k: 'Price ÷ FY28E book', v: `${n1(fwdPbNow)}x`, d: `retail-era median ${PBR.med}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['NBFC, upper layer', 'Non-banking financial company: an RBI-regulated lender that cannot take current or savings deposits. The "upper layer" is the RBI\'s tier for the largest NBFCs, with bank-like rules.'],
      ['Book / AUM', 'Loans outstanding (LTF\'s "consolidated book": ₹1,29,634 cr in Jun-2026), retail plus the wholesale run-off. Excludes security receipts.'],
      ['Retailisation', 'Retail loans as a share of the book (98%).'],
      ['JLG, rural group loans, microfinance', 'Joint-liability group loans: small loans to women in groups who guarantee each other. MFIN is the industry body that sets borrower guardrails.'],
      ['Micro-LAP, LAP', 'Loans against property: small loans against a rural home (micro-LAP) or larger loans against residential or commercial property (LAP).'],
      ['Wholesale book, SRs, ARC', 'Legacy infrastructure and real-estate loans. Many were sold to asset-reconstruction companies (ARCs) for security receipts (SRs), paid out as the ARC recovers money.'],
      ['NII, NIM, NIM + fees', 'Net interest income = interest earned − interest paid. NIM = NII ÷ average book. LTF guides on NIM plus fee and other income (10-10.5%).'],
      ['WACB, cost of funds', 'Weighted average cost of borrowing (company, 7.20% in Q1FY27); our cost of funds = interest expense ÷ average year-end borrowings.'],
      ['Credit cost', 'Loan-loss provisions and write-offs ÷ average book. Macro-prudential provisions are extra buffers built in good years and released in bad ones.'],
      ['Stage 1 / 2 / 3, GS3, NS3, PCR', 'Ind AS buckets: performing, 30-90 days overdue, 90+ days. GS3/NS3 = gross/net Stage 3 loans as % of the book; PCR = provisions ÷ Stage 3.'],
      ['PAR, 0-DPD, collection efficiency', 'Portfolio at risk (loans with any overdue); share of loans with zero days past due; collections ÷ amounts due.'],
      ['Slippages', 'New loans falling into Stage 3 in a period (before write-offs).'],
      ['Cyclops, Nostradamus', 'LTF\'s in-house AI underwriting engine and its portfolio-monitoring engine.'],
      ['Distribution income, credit life', 'Commission LTF earns for selling insurance; credit life pays off a loan if the borrower dies. IRDAI is the insurance regulator.'],
      ['CGFMU, CGTMSE', 'Government credit-guarantee schemes for microfinance and small-business loans.'],
      ['CRAR, Tier 1', 'Capital ÷ risk-weighted assets (minimum 15% for NBFCs); Tier 1 is the core equity part (minimum 10%).'],
      ['ROA, ROE', 'Profit ÷ average assets (or book); profit ÷ average shareholders\' equity.'],
      ['P/B, justified P/B, residual income', 'Price ÷ book value per share. Justified P/B = (ROE − g) ÷ (cost of equity − g). Residual income = book plus the present value of profit above the cost of equity.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the book value (or EPS) the market will look at in September 2027.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'aum@FY20': '−1%: wholesale lending slowed after the IL&FS default.', 'aum@FY21': '−4%: Covid; wholesale book shrinking.', 'aum@FY22': '−6%: wholesale run-down (retail +10%).',
  'aum@FY23': '−8%: wholesale book sold to ARCs (₹43,257 cr → ₹19,840 cr); retail +35%.', 'aum@FY24': '+6%: retail +31%, wholesale −72%.', 'aum@FY25': '+14%: microfinance slowdown; wholesale down to ₹2,582 cr.', 'aum@FY26': '+25%: personal loans +70%, gold loans added (₹2,845 cr).',
  'provisions@FY21': 'Incl. ₹420 cr fair-value losses; Covid.', 'provisions@FY22': 'Incl. ₹1,089 cr fair-value losses on wholesale assets and SRs.', 'provisions@FY23': 'Incl. the ₹2,687 cr exceptional fair-value loss on the wholesale book.',
  'provisions@FY24': 'Incl. ₹357 cr fair-value losses (SRs).', 'provisions@FY25': 'Microfinance stress; ₹400 cr of macro-prudential provisions released.', 'provisions@FY26': '₹450 cr of macro-prudential provisions released; ₹562 cr write-offs.',
  'pat@FY20': '−24%: wholesale stress.', 'pat@FY21': '−44%: Covid provisions; incl. ₹225 cr gain on selling the wealth business.', 'pat@FY23': 'Incl. ₹2,575 cr gain on the mutual-fund sale; continuing operations lost ₹729 cr.',
  'pat@FY24': '+51%: first year as a retail lender.', 'pat@FY25': '+14%: microfinance credit costs.', 'pat@FY26': '+13%: after a ₹28.5 cr labour-code charge.',
  'sales@FY24': 'Audited basis (Screener grosses ~₹675 cr into revenue and expenses).', 'nim@FY24': 'Retail replaced low-yield wholesale loans.', 'nim@FY26': 'Funding costs fell after the 2025 rate cuts.',
  'creditCost@FY23': 'Incl. the exceptional wholesale fair-value loss.', 'creditCost@FY26': 'After ₹450 cr of releases (2.9% before).', 'roe@FY21': 'Covid; rights issue.', 'roe@FY22': 'Wholesale clean-up.',
  'aum@FY27E': 'GAM: +24% (guidance "over 20%"; Q1 +27%).', 'provisions@FY27E': 'GAM: 2.40% of the book (guidance 2.0-2.2% by Q4FY27).', 'pat@FY27E': 'GAM: lower credit cost and a 24% larger book.',
  'pat@FY28E': 'GAM: IRDAI haircut takes 0.30% of the book off fee income.', 'netWorth@FY27E': '23% payout; no equity raise.',
  'pat@Q4FY24': 'Incl. ₹175 cr additional provision on SRs.', 'pat@Q3FY26': 'After a ₹29 cr labour-code charge.', 'pat@Q1FY27': '+29%: record; credit cost 2.54% with no release.',
  'expenses@Q4FY25': 'Microfinance credit costs (3.8% before a ₹300 cr release).',
};

module.exports = { risks, glossary, statementNotes };
