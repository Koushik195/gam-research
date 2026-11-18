// Apollo report, part 3: hospital KPIs and the bed build, expansion pipeline, HealthCo / NewCo, AHLL, moat.
const X = require('./APOLLOHOSP.ctx');
const { C, D, F, A, n0, n1, pc, rup, SA, SQ, QL, Q1, AK, ann, YRS, SEG, BH, disch, ipRev, netRev, arpob, hcoSep28, KEIMED_SEP28, NEWCO_PCT, newcoMult, part } = X;
const E = C.expansion, R = C.restructuring;
const qk = SQ.filter(q => q.beds);
const FY26ARPOB = ann('FY26').arpp / ann('FY26').alos, HQ1 = C.segments.find(s => s.key === 'hcs'), CQ1 = C.segments.find(s => s.key === 'hco');

const hospitals = {
  id: 'hospitals', nav: 'Beds, occupancy & pricing', kicker: 'Operating KPIs', title: 'Hospital revenue = beds × occupancy × patients × price: for four years Apollo grew on occupancy and price, not beds',
  blocks: [
    { p: `Apollo reports its hospitals as a network that includes the 22%-owned Delhi hospital: **operating beds**, **occupancy**, **in-patient discharges**, **average length of stay (ALOS)** and **average revenue per in-patient (ARPP)**. Discharges × ARPP gives in-patient revenue (~82% of the network's net revenue; the rest is out-patients and other services), and the consolidated hospital segment is ~91% of network revenue (the gap is mainly Delhi). From FY22 to FY26 operating beds rose only 3% (7,875 → 8,131), but occupancy rose from 63% to 67% (70% in Q1FY27), stays fell from 3.96 to 3.17 days (so each bed treated more patients), and ARPP rose 25% (₹1.43 lakh → ₹1.78 lakh) on price (~4-5% a year) and sicker, more complex cases. Revenue per occupied bed-day (ARPP ÷ ALOS) was ₹${n0(FY26ARPOB)} in FY26 and ₹${n0(Q1.arpp / Q1.alos)} in Q1FY27.` },
    { exhibit: { type: 'table', title: 'The revenue identity, checked (network incl. Delhi; ₹ crore unless stated)', head: ['', 'FY23', 'FY24', 'FY25', 'FY26'], rows: [
      ['Operating beds (year end)', ...AK.slice(1).map(k => n0(k.beds))],
      ['Occupancy', ...AK.slice(1).map(k => `${k.occupancyPct}%`)],
      ['In-patient discharges (\'000)', ...AK.slice(1).map(k => n0(k.dischargesK))],
      ['× revenue per in-patient (₹)', ...AK.slice(1).map(k => n0(k.arpp))],
      ['= in-patient revenue', ...AK.slice(1).map(k => n0(k.dischargesK * k.arpp / 1e4))],
      ['Network net revenue incl. Delhi', '–', '–', n0(ann('FY25').netRevNetwork), n0(ann('FY26').netRevNetwork)],
      { hl: true, cells: ['**Hospital segment revenue (consolidated)**', ...['FY23', 'FY24', 'FY25', 'FY26'].map(y => `**${n0(ann(y).hcsRev)}**`)] },
    ], source: 'AR FY26 KPIs; Q4FY26 presentation p.18; GAM Research' } },
    { pair: [
      { type: 'line', title: 'Occupancy: 65-73% by quarter; 70% in Q1FY27', unit: 'Bed occupancy (%), quarterly', x: qk.map(q => q.q), series: [{ name: 'Occupancy', values: qk.map(q => q.occupancyPct), fmt: 'pct' }], labels: 'all', min: 55, max: 80, source: 'Company presentations' },
      { type: 'column', title: 'Revenue per in-patient: +8-11% a year in each of the last four quarters', unit: 'Average revenue per in-patient (₹)', x: qk.map(q => q.q), series: [{ name: 'ARPP', values: qk.map(q => q.arpp), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Established vs new hospitals', head: ['', 'Q4FY26', 'Q1FY27', 'Note'], wide: [3], rows: [
      ['Established hospitals: EBITDA margin', '25.5%', '25.9%', '~26% "a good sustainable number" (CFO)'],
      ['Established hospitals: occupancy', '69% (FY26)', `${Q1.estabOccPct}%`, 'Q1FY26: 65%'],
      ['New hospitals: revenue (₹ cr)', '–', '92', '380 operational beds in five new units'],
      ['New hospitals: EBITDA (₹ cr)', '−41', '−38', 'Guided ~−150 for FY27, breakeven by Q3-Q4 FY28'],
      ['Hospital EBITDA per operating bed (₹ lakh, annualised)', n1(ann('FY26').hcsEbitda / ann('FY26').beds * 100), n1(HQ1.q1fy27Ebitda * 4 / Q1.beds * 100), 'Network beds include Delhi, so this understates (Delhi profit is not in the segment)'],
    ], source: 'Q4FY26 and Q1FY27 presentations and calls; GAM Research' } },
    { callout: `**What moves the numbers:** each 1pp of occupancy on ~8,600 beds is ~10,000 more discharges a year, or ~₹${n0(8600 * 0.01 * 365 / BH.alos[0] * BH.arpp[0] / 1e7 / BH.ipSharePct[0] * 100 * BH.consSharePct[0] / 100)} cr of revenue at FY27E prices; each 1% of ARPP is ~₹${n0(SEG.hcs.revenue[0] / 100)} cr. The established hospitals are already at 72% occupancy, near the practical ceiling of ~75-80%, so the next leg of growth has to come from new beds and price, which is exactly where regulation and execution risk sit.` },
  ],
};

const expansion = {
  id: 'expansion', nav: 'Expansion pipeline', kicker: 'Growth plan', title: `+4,330 census beds by FY31 for ~₹11,150 cr: the biggest build in Apollo's history, mostly outside its home turf`,
  blocks: [
    { p: rup(`${E.summary} Of the plan, 1,387 census beds belong to FY26-27 (Pune, Sonarpur, Gachibowli, Defence Colony, Sarjapur-1 and Gurgaon), 327 to FY28-29 (brownfield additions in Hyderabad, Bengaluru/Mysore and Indore), and 2,996 to FY30-31 (Worli, Dwarka, OMR Chennai, Varanasi, Sarjapur-2, Ranchi, Indore, Lucknow and two proton/cancer centres). The average cost is ~₹2.4 cr per census bed, from ₹0.9-1.1 cr for asset-light leased hospitals (Sonarpur, Gachibowli) to ₹2.6-2.7 cr for Worli and Dwarka. Jubilee Hills and Secunderabad slipped to FY28-29 (re-design, landlord delays).`) },
    { exhibit: { type: 'table', title: 'Bed pipeline (company plan, Q1FY27)', head: ['Project', 'Phase', 'Type', 'Census beds', 'Cost (₹ cr)', '₹ cr per census bed', 'Operational (Jun-26)'], rows: E.projects.map(p => [p.name, p.phase, p.type, n0(p.census), n0(p.costCr), (p.costCr / p.census).toFixed(2), p.operational != null ? n0(p.operational) : '–']), source: 'Q1FY27 presentation p.14 (project list, cost); Q1FY27 call (Gurgaon timing)' } },
    { pair: [
      { type: 'column', title: 'Census beds: 9,857 now, ~14,100 by FY31 (company)', unit: 'Census beds (owned, managed and AHLL)', x: ['Jun-26', '+ rest of FY26-27 projects', '+ FY28-29', '+ FY30-31', 'FY31 plan'], series: [{ name: 'Beds', values: [9857, 1007, 327, 2996, 14187], fmt: 'num' }], labels: 'all', highlight: 'FY31 plan', source: 'Q1FY27 presentation p.14 (company: ~14,100)' },
      { type: 'column', title: 'Our average operating beds: +13% by FY29E', unit: 'Average operating beds, network (GAM build)', x: ['FY26', ...YRS], series: [{ name: 'Beds', values: [8071, ...BH.avgBeds], fmt: 'num' }], labels: 'all', source: 'Company (FY26 quarterly average); GAM estimates' },
    ] },
    { callout: '**Our view:** the FY26-27 wave is mostly asset-light or acquired and cheap per bed; the FY30-31 wave is expensive metro greenfield. At maturity a hospital bed earns ~₹40-45 lakh of EBITDA a year in Apollo\'s system (our estimate), so ₹2.4 cr of capex per bed is a ~17-19% pre-tax return at maturity, good but below today\'s 25-28% hospital ROCE. Hospital returns will therefore drift down through FY31 even if execution is good, and the new markets (Mumbai, Delhi, Varanasi, Ranchi) are where Apollo\'s record is weakest.' },
  ],
};

const hq = SQ.slice(-5);
const healthco = {
  id: 'healthco', nav: 'HealthCo & the NewCo spin-off', kicker: 'Pharmacy & digital', title: 'Apollo HealthCo: the digital bleed has stopped; now the spin-off decides who keeps the value',
  blocks: [
    { p: `HealthCo grew revenue 19% in FY26 and 20% in Q1FY27 (₹${n0(CQ1.q1fy27Rev)} cr). Its offline distribution business earns ~7.3% EBITDA; the online pharmacy and 24/7 platform earn ~20% before the platform's operating cost (₹81 cr in Q1FY27), and the "digital cash loss" fell from ₹49 cr in Q1FY26 to ₹10 cr in Q1FY27, with breakeven guided for Q2FY27. Under the composite scheme approved by shareholders on 24-Jun-2026, HealthCo, 24/7 and telehealth move into **Apollo Healthtech (NewCo)**, which also absorbs **Keimed**, a promoter-linked pharmaceutical wholesaler (Q1FY27 revenue ₹4,115 cr, EBITDA ₹134 cr, 3.2%). Apollo shareholders get 195.2 NewCo shares per 100 Apollo shares (42.1% of NewCo) and Apollo keeps 15% plus ~2.5% through FHPL: **59.6% in all**. Advent (which put ₹2,475 cr into HealthCo in 2024-25) gets 12.1%, ESOPs 3.0%, Keimed's owners 25.3%. NCLT sanction is pending; listing is estimated by Q4FY27.` },
    { pair: [
      { type: 'column', title: 'HealthCo EBITDA after digital costs: ₹23 cr to ₹171 cr a quarter', unit: 'EBITDA after 24/7 cost and ESOP (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'EBITDA', values: SQ.map(q => q.hcoEbitda), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'column', title: 'Digital cash loss: ₹49 cr to ₹10 cr in a year', unit: 'Digital cash loss, ex-ESOP (₹ crore)', x: ['Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Cash loss', values: [-48.7, -38.6, -29.2, -16.4, -9.7], fmt: 'n1' }], labels: 'all', source: 'Q1FY27 presentation p.28' },
    ] },
    { exhibit: { type: 'table', title: 'NewCo: who owns what, and what it earns', head: ['', 'Value', 'Note'], wide: [2], rows: [
      ['Apollo shareholders directly / Apollo (incl. FHPL)', '42.1% / 17.5%', '59.6% look-through for an Apollo shareholder'],
      ['Advent / ESOP trust / Keimed promoters and others', '12.1% / 3.0% / 25.3%', 'Keimed is linked to the promoter family'],
      ['Combined revenue FY26 / Q1FY27 (₹ cr)', '19,037 / 5,347', 'Net of sales between HealthCo and Keimed'],
      ['Combined EBITDA after digital costs FY26 / Q1FY27 (₹ cr)', '908 (4.8%) / 299 (5.6%)', 'Pre-Ind AS; 6.5% / 6.4% excluding digital'],
      ['Guidance (Q4FY27 run-rate)', '₹25,000 cr revenue, 6.5-7.0% EBITDA', '= ₹1,625-1,750 cr annualised EBITDA'],
      ['GAM Sep-28E EBITDA: HealthCo + Keimed (₹ cr)', `${n0(hcoSep28)} + ~${n0(KEIMED_SEP28)}`, `At ${newcoMult.base}x = ~₹${n0((hcoSep28 + KEIMED_SEP28) * newcoMult.base)} cr EV for 100% of NewCo`],
      { hl: true, cells: ['**Value to Apollo shareholders (59.6%)**', `**₹${n0(part(/^Apollo HealthCo/).value + part(/^Keimed/).value)} cr**`, `**~₹${n0((part(/^Apollo HealthCo/).value + part(/^Keimed/).value) / X.sh)} a share, before NewCo debt**`] },
    ], source: 'Q1FY27 presentation pp.29-31; scheme terms; GAM estimates' } },
    { callout: '**Our view:** the operating story is good: digital costs are under control and offline distribution grows ~20%. The ownership story is less good for Apollo\'s shareholders: they swap 100% of HealthCo (with Advent\'s CCPS as a claim) for 59.6% of a bigger company in which a promoter-linked distributor gets a quarter. Keimed is a 3% margin wholesaler; bringing it in raises NewCo\'s revenue far more than its value. We value NewCo at 18x Sep-28E EBITDA, a distribution multiple, not the 25x some brokers apply to offline pharmacy.' },
  ],
};

const ahll = {
  id: 'ahll', nav: 'AHLL: clinics & diagnostics', kicker: 'Retail health', title: 'AHLL: selling Cradle at 35x EBITDA, keeping a sub-scale diagnostics and clinics business',
  blocks: [
    { p: `AHLL had ₹${n0(ann('FY26').ahllRev)} cr of revenue in FY26 at an 11.4% EBITDA margin. In Q1FY27 primary care (299 clinics) made ₹127 cr of revenue (19% margin), diagnostics ₹200 cr (14%; +31% growth), and specialty care (Spectra, Cradle, fertility, dialysis) ₹193 cr (11%), less ₹15 cr of corporate costs. Apollo bought out IFC and other minorities for ₹1,273 cr in Mar-2026, then agreed in May-2026 to combine Cradle and fertility (₹450 cr revenue, ₹45 cr IGAAP EBITDA in FY26) with Cloudnine for ~₹1,550 cr (~35x EBITDA): ~₹750 cr in cash and a 9.9% stake in Cloudnine. CCI approved the deal on 1-Sep-2026; management expected completion in Q2FY27, so we deconsolidate it from Q3FY27.` },
    { pair: [
      { type: 'column', title: 'AHLL quarterly EBITDA: ₹31 cr to ₹59 cr in two years', unit: 'AHLL EBITDA (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'EBITDA', values: SQ.map(q => q.ahllEbitda), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'hbar', title: 'Q1FY27: diagnostics is the biggest and fastest-growing unit', unit: 'Q1FY27 revenue (₹ crore)', x: ['Diagnostics', 'Specialty care (Spectra, Cradle, fertility)', 'Primary care (clinics)'], series: [{ name: 'Revenue', values: [200, 193, 127], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation p.24' },
    ] },
    { callout: `**Our view:** selling Cradle at ~35x EBITDA is good capital allocation; it crystallises more value than we would give the whole of AHLL per rupee of EBITDA. What remains is sub-scale: diagnostics at a 14% margin against 25-40% at Dr Lal, Metropolis and Vijaya. We model continuing AHLL EBITDA of ₹${n0(SEG.ahll.adjEbitda[1])} cr in FY28E and value it at 18x Sep-28E, a discount to listed labs for lower margins and a mixed portfolio.` },
  ],
};

const lvl = s => (s >= 5 ? 'Strong' : s >= 4 ? 'Good' : s >= 3 ? 'Moderate' : 'Weak');
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real moat in brand and clinical depth, weaker in pricing and outside the South',
  blocks: [
    { verdicts: D.moat.map(r => [r.k, `${lvl(r.score)} (${r.score}/5)`, rup(r.v), r.score >= 4 ? 'Supports a premium multiple' : 'Limits it']), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** Apollo has the strongest hospital brand in India and genuine clinical depth (transplants, oncology, proton therapy, complex cardiac care), which lets it charge the highest prices per patient in its markets and attract international patients. That moat is deepest where Apollo has density (Chennai, Hyderabad, Bengaluru, Kolkata). It is not a moat against regulation or against well-funded rivals in Delhi NCR and Mumbai, where Max, Medanta and Fortis are strong and where most of Apollo\'s new beds go. The pharmacy and digital ecosystem is a feeder, not a moat: it cost ~₹2,100 cr of operating spend to build and is now being shared with Advent and Keimed\'s owners.' },
  ],
};

module.exports = { hospitals, expansion, healthco, ahll, moat };
