// Lenskart report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./LENSKART.ctx');
const { C, SG, n0, n1, Q1, A, b, f26, f25 } = X;
const AR = 'AR FY26', L4 = 'Q4FY26 shareholders\' letter (20-May-2026)', L1 = 'Q1FY27 shareholders\' letter and call (12-Aug-2026)';

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'An eye-test-to-delivery machine: it makes its own glasses and sells them through 3,459 stores and an app',
  blocks: [
    { p: `${C.profile.what} In FY26 revenue was ₹${n0(A.sales[b])} cr: India ₹${n0(f26.indiaRev)} cr (59%) and International ₹${n0(f26.intlRev)} cr (41%). ${C.profile.scale}` },
    { exhibit: { type: 'table', title: 'The two segments (FY26)', head: ['Segment', 'Revenue (₹ cr)', 'Growth', 'Segment EBITDA (₹ cr, after Ind AS 116)', 'Margin', 'Stores (Jun-2026)', 'What it is'], wide: [6], rows: [
      ['India', n0(f26.indiaRev), `+${n1((f26.indiaRev / f25.indiaRev - 1) * 100)}%`, n0(f26.indiaEbitda), `${f26.indiaMarginPct}%`, n0(Q1.stores - 734), 'Lenskart, John Jacobs, Vincent Chase, Hustlr, Owndays lenses; 2,609 stores at Mar-2026, mostly company-owned; online ~50-55% "digitally influenced"; Indian plants also supply International'],
      ['International', n0(f26.intlRev), `+${n1((f26.intlRev / f25.intlRev - 1) * 100)}%`, n0(f26.intlEbitda), `${f26.intlMarginPct}%`, '734', 'Owndays (Japan and Asia), Lenskart in Singapore, Thailand, Indonesia and the Middle East (41 stores in FY26), Meller (Spain, sunglasses); 14 markets'],
    ], source: `${AR} note 41 (segment information); ${L1}` } },
    { pair: [
      { type: 'donut', title: 'India is 59% of revenue, International 41%', unit: '% of FY26 segment revenue', x: ['India', 'International'], series: [{ name: 'Share', values: [Math.round(f26.indiaRev / (f26.indiaRev + f26.intlRev) * 1000) / 10, Math.round(f26.intlRev / (f26.indiaRev + f26.intlRev) * 1000) / 10], fmt: 'pct' }], source: `${AR} note 41` },
      { type: 'stacked', title: 'Stores: 1,959 (FY23) to 3,459 (Jun-2026), India-led', unit: 'Stores (period end)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'India', values: [...SG.annual.map(a => a.indiaStores), 2725], fmt: 'num' }, { name: 'International', values: [...SG.annual.map(a => a.intlStores), 734], fmt: 'num' }], labels: 'all', source: `RHP via ICICI Direct IPO note (30-Oct-2025) for FY23-25; ${L4}; ${L1}` },
    ] },
    { callout: '**How it makes money:** Lenskart earns a ~70% product margin (revenue less the cost of frames and lenses) because it designs, makes and sells its own glasses: the Bhiwadi plant makes frames and lenses for India and much of International, and a central lab ships made-to-order glasses next day in 78 cities. From that margin it pays staff (optometrists in every store), rent and marketing. Every eye test is the top of the funnel: 23.8 mn in FY26, about half of them first-ever tests in India. Gold, a paid membership (8.8 mn members, ₹200 cr of fees in FY26), keeps customers coming back.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Built by acquisition as much as by stores: Owndays, Meller, Dealskart, then a ₹7,278 cr IPO',
  blocks: [
    { exhibit: { type: 'table', title: 'Corporate history and what it did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['2008', 'Incorporated in Delhi; founders Peyush Bansal, Neha Bansal, Amit Chaudhary and Sumeet Kapahi (today\'s promoters)', 'Online first, then stores, then global'],
      ['FY23', 'Majority stake in Owndays, a Japan-headquartered eyewear chain', 'Revenue +152% to ₹3,788 cr; goodwill and intangibles ~₹2,700 cr; FY23-24 losses on amortisation and integration'],
      ['FY25', 'Further 4.40% of Owndays bought; deferred consideration revalued', '₹167 cr non-cash gain in FY25 other income: FY25 profit ₹296 cr reported, ~₹130 cr underlying'],
      ['FY25-26', 'Franchise network bought in: master franchisee Dealskart consolidated; FoFo stores converted to company stores', 'Commissions fell from ₹733 cr (FY25) to ₹181 cr (FY26); staff costs and rent rose; "proforma" figures restate the prior year'],
      ['FY26', 'Meller (Spain, sunglasses) and GeoIQ acquired; 50% Thailand frame JV; ₹421 cr spent on acquisitions', 'International growth +37% in FY26 includes Meller'],
      ['10-Nov-2025', `IPO at ₹${X.ISSUE}: fresh issue ₹2,150 cr (5.35 cr shares) and offer for sale ₹5,128 cr (12.76 cr shares)`, 'Shares 173.6 cr at Mar-2026; ₹1,770 cr of IPO cash unspent at Mar-2026 (in deposits)'],
      ['May-2026', 'Six-month lock-up on pre-IPO shareholders ended', 'Institutions rose from ~20% to ~36% of the register by Jun-2026 as pre-IPO holders sold (see ownership)'],
    ], source: `${AR} (directors' report, notes 25, 30, 45, 52); RHP via ICICI Direct IPO note; Screener.in; GAM Research` } },
    { callout: '**Why it matters:** about 40% of revenue and most of the goodwill came through acquisitions, and the FY25-26 franchise buy-back changed the cost structure (commissions down, staff and rent up). The clean, like-for-like history is short: the company itself presents "proforma" numbers to bridge it. Lenskart has shown it can integrate (Owndays\' margin is up, Meller has doubled), but acquisitions remain part of the plan.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'India needs 78 cr pairs of eyes corrected and only 35% of them wear glasses: a market that grows by being created',
  blocks: [
    { p: 'The company\'s own build of the Indian market (AR FY26, using Redseer and government data): 145 cr people, 53% needing vision correction (77.7 cr), only 35% of them actually using correction (27.4 cr), 0.88 pairs a year each: 24.2 cr pairs at ~₹2,370 = ₹573 bn of prescription eyewear in FY25, ₹788 bn including contact lenses and sunglasses (₹894 bn estimated for FY26). By FY30 it projects 62% needing correction, 41% penetration, ₹1,478 bn. India imported 44 cr ophthalmic lenses in FY25 (~22 cr pairs), up 11% a year in volume since FY19 (DGCIS).' },
    { p: 'Most of the market is still unorganised: neighbourhood opticians who buy frames and lenses from wholesalers and test eyes by hand. Lenskart had a 4-6% share of Indian prescription eyewear in FY25 (RHP via ICICI Direct, 30-Oct-2025). Abroad, its markets (South-East Asia, Japan, Middle East) were a ₹1,716 bn eyewear market in FY26, growing 7-10% a year in Japan, 10-14% in South-East Asia and 15-20% in the Middle East for organised and direct-to-consumer players; in Japan the direct-to-consumer share rose from 25% to 31% in five years and Owndays is the third-largest such chain with 287 stores against 500+ each for the top two (AR FY26).' },
    { exhibit: { type: 'table', title: 'India eyewear market: the company\'s build-up', head: ['Building block', 'FY25E', 'FY30E'], rows: [
      ['Population (mn)', '1,454', '1,516'], ['% needing vision correction', '53%', '62%'], ['People needing correction (mn)', '777', '943'], ['Penetration (% actually using)', '35%', '41%'],
      ['Pairs sold a year (mn)', '242', '389'], ['Average selling price (₹ per pair)', '2,370', '2,797'], ['Prescription eyewear (₹ bn)', '573', '1,080'],
      { hl: true, cells: ['**Eyewear incl. contact lenses and sunglasses (₹ bn)**', '**788**', '**1,478**'] },
    ], source: `${AR} ("Sizing the opportunity", Redseer and DGCIS data). Company projections, not independent forecasts.` } },
    { callout: '**So what:** the market grows ~13-14% a year in the company\'s own numbers, so Lenskart\'s 30% India growth comes mostly from taking share from unorganised opticians and from creating first-time buyers through free eye tests. That is a good sign (share gains have a long runway at 4-6% share) and a warning (growth depends on Lenskart keeping its cost and service edge as it moves into smaller towns).' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach the company?', title: 'Yes: Lenskart is the main channel through which India\'s eyewear market is being organised',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Reaches Lenskart?', 'Evidence'], wide: [2], rows: [
      ['Rising myopia and screen time', 'Yes', 'Myopia-control lens volumes +111% in Q1FY27; ~70% of children tested need correction (company)'],
      ['First-time eye tests in small towns', 'Yes', `${Q1.eyeTestsIndiaLakh} lakh India eye tests in Q1FY27 (+42.7%), about half first-ever; 254 of FY26's 542 India stores in Tier 2+ towns; 786 remote-optometry stores`],
      ['Premiumisation', 'Yes', `₹10,000+ orders 20.5% of India revenue in FY26; India ASP ₹${n0(Q1.indiaAsp)} (+6.4%) in Q1FY27; Owndays premium lenses ~₹1,500 cr of sales`],
      ['Organised retail and omnichannel', 'Yes', 'App downloads 12 cr; 55% of India sales digitally influenced; next-day delivery in 78 cities'],
      ['Smart glasses', 'Not yet', 'B by Lenskart launched Q4FY26 (80,000+ sign-ups by Aug-2026); management: "revenue upside is not factored in the near term"'],
      ['Weak rupee vs RMB/yen', 'Against', 'Imported frames and components cost more; offset so far by in-house manufacturing (product margin 70.3% in Q1FY27); International revenue gains in rupees'],
    ], source: `${L4}; ${L1}; GAM Research` } },
    { callout: '**Verdict:** the structural tailwind (more people needing glasses, more of them buying from organised chains) clearly reaches Lenskart: it is the largest organised player and is adding ~600 stores a year. The question is not demand but price: how much of this the share price already discounts (see valuation).' },
  ],
};

module.exports = { business, history, industry, tailwind };
