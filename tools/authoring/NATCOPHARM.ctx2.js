// Natco Pharma initiation: shared context (part 2). Sector factors (reproduced, PLAYBOOK §7c), the multiples, the
// forward EV/EBITDA history (trough rule on forward EBITDA), the street, the rating and the post-rights view.
const X = require('./NATCOPHARM.ctx');
const { fs, path, ROOT, D, M, F, V, A, SC, ASOF, n0, n1, pctl, medOf, statOf, b, ix, price, mcap, sep, FM, HR, HALL, exWind, keepFY28, HA, fyOf, peersAsOf, cagr, tre0, OB, taxRows } = X;
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const half = X.half;

// 6) Sector factor: the nine pharma peers' trailing multiple at the 30-Sep close vs their five-year medians (sector-factor.js method)
const PEER_SYMS = D.peers.set, EXCL_SYMS = Object.keys(D.peers.excluded), ALL_SYMS = [...PEER_SYMS, ...EXCL_SYMS, 'NATCOPHARM'];
const PEERS = peersAsOf(ALL_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const ld = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const med5 = (s, ch, k) => medOf((ld(s).charts?.[ch]?.[k] || []).filter(([d, x]) => d >= '2021-09-30' && d <= ASOF && x > 0).map(x => x[1]));
const MED5 = Object.fromEntries(ALL_SYMS.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const MED5EV = Object.fromEntries(ALL_SYMS.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const derate = Object.fromEntries(ALL_SYMS.map(s => [s, P[s]?.pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const derateEv = Object.fromEntries(ALL_SYMS.map(s => [s, P[s]?.evEbitda && MED5EV[s] ? (P[s].evEbitda / MED5EV[s] - 1) * 100 : null]));
const sectorCalc = medOf(PEER_SYMS.map(s => derate[s])), sectorEvCalc = medOf(PEER_SYMS.map(s => derateEv[s]));
const sectorCalcAll = medOf([...PEER_SYMS, ...EXCL_SYMS].filter(s => derate[s] != null).map(s => derate[s]));
const SECTOR_SET = D.peers.factorSet, SECTOR_EV = D.peers.factorSetEv;
if (Math.abs(sectorCalc - SECTOR_SET) > 0.05) throw new Error(`NATCOPHARM P/E factor reproduction ${sectorCalc.toFixed(3)}% vs PLAYBOOK ${SECTOR_SET}%`);
if (Math.abs(sectorEvCalc - SECTOR_EV) > 0.05) throw new Error(`NATCOPHARM EV factor reproduction ${sectorEvCalc.toFixed(3)}% vs ${SECTOR_EV}%`);
const k = 1 + SECTOR_SET / 100, kev = 1 + SECTOR_EV / 100;
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo', ALKEM: 'Alkem', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind', NATCOPHARM: 'Natco Pharma' }[s] || s);

// 7) The multiple: house forwardMedian (reported EPS, trough years excluded) x factor, nearest half-turn; bull p75, bear p25
const MULT = { base: half(HR.med * k), bull: half(HR.p75 * k), bear: half(HR.p25 * k) };
const SENS = { all: half(HALL.med * k), exWind: half(exWind.med * k), keepFY28: half(keepFY28.med * k), adj: half(HA.med * k), noFactor: half(HR.med), all15: half(HR.med * (1 + sectorCalcAll / 100)) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const val = m => Math.round(m * epsSep.base / 10) * 10;

// 8) Forward EV/EBITDA history (cross-check): EV = price x shares + Screener net debt at the last reported year-end
//    (investments include the Adcock stake from Mar-26); forward EBITDA on Screener's basis; trough rule on forward EBITDA
const ebFwd = {}; A.labels.forEach((l, i) => (ebFwd[2000 + +l.slice(2, 4)] = A.ebitda[i])); F.years.forEach((y, i) => (ebFwd[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ndFy = fy => { const i = ix(`FY${String(fy).slice(2)}`); return A.borrowings[i] - (A.cash[i] || 0) - (A.investments[i] || 0); };
const lastFyBs = d => { const y = +d.slice(0, 4), md = d.slice(5); return md >= '05-30' ? y : y - 1; };
const PX = X.S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= '2021-04-01');
const trEb = fy => { const pk = Math.max(ebFwd[fy - 1], ebFwd[fy - 2], ebFwd[fy - 3]); return !(ebFwd[fy] > 0) || ebFwd[fy] < 0.5 * pk; };
const evAll = PX.map(([d, p]) => { const fy = fyOf(d); return [d, Math.round((p * F.shares + ndFy(lastFyBs(d))) / ebFwd[fy] * 10) / 10, fy]; });
const fwdEv = evAll.filter(x => !trEb(x[2])), troughEv = [...new Set(evAll.filter(x => trEb(x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const HEV = statOf(fwdEv.map(x => x[1])), HEVALL = statOf(evAll.map(x => x[1]));
const evMULT = { base: half(HEV.med * kev), bull: half(HEV.p75 * kev), bear: half(HEV.p25 * kev) };
const ebitdaSep = sep(F.ebitda);
const evNow = (mcap - tre0) / F.ebitda[1], evNowExCash = (mcap - (tre0 - OB.nonYieldingOpen[0] + 1060)) / F.ebitda[1];

// 9) Rating from the house rule; street as it stood on 30-Sep-2026
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, stTps = ST.map(s => s.tp), medTp = medOf(stTps), tpLo = Math.min(...stTps), tpHi = Math.max(...stTps);
const epsCagr = cagr(A.eps[b], F.eps[2], 3);

// 10) Post-rights view (not in the base): 17,058,082 new shares at Rs750 (net ~Rs1,259 cr), Rs810.5 cr of loans repaid,
//     the rest earning 6.5%; theoretical ex-rights price = (21 x 827.5 + 2 x 750) / 23
const RI = { newSh: 1.7058082, gross: 1279.36, net: 1259, repay: 810.5 };
RI.shPost = F.shares + RI.newSh; RI.terp = (21 * price + 2 * 750) / 23;
RI.patAdd = (RI.repay * 0.065 + (RI.net - RI.repay) * 0.065) * (1 - 0.27);
RI.epsSep = (sep(F.pat) + RI.patAdd) / RI.shPost; RI.epsDil = (RI.epsSep / epsSep.base - 1) * 100;
RI.tpPe = Math.round(MULT.base * RI.epsSep / 10) * 10; RI.tpEq = Math.round((V.tp * F.shares + RI.net) / RI.shPost / 10) * 10;
RI.upPe = (RI.tpPe / RI.terp - 1) * 100;

module.exports = { ...X, ruleText, PEER_SYMS, EXCL_SYMS, PEERS, P, MED5, MED5EV, derate, derateEv, sectorCalc, sectorEvCalc, sectorCalcAll, SECTOR_SET, SECTOR_EV, k, kev, shortName,
  MULT, SENS, epsSep, val, ebFwd, evAll, fwdEv, troughEv, HEV, HEVALL, evMULT, ebitdaSep, evNow, evNowExCash, rating, buyBelow, sellAbove, ST, medTp, tpLo, tpHi, epsCagr, RI };

if (require.main === module) {
  const Z = module.exports;
  console.log('build', Z.bld.map(r => `${r.y} ${n0(r.rev)} vs ${n0(r.model)}`).join('; '));
  console.log('OI', Z.oiRows.map(r => `${r.y} tot ${n0(r.tot)} exAssoc ${n0(r.exAssoc)} treas ${n0(r.treas)} yielding ${n0(r.yielding)}`).join('; '));
  console.log('tax', taxRows.map(r => `${r.y} ${r.rate.toFixed(2)}% patEx ${n0(r.patExAssoc)} assoc ${r.assoc}`).join('; '), '| assoc % PAT', Z.assocPct.map(n1).join('/'));
  console.log('FM', FM.median, FM.troughYears, 'n', FM.series.length, 'p25/p75', HR.p25, HR.p75, '| all', HALL.med, '| byFY', Z.FWDFY.map(x => `${x.fy}:${n1(x.med)}(${x.n}) eps ${n1(x.eps)} thr ${n1(x.thr)}${x.trough ? ' T' : ''}`).join(' '));
  console.log('factor', sectorCalc.toFixed(3), 'EV', sectorEvCalc.toFixed(3), 'all15', sectorCalcAll.toFixed(2), '| MULT', MULT, 'SENS', SENS, 'epsSep', epsSep);
  console.log('EV hist', HEV, 'troughs', troughEv, 'all', HEVALL.med, 'evMULT', evMULT, 'ebSep', n0(ebitdaSep));
  console.log('engine tp', V.tp, V.upside.toFixed(1), rating, '| methods', JSON.stringify(Z.BM.map(m => [m.key, Math.round(m.value)])), '| street med', medTp, '| RI', JSON.stringify(RI));
}
