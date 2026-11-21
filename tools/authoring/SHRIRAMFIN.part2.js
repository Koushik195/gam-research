// Shriram Finance report, part 2: what the company does, history and corporate actions. Industry and tailwind test in part2b.
const X = require('./SHRIRAMFIN.ctx');
const { C, SG, F, A, n0, n1, pc, Q1, MU } = X;

const QN = SG.quarterly.find(q => q.q === 'Q1FY27'), QO = SG.quarterly.find(q => q.q === 'Q1FY26');
const AQ = Object.fromEntries(SG.assetQuality.rows.map(r => [r[0], r]));
const DB = C.disbursementsQ1FY27;
const lineRows = [
  ['Commercial vehicles', 'cv', 'Commercial vehicles', 'Used and new trucks, tippers, buses and LCVs for small fleet owners and first-time buyers; new vehicles ~16% of disbursements'],
  ['Passenger vehicles', 'pv', 'Passenger vehicles', 'Used and new cars, utility vehicles and three-wheelers, often for taxi and commercial use'],
  ['MSME', 'msme', 'MSME', 'Business loans to small traders and manufacturers, mostly in the South; secured and unsecured'],
  ['Two-wheelers', 'twoW', 'Two-wheelers', 'New two-wheeler loans through dealers (from Shriram City Union)'],
  ['Construction equipment', 'ce', 'Construction equipment', 'Excavators, loaders and cranes for contractors; shrinking since FY25'],
  ['Personal loans', 'pl', 'Personal loans', 'Small unsecured loans, so far mainly to existing two-wheeler customers'],
  ['Gold', 'gold', 'Gold', 'Loans against jewellery; ~2,200 branches gold-ready'],
  ['Farm equipment', 'farm', 'Farm equipment', 'Tractor loans to farmers'],
];

