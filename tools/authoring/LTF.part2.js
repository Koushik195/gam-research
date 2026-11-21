// L&T Finance report, part 2: what the company does, history and corporate actions. Industry and the tailwind test
// are in part2b.
const X = require('./LTF.ctx');
const { C, SG, F, A, fin, fi, n0, n1, pc, Q1, QN, QO, unsec } = X;

const lineRows = [
  ['rgl', 'Rural women in joint-liability groups (JLG): small income-generating loans; LTF lends only to borrowers with no overdue and at most two other lenders'],
  ['farm', 'Tractor and farm-equipment loans through 2,750 dealers; non-captive, across the top five tractor makers'],
  ['mlap', 'Small loans against a rural home, sold to graduating group-loan customers; 150-200 new branches planned in FY27'],
  ['tw', 'Two-wheeler loans through ~8,900 dealer points; 90% of Jun-2026 disbursements to "prime" customers (Cyclops)'],
  ['pl', 'Salaried personal loans, mostly through CRED, Google Pay, PhonePe and Amazon; ticket ₹2.6-2.8 lakh, yield ~16%'],
  ['hl', 'Home loans to salaried and self-employed buyers; the only floating-rate book'],
  ['lap', 'Loans against residential or commercial property to small businesses'],
  ['sme', 'Unsecured and secured business loans to self-employed professionals and traders; CGTMSE cover on the riskiest cohort'],
  ['gold', 'Bought from Paul Merchants in Jun-2025 (130 branches); 343 branches in Jun-2026, ~500 more planned in FY27'],
  ['acq', 'Retail pools bought from other lenders'],
  ['whl', 'Legacy infrastructure (₹1,257 cr) and real-estate (₹841 cr) loans in run-off; no new lending'],
];
const nm = Object.fromEntries(SG.lines.map(l => [l.key, l.name])), sec = Object.fromEntries(SG.lines.map(l => [l.key, l.secured]));
const grp = a => [a.farm + a.rgl + a.mlap, a.tw + a.pl + a.hl + a.lap, a.sme + a.gold + a.acq, a.whl];
const periods = [...SG.annual, { ...QN, fy: 'Q1FY27' }];

