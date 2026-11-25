// Caplin Point initiation: shared context for the authoring files. CAPLIPOINT.core.js holds the data, builds and EPS; this
// file adds the one-year-forward P/E history since Apr-2021 on reported EPS (house forwardMedian), the trough test, the
// pharma sector factor (PLAYBOOK §7c A21: +8.2% P/E, +7.5% EV/EBITDA for names outside the nine-peer set; reproduced per
// peer), the target multiples, the EV/EBITDA cross-check, sensitivities, the street and the checks. As of 30-Sep-2026.
const X0 = require('./CAPLIPOINT.core');
const { fs, path, ROOT, D, M, RAW, F, V, A, AS, SC, ASOF, FROM, half, cagr, medOf, pctl, statOf, b, YRS, sep, price, SHARES, mcap, FY26, epsU, epsSep, epsRep, epsExc, growthFromBuild, buildOk, oiOk, OI_CARRY, oiBuild, taxOk, taxRateBuild, ccpsEpsSep } = X0;
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');

// 1) Trough test and one-year-forward P/E since Apr-2021 (house forwardMedian: every 5th weekly close, median s[floor(n/2)])
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const trough = (by, fy) => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); const pk = prev.length ? Math.max(...prev) : null; return !(by[fy] > 0) || (pk > 0 && by[fy] < 0.5 * pk); };
const troughRows = [2022, 2023, 2024, 2025, 2026].map(fy => ({ fy, eps: epsRep[fy], peak: Math.max(epsRep[fy - 1], epsRep[fy - 2], epsRep[fy - 3]) }));
const FM = forwardMedian('CAPLIPOINT', M);
const sBase = FM.series, HB = statOf(sBase.map(x => x[1]));
if (Math.abs(HB.med - FM.median) > 1e-9) throw new Error('CAPLIPOINT: base median differs from forwardMedian');
const troughYrs = FM.troughYears;
const pxAll = RAW.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= FROM);
const seriesOn = by => pxAll.filter(([d]) => !trough(by, fyOf(d))).map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10]);
const sExc = seriesOn(epsExc), HX = statOf(sExc.map(x => x[1]));
const pxWk = RAW.charts.price.Price.filter(([d]) => d >= FROM && d <= ASOF); if (pxWk.at(-1)[0] < ASOF) pxWk.push([ASOF, price]);
const HW = statOf(pxWk.map(([d, p]) => p / epsRep[fyOf(d)]));
const byFwdFy = {}; sBase.forEach(([d, x]) => (byFwdFy[fyOf(d)] ||= []).push(x));
const FWDFY = Object.keys(byFwdFy).sort().map(fy => ({ fy: `FY${String(fy).slice(2)}${+fy >= 2027 ? 'E' : ''}`, med: pctl(byFwdFy[fy], 0.5), n: byFwdFy[fy].length, eps: epsRep[fy] }));
const pre26 = statOf(sBase.filter(([d]) => d < '2025-04-01').map(x => x[1])); // windows on actual EPS only
const W24 = '2024-04-01', H24 = statOf(sBase.filter(([d]) => d >= W24).map(x => x[1])); // post re-rating window (sensitivity)
const peFy27 = price / epsU[0], peFy28 = price / epsU[1], peSep28 = price / epsSep;
const ttmEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), peTtm = price / ttmEps;

