// Sai Life Sciences report, part 3: CRO (discovery), CDMO (pipeline and customers), capacity & capex.
const X = require('./SAILIFE.ctx');
const { C, F, A, AS, n0, n1, BL, LINES, YRS, FY26, Q1, ai } = X;
const CAP = C.capacity, PIPE = FY26.pipeline;

const cro = {
  id: 'cro', nav: 'CRO: discovery', kicker: 'CRO (35% of revenue)', title: 'Discovery: the steadier engine, +24% in FY26 and Q1FY27, increasingly integrated and increasingly large pharma',
  blocks: [
    { p: `Discovery revenue was ₹${n0(FY26.croDeck)} cr in FY26 (+24%) and ~₹${n0(Q1.cro)} cr in Q1FY27 (+24%). The CFO says it has compounded at ~30-35% a year over four to five years, helped by the Boston lab, which meets biotechs "even before they actually have a need" for an Indian partner. Sai sells integrated programmes (chemistry, biology, DMPK and toxicology together) to ~65% of its discovery customers; in Q1FY27 a pilot with a large pharma became "a long-term, high-volume discovery chemistry partnership" and management hopes to move two large pharmas to integrated models in FY27. A new discovery facility opened in Q1FY27 was sold out at once, and a 100,000 sq ft R&D building opened at Genome Valley. On our reading of the deck, pharma's share of discovery revenue rose from ~38% to ~48% in FY26.` },
    { pair: [
      { type: 'column', title: 'CRO revenue: ₹497 cr (FY24) to ~₹1,316 cr (FY29E)', unit: 'CRO revenue (₹ crore)', x: ['FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'CRO', values: [497, 626, FY26.croDeck, ...LINES.cro.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'AR FY25-26 (FY24 audited contract revenue); Q4FY26 deck; GAM estimates FY27-29E' },
      { type: 'column', title: 'Q1FY27: CRO +24%, CDMO +6%', unit: 'Revenue (₹ crore)', x: ['Q1FY26', 'Q1FY27'], series: [{ name: 'CDMO', values: [313, Q1.cdmo], fmt: 'num' }, { name: 'CRO', values: [179, Q1.cro], fmt: 'num' }], labels: 'all', source: 'Q1FY27 deck and call (60/40 mix, growth rates); Q1FY26 derived' },
    ] },
    { callout: `**Our view:** discovery is the part of Sai that compounds most predictably, because it is billed by scientist or project and customers buy more services over time. We model +${BL.growth.cro[0]}% in FY27 and +${BL.growth.cro[1]}% / +${BL.growth.cro[2]}% after, as capacity is added in steps. The risk is the biotech half of the customer base: funding was weak in 2024-25 and the AR expects only 8-10% sector growth in FY27.` },
  ],
};

const cdmo = {
  id: 'cdmo', nav: 'CDMO: pipeline & customers', kicker: 'CDMO / CMC (65% of revenue)', title: 'CDMO: 33 commercial and 14 late-phase molecules for large pharma; growth comes in campaigns, and Q1FY27 was a slow one',
  blocks: [
    { p: `CDMO revenue was ₹${n0(FY26.cdmoDeck)} cr in FY26 (+33%; ₹1,361 cr of contract revenue plus ₹56 cr of solvent sales and government incentives) and ~₹${n0(Q1.cdmo)} cr in Q1FY27 (+6%). The portfolio at Mar-26: ${PIPE.commercial} commercial molecules, ${PIPE.phase3PreReg} in Phase III or pre-registration and ${PIPE.earlyPhaseProgrammes} programmes in early development; by Jun-26, 33 and 14. Sai supported 17 launches in five years and five FDA-approved drugs in CY2025. HDFC Securities counts 38 APIs and intermediates for 28 commercial drugs, seven of them blockbusters. The pipeline now grows three ways (CEO): biotech clients acquired by pharma partners keep their molecules with Sai, pharma moves acquired molecules to Sai as a preferred vendor, and dedicated FTE development teams carry molecules into late phase. Five of the six late-phase molecules added in the last 15 months came from FTE relationships, one of which now runs from discovery to commercial.` },
    { exhibit: { type: 'table', title: 'The CDMO pipeline at Jun-2026', head: ['Stage', 'Number', 'What happens next', 'Recent movement'], wide: [2, 3], rows: [
      ['Early development (pre-clinical to Phase II)', `${PIPE.earlyPhaseProgrammes} programmes (Mar-26)`, 'High attrition; Sai tracks them as projects, not molecules', 'Formulation for Phase I-II supply opening in ~6 months'],
      ['Late phase (Phase III / pre-registration)', '14 (11 at Mar-26)', 'One approval in FY26; two regulatory milestones in FY27; one in Q2FY28', 'Six added in 15 months, five via large-pharma FTE teams'],
      ['Commercial', '33 (34 at Mar-26)', 'Volumes follow the drug\'s sales and the client\'s stocking', 'Four commercial contracts for FY27: production started on three (two as primary supplier), "decently sized" by value'],
    ], source: 'Q4FY26 deck p.30; Q1FY27 deck p.8 and call' } },
    { h: 'Customers: concentrated by campaign, not by name' },
    { p: `No customer is very large. One customer paid ₹${n0(FY26.topCustomer.revenue)} cr (${FY26.topCustomer.pct}% of revenue) in FY26; in FY25 two customers paid ₹${n0(FY26.topCustomer.fy25Revenue)} cr (${FY26.topCustomer.fy25Pct}%), and in FY24 none passed 10%. Returning customers brought over 90% of revenue in FY25 and FY26, and the average large-pharma relationship is 11+ years old. Concentration shows up instead in timing: a commercial customer's destocking turned Q1FY25 into a loss quarter and forced a provision on an early intermediate (₹34 cr of it reversed in FY26 when orders resumed). Sai names none of its customers or molecules.` },
    { callout: `**Our read:** the CDMO funnel is healthier than one slow quarter suggests (14 late-phase molecules, FTE-fed), and customer risk is lower than at most Indian CDMOs. But CDMO revenue moves with a few campaigns and Sai will not guide by business. We model +${BL.growth.cdmo[0]}% in FY27 (H2-weighted as the Bidar block starts) and +${BL.growth.cdmo[1]}% / +${BL.growth.cdmo[2]}% in FY28-29 as late-phase molecules convert.` },
  ],
};

const capexY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const capacity = {
  id: 'capacity', nav: 'Capacity & capex', kicker: 'Capacity', title: 'Capacity: 700 KL to ~1,150 KL by end-FY27 and a ~1,400 KL greenfield after; capex doubles to ₹1,100-1,300 cr in FY27',
  blocks: [
    { p: `Sai's manufacturing capacity went from 200 KL in 2017 to 526 KL in FY25 and ~700 KL by Sep-2025 (80 production trains at Bidar, reactors of 0.25-12 KL, an HPAPI block). Two more 225 KL production blocks (450 KL) are being built at Bidar; the first starts in H2/Q3FY27 and management expects ~1,150 KL by end-FY27. Utilisation was 65% in Q1FY27. Beyond that, Sai has bought ~40 acres at Choutuppal near Hyderabad for a greenfield site designed for ~1,400 KL plus development, warehousing and QC, where a commercial peptide plant should run from 2028 (peptide spend under ₹300 cr). On the research side, a discovery block opened in Q1FY27 (already full), a 100,000 sq ft R&D facility opened at Genome Valley, a new process R&D block doubles PRD capacity, and an XDC centre and a clinical formulation unit are coming.` },
    { exhibit: { type: 'table', title: 'Capacity and investment plan', head: ['Item', 'Capacity / spend', 'Timing', 'Status at Sep-2026'], wide: [3], rows: [
      ['Bidar (Units IV and VI)', `${CAP.installedKL} KL installed`, 'Running', 'Utilisation ~65% (Q1FY27); 100% renewable power'],
      ['Two new production blocks, Bidar', `+${CAP.underwayKL} KL (2 x 225 KL)`, 'First block H2/Q3FY27', '"On track"; ~1,150 KL by end-FY27'],
      ['Choutuppal greenfield (~40 acres)', '~1,400 KL planned', 'Peptide plant 2028; rest not dated', 'Land acquired; capex not disclosed'],
      ['Discovery and R&D (Hyderabad)', 'New discovery block; 100,000 sq ft R&D building; PRD block', 'Q1FY27', 'Opened; discovery block sold out'],
      ['Clinical formulation (oral solids to Phase II)', 'n.d.', '~6 months from Aug-2026', 'Customer interest from large pharma'],
      { hl: true, cells: ['**Capex**', '**FY26 ₹633 cr; FY27 ₹1,100-1,300 cr**', '**~75% capacity, ~25% capability/AI**', '**₹263 cr spent in Q1FY27; commitments ₹354 cr at Mar-26**'] },
    ], source: 'AR FY26 p.52 and note 43; Q4FY26 deck p.8; Q1FY27 deck and call; HDFC Securities (capacity history)' } },
    { pair: [
      { type: 'column', title: 'Capex: ~₹200-370 cr a year to FY25, ₹593 cr in FY26, ₹1,200 cr in FY27E', unit: '₹ crore', x: [...capexY, ...YRS], series: [{ name: 'Operating cash flow', values: [...capexY.map(y => A.cfo[ai(y)]), ...F.cfo.map(Math.round)], fmt: 'num' }, { name: 'Capex', values: [...capexY.map(y => A.capex[ai(y)]), ...F.capex], fmt: 'num' }], labels: 'all', source: 'Screener.in (plant purchases; company FY26 capex ₹633 cr); GAM estimates (engine operating cash flow excludes treasury income)' },
      { type: 'column', title: 'Revenue per rupee of gross block: ~0.8-0.9x, falling as capex runs ahead of revenue', unit: 'Revenue ÷ year-end gross block (x)', x: ['FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'Asset turn', values: [...['FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(A.sales[ai(y)] / A.grossBlock[ai(y)] * 100) / 100), ...YRS.map((_, i) => Math.round(F.sales[i] / F.grossBlock[i] * 100) / 100)], fmt: 'x' }], labels: 'all', source: 'Screener.in gross block; GAM (engine gross block adds capex as spent)' },
    ] },
    { callout: `**What it means:** Sai is entering its heaviest investment phase: ₹${n0(F.capex[0])} cr, ₹${n0(F.capex[1])} cr and ₹${n0(F.capex[2])} cr in FY27-29E against ₹${n0(X.capex6)} cr in the six years to FY26. Operating cash flow covers only about half, so free cash flow is about −₹${n0(-F.fcf[0])} cr in FY27E and −₹${n0(-F.fcf[1])} cr in FY28E, and Sai borrows. At its historical ~0.85x revenue per rupee of gross block, ₹2,800 cr of new assets could support ~₹2,400 cr of extra revenue at full use, more than our FY29E adds (~₹1,400 cr). The capacity is there for growth beyond FY29; the returns dip until it fills.` },
  ],
};

module.exports = { cro, cdmo, capacity };
