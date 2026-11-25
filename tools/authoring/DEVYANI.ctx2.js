// Devyani International context, part 2: QSR peers and the sector move (EV/EBITDA, five-year), derived multiples (checked
// against assumptions.json unless DEVYANI_NOCHECK=1, which DEVYANI.val.js uses while syncing), SOTP checks (minorities), the
// pro-forma Sapphire sensitivity, the street table and the rating. Called from DEVYANI.ctx.js.
const fs = require('fs');
const path = require('path');

module.exports = (X, L) => {
  const { ROOT, ASOF, WIN5, D, F, V, AS, SC, HEV, HEV22, HEV24, price, shares, medOf, half, sep, YRS, yi, SEG, phiSep } = X;
  const scr = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
  const medFrom = (sym, chart, key, from) => { const v = (scr(sym).charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= from && x > 0).map(x => x[1]); return v.length ? medOf(v) : null; };
  const QSR = D.peers.set, EXCL = Object.keys(D.peers.excluded), USED = QSR.filter(s => !EXCL.includes(s)), RET = D.peers.retail;
  const ALL = ['DEVYANI', ...QSR, ...RET], PEERS = L.peersAsOf(['DEVYANI', ...QSR], ASOF), P = Object.fromEntries(L.peersAsOf(ALL, ASOF).map(p => [p.symbol, p]));
  const MED5EV = {}, MED24EV = {}, MED22EV = {}, dr5Ev = {}, dr24Ev = {}, dr22Ev = {};
  ALL.forEach(s => { MED5EV[s] = medFrom(s, 'evEbitda', 'EV Multiple', WIN5); MED24EV[s] = medFrom(s, 'evEbitda', 'EV Multiple', '2024-04-01'); MED22EV[s] = medFrom(s, 'evEbitda', 'EV Multiple', '2022-04-01');
    const mv = m => (P[s].evEbitda > 0 && m ? (P[s].evEbitda / m - 1) * 100 : null); dr5Ev[s] = mv(MED5EV[s]); dr24Ev[s] = mv(MED24EV[s]); dr22Ev[s] = mv(MED22EV[s]); });
  const evCount = s => (scr(s).charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= WIN5 && d <= ASOF && x > 0).length;
  const sectorEv = medOf(USED.map(s => dr5Ev[s]));
  const sens = { withRba: medOf(QSR.map(s => dr5Ev[s])), exSapphire: medOf(USED.filter(s => s !== 'SAPPHIRE').map(s => dr5Ev[s])), retailEv: medOf(RET.map(s => dr5Ev[s])),
    qsr24: medOf(USED.map(s => dr24Ev[s])), qsr22: medOf(USED.map(s => dr22Ev[s])), widened: medOf([...USED, ...RET].map(s => dr5Ev[s])) };
  const kEv = 1 + sectorEv / 100;
  const shortName = s => ({ DEVYANI: 'Devyani (KFC, Pizza Hut)', JUBLFOOD: 'Jubilant FoodWorks (Domino\'s)', WESTLIFE: 'Westlife (McDonald\'s W&S)', SAPPHIRE: 'Sapphire (KFC, Pizza Hut)', RBA: 'Restaurant Brands Asia (Burger King)', DMART: 'DMart', TRENT: 'Trent', METROBRAND: 'Metro Brands', BATAINDIA: 'Bata India', PAGEIND: 'Page Industries' }[s] || s);

  // Derived multiples (nearest half-turn): base = own median x sector move; bull = 75th percentile x move; bear = 25th x move (INDHOTEL/JUBLFOOD)
  const evMULT = { base: half(HEV.med * kEv), bull: half(HEV.p75 * kEv), bear: half(HEV.p25 * kEv) };
  const evALT = { withRba: half(HEV.med * (1 + sens.withRba / 100)), exSap: half(HEV.med * (1 + sens.exSapphire / 100)), retail: half(HEV.med * (1 + sens.retailEv / 100)),
    widened: half(HEV.med * (1 + sens.widened / 100)), since22: half(HEV22.med * (1 + sens.qsr22 / 100)), since24: half(HEV24.med * (1 + sens.qsr24 / 100)), noMove: half(HEV.med) };
  // P/E cross-check: Devyani's own P/E history is unusable, so we test the thin earnings at Jubilant FoodWorks' derived forward P/E
  const JA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'JUBLFOOD', 'research', 'assumptions.json'), 'utf8'));
  const peMULT = { ...JA.valuation.blend.methods.find(m => m.key === 'pe').multiple };
  const VP = AS.valuation.parts, part = re => VP.find(p => re.test(p.name)), pm = AS.valuation.blend.methods.find(m => m.key === 'pe').multiple;
  if (process.env.DEVYANI_NOCHECK !== '1') {
    for (const re of [/^India/, /^International/]) { const m = part(re).multiple; if (m.base !== evMULT.base || m.bull !== evMULT.bull || m.bear !== evMULT.bear) throw new Error(`DEVYANI EV/EBITDA not derived: ${JSON.stringify(evMULT)} vs ${JSON.stringify(m)}`); }
    if (pm.base !== peMULT.base || pm.bull !== peMULT.bull || pm.bear !== peMULT.bear) throw new Error(`DEVYANI P/E cross-check not synced: ${JSON.stringify(peMULT)} vs ${JSON.stringify(pm)}`);
  }
  // SOTP: minorities = phi (minorities' share of group EBITDA) x equity value before them, per case (set by DEVYANI.val.js)
  const ebitdaSep28 = sep(F.ebitda), netCashSep28 = sep(F.treasury);
  const SP = V.sotp?.parts || [], spart = re => SP[VP.findIndex(p => re.test(p.name))];
  const evAt = mult => ((ebitdaSep28 * mult + netCashSep28) * (1 - phiSep)) / shares;
  const preMultAt = tp => (tp * shares / (1 - phiSep) - netCashSep28 - X.leases) / X.preSep28; // target on the street's basis (EV ex leases, after-rent EBITDA)
  const streetAtOurs = mult => (mult * X.preSep28 + netCashSep28 + X.leases) * (1 - phiSep) / shares;

  // Pro-forma merger sensitivity (not in the base): Sapphire's FY26 EBITDA grown at our consolidated EBITDA growth to Sep-28E,
  // at the same multiple, less its Mar-26 net debt incl. leases; 56.89 cr new shares (180.18 cr in all); synergies optional.
  const SS = scr('SAPPHIRE'), spl = SS.tables['profit-loss'], sbs = SS.tables['balance-sheet'], ci = spl.periods.indexOf('Mar 2026'), bi = sbs.periods.indexOf('Mar 2026');
  const sapEb26 = spl.rows['Operating Profit'][ci], sapNd26 = sbs.rows.Borrowings[bi] - sbs.rows.Investments[bi] - (SS.schedules?.['balance-sheet']?.['Other Assets']?.['Cash Equivalents']?.['Mar 2026'] || 0);
  const PF = { newShares: 180.18 - shares, total: 180.18, sapEbSep: sapEb26 * ebitdaSep28 / X.f26.ebitda, sapNd26 };
  // (a) Sapphire at its 30-Sep-2026 market value; (b) Sapphire at our multiple (upper bound). Synergies Rs210-225 cr (mid Rs217.5 cr) at our
  // multiple, less the ~Rs320 cr one-time fee to Yum!. Devyani at our base SOTP equity value.
  const eqDil = V.sotp.equity; PF.sapMkt = P.SAPPHIRE.mcapCr; PF.synVal = 217.5 * evMULT.base - 320;
  PF.mktNoSyn = (eqDil + PF.sapMkt) / PF.total; PF.mktSyn = (eqDil + PF.sapMkt + PF.synVal) / PF.total;
  PF.oursNoSyn = (eqDil + PF.sapEbSep * evMULT.base - sapNd26) / PF.total; PF.oursSyn = PF.oursNoSyn + PF.synVal / PF.total;
  PF.swapMkt = P.SAPPHIRE.price / price; PF.dilution = PF.newShares / shares * 100;

  const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
  const rating = L.ratingFor(V.upside), buyBelow = Math.round(L.buyAt(V.tp) / 5) * 5, sellAbove = Math.round(L.sellAt(V.tp) / 5) * 5;
  // Street as it stood on 30-Sep-2026 (latest dated note per broker)
  const ST = (D.street?.brokers || []).filter(s => s.date <= ASOF), latest = ST.filter(s => s.tp && !s.exclMedian), post = latest.filter(s => s.postQ1);
  const medAll = latest.length ? medOf(latest.map(s => s.tp)) : null, medTp = post.length ? medOf(post.map(s => s.tp)) : medAll;
  const nBuy = latest.filter(s => /Buy|Outperform|Overweight|Add|Accumulate/i.test(s.rating)).length;
  return { QSR, EXCL, USED, RET, PEERS, P, MED5EV, MED24EV, dr5Ev, dr24Ev, dr22Ev, evCount, sectorEv, sens, kEv, shortName, evMULT, evALT, peMULT,
    VP, part, ebitdaSep28, netCashSep28, spart, evAt, preMultAt, streetAtOurs, PF, BM, mv, rating, buyBelow, sellAbove, ST, latest, post, medAll, medTp, nBuy };
};

