// Ramkrishna Forgings report, part B: cover, the story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, markets, the profit collapse, moat, Q1FY27, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in RKFORGE.ctx.js; forecast and
// valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./RKFORGE.ctx');
const { F, V, A, SQ, QL, C, n0, n1, pc, price, mv, OWN, FM, SENS, sectorDr, MULT, epsSep, rating, medTp, CONS, ST, bld, BL, sepNow, k } = X;
const P2 = require('./RKFORGE.part2'), P3 = require('./RKFORGE.part3'), P4 = require('./RKFORGE.part4'), P5 = require('./RKFORGE.part5'), P6 = require('./RKFORGE.part6');
const r10 = v => Math.round(v / 10) * 10;
const DB = ST[0];

const cover = {
  headline: 'A recovering forger priced for a full recovery and a re-rating: we see little left to pay for',
  lead: `Ramkrishna Forgings is India's second-largest forging company (forged and machined truck parts, gears, ring-rolled parts, castings and trailer axles; ~32% of standalone revenue exported). Its EPS fell from ₹16.1 in FY24 to ₹3.9 in FY26. That collapse was not one event: FY25's reported ₹22.9 hid a ₹170 cr inventory write-down (book stock overstated by errors and unrecorded rejections, found at the year-end count and confirmed by an independent fact-finding review) behind a ₹193 cr deferred-tax credit and an ₹83 cr gain on a sold subsidiary; FY26 then had no one-offs to hide a 20% fall in exports and a jump in depreciation and interest after ₹2,900 cr of capex and acquisitions. Q1FY27 (revenue +20%, 18% margin) is a real recovery, and we forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E. The street values the stock on **P/E on FY28E** (Dalal & Broacha 27x). The stock's own forward P/E median since 2021 on EPS before one-offs, with the two trough years (FY25-26) left out, is ${n1(OWN.med)}x; cut by the ${Math.abs(sectorDr).toFixed(1)}% auto-component de-rating that gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The recovery is real', p: `Q1FY27 revenue ₹1,217 cr (+19.8%), EBITDA margin 18.0% (14.6% a year earlier), PAT ₹47 cr (₹12 cr). Exports +11%, domestic +20%, subsidiaries +49%. Management guides ~₹8,000 cr of revenue by FY29 (22-25% a year), export growth of 20%+ and lower debt. We model revenue +{{F.salesGrowth.0|n1}}% / +{{F.salesGrowth.1|n1}}% / +{{F.salesGrowth.2|n1}}% and margins of {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}, below the old 21-22%.` },
    { h: 'But trust has to be rebuilt', p: 'Book inventory was overstated by ₹220.5 cr at Mar-2025 (₹50.2 cr at Mar-2024, now restated) through erroneous SAP entries and rejections that were never recorded. No fraud was alleged, the promoters paid ₹205 cr for warrants at ~3.6x the market price to plug the hole, and controls were tightened; but ratings went to Negative/were cut, and the ₹8,000 cr target has already slipped a year.' },
    { h: 'Leverage and capital intensity cap the returns', p: `Net debt ~₹1,900 cr (Jun-2026) is ~3x FY26 EBITDA; ROCE was 6% in FY26. Even on our recovery numbers ROE reaches only {{F.roe.2|pct}} in FY29E, below a ~12.5% cost of capital, because depreciation and interest absorb a third of EBITDA and working capital grows with revenue.` },
    { h: 'Valuation: the price is ~2x the stock\'s own history', p: `At ₹${n0(price)} the stock trades at ${n1(sepNow)}x our Sep-28E EPS and ~${Math.round(X.trailPe)}x trailing. On normal earnings it traded at 7-17x forward in 2021-23; the 15-35x readings of 2023-24 rest on FY25 EPS inflated by one-offs. Even the house median on reported EPS gives ${SENS.house}x (₹${n0(r10(SENS.house * epsSep.base))}) and adding back the FY25 inventory charge ${SENS.inv}x (₹${n0(r10(SENS.inv * epsSep.base))}): SELL either way. The street (Dalal & Broacha ₹${n0(DB.tp)}, consensus average ₹${n0(CONS.avgTp)}) pays for a re-rating we cannot derive.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'RED' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): does the margin keep rising after Q1\'s 18.0%, and does Q2 export growth hold against a tariff-hit base?',
    'Rail-wheel JV: sample approval and bulk supply to Indian Railways from Sep/Oct-2026 (40,000-wheel FY27 offtake).',
    'Net debt from ~₹1,900 cr (Jun-2026) towards the ~₹1,500 cr Mar-2027 target; rating outlook (CRISIL Negative).',
    'US Class 8 truck orders and US tariff decisions on Indian auto parts; Mexico plant revenue from Q3FY27.',
    'Clean FY27 audit and quarterly inventory checks after the FY25 overstatement; the promoter-group reclassification request.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yrs = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], fyE = ['FY27E', 'FY28E', 'FY29E'], ai = y => A.labels.indexOf(y);
