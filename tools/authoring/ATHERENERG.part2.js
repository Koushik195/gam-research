// Ather Energy report, part 2: what the company does, history and corporate actions, industry (e-2W adoption,
// PM E-DRIVE, fuel shock, commodities), the tailwind test and competition.
const X = require('./ATHERENERG.ctx');
const { C, D, A26, A25, A24, n0, n1, pc, rup } = X;
const I = D.industry, CP = D.competition, CAP = C.capacity, IPO = C.ipo, Q1K = X.QK.find(q => q.q === 'Q1FY27');

const business = {
  id: 'business', nav: 'What Ather does', kicker: 'The business', title: 'One business: premium electric scooters, plus software, charging and accessories that rivals do not match',
  blocks: [
    { p: 'Ather Energy designs and makes electric scooters and sells them through ~700 franchised experience centres (Mar-2026). It has three families: the **450** (sporty, its first product, 2018), the **Rizta** (a family scooter launched in Apr-2024, now the volume driver: 2 lakh+ sold within 21 months) and the **Konarc** (the first model on its new low-cost EL platform, launched on 29-Aug-2026 from ₹99,999 ex-showroom). It designs the battery packs, motor controllers, vehicle software and dashboards itself and buys cells and most parts. It builds scooters at Hosur (Tamil Nadu; ~35,000 a month, 4.2 lakh a year) and is finishing a second plant at AURIC, Chhatrapati Sambhaji Nagar (Maharashtra; 5 lakh a year in Phase 1, room for another 5 lakh).' },
    { p: `What makes it different is the layer around the scooter. **AtherStack Pro**, a paid software pack (navigation, ride modes, theft and crash alerts, over-the-air updates), is bought by ${Q1K.proPackAttachPct}% of customers; **non-vehicle revenue** (software, accessories, service, charging) was ${Q1K.nonVehicleSharePct}% of revenue in Q1FY27. Ather built India's largest two-wheeler fast-charging network (6,000+ points) on its own connector, LECCS, which became an Indian standard used by 20+ companies. Revenue per scooter was ₹${n0(C.annualKpis[2].revenuePerUnit)} in FY26 and ₹${n0(Q1K.revenuePerUnit)} in Q1FY27, the highest among mass-market e-scooter makers.` },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Capacity', `Hosur ${n0(CAP.hosurPerMonth)} a month (${n0(CAP.hosurPerYear)} a year, ~100% used by Aug-2026); AURIC Phase 1 ${n0(CAP.auricPhase1PerYear)} a year from Q4FY27 (dedicated to the EL platform); total ${n0(CAP.totalAfterPhase1)}, then ${n0(CAP.totalAfterPhase2)} with Phase 2 (not yet started)`],
      ['Distribution', '700 experience centres and 548 service centres (Mar-2026), doubled in a year; new stores reach operating breakeven in 5-6 months (management). Store openings paused in Q1FY27 because stores could only meet 50-60% of demand'],
      ['Demand', `Q1FY27: ${n0(Q1K.enquiries)} enquiries (+95%), ${n0(Q1K.preOrders)} paid pre-orders (+158%), ${n0(Q1K.registrations)} registrations (+102%), dealer stock 3 days`],
      ['Revenue mix', 'Vehicles 86-87%, non-vehicle 13-14% (AtherStack Pro the largest; accessories under ₹100 cr but growing 30-40% a year; service 2-3% of revenue vs 10-12% for incumbents)'],
      ['Subsidy', 'PM E-DRIVE ₹5,000 a scooter (to Mar-2028); subsidy was 3% of FY26 revenue (6% FY25, 16% FY24)'],
    ], source: 'Q1FY27 and Q4FY26 presentations and calls; AR FY26' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Thirteen years, four funding eras: VC, Hero MotoCorp, the IPO and the 2026 top-up',
  blocks: [
    { p: `Two IIT Madras graduates, Tarun Mehta and Swapnil Jain, founded Ather in 2013. Hero MotoCorp invested from 2016 and is now the largest shareholder; GIC, NIIF and others followed. The subsidy cut of 2023 (FAME-II) hit volumes in FY24 and pushed Ather to sell software packs to rebuild margins. The IPO in May-2025 raised ₹${n0(IPO.freshCr)} cr of new money at ₹${IPO.price} a share (plus a ₹${n0(IPO.ofsCr)} cr sale by existing holders). In Jul/Aug-2026, with the stock at ~4x the IPO price and demand outrunning supply, Ather raised another ₹2,500 cr to fund AURIC Phase 2 and faster launches.` },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Impact on the numbers'], wide: [1, 2], rows: C.timeline.map(t => [t.date, rup(t.event), ({ '2022-2023': 'FY24 revenue flat (−2%); EBITDA loss ₹685 cr; ₹148 cr refunded to customers', 'Apr-2024': 'Volumes +42% in FY25 and +69% in FY26; Middle and North India now the growth zones', 'Jun-2024': 'Capex ₹339 cr FY25, ₹506 cr FY26; capacity +5 lakh from Q4FY27', '6-May-2025': `Net worth ₹493 cr → ₹2,573 cr; ₹${n0(IPO.unusedMar26)} cr unspent at Mar-2026`, '20-Jul-2026': '+2.8% shares; +₹1,300 cr cash', '25-Aug-2026': '+0.4% shares now, +2.0% on warrant conversion; +₹450 cr cash now, ₹750 cr later', '29-Aug-2026': 'Lower revenue per scooter from Q3FY27; wider addressable market' })[t.date] || '–']), source: 'Company filings; AR FY26; exchange filings (QIP, preferential issue); Business Today, Autocar Pro' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'E-scooters went mainstream in 2026: 70% growth, 11% of all two-wheelers',
  blocks: [
    { p: `India sold ~${n1(I.twoWheelerFY26.units / 1e6)} mn two-wheelers in FY26, of which ~${n1(I.e2wFY26.units / 1e6)} mn were electric (+${I.e2wFY26.growthPct}%, ${I.e2wFY26.penetrationPct}% penetration). Then demand jumped: e-2W registrations were ${n0(I.q1fy27.registrations)} in Q1FY27 (+${I.q1fy27.growthPct}%), ~${I.q1fy27.penetrationPct}% of all two-wheelers and ~${I.q1fy27.scooterPenetrationPct}% of scooters, and ${n0(I.e2wFY27ytd.units)} in Apr-Aug 2026 (+${I.e2wFY27ytd.growthPct}%). Three things changed at once: the West Asia conflict raised petrol prices and, for the first time, made buyers worry about petrol availability; EV running costs became far cheaper than petrol; and governments pushed harder (Delhi's draft EV policy; PM E-DRIVE extended to Mar-2028).` },
    { bullets: [
      `**Policy.** ${rup(I.policy)}`,
      `**Fuel.** ${rup(I.fuel)}`,
      `**Costs.** ${rup(I.commodities)}`,
      `**Outlook.** ${rup(I.outlook)} At FY26's ~2.1 crore two-wheelers, 22-25% penetration means ~45-55 lakh e-2Ws a year by FY30, 3-4x FY26.`,
      '**Supply.** Every listed maker was capacity- or supply-constrained in mid-2026; waiting periods of up to two months at Ather (Q1 call). When supply catches up, discounting could return.',
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the EV boom reach Ather? Yes in volume, less in market share',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach Ather?', 'Catch'], wide: [1, 3], rows: [
      ['E-2W adoption (fuel shock, TCO)', `Industry +${I.e2wFY27ytd.growthPct}% Apr-Aug 2026`, `Yes: registrations +102% in Q1FY27; Apr-Aug +82% (${n0(CP.rows[2][3])})`, 'Capacity-bound until AURIC: share fell to 15.9% in August'],
      ['Policy (PM E-DRIVE, state policies)', 'Subsidy extended to Mar-2028 (11-Aug-2026)', 'Partly: subsidy is only 3% of revenue', 'The scheme ends in Mar-2028; Delhi policy still a draft'],
      ['Premiumisation and software', 'Ather ASP ~₹1.61 lakh; buyers pay for range and warranty', 'Yes: AtherStack Pro attach 94%, price rises absorbed in Q1', 'Konarc moves Ather down-market, lowering revenue per scooter'],
      ['Scooterisation outside the south', 'Scooters +16.5% in FY26 (all fuels)', 'Yes: Middle India registrations +141%, Rest of India +118% in Q1FY27', 'In the north Ather meets Hero, TVS and Bajaj dealer networks head-on'],
    ], source: 'Vahan via Autocar Pro (1-Sep-2026); company presentations and calls; AR FY26; GAM Research' } },
    { callout: '**Verdict:** the tailwind is real and Ather catches it in volume (+81% wholesale in Q1FY27). But in FY27 it is growing slower than TVS (+92%) and Bajaj (+106%) because it cannot make enough scooters, so the boom so far helps incumbents at least as much as it helps Ather. AURIC from January 2027 is the test.' },
  ],
};

