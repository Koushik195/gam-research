// ONGC report, part B-5: our forecasts vs the street, and the street's view and critiques.
const X = require('./ONGC.ctx');
const { C, D, F, AS, A, n0, n1, price, sh, STR, current, medTp, build, CP, coreSepEps } = X;
const b = A.labels.length - 1, B = AS.build;
const rup = s => String(s).replace(/Rs ?(?=[0-9])/g, '₹');
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dt = d => `${+d.slice(8)}-${MON[+d.slice(5, 7) - 1]}-${d.slice(2, 4)}`;

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Forecasts', title: 'Our forecasts: standalone EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}} (FY27-29E)',
  blocks: [
    { p: `We build revenue from volumes, Brent, the rupee and the gas price, and costs from royalty, cess, operating costs and exploration write-offs (assumptions in the Excel model). FY27E carries one quarter at ~US$97-98 Brent already booked and the EIA path for the rest; FY28E assumes US$${B.brent[1]}, close to the street's US$70-75.` },
    { exhibit: { type: 'table', title: 'Revenue and EBITDA build (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Crude revenue', n0(B.base.crudeRev), ...build.map(r => n0(r.crude))],
      ['Gas revenue', n0(B.base.gasRev), ...build.map(r => n0(r.gas))],
      ['Value-added products and other', n0(11879 + 490), ...build.map(r => n0(r.vap + r.oth))],
      { hl: true, cells: ['**Revenue**', `**${n0(A.sales[b])}**`, ...build.map(r => `**${n0(r.rev)}**`)] },
      ['Royalty + cess + other levies', n0(12965 + 13034 + 63), ...build.map(r => n0(r.levies))],
      ['Operating costs', '28,209', ...build.map(r => n0(r.opex))],
      ['Exploration write-offs', '9,729', ...build.map(r => n0(r.expl))],
      ['Provisions, FX and other', '6,702', ...build.map(r => n0(r.other))],
      { hl: true, cells: ['**EBITDA**', `**${n0(A.ebitda[b])}**`, ...build.map(r => `**${n0(r.ebitda)}**`)] },
    ], source: 'ONGC AR FY26; Screener.in; GAM estimates' } },
    { exhibit: { type: 'table', title: 'Standalone forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue', n0(A.sales[b]), '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}'],
      ['EBITDA margin', `${n1(A.ebitda[b] / A.sales[b] * 100)}%`, '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}'],
      ['Depreciation and depletion', n0(A.dep[b]), '{{F.dep.0|num}}', '{{F.dep.1|num}}', '{{F.dep.2|num}}'],
      ['Other income (incl. dividends)', n0(A.otherIncome[b]), '{{F.otherIncome.0|num}}', '{{F.otherIncome.1|num}}', '{{F.otherIncome.2|num}}'],
      ['Profit before tax', n0(A.pbt[b]), '{{F.pbt.0|num}}', '{{F.pbt.1|num}}', '{{F.pbt.2|num}}'],
      { hl: true, cells: ['**Net profit**', `**${n0(A.pat[b])}**`, '**{{F.pat.0|num}}**', '**{{F.pat.1|num}}**', '**{{F.pat.2|num}}**'] },
      ['EPS (₹)', n1(A.eps[b]), '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}'],
      ['DPS (₹)', '13.25', '{{F.dps.0|n1}}', '{{F.dps.1|n1}}', '{{F.dps.2|n1}}'],
      ['Memo: core profit (ex dividends, normalised tax)', n0(X.coreNorm.FY26), ...CP.base.map(r => n0(r.core))],
    ], source: 'Screener.in (FY26); GAM estimates' } },
    { p: `**Against the street.** Broker EPS on 30-Sep-2026 is mostly consolidated, so it is not comparable with ours: JM ₹38.6 / ₹39.2 (FY27-28E, consolidated), BOB ₹40.3 / ₹40.5, PL ₹38.2 / ₹41.5 (consolidated). The comparable numbers are standalone: PL expects FY27E standalone PAT of ~₹51,160 cr (EPS ~₹40.7) against our ₹{{F.pat.0|num}} cr (PL's quarterly revenue path is close to ours; the gap is below EBITDA and its note does not split it); Geojit ₹40.2 / ₹33.1; JM's FY28E standalone core EPS (before dividends) is ₹29.2, close to our ₹${n1(CP.base[1].core / sh)} (Sep-28E ₹${n1(coreSepEps('base'))}). **Our earnings are in line with the street for FY28E; the difference in our target is the multiple, not the profit.**` },
  ],
};

const streetRows = STR.map(s => [s.broker, s.rating, s.tp ? n0(s.tp) : 'n.d.', rup(s.method), s.earningsYear, dt(s.date), s.standing]);
const street = {
  id: 'street', nav: 'Street view & critiques', kicker: 'Street view', title: `The street: mostly Buy, median target ₹${n0(medTp)} on 30-Sep-2026`,
  blocks: [
    { p: rup(`${D.street.coverage} ${D.street.method} ${D.street.assumptions}`) },
    { exhibit: { type: 'table', title: 'Broker notes we found (dated on or before 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Year', 'Date', 'Standing on 30-Sep-2026'], wide: [3], rows: streetRows, source: 'Broker PDFs (JM, BOB Caps, PL, Geojit, Kotak one-pager), DSIJ (MOSL), Trendlyne (ICICI Sec), stockanalysis.com and Investing.com (target-only rows), Business Today and others (older views)' } },
    { p: `The ${current.length} targets set in Jul-Sep 2026 range from ₹${n0(Math.min(...current.map(s => s.tp)))} (JP Morgan) to ₹${n0(Math.max(...current.map(s => s.tp)))} (ICICI Securities); median ₹${n0(medTp)}. S&P Global's consensus of 29 analysts averaged ₹287 (labelled 24-Sep-2026; it may include later changes). The street's SOTPs agree on earnings (JM's FY28E core EPS ₹29.2 is within 5% of ours) and differ on the multiple: 6.3-8x standalone earnings, which ONGC has rarely been paid in the market since 2021 (see Valuation). Two foreign brokers cut to Hold after Q1 (JP Morgan to ₹230, Nomura to ₹265).` },
    { h: 'What the bears and bulls argue' },
    { bullets: [
      ...D.critiques.map(c => `**Bear:** ${c}`),
      '**Bull:** no windfall tax was imposed in the 2026 spike, and royalty was cut: policy has turned friendlier to producers (JM, CLSA).',
      '**Bull:** gas volumes turn up from H2FY27 (DUDP, KG-98/2 gas, CPP), and new-well gas earns uncapped prices.',
      '**Bull:** a 6-8% dividend yield at our FY27-28E payout, and listed stakes worth ~35% of the market value.',
    ] },
  ],
};

module.exports = { forecasts, street };
