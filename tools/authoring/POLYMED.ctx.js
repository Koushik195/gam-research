// Poly Medicure initiation: shared context for the Part B files (research.js, part2-6). Extends POLYMED.base.js with the
// sector factor (PLAYBOOK §7c thin-peer-set rule: the nine-name pharma factor for names outside the set, +8.2% P/E / +7.5%
// EV/EBITDA, reproduced per peer with the arithmetic of tools/authoring/sector-factor.js), the med-tech names with shorter
// histories (same-window moves) and a wider healthcare set as sensitivity rows, the target multiples, the forward EV/EBITDA
// history (QIP cash added to net cash from the allotment date), the street and the build checks. As of 30-Sep-2026.
const Bz = require('./POLYMED.base');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { fs, path, ROOT, D, A, F, V, AS, SC, ASOF, RAW, M, b, YRS, sep, price, SHARES, mcap, medOf, pctl, half, HB, HR, HY, H22, H23, FM, px, fyOf, shAt, stat, SHR, epsSep, nc0, C } = Bz;

// 1) Sector factor: each peer's trailing P/E (EV/EBITDA) at the 30-Sep close vs its own median of positive weekly points
//    over the window; median across the set (same arithmetic as sector-factor.js)
const medI = a => { const s = [...a].sort((x, y) => x - y); const i = (s.length - 1) / 2, lo = Math.floor(i); return s[lo] + (s[Math.ceil(i)] - s[lo]) * (i - lo); };
const chart = (sym, a, k2) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.[a]?.[k2] || [];
const medW = (sym, a, k2, from) => medI(chart(sym, a, k2).filter(([d, x]) => d <= ASOF && d >= from && x > 0).map(x => x[1]));
const PHARMA = D.peers.factorSet, MT = ['LAXMIDENTL', 'TARSONS'], WIDE = D.peers.wider, ALLS = [...PHARMA, ...WIDE, ...MT, 'POLYMED'];
const PEERS = peersAsOf(ALLS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const FIVE = '2021-09-30', MT_FROM = { LAXMIDENTL: '2025-05-01', TARSONS: FIVE };
const mv = (s, metric, from) => { const [a, k2, cur] = metric === 'pe' ? ['pe', 'Price to Earning', 'pe'] : ['evEbitda', 'EV Multiple', 'evEbitda']; const m = medW(s, a, k2, from); return { cur: P[s][cur], med: m, move: +((P[s][cur] / m - 1) * 100).toFixed(1) }; };
const PE5 = Object.fromEntries(ALLS.map(s => [s, mv(s, 'pe', MT_FROM[s] || FIVE)]));
const EV5 = Object.fromEntries([...PHARMA, 'POLYMED'].map(s => [s, mv(s, 'ev', FIVE)]));
const sectorCalc = medOf(PHARMA.map(s => PE5[s].move)), sectorEvCalc = medOf(PHARMA.map(s => EV5[s].move));
const SECTOR = 8.2, SECTOR_EV = 7.5; // the settled factors for names outside the nine-name set (PLAYBOOK §7c, A21)
const k = 1 + SECTOR / 100, kev = 1 + SECTOR_EV / 100;
const sectorWide = medOf([...PHARMA, ...WIDE].map(s => PE5[s].move));
const pharmaSameWin = medOf(PHARMA.map(s => mv(s, 'pe', MT_FROM.LAXMIDENTL).move)); // pharma over Laxmi Dental's window
const ownMove = PE5.POLYMED.move, ownMoveEv = EV5.POLYMED.move;
const NAMES = { SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LALPATHLAB: 'Dr Lal PathLabs', METROPOLIS: 'Metropolis', VIJAYA: 'Vijaya Diagnostic', THYROCARE: 'Thyrocare', APOLLOHOSP: 'Apollo Hospitals', MAXHEALTH: 'Max Healthcare', FORTIS: 'Fortis Healthcare', NH: 'Narayana Health', SYNGENE: 'Syngene', LAXMIDENTL: 'Laxmi Dental', TARSONS: 'Tarsons Products', POLYMED: 'Poly Medicure' };
const shortName = s => NAMES[s] || s;

// 2) Target multiples: base = own median x factor; bull / bear = 75th / 25th percentile x factor; nearest half-turn
const MULT = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };
const SENS = { rep: half(HR.med * k), ye: half(HY.med * k), from22: half(H22.med * k), last3: half(H23.med * k), house: half(FM.median * k), noK: half(HB.med), ownMid: half(HB.med * (1 + (SECTOR + ownMove) / 2 / 100)), medtech: half(HB.med * (1 + PE5.LAXMIDENTL.move / 100)), pharmaSame: half(HB.med * (1 + pharmaSameWin / 100)), wide: half(HB.med * (1 + sectorWide / 100)), evK: half(HB.med * kev) };
const EPSC = { base: epsSep, bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };

