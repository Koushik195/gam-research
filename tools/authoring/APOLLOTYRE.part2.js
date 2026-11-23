// Apollo Tyres report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./APOLLOTYRE.ctx');
const { C, D, SA, F, n0, n1, rup, sa, segMargin } = X;
const I = D.industry, MX = C.mix.q1fy27Consolidated, MS = C.mix.q1fy27Standalone;
const s26 = sa('FY26');

const business = {
  id: 'business', nav: 'What Apollo does', kicker: 'The business', title: 'An Indian truck- and car-tyre leader with a premium European brand on the side',
  blocks: [
    { p: `Apollo Tyres sells tyres for trucks and buses, passenger cars and SUVs, light trucks, tractors and farm machines, two-wheelers and off-highway vehicles. In Q1FY27 consolidated revenue was ${MX.indiaPct}% India, ${MX.europePct}% Europe and ${MX.othersPct}% other markets; truck and bus tyres ${MX.truckBusPct}%, passenger vehicles ${MX.passengerPct}%, farm and off-highway ${MX.farmOhtPct}%, light trucks ${MX.lightTruckPct}%; ${MX.replacementPct}% went to the replacement market and ${MX.oemPct}% to vehicle makers. In India (standalone) the mix is heavier in trucks: truck and bus ${MS.truckBusPct}%, passenger vehicles ${MS.passengerPct}%; replacement ${MS.replacementPct}%, OEM ${MS.oemPct}%, exports ${MS.exportPct}%. Management estimates its replacement share at 30%+ in truck radials (TBR) and 21%+ in car radials (PCR).` },
    { p: `It makes tyres in five Indian plants (Perambra and Kalamassery in Kerala, Limda in Gujarat, Chennai, and Chinnapandur in Andhra Pradesh) and at Gyöngyöshalász in Hungary; the Enschede plant in the Netherlands, home of the Vredestein brand, stopped production in Jun-2026 and remains an R&D site. India runs at ~${C.mix.capacityUtilisation.india}% utilisation and Europe at ~${C.mix.capacityUtilisation.europe}% (Q1FY27). Apollo reports three segments: **APMEA** (India plus small units in the UAE, Thailand, Malaysia and South Africa), **Europe** (Apollo Vredestein and the ReifenCom distribution business in Germany) and **Others** (Americas sales and corporate entities).` },
    { exhibit: { type: 'table', title: 'Segments: FY26 and our FY27E-29E (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['APMEA revenue', n0(s26.apmeaRev), '{{F.seg.apmea.revenue.0|num}}', '{{F.seg.apmea.revenue.1|num}}', '{{F.seg.apmea.revenue.2|num}}', `+${X.AS.segments[0].growth.join('% / +')}%`],
      ['  EBITDA margin', n1(segMargin('apmea', 'FY26')) + '%', ...X.AS.segments[0].marginPct.map(m => m + '%'), 'Segment EBITDA incl. allocated other income'],
      ['Europe revenue', n0(s26.eurRev), '{{F.seg.eur.revenue.0|num}}', '{{F.seg.eur.revenue.1|num}}', '{{F.seg.eur.revenue.2|num}}', `+${X.AS.segments[1].growth.join('% / +')}% (incl. ~4-6% from the euro)`],
      ['  EBITDA margin', n1(segMargin('eur', 'FY26')) + '%', ...X.AS.segments[1].marginPct.map(m => m + '%'), 'Enschede costs gone from H2FY27'],
      ['Others revenue', n0(s26.othRev), '{{F.seg.oth.revenue.0|num}}', '{{F.seg.oth.revenue.1|num}}', '{{F.seg.oth.revenue.2|num}}', 'Americas, corporate'],
      { hl: true, cells: ['**Revenue (sum = model)**', `**${n0(s26.consRev)}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**', ''] },
      ['Less: other income inside segment results', n0(s26.segEbitda - 4143.2), '{{as.unallocated.0}}', '{{as.unallocated.1}}', '{{as.unallocated.2}}', 'Moved below EBITDA'],
      { hl: true, cells: ['**EBITDA margin (company basis)**', '14.6%', '**{{F.ebitdaMargin.0|pct}}**', '**{{F.ebitdaMargin.1|pct}}**', '**{{F.ebitdaMargin.2|pct}}**', ''] },
    ], source: 'AR FY26 segment note (external revenue; segment result + depreciation); GAM estimates (assumptions.json "segments")' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a Kerala truck-tyre maker to a two-continent group; the last decade was about digesting Europe and big plants',
  blocks: [
    { p: 'Apollo Tyres was incorporated in Kerala in 1972 (CIN) and is run by the Kanwar family (Chairman Onkar Kanwar, Vice Chairman & MD Neeraj Kanwar). It became a two-continent group through Europe (the Vredestein brand and the Enschede plant in the Netherlands, then a greenfield plant in Hungary). The FY17-21 build-out of Hungary and Andhra Pradesh, funded partly with equity (FY18, FY21), drove borrowings to ₹7,334 cr and ROE to 3-9%. FY22-26 were years of small capex and deleveraging. Since FY25 the agenda has been fixing Europe\'s cost base (closing Enschede) and, from FY27, adding capacity in India again. Share count: 63.51 cr shares of ₹1 since FY21 (no change in FY25 or FY26).' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Impact on the numbers'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.what), rup(h.impact)]), source: 'Annual reports FY21-26; earnings calls Feb-2026 to Aug-2026; Screener.in' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Indian tyres: steady volume, a raw-material squeeze in FY27, a capex wave; Europe flat',
  blocks: [
    { p: `${rup(I.size)}. Demand follows the vehicle parc and freight (replacement), new vehicle sales (OEM) and exports. After 7-8% volume growth in FY26, helped by the GST cut on tyres, CRISIL (24-Aug-2026) expects 4-5% in FY27, with key inputs up 35-40% and operating margins down 200-250 bp to ~11.5-12%, recovering to 13-13.5% in FY28 if costs stabilise: "a cost-pass-through lag rather than a structural profitability reset". The top six makers plan ~₹18,000 cr of capex in FY27-28, nearly double the previous two years; Apollo's ₹5,800 cr AP plan is part of that wave.` },
    { bullets: [
      `**Raw materials.** ${rup(I.rubber)}. Natural rubber, synthetic rubber, carbon black and steel cord make up most of the cost; ~50% of Apollo's raw materials are imported, so a weaker rupee adds to the bill (7-8% in Q1FY27, CFO).`,
      `**Pricing.** ${rup(I.priceHikes)}. Replacement prices move first; OEM contracts follow with a quarter's lag through formulas or negotiation.`,
      `**Europe.** ${rup(I.europe)}.`,
      `**Regulation and imports.** ${rup(I.regulation)}.`,
      '**Competition.** MRF, Apollo, CEAT and JK Tyre lead in India (MRF and Apollo are the two largest in truck tyres, CFO); BKT is entering truck and car radials. In Europe Apollo competes with Michelin, Continental, Goodyear, Bridgestone, Pirelli and Asian imports, and is a price follower.',
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the tailwind reach Apollo? Indian demand yes; falling rubber would; Europe not yet',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach Apollo?', 'Catch'], wide: [1, 3], rows: [
      ['Indian replacement demand (GST cut, freight, parc)', 'Standalone revenue +13-16% y/y in Q3FY26-Q1FY27; volume +~12% in Q1; July strong', 'Yes: Apollo grew ahead of the market and regained TBR share (30%+)', 'Capacity is full until the AP expansion (end-FY27); the base gets tougher in H2FY27'],
      ['Raw materials cooling from Q3FY27', 'Rubber is seasonal; management expects easing after the monsoon; the industry "records its best margins in a falling raw-material cycle"', 'Yes, with a lag: price increases of ~11% are in place', 'If rubber does not fall, 4-5% more price is needed; prices may be cut in Q4 if costs fall sharply (CFO)'],
      ['Europe restructuring', 'Enschede closed on schedule (Jun-2026); ~11% Q1 margin without overlap costs', 'Partly from H2FY27', 'Europe market flat; agri volumes lost in the transition; Europe price increases lag (3-4% of ~10% needed)'],
      ['EU anti-dumping duties on Chinese tyres; India-EU trade deal', 'Duties announced in 2026 (Q1FY27 call)', 'A little: helps the Apollo brand at the lower end and exports from India', 'Vredestein does not compete with Chinese tyres; the FTA is "not material" (CFO)'],
    ], source: 'Company calls (Feb, May and Aug-2026); CRISIL (24-Aug-2026); GAM Research' } },
    { callout: '**Verdict:** the Indian tailwind reaches Apollo in full: it has the brands, dealers and truck-radial share to grow with the market, and it is adding capacity at the right time. What it cannot escape is the raw-material cycle; FY27 margins depend on how fast rubber falls. Europe is a self-help story, not a market tailwind.' },
  ],
};

module.exports = { business, history, industry, tailwind };
