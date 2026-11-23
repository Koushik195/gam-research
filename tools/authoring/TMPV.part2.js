// TMPV report, part 2: what the company does, history and the demerger, industry, tailwind test, competition.
const X = require('./TMPV.ctx');
const { C, D, A26, A25, n0, n1, rup } = X;
const I = D.industry.indiaPv;

const business = {
  id: 'business', nav: 'What TMPV does', kicker: 'The business', title: 'Two car companies in one share: a British luxury maker (81% of revenue) and India\'s #2 car brand',
  blocks: [
    { p: 'After the trucks and buses left in Oct-2025, Tata Motors Passenger Vehicles (TMPV, the old Tata Motors Ltd renamed) owns two very different car businesses. **Jaguar Land Rover (JLR)**, bought from Ford in 2008, makes Range Rover, Defender, Discovery and Jaguar cars, mostly in the UK, and in China through a 50:50 joint venture with Chery; it sold 3.08 lakh cars in FY26 (4.01 lakh in FY25) at an average price above GBP70,000 and reports in pounds under IFRS. **Tata Passenger Vehicles** makes Nexon, Punch, Tiago, Altroz, Curvv, Harrier, Safari and Sierra cars and their electric versions in India (including FIAPL, a 50:50 joint operation with Fiat), selling 6.42 lakh in FY26, ~14% of India\'s market and ~40% of its electric cars. TMPV also owns 53.35% of listed Tata Technologies (engineering services).' },
    { exhibit: { type: 'table', title: 'The businesses, FY26 (₹ crore, company EBITDA definition)', head: ['Business', 'Revenue', 'EBITDA (margin)', 'Volumes', 'How it reports'], wide: [4], rows: [
      ['**Jaguar Land Rover**', `**${n0(A26.jlrRev)}**`, `${n0(A26.jlrEbitda)} (${n1(A26.jlrEbitda / A26.jlrRev * 100)}%)`, `${n0(A26.jlrWholesales)} wholesales (ex China JV)`, 'IFRS, GBP22.9bn revenue, EBIT 0.7%; 100% owned via TML Holdings'],
      ['**Tata Passenger Vehicles (India PV + EV)**', `**${n0(A26.pvRev)}**`, `${n0(A26.pvEbitda)} (${n1(A26.pvEbitda / A26.pvRev * 100)}%)`, `${n0(A26.pvUnits)} incl. 92k EVs`, 'EBITDA incl. ₹1,044 cr PLI (5.0% without it)'],
      ['Others (Tata Technologies, unallocated)', n0(A26.othRev), `${n0(A26.othEbitda)}`, 'TTL FY26: revenue ₹5,506 cr, PAT ₹547 cr', '53.35% owned, listed'],
      { hl: true, cells: ['**TMPV consolidated**', `**${n0(A26.consRev)}**`, `**${n0(A26.consEbitda)} (${n1(A26.consEbitda / A26.consRev * 100)}%)**`, '', 'Grant income ₹3,603 cr included in EBITDA'] },
    ], source: 'Q4FY26 presentation (segment table, 14-May-2026); AR FY26' } },
    { pair: [
      { type: 'hbar', title: 'JLR is 81% of revenue and ~80% of normal-year EBITDA', unit: 'FY25 revenue (₹ crore)', x: ['JLR', 'India PV', 'Others'], series: [{ name: 'FY25', values: [A25.jlrRev, A25.pvRev, A25.othRev], fmt: 'num' }, { name: 'FY26', values: [A26.jlrRev, A26.pvRev, A26.othRev], fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation' },
      { type: 'column', title: 'JLR revenue in pounds: GBP29bn in FY24-25, GBP22.9bn in FY26 (cyber attack)', unit: 'JLR revenue (GBP m, IFRS)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Revenue', values: [18300, 22800, 29000, 28961, 22911, ...X.AS.jlrBuild.revGbp], fmt: 'num' }], labels: 'all', source: 'JLR Investor Day (17-Jun-2026) and results; GAM estimates' },
    ] },
  ],
};

const history = {
  id: 'history', nav: 'History & the demerger', kicker: 'History', title: 'The demerger, the cyber attack and new leaders: a company reset in twelve months',
  blocks: [
    { p: 'Tata Motors was India\'s biggest truck maker that also owned JLR and a small car business. Over 2021-2025 it split itself up: private investors bought convertible preference shares in the EV unit (TPEML), Tata Technologies listed (Nov-2023), the vehicle-finance arm merged into Tata Capital (May-2025) and, effective 1-Oct-2025, the commercial-vehicle business was demerged into a separately listed company (TMCV, listed 12-Nov-2025) with one TMCV share for each Tata Motors share. The listed parent kept the cars and JLR and was renamed Tata Motors Passenger Vehicles. Weeks earlier, a cyber attack had shut every JLR plant for September 2025.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Impact on the numbers'], wide: [1, 2], rows: C.history.map(r => r.map(rup)), source: 'AR FY26; company presentations and calls (Nov-2025 to Aug-2026)' } },
    { callout: '**Why it matters for valuation:** the share price history before 14-Oct-2025 (record date) is adjusted for the demerger, but the earnings behind it include trucks. A one-year-forward P/E or EV/EBITDA history for *this* business exists only from Oct-2025, and FY26 earnings are distorted by the attack and the demerger gain. We therefore measure TMPV\'s own multiples only on the eleven and a half months since the demerger and say so.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Two markets moving in opposite directions: Indian cars booming, global luxury cars squeezed',
  blocks: [
    { p: `**India.** Car sales reached a record ${n1(I.fy26Units / 1e5)} lakh in FY26 (+${I.fy26Growth}%), with H2 up ${I.h2fy26Growth}% after the GST cut of Sep-2025; Q1FY27 grew ${I.q1fy27Growth}% to ~13 lakh on a low base. Greener fuels are taking over: EVs and CNG were ${I.cngEvShareQ1}% of Q1FY27 sales and EVs alone ${I.evShareJun26}% in June 2026 (2 lakh+ EVs sold in FY26). Management expects the market to grow 6-7% a year to ~64 lakh by FY31, with nearly half the growth from EVs. The catch is costs: commodities (aluminium, copper, precious metals) rose sharply after the Middle East conflict, costing Tata 4.5% of revenue in Q1FY27 with ~3% more in Q2.` },
    { p: `**Global luxury cars.** ${rup(D.industry.luxury)} JLR says the industry's challenges (geopolitics, inflation, supply chains, regulation) are intensifying, and Chinese brands are winning their home market.` },
    { bullets: [
      '**Tariffs.** US duty on UK-built cars fell from 27.5% to 10% (within a quota) under the UK-US deal; JLR\'s incremental tariff cost was ~GBP525m in FY26, half offset by lower US emissions costs. JLR is exploring US production with Stellantis (MoU; definitive agreement targeted by end-2026).',
      '**Electrification.** Europe and the UK push EV mandates (Euro 7 from 2027); JLR launches four BEVs over FY27-28 and expects them to be margin-neutral. In India, the PLI scheme pays incentives on EVs and advanced cars until FY28.',
      '**Currency.** JLR prefers a weak pound: its US dollar sales are hedged (book around 1.28 USD/GBP); the pound averaged 1.32 in Q1FY27. In rupees, a weaker rupee (₹128 per pound in Q1FY27 vs ₹119 in FY26) lifts reported revenue.',
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does India\'s car boom reach TMPV\'s profits? Volumes yes; profits barely, because India is a sixth of the company',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach TMPV?', 'Catch'], wide: [1, 3], rows: [
      ['India car demand after GST 2.0', 'Industry +17% in H2FY26, +24% in Q1FY27', 'Yes: Tata +46% in Q1FY27, share 14.3% (+200bp)', 'India PV EBITDA was only ₹763 cr in Q1FY27 (4.3%): volume without margin'],
      ['EV adoption in India', 'EVs 8% of industry in June 2026; Tata EVs +112% in Q1', 'Yes: ~40-43% EV share; bookings 3.5x pre-crisis', 'EV margins near zero before PLI; PLI ends after FY28; competition rising'],
      ['Luxury SUV demand', 'Defender, Range Rover, Range Rover Sport resilient; 81% of JLR wholesales', 'Partly: JLR ASP GBP75k+', 'China -25% and VME 7.1%; total JLR wholesales -9% in Q1FY27'],
      ['Cost programmes', 'JLR GBP1.7bn over two years; India 5-6% ICE cost cuts', 'Not yet visible', 'Commodity inflation absorbed all of India\'s 2% cost-down in Q1FY27'],
    ], source: 'Company calls and presentations (May-Aug 2026), GAM Research' } },
    { callout: '**Verdict:** India\'s car boom is real and Tata is a winner in volume, but India PV is only ~17% of revenue and ~10-14% of our FY28E EBITDA. The share price is driven by JLR, where the tailwinds are weaker than the headwinds today.' },
  ],
};

const competition = {
  id: 'competition', nav: 'Competition', kicker: 'Competition', title: 'Competition: #2 in India and gaining; at JLR, a small luxury maker against much bigger rivals',
  blocks: [
    { p: `${rup(D.competition.india)} ${rup(D.competition.jlr)}` },
    { exhibit: { type: 'table', title: 'Where TMPV stands', head: ['Market', 'Position', 'Main rivals', 'Trend'], wide: [3], rows: [
      ['India passenger vehicles', '#2, 14.3% Vahan share (Q1FY27)', 'Maruti Suzuki, Mahindra, Hyundai, Toyota, Kia', 'Gaining: +200bp YoY; Punch and Nexon in the top three models'],
      ['India electric cars', '~40% (43% in July 2026)', 'MG (JSW), Mahindra, Hyundai, Maruti', 'Holding share as the market grows 77%'],
      ['Global luxury SUVs (JLR)', '~3-4 lakh cars a year', 'BMW, Mercedes-Benz, Porsche, Audi, Lexus, Chinese premium brands', 'Losing in China; stable in the UK and US'],
    ], source: 'Q1FY27 presentation and call; JLR Investor Day' } },
  ],
};

module.exports = { business, history, industry, tailwind, competition };
