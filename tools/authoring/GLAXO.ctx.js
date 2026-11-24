// GSK India (GLAXO) initiation: shared context for the Part B files (research.js, part2-6) and GLAXO.mult.js. Loads the
// research JSONs and the built model and computes, once: the business-line build (base business vs innovation portfolio,
// checked against model revenue), the other-income build (treasury yield on the company's net cash + recurring items,
// checked against the engine), the one-year-forward P/E history since Apr-2021 on EPS before one-offs (A18 batch practice:
// exceptional items and the FY22 brand-sale gain are material; house sampling and median) with the house forwardMedian on
// reported EPS (which flags FY23-24 as false troughs) and other sensitivities, the pharma sector factor (PLAYBOOK §7c A21:
// +8.2% P/E / +7.5% EV/EBITDA for names outside the nine-company set, reproduced per peer at the 30-Sep close), our own
// EV/EBITDA history (operating EBITDA; company net cash), the derived multiples, the street and the rating. As of
// 30-Sep-2026 (Q1FY27 basis). Data after 30-Sep-2026 is never read: Screener series are cut at the as-of date and
// quarterly data at its release date.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const PATCH = require('./GLAXO.patch');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'GLAXO', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'GLAXO.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'GLAXO', 'screener.json'), 'utf8')); // unpatched; always cut at ASOF
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2021-04-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const pc2 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}%`;
const rup = s => String(s ?? '').replace(/Rs ?(?=[0-9])/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const cagr = (a, z, y) => (Math.pow(z / a, 1 / y) - 1) * 100;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pctl = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const statOf = arr => ({ med: pctl(arr, 0.5), p25: pctl(arr, 0.25), p75: pctl(arr, 0.75), min: Math.min(...arr), max: Math.max(...arr), n: arr.length });
const SRC = 'GSK India annual reports, results and call transcripts; Screener.in; GAM Research';
const b = A.labels.length - 1; // FY26 index
const ix = fy => A.labels.indexOf(fy);
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, TR = C.treasury;
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const releasedBy = (qEnd, asOf) => { const dt = new Date(qEnd); dt.setUTCDate(dt.getUTCDate() + (dt.getUTCMonth() === 2 ? 60 : 45)); return dt.toISOString().slice(0, 10) <= asOf; };

// ---------------------------------------------------------------- 1) Business-line build (assumptions.businessLines) = model revenue
const BL = AS.businessLines, LINES = ['base', 'innovation'];
const LBL = { base: 'Base business (general medicines + established vaccines)', innovation: 'Innovation portfolio (Shingrix, Nucala, Trelegy, oncology, launches)' };
const build = Object.fromEntries(LINES.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => build.base[i] + build.innovation[i]);
if (Math.abs(BL.base.base + BL.base.innovation - A.sales[b]) > 1) throw new Error(`GLAXO business-line base ${BL.base.base + BL.base.innovation} != FY26 revenue ${A.sales[b]}`);
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`GLAXO build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });
const innovShare = i => build.innovation[i] / buildTot[i] * 100;

