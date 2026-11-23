// Divi's report, part 2: what Divi's does, history and corporate actions, industry, tailwind test.
const X = require('./DIVISLAB.ctx');
const { C, D, A, F, n0, n1, pc, HIST, QH, FY26, Q1, SA, BL, P } = X;
const G = C.geography.rows, g26 = G.find(r => r.fy === 'FY26'), tot26 = Object.entries(g26).filter(([k]) => k !== 'fy').reduce((s, [, v]) => s + v, 0);
const PS = C.productShares;

const business = {
  id: 'business', nav: 'What Divi\'s does', kicker: 'Company', title: 'One chemistry platform, three businesses: custom synthesis for big pharma, bulk generic APIs, and carotenoids',
  blocks: [
    { p: `Divi's makes the active ingredients that go into other companies' medicines; it sells no finished drugs and competes with none of its customers. It runs three plants: Unit 1 near Hyderabad, Unit 2 near Visakhapatnam (which also houses the nutraceutical plant) and Unit 3 at Kakinada, which started in January 2025 and makes starting materials for the other two. About 89% of revenue is exported, ${Math.round(g26.Europe / tot26 * 100)}% to Europe and ${Math.round(g26['North America'] / tot26 * 100)}% to North America (FY26). It employs ~19,300 people, ~700 of them scientists, and has ~18,600 KL of reactor capacity.` },
    { exhibit: { type: 'table', title: "Divi's three businesses (FY26)", head: ['Business', 'Revenue (₹ cr)', 'Share', 'What it is', 'Who buys', 'Economics'], wide: [3, 4, 5], rows: [
      ['**Custom synthesis (CS)**', n0(BL.base.cs), '55%', 'Contract manufacturing of patented or late-life-cycle APIs and advanced intermediates to the customer\'s process; peptide fragments; iodine contrast media', '12 of the top 20 pharma companies; 18-20 projects commercial or being commercialised', 'Long contracts, volume commitments, capacity-reservation advances; margins vary by molecule; nothing disclosed by product'],
      ['**Generic APIs**', n0(BL.base.generics), '36%', '~30 large-volume off-patent APIs made in tens to thousands of tonnes (naproxen, dextromethorphan, levetiracetam, valsartan, gabapentin, carbidopa/levodopa)', 'Generic formulators worldwide, mostly on long-term contracts with raw-material clauses', 'World\'s largest maker of 10 APIs, 60-70% share in several; two years of price erosion; volumes stable'],
      ['**Nutraceuticals**', n0(BL.base.nutra), '9%', 'Carotenoids (astaxanthin, beta-carotene, lycopene, canthaxanthin) and vitamins A, D, E, K2 as powders, beadlets and liquids', 'Food, supplement and animal-feed makers', '20 years old; +21% in FY26; capacity being added'],
    ], source: 'Q4FY26 call (45:55 split incl. nutraceuticals in generics; nutraceuticals ₹946 cr); AR FY26 business portfolio; GAM split' } },
    { pair: [
      { type: 'hbar', title: 'Europe is 61% of revenue; the US only 13%', unit: 'FY26 standalone revenue by destination (₹ crore)', x: ['Europe', 'North America', 'India', 'Asia', 'Rest of world'], series: [{ name: 'Revenue', values: [g26.Europe, g26['North America'], g26.India, g26.Asia, g26.RoW], fmt: 'num' }], labels: 'all', source: 'AR FY26 (sales by geography)' },
      { type: 'column', title: 'Custom synthesis share: 44% in FY23, 60% in Q1FY27', unit: 'Custom synthesis, % of revenue', x: [...SA.map(a => a.fy), 'Q1FY27'], series: [{ name: 'CS share', values: [...SA.map(a => a.csPct), Q1.csPct], fmt: 'pct0' }], labels: 'all', min: 0, max: 70, source: 'Company disclosures on each Q4 call and the Q1FY27 call' },
    ] },
    { p: `**Concentration is opaque.** Divi's names no customers or molecules ("we are bound by CDAs", confidentiality agreements). The only product data are life-cycle disclosures in the sustainability report: valsartan was ${PS.FY25.Valsartan}% of standalone turnover in FY25 and ${PS.FY26.Valsartan}% in FY26, naproxen ${PS.FY25.Naproxen}% and ${PS.FY26['Naproxen sodium']}%, levetiracetam ${PS.FY26.Levetiracetam}%. Valsartan's fall is consistent with generic entry for Novartis's Entresto (sacubitril/valsartan) in the US in July 2025, a late-life-cycle custom product analysts link to Divi's; the CEO will not confirm any product but says Divi's routinely manages "late life cycle" volumes with its customers.` },
    { callout: "**So what:** Divi's is not a generic company with a contract arm, nor a pure CDMO. It is a process-chemistry platform that uses the same plants, people and backward integration for both. That keeps costs low and lets capacity swing to whatever pays, but it also means investors cannot see the economics of any single contract, and must take the pipeline largely on trust." },
  ],
};

