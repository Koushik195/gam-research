// Hyundai Motor India report, part 2: what the company does, history and corporate actions, industry (PVs,
// GST 2.0, West Asia, CAFE), the tailwind test and competition.
const X = require('./HYUNDAI.ctx');
const { C, D, SA, A26, A25, A24, n0, n1, pc, rup } = X;
const I = D.industry, G = I.gst, R = C.fy26.revenueSplitMn, CP = D.competition;
const cr = mn => n0(mn / 10);
const share = a => n1(a.domestic / a.industry * 100) + '%';

const business = {
  id: 'business', nav: 'What Hyundai India does', kicker: 'The business', title: 'One business, two markets: India (three-quarters of revenue) and exports to emerging markets',
  blocks: [
    { p: 'Hyundai Motor India (HMIL) makes and sells Hyundai passenger vehicles in India and exports them to emerging markets in the Middle East, Africa, Latin America and Asia. It sells 13-15 models: SUVs (Creta, Venue, Exter, Alcazar; 68% of FY26 domestic volume, 70% in Q1FY27), hatchbacks (Grand i10, i20) and sedans (Aura, Verna), plus the Creta Electric. It has three assembly plants: two in Chennai (824,000 a year) and Talegaon near Pune (170,000, bought from General Motors in 2023, producing the new Venue since Oct-2025). It also does engineering work for Hyundai Motor Company (HMC) and runs a small insurance-broking subsidiary.' },
    { p: 'Two features make it different from Maruti, Tata or M&M. **It is a subsidiary, not a group flagship**: HMC owns 82.5%, licenses the designs, engines and technology for a royalty (₹1,975 cr in FY26, 2.8% of revenue), and supplies parts through group companies. **It is an export hub**: 190,125 vehicles (25% of volume, 26% of revenue) went abroad in FY26, and HMC now sources the new Venue for some markets from India.' },
    { exhibit: { type: 'table', title: 'Revenue by source, FY26 (₹ crore)', head: ['Line', 'FY26', '% of revenue', 'Note'], wide: [3], rows: [
      ['Vehicles sold in India', cr(R.vehiclesDomestic), n1(R.vehiclesDomestic / R.total * 100) + '%', `${n0(A26.domestic)} units; ~₹7.7 lakh each net of GST and discounts`],
      ['Vehicles exported', cr(R.vehiclesExports), n1(R.vehiclesExports / R.total * 100) + '%', `${n0(A26.exports)} units; +21% in value`],
      ['Engines, transmissions and parts (India and export)', cr(R.partsAndEnginesDomestic + R.partsAndEnginesExports + R.tradedGoods), n1((R.partsAndEnginesDomestic + R.partsAndEnginesExports + R.tradedGoods) / R.total * 100) + '%', 'Parts revenue fell 21% in FY26 (not explained)'],
      ['Services (incl. engineering services to the group ₹670 cr)', cr(R.services), n1(R.services / R.total * 100) + '%', 'Distribution fees, insurance broking, extended warranties'],
      ['Export incentives and state incentives', cr(R.otherOperating), n1(R.otherOperating / R.total * 100) + '%', 'Duty drawback ₹591 cr, RoDTEP ₹152 cr, state incentives ₹426 cr'],
      { hl: true, cells: ['**Revenue from operations**', `**${cr(R.total)}**`, '**100%**', `Revenue per vehicle ₹${n0(X.rpu26)}`] },
    ], source: 'AR FY26, consolidated note 29' } },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Capacity', '994,000 a year at Mar-2026 (Chennai 824,000 + Pune 170,000 on three shifts); Pune third shift from Oct-2026; Pune Phase 2 to 250,000 by CY28 and ~320,000 later; >1.1 mn in total by 2030'],
      ['Distribution', '1,519 sales and 1,679 service outlets (Jun-2026); six of every ten new outlets are rural; rural share 25.9% of domestic sales in Q1FY27'],
      ['Exports', 'India\'s largest cumulative passenger-vehicle exporter (company); Central and South America +23% in Q1FY27; new Venue in 29 markets, 35 planned; Exter left-hand drive to 13 markets by Q3FY27'],
      ['Technology and sourcing', 'Localisation 83% (target 90% by 2030); 30% of purchases from group companies (Mobis India, Hyundai Transys, Kia India, HMC); RE100 (renewable power) achieved in FY26'],
      ['Powertrains', 'Petrol, diesel, CNG (18.2% of Q1FY27 sales), EV; plan by 2030: at least 6 CNG models, 4 EVs and 5-6 hybrids'],
    ], source: 'Q1FY27 call and presentation; Q4FY26 call; AR FY26' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Thirty years in India: from Santro to SUVs, a pre-IPO cash-out and India\'s largest IPO',
  blocks: [
    { p: 'HMC set up HMIL in 1996; its Chennai plant (1998) was HMC\'s first fully integrated plant outside South Korea, and the Santro made it India\'s #2 car maker by 1999, a position it held for over two decades with i10, i20, Verna and, from 2015, the Creta. It sold ~13.5 mn vehicles in India and abroad by 2026. The listing was a sale by the parent, not a fundraise: HMC took ~₹15,400 cr of dividends out in FY24 and then sold 17.5% in the Oct-2024 IPO for ₹27,859 cr.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Impact on the numbers'], wide: [1, 2], rows: C.timeline.filter(t => /20(2[3-6])|FY24/.test(t.date)).map(t => [t.date, rup(t.event), ({ 'FY24': 'ROE jumps to 40%+ on a smaller equity base; cash falls to ₹9,017 cr', 'Aug-2023': 'Capacity +170k from Oct-2025; depreciation and fixed costs up from H2FY26', '22-Sep-2025': 'Small cars cheaper; Hyundai\'s mix (mostly sub-4m SUVs and small cars) benefits; H2FY26 domestic +8-9%', 'Oct-2025': 'Venue moved from Chennai: Chennai Plant 1 utilisation falls to ~72% until new models arrive', '1-Jan-2026': 'Continuity of strategy; MD pay 41.9x the median employee', 'Jun-2026': 'Q1FY27 domestic growth cut to 5.4%; margin 9.3%', 'Sep-2026': 'Volume and mix support from Q3FY27' })[t.date] || '–']), source: 'Company filings; AR FY26; Chittorgarh (IPO); Business Today and Autocar Pro (Bayon)' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Indian car demand hit a record after GST 2.0, but SUVs and new launches take the growth',
  blocks: [
    { p: `India sold ${n0(I.pvFY26.units)} passenger vehicles in FY26 (+${I.pvFY26.growthPct}%, SIAM wholesales), a record, with utility vehicles (SUVs and MPVs) at ${I.pvFY26.uvSharePct}% of the market. The first half was weak; GST 2.0 (22-Sep-2025) cut the tax on small cars from 29-31% to 18% and on larger cars from 45-50% to a flat 40%, and demand jumped. The new fiscal year began strongly (April +${I.pvApr26.growthPct}%; Q1FY27 ~${I.pvQ1FY27.unitsLakh} lakh, +${I.pvQ1FY27.growthPct}%), but from October the industry laps the post-GST base. Hyundai's MD expects "lower single digit" growth in H2 and 6-9% for FY27.` },
    { exhibit: { type: 'table', title: 'GST 2.0 (effective 22-Sep-2025)', head: ['Category', 'Before', 'After', 'Hyundai models'], wide: [3], rows: [
      ['Small cars (under 4 m; petrol ≤1,200cc, diesel ≤1,500cc)', G.smallBefore, G.smallAfter, 'Grand i10, Aura, Exter, i20, Venue (most versions)'],
      ['Larger cars and SUVs', G.largeBefore, G.largeAfter, 'Creta, Alcazar, Verna (larger engines), Bayon'],
      ['Electric cars', G.ev, G.ev, 'Creta Electric; compact EV (H2FY27)'],
    ], source: 'Autocar India and CarDekho (Sep-2025)' } },
    { bullets: [
      `**Market structure.** Maruti (~39%) leads; M&M, Tata and Hyundai have 12-14% each; Toyota and Kia follow. Hyundai's share was ${share(X.yr('FY23'))} in FY23, ${share(A24)} in FY24, ${share(A25)} in FY25 and ${share(A26)} in FY26.`,
      `**West Asia.** ${I.westAsia}`,
      `**Currency.** ${I.rupee}`,
      `**Regulation.** ${I.cafe} EVs pay 5% GST; the PLI scheme rewards 50% domestic value addition, which Hyundai targets for its new EV from day one.`,
      `**Exports.** India exported ~${n0(I.pvExportsFY26.units / 1000)}k passenger vehicles in FY26 (+${I.pvExportsFY26.growthPct}%, secondary source); Hyundai was ${n1(A26.exports / I.pvExportsFY26.units * 100)}% of that.`,
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the GST boom reach Hyundai? Less than its rivals so far',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach Hyundai?', 'Catch'], wide: [1, 3], rows: [
      ['GST 2.0 on small cars and compact SUVs', 'Industry FY26 +7.9%; Q1FY27 +26%', 'Partly: H2FY26 domestic +8-9%, Q4 a record; Apr-Aug FY27 +12.6%', 'Industry grew faster; Hyundai\'s FY26 domestic volume fell 2.3%'],
      ['SUV shift', 'UVs 67% of the market', 'Yes: SUVs 70% of Hyundai\'s domestic mix', 'Rivals have more and newer SUVs; Hyundai has one mid-SUV leader (Creta)'],
      ['Rural demand', 'Rural growing faster than urban (Hyundai Q1: +23% vs +3%)', 'Yes: rural share 25.9%, a record', 'Lower-priced models, more discount-sensitive'],
      ['India as an export base', 'PV exports +18% in FY26', 'Yes: exports +16.4% in FY26; HMC sources the new Venue from India', 'Middle East exposure: exports −20% in Q1FY27 and −31% in Aug-2026'],
    ], source: 'SIAM, Autocar Pro, company calls, GAM Research' } },
    { callout: '**Verdict:** the industry tailwind is real, but Hyundai has been a weaker beneficiary than M&M, Tata or Maruti because it had fewer new products in the right segments in FY25-FY26. FY27-FY28 is the test: if Bayon and the EV do not lift share, Hyundai will keep growing slower than the market it serves.' },
  ],
};

