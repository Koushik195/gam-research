// Tata Chemicals report, part B-3: industry, tailwind test, India and US unit chapters.
const X = require('./TATACHEM.ctx');
const { SQ, QL, SA, A26, A23, Q1, n0, n1, SRC, F, sep28 } = X;
const m = (e, r) => SA.map(a => Math.round(a[e] / a[r] * 1000) / 10);
const qm = (e, r) => SQ.map(q => Math.round(q[e] / q[r] * 1000) / 10);

// ---------------------------------------------------------------- Industry
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Soda ash: China has built too much, and sets the price everywhere',
  blocks: [
    { p: 'Soda ash is a commodity: one grade sells at one world price, adjusted for freight and duty. China is the largest producer and, after years of adding capacity (including new natural soda ash in Inner Mongolia), it has far more than it needs. Its inventories reached a record 1.73 million tonnes in mid-2026, its plants still run at high utilisation, and its exporters sell at US$160-180 a tonne FOB (US$170-190 delivered in South-East Asia). Management believes most Chinese producers are losing cash at these prices and calls ~US$170 the floor, but no large Chinese closures have been announced. Until they are, every exporter, including Tata Chemicals\' US and Kenyan plants, earns close to nothing on export tonnes.' },
    { exhibit: { type: 'table', title: 'Supply and demand: what is moving', head: ['Theme', 'Direction', 'Evidence (to 30-Sep-2026)'], wide: [2], rows: [
      ['Chinese oversupply', 'Headwind', 'Record inventory 1.73 mt; export prices US$160-180/t FOB; "global pricing is expected to remain subdued" (Jul-2026 call).'],
      ['Capacity exits', 'Tailwind (small)', 'A ~800 kt Chinese plant stopped on a lapsed permit; a 1.36 mt US producer mothballed; Solvay cut ~180 kt in Spain (May-2026 call). Searles Valley (US) went through Chapter 11 and TCNA bought its customer contracts.'],
      ['Energy and freight costs', 'Mixed', 'The Middle East conflict lifted coal, limestone, gas, HFO and freight costs for synthetic producers (India, Europe, Turkiye) and Kenya; natural US ash is less exposed.'],
      ['Solar glass and lithium', 'Tailwind (slow)', 'Solar glass could add 7,500-10,000 t a month of dense-ash demand in India; lithium carbonate needs ~2 t of soda ash per tonne; LATAM exports rising.'],
      ['Indian trade protection', 'Tailwind (pending)', 'Imports rose 89% to ~0.98 mt in FY24; a minimum import price (₹20,108/t) ran to Dec-2025; DGTR opened a safeguard investigation on 16-Mar-2026 (no decision by 30-Sep-2026).'],
      ['Demand outside India', 'Flat', 'China and US flat (US container glass weak); SE Asia slightly down.'],
    ], source: 'Q4FY26 and Q1FY27 calls and decks; DGTR, DGFT notifications; press (via research file)' } },
    { pair: [
      { type: 'line', title: 'US export realisation: US$270/t to US$240/t', unit: 'TCNA realisation (US$ per tonne)', x: QL, series: [{ name: 'US realisation', values: SQ.map(q => q.usRealUsd), fmt: 'num' }], labels: 'all', min: 200, max: 290, source: 'Motilal Oswal compilation of company data' },
      { type: 'column', title: 'Group soda ash volumes keep rising: price is the problem', unit: 'Soda ash sales volume (kt), US + India', x: QL, series: [{ name: 'US', values: SQ.map(q => q.usVolKt), fmt: 'num' }, { name: 'India', values: SQ.map(q => q.indiaSodaAshKt), fmt: 'num' }], labels: 'none', source: 'Company decks, Motilal Oswal compilation' },
    ] },
    { callout: '**So what:** this is a classic commodity downcycle. Volumes are fine; price is set by the marginal Chinese exporter. India is the exception because it is short of soda ash and priced at import parity, so a weaker rupee and freight costs help Mithapur. Recovery needs Chinese capacity to close, which has not happened yet.' },
  ],
};

