// Tata Chemicals report, part B-2: the story in charts, business, history, industry, tailwind test.
const X = require('./TATACHEM.ctx');
const { F, V, C, D, SA, SQ, QL, A26, A23, Q1, n0, n1, price, sh, SRC, P, VP, opsMult, impliedOpsMult, evChart, evMed, tpBrokers, mv } = X;

const ps = v => Math.round(v / sh);
const netDebtEx = P[VP.length - 1].value + P[VP.findIndex(p => /quoted shares at Mar-26/.test(p.name))].value;
const wf = [ps(P[0].value), ps(P[1].value), ps(P[2].value + P[3].value + P[4].value), ps(P[5].value), ps(P[6].value), ps(netDebtEx + P[9].value), ps(P[11].value), ps(P[10].value + P[12].value)];
wf.push(wf.reduce((s, v) => s + v, 0));

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Overseas soda ash profit has collapsed; India and Rallis now earn most of it', unit: 'Unit EBITDA (₹ crore)', x: 'R.segments.annual[].fy', series: [{ name: 'India', ref: 'R.segments.annual[].indiaEbitda', fmt: 'num' }, { name: 'US', ref: 'R.segments.annual[].usEbitda', fmt: 'num' }, { name: 'UK + Kenya', values: SA.map(a => a.ukEbitda + a.kenEbitda), fmt: 'num' }, { name: 'Rallis', ref: 'R.segments.annual[].ralEbitda', fmt: 'num' }], minLabel: 150, source: 'Tata Chemicals Q4 investor decks (unit-wise P&L)' },
      { type: 'line', title: 'US soda ash: from US$40 a tonne of EBITDA to US$1', unit: 'TCNA EBITDA per tonne (US$)', x: QL, series: [{ name: 'US EBITDA/t', values: SQ.map(q => q.usEbitdaPerT), fmt: 'num' }], labels: 'all', min: -10, max: 50, source: 'Motilal Oswal compilation of company data (28-Jul-2026)' },
    ] },
    { pair: [
      { type: 'column', title: 'Q1FY27: India earned ₹364 cr, the US ₹3 cr', unit: 'Quarterly EBITDA (₹ crore)', x: QL, series: [{ name: 'India', values: SQ.map(q => q.indiaEbitda), fmt: 'num' }, { name: 'US', values: SQ.map(q => q.usEbitda), fmt: 'num' }], labels: 'none', source: SRC },
      { type: 'waterfall', title: 'Our target: Tata-group shares and India are most of it', unit: '₹ per share (base case)', x: ['India', 'US', 'UK, Kenya, Singapore', 'Rallis stake', 'Tata-group shares', 'Net debt', 'Pensions', 'Minorities, dividend', 'SOTP value'], series: [{ name: '₹/share', values: wf }], fmt: 'num', totalFmt: 'num', source: 'GAM Research' },
    ] },
    { pair: [
      { type: 'column', title: 'EBITDA: we expect only a slow climb back', unit: 'EBITDA (₹ crore)', x: 'fin.labels', from: 'FY20', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates (FY27-29E)' },
      { type: 'column', title: 'EPS for shareholders: a loss in FY27E, single digits in FY28E', unit: 'EPS after minorities (₹)', x: 'fin.labels', from: 'FY22', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Company, GAM Research estimates' },
    ] },
    { pair: [
      { type: 'line', title: 'Forward EV/EBITDA: ~6x today vs an 8.6x median', unit: 'EV ÷ next full-year EBITDA (x)', x: evChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: evChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: evMed, text: `Median since Apr-2021 (ex-trough): ${evMed}x` }], source: 'Screener.in prices and balance sheets (EV = market value + borrowings − cash − all investments); actual EBITDA, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes to 30-Sep-2026)', unit: `₹ per share; price ₹${n0(price)}`, x: [...tpBrokers.map(b => b.broker.replace(' Institutional Equities', '').replace(' BNP Paribas', '')), 'GAM (base)'], series: [{ name: 'Target', values: [...tpBrokers.map(b => b.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'Price', color: '#b4232a' }], source: 'Broker notes and rating records (Mar-Sep 2026), GAM Research' },
    ] },
  ],
};

