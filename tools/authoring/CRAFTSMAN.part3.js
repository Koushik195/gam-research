// Craftsman Automation report, part 3: the three segments (powertrain, aluminium products, industrial & engineering) with
// their quarterly history and our build, and the competitive-advantage scorecard.
const X = require('./CRAFTSMAN.ctx');
const { C, D, SA, SQ, QL, n0, n1, BL, bld, yr, alShare } = X;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const q = (k) => SQ.map(r => r[k]);
const qm = (rk, ek) => SQ.map(r => Math.round(r[ek] / r[rk] * 1000) / 10);
const fy = SA.map(a => a.fy);
const segTable = (key, name) => ({ exhibit: { type: 'table', title: `${name}: history and our build (₹ crore)`, head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
  ['Revenue', n0(yr('FY24')[key + 'Rev']), n0(yr('FY25')[key + 'Rev']), n0(yr('FY26')[key + 'Rev']), ...bld.map(r => n0(r[key]))],
  ['growth', `${n1((yr('FY24')[key + 'Rev'] / yr('FY23')[key + 'Rev'] - 1) * 100)}%`, `${n1((yr('FY25')[key + 'Rev'] / yr('FY24')[key + 'Rev'] - 1) * 100)}%`, `${n1((yr('FY26')[key + 'Rev'] / yr('FY25')[key + 'Rev'] - 1) * 100)}%`, ...BL[key + 'Growth'].map(g => `${g}%`)],
  ['Segment EBIT', n0(yr('FY24')[key + 'Ebit']), n0(yr('FY25')[key + 'Ebit']), n0(yr('FY26')[key + 'Ebit']), ...bld.map(r => n0(r[{ pt: 'pe', al: 'ae', ie: 'ee' }[key]]))],
  { hl: true, cells: ['**EBIT margin**', ...['FY24', 'FY25', 'FY26'].map(f => `**${n1(yr(f)[key + 'Ebit'] / yr(f)[key + 'Rev'] * 100)}%**`), ...BL[key + 'Margin'].map(m => `**${m}%**`)] },
], source: 'Annual reports (segment notes); GAM estimates (assumptions.json build, checked against the model in CRAFTSMAN.ctx.js)' } });