// ---------------------------------------------------------------- Tailwind test
const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: India\'s demand helps; the global story does not',
  blocks: [
    { verdicts: [
      ['Indian soda ash demand growing faster than supply', 'Yes', 'India EBITDA up from ₹818 cr (FY25) to ₹954 cr (FY26); Q1FY27 margin 28% on import-parity pricing.', 'The one unit that is earning well.'],
      ['Solar glass, lithium and sodium-ion batteries', 'Not yet', 'Dense ash plant only in Q3FY28; sodium-ion battery still in pilot (6-9 months), full plant 2+ years later.', 'Option value, no earnings before FY29.'],
      ['Global soda ash recovery', 'No', 'US EBITDA ₹3 cr in Q1FY27; Kenya ₹1 cr; management sees no uplift "unless some capacity rationalization happens in China".', 'The biggest swing factor, and it is moving the wrong way.'],
      ['Food, feed and pharma ingredients (salt, bicarb, prebiotics)', 'Yes', 'Living Essentials revenue +25% in Q1FY27 to ₹1,064 cr; EBIT ₹188 cr; >90% share of Indian scFOS.', 'Stable, but bicarb faces a new Indian competitor.'],
      ['Indian agriculture (via Rallis)', 'Partly', 'Rallis EBITDA +26% in FY26 to ₹364 cr, +23% in Q1FY27; but Tata Chemicals keeps only 55%.', 'Helps the SOTP more than EPS.'],
      ['Tata Sons listing', 'Possibly', 'RBI rejected Tata Sons\' de-registration (11-Sep-2026); Tata Trusts proposed a restructuring that could avoid listing (29-Sep-2026).', 'A real but binary option worth ₹390+ a share at press valuations; not in our base case.'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

// ---------------------------------------------------------------- India
const projects = [
  ['IVSD salt, Mithapur', '82.5', '100', 'Operational by end-FY27, supplies from Q1FY28'],
  ['Dense soda ash, Mithapur', '350', '135', 'Q3FY28; converts the cement plant (cement exit)'],
  ['Precipitated silica, Cuddalore', '50', '775', 'Q4FY28; "undergoing a detailed review"'],
  ['IVSD salt, Valinokkam (TN)', '210', '515', 'Q2FY29; saves freight to southern markets'],
];
const india = {
  id: 'india', nav: 'India: the earner', kicker: 'Unit', title: 'India: the only big unit earning its keep, helped by import parity',
  blocks: [
    { p: `The Indian (standalone) business makes soda ash, salt, bicarb, prebiotics (scFOS), silica, bromine and cement at Mithapur, Mambattu and Cuddalore. FY26 revenue was ₹${n0(A26.indiaRev)} cr (+9%) and EBITDA ₹${n0(A26.indiaEbitda)} cr (${n1(A26.indiaEbitda / A26.indiaRev * 100)}%), helped by the FY25 expansions: Mithapur produced 1 mtpa of soda ash for the first time and bicarb capacity doubled to 290 KTPA. Q1FY27 was exceptional: revenue +10% to ₹1,281 cr, EBITDA +35% to ₹364 cr (28.4%), from 20% higher salt volumes, a ~₹2,000/t soda ash price increase (domestic prices track import parity, so a weaker rupee lifts them) and cheap coal in inventory.` },
    { pair: [
      { type: 'column', title: 'India EBITDA by quarter: Q1FY27 a record', unit: 'India EBITDA (₹ crore)', x: QL, series: [{ name: 'India', values: SQ.map(q => q.indiaEbitda), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'line', title: 'India margin: 28% in Q1FY27; management says ~18% is sustainable', unit: 'India EBITDA margin (%)', x: QL, series: [{ name: 'India', values: qm('indiaEbitda', 'indiaRev'), fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: SRC },
    ] },
    { bullets: [
      '**Why not extrapolate Q1:** management said coal inventory gains will reverse as costlier coal (higher freight from Indonesia) comes through, limestone imports from the Middle East get expensive if the conflict runs past October, bicarb lost some tendered contracts on price, and a new Indian bicarb competitor added capacity. Asked for a sustainable margin, the CEO said "around 18%".',
      '**Salt for Tata Consumer:** much of the salt goes to Tata Consumer Products (Tata Salt) under the arrangement set at the 2020 demerger; management says terms are unchanged. Steady volumes, limited pricing power.',
      '**Soda ash pricing:** contracts are reset quarterly against import parity. The pending safeguard duty would support prices; a stronger rupee or falling freight would cut them.',
    ] },
    { exhibit: { type: 'table', title: 'India projects (₹1,525 cr, all "non-cyclical" except dense ash)', head: ['Project', 'KTPA', 'Capex (₹ cr)', 'Timing / status (as stated by Sep-2026)'], wide: [3], rows: projects, source: 'Q4FY26 deck (key projects), Q1FY27 call' } },
    { callout: `**Our view:** India is a good, integrated business, but it is not a growth story. We model revenue +7% / +6% / +8% (FY27-29E) and an EBITDA margin of 21% / 19.5% / 20%, i.e. Q1's windfall fades to near management's 18-20%. Sep-28E EBITDA ₹${n0(sep28('india'))} cr is barely above FY26's ₹${n0(A26.indiaEbitda)} cr plus the new salt plants; the street (Motilal Oswal ₹1,344 cr for FY28E) assumes margins near 24%, well above what management itself calls sustainable.` },
  ],
};

// ---------------------------------------------------------------- US
const us = {
  id: 'us', nav: 'US: the problem', kicker: 'Unit', title: 'US: the world\'s cheapest soda ash, earning US$1 a tonne',
  blocks: [
    { p: `Green River, Wyoming, sits on the world's largest trona deposits; mining and refining trona uses far less energy than the synthetic process, so TCNA is one of the lowest-cost producers anywhere. That did not protect it. A large part of its volume is exported (the company has not yet given the split), and export prices are set by Chinese ash. EBITDA fell from ₹${n0(A23.usEbitda)} cr in FY23 to ₹${n0(A26.usEbitda)} cr in FY26 and ₹3 cr in Q1FY27 (US$1 a tonne, from US$41 a year earlier), even though volumes rose 13% to 614 kt. In Q4FY26 the company wrote off ₹1,837 cr (US$208 mn) of US goodwill and ₹182 cr of deferred tax assets.` },
    { pair: [
      { type: 'column', title: 'US EBITDA by quarter: ₹198 cr to ₹3 cr', unit: 'TCNA EBITDA (₹ crore)', x: QL, series: [{ name: 'US', values: SQ.map(q => q.usEbitda), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'line', title: 'US EBITDA margin: 24% in FY23, 6% in FY26', unit: 'TCNA EBITDA margin (%, annual)', x: 'R.segments.annual[].fy', series: [{ name: 'US', values: m('usEbitda', 'usRev'), fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: 'Q4 investor decks' },
    ] },
    { bullets: [
      '**Exports:** sales to South-East Asia are "just at breakeven level or unremunerative, and that is likely to remain so at least through the year"; US producers have "more or less vacated" that market to China. TCNA is redirecting tonnes to Latin America (lithium) and North-East Asia.',
      '**Domestic US:** stable demand and prices ("a USD 3-4 shift here and there"); logistics costs rising and only partly passed on.',
      '**Searles Valley contracts:** on 11-Sep-2026 TCNA completed the purchase of Searles Valley Minerals\' soda ash customer contracts (more than 0.5 mt over two years) from its Chapter 11 process. Price and margin were not disclosed; we add ~6% to FY28E US revenue for it.',
      '**Minority:** US EBITDA includes the ALCAD partnership, 50% owned by a partner who receives ~₹99 cr a year of profit (FY26). We deduct that share in the valuation.',
    ] },
    { callout: `**Our view:** we assume the US stays close to break-even in FY27 (2.5% EBITDA margin, ~₹${n0(F.seg.us.adjEbitda[0])} cr) and recovers only partly to 7% / 9% in FY28-29E (roughly US$15-20/t, versus US$40/t in FY25). The street is far more optimistic (Motilal Oswal ₹760 cr for FY28E, JM ₹769 cr for Sep-27E). We would need to see Chinese capacity actually close before modelling a return to FY24-25 levels.` },
  ],
};

module.exports = { industry, tailwind, india, us };
