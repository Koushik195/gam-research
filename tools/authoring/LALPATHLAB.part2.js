// Dr Lal PathLabs report, part 2: what the company does, history & corporate actions, industry, tailwind test.
const X = require('./LALPATHLAB.ctx');
const { C, D, A, n0, n1, rup, SA, FY26 } = X;
const PXS = [...X.M.price.series.filter(([d]) => d >= '2019-04-01' && d < X.ASOF), [X.ASOF, X.price]];

const business = {
  id: 'business', nav: 'What the company does', kicker: 'The business', title: 'What Dr Lal does: collects 95 mn samples a year through 21,000 touch-points and tests them in 312 labs, three-quarters for patients who walk in or book a home visit',
  blocks: [
    { p: `Dr Lal PathLabs runs blood, urine and tissue tests (pathology) and a small radiology business (<5% of revenue). In FY26 it served **30.3 mn patients** and processed **94.5 mn samples** (3.1 tests per patient) for **₹2,763 cr of revenue**, i.e. ~₹912 per patient and ~₹292 per sample. Patients reach it in three ways: **7,727 patient service centres** (PSCs: mostly franchised collection centres that take blood and send it on), **13,935 pick-up points** (PUPs: doctors, nursing homes and small labs that hand over samples) and **home collection** booked online or by phone. About **75% of revenue is B2C** (patients paying directly, at list prices) and ~25% B2B (hospitals, institutions, government schemes such as CGHS/ECHS, other labs, at negotiated prices).` },
    { p: '**Hub and spoke.** Samples move by courier from the collection points to one of **312 labs**: satellite labs in each city run routine tests (blood counts, sugar, thyroid, lipids) within hours, and complex tests (genomics, oncology, autoimmune, reproductive) go to the **National Reference Lab in Delhi** or the regional reference labs in Kolkata, Bengaluru and Mumbai. The model spreads expensive machines and specialists over a large volume, which is why gross margin is ~81% and EBITDA margin ~28%: the main costs are reagents (19% of revenue), people (18%), fees to collection-centre partners (15%) and logistics, marketing, rent and IT (20%). Routine tests are delivered in 3 hours for ~90% of walk-in patients; ~400 tests are routine (Q1FY27 call).' },
    { exhibit: { type: 'table', title: 'The business in numbers (FY26 unless stated)', head: ['Item', 'Value', 'What it tells you'], wide: [2], rows: [
      ['Patients / samples', '30.3 mn / 94.5 mn', 'Samples grow faster than patients (+10.4% vs +5.3%) as bundles add tests per visit'],
      ['Revenue per patient / per sample', '₹912 / ₹292', 'Q1FY27 ₹968 per patient (+10%), incl. a CGHS rate revision'],
      ['Labs / PSCs / PUPs', '312 / 7,727 / 13,935', '+35 labs, +2,625 PSCs and +2,997 PUPs in three years'],
      ['B2C share of revenue', '~75%', 'Pays list price; B2B (25%) is hospitals, government schemes, other labs'],
      ['SwasthFit bundles', '27% of revenue', 'Preventive packages; 22% in FY24'],
      ['Tier-3-and-below towns', '39% of revenue (₹1,090 cr)', '16.7% CAGR FY23-26 vs 11% for the company'],
      ['Accreditation', '53 NABL, 2 CAP labs', 'Quality is the brand promise to doctors'],
      ['Employees', '~6,200 (group)', 'Plus franchisee staff at collection centres'],
    ], source: 'AR FY26 MD&A pp.125-128; Q1FY27 PPT; Q4FY26 and Q1FY27 calls' } },
    { pair: [
      { type: 'column', title: 'Network: labs and collection centres keep growing', unit: 'Number at year-end', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Patient service centres', values: [4731, 5102, 5762, 6607, 7727], fmt: 'num' }], labels: 'all', source: 'Company presentations (Q3FY26, Q1FY27)' },
      { type: 'line', title: 'Samples per patient: 2.4 → 3.1 in five years', unit: 'Samples ÷ patients', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Samples per patient', values: [66.0 / 27.3, 72.3 / 26.9, 78.2 / 27.6, 85.6 / 28.8, 94.5 / 30.3].map(v => Math.round(v * 100) / 100), fmt: 'n2' }], labels: 'all', min: 2, max: 3.4, source: 'Company presentations; GAM' },
    ] },
    { callout: '**So what:** Dr Lal\'s economics rest on density. Once a city has a lab, every extra collection centre adds samples at little extra cost; that is why margins are highest in Delhi NCR, where it has been for decades, and why new regions (Mumbai, the South) dilute margins for years. Growth comes from three levers: more patients (network), more tests per patient (bundles, specialised tests) and price (rarely used: no list-price increase in three years).' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'History: from a Delhi lab (1949) to a listed national chain; COVID, Suburban and a bonus issue shaped the last five years',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['1949', 'Founded by Major (Dr) S.K. Lal in Delhi', 'The brand that still anchors Delhi NCR (31% of revenue)'],
      ['2010', 'National Reference Lab, Delhi', 'Hub for complex tests; the core of the hub-and-spoke model'],
      ['Dec-2015', 'IPO; SwasthFit bundles launched', 'Bundles reached 27% of revenue by FY26'],
      ['2018 / 2023', 'Kolkata and Mumbai regional reference labs (Bengaluru also)', 'Platform for East (15% of revenue) and West'],
      ['FY21-23', 'COVID RT-PCR testing', 'Revenue ₹242 cr in FY22, ₹25 cr in FY23, ₹3 cr in FY24: FY22 revenue +32%, FY23 −3%'],
      ['Nov-2021', 'Suburban Diagnostics (Mumbai) for EV ₹925 cr, part loan-funded', 'Goodwill ₹548 cr; intangibles amortised ₹58-61 cr a year; FY23 EPS −31%; loan repaid by FY25'],
      ['Mar-2025', 'Suburban liquidated into the parent; MD Om Prakash Manchanda leaves (31-Mar-2025)', '₹40.8 cr one-time tax credit (FY25 EPS +₹2.4); CEO Shankha Banerjee leads'],
      ['Dec-2025', '1:1 bonus issue (record date 19-Dec-2025)', 'Shares 8.38 cr → 16.76 cr; all per-share figures here are bonus-adjusted'],
      ['Q3FY26', 'GST on reagents cut 12% → 5%, passed on in price cuts; new Labour Codes', '₹30.1 cr one-time charge (FY26 EPS −₹1.3); slight realisation dip'],
      ['Jan-2026', 'Sovaaka premium preventive centre', 'One centre; not material'],
      ['Apr-Sep 2026', 'Shahbazkers (Mumbai), Ghana (80%), Neuome (30%), Dubai and Uzbekistan subsidiaries, SN Genelab (70%)', 'First international and genomics deals; ~₹230 cr of cash committed'],
    ], source: 'Company presentations (Q4FY24, Q4FY25, Q1FY27); AR FY26; Q3FY26 and Q4FY26 calls; filings to 30-Sep-2026' } },
    { pair: [
      { type: 'column', title: 'COVID revenue: ₹242 cr in FY22, gone by FY24', unit: 'Revenue (₹ crore)', x: ['FY22', 'FY23', 'FY24'], series: [{ name: 'Non-COVID', values: [1845, 1992, 2223], fmt: 'num' }, { name: 'COVID testing', values: [242, 25, 3], fmt: 'num' }], labels: 'all', source: 'Q4FY24 PPT p.25' },
      { type: 'line', title: 'Share price: back near the 2021 peak five years later', unit: '₹ per share (bonus-adjusted), weekly', x: PXS.map(p => p[0]), series: [{ name: 'Price', values: PXS.map(p => p[1]), fmt: 'inr', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, source: 'Screener.in weekly prices; NSE close on 30-Sep-2026' },
    ] },
    { callout: `**So what:** two distortions run through the history and matter for valuation. (1) COVID: FY22 EPS (₹20.7) was inflated by testing, and FY23 (₹14.3) was depressed by its disappearance plus a full year of Suburban costs. (2) Acquisition accounting: Suburban's brand and customer intangibles cost ₹58 cr of amortisation in FY26 (~₹2.6 of EPS); the brand part ends in FY27, which lifts reported EPS from FY28 without any change in the business. The stock peaked at ₹2,059 in Sep-2021, fell 56% to ₹909 in Mar-2023 and closed at ₹${n0(X.price)} on ${X.ASOF_TXT}.` },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: big, fragmented and growing 8-10% a year; organised chains hold only 15-20%, and competition never lets up',
  blocks: [
    { p: rup(D.industry.summary) },
    { pair: [
      { type: 'hbar', title: 'Who does India\'s testing', unit: 'Share of the diagnostics market (%), mid-point of company ranges', x: ['Standalone centres', 'Hospital-based labs', 'Diagnostic chains'], series: [{ name: 'Share', values: [44, 38, 18], fmt: 'pct0' }], labels: 'all', highlight: 'Diagnostic chains', source: 'Q1FY27 PPT p.19 (42-46% / 36-40% / 16-20%)' },
      { type: 'column', title: 'Organised players\' tests: 214 mn → 401 mn in four years', unit: 'Tests at leading organised players (mn), CareEdge sample', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25'], series: [{ name: 'Tests (mn)', values: [214, 278, 317, 351, 401], fmt: 'num' }], labels: 'all', source: 'AR FY26 MD&A p.122, citing CareEdge' },
    ] },
    { exhibit: { type: 'table', title: 'What drives demand, and what holds back the organised chains', head: ['Driver', 'Effect'], wide: [1], rows: [
      ...D.industry.drivers.map(d => [d, 'More tests per person and more people tested']),
      ...D.industry.threats.map(t => [t, 'Caps pricing or takes share']),
    ], source: 'AR FY26 MD&A; CARE (Apr-2026); Q1FY27 call' } },
    { exhibit: { type: 'table', title: 'Listed diagnostics peers (FY26, Screener)', head: ['Company', 'Home market', 'Revenue (₹ cr)', 'EBITDA margin', 'ROE'], rows: [
      ['**Dr Lal PathLabs**', 'Delhi NCR / North & East', n0(X.P.LALPATHLAB.revenue), X.P.LALPATHLAB.ebitdaMargin + '%', X.P.LALPATHLAB.roe + '%'],
      ['Metropolis Healthcare', 'Mumbai / West & South; B2B-heavy', n0(X.P.METROPOLIS.revenue), X.P.METROPOLIS.ebitdaMargin + '%', X.P.METROPOLIS.roe + '%'],
      ['Vijaya Diagnostic', 'Hyderabad; pathology + radiology', n0(X.P.VIJAYA.revenue), X.P.VIJAYA.ebitdaMargin + '%', X.P.VIJAYA.roe + '%'],
      ['Thyrocare', 'Central lab, B2B and wellness (PharmEasy-owned)', n0(X.P.THYROCARE.revenue), X.P.THYROCARE.ebitdaMargin + '%', X.P.THYROCARE.roe + '%'],
    ], source: 'Screener.in via asof-peers.js (FY26); deep.json peer profiles' } },
    { callout: `**Pricing is the industry's weak point.** ${rup(D.industry.pricing)} The chains grow on volume and mix; when they try to push price, aggregators and hospital labs take the patient.` },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: the industry\'s 8-10% growth does reach Dr Lal, and it has grown a little faster; but the tailwind is volume, not price',
  blocks: [
    { exhibit: { type: 'table', title: 'Does each sector tailwind reach Dr Lal?', head: ['Tailwind', 'Reaches Dr Lal?', 'Evidence'], wide: [2], rows: [
      ['Chronic disease and preventive testing', '**Yes**', 'SwasthFit 22% → 27% of revenue (FY24-26), growing ~20% a year; samples per patient 2.4 → 3.1'],
      ['Shift from unorganised to organised labs', 'Partly', 'Patient growth 2.6% (FY24) → 5.3% (FY26) → 8.2% (Q1FY27); management calls the shift "slow" with low entry barriers'],
      ['Tier-3/4 and rural penetration', '**Yes**', 'Tier-3+ revenue 34% → 39% of the total (FY23-26), 16.7% CAGR; GraminFit in 7 states'],
      ['Government rate cards (CGHS/ECHS)', 'Yes, once', 'Worth 2-3% of revenue for 2-3 quarters from Q1FY27; laps in FY28'],
      ['Specialised testing (genomics, oncology)', 'Small so far', 'Genomics <5% of revenue; SN Genelab adds ~₹58 cr of revenue'],
      ['Hospital capacity additions', 'Mixed', 'More referrals for super-specialised tests, but hospitals also run their own labs'],
      ['Pricing', '**No**', 'No list-price increase for 3+ years; GST cut passed on; aggregators discount'],
    ], source: 'Company presentations and calls (FY24-Q1FY27); AR FY26' } },
    { pair: [
      { type: 'column', title: 'Revenue growth vs the industry\'s 8-10%', unit: 'Dr Lal revenue growth (%)', x: ['FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Revenue growth', values: [10.4, 10.5, 12.2, 19.1], fmt: 'pct' }], labels: 'all', source: 'Company presentations; AR FY26 (industry 8-10%)' },
      { type: 'column', title: 'Patients vs samples: volume is the engine', unit: 'Growth (%)', x: ['FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Patients', values: [2.6, 4.3, 5.3, 8.2], fmt: 'pct' }, { name: 'Samples', values: [8.2, 9.5, 10.4, 10.7], fmt: 'pct' }], labels: 'all', source: 'Company presentations and calls' },
    ] },
    { callout: '**Verdict:** the tailwind is real and Dr Lal captures it, mainly through more tests per patient and deeper reach in smaller North and East towns. It does not get pricing power from it. That is why we model revenue growth of 12-16% (volumes 6.5-7%, revenue per patient 5.5-8%) rather than the 18-20% of the last two quarters.' },
  ],
};

module.exports = { business, history, industry, tailwind };
