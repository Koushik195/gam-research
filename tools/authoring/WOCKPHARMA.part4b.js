// Wockhardt report, part 4b: our forecasts vs the street (no broker estimates were public on 30-Sep-2026), management's
// ambitions and ICRA's cash-flow view; drivers table and the scenario EPS.
const X = require('./WOCKPHARMA.ctx'), Y = require('./WOCKPHARMA.ctx2');
const { F, AS, SC, A, b, n0, n1, YRS, lines, baseRev } = X;
const pctS = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])}; no broker published estimates we could find, and management talks bigger`,
  blocks: [
    { p: 'We could not find a single broker estimate standing on 30-Sep-2026: the one recent note (Deven Choksey, 12-Jun-2026) is "Not Rated" with no public numbers, and the last rated note (Axis Securities, Jul-2025) is stale. So we compare our forecasts with what the company and its rating agency said. The two numbers that matter most are the speed of Zaynich\'s US launch and emerging-market insulin, where tender timing can swing a quarter by ₹50-60 cr.' },
    { exhibit: { type: 'table', title: 'GAM forecasts (₹ crore unless stated)', head: ['', 'FY26', ...YRS], rows: [
      ['Revenue', n0(A.sales[b]), ...F.sales.map(n0)], ['  growth', '+12.0%', ...F.salesGrowth.map(pctS)],
      ['  of which base business', n0(A.sales[b]), ...baseRev.map(n0)], ['  of which Zaynich', '–', ...lines.zaynich.map(n0)],
      ['EBITDA (Screener basis)', n0(A.ebitda[b]), ...F.ebitda.map(n0)], ['  margin', `${n1(A.ebitdaMargin[b])}%`, ...F.ebitdaMargin.map(v => `${n1(v)}%`)],
      ['Depreciation (base) + Zaynich amortisation', n0(A.dep[b]), ...YRS.map((_, i) => `${n0(F.dep[i])} + ${n0(Y.Z_AMORT[i])}`)],
      ['Other income', `${n0(111)} (incl. ₹55 cr asset sales)`, ...F.otherIncome.map(n0)], ['Finance cost', n0(213), ...Y.FIN.map(n0)],
      ['Tax rate', '16.3%', ...AS.taxRate.map(t => `${t}%`)],
      { hl: true, cells: ['**Net profit (owners)**', `**${n0(A.pat[b])}**`, ...F.pat.map(v => `**${n0(v)}**`)] },
      { hl: true, cells: ['**EPS (₹)**', `**${n1(A.eps[b])}**`, ...F.eps.map(v => `**${n1(v)}**`)] },
      ['EPS before exceptional items (₹)', n1(X.epsExc[2026]), ...F.eps.map(n1)],
      ['Cash from operations', n0(A.cfo[b]), ...F.cfo.map(n0)], ['Capex (incl. NCE development)', n0(A.capex[b]), ...F.capex.map(n0)],
      ['ROE', `${n1(A.roe[b])}%`, ...F.roe.map(v => `${n1(v)}%`)],
    ], source: 'Screener.in (FY26, owners); GAM estimates' } },
    { exhibit: { type: 'table', title: 'Our numbers against what was said before 30-Sep-2026', head: ['Item', 'What was said', 'Our forecast', 'Gap'], wide: [1, 2], rows: [
      ['Revenue FY28', 'Rs6,000 cr ambition (Business Today, Jul-2026; not in filings)'.replace('Rs', '₹'), `₹${n0(F.sales[1])} cr`, `${n0((F.sales[1] / 6000 - 1) * 100)}%`],
      ['Zaynich, first ~3 years in the US', 'US$30-50mn in total (company, for new anti-infectives)', `US$${AS.businessLines.zaynich.usUsdMn.reduce((s, v) => s + v, 0)}mn over FY27-29E`, 'Inside the range'],
      ['Zaynich profitability', 'Slight loss/neutral for 12-18 months, then breakeven', `EBITDA ₹${AS.businessLines.margin.zaynichEbitda.join(' / ')} cr`, 'In line, slightly slower'],
      ['Biosimilars', 'Double in 24-36 months (from ₹697 cr)', `Emerging markets +${AS.businessLines.growth.em.join('% / +')}%`, 'Slower than the target'],
      ['Cash from operations FY27', '₹400-420 cr (ICRA)', `₹${n0(F.cfo[0])} cr + ₹${n0(F.otherIncome[0] * (1 - AS.taxRate[0] / 100))} cr after-tax other income`, 'In line'],
      ['Capex FY27-28', '~₹300 cr a year (ICRA); ₹200-300 cr (chairman)', `₹${F.capex[0]} / ${F.capex[1]} cr`, 'In line'],
    ], source: 'Investor meet (4-Jun-2026); ICRA (21-May-2026); Business Today (7-Jul-2026); GAM' } },
    { exhibit: { type: 'table', title: 'Scenario EPS (₹)', head: ['Scenario', ...YRS, 'What changes'], wide: [4], rows: [
      ['Bull', ...SC.bull.eps.map(n1), 'Revenue growth +4pp a year, EBITDA margin +2pp'],
      { hl: true, cells: ['**Base**', ...F.eps.map(v => `**${n1(v)}**`), 'As above'] },
      ['Bear', ...SC.bear.eps.map(n1), 'Revenue growth −4pp a year, EBITDA margin −2.5pp'],
    ], source: 'GAM Research (engine scenarios)' } },
    { callout: `**Where we could be wrong:** upside if Zaynich follows the faster path management describes (each extra US$10mn of US sales in FY29E is ~₹${n0(10 * 94 / 10 * 0.8 * 0.78 / X.SHARES)} of EPS at an 80% contribution margin), if a UK subscription is awarded (GBP 20mn a year is ~₹${n0(20 * 128 / 10 * 0.78 / X.SHARES)} of EPS), or if insulin doubles on time. Downside if launch costs run longer, if amortisation starts earlier or runs over a shorter life, or if insulin tenders slip.` },
  ],
};

module.exports = { forecasts };
