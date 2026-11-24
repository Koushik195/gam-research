// ITC Hotels report, part 3: owned hotels, managed growth and fees, Colombo (ITC Ratnadipa and Sapphire Residences), moat scorecard.
const X = require('./ITCHOTELS.ctx');
const { C, F, SEG, n0, n1, Q1, FY26, SA, SQ, stream, feeShare, YRS } = X;
const PF = C.portfolio, mgn = (k, i) => Math.round(SEG[k].adjEbitda[i] / SEG[k].revenue[i] * 1000) / 10;

const hotels = {
  id: 'hotels', nav: 'Owned hotels', kicker: 'Segment: hotels', title: 'The owned luxury hotels make most of the money: RevPAR ~1.3x the industry, ~35% margins, but rate growth has slowed to mid-single digits',
  blocks: [
    { p: `The hotels segment (everything except the Colombo apartments) earned ₹${n0(ann('FY26').hotelRev)} cr of revenue and ₹${n0(ann('FY26').hotelEbitda)} cr of EBITDA in FY26 (34.6%). Rooms were ₹${n0(FY26.streams.room)} cr (+${FY26.streamGrowthPct.room}%), food and beverage ₹${n0(FY26.streams.fnb)} cr (+${FY26.streamGrowthPct.fnb}%; ITC's restaurants, Bukhara, Dum Pukht, Avartana, are a real draw for weddings and banquets), management fees ₹${FY26.streams.fees} cr (+${FY26.streamGrowthPct.fees}%) and other income from operations ₹${FY26.streams.others} cr. The owned hotels ran at an average room rate (ARR) of ~₹${n0(FY26.arr)} (+${FY26.arrGrowthPct}%) and RevPAR of ~₹${n0(FY26.revpar)} (+${FY26.revparGrowthPct}%), a ${FY26.revparPremiumPct}% premium to the luxury-upscale market (CoStar). In Q1FY27 rooms grew ${Q1.streamGrowthPct.room}% (rate +${Q1.arrGrowthPct}%, occupancy +${Q1.occChangeBps} bps to ${Q1.occPct}%) after a weak April (West Asia conflict); F&B +${Q1.streamGrowthPct.fnb}%, fees +${Q1.streamGrowthPct.fees}%; the margin rose ${Q1.marginExReChangeBps} bps to ${Q1.marginExRePct}%.` },
    { pair: [
      { type: 'stacked', title: 'Rooms and F&B are ~90% of hotel revenue', unit: 'Hotels ex-real estate revenue (₹ crore); FY27E-29E GAM', x: ['FY25', 'FY26', ...YRS], series: [{ name: 'Rooms', values: [ann('FY25').room, ann('FY26').room, ...stream.room.map(Math.round)], fmt: 'num' }, { name: 'Food & beverage', values: [ann('FY25').fnb, ann('FY26').fnb, ...stream.fnb.map(Math.round)], fmt: 'num' }, { name: 'Management fees', values: [ann('FY25').fees, ann('FY26').fees, ...stream.fees.map(Math.round)], fmt: 'num' }, { name: 'Others', values: [ann('FY25').others, ann('FY26').others, ...stream.others.map(Math.round)], fmt: 'num' }], minLabel: 300, source: 'Q4FY26 deck slide 16 (FY25 derived from FY26 growth rates); GAM estimates' },
      { type: 'line', title: 'Hotel margin: ~35% a year, seasonally ~30% in Q1', unit: 'EBITDA margin, hotels ex-real estate (%)', x: ['FY25', 'FY26', 'Q1FY26', 'Q1FY27', ...YRS], series: [{ name: 'Hotels', values: [34.0, 34.6, 30.0, 31.3, ...YRS.map((_, i) => mgn('hotel', i))], fmt: 'pct' }], labels: 'all', min: 20, max: 40, source: 'Company decks; GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'Owned-hotel KPIs (consolidated, owned hotels)', head: ['', 'FY26', 'Growth', 'Q1FY27', 'Growth'], rows: [
      ['Average room rate (₹)', n0(FY26.arr), `+${FY26.arrGrowthPct}%`, n0(Q1.arr), `+${Q1.arrGrowthPct}%`],
      ['RevPAR (₹)', n0(FY26.revpar), `+${FY26.revparGrowthPct}%`, n0(Q1.revpar), `+${Q1.revparGrowthPct}%`],
      ['Occupancy', '~73%', `+${(FY26.occChangeBps / 100).toFixed(1)} pp`, `${Q1.occPct}%`, `+${(Q1.occChangeBps / 100).toFixed(1)} pp`],
      ['RevPAR premium to luxury-upscale market (CoStar)', `${FY26.revparPremiumPct}%`, '', `${Q1.revparPremiumPct}% (YTD May-26)`, ''],
    ], source: 'Q4FY26 deck slides 16-17; Q1FY27 deck slides 9, 11 (ARR and RevPAR rounded to the nearest ₹10 by the company)' } },
    { callout: `**Our read:** these are some of India's best hotels (ITC Maurya, ITC Grand Chola, ITC Maratha, ITC Gardenia, ITC Grand Bharat), and the RevPAR premium is real. But the growth engine is modest: FY26 room rates rose ${FY26.arrGrowthPct}% and Q1FY27 ${Q1.arrGrowthPct}%, and most growth in the owned hotels now comes from occupancy and food. We forecast rooms +${BL('room', 0)}% / +${BL('room', 1)}% / +${BL('room', 2)}% (FY27-29E, incl. ~200 acquired keys at Ahmedabad and Kumarakom and ~220 new keys at Bhubaneswar and Puri) and a hotel margin of ${mgn('hotel', 0)}% → ${mgn('hotel', 2)}%.` },
  ],
};
function ann(fy) { return SA.find(a => a.fy === fy); }
function BL(k, i) { return X.AS.businessLines.hotel.growth[k][i]; }