// ---------------------------------------------------------------- Business
const units = [
  ['**India** (Mithapur, Mambattu, Cuddalore)', 'Soda ash (1.09 mtpa, synthetic), salt (1.6 mtpa, much of it for Tata Consumer\'s Tata Salt), bicarb (290 KTPA), prebiotics, silica, bromine, cement', A26.indiaRev, A26.indiaEbitda],
  ['**US** (Green River, Wyoming)', 'Natural soda ash from trona (2.54 mtpa); sold in the US and exported to Latin America and Asia', A26.usRev, A26.usEbitda],
  ['**UK** (Winnington, Middlewich)', 'Salt (430 KTPA), pharma salt (70 KTPA) and bicarb (90 KTPA); soda ash stopped in Jan-2025', A26.ukRev, A26.ukEbitda],
  ['**Kenya** (Lake Magadi)', 'Natural soda ash (0.4 mtpa) exported mainly to Asia', A26.kenRev, A26.kenEbitda],
  ['**Singapore** (Jurong)', 'Premium pharma-grade bicarb (60 KTPA), bought in Mar-2026', A26.sgRev, A26.sgEbitda],
  ['**Rallis India** (55.04%, listed)', 'Crop protection chemicals and seeds in India', A26.ralRev, A26.ralEbitda],
];
const business = {
  id: 'business', nav: 'What Tata Chemicals does', kicker: 'The business', title: 'A soda ash company with a salt business, a listed agrochemical subsidiary and a share portfolio',
  blocks: [
    { p: 'Soda ash (sodium carbonate) is a white powder used to make glass (flat, container and solar glass), detergents, lithium carbonate and many chemicals. Tata Chemicals is one of the world\'s largest producers outside China, with 3.9 mtpa of capacity, more than two-thirds of it "natural" soda ash mined from trona in Wyoming and Kenya, which needs far less energy than the "synthetic" (Solvay process) ash made in India and China. Around soda ash it has built salt, sodium bicarbonate, prebiotics and silica businesses, owns 55% of Rallis India, a third of a Moroccan phosphoric acid plant (IMACID), and holds shares in Titan, Indian Hotels, Tata Steel and other Tata companies.' },
    { exhibit: { type: 'table', title: 'The six operating units in FY26', head: ['Unit', 'What it makes', 'Revenue (₹ cr)', 'EBITDA (₹ cr)', 'EBITDA margin'], wide: [1], rows: [
      ...units.map(u => [u[0], u[1], n0(u[2]), n0(u[3]), u[2] ? n1(u[3] / u[2] * 100) + '%' : '–']),
      { hl: true, cells: ['**Consolidated**', 'After inter-company eliminations', n0(A26.consRev), n0(A26.consEbitda), n1(A26.consEbitda / A26.consRev * 100) + '%'] },
    ], source: 'Q4FY26 investor deck (unit-wise P&L; Singapore from 1-Jan-2026); capacities from the Q1FY27 deck' } },
    { h: 'New segments from Q1FY27: Living, Industrial and Farm Essentials' },
    { p: `From July 2026 the company reports three segments instead of two. **Living Essentials** (salt, bicarb, prebiotics for food, feed and pharma; India, UK, Singapore) had FY26 revenue of ₹3,633 cr and EBIT of ₹749 cr. **Industrial Essentials** (soda ash, silica, bromine, caustic; India, US, Kenya) had revenue of ₹8,368 cr and lost money even before the ₹1,837 cr US impairment (EBIT −₹40 cr). **Farm Essentials** is Rallis (₹2,897 cr revenue, ₹210 cr EBIT) plus the IMACID share. The point management wants to make: the "non-cyclical" part is now ~${Math.round((3633 + 2897) / 14898 * 100)}% of segment revenue and earns all of the profit. In Q1FY27 Living earned ₹188 cr of EBIT, Farm ₹156 cr and Industrial lost ₹70 cr.` },
    { pair: [
      { type: 'stacked', title: 'Unit revenue: the US is the biggest, India the most profitable', unit: 'Revenue (₹ crore)', x: 'R.segments.annual[].fy', series: [{ name: 'India', ref: 'R.segments.annual[].indiaRev', fmt: 'num' }, { name: 'US', ref: 'R.segments.annual[].usRev', fmt: 'num' }, { name: 'UK + Kenya', values: SA.map(a => a.ukRev + a.kenRev), fmt: 'num' }, { name: 'Rallis', ref: 'R.segments.annual[].ralRev', fmt: 'num' }], minLabel: 500, source: 'Q4 investor decks' },
      { type: 'hbar', title: 'Where it sells: India is half of revenue', unit: 'FY26 revenue by customer location (₹ crore)', x: ['India', 'USA', 'UK', 'Asia (ex-India)', 'South America', 'North America (ex-US)', 'Africa', 'Europe', 'Others'], series: [{ name: 'Revenue', values: [7111, 3221, 1335, 1303, 621, 440, 295, 104, 154], fmt: 'num' }], labels: 'all', highlight: 'India', source: 'AR FY26 (consolidated geographical revenue)' },
    ] },
  ],
};

