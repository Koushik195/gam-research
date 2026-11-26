// Syngene initiation: shared context, part 2. Sector factor (PLAYBOOK §7c: Syngene is outside the nine-name pharma set, so the
// median of all nine, five-year: +7.5% EV/EBITDA, +8.2% P/E; reproduced peer by peer with sector-factor.js's method), derived
// multiples (EV/EBITDA primary: own forward median since Apr-2021 x 1.075, nearest half-turn; P/E cross-check on EPS before
// exceptional items x 1.082), checks against assumptions.json (SYNGENE.mult.js writes them), reverse DCF, sensitivity rows,
// CDMO peers, the street as it stood on 30-Sep-2026 and the rating from the house rule. Re-exports part 1.
const X = require('./SYNGENE.ctx');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const { fs, path, ROOT, D, F, V, A, AS, SC, ASOF, FIVE, n0, n1, pc1, half, cagr, medOf, b, sep, price, SHARES, mcap, ND0, EVH, HB, HB_rep, sEvAll, sEv, stat, epsU, epsRep, epsEx } = X;

// 6) Sector factor: peers' trailing multiple at the 30-Sep close vs own median over a window (positive points only)
const PEER_SET = D.peers.set, EXCL = Object.keys(D.peers.excluded), CDMO = D.peers.cdmo;
const ALLS = [...new Set([...PEER_SET, ...CDMO, 'SYNGENE', 'BIOCON'])];
const PEERS = peersAsOf(ALLS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const raw = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
const medFrom = (sym, ch, key, from) => medOf((raw(sym).charts?.[ch]?.[key] || []).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const moveOf = (syms, metric, from) => Object.fromEntries(syms.map(s => { const m = metric === 'pe' ? medFrom(s, 'pe', 'Price to Earning', from) : medFrom(s, 'evEbitda', 'EV Multiple', from); const cur = metric === 'pe' ? P[s].pe : P[s].evEbitda; return [s, { cur, med: m, mv: (cur / m - 1) * 100 }]; }));
const MW = moveOf([...PEER_SET, 'SYNGENE'], 'pe', FIVE), MWEV = moveOf([...PEER_SET, 'SYNGENE'], 'ev', FIVE);
const sectorCalc = medOf(PEER_SET.map(s => +MW[s].mv.toFixed(1))), sectorEvCalc = medOf(PEER_SET.map(s => +MWEV[s].mv.toFixed(1)));
const SECTOR = 8.2, SECTOR_EV = 7.5, k = 1 + SECTOR / 100, kev = 1 + SECTOR_EV / 100;
if (Math.abs(sectorCalc - SECTOR) > 0.05 || Math.abs(sectorEvCalc - SECTOR_EV) > 0.05) console.warn(`WARNING: SYNGENE factor reproduces at ${sectorCalc.toFixed(2)}% / ${sectorEvCalc.toFixed(2)}% vs ${SECTOR}% / ${SECTOR_EV}%`);
const W12 = '2025-09-30', W6 = '2026-04-01';
const mv12 = moveOf(PEER_SET, 'ev', W12), mv6 = moveOf(PEER_SET, 'ev', W6);
const sector12 = medOf(PEER_SET.map(s => +mv12[s].mv.toFixed(1))), sector6 = medOf(PEER_SET.map(s => +mv6[s].mv.toFixed(1)));
const ownEvMv = MWEV.SYNGENE.mv, ownPeMv = MW.SYNGENE.mv;
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', SYNGENE: 'Syngene', SAILIFE: 'Sai Life Sciences', LAURUSLABS: 'Laurus Labs', ANTHEM: 'Anthem Biosciences', COHANCE: 'Cohance', NEULANDLAB: 'Neuland Labs', PPLPHARMA: 'Piramal Pharma', BIOCON: 'Biocon' }[s] || s);

// 7) Derived multiples. EV/EBITDA primary: base median, bull 75th, bear 25th percentile, each x 1.075. P/E cross-check x 1.082.
const MULT = { base: half(EVH.med * kev), bull: half(EVH.p75 * kev), bear: half(EVH.p25 * kev) };
const PEM_D = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };

// 8) Checks against assumptions.json and the engine
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const EVA = AS.valuation.blend.methods.find(x => x.key === 'ev'), PEA = AS.valuation.blend.methods.find(x => x.key === 'pe');
const multOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === MULT[c]), peOk = ['base', 'bull', 'bear'].every(c => PEA.multiple[c] === PEM_D[c]);
const ebitdaSep = sep(F.ebitda), treasSep = sep(F.treasury), epsSep28 = sep(epsU);
if (!process.env.TP_NOCHECK) {
  if (!X.oiOk) throw new Error(`SYNGENE other income: build ${X.oiBuild.map(x => x.toFixed(2))} vs assumptions ${AS.otherIncome}; run node tools/authoring/SYNGENE.mult.js`);
  if (!X.intOk) throw new Error(`SYNGENE interest: build ${X.intBuild.map(x => x.toFixed(2))} vs assumptions ${AS.interest}; run node tools/authoring/SYNGENE.mult.js`);
  if (!multOk || !peOk) throw new Error(`SYNGENE: assumptions multiples differ from the derivation (EV ${JSON.stringify(MULT)}, P/E ${JSON.stringify(PEM_D)}); run node tools/authoring/SYNGENE.mult.js`);
  if (X.troughYearsEv.length) throw new Error(`SYNGENE: EBITDA trough years ${X.troughYearsEv}; revisit the derivation text`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'ev').value; if (tp !== Math.round(pv / 10) * 10) throw new Error(`SYNGENE ${c} target ${tp} is not the EV/EBITDA value ${Math.round(pv)}`); });
}

