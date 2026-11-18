// Medanta report, part 2: business, history, industry, tailwind test.
const fs = require('fs');
const path = require('path');
const X = require('./MEDANTA.ctx');
const { C, D, A, ROOT, n0, n1, rup, SRC, Q1, FY26, AK, b } = X;
const NW = C.network, PM = C.payorMix;

// Peer growth from each company's Screener file: Jun-2026 quarter YoY and FY23-26 revenue CAGR.
const scr = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables;
const q1g = sym => { const q = scr(sym).quarters, r = q.rows.Sales || q.rows.Revenue, i = q.periods.indexOf('Jun 2026'), j = q.periods.indexOf('Jun 2025'); return i >= 0 && j >= 0 ? Math.round((r[i] / r[j] - 1) * 1000) / 10 : null; };
const cagr3 = sym => { const t = scr(sym)['profit-loss'], r = t.rows.Sales || t.rows.Revenue, i = t.periods.indexOf('Mar 2026'), j = t.periods.indexOf('Mar 2023'); return Math.round((Math.pow(r[i] / r[j], 1 / 3) - 1) * 1000) / 10; };
const IND = ['MEDANTA', 'APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'NH', 'RAINBOW', 'KIMS', 'JLHL'];

const business = {
  id: 'business', nav: 'What Medanta does', kicker: 'The business', title: 'Big, procedure-heavy super-specialty hospitals in North and East India, led by a famous founder',
  blocks: [
    { p: `Medanta runs six large hospitals: the 1,440-bed Medicity in Gurugram (2009), Indore (175 beds), Ranchi (two units, 310 beds), Lucknow (778 of 950 planned), Patna (601 of 650) and Noida (433 of 550, opened Sep-2025), **3,737 installed beds** at Jun-2026, a quarter of them ICU beds. It is a tertiary and quaternary referral centre: heart (~21% of healthcare revenue), cancer (~14%), neurosciences, digestive and liver diseases (~11% each), kidney and urology (~8%), orthopaedics and transplants, with 100+ operating theatres and a heavy use of robotics. Gurugram, Indore and Ranchi make up **Cluster 1** (63% of FY26 income, growing ~10%); Lucknow, Patna and Noida make up **Cluster 2** (growing 37-55%). Around the hospitals sit 9 clinics, 12 labs, 22 pharmacies and 825+ collection centres.` },
    { p: `Doctors are a mix of employees and full-time retainers working in specialty teams under department heads (2,480+ doctors). In FY26 in-patients brought ₹${n0(FY26.ipRevenueMn / 10)} cr of revenue, out-patients ₹${n0(FY26.opRevenueMn / 10)} cr, pharmacy sales to out-patients ₹${n0(FY26.pharmacyMn / 10)} cr, labs ₹${n0(FY26.labMn / 10)} cr and government (EPCG) grants ₹${n0(FY26.grantMn / 10)} cr. ${PM.cash[4]}% of in-patient revenue was paid directly by patients, ${PM.tpa[4]}% by insurers on a cashless basis, ${PM.cghsEchsRailways[4]}% by CGHS, ECHS and the Railways, and international patients were ${PM.intlSharePct[4]}% of revenue. There is almost no exposure to the low-priced government scheme PM-JAY.` },
    { exhibit: { type: 'table', title: 'The network at Jun-2026 (installed beds)', head: ['Hospital', 'Opened', 'Beds (ICU)', 'Planned', 'Cluster', 'Model'], wide: [5], rows: [
      ...NW.map(h => [`**${h.hospital}**`, h.opened, `${n0(h.beds)} (${h.icu})`, n0(h.planned), h.cluster, h.model]),
      { hl: true, cells: ['**Total**', '', `**${n0(NW.reduce((s, h) => s + h.beds, 0))}**`, `**${n0(NW.reduce((s, h) => s + h.planned, 0))}**`, '', 'Plus five greenfields (2,950 beds) from FY30'] },
    ], source: rup(C.networkSrc) } },
    { pair: [
      { type: 'hbar', title: 'Gurugram is still the giant: 39% of installed beds', unit: 'Installed beds, Jun-2026', x: NW.map(h => h.hospital.replace('Medanta – The Medicity, ', '').replace('Medanta ', '').replace('Jai Prabha Medanta, ', '').replace(' (two units)', '')), series: [{ name: 'Beds', values: NW.map(h => h.beds), fmt: 'num' }], labels: 'all', highlight: 'Gurugram', source: 'Q1FY27 presentation p.23' },
      { type: 'hbar', title: 'Revenue mix: in-patients are three-quarters', unit: 'FY26 revenue (₹ crore)', x: ['In-patients', 'Out-patients', 'OPD pharmacy', 'Labs', 'EPCG grants', 'Training, research, other'], series: [{ name: 'Revenue', values: [FY26.ipRevenueMn, FY26.opRevenueMn, FY26.pharmacyMn, FY26.labMn, FY26.grantMn, FY26.clinicalResearchMn + FY26.sponsorshipTrainingMn + FY26.foodCourtMn + FY26.otherOperatingMn].map(v => Math.round(v / 10)), fmt: 'num' }], labels: 'all', highlight: 'In-patients', source: 'AR FY26 consolidated note 27' },
    ] },
    { exhibit: { type: 'table', title: 'Operating scale', head: ['', 'FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27'], rows: [
      ['In-patients (\'000)', ...AK.slice(1).map(k => n1(k.ipVolume / 1000)), n1(Q1.ipVolume / 1000)],
      ['Out-patient encounters (lakh)', ...AK.slice(1).map(k => n1(k.opVolume / 1e5)), n1(Q1.opVolume / 1e5)],
      ['Census beds (average)', ...AK.slice(1).map(k => n0(k.censusBeds)), n0(Q1.censusBeds)],
      ['Average length of stay (days)', ...AK.slice(1).map(k => k.alos.toFixed(2)), Q1.alos.toFixed(2)],
      ['Cash share of IP revenue (by payment type)', ...PM.cash.slice(1, 5).map(v => v + '%'), PM.cash[5] + '%'],
    ], source: 'Company presentations; AR FY26 p.14-15' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From one Gurugram campus (2009) to six hospitals and a plan to double beds',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: rup(C.historySrc) } },
    { callout: '**Corporate actions and per-share data:** no bonus, split or buyback since listing; 26.87 cr shares (ESOP allotments only). The South Delhi company (GHL Hospital Ltd, 50% DLF) brought the first minority interest in FY26; it is a small loss, so Screener\'s "Net Profit" (₹554 cr) is slightly below profit to owners (₹556 cr) while its EPS (₹20.71) is on owners\' profit. We use the attributable basis (MEDANTA.patch.js) so the share count is right. Carlyle sold out in the IPO; Temasek (14.85%) has been on the register since 2015.' },
  ],
};

const IN = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Demand is growing and insured, but everyone is building beds, especially in NCR',
  blocks: [
    { p: rup(IN.lead) },
    { exhibit: { type: 'table', title: 'Forces acting on Medanta\'s market (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Medanta'], wide: [2], rows: IN.themes.map(r => r.map(rup)), source: IN.src } },
    { pair: [
      { type: 'hbar', title: 'Q1FY27 revenue growth: Medanta 26.5%, near the top of the group', unit: 'Consolidated revenue growth, Jun-2026 quarter, year on year (%)', x: IND.map(X.shortName), series: [{ name: 'Growth', values: IND.map(q1g), fmt: 'pct' }], labels: 'all', highlight: 'Medanta', source: 'Screener.in quarterly results (Narayana and Rainbow include acquisitions)' },
      { type: 'hbar', title: 'Over three years it was mid-pack: 18% a year', unit: 'Revenue growth, FY23-26, a year (%)', x: IND.map(X.shortName), series: [{ name: 'CAGR', values: IND.map(cagr3), fmt: 'pct' }], labels: 'all', highlight: 'Medanta', source: 'Screener.in (consolidated; acquisitions included for peers)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Medanta captures the flight to quality in Tier-2 cities best',
  blocks: [
    { verdicts: [
      ['Flight to quality in Tier-2 cities', 'Yes, strongly', 'Lucknow + Patna income +28% in Q1FY27 (ex Noida) at 32% margins, with no tariff increase in Patna in 4.5 years; occupancy 68-70%.', 'The best growth engine in the group; Guwahati and Varanasi repeat the formula from FY30.'],
      ['Insurance and rising incomes', 'Yes', 'IP volumes +16% in FY26 and +28% in Q1FY27; cashless insurance steady at ~25% of IP revenue, self-pay 56%.', 'Volume-led growth; prices have room to rise.'],
      ['Higher acuity and robotics', 'Yes', 'ARPOB +6% in FY26 and +5.5% in Q1FY27 with shorter stays (ALOS 3.04 → 2.87 days); Lucknow passed 1,000 robotic joint replacements in a year.', 'Supports ARPOB growth of 5-6% a year in our model.'],
      ['Medical tourism', 'Partly', 'International revenue +33% in FY26 to ₹278 cr, +23% in Q1FY27; dented by Middle East flight disruptions; Bangladesh weak.', 'Useful but volatile; 6-7% of revenue.'],
      ['Government price revisions (CGHS)', 'Small', 'CGHS rates revised Oct-2025; CGHS is 10-12% of revenue, impact "not moving the needle" (CEO).', 'A minor help, not a driver.'],
      ['NCR premium market', 'Not yet proven', 'Noida loss ₹78 cr in FY26, near breakeven in Q1FY27; South Delhi and Pitampura (1,150 beds) open from FY30 against Max, Fortis, Apollo and others.', 'The new money goes where competition is fiercest.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { business, history, industry, tailwind };