// 3) Forward EV/EBITDA since Apr-2021: EV = price x shares at the date + net debt at the latest March published by end-May
//    (Screener borrowings − cash − investments); from the QIP allotment (22-Aug-2024) to the Mar-25 balance sheet, net debt
//    less the ₹985 cr of net QIP proceeds. EBITDA = next full fiscal year (Screener FY22-26, our FY27-28E).
const bs = RAW.tables['balance-sheet'], pl = RAW.tables['profit-loss'], cashSch = RAW.schedules['balance-sheet']['Other Assets'];
const cashBy = fy => { const j = bs.periods.indexOf(`Mar ${fy}`); return M.annual.cash[M.annual.labels.indexOf(`FY${String(fy).slice(2)}`)]; };
const ndFy = fy => { const j = bs.periods.indexOf(`Mar ${fy}`); return bs.rows.Borrowings[j] - cashBy(fy) - bs.rows.Investments[j]; };
const QIP_NET = SHR.qipGross - SHR.qipExpenses;
const ebBy = {}; pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) ebBy[+p.slice(-4)] = pl.rows['Operating Profit'][i]; });
YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ndAt = d => { let fy = +d.slice(0, 4); if (d < `${fy}-05-31`) fy -= 1; const nd = ndFy(Math.min(fy, 2026)); return d >= SHR.qipDate && d < '2025-05-31' ? nd - QIP_NET : nd; };
const fwdEv = px.map(([d, p]) => [d, Math.round((p * shAt(d) + ndAt(d)) / ebBy[fyOf(d)] * 10) / 10]);
const HEV = stat(fwdEv);
const EVM = { base: half(HEV.med * kev), bull: half(HEV.p75 * kev), bear: half(HEV.p25 * kev) };
const EVM_PEFACTOR = half(HEV.med * k);
const ebitdaSep = sep(F.ebitda), treasSep = sep(F.treasury), evNowFwd = (mcap - nc0) / F.ebitda[1];
const evValAt = m => (m * ebitdaSep + treasSep) / SHARES;

// 4) Checks (skipped by POLYMED.mult.js while it rewrites the assumptions)
const BM = V.blend.methods, mvx = key => BM.find(m => m.key === key);
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const multOk = ['base', 'bull', 'bear'].every(c => PEM.multiple[c] === MULT[c]), evOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === EVM[c]);
if (!process.env.TP_NOCHECK) {
  if (!Bz.revOk) throw new Error(`POLYMED revenue build ${Bz.buildRev.map(Math.round)} != model ${F.sales.map(Math.round)}; run POLYMED.mult.js`);
  if (!Bz.oiOk) throw new Error(`POLYMED other income: build ${Bz.oiBuild} vs assumptions ${AS.otherIncome}; run POLYMED.mult.js`);
  if (!Bz.intOk) throw new Error(`POLYMED interest: build ${Bz.intBuild} vs ${AS.interest}`);
  if (!Bz.taxOk) throw new Error(`POLYMED tax: build ${Bz.taxRateBuild} vs ${AS.taxRate}; run POLYMED.mult.js`);
  if (!multOk || !evOk) throw new Error(`POLYMED multiples differ from the derivation (P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}); run POLYMED.mult.js`);
  if (Math.abs(sectorCalc - SECTOR) > 0.05 || Math.abs(sectorEvCalc - SECTOR_EV) > 0.05) throw new Error(`POLYMED factor reproduction ${sectorCalc} / ${sectorEvCalc} differs from the settled ${SECTOR} / ${SECTOR_EV}`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'pe').value; if (Math.abs(pv - MULT[c] * EPSC[c]) > (c === 'base' ? 1 : MULT[c] * 0.06)) throw new Error(`POLYMED ${c} P/E value ${Math.round(pv)} != ${MULT[c]}x Sep-28E EPS`); if (tp !== Math.round(pv / 10) * 10) throw new Error(`POLYMED ${c} target ${tp} is not the P/E value`); });
}
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagr = (Math.pow(Bz.epsU[2] / Bz.epsBase[2026], 1 / 3) - 1) * 100, salesCagr = (Math.pow(F.sales[2] / A.sales[b], 1 / 3) - 1) * 100;
const ebitdaCagr = (Math.pow(F.ebitda[2] / A.ebitda[b], 1 / 3) - 1) * 100, histEpsCagr = (Math.pow(Bz.epsBase[2026] / Bz.epsBase[2022], 1 / 4) - 1) * 100;

