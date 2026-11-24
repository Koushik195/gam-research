// Amara Raja report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./ARE&M.ctx');
const { C, D, SA, n0, BL, LINES, LN, Q1 } = X;
const I = D.industry, A26 = SA.find(a => a.fy === 'FY26'), share = (x, t) => Math.round(x / t * 100) + '%';
const WHAT = { automotive: 'Car, two-wheeler, three-wheeler and CV batteries for OEMs (~₹1,800 cr) and the Amaron replacement market; home-energy tubular and inverter batteries and home UPS; automotive exports (Middle East, South-East Asia, Africa)', industrial: 'Telecom tower batteries (lead-acid share shrinking as telecom moves to lithium), UPS and data centres, railways, power control, solar; industrial exports', others: 'Amaron Hi-Life lubricants (₹205.5 cr in FY26, ~₹50 cr a quarter), installation and maintenance services, export incentives, scrap' };

const business = {
  id: 'business', nav: 'What Amara Raja does', kicker: 'The business', title: 'Amaron, PowerZone and telecom back-up: India\'s number-two battery maker, with a lithium arm on the side',
  blocks: [
    { p: `Amara Raja Energy & Mobility (Tirupati, Andhra Pradesh; incorporated 1985; renamed from Amara Raja Batteries in 2023) makes lead-acid batteries in 15 facilities around Tirupati and Chittoor: ~70 mn automotive units and ~2.4 bn Ah of industrial capacity a year, plus a tubular plant. It sells under Amaron (cars, two-wheelers), PowerZone and Quanta (industrial), through 1,500+ direct partners and 1,00,000+ points of sale, and exports to 70+ countries (₹1,653 cr, 12% of FY26 revenue). About three-quarters of revenue is automotive (OEM and replacement) and home energy; a fifth is industrial, where it leads telecom. ₹2,128 cr of FY26 revenue (16%) was traded goods: inverters, home UPS, lubes and batteries bought from others when its own plants were full. The New Energy business (lithium packs, chargers, a cell giga-factory and a BESS plant under construction in Telangana) sits in the 100% subsidiary **ARACT**; lead recycling sits in **ARCSPL** (Cheyyar, Tamil Nadu).` },
    { exhibit: { type: 'table', title: 'The business lines, FY26 (₹ crore, standalone)', head: ['Line', 'Revenue', 'Share', 'What it sells'], wide: [3], rows: [
      ...LINES.map(k => [`**${LN[k]}**`, n0(BL.base[k]), share(BL.base[k], X.base26), WHAT[k]]),
      { hl: true, cells: ['**Total (standalone)**', `**${n0(X.base26)}**`, '100%', 'Reported revenue from operations ₹13,548.9 cr (AR FY26 note 22)'] },
    ], source: A26.linesSrc } },
    { pair: [
      { type: 'column', title: 'Group revenue by segment: lead-acid ₹13,005 cr, New Energy ₹809 cr', unit: 'FY26 consolidated segment revenue (₹ crore)', x: ['Lead-acid & allied', 'New Energy (lithium packs, chargers)'], series: [{ name: 'Revenue', values: [13005, 809], fmt: 'num' }], labels: 'all', source: 'AR FY26 consolidated note 33. New Energy segment result: loss ₹135 cr (FY25: ₹46 cr loss on ₹501 cr).' },
      { type: 'column', title: 'Traded goods: 15% of revenue in FY25, 16% in FY26', unit: 'Sale of traded goods (₹ crore), standalone', x: ['FY25', 'FY26'], series: [{ name: 'Traded goods', values: [1807.5, 2127.5], fmt: 'num' }], labels: 'all', source: 'AR FY26 note 22: batteries and components ₹1,722 cr, home UPS ₹200 cr, lubes ₹205.5 cr in FY26' },
    ] },
    { exhibit: { type: 'table', title: 'The group around the lead-acid business', head: ['Entity', 'Stake', 'What it does', 'How it shows up in our valuation'], wide: [2, 3], rows: [
      ['Amara Raja Energy & Mobility (standalone)', '–', 'Lead-acid batteries, lubes, some lithium trading; FY26 revenue ₹13,549 cr, PAT ₹970 cr (₹776 cr before exceptional items)', 'Core: P/E on Sep-28E standalone EPS'],
      ['Amara Raja Advanced Cell Technologies (ARACT)', '100%', 'Lithium-ion packs (telecom, 2W/3W), cell giga-factory (2 GWh NMC first), 10 GWh BESS plant, R&D; FY26 revenue ₹787 cr, loss ₹73 cr; net worth ₹1,431 cr', 'Book equity less PV of losses to breakeven'],
      ['Amara Raja Circular Solutions (ARCSPL)', '100%', 'Lead recycling at Cheyyar; FY26 revenue ₹1,456 cr, profit ₹21.5 cr; net worth ₹615 cr', 'At book with other subsidiaries'],
      ['Amara Raja Power Systems (ARPSL)', '100%', 'Chargers, power systems (bought Sep-2023 for ₹133 cr); FY26 revenue ₹149 cr, loss ₹20.7 cr; ₹120 cr loans from the parent', 'At book'],
      ['Amara Raja Batteries Middle East (FZE)', '100%', 'Trading in the UAE; FY26 revenue ₹16 cr', 'At book'],
    ], source: 'AR FY26 Form AOC-1 and note 5' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Forty years of batteries: a foreign partner gone, a plastics business folded in, and a lithium bet started',
  blocks: [
    { p: 'Amara Raja is controlled by the Galla family through Amara Raja Enterprises (32.86%). Its former foreign partner Clarios (Johnson Controls\' old battery arm, now owned by Brookfield) still held 24% in 2021; it sold 10% in May-2021 and the remaining 14% in July-2023. Three corporate actions since FY23 change how the numbers read: the New Energy business moved out of the company into ARACT on 1-Jun-2023 (so standalone revenue no longer includes most lithium packs); the plastic-components business of Mangal Industries, a promoter-group supplier, was demerged into the company with effect from 1-Apr-2022 for 1.22 cr new shares (7% more shares, ₹428 cr of goodwill, promoter stake up to 32.86%); and a fire at the Chittoor tubular plant in January-2023 led to insurance income in FY25 and FY26. In April-2021 the Andhra Pradesh Pollution Control Board issued a closure order against the company; it went to the High Court, and the order was revoked in July-2026.' },
    { exhibit: { type: 'table', title: 'Milestones and corporate actions', head: ['When', 'What'], wide: [1], rows: C.history, source: C.historySrc } },
    { exhibit: { type: 'table', title: 'Actions and what they did to the numbers', head: ['When', 'Action', 'Impact'], wide: [1, 2], rows: [
      ['FY23 (restated)', 'Mangal plastics demerger, appointed date 1-Apr-2022; shares allotted Feb-2024', 'Share count 17.08 → 18.30 cr; plastic components now in-house; FY23 restated (EPS ₹42.8 as reported, ₹39.9 restated). Screener keeps FY23 as first reported'],
      ['FY23', 'Chittoor tubular-plant fire (30-Jan-2023)', '₹438.6 cr loss netted against insurance receivable: net exceptional charge ₹47.65 cr; tubular batteries traded while the plant was rebuilt'],
      ['FY24', 'New Energy business sold to ARACT (1-Jun-2023, ₹224 cr)', 'Standalone revenue +8% vs consolidated +13% in FY24; lithium packs now in the subsidiary'],
      ['FY25-26', 'Insurance settlement', 'Exceptional income ₹111 cr (FY25) and ₹303 cr (FY26), less a ₹43.8 cr labour-code charge: FY26 EPS ₹53.0 reported, ₹42.4 before'],
      ['FY23-FY27', 'Equity into ARACT: ₹100 / 300 / 450 / 650 cr, then ₹400 cr by Aug-2026', 'ARACT losses show only in the consolidated accounts (−₹73 cr in FY26)'],
    ], source: 'AR FY23 note 31; AR FY24 notes 22 and 47; AR FY26 notes 5 and 30; Q1FY27 deck' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A two-player lead-acid market enjoying a post-GST vehicle boom while lithium takes telecom and e-rickshaws',
  blocks: [
    { p: `${I.structure} ${I.demand}` },
    { exhibit: { type: 'table', title: 'What drives the battery market', head: ['Driver', 'Evidence (to Aug-2026)', 'What it means for Amara Raja'], wide: [1, 2], rows: [
      ['Vehicle sales and the replacement cycle', 'OEM volumes +24% (4W) and +35% (2W) in Q1FY27 after the September-2025 GST cut; aftermarket ~+15%', 'OEM batteries now, replacement batteries in 3-4 years; Amara Raja is adding throughput in existing plants'],
      ['Home energy', 'Tubular and home-UPS revenue +60% in Q1FY27 (hot summer); tubular plant at 100%, the rest traded', 'Seasonal but growing; trading dilutes margin until own capacity catches up'],
      ['Industrial back-up', 'UPS volume +10% (data centres); railways and power control +5-6%; telecom lead-acid falling', 'Industrial lead-acid grows slowly (+2% in Q1FY27); telecom moves to Amara Raja\'s own lithium packs'],
      ['Exports', 'Automotive exports −20% in Q1FY27 on Middle East shipping costs; US tariffs; exports 12% of FY26 revenue', 'A drag in FY27; recovery expected by management'],
      ['Lithium substitution', I.threat, 'Erodes lead-acid at the edges; the reason for ARACT'],
      ['Input costs', I.costs, 'Margins depend on how fast price increases follow costs'],
    ], source: I.src } },
    { callout: `**Lithium market:** ${I.lithium}` },
    { callout: '**Our read:** lead-acid is in a good phase (an OEM boom that feeds a replacement wave, strong home energy, data-centre UPS), but it is a mature, cost-pass-through market with one strong rival. Lithium is not a near-term threat to car starter batteries, but it has already taken much of telecom, where Amara Raja was strongest, and it will take EV traction batteries.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach the company?', title: 'Tailwind test: yes for volumes, no for margins so far',
  blocks: [
    { exhibit: { type: 'table', title: 'Amara Raja\'s growth vs the market signals', head: ['Period', 'Market signal', 'Amara Raja (standalone)', 'Verdict'], rows: [
      ['FY21-26', 'Vehicle, home-energy and industrial demand', `Revenue +${X.salesCagrHist.toFixed(1)}% a year; EBITDA margin from 15.6% to 11.4%; EPS before one-offs +${X.epsCagrHist.toFixed(1)}% a year`, 'Volume yes, margin and EPS no'],
      ['FY26', 'GST cut boosts OEMs from Oct-2025; exports hit by tariffs and the Middle East', 'Revenue +9.2%; EBITDA −5%; margin 11.4%', 'Revenue yes, profit no'],
      ['Q1FY27', 'OEM boom; hot summer', `Revenue +${Q1.revenueGrowth}%; EBITDA +${Q1.ebitdaGrowth}%; margin ${Q1.ebitdaMargin}%`, 'Reaches revenue, not margin'],
      ['Q1FY27 volumes', '4W / 2W OEM, aftermarket, home energy', '+24% / +35%, ~+15%, +60% (company)', 'Amara Raja keeps or gains share'],
    ], source: 'Q4FY26 and Q1FY27 calls; Screener.in' } },
    { bullets: [
      '**The tailwind reaches Amara Raja\'s volumes.** OEM volumes grew faster than the industry in Q1FY27, home energy took share in a strong summer, and the bigger car and two-wheeler parc will feed replacement demand later.',
      '**It has not reached margins.** Alloys, sulphuric acid and plastics rose faster than prices; B2B (OEM) prices follow with a lag; more of the growth came from traded tubular batteries and OEM supplies, both lower-margin; and management chose to spend on brand (IPL), the Amaron Assist pilot and debottlenecking. Margin fell from 11.5% to 10.1% YoY in Q1FY27 while revenue grew 21%.',
      '**The lithium transition cuts against it at the edges.** Telecom lead-acid, e-rickshaws and future EV traction are where lead-acid loses; Amara Raja is replacing telecom lead-acid with its own lithium packs (combined telecom share >60%), but those packs sit in ARACT and earn little.',
    ] },
  ],
};

module.exports = { business, history, industry, tailwind };
