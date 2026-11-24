// Olectra Greentech report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./OLECTRA.ctx');
const { C, D, n0, n1, yr, bld } = X;
const I = D.industry, rup = s => String(s).replace(/Rs ?/g, '₹');
const y26 = yr('FY26'), y25 = yr('FY25'), share = k => Math.round(y26[k] / y26.consRev * 100);
const mg = (e, r) => `${n1(e / r * 100)}%`;

const business = {
  id: 'business', nav: 'What Olectra does', kicker: 'The business', title: 'Two businesses: electric buses built with BYD technology, and composite insulators',
  blocks: [
    { p: rup(`Olectra reports two segments. The **Mobility Division** (${share('mobRev')}% of FY26 revenue) builds 7, 9 and 12-metre electric buses, intercity coaches and electric tippers, using batteries, chassis and parts from BYD of China under a technology collaboration, and earns service revenue for maintaining them (₹183 cr in FY26). The **Energy Division** (${share('enRev')}%) makes composite polymer insulators (66 kV to 800 kV transmission, railway, post and distribution insulators) for Power Grid, transmission contractors and export utilities. The company is 50.02% owned by MEIL Holdings, the holding company of the Megha Engineering & Infrastructures (MEIL) group. Its biggest customer is another MEIL company: Evey Trans, which bids for state bus contracts, sets up one project company (SPV) per contract, buys the buses from Olectra and runs them for 10-12 years.`) },
    { exhibit: { type: 'table', title: 'The two segments (FY26)', head: ['Segment', 'What it does', 'Revenue (₹ cr)', 'EBIT (₹ cr)', 'EBIT margin', 'Segment assets (₹ cr)'], wide: [1], rows: [
      ['**Mobility**', 'E-buses (9 m and 12 m mainly), coaches, e-tippers; maintenance', n0(y26.mobRev), n0(y26.mobEbit), mg(y26.mobEbit, y26.mobRev), n0(y26.mobAssets)],
      ['**Energy**', 'Composite polymer insulators (domestic and export)', n0(y26.enRev), n0(y26.enEbit), mg(y26.enEbit, y26.enRev), n0(y26.enAssets)],
      ['Unallocated', 'Corporate assets (incl. deposits)', '–', '0', '–', '124'],
    ], source: 'AR FY26 consolidated note 34 (segment result before interest and tax)' } },
    { exhibit: { type: 'table', title: 'Reach and structure', head: ['', 'Detail'], wide: [1], rows: [
      ['Plants', rup(C.business.plants)],
      ['Technology', rup(C.business.technology)],
      ['Volumes', rup(C.business.units)],
      ['Market share', rup(C.business.market)],
      ['Order book', rup(C.business.orderBook)],
      ['Parent', rup(C.structure.parent)],
      ['Evey Trans (the operator)', rup(C.structure.evey)],
    ], source: 'AR FY26; Q4FY26 and Q1FY27 presentations; ICRA (6-Oct-2025); call summaries (Jun and Aug 2026)' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From an insulator maker to India\'s first e-bus company, controlled by the MEIL group since FY19',
  blocks: [
    { exhibit: { type: 'table', title: 'Milestones and what they did to the numbers', head: ['When', 'What happened'], wide: [1], rows: C.history.map(([w, t]) => [w, rup(t)]), source: 'AR FY26; ICRA (Oct-2025); Screener.in; press (Free Press Journal 26-May-2025, The Hitavada 1-Apr-2026)' } },
    { bullets: [
      '**No equity raised since FY19.** The share count has been 8.21 cr (face value ₹4) since the MEIL preferential issues; growth since then was funded by profits, suppliers and, from FY25, bank debt for the new plant.',
      '**The MEIL group is both owner and customer.** MEIL itself bought ₹93 cr of goods and services in FY26 (₹5 cr in FY25) and is to be the first customer for the e-truck; Evey and its SPVs bought most of the buses.',
      '**MSRTC shows the execution risk.** The 5,150-bus order of Jul-2023 was to be delivered fast; by May-2025 the minister ordered it cancelled for missed deadlines, a new schedule was agreed, and by Apr-2026 ~1,200 buses had arrived with the deadline extended to Dec-2026.',
      '**Management changed in 2025.** The long-time MD K V Pradeep left in Jul-2025; Mahesh Babu Subramanian (31 years in mobility) became MD in Sep-2025.',
    ] },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'E-buses: ~5,000 a year, mostly bought by states on 10-12-year operating contracts; ~46,000 already awarded',
  blocks: [
    { p: rup(`${I.size} ${I.pipeline}`) },
    { pair: [
      { type: 'column', title: 'India e-bus sales: 0.6k (FY20) to 4.9k (FY26)', unit: 'E-buses sold (\'000)', x: ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Public', values: [0.6, 0.4, 1.2, 2.0, 3.5, 3.2, 4.6], fmt: 'n1' }, { name: 'Private', values: [0, 0, 0, 0.1, 0.2, 0.3, 0.3], fmt: 'n1' }], labels: 'none', source: 'KPMG Report on Electric Bus (Mar-2026), quoted in AR FY26 MD&A' },
      { type: 'column', title: 'Olectra\'s vehicles vs the market: ~24-26% in FY26', unit: 'Units', x: ['FY24', 'FY25', 'FY26'], series: [{ name: 'Olectra', values: [541, 972, 1280], fmt: 'num' }, { name: 'India e-buses (KPMG)', values: [3700, 3500, 4900], fmt: 'num' }], labels: 'all', source: 'Company presentations; KPMG in AR FY26. Olectra\'s count includes e-tippers.' },
    ] },
    { p: rup(`**How the market works.** ${I.competition} **Insulators.** ${I.insulators}`) },
    { callout: '**So what:** demand is set by state budgets and central schemes, and the order goes to the operator that bids the lowest cost per km. A bus maker that belongs to a group with an operator (Olectra with Evey, JBM with JBM Ecolife) wins volume, but its selling price is set inside a group deal, and its cash depends on the operator\'s funding.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach Olectra?', title: 'The tailwind reaches Olectra\'s order book; it has not yet reached its margins or cash',
  blocks: [
    { verdicts: [
      ['Orders', 'Yes', 'Order book ~10,000 (Mar-26), 8,000+ (Aug-26); TGSRTC and BMTC won via Evey in FY26', 'Two years of volume visible'],
      ['Deliveries', 'Partly', '1,280 in FY26 vs ~2,000 guided; MSRTC ~1,200 of 5,150 by Apr-2026', 'Capacity and supply, not demand, limit revenue'],
      ['Price and margin', 'No', 'Mobility EBIT margin 11.9% (FY25), 9.8% (FY26), 8.2% (Q1FY27)', 'Tender pricing and a new plant absorb the volume gain'],
      ['Cash', 'No', 'Receivables +₹293 cr in FY26; free cash flow −₹55 cr', 'Growth needs working capital at ~30% of revenue'],
      ['Insulators', 'Yes', 'Revenue ₹180 cr to ₹325 cr in FY26 on transmission spending and exports', 'Small, and Q1FY27\'s margin fell to 22%'],
    ], head: ['Test', 'Reaches Olectra?', 'Evidence', 'So what'], title: 'Tailwind test', source: 'Annual reports; presentations; Screener.in; The Hitavada (1-Apr-2026)' },
    { callout: `**Our conclusion:** the e-bus boom shows up in Olectra's volumes (we model ${n0(bld[0].units)} → ${n0(bld[2].units)} vehicles) but not, so far, in better unit economics. Every bus sold earns a high-single-digit EBIT margin and ties up roughly a third of its price in receivables until Evey's lenders and the state pay.` },
  ],
};

module.exports = { business, history, industry, tailwind };
