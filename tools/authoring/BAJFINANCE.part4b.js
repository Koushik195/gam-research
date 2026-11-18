// Bajaj Finance report, part 4b: competitive advantage scorecard, Q1FY27 and guidance, earnings quality.
const X = require('./BAJFINANCE.ctx');
const { C, F, A, fin, fi, n0, n1, pc, Q1, G27, P } = X;
const G26 = C.fy26Guidance;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in data, distribution and underwriting; absent in funding',
  blocks: [
    { p: 'A lender\'s moat shows up as a lasting gap between what it earns on loans and what it pays for funds, costs and losses. Bajaj Finance\'s ROA (4-5% on AUF for a decade, except Covid) is about double that of most Indian NBFCs and banks. We test where that edge comes from and whether it is durable.' },
    { verdicts: [
      ['Customer franchise and data', 'Advantage', '124 million customers, 79 million pre-qualified for cross-sell, 63% of business from existing customers; 97.7 million EMI cards in force.', 'Cheaper acquisition and better risk selection than any NBFC; banks have larger bases but use them less intensively.'],
      ['Point-of-sale distribution', 'Advantage', '~2.5 lakh active points of sale, 1.27 lakh consumer-durable stores; first lender most shoppers meet for EMI finance.', 'Hard to copy: built over 15+ years of merchant relationships.'],
      ['Underwriting and collections', 'Advantage', 'Credit cost ~1-1.5% of AUF in normal years (FY14-19, FY23-24) at 15-16% yields; thresholds set at 30-40% of industry delinquency.', 'Not immune: FY20-21 and FY25-26 spiked to 2-4%. An edge, not a shield.'],
      ['Operating cost and technology', 'Advantage', 'Cost-to-income ~33% while running 10 businesses; AI bots already originate ₹2,500 cr a quarter.', 'Peers are digitising too; the gap is in execution speed, not access to technology.'],
      ['Funding cost', 'Disadvantage', 'Cost of funds 7.4%; large banks fund a big share of their books with low-cost current and savings deposits, which NBFCs cannot take.', 'Banks win on price in secured loans (home, LAP); Bajaj must earn its spread in riskier loans.'],
      ['Regulatory position', 'Disadvantage', 'Upper-layer NBFC: 125% risk weights, product-level RBI actions (2023), draft ban on revolving credit (2026); no bank licence.', 'Rules can change the product set overnight; banks are exempt from the revolving-credit draft.'],
      ['Pricing power', 'Parity', 'Competes with PSU banks, private banks, NBFCs and fintechs "across every line of business" (MD).', 'Yields have fallen ~100bp since FY24 partly from mix, partly from competition.'],
    ], head: ['Source of advantage', 'Verdict', 'Evidence', 'Durability'], title: 'Moat scorecard', source: 'Company presentations and calls; GAM Research' },
    { callout: '**Honest verdict:** Bajaj Finance has a genuine, data-driven franchise moat: it knows more about more Indian borrowers than any other non-bank, and turns that into low-cost, low-loss lending at high yields. But the moat sits in the riskier half of retail credit, it is exposed to regulation in a way a bank\'s is not, and it does not extend to funding. It protects returns of ~20%, not returns that rise.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: "an excellent quarter across all key metrics", guidance held for one more quarter',
  blocks: [
    { p: `Q1FY27 (Apr-Jun 2026) was the cleanest quarter in two years: AUM +24% to ₹5,46,944 cr with a record ₹36,969 cr added, NII +23%, pre-provision profit +22%, loan losses +1% (−14% before the overlay), profit +28% to ₹6,081 cr, ROA 4.7% and ROE 20.4%. The MD called it "an excellent quarter ... I've used this word after a long time" but declined to raise guidance: "one solo doesn't make a summer, we'll wait for one more quarter". Weak spots: MSME +2%, opex to income up 30bp to 33.4% (gold and microfinance branch openings, ₹60 cr Labour Code cost), and a ₹296 cr precautionary provision for the monsoon and West Asia.` },
    { exhibit: { type: 'table', title: 'FY27 guidance vs Q1 and our forecast', head: ['Metric', 'FY27 guidance (29-Apr-2026)', 'Q1FY27 actual', 'GAM FY27E'], wide: [1], rows: [
      ['AUM growth', G27.aumGrowth, `${Q1.aumGrowth}% YoY`, '{{F.aumGrowth.0|pct}}'],
      ['NIM', G27.nim, '"steady"', `{{F.nim.0|pct}} (FY26 {{fin.nim.11|pct}})`],
      ['Non-interest income growth', G27.nonInterestIncomeGrowth, '+19%', `{{F.feeIncome.0|num}} cr (+${n1((F.feeIncome[0] / fin.feeIncome[fi('FY26')] - 1) * 100)}%)`],
      ['Opex to net total income', 'improve 25-40bp', '33.4% (+30bp YoY)', '{{F.costToIncome.0|pct}} (our basis; FY26 {{fin.costToIncome.11|pct}})'],
      ['Credit cost', G27.creditCost, '1.54% (1.31% before overlay)', '{{F.creditCost.0|n2}}% of avg AUM ≈ 1.53% of AUF'],
      ['ROA', G27.roa, '4.7%', '{{F.roaAum.0|pct}} on avg AUM'],
      ['ROE', G27.roe, '20.4%', '{{F.roe.0|pct}}'],
      ['New customers', G27.customers, '5.10 MM', '–'],
    ], source: 'Q4FY26 presentation p28; Q1FY27 presentation and call; GAM estimates' } },
    { exhibit: { type: 'table', title: 'Track record: FY26 guidance vs delivery (before one-offs)', head: ['Metric', 'Guided', 'Delivered', 'Verdict'], rows: [
      ['AUM growth', G26.aumGrowth, `${G26.aumActual}%`, 'Missed (MSME pruning)'], ['NIM', 'stable', 'marginally lower', 'Slight miss'], ['Fee and other income growth', G26.feeGrowth, `${G26.feeActual}%`, 'Beat'],
      ['Opex to NTI improvement', '40-50bp', '36bp', 'Slight miss'], ['Credit cost', G26.creditCost, `${G26.creditCostActual}%`, 'In range'], ['ROA', G26.roa, `${G26.roaActual}%`, 'Top of range'], ['ROE', G26.roe, `${G26.roeActual}%`, 'In range'],
    ], source: 'Q4FY26 presentation p27' } },
    { callout: '**Our read:** management guides conservatively on profit and returns, and less reliably on growth (FY26 AUM missed by 2-3pp). We are at the top end of FY27 AUM guidance and in the middle on credit cost, which puts our FY27E profit growth ({{F.patGrowth.0|pct}}) ahead of what the company would say, but in line with Q1\'s run-rate.' },
  ],
};

const earningsQuality = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean books, but provisions and presentation give management levers',
  blocks: [
    { p: 'We rate accounting **AMBER**. Joint auditors Price Waterhouse and Kirtane & Pandit gave an unmodified opinion on FY26, nothing we found suggests misstatement, and disclosure is among the best of any Indian lender (19-year history, stage-wise provisions by business, vintage curves). But four things deserve a reader\'s attention:' },
    { bullets: [
      '**Discretionary provisions.** ₹2,203 cr of overlays and accelerated provisions since Q4FY25 (₹359 cr, ₹1,406 cr, ₹142 cr, ₹296 cr). They are prudent, but they move profit between quarters at management\'s choice: Q3FY26 profit fell year on year because of them, and Q1FY27 would have been ~4% higher without one. Releases in a later year would flatter reported growth.',
      '**Presentation change (Q4FY26).** Recoveries of written-off loans (~₹800 cr in FY26) moved from income to loan losses for all periods. Profit is unchanged, but credit cost and cost-to-income now read lower and higher respectively than before, so old and new ratios are not comparable. Screener\'s history mixes the two bases (FY24 and earlier old, FY25-26 new); we show both where it matters.',
      '**Gains on selling subsidiary shares go to equity, not profit.** Selling BHFL shares adds to consolidated book value (≈₹4,300 cr in FY25 and ≈₹1,300 cr in FY26 by our reconciliation of equity) but never shows in consolidated profit; the standalone accounts book it as an exceptional gain (₹2,544 cr FY25, ₹1,166 cr FY26), which also funded a ₹0.60 special dividend.',
      '**One-offs in both directions.** FY25 had a ₹348 cr tax benefit from court orders; FY26 a ₹265 cr Labour Code charge. Small (1-2% of profit), but reported growth in each year is distorted.',
    ] },
    { exhibit: { type: 'table', title: 'Tie-out: Screener vs company (FY26, ₹ crore)', head: ['Line', 'Company', 'Screener / our model', 'Gap and why'], wide: [3], rows: [
      ['Total income', '81,990', '{{fin.sales.11|num}}', 'Rounding'],
      ['Interest expense', '28,666', '{{fin.interest.11|num}}', '~₹230 cr classification difference (most likely interest on leases, which the company shows in opex)'],
      ['Net interest income', '44,110', '{{fin.nii.11|num}}', 'Same lease-interest gap'],
      ['Operating expenses (incl. depreciation)', '17,776', '{{fin.opex.11|num}}', 'Mirror image of the interest gap'],
      ['Loan losses and provisions', '9,482', '{{fin.provisions.11|num}}', 'Same'],
      ['Profit before tax', '25,817', '{{fin.pbt.11|num}}', 'Ties (after ₹265 cr exceptional and ₹16 cr associates)'],
      ['Net profit (before minorities)', '19,332', '{{fin.pat.11|num}}', 'Ties; attributable ₹19,017 cr'],
    ], source: 'Q1FY27 presentation p37; Screener.in; GAM Research' } },
  ],
};

module.exports = { moat, guidance, earningsQuality };
