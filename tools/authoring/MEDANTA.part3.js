// Medanta report, part 3: hospital KPIs (beds, occupancy, ARPOB), Cluster 1 vs Cluster 2, expansion pipeline, moat.
const X = require('./MEDANTA.ctx');
const { C, D, F, A, AS, n0, n1, rup, SRC, SQ, QL, Q1, AK, CL, BL, YRS, b, netBeds, netOcc, netArpob, c1F, c2F, otherF } = X;
const C1 = CL.c1, C2 = CL.c2;
const hosp = k => k.occupiedBeds * 365 * k.arpob / 1e7;
const occNow = netOcc[0], bedsNow = netBeds[0], arpNow = netArpob[0];
const oneOcc = bedsNow * 365 / 100 * arpNow / 1e7; // ₹ cr of revenue per 1pp of occupancy, FY27E

const hospitals = {
  id: 'hospitals', nav: 'Beds, occupancy & ARPOB', kicker: 'Operating KPIs', title: 'Revenue = beds × occupancy × ARPOB: Medanta has grown all three',
  blocks: [
    { p: `Hospital revenue is the product of **census beds** (beds available for overnight patients), **occupancy** and **ARPOB** (average revenue per occupied bed-day; Medanta counts in-patient and out-patient revenue but not OPD pharmacy or other income). From FY22 to FY26 census beds rose 54% (1,779 → 2,737), occupancy stayed at 59-62% even as beds were added, and ARPOB rose 22% (₹54,547 → ₹66,550): hospital revenue grew ~2.1x. ARPOB has risen with case mix (more cancer, transplants and robotic surgery), price increases in Gurugram and CGHS, and shorter stays (ALOS 3.76 → 3.04 days; 2.87 in Q1FY27), which free beds for more patients. Unlike most listed peers Medanta's growth has been mostly volume: in-patients doubled from 102,000 to 202,000 a year.` },
    { pair: [
      { type: 'column', title: 'Census beds +54% since FY22; occupancy held at ~60%', unit: 'Average census beds; occupancy (%) in labels', x: [...AK.map(k => k.fy), 'Q1FY27'], series: [{ name: 'Census beds', values: [...AK.map(k => k.censusBeds), Q1.censusBeds], fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations (occupancy: FY22 60%, FY23 59%, FY24-26 62%, Q1FY27 63%)' },
      { type: 'line', title: 'ARPOB: +22% in four years, +5.5% in Q1FY27', unit: 'ARPOB (₹ per occupied bed-day)', x: [...AK.map(k => k.fy), ...QL.filter((_, i) => SQ[i].arpob).slice(-3)], series: [{ name: 'ARPOB', values: [...AK.map(k => k.arpob), ...SQ.filter(q => q.arpob).slice(-3).map(q => q.arpob)], fmt: 'num' }], labels: 'all', source: 'Company presentations (annual, then Q3FY26-Q1FY27)' },
    ] },
    { exhibit: { type: 'table', title: 'The revenue identity, checked', head: ['', 'FY23', 'FY24', 'FY25', 'FY26'], rows: [
      ['Census beds (average)', ...AK.slice(1).map(k => n0(k.censusBeds))],
      ['× occupancy', ...AK.slice(1).map(k => `${n1(k.occupancyPct)}%`)],
      ['= occupied bed-days (\'000)', ...AK.slice(1).map(k => n0(k.occupiedBeds * 365 / 1000))],
      ['× ARPOB (₹)', ...AK.slice(1).map(k => n0(k.arpob))],
      ['= hospital revenue (₹ cr)', ...AK.slice(1).map(k => n0(hosp(k)))],
      ['+ OPD pharmacy, labs, grants, other (₹ cr)', ...AK.slice(1).map(k => n0(A.sales[A.labels.indexOf(k.fy)] - hosp(k)))],
      { hl: true, cells: ['**= reported revenue (₹ cr)**', ...AK.slice(1).map(k => `**${n0(A.sales[A.labels.indexOf(k.fy)])}**`)] },
    ], source: 'Company KPIs (definitions in the decks); Screener.in revenue; FY26 hospital revenue equals the AR\'s in-patient ₹3,387 cr + out-patient ₹706 cr' } },
    { callout: `**What would move the numbers:** each 1pp of occupancy on our FY27E ~${n0(bedsNow)} census beds is ~${n0(bedsNow * 3.65)} bed-days, or ~₹${n0(oneOcc)} cr of revenue at FY27E ARPOB (₹${n0(arpNow)}). Each 1% of ARPOB is ~₹${n0((c1F[0] + c2F[0]) / 100)} cr. Network EBITDA was ₹34 lakh per census bed in FY26 (₹930 cr ÷ 2,737) and ~₹38 lakh annualised in Q1FY27; a new bed costs ₹1.5-1.65 cr in the current projects (below), so a mature bed earns back its cost in about four years before tax.` },
  ],
};

const clusters = {
  id: 'clusters', nav: 'Cluster 1 vs Cluster 2', kicker: 'Hospital cohorts', title: 'Two Medantas: a mature Gurugram-led cluster growing ~10%, and a Tier-2 cluster growing 30%+ at higher margins',
  blocks: [
    { p: `**Cluster 1** (Gurugram, Indore, Ranchi) earned ₹${n0(C1.FY26.incomeMn / 10)} cr of income in FY26 (+9%) at a ${C1.FY26.marginPct}% margin (company basis), carrying all group overheads. Its occupied bed-days were flat in FY26 (the new 110-bed Ranchi unit diluted occupancy to 61%); ARPOB (+10%) did the work. In Q1FY27 it grew 10% with volumes +14% and margin ${C1.Q1FY27.marginPct}%. **Cluster 2** (Lucknow, Patna and, since Sep-2025, Noida) earned ₹${n0(C2.FY26.incomeMn / 10)} cr (+37%); without Noida, ₹${n0(C2.FY26.incomeExNoidaMn / 10)} cr (+29%) at a ${C2.FY26.marginExNoidaPct}% margin. Lucknow and Patna run at 68-70% occupancy with lower ARPOB (₹${n0(C2.Q1FY27.arpob)} in Q1FY27 incl. Noida, vs ₹${n0(C1.Q1FY27.arpob)} in Cluster 1) but less legacy cost and no corporate overhead. Management says Lucknow and Patna still grow "in the upwards of 20%" on volume alone and that tariffs in Patna have not been raised in 4.5 years.` },
    { exhibit: { type: 'table', title: 'Cluster 1 vs Cluster 2 (company basis: EBITDA before ESOP, income incl. allocated other income)', head: ['', 'Income (₹ cr)', 'EBITDA margin', 'Occupied bed-days', 'ARPOB (₹)', 'Occupancy', 'EBITDA per occupied bed-day (₹)'], rows: [
      { sec: 'Cluster 1: Gurugram, Indore, Ranchi' },
      ...['FY25', 'FY26', 'Q1FY26', 'Q1FY27'].map(p => [p, n0(C1[p].incomeMn / 10), `${C1[p].marginPct}%`, n0(C1[p].obd), n0(C1[p].arpob), `${C1[p].occupancyPct}%`, n0(C1[p].ebitdaMn * 1e6 / C1[p].obd)]),
      { sec: 'Cluster 2: Lucknow, Patna, Noida (Noida from Sep-2025)' },
      ...['FY25', 'FY26', 'Q1FY26', 'Q1FY27'].map(p => [p, n0(C2[p].incomeMn / 10), `${C2[p].marginPct}%${C2[p].marginExNoidaPct ? ` (${C2[p].marginExNoidaPct}% ex Noida)` : ''}`, n0(C2[p].obd), n0(C2[p].arpob), `${C2[p].occupancyPct}%`, n0(C2[p].ebitdaMn * 1e6 / C2[p].obd)]),
    ], source: rup(CL.src) } },
    { pair: [
      { type: 'column', title: 'Income growth: Cluster 2 has carried the group', unit: 'Year-on-year growth in total income (%)', x: ['FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Cluster 1', values: [9.0, 10.9, 10.1], fmt: 'pct' }, { name: 'Cluster 2', values: [37.5, 51.2, 54.8], fmt: 'pct' }, { name: 'Cluster 2 ex Noida', values: [29.2, 32.5, 28.2], fmt: 'pct' }], labels: 'all', source: 'Q4FY26 presentation pp. 20-21; Q1FY27 presentation pp. 15-16' },
      { type: 'column', title: 'Margins: Lucknow + Patna above Gurugram-led Cluster 1', unit: 'EBITDA margin, company basis (%)', x: ['FY25', 'FY26', 'Q1FY26', 'Q1FY27'], series: [{ name: 'Cluster 1', values: ['FY25', 'FY26', 'Q1FY26', 'Q1FY27'].map(p => C1[p].marginPct), fmt: 'pct' }, { name: 'Cluster 2 ex Noida', values: [30.1, 31.5, 29.3, 32.0], fmt: 'pct' }], labels: 'all', source: 'Company presentations (Cluster 2 FY25 and Q1FY26 had no Noida income)' },
    ] },
    { callout: '**Our view:** Cluster 2 is what investors are paying for, and it deserves it: first-mover super-specialty hospitals in cities of 100 million+ people, filled without price increases. Cluster 1 is a high-quality but maturing business: Gurugram is 15 years old and "running quite full", so its growth now comes from ARPOB, operating theatres and cath labs, not beds. By FY29E we expect Cluster 2 (with Noida) to be ~46% of hospital revenue, up from ~36% in FY26.' },
  ],
};

const PL = C.pipeline;
const expansion = {
  id: 'expansion', nav: 'Expansion pipeline', kicker: 'Growth plan', title: 'The next 3,370 beds: 418 brownfield beds now, five greenfields from FY30',
  blocks: [
    { p: `Medanta plans to nearly double installed beds from 3,737 to ~7,105. **Brownfield (418 beds, FY27):** the 80-bed Indore cancer hospital taken over in Apr-2026 (Q2/Q3FY27), Lucknow to 950 beds (+172 in H2FY27), Patna to 650 (+49 in Q4FY27) and Noida to 550; management says these need "minimum capex". **Greenfield (2,950 beds):** South Delhi (400, a 50:50 company with DLF that Medanta runs; construction started), Pitampura in north-west Delhi (~750, built jointly with and operated for a society), Oshiwara in Mumbai (750+, land bought Oct-2024, approvals pending), Guwahati (650, raised from 400 after new building norms; approvals in) and Varanasi (400, built by a developer and leased). The CEO's own timeline: "May of 2029 hospitals could be up and running. But that may not be FY29 numbers, that may be more FY30 numbers." Remaining capex is ₹4,858 cr over five years.` },
    { exhibit: { type: 'table', title: 'Pipeline, capex and our assumptions', head: ['Project', 'Beds', 'Status / timing', 'Type', 'Capex left (₹ cr)', 'Capex per bed (₹ cr)', 'In our FY27-29E revenue?'], wide: [0, 2], rows: [
      ...PL.map(p => [p.project, n0(p.beds), p.timing, p.type, p.capexLeftCr != null ? n0(p.capexLeftCr) : 'in ₹561 cr*', p.capexLeftCr != null ? (p.capexLeftCr / p.beds).toFixed(2) : '–', /Indore|Lucknow/.test(p.project) ? 'Yes (in the clusters)' : 'No (FY30+)']),
      ['Maintenance capex (three years)', '–', 'FY27-29', '–', '600', '–', '–'],
      { hl: true, cells: ['**Total**', '**3,368**', '', '', '**4,858**', '', ''] },
    ], source: `${rup(C.pipelineSrc)}. *Varanasi, medical college and guest house ₹561 cr together. Guwahati total cost ₹970 cr (₹1.49 cr a bed); Pitampura is cheaper per bed because the partner shares the build.` } },
    { pair: [
      { type: 'column', title: 'Installed beds: 3,737 → ~4,155 in FY27 → ~7,105 with greenfields', unit: 'Installed beds (company plan)', x: ['Mar-25', 'Mar-26', 'Jun-26', 'FY27e', 'All projects'], series: [{ name: 'Beds', values: [3042, 3665, 3737, 4155, 7105], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation p.18' },
      { type: 'stacked', title: 'Our revenue build: no greenfield revenue before FY30', unit: 'Revenue by source (₹ crore)', x: YRS, series: [{ name: 'Cluster 1 hospitals', values: c1F.map(Math.round), fmt: 'num' }, { name: 'Cluster 2 hospitals', values: c2F.map(Math.round), fmt: 'num' }, { name: 'Pharmacy, labs, grants, other', values: otherF, fmt: 'num' }], minLabel: 200, source: 'GAM estimates; sums to model revenue' },
    ] },
    { callout: `**Our view:** the plan is credible (three greenfields delivered, Noida close to breakeven within a year) and fundable from operating cash plus modest debt, but it changes the shape of the next five years. FY27-28 look excellent as Noida and 418 brownfield beds fill; FY29 is an air pocket (our revenue growth ${n1(F.salesGrowth[2])}%) because the greenfields are still being built while ₹1,300-1,400 cr a year is spent; FY30-32 bring 2,950 new beds and, if Noida is a guide (₹78 cr lost in its first seven months), several quarters of start-up losses per hospital. Three of the five (South Delhi, Pitampura, Mumbai: 1,900 beds and ₹2,410 cr) are in metros where land, doctors and competition are expensive.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a strong brand and clinical moat, widest where competition is thinnest',
  blocks: [
    { verdicts: [...D.moat.map(r => r.map(rup))], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026; Newsweek ranking as cited in the Q4FY26 deck)' },
    { callout: '**Honest verdict:** Medanta has a real moat: the brand and clinical depth built around Dr Trehan and its department heads, recognised in global rankings, which pulls complex cases from across North India, the Northeast and abroad. In Lucknow and Patna the moat is close to a local monopoly on super-specialty care. In Delhi NCR and Mumbai, where half of the remaining capex goes, it is one strong brand among several (Max, Fortis, Apollo, Manipal), so returns there depend on execution rather than on scarcity. The moat also has a key-person element: the founder is still Chairman, Managing Director and Chief Cardiac Surgeon; management depth below him (Group CEO Pankaj Sahni, department heads) is real but a succession has not been tested.' },
  ],
};

module.exports = { hospitals, clusters, expansion, moat };
