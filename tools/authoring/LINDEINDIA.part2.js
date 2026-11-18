// Linde India report, part B (2 of 6): business, history & corporate actions, industry, tailwind test.
const X = require('./LINDEINDIA.ctx');
const { C, D, A, F, n0, n1, pc, A26, FY, PJ, PED, RP, SRC, b } = X;
const rup = s => String(s).replace(/Rs /g, '₹');

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'What Linde India does: gases from plants inside customers\' fences, liquid by tanker, and a plant-building arm',
  blocks: [
    { p: `Linde India separates air into oxygen, nitrogen and argon, and sells them three ways. **On-site:** it builds and runs an air separation unit (ASU) inside a large customer\'s works, often a steel plant (Tata Steel at Jamshedpur and Kalinganagar, SAIL Rourkela, Jindal Stainless at Jajpur) or a refinery (IOCL Panipat), and is paid a fixed monthly facility fee plus a variable charge, with power passed through, for 15-20 years. **Merchant (bulk):** surplus liquid from those plants and from stand-alone merchant ASUs (Selaqui, Ludhiana, Dahej, Taloja) goes by cryogenic tanker to hospitals, glass, electronics, food and metal fabricators; deliveries rose 12% to 2,360 tonnes a day in FY26. **Packaged:** cylinders of industrial, medical and special gases (argon mixes, nitrous oxide, silane). The **Project Engineering Division (PED)** designs and builds ASUs and nitrogen plants for Linde India itself and for outside customers.` },
    { exhibit: { type: 'table', title: 'Where FY26 revenue came from (₹ crore)', head: ['Line', 'FY26', 'Share', 'What it is'], wide: [3], rows: [
      ['Gases: sale of products', '1,869', '74%', 'On-site variable charges, merchant liquid, cylinders, special gases, medical oxygen'],
      ['Gases: lease rentals', '127', '5%', 'Fixed fees on on-site plants dedicated to one customer (accounted as leases)'],
      ['Gases: services incl. O&M', '125', '5%', 'Operating and maintaining customer-owned plants, pipelines, medical gas systems'],
      ['Gases: other', '7', '0%', ''],
      ['Project Engineering (external)', n0(A26.pedExt), `${Math.round(A26.pedExt / A26.consRev * 100)}%`, 'ASUs, nitrogen plants, pipelines for third parties; percentage-of-completion revenue'],
      { hl: true, cells: ['**Revenue from operations**', `**${n0(A26.consRev)}**`, '100%', `Plus ₹${n0(A26.pedInter)} cr of plants PED built for Gases, eliminated at cost`] },
    ], source: 'Annual report FY26, consolidated note 42(d)' } },
    { exhibit: { type: 'table', title: 'Reach and assets (Aug-2026)', head: ['', 'Detail'], wide: [1], rows: [
      ['Capacity', '~20,000 tonnes a day installed; 100+ ASUs and nitrogen plants built in 50 years; "highest number of ASUs on BOO basis in India"'],
      ['Sites', `${C.profile.asuSites}; 10 cylinder-filling sites; debulking station at Lucknow`],
      ['Customers', `Top two customers ₹${n0(C.profile.topTwoCustomers.fy26)} cr in FY26 (23% of revenue; ₹${n0(C.profile.topTwoCustomers.fy24)} cr in FY24), not named; steel, refining, chemicals, glass, electronics/solar, food, healthcare`],
      ['People', C.profile.people],
      ['Power', '1,092,000 MWh a year, 22% renewable; renewable power bought from three captive SPVs (26-27% stakes)'],
      ['Engineering', rup(PED.workshop)],
    ], source: 'AGM presentation (13-Aug-2026); annual report FY26' } },
    { callout: '**Why it matters:** on-site contracts are the core of the value: long, take-or-pay and inflation-linked, with the customer bearing power cost. Merchant and packaged gases earn higher margins but depend on regional supply and demand. PED is a different, lumpy business: it helps Linde India build its own plants cheaply and wins outside work, but its revenue swung from ₹921 cr (FY23, 15 months) to ₹402 cr (FY26).' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From BOC India to Linde plc\'s minority-owned arm: debt, divestments, a failed delisting and a parallel sister company',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event'], wide: [1], rows: C.history.map(h => [h.when, rup(h.event)]), source: 'Annual reports, results filings, Business Standard (Sep-2018, Jan-2019), ThePrint (May-2025)' } },
    { callout: `**Corporate actions:** 8.53 cr shares since at least CY16: no bonus, split or buyback. The 2019 South Region sale (forced by the competition regulator as a condition of the Linde-Praxair merger) cut revenue (₹2,192 cr in CY18, ₹1,762 cr in CY19, ₹1,471 cr in Covid-hit CY20) but cleared ~₹1,100 cr of debt and ended years of near-zero returns. The real corporate-action story is what did not happen: the parent tried to delist in 2019 and baulked at the price; since 2020 new merchant business in South and Central India, and all hydrogen and CO2 business, has been reserved for Praxair India, which it owns 100%, rather than Linde India, which it owns 75%.` },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: regional, capital-heavy and power-hungry; steel and electronics drive demand',
  blocks: [
    { p: `Industrial gases are a local business: liquid oxygen or nitrogen cannot travel economically much beyond 200-300 km by road, so returns depend on having plants and customers close together. Power is the main cost (Linde India's power and fuel bill was ₹${n0(415)} cr in FY26, 16% of revenue). Big users, above all steel makers, either run their own captive ASUs or contract a gas company to build one on-site; Indian steel makers are now selling or outsourcing their captive plants ("de-captivation"), as Tata Steel did at Kalinganagar. The main competitors are INOX Air Products and Praxair India (both unlisted), Air Liquide India, Air Water India and smaller regional players such as Ellenbarrie Industrial Gases (listed Jul-2025, FY26 revenue ₹342 cr). We found no audited market-share data; a widely quoted trade estimate could not be verified.` },
    { exhibit: { type: 'table', title: 'Forces acting on the industry (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Linde India'], wide: [2], rows: [
      ['Steel capacity expansion (company view: steel gas demand +6-8% a year to 2030)', 'Tailwind', 'Four large ASUs under construction for Tata Steel, SAIL and Electrosteel; JSL Jajpur 1,450 tpd started in FY26.'],
      ['De-captivation by steel makers', 'Tailwind', 'Buying and running customers\' own ASUs (Tata Kalinganagar 2 x 1,800 TPD) adds contracted revenue, but needs large capital up front.'],
      ['Electronics, solar and semiconductors (company view: +18-20% a year)', 'Tailwind', 'Liquid nitrogen growth outpaced oxygen for two years; N2O purification at Hyderabad; PED building for Tata\'s Dholera fab and Assam OSAT.'],
      ['Healthcare (company view: +7-8%)', 'Tailwind', 'Liquid medical oxygen, Entonox, medical gas pipelines (largest MGPS order in India in FY26).'],
      ['Power tariffs', 'Headwind', 'Q1FY27 margin fell partly on higher power tariffs; merchant liquid cannot always pass them on.'],
      ['New merchant capacity from competitors', 'Risk', 'Merchant liquid prices are cyclical; more capacity in North and West India would pressure margins.'],
      ['Group allocation with Praxair India', 'Structural limit', 'New merchant business in South and Central India and Maharashtra bulk, and all HyCO/CO2, go to the sister company.'],
    ], source: 'AGM presentation (Aug-2026), annual report FY26, Q1FY27 press coverage, company notes on the JV agreement' } },
    { exhibit: { type: 'table', title: 'The global gas majors (context; numbers as published by 30-Sep-2026)', head: ['Company', 'What we know'], wide: [1], rows: D.industry.globalMajors.map(g => [g.name, g.detail]), source: 'Linde plc Q2 2026 release (31-Jul-2026); Air Liquide H1 2026 release (28-Jul-2026); Linde India AGM deck' } },
    { callout: '**So what:** the industry is attractive (contracted, oligopolistic, growing with Indian manufacturing) and that is why the global majors earn 21-30% operating margins, and why Linde plc trades at ~25x earnings. Linde India earns similar margins at a fraction of the scale, but trades at about four times Linde plc\'s multiple.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: steel and electronics demand reaches Linde India; the southern half of the merchant market does not',
  blocks: [
    { verdicts: [
      ['Steel capacity additions', 'Yes', 'Tata Kalinganagar 2 x 1,800 TPD, SAIL Rourkela 1,000 TPD, Electrosteel 900 TPD, JSL 1,450 TPD: all in the East, Linde India\'s home market.', 'The main source of contracted growth to FY29.'],
      ['Electronics, solar, semiconductors', 'Yes', 'LIN growth ahead of LOX for two years; Tata Dholera fab and OSAT orders in PED; N2O and silane logistics.', 'Small today, fast-growing, higher margin.'],
      ['Healthcare oxygen', 'Partly', 'Liquid medical oxygen volumes up in FY26; no revenue split disclosed.', 'Steady, not transformational.'],
      ['Refining and chemicals', 'Partly', 'IOCL Panipat N2 plant; PED nitrogen plants for IOCL, BPCL, Petronet LNG, Reliance ASU.', 'Mostly as an engineering contractor, not a gas supplier.'],
      ['Hydrogen and CO2 (energy transition)', 'No', 'Allocated exclusively to Praxair India under the 2020 JV agreement.', 'Linde India cannot pursue the HyCO opportunity.'],
      ['Merchant growth in South and Central India', 'No', 'New merchant business there goes to Praxair India by geography.', 'Caps the merchant addressable market.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { business, history, industry, tailwind };
