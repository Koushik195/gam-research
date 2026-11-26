// Concord Biotech initiation: shared context, part 2 (valuation layer). Re-exports part 1 plus: the pharma sector factor over
// Concord's own window (nine peers' trailing multiple at the 30-Sep close vs each peer's median since 1-Jan-2024: +10.7% P/E,
// +4.3% EV/EBITDA, reproduced peer by peer; tools/authoring/sector-factor.js --from 2024-01-01), the derived multiples (must
// equal assumptions.json; CONCORDBIO.mult.js writes them), the forward EV/EBITDA history, checks, a reverse-DCF test,
// sensitivity rows, peers (Concord's own row computed here: asof-peers.js reads the bonus-adjusted Screener file) and the street.
const X = require('./CONCORDBIO.ctx');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const { fs, path, ROOT, D, M, F, V, A, AS, SC, ASOF, FROM, LISTED, n1, pc1, half, cagr, medOf, b, ai, sep, price, SHARES, SHARES_PRE, mcap, epsRep, epsU, sAll, stat, fyOf, HB, pxAll, NC_JUN26, trailPe, trailEv } = X;

// 5) Sector factors (PLAYBOOK §7c): peers' trailing multiple at the 30-Sep close vs their medians over a window
const PEER_SET = D.peers.set, CTX = D.peers.context;
const PEERS = peersAsOf([...new Set([...PEER_SET, ...CTX])], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const raw = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
const medFrom = (sym, ch, key, from) => medOf((raw(sym).charts?.[ch]?.[key] || []).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const moveOf = (syms, metric, from) => Object.fromEntries(syms.map(s => { const m = metric === 'pe' ? medFrom(s, 'pe', 'Price to Earning', from) : medFrom(s, 'evEbitda', 'EV Multiple', from); const cur = metric === 'pe' ? P[s].pe : P[s].evEbitda; return [s, { cur, med: m, mv: (cur / m - 1) * 100 }]; }));
const medMv = obj => medOf(PEER_SET.map(s => obj[s].mv));
const MW = moveOf(PEER_SET, 'pe', FROM), MWEV = moveOf(PEER_SET, 'ev', FROM), M5 = moveOf(PEER_SET, 'pe', '2021-09-30');
const MLIST = moveOf(PEER_SET, 'pe', LISTED), MNOV = moveOf(PEER_SET, 'pe', '2023-11-01'), MMAR = moveOf(PEER_SET, 'pe', '2024-03-01'), MAPR25 = moveOf(PEER_SET, 'pe', '2025-04-01');
const sectorCalc = medMv(MW), sectorEvCalc = medMv(MWEV), sector5 = medMv(M5);
const SECTOR = 10.7, SECTOR_EV = 4.3; // tools/authoring/sector-factor.js --from 2024-01-01 (P/E / EV); our reproduction is sectorCalc / sectorEvCalc
const k = 1 + SECTOR / 100, kev = 1 + SECTOR_EV / 100;
if (Math.abs(sectorCalc - SECTOR) > 0.15 || Math.abs(sectorEvCalc - SECTOR_EV) > 0.15) console.warn(`WARNING: CONCORDBIO factor reproduces at ${sectorCalc.toFixed(2)}% / ${sectorEvCalc.toFixed(2)}% vs ${SECTOR}% / ${SECTOR_EV}%`);
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma', NEULANDLAB: 'Neuland Labs', GRANULES: 'Granules India', GLAND: 'Gland Pharma', ANTHEM: 'Anthem Biosciences', SAILIFE: 'Sai Life Sciences', CONCORDBIO: 'Concord Biotech' }[s] || s);

// 6) Target multiples (derived): own median since 1-Jan-2024 x the same-window factor, nearest half-turn; bull/bear = 75th/25th
const MULT = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };

// 7) Forward EV/EBITDA since 1-Jan-2024: EV = price x 10.46 cr shares - last published net cash (Screener basis: cash +
//    investments - leases); / next full fiscal year's EBITDA (Screener basis; our FY27E/FY28E) x the peers' same-window EV move
const NC_PUB = [['2023-08-18', 148], ['2024-05-24', 283], ['2025-05-29', 333], ['2026-05-29', X.ND0], ['2026-08-01', NC_JUN26]];
const ncAt = d => NC_PUB.filter(([x]) => x <= d).at(-1)[1];
const ebBy = { 2024: A.ebitda[ai('FY24')], 2025: A.ebitda[ai('FY25')], 2026: A.ebitda[b], 2027: F.ebitda[0], 2028: F.ebitda[1] };
const evTrough = { 2026: { e: ebBy[2026], line: 0.5 * Math.max(ebBy[2025], ebBy[2024], A.ebitda[ai('FY23')]) }, 2027: { e: ebBy[2027], line: 0.5 * Math.max(ebBy[2026], ebBy[2025], ebBy[2024]) } };
const sEvAll = pxAll.map(([d, p]) => [d, Math.round((p * SHARES_PRE - ncAt(d)) / ebBy[fyOf(d)] * 10) / 10]);
const sEv = sEvAll.filter(([d]) => d >= FROM), EVH = stat(sEv);
const EVM = { base: half(EVH.med * kev), bull: half(EVH.p75 * kev), bear: half(EVH.p25 * kev) };
const EVM_PEF = half(EVH.med * k), ebitdaSep = sep(F.ebitda), treasSep = sep(F.treasury), evNowFwd = (mcap - NC_JUN26) / F.ebitda[1];

// 8) Checks: assumptions multiples = derivation; target = rounded P/E value
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const multOk = ['base', 'bull', 'bear'].every(c => PEM.multiple[c] === MULT[c]), evOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === EVM[c]);
const epsSep28 = mv('pe').metric;
if (!process.env.TP_NOCHECK) {
  if (!X.oiOk) throw new Error(`CONCORDBIO other income: build ${X.oiBuild} vs assumptions ${AS.otherIncome}; run TP_NOCHECK=1 node tools/authoring/CONCORDBIO.mult.js`);
  if (!multOk || !evOk) throw new Error(`CONCORDBIO: assumptions multiples differ from the derivation (P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}); run node tools/authoring/CONCORDBIO.mult.js`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'pe').value; if (tp !== Math.round(pv / 10) * 10) throw new Error(`CONCORDBIO ${c} target ${tp} is not the P/E value ${Math.round(pv)}`); });
}

