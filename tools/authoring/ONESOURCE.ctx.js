// OneSource Specialty Pharma initiation: shared context for the Part B files (research.js, part2-6). Part A of the context
// (inputs, builds, forward histories) is ONESOURCE.ctxA.js; this file adds the pharma sector factor over OneSource's own
// window (nine peers, PLAYBOOK §7c same-window rule, reproduced peer by peer from Screener and asof-peers.js), the derived
// multiples (must equal assumptions.json; ONESOURCE.mult.js writes them), the checks, a reverse-DCF test, sensitivity rows,
// the CDMO peers and the street as it stood on 30-Sep-2026. Re-exports everything in ctxA.
const X0 = require('./ONESOURCE.ctxA');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const { fs, path, ROOT, D, F, V, A, AS, SC, ASOF, FROM, ALT1, ALT2, half, medOf, sep, price, SHARES, EVH, PEH, EVH1, EVH2, PEH2, epsU, epsAdj, cagr, b, BS, ndLease, cashPath } = X0;

// 1) Sector factor (PLAYBOOK §7c): nine peers' trailing multiple at the 30-Sep close vs their medians over the same window
const PEER_SET = D.peers.set, CDMO = D.peers.cdmo, ALLS = [...new Set([...PEER_SET, ...CDMO, 'ONESOURCE'])];
const PEERS = peersAsOf(ALLS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const raw = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const medFrom = (s, ch, key, from) => medOf((raw(s).charts?.[ch]?.[key] || []).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const moveSet = (from, metric) => Object.fromEntries(ALLS.filter(s => s !== 'ONESOURCE' || metric === 'ev').map(s => {
  const m = metric === 'pe' ? medFrom(s, 'pe', 'Price to Earning', from) : medFrom(s, 'evEbitda', 'EV Multiple', from);
  const cur = metric === 'pe' ? P[s].pe : P[s].evEbitda; return [s, { cur, med: m, mv: (cur / m - 1) * 100 }]; }));
const W = { ev: moveSet(FROM, 'ev'), pe: moveSet(FROM, 'pe'), ev1: moveSet(ALT1, 'ev'), pe1: moveSet(ALT1, 'pe'), ev2: moveSet(ALT2, 'ev'), pe2: moveSet(ALT2, 'pe'), ev5: moveSet('2021-09-30', 'ev') };
const fac = key => medOf(PEER_SET.map(s => W[key][s].mv));
const sectorEvCalc = fac('ev'), sectorPeCalc = fac('pe');
const SECTOR_EV = -1.7, SECTOR_PE = -0.6; // node tools/authoring/sector-factor.js --from 2026-05-13 --metric ev|pe
const ALT_F = { ev1: fac('ev1'), pe1: fac('pe1'), ev2: fac('ev2'), pe2: fac('pe2'), ev5: fac('ev5') };
if (Math.abs(sectorEvCalc - SECTOR_EV) > 0.1 || Math.abs(sectorPeCalc - SECTOR_PE) > 0.1) console.warn(`WARNING: ONESOURCE factor reproduces at ${sectorEvCalc.toFixed(2)}% / ${sectorPeCalc.toFixed(2)}% vs ${SECTOR_EV}% / ${SECTOR_PE}%`);
const kev = 1 + SECTOR_EV / 100, k = 1 + SECTOR_PE / 100;
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma', SYNGENE: 'Syngene', SAILIFE: 'Sai Life Sciences', ANTHEM: 'Anthem Biosciences', GLAND: 'Gland Pharma', PPLPHARMA: 'Piramal Pharma', COHANCE: 'Cohance Lifesciences', ACUTAAS: 'Acutaas Chemicals', ONESOURCE: 'OneSource' }[s] || s);

// 2) Target multiples (derived): own forward median x same-window factor, nearest half-turn; bull/bear = 75th/25th pct
const EVM = { base: half(EVH.med * kev), bull: half(EVH.p75 * kev), bear: half(EVH.p25 * kev) };
const PEM = { base: half(PEH.med * k), bull: half(PEH.p75 * k), bear: half(PEH.p25 * k) };

// 3) Checks: assumptions multiples = derivation; engine EV value = multiple x Sep-28E EBITDA + net debt; target = rounded EV value
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const meth = key => AS.valuation.blend.methods.find(x => x.key === key);
const same = (a, c) => ['base', 'bull', 'bear'].every(x => a[x] === c[x]);
const multOk = same(meth('ev').multiple, EVM) && same(meth('pe').multiple, PEM);
const ebitdaSep = sep(F.ebitda), treasSep = sep(F.treasury), epsSep28 = mv('pe').metric, epsAdjSep = sep(epsAdj);
if (!process.env.TP_NOCHECK) {
  if (!X0.oiOk) throw new Error(`ONESOURCE other income: build ${X0.oiBuild} vs assumptions ${AS.otherIncome}`);
  if (!X0.intOk) throw new Error(`ONESOURCE interest: build ${X0.intBuild.map(x => x.toFixed(2))} vs ${AS.interest}; run TP_NOCHECK=1 node tools/authoring/ONESOURCE.mult.js`);
  if (!multOk) throw new Error(`ONESOURCE: assumptions multiples differ from the derivation (EV ${JSON.stringify(EVM)}, P/E ${JSON.stringify(PEM)}); run TP_NOCHECK=1 node tools/authoring/ONESOURCE.mult.js`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const ev = S.blend.methods.find(m => m.key === 'ev').value; if (tp !== Math.round(ev / 10) * 10) throw new Error(`ONESOURCE ${c} target ${tp} is not the EV/EBITDA value ${Math.round(ev)}`); });
}

// 4) Reverse-DCF test (same mechanics as src/forecast.js dcf(), flat growth FY28-42E): growth the price needs
const DC = AS.dcf, tTax = AS.taxRate[2] / 100, ke = V.ke;
const dcfAt = g => { let s = F.sales[0], pv = 0, last = null; const n = DC.years;
  for (let kk = 1; kk <= n; kk++) { const sF = (kk - 3 + 1) / (n - 3 + 1); const m = kk < 3 ? F.ebitdaMargin[kk] : F.ebitdaMargin[2] + (DC.fadeMarginTo - F.ebitdaMargin[2]) * sF; const cx = kk < 3 ? F.capex[kk] / F.sales[kk] * 100 : F.capex[2] / F.sales[2] * 100 + (DC.fadeCapexPctTo - F.capex[2] / F.sales[2] * 100) * sF;
    s *= 1 + g / 100; const e = s * m / 100, dep = s * DC.depPctOfSales / 100, f = (e - dep) * (1 - tTax) + dep - s * cx / 100 - F.owcPct / 100 * s * (g / (100 + g)); pv += f / Math.pow(1 + ke / 100, kk - 0.5); last = f; }
  const tv = last * (1 + DC.terminalGrowth / 100) / ((ke - DC.terminalGrowth) / 100) / Math.pow(1 + ke / 100, n);
  return (pv + tv + F.treasury[0]) / SHARES * Math.pow(1 + ke / 100, 0.5); };
let lo = 0, hi = 60; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (dcfAt(mid) < price) lo = mid; else hi = mid; }
const gNeeded = (lo + hi) / 2, dcfAt15 = dcfAt(15);