// ---------------------------------------------------------------- 2) Other income: treasury yield x opening net cash + recurring items
const netCash26 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - A.borrowings[b];
if (Math.abs(netCash26 - (TR.mar26.total - FY26.leaseLiabilities)) > 2) throw new Error(`GLAXO opening net cash ${n0(netCash26)} != company ${TR.mar26.total} - leases ${FY26.leaseLiabilities}`);
const openCash = YRS.map((_, i) => (i ? F.treasury[i - 1] : netCash26));
const oiTreas = YRS.map((_, i) => AS.treasuryYield[i] / 100 * openCash[i]);
YRS.forEach((y, i) => { if (Math.abs(oiTreas[i] + AS.otherIncome[i] - F.otherIncome[i]) > 1) throw new Error(`GLAXO other-income build ${y}`); });
const OIN = C.otherIncomeNote, oi26 = OIN.fy26, oi25 = OIN.fy25, TI = TR.income;
const treas26 = TI.fy26.bank + TI.fy26.mf, treas25 = TI.fy25.bank + TI.fy25.mf, recur26 = oi26.others + oi26.otherInterest + oi26.loanInterest;
const yieldOpen26 = treas26 / TR.mar25.total * 100, yieldAvg26 = treas26 / ((TR.mar25.total + TR.mar26.total) / 2) * 100;
const yieldAvg = { FY24: (TI.fy24.bank + TI.fy24.mf) / ((TR.mar23.total + TR.mar24.total) / 2) * 100, FY25: treas25 / ((TR.mar24.total + TR.mar25.total) / 2) * 100, FY26: yieldAvg26 };
const OIQ = S.schedules.quarters['Other Income']['Other income normal'];
const ttmOi = ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026'].reduce((s, p) => s + (OIQ[p] || 0), 0); // twelve months to Jun-26
const netCashCo = TR.mar26.total - FY26.leaseLiabilities; // company basis, for display (engine: netCash26, within ₹1 cr)
const debtLikePs = PATCH.X / SHARES; // tax balances and long-dated provisions per share (not deducted by the engine)

// ---------------------------------------------------------------- 3) One-year-forward P/E since Apr-2021: base on EPS before one-offs, house on reported EPS
const EXR = C.exceptional.rows, epsBase = {}, epsRep = {};
EXR.forEach(r => { const y = 2000 + +r.fy.slice(2); epsBase[y] = r.epsBefore; epsRep[y] = r.epsReported; });
const pl = S.tables['profit-loss']; pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) epsRep[+p.slice(-4)] = pl.rows['EPS in Rs'][i]; }); // Screener (house) reported EPS
YRS.forEach((y, i) => { const fy = 2000 + +y.slice(2, 4); epsBase[fy] = F.eps[i]; epsRep[fy] = F.eps[i]; });
const trough = (by, fy) => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); const pk = prev.length ? Math.max(...prev) : null; return !(by[fy] > 0) || (pk > 0 && by[fy] < 0.5 * pk); };
const PXF = S.charts.price.Price.filter(([d]) => d <= ASOF);
const px5 = PXF.filter((_, i) => i % 5 === 0).filter(([d]) => d >= FROM); // house sampling (forwardSeries)
const PX = PXF.slice(); if (PX.at(-1)[0] < ASOF) PX.push([ASOF, price]);
const pxWk = PX.filter(([d]) => d >= FROM);
const seriesOn = (by, pts, dropTroughs = true) => pts.filter(([d]) => !dropTroughs || !trough(by, fyOf(d))).map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10]);
const sBase = seriesOn(epsBase, px5), sRep = seriesOn(epsRep, px5), sRepAll = seriesOn(epsRep, px5, false), sBaseWk = seriesOn(epsBase, pxWk);
const HB = statOf(sBase.map(x => x[1])), HR = statOf(sRep.map(x => x[1])), HRA = statOf(sRepAll.map(x => x[1])), HBW = statOf(sBaseWk.map(x => x[1]));
const troughFys = by => [2023, 2024, 2025, 2026, 2027, 2028].filter(fy => trough(by, fy)).map(fy => `FY${String(fy).slice(2)}`);
const troughBase = troughFys(epsBase), troughRep = troughFys(epsRep);
const troughRows = [2023, 2024, 2025, 2026, 2027, 2028].map(fy => { const pk = by => Math.max(by[fy - 1], by[fy - 2], by[fy - 3]); return { fy: `FY${String(fy).slice(2)}${fy > 2026 ? 'E' : ''}`, rep: epsRep[fy], repPeak: pk(epsRep), repRatio: epsRep[fy] / pk(epsRep), base: epsBase[fy], basePeak: pk(epsBase), baseRatio: epsBase[fy] / pk(epsBase) }; });
const FM = forwardMedian('GLAXO', M); // house: Screener reported EPS (FY22 incl. the brand-sale gain), trough years dropped
const byFwdFy = {}; sBase.forEach(([d, x]) => (byFwdFy[fyOf(d)] ||= []).push(x));
const FWDFY = Object.keys(byFwdFy).sort().map(fy => ({ fy: `FY${String(fy).slice(2)}${+fy > 2026 ? 'E' : ''}`, med: pctl(byFwdFy[fy], 0.5), n: byFwdFy[fy].length, eps: epsBase[fy] }));
const peFY27 = price / F.eps[0], peFY28 = price / F.eps[1], peSep28 = price / sep(F.eps);
const ttmEps = A.ttm?.eps ?? M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), peTtm = price / ttmEps;
const fwdNowVsMed = (peFY28 / HB.med - 1) * 100;

