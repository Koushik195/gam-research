// EIH report, part 2: business, history, industry, tailwind test.
const fs = require('fs');
const path = require('path');
const X = require('./EIHOTEL.ctx');
const { C, ROOT, n0, n1, Q1, FY26 } = X;
const PF = C.portfolio, IN = C.industry, K = C.kpis.FY26;

// Peer growth from each company's Screener file: Jun-2026 quarter YoY and FY26 operating margin.
const scr = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables;
const q1g = sym => { const q = scr(sym).quarters, r = q.rows.Sales, i = q.periods.indexOf('Jun 2026'), j = q.periods.indexOf('Jun 2025'); return i >= 0 && j >= 0 ? Math.round((r[i] / r[j] - 1) * 1000) / 10 : null; };
const margin26 = sym => { const t = scr(sym)['profit-loss'], i = t.periods.indexOf('Mar 2026'); return Math.round(t.rows['Operating Profit'][i] / t.rows.Sales[i] * 1000) / 10; };
const IND = ['EIHOTEL', 'INDHOTEL', 'ITCHOTELS', 'CHALET', 'LEMONTREE'];
const top = (arr, n) => arr.slice(0, n).map(([h, k]) => `${h.replace(/ \(.*\)$/, '')} (${k})`).join(', ');

const business = {
  id: 'business', nav: 'What EIH does', kicker: 'The business', title: 'A luxury hotel owner first: Oberoi and Trident hotels it owns, a few it manages, flight kitchens on the side',
  blocks: [
    { p: `EIH makes money mainly by **owning and running its own hotels**: it keeps all their revenue and costs. The Oberoi brand covers ${PF.oberoiIndia.length} luxury hotels and resorts in India (${top(PF.oberoiIndia, 5)} and the Vilas resorts in Agra, Udaipur, Jaipur, Ranthambhore, Chandigarh and Bandhavgarh) plus ${PF.intl.length} hotels and cruisers abroad (Egypt, Morocco, Bali, Lombok, Mauritius). Trident is the five-star brand (${top(PF.tridentIndia, 3)} and others). Some Tridents (including Trident Jaipur and the Visakhapatnam project) are owned by **EIH Associated Hotels**, a listed associate (EIH 36.81%) that EIH manages; a few hotels are **managed for third parties** for a fee (management fees are not disclosed). Side businesses: **Oberoi Flight Services** (airline catering in Mumbai, Delhi, Chennai and Kolkata; ₹${Q1.ofsRev} cr of revenue in Q1FY27), airport services, project management, and a 40% car-rental JV with Avis.` },
    { p: `In FY26 consolidated revenue of ₹${n0(FY26.revenueOp)} cr was rooms ₹${n0(FY26.room)} cr (${Math.round(FY26.room / FY26.revenueOp * 100)}%), food and beverage incl. flight catering ₹${n0(FY26.fnb)} cr (${Math.round(FY26.fnb / FY26.revenueOp * 100)}%) and other services ₹${n0(FY26.otherServices)} cr (${Math.round(FY26.otherServices / FY26.revenueOp * 100)}%). Owned hotels ran at ${K.ownedOccPct}% occupancy with RevPAR of ~₹${n0(K.ownedRevpar)} (+${K.ownedRevparGrowthPct}%). EIH reports a single segment, so the split of profit between hotels, flight catering and the international hotels is not disclosed.` },
    { exhibit: { type: 'table', title: 'The portfolio (30-Jun-2026)', head: ['Group', 'Hotels', 'Keys', 'Examples'], rows: [
      ['The Oberoi, India', String(PF.oberoiIndia.length), n0(PF.oberoiIndia.reduce((t, h) => t + h[1], 0)), 'Mumbai, New Delhi, Gurgaon, Bengaluru; Amarvilas, Udaivilas, Rajvilas; Wildflower Hall (interim contract); the Grand (shut)'],
      ['Trident and Maidens, India', String(PF.tridentIndia.length), n0(PF.tridentIndia.reduce((t, h) => t + h[1], 0)), 'Nariman Point (586), Bandra Kurla (439), Hyderabad (323); Jaipur shut for renovation'],
      ['International', String(PF.intl.length), n0(PF.intl.reduce((t, h) => t + h[1], 0)), 'Sahl Hasheesh, Marrakech, Bali, Mauritius, Lombok, Nile cruiser'],
      { hl: true, cells: ['**Total (owned, associate and managed)**', `**${PF.oberoiIndia.length + PF.tridentIndia.length + PF.intl.length}**`, `**${n0(PF.keysIndia + PF.keysIntl)}**`, `Pipeline: ${PF.pipelineOwned.properties} owned (${n0(PF.pipelineOwned.keys)} keys) + ${PF.pipelineManaged.properties} managed (${n0(PF.pipelineManaged.keys)} keys) to 2031`] },
    ], source: 'Q1FY27 deck slides 22-25 (keys in India 3,801 and abroad 408 as stated by the company)' } },
    { pair: [
      { type: 'hbar', title: 'Q1FY27 revenue growth: EIH among the faster names', unit: 'Consolidated revenue growth, Jun-2026 quarter, year on year (%)', x: IND.map(X.shortName), series: [{ name: 'Growth', values: IND.map(q1g), fmt: 'pct' }], labels: 'all', highlight: 'EIH (Oberoi)', source: 'Screener.in quarterly results (Chalet Q1FY26 included residential flat sales)' },
      { type: 'hbar', title: 'FY26 EBITDA margin: EIH among the highest despite flight catering', unit: 'Operating EBITDA margin, FY26 (%)', x: IND.map(X.shortName), series: [{ name: 'Margin', values: IND.map(margin26), fmt: 'pct' }], labels: 'all', highlight: 'EIH (Oberoi)', source: 'Screener.in (consolidated)' },
    ] },
    { callout: '**Why the model matters:** IHCL and ITC Hotels grow mostly by signing management contracts that need no capital; EIH grows mostly by building and owning (825 owned pipeline keys, many through new builds such as Hebbal, Goa and Tirupati). Owning keeps all the profit of a great hotel, but it makes growth slow, lumpy and capital-hungry, and it is why EIH\'s room count has barely moved since FY23.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From the Covid loss to record margins in four years, with the Wildflower Hall dispute and a family succession along the way',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event'], wide: [1], rows: C.history.map(h => [h[0], h[1]]), source: C.historySrc } },
    { callout: '**Corporate actions and per-share data:** 62.54 cr shares of ₹2 since FY21 (equity capital ₹114 cr -> ₹125 cr in FY21); no split, bonus or issue inside our valuation window. Screener\'s consolidated "Net Profit" is before minorities (FY26 ₹657 cr) while EPS is after them, so the engine would infer 65.4 cr shares; EIHOTEL.patch.js replaces the row with profit attributable to owners (₹628 cr), which restores 62.49 cr (0.1% from the actual count).' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Demand ahead of supply for a fourth year, luxury rates still rising; the 2026 travel shock hit foreign guests and the sector\'s valuation',
  blocks: [
    { p: `Branded supply in India's key hotel markets grows ~5% a year while demand grows faster, which has let hotels push rates for four years. FY26 industry occupancy was ${IN.fy26.occ} with average rates ${IN.fy26.arr} and RevPAR ${IN.fy26.revpar} (HVS Anarock), despite the May-2025 conflict, a long monsoon, December flight disruptions and the West Asia war. Q1FY27 was better: occupancy ${IN.hvsJul26.q1fy27Occ}, rates ${IN.hvsJul26.q1fy27Arr}, RevPAR ${IN.hvsJul26.q1fy27Revpar}, led by domestic demand while foreign arrivals at EIH fell ~10%. ICRA (29-Sep-2026) expects premium-hotel revenue to grow ${IN.icraSep26.fy27RevGrowth} in FY27 after ${IN.icraSep26.fy26RevGrowthPct}% in FY26, with occupancy ${IN.icraSep26.fy27OccPct}. At the very top end the MD & CEO argues India is still "significantly underpriced" against Europe, North America and much of Asia, where $1,000+ room rates are normal.` },
    { exhibit: { type: 'table', title: 'Forces acting on EIH\'s market (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for EIH'], wide: [2], rows: [
      ['Scarce luxury supply in city centres and leisure circuits', 'Positive', 'Supports rates at the Oberoi city hotels and the Vilas resorts; FY26 Oberoi RevPAR +10%.'],
      ['Foreign travel (West Asia conflict, airline capacity, North India air quality)', 'Negative in 2026', 'Oberoi hotels depend more on foreign guests than peers; Q1FY27 Oberoi RevPAR +8% vs the luxury segment +13%.'],
      ['Domestic luxury, weddings and MICE (BRICS 2026, Aero India)', 'Positive', 'Mumbai Tridents strong (Trident RevPAR +14% in Q1); big events lift Delhi and Bengaluru.'],
      ['New luxury supply bunching in 2028-30 (raised by analysts on the 29-May-2026 call)', 'Mixed', 'Management says it prices for a premium and will not discount; the risk is in Goa, Bengaluru and Delhi.'],
      ['Airline traffic', 'Mixed', 'Flight catering grows with new domestic and direct international flights, at lower margins and with an airport levy.'],
      ['Industry growth slowing to 7-9% (ICRA)', 'Negative', 'Rate growth normalises; hotel stocks re-priced in 2026.'],
    ], source: 'ICRA (29-Sep-2026); HVS Anarock via the Q4FY26 and Q1FY27 decks; company calls (29-May and 12-Aug-2026)' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: EIH captures the luxury rate cycle; it does not capture the branding boom, because it signs few management contracts',
  blocks: [
    { verdicts: [
      ['Rising luxury room rates', 'Yes', `Oberoi RevPAR ₹${n0(K.oberoiRevpar)} in FY26 (+10%), RGI ${K.rgiOberoi}; Trident +10% (RGI ${K.rgiTrident}); owned RevPAR +${Math.round((Q1.ownedRevpar / Q1.ownedRevparPy - 1) * 100)}% in Q1FY27.`, 'Most of the margin gain since FY23.'],
      ['Branded share gain (owners signing management contracts)', 'Little', `Managed pipeline ${n0(PF.pipelineManaged.keys)} keys (IHCL: ~32,600 pipeline keys, 81% of them managed); slippage to 2029-30.`, 'Fee income too small to disclose.'],
      ['Weddings and MICE', 'Partly', 'Udaipur weddings fell in Q4FY26; Mumbai MICE strong in Q1FY27; F&B (incl. flight catering) +4% in FY26.', 'F&B grows slower than rooms.'],
      ['Foreign and long-haul travel', 'Headwind in 2026', `Foreign arrivals at EIH −10% in Q1FY27; Oberoi RevPAR +${Q1.oberoiRevparGrowthPct}% vs luxury segment +${Q1.luxurySegmentPct}%.`, 'EIH is more exposed than domestic-led peers.'],
      ['Air traffic growth', 'Yes, at low margins', `Flight catering ₹${Q1.ofsRev} cr in Q1FY27 (Q4FY26 ~₹145 cr); airport levy ₹71 cr in FY26 vs ₹44 cr.`, 'Adds revenue, dilutes margin.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: 'Company decks and calls (May-Aug 2026); AR FY26' },
  ],
};

module.exports = { business, history, industry, tailwind };
