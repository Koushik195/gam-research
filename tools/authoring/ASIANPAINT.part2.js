// Asian Paints report, part 2: business, history, industry, competition (the central question), tailwind
// test, standalone (decorative India) and subsidiaries (international, industrial, decor).
const fs = require('fs');
const path = require('path');
const X = require('./ASIANPAINT.ctx');
const { C, D, F, A, ROOT, n0, n1, pc, rup, SRC, SA, SQ, QL, A26, A25, A21, A20, A24, Q1, FY26, b, DT } = X;
const G = D.peers.q1fy27SalesGrowthPct, CG = D.peers.fy23to26SalesCagrPct;

const business = {
  id: 'business', nav: 'What Asian Paints does', kicker: 'The business', title: 'India\'s paint leader, plus kitchens, bath, lighting, industrial JVs and 13 countries abroad',
  blocks: [
    { p: `Asian Paints makes and sells paint. Most of it is **decorative paint for homes in India**: interior and exterior emulsions (Royale, Apex, Apcolite, Tractor, Ace), enamels, wood finishes, wall putty, waterproofing (SmartCare, Damp Proof) and adhesives, sold through ~1.7 lakh retail touchpoints that tint colours to order. This sits in the listed company (the "standalone" entity, ₹${n0(A26.saRev)} cr of revenue in FY26, ${Math.round(A26.saRev / A26.consRev * 100)}% of the group), together with kitchens (Sleek, ₹${n0(FY26.kitchenRevenue)} cr) and bath fittings (Ess Ess, ₹${n0(FY26.bathRevenue)} cr). The rest (₹${n0(A26.subRev)} cr after eliminations) comes from subsidiaries: **international** paint operations in South Asia, the Middle East, Africa and the South Pacific (₹${n0(FY26.intlRevenue)} cr), **industrial coatings** through Asian Paints PPG (protective and powder coatings, ₹${n0(FY26.apppgRevenue)} cr) and small **home-decor** businesses (White Teak lighting, Weatherseal windows). A second PPG venture, PPG Asian Paints (car and industrial coatings, ₹${n0(FY26.ppgapRevenue)} cr), is an associate: only Asian Paints' half of its profit is counted.` },
    { exhibit: { type: 'table', title: 'The businesses, FY26 (₹ crore)', head: ['Business', 'Revenue', 'Profit', 'How it is reported'], wide: [3], rows: [
      ['**Standalone (decorative India, kitchen, bath)**', `**${n0(A26.saRev)}**`, `EBITDA ${n0(A26.saEbitda)} (${n1(A26.saMarginPct)}%)`, 'Listed entity; decorative volume and value growth disclosed quarterly'],
      ['  of which kitchen (Sleek) / bath (Ess Ess)', `${n0(FY26.kitchenRevenue)} / ${n0(FY26.bathRevenue)}`, 'Near break-even / small losses', 'Quarterly revenue and PBT in the deck'],
      ['International (AP Global)', n0(FY26.intlRevenue), `PBT ${n0(FY26.intlPbt)} (${n1(FY26.intlPbt / FY26.intlRevenue * 100)}%)`, 'Subsidiaries; 13 countries'],
      ['Asian Paints PPG (industrial, 50%)', n0(FY26.apppgRevenue), `Net profit ${n0(FY26.apppgNetProfit)}`, 'Consolidated; PPG\'s half is a minority interest'],
      ['White Teak / Weatherseal / white cement', `${n0(FY26.whiteTeakRevenue)} / ${n0(FY26.weathersealRevenue)} / ${n0(FY26.whiteCementRevenue)}`, `Net losses ${n0(-FY26.whiteTeakNetLoss)} / ${n0(-FY26.weathersealNetLoss)} / ${n0(-FY26.whiteCementNetLoss)}`, 'Consolidated subsidiaries'],
      ['PPG Asian Paints (auto OE, 50%)', n0(FY26.ppgapRevenue), `Net profit ${n0(FY26.ppgapNetProfit)}`, 'Associate: share of profit (₹166 cr) in other income'],
      { hl: true, cells: ['**Group (consolidated)**', `**${n0(A26.consRev)}**`, `**EBITDA ${n0(A26.consEbitda)} (${n1(A26.consEbitda / A26.consRev * 100)}%)**`, 'One reported segment: "Paints and Home Decor"'] },
    ], source: 'AR FY26 (Board\'s report, notes 36-37); Q4FY26 deck; Screener.in standalone and consolidated P&L' } },
    { pair: [
      { type: 'hbar', title: 'Decorative India dwarfs everything else', unit: 'FY26 revenue (₹ crore)', x: ['Standalone (decorative India)', 'International', 'PPG Asian Paints (associate)', 'Asian Paints PPG', 'Kitchen (in standalone)', 'Bath (in standalone)', 'White Teak + Weatherseal'], series: [{ name: 'Revenue', values: [A26.saRev, FY26.intlRevenue, FY26.ppgapRevenue, FY26.apppgRevenue, FY26.kitchenRevenue, FY26.bathRevenue, FY26.whiteTeakRevenue + FY26.weathersealRevenue], fmt: 'num' }], labels: 'all', highlight: 'Standalone (decorative India)', source: 'AR FY26; Q4FY26 deck' },
      { type: 'column', title: 'New products: 14% of revenue a year ago, 17% now', unit: 'Share of revenue from products launched in the last three years (%)', x: ['Q4FY25', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'New products', values: [14, 16, 17, 17], fmt: 'pct0' }], labels: 'all', source: 'Company decks' },
    ] },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Manufacturing', '27 paint plants worldwide, 1.85 mn KL a year (ICICI Direct); VAM-VAE emulsion plant at Dahej (first phase from Aug-2026); white-cement plant in Fujairah, UAE; new plants planned in Madhya Pradesh (4 lakh KL, ~₹2,000 cr) and Abu Dhabi (~₹340 cr)'],
      ['Distribution', '~1.7 lakh retail touchpoints (6,000+ added in FY26); 74 Beautiful Homes stores in 20 states; Beautiful Homes Painting Service; B2B "Juggernaut" key-account programme with 100+ large customers'],
      ['Brands and innovation', 'Asian Paints, Royale, Apex, Apcolite, Tractor, Ace, SmartCare, Damp Proof, WoodTech, Nilaya, Sleek, Ess Ess; ~17% of revenue from products launched in the last three years'],
      ['International', 'Asia (Bangladesh, Nepal, Sri Lanka), Middle East (UAE, Oman, Bahrain, Qatar), Africa (Egypt, Ethiopia), South Pacific (Fiji and others); brands include SCIB, Apco, Asian Paints Berger, Taubmans, Causeway, Kadisco'],
    ], source: 'AR FY26; Q4FY26 and Q1FY27 decks and calls; ICICI Direct (30-Jul-2026)' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Eighty years of leadership; the last two the hardest',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: C.historySrc } },
    { callout: '**Corporate actions and per-share data:** no bonus, split or buyback in the period; the share count has been 95.92 cr throughout. Screener\'s consolidated "Net Profit" is before minorities while its EPS is after; we put profit on the attributable basis (ASIANPAINT.patch.js), so the model\'s share count is the real one. Big one-offs: exceptional charges of ₹363 cr in FY25 and ₹158 cr in FY26, mostly impairments of home-decor acquisitions.' },
  ],
};