const business = {
  id: 'business', nav: 'What Shriram does', kicker: 'Company', title: 'A truck financier for people banks will not lend to, now with small-business, gold and two-wheeler books attached',
  blocks: [
    { p: `Shriram Finance (SFL) lends mainly to the self-employed: small truck owners with one to five vehicles, first-time buyers of a used truck, taxi drivers, small traders and farmers. Most have thin credit records and little paperwork, so banks avoid them. Shriram's edge, built since 1979, is that it can value a ten-year-old truck, knows the borrower's route and customers, and collects in cash if it must. It borrows at ~8.6% (cost of liabilities, Jun-2026), lends at ~16.5-17%, spends ~2.8% of loans on 78,902 staff and 3,225 branches, and loses ~1.9% of loans a year to bad debts. FY26 income was ₹48,133 cr, of which interest ₹46,658 cr.` },
    { p: `The business is still mostly wheels: ${n1((QN.cv + QN.pv + QN.ce + QN.farm + QN.twoW) / QN.total * 100)}% of AUM is vehicles or equipment. The Dec-2022 merger with Shriram City Union Finance added MSME loans, two-wheelers, gold and personal loans (now ~25% of AUM). Two-thirds of branches (2,042 of 3,225) are in places with fewer than one lakh people, and they hold ${n0(SG.branchAum.jun26.semiUrbanRural / (SG.branchAum.jun26.metro + SG.branchAum.jun26.urban + SG.branchAum.jun26.semiUrbanRural) * 100)}% of AUM. Two small group companies sit alongside: Shriram Automall India (44.6% owned), which auctions repossessed and used vehicles, and Shriram Overseas Investments (100%), which has an in-principle RBI licence to become a primary dealer in government bonds.` },
    { exhibit: { type: 'table', title: 'Eight lending lines: size, growth and asset quality (Jun-2026)', head: ['Product', 'AUM (₹ cr)', 'YoY growth', 'Share of AUM', 'Q1FY27 disbursed (₹ cr)', 'Gross Stage 3', 'What it is'], wide: [6], rows: [
      ...lineRows.map(([label, k, aq, what]) => [label, n0(QN[k]), pc((QN[k] / QO[k] - 1) * 100), `${n1(QN[k] / QN.total * 100)}%`, n0(DB[k]), AQ[aq] ? `${AQ[aq][3].toFixed(2)}%` : '–', what]),
      { hl: true, cells: ['**Total**', `**${n0(QN.total)}**`, `**${pc((QN.total / QO.total - 1) * 100)}**`, '**100%**', `**${n0(DB.total)}**`, `**${Q1.gnpa.toFixed(2)}%**`, ''] },
    ], source: 'Q1FY27 investor update p7-17; Q1FY27 call (disbursements by product, S. Sunder)' } },
    { pair: [
      { type: 'stacked', title: 'Mix: commercial vehicles gaining share, equipment shrinking', unit: 'AUM by product (₹ \'000 crore), quarter-end', x: SG.quarterly.map(q => q.q), series: [
        { name: 'Commercial vehicles', values: SG.quarterly.map(q => Math.round(q.cv / 100) / 10), fmt: 'n1' },
        { name: 'Passenger vehicles', values: SG.quarterly.map(q => Math.round(q.pv / 100) / 10), fmt: 'n1' },
        { name: 'MSME', values: SG.quarterly.map(q => Math.round(q.msme / 100) / 10), fmt: 'n1' },
        { name: 'Other (2W, gold, PL, CE, farm)', values: SG.quarterly.map(q => Math.round((q.twoW + q.gold + q.pl + q.ce + q.farm) / 100) / 10), fmt: 'n1' },
      ], minLabel: 20, source: 'Q4FY26 investor update p9; Q1FY27 investor update p7' },
      { type: 'column', title: 'Rural and semi-urban branches hold 59% of AUM', unit: 'AUM by branch location, Jun-2026 (₹ \'000 crore)', x: ['Metro (10 lakh+)', 'Urban (1-10 lakh)', 'Semi-urban & rural (<1 lakh)'], series: [{ name: 'AUM', values: [SG.branchAum.jun26.metro, SG.branchAum.jun26.urban, SG.branchAum.jun26.semiUrbanRural].map(v => Math.round(v) / 10), fmt: 'n1' }], labels: 'all', source: 'Q1FY27 investor update p20 (population of the branch location)' },
    ] },
    { callout: '**Why this matters:** Shriram earns a high yield because it takes risks others will not: old vehicles, informal incomes, rural cash flows. It has survived every truck cycle since 1979 by pricing that risk and collecting relentlessly, but its loan losses and bad-loan ratios will always be higher than a consumer lender\'s like Bajaj Finance. The non-vehicle books from the merger diversify it, but they are where asset quality has slipped in the past year (MSME, gold, personal loans).' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Four decades of truck finance, one transforming merger, one asset sale and a 20% strategic investor',
  blocks: [
    { p: 'The record shows a lender that grew slowly and safely as a standalone truck financier, then changed shape twice in four years: the 2022 merger that made it a diversified retail lender, and the 2026 MUFG investment that made it a well-capitalised, AAA-rated one. Each change moved the numbers in ways that make simple comparisons misleading, so we list them.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['1979', 'Shriram Transport Finance (STFC) founded to finance used trucks', 'Built the valuation and collection model the company still runs on'],
      ['Aug-2020 / Jun-2021', 'Rights issue ₹1,492 cr; QIP ₹1,999 cr (Covid)', 'Equity raised as loan losses hit ~3% of AUM; ROE fell to 11-13% (FY21-FY22)'],
      ['FY2022-23', 'Shriram City Union Finance and Shriram Capital merged into STFC (appointed date 1-Apr-2022); renamed Shriram Finance', 'AUM ₹1.27 to ₹1.86 lakh cr; profit ₹2,721 to ₹6,020 cr; EPS +60%; adds MSME, gold, 2W, PL; ₹1,189 cr goodwill'],
      ['11-Dec-2024', 'Shriram Housing Finance (84.4%) sold to Warburg Pincus for ₹3,929 cr', '₹1,489 cr after-tax gain in FY25 (EPS ₹51.92 reported, ₹44.00 before it); minority interest gone'],
      ['10-Jan-2025', '1:5 share split (face value ₹10 to ₹2)', 'Five shares for one; all per-share data adjusted'],
      ['Dec-2025', 'Y. S. Chakravarti completes his term as MD & CEO; Parag Sharma (ex-CFO) becomes MD & CEO, S. Sunder Joint MD & CFO', 'Internal succession; Sharma recommended for five more years from 13-Dec-2026'],
      ['19-Dec-2025', 'MUFG Bank agrees to buy 20% via a ₹39,618 cr preferential issue at ₹840.93', 'Approved by shareholders on 14-Jan-2026'],
      ['8-Apr-2026', 'MUFG shares allotted; ICRA, CRISIL and India Ratings upgrade to AAA; Fitch to BBB-', 'Equity ₹65,919 cr (Mar-26) to ₹1.08 lakh cr (Jun-26); leverage 3.8x to 2.1x; incremental funding cost 7.77%'],
      ['Q1FY27', 'PAT +60% to ₹3,445 cr; NIM 9.04%; ROE 12.8%', '~₹500 cr of NII from the new capital in one quarter'],
    ], source: 'Company annual reports (FY22, FY26), results filings and calls; Business Standard (11-Dec-2024, 23-Dec-2024)' } },
    { pair: [
      { type: 'column', title: 'MUFG\'s money dwarfs every earlier raise', unit: 'Equity raised (₹ crore)', x: C.equityHistory.map(e => e[0]), series: [{ name: 'Equity raised', values: C.equityHistory.map(e => e[2]), fmt: 'num' }], labels: 'all', source: 'FY26 annual report p22-23 (company timeline)' },
      { type: 'line', title: 'AUM growth: 5-9% as STFC, 15-21% since the merger', unit: 'AUM growth (%); FY23 jump is the merger', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'AUM growth', ref: 'fin.aumGrowth', fmt: 'pct' }], labels: 'all', min: 0, max: 50, source: 'Company annual reports; GAM estimates' },
    ] },
  ],
};

module.exports = { business, history, ...require('./SHRIRAMFIN.part2b') };
