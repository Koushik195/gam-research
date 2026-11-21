// SBI Cards report, part 6b: risks and honest summary, glossary, statement notes.
const X = require('./SBICARD.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, AS, fin, n0, n1, n2, pc, price, peMult, epsSep28, fwdPeNow, pe27, PEN24, rating, buyBelow, sellAbove, mv, Q1, cc10, take10 } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a BUY on the street\'s yardstick, resting on a re-rating the fundamentals do not guarantee',
  blocks: [
    { callout: `**What you are buying:** India's second-largest card issuer and its largest non-bank one: 2.26 crore cards, ~19% of national card spends, SBI's branches and balance sheet behind it, AAA funding, 25.6% capital, good disclosure, and a credit cycle that has just turned (gross credit cost 6.5% in Q1FY27 from 9.5% a year earlier). What you are not buying is growth: receivables grew 2% in FY26, revolvers are shrinking, and the take rate on spends is falling.` },
    { callout: `**What you are paying:** ${n1(pe27)}x FY27E and ${n1(fwdPeNow)}x FY28E EPS (the lowest forward P/E since listing); ${n1(price / F.bvps[0])}x FY27E book for a ~17% ROE. On the street's yardstick, and on its own credit-cycle-adjusted history (${PEN24.med}x since Apr-2024 before the sector de-rating), that is cheap: ${peMult}x Sep-28E EPS gives {{dcf.tp|inr}} ({{dcf.upside|chg}}) and a ${rating}. On fundamentals it is not: at a 13.1% cost of equity the price already implies a ~{{dcf.impliedRoe|pct0}} long-run ROE, and our justified P/B (₹${n0(mv('jpb').value)}) and residual income (₹${n0(mv('ri').value)}) are below the price. The upside depends on growth returning and the market paying for it again.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Receivables growth back to double digits in H2FY27 (festive EMI, limit increases, 10 lakh+ new cards a quarter)', 'Medium', 'Q2FY27 results (due by mid-November 2026) and Q3'],
      ['Credit cost settles near 6% (CLSA / Motilal Oswal view)', 'Medium', 'Gross write-offs, Stage 2 and first-bucket entry rates'],
      ['RBI extends the 100% transactor risk weight to NBFC card issuers', 'Medium', 'NBFC capital directions; would release capital (press estimate ~450bp)'],
      ['A higher payout or a clear capital-return policy', 'Low', 'Board dividend decisions; SBI\'s stance'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Growth stays near low single digits; personal loans keep taking revolve', 'Medium', 'Bear case: receivables +4/8/9%, yield −30bp, 16x: target {{scen.bear.tp|inr}}'],
      ['A new credit cycle (fuel prices, inflation, job losses in IT services) pushes credit cost back above 7.5%', 'Low-Medium', `Each 10bp of credit cost is ~${n1(cc10)}% of FY28E profit; 7.4-7.6% (bear) cuts FY28E EPS to ₹{{scen.bear.eps.1|n2}}`],
      ['Interchange take rate falls faster (UPI-RuPay, corporate mix, any MDR regulation)', 'Medium', `Each 1bp of take rate is ~${n2(take10)}% of FY28E profit`],
      ['Funding costs rise with market rates', 'Medium', '+30bp in the bear case; NBFC funding reprices quickly'],
      ['Leadership change at the end of the MD\'s term (~Mar-2027) shifts strategy', 'Medium', 'Execution risk; history of two-to-three-year CEO terms'],
      ['The de-rating persists: the market keeps paying ~16x', 'Medium', `At 16x Sep-28E EPS our base case is worth ~₹${n0(Math.round(16 * epsSep28 / 10) * 10)} (${pc((16 * epsSep28 / price - 1) * 100)})`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**On today's numbers we would stay buyers below ~₹${n0(buyBelow)} and turn sellers above ~₹${n0(sellAbove)}.** The rating is sensitive to the multiple: at 18x Sep-28E EPS (Motilal Oswal's multiple) the target is ~₹${n0(Math.round(18 * epsSep28 / 10) * 10)} (still a BUY); at 16x (today's) ~₹${n0(Math.round(16 * epsSep28 / 10) * 10)} (HOLD).`,
      `**Biggest swing factors:** credit cost (10bp ≈ ${n1(cc10)}% of FY28E EPS), receivables growth and the multiple (1x ≈ ₹${n0(epsSep28)} a share).`,
      '**Portfolio fit:** a recovery position in Indian consumer credit with a strong parent, for investors who can wait for growth to return; size it for a bear case near {{scen.bear.tp|inr}}. It is not a compounder at today\'s ROE.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Gross credit cost, Q1FY27', v: `${Q1.creditCost}%`, d: '9.5% a year earlier' },
      { k: 'Receivables growth, Q1FY27', v: `+${Q1.receivablesGrowth}%`, d: 'spends +27%, new cards +17%' },
      { k: 'ROE, FY28E', v: '{{F.roe.1|pct}}', d: '25.7% in FY23' },
      { k: 'Price ÷ FY28E EPS', v: `${n1(fwdPeNow)}x`, d: `our multiple: ${peMult}x Sep-28E` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['NBFC', 'Non-banking financial company: a lender regulated by the RBI that cannot take current or savings deposits. SBI Card is a non-deposit-taking NBFC.'],
      ['Cards in force (CIF)', 'All cards issued and not cancelled, including suspended cards that can be reactivated.'],
      ['Spends', 'The value of purchases made with the cards (retail = individuals; corporate = company cards).'],
      ['Receivables', 'What cardholders owe at a date: the lender\'s "AUM". Transactors pay in full each month (no interest); revolvers carry a balance and pay interest; EMI balances are purchases converted into instalments.'],
      ['Interchange, take rate', 'The fee the merchant\'s bank pays the card issuer on each purchase; take rate = interchange ÷ spends.'],
      ['Banca / open market', 'New cards sourced through SBI\'s branches and app / through co-brand partners and direct sales.'],
      ['Co-brand card', 'A card issued with a partner (e.g. BPCL, Flipkart) that offers rewards on that partner\'s spending.'],
      ['NII, NIM', 'Net interest income = interest earned − interest paid. Net interest margin = NII ÷ average receivables.'],
      ['Gross / net credit cost', 'Write-offs plus the change in loss provisions ÷ average receivables; net = after recoveries of loans already written off.'],
      ['Stage 1 / 2 / 3, ECL', 'Ind AS 109 buckets: performing, 30-89 days overdue (and other higher-risk accounts), 90-179 days overdue. ECL = expected credit loss provisions held against them.'],
      ['GNPA / NNPA, PCR', 'Gross / net Stage 3 loans as % of receivables; provision coverage = provisions on Stage 3 ÷ Stage 3 loans.'],
      ['Overlay', 'An extra provision booked on management\'s judgement on top of the model-based ECL.'],
      ['Cost-to-income', 'Operating cost ÷ net revenue. Company basis includes other income (recoveries) in revenue; our basis uses NII + fees only.'],
      ['CAR, Tier 1, risk weight', 'Capital ÷ risk-weighted assets (minimum 15% for NBFCs; Tier 1 at least 10%). The risk weight is the share of a loan counted for capital: 125% for NBFC card receivables since Nov-2023.'],
      ['ROA, ROE', 'Profit ÷ average total assets; profit ÷ average shareholders\' equity.'],
      ['P/E, P/B, justified P/B', 'Price ÷ EPS; price ÷ book value per share. Justified P/B = (ROE − g) ÷ (cost of equity − g).'],
      ['Residual income', 'Book value plus the present value of future profit above the cost of equity.'],
      ['Credit-cycle-adjusted EPS', 'EPS recalculated as if gross credit cost had been at the through-cycle level (7.2%), used to read the stock\'s P/E history.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the earnings the market will look at in September 2027.'],
      ['BPSP, PIDF, UPI-RuPay', 'Business payment solution providers (routing company payments through cards); the RBI\'s Payments Infrastructure Development Fund; RuPay credit cards linked to UPI for QR payments.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'aum@FY19': '+27%: rapid card growth (8.3 million cards).', 'aum@FY20': '+30%: 10.5 million cards; Covid hit only in late March.', 'aum@FY21': '+4%: Covid lockdowns; spends −6%.',
  'aum@FY22': '+25%: post-Covid rebound; spends +52%.', 'aum@FY23': '+30%: record 52 lakh new accounts.', 'aum@FY24': '+25%: last year of fast growth.',
  'aum@FY25': '+10%: underwriting tightened as stress rose.', 'aum@FY26': '+2%: limits cut, more transactors; corporate spend growth creates no receivables.',
  'provisions@FY20': '+69%: book growth plus Covid provisions in Q4.', 'provisions@FY21': '+39%: Covid losses (incl. ₹61 cr loss on derecognition); GNPA 4.99%.',
  'provisions@FY22': '−16%: Covid losses fading.', 'provisions@FY23': '−4%: cycle low, 6.0% of receivables.', 'provisions@FY24': '+52%: unsecured-credit stress begins.',
  'provisions@FY25': '+48%: write-offs +64% to ₹4,732 cr.', 'provisions@FY26': '+2%: write-offs ₹4,926 cr; quarterly credit cost fell from 9.5% to 7.7%.',
  'pat@FY17': '+31%.', 'pat@FY18': '+61%: GE exit; growth push.', 'pat@FY19': '+44%.', 'pat@FY20': '+44%: listing year.', 'pat@FY21': '−21%: Covid.', 'pat@FY22': '+64%: recovery.',
  'pat@FY23': '+40%: credit cost at a cycle low.', 'pat@FY25': '−20%: credit cost 9.1%.', 'pat@FY26': '+13%: credit cost easing; corporate spends lift both fees and costs.',
  'nim@FY23': 'Funding costs rose (5.0% → 6.1% on our basis).', 'nim@FY24': 'Funding costs up again (7.3%); revolve share falling.', 'nim@FY26': 'Cost of funds fell to 6.9% (our basis).',
  'creditCost@FY20': 'Covid provisions.', 'creditCost@FY21': 'Covid peak.', 'creditCost@FY22': 'Normalising.', 'creditCost@FY23': 'Cycle low.', 'creditCost@FY24': 'Stress begins.', 'creditCost@FY25': 'Peak of the unsecured-credit cycle.',
  'roe@FY21': 'Covid year.', 'roe@FY22': 'Recovery.', 'roe@FY23': 'Peak returns.', 'roe@FY24': 'Credit cost rising.', 'roe@FY25': 'Credit-cost spike; profit −20%.',
  'aum@FY27E': 'GAM: +8% (H2 pick-up management expects; Q1 +2.4% QoQ).',
  'provisions@FY27E': 'GAM: 6.6% of average receivables (Q1 run-rate) vs 8.8% in FY26.',
  'pat@FY27E': 'GAM: +31%, all from lower credit cost; pre-provision profit flat.',
  'creditCost@FY27E': 'GAM: Q1FY27 run-rate.',
  'sales@Q2FY24': '+24% YoY: spends boom.', 'sales@Q3FY24': '+32% YoY: festive spends.',
  'pat@Q2FY25': '−33% YoY: credit cost spike.', 'pat@Q3FY25': '−30% YoY: write-offs peak.', 'pat@Q3FY26': '+45% YoY on a weak base; credit cost 8.3%.',
  'pat@Q1FY27': '+20% YoY: gross credit cost 6.5%, incl. a ₹65 cr provision release.',
  'expenses@Q1FY26': '+20% YoY: impairment ₹1,352 cr (9.5%) on top of spend-linked costs.',
};

module.exports = { risks, glossary, statementNotes };
