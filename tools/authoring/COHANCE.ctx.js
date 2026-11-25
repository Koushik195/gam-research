// Cohance Lifesciences initiation: shared context for the Part B files (research.js, part2-6). Merges COHANCE.ctxA.js (builds) and
// COHANCE.ctxB.js (valuation history and factors) and adds the checks (assumptions = builds and derivation; target = P/E value), a
// reverse-DCF test, the sensitivity rows, the rating from the house rule and the street as it stood on 30-Sep-2026.
// Usage: node tools/authoring/COHANCE.ctx.js (prints every derived number).
const X = require('./COHANCE.ctxB');
const { D, F, V, A, AS, SC, n0, n1, n2, pc1, half, medOf, cagr, b, ai, sep, price, SHARES, MULT, EVM, HB, HREP, HMRG, HF28, HSUV, FM, k, km, kev, SECTOR, SECTOR_M, sectorK, epsU, ratingFor, buyAt, sellAt, oiOk, oiBuild, intOk, intBuild, taxOk, taxBuild } = X;

// 1) Checks: assumptions = builds and derivation; engine P/E value = multiple x Sep-28E EPS; target = rounded P/E value
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
const multOk = same(PEM.multiple, MULT), evOk = same(EVA.multiple, EVM);
const epsSep28 = mv('pe').metric;
if (!process.env.TP_NOCHECK) {
  if (!oiOk) throw new Error(`COHANCE other income: build ${oiBuild} vs assumptions ${AS.otherIncome}; run TP_NOCHECK=1 node tools/authoring/COHANCE.mult.js`);
  if (!intOk) throw new Error(`COHANCE interest: build ${intBuild.map(x => x.toFixed(2))} vs assumptions ${AS.interest}; run COHANCE.mult.js`);
  if (!taxOk) throw new Error(`COHANCE tax+minorities: build ${taxBuild} vs assumptions ${AS.taxRate}; run COHANCE.mult.js`);
  if (!multOk || !evOk) throw new Error(`COHANCE: assumptions multiples differ from the derivation (P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}); run COHANCE.mult.js`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'pe').value; if (tp !== Math.round(pv / 10) * 10) throw new Error(`COHANCE ${c} target ${tp} is not the P/E value ${Math.round(pv)}`); });
}

// 2) Reverse-DCF test (same mechanics as src/forecast.js dcf(), flat growth FY28-41E): growth the price needs
const DC = AS.dcf, tTax = AS.taxRate[2] / 100, ke = V.ke;
const dcfAt = (g, mTo = DC.fadeMarginTo) => { let s = F.sales[0], pv = 0, last = null; const n = DC.years;
  for (let kk = 1; kk <= n; kk++) { const sF = (kk - 3 + 1) / (n - 3 + 1); const m = kk < 3 ? F.ebitdaMargin[kk] : F.ebitdaMargin[2] + (mTo - F.ebitdaMargin[2]) * sF; const cx = kk < 3 ? F.capex[kk] / F.sales[kk] * 100 : F.capex[2] / F.sales[2] * 100 + (DC.fadeCapexPctTo - F.capex[2] / F.sales[2] * 100) * sF;
    s *= 1 + g / 100; const e = s * m / 100, dep = s * DC.depPctOfSales / 100, f = (e - dep) * (1 - tTax) + dep - s * cx / 100 - F.owcPct / 100 * s * (g / (100 + g)); pv += f / Math.pow(1 + ke / 100, kk - 0.5); last = f; }
  const tv = last * (1 + DC.terminalGrowth / 100) / ((ke - DC.terminalGrowth) / 100) / Math.pow(1 + ke / 100, n);
  return (pv + tv + F.treasury[0]) / SHARES * Math.pow(1 + ke / 100, 0.5); };
const solveG = mTo => { let lo = 0, hi = 60; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (dcfAt(mid, mTo) < price) lo = mid; else hi = mid; } return (lo + hi) / 2; };
const gNeeded = solveG(DC.fadeMarginTo), gNeeded30 = solveG(30), dcfAt15 = dcfAt(15);