const powertrain = {
  id: 'powertrain', nav: 'Powertrain', kicker: 'Segment 1', title: 'Powertrain: the high-margin core, back to growth, with large-engine castings from FY28',
  blocks: [
    { p: 'Powertrain is where Craftsman made its name: machining cylinder blocks and heads, camshafts and transmission parts for engine makers that outsource them. Machining an engine block takes dedicated lines, tight tolerances and years of approvals; Craftsman builds many of its own special-purpose machines, which keeps capital costs down, and says it was "instrumental in import substitution" for critical parts. Revenue grew from ₹811 cr (FY21) to ₹2,179 cr (FY26), but the margin has swung: 25-27% EBIT in FY21-23, 19% in FY24, 14% in FY25 (four to five quarters of heavy repair and maintenance, per the CMD) and back to 17% in FY26 and 18% in Q1FY27 (newer products at newer prices, manpower savings). Utilisation is ~70% against an optimum of 75-80%.' },
    { pair: [
      { type: 'column', title: 'Quarterly powertrain revenue: ₹416 cr (Q1FY25) to ₹623 cr (Q1FY27)', unit: '₹ crore', x: QL, series: [{ name: 'Revenue', values: q('ptRev'), fmt: 'num' }], labels: 'all', source: 'Quarterly presentations (Q1FY25 and Q3FY25 derived from half-year and nine-month figures)' },
      { type: 'line', title: 'Powertrain EBIT margin: 11% (Q3FY25) to 18-19% (Q4FY26-Q1FY27)', unit: 'Segment EBIT margin (%)', x: QL, series: [{ name: 'EBIT margin', values: qm('ptRev', 'ptEbit'), fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: 'Quarterly presentations' },
    ] },
    { p: rup(`**Large engines.** Since 2021 Craftsman has been preparing to cast and machine crankcases and heads for large stationary engines (gensets for data centres, gas engines). It bought a German foundry (Fronberg Guss) in 2024 and built a foundry at Kothavadi. ${C.guidance.largeEngines} The CMD says start-up costs are already in the numbers and return ratios on the new business should match the current powertrain "within a couple of years"; until then low utilisation will depress EBIT on that portion.`) },
    segTable('pt', 'Powertrain'),
    { callout: '**So what:** powertrain earns the group\'s best margins and is not capital-starved. Large-engine castings are a genuine new market (customers took ~4 years to approve Craftsman, so competitors cannot copy it quickly), but at US$100 mn a year by FY30 they add ~₹950 cr of revenue to a group of ₹10,000 cr: helpful, not transformational, and concentrated in six customers.' },
  ],
};

const aluminium = {
  id: 'aluminium', nav: 'Aluminium products', kicker: 'Segment 2', title: `Aluminium: ${Math.round(alShare[0])}% of FY27E revenue, ~10% EBIT, and the reason capex never stops`,
  blocks: [
    { p: 'Aluminium is now Craftsman\'s largest business: ₹4,789 cr of revenue in FY26 (+58%) and 94,904 tonnes. It has three parts: Craftsman\'s own die-casting and machining (engine and transmission housings, structural parts, alloy wheels from Bhiwadi and Shoolagiri: ~₹280 cr of wheel revenue in FY26, an exit rate of ~3 million wheels a year against 5.8 million of capacity), DR Axion India (critical castings for car makers; a new 50-acre plant at Sriperumbudur from Dec-2026) and Sunbeam Lightweighting (bought in Oct-2024; mostly casting with little machining; being restructured). The plan is to merge DR Axion into Sunbeam and run the aluminium businesses together, with a first goal of US$1 bn of aluminium revenue in 2-3 years.' },
    { pair: [
      { type: 'column', title: 'Quarterly aluminium revenue: ₹528 cr (Q1FY25) to ₹1,479 cr (Q1FY27)', unit: '₹ crore', x: QL, series: [{ name: 'Revenue', values: q('alRev'), fmt: 'num' }], labels: 'all', source: 'Quarterly presentations (Sunbeam from Q3FY25)' },
      { type: 'line', title: 'Aluminium EBIT margin: 8-14%, ~10% for the last four quarters', unit: 'Segment EBIT margin (%)', x: QL, series: [{ name: 'EBIT margin', values: qm('alRev', 'alEbit'), fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: 'Quarterly presentations' },
    ] },
    { p: rup(`**Sunbeam.** Sunbeam came with ₹1,237 cr of annual revenue and a ₹232 cr pre-tax loss (FY25 pro forma, AR). Craftsman is exiting legacy parts and small customers, resetting prices and cutting staff, and sold a ~₹30 cr-a-year low-value line. ${C.guidance.sunbeam} If Sunbeam reaches a mid-teens EBITDA margin on ~₹1,000-1,100 cr of revenue, it adds roughly ₹100 cr of EBITDA to FY26's level; we assume part of that in the aluminium EBIT margin (10.3% in FY26 to ${BL.alMargin[2]}% by FY29E).`) },
    segTable('al', 'Aluminium products'),
    { callout: '**So what:** aluminium gives Craftsman scale and growth but not returns: EBIT of ~10% on segment assets of ₹4,796 cr is a ~10% pre-tax return, below a 13% cost of equity. Management itself says margins will not rise 100-200bp while it keeps adding capacity at today\'s pace ("the future capex in this year will again spoil the margins"). The segment is where the bull and the bear cases are decided.' },
  ],
};

const industrial = {
  id: 'industrial', nav: 'Industrial & engineering', kicker: 'Segment 3', title: 'Industrial & engineering: storage and material handling turned up in Q1FY27',
  blocks: [
    { p: 'The smallest segment (₹1,102 cr in FY26, 14% of revenue) is two businesses: storage solutions (~64% of FY26 segment revenue: racking, shelving, vertical stores, automated storage and retrieval systems, from Coimbatore, Bangalore and Pune) and engineering (special-purpose machines, material handling, gears and gearboxes, toolroom, sheet metal, contract manufacturing). The engineering arm also builds machines for Craftsman\'s own plants. EBIT margins collapsed from 19% (FY21) to 2% (FY25) and 4% (FY26) and jumped to 9% in Q1FY27 on operating leverage as material-handling and storage orders rose; the CMD says it is "not a one spike".' },
    { pair: [
      { type: 'column', title: 'Quarterly industrial revenue: ₹200-237 cr in FY25, ₹330 cr in Q1FY27', unit: '₹ crore', x: QL, series: [{ name: 'Revenue', values: q('ieRev'), fmt: 'num' }], labels: 'all', source: 'Quarterly presentations' },
      { type: 'line', title: 'Industrial EBIT margin: zero in Q2-Q3FY25, 9% in Q1FY27', unit: 'Segment EBIT margin (%)', x: QL, series: [{ name: 'EBIT margin', values: qm('ieRev', 'ieEbit'), fmt: 'pct' }], labels: 'all', min: -2, max: 12, source: 'Quarterly presentations' },
    ] },
    segTable('ie', 'Industrial & engineering'),
    { callout: '**So what:** a low-capital business that is now a small positive. We assume 8-8.5% EBIT, below Q1\'s 9.1% and well below the 9-19% of FY21-23: the FY25 collapse shows how quickly it swings with project timing and the capex cycle.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a narrow moat in machining know-how, little pricing power',
  blocks: [
    { verdicts: [
      ...D.moat.map(([dim, v, ev]) => [dim, v, ev, { 'Process know-how in machining cylinder blocks and heads': 'Hard to replicate quickly; protects powertrain', 'Customer stickiness': 'Revenue is sticky per programme, prices are not', 'Scale in aluminium': 'Big in India, small globally; scale has not yet brought margin', 'Cost of entry': 'Protects old plants, taxes new ones', 'Pricing power': 'Margins follow utilisation and metal prices' }[dim] || '']),
      ['Diversification', 'Improving', 'Three segments, CV/tractor/PV/2W/industrial end markets; one customer 24% of standalone revenue (35% in FY25)', 'Less cyclical than a pure CV supplier'],
      ['Disclosure', 'Moderate', 'Segment EBIT and assets are disclosed; no segment EBITDA, entity results or order book', 'Hard to check the Sunbeam turnaround from outside'],
    ], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (annual reports, presentations and calls to Sep-2026)' },
    { callout: '**Honest verdict:** Craftsman has a narrow moat in what it does best: machining complex iron parts for engine makers, with its own machines and decades of approvals. That moat does not extend to aluminium casting, where it competes with many Indian and global die-casters, customers control prices and returns are below the cost of capital. A good operator in a commoditising business is worth a fair multiple, not a premium one.' },
  ],
};

module.exports = { powertrain, aluminium, industrial, moat };
