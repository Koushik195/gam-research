// Craftsman Automation report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./CRAFTSMAN.ctx');
const { C, D, SA, n0, n1, yr } = X;
const I = D.industry, rup = s => String(s).replace(/Rs ?/g, '₹');
const y26 = yr('FY26'), share = k => Math.round(y26[k] / y26.consRev * 100);

const business = {
  id: 'business', nav: 'What Craftsman does', kicker: 'The business', title: 'A contract manufacturer of machined metal parts: engine blocks, aluminium castings and storage systems',
  blocks: [
    { p: rup(`Craftsman Automation was founded in Coimbatore in 1986 by Srinivasan Ravi, who still runs it. It makes parts to its customers' drawings ("build to print"): it casts, machines, treats and assembles, but does not own the end product. It reports three segments. **Powertrain** (${share('ptRev')}% of FY26 revenue) machines cylinder blocks and heads, camshafts, transmission parts, bearing caps and turbocharger parts for truck, tractor, off-highway and stationary-engine makers, and since Oct-2024 casts large-engine parts in Germany (Craftsman Fronberg Guss). **Aluminium products** (${share('alRev')}%) die-casts and machines engine, transmission and structural parts, EV battery housings and alloy wheels for car and two-wheeler makers, through Craftsman's own plants, DR Axion India and Sunbeam Lightweighting. **Industrial & engineering** (${share('ieRev')}%) makes storage solutions (racking, shelving, vertical and automated storage), material-handling equipment, gears and gearboxes, special-purpose machines and moulds, and does contract manufacturing.`) },
    { exhibit: { type: 'table', title: 'The three segments (FY26)', head: ['Segment', 'What it makes', 'Revenue (₹ cr)', 'EBIT (₹ cr)', 'EBIT margin', 'Customers / markets'], wide: [1, 5], rows: [
      ['**Powertrain**', 'Cylinder blocks and heads, camshafts, transmission parts, bearing caps, turbocharger parts; large-engine castings (Germany, Kothavadi)', n0(y26.ptRev), n0(y26.ptEbit), `${n1(y26.ptEbit / y26.ptRev * 100)}%`, 'CV, tractor, off-highway, gensets; Germany 16% of segment revenue'],
      ['**Aluminium products**', 'HPDC/LPDC/gravity/sand castings, machined: crankcases, housings, cradles, manifolds, battery housings; alloy wheels', n0(y26.alRev), n0(y26.alEbit), `${n1(y26.alEbit / y26.alRev * 100)}%`, '4W ~54%, 2W ~41%, others ~5% of FY26 segment revenue ("4-wheeler heavy, closely followed by 2-wheeler", CMD)'],
      ['**Industrial & engineering**', 'Storage solutions (64%), material handling, gears and gearboxes, SPMs, toolroom, contract manufacturing', n0(y26.ieRev), n0(y26.ieEbit), `${n1(y26.ieEbit / y26.ieRev * 100)}%`, 'Warehousing, factories, power transmission'],
    ], source: 'AR FY26 consolidated segment note; Q4FY26 presentation slides 10-13 (revenue mix pies, approximate)' } },
    { pair: [
      { type: 'line', title: 'Aluminium volumes: 15,885 t (FY22) to 94,904 t (FY26)', unit: 'Aluminium sales volume (tonnes)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Tonnes', values: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => yr(f).alTonnes), fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation slide 12' },
      { type: 'hbar', title: 'Segment EBIT per ₹100 of segment assets (FY26): powertrain earns 4x industrial', unit: 'Segment EBIT ÷ segment assets (%)', x: ['Powertrain', 'Aluminium', 'Industrial & eng.'], series: [{ name: 'FY25', values: [n1(yr('FY25').ptEbit / yr('FY25').ptAssets * 100), n1(yr('FY25').alEbit / yr('FY25').alAssets * 100), n1(yr('FY25').ieEbit / yr('FY25').ieAssets * 100)].map(Number), fmt: 'pct' }, { name: 'FY26', values: [n1(y26.ptEbit / y26.ptAssets * 100), n1(y26.alEbit / y26.alAssets * 100), n1(y26.ieEbit / y26.ieAssets * 100)].map(Number), fmt: 'pct' }], labels: 'all', source: 'AR FY26 segment note (segment result and segment assets)' },
    ] },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Plants', rup(C.business.plants)],
      ['Customers', rup(C.business.customers)],
      ['Exports', rup(C.business.exports)],
      ['People', rup(C.business.employees)],
    ], source: 'AR FY26; Q1FY27 presentation' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a Coimbatore machine shop to a ₹8,000 cr group: three acquisitions and two QIPs in three years',
  blocks: [
    { p: 'For its first 30 years Craftsman was a powertrain machining company (blocks and heads for trucks and tractors) with a storage and engineering arm. It started aluminium die-casting in the 2000s and listed in Mar-2021. Since then it has bought its way into scale in aluminium: 76% of DR Axion India in Feb-2023 (a maker of critical aluminium castings for car makers), the rest in Jun-2024; Sunbeam Lightweighting (a loss-making die-caster with plants in the NCR) in Oct-2024; and the assets of a German iron foundry for large-engine castings in Oct-2024. Two QIPs (₹1,200 cr in Jun-2024 at ₹4,400; ₹2,000 cr in Jun-2026 at ₹8,700) paid for part of it. The founder sold 2% in Jun-2026, five days after the second QIP.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Impact on the numbers'], wide: [1, 2], rows: [
      ...C.corporateActions.map(c => [X.shortDate(c.date), rup(c.what), {
        '2021-03-25': 'Net debt fell in FY21 (fresh issue ₹146 cr net, ₹416 cr of debt repaid).',
        '2023-02-01': 'Aluminium revenue +112% in FY23 and +130% in FY24; ~₹350 cr cash outflow in FY23; 24% minority until Jun-2024.',
        '2024-06-21': '+12.9% shares; FY25 EPS fell 43% (also Sunbeam); net worth +₹1,200 cr.',
        '2024-06-29': 'Minorities gone from Q2FY25; ₹250 cr cash.',
        '2024-07-22': 'Adds a large-engine casting base; Germany ~16-19% of powertrain revenue.',
        '2024-10-09': 'FY25 revenue +28%, but Sunbeam lost money (₹32 cr pre-tax in H2FY25); FY25 PAT −36%.',
        '2025-12-19': '₹146 cr for ~50 acres of land: part of FY26\'s ₹134 cr of "other investing".',
        '2026-06-18': '+9.6% shares; net debt cut to ~₹1,430 cr pro forma (our model includes it).',
        '2026-06-23': 'No effect on the company; promoter holding 42.4%.',
      }[c.date] || '–']),
    ], source: 'Annual reports FY22-FY26; presentations; exchange filings as cited in company.json; Screener.in' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Outsourcing, aluminium lightweighting and an industrial upcycle help; labour and capex costs are the squeeze',
  blocks: [
    { p: rup(I.demand) },
    { bullets: [
      `**Aluminium.** ${rup(I.aluminium)}`,
      `**Outsourcing.** ${rup(I.outsourcing)}`,
      `**Costs.** ${rup(I.costs)}`,
      '**Electrification.** Most of Craftsman\'s powertrain revenue depends on diesel engines (trucks, tractors, gensets). EVs need no cylinder block or head; Craftsman\'s EV exposure is aluminium (battery housings, cooling trays, motor housings) and is small. Trucks, tractors and gensets will electrify much later than cars, which buys time.',
    ] },
    { callout: '**Why it matters:** Craftsman sells capacity and know-how, not products. Its growth comes from customers outsourcing more and building new plants nearby, so it must invest ahead of orders. That makes volumes and margins depend on utilisation: ~70% in powertrain, >80% in aluminium, ~10% on the new large-engine lines (management, Jul-2026).' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the India-manufacturing tailwind reach Craftsman? Yes in revenue; returns are the question',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach Craftsman?', 'Catch'], wide: [1, 3], rows: [
      ['Aluminium lightweighting in cars and 2Ws', 'Aluminium tonnes 6x in four years; Q1FY27 aluminium revenue +38%', 'Yes: 59% of revenue', 'Lowest-margin segment (10% EBIT); needs constant capex; metal pass-through lags'],
      ['Data-centre gensets / large engines', 'Orders from 4-5 of 6 global customers for US$100 mn a year by FY30', 'From FY28 (30% of run-rate), FY29 (50%)', 'Start-up costs and 10% utilisation now; customer concentration; casting approval takes another year'],
      ['India capex cycle (warehousing, factories)', 'Industrial & engineering revenue +53% in Q1FY27; EBIT margin 9%', 'Yes, since FY26', 'Smallest segment (14%); EBIT margin was 2-4% in FY25-26'],
      ['Trucks and tractors', 'Tractors better, trucks "muted" (May-2026); powertrain utilisation ~70%', 'Partly: powertrain +20% in FY26, +26% in Q1FY27', 'Cyclical; diesel-engine exposure is long-term EV risk'],
    ], source: 'Company presentations and calls (May and Jul-2026); GAM Research' } },
    { callout: '**Verdict:** the tailwinds reach Craftsman\'s revenue, which is why it has grown ~39% a year since FY21. They have reached its returns much less: the fastest-growing segment earns the lowest margin, and every leg of growth (aluminium plants, large-engine foundry, new campuses) has required capital first and profit later.' },
  ],
};

module.exports = { business, history, industry, tailwind };
