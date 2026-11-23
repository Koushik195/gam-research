// Laurus Labs report, part 2: what Laurus does, history and corporate actions, industry, tailwind test.
const X = require('./LAURUSLABS.ctx');
const { C, D, A, F, n0, n1, SA, Q1, FY26, BL } = X;
const IN = D.industry, PR = C.profile;
const s26 = k => Math.round(BL.base[k] / A.sales[X.b] * 100);

const business = {
  id: 'business', nav: 'What Laurus does', kicker: 'Company', title: 'Two businesses on one chemistry platform: contract manufacturing for innovators, and low-cost generic medicines led by anti-retrovirals',
  blocks: [
    { p: `Laurus makes active pharmaceutical ingredients (APIs, the chemical in a medicine that does the work), intermediates and finished tablets. It reports two divisions. **CDMO** (contract development and manufacturing) makes patented molecules to an innovator's process, from clinical batches to commercial supply, for human health, animal health and crop science, plus fermentation products through Laurus Bio. **Affordable Medicines** (its name for generics) sells generic APIs and its own formulations, led by anti-retrovirals (ARVs) for HIV, where Laurus supplies about a third of the world's patients through global-health tenders, plus oncology, cardiovascular, diabetes and gastro products and long-term contract supply of generics (CMO). It runs ${PR.sites.split(' ')[0]} manufacturing sites, mostly around Visakhapatnam, with ~8,800 KL of reactors, 12 bn tablets a year of formulation capacity and ~${n0(PR.employees)} employees (FY26). About 67% of FY26 revenue was exported; no customer was over 10% of revenue (AR FY26).` },
    { exhibit: { type: 'table', title: "Laurus's four revenue lines (FY26)", head: ['Line', 'Revenue (₹ cr)', 'Share', 'What it is', 'Who buys', 'Economics'], wide: [3, 4, 5], rows: [
      ['**CDMO - small molecules**', n0(BL.base.cdmo), `${s26('cdmo')}%`, 'On-patent intermediates and APIs made to the customer\'s process; Laurus Labs plus Laurus Synthesis (animal health and crop, ₹491 cr turnover)', 'Global innovators incl. big pharma; >125 active projects; names confidential', 'Project-based and lumpy; 50% commercial supply in FY26, 55% in Q1FY27; highest EBITDA once commercial'],
      ['**CDMO - Laurus Bio**', n0(BL.base.bio), `${s26('bio')}%`, 'Precision fermentation, enzymes and biocatalysis, animal-origin-free cell-culture ingredients, alternate proteins (78.34% owned)', 'Biotech, food, materials and pharma customers', '~₹200 cr turnover, ₹6.7 cr profit in FY26; a 400 KL plant is being added'],
      ['**Generic API**', n0(BL.base.api), `${s26('api')}%`, 'ARV APIs (~2/3 of ARV sales), oncology and other APIs', 'Generic formulators, global-health suppliers, CMO partners', 'Volume business; ARV pricing broadly flat in FY26; 92 DMFs filed'],
      ['**Formulations (FDF)**', n0(BL.base.fdf), `${s26('fdf')}%`, 'ARV tablets for tenders; non-ARV generics in the US, EU, Canada and emerging markets; integrated CMO contracts', 'Global Fund/donor programmes, distributors, generic partners', '+26% in FY26 on new capacity and launches; 96 developed-market dossiers filed'],
    ], source: 'Q4FY26 presentation; AR FY26 (AOC-1, note 17); Q4FY26 and Q1FY27 calls' } },
    { pair: [
      { type: 'column', title: 'ARV revenue has gone sideways since the FY21 peak; ₹2,807 cr in FY26', unit: 'ARV revenue (₹ crore)', x: Object.keys(C.segmentsHistory.arv).filter(k => /^FY/.test(k)), series: [{ name: 'ARV (API + FDF)', values: Object.entries(C.segmentsHistory.arv).filter(([k]) => /^FY/.test(k)).map(([, v]) => v), fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation (ARV chart; FY23/FY24 order is our reading)' },
      { type: 'column', title: 'Q1FY27 revenue mix: CDMO 43%', unit: '₹ crore', x: ['CDMO small molecules', 'Laurus Bio', 'Generic API', 'Formulations'], series: [{ name: 'Q1FY27', values: [Q1.cdmoSM, Q1.bio, Q1.api, Q1.fdf], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation' },
    ] },
    { p: '**What Laurus means by CDMO.** All CDMO revenue is innovator work on patented molecules; contract manufacturing of off-patent products is booked as CMO inside Affordable Medicines (Head CDMO, 24-Jul-2026). Most clinical programmes are APIs or advanced intermediates rather than early starting materials, which ties Laurus to a customer for the life of the molecule. Management names no customer, molecule or contract value, and will not give segment margins.' },
    { callout: "**So what:** Laurus is a generic-medicines company that has used its chemistry, scale and regulatory record to build a contract-manufacturing business now worth ~₹2,100 cr of revenue and rising fast. The ARV franchise is the cash engine; CDMO is the growth engine; Bio and advanced biologics are options. Investors are paying for the second and the third, but cannot see the economics of any single contract." },
  ],
};

const eraRows = [
  ['**FY15–FY20: ARV ingredient house**', 'ARV APIs for global-health programmes; formulation capacity added; IPO Dec-2016', '₹1,327 cr → ₹2,832 cr', '15–21%', 'EPS ₹1.4 → ₹4.8; CDMO ~₹384 cr (14%) by FY20'],
  ['**FY21–FY23: the boom**', 'ARV formulation and API surge (FY21), Covid-era demand, a very large one-off CDMO order (FY23); Richcore (Laurus Bio) bought; ImmunoACT stake', '₹4,814 cr → ₹6,041 cr', '26–32%', 'EPS ₹18.3 (FY21), ₹15.4, ₹14.7; ROE 45% → 21%'],
  ['**FY24: the bust**', 'The order ended; ARV formulation prices and destocking; new plants\' fixed costs', '₹5,041 cr (−17%)', '15.5%', 'EPS ₹3.0; ROE 4%; net debt up to ₹2,311 cr'],
  ['**FY25–FY27: CDMO rebuild**', 'Three patented APIs commercial; FDF capacity +20%; KRKA JV; capex re-accelerates', '₹5,554 cr → ₹6,813 cr; Q1FY27 ₹2,026 cr', '19–32%', 'EPS ₹6.6 → ₹16.5; Q1FY27 ₹6.8; ROE 18%'],
];
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Twenty-one years: an ARV specialist, one boom, one bust, and a founder who kept investing through both',
  blocks: [
    { p: 'Dr. Satyanarayana Chava founded Laurus in 2005 as a research-driven API maker and built it around anti-retrovirals, where low cost and backward integration win tenders. It listed in December 2016. The founder still runs the company as CEO, with his son Krishna Chaitanya Chava heading CDMO, his daughter Soumya Chava heading generics and commercial, and V. V. Ravi Kumar CFO since 2006 (AR FY26). The numbers fall into four eras.' },
    { exhibit: { type: 'table', title: 'The four eras of Laurus (FY15–FY27)', head: ['Era', 'What happened', 'Revenue', 'EBITDA margin', 'What it did to the numbers'], wide: [1, 4], rows: eraRows, source: 'Screener.in; company presentations (divisional revenue); earnings calls' } },
    { exhibit: { type: 'table', title: 'Corporate actions and events that changed the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.timeline.map(t => [t.date, t.event, t.impact]), source: 'AR FY26 (AOC-1, notes 18 and 32); company calls and presentations; CARE (Jul-2026); Reuters' } },
    { callout: '**Lesson from history:** the FY23 order shows how a single CDMO contract can add ~₹1,200 cr of revenue and disappear within a year. The CFO says FY23 was "the best year because of that execution of large purchase order" and that the team then "had not so great results" for seven quarters (24-Jul-2026). Management argues today\'s CDMO revenue is spread across many products with no concentration; it is far broader than in FY23, but it is not yet proven through a full cycle.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: outsourcing and China+1 favour Indian CDMOs; the ARV market is mature, donor-funded and facing long-acting injectables',
  blocks: [
    { p: `**Contract manufacturing is the growth engine.** Laurus cites a global small-molecule CDMO market of ~USD ${IN.cdmo.globalSmallMoleculeUsdBn2025} bn (2025) growing over ${IN.cdmo.globalCagrPct2025_34}% a year to 2034, and an Indian market of ~USD ${IN.cdmo.indiaUsdBn2025} bn growing over ${IN.cdmo.indiaCagrPct2025_34}% (Sep-2026 presentation). HDFC Securities expects the Indian contract research, development and manufacturing (CRDMO) market to reach ~USD ${IN.cdmo.indiaCrdmoUsdBn2029} bn by 2029 (${IN.cdmo.indiaCrdmoCagrPct2024_29}% a year), India's share of the global market to rise from ${IN.cdmo.indiaShareNowPct}% to ${IN.cdmo.indiaShare2029Pct}%, and manufacturing outsourcing by innovators to rise from ${IN.cdmo.outsourcingMfgPct2024}% (2024) to ${IN.cdmo.outsourcingMfgPct2029}% (2029). The drivers: price pressure on innovators (US drug-pricing laws), the China+1 strategy and the US BIOSECURE Act, more complex molecules, and new peptide capacity needs.` },
    { pair: [
      { type: 'column', title: 'Small-molecule CDMO: India is small but growing twice as fast', unit: 'Expected annual growth, 2025-34 (%)', x: ['Global (~USD85 bn)', 'India (~USD2 bn)'], series: [{ name: 'Growth', values: [IN.cdmo.globalCagrPct2025_34, IN.cdmo.indiaCagrPct2025_34], fmt: 'pct0' }], labels: 'all', source: 'Laurus Sep-2026 investor presentation (company-cited estimates; "more than" figures)' },
      { type: 'column', title: 'Innovators outsource more of their manufacturing', unit: 'Share of manufacturing outsourced (%)', x: ['2024', '2029E'], series: [{ name: 'Outsourced', values: [IN.cdmo.outsourcingMfgPct2024, IN.cdmo.outsourcingMfgPct2029], fmt: 'pct0' }], labels: 'all', source: 'HDFC Securities, 6-Jan-2026 (Frost & Sullivan)' },
    ] },
    { p: `**ARVs are a mature, tender market.** Laurus serves ${IN.arv.laurusShareOfPatients}. Its ARV revenue has been ₹2,500-2,800 cr for five years and management expects it to stay around ₹2,800 cr, with pricing "broadly constant" in FY26. The company describes a stable market funded by multilateral agencies, steady dolutegravir use and adoption hurdles for long-acting injectables. The risk is longer-term: Gilead licensed its twice-yearly injectable lenacapavir to six generic makers for 120 countries in Oct-2024, and Laurus is not one of them. **Costs:** the West Asia war raised solvent prices from late February 2026; Laurus reported "some impact" in Q4FY26 and "some pressure" in Q1FY27, without supply disruption.` },
    { exhibit: { type: 'table', title: 'Forces at 30-Sep-2026', head: ['Force', 'What it is', 'What it means for Laurus'], wide: [1, 2], rows: [
      ['Innovator outsourcing', 'More late-stage and commercial manufacturing outsourced to trusted partners', 'The core of the CDMO case: three commercial APIs, >125 projects, a new big-pharma client'],
      ['China+1 / BIOSECURE Act', 'Innovators dual-source away from Chinese CDMOs', 'Supportive over years; benefits accrue to Indian sites with scale and clean records'],
      ['Peptides and GLP-1', 'New demand for large-scale peptide capacity', 'Laurus is building a commercial peptide block; no disclosed contract'],
      ['ARV funding and long-acting injectables', 'Donor budgets; lenacapavir licences to six generic makers', 'Volumes steady near term; a structural risk to oral ARV demand later'],
      ['West Asia war', 'Solvent and freight costs up from late Feb-2026', 'Some margin pressure; offset so far by mix'],
    ], source: 'HDFC Securities (Jan-2026); Gilead (Oct-2024); Laurus calls (30-Apr and 24-Jul-2026)' } },
  ],
};

const tailwind = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach Laurus?', title: 'Tailwind test: Laurus captures outsourcing and China+1, partly peptides and fermentation, and none of the ARV innovation',
  blocks: [
    { p: 'A sector tailwind helps a shareholder only if the company captures it. We score each driver on whether Laurus is a main beneficiary, a partial one, or a bystander.' },
    { verdicts: [
      ['Innovator outsourcing of small molecules', 'Yes', 'CDMO +38% in FY26 and +69% in Q1FY27; 55% commercial supply; capex raised to ₹2,000 cr on customer demand', 'The clearest win, visible in the numbers'],
      ['China+1 / BIOSECURE', 'Yes', 'Multi-site Indian capacity with a clean USFDA record and fungible standard plant designs', 'Supports the pipeline over 3-5 years'],
      ['Peptides and GLP-1', 'Partly', 'Commercial peptide block being validated; GLP-1 and non-GLP-1 programmes; no disclosed contract', 'Optionality the street is starting to price'],
      ['Precision fermentation', 'Partly', 'Laurus Bio ~₹200 cr revenue; 400 KL plant by Dec-2026; four 45,000-litre fermenters fully used', 'Small; 18-24 months to judge'],
      ['Cell and gene therapy, ADCs', 'Partly', 'CAR-T through 35% associate ImmunoACT; ADC assets pre-clinical; gene therapy/ADC plant qualifying by 2027', 'Early-stage bets; returns 4-5 years away'],
      ['ARV demand', 'Partly', 'Volumes steady at ~₹2,800 cr; one-third of global patients', 'Cash engine, not growth'],
      ['Long-acting HIV injectables', 'No', 'Not a lenacapavir licensee', 'A risk, not a tailwind'],
      ['Weak rupee', 'Partly', '~67% exports but sizeable imports and rupee sales; CFO cited only ~2% constant-currency effect', 'Small and unclear'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: 2 of 8 captured directly, 5 partly, 1 missed', source: 'Company calls and presentations; Gilead; GAM Research' },
    { callout: "**Our view:** the tailwinds that matter most for the next three years (outsourcing and China+1) reach Laurus directly, and the numbers show it. The ones that excite the market most (peptides, biologics) are real capabilities but not yet revenue, and the ARV franchise that funds it all faces a slow structural threat from long-acting injectables." },
  ],
};

module.exports = { business, history, industry, tailwind };
