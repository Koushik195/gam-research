// Syngene report, part 2: what the company does, history & corporate actions, industry, tailwind test (BIOSECURE, China+1).
const X = require('./SYNGENE.ctx2');
const { C, D, A, n0, n1, b, FY26, SA } = X;
const IND = D.industry;

const business = {
  id: 'business', nav: 'What it does', kicker: 'Business', title: 'What Syngene does: research for hire (~65% of revenue) and development and manufacturing (~35%), for ~400 clients, 63% of revenue from the US',
  blocks: [
    { p: 'Syngene is a CRDMO: a contract research, development and manufacturing organisation. Drug companies pay it to do work they would otherwise do in their own labs and plants. It has two businesses. **Research services** (~65% of FY26 revenue by management\'s split) are discovery chemistry and biology for innovators, paid per scientist (FTE), per project (fee-for-service) or as **dedicated R&D centres**: ring-fenced buildings run only for one client, the largest being Bristol-Myers Squibb\'s BBRC in Bengaluru with 700+ scientists, renewed to 2035. Translational and clinical research (bioanalysis, a human pharmacology unit, a first global Phase III trial) is a small, growing part. **CDMO** (~35%) takes molecules from process development to clinical and commercial supply, in small molecules (APIs at Bengaluru and the Mangaluru plant) and large molecules (biologics: antibodies, proteins, ADCs at Bengaluru, the Unit 3 site and, from FY28, Bayview in Baltimore).' },
    { exhibit: { type: 'table', title: 'The businesses (FY26)', head: ['Business', 'Share of revenue', 'What it does', 'How it is paid', 'Where it stands'], wide: [2, 4], rows: [
      ['Discovery services', '~45-50% (our estimate within research)', 'Chemistry (the largest part), biology, biotherapeutics, DMPK, safety', 'FTE and fee-for-service; many small biotechs', 'Losing price-sensitive "commoditised" work (CEO, Q1FY27); AI and new modalities pitched as the answer'],
      ['Dedicated R&D centres', '~15-20% (our estimate)', 'Client-only labs: BMS (BBRC, since 1998), others', 'Multi-year contracts, cost-plus style', 'BMS extended to 2035; grows "around US inflation" (Peter Bains)'],
      ['Translational & clinical', 'Small', 'Bioanalysis, Phase I unit, global trials', 'Per study', 'Growing from a low base; India\'s approval delays push trials abroad'],
      ['Small-molecule CDMO', 'Part of ~35%', 'APIs and drug product, clinical to commercial', 'Per batch / supply contract', 'Mangaluru had very low utilisation; lock-ins in FY27'],
      ['Large-molecule CDMO', 'Part of ~35%', 'Antibodies, proteins, ADC conjugation; 50,000 L single-use capacity with Bayview', 'Per batch / supply contract', 'Lost most of Librela; Unit 3 runs clinical batches; Bayview from FY28'],
    ], source: 'Company calls (Q3FY26, Q4FY26, Q1FY27); AR FY26 MD&A; GAM estimates for the split within research services (not disclosed)' } },
    { pair: [
      { type: 'column', title: 'Revenue by customer location: the US is 63%', unit: '% of FY26 revenue', x: ['United States', 'Europe', 'Rest of world', 'India'], series: [{ name: 'Share', values: [62.8, 30.7, 3.9, 2.6], fmt: 'pct' }], labels: 'all', source: 'AR FY26 note 33' },
      { type: 'column', title: 'People: 8,373 employees, 5,778 scientists', unit: 'Number', x: ['Employees', 'Scientists', 'PhDs'], series: [{ name: 'Mar-26', values: [8373, 5778, 422], fmt: 'num' }], labels: 'all', source: 'AR FY26 MD&A; Q1FY27 deck' },
    ] },
    { callout: `**So what:** this is a people business at heart: staff costs were ${FY26.staffPct}% of FY26 revenue, materials only ~25%. Revenue is in dollars (US$419 mn in FY26), costs mostly in rupees, so a weaker rupee helps over time, but Syngene hedges forward and booked ₹61 cr of hedge losses in FY26 and ₹50 cr in Q1FY27 as the rupee fell faster than its hedge rates. Two customers above 10% of revenue made up ${C.customers.top.fy26Pct}% of FY26 sales.` },
  ],
};

