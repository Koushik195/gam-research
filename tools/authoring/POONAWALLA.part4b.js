// Poonawalla Fincorp report, part 4b: competitive advantage scorecard, Q1FY27 and guidance, earnings quality.
const X = require('./POONAWALLA.ctx');
const { C, F, A, fin, fi, n0, n1, n2, pc, Q1, G, QK, AK, SE, rest27, P } = X;
const F26 = C.fy26, i26 = fi('FY26');

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: strong backing and a deep bench, but no moat yet',
  blocks: [
    { p: 'A lender\'s moat shows up as a lasting gap between what it earns on loans and what it pays for funds, costs and losses. Poonawalla has not yet shown one: its ROA was ~1.1% in FY26 against 2-6% for the better listed NBFCs, and its best year (FY24) was flattered by one-offs. We test where an edge could come from.' },
    { verdicts: [
      ['Promoter backing and funding access', 'Advantage', 'AAA (CRISIL, CARE) as a Poonawalla-group company, up from AA- for Magma in 2020; the promoter put in ₹3,206 cr (2021, of a ₹3,456 cr issue) and ₹1,500 cr (2025).', 'Lowers funding cost and refinancing risk versus other mid-sized NBFCs; does not beat banks.'],
      ['Management bench', 'Advantage (unproven)', 'MD and business heads hired from HDFC Bank, Bandhan, Aditya Birla Finance and others, "2 levels deep" in each new business.', 'A real asset, but this team has run Poonawalla for only two years and one up-cycle.'],
      ['Underwriting, data and AI', 'Unproven', 'New-loan delinquency 6.74% → 0.64% after recalibration; 101 AI projects; ECL on new products still set from bureau/industry data, not own history (auditor\'s key audit matter).', 'Every large lender is doing the same; the FY25 STPL losses came from a "digital-first" book.'],
      ['Distribution and customer franchise', 'Disadvantage', '~500 branches (most new gold branches); instant loans sourced largely through fintech and digital partners who own the customer interface; no deposit or card relationship.', 'Acquisition cost and loyalty are weaker than at Bajaj Finance or banks; partners can move volume elsewhere.'],
      ['Funding cost', 'Disadvantage', 'Cost of borrowing 7.72% (Q1FY27); all wholesale; no deposits.', 'Banks win on price in LAP and prime personal loans, ~37% of AUM.'],
      ['Operating cost and scale', 'Disadvantage', `Opex ~4% of AUM, cost-to-income ${Q1.costToIncome}% (Q1FY27); AUM ₹67,054 cr vs ₹5.5 lakh cr at Bajaj Finance.`, 'Operating leverage is the main lever left, and it depends on growth continuing.'],
    ], head: ['Source of advantage', 'Verdict', 'Evidence', 'Durability'], title: 'Moat scorecard', source: 'Company presentations and calls; Annual Report FY26 (auditor\'s report); GAM Research' },
    { callout: '**Honest verdict:** Poonawalla has no moat today. It has two genuine assets, a deep-pocketed promoter that gives it AAA funding and an experienced bench, and a diversified product set that should make losses less lumpy than in FY25. Whether those become a lasting edge depends on credit costs on books that are still young. Until they do, we treat it as a well-funded challenger whose returns will converge to the industry\'s, not exceed it.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: the best quarter since the reset; guidance is directional, not numerical',
  blocks: [
    { p: `Q1FY27 (Apr-Jun 2026, reported 17-Jul) was the strongest quarter since the reset: AUM +${Q1.aumGrowth}% YoY and +${Q1.aumQoq}% QoQ to ₹${n0(Q1.aum)} cr; NII incl. fees +${Q1.niiGrowth}% to ₹${n0(Q1.niiInclFees)} cr; pre-provision profit ₹${Q1.ppop} cr; credit cost ₹373 cr (2.40%); PAT ₹${Q1.pat} cr (+${Q1.patQoq}% QoQ); ROA ${Q1.roaCo}%; GNPA ${Q1.gnpa}%. Motilal Oswal called PAT ~7% below its estimate; HDFC Securities "marginally ahead". The MD's message: credit cost should keep improving "for a couple of quarters", opex may swing 15-25bp, and ROA should reach 3-3.5% by a "June exit of 2028". He gives no numerical guidance for profit, NIM or credit cost.` },
    { exhibit: { type: 'table', title: 'FY27 direction vs Q1 and our forecast', head: ['Metric', 'Management (May / Jul 2026)', 'Q1FY27 actual', 'GAM FY27E'], wide: [1], rows: [
      ['AUM growth', '35-40% CAGR over two years', `${Q1.aumGrowth}% YoY (11.1% QoQ)`, '{{F.aumGrowth.0|pct}}'],
      ['NIM', '"comfortably NIM accretive"; disbursement yields +50bp', `${Q1.nimCo}% (incl. fees)`, '{{F.nim.0|pct}} excl. fees (FY26 {{fin.nim.11|pct}})'],
      ['Opex to AUM', 'lower each March; 10-25bp quarterly swings', `${Q1.opexCo}%`, '{{F.opexPct.0|pct}} (FY26 {{fin.opexPct.11|pct}})'],
      ['Credit cost', '"structurally improving" from 2.4%', `${Q1.creditCostCo}%`, '{{F.creditCost.0|pct}}'],
      ['ROA', '3-3.5% by a June-2028 exit', `${Q1.roaCo}%`, '{{F.roa.0|pct}}'],
      ['Gold branches', '~400 more in FY27', '460 live', '–'],
      ['Capital', 'QIP covers "4 to 5 quarters"', `CRAR ${Q1.crar}%`, 'next raise assumed in FY28E'],
    ], source: 'Q4FY26 and Q1FY27 presentations and calls; GAM estimates' } },
    { exhibit: { type: 'table', title: 'Track record: what was promised and what happened', head: ['Promise', 'When / who', 'Outcome', 'Verdict'], wide: [0, 2], rows: [
      ['AUM +35-40%, profit +30-35%, ROA 4-4.5%, GNPA 1.3-1.8% (long term)', 'Apr-2024, previous team', 'FY25: AUM +43% but a ₹98 cr loss; ROA −0.3%', 'Missed badly'],
      ['ROA 3-3.5% "in 3 years from the day I joined" (Jun-2024)', 'Apr-2025, current MD', 'Restated as a "June exit of 2028" in Jul-2026; Q1FY27 ROA 1.98%', 'Slipped a year'],
      ['Restore ~9% NIM (incl. fees) in 3-4 quarters', 'Q1FY26 call', '9.05% in Q4FY26, 3 quarters later', 'Delivered'],
      ['400 gold branches by Mar-2026', 'FY26', '400 operational by Mar-2026', 'Delivered'],
      ['Lower opex-to-AUM by March', 'FY26', '4.76% (Q4FY25) → 4.13% (Q4FY26)', 'Delivered'],
      ['Six new products', 'FY25-FY26', 'All launched; shopkeeper loans then slowed', 'Mostly delivered'],
    ], source: 'Q4FY24 presentation p20; Q4FY25, Q4FY26 and Q1FY27 calls' } },
    { callout: `**Our read:** the current team has delivered on operating promises (branches, products, NIM, opex) and is slipping on the one that matters most for valuation (ROA). Our FY27E PAT of ₹{{F.pat.0|num}} cr needs ~₹${n0(rest27)} cr a quarter for Q2-Q4, ${pc((rest27 / Q1.pat - 1) * 100)} on Q1; Motilal Oswal (₹${n0(SE.mosl.pat.FY27E / 10)} cr) and HDFC Securities (₹${n0(SE.hsie.pat.FY27E / 10)} cr) are both higher, Motilal by a wide margin.` },
  ],
};

const eq = (F26.derecognitionGain / F26.pbt * 100);
const earningsQuality = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean audit, but thin provisions and loan-sale gains flatter the trend',
  blocks: [
    { p: 'We rate accounting **AMBER**. The joint auditors (M S K A & Associates and Kirtane & Pandit) flagged expected credit loss and IT controls as key audit matters; we found no qualification, and disclosure has improved (stage-wise coverage, early-delinquency curves). But a reader should weigh four things:' },
    { bullets: [
      `**Falling provision cover.** Expected-credit-loss provisions were ₹838.90 cr on ₹56,790 cr of gross loans at Mar-2026 (1.48%) against ~2.8% a year earlier; the auditors note that ECL on new products is set from external bureau data because the company has no history of its own. Lower cover means lower reported credit cost today and less buffer tomorrow.`,
      `**Gains on selling loans.** Net gains on derecognition (assignment of loans to banks) were ₹${n0(F26.derecognitionGain)} cr in FY26, ${n0(eq)}% of pre-tax profit, and swing quarter to quarter (₹63 cr, ₹41 cr, ₹78 cr, ₹51 cr in recent quarters). Losses on selling bad loans to ARCs (₹${n0(F26.lossOnNpaSale)} cr) are in credit cost, as the company reports it.`,
      '**History of one-offs in both directions.** FY23-FY24 profits were lifted by provision write-backs on the Magma book (credit cost −₹134 cr and ₹72 cr); FY24\'s housing-sale gain was netted against ₹1,473 cr of legacy provisions and write-offs in one exceptional line; FY25 carried the ₹666 cr STPL clean-up. The trend in reported profit since FY23 says little about underlying earning power.',
      `**Write-offs are high relative to NPAs.** ₹975 cr written off (net of recoveries) in FY26, ~${n1(974.94 / fin.avgAum[i26] * 100)}% of average AUM, against gross NPA of only ₹818 cr at year-end: low NPA ratios partly reflect fast write-off, so credit cost is the better guide than GNPA.`,
    ] },
    { exhibit: { type: 'table', title: 'Tie-out: company vs Screener / our model (FY26, ₹ crore)', head: ['Line', 'Company (audited)', 'Screener / our model', 'Gap and why'], wide: [3], rows: [
      ['Revenue from operations', n0(F26.revenueOps), '{{fin.sales.11|num}}', 'Ties'],
      ['of which interest income', n0(F26.interestIncome), '{{fin.interestIncome.11|num}}', 'Ties'],
      ['of which fees & other operating income', n0(F26.revenueOps - F26.interestIncome), '{{fin.feeIncome.11|num}}', 'Fees & commission ₹420 cr + assignment gains ₹217 cr + rental and fair-value gains ₹13 cr'],
      ['Finance costs', n0(F26.financeCost), '{{fin.interest.11|num}}', 'Ties (incl. interest on leases)'],
      ['Operating expenses incl. depreciation', n0(F26.employeeCost + F26.otherExpenses + F26.depreciation), '{{fin.opex.11|num}}', 'Employee ₹1,018 cr + other ₹984 cr + depreciation ₹94 cr; rounding'],
      ['Credit cost (impairment + loss on NPA sales)', n0(F26.impairment + F26.lossOnNpaSale), '{{fin.provisions.11|num}}', 'Ties; Screener "Expenses" ₹3,210 cr = opex excl. depreciation ₹2,001 cr + credit cost ₹1,210 cr'],
      ['Profit before tax', n0(F26.pbt), '{{fin.pbt.11|num}}', 'Ties'],
      ['Net profit', n0(F26.pat), '{{fin.pat.11|num}}', 'Ties; no minority interest'],
    ], source: 'Annual Report FY26, consolidated statement of profit and loss and notes 34a/34b; Screener.in; GAM Research' } },
  ],
};

module.exports = { moat, guidance, earningsQuality };
