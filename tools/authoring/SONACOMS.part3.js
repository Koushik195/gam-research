// Sona Comstar report, part 3: the business lines (driveline, motors and the DENSO deal, railway, sensors/robotics) and
// the competitive-advantage scorecard. Product revenue is not disclosed; we say what is known and what we estimate.
const X = require('./SONACOMS.ctx');
const { C, n0, n1, pc, BL, bld, railShare, auto26M, DN, AS } = X;

const driveline = {
  id: 'driveline', nav: 'Driveline', kicker: 'Business line 1', title: 'Driveline: the original franchise, still winning ICE, hybrid and EV programmes',
  blocks: [
    { p: 'Differential gears were Sona\'s first product and remain its foundation. A differential lets the driven wheels turn at different speeds in a corner; every car, truck, tractor and EV needs one per driven axle. Sona makes the gears (sold to axle and transmission makers) and, increasingly, complete differential assemblies, which carry more value per vehicle and go into EV e-axles made by OEMs and Tier-1s worldwide. It holds 8.7% of the global differential-gear market (CY25; 8.1% in CY23) and dominates India. Outside China it gained share in CY25. Margins are the company\'s highest: forging, machining and heat treatment are capital- and know-how-intensive, and programmes run for 7-10 years.' },
    { exhibit: { type: 'table', title: 'Recent driveline wins (order-book additions)', head: ['Quarter', 'Programme', 'Customer', 'Order value (₹ cr)', 'Start of production'], rows: [
      ['Q4FY26', 'Differential gears, BEV PVs', 'New European OEM', '220', 'H1FY29'],
      ['Q4FY26', 'Differential assemblies, BEV PVs', 'New and existing European OEMs, Indian OEM', '140 + 100 + 120', 'H1-H2FY28'],
      ['Q1FY27', 'Hybrid differential assembly, PVs', 'Existing North American OEM', '640', 'H2FY29'],
      ['Q1FY27', 'Differential gears, ICE PVs', 'Existing North American OEM', '210', 'H2FY28'],
      ['Q1FY27', 'Differential gears, ICE CVs and off-highway', 'North American and Indian customers', '40', 'H1FY28'],
    ], source: 'Q4FY26 presentation slide 10; Q1FY27 presentation slides 17-19' } },
    { callout: '**So what:** the driveline business is the reason Sona earns mid-20s margins. It keeps winning programmes in every powertrain, including ICE and hybrids, which reduces the dependence on BEV volumes. But its growth depends on programme launches 2-3 years out (most wins above start in FY28-29), and its share gains have slowed (8.8% in CY24, 8.7% in CY25).' },
  ],
};

const motors = {
  id: 'motors', nav: 'Motors & DENSO', kicker: 'Business line 2', title: 'Motors: starters, EV traction and suspension motors, and a DENSO partnership that shares the upside',
  blocks: [
    { p: 'The motor business came with Comstar: starter motors for cars and trucks (4.2% of the global market) and micro-hybrid starters. Sona then built EV traction motors and controllers for electric 2- and 3-wheelers (now "almost 10% of revenue", ~25% of the Indian market) and a suspension motor for an active-suspension system (with ClearMotion; production ramping in China), the fastest-growing product in Q1FY27. Traction motors are the lowest-margin product: an assembled item with low value addition, and they dragged the Q1FY27 margin.' },
    { p: `**The DENSO deal (22-Jul-2026).** Sona will move its 2W/3W EV business (air-cooled traction motors, inverters, e-axles; FY26 turnover ₹${n1(DN.rev26)} cr, net worth ₹${n1(DN.nw26)} cr) into a subsidiary, Sona eDrive, for ₹${n1(DN.slump)} cr (₹${n1(DN.cash)} cr in cash). DENSO subscribes for 49% of Sona eDrive at an enterprise value of ₹${n0(DN.ev)} cr; Sona keeps 51% and control. Separately, a new JV for high-voltage, liquid-cooled traction motors and inverters for cars and trucks will be 51% DENSO and 49% Sona (Sona invests ₹26 cr initially). Each partner licenses technology to the JV it controls for a royalty. Completion is due by 31-Mar-2027.` },
    { exhibit: { type: 'table', title: 'What the DENSO deal does to the numbers (not in our model)', head: ['Item', 'Value', 'Comment'], wide: [2], rows: [
      ['Cash into the group', `₹${n1(DN.cash)} cr`, 'Paid by Sona eDrive to Sona, funded by DENSO\'s subscription'],
      ['After-tax yield on that cash', `~₹${n0(DN.oiPost)} cr a year`, `At our ${AS.treasuryYield[1]}% treasury yield and ${AS.taxRate[1]}% tax`],
      ['DENSO\'s 49% share of Sona eDrive profit', 'Unknown', `Equals the yield if eDrive earns ₹${n0(DN.breakEvenPat)} cr of PAT: a ${n1(DN.breakEvenMargin)}% net margin on ~₹${n0(DN.rev28at40)} cr of FY28 revenue if it grows 40% a year`],
      ['Price DENSO paid', `${n1(DN.evSales)}x FY26 sales`, `The market values Sona as a whole at ~${n1(DN.sonaEvSales)}x FY26 sales (EV ÷ revenue)`],
    ], source: 'DENSO board-outcome filing (22-Jul-2026); GAM Research' } },
    { callout: `**Our read:** strategically sensible (DENSO brings hybrid and high-voltage technology, customers and export reach Sona could not get alone), and close to EPS-neutral, so we leave it out until it completes. Two points the market may be glossing over: Sona gives away 49% of one of its two fastest-growing lines, and the price (${n1(DN.evSales)}x sales) says a sophisticated buyer values that line far below the ~${Math.round(DN.sonaEvSales)}x sales the market pays for Sona. JV2 is 49% owned and equity-accounted; with no revenue before its first start of production (timing undisclosed), it is likely to report losses at first.` },
  ],
};

