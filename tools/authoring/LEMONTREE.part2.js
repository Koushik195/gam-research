// Lemon Tree report, part 2: business, history, industry, tailwind test.
const fs = require('fs');
const path = require('path');
const X = require('./LEMONTREE.ctx');
const { C, ROOT, n0, n1, Q1, FY26 } = X;
const PF = C.portfolio, IN = C.industry, K = C.kpis.FY26;

// Peer growth from each company's Screener file: Jun-2026 quarter YoY and FY26 operating margin.
const scr = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables;
const q1g = sym => { const q = scr(sym).quarters, r = q.rows.Sales, i = q.periods.indexOf('Jun 2026'), j = q.periods.indexOf('Jun 2025'); return i >= 0 && j >= 0 ? Math.round((r[i] / r[j] - 1) * 1000) / 10 : null; };
const margin26 = sym => { const t = scr(sym)['profit-loss'], i = t.periods.indexOf('Mar 2026'); return Math.round(t.rows['Operating Profit'][i] / t.rows.Sales[i] * 1000) / 10; };
const IND = ['LEMONTREE', 'INDHOTEL', 'EIHOTEL', 'ITCHOTELS', 'CHALET'];
const BR = [['Aurika Hotels & Resorts', 'Upscale', 808, 2, 1373, 8], ['Lemon Tree Premier', 'Upper midscale', 2963, 23, 1569, 13], ['Lemon Tree Hotels', 'Midscale', 5362, 75, 6014, 79], ['Red Fox by Lemon Tree', 'Economy', 1003, 9, 50, 1], ['Keys (Prima, Select, Lite)', 'Midscale / economy', 1810, 26, 2429, 43]];

