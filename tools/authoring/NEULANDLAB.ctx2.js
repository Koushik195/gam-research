// Neuland Laboratories initiation: shared context, part 2 (valuation layer). Re-exports part 1 plus: the pharma sector factor
// (nine peers, five-year: +8.2% P/E / +7.5% EV/EBITDA, reproduced peer by peer; same-window moves for the break windows),
// the derived multiples (must equal assumptions.json; NEULANDLAB.mult.js writes them), the forward EV/EBITDA history,
// checks, a reverse-DCF test, sensitivity rows, peers and the street as it stood on 30-Sep-2026.
const X = require('./NEULANDLAB.ctx');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const { fs, path, ROOT, D, M, F, V, A, AS, SC, ASOF, FROM, BREAK, BREAK2, FIVE, n0, n1, pc1, half, cagr, medOf, b, ai, sep, price, SHARES, mcap, Q1, epsRep, epsU, px, stat, fyOf, HB, HREP, HSCR, HBRK, HBRK2, CO_NC0 } = X;

// 6) Sector factors (PLAYBOOK §7c): peers' trailing multiple at the 30-Sep close vs their medians over a window
const PEER_SET = D.peers.set, CTX = D.peers.context;
const ALLS = [...new Set([...PEER_SET, ...CTX, 'NEULANDLAB'])];
const PEERS = peersAsOf(ALLS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const raw = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
const medFrom = (sym, ch, key, from) => medOf((raw(sym).charts?.[ch]?.[key] || []).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const moveOf = (syms, metric, from) => Object.fromEntries(syms.map(s => { const m = metric === 'pe' ? medFrom(s, 'pe', 'Price to Earning', from) : medFrom(s, 'evEbitda', 'EV Multiple', from); const cur = metric === 'pe' ? P[s].pe : P[s].evEbitda; return [s, { cur, med: m, mv: (cur / m - 1) * 100 }]; }));
const MW = moveOf([...PEER_SET, 'NEULANDLAB'], 'pe', FIVE), MWEV = moveOf([...PEER_SET, 'NEULANDLAB'], 'ev', FIVE);
const MBRK = moveOf(PEER_SET, 'pe', BREAK), MBRK2 = moveOf(PEER_SET, 'pe', BREAK2), MSINCE = moveOf(PEER_SET, 'pe', FROM);
const medMv = (obj, syms) => medOf(syms.map(s => obj[s].mv));
const sectorCalc = medMv(MW, PEER_SET), sectorEvCalc = medMv(MWEV, PEER_SET), sectorBrk = medMv(MBRK, PEER_SET), sectorBrk2 = medMv(MBRK2, PEER_SET), sectorSince = medMv(MSINCE, PEER_SET);
const SECTOR = 8.2, SECTOR_EV = 7.5; // given in the brief (names outside the nine-name set, five-year); our reproduction is sectorCalc / sectorEvCalc
const k = 1 + SECTOR / 100, kev = 1 + SECTOR_EV / 100;
if (Math.abs(sectorCalc - SECTOR) > 0.1 || Math.abs(sectorEvCalc - SECTOR_EV) > 0.1) console.warn(`WARNING: NEULANDLAB factor reproduces at ${sectorCalc.toFixed(2)}% / ${sectorEvCalc.toFixed(2)}% vs ${SECTOR}% / ${SECTOR_EV}%`);
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma', NEULANDLAB: 'Neuland Labs', SAILIFE: 'Sai Life Sciences', ANTHEM: 'Anthem Biosciences', ACUTAAS: 'Acutaas Chemicals', SYNGENE: 'Syngene', COHANCE: 'Cohance Lifesciences', GRANULES: 'Granules India', GLAND: 'Gland Pharma' }[s] || s);

// 7) Target multiples (derived; base on FY25 EPS before the property gain, which our forecasts do not carry)
const MULT = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };
const FM = forwardMedian('NEULANDLAB', M, { from: FROM }); // house function: every 5th week, reported EPS, trough years left out

// 8) Forward EV/EBITDA since 1-Apr-2021: EV at each weekly close = price × 1.283 cr shares (unchanged since 2018) − last published
//    company net cash; ÷ next full fiscal year's EBITDA (Screener basis; our FY27E/FY28E) × the peers' EV/EBITDA move (five-year)
const NC_PUB = [['2021-04-01', -209], ['2021-05-15', -156], ['2022-05-15', -212], ['2023-05-15', -63], ['2024-05-15', 32.6], ['2025-05-15', 228.7], ['2026-05-12', 156.8], ['2026-08-05', 308.5]];
const ncAt = d => NC_PUB.filter(([x]) => x <= d).at(-1)[1];
const ebBy = { 2023: A.ebitda[ai('FY23')], 2024: A.ebitda[ai('FY24')], 2025: A.ebitda[ai('FY25')], 2026: A.ebitda[b], 2027: F.ebitda[0], 2028: F.ebitda[1] };
const sEv = px.map(([d, p]) => [d, Math.round((p * SHARES - ncAt(d)) / ebBy[fyOf(d)] * 10) / 10]), EVH = stat(sEv);
const EVM = { base: half(EVH.med * kev), bull: half(EVH.p75 * kev), bear: half(EVH.p25 * kev) };
const EVM_PEF = half(EVH.med * k), evNowFwd = (mcap - Q1.netCash) / F.ebitda[1];
const ebitdaSep = sep(F.ebitda), treasSep = sep(F.treasury);

// 9) Checks: assumptions multiples = derivation; engine P/E value = multiple × Sep-28E EPS; target = rounded P/E value
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const multOk = ['base', 'bull', 'bear'].every(c => PEM.multiple[c] === MULT[c]), evOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === EVM[c]);
const epsSep28 = mv('pe').metric;
if (!process.env.TP_NOCHECK) {
  if (!X.oiOk) throw new Error(`NEULANDLAB other income: build ${X.oiBuild} vs assumptions ${AS.otherIncome}; run TP_NOCHECK=1 node tools/authoring/NEULANDLAB.mult.js`);
  if (!X.intOk) throw new Error(`NEULANDLAB interest: build ${X.intBuild.map(x => x.toFixed(2))} vs assumptions ${AS.interest}`);
  if (!multOk || !evOk) throw new Error(`NEULANDLAB: assumptions multiples differ from the derivation (P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}); run TP_NOCHECK=1 node tools/authoring/NEULANDLAB.mult.js`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'pe').value; if (tp !== Math.round(pv / 10) * 10) throw new Error(`NEULANDLAB ${c} target ${tp} is not the P/E value ${Math.round(pv)}`); });
}

