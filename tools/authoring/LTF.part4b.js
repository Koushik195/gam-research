// L&T Finance report, part 4b: competitive advantage scorecard, Q1FY27 and guidance, earnings quality (incl. the
// FY26 tie-out of the annual report to Screener / our model).
const X = require('./LTF.ctx');
const { C, F, A, fin, fi, n0, n1, pc, Q1, G27, G26, L31, L26, distInc, distPctPbt, brandFeePct, CY } = { ...X, CY: X.C.cyclops };
const FY = C.fy26;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real edges in rural reach and the L&T name; no moat in returns yet',
  blocks: [
    { p: 'A lender\'s moat shows up as a lasting gap between what it earns and its cost of equity. LTF does not have one yet: ROE has been below ~13% in every year since FY20 (5.5-12.1%) and was 12.7% in its best quarter. What it does have are specific edges that could produce a moat if credit costs fall as promised. We test each.' },
    { verdicts: [
      ['Rural reach (group loans, tractors)', 'Advantage', '2,184 meeting-centre branches in ~2 lakh villages; 1.6 crore rural customers served; 17+ years in group loans, 21+ in tractors; 0-DPD 96.5% vs industry 77.9%.', 'Hard to copy; but every rural lender shares the same monsoon and the same over-indebtedness cycles.'],
      ['Parentage and funding', 'Advantage', 'AAA from all four agencies, linked to L&T\'s support; S&P/Fitch at sovereign level; WACB 7.20%.', 'Cheaper than AA peers; not as cheap as banks (no deposits).'],
      ['In-house underwriting (Cyclops) and AI', 'Partial advantage', `Two-wheeler cohorts: prime 52% → 90%, net non-starters 3.7% → 0.2%, 30+ DPD 2.8% vs industry 7.1%; 1,000+ tech and data staff.`, 'Proven in one product; others not yet seasoned. Competitors can buy similar tools.'],
      ['Customer base for cross-sell', 'Potential', '~2.9 crore customers; personal loans and micro-LAP sold to existing customers; "Project Hercules" cross-sell platform due Q3FY27.', 'Cheaper acquisition if it works; not yet visible in costs.'],
      ['Cost efficiency', 'Disadvantage', 'Opex ~4.0% of the book (company 4.03% in Q1FY27) and guided at 3.75-4.0% through FY31; branch build-out in gold, micro-LAP, microfinance.', 'No operating leverage before FY28; banks and Bajaj Finance run lower cost ratios.'],
      ['Fee income', 'At risk', `Distribution income ₹${n0(distInc)} cr, ~${n0(distPctPbt)}% of PBT, mostly loan-linked credit life.`, 'A profit pool the regulator now wants to cap.'],
      ['Urban unsecured (personal loans)', 'Unproven', 'Book +80% via CRED, Google Pay, PhonePe and Amazon; joint scorecards; no FLDG.', 'Platforms also supply competitors; the edge is underwriting, which is unseasoned.'],
    ], head: ['Source of advantage', 'Verdict', 'Evidence', 'Durability'], title: 'Moat scorecard', source: 'Company presentations and calls (Q4FY26, Q1FY27); Annual Report FY26; GAM Research' },
    { callout: '**Honest verdict:** no moat yet. LTF has two genuine edges (rural distribution and a AAA rating from its parent) and one promising one (Cyclops), but it has not turned them into returns above its cost of equity in any recent year, and the next step up depends on credit costs it has not delivered before and on fee income a regulator is targeting. If LTF reaches 15%+ ROE through a full credit cycle, the verdict changes; it has not been tested yet.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: record profit, growth ahead of guidance, credit cost on the glide path',
  blocks: [
    { p: `Q1FY27 (Apr-Jun 2026) was LTF's best quarter: book +27% (+6.5% QoQ) to ₹1,29,634 cr, disbursements +36% to ₹23,852 cr, NIM + fees 10.47%, opex 4.03%, credit cost 2.54% (down 10bp QoQ, with no provision release), ROA 2.48% and ROE 12.71%; profit rose 29% to a record ₹902 cr. Management said it could have grown faster but turned away ₹1,000-1,200 cr of loans. The soft spots: core NIM −24bp QoQ as leverage rose, gold disbursements −31% QoQ after the RBI's new rules, SME slowed on purpose, and wholesale Stage 3 ticked up (a settlement, says the CFO).` },
    { exhibit: { type: 'table', title: 'FY27 guidance vs Q1 and our forecast', head: ['Metric', 'FY27 guidance (27-Apr-2026, reaffirmed 13-Jul)', 'Q1FY27 actual', 'GAM FY27E'], wide: [1], rows: [
      ['Book growth', G27.book, `${Q1.bookGrowth}% YoY`, '{{F.aumGrowth.0|pct}}'],
      ['NIM + fees', G27.nimFees, '10.47%', '{{F.ntiPct.0|pct}} of book on our basis (FY26 {{fin.ntiPct.11|pct}})'],
      ['Credit cost', G27.creditCost, '2.54%', '{{F.creditCost.0|n2}}% of book (FY28E {{F.creditCost.1|n2}}%)'],
      ['ROA', G27.roa, '2.48%', '{{F.roa.0|pct}} on assets for the full year'],
      ['Cost of borrowing', G27.wacb, 'WACB 7.20%', 'Cost of funds {{F.costOfFunds.0|pct}} on our measure (FY26 {{fin.costOfFunds.11|pct}})'],
      ['Branches', G27.branches, '343 gold branches', 'Opex {{F.opexPct.0|pct}} of book'],
    ], source: 'Q4FY26 call (27-Apr-2026); Q1FY27 presentation and call (13-Jul-2026); GAM estimates' } },
    { exhibit: { type: 'table', title: 'Track record: what LTF promised and delivered', head: ['Promise', 'Guided', 'Delivered', 'Verdict'], rows: [
      ['FY26 book growth', G26.book, `${G26.bookActual}%`, 'Beat'], ['FY26 ROA', G26.roa, G26.roaActual, 'Bottom of range'], ['FY26 NIM + fees', G26.nimFees, `${G26.nimFeesActual}%`, 'In range'],
      ['Lakshya 2026: retailisation', '>95% by FY26', '98%', 'Beat'], ['Lakshya 2026: retail growth', '>25% CAGR', '28%', 'Beat'], ['Lakshya 2026: asset quality', 'GS3 <3%, NS3 <1%', '2.88% / 0.96%', 'Met'],
      ['Lakshya 2026: ROA', '2.8-3.0% by FY26', '2.40% (Q4FY26)', 'Missed (microfinance crisis)'],
    ], source: 'Q4FY25 call (6-May-2025); Q4FY26 presentation p5 and call' } },
    { callout: '**Our read:** LTF delivers on growth and balance-sheet goals and misses on returns: Lakshya 2026 hit every target except ROA, and FY26 ROA landed at the bottom of its range. That is why we take the growth guidance at face value (and a little above), but stay 10-15bp above the guided credit-cost path and do not assume the 2.8% Q4FY27 ROA.' },
  ],
};

const earningsQuality = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean audits, but provision releases, related-party fees and two sets of definitions need watching',
  blocks: [
    { p: 'We rate accounting **AMBER**. Joint auditors Brahmayya & Co and T R Chadha & Co LLP gave an unmodified opinion on FY26. Disclosure is good on stages, collections and the wholesale run-off, weaker on segment profitability. Five things deserve attention:' },
    { bullets: [
      '**Provision releases flattered FY25 and FY26.** LTF released ₹400 cr (FY25) and ₹450 cr (FY26) of macro-prudential provisions against microfinance losses, ~11% of each year\'s PBT. The buffer is now gone; reported credit cost from FY27 is "clean" but unprotected.',
      `**Insurance income and the parent.** Distribution income of ₹${n0(distInc)} cr (~${n0(distPctPbt)}% of PBT) is real cash, but it is exactly what IRDAI proposes to cap. LTF also paid L&T a brand licence fee of ₹${n0(FY.brandFeeToLT)} cr in FY26 (₹136.53 cr in FY25), ~${n1(brandFeePct)}% of PBT: disclosed, but a recurring transfer to the controlling shareholder.`,
      '**Two definitions of the same P&L.** The presentation shows interest income of ₹15,948 cr and fee & other income of ₹1,973 cr for FY26; the accounts show ₹16,616 cr and ₹1,298 cr. The company moves ~₹670 cr of treasury and other income into "fees". NIM + fees is the same either way, but core NIM and fee ratios are not comparable with peers.',
      '**Security receipts.** ₹4,808 cr of SRs are carried at fair value with a 68% provision cover; recoveries are being parked in buffers rather than booked as profit. That is conservative, but SR values are management estimates of real-estate and infrastructure recoveries.',
      '**One-offs in history.** FY23 profit (₹1,623 cr attributable) included a ₹2,575 cr gain on the mutual-fund sale and a ₹2,687 cr fair-value loss on wholesale loans; FY26 includes a ₹28.5 cr labour-code charge. We adjust the P/E history for FY23 (valuation chapter).',
    ] },
    { exhibit: { type: 'table', title: 'Tie-out: annual report vs Screener / our model (FY26, ₹ crore, consolidated)', head: ['Line', 'Annual report', 'Screener / model', 'Gap and why'], wide: [3], rows: [
      ['Revenue from operations', '17,914', '{{fin.sales.11|num}}', 'Ties (interest + fees = Screener revenue)'],
      ['Interest income', '16,616', '{{fin.interestIncome.11|num}}', 'Ties (presentation: ₹15,948 cr; see above)'],
      ['Fees & other operating income', '1,298', '{{fin.feeIncome.11|num}}', 'Ties: fees & commission ₹1,233 cr + fair-value gains ₹64 cr'],
      ['Finance costs', '6,720', '{{fin.interest.11|num}}', 'Screener adds ~₹14 cr (lease interest moved from other expenses)'],
      ['Operating expenses (incl. depreciation)', '4,424', '{{fin.opex.11|num}}', 'Same ~₹14 cr (presentation: ₹4,453 cr)'],
      ['Credit losses (impairment + write-offs)', '2,746', '{{fin.provisions.11|num}}', 'Ties: impairment ₹2,184 cr + derecognition loss ₹562 cr (presentation: ₹2,751 cr after a ₹450 cr release)'],
      ['Other income incl. exceptional', '−25', '{{fin.otherIncome.11|num}}', 'Other income ₹3 cr less ₹28.5 cr labour-code charge'],
      ['Profit before tax', '3,998', '{{fin.pbt.11|num}}', 'Ties'],
      ['Net profit (attributable)', '2,983 (2,981)', '{{fin.pat.11|num}}', 'Ties; minorities ₹1.7 cr'],
    ], source: 'Annual Report FY26 (consolidated P&L, notes 21-31); Q4FY26 presentation p69; Screener.in; GAM Research' } },
  ],
};

module.exports = { moat, guidance, earningsQuality };
