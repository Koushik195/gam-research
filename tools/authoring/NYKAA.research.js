// Nykaa report, part B: research chapters. This file holds the cover, the story in charts and the
// business chapter, and merges part2 (history, industry, tailwind), part3 (Beauty, Fashion, moat), part4
// (earnings quality, cash, ownership, governance, forecasts), part5 (street, valuation) and part6 (risks, glossary).
// Written as of 30-Sep-2026 (Q1FY27 basis). Forecast and valuation figures are live tokens.
const C = require('./NYKAA.ctx');
const { n0, n1, QL, qv, A26, q1, mcap, fromHigh, IPO_ADJ, PB, PF } = C;
const P2 = require('./NYKAA.part2'), P3 = require('./NYKAA.part3'), P4 = require('./NYKAA.part4'), P5 = require('./NYKAA.part5'), P6 = require('./NYKAA.part6');
const SRC = 'Nykaa investor presentations, GAM Research';
const pctN = (a, b) => (a / b * 100).toFixed(1) + '%';

const cover = {
  headline: P5.headline,
  lead: `Nykaa is India's largest specialist beauty retailer (app, website and 324 stores), owns a fast-growing set of beauty brands, runs a premium fashion platform and supplies small shops through Superstore. At ₹{{P.last|num}} the stock is ${Math.abs(Math.round(fromHigh))}% below its 52-week high and ~70% above its bonus-adjusted IPO price of ₹${IPO_ADJ}. Q1FY27 was its best quarter in years: revenue +29%, EBITDA +68%, Beauty growing 29% at a 10.3% margin and Fashion at breakeven. But at ~₹${n0(mcap)} cr the market already pays ~${Math.round(C.impliedBX)}x Beauty's Sep-28E EBITDA. Our sum of the parts gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${P5.rating}.** Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}} ({{scen.bear.upside|chg}}).`,
  arguments: P5.coverArguments,
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Balance sheet', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): does Beauty hold its 29% NSV growth with the festive season shifting (flagged on the Q1 call), and does Superstore\'s GST-led price drag fade as management expects from Q3?',
    'Fashion: growth once the Nike partnership enters the base (mid-Q4FY27), and whether EBITDA stays positive.',
    'Quick commerce: Blinkit, Zepto, Instamart and Flipkart Minutes adding beauty; Nykaa Now (60-minute delivery) is Nykaa\'s answer.',
    'Store roll-out toward ~600 by FY30 (324 now) and the closing of the Aminu Wellness purchase (expected Q2FY27).',
  ],
};

