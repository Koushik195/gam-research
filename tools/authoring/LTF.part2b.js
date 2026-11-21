// L&T Finance report, part 2b: industry (microfinance cycle, consumer credit, gold, rates, listed NBFC landscape,
// regulation) and the tailwind test.
const X = require('./LTF.ctx');
const { n0, n1, pc, P, PEERS, shortName, SG, ASOF_TXT, distInc, distPctPbt, price, px18Sep } = X;
const LEND = PEERS.filter(p => p.roe != null);
const RQ = SG.rbfQuality;

const industry = {
  id: 'industry', nav: 'Industry: microfinance, consumer credit, rates', kicker: 'Industry', title: 'Microfinance is out of its crisis and consumer credit is booming, but rates and regulators have turned',
  blocks: [
    { p: `LTF's biggest single book is rural group lending, so the microfinance cycle matters most. The industry went through an over-indebtedness crisis in 2024-25: borrowers with loans from four or more lenders defaulted in Karnataka, Tamil Nadu and Bihar, lenders' collections fell and credit costs spiked. The industry book has since shrunk from a peak of ~₹4.4 lakh cr to ~₹3.3 lakh cr, the share of customers with more than three loans is below 5%, and the industry body MFIN's guardrails (no more than three lenders, ₹2 lakh total group-loan debt) now apply (CEO, 13-Jul-2026). LTF came through better than most: in Q1FY27 ${RQ.zeroDpd.LTF}% of its group-loan book was current against ${RQ.zeroDpd.industry}% for the industry (CRIF High Mark), and its 0-DPD collection efficiency was back at ${RQ.ce0dpd}%.` },
    { p: 'Urban consumer credit is the opposite story: strong. LTF\'s CEO reports record two-wheeler sales at dealers in May-June 2026, personal-loan demand through big-tech platforms is rising, and UBS (23-Sep-2026) expects ~30% personal-loan growth for NBFCs. Gold loans boomed with the gold price, though the RBI\'s new gold-loan rules (tiered loan-to-value and need assessment, from April 2026) cut originations across the industry for a month. The risks sit elsewhere: the monsoon was 14% below normal by 10-Jul (El Niño), and money got dearer in September: the Nifty fell ~5% for the month on foreign selling, Brent was ~$106 and most economists polled expected a 25bp repo hike in October. Then IRDAI\'s 23-Sep proposal hit every lender that sells insurance with its loans.' },
    { p: `Among the listed lenders we track, LTF had the lowest FY26 ROE except Poonawalla (${n1(P.LTF.roe)}% on Screener's figures) and a mid-table ROA (${n2x(P.LTF.roa)}%), yet trades at ${n1(P.LTF.pb)}x trailing book, close to HDB Financial (${n1(P.HDBFS.pb)}x) and well above M&M Financial (${n1(P['M&MFIN'].pb)}x), which earns a similar ROE. Its market value was ₹${(P.LTF.mcapCr / 1e5).toFixed(2)} lakh cr on ${ASOF_TXT}.` },
    { pair: [
      { type: 'hbar', title: 'ROE, FY26: only Poonawalla earned less', unit: 'Net profit ÷ average net worth, FY26 (%)', x: LEND.map(p => shortName(p.symbol)), series: [{ name: 'ROE', values: LEND.map(p => Math.round(p.roe * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'L&T Finance', source: 'Screener.in (consolidated; SBI Cards and BHFL standalone), GAM Research' },
      { type: 'hbar', title: 'Price to book on 30-Sep-2026: LTF is not cheap for its returns', unit: 'Trailing P/B at the 30-Sep-2026 close (x)', x: LEND.filter(p => p.pb != null).map(p => shortName(p.symbol)), series: [{ name: 'P/B', values: LEND.filter(p => p.pb != null).map(p => Math.round(p.pb * 100) / 100), fmt: 'n2' }], labels: 'all', highlight: 'L&T Finance', source: 'Screener.in, NSE closes, GAM Research' },
    ] },
    { h: 'Regulation: what touches LTF' },
    { exhibit: { type: 'table', title: 'Rules and proposals that affect LTF', head: ['When', 'Rule', 'Status on 30-Sep-2026', 'Effect on LTF'], wide: [1, 3], rows: [
      ['Oct-2021 onward', 'Scale-based regulation; LTF in the upper layer', 'In force', 'Bank-like governance and disclosure; CRAR ≥15%, Tier 1 ≥10% (LTF 17.89% / 17.14%)'],
      ['2024-25', 'MFIN guardrails: at most three lenders per borrower, ₹2 lakh total group-loan debt', 'In force', 'Slows group-loan growth; LTF applies stricter in-house norms (0-DPD applicants only)'],
      ['Nov-2023', 'Higher risk weights on unsecured consumer credit', 'In force (bank-to-NBFC part reversed Apr-2025)', 'More capital for personal loans and group loans'],
      ['Apr-2026', 'RBI gold-loan directions (tiered LTV, need assessment)', 'In force', 'Q1FY27 gold disbursements −31% QoQ; "normal" growth expected from Q2'],
      ['23-Sep-2026 (consultation)', 'IRDAI: credit-life commission capped at 2% (28% now), 5% on health, nil on loan-packaged motor TP; no compulsory bundling', 'Comments due 25-Oct-2026', `Distribution income ₹${n0(distInc)} cr in FY26, ${n0(distPctPbt)}% of PBT; a third lost in our base from FY28E`],
      ['Oct-2026 policy (expected)', 'Repo rate +25bp (economists\' poll)', 'Expected', 'CFO budgets FY27 WACB at 7.35-7.40% (Q1 7.20%); AAA and priority-sector funding soften the hit'],
    ], source: 'RBI framework as reported; LTF Q1FY27 presentation and call; BusinessToday (24-Sep-2026, IIFL summary of the IRDAI paper); Upstox (28-Sep-2026)' } },
    { callout: `**Our view:** demand is not LTF's problem. Its constraints are the **cost of risk** at the bottom of the pyramid (group loans and personal loans are the first to break in a downturn), the **cost of money** (AAA helps, but there are no deposits), and **regulation of fee income**, which turned from a tailwind into a headwind on 23-Sep: LTF fell from ₹${n0(px18Sep)} to ₹${n0(price)} in two weeks.` },
  ],
};
function n2x(v) { return (Math.round(v * 100) / 100).toFixed(2); }

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach LTF?', title: 'Tailwind test: the microfinance recovery and consumer credit help; fees and rates push back',
  blocks: [
    { p: 'An industry trend only matters to a shareholder if the company turns it into profit. We score each one.' },
    { verdicts: [
      ['Microfinance recovery after the 2024-25 crisis', 'Yes', 'Collection efficiency 99.8%; PAR 1-30 down from 1.1% to 0.5%; group-loan disbursements +23% in Q1; slippages ₹944 cr (Q1FY26) → ₹402 cr (Q4FY26).', 'The single biggest driver of lower credit cost in FY27; history says the next cycle comes in 3-4 years.'],
      ['Consumer credit boom (personal loans via big tech)', 'Yes, with risk', 'Personal-loan book +80% to ₹16,917 cr; disbursements ₹4,380 cr in Q1 (+126%); yield ~16%; gross non-starters <3%.', 'Growth and margin now; a book that has not been through a downturn at this size.'],
      ['Two-wheeler and tractor demand', 'Yes', '2W disbursements +41% in Q1; prime share 90%; farm +11% (late monsoon).', 'Steady, secured and well-underwritten; tractors depend on the monsoon.'],
      ['Gold price boom', 'Partly', 'Gold book ₹1,360 cr → ₹3,829 cr in a year; 343 branches, ~500 more in FY27.', 'Adds secured growth; branch costs come first and profit later (not disclosed).'],
      ['AI and in-house underwriting (Cyclops)', 'Partly', '2W 30+ DPD at 10 months 2.8% vs 7.1% for the industry; Cyclops live in 2W, farm, PL and SME.', 'Real in two-wheelers; unproven elsewhere for now; does not yet show in opex (4% of the book).'],
      ['Insurance cross-sell', 'At risk', `₹${n0(distInc)} cr of distribution income in FY26 (+19%); IRDAI proposes a 2% credit-life cap.`, 'The largest exposure among listed NBFCs (IIFL); a tailwind turning into a headwind.'],
      ['Falling interest rates', 'No longer', 'WACB 7.35% in FY26 and 7.20% in Q1FY27 after the 2025 rate cuts; a repo hike is now expected.', 'The funding tailwind is over; we model cost of funds up 20bp by FY28E.'],
    ], head: ['Trend', 'Helps?', 'Evidence', 'So what'], title: 'Tailwind scorecard', source: 'Q4FY26 and Q1FY27 presentations and calls; BusinessToday (24-Sep-2026); Annual Report FY26; GAM Research' },
    { callout: `**Our view:** the two trends that drive FY27 profit (microfinance normalising and consumer-credit growth) are cyclical and are already in the numbers: Q1FY27 ROE of 12.7% is the result. The structural ones (cross-sell to 2.9 crore customers, AI-driven costs, gold) are real but slow, and the one structural tailwind that was already paying, insurance commission, is now under review. That is why we model ROE rising only to {{F.roe.2|pct}} by FY29E.` },
  ],
};

module.exports = { industry, tailwind };
