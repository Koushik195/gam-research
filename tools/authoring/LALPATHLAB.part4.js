// Dr Lal PathLabs report, part 4: Q1FY27 & guidance, earnings quality, ownership.
const X = require('./LALPATHLAB.ctx');
const { C, D, F, n0, n1, rup, Q1, FY26, epsBase, epsRep, acq26, SHARES } = X;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +19%, EBITDA +29%, profit +27%; guidance moved "towards mid-teens", margin guide kept at 27-28%',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue', '670', n0(Q1.revenue), `+${Q1.revenueGrowthPct}%`],
      ['  Patients (mn) / samples (mn)', '7.6 / 23.4', `${Q1.patientsMn} / ${Q1.samplesMn}`, `+${Q1.patientGrowthPct}% / +${Q1.sampleGrowthPct}%`],
      ['  Revenue per patient (₹)', '880', n0(Q1.rpp), `+${Q1.rppGrowthPct}% (CGHS/ECHS 2-3pp, mix)`],
      ['  Tests per patient / SwasthFit share', '3.07 / 27%', `${Q1.testsPerPatient} / ${Q1.swasthfitPct}%`, 'SwasthFit growing ~20%'],
      ['Reagents and consumables', '129', '152', 'Gross margin 80.8% → 81.0%'],
      ['Employees / fees to collection centres', '124 / 96', '133 / 116', '+7% / +21%'],
      ['Other expenses', '129', '150', '+16%'],
      ['EBITDA', '192', n0(Q1.ebitda), '+28.7%'],
      ['  margin', '28.7%', `${Q1.ebitdaMarginPct}%`, '+232bp'],
      ['Other income / D&A / finance cost', '28 / 35 / 5', `${Q1.otherIncome} / ${Q1.dep} / ${Q1.interest}`, 'D&A +28% (new labs, leases)'],
      ['Tax', '47', n0(Q1.tax), '25.4% rate'],
      { hl: true, cells: ['**Profit (PAT)**', '**134**', `**${n0(Q1.pat)}**`, `**+${Q1.patGrowthPct}%**`] },
      ['EPS (₹)', '7.9', `${Q1.eps}`, '+27.8%'],
    ], source: 'Q1FY27 PPT (24-Jul-2026) and call; Emkay result update (24-Jul-2026)' } },
    { bullets: [
      '**A broad beat:** revenue was ~5% and EBITDA ~16% above the Bloomberg consensus (₹758 cr / ₹213 cr, per Emkay). Growth came from all regions; Delhi NCR grew "in line" with the company; Suburban was "very close" to double-digit growth.',
      '**Three helpers to strip out:** (1) the CGHS/ECHS rate revision, 2-3% of company revenue, for "at least another 2-3 quarters"; (2) an unusual weather pattern whose effect on testing management could not yet judge; (3) a low base for patients in FY26 (weak fever season in Q3FY26).',
      '**Costs:** operating leverage (employee cost +7%); courier costs reclassified from employee to other expenses (like-for-like, per the CFO). Reagent cost covered by inventory and contracts; a weak rupee is a risk later.',
      '**Deals and dividend:** 80% of Sunshine Healthcare (Ghana) and 30% of Neuome approved; interim dividend ₹5; net cash ₹1,693 cr.',
    ] },
    { exhibit: { type: 'table', title: 'What management guided for FY27 (Apr and Jul-2026)', head: ['Guidance'], rows: C.guidance.fy27.map(g => [g]), source: rup(C.guidance.src) } },
    { callout: '**Why it matters:** this is the first time in four years that Dr Lal has grown above mid-teens, and management, usually conservative, has nudged guidance up after one quarter. The quality is good (volume-led, broad-based), but roughly a sixth of the growth is a government rate card, and management has said plainly it will reinvest margin above 27-28%. We take the growth (FY27E +{{F.salesGrowth.0|pct}}) but not the full Q1 margin ({{F.ebitdaMargin.0|pct}} for the year).' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: high: cash-backed profits and a clean audit; read around two one-offs and the acquisition amortisation',
  blocks: [
    { bullets: [
      `**One-offs:** FY25 profit includes a ₹40.8 cr deferred-tax credit from liquidating Suburban into the parent (8% of profit); FY26 includes a ₹30.1 cr labour-code charge (₹22.5 cr after tax) and a ₹12.2 cr prior-year tax credit. The company's "normalised" PAT was ₹451 cr (FY25) and ₹532 cr (FY26); our base EPS is ₹${n1(epsBase[2025])} and ₹${n1(epsBase[2026])} (reported ₹${epsRep[2025]} and ₹${epsRep[2026]}). Screener books the labour-code charge in other income, the company in EBITDA.`,
      `**Acquisition amortisation:** ₹${n1(acq26)} cr in FY26 (~₹${n1(acq26 * 0.75 / SHARES)} of EPS after tax): the Suburban brand (₹39.2 cr a year) ends in FY27, so reported EPS rises ~₹1.7 in FY28 from accounting alone. We include amortisation in EPS, as the street does.`,
      '**Leases (Ind AS 116):** EBITDA excludes rent on ~₹199 cr of leases; right-of-use depreciation (₹40 cr) and lease interest (₹23 cr) are below EBITDA. On a pre-Ind AS basis the FY26 margin would be ~2pp lower (~26%). Peers report the same way.',
      '**ESOP cost:** ₹23.8 cr in FY26 (₹27.1 cr in FY25), expensed inside employee costs; option exercises added ~0.2% to the share count in FY26 (16.718 cr → 16.756 cr shares).',
      '**Cash conversion:** cash from operations before tax was 104-115% of EBITDA in every year FY15-26 (Screener); working capital is negative; receivables 15 days.',
      '**Reclassification:** courier costs moved from employee to other expenses from Q4FY26 (restated); no effect on EBITDA.',
      '**Audit:** Deloitte Haskins & Sells; unmodified opinion; key audit matters are revenue IT controls over the price master (high-volume transactions) and goodwill impairment (₹470 cr in the standalone books from Suburban).',
    ] },
    { callout: '**Accounting flag: GREEN.** Simple revenue (a test is done, the patient pays), cash ahead of profit, no debt and a conservative auditor\'s focus on the right risks. The items that distort reported EPS (FY25 tax credit, FY26 labour codes, Suburban amortisation) are disclosed and small; we value on EPS before exceptional items and show reported EPS alongside.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Lal family controls the company: Executive Chairman Dr Arvind Lal, Executive Director Dr Vandana Lal, Non-Executive Director Dr Archana Lal Erdmann and family entities hold ${OH.promoters}% (Jun-2026). Domestic institutions own ${OH.diis}% (mutual funds and AIFs 18.90% at Mar-26), foreign investors ${OH.fiis}% and the public ${OH.public}% (${n0(OH.shareholders)} shareholders). The register has changed hands: FIIs fell from 26.8% (Dec-2024) to 17.4%, domestic institutions rose from 12.9% to 21.6%, and the promoters have sold small amounts (54.6% → 53.2% since Dec-2023).` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Shareholding, Jun-2026 vs Dec-2023 (%)', head: ['Holder', 'Dec-2023', 'Jun-2026', 'Change'], rows: [
    ['Promoters (Lal family)', '54.60', n1(OH.promoters), '−1.4pp'], ['Foreign investors', '25.36', n1(OH.fiis), '−8.0pp'], ['Domestic institutions', '9.27', n1(OH.diis), '+12.3pp'], ['Public and others', '10.78', n1(OH.public + OH.others + OH.government), '−2.9pp'],
  ], source: 'BSE shareholding pattern via Screener.in; Q1FY27 PPT p.15 (named non-promoter holders for Jun-2026 not retrieved)' } },
  { callout: '**Our read:** a stable family owner with a majority stake and a register that has rotated from foreign to domestic funds. A 53% promoter stake protects against hostile moves but also means minority shareholders rely on the board for capital-allocation discipline, which matters with ₹1,700 cr of cash earmarked for acquisitions.' },
] });

module.exports = { guidance, quality, ownership };
