// PCBL report, part B (2/3): business, history, industry, tailwind test, carbon black. As of 30-Sep-2026.
const { ctx } = require('./PCBL.ctx');
const { C, D, F, A, n0, n1, pc, ai, SA, SQ, A26, A25, A21, PEERS, sectorDerate, ASOF_TXT } = ctx;
const SRC = 'PCBL presentations, calls and Integrated Report FY26; GAM Research';
const QL = SQ.map(q => q.q);
const segPbit = [['Carbon black', A26.segPbitCb], ['Power', A26.segPbitPower], ['Chemicals (Aquapharm)', A26.segPbitChem], ['Unallocated (net)', A26.segUnalloc]];

// ---------------------------------------------------------------- business
const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'What PCBL does: burns heavy oil into carbon black, sells the waste heat as power, and owns a water-chemicals maker',
  blocks: [
    { p: 'Carbon black is a fine black powder made by burning heavy oil (carbon black feedstock, CBFS, a by-product of oil refining) with too little air. About 60% of the world\'s carbon black goes into tyres, where it gives rubber strength and wear resistance; the rest goes into belts, hoses and other rubber goods ("performance" grades) and, as "specialty" blacks, into plastics, inks, paints, cables and battery electrodes. PCBL (formerly Phillips Carbon Black, part of the RP-Sanjiv Goenka group) has five carbon black plants (Durgapur, Mundra, Palej, Kochi and Chennai) with 900 kt of capacity, of which 132 kt is specialty. ~57% of its carbon black goes to tyre makers, mostly on formula contracts that pass crude-linked feedstock costs through with a one-month or one-quarter lag; about a third of volume is sold spot. Around 38-40% of volume is exported. The hot tail gas from the reactors runs 122 MW of power plants: PCBL uses what it needs and sells the rest to the grid.' },
    { p: `Since Jan-2024 PCBL also owns **Aquapharm** (Specialty & Solutions): India's largest and the world's third-largest phosphonate maker (phosphonates stop scale and corrosion in water systems and are used in detergents), plus oil-field chemicals, polymers and "green chelates" (biodegradable replacements for phosphonates in detergents). It has plants at Mahad and Pirangut (Maharashtra), Jeddah and Texas, 167 kt of capacity and sells ~83% outside India (North America ~50%). The third leg, **battery materials** (Nanovace nano-silicon anodes, super-conductive carbons, acetylene black), is still at pilot stage.` },
    { exhibit: { type: 'table', title: 'The businesses at a glance (FY26)', head: ['Business', 'FY26 revenue (₹ cr)', 'FY26 profit', 'Capacity', 'Customers / end use', 'Note'], wide: [4, 5], rows: [
      ['**Rubber blacks (tyre + performance)**', `${n0(A26.cbRev - 0)} (with specialty and power)`, `EBITDA/t ~₹${n0(A26.cbEbitdaPerT)} (incl. power)`, '768 kt', 'Tyre majors (formula contracts), belts, hoses; 2 customers >10% of revenue', '549 kt sold in FY26 (tyre 355 kt, performance 194 kt)'],
      ['**Specialty blacks**', 'n.d.', 'n.d. (higher per tonne)', '132 kt', 'Plastics, inks, coatings, cables, conductive uses; ~70% exported', `${n0(A26.specVol)} t in FY26 (+12%); 19,748 t in Q1FY27 (+23%)`],
      ['**Power (co-generation)**', '235 (external) + 131 (captive)', 'Segment PBIT ₹239 cr', '122 MW (+12 MW FY27)', 'Grid / bilateral buyers', '839 MU generated, 511 MU sold at ₹4.24/kWh'],
      ['**Aquapharm (Specialty & Solutions)**', n0(A26.aqRev), `EBITDA ₹${A26.aqEbitda} cr (11%); segment PBIT ₹17 cr`, '167 kt', 'Home care (P&G, Henkel, Reckitt), water treatment, oil & gas (US)', `${n0(A26.aqVol)} t; acquired Jan-2024 for ₹3,800 cr`],
      ['**Battery materials (Nanovace, 51%)**', '–', 'Segment loss ₹0.15 cr (costs mostly elsewhere)', '80 t pilot', 'Battery makers (sampling)', 'Commercial volumes targeted FY28'],
    ], source: 'Integrated Report FY26 (Note 28), Q4FY26 and Q1FY27 presentations and calls; CARE (Jul-2026). n.d. = not disclosed' } },
    { pair: [
      { type: 'hbar', title: 'Revenue mix FY25: rubber blacks 72%, Aquapharm 17%', unit: '% of consolidated revenue', x: ['Tyre grades', 'Performance grades', 'Specialty blacks', 'Specialty & Solutions (Aquapharm)'], series: [{ name: 'Share', values: [48, 24, 11, 17], fmt: 'pct0' }], labels: 'all', source: 'Q3FY26 presentation (revenue share FY25)' },
      { type: 'hbar', title: 'FY26 segment profit: power earns a third of what carbon black does', unit: 'Segment profit before interest and tax, FY26 (₹ crore)', x: segPbit.map(s => s[0]), series: [{ name: 'PBIT', values: segPbit.map(s => Math.round(s[1])), fmt: 'num' }], labels: 'all', highlight: 'Chemicals (Aquapharm)', source: 'Integrated Report FY26, Note 28 (Ind AS 108)' },
    ] },
    { callout: '**So what:** PCBL is three businesses with very different quality. Rubber black is a scale commodity whose spread is set by crude and imports; specialty blacks and free power are genuinely good profit pools; Aquapharm is a niche specialty-chemicals franchise that has earned almost nothing on the ₹4,226 cr of assets PCBL now carries for it. The battery business is an option, not yet a business.' },
  ],
};