// 5) Sensitivity rows (EV/EBITDA on Sep-28E EBITDA plus Sep-28E engine net debt; not used in the base)
const evV = (m, nd = treasSep) => Math.round((m * ebitdaSep + nd) / SHARES / 10) * 10;
const SENS = [
  { name: `Base: median since ${X0.FROM_TXT} × ${kev.toFixed(3)}`, mult: EVM.base, why: `${X0.n1(EVH.med)}x × ${kev.toFixed(3)}` },
  { name: 'Window from 1-Apr-2026 (forward year FY28E throughout)', mult: half(EVH1.med * (1 + ALT_F.ev1 / 100)), why: `${X0.n1(EVH1.med)}x × ${(1 + ALT_F.ev1 / 100).toFixed(3)}` },
  { name: 'Full post-listing window from the FY25 results (5-May-2025)', mult: half(EVH2.med * (1 + ALT_F.ev2 / 100)), why: `${X0.n1(EVH2.med)}x × ${(1 + ALT_F.ev2 / 100).toFixed(3)}; 47 of 74 points on FY27E, a ramp-up year` },
  { name: 'No sector factor (own median only)', mult: half(EVH.med), why: `${X0.n1(EVH.med)}x` },
  { name: 'Five-year pharma EV/EBITDA factor (+7.5%, not this window)', mult: half(EVH.med * 1.075), why: `${X0.n1(EVH.med)}x × 1.075` },
  { name: `Blend with OneSource's own move (${X0.pc1(W.ev.ONESOURCE.mv)}; not house policy)`, mult: half(EVH.med * (1 + (SECTOR_EV + W.ev.ONESOURCE.mv) / 200)), why: 'Midpoint of sector and own trailing moves' },
  { name: 'Street: ICICI Securities 16-19x FY28E (SOTP range)', mult: 17.5, why: 'Midpoint of 16x and 19x on our Sep-28E EBITDA' },
  { name: 'Street: JM Financial 22x Sep-27E', mult: 22, why: 'On our Sep-28E EBITDA (a year later than JM)' },
].map(r => ({ ...r, tp: evV(r.mult), up: (evV(r.mult) / price - 1) * 100 }));
const leaseTp = evV(EVM.base, ndLease);

