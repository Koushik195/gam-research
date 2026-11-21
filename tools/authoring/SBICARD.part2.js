// SBI Cards report, part 2: what the company does, history and corporate actions. Industry and tailwind in part2b.
const X = require('./SBICARD.ctx');
const { C, SG, F, A, AK, n0, n1, pc, Q1, K26 } = X;
const QN = SG.quarterly.find(q => q.q === 'Q1FY27');

const business = {
  id: 'business', nav: 'What SBI Card does', kicker: 'Company', title: 'A pure-play card issuer: it earns on every swipe, and more on the customers who do not pay in full',
  blocks: [
    { p: `SBI Cards and Payment Services (SBI Card) issues credit cards and nothing else; it has no subsidiaries and one reportable segment. It is India's second-largest issuer, with ${Q1.cifCr} crore cards in force (an ${Q1.cifShare}% share in June 2026) and ${Q1.spendShare}% of national card spends. State Bank of India owns 68.6%. The company is regulated by the RBI as a non-deposit-taking NBFC, which matters: it cannot take deposits, so it funds itself with bank loans, commercial paper and bonds, and it is subject to NBFC capital rules (minimum capital 15% of risk-weighted assets).` },
    { p: `A card issuer earns money in three ways. **Interest** from customers who do not pay their full bill (revolvers, who pay card interest rates well above a personal loan's) or who convert purchases into instalments (EMI). **Fees on spending**: every time a card is used, the merchant's bank pays the issuer an interchange fee on the bill (1.19% of spends on average for SBI Card in FY26), so spend volume matters even when the customer pays in full. **Other fees**: annual and joining fees, late-payment fees, cash-advance and foreign-exchange charges, and incentives from the card networks (Visa, Mastercard, RuPay). Against that it pays for funding (~6.5%), for rewards, marketing and processing (spend-linked costs that rise with every swipe) and for bad debts.` },
    { exhibit: { type: 'table', title: 'How SBI Card made ₹2,167 cr in FY26', head: ['Line (₹ crore)', 'FY26', '% of average receivables', 'What drives it'], wide: [3], rows: [
      ['Interest income (incl. ₹414 cr on investments)', n0(K26.interestIncome), `${n1(K26.interestIncome / K26.avgReceivablesYearEnd * 100)}%`, 'Revolve and EMI balances (55% of receivables); investments held for liquidity'],
      ['Interchange', n0(K26.interchange), `${n1(K26.interchange / K26.avgReceivablesYearEnd * 100)}%`, `Spends ₹4.3 lakh cr × ~${(K26.interchange / X.spends26 * 100).toFixed(2)}%`],
      ['Late, cash and other fees', n0(K26.feeBased), `${n1(K26.feeBased / K26.avgReceivablesYearEnd * 100)}%`, 'Delinquencies (late fees fall as credit improves), cash and forex use'],
      ['Membership and network incentives, other', n0(K26.membership + K26.bdIncentive + K26.saleOfServices + K26.insurance), `${n1((K26.membership + K26.bdIncentive + K26.saleOfServices + K26.insurance) / K26.avgReceivablesYearEnd * 100)}%`, 'Cards in force; network contracts'],
      ['− Finance cost', `(${n0(K26.financeCost)})`, `${n1(K26.financeCost / K26.avgReceivablesYearEnd * 100)}%`, 'Borrowings ₹44,064 cr at ~6.7%'],
      ['− Operating cost', `(${n0(K26.opexTotal)})`, `${n1(K26.opexTotal / K26.avgReceivablesYearEnd * 100)}%`, `Rewards ₹${n0(K26.rewardPoints)} cr, promotion ₹${n0(K26.salesPromotion)} cr, card fees paid ₹${n0(K26.feeCommissionExpense)} cr, processing, staff (4,218 people)`],
      ['− Impairment (write-offs + provisions)', `(${n0(K26.impairment)})`, `${n1(K26.impairment / K26.avgReceivablesYearEnd * 100)}%`, `Write-offs ₹${n0(K26.writeOffs)} cr`],
      ['+ Other income (recoveries ₹686 cr)', n0(K26.otherIncome), `${n1(K26.otherIncome / K26.avgReceivablesYearEnd * 100)}%`, 'Collections on loans already written off'],
      { hl: true, cells: ['**Profit before tax / after tax**', `**${n0(K26.pbt)} / ${n0(K26.pat)}**`, `**${n1(K26.pbt / K26.avgReceivablesYearEnd * 100)}% / ${n1(K26.pat / K26.avgReceivablesYearEnd * 100)}%**`, 'Tax 25.6%'] },
    ], source: 'Annual report FY26, P&L (p313) and notes 24-31; averages of March balances (GAM)' } },
    { pair: [
      { type: 'stacked', title: 'Spends: corporate cards are back to ~20%', unit: 'Card spends by type (₹ \'000 crore), quarterly', x: SG.quarterly.map(q => q.q), series: [{ name: 'Retail', values: SG.quarterly.map(q => Math.round(q.retail / 100) / 10), fmt: 'n1' }, { name: 'Corporate', values: SG.quarterly.map(q => Math.round(q.corporate / 100) / 10), fmt: 'n1' }], minLabel: 8, source: 'Q4FY26 and Q1FY27 presentations' },
      { type: 'column', title: 'New cards: back above 10 lakh a quarter', unit: 'New accounts (lakh)', x: C.quarterlyKpis.map(q => q.q), series: [{ name: 'New accounts', values: C.quarterlyKpis.map(q => q.newAccountsLakh), fmt: 'n1' }], labels: 'all', highlight: 'Q1FY27', source: 'Q4FY26 and Q1FY27 presentations' },
    ] },
    { callout: `**Why this matters:** a card issuer is part lender, part payments business. The payments half (interchange, fees) grows with spending and carries little credit risk; the lending half (revolve, EMI) earns the margin but carries the losses. SBI Card's mix has tilted towards payments: transactors (who pay in full) were ${Q1.mix.transactor}% of receivables in Q1FY27 against 40% a year earlier, and corporate cards (no lending at all) supplied about half of FY26's 29% spend growth. That is safer, but it earns less per rupee of receivables.` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a GE joint venture to a listed SBI subsidiary, through two credit cycles',
  blocks: [
    { p: 'SBI Card was set up in 1998 as a joint venture of State Bank of India and GE Capital. GE sold its 40% in December 2017 (SBI took 14%, Carlyle\'s CA Rover 26%); the company listed in March 2020, days before the Covid lockdown, as India\'s first pure-play listed card issuer. Carlyle sold down in 2021. The decade since 2016 shows two credit cycles (Covid in FY21, the unsecured-lending hangover in FY25-26), a burst of growth in between, and a string of regulatory changes that each moved the numbers.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['Dec-2017', 'GE Capital sells its 40% to SBI (14%) and CA Rover / Carlyle (26%)', 'SBI control; growth push through SBI branches'],
      ['Mar-2020', 'IPO and listing on BSE and NSE (16-Mar-2020)', 'First listed pure-play issuer; equity base for growth'],
      ['FY21', 'Covid: lockdowns and loan moratorium', 'Spends −6%; GNPA 4.99%; credit cost ~11% (our basis); profit −21%'],
      ['Jun-2021', 'Carlyle cuts its stake below 10%', 'Free float rises; overhang ends'],
      ['FY22-FY24', 'Fast growth: receivables +25-30% a year, 35-52 lakh new cards a year', 'Profit peaks at ₹2,408 cr (FY24); ROE 22-26%'],
      ['Nov-2023', 'RBI raises the risk weight on NBFC card receivables from 100% to 125%', 'CAR fell ~4pp (company estimate); 20.5% at Mar-24'],
      ['Feb-2024', 'RBI curbs business payments routed through card networks (BPSP)', 'Corporate spends collapse; low in Q1FY26 (₹10,840 cr)'],
      ['FY25', 'Unsecured-credit stress: write-offs ₹4,732 cr (+64%)', 'Credit cost 9.1%; profit −20% to ₹1,916 cr; ROE 14.8%'],
      ['Apr-2025', 'Salila Pande (SBI) becomes MD & CEO for two years', 'Focus on credit quality, banca channel and co-brands'],
      ['FY26', 'Corporate spends recover (+195% in Q4); credit cost starts falling', 'Spends +29%, receivables +2%; profit +13%'],
      ['Q1FY27', 'Credit cost 6.5%, ECL model refresh absorbs ₹180 cr of the ₹220 cr overlay', 'Profit +20% to ₹664 cr; ROE 16.5%'],
    ], source: 'Annual reports FY20-FY26; company presentations and calls; Business Standard (Jun-2021, Feb-2025); IndiaInfoline (Nov-2023)' } },
    { pair: [
      { type: 'line', title: 'Receivables growth: 30% to 2% in three years', unit: 'Growth in gross receivables (%)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Receivables growth', ref: 'fin.aumGrowth', fmt: 'pct' }], labels: 'all', min: 0, max: 40, source: 'Annual reports; GAM estimates' },
      { type: 'column', title: 'Cards in force doubled since FY20', unit: 'Cards in force (million), March', x: ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'Jun-26'], series: [{ name: 'Cards', values: [...['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => AK[l].cifMm), 22.6], fmt: 'n1' }], labels: 'all', highlight: 'Jun-26', source: 'Annual reports FY21, FY26; Q1FY27 presentation' },
    ] },
  ],
};

module.exports = { business, history, ...require('./SBICARD.part2b') };
