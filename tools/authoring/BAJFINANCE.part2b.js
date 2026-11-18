// Bajaj Finance report, part 2b: industry (listed NBFC landscape, regulation) and the tailwind test.
const X = require('./BAJFINANCE.ctx');
const { n0, n1, pc, P, PEERS, shortName, Q1, ASOF_TXT } = X;
const LEND = PEERS.filter(p => p.roe != null);

const industry = {
  id: 'industry', nav: 'Industry: crowded and regulated', kicker: 'Industry', title: 'Retail lending in India: big runway, crowded field, and a regulator that has tightened three times in three years',
  blocks: [
    { p: `India's retail credit runway is long but no longer empty. Bajaj Finance's MD put consumer debt at about 41% of GDP, a ratio that rose ~2pp a year for four years and ~1pp last year (Q1FY27 call). He also said bureau data now show unsecured delinquencies flat to better year on year, after the stress of FY25-26 in small-business, personal and microfinance loans that pushed Bajaj's own loan losses to ~2% and made it prune MSME lending from Jul-2025. Competition comes from every side: in Jain's words, "PSU banks, private banks, nonbanks, all three competing", plus fintech platforms in personal loans (Nomura, Aug-2026).` },
    { p: `Among listed retail NBFCs, Bajaj Finance is the largest by far (market value ₹${(P.BAJFINANCE.mcapCr / 1e5).toFixed(2)} lakh cr on ${ASOF_TXT}, ~2.6x the next, Shriram Finance) and among the most profitable. On FY26 numbers hit by one-off charges its ROE (${n1(P.BAJFINANCE.roe)}%) trailed only Muthoot Finance (gold loans) and Cholamandalam, and its return on assets was second only to Muthoot's; vehicle and diversified lenders (Shriram, L&T Finance, M&M Financial, Aditya Birla Capital) earn 11-16%.` },
    { pair: [
      { type: 'hbar', title: 'ROE, FY26: Bajaj is near the top of listed lenders', unit: 'Net profit ÷ average net worth, FY26 (%)', x: LEND.map(p => shortName(p.symbol)), series: [{ name: 'ROE', values: LEND.map(p => Math.round(p.roe * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'Bajaj Finance', source: 'Screener.in (consolidated), GAM Research' },
      { type: 'hbar', title: 'ROA, FY26: only Muthoot earns more on its assets', unit: 'Net profit ÷ average total assets, FY26 (%)', x: LEND.map(p => shortName(p.symbol)), series: [{ name: 'ROA', values: LEND.map(p => Math.round(p.roa * 100) / 100), fmt: 'n2' }], labels: 'all', highlight: 'Bajaj Finance', source: 'Screener.in (consolidated), GAM Research' },
    ] },
    { h: 'Regulation: the cost of being a large NBFC' },
    { exhibit: { type: 'table', title: 'RBI actions that touch Bajaj Finance\'s business', head: ['When', 'Rule', 'Status on 30-Sep-2026', 'Effect on Bajaj Finance'], wide: [1, 3], rows: [
      ['Oct-2021 onward', 'Scale-based regulation: Bajaj Finance in the "upper layer" with bank-like rules', 'In force', 'Tighter governance, capital and disclosure; must list if not already (it is)'],
      ['Nov-2023', 'Risk weight on unsecured consumer credit 100% → 125%', 'In force (bank-to-NBFC loans reversed from Apr-2025)', 'More capital per personal and consumer loan; part of why leverage is capped near 5x'],
      ['Nov-2023 to May-2024', 'Ban on eCOM and Insta EMI Card lending', 'Lifted after remedial action', 'Showed the RBI will act product by product'],
      ['6-Aug-2026 (draft)', 'NBFCs may offer only term loans; revolving credit only for NBFCs licensed to issue credit cards', 'Comments closed 28-Aug; final rule pending', 'Flexi loans ~13-15% of AUM (brokers); Jefferies: ~50bp extra yield on them'],
    ], source: 'RBI circulars as reported by Business Standard, BusinessToday, Whalesbook; company filings. Scale-based regulation per RBI framework (Oct-2021).' } },
    { callout: `**Our view:** the market is big enough for Bajaj Finance to keep growing 20%+ for years. The constraints are not demand but **regulation** (each rule change has landed hardest on the largest, most digital consumer lender), **capital** (125% risk weights and ~5x leverage limits mean growth needs equity) and **price competition** from banks in the safest segments (home loans, loans against property), where Bajaj earns less.` },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach Bajaj Finance?', title: 'Tailwind test: which trends actually help Bajaj Finance\'s returns?',
  blocks: [
    { p: 'An industry trend only matters to a shareholder if the company turns it into profit. We score each one.' },
    { verdicts: [
      ['Unsecured credit cycle turning', 'Yes', `Q1FY27 loan losses 1.31% before the overlay vs 1.93% in FY26 before one-offs; Stage 2+3 down to 1.87%; bureau data improving in personal, business and professional loans (call).`, 'The single biggest driver of FY27 profit growth in our model.'],
      ['Consumption and durables demand', 'Partly', 'Urban and rural consumer finance +38% and +49% in Q1, but management says about half of that is higher product prices (phones, appliances), not more customers.', 'Volume growth is ~20%, not 40%; price-led growth fades.'],
      ['Gold price boom', 'Partly', `Gold loans +112% to ₹21,152 cr; "at $4,500 ... a reasonable frame for a customer to raise ₹8-10 lakh" (MD). If gold "comes back to $2,500" that driver goes away.`, 'Profitable and low-risk, but tied to a commodity price.'],
      ['Lower interest rates', 'Partly', 'Cost of funds fell 43bp to 7.54% in FY26 and 7.40% in Q1FY27; but incremental funding is now 30-60bp dearer on West Asia and inflation risks.', 'Funding tailwind is over; we model a flat to slightly higher cost of funds.'],
      ['AI and digital efficiency', 'Yes', 'AI bots generated ₹2,551 cr of loans in Q1; 20%+ underwriter efficiency; 71% of self-service handled by bots; opex to income guided down 25-40bp.', 'Supports a lower cost-to-income ratio, our {{F.costToIncome.0|pct}} in FY27E.'],
      ['Home-loan growth (BHFL)', 'Partly', 'BHFL AUM +24%, pristine asset quality (GNPA 0.29%), but ROE only 12.5%.', 'Adds size but dilutes group ROE; BFL is selling down to 75%.'],
      ['Tighter regulation', 'No', 'Revolving-credit draft, 125% risk weights, product-level actions.', 'Higher capital needs and a possible yield hit on flexi loans.'],
      ['Competition in personal loans', 'No', 'Urban personal loans grew only 19% in FY26 and below 20% since Q3FY26 (Nomura); banks and fintechs scaling.', 'Pressure on the highest-yield book.'],
    ], head: ['Trend', 'Helps?', 'Evidence', 'So what'], title: 'Tailwind scorecard: the credit turn helps most; regulation and competition push back', source: 'Q1FY27 presentation and call; Nomura (21-Aug-2026); GAM Research' },
    { callout: `**Our view:** the trend that matters most in FY27 (lower credit costs) is cyclical, not structural. The structural tailwinds (AI efficiency, cross-sell to a 124 million customer base) are real but worth tens of basis points a year, while the structural headwinds (regulation, mix shift to secured loans, competition) cost about the same. That is why we model ROE flat at ~20%, not rising.` },
  ],
};

module.exports = { industry, tailwind };
