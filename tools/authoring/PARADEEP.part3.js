// Paradeep initiation, part 3: industry, tailwind test, phosphatic fertilisers, urea and trading,
// backward integration and projects.
const X = require('./PARADEEP.ctx');
const { C, D, F, B, n0, n1, SRC, SA, SQ, QL, Q1, Y26, ept } = X;
const SRCNAME = { paContract: 'Fertilizer Daily', q1fy27call: 'Q1FY27 call', plVisit: 'PL plant visit', dapIpl: 'Fertilizer Daily (IPL)', dapSep: 'Fertilizer Daily', q4fy26call: 'Q4FY26 call', ar26: 'Annual report FY26' };

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Indian phosphatics: steady demand, imported inputs, and a subsidy that sets the margin',
  blocks: [
    { p: 'India uses ~24 mt of phosphatic fertilisers a year: ~10 mt of DAP and ~14 mt of NPK complexes, of which the 20:20:0:13 grade, Paradeep\'s lead product, is 6-7 mt. Demand grows slowly (farmer-level sales +~1% in Q1FY27) and depends on the monsoon and on farm prices. Two features set the economics. **Inputs are imported:** India buys most of its rock phosphate, much of its phosphoric acid and most of its sulphur and ammonia abroad, and 70-75% of world sulphur and ammonia trade passes the Strait of Hormuz, which the 2026 Middle East crisis disrupted. **The margin is a policy outcome:** the government fixes the NBS subsidy per kg of nutrient each season and holds the DAP price at ₹1,350 a bag, so in a cost spike it decides how much the industry absorbs. In Q1FY27 industry DAP+NPK production fell 21% and imports 38% because Kharif rates (+~10%) did not cover the cost jump (Coromandel\'s Q1 call).' },
    { exhibit: { type: 'table', title: 'Raw-material and product prices, 2026', head: ['Item', 'Price', 'Date', 'Source'], wide: [1], rows: C.inputs.map(i => [i.item, i.value, i.published, i.src.split('; ').map(k => SRCNAME[k] || k).join('; ')]), source: 'Company calls, Prabhudas Lilladher, Fertilizer Daily (IPL tenders, weekly market), annual report FY26' } },
    { exhibit: { type: 'table', title: 'Market forces at 30-Sep-2026', head: ['Theme', 'Direction', 'What it means for Paradeep'], wide: [2], rows: [
      ['Middle East crisis: sulphur $1,000+/t, ammonia ~$850/t, phosphoric acid $1,700/t for Jul-Sep 2026', 'Headwind', 'Costs up 25%+; own acid at Paradeep and OCP supply cushion part of it, Goa and Mangalore buy acid.'],
      ['Kharif 2026 NBS +~10% (N ₹47.32, P ₹52.76, S ₹3.16 per kg); rabi 2026-27 not announced by 30-Sep', 'Headwind (pending)', 'H2FY27 margin depends on the rabi rates; management expects partial government support.'],
      ['DAP: MRP ₹1,350 a bag plus ₹3,500/t support and import-price compensation (reported extended through rabi)', 'Mixed', 'DAP is the most profitable product under this policy, so Paradeep tilted to DAP (+55% in Q1); it gives up some NPK mix.'],
      ['Urea: tighter energy norms (30-Jul-2026); new investment policy for new plants', 'Mixed', 'Goa +₹1,500/t, Mangalore −₹700-800/t (management); ~0.8 mt of urea a year.'],
      ['2026 monsoon 87% of normal; east & north-east 74%, south peninsula 76%', 'Headwind', 'Rabi demand risk in the east and south, Paradeep\'s core markets.'],
      ['Shift to balanced nutrition and NPKs; QR-code tracking of fertiliser sales', 'Tailwind (slowed in 2026)', 'Favours a leading NPK maker, but the ₹1,000 a bag DAP-NPK price gap pushed farmers back to DAP in 2026.'],
    ], source: 'Company calls (May/Jul-2026), Cabinet NBS approval (Apr-2026), Fertilizer Daily (Aug-2026), CRISIL (Aug-2026), IMD (Sep-2026)' } },
    { bullets: [D.industry[1], D.industry[7]].map(i => i.point) },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Paradeep wins share and volume, but price spikes do not reach its margin',
  blocks: [
    { verdicts: [
      ['Shift from straight fertilisers to NPK complexes', 'Yes', 'NPK incl. TSP +22% to 2.46 mt in FY26 while industry NPK fell 1%; NPK 20:20:0:13 1.45 mt.', 'Core of the franchise; slowed in 2026 by the DAP-NPK price gap.'],
      ['Import substitution in phosphoric and sulphuric acid', 'Partly (from FY28)', 'Paradeep site integrated; sulphuric acid +0.6 mt in FY26; phosphoric acid 0.5 → 0.7 mt by Sep-2027, 1.0 mt with the big project.', 'Lifts EBITDA/t by 30-35% only once all three sites are integrated.'],
      ['Higher world fertiliser prices', 'No', 'Revenue per tonne +30% in Q1FY27, but management guides ₹5,000/t for FY27 vs ₹5,300 in FY26.', 'Under NBS, price spikes squeeze before policy catches up.'],
      ['Government push for domestic supply and DAP availability', 'Yes', 'DAP top-up and price compensation; Paradeep shifted production to DAP (+55% in Q1FY27).', 'Protects DAP margins, but these are policy choices that can be reversed.'],
      ['Consolidation in phosphatics', 'Yes', 'Goa plant (2022) and MCFL (2025) took capacity from 2.6 mt to 3.7 mt.', 'Growth has come from deals; both were related-party (Adventz group) transactions.'],
      ['Non-subsidy chemicals', 'Not yet', '₹250 cr aluminium fluoride plant (revenue ₹180-200 cr, EBITDA ~₹50 cr, in ~2 years); target 20% of EBITDA long term.', 'About 2% of FY29E EBITDA if delivered.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

const phos = {
  id: 'phosphatics', nav: 'DAP & NPK', kicker: 'Business line', title: 'DAP and NPKs: a share-gainer with good logistics, at the mercy of the subsidy table',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Phosphatic volumes: NPK 20:20:0:13 leads, DAP jumped in Q1FY27', unit: 'Sales volume (\'000 tonnes)', x: QL, series: [{ name: 'DAP', values: SQ.map(q => Math.round(q.volDap / 1000)), fmt: 'num' }, { name: 'NPK 20:20:0:13', values: SQ.map(q => Math.round(q.volN20 / 1000)), fmt: 'num' }, { name: 'Other NPK & SSP', values: SQ.map(q => Math.round(q.volOtherNpk / 1000)), fmt: 'num' }], minLabel: 110, source: 'Company data compiled by Prabhudas Lilladher' },
      { type: 'column', title: 'Company-stated EBITDA per tonne (blended, incl. other income)', unit: '₹ per tonne', x: ['Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'FY26', 'Q1FY27'], series: [{ name: 'EBITDA/t', values: [6600, 5200, 4700, 5700, 5300, 7000], fmt: 'num' }], labels: 'all', source: 'Earnings calls Jul-2025 to Jul-2026 (company, rounded)' },
    ] },
    { bullets: [
      '**Volume and share.** Manufactured phosphatic sales (DAP + NPK + SSP) were 2.72 mt in FY26 (Q2FY26 alone 0.78 mt); with traded DAP and TSP, DAP was 0.76 mt and NPK incl. TSP 2.46 mt. In FY26 Paradeep\'s NPK grew 10% when the industry\'s fell 1%; in Q1FY27 its farmer-level phosphatic sales grew 15-16% against ~1% for the industry. It runs its plants at ~100% of capacity in normal years (3.67 mt produced in FY26).',
      '**Mix moves with policy.** In Q1FY27 DAP sales rose 55% and NPKs fell 9%: with DAP held at ₹1,350 a bag and topped up by the government, DAP was more profitable than NPKs, whose prices had to rise ₹400-500 a bag. Management calls this a "small-term tactical shift"; farmers return to NPKs when the bag-price gap narrows to ~₹200 (from ~₹1,000).',
      `**Margins.** Company-stated EBITDA per tonne was ₹5,300 in FY26 (₹4,700 in Q3, ₹5,700 in Q4) and ~₹7,000 in Q1FY27 on cheap stock. Management's FY27 guide is ~₹5,000; we use ₹${n0(B.ebitdaPerTonne[0])} on the Screener basis.`,
      '**Inputs.** Paradeep is "almost fully" integrated in phosphoric and sulphuric acid at its own site; Goa and Mangalore buy phosphoric acid (both make their own ammonia from gas). Sulphur is bought spot ($1,000+ at end-July); 20-30% of Paradeep\'s sulphur and all of Mangalore\'s come from Indian refineries (IOC, MRPL). Rock and acid come mostly from OCP.',
    ] },
    { callout: `**Our view:** a well-run, share-gaining phosphate maker with no pricing power. Our build takes total volume from 4.21 mt to ${B.volumeMt.join(' / ')} mt (FY27-29E) and EBITDA per tonne to ₹${B.ebitdaPerTonne.map(v => n0(v)).join(' / ₹')}: FY27 absorbs the cost spike and a heavier trading mix; FY28-29 gain from phase-1 acid and debottlenecking, but stay below management's ₹7,000+ until the big project runs. Every ₹500/t of EBITDA moves FY28E EPS by ~₹${n1(B.volumeMt[1] * 500 / 10 * (1 - 0.252) / 103.75)} (~${Math.round(B.volumeMt[1] * 500 / 10 * (1 - 0.252) / 103.75 / F.eps[1] * 100)}%).` },
  ],
};

const urea = {
  id: 'urea', nav: 'Urea & trading', kicker: 'Business line', title: 'Urea and trading: a steady cost-plus line and a low-margin buffer',
  blocks: [
    { p: `**Urea (~0.8 mt a year at Goa and Mangalore).** Urea prices and costs are controlled: gas is a pass-through (~$14/MMBtu in Q4FY26, $18-19 in May-2026) and the government pays a return under plant energy norms. Profit therefore comes from efficiency. Goa's energy-saving project (6.4 → 6.1 Gcal/t, phase 1 done, phase 2 commissioning, phase 3 in H1FY29) is worth ₹1,000-1,200/t; under the norms announced on 30-Jul-2026 Goa gains ~₹1,500/t and Mangalore loses ₹700-800/t (management). Mangalore earns ~₹6,000-6,500/t after a naphtha-to-gas incentive (worth ~₹3,000/t) expired. Urea sales were 0.84 mt in FY26 and 0.20 mt in Q1FY27 (−16%; the Goa energy-project shutdown ran from February to late April 2026); with supportive policy each plant can make 0.44-0.45 mt.` },
    { p: `**Trading (0.64 mt in FY26, 0.13 mt in Q1FY27).** Paradeep imports DAP, TSP, MOP and ammonium sulphate (largely from OCP companies and Kofert) to fill its portfolio and, in 2026, to cover lost production. Management secured ~0.5 mt of imports for rabi and says trading will be "significantly higher" than last rabi's ~0.27 mt. Trading earns ~₹2,000/t, a third of manufacturing, so a bigger trading share dilutes EBITDA per tonne even if total volume rises; we model ${B.tradedMt[0]} mt of trading in FY27.` },
    { pair: [
      { type: 'column', title: 'Urea sales: ~0.2 mt a quarter', unit: 'Urea sales (\'000 tonnes)', x: QL, series: [{ name: 'Urea', values: SQ.map(q => Math.round(q.volUrea / 1000)), fmt: 'num' }], labels: 'all', source: 'Company data compiled by Prabhudas Lilladher' },
      { type: 'column', title: 'Trading spiked to 0.34 mt in Q2FY26; we model 0.95 mt for FY27', unit: 'Traded products (\'000 tonnes)', x: [...QL, 'FY27E'], series: [{ name: 'Traded', values: [...SQ.map(q => Math.round(q.volTraded / 1000)), Math.round(B.tradedMt[0] * 1000)], fmt: 'num' }], labels: 'all', source: 'Company data compiled by Prabhudas Lilladher; GAM estimate' },
    ] },
  ],
};

const projects = {
  id: 'projects', nav: 'Backward integration', kicker: 'Projects', title: 'Backward integration: the right strategy, funded with debt and running late',
  blocks: [
    { p: 'The plan is to make all three sites self-sufficient in phosphoric and sulphuric acid and to add granulation. Done: 0.6 mt of sulphuric acid (Paradeep Sep-2025, Mangalore Mar-2026), a 350 TPD evaporator (Dec-2025) and Goa energy phase 1. Next: phosphoric acid phase 1 (0.5 → 0.6 mt by Dec-2026, 0.7 mt by Aug-Sep 2027) and granulation debottlenecking (3.7 → 4.0 mt, Dec-2026). Then the ₹3,600 cr programme announced in Nov-2025: a 1.0 mt granulation train at Paradeep, 0.3 mt more phosphoric acid with matching sulphuric acid, and more sulphuric acid at Mangalore. In Nov-2025 management said this would be complete by end-FY28; in Jul-2026 it said "one shot", around Q2FY29-FY30, with "final commercial discussions" still going on. Separately, a ₹250 cr aluminium fluoride plant was approved in Q1FY27.' },
    { exhibit: { type: 'table', title: 'Projects (as stated by 30-Sep-2026)', head: ['Project', 'Cost (₹ cr)', 'Status / timing'], wide: [0, 2], rows: C.capex.projects.map(p => [p.project, p.cost ? (typeof p.cost === 'number' ? n0(p.cost) : p.cost) : 'n.d.', p.status]), source: 'Company calls (Nov-2025 to Jul-2026), annual report FY26, Prabhudas Lilladher; n.d. = not disclosed' } },
    { pair: [
      { type: 'column', title: 'Capex: ₹868 cr in FY26; we model ~₹3,900 cr over FY27-29E', unit: 'Capex (₹ crore)', x: 'fin.labels', from: 'FY19', series: [{ name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'all', source: 'Screener.in, GAM Research estimates' },
      { type: 'column', title: 'Depreciation: ₹403 cr (FY26) → ~₹570 cr (FY29E)', unit: 'Depreciation & amortisation (₹ crore)', x: 'fin.labels', from: 'FY19', series: [{ name: 'D&A', ref: 'fin.dep', fmt: 'num' }], labels: 'all', source: 'Screener.in, GAM Research estimates' },
    ] },
    { callout: `**Our view:** the logic is sound. Management cites a ~$150/t captive advantage on phosphoric acid and a ₹1,500-3,000/t saving on own sulphuric acid depending on sulphur prices, and +30-35% EBITDA per tonne once all sites are integrated (₹5,000 → ~₹6,500-6,750). But at today's sulphur prices the saving on own acid shrinks (₹1,500-2,000/t, management), the timetable has slipped about a year, and the bill (~₹3,900 cr of capex in FY27-29E in our model, ~70% debt) lands before the benefit. We give phase-1 acid and debottlenecking credit in FY28-29E (₹${n0(B.ebitdaPerTonne[1])} / ₹${n0(B.ebitdaPerTonne[2])} per tonne) and almost none of the big project before FY30 (FY29E manufactured volume 4.05 mt vs 4.0 mt of debottlenecked capacity).` },
  ],
};

module.exports = { industry, tailwind, phos, urea, projects };
