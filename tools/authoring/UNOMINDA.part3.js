// Uno Minda report, part 3: divisions (switches and lighting; castings; Green Mobility, seating and others), JVs and
// minorities, and the moat.
const X = require('./UNOMINDA.ctx');
const { C, D, SA, SQ, QL, BL, bld, F, n0, n1, pc, pc1, DIVN, divCagr, oiB, jvShareOfPat } = X;
const Q1 = C.q1fy27, JV = C.jv, NCI = C.nci, A26 = SA.find(a => a.fy === 'FY26'), A25 = SA.find(a => a.fy === 'FY25');
const qcol = (k, t) => ({ type: 'column', title: t, unit: `${DIVN[k]} revenue per quarter (₹ crore)`, x: QL, series: [{ name: DIVN[k], values: SQ.map(q => q[k]), fmt: 'num' }], labels: 'all', source: 'Q4FY26 and Q1FY27 presentations (Q1FY26 excludes prior-period income)' });
const buildRows = keys => keys.flatMap(k => [[`**${DIVN[k]}**`, n0(A26[k]), ...bld.map(r => n0(r[k]))], ['  growth', pc1((A26[k] / A25[k] - 1) * 100), ...BL.growth[k].map(g => pc1(g))]]);

const core = {
  id: 'core', nav: 'Switches & lighting', kicker: 'Divisions: Switches and Lighting', title: 'Switches and lighting: 47% of revenue, steady mid-teens growth, the core of the franchise',
  blocks: [
    { p: `**Switches** (₹${n0(A26.switches)} cr in FY26, +${n1((A26.switches / A25.switches - 1) * 100)}%) is the largest division. In two-wheelers Uno Minda is the leading handlebar-switch supplier, growing with domestic volumes, share gains at "under-penetrated" customers and exports (2W switch exports crossed ₹280 cr in FY26; ₹95 cr in Q1FY27). In cars it sells through Uno Mindarika (51%; Tokai Rika 49%), which grew 24% to ₹525 cr in Q1FY27 and is moving from Manesar to a larger plant at Farrukhnagar (₹116 cr, Q3FY27) because it is capacity-constrained. **Lighting** (₹${n0(A26.lighting)} cr, +14%) is led by two-wheelers, where Uno Minda supplies most electric-scooter makers and won a ~₹450 cr peak-value order for unserved models (SOP H2FY28, ~25% of current 2W lighting revenue). Four-wheeler lighting tripled in five years and is now "in consolidation"; a new global OEM nominated it in Q1FY27 and ambient lighting is gaining orders. Lighting grew only 14% in Q1FY27, the slowest division.` },
    { pair: [qcol('switches', 'Switches: ₹1,111 cr to ₹1,335 cr a quarter in a year'), qcol('lighting', 'Lighting: flat for three quarters at ~₹1,150 cr')] },
    { exhibit: { type: 'table', title: 'Our build: Switches and Lighting (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: buildRows(['switches', 'lighting']), source: 'Company (FY26); GAM estimates (assumptions.json "build")' } },
    { callout: `**Our view:** both are good, mature businesses that grow with volumes plus share and content: we model ${divCagr('switches').toFixed(0)}% and ${divCagr('lighting').toFixed(0)}% a year to FY29E. Lighting is where competition from other lighting specialists is fiercest, especially in cars, and where the new 2W order and the global OEM matter most; a flat run-rate since Q2FY26 is the thing to watch.` },
  ],
};

const castings = {
  id: 'castings', nav: 'Castings (alloy wheels)', kicker: 'Division: Castings', title: 'Castings: the capital-hungry growth engine; alloy-wheel capacity nearly doubles',
  blocks: [
    { p: `Castings earned ₹${n0(A26.castings)} cr in FY26 (+15%): 4W alloy wheels ₹${n0(A26.castingsSplit.aw4w)} cr, 2W alloy wheels ₹${n0(A26.castingsSplit.aw2w)} cr and aluminium die casting ₹${n0(A26.castingsSplit.dieCasting)} cr. FY26 was held back by lower alloy-wheel penetration (fast-growing entry cars use steel wheels; some 2W programmes switched to steel); growth came from new capacity and aluminium prices (pass-through added ~4-5 points in Q4). Q1FY27 was the fastest-growing division at +32% to ₹1,090 cr (4W wheels ₹566 cr, 2W wheels ₹284 cr, die casting ₹248 cr, +66%). Management says penetration is "inching up again" and that castings earn above the company average because they need more capital. Capacity is the story: Kharkhoda (₹542 cr, 120k 4W wheels a month: 60k running, 30k more in H2FY27), Bawal 2W (₹196 cr, ~1 mn wheels a year, HPDC, H2FY27), CSN 4W (₹792 cr, 1.8 mn wheels a year, Phase 1 Q2FY28) and EV castings at CSN (₹210 cr): ~9.5 mn 2W and ~7 mn 4W wheels a year once all are built.` },
    { pair: [
      qcol('castings', 'Castings: +32% in Q1FY27 to ₹1,090 cr'),
      { type: 'column', title: 'Castings mix, FY26: 4W wheels are 53%', unit: 'FY26 revenue (₹ crore)', x: ['4W alloy wheels', '2W alloy wheels', 'Die casting'], series: [{ name: 'Revenue', values: [A26.castingsSplit.aw4w, A26.castingsSplit.aw2w, A26.castingsSplit.dieCasting], fmt: 'num' }], labels: 'all', source: 'Q4FY26 call (18-May-2026)' },
    ] },
    { exhibit: { type: 'table', title: 'Our build: Castings (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: buildRows(['castings']), source: 'Company (FY26); GAM estimates' } },
    { callout: `**Our view:** we model ${BL.growth.castings.join('% / ')}%, the fastest of the core divisions, as Kharkhoda and Bawal ramp and CSN starts. The risks are utilisation (penetration is a customer choice, not a rule) and aluminium: higher prices lift revenue but not profit, and at-cost pass-through lowers the margin percentage.` },
  ],
};

const newbiz = {
  id: 'newbiz', nav: 'EV, seating & others', kicker: 'Divisions: Green Mobility, Seating, Others', title: 'The new legs: EV and CNG +78%, seating +28%, sunroofs and sensors coming',
  blocks: [
    { p: `**Green Mobility** (₹${n0(A26.greenMobility)} cr in FY26, ₹542 cr in Q1FY27 alone) was carved out in Q4FY26: alternate fuel/CNG (Minda Westport, ₹592 cr in FY26, ₹184 cr in Q1), 2W/3W EV systems (chargers, DC-DC converters, motors; ₹501 cr in FY26, ₹186 cr in Q1, +130%) and the 4W EV business (UMAI: electric drive units, ₹123 cr in Q1, partly traded from Inovance until Khed starts in H2FY27). A second EV plant at CSN (₹549 cr, Q2FY28) will add hybrid transmissions with a customer. Management sees ₹2,500-3,000 cr of peak revenue from ~₹1,200 cr of EV capex; new businesses reach target margins "in the third full year of production". **Seating** (₹${n0(A26.seating)} cr, +23%) adds ~₹390 cr of peak-value export orders (Europe, North America; end-FY28 into FY29) and, after five years of trying, a passenger-car seating plant (₹320 cr, SOP Q4FY28, kit value ₹30,000-40,000 a car). **Others** (₹${n0(A26.others)} cr, +26%) holds sensors and ADAS (₹250 cr in Q1), acoustics (₹225 cr), blow moulding, controllers, the aftermarket and EMS; a sunroof plant (with Aisin technology) starts at end-FY27 with >₹500 cr of orders.` },
    { pair: [qcol('greenMobility', 'Green Mobility: ₹305 cr to ₹542 cr a quarter in a year'), qcol('seating', 'Seating: +28% in Q1FY27')] },
    { exhibit: { type: 'table', title: 'Our build: the newer divisions (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: buildRows(['greenMobility', 'seating', 'others']), source: 'Company (FY26); GAM estimates' } },
    { callout: `**Our view:** these are where most of the upside and most of the execution risk sit. We model Green Mobility at ${BL.growth.greenMobility.join('% / ')}% (₹${n0(bld[2].greenMobility)} cr by FY29E), with the 4W EV ramp the swing factor: China has not yet approved the Inovance JV, EV volumes are "not in our hand" (CFO) and early revenue is partly traded at low margins. We treat seating and sunroof orders as real but back-ended (most of the value lands in FY29).` },
  ],
};

const jv = {
  id: 'jv', nav: 'JVs & minorities', kicker: 'Below EBITDA', title: `JVs add ~${Math.round(jvShareOfPat[0])}% to owners' profit; minorities take ~7% of consolidated profit`,
  blocks: [
    { p: `Uno Minda's share of JV and associate profit rose 38% to ₹${n1(JV.totalFY26)} cr in FY26 (FY25 ₹${n1(JV.totalFY25)} cr), led by Toyoda Gosei Uno Minda (airbags, +61% profit on a new curtain-airbag line and capacity). In Q1FY27 it was flat at ₹${JV.q1fy27} cr: commodity costs not yet recovered, which management expects to bridge "from Q2 onwards". The JVs paid Uno Minda ₹${n0(JV.dividendsReceivedFY26)} cr of dividends in FY26, 55% of its share of their profit. Going the other way, minority partners in consolidated subsidiaries took ₹${n1(NCI.total)} cr of FY26 profit (₹${NCI.q1fy27} cr in Q1FY27), half of it Tokai Rika's 49% of Uno Mindarika.` },
    { exhibit: { type: 'table', title: 'The JVs, FY26 (₹ crore)', head: ['JV', 'Stake', 'Revenue', 'Profit', 'Uno Minda share', 'FY25 share'], rows: [
      ...JV.fy26.map((r, i) => [r[0], r[1] + '%', n0(r[2]), n0(r[3]), n1(r[4]), n1(JV.fy25ShareOfFour[i])]),
      { hl: true, cells: ['**All JVs and associates**', '', '', '', `**${n1(JV.totalFY26)}**`, `**${n1(JV.totalFY25)}**`] },
    ], source: 'AR FY26 consolidated note 44(C)' } },
    { exhibit: { type: 'table', title: 'Minorities, FY26 (₹ crore)', head: ['Subsidiary', 'Minority stake', 'Revenue', 'Profit', 'To minorities'], rows: [
      ...NCI.fy26.map(r => [r[0], r[1] + '%', n0(r[2]), n1(r[3]), n1(r[4])]),
      { hl: true, cells: ['**Total minorities (incl. others)**', '', '', '', `**${n1(NCI.total)}**`] },
    ], source: 'AR FY26 consolidated note 44' } },
    { exhibit: { type: 'table', title: 'How we model them (₹ crore; post-tax)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Share of JV profit', n1(JV.totalFY26), ...oiB.map(r => n0(r.jv))],
      ['Minority interests', n1(NCI.total), ...oiB.map(r => n0(r.mi))],
      ['Recurring other income (pre-tax)', '34', ...oiB.map(r => n0(r.rec))],
      { hl: true, cells: ['**Other income in the model (JV − minorities grossed up for tax, plus recurring)**', '256 (Screener)', ...oiB.map(r => `**${n0(r.model)}**`)] },
      ['JV share as % of owners\' profit', n0(JV.totalFY26 / 1197.13 * 100) + '%', ...jvShareOfPat.map(v => n0(v) + '%')],
    ], source: 'GAM estimates. The engine has no JV or minority line: both enter other income divided by (1 − 24.5%), so that net profit equals owners\' profit.' } },
    { callout: '**Why it matters for valuation:** P/E captures the JVs (they are in EPS); EV/EBITDA and DCF do not (they sit below EBITDA and outside consolidated cash flow, at ₹924 cr of book value). That is one reason our DCF and EV/EBITDA cross-checks sit below the P/E value, and one reason peers with no JVs look "cheaper" on P/E than they are.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: breadth and partners, not pricing power',
  blocks: [
    { verdicts: D.moat, head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (annual report, presentations and calls to Aug-2026; broker notes)' },
    { callout: '**Verdict: a narrow moat.** Uno Minda\'s advantage is real but procedural: it is the easiest one-stop supplier for an Indian OEM across dozens of parts, with partners\' technology behind it and a record of delivering plants on time. It is not a pricing moat (margins have never left 10.6-12.3%), and in its biggest categories it faces capable rivals. The moat shows up in growth and returns on capital, not in margins.' },
  ],
};

module.exports = { core, castings, newbiz, jv, moat };
