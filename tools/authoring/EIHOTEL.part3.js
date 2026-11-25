// EIH report, part 3: hotels (brands, RevPAR, renovations), flight catering and the pipeline, Wildflower Hall, moat.
const X = require('./EIHOTEL.ctx');
const { C, F, SQ, n0, n1, Q1, FY26 } = X;
const K = C.kpis.FY26, PF = C.portfolio, gr = (a, b) => `+${Math.round((a / b - 1) * 1000) / 10}%`;

const hotels = {
  id: 'hotels', nav: 'The hotels', kicker: 'Core business: hotels', title: 'The hotels: rate leadership in every market, growth held back by closures and renovations',
  blocks: [
    { p: `EIH's hotels charge more per room than anyone in their markets. In FY26 the Oberoi hotels (all domestic, incl. managed) earned RevPAR of ₹${n0(K.oberoiRevpar)} (${gr(K.oberoiRevpar, K.oberoiRevparPy)}) against ₹11,549 for India's luxury segment (+6.4%), an RGI (revenue share vs the competitive set) of ${K.rgiOberoi}; Tridents earned ₹${n0(K.tridentRevpar)} (${gr(K.tridentRevpar, K.tridentRevparPy)}) vs ₹6,996 for upper-upscale (+4.9%), RGI ${K.rgiTrident}. Owned hotels ran at ${K.ownedOccPct}% occupancy with RevPAR ~₹${n0(K.ownedRevpar)} (+${K.ownedRevparGrowthPct}%). In Q1FY27 owned RevPAR rose to ₹${n0(Q1.ownedRevpar)} from ₹${n0(Q1.ownedRevparPy)} (${gr(Q1.ownedRevpar, Q1.ownedRevparPy)}); Trident (${gr(10490, 9221)}) beat Oberoi (+${Q1.oberoiRevparGrowthPct}%; +${Q1.oberoiExRajgarhPct}% without Rajgarh) because Oberoi hotels have more foreign guests and Mumbai was strong.` },
    { pair: [
      { type: 'column', title: 'Q1FY27 RevPAR: Trident outgrew Oberoi', unit: 'RevPAR, all domestic hotels incl. managed, Q1 (₹)', x: ['Oberoi Q1FY26', 'Oberoi Q1FY27', 'Trident Q1FY26', 'Trident Q1FY27'], series: [{ name: 'RevPAR', values: [14869, 16090, 9221, 10490], fmt: 'num' }], labels: 'all', source: 'Q1FY27 deck slides 6-7 (CoStar)' },
      { type: 'column', title: 'Quarterly revenue: winter is the season', unit: 'Revenue from operations, consolidated (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'Revenue', values: SQ.map(q => q.consRev), fmt: 'num' }], labels: 'all', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'What is closed, ramping or being renovated', head: ['Asset', 'Keys', 'Status at 30-Sep-2026', 'Effect on our numbers'], wide: [2, 3], rows: [
      ['The Oberoi Grand, Kolkata', '209 (197 after)', 'Closed for restoration; structural and fire-safety work; Kolkata construction halt; reopening ~Sep-2028', 'No revenue in FY27-28E; part-year FY29E'],
      ['Trident, Jaipur', '132', 'Closed for renovation', 'Owned by EIH Associated Hotels (associate income)'],
      ['The Oberoi Rajgarh Palace, Khajuraho', '65', 'Opened Nov-2025; summer is slow, ~3 years to stabilise', 'Dilutes FY27E margin; Q1 margin ex-Rajgarh 30.6% vs 29% (company basis)'],
      ['Trident Nariman Point, The Oberoi Mumbai, The Oberoi Bengaluru, Trident BKC', '120 + floor by floor + 18 + 57', 'Room renovations in Q1-Q2, finished before October', 'Q1 write-offs ₹7.5 cr; little lost revenue (lean season)'],
      ['Wildflower Hall, Shimla', '85', 'Owned by the State; EIH operating on interim terms; auction under way', 'Kept in our base case; lost in the bear case'],
    ], source: 'Q1FY27 deck and call (12-Aug-2026); Q4FY26 call (29-May-2026)' } },
    { callout: '**So what:** the existing hotels are compounding RevPAR at ~10% a year, which is the whole of our revenue growth until FY29. That is a good business with no volume growth. EIH\'s problem is not demand or pricing; it is that its room count barely moves.' },
  ],
};

