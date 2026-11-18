// GFL report, part B (2/3): industry, tailwind test, fluoropolymers, refrigerants & bulk, battery materials, moat, earnings quality.
const { ctx, } = require('./FLUOROCHEM.part2');
const { C, F, n0, n1, SA, SQ, SQ2, QL, A26, mcap, chemSep28, ndSep27, chemEq20, impliedEvBiz, evShares, evAt35, gflEvAt35, gflEvPerShare, segE } = ctx;

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Fluoropolymers: a ~US$10 bn market with few makers; refrigerants: rationed by regulation',
  blocks: [
    { p: 'Fluoropolymers are plastics and rubbers built on carbon-fluorine bonds, the strongest in organic chemistry. They resist heat, chemicals, fire and weather, and nothing else does all of that, so they are used in chemical plants, cables, car engines, semiconductor fabs, lithium batteries (PVDF binder) and hydrogen equipment. The global market was ~US$10.3 bn in 2025 and is expected to grow ~6.5% a year to 2030 (MarketsandMarkets, Mar-2026). Supply is concentrated: Chemours, Daikin, Syensqo (ex-Solvay), AGC, Dongyue and a few other Chinese makers, plus GFL. Making them takes hazardous chemistry and years of customer qualification, which keeps the number of suppliers small.' },
    { exhibit: { type: 'table', title: 'Global fluoropolymer makers: 2025 was a weak year for most', head: ['Company', 'Business', 'Latest year', 'Revenue', 'Margin', 'Trend'], wide: [5], rows: [
      ['Chemours (US)', 'Advanced Performance Materials', 'CY2025', 'US$1,263 mn', 'EBITDA 9%', 'Sales −5%; plant outages; Q2-2026 EBITDA US$26 mn (vs 50)'],
      ['Daikin (Japan)', 'Chemicals segment', 'FY to Mar-26', '¥281.5 bn', 'Op. margin 11.7%', 'Semiconductor slowdown; margin down from 17.5% (aggregator data)'],
      ['Syensqo (Belgium)', 'Specialty Polymers', 'CY2025', '€2,289 mn', 'n.d.', 'Sales −12% on electronics volumes and auto pricing'],
      ['Dongyue (China)', 'Fluoropolymers', 'CY2025 / H1-2026', 'RMB 3,930 mn', '9.1% → 20.5%', 'Price war in 2025; prices and margin recovered in H1-2026'],
      [`**GFL (India)**`, 'Fluoropolymers', 'FY26', `₹${n0(A26.fpRev)} cr`, 'n.d. (Chemicals 27%)', '+20% in FY26, +15% in Q1FY27'],
    ], source: 'Chemours 10-K and Q2-2026 release, Syensqo FY2025 results, Dongyue annual and interim reports, envalith (Daikin), GFL annual report' } },
    { exhibit: { type: 'table', title: 'Forces acting on GFL\'s markets', head: ['Theme', 'Direction', 'What it means'], wide: [2], rows: [
      ['Supply exits in the West', 'Tailwind', '3M finished leaving PFAS manufacturing at end-2025; AGC proposed (Jul-2026) to stop its UK PTFE/ETFE/FKM plant by end-2026. GFL says it has absorbed 3M\'s exit and is qualifying with AGC\'s customers.'],
      ['Chinese fluoropolymer prices', 'Mixed', 'Dongyue\'s fluoropolymer margin fell to 9% in 2025 on price competition, then recovered to 20.5% in H1-2026; Chinese makers raised PTFE prices 5% and FKM up to 15% from 1-Jun-2026.'],
      ['EU PFAS restriction', 'Headwind (from ~2028)', 'ECHA\'s risk committee adopted its opinion on a universal PFAS restriction (Mar-2026) and rejected a blanket exemption for fluoropolymers; the economics committee\'s draft allows an 18-month transition plus 5- or 12-year exemptions for specific uses. Final opinion due end-2026, then EU law-making. Europe is 26% of GFL\'s revenue.'],
      ['US trade', 'Easing', 'US anti-dumping/countervailing duties on Indian granular PTFE since Mar-2022 are now small for GFL (1.80% AD, 5.16% CVD after reviews). The 50% US tariff on India (Aug-2025) fell to 18% (Feb-2026), then to a 10% duty after the US Supreme Court ruling.'],
      ['India HFC phase-down', 'Tailwind now, cap later', 'Production frozen from 1-Jan-2028 at a 2024-26 baseline; no new HFC capacity will be cleared after 31-Dec-2027 (environment ministry, Apr-2026). Producers are racing to build capacity before the cut-off.'],
      ['China HFC quotas', 'Tailwind', 'China capped 2026 R32 output at 281,500 t; R32 prices stayed near RMB 63,000/t (Apr-2026), multi-year highs.'],
      ['Indian trade protection', 'Tailwind', 'R-134a anti-dumping duty imposed (Dec-2025); R-125 duty recommended (Sep-2026); GFL\'s fresh PTFE case against China/Russia (Mar-2026) after the Sep-2025 recommendation was not imposed.'],
      ['Battery demand in India', 'Tailwind', 'India added 8.2 GWh of battery storage in H1-2026 (9.3 GWh cumulative); a ₹13,000 cr battery-components incentive was proposed (Aug-2026), not approved by Sep-2026.'],
    ], source: 'ECHA committee documents via law-firm summaries, US Federal Register, MoEFCC office memo (1-Apr-2026), DGTR, Mercom, company calls (via GAM research file)' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: GFL is catching the fluoropolymer and refrigerant waves; batteries not yet',
  blocks: [
    { verdicts: [
      ['Western supply exits (3M, AGC)', 'Yes', 'Fluoropolymer revenue +20% in FY26 (audited) and +15% in Q1FY27; management credits 3M\'s exit for its move into high-end grades.', 'Real share gains in higher-value grades.'],
      ['Semiconductors and data centres', 'Partly', 'Approvals and first commercial orders for high-purity grades (PFA, FKM) since Q1-Q2FY26; most approvals due by end-FY27.', 'Small today; the mix shift is the margin story.'],
      ['Refrigerant tightness (China quotas, India freeze)', 'Yes', 'Fluorochemicals +52% in Q1FY27 on R32; 10kt plant full; 20kt from Q2FY27; R134a by end-FY27.', 'The biggest near-term profit driver; capped from 2028.'],
      ['EV and grid-storage batteries', 'No (not yet)', 'Battery revenue ₹33 cr in FY26 (segment), ₹14 cr in Q1FY27; EBITDA losses every quarter.', 'A ₹6,000 cr option, still unproven.'],
      ['Hydrogen and solar', 'No', 'Membrane and solar-film subsidiaries exist; no material revenue disclosed. Chemours called hydrogen demand weak in 2025.', 'Optionality only.'],
      ['India import substitution', 'Partly', 'GFL seeks anti-dumping duties on Chinese PTFE; R-134a duty imposed, R-125 duty recommended.', 'Protection helps domestic prices, but exports are 60% of revenue.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: 'Company filings and calls to Sep-2026, GAM Research' },
  ],
};

const fluoropolymers = {
  id: 'fluoropolymers', nav: 'Fluoropolymers', kicker: 'Segment', title: 'Fluoropolymers: steady growth from better grades, with new capacity needed',
  blocks: [
    { pair: [
      { type: 'column', title: 'Fluoropolymer revenue: +15% in Q1FY27', unit: 'Revenue (₹ crore)', x: QL, series: [{ name: 'Fluoropolymers', values: SQ.map(q => q.fpRev), fmt: 'num' }], labels: 'all', source: 'Investor presentations' },
      { type: 'column', title: 'Annual: FY23 peak regained in FY26', unit: 'Revenue (₹ crore, audited)', x: SA.map(a => a.fy), series: [{ name: 'Fluoropolymers', values: SA.map(a => Math.round(a.fpRev)), fmt: 'num' }], labels: 'all', source: 'Annual reports' },
    ] },
    { bullets: [
      '**What drives it.** Volume of new fluoropolymers (PFA, FKM, PVDF, FEP), which are "almost fully utilised", and a shift to higher grades in existing products. Management calls price increases "marginal" and mostly formula-based pass-through of input costs (sulphur, fluorspar, methanol rose sharply from Mar-2026).',
      '**Guidance.** 15-20% a year (17-20% in the closing remarks), "absolutely visible" for FY27 and FY28. Most customer approvals are due by end-FY27, and ₹250 cr of new capacity is being added; until then growth comes from debottlenecking and mix.',
      '**Competition.** Management says high-value grades see little direct Chinese competition. In commodity PTFE, China sets the price: Dongyue\'s 2025 fluoropolymer margin was 9%, and GFL itself has asked India for anti-dumping duties on Chinese PTFE.',
      '**Disclosure gap.** GFL does not disclose fluoropolymer capacity, volumes, prices or margins; we cannot separate volume from price.',
    ] },
    { callout: '**Our view:** this is GFL\'s best business: integrated from fluorspar, qualified with demanding customers, gaining share as Western makers retreat. We model 15% / 16% / 15% growth (FY27-29E), the bottom of guidance, because capacity is tight until the new lines run and Europe (26% of revenue) faces the PFAS restriction from around 2028.' },
  ],
};

const fluorochem = {
  id: 'fluorochem', nav: 'Refrigerants & bulk', kicker: 'Segment', title: 'Refrigerants: an R32 windfall with a regulatory ceiling; bulk chemicals: steady',
  blocks: [
    { pair: [
      { type: 'column', title: 'Fluorochemicals revenue by quarter', unit: 'Revenue (₹ crore)', x: QL, series: [{ name: 'Fluorochemicals', values: SQ.map(q => q.fcRev), fmt: 'num' }], labels: 'all', source: 'Investor presentations' },
      { type: 'column', title: 'Bulk chemicals: flat at ~₹160 cr a quarter', unit: 'Revenue (₹ crore)', x: QL, series: [{ name: 'Bulk chemicals', values: SQ.map(q => q.bulkRev), fmt: 'num' }], labels: 'all', source: 'Investor presentations' },
    ] },
    { bullets: [
      '**R22 is shrinking, R32 is booming.** Fluorochemicals fell from ₹1,518 cr in FY23 to ₹1,074 cr in FY26 as R22 quotas were cut under the Montreal Protocol and US tariffs hit R125. R32 changed that: the 10kt plant started in Mar-2026 and ran full in Q1FY27, lifting the business 52% to ₹458 cr. A second 10kt goes live in Q2FY27; 40-50% of R32 is on long-term contracts and export and domestic prices are "very close".',
      '**R134a and the quota race.** GFL is adding R134a (brownfield, by end-FY27) and AHF, aiming to use its full HFC entitlement before India freezes production in 2028 on a 2024-26 baseline. After 31-Dec-2027 no new HFC capacity will be cleared.',
      '**The ceiling.** From 2028 volumes are capped and fall 10% by 2032; Navin Fluorine (+15kt R32) and SRF are also adding capacity before the cut-off, and calendar 2027 is a "free year" in which new capacity can sell. R32 prices are near multi-year highs.',
      '**Bulk chemicals** (caustic soda, chloromethanes, 13% of revenue) mainly supply GFL\'s own chain; Q1FY27 revenue rose 11% on price; management expects caustic soda stable and chloromethanes range-bound.',
    ] },
    { callout: '**Our view:** R32 is a genuine windfall and the main reason FY27 earnings jump. We model fluorochemicals +70% in FY27 (about the Q1 run-rate), +18% in FY28 and +4% in FY29, when quotas bind and new Indian capacity competes. We do not assume today\'s R32 price lasts beyond FY28.' },
  ],
};

const evSq = SQ2.filter(q => q.evEbitda != null);
const battery = {
  id: 'battery', nav: 'Battery materials (GFCL EV)', kicker: 'Segment', title: 'Battery materials: ₹2,000 cr spent, ₹4,000 cr to go, ₹14 cr of sales a quarter',
  blocks: [
    { p: 'GFCL EV makes the chemicals inside a lithium-ion cell: LiPF6 salt and formulated electrolyte, LFP cathode material, PVDF binder, and soon natural-graphite anode, at an integrated complex at Jolva, Gujarat. The idea is sound: GFL already makes HF, PVDF and fluorine chemicals, and customers outside China want second suppliers. Management targets ₹6,000 cr of cumulative capex by FY28, ~2x asset turns (so ~₹12,000 cr of revenue at full use) and an EBITDA margin above 25%, with full potential by FY29. So far ~₹2,000 cr has been invested.' },
    { pair: [
      { type: 'column', title: 'Segment EBITDA: a loss every quarter', unit: 'GFCL EV EBITDA (₹ crore)', x: evSq.map(q => q.q), series: [{ name: 'EBITDA', values: evSq.map(q => q.evEbitda), fmt: 'num' }], labels: 'all', source: 'Investor presentations' },
      { type: 'column', title: 'Our forecast: from ₹16 cr to ₹2,200 cr', unit: 'Battery-materials revenue (₹ crore)', x: ['FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Revenue', values: [1, 16, ...F.seg.ev.revenue.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Annual reports (external sales), GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'What has been promised, and what has happened', head: ['Item', 'Plan / guidance', 'Status at Sep-2026'], wide: [1, 2], rows: [
      ['LiPF6 salt', 'Qualified with global electrolyte makers', 'Ramping; "almost finished qualification" (Q1 call)'],
      ['PVDF binder', 'Qualified by major customers (annual report)', '"Very close" to final qualification (Q1 call)'],
      ['LFP cathode', 'Final qualification by end-FY27', 'Revenue expected towards end-FY27'],
      ['Natural-graphite anode', 'New plant, capex not disclosed', 'Under construction at Dahej'],
      ['Oman plant (~US$216 mn)', 'Funded by Oman\'s sovereign fund (~₹1,200 cr, Mar-2026)', 'On hold (Aug-2026); moved to Dahej; Oman funding not available for India'],
      ['FY27 revenue', '₹500-700 cr at EBITDA break-even (Jul-2026 plant-visit note)', 'Q1 ₹14 cr, EBITDA −₹30 cr; management now targets ₹100 cr+ in Q4FY27'],
      ['Funding', 'IFC ₹430 cr (CCPS) in FY26; promoter warrants ₹200 cr at ₹35', '"Our fundraise process is on" (Aug-2026)'],
    ], source: 'Annual report FY26, Q4FY26 and Q1FY27 calls and presentations, IDBI Capital visit note (22-Jul-2026)' } },
    { exhibit: { type: 'table', title: 'What is the battery business worth? Three yardsticks', head: ['Yardstick', 'Value (₹ cr)', '₹ per GFL share', 'Comment'], wide: [3], rows: [
      ['Price paid by the promoter family and private investors (₹35 a share)', n0(evAt35), n0(gflEvPerShare), `~${n0(evShares)} cr GFCL EV shares (our estimate); GFL owns ~96%. A price set by insiders for a business with ₹33 cr of revenue; we do not treat it as fair value`],
      ['What the GFL share price implies', n0(impliedEvBiz), n0(impliedEvBiz / F.shares), `Market value ₹${n0(mcap)} cr less chemicals at 20x Sep-28E EBITDA (₹${n0(chemSep28)} cr) and all net debt at Sep-27E (₹${n0(ndSep27)} cr)`],
      ['Our base-case battery EBITDA (Sep-28E) at 20x',n0((segE('ev', 1) + segE('ev', 2)) / 2 * 20), n0((segE('ev', 1) + segE('ev', 2)) / 2 * 20 / F.shares), `Sep-28E battery EBITDA of ₹${n0((segE('ev', 1) + segE('ev', 2)) / 2)} cr; any value beyond FY29 has to come from the P/E multiple`],
    ], source: 'Annual report FY26 (notes 21, 22, 41, 51), GAM Research' } },
    { callout: '**Our view:** the battery business may well work. India\'s cell makers need local suppliers and GFL has the fluorine chemistry. But it has taken longer than planned at every step, funding is being reworked after Oman, and each new round at GFCL EV dilutes GFL. We model ₹220 cr / ₹1,000 cr / ₹2,200 cr of revenue (FY27-29E), about a fifth of the stated potential by FY29, turning EBITDA-positive in FY28. The bull case uses management\'s pace.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in fluoropolymers and refrigerant quotas; none yet in batteries',
  blocks: [
    { verdicts: [
      ['Vertical integration (fluorspar → HF → R22 → TFE → polymer)', 'Advantage', 'Own fluorspar mine in Morocco, captive chloroform and R22 feedstock, three integrated sites.', 'Cost and supply security most rivals lack.'],
      ['Customer qualification in high-end grades', 'Advantage', 'High-purity PFA/FKM approvals for semiconductors, aerospace and autos since FY26; qualification takes 1-3 years.', 'Sticky business once approved; supports mix gains.'],
      ['Scale', 'Advantage', 'India\'s largest fluoropolymer maker and one of few non-Chinese PTFE suppliers of size; no customer above 10% of revenue.', 'Credible alternative as 3M and AGC exit.'],
      ['Cost vs China in commodity grades', 'Disadvantage', 'Dongyue\'s 2025 fluoropolymer margin was 9%; GFL seeks anti-dumping duties on Chinese PTFE at home.', 'China sets the price in standard PTFE.'],
      ['HFC quota position', 'Advantage (until 2028)', 'Quotas will follow 2024-26 output; GFL is building R32/R134a to use its full entitlement; no new capacity after 2027.', 'Locks out late entrants; volume capped from 2028.'],
      ['Battery materials', 'None yet', 'Revenue ₹14 cr in Q1FY27; qualifications still under way; Chinese suppliers dominate electrolyte and cathode.', 'An option, not a moat.'],
      ['Balance sheet', 'Moderate', 'CRISIL AA+/Stable; net debt 1.7x EBITDA (FY26), rising with capex.', 'Can fund the plan, with less room for error.'],
    ], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** GFL has a **narrow moat in fluoropolymers** (integration, qualifications, scale outside China) and a **time-limited regulatory moat in refrigerants**. It has **no moat yet in battery materials**, which is where most of its capital is going. Because commodity PTFE is priced off China, returns swing with the cycle (ROE 27% in FY23, ~8% in FY24-26) instead of compounding.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit, flattering company metrics',
  blocks: [
    { bullets: [
      '**Forex gains inside "EBITDA".** The company\'s segment EBITDA (₹1,291 cr in FY26) includes ₹88.6 cr of net foreign-exchange gains (₹57.8 cr in FY25) that the annual P&L shows as other income. With the rupee at ~₹96/US$ in Jun-2026, these gains may not repeat. We use Screener\'s annual basis (₹1,201 cr) and assume no forex gains.',
      '**Return metrics exclude the new money.** Company ROCE (14.05%) and ROE (12.17%) for FY26 leave out capital in capacity added over two years and CWIP. On total equity, ROE was ~7.6%.',
      '**IFC money is a liability at fair value.** The ₹430 cr CCPS in GFCL EV are carried at fair value through profit or loss: if the subsidiary\'s value rises, GFL books a loss.',
      '**Subsidiary stock options at ₹1.** GFCL EV granted 75 lakh options at ₹1 to key managers in FY26 when it was selling shares at ₹35; the DMD\'s FY26 ESOP charge was ₹8.21 cr. This is a real cost that will grow if GFCL EV succeeds.',
      '**One-offs.** ₹19.5 cr labour-code charge in FY26; Q4FY25 profit included a ₹29 cr deferred-tax gain. In Q1FY27 some export (CIF) sales booked earlier in the US and German trading arms were reversed in the standalone books (consolidated unaffected).',
      '**Working capital.** Inventory of ~450 days of revenue (Screener basis) ties up ₹1,933 cr; any fall in prices would hit inventory values.',
    ] },
    { callout: '**Accounting flag: AMBER.** The audit (Patankar & Associates) is unqualified and segment disclosure reconciles. The amber is for presentation choices that flatter: forex gains in EBITDA, ROCE/ROE that exclude new capital, and subsidiary-level options and instruments that sit outside the headline numbers.' },
  ],
};

module.exports = { industry, tailwind, fluoropolymers, fluorochem, battery, moat, quality };
