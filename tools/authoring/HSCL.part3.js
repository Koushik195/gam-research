// Himadri report, part B (2/4): story in charts, business, history.
const { ctx } = require('./HSCL.part2');
const { C, F, V, n0, n1, SA, SQ, QL, A26, price, ebt, qEbt, qRpt, fwdMed, fwdPe, fwdSince24 } = ctx;

const SQo = SQ.filter(q => q.othersRev > 0);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'EBITDA per tonne quadrupled in four years', unit: 'Core EBITDA per tonne sold (₹)', x: SA.map(a => a.fy), series: [{ name: 'EBITDA per tonne', values: ebt, fmt: 'num' }], labels: 'all', source: 'Company EBITDA (core segments) and standalone sales volume; GAM Research' },
      { type: 'column', title: 'Volume grew far less: +2% in FY26', unit: 'Sales volume (000 tonnes, standalone)', x: SA.map(a => a.fy), series: [{ name: 'Volume', values: SA.map(a => Math.round(a.volume / 1000)), fmt: 'num' }], labels: 'all', source: 'Investor presentations' },
    ] },
    { pair: [
      { type: 'line', title: 'Q1FY27: a jump to ~₹22,900 per tonne', unit: 'Standalone EBITDA per tonne (₹)', x: QL, series: [{ name: 'EBITDA per tonne', values: qEbt, fmt: 'num' }], labels: 'all', min: 10000, max: 25000, source: 'Investor presentations (standalone); GAM Research' },
      { type: 'line', title: '...as prices rose 23% while volume fell', unit: 'Standalone revenue per tonne (₹)', x: QL, series: [{ name: 'Revenue per tonne', values: qRpt, fmt: 'num' }], labels: 'all', min: 60000, max: 100000, source: 'Investor presentations (standalone; Q2-Q3FY26 revenue derived); GAM Research' },
    ] },
    { pair: [
      { type: 'column', title: 'Birla Tyres is ramping up inside "Others"', unit: 'Others segment revenue (₹ crore)', x: SQo.map(q => q.q), series: [{ name: 'Others (tyres and mining)', values: SQo.map(q => Math.round(q.othersRev)), fmt: 'num' }], labels: 'all', source: 'Quarterly segment results (Q2FY26 derived)' },
      { type: 'column', title: 'Capex: ₹53 cr in FY24, ~₹1,000 cr a year in FY27-28', unit: 'Capex (₹ crore)', x: ['FY24', 'FY25', 'FY26', 'FY27E', 'FY28E'], series: [{ name: 'Capex', values: [53, 171, 450, F.capex[0], F.capex[1]], fmt: 'num' }], labels: 'all', source: 'Screener.in; management guidance (Q1FY27 call); GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ~10x in 2021-22, ~${Math.round(fwdSince24)}x since 2024`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: 25, text: `Median since Apr-2021 (${n1(fwdMed)}x) = our 25x`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n0(price)}`, x: ['ICICI Securities (Jul-26)', 'Mehta Equities (Feb-26)', 'ICICI Securities (Apr-26)', 'ICICI Securities (Jan-26)', 'GAM (base)'], series: [{ name: 'Target', values: [720, 571, 550, 470, V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press to 30-Sep-2026; only the Jul-26 ICICI call was standing on 30-Sep-2026' },
    ] },
  ],
};

