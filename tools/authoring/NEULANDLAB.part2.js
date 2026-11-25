// Neuland Laboratories report, part 2: what Neuland does, history and corporate actions, industry, tailwind test.
const X = require('./NEULANDLAB.ctx2');
const { C, D, A, n0, n1, BL, SA, b, cmsShare26 } = X;
const IN = D.industry;
const s26 = v => (v / A.sales[b] * 100).toFixed(1);

const business = {
  id: 'business', nav: 'What Neuland does', kicker: 'Company', title: 'A Hyderabad API maker with two businesses: generic APIs sold to many, and contract-made APIs for a few innovators, which now bring 61% of revenue',
  blocks: [
    { p: `Neuland makes **active pharmaceutical ingredients (APIs)**: the chemical in a medicine that does the work. It does not make tablets, so it does not compete with its customers. It has two businesses. (1) **Generic Drug Substances (GDS)** sells off-patent APIs to generic drug makers in 80+ countries: **Prime APIs** are ~12 large-volume, mature molecules such as mirtazapine (an antidepressant), ezetimibe (cholesterol) and escitalopram, where price competition is tough; **Specialty APIs** are 50+ complex, low-volume molecules such as apixaban (a blood thinner), sterile paliperidone and aripiprazole injectables, and donepezil, with fewer competitors. (2) **Custom Manufacturing Solutions (CMS)** develops and makes APIs and intermediates for innovators' new drugs under exclusive contracts, from pre-clinical batches to commercial supply. Neuland has 1,226 kL of reactors in three plants near Hyderabad, ${n0(C.profile.employees.jun26)} employees (406 in R&D) and 1,010+ regulatory filings.` },
    { exhibit: { type: 'table', title: "Neuland's revenue lines (FY26)", head: ['Line', 'Revenue (₹ cr)', 'Share', 'What it is', 'Who buys', 'Economics'], wide: [3, 4, 5], rows: [
      ['**CMS (CDMO)**', n0(BL.base.cms), `${s26(BL.base.cms)}%`, 'APIs and intermediates for new drugs, exclusive; 99 active projects (19 commercial); commercial ₹1,146 cr + development ₹98 cr', 'Biotechs and innovators; top 5 customers 93% of CMS', 'High margin (management); revenue follows a few drugs and their order timing'],
      ['**Prime APIs (GDS)**', n0(BL.base.prime), `${s26(BL.base.prime)}%`, '~12 mature, large-volume generic APIs (mirtazapine, ezetimibe, escitalopram, enalapril, sotalol, labetalol)', 'Generic formulators; top 10 customers 63% of Prime', 'Low margin; FY26 −5%'],
      ['**Specialty APIs (GDS)**', n0(BL.base.specialty), `${s26(BL.base.specialty)}%`, '50+ complex, low-volume generic APIs (apixaban, sterile paliperidone and aripiprazole, donepezil, dorzolamide)', 'Select customers; top 10 56% of Specialty', 'High margin; FY26 −16% on paliperidone delays'],
      ['**Others**', n0(BL.base.others), `${s26(BL.base.others)}%`, 'Other operating revenue and services (residual)', '–', '–'],
    ], source: 'Q4FY26 deck (segment shares, CMS rupees, concentration); AR FY26 MD&A; CRISIL (25-Aug-2026)' } },
    { pair: [
      { type: 'column', title: 'Generic APIs flat since FY22; CMS ×4.4', unit: 'Revenue (₹ crore)', x: SA.map(s => s.fy), series: [{ name: 'CMS', values: SA.map(s => s.cms), fmt: 'num' }, { name: 'Prime', values: SA.map(s => Math.round(s.prime)), fmt: 'num' }, { name: 'Specialty', values: SA.map(s => Math.round(s.specialty)), fmt: 'num' }], labels: 'all', source: 'Company decks (FY22-FY26); Prime/Specialty = disclosed share × revenue' },
      { type: 'hbar', title: `FY26: CMS ${Math.round(cmsShare26)}% of revenue`, unit: 'FY26 revenue (₹ crore)', x: ['CMS', 'Prime APIs', 'Specialty APIs', 'Others'], series: [{ name: 'FY26', values: [BL.base.cms, BL.base.prime, BL.base.specialty, BL.base.others].map(Math.round), fmt: 'num' }], labels: 'all', highlight: 'CMS', source: 'Q4FY26 deck; GAM' },
    ] },
    { callout: '**So what:** Neuland is two companies. One is a respected but slow-growing generic API maker whose revenue was ~₹640-750 cr in each of FY22-26. The other is a contract manufacturer whose revenue quadrupled in four years because a few drugs it helped develop reached the market. Investors are paying for the second one; almost all the risk sits there too.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Forty years from a single API to a CDMO: an early bet on Unit III that cost five lean years, a promoter merger, a property sale and a leadership split',
  blocks: [
    { p: 'Dr. Davuluri Rama Mohan Rao founded Neuland in 1984; it sold its first API (salbutamol) in 1986, listed in 1994 and was among the first Indian API makers audited by the USFDA (1997). It opened offices in the US (2004) and Japan (2007) to build the CMS business that his son Saharsh Rao has run for ~19 years. In FY18 it bought Unit III and merged in two promoter-linked companies (Neuland Health Sciences, which held peptide R&D and Neuland shares, and Neuland Pharma Research), creating ₹279 cr of goodwill. Unit III sat largely idle until FY21. Since FY23 CMS commercial molecules have transformed earnings. In FY25 Neuland transferred a property in Hyderabad (₹76.4 cr gain); from 1-Apr-2026 Saharsh Rao became CEO & MD and his brother Sucheth Rao Executive Vice Chairman.' },
    { exhibit: { type: 'table', title: 'Corporate actions and events that changed the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.timeline.map(t => [t.date, X.rup(t.event), X.rup(t.impact)]), source: C.timelineSrc } },
    { callout: '**Impact on the numbers:** (1) FY18-20 show what happens when capacity runs ahead of orders: margins of 9-14% and ROE of ~2%. Management is again building ahead (peptides, Unit 1, R&D centre). (2) The FY25 property gain inflates FY25 EPS by ~₹54 a share; we remove it in the valuation history. (3) The share count (1.283 cr) has not changed since the 2018 merger: no dilution, no buy-backs.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: a ~USD260 bn global CDMO market growing 6-7% a year, India\'s share rising as innovators diversify away from China; peptides the fastest-growing niche',
  blocks: [
    { p: `Drug companies increasingly outsource the making of their APIs. The global pharmaceutical CDMO market was ~USD${IN.cdmoGlobal.usdBn2025} bn in 2025 and is forecast at ~USD${IN.cdmoGlobal.usdBn2031} bn by 2031 (~6-7% a year); India's CDMO market, ~USD${IN.cdmoIndia.usdBn2025} bn in 2025, is forecast to roughly double to ~USD${IN.cdmoIndia.usdBn2031} bn by 2031 (company MD&A, citing industry sources). Two forces help Indian suppliers: biotechs, which rarely own plants, now originate ${'76%'} of new small-molecule approvals (60% in 2016), and US policy (the Section 232 investigation, tariff threats) has pushed innovators to add non-Chinese sources. Peptide APIs, driven by GLP-1 drugs, are the fastest-growing niche: ~USD${IN.peptideApi.usdBn2025} bn in 2025 to ~USD${IN.peptideApi.usdBn2030} bn by 2030. The generic API market is larger but slower (~USD${IN.apiGlobal.usdBn2025} bn globally, ~${IN.apiGlobal.cagrPct}% a year to 2035) and fiercely price-competitive.` },
    { exhibit: { type: 'table', title: 'Market sizes (USD bn)', head: ['Market', 'Size', 'Forecast', 'Growth'], rows: [
      ['Global pharma CDMO', `${IN.cdmoGlobal.usdBn2025} (2025)`, `${IN.cdmoGlobal.usdBn2031} (2031)`, '~6-7% a year'],
      ['India CDMO', `${IN.cdmoIndia.usdBn2025} (2025)`, `${IN.cdmoIndia.usdBn2031} (2031)`, '~14% a year'],
      ['Global API', `${IN.apiGlobal.usdBn2025} (2025)`, `${IN.apiGlobal.usdBn2035} (2035)`, `${IN.apiGlobal.cagrPct}% a year`],
      ['India API', `${IN.apiIndia.usdBn2025} (2025)`, `${IN.apiIndia.usdBn2026} (2026)`, '~8%'],
      ['Peptide APIs', `${IN.peptideApi.usdBn2025} (2025)`, `~${IN.peptideApi.usdBn2030} (2030)`, `${IN.peptideApi.cagrPct}% a year`],
    ], source: IN.src } },
    { callout: '**So what:** the market is growing, but CDMO revenue is won molecule by molecule. For a supplier of Neuland\'s size, whether two or three of its customers\' drugs succeed matters far more than the industry growth rate.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: China+1 and the biotech boom do reach Neuland, through CMS; the generic API side gets no lift',
  blocks: [
    { exhibit: { type: 'table', title: 'Does the sector tailwind reach Neuland?', head: ['Tailwind', 'Reaches Neuland?', 'Evidence'], wide: [2], rows: [
      ['Innovators diversifying from China', 'Yes', 'CMS revenue ×4.4 in FY22-26; "customers are looking for securities of supply" (CEO); deeper big-pharma engagement'],
      ['Biotech-originated drugs', 'Yes', 'Neuland supplies APIs to biotech sponsors from pre-clinical to commercial; 4 NDAs, 27 INDs supported'],
      ['Peptides / GLP-1', 'Not yet', 'Plant commissioning from Sep-2026; 8-10 programmes in development; revenue from FY28 (CRISIL)'],
      ['Generic API demand', 'No', 'Prime −5% and Specialty −16% in FY26; mature molecules face Chinese and Indian price competition'],
      ['Rupee weakness', 'Yes, temporarily', 'The CEO credits "favourable exchange rates" for FY26 margins; ~90% of revenue is exported by end market'],
    ], source: 'Calls (May-2026, Aug-2026); decks; CRISIL; GAM' } },
    { callout: `**Verdict:** the tailwind is real but narrow. It reaches Neuland through a handful of CMS molecules (${Math.round(cmsShare26)}% of FY26 revenue) rather than through the whole business, which is why growth is fast but lumpy.` },
  ],
};

module.exports = { business, history, industry, tailwind };
