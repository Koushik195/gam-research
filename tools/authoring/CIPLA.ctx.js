// Cipla initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and
// the built model, checks the business-line build against model revenue and the other-income build against the
// engine, and computes the valuation inputs once: the house forward P/E median (forwardMedian, reported EPS), the
// same median on EPS before exceptional items (KANSAINER-style one-offs rule), the post-windfall window, the pharma
// sector factor (PLAYBOOK §7c, peersAsOf at the 30-Sep close as in EICHERMOT.ctx.js), trailing EV/EBITDA history,
// street table and sensitivities. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'CIPLA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'CIPLA.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'CIPLA', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?(?=[0-9])/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const cagr = (a, b, y) => (Math.pow(b / a, 1 / y) - 1) * 100;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SRC = 'Cipla presentations, earnings calls and annual reports; GAM Research';
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, ACC = C.accounting;
const b = A.labels.length - 1; // FY26 index in actuals
const ix = fy => A.labels.indexOf(fy);
const YRS = F.years;
const price = M.price.last, mcap = price * F.shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const peMult = mv('pe').mult, epsSep28 = mv('pe').metric, evMult = mv('ev').mult, ebitdaSep27 = mv('ev').metric;

// 1) Business-line build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines, lines = { india: [], usa: [], africa: [], row: [] };
{ let v = { ...BL.base }; YRS.forEach((_, i) => {
  v.india *= 1 + BL.growth.india[i] / 100; v.africa *= 1 + BL.growth.africa[i] / 100; v.row *= 1 + BL.growth.row[i] / 100; v.usa = BL.usdMn[i] * BL.fx[i] / 10;
  for (const k of Object.keys(lines)) lines[k].push(v[k]); }); }
const blTot = YRS.map((_, i) => lines.india[i] + lines.usa[i] + lines.africa[i] + lines.row[i]);
blTot.forEach((t, i) => { if (Math.abs(t / F.sales[i] - 1) > 0.005) throw new Error(`CIPLA business-line build ${YRS[i]}: ${n0(t)} != model revenue ${n0(F.sales[i])}`); });
if (Math.abs(BL.base.india + BL.base.usa + BL.base.africa + BL.base.row - A.sales[b]) > 1) throw new Error('CIPLA business-line base does not sum to FY26 revenue');
const share = (k, i) => lines[k][i] / blTot[i] * 100;
const fx26 = C.usd.fxUsaLine.FY26;

// 2) Other income build: treasury yield x opening net cash + recurring items = engine other income
const OI = ACC.otherIncomeFy26;
const treas26 = OI.bankDepositInterest + OI.gainOnSaleCurrentInvestments + OI.fairValueGains;
const recur26 = OI.otherInterest + OI.rent + OI.grants + OI.misc;
const oneOff26 = OI.total - treas26 - recur26;
const netCash26 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - A.borrowings[b];
if (Math.abs(netCash26 - FY26.netCash) > 15) throw new Error(`CIPLA opening net cash ${n0(netCash26)} != company ${FY26.netCash}`);
const openCash = YRS.map((_, i) => (i ? F.treasury[i - 1] : netCash26));
const oiTreas = YRS.map((_, i) => AS.treasuryYield[i] / 100 * openCash[i]);
YRS.forEach((y, i) => { if (Math.abs(oiTreas[i] + AS.otherIncome[i] - F.otherIncome[i]) > 2) throw new Error(`CIPLA other income build ${y}`); });
const yield26 = treas26 / ((10369 + FY26.netCash) / 2) * 100; // FY25 company net cash Rs10,369 cr (Q4FY26 presentation: 10,807 - 438)
const OIN = S.schedules.quarters['Other Income']['Other income normal']; // other income before exceptional items (= company figure)
const ttmOiCompany = ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026'].reduce((s, p) => s + OIN[p], 0); // twelve months to Jun-26

