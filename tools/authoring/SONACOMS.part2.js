// Sona Comstar report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./SONACOMS.ctx');
const { C, D, SA, n0, n1, pc, BL, yr } = X;
const MX = C.mix, I = D.industry, OB = C.orderBook;
const rup = s => String(s).replace(/Rs ?/g, '₹');

const business = {
  id: 'business', nav: 'What Sona does', kicker: 'The business', title: 'Gears, motors and now railway brakes: a driveline and motor specialist for the world\'s car makers',
  blocks: [
    { p: 'Sona BLW Precision Forgings (brand: Sona Comstar) began in 1995 as a maker of precision-forged bevel gears for Indian cars and tractors. In 2019 it merged with Comstar Automotive Technologies (starter motors and alternators), listed in Jun-2021, and since then has moved into electric drivetrains. It reports one segment and does not split revenue by product. Its businesses are: **driveline** (differential gears, differential assemblies including the complete differentials that go into EV e-axles, intermediate and epicyclic gears, steering bevel boxes); **motors** (conventional and micro-hybrid starter motors; traction motors and controllers for electric 2- and 3-wheelers; suspension motors for an active-suspension system built with ClearMotion); **railway** (brakes, couplers, suspension and now HVAC and electric panels, bought from Escorts Kubota in Jun-2025); and **sensors and software** (NOVELIC, Serbia: mmWave radar). Robotics and physical AI was added as a vertical in Jul-2026.' },
    { exhibit: { type: 'table', title: 'The businesses (company disclosure; product revenue is not reported)', head: ['Business', 'Main products', 'What we know about its size', 'Position'], wide: [1, 2, 3], rows: [
      ['**Driveline**', 'Differential gears and assemblies (ICE, hybrid, EV), epicyclic gear trains, intermediate gears, bevel boxes', 'Largest business; differential gears and assemblies were the top two products in FY25 (top four products = 86% of revenue)', '8.7% of global differential gears (CY25); 55-60% of India PV, 80-90% CV, 75-85% tractors'],
      ['**Motors**', 'Starter motors (conventional, micro-hybrid), EV traction motors and controllers (2W/3W), suspension motors', 'Traction motors "almost 10% of revenue" (May-2026); the 2W/3W EV business had ₹385.5 cr of FY26 turnover (DENSO filing)', '4.2% of global starter motors; ~25% of India e-2W/3W traction motors (CEO, Q1FY27 call)'],
      ['**Railway** (from 1-Jun-2025)', 'Brakes, couplers, suspension, air springs; HVAC and electric panels approved in Q4FY26', `₹912.8 cr of revenue in FY25 under Escorts Kubota; our FY26 estimate ~₹${n0(BL.base.rail)} cr (10 months)`, 'Leader in Indian railway braking systems (AR FY26)'],
      ['**Sensors, software, robotics**', 'Short-range and in-cabin radar (NOVELIC), robotics components, AMR perception stack', 'Robotics & physical AI order book ₹800 cr (3% of the order book); revenue negligible', 'New; first SOPs from Q2FY27'],
    ], source: 'AR FY26 pp.24-41; Q1FY27 and Q4FY26 presentations and calls; DENSO board-outcome filing (22-Jul-2026)' } },
    { pair: [
      { type: 'hbar', title: 'Market mix: non-automotive (railway, off-highway) jumped to 31% of revenue', unit: 'Share of FY26 revenue (%)', x: ['Passenger vehicles', 'Non-automotive', 'E2W / E3W', 'Commercial vehicles', 'Semis & software'], series: [{ name: 'FY25', values: [71, 9, 8, 11, 1], fmt: 'pct0' }, { name: 'FY26', values: [49, 31, 10, 9, 1], fmt: 'pct0' }], labels: 'all', source: 'AR FY26, revenue mix by market segment' },
      { type: 'stacked', title: 'Automotive revenue by powertrain: BEV 35%, ICE-dependent only 10%', unit: 'Share of automotive product revenue (%)', x: ['FY23', 'FY24', 'FY25', 'FY26'], series: [['BEV', 0], ['Micro-hybrid / hybrid', 1], ['Power-source neutral', 2], ['ICE-dependent', 3]].map(([nm, j]) => ({ name: nm, values: ['FY23', 'FY24', 'FY25', 'FY26'].map(y => MX.powertrain[y][j]), fmt: 'pct0' })), source: 'AR FY26 p.40' },
    ] },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Plants', rup(C.business.plants)],
      ['Customers', rup(C.business.customers) + '; 69 EV programmes with 36 customers (Q1FY27)'],
      ['Order book', `₹${n0(OB.Q1FY27)} cr at Jun-2026 (${OB.multipleOfRevenue}x FY26 revenue): EV ${OB.evShareQ1FY27}%, non-EV ${OB.nonEvShare}%, railway ${OB.railShare}%, robotics ${OB.roboticsShare}%. ${OB.definition}.`],
      ['R&D', '₹126 cr in FY26 (2.8% of revenue; ₹114 cr in FY25); 29 products, up from 10 five years earlier'],
      ['People', 'Over 6,000 employees (Mar-2026)'],
    ], source: 'Q1FY27 presentation slides 20, 33; AR FY26 (MD&A, note 32)' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a gear forge to a listed EV supplier, then a railway acquisition and a DENSO partnership',
  blocks: [
    { p: 'Three decisions explain most of Sona\'s growth from FY15 to FY25 (CEO, Q1FY27 call): adding product verticals (Comstar\'s motors, EV products), selling to the West (North America was 41% of FY25 revenue), and committing early to electrification (BEV share 2% in FY20, 36% in FY25). The former private-equity holding company, Singapore VII Topco III (the "erstwhile holding company" in the AR FY26), has exited; the Kapur family\'s Aureus Investment is now the only promoter (28%). Since FY25 the company has diversified away from the US EV programmes that drove it: a QIP in Sep-2024, the railway business in Jun-2025, and in Jul-2026 two DENSO joint ventures and a new robotics vertical ("Sona Comstar 2.0").' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Impact on the numbers'], wide: [1, 2], rows: [
      ...C.corporateActions.map(c => [c.date, rup(c.what), {
        '2019': 'Comstar merged in: FY20 revenue +48%; FY20 includes a ₹233 cr pre-tax exceptional gain (pre-listing).',
        '2021-06-24': 'The post-listing premium unwound within 18 months (−49% from the Dec-2021 peak to Dec-2022).',
        '2024-09': '+5.6% shares; net cash peaked at ₹2,659 cr (Mar-25); ROE fell from 21% (FY24) to 15% (FY25).',
        'FY2023-24': 'Small revenue; minority shareholders absorb part of NOVELIC\'s losses (Screener\'s Net Profit row is before them).',
        '2025-06-01': '~25 points of FY26 revenue growth; lower margin; goodwill and intangibles added; net cash fell to ₹1,026 cr; treasury income fell.',
        '2026-07-22': 'Not in our model (completion by Mar-2027): ~₹857.5 cr of cash in, 49% of a ~₹390 cr-revenue business to DENSO; ~EPS-neutral.',
      }[c.date] || '–']),
    ], source: 'Annual reports FY25-FY26; DENSO filing (22-Jul-2026); Q1FY27 and Q4FY26 calls; Screener.in' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Demand is healthy except in US EVs; costs and rare earths are the squeeze',
  blocks: [
    { p: rup(I.demand) },
    { bullets: [
      `**Electrification.** ${rup(I.evShare)} Sona's EV content is in differential assemblies (any e-axle, any market), traction motors (Indian e-2W/3W) and soon high-voltage motors via the DENSO JV. Weakness at its anchor EV customer (not named) and a 16% fall in US BEV sales are what made FY26 a "tough" year.`,
      `**Hybrids.** North American and European OEMs are adding hybrids; Sona won a hybrid differential programme from a North American OEM in Q1FY27 (₹640 cr) and micro-hybrid starter motors are an established line. 20% of automotive revenue is hybrid / micro-hybrid.`,
      `**Costs.** ${rup(I.costs)}`,
      `**Rare earths.** ${rup(I.rareEarths)}`,
      `**Railways.** ${rup(I.rail)}`,
    ] },
    { callout: '**Why it matters:** Sona\'s growth depends less on vehicle volumes than on winning programmes and launching them on time. The order book gives visibility, but launches slip, volumes on EV programmes have repeatedly come in below plan, and the company itself discounts the order book. Margins depend on how quickly OEMs accept commodity pass-through.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the electrification tailwind reach Sona? Yes in revenue, less so in margin',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach Sona?', 'Catch'], wide: [1, 3], rows: [
      ['Global EV adoption', 'BEV revenue ₹23 cr (FY20) to ₹1,224 cr (FY25); +107% in Q1FY27', 'Yes: 44% of automotive revenue in Q1FY27', 'Lumpy: −6% in FY26 on one customer and US policy; EV products carry lower margins'],
      ['India electric 2W/3W', 'Best ever quarters in Q4FY26-Q1FY27; ~25% traction-motor share', 'Yes, but it will be shared: DENSO takes 49% of this business', 'Low value addition; competitive; part of the profit goes to DENSO from FY28'],
      ['Indian Railways capex', 'Railway order book ₹1,300 cr (12 months); new HVAC/panel approvals', 'Yes, since Jun-2025 (bought for ₹1,643 cr)', 'Lower margin (~20% by our estimate); slow payers; we paid ~1.8x revenue for it'],
      ['Robotics and physical AI', '₹800 cr order book from three orders', 'Not yet: revenue negligible', 'Management: irrelevant for investment horizons under three years'],
    ], source: 'Company presentations and calls; DENSO filing; GAM Research' } },
    { callout: '**Verdict:** the tailwinds reach Sona\'s revenue, which is why it is one of the few Indian component makers with a global EV franchise. They have not reached its margin: every new growth engine (traction motors, railway, suspension motors) earns less than the original differential-gear business, and the guided margin band has moved down as they grew.' },
  ],
};

module.exports = { business, history, industry, tailwind };
