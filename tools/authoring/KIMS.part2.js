// KIMS report, part 2: business, history, industry, tailwind test.
const fs = require('fs');
const path = require('path');
const X = require('./KIMS.ctx');
const { C, D, A, ROOT, n0, n1, rup, SRC, Q1, FY26, AK, b } = X;
const CL = C.clustersQ1FY27;

// Peer growth from each company's Screener file: Jun-2026 quarter YoY and FY23-26 revenue CAGR.
const scr = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables;
const q1g = sym => { const q = scr(sym).quarters, r = q.rows.Sales || q.rows.Revenue, i = q.periods.indexOf('Jun 2026'), j = q.periods.indexOf('Jun 2025'); return i >= 0 && j >= 0 ? Math.round((r[i] / r[j] - 1) * 1000) / 10 : null; };
const cagr3 = sym => { const t = scr(sym)['profit-loss'], r = t.rows.Sales || t.rows.Revenue, i = t.periods.indexOf('Mar 2026'), j = t.periods.indexOf('Mar 2023'); return Math.round((Math.pow(r[i] / r[j], 1 / 3) - 1) * 1000) / 10; };
const IND = ['KIMS', 'APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'NH', 'MEDANTA', 'RAINBOW', 'JLHL'];
const k = (fy, key) => AK.find(r => r.fy === fy)[key];

const business = {
  id: 'business', nav: 'What KIMS does', kicker: 'The business', title: 'Multi-specialty hospitals at tier-2 prices, built in Telangana and Andhra Pradesh, now in five states',
  blocks: [
    { p: `KIMS runs general multi-specialty hospitals that do complex (tertiary) work: cardiac surgery, neurosurgery, joint replacement, kidney care, gastroenterology, cancer care and heart, lung, liver and kidney transplants. Its formula, set by the founder Dr B. Bhaskara Rao (a cardio-thoracic surgeon who helped design Andhra Pradesh's Aarogyasri health scheme in 2007), is big hospitals at "affordable" prices in second-tier cities, run with full-time doctors, many of whom own equity in the local hospital company. Revenue per occupied bed-day (ARPOB) was ₹${n0(Q1.arpob)} in Q1FY27, far below metro chains, yet the mature Telangana hospitals earn ~30% EBITDA margins.` },
    { p: `In FY26 hospital services brought in ₹${n0(FY26.hospitalServicesMn / 10)} cr, pharmacy ₹${n0(FY26.pharmacyMn / 10)} cr and other income from operations (academic courses, food, O&M fees) ₹${n0(FY26.otherOperatingMn / 10)} cr. Cash-paying patients are ${Q1.payorMixPct.cash}% of revenue, insurers ${Q1.payorMixPct.insurance}%, corporates and government health plans (CGHS, PSUs) ${Q1.payorMixPct.corporate}% and the Aarogyasri scheme only ${Q1.payorMixPct.aarogyasri}% (Q1FY27). No single specialty dominates: cardiac and orthopaedics ${Q1.specialtyMixPct.cardiac}% each, neurosciences ${Q1.specialtyMixPct.neuro}%, renal, gastro and mother & child 9% each, oncology ${Q1.specialtyMixPct.oncology}%, transplants ${Q1.specialtyMixPct.transplant}%.` },
    { exhibit: { type: 'table', title: 'The network at Jun-2026 (beds)', head: ['Cluster', 'Capacity', 'Operational', 'Hospitals (year, beds, KIMS stake)'], wide: [3], rows: [
      ...CL.map(c => [`**${c.cluster}**`, n0(c.capacity), n0(c.operational), c.hospitals]),
      { hl: true, cells: ['**Total**', `**${n0(CL.reduce((s, c) => s + c.capacity, 0))}**`, `**${n0(CL.reduce((s, c) => s + c.operational, 0))}**`, 'Excludes the fee-based O&M hospitals (Sangli, Guntur x2, Kompally; Arete and Kakinada from Aug/Sep-2026)'] },
    ], source: 'Q1FY27 presentation pp.14, 20-23, 30; AR FY26 notes 2.34-2.35' } },
    { pair: [
      { type: 'hbar', title: 'Telangana: half the revenue, three-quarters of the EBITDA', unit: 'Share of Q1FY27 group revenue and EBITDA (%)', x: Object.keys(Q1.clusterRevenueSharePct).flatMap(c => [`${c}: revenue`, `${c}: EBITDA`]), series: [{ name: 'Share', values: Object.keys(Q1.clusterRevenueSharePct).flatMap(c => [Q1.clusterRevenueSharePct[c], Q1.clusterEbitdaSharePct[c]]), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation p.27' },
      { type: 'hbar', title: 'Payer mix: cash patients still more than half', unit: 'Share of revenue (%)', x: ['Cash: FY26', 'Cash: Q1FY27', 'Insurance: FY26', 'Insurance: Q1FY27', 'Corporate: FY26', 'Corporate: Q1FY27', 'Aarogyasri: FY26', 'Aarogyasri: Q1FY27'], series: [{ name: 'Share', values: [FY26.payorMixPct.cash, Q1.payorMixPct.cash, FY26.payorMixPct.insurance, Q1.payorMixPct.insurance, FY26.payorMixPct.corporate, Q1.payorMixPct.corporate, FY26.payorMixPct.aarogyasri, Q1.payorMixPct.aarogyasri], fmt: 'pct0' }], labels: 'all', source: 'Q4FY26 and Q1FY27 presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Operating scale', head: ['', 'FY24', 'FY25', 'FY26', 'Q1FY27'], rows: [
      ['Bed capacity (period end)', n0(k('FY24', 'capacityBeds')), n0(k('FY25', 'capacityBeds')), n0(k('FY26', 'capacityBeds')), n0(Q1.capacityBeds)],
      ['Operational beds', n0(k('FY24', 'opBeds')), n0(k('FY25', 'opBeds')), n0(k('FY26', 'opBeds')), n0(Q1.operationalBeds)],
      ['Occupied beds (average) / occupancy', `${n0(k('FY24', 'occupiedBeds'))} / ${k('FY24', 'occupancyPct')}%`, `${n0(k('FY25', 'occupiedBeds'))} / ${k('FY25', 'occupancyPct')}%`, `${n0(k('FY26', 'occupiedBeds'))} / ${k('FY26', 'occupancyPct')}%`, `${n0(Q1.occupiedBeds)} / ${Q1.occupancyPct}%`],
      ['IP volume (patients admitted)', n0(k('FY24', 'ipVolume')), n0(k('FY25', 'ipVolume')), n0(k('FY26', 'ipVolume')), n0(Q1.ipVolume)],
      ['OP volume (lakh)', n1(k('FY24', 'opVolume') / 1e5), n1(k('FY25', 'opVolume') / 1e5), n1(k('FY26', 'opVolume') / 1e5), n1(Q1.opVolume / 1e5)],
      ['ARPOB (₹ per occupied bed-day)', n0(k('FY24', 'arpob')), n0(k('FY25', 'arpob')), n0(k('FY26', 'arpob')), n0(Q1.arpob)],
      ['ARPP (₹ per inpatient)', n0(k('FY24', 'arpp')), n0(k('FY25', 'arpp')), n0(k('FY26', 'arpp')), n0(Q1.arpp)],
      ['Average length of stay (days)', k('FY24', 'alos').toFixed(2), k('FY25', 'alos').toFixed(2), k('FY26', 'alos').toFixed(2), Q1.alos.toFixed(2)],
    ], source: 'Company presentations (operational beds were redefined in FY25; FY24 occupancy is on the old, smaller base)' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From one hospital in Nellore (2000) to 26 hospitals in five states',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: rup(C.historySrc) } },
    { callout: `**Corporate actions and per-share data:** shares were split 1:5 in Sep-2024 (Screener's per-share history is restated); 40.01 cr shares until the June-2026 QIP added 1.99 cr (42.00 cr), and the promoter warrants would add 0.77 cr (42.77 cr fully diluted). No dividend has been paid since listing. Screener's "Net Profit" is before minorities (FY26 ₹242 cr; FY25 ₹415 cr) and its EPS after them; we use profit attributable to owners (₹241 cr; ₹384 cr) and restate FY26 EPS to a pro forma ₹${n1(A.eps[b])} on 42.77 cr shares (reported ₹6.03), so the model's share count is right (KIMS.patch.js).` },
  ],
};

const IN = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A growing, under-bedded market, but the bed boom is now in KIMS\'s home city',
  blocks: [
    { p: `${rup(IN.icra)} For KIMS three things matter more than the national average: competition for patients and doctors in Hyderabad, where several large hospitals opened in the last year; insurers' willingness to empanel new hospitals quickly, which slowed every one of KIMS's FY26 openings; and the price point of tier-2 Andhra Pradesh, where ARPOB is a third of Hyderabad's.` },
    { exhibit: { type: 'table', title: 'Forces acting on KIMS\'s market (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for KIMS'], wide: [2], rows: IN.themes.map(r => r.map(rup)), source: rup(IN.src) } },
    { pair: [
      { type: 'hbar', title: 'Q1FY27 revenue growth: KIMS +35%, behind only Narayana (acquisition-led)', unit: 'Consolidated revenue growth, Jun-2026 quarter, year on year (%)', x: IND.map(X.shortName), series: [{ name: 'Growth', values: IND.map(q1g), fmt: 'pct' }], labels: 'all', highlight: 'KIMS', source: 'Screener.in quarterly results (acquisitions included)' },
      { type: 'hbar', title: 'FY23-26: 21% a year, near the top with Max, but bought with beds and debt', unit: 'Revenue growth, FY23-26, a year (%)', x: IND.map(X.shortName), series: [{ name: 'CAGR', values: IND.map(cagr3), fmt: 'pct' }], labels: 'all', highlight: 'KIMS', source: 'Screener.in (consolidated)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: KIMS rides demand growth, but price and insurance tailwinds reach it more slowly',
  blocks: [
    { verdicts: [
      ['Volume growth in an under-bedded market', 'Yes', 'IP volumes +15% in FY26 and +27% in Q1FY27; OP +25% and +29%.', 'Demand is there; the question is how fast new beds fill.'],
      ['Rising ARPOB (case mix, price)', 'Partly', 'ARPOB +14% in FY26 and +10% in Q1FY27, mostly from mix (new Bengaluru hospitals at ₹93,000, Telangana transplants); management guides only 4-5% a year.', 'Mix helps, but KIMS deliberately prices below metro chains.'],
      ['Insurance penetration', 'Partly', 'Insurance 30% of FY26 revenue, 32% in Q1FY27; new hospitals waited months for empanelment.', 'A tailwind for mature units, a delay for new ones.'],
      ['Government schemes', 'No', 'Aarogyasri down to 4-5% of revenue; government receivables slow (CFO).', 'Low-price volume KIMS is moving away from.'],
      ['Asset-light O&M model', 'Yes', 'Five fee-based O&M hospitals (9% of revenue) plus two consolidated Kerala O&M units; call options from Jan-2027.', 'Cheap growth if the call options are used wisely.'],
      ['Premium metros (Bengaluru, Mumbai region)', 'Partly', 'Bengaluru ARPOB ₹92,793 in Q1FY27 but still loss-making; Thane slower to staff with full-time doctors.', 'Higher price, slower ramp, a different competitive set.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { business, history, industry, tailwind };
