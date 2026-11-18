// Rainbow report, part 3: hospital KPIs (beds, occupancy, ARPOB), mature vs new hospitals, expansion pipeline, moat.
const X = require('./RAINBOW.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, SRC, SQ, QL, Q1, AK, BL, YRS, coreBeds, coreOcc, coreArpob } = X;
const MN = C.matureNewAnnual, MQ = C.q1fy27;

const hospitals = {
  id: 'hospitals', nav: 'Beds, occupancy & ARPOB', kicker: 'Operating KPIs', title: 'Revenue = beds × occupancy × ARPOB: beds are up, ARPOB is up, occupancy is down',
  blocks: [
    { p: `Hospital revenue is the product of three numbers: **operational beds**, **occupancy** (the share of beds filled each night) and **ARPOB** (average revenue per occupied bed-day; Rainbow includes outpatient and pharmacy revenue, so it is total revenue ÷ occupied bed-days). From FY23 to FY26 weighted operational beds rose 41% (1,186 → 1,677) and ARPOB 23% (₹48,932 → ₹60,141), but occupancy fell from 55.4% to 46.3%, so revenue grew 45% rather than ~70%. ARPOB has risen because the case mix moved to sicker children and more complex procedures, fertility grew, and average stays shortened (2.76 → 2.71 days; 2.60 in Q1FY27). Occupancy fell because new hospitals start nearly empty and because FY25-26 had weak infection seasons.` },
    { pair: [
      { type: 'column', title: 'Operational beds rose 41% in three years', unit: 'Weighted-average operational beds', x: AK.map(k => k.fy), series: [{ name: 'Operational beds', values: AK.map(k => k.opBedsAvg), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'line', title: 'Quarterly ARPOB: rising, highest in the off-season Q1', unit: 'ARPOB (₹ per occupied bed-day)', x: QL, series: [{ name: 'ARPOB', values: SQ.map(q => q.arpob), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
    ] },
    { exhibit: { type: 'table', title: 'The revenue identity, checked', head: ['', 'FY23', 'FY24', 'FY25', 'FY26'], rows: [
      ['Weighted operational beds', ...AK.slice(1).map(k => n0(k.opBedsAvg))],
      ['× 365 days × occupancy', ...AK.slice(1).map(k => `${n1(k.occupancyPct)}%`)],
      ['= occupied bed-days (\'000)', ...AK.slice(1).map(k => n0(k.opBedsAvg * 365 * k.occupancyPct / 100 / 1000))],
      ['× ARPOB (₹)', ...AK.slice(1).map(k => n0(k.arpob))],
      { hl: true, cells: ['**= revenue (₹ cr)**', ...AK.slice(1).map(k => `**${n0(k.opBedsAvg * 365 * k.occupancyPct / 100 * k.arpob / 1e7)}**`)] },
      ['Reported revenue (₹ cr)', ...AK.slice(1).map(k => n0(A.sales[A.labels.indexOf(k.fy)]))],
    ], source: 'Company KPIs (definitions in the decks); Screener.in revenue; GAM Research' } },
    { callout: `**What would move the numbers:** each 1pp of occupancy on ~1,900 operational beds is ~6,900 bed-days, or ~₹45 cr of revenue at FY27E ARPOB. Management's 56-58% occupancy target on today's beds would add ~₹500 cr a year of revenue to our FY27E (~46% on the existing hospitals), without new capex. That is the upside case for the existing network; our forecasts reach ~50% on the existing hospitals by FY29E.` },
  ],
};

const matureNew = {
  id: 'maturenew', nav: 'Mature vs new hospitals', kicker: 'Hospital cohorts', title: 'Mature hospitals earn more per bed and fill better; new ones take years to catch up',
  blocks: [
    { p: `Rainbow splits its network into **mature** hospitals (operating for 5+ years; from FY27 this includes Visakhapatnam and Hebbal: 1,550 capacity and 1,202 operational beds) and **new** hospitals (10 units under five years old, incl. the acquired Warangal and Guwahati: 885 capacity, 660 operational). In Q1FY27 mature hospitals ran at ${MQ.mature.occupancyPct.toFixed(1)}% occupancy and ₹${n0(MQ.mature.arpob)} ARPOB, new ones at ${MQ.newUnits.occupancyPct}% and ₹${n0(MQ.newUnits.arpob)}. The company does not disclose EBITDA by cohort; it says greenfield hospitals take 12-18 months to break even (Rajahmundry is at breakeven, Electronic City close, HRBR loss-making), acquired ones were profitable from the start (Guwahati near the group margin), and the margin pressure from ~40% more beds in two years is "temporary".` },
    { exhibit: { type: 'table', title: 'Mature vs new hospitals', head: ['', 'Beds (operational)', 'Occupancy', 'ARPOB (₹)', 'ALOS (days)'], rows: [
      { sec: 'FY26 definition (Q4FY26 deck)' },
      ['Mature FY25', n0(MN[0].matureOp), `${MN[0].matureOccPct}%`, n0(MN[0].matureArpob), '2.89'],
      ['Mature FY26', n0(MN[1].matureOp), `${MN[1].matureOccPct.toFixed(1)}%`, n0(MN[1].matureArpob), '2.73'],
      ['New FY25', n0(MN[0].newOp), `${MN[0].newOccPct}%`, n0(MN[0].newArpob), '2.74'],
      ['New FY26', n0(MN[1].newOp), `${MN[1].newOccPct}%`, n0(MN[1].newArpob), '2.66'],
      { sec: 'FY27 definition (Q1FY27 deck)' },
      ['Mature Q1FY26 → Q1FY27', n0(MQ.mature.operationalBeds), `${MQ.mature.occupancyPriorPct.toFixed(1)}% → ${MQ.mature.occupancyPct.toFixed(1)}%`, `${n0(MQ.mature.arpobPrior)} → ${n0(MQ.mature.arpob)}`, `${MQ.mature.alosPrior.toFixed(2)} → ${MQ.mature.alos.toFixed(2)}`],
      ['New Q1FY26 → Q1FY27', `${MQ.newUnits.operationalPrior} → ${MQ.newUnits.operationalBeds}`, `${MQ.newUnits.occupancyPriorPct}% → ${MQ.newUnits.occupancyPct}%`, `${n0(MQ.newUnits.arpobPrior)} → ${n0(MQ.newUnits.arpob)}`, `${MQ.newUnits.alosPrior.toFixed(2)} → ${MQ.newUnits.alos.toFixed(2)}`],
    ], source: 'Q4FY26 presentation p.26; Q1FY27 presentation p.19 (values read from charts and checked against revenue)' } },
    { pair: [
      { type: 'column', title: 'Mature hospitals: occupancy fell in FY26, recovered in Q1FY27', unit: 'Occupancy (%)', x: ['FY25*', 'FY26*', 'Q1FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Mature', values: [MN[0].matureOccPct, MN[1].matureOccPct, MQ.mature.occupancyPriorPct, MQ.mature.occupancyQ4Pct, MQ.mature.occupancyPct], fmt: 'pct' }, { name: 'New', values: [MN[0].newOccPct, MN[1].newOccPct, MQ.newUnits.occupancyPriorPct, MQ.newUnits.occupancyQ4Pct, MQ.newUnits.occupancyPct], fmt: 'pct' }], labels: 'none', source: 'Company presentations (* FY26 definition of mature)' },
      { type: 'column', title: 'The ARPOB gap: ~₹11,500 per bed-day', unit: 'ARPOB (₹)', x: ['FY25*', 'FY26*', 'Q1FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Mature', values: [MN[0].matureArpob, MN[1].matureArpob, MQ.mature.arpobPrior, MQ.mature.arpobQ4, MQ.mature.arpob], fmt: 'num' }, { name: 'New', values: [MN[0].newArpob, MN[1].newArpob, MQ.newUnits.arpobPrior, MQ.newUnits.arpobQ4, MQ.newUnits.arpob], fmt: 'num' }], labels: 'none', source: 'Company presentations' },
    ] },
    { callout: '**Our view:** the cohort data show the model works: new hospitals do climb (occupancy +3.3pp in a year) and mature hospitals reprice (+10% ARPOB in Q1FY27, price plus mix). But it is slow: the new cohort averaged only 37.8% occupancy in FY26 (36.8% in FY25). With 1,200 more beds coming, the new cohort will stay a third or more of the network until FY30, which caps group occupancy and margins.' },
  ],
};

const PL = C.pipeline;
const shortOf = p => (/^Gurugram/.test(p.project) ? p.project.split(' ').slice(0, 3).join(' ') : p.project.split(/[ ,(]/)[0]);
const pipeRev = (p, y) => { const k = Object.keys(BL.pipeline[y]).find(x => x.startsWith(shortOf(p))); return k ? BL.pipeline[y][k] : '–'; };
const expansion = {
  id: 'expansion', nav: 'Expansion pipeline', kicker: 'Growth plan', title: 'The next 1,200 beds: Mumbai, Gurugram, Pune, Indore and more of the South',
  blocks: [
    { p: `On 31-Jul-2026 management set out its biggest plan yet: ~2,500 more beds over five years (to ~5,000) for ~₹2,200 cr, all from internal cash, with ~1,200 beds already "visible". About 70% of the new beds go to markets where Rainbow is new or small (Delhi NCR, North and Central India, Mumbai); 30% to the South. Five hubs anchor the network: Hyderabad, Bengaluru, Chennai, Gurugram and Guwahati. Three deals were announced the day before the Q1 call: a 100-bed brownfield hospital in Malad, Mumbai (a JV with three doctor-promoters), the 70-bed Prime Children's Hospital in Nellore (plus a 30-bed maternal block) and a 50-bed leased hospital in Guntur. Coimbatore has already slipped from end-FY27 to H2FY28.` },
    { exhibit: { type: 'table', title: 'Pipeline and our revenue assumptions', head: ['Project', 'Beds', 'Timing (management)', 'Type', 'GAM revenue FY27E / FY28E / FY29E (₹ cr)'], wide: [0, 2], rows: PL.map(p => [p.project, n0(p.beds), p.timing, p.type, YRS.map(y => pipeRev(p, y)).join(' / ')]), source: 'Q1FY27 presentation p.24 and call (31-Jul-2026); Q4FY26 call; GAM estimates (assumptions.json)' } },
    { pair: [
      { type: 'column', title: 'Capacity plan: 2,565 → 3,725 beds by FY29 (company)', unit: 'Capacity beds incl. Madhukar\'s 130 (company plan, end of year)', x: ['Now', 'FY27', 'FY28', 'FY29'], series: [{ name: 'Beds', values: [2565, 2710, 3095, 3725], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation p.24 (+145, +385, +630)' },
      { type: 'stacked', title: 'Our build: pipeline is 14% of revenue by FY29E', unit: 'Revenue by hospital cohort (₹ crore)', x: YRS, series: [{ name: 'Mature hospitals', values: X.matF.map(Math.round), fmt: 'num' }, { name: 'New hospitals', values: X.newF.map(Math.round), fmt: 'num' }, { name: 'Pipeline', values: X.pipeF, fmt: 'num' }], minLabel: 40, source: 'GAM estimates; sums to model revenue' },
    ] },
    { callout: `**Our view:** this is a different company from the one that listed in 2022: from a South Indian hub-and-spoke operator to a national chain entering expensive metros where doctors cost more and brands are unknown. Capex at ₹65-70 lakh a bed (spokes) is reasonable, and leasing keeps the upfront cost low. The risks are execution (four new states at once), slower ramp-ups and, in Gurugram, building a 325-bed hub on owned land. We assume slow ramps: pipeline hospitals contribute ₹${X.pipeF[2]} cr in FY29E (~${Math.round(X.pipeF[2] / F.sales[2] * 100)}% of revenue).` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real but regional moat, built on doctors and density',
  blocks: [
    { verdicts: [...D.moat.map(r => r.map(rup))], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** Rainbow has a genuine moat in Hyderabad and Bengaluru: no other operator has built dedicated paediatric super-specialty networks of this depth, and the full-time doctor model and NICU/PICU capability are slow to copy. The moat is **local, not national**: it took Rainbow years to reach decent occupancy in Chennai ("some dip three years ago", CMD) and its Delhi presence after nine years is 24 beds of its own. The new markets have to be won from scratch against large multi-specialty chains with paediatric departments. And the moat protects **quality and price**, not **occupancy**: with births falling, filling beds depends on taking share.' },
  ],
};

module.exports = { hospitals, matureNew, expansion, moat };
