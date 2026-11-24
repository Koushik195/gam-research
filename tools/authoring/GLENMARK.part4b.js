// Glenmark report, part 4b: our forecasts vs the street (regional build, other-income build, P&L summary, broker comparison).
const X = require('./GLENMARK.ctx');
const { F, A, AS, n0, n1, FY26, b, YRS, BL, LK, LBL, lines, blTot, core26, coreGrowth27, isbRep, repSales, repMargin, repEps, coreMargin26, OI, INT_CASH, ARB, MISC, oiNet, openCash, netCash26, mosl, choice, shortDate, oiQ1 } = X;
const g3 = arr => arr.map(v => n0(v));
const st = (o, y) => (o && o[y] != null ? n0(o[y]) : '–');

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: core EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}; on the street\'s reported basis, in line with MOSL and well below Choice',
  blocks: [
    { p: `We build revenue by region and run the model on the resulting growth rate; the authoring script checks that the build equals model revenue. **All forecasts are core**: they leave out the ISB 2001 licensing income, including the US$70mn a year of deferred upfront that reported revenue will still show in FY27-28, while keeping IGI's research cost. So FY27E revenue (₹{{F.sales.0|num}} cr) is ${n1(Math.abs(F.salesGrowth[0]))}% below reported FY26 but ${n1(coreGrowth27)}% above FY26 core (₹${n0(core26)} cr). North America is built in dollars at ₹${BL.fx.join(' / ')} per $. D&A is ${AS.depRateOnGrossBlock}% of gross block, capex ₹${AS.capex.map(n0).join(' / ')} cr, tax ${AS.taxRate.join(' / ')}%, payout ${AS.payout[0]}%. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet, which recalculates the target price.` },
    { exhibit: { type: 'table', title: 'Regional build (₹ crore; checked to sum to model revenue)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      [`${LBL.india} (growth)`, n0(BL.base.india), ...YRS.map((_, i) => `${n0(lines.india[i])} (+${BL.growth.india[i]}%)`)],
      ['North America core: US$ mn × ₹/$', `${n0(BL.base.na * 10 / FY26.fxAvg)} × ${FY26.fxAvg}`, ...YRS.map((_, i) => `${BL.naUsdMn[i]} × ${BL.fx[i]}`)],
      [LBL.na, n0(BL.base.na), ...g3(lines.na)],
      ...['europe', 'em'].map(k => [`${LBL[k]} (growth)`, n0(BL.base[k]), ...YRS.map((_, i) => `${n0(lines[k][i])} (+${BL.growth[k][i]}%)`)]),
      [LBL.other, n0(BL.base.other), ...g3(lines.other)],
      [LBL.isb, n0(BL.base.isb), '0', '0', '0'],
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
      ['  growth (FY27E vs reported FY26)', `${n1(A.salesGrowth[b])}%`, '{{F.salesGrowth.0|pct}}', '{{F.salesGrowth.1|pct}}', '{{F.salesGrowth.2|pct}}'],
      ['EBITDA margin: core (model)', `${n1(coreMargin26)}% (reported ${n1(A.ebitdaMargin[b])}%)`, ...YRS.map((_, i) => `${n1(F.ebitdaMargin[i])}%`)],
      ['Memo: reported basis incl. deferred ISB income (revenue / margin)', '', ...YRS.map((_, i) => `${n0(repSales[i])} / ${n1(repMargin[i])}%`)],
    ], source: 'AR FY26 segment table; Q2FY26 presentation; GAM estimates (assumptions.json businessLines)' } },
    { exhibit: { type: 'table', title: 'Other income, built (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Interest on operating cash (~₹800-900 cr held)', n0(OI.interest), `${INT_CASH}`, `${INT_CASH}`, `${INT_CASH}`],
      ['Working-capital arbitrage income (cost sits in finance cost)', '–', ...ARB.map(String)],
      ['Miscellaneous income', n0(OI.misc), ...MISC.map(String)],
      ['Treasury yield on model net cash, when positive', '', ...YRS.map((_, i) => `${n0(oiNet[i])} (${AS.treasuryYield[i]}% × ${n0(Math.max(openCash[i], 0))})`)],
      ['Exchange gain', n0(OI.forex), '0', '0', '0'],
      { hl: true, cells: ['**Other income (excl. exceptional items)**', `**${n0(OI.total)}**`, '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
      ['Memo: Q1FY27 other income (×4 = run-rate)', `${oiQ1} (${n0(oiQ1 * 4)})`, '', '', ''],
    ], source: `AR FY26 note 20; Q1FY27 results and call (CFO on arbitrage income and costs); model opening net cash ₹${n0(netCash26)} cr after debt-like items` } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore; FY27-29E core)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation & amortisation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit (owners)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net cash after debt-like items)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is Screener gross cash and investments in actual years and model net cash (after leases, litigation payables and the customer advance) in forecasts. Actual-year other income is Screener\'s (net of exceptional items); FY26 revenue, EBITDA and profit include the ISB 2001 income.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E core', 'GAM FY27E reported basis', 'MOSL / Choice FY27E', 'GAM FY28E core', 'GAM FY28E reported basis', 'MOSL / Choice FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(repSales[0]), `${st(mosl.sales, 'FY27E')} / ${st(choice.sales, 'FY27E')}`, '{{F.sales.1|num}}', n0(repSales[1]), `${st(mosl.sales, 'FY28E')} / ${st(choice.sales, 'FY28E')}`],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', n0(F.ebitda[0] + isbRep[0]), `${st(mosl.ebitda, 'FY27E')} / ${st(choice.ebitda, 'FY27E')}`, '{{F.ebitda.1|num}}', n0(F.ebitda[1] + isbRep[1]), `${st(mosl.ebitda, 'FY28E')} / ${st(choice.ebitda, 'FY28E')}`],
      { hl: true, cells: ['**EPS (₹)**', '**{{F.eps.0|n1}}**', `**${n1(repEps[0])}**`, `**${n1(mosl.eps.FY27E)} / ${n1(choice.eps.FY27E)}**`, '**{{F.eps.1|n1}}**', `**${n1(repEps[1])}**`, `**${n1(mosl.eps.FY28E)} / ${n1(choice.eps.FY28E)}**`] },
    ], source: `MOSL (${shortDate(mosl.date)}) and Choice Institutional Equities (${shortDate(choice.date)}; FY29E EPS ₹${choice.eps.FY29E}), both PDF; brokers' figures are on the reported basis (incl. the deferred ISB 2001 income). Reported basis = GAM core + US$70mn a year of deferred income at our rupee rate, taxed at ${AS.taxRate[0]}%. No dated consensus found.` } },
    { callout: `On the street's reported basis our FY27E EPS (₹${n1(repEps[0])}) is in line with MOSL (₹${n1(mosl.eps.FY27E)}) and ${Math.round((1 - repEps[0] / choice.eps.FY27E) * 100)}% below Choice (₹${n1(choice.eps.FY27E)}), whose revenue (₹${n0(choice.sales.FY27E)} cr) sits above the top of guidance. FY28E (₹${n1(repEps[1])} reported basis) is in line with MOSL (₹${n1(mosl.eps.FY28E)}). The real difference is what we value: our core EPS (₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}}) leaves out ~₹${n1(repEps[0] - F.eps[0])} a share of deferred licensing income a year that stops in March 2028, so FY29E core EPS (₹{{F.eps.2|n1}}) is ${F.eps[2] < repEps[1] ? 'below' : 'only just above'} FY28E's reported-basis ₹${n1(repEps[1])}: on the street's basis, FY29 is a flat year.` },
  ],
};

module.exports = { forecasts };
