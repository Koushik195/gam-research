// Hero MotoCorp report, part 2: what the company does, history & corporate actions, industry, tailwind test.
const X = require('./HEROMOTOCO.ctx');
const { C, D, SG, FY26, n0, n1, pc, rup, lakh, BUILD, TOT } = X;
const u26 = k => BUILD.find(s => s.key === k).units[0], sh = k => Math.round(u26(k) / TOT[0].units * 100);
const RS = SG.retailShare;

const business = {
  id: 'business', nav: 'What Hero does', kicker: 'The business', title: 'What Hero does: 65 lakh two-wheelers a year, three-quarters of them 100cc-class commuter bikes',
  blocks: [
    { p: `Hero designs, makes and sells motorcycles and scooters, and the spare parts for the ~130 million Hero vehicles sold since 1984. FY26 consolidated revenue was ₹${n0(FY26.consRevenue)} cr: ₹${n0(FY26.twoWheelerSales)} cr from vehicles (82%), ₹${n0(FY26.sparePartsSales)} cr from spare parts (14%) and ₹${n0(FY26.services + FY26.otherOperating)} cr from services and export incentives. It has six plants in India plus Colombia and Bangladesh, ~8.63 mn units of capacity and 14,000+ customer touchpoints, with a point of sale in 93% of India's talukas. The parent company (standalone) is ~99% of the group; subsidiaries in Colombia, Bangladesh, the US and a German R&D centre added ~₹580 cr of revenue in FY26.` },
    { p: `Volume is concentrated in one product family. Of 64.7 lakh units in FY26, ${sh('deluxe')}% were 100-110cc Splendor and Passion motorcycles, ${sh('entry')}% entry HF Deluxe, ${sh('m125')}% 125cc (Glamour, Super Splendor, Xtreme 125R), ${sh('premium')}% premium (>125cc: Xtreme 160R/250R, Xpulse, Karizma, Mavrick, Harley-Davidson X440), ${sh('scooter')}% ICE scooters, ${sh('ev')}% VIDA electric scooters and ${sh('exports')}% exports to 53 countries.` },
    { pair: [
      { type: 'hbar', title: 'FY26 volume: 59% Splendor-type 100-110cc bikes', unit: "Units by segment, FY26 (lakh)", x: ['100-110cc deluxe', 'Entry 100cc', '125cc', 'ICE scooters', 'Exports', 'VIDA (EV)', 'Premium >125cc'], series: [{ name: 'Units', values: ['deluxe', 'entry', 'm125', 'scooter', 'exports', 'ev', 'premium'].map(k => +lakh(u26(k))), fmt: 'n1' }], labels: 'all', source: 'SIAM via Emkay Research' },
      { type: 'hbar', title: 'FY26 revenue: vehicles 82%, parts 14%', unit: 'Revenue, FY26 (₹ crore)', x: ['Two-wheelers', 'Spare parts', 'Services', 'Other operating'], series: [{ name: 'Revenue', values: [FY26.twoWheelerSales, FY26.sparePartsSales, FY26.services, FY26.otherOperating].map(Math.round), fmt: 'num' }], labels: 'all', source: 'AR FY26, consolidated note 27' },
    ] },
    { exhibit: { type: 'table', title: 'Business lines', head: ['Line', 'Main brands', 'FY26 volume / revenue', 'Position'], wide: [3], rows: [
      ['Entry and deluxe motorcycles (97-110cc)', 'HF Deluxe, Splendor+, Super Splendor (125), Passion', `${lakh(u26('entry') + u26('deluxe'))} lakh units`, '~96% of the 100-110cc segment, ~55% of entry'],
      ['125cc motorcycles', 'Glamour, Xtreme 125R, Super Splendor XTEC', `${lakh(u26('m125'))} lakh`, '19% share in Q4FY26 after slipping to 12.8% in Q1FY26'],
      ['Premium motorcycles', 'Xtreme 160R/250R, Xpulse 210, Karizma, Mavrick 440, Harley-Davidson X440', `${n0(u26('premium'))} units`, '~2% share; Royal Enfield, Bajaj and TVS lead'],
      ['ICE scooters', 'Destini 125, Xoom 110/125/160, Pleasure+', `${lakh(u26('scooter'))} lakh`, '6.3% share (Q4FY26), 6.9% in Q1FY27'],
      ['Electric scooters', 'VIDA V2, VX2', `${lakh(u26('ev'))} lakh dispatched; 1,49,341 VAHAN registrations`, '#4 with ~11%'],
      ['Exports', 'Splendor, HF, Hunk, Xpulse, Xoom', `${lakh(u26('exports'))} lakh; ~₹3,500 cr`, 'Colombia, Bangladesh, Nepal, Mexico, Africa; Germany from 2026'],
      ['Parts, accessories, merchandise', 'Hero Genuine Parts, riding gear', `₹${n0(FY26.sparePartsSales)} cr (+6%)`, 'High margin; ~half of demand still served by grey market'],
    ], source: 'Company AR FY26 and calls; SIAM via Emkay' } },
    { callout: '**So what:** Hero is a 100-110cc motorcycle company with a large, very profitable parts business. That product is cheap (₹56,000-80,000 ex-showroom), fuel-efficient and bought mainly by rural and first-time buyers. Hero\'s fortunes therefore follow farm incomes, fuel prices and the price gap between a motorcycle and the alternatives, and its growth depends on segments where it is still small: scooters, EVs, 125cc and premium.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'History: from Hero Honda to Hero MotoCorp, and from leader to defender',
  blocks: [
    { exhibit: { type: 'table', title: 'Milestones and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(r => r.map(rup)), source: 'Company annual reports and filings; GAM Research' } },
    { p: 'Two things stand out. First, Hero lost share for a decade after Honda left in 2011: domestic share fell from ~37% in FY21 to ~27% now, as Honda, TVS and Bajaj won scooters, 125cc and premium buyers while Hero stayed with 100cc commuters. Second, Hero has been an investor more than a builder in new technology: it backed Ather from 2016 and launched its own VIDA only in 2022. The Ather bet has paid off on paper (₹1,425 a share at 30-Sep-2026 against an IPO price of ₹321); VIDA is now growing fast but still loses ~₹230 cr a quarter.' },
    { callout: '**Leadership churn:** three CEOs in five years (Niranjan Gupta from May-2023 to Apr-2025, Vikram Kasbekar acting, Harshavardhan Chitale from Jan-2026), new heads for EV (2025), technology (May-2026) and premium (Aug-2026). The new team has delivered share gains in scooters and EVs within nine months, but it is too early to judge the strategy.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: GST-boosted demand, a fast-rising EV share and a shift away from commuter bikes',
  blocks: [
    { exhibit: { type: 'table', title: 'What is changing in Indian two-wheelers', head: ['Theme', 'Evidence', 'Source'], wide: [1], rows: D.industry.themes.map(r => r.map(rup)), source: 'See table' } },
    { pair: [
      { type: 'line', title: 'Retail share: Hero leads, TVS closing in', unit: 'VAHAN retail share (%)', x: RS.periods, series: [{ name: 'Hero', values: RS.hero, fmt: 'pct' }, { name: 'Honda', values: RS.honda, fmt: 'pct' }, { name: 'TVS', values: RS.tvs, fmt: 'pct' }, { name: 'Bajaj', values: RS.bajaj, fmt: 'pct' }], labels: 'last', source: RS.src },
      { type: 'column', title: 'E-scooter retail doubled in a year', unit: "Industry e-2W VAHAN registrations ('000 a month)", x: SG.evRetail.months, series: [{ name: 'Industry', values: SG.evRetail.industry.map(v => Math.round(v / 1000)), fmt: 'num' }], labels: 'ends', source: SG.evRetail.src },
    ] },
    { p: 'Three forces matter for Hero. **Affordability**: the GST cut lowered the price of a Splendor by ~₹6,800 and lifted festive 2025 retail; Hero\'s VAHAN share hit 31.6% in Oct-2025. But price increases since February 2026 (~4.5% blended) and the weak monsoon now work the other way. **Mix**: buyers are moving to scooters (31.5% of the market), 125cc and premium bikes, and exports (21%), where Hero is small. **Electrification**: e-scooters were 11.2% of retail in July 2026; commuter motorcycles are not yet electrifying (no product, use case of long rural rides, heavy loads), which protects Hero\'s core for now. Management expects FY27 industry growth to approach double digits.' },
    { callout: '**So what:** the industry is growing faster than at any time since FY19, but the growth is in the parts of the market where Hero is weakest. Hero\'s share of the total (including exports) slid from 31% in FY21 to 23% in Q1FY27 even as its volumes hit records.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: the GST cut reached Hero; premiumisation and exports largely did not',
  blocks: [
    { verdicts: [
      ['GST cut (Sep-2025)', 'Reaches Hero', 'FY26 volume +9.6%; Q3FY26 +16%, Q4FY26 +24%, Q1FY27 +23%; 100cc share to 96%; entry segment back to growth briefly.', 'The biggest single driver of FY26-27; fades from H2FY27 as the base catches up.'],
      ['Rural recovery', 'Partly', 'Good 2024-25 monsoons helped; the 2026 monsoon ended ~13% below normal, the weakest since 2015.', 'A risk to H2FY27 entry and deluxe demand.'],
      ['Scooterisation', 'Partly', 'ICE scooter share 4.6% (Q1FY26) to 6.9% (Q1FY27) on Destini and Xoom; capacity doubled.', 'Gains are real but from a low base; Honda (Activa) and TVS (Jupiter) lead.'],
      ['EV adoption', 'Partly', 'VIDA ~11% of e-2W retail; volumes +151% in Q1FY27; still loss-making; Hero also owns ~32% of Ather.', 'Hero participates twice (VIDA and Ather) but leads in neither.'],
      ['Premiumisation', 'No', 'Premium share 1.5% in Q1FY27 (3.8% in FY21) despite Harley X440 and Xtreme 250R.', 'Hero misses the most profitable growth segment.'],
      ['Exports', 'Partly', '+39% in FY26 and +63% in Q1FY27, then -14% and -24.5% in Jul/Aug-26; share of Indian exports ~7%.', 'Volatile; Bajaj and TVS are far larger exporters.'],
    ], head: ['Tailwind', 'Does it reach Hero?', 'Evidence', 'So what'], title: 'Does the sector tailwind reach Hero?', source: 'SIAM/VAHAN via Emkay; company calls; IMD' },
    { callout: '**Verdict:** Hero gets the volume tailwind (tax cut, demand recovery) because it owns the entry market, but not the mix tailwind (premium, scooters, exports) that lifts realisations and margins for peers. That is a large part of why Hero trades at ~19x trailing earnings while Eicher, TVS and Bajaj trade at 25-48x.' },
  ],
};

module.exports = { business, history, industry, tailwind };
