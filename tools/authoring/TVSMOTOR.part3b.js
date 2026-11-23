// TVS Motor report, part 3b: electric two-wheelers; exports and three-wheelers.
const X = require('./TVSMOTOR.ctx');
const { SG, D, BUILD, n0, n1 } = X;
const Q = SG.quarterly, E = D.industry.ev2W;
const evU = [11000, 97000, 193899, 278976, 371387, ...BUILD.map(b => Math.round(b.units.ev * 1000))];
const expU = [841000, 879000, 1253000, 1068000, 1013000, 1195488, 1584763, ...BUILD.map(b => Math.round(b.units.exp * 1000))];

const ev = {
  id: 'ev', nav: 'Electric two-wheelers', kicker: 'Segment: EVs', title: 'EVs: #1 in India with ~27% share, but competition is close and profits thin',
  blocks: [
    { p: `TVS sold 11,000 electric scooters in FY22 and ${n0(371387)} in FY26; Q1FY27 alone was ${n0(129940)} (+86%) and July-August another 120,000. The iQube (1mn+ built) and, since August 2025, the cheaper Orbiter made TVS the largest electric two-wheeler seller in FY26 with ${n1(E.fy26.tvsShare)}% of registrations (Bajaj ${n1(E.fy26.bajajShare)}%, Ather ${n1(E.fy26.atherShare)}%, Ola ${n1(E.fy26.olaShare)}%, Hero Vida ${n1(E.fy26.heroShare)}%), rising to ${n1(E.aug26.tvsShare)}% in August 2026. EV revenue was ~₹5,000 cr in FY26 (~11% of revenue) and ~₹1,780 cr in Q1FY27 (~13%).` },
    { pair: [
      { type: 'column', title: 'TVS EV volumes: 11k (FY22) to ~0.96mn (FY29E)', unit: "Electric 2W units ('000); FY27-29E = GAM", x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'EV units', values: evU.map(v => Math.round(v / 1000)), fmt: 'num', growth: true }], labels: 'all', highlight: 'FY26', source: 'Company releases; GAM estimates' },
      { type: 'line', title: 'Share of e-2W registrations: TVS up, Ola down', unit: 'Share of Vahan registrations (%)', x: ['FY25', 'FY26', 'Aug-26'], series: [{ name: 'TVS', values: [20.7, E.fy26.tvsShare, E.aug26.tvsShare], fmt: 'pct' }, { name: 'Bajaj', values: [20.1, E.fy26.bajajShare, E.aug26.bajajShare], fmt: 'pct' }, { name: 'Ather', values: [11.4, E.fy26.atherShare, E.aug26.atherShare], fmt: 'pct' }, { name: 'Ola', values: [29.2, E.fy26.olaShare, E.aug26.olaShare], fmt: 'pct' }], labels: 'ends', min: 0, max: 32, source: 'Vahan via Autocar Pro (13-Apr-2026, 1-Sep-2026)' },
    ] },
    { h: 'Three things that limit what EVs are worth to TVS' },
    { bullets: [
      '**Profit:** management says EV contribution is "becoming better and better quarter after quarter" but gives no EV margin. Part of the economics is the auto PLI (TVS: ~0.6-0.9% of total revenue), which ends in March 2028, and the PM E-DRIVE subsidy is now small (₹2,500/kWh, capped at ₹5,000 a vehicle, to Mar-2028).',
      '**Supply:** China\'s rare-earth magnet curbs (from Apr-2025) cut TVS EV dispatches from 28k in May-2025 to 14.4k in June-2025; volumes took until early 2026 to recover fully.',
      '**Competition and cannibalisation:** Bajaj (22.7% in Aug-2026), Ather (15.9%) and Hero Vida (10.5%) are close, and every iQube sold may be a Jupiter not sold. The EV gain partly replaces ICE profit rather than adding to it.',
    ] },
    { p: `**Forecast.** EV volumes ${n0(BUILD[0].units.ev * 1000)} in FY27E (+72%: Q1 130k and Jul-Aug 120k reported; capacity moving from 40k to 50k+ a month), then +25% and +20%. Revenue per EV −2% in FY27E and −1% a year after (Orbiter V1, battery-as-a-service plans). EV revenue ₹${n0(BUILD[0].ev)} cr in FY27E and ₹${n0(BUILD[2].ev)} cr in FY29E (${n1(BUILD[2].ev / BUILD[2].total * 100)}% of revenue).` },
  ],
};

const exportsCh = {
  id: 'exports', nav: 'Exports & three-wheelers', kicker: 'Segment: international business', title: 'Exports: a quarter of revenue and the clearest structural edge',
  blocks: [
    { p: `International business (two- and three-wheelers shipped from India) sold ${n0(1584763)} vehicles in FY26 (+33%) for revenue of ~₹11,280 cr, and ${n0(468354)} in Q1FY27 (+33%) for ₹3,634 cr, ~26% of revenue. The workhorse is the HLX commuter motorcycle (100-150cc), built for African taxi use, which crossed 5mn units in 13 years (the last 1mn in one year). Africa has recovered from its 2022-24 currency crises; Latin America and the Middle East are the new focus; Apache, Ronin, Raider and iQube/Orbiter are being added market by market. PT TVS in Indonesia (a subsidiary, 0.20mn units in FY26) supplies ASEAN scooters and is not in these numbers.` },
    { pair: [
      { type: 'column', title: 'Exports: 0.84mn (FY20) to ~2.4mn (FY29E)', unit: "International business units, 2W + 3W ('000); FY27-29E = GAM", x: ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Exports', values: expU.map(v => Math.round(v / 1000)), fmt: 'num', growth: true }], labels: 'all', highlight: 'FY26', source: 'Company releases; GAM estimates' },
      { type: 'column', title: 'International business revenue: ₹2,487 cr to ₹3,634 cr a quarter', unit: 'International business revenue (₹ crore)', x: Q.filter(q => q.ibRevenue).map(q => q.q), series: [{ name: 'IB revenue', values: Q.filter(q => q.ibRevenue).map(q => q.ibRevenue), fmt: 'num' }], labels: 'all', source: 'Earnings calls Q1FY26-Q1FY27' },
    ] },
    { p: `**Three-wheelers.** TVS sold 219,060 three-wheelers in FY26 (+63% vs industry +28%) and 66,697 in Q1FY27 (+48%), ~72% of them exported (King, King Kargo). At home it is building a position in electric passenger and cargo three-wheelers (EV penetration of the category crossed 40% in Q1FY27), with a Hyundai co-development deal and capacity going from 0.25mn to 0.42mn a year. It is still only 3.7% of TVS units; Bajaj dominates the segment.` },
    { p: `**Forecast.** Two-wheeler exports +23% in FY27E (Q1 +32%, Jul-Aug +28% reported), then +12% and +10%; three-wheelers +30%, +15%, +12%. Export revenue per vehicle +7% in FY27E (Q1FY27 ran at ~₹77,600 vs ₹71,200 in FY26: mix, rupee, three-wheelers) and +3% a year after. Export revenue ₹${n0(BUILD[0].exp)} cr in FY27E and ₹${n0(BUILD[2].exp)} cr in FY29E. Risks: African currencies, fuel prices after the West Asia conflict (some markets saw petrol up 50-60%), container lead times (+15% in Q4FY26).` },
  ],
};

module.exports = { ev, exports: exportsCh };
