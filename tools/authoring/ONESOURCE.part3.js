// OneSource report, part 3: one chapter per business (DDC/GLP-1, base business, biologics) and capacity & regulatory status.
const X = require('./ONESOURCE.ctx');
const { C, F, n0, n1, BL, LINES, YRS, AS } = X;
const CAP = C.capacity;

const ddc = {
  id: 'ddc', nav: 'DDC & GLP-1', kicker: 'Segment: DDC', title: 'Drug-device combinations: one sold-out cartridge line becomes three; FY28 depends on emerging-market volumes and on keeping customers once capacity is no longer scarce',
  blocks: [
    { p: `The DDC business fills peptide drugs into cartridges and syringes and assembles them into pens, for 20+ customers and 50+ projects (seven variants of liraglutide, semaglutide and tirzepatide generics, plus small-molecule and biologic DDCs). Until Q1FY27 everything ran on one line with ~225 sterile production days a year and a 200-litre batch limit; it was "fully committed back-to-back" and OneSource stopped accepting new customers. The US$100m programme adds a second line (commercial in Q2FY27) and a third (installed within FY27), each able to run 500-1,000-litre batches, and a fourth later in FY28: 675 sterile days in FY28 against 225 in FY26, and up to 2.5x more pens per day on the bigger batches. Line 1 reached its full revenue contribution in Q1FY27 (CEO). Customers reserve capacity with upfront fees and take-or-pay terms, but in Jan-2026 the Chairman said some take-or-pay obligations were deferred in exchange for longer contracts.` },
    { exhibit: { type: 'table', title: 'What has to happen for the DDC ramp', head: ['Driver', 'Status on 30-Sep-2026', 'In our numbers'], wide: [1, 2], rows: [
      ['Canada (3 of 3 approvals on OneSource)', "Launched by two partners from May-2026; Dr Reddy's paused supply on 9-Jul-2026 (API issue) and guided a resumption in a few months", 'Full year in FY27-28'],
      ['India (patent expired Mar-2026)', '~40% of generic pens in Jun-2026; prices falling', 'Yes'],
      ['Brazil, MENA, Turkey, rest of world', 'Approvals awaited (ANVISA reviewing ~17 filings); Hikma launching in Saudi Arabia', 'From H2FY27, mostly FY28'],
      ['Line 2 / line 3 / line 4', 'Q2FY27 / within FY27 / later in FY28', 'Lines 2-3 in FY28E, line 4 in FY29E'],
      ['Batch-size increase to 500L', 'Customers filing changes; "annual reportable" in most markets', 'Partly'],
      ['US and Europe semaglutide; tirzepatide', 'US tentative approval (Orbicular); two first-to-file tirzepatide customers', 'Not before FY31 (beyond our forecast)'],
    ], source: 'Q3FY26, Q4FY26 and Q1FY27 calls and decks; Dr Reddy\'s BSE filing (9-Jul-2026)' } },
    { pair: [
      { type: 'column', title: 'Sterile production days: 225 → 675 by FY28', unit: 'Sterile production days a year (cartridge lines)', x: ['FY26', 'FY27 (line 2 from Q2)', 'FY28 (3 lines)'], series: [{ name: 'Days', values: [225, 450, 675], fmt: 'num' }], labels: 'all', source: 'Q4FY26 and Q1FY27 calls (FY27 = run-rate after line 2)' },
      { type: 'stacked', title: `Our build: DDC & biologics ₹${n0(BL.base.ddc)} cr → ₹${n0(LINES.ddc[2])} cr by FY29E`, unit: 'Revenue (₹ crore); FY26 split = GAM estimate', x: ['FY26', ...YRS], series: [{ name: 'DDC & biologics', values: [BL.base.ddc, ...LINES.ddc].map(Math.round), fmt: 'num' }, { name: 'Base business', values: [BL.base.core, ...LINES.core].map(Math.round), fmt: 'num' }], minLabel: 300, source: 'GAM estimates (assumptions.json businessLines)' },
    ] },
    { callout: `**Our view:** the capacity is real and sold; the uncertainty is the price per sterile day once lines 2-4 and competitors' lines are running, and the timing of approvals OneSource does not control (it was late by one to two quarters in FY26). We assume DDC & biologics revenue roughly doubles in FY27E (+${n0(BL.growth.ddc[0])}%) and grows ${n0(BL.growth.ddc[1])}% in FY28E: fast, but about a year behind the plan behind the US$400m target.` },
  ],
};

