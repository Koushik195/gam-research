// MRF report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// channels, rubber spread, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street, valuation, verdict,
// glossary, statement notes). Shared inputs in MRF.ctx.js; forecast and valuation figures are live tokens ({{...}}) that
// follow assumptions.json. As of 30-Sep-2026.
const X = require('./MRF.ctx');
const { F, V, A, SQ, n0, n1, pc, price, mv, FM, sectorDr, MULT, epsSep, rating, postQ1, medTp, C } = X;
const P2 = require('./MRF.part2'), P3 = require('./MRF.part3'), P4 = require('./MRF.part4'), P5 = require('./MRF.part5'), P6 = require('./MRF.part6');

const cover = {
  headline: `Rubber has squeezed the margin; at ${Math.round(X.sepNow)}x Sep-28E EPS the recovery is not in the price`,
  lead: `MRF is India's largest tyre maker (~32% of units sold), with 69% of sales in the replacement market, no net debt and ~₹7,600 cr of cash and liquid funds. Q1FY27 revenue grew 9.6% but the EBITDA margin fell to 11.8% (13.9% a year earlier) as natural rubber rose to ~₹275/kg. We forecast EPS of ₹${n0(F.eps[0])} / ₹${n0(F.eps[1])} / ₹${n0(F.eps[2])} for FY27-29E: a dip, then recovery as price increases catch up. The street values MRF on **P/E on one-year-forward EPS** (MOSL 19x FY28E). The house rule (MRF's forward P/E median since 2021, ${n1(FM.median)}x, cut by the ${Math.abs(sectorDr).toFixed(1)}% tyre-sector de-rating) gives **${MULT.base}x Sep-28E EPS of ₹${n0(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**, close to the 15% line. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The franchise is intact', p: 'Unit share rose to 31.9% in FY26 (~30% in FY25, CARE); OEM demand was "buoyant" and replacement "robust" in Q1FY27 (MOSL). MRF sells through 5,000+ dealers and calls itself the "definitive market leader" in two-wheeler tyres (AR FY26). Revenue has grown 14% a year since FY21.' },
    { h: 'The margin is at a cyclical low, not a new normal', p: 'Raw material jumped to 67.3% of revenue in Q1 (61.7% in Q4FY26). The industry has taken 7-9% of price increases with more in Q2; CRISIL calls FY27 "a cost-pass-through lag rather than a structural profitability reset" and sees margins recover in FY28. MRF\'s margin was 10.4% in FY23 and 17.0% a year later.' },
    { h: 'But returns are mediocre and governance favours the family', p: 'ROE has been 10-13% in normal years and never above 13.3% since FY18; the payout is ~4%, so cash piles up at ~6%. The five executive directors (all Mammen family) were paid ₹157 cr in FY26, more than total dividends (~₹100 cr). A ₹622 cr CCI penalty is unprovided.' },
    { h: 'Valuation: cheap against its own history, not against cash flows', p: `At ₹${n0(price)} MRF trades at ${n1(price / F.eps[1])}x FY28E and ${n1(X.sepNow)}x Sep-28E EPS, below its ${n1(FM.median)}x forward median and 22% below its Oct-2025 high. The DCF (₹${n0(mv('dcf').value)}) says the price is about fair on cash flows, and the post-Q1 street median is ₹${n0(medTp)}. The upside needs the margin to recover to ~14% by FY28E.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'num'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first full quarter of price increases against rubber at ~₹270-275/kg.',
    'Natural rubber after Southeast Asia\'s seasonal peak tapping window; CRISIL\'s trigger is a level below ₹250/kg.',
    'Further price increases in replacement and OEM pass-through clauses in H2FY27.',
    'Monsoon outcome and rural demand (tractor and farm tyres); festive-season replacement demand.',
    'Supreme Court hearing on the CCI penalty; AIS-142 phase 2 noise norms (H2FY27) shifting OEM trucks to radials.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const rmQ = SQ.filter(q => q.rmPct != null);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹31,149 cr in FY26; ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Channel mix: replacement 69%, OEM 23%, exports 8%', unit: '% of sales, FY26', x: ['Replacement', 'OEM', 'Exports'], series: [{ name: 'FY26', values: [69.1, 23.3, 7.6], fmt: 'pct' }], labels: 'all', source: 'CARE Ratings (28-Sep-2026); AR FY26' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: a ten-year cycle between 10% and 20%', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 5, max: 22, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'line', title: 'Q1FY27: raw material jumped to 67.3% of revenue', unit: 'Raw material, % of revenue (standalone)', x: rmQ.map(q => q.q), series: [{ name: 'Raw material', values: rmQ.map(q => q.rmPct), fmt: 'pct' }], labels: 'all', min: 55, max: 70, source: 'MOSL (11-Aug-2026)' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS: dip in FY27E, recovery in FY28-29E', unit: 'EPS (₹)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates' },
      { type: 'line', title: 'ROE: 10-13% in normal years', unit: 'Return on equity (%)', x: 'fin.labels', from: 'FY17', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(X.sepNow)}x Sep-28E now vs a ${n1(FM.median)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Forward P/E', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q1 notes)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `MOSL (11-Aug-2026); Business Upturn, Investing.com, Moneycontrol (12-Aug-2026); median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.channels, P3.spread, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