// 9) Reverse DCF (same mechanics as src/forecast.js dcf(), flat growth after FY27E): growth the price needs
const DC = AS.dcf, tTax = AS.taxRate[2] / 100, ke = V.ke;
const dcfAt = g => { let s = F.sales[0], pv = 0, last = null; const n = DC.years;
  for (let kk = 1; kk <= n; kk++) { const sF = (kk - 3 + 1) / (n - 3 + 1); const m = kk < 3 ? F.ebitdaMargin[kk] : F.ebitdaMargin[2] + (DC.fadeMarginTo - F.ebitdaMargin[2]) * sF; const cx = kk < 3 ? F.capex[kk] / F.sales[kk] * 100 : F.capex[2] / F.sales[2] * 100 + (DC.fadeCapexPctTo - F.capex[2] / F.sales[2] * 100) * sF;
    s *= 1 + g / 100; const e = s * m / 100, dep = s * DC.depPctOfSales / 100, f = (e - dep) * (1 - tTax) + dep - s * cx / 100 - F.owcPct / 100 * s * (g / (100 + g)); pv += f / Math.pow(1 + ke / 100, kk - 0.5); last = f; }
  const tv = last * (1 + DC.terminalGrowth / 100) / ((ke - DC.terminalGrowth) / 100) / Math.pow(1 + ke / 100, n);
  return (pv + tv + F.treasury[0]) / SHARES * Math.pow(1 + ke / 100, 0.5); };
let lo = 0, hi = 60; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (dcfAt(mid) < price) lo = mid; else hi = mid; }
const gNeeded = (lo + hi) / 2, dcfAt12 = dcfAt(12), dcfAt15 = dcfAt(15);

