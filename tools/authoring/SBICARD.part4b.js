// SBI Cards report, part 4b: competitive advantage scorecard, Q1FY27 and guidance, earnings quality.
const X = require('./SBICARD.ctx');
const { C, F, A, fin, fi, n0, n1, pc, Q1, G27, K26, ctiCo } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in distribution and parentage; weak in pricing and growth',
  blocks: [
    { p: 'A card issuer\'s moat shows up as cheap, low-risk customer acquisition, high activity per card and stable returns through a credit cycle. SBI Card scores well on the first, average on the second and poorly on the third: its ROE fell from 25.7% to 14.7% in two years. We test each source of advantage.' },
    { verdicts: [
      ['SBI parentage and branch channel', 'Advantage', 'Nearly half of new cards come through SBI (47% in Q1FY27); SBI has 53 crore customers, of whom management sees "at least 1.5-2 crore" as cardable; SBI also lends 45% of its borrowings.', 'Durable as long as SBI keeps the card business in-house; no other non-bank issuer has this.'],
      ['Scale and co-brands', 'Advantage', '18.6% of cards, 19.5% of spends; BPCL (5 million cards), Flipkart, Tata Neu, IndiGo, PhonePe, IRCTC, Apollo co-brands.', 'Scale brings network incentives and partner deals; co-brands can move between issuers when contracts end.'],
      ['Underwriting through the cycle', 'Parity', 'Credit cost 6.0% in FY23 but 9.1% in FY25 (our basis); stress in FY25-26 forced tighter limits and slower growth.', 'Not a shield: the book is unsecured and the customer base widened fast in FY22-24.'],
      ['Funding', 'Parity', 'AAA/A1+, SBI lines, cost of funds 6.5%; but no deposits.', 'Cheaper than most NBFCs, dearer than bank issuers.'],
      ['Pricing power', 'Disadvantage', 'Revolvers fell from 24% to 22% as customers moved to personal loans; interchange take rate down from ~1.4% to 1.19%.', 'Card interest is exposed to cheaper credit; interchange to UPI and corporate mix.'],
      ['Technology and engagement', 'Parity', 'App rated 4.5-4.6; 30-day active rate 52.5%; hyper-personalised offers; SPRINT digital onboarding.', 'Table stakes among large issuers.'],
      ['Regulatory position', 'Parity', 'NBFC rules (125% risk weight) but exempt from the NBFC revolving-credit draft; transactor relief possible.', 'Rules have cost it growth (BPSP, 2023 risk weights) more than they have helped.'],
    ], head: ['Source of advantage', 'Verdict', 'Evidence', 'Durability'], title: 'Moat scorecard', source: 'Company presentations and calls; annual report FY26; GAM Research' },
    { callout: '**Honest verdict:** SBI Card has a narrow moat built on its parent: cheap, trusted acquisition through SBI and the scale that comes with it. It does not have pricing power, and its returns are not stable through a credit cycle. The moat protects its market share, not its margins.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: profit +20% on credit cost; everything else was soft',
  blocks: [
    { p: `Q1FY27 (Apr-Jun 2026, reported 24-Jul-2026) had one strong number and several weak ones. Gross credit cost fell to ${Q1.creditCost}% (7.7% in Q4, 9.5% a year earlier), so profit rose 20% to ₹${Q1.pat} cr and ROE reached ${Q1.roe}%. But revenue from operations grew only 3%, receivables 3%, interest income fell 3%, NIM fell 28bp QoQ to ${Q1.nim}%, operating cost rose 23% (spends, new cards, a wage-code provision) and cost-to-income rose to ${Q1.costToIncome}%. Earnings before credit cost fell 12% year on year. New accounts (+17%) and retail spends (+14%) were the leading indicators that improved.` },
    { exhibit: { type: 'table', title: 'FY27 guidance vs Q1 and our forecast', head: ['Metric', 'Guidance (calls, Apr / Jul 2026)', 'Q1FY27 actual', 'GAM FY27E'], wide: [1], rows: [
      ['Receivables growth', G27.receivables, `+${Q1.receivablesGrowth}% YoY`, '{{F.aumGrowth.0|pct}}'],
      ['NIM', G27.nim, `${Q1.nim}% (−28bp QoQ)`, '{{F.nim.0|pct}} our basis (FY26 {{fin.nim.11|pct}})'],
      ['Cost of funds', G27.cof, `${Q1.cof}% (daily average ${Q1.cofDaily}%)`, '{{F.costOfFunds.0|pct}} our basis'],
      ['Cost-to-income', G27.costToIncome, `${Q1.costToIncome}%`, `${n1(ctiCo(fi('FY27E')))}% company basis ({{F.costToIncome.0|pct}} ex other income)`],
      ['Credit cost', G27.creditCost, `${Q1.creditCost}% gross; ${Q1.netCreditCost}% net`, '{{F.creditCost.0|pct}} gross, our basis'],
      ['ROA', G27.roa, `${Q1.roa}%`, '{{F.roa.0|pct}} on total assets'],
      ['New accounts', G27.newAccounts, `${Q1.newAccountsLakh} lakh`, '–'],
    ], source: 'Q4FY26 call (27-Apr-2026); Q1FY27 presentation and call (24-Jul-2026); GAM estimates' } },
    { exhibit: { type: 'table', title: 'Quarterly trend: credit cost down, everything else flat', head: ['', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], rows: [
      ['Gross receivables (₹ cr)', '56,607', '59,845', '57,213', '56,926', '58,269'],
      ['Spends (₹ cr)', '93,244', '1,07,063', '1,14,701', '1,15,350', '1,18,475'],
      ['Gross credit cost (%)', '9.5', '9.0', '8.3', '7.7', '6.5'],
      ['Cost of funds (%)', '7.1', '6.4', '6.5', '6.4', '6.5'],
      ['Cost-to-income (%)', '50.3', '56.8', '56.8', '57.2', '58.7'],
      ['Profit after tax (₹ cr)', '556', '445', '557', '609', '664'],
      ['ROE (%)', '15.8', '12.1', '14.7', '15.6', '16.5'],
    ], source: 'Quarterly presentations Q2FY26-Q1FY27; Emkay (27-Jul-2026) for Q3FY26 ROE' } },
    { callout: '**Our read:** management guides on direction, not numbers, for growth and credit cost; the hard guidance (cost-to-income 56-58%, ROA 4-4.5% in the medium term) is consistent with our model. The one thing it has repeatedly promised and not yet delivered is receivables growth ("will lead to asset growth in the coming days", Apr-2026). Our FY27E needs that H2 pick-up; if it does not come, FY27E receivables growth would be ~4-5%; with spends unchanged that costs only ~1% of FY27E EPS and ~2% of FY28E, but it would undermine the case for a higher multiple.' },
  ],
};

const earningsQuality = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean books, but overlays and one-offs move quarters',
  blocks: [
    { p: 'We rate accounting **AMBER**, close to green. Joint auditors appointed by the Comptroller and Auditor General (V. K. Dhingra & Co. and S. P. Chopra & Co.) gave an unmodified opinion on FY26; disclosure of asset quality (stages, write-offs, recoveries, ECL rates) is good. What a reader should watch:' },
    { bullets: [
      '**Overlays.** A ₹121 cr management overlay at Dec-2025 was raised to ₹220 cr at Mar-2026; in Q1FY27 ₹180 cr of it was used for the annual ECL model refresh, ₹65 cr of provisions were released on a better portfolio mix and ₹70 cr is still held. Without the release, Q1 credit cost would have been ~7.0%, not 6.5%.',
      '**One-offs in Q4FY26.** Other income included ₹109 cr of liabilities and provisions written back in FY26 (mostly Q4: a GST liability write-back), and opex benefited from a payment-infrastructure fund (PIDF) reversal; management acknowledged "a couple of one-offs". Adjusted for them, Q4 cost-to-income was ~60%.',
      '**Gross vs net credit cost.** Recoveries of written-off loans (₹686 cr in FY26) sit in other income; the company quotes both gross (8.6%) and net (7.4%) credit cost. We forecast both lines separately.',
      '**Related parties.** SBI is lender (₹19,876 cr), distribution channel (₹177 cr of fees and commission paid) and brand owner (₹43 cr royalty). All stated at arm\'s length; the dependence is a strength and a governance consideration.',
      '**Tax.** A ₹81 cr GST show-cause notice on input-tax credit (Jul-2025) and older service-tax and GST disputes on interchange income are disclosed as contingent liabilities; none was material to profit.',
    ] },
    { exhibit: { type: 'table', title: 'Tie-out: company vs Screener / our model (FY26, ₹ crore)', head: ['Line', 'Company', 'Screener / our model', 'Gap and why'], wide: [3], rows: [
      ['Revenue from operations', n0(K26.revenueFromOps), '{{fin.sales.11|num}}', 'Screener moves ~₹2 cr from other income'],
      ['Interest income', n0(K26.interestIncome), '{{fin.interestIncome.11|num}}', 'Ties (fees = revenue − interest income)'],
      ['Finance cost', n0(K26.financeCost), '{{fin.interest.11|num}}', 'Ties'],
      ['Operating cost incl. fees paid and depreciation', n0(K26.opexTotal), '{{fin.opex.11|num}}', 'Ties (Screener expenses − impairment + depreciation)'],
      ['Impairment on financial instruments', n0(K26.impairment), '{{fin.provisions.11|num}}', 'Ties'],
      ['Other income', n0(K26.otherIncome), '{{fin.otherIncome.11|num}}', 'Mirror of the ₹2 cr revenue reclassification'],
      ['Profit before tax', n0(K26.pbt), '{{fin.pbt.11|num}}', 'Ties'],
      ['Net profit', n0(K26.pat), '{{fin.pat.11|num}}', 'Ties; standalone = whole company (no subsidiaries)'],
    ], source: 'Annual report FY26 p313; Screener.in; GAM Research' } },
  ],
};

module.exports = { moat, guidance, earningsQuality };