const business = {
  id: 'business', nav: 'What Himadri does', kicker: 'The business', title: 'One coal-tar chain, three businesses',
  blocks: [
    { p: 'Coal tar is a sticky by-product of the coke ovens that feed steel blast furnaces. Himadri buys it from steel makers and importers and distils it (600,000 tpa; the largest single-location complex in the world, per the company). About half becomes **coal tar pitch**, the binder in the carbon anodes of aluminium smelters and in graphite electrodes. The lighter fractions become **naphthalene** (for phthalic anhydride, SNF concrete admixtures and mothballs) and **speciality oils**, which also feed its own **carbon black** plants (tyres and rubber, plus speciality grades for plastics, inks, cables and batteries). A captive power plant runs on carbon-black tail gas. Exports were 29% of FY26 revenue (61 countries). On top of this core sit two new businesses: **Birla Tyres** (restarted in May-2025) and **new energy materials** (LFP cathode and anode for lithium-ion batteries).' },
    { exhibit: { type: 'table', title: 'The three businesses in FY26', head: ['Business', 'What it makes', 'Revenue (₹ cr)', 'Share', 'EBITDA (₹ cr)', 'Note'], wide: [1, 5], rows: [
      ['**Carbon materials & chemicals**', 'Coal tar pitch, carbon black (130 kt speciality of 250 kt), naphthalene, speciality oils, SNF/PCE; captive power', n0(A26.coreRev), `${(A26.coreRev / A26.consRev * 100).toFixed(0)}%`, n0(A26.coreEbitda), '65%+ of India\'s pitch, ~67% of naphthalene; segment EBIT margin 19%'],
      ['**Others: Birla Tyres and mining**', 'Agri, OTR and truck-bus bias tyres; mining', n0(A26.othersRev), `${(A26.othersRev / A26.consRev * 100).toFixed(0)}%`, n0(A26.othersEbitda), 'Tyres ₹187 cr; profit mostly from mining'],
      ['**New energy materials**', 'Anode (200 tpa from Apr-2026); LFP cathode (2,000 tpa in Q3FY27, 40,000 tpa Phase 1)', '0', '0%', '–', 'Plus stakes in Sicona, IBC (19.44%), Invati (40%)'],
      { hl: true, cells: ['**Consolidated**', '', n0(A26.consRev), '100%', n0(A26.ebitdaCo), 'Company EBITDA before forex (Screener ₹962 cr after the ₹43.6 cr forex loss)'] },
    ], source: 'FY26 annual report (segment note), Q4FY26 and Q1FY27 calls; core = carbon materials and chemicals plus power\'s external sales' } },
    { pair: [
      { type: 'hbar', title: 'India buys 71% of output', unit: 'FY26 revenue by customer location (₹ crore)', x: ['India', 'Outside India'], series: [{ name: 'Revenue', values: [3303, 1358], fmt: 'num' }], labels: 'all', highlight: 'India', source: 'FY26 annual report (segment note)' },
      { type: 'hbar', title: 'Management\'s revenue potential for the new projects', unit: 'Revenue at full use, today\'s prices (₹ crore)', x: ['LFP Phase 1 (40,000 t)', 'Super speciality black (6,000 t)', 'Anthraquinone + carbazole', 'Anode (200 t)', 'CNT (200 t)'], series: [{ name: 'Revenue', values: [3000, 500, 275, 125, 70], fmt: 'num' }], labels: 'all', source: 'Q1FY27 call (anthraquinone: midpoint of ₹250-300 cr; anode ₹120-130 cr; CNT "less than ₹100 cr", ~₹50-70 cr per the questioner)' },
    ] },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a Howrah tar distiller (1990) to a would-be advanced-materials company',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event'], wide: [1], rows: C.history.map(h => [h.when, h.event.replace(/Rs /g, '₹')]), source: 'Annual reports, investor presentations, exchange filings, Venture Intelligence (Bain)' } },
    { callout: '**Corporate actions:** the share count rose from ~42 cr (FY18) to 50.46 cr (Sep-2026), mostly through preferential issues: the 2024 warrants at ₹316 (1.08 cr shares, ₹342 cr, of which 1 cr went to the promoters, lifting them to 52.5%) plus ESOP allotments. No bonus, split or buyback recently; dividends are token (₹0.80 a share for FY26). The DBRL tyre demerger adds only ~1.76 lakh shares (0.03%). Bain Capital, the only large outside investor (₹413 cr in 2009-10), sold out in FY2021-22.' },
  ],
};

module.exports = { narrative, business, history };