const business = {
  id: 'business', nav: 'What LTF does', kicker: 'Company', title: 'A rural-and-urban retail lender with 2.9 crore customers, built on the L&T name',
  blocks: [
    { p: `L&T Finance is the lending arm of Larsen & Toubro, India's largest engineering and construction group, which owns 66%. It is an upper-layer NBFC (the RBI's tier for the largest non-bank lenders), takes no public deposits and is rated AAA by all four domestic agencies, a rating the agencies tie to L&T's support. It makes money the way every lender does: on our measures it borrowed at ~6.7% in FY26 (the company's own weighted cost of borrowing was 7.35%), lent at ~15%, earned another ~1.2% of the book in fees (mostly commission for selling insurance), and kept what was left after operating costs (~4.0%) and credit losses (~2.5%). In FY26 interest income was ₹16,616 cr of its ₹17,914 cr revenue, and net profit ₹2,983 cr.` },
    { p: `It serves two very different customers. **Rural** (39% of the book): women borrowing ₹40,000-1,00,000 in joint-liability groups through 2,184 meeting-centre branches in ~2 lakh villages, farmers buying tractors, and micro-LAP. **Urban** (61%, incl. SME and gold): two-wheeler buyers, salaried personal-loan customers sourced through big-tech apps, home loans and LAP, small businesses and, since Jun-2025, gold-loan customers. Unsecured lending (group loans, personal and SME loans) is ~${n0(unsec(QN))}% of the book, more than at any large NBFC except Bajaj Finance and SBI Cards.` },
    { exhibit: { type: 'table', title: 'Eleven lines of business: size, growth and what they are (Jun-2026)', head: ['Business', 'Book (₹ cr)', 'YoY', 'Share', 'Secured?', 'What it is'], wide: [5], rows: [
      ...lineRows.map(([k, what]) => [nm[k], n0(QN[k]), k === 'gold' || k === 'mlap' ? pc((QN[k] / QO[k] - 1) * 100) + '*' : pc((QN[k] / QO[k] - 1) * 100), `${n1(QN[k] / QN.total * 100)}%`, sec[k] ? 'Yes' : 'No', what]),
      { hl: true, cells: ['**Total**', `**${n0(QN.total)}**`, `**${pc((QN.total / QO.total - 1) * 100)}**`, '**100%**', '', `Retail ₹${n0(Q1.retailBook)} cr (98%)`] },
    ], source: 'Q1FY27 presentation p25, p44, p48; Q1FY27 call (13-Jul-2026). *small base' } },
    { pair: [
      { type: 'stacked', title: 'Rural and urban retail have replaced the wholesale book', unit: 'Book by group (₹ \'000 crore), March; Q1FY27 = Jun-2026', x: periods.map(a => a.fy), series: [
        { name: 'Rural (group loans, farm, micro-LAP)', values: periods.map(a => Math.round(grp(a)[0] / 100) / 10), fmt: 'n1' },
        { name: 'Urban (2W, PL, HL, LAP)', values: periods.map(a => Math.round(grp(a)[1] / 100) / 10), fmt: 'n1' },
        { name: 'SME, gold, acquired', values: periods.map(a => Math.round(grp(a)[2] / 100) / 10), fmt: 'n1' },
        { name: 'Wholesale', values: periods.map(a => Math.round(grp(a)[3] / 100) / 10), fmt: 'n1' },
      ], minLabel: 8, source: 'Company presentations Q4FY23-Q1FY27' },
      { type: 'line', title: 'The three "fulcrum" products, built over a decade', unit: 'Book at March (₹ \'000 crore)', x: SG.productHistory.fy, series: [
        { name: 'Rural group loans', values: SG.productHistory.rgl.map(v => Math.round(v / 100) / 10), fmt: 'n1' },
        { name: 'Farm equipment', values: SG.productHistory.farm.map(v => Math.round(v / 100) / 10), fmt: 'n1' },
        { name: 'Two-wheelers', values: SG.productHistory.tw.map(v => Math.round(v / 100) / 10), fmt: 'n1' },
      ], labels: 'ends', source: 'Q4FY26 presentation p61-63' },
    ] },
    { callout: `**Why this matters:** LTF is really two lenders under one brand. The rural franchise (group loans, tractors) is large, old and profitable in good years, but it has had a loss cycle every three to four years (demonetisation 2016, Covid 2020-21, over-indebtedness 2024-25). The urban franchise is newer and is where growth now comes from: personal loans, gold and LAP grew 38-182% in the year to Jun-2026. Neither has a cheap-money advantage; the L&T name buys a AAA rating, not deposits.` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a wholesale-heavy holding company to a retail lender, at the cost of a lost decade',
  blocks: [
    { p: 'L&T Finance Holdings listed in 2011 as the holding company for L&T\'s lending, mutual-fund and wealth businesses. Until FY21 more than half of its book was infrastructure and real-estate lending. When that book soured after 2018, the company ran a four-year clean-up: it raised ~₹3,000 cr in a rights issue (FY21), sold the wealth business (L&T Capital Markets, Apr-2020) and the mutual-fund business (Nov-2022), sold most wholesale loans to asset-reconstruction companies for security receipts (FY23), merged its lending subsidiaries into the listed company (Dec-2023) and renamed itself L&T Finance (2024). The pattern for shareholders: book value per share grew only ~9% a year from FY19 to FY26, and the share price did not pass its Sep-2017 high (₹193) until Jun-2025.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['FY19-FY21', 'IL&FS default (2018) and Covid hit infrastructure, real-estate and microfinance loans', 'Credit losses ₹3,636 cr in FY21 (3.8% of the book); ROE 5.8%'],
      ['FY21', '~₹3,000 cr rights issue (46.1 cr shares)', 'Equity capital ₹2,005 cr → ₹2,469 cr; ROE diluted'],
      ['Apr-2022', 'Lakshya 2026 plan: retail >95%, ROA 2.8-3.0%', 'Retail 51% → 98% by FY26; ROA goal missed (2.40%)'],
      ['Nov-2022', 'Mutual-fund business sold to HSBC Asset Management', '₹2,575 cr gain (FY23, discontinued operations)'],
      ['FY23', 'Wholesale book reclassified for accelerated sale; much of it sold to ARCs', '₹2,687 cr fair-value loss; continuing operations lost ₹729 cr; wholesale ₹43,257 cr → ₹19,840 cr'],
      ['Dec-2023', 'Lending subsidiaries merged into the listed company; renamed L&T Finance', 'One balance sheet; holding-company structure gone'],
      ['Jan-2024', 'Sudipta Roy (ex-ICICI Bank) becomes MD & CEO', 'Tech/AI-led underwriting (Cyclops from Q4FY25)'],
      ['FY25', 'Microfinance over-indebtedness cycle', 'Credit cost 3.8% in Q4FY25 before ₹850 cr of macro-prudential releases over four quarters; EPS +14%'],
      ['Jun-2025', 'Gold-loan business of Paul Merchants bought (₹712 cr)', '₹1,335 cr book, 130 branches; ₹182 cr goodwill'],
      ['Apr-2026', 'Lakshya 2031: 20%+ growth, ROA 3.0-3.2%, ROE 16-18%; payments platform', 'Opex stays 3.75-4.0% of book through FY31'],
      ['23-Sep-2026', 'IRDAI proposes caps on loan-linked insurance commission', 'Puts much of ₹1,047 cr of distribution income at risk; stock −15% in two weeks'],
    ], source: 'Annual Reports FY22, FY24, FY26; company presentations; BusinessToday (24-Sep-2026)' } },
    { pair: [
      { type: 'line', title: 'Book growth: four years of shrinkage, then 14-25%', unit: 'Consolidated book growth (%)', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'Book growth', ref: 'fin.aumGrowth', fmt: 'pct' }], labels: 'all', min: -15, max: 30, source: 'Company presentations; GAM estimates' },
      { type: 'column', title: 'Retail share of the book', unit: 'Retail ÷ total book at March (%)', x: C.annualKpis.map(k => k.fy), series: [{ name: 'Retail share', values: C.annualKpis.map(k => k.retailShare), fmt: 'pct0' }], labels: 'all', min: 0, max: 100, source: 'Company presentations' },
    ] },
  ],
};

module.exports = { business, history, ...require('./LTF.part2b') };