// 3) Sensitivity rows (not used in the base)
const peV = (m, e) => Math.round(m * e / 10) * 10;
const epsCagr = cagr(A.eps[b], epsU[2], 3), salesCagr = cagr(A.sales[b], F.sales[2], 3), ebitdaCagr = cagr(A.ebitda[b], F.ebitda[2], 3);
const SENS = [
  { name: `House base: median since 1-Apr-2021 (EPS before exceptional items; trough years FY26-FY28 left out) × ${k.toFixed(3)}`, mult: MULT.base, why: `${n1(HB.med)}x × ${k.toFixed(3)}` },
  { name: 'Reported EPS (incl. exceptional items), same window and trough rule', mult: half(HREP.med * k), why: `${n1(HREP.med)}x × ${k.toFixed(3)}` },
  { name: "Suven's own FY25 EPS as first reported (₹10.40) for the Apr-23 to Mar-24 points", mult: half(HSUV.med * k), why: `${n1(HSUV.med)}x × ${k.toFixed(3)}` },
  { name: 'House forwardMedian (every 5th week, Screener EPS incl. the pre-merger FY25 ₹19.14)', mult: FM.median ? half(FM.median * k) : null, why: FM.median ? `${n1(FM.median)}x × ${k.toFixed(3)}; trough years ${FM.troughYears.join(', ')}` : 'no non-trough points' },
  { name: `Post-merger window from 1-May-2025, trough years kept (every point is a trough year) × ${km.toFixed(3)}`, mult: half(HMRG.med * km), why: `${n1(HMRG.med)}x × ${km.toFixed(3)}: not usable` },
  { name: `Post-merger FY28E points only (Apr-Sep 2026), trough rule waived, × the merger-window move ${pc1(SECTOR_M)}`, mult: half(HF28.med * km), why: `${n1(HF28.med)}x × ${km.toFixed(3)}` },
  { name: `Same, × the peers' move over Apr-Sep 2026 itself (${pc1(sectorK)})`, mult: half(HF28.med * (1 + sectorK / 100)), why: `${n1(HF28.med)}x × ${(1 + sectorK / 100).toFixed(3)}` },
  { name: 'No sector factor (own median only)', mult: half(HB.med), why: `${n1(HB.med)}x` },
  { name: `Growth view: PEG 2.0x on our FY26-29E EPS growth (${n1(epsCagr)}% a year from a collapsed base; not house policy)`, mult: half(2.0 * epsCagr), why: `2.0 × ${n1(epsCagr)}` },
  { name: 'Street P/E user: BOBCAPS 40x Jun-28E (applied to our Sep-28E EPS)', mult: 40, why: 'BOBCAPS, 10-Aug-2026' },
].map(r => ({ ...r, tp: r.mult ? peV(r.mult, epsSep28) : null, up: r.mult ? (r.mult * epsSep28 / price - 1) * 100 : null }));
const implPeAtPrice = price / epsSep28;

// 4) Rating from the house rule; street as it stood on 30-Sep-2026
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, br = n => ST.find(s => s.broker.startsWith(n));
const withTp = ST.filter(s => s.tp), medTp = medOf(withTp.map(s => s.tp));
const bob = br('BOB'), icici = br('ICICI'), jef = br('Jefferies'), gs = br('Goldman'), mac = br('Macquarie');
const CONS = { FY27E: 5.00, tpAvg: 510.5, tpMed: 460 };
const gapBob = ['FY27E', 'FY28E', 'FY29E'].map((y, i) => (epsU[i] / bob.eps[y] - 1) * 100);

module.exports = { ...X, BM, mv, multOk, evOk, epsSep28, dcfAt, gNeeded, gNeeded30, dcfAt15, peV, epsCagr, salesCagr, ebitdaCagr, SENS, implPeAtPrice, rating, buyBelow, sellAbove, ST, br, withTp, medTp, bob, icici, jef, gs, mac, CONS, gapBob };

if (require.main === module) {
  const Z = module.exports;
  console.log('build', Z.buildTot.map(n0), 'model', F.sales.map(n0), 'standalone EBITDA', Z.standaloneEbitda.map(n0), 'NJ pbt', Z.njPbt, 'SP pat', Z.spPat.map(n1));
  console.log('tax+NCI', Z.taxBuild, 'vs', AS.taxRate, taxOk, Z.ent.map(e => `tax ${n1(e.tax)} nci ${n1(e.nci)} owners ${n1(e.owners)}`).join(' | '), 'FY26 eff', n1(Z.eff26));
  console.log('cash path', Z.cashPath.map(n0), 'gross', Z.grossPath.map(n0), 'OI', oiBuild, 'vs', AS.otherIncome, oiOk, 'yld26', n1(Z.yld26), 'Q1', n1(Z.yldQ1), 'TTM', n1(Z.ttmOi));
  console.log('interest', intBuild.map(x => x.toFixed(2)), 'vs', AS.interest, intOk);
  console.log('EPS', epsU.map(n2), 'Sep28', n2(epsSep28), 'CAGR', n1(epsCagr), 'vs BOB', Z.gapBob.map(n1));
  console.log('HB', JSON.stringify(HB), 'HREP', JSON.stringify(HREP), 'trough', Z.troughYrs, 'HMRG', JSON.stringify(HMRG), 'HF28', JSON.stringify(HF28), 'HSUV', n1(HSUV.med), 'FM', FM.median, FM.medianAll, FM.troughYears);
  console.log('byFY', Object.entries(Z.HFY).map(([y, h]) => `${y}: n${h.n} med ${h.med} eps ${n2(h.eps)} line ${n2(h.line)} ${h.trough ? 'T' : ''}`).join(' | '));
  console.log('factors 5y', Z.sector5.toFixed(2), Z.sector5Ev.toFixed(2), 'merger', Z.sectorM.toFixed(2), Z.sectorMEv.toFixed(2), 'kept', sectorK.toFixed(2));
  console.log('EV hist', JSON.stringify(Z.EVH), 'EVM', JSON.stringify(EVM), 'EV now fwd', n1(Z.evNowFwd));
  console.log('MULT', MULT, 'ok?', multOk, evOk, '| TP', V.tp, V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'bull', SC.bull.tp, 'bear', SC.bear.tp, 'intrinsic', V.intrinsicTp);
  console.log('gNeeded', n1(gNeeded), 'at 30% margin', n1(Z.gNeeded30), 'dcf@15', n0(Z.dcfAt15), 'fwd P/E now', n1(Z.fwdNow), 'FY27', n1(Z.peFY27), 'Sep28', n1(Z.peSep), 'trail', n1(Z.trailPe));
  console.log('SENS', SENS.map(r => `${r.name}: ${r.mult}x ${r.tp}`).join(' | '));
  console.log('street med', medTp, 'impl P/E', n1(implPeAtPrice), 'buyBelow', Z.buyBelow, 'sellAbove', Z.sellAbove);
}