const eraRows = [
  ['**FY15–FY20: Compounding**', 'Generic API leadership and steady custom synthesis; Unit 2 import alert (Mar-Nov 2017)', '₹3,115 cr → ₹5,394 cr', '33–38%', 'Revenue ~12% a year; FY18 revenue −4% in the import-alert year; EPS ₹32 → ₹52'],
  ['**FY21–FY22: Covid windfall**', 'Emergency demand and Covid APIs (authorised molnupiravir API maker, May-2021); North America revenue ₹3,833 cr in FY22', '₹6,969 cr → ₹8,960 cr', '41–43%', 'EPS ₹74.8 → ₹111.5; ROE 28%; custom synthesis 59% of revenue'],
  ['**FY23–FY24: Hangover**', 'Molnupiravir orders end (near nil from Q3FY23); generic price erosion and raw-material inflation', '₹7,768 cr → ₹7,845 cr', '28–31%', 'EPS ₹68.7 → ₹60.3; constant-currency growth −21% then −2%; ROE 12%'],
  ['**FY25–FY27: Rebuild**', 'New contracts with dedicated capex (~₹2,000 cr); Kakinada; peptides; rupee slump after Feb-2026', '₹9,360 cr → ₹10,560 cr; Q1FY27 ₹3,080 cr', '32–41%', 'EPS ₹82.5 → ₹96.7; Q1FY27 ₹34.0; capex 24% of sales'],
];
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Thirty-six years of process chemistry, one regulatory scare, one windfall, and a founder still in charge',
  blocks: [
    { p: "Dr. Murali K. Divi founded Divi's Research Centre in 1990 after co-founding Cheminor Drugs, which later merged into Dr. Reddy's. Divi's built its name making generic APIs at lower cost than anyone (by redesigning the chemistry and making its own starting materials) and doing contract work for innovators who valued its reliability. It listed in 2003 and issued 1:1 bonus shares in FY16; the share count (26.5 cr) has not changed since. The numbers fall into four eras." },
    { exhibit: { type: 'table', title: "The four eras of Divi's (FY15–FY27)", head: ['Era', 'What happened', 'Revenue', 'EBITDA margin', 'What it did to the numbers'], wide: [1, 4], rows: eraRows, source: 'Screener.in; AR FY26 geography; earnings calls; press reports on molnupiravir (Business Standard, IIFL)' } },
    { exhibit: { type: 'table', title: 'Corporate actions and events that changed the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.timeline.map(t => [t.date, t.event, t.impact]), source: 'Company filings and calls; Business Standard (2017 import alert); GAM Research' } },
    { callout: "**Lesson from history:** Divi's has twice shown how fast its numbers move with a few large products: the 2017 import alert cut a year's growth, and Covid-era products lifted North America revenue to ₹3,833 cr in FY22 before it fell to ₹1,310 cr in FY24. The dedicated projects now coming on stream are the same kind of lumpy, customer-dependent revenue, which is why we do not extrapolate Q1FY27." },
  ],
};

const IN = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: outsourcing and peptides are growing fast; generic APIs are a price war; the war in West Asia raised costs and sank the rupee',
  blocks: [
    { p: `**Contract manufacturing (CDMO) is the growth engine.** Drug companies increasingly outsource chemistry to specialists. The company quotes a global CDMO market of ~USD ${IN.cdmo.globalUsdBn2024} bn (2024) heading to USD ${IN.cdmo.globalUsdBnEarly2030s} bn by the early 2030s, with API CDMO the largest part (USD ${IN.cdmo.apiCdmoUsdBn2024} bn to ${IN.cdmo.apiCdmoUsdBn2033} bn by 2033), and BCG expects India's CRDMO sector to grow from USD ${IN.cdmo.indiaCrdmoUsdBnNow} bn to ${IN.cdmo.indiaCrdmoUsdBn2035} bn by 2035. Peptide medicines (led by GLP-1 drugs for diabetes and obesity) are ~USD ${IN.peptides.marketUsdBn2025} bn (2025) and could double by 2033; Macquarie sizes the peptide CDMO market at ~USD ${IN.peptides.peptideCdmoUsdBn2025} bn in 2025 rising to USD ${IN.peptides.peptideCdmoUsdBn2030} bn by 2030.` },
    { pair: [
      { type: 'column', title: 'Market sizes quoted by the company (USD bn)', unit: 'USD billion', x: ['Global CDMO 2024', 'Global CDMO early 2030s (mid)', 'Peptides 2025', 'Peptides 2033'], series: [{ name: 'USD bn', values: [150, 295, 140, 295], fmt: 'num' }], labels: 'all', source: 'AR FY26 operating context (company-cited industry estimates)' },
      { type: 'column', title: "India's CRDMO sector could grow ~7x by 2035", unit: 'USD billion (BCG, quoted in AR FY26)', x: ['Now', '2035 (mid)'], series: [{ name: 'India CRDMO', values: [3.25, 23.5], fmt: 'n1' }], labels: 'all', source: 'AR FY26 (BCG estimate, midpoints of ranges)' },
    ] },
    { p: "**Generic APIs are a price war.** Prices for large-volume APIs have fallen for two years as Chinese producers cut prices and insurers squeeze generic drug makers. Divi's says its volumes held and it lost no customers, but generic API revenue grew only ~1% in FY26 (PL's split) and ~6% in Q1FY27. China's withdrawal of export tax rebates on some chemicals from April 2026 raises input costs more than it helps Indian API makers. **The West Asia war (from 28-Feb-2026)** then doubled or tripled solvent prices, tightened methanol and ammonia supply and pushed freight up; it also sent the rupee to record lows (~95-97 per US dollar in May-June 2026), which lifts the rupee value of Divi's exports." },
    { exhibit: { type: 'table', title: 'Policy and trade forces at 30-Sep-2026', head: ['Force', 'What it is', "What it means for Divi's"], wide: [1, 2], rows: [
      ['US BIOSECURE Act', IN.biosecure.item, 'Supportive over years: innovators diversify away from Chinese CDMOs; India and Divi\'s capacity benefit'],
      ['US Section 232 tariffs', 'From 31-Jul / 29-Sep-2026: 100% on patented drugs and their APIs; 15% for EU, Japan, Switzerland; 0-20% for companies with onshoring/pricing deals; generics exempt', 'Small direct effect (most CS goes to European and Japanese innovators); risk that customers localise future supply in the US'],
      ['China export-rebate withdrawal', 'Rebates on certain chemicals removed from 1-Apr-2026', 'Higher input costs; Divi\'s now buys 78% of materials (by quantity) in India'],
      ['West Asia war', 'Solvent, ammonia and freight shocks; force majeure by suppliers', 'Three-month stockpile, higher inventory; partly passed on through contract clauses'],
      ['Weak rupee', 'Record lows in May-Jun 2026', 'Exports ~90% of sales vs imports ~40% of raw materials: rupee revenue and margins up while it lasts'],
    ], source: 'Covington (Section 232, Apr-2026); Moneycontrol via TradingView (BIOSECURE, Dec-2025); Q3FY26-Q1FY27 calls; rupee press reports' } },
  ],
};

