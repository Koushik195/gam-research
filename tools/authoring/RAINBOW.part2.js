// Rainbow report, part 2: business, history, industry, tailwind test.
const fs = require('fs');
const path = require('path');
const X = require('./RAINBOW.ctx');
const { C, D, A, ROOT, n0, n1, pc, rup, SRC, SA, Q1, FY26, b, ASOF } = X;
const CL = C.clustersQ1FY27;

// Peer growth from each company's Screener file: Jun-2026 quarter YoY and FY23-26 revenue CAGR.
const scr = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables;
const q1g = sym => { const q = scr(sym).quarters, r = q.rows.Sales || q.rows.Revenue, i = q.periods.indexOf('Jun 2026'), j = q.periods.indexOf('Jun 2025'); return i >= 0 && j >= 0 ? Math.round((r[i] / r[j] - 1) * 1000) / 10 : null; };
const cagr3 = sym => { const t = scr(sym)['profit-loss'], r = t.rows.Sales || t.rows.Revenue, i = t.periods.indexOf('Mar 2026'), j = t.periods.indexOf('Mar 2023'); return Math.round((Math.pow(r[i] / r[j], 1 / 3) - 1) * 1000) / 10; };
const IND = ['RAINBOW', 'APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'NH', 'MEDANTA', 'KIMS', 'JLHL'];

const business = {
  id: 'business', nav: 'What Rainbow does', kicker: 'The business', title: 'Hospitals for children and mothers: paediatric super-specialty plus maternity, in hub-and-spoke city networks',
  blocks: [
    { p: `Rainbow runs hospitals only for children and women. **Rainbow Children's Hospital** covers everything a sick child may need: emergency and outpatient care, neonatal and paediatric intensive care (NICU/PICU, about a third of beds), and super-specialties up to liver, kidney and bone-marrow transplants, cardiac surgery, neurosurgery, oncology and ECMO. **BirthRight by Rainbow** covers obstetrics, high-risk pregnancy, fetal medicine, fertility (IVF) and gynaecology, inside the same hospitals; obstetrics is ~32% of revenue and IVF ~3.7% (FY26). The two feed each other: a family that delivers at BirthRight comes back when the child falls ill at night. In each city Rainbow builds a **hub** (150-250 beds, complex care) and **spokes** (50-100 beds, emergencies, deliveries, outpatients and level-3 NICU) that refer complex cases to the hub.` },
    { p: `Doctors work **full time, on retainer, in teams with 24/7 cover** (1,075+ doctors incl. trainees), unlike most Indian hospitals, which rely on visiting consultants paid per case. Rainbow runs India's largest private paediatric training programme (DNB), which supplies future doctors. In FY26 hospital services were ₹${n0(FY26.hospitalServicesMn / 10)} cr of revenue, pharmacy ₹${n0(FY26.pharmacyMn / 10)} cr and the fee for running the 130-bed Madhukar hospital in Delhi ₹${n0(FY26.medicalServiceFeeMn / 10)} cr; ~48% of inpatient revenue was paid in cash and ~52% by insurers.` },
    { exhibit: { type: 'table', title: 'The network at Jun-2026 (capacity beds)', head: ['Cluster', 'Beds', 'Hospitals (year opened, beds)'], wide: [2], rows: [
      ...CL.map(c => [`**${c.cluster}**`, n0(c.beds), c.hospitals]),
      { hl: true, cells: ['**Total**', `**${n0(CL.reduce((s, c) => s + c.beds, 0))}**`, '24 hospitals and 5 clinics in 9 cities; KPI beds exclude Madhukar\'s 130 (2,435 capacity, 1,862 operational)'] },
    ], source: 'Q1FY27 presentation pp. 24, 28-29 (Madhukar, Malviya Nagar: Rainbow provides medical services only)' } },
    { pair: [
      { type: 'hbar', title: 'Telangana is still ~40% of the beds', unit: 'Capacity beds by cluster, Jun-2026', x: CL.map(c => c.cluster.replace(' (Chennai)', '').replace('National Capital Region', 'NCR (incl. Madhukar)')), series: [{ name: 'Beds', values: CL.map(c => c.beds), fmt: 'num' }], labels: 'all', highlight: 'Telangana', source: 'Q1FY27 presentation' },
      { type: 'hbar', title: 'Revenue mix: hospital services dominate', unit: 'FY26 revenue (₹ crore)', x: ['Hospital services (IP + OP)', 'Pharmacy', 'Medical service fee (Madhukar)', 'Other operating'], series: [{ name: 'Revenue', values: [FY26.hospitalServicesMn, FY26.pharmacyMn, FY26.medicalServiceFeeMn, FY26.otherOperatingMn].map(v => Math.round(v / 10)), fmt: 'num' }], labels: 'all', highlight: 'Hospital services (IP + OP)', source: 'AR FY26 consolidated note 2.20' },
    ] },
    { exhibit: { type: 'table', title: 'Operating scale', head: ['', 'FY24', 'FY25', 'FY26', 'Q1FY27'], rows: [
      ['IP discharges', ...X.AK.slice(2).map(k => n0(k.ipDischarges)), n0(Q1.ipDischarges)],
      ['OP consultations (lakh)', ...X.AK.slice(2).map(k => n1(k.opConsults / 1e5)), n1(Q1.opConsults / 1e5)],
      ['Deliveries', ...X.AK.slice(2).map(k => n0(k.deliveries)), n0(Q1.deliveries)],
      ['Average length of stay (days)', ...X.AK.slice(2).map(k => k.alos.toFixed(2)), Q1.alos.toFixed(2)],
      ['Cash share of IP revenue', '–', '47.8%', `${FY26.payorCashPct}%`, `${Q1.payorCashPct}%`],
    ], source: 'Company presentations; AR FY26 MD&A' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From one children\'s hospital in Hyderabad (1999) to a national expansion plan',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: rup(C.historySrc) } },
    { callout: '**Corporate actions and per-share data:** no bonus, split or buyback since listing; ~10.16 cr shares (a few ESOP allotments). Two acquisitions (76% each of Warangal and Guwahati, FY26) brought the first minority interests: Screener\'s consolidated "Net Profit" (₹282 cr in FY26) is before minorities while its EPS (₹27.4) is after, so we put profit on the attributable basis (₹278 cr; RAINBOW.patch.js) to keep the share count right. The sole PE investor (CDC, now BII) fully exited in Dec-2022.' },
  ],
};

const IN = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Fewer babies, sicker babies treated privately, and a bed-building boom',
  blocks: [
    { p: `${rup(IN.births)} That is the central fact of Rainbow's market: it cannot rely on a rising number of children. What is growing is the share of births and childhood illness treated in organised private hospitals with neonatal and paediatric intensive care, insurance cover (52% of Rainbow's inpatient revenue) and the price of complex care. Paediatrics is also seasonal (monsoon and winter infections) and mostly medical rather than surgical, so revenue per patient is lower and less predictable than in adult cardiac or orthopaedic surgery.` },
    { exhibit: { type: 'table', title: 'Forces acting on Rainbow\'s market (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Rainbow'], wide: [2], rows: IN.themes.map(r => r.map(rup)), source: IN.src } },
    { pair: [
      { type: 'hbar', title: 'Q1FY27 revenue growth: Rainbow among the fastest (33%, 24% organic)', unit: 'Consolidated revenue growth, Jun-2026 quarter, year on year (%)', x: IND.map(X.shortName), series: [{ name: 'Growth', values: IND.map(q1g), fmt: 'pct' }], labels: 'all', highlight: 'Rainbow', source: 'Screener.in quarterly results (acquisitions included)' },
      { type: 'hbar', title: 'But over three years it lagged the multi-specialty chains', unit: 'Revenue growth, FY23-26, a year (%)', x: IND.map(X.shortName), series: [{ name: 'CAGR', values: IND.map(cagr3), fmt: 'pct' }], labels: 'all', highlight: 'Rainbow', source: 'Screener.in (consolidated)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Rainbow captures the shift to specialised care, not volume growth',
  blocks: [
    { verdicts: [
      ['More births in organised private hospitals', 'Yes', 'Deliveries +11% in FY26 and +23% in Q1FY27 (with new hospitals); obstetrics ~32% of revenue, up from 28-30%.', 'Share gains offset flat births.'],
      ['Higher acuity: NICU, PICU, transplants', 'Yes', 'ARPOB +11% in FY26 and +6% in Q1FY27, "predominantly case mix"; mature-unit ARPOB ₹70,662 vs ₹59,133 at new units.', 'The main growth lever per bed.'],
      ['Insurance penetration', 'Yes', 'Insurance ~52% of IP revenue, stable for three years.', 'Supports pricing, no sign of insurer pressure in the numbers.'],
      ['Seasonal infections', 'Not in FY26', 'Weak seasons in FY26: occupancy 46% vs 51% in FY25; growth 12% vs a possible 18-20% (management).', 'Volatile; a strong season is upside, not a plan.'],
      ['Premium metros (NCR, Mumbai) and medical tourism', 'Not yet', 'Delhi is 24 own beds; Gurugram (450 beds) opens H2FY28-Q1FY29, Malad Q1FY28; international patients fell (Bangladesh, Africa).', 'An option for FY29+, with start-up losses first.'],
      ['Fertility (IVF)', 'Partly', 'IVF ~3.7% of FY26 revenue; management expects ~25% a year growth for three years.', 'Small but high-margin and growing.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { business, history, industry, tailwind };