const railway = {
  id: 'railway', nav: 'Railway', kicker: 'Business line 3', title: `Railway: ~${Math.round(railShare[0])}% of FY27E revenue, lower margin, bought for ₹1,643 cr`,
  blocks: [
    { p: `On 1-Jun-2025 Sona bought the Railway Equipment Division of Escorts Kubota (brakes, couplers, suspension, air springs for locomotives, coaches, wagons and metros) for ₹1,643 cr in cash; it had ₹912.8 cr of revenue in FY25. Sona does not disclose its revenue or profit ("our job is not to help build better models", CEO, Q3FY26). From disclosed bounds we estimate ~₹${n0(BL.base.rail)} cr in the ten months of FY26 (see the segments file) and ~₹${n0(bld[0].ra)} cr in FY27E. The guided margin band fell a point when it was added, which implies an EBITDA margin around 20% versus ~25% for the rest: we use ${AS.build.railMargin[0]}% rising to ${AS.build.railMargin[2]}%, and ~${n1(auto26M)}% for FY26 automotive.` },
    { bullets: [
      '**Growth levers (management):** demand above what is being supplied (capacity and supply-chain fixes), "white spaces" in existing product families, and new products: electric panels (~₹1,500 cr market, all rolling stock in 12-15 months) and HVAC (₹2,000-2,500 cr market, at least three years to cover all types). New products become meaningful "from the third year".',
      '**Returns vs margins:** management says railway is "very high return" on its own capital though lower margin. On the ₹1,643 cr Sona paid (~1.8x FY25 revenue), the return is much lower: at ~₹1,080 cr of annual revenue and ~20% EBITDA, roughly ₹160 cr of pre-tax operating profit after depreciation and amortisation (our estimate), ~10% pre-tax on the price.',
      '**Working capital:** railway customers pay slowly; group receivable days rose from 73 to 94 in FY26.',
    ] },
    { callout: '**So what:** a sensible diversification away from US EV risk into a policy-backed Indian market, but it dilutes margins and, at the price paid, returns. It explains most of FY26\'s 25% revenue growth.' },
  ],
};

const newv = {
  id: 'newv', nav: 'Sensors & robotics', kicker: 'Business line 4', title: 'Sensors, robotics and physical AI: a ₹800 cr order book and a long runway',
  blocks: [
    { p: 'NOVELIC (Serbia) gives Sona mmWave radar: in-cabin occupant sensing and a short-range exterior radar for an Indian commercial-vehicle OEM, aimed at upcoming Indian ADAS rules. In Jul-2026 management announced Robotics & Physical AI as a third growth engine with three orders worth ₹600 cr (an advanced robotics subsystem, a perception software stack for autonomous mobile robots, a radar perception solution), taking the vertical\'s order book to ₹800 cr; one order starts in Q2FY27, one in Q3 and one within 15 months. It is building its own AMR (shown at CES 2026) and plans cobots.' },
    { callout: `**Our view:** this is where much of the 2026 re-rating came from (the stock rose ~16% from the Q1 results to 30-Sep), and it may become a real business: motors, gearboxes and sensors are robot building blocks. But management's own rule of thumb is "first three years no money, year 4 the first dollar, year 7-8 a $100 mn business", and it told investors that with a horizon under three years "none of this has any meaning". We give it no explicit value; it is part of what a ${X.MULT.bull}x bull multiple would pay for.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a narrow but real moat in engineering and programme lock-in',
  blocks: [
    { verdicts: [
      ['Technology and engineering', 'Strong', '19 in-house products scaled in seven years; EV differentials for global e-axles; DENSO pays royalties for its 2W/3W technology', 'Sona can create new product lines; that is its edge'],
      ['Scale and share', 'Moderate', '8.7% of global differential gears, 4.2% of starter motors; dominant in India', 'Large in a niche; customers are far bigger'],
      ['Customer lock-in', 'Moderate', 'Programmes run 7-10 years; validation takes ~32 months; 69 EV programmes, 36 customers', 'Revenue is sticky per programme, but every programme is re-bid'],
      ['Pricing power', 'Weak', 'Commodity pass-through lags; margin fell 2.7 pts in FY26; OEMs set prices', 'Margins follow mix and inflation'],
      ['Diversification', 'Improving', 'Top four products 86% of revenue in FY25; top eight in FY26; India 51% of revenue', 'Less fragile than in FY25, at the cost of margin'],
      ['Disclosure', 'Weak', 'No product or business-unit revenue; order book is a management estimate', 'Investors must take mix and margin claims on trust'],
    ], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (annual reports, presentations and calls to Sep-2026)' },
    { callout: `**Honest verdict:** ${D_verdict()}` },
  ],
};
function D_verdict() { return X.D.moat.verdict; }

module.exports = { driveline, motors, railway, newv, moat };
