// Bosch Ltd report, part 2: what the company does, history and corporate actions, industry (production, regulation,
// GST 2.0, electrification) and the tailwind test.
const X = require('./BOSCHLTD.ctx');
const { C, D, SG, A26, R, n0, n1, pc, rup, bld } = X;
const I = D.industry, PR = I.production;
const share = (x, t) => n1(x / t * 100) + '%';

const business = {
  id: 'business', nav: 'What Bosch does', kicker: 'The business', title: 'Robert Bosch\'s Indian flagship: engine management, aftermarket and power tools, and now braking and safety',
  blocks: [
    { p: 'Bosch Ltd (formerly MICO) is 70.54% owned by Robert Bosch GmbH and is the listed home of the group\'s mobility business in India. It reports three segments. **Automotive Products** (89% of FY26 revenue) combines three businesses whose revenue it does not split: **Power Solutions** (diesel and gasoline fuel injection, engine management and sensors for cars, trucks, tractors and off-highway machines), **2-Wheeler & Powersports** (engine management, sensors and ABS for motorcycles and scooters) and **Mobility Aftermarket** (spares, filters, spark plugs, wipers, batteries and lubricants sold through distributors and a workshop network). **Consumer Goods** (9%) is Bosch power tools, mostly bought from the group and resold. **Others** (2%) was building technology until it was sold in May-2025 and is now mainly rent and services. Sales outside India were 8.1% of revenue in FY26.' },
    { p: `From Jul-2026 Bosch Ltd also owns 100% of **Bosch Chassis Systems India (RBIC)**, the group's Vehicle Motion business: ESP and ABS, braking actuation, airbag control units and vehicle-dynamics sensors, made at Chakan, Manesar and Sanand for Maruti Suzuki, Tata Motors, Toyota, Bajaj Auto and others. It earned ₹${n0(R.revenue.FY25)} cr of revenue in FY25 at a ${R.ebitdaMarginPct.FY25}% EBITDA margin, against Bosch Ltd's 12.8%. Bosch paid ₹${n0(R.consideration)} cr, almost all in cash. We include RBIC for the whole of FY27 (common-control accounting) at ~₹${n0(bld[0].rb)} cr of revenue: about ${Math.round(bld[0].rb / bld[0].rev * 100)}% of FY27E revenue and ${Math.round(bld[0].rbicE / bld[0].ebitda * 100)}% of EBITDA.` },
    { exhibit: { type: 'table', title: 'The businesses, FY26 (₹ crore)', head: ['Business', 'Revenue', 'Share', 'Segment result (margin)', 'What it sells'], wide: [4], rows: [
      ['**Automotive Products**', `**${n0(A26.auto)}**`, share(A26.auto, A26.total), `${n0(A26.autoResult)} (${n1(A26.autoResult / A26.auto * 100)}%)`, 'Power Solutions +17.6%, 2-Wheeler +69.1%, Mobility Aftermarket +3.7% in FY26 (revenue split not disclosed)'],
      ['**Consumer Goods**', n0(A26.cg), share(A26.cg, A26.total), `${n0(A26.cgResult)} (${n1(A26.cgResult / A26.cg * 100)}%)`, 'Bosch power tools and accessories, largely traded'],
      ['**Others**', n0(A26.others), share(A26.others, A26.total), `${n0(A26.othersResult)}`, 'Building technology (sold 1-May-2025), rentals of the Adugodi campus, services'],
      { hl: true, cells: ['**Bosch Ltd (FY26)**', `**${n0(A26.total)}**`, '100%', 'EBITDA 2,650 (13.2%)', 'Before unallocated income and corporate costs'] },
      ['**RBIC (FY25, acquired Jul-2026)**', n0(R.revenue.FY25), '–', `EBITDA ${n0(R.ebitdaFY25)} (${R.ebitdaMarginPct.FY25}%)`, 'ESP/ABS, braking, airbag ECUs, sensors; PAT ₹546 cr; net worth ₹1,410 cr'],
    ], source: 'AR FY26 note 33 (segment result is after allocated depreciation, before unallocated income and costs); Q4FY26 presentation; RBIC deck and postal ballot notice (Apr-2026)' } },
    { pair: [
      { type: 'stacked', title: 'Automotive is ~89% of revenue; power tools ~9%', unit: 'Revenue by segment (₹ crore)', x: SG.annual.map(a => a.fy), series: [{ name: 'Automotive', values: SG.annual.map(a => Math.round(a.auto)), fmt: 'num' }, { name: 'Consumer Goods', values: SG.annual.map(a => Math.round(a.cg)), fmt: 'num' }, { name: 'Others', values: SG.annual.map(a => Math.round(a.others)), fmt: 'num' }], minLabel: 900, source: 'Annual reports, note 33' },
      { type: 'column', title: 'RBIC: 17% a year growth and a 19% margin', unit: 'RBIC revenue (₹ crore)', x: ['FY23', 'FY24', 'FY25', '9MFY26'], series: [{ name: 'Revenue', values: [R.revenue.FY23, R.revenue.FY24, R.revenue.FY25, R.revenue['9MFY26']].map(Math.round), fmt: 'num' }], labels: 'all', source: 'RBIC investor presentation (8-Apr-2026); 9MFY26 unaudited' },
    ] },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Plants', 'Bosch Group in India: 17 manufacturing sites and 38,655 associates (Mar-2025), with locations including Bengaluru (Adugodi headquarters), Naganathapura, Bidadi, Nashik, Jaipur and Gangaikondan; RBIC: Chakan (main), Manesar, Sanand (860k+ sq ft, ~2,000 people)'],
      ['Parent links', 'Royalty and technical fees ₹478 cr, group professional and IT services ₹1,097 cr, purchases from group companies ₹7,786 cr (58% of purchases) in FY26'],
      ['New ventures', '50:50 JV with Tata AutoComp for e-axles and motors (Nashik; first shipments Q3 of calendar 2027); 50:50 JV with the TSF Group (Brakes India, Wheels India) for electronic air systems for trucks and buses (Chennai; operations from end-2026)'],
      ['Exports', '~8-8.5% of revenue (MD, Aug-2026); aftermarket exports +17% in FY26 (Nepal, Bangladesh, Sri Lanka); NOx sensors made for export'],
    ], source: 'AR FY26; RBIC deck; Q4FY26 and Q1FY27 presentations and calls' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Seventy years of diesel, a BS-VI shock, a string of business sales and now a ₹9,069 cr purchase from the parent',
  blocks: [
    { p: 'Bosch Ltd grew up as the group\'s Indian maker of diesel fuel-injection pumps for trucks, tractors and gensets. Its last decade was shaped by the shift away from diesel: the BS-VI rules of Apr-2020 made small diesel cars uneconomic, revenue fell 19% in FY20 and the company booked ₹1,390 cr of restructuring charges in FY20-21. It then simplified: it sold its Project House mobility-solutions unit (FY24) and diagnostics (FY25) to group companies and building technologies (FY26) to Keenfinity, booking gains each time. In 2026 it reversed direction and bought RBIC from the parent. The pattern matters for valuation: reported EPS in FY20, FY21, FY24 and FY26 is not the run-rate.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Impact on the numbers'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.what), rup(h.impact)]), source: 'Annual reports (notes 40, 49), Screener.in, RBIC deck and postal ballot notice, Q1FY27 call' } },
    { exhibit: { type: 'table', title: 'Reported EPS vs EPS before exceptional items (₹)', head: ['', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], rows: [
      ['Reported EPS', ...[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(y => n1(X.epsRep[y]))],
      ['EPS before exceptional items', ...[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(y => n1(X.epsClean[y]))],
      { hl: true, cells: ['**One-offs as % of clean EPS**', ...[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(y => `**${pc((X.epsRep[y] / X.epsClean[y] - 1) * 100)}**`)] },
    ], source: 'Screener.in (EPS; "profit excluding exceptional items"); AR note 40' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Vehicle production +11% in FY26 on GST 2.0; regulation keeps adding content, electrification threatens the oldest part',
  blocks: [
    { p: `India produced ${PR.fy26TotalMn} mn vehicles in FY26 (+${PR.fy26GrowthPct}%), helped from Sep-2025 by GST 2.0, which cut the tax on small cars, two-wheelers up to 350cc, tractors and commercial vehicles. Passenger cars reached ${PR.fy26PcMn} mn (+${PR.fy26PcGrowthPct}%). Q1FY27 production was ${PR.q1fy27TotalMn} mn (+${PR.q1fy27GrowthPct}%). Bosch is cautious beyond that: its own prognosis for FY27 was ${PR.fy27OutlookLowMn}-${PR.fy27OutlookHighMn} mn ("flattish", May-2026), and it expects the market to grow only ${PR.longRunCagrPct}% a year to 2033. For a supplier the more important driver is content per vehicle, which regulation keeps raising.` },
    { exhibit: { type: 'table', title: 'Regulation: where Bosch\'s content comes from', head: ['Rule', 'What it requires', 'What it means for Bosch'], wide: [1, 2], rows: I.regulation.map(r => r.map(rup)), source: 'Q4FY26 and Q1FY27 presentations and calls; RBIC deck (Apr-2026)' } },
    { bullets: [
      `**Electrification.** ${rup(I.ev)}`,
      '**Imports from the parent.** Bosch buys 58% of its inputs from related parties and traded goods are 40% of revenue; a weaker rupee or global price rises hit its gross margin (Q1FY27 −420bp) before it can pass them on. Localisation is management\'s answer ("well on track"), but the share bought from the parent rose to a decade high in FY26 (analyst on the Q1FY27 call).',
      '**Aftermarket.** A large, fragmented market where Bosch competes with OE-branded parts and local brands; Bosch\'s growth was only 3.7% in FY26 before a new go-to-market push (+9.6% in Q1FY27).',
      '**Power tools.** Cordless conversion and e-commerce; Bosch was first to get mandatory BIS certification for key tools (FY26), a barrier for cheap imports.',
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the India auto boom reach Bosch? Yes in volume and safety content; less so in margin',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach Bosch?', 'Catch'], wide: [1, 3], rows: [
      ['GST 2.0 volume boost', 'Production +11% in FY26, +22% in Q1FY27', 'Yes: mobility +16.9% in FY26, +25.7% in Q1FY27', 'One-off step: the base gets tough from Q3FY27; management guided "flattish" for FY27 in May'],
      ['Emission and efficiency rules (OBD-II, CAFE 3)', '2-Wheeler +69% in FY26 on OBD-II sensors; CAFE 3 from Apr-2027 (draft)', 'Yes: it is Bosch\'s core content', 'Each rule is a step, not a trend; the content it adds is ICE content'],
      ['Safety (ESP, airbags, CV ADAS, 2W ABS)', 'RBIC 17% CAGR FY23-25; CV ADAS from Jan/Oct-2027', 'Yes, now that RBIC is owned', 'Bosch paid ~₹9,069 cr for it; the 2W ABS mandate is not yet confirmed'],
      ['Premiumisation', 'Power Solutions +29% and 2-Wheeler +41% in Q1FY27 (premium motorcycle platforms)', 'Partly: higher-content engines and brakes', 'Margins have not followed: EBITDA margin 13.2% in FY26 vs 18-19% before BS-VI'],
    ], source: 'Company presentations and calls; Screener.in; GAM Research' } },
    { callout: '**Verdict:** the tailwind is real and Bosch is one of its biggest beneficiaries by content, but it has turned into revenue more than into margin. Bosch\'s EBITDA margin rose only ~120bp from FY21 to FY26 while revenue doubled, because more of what it sells is designed and partly made by the parent and paid for through purchases, royalties and service fees. RBIC changes the mix (19% margin) but at a full price.' },
  ],
};

module.exports = { business, history, industry, tailwind };
