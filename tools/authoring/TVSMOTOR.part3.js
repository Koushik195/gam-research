// TVS Motor report, part 3: tailwind test and the domestic ICE business (motorcycles, scooters, mopeds).
// EV and exports & three-wheelers are in part3b.
const X = require('./TVSMOTOR.ctx');
const { SG, D, BUILD, n0, n1 } = X;
const Q = SG.quarterly, IND = D.industry, B3 = require('./TVSMOTOR.part3b');
const domIce = [3250000, 3872100, ...BUILD.map(b => Math.round(b.units.domIce * 1000))];

const tailwind = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach TVS?', title: 'Tailwind test: TVS captures more of the sector\'s growth than anyone else',
  blocks: [
    { p: 'A sector tailwind helps a shareholder only if the company captures it, at a profit. We score each driver on whether TVS is the main beneficiary, one of several, or a bystander.' },
    { verdicts: [
      ['GST 2.0 cut on bikes and scooters up to 350cc', 'Yes', 'Almost all TVS volume is below 350cc (Ronin 225cc, Apache up to 310cc, RTX 300); domestic ICE +21% in Q1FY27 vs industry +13%.', 'Full beneficiary; the 40% rate on >350cc hits Norton and the 310s only at the margin.'],
      ['Scooterisation', 'Yes', 'Domestic scooters 2.30mn in FY26 (incl. EV), ~28% of an 8.1mn market (derived); Jupiter 110/125 and Ntorq 125/150; management sees scooters going from ~38% to 40%+ of 2W.', 'TVS is #2 in scooters behind Honda and gaining.'],
      ['Premium motorcycles (150cc+)', 'Partly', 'Apache, Ronin, RTX 300, BMW 310 contract manufacturing; Emkay: ~47% of FY26 TVS motorcycle sales premium.', 'A participant; Bajaj and Royal Enfield own more of the profit pool.'],
      ['Rural recovery / commuter bikes', 'Partly', 'Domestic motorcycles 1.42mn (~10.5% of a 13.5mn market, derived); management: economy segment "challenging" and TVS\'s exposure is small.', 'Hero and Honda capture most of a rural upturn.'],
      ['Electric two-wheelers', 'Yes', '#1 with 24.3% of FY26 registrations and 27.1% in Aug-2026; 1mn+ iQube built; EV revenue ~₹5,000 cr (FY26).', 'Captured, but at thin margins and with four strong rivals.'],
      ['Exports to Africa, LatAm, Asia', 'Yes', 'International 2W +31% in FY26 vs industry +12%; Q1FY27 +32%; HLX 5mn cumulative.', 'A clear structural win.'],
      ['Electric three-wheelers', 'Partly', 'TVS 3W +63% in FY26; EV 3W penetration >40%; L5 e-3W subsidy closed Dec-2025; Bajaj dominates 3W.', 'Small for TVS (3.7% of units).'],
      ['Easier credit / captive finance', 'Yes', 'TVS Credit book +19% (Jun-26); 14 lakh new customers in Q1FY27.', 'Helps volumes, but the credit risk sits in the group.'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: TVS captures 5 of 8 directly and 3 partly', source: 'SIAM/Vahan via AR and Autocar Pro, company calls, Emkay (18-Aug-2026), GAM Research' },
    { callout: '**Our view:** few Indian companies are as well placed for the next three years of two-wheeler demand: scooters, EVs and exports are TVS\'s strongest areas and the fastest-growing parts of the market. The investment question is not whether TVS grows. It is how much of that growth is already in a price of ~36x next-year earnings.' },
  ],
};

const domestic = {
  id: 'domestic', nav: 'Domestic ICE business', kicker: 'Segment: domestic petrol two-wheelers', title: 'Domestic ICE: share up ~2 points in two years, led by scooters',
  blocks: [
    { p: `Domestic petrol (ICE) two-wheelers, with domestic three-wheelers and spares, are ~64% of TVS revenue. Volumes rose from 3.25mn in FY25 to 3.87mn in FY26 (+19% against +9% for the industry) and 21% in Q1FY27 (industry 13%). Including EVs, TVS sold ${n0(IND.tvsShare[2].dom2W)} two-wheelers in India in FY26, ~${n1(IND.tvsShare[2].share)}% of the market on our estimate (${n1(IND.tvsShare[0].share)}% in FY24), and 18.8% in March 2026 (Hero 28.0%, Honda 25.9%). In June and August 2026 TVS sold more two-wheelers than Hero or Honda when exports are included. Scooters are the engine: domestic scooter sales (incl. EV) rose 27% to 2.30mn in FY26; motorcycles rose 18% to 1.42mn; the XL100 moped, a category TVS has almost to itself, grew 4% to 0.52mn.` },
    { pair: [
      { type: 'column', title: 'Domestic two-wheeler dispatches by quarter', unit: "Domestic 2W incl. EV ('000)", x: Q.map(q => q.q), series: [{ name: 'Domestic 2W', values: Q.map(q => Math.round(q.dom2W / 1000)), fmt: 'num' }], labels: 'all', source: 'Sum of monthly sales releases' },
      { type: 'column', title: 'Domestic ICE: 3.25mn (FY25) to ~4.8mn (FY29E)', unit: 'Domestic petrol 2W units (mn); FY27-29E = GAM', x: ['FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Domestic ICE', values: domIce, fmt: 'mn', growth: true }], labels: 'all', highlight: 'FY26', source: 'AR FY25-26 (3.25mn, 3.87mn); GAM estimates' },
    ] },
    { h: 'Why TVS keeps gaining share' },
    { bullets: [
      '**Portfolio built around the customer, not the price point:** Jupiter 110/125 (JD Power IQS/APEAL leaders), Ntorq 125 and the 150cc "hyper-sport" Ntorq launched in FY26, Raider 125, Apache RTR/RR/RTX 300 and Ronin. A refresh every season (management: "something new every time").',
      '**Pricing power in scooters:** on the Q1FY27 call UBS noted a major rival was discounting scooters heavily while TVS still gained share at a premium price.',
      '**Clean channel:** dealers are cash-and-carry and carry under 25-30 days of stock, so dispatches track retail. Q1 retail and wholesale share both rose.',
      '**What could stop it:** Honda\'s scooter dominance (Activa) and its pricing; EV cannibalisation of TVS\'s own Jupiter; an El Niño-hit rural market from H2FY27; the post-GST base from Q3FY27.',
    ] },
    { p: `**Forecast.** We assume domestic ICE volumes +11% in FY27E (H1 ~+20% already visible; H2 +5% on the post-GST base), then +6% and +5%, and revenue per vehicle +5% in FY27E (1.5% price in Q1, 0.5% in Q2, premium mix) and +3% a year after. That gives domestic ICE, 3W and spares revenue of ₹${n0(BUILD[0].dom)} cr in FY27E and ₹${n0(BUILD[2].dom)} cr in FY29E.` },
  ],
};

module.exports = { tailwind, domestic, ev: B3.ev, exports: B3.exports };
