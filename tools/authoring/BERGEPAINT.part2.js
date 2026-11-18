// Berger Paints report, part 2: business, history, industry, tailwind test, decorative, industrial & subsidiaries.
const fs = require('fs');
const path = require('path');
const X = require('./BERGEPAINT.ctx');
const { C, D, F, A, ROOT, n0, n1, pc, rup, SRC, SA, SQ, QL, Q1, FY26, b, BL } = X;
const A26 = SA.find(a => a.fy === 'FY26'), A25 = SA.find(a => a.fy === 'FY25'), A22 = SA.find(a => a.fy === 'FY22');

// Three-year revenue CAGR (FY23-26) for the industry chart, from each company's Screener file.
const cagr3 = sym => { const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables['profit-loss']; const r = S.rows.Sales, i = S.periods.indexOf('Mar 2026'), j = S.periods.indexOf('Mar 2023'); return Math.round((Math.pow(r[i] / r[j], 1 / 3) - 1) * 1000) / 10; };
const IND = ['BERGEPAINT', 'ASIANPAINT', 'KANSAINER', 'INDIGOPNTS', 'PIDILITIND'];
const q1g = D.peers.q1fy27SalesGrowthPct;

const business = {
  id: 'business', nav: 'What Berger does', kicker: 'The business', title: 'India\'s No.2 paint maker: four-fifths decorative, one-fifth industrial',
  blocks: [
    { p: `Berger makes paints and coatings. **Decorative** paints (about ${100 - FY26.industrialSharePct}% of FY26 consolidated sales) go on homes and buildings: interior and exterior emulsions, enamels, distempers, putty and primers, wood coatings, and a fast-growing range of construction chemicals and waterproofing (Home Shield, Roof Kool & Seal, Dampshield) and tile adhesives. They are sold through ${n0(64475)} dealers, most of whom tint paint to order on Berger's machines, and applied by contract painters, who influence what the homeowner buys. **Industrial** coatings (${FY26.industrialSharePct}%) are sold to companies: protective coatings for bridges, refineries, pipelines and rail (Berger is No.1 in India), automotive coatings (directly and through a 49% joint venture with Nippon Paint), general industrial and powder coatings, and coil coatings through a 49% joint venture with Becker. Subsidiaries add ₹${n0(A26.subsRev)} cr of revenue (net of eliminations): Bolix in Poland (external insulation systems), BJN in Nepal (decorative paints), STP (construction chemicals) and smaller Indian units.` },
    { exhibit: { type: 'table', title: 'What Berger sells (FY26)', head: ['Business line', 'Share of sales', 'Products and brands', 'Who buys'], wide: [2], rows: [
      ['**Decorative**', `**~${100 - FY26.industrialSharePct}%**`, '', ''],
      ['  Emulsions, enamels, distempers, putty, wood coatings', '', 'Kolor Plus and Kolor Plus Glow (premium interior), WeatherCoat Anti Dustt (exterior), Silk Metallics, Luxol Metallics (enamel)', 'Homeowners via dealers and painters; builders (projects)'],
      ['  Construction chemicals and waterproofing', '~10-12% of decorative', 'Home Shield range, Roof Kool & Seal, Tank Kool, Dampshield; tile adhesives, admixtures, textures', 'Homeowners, masons, builders'],
      ['**Industrial**', `**${FY26.industrialSharePct}%**`, '', ''],
      ['  Protective and infrastructure', '', 'High-performance coatings (fluoropolymer, polysiloxane), pipe coatings, coatings for rail', 'Government and private infrastructure, oil & gas, power'],
      ['  Automotive, general industrial, powder', '', 'OEM coatings (two-wheelers, CVs, EVs); soft-touch and speciality finishes; architectural powder', 'Vehicle makers, appliance and fan makers'],
      ['  Joint ventures (equity-accounted, not in revenue)', '', 'Berger Nippon Paint Automotive Coatings (49%); Berger Becker Coatings (48.98%)', 'Car makers; coil and packaging users'],
    ], source: 'AR FY26 (MD message, segment note 52, subsidiary list); Q1FY27 call (construction chemicals share); Q4FY26 and Q1FY27 decks' } },
    { pair: [
      { type: 'hbar', title: 'The parent is 88% of revenue', unit: 'FY26 revenue (₹ crore)', x: ['Berger Paints India (standalone)', 'Subsidiaries (consolidated less standalone)'], series: [{ name: 'Revenue', values: [Math.round(A26.saRev), A26.subsRev], fmt: 'num' }], labels: 'all', highlight: 'Berger Paints India (standalone)', source: 'AR FY26; Screener.in; GAM (subsidiaries = difference)' },
      { type: 'hbar', title: 'India is 92% of customer revenue', unit: 'FY26 revenue from contracts with customers, by destination (₹ crore)', x: ['Within India', 'Outside India'], series: [{ name: 'Revenue', values: [Math.round(A26.indiaRev), Math.round(A26.outsideIndiaRev)], fmt: 'num' }], labels: 'all', highlight: 'Within India', source: 'AR FY26 consolidated note 52' },
    ] },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Distribution', '64,475 dealers and distributors in FY26 (61,661 in FY25), 11,100+ added in the year; top 10 dealers only 1.9% of sales; ~1,900 exclusive stores (~900 urban), 700 opened in FY26'],
      ['Tinting', '10,000+ tinting machines installed in FY26 (2,600+ in Q4), 2,100+ in Q1FY27; aim ~10,000 again in FY27, mostly in under-indexed pin codes'],
      ['Manufacturing', '15 domestic paint factories (excluding subsidiaries) incl. Jammu, Sikandrabad, Sandila, Howrah, Rishra, Nalbari, Naltali, Puducherry, Hindupur, Goa, Jejuri, Taloja; 30+ worldwide incl. subsidiaries and JVs; new plants at Panagarh (West Bengal) and Khordha (Odisha)'],
      ['People', '9,119 permanent employees (standalone)'],
      ['Overseas', 'Nepal (BJN), Poland (Bolix, with units in the UK, France and Ukraine), Russia; revenue outside India ₹1,001 cr in FY26 (+18%)'],
    ], source: 'AR FY26 (pp. 4-8, BRSR); Q4FY26 and Q1FY27 decks and call' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From Hadfield\'s of Calcutta (1923) to a Dhingra-run No.2',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: rup(C.historySrc) } },
    { callout: '**Corporate actions and per-share data:** the 1:5 bonus of Sep-2023 raised the share count from 97.1 cr to 116.6 cr. Screener, and every per-share figure in this report, is restated for it. No buyback or equity raise since; dividends (₹4.00 a share for FY26, ₹466 cr) are the main return of cash. The Dec-2025 promoter restructuring moved shares between promoter companies (U K Paints (India) now holds 64.56%); total promoter holding stayed at 75%.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A growing market that turned from a cosy oligopoly into a capacity race',
  blocks: [
    { p: 'Indian paint demand grows with housing, repainting, rising incomes and the shift from lime wash and unbranded paint to branded emulsions. Use per person is low (about 4.1 kg against a global average of 13-15 kg) and the unorganised sector is still nearly a quarter of the market. For two decades the organised market was a stable oligopoly led by Asian Paints, with Berger, Kansai Nerolac and Akzo Nobel (Dulux) behind; prices rose with inputs and rarely fell much. That changed in 2024, when Grasim launched Birla Opus with large new plants and aggressive dealer terms, and again in Dec-2025, when JSW Paints took control of Akzo Nobel India. Industry value growth fell close to zero in FY25-26 while volumes kept growing.' },
    { p: 'The cost side is crude oil. Petroleum derivatives (solvents, monomers for emulsions, resins) are 55-60% of raw materials and titanium dioxide is the other big input. When the West Asia conflict lifted crude in early 2026, the industry raised prices 14-16% in stages between March and June, Birla Opus included. That is why Q1FY27 growth jumped for every listed player. The question for FY28 is how much of it stays when inputs ease.' },
    { exhibit: { type: 'table', title: 'Forces acting on Berger\'s markets (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Berger'], wide: [2], rows: D.industry.themes.map(r => r.map(rup)), source: rup(D.industry.src) } },
    { pair: [
      { type: 'hbar', title: 'Q1FY27: price lifted everyone; Berger in the middle', unit: 'Consolidated revenue growth, Jun-2026 quarter, year on year (%)', x: ['Pidilite', 'Indigo Paints', 'Asian Paints', 'Berger Paints', 'Kansai Nerolac'], series: [{ name: 'Growth', values: [q1g.PIDILITIND, q1g.INDIGOPNTS, q1g.ASIANPAINT, q1g.BERGEPAINT, q1g.KANSAINER], fmt: 'pct' }], labels: 'all', highlight: 'Berger Paints', source: 'Screener.in quarterly results' },
      { type: 'hbar', title: 'Over three years Berger outgrew the leader', unit: 'Revenue growth, FY23-26, a year (%)', x: IND.map(X.shortName), series: [{ name: 'CAGR', values: IND.map(cagr3), fmt: 'pct' }], labels: 'all', highlight: 'Berger Paints', source: 'Screener.in (consolidated)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Berger gets the volume tailwinds, not the pricing ones',
  blocks: [
    { verdicts: [
      ['Demand recovery (weather, festive timing, tax cuts)', 'Yes', 'Standalone volume +11.8% in Q4FY26 and +8.4% in Q1FY27; secondary sales in July "much better than last year" (MD).', 'Volume is real; East and North-East still muted.'],
      ['Industry price rises (crude)', 'Yes, for now', `Value growth ${Q1.saRevenueYoYPct}% in Q1FY27 vs 0-7% for two years; but only ~5% realised against a 12-13% list-price rise.`, 'Borrowed from crude; may be handed back.'],
      ['Construction chemicals and waterproofing', 'Yes', '~10-12% of decorative sales, growing "significantly higher" than paint; Roof Kool & Seal, Dampshield.', 'Adds volume, dilutes price per kg.'],
      ['Premiumisation', 'Partly', 'Kolor Plus gained traction in premium interiors; but FY26 saw downtrading to economy emulsions and lower exterior sales.', 'Mix helped Q1FY27 (stocking ahead of price rises).'],
      ['Industrial capex, autos (GST cut)', 'Yes', 'Automotive double-digit value growth in Q1FY27; protective margins in the high teens; GI and powder recovered late in FY26.', 'Industrial lagged on price in Q1, catches up in Q2.'],
      ['Penetration and formalisation', 'Shared', 'Per-capita use 4.1 kg; but the new entrants are the ones adding most capacity and dealers.', 'Berger must spend to hold share.'],
      ['Overseas', 'No', 'Bolix flat in Q1FY27, UK subdued, Nepal hit by elections in Q4FY26.', 'Small (8% of revenue) and slow.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

const gap = SQ.map(q => (q.valuePct != null && q.volumePct != null ? Math.round((q.valuePct - q.volumePct) * 10) / 10 : null));
const deco = {
  id: 'deco', nav: 'Decorative', kicker: 'Business line', title: 'Decorative: steady volume, and a price line the company does not control',
  blocks: [
    { pair: [
      { type: 'column', title: 'Value minus volume: −8pp to +4pp in two years', unit: 'Standalone value growth less volume growth (percentage points)', x: QL, series: [{ name: 'Price and mix', values: gap, fmt: 'n1' }], labels: 'all', source: 'Company presentations; GAM' },
      { type: 'column', title: 'Volume: 4-12% a quarter through the competitive shock', unit: 'Standalone volume growth, year on year (%)', x: QL, series: [{ name: 'Volume', values: SQ.map(q => q.volumePct), fmt: 'pct' }], labels: 'all', source: 'Company presentations (Q1FY26 = decorative)' },
    ] },
    { bullets: [
      `**What it is.** Paints, putty, wood coatings and construction chemicals for homes and buildings: ~₹${n0(BL.base.deco)} cr in FY26 on the company's 82/18 split (CRISIL: ~80%). FY26 decorative volume +${FY26.decoVolumePct}%, value +${FY26.decoValuePct}% (consolidated).`,
      '**Why value lagged volume in FY25-26.** Price cuts in economy emulsions taken in FY25, a shift to cheaper products (putty, textures, tile adhesives, economy emulsions), lower sales of exterior emulsions in two long monsoons, and dealer schemes to defend share against Birla Opus. Management\'s own description: "volume growth happens to be there, but the value growth is relatively muted".',
      `**Q1FY27.** Decorative value ~${Q1.decoValueGrowthPct}% (highest in 12 quarters) and operating profit ~+${Q1.decoOpProfitGrowthPct}%, on calibrated price rises effective for part of the quarter, exterior emulsions and Kolor Plus. Some dealer stocking ahead of price rises ("there has been some amount of stocking up").`,
      '**Where it is strong.** A clear leader in the North-East and strong in East India (West Bengal is over 10% of revenue, per Equirus); under-indexed in the South and West, where most new tinting machines and the corporate-brand campaign are aimed. Project (builder) sales grow 1-2pp faster than retail.',
      '**Competition.** The challenger\'s dealer price list was ~5% below Berger\'s and has been equalised; rebates to big dealers and 10% free material in most packs continue; painter incentives have normalised (MD, Aug-2026).',
    ] },
    { callout: '**Our view:** decorative volume growth of 8-10% looks durable: more dealers, tinting machines and stores, construction chemicals, and a low base in many states. Value growth is the industry\'s to decide. We model decorative revenue +12.5% / +9% / +10% (FY27-29E): price stays through FY27, is partly given back in FY28 (about 2-3pp of price lost against ~9-10% volume), and only mix helps in FY29.' },
  ],
};

const industrial = {
  id: 'industrial', nav: 'Industrial & subsidiaries', kicker: 'Business line', title: 'Industrial and overseas: a real niche in protective coatings, small elsewhere',
  blocks: [
    { pair: [
      { type: 'column', title: 'Subsidiaries\' revenue grew 9% a year (FY22-26)', unit: 'Consolidated less standalone revenue (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'Subsidiaries (net)', values: SA.map(a => a.subsRev), fmt: 'num' }], labels: 'all', source: 'Screener.in; AR FY26 five-year summary; GAM' },
      { type: 'column', title: 'Outside-India sales up 18% in FY26', unit: 'Revenue from customers outside India (₹ crore)', x: ['FY25', 'FY26'], series: [{ name: 'Outside India', values: [Math.round(A25.outsideIndiaRev), Math.round(A26.outsideIndiaRev)], fmt: 'num' }], labels: 'all', source: 'AR FY26 consolidated note 52' },
    ] },
    { bullets: [
      `**Industrial in India.** ${FY26.industrialSharePct}% of FY26 consolidated sales, revenue +${FY26.industrialValuePct}%. Protective coatings (No.1 in India): value +${FY26.protectiveValuePct}%, volume +${FY26.protectiveVolumePct}%, operating margins "at high teens" in Q4FY26; government capex is the driver. Automotive did well after the GST cut on vehicles (28% to 18%); general industrial and powder coatings were weak most of FY26 and recovered at the year end.`,
      '**Price lag.** Industrial customers accept price rises slowly: in Q1FY27 protective, GI and powder grew less because increases came only towards the end of the quarter, after what the MD called a protracted battle in the field; the full benefit comes in Q2. Industrial is "almost 20%" of Berger against much less for Asian Paints, so Berger\'s margins move later in an inflation cycle.',
      `**Joint ventures.** Berger Nippon Paint Automotive Coatings (49%) and Berger Becker Coatings (48.98%) are equity-accounted: their sales are not in Berger's revenue, only the profit share (₹35 cr in FY25, ₹${n0(FY26.consJvShare)} cr in FY26, ₹${n1(Q1.consJvShare)} cr in Q1FY27).`,
      '**Subsidiaries.** BJN Nepal (decorative; double-digit growth in Q1FY27 after an election-hit Q4FY26), Bolix S.A. Poland (external insulation; flat in Q1FY27 on seasonality, UK operations subdued and being cut back to profitable lines), STP (construction chemicals; a plant disruption in Q1FY27), SBL Specialty Coatings, Berger Rock Paints (51%), Berger Hesse Wood Coatings (51%). Subsidiary revenue rose only 2% in Q4FY26, but gross margins expanded (Equirus).',
    ] },
    { callout: 'Industrial is Berger\'s one clear competitive edge (the new entrants are decorative-only) and a hedge against a decorative price war, but at ~18% of sales it cannot carry the group. We model industrial revenue +10% / +9% / +10% (FY27-29E). Overseas is a profitability fix, not a growth story: management has dropped geographic expansion in Europe in favour of margins.' },
  ],
};

module.exports = { business, history, industry, tailwind, deco, industrial };