// ---------------------------------------------------------------- history
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From Phillips Carbon Black (1960) to a leveraged "specialty chemicals" group',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event'], wide: [1], rows: C.history.map(h => [h.when, h.event]), source: 'Integrated Report FY26, rating rationales, presentations; PTI (Nov-2023)' } },
    { callout: `**Corporate actions:** stock split ₹2 → ₹1 (Mar-2022; per-share history restated); 1.6 cr warrants issued to promoter entities (Rainbow Investments, Quest Capital Markets, STEL Holdings) at ₹280 and converted in Q3FY26 (₹448 cr; shares 37.75 cr → 39.35 cr, ~4% dilution); dividends of ₹5.5 (FY25) and ₹6.0 (FY26, 119% of EPS), plus a ₹4.50 interim with Q1FY27. **Read FY24-25 with care:** FY24 has only ~2 months of Aquapharm; FY25's ₹555 cr goodwill impairment was matched by a ₹554 cr deferred-tax reversal (net exceptional ~₹0.5 cr).` },
  ],
};

// ---------------------------------------------------------------- industry
const ind = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: steady demand, but price is set by crude, Russia and Indian overcapacity',
  blocks: [
    { p: `Global demand for rubber black is ~13.6 mn t a year, growing ~3-4% with tyre output; specialty blacks are ~1.1 mn t, growing 4-5% (company). India has become a net exporter: exports rose 12% in FY26 to 4.44 lakh t while imports fell 11% to 1.30 lakh t (CARE). The problem for Indian producers has been price, not demand. After EU sanctions, Russian carbon black (made from cheap Russian feedstock) was diverted to India and South-East Asia, Indian capacity grew faster than local demand, and US tariffs (an effective ~20% on PCBL's ~₹350 cr of US sales, ~₹70 cr of EBITDA a year in Oct-2025) closed one outlet. In 2026 the picture improved: the India-US deal lowered tariffs, the India-EU FTA will remove the 4.5% EU duty on Indian tyres, and Ukrainian strikes on Russian refineries cut Russian carbon black imports into India by ~40% in Jan-Jun 2026 while dearer Chinese material (~$1.3/kg vs ~$1.0/kg) filled the gap.` },
    { pair: [
      { type: 'column', title: 'Imports into India: Russia down 40%, China up 52% (Jan-Jun)', unit: 'Carbon black imports into India (tonnes)', x: ['Russia H1 CY25', 'Russia H1 CY26', 'China H1 CY25', 'China H1 CY26'], series: [{ name: 'Imports', values: [6626, 3989, 20650, 31433], fmt: 'num' }], labels: 'all', source: 'Prabhudas Lilladher (8-Sep-2026), industry data' },
      { type: 'hbar', title: `Tyre and chemical peers trade ~${Math.abs(Math.round(sectorDerate))}% below their five-year P/E medians`, unit: `Trailing P/E on ${ASOF_TXT} vs median since Oct-2021 (%)`, x: PEERS.filter(p => p.peVs != null && p.symbol !== 'PCBL').sort((a, b) => a.peVs - b.peVs).map(p => p.short), series: [{ name: 'vs median', values: PEERS.filter(p => p.peVs != null && p.symbol !== 'PCBL').sort((a, b) => a.peVs - b.peVs).map(p => Math.round(p.peVs)), fmt: 'pct0' }], labels: 'all', highlight: 'Himadri', source: 'Screener.in (multiples scaled to the NSE close). PCBL itself (+130%) is left out: its trailing P/E is inflated by trough FY26 EPS' },
    ] },
    { exhibit: { type: 'table', title: 'Forces acting on carbon black prices, 2024-26', head: ['When', 'What happened', 'Direction'], wide: [1], rows: ind.timeline.map(t => [t.when, t.what, t.dir]), source: 'PCBL calls (Oct-2025 to Jul-2026), CARE, Prabhudas Lilladher' } },
    { exhibit: { type: 'table', title: 'Industry facts that matter for PCBL', head: ['Item', 'Fact', 'Source'], wide: [1], rows: [
      ['Feedstock', ind.feedstock.value, 'CARE; calls'],
      ['Europe', ind.europe.value, 'Q4FY26 call'],
      ['Tyres (customers)', ind.tyres.value, 'Q1FY27 call; CARE'],
      ['Domestic competition', ind.domesticOvercapacity.value, 'Q4FY26 deck; Q2FY26 call'],
    ], source: 'As listed' } },
    { callout: '**So what:** 2026 brought PCBL its best external set-up in two years: less Russian supply, better US and EU access and tyre makers building stock. But these are supply shocks and trade concessions, not a structural shortage: Indian capacity keeps growing (PCBL itself is adding up to 300 kt in Andhra Pradesh), Russian refineries can be repaired, and a crude-price fall turns Q1\'s inventory gains into losses.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: volume tailwinds reach PCBL; pricing tailwinds come and go',
  blocks: [
    { verdicts: [
      ['Indian tyre growth (7-8% in FY26, high single digit expected)', 'Yes', `Domestic carbon black volume +9% in FY26 and +15% YoY in Q1FY27 (102,985 t); tyre makers near 90% utilisation.`, 'Steady volume, priced by formula.'],
      ['Russian supply shock (refinery strikes)', 'Partly', 'Russian imports into India −40% (H1 CY26); Q1FY27 spot premiums ₹11,000-12,000/t (CFO).', 'Helps margins while it lasts; not contractual.'],
      ['US tariff cut and EU FTA', 'Partly', 'Europe ~16,000 t and US ~4,800 t in Q1FY27; exports fell 22% YoY as freight made them less profitable than domestic spot.', 'Opportunity, not yet volume.'],
      ['Specialty and conductive blacks (EVs, cables, electronics)', 'Yes', `Specialty volume ${n0(A21.specVol)} t (FY21) → ${n0(A26.specVol)} t (FY26); +23% in Q1FY27; new 20 kt and 1 kt lines.`, 'The best part of the carbon black story.'],
      ['Water treatment, desalination, green chelates', 'No (so far)', `Aquapharm revenue flat (₹${n0(A25.aqRev)} cr → ₹${n0(A26.aqRev)} cr), volume −12% YoY in Q1FY27; green chelates capped at 4,000 t.`, 'Demand exists; PCBL has not captured it.'],
      ['Battery materials (silicon anodes)', 'No', 'Pilot plant only; sampling from Aug-2026; commercial volumes "FY28".', 'Option value only.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

// ---------------------------------------------------------------- carbon black
const cbEpt = SQ.map(q => q.cbEbitdaPerT);
const carbonBlack = {
  id: 'carbonblack', nav: 'Carbon black', kicker: 'Carbon black', title: 'Carbon black: volumes grow every year; EBITDA per tonne is the whole story, and it swings ±25%',
  blocks: [
    { p: `Carbon black is ~80% of PCBL's revenue. Volume has been the easy part: ${Math.round(A21.cbVol / 1000)} kt in FY21, ${Math.round(A26.cbVol / 1000)} kt in FY26 (+${Math.round((Math.pow(A26.cbVol / A21.cbVol, 1 / 5) - 1) * 100)}% a year) and 153.5 kt in Q1FY27 (flat YoY by choice: PCBL cut low-margin exports when freight jumped and sold more in India). Profit per tonne is the hard part. On our basis (carbon black and power EBITDA ÷ tonnes), it rose from ~₹13,300 (FY21) to ~₹19,300 (FY24) as specialty mix and the new Chennai plant helped, held in FY25, then fell to ~₹${n0(A26.cbEbitdaPerT)} in FY26 as Russian imports and Indian overcapacity crushed spot prices (company basis: ₹14,939). Q1FY27 printed ₹22,900 on the company basis, but ~₹70 cr (~₹4,500/t) was low-cost inventory and the power price jumped 47%; ICICI Direct puts the adjusted figure at ₹18,430.` },
    { pair: [
      { type: 'stacked', title: 'Quarterly volume by grade: specialty is the growing slice', unit: 'Carbon black sales volume (kt)', x: QL, series: [{ name: 'Tyre', values: SQ.map(q => Math.round(q.tyreVol / 1000)), fmt: 'num' }, { name: 'Performance', values: SQ.map(q => Math.round(q.perfVol / 1000)), fmt: 'num' }, { name: 'Specialty', values: SQ.map(q => Math.round(q.specVol / 1000)), fmt: 'num' }], minLabel: 12, source: 'Company presentations' },
      { type: 'column', title: 'Domestic up, exports down: PCBL followed the margin', unit: 'Carbon black volume (kt)', x: QL, series: [{ name: 'Domestic', values: SQ.map(q => Math.round(q.domVol / 1000)), fmt: 'num' }, { name: 'Export', values: SQ.map(q => Math.round(q.expVol / 1000)), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
    ] },
    { pair: [
      { type: 'column', title: 'EBITDA per tonne (company basis): ₹13,800 → ₹22,900 in two quarters', unit: '₹ per tonne (incl. power and other income)', x: QL.filter((_, i) => cbEpt[i] != null), series: [{ name: 'EBITDA/t', values: cbEpt.filter(v => v != null), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company (Q1FY26, Q3FY26, Q1FY27); Q2/Q4FY26 derived by GAM from 9M and FY figures' },
            { type: 'column', title: 'Power: realisation jumped to ₹5.39 a unit in Q1FY27', unit: 'Net realisation on power sold to the grid (₹/kWh)', x: QL.filter((_, i) => SQ[i].powerRate != null), series: [{ name: '₹/kWh', values: SQ.filter(q => q.powerRate != null).map(q => q.powerRate), fmt: 'n2' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations and calls (130-138 MU sold a quarter)' },
    ] },
    { exhibit: { type: 'table', title: 'How a tonne of carbon black is priced', head: ['Channel', 'Share', 'Mechanism', 'What it means'], wide: [2, 3], rows: [
      ['Tyre contracts (domestic and global majors)', '~57% of volume', 'Feedstock cost passed through with a lag (some Q-1, some M-1); annual negotiations set the spread', 'Protects the spread over time but creates inventory gains when crude rises and losses when it falls'],
      ['Spot (domestic and export)', '~one-third', 'Market price, set against Russian/Chinese imports and Indian spare capacity', 'Where FY26 margins collapsed and Q1FY27 margins jumped'],
      ['Specialty blacks', '~11% of volume', 'Product-by-product pricing, long qualification; ~70% exported to strategic customers', 'Higher and steadier margins (not disclosed)'],
      ['Power (by-product)', '511 MU sold in FY26', 'Bilateral and exchange sales; FY26 ₹4.24/kWh, Q1FY27 ₹5.39/kWh', 'Pure margin: no fuel cost; power segment PBIT ₹79 cr in Q1FY27 vs ₹47 cr in Q4FY26'],
    ], source: 'Q4FY26 and Q1FY27 calls; CARE; Integrated Report FY26' } },
    { callout: `**Our read:** guidance of ₹16,500-17,000/t for FY27 (+14-15%) is credible because Q1 is banked, but it relies on the Russian squeeze lasting and on ₹200-250 cr of cost savings that have not yet shown up. We model ₹${n0(ctx.CBA.ebitdaPerT[0])} / ${n0(ctx.CBA.ebitdaPerT[1])} / ${n0(ctx.CBA.ebitdaPerT[2])} per tonne on the Screener basis (≈₹500/t below the company's basis) and volumes of ${ctx.CBA.volumeT.map(v => Math.round(v / 1000)).join(' / ')} kt for FY27-29E, below management's 'high single-digit' growth. Management's ₹24,000-25,000/t five-year aspiration would need the specialty and battery mix of Vision 2030; its earlier ₹20-22/kg aspiration (FY25) was followed by ₹14.9/kg.` },
  ],
};

module.exports = { business, history, industry, tailwind, carbonBlack };
