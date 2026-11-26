// Concord Biotech report, part 3b: plants, capacity, utilisation, the cost of the ramp-up, and the regulatory record.
const X = require('./CONCORDBIO.ctx2');
const { C, n0, n1, Q1, FY26, F, AS } = X;
const CAP = C.capacity;

const capacity = {
  id: 'capacity', nav: 'Plants & regulators', kicker: 'Capacity', title: 'Four plants, all built: ~₹3,000 cr of revenue potential vs ₹1,055 cr in FY26, so the question is utilisation, not capex',
  blocks: [
    { exhibit: { type: 'table', title: 'Plants, capacity and utilisation', head: ['Plant', 'Since', 'Capacity', 'Utilisation', 'Note'], wide: [4], rows: [
      ['Unit I, Dholka (API)', CAP.unit1.since, `${CAP.unit1.fermentationM3} m³ fermentation`, `~${Q1.utilisation.unit1}% (Q1FY27); 77% (Q4FY26)`, 'Immunosuppressants and oncology; "already at optimal capacities"'],
      ['Unit III, Limbasi (API)', CAP.unit3.since, `${CAP.unit3.fermentationM3} m³ fermentation`, `~${Q1.utilisation.unit3}% (Q1FY27); 53% (Q4FY26)`, 'Anti-infectives and antifungals; part of the use is in-house key starting materials; 160 acres, 20-25% used'],
      ['Unit II, Valthera (formulations)', CAP.unit2.since, `${CAP.unit2.units} units (oral solids, soft gel)`, `~${Q1.utilisation.unit2}% (Q1FY27); 30% (Q4FY26)`, 'USFDA and EU-GMP (HPRA) approved'],
      ['Unit IV, Valthera (injectables)', CAP.unit4.since, CAP.unit4.capacity, `~${Q1.utilisation.injectables}% (Q1FY27)`, `WHO-GMP; ₹${CAP.unit4.peakRevenue} cr peak revenue`],
    ], source: 'Q1FY27 deck pp.11, 16; Q4FY26 and Q1FY27 calls; ICRA' } },
    { p: `**The cost of the ramp-up.** The capex is done: gross block rose from ₹${n0(X.A.grossBlock[X.ai('FY24')])} cr (Mar-24) to ₹${n0(X.A.grossBlock[X.b])} cr (Mar-26), mostly the injectable plant, and FY26 capex fell to ₹${FY26.capexCo} cr (CFO; ₹95 cr on Screener's cash-flow basis). What is not done is filling it. The injectable plant cost ~₹38-39 cr in FY26 and Stellon ~₹10 cr, together ~4.6% of revenue, before meaningful sales; depreciation rose from ₹54 cr (FY25) to ₹74.5 cr (FY26). Management guides maintenance capex of ₹20-30 cr a year plus a small topical facility in FY27, a ₹50-100 cr debottlenecking in 2-3 years, and a Unit III expansion only when utilisation reaches 80-85%. ICRA (Sep-2026) is less sanguine and puts FY27 capex at ₹120-130 cr; we use ₹${AS.capex[0]} cr, ₹${AS.capex[1]} cr and ₹${AS.capex[2]} cr for FY27-29E.` },
    { pair: [
      { type: 'column', title: 'Capex peaked at ₹204 cr in FY21 (Limbasi); ~₹95-111 cr in FY25-26', unit: 'Capex (₹ crore), Screener cash-flow basis', x: ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'Capex', values: [...['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(X.A.capex[X.ai(y)])), ...AS.capex], fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Revenue potential of today\'s plants vs revenue', unit: '₹ crore', x: ['FY26 revenue', 'FY29E (GAM)', 'Potential (5-6 years)'], series: [{ name: 'Revenue', values: [Math.round(X.A.sales[X.b]), Math.round(F.sales[2]), CAP.peakRevenueAll], fmt: 'num' }], labels: 'all', highlight: 'FY29E (GAM)', source: 'Q4FY26 and Q1FY27 calls; GAM Research' },
    ] },
    { h: 'Regulatory record' },
    { exhibit: { type: 'table', title: 'Inspections and approvals', head: ['When', 'Event'], wide: [1], rows: C.regulatory.map(r => [r.date, r.event]), source: 'Company decks; exchange filings as reported by FilingReader (May-2025) and Angel One (18-Sep-2026); ICRA' } },
    { callout: '**So what:** Concord does not need money to grow for several years; it needs orders. Every 10 points of utilisation at the injectable plant is ~₹60 cr of revenue against a cost base already paid for, which is why the margin could recover fast if the orders come, and why it has stayed down while they have not. The regulatory record (no warning letter found; the 2025 and 2026 USFDA inspections ended with procedural observations only) is a real asset.' },
  ],
};

module.exports = { capacity };
