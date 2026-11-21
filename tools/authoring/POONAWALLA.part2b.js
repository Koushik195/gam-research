// Poonawalla Fincorp report, part 2b: industry (listed NBFC landscape, regulation) and the tailwind test.
const X = require('./POONAWALLA.ctx');
const { n0, n1, pc, P, PEERS, shortName, Q1, ASOF_TXT, F, fin, fi } = X;
const LEND = PEERS.filter(p => p.roe != null);

const industry = {
  id: 'industry', nav: 'Industry: crowded and regulated', kicker: 'Industry', title: 'Retail lending: a 16%-a-year market in which Poonawalla grows four times as fast',
  blocks: [
    { p: `Retail loans across Indian lenders grew more than 16% in the year to Mar-2026, led by gold loans, unsecured personal loans and consumer-durable finance (Poonawalla's chief credit officer, Q1FY27 call). That followed a stress cycle in 2024-25 in small-ticket personal loans, microfinance and small-business loans, which is what hit Poonawalla's STPL book. Poonawalla's AUM grew 69% in FY26 and 62.5% in the year to Jun-2026, about four times the market: this is share-taking through new products and distribution, not a ride on the tide. Every product it sells is contested by banks (which fund themselves more cheaply with deposits), by larger NBFCs (Bajaj Finance, Shriram, Cholamandalam, L&T Finance, Aditya Birla Capital, HDB Financial) and, in personal loans, by fintech platforms that are also its distribution partners.` },
    { p: `Among listed retail lenders Poonawalla is mid-sized (market value ₹${n0(X.mcap)} cr on ${ASOF_TXT}, about a fifteenth of Bajaj Finance's) and, on FY26 numbers, the least profitable: an ROE of ${n1(P.POONAWALLA.roe)}% and an ROA of ${n1(P.POONAWALLA.roa)}% against 7-31% and 1.6-6.5% for the others (the low end is Manappuram, hit by its microfinance arm). That gap is the whole investment case: if the rebuild works, returns converge upward; if not, the business stays a fast-growing, low-return lender.` },
    { pair: [
      { type: 'hbar', title: 'ROE, FY26: Poonawalla at the bottom of listed lenders', unit: 'Net profit ÷ average net worth, FY26 (%)', x: LEND.map(p => shortName(p.symbol)), series: [{ name: 'ROE', values: LEND.map(p => Math.round(p.roe * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'Poonawalla Fincorp', source: 'Screener.in (consolidated; SBI Cards, Bajaj Housing Finance, Aditya Birla Capital, HDB Financial standalone), GAM Research' },
      { type: 'hbar', title: 'ROA, FY26: the same picture on assets', unit: 'Net profit ÷ average total assets, FY26 (%)', x: LEND.map(p => shortName(p.symbol)), series: [{ name: 'ROA', values: LEND.map(p => Math.round(p.roa * 100) / 100), fmt: 'n2' }], labels: 'all', highlight: 'Poonawalla Fincorp', source: 'Screener.in, GAM Research' },
    ] },
    { h: 'Regulation: what touches Poonawalla' },
    { exhibit: { type: 'table', title: 'Rules that matter for Poonawalla\'s business', head: ['When', 'Rule', 'Status on 30-Sep-2026', 'Effect on Poonawalla'], wide: [1, 3], rows: [
      ['Nov-2023', 'Risk weight on unsecured consumer credit raised to 125%', 'In force (the extra weight on bank loans to NBFCs was reversed from Apr-2025)', 'More capital per rupee of instant, Prime PL and business loans (~47% of AUM): one reason growth needs equity'],
      ['Ongoing', 'Capital adequacy minimum 15% (Tier 1 10%)', 'CRAR 19.46%, Tier 1 18.37% (Jun-2026)', 'At our growth, the buffer is used up by FY28E without new equity'],
      ['6-Aug-2026 (draft)', 'NBFCs may offer only term loans, no revolving credit', 'Comments closed; final rule pending', 'No revolving book disclosed; the new "PFIN EMI card" for consumer durables (book ₹580 cr) may be affected'],
      ['23-Sep-2026 (consultation)', 'IRDAI: caps on commissions for loan-linked insurance sold by lenders', 'Comments to 25-Oct-2026', 'Cross-sell income ₹91 cr in Q1FY27 (~4% of revenue); split by product not disclosed'],
      ['Recent', 'RBI framework for responsible AI in finance ("7 sutras"), cited by the company', 'Guidance', 'Poonawalla says all 101 AI projects run inside it'],
    ], source: 'RBI and IRDAI releases as reported in the press and in our Bajaj Finance and Cholamandalam files; company calls (Q1FY27). Dates of the IRDAI consultation and RBI draft per press reports before 30-Sep-2026.' } },
    { callout: `**Our view:** demand is not the constraint: retail credit is growing mid-teens and Poonawalla is taking share. The constraints are **capital** (125% risk weights on half the book), **funding cost** (AAA, but still ~7.7% against banks' deposits) and **credit seasoning**. The regulatory items of 2026 look small for Poonawalla specifically; the larger regulatory risk is the RBI's habit of tightening product by product when unsecured growth runs hot.` },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach Poonawalla?', title: 'Tailwind test: execution, not the market, explains the growth',
  blocks: [
    { p: 'An industry trend only matters to a shareholder if the company turns it into profit. We score each one.' },
    { verdicts: [
      ['Retail credit growth (~16% a year)', 'Partly', 'Poonawalla grows ~4x the market, so its growth is share-taking from new products and branches.', 'Growth will slow toward the market as the base grows; we fade it from 40% to 27%.'],
      ['Unsecured credit cycle turning', 'Yes', 'Own credit cost 3.1% (Q4FY25) → 2.40% (Q1FY27); new-loan 6-MoB 30+ 6.74% → 0.64%; GNPA 1.84% → 1.37%.', 'The biggest driver of FY27 profit growth in our model.'],
      ['Gold-price boom', 'Partly', 'Gold AUM ₹1,825 cr (3%) from 460 branches, LTV 75% at origination; ~400 more branches in FY27.', 'Low-risk and profitable at scale, but still small and tied to the gold price.'],
      ['Lower interest rates', 'No', 'Cost of borrowing rose to 7.72% in Q1FY27 from 7.63%; management sees "a small uptick here and there".', 'Funding is a mild headwind; margins must come from mix.'],
      ['AI and digital efficiency', 'Partly', 'Opex/AUM 4.76% (Q4FY25) → 4.06% (Q1FY27); 101 AI projects, ~130 agents; 38% of Prime PL fully digital.', 'Real but hard to separate from simple operating leverage on a book that grew 62%; opex is still ~4% of AUM.'],
      ['Consumption and durables', 'Partly', 'Consumer-durable book ₹580 cr; 17,300 dealer points; ~50,000 customers a month.', 'Mainly a customer-acquisition funnel; financially immaterial so far.'],
      ['Tighter regulation', 'No', '125% risk weights; RBI revolving-credit draft; IRDAI commission caps.', 'Higher capital needs; small hits to fees.'],
      ['Bank competition in prime segments', 'No', 'LAP (9.75-12%) and Prime PL (13-16%) are where banks compete hardest on price.', 'Caps yields on the secured and prime half of the book.'],
    ], head: ['Trend', 'Helps?', 'Evidence', 'So what'], title: 'Tailwind scorecard: the credit turn helps most; funding and regulation push back', source: 'Q4FY25-Q1FY27 presentations and calls; GAM Research' },
    { callout: `**Our view:** Poonawalla's growth is self-made, and so is its risk. The one industry tailwind that clearly reaches the P&L, the turn in unsecured credit, is cyclical. The structural levers (mix, AI, operating leverage) are worth tens of basis points of ROA a year, which is why we model ROA rising from ~1.1% in FY26 to {{F.roaAum.2|pct}} in FY29E, not to management's 3-3.5%.` },
  ],
};

module.exports = { industry, tailwind };