// 6) Rating from the house rule; street as it stood on 30-Sep-2026
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, br = n => ST.find(s => s.broker.startsWith(n));
const withTp = ST.filter(s => s.tp), medTp = medOf(withTp.map(s => s.tp));
const isec = br('ICICI'), jm = br('JM'), sbi = br('SBICAP'), dam = br('DAM'), inv = br('Investec');
const atOurs = { jm: (22 * (F.ebitda[0] + F.ebitda[1]) / 2 + (F.treasury[0] + F.treasury[1]) / 2) / SHARES, inv: (23 * F.ebitda[0] + F.treasury[0]) / SHARES, isecLo: (16 * F.ebitda[1] + F.treasury[1]) / SHARES, isecHi: (19 * F.ebitda[1] + F.treasury[1]) / SHARES, dam: 30 * epsU[1], damAdj: 30 * epsAdj[1] };

// 7) Growth, sensitivities to margin, returns
const salesCagr = cagr(A.sales[b], F.sales[2], 3), ebitdaCagr = cagr(A.ebitda[b], F.ebitda[2], 3);
const ptEbitda = ebitdaSep / F.ebitdaMargin.slice(1).reduce((s, x) => s + x, 0) * 2; // Rs cr of Sep-28E EBITDA per margin point
const ptShare = ptEbitda * EVM.base / SHARES;

module.exports = { ...X0, PEER_SET, CDMO, PEERS, P, W, fac, sectorEvCalc, sectorPeCalc, SECTOR_EV, SECTOR_PE, ALT_F, kev, k, shortName, EVM, PEM, BM, mv, multOk, ebitdaSep, treasSep, epsSep28, epsAdjSep,
  gNeeded, dcfAt15, evV, SENS, leaseTp, rating, ruleText, buyBelow, sellAbove, ST, br, withTp, medTp, isec, jm, sbi, dam, inv, atOurs, salesCagr, ebitdaCagr, ptEbitda, ptShare };

if (require.main === module) {
  const n1 = X0.n1, n0 = X0.n0;
  console.log('cash path', cashPath.map(n0), 'OI', X0.oiBuild, X0.oiOk, 'int build', X0.intBuild.map(x => x.toFixed(2)), 'vs', AS.interest, X0.intOk);
  console.log('EPS', epsU.map(x => x.toFixed(2)), 'adj', epsAdj.map(x => x.toFixed(2)), 'Sep28', epsSep28.toFixed(2), 'EBITDA Sep28', n0(ebitdaSep), 'ND Sep28', n0(treasSep));
  console.log('EVH', JSON.stringify(EVH), 'PEH', JSON.stringify(PEH), 'EVH1', EVH1.med, 'EVH2', EVH2.med, 'PEH2', PEH2.med);
  console.log('factor EV', sectorEvCalc.toFixed(2), 'PE', sectorPeCalc.toFixed(2), 'alt', JSON.stringify(Object.fromEntries(Object.entries(ALT_F).map(([a, c]) => [a, +c.toFixed(2)]))), 'own EV move', W.ev.ONESOURCE.mv.toFixed(1));
  console.log('EVM', EVM, 'PEM', PEM, 'ok?', multOk, '| TP', V.tp, V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'bull', SC.bull.tp, 'bear', SC.bear.tp);
  console.log('gNeeded', n1(gNeeded), 'dcf@15', n0(dcfAt15), 'engine dcf', V.intrinsicTp, 'lease TP', leaseTp, '| SENS', SENS.map(r => `${r.mult}x ${r.tp}`).join(' | '));
  console.log('street med', medTp, 'at ours', JSON.stringify(Object.fromEntries(Object.entries(atOurs).map(([a, c]) => [a, Math.round(c)]))));
}