const competition = {
  id: 'competition', nav: 'Competition', kicker: 'Competition', title: 'Four big players: TVS and Bajaj lead, Ather third, Ola collapsing, Hero rising',
  blocks: [
    { p: 'The e-scooter market has consolidated around the petrol incumbents. TVS (iQube) and Bajaj (Chetak) sell through thousands of existing dealers and can price off profitable petrol businesses; Hero MotoCorp\'s Vida nearly tripled in FY26. Ola Electric, the FY24 leader, lost more than half its volume in FY26 after service problems. Ather is the only independent maker with scale, and the most premium: it is gaining in absolute terms but not in share this year.' },
    { exhibit: { type: 'table', title: 'E-2W registrations: FY26 and Apr-Aug FY27', head: ['Company', 'FY26 units', 'FY26 growth', 'Apr-Aug FY27', 'Growth', 'Aug-26 share'], rows: CP.rows.map(r => [r[0], n0(r[1]), pc(r[2]), n0(r[3]), pc(r[4]), `${CP.aug26Share[r[0].split(' ')[0]]}%`]), source: 'Vahan via Autocar Pro and Business Today (1-Apr-2026, 1-Sep-2026). Ather\'s own wholesale count for FY26 was 262,942.' } },
    { callout: `**Our read:** Ather's products and brand are competitive at the top of the market, and Konarc takes it into the ₹1-1.2 lakh segment where TVS, Bajaj and Hero sell most. Hero (30% of Ather) is a shareholder and a rival. We assume Ather holds a 16-19% share of a fast-growing market; regaining the 18-19% of late FY26 needs AURIC on time.` },
  ],
};

module.exports = { business, history, industry, tailwind, competition };
