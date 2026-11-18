// Fortis report, part 2: business, history & corporate actions, industry, tailwind test.
const fs = require('fs');
const path = require('path');
const X = require('./FORTIS.ctx');
const { C, D, A, ROOT, n0, n1, pc, rup, SRC, SA, Q1, FY26, b, shortName } = X;
const CL = C.clustersQ1FY27, PM = C.payorMix;

// Peer growth from each company's Screener file: Jun-2026 quarter YoY and FY23-26 revenue CAGR.
const scr = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables;
const q1g = sym => { const q = scr(sym).quarters, r = q.rows.Sales || q.rows.Revenue, i = q.periods.indexOf('Jun 2026'), j = q.periods.indexOf('Jun 2025'); return i >= 0 && j >= 0 ? Math.round((r[i] / r[j] - 1) * 1000) / 10 : null; };
const cagr3 = sym => { const t = scr(sym)['profit-loss'], r = t.rows.Sales || t.rows.Revenue, i = t.periods.indexOf('Mar 2026'), j = t.periods.indexOf('Mar 2023'); return Math.round((Math.pow(r[i] / r[j], 1 / 3) - 1) * 1000) / 10; };
const IND = ['FORTIS', 'APOLLOHOSP', 'MAXHEALTH', 'NH', 'MEDANTA', 'KIMS', 'RAINBOW', 'JLHL'];
const DIAG = ['FORTIS', 'LALPATHLAB', 'METROPOLIS', 'VIJAYA'];

const business = {
  id: 'business', nav: 'What Fortis does', kicker: 'The business', title: 'A North-India-heavy hospital chain with a national diagnostics arm',
  blocks: [
    { p: `Fortis runs multi-specialty hospitals: 36 facilities with 6,150+ operational beds, of which ~4,970 are its own and ~1,200 are managed for others under operations & management (O&M) contracts for a fee. Hospitals earned ₹${n0(FY26.hospRevenue)} cr in FY26 (85% of revenue). The network is concentrated: Delhi NCR (~2,190 beds, led by the flagship Fortis Memorial Research Institute, FMRI, in Gurugram) and Punjab (~990 beds) are half the beds; Bengaluru, Mumbai, Kolkata and Jaipur make up most of the rest. Six specialties (oncology, cardiac, neuro, ortho, gastro and renal) bring 62% of hospital revenue; doctors are mostly paid fees per case, as in most Indian chains.` },
    { p: `The second business is **Agilus Diagnostics** (formerly SRL), 88.32% owned: a national pathology chain with 4,493 customer touchpoints, 40.8 mn tests a year and ₹${n0(FY26.diagGross)} cr of gross revenue in FY26 (₹${n0(FY26.interSeg)} cr of it from tests for Fortis hospitals). Agilus earned a 23.6% operating margin in FY26 but has grown only ~4% a year since FY23. The controlling shareholder is **IHH Healthcare** of Malaysia (31.17%), Asia's largest listed hospital group, which also owns the Gleneagles hospitals in India that Fortis has managed since Jul-2025.` },
    { exhibit: { type: 'table', title: 'The network at Jun-2026 (operational beds incl. O&M)', head: ['Cluster', 'Beds', 'Hospitals'], wide: [2], rows: [
      ...CL.map(c => [`**${c.cluster}**`, n0(c.beds), c.hospitals]),
      { hl: true, cells: ['**Total**', `**${n0(CL.reduce((s, c) => s + c.beds, 0))}**`, '36 facilities; ~1,200 O&M beds (Gleneagles, Vasant Kunj, C-DOC, Raigarh, SL Raheja and others)'] },
    ], source: rup(C.clustersSrc) } },
    { pair: [
      { type: 'hbar', title: 'NCR and Punjab are half the beds', unit: 'Operational beds by cluster, Jun-2026', x: CL.map(c => c.cluster.replace(/ \(.*\)/, '')), series: [{ name: 'Beds', values: CL.map(c => c.beds), fmt: 'num' }], labels: 'all', highlight: 'Delhi NCR', source: 'Q1FY27 presentation p.3' },
      { type: 'hbar', title: 'Who pays: insurers and cash patients 70%, government ~21%', unit: 'Hospital revenue by payer, FY26 (%)', x: PM.rows.map(r => r[0]), series: [{ name: 'FY26', values: PM.rows.map(r => r[2]), fmt: 'pct' }], labels: 'all', source: rup(PM.src) },
    ] },
    { exhibit: { type: 'table', title: 'Operating scale', head: ['', 'FY24', 'FY25', 'FY26', 'Q1FY27'], rows: [
      ['Hospital revenue (₹ cr)', n0(SA[2].hospRev), n0(SA[3].hospRev), n0(SA[4].hospRev), n0(Q1.hospRevenue)],
      ['Occupied beds (average)', n0(SA[2].occupiedBeds), n0(SA[3].occupiedBeds), n0(SA[4].occupiedBeds), n0(Q1.occupiedBeds)],
      ['Occupancy', `${SA[2].occupancyPct}%`, `${SA[3].occupancyPct}%`, `${SA[4].occupancyPct}%`, `${Q1.occupancyPct}%`],
      ['ARPOB (₹ cr per bed per year, gross)', SA[2].arpobCr.toFixed(2), SA[3].arpobCr.toFixed(2), SA[4].arpobCr.toFixed(2), Q1.arpobCr.toFixed(2)],
      ['International patient revenue (₹ cr)', '–', '539', '639', n0(Q1.intlRevenue)],
      ['Agilus tests (mn)', '38.8', '39.2', '40.8', n1(Q1.agilusTestsMn)],
      ['Agilus B2C share of revenue', '–', '52%', '52%', `${Q1.agilusB2cPct}%`],
    ], source: 'Company presentations (Q4FY24-Q1FY27); ARPOB on gross revenue' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From the Singh brothers\' crisis to IHH control, and a legal tail that will not end',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: rup(C.historySrc) } },
    { exhibit: { type: 'table', title: 'The Daiichi-IHH legal saga, as it stood on 30-Sep-2026', head: ['Date', 'Event'], wide: [1], rows: C.legal.map(l => [l.date.length === 4 ? l.date : X.shortDate(l.date), rup(l.event)]), source: rup(C.legalSrc) } },
    { callout: '**Corporate actions and per-share data:** no bonus, split or buyback since the 2018 preferential issue; 75.49 cr shares. Screener\'s consolidated "Net Profit" (₹1,064 cr in FY26) is before minorities while its EPS (₹13.80) is after them, so we put profit on the attributable basis (₹1,042 cr; FORTIS.patch.js) to keep the share count right. **What the legal saga means for minority shareholders:** Fortis is neither the judgment debtor nor a garnishee, no liability has been fixed and the audit is paid for by Daiichi; but the audit re-opens the 2018 IHH deal and the RHT buyback, and for six months or more it hangs over IHH\'s plans to raise its stake, inject capital or merge Gleneagles. The open offer that could have given minorities an exit was at ₹170, so it never mattered at today\'s prices.' },
  ],
};