// ---------------------------------------------------------------- 4) Sector factor (PLAYBOOK §7c A21): median of all nine set names (GLAXO is outside the set)
const SET = D.peers.set, EXCL = Object.keys(D.peers.excluded), ALL = [...SET, ...EXCL, 'GLAXO'];
const PEERS = peersAsOf(ALL, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const rawOf = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
const med5 = (sym, key, sub) => pctl((rawOf(sym).charts?.[key]?.[sub] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5);
const MED5 = Object.fromEntries(ALL.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const MED5EV = Object.fromEntries(ALL.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const derate = Object.fromEntries(ALL.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const derateEv = Object.fromEntries(ALL.map(s => [s, P[s].evEbitda && MED5EV[s] ? (P[s].evEbitda / MED5EV[s] - 1) * 100 : null]));
const sectorCalc = medOf(SET.map(s => derate[s])), sectorEv = medOf(SET.map(s => derateEv[s]));
const sectorAll = medOf([...SET, ...EXCL].map(s => derate[s]).filter(v => v != null));
const SET_FACTOR = D.peers.factorSet, SET_FACTOR_EV = D.peers.factorEvSet; // +8.2% / +7.5%, PLAYBOOK §7c (A21)
const FACTOR_DIFF = Math.abs(sectorCalc - SET_FACTOR) > 0.05, FACTOR_DIFF_EV = Math.abs(sectorEv - SET_FACTOR_EV) > 0.05;
if (FACTOR_DIFF || FACTOR_DIFF_EV) console.warn(`WARNING: reproduced pharma factor ${sectorCalc.toFixed(2)}% / EV ${sectorEv.toFixed(2)}% differs from the settled +${SET_FACTOR}% / +${SET_FACTOR_EV}%`);
const k = 1 + SET_FACTOR / 100, kev = 1 + SET_FACTOR_EV / 100;
const ownDr = derate.GLAXO, ownDrEv = derateEv.GLAXO;
const LARGE = ['SUNPHARMA', 'DIVISLAB', 'TORNTPHARM', 'ZYDUSLIFE'], sectorLarge = medOf(LARGE.map(s => derate[s]));
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma', GLAXO: 'GSK India' }[s] || s);

// ---------------------------------------------------------------- 5) Derived P/E multiples (base = median on EPS before one-offs x factor; bull/bear = 75th/25th percentile x factor)
const MULT = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };
const derived = HB.med * k;
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const val = m => Math.round(m * epsSep.base / 10) * 10;
const epsCagrHist = cagr(epsBase[2021], epsBase[2026], 5), epsCagrFwd = cagr(epsBase[2026], F.eps[2], 3);
const keV = V.ke, roeSus = F.roe[2], gSus = 8.5, justPe = (1 - gSus / roeSus) / ((keV - gSus) / 100);
const pegWin = HB.med / epsCagrHist, pegMult = pegWin * epsCagrFwd;
const SENS = {
  house: half(FM.median * k), repAll: half(HRA.med * k), allWeeks: half(HBW.med * k), noFactor: half(HB.med), own: half(HB.med * (1 + ownDr / 100)), mid: half(HB.med * (1 + (SET_FACTOR + ownDr) / 2 / 100)),
  all15: half(HB.med * (1 + sectorAll / 100)), large: half(HB.med * (1 + sectorLarge / 100)), peg: half(pegMult), gordon: half(justPe),
};

// ---------------------------------------------------------------- 6) Own EV/EBITDA history: (market value - company net cash) / trailing operating EBITDA
const QS = S.charts.margins['Quarter Sales'], QO = Object.fromEntries(S.charts.margins.OPM.map(([d, v]) => [d, v]));
const QE = QS.filter(([d]) => QO[d] != null).map(([d, s]) => [d, s * QO[d] / 100]);
const NCY = { 2020: 1083, 2021: 1123 }; // Mar-20/21: Screener cash + investments - borrowings (approximation)
['mar22', 'mar23', 'mar24', 'mar25', 'mar26'].forEach(m => (NCY[2000 + +m.slice(3)] = TR[m].total - TR[m].leases));
const DIVPAID = { 2021: 30, 2022: 90, 2023: 32, 2024: 32, 2025: 42, 2026: 57 }; // final dividend per share paid each August
const ncAt = d => { let v = null; for (const y of Object.keys(NCY).map(Number).sort()) { if (`${y}-05-30` <= d) v = NCY[y] - (`${y}-08-01` <= d ? (DIVPAID[y] || 0) * SHARES : 0); } return v; };
const ttmEbitdaAt = d => { const rel = QE.filter(([q]) => releasedBy(q, d)); return rel.length < 4 ? null : rel.slice(-4).reduce((s, x) => s + x[1], 0); };
const evHist = PX.filter(([d]) => d >= FROM).map(([d, p]) => { const e = ttmEbitdaAt(d), nc = ncAt(d); return e && nc != null ? [d, Math.round((p * SHARES - nc) / e * 10) / 10] : null; }).filter(Boolean);
const HEV = statOf(evHist.map(x => x[1]));
const scrEv = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= FROM && d <= ASOF && x > 0), HEVS = statOf(scrEv.map(x => x[1]));
const EVM = { base: half(HEV.med * kev), bull: half(HEV.p75 * kev), bear: half(HEV.p25 * kev) };
const EVM_PEK = half(HEV.med * k), EVM_SCR = half(HEVS.med * kev);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), evNow = mcap - (netCash26 - FY26.dps * SHARES), evTtmNow = evNow / ttmEbitda, evFy28 = (mcap - F.treasury[0]) / F.ebitda[1];
const ebitdaT27 = (F.ebitda[0] + F.ebitda[1]) / 2, treasT27 = (F.treasury[0] + F.treasury[1]) / 2;

// ---------------------------------------------------------------- 7) Checks: assumptions carry the derived multiples; targets come from the P/E value
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const multOk = ['base', 'bull', 'bear'].every(c => PEM.multiple[c] === MULT[c]), evOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === EVM[c]);
if (!process.env.TP_NOCHECK) {
  if (!multOk || !evOk) throw new Error(`GLAXO: assumptions multiples differ from the derivation (P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}); run node tools/authoring/GLAXO.mult.js`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, X2]) => { const pv = X2.blend.methods.find(m => m.key === 'pe').value; if (tp !== Math.round(pv / 10) * 10) throw new Error(`GLAXO ${c} target ${tp} is not the P/E value ${Math.round(pv)}`); });
}

