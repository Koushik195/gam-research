// Belrise Industries report, part 3: the two-wheeler core, cars/trucks and H-One, new verticals (aerospace, defence,
// renewables, tippers) and the trading arm, and the moat scorecard.
const X = require('./BELRISE.ctx');
const { C, D, SQ, QL, A26, A25, n0, n1, pc, lines } = X;
const qv = (q, k) => SQ.find(s => s.q === q)[k];
const gq = k => pc((qv('Q1FY27', k) / qv('Q1FY26', k) - 1) * 100);

const core = {
  id: 'core', nav: 'Two-wheelers', kicker: 'Segment: two- and three-wheelers', title: 'Two-wheelers: 82% of manufacturing revenue; growing, but behind the industry while the largest customer loses share',
  blocks: [
    { p: `Two- and three-wheeler parts brought in ₹${n0(A26.twoThreeW)} cr in FY26 (+${n1((A26.twoThreeW / A25.twoThreeW - 1) * 100)}%) and ₹${n0(qv('Q1FY27', 'twoThreeW'))} cr in Q1FY27 (${gq('twoThreeW')}). Belrise makes the chassis, exhaust, fuel tank, stands, foot rests and other metal parts, and increasingly suspensions and brakes. Content per two-wheeler rose 60-65% in FY25-26 (from ~₹12,000 to ~₹20,000 including the merging promoter companies), ~80% of it from in-house ("proprietary") products, per management. Two problems: the customer it grew up with has been losing market share to "a couple of OEMs who we do not work closely with right now" (Q1FY27 call), and electric bikes need no exhaust or fuel tank.` },
    { exhibit: { type: 'table', title: 'New two- and three-wheeler business announced since May-2026', head: ['Customer', 'What', 'Annual revenue (₹ cr)', 'Start'], wide: [1], rows: [
      ['Fast-growing 2W/3W OEM', 'Exhaust systems and fuel tanks (brownfield plant)', '~90', 'FY27'],
      ['Same OEM', 'Chassis system for a best-selling model (Bengaluru)', '65+', 'Q4FY27'],
      ['One of the largest 2W OEMs', 'Chassis for an existing model (Sambhajinagar)', '~50', 'Q4FY27'],
      ['Fast-growing 2W/3W OEM, all products', 'Run-rate incl. suspensions and brakes', '~200', 'FY27-28'],
      ['Vietnamese 2W maker entering India', 'Suspension and braking systems (5th suspension customer)', 'n.d.', 'n.d.'],
      ['Legacy 3W OEM (south India)', 'Complete brake assemblies', '"modest"', 'Q4FY27'],
    ], source: 'Q1FY27 call (17-Aug-2026); Q4FY26 call (25-May-2026: ₹220 cr and ₹90 cr peak-revenue exhaust orders from two OEMs)' } },
    { pair: [
      { type: 'column', title: '2W/3W revenue by quarter (₹ cr)', unit: '₹ crore', x: QL, series: [{ name: '2W/3W', values: SQ.map(q => q.twoThreeW), fmt: 'num' }], labels: 'all', source: 'Company decks (Q2-Q3FY26 not published by segment)' },
      { type: 'column', title: 'Powertrain-agnostic parts: ~71-73% of manufacturing revenue', unit: '% of manufacturing revenue', x: ['FY25', 'FY26', 'Q1FY26', 'Q1FY27'], series: [{ name: 'Powertrain-agnostic', values: [73.2, 73.4, 71.7, 70.8], fmt: 'pct' }, { name: 'ICE-only', values: [26.5, 25.4, 26.0, 23.7], fmt: 'pct' }], labels: 'all', source: 'Q4FY26 deck p10; Q1FY27 deck p8' },
    ] },
    { callout: '**So what:** this is a good business in a slow market. The new wins at the two faster-growing OEMs are real but start mostly in Q4FY27; until then, segment growth tracks the largest customer. Our manufacturing growth of {{as.lineBuild.mfgGrowth.0|pct0}} in FY27E assumes the wins arrive on time.' },
  ],
};

