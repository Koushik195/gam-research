// Acutaas Chemicals report, part 3: CDMO and molecule/patent exposure, base pharma intermediates, specialty chemicals (battery,
// semiconductors, commodity), capacity & capex.
const X = require('./ACUTAAS.ctx');
const { C, F, A, AS, n0, n1, BL, LINES, YRS, SA, FY26, Q1, b, ai, cdmoShare26 } = X;
const CD = C.cdmo, CAP = C.capacity;

const cdmo = {
  id: 'cdmo', nav: 'CDMO & molecule exposure', kicker: `CDMO (~${Math.round(cdmoShare26)}% of FY26 revenue)`, title: 'CDMO: one contract for one cancer drug took revenue from ₹57 cr to ₹635 cr in two years; the patent clock runs to 2033-35',
  blocks: [
    { p: `In CY22 Acutaas signed a 10-year agreement to supply five key intermediates for **darolutamide** to Fermion, the API unit of Finland's Orion; Orion makes the tablets and Bayer sells them worldwide as **Nubeqa**, a prostate-cancer drug approved in ~90 countries. As Nubeqa won new uses (it is being tested across almost all stages of prostate cancer), Acutaas's CDMO revenue went from ₹${n1(CD.revenue.FY24)} cr in FY24 to ₹${n1(CD.revenue.FY25)} cr in FY25 and ~₹${n0(CD.revenue.FY26)} cr in FY26 (PL, company data), ~${Math.round(cdmoShare26)}% of group revenue. Bayer raised its peak-sales guidance for Nubeqa from over EUR1bn to over EUR3bn and expected ~50% growth in 2026. Management guides CDMO revenue of ₹1,000 cr by FY28 and says it is "confident to beat" it. Four more CDMO molecules were validated in FY26 (cardiovascular and oncology, per JM) and should start in H2FY27 once their owners get approvals, at ₹50-100 cr each at peak.` },
    { exhibit: { type: 'table', title: 'The darolutamide contract in brief', head: ['Item', 'Detail'], wide: [1], rows: [
      ['Counterparty', 'Fermion Oy (Orion Corporation); Bayer markets Nubeqa'],
      ['Scope', 'Five key intermediates; Acutaas is the "primary supplier" (Q4FY26 call)'],
      ['Term', '10 years from CY22 (to ~CY32); "long-term supply contract already in place for 10 years" (Q4FY26 call)'],
      ['Revenue', `FY24 ₹${n1(CD.revenue.FY24)} cr → FY25 ₹${n1(CD.revenue.FY25)} cr → FY26 ~₹${n0(CD.revenue.FY26)} cr (CDMO total; "majority" darolutamide)`],
      ['Patent protection (Nubeqa)', 'USA 2033, Japan 2033, Brazil 2033; Germany, France, Italy, Spain, Switzerland 2035; UK 2029 (PL)'],
      ['Capacity', 'Built: "we have already built our capacity, which can suffice those production requirements" (Q4FY26 call)'],
    ], source: 'PL initiation (Jul-2026, Exhibits 21 and 24); Q4FY26 and Q1FY27 calls; JM Financial via Business Today (10-Sep-2026)' } },
    { pair: [
      { type: 'column', title: 'CDMO revenue: guided to ~₹1,000 cr by FY28', unit: 'CDMO revenue (₹ crore)', x: ['FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'CDMO', values: [CD.revenue.FY24, CD.revenue.FY25, CD.revenue.FY26, ...LINES.cdmo].map(Math.round), fmt: 'num' }], labels: 'all', highlight: 'FY28E', source: 'PL (company data) FY24-26; GAM estimates FY27-29E' },
      { type: 'column', title: 'CDMO share of revenue: 8% → ~50%', unit: 'CDMO as % of revenue', x: ['FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'CDMO share', values: [CD.revenue.FY24 / A.sales[ai('FY24')] * 100, CD.revenue.FY25 / A.sales[ai('FY25')] * 100, cdmoShare26, ...X.mixPct('cdmo')].map(v => Math.round(v * 10) / 10), fmt: 'pct' }], labels: 'all', source: 'PL; Screener.in; GAM estimates' },
    ] },
    { h: 'Concentration: the central risk' },
    { p: 'Acutaas does not disclose customers above 10% of revenue, and it refuses to split CDMO from the rest ("we are not giving any split", Q1FY27 call). But the arithmetic is clear: if CDMO was ~₹635 cr in FY26 and darolutamide the "majority" of it, one molecule for one customer brought something like 40% of revenue and far more of the profit, since the group margin rose 13 points as CDMO went from 28% to 47% of sales. Kotak Institutional Equities cut the stock to Reduce in Jul-2026 on exactly this point and values the Nubeqa stream separately because of its patent expiry. Management\'s answer is diversification over time: 30-40 new molecules a year into development, four validated CDMO products and "slowly, slowly, it will derisk our revenue concentration" (Q1FY27 call).' },
    { exhibit: { type: 'table', title: 'Molecule exposure beyond darolutamide (company data via PL)', head: ['Molecule (API)', 'Use', 'Acutaas position'], wide: [2], rows: C.products.positions.map(([m, pos]) => [m.split(' (')[0], (m.match(/\((.*)\)/) || [, ''])[1] || '–', pos]), source: 'PL initiation Exhibit 17 (company data, mostly FY21 shares); Q1FY27 call; JM Financial' } },
    { callout: `**Our read:** the darolutamide contract is excellent business while it lasts: patented, growing, filed in the innovator's dossiers and already supplied from built capacity. But it ends in substance when generics arrive (2033 in the US, 2035 in Europe), and a single drug's growth can slow (destocking, a second source, a competing therapy) long before that. We model CDMO at +${AS.businessLines.growth.cdmo[0]}% / +${AS.businessLines.growth.cdmo[1]}% / +${AS.businessLines.growth.cdmo[2]}% in FY27-29E, reaching the ₹1,000 cr guide in FY28; the bear case is built on darolutamide orders flattening.` },
  ],
};

const base = {
  id: 'base', nav: 'Generic intermediates', kicker: 'Pharma intermediates ex-CDMO (~40% of revenue)', title: 'The base business: strong market shares in generic intermediates, but flat revenue in FY24-26 while low-margin products were dropped; apixaban is the next lever',
  blocks: [
    { p: `Excluding CDMO, Acutaas's pharma intermediates brought ~₹511 cr in FY24, ~₹572 cr in FY25 and ~₹539 cr in FY26 (company vertical revenue less PL's CDMO series). Management says volumes grew while it "reshuffled" the portfolio in 9MFY26, dropping low-margin products, and that the business grew again from Q4FY26; in Q1FY27 the whole pharma vertical grew 76.5%, with CDMO, "top products" and "a couple of new products" all contributing. The model is to develop an intermediate for an off-patent drug years ahead, get written into generic customers' filings and win a dominant share once the patent expires: 70-90% of key intermediates for trazodone, 70-75% for dolutegravir and ~80% for entacapone (FY21 data). The next big one is **apixaban** (Eliquis, ~USD20 bn of sales), whose exclusivity ends from 2026-28; Acutaas says supplies "have already started picking up" and PL counts 25-30 generic customers lined up. JM estimates a ₹440 cr opportunity if Pfizer keeps 20% of the market after Nov-2026.` },
    { pair: [
      { type: 'column', title: 'Pharma ex-CDMO: flat for three years, growth from FY27E', unit: 'Revenue (₹ crore)', x: ['FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'Pharma ex-CDMO', values: [511.0, 571.8, 539.0, ...LINES.exCdmo].map(Math.round), fmt: 'num' }], labels: 'all', source: 'Company decks less PL CDMO series (FY24-26); GAM estimates' },
      { type: 'hbar', title: 'Key intermediates: dominant shares (FY21)', unit: 'Share of global supply (%), midpoint', x: ['Pazopanib', 'Trazodone', 'Entacapone', 'Dolutegravir', 'Apixaban'], series: [{ name: 'Share', values: [87, 80, 80, 72.5, 50], fmt: 'pct0' }], labels: 'all', source: 'PL initiation Exhibit 17 (company data)' },
    ] },
    { callout: `**Our view:** the base business is good at what it does but is a price-competitive generic supplier, and its FY21 market-share claims are old. Its growth depends on picking the next patent expiries; apixaban looks like a strong one. We model +${AS.businessLines.growth.exCdmo[0]}% / +${AS.businessLines.growth.exCdmo[1]}% / +${AS.businessLines.growth.exCdmo[2]}% in FY27-29E (JM: +12% a year to FY30), from a flat FY24-26.` },
  ],
};

const specialty = {
  id: 'specialty', nav: 'Specialty: battery, chips, commodity', kicker: 'Specialty chemicals (12% of FY26 revenue)', title: 'Specialty chemicals: exiting commodity products, starting battery additives and rebuilding semiconductor chemicals; ~₹195 cr in FY27E rising to ~₹510 cr in FY29E',
  blocks: [
    { p: `The specialty vertical was ₹165 cr in FY26: ~₹150 cr of commodity chemicals from the Jhagadia plant bought from Gujarat Organics and ₹16 cr of semiconductor chemicals at Baba Fine Chemicals (BFC). Its EBITDA margin was ~29% in Q4FY26 (a strong BFC quarter) and ~24% in Q1FY27 (CFO). Three things change from FY27.` },
    { exhibit: { type: 'table', title: 'The three specialty businesses', head: ['Business', 'Today', 'Plan and timing', 'Economics', 'Our FY27E / FY28E / FY29E (₹ cr)'], wide: [1, 2, 3], rows: [
      ['**Battery electrolyte additives** (Acutaas Chemicals Electrolytes; 90% after 10% went to partner ARZ)', 'Phase 1 inaugurated 19-Jan-2026: VC 2,000 + FEC 2,000 MTPA; commercial supply from Q1FY27; 9 additives developed', 'Fully contracted over three years with customers in North America and Korea; third product trial runs from Q3FY27; fourth in contract stage; ECMS incentive up to ~₹30 cr', 'Phase 1 peak revenue ~₹380 cr at ~15% EBITDA (PL); FY26 loss ₹3.7 cr', LINES.battery.map(n0).join(' / ')],
      ['**Semiconductor chemicals** (BFC 55%; Indichem 75%)', 'BFC: ₹16 cr (FY26), down from ₹51 cr (FY23) on one customer (Heraeus); Indichem plant opened 28-Aug-2026', 'BFC adds customers in Japan, Korea, Taiwan; Indichem refines precursors made in India; revenue from FY28; full use in 3-4 years', 'BFC 65-70% EBITDA at acquisition; Indichem benchmarked to BFC; HSIE USD20-25 mn in 3 years at 45-50%', LINES.semis.map(n0).join(' / ')],
      ['**Commodity & other chemicals** (Jhagadia)', '~₹150 cr: parabens, methyl salicylate, para anisic acid; 400+ customers', 'Phased out from FY27 and replaced by higher-value products on the same plant (minor capex; a transition gap)', '~10% EBITDA (HSIE)', LINES.commodity.map(n0).join(' / ')],
    ], source: 'Corporate deck; Q4FY26 and Q1FY27 calls; AR FY26 note 50; PL initiation; HSIE (21-Sep-2026); ECMS approval (18-Aug-2026)' } },
    { pair: [
      { type: 'stacked', title: 'Specialty revenue: battery and chips replace commodity', unit: 'Revenue (₹ crore)', x: ['FY26', ...YRS], series: [{ name: 'Commodity & other', values: [BL.base.commodity, ...LINES.commodity].map(Math.round), fmt: 'num' }, { name: 'Semiconductor', values: [BL.base.semis, ...LINES.semis].map(Math.round), fmt: 'num' }, { name: 'Battery additives', values: [0, ...LINES.battery].map(Math.round), fmt: 'num' }], minLabel: 30, source: 'Company decks (FY26); GAM estimates' },
      { type: 'column', title: 'BFC: bought on ₹51 cr of revenue, now ₹16 cr', unit: 'BFC revenue (₹ crore)', x: ['FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'BFC', values: [50.7, 30.3, 17.6, 15.7], fmt: 'n1' }], labels: 'all', source: 'PL initiation (company data); corporate deck (FY26)' },
    ] },
    { callout: '**Our view:** management is right to leave commodity chemicals, and the battery plant is real (built, contracted, supplying). But battery additives are a lower-margin, China-priced product, and semiconductor chemicals have so far shrunk under Acutaas\'s ownership. We put ~₹400 cr of battery and semiconductor revenue in FY29E, ~16% of the total, at blended margins below the group\'s. If both businesses reach their stated potential (₹380 cr battery, ~USD100 mn Indichem capacity), that is upside to our numbers, in the bull case.' },
  ],
};

const utilRows = CAP.units.map(u => [u[0], u[1], u[2], u[3]]);
const capexY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const capacity = {
  id: 'capacity', nav: 'Capacity & capex', kicker: 'Capacity', title: 'Capacity: Sachin is full and Ankleshwar fills by ~FY28, so land, an R&D centre and a ₹212 cr electronics plant come next',
  blocks: [
    { p: `Acutaas has ~${n0(CAP.totalKL)} KL of reactors across three Gujarat plants, plus the battery block at Jhagadia, BFC's small Greater Noida unit and Indichem in Korea. Utilisation in Q1FY27 was 83% at Sachin ("hitting the capacity utilization roof"), 23% at the rebuilt Ankleshwar plant (expected to fill by ~FY28) and 55% at Jhagadia. So the pharma side has room for about two years; after that it needs a new site, which is why the company is looking for land and plans a new R&D centre with ten times today's capacity. Neither amount has been announced. In Aug-2026 the board approved ₹212 cr for a plant making up to 81,000 MTPA of electronic-grade chemicals in Gujarat, due by end-FY28. The FY23-30 plan already spent or committed ~₹1,000 cr: pharma ~₹320 cr (done), battery ~₹220 cr, Indichem ~₹200 cr, a pilot plant ~₹25 cr and solar ~₹50 cr.` },
    { exhibit: { type: 'table', title: 'Plants, capacity and use', head: ['Plant', 'Capacity', 'What it makes', 'Utilisation'], wide: [2], rows: utilRows, source: 'Corporate deck (Mar-2026); Q1FY27 call (utilisation)' } },
    { pair: [
      { type: 'column', title: 'Capex: ₹100-330 cr a year since FY24', unit: '₹ crore', x: [...capexY, ...YRS], series: [{ name: 'Operating cash flow', values: [...capexY.map(y => A.cfo[ai(y)]), ...F.cfo.map(Math.round)], fmt: 'num' }, { name: 'Capex', values: [...capexY.map(y => A.capex[ai(y)]), ...F.capex], fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates (engine operating cash flow excludes treasury income)' },
      { type: 'column', title: 'Revenue per rupee of gross block: ~1.4-2.3x', unit: 'Revenue ÷ year-end gross block (x)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'Asset turn', values: [...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(A.sales[ai(y)] / A.grossBlock[ai(y)] * 100) / 100), ...YRS.map((_, i) => Math.round(F.sales[i] / F.grossBlock[i] * 100) / 100)], fmt: 'x' }], labels: 'all', source: 'Screener.in gross block (excludes ₹332 cr of CWIP at Mar-26); GAM' },
    ] },
    { callout: `**What it means:** we forecast capex of ₹${n0(F.capex[0])} / ${n0(F.capex[1])} / ${n0(F.capex[2])} cr for FY27-29E, more than the ~₹95 cr guided for FY27 because we include the electronics plant and an allowance for the R&D centre, land and the next pharma block. Acutaas can fund this from cash flow and its ₹314 cr of net cash. The real question is returns: the next plants serve batteries, electronics and new CDMO molecules, none of which yet earns what darolutamide does.` },
  ],
};

module.exports = { cdmo, base, specialty, capacity };
