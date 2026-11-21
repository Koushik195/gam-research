// Muthoot Finance report, part 2b: industry (gold-loan market, competition, regulation) and the tailwind test.
const X = require('./MUTHOOTFIN.ctx');
const { C, D, n0, n1, P, PEERS, shortName, ASOF_TXT, goldMoveSinceJun } = X;
const LEND = PEERS.filter(p => p.roe != null && Number.isFinite(p.roe));
const RG = C.regulation;

const industry = {
  id: 'industry', nav: 'Industry: big, growing, crowding', kicker: 'Industry', title: 'Gold loans: a ₹15-16 lakh crore market growing with the gold price, and suddenly crowded',
  blocks: [
    { p: `Indian households hold about 34,600 tonnes of gold, of which only ~3,000 tonnes are pledged for loans (CRISIL, IBEF). The organised gold-loan market (banks and NBFCs) was projected at ₹15-16 lakh cr for FY26, up a third in a year (CRISIL, ICRA). Banks hold most of it (~₹16 lakh cr including farm gold loans, against ~₹4 lakh cr at NBFCs, per Muthoot's MD), often at lower rates; NBFCs win on speed, branch reach and willingness to lend without paperwork. Among NBFCs Muthoot has ~47% of the market (CRISIL, Jan-2026). About 70% of gold loans are still made in the four southern states, but growth is moving north and west.` },
    { p: `**The competitive change of 2025-26.** For the first time, deep-pocketed AAA-rated NBFCs have entered gold lending at scale. Jefferies (10-Sep-2026) counts ₹61,900 cr of gold loans at new entrants in Jun-2026, 2.5x a year earlier and 7.6% of retail gold loans, and ~3,700 new-entrant branches planned for FY27 (vs ~1,500 in FY26), about 20% of the top four gold NBFCs' network. Bajaj Finance alone had ₹21,200 cr and targets ~₹30,000 cr by Mar-27. Muthoot's MD is dismissive ("they are not focused gold loan players ... some of them will lose interest"), but his CFO conceded on 1-Aug-2026 that a rate war is "quite possible".` },
    { pair: [
      { type: 'hbar', title: 'ROE, FY26: Muthoot earns far more than other listed lenders', unit: 'Net profit ÷ average net worth, FY26 (%)', x: LEND.map(p => shortName(p.symbol)), series: [{ name: 'ROE', values: LEND.map(p => Math.round(p.roe * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'Muthoot Finance', source: 'Screener.in (consolidated), GAM Research' },
      { type: 'hbar', title: 'ROA, FY26: secured, short loans with tiny losses', unit: 'Net profit ÷ average total assets, FY26 (%)', x: LEND.map(p => shortName(p.symbol)), series: [{ name: 'ROA', values: LEND.map(p => Math.round(p.roa * 100) / 100), fmt: 'n2' }], labels: 'all', highlight: 'Muthoot Finance', source: 'Screener.in (consolidated), GAM Research' },
    ] },
    { h: 'Regulation: the RBI\'s gold-loan directions (in force from 1-Apr-2026)' },
    { exhibit: { type: 'table', title: 'What the RBI\'s Lending Against Gold and Silver Collateral Directions, 2025 changed', head: ['Rule', 'What it says', 'Effect on Muthoot'], wide: [1, 2], rows: [
      ['Loan-to-value', RG.ltvTiers, 'More room on small loans (most of Muthoot\'s customers); only 3-5% of Q1FY27 disbursements used the 85% tier; most still borrow at ~75%'],
      ['Bullet loans', RG.bullet, 'Bullet loans now lend less up front (12 months of interest is counted in LTV); Muthoot launched monthly, quarterly and EMI products and pushes customers to service interest at least quarterly'],
      ['Valuation', RG.valuation, 'Standard, slightly conservative pricing of collateral across lenders'],
      ['Quantity limits', RG.limits, 'Negligible for a ₹1.5 lakh average ticket'],
      ['Auctions', RG.auction, 'Muthoot already auctions little (23,830 accounts in FY26); more process, small cost'],
      ['Return of gold', RG.release, 'Customer protection; penalises sloppy operators more than Muthoot'],
    ], source: 'RBI notification (6-Jun-2025, updated 29-Sep-2025, paras 4-46); Annual Report FY2025-26 MD&A; Q1FY27 call' } },
    { callout: `**Our view:** the market will keep growing as long as gold holds its value, and the new rules favour large, well-run lenders. But the economics are changing in two ways. First, competition is now coming from lenders with cheaper funding (Bajaj Finance's cost of funds was 7.4% in Q1FY27 against ~8.75% at Muthoot, per Motilal Oswal) and big balance sheets. Second, the old practice of letting interest pile up on a 12-month bullet loan, which suited customers and lenders alike, is gone: LTV now includes that interest. Both push yields down. Gold itself was ~${Math.round(goldMoveSinceJun)}% above its end-June level on ${ASOF_TXT}, after a 15% rally in August and a 3% fall in September.` },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach Muthoot?', title: 'Tailwind test: the gold price is the only tailwind that really matters',
  blocks: [
    { p: 'An industry trend only matters to a shareholder if the company turns it into profit. We score each one.' },
    { verdicts: [
      ['Rising gold price', 'Yes', `The standalone gold book grew 3.8x in FY20-26 while the tonnes pledged rose only 11%; FY26: book +50%, tonnes −6%. The new 15% import duty (13-May-2026) lifts the domestic price further.`, 'The single biggest driver of AUM and profit; it works in reverse too.'],
      ['Shift from unsecured to secured credit', 'Yes', 'Banks and NBFCs pulled back from unsecured personal loans in FY25-26; borrowers turned to gold loans (AR FY2025-26 MD&A); RBI data show retail gold loans +80% YoY (Jul-2026, per Jefferies).', 'Brought new, larger-ticket customers: loans above ₹3 lakh rose from 51% to 69% of the book in one quarter.'],
      ['Formalisation of gold lending (RBI directions)', 'Partly', 'Tiered LTV up to 85% for small loans; standard valuation and auction rules; informal lenders lose ground.', 'Positive in the long run; the transition cost was a yield cut and a Stage 2 spike in Q1FY27.'],
      ['North, east and west India', 'Yes', 'South fell from 84% of Muthoot\'s gold book in FY07 to 48% in Q1FY27; 500-600 new group branches in FY27.', 'Long runway; new branches take 2-3 years to mature.'],
      ['Lower interest rates', 'No', 'Interest cost rose 14bp in Q1FY27 (7.38% → 7.52% of average loans); CFO expects no cut; 17% of funding is dollar bonds.', 'No funding tailwind in our model.'],
      ['Digital (iMuthoot app)', 'Partly', '26% of interest repayments and 18% of top-ups via the app in Q1FY27; 27 million downloads.', 'Lowers servicing cost; does not change the branch-based origination model.'],
      ['Microfinance recovery (Belstar)', 'Partly', 'Belstar back to ₹66 cr profit in Q1FY27 (loss of ₹128 cr a year earlier); Stage 3 down from 5.5% to 2.9%.', 'Helps group profit by ~2%; the book is not growing.'],
      ['New competitors', 'No', 'New entrants\' gold loans 2.5x in a year; ~3,700 new branches planned in FY27.', 'Pressure on yields and on the best customers.'],
    ], head: ['Trend', 'Helps?', 'Evidence', 'So what'], title: 'Tailwind scorecard: gold carries the story; competition and funding push back', source: 'Company presentations and calls; Annual Report FY2025-26; Jefferies (10-Sep-2026); GAM Research' },
    { callout: '**Our view:** strip out the gold price and Muthoot is a mature franchise growing in the mid-teens with falling yields. That is still a very good business (ROE in the 20s), but most of FY25-26\'s spectacular growth was the collateral getting more valuable, not more collateral. Our base case holds gold flat at the 30-Sep-2026 level; the bull and bear cases are, above all, gold-price cases.' },
  ],
};

module.exports = { industry, tailwind };
