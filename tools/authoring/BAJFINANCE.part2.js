// Bajaj Finance report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./BAJFINANCE.ctx');
const { C, SG, F, A, n0, n1, pc, Q1, P, PEERS, shortName, b } = X;

const QN = SG.quarterly.find(q => q.q === 'Q1FY27'), QO = SG.quarterly.find(q => q.q === 'Q1FY26');
const AQ = Object.fromEntries(SG.assetQualityJun26.rows.map(r => [r[0], r]));
const lineRows = [
  ['Mortgages (BHFL + BFL)', 'mortgages', 'Mortgages'], ['Urban personal loans', 'urbanPl', 'Urban personal loans'], ['Urban consumer finance', 'urbanCf', 'Urban consumer finance'],
  ['Rural (consumer, personal, MFI)', 'rural', 'Rural personal loans'], ['MSME incl. CV & tractor', 'msme', 'MSME'], ['Loans against securities', 'las', 'Loans against securities'],
  ['Commercial (mid-corporates)', 'commercial', 'Commercial'], ['Gold loans', 'gold', 'Gold loans'], ['Car loans', 'car', 'Car loans'], ['Two- and three-wheelers', 'twoW', 'Open-market 2W & 3W'],
];

const business = {
  id: 'business', nav: 'What Bajaj Finance does', kicker: 'Company', title: 'A diversified consumer and small-business lender with a deposit licence and 124 million customers',
  blocks: [
    { p: `Bajaj Finance (BFL) is India's largest non-bank lender (NBFC). It describes itself as "a diversified non-bank with a deposit taking license", focused on "mass and affluent" customers. It earns money the way every lender does: it borrows at ~7.4% (Q1FY27 cost of funds), lends at ~15-16% on average, and keeps the gap after operating costs (~3.8% of loans) and loan losses (~1.5-2%). In FY26 interest was ₹72,776 cr of its ₹81,990 cr income and fees and other income ₹9,214 cr (insurance distribution, fees on loans and cards, payments).` },
    { p: `The group has three lending arms. **Bajaj Finance** itself (AUM ₹4.00 lakh cr in Jun-2026) runs consumer, personal, small-business, gold, microfinance, vehicle and commercial loans. **Bajaj Housing Finance** (BHFL, listed, 86.7% owned, AUM ₹1.50 lakh cr) does home loans, loans against property, lease-rental discounting and developer finance. **Bajaj Financial Securities** (100%) does broking and margin-trade finance (₹9,770 cr). Bajaj Finserv, the group holding company, owns 51.3% of BFL; the promoter group 54.7%.` },
    { exhibit: { type: 'table', title: 'Ten lending businesses: size, growth and asset quality (Jun-2026)', head: ['Business', 'AUM (₹ cr)', 'YoY growth', 'Share of AUM', 'Gross NPA', 'What it is'], wide: [5], rows: [
      ...lineRows.map(([nm, k, aq]) => [nm, n0(QN[k]), pc((QN[k] / QO[k] - 1) * 100), `${n1(QN[k] / QN.total * 100)}%`, AQ[aq] ? `${AQ[aq][2].toFixed(2)}%` : '–',
        { mortgages: 'Home loans 47%, LAP 23%, lease rental 20%, developer 10%', urbanPl: 'Salaried, pre-approved and flexi personal loans; cross-sell to own customers', urbanCf: 'EMI finance for durables, phones, lifestyle at ~1.3 lakh stores; EMI card (97.7 MM cards)', rural: 'Consumer and personal loans in 2,558 rural towns; 447 MFI branches', msme: 'Unsecured business and professional loans, secured enterprise LAP; pruned since Jul-2025', las: 'Loans against shares and funds, IPO finance, margin trade finance', commercial: 'Working capital and term loans to mid-sized companies', gold: '1,701 branches, adding ~110 a month; 2,700-2,800 by Mar-27', car: 'New and used car loans; 3,000+ dealers', twoW: 'Open-market 2W/3W (captive book running off: ₹3,209 cr, gross NPA 15%)' }[k]]),
      { hl: true, cells: ['**Total**', `**${n0(QN.total)}**`, `**${pc((QN.total / QO.total - 1) * 100)}**`, '**100%**', `**${Q1.gnpa.toFixed(2)}%**`, ''] },
    ], source: 'Q1FY27 presentation p54-57 (GAM grouping; open-market 2W NPA shown for the 2W row)' } },
    { pair: [
      { type: 'stacked', title: 'Mix: mortgages plus personal and consumer loans are two-thirds', unit: 'Consolidated AUM by business (₹ \'000 crore)', x: [...SG.annual.map(a => a.fy), 'Q1FY27'], series: [
        { name: 'Mortgages', values: [...SG.annual, QN].map(a => Math.round(a.mortgages / 100) / 10), fmt: 'n1' },
        { name: 'Personal & consumer (urban + rural)', values: [...SG.annual, QN].map(a => Math.round((a.urbanPl + a.urbanCf + a.rural) / 100) / 10), fmt: 'n1' },
        { name: 'MSME, commercial, LAS', values: [...SG.annual, QN].map(a => Math.round((a.msme + a.commercial + a.las) / 100) / 10), fmt: 'n1' },
        { name: 'Gold, car, 2W', values: [...SG.annual, QN].map(a => Math.round((a.gold + a.car + a.twoW) / 100) / 10), fmt: 'n1' },
      ], minLabel: 30, source: 'Q4FY24-Q4FY26 and Q1FY27 presentations (GAM grouping)' },
      { type: 'column', title: 'Reach: 4,073 locations and ~2.5 lakh points of sale', unit: 'Active distribution points (\'000), June each year', x: ['Jun-23', 'Jun-24', 'Jun-25', 'Jun-26'], series: [{ name: 'Points of sale', values: [167.1, 207.2, 238.8, 249.75], fmt: 'n1' }], labels: 'all', source: 'Q1FY27 presentation p52' },
    ] },
    { callout: `**Why this matters:** Bajaj Finance is not one business but ten, each priced for its own risk: from loans against shares and gold (near-zero losses) to unsecured personal and small-business loans (where most of the losses sit). The group can shift growth between them, which is exactly what it did in FY26 (pruning MSME, pushing gold and consumer finance). The cost is that the blended yield falls as safer books grow.` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Two decades of compounding, punctuated by Covid, the regulator and capital raises',
  blocks: [
    { p: 'AUM compounded 34% a year from FY08 to FY26 (company snapshot). The record shows a pattern: growth outruns retained profit, so equity is topped up every few years; the regulator steps in when processes lag growth (2023); and credit costs spike in bad years (FY20-21, FY25-26) but have never wiped out profit.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['FY18 / FY20', 'Equity raises of ₹4,538 cr and ₹8,568 cr', 'Leverage reset; ROE dipped to 20% in FY20'],
      ['FY21', 'Covid: lockdown, moratorium', 'Loan losses 4.03% of AUF; profit −16%; ROE 12.8%'],
      ['Nov-2023', 'RBI stops eCOM and Insta EMI Card lending (no key fact statements); lifted May-2024', 'Six months of lost digital originations; a reputational warning'],
      ['Nov-2023', 'RBI raises risk weights on unsecured consumer credit to 125%', 'More capital per rupee of personal loans; still in force'],
      ['Q3FY24', 'Equity raise of ₹9,097 cr', 'Book +41% in FY24; ROE fell from 23.5% to 22.1%'],
      ['Sep-2024', 'BHFL IPO (₹3,560 cr fresh issue; BFL sold ₹3,000 cr in the offer)', 'BHFL stays consolidated; minority interest appears (₹142 cr in FY25)'],
      ['Jun-2025', '1:2 split and 4:1 bonus', 'Ten shares for one; all per-share data adjusted'],
      ['Jul-2025', 'MD Anup Saha quits after four months; Rajeev Jain back as Vice-Chairman & MD to Mar-2028', 'Succession question reopened'],
      ['FY26', 'MSME pruning; ₹1,406 cr accelerated provision, ₹265 cr Labour Code charge, ₹142 cr overlay; ~2% of BHFL sold', 'AUM growth 22% (guided 24-25%); PAT +15% (+24% before one-offs)'],
      ['Q4FY26', 'Recoveries of written-off loans moved from income to loan losses', 'Lower NTI and credit cost, no profit effect; ratios restated'],
      ['Q1FY27', '₹296 cr macro overlay; profit +28%, ROE 20.4%', 'Credit cost 1.54% (1.31% before overlay)'],
      ['6-Aug-2026', 'RBI draft: NBFCs to offer only term loans, no revolving credit', 'Flexi loans (~13-15% of AUM per brokers) at risk; stock −6% on 7-Aug'],
      ['24-Sep-2026', 'Board to consider an equity raise (QIP and/or preferential)', 'Size not given; stock −5% that day'],
    ], source: 'Company presentations and filings; Screener.in cash flows; press (BusinessToday, CNBC-TV18, Whalesbook)' } },
    { pair: [
      { type: 'column', title: 'Equity raised every few years', unit: 'Proceeds from share issues (₹ crore, cash-flow statement)', x: ['FY16', 'FY18', 'FY20', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Equity raised', values: [1425, 4538, 8568, 9067, 1251, 436], fmt: 'num' }], labels: 'all', source: 'Screener.in cash flow ("proceeds from shares"); FY25-26 amounts are smaller allotments whose split is not in our sources' },
      { type: 'line', title: 'AUM growth: 34% in FY24 to 22% in FY26', unit: 'Consolidated AUM growth (%)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'AUM growth', ref: 'fin.aumGrowth', fmt: 'pct' }], labels: 'all', min: 0, max: 45, source: 'Company presentations; GAM estimates' },
    ] },
  ],
};

module.exports = { business, history, ...require('./BAJFINANCE.part2b') };