// ---------------------------------------------------------------- History
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From Mithapur (1939) to a global soda ash company, and back towards India',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: [
      ['1939', 'Incorporated; soda ash and salt works at Mithapur, Gujarat', 'Still the core Indian asset (1.09 mtpa soda ash, 1.6 mtpa salt)'],
      ['2005-06', 'Buys Brunner Mond (UK soda ash and bicarb; Magadi, Kenya)', 'Became a global producer; the UK and Kenya later became the weak links'],
      ['Mar-2008', 'Buys General Chemical\'s Green River (US) natural soda ash business', 'Largest unit by revenue; goodwill written down by ₹1,837 cr in FY26'],
      ['Nov-2009', 'Rallis India becomes a subsidiary (55.04% today)', 'Adds crop protection; 44.96% of its profit belongs to minorities'],
      ['Jan-2011', 'Buys British Salt (UK)', 'The UK business is now salt and bicarb only'],
      ['FY20', 'Consumer business (Tata Salt, pulses) demerged into Tata Consumer Products', 'One-off gain (₹6,480 cr of other income); Tata Chemicals still makes the salt'],
      ['FY22-23', 'Post-COVID soda ash upcycle', 'Record EBITDA ₹3,820 cr and profit ₹2,317 cr (FY23)'],
      ['Mar-2024', 'Stock hits a record on Tata Sons listing speculation', 'Weekly close ₹1,315; the price has more than halved since'],
      ['FY24-25', 'Mithapur soda ash (+230 kt) and bicarb (+140 kt) expansions; Lostock (UK) soda ash closed Jan-2025; UK exceptional charges', 'Volumes up, but into falling prices; FY25 profit ₹235 cr'],
      ['Mar-2026', 'Buys Novabay (Singapore pharma bicarb); Kenya electric-calciner soda ash starts', 'Small, higher-value additions'],
      ['Q4FY26', 'US goodwill impairment (US$208 mn) and ₹182 cr deferred-tax write-off', 'FY26 loss after minorities ₹1,896 cr; dividend held at ₹11'],
      ['Jul-2026', 'New segments (Living / Industrial / Farm); ₹1,525 cr project list for salt, silica and dense ash', 'Capital shifts away from soda ash'],
      ['Sep-2026', 'TCNA buys Searles Valley Minerals\' soda ash contracts (>0.5 mt over two years); RBI rejects Tata Sons\' de-registration', 'Stock +20% on 15-Sep, then back to ₹611 by 30-Sep'],
    ], source: 'AR FY26, investor decks, press (via research file)' } },
    { callout: '**Corporate actions:** no bonus, split, buyback or equity raise in the last decade. The share count has been 25.48 cr throughout. Dividends: ₹17.5 a share for FY23, ₹15 for FY24, ₹11 for FY25 and ₹11 for FY26 (paid despite the reported loss).' },
  ],
};

module.exports = { narrative, business, history, wf };
