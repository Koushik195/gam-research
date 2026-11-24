// Tenneco Clean Air India report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./TENNIND.ctx');
const { C, D, SG, n0, n1, Q1, A, b, var26 } = X;
const MX = SG.mixFy26, CAP = SG.capacity;

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'Two businesses under one roof: exhaust and powertrain parts (49%), shock absorbers and struts (51%)',
  blocks: [
    { p: `Tenneco Clean Air India is the Indian arm of Tenneco, a US auto-parts maker owned by funds managed or advised by affiliates of Apollo Global Management. It has 12 plants (Chakan I and II, Chennai, Pondicherry, Sanand, Pithampur, Bawal, Bhiwadi, Parwanoo, Hosur, Pune) and two technical centres, and sells to 119 customers. In FY26 it had revenue of ₹${n0(A.sales[b])} cr and value-added revenue (VAR: revenue less substrates passed through at cost) of ₹${n0(var26)} cr.` },
    { exhibit: { type: 'table', title: 'What it makes', head: ['Segment', 'Share of FY26 VAR', 'Products', 'Market position (value share)'], wide: [2, 3], rows: [
      ['Clean Air & Powertrain Solutions (CA&PT)', `${MX.caPct}%`, 'Hot end (catalytic converters, DOC/SDPF/SCR after-treatment), cold end (mufflers, resonators, pipes), spark plugs and ignition coils, engine bearings, sealings, heat shields', 'CV clean air 58% (#1); off-highway clean air 68% (#1); PV clean air #2 (~40% per JM Financial/RHP, ~20% per Motilal Oswal: different bases); engine bearings #2'],
      ['Advanced Ride Technologies (ART)', `${MX.artPct}%`, 'Shock absorbers and struts for cars (conventional, DCx DaVinci passive-plus, semi-active electronic) and for trucks', 'PV shock absorbers and struts 55% (#1)'],
    ], source: 'Q4FY26 and Q1FY27 presentations (CRISIL, FY26); JM Financial (7-Jan-2026) and Motilal Oswal (15-Sep-2026) for PV clean air' } },
    { pair: [
      { type: 'donut', title: 'End markets: cars two-thirds, trucks a fifth', unit: '% of FY26 VAR', x: ['Passenger vehicles', 'Commercial vehicles', 'Industrial / others', 'Aftermarket', 'Other operating income'], series: [{ name: 'Share', values: [MX.pvPct, MX.cvPct, MX.industrialPct, MX.aftermarketPct, MX.otherOpIncomePct], fmt: 'pct0' }], colors: ['#0d1f44', '#2f6db5', '#7fa7d9', '#cf8f1f', '#8c8c8c'], source: 'Q4FY26 presentation p19 (as read from the chart)' },
      { type: 'donut', title: 'No customer above 22%; top ten are ~79%', unit: '% of FY26 VAR', x: ['Top customer', 'Customers 2-5', 'Customers 6-10', 'Others'], series: [{ name: 'Share', values: [MX.topCustomerPct, MX.top2to5Pct, MX.top6to10Pct, MX.othersPct], fmt: 'pct' }], source: 'Q4FY26 presentation p20' },
    ] },
    { p: `Domestic sales were ${MX.domesticPct}% of FY26 VAR and exports ${MX.exportPct}% (about 7% of revenue in Q1FY27). Capacity: 3 mn cold ends (51% used in FY26), 2 mn hot ends (78%) and 21 mn shock absorbers and struts (90%). Management says CA&PT runs above 80% and ART above 90% after the GST-cut demand jump, which is why two greenfields were announced: Kharkhoda, Haryana (Clean Air, ₹71 cr) and western India (ride control, ₹69 cr).` },
    { callout: '**How it makes money:** it designs (with Tenneco\'s global technology) and assembles systems that are validated for a vehicle platform and then supplied for its 5-7 year life. Steel and substrates are passed through (steel with a quarter\'s lag; substrates at cost), so profit is earned on conversion and engineering. That is why management reports margins on VAR and why reported revenue can fall while profit rises (FY25).' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'A 2025 regrouping of four Tenneco companies, a parent-only IPO, then a 15% block sale',
  blocks: [
    { exhibit: { type: 'table', title: 'Corporate history and what it did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['2018', 'Tenneco Clean Air India Pvt Ltd incorporated; the ride-control, ignition, bearings and sealings businesses sat in four sister companies', 'FY21-22 Screener figures are this shell alone (dropped from our model)'],
      ['Mar-2025', 'Motocare India (aftermarket distribution) sold to a fellow Tenneco subsidiary for ₹829 cr', 'Gain parked in capital reserve on consolidation; ₹663 cr collected in FY26 inflated operating cash flow'],
      ['Mar-2025', 'Common-control combination: Tenneco Automotive India and three Federal-Mogul India companies acquired by share swap (189.5 mn new shares)', 'Pooled and restated from 1-Apr-2022: FY23-26 are comparable, earlier years are not'],
      ['Apr-Aug 2025', 'Four interim dividends: ₹25.68 a share, ₹1,037 cr, all to Tenneco', 'Equity fell to ₹1,198 cr: ROE/ROCE look higher'],
      ['19-Nov-2025', `IPO at ₹397, a pure offer for sale (₹3,600 cr, 9.07 cr shares); listed at ₹505 on NSE`, 'No money for the company; no new shares (40.36 cr throughout)'],
      ['Nov-2025 to Feb-2026', 'New labour codes notified; gratuity recomputed', '₹27 cr exceptional charge in Q3FY26 (₹20 cr after tax)'],
      ['12-Aug-2026', 'Parent sold 6.05 cr shares (15.0%) in a block (floor ₹515; traded ~₹525-529); 90-day lock-up', 'Promoter holding ~59.8% after the sale (from 74.79%); free float up'],
    ], source: 'AR FY26 (notes 39, 44); RHP via Chittorgarh; Q3FY26 call (16-Feb-2026); CNBC-TV18 (12-Aug-2026); Khaitan & Co (23-Sep-2026)' } },
    { callout: '**Why it matters:** the listed company is a 2025 construction. Its history before FY23 cannot be compared, its FY26 cash flow is flattered by an intra-group sale, and its pre-IPO dividends were set by the parent. That is not wrong, but it means the track record a minority investor can judge is only three-and-a-half years long.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Content grows with emission law and with car buyers\' taste for SUVs; volume follows the vehicle cycle',
  blocks: [
    { p: D.industry.cleanAir.replace(/Rs/g, '₹') },
    { p: D.industry.ride.replace(/Rs/g, '₹') },
    { p: `${D.industry.cycle} ${D.industry.evRisk}` },
    { exhibit: { type: 'table', title: 'What drives each market', head: ['Driver', 'Clean Air & Powertrain', 'Ride control'], wide: [1, 2], rows: [
      ['Vehicle production', 'Trucks, tractors, construction equipment, cars (ICE, CNG, hybrids only)', 'All cars and trucks, including EVs'],
      ['Content per vehicle', 'Emission and fuel-economy law: BS-VI (2020), RDE (2023), CAFE-3 (2027), BS-VII and TREM-V (dates not set)', 'Premiumisation: passive-plus ~2x, semi-active ~4x a conventional damper (JM Financial)'],
      ['Who decides', 'The vehicle maker\'s engine programme; supplier chosen at design stage', 'Ride tuning per model and trim; often several suppliers per OEM'],
      ['Main competitors (India)', 'Clean air: Sharda Motor, SM Auto, Cummins Emission Solutions. Ignition: Bosch, Niterra (NGK), Denso. Bearings and sealings: Daido, Bimetal Bearings, Taiho Kogyo, Talbros, ElringKlinger', 'Gabriel India, Endurance Technologies'],
    ], source: 'JM Financial (7-Jan-2026, Exhibit 1 and CRISIL data); company calls' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach the company?', title: 'Yes in ride control; only partly in exhaust until FY28',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Reaches Tenneco?', 'Evidence'], wide: [2], rows: [
      ['Car demand after the Sep-2025 GST cut', 'Yes (ART); No (CA&PT at the largest maker)', `ART +${Q1.artGrowth}% in Q1FY27; CA&PT +${Q1.caGrowth}% vs a 16% served market: no clean-air business at the leading Japanese PV maker, the biggest GST winner`],
      ['SUV mix and premiumisation', 'Yes', 'DCx DaVinci wins at five customers; 55% share in PV dampers (52% a year earlier)'],
      ['EV adoption', 'Mixed', 'EVs need better dampers (semi-active for Mahindra BE6/XEV 9e) but have no exhaust: ~20% of VAR exposed (JM)'],
      ['CAFE-3 / BS-VII', 'Yes, from FY28', 'Gasoline particulate filters from 2027; first clean-air programme at the Japanese PV leader for CAFE-3 (2028-29); ₹1,300-1,400 cr industry content'],
      ['Truck upcycle', 'Yes', '58% CV clean-air share; gains with a German truck maker (Q1FY27)'],
      ['India as Tenneco\'s export hub', 'Slowly', `Exports ${SG.mixFy26.exportPct}% of VAR; 14-20% of new orders; ~70% of export orders are Tenneco-to-Tenneco; US tariffs hurt exhaust exports`],
    ], source: 'Company calls (Feb-, Jun- and Aug-2026); JM Financial (7-Jan-2026); GAM Research' } },
    { callout: '**Verdict:** the two halves face different tailwinds. Ride control is riding premiumisation and EVs now. Exhaust has the bigger long-term content story (CAFE-3, BS-VII) but is missing the current car cycle at the market leader; its growth should re-accelerate only from FY28.' },
  ],
};

module.exports = { business, history, industry, tailwind };
