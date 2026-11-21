// Aditya Birla Capital initiation: shared context, part 3. Group-level cross-checks on the CONSOLIDATED basis
// (the street's EPS and book): ABCL's own one-year-forward P/B and P/E history from Apr-2021 (consolidated
// Screener file saved before the switch to standalone; our consolidated rebuild for FY27E-FY29E), justified P/B on
// consolidated ROE, and the engine's standalone floors. forwardSeries() cannot be used here: it reads the standalone
// screener.json, whose pre-merger years are the old holding company. As of 30-Sep-2026.
const X = require('./ABCAPITAL.ctx2');
const { CS, CONS, consEq, F, V, SB, price, ASOF, med, mv, S, AS } = X;
const pl = CS.tables['profit-loss'], bs = CS.tables['balance-sheet'];
const fyOfP = p => +p.slice(-4);
// Consolidated BVPS (owners' equity ÷ shares) and EPS by fiscal year; FY27E-FY29E from our rebuild.
const bvBy = {}, epsBy = {}, epsExBy = {};
bs.periods.forEach((p, i) => { if (/^Mar/.test(p)) { const cap = bs.rows['Equity Capital'][i]; bvBy[fyOfP(p)] = (cap + bs.rows.Reserves[i]) / (cap / 10); } });
pl.periods.forEach((p, i) => { if (/^Mar/.test(p)) epsBy[fyOfP(p)] = pl.rows['EPS in Rs'][i]; });
// EPS before one-offs (company 'PAT excluding one-offs'): FY23 ₹2,057 cr ex the ₹2,739 cr ABHI fair-value gain; FY24 ₹2,902 cr
// and FY25 ₹3,142 cr ex AMC share-sale gains; FY26 ₹3,797 cr ex the labour-code charge (q4fy23ppt p5, q4ppt p6).
Object.assign(epsExBy, epsBy, { 2023: epsBy[2023] * 2057 / 4796, 2024: epsBy[2024] * 2902 / 3335, 2025: epsBy[2025] * 3142 / 3332, 2026: X.C.consolidated.FY26.eps * 3797 / 3764.49 });
delete bvBy[2027]; F.years.forEach((y, i) => { const fy = 2000 + +y.slice(2, 4); bvBy[fy] = CONS[i].bvps; epsBy[fy] = CONS[i].eps; epsExBy[fy] = CONS[i].eps; });
const PX = X.fs ? JSON.parse(X.fs.readFileSync(X.path.join(X.ROOT, 'data', 'raw', 'ABCAPITAL', 'screener.json'), 'utf8')).charts.price.Price : [];
const fwdFy = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const series = (by, from = '2021-04-01') => { const s = PX.filter(([d]) => d >= from && d <= ASOF).map(([d, p]) => [d, by[fwdFy(d)] > 0 ? p / by[fwdFy(d)] : null]).filter(x => x[1] != null);
  if (s.length && s.at(-1)[0] < ASOF) s.push([ASOF, price / by[fwdFy(ASOF)]]); return s; };
const stat = s => { const v = s.map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const cPb = series(bvBy), cPe = series(epsExBy), cPeRep = series(epsBy);
const CPB = stat(cPb), CPE = stat(cPe), CPE_REP = stat(cPeRep), CPB2y = stat(cPb.filter(x => x[0] >= '2024-10-01'));
const r1 = v => Math.round(v * 10) / 10;
const cPbChart = cPb.filter((_, i) => i % 5 === 0 || i === cPb.length - 1).map(([d, v]) => [d, r1(v)]);
const cBv28 = (CONS[1].bvps + CONS[2].bvps) / 2, cEps28 = (CONS[1].eps + CONS[2].eps) / 2;
const cFwdPbNow = price / CONS[1].bvps, cFwdPeNow = price / CONS[1].eps, cPbFy27 = price / CONS[0].bvps, cPeFy27 = price / CONS[0].eps;
const ccPb = { mult: r1(CPB.med), value: r1(CPB.med) * cBv28 }, ccPe = { mult: Math.round(CPE.med), value: Math.round(CPE.med) * cEps28 };
// Justified P/B on consolidated ROE (Gordon): long-run group ROE 14% (FY29E rebuild 14.1%), Ke and g as in the engine
const ke = V.ke, g = AS.valuation.g, cRoeLR = 14, cJpb = (cRoeLR - g) / (ke - g), cJpbValue = cJpb * (CONS[0].bvps + CONS[1].bvps) / 2;
const cImpliedRoe = g + (price / ((CONS[0].bvps + X.consBvps26) / 2)) * (ke - g); // ROE the price implies on ~current book (Gordon)
const CROSS = [
  { key: 'cpb', name: 'Group P/B: own forward median', basis: `Consolidated Sep-28E BVPS ₹${r1(cBv28)}`, mult: `${ccPb.mult}x`, value: ccPb.value },
  { key: 'cpe', name: 'Group P/E: own forward median (ex one-offs)', basis: `Consolidated Sep-28E EPS ₹${r1(cEps28)}`, mult: `${ccPe.mult}x`, value: ccPe.value },
  { key: 'gross', name: 'SOTP before the holding discount', basis: 'Look-through value at our multiples', mult: '–', value: SB.grossPs },
  { key: 'cjpb', name: 'Justified P/B, consolidated', basis: `(${cRoeLR} − ${g}) ÷ (${r1(ke)} − ${g}) on Sep-27E group book`, mult: `${(Math.round(cJpb * 100) / 100).toFixed(2)}x`, value: cJpbValue },
  { key: 'sjpb', name: 'Justified P/B, standalone (subs at cost)', basis: 'Engine cross-check: a floor', mult: `${(Math.round(mv('jpb').mult * 100) / 100).toFixed(2)}x`, value: mv('jpb').value },
  { key: 'sri', name: 'Residual income, standalone (subs at cost)', basis: 'Engine cross-check: a floor', mult: '–', value: mv('ri').value },
];
CROSS.forEach(c => (c.vsTarget = (c.value / V.tp - 1) * 100));

module.exports = { ...X, bvBy, epsBy, epsExBy, cPb, cPe, CPB, CPE, CPE_REP, CPB2y, cPbChart, cBv28, cEps28, cFwdPbNow, cFwdPeNow, cPbFy27, cPeFy27, ccPb, ccPe, cRoeLR, cJpb, cJpbValue, cImpliedRoe, CROSS };

if (require.main === module) {
  console.log('bv', JSON.stringify(Object.fromEntries(Object.entries(bvBy).map(([k, v]) => [k, r1(v)]))), 'epsEx', JSON.stringify(Object.fromEntries(Object.entries(epsExBy).map(([k, v]) => [k, r1(v)]))));
  console.log('CPB', JSON.stringify(CPB), 'CPB2y', JSON.stringify(CPB2y), 'CPE', JSON.stringify(CPE), 'CPErep', JSON.stringify(CPE_REP));
  console.log('now fwd P/B', r1(cFwdPbNow), 'fwd P/E', r1(cFwdPeNow), 'FY27 P/B', r1(cPbFy27), 'P/E', r1(cPeFy27), 'cBv28', r1(cBv28), 'cEps28', r1(cEps28));
  CROSS.forEach(c => console.log(c.name, c.mult, Math.round(c.value), r1(c.vsTarget)));
  console.log('impliedRoe', r1(cImpliedRoe), 'cJpb', cJpb.toFixed(2));
}
