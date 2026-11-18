// Atul report, part B (2/3): business, history, industry, tailwind test, the two segments.
const { ctx } = require('./ATUL.part2');
const { C, D, F, n0, SRC, SA, SQ, QL, FYS, A26, A25, A24, SA2, Q1 } = ctx;
const SUB = C.subSegmentsFY26.rows;

// ---------------------------------------------------------------- Business
const business = {
  id: 'business', nav: 'What Atul does', kicker: 'The business', title: 'One giant integrated site, two very different businesses',
  blocks: [
    { p: 'Atul was set up in 1947 by Kasturbhai Lalbhai and started manufacturing at Atul, near Valsad in south Gujarat, in 1952. Today the 1,300-acre site, with its own 73 MW power plant, effluent treatment and basic chemicals (chlorine, caustic soda, sulphuric acid), feeds more than 900 products sold to ~4,000 customers in 88 countries; 40% of FY26 revenue came from outside India. The products fall into two reported segments. **Life Science Chemicals** (LSC) sells crop-protection actives (2,4-D, indoxacarb, sulfonylurea herbicides), branded crop-protection products for Indian farmers and pharmaceutical ingredients. **Performance & Other Chemicals** (P&OC) sells epoxy resins and hardeners, aromatics (para-cresol and its derivatives), dyes and pigments, resorcinol and bulk chemicals, and Lapox/Polygrip adhesives. Key group entities: Atul Products (caustic-chlorine, 100%), Atul Bioscience (APIs, 100%), Amal (49.86%, consolidated), DPD (date palms, UK) and joint ventures with Rudolf (textile chemicals), Nouryon (Anaven, monochloroacetic acid) and Buckman (water treatment).' },
    { exhibit: { type: 'table', title: 'The segments in FY26', head: ['Segment', 'What it makes', 'Revenue (₹ cr)', 'EBITDA margin', 'EBIT (₹ cr)', 'Capital employed (₹ cr)', 'Pre-tax ROCE'], wide: [1], rows: [
      ['**Life Science Chemicals**', 'Herbicides, insecticides, fungicides (bulk actives and retail brands); APIs and intermediates (Atul Bioscience)', n0(A26.lscRev), A26.lscEbitdaPct + '%', n0(A26.lscEbit), n0(A26.lscCapEmployed), A26.lscRoce + '%'],
      ['**Performance & Other Chemicals**', 'Epoxy resins, curing agents, sulfones; aromatics; dyes and pigments; resorcinol and bulk chemicals; caustic-chlorine (Atul Products); retail adhesives', n0(A26.pocRev), A26.pocEbitdaPct + '%', n0(A26.pocEbit), n0(A26.pocCapEmployed), A26.pocRoce + '%'],
      ['Others', 'Tissue-culture date palms, services', n0(A26.othRev), A26.othEbitdaPct + '%', n0(A26.othEbit), n0(A26.othCapEmployed), '–'],
      ['Less inter-segment', '', '−' + n0(A26.interSeg), '', '', '', ''],
      { hl: true, cells: ['**Consolidated**', '', n0(A26.consRev), '', n0(A26.segEbit), '', ''] },
    ], source: 'Annual report FY26 (note 30.15); EBITDA = segment EBIT + segment depreciation; ROCE = EBIT ÷ average (segment assets − liabilities), GAM' } },
    { exhibit: { type: 'table', title: 'Sales by business, including the main subsidiaries (₹ crore)', head: ['Segment', 'Sub-segment', 'FY25', 'FY26', 'Change', 'Note'], wide: [1, 5], rows: SUB.map(r => [r.seg, r.name, n0(r.fy25), n0(r.fy26), `${r.fy26 >= r.fy25 ? '+' : '−'}${Math.abs(Math.round((r.fy26 / r.fy25 - 1) * 100))}%`, r.note]), source: 'Annual report FY26 (MD&A), Analyst Meet 2026; sub-segments exclude some inter-company sales, so they do not add to segment revenue' } },
    { h: 'How each business makes money' },
    { p: '**LSC is a chemistry-and-registration business.** Atul makes the active ingredient (for example 2,4-D, of which it supplies 13% of the world) and sells it to formulators abroad, or formulates and sells it under its own brands in India. Profit depends on the cost position of its integrated chain and on Chinese prices for the same molecules; registrations and long customer relationships make volumes sticky. **P&OC is mostly a scale-and-integration business.** Epoxy resin, para-cresol, resorcinol and dyes are sold against Asian (often Chinese) competition at prices set by global supply. Atul\'s edge is that it makes its own chlorine, caustic, phenol derivatives and intermediates on one site, which lowers cost but also means margins swing with the cycle. Retail adhesives (Lapox, Polygrip) are the only part with a consumer brand.' },
    { pair: [
      { type: 'stacked', title: 'Revenue mix: P&OC ~72%', unit: 'Segment revenue (₹ crore, gross)', x: FYS, series: [{ name: 'Life Science Chemicals', values: SA.map(a => Math.round(a.lscRev)), fmt: 'num' }, { name: 'Performance & Other Chemicals', values: SA.map(a => Math.round(a.pocRev)), fmt: 'num' }], minLabel: 600, source: 'Company annual reports' },
      { type: 'column', title: 'Exports have slipped from ~50% to ~40% of revenue', unit: 'Revenue outside India (% of total)', x: FYS, series: [{ name: 'Outside India', values: SA.map(a => a.exportPct), fmt: 'pct' }], labels: 'all', min: 0, max: 60, source: 'Annual reports (geographical segment note)' },
    ] },
  ],
};