// 9) Reverse-DCF test (same mechanics as src/forecast.js dcf(), flat growth FY28-41E): growth the price needs
const DC = AS.dcf, tTax = AS.taxRate[2] / 100, ke = V.ke;
const dcfAt = g => { let s = F.sales[0], pv = 0, last = null; const n = DC.years;
  for (let kk = 1; kk <= n; kk++) { const sF = (kk - 3 + 1) / (n - 3 + 1); const m = kk < 3 ? F.ebitdaMargin[kk] : F.ebitdaMargin[2] + (DC.fadeMarginTo - F.ebitdaMargin[2]) * sF; const cx = kk < 3 ? F.capex[kk] / F.sales[kk] * 100 : F.capex[2] / F.sales[2] * 100 + (DC.fadeCapexPctTo - F.capex[2] / F.sales[2] * 100) * sF;
    s *= 1 + g / 100; const e = s * m / 100, dep = s * DC.depPctOfSales / 100, f = (e - dep) * (1 - tTax) + dep - s * cx / 100 - F.owcPct / 100 * s * (g / (100 + g)); pv += f / Math.pow(1 + ke / 100, kk - 0.5); last = f; }
  const tv = last * (1 + DC.terminalGrowth / 100) / ((ke - DC.terminalGrowth) / 100) / Math.pow(1 + ke / 100, n);
  return (pv + tv + F.treasury[0]) / SHARES * Math.pow(1 + ke / 100, 0.5); };
let lo = 0, hi = 60; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (dcfAt(mid) < price) lo = mid; else hi = mid; }
const gNeeded = (lo + hi) / 2, dcfAt20 = dcfAt(20);

