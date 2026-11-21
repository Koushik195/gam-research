// Cholamandalam report, part 2: what the company does, history and corporate actions. Industry and the
// tailwind test are in part2b.
const X = require('./CHOLAFIN.ctx');
const { C, SG, F, A, fin, fi, n0, n1, pc, Q1 } = X;

const QN = SG.quarterly.find(q => q.q === 'Q1FY27'), QO = SG.quarterly.find(q => q.q === 'Q1FY26');
const SEG = Object.fromEntries(C.segments.rows.map(r => [r[0], r]));
const lineRows = [
  ['Vehicle finance', 'vf', 'Vehicle finance', 'New and used CVs, cars and MUVs, tractors, 2W/3W, construction equipment; small road-transport operators in small towns'],
  ['Loan against property', 'lap', 'Loan against property', 'Loans to small businesses secured on their home or shop; average ticket falling as it goes deeper'],
  ['Home loans', 'hl', 'Home loans (affordable)', 'Affordable housing for self-employed and salaried buyers in tier 3-6 towns'],
  ['CSEL', 'csel', 'CSEL (consumer & small-enterprise loans)', 'Unsecured personal, business and professional loans plus consumer-durable finance; fintech partnerships shut in FY25-26'],
  ['SME loans', 'sme', 'SME loans', 'Term and working-capital loans to small manufacturers and traders'],
  ['SBPL', 'sbpl', 'SBPL (secured business & personal loans)', 'Small-ticket loans (<₹20 lakh) secured on property, to micro-merchants; highest yield'],
  ['Gold loans', 'gold', 'Gold loans', 'Launched in FY26; 171 stand-alone branches in Jun-2026, 360 more planned'],
];