if (require.main === module) {
  process.env.DEVYANI_NOCHECK = process.env.DEVYANI_NOCHECK || '0';
  const X = require('./DEVYANI.ctx');
  const { n0, n1, HEV, HEV22, HEV24, HEVplain, FM, evNow, evSepNow, indiaRows, preEbitda, preEbitda26, preSep28, ebitdaSep28 } = X;
  console.log('india', indiaRows.map(r => [r.y, r.stores, r.rps.toFixed(3), n0(r.kfc), n1(r.g)]), 'pre', preEbitda.map(n0), n0(preEbitda26), n0(preSep28), 'phi', X.phi.map(v => v.toFixed(3)), X.phiSep.toFixed(3));
  console.log('HEV', HEV, 'plain', HEVplain.med.toFixed(1), 'HEV22', HEV22.med.toFixed(1), 'HEV24', HEV24.med.toFixed(1), 'trough', X.troughEv, 'evNow', n1(evNow), 'evSepNow', n1(evSepNow), 'FM', FM.median, FM.medianAll, FM.troughYears);
  console.log('dr5Ev', Object.entries(X.dr5Ev).map(([s, v]) => `${s} ${v == null ? 'na' : v.toFixed(1)}`).join(', '), '| sectorEv', X.sectorEv.toFixed(2), 'sens', JSON.stringify(X.sens), 'counts', X.QSR.map(s => s + ':' + X.evCount(s)).join(' '));
  console.log('evMULT', X.evMULT, 'evALT', X.evALT, 'peMULT', X.peMULT, 'tp', X.V.tp, X.V.upside.toFixed(1), X.rating, 'methods', X.BM.map(m => [m.key, Math.round(m.value)]), 'scen', X.SC.bull.tp, X.SC.bear.tp, 'eps', X.F.eps.map(v => v.toFixed(2)));
  console.log('preMultAtTP', n1(X.preMultAt(X.V.tp)), 'evSep28', n0(ebitdaSep28), 'medTp', X.medTp, 'medAll', X.medAll, 'nPost', X.post.length, 'buy<', X.buyBelow, 'sell>', X.sellAbove, 'sotp', (X.V.sotp?.parts || []).map(p => [p.name.slice(0, 14), Math.round(p.value)]), 'PF', JSON.stringify(X.PF));
}
