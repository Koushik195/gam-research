// Bajaj Auto report, part 3b: our standalone forecasts against the street (estimates standing on 30-Sep-2026).
const X = require('./BAJAJ-AUTO.ctx');
const { n0, n1, SAF, SAEPS, withEps, avgEps, avgOf, epsAdj, shortDate } = X;
const gap = (g, s) => Math.round((g / s - 1) * 100);
const mPct = (s, y) => (s.ebitda?.[y] && s.sales?.[y] ? n1(s.ebitda[y] / s.sales[y] * 100) + '%' : '–');
const ourM = i => n1(SAF.base[i].ebitda / SAF.base[i].rev * 100) + '%';

const vsStreet = [
  { exhibit: { type: 'table', title: 'GAM vs the street: standalone estimates standing on 30-Sep-2026', head: ['Broker (date)', 'EPS FY27E', 'EPS FY28E', 'Revenue FY27E (₹ cr)', 'Revenue FY28E (₹ cr)', 'EBITDA margin FY27E / FY28E'], rows: [
    ...withEps.map(s => [`${s.broker} (${shortDate(s.date)})`, n1(s.eps.FY27E * epsAdj(s)), n1(s.eps.FY28E * epsAdj(s)), n0(s.sales.FY27E), n0(s.sales.FY28E), `${mPct(s, 'FY27E')} / ${mPct(s, 'FY28E')}`]),
    ['Average of the five', n1(avgEps('FY27E')), n1(avgEps('FY28E')), n0(avgOf('sales', 'FY27E')), n0(avgOf('sales', 'FY28E')), ''],
    { hl: true, cells: ['**GAM Research**', `**${n1(SAEPS[0])}**`, `**${n1(SAEPS[1])}**`, `**${n0(SAF.base[0].rev)}**`, `**${n0(SAF.base[1].rev)}**`, `**${ourM(0)} / ${ourM(1)}**`] },
  ], source: 'Broker notes (21-26 Jul 2026, PDFs). EPS on ~274.8 mn post-buyback shares; PL\'s EPS (279.5 mn shares) restated to that count. We found no consensus EPS dated after the Q1FY27 results and before 30-Sep-2026.' } },
  { callout: `Our standalone EPS is ${Math.abs(gap(SAEPS[0], avgEps('FY27E')))}% ${SAEPS[0] >= avgEps('FY27E') ? 'above' : 'below'} the five-broker average for FY27E and ${Math.abs(gap(SAEPS[1], avgEps('FY28E')))}% ${SAEPS[1] >= avgEps('FY28E') ? 'above' : 'below'} for FY28E: revenue in line (export-led), margin a little lower (${ourM(0)} vs 20.7-21.0%) because we expect Q2's broader inflation to bite and the rupee tailwind to stop growing. Consolidated EPS ({{F.eps.0|n1}} / {{F.eps.1|n1}} on the FY26 count) adds BACL's ~₹970-1,240 cr of profit and KTM moving towards profit; the street mostly does not forecast consolidated numbers.` },
];

module.exports = { vsStreet };