// 5) Street as it stood on 30-Sep-2026
const ST = D.street.brokers, byB = n => ST.find(s => s.broker === n), CONS = D.street.consensus;
const waya = byB('Waya Financial'), iifl = byB('IIFL Securities'), joindre = byB('Joindre Capital'), isec = byB('ICICI Securities'), lkp = byB('LKP Research');
const methodCount = ST.reduce((o, s) => { const m = s.method || 'n.d.'; o[m] = (o[m] || 0) + 1; return o; }, {});

module.exports = { ...Bz, medI, PHARMA, MT, WIDE, PEERS, P, PE5, EV5, sectorCalc, sectorEvCalc, SECTOR, SECTOR_EV, k, kev, sectorWide, pharmaSameWin, ownMove, ownMoveEv, shortName, MT_FROM,
  MULT, SENS, EPSC, ndFy, QIP_NET, ebBy, fwdEv, HEV, EVM, EVM_PEFACTOR, ebitdaSep, treasSep, evNowFwd, evValAt, BM, mv: mvx, multOk, evOk, rating, buyBelow, sellAbove, epsCagr, salesCagr, ebitdaCagr, histEpsCagr,
  ST, CONS, waya, iifl, joindre, isec, lkp, methodCount };

if (require.main === module) {
  const X = module.exports;
  console.log('rev build', X.buildRev.map(Math.round), 'model', F.sales.map(Math.round), 'growth', X.growthBuild, 'base26', X.base26.toFixed(1), X.revOk);
  console.log('tax', X.taxRateBuild, AS.taxRate, X.taxOk, '| int', X.intBuild, AS.interest, X.intOk);
  console.log('gross cash', X.grossCash.map(Math.round), 'OI treas', X.oiTreas.map(v => v.toFixed(1)), 'fx', X.oiFx.map(v => v.toFixed(1)), 'FXR', (X.FXR * 100).toFixed(3), JSON.stringify(X.fx), 'OI', X.oiBuild, AS.otherIncome, X.oiOk, 'TTM', X.ttmOi.toFixed(1), 'T26', X.T26.toFixed(1), 'yld26', X.yld26.toFixed(2));
  console.log('EPS base', JSON.stringify(Object.fromEntries(Object.entries(X.epsBase).filter(([y]) => y >= 2021).map(([a, c]) => [a, +c.toFixed(2)]))), 'trough', X.TROUGH_BASE, X.TROUGH_REP);
  console.log('HB', JSON.stringify(HB), 'HR', HR.med, 'HY', HY.med, 'H22', H22.med, 'H23', H23.med, 'house', FM.median, FM.troughYears, '| by yr', X.yearWin.map(w => `${w.fy} ${w.med}`).join(' '));
  console.log('factor', sectorCalc, sectorEvCalc, 'wide', sectorWide, 'pharmaSame', pharmaSameWin, 'own', ownMove, ownMoveEv, '| MT', JSON.stringify({ L: PE5.LAXMIDENTL, T: PE5.TARSONS }));
  console.log('MULT', MULT, 'SENS', JSON.stringify(SENS), 'EV', JSON.stringify(HEV), EVM, EVM_PEFACTOR, 'evNow', evNowFwd.toFixed(1));
  console.log('now fwd FY28E', X.fwdNow.toFixed(1), 'FY27E', X.fwdNow27.toFixed(1), 'trail', X.trailPe.toFixed(1), '| TP', V.tp, V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), SC.bull.tp, SC.bear.tp, 'methods', JSON.stringify(methodCount));
}
