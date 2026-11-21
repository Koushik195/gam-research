// HDB Financial Services report, part 2b: industry (retail NBFCs, listed lender peers, regulation) and the
// tailwind test.
const X = require('./HDBFS.ctx');
const { D, n0, n1, pc, P, DR_SYMS, shortName, ASOF_TXT } = X;
const LP = [...DR_SYMS, 'BAJAJHFL', 'HDBFS'].map(s => P[s]);
const byAssets = [...LP].sort((a, c) => c.assetsCr - a.assetsCr);

const industry = {
  id: 'industry', nav: 'Industry: crowded retail credit', kicker: 'Industry', title: 'Retail NBFCs: a big, under-served market, a credit cycle just ending, and banks competing for the best customers',
  blocks: [
    { p: 'HDB\'s customers (small shopkeepers and manufacturers, owner-drivers and small fleet operators, first-time borrowers buying a phone or a two-wheeler) are the part of India that banks under-serve. That is a large and growing market, and NBFCs have taken share in it for a decade. FY25-FY26 brought a credit cycle: unsecured business loans and microfinance went bad across the industry, and used and small-fleet truck loans followed. HDB cut back, which is why it grew only ~11% in FY26. By Q1FY27 managements across the sector were describing the stress as "over"; HDB\'s CFO said "we are completely over it as at the March quarter" (Q4FY26 call).' },
    { p: 'Competition is product by product. In trucks and equipment HDB faces Shriram Finance, Cholamandalam and the banks; in tractors Mahindra Finance; in consumer durables Bajaj Finance; in two-wheelers and cars the captive and bank lenders; in loans against property everyone. Its parent, HDFC Bank, competes with it in car, two-wheeler, personal and business loans. HDB\'s edge is reach into small towns and customers without credit files, not price.' },
    { exhibit: { type: 'table', title: `Listed lenders at the ${ASOF_TXT} close`, head: ['Company', 'Total assets FY26 (₹ cr)', 'Market value (₹ cr)', 'P/B (x)', 'P/E (x)', 'ROE FY26', 'ROA FY26', 'Revenue growth FY26'], rows: byAssets.map(p => [p.symbol === 'HDBFS' ? '**HDB Financial**' : shortName(p.symbol), n0(p.assetsCr), n0(p.mcapCr), n1(p.pb), n1(p.pe), `${n1(p.roe)}%`, `${n1(p.roa)}%`, pc(p.revG)]), source: `Screener.in (consolidated except SBI Cards, Aditya Birla Capital, Bajaj Housing Finance and HDB, standalone); trailing multiples scaled to the NSE close on ${ASOF_TXT}; ROE and ROA on average FY25-26 balances` } },
    { pair: [
      { type: 'hbar', title: 'ROE, FY26: HDB in the middle of the pack', unit: 'Net profit ÷ average net worth, FY26 (%)', x: [...LP].sort((a, c) => c.roe - a.roe).map(p => shortName(p.symbol)), series: [{ name: 'ROE', values: [...LP].sort((a, c) => c.roe - a.roe).map(p => Math.round(p.roe * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'HDB Financial', source: 'Screener.in, GAM Research' },
      { type: 'hbar', title: 'Revenue growth, FY26: HDB among the slowest', unit: 'Revenue growth FY26 (%)', x: [...LP].sort((a, c) => c.revG - a.revG).map(p => shortName(p.symbol)), series: [{ name: 'Growth', values: [...LP].sort((a, c) => c.revG - a.revG).map(p => Math.round(p.revG)), fmt: 'pct0' }], labels: 'all', highlight: 'HDB Financial', source: 'Screener.in, GAM Research' },
    ] },
    { h: 'Regulation: four rules that shape HDB' },
    { exhibit: { type: 'table', title: 'Rules that bind HDB', head: ['Rule', 'What it requires', 'Where HDB stands', 'Effect'], wide: [1, 3], rows: D.regulatory, source: 'RBI (scale-based regulation; upper-layer list 6-Aug-2026; Undertaking of Financial Services Directions, 28-Nov and 5-Dec-2025); IRDAI consultation (23-Sep-2026); Annual Report FY2025-26' } },
    { callout: '**Our view:** demand is not HDB\'s constraint; risk appetite is. The market it serves can absorb 18-20% growth, as Bajaj Finance and Cholamandalam show, but only by accepting the losses that come with thin-file borrowers. HDB chose to slow down in FY25-FY26 rather than chase volume. That protected its balance sheet; it also means it starts FY27 behind its peers on growth.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach HDB?', title: 'Tailwind test: consumption and cheaper funding help; trucks, rates and regulation do not',
  blocks: [
    { p: 'An industry trend only matters to a shareholder if the company turns it into profit. We score each one.' },
    { verdicts: [
      ['Consumption and festive demand', 'Yes', 'Consumer finance +21% YoY in Q1FY27; consumer durables loans +51%; 150+ manufacturer tie-ups and 160,000+ retail touchpoints.', 'Fast growth at high yields, but short-dated and partly unsecured.'],
      ['Small-business credit and formalisation', 'Partly', 'Loans against property +13% (LAP + secured business loans); unsecured business loans shrank 8% YoY while HDB tightened.', 'Growth returns from Q3FY27 in management\'s plan; not yet visible.'],
      ['Infrastructure spending and the truck cycle', 'Partly', 'CV loans +10%, construction equipment +8% YoY; HDB exited high-value, low-return products (tractor-trailers, high-end trucks).', 'Better risk-adjusted returns, slower growth; Stage 3 still 3.6% in asset finance.'],
      ['The 2025 rate cuts', 'Yes, fading', 'Cost of borrowings 7.57% (Q1FY26) → 6.93% (Q1FY27); NIM 7.74% → 8.35%.', 'The best of it is in the numbers; a repo hike was expected in Oct-2026.'],
      ['HDFC Bank parentage', 'Yes', 'AAA from CRISIL and CARE; HDFC Bank lends it ₹8,767 cr; brand on every branch.', 'Funding at near-bank cost; in return, bank-group rules apply.'],
      ['AI and digital processes ("Shikhar")', 'Partly', 'AI in document processing, collections bots, voice journeys; targets of 20bp lower credit cost and 10% lower servicing cost in the medium term.', 'Promising, unproven; we model only a slow fall in the opex ratio.'],
      ['Competition from banks and fintechs', 'No', 'Banks (incl. HDFC Bank) chase the better customers in cars, two-wheelers and personal loans.', 'Caps yields in the safer products.'],
      ['Regulation (upper layer, bank-group rules, IRDAI)', 'No', 'Bank-style loan restrictions; investment approvals for the parent; insurance commission caps proposed.', 'Adds cost and limits fee income; no growth benefit.'],
    ], head: ['Trend', 'Helps?', 'Evidence', 'So what'], title: 'Tailwind scorecard', source: 'Q1FY27 and Q4FY26 presentations and calls; annual reports; RBI; IRDAI; GAM Research' },
    { callout: '**Our view:** the trends that help HDB are mostly behind it (cheaper funding) or come with higher risk (consumer and unsecured lending). The ones that hurt act on its biggest products (trucks) and on fee income (insurance). That is why we model ROE flat at ~{{F.roe.1|pct}} rather than rising to the 16-17% some brokers expect.' },
  ],
};

module.exports = { industry, tailwind };
