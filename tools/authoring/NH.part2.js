// Narayana Hrudayalaya report, part 2: business, history, industry, tailwind test.
const fs = require('fs');
const path = require('path');
const X = require('./NH.ctx');
const { C, D, A, ROOT, n0, n1, rup, SRC, Q1, FY26, b, segR, ann } = X;
const BZ = C.business, CL = BZ.clustersQ1FY27, MX = BZ.mixQ1FY27;

// Peer growth from each company's Screener file: Jun-2026 quarter YoY and FY23-26 revenue CAGR.
const scr = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables;
const q1g = sym => { const q = scr(sym).quarters, r = q.rows.Sales || q.rows.Revenue, i = q.periods.indexOf('Jun 2026'), j = q.periods.indexOf('Jun 2025'); return i >= 0 && j >= 0 ? Math.round((r[i] / r[j] - 1) * 1000) / 10 : null; };
const cagr3 = sym => { const t = scr(sym)['profit-loss'], r = t.rows.Sales || t.rows.Revenue, i = t.periods.indexOf('Mar 2026'), j = t.periods.indexOf('Mar 2023'); return Math.round((Math.pow(r[i] / r[j], 1 / 3) - 1) * 1000) / 10; };
const IND = ['NH', 'APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'MEDANTA', 'RAINBOW', 'JLHL', 'KIMS'];
const f26 = ann('FY26');

const business = {
  id: 'business', nav: 'What Narayana does', kicker: 'The business', title: 'Four businesses under one brand: India hospitals, a Cayman hospital and insurer, a UK NHS provider, and Indian clinics and insurance',
  blocks: [
    { p: `**India hospitals** (₹4,740 cr revenue in FY26, 60% of the group): 20 hospitals and heart centres with ${n0(BZ.beds.indiaOperational)} operational beds (${n0(BZ.beds.indiaCapacity)} capacity) in six clusters, led by Bengaluru (37% of India hospital revenue) and Kolkata (25%). About three-quarters of revenue comes from hospitals Narayana owns; a quarter from hospitals it runs for trusts and state governments on rental or revenue-share terms (Raipur, Jamshedpur, Mumbai and others), which is part of why its beds are so cheap. Cardiac sciences are a third of revenue, oncology 16%. The model is high volume at low prices: 2,137 cardiac surgeries at the Bengaluru flagship in Q1FY27 and ~100 robotic cardiac cases a month, at an ARPOB of ~₹52,600 a day, below most listed peers.` },
    { p: `**Cayman Islands** (₹1,889 cr, 24%): Health City Cayman Islands and Health City Camana Bay, 164 beds, earning US dollars (hospital revenue US$${FY26.cayman.hospitalUsdMn} mn in FY26, +27%) with no local corporate tax, plus an insurer (CIHL) that started selling in Jan-2025 and steers members to the hospitals (US$${FY26.cayman.cihlUsdMn} mn revenue, US$${FY26.cayman.cihlEbitdaUsdMn} mn EBITDA in FY26). **United Kingdom** (₹1,299 cr in five months; ~₹3,400 cr a year): Practice Plus Group Hospitals, bought in Nov-2025: 13 facilities, 330 beds, 37 theatres, day-care orthopaedics, ophthalmology and diagnostics, ~95% paid by the NHS. **India integrated care**: 11 clinics in Bengaluru and Hosur (₹61 cr revenue) and Narayana Health Insurance (₹44 cr of premium written); together they lost ₹67 cr in FY26.` },
    { exhibit: { type: 'table', title: 'India hospital clusters at Jun-2026', head: ['Cluster', 'Capacity beds', 'Share of India hospital revenue', 'Revenue growth, Q1FY27 YoY', 'IP revenue per patient (₹ \'000)'], rows: [
      ...CL.map(c => [`**${c.cluster}**`, n0(c.beds), `${c.revSharePct}%`, `+${c.revGrowthPct}%`, n0(c.ipArppK)]),
      { hl: true, cells: ['**India total**', `**${n0(CL.reduce((s, c) => s + c.beds, 0))}**`, '100%', '+16%', '163'] },
    ], source: 'Q1FY27 presentation pp. 8-10' } },
    { pair: [
      { type: 'hbar', title: 'Group revenue by business, FY26', unit: 'Revenue (₹ crore); UK for five months', x: ['India hospitals', 'Cayman hospitals', 'UK (PPG)', 'Cayman insurance', 'India clinics + insurance'], series: [{ name: 'FY26', values: [f26.indRev, f26.cayRev, f26.ukRev, f26.cihlRev, f26.icRev].map(v => Math.round(v)), fmt: 'num' }], labels: 'all', highlight: 'India hospitals', source: 'PL Q1FY27 note; AR FY26 note 33; GAM Research' },
      { type: 'hbar', title: 'Who pays in India: walk-in patients still the largest group', unit: 'India hospital revenue by payer, Q1FY27 (%)', x: ['Walk-in (cash)', 'Insured & corporate', 'Government schemes', 'International patients'], series: [{ name: 'Share', values: [MX.payer.walkIn, MX.payer.insured, MX.payer.schemes, MX.payer.international], fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 presentation p. 8' },
    ] },
    { exhibit: { type: 'table', title: 'Operating scale', head: ['', 'FY24', 'FY25', 'FY26', 'Q1FY27'], rows: [
      ['India ARPOB (₹ mn per occupied bed a year)', '14.0', '15.9', '17.9', n1(Q1.indiaHospitals.arpobMn)],
      ['India occupied beds (revenue ÷ ARPOB)', '~2,774', '~2,708', '~2,648', '~2,712'],
      ['India IP discharges / OP footfalls (\'000, quarter)', '–', '–', '53 / 621 (Q4)', `${Q1.indiaHospitals.ipK} / ${Q1.indiaHospitals.opK}`],
      ['Average length of stay, India (days)', '–', '–', '4.4 (Q4)', n1(Q1.indiaHospitals.alos)],
      ['Cayman discharges / outpatients', '2,449 / 38,851', '2,550 / 40,504', '3,170 / 50,864', `${Q1.cayman.discharges} / ${n0(Q1.cayman.outpatients)}`],
      ['UK revenue (£ mn)', '229 (pre-deal, Sep YE)', '250 (FY25E, pre-deal)', '110 (5 months)', '65.0'],
    ], source: 'Company presentations; PPG acquisition deck; GAM Research' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From one cardiac hospital in Bengaluru (2000) to three countries, two insurers and a UK buyout',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: rup(C.historySrc) } },
    { callout: '**Corporate actions and per-share data:** no split or buyback since listing; 20.44 cr shares (12.6 lakh of them held by the ESOP trust, so the company\'s own EPS uses 20.31 cr). Screener\'s FY26 Net Profit (₹806 cr, owners, including the ₹4.5 cr loss of the discontinued Jammu hospital) ÷ EPS (₹39.42) implies 20.45 cr shares, which matches the share count, so we use Screener\'s figures without adjustment; minorities are ~₹0.4 cr a year. FY26 also carries a ₹51 cr labour-code charge and ₹76 cr of one-time UK acquisition costs.' },
  ],
};

const IN = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Indian hospitals: price has done the work, new beds cost three times the old ones, and two foreign markets add currency and policy risk',
  blocks: [
    { p: rup(IN.summary) },
    { exhibit: { type: 'table', title: 'Forces acting on Narayana\'s markets (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Narayana'], wide: [2], rows: IN.themes.map(r => r.map(rup)), source: IN.src } },
    { pair: [
      { type: 'hbar', title: 'Q1FY27 revenue growth: Narayana +78% (UK), India hospitals +16%', unit: 'Consolidated revenue growth, Jun-2026 quarter, year on year (%)', x: IND.map(X.shortName), series: [{ name: 'Growth', values: IND.map(q1g), fmt: 'pct' }], labels: 'all', highlight: 'Narayana', source: 'Screener.in quarterly results (acquisitions included)' },
      { type: 'hbar', title: 'Three-year growth: in line with peers only because of the UK', unit: 'Revenue growth, FY23-26, a year (%)', x: IND.map(X.shortName), series: [{ name: 'CAGR', values: IND.map(cagr3), fmt: 'pct' }], labels: 'all', highlight: 'Narayana', source: 'Screener.in (consolidated)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Narayana captures price and complexity in India; abroad, the tailwinds are someone else\'s',
  blocks: [
    { verdicts: [
      ['Higher-acuity care and technology (robotics, TAVI, transplants)', 'Yes', 'India ARPOB +13% in FY26, +9% in Q1FY27; Bengaluru IP revenue per patient ₹2.5 lakh; ~100 robotic cardiac cases a month.', 'The main source of India margin gains.'],
      ['More patients in organised private hospitals', 'Partly', 'Occupied beds fell ~5% over FY24-26; IP discharges +8% and OP +9% in Q1FY27 (clinics now feed ~30% of Bengaluru OPD footfall).', 'Volume only returns with new beds from FY28.'],
      ['Insurance penetration', 'Yes', 'Insured patients 33% of India hospital revenue; walk-in 43%.', 'Supports price; NH also wants to be the insurer.'],
      ['Government schemes', 'Mixed', 'Schemes 18% of India revenue at lower tariffs; slower government collections (AR FY26).', 'Fills beds, dilutes ARPOB.'],
      ['Medical tourism', 'No (recovering)', 'International patients −9% in FY26 (Bangladesh), +58% in Q1FY27 off a low base; 5% of India revenue.', 'Upside, not a plan.'],
      ['NHS backlog and outsourcing (UK)', 'Volume yes, price no', 'NHS waiting list 7.4 mn; outsourcing £18 bn a year; PPG is ~95% NHS at NHS tariffs; UK revenue +5% like-for-like in Q1FY27.', 'Keeps theatres busy at ~9% margins.'],
      ['Weaker rupee', 'Yes (reported)', '~45% of FY27E revenue in US$/GBP; ₹94.7/US$ in Q1FY27 vs ~₹88 in FY26.', 'Lifts rupee profits; does not change US$ growth.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { business, history, industry, tailwind };