// 10) Reverse-DCF test (same mechanics as src/forecast.js dcf(), flat growth FY28-41E): growth the price needs
const DC = AS.dcf, tTax = AS.taxRate[2] / 100, ke = V.ke;
const dcfAt = g => { let s = F.sales[0], pv = 0, last = null; const n = DC.years;
  for (let kk = 1; kk <= n; kk++) { const sF = (kk - 3 + 1) / (n - 3 + 1); const m = kk < 3 ? F.ebitdaMargin[kk] : F.ebitdaMargin[2] + (DC.fadeMarginTo - F.ebitdaMargin[2]) * sF; const cx = kk < 3 ? F.capex[kk] / F.sales[kk] * 100 : F.capex[2] / F.sales[2] * 100 + (DC.fadeCapexPctTo - F.capex[2] / F.sales[2] * 100) * sF;
    s *= 1 + g / 100; const e = s * m / 100, dep = s * DC.depPctOfSales / 100, f = (e - dep) * (1 - tTax) + dep - s * cx / 100 - F.owcPct / 100 * s * (g / (100 + g)); pv += f / Math.pow(1 + ke / 100, kk - 0.5); last = f; }
  const tv = last * (1 + DC.terminalGrowth / 100) / ((ke - DC.terminalGrowth) / 100) / Math.pow(1 + ke / 100, n);
  return (pv + tv + F.treasury[0]) / SHARES * Math.pow(1 + ke / 100, 0.5); };
let lo = 0, hi = 60; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (dcfAt(mid) < price) lo = mid; else hi = mid; }
const gNeeded = (lo + hi) / 2, dcfAt20 = dcfAt(20), dcfAt25 = dcfAt(25);

