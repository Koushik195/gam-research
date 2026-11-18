// Authoring source for the Maruti Suzuki initiating-coverage report.
// Writes data/raw/MARUTI/research/initiation.json, which public/initiation.js renders.
// Numbers that change with data refreshes are tokens ({{dcf.tp|inr}}) or exhibit refs, never typed in.
// Usage: node tools/authoring/MARUTI.js
const fs = require('fs');
const path = require('path');

const SRC = {
  co: 'Company filings, Screener.in (consolidated), GAM Research',
  pres: 'Company investor presentations & earnings calls, GAM Research',
  siam: 'SIAM, FADA, GAM Research',
  est: 'Company, GAM Research estimates',
};
const FY = { from: 'FY15' };
// Deep-dive research (unit economics, utilisation, distribution) feeding the margin chapter.
const DDraw = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'MARUTI', 'research', 'deepdive.json'), 'utf8')); } catch { return {}; } })();
const DD = { ue: DDraw.unitEconomics || [], ut: DDraw.utilisation || [], dist: DDraw.distribution || [] };

// --------------------------------------------------------------------------------------
const cover = {
  headline: 'Margins and valuation are both at a low: the business is intact, the leadership premium is not',
  lead: "Maruti is India's default car brand. It sells 2 of every 5 cars in India, makes 49% of India's passenger-vehicle (PV) exports and holds ₹{{fin.treasury.11|num}} cr of cash with no debt. But it is no longer the near-monopoly of FY19, when it had a 51% share. It lost the SUV decade to M&M, Tata and Hyundai. Its Q1FY27 EBITDA margin (operating profit as % of sales) was 8.6% (standalone). That is the lowest in its listed history outside COVID. The stock has fallen {{P.returns.1y|chg}} in a year and trades at {{V.pe.current|x}} trailing earnings. That is the 2nd percentile of its 10-year range: cheaper than 98% of the past decade. We think the market is treating the margin low as permanent. We disagree, but we also do not expect the old valuation premium to return. **We initiate with BUY and a target price of {{dcf.tp|inr}} ({{dcf.upside|chg}}): 25x Sep-28E EPS, the way the street values Maruti and its own five-year median.** Our DCF and EV/EBITDA cross-checks land within 5% of it.",
  arguments: [
    { h: 'GST 2.0 revived the one segment Maruti truly owns', p: "In Sep-2025 the GST on small cars was cut from 28% plus cess to 18%. PV industry growth swung from −0.4% in H1FY26 to +16.7% in H2FY26 and +28% in H1FY27. Small cars are ~48% of Maruti's domestic volume, and Maruti holds most of that segment. So the benefit lands almost entirely on Maruti. Its market share recovered from 39.3% (FY26) to 41.0% (H1FY27)." },
    { h: 'The margin fall is mostly cyclical; only ~150bp is structural', p: "Margins fell ~370bp (basis points; 100bp = 1 percentage point) quarter-on-quarter in Q1FY27. About 300bp came from commodities: aluminium, plastics and PGMs (precious metals used in catalytic converters), after the West Asia conflict. Of this, ~110bp was a one-off change in the timing of supplier settlements. Price hikes in June and August, plus that reversal, should lift margins back to ~11% by H2. Three things will not come back: the heavier small-car mix, higher depreciation on new plants and EV launch costs. We model EBITDA margins of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} for FY27-29E, versus 13%+ in FY24-25." },
    { h: 'Competitive edge: strong in reach and trust, not in cost, SUVs or EVs', p: "Maruti's moat (lasting competitive advantage) is its network: 4,601 sales outlets and 5,926 service points, ~3x Hyundai or Tata. It also has the best resale values in its segments and ~70% of factory-fitted CNG cars. It no longer has a margin advantage: its Q1FY27 EBIT margin was 5.1%, versus 7.1% for M&M's auto business (PBIT). It holds ~4% of India's EV market versus Tata's 39%, and ~20% of SUVs. So we value it as a cash-generating volume business, not a compounding monopoly." },
    { h: 'The valuation already prices in a lot of bad news', p: "The stock trades at {{V.pe.current|x}} trailing P/E (share price ÷ earnings per share), against a 10-year median of {{V.pe.windows.10y.median|x}}. Its EV/EBITDA (company value including debt and cash ÷ operating profit) is {{V.evEbitda.current|x}}. Net cash of ~{{fin.treasury.11|num}} cr is ~23% of its market value. Our bear case ({{scen.bear.tp|inr}}) implies {{scen.bear.upside|chg}}, against {{scen.bull.upside|chg}} in our bull case. Our FY27E EPS of {{F.eps.0|inr}} is ~5% below consensus ({{R.street.consensus.0.eps|inr}}). The stock works even on these lower numbers." },
  ],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'MODERATE' },
    { k: 'Change in position', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results on 27-Oct-2026: the first test of margin recovery (supplier settlement reversal plus price hikes).',
    'Festive retail sales (Oct–Nov) and the ~130k order book: these will show whether GST demand was simply pulled forward.',
    'New launches: a 3-row SUV and a second EV in CY27; e-Vitara exports to Europe and Japan.',
    'Commodity prices: aluminium is off its June peak; any easing in West Asia would help.',
  ],
};

