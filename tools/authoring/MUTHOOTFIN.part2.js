// Muthoot Finance report, part 2: what the company does, history and corporate actions.
const X = require('./MUTHOOTFIN.ctx');
const { C, SG, F, n0, n1, pc, Q1, F26 } = X;
const SUB = C.subsidiaries;
const QN = SG.quarterly.find(q => q.q === 'Q1FY27'), QO = SG.quarterly.find(q => q.q === 'Q1FY26');

const business = {
  id: 'business', nav: 'What Muthoot does', kicker: 'Company', title: 'One product done at scale: loans against household gold jewellery, from 5,029 branches',
  blocks: [
    { p: `Muthoot Finance is India's largest gold-loan NBFC. A customer walks into one of its branches with household jewellery (not coins or bars), the branch tests and weighs it, and pays out a loan of up to 75-85% of its value within minutes. Most loans run 3-12 months; many customers pay the interest and principal at the end ("bullet" loans), renew, or top up when gold rises. If they do not repay, Muthoot auctions the gold, which it did for only 23,830 of ~1 crore loan accounts in FY26. Gold loans are 95% of the standalone book (₹${n0(Q1.goldAumSa)} cr of ₹${n0(Q1.aumSa)} cr in Jun-2026); the rest is small personal, business and property loans, mostly cross-sold to gold customers.` },
    { p: `It earns money like any lender: it borrows at ~8.5-9% (bank loans, listed debentures, dollar bonds, commercial paper), lends at ~18% on average, and keeps the gap after branch costs (~2.3% of loans) and very small losses (0.1-0.4%). In FY26 consolidated interest income was ₹30,371 cr of ₹31,263 cr total income. Customers are small traders, farmers, self-employed and salaried households: 6.58 million active customers, average ticket ~₹1.5 lakh on new loans in FY26. The business is run by the founding family: chairman George Jacob Muthoot and MD George Alexander Muthoot lead a board with seven family executives; the promoter group owns 73.35%.` },
    { exhibit: { type: 'table', title: 'The group: one gold lender and five smaller businesses (Jun-2026)', head: SUB.head, wide: [2], rows: SUB.rows.map(r => [r[0], r[1], r[2], r[3] != null ? n0(r[3]) : '–', r[4] != null ? pc(r[4]) : '–', n0(r[5]), n0(r[6]), n0(r[7]), r[8]]), source: 'Q1FY27 presentation p13, p18-20, p43-54; Q4FY26 presentation; INR/LKR 0.2808 (Jun-26), 0.3008 (FY26)' } },
    { pair: [
      { type: 'stacked', title: 'The gold book is ~90% of group AUM', unit: 'Loan AUM by entity at March (₹ \'000 crore), before intra-group loans', x: [...SG.annual.map(a => a.fy), 'Q1FY27'], series: [
        { name: 'Muthoot Finance (standalone)', values: [...SG.annual, QN].map(a => Math.round(a.mfl / 100) / 10), fmt: 'n1' },
        { name: 'Muthoot Money', values: [...SG.annual, QN].map(a => Math.round(a.mml / 100) / 10), fmt: 'n1' },
        { name: 'Belstar (microfinance)', values: [...SG.annual, QN].map(a => Math.round(a.belstar / 100) / 10), fmt: 'n1' },
        { name: 'Homefin + Asia Asset Finance', values: [...SG.annual, QN].map(a => Math.round((a.homefin + a.aaf) / 100) / 10), fmt: 'n1' },
      ], minLabel: 12, source: 'Q4FY23-Q4FY26 and Q1FY27 presentations' },
      { type: 'column', title: 'Branches: 7,654 across the group', unit: 'Branches, Jun-2026', x: ['Muthoot Finance', 'Belstar', 'Muthoot Money', 'Homefin', 'Asia Asset Finance'], series: [{ name: 'Branches', values: [5029, 1331, 998, 176, 120], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation p7, p45, p48, p52, p54' },
    ] },
    { callout: `**Why this matters:** Muthoot is the closest thing in Indian finance to a single-product utility for small borrowers who own gold. The product is simple, the collateral is liquid and the losses are tiny, so returns are high. But everything flows from one asset, the value of the jewellery: the size of the book, the yield customers will pay, the risk of losses and the competition it attracts. Subsidiaries (12% of AUM, ~10% of profit in Q1FY27) do not change that.` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From an 1887 trading house to India\'s largest gold lender, and one hard lesson in 2012-15',
  blocks: [
    { p: 'The Muthoot family began trading in a Kerala village in 1887 and made its first gold loan in 1939. It became an RBI-registered NBFC in 2001 and listed in 2011. The record since then has two halves. In FY13-FY15 an RBI cap on loan-to-value (60%) and a falling gold price shrank the loan book for five quarters and cut ROE from 30% to 14%. From FY20 to FY26 a rising gold price and branch growth multiplied the book nearly four times. The subsidiaries were bought or built in 2014-2016 and have added breadth but little profit until FY26.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['1939 / 2001', 'First gold loan (Kozhencherry, Kerala); NBFC licence from the RBI', 'Gold lending becomes the core business'],
      ['2011', 'IPO on NSE and BSE, raising ₹901 cr', 'Equity base for national expansion'],
      ['FY13-FY15', 'The RBI\'s 60% LTV cap on NBFC gold loans while the gold price falls; cap relaxed to 75% in Jan-2014', 'Gold book ₹26,000 cr (FY13) → ₹21,618 cr (FY14); PAT ₹1,004 cr → ₹671 cr (FY15); ROE 30% → 14%'],
      ['2014-2016', 'Controlling stake in Asia Asset Finance (Sri Lanka, Dec-2014); ₹418 cr institutional placement (2015); stake in Belstar Microfinance, 79% of Muthoot Homefin, insurance broking (2016)', 'Group structure that exists today; last meaningful equity raise'],
      ['FY20-FY21', 'Covid: gold surges, demand for quick secured credit', 'PAT +51% and +21%; AUM +22% and +24%'],
      ['FY23', 'Gold flat, banks and NBFCs cut gold-loan rates', 'Standalone yield 17.7%; PAT −10%'],
      ['FY25', 'Microfinance stress at Belstar (industry-wide)', 'Group impairment ₹1,576 cr (1.5% of AUM); Belstar AUM −20%'],
      ['6-Jun-2025', 'RBI Directions on lending against gold and silver (in force by 1-Apr-2026)', 'Tiered LTV, 12-month cap on bullet loans, interest counted in LTV'],
      ['FY26', 'Gold +65% (Muthoot\'s rate); renewals and recoveries ahead of the new rules; ₹1,000 cr equity into Muthoot Money', 'AUM +49%, PAT +98%, ROE 31%; dividend ₹30'],
      ['Q4FY26', 'RBI advises borrower-wise (not loan-wise) NPA classification', 'Standalone Stage 3 1.58% (Dec-25) → 2.35% (Mar-26)'],
      ['13-May-2026', 'Gold import duty raised from ~6% to 15%', 'Domestic gold price lifted relative to world prices'],
      ['Q1FY27', 'New repayment products under the RBI rules; rate cuts on some schemes', 'Yield 20.8% → 17.9%; PAT −17% QoQ; stock −14% intraday on 3-Aug'],
    ], source: 'Annual Reports FY2014-15 and FY2025-26 (milestones, directors\' report); company presentations; RBI; BusinessToday' } },
    { pair: [
      { type: 'column', title: 'The 2012-15 lesson: the gold book shrank 17% in a year', unit: 'Standalone gold-loan assets at March (₹ crore)', x: C.goldHistory.rows.map(r => r[0]), series: [{ name: 'Gold loans', values: C.goldHistory.rows.map(r => r[1]), fmt: 'num' }], labels: 'all', source: 'Annual Report FY2014-15 p10' },
      { type: 'line', title: 'AUM growth: 11% in FY23, 49% in FY26', unit: 'Consolidated AUM growth (%)', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'AUM growth', ref: 'fin.aumGrowth', fmt: 'pct' }], labels: 'all', min: 0, max: 55, source: 'Company presentations; GAM estimates' },
    ] },
  ],
};

module.exports = { business, history, ...require('./MUTHOOTFIN.part2b') };
