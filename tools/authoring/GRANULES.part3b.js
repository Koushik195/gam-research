// Granules India report, part 3b: plants and the FDA; growth projects (Genome Valley, peptide CDMO, oncology, CZRO) and capex.
const X = require('./GRANULES.ctx');
const { C, A, F, SQ, YRS, LINES, BL, n0, n1, ai } = X;
const GP = C.growthProjects, PL = C.plants;

const plants = {
  id: 'plants', nav: 'Plants & the FDA', kicker: 'Regulatory', title: 'Plants and the FDA: seven of eight sites are clean, but the biggest one has been under a warning letter since Feb-2025 and its re-inspection date is the FDA\'s call',
  blocks: [
    { p: 'Gagillapur, near Hyderabad, holds ~68% of Granules\' finished-dosage capacity (26.8 bn dosages) and its main PFI plant. The FDA inspected it from 26-Aug to 6-Sep-2024 and issued six observations; Granules paused the site for a few days, classified OAI in Dec-2024, and received warning letter 320-25-48 dated 26-Feb-2025. Existing products have kept shipping throughout; what stopped is new approvals from the site. Granules hired three independent consultants, completed cleaning validation across the PFI, MUPS and FD blocks with dedicated equipment, closed more than 100 corrective actions, met the FDA in Jan-2026 and filed all responses in Feb-2026. On 29-Sep-2026 the ED said "we expect them to come anytime now". Australia\'s TGA inspected the site in Apr-2026 with no critical findings, and Brazil\'s ANVISA issued a GMP certificate.' },
    { p: '**Why it matters.** Nine pending US approvals (~USD11 bn market) wait for the re-inspection, and the warning letter has cost money: ~₹60 cr of remediation consultants in FY26 and ~₹100 cr of abnormal costs in all, including failure-to-supply penalties and air freight (CFO, 29-Sep-2026), now under USD1 mn a quarter. Granules has reduced the risk by moving products to Genome Valley and GPI. Honest assessment: remediation looks thorough and the rest of the network is clean, but the FDA has taken two years to return and the timing of a re-inspection, and its outcome, are not in the company\'s hands.' },
    { exhibit: { type: 'table', title: 'US FDA status of each plant on 30-Sep-2026', head: ['Site', 'Role', 'Last FDA inspection', 'Status on 30-Sep-2026'], wide: [1, 3], rows: PL.map(p => [p.site, p.role, p.lastFda, p.status30Sep]), source: 'FDA warning letter 320-25-48; Q1FY27 deck p.17; Q4FY26 and Q1FY27 calls; webinar 29-Sep-2026' } },
    { callout: '**In our numbers:** the base case assumes the FDA re-inspects in FY27 and the nine approvals begin to launch during FY28 (part of FD +13% in FY28E). The bull case assumes clearance in FY27 with faster launches; the bear case assumes a failed re-inspection that keeps approvals blocked into FY29 (revenue growth ~5 points a year lower).' },
  ],
};

const capY = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const growth = {
  id: 'growth', nav: 'Growth projects', kicker: 'Growth projects', title: 'Growth projects: Genome Valley is built and must now fill; the peptide CDMO is small, loss-making and promises five times its revenue in five years',
  blocks: [
    { p: `**Genome Valley (GLS)** is a 10 bn-dosage tablet plant that adds ~40% to Granules' formulation capacity. It cleared its FDA inspection in Dec-2025 (EIR, VAI) and has an EU-GMP certificate; Rx shipments have started, but utilisation was "very low" in Q1FY27 and the CFO expects it to cross 50% by end-FY27. Its cost is not disclosed separately: FY22-FY26 capex of ₹2,311 cr covered GLS, the MUPS block and the US packaging facility. Until GLS fills, it weighs on ROCE (18.0% in Q1FY27).` },
    { p: `**Senn Chemicals (peptide CDMO).** Granules paid CHF20 mn (₹198 cr) for the equity in Apr-2025 and took on ₹150 cr of debt: an enterprise value of ~₹450 cr for a business with ~USD20 mn of revenue. FY26 revenue was ₹159 cr with an EBITDA loss of ₹44.5 cr; Q4FY26 was EBITDA positive on ₹70 cr; Q1FY27 fell back to ₹60 cr and a ₹12.4 cr loss ("project-to-product mix"). Roughly a third of revenue is development work, a third commercial supply and a third work for other CDMOs, across pharma and cosmetics, with double-digit customers. Targets: PAT positive in FY27, a ~USD50 mn run-rate with 30%+ EBITDA margin in about three years, and >USD100 mn in five. Planned spend: solid-phase reactors, purification and lyophilisation in Zurich (not quantified), then ~₹100 cr for peptide intermediates and ~₹200 cr for peptide API at Vizag. We forecast ₹${n0(LINES.cdmo[0])} / ${n0(LINES.cdmo[1])} / ${n0(LINES.cdmo[2])} cr for FY27-29E (~USD41 mn by FY29E), below the target.` },
    { pair: [
      { type: 'column', title: 'Peptide CDMO revenue by quarter: lumpy, ₹28-70 cr', unit: 'Peptide CDMO revenue (₹ crore)', x: SQ.filter(q => q.cdmo > 0).map(q => q.q), series: [{ name: 'CDMO', values: SQ.filter(q => q.cdmo > 0).map(q => q.cdmo), fmt: 'num' }], labels: 'all', source: 'Company decks (Q1FY26-Q1FY27)' },
      { type: 'column', title: 'Capex: ₹380-570 cr a year; ₹600-650 cr ahead', unit: 'Capex (₹ crore)', x: [...capY, ...YRS], series: [{ name: 'Capex', values: [...capY.map(y => Math.round(A.capex[ai(y)])), ...F.capex], fmt: 'num' }], labels: 'all', highlight: 'FY27E', source: 'Screener.in (cash-flow capex); GAM estimates (guidance ~₹600 cr FY27, ~₹2,000 cr over 3-4 years)' },
    ] },
    { exhibit: { type: 'table', title: 'Growth projects: cost, timing and returns', head: ['Project', 'What', 'Cost', 'Timing', 'Returns so far'], wide: [1, 2, 4], rows: GP.map(g => [g.name, g.what, g.cost, g.timing, g.returns]), source: 'AR FY26 (note 39); Q4FY26 deck and call; Q1FY27 deck and call; webinar 29-Sep-2026' } },
    { callout: '**Our view:** management\'s capital allocation has improved (in practice CZRO has shrunk from a ~₹2,000 cr plan to a ~₹200 cr plant, and capex is now "milestone-based"), but the record on new ventures is mixed: CZRO stalled against Chinese prices, Senn lost money in its first year and oncology has contributed little. With net cash after Sep-2026 and the CMD "very actively" looking at acquisitions, the next big decision is how the ₹1,762 cr of new equity is used. We model no acquisition.' },
  ],
};

module.exports = { plants, growth };
