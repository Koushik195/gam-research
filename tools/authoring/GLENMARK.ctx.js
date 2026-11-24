// Glenmark initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and the built
// model, checks the regional build against model revenue and the other-income build against the engine, and computes the
// valuation inputs once: the house forward P/E median (forwardMedian, reported EPS, trough years left out), the base median
// on EPS before exceptional items and before the ISB 2001 licensing income (batch practice A18 + the upfront treated as a
// one-off), medians with the trough years and with an estimate of the undisclosed one-time deal costs, the pharma P/E and
// EV/EBITDA sector factors (PLAYBOOK §7c, peersAsOf at the 30-Sep close), the forward EV/EBITDA history (cross-check), the
// deferred-income memo, street table and rating. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'GLENMARK', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'GLENMARK.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'GLENMARK', 'screener.json'), 'utf8')); // unpatched, unfrozen
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
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, ACC = C.accounting, ISB = C.isb2001, CM = C.cashMar26;
const b = A.labels.length - 1; // FY26 index in actuals
const ix = fy => A.labels.indexOf(fy);
const YRS = F.years;
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const peMult = mv('pe').mult, epsSep28 = mv('pe').metric, evMult = mv('ev').mult, ebitdaSep28 = mv('ev').metric;
const pctl = (arr, p) => { const s = arr.slice().sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const statOf = arr => ({ med: pctl(arr, 0.5), p25: pctl(arr, 0.25), p75: pctl(arr, 0.75), min: Math.min(...arr), max: Math.max(...arr), n: arr.length });

// 1) Regional build (assumptions.businessLines) must sum to model revenue; FY26 base must equal reported revenue
const BL = AS.businessLines, LK = ['india', 'na', 'europe', 'em', 'other', 'isb'];
const LBL = { india: 'India', na: 'North America (core, excl. ISB 2001)', europe: 'Europe', em: 'Emerging markets', other: 'Other revenue', isb: 'ISB 2001 licensing income (one-off)' };
const lines = Object.fromEntries(LK.map(k => [k, []]));
{ const v = { ...BL.base }; YRS.forEach((_, i) => {
  for (const k of ['india', 'europe', 'em']) v[k] *= 1 + BL.growth[k][i] / 100;
  v.na = BL.naUsdMn[i] * BL.fx[i] / 10; v.other = BL.other[i]; v.isb = BL.isb[i];
  for (const k of LK) lines[k].push(v[k]); }); }
const blTot = YRS.map((_, i) => LK.reduce((s, k) => s + lines[k][i], 0));
blTot.forEach((t, i) => { if (Math.abs(t / F.sales[i] - 1) > 0.003) throw new Error(`GLENMARK regional build ${YRS[i]}: ${n0(t)} != model revenue ${n0(F.sales[i])}`); });
if (Math.abs(LK.reduce((s, k) => s + BL.base[k], 0) - A.sales[b]) > 1) throw new Error('GLENMARK regional base does not sum to FY26 revenue');
const core26 = A.sales[b] - BL.base.isb; // FY26 core revenue (excl. ISB 2001 income)
const coreGrowth27 = (F.sales[0] / core26 - 1) * 100;
const share = (k, i) => lines[k][i] / blTot[i] * 100;
const naUsd26 = BL.base.na * 10 / FY26.fxAvg;
// reported-basis memo: deferred ISB income still in reported revenue/EBITDA in FY27-28 (US$70mn a year, no cash)
const isbRep = YRS.map((_, i) => BL.isbReportedUsdMn[i] * BL.fx[i] / 10);
const repSales = YRS.map((_, i) => F.sales[i] + isbRep[i]);
const repMargin = YRS.map((_, i) => (F.ebitda[i] + isbRep[i]) / repSales[i] * 100);
const repEps = YRS.map((_, i) => F.eps[i] + isbRep[i] * (1 - AS.taxRate[i] / 100) / SHARES);
const coreEbitda26 = A.ebitda[b] - BL.base.isb, coreMargin26 = coreEbitda26 / core26 * 100;

// 2) Other income build: engine = yield x opening model net cash (if positive) + (interest on operating cash + arbitrage + misc)
const OI = ACC.otherIncomeFy26, INT_CASH = 40, ARB = [140, 145, 150], MISC = [60, 65, 70];
const netCash26 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - A.borrowings[b];
const litig = CM.litigationNcFin + CM.litigationCurFin + CM.litigationProvNc + CM.litigationProvCur, leases = CM.leaseNonCurrent + CM.leaseCurrent;
const netCashCo = CM.companyNetCash, netCashAdj = netCashCo - leases - litig - CM.customerAdvanceNc + CM.investmentsNonCurrent;
if (Math.abs(netCash26 - netCashAdj) > 5) throw new Error(`GLENMARK opening net cash ${n0(netCash26)} != adjusted company basis ${n0(netCashAdj)}`);
if (Math.abs(-AS.otherTreasury.base - (litig + CM.customerAdvanceNc)) > 1) throw new Error('GLENMARK otherTreasury != litigation + customer advance');
const openCash = YRS.map((_, i) => (i ? F.treasury[i - 1] : netCash26));
const oiNet = YRS.map((_, i) => AS.treasuryYield[i] / 100 * Math.max(openCash[i], 0));
YRS.forEach((y, i) => { const inp = INT_CASH + ARB[i] + MISC[i]; if (Math.abs(inp - AS.otherIncome[i]) > 1) throw new Error(`GLENMARK otherIncome input ${y}: build ${inp} vs ${AS.otherIncome[i]}`); if (Math.abs(oiNet[i] + inp - F.otherIncome[i]) > 2) throw new Error(`GLENMARK other income ${y}`); });
const ttmOi = (S.schedules.quarters['Other Income']['Other income normal'] || {});
const oiQ1 = ttmOi['Jun 2026'];

// 3) EPS series. House (reported EPS, Screener) and base (before exceptional items and the ISB 2001 income).
const FM = forwardMedian('GLENMARK', M);
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; }; // forward (next full) fiscal year
const pl = S.tables['profit-loss'], epsRep = {}, schPL = S.schedules['profit-loss'];
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) epsRep[+p.slice(-4)] = pl.rows['EPS in Rs'][i]; });
const TAX_EXC = 0.25; // tax effect assumed on exceptional items and on the ISB income
const EXC_CO = { 2022: C.exceptionals.FY22total, 2023: C.exceptionals.FY23total, 2024: C.exceptionals.FY24total, 2025: C.exceptionals.FY25total }; // company (AR five-year scorecard)
const epsExc = {};
for (const y of [2017, 2018, 2019, 2020, 2021]) epsExc[y] = epsRep[y] - (schPL['Net Profit']['Exceptional items AT'][`Mar ${y}`] || 0) / FY26.sharesCr; // Screener, small items
for (const [y, e] of Object.entries(EXC_CO)) epsExc[y] = epsRep[y] + e * (1 - TAX_EXC) / FY26.sharesCr;
const corePbt26 = FY26.pbtPreExcCr - FY26.isbIncomeCr; // PBT before exceptional items and ISB 2001 income
epsExc[2026] = corePbt26 * (1 - TAX_EXC) / FY26.sharesCr;
// estimate of the undisclosed one-time IGI bonus (employee cost) and deal costs (other expenses) in Q2FY26 vs the Q1/Q3 average
const qs = S.schedules.quarters.Expenses, qsales = p => S.tables.quarters.rows.Sales[S.tables.quarters.periods.indexOf(p)];
const costQ = (k, p) => qs[k][p] / 100 * qsales(p);
const excessQ2 = k => costQ(k, 'Sep 2025') - (costQ(k, 'Jun 2025') + costQ(k, 'Dec 2025')) / 2;
const ONE_OPEX = excessQ2('Employee Cost %') + excessQ2('Other Expenses %');
const eps26Alt = (corePbt26 + ONE_OPEX) * (1 - TAX_EXC) / FY26.sharesCr;
YRS.forEach((y, i) => { epsExc[2000 + +y.slice(2, 4)] = F.eps[i]; epsRep[2000 + +y.slice(2, 4)] = F.eps[i]; });
const trough = (by, fy) => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); const pk = Math.max(...prev); return !(by[fy] > 0) || (pk > 0 && by[fy] < 0.5 * pk); };
const RAWPTS = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= '2021-04-01'); // same points as forwardSeries
const allExc = RAWPTS.map(([d, p]) => [d, Math.round(p / epsExc[fyOf(d)] * 10) / 10, fyOf(d)]);
const fwdAdj = allExc.filter(x => !trough(epsExc, x[2])).map(x => [x[0], x[1]]);
const TROUGH = [...new Set(allExc.filter(x => trough(epsExc, x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const HA = statOf(fwdAdj.map(x => x[1])), HR = statOf(FM.series.map(x => x[1]));
const HALL = statOf(allExc.filter(x => x[1] > 0).map(x => x[1])); // trough years kept (loss-year points have no meaningful P/E)
const byFwdFy = {}; allExc.forEach(([d, x, f]) => (byFwdFy[f] ||= []).push(x));
const FWDFY = Object.keys(byFwdFy).sort().map(fy => ({ fy: `FY${String(fy).slice(2)}`, med: pctl(byFwdFy[fy], 0.5), n: byFwdFy[fy].length, eps: epsExc[fy], trough: trough(epsExc, +fy) }));
const epsAlt = { ...epsExc, 2026: eps26Alt };
const altPts = RAWPTS.map(([d, p]) => [d, p / epsAlt[fyOf(d)], fyOf(d)]).filter(x => !trough(epsAlt, x[2]));
const HALT = statOf(altPts.map(x => x[1]));
const peFY27 = price / F.eps[0], peFY28 = price / F.eps[1], peSep28 = price / epsSep28, peSep28Rep = price / sep(repEps);
const ttmEps = A.ttm.eps, peTtm = price / ttmEps;

// 4) Sector factors (PLAYBOOK §7c): nine-peer median of trailing P/E (and EV/EBITDA) at the 30-Sep close vs five-year medians
const PEER_SET = D.peers.set, EXCL = Object.keys(D.peers.excluded), PEER_ALL = [...PEER_SET, ...EXCL];
const PEERS = peersAsOf(PEER_ALL, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const ld = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const med5 = (s, ch, k) => pctl((ld(s).charts?.[ch]?.[k] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5);
const MED5 = Object.fromEntries(PEER_ALL.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const MED5EV = Object.fromEntries(PEER_ALL.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const derate = Object.fromEntries(PEER_ALL.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const derateEv = Object.fromEntries(PEER_ALL.map(s => [s, P[s].evEbitda && MED5EV[s] ? (P[s].evEbitda / MED5EV[s] - 1) * 100 : null]));
const sectorDrCalc = medOf(PEER_SET.map(s => derate[s])), sectorDrAll = medOf(PEER_ALL.filter(s => s !== 'GLENMARK').map(s => derate[s]));
const sectorEv = medOf(PEER_SET.map(s => derateEv[s])), sectorEvAll = medOf(PEER_ALL.filter(s => s !== 'GLENMARK').map(s => derateEv[s]));
const SECTOR_DR = 8.2, k = 1 + SECTOR_DR / 100, kev = 1 + sectorEv / 100; // P/E factor set in PLAYBOOK §7c (A20); reproduction in sectorDrCalc
if (Math.abs(sectorDrCalc - SECTOR_DR) > 0.05) throw new Error(`GLENMARK sector factor ${sectorDrCalc.toFixed(2)}% differs from the PLAYBOOK +8.2%`);
const LARGE = ['SUNPHARMA', 'DIVISLAB', 'TORNTPHARM', 'ZYDUSLIFE', 'CIPLA'], sectorDrLarge = medOf(LARGE.map(s => derate[s]));
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo', ALKEM: 'Alkem', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind' }[s] || s);

// 5) Multiple: derived and checked against assumptions (no tuning)
const derived = HA.med * k;
const PEM = AS.valuation.blend.methods.find(m => m.key === 'pe').multiple;
const MULT = { base: half(HA.med * k), bull: half(HA.p75 * k), bear: half(HA.p25 * k) };
if (!process.env.TP_NOCHECK) ['base', 'bull', 'bear'].forEach(c => { if (MULT[c] !== PEM[c]) throw new Error(`GLENMARK P/E ${c} multiple ${PEM[c]} != derived ${MULT[c]}`); });
const ISB_NPV_MOSL = 290;
const SENS = { reported: half(FM.median * k), all: half(HALL.med * k), alt: half(HALT.med * k), own: null, allPeers: half(HA.med * (1 + sectorDrAll / 100)), large: half(HA.med * (1 + sectorDrLarge / 100)) };
const val = (m, e = epsSep28) => Math.round(m * e / 10) * 10;
const roeSus = F.roe[2], gSus = 7, keV = V.ke, justPe = (1 - gSus / roeSus) / ((keV - gSus) / 100);

// 6) One-year-forward EV/EBITDA since Apr-2021 (cross-check): EV = price x 28.22 cr shares + Screener net debt at the latest March;
// forward EBITDA = next full year (FY26 on a core basis, excl. the ISB 2001 income; ours for FY27-28E)
const bs = S.tables['balance-sheet'], ebBy = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) ebBy[+p.slice(-4)] = pl.rows['Operating Profit'][i]; });
ebBy[2026] = coreEbitda26;
YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ndFy = fy => { const j = bs.periods.indexOf(`Mar ${fy}`); return bs.rows.Borrowings[j] - (S.schedules['balance-sheet']['Other Assets']['Cash Equivalents'][`Mar ${fy}`] || 0) - bs.rows.Investments[j]; };
const evAll = RAWPTS.map(([d, p]) => { let fyBs = +d.slice(0, 4); if (d < `${fyBs}-05-31`) fyBs -= 1; const f = fyOf(d); return [d, Math.round((p * FY26.sharesCr + ndFy(Math.min(fyBs, 2026))) / ebBy[f] * 10) / 10, f]; });
const troughEv = fy => { const pk = Math.max(ebBy[fy - 1], ebBy[fy - 2], ebBy[fy - 3]); return !(ebBy[fy] > 0) || ebBy[fy] < 0.5 * pk; };
const fwdEv = evAll.filter(x => !troughEv(x[2])).map(x => [x[0], x[1]]);
const TROUGH_EV = [...new Set(evAll.filter(x => troughEv(x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const HEV = statOf(fwdEv.map(x => x[1]));
const EVM = { base: half(HEV.med * kev), bull: half(HEV.p75 * kev), bear: half(HEV.p25 * kev) };
const EVA = AS.valuation.blend.methods.find(m => m.key === 'ev').multiple;
if (!process.env.TP_NOCHECK) ['base', 'bull', 'bear'].forEach(c => { if (EVM[c] !== EVA[c]) throw new Error(`GLENMARK EV/EBITDA ${c} multiple ${EVA[c]} != derived ${EVM[c]}`); });
const evNow = mcap - netCash26, evFy28 = evNow / F.ebitda[1], evFy27 = evNow / F.ebitda[0];

// 7) Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const sellLineTp = Math.round(price * 0.95); // target below this = SELL
const epsCagrFwd = cagr(epsExc[2025], F.eps[2], 4);

// 8) Street as it stood on 30-Sep-2026
const ST = D.street.brokers, br = n => ST.find(s => s.broker === n);
const mosl = br('Motilal Oswal'), choice = br('Choice Institutional Equities'), icici = br('ICICI Securities'), dcpl = br('Deven Choksey');
const postQ1 = ST.filter(s => s.date >= '2026-07-31' && s.tp);
const avgTp = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length, medTp = medOf(postQ1.map(s => s.tp));
const tpLo = Math.min(...postQ1.map(s => s.tp)), tpHi = Math.max(...postQ1.map(s => s.tp));
const buys = postQ1.filter(s => /Buy|Add|Accumulate|Outperform/.test(s.rating)).length, sells = postQ1.filter(s => /Sell/.test(s.rating)).length;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, cagr, shortDate, SA, SQ, QL, Q1, FY26, ACC, ISB, CM, b, ix, YRS,
  price, SHARES, mcap, sep, BM, mv, peMult, epsSep28, evMult, ebitdaSep28, pctl, medOf, BL, LK, LBL, lines, blTot, core26, coreGrowth27, share, naUsd26, isbRep, repSales, repMargin, repEps, coreEbitda26, coreMargin26,
  OI, INT_CASH, ARB, MISC, netCash26, litig, leases, netCashCo, openCash, oiNet, oiQ1,
  FM, fyOf, epsRep, epsExc, EXC_CO, TAX_EXC, corePbt26, ONE_OPEX, eps26Alt, allExc, fwdAdj, TROUGH, HA, HALL, HR, HALT, FWDFY, peFY27, peFY28, peSep28, peSep28Rep, ttmEps, peTtm,
  PEER_SET, EXCL, PEER_ALL, PEERS, P, MED5, MED5EV, derate, derateEv, sectorDrCalc, sectorDrAll, sectorEv, sectorEvAll, SECTOR_DR, k, kev, LARGE, sectorDrLarge, shortName,
  derived, MULT, SENS, ISB_NPV_MOSL, val, roeSus, gSus, keV, justPe, fwdEv, evAll, TROUGH_EV, HEV, EVM, ebBy, evNow, evFy28, evFy27, rating, ruleText, buyBelow, sellAbove, sellLineTp, epsCagrFwd,
  ST, br, mosl, choice, icici, dcpl, postQ1, avgTp, medTp, tpLo, tpHi, buys, sells };

if (require.main === module) {
  console.log('build', blTot.map(n0), 'model', F.sales, '| core26', n0(core26), 'core growth27', n1(coreGrowth27), '| rep sales', repSales.map(n0), 'rep margin', repMargin.map(n1), 'rep eps', repEps.map(n1));
  console.log('net cash26 model', n0(netCash26), 'company', n0(netCashCo), 'litig', n1(litig), 'leases', n1(leases), '| OI', F.otherIncome, 'net', oiNet.map(n0), 'open', openCash.map(n0), '| Q1 OI', oiQ1);
  console.log('core FY26 EBITDA', n0(coreEbitda26), n1(coreMargin26) + '%', '| corePbt26', n1(corePbt26), 'eps26 base', n1(epsExc[2026]), 'one-time opex est', n0(ONE_OPEX), 'eps26 alt', n1(eps26Alt));
  console.log('epsExc', Object.fromEntries(Object.entries(epsExc).map(([y, v]) => [y, n1(v)])));
  console.log('FM rep', FM.median, FM.medianAll, FM.troughYears, '| base', JSON.stringify(HA), 'all', JSON.stringify(HALL), 'troughs', TROUGH, '| alt', JSON.stringify(HALT));
  console.log('by fwd FY', FWDFY.map(f => `${f.fy} ${f.med}x (${f.n}) eps ${n1(f.eps)}${f.trough ? ' T' : ''}`).join('; '));
  console.log('sector', sectorDrCalc.toFixed(3), 'all', sectorDrAll.toFixed(3), 'large', sectorDrLarge.toFixed(3), '| EV', sectorEv.toFixed(3), 'all', sectorEvAll.toFixed(3), '| own', derate.GLENMARK?.toFixed(1));
  console.log('MULT', MULT, 'SENS', SENS, '| EV hist', JSON.stringify(HEV), 'EVM', EVM, 'EV troughs', TROUGH_EV, 'evNow FY27/28', n1(evFy27), n1(evFy28));
  console.log('TP', V.tp, 'upside', V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'scen', SC.bull.tp, SC.bear.tp, '| street avg', n0(avgTp), 'med', medTp, buys, sells, '| justPe', n1(justPe), '| PE FY27/28/Sep28', n1(peFY27), n1(peFY28), n1(peSep28), 'rep', n1(peSep28Rep));
}