const IND = ['ASIANPAINT', 'BERGEPAINT', 'KANSAINER', 'INDIGOPNTS', 'PIDILITIND', 'HINDUNILVR'];
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A growing market that turned from a cosy oligopoly into a price war',
  blocks: [
    { p: 'India\'s decorative paint market grows with new homes, repainting and the shift from lime wash and unorganised brands to branded emulsions. For decades it was a stable oligopoly: Asian Paints, Berger, Kansai Nerolac and Akzo Nobel (Dulux) together held most of the branded market, raised prices together and earned high returns. That changed in 2024. Grasim launched Birla Opus with ~₹10,000 cr of planned investment (Grasim) and a large capacity build-out, and in 2025 JSW Paints bought control of Akzo Nobel India (now JSW Dulux). New entrants pay dealers more, give contractors bigger schemes and discount the economy range hardest.' },
    { p: 'The cost side is a petrochemical cycle with one big exception: titanium dioxide (TiO2), the white pigment, is the largest single input and is not linked to crude. Monomers, solvents and emulsions are. The West Asia conflict from early 2026 pushed material costs up ~20-25%; the industry raised prices ~13-14% in steps between March and June. Material is only ~35-40% of what a household pays per square foot (labour is the rest), which is why demand has absorbed price rises so far.' },
    { exhibit: { type: 'table', title: 'Forces acting on the paint market (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Asian Paints'], wide: [2], rows: D.industry.themes, source: D.industry.src } },
    { pair: [
      { type: 'hbar', title: 'Q1FY27: price rises lifted everyone\'s revenue except JSW Dulux', unit: 'Consolidated revenue growth, Jun-2026 quarter (%)', x: ['Birla Opus (Grasim)', 'Pidilite', 'Indigo Paints', 'Asian Paints', 'Berger Paints', 'Hindustan Unilever', 'Kansai Nerolac', 'JSW Dulux'], series: [{ name: 'Growth', values: [G.BIRLAOPUS, G.PIDILITIND, G.INDIGOPNTS, G.ASIANPAINT, G.BERGEPAINT, G.HINDUNILVR, G.KANSAINER, G.JSWDULUX], fmt: 'pct' }], labels: 'all', highlight: 'Asian Paints', source: D.peers.src },
      { type: 'hbar', title: 'Over three years Asian Paints grew slowest of the paint makers', unit: 'Revenue growth, FY23-26, a year (%)', x: IND.map(X.shortName), series: [{ name: 'CAGR', values: IND.map(s => CG[s]), fmt: 'pct' }], labels: 'all', highlight: 'Asian Paints', source: 'Screener.in (consolidated)' },
    ] },
  ],
};

