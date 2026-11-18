// Kansai Nerolac report, part 2: business, history & corporate actions, industry, tailwind test.
const X = require('./KANSAINER.ctx');
const { C, D, A, F, n0, n1, pc, rup, SRC, b, ai, BL, landGains, UE, P, PEERS, shortName } = X;
const PR = C.profile, SUB = C.subsidiaries, IND = D.industry, BO = IND.birlaOpus;
const sub = n => SUB.find(s => s.name.startsWith(n));

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'Two businesses under one brand: car and industrial coatings, and house paint',
  blocks: [
    { p: `Kansai Nerolac Paints (KNPL) makes paint in nine Indian plants and sells it in two very different ways. **Industrial coatings** (about 55% of FY26 revenue on management's description) are sold directly to factories: paint for cars, two- and three-wheelers, tractors and trucks on the assembly line (where it is No.1), powder coatings for appliances, furniture and auto parts (No.1), liquid "performance" coatings for bridges, railways, coil steel and pre-engineered buildings (No.3), and auto refinish paint for body shops. These are technical, approval-driven sales: Kansai Paint's global technology matters and 200-300 KNPL technicians work on customers' lines. **Decorative paint** (about 45%) is house paint sold through 35,000+ dealers to painters and homeowners under the Nerolac brand (Excel, Impressions, Beauty, Suraksha), plus Perma waterproofing, construction chemicals, wood finishes and a projects business for builders and institutions. Here brand, dealer incentives and painter loyalty decide sales, and Nerolac competes with Asian Paints, Berger, Birla Opus and JSW Dulux.` },
    { exhibit: { type: 'table', title: 'What Kansai Nerolac sells (FY26)', head: ['Business', 'Share of revenue', 'Position', 'Customers and products'], wide: [3], rows: [
      ['**Industrial coatings**', '~55%', '', 'Sold direct to manufacturers; growing faster (double digit in Q1FY27)'],
      ['  Automotive OEM', 'n.d.', 'No.1 (~61% share, FY24)', 'Cars, SUVs, 2/3-wheelers, CVs, tractors: electrocoat (CED), primers, base coats, clear coats; tin-free CED, low-bake systems'],
      ['  Powder coatings', 'n.d.', 'No.1', 'Appliances, ACs, furniture, electricals, alloy wheels, rebar, pipes'],
      ['  Performance and general industrial liquids', 'n.d.', 'No.3', 'Infrastructure, bridges, railways, metro, coil coating, PEB, construction equipment'],
      ['  Auto refinish', 'n.d.', 'n.d.', 'Body shops; premium PU, shift from solvent-borne to waterborne'],
      ['**Decorative paint**', '~45%', 'No.3 claimed (Feb-2026)', 'Through dealers to painters and homeowners'],
      ['  Retail paints', 'Most of decorative', '', 'Interior and exterior emulsions (Excel Everlast 20-year warranty, Impressions, Beauty), enamels, primers; Paint+ "category-defining" products'],
      ['  Projects', '~10%+ of decorative', '', 'Builders, government and institutional buildings (Super Series range); "high double-digit growth" in Q4FY26'],
      ['  Waterproofing, construction chemicals, wood finish', '~10%+ of decorative', '', 'Perma range, tile adhesives, Nerofix; growing 10-15%+'],
    ], source: 'Kansai Paint India briefing (Feb-2026), Q4FY26 and Q1FY27 calls; n.d. = not disclosed' } },
    { exhibit: { type: 'table', title: 'Reach, assets and group structure', head: ['', 'Detail'], wide: [1], rows: [
      ['Plants and R&D', PR.plants],
      ['Distribution', PR.dealers],
      ['People', `${PR.people}; MD pay 30x the median employee`],
      ['Subsidiaries', `Nerofix (100%, ₹${n0(sub('Nerofix').fy26Revenue)} cr revenue, loss ₹${n1(-sub('Nerofix').fy26Pat)} cr; merging into KNPL); Nepal (68%, ₹${n0(sub('KNP Japan').fy26Revenue)} cr, profit ₹${n1(sub('KNP Japan').fy26Pat)} cr); Bangladesh (55%, ₹${n0(sub('Kansai Nerolac Paints (Bangladesh)').fy26Revenue)} cr, loss ₹${n1(-sub('Kansai Nerolac Paints (Bangladesh)').fy26Pat)} cr). Sri Lanka sold in Dec-2025.`],
      ['Overseas sales', `${PR.overseasPct.fy26}% of FY26 revenue (${PR.overseasPct.fy25}% in FY25)`],
      ['Parent', `${PR.parent}; royalty ₹${n1(C.fy26.royaltyPaidToParent)} cr in FY26`],
    ], source: 'Annual report FY26; CRISIL (21-Aug-2026); Q1FY27 call' } },
    { callout: '**Why the split matters:** the two halves deserve different valuations. Industrial is a leadership business with real switching costs; decorative is a sub-scale No.3/No.4 in a market where two well-funded newcomers are buying share. The company reports one segment, so investors cannot see the margin of either. Management says industrial margins are now "quite healthy" (Feb-2026) after years of being the weaker half.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a 1920 Bombay paint works to Kansai Paint\'s Indian arm, now selling land and shrinking abroad',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event'], wide: [1], rows: C.history.map(h => [h.when, rup(h.event)]), source: C.historySrc } },
    { pair: [
      { type: 'column', title: `Land sales added ₹${n0(landGains)} cr of pre-tax gains in FY24-25`, unit: 'Pre-tax gain or (charge), ₹ crore: Kavesar (FY24), Lower Parel (FY25), subsidiary impairments (FY24-26), Wage Code and fire (FY26)', x: ['FY24 land sale', 'FY25 land sale', 'Impairments', 'FY26 one-offs'], series: [{ name: 'Amount', values: [661, 665, -211, -57], fmt: 'num' }], labels: 'all', source: 'Annual reports FY25-26 (standalone exceptional items; FY26 consolidated)' },
      { type: 'column', title: 'Dividend per share: ₹2.50 regular, plus land-sale specials', unit: '₹ per share for the year (FY22-23 adjusted for the 1:2 bonus)', x: C.dividends.map(d => d.fy), series: [{ name: 'Dividend', values: C.dividends.map(d => d.dps), fmt: 'n2' }], labels: 'all', source: 'Annual report FY26 (15-year summary)' },
    ] },
    { callout: `**Corporate actions:** a 1:2 bonus in FY24 took the share count to 80.87 cr (all per-share figures in this report are bonus-adjusted). There has been no buyback or equity issue. The two land sales were real cash (cash and investments rose from ₹${n0(A.cashAndInvestments[ai('FY23')])} cr at Mar-2023 to ₹${n0(A.cashAndInvestments[b])} cr at Mar-2026) but they are not repeatable earnings; only ₹1.25 a share of each went out as a special dividend. Overseas, the Sri Lankan and Bangladeshi subsidiaries cost ~₹211 cr of impairments in FY24-26 and Sri Lanka was sold for about ₹5 lakh.` },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A ₹60,000 cr paint market with two new giants, and an auto coatings niche that is booming',
  blocks: [
    { p: `CRISIL put India's organised paint industry at ~₹${n0(IND.organisedRevenueCr)} cr of revenue in FY25, with the top five companies holding ~${IND.top5SharePct}%; decorative paint is 70-75% of the market. Until 2023 decorative was a cosy oligopoly (Asian Paints, Berger, Nerolac, Akzo Nobel's Dulux, Indigo). Then two conglomerates arrived. Grasim launched **Birla Opus** in Feb-2024 with a planned ${n0(BO.plannedCapacityMlpa)} million litres a year (a ${BO.capacityAdditionPct}% addition to industry capacity) and ₹${n0(BO.investmentCr)} cr of investment; it doubled revenue in FY26 to a ~${BO.fy26RevenueSharePct}% share of decorative and booked ₹${n0(BO.q1fy27RevenueCr)} cr in Q1FY27 (+${BO.q1fy27GrowthPct}%), claiming the No.3 spot. **JSW Paints** bought control of Akzo Nobel India (Dulux) in Dec-2025. CRISIL counted ~₹10,000 cr of new-entrant capex and industry utilisation of ~70%: there is far more capacity than demand.` },
    { p: 'Industrial coatings are a different market: technology, approvals and on-site service decide who wins, and multinational groups and their Indian joint ventures dominate (Kansai Paint\'s own briefing lists seven rivals across auto, refinish, industrial and powder, several of them joint ventures). Demand follows auto production, consumer durables and infrastructure spending. After the GST cuts of Sep-2025, auto output surged: in Apr-Jun 2026 passenger-vehicle dispatches rose 25.9% and two-wheelers 20.3% (SIAM). The cost side is a petrochemical cycle: raw materials are 55-60% of sales, and the West Asia conflict from Feb-2026 pushed crude and solvent prices sharply higher while the rupee hit record lows (~95/US$ in Apr-2026).' },
    { exhibit: { type: 'table', title: 'Forces acting on Kansai Nerolac\'s markets (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Kansai Nerolac'], wide: [2], rows: IND.themes.map(r => r.map(rup)), source: IND.themesSrc } },
    { pair: [
      { type: 'hbar', title: 'Three-year revenue growth: Nerolac near the bottom', unit: 'Revenue growth FY23-26, a year (%)', x: ['Indigo Paints', 'Pidilite', 'Berger Paints', 'Kansai Nerolac', 'Asian Paints'], series: [{ name: 'CAGR', values: ['INDIGOPNTS', 'PIDILITIND', 'BERGEPAINT', 'KANSAINER', 'ASIANPAINT'].map(s => D.peers.salesCagrFY23to26Pct[s]), fmt: 'pct' }], labels: 'all', highlight: 'Kansai Nerolac', source: 'Screener.in (consolidated)' },
      { type: 'hbar', title: 'EBITDA margin FY26: industrial mix keeps Nerolac lowest', unit: 'EBITDA margin, FY26 (%)', x: PEERS.slice().sort((a, c) => c.ebitdaMargin - a.ebitdaMargin).map(p => shortName(p.symbol)), series: [{ name: 'Margin', values: PEERS.slice().sort((a, c) => c.ebitdaMargin - a.ebitdaMargin).map(p => p.ebitdaMargin), fmt: 'pct' }], labels: 'all', highlight: 'Kansai Nerolac', source: 'Screener.in (FY26, consolidated)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: the auto boom reaches Nerolac; the housing and premiumisation story mostly does not',
  blocks: [
    { verdicts: [
      ['Auto production boom (GST cuts, SUVs, exports)', 'Yes', 'No.1 with ~61% OEM share; auto grew double digit in Q4FY26 and Q1FY27; larger vehicles raise paint per car; OEMs plan to double capacity by 2030.', 'The strongest driver in the company.'],
      ['Infrastructure and industrial capex', 'Yes', 'Performance-coating liquids "very strong" in Q1FY27 (construction equipment, drums, coil coating); railways, PEB, metro targeted.', 'Double-digit growth is credible.'],
      ['Decorative demand recovery (since Nov-2025)', 'Partly', 'Decorative value growth high single digit in Q1FY27 but volume only low single digit; peers grew 12-20%.', 'The market recovers; Nerolac lags it.'],
      ['Premiumisation (emulsions, waterproofing, projects)', 'Partly', 'Super-premium double digit, projects and construction chemicals double digit, but from a small base (~20%+ of decorative).', 'Helps mix and margin, not scale.'],
      ['Shift from unorganised to organised paint', 'Unclear', 'Management cannot measure it; mostly affects low-end products where Nerolac is cutting back.', 'Not in our numbers.'],
      ['Input-cost cycle', 'Turned against', 'Gross margin fell 110bp in Q1FY27 (standalone) as crude, solvents and the rupee moved up; industrial pass-through lags 1-2 quarters.', 'A headwind in H1FY27, easing after June.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { business, history, industry, tailwind };
