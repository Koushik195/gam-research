// HPCL report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./HINDPETRO.ctx');
const { C, D, n0, n1 } = X;
const BU = C.business, F26 = BU.fy26, INV = C.investments;

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'A fuel and LPG marketer with two refineries, three JV refineries and an ONGC parent',
  blocks: [
    { p: `Hindustan Petroleum Corporation (HPCL) is a Maharatna public-sector company controlled by ONGC (54.90%), which is itself controlled by the Government. It owns two refineries, Mumbai (9.5 MMTPA) and Visakhapatnam (15 MMTPA after its modernisation), which processed a record ${F26.throughput} MMT in FY26 (${F26.utilisation}% utilisation; GRM US$${F26.grm}/bbl). It sold ${F26.marketSales} MMT through ${n0(F26.retailOutlets)} fuel stations (${n0(F26.newOutlets)} added in FY26), ${n0(F26.lpgDistributors)} LPG distributors (${F26.lpgSales} MMT of LPG, India's second-largest LPG marketer), aviation (${F26.aviation} MMT), lubricants (${F26.lubesTmt} TMT) and direct sales to industry (${F26.directSales} MMT), and moved ${F26.pipeline} MMT through its pipelines.` },
    { exhibit: { type: 'table', title: 'Refining capacity HPCL owns or markets from (MMTPA)', head: ['Refinery', 'HPCL stake', 'Capacity', 'How it reaches HPCL\'s numbers'], wide: [3], rows: [
      ['Mumbai', '100%', '9.5', 'Consolidated EBITDA; 10.0 MMT run in FY26'],
      ['Visakhapatnam', '100%', '15.0', 'Consolidated EBITDA; 16.04 MMT in FY26; residue upgrade (3.55 MMTPA) from Dec-2025'],
      ['HPCL-Mittal Energy (Bathinda)', '48.99%', '11.3', `Equity-accounted (book ₹${n0(INV.hmel.carrying)} cr); HPCL bought ₹${n0(INV.hmel.purchasesFromHmelFY26)} cr of product from it in FY26`],
      ['Mangalore Refinery (MRPL)', '16.96%', '15.0', `Listed associate (book ₹${n0(INV.listed[0].carrying)} cr; ${n1(INV.listed[0].shares)} cr shares)`],
      ['HPCL Rajasthan Refinery (Barmer)', '74%', '9.0 + 2.4 petchem', `Joint venture with Rajasthan, equity-accounted (book ₹${n0(INV.hrrl.carrying)} cr + ₹${n0(INV.hrrl.subDebt)} cr loan); commercial operation from end-June/July 2026`],
    ], source: 'AR FY26 (notes 1.3, 6, 61; MD&A); Q1FY27 call via PL and MOSL' } },
    { pair: [
      { type: 'donut', title: 'Petrol and diesel sourcing, Q1FY27: half bought in', unit: '% of HPCL\'s petrol and diesel supply', x: ['Own refineries', 'JV refineries', 'Third parties'], series: [{ name: 'Share', values: [50, 27, 24], fmt: 'pct0' }], source: 'Q1FY27 call (PL, 24-Jul-2026); shares as reported (sum 101 by rounding)' },
      { type: 'donut', title: 'Next year: own ~56%, JVs (mainly HRRL) ~40%', unit: '% of supply (management target)', x: ['Own refineries', 'JV refineries', 'Third parties'], series: [{ name: 'Share', values: [56, 40, 4], fmt: 'pct0' }], source: 'Q1FY27 call (PL, Emkay)' },
    ] },
    { p: 'This mix is the key to HPCL. Refining earns the global crack; marketing earns the gap between the retail price and the refinery-gate price, which in practice is decided with the Government. HPCL markets about twice what it refines, so its profits lean on marketing more than IOC\'s or BPCL\'s. When crude falls and prices are held (FY24) it does very well; when crude spikes and prices are held (FY23, Q1FY27) it loses more than its peers. HRRL changes the mix only partly: its refining margin is earned inside a joint venture and reaches HPCL as a 74% share of profit, while HPCL keeps the marketing of its products.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From ONGC\'s takeover to Barmer: the events that shaped the numbers',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [2], rows: C.corporateActions, source: C.corporateActionsSrc } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A growing fuel market with administered prices, hit again by the 2026 Gulf war',
  blocks: [
    { p: D.industry.structure },
    { p: D.industry.war2026 },
    { p: D.industry.pricing },
    { exhibit: { type: 'table', title: 'Who\'s who in Indian refining and marketing', head: ['Company', 'Owner', 'Role', 'Note'], wide: [3], rows: [
      ['Indian Oil (incl. CPCL)', 'Government 51.5%', 'Largest refiner, pipelines, marketing, petchem', '~31% of India\'s refining, ~42% of sales'],
      ['BPCL', 'Government', 'Refining and marketing', 'Closer to balanced between refining and sales'],
      ['HPCL', 'ONGC 54.9%', 'Marketing-heavy; JV refineries HMEL, MRPL, HRRL', '~26 MMT refined vs ~51 MMT sold'],
      ['MRPL', 'ONGC 71.6%, HPCL 17%', 'Standalone refiner', 'Pure refining-margin exposure'],
      ['Reliance, Nayara', 'Private', 'Export-oriented refiners with smaller retail arms', 'Sell at market prices; gain share when PSU prices are held'],
    ], source: 'AR FY26; IOC and ONGC initiations (GAM); company filings' } },
    { callout: '**So what:** demand growth (3-5% a year) is not HPCL\'s problem; who bears the cost of high crude is. In 2022 and again in 2026 the PSU marketers carried it first and the Government compensated later, partly. For the most marketing-heavy of them, the industry structure protects volumes and the network, not margins.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Do India\'s energy tailwinds reach HPCL\'s shareholders? Volumes yes, margins only sometimes',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Evidence it reaches HPCL', 'Verdict'], wide: [1], rows: [
      ['Fuel demand growth', `Market sales 39.1 → ${F26.marketSales} MMT in FY22-FY26 (+7% a year as Visakh expanded); Q1FY27 petrol +6.9%, diesel +8.7% YoY vs industry +5.8% / +2.8%`, 'Reaches it (volume)'],
      ['High refining margins after the war', 'GRM US$23.8/bbl in Q1FY27 (before export duty) vs US$3.1 a year earlier; but HPCL refines only half of what it sells', 'Partly: the marketing loss was far larger'],
      ['Lower crude (when it comes)', 'FY24: crude down, prices held → ₹5,324/t EBITDA; FY26 ₹5,956/t', 'Reaches it most of the three OMCs, if prices are not cut'],
      ['Own refining growth', 'HRRL 9 MMTPA (74%) from Jul-2026; Vizag residue upgrade; third-party purchases to fall to ~4% next year', 'Reaches it from FY28, via JV profit and lower purchase costs'],
      ['Petrochemicals', 'HRRL 2.4 MMTPA petchem by end-FY27 (26% petchem intensity)', 'Uncertain: Chinese capacity, low margins in FY23-25 at peers'],
      ['Energy transition (EVs, gas, CBG)', 'City gas, LNG terminal at Chhara, CBG plants, EV charging', 'Mostly a cost (capex) for now'],
    ], source: 'AR FY26; Q1FY27 call (PL, Emkay, BOB); GAM' } },
  ],
};

module.exports = { business, history, industry, tailwind };