// ---------------------------------------------------------------- History
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From India\'s first dye maker (1952) to a ₹6,000 cr chemical group',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, h.event, h.impact || '–']), source: 'Company filings, annual reports, Analyst Meet 2026, Screener.in' } },
    { callout: `**Corporate actions:** ${C.corporateActions} The capital story is one of self-funding: no equity has been raised, debt is negligible, and surplus cash has gone into treasury funds and listed shares rather than large buybacks.` },
  ],
};

// ---------------------------------------------------------------- Industry
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Chemicals: China sets the price; India is protecting its producers',
  blocks: [
    { p: 'China makes 46% of the world\'s chemicals (26% in 2010); India makes under 3% and is the world\'s largest net importer. When Chinese demand slowed in 2023-24, surplus Chinese product cut prices across Atul\'s markets: epoxy, para-cresol, dyes, 2,4-D. That is why Atul\'s revenue fell 13% in FY24 and P&OC margins halved. Since late 2025 the picture has improved: China launched an "anti-involution" campaign against loss-making capacity and cut export tax rebates, India imposed anti-dumping duties on epoxy resin (Nov-2025, Atul was an applicant) and sulphur black, and the India-US trade deal (Feb-2026) cut US tariffs on Indian goods to ~18%. Then the West Asia conflict (from Mar-2026) pushed up crude-linked raw material and chemical prices, which inflated Q4FY26-Q1FY27 margins across Indian chemicals. By August, spreads in several chains were already easing.' },
    { exhibit: { type: 'table', title: 'Market forces', head: ['Theme', 'Direction', 'What it means for Atul'], wide: [2], rows: [
      ['Chinese overcapacity (2023-25)', 'Headwind, easing', 'Cut prices of epoxy, aromatics, dyes and 2,4-D; P&OC EBITDA margin fell from 26% (FY21) to 10% (FY23).'],
      ['China\'s "anti-involution" drive and rebate cuts (Dec-2025, Apr-2026)', 'Tailwind', 'Less dumping, firmer Asian prices; too early to call structural.'],
      ['India\'s anti-dumping duty on liquid epoxy resin (Nov-2025, 5 years, US$37-483/t)', 'Tailwind', 'Protects Atul\'s 80 ktpa LER plant in the Indian market.'],
      ['US anti-dumping duty on Indian epoxy resin (Atul 12.69%, Mar-2025)', 'Headwind', 'Makes the US harder for Atul\'s epoxy exports (40% of Performance Materials sales are exported).'],
      ['West Asia conflict (from Mar-2026)', 'Tailwind, fading', 'War-time prices and inventory gains lifted Q1FY27 P&OC EBIT margin to 16.8%; brokers expect it to fade.'],
      ['India-US trade deal (Feb-2026, ~18% tariff)', 'Tailwind', 'Better access for Indian chemicals vs China (~34%).'],
      ['Crop protection cycle', 'Mixed', 'Global market growing ~2% a year; Indian demand hit by weather in FY26; Chinese oversupply weighs on actives prices.'],
    ], source: 'Analyst Meet 2026, AR FY26, DGTR/CBIC notifications, US Commerce, India Ratings, broker notes (to 30-Sep-2026)' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Atul captures the shocks and the protection, not yet a growth surge',
  blocks: [
    { verdicts: [
      ['War-time chemical prices (Q4FY26-Q1FY27)', 'Yes', `P&OC EBIT ₹${n0(Q1.segments.pocEbit)} cr in Q1FY27 vs ₹${n0(Q1.segments.pocEbitPrior)} cr a year earlier; inventory drawdown ₹188 cr.`, 'Real, but temporary by nature.'],
      ['Anti-dumping protection in India (epoxy, sulphur black)', 'Yes', 'Atul was an applicant in both cases; epoxy duty from Nov-2025.', 'Supports domestic prices and LER utilisation.'],
      ['China+1 sourcing by global customers', 'Partly', `Exports +7% in FY26 (volume +5%); export share down from ~50% (FY19-22) to ${A26.exportPct}%.`, 'Not visible as a step-change.'],
      ['Indian import substitution (epoxy, caustic-chlorine)', 'Yes', 'Performance Materials sales +18% in FY26 (volume +21%); Atul Products sales +35%.', 'Volume yes; returns still low.'],
      ['Crop protection recovery', 'Partly', 'Bulk actives +16% in FY26 (exports +30%), but LSC revenue only +4% in Q1FY27.', 'Steady, not strong.'],
      ['Indian consumption (retail adhesives, agri retail)', 'Yes', 'Polymers-Retail +20%, crop-protection retail +9% in FY26.', 'Small: ~₹580 cr of sales.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

// ---------------------------------------------------------------- LSC
const lsc = {
  id: 'lsc', nav: 'Life Science Chemicals', kicker: 'Segment', title: 'Life Science Chemicals: a high-return franchise that grows slowly',
  blocks: [
    { pair: [
      { type: 'column', title: 'LSC revenue by quarter: flat at ₹440-470 cr', unit: 'LSC revenue (₹ crore)', x: QL, series: [{ name: 'LSC', values: SQ.map(q => q.lscRev), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'LSC EBIT: ₹93 cr in Q1FY27, below Q4\'s ₹143 cr', unit: 'LSC EBIT (₹ crore)', x: QL, series: [{ name: 'EBIT', values: SQ.map(q => q.lscEbit), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { bullets: [
      `**Crop protection actives** (₹725 cr in FY26, +16%): 2,4-D (13% world share) and indoxacarb (14%) are the anchors; exports rose 30% in FY26 (volume +8%, price +7%) while Indian sales fell 8% on erratic weather. Five new products are ready for FY27; a ₹167 cr plant for MCPP-p and MCPA herbicides (from in-house o-cresol and MCA) was approved in July 2026.`,
      `**Crop protection retail** (₹280 cr, +9%): 59 brands, 71 formulations; three proprietary products launched in May 2026. Management's long-term aim is a retail business bigger than its B2B sales; that is far off.`,
      `**Pharmaceuticals** (₹595 cr, −6%; Atul Bioscience ₹148 cr, +9%): APIs (dapsone, acyclovir, venlafaxine) and intermediates; exports fell 17% in FY26; 11 drug master files filed; all three sites cleared USFDA inspections.`,
      `**Margins:** LSC EBITDA margin ranged from 15% (FY22) to 27% (FY26). FY24's slump (EBIT halved to ₹${n0(A24.lscEbit)} cr) shows how quickly agrochemical destocking and Chinese prices can hit it.`,
    ] },
    { pair: [
      { type: 'line', title: 'LSC EBITDA margin: 18-27% through the cycle', unit: 'LSC EBITDA margin (%, annual)', x: [...FYS, ...F.years], series: [{ name: 'LSC', values: [...SA.map(a => a.lscEbitdaPct), ...F.years.map((_, i) => Math.round(F.seg.lsc.adjEbitda[i] / F.seg.lsc.revenue[i] * 1000) / 10)], fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: 'Company annual reports, GAM Research estimates (FY27-29E)' },
      { type: 'column', title: 'Our LSC forecast: EBITDA grows with revenue', unit: 'LSC EBITDA (₹ crore)', x: ['FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'EBITDA', values: [A24.lscEbitda, A25.lscEbitda, A26.lscEbitda, ...F.seg.lsc.adjEbitda].map(v => Math.round(v)), fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
    ] },
    { callout: `**Our view:** LSC is Atul\'s best business (pre-tax ROCE ${A26.lscRoce}% in FY26) but not a growth engine: revenue grew ~4% a year over FY19-26. We model +6% / +8% / +8% (FY27-29E) at a 24.5% EBITDA margin (FY26: ${A26.lscEbitdaPct}%, a peak), so LSC EBITDA is roughly flat in FY27 and grows ~8% a year after.` },
  ],
};

module.exports = { business, history, industry, tailwind, lsc };
