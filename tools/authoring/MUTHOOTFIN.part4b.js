// Muthoot Finance report, part 4b: competitive advantage scorecard, Q1FY27 and guidance, earnings quality.
const X = require('./MUTHOOTFIN.ctx');
const { C, F, A, fin, fi, n0, n1, pc, Q1, G } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in trust, reach and operations; absent in funding',
  blocks: [
    { p: 'A lender\'s moat shows up as a lasting gap between what it earns on loans and what it pays for money, costs and losses. Muthoot\'s standalone ROA has been 5.7-7.6% of loans every year since FY22, two to three times a typical Indian NBFC. We test where that edge comes from and whether new competitors can copy it.' },
    { verdicts: [
      ['Brand and trust', 'Advantage', '"India\'s most trusted financial services brand" ten years running (TRA); customers hand over family jewellery; 87 years in gold lending.', 'Hard to copy quickly: trust is the product when the collateral is a family heirloom.'],
      ['Branch reach and operations', 'Advantage', '5,029 branches (7,654 group); ~2 lakh customers a day; in-house valuation, vaulting, audit and auctions; cost-to-income ~24-26%.', 'New entrants can open branches, but building trained staff and secure operations takes years (MD: "operationally intensive").'],
      ['Underwriting and collections', 'Advantage', 'Write-offs 0.14% of loans in FY26; auctions realised more than dues; Stage 3 dues ~58% of gold value.', 'The collateral does most of the work; the skill is in valuation and fraud control.'],
      ['Customer base and data', 'Parity', '6.58 million active customers, but flat for a year; small tickets leaving, large tickets growing.', 'Large tickets are exactly the customers banks and fintechs target.'],
      ['Funding cost', 'Disadvantage', 'AA+ rated; cost of borrowing ~8.75% vs ~7.4% at Bajaj Finance and lower still at banks.', 'Competitors can undercut on rate and still earn a return.'],
      ['Pricing power', 'Weakening', 'Yield 20.8% → 17.9% in one quarter; "determined effort to bring down the yield"; rate war "quite possible".', 'The FY26 pricing power was a gold-price windfall, not a structural gain.'],
      ['Regulatory position', 'Parity', 'Upper-layer NBFC; new gold-loan directions apply equally to banks and NBFCs.', 'Rules now level the field rather than favour banks; they also raise the bar for weaker lenders.'],
    ], head: ['Source of advantage', 'Verdict', 'Evidence', 'Durability'], title: 'Moat scorecard', source: 'Company presentations and calls; Annual Report FY2025-26; Motilal Oswal (2-Aug-2026); GAM Research' },
    { callout: '**Honest verdict:** Muthoot has a genuine operating moat: trust, reach and a process for handling gold at scale that took decades to build. That moat protects its volumes and its losses. It does not protect its price. When better-funded lenders decide gold loans are worth fighting for, as they did in FY23 and again now, Muthoot keeps its customers by cutting rates. The moat supports a 20%+ ROE, not a 30% one.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: growth held up, the yield did not; guidance "to be revised" after Q2',
  blocks: [
    { p: `Q1FY27 (Apr-Jun 2026) split the market. Growth was strong: consolidated AUM +43% to ₹1,91,532 cr (+5.3% in the quarter, despite a 3.7% fall in Muthoot's gold rate), customers +2.6% after two quarters of decline, credit losses 0.05%. But profit of ₹2,825 cr was 17% below Q4FY26 and the standalone yield fell from 20.76% to 17.93% as one-off income ended, some rates were cut and customers rolled over into lower-rate schemes before the new rules. Several brokers had expected a ~130bp fall (CLSA). The stock fell as much as 14% intraday on 3-Aug-2026, from ₹3,119.6.` },
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (consolidated unless stated)', head: ['Metric', 'Q1FY27', 'Q4FY26', 'Q1FY26', 'Comment'], wide: [4], rows: [
      ['AUM (₹ cr)', '1,91,532', '1,81,917', '1,33,938', '+5.3% QoQ, +43% YoY'],
      ['Interest income (₹ cr)', '8,557', '9,009', '6,288', '−5% QoQ: yield reset'],
      ['Finance cost (₹ cr)', '3,458', '3,155', '2,355', '+10% QoQ: borrowings +8%'],
      ['Impairment (₹ cr)', '121', '268', '311', 'Belstar recovery'],
      ['Net profit (₹ cr)', '2,825', '3,398', '1,974', '−17% QoQ, +43% YoY'],
      ['Standalone yield / NIM (%)', '17.93 / 10.41', '20.76 / 13.38', '19.56 / 12.15', 'Steady-state guide 18-18.5% yield'],
      ['Standalone Stage 2 / Stage 3 (₹ cr)', '1,876 / 3,927', '1,062 / 3,824', '1,056 / 3,095', 'Stage 2 +77% QoQ'],
      ['Standalone ROA / ROE (%)', '6.09 / 26.6', '7.95 / –', '7.16 / –', 'ROA on average loans'],
    ], source: 'Q1FY27 presentation p18-38; Q4FY26 presentation; Screener.in' } },
    { exhibit: { type: 'table', title: 'Guidance and our forecast', head: ['Item', 'Management (May / Aug 2026)', 'GAM FY27E'], wide: [1], rows: [
      ['AUM growth', G.aumGrowthFy27, '{{F.aumGrowth.0|pct}} (group)'],
      ['Yield', G.yieldSteadyState + ' "steady state"; "determined effort to bring down the yield"', '18.1% consolidated (≈17.7% standalone)'],
      ['Cost of borrowing', G.costOfBorrowing, '{{F.costOfFunds.0|pct}} (our basis)'],
      ['Branches', G.branchesFy27, 'Opex {{F.opexPct.0|pct}} of AUM'],
      ['Profit', G.profit, 'PAT {{F.pat.0|num}} cr ({{F.patGrowth.0|pct}})'],
    ], source: 'Q4FY26 call (14-May-2026); Q1FY27 call (1-Aug-2026); GAM estimates' } },
    { exhibit: { type: 'table', title: 'Track record: "15% in the first quarter, every year"', head: ['Year', 'Opening guidance', 'Standalone AUM growth delivered', 'Gold price (Muthoot rate, March to March)'], rows: [
      ['FY23', '15%', '+9%', '+16%'], ['FY24', '15%', '+20%', '+13%'], ['FY25', '15%', '+43%', '+33%'], ['FY26', '15%', '+50%', '+65%'],
    ], source: 'Q4FY26 call ("last 10 years, we have been giving 15% guidance in the first quarter"); company presentations; GAM Research' } },
    { callout: '**Our read:** management\'s growth guidance is a placeholder; delivery has tracked the gold price (FY23 missed, FY25-26 beat by miles). It gives no profit or margin guidance and was evasive on the yield of new loans. We forecast FY27E profit growth of {{F.patGrowth.0|pct}}: below the 43% of Q1 year on year, above the street\'s ~5%, because the book is still growing ~5% a quarter at an ~18% yield.' },
  ],
};

