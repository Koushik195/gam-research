// Cholamandalam report, part 2b: industry (vehicle cycle, listed NBFC landscape, regulation) and the tailwind test.
const X = require('./CHOLAFIN.ctx');
const { n0, n1, pc, P, PEERS, shortName, Q1, ASOF_TXT, insCom, insPctPbt } = X;
const LEND = PEERS.filter(p => p.roe != null);

const industry = {
  id: 'industry', nav: 'Industry: vehicles, small business, rates', kicker: 'Industry', title: 'Vehicle sales hit records in Q1, but rates are rising and the regulators are busy',
  blocks: [
    { p: `Half of Chola's book rides on India's vehicle cycle, and in Q1FY27 that cycle was strong. Per SIAM and ICRA data in Chola's presentation, heavy trucks grew 13% (their best Q1 ever), light trucks 18%, small commercial vehicles 31%, cars and utility vehicles 26% (best Q1, helped by the cut in GST rates), two-wheelers 20%, tractors 19% (record quarterly sales on good farm cash flows) and construction equipment 9%. The used-vehicle market, where Chola earns its highest yields, keeps formalising. The FY24-FY25 slowdown that management called a "down cycle" for vehicles is over, at least for now; the risk is a weak monsoon (the forecast was 92% of normal) hitting tractor and rural transport borrowers in H2.` },
    { p: `The money side has turned less friendly. September 2026 was a bad month for Indian markets: the Nifty fell ~5% by 28-Sep on foreign selling, Brent was ~$106, US 10-year yields 5.2%, and most economists polled expected the RBI to raise the repo rate by 25bp to 5.5% in October, the first hike since Feb-2023. Listed NBFCs fell 4-16% between 31-Jul and ${ASOF_TXT}; Chola fell ~12% in the second half of September. Wholesale-funded lenders like Chola feel rate hikes first, through bank loans priced off MCLR and new bond issues.` },
    { p: `Among the listed lenders we track, Chola is the third-largest by market value (₹${(P.CHOLAFIN.mcapCr / 1e5).toFixed(2)} lakh cr on ${ASOF_TXT}, behind Bajaj Finance and Shriram Finance). Its FY26 ROE (${n1(P.CHOLAFIN.roe)}%) was second only to Muthoot Finance's, but its return on assets (${n1(P.CHOLAFIN.roa)}%) was well below Bajaj Finance, Shriram, SBI Cards and Muthoot (3.3-6.5%): Chola earns its ROE with leverage (assets 8x equity) rather than high margins, because its loans are secured and its borrowers are priced competitively by banks.` },
    { pair: [
      { type: 'hbar', title: 'ROE, FY26: second only to Muthoot', unit: 'Net profit ÷ average net worth, FY26 (%)', x: LEND.map(p => shortName(p.symbol)), series: [{ name: 'ROE', values: LEND.map(p => Math.round(p.roe * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'Cholamandalam', source: 'Screener.in (consolidated; SBI Cards and BHFL standalone), GAM Research' },
      { type: 'hbar', title: 'ROA, FY26: Chola is a low-margin, high-leverage lender', unit: 'Net profit ÷ average total assets, FY26 (%)', x: LEND.map(p => shortName(p.symbol)), series: [{ name: 'ROA', values: LEND.map(p => Math.round(p.roa * 100) / 100), fmt: 'n2' }], labels: 'all', highlight: 'Cholamandalam', source: 'Screener.in, GAM Research' },
    ] },
    { h: 'Regulation: what touches Chola' },
    { exhibit: { type: 'table', title: 'Rules and proposals that affect Chola', head: ['When', 'Rule', 'Status on 30-Sep-2026', 'Effect on Chola'], wide: [1, 3], rows: [
      ['Oct-2021 onward', 'Scale-based regulation; Chola in the upper layer (FY23)', 'In force', 'Bank-like governance and disclosure; CAR ≥15%, Tier 1 ≥10%'],
      ['Nov-2021', 'RBI NPA norms: loans stay NPA until all overdues are cleared', 'In force', 'RBI-norm GNPA 4.50% vs Ind AS Stage 3 3.29% (Jun-2026); a reporting, not a provisioning, gap'],
      ['Nov-2023', 'Risk weight on unsecured consumer credit 100% → 125%', 'In force (bank-to-NBFC part reversed Apr-2025)', 'More capital for CSEL; little effect on secured vehicle and property loans'],
      ['6-Aug-2026 (draft)', 'NBFCs to offer only term loans, no revolving credit', 'Draft', 'No revolving products disclosed by Chola: not material'],
      ['23-Sep-2026 (consultation)', 'IRDAI: commission on loan-linked insurance capped at ~2-5%; curbs on staff incentives and bundling', 'Comments due 25-Oct-2026', `Insurance commission ₹${n0(insCom)} cr in FY26, ${n1(insPctPbt)}% of PBT; a third lost in our base from FY28E`],
      ['Oct-2026 policy (expected)', 'Repo rate +25bp to 5.5% (economists\' poll)', 'Expected', 'CFO assumes 25-50bp; cost of funds +5-10bp in H2FY27'],
    ], source: 'RBI framework and circulars as reported; IndMoney and BusinessToday (24-25 Sep 2026); Upstox (28-Sep-2026); Chola Q1FY27 call and presentation' } },
    { callout: '**Our view:** demand is not Chola\'s problem; vehicles are at record highs and the small-business and affordable-housing markets in tier 3-6 towns are underpenetrated. The constraints are the **cost of money** (rising, and Chola has no deposit franchise), **asset quality at the bottom of the pyramid** (small transport operators and micro-merchants feel a weak monsoon or a diesel shock first) and **regulation of fee income**, which has been a quiet profit driver.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach Chola?', title: 'Tailwind test: which trends actually help Chola\'s returns?',
  blocks: [
    { p: 'An industry trend only matters to a shareholder if the company turns it into profit. We score each one.' },
    { verdicts: [
      ['Vehicle up-cycle (CV, PV, tractors)', 'Yes', 'Vehicle-finance disbursements +21% in Q1FY27; AUM +19%; credit cost down from 2.2% to 2.0% of assets; segment PBT +50%.', 'The biggest swing factor in FY27 profit; also the most cyclical.'],
      ['GST rate cut on cars', 'Partly', 'Cars and MUVs +26% in Q1 (best Q1 ever, "sustained impact of revised GST rates").', 'Volume help, but banks compete hard for prime car loans.'],
      ['Small-business formalisation', 'Yes', 'LAP +23%, SBPL +40%, SME +39%; LAP pre-tax ROA 4.3%, SBPL 7.9%.', 'Mortgages are now the main growth engine and the highest-quality profit.'],
      ['Gold price boom', 'Partly', 'Gold AUM ₹97 cr → ₹2,143 cr in a year; 90% of customers new to Chola; yields "16-17%".', 'Still under 1% of AUM and loss-making in FY26; tied to the gold price.'],
      ['Falling interest rates', 'No longer', 'Cost of funds fell ~60bp in FY26 (our measure); Q1 NIM 8.2% of assets. Now a 25-50bp repo hike is expected.', 'The funding tailwind is over; we model cost of funds up 15bp by FY28E.'],
      ['Digital collections and AI underwriting', 'Partly', '55% of CSEL collections digital; Gini-coefficient work on scorecards; 30,000 collection staff.', 'Helps credit cost at the margin; does not cut costs yet (opex ~3.1% of assets).'],
      ['Insurance cross-sell', 'At risk', `Commission ₹${n0(insCom)} cr in FY26 (+17%); IRDAI proposes caps of ~2-5% on loan-linked covers.`, 'A tailwind turning into a headwind.'],
      ['Bank competition in vehicles and homes', 'No', 'Management sees no change in bank behaviour "over the past four to five months" (May-2026).', 'Not hurting now; banks remain the price-setters in prime segments.'],
    ], head: ['Trend', 'Helps?', 'Evidence', 'So what'], title: 'Tailwind scorecard: the vehicle cycle and mortgages help; rates and regulation push back', source: 'Q4FY26 and Q1FY27 presentations and calls; IndMoney (24-Sep-2026); GAM Research' },
    { callout: `**Our view:** the tailwinds that matter most for FY27 (the vehicle up-cycle and lower credit costs) are cyclical; the structural ones (mortgages for small businesses, cross-sell across a 5 million customer base) are real but slow. Two headwinds arrived in September: higher rates and the IRDAI proposal. That is why we model ROE flat at ~19-20% (FY27E {{F.roe.0|pct}}), not rising, even with the credit cycle in Chola's favour.` },
  ],
};

module.exports = { industry, tailwind };