const tailwind = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach Divi\'s?', title: "Tailwind test: Divi's captures outsourcing and China+1, but not generic pricing or (yet) GLP-1",
  blocks: [
    { p: "A sector tailwind helps a shareholder only if the company captures it. We score each driver on whether Divi's is a main beneficiary, a partial one, or a bystander." },
    { verdicts: [
      ['Big-pharma outsourcing of small molecules', 'Yes', 'Three dedicated projects (~₹2,000 cr), customer advances of ₹1,207 cr in FY26, CS +20% in FY26 and +45% in Q1FY27', 'The clearest win: customers are paying for capacity in advance'],
      ['China+1 / BIOSECURE', 'Yes', "One of the few Indian sites with the scale, EHS record and regulatory history big pharma requires; Macquarie calls it the front-runner", 'Supports the pipeline over 3-5 years rather than next quarter'],
      ['GLP-1 and peptides', 'Partly', 'Integrated from protected amino acids to fragments; several 3,000-litre SPPS lines; fragments validated; no disclosed commercial GLP-1 revenue', 'Real optionality, but the street (Citi: supplies from FY27) is ahead of what the company confirms'],
      ['Generic API demand', 'Partly', 'Volumes steady, 60-70% share in key molecules, but prices falling; revenue ~+1% in FY26', 'Volume yes, value no'],
      ['Patent expiries (new generic APIs)', 'Partly', 'Four new DMFs (brivaracetam, ticagrelor among them); commercial in 3-6 months', 'Adds growth, but small against a ₹3,800 cr base'],
      ['Contrast media', 'Yes', 'Commercial iodine supplies to innovators; two long-term contracts being signed; gadolinium in Phase II/III', 'A growing niche with few qualified suppliers'],
      ['Weak rupee', 'Yes', 'Exports ~90% of sales; Q1FY27 growth 28% reported vs ~10% constant currency', 'Cyclical, not structural; reverses if the rupee recovers'],
      ['US tariffs on patented APIs', 'No', 'Customers may localise; direct exposure small (North America 13%)', 'A headwind to watch, not yet visible'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: "Tailwind scorecard: Divi's captures 4 of 8 directly, 3 partly, misses 1", source: 'Company calls and filings; Macquarie, Citi notes; GAM Research' },
    { callout: "**Our view:** the structural tailwinds (outsourcing, China+1, contrast media) reach Divi's directly and are visible in customer prepayments. The tailwinds the stock is most excited about, GLP-1 peptides and the dedicated projects, are real but not yet in the numbers, and the one most visible in Q1FY27 (the rupee) is the least durable." },
  ],
};

module.exports = { business, history, industry, tailwind };