// ---------------------------------------------------------------- 1. Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'GMV: up 34% in a year, Fashion now growing faster', unit: 'GMV by quarter (₹ crore)', x: QL, series: [{ name: 'Beauty', values: qv('bGmv'), fmt: 'num' }, { name: 'Fashion', values: qv('fGmv'), fmt: 'num' }], stacked: true, labels: 'ends', source: SRC },
      { type: 'column', title: 'EBITDA: Beauty earns it all; Fashion has reached breakeven', unit: 'EBITDA by quarter (₹ crore)', x: QL, series: [{ name: 'Beauty', values: qv('bEbitda'), fmt: 'num' }, { name: 'Fashion', values: qv('fEbitda'), fmt: 'num' }], labels: 'ends', source: SRC },
    ] },
    { pair: [
      { type: 'line', title: 'Margins rising in both verticals', unit: 'EBITDA, % of net sales value (NSV)', x: QL, series: [{ name: 'Beauty', values: qv('bEbitdaPctNsv'), fmt: 'pct' }, { name: 'Fashion', values: qv('fEbitdaPctNsv'), fmt: 'pct' }], labels: 'ends', source: SRC },
      { type: 'hbar', title: 'Fashion\'s turnaround: marketing cut from 31% to 23% of NSV', unit: 'Fashion marketing and S&D expense, % of NSV', x: ['FY25', 'FY26', 'Q1FY26', 'Q1FY27'], series: [{ name: '% of NSV', values: [31.4, 26.4, 28.2, 22.9], fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', source: 'Nykaa Q4FY26 and Q1FY27 presentations' },
    ] },
    { pair: [
      { type: 'line', title: `Share price: ${Math.abs(Math.round(fromHigh))}% below the 52-week high, above the IPO price`, unit: '₹, weekly (bonus-adjusted)', x: 'P.series[].0', series: [{ name: 'Price', ref: 'P.series[].1', fmt: 'num', thin: true }], labels: 'extremes', yearTicks: true, yearStep: 1, lines: [{ v: IPO_ADJ, text: `IPO ₹${IPO_ADJ}` }], source: 'Screener.in, NSE' },
      { type: 'column', title: 'Cash from operations: from zero in FY24 to ~4x capex in FY26', unit: '₹ crore', x: ['FY24', 'FY25', 'FY26'], series: [{ name: 'Cash from operations', values: [0, 467, 644], fmt: 'num' }, { name: 'Cash capex', values: [111, 127, 154], fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated cash flow)' },
    ] },
    { pair: [
      { type: 'column', title: `Our forecast: EBITDA ~${n1(C.F.ebitda[2] / A26.ebitda)}x FY26 by FY29E`, unit: 'Reported EBITDA (₹ crore)', x: 'fin.labels', from: 'FY22', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
      { type: 'hbar', title: `Sum of the parts: Beauty is ~${Math.round(PB.value / C.S.equity * 100)}% of the value`, unit: '₹ per share', x: C.S.parts.map(p => p.name.replace(/ \(.*\)/, '').replace(/ at end-FY27E.*/, '')), series: [{ name: '₹/share', values: C.S.parts.map(p => Math.round(p.perShare)), fmt: 'num' }], labels: 'all', source: 'GAM Research estimates' },
    ] },
  ],
};

// ---------------------------------------------------------------- 2. Business
const business = {
  id: 'business', nav: 'What Nykaa does', kicker: 'The business', title: 'A beauty retailer with its own brands, plus a fashion platform',
  blocks: [
    { p: 'Nykaa (the listed company is FSN E-Commerce Ventures) sells beauty and personal-care products through its app, website and 324 stores, and fashion through Nykaa Fashion. In Beauty it mostly **buys and sells the goods itself** (it owns the inventory), so revenue is close to the value of what it sells; in Fashion it is mainly a **marketplace** earning a commission, so revenue is a small share of the value of goods sold. It reports three measures: **GMV** (gross merchandise value, the price of goods ordered before discounts, returns and taxes), **NSV** (net sales value, after them) and revenue. Since FY26 it reports two verticals: Beauty (which now includes the Superstore eB2B arm and owned brands) and Fashion.' },
    { exhibit: { type: 'table', title: 'The verticals in FY26', head: ['Vertical', 'What it is', 'GMV (₹ cr)', 'NSV (₹ cr)', 'Revenue (₹ cr)', 'EBITDA (₹ cr)', 'EBITDA, % of NSV'], wide: [1], rows: [
      ['**Beauty**', 'Nykaa app and stores; House of Nykaa brands; Superstore (eB2B to small shops); Nykaa Man grooming', n0(A26.bGmv), n0(A26.bNsv), n0(A26.bRev), n0(A26.bEbitda), pctN(A26.bEbitda, A26.bNsv)],
      ['**Fashion**', 'Nykaa Fashion (curated premium marketplace), LBB, Nykaa Man lifestyle; runs Nike.in', n0(A26.fGmv), n0(A26.fNsv), n0(A26.fRev), n0(A26.fEbitda), pctN(A26.fEbitda, A26.fNsv)],
      ['**Others**', 'Gulf (GCC) and international', n0(A26.othGmv), '–', n0(A26.othRev), n0(A26.othEbitda), '–'],
      { hl: true, cells: ['**Total**', '', n0(A26.gmv), n0(A26.nsv), n0(A26.revenue), n0(A26.ebitda), pctN(A26.ebitda, A26.nsv)] },
    ], source: 'Nykaa Q4FY26 investor presentation (full-year vertical reporting)' } },
    { pair: [
      { type: 'hbar', title: 'GMV: Beauty is three-quarters of the business', unit: 'GMV, FY26 (₹ crore)', x: ['Beauty', 'Fashion'], series: [{ name: 'GMV', values: [A26.bGmv, A26.fGmv], fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'hbar', title: 'Revenue per ₹100 of GMV: Beauty owns stock, Fashion is a marketplace', unit: 'Revenue as % of GMV, FY26', x: ['Beauty', 'Fashion'], series: [{ name: '% of GMV', values: [A26.bRevPctGmv, A26.fRevPctGmv], fmt: 'pct' }], labels: 'all', source: SRC },
    ] },
    { exhibit: { type: 'tiles', title: 'Nykaa in numbers (Q1FY27)', tiles: [
      { k: 'Customers', v: `${q1.customersMn} mn`, d: 'cumulative base, +33% YoY' },
      { k: 'Beauty buyers', v: `${q1.bAutcMn} mn`, d: `annual unique; AOV ₹${n0(q1.bAov)}` },
      { k: 'Stores', v: n0(q1.stores), d: `${q1.cities} cities; +11 in Q1` },
      { k: 'Brands', v: n0(q1.brands), d: '160+ new in Beauty in Q1' },
      { k: 'Superstore retailers', v: `${q1.ssRetailersK}k`, d: `GMV ₹${q1.ssGmv} cr in Q1` },
    ], source: 'Nykaa Q1FY27 investor presentation' } },
    { callout: `**Why value Beauty on EBITDA and Fashion on GMV?** Beauty earns ${A26.bEbitdaPctNsv}% of NSV (FY26) and its profit is the thing to value: we use ${PB.mult}x Sep-28E EBITDA, the street's median. Fashion has only just reached breakeven, so an EBITDA multiple would be meaningless; we value its order flow (GMV) at ${PF.mult}x, the median of the two broker values that were disclosed.` },
  ],
};

const rating = P5.rating;
module.exports = {
  rating, cover,
  sections: p => [narrative, business, P2.history, P2.industry, P2.tailwind, P3.beauty, P3.fashion, P3.moat, p.financials, P4.earnings,
    { ...p.cash, blocks: [...p.cash.blocks, ...P4.cashBridge.blocks] }, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks(P5.rating), p.statements, P6.glossary],
  statementNotes: { ...P4.statementNotes },
};
