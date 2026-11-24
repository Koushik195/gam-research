// Biocon report, part 5: our forecasts vs the street, and the street view.
const X = require('./BIOCON.ctx2');
const { D, F, V, A, AS, n0, n1, pc, rup, price, ST, withTp, medTp, shortDate, ASOF_TXT, rev, ebs, mi, SHARES, rating } = X;
const MO = ST.find(s => s.broker === 'Motilal Oswal'), AX = ST.find(s => /Axis/.test(s.broker));
const gap = (a, c) => pc((a / c - 1) * 100);
const pat = F.pat, eps = F.pat.map(p => p / SHARES);

const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs street', kicker: 'Our forecasts', title: `Our EPS is below the street: slower constant-currency growth, Syngene's minorities, a later margin ramp`,
  blocks: [
    { p: `We forecast revenue growth of ${n1(F.salesGrowth[0])}% / ${n1(F.salesGrowth[1])}% / ${n1(F.salesGrowth[2])}% in FY27-29E, EBITDA before other income of ₹${n0(F.ebitda[0])} / ${n0(F.ebitda[1])} / ${n0(F.ebitda[2])} cr (margin ${n1(F.ebitdaMargin[0])}% / ${n1(F.ebitdaMargin[1])}% / ${n1(F.ebitdaMargin[2])}%) and attributable profit of ₹${n0(pat[0])} / ${n0(pat[1])} / ${n0(pat[2])} cr: EPS ₹${n1(eps[0])} / ₹${n1(eps[1])} / ₹${n1(eps[2])} on 162.97 cr shares. Profit grows much faster than EBITDA because interest falls (₹${AS.interest.join(' / ')} cr vs ₹990 cr in FY26) and the BBL minorities are gone; amortisation keeps rising. Revenue is in line with MOSL; EBITDA and EPS are lower.` },
    { exhibit: { type: 'table', title: 'GAM vs the street (₹ crore unless stated)', head: ['', 'GAM FY27E', 'MOSL FY27E', 'Axis FY27E', 'GAM FY28E', 'MOSL FY28E', 'Axis FY28E', 'GAM FY29E'], rows: [
      ['Revenue', n0(F.sales[0]), n0(MO.ests.salesFY27E), n0(AX.ests.salesFY27E), n0(F.sales[1]), n0(MO.ests.salesFY28E), n0(AX.ests.salesFY28E), n0(F.sales[2])],
      ['EBITDA (before other income)', n0(F.ebitda[0]), n0(MO.ests.ebitdaFY27E), n0(AX.ests.ebitdaFY27E), n0(F.ebitda[1]), n0(MO.ests.ebitdaFY28E), n0(AX.ests.ebitdaFY28E), n0(F.ebitda[2])],
      ['EBITDA margin', `${n1(F.ebitdaMargin[0])}%`, `${n1(MO.ests.ebitdaFY27E / MO.ests.salesFY27E * 100)}%`, `${n1(AX.ests.ebitdaFY27E / AX.ests.salesFY27E * 100)}%`, `${n1(F.ebitdaMargin[1])}%`, `${n1(MO.ests.ebitdaFY28E / MO.ests.salesFY28E * 100)}%`, `${n1(AX.ests.ebitdaFY28E / AX.ests.salesFY28E * 100)}%`, `${n1(F.ebitdaMargin[2])}%`],
      ['Net profit (attributable)', n0(pat[0]), n0(MO.ests.patFY27E), n0(AX.ests.patFY27E), n0(pat[1]), n0(MO.ests.patFY28E), n0(AX.ests.patFY28E), n0(pat[2])],
      { hl: true, cells: ['**EPS (₹)**', `**${n1(eps[0])}**`, `**${MO.eps.FY27E}**`, `**${AX.eps.FY27E}**`, `**${n1(eps[1])}**`, `**${MO.eps.FY28E}**`, `**${AX.eps.FY28E}**`, `**${n1(eps[2])}**`] },
      ['GAM vs broker (EPS)', '', gap(eps[0], MO.eps.FY27E), gap(eps[0], AX.eps.FY27E), '', gap(eps[1], MO.eps.FY28E), gap(eps[1], AX.eps.FY28E), ''],
    ], source: 'GAM estimates; MOSL Q1FY27 note (6-Aug-2026; EBITDA before other income); Axis Securities (19-Sep-2026, via DSIJ). Axis\'s EBITDA basis is not stated' } },
    { exhibit: { type: 'table', title: 'Why we differ', head: ['Driver', 'GAM', 'Street', 'Effect on FY28E EPS'], wide: [1, 2], rows: [
      ['Biosimilars growth', `+${AS.businessLines.growth.biosimilars.join('% / +')}% (rupees); Q1 constant-currency ~+5%`, 'MOSL 16% CAGR FY26-28E; Nuvama ~21%', '~−3% vs MOSL'],
      ['Syngene', `${AS.businessLines.growth.services.join('% / ')}% revenue; margin ${AS.businessLines.margin.services.join('% / ')}%`, 'MOSL −3.4% CAGR to FY28E', 'Small (MOSL is lower on revenue)'],
      ['Generics margin', `${AS.businessLines.margin.generics.join('% / ')}%`, 'Street expects faster operating leverage', '~−2%'],
      ['Syngene minorities', `Deducted: ₹${mi.map(n0).join(' / ')} cr`, 'MOSL shows minorities adding to profit in FY27-28E', '~−8% vs MOSL'],
      ['Other income', 'Gross ₹220-240 cr; no fair-value gains', 'MOSL ₹221 / 249 cr', 'Small'],
      ['Tax', `${AS.taxRate.join('% / ')}%`, 'MOSL 19.1% / 21.0%', '~−1%'],
    ], source: 'GAM Research; MOSL 6-Aug-2026' } },
    { pair: [
      { type: 'column', title: 'EBITDA before other income: ₹3,471 cr in FY26, ₹5,329 cr in FY29E', unit: 'EBITDA (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates' },
      { type: 'line', title: 'ROE stays low: ~5% by FY29E on a book swollen by goodwill and new equity', unit: 'Return on equity (%)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 15, source: 'Screener.in; GAM estimates' },
    ] },
    { callout: `**What would make us wrong:** each 1pp of consolidated EBITDA margin is ~₹${n0(F.sales[1] / 100)} cr of FY28E EBITDA and ~${Math.round(F.sales[1] / 100 * (1 - AS.taxRate[1] / 100) / pat[1] * 100)}% of FY28E EPS, so a faster launch ramp (management's "mid-20s" margin) would lift EPS sharply; so would refinancing the 6.67% notes or selling the Bicara stake. On the downside, another quarter like Q1 (19.5% margin) would leave FY27E EPS near ₹3.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street is split: Buy at MOSL and Axis, Sell at BofA, Bernstein and ICICI; targets ₹320-520`,
  blocks: [
    { p: `Only three houses published after the Q1FY27 results that we could find by ${ASOF_TXT}: Motilal Oswal (Buy, ₹520, 6-Aug; SOTP with biosimilars at 22x EV/EBITDA, generics 10x, Syngene at market less 15%), BofA Securities (downgrade to Sell, ₹410, 10-Aug) and Axis Securities (Buy, ₹424, 19-Sep; SOTP). Older notes still standing include Nuvama (Buy, ₹480, SOTP: biosimilars 20x, generics 9x, Syngene 22x), JM Financial (Buy, ₹476, SOTP), Geojit (Accumulate, ₹439), ICICI Direct (Sell, ₹350), Citi (Sell, ₹360), ICICI Securities (Sell, ₹320) and Bernstein (Underperform, ₹326). The median of the ${withTp.length} targets is ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ₹${n0(price)} close. Everyone who discloses a method uses a sum of the parts with biosimilars on EV/EBITDA; the disagreement is about the launch ramp and how much to pay for it. The stock fell from ₹437 before the Q1 results to ₹${n0(price)} on ${ASOF_TXT}.` },
    { exhibit: { type: 'table', title: 'Bulls, bears and our view', head: ['Argument'], rows: D.critiques.map(c => [rup(c)]), source: 'Broker notes as listed in the valuation chapter; GAM Research' } },
  ],
};

module.exports = { forecasts, street };