const base = {
  id: 'base', nav: 'Injectables & soft gels', kicker: 'Segment: base business', title: 'The base business: a steady ~₹800 cr of sterile injectables and soft gels, much of it sold to the Strides group; new capacity from FY28',
  blocks: [
    { p: 'The base business came from the 2024 merger. **Sterile injectables** (the former Steriscience CDMO business) makes vials and pre-filled syringes at the SPD site, focusing on products that are often in short supply in the US, and runs a dedicated USFDA-approved penicillin fill-finish plant under a tolling agreement with the site operator (a top-5 penicillin supplier to the US in its molecules). A ~4-month shutdown in Q2-Q3FY27 adds lyophilisation, long-acting injectables and high-viscosity PFS capacity, which management expects to matter from FY28. **Soft gelatin capsules** were Strides\' captive plant (Strides\' brands are still the largest buyer: Strides-group entities bought ₹372 cr of goods in FY26). Capacity was tripled to 2.4bn capsules a year; OneSource now sells to third parties (tech transfers from European sites, a first oncology NDA with a top-10 US generic company) and expects the plant to be full in 12-24 months, after which it needs a greenfield site; the current site is shared with Strides under a limited-period transition agreement, for which OneSource paid Strides ₹88 cr of process and conversion charges in FY26.' },
    { exhibit: { type: 'table', title: 'Base business: our assumptions', head: ['', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ['Growth', ...BL.growth.core.map(g => `${g}%`), 'Shutdown in FY27; new injectables capacity and full soft-gel plant in FY28'],
      ['Revenue (₹ cr)', ...LINES.core.map(n0), `From ~₹${n0(BL.base.core)} cr in FY26 (GAM estimate)`],
    ], source: 'GAM estimates; Q1FY27 and Q4FY26 calls' } },
    { callout: '**Our view:** a useful, cash-generating base, but not independent: the soft-gel plant\'s largest buyer, its site and some of its services sit with the promoter\'s other companies. Any change in Strides\' sourcing would show up here first.' },
  ],
};

const biologics = {
  id: 'biologics', nav: 'Biologics', kicker: 'Segment: biologics', title: 'Biologics: a 4x larger funnel and new biosimilar partners, but development fees only until FY29; capacity needs another round of capex',
  blocks: [
    { p: 'The flagship site is one of few globally that make biologic drug substance (microbial 1KL; mammalian 2 x 2KL single-use) and fill the drug product on the same site. The funnel of requests for proposal is ~4x a year earlier, helped by new US and EU biosimilar guidance and the BIOSECURE Act. FY26-27 wins: a European biosimilar developer, a US biosimilar major (5+ products), Formycon (Germany), a second project with a top-3 animal-health company. All are development (MSA) work now; management expects commercial manufacturing from FY29 and plans +5KL microbial and +4KL mammalian capacity, "significantly lower" in cost than the DDC programme. Management will not say whether biologics is profitable yet.' },
    { callout: '**Our view:** a credible long-term option that we value only through the FY29E numbers and the DCF; we do not give it a separate value. A failure to convert MSAs into commercial supply by FY29-30 would be the second test management has to pass.' },
  ],
};

const capacity = {
  id: 'capacity', nav: 'Capacity & regulatory', kicker: 'Capacity', title: 'Five sites, 210+ audits without a failure; the USFDA inspected the sterile site in Jun-2026 and the outcome was not public by 30-Sep',
  blocks: [
    { exhibit: { type: 'table', title: 'Sites, capacities and approvals', head: ['Site', 'What it does / capacity', 'Approvals and recent inspections'], wide: [1, 2], rows: CAP.sites.map(s => [s.site, s.what, s.approvals]), source: 'Q4FY26 deck p.21; CARE (5-Mar-2026); AR FY26; calls' } },
    { bullets: C.regulatory },
    { p: `**Capex:** ${X.rup(CAP.expansion)} We forecast capex of ₹${AS.capex.map(n0).join(' / ')} cr for FY27-29E.` },
    { callout: '**Our view:** compliance is a real strength and the reason customers file on OneSource\'s site. The pending item is the USFDA inspection of the SPD sterile site in Jun-2026; a clean outcome matters because that site is being rebuilt for higher-value products.' },
  ],
};

module.exports = { ddc, base, biologics, capacity };