const competition = {
  id: 'competition', nav: 'Competition', kicker: 'Competition', title: 'From #2 to #4: M&M and Tata overtook Hyundai in FY26',
  blocks: [
    { p: 'Hyundai held India\'s #2 spot for most of two decades. In FY26 it slipped to #4: M&M sold 660,276 SUVs (+20%) and Tata 631,387 vehicles (+14%) while Hyundai sold 584,906 (−2.3%). Rivals launched more new SUVs and electric SUVs (Maruti\'s Victoris and e-Vitara among them), and Kia, Hyundai\'s sister company, competes with the Seltos and other models on shared group platforms. Hyundai\'s answer is the new Venue (Oct-2025), refreshed Exter and Verna, and two all-new nameplates in H2FY27.' },
    { exhibit: { type: 'table', title: 'Domestic passenger-vehicle sales, FY26', head: ['Company', 'Units', 'YoY growth', 'Notes'], wide: [3], rows: CP.rows.map(r => [r[0], n0(r[1]), pc(r[2]), r[3]]), source: `Autocar Pro (${CP.published.split('-').reverse().join('-')}; Maruti, Toyota and Kia from Autocar Pro FY26 analyses). Maruti rounded.` } },
    { callout: '**Our read:** Hyundai\'s products are competitive (Creta remains the mid-SUV leader with ~30% of its segment) but its range is thin where the market is growing fastest. The new models are necessary just to hold share; we model share stabilising near 12.5-13%, not a return to 14-15%.' },
  ],
};

module.exports = { business, history, industry, tailwind, competition };
