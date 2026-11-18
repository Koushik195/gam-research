// Fortis report, part 3: hospital KPIs (beds, occupancy, ARPOB), margin matrix and cohorts, bed pipeline, Agilus, moat.
const X = require('./FORTIS.ctx');
const { C, D, F, A, AS, n0, n1, n2, pc, rup, SRC, SA, SQ, QL, Q1, FY26, BL, COH, REV, YRS, netBeds, netOcc, netArpob, HS, DG, hospM, diagM, ebitdaPerBed } = X;
const MM = C.marginMatrix, BP = C.bedPlan;
const conv = r => (r.hospRev / (r.occupiedBeds * r.arpobCr)).toFixed(3);

const hospitals = {
  id: 'hospitals', nav: 'Beds, occupancy & ARPOB', kicker: 'Operating KPIs', title: 'Revenue = beds × occupancy × ARPOB: beds now do the work, price growth has slowed',
  blocks: [
    { p: `Hospital revenue is the product of three numbers: **operational beds**, **occupancy** (share of beds filled) and **ARPOB** (average revenue per occupied bed; Fortis quotes it in ₹ crore per bed per year, on gross revenue). From FY23 to FY26 occupied beds rose 23% (2,665 → 3,270) and ARPOB 25% (₹2.01 cr → ₹2.51 cr), so hospital revenue grew 52%. The mix has flipped: in FY24-25 price did most of the work (ARPOB +11% and +9%); in FY26 and Q1FY27 ARPOB rose only 3.4% and 2.6% while occupied beds jumped 15% and 17%, helped by ~800 beds added in FY26 (acquisitions and brownfield). Occupancy has stayed at 67-72% throughout, which says the new beds are filling. Because ARPOB is on gross revenue, reported revenue is ~5% below occupied beds × ARPOB every year (ratio 0.947 in FY26).` },
    { pair: [
      { type: 'column', title: 'Occupied beds: +23% in three years, +17% in the last year', unit: 'Average occupied beds', x: [...SA.slice(1).map(r => r.fy), 'Q1FY27'], series: [{ name: 'Occupied beds', values: [...SA.slice(1).map(r => r.occupiedBeds), Q1.occupiedBeds], fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations' },
      { type: 'line', title: 'Quarterly ARPOB: Q1 highest, Q2 lowest; +2.6% YoY in Q1FY27', unit: 'ARPOB (₹ cr per occupied bed per year, gross)', x: QL, series: [{ name: 'ARPOB', values: SQ.map(q => q.arpobCr), fmt: 'n2' }], labels: 'all', source: 'Company presentations' },
    ] },
    { exhibit: { type: 'table', title: 'The revenue identity, checked', head: ['', 'FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27 (annualised)'], rows: [
      ['Occupied beds', ...SA.slice(1).map(r => n0(r.occupiedBeds)), n0(Q1.occupiedBeds)],
      ['× ARPOB (₹ cr per year, gross)', ...SA.slice(1).map(r => r.arpobCr.toFixed(2)), Q1.arpobCr.toFixed(2)],
      ['= gross revenue (₹ cr)', ...SA.slice(1).map(r => n0(r.occupiedBeds * r.arpobCr)), n0(Q1.occupiedBeds * Q1.arpobCr)],
      ['Reported hospital revenue (₹ cr)', ...SA.slice(1).map(r => n0(r.hospRev)), n0(Q1.hospRevenue * 4)],
      { hl: true, cells: ['**Ratio reported ÷ gross**', ...SA.slice(1).map(r => `**${conv(r)}**`), `**${(Q1.hospRevenue * 4 / (Q1.occupiedBeds * Q1.arpobCr)).toFixed(3)}**`] },
      ['Occupancy', ...SA.slice(1).map(r => `${r.occupancyPct}%`), `${Q1.occupancyPct}%`],
      ['Implied average operational beds', ...SA.slice(1).map(r => n0(r.occupiedBeds / r.occupancyPct * 100)), n0(Q1.occupiedBeds / Q1.occupancyPct * 100)],
    ], source: 'Company KPIs (Q4FY23-Q1FY27 decks); GAM Research' } },
    { callout: `**What would move the numbers:** each 1pp of occupancy on ~5,100 operational beds is ~51 occupied beds, or ~₹130 cr of revenue at FY27E ARPOB; each 1% of ARPOB is ~₹90 cr. Management guides another 2-3pp of occupancy as Manesar, Greater Noida, Yeshwanthpur and BG Road fill. Our build gets network occupancy to ${n1(netOcc[0])}% / ${n1(netOcc[1])}% / ${n1(netOcc[2])}% and ARPOB to ₹${n2(netArpob[0])} / ${n2(netArpob[1])} / ${n2(netArpob[2])} cr in FY27-29E.` },
  ],
};

const t = r => [r[0], r[1], `${r[2]}%`, n0(r[3]), r[4].toFixed(2), `${r[5]}%`];
const matrix = {
  id: 'matrix', nav: 'Mature vs ramp-up hospitals', kicker: 'Hospital cohorts', title: 'Fourteen hospitals earn 70% of revenue at 20%+ margins; six are still ramping up',
  blocks: [
    { p: `Fortis does not give profit by hospital, but every quarter it groups facilities by EBITDA margin. In Q1FY27, 14 facilities (3,212 beds) earned more than 20% and brought 70% of hospital revenue, at 74% occupancy and ₹2.71 cr ARPOB; 4 more (809 beds) earned 15-20%, with the highest ARPOB (₹3.19 cr). The tail is 6 facilities (919 beds) below 15%: Yeshwanthpur (People Tree, bought Jan-2026), Manesar (opened Sep-2024) and Greater Noida (leased from Sep-2025) among them, at 54% occupancy and ~₹2 cr ARPOB. Management says the new units cost 0.4pp of margin in Q1FY27 and should add ~1pp once mature; Manesar and Greater Noida are guided to mid-teens margins by end-FY27. A greenfield hospital takes 18-24 months to break even and another year to reach 18-20%; brownfield beds fill almost at once.` },
    { exhibit: { type: 'table', title: 'Hospital margin matrix (operating EBITDA before ESOP)', head: MM.head, rows: [
      { sec: 'Q1FY27 (24 facilities, 4,940 beds)' }, ...MM.q1fy27.map(t),
      { sec: 'FY26' }, ...MM.fy26.map(t),
      { sec: 'FY25 (excl. Richmond Road, divested)' }, ...MM.fy25.map(t),
    ], source: rup(MM.src) } },
    { pair: [
      { type: 'column', title: 'More hospitals above 20% margin: 10 → 13 → 14', unit: 'Facilities above 20% operating EBITDA margin', x: ['FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Facilities', values: [10, 13, 14], fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'hbar', title: 'Low-margin hospitals also have the lowest ARPOB', unit: 'Q1FY27 ARPOB by margin band (₹ cr per bed per year, gross)', x: MM.q1fy27.map(r => r[0] + ' margin'), series: [{ name: 'ARPOB', values: MM.q1fy27.map(r => r[4]), fmt: 'n2' }], labels: 'all', source: 'Q1FY27 presentation p.18' },
    ] },
    { callout: '**Our view:** the matrix is the best evidence that the turnaround worked (13 → 14 hospitals above 20%), and also that it is maturing: the >20% group already runs at 74% occupancy, FMRI at 85-90%. Margin upside now depends on the ramp-up group (only ~10% of revenue) and on new beds in already-full hospitals. That is why we model the hospital margin rising ~0.5pp a year, not the ~1.5-2pp management talks about.' },
  ],
};

const coh = g => ({ mature: 'Mature hospitals (>15% margin; 4,021 beds)', rampUp: 'Ramp-up hospitals (<15%; 919 beds)', newBeds: 'New brownfield beds (after Q1FY27)' }[g]);
const expansion = {
  id: 'expansion', nav: 'Bed pipeline', kicker: 'Growth plan', title: '~1,800 brownfield beds over FY27-30: back-ended, with FY28 the gap year',
  blocks: [
    { p: `Fortis plans to grow operational beds from ${n0(BP.opBedsFy26)} (Mar-2026) to ${n0(BP.opBedsFy30)} by FY30 (+36%), almost all brownfield (new towers and floors at existing hospitals), plus ~1,200 O&M beds. The phasing is uneven: ${BP.add.FY27} beds in FY27 (~100 done in Q1, led by a ~200-bed tower at FMRI awaiting its occupancy certificate in August), only ${BP.add.FY28} in FY28 after the Shalimar Bagh extension slipped on approvals, then ${BP.add.FY29} in FY29 and ${BP.add.FY30} in FY30 (towers at Mohali, Shalimar Bagh and Amritsar, 2.5-3 years away in May-2026). New O&M deals (Lucknow 550 beds, Cuttack 300) need no capital. Management is also "actively pursuing" acquisitions in its clusters; none is in our numbers.` },
    { exhibit: { type: 'table', title: 'Pipeline (company)', head: ['Project', 'Beds', 'Timing', 'Type'], wide: [0, 2], rows: C.pipeline.map(p => [p.project, p.beds, rup(p.timing), p.type]), source: rup(C.pipelineSrc) } },
    { pair: [
      { type: 'column', title: 'Own operational beds: 4,968 → 6,774 by FY30 (company plan)', unit: 'Operational beds (excl. ~1,184 O&M), end of year', x: ['FY25', 'FY26', 'FY27', 'FY28', 'FY29', 'FY30'], series: [{ name: 'Beds', values: [BP.opBedsFy25, BP.opBedsFy26, BP.opBedsFy26 + BP.add.FY27, BP.opBedsFy26 + BP.add.FY27 + BP.add.FY28, BP.opBedsFy26 + BP.add.FY27 + BP.add.FY28 + BP.add.FY29, BP.opBedsFy30], fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p.29 (capacity additions; ramp-up follows occupancy)' },
      { type: 'stacked', title: `Our build: new beds are ~${Math.round(REV.newBeds[2] / HS.revenue[2] * 100)}% of hospital revenue by FY29E`, unit: 'Hospital revenue by cohort (₹ crore)', x: YRS, series: COH.map(g => ({ name: coh(g).replace(/ \(.*/, ''), values: REV[g].map(Math.round), fmt: 'num' })), minLabel: 200, source: 'GAM estimates; sums to model hospital revenue' },
    ] },
    { exhibit: { type: 'table', title: 'Bed build by cohort (₹ crore; checked to sum to model hospital revenue)', head: ['', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ...COH.flatMap(g => [{ sec: coh(g) }, ['Average operational beds / occupancy / ARPOB (₹ cr)', ...YRS.map((_, i) => `${n0(BL[g].opBeds[i])} / ${BL[g].occupancyPct[i]}% / ${BL[g].arpob[i].toFixed(2)}`)], ['Revenue (× 0.945 gross-to-reported)', ...REV[g].map(v => n0(v))]]),
      ['Network: beds / occupancy / ARPOB', ...YRS.map((_, i) => `${n0(netBeds[i])} / ${n1(netOcc[i])}% / ${n2(netArpob[i])}`)],
      { hl: true, cells: ['**Hospital revenue (model)**', ...HS.revenue.map(v => `**${n0(v)}**`)] },
      ['Operating EBITDA per operational bed (₹ lakh, before ESOP)', ...ebitdaPerBed.map(v => n1(v))],
    ], source: 'Company KPIs (Q1FY27 margin matrix, bed plan); GAM estimates (assumptions.json businessLines)' } },
    { callout: `**Capex per bed:** Fortis does not disclose it. On our numbers (₹3,600 cr of capex in FY27-29E, of which ~₹1,600 cr maintenance at the guided 60% of ₹900 cr and ₹252 cr for the proton centre) growth capex is roughly ₹1-1.3 cr per brownfield bed (1,350-1,780 beds), against ~₹${n0(ebitdaPerBed[0])} lakh of operating EBITDA per operational bed in FY27E. Brownfield beds in full hospitals are the best use of Fortis's cash, if the towers open on time; the FY28 gap (173 beds) shows how easily they slip.` },
  ],
};

module.exports = { hospitals, matrix, expansion };
Object.assign(module.exports, require('./FORTIS.part3b'));
