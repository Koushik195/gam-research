// Acutaas Chemicals report, part 2: what Acutaas does, history and corporate actions (IPO, acquisitions, QIP, split), industry,
// tailwind test.
const X = require('./ACUTAAS.ctx');
const { C, D, A, n0, n1, BL, FY26, SA, b, cdmoShare26 } = X;
const IN = D.industry;
const s26 = v => (v / A.sales[b] * 100).toFixed(1);

const business = {
  id: 'business', nav: 'What Acutaas does', kicker: 'Company', title: 'A Surat chemist that makes the building blocks of other companies\' drugs; one contract-manufacturing molecule now brings almost half of revenue',
  blocks: [
    { p: `Acutaas makes **advanced pharmaceutical intermediates**: the chemical steps just before an active ingredient (API). It sells them to two kinds of buyers. (1) **Generic API makers**: for off-patent drugs such as trazodone (an antidepressant), dolutegravir (HIV), entacapone (Parkinson's), apixaban and rivaroxaban (blood thinners) and pazopanib (kidney cancer), where it claims 50-90% of global supply of key intermediates and develops products early, before patents expire, so that it is written into its customers' regulatory filings. (2) **Innovators, under contract (CDMO)**: above all five intermediates for darolutamide (Bayer's prostate-cancer drug Nubeqa), supplied to Orion's API arm Fermion under a 10-year agreement signed in 2022. It does not make APIs itself ("we do not compete with our customers"). Its **specialty chemicals** vertical makes commodity-like products (parabens, methyl salicylate) at Jhagadia, photoresist chemicals for chip makers at Baba Fine Chemicals, and from Q1FY27 battery electrolyte additives. ${n0(C.profile.employees.mar26)} employees; 77% of FY26 product sales were exported.` },
    { exhibit: { type: 'table', title: "Acutaas's five revenue lines (FY26)", head: ['Line', 'Revenue (₹ cr)', 'Share', 'What it is', 'Who buys', 'Economics'], wide: [3, 4, 5], rows: [
      ['**CDMO**', n0(BL.base.cdmo), `${s26(BL.base.cdmo)}%`, 'Patented intermediates under long contracts; mainly five darolutamide intermediates (Fermion, since CY22); four more molecules validated in FY26', 'Innovators (Orion/Bayer the anchor)', 'Highest margin; volumes follow the drug; patent to 2033 (US) / 2035 (EU)'],
      ['**Pharma intermediates ex-CDMO**', n0(BL.base.exCdmo), `${s26(BL.base.exCdmo)}%`, '600+ generic API intermediates, up to N-1 stage; 90%+ backward-integrated', '160+ generic API makers in 25+ countries', 'Price-competitive; share gains come from entering early before patent expiry'],
      ['**Commodity & other specialty chemicals**', n0(BL.base.commodity), `${s26(BL.base.commodity)}%`, 'Parabens, methyl salicylate, para anisic acid (ex-Gujarat Organics, Jhagadia)', '400+ customers in personal care and fine chemicals', '~10% EBITDA margin (HSIE); being phased out from FY27'],
      ['**Semiconductor chemicals**', n0(BL.base.semis), `${s26(BL.base.semis)}%`, 'Photoresist chemicals at Baba Fine Chemicals (55%); Indichem (Korea, 75%) from FY28', 'Heraeus Epurio historically; Japan, Korea, Taiwan targets', '65-70% EBITDA at acquisition (PL); revenue fell three years running'],
      ['**Battery electrolyte additives**', '0', '0.0%', 'Vinylene carbonate (VC) and fluoroethylene carbonate (FEC), 2,000 MT each; third product from Q3FY27', 'Cell makers in North America and Korea, under long contracts', '~15% EBITDA at full use (PL); started Q1FY27'],
    ], source: 'Corporate deck (Mar-2026); Q4FY26 deck; PL initiation (CDMO revenue, molecule shares, margins); HSIE (commodity margins); calls' } },
    { pair: [
      { type: 'column', title: 'Specialty grew with the FY22 acquisition, then stalled', unit: 'Revenue (₹ crore)', x: SA.map(s => s.fy), series: [{ name: 'Pharma intermediates', values: SA.map(s => Math.round(s.pharma)), fmt: 'num' }, { name: 'Specialty chemicals', values: SA.map(s => Math.round(s.specialty)), fmt: 'num' }], labels: 'all', source: 'Company decks (FY20-FY26)' },
      { type: 'hbar', title: `FY26: CDMO ~${Math.round(cdmoShare26)}% of revenue`, unit: 'FY26 revenue (₹ crore)', x: ['CDMO', 'Pharma ex-CDMO', 'Commodity & other', 'Semiconductor', 'Battery'], series: [{ name: 'FY26', values: [BL.base.cdmo, BL.base.exCdmo, BL.base.commodity, BL.base.semis, 0].map(Math.round), fmt: 'num' }], labels: 'all', highlight: 'CDMO', source: 'Company decks; PL initiation (CDMO)' },
    ] },
    { callout: '**So what:** Acutaas is two companies in one. One is a good but ordinary generic-intermediates maker with strong chemistry, flat revenue in FY24-26 and ~20% margins. The other is a contract supplier to one of the fastest-growing cancer drugs in the world, which turned the group into a 36%-margin business in a year. The specialty-chemicals side is small and is being rebuilt around batteries and semiconductors. Investors are paying for the second company and for the rebuild; most of the risk sits there too.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a Surat lab to a ₹27,000 cr company: an IPO, two acquisitions, a Korean JV, a QIP and a split; two founders have sold 3.3% since',
  blocks: [
    { p: 'Naresh Patel and Chetan Vaghasia started Ami Organics as a small lab in 1998 and set up the company in 2004 in Sachin, Surat. It grew as a supplier of intermediates for generic drugs, received its first USFDA inspection report in 2018 and listed in Sep-2021. Since then it has bought two plants from Gujarat Organics (Ankleshwar and Jhagadia, FY22-23), 55% of Baba Fine Chemicals (FY24), and set up battery-additive and Korean semiconductor subsidiaries. It renamed itself Acutaas Chemicals in 2025 to signal "a sharper focus on specialty and custom chemical solutions".' },
    { exhibit: { type: 'table', title: 'Corporate actions and events that changed the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.timeline.map(t => [t.date, t.event, t.impact]), source: 'Corporate deck; AR FY26 (notes 16, 50); IPO and QIP press coverage; NSE filings (split, Aug-2026 board outcome); HSIE' } },
    { h: 'Acquisitions and fund-raises since listing' },
    { exhibit: { type: 'table', title: 'What was bought and raised, and what came of it', head: ['Deal', 'When', 'Size', 'What it brought', 'Our verdict'], wide: [3, 4], rows: [
      ['IPO (fresh issue)', 'Sep-2021', '₹200 cr new shares (₹570 cr issue incl. ~₹370 cr sale by shareholders)', 'Debt repaid; ₹300 cr equity inflow in FY22', 'Done; promoters sold in the OFS'],
      ['Gujarat Organics units (Ankleshwar, Jhagadia)', 'FY22-23', 'Price not found; goodwill ₹20 cr', 'Specialty revenue ₹17 cr (FY21) → ₹93 cr (FY22); Ankleshwar rebuilt to 3x for pharma', 'Ankleshwar useful (23% used in Q1FY27); Jhagadia commodity being exited'],
      ['Baba Fine Chemicals (55%)', 'FY24', '₹68.2 cr (~4x FY23 adj. EBITDA)', 'Entry into photoresist chemicals; revenue ₹51 cr (FY23)', 'Disappointing so far: revenue ₹16 cr in FY26 on one shrinking customer; recovering from Q4FY26'],
      ['Ami Oncotheranostics LLC (50% JV, US)', 'Before FY24', 'Fully written off (₹32.1 cr)', 'Research venture', 'Failed; the FY24 exceptional loss'],
      ['QIP', 'Jun-2024', '₹400 cr at ₹1,240 (₹620 split-adjusted)', 'Repaid ₹208 cr of debt; funded battery and Indichem', 'Well timed: the stock is ~5x the QIP price'],
      ['Indichem Inc (75%, Korea)', 'FY26', '₹190 cr invested; 25% to the partner for no cash', 'Plant at Gongju opened 28-Aug-2026; revenue from FY28', 'Too early; ₹47.5 cr of goodwill went to the partner'],
      ['Electronic-grade chemicals plant', 'Approved 22-Aug-2026', '₹212 cr; up to 81,000 MTPA', 'Completion end-FY28', 'Not in our revenue forecasts'],
    ], source: 'AR FY26; PL initiation; QIP and IPO coverage; Q4FY26 call; NSE board outcome (22-Aug-2026)' } },
    { callout: '**Lesson from history:** management has been good at raising money at the right time and at spotting chemistry niches, but its acquisitions have a mixed record: the US JV was written off, BFC has shrunk since it was bought, and the Korean partner got a quarter of Indichem free. The big success, darolutamide, was organic. The founders sold 3.3% of the company in Jun-2025, a year before the stock doubled.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: CDMO grows ~7% a year, specialty chemicals ~5%, semiconductor chemicals ~12%; Acutaas is a niche player in each',
  blocks: [
    { p: `The AR's industry review (citing third-party estimates) puts the global CDMO market at ~USD ${IN.cdmoGlobal.usdBn2025} bn in 2025, growing ${IN.cdmoGlobal.cagrPct}% a year to USD ${IN.cdmoGlobal.usdBn2033} bn by 2033; India's at USD ${IN.cdmoIndia.usdBn2025} bn, reaching USD ${IN.cdmoIndia.usdBn2034} bn by 2034. Global specialty chemicals are a ~USD ${Math.round(IN.specialtyGlobal.usdBn2025)} bn market growing ${IN.specialtyGlobal.cagrPct}% a year; India's ~USD ${IN.specialtyIndia.usdBn2025} bn. Semiconductor chemicals (USD ${IN.semiChemGlobal.usdBn2025} bn in 2025) are forecast to grow ${IN.semiChemGlobal.cagrPct}% a year to 2034, and electrolyte additives for lithium-ion batteries ~${IN.electrolyteAdditives.cagrPct}% a year to USD ${IN.electrolyteAdditives.usdBn2028} bn by 2028 (HSIE). Acutaas's FY26 revenue (~USD 155 mn) is a rounding error in all of them. What matters is not market size but the few molecules and products it has chosen: darolutamide, apixaban, a handful of generic intermediates, two battery additives and a few photoresist chemicals.` },
    { pair: [
      { type: 'column', title: 'Market growth expected to 2033-34 (% a year)', unit: 'Expected annual growth (%)', x: ['Specialty chem (global)', 'Pharma (global)', 'CDMO (India)', 'CDMO (global)', 'Semicon chemicals', 'Electrolyte additives'], series: [{ name: 'Growth', values: [IN.specialtyGlobal.cagrPct, IN.pharmaGlobal.cagrPct, IN.cdmoIndia.cagrPct, IN.cdmoGlobal.cagrPct, IN.semiChemGlobal.cagrPct, IN.electrolyteAdditives.cagrPct], fmt: 'pct' }], labels: 'all', source: 'AR FY26 MD&A (third-party estimates); HSIE (electrolyte additives, to 2028)' },
      { type: 'column', title: 'Acutaas grew far faster than any of its markets', unit: 'Revenue growth (% a year)', x: ['FY20-23', 'FY23-26'], series: [{ name: 'Acutaas revenue CAGR', values: [Math.round(X.cagr(A.sales[X.ai('FY20')], A.sales[X.ai('FY23')], 3)), Math.round(X.cagr(A.sales[X.ai('FY23')], A.sales[b], 3))], fmt: 'pct' }], labels: 'all', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Forces at 30-Sep-2026', head: ['Force', 'What it is', 'What it means for Acutaas'], wide: [1, 2], rows: [
      ['Patent expiries (generics)', 'Apixaban (Eliquis, ~USD20 bn) loses US exclusivity from 2026-28; rivaroxaban already generic', 'The main growth lever for the ex-CDMO business; 25-30 generic customers lined up (PL)'],
      ['Innovator outsourcing', 'Big pharma outsources more intermediates under long contracts', 'Darolutamide shows the upside; four more molecules validated'],
      ['Nubeqa growth', 'Bayer raised peak-sales guidance to >EUR3bn and expected ~50% growth in 2026 (PL)', 'Direct volume growth for the anchor contract until ~2033-35'],
      ['China+1 in batteries', 'Cell makers in the US and Korea want non-Chinese electrolyte additives; India supports with ECMS incentives', 'Acutaas claims to be the first commercial VC/FEC maker outside China; ECMS approval Aug-2026'],
      ['Korea\'s chip supply chain', 'Korean chipmakers seek non-Japanese, non-Chinese materials', 'Indichem sells refined photoresist chemicals from Gongju, with precursors from India'],
      ['West Asia war and freight', 'Feedstock and shipping disruption since early 2026', 'Raw materials secured; costs higher (Q4FY26 and Q1FY27 calls)'],
      ['Chinese overcapacity in commodity chemicals', 'Price pressure on parabens and similar products', 'Why Acutaas is exiting commodity chemicals'],
    ], source: 'Q4FY26 and Q1FY27 calls; AR FY26; PL; HSIE' } },
  ],
};

const tailwind = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach Acutaas?', title: 'Tailwind test: Acutaas has captured the CDMO and patent-expiry tailwinds; batteries and semiconductors are bets that have not yet paid',
  blocks: [
    { p: 'A sector tailwind helps a shareholder only if the company turns it into revenue. We score each driver on whether Acutaas is a main beneficiary, a partial one or a bystander.' },
    { verdicts: [
      ['Innovator outsourcing (CDMO)', 'Yes', 'CDMO revenue ₹57 cr (FY24) → ₹635 cr (FY26); 10-year Fermion contract', 'The profit engine today'],
      ['Generic patent expiries', 'Yes', 'Dominant shares in key intermediates; apixaban ramp "has already started"; base business flat in FY24-26 while it was reshuffled', 'Should lift the base business in FY27-29'],
      ['Nubeqa label expansion', 'Yes', 'Primary supplier of five intermediates; Bayer guiding strong growth', 'High-margin volume, but one molecule'],
      ['China+1 in battery materials', 'Partly', 'VC/FEC plant running from Q1FY27, contracted for three years; ECMS incentive', 'Revenue from FY27; ~15% margins'],
      ['Semiconductor materials', 'Partly', 'BFC shrank from ₹51 cr to ₹16 cr on one customer; Indichem from FY28', 'Optional; not yet profitable at group level'],
      ['India specialty-chemicals growth', 'No', 'Commodity chemicals being exited; Jhagadia at 55%', 'Acutaas is leaving this market'],
      ['Weak rupee vs euro', 'Yes (one-off)', 'FY26 forex gains ₹32.5 cr; Q1FY27 ₹0.1 cr', 'Helps profit, not forecast'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: 4 of 7 captured, 2 partly, 1 not', source: 'Company calls and filings; PL; GAM Research' },
    { callout: '**Our view:** the tailwinds that drive the next three years (darolutamide, apixaban and other patent expiries) reach Acutaas directly, which is why we forecast ~20%+ revenue growth. The ones the market is most excited about (batteries, semiconductors) are real projects with contracts and plants, but they start small and at lower margins; we include them at modest sizes and do not pay a separate premium for them.' },
  ],
};

module.exports = { business, history, industry, tailwind };
