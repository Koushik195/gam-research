// Shriram Finance report, part 4b: competitive advantage scorecard, Q1FY27 and guidance, earnings quality.
const X = require('./SHRIRAMFIN.ctx');
const { C, F, A, fin, fi, n0, n1, n2, pc, Q1, G27, P } = X;
const G26 = C.fy26Guidance, F26 = C.fy26;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in used-vehicle lending and rural reach; not in funding, cost or the newer products',
  blocks: [
    { p: 'A lender\'s moat shows up as a lasting gap between what it earns and what it pays for money, staff and bad debts, through a cycle. Shriram has kept ROA at ~3.5% of AUM since the merger with yields of ~16.5% and losses of ~2%, in a segment where many lenders have failed. We test where that comes from and how durable it is.' },
    { verdicts: [
      ['Used-vehicle underwriting and valuation', 'Advantage', 'Forty-seven years of pricing old trucks; in-house valuers; the associate Shriram Automall runs 131 auction yards and has served 2.85 mn customers, which gives price data and a resale channel.', 'Hard to copy: it is local knowledge built one district at a time.'],
      ['Rural and semi-urban reach', 'Advantage', '3,225 branches, 2,042 in places under one lakh people, holding 59% of AUM; ~1 crore customers.', 'Banks are expanding rurally, but rarely into used-vehicle lending.'],
      ['Collections through the cycle', 'Advantage', 'Credit cost ~2.2% (FY24-FY25) and ~1.9% (FY26-Q1FY27) of AUM at ~16.5% yields; ~3% at the Covid peak (FY21-FY22) with profit intact.', 'An edge, not immunity: Stage 3 has not fallen below ~4.5%.'],
      ['Funding cost', 'Parity (improving)', 'AAA since Apr-2026, deposits 31% of borrowings, MUFG as a 20% holder; but cost of liabilities 8.56% vs a large bank\'s low-cost current and savings deposits.', 'The gap to banks narrows; it does not close.'],
      ['Operating cost', 'Disadvantage', 'Opex ~2.8% of AUM and cost-to-income ~28-30% before the MUFG money: the field model is labour-intensive (78,902 staff).', 'The price of the moat above; digital tools trim it only slowly.'],
      ['New vehicles, MSME, gold, personal loans', 'Disadvantage', 'Competes with banks, captives and specialist NBFCs; Stage 3 rising in MSME (5.2%), gold (2.6%) and personal loans (4.4%).', 'Growth here is bought with price or risk.'],
    ], head: ['Source of advantage', 'Verdict', 'Evidence', 'Durability'], title: 'Moat scorecard', source: 'Company investor updates and calls; GAM Research' },
    { callout: '**Honest verdict:** Shriram has a genuine moat in its core business, lending against used commercial vehicles to small operators: nobody else combines the valuation know-how, the auction network and the rural branch reach at its scale. That moat earns a ~3.5% ROA, not a 5% one, because the model is labour-intensive and the borrowers are risky. The newer businesses from the merger and the push into new vehicles do not carry the same advantage; they add growth at lower returns.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: profit +60% on the new capital; guidance held until the monsoon is clear',
  blocks: [
    { p: `Q1FY27 (Apr-Jun 2026) was flattered by the new equity but solid underneath: AUM +15.3% to ₹${n0(Q1.aum)} cr, disbursements +19.5% to ₹${n0(Q1.disbursements)} cr, NII +33.7% to ₹${n0(Q1.nii)} cr (of which ~₹500 cr from the MUFG money), cost-to-income 25.5% (29.3% a year ago), credit cost 1.66% of total assets (flat), profit +59.8% to ₹${n0(Q1.pat)} cr and EPS +29% to ₹${Q1.eps} (the share count rose 25%). ROE fell to 12.8% on the enlarged equity. Weak spots: Stage 3 up to ${Q1.gnpa}%, Stage 2 up in construction equipment, and staff costs +17%. Management kept its ~18% AUM guidance but would "wait for another quarter because the net impact of the deficit in monsoon is a little less known".` },
    { exhibit: { type: 'table', title: 'FY27 guidance vs Q1 and our forecast', head: ['Metric', 'FY27 guidance', 'Q1FY27 actual', 'GAM FY27E'], wide: [1], rows: [
      ['AUM growth', G27.aumGrowth, `${Q1.aumGrowth}% YoY (${Q1.aumQoq}% QoQ)`, '{{F.aumGrowth.0|pct}}'],
      ['NIM', G27.nim, `${Q1.nim}% (company basis)`, '{{F.nim.0|pct}} on average AUM (FY26 {{fin.nim.11|pct}})'],
      ['Cost-to-income', G27.costToIncome, `${Q1.costToIncome}%`, '{{F.costToIncome.0|pct}} (our basis; FY26 {{fin.costToIncome.11|pct}})'],
      ['Credit cost', G27.creditCost, `${Q1.creditCost}% of total assets`, '{{F.creditCost.0|n2}}% of average AUM (≈1.7% of total assets)'],
      ['Branches', G27.branches, '3,225 (unchanged)', '–'],
      ['ROE', 'not guided', `${Q1.roe}% (on closing equity)`, `{{F.roe.0|pct}} engine basis; ${n1(X.roeTw27)}% time-weighted`],
    ], source: 'Q4FY26 call (24-Apr-2026); Q1FY27 investor update and call (24-Jul-2026); GAM estimates' } },
    { exhibit: { type: 'table', title: 'Track record: FY26 guidance vs delivery', head: ['Metric', 'Guided', 'Delivered', 'Verdict'], rows: [
      ['AUM growth', G26.aumGrowth, `${G26.aumActual}%`, 'In line'], ['NIM', G26.nim, `${G26.nimActual}%`, 'Slightly below budget'],
      ['Credit cost', G26.creditCost, `${G26.creditCostActual}% of total assets`, 'Better'], ['Cost-to-income', G26.costToIncome, `${G26.costToIncomeActual}%`, 'Slightly worse'],
    ], source: 'Q4FY26 call (analyst recalling the start-of-year 15%); Q4FY26 investor update p26; FY26 annual report p8-9' } },
    { callout: '**Our read:** management guides conservatively on credit cost and NIM and roughly accurately on growth (FY26: 15% guided, 14.85% delivered). We are a notch below growth guidance, roughly at Q1\'s NIM for the year and slightly above Q1\'s credit cost. That puts our FY27E profit at ₹{{F.pat.0|num}} cr: ~₹' + n0((F.pat[0] - Q1.pat) / 3) + ' cr a quarter for the rest of the year, ' + pc(((F.pat[0] - Q1.pat) / 3 / Q1.pat - 1) * 100) + ' above Q1, as AUM grows ~4% a quarter.' },
  ],
};

const earningsQuality = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean and well provided, with a few one-offs to strip out',
  blocks: [
    { p: 'We rate accounting **GREEN**. Joint auditors (M M Nissim & Co and G. D. Apte & Co.) gave unmodified reports; provisions are ~6% of loans; disclosure by product and stage is detailed. Five items deserve attention when reading the numbers:' },
    { bullets: [
      `**FY25's housing-finance gain.** The sale of Shriram Housing Finance added ₹1,657 cr pre-tax (₹1,489 cr after tax, standalone) in Q3FY25. Reported FY25 EPS was ₹51.92 against ₹44.00 before it; FY26's +2% reported growth was +21% underneath. We use the clean figure in the P/E history.`,
      '**Labour Code charge in FY26.** Employee costs include ₹197 cr (₹132 cr gratuity, ₹65 cr leave) from the new definition of wages, most likely booked in Q3FY26 (staff cost ₹1,237 cr that quarter, vs ~₹950 cr in the others). A one-off that depressed FY26 by ~1.5% of profit.',
      '**A change in estimate that flatters opex.** From Jan-2026, dealer commissions on two-wheeler loans are spread over the loan life instead of being expensed upfront: fee and commission expenses were ₹51.5 cr lower in Q4FY26 alone.',
      '**Temporary income on surplus cash.** Q1FY27 included ₹185 cr of gains on liquid funds holding unused MUFG money; it fades as the cash is lent out.',
      '**Screener\'s FY25 figures do not match the audited accounts.** Its FY25 revenue (₹43,941 cr) appears to include the sold housing business; we replace it with the audited ₹41,834 cr (continuing operations), keeping profit unchanged.',
    ] },
    { exhibit: { type: 'table', title: 'Tie-out: Screener vs company (FY26, consolidated, ₹ crore)', head: ['Line', 'Company (audited)', 'Screener / our model', 'Gap and why'], wide: [3], rows: [
      ['Revenue from operations', n0(F26.revenueFromOps), '{{fin.sales.11|num}}', 'Rounding'],
      ['  of which interest income', n0(F26.interestIncome), n0(fin.sales[fi('FY26')] - fin.feeIncome[fi('FY26')]), 'Revenue less fees and other operating income (₹1,475 cr)'],
      ['Interest expense (finance costs)', n0(F26.financeCost), '{{fin.interest.11|num}}', 'Screener moves ~₹65 cr (likely interest on leases) from other expenses into interest'],
      ['Net interest income', n0(F26.interestIncome - F26.financeCost), '{{fin.nii.11|num}}', 'Same ₹65 cr; standalone NII ₹26,051 cr'],
      ['Operating expenses incl. depreciation and fee expenses', n0(F26.feeCommExp + F26.employee + F26.otherExp + F26.dep), '{{fin.opex.11|num}}', 'Mirror image of the interest gap'],
      ['Impairment (provisions)', n0(F26.impairment), '{{fin.provisions.11|num}}', 'Ties'],
      ['Profit before tax', n0(F26.pbt), '{{fin.pbt.11|num}}', 'Ties (incl. ₹60 cr other income)'],
      ['Net profit', n0(F26.pat), '{{fin.pat.11|num}}', 'Ties (incl. ₹20.5 cr associate share); no minorities'],
    ], source: 'Q4FY26 audited consolidated results p29-31 (24-Apr-2026); Screener.in; GAM Research' } },
  ],
};

module.exports = { moat, guidance, earningsQuality };
