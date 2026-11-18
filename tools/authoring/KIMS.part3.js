// KIMS report, part 3: clusters and KPIs (beds, occupancy, ARPOB), new vs mature hospitals, expansion pipeline, moat.
const X = require('./KIMS.ctx');
const { C, D, F, A, n0, n1, rup, SRC, SA, SQ, QL, Q1, AK, BL, CLN, clRev, YRS, SU, grpBeds, grpOccPct, grpArpob } = X;
const fy26 = SA.find(r => r.fy === 'FY26'), fy25 = SA.find(r => r.fy === 'FY25'), q1 = SQ.at(-1);
const KEY = { Telangana: 'ts', 'Andhra Pradesh': 'ap', Maharashtra: 'mh', Kerala: 'kl', Karnataka: 'ka' };
const mg = (r, c) => (r[`${KEY[c]}Rev`] ? `${n1(r[`${KEY[c]}Ebitda`] / r[`${KEY[c]}Rev`] * 100)}%` : '–');
const DECK = { // cluster KPIs FY26 and Q1FY27 (company decks): operational beds, occupancy %, ARPOB
  Telangana: [1694, 52.5, 69450, 2144, 41.1, 77009], 'Andhra Pradesh': [1840, 54.8, 25595, 1909, 59.4, 25448], Maharashtra: [637, 52.1, 39402, 637, 58.6, 44182],
  Kerala: [401, 39.8, 29063, 609, 46.0, 30125], Karnataka: [280, 21.6, 85320, 340, 27.6, 92793] };
const qId = (c, i) => DECK[c][3] * 91 * DECK[c][4] / 100 * DECK[c][5] / 1e7;

const hospitals = {
  id: 'hospitals', nav: 'Clusters, beds & ARPOB', kicker: 'Operating KPIs', title: 'Five clusters, two of them earning the money: Telangana and Andhra make all the EBITDA',
  blocks: [
    { p: `Hospital revenue is operational beds × occupancy × ARPOB (revenue per occupied bed-day, which at KIMS includes outpatient and pharmacy revenue). The five clusters are very different businesses. **Telangana** (Hyderabad: Secunderabad, Kondapur, the two Sunshine hospitals) charges ~₹77,000 a bed-day and earns ~30%. **Andhra Pradesh** (eight hospitals in smaller towns) charges only ~₹25,000 and still earns 21-25%, the cheapest tertiary care in the listed sector. **Maharashtra** (Nagpur, Nashik, Thane), **Kerala** (Kannur, Kollam, Palakkad) and **Karnataka** (two Bengaluru hospitals) are 1-4 years old and earned nothing between them in FY26 (−₹88 cr of EBITDA).` },
    { exhibit: { type: 'table', title: 'Clusters: beds, occupancy, price and margin', head: ['Cluster', 'Operational beds FY26 → Q1FY27', 'Occupancy FY26 → Q1FY27', 'ARPOB (₹) FY26 → Q1FY27', 'Revenue FY26 (₹ cr)', 'EBITDA margin FY25 / FY26 / Q1FY27'], rows: [
      ...CLN.map(c => [`**${c}**`, `${n0(DECK[c][0])} → ${n0(DECK[c][3])}`, `${DECK[c][1]}% → ${DECK[c][4]}%`, `${n0(DECK[c][2])} → ${n0(DECK[c][5])}`, n0(fy26[`${KEY[c]}Rev`]), `${mg(fy25, c)} / ${mg(fy26, c)} / ${mg(q1, c)}`]),
      { hl: true, cells: ['**Group**', `**${n0(AK.at(-1).opBeds)} → ${n0(Q1.operationalBeds)}**`, `**${AK.at(-1).occupancyPct}% → ${Q1.occupancyPct}%**`, `**${n0(AK.at(-1).arpob)} → ${n0(Q1.arpob)}**`, '**3,931 (total income)**', '**26.6% / 21.1% / 20.1% (company basis)**'] },
    ], source: 'Q4FY26 and Q1FY27 presentations (company EBITDA includes other income); Telangana Q1FY27 includes ~450 new Kondapur beds open for 10 days' } },
    { pair: [
      { type: 'line', title: 'Quarterly margins: Telangana ~30%, Andhra ~22-27%, Maharashtra and Kerala climbing out of losses', unit: 'Cluster EBITDA margin, company basis (%)', x: QL.slice(4), series: [['Telangana', 'ts'], ['Andhra Pradesh', 'ap'], ['Maharashtra', 'mh'], ['Kerala', 'kl']].map(([n, kk]) => ({ name: n, values: SQ.slice(4).map(q => (q[`${kk}Rev`] > 5 ? Math.round(q[`${kk}Ebitda`] / q[`${kk}Rev`] * 1000) / 10 : null)), fmt: 'pct' })), labels: 'last', min: -20, max: 40, source: 'Company presentations. Karnataka (not shown): −76% in Q3FY26, −61% in Q4FY26, −24% in Q1FY27' },
      { type: 'line', title: 'Group occupancy ~49-53% as beds keep being added; ARPOB +23% in two years', unit: 'Occupancy (%, left) and ARPOB (₹ \'000, right)', x: QL, series: [{ name: 'Occupancy %', values: SQ.map(q => q.occupancyPct), fmt: 'pct' }, { name: 'ARPOB ₹\'000', values: SQ.map(q => Math.round(q.arpob / 100) / 10), fmt: 'n1' }], labels: 'last', source: 'Company presentations (operational beds redefined in FY25)' },
    ] },
    { exhibit: { type: 'table', title: 'The revenue identity, checked (Q1FY27, 91 days)', head: ['Cluster', 'Operational beds', '× occupancy', '× ARPOB (₹)', '= revenue (₹ cr)', 'Reported revenue (₹ cr)'], rows: [
      ...CLN.map(c => [c, n0(DECK[c][3]), `${DECK[c][4]}%`, n0(DECK[c][5]), n1(qId(c)), n1(q1[`${KEY[c]}Rev`])]),
      { hl: true, cells: ['**Total**', `**${n0(Q1.operationalBeds)}**`, `**${Q1.occupancyPct}%**`, `**${n0(Q1.arpob)}**`, `**${n0(CLN.reduce((s, c) => s + qId(c), 0))}**`, '**1,196 total income; 1,180 revenue from operations**'] },
    ], source: 'Q1FY27 presentation pp.20-23; GAM Research. Cluster revenue includes a little other income; O&M fees and intercompany eliminations explain the rest.' } },
    { callout: `**What would move the numbers:** each 1pp of group occupancy on ~5,800 operational beds is ~58 occupied beds, or ~₹100 cr of revenue at FY27E ARPOB. Management's claim that Telangana's like-for-like occupancy is already 61-65% matters: the reported 41% in Q1FY27 is the enlarged Kondapur hospital starting nearly empty. Our build has group occupancy at ${n1(grpOccPct[0])}% / ${n1(grpOccPct[1])}% / ${n1(grpOccPct[2])}% in FY27-29E on ${n0(grpBeds[0])} / ${n0(grpBeds[1])} / ${n0(grpBeds[2])} operational beds; management talks of 65-70% by FY30 if no beds are added.` },
  ],
};

