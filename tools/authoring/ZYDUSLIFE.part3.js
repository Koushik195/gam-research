// Zydus Lifesciences report, part 3: the US after gRevlimid, India and international markets, Consumer Wellness and
// MedTech, the pipeline and USFDA record, and the competitive-advantage scorecard.
const X = require('./ZYDUSLIFE.ctx');
const { C, D, SA, SQ, QL, Q1, FY26, F, bld, BL, n0, n1, pc, rup } = X;
const f26 = SA.find(a => a.fy === 'FY26'), f25 = SA.find(a => a.fy === 'FY25');
const yrs = ['FY26', ...F.years];

const us = {
  id: 'us', nav: 'US after gRevlimid', kicker: 'North America', title: 'The US after gRevlimid: a US$1.3 bn generics base, a young specialty arm and one big bet',
  blocks: [
    { p: `North America was ₹${n0(f26.na)} cr (US$${f26.naUsd} mn) in FY26, 43% of revenue. Two products made FY23-FY26 exceptional. **Generic Revlimid** (lenalidomide, a blood-cancer drug) was sold under a settlement that capped every generic maker's volumes until end-Jan-2026; Zydus's sales were meaningful in Q1FY26, "significantly" lower in Q2, "a very small part" in Q3 and nil from Q4FY26. **Generic Myrbetriq** (mirabegron, for overactive bladder) has few competitors; Zydus settled its patent fight with Astellas on 10-Feb-2026 by paying US$45 mn plus a US$75 mn prepaid licence (amortised over 19 months to Sep-2027) and a per-unit fee until Sep-2027. Zydus never disclosed either product's sales; JM Financial estimates the two at ~36% of US sales.` },
    { pair: [
      { type: 'column', title: 'US$ sales have settled at US$313-327 mn a quarter', unit: 'North America formulations (US$ mn)', x: QL, series: [{ name: 'US$ mn', values: SQ.map(q => q.naUsd), fmt: 'num' }], labels: 'all', source: 'Company presentations; Q1FY27 release' },
      { type: 'column', title: 'Our forecast: flat-ish dollars, a weaker rupee does the rest', unit: 'North America (₹ crore) and the US$ path behind it', x: yrs, series: [{ name: 'North America ₹ cr', values: [f26.na, ...bld.map(r => Math.round(r.na))], fmt: 'num' }], labels: 'all', source: `GAM estimates: US$${n0(bld[0].usd)} / ${n0(bld[1].usd)} / ${n0(bld[2].usd)} mn at ₹${BL.fx.join(' / ')} per US$` },
    ] },
    { h: 'What replaces the windfalls' },
    { exhibit: { type: 'table', title: 'US growth levers and their size', head: ['Lever', 'Status by 30-Sep-2026', 'Size', 'Our view'], wide: [1, 3], rows: [
      ['Base generics', '274 products; 30-40 launches planned in FY27 (11 in Q1); 5 ANDAs filed, 9 approvals in Q1FY27', 'US$300-310 mn a quarter "base" (management)', 'Volume gains offset single-digit price erosion; no growth engine on its own.'],
      ['Generic Myrbetriq', 'Semi-exclusive; licence fee to Sep-2027; competition "factored in" to FY27 guidance', 'Large (undisclosed)', 'The biggest swing factor in FY27-28; we assume gradual erosion.'],
      ['Rare disease (Sentynl)', 'Nulibry, Zokinvy, Zycubo (Menkes disease, launched Q4FY26); broken even', '~US$60 mn in FY26', 'Profitable niche; "not high value driven".'],
      ['505(b)(2) and LiqMeds', '33 in pipeline, 11 launched; Beizray slower than expected; sitagliptin franchise', '~US$60-70 mn', 'Scales from FY28 (management).'],
      ['Rolvedon (Assertio)', 'Completed 16-Jun-2026; long-acting G-CSF, ~4% volume share; Medicare Part B oncology', 'US$15-20 mn a quarter from Q2FY27', 'Takes branded US share above 15% by FY27-end; mostly amortisable intangibles.'],
      ['Saroglitazar (PBC)', 'NDA under priority review; approval by Q4FY27; launch Apr-2027 on its own front end', 'Peak US$200-300 mn (US$400 mn+ optimistic); ~US$70 mn of FY27 spend', 'Real optionality, but two entrenched PPAR rivals; first two years are investment years.'],
      ['Biosimilars', 'Nufymco (ranibizumab) launched; FYB206 (pembrolizumab) clinical work done; Agenus plants for manufacturing', 'Meaningful only from CY29', 'Long-dated.'],
    ], source: 'Q1FY27, Q4FY26, Q3FY26 calls and presentations; Aug-2026 corporate presentation; AR FY26 note 30' } },
    { callout: '**Our view:** management\'s "around single-digit growth" for the US in FY27 is plausible in rupees (the rupee alone adds ~8%) but not in dollars. We model US$ sales of US$' + n0(bld[0].usd) + ' mn in FY27E (+' + BL.naUsdGrowth[0] + '%), US$' + n0(bld[1].usd) + ' mn in FY28E and US$' + n0(bld[2].usd) + ' mn in FY29E as Saroglitazar and biosimilars start. The US will not again give Zydus 30%+ margins without a new exclusive product.' },
  ],
};

