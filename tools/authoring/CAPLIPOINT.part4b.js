// Caplin Point report, part 4b: our forecasts vs the street (estimates standing on 30-Sep-2026).
const X = require('./CAPLIPOINT.ctx');
const { F, AS, n0, n1, pc, icici, CONS, epsU, YRS, FY26, OI_CARRY, TY, NONTREAS, GAP, oiBuild, ttmOiRep, oi26exFx, taxRateBuild, TB, build, BL } = X;
const vs = (a, z) => pc((a / z - 1) * 100);

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Forecasts', title: `Forecasts: EPS ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}; in line with the street for FY27E, ~6% below ICICI for FY28E on other income and depreciation`,
  blocks: [
    { p: `We forecast revenue of {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}), built from Rest of World (+${BL.growth.row.join('% / +')}%) and the USA (+${BL.growth.us.join('% / +')}%); EBITDA margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}; depreciation at 8% of gross block as three plants are capitalised; other income without FX gains; tax 20.5% plus minorities. EPS to shareholders: ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} (${pc(epsU[0] / FY26.eps * 100 - 100)} / ${pc(epsU[1] / epsU[0] * 100 - 100)} / ${pc(epsU[2] / epsU[1] * 100 - 100)}). The only public forecasts are ICICI Securities' (13-Aug-2026): our revenue and EBITDA are close to theirs; our FY28E EPS is ${vs(epsU[1], icici.eps.FY28E)} lower because we leave FX gains out of other income and use FY26's 6.4% treasury yield (our FY28E other income ₹${n0(F.otherIncome[1])} cr vs ICICI's ₹${n0(icici.otherIncome.FY28E)} cr), carry more depreciation for the new plants, and include minorities in the tax line.` },
    { exhibit: { type: 'table', title: 'GAM vs ICICI Securities (₹ crore)', head: ['', 'FY26', 'FY27E GAM', 'FY27E ICICI', 'vs', 'FY28E GAM', 'FY28E ICICI', 'vs', 'FY29E GAM'], rows: [
      ['Revenue', n0(FY26.revenue), '{{F.sales.0|num}}', n0(icici.sales.FY27E), vs(F.sales[0], icici.sales.FY27E), '{{F.sales.1|num}}', n0(icici.sales.FY28E), vs(F.sales[1], icici.sales.FY28E), '{{F.sales.2|num}}'],
      ['EBITDA (before other income)', '765', '{{F.ebitda.0|num}}', n0(icici.ebitda.FY27E), vs(F.ebitda[0], icici.ebitda.FY27E), '{{F.ebitda.1|num}}', n0(icici.ebitda.FY28E), vs(F.ebitda[1], icici.ebitda.FY28E), '{{F.ebitda.2|num}}'],
      ['EBITDA margin', '35.0%', '{{F.ebitdaMargin.0|pct}}', '34.2%', '', '{{F.ebitdaMargin.1|pct}}', '35.0%', '', '{{F.ebitdaMargin.2|pct}}'],
      ['Other income', n0(FY26.otherIncome.total), '{{F.otherIncome.0|num}}', n0(icici.otherIncome.FY27E), vs(F.otherIncome[0], icici.otherIncome.FY27E), '{{F.otherIncome.1|num}}', n0(icici.otherIncome.FY28E), vs(F.otherIncome[1], icici.otherIncome.FY28E), '{{F.otherIncome.2|num}}'],
      ['Depreciation', '73', '{{F.dep.0|num}}', '87', '', '{{F.dep.1|num}}', '104', '', '{{F.dep.2|num}}'],
      { hl: true, cells: ['**Profit to shareholders**', `**${n0(FY26.patOwners)}**`, '**{{F.pat.0|num}}**', `**${n0(icici.pat.FY27E)}**`, `**${vs(F.pat[0], icici.pat.FY27E)}**`, '**{{F.pat.1|num}}**', `**${n0(icici.pat.FY28E)}**`, `**${vs(F.pat[1], icici.pat.FY28E)}**`, '**{{F.pat.2|num}}**'] },
      ['EPS (₹)', n1(FY26.eps), n1(epsU[0]), n1(icici.eps.FY27E), vs(epsU[0], icici.eps.FY27E), n1(epsU[1]), n1(icici.eps.FY28E), vs(epsU[1], icici.eps.FY28E), n1(epsU[2])],
    ], source: 'ICICI Securities result update (13-Aug-2026); GAM Research. ICICI\'s FY27E/FY28E minorities ₹9.0 / 10.5 cr; tax ₹187 / 210 cr' } },
    { pair: [
      { type: 'column', title: 'EPS: GAM vs ICICI', unit: 'EPS to shareholders (₹)', x: ['FY26', ...YRS], series: [{ name: 'GAM', values: [FY26.eps, ...epsU.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }, { name: 'ICICI Securities', values: [FY26.eps, icici.eps.FY27E, icici.eps.FY28E, null], fmt: 'n1' }], labels: 'all', source: 'ICICI Securities; GAM' },
      { type: 'stacked', title: 'Revenue by segment: the US rises to a quarter', unit: '₹ crore; FY27-29E = GAM', x: ['FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'Rest of World', values: [1381, 1583, 1734, ...build.row.map(Math.round)], fmt: 'num' }, { name: 'USA', values: [313, 355, 453, ...build.us.map(Math.round)], fmt: 'num' }], labels: 'none', source: 'Company segment notes; GAM' },
    ] },
    { exhibit: { type: 'table', title: 'Key assumptions', head: ['Driver', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ['Rest of World growth', ...BL.growth.row.map(v => `+${v}%`), 'Tenders booked + rupee in FY27E; Chile and Mexico after'],
      ['USA growth', ...BL.growth.us.map(v => `+${v}%`), 'Guided 25-30% for FY27; plant full until new lines'],
      ['EBITDA margin', ...AS.ebitdaMargin.map(v => v + '%'), 'New plants\' costs in FY28E; US operating leverage'],
      ['Capex (₹ cr)', ...AS.capex.map(n0), '₹510 cr left of the programme + Mexico'],
      ['Other income (₹ cr)', ...F.otherIncome.map(n0), `${TY}% on the gross treasury book + ₹${n1(NONTREAS)} cr grants and misc.; no FX`],
      ['Tax + minorities (engine rate)', ...taxRateBuild.map(v => v + '%'), `20.5% of PBT + minorities ₹${TB.minorities.join(' / ')} cr`],
      ['Payout', ...AS.payout.map(v => v + '%'), 'FY26 9.5%; no buyback history'],
    ], source: 'GAM Research (assumptions.json; checked in CAPLIPOINT.ctx.js)' } },
    { exhibit: { type: 'table', title: 'Other income: how we build it (₹ crore)', head: ['', 'FY25', 'FY26', 'TTM Jun-26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Interest, fund gains, fair-value gains', n1(FY26.otherIncome.prev.interest + FY26.otherIncome.prev.realisedGain + FY26.otherIncome.prev.fvGain), n1(X.TREAS_INC26), '–', ...oiBuild.map(v => n1(v - NONTREAS))],
      ['Grants and miscellaneous', n1(FY26.otherIncome.prev.grant + FY26.otherIncome.prev.misc + FY26.otherIncome.prev.profitOnSale), n1(NONTREAS), '–', ...oiBuild.map(() => n1(NONTREAS))],
      ['FX gains (not forecast)', n1(FY26.otherIncome.prev.fx), n1(FY26.otherIncome.fx), 'n.d.', '–', '–', '–'],
      { hl: true, cells: ['**Total**', `**${n1(FY26.otherIncome.prev.total)}**`, `**${n1(FY26.otherIncome.total)}**`, `**${n1(ttmOiRep)}**`, ...F.otherIncome.map(v => `**${n0(v)}**`)] },
      ['Treasury yield on average gross book', '–', n1(X.YIELD26) + '%', '–', `${TY}%`, `${TY}%`, `${TY}%`],
    ], source: `AR FY26 note 27; Screener.in quarters; GAM. The engine applies ${TY}% to its net cash, which deducts the ₹217 cr CCPS and leases; the ₹${n1(OI_CARRY)} cr carry adds back ${TY}% on that ₹${n0(GAP)} cr gap plus grants and miscellaneous income. FY27E is below the TTM (₹${n1(ttmOiRep)} cr) mainly because we exclude FX gains (₹${n1(FY26.otherIncome.fx)} cr in FY26; Q1FY27 not disclosed); FY26 excluding FX was ₹${n1(oi26exFx)} cr` } },
  ],
};

module.exports = { forecasts };
