// Hero MotoCorp report, part 2b: segment chapters (commuter motorcycles; scooters and VIDA; premium, exports and parts).
const X = require('./HEROMOTOCO.ctx');
const { SG, SQ, QL, Q1, FY26, n0, n1, pc, lakh, seg, PARTS, VB, baseReal } = X;
const yrsF = ['FY26', 'FY27E', 'FY28E', 'FY29E'];
const segTable = (keys, title, src) => ({ exhibit: { type: 'table', title, head: ['', ...yrsF, 'Why (GAM)'], wide: [5], rows: keys.flatMap(k => { const s = seg(k); return [
  { sec: s.name },
  ['Units (lakh)', ...s.units.map(u => lakh(u)), ''],
  ['Growth', '', ...s.growth.map(g => pc(g)), X.rup(s.why || '')],
  ['Net revenue per unit (₹)', ...s.real.map(r => n0(r)), s.key === 'ev' || s.key === 'exports' ? 'Disclosed/derived base' : 'GAM estimate (price index)'],
  ['Revenue (₹ cr)', ...s.rev.map(r => n0(r)), ''],
]; }), source: src || 'FY26 units: SIAM via Emkay; realisations and forecasts: GAM Research (see Assumptions)' } });

const core = {
  id: 'core', nav: 'Commuter motorcycles', kicker: 'Segment: commuter motorcycles', title: 'Commuter motorcycles: a near-monopoly in a segment that is losing share of the market',
  blocks: [
    { p: `Hero sold ${lakh(seg('entry').units[0] + seg('deluxe').units[0] + seg('m125').units[0])} lakh entry, deluxe and 125cc motorcycles in India in FY26, ~84% of its volume and, we estimate, ~65% of revenue. In 100-110cc (Splendor, Passion) its share rose from 87% in FY21 to 96.4% in Q1FY27: nine of ten buyers choose Hero for mileage, reliability and resale value. In Q1FY27 deluxe volume grew 20.5%, Splendor 15% and 125cc 45% (share back to 17.7% from 12.8% a year earlier on Glamour X and Xtreme 125R), while entry HF Deluxe fell 19% as buyers traded up after the GST cut. Hero added 2,000 units a day of Splendor capacity in Q1FY27 and launched E20-E85 flex-fuel Splendor and HF Deluxe versions in July.` },
    { pair: [
      { type: 'line', title: '100-110cc share at a record 96%; 125cc recovering', unit: 'Hero share of domestic segment, SIAM (%)', x: QL, series: [{ name: '100-110cc', values: SQ.map(q => q.shareExecPct), fmt: 'pct' }, { name: 'Entry 100cc', values: SQ.map(q => q.shareEconomyPct), fmt: 'pct' }, { name: '125cc', values: SQ.map(q => q.share125Pct), fmt: 'pct' }], labels: 'last', min: 0, max: 100, source: 'SIAM via Emkay Research' },
      { type: 'column', title: 'Domestic motorcycles: 43 lakh (FY22, Covid-hit) to 55 lakh', unit: "Domestic motorcycle dispatches (lakh)", x: SG.annual.map(a => a.fy), series: [{ name: 'Domestic motorcycles', values: SG.annual.map(a => +lakh(a.domMc)), fmt: 'n1' }], labels: 'all', source: 'SIAM via Emkay Research' },
    ] },
    { p: 'The problem is the segment, not Hero\'s position in it. Commuter motorcycles were 42% of industry volume in FY21 and 32% in Q1FY27, as rising incomes push buyers to scooters, 125cc and premium bikes and as women and urban buyers choose scooters. Entry (economy) bikes have shrunk to 5% of the market. Price increases since February 2026 (~4.5%) and higher fuel prices test affordability; Hero cut the price of one HF Deluxe variant in some states in July to pull first-time buyers back. Electrification is not an immediate threat here (no affordable electric commuter bike yet, long rural rides, heavy loads), but Hero itself plans electric motorcycles from FY28.' },
    segTable(['entry', 'deluxe', 'm125'], 'Our commuter motorcycle forecasts'),
    { callout: `**So what:** this is the cash engine. We assume deluxe volume +8% in FY27E (Q1 strength, then a high post-GST base and a weak monsoon) and 3-4% after, 125cc +7-15%, and entry bikes shrinking 5-12% a year. Net realisation rises with the ~5% price increases already taken. The risk is the rural cycle: the 2026 monsoon ended ~13% short, and the entry and deluxe buyer is the first to delay a purchase.` },
  ],
};