const fees = {
  id: 'managed', nav: 'Managed growth & fees', kicker: 'Segment: managed hotels', title: `Management fees are the growth engine: ₹${FY26.streams.fees} cr in FY26 (+28%), ~4% of hotel revenue, aiming for 2.5x FY25 by FY30`,
  blocks: [
    { p: `ITC Hotels runs ~8,600 keys for other owners under Welcomhotel, Fortune, Storii, Mementos and WelcomHeritage (60% of operating keys) and has ${PF.jun26.managedPipelineHotels} managed hotels with ${n0(PF.jun26.managedPipelineKeys)}+ keys signed. It signed a record 33 hotels (3,300+ keys) in FY26 and 8 more in Q1FY27. Fees were ₹${FY26.streams.fees} cr in FY26 (+28%) and ₹${Q1.streams.fees} cr in Q1FY27 (+${Q1.streamGrowthPct.fees}%). The target is 2.5x FY25 fees by FY30 (~₹340 cr), and ~15,000 managed keys by 2031 (12% a year). Fees need no capital and carry almost no cost, which is why every brokerage sees them as the re-rating story.` },
    { pair: [
      { type: 'column', title: 'Fees grow ~20% a year in our forecast', unit: 'Management fees (₹ crore); FY27E-29E GAM', x: ['FY25', 'FY26', ...YRS], series: [{ name: 'Fees', values: [ann('FY25').fees, ann('FY26').fees, ...stream.fees.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Q4FY26 deck; GAM estimates' },
      { type: 'stacked', title: 'Brands: Fortune and Welcomhotel carry the pipeline', unit: 'Keys at 30-Jun-2026', x: PF.brands.map(r => r[0]), series: [{ name: 'Operating', values: PF.brands.map(r => r[2]), fmt: 'num' }, { name: 'Pipeline', values: PF.brands.map(r => r[4]), fmt: 'num' }], minLabel: 300, source: 'Q1FY27 deck slide 40' },
    ] },
    { callout: `**But keep it in proportion:** even at our ~20% a year, fees reach ₹${n0(stream.fees[2])} cr in FY29E, ${n1(feeShare[2])}% of hotel revenue. IHCL earns ~4x as much in fees (₹685 cr in FY26). Most of ITC Hotels' managed keys are midscale (Fortune, Welcomhotel) in tier-2 and tier-3 cities, where fees per key are low. Even if fees carried no cost at all, they would be only ~${Math.round(stream.fees[2] / F.ebitda[2] * 100)}% of FY29E EBITDA: the owned hotels remain the business.` },
  ],
};

const colombo = {
  id: 'colombo', nav: 'Colombo: hotel and apartments', kicker: 'Segment: real estate', title: 'Colombo: ITC Ratnadipa now makes money; Sapphire Residences has ~₹1,240 cr of apartments still to sell',
  blocks: [
    { p: `ITC's biggest single project was a mixed-use development on the Galle Face seafront in Colombo, owned by WelcomHotels Lanka (100%): **ITC Ratnadipa** (352 keys, opened in FY25, EBITDA-positive in FY26 and again in Q1FY27, with the city's highest RevPAR) and **Sapphire Residences** (132 apartments designed with Philippe Starck's YOO). Handovers started in Q3FY26: the real-estate segment booked ₹${ann('FY26').reRev} cr of revenue and ₹${ann('FY26').reEbitda} cr of EBITDA in FY26 and ₹${Q1.reRevenue} cr / ₹${Q1.reEbitda} cr in Q1FY27. ${C.accounting.realEstate.split('.')[0]}. The unsold stock (₹${n0(X.INV)} cr of inventory at cost at Mar-2026) is the swing item: the AR FY26 says elevated Sri Lankan real-estate taxes have tempered sales momentum, and the Sri Lankan rupee's fall cut equity by ₹210 cr through OCI in Q1FY27 alone.` },
    { pair: [
      { type: 'column', title: 'Apartment handovers: lumpy', unit: 'Real-estate segment revenue (₹ crore)', x: SQ.map(q => q.q).slice(4), series: [{ name: 'Revenue', values: SQ.slice(4).map(q => q.reRev), fmt: 'num' }, { name: 'EBITDA', values: SQ.slice(4).map(q => q.reEbitda), fmt: 'num' }], labels: 'all', source: 'Q3FY26, Q4FY26 and Q1FY27 decks' },
      { type: 'column', title: 'We expect ₹160-180 cr a year of handovers', unit: 'Real-estate revenue (₹ crore); FY27E-29E GAM', x: ['FY26', ...YRS], series: [{ name: 'Revenue', values: [ann('FY26').reRev, ...SEG.re.revenue.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'GAM estimates' },
    ] },
    { callout: `**How we value it:** apartment EBITDA is not a recurring hotel profit, so it gets no hotel multiple. We value the unsold inventory at 80% of book (₹${n0(X.INV * 0.8)} cr, ~₹${n0(X.INV * 0.8 / X.sh)} a share; bull 90%, bear 70%) for time and Sri Lankan sales risk, and keep the margin on units we expect to hand over by Sep-28E in our net cash.` },
  ],
};

module.exports = { hotels, fees, colombo };
