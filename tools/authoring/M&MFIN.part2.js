// M&M Finance report, part 2: what the company does, history and corporate actions. Industry and the
// tailwind test are in part2b.
const X = require('./M&MFIN.ctx');
const { C, SG, F, A, AK, fin, fi, n0, n1, pc, Q1, SA26 } = X;

const MX = Object.fromEntries(SG.mixPct.map(r => [r.fy || r.q, r]));
const DS = Object.fromEntries(SG.disbursements.rows.map(r => [r[0], r]));
const dcol = { pv: 1, used: 2, cv: 3, tractor: 4, tw3: 5, sme: 6, others: 7 };
const rowsMix = [
  ['Passenger vehicles', 'pv', 'Cars and utility vehicles, mostly Mahindra SUVs and entry-level cars for rural and semi-urban buyers; sits out "low-IRR" premium-car loans'],
  ['CV & construction equipment', 'cv', 'Small and light trucks, pick-ups, buses; heavy trucks and equipment for large fleets being cut back (banks win on price)'],
  ['Pre-owned vehicles', 'used', 'Used cars, trucks and tractors; the highest-yield vehicle product'],
  ['Tractors', 'tractor', 'India\'s largest tractor financier; Mahindra and Swaraj have separate teams; repayments often half-yearly, matched to harvests'],
  ['Three-wheelers', 'tw3', 'Increasingly electric three-wheelers'],
  ['SME', 'sme', 'Loans to small businesses, dealers (trade advances) and supply-chain finance'],
  ['Others', 'others', 'Personal loans to existing customers, leasing, farm implements, consumer loans'],
];

