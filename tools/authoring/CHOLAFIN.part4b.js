// Cholamandalam report, part 4b: competitive advantage scorecard, Q1FY27 and guidance, earnings quality.
const X = require('./CHOLAFIN.ctx');
const { C, F, A, fin, fi, n0, n1, pc, Q1, G27, G26, P, insCom, insPctPbt } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a narrow moat in small-town distribution and collections, none in funding',
  blocks: [
    { p: 'A lender\'s moat shows up as a lasting gap between what it earns on loans and what it pays for money, costs and losses. Chola has earned a 2.2-2.9% ROA on assets and a 17-21% ROE in every year since FY19 except the Covid year, with leverage doing much of the work. We test where its edge comes from.' },
    { verdicts: [
      ['Small-town distribution', 'Advantage', '1,820 branches, 87% in tier 3-6 towns; seven products sold from vehicle-finance branches; 5.2 million customers.', 'Hard to copy quickly: built over decades; new businesses ride it at low cost.'],
      ['Vehicle-finance underwriting and collections', 'Advantage', '30,000 collection staff; credit cost ~1-2% through cycles in a segment of small transport operators; Covid peak 2.0% of assets.', 'An edge, not a shield: FY25-26 losses rose with the cycle.'],
      ['Group name and trust', 'Advantage', 'Murugappa brand; in gold loans "we are riding on the trust that customers have on Chola" (business head).', 'Helps new products launch (gold: ₹2,143 cr in a year).'],
      ['Mortgage niche (LAP, affordable housing)', 'Advantage', 'Pre-tax ROA 3.9-4.7% with losses of 0.3-1.0%; SARFAESI enforcement on larger loans.', 'Banks are price-setters in prime mortgages; Chola\'s edge is reach, not price.'],
      ['Funding cost', 'Disadvantage', 'AA+ (not AAA), no deposits, ~50% bank-funded; cost of funds {{fin.costOfFunds.11|pct}} in FY26.', 'Banks and AAA NBFCs can undercut Chola in safer segments.'],
      ['Cost efficiency', 'Parity', 'Cost-to-income ~39-40%, up from 32% in FY21 as new businesses and gold branches were added.', 'No operating leverage yet; management says another year.'],
      ['Unsecured lending (CSEL)', 'Disadvantage', 'Fintech-sourced loans went bad (6.3% losses in FY26); channel shut.', 'Chola has no data edge over banks and Bajaj Finance in unsecured retail.'],
    ], head: ['Source of advantage', 'Verdict', 'Evidence', 'Durability'], title: 'Moat scorecard', source: 'Company presentations and calls; Screener.in; GAM Research' },
    { callout: '**Honest verdict:** Chola has a narrow but real moat: it reaches and collects from small-town borrowers that banks cannot serve profitably, and it has repeated that model across vehicles, property and now gold. It does not have a cost-of-funds advantage, its unsecured experiment showed limits, and its ROE depends on running ~7-8x leverage on secured loans. That is a franchise that protects ~19-20% returns in normal years, not one that keeps them high through a severe credit cycle.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: profit +46%, guidance reaffirmed, asset quality mixed',
  blocks: [
    { p: `Q1FY27 (Apr-Jun 2026) was Chola's best quarter on returns in two years: disbursements +22% to ₹29,612 cr, business AUM +22%, net income margin 8.2% of assets (+42bp), loan losses 1.5% (from 1.8%), pre-tax ROTA 3.7% and ROE 21.2%; profit rose 46% to ₹1,654 cr (standalone). Management reaffirmed 20-23% AUM growth ("23% we have already achieved, I think it is doable"), said July was better still, and expects credit cost to improve from 1.5%. The weak spots: Stage 3 up 24bp in the quarter to ${Q1.stage3}% (seasonal, says management; "worse than vehicle-finance peers", says Emkay), opex up 23% with gold-branch openings, and disbursements in mortgages flattered down by a one-time change in when loans are counted.` },
    { exhibit: { type: 'table', title: 'FY27 guidance vs Q1 and our forecast', head: ['Metric', 'FY27 guidance (4-May-2026, reaffirmed 28-Jul)', 'Q1FY27 actual', 'GAM FY27E'], wide: [1], rows: [
      ['AUM growth', G27.aumGrowth, `${Q1.aumGrowth}% YoY`, '{{F.aumGrowth.0|pct}}'],
      ['NIM', G27.nim, '8.2% of assets', '{{F.nim.0|pct}} of AUM (FY26 {{fin.nim.11|pct}})'],
      ['Opex', G27.opex, '3.0% of assets', '{{F.opexPct.0|pct}} of AUM (FY26 {{fin.opexPct.11|pct}})'],
      ['Credit cost', G27.creditCost, '1.5% of assets', '{{F.creditCost.0|n2}}% of AUM (≈1.4-1.5% of assets)'],
      ['Pre-tax ROTA', G27.rota, '3.7%', '{{F.roaAum.0|pct}} post-tax ROA on AUM; ROE {{F.roe.0|pct}}'],
      ['Gold loans', G27.gold, '₹2,143 cr; 171 branches', '₹5,000 cr in our build'],
    ], source: 'Q4FY26 call (4-May-2026); Q1FY27 presentation and call (28-Jul-2026); GAM estimates' } },
    { exhibit: { type: 'table', title: 'Track record: FY26 guidance vs delivery', head: ['Metric', 'Guided (Apr/May-2025)', 'Delivered', 'Verdict'], rows: [
      ['AUM growth', G26.aumGrowth, `${G26.aumActual}%`, 'In range (lower half)'], ['Vehicle-finance AUM', G26.vfAum, `${G26.vfActual}%`, 'Slight miss'], ['Non-vehicle AUM', G26.nonVfAum, `${G26.nonVfActual}%`, 'Miss'],
      ['Credit cost', G26.creditCost, G26.creditCostActual, 'Clear miss'],
    ], source: 'Q4FY25 call (May-2025); Q1FY27 presentation p10, p13, p18' } },
    { callout: '**Our read:** Chola guides growth well and credit cost optimistically. FY26 growth landed in range; credit cost missed by 30-40bp. That is why we take the FY27 credit-cost guidance at face value but do not bank the further fall management hopes for, and why our FY27E profit growth ({{F.patGrowth.0|pct}}) sits a little below the run-rate a straight extrapolation of Q1 would give.' },
  ],
};

const earningsQuality = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean audits, but insurance commission, related parties and recoveries need watching',
  blocks: [
    { p: 'We rate accounting **AMBER**. Joint auditors KKC & Associates and B.K. Khare & Co gave an unmodified opinion on FY26 (key audit matters: expected credit loss and IT controls), and disclosure is good (segment P&Ls, stage-wise provisions by product). Five things deserve attention:' },
    { bullets: [
      `**Insurance commission and related parties.** Insurance agency commission was ₹${n0(insCom)} cr in FY26, ${n1(insPctPbt)}% of PBT. Borrower accident and hospital covers are placed with group insurer Chola MS General Insurance. In Dec-2025 the portal Cobrapost alleged ₹10,262 cr of related-party routing and ₹25,000 cr of cash deposits; Chola called this "malicious and baseless" (cash comes from small transport operators' EMIs) and said all related-party transactions are disclosed. We found no regulatory action by 30-Sep-2026, but IRDAI's proposed commission caps now put this income line in play.`,
      '**Recoveries sit outside credit cost.** Recoveries of loans written off earlier (₹415 cr in FY26, ₹254 cr in FY25) are booked as other income, not netted against loan losses. Net of them, FY26 credit cost would be ~0.2pp lower; reported credit cost is therefore conservative, but profit leans on recoveries more than the credit-cost line suggests.',
      '**Provisioning discretion.** The ₹200 cr overlay (Q4FY26) and the once-a-year reset of default and loss-given-default assumptions (moved from the March to the December quarter) give management room to smooth profit. Releasing the overlay would add ~2% to FY27 profit.',
      '**Lumpy gains and a recognition change.** Gains on assigning loans were ₹439 cr in FY26 (₹159 cr in FY25), 6% of PBT. From Q1FY27 disbursements are counted only when the cheque clears, which cut reported disbursements and lifts yields slightly. ARC sales in SBPL move Stage 3 between quarters, and ARC receipts in home loans are booked as income while the matching losses run through credit cost.',
      '**Two NPA numbers.** Ind AS Stage 3 (3.29%) and the RBI\'s stricter NPA (4.50%) differ by ~1.2pp; investors comparing Chola with peers should use the same measure.',
    ] },
    { exhibit: { type: 'table', title: 'Tie-out: annual report vs Screener / our model (FY26, ₹ crore, consolidated)', head: ['Line', 'Annual report', 'Screener / model', 'Gap and why'], wide: [3], rows: [
      ['Revenue from operations', '31,073', '{{fin.sales.11|num}}', 'Screener adds interest on tax refunds (₹44 cr) to revenue'],
      ['Fees & other operating income', '2,670', '{{fin.feeIncome.11|num}}', 'Ties (revenue less interest income)'],
      ['Interest income', '28,403', '{{fin.interestIncome.11|num}}', 'Same ₹44 cr'],
      ['Finance costs', '14,384', '{{fin.interest.11|num}}', 'Ties'],
      ['Operating expenses (incl. depreciation)', '6,645', '{{fin.opex.11|num}}', 'Screener expenses ₹8 cr lower'],
      ['Impairment (loan losses)', '3,536', '{{fin.provisions.11|num}}', 'Ties (incl. ₹200 cr overlay)'],
      ['Other income', '466', '412', 'Tax-refund interest moved to revenue; ₹7 cr exceptional netted'],
      ['Profit before tax', '6,973', '{{fin.pbt.11|num}}', 'Ties'],
      ['Net profit', '5,233', '{{fin.pat.11|num}}', 'Ties (no minority interest)'],
    ], source: 'Annual Report FY26 (consolidated P&L, notes 28-33); Screener.in; GAM Research' } },
  ],
};

module.exports = { moat, guidance, earningsQuality };