// --------------------------------------------------------------------------------------
const narrative = {
  id: 'narrative', nav: 'Narrative in charts', kicker: 'The story in 12 exhibits', title: 'Narrative in charts',
  blocks: [
    { pair: [
      { type: 'line', title: 'Market share: from 51% dominance to 40% leadership', unit: "Maruti's share of domestic passenger-vehicle sales (%); company, FADA and SIAM data", x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Market share', ref: 'kpi.marketShare', fmt: 'pct' }], labels: 'all', min: 30, max: 55, source: SRC.siam },
      { type: 'column', title: 'Volumes still doubled, because the market grew', unit: 'Maruti units sold (lakh)', x: 'fin.labels', from: 'FY15', series: [{ name: 'Units', ref: 'kpi.units', fmt: 'lakh', growth: true }], source: SRC.est },
    ] },
    { pair: [
      { type: 'line', title: 'Q1FY27 margin is the lowest in 20 years outside COVID', unit: 'Quarterly operating margin (%), consolidated', x: 'LQ[].label', series: [{ name: 'OPM', ref: 'LQ[].opm', fmt: 'pct' }], labels: 'extremes', maxTicks: 10, source: 'Screener.in, GAM Research' },
      { type: 'line', title: 'Revenue keeps growing; profit has stalled for two years', unit: 'Indexed, FY20 = 100', x: 'fin.labels', from: 'FY20', series: [{ name: 'Revenue', fn: "g('fin.sales')[i] / g('fin.sales')[5] * 100", fmt: 'num' }, { name: 'Net profit', fn: "g('fin.pat')[i] / g('fin.pat')[5] * 100", fmt: 'num' }], labels: 'ends', source: SRC.est },
    ] },
    { pair: [
      { type: 'column', title: "Exports are the new growth engine: 18% of volume, half of India's PV exports", unit: "Maruti export units ('000)", x: 'fin.labels', from: 'FY15', to: 'FY26', series: [{ name: 'Exports', ref: 'kpi.exports', fmt: 'k' }], source: SRC.pres },
      { type: 'column', title: 'Capital spending has tripled as capacity heads to 4mn', unit: 'Capital expenditure (capex), ₹ crore', x: 'fin.labels', from: 'FY17', series: [{ name: 'Capex', ref: 'fin.capex', fmt: 'num' }], source: SRC.est },
    ] },
    { pair: [
      { type: 'line', title: 'P/E is near its lowest in a decade (2nd percentile)', unit: 'Trailing P/E (x), weekly', x: 'V.pe.series[].0', from: '2016-01-01', series: [{ name: 'P/E', ref: 'V.pe.series[].1', fmt: 'x', thin: true }], labels: 'last', yearTicks: true, maxTicks: 11, lines: [{ v: 'V.pe.windows.10y.median', text: '10y median {{V.pe.windows.10y.median|x}}' }], source: 'Screener.in, GAM Research' },
      { type: 'line', title: 'Analysts have cut FY27E EPS by ~21% from the January peak', unit: 'Consensus FY27E EPS (₹)', x: 'R.street.revisions.0.series[].ago', series: [{ name: 'FY27E EPS', ref: 'R.street.revisions.0.series[].value', fmt: 'num' }], labels: 'ends', source: 'sharpely.in consensus, GAM Research' },
    ] },
    { pair: [
      { type: 'column', title: 'Net cash is ~23% of market value', unit: 'Cash + investments less debt, ₹ crore', x: 'fin.labels', from: 'FY17', series: [{ name: 'Net cash', ref: 'fin.treasury', fmt: 'num' }], labels: 'ends', source: SRC.est },
      { type: 'hbar', title: 'Our target vs analyst targets and our scenarios', unit: '₹ per share', x: ['Bear case', 'Street low', 'CMP', 'Street mean', 'GAM base', 'Street high', 'Bull case'], series: [{ name: 'Value', fn: "[g('scen.bear.tp'), g('R.street.ratings.tpLow'), g('P.last'), g('R.street.ratings.tpMean'), g('dcf.tp'), g('R.street.ratings.tpHigh'), g('scen.bull.tp')][i]", fmt: 'inr' }], labels: 'all', highlight: 'GAM base', source: 'sharpely.in, GAM Research' },
    ] },
  ],
};

// --------------------------------------------------------------------------------------
const industry = {
  id: 'industry', nav: 'Industry tailwinds', kicker: 'Industry', title: 'Is there a tailwind? Yes, but it has changed shape',
  blocks: [
    { p: "India sold {{R.industry.industryVolumes.14.domesticPV|num}} passenger vehicles (PVs) in FY26. That is ~34 cars per 1,000 people, versus ~80-90 in Indonesia, ~220-250 in China and ~280 in Thailand. Low car ownership is the classic bull case, and it is real. But it has been 'about to happen' for 15 years. Domestic PV volumes grew only **~4.5% a year from FY14 to FY26**. FY19–FY22 was a lost half-decade. COVID, BS-VI emission norms, higher insurance costs and the chip shortage pushed the market back to FY16 levels." },
    { exhibit: { type: 'column', title: 'Domestic PV volumes: a decade of 4-5% growth, then a GST-driven jump', unit: 'Domestic PV wholesale, i.e. factory dispatches to dealers (lakh units)', x: 'R.industry.industryVolumes[].fy', from: 'FY14', series: [{ name: 'Domestic PV', ref: 'R.industry.industryVolumes[].domesticPV', fmt: 'lakh', growth: true }], source: SRC.siam } },
    { p: "The bigger change is **what** India buys. Utility vehicles (UVs, mostly SUVs) rose from 21% of PV sales in FY16 to ~68% in FY26. Hatchbacks fell from ~46% at their FY19 peak to ~23%. This is the main reason Maruti's share fell from 51% to 39%. It was a hatchback company in an SUV market." },
    { pair: [
      { type: 'line', title: 'UVs went from a fifth of the market to two-thirds', unit: 'Utility vehicles as % of domestic PV', x: 'R.industry.segmentMix[].fy', from: 'FY16', series: [{ name: 'UV share', ref: 'R.industry.segmentMix[].uvs', fmt: 'pct0' }], labels: 'all', min: 0, max: 80, source: SRC.siam },
      { type: 'line', title: 'Share shift: M&M and Tata gained what Maruti and Hyundai lost', unit: 'Domestic PV share (%): FADA retail data to FY25, SIAM wholesale data from FY26', x: 'R.industry.oemShare[].fy', series: [{ name: 'Maruti', ref: 'R.industry.oemShare[].maruti', fmt: 'pct' }, { name: 'Hyundai', ref: 'R.industry.oemShare[].hyundai', fmt: 'pct' }, { name: 'Tata', ref: 'R.industry.oemShare[].tata', fmt: 'pct' }, { name: 'M&M', ref: 'R.industry.oemShare[].mm', fmt: 'pct' }], labels: 'ends', source: SRC.siam },
    ] },
    { h: 'Three tailwinds for the next three years' },
    { bullets: [
      "**GST 2.0 (22-Sep-2025):** GST on small cars (up to 4m long, petrol engine up to 1.2L) fell from 28% plus cess (~29-31% in total) to 18%. That is a ~8-10% price cut on entry cars. First-time buyers rose from 42% to 51-54% of Maruti's sales. This is the first policy in a decade that favours the small car.",
      "**Alternative fuels:** CNG (compressed natural gas), hybrids and EVs together crossed 40% of retail sales in Aug-2026 (petrol: 41%). CNG alone is ~25% of the market and ~40% of Maruti's volumes. Maruti built this segment and holds most of it.",
      "**Exports:** India's PV exports rose from ~0.4mn (FY21) to ~0.9mn (FY26). India is becoming Suzuki's global hub for small cars and EVs (e-Vitara goes to Europe and Japan).",
    ] },
    { h: 'And three headwinds' },
    { bullets: [
      '**Pull-forward risk:** H1FY27 grew +28% on a weak base, and some demand may have been brought forward. ICRA (+4-6%) and CRISIL (+5-7%) still forecast modest full-year growth. FY28 will be compared against a very high base.',
      '**Rates and affordability:** RBI raised the repo rate to 5.50% on 7-Oct-2026. About 80% of cars are bought with a loan.',
      '**Competition:** there are six credible SUV makers (M&M, Tata, Hyundai, Kia, Toyota, Maruti), plus new entrants (VinFast, BYD). Discounting is structurally higher than in the years when two companies dominated.',
    ] },
    { pair: [
      { type: 'column', title: 'Alternative fuels now outsell petrol', unit: 'Powertrain mix of PV retail, Aug-2026 (%)', x: ['Petrol', 'CNG', 'Diesel', 'Hybrid', 'EV'], series: [{ name: 'Share', values: [40.85, 25.28, 17.2, 9.04, 7.63], fmt: 'pct' }], labels: 'all', source: 'FADA, GAM Research' },
      { type: 'column', title: 'India PV exports have more than doubled since FY21', unit: "PV exports ('000 units)", x: 'R.industry.exports[].fy', series: [{ name: 'India PV exports', ref: 'R.industry.exports[].industry', fmt: 'k' }, { name: 'Maruti', ref: 'R.industry.exports[].maruti', fmt: 'k' }], labels: 'all', source: SRC.siam },
    ] },
  ],
};

const tailwindTest = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach Maruti?', title: "Tailwind test: who captures the sector's growth?",
  blocks: [
    { p: 'A sector tailwind helps a shareholder only if the company captures it. We score each driver on whether Maruti is the main beneficiary, one of several beneficiaries, or a bystander.' },
    { verdicts: [
      ['GST 2.0 small-car cut', 'Yes', "Maruti sells most of India's small cars under 4m. Mini and compact cars were 48% of its Q1FY27 domestic volume (mini +124% YoY).", 'The largest and most direct beneficiary. Its market share rose 2.3 percentage points YoY in Q1FY27.'],
      ['First-time buyers / low car ownership', 'Yes', 'Entry-level cars, CNG and 4,000+ outlets that reach tier-3/4 towns and rural areas (~45% of sales).', "Rising car ownership flows through Maruti's showrooms more than anyone else's."],
      ['Shift to SUVs and premium cars', 'Partly', 'Brezza, Grand Vitara, Fronx and Victoris made Maruti #1 in SUVs by volume again. But it has only ~20-25% of the SUV segment, versus ~50% share overall.', 'It takes part but does not lead. M&M and Tata earn the SUV premium.'],
      ['CNG / alternative fuels', 'Yes', 'Maruti created the factory-fitted CNG market. About 40% of its volume is CNG.', 'A niche where Maruti has a cost advantage and rivals under-invested.'],
      ['Strong hybrids', 'Partly', 'Grand Vitara and Victoris hybrids use Toyota technology. Policy support is uncertain (no GST relief).', 'Depends on CAFE-III credits (fuel-efficiency norms) and on pricing.'],
      ['EV adoption', 'No', "Its first EV (e-Vitara) arrived only in Aug-2025 and is mostly exported. Tata (~39%), M&M (~24%) and MG (~20%) lead India's EV market.", 'A late entrant. If EVs reach 15%+ of sales by 2030, faster than expected, Maruti could lose share.'],
      ['Exports', 'Yes', "~49% of India's PV exports in FY26 (55% in Q1FY27), sold in 100+ countries. It is Suzuki's global sourcing hub.", 'The clearest structural win of the last five years.'],
      ['Rate cuts / financing', 'Partly', "Helps everyone, but Maruti's entry-level buyers are more sensitive to interest rates. The Oct-2026 rate hike is a headwind.", 'Cyclical, not structural.'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: Maruti captures 4 of 8 directly, 3 partly, and misses EVs', source: 'SIAM, FADA, company, GAM Research' },
    { callout: "**Our view:** the tailwinds of FY26-28 (GST cut, CNG, exports, first-time buyers) fit Maruti's strengths unusually well. They fit far better than the SUV-led cycle of FY19-25. That is the cyclical case for owning the stock now. The structural question is EVs, where Maruti is a follower." },
  ],
};

// --------------------------------------------------------------------------------------
const evolution = {
  id: 'evolution', nav: 'How Maruti got here', kicker: 'Company', title: 'Four eras: dominance, disruption, SUV fight-back, GST 2.0',
  blocks: [
    { p: "Maruti's numbers make sense only against four distinct eras. Each era changed volumes, product mix and margins in ways that show up in the financial statements." },
    { exhibit: { type: 'table', title: 'The four eras of Maruti Suzuki (FY15–FY27)', head: ['Era', 'What happened', 'Share', 'EBITDA margin', 'What it did to the numbers'], wide: [1, 4], rows: [
      ['**FY15–19: Dominance**', 'Suzuki funds the Gujarat plant (SMG), so Maruti does not have to. Launches: Baleno, Brezza, Dzire. GST 1.0. Royalty moves from yen to rupees.', '47% → 51%', '13–16%', 'Sales grow ~14% a year (CAGR) and profit (PAT) ~20% a year. Cash builds up in treasury (investments up 4x).'],
      ['**FY20–22: Disruption**', 'BS-VI emission norms and exit from diesel (Apr-20), COVID, chip shortage, steel and PGM inflation. SUVs take off without Maruti.', '51% → 43%', '16% → 6.5%', 'FY20 PAT −26%, FY21 −23%. FY22 margin is the lowest on record. Capex cut to ₹2,370 cr.'],
      ['**FY23–25: SUV fight-back**', 'Launches: Brezza, Grand Vitara, Fronx, Jimny, Invicto. SMG acquired through a share swap. Kharkhoda plant. Exports scale up.', '43% → 40%', '11% → 13%', 'SUV share of Maruti volume 21% → 28%. Average selling price +15%. PAT more than triples from FY22 to FY25.'],
      ['**FY26–27: GST 2.0 & capacity**', 'Small-car tax cut, record volumes and exports, e-Vitara, Victoris. West Asia commodity shock. Capex ₹14,000 cr.', '39% → 41%', '13% → 8.6%', 'Revenue +20% in FY26 and +36% in Q1FY27, but PAT flat or down because of mix and commodities.'],
    ], source: SRC.pres } },
    { pair: [
      { type: 'stacked', title: 'Volume: domestic recovery plus growing exports', unit: 'Units (lakh)', x: 'fin.labels', from: 'FY15', to: 'FY26', series: [{ name: 'Domestic', ref: 'kpi.domestic', fmt: 'lakh' }, { name: 'Exports', ref: 'kpi.exports', fmt: 'lakh' }], minLabel: 1, source: SRC.pres },
      { type: 'column', title: 'Revenue per vehicle up 91% in 11 years, from mix, price and exports', unit: 'Net revenue per vehicle (₹ lakh)', x: 'fin.labels', from: 'FY15', to: 'FY26', series: [{ name: 'Realisation', ref: 'kpi.realisation', fmt: 'lakh' }], source: SRC.pres },
    ] },
    { pair: [
      { type: 'column', title: "SUVs went from 21% to 29% of Maruti's volume in four years", unit: 'SUV share of Maruti volume (%)', x: 'fin.labels', from: 'FY23', to: 'FY26', series: [{ name: 'SUV share', ref: 'kpi.suvShare', fmt: 'pct0' }], source: SRC.pres },
      { type: 'column', title: 'Capacity: 1.5mn → 2.9mn installed, 4mn targeted', unit: 'Installed capacity (lakh units)', x: ['FY15', 'FY20', 'FY23', 'FY24', 'FY25', 'Jul-26', 'Target'], series: [{ name: 'Capacity', values: [1500000, 2000000, 2250000, 2350000, 2600000, 2900000, 4000000], fmt: 'lakh' }], highlight: 'Target', source: SRC.pres },
    ] },
  ],
};

// --------------------------------------------------------------------------------------
const margins = {
  id: 'margins', nav: 'Unit economics & margins', kicker: 'Profitability', title: 'Per-car economics: what drove the margin low',
  blocks: [
    { p: 'Revenue per vehicle has risen almost every year since FY15 (₹3.8 lakh → ₹7.2 lakh). Yet EBITDA (operating profit) per vehicle rose only ~40% over the same period (₹63k in FY16 → ₹89k in FY26). So each rupee of revenue now earns less. The gap is cost. Raw materials went from 67% of sales (FY16) to 72% (FY26) and 77% (Q1FY27). Precious metals, steel and aluminium became costlier, and the mix shifted back to small cars after GST 2.0.' },
    { pair: [
      { type: 'column', title: 'EBITDA per car up ~40% since FY16, but price per car up ~80%', unit: "EBITDA per vehicle (₹ '000)", x: 'fin.labels', from: 'FY15', series: [{ name: 'EBITDA/vehicle', fn: "g('fin.ebitda')[i] * 1e7 / g('kpi.units')[i] / 1000", fmt: 'num' }], source: SRC.est },
      { type: 'line', title: 'Raw-material cost is the biggest swing factor', unit: 'Material cost as % of sales', x: 'A.labels', series: [{ name: 'Material cost %', ref: 'A.materialPct', fmt: 'pct0' }], labels: 'all', min: 60, max: 80, source: 'Screener.in, GAM Research' },
    ] },
    { h: 'The per-car cost lines that matter' },
    { p: 'Four cost lines explain most of the per-car economics. **Discounts** (deducted from revenue) rose from ~₹19.6k per car in FY18 to ~₹29.8k in FY25 as competition grew. They eased to ~₹26.6k in FY26. **Royalty** paid to Suzuki fell from 5.8% of sales (FY16) to 3.1% (FY26). This is a real gain for minority shareholders. (Before the SMG merger, part of the royalty sat inside purchase costs, so the FY18-24 figures understate it.) **Employee cost per car** has tripled since FY15 (₹12k → ₹37k), growing faster than revenue per car. **Plant utilisation** is back near 98% (FY26). That is why the two new plants matter for FY27 volumes. But they also add fixed costs before they fill up.' },
    { pair: [
      { type: 'column', title: 'Discounts per car: up 50% from FY18 to FY25', unit: "Discounts & incentives per vehicle (₹ '000)", x: DD.ue.map(u => u.fy).filter((_, i) => DD.ue[i].discountPerVehicle), series: [{ name: 'Discount/vehicle', values: DD.ue.filter(u => u.discountPerVehicle).map(u => u.discountPerVehicle / 1000), fmt: 'n1' }], source: 'Annual reports (revenue note), GAM Research' },
      { type: 'line', title: 'Royalty to Suzuki: 5.8% → 3.1% of sales', unit: 'Royalty as % of net sales', x: DD.ue.map(u => u.fy), series: [{ name: 'Royalty %', values: DD.ue.map(u => u.royaltyPct), fmt: 'pct' }], labels: 'all', min: 0, max: 7, source: 'Annual reports (related-party note), GAM Research' },
    ] },
    { pair: [
      { type: 'column', title: 'Employee cost per car has tripled since FY15', unit: "Employee cost per vehicle (₹ '000)", x: DD.ue.map(u => u.fy), series: [{ name: 'Employee cost/vehicle', values: DD.ue.map(u => u.employeeCostPerVehicle / 1000), fmt: 'n1' }], source: 'Annual reports, GAM Research' },
      { type: 'column', title: 'Plants are full again: utilisation ~98% in FY26', unit: 'Capacity utilisation (%)', x: DD.ut.map(u => u.fy), series: [{ name: 'Utilisation', values: DD.ut.map(u => u.utilisation), fmt: 'pct0' }], min: 0, max: 115, source: 'Annual reports, Suzuki IR, GAM Research (SMG capacity included from FY23)' },
    ] },
    { exhibit: { type: 'column', title: 'The distribution moat: outlets nearly tripled in 11 years', unit: 'Sales outlets (Arena + Nexa + commercial)', x: DD.dist.map(d => d.fy), series: [{ name: 'Sales outlets', values: DD.dist.map(d => d.salesOutlets), fmt: 'num', growth: true }], source: 'Annual reports, GAM Research' } },
    { h: 'What went wrong in Q1FY27' },
    { p: "Management's margin bridge for Q1FY27 shows that commodities did almost all the damage. Standalone EBITDA margin fell to 8.6%, from 12.3% in Q4FY26. Importantly, ~110bp of the commodity hit came from a temporary change in how supplier price adjustments are settled (moved from a quarterly to a monthly lag). That part reverses. Price hikes (~50bp in June, and a second round from August) were not yet in the quarter's numbers." },
    { pair: [
      { type: 'waterfall', title: 'Q1FY27 EBITDA margin bridge: commodities took ~300bp', unit: 'Standalone EBITDA margin, change vs previous quarter (bp); GAM estimate from management commentary', x: ['Q4FY26', 'Commodities (ex-timing)', 'Settlement timing', 'FX', 'Inventory (FCI)', 'Employee', 'Gas & other', 'Price/leverage', 'Q1FY27'], series: [{ name: 'bp', values: [12.3, -1.9, -1.1, -0.3, -0.3, -0.4, -0.2, 0.5, 8.6], fmt: 'n1' }], fmt: 'n1', totalFmt: 'pct', min: 0, max: 14, source: 'Company Q1FY27 presentation & call; GAM Research' },
      { type: 'column', title: 'Our forecast: margins recover, but not to FY24-25 levels', unit: 'EBITDA margin (%), consolidated', x: 'fin.labels', from: 'FY19', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], source: SRC.est },
    ] },
    { callout: '**Why we do not model a 13% margin again:** (1) GST-led demand favours small cars, which earn roughly half the per-unit margin of SUVs. (2) Two new 250k plants plus Khoraj add depreciation and start-up costs before they are fully used. (3) EVs launch at thin or negative margins. (4) With six players in SUVs, discounts stay structurally higher. Every 100bp of EBITDA margin is ~₹2,400 cr of EBITDA, roughly 10% of FY28E EPS.' },
    { pair: [
      { type: 'line', title: 'Other income: up to half of pre-tax profit in bad years', unit: 'Other income as % of PBT', x: 'fin.labels', from: 'FY15', series: [{ name: 'Other income / PBT', ref: 'fin.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: SRC.est },
      { type: 'column', title: 'Depreciation is rising with the new plants', unit: 'Depreciation (₹ crore)', x: 'fin.labels', from: 'FY19', series: [{ name: 'Depreciation', ref: 'fin.dep', fmt: 'num' }], source: SRC.est },
    ] },
  ],
};

module.exports = { cover, sections: { narrative, industry, tailwindTest, evolution, margins }, SRC, FY };

const analogues = p4 => p4.analogues;

if (require.main === module) {
  const later = require('./MARUTI.part2');
  const report = {
    symbol: 'MARUTI', listing: 'NSE: MARUTI · BSE: 532500', date: '23 October 2026', rating: 'BUY', analysts: 'GAM Research — Auto & Auto Components',
    cover,
    sections: (() => {
      const p3 = require('./MARUTI.part3'), p4 = require('./MARUTI.part4'), p2 = later.parts;
      return [narrative, industry, analogues(p4), tailwindTest, evolution, p4.growthMix, p4.pipeline, p4.moat, margins, p3.exportsEv, p2.capital, p4.ownership, p4.gov, p2.earnings, p2.valuation, p4.peers, p2.risks, p3.verdict, p2.statements, p2.financials, p3.glossary];
    })(),
    statementNotes: later.statementNotes,
  };
  const out = path.join(__dirname, '..', '..', 'data', 'raw', 'MARUTI', 'research', 'initiation.json');
  fs.writeFileSync(out, JSON.stringify(report, null, 1));
  console.log(`wrote ${out}: ${report.sections.length} sections, ${JSON.stringify(report).match(/"type":/g).length} chart/table exhibits`);
}