const business = {
  id: 'business', nav: 'What Chola does', kicker: 'Company', title: 'A small-town lender with eight businesses, built on a vehicle-finance network',
  blocks: [
    { p: `Cholamandalam Investment and Finance (Chola) is the lending arm of the Murugappa group, a Chennai conglomerate whose listed companies include Coromandel International, Tube Investments and Carborundum Universal. It is an upper-layer NBFC (the RBI's tier for the largest non-bank lenders) and does not take public deposits. It makes money the way every lender does: it borrows at ~7.4% (our measure, FY26), lends at ~14% on average, earns another ~1.3% of loans in fees (mostly insurance commission and loan fees), and keeps what is left after operating costs (~3.2% of loans) and loan losses (~1.5-1.7%). In FY26 interest income was ₹28,403 cr of its ₹31,073 cr revenue.` },
    { p: `Its customers are small road-transport operators, farmers, self-employed traders and small manufacturers in small towns: 87% of its 1,820 branches are in tier 3-6 towns, and it served 5.2 million customers in Jun-2026. Vehicle finance is the original business and the network everything else runs on: the LAP, home-loan, CSEL, SBPL and SME teams sit inside vehicle-finance branches. Only gold loans have stand-alone branches. Group holding company Cholamandalam Financial Holdings owns 43.7%; the promoter group 49.2%.` },
    { exhibit: { type: 'table', title: 'Seven lending businesses: size, growth, asset quality and returns (Jun-2026)', head: ['Business', 'AUM (₹ cr)', 'YoY', 'Share', 'Stage 3', 'Yield', 'Credit cost', 'Pre-tax ROA', 'What it is'], wide: [8], rows: [
      ...lineRows.map(([nm, k, s, what]) => { const r = SEG[s]; return [nm, n0(QN[k]), k === 'gold' ? 'n.m.' : pc((QN[k] / QO[k] - 1) * 100), `${n1(QN[k] / QN.total * 100)}%`, `${r[3].toFixed(2)}%`, r[4] != null ? `${n1(r[4])}%` : '15-17%*', r[5] != null ? `${n1(r[5])}%` : '–', r[6] != null ? `${n1(r[6])}%` : '–', what]; }),
      { hl: true, cells: ['**Total**', `**${n0(QN.total)}**`, `**${pc((QN.total / QO.total - 1) * 100)}**`, '**100%**', `**${Q1.stage3.toFixed(2)}%**`, '14.9%', '1.5%', '3.7%', ''] },
    ], source: 'Q1FY27 presentation p13, p18, p22, p40-73 (Q1FY27 ratios as % of each segment\'s assets); *gold yield per the Q1 call' } },
    { pair: [
      { type: 'stacked', title: 'From a vehicle financier to a mixed book', unit: 'Business AUM by business (₹ \'000 crore), March; Q1FY27 = Jun-2026', x: [...SG.annual.map(a => a.fy), 'Q1FY27'], series: [
        { name: 'Vehicle finance', values: [...SG.annual, QN].map(a => Math.round(a.vf / 100) / 10), fmt: 'n1' },
        { name: 'LAP', values: [...SG.annual, QN].map(a => Math.round(a.lap / 100) / 10), fmt: 'n1' },
        { name: 'Home loans', values: [...SG.annual, QN].map(a => Math.round(a.hl / 100) / 10), fmt: 'n1' },
        { name: 'New businesses (CSEL, SME, SBPL, gold)', values: [...SG.annual, QN].map(a => Math.round((a.csel + a.sme + a.sbpl + a.gold) / 100) / 10), fmt: 'n1' },
      ], minLabel: 12, source: 'Q4FY24 presentation p21; Q1FY27 presentation p13' },
      { type: 'column', title: 'Reach: 2,452 branches and resident locations', unit: 'Branches + resident locations (RLH), March', x: C.annualKpis.map(k => k.fy), series: [{ name: 'Locations', values: C.annualKpis.map(k => k.branches), fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation p10' },
    ] },
    { callout: `**Why this matters:** Chola is one network selling seven products, which keeps costs down (new businesses borrow vehicle-finance branches) and lets growth shift between products. In FY24-FY25, when vehicle demand slowed, LAP, home loans and SBPL carried growth; in FY26-27 vehicles came back. The flip side: the new products are riskier (CSEL lost 6.3% of its loans in FY26) or not yet seasoned (SME, SBPL, gold), and all of them lean on the same small-town borrower whose cash flows move with the farm and freight cycle.` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Five decades in vehicles, five years of diversification, and two capital raises',
  blocks: [
    { p: 'Chola started in 1978 as an equipment lessor, was in a joint venture with Singapore\'s DBS Bank in 2006-2011, and spent most of its history as a vehicle financier with LAP on the side. Home loans started in 2013. The decisive step was FY22-23, when it launched three new businesses at once (CSEL, SBPL, SME) and grew AUM 38% in FY23 and 37% in FY24. The record shows a pattern: equity is raised every few years to fund a growth spurt (FY20, FY24), and credit costs rise when the vehicle cycle turns (FY20-21, FY25-26) but have never wiped out profit.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['FY20', 'Equity raise: a ~₹900 cr QIP in Feb-2020 (Government of Singapore among investors); a capital-infusion year in the company record', 'Book +32%; ROE 15% with Covid provisions'],
      ['FY21-22', 'Covid moratorium, then the RBI\'s Nov-2021 NPA norms', 'Credit cost 2.0% of assets in FY21; RBI-norm GNPA jumped to 6.8% in FY22'],
      ['FY22-23', 'Launch of CSEL, SBPL and SME; upper-layer NBFC status', 'AUM +38% in FY23; cost-to-income up from 32% to 40%'],
      ['Oct-2023', 'Composite QIP: ₹2,000 cr equity + ₹2,000 cr 7.5% CCDs', 'Book +37% in FY24; CCDs converted Oct-2025 to Sep-2026'],
      ['Oct-2024 / Apr-2025', 'Ravindra Kundu MD; Vellayan Subbiah executive chairman', 'Management continuity; family executive at the top'],
      ['FY25-26', 'Fintech-partnership CSEL book shut down; vehicle down-cycle', 'Credit cost 1.4% → 1.7% of assets; FY26 guidance (1.3%) missed'],
      ['FY26', 'Gold loans launched (119 branches by Mar-26)', 'Start-up loss ~₹99 cr (derived)'],
      ['22-Dec-2025', 'Cobrapost alleges related-party routing and large cash deposits', 'Denied; stock −4-6%, then +6% after an investor call'],
      ['Q4FY26', '₹200 cr overlay for West Asia / fuel risks', '9bp of assets; kept intact in Q1FY27'],
      ['Q1FY27', 'Disbursements recognised at cheque clearance', 'Lower reported HL/LAP/SBPL disbursements; marginally higher yields'],
      ['23-Sep-2026', 'IRDAI proposes caps on loan-linked insurance commission', 'Puts part of ₹1,136 cr of commission income (FY26) at risk'],
      ['30-Sep-2026', 'Last ₹430 cr of CCDs converted at ₹1,407.59', '85.75 cr shares; all ₹2,000 cr now equity'],
    ], source: 'Company presentations, calls and annual reports; NSE filings; Business Standard (Feb-2020, Dec-2025); IndMoney (Sep-2026)' } },
    { pair: [
      { type: 'line', title: 'AUM growth: 38% in FY23 to 21% in FY26', unit: 'Business AUM growth (%)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'AUM growth', ref: 'fin.aumGrowth', fmt: 'pct' }], labels: 'all', min: 0, max: 45, source: 'Company presentations; GAM estimates' },
      { type: 'column', title: 'Disbursements: 4.4x in six years', unit: 'Disbursements (₹ \'000 crore)', x: C.annualKpis.map(k => k.fy), series: [{ name: 'Disbursements', values: C.annualKpis.map(k => Math.round(k.disbursements / 100) / 10), fmt: 'n1' }], labels: 'all', source: 'Q1FY27 presentation p10' },
    ] },
  ],
};

module.exports = { business, history, ...require('./CHOLAFIN.part2b') };
