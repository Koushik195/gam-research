// Caplin Point report, part 3b: plants, R&D and backward integration (oncology, API, COL-II, Mexico); competitive advantage.
const X = require('./CAPLIPOINT.ctx');
const { C, D, n0, n1, FY26, Q1, AS, F } = X;

const plants = {
  id: 'plants', nav: 'Plants, R&D & APIs', kicker: 'Capex and plants', title: 'Plants: oncology is running, APIs and three more plants arrive by FY28; all of it costs before it earns',
  blocks: [
    { p: `Caplin is in the middle of its biggest build-out: ~₹1,000-1,100 cr, about half spent by May-2026, all from internal cash. **Already done:** a lyophilised-injectable and dual-chamber-syringe facility at CP1 Puducherry (INVIMA-approved; dual-chamber pre-filled syringes filed in Central America and Ecuador, "no Indian company has brought this technology to Latin America", per Ashok Partheeban); the Vizag general API plant (licensed, 4 APIs validated, 6 scaled up, 12 more by end-2026, first DMFs in FY27); and the **oncology formulation plant** of Caplin One Labs at Kakkalur (capitalised in April 2026 after ministry approval; passed its first regulatory inspection with one minor observation; 6 products in submission batches, 18 more in 12 months for LatAm, US and EU). Caplin One Labs lost ₹${n1(-FY26.lines.colPat)} cr in FY26 on ₹${n0(FY26.lines.colTurnover)} cr of revenue. **Coming:** the Thervoy oncology API plant (Q4FY27; captive), the Pondicherry oral-solid and dermatology plant (2x today's capacity, Q1FY28; for Mexico, Brazil, the US and EU), the COL-II injectable block at Gummidipoondi (five lines, Q1FY28), Amaris Clinical's expansion to 120 beds (end-FY27; bio-studies at half the cost of outside labs), and the Mexico plant (₹100-125 cr; construction from mid-2027). The target: make 60% of the APIs Caplin uses, and own every dosage form a regulated market wants.` },
    { exhibit: { type: 'table', title: 'Project tracker', head: ['Project', 'Where', 'For', 'Status (Aug-2026)'], wide: [0, 3], rows: C.projects, source: C.projectsSrc } },
    { pair: [
      { type: 'column', title: 'R&D spend crossed ₹100 cr in FY26', unit: 'R&D, expensed + capitalised (₹ crore)', x: ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'R&D', values: [60, 63, 66, 71, 77, 85, 89, 101], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Q1FY27 presentation (R&D chart); AR FY26 note 33 (₹79.9 cr expensed + ₹20.8 cr capitalised)' },
      { type: 'column', title: 'Capex: a step up to ₹250-320 cr a year', unit: 'Capex (₹ crore); FY27-29E = GAM', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'Capex', values: [91, 193, 146, 192, 248, ...AS.capex], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in cash flow; GAM' },
    ] },
    { callout: `**So what:** the plants give Caplin capacity it needs (the US plant is full) and capabilities it lacks (oncology, APIs, complex injectables). But each new site needs its own approvals (USFDA, INVIMA, COFEPRIS) and, for the US, product-by-product transfers; meanwhile depreciation rises (₹${n0(FY26.dep)} cr in FY26 → ₹${n0(F.dep[1])} cr in FY28E in our model) and the oncology and API units lose money. We assume no revenue from the oncology API plant, modest oncology formulation sales inside the Rest of World and US growth rates, and no Mexico plant revenue before FY29.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a narrow moat in Latin American distribution; none yet in the US',
  blocks: [
    { p: 'We score each possible source of advantage on the evidence, not on management\'s description.' },
    { exhibit: { type: 'table', title: 'Moat scorecard', head: ['Source', 'Strength', 'Evidence'], wide: [2], rows: D.moat.map(([s, w, e]) => [s, `**${w}**`, e]), source: 'GAM Research, from company filings, the AR FY26 registration map, calls and ICICI Direct notes' } },
    { callout: `**Verdict:** ${D.moatVerdict} The Latin American franchise earns high returns (45% LatAm PBT margin) because it is too small and too operationally fiddly for multinationals and too far for most Indian rivals; that also caps it. In the US, Caplin is a small single-site supplier among giants; its edge is niche product selection and service, which can disappear with one bad inspection.` },
  ],
};

module.exports = { plants, moat };