const business = {
  id: 'business', nav: 'What Lemon Tree does', kicker: 'The business', title: 'A mid-market hotel owner that is turning itself into a hotel manager: 5,759 owned rooms, 6,187 managed, 11,435 signed',
  blocks: [
    { p: `Lemon Tree makes money in two ways. **Owned and leased hotels** (${PF.owned.hotels} hotels, ${n0(PF.owned.rooms)} rooms at Jun-2026, ${PF.owned.leasedHotels} of them leased) keep all their revenue and costs; they produced ~95% of FY26 revenue (₹${n0(1370.6)} cr of ₹${n0(FY26.revenueOp)} cr). Most of these hotels, including Aurika Mumbai Skycity, sit in **Fleur Hotels**, a subsidiary that Lemon Tree owns 58.91% of; Warburg Pincus bought the other 41.09% from APG in May-2026. **Managed and franchised hotels** (${PF.managed.hotels} hotels, ${n0(PF.managed.rooms)} rooms) belong to other owners, who pay Lemon Tree fees for the brand, distribution, loyalty programme and management: ₹${n1(C.kpis.FY26.fees3p)} cr in FY26 (+23%) and ₹${Q1.fees3p} cr in Q1FY27 (+42%). Fleur also pays Lemon Tree fees (₹${n1(C.kpis.FY26.feesFleur)} cr in FY26), but these cancel out in the consolidated accounts.` },
    { p: `The brands span the middle of the market: Aurika (upscale; Udaipur and Mumbai), Lemon Tree Premier (upper midscale), Lemon Tree Hotels (midscale), Red Fox (economy) and Keys (Prima, Select, Lite), in 80+ cities, plus Dubai, Bhutan and Nepal. Owned-hotel occupancy was ${K.occPct}% in FY26 and ARR ₹${n0(K.arr)}, both records. The company reports one segment, so the profit split between owned hotels and fees is visible only in the pro-forma accounts of the planned split (Lemon Tree: FY26 revenue ₹${C.proforma.fy26.lthRevenue} cr, EBITDA ₹${C.proforma.fy26.lthEbitda} cr; Fleur: ₹${n0(C.proforma.fy26.fleurRevenue)} cr and ₹${C.proforma.fy26.fleurEbitda} cr).` },
    { exhibit: { type: 'table', title: 'The portfolio by brand (30-Jun-2026; owned, leased, managed and franchised)', head: ['Brand', 'Segment', 'Operating rooms', 'Hotels', 'Pipeline rooms', 'Pipeline hotels'], rows: [
      ...BR.map(r => [r[0], r[1], n0(r[2]), String(r[3]), n0(r[4]), String(r[5])]),
      { hl: true, cells: ['**Total**', '', `**${n0(PF.operational.rooms)}**`, `**${PF.operational.hotels}**`, `**${n0(PF.pipeline.rooms)}**`, `**${PF.pipeline.hotels}**`] },
    ], source: 'Q1FY27 deck slides 43-45 (the pipeline is almost all managed and franchised: 10,561 rooms; owned/leased 874)' } },
    { pair: [
      { type: 'hbar', title: 'Q1FY27 revenue growth: Lemon Tree in the middle of the pack', unit: 'Consolidated revenue growth, Jun-2026 quarter, year on year (%)', x: IND.map(X.shortName), series: [{ name: 'Growth', values: IND.map(q1g), fmt: 'pct' }], labels: 'all', highlight: 'Lemon Tree', source: 'Screener.in quarterly results (Chalet Q1FY26 included residential flat sales)' },
      { type: 'hbar', title: 'FY26 EBITDA margin: Lemon Tree the highest of the listed hotel groups', unit: 'Operating EBITDA margin, FY26 (%)', x: IND.map(X.shortName), series: [{ name: 'Margin', values: IND.map(margin26), fmt: 'pct' }], labels: 'all', highlight: 'Lemon Tree', source: 'Screener.in (consolidated)' },
    ] },
    { callout: '**Why the model matters:** a mid-market hotel is cheap to build and run (no ballrooms, few restaurants), so Lemon Tree\'s owned hotels earn hotel-level EBITDAR margins of ~45-60% (52% for all owned hotels in Q1FY27) at daily rates of only ₹4,100-9,200. But owning means debt and slow growth. The fee business needs almost no capital and should earn 75-80% margins at scale, which is why the company wants to separate the two: Lemon Tree as the manager, Fleur as the owner.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From one 49-room hotel in 2004 to India\'s largest mid-market chain; now splitting into a manager and an owner',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event'], wide: [1], rows: C.history.map(h => [h[0], h[1]]), source: C.historySrc } },
    { callout: '**Corporate actions and per-share data:** 79.22 cr shares of ₹10 (equity capital ₹792 cr) with no split, bonus or new issue inside our valuation window; an ESOP trust holds ~0.04 cr. Screener\'s consolidated "Net Profit" is before minorities (FY26 ₹288 cr) while EPS is after them, so the engine would infer ~100 cr shares; LEMONTREE.patch.js replaces the row with profit attributable to owners (₹227 cr), which restores 79.09 cr (0.2% from the actual count). The scheme (Lemon Tree holders get 20 Fleur shares for every 311 Lemon Tree shares) changes nothing in Lemon Tree\'s share count.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Demand still ahead of supply, but FY27 slowed: the West Asia shock hit corporate travel and the GST change hit mid-market rooms',
  blocks: [
    { p: `Indian hotel demand has outgrown branded supply for four years, and Lemon Tree argues the mid-market, especially in tier-2 and tier-3 cities, is where branded supply is thinnest; its own hotels run at 73-79% occupancy. ICRA (${X.shortDate(IN.icraSep26.published)}) expects premium-hotel revenue to grow ${IN.icraSep26.fy27RevGrowth} in FY27 after ${IN.icraSep26.fy26RevGrowthPct}% in FY26, with occupancy ${IN.icraSep26.fy27OccPct}. Two things went against Lemon Tree's segment in 2026. First, the West Asia conflict cut inbound travel and, "as a second-order effect", corporate trips: large companies told their managers to use video calls. Second, the GST change: rooms sold below ₹7,500 a night lost input-tax credit, which cost Lemon Tree 2.3% of revenue in Q1FY27. The Executive Chairman argues the cycle has not peaked: India's occupancy is "still mid-60s", while an up-cycle starts at 70-72%.` },
    { exhibit: { type: 'table', title: 'Forces acting on Lemon Tree\'s market (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Lemon Tree'], wide: [2], rows: [
      ['Branded mid-market supply short in tier-2/3 cities', 'Positive', 'Owners sign management contracts: 4,912 rooms signed in FY26, 1,020 in Q1FY27.'],
      ['Corporate travel (West Asia conflict, cost cutting)', 'Negative in 2026', 'Q1FY27 ARR +2%; occupancy held up by retail channels at lower net rates; Mumbai and Gurugram soft.'],
      ['GST: no input credit on rooms below ₹7,500', 'Negative', '~2% of revenue in FY27; falls as more rooms sell above ₹7,500 (Aurika, renovated hotels).'],
      ['New supply near Mumbai airport (~2,000 rooms in two years)', 'Negative, temporary', 'Aurika Mumbai and the airport hotels; management expects the market to absorb it.'],
      ['Weddings, MICE, temple and short-haul leisure travel', 'Positive', '40+ wedding dates and BRICS events in H2FY27 (ICICI Direct); Nepal and Dubai expansion.'],
      ['Industry growth slowing to 7-9% (ICRA)', 'Negative', 'Rate growth normalises; hotel stocks re-priced in 2026.'],
    ], source: 'ICRA (29-Sep-2026); Q1FY27 call (10-Aug-2026); Q1FY27 deck; ICICI Direct (11-Aug-2026)' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Lemon Tree captures the branding boom better than anyone in its segment; it captures the rate cycle less than the luxury names',
  blocks: [
    { verdicts: [
      ['Owners branding their hotels (management contracts)', 'Yes', `Third-party fees ₹${n1(C.kpis.FY26.fees3p)} cr in FY26 (+23%), +${Math.round((Q1.fees3p / Q1.fees3pPy - 1) * 100)}% in Q1FY27; ${n0(PF.pipeline.rooms)} pipeline rooms vs ${n0(PF.managed.rooms)} managed today.`, 'The fastest-growing and highest-margin part of the business.'],
      ['Rising room rates', 'Partly', `ARR +${Math.round((K.arr / C.kpis.FY25.arr - 1) * 100)}% in FY26 but +${Math.round((Q1.arr / Q1.arrPy - 1) * 100)}% in Q1FY27; mid-market rates follow local supply and corporate budgets.`, 'Less pricing power than luxury (EIH, IHCL).'],
      ['Tier-2/3 and leisure travel', 'Yes', 'Keys RevPAR +19% in Q1FY27 after renovation; most new signings are in smaller cities and leisure towns (Srinagar, Igatpuri, Kumbakonam, Nepal).', 'Lower fees per room in small towns.'],
      ['Corporate and inbound travel', 'Headwind in 2026', 'Corporate demand fell in Q1FY27; Mumbai and Gurugram RevPAR −1% and −3%.', 'Lemon Tree is more exposed to corporate guests than leisure-led peers.'],
      ['Capital for growth (private equity in hotel ownership)', 'Yes, via Fleur', 'Warburg Pincus: 41.09% of Fleur and up to ₹960 cr of new equity.', 'Growth capital without diluting Lemon Tree shareholders, at the cost of a larger minority.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: 'Company decks and calls (Jan-Aug 2026); AR FY26' },
  ],
};

module.exports = { business, history, industry, tailwind };