// ---------------------------------------------------------------- 8) Rating (house rule, never typed), street on 30-Sep-2026
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, br = n => ST.find(s => s.broker === n);
const mosl = br('Motilal Oswal'), isec = br('ICICI Securities (institutional)'), nb = br('Nirmal Bang');
const withTp = ST.filter(s => s.tp), medTp = medOf(withTp.map(s => s.tp));
const divYield = F.dps[0] / price * 100, fcfYield = F.fcf[1] / mcap * 100;
const moslAtOurs = 35 * F.eps[1], nbAtOurs = 50 * F.eps[0];

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, n0, n1, pc, pc1, pc2, rup, half, cagr, shortDate, medOf, pctl, statOf, SRC, b, ix, SA, SQ, QL, Q1, FY26, TR, YRS, sep, price, SHARES, mcap, BM, mv, fyOf, PATCH,
  BL, LINES, LBL, build, buildTot, innovShare, netCash26, netCashCo, openCash, oiTreas, OIN, oi26, oi25, treas26, treas25, recur26, yieldOpen26, yieldAvg26, yieldAvg, ttmOi, debtLikePs,
  EXR, epsBase, epsRep, trough, sBase, sRep, sRepAll, sBaseWk, HB, HR, HRA, HBW, troughBase, troughRep, troughRows, FM, FWDFY, peFY27, peFY28, peSep28, ttmEps, peTtm, fwdNowVsMed,
  SET, EXCL, ALL, PEERS, P, MED5, MED5EV, derate, derateEv, sectorCalc, sectorEv, sectorAll, SET_FACTOR, SET_FACTOR_EV, FACTOR_DIFF, FACTOR_DIFF_EV, k, kev, ownDr, ownDrEv, LARGE, sectorLarge, shortName,
  MULT, derived, epsSep, val, epsCagrHist, epsCagrFwd, keV, roeSus, gSus, justPe, pegWin, pegMult, SENS,
  QE, NCY, evHist, HEV, scrEv, HEVS, EVM, EVM_PEK, EVM_SCR, ttmEbitda, evNow, evTtmNow, evFy28, ebitdaT27, treasT27, multOk, evOk,
  rating, ruleText, buyBelow, sellAbove, ST, br, mosl, isec, nb, withTp, medTp, divYield, fcfYield, moslAtOurs, nbAtOurs };

