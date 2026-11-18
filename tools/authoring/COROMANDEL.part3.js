// Coromandel initiation, part 3: industry, tailwind test, Nutrient & allied, backward integration,
// crop protection and NACL.
const X = require('./COROMANDEL.ctx');
const { C, F, n0, n1, SRC, SA, SQ, QL, FYS, ann, A26, A25, A24, Q1 } = X;
const nutF = F.years.map((_, i) => Math.round(F.seg.nut.adjEbitda[i] / F.seg.nut.revenue[i] * 1000) / 10);
const cpF = F.years.map((_, i) => Math.round(F.seg.cp.adjEbitda[i] / F.seg.cp.revenue[i] * 1000) / 10);
const sq = SQ.filter(q => q.cpSaRev != null);

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Indian fertilisers: steady demand, imported inputs, and a subsidy that sets the margin',
  blocks: [
    { p: 'India used 71 mt of fertilisers in FY26 (POS sales), up from 63 mt in FY23. Urea (40 mt) is fully price-controlled; DAP (9 mt), NPK complexes (14 mt) and SSP (5.5 mt) are under the NBS scheme. NPKs have taken share from DAP and are now ~60% of phosphatics. Two features matter for Coromandel. **First, inputs are imported:** India relies on imports for more than 80% of its ammonia and sulphur and much of its phosphoric acid and rock, so costs follow world prices and the rupee (₹92.6-96.8 per $ in Q1FY27). **Second, the margin is a policy outcome:** the government revises NBS rates each season, and in a cost spike it decides how much of the increase the industry absorbs. In Q1FY27 industry DAP+NPK production fell 21% and imports 38% because the Kharif 2026 rates (+~10%) did not cover the Middle East-driven jump in costs.' },
    { exhibit: { type: 'table', title: 'Indian fertiliser market (million tonnes)', head: ['', 'Consumption FY23', 'FY24', 'FY25', 'FY26', 'Production FY26', 'Imports FY26'], rows: [
      ['Urea', '35.7', '35.8', '38.8', '39.7', '29.3', '10.3'], ['DAP', '10.4', '10.8', '9.3', '9.4', '3.9', '6.2'], ['NPK complexes', '10.1', '11.1', '14.2', '14.1', '12.0', '3.7'],
      ['SSP', '5.0', '4.5', '4.9', '5.5', '5.7', '–'], ['MOP', '1.6', '1.6', '2.2', '2.3', '–', '2.9'],
      { hl: true, cells: ['**Total**', '62.9', '63.8', '69.4', '71.0', '50.9', '23.1'] },
    ], source: 'Fertiliser Association of India, via Coromandel Integrated Report 2025-26 (MD&A)' } },
    { exhibit: { type: 'table', title: 'Market forces at 30-Sep-2026', head: ['Theme', 'Direction', 'What it means for Coromandel'], wide: [2], rows: [
      ['Middle East crisis (from Q4FY26): ammonia ~$840-850/t, sulphur ~$800/t, phosphoric acid $1,700/t for Q2FY27', 'Headwind', 'Input costs up 25%+; own acid and Senegal rock cushion part of it.'],
      ['NBS Kharif 2026: +~10% for N, P and S; rabi 2026-27 not yet announced', 'Headwind (pending)', 'Q1 fertiliser PBIT −24%; H2 depends on the rabi rates.'],
      ['2026 monsoon 87% of normal; south peninsula 76%; southern reservoirs low', 'Headwind', 'Rabi demand risk in AP, Telangana and Karnataka, the core markets.'],
      ['Shift from DAP to NPK and SSP; government push on balanced nutrition and QR-code sales tracking', 'Tailwind', 'Favours the largest NPK and SSP maker; tracking could curb DAP/urea overuse.'],
      ['Reasonable-margin guidelines for P&K fertilisers', 'Headwind (pending)', 'Could cap the profit from backward integration.'],
      ['Agrochemicals: destocking over; China keeps AI prices low', 'Mixed', 'Exports recovering; Coromandel\'s molecules face less Chinese competition.'],
    ], source: 'Company calls (May/Jul-2026), Cabinet NBS approval (Apr-2026), IMD (30-Sep-2026), Integrated Report 2025-26' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Coromandel captures the structural shifts, not the cost shock',
  blocks: [
    { verdicts: [
      ['Shift from DAP to NPK complexes', 'Yes', 'DAP+NPK sales 3.15 mt (FY20) → 4.28 mt (FY26); consumption share 17.5%; 35% unique grades.', 'Core of the franchise.'],
      ['Import substitution in acid and rock', 'Yes (from FY27)', 'Own phosphoric acid now 60% of needs; Senegal rock 3.5 lakh t (FY26), ~5 lakh t run-rate.', 'Margin support once raw materials normalise.'],
      ['Higher global fertiliser prices', 'No', 'Revenue up, margins down: Nutrient PBIT margin 6.9% in Q1FY27 vs 9.9%.', 'Under NBS, price spikes hurt before policy catches up.'],
      ['Balanced nutrition / specialty nutrients', 'Partly', 'Specialty nutrients growing 25-30% at ~20% EBITDA margin; SSP premium grades >50%.', 'Small in group terms; not disclosed separately.'],
      ['Agrochemical recovery and China+1', 'Yes', 'Standalone CP EBIT +55% in FY26 and +44% in Q1FY27.', 'The fastest-growing profit pool.'],
      ['Rural retail and agri services', 'Partly', '~1,200 stores, retail revenue +85% in Q1FY27, 76% of stores profitable.', 'Distribution moat; profit not disclosed.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

const nutrient = {
  id: 'nutrient', nav: 'Nutrient & allied', kicker: 'Segment', title: 'Nutrient & allied: the leader, at the mercy of the subsidy table',
  blocks: [
    { pair: [
      { type: 'column', title: 'Nutrient revenue by quarter', unit: 'Revenue (₹ crore)', x: QL, series: [{ name: 'Nutrient & allied', values: SQ.map(q => q.nutRev), fmt: 'num' }], labels: 'all', source: SRC + '; Q1FY25 derived' },
      { type: 'column', title: 'Nutrient PBIT: ₹479 cr in Q1FY27, −24%', unit: 'Segment PBIT (₹ crore)', x: QL, series: [{ name: 'PBIT', values: SQ.map(q => q.nutEbit), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { bullets: [
      `**Volume leader.** Record DAP+NPK sales of 4.3 mt in FY26 (+7%), 17.5% of consumption, and record production of 3.5 mt. In Q1FY27 it deliberately cut production to 6.9 lakh t (72% utilisation) to avoid high-cost inventory; volumes fell 9% but primary share rose to 22% (18%).`,
      `**Margins are the problem.** Segment EBITDA margin: ${SA.map(a => `${a.nutEbitdaPct}% (${a.fy})`).slice(3).join(', ')}. Manufactured EBITDA was "₹5,000 plus" a tonne in FY26 and below ₹3,500 in Q4FY26; trading earns 4-5%. Management's ₹6,500 target needs normal raw-material prices.`,
      `**Subsidy dependence.** Government subsidy was ₹11,139 cr of the segment's ₹27,727 cr revenue in FY26 (40%); the subsidy business was 85% of FY26 revenue and 66% of EBITDA (77% and 48% in Q1FY27). Receivables from the government: ₹2,168 cr (Mar-26), ₹3,254 cr (Jun-26).`,
      `**Beyond DAP/NPK.** SSP 8.4 lakh t (#1, >50% premium grades, ₹2,500-3,000/t); specialty nutrients +25-30% a year at ~20% margin; nano DAP ~50-60% share but banned in UP and Maharashtra; ~1,200 retail stores (revenue +85% in Q1FY27); Senegal rock now consolidated.`,
    ] },
    { pair: [
      { type: 'column', title: 'NPK+DAP volumes: imports fell in Q1FY27', unit: 'Sales volume (lakh tonnes)', x: QL, series: [{ name: 'Manufactured', values: SQ.map(q => q.volMfd), fmt: 'n1' }, { name: 'Imported', values: SQ.map(q => q.volImp), fmt: 'n1' }], labels: 'none', source: SRC },
      { type: 'column', title: 'Our forecast: Nutrient EBITDA back above ₹3,600 cr by FY28E', unit: 'Nutrient & allied EBITDA (₹ crore)', x: ['FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'EBITDA', values: [ann('FY23').nutEbitda, A24.nutEbitda, A25.nutEbitda, A26.nutEbitda, ...F.seg.nut.adjEbitda].map(v => Math.round(v)), fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
    ] },
    { callout: `**Our view:** a strong franchise with no pricing power. We model revenue +10% / +8% / +7% (FY27-29E) and EBITDA margin ${nutF.join('% / ')}%: FY27 absorbs the subsidy gap in H1 and a weak southern rabi; FY28-29 benefit from own acid, Senegal rock and the granulation train, but stay at FY25 margin levels. Every 1 point of Nutrient margin moves FY28E EPS by ~₹${n1(X.nutPt)}.` },
  ],
};

const projects = {
  id: 'projects', nav: 'Backward integration', kicker: 'Projects', title: 'Backward integration: the right strategy, with the costs arriving first',
  blocks: [
    { p: 'Coromandel spent ~₹7,000 cr in three to four years (management) on four things: (1) a 2,000 TPD sulphuric acid and 650 TPD (~2 lakh t a year) phosphoric acid plant at Kakinada, commissioned in March 2026, which lifts own acid to ~60% of needs; (2) control of BMCC, a rock phosphate mine in Senegal (71.5%), producing 3.5 lakh t in FY26 and heading for ~5 lakh t; (3) a 7.5 lakh t granulation train at Kakinada, due in Q4FY27, half to be sold through its own stores; (4) NACL Industries (₹820 cr). Smaller projects: a technical MAP plant, seaweed granulation, mancozeb capacity and a fluorination launch plant for CDMO.' },
    { exhibit: { type: 'table', title: 'Projects (as stated by Sep-2026)', head: ['Project', 'Cost (₹ cr)', 'Status / timing'], wide: [0, 2], rows: C.capex.projects.map(p => [p.project, p.cost ? (typeof p.cost === 'number' ? n0(p.cost) : p.cost) : 'n.d.', p.status]), source: 'Company calls (May/Jul-2026), Integrated Report 2025-26; n.d. = not disclosed' } },
    { pair: [
      { type: 'column', title: 'Capex peaked in FY26; we model ₹600-900 cr', unit: 'Capex (₹ crore)', x: 'fin.labels', from: 'FY19', series: [{ name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
      { type: 'column', title: 'Depreciation: ₹534 cr (FY26) to ~₹870 cr (FY29E)', unit: 'Depreciation & amortisation (₹ crore)', x: 'fin.labels', from: 'FY19', series: [{ name: 'D&A', ref: 'fin.dep', fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
    ] },
    { callout: '**Our view:** the logic is sound: owning acid and rock removes the most volatile part of the cost base, and the ~2-year payback discussed on the Q2FY26 call ($250-300 of margin per tonne of acid on ~₹1,000-1,100 cr of capex, i.e. up to ~₹500 cr a year on ~2 lakh t) is plausible at normal sulphur prices. But in Q1FY27 sulphur was so expensive that the new acid plant ran at moderate rates, and the new assets added ~₹80 cr a quarter of depreciation and amortisation. We give the projects credit from FY28 (Nutrient margin 11.0%) rather than in FY27.' },
  ],
};

const crop = {
  id: 'crop', nav: 'Crop protection & NACL', kicker: 'Segment', title: 'Crop protection: a good business that has just added a weaker one half its size',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'CP revenue: standalone plus NACL from Q2FY26', unit: 'Crop protection revenue (₹ crore)', x: sq.map(q => q.q), series: [{ name: 'Coromandel standalone', values: sq.map(q => q.cpSaRev), fmt: 'num' }, { name: 'NACL (consolidated less standalone)', values: sq.map(q => q.naclRev || 0), fmt: 'num' }], minLabel: 150, source: SRC },
      { type: 'line', title: 'Standalone margin ~19%; consolidated lower', unit: 'PBIT margin (%)', x: sq.map(q => q.q), series: [{ name: 'Standalone', values: sq.map(q => Math.round(q.cpSaEbit / q.cpSaRev * 1000) / 10), fmt: 'pct' }, { name: 'Consolidated (incl. NACL)', values: sq.map(q => q.cpEbitPct), fmt: 'pct' }], labels: 'last', min: 0, max: 25, source: SRC },
    ] },
    { bullets: [
      '**Standalone is strong.** Revenue ₹3,054 cr in FY26 (+16%), PBIT ₹569 cr (+55%, 19% margin); Q1FY27 revenue +20% to ₹870 cr and EBIT +44% to ₹159 cr on exports, B2B and price pass-through. New products were 32% of domestic B2C sales. Guidance: 20-25% growth at ~19% margin; 20,000 t more mancozeb at Sarigam.',
      `**NACL is a turnaround, not yet a compounder.** Bought for ₹820 cr (53%) at ₹76.70 a share; a ₹250 cr rights issue cut its debt. FY26 revenue ₹1,585 cr, EBITDA ₹103 cr; Q1FY27 revenue ₹383 cr (export prices weaker), EBITDA ₹41 cr (11%). Management: 11% is a "reasonable level"; more needs new products over 2-3 years. In consolidation it lost ₹64 cr in FY26 after ~₹80 cr a year of acquisition amortisation, and 46% of its profit belongs to minorities.`,
      '**Next steps:** CDMO/fluorination launch plant at Ankleshwar, intermediates for MNCs using NACL\'s spare capacity, Latin America push. None is quantified.',
    ] },
    { callout: `**Our view:** this is the part of Coromandel the bulls are paying for, and it deserves a higher multiple than fertilisers. But it is ~16% of segment EBITDA today and ~22% in FY29E. We model revenue +30% / +14% / +12% and EBITDA margin ${cpF.join('% / ')}%, taking segment EBITDA from ₹${n0(A26.cpEbitda)} cr (FY26) to ₹{{F.seg.cp.adjEbitda.2|num}} cr (FY29E).` },
  ],
};

module.exports = { industry, tailwind, nutrient, projects, crop };