// 2) Sector factor (PLAYBOOK §7c A21): CAPLIPOINT is outside the nine-peer set -> median of all nine (since 30-Sep-2021)
const PEER_SET = D.peers.set, EXCL = Object.keys(D.peers.excluded), CONTEXT = D.peers.context;
const PEERS = peersAsOf([...PEER_SET, 'CAPLIPOINT', ...CONTEXT], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const ser = (sym, a, k2) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.[a]?.[k2] || [];
const medFrom = (sym, a, k2, from) => { const v = ser(sym, a, k2).filter(([d, x]) => d <= ASOF && d >= from && x > 0).map(x => x[1]).sort((x, y) => x - y); const i = (v.length - 1) / 2, lo = Math.floor(i); return v[lo] + (v[Math.ceil(i)] - v[lo]) * (i - lo); };
const ALL10 = [...PEER_SET, 'CAPLIPOINT', ...CONTEXT.filter(s => P[s] && !P[s].missing)];
const MED5 = Object.fromEntries(ALL10.map(s => [s, medFrom(s, 'pe', 'Price to Earning', '2021-09-30')]));
const MED5EV = Object.fromEntries(ALL10.map(s => [s, medFrom(s, 'evEbitda', 'EV Multiple', '2021-09-30')]));
const derate = Object.fromEntries(ALL10.map(s => [s, (P[s].pe / MED5[s] - 1) * 100]));
const derateEv = Object.fromEntries(ALL10.map(s => [s, (P[s].evEbitda / MED5EV[s] - 1) * 100]));
const sectorCalc = medOf(PEER_SET.map(s => derate[s])), sectorEvCalc = medOf(PEER_SET.map(s => derateEv[s]));
const SECTOR = 8.2, SECTOR_EV = 7.5, k = 1 + SECTOR / 100, kev = 1 + SECTOR_EV / 100; // PLAYBOOK §7c A21 (set)
if (Math.abs(sectorCalc - SECTOR) > 0.06 || Math.abs(sectorEvCalc - SECTOR_EV) > 0.06) throw new Error(`CAPLIPOINT factor reproduction ${sectorCalc.toFixed(2)} / ${sectorEvCalc.toFixed(2)} differs from PLAYBOOK +8.2% / +7.5%`);
const sector24 = medOf(PEER_SET.map(s => (P[s].pe / medFrom(s, 'pe', 'Price to Earning', W24) - 1) * 100)); // same-window move (sensitivity)
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma', JBCHEPHARM: 'J.B. Chemicals', AJANTPHARM: 'Ajanta Pharma', GLAND: 'Gland Pharma', MARKSANS: 'Marksans Pharma', NATCOPHARM: 'Natco Pharma', CAPLIPOINT: 'Caplin Point' }[s] || s);

// 3) Target multiples (derived): base = median x factor; bull / bear = 75th / 25th percentile x factor; nearest half-turn
const MULT = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };
const EPSC = { base: epsSep, bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const val = m => Math.round(m * epsSep / 10) * 10;
const SENS = { exc: half(HX.med * k), weekly: half(HW.med * k), pre26: half(pre26.med * k), noFactor: half(HB.med), own: half(HB.med * (1 + derate.CAPLIPOINT / 100)), mid: half(HB.med * (1 + (SECTOR + derate.CAPLIPOINT) / 2 / 100)), w24: half(H24.med * (1 + sector24 / 100)) };
const valCcps = Math.round(MULT.base * (epsSep - ccpsEpsSep) / 10) * 10;

// 4) EV/EBITDA cross-check: trailing EV/EBITDA since Apr-2021 (Screener) x the EV analogue (+7.5%), on trailing EBITDA at
//    the target date (½ FY27E + ½ FY28E) plus engine net cash at Sep-27 (after the CCPS at book)
const evHist = ser('CAPLIPOINT', 'evEbitda', 'EV Multiple').filter(([d, x]) => d >= FROM && d <= ASOF && x > 0);
const HEV = statOf(evHist.map(x => x[1]));
const EVM = { base: half(HEV.med * kev), bull: half(HEV.p75 * kev), bear: half(HEV.p25 * kev) };
const EVM_PE = half(HEV.med * k);
const ebitdaT27 = (F.ebitda[0] + F.ebitda[1]) / 2, treasT27 = (F.treasury[0] + F.treasury[1]) / 2;
const evNow = mcap - (FY26.treasury.gross - FY26.treasury.borrowings - FY26.treasury.leases), evFy28 = (mcap - F.treasury[0]) / F.ebitda[1];

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const multOk = ['base', 'bull', 'bear'].every(c => PEM.multiple[c] === MULT[c]);
const evOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === EVM[c]);
const revOk = YRS.every((_, i) => Math.abs(AS.revenueGrowth[i] - growthFromBuild[i]) < 0.0015);
if (!process.env.TP_NOCHECK) {
  if (!revOk || !buildOk) throw new Error(`CAPLIPOINT revenue: build growth ${growthFromBuild} vs assumptions ${AS.revenueGrowth}; run node tools/authoring/CAPLIPOINT.mult.js`);
  if (!oiOk) throw new Error(`CAPLIPOINT other income: carry ${OI_CARRY} vs ${AS.otherIncome}; build ${oiBuild.map(v => v.toFixed(1))} vs engine ${F.otherIncome}; run CAPLIPOINT.mult.js`);
  if (!taxOk) throw new Error(`CAPLIPOINT tax: build ${taxRateBuild} vs assumptions ${AS.taxRate}; run CAPLIPOINT.mult.js`);
  if (!multOk || !evOk) throw new Error(`CAPLIPOINT: assumptions multiples differ from the derivation (P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}); run CAPLIPOINT.mult.js`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'pe').value; if (Math.abs(pv - MULT[c] * EPSC[c]) > (c === 'base' ? 1 : MULT[c] * 0.06)) throw new Error(`CAPLIPOINT ${c} P/E value ${Math.round(pv)} != ${MULT[c]}x Sep-28E EPS`); if (tp !== Math.round(pv / 10) * 10) throw new Error(`CAPLIPOINT ${c} target ${tp} is not the P/E value ${Math.round(pv)}`); });
}
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagr = cagr(epsRep[2026], epsU[2], 3), ebitdaCagr = cagr(A.ebitda[b], F.ebitda[2], 3), salesCagr = cagr(A.sales[b], F.sales[2], 3), epsCagrHist = cagr(epsRep[2021], epsRep[2026], 5);

