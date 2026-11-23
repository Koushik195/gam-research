// BKT report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./BALKRISIND.ctx');
const { C, D, SA, n0, n1, rup, bld, BL, FY26, Q1 } = X;
const I = D.industry, MX = FY26.mix;

const business = {
  id: 'business', nav: 'What BKT does', kicker: 'The business', title: 'A specialist in off-highway tyres, sold mostly abroad and mostly as replacements',
  blocks: [
    { p: `Balkrishna Industries sells tyres under the BKT brand for machines that work off the road: **agricultural** tyres for tractors, harvesters, sprayers and trailers (${MX.agriPct}% of FY26 volume) and **OTR** tyres for construction, mining, ports and industrial machines (${MX.otrPct}%), plus ATV, gardening and other tyres (${MX.othersPct}%). It makes 3,600+ sizes in four tyre plants (Waluj in Maharashtra, Bhiwadi and Chopanki in Rajasthan, Bhuj in Gujarat) with ~360,000 MTPA of achievable output, and sells in 160 countries. ${MX.replacementPct}% of volume goes to the replacement market (farmers, contractors and mines buying through distributors) and ${MX.oemPct}% to equipment makers. By destination, FY26 volume was Europe ${MX.europePct}%, India ${MX.indiaPct}%, the Americas ${MX.americasPct}% and the rest of the world ${MX.rowPct}%; exports were ~64% of revenue.` },
    { p: `Two newer businesses sit beside the tyres. **Carbon black**: BKT makes its own at Bhuj (360,000 MTPA since Q1FY27, with 64 MW of captive power from the process gases) and sells the surplus to other tyre and plastics makers: ~9% of FY26 revenue and ~10% of Q1FY27. **On-highway tyres** for India: truck and bus radials (from Feb/Apr-2026), two-wheeler tyres and, from a pilot in Q3FY27, passenger-car radials. Management targets ₹23,000 cr of revenue by FY30 (OHT 70%, carbon black 10%, on-highway 20%). BKT reports all of this as one segment and does not disclose revenue by business in rupees.` },
    { exhibit: { type: 'table', title: 'The businesses: FY26 and our FY27E-29E build (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['OHT tyres', n0(BL.base.oht), ...bld.map(r => n0(r.oht)), 'FY26 = revenue less ~9% third-party carbon black'],
      ['  volume (MT)', n0(FY26.standalone.volumeMt), ...bld.map(r => n0(r.vol)), `+${BL.ohtVolumeGrowth.join('% / +')}%`],
      ['  price/mix', '', ...bld.map(r => `+${n1(r.realGrowth)}%`), 'Price increases, EUR/INR, India mix'],
      ['Carbon black (third party)', n0(BL.base.carbonBlack), ...bld.map(r => n0(r.cb)), `+${BL.carbonBlackGrowth.join('% / +')}%`],
      ['On-highway tyres (India)', '~0', ...bld.map(r => n0(r.oh)), 'TBR, 2W, PCR; our estimate'],
      { hl: true, cells: ['**Revenue (build)**', `**${n0(BL.base.oht + BL.base.carbonBlack)}**`, ...bld.map(r => `**${n0(r.rev)}**`), ''] },
      ['Revenue in the model', '{{A.sales.11|num}}', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', 'Build and model agree within 0.2%'],
    ], source: 'Q4FY26 and Q1FY27 calls (carbon black share), AR FY26; GAM estimates (assumptions.json "build")' } },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Plants', 'Tyres: Waluj (Chhatrapati Sambhajinagar), Bhiwadi and Chopanki (Rajasthan), Bhuj (Gujarat, the largest, with carbon black, power, moulds and the new CV/PCR lines)'],
      ['Capacity', 'Tyres ~360,000 MTPA achievable (to 425,000 MTPA with the 35,000 MTPA project and debottlenecking); carbon black 360,000 MTPA incl. 30,000 MTPA advanced carbon; power 64 MW'],
      ['Market share (company)', 'India 18-19%, Europe 7-8%, US 3-4%; ~5-6% of the global OHT market (target 8% by FY30)'],
      ['Distribution', 'Distributors in the Americas, Europe, India and the rest of the world; ~90 primary distributors appointed for on-highway in India'],
    ], source: 'Q1FY27 presentation and call; Q4FY26 call; ICICI Direct (31-Jul-2026)' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Forty years of building a niche; the last five spent on capacity and new markets',
  blocks: [
    { p: 'BKT was built by the Poddar family from a single plant at Aurangabad (1987) into the largest Indian maker of off-highway tyres, mostly by exporting radial farm tyres to European dealers at prices below the global majors. The Bhuj greenfield site (from 2015) brought captive carbon black (2020) and power. The post-Covid boom lifted revenue 43% in FY22; the freight and raw-material spike cut the margin to 18% in FY23. Since 2024 the company has widened its ambitions: advanced carbon materials, a ₹6,800 cr capex plan and entry into Indian on-highway tyres. There have been no acquisitions, demergers or share issues in the last five years: 19.33 cr shares of ₹2 each, unchanged in FY25 and FY26 (AR FY26 note 17).' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Impact on the numbers'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.what), rup(h.impact)]), source: 'Q1FY27 presentation ("BKT through the years"); annual reports; earnings calls; Screener.in' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A slow-growing global market (~3% a year); India and mining are the bright spots',
  blocks: [
    { p: `Off-highway tyres are a small, specialised part of the tyre market. Smithers (quoted in BKT's FY26 annual report) expects global OHT volume to grow from ${I.globalOhtUnitsMn['2026']} mn units in 2026 to ${I.globalOhtUnitsMn['2029']} mn in 2029, under 3% a year. Demand follows farm incomes and equipment sales in Europe and North America, construction and mining activity, and dealer inventories, which swung hard in FY23-25. The global majors (Michelin, Bridgestone, Yokohama's off-highway business and others) dominate the first-fit market for large equipment makers; BKT's edge is the replacement market, where farmers trade down from the premium brands. India's OHT market is small (~USD ${I.indiaOhtUsdBn.now} bn) but growing ~${I.indiaOhtUsdBn.cagrPct}% a year on farm mechanisation and infrastructure; BKT already has 18-19% of it.` },
    { bullets: [
      `**Headwinds in 2025-26.** ${rup(I.headwinds)}.`,
      '**Raw materials.** Natural and synthetic rubber, carbon black feedstock, nylon and steel cord: crude-linked items rose again in Q4FY26-Q2FY27 (management: +4-5% in Q4FY26, +7-8% in Q1FY27, +5% more over Q2-Q3).',
      '**Freight.** Container and vessel availability and freight (4.5-7% of revenue in FY26-27) hit an exporter shipping heavy tyres to Europe and the Americas.',
      `**Carbon black.** A ~${I.carbonBlackGlobalMt.now} mn tonne global market growing ~2.3% a year by volume (to ~${I.carbonBlackGlobalMt['2030']} mn t by 2030); India ~USD ${I.indiaCarbonBlackUsdBn.now} bn, growing 4-5% (AR FY26).`,
      '**On-highway tyres in India.** A large market led by MRF, Apollo, CEAT and JK, all adding capacity; BKT enters truck radials, two-wheelers and premium passenger-car tyres as a newcomer.',
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the tailwind reach BKT? India yes; global farm demand only partly; currency both ways',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach BKT?', 'Catch'], wide: [1, 3], rows: [
      ['Indian farm mechanisation and infrastructure', 'India ~40% of Q1FY27 volume (36% in FY26); growth across agriculture, construction and mining', 'Yes: BKT has 18-19% of the Indian OHT market and is gaining share', 'India earns a "marginally lower" margin than exports'],
      ['European farm recovery', 'Europe volumes grew strongly in Q1FY27 on a weak base and a good season; dealer inventories normal', 'Yes, but it is a recovery, not growth: Europe was 40% of FY26 volume', 'Heat waves and farm incomes; management gives no guidance'],
      ['US reopening', 'US duty back to ~10% from 50%; refunds filed; aim to restore the US to 15-16% of revenue', 'Partly: Americas 12% of Q1 volume', 'Trade policy can change again; US share only 3-4%'],
      ['Weak rupee', 'EUR ~₹110 spot (Jul-2026) vs ₹94-99 realised in FY26; FY27 hedges at ~₹107', 'Yes in FY27, with a lag through the hedge book', 'FY26 showed the reverse: ₹517 cr of FX swing against BKT'],
    ], source: 'Company calls (May and Jul-2026); AR FY26; GAM Research' } },
    { callout: '**Verdict:** the tailwinds that reach BKT most directly are Indian, and India is the lower-margin market. The global OHT market grows ~3% a year, so BKT\'s growth outside India has to come from share gains in Europe and the US. FY27 looks good because the base is weak (tariffs, hedging losses), not because the market has turned into a growth market.' },
  ],
};

module.exports = { business, history, industry, tailwind };