const competition = {
  id: 'competition', nav: 'The competition question', kicker: 'The central question', title: 'New competition: share lost, pricing power dented, margins reset lower',
  blocks: [
    { p: `This is the question that decides the stock. Since Feb-2024 Asian Paints has faced two new competitors with deep pockets. **Birla Opus** (Grasim) reached the #3 position in organised decorative paints within about two years; its Q1FY27 paint revenue was ₹1,661 cr, up 64%, with 1,450+ franchise outlets, and its revenue share rose another ~30 bp in the quarter (Grasim). **JSW Dulux** (JSW Paints after buying 74.76% of Akzo Nobel India for ~₹8,986 cr) is the other; its consolidated revenue fell ${Math.abs(G.JSWDULUX)}% in Q1FY27 (Screener). Asian Paints sold its own 4.42% stake in Akzo India for ~₹734 cr in Jul-2025.` },
    { exhibit: { type: 'table', title: 'What the competition has done to Asian Paints', head: ['Measure', 'Before (FY24 or earlier)', 'Latest', 'So what'], wide: [3], rows: [
      ['Share of branded decorative paints (estimates)', '59% (Elara, Q4CY24); 53% (Systematix, FY23)', '52% (Elara, year to Mar-25); 47% (Systematix, FY25)', 'Five to seven points lost in two years; no audited data'],
      ['Decorative value growth minus volume growth', 'Management used to guide to value 5-6 pts below volume (mix of cheaper products)', `FY25 −8.2 pts; FY26 −4.4 pts; Q1FY27 +7.6 pts (price rises)`, 'Price cuts, rebates and down-trading; reversed only by inflation pass-through'],
      ['Consolidated EBITDA margin', '21.4% (FY24)', '17.7% (FY25), 18.8% (FY26), 20.6% (Q1FY27)', 'Guidance 18-20%: the old 21-22% is not in the plan'],
      ['Dealer discounting', '"Free volume", higher discounts and dealer margins from new entrants (UBS, May-2026)', '"No let-up" despite price rises; discount differentials unchanged (MD, May-2026)', 'The list price is not the real price'],
      ['Competitive intensity', '—', '"At an all-time high", across economy, premium and luxury (MD, Jul-2026)', 'Management does not see relief'],
    ], source: 'NiftyTrader (29-Jul-2026, Elara data via Reuters); Outlook Business (Systematix data); Asian Paints calls; Screener.in; GAM Research' } },
    { pair: [
      { type: 'column', title: 'Value trailed volume by 2-7 points until 2026', unit: 'Decorative India: value growth minus volume growth (percentage points)', x: DT.filter(q => q.valuePct != null).map(q => q.q), series: [{ name: 'Value − volume', values: DT.filter(q => q.valuePct != null).map(q => Math.round((q.valuePct - q.volumePct) * 10) / 10), fmt: 'n1' }], labels: 'all', source: 'Company calls' },
      { type: 'column', title: 'Standalone EBITDA margin by quarter', unit: 'Standalone EBITDA margin (%)', x: QL, series: [{ name: 'Standalone', values: SQ.map(q => q.saMarginPct), fmt: 'pct' }], labels: 'all', min: 10, source: 'Screener.in standalone results' },
    ] },
    { bullets: [
      '**Where the fight is.** Management says discounting is most intense in the economy range (putty, low-end emulsions), where "you can really convert a contractor much better if you were to do higher discounting". Asian Paints has chosen to defend volume there, which is why its mix was negative for two years.',
      '**What has gone right.** Volume growth is back to 8-12%; in the 2026 supply shock medium and large players took share from small ones; premium and luxury ranges and new products (17% of revenue) are growing; B2B projects and industrial coatings are strong.',
      '**What the bulls say.** Nomura upgraded in May-2026 arguing Birla Opus is shifting from chasing share to profitability and the price war may have peaked; Elara thinks significant share loss "may be in the past". Grasim\'s Q1FY27 commentary still talks of "sustaining market share gains".',
      '**Regulation.** The CCI ordered a DG investigation on 1-Jul-2025 into Grasim\'s complaint that Asian Paints hindered Birla Opus\'s entry by pressuring dealers, suppliers and landlords. The company says it has a reasonable defence; the outcome is open.',
    ] },
    { callout: '**Our verdict:** the share loss is slowing but has not reversed, and pricing power has not come back: Q1FY27\'s strong value growth is cost pass-through that may partly reverse in H2 if inputs fall. We think margins have reset from the 21-22% of FY21 and FY24 to the 18-20% band for good, and we model 19.0-19.2%. Our 43x target multiple prices a still-dominant but no-longer-unchallenged leader; the street\'s 50x is closer to the pre-2024 multiple.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: demand reaches Asian Paints, the pricing tailwind no longer does',
  blocks: [
    { verdicts: [
      ['Housing, repainting and rural demand', 'Yes', `Decorative volume +8.7% in FY26 and +9.0% in Q1FY27; rural and T3/T4 towns ahead of large cities.`, 'Volume growth is real.'],
      ['Premiumisation', 'Partly', 'Better mix in Q4FY26 and Q1FY27 (~+3% in Q1); but the economy range kept growing faster for two years.', 'Helps margins only if economy discounting eases.'],
      ['Infrastructure and factories (B2B, industrial)', 'Yes', 'B2B projects strong; APPPG +21% and PPGAP +13.5% in Q1FY27; management expects industrial to outgrow decorative.', 'A growing second leg, but small: Asian Paints PPG is ~4% of consolidated revenue and PPG Asian Paints is not consolidated.'],
      ['Industry price increases (2026)', 'Yes, temporarily', 'Weighted ~7% price in Q1FY27, 8-9% expected in Q2; but material inflation ~25%.', 'Revenue up, margins squeezed; prices may be cut in H2.'],
      ['Consolidation of small players in supply shocks', 'Yes', 'Management and brokers: large players gained share from small ones in Q1FY27.', 'One-off gain while volatility lasts.'],
      ['Category growth attracting new capital', 'No (headwind)', 'Birla Opus and JSW Dulux are taking share and paying dealers more.', 'The industry\'s growth now feeds rivals too.'],
      ['Backward integration (VAM-VAE, white cement)', 'Yes, from FY28', 'First phase from Aug-2026; 300-500 bp gross-margin benefit on products using in-house VAE.', 'A cost edge rivals do not have.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { business, history, industry, competition, tailwind, ...require('./ASIANPAINT.part2b') };
