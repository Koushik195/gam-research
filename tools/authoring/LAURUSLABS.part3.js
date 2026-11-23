// Laurus Labs report, part 3: CDMO (contracts, molecules, capacity, big-pharma customers), Affordable Medicines
// (ARV, oncology, non-ARV, CMO), Laurus Bio and the cell/gene therapy and ADC bets, capacity and capex.
const X = require('./LAURUSLABS.ctx');
const { C, A, F, AS, n0, n1, SA, SQ, Q1, FY26, BL, LINES, YRS, cdmoShare, amTot, capexPct26, capex5, cfo5, assetTurn, ai } = X;
const G = BL.growth, CX = C.capex;
const H = SA.filter(a => a.fy >= 'FY22');

const cdmo = {
  id: 'cdmo', nav: 'CDMO', kicker: 'Segment: CDMO', title: 'CDMO: broader and more commercial than in the FY23 boom, but 45% of today\'s revenue is still launch and Phase III supply',
  blocks: [
    { p: `Small-molecule CDMO revenue was ₹384 cr in FY20 and ₹917 cr in FY22, spiked to ₹2,167 cr in FY23 on one very large purchase order, fell to ₹922 cr in FY24 when it ended, and has rebuilt to ₹1,374 cr (FY25) and ₹1,896 cr (FY26, +38%). Q1FY27 was ₹835 cr (+69%), a run-rate of ~₹3,300 cr a year. What has changed since FY23: (1) three patented APIs went commercial in the 18 months to Apr-2026, early in their patent lives, with multi-year customer forecasts and no destocking seen; (2) 55% of Q1 CDMO revenue was commercial supply (50% in FY26), most of the rest Phase III supply, and one customer's product has just won global approval; (3) management says no customer, product or therapy area is a concentration risk, and that "molecules generating ₹200 crores or more" exist; (4) the active pipeline grew from ~90 projects (FY23) to >125 across human health, animal health and crop science; (5) a new big-pharma client was added in Q1FY27.` },
    { pair: [
      { type: 'column', title: 'CDMO revenue: the FY23 order, the FY24 hole, and a higher, broader base now', unit: 'CDMO small molecules (₹ crore)', x: [...H.map(h => h.fy), ...YRS], series: [{ name: 'CDMO small molecules', values: [...H.map(h => h.cdmoSM), ...LINES.cdmo.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Company presentations; GAM estimates FY27-29E' },
      { type: 'column', title: 'Commercial supply: half of CDMO revenue in FY26, 55% in Q1FY27', unit: '% of small-molecule CDMO revenue', x: ['FY26', 'Q1FY27'], series: [{ name: 'Commercial', values: [Q1.cdmoCommercialPctFY26, Q1.cdmoCommercialPct], fmt: 'pct0' }, { name: 'Clinical (mostly Phase III)', values: [100 - Q1.cdmoCommercialPctFY26, 100 - Q1.cdmoCommercialPct], fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 call (CEO)' },
    ] },
    { h: 'Customers, contracts and capacity' },
    { p: 'Laurus names no customers and gives no contract values, citing confidentiality; the CEO dismisses project counts because "one program may give $500,000, one program may give $50 million". What it does say: customers want validation at commercial scale on the same equipment train before they award a product, so Laurus builds capacity first (the reason FY24 hurt); the FY27-28 capex is "for a purpose, for a product and capacity" needed by existing partners, across multiple customers and products, mostly APIs rather than intermediates. Animal-health APIs are already shipping commercially (Laurus Synthesis, ₹491 cr turnover in FY26); crop science needs "a couple of more financial years". Peptides: a commercial-scale block is being validated from Q2FY27, with GLP-1 and other programmes, but no project details. Customer advances were ₹645 cr at Mar-2026 (₹395 cr a year earlier); none were received in Q1FY27.' },
    { exhibit: { type: 'table', title: 'CDMO pipeline and capacity as disclosed (to 30-Sep-2026)', head: ['Item', 'Status', 'Timing (management)', 'Our assumption'], wide: [1, 2, 3], rows: [
      ['Three commercial NCE APIs (since late 2024)', 'Commercial, early in patent life; multi-year forecasts', 'Ongoing', 'Base of the FY27 run-rate'],
      ['Phase III programmes (~45% of Q1 revenue)', 'One product approved globally; more expected "soon"', 'Not given', 'Part continue into commercial supply; part pause after launch stocking'],
      ['Commercial peptide block (Vizag)', 'Validation from Q2FY27', 'FY27', 'Inside CDMO growth; no separate line'],
      ['Unit 7 greenfield API site', 'First block ready for commercial validation by Mar-2027; four more in FY28 (>2,000 KL)', 'FY28 onwards', 'Supports +20% CDMO growth in FY28-29E'],
      ['Animal health / crop science', 'Animal-health APIs commercial; crop in registration', 'Crop "a couple of more financial years"', 'Inside CDMO growth'],
      ['50% of revenue from CDMO', 'Company target', 'By FY30', `We reach ~${Math.round(cdmoShare(2))}% by FY29E`],
    ], source: 'Q4FY26 and Q1FY27 calls and presentations; GAM' } },
    { callout: `**Our view:** this is a far better CDMO business than the one that collapsed in FY24: more products, more commercial supply and visible customer demand behind the capex. But Q1's ₹835 cr includes launch and Phase III stocking that can pause, and management itself calls the business "lumpy, but predictable". We model ~₹720 cr a quarter for the rest of FY27 (CDMO +${G.cdmo[0]}% for the year) and +${G.cdmo[1]}% a year in FY28-29E as Unit 7 and the peptide block fill.` },
  ],
};

const arvRows = Object.entries(C.segmentsHistory.arv).filter(([k]) => /^FY/.test(k));
const generics = {
  id: 'generics', nav: 'Affordable Medicines', kicker: 'Segment: Affordable Medicines', title: 'Affordable Medicines: an ARV cash engine with flat volumes, and a non-ARV formulation business that is growing',
  blocks: [
    { p: `Affordable Medicines (generic APIs and formulations) grew 18% in FY26 to ₹4,733 cr and 10% in Q1FY27 (API +3%, formulations +22%). ARVs are about 60% of it: ₹2,807 cr in FY26, two-thirds API and one-third own formulations, and ₹669 cr in Q1FY27 (API ₹415 cr, formulations ₹254 cr). Management says FY26 ARV sales beat its usual "₹2,500 crores plus or minus ₹200 crores" because ARV assets were fully used, that ARV pricing was broadly constant, and that ARV revenue will stay around ₹2,800 cr while its share falls. Growth comes from non-ARV products: oncology, cardiovascular, diabetes and gastro APIs, developed-market launches (6 approvals in FY26; 96 dossiers filed) and integrated contract supply (CMO) for generic partners, helped by 20% more tablet capacity in FY26.` },
    { pair: [
      { type: 'column', title: 'API vs formulations: formulations drive the growth', unit: '₹ crore', x: [...H.map(h => h.fy), ...YRS], series: [{ name: 'Generic API', values: [...H.map(h => h.api), ...LINES.api.map(Math.round)], fmt: 'num' }, { name: 'Formulations', values: [...H.map(h => h.fdf), ...LINES.fdf.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Company presentations; GAM estimates FY27-29E' },
      { type: 'line', title: 'ARV share of revenue: from ~62% to ~33%', unit: 'ARV revenue, % of total', x: [...arvRows.map(([k]) => k), 'Q1FY27'], series: [{ name: 'ARV share', values: [...arvRows.map(([k, v]) => Math.round(v / SA.find(a => a.fy === k).revenue * 1000) / 10), Math.round(Q1.arv / Q1.revenue * 1000) / 10], fmt: 'pct0' }], labels: 'all', min: 0, max: 80, source: 'Company presentations (FY23/FY24 split is our chart reading)' },
    ] },
    { p: '**The ARV risk is slow, not sudden.** Laurus serves about a third of the world\'s HIV patients, mostly through donor-funded tenders. The company describes a stable market with "adequate funding by multi-lateral agencies" and steady dolutegravir use, and says long-acting injectables face adherence and retention challenges. But Gilead\'s royalty-free licences for twice-yearly lenacapavir went to six other generic makers (Oct-2024). If long-acting regimens take share in prevention and later treatment, Laurus\'s ARV volumes would shrink without a licence of its own. Emerging-market registrations and a new South Africa office (Q1FY27) widen the non-ARV base.' },
    { callout: `**Our view:** a solid, cash-generating generic business whose ARV half will not grow and whose non-ARV half grows in the low teens. We model generic API +${G.api[0]}% / +${G.api[1]}% / +${G.api[2]}% and formulations +${G.fdf[0]}% / +${G.fdf[1]}% / +${G.fdf[2]}% (FY27-29E), taking Affordable Medicines to ₹${n0(amTot[2])} cr by FY29E. The KRKA JV's formulation plant (Laurus 49%) is equity-accounted and adds no revenue.` },
  ],
};

const bio = {
  id: 'bio', nav: 'Laurus Bio & new modalities', kicker: 'Segment: Bio, cell and gene therapy', title: 'Laurus Bio and the cell and gene therapy bets: real capabilities, ~3% of revenue, and returns that management itself puts four to five years out',
  blocks: [
    { p: `**Laurus Bio** (78.34% owned; formerly Richcore Lifesciences, bought in January 2021 when its revenue was ~₹50 cr) makes products by precision fermentation: enzymes for biocatalysis, animal-origin-free cell-culture ingredients, and contract fermentation of food proteins, colours and polymers. FY26 revenue was ₹${n0(FY26.bio)} cr (+15%; standalone turnover ₹200 cr, profit ₹6.7 cr) and Q1FY27 ₹${Q1.bio} cr (+21%). Its four 45,000-litre fermenters in Bangalore are fully used; a 400 KL plant at Vizag (initially industrial chemicals, surfactants and polymers moving from Bangalore) is due by Dec-2026, with room for 600 KL more. The CEO says the next 12-18 months decide "which molecule, which program in our precision fermentation will take off", and that Bio and crop science together (~₹250 cr revenue) need 18-24 months to assess. An outside investor holds the 21.66% minority (a ~₹120 cr strategic private-equity investment, per HDFC Securities; non-controlling interest ₹131 cr in the balance sheet).` },
    { p: '**Advanced biologics.** (1) **Cell therapy:** a 34.89% stake in ImmunoACT (equity-accounted; ₹126 cr invested), whose CAR-T therapy NexCAR19 reached >660 infusions by Jun-2026; a second plant (+2,500 treatments a year) opened in Mar-2026 and Cipla is partnering it in South Africa. (2) **Gene therapy and ADCs:** a process-development lab opened in Dec-2025 and a >65,000 sq ft cGMP site in Hyderabad (investment >₹200 cr) is due for qualification by mid/end-2027. (3) **Aarvik:** Laurus invested USD2 mn in Aarvik Therapeutics and in-licensed two pre-clinical ADC assets for India (Jul-2026), which need GLP toxicology and Phase I-II trials over 3-4 years. These push R&D to 5.8% of sales in Q1FY27 (₹118 cr, incl. ₹35 cr capitalised).' },
    { exhibit: { type: 'table', title: 'The new-modality bets at a glance', head: ['Bet', 'Vehicle', 'Money in', 'Revenue today', 'Timing (company)'], wide: [1, 4], rows: [
      ['Precision fermentation', 'Laurus Bio (78.34%)', '₹245 cr acquisition (FY21) + Vizag plant', `₹${n0(FY26.bio)} cr (FY26)`, '400 KL by Dec-2026; 12-18 months to see winners'],
      ['CAR-T cell therapy', 'ImmunoACT (34.89% associate)', '₹126 cr investment', 'Not consolidated (share of loss ₹0.6 cr FY26)', 'Scaling NexCAR19; BCMA Phase I'],
      ['Gene therapy / ADC manufacturing', 'Laurus Labs, Hyderabad', '>₹200 cr', 'Nil', 'Qualification mid/end-2027'],
      ['Own ADC assets (India)', 'Licensed from Aarvik', 'USD2 mn equity + development', 'Nil', '3-4 years to Phase I-II data'],
      ['Peptides', 'CDMO peptide block, Vizag', '"Large capex" (undisclosed)', 'Inside CDMO', 'Validation from Q2FY27'],
    ], source: 'AR FY26 (AOC-1, notes 5A, 32); Q4FY26 and Q1FY27 presentations and calls' } },
    { callout: '**Our view:** these are sensible options for a company that wants to be more than a chemistry shop, and the CFO says up to ~10% of profit goes into "disruptive technology". But they are options, not earnings: we give them no separate value, include Bio at +14% / +29% / +26% (FY27-29E) and treat the extra R&D as a cost in our margins. Their success would be upside to our bull case; their failure would cost a few hundred crore, not the franchise.' },
  ],
};

const capY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const capacity = {
  id: 'capacity', nav: 'Capacity & capex', kicker: 'Capacity', title: `Capacity: ₹${n0(capex5)} cr of capex in five years left asset turns below 1x; the next ₹3,500 cr is backed by customers, management says`,
  blocks: [
    { p: `Laurus spent ₹${n0(capex5)} cr on capex in FY22-26 (cash flow basis) against ₹${n0(cfo5)} cr of operating cash flow, so free cash flow over the five years was close to nil. Gross block rose from ₹${n0(A.grossBlock[ai('FY21')])} cr (Mar-21) to ₹${n0(A.grossBlock[ai('FY26')])} cr (Mar-26) and reactor volume to ~8,800 KL. Revenue per rupee of gross block fell from ${n1(assetTurn('FY21'))}x (FY21) to ${n1(assetTurn('FY26'))}x (FY26); the CFO puts the asset turn at 0.89x and management targets "a little over 1.0" in the medium term. Capex now steps up again: ₹${n0(FY26.capex)} cr in FY26 (${n1(capexPct26)}% of sales), ₹394 cr in Q1FY27, ₹2,000 cr guided for FY27 (twice raised from ₹1,000 cr) and ">₹3,000 crores" over FY27-28, "we may do more". Beyond that sits the 532-acre Laurus Pharma Zone at Vizag, a >USD600 mn, ~8-year plan starting from end-FY27.` },
    { pair: [
      { type: 'column', title: 'Capex vs depreciation: building far ahead of wear and tear', unit: '₹ crore', x: [...capY, ...YRS], series: [{ name: 'Capex', values: [...capY.map(y => A.capex[ai(y)]), ...F.capex], fmt: 'num' }, { name: 'Depreciation', values: [...capY.map(y => A.dep[ai(y)]), ...F.dep.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'line', title: 'Asset turn: 1.6x in FY21, ~1.0x now', unit: 'Revenue ÷ gross block (x)', x: ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Asset turn', values: ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(assetTurn(y) * 100) / 100), fmt: 'n2' }], labels: 'all', min: 0, max: 2, source: 'Screener.in (gross block excludes CWIP); company quotes 0.89x for FY26 on its own basis' },
    ] },
    { exhibit: { type: 'table', title: 'Where the money is going', head: ['Project', 'What', 'When'], wide: [1, 2], rows: [
      ['Unit 7 (Vizag)', 'Greenfield large-scale API; five blocks, >2,000 KL', 'First block validation by Mar-2027; four in FY28'],
      ['Peptide block (Vizag)', 'Commercial-scale peptide manufacturing', 'Validation from Q2FY27'],
      ['Animal health (Unit 10, LSPL Unit 2)', 'API and intermediate blocks for animal-health CDMO', 'Under way'],
      ['Laurus Bio fermentation (Vizag)', '+400 KL; space for 600 KL more', 'Commissioning by Dec-2026'],
      ['KRKA JV (Hyderabad)', 'High-potency and general oral solids (Laurus 49%)', 'Phase I mid-2027; ₹400 cr in, ₹400 cr more (partly partner loans)'],
      ['Gene therapy / ADC (Hyderabad)', 'cGMP bioconjugation and fill-finish', 'Qualification mid/end-2027'],
      ['Laurus Pharma Zone (532 acres, Vizag)', 'Next-generation multi-site campus', '>USD600 mn over ~8 years from end-FY27'],
    ], source: 'Q4FY26 and Q1FY27 calls and presentations; Sep-2026 investor presentation' } },
    { callout: `**Our view:** Laurus's capex record is mixed: it built ahead of demand in FY22-24 and suffered, then that capacity won the products that drive today's growth. Management now says the new capex is tied to specific products and customers, which is more reassuring. We model capex of ₹${n0(F.capex[0])} / ${n0(F.capex[1])} / ${n0(F.capex[2])} cr (FY27-29E), depreciation rising to ~₹${n0(F.dep[2])} cr, and net debt peaking near ₹${n0(X.netDebtCo[1])} cr at Mar-2027 before falling.` },
  ],
};

module.exports = { cdmo, generics, bio, capacity };
