// Indian Oil report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./IOC.ctx');
const { C, D, A26, n0, n1 } = X;
const BU = C.business, RP = BU.revenueByProductFY26, rpTot = Object.values(RP).filter(v => typeof v === 'number').reduce((s, v) => s + v, 0);

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'India\'s largest refiner, pipeline owner and fuel retailer, majority-owned by the state',
  blocks: [
    { p: `Indian Oil Corporation (IndianOil) is a Maharatna public-sector company: the Government owns 51.5% and two other state companies (ONGC and Oil India) a further 19.4%. It runs ${BU.refineries} refineries including Chennai Petroleum (51.89%), with ${BU.refiningCapacityGroup} MMTPA of capacity (~31% of India's ${BU.indiaCapacity} MMTPA), moves crude and products through >20,000 km of pipelines (5,300 km crude, 13,300 km products, 1,300 km gas) and sells through ${n0(BU.retailOutlets['Jun-26'])} fuel stations, LPG distributors and aviation stations. In FY26 it sold ${BU.volumesFY26.salesTotal} MMT of products, 42% of India's petroleum sales (54% of jet fuel, 46% of LPG).` },
    { exhibit: { type: 'table', title: 'Four reported segments, FY26 (consolidated)', head: ['Segment', 'What it is', 'Revenue (₹ cr, net)', 'EBITDA (₹ cr)', 'Capital employed (₹ cr)'], wide: [1], rows: [
      ['Petroleum products', 'Refining (10 refineries), pipelines, marketing of petrol, diesel, LPG, jet fuel, lubricants (Servo), bitumen, exports', n0(A26.petRev), n0(A26.petEbitda), n0(BU.segmentsFY26.petroleumCapEmployed)],
      ['Petrochemicals', 'Polymers (PP, PE), PX, PTA, LAB, glycols from Panipat, Paradip and Gujarat', n0(A26.pcRev), n0(A26.pcEbitda), n0(BU.segmentsFY26.petchemCapEmployed)],
      ['Gas', 'Natural gas and LNG trading, city gas distribution (7.3 MMT sold)', n0(A26.gasRev), n0(A26.gasEbitda), n0(BU.segmentsFY26.gasCapEmployed)],
      ['Other business', 'Oil & gas exploration, explosives, cryogenics, wind and solar', n0(A26.othRev), n0(A26.othEbitda), n0(BU.segmentsFY26.otherCapEmployed)],
    ], source: 'AR FY26 consolidated note 39. Revenue net of excise (all excise allocated to petroleum products); EBITDA = segment result before exchange differences + segment depreciation.' } },
    { pair: [
      { type: 'donut', title: 'FY26 revenue: diesel 44%, petrol 23%, LPG 12%', unit: '% of external revenue (incl. excise)', x: ['Diesel (HSD)', 'Petrol (MS)', 'LPG', 'Jet fuel (ATF)', 'Others'], series: [{ name: 'Share', values: [RP.HSD, RP.MS, RP.LPG, RP.ATF, RP.Others].map(v => Math.round(v / rpTot * 1000) / 10), fmt: 'pct' }], source: 'AR FY26 consolidated note 39' },
      { type: 'donut', title: '95% of FY26 segment EBITDA came from petroleum products', unit: '% of segment EBITDA', x: ['Petroleum products', 'Petrochemicals', 'Gas', 'Other'], series: [{ name: 'Share', values: [A26.petEbitda, A26.pcEbitda, A26.gasEbitda, A26.othEbitda].map(v => Math.round(v / (A26.petEbitda + A26.pcEbitda + A26.gasEbitda + A26.othEbitda) * 1000) / 10), fmt: 'pct' }], source: 'AR FY26 consolidated note 39; GAM' },
    ] },
    { p: 'Two things make IOC different from a private refiner. First, it is integrated end to end: it refines ~75 MMT itself, buys the rest of what it sells from CPCL, other refiners and imports, and carries most of it by its own pipelines. Second, its retail prices for petrol, diesel and household LPG are, in practice, decided with the Government. When crude spikes the state can ask the three PSU marketers (IOC, BPCL, HPCL) to hold prices and absorb the loss, and compensates them later, partly or not at all. Petroleum products are therefore one business with two very different margin pools: a refining margin set by global cracks and a marketing margin set in Delhi. IOC does not report them separately.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Sixty years of building India\'s fuel system: the events that shaped the numbers',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [2], rows: [
      ['1-Sep-1964', 'Indian Oil Corporation formed by merging Indian Refineries Ltd with Indian Oil Company (1959)', 'State-owned refiner and marketer from the start'],
      ['2016-17, 2018', 'Two 1:1 bonus issues; buyback in FY19', 'Share count rebased; Screener history adjusted'],
      ['Jun/Jul-2022', '1:2 bonus: 941 cr → 1,412 cr shares', 'EPS history restated ×2/3; 34.97 cr shares sit in the IOC Shares Trust (treasury)'],
      ['FY23', 'Ukraine war: crude above US$100, retail prices frozen', 'EBITDA ₹30,683 cr; profit to owners ₹9,792 cr'],
      ['FY24', 'Crude eased while prices stayed', 'Record EBITDA ₹75,650 cr; profit ₹41,730 cr'],
      ['FY25', 'Refining cracks collapsed (GRM US$4.80/bbl)', 'EBITDA ₹36,040 cr; profit ₹13,598 cr'],
      ['Oct-2025', 'MoPNG approves ₹14,486 cr LPG compensation, paid monthly from Nov-2025', '₹6,036 cr recognised in FY26; ₹3,622 cr in Q1FY27'],
      ['FY26', 'Record throughput 75.5 MMT, sales 105.1 MMT; rupee −11%', 'EBITDA ₹77,108 cr, profit ₹42,096 cr; FX losses ~₹8,300 cr'],
      ['End-Feb 2026 onward', 'US-Iran war; Hormuz disrupted; SAED cut ₹10/litre (27-Mar); export duties back', 'Q1FY27 consolidated loss ₹1,631 cr to owners; borrowings +₹31,000 cr'],
      ['28-Mar-2026', 'Audit Committee discontinued (no independent directors on the board)', 'Results approved by the full board'],
      ['Nov-Dec 2026 (planned)', 'Gujarat, Panipat, Barauni expansions and PX-PTA commissioned', 'Group capacity 80.75 → ~98 MMTPA by FY28'],
    ], source: 'AR FY22/FY24/FY26; Q4FY26 and Q1FY27 calls; Q1FY27 results notes; businesstoday.in (27-Mar-2026)' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A growing fuel market with administered prices, hit by the 2026 Gulf war',
  blocks: [
    { p: `${D.industry.capacity} ${D.industry.demand} India imports most of its crude (and much of its LPG and LNG), so the rupee and the Gulf matter as much as demand.` },
    { p: D.industry.war2026 },
    { p: D.industry.pricing },
    { exhibit: { type: 'table', title: 'Who\'s who in Indian refining and marketing', head: ['Company', 'Owner', 'Role', 'Note'], wide: [3], rows: [
      ['Indian Oil (incl. CPCL)', 'Government 51.5%', 'Refining, pipelines, marketing, petchem, gas', 'Largest in each; ~42% of petroleum sales'],
      ['BPCL', 'Government', 'Refining and marketing', 'Peer OMC; prices move together with IOC'],
      ['HPCL', 'ONGC (majority)', 'Marketing-heavy; buys much of its product', 'Most exposed to marketing losses'],
      ['MRPL', 'ONGC / HPCL', 'Standalone refiner', 'Pure refining-margin exposure'],
      ['Reliance, Nayara', 'Private', 'Export-oriented refiners with smaller retail arms', 'Sell at market prices; gain share when PSU prices are held'],
    ], source: 'AR FY26; company filings; GAM' } },
    { callout: '**So what:** demand growth (3-5% a year) is not the issue for IOC; who bears the cost of high crude is. In 2022 and again in 2026 the answer was the PSU marketers first and the Government later. The industry structure protects IOC\'s volumes and network, not its margins.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Do India\'s energy tailwinds reach IOC\'s shareholders? Volumes yes, margins only sometimes',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Evidence it reaches IOC', 'Verdict'], wide: [1], rows: [
      ['Fuel demand growth', 'Domestic petroleum sales 84.96 → 88.97 MMT in FY26 (+4.7%), ahead of the market (+2%); 2,597 new fuel stations in FY26', 'Reaches it (volume)'],
      ['High global refining margins after the war', 'Pre-SAED GRM US$36/bbl in Q1FY27, but US$15.6 after the export duty; product prices at home held', 'Partly: the state taxes or caps the windfall'],
      ['Lower crude (when it comes)', 'FY24: crude down, prices held → ₹8,320/t EBITDA', 'Reaches it, if prices are not cut'],
      ['Refining capacity expansion', '~17 MMTPA (+21%) by Dec-2026; throughput 77 → 85 → 90 MMT', 'Reaches it from FY28 (ramp 60/80/100%)'],
      ['Petrochemical demand', 'PX-PTA, PBR; petchem intensity 6.5% → 15% planned', 'Uncertain: FY23-25 EBITDA margins 2-3%'],
      ['Energy transition (EVs, gas, renewables)', 'Ethanol 20% blend; 31 GW renewables by 2030 planned; EVs cap long-run petrol demand', 'Mostly a cost (capex) for now'],
    ], source: 'AR FY26; Q4FY26 and Q1FY27 calls; GAM' } },
  ],
};

module.exports = { business, history, industry, tailwind };
