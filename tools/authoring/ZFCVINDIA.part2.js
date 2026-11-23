// ZF CV India report, part 2: what the company does, history and corporate actions, industry (truck cycle, regulation,
// electric buses) and the tailwind test.
const X = require('./ZFCVINDIA.ctx');
const { C, D, SA, A26, n0, n1, pc, rup, bld, RP } = X;
const I = D.industry, PR = I.production;
const share = (x, t) => n1(x / t * 100) + '%';
const REV26 = 4118.9;

const business = {
  id: 'business', nav: 'What ZF CV India does', kicker: 'The business', title: 'The air brakes in most Indian trucks and buses, plus exports and engineering for its German parent',
  blocks: [
    { p: 'ZF Commercial Vehicle Control Systems India (the former WABCO India) makes the systems that brake and manage compressed air in trucks, buses, trailers, tractors and construction machines: compressors, valves, brake actuators and chambers, ABS, and now electronic braking (EBS), electronic stability control (ESC), air suspension (ECAS), clutch actuation for automated gearboxes and bus door controls. It has supplied Indian truck makers for six decades and is the incumbent on almost every heavy truck and bus platform. Its promoter, WABCO Asia (Singapore), owns 60% and belongs to ZF Friedrichshafen, which bought WABCO worldwide in 2020.' },
    { p: `Revenue comes from four places. **Domestic OEM** sales to truck, bus and tractor makers (₹${n0(A26.oem)} cr in FY26, ${share(A26.oem, REV26)}). **Aftermarket** spares through ~550 dealers and distributors (₹${n0(A26.aftermarket)} cr, ${share(A26.aftermarket, REV26)}). **Exports of goods** (₹${n0(A26.exports)} cr, ${share(A26.exports, REV26)}), mostly compressors and actuators made in the Chennai SEZ; ₹${n0(RP.zfGlobalSalesGoods)} cr of them were sold to one sister company, ZF CV Systems Global GmbH, which distributes them to ZF's plants and customers in the US and Europe. **Services** (₹${n0(A26.services)} cr, ${share(A26.services, REV26)}): software, R&D and support work done in India for ZF's global commercial-vehicle division, billed at cost plus a mark-up. In all, ~₹${n0(RP.zfGlobalTotal)} cr of business (a third of revenue) was with that one group company.` },
    { exhibit: { type: 'table', title: 'The business lines, FY26 (₹ crore)', head: ['Line', 'Revenue', 'Share', 'Growth FY26', 'What it sells, to whom'], wide: [4], rows: [
      ['**Domestic OEM**', `**${n0(A26.oem)}**`, share(A26.oem, REV26), '+17.5%', 'Air-brake systems, ABS, ESC (buses), EBS, ECAS, compressors, AMT clutch actuators to Tata Motors, Ashok Leyland, VECV, Daimler India, Mahindra, bus and tractor makers'],
      ['**Aftermarket**', n0(A26.aftermarket), share(A26.aftermarket, REV26), '+15.6%', 'Spares, retrofits (door controls, trailer EBS), traded parts under the SPARK programme; fleets and workshops'],
      ['**Exports of goods**', n0(A26.exports), share(A26.exports, REV26), '−11.1%', 'Compressors, spring-brake actuators, brake chambers for US and European trucks and trailers (~50:50), 76% via ZF CV Systems Global'],
      ['**Services**', n0(A26.services), share(A26.services, REV26), '+11.2%', 'Software (₹324 cr), R&D (₹60 cr), business support (₹77 cr), other (₹44 cr), nearly all billed to ZF group'],
      ['Other operating revenue', n0(A26.otherOp), share(A26.otherOp, REV26), '', 'Scrap, export incentives, test-track usage'],
      { hl: true, cells: ['**Revenue from operations**', `**${n0(REV26)}**`, '100%', '+7.5%', 'Plus other income ₹183 cr (interest, fund gains, FX): total income ₹4,302 cr'] },
    ], source: 'Q4FY26 call (OEM, aftermarket, exports); AR FY26 notes 18-19 and 35.2' } },
    { pair: [
      { type: 'stacked', title: 'OEM is ~half of income; exports and services ~40%', unit: 'Total income by line (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'Domestic OEM', values: SA.map(a => a.oem), fmt: 'num' }, { name: 'Aftermarket', values: SA.map(a => a.aftermarket), fmt: 'num' }, { name: 'Exports of goods', values: SA.map(a => a.exports), fmt: 'num' }, { name: 'Services + other income', values: SA.map(a => a.svcOi), fmt: 'num', color: '#7a5c99' }], minLabel: 300, source: 'Q4FY26 presentation p33 (total income basis)' },
      { type: 'column', title: 'Content per truck: ₹45.5k in Q3FY26, ₹39.5k in Q4', unit: 'OEM value per vehicle (₹ thousand)', x: ['Q3FY26', 'Q4FY26'], series: [{ name: 'Value per vehicle', values: [C.fy26.vpvQ3K, C.fy26.vpvQ4K], fmt: 'n1' }], labels: 'all', source: 'Q4FY26 call (Q3 included one-off price settlements; "more or less flattish" without them)' },
    ] },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Plants', 'Ambattur (HQ), Mahindra World City (SEZ, exports), Oragadam (e-compressors, ESC, ECUs), Jamshedpur, Lucknow, Pantnagar; a proving ground with ABS/ESC tracks near Chennai'],
      ['People', '5,560+ in all; 1,999 permanent employees on the company\'s rolls; 1,100+ engineers in the global engineering and software centres'],
      ['Distribution', '~550 aftermarket dealers/distributors, ~270 authorised service partners, 6,000+ retailers, 1,800+ fleets reached'],
      ['Parent links', `Royalty ₹${n0(RP.royalty)} cr (2.5% of revenue), IT support from ZF AG ₹${n0(RP.itFromZfAg)} cr, purchases from the group ~₹${n0(RP.purchasesFromGroupAll)} cr; all at cost-plus or licence terms`],
    ], source: 'Analyst-meet presentation (21-Sep-2026); AR FY26; Q4FY26 call' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From TVS brakes division to a ZF subsidiary; the parent has been selling down since 2024',
  blocks: [
    { p: 'The company began as the brakes division of Sundaram-Clayton in 1962, using WABCO technology, and became a separately listed WABCO subsidiary. ZF bought WABCO worldwide in 2020 and renamed the Indian company in 2022. Two things since then matter for valuation. First, the parent has reduced its stake from 75% to 60% in three steps (Jun-2024, Dec-2024, Jun-2025), adding supply to a once-illiquid stock. Second, the 5:1 bonus of Jun-2026 multiplied the share count by six: every per-share number in this report is on the new basis (FY26 EPS ₹45.4, not ₹272.7).' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Impact on the numbers'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.what), rup(h.impact)]), source: 'AR FY26 (directors\' report, secretarial audit, note 10); analyst-meet presentation p13; Screener.in shareholding' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Trucks: +16.6% in FY26 after the GST cut; regulation adds ESC and ADAS from Oct-2027; electric buses need new air systems',
  blocks: [
    { p: `India produced ${PR.fy26CvK}k trucks and buses above 6 tonnes in FY26 (+${PR.fy26GrowthPct}%), ending with a record ${PR.q4fy26CvK}k in Q4 (+${PR.q4fy26GrowthPct}%). Q1FY27 grew ${PR.q1fy27GrowthPct}%, and July production ran at ${PR.julyMonthlyK}k vehicles, about 10,000 above a typical July. This is a deeply cyclical market: production halved in FY20-21 when the BS-VI rules raised truck prices and Covid stopped freight. Exports depend on a different cycle: ${PR.usEuQ1FY27}.` },
    { exhibit: { type: 'table', title: 'Regulation: where ZF CV India\'s content comes from', head: ['Rule', 'What it requires', 'What it means for ZF CV India'], wide: [1, 2], rows: I.regulation.map(r => r.map(rup)), source: 'Q4FY26 and Q1FY27 calls; Q4FY26 presentation p14; analyst-meet presentation p31 (regulations roadmap)' } },
    { pair: [
      { type: 'column', title: 'Electric bus sales: 147 in FY19, 4,993 in FY26', unit: 'Electric buses sold in India', x: Object.keys(PR.evBuses), series: [{ name: 'EV buses', values: Object.values(PR.evBuses), fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p15' },
      { type: 'column', title: 'Trucks and buses >6t: 397k to 463k in FY26', unit: 'Production (thousand vehicles)', x: ['FY25', 'FY26'], series: [{ name: 'Production', values: [PR.fy25CvK, PR.fy26CvK], fmt: 'num' }], labels: 'all', source: 'Q4FY26 call (15-May-2026)' },
    ] },
    { bullets: [
      `**Electrification.** ${rup(I.ev)}`,
      '**Pre-buying.** A rule that raises truck prices can pull demand forward and leave a gap after it: around the BS-VI switch of Apr-2020 ZF CV India\'s revenue fell 32% (FY20, with Covid on top). The Oct-2027 ESC/ADAS rule and BS-VII (2028/29, not final) could do the same.',
      '**Exports.** US truck production fell through FY26 under tariffs (Americas −22% for ZF CV in Q4FY26); Europe grew. Management sees "an increase in the trend" but a ~20% gap to the volumes of two years ago.',
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the safety-regulation tailwind reach ZF CV India? Yes, more directly than for almost any other listed supplier',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach ZF CV India?', 'Catch'], wide: [1, 3], rows: [
      ['Truck upcycle (GST cut, infrastructure, replacement)', 'Production +16.6% in FY26, +8.4% in Q1FY27', 'Yes: OEM +17.5% in FY26, +8.6% in Q1FY27', 'Cyclical: the base is high from Q4FY27; FY20-21 showed how fast it reverses'],
      ['ESC/ADAS mandate (Oct-2027)', 'Rule set for all vehicles >6t; bus ESC already live since Sep-2025', 'Yes for ESC: three OEM nominations, "majority position"', 'ADAS/AEBS can be bought elsewhere; content per vehicle not disclosed; localisation needed to protect margin'],
      ['Electric buses', 'EV buses 4,993 in FY26 (34x FY19)', 'Yes: e-compressors, EBS, ECAS, doors (Tata Motors localisation award)', 'Small volumes; electric trucks are still pilots'],
      ['"China plus one" sourcing by the parent', 'Services +11% (FY26), +12.5% (Q1FY27); new export programmes', 'Partly: volume comes, but at cost-plus prices', 'Exports −11% in FY26; the parent decides what moves to India and at what margin'],
    ], source: 'Company calls and presentations (May, Jul, Sep-2026); AR FY26; GAM Research' } },
    { callout: '**Verdict:** the regulation tailwind is real and lands squarely on ZF CV India: it is the incumbent in exactly the systems the 2027 rules require, and it has the test track and nominations to prove it. The catch is timing and cycle. The content step comes in H2FY28, on top of a truck cycle that has already run for two years, and the export and services half of the business grows at the parent\'s pace and margin, not India\'s.' },
  ],
};

module.exports = { business, history, industry, tailwind };
