// Minda Corporation report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./MINDACORP.ctx');
const { C, D, SA, SG, n0, pc } = X;
const I = D.industry, PR = I.production, MX = C.profile.mixFY26, MQ = C.profile.mixQ1FY27, PM = SG.products, EM = SG.endMarkets;
const A26 = SA.find(a => a.fy === 'FY26');

const business = {
  id: 'business', nav: 'What Minda Corp does', kicker: 'The business', title: 'Wiring, clusters, locks and castings for two-wheelers and trucks, plus 49% of an EV electronics maker',
  blocks: [
    { p: `Minda Corporation is the listed flagship of the Spark Minda group, controlled by Ashok Minda's family (64.8%). It is a different company from Uno Minda: the two Minda brothers split the group in 2012. It makes wiring harnesses and connectors, instrument clusters, vehicle-access and security systems (ignition locks, handles, immobilisers, smart keys), aluminium die castings, interior plastics and EV electronics in 42 plants, and sells spares under the Spark Minda brand. In FY26, two- and three-wheelers were ${MX.twoThreeW}% of revenue, commercial vehicles and tractors ${MX.cv}%, passenger vehicles ${MX.pv}% and the aftermarket ${MX.aftermarket}%; ${MX.india}% was billed in India. It reports one segment but discloses revenue for two verticals. Around it sit equity-accounted associates and JVs: Flash Electronics (49%), Furukawa Minda (17.5%, harnesses for Japanese car makers), and new JVs with HCMF (sunroofs), Turntide (EV motors) and, consolidated, Toyodenso (switches). Including Flash, Vast and Furukawa, "group" revenue was ~₹9,016 cr in FY26.` },
    { exhibit: { type: 'table', title: 'The two verticals, FY26 (₹ crore)', head: ['Vertical', 'Revenue', 'Share', 'FY26 growth', 'Q1FY27 growth', 'What it sells'], wide: [5], rows: [
      ['**Mechatronics, Aftermarket & Others**', n0(A26.mechatronics), Math.round(A26.mechatronics / A26.total * 100) + '%', pc((A26.mechatronics / 2475 - 1) * 100), pc(C.q1fy27.mechatronicsGrowthPct) + ' (incl. Vast)', 'Vehicle access and security systems, die castings, aftermarket, EV systems; Minda Vast (PV door handles, latches, smart access) from FY27'],
      ['**Information & Connected Systems**', n0(A26.ics), Math.round(A26.ics / A26.total * 100) + '%', pc((A26.ics / 2581 - 1) * 100), pc(C.q1fy27.icsGrowthPct), 'Wiring harnesses (incl. HV harness, connectors, PDUs), instrument clusters (TFT up to 15 inch), sensors, telematics'],
      { hl: true, cells: ['**Total**', `**${n0(A26.total)}**`, '100%', '+22%', '+33%', 'Revenue from operations, consolidated'] },
    ], source: 'Q4FY26 and Q1FY27 presentations. No vertical profit is disclosed.' } },
    { pair: [
      { type: 'stacked', title: 'Products: harness and vehicle access are over half', unit: 'Share of revenue by product (%)', x: ['FY25', 'FY26', 'Q1FY27'], series: [
        { name: 'Wiring harness', values: [PM.FY25.wiringHarness, PM.FY26.wiringHarness, PM.Q1FY27.wiringHarness], fmt: 'pct0' },
        { name: 'Vehicle access', values: [PM.FY25.vehicleAccess, PM.FY26.vehicleAccess, PM.Q1FY27.vehicleAccess], fmt: 'pct0' },
        { name: 'Clusters', values: [PM.FY25.clusters, PM.FY26.clusters, PM.Q1FY27.clusters], fmt: 'pct0' },
        { name: 'Die casting', values: [PM.FY25.dieCasting, PM.FY26.dieCasting, PM.Q1FY27.dieCasting], fmt: 'pct0' },
        { name: 'Others', values: [PM.FY25.others, PM.FY26.others, PM.Q1FY27.others], fmt: 'pct0', color: '#8c8c8c' }], minLabel: 5, source: 'Company presentations' },
      { type: 'stacked', title: 'End markets: PVs up to 19% with Minda Vast', unit: 'Share of revenue by end market (%)', x: ['FY25', 'FY26', 'Q1FY27'], series: [
        { name: '2W and 3W', values: [EM.FY25.twoThreeW, EM.FY26.twoThreeW, EM.Q1FY27.twoThreeW], fmt: 'pct0' },
        { name: 'CV and off-highway', values: [EM.FY25.cv, EM.FY26.cv, EM.Q1FY27.cv], fmt: 'pct0' },
        { name: 'Passenger vehicles', values: [EM.FY25.pv, EM.FY26.pv, EM.Q1FY27.pv], fmt: 'pct0' },
        { name: 'Aftermarket', values: [EM.FY25.aftermarket, EM.FY26.aftermarket, EM.Q1FY27.aftermarket], fmt: 'pct0' }], minLabel: 5, source: 'Company presentations; Vision 2030 target: PVs 25% by FY30' },
    ] },
    { exhibit: { type: 'table', title: 'Associates, JVs and partners', head: ['Entity', 'Minda stake', 'What it does', 'How it shows up'], wide: [2], rows: [
      ['Flash Electronics', '49% (associate)', 'Magnetos, alternators, regulator-rectifiers, EV motors and controllers, chargers; FY26 revenue ₹1,803 cr; plants in India, Germany, Hungary', 'Share of profit (~₹70 cr in FY26); ₹1,474 cr carrying value'],
      ['Minda Vast Access Systems', '50% (with VAST)', 'PV vehicle access: handles, latches, locks, passive entry; FY26 revenue ~₹500 cr', 'Equity-accounted to FY26 (₹5 cr); consolidated from Apr-2026 with 50% minority'],
      ['Furukawa Minda Electric', '17.5% (associate)', 'Wiring harnesses for Japanese car makers', 'Share of profit ~₹8 cr in FY26'],
      ['Spark Minda Toyodenso', '60% (subsidiary)', 'Switches for 2W and cars; SOP Q4FY27', 'Consolidated; 40% minority'],
      ['Spark Minda HCMF / Turntide', '50% / 49% (JVs)', 'Sunroofs and power tailgates / axial-flux motors, controllers', 'Equity-accounted; start-up losses'],
    ], source: 'AR FY26 notes 2.4 and 2.49; Q4FY26 and Q1FY27 presentations and calls' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From restructuring to deal-making: KTSN write-off, Pricol exit, Flash purchase, Vast control',
  blocks: [
    { p: 'After the 2012 family split, Minda Corp spent the rest of the decade cleaning up: the German plastics unit Minda KTSN went insolvent and was written off, and the write-off was later allowed as a tax deduction, which is why FY23 tax was ~1% (Screener also shows ₹196 cr and ₹41 cr of exceptional losses after tax in FY20-21). It built a 15.7% stake in rival Pricol (cost ~₹400 cr) amid talk of a combination that the competition regulator questioned, and sold it in Jan-2024 for ₹658 cr. The proceeds and new debt went into 49% of Flash Electronics in Jan-2025. In FY26 it signed three technology JVs, and from Apr-2026 it consolidates Minda Vast after changing the shareholders\' agreement with VAST. Each step changed what "earnings" means, which matters for the valuation history.' },
    { exhibit: { type: 'table', title: 'Milestones and corporate actions', head: ['When', 'What'], wide: [1], rows: C.history, source: C.historySrc } },
    { exhibit: { type: 'table', title: 'Recent actions and what they did to the numbers', head: ['When', 'Action', 'Impact'], wide: [1, 2], rows: [
      ['FY22-FY23', 'Exceptional gains and a one-time tax benefit (KTSN write-off allowed for tax)', 'Reported PAT ₹192 cr / ₹284 cr vs normalised ₹137 cr / ₹219 cr: we use the normalised figures in the valuation history'],
      ['Jan-2024', 'Pricol stake (15.7%) sold for ₹658 cr', 'Gain (₹239 cr) through OCI, not profit; cash used for Flash'],
      ['Jan-2025', '49% of Flash Electronics for ₹1,372 cr', 'Gross debt ₹348 cr → ₹1,344 cr; interest ₹67 cr → ₹122 cr (FY26); share of associates ₹16 cr → ₹81 cr'],
      ['Jun-2025', '76.5 lakh warrants to promoter Minda Capital at ₹550', '₹105 cr received; ₹316 cr due by Dec-2026; 3.2% dilution (we use the diluted count)'],
      ['Apr-2026', 'Minda Vast consolidated (SHA change)', '~₹125 cr a quarter of revenue at ~8% margin; ₹124 cr fair-value gain in Q1FY27 (₹106 cr after tax): excluded from our EPS'],
    ], source: 'AR FY24 note 2.48; AR FY25; AR FY26 notes 2.4, 2.16.8; Q4FY24 presentation (normalised PAT); Q1FY27 presentation and call' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: `Record vehicle production in Q1FY27 (+${PR.q1fy27GrowthPct}%) after GST cuts; commodity costs are the catch`,
  blocks: [
    { p: `India produced ~${PR.fy26TotalMn} mn vehicles in FY26 (+${PR.fy26GrowthPct}%), with a strong second half after the Sep-2025 GST cuts. Q1FY27 production was a record ${PR.q1fy27TotalMn} mn (+${PR.q1fy27GrowthPct}%): two-wheelers ${PR.q1fy27TwMn} mn (+${PR.q1fy27TwGrowthPct}%; scooters +32%), passenger vehicles ${PR.q1fy27PvMn} mn (+${PR.q1fy27PvGrowthPct}%), commercial vehicles +${PR.q1fy27CvGrowthPct}%, three-wheelers +${PR.q1fy27ThreeWGrowthPct}% and tractors +${PR.q1fy27TractorGrowthPct}%. Electric two-wheelers reached ${I.ev.q1fy27E2wPenetration}% of registrations and electric cars ${I.ev.q1fy27EPvPenetration}%. From Q3FY27 the comparison base includes the GST boost.` },
    { exhibit: { type: 'table', title: 'What drives Minda Corp\'s growth beyond volumes', head: ['Driver', 'Evidence (to Aug-2026)', 'Relevance for Minda Corp'], wide: [1, 2], rows: [
      ['Electrification', `e-2W ${I.ev.q1fy27E2wPenetration}%, e-PV ${I.ev.q1fy27EPvPenetration}% (Q1FY27); EV registrations +57%`, 'EV ~10% of consolidated revenue (+40%) and ~30% of Flash revenue (+90%); HV harnesses, chargers, controllers'],
      ['Premiumisation', 'TFT clusters (3-15 inch), smart keys, HV harnesses; 12-13 points of FY26 growth from premiumisation and new products (company)', 'Kit value rises without more vehicles'],
      ['Localisation', 'In-house connectors now meet ~18-19% of harness needs; SANCO (China) tie-up for HV connectors', 'Margin lever in harnesses'],
      ['Two-wheeler and truck cycle', '2W +23% and CV +14% in Q1FY27', 'Three-quarters of revenue; more cyclical than PVs'],
      ['Exports', 'Lifetime orders ~20% exports (FY26); ₹420 cr exports in FY25, ₹1,500 cr target by FY30', 'Die-casting export plant (Pune); clusters for European 2W makers'],
      ['Commodities and wages', 'Copper, zinc, aluminium +30-40% in FY26; labour codes; freight', 'Passed through with a lag and no margin: revenue up, margin % down'],
    ], source: 'Q4FY26 and Q1FY27 presentations and calls; Vision 2030 deck (Sep-2025)' } },
    { callout: '**Our read:** the cycle has been a strong tailwind (two-wheelers and trucks are Minda Corp\'s two largest markets) and becomes a tougher base from H2FY27. The structural drivers (clusters, HV harnesses, EV electronics) are real but much of the EV upside sits in Flash, a minority stake.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach the company?', title: 'Tailwind test: yes, Minda Corp has outgrown production by ~10 points a year since FY25',
  blocks: [
    { exhibit: { type: 'table', title: 'Minda Corp revenue growth vs vehicle production', head: ['Period', 'Production growth', 'Minda Corp revenue growth', 'Outperformance'], rows: [
      ['FY26', `+${PR.fy26GrowthPct}% (all vehicles)`, '+22%', '~+10 points'],
      ['Q1FY27', `+${PR.q1fy27GrowthPct}%`, `+33% reported; ~+${Math.round((C.q1fy27.salesExVast / 1386 - 1) * 100)}% organic`, '~+2 points organic'],
      ['FY24-25 (a year)', 'Slow CV and export markets', '+8-9%', 'Lagged'],
    ], source: 'Company calls; SIAM as quoted by the company' } },
    { bullets: [
      '**The tailwind reaches it.** FY26 growth was nearly twice production growth, helped by harness and cluster premiumisation; management attributes 12-13 points of Q4FY26\'s 29% growth to premiumisation and new products.',
      '**But it is cyclical.** In FY24-25, when trucks and exports slowed, revenue grew only 8-9% a year. Q1FY27 organic growth (~24%) was only a little above production (+22%).',
      '**The EV tailwind mostly lands in Flash.** Minda Corp\'s own EV revenue is ~10% of the total; Flash\'s EV revenue grew 90% in Q1FY27, but Minda gets 49% of Flash\'s profit, not its revenue.',
    ] },
  ],
};

module.exports = { business, history, industry, tailwind };
