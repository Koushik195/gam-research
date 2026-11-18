// Apollo report, part 2: what the company does, history & corporate actions, industry, tailwind test.
const X = require('./APOLLOHOSP.ctx');
const { C, D, A, F, n0, n1, rup, SA, Q1, FY26, b, SEG } = X;
const f26 = SA.at(-1);

const business = {
  id: 'business', nav: 'What Apollo does', kicker: 'The business', title: 'Three businesses in one stock: hospitals that earn the money, a pharmacy arm that turns it over, clinics that feed both',
  blocks: [
    { p: `**Healthcare Services (hospitals)** is half of revenue and four-fifths of EBITDA: ₹${n0(f26.hcsRev)} cr of revenue and ₹${n0(f26.hcsEbitda)} cr of EBITDA (24.4%) in FY26. The network had 8,352 operating beds in Jun-2026 (6 metros 4,848 beds at 72% occupancy and ₹2.23 lakh per in-patient; 18 smaller cities 3,504 beds at 66% and ₹1.32 lakh). The Delhi hospital (Indraprastha, 22% owned, listed) is in the bed counts but only its profit share is consolidated. Apollo is a tertiary-care chain: cardiac, oncology (incl. a proton-therapy centre in Chennai), transplants, neurosciences, gastro and orthopaedics ("CONGO-T") are 62% of in-patient revenue; 6% comes from international patients from ~150 countries.` },
    { p: `**Apollo HealthCo** (₹${n0(f26.hcoRev)} cr revenue, ₹${n0(f26.hcoEbitda)} cr EBITDA after digital costs in FY26) buys medicines and supplies the ~7,440 Apollo pharmacies, which are owned by Apollo Medicals (AMPL, an associate) rather than by Apollo itself; it also runs private-label products (15.2% of sales) and **Apollo 24/7**, the app (49 mn registered users) for teleconsults, medicine delivery, diagnostics booking and insurance. Before digital costs it earns ~8.8%; after the ₹349 cr of 24/7 operating cost and ₹118 cr of ESOP charges in FY26, 4.5%. **AHLL** (₹${n0(f26.ahllRev)} cr, 11.4% margin) runs 299 clinics, diagnostics (₹706 cr of revenue in FY26), Spectra day-surgery centres, dialysis and dental chains, and (until the Cloudnine deal completes) Cradle maternity and fertility centres.` },
    { pair: [
      { type: 'hbar', title: 'Hospitals: half the revenue, four-fifths of the profit', unit: 'FY26 share of revenue and EBITDA (%)', x: ['Hospitals: revenue', 'Hospitals: EBITDA', 'HealthCo: revenue', 'HealthCo: EBITDA', 'AHLL: revenue', 'AHLL: EBITDA'], series: [{ name: 'FY26', values: [f26.hcsRev, f26.hcsEbitda, f26.hcoRev, f26.hcoEbitda, f26.ahllRev, f26.ahllEbitda].map((v, i) => Math.round(v / (i % 2 ? f26.consEbitda : f26.consRev) * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Q4FY26 presentation (segment table)' },
      { type: 'hbar', title: 'Who pays for in-patients (Q1FY27)', unit: 'Share of in-patient revenue (%)', x: ['Insurance', 'Self-pay (cash)', 'PSU & government', 'International patients'], series: [{ name: 'Q1FY27', values: [Q1.payerMix.insurancePct, Q1.payerMix.selfPayPct, Q1.payerMix.psuGovtPct, Q1.payerMix.internationalPct], fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation p.13' },
    ] },
    { exhibit: { type: 'table', title: 'Hospital regions, Q1FY27 (network incl. Delhi)', head: ['Region', 'Operating beds', 'Occupancy (prior year)', 'Revenue per in-patient (₹)', 'Net revenue (₹ cr)'], rows: Q1.regions.map(r => [r.r, n0(r.beds), `${r.occ}% (${r.occPrior}%)`, n0(r.arpp), n0(r.rev)]), source: 'Q1FY27 presentation pp.16-21; East revenue per patient excludes fee-for-service doctor fees in Kolkata' } },
    { callout: '**So what:** most of Apollo\'s value is the hospitals, and within them the old, dense South Indian clusters (Chennai, Hyderabad, Bengaluru) and Kolkata. The pharmacy arm is large but thin-margin, and its economics are changing hands: after the scheme, Apollo\'s shareholders own 59.6% of it, not 100%. Read every consolidated number with that in mind.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Forty years from one Chennai hospital; the last five spent building, then splitting, a pharmacy and digital empire',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: C.history.map(h => [h.year, rup(h.event), rup(h.impact)]), source: 'Annual reports, presentations, exchange filings and press (to 30-Sep-2026)' } },
    { callout: '**Why it matters:** history explains three quirks in the data. (1) FY22 is inflated by Covid revenue and exceptional gains. (2) The FY23-24 margin dip was the digital build-out, not hospitals. (3) Since FY25 Screener\'s "borrowings" include Advent\'s ₹2,457 cr CCPS, which is equity in the pharmacy company in all but accounting form; we add it back in the valuation.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Too few good beds, and a regulator starting to look at prices',
  blocks: [
    { p: 'India spends little on healthcare and has few hospital beds (government beds ~0.79 per 1,000 people), so demand for quality private tertiary care keeps outrunning supply. Antique estimates healthcare delivery grows 10-12% a year to ~₹12 lakh cr by FY30, with private providers\' share of treatments rising from 64% to ~69%. The listed chains are responding with the biggest building programme in their history: ~19,000 beds added in FY23-26 and plans for +54% more (to ~108,000) by FY30, two-thirds brownfield. Insurance is the fastest-growing payer and now negotiates hard, resetting tariffs every two years. Pricing is also becoming political: on 7-Aug-2026 a Parliamentary committee recommended linking metro room charges to three-star hotel rates, ending room-linked pricing of procedures and creating a hospital-price regulator.' },
    { exhibit: { type: 'table', title: 'Industry facts that matter for Apollo', head: ['Topic', 'Fact', 'Source'], wide: [1], rows: D.industry.points.map(x => [x.k, rup(x.v), `${x.src.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]} (${X.shortDate(x.published)})`]), source: 'As cited; all published before 30-Sep-2026' } },
    { callout: '**Our read:** the demand side is not the issue for Apollo; supply is. When every chain adds 50% more beds by FY30, mostly in the same metros (Delhi NCR, Mumbai, Bengaluru, Hyderabad), occupancy and doctor costs become the battleground. Apollo has the brand to win that fight in its home markets, less obviously in the North and West where Max, Medanta and Fortis are entrenched.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the sector tailwind reach Apollo? Mostly yes in hospitals, partly in pharmacy',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Reaches Apollo?', 'Evidence', 'So what'], wide: [2, 3], rows: [
      ['Rising insurance penetration', 'Yes', `Insurance revenue +25% in Q1FY27 vs +16% self-pay; 46% of in-patient revenue (45% in FY26).`, 'Volume support, but insurers cap price growth (two-year resets).'],
      ['Shift to complex, high-value care', 'Yes', `CONGO-T revenue +24% on +15% volume; robotic surgeries +85%; revenue per in-patient +8%.`, 'Drives ARPP faster than price increases.'],
      ['Medical tourism', 'Partly', 'International revenue +26% in Q1FY27, but Bangladesh volumes only 60-70% of their peak after the 2024-25 disruption.', 'Upside if Bangladesh normalises fully.'],
      ['Under-supply of beds', 'Yes, with a lag', 'Operating beds rose only 3% FY22-26; occupancy rose from 63% to 70%. +4,330 census beds planned by FY31.', 'Growth from FY28 depends on new beds filling.'],
      ['Organised pharmacy and e-pharmacy', 'Partly', 'HealthCo revenue +19% in FY26; digital pharmacy +25-30%; but the stores belong to AMPL and quick-commerce rivals compete on delivery.', 'Apollo shareholders keep 59.6% of the upside after the scheme.'],
      ['Diagnostics consolidation', 'Partly', 'AHLL diagnostics +31% in Q1FY27 at a 14% margin vs 25-40% for listed labs.', 'Sub-scale; margin target 20%.'],
    ], source: 'Q1FY27 presentation and call; GAM Research' } },
    { callout: `**Verdict:** the hospital tailwinds reach Apollo in full; its occupancy and price/mix gains in Q1FY27 are among the best in the sector. The risk is the other side of the same coin: the higher Apollo's prices go in metros (₹2.23 lakh per in-patient), the more it is exposed if regulation targets room-linked pricing.` },
  ],
};

module.exports = { business, history, industry, tailwind };
