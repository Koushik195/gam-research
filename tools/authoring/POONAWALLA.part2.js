// Poonawalla Fincorp report, part 2: what the company does, history and corporate actions. Industry and the
// tailwind test are in part2b.
const X = require('./POONAWALLA.ctx');
const { C, SG, F, A, fin, n0, n1, pc, pc1, Q1 } = X;

const PR = C.products, QN = SG.quarterly.find(q => q.q === 'Q1FY27'), QO = SG.quarterly.find(q => q.q === 'Q4FY26');
const F26 = C.fy26, fee26 = F26.revenueOps - F26.interestIncome;
const business = {
  id: 'business', nav: 'What Poonawalla does', kicker: 'Company', title: 'A consumer and small-business lender rebuilt around thirteen products, half of them secured',
  blocks: [
    { p: `Poonawalla Fincorp is a non-deposit-taking NBFC (a lender regulated by the RBI that cannot take public deposits). It lends to salaried and self-employed individuals and small businesses, and to mid-sized companies and other NBFCs. Like every lender it earns the gap between what it charges and what it pays: in FY26 interest income was ${n1(F26.interestIncome / fin.avgAum[X.fi('FY26')] * 100)}% of average AUM, borrowing cost ~7.4-7.7%, operating costs 4.4% and loan losses 2.5%. Of FY26 revenue of ₹${n0(F26.revenueOps)} cr, ₹${n0(F26.interestIncome)} cr was interest and ₹${n0(fee26)} cr fees and other income (fees and commission incl. insurance cross-sell ₹${n0(F26.feeCommission)} cr, gains on selling loans ₹${n0(F26.derecognitionGain)} cr).` },
    { p: `The book has two halves. **Secured** loans (53% in Jun-2026): loans against property (28% of AUM, the largest product), pre-owned car loans, gold loans, used commercial vehicles and machinery and medical equipment. **Unsecured** loans (47%): "instant" digital consumer loans sold through fintech partners (19%, at 22-29% interest), personal loans to employees of large companies ("Prime PL"), business and professional loans and consumer-durable EMI loans. Mid-market loans to rated companies and NBFCs (15%) and education loans for students abroad (2%) complete it. At Mar-2026 the company had 5,860 employees, 500+ branches (400 of them gold-loan branches; 460 by Jul-2026), 2,700+ channel partners and 50+ digital partners.` },
    { exhibit: { type: 'table', title: 'Thirteen products: size, growth and pricing (₹ crore)', head: ['Product', 'Mar-26', 'Jun-26', 'QoQ growth', 'Share Jun-26', 'Typical rate', 'Launched / type'], wide: [6], rows: [
      ...PR.rows.map(([nm, m, j, r, t]) => [nm, n0(m), n0(j), m > 1 ? pc1((j / m - 1) * 100) : 'n.m.', `${n1(j / QN.total * 100)}%`, r, t]),
      ['Discontinued book', n0(QO.disc), n0(QN.disc), pc((QN.disc / QO.disc - 1) * 100), `${n1(QN.disc / QN.total * 100)}%`, '–', 'running off'],
      { hl: true, cells: ['**Total AUM**', `**${n0(QO.total)}**`, `**${n0(QN.total)}**`, `**${pc((QN.total / QO.total - 1) * 100)}**`, '**100%**', '', `secured ${QN.securedPct}%`] },
    ], source: 'Q4FY26 and Q1FY27 presentations (product tables p12-13); new products launched FY25-FY26' } },
    { pair: [
      { type: 'stacked', title: 'Mix: LAP and digital loans dominate; new products are 16%', unit: 'AUM by group (₹ \'000 crore)', x: ['Mar-26', 'Jun-26'], series: [
        { name: 'Secured retail (LAP, cars, gold, CV, equipment)', values: [QO, QN].map(q => Math.round((q.lap + q.car + q.gold + q.cv + q.mme) / 100) / 10), fmt: 'n1' },
        { name: 'Unsecured retail (instant, Prime PL, business, professional, CD)', values: [QO, QN].map(q => Math.round((q.instant + q.primePl + q.bl + q.prof + q.cd + q.shop) / 100) / 10), fmt: 'n1' },
        { name: 'Mid-market', values: [QO, QN].map(q => Math.round(q.mid / 100) / 10), fmt: 'n1' },
        { name: 'Education and discontinued', values: [QO, QN].map(q => Math.round((q.edu + q.disc) / 100) / 10), fmt: 'n1' },
      ], minLabel: 2, source: 'Q4FY26 and Q1FY27 presentations (GAM grouping)' },
      { type: 'hbar', title: 'New products: ₹10,665 cr in Jun-2026, up 29% in the quarter', unit: 'AUM, Jun-2026 (₹ crore)', x: ['Prime personal loans', 'Gold loans', 'Education loans', 'Commercial vehicles', 'Consumer durables'], series: [{ name: 'AUM', values: [QN.primePl, QN.gold, QN.edu, QN.cv, QN.cd], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation p12' },
    ] },
    { callout: `**Why this matters:** Poonawalla is no longer a lender whose growth hangs on one product: in FY25 its fastest-growing book, digital small-ticket personal loans (21% of loans in Sep-2024), blew up. Management calls it "6 growth engines mounted on a single chassis", each tied to a different borrower and economic driver. That is a real improvement in diversification. But two things have not changed: almost half the book is unsecured, and most of it is young. Products launched in 2024-25 have not yet been through a full credit cycle, so today's low delinquencies are partly a function of age.` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From Magma to Poonawalla: a takeover, a flattering sale, a blow-up and a reset in five years',
  blocks: [
    { p: 'The current business is only two years old. Each phase changed the numbers sharply, which is why the stock\'s own history (and its multiples) needs careful reading.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['Mar-May 2021', 'Rising Sun Holdings (Adar Poonawalla) buys control of Magma Fincorp: 49.4 cr new shares at ₹70 (₹3,456 cr, of which ₹3,206 cr from Rising Sun), ~60% stake; renamed Poonawalla Fincorp', 'Equity jumps from ~₹2,200 cr to ~₹6,000 cr (FY22); ratings to AAA over time'],
      ['Sep-2021 to Jun-2022', 'MD Abhay Bhutada resigns after a SEBI interim insider-trading order; reinstated in Feb-2022; SEBI revokes the interim order against him in Jun-2022', 'Governance scare; no financial impact'],
      ['Dec-2022 / Jul-2023', 'Housing arm (now Grihum Housing Finance) sold to TPG at a ₹3,900 cr valuation', 'FY24 exceptional gain ₹2,309 cr, used alongside a ₹1,298 cr provision and ₹175 cr write-off on the old Magma book (net ₹817 cr)'],
      ['FY23-FY24', 'Provision write-backs on the legacy book; FY24 long-term guidance of ROA 4-4.5%', 'Credit cost −₹134 cr (FY23) and ₹72 cr (FY24); ROA 5.7% in Q4FY24: not repeatable'],
      ['Jun-2024', 'Arvind Kapil (ex-HDFC Bank) becomes MD & CEO; Bhutada retires', 'Strategy reset: "risk-first", six new products'],
      ['Q2FY25', '₹666 cr accelerated provision on the erstwhile short-ticket personal loan (STPL) book', 'Q2 loss ₹471 cr; FY25 loss ₹98 cr; STPL 21% → 8% of on-book AUM by Mar-2025'],
      ['FY25-FY26', 'Prime PL (Aug-2024), gold, consumer durables, CV, education and shopkeeper loans launched; 400 gold branches by Mar-2026', 'Opex/AUM peaks at 4.8% (Q1-Q2FY26); AUM +69% in FY26'],
      ['Sep-2025', '₹1,500 cr preferential issue to Rising Sun at ₹452.51', 'Promoter stake to ~64%; 3.31 cr new shares'],
      ['Apr-2026', '₹2,500 cr QIP at ₹370.75 (floor ₹390.26)', '6.74 cr new shares (8% of the base); debt-to-equity 4.67x → 3.82x'],
      ['Q1FY27', 'PAT ₹308 cr, ROA 1.98%, credit cost 2.40%', 'Best quarter since the reset'],
    ], source: 'Company filings and presentations; Annual Reports FY25-FY26 (note 41); TPG, Business Standard, Business Today' } },
    { pair: [
      { type: 'column', title: 'Equity raised three times in five years', unit: 'New equity (₹ crore) by financial year', x: ['FY22', 'FY26', 'FY27 (Apr-26)', 'FY28E (GAM)'], series: [{ name: 'Equity raised', values: [3456, 1500, 2500, X.RAISE], fmt: 'num' }], labels: 'all', highlight: 'FY28E (GAM)', source: 'Company filings; FY28E is our assumption (not announced)' },
      { type: 'column', title: 'AUM growth: 69% in FY26, guided 35-40%', unit: 'AUM growth (%)', x: 'fin.labels', from: 'FY24', to: 'FY29E', series: [{ name: 'AUM growth', ref: 'fin.aumGrowth', fmt: 'pct0' }], labels: 'all', source: 'Company presentations; GAM estimates' },
    ] },
    { callout: '**The lesson from history:** the stock has twice been priced for returns the business did not then earn: in 2023-24 on write-back-flattered profits and a 4-4.5% ROA guide, and again today on a 3-3.5% target. The FY25 blow-up happened in a product (digital small-ticket loans) that was growing fastest. The new team deserves credit for the clean-up; it has not yet shown a full cycle.' },
  ],
};

module.exports = { business, history, ...require('./POONAWALLA.part2b') };