const NU = C.newUnits, UR = C.unitRamp;
const matureNew = {
  id: 'maturenew', nav: 'New vs mature hospitals', kicker: 'Hospital cohorts', title: 'The new hospitals cost ₹128 cr of EBITDA in FY26; Q1FY27 shows them turning, one by one',
  blocks: [
    { p: `This is the central question for KIMS. In FY26 its mature hospitals earned ₹${NU.fy26.matureEbitdaCr} cr of EBITDA on ₹${n0(NU.fy26.matureRevenueCr)} cr of revenue (~29%), while units in their first year lost ₹${-NU.fy26.ebitdaCr} cr on ₹${NU.fy26.revenueCr} cr (FY25: −₹${n1(-NU.fy25.ebitdaCr)} cr). Without those losses FY26 EBITDA would have been ~₹${n0(X.adjEb26)} cr, up 19% rather than 3%. The good news in Q1FY27: Nashik broke even, Mahadevapura (Bengaluru) was EBITDA-positive from June, Vizag QNRI (acquired loss-making in 2024) reached a ~16% margin and Kerala made money. The bad news: Electronic City still lost ~₹18 cr in the quarter, Thane ~₹7 cr, and the 787-bed Kondapur hospital and Thrissur start the cycle again.` },
    { exhibit: { type: 'table', title: 'New hospitals, quarter by quarter (₹ crore; Q1FY26 | Q4FY26 | Q1FY27)', head: ['Unit', 'Revenue', 'EBITDA', 'What management said (Aug-2026)'], wide: [3], rows: UR.map(u => [u.unit, u.revCr.map(v => (v == null ? '–' : n1(v))).join(' | '), u.ebitdaCr.map(v => (v == null ? '–' : n1(v))).join(' | '), u.note]), source: rup(C.unitRampNote) } },
    { pair: [
      { type: 'column', title: 'Start-up losses: ₹18 cr (FY25), ₹128 cr (FY26); we assume ₹60 cr in FY27E', unit: 'EBITDA lost in new units (₹ crore); FY27-29E = GAM estimates', x: ['FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Start-up losses', values: [SU.FY25, SU.FY26, SU.FY27E, SU.FY28E, SU.FY29E], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Q4FY25 and Q4FY26 calls (company definition: units under one year old); GAM estimates' },
      { type: 'column', title: 'Bengaluru: revenue up, losses halved in a quarter', unit: 'Karnataka cluster (₹ crore)', x: QL.slice(-3), series: [{ name: 'Revenue', values: SQ.slice(-3).map(q => q.kaRev), fmt: 'num' }, { name: 'EBITDA', values: SQ.slice(-3).map(q => q.kaEbitda), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
    ] },
    { callout: '**Our view:** the record of the last two years is mixed but improving: Nashik took about two years to break even, Mahadevapura 7-9 months, Thane longer than promised because insurers were slow to empanel it and Maharashtra doctors join part-time first. Management\'s FY27 promise (Bengaluru cluster EBITDA-neutral for the year) needs Electronic City to break even by the second half. We assume new-unit losses roughly halve in FY27 (₹60 cr) and fall to ₹25-30 cr a year after that, with new openings replacing the old.' },
  ],
};

const PL_ = C.pipeline;
const expansion = {
  id: 'expansion', nav: 'Expansion pipeline', kicker: 'Growth plan', title: 'Pipeline: fill the beds already built, then O&M and a new round of greenfields',
  blocks: [
    { p: 'After adding ~3,500 beds in two and a half years, KIMS says the next eight months are about stabilising what it has built: filling the 787-bed Kondapur hospital (₹45 cr in July versus ₹32-33 cr a month at the old site; potential ~₹100 cr a month in 4-5 years), finishing the Secunderabad replacement block (end-CY27) and Rajahmundry II, and opening Thrissur under an O&M contract. It is also growing asset-light: in Aug-Sep 2026 it signed O&M agreements for Arete Hospital in Gachibowli (250 beds) and a 183-bed hospital in Kakinada, both for 9% of revenue, with options to buy later. New greenfield projects are likely to be announced in FY28, only in its existing states (plus one hospital in Chennai).' },
    { exhibit: { type: 'table', title: 'Pipeline and timing (as disclosed by 30-Sep-2026)', head: ['Project', 'Beds', 'Timing', 'Structure'], wide: [0, 2], rows: PL_.map(p => [p.project, n0(p.beds), p.timing, p.type]), source: rup(C.pipelineSrc) } },
    { pair: [
      { type: 'stacked', title: 'Our build: Telangana still half of revenue in FY29E', unit: 'Revenue by cluster (₹ crore), GAM estimates', x: YRS, series: [...CLN.slice(0, 3).map(c => ({ name: c, values: clRev[c].map(Math.round), fmt: 'num' })), { name: 'Kerala + Karnataka', values: YRS.map((_, i) => Math.round(clRev.Kerala[i] + clRev.Karnataka[i])), fmt: 'num' }], minLabel: 120, source: 'GAM estimates (assumptions.json businessLines); before O&M fees and eliminations (−₹22-25 cr a year)' },
      { type: 'column', title: 'Operational beds in our build: +20% by FY29E, no new acquisitions', unit: 'Average operational beds (GAM estimates; FY26 = company)', x: ['FY26', ...YRS], series: [{ name: 'Operational beds', values: [AK.at(-1).opBeds, ...grpBeds], fmt: 'num' }], labels: 'all', source: 'Company; GAM estimates' },
    ] },
    { callout: `**Our view:** the beds are mostly built, which is why the next two years should show operating leverage rather than more losses. The risk is that KIMS starts the next cycle before this one pays back: management has said operating cash will go to greenfields, and the 2026 O&M deals carry call options that become acquisitions. Our forecasts include none of these; ARPOB in our build rises to ₹${n0(grpArpob[2])} by FY29E (+${Math.round((grpArpob[2] / Q1.arpob - 1) * 100)}% on Q1FY27), mostly from mix (Bengaluru, Kondapur oncology and transplants).` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real regional moat in the Telugu states, unproven elsewhere',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** in Telangana and Andhra Pradesh KIMS has a genuine advantage: dense networks, doctor loyalty built through equity partnerships, and a cost structure that earns 25-30% margins at prices well below the metro chains. That moat does **not** travel automatically. In Bengaluru, Thane and Kerala KIMS is a new entrant competing against established chains, and FY26 showed it lacks bargaining power with insurers for new hospitals. The low-price model is also a ceiling: KIMS\'s ARPOB is about half that of the metro-focused chains, so its margin upside comes from filling beds, not from price.' },
  ],
};

module.exports = { hospitals, matureNew, expansion, moat };