const india = {
  id: 'india', nav: 'India & international', kicker: 'Branded markets', title: 'India and international markets: ~35% of revenue, growing 20-35%, and the best part of Zydus',
  blocks: [
    { p: `India formulations were ₹${n0(f26.india)} cr in FY26 (+11%) and grew 20% in Q1FY27, beating the market in cardiology, diabetes, gynaecology, pain, oncology and nephrology. Management guides mid-teens growth for FY27, 300-500bp above the market. The drivers are specific: chronic therapies (54.2% of sales, +360bp in four years), Zydus's own new molecules (Lipaglyn/Bilypsa ₹481 cr MAT, desidustat), biosimilars that the company says beat its own expectations (nivolumab, pertuzumab, aflibercept) and vaccines (target ₹300-400 cr). Semaglutide is "a small contributor". India oncology alone is above ₹800 cr.` },
    { p: `International markets (emerging markets plus Europe) grew from ₹${n0(f25.im)} cr to ₹${n0(f26.im)} cr in FY26 (+40%) and +34% in Q1FY27 to US$100 mn+ a quarter: France and Spain recovered, the UK scaled "much faster than expected" and new countries took Zydus's first-generic and innovative launches. A weaker rupee helps too.` },
    { pair: [
      { type: 'column', title: 'India formulations: +20% in Q1FY27', unit: 'India formulations (₹ crore a quarter)', x: QL, series: [{ name: 'India', values: SQ.map(q => q.india), fmt: 'num', growth: true }], labels: 'all', source: 'PL KPI table (quarterly); Q1FY27 release' },
      { type: 'column', title: 'International markets: +40% in FY26, +34% in Q1FY27', unit: 'International markets formulations (₹ crore a quarter)', x: QL, series: [{ name: 'International', values: SQ.map(q => q.im), fmt: 'num', growth: true }], labels: 'all', source: 'PL KPI table; Q1FY27 release' },
    ] },
    { exhibit: { type: 'table', title: 'India franchise: proof points (AWACS / IQVIA, MAT Jun-2026)', head: ['Measure', 'Zydus', 'Market / then'], rows: [
      ['Chronic share of sales', `${D.industry.zydusIndia.chronicSharePct}%`, '+360bp in four years'],
      ['Chronic growth', `${D.industry.zydusIndia.chronicGrowthZydus}%`, `${D.industry.zydusIndia.chronicGrowthIpm}% for the IPM`],
      ['Brands above ₹25 cr', `${D.industry.zydusIndia.brands250mnPlus}`, `${D.industry.zydusIndia.brands250mnPlus2022} in MAT Jun-2022`],
      ['Oncology rank', '#1', 'Largest Indian oncology company'],
      ['Biosimilars approved / launched in India', '16 / 15', 'Marketing approvals in 19 emerging markets'],
      ['Field force', D.industry.zydusIndia.fieldForce, 'No further rep additions planned (May-2026)'],
    ], source: 'Aug-2026 corporate presentation; Q4FY26 call' } },
    { callout: `**Our view:** this is a high-quality, double-digit franchise and deserves a premium multiple on its own. We model India +${BL.indiaGrowth.join('% / +')}% and international markets +${BL.imGrowth.join('% / +')}% for FY27-29E. Even so, the two together add ~₹${n0((bld[2].india + bld[2].im) - (f26.india + f26.im))} cr of revenue by FY29E; at a ~27% margin that is ~₹${n0(((bld[2].india + bld[2].im) - (f26.india + f26.im)) * 0.27)} cr of EBITDA, about the size of the forex gains alone in FY26 EBITDA (₹1,198 cr), before the loss of gRevlimid.` },
  ],
};