const ofs = {
  id: 'ofs', nav: 'Flight catering & pipeline', kicker: 'Other businesses and growth', title: 'Flight catering adds revenue at lower margins; the pipeline is real but arrives after FY28',
  blocks: [
    { p: `**Oberoi Flight Services** caters for domestic and international airlines from Mumbai, Delhi, Chennai and Kolkata. It is inside the F&B line and the single reported segment; the company gave revenue only on calls (~₹145 cr in Q4FY26, ₹${Q1.ofsRev} cr in Q1FY27, "very healthy growth" from new flights and direct international services). It is profitable but carries an airport levy (₹${n1(FY26.airportLevy)} cr in FY26 vs ₹${n1(FY26.airportLevyPy)} cr) and lower margins than the hotels, which is one reason consolidated margin fell in FY26. We do not value it separately (no disclosed profit); it sits inside group EBITDA and multiple.` },
    { exhibit: { type: 'table', title: 'Owned pipeline (company years of opening)', head: ['Project', 'Keys', 'Opening', 'Note'], wide: [3], rows: [
      ...PF.pipelineOwned.list.map(([n, k, y]) => [n, String(k), y, /Visakhapatnam/.test(n) ? 'Owned by EIH Associated Hotels (associate)' : /Hebbal/.test(n) ? 'Hebbal, Bengaluru: two hotels and ~7.6 lakh sq ft of commercial, retail and F&B space (~1.3 m sq ft in all)' : /Goa/.test(n) ? 'MD & CEO: rely on the annual report dates' : '']),
      { hl: true, cells: ['**Total owned**', `**${n0(PF.pipelineOwned.keys)}**`, '2027-30', '~20% more keys than today'] },
      ['Managed pipeline', n0(PF.pipelineManaged.keys), '2026-31', '23 properties; 1,520 keys due in 2029-30; one 60-key hotel slipped beyond 2032 in Q1FY27'],
    ], source: 'Q1FY27 deck slides 22-23 and call; AR FY26 MD&A' } },
    { pair: [
      { type: 'column', title: 'Capex rises with the pipeline', unit: 'Capex (₹ crore); FY27-29E GAM', x: ['FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'Capex', values: [138, 222, 485, 696, ...F.capex.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Screener.in; management guide ₹600-700 cr a year, higher towards FY29-30' },
      { type: 'column', title: 'Rooms drive our revenue growth', unit: 'Revenue by stream, FY26 vs FY29E (₹ crore)', x: ['Rooms', 'F&B incl. flight catering', 'Other services'], series: [{ name: 'FY26', values: [FY26.room, FY26.fnb, FY26.otherServices].map(Math.round), fmt: 'num' }, { name: 'FY29E', values: [X.stream.room[2], X.stream.fnb[2], X.stream.other[2]].map(Math.round), fmt: 'num' }], labels: 'all', source: 'AR FY26 note 30; GAM estimates' },
    ] },
    { callout: `**So what:** the pipeline would lift EIH's keys by roughly a fifth (owned) and add ~1,800 managed keys, but almost all of it opens in FY29-31. Our forecasts include the Grand from FY29E and nothing for Goa, London, Tirupati or Hebbal before FY29; the capex for them is in our numbers now. That is why near-term returns on new capital look weak.` },
  ],
};

const wildflower = {
  id: 'wildflower', nav: 'Wildflower Hall', kicker: 'Key risk', title: 'Wildflower Hall: a trophy resort EIH no longer owns, an auction it must win, and a ₹102 cr net charge already taken',
  blocks: [
    { p: C.mashobra },
    { exhibit: { type: 'table', title: 'FY26 exceptional items (₹ crore, before tax)', head: ['Item', '₹ crore'], rows: [
      ...C.exceptionalFy26.map(([k, v]) => [k, (v >= 0 ? '+' : '−') + n1(Math.abs(v))]),
      { hl: true, cells: ['**Total exceptional items**', '**−132.1**'] },
    ], source: 'AR FY26 consolidated note 37 and note 47A' } },
    { callout: '**How we treat it:** we keep Wildflower Hall\'s current contribution in our base case (EIH has operated it since Apr-2025 on interim terms and is bidding) and take it out in the bear case. EIH does not disclose the resort\'s revenue or profit, so we cannot size the risk precisely. Even a win under a new long-term contract is unlikely to be as profitable as the old ownership, because the State now owns the asset and will want a share of its earnings.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Moat: the strongest luxury product in India; small scale and few contracts limit it',
  blocks: [
    { verdicts: [
      ['Brand and service', 'Strong', `Oberoi RGI ${K.rgiOberoi} and Trident RGI ${K.rgiTrident} (FY26); 14 of 15 benchmarked hotels rank 1st or 2nd; Michelin Keys, Travel + Leisure and Condé Nast awards every year.`, 'Pricing power at the top end, through cycles.'],
      ['Irreplaceable assets', 'Strong', 'Owned Vilas resorts (Agra, Udaipur, Jaipur, Ranthambhore), The Oberoi New Delhi and Mumbai, Trident Nariman Point; freehold of the Mumbai land bought in FY26.', 'Cannot be replicated; supports rates.'],
      ['Scale and distribution', 'Weak', `~${n0(PF.keysIndia + PF.keysIntl)} keys vs IHCL's ~33,600; managed pipeline ${n0(PF.pipelineManaged.keys)} keys.`, 'Fewer owners sign with EIH; growth needs EIH\'s own capital.'],
      ['Cost position', 'Average', 'Consolidated margin 35-37%; labour-intensive service model; management is cutting working hours (higher staff cost).', 'No cost edge; the edge is price.'],
      ['Flight catering', 'Average', 'Established kitchens at four big airports; lower margins and an airport levy.', 'A business, not a moat.'],
    ], head: ['Source', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'Q4FY26 and Q1FY27 decks and calls; AR FY26; GAM Research' },
    { callout: '**Honest verdict:** EIH has a genuine moat in its product: guests pay the highest rates in India for Oberoi hotels and the hotels earn them back in occupancy. That moat protects margins, not growth. Without a large managed pipeline or many new owned hotels, the moat earns a premium return on a fixed set of rooms, and travel shocks (Covid, 2026) pass straight through.' },
  ],
};

module.exports = { hotels, ofs, wildflower, moat };
