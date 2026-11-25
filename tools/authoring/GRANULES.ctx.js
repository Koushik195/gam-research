// Granules India initiation: shared context for the Part B files (research.js, part2-6). Part A (GRANULES.ctxa.js) holds the build,
// cash, other income, interest and forward P/E history. This file adds: the pharma sector factor reproduced peer by peer (five-year,
// nine-name set, PLAYBOOK §7c: Granules is outside the set, so +8.2% P/E / +7.5% EV/EBITDA), the derived multiples (must equal
// assumptions.json; GRANULES.mult.js writes them), the forward EV/EBITDA history (cross-check), checks, a reverse-DCF test,
// sensitivity rows, peers and the street as it stood on 30-Sep-2026.
const X = require('./GRANULES.ctxa');
const { fs, path, ROOT, D, M, A, F, V, AS, SC, PF, ASOF, FROM5, ISSUE, CONV, n0, n1, pc1, half, cagr, pct, medI, b, ai, sep, price, SHARES, HB, FM, pxW, fyOf, epsRep, peersAsOf, cashPath, ND0_ACT, oiOk, intOk, oiBuild, intBuild } = X;
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');

// 6) Sector factor (sector-factor.js method): peer multiple at the 30-Sep close vs its five-year median; median of the rounded moves
const SET = D.peers.set, EXCL = D.peers.excluded, CTX = D.peers.context;
const PEERS = peersAsOf([...new Set([...SET, ...CTX, ...Object.keys(EXCL), 'GRANULES'])], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const raw = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
const medFrom = (sym, ch, key, from) => medI((raw(sym).charts?.[ch]?.[key] || []).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const moveOf = (syms, metric, from) => Object.fromEntries(syms.map(s => { const m = metric === 'pe' ? medFrom(s, 'pe', 'Price to Earning', from) : medFrom(s, 'evEbitda', 'EV Multiple', from); const cur = metric === 'pe' ? P[s].pe : P[s].evEbitda; return [s, { cur, med: m, mv: +((cur / m - 1) * 100).toFixed(1) }]; }));
const MW = moveOf([...SET, 'GRANULES'], 'pe', FROM5), MWEV = moveOf([...SET, 'GRANULES'], 'ev', FROM5);
const sectorCalc = medI(SET.map(s => MW[s].mv)), sectorEvCalc = medI(SET.map(s => MWEV[s].mv));
const OTHERS = Object.keys(EXCL); // all 15 pharma names (MANKIND's history starts May-2023, as in sector-factor.js)
const MWX = moveOf(OTHERS, 'pe', FROM5), sectorAll = medI([...SET.map(s => MW[s].mv), ...OTHERS.map(s => MWX[s].mv)]);
const SECTOR = 8.2, SECTOR_EV = 7.5, k = 1 + SECTOR / 100, kev = 1 + SECTOR_EV / 100;
if (Math.abs(sectorCalc - SECTOR) > 0.05 || Math.abs(sectorEvCalc - SECTOR_EV) > 0.05) console.warn(`WARNING: GRANULES factor reproduces at ${sectorCalc.toFixed(2)}% / ${sectorEvCalc.toFixed(2)}% vs ${SECTOR}% / ${SECTOR_EV}%`);
const ownMv = MW.GRANULES.mv, ownEvMv = MWEV.GRANULES.mv;
const W24 = '2024-04-01', MW24 = moveOf(SET, 'pe', W24), sector24 = medI(SET.map(s => MW24[s].mv)), H24 = (v => ({ med: pct(v, 0.5), n: v.length }))(FM.series.filter(([d]) => d >= W24).map(x => x[1])); // sensitivity: 'Granules 2.0' window
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma', NATCOPHARM: 'Natco Pharma', NEULANDLAB: 'Neuland Labs', AJANTPHARM: 'Ajanta Pharma', GRANULES: 'Granules' }[s] || s);

// 7) Target multiples: house forwardMedian (reported EPS; no trough years) × 1.082; bull/bear = 75th/25th percentile × 1.082
const MULT = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };

// 8) Forward EV/EBITDA since Apr-2021 (same weeks): EV = price × shares then outstanding + latest published net debt (engine basis,
//    incl. leases) ÷ next full year's EBITDA. From the Feb-2026 issue: fully diluted shares and the 75% warrant balance as cash.
const ndBy = {}, shBy = {}, ebBy = {};
A.labels.forEach((l, i) => { const y = 2000 + +l.slice(2, 4); ndBy[y] = (A.borrowings[i] || 0) - (A.cash[i] || 0) - (A.investments[i] || 0); shBy[y] = A.shares[i]; ebBy[y] = A.ebitda[i]; });
ndBy[2026] = -ND0_ACT; shBy[2026] = 24.7797;                        // unpatched Mar-26: net debt Rs562 cr, 24.78 cr shares
F.years.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const lastFy = d => { let y = +d.slice(0, 4); if (d < `${y}-05-31`) y -= 1; return y; };
const evAt = (d, p) => { if (d < ISSUE) return p * shBy[lastFy(d)] + ndBy[lastFy(d)]; const nd = (d < '2026-05-31' ? ndBy[2025] - C_PREF.receivedFeb26 : ndBy[2026]) - PF.cashCr; return p * PF.sharesCr + nd; };
const C_PREF = X.C.balanceSheet.preferential;
const sEv = pxW.map(([d, p]) => [d, Math.round(evAt(d, p) / ebBy[fyOf(d)] * 10) / 10]);
const ev = sEv.map(x => x[1]);
const EVH = { med: pct(ev, 0.5), p25: pct(ev, 0.25), p75: pct(ev, 0.75), min: Math.min(...ev), max: Math.max(...ev), n: ev.length };
const EVM = { base: half(EVH.med * kev), bull: half(EVH.p75 * kev), bear: half(EVH.p25 * kev) };
const EVM_PEF = half(EVH.med * k), ebitdaSep = sep(F.ebitda), treasSep = sep(F.treasury);
const evNowFwd = (price * SHARES - cashPath[1]) / F.ebitda[1];

// 9) Checks: assumptions multiples = derivation; engine P/E value = multiple × Sep-28E EPS; target = rounded P/E value
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const same = (a, c) => ['base', 'bull', 'bear'].every(key => a[key] === c[key]);
const multOk = same(PEM.multiple, MULT), evOk = same(EVA.multiple, EVM);
const epsSep28 = mv('pe').metric;
if (!process.env.TP_NOCHECK) {
  if (!oiOk) throw new Error(`GRANULES other income: build ${oiBuild} vs assumptions ${AS.otherIncome}; run TP_NOCHECK=1 node tools/authoring/GRANULES.mult.js`);
  if (!intOk) throw new Error(`GRANULES interest: build ${intBuild} vs assumptions ${AS.interest}; run TP_NOCHECK=1 node tools/authoring/GRANULES.mult.js`);
  if (!multOk || !evOk) throw new Error(`GRANULES: assumptions multiples differ (P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}); run TP_NOCHECK=1 node tools/authoring/GRANULES.mult.js`);
  if (FM.troughYears.length) throw new Error(`GRANULES: trough years ${FM.troughYears} - revisit the derivation text`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'pe').value; if (tp !== Math.round(pv / 10) * 10) throw new Error(`GRANULES ${c} target ${tp} is not the P/E value ${Math.round(pv)}`); });
}