const business = {
  id: 'business', nav: 'What M&M Finance does', kicker: 'Company', title: 'A rural vehicle lender with 1,300 branches, half its book on Mahindra vehicles',
  blocks: [
    { p: `Mahindra & Mahindra Financial Services (M&M Finance, MMFSL) is the lending arm of the Mahindra group; Mahindra & Mahindra (M&M) owns 52.5%. It is an upper-layer, deposit-taking NBFC (the RBI's tier for the largest non-bank lenders), rated AAA by CRISIL, India Ratings and CARE. It makes money the way every lender does: in FY26 it borrowed at ~7.2% (our measure), lent at ~13.7%, earned another ~1.9% of loans in fees (insurance commission, loan fees and its insurance-broking subsidiary's income), and kept what was left after operating costs (~4.3% of loans, incl. the broking subsidiary's payouts) and loan losses (~1.8%). In FY26 interest income was ₹18,428 cr of ₹21,005 cr of consolidated revenue.` },
    { p: `Its customers are farmers, small transport operators, self-employed buyers of cars and small trucks, and small businesses in villages and small towns: 1,348 offices, 6,000+ dealers, 95% of India's pin codes and over 12 million customers served since inception (about 2.4 million live). Vehicles ("wheels") are 88% of MMFSL's ₹${n0(Q1.aumSa)} cr book (Jun-2026) and ${Q1.mAndMShare}% of the book is financed Mahindra vehicles (tractors, utility vehicles, pick-ups). Housing sits in a subsidiary, Mahindra Rural Housing Finance (MRHFL, ₹8,976 cr of loans), which the board approved merging into the parent from Apr-2027.` },
    { exhibit: { type: 'table', title: 'What the ₹1.37 lakh crore MMFSL book is made of (standalone)', head: ['Asset class', 'Share FY24', 'Share FY26', 'Share Jun-26', 'AUM FY26 (₹ cr)*', 'Disbursed FY26 (₹ cr)', 'Q1FY27 disb. YoY', 'What it is'], wide: [7], rows: [
      ...rowsMix.map(([nm, k, what]) => [nm, `${MX.FY24[k]}%`, `${MX.FY26[k]}%`, `${MX.Q1FY27[k]}%`, n0(SA26[k]), n0(DS.FY26[dcol[k]]), pc(SG.disbursements.growthQ1[k]), what]),
      { hl: true, cells: ['**Total MMFSL**', '100%', '100%', '100%', `**${n0(MX.FY26.businessAssets)}**`, `**${n0(DS.FY26[8])}**`, `**${pc(SG.disbursements.growthQ1.total)}**`, ''] },
      ['MRHFL (housing subsidiary)', '', '', '', n0(SA26.mrhfl), '3,171', '+128%', 'Rural self-construction and affordable home loans; prime housing started'],
    ], source: 'Q4FY26 presentation p19, p21, p22; Q1FY27 presentation p9, p22, p34. *Share × business assets (GAM arithmetic).' } },
    { pair: [
      { type: 'stacked', title: 'Disbursements: tractors and PVs drove Q1FY27', unit: 'Disbursements by product (₹ \'000 crore)', x: SG.disbursements.rows.map(r => r[0]), series: [
        { name: 'PV', values: SG.disbursements.rows.map(r => Math.round(r[1] / 100) / 10), fmt: 'n1' },
        { name: 'Used + CV/CE', values: SG.disbursements.rows.map(r => Math.round((r[2] + r[3]) / 100) / 10), fmt: 'n1' },
        { name: 'Tractor + 3W', values: SG.disbursements.rows.map(r => Math.round((r[4] + r[5]) / 100) / 10), fmt: 'n1' },
        { name: 'SME + others', values: SG.disbursements.rows.map(r => Math.round((r[6] + r[7]) / 100) / 10), fmt: 'n1' },
      ], minLabel: 2, source: 'Q4FY26 presentation p21; Q1FY27 presentation p9' },
      { type: 'column', title: 'Quarterly disbursements: a strong second half of FY26 and Q1FY27', unit: 'Disbursements (₹ \'000 crore), Q1FY25 to Q1FY27', x: ['Q1FY25', 'Q2FY25', 'Q3FY25', 'Q4FY25', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Disbursements', values: [...SG.disbursements.quarterly.FY25, ...SG.disbursements.quarterly.FY26, ...SG.disbursements.quarterly.FY27].map(v => Math.round(v / 100) / 10), fmt: 'n1' }], labels: 'all', highlight: 'Q1FY27', source: 'Q4FY26 presentation p24; Q1FY27 presentation p23' },
    ] },
    { h: 'Subsidiaries and joint ventures' },
    { exhibit: { type: 'table', title: 'The rest of the group (FY26 unless stated)', head: ['Entity', 'Stake', 'What it does', 'Size', 'Profit', 'Note'], wide: [2, 5], rows: [
      ['Mahindra Rural Housing Finance (MRHFL)', '98.43%', 'Rural and affordable housing loans', 'Loans ₹8,320 cr (₹8,976 cr Jun-26)', 'PAT ₹58 cr (FY25 loss ₹228 cr); ₹30 cr in Q1FY27', 'Stage 3 cut from 9.0% to 2.4% after a FY25 clean-up; merging into MMFSL from Apr-2027'],
      ['Mahindra Insurance Brokers (MIBL)', '100%', 'Insurance broking (motor, life, health, commercial)', 'Net premium ₹4,590 cr; income ₹1,497 cr', 'PAT ₹114 cr; ₹38 cr in Q1FY27 (+83%)', 'Wholly owned since Sep-2023; pays regular dividends to the parent'],
      ['Mahindra Manulife Investment Management', '51% (JV)', 'Mutual fund (AMC)', 'Average AUM ₹31,828 cr', 'PAT ₹4 cr; ₹10 cr in Q1FY27', 'Equity-accounted; Manulife owns 49%'],
      ['Mahindra Ideal Finance (Sri Lanka)', '58.2%', 'Gold and vehicle loans', 'Loans ₹806 cr', 'PAT ₹14 cr', 'Small; not in our AUM line'],
      ['Mahindra Finance USA', '49% (JV)', 'Dealer and retail finance for Mahindra tractors in the US', 'n.d.', 'In share of associates', 'JV with a Rabobank group subsidiary'],
    ], source: 'Q4FY26 presentation p19; Q1FY27 presentation p7, p34-37, p41' } },
    { callout: `**Why this matters:** M&M Finance is two things at once. It is the in-house financier for Mahindra's tractors and utility vehicles, which gives it volume, dealer access and a brand rural buyers trust; and it is an ordinary rural lender competing with banks, Shriram, Chola and HDB for the same borrowers. Management insists the M&M link is "earned, not given": there are no special scorecards for Mahindra customers. The flip side of a rural, vehicle-heavy book is cyclicality: when the monsoon fails or a fleet operator's diesel bill jumps, M&M Finance's borrowers feel it first.` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Three equity raises, two clean-ups and one missed vision in nine years',
  blocks: [
    { p: 'M&M Finance was set up in 1991 to finance Mahindra vehicles and listed in 2006. Its history since FY18 is a cycle: raise equity, grow fast, hit a rural or funding shock, clean up the book, repeat. It raised equity in FY18 (QIP plus a preferential issue to M&M), in the Covid year (a 1-for-1 rights issue at ₹50) and again in June 2025 (1-for-8 at ₹194). In between came the IL&FS liquidity crunch of 2018-19, Covid, an RBI ban on outsourced recovery, a branch fraud and two changes in how provisions are calculated. The current team (Raul Rebello, CEO since Apr-2024) inherited a cleaned-up book and has spent two years rebuilding systems.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['FY18', 'QIP ₹1,056 cr + preferential issue to M&M ₹1,055 cr', 'Book value per share +30%; ROE 17.7% in FY19 (record profit ₹1,867 cr)'],
      ['FY20-21', 'IL&FS funding squeeze, then Covid; rights issue ₹3,089 cr at ₹50 (1-for-1, Jul-2020)', 'Credit cost 3.2% then 5.4% of AUM; Stage 3 9.0%; shares doubled; ROE 9% then 6%'],
      ['May-2022', '"Vision 2025": 2x AUM, NIM ~7.5%, ROA ~2.5%, Stage 3 <6%', 'FY25 delivered 1.84x, 6.5%, 1.9% and 3.7%: one of four met'],
      ['Sep-2022 to Jan-2023', 'RBI bars outsourced recovery after a death during a tractor repossession in Hazaribagh', 'Collections done in-house for 3.5 months; a governance stain'],
      ['FY23', 'Post-Covid provision releases (₹1,214 cr net release of Stage 2 and 3 provisions, standalone)', 'Profit +80% to ₹2,071 cr; credit cost 1.5% of AUM'],
      ['Sep-2023', 'MIBL insurance broking becomes wholly owned', 'Broking income consolidated: fees jump from 0.8% to 1.4% of AUM'],
      ['Apr-2024', 'Aizawl (Mizoram) branch fraud on ~2,900 vehicle loans; Raul Rebello becomes CEO', '₹136 cr provided in Q4FY24; FY24 profit −6%'],
      ['Q3FY25', 'Annual ECL model refresh releases provisions', '₹434 cr release; Stage 3 cover 63% → 51%; flattered FY25 profit'],
      ['Jun-2025', 'Rights issue ₹2,996 cr at ₹194 (1-for-8; 1.67x subscribed)', 'Net worth +24% in FY26; debt ÷ equity 5.7x → 4.9x; lower funding cost'],
      ['Q3FY26', 'Labour codes (₹133 cr one-off); ECL refresh release parked as a ₹635 cr overlay; Aizawl book written off', 'No profit benefit taken from the refresh; Stage 3 −10bp from the write-off'],
      ['Q4FY26', '₹217 cr overlay for West Asia, fuel and monsoon risks', 'FY26 profit +19% (+30% before the overlay)'],
      ['5-Aug-2026', 'Board approves merger of MRHFL into MMFSL (1.8 shares per 10)', '~3.5 lakh new shares; effective 1-Apr-2027 if approved'],
      ['23-Sep-2026', 'IRDAI proposes caps on loan-linked insurance commission', 'Puts part of ₹507 cr of insurance commission (FY26) at risk'],
    ], source: 'Company presentations, calls and annual reports (FY18-FY26); RBI press release (22-Sep-2022); Business Standard (Jan-2023); BQ Prime (May-2024); IndMoney (Sep-2026)' } },
    { pair: [
      { type: 'line', title: 'AUM growth: −6% in FY21, +24% in FY23, slowing since', unit: 'Group AUM growth (%)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'AUM growth', ref: 'fin.aumGrowth', fmt: 'pct' }], labels: 'all', min: -10, max: 30, source: 'Company presentations; GAM estimates' },
      { type: 'column', title: 'Disbursements: tripled from the Covid low, slow since FY24', unit: 'MMFSL disbursements (₹ \'000 crore)', x: AK.filter(k => k.disbursements).map(k => k.fy), series: [{ name: 'Disbursements', values: AK.filter(k => k.disbursements).map(k => Math.round(k.disbursements / 100) / 10), fmt: 'n1' }], labels: 'all', source: 'Company presentations (Q4FY21-Q4FY26)' },
    ] },
  ],
};

module.exports = { business, history, ...require('./M&MFIN.part2b') };
