// Chambal initiation, part 3: industry, tailwind test, urea, and the Gadepan-III reset.
const X = require('./CHAMBLFERT.ctx');
const { C, D, F, AS, n0, n1, SRC, SA, SQ, QL, SEGY, SEGL, A26, Q1, UB, g3Annual, g3Eps, mult, epsSep28, price, segF, br } = X;
const ind = D.industry;
const uF = segF('urea');
const per1000 = UB.g3VolumeLakhT * 1000 / 100 * (1 - AS.taxRate[1] / 100) / F.shares; // EPS per ₹1,000/t of G-III EBITDA
const sens = [0, 1500, 3000, 4500].map(c => { const e = epsSep28 + (UB.g3CutPerT - c) / 1000 * per1000; return { c, eps28: F.eps[1] + (UB.g3CutPerT - c) / 1000 * per1000, tp: Math.round(e * mult / 10) * 10 }; });
const iifl = br('IIFL Capital');

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Indian fertilisers: India is short of urea, and the government sets the returns',
  blocks: [
    { p: `India used ${ind.urea.consumption} mt of urea in FY26, but made only ${ind.urea.productionFY26} mt (${ind.urea.productionFY25} mt in FY25) and imported ${ind.urea.importsFY26} mt (${ind.urea.importsFY25} mt). Urea sales have grown ~${ind.urea.cagr5y}% a year over five years, so the gap is widening, which is why the government approved a new investment policy for 8-9 more gas-based plants (NIPU-2026, 15-Jul-2026). In phosphates the dependence is larger: ${ind.dap.importShare}% of the ${ind.dap.salesFY26} mt of DAP sold in FY26 was imported. Three features matter for Chambal. **First, urea returns are administered**: the farm price is fixed, gas is pooled and passed through, and a producer earns a regulated return plus whatever it saves against energy norms. **Second, traded P&K margins depend on the subsidy table** (NBS rates per kg of N, P, K and S, revised each season) and on buying ahead of price rises. **Third, the subsidy bill is a fiscal choice**: ₹1.71 lakh cr was budgeted for FY27 against ₹1.86 lakh cr spent in FY26, before the West Asia war lifted input prices (Elara put the likely outgo at ₹2.19-2.83 lakh cr).` },
    { exhibit: { type: 'table', title: 'India\'s urea and DAP balance (million tonnes)', head: ['', 'FY25', 'FY26', 'Note'], wide: [3], rows: [
      ['Urea production', n1(ind.urea.productionFY25), n1(ind.urea.productionFY26), 'Lower in FY26: gas disruption in March, plant shutdowns'],
      ['Urea imports', n1(ind.urea.importsFY25), n1(ind.urea.importsFY26), 'Almost doubled'],
      ['Urea sales', '38.8', n1(ind.urea.consumption), '~3.8% a year over FY21-26'],
      ['DAP sales', n1(ind.dap.salesFY25), n1(ind.dap.salesFY26), `${ind.dap.importShare}% of FY26 supply imported`],
      ['DAP imports', n1(ind.dap.importsFY25), n1(ind.dap.importsFY26), 'Domestic DAP output 3.9 mt'],
    ], source: 'Fertiliser Association of India data via Chambal Annual Report 2025-26 (MD&A)' } },
    { exhibit: { type: 'table', title: 'Market forces at 30-Sep-2026', head: ['Theme', 'Direction', 'What it means for Chambal'], wide: [0, 2], rows: [
      ['West Asia war (from March 2026): ammonia US$850-900/t, sulphur US$900-950/t, urea import price ~US$900/t in May; Chambal\'s gas US$17.25/mmBtu in Q1FY27 (US$14.6 in Q3FY26)', 'Mixed', 'Gas is passed through; high import prices lift Gadepan-III (until December) and above-capacity output; traded P&K bought later costs more.'],
      ['Kharif 2026 NBS rates: N ₹47.32, P ₹52.76, S ₹3.16 per kg (+~10%), set before the price spike; Rabi 2026-27 rates pending', 'Headwind (pending)', 'Q1 traded margin was protected by stock bought from January; H2 depends on the Rabi rates.'],
      [`2026 monsoon ${ind.monsoon2026.allIndia}% of normal, but north-west India ${ind.monsoon2026.northwest}% and central India ${ind.monsoon2026.central}%; June sowing −23%, caught up in July`, 'Neutral for Chambal', 'Its strongest markets (Rajasthan, Madhya Pradesh, Punjab, Haryana) had a near-normal season, unlike the south (76%).'],
      ['NIPU-2026: 8-9 new plants, ROE band 12-16%, fixed costs in rupees after four years', 'Option, low return', 'Chambal is best placed for a brownfield plant; returns are below NIP-2012.'],
      ['TAN: Russian export curbs, prices ~40% up in May; new domestic capacity in 1-2 years', 'Tailwind now, fading', 'Good start for the TAN plant; a long market from FY28-29 is likely.'],
      ['States restricting urea/DAP purchases per farmer (e-token pilots; Madhya Pradesh suspended its scheme in July)', 'Watch', 'Could curb urea and DAP overuse in Chambal\'s core states.'],
    ], source: 'Company calls (Feb/May/Jul-2026), Cabinet NBS approval (8-Apr-2026), NIPU-2026 (15-Jul-2026), IMD (30-Sep-2026)' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Chambal captures volume shifts, not price spikes',
  blocks: [
    { verdicts: [
      ['India\'s urea shortage and the push for new plants', 'Option only', 'Fourth plant ready to go (land, water, rail, gas approval); not approved by 30-Sep.', 'Growth from FY31 at a 12-16% ROE band.'],
      ['High global urea prices', 'Partly, until December', 'Gadepan-III\'s NIP-2012 price rises with gas; above-capacity output paid up to import parity.', 'The best part ends with the eight-year period.'],
      ['Shift from DAP to NPK, balanced nutrition', 'Yes, in volume', 'NPK sales 2.13 → 5.83 lakh t (FY25-26); ammonium sulphate launched.', 'Trading margin ~4%: adds revenue, little profit.'],
      ['High phosphate and sulphur prices', 'No', 'Traded margin −4.0% in FY23; 13.7% in Q1FY27 only on pre-war stock.', 'Price spikes hurt importers once old stock is gone.'],
      ['Mining and infrastructure (explosives)', 'Yes, from FY27', '2.4 lakh t TAN plant; Indian demand ~1.2 mt, growing 6-7%.', 'Chambal\'s first unregulated product.'],
      ['Biologicals and speciality nutrients', 'Partly', 'CPC & SN revenue +30% (FY26), biologicals +57%; ~6% biologicals share.', 'Good margins (23%) on a small base (₹1,203 cr).'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

const urea = {
  id: 'urea', nav: 'Urea', kicker: 'Segment', title: 'Urea: full plants, low energy use, and a profit set by formula',
  blocks: [
    { pair: [
      { type: 'column', title: 'Urea revenue by quarter', unit: 'Revenue (₹ crore)', x: QL, series: [{ name: 'Urea', values: SQ.map(q => Math.round(q.ureaRev)), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'Urea PBIT: steady except in turnaround quarters', unit: 'Segment PBIT (₹ crore)', x: QL, series: [{ name: 'PBIT', values: SQ.map(q => Math.round(q.ureaEbit)), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { bullets: [
      `**Full plants.** Sales of ${SA.map(a => `${n1(a.ureaSales)}`).join(', ')} lakh t (FY21-26). The plants run above 100% of capacity on a two-year turnaround cycle (management wants three). Q1FY27 sales fell to ${n1(Q1.ureaSales)} lakh t (8.41) because the Gadepan-I turnaround and an extended Gadepan-II shutdown overlapped; Gadepan-III sold ${n1(Q1.g3Sales)} lakh t of it.`,
      '**Low energy use is the edge.** Gadepan-I and II run 4-6% below the government\'s energy norms and Gadepan-III 2-3% below (Q3FY26 call); the saving is kept. Norms tighten over time, so this needs continuing investment (₹160-180 cr of routine capex a year, e.g. turbines and CO2 compressors).',
      `**Gas is a pass-through.** Realisation rose from ₹36,893/t (FY26) to ₹46,885/t in Q1FY27 as gas rose to US$17.25/mmBtu (provisional). That higher revenue is cost recovery, not profit: Q1 EBITDA per tonne did rise (to ~₹8,500 incl. ammonia, Elara's estimate, from ~₹6,500), but because Gadepan-III was a larger share of a smaller volume, the rupee was weaker and surplus ammonia sold well. High gas mainly raises working capital (the subsidy is paid later).`,
      '**Extra profit pools.** Output above reassessed capacity is paid up to the import parity price (~US$900/t in May 2026); surplus ammonia (~23,000 t in Q1FY26) sold at high prices lifted Q4FY26 and Q1FY27. From FY27 that ammonia feeds the TAN plant instead.',
    ] },
    { exhibit: { type: 'table', title: 'Urea EBITDA per tonne and what drives it', head: ['', ...SEGL, ...F.years], rows: [
      ['Sales volume (lakh t)', ...SEGY.map(a => n1(a.ureaSales)), ...F.years.map(y => n1(UB.volumeLakhT[y]))],
      ['Realisation (₹/t)', ...SEGY.map(a => n0(a.ureaRealPerT)), ...F.years.map(y => n0(UB.realisationPerT[y]))],
      { hl: true, cells: ['**EBITDA (₹/t)**', ...SEGY.map(a => `**${n0(a.ureaEbitdaPerT)}**`), ...F.years.map(y => `**${n0(UB.ebitdaPerT[y])}**`)] },
      ['EBITDA (₹ cr)', ...SEGY.map(a => n0(a.ureaEbitda)), ...F.years.map((_, i) => `{{F.seg.urea.adjEbitda.${i}|num}}`)],
      ['EBITDA margin', ...SEGY.map(a => a.ureaEbitdaPct + '%'), ...uF.map(v => v.toFixed(1) + '%')],
    ], source: 'Annual reports FY24-26 (segment note, MD&A), GAM Research estimates; EBITDA includes surplus ammonia sales' } },
    { callout: `**Our view:** the best-run urea complex in the private sector, but a utility: profit per tonne is set by formulas and volumes by plant capacity. We model ${UB.volumeLakhT['FY27E']} / ${UB.volumeLakhT['FY28E']} / ${UB.volumeLakhT['FY29E']} lakh t and EBITDA of ₹${n0(UB.ebitdaPerT['FY27E'])} / ₹${n0(UB.ebitdaPerT['FY28E'])} / ₹${n0(UB.ebitdaPerT['FY29E'])} per tonne. The FY28 step-down is the Gadepan-III reset (next chapter) plus the loss of surplus-ammonia sales to the TAN plant.` },
  ],
};

const gadepan3 = {
  id: 'gadepan3', nav: 'The Gadepan-III reset', kicker: 'Policy', title: 'December 2026: Gadepan-III loses the pricing that made it Chambal\'s best plant',
  blocks: [
    { p: `Gadepan-III (1.27 mt a year) started production in 2019 under the New Investment Policy of 2012, which pays new plants a normative price for eight years: about US$285 a tonne at a base gas price, plus about US$20 a tonne for every US$1/mmBtu rise in gas (Q1FY26 call), within a floor and ceiling. When gas and import prices are high, as in FY26-27, that formula pays well above cost. The eight years end in December 2026 ("we are to be in this regime from December 1st onwards"). On 30-Sep the government had started the file and asked for data but had not decided the new basis. Management's only guidance: the precedent "considers the net fixed assets and the return on net worth", normally over a 15-year depreciation life, while Gadepan-III is only eight years old; the outcome "could vary... both positively and negatively", and it will set the template for Matix and HURL's three plants.` },
    { exhibit: { type: 'table', title: 'How the street sizes the reset', head: ['Source', 'Assumption', 'Effect'], wide: [1, 2], rows: [
      ['Elara (31-Jul-2026)', '"Nearly one-third reduction in EBITDA per tonne from the G3 plant December 2026 onwards"', 'FY28E EBITDA ₹2,644 cr (FY27E ₹3,418 cr); "FY27E may be the peak year of PAT", not crossed until FY30'],
      ['IIFL (31-Jul-2026)', `Gadepan-III EBIT/t ₹7,494 (FY26) → ₹6,500 (FY27E) → ₹4,400 (FY28-29E); Gadepan-I/II ~₹4,000-4,100`, `FY28E EPS ₹${n1(iifl.eps.FY28E)} vs FY26 ₹48.1 (its basis)`],
      ['SKP (3-Aug-2026)', 'Benefits end in Q4FY27; "clarity... remains a key monitorable"', 'FY28E EBITDA ₹2,277 cr vs FY27E ₹3,014 cr'],
      ['Systematix, JRK', 'No explicit reset in published estimates', 'FY28E EPS ₹54.6 and ₹61.8: above FY27E'],
      { hl: true, cells: ['**GAM Research**', `**₹${n0(UB.g3CutPerT)}/t cut in Gadepan-III EBITDA from Dec-2026 on ~${UB.g3VolumeLakhT} lakh t**`, `**~₹${n0(g3Annual)} cr a year of EBITDA, ~₹${n1(g3Eps)} of EPS; ${UB.g3CutMonthsFY27} months in FY27**`] },
    ], source: 'Broker notes as dated; GAM Research' } },
    { exhibit: { type: 'table', title: 'If the cut is different: FY28E EPS and our P/E value', head: ['Gadepan-III EBITDA cut (₹/t)', 'FY28E EPS (₹)', `Value at ${mult}x Sep-28E EPS (₹)`, 'vs share price'], rows: sens.map(s => [s.c === UB.g3CutPerT ? `**${n0(s.c)} (base)**` : n0(s.c), n1(s.eps28), n0(s.tp), `${s.tp >= price ? '+' : '−'}${Math.abs(Math.round((s.tp / price - 1) * 100))}%`]), source: `GAM Research: ₹1,000/t on ~${UB.g3VolumeLakhT} lakh t = ₹${n0(UB.g3VolumeLakhT * 10)} cr of EBITDA, ~₹${n1(per1000)} of EPS after tax` } },
    { callout: `**Our view:** this is the single biggest number in the investment case, and nobody outside the Department of Fertilizers knows it. A cut of ₹${n0(UB.g3CutPerT)}/t is in line with the brokers who model it (Elara, IIFL: both ~₹3,000/t); if the government simply moved Gadepan-III onto Gadepan-I/II-type economics the cut would be larger (~₹4,500/t, our bear case); if it recognised the plant's undepreciated cost with a generous return it could be close to nil. Even with no cut at all the stock would be worth ~₹${n0(sens[0].tp)} on our multiple: the reset caps the upside, it does not make the stock expensive.` },
  ],
};

module.exports = { industry, tailwind, urea, gadepan3 };