module.exports = { ...X, ruleText, SET, EXCL, CTX, PEERS, P, MW, MWEV, sectorCalc, sectorEvCalc, OTHERS, MWX, sectorAll, W24, MW24, sector24, H24, SECTOR, SECTOR_EV, k, kev, ownMv, ownEvMv, shortName, MULT,
  sEv, EVH, EVM, EVM_PEF, ebitdaSep, treasSep, evNowFwd, BM, mv, multOk, evOk, epsSep28, ratingFor, buyAt, sellAt, C_PREF };
Object.assign(module.exports, require('./GRANULES.ctxb')(module.exports));

if (require.main === module) {
  const Y = module.exports;
  console.log('build', Y.buildTot.map(n0), 'model', F.sales, 'mix cdmo', Y.mixPct('cdmo').map(n1));
  console.log('cash', cashPath.map(n0), 'gross', Y.grossCash.map(n0), 'loans', Y.LOANS, 'ND0 act', n0(ND0_ACT));
  console.log('OI build', oiBuild, 'vs', AS.otherIncome, oiOk, JSON.stringify(Y.oi27), 'treas', Y.oiTreas.map(n1), 'recur', n1(Y.RECUR), 'fdYield', n1(Y.fdYieldCalc), 'TTM', n1(Y.ttmOi));
  console.log('interest', intBuild, 'vs', AS.interest, intOk, 'kd calc', Y.kdCalc.toFixed(2));
  console.log('EPS', F.eps, 'Sep-28E', epsSep28.toFixed(2), 'FM', FM.median, FM.medianAll, FM.troughYears, JSON.stringify(HB), '| weekly', JSON.stringify(Y.HW), '| ex', JSON.stringify(Y.HEX), '| pre-issue', JSON.stringify(Y.HPRE));
  console.log('byFY', Object.entries(Y.byFyMed).map(([f, h]) => `${f}:${h.med}(${h.n})`).join(' '), 'trough lines FY24', Y.troughLine(2024).toFixed(2), 'FY25', Y.troughLine(2025).toFixed(2));
  console.log('factor', sectorCalc.toFixed(2), sectorEvCalc.toFixed(2), 'all14', sectorAll.toFixed(2), 'own', ownMv, ownEvMv, SET.map(s => `${s} ${MW[s].cur}/${n1(MW[s].med)}=${MW[s].mv}`).join('; '));
  console.log('MULT', MULT, 'EVH', JSON.stringify(EVH), 'EVM', EVM, 'EV@PEfactor', EVM_PEF, 'ok', multOk, evOk);
  console.log('TP', V.tp, V.upside.toFixed(1), Y.rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'bull', SC.bull.tp, 'bear', SC.bear.tp, 'gNeeded', n1(Y.gNeeded), 'dcf', V.intrinsicTp);
  console.log('SENS', Y.SENS.map(r => `${r.name.slice(0, 40)}: ${r.mult}x ${r.tp}`).join(' | '));
  console.log('street med', Y.medTp, 'postQ1 med', Y.medTpQ1, 'fwd now', n1(X.fwdNow), 'Sep', n1(X.peSep), 'trail', n1(X.trailPe), 'buyBelow', Y.buyBelow, 'sellAbove', Y.sellAbove);
}
