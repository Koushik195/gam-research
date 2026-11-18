// Aster DM Quality Care report, part 3: hospital KPIs (beds, occupancy, ARPOB/ARPP), maturity buckets, expansion pipeline, moat.
const X = require('./ASTERDM.ctx');
const { rup, C, D, F, A, AS, n0, n1, SRC, SA, SQ, Q1, FY26, BL, YRS, exF, nwF, othF, totBeds, blOcc, arpobQ1, hosp26, beds26, arpob26 } = X;
const PQ = Q1.proForma, GEO = Q1.asterGeography;

const hospitals = {
  id: 'hospitals', nav: 'Beds, occupancy & ARPOB', kicker: 'Operating KPIs', title: 'Revenue = beds × occupancy × price: occupancy +5pp and price/mix +7% drove Q1FY27',
  blocks: [
    { p: `Hospital revenue is the product of **operational beds**, **occupancy** (share of beds filled) and **revenue per occupied bed-day** (ARPOB). The company now reports occupancy on census beds and ARPP IP (revenue per in-patient) rather than a combined ARPOB, so we compute an **implied ARPOB on operational beds**: hospital and clinic revenue ÷ (operational beds × days × occupancy). In Q1FY27 that was ₹${n0(arpobQ1)} (₹2,535 cr over ${n0(PQ.opBeds)} beds at ${PQ.occupancyPct}%), against ~₹${n0(arpob26)} for FY26. The year-on-year jump in Q1FY27 came from both levers: operational beds +3.6% (Kasargod, Whitefield Block D, Ongole), occupancy +5.1pp and ARPP IP +10% (more robotics, transplants and joint replacements; ALOS down 2% to ${PQ.alos} days).` },
    { pair: [
      { type: 'column', title: 'ARPP IP: ₹1.24 lakh → ₹1.37 lakh in a year (+10%)', unit: 'Revenue per in-patient (₹), Q1', x: ['Aster Q1FY26', 'Aster Q1FY27', 'QCIL Q1FY26', 'QCIL Q1FY27', 'Combined Q1FY26', 'Combined Q1FY27'], series: [{ name: 'ARPP IP', values: [118011, Q1.aster.arppIp, 131805, Q1.qcil.arppIp, 124365, PQ.arppIp], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation pp.6, 20, 27' },
      { type: 'hbar', title: 'Aster clusters: Kerala is half the revenue; Bengaluru earns the most per patient', unit: 'Q1FY27 ARPP IP (₹ \'000) and occupancy (%)', x: GEO.flatMap(g => [`${g.cluster}: ARPP ₹'000`, `${g.cluster}: occupancy %`]), series: [{ name: 'Q1FY27', values: GEO.flatMap(g => [Math.round(g.arppIp / 100) / 10, g.occupancyPct]), fmt: 'n1' }], labels: 'all', source: 'Q1FY27 presentation p.23 (hospitals only, excl. WIMS)' },
    ] },
    { exhibit: { type: 'table', title: 'The revenue identity, checked (pro-forma)', head: ['', 'FY26', 'Q1FY27 (quarter)'], rows: [
      ['Operational beds (average / end)', `~${n0(beds26)}`, n0(PQ.opBeds)],
      ['× days × occupancy', '365 × 62%', `91 × ${PQ.occupancyPct}%`],
      ['= occupied bed-days (\'000)', n0(beds26 * 365 * 0.62 / 1000), n0(PQ.opBeds * 91 * PQ.occupancyPct / 100 / 1000)],
      ['× implied ARPOB (₹)', n0(arpob26), n0(arpobQ1)],
      { hl: true, cells: ['**= hospital & clinic revenue (₹ cr)**', `**${n0(hosp26)}**`, `**${n0(Q1.maturityTotal.revenue)}**`] },
      ['+ labs, pharmacy, other (₹ cr)', '~232', n0(PQ.revenue - Q1.maturityTotal.revenue)],
      ['Reported pro-forma revenue (₹ cr)', n0(SA[2].pfRev), n0(PQ.revenue)],
    ], source: 'Company pro-forma KPIs; FY26 average beds and the ₹232 cr of non-hospital revenue are GAM estimates; GAM Research' } },
    { callout: `**What would move the numbers:** each 1pp of occupancy on 10,559 beds is ~38,500 bed-days a year, or ~₹160 cr of revenue at FY27E prices (~₹60-70 cr of EBITDA at incremental margins). Our forecasts take the existing network from ${PQ.occupancyPct}% to ${BL.existing.occupancyPct[2]}% by FY29E; Kerala already runs at 64% and QCIL at 65%, so the room is real but not unlimited.` },
  ],
};

const MT = Q1.maturity;
const maturity = {
  id: 'maturity', nav: 'Mature vs new hospitals', kicker: 'Hospital cohorts', title: 'Mature hospitals earn ~30% margins; a quarter of the beds earn under 15%',
  blocks: [
    { p: `From Q1FY27 the company sorts its hospitals into four buckets. **Mature** (3+ years old, margin 25%+): 65% of beds, 73% of hospital revenue, 86% of hospital EBITDA, at a ${MT[0].marginPct}% margin. **Focus** (3+ years, 15-25% margin): 14% of beds at ${MT[1].marginPct}%. **Emerging** (under 3 years): 10% of beds, revenue +63%, margin ${MT[2].marginPct}% (Kasargod broke even in nine months). **Under-performing** (3+ years, below 15%): 11% of beds at ${MT[3].marginPct}%. Hospital-level EBITDA was ₹${n0(Q1.maturityTotal.opEbitda)} cr (${Q1.maturityTotal.marginPct}%) before ~₹60 cr of corporate costs and other businesses.` },
    { pair: [
      { type: 'column', title: 'Margins by bucket: 30% / 17% / 12% / 4%', unit: 'Q1FY27 operating EBITDA margin (%)', x: MT.map(m => m.bucket.split(' (')[0]), series: [{ name: 'Margin', values: MT.map(m => m.marginPct), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation p.12' },
      { type: 'column', title: 'Growth by bucket: the young and the weak grow fastest', unit: 'Q1FY27 YoY growth (%)', x: MT.map(m => m.bucket.split(' (')[0]), series: [{ name: 'Revenue', values: MT.map(m => m.revenueYoYPct), fmt: 'pct0' }, { name: 'EBITDA', values: MT.map(m => Math.min(m.ebitdaYoYPct, 100)), fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 presentation p.12 (EBITDA growth capped at 100% for display: emerging +240%, under-performing +422%)' },
    ] },
    { callout: '**Our view:** this is the most useful disclosure the merger has produced. If the focus and under-performing hospitals (25% of beds) reached the mature margin, hospital EBITDA would rise by ~₹340 cr a year (Q1FY27 run-rate): that, more than procurement, is the real synergy. But these are often hospitals in hard local markets; we assume only part of the gap closes by FY29E.' },
  ],
};

const PL = C.pipeline;
const expansion = {
  id: 'expansion', nav: 'Expansion pipeline', kicker: 'Growth plan', title: 'The next 4,179 beds: half brownfield, mostly in existing markets',
  blocks: [
    { p: `Management plans to add ~4,179 beds to reach ~15,077 (FY27 634, FY28 1,190, FY29 1,555, FY30+ 800); 53% are additions to existing hospitals, which ramp faster and cost less (₹0.8-1.0 cr a bed vs ~₹1.5 cr greenfield). The big new hospitals are Aster's: Trivandrum (454 beds, owned, ~Jan-2027), a 300-bed women & children hospital in Hyderabad (~Apr-2027) and Sarjapur, Bengaluru (450+ beds; phase I H2FY28). QCIL's ~1,700 beds are mostly brownfield blocks (Bhubaneswar, Raipur, Kottayam, Nagercoil, Banjara Hills) plus a greenfield in Indore. Planned spending: ~₹2,700 cr (Aster) + ~₹2,000 cr (QCIL) over 3-4 years.` },
    { exhibit: { type: 'table', title: 'Expansion pipeline (company)', head: ['Project', 'Beds', 'Timing (management)', 'Owner'], wide: [0, 2], rows: PL.map(p => [p.project, n0(p.beds), rup(p.timing), p.owner]), source: C.pipelineSrc } },
    { pair: [
      { type: 'stacked', title: 'Our build: new beds are ~10% of revenue by FY29E', unit: 'Revenue by source (₹ crore), GAM', x: YRS, series: [{ name: 'Existing 10,559 beds', values: exF.map(Math.round), fmt: 'num' }, { name: 'New beds', values: nwF.map(Math.round), fmt: 'num' }, { name: 'Labs, pharmacy, other', values: othF, fmt: 'num' }], minLabel: 100, source: 'GAM estimates (assumptions.json businessLines); sums to model revenue' },
      { type: 'column', title: 'Operational beds we model (weighted average)', unit: 'Operational beds in revenue (existing + new)', x: YRS, series: [{ name: 'Beds', values: totBeds, fmt: 'num' }], labels: 'all', source: 'GAM estimates' },
    ] },
    { callout: `**Our view:** the pipeline is credible because half of it is brownfield in mature clusters, but it is also slow: we assume new beds average 35-45% occupancy in their first years and contribute ₹${n0(nwF[2])} cr in FY29E (~${Math.round(nwF[2] / F.sales[2] * 100)}% of revenue). Each year of delay at Trivandrum, Hyderabad or Sarjapur costs ~₹150-250 cr of revenue in FY29E, but also defers start-up losses.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: strong in Kerala and in complex care; scale benefits still to be proven',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** there is a real moat in Kerala, where Aster and KIMSHEALTH together run ~4,600 beds with doctor franchises and international referral networks that new entrants cannot copy quickly, and in quaternary programmes that need scale to staff. Elsewhere the group is one of several strong local players (CARE in Hyderabad competes with Apollo, KIMS, Yashoda; Aster in Bengaluru with Manipal, Narayana, Fortis). Merging two regional chains does not by itself create pricing power: the benefits are cost and talent sharing, and those still have to be shown.' },
  ],
};

module.exports = { hospitals, maturity, expansion, moat };