const IN = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Too few beds, more insurance, and more regulation of what hospitals charge',
  blocks: [
    { p: `${rup(IN.beds)} ${rup(IN.insurance)} These are the reasons Indian hospital chains have grown revenue 13-25% a year and why listed chains are building beds as fast as they can. The other side is price: about a fifth of Fortis's revenue comes from government schemes that set their own rates, insurers negotiate package prices, and in Sep-2026 the Supreme Court openly questioned hospital mark-ups on medicines. ${rup(IN.diagnostics)}` },
    { exhibit: { type: 'table', title: 'Forces acting on Fortis\'s markets (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Fortis'], wide: [2], rows: IN.themes.map(r => r.map(rup)), source: rup(IN.src) + '; company calls; press (30-Sep-2026)' } },
    { pair: [
      { type: 'hbar', title: 'Q1FY27 revenue growth: Fortis in the middle of the pack', unit: 'Consolidated revenue growth, Jun-2026 quarter, year on year (%)', x: IND.map(shortName), series: [{ name: 'Growth', values: IND.map(q1g), fmt: 'pct' }], labels: 'all', highlight: 'Fortis', source: 'Screener.in quarterly results (acquisitions included)' },
      { type: 'hbar', title: 'Three-year growth: Fortis 13% a year, like Apollo', unit: 'Revenue growth, FY23-26, a year (%)', x: IND.map(shortName), series: [{ name: 'CAGR', values: IND.map(cagr3), fmt: 'pct' }], labels: 'all', highlight: 'Fortis', source: 'Screener.in (consolidated)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Fortis captures demand for beds, less so price and diagnostics growth',
  blocks: [
    { verdicts: [
      ['Bed shortage in metros', 'Yes', `Occupied beds +15% in FY26 and +17% in Q1FY27 while occupancy held at 68-69%; FMRI runs at 85-90%.`, 'New beds fill; growth is capacity-led.'],
      ['Higher acuity and technology', 'Yes', 'Robotic surgeries +66% and radiation therapy +19% in FY26; renal +28%, neuro +27%, ortho +23% in Q1FY27.', 'Supports ARPOB growth of ~3-4% a year.'],
      ['Price (ARPOB) growth', 'Partly', `ARPOB +9% in FY25 but +3.4% in FY26 and +2.6% in Q1FY27, held back by oncology drug caps and lower-ARPOB acquired units.`, 'Price is no longer the main lever.'],
      ['Insurance penetration', 'Yes', `Insurers (TPAs) 36-37% of hospital revenue; cash patients ~34%.`, 'Stable payer mix, insurers push on tariffs.'],
      ['Government schemes', 'Mixed', 'CGHS raised package rates but capped chemo drugs at MRP less 30%: oncology growth fell from 23-24% to ~5%.', 'A fifth of revenue at prices Fortis does not set.'],
      ['Medical tourism', 'Slowing', `International revenue ₹639 cr in FY26 (+18.5%) but +13% in Q1FY27; share 7.5%.`, 'Helpful, not a driver.'],
      ['Diagnostics market growth (10-12%)', 'No', 'Agilus gross revenue +4% a year in FY23-26; +10% in Q1FY27.', 'Agilus has lost share; recovery not yet proven.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
    { pair: [
      { type: 'hbar', title: 'Diagnostics: Agilus has grown slowest of the listed chains', unit: 'FY23-26 revenue growth a year (%; Fortis = consolidated, Agilus gross ~4%)', x: ['Agilus (gross)', ...DIAG.slice(1).map(shortName)], series: [{ name: 'CAGR', values: [Math.round((Math.pow(1527 / 1348, 1 / 3) - 1) * 1000) / 10, ...DIAG.slice(1).map(cagr3)], fmt: 'pct' }], labels: 'all', highlight: 'Agilus (gross)', source: 'Company presentations (Agilus); Screener.in (peers)' },
      { type: 'hbar', title: 'And on margins it trails Dr Lal and Vijaya', unit: 'FY26 EBITDA margin (%)', x: ['Agilus (operating)', ...DIAG.slice(1).map(shortName)], series: [{ name: 'Margin', values: [23.6, ...DIAG.slice(1).map(s => X.P[s].ebitdaMargin)], fmt: 'pct' }], labels: 'all', highlight: 'Agilus (operating)', source: 'Company presentations; Screener.in (peers)' },
    ] },
  ],
};

module.exports = { business, history, industry, tailwind };
