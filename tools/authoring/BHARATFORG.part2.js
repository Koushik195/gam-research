// Bharat Forge report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./BHARATFORG.ctx');
const { C, D, SA, A26, A25, n0, n1, pc, rup } = X;
const I = D.industry;
const pctOf = (x, t) => n1(x / t * 100) + '%';
const yoy = (a, p) => pc((a / p - 1) * 100);

const business = {
  id: 'business', nav: 'What Bharat Forge does', kicker: 'The business', title: 'Five businesses: Indian forgings earn the money; defence is the growth story; overseas is the drag',
  blocks: [
    { p: 'Bharat Forge, the flagship of Pune\'s Kalyani Group, is India\'s largest forging company. It hammers and presses steel (and aluminium) into safety-critical parts - crankshafts, connecting rods, front axle beams, steering knuckles - and machines them. Trucks and cars still make up most of the demand, in India and abroad (the US truck makers are its largest export customers), but a growing share is "industrial": oil and gas, construction and mining, rail, marine, large engines for data-centre and power-generation sets, aerospace and semiconductor equipment. Since FY24 it also has a real defence business, run through the wholly owned **Kalyani Strategic Systems (KSSL)**: towed and mounted artillery (ATAGS), protected vehicles, CQB carbines, shells and, since Q1FY27, naval gas-turbine generator sets.' },
    { exhibit: { type: 'table', title: 'The businesses, FY26 (₹ crore)', head: ['Business', 'Revenue', 'EBITDA', 'Margin', 'What it is'], wide: [4], rows: [
      ['**Bharat Forge standalone**', `**${n0(A26.bflRev)}**`, n0(A26.bflEbitda), pctOf(A26.bflEbitda, A26.bflRev), `Forgings made in India: exports ${n0(A26.bflExpRev)} (CV ${n0(A26.expCvRev)}, PV ${n0(A26.expPvRev)}, industrial ${n0(A26.expIndRev)}); domestic ${n0(A26.bflDomRev)}`],
      ['**KSSL (defence)**', `**${n0(A26.ksslRev)}**`, n0(A26.ksslEbitda), pctOf(A26.ksslEbitda, A26.ksslRev), 'Artillery, vehicles, small arms, shells, naval systems; order book ₹10,961 cr (Mar-26)'],
      ['K Drive Mobility (9 months)', n0(A26.kdRev), n0(A26.kdEbitda), pctOf(A26.kdEbitda, A26.kdRev), 'Ex-AAM India axles for trucks, LCVs and buses; bought 1-Jul-2025 for ₹550 cr'],
      ['BF Industrial Solutions (JS Autocast)', n0(A26.bfislRev), n0(A26.bfislEbitda), pctOf(A26.bfislEbitda, A26.bfislRev), 'Machined ductile-iron castings (wind, hydraulics, auto); 23% owned by Premji Invest'],
      ['**Europe manufacturing**', `**${n0(A26.euRev)}**`, n0(A26.euEbitda), pctOf(A26.euEbitda, A26.euRev), `Steel and aluminium forging in Germany (incl. CDP, ${n0(A26.cdpRev)} cr, closing by end-CY27), Sweden, France, Italy`],
      ['**US manufacturing**', `**${n0(A26.usRev)}**`, n0(A26.usEbitda), pctOf(A26.usEbitda, A26.usRev), 'Steel forging and an aluminium forging plant for cars'],
      ['E-mobility (Kalyani Powertrain)', n0(A26.emobRev), n0(A26.emobEbitda), '–', 'EV motors and drives; ₹450 cr investment impaired in Q4FY26'],
      ['Eliminations and other', n0(A26.elimRev), n0(A26.consEbitdaCo - A26.indiaEbitda - A26.overseasEbitda - A26.emobEbitda + (A26.indiaEbitda - A26.bflEbitda - A26.ksslEbitda - A26.kdEbitda - A26.bfislEbitda)), '', 'Inter-company sales (BFL forgings to KSSL and overseas units); other Indian entities'],
      { hl: true, cells: ['**Consolidated**', `**${n0(A26.consRev)}**`, `**${n0(A26.consEbitdaCo)}**`, `**${pctOf(A26.consEbitdaCo, A26.consRev)}**`, 'Company definition (before forex); Screener ₹2,917 cr'] },
    ], source: 'Q4FY26 analyst update (7-May-2026), AR FY26 (CDP revenue). Revenue by customer location FY26: India 31%, Europe 36%, USA 23%, others 10%.' } },
    { pair: [
      { type: 'hbar', title: 'Standalone exports: industrial overtook trucks in FY26', unit: 'FY26 standalone revenue (₹ crore)', x: ['Export industrial', 'Export CV', 'Export PV', 'Domestic industrial (incl. defence forgings)', 'Domestic CV', 'Domestic PV'], series: [{ name: 'Revenue', values: [A26.expIndRev, A26.expCvRev, A26.expPvRev, A26.domIndRev, A26.domCvRev, A26.domPvRev].map(Math.round), fmt: 'num' }], labels: 'all', source: 'Q4FY26 analyst update' },
      { type: 'column', title: 'India is where the profit is: EBITDA by unit, FY26', unit: 'EBITDA (₹ crore)', x: ['Standalone', 'KSSL', 'K Drive + castings', 'Europe', 'US', 'E-mobility'], series: [{ name: 'EBITDA', values: [A26.bflEbitda, A26.ksslEbitda, A26.othIndEbitda, A26.euEbitda, A26.usEbitda, A26.emobEbitda].map(Math.round), fmt: 'num' }], labels: 'all', source: 'Q4FY26 analyst update' },
    ] },
    { callout: `**So what:** standalone Bharat Forge is ${pctOf(A26.bflRev, A26.consRev)} of revenue but ${pctOf(A26.bflEbitda, A26.consEbitdaCo)} of EBITDA. Everything else together earned ₹${n0(A26.consEbitdaCo - A26.bflEbitda)} cr of EBITDA on ₹${n0(A26.consRev - A26.bflRev)} cr of revenue (${pctOf(A26.consEbitdaCo - A26.bflEbitda, A26.consRev - A26.bflRev)}). The bull case needs defence to scale and the overseas drag to end.` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Sixty years of forging; a decade of overseas losses; now a pivot to India, defence and aerospace',
  blocks: [
    { p: 'Founded in 1961 and led by Chairman and MD B.N. Kalyani (with Amit Kalyani as Vice-Chairman and Joint MD), Bharat Forge grew into a global truck-parts supplier in the 2000s by buying forging plants in Germany and Sweden and later building aluminium forging in Germany and the US. Those plants have rarely made money. The last five years have been a pivot back to India: a defence business built from scratch (artillery, vehicles, small arms), castings (JS Autocast, 2022), axles (K Drive, 2025), aerospace and large-engine parts, while e-mobility was written off and the German steel plant is being closed.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Impact on the numbers'], wide: [1, 2], rows: C.corporateActions.map(a => [a.when, rup(a.what), rup(a.impact)]), source: 'Annual reports, analyst updates and calls; AR FY26 (QIP use, CDP); Angel One (Sep-2026 QIP allotment, 23-Sep-2026)' } },
    { callout: '**Read the history with care:** reported EPS swings with exceptional items in both directions (+₹205 cr in FY22; −₹154-157 cr in FY25 and FY26; −₹358 cr in Q1FY27), so we value the company on EPS before exceptional items and compute its own multiple history on the same basis (valuation chapter).' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Three end-markets: the US truck cycle, Indian vehicles, and a defence and power-gen capex boom',
  blocks: [
    { p: `Bharat Forge sells into three very different cycles. **North American trucks** (its largest export market) went through a destocking slump in FY26: standalone exports fell 15% and Americas exports from ₹3,317 cr to ₹2,487 cr. The cycle turned in Q4FY26; truck makers guide calendar 2026 roughly flat to up (table). **Indian vehicles** got a lift from the Sep-2025 GST cut; India's auto-component industry reached US$${I.autoComponents.indiaFY26UsdBn} bn in FY26. **Defence and industrial capex**: India's defence production was ₹${I.defence.indiaProductionFY26RsTn} tn in FY26 with ${I.defence.privateSharePct}% from private firms; the Navy plans ~140 new ships; data-centre build-outs need standby power-gen engines, whose crankshafts and other forgings Bharat Forge supplies.` },
    { exhibit: { type: 'table', title: 'Heavy-truck outlook from the truck makers (standing in Aug-2026)', head: I.naTrucks.head, rows: I.naTrucks.rows, source: 'Company guidance compiled by Emkay (10-Aug-2026)' } },
    { bullets: [
      `**Tariffs.** ${rup(I.tariffs)}`,
      `**Energy and labour (2026).** ${rup(I.energyShock)}`,
      '**Europe.** Management calls Europe "a secular problem" (Feb-2026): high energy costs, weak demand and 60-65% plant utilisation. That is why CDP is closing and some of its work is moving to India.',
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Do the tailwinds reach Bharat Forge? Defence and aerospace yes, but slowly; trucks are a cycle, not a trend',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach BF?', 'Catch'], wide: [1, 3], rows: [
      ['Indian defence indigenisation', 'Defence budget +21% (management, Feb-2026); private share of production 24%', 'Yes: order book ₹11,196 cr (Jun-26), 7x KSSL revenue', 'KSSL revenue was flat for three years (₹1,422-1,567 cr); ATAGS waits for approvals'],
      ['Aerospace and large engines', 'Record aerospace wins (Farnborough, Jul-2026); data-centre power-gen demand', 'Yes: aerospace ~₹400 cr, to double in ~2 years', 'Small today (~2.5% of revenue); needs new Baramati capacity'],
      ['US truck upcycle', 'Truck makers guide CY26 flat to up; Q1FY27 exports +12%', 'Yes, with a lag (restocking)', 'Tariffs, energy prices and emissions rules can move the cycle either way'],
      ['India manufacturing shift (CDP work to India, FTA)', 'CDP closing; part of its orders move to Indian plants at "a good margin"', 'Partly', 'Orders being phased out are lost, not moved'],
    ], source: 'Calls (Feb, May, Aug-2026), analyst updates, Emkay (10-Aug-2026), GAM Research' } },
    { callout: `**Verdict:** the defence tailwind is real and Bharat Forge is one of its few private beneficiaries with its own artillery designs. But it shows up in orders far faster than in revenue: KSSL grew ${pc((A26.ksslRev / A25.ksslRev - 1) * 100)} in FY26 while the order book rose from ~₹9,400 cr to ₹10,961 cr. We model defence revenue +35% a year for two years; management's 22-23% margin target would need a doubling of KSSL's FY26 margin.` },
  ],
};

module.exports = { business, history, industry, tailwind };