if (require.main === module) {
  console.log('build', buildTot.map(n0), 'model', F.sales.map(n0), 'innov share', YRS.map((_, i) => innovShare(i).toFixed(1)));
  console.log('net cash 26', n0(netCash26), 'OI treas', oiTreas.map(n0), 'total', F.otherIncome.map(n0), '| treas26', treas26.toFixed(1), 'yield open/avg', yieldOpen26.toFixed(2), yieldAvg26.toFixed(2), JSON.stringify(yieldAvg), 'TTM OI', ttmOi, 'debt-like/sh', debtLikePs.toFixed(1));
  console.log('base', JSON.stringify(HB), '| rep ex-trough', JSON.stringify(HR), '| rep all', JSON.stringify(HRA), '| base weekly', JSON.stringify(HBW), '| house', FM.median, FM.medianAll, FM.troughYears);
  console.log('troughs base', troughBase, 'rep', troughRep, troughRows.map(t => `${t.fy} ${t.repRatio.toFixed(2)}/${t.baseRatio.toFixed(2)}`).join(' '));
  console.log('by fwd FY', FWDFY.map(f => `${f.fy} ${f.med}x (${f.n})`).join(', '), '| now FY27', n1(peFY27), 'FY28', n1(peFY28), 'Sep-28E', n1(peSep28), 'TTM', n1(peTtm), 'vs med', n1(fwdNowVsMed));
  console.log('factor calc', sectorCalc.toFixed(3), 'set', SET_FACTOR, 'EV', sectorEv.toFixed(3), 'set', SET_FACTOR_EV, 'all', sectorAll.toFixed(2), 'large', sectorLarge.toFixed(2), 'own', ownDr.toFixed(2), 'ownEV', ownDrEv.toFixed(2));
  console.log('MULT', MULT, 'derived', derived.toFixed(2), 'SENS', JSON.stringify(SENS), 'gordon', justPe.toFixed(1), 'peg', pegWin.toFixed(2), pegMult.toFixed(1), 'eps cagr hist/fwd', epsCagrHist.toFixed(1), epsCagrFwd.toFixed(1));
  console.log('NCY', JSON.stringify(NCY), 'EV own', JSON.stringify(HEV), 'scr', JSON.stringify(HEVS), 'EVM', EVM, 'alt', EVM_PEK, EVM_SCR, 'now ttm', n1(evTtmNow), 'fy28', n1(evFy28));
  console.log('TP', V.tp, 'upside', V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${m.mult} ${Math.round(m.value)}`).join(' | '), 'scen', SC.bull.tp, SC.bear.tp, 'ok', multOk, evOk, 'eps', F.eps.map(n1), 'sep', n1(epsSep.base));
}
