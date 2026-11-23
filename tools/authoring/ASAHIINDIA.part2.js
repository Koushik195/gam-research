// Asahi India Glass report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./ASAHIINDIA.ctx');
const { C, D, SA, SQ, n0, n1, pc, A26, q1Est } = X;
const I = D.industry, AU = I.autos, FL = I.float, PR = C.profile, Q = C.q1fy27, SH = C.shares;
const m = (e, r) => n1(e / r * 100) + '%';

const business = {
  id: 'business', nav: 'What AIS does', kicker: 'The business', title: 'Two glass businesses under one roof: car glass for every Indian car maker, and float glass for buildings and for itself',
  blocks: [
    { p: `Asahi India Glass (AIS) began in 1987 as a joint venture of the Labroo family, Asahi Glass of Japan (now AGC Inc., still the largest shareholder at 21.2%) and Maruti Udyog (now Maruti Suzuki, 10.6%). **Automotive glass** (gross segment revenue ₹${n0(A26.auto)} cr in FY26) makes laminated windshields, tempered side and back glass, sunroofs and encapsulated glass for cars, trucks, buses, tractors, railways and metros, and glass for refrigerators and washing machines; it holds ~${PR.marketShare.pvGlassPct}% of Indian passenger-vehicle glass. **Float glass** (₹${n0(A26.float)} cr, of which ₹${n0(C.segmentsFY26.float.internal)} cr sold to the auto business) runs three float lines (Roorkee, Taloja and, since FY25, Soniyana in Rajasthan; 2,150 tonnes a day) and coats and processes glass for buildings (~${PR.marketShare.architecturalPct}% of architectural glass, ~${PR.marketShare.valueAddedArchPct}% of value-added architectural glass). A **consumer** arm (AIS Windows, Glasxperts, Windshield Experts) sells windows and replacement car glass directly. In all: 15 manufacturing facilities and 11 sub-assembly units-cum-warehouses; auto glass at Bawal, Chennai, Patan, Roorkee and Pune, plus an on-site unit inside Maruti's Kharkhoda campus.` },
    { exhibit: { type: 'table', title: 'The parts of AIS, FY26 (₹ crore; gross segment revenue incl. sales between segments)', head: ['Segment', 'Revenue', 'EBITDA', 'Margin', 'EBIT', 'Q1FY27 growth', 'What it sells'], wide: [6], rows: [
      ['**Automotive glass**', n0(A26.auto), n0(A26.autoEbitda), m(A26.autoEbitda, A26.auto), n0(A26.autoEbit), pc((Q.autoGross / Q.autoGrossQ1FY26 - 1) * 100), 'Windshields, side and back lites, sunroofs, encapsulated glass; OEMs and replacement; white-goods glass'],
      ['**Float glass**', n0(A26.float), n0(A26.floatEbitda), m(A26.floatEbitda, A26.float), n0(A26.floatEbit), pc((Q.floatGross / Q.floatGrossQ1FY26 - 1) * 100), 'Clear, tinted, coated, reflective and processed glass for buildings; raw glass for the auto business'],
      ['Consumer glass & unallocated', n0(A26.other), n0(A26.otherEbitda), m(A26.otherEbitda, A26.other), '–', '+7%', 'AIS Windows (uPVC/aluminium windows), Glasxperts, Windshield Experts (151 service centres)'],
      ['Inter-segment eliminations', n0(A26.elim), '0', '', '', '', 'Float glass sold to auto; consumer-glass distribution'],
      { hl: true, cells: ['**Group (Screener basis)**', `**${n0(A26.sales)}**`, `**${n0(A26.ebitda)}**`, `**${m(A26.ebitda, A26.sales)}**`, '', '+15%', 'EBITDA excl. other income ₹48.9 cr and the ₹11.7 cr exceptional charge'] },
    ], source: 'AR FY26 consolidated note 36 (segment result + segment depreciation = EBITDA); Q1FY27 results; consumer & unallocated is our balancing line to Screener' } },
    { pair: [
      { type: 'stacked', title: 'Auto glass more than doubled since FY21; float swung with prices', unit: 'Gross segment revenue (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'Automotive glass', values: SA.map(a => Math.round(a.auto)), fmt: 'num' }, { name: 'Float glass', values: SA.map(a => Math.round(a.float)), fmt: 'num' }], minLabel: 600, source: 'AR FY22, FY24, FY26 segment notes' },
      { type: 'line', title: 'Segment EBITDA margins: float 34% → 18% → 21%; auto 12-18%', unit: 'EBITDA ÷ gross segment revenue (%)', x: SA.map(a => a.fy), series: [{ name: 'Automotive glass', values: SA.map(a => Math.round(a.autoEbitda / a.auto * 1000) / 10), fmt: 'pct' }, { name: 'Float glass', values: SA.map(a => Math.round(a.floatEbitda / a.float * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 40, source: 'AR segment notes (segment result + segment depreciation)' },
    ] },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Forty years from a single-customer windshield plant to an integrated glass maker, funded three times by shareholders',
  blocks: [
    { p: `AIS started as a single-plant, single-product, single-customer business: windshields for Maruti. It added tempered glass and new car makers, entered float glass by merging Floatglass India (Taloja) in 2003, also runs a float line at Roorkee (cold-repaired in FY25-26) and added a third at Soniyana, Rajasthan. Shareholders have funded it three times: ₹1.87 cr at start-up (1987), a ₹250 cr rights issue (2013) and a ₹1,000 cr QIP in Sep-2025 (1.18 crore shares at ₹${n1(SH.qipPrice)}). The share count rose from 24.31 cr to 25.49 cr, so FY26 EPS fell 9% while profit fell 6%.` },
    { exhibit: { type: 'table', title: 'Milestones and corporate actions', head: ['When', 'What'], wide: [1], rows: C.history, source: C.historySrc } },
    { exhibit: { type: 'table', title: 'Recent actions and what they did to the numbers', head: ['When', 'Action', 'Impact'], wide: [1, 2], rows: [
      ['FY25', 'Soniyana float line commissioned (₹993 cr of float capex in FY25)', 'Float depreciation ₹44 cr → ₹126 cr (FY26); raw glass for auto now made in-house; inter-segment sales ₹483 cr → ₹908 cr'],
      ['Jul-2025', 'Four downstream subsidiaries merged into AIS Consumer Glass Solutions', '₹4.5 cr merger cost (exceptional); AIS now owns 98.5%'],
      ['Sep-2025', 'QIP: 1.18 crore shares at ₹844.79 (₹1,000 cr)', 'Debt repaid; debt/equity 0.96x → 0.52x; +4.9% shares; promoters 54.1% → 51.6%'],
      ['FY26', '₹329 cr state capital grant recognised (deferred income)', '~₹18 cr a year released into revenue; plus ₹35 cr of GST-linked state incentives in FY26 revenue'],
      ['Q3FY26', 'New labour codes: ₹7.2 cr exceptional charge', 'FY26 PBT −₹11.7 cr with the merger cost'],
      ['Jan-2026', 'Up to ₹2,000 cr approved for greenfield float, coatings, processing', 'Capex ₹850-1,000 cr a year in our FY27-29E; no revenue from it before FY30 in our model'],
    ], source: 'AR FY26 notes 12, 34, 46, 47, 53 and board report; results filings' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: `Cars: record volumes (+${AU.q1fy27PvProductionGrowthPct}% PV output in Q1FY27). Float glass: a commodity that lives on trade protection`,
  blocks: [
    { p: `India sold a record ${AU.fy26DomesticPvMn} mn passenger vehicles in FY26 (+${AU.fy26DomesticPvGrowthPct}%) and exported ${AU.fy26PvExportsMn} mn (+${AU.fy26PvExportsGrowthPct}%); PV production was ~${AU.fy26PvProductionMn} mn (+${AU.fy26PvProductionGrowthPct}%) and ${AU.q1fy27PvProductionMn} mn in Q1FY27 (+${AU.q1fy27PvProductionGrowthPct}%), helped by the Sep-2025 GST cut. Each car also carries more glass: SUVs, panoramic roofs, laminated side glass, acoustic and solar-control glass, and windshields ready for head-up displays and ADAS cameras. Float glass is different: India's clear-glass prices are set by imports, mostly from Malaysia (${FL.malaysiaShareOfImportsPct}% of imports, ${n0(FL.malaysiaImportTonnes / 1000)},000 t), China and Thailand. Anti-dumping duties on Malaysian glass were recommended for five more years after a 2026 review, and on 18-Aug-2026 the government added a minimum import price of ₹${n0(FL.mipRsPerTonne)} per tonne on clear float glass of 4-12 mm, for one year. The chairman calls this "temporary support" against "distorted competition" (AR FY26).` },
    { exhibit: { type: 'table', title: 'What drives AIS beyond vehicle volumes', head: ['Driver', 'Evidence (to Sep-2026)', 'Relevance for AIS'], wide: [1, 2], rows: [
      ['Glass content per car', 'SUVs an increasingly dominant share of PV sales; sunroofs, laminated sidelites, HUD/ADAS windshields (AR FY26)', 'Revenue per car rises faster than volumes; needs new presses, coaters and lamination lines'],
      ['Maruti\'s volumes and plants', 'Kharkhoda plant with an AIS on-site assembly unit; AIS sales to Maruti ₹873 cr (FY26), ₹301 cr in Q1FY27', 'The biggest customer is also a shareholder: volume certainty, price discipline'],
      ['Float-glass import prices', 'Malaysia 85% of clear-glass imports; MIP ₹34,000/t from 18-Aug-2026 for one year', 'Sets AIS\'s float realisations and margins (18-34% EBITDA in FY21-26)'],
      ['Construction and green buildings', 'Urban construction; IGBC-registered projects 16.2 bn sq ft', 'Demand for coated, Low-E and insulated glass; AIS ~26% of value-added architectural glass'],
      ['Energy and soda ash', 'A float furnace runs 24x7 on gas; AR FY26 lists raw-material and energy volatility as a top risk', 'FY23 auto margin fell to 12% on cost spikes'],
    ], source: 'AR FY26 (pp11, 26-28, 38); DGFT notification; results filings' } },
    { callout: '**Our read:** the car-glass market grows with car output plus 4-5% a year of content, and AIS already has ~80% of it: its auto growth will track the industry, no more. The float market is cyclical and import-driven; today\'s margins are flattered by Soniyana running full and by trade protection that has an end date.' },
  ],
};

const autoG = (a, z) => (a / z - 1) * 100;
const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach the company?', title: 'Tailwind test: in cars yes, a few points above volumes; in float glass the tailwind is policy',
  blocks: [
    { exhibit: { type: 'table', title: 'AIS growth vs its markets', head: ['Period', 'Market growth', 'AIS growth', 'Outperformance'], rows: [
      ['FY26, cars', `Domestic PV sales +${AU.fy26DomesticPvGrowthPct}%; PV output +${AU.fy26PvProductionGrowthPct}%`, `Auto gross revenue ${pc(autoG(SA[5].auto, SA[4].auto))} (external +12.7%)`, '~+3-4 points'],
      ['Q1FY27, cars', `PV output +${AU.q1fy27PvProductionGrowthPct}%`, `Auto gross revenue ${pc(autoG(Q.autoGross, Q.autoGrossQ1FY26))}`, '~+5 points'],
      ['FY21-26, cars', 'Recovery from Covid plus GST-cut boost', `Auto gross revenue +${n1((Math.pow(SA[5].auto / SA[0].auto, 1 / 5) - 1) * 100)}% a year`, 'Content and share already near 80%'],
      ['FY26, float', 'Clear-glass import prices low; anti-dumping duties in force', `Float gross revenue ${pc(autoG(SA[5].float, SA[4].float))} (Soniyana; incl. internal sales)`, 'Volume from new capacity, not price'],
      ['Q1FY27, float', 'MIP not yet in force (from 18-Aug-2026)', `Float gross revenue ${pc(autoG(Q.floatGross, Q.floatGrossQ1FY26))}; EBIT ₹${n0(Q.floatEbit)} cr vs ₹${n0(Q.floatEbitQ1FY26)} cr`, 'Capacity plus better realisations'],
    ], source: 'AR FY26; SIAM data as quoted by Uno Minda (Q4FY26 and Q1FY27 calls); AIS results filings' } },
    { bullets: [
      '**Cars: the tailwind reaches AIS, with a few points of content on top.** Auto revenue grew 3-5 points faster than car output in FY26 and Q1FY27, consistent with more glass per car. With ~80% share there is no share left to gain.',
      `**But the margin does not follow.** Auto segment EBITDA margin was ${n1(SA[4].autoEbitda / SA[4].auto * 100)}% in FY25 and ${n1(SA[5].autoEbitda / SA[5].auto * 100)}% in FY26 despite record volumes; Q1FY27's ~${n1(q1Est.autoM)}% (our estimate) came with cheaper in-house float glass.`,
      '**Float: the tailwind is policy and capacity, not demand.** Float growth in FY26-Q1FY27 came from the new Soniyana line; the minimum import price helps prices from Aug-2026 for a year. Neither is a durable advantage.',
    ] },
  ],
};

module.exports = { business, history, industry, tailwind };