const earningsQuality = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean books, lumpy income and thin disclosure on yields',
  blocks: [
    { p: 'We rate accounting **AMBER**. The joint auditors (Krishnamoorthy & Krishnamoorthy and PSDY & Associates) reported no qualification on FY26, the company holds ₹295 cr of provisions above its expected-loss model, and Muthoot discloses tonnes, gold price and margin of safety every quarter, which few lenders would. But four things deserve a reader\'s attention:' },
    { bullets: [
      '**Lumpy, undisclosed one-offs in interest income.** FY26 included ~₹500 cr of interest written back on recovered bad loans (Q3, per an analyst on the Q4 call), ~₹85 cr of auction and ARC income in Q4 and top-up charges. Management will not split clean and one-off yield ("we don\'t have any bifurcation"), so the quality of any quarter\'s margin is hard to judge.',
      '**Accrued interest on bullet loans.** Interest on a 12-month bullet loan is booked as it accrues but collected at maturity, so profit runs ahead of cash. The new RBI rules (interest counted in LTV; renewal only after paying interest) reduce this; Stage 2 rose as customers adjusted.',
      '**Classification changes.** From Mar-2026 NPAs are classified borrower-wise at the RBI\'s advice, so Stage 3 history is not like-for-like (1.58% Dec-25 → 2.35% Mar-26). FY25 impairment was restated from ₹1,635 cr to ₹1,576 cr in the FY26 accounts.',
      '**Related parties.** The parent lends ₹3,890 cr to Muthoot Money; some branch and office premises were acquired from or are linked to promoter-family members (AR title-deed schedule); seven family members draw executive pay (see governance).',
    ] },
    { exhibit: { type: 'table', title: 'Tie-out: Screener vs company (FY26, ₹ crore)', head: ['Line', 'Company', 'Screener / our model', 'Gap and why'], wide: [3], rows: [
      ['Total income (excl. non-operating other income)', '31,209', '{{fin.sales.11|num}}', 'Ties: interest income 30,371 + fees & other operating income 838'],
      ['Interest expense', '11,000', '{{fin.interest.11|num}}', '~₹55 cr classification difference (Screener moves part of other expenses into finance cost)'],
      ['Net interest income', '19,371', '{{fin.nii.11|num}}', 'Same gap'],
      ['Operating expenses (incl. depreciation)', '4,933', '{{fin.opex.11|num}}', 'Mirror image of the interest gap'],
      ['Impairment (provisions)', '1,026', '{{fin.provisions.11|num}}', 'Ties'],
      ['Profit before tax', '14,305', '{{fin.pbt.11|num}}', 'Ties (incl. ₹54 cr non-operating other income)'],
      ['Net profit (before minorities)', '10,607', '{{fin.pat.11|num}}', 'Ties; attributable ₹10,590 cr'],
    ], source: 'Q4FY26 presentation p24 (₹ Mn ÷ 10); Screener.in; GAM Research' } },
  ],
};

module.exports = { moat, guidance, earningsQuality };