const repEps = [...yrs.map(y => A.eps[ai(y)]), ...F.eps].map(v => Math.round(v * 10) / 10);
const clnEps = [...C.annualKpis.map(x => x.cleanEps), ...F.eps].map(v => Math.round(v * 10) / 10);
const yrs2 = ['FY19', ...yrs];
const ebitdaS = [...yrs2.map(y => A.ebitda[ai(y)]), ...F.ebitda].map(Math.round);
const chargeS = [...yrs2.map(y => A.dep[ai(y)] + A.interest[ai(y)]), ...F.dep.map((d, i) => d + F.interest[i])].map(Math.round);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'FY25\'s ₹22.9 EPS was ~₹6 before one-offs; we see ₹21-28 by FY28-29E', unit: 'EPS (₹)', x: [...yrs, ...fyE], series: [{ name: 'Reported', values: repEps, fmt: 'n1' }, { name: 'Before one-offs', values: clnEps, fmt: 'n1' }], labels: 'all', source: 'Screener.in, AR FY26 (FY25 deferred-tax credit, discontinued gain; FY26 exceptional items); FY26 reported pro forma on 18.557 cr shares; GAM estimates' },
      { type: 'line', title: 'Margin back to 18% in Q1FY27 after a 10% low in Q4FY25', unit: 'EBITDA margin (%), Screener basis', x: QL, series: [{ name: 'EBITDA margin', values: SQ.map(q => Math.round(q.ebitda / q.consRev * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 5, max: 22, source: 'Screener.in; investor presentations' },
    ] },
    { pair: [
      { type: 'column', title: 'Exports fell ~30% after US tariffs and are recovering', unit: 'Standalone export revenue (₹ crore)', x: QL, series: [{ name: 'Exports', values: SQ.map(q => Math.round(q.exp)), fmt: 'num' }], labels: 'all', source: 'Quarterly investor presentations' },
      { type: 'column', title: 'Our revenue build: domestic leads, exports recover, new units add', unit: 'Revenue (₹ crore)', x: ['FY26', ...fyE], series: [{ name: 'Standalone domestic', values: [BL.base.dom, ...bld.map(r => r.dom)].map(Math.round), fmt: 'num' }, { name: 'Standalone exports', values: [BL.base.exp, ...bld.map(r => r.exp)].map(Math.round), fmt: 'num' }, { name: 'Subsidiaries & other (net)', values: [BL.base.oth, ...bld.map(r => r.oth)].map(Math.round), fmt: 'num' }], labels: 'none', source: 'Investor presentations; GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'Depreciation and interest now eat over 80% of EBITDA; we see ~50% by FY29E', unit: '₹ crore', x: [...yrs2, ...fyE], series: [{ name: 'EBITDA', values: ebitdaS, fmt: 'num' }, { name: 'Depreciation + interest', values: chargeS, fmt: 'num' }], labels: 'none', source: 'Screener.in; GAM estimates' },
      { type: 'line', title: 'Net debt falls only slowly on our numbers', unit: 'Net debt ÷ EBITDA (x), engine basis', x: fyE, series: [{ name: 'Net debt / EBITDA', values: X.ndEbitda.map(v => Math.round(v * 100) / 100), fmt: 'x' }], labels: 'all', min: 0, max: 3, source: 'GAM estimates (Mar-26 net debt ~₹1,840 cr on Screener basis, after the warrant money)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E on EPS before one-offs: ${n1(sepNow)}x Sep-28E now vs a ${n1(OWN.med)}x median`, unit: 'Price ÷ next full-year EPS before one-offs (x); trough years FY25-26 left out', x: OWN.kept.map(x => x[0]), series: [{ name: 'Forward P/E', values: OWN.kept.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x (median ${n1(OWN.med)}x)`, color: '#cf8f1f' }], source: 'Screener.in prices; EPS before one-offs (AR FY26), GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n0(price)}`, x: [`${DB.broker} (Jun-26)`, 'Consensus average (Jul-26)', 'GAM (base)'], series: [{ name: 'Target', values: [DB.tp, CONS.avgTp, V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Dalal & Broacha (1-Jun-2026); S&P Global consensus via StockAnalysis (31-Jul-2026, 4 analysts); GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.markets, P3.collapse, P3.newbiz, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
