// Bajaj Housing Finance report, part 2b: industry (mortgage market, listed housing-finance peers, regulation)
// and the tailwind test.
const X = require('./BAJAJHFL.ctx');
const { C, n0, n1, pc, P, HFC_SYMS, shortName, ASOF_TXT } = X;
const HF = [...HFC_SYMS, 'BAJAJHFL'].map(s => P[s]);
const byAssets = [...HF].sort((a, c) => c.assetsCr - a.assetsCr);
const REG = C.products.regulatory;

const industry = {
  id: 'industry', nav: 'Industry: banks set the price', kicker: 'Industry', title: 'Housing finance in India: a long runway, a slow year, and banks that set the price',
  blocks: [
    { p: `India's home-loan market is large and under-penetrated, but it is not growing fast right now. The industry's individual home loans grew only 9.4% in FY26 against the 11-12% BHFL normally expects, and management sees 9-10.5% in FY27: after two years in which buyers rushed to lock in rising property prices, prices have stopped rising and purchases are being postponed, a "stabilisation phase" in the MD's words (Q1FY27 call). BHFL grows 2x the market by taking share, not because the market is booming.` },
    { p: `Prime home loans are a bank product. Banks fund them with cheap current and savings deposits that an HFC cannot take, so they set the price and HFCs follow: "in the prime housing we exactly compete with all the banks including SBI, HDFC" (MD, Q4FY26 call). About 20% of BHFL's home-loan book leaves every year, half of it refinanced away by other lenders (balance transfers), mostly to public-sector banks. That is why every listed housing-finance company has drifted toward higher-yield niches: loans against property, affordable housing, construction finance.` },
    { exhibit: { type: 'table', title: `Listed housing-finance companies at the ${ASOF_TXT} close`, head: ['Company', 'Total assets FY26 (₹ cr)', 'Market value (₹ cr)', 'P/B (x)', 'P/E (x)', 'ROE FY26', 'ROA FY26', 'Revenue growth FY26'], rows: byAssets.map(p => [p.symbol === 'BAJAJHFL' ? '**Bajaj Housing Finance**' : shortName(p.symbol), n0(p.assetsCr), n0(p.mcapCr), n1(p.pb), n1(p.pe), `${n1(p.roe)}%`, `${n1(p.roa)}%`, pc(p.revG)]), source: `Screener.in (standalone for BHFL, Can Fin, Aavas, Home First; consolidated for the rest); trailing multiples scaled to the NSE close on ${ASOF_TXT}; ROE and ROA on average FY25-26 balances` } },
    { pair: [
      { type: 'hbar', title: 'ROE, FY26: BHFL earns the least in the group', unit: 'Net profit ÷ average net worth, FY26 (%)', x: [...HF].sort((a, c) => c.roe - a.roe).map(p => shortName(p.symbol)), series: [{ name: 'ROE', values: [...HF].sort((a, c) => c.roe - a.roe).map(p => Math.round(p.roe * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'Bajaj Housing Finance', source: 'Screener.in, GAM Research' },
      { type: 'hbar', title: 'Market value: BHFL is worth more than LIC Housing and PNB Housing combined', unit: `Market value at the ${ASOF_TXT} close (₹ \'000 crore)`, x: [...HF].sort((a, c) => c.mcapCr - a.mcapCr).map(p => shortName(p.symbol)), series: [{ name: 'Market value', values: [...HF].sort((a, c) => c.mcapCr - a.mcapCr).map(p => Math.round(p.mcapCr / 100) / 10), fmt: 'n1' }], labels: 'all', highlight: 'Bajaj Housing Finance', source: 'Screener.in, NSE closes; GAM Research' },
    ] },
    { h: 'Regulation: two rules that shape BHFL' },
    { exhibit: { type: 'table', title: 'Rules that bind BHFL', head: ['Rule', 'What it requires', 'Where BHFL stands', 'Effect'], wide: [1, 3], rows: [
      ['Principal business criteria (RBI/NHB)', 'At least 60% of total assets in housing finance and 50% in loans to individuals for housing', `${REG.FY26.pbc}% and ${REG.FY26.ihlPbc}% at Mar-26 (${REG.FY25.pbc}% and ${REG.FY25.ihlPbc}% a year earlier); 61.46% overall in Jun-26`, 'Commercial loans (35% of AUM) can only outgrow home loans if BHFL sells loans off the balance sheet, which it does (assignments ~12-13% of AUM)'],
      ['Upper-layer NBFC (scale-based regulation)', 'Bank-like governance, capital and disclosure; mandatory listing', 'Classified in FY23; listed Sep-2024; CRAR 21.59% vs 15%', 'Forced the IPO and the float rule below'],
      ['Minimum public shareholding (Securities Contracts Rules)', '25% of shares with the public', 'Public 13.3%; deadline extended (13-Mar-2026) to 15-Sep-2029', 'The parent must sell ~11.7% more (see the sell-down chapter)'],
      ['NHB supervision', 'Thematic reviews (e.g. how lenders set their reference rate)', '"We don\'t see any impact" (MD, Q1FY27 call); BHFL has charged interest only from cheque encashment for six years', 'Low risk today; worth watching'],
    ], source: 'Annual Report FY2025-26 (MD&A table 8, directors\' report); Q1FY27 presentation and call' } },
    { callout: `**Our view:** demand is not BHFL's constraint; price and regulation are. In prime home loans it competes with lenders that have a structurally cheaper liability, so its margin on that half of the book will stay thin. It earns more on lease-rental, developer and near-prime loans, but the 50% individual-housing floor (it is at ${REG.FY26.ihlPbc}%) caps how far it can tilt the balance sheet toward them.` },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach BHFL?', title: 'Tailwind test: commercial property and efficiency help; rates and banks do not',
  blocks: [
    { p: 'An industry trend only matters to a shareholder if the company turns it into profit. We score each one.' },
    { verdicts: [
      ['Housing demand and home-loan growth', 'Partly', 'Industry home loans +9.4% in FY26; BHFL home loans +18% (FY26) and +20% (Q1FY27) by taking share.', 'Volume yes, margin no: share is won at bank-level prices.'],
      ['Lower interest rates (FY25-FY26 cut cycle)', 'No', 'Repo-linked loans (~₹17,000 cr) and lending-rate cuts repriced the book down; funding costs fell more slowly; portfolio yield 9.8% → 8.9% in two years.', 'NIM −20-25bp in FY27; management says the cutting cycle is over.'],
      ['Office, warehouse and REIT growth', 'Yes', 'Lease-rental loans +44% in FY26 and +41% in Q1FY27 to ₹34,604 cr; nil gross NPA since inception; 68% of customers are REITs, sovereign and MNC funds, large developers.', 'Higher-quality growth, but lumpy (average ticket ₹137 cr) and capped by the housing-share rule.'],
      ['Near-prime and affordable housing', 'Partly', 'Sambhav disbursing ₹450-465 cr a month, aiming for ₹600 cr+; target yields 9-13% vs ~8.9% portfolio yield.', 'The one yield lever, but only 16% of home loans (20% by Mar-27).'],
      ['AI and digital processes', 'Yes', 'Opex to income 19.6% in Q1FY27 (21.2% a year earlier); ~95% of retail logins digital; AI in underwriting calls, collateral checks and service.', 'Keeps costs flat as margins fall, not a profit driver on its own.'],
      ['Bajaj parentage and AAA rating', 'Yes', 'AAA from CRISIL and India Ratings; 18 bank lenders; cost of funds 7.2%; access to the parent as a buyer of loan pools.', 'Funding at the best non-bank cost, still above a bank\'s.'],
      ['Competition from banks in prime loans', 'No', 'Banks set prime pricing; half of the 20% annual attrition is balance transfers, mostly to public-sector banks.', 'Pressure on the largest product, permanently.'],
      ['Regulation (housing-share floor, upper-layer rules)', 'No', 'Individual home loans 50.45% of assets vs a 50% floor; listing and float rules imposed.', 'Caps the mix shift that would lift margins; forces the parent to sell.'],
    ], head: ['Trend', 'Helps?', 'Evidence', 'So what'], title: 'Tailwind scorecard', source: 'Q1FY27 and Q4FY26 presentations and calls; annual reports; GAM Research' },
    { callout: '**Our view:** the trends that help BHFL (commercial real estate, efficiency, parentage) mostly protect returns rather than raise them, and the ones that hurt (bank competition, the end of the rate-cut cycle, the housing-share floor) act on its biggest product. That is why we model ROE rising only slowly, from {{F.roe.0|pct}} to {{F.roe.2|pct}}, and only because leverage rises.' },
  ],
};

module.exports = { industry, tailwind };
