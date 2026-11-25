// Jubilant FoodWorks context, part 2: QSR peers and the sector move (EV/EBITDA, five-year), the retail set for the P/E
// cross-check, derived multiples (checked against assumptions.json unless JUBLFOOD_NOCHECK=1, which JUBLFOOD.val.js uses
// while syncing), SOTP checks (minorities), the street table and the rating. Called from JUBLFOOD.ctx.js.
const fs = require('fs');
const path = require('path');

module.exports = (X, L) => {
  const { ROOT, ASOF, WIN5, D, F, V, AS, SC, HEV, HEV24, HPE, price, shares, medOf, half, n1, sep, YRS, yi, SEG } = X;
  const scr = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
  const medFrom = (sym, chart, key, from) => { const v = (scr(sym).charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= from && x > 0).map(x => x[1]); return v.length ? medOf(v) : null; };
  const QSR = D.peers.set, EXCL = Object.keys(D.peers.excluded), USED = QSR.filter(s => !EXCL.includes(s)), RET = D.peers.retail;
  const ALL = ['JUBLFOOD', ...QSR, ...RET], PEERS = L.peersAsOf(['JUBLFOOD', ...QSR], ASOF), P = Object.fromEntries(L.peersAsOf(ALL, ASOF).map(p => [p.symbol, p]));
  const MED5EV = {}, MED5PE = {}, MED24EV = {}, dr5Ev = {}, dr5Pe = {}, dr24Ev = {};
  ALL.forEach(s => { MED5EV[s] = medFrom(s, 'evEbitda', 'EV Multiple', WIN5); MED5PE[s] = medFrom(s, 'pe', 'Price to Earning', WIN5); MED24EV[s] = medFrom(s, 'evEbitda', 'EV Multiple', '2024-04-01');
    dr5Ev[s] = P[s].evEbitda > 0 && MED5EV[s] ? (P[s].evEbitda / MED5EV[s] - 1) * 100 : null; dr5Pe[s] = P[s].pe > 0 && MED5PE[s] ? (P[s].pe / MED5PE[s] - 1) * 100 : null;
    dr24Ev[s] = P[s].evEbitda > 0 && MED24EV[s] ? (P[s].evEbitda / MED24EV[s] - 1) * 100 : null; });
  const evCount = s => (scr(s).charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= WIN5 && d <= ASOF && x > 0).length;
  const sectorEv = medOf(USED.map(s => dr5Ev[s])), sectorPeRet = medOf(RET.map(s => dr5Pe[s]));
  const sens = { withRba: medOf(QSR.map(s => dr5Ev[s])), retailEv: medOf(RET.map(s => dr5Ev[s])), qsr24: medOf(USED.map(s => dr24Ev[s])), exDevyani: medOf(USED.filter(s => s !== 'DEVYANI').map(s => dr5Ev[s])) };
  const kEv = 1 + sectorEv / 100, kPe = 1 + sectorPeRet / 100;
  const shortName = s => ({ JUBLFOOD: 'Jubilant FoodWorks', WESTLIFE: 'Westlife (McDonald\'s W&S)', DEVYANI: 'Devyani (KFC, Pizza Hut)', SAPPHIRE: 'Sapphire (KFC, Pizza Hut)', RBA: 'Restaurant Brands Asia (Burger King)', DMART: 'DMart', TRENT: 'Trent', METROBRAND: 'Metro Brands', BATAINDIA: 'Bata India', PAGEIND: 'Page Industries' }[s] || s);

  // Derived multiples (nearest half-turn): base = own median x sector move; bull = 75th percentile x move; bear = 25th x move (INDHOTEL)
  const evMULT = { base: half(HEV.med * kEv), bull: half(HEV.p75 * kEv), bear: half(HEV.p25 * kEv) };
  const peMULT = { base: half(HPE.med * kPe), bull: half(HPE.p75 * kPe), bear: half(HPE.p25 * kPe) };
  const evALT = { since24: half(HEV24.med * (1 + sens.qsr24 / 100)), withRba: half(HEV.med * (1 + sens.withRba / 100)), retail: half(HEV.med * (1 + sens.retailEv / 100)), noMove: half(HEV.med), exDev: half(HEV.med * (1 + sens.exDevyani / 100)) };
  const VP = AS.valuation.parts, part = re => VP.find(p => re.test(p.name)), pm = AS.valuation.blend.methods.find(m => m.key === 'pe').multiple;
  if (process.env.JUBLFOOD_NOCHECK !== '1') {
    for (const re of [/^India/, /^International/]) { const m = part(re).multiple; if (m.base !== evMULT.base || m.bull !== evMULT.bull || m.bear !== evMULT.bear) throw new Error(`JUBLFOOD EV/EBITDA not derived: ${JSON.stringify(evMULT)} vs ${JSON.stringify(m)}`); }
    if (pm.base !== peMULT.base || pm.bull !== peMULT.bull || pm.bear !== peMULT.bear) throw new Error(`JUBLFOOD P/E not derived: ${JSON.stringify(peMULT)} vs ${JSON.stringify(pm)}`);
  }
  // SOTP: minorities = share of profit x equity value before them (case by case), set by JUBLFOOD.val.js
  const mShare = AS.minorities.sharePct / 100, sepSeg = (Fx, k) => (Fx.seg[k].adjEbitda[yi('FY28E')] + Fx.seg[k].adjEbitda[yi('FY29E')]) / 2;
  const minFor = (Fx, mult) => { const ev = (sepSeg(Fx, 'india') + sepSeg(Fx, 'intl')) * mult, nc = (Fx.treasury[yi('FY28E')] + Fx.treasury[yi('FY29E')]) / 2; return -Math.round(mShare * (ev + nc)); };
  const ebitdaSep28 = sep(F.ebitda), netCashSep28 = sep(F.treasury);
  const SP = V.sotp?.parts || [], spart = re => SP[VP.findIndex(p => re.test(p.name))];
  const evAt = mult => ((ebitdaSep28 * mult + netCashSep28) * (1 - mShare)) / shares;
  const preMultAt = tp => (tp * shares / (1 - mShare) - netCashSep28 - X.leases) / X.preSep28; // target on the street's basis (EV ex leases, after-rent EBITDA)
  const streetAtOurs = mult => (mult * X.preSep28 + netCashSep28 + X.leases) * (1 - mShare) / shares;

  const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
  const rating = L.ratingFor(V.upside), buyBelow = Math.round(L.buyAt(V.tp) / 5) * 5, sellAbove = Math.round(L.sellAt(V.tp) / 5) * 5;
  // Street as it stood on 30-Sep-2026 (latest dated note per broker)
  const ST = (D.street?.brokers || []).filter(s => s.date <= ASOF), latest = ST.filter(s => s.tp && !s.exclMedian), post = latest.filter(s => s.postQ1);
  const medAll = latest.length ? medOf(latest.map(s => s.tp)) : null, medTp = post.length ? medOf(post.map(s => s.tp)) : medAll;
  const nBuy = post.filter(s => /Buy|Outperform|Overweight|Add|Accumulate/i.test(s.rating)).length;
  return { QSR, EXCL, USED, RET, PEERS, P, MED5EV, MED5PE, MED24EV, dr5Ev, dr5Pe, dr24Ev, evCount, sectorEv, sectorPeRet, sens, kEv, kPe, shortName, evMULT, peMULT, evALT,
    VP, part, mShare, minFor, ebitdaSep28, netCashSep28, spart, evAt, preMultAt, streetAtOurs, BM, mv, rating, buyBelow, sellAbove, ST, latest, post, medAll, medTp, nBuy };
};

