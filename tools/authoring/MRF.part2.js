// MRF report, part 2: what the company does, history and corporate actions, industry (demand, raw materials, price
// increases, capacity) and the tailwind test.
const X = require('./MRF.ctx');
const { C, D, SA, n0, n1, bld } = X;
const I = D.industry, AB = C.about, A25 = SA.find(a => a.fy === 'FY25');

const business = {
  id: 'business', nav: 'What MRF does', kicker: 'The business', title: 'India\'s largest tyre maker: one in three tyres sold, seven in ten rupees from the replacement market',
  blocks: [
    { p: `MRF (Madras Rubber Factory) makes tyres, tubes, flaps and tread rubber for every kind of vehicle: trucks and buses, two- and three-wheelers, cars and SUVs, light commercial vehicles, tractors, off-the-road machines and aircraft. It sold ~31.9% of all tyre units sold by Indian makers in FY26 (CARE), from nine plants with ${AB.capacityMnTyres.FY26} mn tyres of capacity. It reports one segment. Three facts matter for the numbers. **Replacement** (tyres sold through 5,000+ dealers to vehicle owners) is ${AB.channelMixFY26.replacement}% of sales, **OEM** (fitted on new vehicles, incl. defence) ${AB.channelMixFY26.oem}% and **exports** ~${AB.channelMixFY26.exports}%. **Truck and bus tyres** are about half of revenue (49% in FY25), two- and three-wheelers 19%, cars 13%. And **raw materials** (natural rubber, synthetic rubber, carbon black, nylon and steel cord) are ~60-67% of revenue, a third of them imported.` },
    { pair: [
      { type: 'column', title: 'Channel mix, FY26: replacement 69%, OEM 23%, exports 8%', unit: '% of sales', x: ['Replacement', 'OEM (incl. defence)', 'Exports'], series: [{ name: 'FY26', values: [AB.channelMixFY26.replacement, AB.channelMixFY26.oem, AB.channelMixFY26.exports], fmt: 'pct' }], labels: 'all', source: 'CARE Ratings (28-Sep-2026); exports from AR FY26' },
      { type: 'column', title: 'Product mix, FY25: truck and bus tyres are half of revenue', unit: '% of revenue', x: ['Truck & bus', '2W & 3W', 'Passenger car', 'SCV / LCV', 'Others'], series: [{ name: 'FY25', values: [49, 19, 13, 10, 9], fmt: 'pct0' }], labels: 'all', source: 'CARE Ratings (29-Sep-2025)' },
    ] },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Capacity', `${AB.capacityMnTyres.FY26} mn tyres and ${AB.tubeCapacityMn} mn tubes (Mar-26), up from ${AB.capacityMnTyres.FY25} mn tyres a year earlier; ${AB.plants}`],
      ['Distribution', `${AB.dealers}; replacement is 69% of sales`],
      ['OEMs', 'Fitment supplier to most large Indian OEMs and on most top-selling cars, incl. new EVs; first Indian maker to supply 20-inch OE tyres (AR FY26)'],
      ['Exports', `Standalone exports ₹${n0(SA.at(-1).exportsStandalone)} cr in FY26 (₹${n0(A25.exportsStandalone)} cr in FY25): ${AB.exportMarkets}`],
      ['Subsidiaries', C.basis],
      ['People and R&D', `${n0(AB.employees)} employees (Mar-26). ${AB.technology}`],
    ], source: 'AR FY26; CARE Ratings (28-Sep-2026, 29-Sep-2025)' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Eighty years, one family, no splits: what shaped the numbers',
  blocks: [
    { p: 'MRF began in 1946 as a toy-balloon maker in Madras and is still run by the founder\'s family: K.M. Mammen (Chairman & MD) and Arun Mammen (Vice Chairman & MD), with the next generation on the board. It has never split its shares or issued bonus shares in the period we examined, so 42.4 lakh shares trade at ₹1.25 lakh each, which keeps retail ownership and liquidity low. Three things in the history change how to read the numbers: the move from a September to a March year (FY16 was 18 months long, so our model starts at FY17), the GST changeover in Jul-2017 (FY17-18 revenue includes excise duty), and a CCI cartel penalty that has been in court since 2018.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Source'], wide: [1], rows: C.history, source: 'Annual reports; CARE Ratings; Screener.in' } },
    { callout: '**So what:** there are no acquisitions, demergers or business sales to adjust for. Exceptional items are small (₹63 cr in FY26 for the labour codes, ₹97 cr of one-off income in FY23 on Screener\'s basis). The only large contingent item is the ₹622 cr CCI penalty (26% of FY26 net profit, ~₹14,700 a share), which MRF has not provided for.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Tyres in FY27: demand holds, costs jump 35-40%, margins fall ~200-250bp before they recover',
  blocks: [
    { p: `${I.size}. ${I.fy26}. For FY27 the picture changed with the Middle East conflict and a poor rubber season. CRISIL (24-Aug-2026) expects volume growth to slow to 4-5%, key input costs to rise 35-40% (natural rubber ~₹275/kg in June against ~₹220/kg in FY26) and the industry's operating margin to fall 200-250bp to ~11.5-12%, recovering to 13-13.5% in FY28 if input costs stabilise.` },
    { exhibit: { type: 'table', title: 'What drives an Indian tyre maker\'s profit', head: ['Driver', 'Where it stood on 30-Sep-2026', 'Effect on MRF'], wide: [1, 2], rows: [
      ['Natural rubber (about half of raw material)', 'Kottayam RSS-4 ~₹273/kg on 3-Sep-2026; ~₹275/kg in June; ~₹220/kg average in FY26; global futures near 2013 highs', 'Two-thirds of MRF\'s raw material is bought in India; with rubber ~half of a raw-material bill of ~63% of revenue, each 10% on rubber is ~3pp of revenue'],
      ['Crude-linked inputs', 'Synthetic rubber, carbon black, nylon cord up with West Asia tensions and shipping bottlenecks', '33.7% of MRF\'s raw material is imported; a weaker rupee adds to the cost'],
      ['Price increases', I.priceHikes, 'Replacement prices move first; OEM contracts follow with a lag'],
      ['Volume', 'CRISIL FY27: replacement and OEM +4-5%, exports +3-4% (FY26: +7-8%)', 'MRF\'s OEM and replacement were both strong in Q1 (MOSL)'],
      ['Capacity', 'Top six plan ~₹18,000 cr of capex over FY27-28, nearly double the previous two years', 'More supply in PCR and TBR radials from FY28; pricing discipline is the risk'],
      ['Imports and rules', I.regulation, 'Protects the domestic market; noise norms favour radials, where MRF is strong in TBR'],
    ], source: 'CRISIL Ratings (24-Aug-2026, via Autocar Professional); Procurement Resource (10-Sep-2026); CLSA via Moneycontrol (12-Aug-2026); Autocar Professional (7-Jun-2026); CARE (28-Sep-2026); MRF AR FY26' } },
    { callout: '**Our read:** the industry has done this before. In FY22-23 rubber and crude rose and MRF\'s margin fell to ~10%; in FY24 costs eased and it jumped to 17%. CRISIL calls FY27 "a cost-pass-through lag rather than a structural profitability reset". We agree, but the timing of the recovery depends on rubber, which nobody can forecast well, and on whether new capacity lets one of the big four break ranks on price.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the India mobility boom reach MRF? In volume, yes; in margin, only when rubber allows',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach MRF?', 'Catch'], wide: [1, 3], rows: [
      ['GST 2.0 vehicle boom (Sep-2025)', 'PV industry +9%, M&HCV ~+15%, tractors >1 mn units in FY26 (AR FY26)', 'Yes: OEM share rose to 23.3%; Q1FY27 OEM demand "buoyant" (MOSL)', 'OEM tyres earn less than replacement; the step-up fades from H2FY27'],
      ['A bigger vehicle parc', 'Three years of strong sales feed replacement demand 2-4 years later', `Yes: replacement is 69% of sales; we grow it ${X.AS.build.replacementGrowth.join('% / ')}% (FY27-29E)`, 'Replacement volume grew only ~5% in FY25 (CARE)'],
      ['Radialisation and premium tyres', 'Noise norms (AIS-142 phase 2) push OEM trucks to radials; SUV and superbike tyres grow faster', 'Yes: MRF\'s truck and light-truck radial and farm-radial ranges grew in FY26, and it launched superbike radials (AR FY26)', 'Apollo and CEAT are strong in premium car radials'],
      ['Exports and "China plus one"', 'Indian tyre exports +9% in FY26 (AR)', 'Barely: MRF exports flat at ₹2,324 cr; 7.6% of sales', 'MRF is far behind BKT and Apollo in Europe and the US'],
    ], source: 'MRF AR FY26; CARE Ratings; MOSL (11-Aug-2026); GAM Research' } },
    { callout: '**Verdict:** the demand tailwind is real and MRF, as the largest player with the biggest dealer network, takes its share of it (31.9% of units, up from ~30%). But the tailwind arrives as revenue. Whether it becomes profit depends on the rubber-to-price spread, and in FY27 that spread is moving against the whole industry.' },
  ],
};

module.exports = { business, history, industry, tailwind };