// 3) One-year-forward P/E: house median on reported EPS, and on EPS before exceptional items (one-offs rule)
const FM = forwardMedian('CIPLA', M);
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const UE = ACC.underlyingEps, epsAdj = {};
Object.entries(UE).forEach(([k, v]) => { if (/^FY\d\d$/.test(k)) epsAdj[2000 + +k.slice(2)] = v; });
YRS.forEach((y, i) => (epsAdj[2000 + +y.slice(2, 4)] = F.eps[i]));
const fwdAdj = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= '2021-04-01').map(([d, p]) => [d, Math.round(p / epsAdj[fyOf(d)] * 10) / 10]);
const pctl = (arr, p) => { const s = arr.slice().sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const statOf = arr => ({ med: pctl(arr, 0.5), p25: pctl(arr, 0.25), p75: pctl(arr, 0.75), min: Math.min(...arr), max: Math.max(...arr), n: arr.length });
const HA = statOf(fwdAdj.map(x => x[1])), HR = statOf(FM.series.map(x => x[1]));
const byFwdFy = {}; fwdAdj.forEach(([d, x]) => (byFwdFy[fyOf(d)] ||= []).push(x));
const FWDFY = Object.keys(byFwdFy).sort().map(fy => ({ fy: `FY${String(fy).slice(2)}`, med: pctl(byFwdFy[fy], 0.5), n: byFwdFy[fy].length, eps: epsAdj[fy] }));
const POST = statOf(FM.series.filter(([d]) => d >= '2025-04-01').map(x => x[1])); // forward year FY27E+: no gRevlimid in the denominator
const fwdPe = forwardSeries('CIPLA', M, 'eps').filter(x => x[0] >= '2016-04-01');
const peFY27 = price / F.eps[0], peFY28 = price / F.eps[1], peSep28 = price / epsSep28;
const ttmEps = A.ttm.eps, peTtm = price / ttmEps;

// 4) Sector factor: pharma peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c)
const PEER_SYMS = ['SUNPHARMA', 'DIVISLAB', 'TORNTPHARM', 'ZYDUSLIFE', 'CIPLA', 'AUROPHARMA', 'ALKEM', 'IPCALAB', 'ABBOTINDIA', 'LUPIN', 'GLENMARK', 'BIOCON', 'LAURUSLABS', 'DRREDDY', 'MANKIND'];
const PEERS = peersAsOf(PEER_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pctl((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => s !== 'CIPLA' && !EXCL.includes(s));
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.filter(s => s !== 'CIPLA').map(s => derate[s]));
const LARGE = ['SUNPHARMA', 'DIVISLAB', 'TORNTPHARM', 'ZYDUSLIFE'], sectorDrLarge = medOf(LARGE.map(s => derate[s]));
const k = 1 + sectorDr / 100;
if (Math.abs(sectorDr - 7.5) > 0.05) throw new Error(`CIPLA sector factor ${sectorDr.toFixed(2)}% differs from the PLAYBOOK +7.5%`);
const derived = HA.med * k;
if (half(derived) !== peMult) throw new Error(`CIPLA P/E multiple ${peMult} != derived ${half(derived)} (${n1(HA.med)}x x ${k})`);
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo', ALKEM: 'Alkem', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind' }[s] || s);

// 5) Sensitivity multiples (not in the base: PLAYBOOK §7c)
const SENS = {
 reported: half(FM.median * k), post: half(POST.med * k), own: half(HA.med * (1 + derate.CIPLA / 100)), large: half(HA.med * (1 + sectorDrLarge / 100)), all: half(HA.med * (1 + sectorDrAll / 100)),
};
const val = m => Math.round(m * epsSep28 / 10) * 10;
const roeSus = F.roe[2], gSus = 7, keV = V.ke, justPe = (1 - gSus / roeSus) / ((keV - gSus) / 100) / 100 * 100; // Gordon: (1 - g/ROE) / (Ke - g)

// 6) Trailing EV/EBITDA history (Screener), same window
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0);
const HEV = statOf(evHist.map(x => x[1]));
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);
const netCashNow = Q1.netCash, evNow = mcap - netCashNow, evTtm = evNow / ttmEbitda, evFy28 = evNow / F.ebitda[1];
if (half(HEV.med * k) !== evMult) throw new Error(`CIPLA EV multiple ${evMult} != derived ${half(HEV.med * k)}`);

// 7) Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrFwd = cagr(UE.FY26, F.eps[2], 3), epsCagrRep = cagr(A.eps[b], F.eps[2], 3), epsCagrHist = cagr(A.eps[b - 5], UE.FY26, 5);

// 8) Street as it stood on 30-Sep-2026
const ST = D.street.brokers, br = n => ST.find(s => s.broker === n);
const ela = br('Elara Securities'), idir = br('ICICI Direct'), axis = br('Axis Securities');
const postQ1 = ST.filter(s => s.date >= '2026-07-23' && s.tp);
const avgTp = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length, medTp = medOf(postQ1.map(s => s.tp));
const tpLo = Math.min(...postQ1.map(s => s.tp)), tpHi = Math.max(...postQ1.map(s => s.tp));
const buys = postQ1.filter(s => /Buy|Overweight|Accumulate/.test(s.rating)).length;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, cagr, shortDate, SRC, SA, SQ, QL, Q1, FY26, ACC, b, ix, YRS,
  price, mcap, sep, BM, mv, peMult, epsSep28, evMult, ebitdaSep27, BL, lines, blTot, share, fx26,
  OI, treas26, recur26, oneOff26, netCash26, openCash, oiTreas, yield26, ttmOiCompany,
  FM, fyOf, epsAdj, fwdAdj, HA, HR, FWDFY, POST, fwdPe, peFY27, peFY28, peSep28, ttmEps, peTtm,
  PEER_SYMS, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, LARGE, sectorDrLarge, k, derived, shortName, SENS, val, roeSus, gSus, keV, justPe,
  HEV, ttmEbitda, netCashNow, evNow, evTtm, evFy28, rating, ruleText, buyBelow, sellAbove, epsCagrFwd, epsCagrRep, epsCagrHist,
  ST, br, ela, idir, axis, postQ1, avgTp, medTp, tpLo, tpHi, buys, medOf };
