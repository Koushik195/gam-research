// Ather Energy report, part 3: volumes and capacity (Konarc / core-range build), unit economics and margins
// (gross margin, subsidy dependence, commodities, fixed costs), and the moat.
const X = require('./ATHERENERG.ctx');
const { C, D, SA, SQ, QL, A26, F, AS, bld, n0, n1, pc, pc1, rup } = X;
const CAP = C.capacity, AK = C.annualKpis, Q1K = X.QK.find(q => q.q === 'Q1FY27');
const g = (a, p) => pc1((a / p - 1) * 100);

const volumes = {
  id: 'volumes', nav: 'Volumes & capacity', kicker: 'Volume drivers', title: 'Volumes: demand is not the limit, the factory is',
  blocks: [
    { p: `Ather dispatched ${n0(A26.units)} scooters in FY26 (+69%) and 83,173 in Q1FY27 (+81%), even though April production was only 24,000 (labour shortages, West Asia supply disruption) before reaching 28,000 in May and 31,000 in June. By August Hosur was running at its ~${n0(CAP.hosurPerMonth)}-a-month ceiling. Management estimates it could have sold another 13-15k a month in Q1. The step-up comes from AURIC: equipment installation was finishing in Aug-2026, trial output from the festive season, reliable output from January 2027 and a 4-5 month ramp to ${n0(CAP.auricPhase1PerMonth)} a month, taking capacity to ~77,000 a month (9.2 lakh a year) by around Q1FY28. AURIC is dedicated to the Konarc/EL platform; Hosur can make up to 18,000 Konarcs a month instead of Rizta if needed.` },
    { pair: [
      { type: 'column', title: 'Production rose to the Hosur ceiling in Q1FY27', unit: 'Scooters produced per month', x: Object.keys(C.q1fy27.monthlyProduction), series: [{ name: 'Production', values: Object.values(C.q1fy27.monthlyProduction), fmt: 'num' }], labels: 'all', lines: [{ v: CAP.hosurPerMonth, text: 'Hosur ceiling ~35,000', color: '#b4232a' }], source: 'Q1FY27 call (3-Aug-2026)' },
      { type: 'column', title: 'Capacity: 4.2 lakh today, 9.2 lakh with AURIC Phase 1', unit: 'Annual capacity (units)', x: ['Hosur (now)', '+ AURIC Phase 1 (Q4FY27-Q1FY28)', '+ AURIC Phase 2 (not started)'], series: [{ name: 'Capacity', values: [CAP.hosurPerYear, CAP.totalAfterPhase1, CAP.totalAfterPhase2], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation and call' },
    ] },
    { exhibit: { type: 'table', title: 'Our volume and revenue build', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Konarc (EL platform) units', '–', ...bld.map(r => n0(r.ku * 1000))],
      ['450 / Rizta units', n0(A26.units), ...bld.map(r => n0(r.cu * 1000))],
      { hl: true, cells: ['**Total units**', `**${n0(A26.units)}**`, ...bld.map(r => `**${n0(r.units)}**`)] },
      ['  growth', '+69%', ...bld.map((r, i) => g(r.units, i ? bld[i - 1].units : A26.units))],
      ['Konarc share of units', '–', ...bld.map(r => `${Math.round(r.konarcShare)}%`)],
      ['Revenue per unit: Konarc / core (₹ \'000)', `– / ${n0(AK[2].revenuePerUnit / 1000)}`, ...AS.build.konarcRpu.map((kk, i) => `${kk} / ${AS.build.coreRpu[i]}`)],
      ['Revenue per unit, blended (₹)', n0(AK[2].revenuePerUnit), ...bld.map(r => n0(r.rpu))],
      { hl: true, cells: ['**Revenue (₹ crore)**', `**${n0(A26.revenue)}**`, ...bld.map(r => `**${n0(r.rev)}**`)] },
      ['Capacity at year-end (a year)', n0(CAP.hosurPerYear), n0(CAP.totalAfterPhase1), n0(CAP.totalAfterPhase1), `${n0(CAP.totalAfterPhase1)} (Phase 2 under way)`],
    ], source: 'Company; GAM estimates (assumptions.json "build"); model and build agree on volume and revenue' } },
    { callout: `**Our view:** FY27E ${n0(F.volume[0])} (+${n1(AS.volume.growth[0])}%) is mostly arithmetic: Hosur full for three quarters plus ~37k from AURIC in Q4. FY28E (${n0(F.volume[1])}) assumes AURIC is used at ~76% on average and that Ather holds a ~19% share of an e-2W market growing ~45%; Nomura is higher (~7.9 lakh). FY29E (${n0(F.volume[2])}) is ~93% of Phase 1 capacity: anything above needs Phase 2, which was not committed by 30-Sep-2026.` },
  ],
};

const economics = {
  id: 'economics', nav: 'Unit economics & margins', kicker: 'Unit economics', title: 'Unit economics: gross margin up 15 points in two years, no longer subsidy-led, but commodities bite',
  blocks: [
    { p: `Ather's adjusted gross margin (AGM, revenue less materials, on total income) rose from 9% in FY24 to 19% in FY25 and 24% in FY26; **without the government subsidy it went from 12% in FY25 to 21% in FY26**, because the materials cost per scooter fell 9% in FY26 (₹1,10,199) through design changes (LFP cells, cheaper electronics), supplier localisation and volume. The subsidy is now only ~3% of revenue (16% in FY24), so a further cut would hurt less than it did in 2023. Then commodities turned: the company's index rose 46% in five quarters (lithium hydroxide +131%, copper, aluminium, plastics), costing ~5.6 points of gross margin in Q1FY27 (AGM 22.4% vs 25.4% at the end of Q4). Price rises (ASP ₹1.50 lakh → ₹1.61 lakh by June) and the software pack offset part of it.` },
    { pair: [
      { type: 'line', title: 'Revenue per scooter: up with price rises; Konarc will dilute it', unit: 'Revenue ÷ scooters sold (₹ \'000)', x: QL, series: [{ name: 'Revenue per scooter', values: SQ.map(q => Math.round(q.revenue * 1e7 / q.units / 100) / 10), fmt: 'n1' }], labels: 'ends', source: 'Screener.in revenue ÷ company volumes' },
      { type: 'column', title: 'Subsidy share of revenue: 16% → 3% in two years', unit: 'Subsidy, % of revenue', x: SA.map(a => a.fy), series: [{ name: 'Subsidy', values: SA.map(a => a.subsidyPct), fmt: 'pct0' }], labels: 'all', source: 'AR FY26 MD&A' },
    ] },
    { p: 'Below gross margin, about three-quarters of costs (staff, marketing, R&D expensed, rent, IT) are fixed (management). Q1FY27 showed the leverage: employee costs fell to 10% of revenue (18% a year earlier) and other expenses to 13% (22%), so EBITDA before other income improved to −2.7% even as gross margin fell. From Q4FY27 AURIC\'s staff and overheads start, and Konarc\'s lower prices arrive before its lower costs. ESOP charges (₹58 cr in FY26) are inside employee costs and our margins.' },
    { exhibit: { type: 'table', title: 'From gross margin to EBITDA (% of revenue, Screener basis)', head: ['', 'FY24', 'FY25', 'FY26', 'Q1FY27', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Material cost', '{{A.materialPct.4|pct0}}', '{{A.materialPct.5|pct0}}', '{{A.materialPct.6|pct0}}', '80%', '–', '–', '–'],
      ['Employee cost', '{{A.employeePct.4|pct0}}', '{{A.employeePct.5|pct0}}', '{{A.employeePct.6|pct0}}', '10%', '–', '–', '–'],
      { hl: true, cells: ['**EBITDA margin**', '{{A.ebitdaMargin.4|pct}}', '{{A.ebitdaMargin.5|pct}}', '{{A.ebitdaMargin.6|pct}}', '−2.7%', '**{{F.ebitdaMargin.0|pct}}**', '**{{F.ebitdaMargin.1|pct}}**', '**{{F.ebitdaMargin.2|pct}}**'] },
    ], source: 'Screener.in cost schedules; GAM estimates. Forecast costs are not split by line.' } },
    { callout: '**Our view:** the margin story is operating leverage first and gross margin second. We model gross margin flat to slightly down (Konarc, commodities) and fixed costs up ~30% in FY28E, giving EBITDA of {{F.ebitdaMargin.1|pct}} in FY28E and {{F.ebitdaMargin.2|pct}} in FY29E. The bulls\' 15-20% long-run margin needs both: a recovering gross margin and incumbent-like scale.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a strong brand and software layer, but no moat yet',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls, Vahan, broker notes to Sep-2026)' },
    { callout: `**Honest verdict:** Ather has the best product and software ecosystem among Indian e-scooter makers and the pricing power to show it (ASP ~₹1.61 lakh, ${Q1K.proPackAttachPct}% software attach). That is an edge, not a moat. Incumbents with ten times Ather's two-wheeler volume, larger dealer and service networks and profitable petrol businesses are growing faster in 2026, and nothing stops them copying features. Ather has not yet earned an operating profit over a full year.` },
  ],
};

module.exports = { volumes, economics, moat };
