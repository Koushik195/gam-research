// CEAT report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./CEATLTD.ctx');
const { C, D, AS, n0, n1, sa } = X;
const I = D.industry, MX = C.mix.fy26Standalone, M25 = C.mix.fy25Standalone;
const s26 = sa('FY26');

const business = {
  id: 'business', nav: 'What CEAT does', kicker: 'The business', title: 'A brand-led Indian tyre maker, strongest in two-wheelers, with a new global off-highway niche',
  blocks: [
    { p: `CEAT sells tyres for trucks and buses (${MX.truckBus}% of FY26 standalone revenue), two- and three-wheelers (${MX.twoThreeWheeler}%), passenger cars and UVs (${MX.pvUv}%), off-highway vehicles such as tractors and construction machines (${MX.offHighway}%) and light commercial vehicles (${MX.lcvOthers}%). By channel, ${MX.replacement}% went to the replacement market through dealers, ${MX.oem}% to vehicle makers (OEMs) and ${MX.exports}% abroad (FY25: ${M25.replacement}% / ${M25.oem}% / ${M25.exports}%). MOSL puts CEAT at ~31% of two-wheeler replacement (the leader), ~17% of cars (third) and ~10% of truck radials. It made 4.5 crore tyres in FY26 in six Indian plants (Bhandup, Nashik, Halol, Nagpur, Chennai, Ambernath) at more than 80% utilisation, 85-90% by Q4FY26.` },
    { p: `Since 1-Sep-2025 CEAT also owns the Camso brand's construction-equipment bias tyres and rubber tracks business, bought from Michelin with a plant in Sri Lanka (~220 tonnes a day). It added ₹421 cr of revenue in seven months of FY26 and takes international revenue to ~23% of the group (20% standalone). The Sri Lankan joint venture CEAT Kelani (tyres for Sri Lanka) is equity-accounted (₹16 cr of profit share in FY26).` },
    { exhibit: { type: 'table', title: 'Our two-part build: FY26 and FY27E-29E (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['CEAT standalone revenue', n0(s26.indiaRev), '{{F.seg.india.revenue.0|num}}', '{{F.seg.india.revenue.1|num}}', '{{F.seg.india.revenue.2|num}}', `+${AS.segments[0].growth.map(n1).join('% / +')}% (replacement, OEM and export build)`],
      ['  EBITDA margin', n1(s26.indiaEbitda / s26.indiaRev * 100) + '%', ...AS.segments[0].marginPct.map(m => m + '%'), 'Gross margin back towards 40%, not to FY26'],
      ['Camso and other subsidiaries revenue', n0(s26.subsRev), '{{F.seg.subs.revenue.0|num}}', '{{F.seg.subs.revenue.1|num}}', '{{F.seg.subs.revenue.2|num}}', 'Direct billing from H2FY27; FY28 first full year'],
      ['  EBITDA margin', n1(s26.subsEbitda / s26.subsRev * 100) + '%', ...AS.segments[1].marginPct.map(m => m + '%'), 'Start-up costs, then the value chain in house'],
      { hl: true, cells: ['**Revenue (sum = model)**', `**${n0(s26.consRev)}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**', ''] },
      { hl: true, cells: ['**EBITDA margin (excl. JV share)**', `**${n1(s26.consEbitdaExJv / s26.consRev * 100)}%**`, '**{{F.ebitdaMargin.0|pct}}**', '**{{F.ebitdaMargin.1|pct}}**', '**{{F.ebitdaMargin.2|pct}}**', 'JV share sits in other income'] },
    ], source: 'Q4FY26 call (standalone FY26); Emkay quarterly tables; AR FY26; GAM estimates (assumptions.json "segments" and "build")' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a Mumbai tyre plant to six Indian factories and a Sri Lankan off-highway business',
  blocks: [
    { p: 'CEAT Tyres of India was set up in 1958 (with the Tatas) and has been part of the RPG group since 1982; the Goenka family controls it through holding companies (47.3%). The last decade was about building capacity in the consumer-facing categories (two-wheeler radials at Nagpur, car radials at Chennai, off-highway tyres at Ambernath) and, in FY26, buying a global off-highway brand. Profit has followed the raw-material cycle more than any corporate action.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What happened'], wide: [1], rows: C.history, source: 'Annual reports; earnings calls Apr-2025 to Jul-2026; Screener.in' } },
    { exhibit: { type: 'table', title: 'The Camso deal in numbers (AR FY26 note 52)', head: ['Item', '₹ crore', 'Comment'], wide: [2], rows: [
      ['Consideration paid at closing (1-Sep-2025)', n0(C.camso.consideration), 'Plant, know-how, inventories, licences; funded with debt'],
      ['  of which plant and equipment', n0(C.camso.ppa.ppe), 'Sri Lanka, ~220 t/day'],
      ['  technical know-how and licences (Camso, Hauler brands)', n0(C.camso.ppa.technicalKnowhow + C.camso.ppa.camsoBrandLicence + C.camso.ppa.haulerBrand), 'Amortised: part of the higher depreciation'],
      ['  customer relationships / inventories / goodwill', `${n0(C.camso.ppa.customerRelationships)} / ${n0(C.camso.ppa.inventories)} / ${n0(C.camso.ppa.goodwill)}`, 'Almost no goodwill'],
      ['Camso brand, due three years after closing', '~420', 'USD44 mn; a commitment, not on the balance sheet; in our FY29E capex'],
      ['Finished goods to buy from Michelin', '~420', 'USD44 mn over 12 months: working capital, not price'],
      ['Revenue in FY26 (seven months)', n0(C.camso.revenue7mFY26), 'Sold mostly to Michelin during the transition'],
      ['Acquisition costs expensed', n0(C.camso.acquisitionCosts), 'In other expenses (MOSL and Emkay add them back)'],
    ], source: 'AR FY26 consolidated note 52 and note 42; Q4FY26 and Q1FY27 calls' } },
    { callout: '**Impact on the numbers:** the acquisition closed inside FY26, so the Mar-26 balance sheet already carries it (no pro-forma adjustment needed); FY26 revenue has seven months of it and FY27 the first full year. What the accounts do not show is the ~₹420 cr brand payment due around Sep-2028, which we put in FY29E capex.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Indian tyres: GST-led demand in FY26, a raw-material squeeze in FY27 and a capex wave',
  blocks: [
    { p: `${I.size}. Demand follows the vehicle parc, freight and farm incomes (replacement), new vehicle sales (OEM) and exports. ${I.fy27}.` },
    { bullets: [
      `**Demand.** ${I.demand}.`,
      `**Raw materials.** ${I.rubber}. Rubber (natural and synthetic) was ₹4,911 cr of CEAT's ₹9,508 cr raw-material bill in FY26; carbon black ₹1,435 cr, fabrics ₹756 cr.`,
      `**Pricing.** ${I.priceHikes}.`,
      `**Off-highway.** ${I.oht}.`,
      `**Regulation and imports.** ${I.regulation}.`,
      '**Competition.** MRF, Apollo, CEAT and JK Tyre lead in India; MRF is the largest and the price leader; BKT dominates farm and off-highway exports; Chinese imports are limited by licensing. CEAT is strongest where the brand matters most to the buyer (two-wheelers, cars) and weakest in truck radials.',
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the tailwind reach CEAT? Demand and premiumisation yes; the raw-material cycle cuts both ways',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach CEAT?', 'Catch'], wide: [1, 3], rows: [
      ['Two-wheeler and car demand after the GST cut', 'Standalone volume +~20% in Q4FY26 and +13-14% in Q1FY27; two-wheeler replacement up mid-20s in Q4', 'Yes, fully: CEAT is the two-wheeler replacement leader and has ~25% of OEM EV fitments', 'Management expects moderation in Q2 on 15%+ price increases and El Nino'],
      ['Premiumisation (17-inch+ car tyres, 250cc+ bikes)', '17-inch+ replacement volume +100% in Q1; 13% of car tyres today, 30-40% in five years (MD)', 'Yes: better mix and margins', 'Premium car tyres are where MRF, Apollo and imports compete hardest'],
      ['Raw materials cooling', 'Rubber is seasonal and tracks crude with a lag; management intends to hold prices until gross margin returns to 40-41%', 'Yes, with a lag', 'If rubber stays at ₹280/kg, another 4-6% of price is needed and demand slows'],
      ['Off-highway and exports', 'International revenue +~30% in Q1 even with the Middle East shut; Camso adds a global brand', 'Partly: Camso only from H2FY27', 'US tariffs (10%, 25% on track steel); Sri Lankan rupee; Michelin transition'],
    ], source: 'Q4FY26 call (29-Apr-2026); Q1FY27 call (17-Jul-2026); CRISIL (24-Aug-2026); GAM Research' } },
    { callout: '**Verdict:** the demand tailwind reaches CEAT more than most peers because its mix is tilted to two-wheelers and cars, where the GST cut and premiumisation help most. What it cannot escape is the raw-material cycle, and Camso adds a second, company-specific source of noise for at least another year.' },
  ],
};

module.exports = { business, history, industry, tailwind };
