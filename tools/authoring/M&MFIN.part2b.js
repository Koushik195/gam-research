// M&M Finance report, part 2b: industry (rural vehicle cycle, monsoon, rates, listed NBFC landscape, regulation)
// and the tailwind test.
const X = require('./M&MFIN.ctx');
const { n0, n1, n2, pc, P, PEERS, shortName, Q1, ASOF_TXT, insCom, insPctPbt, SG } = X;
const LEND = PEERS.filter(p => p.roe != null && p.symbol !== 'ABCAPITAL');

const industry = {
  id: 'industry', nav: 'Industry: rural vehicles, monsoon, rates', kicker: 'Industry', title: 'Vehicle demand was strong in Q1; then the monsoon failed, rates turned and IRDAI moved',
  blocks: [
    { p: `M&M Finance's book rides on rural India's vehicle cycle, and FY27 started well. Tractor disbursements rose 45% in Q1FY27: delayed rains stretched the pre-sowing buying season and the rabi harvest had left farmers with cash (CEO, 21-Jul). Rural car and utility-vehicle sales grew faster than urban ones, helped by the cut in GST rates on small cars and tractors in Sep-2025, and management gained lender market share in every vehicle category except commercial vehicles. Heavy trucks and construction equipment for large fleets have moved to banks, which fund themselves more cheaply; M&M Finance is deliberately shrinking there.` },
    { p: `Then the season turned. The IMD had forecast a below-normal monsoon from April (92% of the long-period average, cut to 90% in May) because of El Niño, and the season ended on ${ASOF_TXT} about 12.6-13% short, the fourth-weakest since 2001, with the East and North-East driest and Rajasthan, Madhya Pradesh and Gujarat also short in July. Low soil moisture and reservoirs now threaten rabi sowing. For a lender whose tractor borrowers often repay twice a year from harvests, this is the main FY27 risk: management built overlays in Q3 and Q4 of FY26 "specifically" for a compromised monsoon, and slowed growth in vulnerable segments by asking for higher down-payments.` },
    { p: `The money side also turned less friendly. September 2026 was a bad month for Indian markets: the Nifty fell ~5% by 28-Sep on foreign selling, Brent was ~$106, US 10-year yields 5.2%, and most economists polled expected the RBI to raise the repo rate by 25bp to 5.5% in October. M&M Finance is AAA-rated and part-funded by public deposits, but 44% of its borrowings are floating-rate and its cost of funds already rose ~10bp in Q1. Among listed lenders it is mid-sized (₹${n0(P['M&MFIN'].mcapCr)} cr market value on ${ASOF_TXT}) and the least profitable large vehicle financier: FY26 ROE ${n1(P['M&MFIN'].roe)}% and ROA ${n2(P['M&MFIN'].roa)}%, against ${n1(P.CHOLAFIN.roe)}% / ${n2(P.CHOLAFIN.roa)}% at Chola and ${n1(P.SHRIRAMFIN.roe)}% / ${n2(P.SHRIRAMFIN.roa)}% at Shriram.` },
    { pair: [
      { type: 'hbar', title: 'ROE, FY26: M&M Finance near the bottom of the large lenders', unit: 'Net profit ÷ average net worth, FY26 (%)', x: LEND.map(p => shortName(p.symbol)), series: [{ name: 'ROE', values: LEND.map(p => Math.round(p.roe * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'M&M Finance', source: 'Screener.in (consolidated; SBI Cards, Bajaj Housing and HDB standalone), GAM Research. Aditya Birla Capital (a holding company) left out.' },
      { type: 'hbar', title: 'ROA, FY26: thin margins, not just low leverage', unit: 'Net profit ÷ average total assets, FY26 (%)', x: LEND.map(p => shortName(p.symbol)), series: [{ name: 'ROA', values: LEND.map(p => Math.round(p.roa * 100) / 100), fmt: 'n2' }], labels: 'all', highlight: 'M&M Finance', source: 'Screener.in, GAM Research' },
    ] },
    { h: 'Regulation: what touches M&M Finance' },
    { exhibit: { type: 'table', title: 'Rules and proposals that affect M&M Finance', head: ['When', 'Rule', 'Status on 30-Sep-2026', 'Effect on M&M Finance'], wide: [1, 3], rows: [
      ['Oct-2021 onward', 'Scale-based regulation: upper-layer NBFC', 'In force', 'Bank-like governance and disclosure; CRAR ≥15%, Tier 1 ≥10% (Jun-2026: 18.5% / 16.5%)'],
      ['Ongoing', 'Deposit-taking NBFC rules', 'In force', `Public fixed deposits ₹${n0(14674)} cr (11% of funding); a cheaper, stickier source than most NBFCs have`],
      ['Sep-2022', 'RBI order barring outsourced recovery (lifted Jan-2023)', 'Lifted', 'Recovery practices under scrutiny; collections now partly AI-driven (vernacular bots)'],
      ['1-Jan-2026', 'Co-lending directions: system-to-system integration with banks', 'In force', 'Bank co-lending unplugged and restarted with one bank in PV; not material yet'],
      ['23-Sep-2026 (consultation)', 'IRDAI: commission on loan-linked insurance capped at ~2-5%; curbs on bundling and staff incentives', 'Comments due 25-Oct-2026', `Insurance commission ₹${n0(insCom)} cr in FY26 (${n1(insPctPbt)}% of PBT) plus MIBL's broking income; we cut fees ~0.13% of AUM from FY28E`],
      ['Oct-2026 policy (expected)', 'Repo rate +25bp to 5.5% (economists\' poll)', 'Expected', 'Cost of funds +10bp in FY28E in our base; 44% of borrowings floating'],
    ], source: 'RBI framework and circulars as reported; M&M Finance Q1FY27 presentation and call; IndMoney (24-Sep-2026); Upstox (28-Sep-2026)' } },
    { callout: '**Our view:** demand is not M&M Finance\'s problem in a normal year: rural vehicle demand is healthy and it is the largest tractor financier in India. Its problems are the ones a rural lender cannot diversify away: **the monsoon** (which drives tractor, rural-transport and small-business cash flows), **price competition from banks** in the safer segments, and **the cost of servicing small rural borrowers** (high branch and collection costs). This year two more have joined: dearer money and regulation of the insurance income that had become its fastest-growing revenue line.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach M&M Finance?', title: 'Tailwind test: Q1\'s tailwinds were cyclical, September\'s headwinds are real',
  blocks: [
    { p: 'An industry trend only matters to a shareholder if the company turns it into profit. We score each one.' },
    { verdicts: [
      ['Tractor and rural vehicle demand', 'Yes, for now', `Tractor disbursements +45% and PV +24% in Q1FY27; tractors ${SG.mixPct.find(r => r.q === 'Q1FY27').tractor}% of AUM; market share gained in tractors, PV and 3W.`, 'The biggest FY27 driver, and the most exposed to the monsoon.'],
      ['GST rate cuts on vehicles (Sep-2025)', 'Partly', 'Unit growth in entry-level cars and tractors from H2FY26; but lower vehicle prices cut ticket sizes, so disbursements grew less than units.', 'Volume help, not a margin help.'],
      ['The 2026 monsoon', 'No', 'Season ended ~13% below normal (30-Sep); East/NE driest; rabi sowing at risk.', 'H2FY27 collections in tractors and rural CV are the swing factor; overlays exist for this.'],
      ['Falling interest rates', 'No longer', 'Cost of funds fell ~50bp in FY26 (our measure) with RBI cuts and the rights issue; it rose ~10bp in Q1FY27 and a hike was expected in October.', 'The funding tailwind is over; we add 10bp in FY28E.'],
      ['Digital and AI (Udaan stack)', 'Partly', '100% of wheels disbursals on the digital stack; headcount flat at ~22,600; 25% lower acquisition cost on digital channels; AI agents in back-office and collections.', 'Supports growth without hiring; opex ÷ assets still 2.7% and management says it should not fall much below.'],
      ['Insurance cross-sell', 'At risk', `Corporate-agency commission ₹${n0(insCom)} cr in FY26 (2.4x FY25); IRDAI proposes ~2-5% caps on loan-linked covers.`, 'FY26\'s fastest-growing income line becomes a regulatory risk.'],
      ['Mortgages and SME', 'Yes, small', 'MRHFL loans +29% YoY (Jun-2026), Stage 3 down to 2.4%; SME AUM +32% in FY26; non-wheels now 17% of group AUM.', 'Diversification helps resilience, but at 17% of the book it cannot move ROE much before FY29.'],
      ['Bank competition in vehicle finance', 'No', 'Fleet HCV/CE borrowers have moved to banks on price; premium-car loans "very low IRR" (CEO).', 'Caps yields in the safer segments; pushes M&M Finance toward riskier rural borrowers.'],
    ], head: ['Trend', 'Helps?', 'Evidence', 'So what'], title: 'Tailwind scorecard: strong Q1 demand, weak monsoon, rising rates, regulatory risk to fees', source: 'Q4FY26 and Q1FY27 presentations and calls; UNI (30-Sep-2026); IndMoney (24-Sep-2026); GAM Research' },
    { callout: '**Our view:** the tailwinds that lifted FY26 and Q1FY27 (tractor demand, GST cuts, falling funding costs and fast-growing insurance fees) were cyclical or are now under threat; the structural ones (digital productivity, mortgages and SME) are real but slow. That is why we model ROE of only {{F.roe.0|pct}} in FY27E and {{F.roe.1|pct}} in FY28E, even after a 75% jump in Q1 profit.' },
  ],
};

module.exports = { industry, tailwind };
