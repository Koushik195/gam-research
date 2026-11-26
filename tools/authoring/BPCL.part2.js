// Bharat Petroleum report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./BPCL.ctx');
const { C, D, A26, n0, n1 } = X;
const BU = C.business, OP = X.SG.operating;

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'India\'s third-largest refiner and second-largest fuel marketer, majority-owned by the state',
  blocks: [
    { p: `Bharat Petroleum Corporation (BPCL) is a Maharatna public-sector company: the Government owns 52.98%. It runs three refineries with ${BU.refiningCapacity} MMTPA of capacity (Mumbai ${BU.refineries.Mumbai}, Kochi ${BU.refineries.Kochi}, Bina ${BU.refineries.Bina}; ~${BU.indiaRefiningShare}% of India) that processed 41.15 MMT in FY26 (116% utilisation), ${n0(BU.pipelinesKm)} km of pipelines, and sells through ${n0(BU.retailOutlets)} fuel stations, ${n0(BU.lpgDistributors)} LPG distributors, ${n0(BU.cngOutlets)} CNG outlets and ${BU.aviationStations} aviation stations (Jun-2026). In FY26 it sold ${BU.domesticSalesFY26} MMT in India, ${BU.psuMarketShareFY26}% of PSU sales (petrol ${BU.retailShareMar26.MS}%, diesel ${BU.retailShareMar26.HSD}% of PSU retail). Its upstream arm BPRL holds stakes in 15 blocks in six countries, including 10% of Mozambique LNG Area 1 and 40% of Brazil's BM-SEAL-11.` },
    { exhibit: { type: 'table', title: 'Two reported segments, FY26 (consolidated)', head: ['Segment', 'What it is', 'Revenue (₹ cr, net)', 'EBITDA (₹ cr)', 'Assets (₹ cr)'], wide: [1], rows: [
      ['Downstream petroleum', 'Refining (Mumbai, Kochi, Bina), pipelines, marketing of petrol, diesel, LPG, jet fuel, lubricants (MAK), gas and CGD, petrochemicals (Kochi PDPP), exports', n0(A26.dsRev), n0(A26.dsEbitda), '1,86,913'],
      ['Exploration & production (BPRL)', 'Mozambique LNG (10%), Brazil BM-SEAL-11 (40% via IBV), Russian fields (Vankor, Taas), Lower Zakum (UAE), small Indian blocks', n0(A26.epRev), n0(A26.epEbitda), '33,101'],
    ], source: 'AR FY26 consolidated note 59. Revenue net of excise (all excise allocated to downstream); EBITDA = segment result + segment depreciation.' } },
    { pair: [
      { type: 'donut', title: 'FY26 domestic sales: diesel 43%, petrol 21%, LPG 17%', unit: '% of domestic sales volume (MMT)', x: ['Diesel (HSD)', 'Petrol (MS)', 'LPG', 'Jet fuel (ATF)', 'Others'], series: [{ name: 'Share', values: [OP.FY26.hsd, OP.FY26.ms, OP.FY26.lpg, 2.19, OP.FY26.domSales - OP.FY26.hsd - OP.FY26.ms - OP.FY26.lpg - 2.19].map(v => Math.round(v / OP.FY26.domSales * 1000) / 10), fmt: 'pct' }], source: 'BPCL Q1FY27 handout (FY26 column)' },
      { type: 'column', title: 'Refinery throughput: 33 → 41 MMT in five years', unit: 'Refinery throughput (MMT)', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Throughput', values: C.annualKpis.map(k => k.throughput), fmt: 'n1' }], labels: 'all', source: 'BPCL July-2026 presentation (p27); Bina included at BPCL\'s share until Jun-2021' },
    ] },
    { p: 'Two things make BPCL different from a private refiner. First, it is short of its own product: it refines ~41 MMT but sells ~56 MMT, so ~20% of what it sells is bought from other refiners and imports. Second, its retail prices for petrol, diesel and household LPG are, in practice, decided with the Government. When crude spikes the state can ask the three PSU marketers (IOC, BPCL, HPCL) to hold prices and absorb the loss, and compensates them later, partly or not at all. Downstream is therefore one business with two margin pools: a refining margin set by global cracks and a marketing margin set in Delhi. BPCL does not report them separately.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From Burmah Shell to Maharatna: the events that shaped the numbers',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [2], rows: [
      ['1976', 'Burmah Shell\'s Indian business nationalised (Mumbai refinery 1955)', 'State-owned refiner and marketer'],
      ['2006-07', 'Kochi Refineries merged; its BPCL shares go to a trust', '6.59 cr treasury shares today (1.52%); EPS on 427.26 cr shares'],
      ['FY17, FY18', 'Bonus issues (1:1, then 1:2)', 'Share count rebased; Screener history adjusted'],
      ['Mar-2021', 'Numaligarh Refinery stake divested (marketing rights kept)', 'FY21 profit includes a ₹3,783 cr after-tax exceptional gain (Screener)'],
      ['2021 / Jul-2022', 'Bina refinery (BORL) bought out, then merged into BPCL', 'Bina\'s 7.8 MMTPA fully consolidated; no minorities since'],
      ['FY23', 'Ukraine war: crude above US$100, retail prices frozen', `EBITDA ₹10,899 cr; profit ₹2,131 cr`],
      ['FY24', 'Crude eased while prices stayed; GRM US$14.1', 'Record EBITDA ₹44,082 cr; profit ₹26,859 cr'],
      ['Jun-2024', '1:1 bonus: 216.9 cr → 433.85 cr shares', 'EPS history halved'],
      ['FY25-FY26', 'Brazil upstream impaired (₹1,774 cr, then ₹4,349 cr standalone)', 'Standalone PAT FY26 ₹23,303 cr vs consolidated ₹25,843 cr'],
      ['Oct-2025', 'MoPNG approves ₹7,594 cr LPG compensation, paid monthly from Nov-2025', '₹1,898 cr recognised in Q1FY27; ends Oct-2026'],
      ['End-Feb 2026 onward', 'US-Iran war; Hormuz disrupted; SAED cut ₹10/litre (27-Mar); export duties back', 'Q1FY27 consolidated loss ₹1,873 cr; standalone debt +₹6,900 cr'],
      ['Mar-2026', 'Independent directors\' terms end; Audit Committee lapses (27-Mar)', 'Results approved by the full board'],
      ['Q1FY27', 'IBV Brasil becomes 100% owned by BPRL', '₹1,885 cr one-off FCTR gain in Q1 consolidated profit'],
    ], source: 'AR FY22/FY24/FY26; July-2026 presentation; Q4FY26 call; Q1FY27 results coverage; Screener.in' } },
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
      ['BPCL', 'Government 52.98%', 'Refining (35.3 MMTPA) and marketing', 'Short of product: buys ~20% of what it sells'],
      ['HPCL', 'ONGC (majority)', 'Marketing-heavy; buys much of its product', 'Most exposed to marketing losses'],
      ['MRPL', 'ONGC / HPCL', 'Standalone refiner', 'Pure refining-margin exposure'],
      ['Reliance, Nayara', 'Private', 'Export-oriented refiners with smaller retail arms', 'Sell at market prices; gain share when PSU prices are held'],
    ], source: 'AR FY26; company filings; GAM' } },
    { callout: '**So what:** demand growth (~3% a year) is not the issue for BPCL; who bears the cost of high crude is. In 2022 and again in 2026 the answer was the PSU marketers first and the Government later. The structure protects BPCL\'s volumes and network, not its margins.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Do India\'s energy tailwinds reach BPCL\'s shareholders? Volumes yes, margins only sometimes',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Evidence it reaches BPCL', 'Verdict'], wide: [1], rows: [
      ['Fuel demand growth', `Domestic sales 52.4 → ${BU.domesticSalesFY26} MMT in FY26 (+3.5%); 1,691 new fuel stations in FY26; throughput per outlet ${BU.throughputPerOutletKlpm.Q1FY27} KL/month in Q1FY27`, 'Reaches it (volume)'],
      ['High global refining margins after the war', `Q1FY27 GRM US$41.4/bbl before SAED, US$17.0 after; Bina US$56`, 'Partly: the state taxes the windfall with export duties'],
      ['Lower crude (when it comes)', 'FY24: crude down, prices held → ₹8,640/t EBITDA', 'Reaches it, if prices are not cut'],
      ['Refining and petchem expansion', 'Bina 7.8 → 11 MMTPA + 2.2 MMTPA petchem (2028); Kochi PP 400 KTPA; Mumbai PRFCC (2029)', 'From FY29; petchem returns uncertain'],
      ['Gas and CGD', `Gas sales ${BU.gasSalesFY26} MMT in FY26 (+26.5%); 52 GAs incl. JVs; CGD JVs earned ~₹2,000 cr in FY26`, 'Small but growing'],
      ['Energy transition (EVs, ethanol, renewables)', `Ethanol blending 19.87%; ${BU.renewablesMw} MW of renewables; ~6,800 EV charging stations`, 'Mostly a cost (capex) for now'],
    ], source: 'July-2026 presentation; Q4FY26 call; Q1FY27 handout; GAM' } },
  ],
};

module.exports = { business, history, industry, tailwind };
