// Neuland Laboratories report, part 3: CMS (contract manufacturing) and molecule/customer concentration, generic APIs (Prime and
// Specialty), plants, USFDA status, capacity and capex.
const X = require('./NEULANDLAB.ctx2');
const { C, A, AS, n0, n1, rup, SA, SQ, LINES, YRS, BL, ai } = X;
const CM = C.cms, CAP = C.capacity;

const cms = {
  id: 'cms', nav: 'CMS: the profit engine', kicker: 'Segment', title: 'CMS: ₹282 cr to ₹1,244 cr in four years on commercial molecules; about three molecules and five customers carry it, and the quarters are lumpy',
  blocks: [
    { p: `CMS earns money in two ways. **Development** revenue comes from process research and from batches for clinical trials and launches (₹98 cr in FY26, down from ₹303 cr in FY24, when launch quantities were large). **Commercial** revenue comes from supplying the API of an approved drug for as long as the innovator orders it (₹1,146 cr in FY26, from ₹114 cr in FY22). Neuland is usually written into the innovator's regulatory filing, which makes it hard to replace, but it also means its revenue rises and falls with a few drugs. The CEO is candid: "CMS commercial is being driven by a handful of molecules... maybe about 3 of them that really drive our business", with "a fairly healthy future for them over the next 5 to 6 years", but "there will be lumpiness". Neuland does not name them. Brokers and analysts link its commercial supplies to **xanomeline** (in BMS's schizophrenia drug Cobenfy, approved in the US in Sep-2024), **bempedoic acid** (Esperion's cholesterol drug; Daiichi Sankyo in Europe) and **deutetrabenazine** (Teva's Austedo) (B&K, Oct-2024; Q4FY26 call). Esperion received a takeover bid in May-2026; management says supply agreements usually survive a change of owner.` },
    { pair: [
      { type: 'stacked', title: 'Quarterly CMS revenue: ₹114 cr (Q4FY25) to ₹531 cr (Q4FY26)', unit: 'CMS revenue (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'Commercial', values: SQ.map(q => q.cmsCommercial), fmt: 'num' }, { name: 'Development', values: SQ.map(q => q.cmsDevelopment), fmt: 'num' }], minLabel: 40, source: 'Company decks (Q4FY25, Q4FY26, Q1FY27)' },
      { type: 'column', title: 'CMS concentration rose as molecules scaled', unit: 'Share of CMS revenue (%)', x: ['FY23', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Top 5 products', values: [75, 86, 94, 96], fmt: 'pct0' }, { name: 'Top 5 customers', values: [77, 90, 93, 96], fmt: 'pct0' }], labels: 'all', source: 'Company decks (Key Operating Metrics)' },
    ] },
    { exhibit: { type: 'table', title: 'The CMS project funnel (number of active projects)', head: ['Stage', 'Q4FY23', 'Q4FY24', 'Q4FY25', 'Q4FY26', 'Q1FY27', 'What it means'], wide: [6], rows: [
      ['Pre-clinical', '25', '16', '21', '20', '17', 'Process research; small revenue'],
      ['Phase 1', '9', '12', '20', '22', '23', 'Clinical batches'],
      ['Phase 2', '11', '21', '20', '20', '20', 'Larger batches; most fail'],
      ['Phase 3', '6', '7', '8', '10', '13', 'Launch-quantity orders if approved'],
      ['Pre-registration / registered', '15', '14', '9', '7', '7', 'Filed, or Neuland being added as a second source'],
      { hl: true, cells: ['**Commercial**', '**21**', '**18**', '**19**', '**19**', '**19**', '**The revenue engine**'] },
      ['Total', '87', '88', '97', '98', '99', ''],
    ], source: 'Company decks (Q4FY23, Q4FY25, Q4FY26, Q1FY27)' } },
    { p: `**Concentration in numbers.** In FY26 the top five CMS customers were 93% of CMS revenue and the top five CMS products 94%; company-wide, three customer groups each above 10% of revenue were together ₹1,088 cr, 54% of revenue (34% in FY25; AR note 38). In Q1FY27 the top five customers were 70% of the whole company's revenue. The number of commercial projects has not moved (18-21 since FY23): growth has come from bigger volumes on the same few molecules, not from more molecules. Management expects one new commercialisation in FY27 and one or two in FY28, and says 13 phase-3 projects and new peptide programmes could "completely overshadow the current pipeline" in three to five years.` },
    { callout: `**Our forecast:** CMS +27% in FY27 to ₹${n0(LINES.cms[0])} cr (Q1 already ₹438 cr vs ₹133 cr), +20% in FY28 and +18% in FY29 to ₹${n0(LINES.cms[2])} cr, ~69% of revenue. The risk is not the trend but the shape: one customer destocking, second-sourcing or losing its brand's momentum could cut a year's growth, as FY25 showed (CMS −17%).` },
  ],
};

const gds = {
  id: 'gds', nav: 'Generic APIs (Prime & Specialty)', kicker: 'Segment', title: 'Generic APIs: Prime and Specialty fell 9% in FY26 to ₹688 cr; Specialty carries the margin but lost 16% on one customer\'s delays',
  blocks: [
    { p: `Neuland's generic business (GDS) sold ₹${n0(SA[4].gds)} cr of APIs in FY26, about the same as in FY22 (₹${n0(SA[0].gds)} cr). **Prime APIs** (₹${n0(SA[4].prime)} cr, 23% of revenue) are mature, large-volume molecules where Neuland competes on process cost and reliability; management calls them low-margin, and they fell ~5% in FY26 (CRISIL). Ezetimibe and mirtazapine were the main contributors and ezetimibe is "likely to drive growth". **Specialty APIs** (₹${n0(SA[4].specialty)} cr, 11%) are complex, often sterile or patent-protected molecules sold to a few customers; they fell ~16% in FY26 as paliperidone shipments were delayed by "operational challenges at the customer end", while apixaban, donepezil and sterile aripiprazole held up. Two DMFs (vonoprazan, edoxaban) were filed in FY26, and in Aug-2026 Neuland announced a strategic collaboration with Gland Pharma for sterile APIs, an asset-light way to sell niche injectable molecules.` },
    { pair: [
      { type: 'column', title: 'Prime and Specialty revenue, FY22-FY26', unit: 'Revenue (₹ crore)', x: SA.map(s => s.fy), series: [{ name: 'Prime', values: SA.map(s => Math.round(s.prime)), fmt: 'num' }, { name: 'Specialty', values: SA.map(s => Math.round(s.specialty)), fmt: 'num' }], labels: 'all', source: 'Company decks (disclosed shares × revenue); CRISIL confirms FY26 −5% / −16%' },
      { type: 'line', title: 'Share of revenue: generics from 67% (FY22) to 34% (FY26)', unit: '% of revenue', x: SA.map(s => s.fy), series: [{ name: 'Prime', values: SA.map(s => s.primePct), fmt: 'pct0' }, { name: 'Specialty', values: SA.map(s => s.specialtyPct), fmt: 'pct0' }, { name: 'CMS', values: SA.map(s => Math.round(s.cmsPct)), fmt: 'pct0' }], labels: 'last', source: 'Company decks' },
    ] },
    { exhibit: { type: 'table', title: 'Generic APIs: our forecast', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [5], rows: [
      ['Prime APIs (₹ cr)', n0(BL.base.prime), ...LINES.prime.map(n0), `+${AS.businessLines.growth.prime.join('/')}%: Q1FY27 ~₹116 cr (+23%); ezetimibe; price pressure persists`],
      ['Specialty APIs (₹ cr)', n0(BL.base.specialty), ...LINES.specialty.map(n0), `+${AS.businessLines.growth.specialty.join('/')}%: paliperidone recovers slowly; Gland sterile collaboration and new DMFs from FY28`],
      { hl: true, cells: ['**Generic APIs total**', `**${n0(BL.base.prime + BL.base.specialty)}**`, ...X.gdsTot.map(v => `**${n0(v)}**`), 'Back to ~₹750 cr in FY27, the FY25 level'] },
    ], source: 'GAM Research (assumptions.json)' } },
    { callout: '**So what:** GDS is the stable, diversified half of Neuland (customers in 80+ countries; top five customers 47% of Prime revenue) but it is not growing. Its main value today is the chemistry, plants and regulatory record it lends to CMS. We do not expect it to drive the stock.' },
  ],
};

const capacity = {
  id: 'capacity', nav: 'Plants, USFDA & capex', kicker: 'Capacity', title: 'Plants and capex: three USFDA-inspected units (1,226 kL) running at 65-90%; ₹1,460 cr of projects approved, peptides and a new R&D centre first',
  blocks: [
    { p: `Neuland makes everything in three plants near Hyderabad with 1,226 kL of reactor volume. In May-2026 the CFO said utilisation was "close to between 85% to 90%" and "the last unit is around 65%". The regulatory record is clean: no USFDA inspection has ever been classified Official Action Indicated and Neuland has never had a warning letter or import alert (CRISIL). The latest inspections were Unit I (Mar-2024, no observations), Unit II (Apr-May 2025, one observation, inspection report received) and Unit III (10-14 Aug 2026, one procedural observation; closure was pending on 30-Sep-2026). Capex has risen from ₹66 cr in FY23 to ₹397 cr in FY26 and ₹122 cr in Q1FY27: a peptide plant (₹254 cr to take synthesiser capacity from 0.5 kL to 6.37 kL; Module 1 commissioning from Sep-2026, Phase II by end-FY27), a ~₹190 cr R&D campus in Genome Valley (leased; ₹130 cr debt-funded), a production block at Unit III and, approved in Aug-2026, a ₹196 cr expansion of Unit I on adjacent land. Of ₹1,460 cr approved over 13 quarters, ₹870 cr had been spent by Jun-2026.` },
    { exhibit: { type: 'table', title: 'Plants, capacity and regulatory status', head: ['Plant', 'Reactor volume', 'Regulatory status', 'Projects'], wide: [2, 3], rows: CAP.units.map(r => r.map(rup)), source: 'Q1FY27 deck p.17; AR FY26; CRISIL; USFDA inspection reports in the press (Sahi/MoneyWorks4Me Aug-2026; Indian Pharma Post Jun-2025; Medical Dialogues Mar-2024)' } },
    { pair: [
      { type: 'column', title: 'Capex: ₹66 cr (FY23) to ~₹450-480 cr a year (FY27-29E)', unit: 'Capex (₹ crore)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'Capex', values: [98, 66, 144, 206, 397, ...AS.capex], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'AR FY26 KPI page; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Reactor volume by plant (kL)', unit: 'kL', x: ['Unit III, Gaddapotharam', 'Unit II, Pashamylaram', 'Unit I, Bonthapally', 'Peptide synthesisers (after expansion)'], series: [{ name: 'kL', values: [581, 389, 256, 6.37], fmt: 'n1' }], labels: 'all', source: 'Q1FY27 deck; AR FY26' },
    ] },
    { callout: `**Our view:** the plants are fairly full (85-90% at most units) and management is building ahead, with land, new sites and possibly overseas assets or acquisitions for "newer modalities" in the next one to two years. We model capex of ₹${AS.capex.join(' / ')} cr for FY27-29E (${Math.round(AS.capex[2] / X.F.sales[2] * 100)}-${Math.round(AS.capex[0] / X.F.sales[0] * 100)}% of sales vs ${Math.round(A.capex[ai('FY26')] / A.sales[ai('FY26')] * 100)}% in FY26). FY18-20 showed the cost of building before orders arrive; the peptide plant has "visibility" but no firm contracts yet.` },
  ],
};

module.exports = { cms, gds, capacity };
