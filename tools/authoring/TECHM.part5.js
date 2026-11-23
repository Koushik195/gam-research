// Tech Mahindra report, part 5: our forecasts vs the street, and the street view with critiques.
const X = require('./TECHM.ctx');
const { D, F, A, AS, UB, ebitM, n0, n1, pc, pc1, ST, CONS, withEps, postQ1, medTp, avgTp, avgEps, streetEbit, price, b, epsCagr2629, epsCagr2729 } = X;
const gap = (g, s) => Math.round((g / s - 1) * 100);
const short = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}-${y.slice(2)}`; };
const cons = CONS.find(c => c.epsFY27);

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: `Our forecasts: EPS +{{F.epsGrowth.0|n1}}% in FY27E on margin and the rupee, then ~12% a year`,
  blocks: [
    { p: `We forecast revenue in dollars by vertical (previous chapter), convert at ${UB.inrUsdAvg.join(' / ')} rupees per dollar and set the company-definition EBIT margin at {{as.ebitMarginTargetPct.0|n1}}% / {{as.ebitMarginTargetPct.1|n1}}% / {{as.ebitMarginTargetPct.2|n1}}%. Depreciation runs at ~3% of revenue; capex ₹850-950 cr; other income is built from treasury yield, miscellaneous income and FX losses (₹400 cr in FY27E); finance costs ₹420-440 cr (mainly leases); the tax line (28.2%) includes minorities; payout 85% of EPS. EPS is on the reported share count (88.6 cr). Every assumption, with reasons, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'table', title: 'Key forecasts', head: ['', 'FY26A', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue (USD mn)', n0(UB.base.usdRev), ...UB.usdRev.map(n0)],
      ['  growth (USD)', '+1.9%', ...UB.usdGrowthPct.map(pc1)],
      ['INR/USD (average)', '89.0', ...UB.inrUsdAvg.map(n1)],
      ['Revenue (₹ cr)', n0(A.sales[b]), '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}'],
      ['EBIT margin (company definition)', '12.6%', ...ebitM.map(v => n1(v) + '%')],
      ['EBIT (₹ cr)', n0(A.ebitda[b] - A.dep[b]), '{{F.ebit.0|num}}', '{{F.ebit.1|num}}', '{{F.ebit.2|num}}'],
      ['Other income (₹ cr)', '32 (company) / −240 (Screener)', '{{F.otherIncome.0|num}}', '{{F.otherIncome.1|num}}', '{{F.otherIncome.2|num}}'],
      ['Net profit attributable (₹ cr)', n0(A.pat[b]), '{{F.pat.0|num}}', '{{F.pat.1|num}}', '{{F.pat.2|num}}'],
      { hl: true, cells: ['**EPS (₹)**', `**${n1(A.eps[b])}**`, '**{{F.eps.0|n1}}**', '**{{F.eps.1|n1}}**', '**{{F.eps.2|n1}}**'] },
      ['DPS (₹)', '51.0', '{{F.dps.0|n1}}', '{{F.dps.1|n1}}', '{{F.dps.2|n1}}'],
      ['ROE', n1(A.roe[b]) + '%', '{{F.roe.0|pct}}', '{{F.roe.1|pct}}', '{{F.roe.2|pct}}'],
    ], source: 'Company (FY26), GAM Research estimates. FY26 EBIT on Screener basis (₹7,151 cr; company ₹7,152 cr)' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'EBIT margin', ref: 'fin.ebitMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit (attributable)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net of borrowings and leases)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross in actual years and net of borrowings (incl. leases) in forecasts.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['Broker (date)', 'EPS FY27E', 'EPS FY28E', 'USD revenue FY27E', 'EBIT FY27E / FY28E'], rows: [
      ...withEps.map(s => [`${s.broker} (${short(s.date)})`, n1(s.eps.FY27E), n1(s.eps.FY28E), s.usdRevFY27 ? n0(s.usdRevFY27) : '–', s.ebit ? `${n1(s.ebit.FY27E)}% / ${n1(s.ebit.FY28E)}%` : '–']),
      ['Bloomberg consensus (17-Jul-26)', n1(cons.epsFY27), n1(cons.epsFY28), '–', '–'],
      { hl: true, cells: ['**GAM Research**', '**{{F.eps.0|n1}}**', '**{{F.eps.1|n1}}**', `**${n0(UB.usdRev[0])}**`, `**${n1(ebitM[0])}% / ${n1(ebitM[1])}%**`] },
    ], source: 'Broker notes (Jul-Sep 2026) as listed in the street table; Bloomberg consensus as printed in the BOB Capital note' } },
    { callout: `Our FY27E EPS is ${Math.abs(gap(F.eps[0], avgEps('FY27E')))}% ${F.eps[0] >= avgEps('FY27E') ? 'above' : 'below'} the average of the brokers that publish estimates (₹${n1(avgEps('FY27E'))}) and FY28E ${Math.abs(gap(F.eps[1], avgEps('FY28E')))}% ${F.eps[1] >= avgEps('FY28E') ? 'above' : 'below'} (₹${n1(avgEps('FY28E'))}); against Bloomberg consensus (₹${n1(cons.epsFY27)} / ₹${n1(cons.epsFY28)}) we are close. Revenue and margins are in line; the gap is below EBIT: we carry ₹400 cr of FX losses in FY27E and a 28.2% tax-plus-minorities rate. Our EPS compounds ~${Math.round(epsCagr2629)}% a year over FY26-29E but only ~${Math.round(epsCagr2729)}% over FY27-29E, once the margin catch-up is done. **We are not more bearish than the street on earnings; we differ on what to pay for them.**` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: split, median target ₹${n0(medTp)}; even the bulls pay only 20x`,
  blocks: [
    { p: `About twenty houses updated their views after the Q1FY27 results (16-17 Jul 2026), plus JM Financial (28-Sep) and Choice (10-Sep). Buys and Overweights: Motilal Oswal ₹1,900, ICICI Direct ₹1,800, Nuvama ₹1,800, Prabhudas Lilladher ₹1,780, JPMorgan ₹1,700 and HSBC ₹1,635. Add/Accumulate: Choice ₹1,775, Deven Choksey ₹1,726, JM Financial ₹1,705, CLSA ₹1,634 and Elara ₹1,620. Hold/Neutral: Nomura ₹1,600, BOB Capital ₹1,547, ICICI Securities ₹1,470 and UBS ₹1,460. Bears: Goldman Sachs (Sell) ₹1,420, Morgan Stanley ₹1,270, Jefferies (Underperform) ₹1,260 and Axis Capital ₹1,080. The median target of these post-results notes is ₹${n0(medTp)} (average ₹${n0(avgTp)}; Bloomberg average ₹1,608 from 43 analysts on 17-Jul), only ${pc(medTp / price * 100 - 100)} above the ${n0(price)} close. Every house that discloses a method uses **P/E on FY28E (or Jun-28E) EPS, at 16.9-20x**. Bulls pay for growth leadership and the deal ramp; bears say ~9% EPS growth after FY27 does not justify ~20x when Tier-1 peers trade at 13-14x.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], wide: [0], rows: D.critiques.map(c => [c]), source: 'Broker notes, calls and filings to 30-Sep-2026; GAM Research' } },
    { exhibit: { type: 'hbar', title: `Street targets: ₹1,080-1,900; median ₹${n0(medTp)}`, unit: `12-month target (₹); CMP ₹${n0(price)}`, x: postQ1.slice().sort((p, q) => q.tp - p.tp).map(s => s.broker), series: [{ name: 'Target', values: postQ1.slice().sort((p, q) => q.tp - p.tp).map(s => s.tp), fmt: 'inr' }], labels: 'all', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press roundups, 16-Jul to 28-Sep-2026' } },
  ],
};

module.exports = { forecasts, street };