// 10) Sensitivity rows (not in the base): EV/EBITDA value at a multiple on base Sep-28E EBITDA and net cash
const evNetCashSep = mv('ev').value * SHARES - mv('ev').metric * mv('ev').mult; // engine's Sep-28E net cash (exact)
const evVal = m => Math.round((m * mv('ev').metric + evNetCashSep) / SHARES / 10) * 10;
const peV = m => Math.round(m * mv('pe').metric / 10) * 10;
const EVH_ex27 = stat(sEv.filter(x => x[2] !== 2027)), EVH_6 = stat(sEvAll.filter(([d]) => d >= W6)), EVH_12 = stat(sEvAll.filter(([d]) => d > W12));
const SENS = [
  { name: `House base: forward EV/EBITDA median since Apr-2021 (every weekly close) × ${kev.toFixed(3)}`, mult: MULT.base, why: `${n1(EVH.med)}x × ${kev.toFixed(3)}` },
  { name: 'Leaving out the FY27-forward year (Apr-25 to Mar-26, inflated by our depressed FY27E EBITDA)', mult: half(EVH_ex27.med * kev), why: `${n1(EVH_ex27.med)}x × ${kev.toFixed(3)}` },
  { name: `Last 12 months only × the peers' same-window move (${pc1(sector12)})`, mult: half(EVH_12.med * (1 + sector12 / 100)), why: `${n1(EVH_12.med)}x × ${(1 + sector12 / 100).toFixed(3)}` },
  { name: `Since the reset (Apr-Sep 2026, FY28E EBITDA) × the peers' same-window move (${pc1(sector6)})`, mult: half(EVH_6.med * (1 + sector6 / 100)), why: `${n1(EVH_6.med)}x × ${(1 + sector6 / 100).toFixed(3)}` },
  { name: 'No sector factor (own median only)', mult: half(EVH.med), why: `${n1(EVH.med)}x` },
  { name: `Blend with Syngene's own EV/EBITDA move (${pc1(ownEvMv)} vs its five-year median; not house policy)`, mult: half(EVH.med * (1 + (SECTOR_EV + ownEvMv) / 200)), why: `midpoint of ${pc1(SECTOR_EV)} and ${pc1(ownEvMv)}` },
  { name: "ICICI Securities' multiple (24x FY27E, Apr-2025 note)", mult: 24, why: 'last accessible note' },
  { name: "Nuvama's CRDMO multiple inside its Biocon SOTP (22x)", mult: 22, why: 'Nov-2025' },
  { name: 'What the price pays today: forward FY28E EV/EBITDA', mult: Math.round(X.evNowFwd * 10) / 10, why: `at ₹${price}` },
].map(r => ({ ...r, tp: evVal(r.mult), up: (evVal(r.mult) / price - 1) * 100 }));

// 11) Rating from the house rule; street as it stood on 30-Sep-2026
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, br = n => ST.find(s => s.broker.startsWith(n));
const withTp = ST.filter(s => s.tp), medTp = medOf(withTp.map(s => s.tp));
const implEvAtPrice = (mcap - treasSep) / ebitdaSep;
const epsCagr = cagr(X.epsFY26ex, epsU[2], 3), salesCagr = cagr(A.sales[b], F.sales[2], 3), ebitdaCagr = cagr(A.ebitda[b], F.ebitda[2], 3);
const ptEbitda = sep(F.sales) / 100, ptPerShare = ptEbitda * MULT.base / SHARES; // Rs per share per point of Sep-28E margin

module.exports = { ...X, PEER_SET, EXCL, CDMO, PEERS, P, MW, MWEV, sectorCalc, sectorEvCalc, SECTOR, SECTOR_EV, k, kev, W12, W6, mv12, mv6, sector12, sector6, ownEvMv, ownPeMv, shortName, MULT, PEM_D,
  BM, mv, multOk, peOk, ebitdaSep, treasSep, epsSep28, ke, dcfAt, gNeeded, dcfAt12, dcfAt15, evNetCashSep, evVal, peV, EVH_ex27, EVH_6, EVH_12, SENS,
  rating, ruleText, buyBelow, sellAbove, ST, br, withTp, medTp, implEvAtPrice, epsCagr, salesCagr, ebitdaCagr, ptEbitda, ptPerShare };

if (require.main === module) {
  const Y = module.exports;
  console.log('factor PE', sectorCalc.toFixed(2), 'EV', sectorEvCalc.toFixed(2), '| 12m EV', sector12, '6m EV', sector6, '| own EV move', ownEvMv.toFixed(1), 'PE move', ownPeMv.toFixed(1));
  console.log('MULT', MULT, 'PE', PEM_D, 'ok?', multOk, peOk, '| TP', V.tp, V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'bull', SC.bull.tp, 'bear', SC.bear.tp);
  console.log('EBITDA Sep28', n0(ebitdaSep), 'net cash Sep28', n0(evNetCashSep), 'EPS Sep28', epsSep28.toFixed(2), 'gNeeded', n1(gNeeded), 'dcf@12', n0(dcfAt12), 'dcf@15', n0(dcfAt15), 'engine dcf', V.intrinsicTp, 'ke', ke);
  console.log('ex27', EVH_ex27.med, '12m', EVH_12.med, '6m', EVH_6.med, '| implEV', n1(implEvAtPrice), 'buyBelow', buyBelow, 'sellAbove', sellAbove, 'medTp', medTp);
  console.log('SENS', SENS.map(r => `${r.name.slice(0, 40)}: ${r.mult}x ${r.tp} (${r.up.toFixed(0)}%)`).join(' | '));
  console.log('cdmo', CDMO.map(s => `${s} ${P[s].evEbitda}/${P[s].pe}`).join(' '));
}
