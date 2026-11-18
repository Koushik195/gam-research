// Deepak Fertilisers report, part B (3/5): Chemicals, Fertilisers and the growth projects. As of 30-Sep-2026.
const { ctx } = require('./DEEPAKFERT.ctx');
const { C, F, AS, n0, n1, SA, SQ, A26, A25, Q1, TRUE_SH } = ctx;
const CH = AS.segments.find(s => s.key === 'chem'), FE = AS.segments.find(s => s.key === 'fert');
const yrs = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const QT = SQ.filter(q => q.tanRev);
// Chemicals build (GAM, see assumptions.json _why): TAN kt, Rs/kg; IC; ammonia & other
const B = { tanKt: [650, 880, 930], tanRs: [58, 50, 48], ic: [2130, 2550, 2700], oth: [1500, 1300, 1300] };
const tanRev = i => B.tanKt[i] * B.tanRs[i] / 10;
const buildSum = i => tanRev(i) + B.ic[i] + B.oth[i];
const epsPerRsKg = 880 * 1e6 / 1e7 * (1 - 0.255) / TRUE_SH; // FY28E EPS per Rs1/kg of TAN margin

const chemicals = {
  id: 'chemicals', nav: 'Chemicals: TAN, acids, ammonia', kicker: 'Segment: Chemicals', title: 'Chemicals: a strong TAN and nitric acid franchise, with Q1FY27 profits that will not last',
  blocks: [
    { p: `The Chemicals segment (TAN, nitric acid, IPA, ammonia and Australian blasting services) earned EBIT of ₹${n0(A25.chemEbit)} cr in FY25 and ₹${n0(A26.chemEbit)} cr in FY26 on revenue of ~₹5,100-5,300 cr, i.e. EBITDA margins of 33% and 27% once segment depreciation is added back. **TAN** is the core: 577 kt sold in FY26 (+11%) at ~98% utilisation, ₹2,604 cr of revenue, 16-17% of it from mine-site services and bulk-explosive supply (B2C), which earn more than selling bags of nitrate. **Industrial chemicals** (₹1,842 cr): 302 kt of merchant nitric acid (~45% of India's merchant market per the annual report) and 63 kt of IPA; IPA depends on refinery propylene, which the government diverted to LPG during the 2026 gas crisis, so Q1FY27 IPA volumes fell 76%. **Ammonia**: the Taloja plant made 452 kt in FY26 (~93% of group needs) and was debottlenecked ~10% in the Q4FY26 shutdown; in its own books (PCL) it lost ₹257 cr after interest and depreciation, because it sells to group plants at internal prices. In Q1FY27 everything turned: segment EBIT ₹${n0(Q1.chemEbit)} cr on ₹${n0(Q1.chemRev)} cr (${n1(Q1.chemEbitPct)}%).` },
    { pair: [
      { type: 'column', title: 'Chemicals revenue and EBIT: FY23 peak, FY26 dip, Q1FY27 surge', unit: '₹ crore', x: yrs, series: [{ name: 'Revenue', values: yrs.map(y => Math.round(ctx.ann(y).chemRev)), fmt: 'num' }, { name: 'EBIT', values: yrs.map(y => Math.round(ctx.ann(y).chemEbit)), fmt: 'num' }], labels: 'none', source: 'Annual reports FY21-FY26 (consolidated segment notes)' },
      { type: 'column', title: 'TAN: volume dipped in Q1FY27, revenue jumped', unit: 'TAN revenue (₹ crore) and volume (kt)', x: QT.map(q => q.q), series: [{ name: 'Revenue (₹ cr)', values: QT.map(q => q.tanRev), fmt: 'num' }, { name: 'Volume (kt)', values: QT.map(q => q.tanVolKt), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Chemicals: how we build the forecast', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['TAN volume (kt)', '519', '577', ...B.tanKt.map(n0)],
      ['TAN revenue per kg (₹)', n1(A25.tanRealisation), n1(A26.tanRealisation), ...B.tanRs.map(String)],
      ['TAN revenue (₹ cr)', n0(A25.tanRev), n0(A26.tanRev), ...[0, 1, 2].map(i => n0(tanRev(i)))],
      ['Industrial chemicals (₹ cr)', n0(A25.icRev), n0(A26.icRev), ...B.ic.map(n0)],
      ['Ammonia sales, blasting services, other (₹ cr)', n0(A25.chemOtherRev), n0(A26.chemOtherRev), ...B.oth.map(n0)],
      { hl: true, cells: ['**Chemicals revenue (₹ cr)**', n0(A25.chemRev), n0(A26.chemRev), ...[0, 1, 2].map(i => `{{F.seg.chem.revenue.${i}|num}}`)] },
      ['Check: sum of the build (₹ cr)', '', '', ...[0, 1, 2].map(i => n0(buildSum(i)))],
      ['EBITDA margin', `${n1(A25.chemEbitdaPct)}%`, `${n1(A26.chemEbitdaPct)}%`, ...CH.marginPct.map(m => m + '%')],
      { hl: true, cells: ['**Chemicals EBITDA (₹ cr)**', n0(A25.chemEbitda), n0(A26.chemEbitda), ...[0, 1, 2].map(i => `{{F.seg.chem.adjEbitda.${i}|num}}`)] },
    ], source: 'Company (FY25-26: segment notes and presentations), GAM estimates. EBITDA = segment EBIT + segment D&A' } },
    { callout: `**What we assume and why.** FY27E: Q1 as reported, then ~34% margins for Q2-Q4 (ammonia already ~$600/t by end-July vs ~$800 in May-June; a full quarter of Equinor gas from Q2; Gopalpur and Dahej from H2). FY28E: TAN at ~₹50/kg and ~₹16,000/t of EBITDA on 880 kt (Emkay assumed ~₹14,500/t before the war), ammonia ~₹550 cr, blasting ~₹120 cr, industrial chemicals ~₹600 cr = ~32%. **Sensitivity:** every ₹1/kg of TAN margin on 880 kt moves FY28E EPS by ~₹${n1(epsPerRsKg)}; holding Q1FY27's ~47% Chemicals margin through FY28E would add roughly ₹1,200 cr of EBITDA. Our bull case assumes only part of that (+4 points of margin).` },
  ],
};

const FQ = SQ.filter(q => q.cnbRev);
const fertilisers = {
  id: 'fertilisers', nav: 'Fertilisers', kicker: 'Segment: Fertilisers (crop nutrition)', title: 'Fertilisers: half the revenue, a fifth of the profit, and the subsidy calendar decides the margin',
  blocks: [
    { p: `Mahadhan AgriTech sells ~₹6,200 cr a year of fertilisers: manufactured NP and NPK grades (NPK 494 kt and nitrophosphate 241 kt in FY26, both lower than FY25 as plants ran at ~54-75%), Croptek crop-specific blends (248 kt), Bensulf and water-soluble products, and ~₹1,760 cr of traded DAP/MOP. Specialty products and Croptek were 33% of segment revenue in FY26 and 43% in Q1FY27. Segment EBIT was ₹${n0(A25.fertEbit)} cr in FY25 and ₹${n0(A26.fertEbit)} cr in FY26 (${n1(A26.fertEbitPct)}%), but only ₹${n0(Q1.fertEbit)} cr in Q1FY27 (${n1(Q1.fertEbitPct)}%): phosphoric acid was $1,360/t (+18% YoY), sulphur costs cut Bensulf volumes 44%, rains were late, and the Kharif subsidy (+12% in outlay) did not cover the cost increase. The government held DAP and urea prices before state elections, which capped the premium Deepak could charge on NPKs (CMD, May-2026).` },
    { pair: [
      { type: 'column', title: 'Fertiliser revenue doubled since FY20; EBIT did not keep up', unit: '₹ crore', x: yrs, series: [{ name: 'Revenue', values: yrs.map(y => Math.round(ctx.ann(y).fertRev)), fmt: 'num' }, { name: 'EBIT', values: yrs.map(y => Math.round(ctx.ann(y).fertEbit)), fmt: 'num' }], labels: 'none', source: 'Annual reports FY21-FY26 (segment notes)' },
      { type: 'column', title: 'Crop nutrition revenue by quarter: Q3 is the Rabi peak', unit: 'Crop nutrition revenue (₹ crore)', x: FQ.map(q => q.q), series: [{ name: 'Revenue', values: FQ.map(q => q.cnbRev), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Fertilisers: forecast', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue (₹ cr)', n0(A25.fertRev), n0(A26.fertRev), ...[0, 1, 2].map(i => `{{F.seg.fert.revenue.${i}|num}}`)],
      ['growth', '+33%', '+20%', ...FE.growth.map(g => `+${g}%`)],
      ['EBITDA margin', `${n1(A25.fertEbitdaPct)}%`, `${n1(A26.fertEbitdaPct)}%`, ...FE.marginPct.map(m => m + '%')],
      { hl: true, cells: ['**EBITDA (₹ cr)**', n0(A25.fertEbitda), n0(A26.fertEbitda), ...[0, 1, 2].map(i => `{{F.seg.fert.adjEbitda.${i}|num}}`)] },
    ], source: 'Company, GAM estimates. Rabi 2026-27 NBS rates were not known on 30-Sep-2026 and are not assumed' } },
    { callout: '**Our view:** this is a decent regional brand in a policy-set market. When subsidies track costs (FY21-23, FY25) it earns 7-10% EBITDA margins; when they lag (FY24, Q1FY27) it earns close to nothing. We assume 5.5% for FY27E and a return to 7.5-8% in FY28-29E, below FY25. The fertiliser business also ties up working capital: ₹751 cr of subsidy was owed by the government at Mar-26 (₹619 cr a year earlier), which is one reason FY26 operating cash flow was so weak.' },
  ],
};

const projects = {
  id: 'projects', nav: 'Growth projects', kicker: 'Growth projects', title: 'Gopalpur and Dahej: almost built, three times delayed, and about to change the scale of the company',
  blocks: [
    { exhibit: { type: 'table', title: 'The two projects', head: ['', 'Gopalpur (Odisha) TAN', 'Dahej (Gujarat) nitric acid'], rows: [
      ['Capacity', '376 ktpa TAN (~963 ktpa group total)', '300 ktpa weak + 150 ktpa concentrated nitric acid'],
      ['Capex', '₹2,675 cr (Emkay: ~₹2,200 cr first estimate)', '₹1,983 cr'],
      ['Progress', 'Nov-25 ~87% · May-26 95% · Jul-26 96%', 'Q2FY26 ~70% · May-26 86% · Jul-26 93%'],
      ['Commissioning guidance', 'Q4FY26 → Q1FY27 → Q2FY27', 'Q4FY26 → Q1FY27 → Q2FY27'],
      ['Debt', '₹1,099 cr of project loans (9.5%), repaid from Dec-2027', '₹641 cr (8.6-8.85%), repaid from Q2FY28'],
      ['Commercial logic', 'Near eastern coal mines; port-based for exports; runs on bought/imported ammonia', '65% of CNA under a 20-year contract; close to Gujarat nitro-aromatics buyers'],
      ['Our volume assumption', '~90 kt (FY27E), ~300 kt (FY28E), ~350 kt (FY29E)', 'Ramp through FY28E'],
    ], source: 'Company presentations (May/Jul-2026); Annual Report 2025-26 note 21; Emkay (Nov-2025)' } },
    { exhibit: { type: 'table', title: 'Guidance record', head: ['When said', 'Promise', 'What happened'], wide: [1, 2], rows: [
      ['FY23-FY24', 'Taloja ammonia plant at the first budget (~₹2,900 cr per Emkay)', 'Cost ~₹4,350 cr (Emkay); plant capitalised in FY24 just as ammonia prices fell'],
      ['Nov-2025', 'Gopalpur and Dahej in Q4FY26', 'Slipped to Q1FY27, then Q2FY27 (skilled-labour shortages around state elections, LPG shortage)'],
      ['May-2026', 'Gopalpur at 90-95% utilisation by end-FY27', 'Jul-2026: "~80% by Q4FY27"'],
      ['Feb-2024', 'Equinor LNG from 2026', 'First cargo May-2026, on time'],
      ['May-2026', 'FY27 capex ₹800-1,000 cr; normal maintenance from FY28', 'Q1FY27 capex ₹515 cr; on track'],
    ], source: 'Company calls (May-2026, Jul-2026), presentations; Emkay initiation (Nov-2025)' } },
    { callout: '**Honest verdict:** the projects are real and nearly finished; the risk now is the ramp-up and the margin, not the construction. Gopalpur arrives into a TAN market that was short in 2026 but will loosen as Russian supply returns and new Indian capacity comes, and it buys ammonia at market prices. We therefore model a gradual fill (~80% by FY28E) and a lower margin than Taloja\'s.' },
  ],
};

module.exports = { chemicals, fertilisers, projects, buildSum };