const consumer = {
  id: 'consumer', nav: 'Consumer & MedTech', kicker: 'Diversification', title: 'Consumer Wellness and MedTech: ₹4,700 cr of revenue bought for growth, earning little so far',
  blocks: [
    { p: `**Consumer Wellness** (Zydus Wellness, 57.59% owned; listed) grew to ₹${n0(f26.consumer)} cr in FY26 (+46%) with seven months of Comfort Click, a UK digital vitamins business bought for GBP239 mn (₹2,877 cr, Aug-2025). Its Indian brands lead their categories (Sugar Free ~96% share, Glucon-D ~59%), but domestic growth is slow (+1.7% in Q4FY26, +5% in Q1FY27, seasonal brands down). Zydus Wellness's profit fell from ₹347 cr (FY25) to ₹197 cr (FY26) after acquisition interest and amortisation; it borrowed ~₹3,700 cr for the deal. At the 30-Sep close, Zydus's stake was worth ₹${n0(X.zwStake)} cr (₹${n0(X.zwAtMarketPs)} a Zydus share) at Zydus Wellness's ₹${n0(X.zwMcap)} cr market value.` },
    { p: `**MedTech** became a segment with Amplitude Surgical (French hip and knee implants; EUR6.25 a share, ₹2,570 cr; consolidated from 29-Jul-2025, 100% and delisted by Oct-2025). It brought ₹772 cr of revenue in eight months (₹1,158 cr full year) and "20%+" EBITDA margins before acquisition accounting, but the segment lost ₹178 cr before tax in FY26 after amortisation, interest and India start-up costs (stents, a dialyser-membrane plant, ~₹300 cr of capex). Q1FY27 revenue was ₹283 cr.` },
    { pair: [
      { type: 'column', title: 'Consumer revenue jumped with Comfort Click; seasonality remains', unit: 'Consumer Wellness (₹ crore a quarter)', x: QL, series: [{ name: 'Consumer', values: SQ.map(q => q.consumer), fmt: 'num' }], labels: 'all', source: 'Company releases; MOSL KPI table' },
      { type: 'column', title: 'Segment profit: consumer down, MedTech in loss', unit: 'Segment profit before exceptional items and tax (₹ crore)', x: ['FY25', 'FY26'], series: [{ name: 'Consumer', values: [f25.consumerResult, f26.consumerResult], fmt: 'num' }, { name: 'MedTech', values: [f25.medtechResult, f26.medtechResult], fmt: 'num' }], labels: 'all', source: 'AR FY26 note 44' },
    ] },
    { callout: `**Our view:** both businesses are reasonable assets bought at full prices. Consumer adds a minority leak (42.41% of Zydus Wellness profit) and MedTech adds amortisation. We model Consumer +${BL.consumerGrowth.join('% / +')}% and MedTech +${BL.medtechGrowth.join('% / +')}% for FY27-29E and minorities of ₹${X.TB.minorities.join(' / ')} cr. The market values Zydus Wellness at ~60x trailing earnings; inside Zydus's P/E it is worth only ~₹${n0(X.zwInPe)} a share against ₹${n0(X.zwAtMarketPs)} at market. We show that gap as a sensitivity, not in the base.` },
  ],
};

const pipeline = {
  id: 'pipeline', nav: 'Pipeline & USFDA', kicker: 'Innovation and compliance', title: 'A real pipeline for an Indian generics company, and a clean USFDA run since 2025',
  blocks: [
    { p: 'Zydus spends ~8% of revenue on R&D (₹2,273 cr in FY26, 50% generics and value-added generics, 40%+ NCEs, biologics and vaccines). Few Indian peers have taken their own molecules to market; Zydus has two in India and one under US priority review.' },
    { exhibit: { type: 'table', title: 'Innovation pipeline: what matters and when', head: ['Asset', 'Status by 30-Sep-2026', 'Value', 'Source'], wide: [1, 2], rows: C.pipeline, source: 'Company calls and presentations to Aug-2026' } },
    { exhibit: { type: 'table', title: 'USFDA inspection outcomes, FY26 to Q1FY27', head: ['Site', 'Outcome', 'Reported', 'Source'], wide: [1], rows: C.fda, source: 'Company releases, presentations and calls' } },
    { callout: '**Our view:** Saroglitazar in PBC is worth having but not worth paying for twice: management\'s own plan has two years of investment before revenue, against two established PPAR agonists. We include its launch costs (in our 23.5% FY28E margin) and a modest ramp in FY29E US$ growth, not a peak-sales NPV. Compliance is a strength today: every inspection since Mar-2025 closed with an EIR, including the Jarod injectables plant.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: strong in India brands and innovation, ordinary in US generics',
  blocks: [
    { verdicts: D.moat.map(m => [m[0], /^Strong/.test(m[1]) ? 'Strong' : /^Weak/.test(m[1]) ? 'Weak' : 'Moderate', m[2], m[3]]), head: ['Source of advantage', 'Strength', 'Evidence', 'Limits'], title: 'Moat scorecard', source: 'Company presentations; AR FY26; GAM Research' },
    { callout: '**Honest verdict:** Zydus has a moat in India (brands, oncology leadership, a real innovation engine) and a good compliance record. It does not have one in US generics, where its excess profits came from two time-limited products. Consumer brands lead their categories but earn little after the Comfort Click deal; MedTech has no advantage yet. Roughly 40% of revenue sits behind a moat; the rest is scale.' },
  ],
};

module.exports = { us, india, consumer, pipeline, moat };
