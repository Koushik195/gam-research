// HDB Financial Services report, part 4b: HDFC Bank, the BPO business and bank-group regulation (the central
// question), competitive advantage scorecard. Q1FY27/guidance and earnings quality are in part4c.
const X = require('./HDBFS.ctx');
const { C, D, F, n0, n1, n2, pc, price, shares, Q1, F26, A, b } = X;
const RP = C.relatedParty, BP = C.bpo, OW = D.ownership;
const bpoShare = F26.bpoPbt / F26.pbt * 100;
const bpoEps = F26.bpoPbt * (1 - 0.252) / shares;

const parent = {
  id: 'parent', nav: 'HDFC Bank, BPO & regulation', kicker: 'The central question', title: 'HDFC Bank: a parent that lends its name and funding, sits in the same markets, and is bound by bank-group rules',
  blocks: [
    { p: `HDFC Bank owns ${OW.promoter}% of HDB (about 61.5 cr shares). Unlike Bajaj Finance at Bajaj Housing Finance, it does not have to sell: the public already holds 25.9%, above the 25% minimum. The investor lock-ins have expired (the last big one on 2-Jan-2026, 48 cr shares); HDFC Bank's own minimum-contribution lock-in normally runs 18 months from the IPO (we could not confirm its date), and it has said nothing about selling more. So the overhang question is not supply; it is what HDFC Bank wants HDB to be.` },
    { exhibit: { type: 'table', title: 'What HDB gets from HDFC Bank, and what it gives (FY26)', head: ['Item', 'Value', 'What it means'], wide: [2], rows: [
      ['BPO revenue from HDFC Bank (sales support, back office, collections)', `₹${n0(RP.bpoFromHdfcBank.total)} cr`, `${n1(F26.bpoRevenue / F26.revenue * 100)}% of revenue but only ₹${n0(F26.bpoPbt)} cr of profit (${n1(bpoShare)}% of PBT, ~₹${n1(bpoEps)} a share)`],
      ['Term loans from HDFC Bank (outstanding, Mar-26)', `₹${n0(RP.hdfcBankTermLoanOutstanding)} cr`, `~9% of borrowings; interest paid to HDFC Bank ₹${n0(RP.interestPaidToHdfcBank)} cr`],
      ['AAA rating and the HDFC name', 'CRISIL AAA, CARE AAA', 'Cost of borrowings 6.93% (Q1FY27): near-bank funding for a high-yield book'],
      ['Corporate logo licence fee paid to HDFC Bank', `₹${n1(RP.brandLicenceFeePaid)} cr`, 'Small (1% of PBT); rose 19% in FY26'],
      ['Insurance commission from HDFC Life and HDFC Ergo', `₹${n1(RP.insuranceCommissionHdfcLife + RP.insuranceCommissionHdfcErgo)} cr`, 'Part of ₹455 cr total insurance commission (now exposed to IRDAI\'s proposal)'],
      ['Related-party limit approved for FY27 (postal ballot, Feb-2026)', `₹${n0(RP.fy27RptApprovalCr)} cr`, 'Aggregate cap for loans and overdrafts, fixed deposits, current accounts, loan assignments, debt issues, BPO services and other dealings with HDFC Bank'],
    ], source: 'Annual Report FY2025-26 note 38; postal ballot notice (Feb-2026); Q1FY27 presentation' } },
    { p: `**The regulation that nearly changed everything.** In Oct-2024 the RBI proposed that only one entity in a bank group could run a given business and that there be "no overlap" in lending between a bank and its group companies. HDFC Bank and HDB overlap in car, two-wheeler, personal and business loans, so the draft raised the prospect of HDB being merged, shrunk or reshaped, and it hung over the IPO. On 1-Oct-2025 the Governor said the restriction was being removed; the final directions (28-Nov and 5-Dec-2025) keep "one entity per business" only "as a principle" and allow overlap where the bank's board records a rationale such as segmentation. What remains: HDB is treated as an upper-layer NBFC and must follow bank-style limits on certain loans (against the parent's shares, to its directors, for land, IPO and ESOP funding), and HDFC Bank needs RBI approval to put more equity in. None of these touch HDB's core products.` },
    { p: `**The BPO business: small, shrinking and dependent.** BPO revenue halved between FY23 and FY25 (₹${n0(BP.revenue.FY23)} cr → ₹${n0(BP.revenue.FY25)} cr) and has been flat since; profit is ₹${n0(BP.pbt.FY26)} cr. The annual reports do not say why it shrank. It employs roughly a quarter of HDB's staff for ~2% of its profit. If HDFC Bank took the work in-house, HDB would lose ~₹${n1(bpoEps)} of EPS (~${n0(bpoShare)}%): a nuisance, not a thesis. We forecast BPO revenue +3% a year and a ₹100-110 cr margin, explicitly and separately from lending.` },
    { callout: `**Our view:** on balance the parent is a clear positive: it gives HDB a funding cost and a brand no stand-alone lender to these customers has. The costs are subtler. HDFC Bank decides which customers and products it keeps for itself, HDB's growth plans have to fit the group's, and the minority shareholder has no say in either. We see no sign that HDFC Bank wants to sell or shrink HDB, and the regulatory risk that dominated the IPO is gone. We do not put a holding-company or "parent" discount on the stock; we do not put a premium on it either.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: reach and funding are real; underwriting is only as good as the cycle',
  blocks: [
    { p: 'A lender\'s moat shows up as returns that stay above its cost of capital through a cycle. HDB\'s ROE has been 4.8-19.5% over FY21-FY26 (median ~14%) against our 13.1% cost of equity: above it in most years, below it in the bad ones. We test where its edge comes from.' },
    { verdicts: [
      ['Reach into small towns', 'Advantage', '1,710 branches in 1,165 towns, 71% in tier-4 towns or smaller; 160,000+ dealer and retail touchpoints; 23.9 mn customers.', 'Hard and slow to copy; it is also the reason costs are high.'],
      ['Funding (AAA, HDFC Bank)', 'Advantage', 'Cost of borrowings 6.9%; diversified lenders; positive liquidity gaps up to five years.', 'Durable while HDFC Bank owns it.'],
      ['Product breadth and cross-sell', 'Advantage', 'Thirteen products across three verticals; consumer loans bring in new customers who are then offered personal and business loans.', 'Smooths growth across cycles; each product faces specialists.'],
      ['Underwriting thin-file borrowers', 'Mixed', 'Losses of 1.3-2.5% in normal years, 5.1% in Covid; FY25-FY26 stress in trucks and unsecured business loans required a cleanup.', 'Good, not exceptional: losses track the cycle.'],
      ['Cost efficiency', 'Disadvantage', 'Lending opex ~3.8% of loans and ~40% of net income; 63,500 lending staff.', 'The price of reach; AI ("Shikhar") is the plan to bring it down.'],
      ['Pricing power', 'Disadvantage', 'Banks, including its own parent, compete for the better customers in cars, two-wheelers and personal loans.', 'Yields held at ~14%, but the best borrowers can go elsewhere.'],
    ], head: ['Source of advantage', 'Verdict', 'Evidence', 'Durability'], title: 'Moat scorecard', source: 'Company presentations, calls and annual reports; GAM Research' },
    { callout: '**Honest verdict:** HDB has a narrow moat: reach plus cheap funding lets it earn a 14-16% ROE in normal years, a little above its cost of equity, but its underwriting has not shown an edge over the cycle (Covid ROE 4.8%) and its costs are high. That is a good business worth a premium to book, not a franchise that deserves the 3x book it listed at.' },
  ],
};

module.exports = { parent, moat, ...require('./HDBFS.part4c') };
