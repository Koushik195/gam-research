// GNFC report, part B-2: the story in charts, business, history.
const X = require('./GNFC.ctx');
const { F, V, C, SA, SQ, QL, FYS, A26, Q1, n0, n1, price, sh, SRC, treasury26, icd, T, equityStakes, FM, fwdPe, peMult, epsSep28, tps } = X;

const fwdChart = fwdPe.filter(x => x[0] >= '2018-04-01');
const tdiImp = [33, 37, 35, 42, 56, 51, 73, 68];
const tdiImpX = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26*'];

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Chemicals earns all the profit; fertilisers lose money every year', unit: 'Segment result, EBIT (₹ crore)', x: FYS, series: [{ name: 'Chemicals', values: SA.map(a => Math.round(a.chemEbit)), fmt: 'num' }, { name: 'Fertilisers', values: SA.map(a => Math.round(a.fertEbit)), fmt: 'num' }, { name: 'Others (IT)', values: SA.map(a => Math.round(a.othEbit)), fmt: 'num' }], minLabel: 200, source: 'GNFC annual reports (segment notes)' },
      { type: 'line', title: 'TDI: ₹155k a tonne to ₹255k in four quarters', unit: '₹ \'000 per tonne', x: QL, series: [{ name: 'TDI', values: SQ.map(q => q.tdiPx), fmt: 'num' }, { name: 'Toluene (feedstock)', values: SQ.map(q => q.toluenePx), fmt: 'num' }], labels: 'all', min: 0, max: 300, source: 'GNFC investor decks (company price panel)' },
    ] },
    { pair: [
      { type: 'line', title: 'Chemicals margin: 8-18% before the war, 27-31% since', unit: 'Chemicals segment result (% of revenue)', x: QL, series: [{ name: 'Chemicals EBIT margin', values: SQ.map(q => q.chemMargin), fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: 'GNFC investor decks' },
      { type: 'column', title: 'EPS: a war-time FY27E, then back to ~₹50-60', unit: 'EPS (₹)', x: 'fin.labels', from: 'FY20', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Company, GAM Research estimates (FY27-29E)' },
    ] },
    { pair: [
      { type: 'hbar', title: `Treasury of ₹${n0(treasury26)} cr: ₹${n0(tps(treasury26))} a share`, unit: '₹ crore, March 2026', x: ['ICDs with Gujarat State Financial Services', 'Cash and bank deposits', 'Equity stakes and associate', 'Government securities'], series: [{ name: '₹ crore', values: [icd, Math.round(T.cashAndBank), Math.round(equityStakes), Math.round(T.gsecAmortised + T.gsecFvtpl)], fmt: 'num' }], labels: 'all', highlight: 'ICDs with Gujarat State Financial Services', source: 'AR FY26 consolidated notes 8, 9, 14, 15' },
      { type: 'line', title: 'Forward P/E: 8x median (ex-trough) since 2021', unit: 'Price ÷ next full-year EPS (x)', x: fwdChart.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: peMult, text: `Our multiple: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
    ] },
    { pair: [
      { type: 'column', title: 'India keeps importing more TDI: the market GNFC serves', unit: 'Indian TDI imports (thousand tonnes)', x: tdiImpX, series: [{ name: 'Imports', values: tdiImp, fmt: 'num' }], labels: 'all', source: 'GNFC Q4FY26 deck (public data); *FY26 to Feb-26' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} target vs the price and the treasury', unit: '₹ per share', x: ['Bull case', 'Share price (30-Sep-26)', 'GAM target', 'Treasury per share (Mar-26)', 'Bear case'], series: [{ name: '₹/share', values: [X.SC.bull.tp, price, V.tp, Math.round(tps(treasury26)), X.SC.bear.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM target', source: 'GAM Research' },
    ] },
  ],
};

// ---------------------------------------------------------------- Business
const products = [
  ['**TDI** (toluene di-isocyanate)', '67', '56,844', 'Flexible PU foam (mattresses, car seats), coatings', 'Only maker in South Asia; ~60% of India'],
  ['**Ammonium nitrate melt**', '158', '~170,000', 'Mining explosives', 'Large; capacity to double by mid-2027'],
  ['**Acetic acid / ethyl acetate**', '150 / 50', '154,840 / 66,491', 'PTA, VAM, solvents, inks, pharma', 'Only methanol-carbonylation acetic acid in India'],
  ['**Aniline / nitrobenzene**', '40', '33,663', 'MDI, rubber chemicals, dyes', 'Job work: not viable against Chinese aniline'],
  ['**Nitric acids (WNA, CNA)**', '348 / 166', '~430,000 / 147,000', 'TDI, aniline, AN (captive); explosives, pharma', 'Mostly captive; ~45% of CNA sold'],
  ['**Technical-grade urea**', '169', '>210,000', 'Diesel exhaust fluid, plywood, cattle feed', 'One of two Indian makers'],
  ['**Formic acid, methanol**', '20 / 269', '33,773 / 7,942', 'Leather, textiles / acetic acid feed', 'Methanol idle: gas too expensive'],
  ['**Neem-coated urea** (fertiliser)', '637', '~620,000 sold', 'Farm nitrogen; price fixed by the government', 'Regulated; loss-making'],
  ['**ANP 20:20:0** (fertiliser)', '142', '172,995', 'Farm nitrogen + phosphate (NBS subsidy)', 'Small; loss-making'],
];
const business = {
  id: 'business', nav: 'What GNFC does', kicker: 'The business', title: 'A state-owned chemical complex with a regulated fertiliser plant attached',
  blocks: [
    { p: 'GNFC runs two integrated complexes in Gujarat: Bharuch (since 1982) and Dahej (TDI-II, since 2014). It turns fuel oil, natural gas, coal, toluene, benzene and methanol into ammonia and syngas, and those into fertilisers and about a dozen bulk chemicals. Fertilisers (neem-coated urea and ANP) are 36% of revenue but sold at government-fixed prices with a subsidy; chemicals are 63% of revenue and sold at import-parity prices on one- to three-month contracts. A small IT division, (n)Code Solutions, makes up "Others". The Government of Gujarat (through Gujarat State Investments) and GSFC own 41.3%.' },
    { exhibit: { type: 'table', title: 'What GNFC makes', head: ['Product', 'Capacity (KTPA)', 'FY26 output (t)', 'Main uses', 'Position'], wide: [3, 4], rows: products, source: 'Q4FY26 deck p6-10; AR FY26 MD&A capacity table; May-2026 and Feb-2026 calls' } },
    { exhibit: { type: 'table', title: 'The three segments in FY26 (₹ crore)', head: ['Segment', 'Revenue', 'Segment result (EBIT)', 'Margin', 'Capital employed', 'Pre-tax return on capital'], rows: [
      ['**Chemicals**', n0(A26.chemRev), n0(A26.chemEbit), `${n1(A26.chemMargin)}%`, n0(A26.chemCapEmp), `${n1(A26.chemRoce)}%`],
      ['**Fertilisers**', n0(A26.fertRev), n0(A26.fertEbit), `${n1(A26.fertMargin)}%`, n0(A26.fertCapEmp), `${n1(A26.fertEbit / A26.fertCapEmp * 100)}%`],
      ['**Others ((n)Code IT)**', n0(A26.othRev), n0(A26.othEbit), `${n1(A26.othMargin)}%`, '34', '–'],
      { hl: true, cells: ['**Total**', n0(A26.consRev), n0(A26.segEbit), `${n1(A26.segEbit / A26.consRev * 100)}%`, '3,256 + ₹6,271 cr unallocated (treasury)', ''] },
    ], source: 'AR FY26 consolidated note 46' } },
    { pair: [
      { type: 'stacked', title: 'Revenue: chemicals doubled in the boom, then fell back', unit: 'Revenue (₹ crore)', x: FYS, series: [{ name: 'Chemicals', values: SA.map(a => Math.round(a.chemRev)), fmt: 'num' }, { name: 'Fertilisers', values: SA.map(a => Math.round(a.fertRev)), fmt: 'num' }, { name: 'Others', values: SA.map(a => Math.round(a.othRev)), fmt: 'num' }], minLabel: 600, source: 'GNFC annual reports' },
      { type: 'line', title: 'Segment margins: chemicals swing, fertilisers stay negative', unit: 'Segment result (% of revenue)', x: FYS, series: [{ name: 'Chemicals', values: SA.map(a => a.chemMargin), fmt: 'pct' }, { name: 'Fertilisers', values: SA.map(a => a.fertMargin), fmt: 'pct' }], labels: 'all', min: -15, max: 40, source: 'GNFC annual reports' },
    ] },
    { callout: `**So what:** the chemicals business is the company. In FY26 it earned ₹${n0(A26.chemEbit)} cr on ₹${n0(A26.chemCapEmp)} cr of capital employed (a ${Math.round(A26.chemRoce)}% pre-tax return, ~25-30% in the FY24-25 trough), while fertilisers lost ₹${n0(-A26.fertEbit)} cr on ₹${n0(A26.fertCapEmp)} cr. But over half of the market value is treasury, which is why a P/E on total earnings, which includes treasury income, is how the market prices it.` },
  ],
};

// ---------------------------------------------------------------- History
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Fifty years: from a fertiliser plant to a TDI maker with a cash pile',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: [
      ['1976-1982', 'Set up by the Government of Gujarat and GSFC; ammonia-urea complex at Bharuch starts (1982)', 'Fertilisers were the core business for a decade'],
      ['1985-1999', 'Methanol, formic acid, nitric acids, ANP (1991), acetic acid and aniline (1995), TDI-I (1998)', 'Turned GNFC into a chemicals company using its own ammonia'],
      ['2014', 'TDI-II (50 KTPA) at Dahej, the largest project in its history', 'Debt peaked at ₹3,844 cr; FY15 net loss ₹443 cr, the only loss in 50 years'],
      ['FY18-21', 'TDI and chemical profits used to repay all debt', 'Net cash from FY21'],
      ['FY22-23', 'Post-COVID chemical boom (Chinese supply disrupted)', 'Record EBITDA ₹2,384 cr and PAT ₹1,710 cr (FY22)'],
      ['Dec-2023', 'Buyback of 84.8 lakh shares (5.46%) at ₹770 (₹653 cr)', 'Share count 15.54 cr → 14.69 cr'],
      ['FY24-25', 'Chinese oversupply of TDI, aniline and acetic acid; TDI-II shut four months in FY25', 'Chemicals EBIT fell to ₹543 cr (FY24); EPS ₹34-41'],
      ['FY26', 'Bharuch turnaround (Q1); ₹1,865 cr moved into GSFS deposits; TDI anti-dumping duty (EU, Saudi) renewed to 2031', 'Q1-Q3 EPS ₹28 in nine months'],
      ['Mar-2026', 'US-Iran war: chemical prices spike; GNFC doubles TGU output for a national diesel-exhaust-fluid shortage', 'Q4FY26 PAT ₹396 cr; FY26 EPS ₹55'],
      ['Jun-Sep 2026', 'Urea energy norm raised to 6.37 Gcal/t; CCPP steam starts; new MD (9-Sep), the fourth since Feb-2025', 'Q1FY27 PAT ₹312 cr; ~₹61 cr energy arrears due in Q2'],
    ], source: 'AR FY21-FY26, investor decks, calls, press (via research files)' } },
    { callout: '**Corporate actions:** one buyback (Dec-2023, ₹770 a share, ₹653 cr); no bonus, split or equity raise in the last decade. Dividends: ₹10 (FY22), ₹30 (FY23), ~₹16.5 (FY24), ₹18 (FY25) and ₹21 (FY26, paid 18-Sep-2026). Management said in May-2026 that no new buyback is "in the pipeline".' },
  ],
};

module.exports = { narrative, business, history };
