// Indian Hotels report, part 2: business, history, industry, tailwind test.
const fs = require('fs');
const path = require('path');
const X = require('./INDHOTEL.ctx');
const { C, ROOT, n0, n1, Q1, FY26 } = X;
const PF = C.portfolio, IN = C.industry;

// Peer growth from each company's Screener file: Jun-2026 quarter YoY and FY23-26 revenue CAGR.
const scr = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables;
const q1g = sym => { const q = scr(sym).quarters, r = q.rows.Sales, i = q.periods.indexOf('Jun 2026'), j = q.periods.indexOf('Jun 2025'); return i >= 0 && j >= 0 ? Math.round((r[i] / r[j] - 1) * 1000) / 10 : null; };
const margin26 = sym => { const t = scr(sym)['profit-loss'], i = t.periods.indexOf('Mar 2026'); return Math.round(t.rows['Operating Profit'][i] / t.rows.Sales[i] * 1000) / 10; };
const IND = ['INDHOTEL', 'EIHOTEL', 'ITCHOTELS', 'CHALET', 'LEMONTREE'];

const business = {
  id: 'business', nav: 'What IHCL does', kicker: 'The business', title: 'India\'s largest hotel company: owner of the trophy hotels, manager of most of the rest, and 51% of the biggest airline caterer',
  blocks: [
    { p: `IHCL earns money three ways. **It owns or leases hotels** (134 hotels, ${n0(PF.jun26.ownedLeasedKeys)} keys at Jun-2026: the Taj Mahal Palace in Mumbai, Taj Palace and Taj Mahal in Delhi, Rambagh and Lake Palace in Rajasthan, Fort Aguada in Goa, plus The Pierre in New York, St James Court in London and, since Jun-2026, the leased Taj Hessischer Hof in Frankfurt) and keeps all their revenue and costs. **It manages hotels owned by others** (228 hotels, ${n0(PF.jun26.managedKeys)} keys) for a fee, typically a share of revenue plus a share of profit; fees were ₹${n0(C.mgmtFeeHistory.FY26)} cr in FY26. **It runs adjacent businesses**: Ginger (midscale, ~166 hotels), Qmin (food), ama (homestays), Tree of Life, Atmantan (wellness, 51% since Jan-2026), Brij (boutique, 51% since Apr-2026) and TajSATS (airline catering, 51%, consolidated since Aug-2024).` },
    { p: `**Brands by price point:** Taj (luxury, 93 operating hotels), Claridges Collection, Vivanta and SeleQtions (upscale), Gateway (upscale relaunch), Ginger (midscale and economy, the largest by hotel count) and Tree of Life (boutique leisure). In FY26 the consolidated hotel segment earned ₹${n0(C.hotelRevenueStreams.FY26.total)} cr: rooms ${Math.round(C.hotelRevenueStreams.FY26.room / C.hotelRevenueStreams.FY26.total * 100)}%, food and beverage ${Math.round(C.hotelRevenueStreams.FY26.fnb / C.hotelRevenueStreams.FY26.total * 100)}%, other operating income ${Math.round(C.hotelRevenueStreams.FY26.other / C.hotelRevenueStreams.FY26.total * 100)}% and management fees ${Math.round(C.hotelRevenueStreams.FY26.fees / C.hotelRevenueStreams.FY26.total * 100)}%. About 80% of consolidated hotel revenue is domestic; the international portfolio (New York, London, Cape Town, Dubai and Maldives management contracts) earned ₹1,725 cr of revenue and ₹250 cr of EBITDA in FY26.` },
    { exhibit: { type: 'table', title: 'Operating portfolio by brand and model (30-Jun-2026)', head: ['Brand', 'Hotels', 'Keys', 'Positioning'], rows: [
      ...PF.byBrandJun26.map(([br, h, k]) => [br, n0(h), n0(k), { Taj: 'Luxury palaces, resorts, city hotels', 'Claridges Collection': 'Heritage luxury', Gateway: 'Upscale (relaunched brand)', SeleQtions: 'Named upscale hotels with their own identity', Vivanta: 'Upscale city and resort', Ginger: 'Midscale and economy (lean-luxe)', 'Tree of Life': 'Boutique leisure', Atmantan: 'Integrated wellness (51%)', Brij: 'Experiential boutique (51%)' }[br] || '']),
      { hl: true, cells: ['**Total**', `**${n0(PF.jun26.operatingHotels)}**`, `**${n0(PF.jun26.operatingKeys)}**`, `Pipeline: ${n0(PF.jun26.pipelineHotels)} hotels, ${n0(PF.jun26.pipelineKeys)} keys`] },
    ], source: 'Q1FY27 deck slides 34-35; ama (382 bungalows) not included' } },
    { pair: [
      { type: 'hbar', title: 'Q1FY27 revenue growth: IHCL among the faster large chains', unit: 'Consolidated revenue growth, Jun-2026 quarter, year on year (%)', x: IND.map(X.shortName), series: [{ name: 'Growth', values: IND.map(q1g), fmt: 'pct' }], labels: 'all', highlight: 'IHCL', source: 'Screener.in quarterly results (Chalet Q1FY26 included residential flat sales, so its growth is negative)' },
      { type: 'hbar', title: 'FY26 EBITDA margin: IHCL lower because of TajSATS and leases', unit: 'Operating EBITDA margin, FY26 (%)', x: IND.map(X.shortName), series: [{ name: 'Margin', values: IND.map(margin26), fmt: 'pct' }], labels: 'all', highlight: 'IHCL', source: 'Screener.in (consolidated)' },
    ] },
    { callout: '**Why the mix matters for investors:** the owned hotels are where the value and the capital sit (they make most of the EBITDA and need ₹1,000-1,300 cr of capex a year); the managed hotels and brands are where the growth sits (81% of the pipeline) and they need almost no capital. Air catering is a different, lower-margin business that came with the 2024 TajSATS consolidation. A single group multiple blurs all three; the street and we value them inside one EV/EBITDA, with TajSATS and minorities treated separately.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a loss-making owner of trophy hotels to a cash-rich, increasingly asset-light group',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event'], wide: [1], rows: C.history.map(h => [h[0], h[1]]), source: C.historySrc } },
    { callout: `**Corporate actions and per-share data:** shares rose from ~118.9 cr to 142.0 cr in FY22 (1-for-9 rights issue at ₹150 in Nov-Dec 2021; ₹2,000 cr QIP in Mar-2022); 142.34 cr today, no split or bonus since. Our multiple history uses the share count at each date. Screener's consolidated "Net Profit" is before minorities (FY26 ₹2,247 cr) while EPS is after them, so the engine would infer 153.5 cr shares; INDHOTEL.patch.js replaces the row with profit attributable to owners (₹2,084 cr), which restores 142.35 cr. The Oriental Hotels merger would add ~2.32 cr shares (net, ~1.6%) in FY28; it is not in our share count.` },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Demand ahead of supply for a fourth year, but growth is slowing and the 2026 travel shock hit the sector\'s valuation',
  blocks: [
    { p: `Branded hotel rooms in India are scarce relative to demand: in key cities branded supply grows ~5% a year (FY25-27; Delhi ~5%, Mumbai 5%, Bengaluru 6%, Goa nil), while ICRA expected premium-hotel demand to grow 8-10% a year over FY25-28 against 5-6% supply. That gap has let hotels push room rates up for four years. But growth is slowing from the post-Covid rebound: ICRA (29-Sep-2026) expects premium-hotel revenue to grow ${IN.icraSep26.fy27RevGrowth} in FY27 after ${IN.icraSep26.fy26RevGrowthPct}% in FY26, with occupancy of ${IN.icraSep26.fy27OccPct} and average room rates of ${IN.icraSep26.fy27Arr}. The 2026 West Asia conflict cut flights and lifted fuel costs, hitting inbound travel, long-haul corridors and airline catering; domestic leisure and weddings held up (HVS Anarock: June-2026 RevPAR +17-19% on a weak base; Q2 CY26 +11-13%).` },
    { exhibit: { type: 'table', title: 'Forces acting on IHCL\'s market (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for IHCL'], wide: [2], rows: [
      ['Branded supply in key cities (~5% a year)', 'Positive', 'Keeps occupancy at 76-82% and rate growth of 7-9%; IHCL\'s owned hotels sit in the tightest city centres.'],
      ['Domestic leisure, weddings, MICE', 'Positive', 'Standalone RevPAR +14% in Q1FY27; 40+ wedding dates in the rest of FY27; BRICS 2026 (Sep-2026, Delhi), Vibrant Gujarat and Aero India add MICE demand.'],
      ['Inbound and long-haul travel (West Asia conflict)', 'Negative in 2026', 'Q4FY26 revenue hit ₹40-45 cr; Dubai, Sri Lanka and Maldives fees weaker; TajSATS +3% in Q1.'],
      ['Signings boom (28,268 keys in H1 CY26, +8%)', 'Mixed', 'Good for fee pipelines; but openings lag (6,269 keys, −9%) and competition for owners lowers fee terms.'],
      ['Midscale branding of independent hotels', 'Positive', 'Ginger (ANK/Pride conversions) and Gateway can grow fast with little capital.'],
      ['Industry growth slowing to 7-9% (ICRA)', 'Negative', 'Like-for-like growth normalises; the sector\'s valuation re-priced in 2026.'],
    ], source: 'ICRA (29-Sep-2026); HVS Anarock Monitor (Jul-2026); Horwath HTL via the Q4FY26 deck; company calls' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: IHCL captures the rate cycle and the branding of mid-market hotels; travel shocks still pass straight through',
  blocks: [
    { verdicts: [
      ['Rising room rates in key cities', 'Yes', `Consolidated like-for-like RevPAR +9% in FY26 (₹11,750); domestic RevPAR +${Q1.domesticRevparGrowthPct}% in Q1FY27; standalone occupancy ${Q1.standaloneOccupancyPct}%.`, 'Most of the hotel margin gain since FY23.'],
      ['Branded share gain (independents joining chains)', 'Yes', 'Managed rooms 13,400 → 15,500 (full service) and 1,500 → 4,700 (select service) in a year; 20 signings in Q1.', 'Fee income +22% in FY26, +26% in Q1FY27.'],
      ['Weddings and MICE', 'Yes', 'Banquet-led F&B: ₹2,829 cr in FY26 (+9%); 70+ wedding dates guided for FY27.', 'F&B grows slower than rooms but adds scale.'],
      ['Outbound / diaspora travel', 'Partly', `International portfolio revenue ₹1,725 cr (+14%) and EBITDA ₹250 cr in FY26; St James Court margin fell to 22% in Q1FY27.`, 'Low margins at The Pierre (UOH EBITDA 7.7%).'],
      ['Air traffic growth', 'Headwind in 2026', `TajSATS revenue +${3}% in Q1FY27, margin ${Q1.acOpMarginPct}% (Noida kitchen start-up, West Asia).`, 'Air catering lags the hotels this year.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: 'Company decks and calls (May-Jul 2026)' },
  ],
};

module.exports = { business, history, industry, tailwind };
