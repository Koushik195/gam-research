// Infosys report, part 2: business, history, industry, the central question (cyclical slowdown or lasting
// de-rating from generative AI), tailwind test.
const X = require('./INFY.ctx');
const { C, D, F, A, n0, n1, pc, rup, SRC, SA, SQ, QL, A26, A25, Q1, FY26, b, P, derate, PEER_SYMS, shortName, Q1G, MED5, INCUMBENTS, MIDCAPS, sectorDr, allDr, price } = X;
const VN = X.UB.names, VK = X.VK;
const q1 = SQ.find(q => q.q === 'Q1FY27'), q1p = SQ.find(q => q.q === 'Q1FY26');
const g = (a, c) => (a / c - 1) * 100;

const business = {
  id: 'business', nav: 'What Infosys does', kicker: 'The business', title: 'IT services for ~2,000 large companies, 56% in North America, billed mostly by the person-hour',
  blocks: [
    { p: `Infosys builds, runs and modernises software and IT systems for large companies: application development and maintenance, ERP (SAP, Oracle) and cloud migration, infrastructure management, data and AI projects, engineering services, consulting and business-process outsourcing. It also sells software, mainly Finacle core-banking (through EdgeVerve). It had ${n0(C.profile.activeClients)} active clients at Jun-2026, of which ${C.profile.clients100mn} pay more than US$100 mn a year and ${n0(C.profile.clients1mn)} more than US$1 mn; the top 25 clients are 33.9% of revenue. Work is delivered mostly from India (77% of effort offshore) by ${n0(C.profile.employees)} people. Most contracts are priced on time-and-materials or fixed price for a defined scope, which is exactly what AI coding and automation tools now compress.` },
    { exhibit: { type: 'table', title: 'Revenue by vertical (US$ mn)', head: ['Vertical', 'FY26', 'Share', 'FY26 growth', 'Q1FY27 YoY', 'What clients buy'], wide: [5], rows: [
      ...[['fs', 'Banks, insurers, capital markets: core-banking, payments, Guidewire, GCC set-ups'], ['mfg', 'Auto, aerospace, industrials: SAP S/4HANA, engineering, infrastructure outsourcing'], ['eurs', 'Energy, utilities, resources, services: grid, trading, operations, cloud'], ['retail', 'Retailers and consumer goods: commerce, supply chain, AI-led modernisation'], ['comm', 'Telecom operators, media, network OEMs: IT operations, BSS/OSS, mainframe migration'], ['hitech', 'Software and technology companies: product engineering'], ['ls', 'Pharma, health payers and providers (Optimum Healthcare IT from Q1FY27)'], ['others', 'India, public sector and others']].map(([k, w]) => [VN[k], n0(A26[k + 'Rev']), `${A26[k + 'Pct']}%`, pc(g(A26[k + 'Rev'], A25[k + 'Rev'])), pc(g(q1[k + 'Rev'], q1p[k + 'Rev'])), w]),
      { hl: true, cells: ['**Total**', `**${n0(A26.usdRev)}**`, '**100%**', `**${pc(FY26.usdGrowthPct)}**`, `**${pc(Q1.usdYoYPct)}**`, 'Constant currency: +3.1% (FY26), +2.4% (Q1FY27)'] },
    ], source: 'Infosys fact sheets (vertical mix x US$ revenue, summed over quarters); GAM Research' } },
    { pair: [
      { type: 'hbar', title: 'Financial services is the biggest vertical; life sciences the fastest-growing (acquisition)', unit: 'FY26 revenue (US$ mn)', x: VK.map(k => VN[k]), series: [{ name: 'FY26', values: VK.map(k => A26[k + 'Rev']), fmt: 'num' }], labels: 'all', highlight: VN.fs, source: 'Infosys fact sheets; GAM Research' },
      { type: 'stacked', title: 'North America 56%, Europe rising to 32%', unit: 'Revenue by client geography (%)', x: QL, series: [{ name: 'North America', values: SQ.map(q => q.naPct), fmt: 'n1' }, { name: 'Europe', values: SQ.map(q => q.euPct), fmt: 'n1' }, { name: 'Rest of world', values: SQ.map(q => q.rowPct), fmt: 'n1' }, { name: 'India', values: SQ.map(q => q.indiaPct), fmt: 'n1' }], minLabel: 5, source: 'Infosys fact sheets' },
    ] },
    { exhibit: { type: 'table', title: 'Scale and delivery', head: ['', 'Detail'], wide: [1], rows: [
      ['People', `${n0(C.profile.employees)} employees (Jun-2026), 310,039 software professionals; ${n0(FY26.freshersHired)} graduates hired in FY26, ~20,000 planned for FY27; voluntary attrition ${Q1.attritionPct}%`],
      ['Delivery', `Onsite 22.8% / offshore 77.2% of effort; utilisation excl. trainees ${Q1.utilExTraineesPct}%; 58.2 mn sq ft of campuses; 59 countries, 290 locations`],
      ['Clients', `${n0(C.profile.activeClients)} active; ${C.profile.clients100mn} at >US$100 mn, ${C.profile.clients50mn} at >US$50 mn, ${C.profile.clients10mn} at >US$10 mn; top-10 clients 19.9% of revenue`],
      ['Platforms', rup(C.profile.platforms)],
      ['AI', '"AI-first" services (six areas: AI strategy & engineering, data, process, legacy modernisation, physical AI, trust) 8.2% of revenue in Q1FY27; partnerships with OpenAI, Anthropic, Google, Microsoft, NVIDIA, AWS; 80,000+ staff use AI coding tools'],
    ], source: 'Q1FY27 fact sheet and call; AR FY26; Q4FY26 call' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Forty-five years: founder-led growth, a 2017 governance crisis, then a decade under Salil Parekh',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: C.historySrc } },
    { callout: '**Corporate actions and per-share data:** a 1:1 bonus in FY19 (per-share history is adjusted) and buybacks in FY18, FY20, FY22, FY23 and FY26 cut the share count from ~437 cr (FY19) to 405.56 cr (Mar-2026). Screener restates FY26 EPS on the year-end count (₹72.59); the company reports ₹71.58 on weighted shares, because the last buyback closed in December. We use the year-end count throughout (INFY.patch.js puts profit on the attributable basis so the model\'s share count matches the 405.56 cr actually issued). One-offs: interest on tax refunds and reversals of tax provisions added ₹4.76 to FY24 EPS and ₹1.03 to FY25; in FY26 tax-order gains (₹381 cr of interest, ₹774 cr of reversals) roughly offset the ₹1,289 cr Labour Codes charge.' },
  ],
};

const IND = PEER_SYMS;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A mature industry: large incumbents grow 0-4%, mid-sized challengers 10-25%',
  blocks: [
    { p: 'Indian IT services grew for three decades on labour arbitrage: an Indian engineer cost a fraction of a Western one, and clients moved application maintenance, testing and infrastructure work offshore. The large incumbents (TCS, Infosys, HCLTech, Wipro, Tech Mahindra) now earn US$6-30 bn each and grow slowly; mid-sized firms (LTIMindtree, Persistent, Coforge, Mphasis) have grown faster by focusing on fewer clients and newer work. Two things changed in 2025-26. Generative AI tools began writing and testing code, so clients expect the same work for less money. And the cycle turned: European industry, retail and telecom clients cut discretionary projects. The table below shows how the forces stood on 30-Sep-2026.' },
    { exhibit: { type: 'table', title: 'Forces acting on IT services (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Infosys'], wide: [2], rows: D.industry.themes.map(r => r.map(rup)), source: D.industry.src } },
    { exhibit: { type: 'table', title: 'Listed Indian IT services companies', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'ROE', 'Q1FY27 revenue growth (₹, YoY)'], rows: IND.map(s => [s === 'INFY' ? '**Infosys**' : shortName(s), n0(P[s].mcapCr), n0(P[s].revenue), P[s].ebitdaMargin + '%', P[s].roe + '%', pc(Q1G[s])]), source: 'Screener.in (consolidated; market value at the 30-Sep-2026 close). Rupee growth flatters everyone by ~10 points of currency; Coforge and Persistent include acquisitions.' } },
    { pair: [
      { type: 'hbar', title: 'Q1FY27 rupee revenue growth: mid-caps ahead, incumbents ~10-14%', unit: 'Revenue growth, Jun-2026 quarter, YoY (₹, %)', x: IND.map(shortName), series: [{ name: 'Growth', values: IND.map(s => Math.round(Q1G[s] * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'Infosys', source: 'Screener.in (consolidated)' },
      { type: 'hbar', title: 'Margins: Infosys second only to TCS among the large players', unit: 'FY26 EBITDA margin (%)', x: IND.map(shortName), series: [{ name: 'EBITDA margin', values: IND.map(s => P[s].ebitdaMargin), fmt: 'pct' }], labels: 'all', highlight: 'Infosys', source: 'Screener.in (consolidated)' },
    ] },
  ],
};

const SQn = D.industry.sectorQuestion;
const aiQuestion = {
  id: 'ai-question', nav: 'The AI question', kicker: 'The central question', title: 'Cyclical slowdown or lasting de-rating? Mostly lasting',
  blocks: [
    { p: `Indian IT shares fell hard in 2026: the Nifty IT index lost ~14% in seven sessions in February after a new Anthropic AI tool triggered a global sell-off in software and outsourcing stocks, was down ~25% for the year by June and ~24% by early September (Business Today, AIM). Infosys fell from ~₹1,650 at the end of January to ₹${n0(price)} on 30-Sep-2026 (−41%). Its trailing P/E is ${Math.abs(Math.round(derate.INFY))}% below its five-year median; TCS's is ${Math.abs(Math.round(derate.TCS))}% below. The question that decides the stock is whether this is a cyclical slowdown that will reverse, or a lasting loss of value because generative AI shrinks the traditional services work these companies sell.` },
    { exhibit: { type: 'table', title: 'The evidence, as of 30-Sep-2026', head: ['Points to a lasting de-rating', 'Points to a cycle'], wide: [0, 1], rows: SQn.structural.map((s, i) => [rup(s), rup(SQn.cyclical[i] || '')]), source: 'Infosys Q4FY26 and Q1FY27 calls and fact sheets; Kotak (3-Jul-2026); Nirmal Bang and Anand Rathi (24-Jul-2026); Business Today (12-Feb and 9-Sep-2026)' } },
    { pair: [
      { type: 'line', title: 'Employees +4% in two years (incl. acquisitions), US$ revenue +8%', unit: 'Index, Q1FY25 = 100', x: QL, series: [{ name: 'US$ revenue', values: SQ.map(q => Math.round(q.usdRev / SQ[0].usdRev * 1000) / 10), fmt: 'n1' }, { name: 'Employees', values: SQ.map(q => Math.round(q.headcount / SQ[0].headcount * 1000) / 10), fmt: 'n1' }], labels: 'last', min: 95, max: 110, source: 'Infosys fact sheets (Q1FY27 includes ~2,000 staff from acquisitions)' },
      { type: 'column', title: 'AI-first services: 5.5% to 8.2% of revenue in two quarters', unit: 'AI-first services, % of revenue (company)', x: ['Q3FY26', 'Q1FY27'], series: [{ name: 'AI share', values: [Q1.aiRevPctQ3FY26, Q1.aiRevPct], fmt: 'pct' }], labels: 'all', source: 'Infosys Q1FY27 call (23-Jul-2026); Q4FY26 not disclosed' },
    ] },
    { bullets: [
      '**What AI does to the business model.** Infosys is paid mostly for effort. If AI tools let 80 people do the work of 100, a client renewing a contract expects to pay less; the CFO calls this "AI-led deflation" and says it now appears mid-contract as well as at renewal. Kotak assumes 3-3.5% a year of deflation for incumbents. Infosys does not quantify it.',
      '**What AI gives back.** New work: building agents, preparing data, modernising legacy code (e.g. 3 mn lines of COBOL for Hertz at 60% lower cost), AI-led operations. This is 8.2% of revenue and growing double digits a quarter. Management compares it to digital (20% to 60% of revenue in a few years) but gives no target; the definition is its own.',
      '**Why the cycle is not the whole story.** Volumes were flat in FY26 even before the 2026 macro shocks, the deflation is described as broad across verticals, and the FY27 cut came despite strong deal wins. Large-deal TCV now converts into less revenue, because renewals are repriced.',
      '**Why it is not a collapse either.** Clients still need someone to run, secure and integrate their systems and to deploy AI inside them; vendor consolidation favours large, trusted suppliers; margins and cash have not cracked; and the industry has absorbed earlier productivity shifts (automation, cloud) by moving to new work.',
    ] },
    { callout: `**Our verdict:** ${rup(SQn.verdict)} In numbers: we assume organic US$ growth of only ~3-3.5% in FY28-29 (AI work offsetting deflation), a flat ~21% EBIT margin, and a target multiple of 14x - the level to which the large incumbents (TCS, Wipro, HCLTech; median ${pc(sectorDr)}) have de-rated, not the ${pc(allDr)} of the wider peer group, which includes mid-caps still growing in double digits.` },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Infosys gets the rupee and the consolidation wins, not the growth',
  blocks: [
    { verdicts: [
      ['Enterprise AI adoption', 'Partly', 'AI-first services 8.2% of revenue; 80,000 staff on AI coding tools; partnerships with all major model makers.', 'New revenue, but it also deflates the existing book; net effect so far ~zero.'],
      ['Vendor consolidation', 'Yes', '20% of Q1FY27 large-deal TCV from consolidation wins; six deals worth US$700 mn of net new work at "very healthy margins".', 'Infosys is a consolidator, not a victim.'],
      ['Weak rupee', 'Yes', 'Rs/US$ from 88.6 (FY26 average) to 95.8 (30-Sep-2026); +70 bp of margin in Q1FY27 alone; rupee revenue +14% YoY.', 'Lifts rupee EPS; it is not a business improvement and can reverse.'],
      ['Global capability centres (GCCs)', 'Partly', 'Infosys sets up and runs GCCs (a large AI-first GCC deal for a US bank in FY26) but some clients insource work into their own centres.', 'Neutral to slightly negative for revenue.'],
      ['US banking budgets', 'Yes', 'Financial services grew 5.4% in FY26 with ~US$1 bn of large-deal net new TCV in Q1FY27; expected to grow above the company average.', 'The steadiest vertical.'],
      ['European industry and auto', 'No (headwind)', 'A large European manufacturing client cost >1% of FY27 growth; European auto decisions "elongated".', 'Cyclical; should fade from FY28.'],
      ['Price increases (Project Maximus)', 'Yes, fading', 'FY26 growth came from realisation, not volume; in Q1FY27 price rose less than planned because of AI productivity asks and competition.', 'The price lever is weakening just as volumes stall.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { business, history, industry, aiQuestion, tailwind };