if (require.main === module) {
  process.env.JUBLFOOD_NOCHECK = process.env.JUBLFOOD_NOCHECK || '0';
  const X = require('./JUBLFOOD.ctx');
  const { n0, n1, pc1, HEV, HEV24, HPE, FM, evNow, evSepNow, indiaRows, preEbitda, preEbitda26, preSep28, ebitdaSep28 } = X;
  console.log('india', indiaRows.map(r => [r.y, r.stores, r.rps.toFixed(3), n0(r.dom), n0(r.em), r.g.toFixed(2)]), 'pre', preEbitda.map(n0), n0(preEbitda26), n0(preSep28));
  console.log('HEV', HEV, 'HEV24', HEV24, 'trough', X.troughEv, 'evNow', n1(evNow), 'evSepNow', n1(evSepNow), 'HPE', HPE, 'FM', FM.median, FM.troughYears, 'epsBei', X.epsBei);
  console.log('dr5Ev', Object.entries(X.dr5Ev).map(([s, v]) => `${s} ${v == null ? 'na' : v.toFixed(1)}`).join(', '), '| sectorEv', X.sectorEv.toFixed(2), 'pe(ret)', X.sectorPeRet.toFixed(2), 'sens', JSON.stringify(X.sens), 'counts', X.QSR.map(s => s + ':' + X.evCount(s)).join(' '));
  console.log('evMULT', X.evMULT, 'peMULT', X.peMULT, 'evALT', X.evALT, 'tp', X.V.tp, X.V.upside.toFixed(1), X.rating, 'methods', X.BM.map(m => [m.key, Math.round(m.value)]), 'scen', X.SC.bull.tp, X.SC.bear.tp, 'eps', X.F.eps.map(v => v.toFixed(2)));
  console.log('preMultAtTP', n1(X.preMultAt(X.V.tp)), 'evSep28', n0(ebitdaSep28), 'medTp', X.medTp, 'nPost', X.post.length, 'buy<', X.buyBelow, 'sell>', X.sellAbove, 'sotp', (X.V.sotp?.parts || []).map(p => [p.name.slice(0, 14), Math.round(p.value)]));
}