const fourWheel = {
  id: 'fourwheel', nav: 'Cars, trucks & H-One', kicker: 'Segment: cars and trucks', title: 'Cars and trucks: +35-37% in FY26 on the H-One purchase; still only 13% of manufacturing revenue',
  blocks: [
    { p: `Passenger-vehicle revenue was ₹${n0(A26.pv)} cr in FY26 (+${n1((A26.pv / A25.pv - 1) * 100)}%) and commercial vehicles ₹${n0(A26.cv)} cr (+${n1((A26.cv / A25.cv - 1) * 100)}%); in Q1FY27 ₹${n0(qv('Q1FY27', 'pv'))} cr (${gq('pv')}) and ₹${n0(qv('Q1FY27', 'cv'))} cr (${gq('cv')}). Most of the step-up came from H-One India (93% bought in Mar-2025 from a Japanese listed parent): high-tensile pressings and complex tools for Japanese car makers, plus a technology agreement with H-One Japan (concluded in Q1FY27) for steel up to 1,470 MPa. Management targets a doubling of 4W/CV revenue over two years. New: long members for heavy trucks (Pune), the 59-assembly localisation order for an Indian commercial EV (with tooling and automation, a new revenue line), and Hyva\'s tipper-body business (three plants, supplying all five big truck makers), bought for ~₹54 cr at ~3.6x EV/EBITDA, closing in Q3FY27.` },
    { pair: [
      { type: 'column', title: 'Cars and trucks by quarter (₹ cr)', unit: '₹ crore', x: QL, series: [{ name: 'Cars', values: SQ.map(q => q.pv), fmt: 'num' }, { name: 'Trucks/buses', values: SQ.map(q => q.cv), fmt: 'num' }], labels: 'all', source: 'Company decks' },
      { type: 'column', title: 'Share of manufacturing revenue (%)', unit: '% of manufacturing revenue', x: ['FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Cars', values: [4.4, 5.2, 4.6], fmt: 'pct' }, { name: 'Trucks/buses', values: [7.3, 8.3, 8.5], fmt: 'pct' }], labels: 'all', source: 'Company decks' },
    ] },
    { callout: '**So what:** this is the most credible diversification: real technology (H-One), real customers, and acquisitions bought cheaply (Hyva at ~3.6x EBITDA). But it starts from 13% of manufacturing revenue, and car and truck parts are a crowded, low-margin field; it will not change the group\'s profile before FY29.' },
  ],
};

const newVerticals = {
  id: 'newverticals', nav: 'Aerospace, defence, trading', kicker: 'New verticals and the trading arm', title: 'Aerospace, defence and solar: promising, tiny and partly loss-making; trading: a fifth of revenue at ~5% margin',
  blocks: [
    { bullets: [
      '**Chester Hall (UK, bought Q4FY26):** precision machining of aero-engine and aerostructure parts in titanium and aluminium for the world\'s largest aircraft maker and a French engine maker; single-source on several programmes. CY25 revenue ~GBP18.5m, EBITDA GBP2.1-2.2m, price GBP13.2m (~6x EV/EBITDA). Management is in "advanced discussion" to localise high-volume aero-engine parts in India.',
      '**SDM (France):** bought for EUR0.35m (FY27E revenue EUR3-4m); one-time loss of ₹9.5 cr in Q4FY26 on machinery overhaul, legal and staff costs; EBITDA positive expected in 2027.',
      '**Defence:** an alliance with Israel\'s Plasan Sasa (armoured vehicles); parts already exported to Israel, progress "gradual"; empanelled with one Israeli and two Indian defence makers.',
      '**Solar trackers (US customer):** sheet-metal assemblies for ~2.5 GW a year, from Q4FY27, up to ~₹150 cr a year at peak.',
      '**Target:** aerospace and defence at least 10% of revenue in the medium term, mostly through acquisitions funded by the QIP.',
    ] },
    { p: `**Trading of goods** was ₹${n0(A26.trading)} cr in FY26 (+${n1((A26.trading / A25.trading - 1) * 100)}%) at a ${n1(A26.tradingEbitda / A26.trading * 100)}% EBITDA margin (FY25 ${n1(A25.tradingEbitda / A25.trading * 100)}%), and fell 19% to ₹${n0(qv('Q1FY27', 'trading'))} cr in Q1FY27 as the Middle East conflict disrupted demand and shipping. We model ₹${n0(lines[0].trading)} / ${n0(lines[1].trading)} / ${n0(lines[2].trading)} cr at 4.5%. It adds revenue but little value; a further decline would lower revenue growth but raise the reported margin.` },
    { callout: '**So what:** investors are already paying for the aerospace story (the stock re-rated when the deals were announced). On the numbers, these units together are perhaps 3-5% of manufacturing revenue, partly loss-making, and their growth depends on deals not yet done. We give them no value beyond what is in our forecasts.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a strong operator, not a moat',
  blocks: [
    { verdicts: D.moat, head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (decks and calls to Aug-2026; AR FY26)' },
    { callout: '**Honest verdict: no durable moat.** Belrise is a well-automated, vertically integrated build-to-print supplier with long relationships, which gives it cost and quality advantages and sticky programmes. It does not own the design of most of what it makes, passes steel through at cost, and earns a ROCE of ~15%. The proprietary products and high-tensile technology could build a moat over time; today they are small.' },
  ],
};

module.exports = { core, fourWheel, newVerticals, moat };