const history = {
  id: 'history', nav: 'History', kicker: 'History', title: 'History: from Biocon\'s lab in 1993 to a ₹3,700 cr CRDMO; Biocon has sold about a quarter of its stake since 2022, and the Zoetis bet has unwound',
  blocks: [
    { exhibit: { type: 'table', title: 'Corporate history and what each step did to the numbers', head: ['When', 'What happened', 'Impact'], wide: [1, 2], rows: [
      ...C.history.map(h => [h.year, h.event.replace(/Rs ?(?=[0-9])/g, '₹'), ({ '2018': 'Commercial-scale biologics supply became the anchor of the CDMO arm', 'Dec-2023': '20,000 L of drug-substance capacity; depreciation from FY26', 'Mar-2025': 'US foothold; ~₹410 cr in CWIP, not yet earning', 'FY26': 'EBITDA −12%, PAT before exceptional items −20%', 'Sep-2022 / Feb-2023': 'Free float up; Biocon cash for the Viatris biosimilars deal', 'Dec-2024': 'Biocon 52.4%' })[h.year] || '–']),
    ], source: 'Q1FY27 deck p.8; AR FY26; company and press releases (Business Standard, Medical Dialogues, BioSpectrum)' } },
    { p: 'Two things in this history matter for the investor today. First, Biocon has treated Syngene as a source of cash: it sold 5.4% in Sep-2022 (₹1,220 cr), 9.96% in Feb-2023 (~₹2,240 cr at ~₹560 a share, to help fund the Viatris deal) and ~2% in Dec-2024 (₹686 cr). It still owns 52.4%, and with Biocon now owning all of Biocon Biologics and carrying debt, further sales are possible: a supply overhang. Second, Syngene\'s manufacturing strategy was built around one product. The Zoetis contract (2018) was a 10-year programme with potential of up to US$500 mn; Syngene bought Unit 3 (Dec-2023) and Bayview (Mar-2025) partly to diversify away from it, but "by the time that happened, we had a big drop in the opportunity with the large customer" (Kiran Mazumdar-Shaw, Q1FY27 call).' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: outsourcing keeps growing (CRO ~11% a year, biologics CDMO ~13%), but near-term research spending is cautious',
  blocks: [
    { p: `The global contract research market was ~US$84 bn in 2024 and is expected to reach ~US$140 bn by 2029 (~11% a year); CDMO ~US$130 bn growing ~8%, within which biologics (large-molecule) CDMO is the fastest at ~13% (Frost & Sullivan, in Syngene's AR). The drivers are durable: a 2024-28 patent cliff and US drug-price pressure push big pharma to cut fixed costs and outsource; new drug types (ADCs, peptides, oligonucleotides, bispecifics; over 40% of clinical pipelines) need specialist capacity; and China+1 makes Indian vendors more relevant. The near term is softer: biotech funding recovered in H2-2025 but reaches CRO revenue with a 6-12 month lag, and clients prefer smaller work packages.` },
    { exhibit: { type: 'table', title: 'Market sizes (US$ bn)', head: ['Segment', '2024', '2029E', 'Growth a year'], rows: IND.markets.map(m => [m.segment, n0(m.y2024), n0(m.y2029), `~${m.cagrPct}%`]), source: IND.marketsSrc } },
    { callout: '**So what:** the market is not Syngene\'s problem. Its research arm grew below the market even before FY27, and its manufacturing arm depended on one product. The question for FY28 onwards is share, not demand.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: BIOSECURE and China+1 help Indian CRDMOs, but there is no sign yet in Syngene\'s revenue, which fell 16% in Q1FY27',
  blocks: [
    { p: IND.biosecure },
    { exhibit: { type: 'table', title: 'Does the tailwind reach Syngene?', head: ['Tailwind', 'Evidence it reaches Syngene', 'Evidence it does not (yet)', 'Verdict'], wide: [1, 2], rows: [
      ['BIOSECURE / China+1', 'More RFPs for non-China CRDMOs (AR FY26); CEO cites moving molecules from China to India (Q1FY27)', 'No named companies yet; grandfathering; FY26 research spending delayed by the Act; Q1FY27 revenue −16%', 'Real but slow; not in our base numbers'],
      ['Biologics outsourcing (~13% a year)', 'One of the few Indian biologics CDMOs; 50,000 L single-use incl. Bayview; ADC suite', 'Librela loss; Unit 3 mostly clinical; Korean and Chinese rivals larger', 'Capacity is there, customers are not yet'],
      ['US "make it here" pressure and tariffs', 'Bayview gives a US site; talks on human and animal health', 'Tariff impact on Syngene negligible either way (CEO, Q4FY26)', 'Helps Bayview from FY28'],
      ['Big-pharma outsourcing / patent cliff', 'BMS renewed to 2035 with wider scope', 'Discovery clients lost on price', 'Mixed'],
      ['AI in discovery', 'Syn.AI, gigascale virtual screening (Q1FY27)', 'Could shrink the number of lab hours per programme', 'Risk and opportunity; unproven'],
    ], source: 'AR FY26 MD&A; Q4FY26 and Q1FY27 calls; GAM Research' } },
    { callout: `**Verdict:** the tailwinds are real at the industry level, but Syngene has to win the business. Its CDMO peers are priced as if they will (Divi's ${n1(X.P.DIVISLAB.evEbitda)}x, Sai Life ${n1(X.P.SAILIFE.evEbitda)}x trailing EV/EBITDA at 30-Sep-2026); Syngene at ${n1(X.P.SYNGENE.evEbitda)}x is priced as if it will not.` },
  ],
};

module.exports = { business, history, industry, tailwind };