// 11) Sensitivity rows (not used in the base)
const peV = (m, e) => Math.round(m * e / 10) * 10;
const epsCagr = cagr(epsRep[2026], epsU[2], 3), salesCagr = cagr(A.sales[b], F.sales[2], 3), ebitdaCagr = cagr(A.ebitda[b], F.ebitda[2], 3);
const ownMv = MW.NEULANDLAB.mv, ownEvMv = MWEV.NEULANDLAB.mv;
const SENS = [
  { name: `House base: median since 1-Apr-2021 (every weekly close; FY25 EPS before the property gain) × ${k.toFixed(3)}`, mult: MULT.base, why: `${n1(HB.med)}x × ${k.toFixed(3)}` },
  { name: 'Reported EPS (FY25 ₹202.7 incl. the ₹76.4 cr gain), every weekly close', mult: half(HREP.med * k), why: `${n1(HREP.med)}x × ${k.toFixed(3)}` },
  { name: `Screener's split of the gain (FY25 EPS ₹${n1(X.eps25scr)})`, mult: half(HSCR.med * k), why: `${n1(HSCR.med)}x × ${k.toFixed(3)}` },
  { name: 'House forwardMedian (every 5th week, reported EPS, trough rule applied)', mult: half(FM.median * k), why: `${n1(FM.median)}x × ${k.toFixed(3)}; trough years: ${FM.troughYears.length ? FM.troughYears.join(', ') : 'none'}` },
  { name: `Window from the earnings break (1-Apr-2022, FY23 the first stepped-up year) × the peers' move over that window (${pc1(sectorBrk)})`, mult: half(HBRK.med * (1 + sectorBrk / 100)), why: `${n1(HBRK.med)}x × ${(1 + sectorBrk / 100).toFixed(3)}` },
  { name: `Window from 1-Apr-2023 (EPS at the FY24 level) × the peers' move over that window (${pc1(sectorBrk2)})`, mult: half(HBRK2.med * (1 + sectorBrk2 / 100)), why: `${n1(HBRK2.med)}x × ${(1 + sectorBrk2 / 100).toFixed(3)}` },
  { name: 'No sector factor (own median only)', mult: half(HB.med), why: `${n1(HB.med)}x` },
  { name: `Blend with Neuland's own move (${pc1(ownMv)} vs its five-year median; not house policy)`, mult: half(HB.med * (1 + (SECTOR + ownMv) / 200)), why: `midpoint of ${pc1(SECTOR)} and ${pc1(ownMv)}` },
  { name: `Growth view: PEG 2.0x on our FY26-29E EPS growth (${n1(epsCagr)}%; not house policy)`, mult: half(2.0 * epsCagr), why: `2.0 × ${n1(epsCagr)}` },
  { name: 'Street P/E user: Nuvama 48x H1FY28E (applied to our Sep-28E EPS)', mult: 48, why: 'Nuvama, 9-Dec-2025' },
].map(r => ({ ...r, tp: peV(r.mult, epsSep28), up: (r.mult * epsSep28 / price - 1) * 100 }));
const implPeAtPrice = price / epsSep28;

// 12) Rating from the house rule; street as it stood on 30-Sep-2026
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, br = n => ST.find(s => s.broker.startsWith(n));
const withTp = ST.filter(s => s.tp && !/older/.test(s.broker)), medTp = medOf(withTp.map(s => s.tp)), CONS = D.street.consensus;
const gs = br('Goldman'), nuv = br('Nuvama'), unk = br('Unnamed'), bk = br('B&K');
const evStreet = Math.round((30 * ebitdaSep + treasSep) / SHARES / 10) * 10; // 30x EV/EBITDA on our Sep-28E EBITDA

// 13) Growth, returns, capital
const capY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const capex6 = capY.reduce((s, y) => s + (A.capex[ai(y)] || 0), 0), cfo6 = capY.reduce((s, y) => s + (A.cfo[ai(y)] || 0), 0);
const salesCagr10 = cagr(A.sales[ai('FY16')], A.sales[b], 10), divYield = F.dps[0] / price * 100;
const ptEbitda = sep(F.sales) / 100, ptEps = ptEbitda * (1 - AS.taxRate[1] / 100) / SHARES;

module.exports = { ...X, PEER_SET, CTX, PEERS, P, MW, MWEV, MBRK, MBRK2, MSINCE, sectorCalc, sectorEvCalc, sectorBrk, sectorBrk2, sectorSince, SECTOR, SECTOR_EV, k, kev, shortName, MULT, FM,
  NC_PUB, sEv, EVH, EVM, EVM_PEF, evNowFwd, ebitdaSep, treasSep, BM, mv, multOk, evOk, epsSep28, gNeeded, dcfAt20, dcfAt25, peV, epsCagr, salesCagr, ebitdaCagr, ownMv, ownEvMv, SENS, implPeAtPrice,
  rating, ratingFor, ruleText, buyBelow, sellAbove, ST, br, withTp, medTp, CONS, gs, nuv, unk, bk, evStreet, capex6, cfo6, salesCagr10, divYield, ptEbitda, ptEps };
