// Asahi India Glass report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, automotive glass, float glass, consumer glass & Maruti, moat, Q1FY27, earnings quality, ownership,
// governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in ASAHIINDIA.ctx.js;
// forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./ASAHIINDIA.ctx');
const { F, V, SQ, QL, C, n0, n1, price, mv, HEV, sectorEv, EVM, ebitdaSep, ndSep, rating, isec, q1Est, evNowSep, A26 } = X;
const P2 = require('./ASAHIINDIA.part2'), P3 = require('./ASAHIINDIA.part3'), P4 = require('./ASAHIINDIA.part4'), P5 = require('./ASAHIINDIA.part5'), P6 = require('./ASAHIINDIA.part6');

const cover = {
  headline: 'India\'s car-glass leader, priced for a float-glass boom that rests on trade protection',
  lead: `Asahi India Glass (AIS) makes ~80% of the glass in Indian passenger cars and owns three float-glass lines. After a ₹2,835 cr build-out (FY24-26) and a ₹1,000 cr QIP, earnings turned: Q1FY27 EBITDA was ₹325 cr (23.0% margin) and profit ₹149 cr, 2.7 times a year earlier, with float glass doing most of the lifting. We forecast EBITDA of ₹${n0(F.ebitda[0])} / ₹${n0(F.ebitda[1])} / ₹${n0(F.ebitda[2])} cr for FY27-29E. The only broker we could find, ICICI Securities, values AIS on **EV/EBITDA (22x FY28E, target ₹1,050)**. The house rule (AIS's own forward EV/EBITDA median since 2021, ${n1(HEV.med)}x, cut by the ${Math.abs(sectorEv).toFixed(1)}% auto-component de-rating) gives **${EVM.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep)} cr, less ₹${n0(ndSep)} cr of net debt = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Automotive glass: a near-monopoly, but Maruti sets the price', p: `AIS supplies ~80% of passenger-vehicle glass in India and sits inside Maruti's Kharkhoda plant. Gross auto revenue grew from ₹1,346 cr (FY21) to ₹${n0(A26.auto)} cr (FY26) and +22% in Q1FY27 on record car output and more glass per car (sunroofs, laminated side glass, HUD-ready windshields). But the EBITDA margin has stayed at 12-18% for six years: Maruti (a promoter with 10.6%) bought ₹873 cr in FY26 and ₹301 cr in Q1FY27 alone. We model auto +{{as.segments.0.growth.0|pct0}} / +{{as.segments.0.growth.1|pct0}} / +{{as.segments.0.growth.2|pct0}} at a {{as.segments.0.marginPct.0|pct}} margin.` },
    { h: 'Float glass: the profit engine, and the risk', p: `Float glass earned a 34% EBITDA margin at the FY22 import-price peak and 18% in FY25. The third line (Soniyana) now feeds the auto business, and in Q1FY27 float segment EBIT tripled to ₹117 cr (21.5% of gross revenue; ~${n1(q1Est.floatM)}% EBITDA by our estimate). In Aug-2026 the government added a minimum import price on clear float glass, but for one year only. We assume {{as.segments.1.marginPct.0|pct}} / {{as.segments.1.marginPct.1|pct}} / {{as.segments.1.marginPct.2|pct}}: high, fading as protection lapses and new capacity arrives.` },
    { h: 'Capital-hungry, with low returns so far', p: `ROCE fell from 21% (FY22-23) to 11% (FY26) through the build-out, ROE to 10.5% after the QIP, and another ₹2,000 cr of greenfield float, coatings and processing capex was approved in Jan-2026. With capex of ₹850-1,000 cr a year in our model, free cash flow stays near zero and net debt near ₹2,000-2,250 cr (1.5x EBITDA). Growth is being bought with capital at returns below its cost; the chairman himself says the next phase must be about returns.` },
    { h: 'Valuation: the market pays for the good quarter', p: `At ₹${n0(price)} AIS trades at ${n1(evNowSep)}x our Sep-28E EBITDA (EV/EBITDA) and ${n1(price / F.eps[1])}x FY28E EPS, close to its own ${n1(HEV.med)}x forward EV/EBITDA median since 2021, while auto-component stocks sat ${Math.abs(sectorEv).toFixed(1)}% below their five-year EV/EBITDA medians on 30-Sep-2026. ICICI's 22x applied to our FY28E EBITDA would give ~₹${n0(X.isecAtOurs)}: the gap is the multiple, not the estimates. We see no reason to pay a premium for earnings that lean on trade protection.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether float margins hold with the minimum import price in force from 18-Aug-2026, and auto growth against a softer base.',
    'Trade policy: the one-year minimum import price on clear float glass (expires Aug-2027 unless extended); the government\'s decision on continuing anti-dumping duties on Malaysian float glass after the 2026 sunset review.',
    'Capex: timetable, location and capacity of the ₹2,000 cr greenfield float/coatings/processing programme; Patan phase 3 and 4.',
    'Festive-season car sales (Oct-Dec 2026) and Maruti\'s volumes, the single biggest driver of auto glass.',
    'Energy and soda-ash prices: a float line burns natural gas around the clock; other auto suppliers reported gas and fuel costs rising with the West Asia conflict in Q1FY27.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yoyQ = X.M.quarterly.sales.map((s, i, a) => (i >= 4 ? Math.round((s / a[i - 4] - 1) * 1000) / 10 : null)).slice(-8);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹4,982 cr in FY26; ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Growth picked up to 12-15% from Q3FY26', unit: 'Revenue growth year on year (%)', x: X.M.quarterly.labels.slice(-8), series: [{ name: 'Revenue growth', values: yoyQ, fmt: 'pct' }], labels: 'all', source: 'Quarterly results as reported (Screener.in)' },
    ] },
    { pair: [
      { type: 'column', title: 'Float glass revenue +41% in Q1FY27 as Soniyana ran full', unit: 'Gross segment revenue (₹ crore)', x: QL, series: [{ name: 'Automotive glass', values: SQ.map(q => q.auto), fmt: 'num' }, { name: 'Float glass', values: SQ.map(q => q.float), fmt: 'num' }], labels: 'none', source: 'Quarterly results, segment tables (gross, incl. sales between segments)' },
      { type: 'line', title: 'Segment EBIT margin: float from ~10% to 21.5% in a year; auto 13.4%', unit: 'Segment result (EBIT) ÷ gross segment revenue (%)', x: QL, series: [{ name: 'Automotive glass', values: SQ.map(q => Math.round(q.autoEbit / q.auto * 1000) / 10), fmt: 'pct' }, { name: 'Float glass', values: SQ.map(q => Math.round(q.floatEbit / q.float * 1000) / 10), fmt: 'pct' }], labels: 'last', min: 0, max: 25, source: 'Quarterly results, segment tables' },
    ] },
    { pair: [
      { type: 'line', title: `EBITDA margin: 24% in FY22, 17% in FY24-25, ${n1(F.ebitdaMargin[0])}% in FY27E`, unit: 'EBITDA margin excl. other income (%)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 26, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Net debt stays ~₹2,000-2,250 cr as the next ₹2,000 cr is spent', unit: 'Net debt (₹ crore)', x: ['FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'Net debt', values: [...X.A.netDebt.slice(-4), ...F.years.map((_, i) => Math.round(X.netDebt(i)))], fmt: 'num' }], labels: 'all', source: 'Screener.in (borrowings incl. leases less cash and investments); GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: ${n1(evNowSep)}x Sep-28E now vs a ${n1(HEV.med)}x median since 2021`, unit: 'EV ÷ next full-year EBITDA (x)', x: X.fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: EVM.base, text: `Our multiple: ${EVM.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices, net debt and EBITDA; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street and the price', unit: `₹ per share; CMP ₹${n0(price)}`, x: [`${isec.broker} (Jun-26)`, 'GAM bull', 'GAM (base)', 'GAM bear'], series: [{ name: 'Value', values: [isec.tp, X.SC.bull.tp, V.tp, X.SC.bear.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'ICICI Securities (Jun-2026, via Moneycontrol/Trendlyne); GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.auto, P3.float, P3.consumer, P3.maruti, P3.moat, p.financials, P4.momentum, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