// 5) Street as it stood on 30-Sep-2026
const ST = D.street.brokers, icici = ST[0], STAND = ST.filter(s => s.standing), CONS = D.street.consensus;
const atOurs = { icici: 26 * epsU[1] };

module.exports = { ...X0, ruleText, fyOf, troughRows, troughYrs, FM, sBase, HB, sExc, HX, HW, FWDFY, pre26, W24, H24, peFy27, peFy28, peSep28, ttmEps, peTtm,
  PEER_SET, EXCL, CONTEXT, PEERS, P, MED5, MED5EV, derate, derateEv, sectorCalc, sectorEvCalc, SECTOR, SECTOR_EV, k, kev, sector24, shortName, MULT, EPSC, val, SENS, valCcps,
  evHist, HEV, EVM, EVM_PE, ebitdaT27, treasT27, evNow, evFy28, BM, mv, multOk, evOk, revOk, rating, buyBelow, sellAbove, epsCagr, ebitdaCagr, salesCagr, epsCagrHist, ST, icici, STAND, CONS, atOurs };

if (require.main === module) {
  const Z = module.exports;
  console.log('build', Z.buildTot.map(Math.round), 'model', F.sales.map(Math.round), 'growth', growthFromBuild, 'vs', AS.revenueGrowth, '| US %', Z.mixPct('us').map(v => v.toFixed(1)));
  console.log('OI carry', OI_CARRY, 'vs', AS.otherIncome, '| build', oiBuild.map(v => v.toFixed(1)), 'engine', F.otherIncome.map(v => v.toFixed(1)), 'ok', oiOk, '| nc0', Z.nc0, 'gap', Z.GAP.toFixed(1), 'yield26', Z.YIELD26.toFixed(2), 'TTM OI', Z.ttmOiRep.toFixed(1), 'exFx26', Z.oi26exFx.toFixed(1));
  console.log('tax build', taxRateBuild, 'vs', AS.taxRate, taxOk, '| EPS', epsU.map(v => v.toFixed(2)), 'Sep-28E', epsSep.toFixed(2), '| CCPS eps', Z.ccpsEps.map(v => v.toFixed(2)), '| troughs', troughYrs);
  console.log('HB', JSON.stringify(HB), '| HX', JSON.stringify(HX), '| HW', JSON.stringify(HW), '| pre26', JSON.stringify(pre26), '| H24', JSON.stringify(H24), 'sector24', sector24.toFixed(2), '| byFY', FWDFY.map(f => `${f.fy} ${f.med}`).join(' '));
  console.log('sector', sectorCalc.toFixed(3), 'EV', sectorEvCalc.toFixed(3), '| own', derate.CAPLIPOINT.toFixed(2), derateEv.CAPLIPOINT.toFixed(2), '| MED5 own', MED5.CAPLIPOINT, 'P own', P.CAPLIPOINT.pe, P.CAPLIPOINT.evEbitda);
  console.log('MULT', MULT, 'ok', multOk, evOk, revOk, '| SENS', JSON.stringify(SENS), 'valCcps', valCcps, '| EV hist', JSON.stringify(HEV), 'EVM', EVM, 'EV@PEk', EVM_PE);
  console.log('TP', V.tp, 'upside', V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'scen', SC.bull.tp, SC.bear.tp, '| PE fy27/28/sep28/ttm', peFy27.toFixed(1), peFy28.toFixed(1), peSep28.toFixed(1), peTtm.toFixed(1), '| icici at ours', Math.round(atOurs.icici));
}
