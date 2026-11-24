// Indian Hotels report, part 3: hotels (rate, occupancy, owned vs managed), fees and growth brands, TajSATS, moat scorecard.
const X = require('./INDHOTEL.ctx');
const { C, F, SEG, n0, n1, Q1, SQ, stream, feeShare } = X;
const HS = C.hotelRevenueStreams, KP = C.kpis, PF = C.portfolio, NB = C.newBusinesses;
const qs = k => SQ.filter(q => q.hotelRev).map(q => q[k]);
const qx = SQ.filter(q => q.hotelRev).map(q => q.q);

const hotels = {
  id: 'hotels', nav: 'Hotels: rate and occupancy', kicker: 'Segment: Hotels', title: 'Hotels: rate-led growth at high occupancy; 2026 shows how fast travel shocks hit the international hotels',
  blocks: [
    { p: `The hotel segment (${Math.round(HS.FY26.total / 9689 * 100)}% of revenue, ${Math.round(2907 / 3195 * 100)}% of operating EBITDA in FY26) grew 11% in FY26 and ${Math.round((Q1.hotelOpRev / 1754 - 1) * 100)}% in Q1FY27. Occupancy in like-for-like consolidated hotels was 76% in both FY25 and FY26, so growth came from price: like-for-like RevPAR (revenue per available room) rose 9% to ₹11,750. Standalone hotels (the Indian owned portfolio) did better in Q1FY27: occupancy ${Q1.standaloneOccupancyPct}% (${Q1.standaloneOccupancyPyPct}% a year earlier), operating margin ${Q1.standaloneOpMarginPct}% (+4 pp), helped by renovated rooms at Taj Palace Delhi, The President Mumbai, Taj West End and Fort Aguada and the new Varanasi wing (PBT-positive in its first quarter). The weak spots are abroad: St James Court's EBITDA fell from ₹48 cr to ₹36 cr in Q1 (renovation, West Asia), and The Pierre (UOH) earns a 7.7% margin.` },
    { pair: [
      { type: 'column', title: 'Hotel segment revenue by quarter: seasonal, growing ~12-17%', unit: 'Hotel segment operating revenue (₹ crore)', x: qx, series: [{ name: 'Revenue', values: qs('hotelRev'), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company decks; Q1FY25 = consolidated (TajSATS not yet consolidated)' },
      { type: 'line', title: 'Hotel margin: Q1 is the low season, Q3 the peak', unit: 'Hotel segment operating EBITDA margin (%)', x: qx, series: [{ name: 'Margin', values: SQ.filter(q => q.hotelRev).map(q => Math.round(q.hotelEbitda / q.hotelRev * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 45, source: 'Company decks' },
    ] },
    { exhibit: { type: 'table', title: 'Key legal entities (₹ crore)', head: ['Entity', 'FY25 revenue', 'FY26 revenue', 'FY26 EBITDA', 'Margin', 'Q1FY27 revenue / EBITDA'], rows: [
      ['UOH Inc (The Pierre, New York)', '816', '924', '27', '2.9%', '246 / 19'],
      ['UK entities (St James Court, London)', '556', '603', '127', '21.1%', '165 / 36'],
      ['PIEM Hotels (58.65%)', '628', '656', '192', '29.2%', '151 / 38'],
      ['Benares Hotels (51.97%, listed)', '141', '145', '65', '45.2%', '35 / 14'],
    ], source: 'Q4FY26 deck slide 52; Q1FY27 deck slide 33' } },
    { callout: `**So what:** the domestic owned hotels are an excellent business (standalone operating margin 42% in FY26) and their rate power is visible in every quarter. Growth from here is a mix of 7-9% like-for-like rate gains and new keys. We assume room revenue grows ${Math.round(X.BL.growth.room[0])}% / ${Math.round(X.BL.growth.room[1])}% / ${Math.round(X.BL.growth.room[2])}% (FY27-29E) and hotel margins edge up from 34.3% to ${n1(SEG.hotel.adjEbitda[2] / SEG.hotel.revenue[2] * 100)}%.` },
  ],
};

const fees = {
  id: 'fees', nav: 'Fees and growth brands', kicker: 'Asset-light growth', title: 'Management fees and the growth brands: the best part of the story, still under a tenth of hotel revenue',
  blocks: [
    { p: `Management fees grew from ₹399 cr (FY23) to ₹${n0(C.mgmtFeeHistory.FY26)} cr (FY26), 20% a year, and ${Q1.mgmtFeesGrowthPct}% in Q1FY27 (₹${Q1.mgmtFees} cr) despite weaker Dubai, Sri Lanka and Maldives hotels. Management guides "high-teens" growth on a pipeline of ~26,250 managed keys, about 1.4x today's managed inventory. Fees carry almost no cost, so they lift margins and returns: we estimate fees at ${n1(feeShare[0])}% of hotel revenue in FY27E rising to ${n1(feeShare[2])}% in FY29E (₹${n0(stream.fees[0])} cr → ₹${n0(stream.fees[2])} cr). The "new businesses" (Ginger, Qmin, ama, Tree of Life) reached ₹${n0(NB.FY26)} cr of revenue in FY26 (+25%); Ginger alone ₹${n0(NB.gingerConsRevFy26)} cr at a 44% EBITDAR margin (Ginger Mumbai Airport ₹105 cr at 56%), and ₹${Q1.gingerRev} cr in Q1FY27 (+${Q1.gingerGrowthPct}%).` },
    { pair: [
      { type: 'column', title: 'Managed rooms: +36% in a year with the ANK/Pride deal', unit: 'Managed operating rooms (Jun)', x: ['Jun-25', 'Jun-26'], series: [{ name: 'Full service', values: [PF.managedRooms.jun25.fullService, PF.managedRooms.jun26.fullService], fmt: 'num' }, { name: 'Select service (Ginger, Tree of Life)', values: [PF.managedRooms.jun25.selectService, PF.managedRooms.jun26.selectService], fmt: 'num' }], labels: 'all', source: 'Q1FY27 deck slide 15' },
      { type: 'column', title: 'New businesses: ₹158 cr (FY17) to ₹753 cr (FY26)', unit: 'Revenue of Ginger, Qmin, ama and Tree of Life, consolidated (₹ crore)', x: ['FY17', 'FY20', 'FY23', 'FY26'], series: [{ name: 'Revenue', values: [NB.FY17, NB.FY20, NB.FY23, NB.FY26], fmt: 'num' }], labels: 'all', source: 'Q4FY26 deck slide 29' },
    ] },
    { exhibit: { type: 'table', title: 'The 2025-26 deals: growth bought with 51% stakes', head: ['Deal', 'Date', 'Cost (₹ cr)', 'What IHCL got', 'What it means'], wide: [3, 4], rows: [
      ['ANK Hotels and Pride Hospitality (51%, via Ginger)', '1-Dec-25', '190', '81 operating and 66 pipeline Clarks hotels; 45+ brand-migration addendums signed by Jul-2026', 'Fast Ginger scale-up; 49% of their profit goes to minorities'],
      ['Atmantan wellness resort (51%)', '16-Jan-26', '232', 'A 97-key integrated wellness resort near Pune', '₹19 cr revenue in Q1FY27 (+19%); a premium wellness brand'],
      ['Brij Hospitality (51%)', '21-Apr-26', '≤222', '11 boutique hotels, 4 more opening in FY27', '₹11 cr revenue in Q1FY27'],
      ['Taj GVK (sold 25.52%)', '19-Dec-25', '+592', 'Exit from a JV; IHCL keeps the management contracts', '₹399 cr consolidated gain (exceptional)'],
    ], source: 'AR FY26 standalone notes 28-29; Q1FY27 deck slide 17; Q4FY26 call' } },
    { callout: '**Our read:** the asset-light engine is real and compounding, but it is still small next to the owned hotels: fees are ~8% of hotel revenue and, even at 18-19% a year, under 10% by FY29E. The 2025-26 deals add growth quickly but at 51%, so investors get roughly half of what the consolidated revenue line shows, and the integration of 80+ Clarks hotels into Ginger is still under way.' },
  ],
};

const tajsats = {
  id: 'tajsats', nav: 'TajSATS (air catering)', kicker: 'Segment: Air catering', title: 'TajSATS: a solid market leader in airline catering, but a lower-margin business that came in with the 2024 consolidation',
  blocks: [
    { p: `TajSATS (IHCL 51%, SATS of Singapore 49%) is India's largest airline caterer: management says it supplies over half of all meals served in the air. It became a subsidiary on 1-Aug-2024 after the shareholders' agreement was amended (IHCL booked a ₹307 cr fair-value gain). FY26 operating revenue was ₹1,210 cr with a 23.7% operating margin (a new airport levy passed through revenue costs ~1-2 pp of margin); Q1FY27 revenue rose only 3% to ₹${Q1.acOpRev} cr and the margin fell to ${Q1.acOpMarginPct}% as West Asia flight cuts hit international meals and the new Noida (Jewar) kitchen started up. Management expects growth to return to double digits within "three to six months" and then 15-20%. FY26 profit was ₹173 cr, of which ₹85 cr belonged to SATS.` },
    { pair: [
      { type: 'column', title: 'TajSATS revenue by quarter', unit: 'Air catering operating revenue (₹ crore)', x: SQ.filter(q => q.acRev).map(q => q.q), series: [{ name: 'Revenue', values: SQ.filter(q => q.acRev).map(q => q.acRev), fmt: 'num' }], labels: 'all', source: 'Company decks (consolidated from Aug-2024)' },
      { type: 'column', title: `Our forecast: margins back to ~23% by FY28E`, unit: 'Air catering EBITDA (₹ crore)', x: ['FY26', ...F.years], series: [{ name: 'EBITDA', values: [287, ...SEG.ac.adjEbitda.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Company; GAM estimates' },
    ] },
    { callout: `**How we value it:** at IHCL's 51% and the same EV/EBITDA multiple as the hotels (ICICI Securities' approach; Motilal Oswal uses 40x PAT), so SATS's 49% is never in our value. TajSATS is ~${Math.round(X.part(/^TajSATS/).value / X.V.sotp.equity * 100)}% of our equity value: it matters for growth optics more than for the target.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Moat: strong at the top (Taj, trophy assets), ordinary in the midscale',
  blocks: [
    { verdicts: [
      ['Brand', 'Strong', 'Taj rated India\'s strongest brand five years running (Brand Finance, value ~$900 m); loyalty (Tata Neu) 19 m members, points-earning revenue ₹875 cr.', 'Pricing power in luxury; helps sign management contracts.'],
      ['Irreplaceable assets', 'Strong', 'Owned palaces and city-centre hotels in Mumbai, Delhi, Udaipur, Jaipur, Goa; London and New York landmarks.', 'Cannot be replicated; supports rates through cycles.'],
      ['Scale and distribution', 'Good', '382 operating hotels, 645+ with pipeline; 40+ owners with more than one IHCL hotel.', 'Owners choose IHCL for the network; pipeline converts (~5,000 keys a year).'],
      ['Cost position', 'Average', 'Standalone margin 42%, but consolidated 33% with TajSATS, leases (license fees ₹385 cr) and The Pierre.', 'No structural cost edge outside India\'s owned hotels.'],
      ['Midscale (Ginger)', 'Weak-Average', 'Strong unit economics at Mumbai Airport (56% margin), but the segment has low barriers: Lemon Tree, Treebo, OYO and international select-service brands compete.', 'Growth, not a moat.'],
    ], head: ['Source', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'Q1FY27 call and deck; AR FY26; GAM Research' },
    { callout: '**Honest verdict:** IHCL has a genuine moat in luxury and upper-upscale India, where the brand and the buildings earn premium rates and win management contracts. That moat is worth a premium multiple over other Indian hotel companies, and the market gives it one. It does not protect earnings from travel shocks (Covid, 2026 West Asia), and it does not extend to Ginger or air catering.' },
  ],
};

module.exports = { hotels, fees, tajsats, moat };