const scooters = {
  id: 'scooters', nav: 'Scooters & VIDA', kicker: 'Segment: scooters and electric', title: 'Scooters and VIDA: growing fast from far behind; VIDA still loses ~₹230 cr a quarter',
  blocks: [
    { p: `Scooters are 31.5% of the market and Hero's share was only 4.6% (ICE) in Q1FY26. Since then Destini 125 and the Xoom range lifted ICE scooter dispatches 84% in Q1FY27 (share 6.9%); Destini capacity has been doubled and Xoom raised 50%, with channel stock at half the normal level. In electric scooters VIDA's VAHAN registrations rose from 18,783 (FY24) to 50,800 (FY25) and 1,49,341 (FY26); Q1FY27 dispatches were ${n0(Q1.vidaUnits)} (+151%) and retail is now >20,000 a month (~11% share, #4 behind TVS, Bajaj and Ather). The low-cost VX2 with battery-as-a-service (from ₹0.9 a km) and removable batteries drove the jump; Hero was also less hit than rivals by the 2025 rare-earth magnet shortage.` },
    { pair: [
      { type: 'line', title: 'Share gains in both ICE and electric scooters', unit: 'Hero share, SIAM wholesale (%)', x: QL, series: [{ name: 'ICE scooters', values: SQ.map(q => q.shareIceScPct), fmt: 'pct' }, { name: 'Electric scooters', values: SQ.map(q => q.shareEvPct), fmt: 'pct' }], labels: 'all', min: 0, max: 14, source: 'SIAM via Emkay Research' },
      { type: 'column', title: 'VIDA retail: 19k a year to 1.5 lakh in two years', unit: 'VIDA VAHAN registrations (units)', x: ['FY24', 'FY25', 'FY26'], series: [{ name: 'Registrations', values: [18783, 50800, 149341], fmt: 'num' }], labels: 'all', source: 'AR FY26' },
    ] },
    { p: `VIDA is still a cost centre. Management puts the "P&L investment" at ~₹220 cr in Q4FY26 and ~₹230 cr in Q1FY27, a 2.4-2.6 point drag on group margin; the EBITDA loss per unit fell from ~₹50,000 to ~₹40,000. EV revenue was ~₹660 cr in Q1FY27 (5% of revenue). Three levers: PLI (₹48 cr accrued in Q1FY27 on 60% of the range; ~13% of EV revenue once the whole range qualifies by Dec-2026), scale (capacity ~30k a month from August, ~45k by Q4FY27) and cost reduction; some models are already gross-margin positive and management aims for breakeven "by the end of the year". Electric motorcycles (Ubex, VXZ with Zero Motorcycles) come only from FY28.` },
    segTable(['scooter', 'ev'], 'Our scooter and VIDA forecasts'),
    { callout: '**So what:** Hero has gone from irrelevant to credible in scooters within a year, helped by capacity it now has. But it is a follower: TVS, Bajaj and Ather each sell more e-scooters, and Hero owns a third of Ather, its competitor. We model VIDA at ~2.8 lakh units in FY27E and losses narrowing to ~₹900 cr for the year, inside our 13.7% group margin.' },
  ],
};

const growth = {
  id: 'growth', nav: 'Premium, exports & parts', kicker: 'Segments: premium, exports, parts', title: 'Premium, exports and parts: parts is the hidden gem; premium remains a gap',
  blocks: [
    { p: `**Premium (>125cc)** is the most profitable part of the market (13.5% of industry volume) and Hero's weakest: ${n0(seg('premium').units[0])} units in FY26 and a 1.5% share in Q1FY27, down from 3.8% in FY21. The Harley-Davidson X440 range (made by Hero) grew 26% in FY26, helped by the new X440T variant; the Xtreme 250R and Mavrick 440 did not move share. A new premium head (ex-Royal Enfield) took over in Aug-2026 with "many" launches promised over 12 months. **Exports** (${lakh(seg('exports').units[0])} lakh units, ~₹3,500 cr in FY26) grew ~40% a year in FY25-26 and 63% in Q1FY27, then fell 14% in July and 24.5% in August 2026. Hero entered Germany and Ecuador in 2026; Colombia, Bangladesh and Nepal are the core markets.` },
    { p: `**Parts, accessories and merchandise (PAM)** earned ₹${n0(FY26.sparePartsSales)} cr in FY26 (AR, consolidated; ~₹6,200 cr per management), 14% of revenue, and grew 30% in Q1FY27 (₹${n0(Q1.partsRevenue)} cr) and ~25% in July. Management estimates that about half of Hero-parts demand is still met by the grey market; the ₹750 cr second parts centre at Tirupati (foundation stone 1-Jul-2026, commissioning by end-2027) more than doubles capacity. Parts carry well above-average margins, which is why ICE margins held at 15.9% despite the commodity hit.` },
    { pair: [
      { type: 'column', title: 'Exports: 3 lakh to 4 lakh units, but volatile', unit: "Export dispatches (lakh)", x: [...SG.annual.map(a => a.fy), 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Exports', values: [...SG.annual.map(a => +lakh(a.exports)), ...seg('exports').units.slice(1).map(u => +lakh(u))], fmt: 'n1' }], labels: 'all', source: 'SIAM via Emkay; GAM estimates' },
      { type: 'column', title: `Parts revenue: ₹${n0(PARTS[0])} cr to ₹${n0(PARTS[3])} cr by FY29E`, unit: 'Spare parts revenue (₹ crore)', x: ['FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Parts', values: PARTS.map(Math.round), fmt: 'num' }], labels: 'all', source: 'AR FY26; GAM estimates' },
    ] },
    segTable(['premium', 'exports'], 'Our premium and export forecasts'),
    { callout: `**So what:** parts (+20% in FY27E, +12% after) is the most reliable growth line and supports margins. Exports and premium are options, not certainties: we assume exports +8% in FY27E after the August fall and +12% after, premium +12-15% a year from a tiny base. If the new premium portfolio works, it would be the clearest upside to our numbers.` },
  ],
};

module.exports = { core, scooters, growth };
