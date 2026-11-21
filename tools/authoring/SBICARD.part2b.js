// SBI Cards report, part 2b: industry (cards market, competition, regulation) and the tailwind test.
const X = require('./SBICARD.ctx');
const { n0, n1, pc, P, PEERS, shortName, Q1, ASOF_TXT, D } = X;
const LEND = PEERS.filter(p => Number.isFinite(p.roe) && Number.isFinite(p.roa));

const industry = {
  id: 'industry', nav: 'Industry: big runway, slow lane', kicker: 'Industry', title: 'Credit cards in India: ~12 crore cards held by only ~5.5 crore people, and an industry stuck in the slow lane',
  blocks: [
    { p: `India had about 118.6 million credit cards at Mar-2026 (110 million a year earlier) and ~121 million by June 2026; card spends grew ~12% to ₹23.6 lakh crore in FY26 (RBI data, per SBI Card). Penetration is still thin: management puts India's card customers at 52-55 million people, against ~350-400 million with a credit-bureau record and an SBI customer base of 53 crore. PwC projects ~210 million cards and ₹54 lakh crore of annual spends by FY30. The runway is real.` },
    { p: `The last two years were slower. After unsecured-credit stress in FY24-25, issuers tightened underwriting; cards-in-force growth slipped to mid-single digits and "very few new customers are being brought into the fold" (MD, Q4FY26 call): most new cards go to people who already hold one. Spending kept growing, but more of it on corporate cards (thin margins) and on UPI-linked RuPay cards in smaller towns, and fewer customers revolve. Personal loans compete directly: "if he has an option of lower-priced personal loan, he will take a personal loan" (MD, Q1FY27 call), one reason SBI Card's revolver share fell from 24% to 22%.` },
    { exhibit: { type: 'table', title: 'SBI Card in the industry', head: ['', 'FY25', 'FY26', 'Q1FY27 / Jun-26'], rows: [
      ['Industry cards in force (million)', '110', '118.6', '~121'],
      ['SBI Card cards in force (million)', '20.8', '22.1', '22.6'],
      ['SBI Card share of cards', 'n.d.', '18.6%', '18.6%'],
      ['Industry card spends (₹ lakh crore)', 'n.d.', '23.6', 'n.d.'],
      ['SBI Card share of spends', 'n.d.', '18.1%', '19.5%'],
      ['SBI Card net card additions', 'n.d.', 'n.d.', '4.84 lakh (highest in the industry)'],
    ], source: 'RBI data as reported in SBI Card\'s annual report FY26 (p36-37), Q4FY26 and Q1FY27 calls and presentations; n.d. = not disclosed in our sources' } },
    { h: 'Regulation: the rules that move the numbers' },
    { exhibit: { type: 'table', title: 'RBI actions that touch SBI Card', head: ['When', 'Rule', `Status on ${ASOF_TXT}`, 'Effect on SBI Card'], wide: [1, 3], rows: [
      ['Nov-2023', 'Risk weight on NBFC credit-card receivables 100% → 125%', 'In force', 'CAR fell ~4pp; more capital per rupee of receivables'],
      ['Feb-2024', 'Business payments through card networks (BPSP) curbed; rent payments stopped over KYC gaps', 'In force; rent partly resumed with KYC', 'Corporate spends fell sharply, recovered in FY26; rent volumes "very minimal"'],
      ['Mar-2024 (effective Sep-2024)', 'Customers must be offered a choice of card network; no exclusive network deals', 'In force', 'Neutral; SBI Card has leaned into RuPay, which works on UPI'],
      ['Apr-2025', 'Higher risk weight on bank loans to NBFCs reversed', 'In force', 'Eases bank funding costs; SBI lends it ₹19,900 cr'],
      ['Oct-2025 draft; Apr-2026 final for banks', 'Transactor card balances 125% → 100% risk weight (banks from 1-Apr-2027)', 'NBFC version not confirmed', '~40% of receivables are transactor balances: a capital release if extended (press estimate ~450bp)'],
      ['Aug-2026 draft', 'NBFCs to offer only term loans; revolving credit only for NBFCs authorised to issue cards', 'Draft; comments closed', 'Positive: keeps NBFC flexi lines out of the revolving market'],
    ], source: 'RBI circular of 6-Mar-2024; IndiaInfoline (Nov-2023); Business Standard (Mar-2025); Angel One (Oct-2025); ICRA (Apr-2026); Whalesbook (Aug-2026); SBI Card Q1FY27 call' } },
    { pair: [
      { type: 'hbar', title: 'ROE, FY26: SBI Card is mid-table among listed lenders', unit: 'Net profit ÷ average net worth, FY26 (%)', x: LEND.map(p => shortName(p.symbol)), series: [{ name: 'ROE', values: LEND.map(p => Math.round(p.roe * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'SBI Cards', source: 'Screener.in, GAM Research' },
      { type: 'hbar', title: 'ROA, FY26: high for a lender, as card yields are high', unit: 'Net profit ÷ average total assets, FY26 (%)', x: LEND.map(p => shortName(p.symbol)), series: [{ name: 'ROA', values: LEND.map(p => Math.round(p.roa * 100) / 100), fmt: 'n2' }], labels: 'all', highlight: 'SBI Cards', source: 'Screener.in, GAM Research' },
    ] },
    { callout: `**Our view:** the industry will keep growing for a decade; penetration is too low for it not to. The question for SBI Card is share and quality of growth. It has held 18-19% of cards and gained spend share (to ${Q1.spendShare}%), but the profitable part of the business (revolving balances) is under pressure from personal loans and from its own tighter underwriting. Regulation is, for once, tilting slightly in its favour (transactor relief, the NBFC revolving draft).` },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach SBI Card?', title: 'Tailwind test: which trends actually help SBI Card\'s returns?',
  blocks: [
    { p: 'An industry trend only matters to a shareholder if the company turns it into profit. We score each one.' },
    { verdicts: [
      ['Credit cycle turning', 'Yes', 'Gross credit cost 9.5% (Q1FY26) → 6.5% (Q1FY27); GNPA 3.07% → 2.04%; Stage 2 at a post-COVID low; first-bucket entry rates at a "decadal low".', 'The single biggest driver of FY27-28 profit in our model.'],
      ['Card penetration and spend growth', 'Partly', 'Industry cards +8% in FY26, spends +12%; SBI Card spends +29%, new accounts +17% in Q1.', 'Spends turn into fees, but receivables (where the margin is) grew only 2-3%.'],
      ['Online and co-brand spending', 'Yes', 'Online is 63% of retail spends; Flipkart, Tata Neu, IndiGo, PhonePe, BPCL (5 million cards) co-brands.', 'Brings engaged, credit-tested customers at a lower acquisition cost than open-market sourcing.'],
      ['UPI on RuPay credit cards', 'Partly', 'UPI spends +13% QoQ; 80% of UPI-active cards in Tier 2+ towns.', 'More transactions and activation, but thinner interchange; supports volume more than profit.'],
      ['Corporate card spends', 'Partly', 'Corporate spends +125% YoY in Q1 to ~20% of spends.', 'Adds fee income with "comparatively thinner" margins (pass-back costs); lifted cost-to-income from 51.8% to 55.3%.'],
      ['Lower interest rates', 'Partly', 'Cost of funds fell 82bp YoY to 6.4% in Q4FY26; 6.5% in Q1FY27.', 'Management now expects funding costs to drift up with market rates.'],
      ['Personal loans and NBFC consumer finance', 'No', 'Cheaper personal loans and NBFC EMI loans take revolve and big-ticket EMI business.', 'A structural cap on the revolver share (22%) and on yields.'],
      ['Regulation', 'Partly', 'Transactor relief (if extended to NBFCs), NBFC revolving-credit draft exempts card issuers; but 125% risk weights stay and BPSP curbs hit corporate spends.', 'Net slightly positive from here; not in our base case.'],
    ], head: ['Trend', 'Helps?', 'Evidence', 'So what'], title: 'Tailwind scorecard: the credit turn helps most; personal-loan competition pushes back', source: 'Company presentations and calls (Q4FY26, Q1FY27); annual report FY26; GAM Research' },
    { callout: '**Our view:** the trend that matters most in FY27-28 (lower credit costs) is cyclical. The structural tailwinds (penetration, online spending, co-brands) show up mainly in spends and fee income, while the structural headwind (personal loans eating revolve) hits the highest-margin balances. That is why our ROE recovers to ~17%, not to the 22-26% SBI Card earned when revolvers were a quarter of the book and growth was 25%+.' },
  ],
};

module.exports = { industry, tailwind };