// 10) Sensitivity rows (not used in the base); each own window pairs with the peers' move over that same window
const peV = (m, e) => Math.round(m * e / 10) * 10;
const fac = o => 1 + medMv(o) / 100;
const SENS = [
  { name: `Base: own median since 1-Jan-2024 (every weekly close, reported EPS) x the same-window factor`, mult: MULT.base, why: `${n1(HB.med)}x x ${k.toFixed(3)}` },
  { name: 'Window from listing (18-Aug-2023), x the peers\' move since then', mult: half(X.HLIST.med * fac(MLIST)), why: `${n1(X.HLIST.med)}x x ${fac(MLIST).toFixed(3)}` },
  { name: 'Window from 1-Nov-2023 (after the 90-day anchor lock-in), same-window factor', mult: half(X.HNOV.med * fac(MNOV)), why: `${n1(X.HNOV.med)}x x ${fac(MNOV).toFixed(3)}` },
  { name: 'Window from 1-Mar-2024 (after the six-month pre-IPO lock-in), same-window factor', mult: half(X.HMAR.med * fac(MMAR)), why: `${n1(X.HMAR.med)}x x ${fac(MMAR).toFixed(3)}` },
  { name: 'Leave out the 52 weeks priced on FY26 EPS (the dip year; not a trough under the rule)', mult: half(X.HEX26.med * k), why: `${n1(X.HEX26.med)}x x ${k.toFixed(3)}` },
  { name: 'Window from 1-Apr-2025 (only points priced on FY27E/FY28E), same-window factor', mult: half(X.HAPR25.med * fac(MAPR25)), why: `${n1(X.HAPR25.med)}x x ${fac(MAPR25).toFixed(3)}` },
  { name: 'House-style sampling (every 5th week) on the bonus-corrected series', mult: half(X.H5W.med * k), why: `${n1(X.H5W.med)}x x ${k.toFixed(3)}` },
  { name: 'No sector factor (own median only)', mult: half(HB.med), why: `${n1(HB.med)}x` },
  { name: 'Street P/E user: Choice 40x FY28E (Aug-2026)', mult: 40, why: 'Choice, 4-Aug-2026' },
  { name: 'Street P/E user: Antique 25x FY28E (Jan-2026)', mult: 25, why: 'Antique, 6-Jan-2026' },
].map(r => ({ ...r, tp: peV(r.mult, epsSep28), up: (r.mult * epsSep28 / price - 1) * 100 }));
const implPeAtPrice = price / epsSep28;

// 11) Rating from the house rule; street as it stood on 30-Sep-2026
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, br = n => ST.find(s => s.broker.startsWith(n));
const withTp = ST.filter(s => s.tp), medTp = medOf(withTp.map(s => s.tp)), CONS = D.street.consensus;
const choice = br('Choice'), antique = br('Antique'), kotak = br('Kotak'), citi = br('Citi'), jef = br('Jefferies');

// 12) Growth, returns; Concord's own peer row (pre-bonus basis)
const epsCagr = cagr(epsRep[2026], epsU[2], 3), salesCagr = cagr(A.sales[b], F.sales[2], 3), ebitdaCagr = cagr(A.ebitda[b], F.ebitda[2], 3);
const salesCagr9 = cagr(A.sales[ai('FY16')], A.sales[ai('FY25')], 9), divYield = F.dps[0] / price * 100;
const OWN = { symbol: 'CONCORDBIO', mcapCr: Math.round(mcap), revenue: A.sales[b], ebitdaMargin: Math.round(A.ebitdaMargin[b] * 10) / 10, pe: Math.round(trailPe * 10) / 10, evEbitda: Math.round(trailEv * 10) / 10, roe: Math.round(A.roe[b] * 10) / 10 };
const ownFwdMv = (X.fwdNow / HB.med - 1) * 100;

module.exports = { ...X, PEER_SET, CTX, PEERS, P, MW, MWEV, M5, MLIST, MNOV, MMAR, MAPR25, sectorCalc, sectorEvCalc, sector5, SECTOR, SECTOR_EV, k, kev, shortName, MULT, NC_PUB, ncAt, ebBy, evTrough, sEvAll, sEv, EVH, EVM, EVM_PEF, ebitdaSep, treasSep, evNowFwd,
  BM, mv, multOk, evOk, epsSep28, ke, gNeeded, dcfAt20, peV, SENS, implPeAtPrice, rating, ratingFor, ruleText, buyBelow, sellAbove, ST, br, withTp, medTp, CONS, choice, antique, kotak, citi, jef, epsCagr, salesCagr, ebitdaCagr, salesCagr9, divYield, OWN, ownFwdMv };
