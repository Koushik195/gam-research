// JBM Auto report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./JBMA.ctx');
const { C, D, n0, n1, yr } = X;
const I = D.industry, rup = s => String(s).replace(/Rs ?/g, '₹');
const y26 = yr('FY26'), share = k => Math.round(y26[k] / y26.consRev * 100);
const mg = (e, r) => `${n1(e / r * 100)}%`;

const business = {
  id: 'business', nav: 'What JBM Auto does', kicker: 'The business', title: 'Three businesses under one roof: sheet-metal parts, tools and dies, and electric buses',
  blocks: [
    { p: rup(`JBM Auto is the listed flagship of the JBM group, controlled by the Arya family. It reports three segments. The **Component division** (${share('coRev')}% of FY26 revenue) presses and welds sheet-metal parts and assemblies (chassis and suspension systems, fuel and air tanks, exhaust systems, skin panels) for Indian car, utility-vehicle and truck makers; its customers include Tata Motors, Mahindra & Mahindra and VE Commercial Vehicles. The **Tool Room** (${share('trRev')}%) designs and builds press tools, dies and moulds for JBM and outside customers. The **OEM division**, renamed **EV Business** in Q1FY27 (${share('evRev')}%), designs and builds electric buses (city, intercity, coaches, sleepers, airport and medical buses) and sells spares and maintenance contracts. The buses are made by JBM Electric Vehicles Pvt Ltd, 85% owned. Many of them are sold to JBM Ecolife Mobility, an 83%-owned joint venture that runs buses for cities under gross-cost contracts and is accounted for by the equity method, so its revenue and debt are not in JBM Auto's consolidated accounts.`) },
    { exhibit: { type: 'table', title: 'The three segments (FY26)', head: ['Segment', 'What it does', 'Revenue (₹ cr)', 'EBIT (₹ cr)', 'EBIT margin', 'Segment assets (₹ cr)'], wide: [1], rows: [
      ['**Components**', 'Sheet-metal assemblies, chassis, suspension, tanks, exhausts, skin panels', n0(y26.coRev), n0(y26.coEbit), mg(y26.coEbit, y26.coRev), n0(y26.coAssets)],
      ['**Tool room**', 'Press tools, dies and moulds', n0(y26.trRev), n0(y26.trEbit), mg(y26.trEbit, y26.trRev), n0(y26.trAssets)],
      ['**EV business (OEM)**', 'Electric buses, spares, maintenance contracts', n0(y26.evRev), n0(y26.evEbit), mg(y26.evEbit, y26.evRev), n0(y26.evAssets)],
      ['Unallocable income', 'Interest and other income not given to a segment', '–', n0(y26.othersEbit), '–', '49'],
    ], source: 'AR FY26 MD&A segment table and consolidated note 41 (segment result before interest and tax)' } },
    { exhibit: { type: 'table', title: 'Reach and structure', head: ['', 'Detail'], wide: [1], rows: [
      ['Plants', rup(C.business.plants)],
      ['Customers', rup(C.business.customers)],
      ['E-bus volumes and share', rup(C.business.ebusUnits)],
      ['Order book', rup(C.business.orderBook)],
      ['E-bus maker', rup(C.structure.jbmev)],
      ['Bus operator (JV)', rup(C.structure.ecolife)],
    ], source: 'AR FY25, AR FY26; Crisil rationale (5-Aug-2026); press releases (Jun-Jul 2026); IFC (Sep-2025)' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a sheet-metal supplier to India\'s largest e-bus factory, funded partly by outside investors in the operating JV',
  blocks: [
    { p: 'For most of its life JBM Auto was a sheet-metal and tooling supplier to Indian vehicle makers; it still holds 51% of two JVs with Japan\'s Ogihara (automotive parts and dies), accounted for by the equity method. In 2016 it formed a JV with Solaris of Poland to make electric buses; it entered e-bus manufacturing itself in 2019 (Crisil) and won city orders under FAME II and the schemes that followed. From FY24 the bus business took off (OEM revenue ₹550 cr in FY23, ₹1,741 cr in FY24), almost entirely through government tenders on gross-cost contracts, where JBM\'s own JV, JBM Ecolife, is often the operator. To fund the operator, the group brought in development banks and funds at the JV level: ADB and AIIB, IFC (US$100 mn, Sep-2025) and Motilal Oswal Alternates (₹750 cr, Jun-2026).' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Impact on the numbers'], wide: [1, 2], rows: [
      ...C.corporateActions.map(c => [X.shortDate(c.date), rup(c.what), {
        '2016-07-20': 'Small; the FY21 annual report lists loans to JBM Solaris Electric Vehicles.',
        '2019': 'OEM revenue ₹239 cr (FY20), ₹459 cr (FY21), ₹704 cr (FY22).',
        '2024-12-26': 'Per-share figures halved; no effect on value. EPS shown on 23.65 cr shares.',
        '2025-02-19': 'Revenue for JBM\'s bus plant over 18 months; the buses sit on Ecolife\'s balance sheet.',
        '2025-09-11': 'Funds Ecolife, not JBM Auto; reduces the group funding JBM must provide.',
        '2026-06-18': 'JBM Auto\'s debt cut by ~₹410 cr (our pro forma Mar-26 balance sheet includes it).',
        '2026-08-21': 'Stock +10% intraday; nothing signed by 30-Sep-2026.',
      }[c.date] || '–']),
    ], source: 'Annual reports FY21-FY26; exchange filings and press as cited in company.json; Screener.in' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'E-buses: a government-made market with ~46,000 buses awarded; components follow vehicle output',
  blocks: [
    { p: rup(I.ebus) },
    { bullets: [
      `**How the market works (GCC).** ${rup(I.gcc)}`,
      `**Competition.** ${rup(I.competition)}`,
      `**Components.** ${rup(I.components)}`,
    ] },
    { callout: '**Why it matters:** in a GCC market the bus maker who can also fund and run the buses wins more tenders. That is JBM\'s model, and it is why its share is high. It also means the industry\'s capital needs (the buses, the depots, the chargers) land on operators like JBM Ecolife, and through loans and guarantees partly on JBM Auto.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the bus-electrification tailwind reach JBM Auto\'s shareholders? In revenue yes; in cash not yet',
  blocks: [
    { exhibit: { type: 'table', title: 'Three tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach JBM Auto?', 'Catch'], wide: [1, 3], rows: [
      ['Bus electrification (PM e-Bus Sewa, PM E-DRIVE, states)', '~46,000 e-buses awarded for deployment over 2-3 years; industry sales ~4,900 in FY26', 'Yes: EV revenue ₹2,307 cr (+16%), ~24% share; Crisil sees bus revenue above 40% of the group', 'Sold largely to its own JV; revenue booked as buses are built; receivables and unbilled revenue ₹3,696 cr'],
      ['Private and intercity e-buses', 'DRIVN 500-bus agreement; Galaxy coach launched (Q1FY27)', 'Starting: non-GCC buses 12% of FY26 bus sales, >25% expected (Crisil)', 'Small so far; competitive'],
      ['Indian car and UV output', 'Component revenue +15.5% in Q1FY27 after +8% in FY26', 'Yes, directly', 'Low margin (8% EBIT); cyclical; customer concentration'],
    ], source: 'AR FY26 MD&A; Crisil (5-Aug-2026); Q1FY27 press release; GAM Research' } },
    { callout: '**Verdict:** the tailwind is real and JBM is one of its two biggest winners. But for JBM Auto\'s shareholders the benefit so far has come as revenue and receivables more than as cash: cash from operations was ₹538 cr over FY24-26, against ₹717 cr of interest paid. The bus business will create value for JBM Auto only if the operating JV funds itself and pays on time.' },
  ],
};

module.exports = { business, history, industry, tailwind };
