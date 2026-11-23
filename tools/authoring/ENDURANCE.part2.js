// Endurance Technologies report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./ENDURANCE.ctx');
const { C, D, SA, n0, n1, A26 } = X;
const I = D.industry, IN = I.india, EU = I.europe, MX = C.profile.mixFY26, MS = C.profile.marketShareFY26;
const share = (x, t) => Math.round(x / t * 100) + '%';

const business = {
  id: 'business', nav: 'What Endurance does', kicker: 'The business', title: 'Two businesses under one roof: Indian two-wheeler parts (72%) and European car castings (27%)',
  blocks: [
    { p: `Endurance Technologies is an Aurangabad-born (now Chhatrapati Sambhajinagar) tier-1 supplier controlled by the Jain family (75%) and run by Managing Director Anurang Jain. It has 34 plants. **In India** (the listed company, "standalone") it makes aluminium die-castings and alloy wheels, suspension (front forks, shock absorbers), braking systems (disc brakes, ABS, 3W and 4W brakes), transmission parts (clutches, driveshafts) and, since Jun-2026, electric-scooter battery packs; ~70% of India income comes from motorcycles. It holds ${MS.frontForks}% of India's two-wheeler front-fork market, ${MS.shockAbsorbers}% of shock absorbers, ${MS.brakeAssemblies}% of brake assemblies and ${MS.brakeDiscs}% of brake discs (FY26). **Maxwell** (100%) designs battery-management electronics. **In Europe** Endurance Overseas (Italy, and Germany through Stöferle, 68% owned after Q1FY27) makes machined aluminium castings, mostly for VW group, Mercedes and Stellantis, plus 2W brakes and clutches. By vehicle, FY26 income was ${MX.motorcycle}% motorcycles, ${MX.fourWheeler}% four-wheelers (mostly Europe), ${MX.scooter}% scooters and ${MX.threeWheeler}% three-wheelers; by product, ${MX.dieCasting}% die-casting, ${MX.suspension}% suspension, ${MX.discBrake}% brakes and ${MX.alloyWheel}% alloy wheels.` },
    { exhibit: { type: 'table', title: 'The parts of the group, FY26 (₹ crore, company basis: total income and EBITDA incl. other income)', head: ['Entity', 'Total income', 'Share', 'EBITDA', 'Margin', 'Q1FY27 growth', 'What it sells'], wide: [6], rows: [
      ['**India (ETL standalone)**', n0(A26.india), share(A26.india, A26.totalIncome), n0(A26.indiaEbitda), n1(A26.indiaEbitda / A26.india * 100) + '%', '+36%', 'Castings and alloy wheels, suspension, brakes and ABS, clutches and driveshafts, aftermarket, battery packs; Bajaj, Honda, Royal Enfield, Hero, TVS, Yamaha, Tata, Mahindra'],
      ['**Maxwell**', n0(A26.maxwell), share(A26.maxwell, A26.totalIncome), n0(A26.maxwellEbitda), n1(A26.maxwellEbitda / A26.maxwell * 100) + '%', '+85%', 'Battery-management systems, motor controllers, telematics, DC-DC converters'],
      ['**Europe (Endurance Overseas)**', n0(A26.europe), share(A26.europe, A26.totalIncome), n0(A26.europeEbitda), n1(A26.europeEbitda / A26.europe * 100) + '%', '+14% (₹); +1% (€)', 'Machined aluminium castings (VW-Audi-Porsche, Mercedes, Stellantis), plastic injection parts, 2W brakes (Frenotecnica) and clutches (Adler)'],
      ['Consolidation adjustments', n0(A26.adj), '', n0(A26.adjEbitda), '', '', 'Sales between group companies'],
      { hl: true, cells: ['**Group**', `**${n0(A26.totalIncome)}**`, '100%', `**${n0(A26.ebitdaCo)}**`, `**${n1(A26.ebitdaCo / A26.totalIncome * 100)}%**`, '+30%', `Revenue ₹14,596 cr + other income ₹124 cr; EBITDA excl. other income ₹1,966 cr (13.5%)`] },
    ], source: 'Q1FY27 presentation p22 (summary financials); Q4FY26 presentation; AR FY26' } },
    { pair: [
      { type: 'stacked', title: 'Europe up 70% in two years, mostly Stöferle', unit: 'Total income by entity (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'India', values: SA.map(a => a.india), fmt: 'num' }, { name: 'Maxwell', values: SA.map(a => a.maxwell), fmt: 'num' }, { name: 'Europe', values: SA.map(a => a.europe), fmt: 'num' }], minLabel: 500, source: 'Results presentations FY23-FY26 (summary financials)' },
      { type: 'column', title: 'EV and plug-in hybrid sales: ₹932 cr in Q1FY27, +21%', unit: 'Q1 sales for electric and plug-in hybrid vehicles (₹ crore)', x: ['India Q1FY26', 'India Q1FY27', 'Europe Q1FY26', 'Europe Q1FY27'], series: [{ name: 'EV/PHEV sales', values: [69, 130, 701, 802], fmt: 'num' }], labels: 'all', source: 'Q1FY27 call (14-Aug-2026)' },
    ] },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Forty years from two casting machines: licences first, then acquisitions in Italy and Germany',
  blocks: [
    { p: 'Endurance began in 1985 with two aluminium die-casting machines in Aurangabad and grew by adding products the same customer bought: suspension, transmission and brakes, each started with a European technology partner (Paioli, Adler, Grimeca, later KTM for premium forks). From 2006 it bought small European casting and brake makers, which became Endurance Overseas, and in April 2025 its largest deal: 60% of Germany\'s Stöferle for EUR37.7 mn, with the rest bought 8% a year to 2030 at a price linked to Stöferle\'s EBITDA. The group listed in October 2016. The share count has not changed since FY17, so EPS growth equals profit growth.' },
    { exhibit: { type: 'table', title: 'Milestones and corporate actions', head: ['When', 'What'], wide: [1], rows: C.history, source: C.historySrc } },
    { exhibit: { type: 'table', title: 'Recent actions and what they did to the numbers', head: ['When', 'Action', 'Impact'], wide: [1, 2], rows: [
      ['Apr-2025', 'Stöferle (Germany): 60% for EUR37.74 mn (₹350 cr cash) + ₹246 cr deferred payable for the other 40%', 'FY26: +EUR82 mn revenue, EUR17.9 mn EBITDA, EUR8 mn profit; goodwill ₹349 cr. Consolidated at 100% (no minorities)'],
      ['May-2025', 'Rest of Maxwell bought (now 100%)', 'Maxwell losses now fully in profit (₹10 cr loss in FY26; profit from Q1FY27)'],
      ['Q3FY26', 'New labour codes: ₹21 cr exceptional charge', 'FY26 PBT −₹21 cr; higher wage cost from FY27'],
      ['FY26', 'Maharashtra PSI entitlement raised from ₹600 cr to ₹858 cr', '₹121 cr of incentives in FY26 revenue; ~7 more years of state-GST refunds'],
      ['Q1FY27', 'Stöferle stake to 68% (EUR6.24 mn); Veicoli Srl (Italy) sold', 'Settles part of the deferred liability; Veicoli immaterial'],
      ['Q1FY27', 'Europe: ICE-programme assets written off over ~18 months', 'Europe depreciation EUR11.6 mn vs EUR8.5 mn; Europe PAT −22% (₹)'],
    ], source: 'AR FY26 note 26b and KAM; Q4FY26 and Q1FY27 presentations and calls' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: `India: record two-wheeler sales (+${IN.q1TwGrowthPct}% in Q1FY27). Europe: registrations up, production down`,
  blocks: [
    { p: `India sold ${IN.fy26TwMn} mn two-wheelers in FY26 (+${IN.fy26TwGrowthPct}%: motorcycles +${IN.fy26MotorcycleGrowthPct}%, scooters +${IN.fy26ScooterGrowthPct}%), ${IN.fy26ThreeWMn} mn three-wheelers (+${IN.fy26ThreeWGrowthPct}%) and ${IN.fy26FourWMn} mn four-wheelers (+${IN.fy26FourWGrowthPct}%). The September 2025 GST cut on small two-wheelers lifted the second half, and Q1FY27 was a record: ${IN.q1TwMn} mn two-wheelers (+${IN.q1TwGrowthPct}%; scooters +${IN.q1ScooterGrowthPct}%), three-wheelers +${IN.q1ThreeWGrowthPct}%, four-wheelers +${IN.q1FourWGrowthPct}%. From Q3FY27 the comparison base includes the GST boost. In Europe, new-car registrations rose ${EU.fy26GrowthPct}% in FY26 and ${EU.q1GrowthPct}% in Q1FY27, but only ~${EU.q1GrowthExChinesePct}% excluding Chinese brands, and production fell ${Math.abs(EU.q1ProductionPct)}%; battery-electric cars were ${EU.q1BevSharePct}% of registrations and hybrids of all kinds ~46%.` },
    { exhibit: { type: 'table', title: 'What drives Endurance beyond vehicle volumes', head: ['Driver', 'Evidence (to Aug-2026)', 'Relevance for Endurance'], wide: [1, 2], rows: [
      ['ABS on smaller bikes', 'Draft rule (Jun-2025) to extend ABS below 125cc; not final by Sep-2026', 'ABS output 0.28 mn in FY26, "100-150%" growth expected in FY27; capacity 0.64 mn + 0.9 mn (SOP Sep/Oct-2026)'],
      ['Premiumisation', 'Mono-shocks replacing twin shocks on 150cc+ bikes; inverted forks spreading', 'Inverted forks 60k → 100k a month by end-FY27; disc-brake capacity to 9 mn assemblies'],
      ['Electric 2W/3W', 'All Endurance products except clutches (3.5% of India sales) also go into EVs', 'EV sales in India ₹130 cr in Q1FY27 (+88%); EV orders ₹1,806 cr a year incl. Bajaj'],
      ['China+1 sourcing of castings', 'Global OEMs placing machined castings in India', 'Shendra: US EV maker, JLR, Valeo, Yazaki (₹513 cr a year at peak)'],
      ['Commodities and energy', 'Aluminium and gas at highs (West Asia conflict); Italian power ~€124/MWh (+22%)', 'Pass-through with a one-quarter lag in India; quarterly indexation in Europe'],
      ['Chinese OEMs in Europe', 'BYD, Chery, Leapmotor sales up several-fold in Q1FY27, with imported powertrains', 'Fewer European RFQs; ICE share of Endurance Europe ~30% falling to 25% by FY28'],
    ], source: 'Q4FY26 and Q1FY27 presentations and calls (SIAM and European associations as quoted)' } },
    { callout: '**Our read:** the Indian cycle was unusually strong in FY26-Q1FY27 and turns into a tougher base from H2FY27; Endurance\'s growth beyond that depends on content (ABS, forks, castings, battery packs). Europe is a no-growth market for its customers; Endurance\'s growth there comes from winning share from weaker suppliers and from acquisitions.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach the company?', title: 'Tailwind test: in India yes, comfortably; in Europe no',
  blocks: [
    { exhibit: { type: 'table', title: 'Endurance growth vs its markets', head: ['Period', 'Market growth', 'Endurance growth', 'Outperformance'], rows: [
      ['FY26, India', `2W sales +${IN.fy26TwGrowthPct}%`, 'Standalone income +20%', '~7 points'],
      ['Q1FY27, India', `2W +${IN.q1TwGrowthPct}%; all vehicles +${IN.q1TotalGrowthPct}%`, 'Standalone +35.9% (~23.5-24% excl. metal pass-through)', '~0-12 points'],
      ['FY26, by customer', 'Bajaj +11.6%; Honda +7.9%; Royal Enfield +23.9%; TVS +21.2%', 'Sales to them +16.1%; +16.9%; +32.7%; +29.1%', '+5 to +9 points'],
      ['FY26, Europe', `Registrations +${EU.fy26GrowthPct}%`, '+28.9% in euros; +2% excl. Stöferle', '~−1 point organically'],
      ['Q1FY27, Europe', `Registrations +${EU.q1GrowthPct}%; production ${EU.q1ProductionPct}%`, '+1.1% in euros', 'Flat against production'],
    ], source: 'Q4FY26 call (15-May-2026); Q1FY27 presentation and call (13/14-Aug-2026)' } },
    { bullets: [
      '**India: the tailwind reaches it, and it adds content on top.** Sales to each big customer grew 5-9 points faster than that customer\'s volumes in FY26.',
      '**But part of Q1\'s growth was metal.** Of the 35.9% standalone growth, ~12.9 points was higher raw-material cost passed through at no margin.',
      '**Europe: no tailwind.** Organic growth is near zero; Stöferle made FY26 look strong. The order book is being rebuilt around hybrids and EVs (86% of orders won in five years), but the run-off of combustion-engine work comes first.',
    ] },
  ],
};

module.exports = { business, history, industry, tailwind };
