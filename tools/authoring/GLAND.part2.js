// Gland report, part 2: what Gland does, history and corporate actions, industry, tailwind test.
const X = require('./GLAND.ctx');
const { C, D, A, F, SA, n0, n1, pc, Q1, FY26 } = X;
const s26 = SA.find(a => a.fy === 'FY26'), g26 = s26.geo, m26 = s26.model, tot = s26.revenue;
const sh = v => `${Math.round(v / tot * 100)}%`;

const business = {
  id: 'business', nav: 'What Gland does', kicker: 'Company', title: 'One sterile-manufacturing platform sold three ways: own filings marketed by partners, partners\' filings, and contract manufacturing (now including Cenexi)',
  blocks: [
    { p: `Gland develops and makes injectable medicines (vials, lyophilised vials, ampoules, pre-filled syringes, bags, cartridges and ophthalmics) and sells almost nothing under its own name. Its customers are US generic companies (including Fosun's US arm), big-pharma companies outsourcing production, and tender agencies in emerging markets. It runs four Indian formulation sites (Dundigal and Pashamylaram in Hyderabad, a penem plant, and an oncology plant at Visakhapatnam), API plants, and Cenexi's four sites in France and Belgium, with 1.7 bn units of capacity and ~4,300 employees in India. It has filed 389 US ANDAs (342 approved) and holds 1,828 product registrations worldwide.` },
    { exhibit: { type: 'table', title: "Gland's business model (FY26, ₹ crore)", head: ['Model', 'Revenue', 'Share', 'How it works', 'Economics'], wide: [3, 4], rows: [
      ['**IP-led, own ANDA**', n0(m26.ownAnda / 10), sh(m26.ownAnda), 'Gland owns the US filing; a partner markets the product and shares profits (profit share ~9% of revenue in Q1FY27)', 'Highest margins; Gland carries development cost and price-erosion risk'],
      ['**IP-led, partner ANDA**', n0(m26.partnerAnda / 10), sh(m26.partnerAnda), 'Partner owns the filing; Gland develops and supplies', 'Supply price plus some profit share; partner can re-source over time'],
      ['**Tech transfer / CDMO (incl. Cenexi)**', n0(m26.techTransfer / 10), sh(m26.techTransfer), 'Manufacturing of a customer\'s product to its process: transfers from expensive Western plants, GLP-1 fill-finish, Cenexi\'s European contracts', 'Long contracts; margins vary; Cenexi still near breakeven'],
      ['**B2C India and incentives**', n0((m26.b2cIndia + m26.exportIncentives) / 10), sh(m26.b2cIndia + m26.exportIncentives), 'Small branded injectables business in India; export incentives', 'Shrinking (B2C −23% in FY26)'],
    ], source: 'AR FY26 MD&A (revenue by business model); Q1FY27 call' } },
    { pair: [
      { type: 'hbar', title: 'The US takes 53% of revenue', unit: 'FY26 revenue by market (₹ crore)', x: ['United States', 'Europe', 'Rest of world', 'India', 'Canada', 'Australia & NZ'], series: [{ name: 'Revenue', values: [g26.USA, g26.Europe, g26['Rest of World'], g26.India, g26.Canada, g26.Australia + g26['New Zealand']].map(v => Math.round(v / 10)), fmt: 'num' }], labels: 'all', source: 'AR FY26 MD&A (by market)' },
      { type: 'column', title: 'Q1FY27 growth by market: the US and Europe carry it', unit: 'Revenue growth, Q1FY27 YoY (%)', x: ['US', 'Europe', 'Canada/Aus/NZ', 'Rest of world', 'India', 'Total'], series: [{ name: 'Growth', values: [Q1.usGrowthPct, Q1.europeGrowthPct, Q1.otherCoreGrowthPct, Q1.rowGrowthPct, Q1.indiaGrowthPct, Math.round(Q1.growthPct)], fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 investor presentation' },
    ] },
    { p: `**Concentration is real but has eased.** One customer accounted for ₹870 cr (13.5%) of FY26 revenue; two customers for ₹1,389 cr (24.7%) in FY25 (AR FY26 note 43). Sales to Fosun Pharma USA, a related party, were ₹244 cr (3.8%). Because partners own the front end, Gland rarely knows end-market approvals in advance (management cannot forecast GLP-1 volumes for this reason) and can lose a product if a partner re-sources or fails, as Athenex's bankruptcy showed in FY23.` },
    { callout: "**So what:** Gland is a manufacturing franchise, not a drug company. It wins on cost, breadth and compliance, and shares the upside of its own filings with partners. That makes margins high and capital needs modest, but it also leaves Gland a step removed from pricing and demand, and dependent on a few large partners and on Cenexi's turnaround for its European ambitions." },
  ],
};

const eraRows = [
  ['**FY15–FY20: Partner-led compounding**', 'US injectables through partners; Fosun buys 74% (Oct-2017)', '₹994 cr → ₹2,633 cr', '32–42%', 'EPS ₹13.5 → ₹49.9; one down year (FY18 EPS −22%)'],
  ['**FY21–FY22: IPO and Covid demand**', 'IPO at ₹1,500 (Nov-2020); Covid-era injectables demand', '₹3,463 cr → ₹4,401 cr', '34–38%', 'EPS ₹60.9 → ₹73.75; net cash ~₹3,000 cr'],
  ['**FY23: The break**', 'Athenex bankruptcy (₹57 cr provision), a lost customer, Chinese enoxaparin/heparin competition, Penems line shutdown', '₹3,625 cr (−18%)', '28%', 'EPS ₹47.4; stock to a record low in May-2023'],
  ['**FY24–FY25: Cenexi and the stall**', 'Cenexi bought (EV €230 mn); US price erosion; Saudi tender lost to a local partner', '₹5,665 cr → ₹5,616 cr', '23–24%', 'EPS ₹46.9 → ₹42.4; Cenexi EBITDA −₹81 cr and −₹176 cr'],
  ['**FY26–FY27: Recovery**', 'Dalbavancin, multivitamin, Sugammadex launches; CDMO wins; Cenexi breakeven', '₹6,431 cr; Q1FY27 ₹1,800 cr', '25–27%', 'EPS ₹62.35; Q1FY27 ₹19.2'],
];
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Forty-eight years of sterile manufacturing, a Chinese parent since 2017, one customer shock and one expensive acquisition',
  blocks: [
    { p: "Dr. P.V.N. Raju founded Gland in Hyderabad in 1978 as a contract maker of small-volume injectables. It built its business on partner-led US generics after the Dundigal plant won USFDA approval in 2003. Shanghai Fosun Pharmaceutical bought 74% in October 2017 (reported at ~US$1.09 bn) and listed Gland in November 2020 at ₹1,500 a share, India's largest pharma IPO at the time (₹6,480 cr, of which ₹1,250 cr new money). Fosun has since sold two 6% blocks (June 2024 and September 2026) and owns ~45.8%. The numbers fall into five eras." },
    { exhibit: { type: 'table', title: 'The five eras of Gland (FY15–FY27)', head: ['Era', 'What happened', 'Revenue', 'EBITDA margin', 'What it did to the numbers'], wide: [1, 4], rows: eraRows, source: 'Screener.in (standalone to FY19); company filings and calls; Business Standard (IPO, May-2023 results)' } },
    { exhibit: { type: 'table', title: 'Corporate actions and events that changed the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.timeline.map(t => [t.date, t.event, t.impact]), source: 'Company filings and calls; Business Standard, Yicai, Free Press Journal, Reuters (via Zerodha); GAM Research' } },
    { callout: "**Lesson from history:** Gland's two big setbacks came from outside the plants: a partner's failure and the loss of tender and partner volumes in FY23, and an acquisition that took three years longer than planned to break even. Its manufacturing and compliance have been consistently good. Investors should weigh partner, pricing and capital-allocation risks more heavily than operational ones." },
  ],
};

const IN = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: generic injectables grow faster than pills, contract manufacturing is moving east, and GLP-1 generics are a 2030 prize',
  blocks: [
    { p: `**Generic injectables** are a harder business than tablets: sterile manufacturing is expensive, regulators inspect it closely, and the US suffers recurring shortages when plants fail. Gland's annual report cites a global generic injectables market of ~US$${IN.genericInjectables.usdBn2025} bn in 2025 growing ~${IN.genericInjectables.cagrPct}% a year to US$${IN.genericInjectables.usdBn2035} bn by 2035 (an industry estimate; we treat it as an upper bound), within a global medicines market IQVIA sees at ~US$2.4 tn by 2029. Prices still fall: Gland's US volumes rose 9% in FY25 while prices fell 5%, and management describes the US market as growing ~3-4% a year, with Gland gaining share through GPO contracts on a lower cost base.` },
    { p: `**Contract manufacturing (CDMO)** is the growth engine. Big-pharma and specialty companies run sterile production in Europe and the US at costs management puts at 5-6x India's, across 80-100 sites; they want fewer, cheaper partners with clean records. The biologics CDMO market alone is put at US$${IN.biologicsCdmo.usdBn2024} bn (2024) rising to US$${IN.biologicsCdmo.usdBn2030} bn by 2030. **GLP-1 generics** (liraglutide, semaglutide, tirzepatide) open market by market from 2026, but the US, the biggest prize, comes around 2031-32; pen and cartridge fill-finish capacity is scarce, which is why Gland built 140 mn units of it.` },
    { pair: [
      { type: 'column', title: 'Market sizes quoted by Gland (US$ bn)', unit: 'US$ billion', x: ['Generic injectables 2025', 'Generic injectables 2035', 'Biologics CDMO 2024', 'Biologics CDMO 2030'], series: [{ name: 'US$ bn', values: [IN.genericInjectables.usdBn2025, IN.genericInjectables.usdBn2035, IN.biologicsCdmo.usdBn2024, IN.biologicsCdmo.usdBn2030], fmt: 'n1' }], labels: 'all', source: 'AR FY26 MD&A (industry estimates quoted by the company)' },
      { type: 'column', title: "US TAM of Gland's 24 complex injectables by technology", unit: 'US$ billion', x: ['Nano-suspension', 'Peptides', 'Microspheres', 'Hormones', 'Others'], series: [{ name: 'TAM', values: [3.04, 1.65, 0.71, 0.69, 0.65], fmt: 'n1' }], labels: 'all', source: 'AR FY26 MD&A (complex injectables by technology; total US$6.74 bn)' },
    ] },
    { exhibit: { type: 'table', title: 'Policy and trade forces at 30-Sep-2026', head: ['Force', 'What it is', 'What it means for Gland'], wide: [1, 2], rows: [
      ['US Section 232 tariffs', 'Tariffs on patented drugs and their APIs from 2026; generics exempt (confirmed Nov-2025)', 'Little direct effect: Gland makes no patented products; partners may move branded supply to the US, which cuts both ways for CDMO'],
      ['Drug shortages and supply security', 'Recurring US injectable shortages; buyers favour reliable, multi-site suppliers', 'Supports volume wins (management cites shortage-driven demand as an upside)'],
      ['BIOSECURE Act', 'US restrictions on certain Chinese biotech suppliers', 'Gland makes its products in India and Europe, but its Chinese parent is a question some US partners ask'],
      ['West Asia conflict', 'Glass/vial suppliers seek 5-6% price rises; Saudi shipments halted in Q4FY26', '1-2% potential margin impact; RoW revenue flat in Q1FY27'],
      ['Weak rupee', 'Record lows in mid-2026', 'Q1FY27 growth 20% reported vs ~15% constant currency; Cenexi\'s euro revenue translates higher'],
    ], source: 'Q2FY26, Q4FY26 and Q1FY27 earnings calls; GAM' } },
  ],
};

const tailwind = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach Gland?', title: 'Tailwind test: Gland captures outsourcing and US share gains now; GLP-1 and complex generics are later',
  blocks: [
    { p: 'A sector tailwind helps a shareholder only if the company captures it. We score each driver on whether Gland is a main beneficiary, a partial one, or a bystander.' },
    { verdicts: [
      ['Big pharma outsourcing sterile manufacturing', 'Yes', '55-SKU strategic agreement (US$90-100 mn from CY2029), NDDS oncology CDMO, hormonal and orphan PFS contracts at Cenexi; CDMO 50% of Q1FY27 revenue', 'The clearest win, but most revenue starts in FY29-30'],
      ['US generic injectables volume and shortages', 'Yes', 'US +32% in Q1FY27; GPO contract wins on cost; Dalbavancin and multivitamin launches', 'Volume yes; price erosion of ~5% a year continues'],
      ['GLP-1 generics', 'Partly', '140 mn cartridge capacity; nine contracts; first partner liraglutide launches in Canada and the US', '"Very limited" contribution before FY30-31; insulin fills the line meanwhile'],
      ['Complex injectables (peptides, depots, liposomes)', 'Partly', 'Six launched, three pending; 15 co-developed products from FY28; liposomal in-licence from FY30', 'The large opportunities are after FY29'],
      ['China+1 / BIOSECURE', 'Partly', 'Indian and European sites; but Gland is Chinese-controlled', 'Neutral to mildly positive'],
      ['European CDMO demand', 'Partly', 'Fontenay and Osny near full; Hérouville and Braine at 50-60%', 'Cenexi has the demand; profitability is the issue'],
      ['Weak rupee', 'Yes', 'Q1FY27: 20% reported vs ~15% constant currency', 'Cyclical, not structural'],
      ['Biosimilars / biologics CDMO', 'No', '~₹50-60 cr a year with Dr. Reddy\'s; "not much investment going into that space yet"', 'A bystander today'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: Gland captures 3 of 8 directly, 4 partly, misses 1', source: 'Company calls and filings; GAM Research' },
    { callout: "**Our view:** the tailwinds visible in today's numbers are US share gains and the weak rupee; the ones the stock is excited about (GLP-1, big-pharma transfers, complex injectables) are real and contracted but arrive mostly after FY29. Our forecasts give them little credit before then, which is the main reason we sit below management's ~20% growth ambition." },
  ],
};

module.exports = { business, history, industry, tailwind };
