// Torrent Pharmaceuticals initiation: shared context for the Part B files (research.js, part2-6). Loads the research
// JSONs and the built model and computes, once: the business-line build (checked against model revenue), the other-
// income and interest builds (checked against assumptions), our own net-debt path (the engine treats book tax as cash;
// the JB brand amortisation is not tax-deductible, so ~₹337 cr a year of extra cash tax is added back), EPS before the
// JB acquisition amortisation (the basis of the target), the forward P/E history (house forwardMedian on reported and on
// adjusted EPS, plus checks), the pharma P/E and EV/EBITDA sector factors, the forward EV/EBITDA history (primary method), the
// translation of the derived multiples into the engine's reported-EPS multiples, peers and the street. As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const PATCH = require('./TORNTPHARM.patch');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'TORNTPHARM', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'TORNTPHARM.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'TORNTPHARM', 'screener.json'), 'utf8')); // unpatched
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SRC = 'Torrent Pharma annual reports, results filings and earnings calls; GAM Research';
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, DEAL = C.deal;
const b = A.labels.length - 1; // FY26 (pro forma) index
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const OLD_SHARES = 33.8445440, PPA = DEAL.ppa.amortisationPerYearCr, TSTAT = 25.168;

// 1) Business-line build must sum to model revenue
const BL = AS.businessLines, LINES = Object.keys(BL.base);
const LBL = { indiaBase: 'India, Torrent base (incl. Curatio)', jbIndia: 'India, JB brands', brazil: 'Brazil', us: 'United States', germany: 'Germany', rowBase: 'Rest of world, Torrent', jbIntl: 'JB international and CDMO' };
const build = Object.fromEntries(LINES.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => LINES.reduce((s, k) => s + build[k][i], 0));
const baseTot = LINES.reduce((s, k) => s + BL.base[k], 0);
if (Math.abs(baseTot / A.sales[b] - 1) > 0.001) throw new Error(`TORNTPHARM base lines ${baseTot} != pro forma FY26 ${A.sales[b]}`);
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`TORNTPHARM build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });
const indiaTot = YRS.map((_, i) => build.indiaBase[i] + build.jbIndia[i]);
const jbTot = YRS.map((_, i) => build.jbIndia[i] + build.jbIntl[i]);
const baseBiz = YRS.map((_, i) => buildTot[i] - jbTot[i]);
// Margin split (assumption text): Torrent base +50bp a year; JB 35.5 / 37.5 / 38.5%
const BASE_M = [33.3, 33.8, 34.3], JB_M = [35.5, 37.5, 38.5];
const mixM = YRS.map((_, i) => (baseBiz[i] * BASE_M[i] + jbTot[i] * JB_M[i]) / buildTot[i]);
YRS.forEach((y, i) => { if (Math.abs(mixM[i] - F.ebitdaMargin[i]) > 0.15) throw new Error(`TORNTPHARM margin mix ${y}: ${mixM[i].toFixed(2)} vs ${F.ebitdaMargin[i]}`); });

// 2) Other income build (assumptions.otherIncome): treasury yield on gross cash + FX/hedging + misc
const GROSS_CASH = [FY26.cash.cash + FY26.cash.bank + FY26.cash.currentFunds, 1500, 1500, 1500]; // Mar-26 actual, then assumed
const TY = 6.25, FX = [-100, -40, -20], MISC = 3;
const oiTreas = YRS.map((_, i) => TY / 100 * (GROSS_CASH[i] + GROSS_CASH[i + 1]) / 2);
const oiBuild = YRS.map((_, i) => oiTreas[i] + FX[i] + MISC);
YRS.forEach((y, i) => { if (Math.abs(oiBuild[i] - AS.otherIncome[i]) > 2) throw new Error(`TORNTPHARM other income ${y}: build ${oiBuild[i].toFixed(1)} vs ${AS.otherIncome[i]}`); });

// 3) Own net-debt path: engine net debt + cumulative extra cash tax (JB brand amortisation is not deductible; the DTL unwinds)
const DTL_UNWIND = PPA * TSTAT / 100;
const LEASES = FY26.borrowings.leases;
const nd0 = A.borrowings[b] - (A.cash[b] || 0) - (A.investments[b] || 0) - (AS.otherTreasury?.base || 0); // Mar-26, Screener basis incl. leases (patch offset removed)
const ndOwn = YRS.map((_, i) => -F.treasury[i] + DTL_UNWIND * (i + 1));
const grossDebt = [FY26.borrowings.total, ...ndOwn.map((x, i) => x - LEASES + GROSS_CASH[i + 1])];
const KD = 7.7, OTHER_FIN = 55;
const intBuild = YRS.map((_, i) => KD / 100 * (grossDebt[i] + grossDebt[i + 1]) / 2 + OTHER_FIN);
YRS.forEach((y, i) => { if (Math.abs(intBuild[i] / AS.interest[i] - 1) > 0.04) throw new Error(`TORNTPHARM interest ${y}: build ${n0(intBuild[i])} vs ${AS.interest[i]}`); });
const ebitdaPF26 = A.ebitda[b];
const lev = [nd0 / ebitdaPF26, ...ndOwn.map((x, i) => x / F.ebitda[i])];

// 4) EPS before the JB acquisition amortisation (net of its deferred-tax credit at the model tax rate)
const ppaPs = i => PPA * (1 - AS.taxRate[i] / 100) / SHARES;
const epsU = F.pat.map(p => p / SHARES); // F.eps in the model JSON is rounded (to ₹1 above ₹100)
const adjEps = YRS.map((y, i) => epsU[i] + ppaPs(i));
const adjSep = sep(adjEps), epsSep = sep(epsU);
const scenAdj = k => { const e = SC[k].eps; return { rep: sep(e), adj: sep(e.map((x, i) => x + ppaPs(i))) }; };
const ppaPat = YRS.map((_, i) => PPA * (1 - AS.taxRate[i] / 100));

// 5) Forward P/E history since Apr-2021 (house forwardMedian): reported forecast EPS and adjusted forecast EPS
const FM = forwardMedian('TORNTPHARM', M);
const Madj = { meta: M.meta, forecast: { F: { years: YRS, eps: adjEps } } };
const FMA = forwardMedian('TORNTPHARM', Madj);
const pctl = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const FMA_P25 = pctl(FMA.series.map(x => x[1]), 0.25), FMA_P75 = pctl(FMA.series.map(x => x[1]), 0.75);
const FM_P25 = pctl(FM.series.map(x => x[1]), 0.25), FM_P75 = pctl(FM.series.map(x => x[1]), 0.75);
// Checks in our own files (same window, same sampling): (a) FY26 also before its 70 days of JB amortisation; (b) EPS before
// exceptional items (one-offs rule); (c) pre-deal window with actual EPS only (dates to Mar-2025).
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pl = RAW.tables['profit-loss'];
const epsRep = {}, epsExc = {}, EXC_AT = {}; // EPS before exceptional items = EPS − exceptional items after tax ÷ shares (Screener schedules)
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4); epsRep[y] = pl.rows['EPS in Rs'][i]; const ns = RAW.schedules['profit-loss']['Net Profit'], ex = ns['Exceptional items AT'][p] || 0, pfe = ns['Profit for EPS'][p], e = pl.rows['EPS in Rs'][i]; epsExc[y] = pfe ? e - ex / (pfe / e) : e; EXC_AT[y] = ex; } });
const FY26_ADJ = (FY26.patOwners + 0.488 * 195) / OLD_SHARES; // owners' 48.8% of the stub's ₹195 cr net amortisation (Q4FY26 call)
const seriesWith = by => forwardSeries('TORNTPHARM', M, 'eps').filter(([d]) => d >= '2021-04-01').map(([d, pe]) => { const f = fyOf(d), p = pe * (f >= 2027 ? F.eps[f - 2027] : epsRep[f]); const e = by[f]; return [d, Math.round(p / e * 10) / 10]; });
const byAdj = { ...epsRep, 2026: FY26_ADJ, 2027: adjEps[0], 2028: adjEps[1], 2029: adjEps[2] };
const byExc = { ...epsExc, 2026: epsExc[2026] + 0.488 * 195 / OLD_SHARES, 2027: adjEps[0], 2028: adjEps[1], 2029: adjEps[2] };
const sAdjFull = seriesWith(byAdj), sExc = seriesWith(byExc);
const medAdjFull = pctl(sAdjFull.map(x => x[1]), 0.5), medExc = pctl(sExc.map(x => x[1]), 0.5), EXC_P25 = pctl(sExc.map(x => x[1]), 0.25), EXC_P75 = pctl(sExc.map(x => x[1]), 0.75);
const preDeal = FM.series.filter(([d]) => d < '2025-04-01'), medPre = pctl(preDeal.map(x => x[1]), 0.5);
const postDealRep = FM.series.filter(([d]) => d >= '2025-07-01'), postDealAdj = FMA.series.filter(([d]) => d >= '2025-07-01');
const medPostRep = pctl(postDealRep.map(x => x[1]), 0.5), medPostAdj = pctl(postDealAdj.map(x => x[1]), 0.5);
const fwdRep = forwardSeries('TORNTPHARM', M, 'eps').filter(x => x[0] >= '2021-04-01');
const fwdAdj = forwardSeries('TORNTPHARM', Madj, 'eps').filter(x => x[0] >= '2021-04-01');
const peNowRep = price / epsU[1], peNowAdj = price / adjEps[1], peNowSepAdj = price / adjSep;

// 6) Sector factor: pharma peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c), excluding Torrent
const PEER_SET = D.peers.set, EXCL = Object.keys(D.peers.excluded);
const PEER_ALL = [...PEER_SET, ...EXCL];
const PEERS = peersAsOf(PEER_ALL, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pctl((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(PEER_ALL.map(s => [s, med5(s)]));
const derate = Object.fromEntries(PEER_ALL.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const USED = PEER_SET.filter(s => s !== 'TORNTPHARM');
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const sectorDrCalc = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_ALL.filter(s => s !== 'TORNTPHARM').map(s => derate[s]));
const SECTOR_DR = 5.45, k = 1 + SECTOR_DR / 100; // P/E factor, set in PLAYBOOK §7c; our reproduction is in sectorDrCalc (P/E cross-check)
// EV/EBITDA factor (primary method, as hospitals use): trailing EV/EBITDA at the 30-Sep close vs five-year median of Screener's 'EV Multiple'
const med5ev = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pctl((X.charts?.evEbitda?.['EV Multiple'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5EV = Object.fromEntries(PEER_ALL.map(s => [s, med5ev(s)]));
const derateEv = Object.fromEntries(PEER_ALL.map(s => [s, P[s].evEbitda && MED5EV[s] ? (P[s].evEbitda / MED5EV[s] - 1) * 100 : null]));
const sectorEvCalc = medOf(USED.map(s => derateEv[s])), sectorEvAll = medOf(PEER_ALL.filter(s => s !== 'TORNTPHARM').map(s => derateEv[s]));
const SECTOR_EV = 5.55, kev = 1 + SECTOR_EV / 100; // set by GAM Research (coordinator, Nov-2026); reproduction in sectorEvCalc
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma', JBCHEPHARM: 'JB Chemicals' }[s] || s);

// 7) Target multiples (derived) and the engine's equivalent multiples on reported Sep-28E EPS
// Base (batch rule, as Sun Pharma and Cipla): median on EPS before exceptional items (forecasts carry none) and before the JB
// amortisation; the house forwardMedian on reported (with-exceptionals) EPS is a sensitivity.
const MULT = { base: half(medExc * k), bull: half(EXC_P75 * k), bear: half(EXC_P25 * k) };
const multAdjRep = half(FMA.median * k); // sensitivity: house forwardMedian, adjusted forecasts, reported history
const repMultSens = half(FM.median * k); // sensitivity: house median on reported EPS applied to reported EPS
const EPSC = { base: { rep: epsSep, adj: adjSep }, bull: scenAdj('bull'), bear: scenAdj('bear') };
const ENGINE = Object.fromEntries(Object.entries(MULT).map(([c, m]) => [c, Math.round(m * EPSC[c].adj / EPSC[c].rep * 100) / 100]));
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe');
const multOk = ['base', 'bull', 'bear'].every(c => Math.abs(PEM.multiple[c] - ENGINE[c]) < 0.03);
const tpAdj = Object.fromEntries(Object.entries(MULT).map(([c, m]) => [c, Math.round(m * EPSC[c].adj / 10) * 10]));

// 8) Forward EV/EBITDA history since Apr-2021 (cross-check). Before the deal (to 27-Jun-2025): EV = price × 33.84 cr +
// Screener net debt at the latest March published by end-May; EBITDA = the next full year's (FY26 = Torrent base ₹4,318 cr,
// ex-JB). After: EV = price × 38.04 cr + Mar-26 net debt (₹12,913 cr incl. leases, the deal debt); EBITDA = combined FY27E/FY28E.
const bs = RAW.tables['balance-sheet'];
const ndFy = fy => { const j = bs.periods.indexOf(`Mar ${fy}`); return bs.rows.Borrowings[j] - (RAW.schedules['balance-sheet']['Other Assets']['Cash Equivalents'][`Mar ${fy}`] || 0) - bs.rows.Investments[j]; };
const ebBy = {}; pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) ebBy[+p.slice(-4)] = pl.rows['Operating Profit'][i]; });
ebBy[2026] = FY26.ebitdaReported - DEAL.jbStub.ebitda; YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const DEAL_DATE = '2025-06-30', ND_PF = nd0;
const fwdEv = M.price.series.filter(([d]) => d >= '2021-04-01' && d <= ASOF).filter((_, i, a) => i % 5 === 0 || i === a.length - 1).map(([d, p]) => {
  const post = d >= DEAL_DATE; let fyBs = +d.slice(0, 4); if (d < `${fyBs}-05-31`) fyBs -= 1;
  const ev = post ? p * SHARES + ND_PF : p * OLD_SHARES + ndFy(fyBs);
  return [d, Math.round(ev / ebBy[fyOf(d)] * 10) / 10];
});
const HEV = { med: pctl(fwdEv.map(x => x[1]), 0.5), p25: pctl(fwdEv.map(x => x[1]), 0.25), p75: pctl(fwdEv.map(x => x[1]), 0.75), min: Math.min(...fwdEv.map(x => x[1])), max: Math.max(...fwdEv.map(x => x[1])) };
const HEVpre = pctl(fwdEv.filter(([d]) => d < DEAL_DATE).map(x => x[1]), 0.5), HEVpost = pctl(fwdEv.filter(([d]) => d >= DEAL_DATE).map(x => x[1]), 0.5);
const EVM = { base: half(HEV.med * kev), bull: half(HEV.p75 * kev), bear: half(HEV.p25 * kev) };
const EVMA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const evOk = ['base', 'bull', 'bear'].every(c => EVMA.multiple[c] === EVM[c]);
const ebitdaSep = sep(F.ebitda), evNow = (mcap + nd0) / F.ebitda[1], evNow27 = (mcap + nd0) / F.ebitda[0];
const treasSep = sep(F.treasury), ndSepOwn = sep(ndOwn);

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
if (!process.env.TP_NOCHECK && (!multOk || !evOk)) throw new Error('TORNTPHARM: assumptions multiples differ from the derivation (see ENGINE / EVM)');
const evTp = c => Math.round(((c === 'base' ? V : SC[c]).blend.methods.find(m => m.key === 'ev').value) / 10) * 10;
if (!process.env.TP_NOCHECK) [['base', V.tp], ['bull', SC.bull.tp], ['bear', SC.bear.tp]].forEach(([c, tp]) => { if (tp !== evTp(c)) throw new Error(`TORNTPHARM ${c} target ${tp} is not the EV/EBITDA value ${evTp(c)}`); const pv = (c === 'base' ? V : SC[c]).blend.methods.find(m => m.key === 'pe').value; if (Math.abs(pv - tpAdj[c]) > 10) throw new Error(`TORNTPHARM ${c} P/E cross-check ${Math.round(pv)} != ${MULT[c]}x adjusted EPS (${tpAdj[c]})`); });
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrAdj = (Math.pow(adjEps[2] / adjEps[0], 1 / 2) - 1) * 100, ebitdaCagr = (Math.pow(F.ebitda[2] / A.ebitda[b], 1 / 3) - 1) * 100;
const salesCagrHist = (Math.pow(SA.at(-1).consRev / SA[0].consRev, 1 / 4) - 1) * 100;

// 9) Street as it stood on 30-Sep-2026
const ST = D.street.brokers, byB = n => ST.find(s => s.broker === n);
const pl_ = byB('Prabhudas Lilladher'), idir = byB('ICICI Direct'), mosl = byB('Motilal Oswal');
const postQ1 = ST.filter(s => s.date >= '2026-07-30'), avgPost = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length;
const streetEvAt = (mult, ebitda) => (mult * ebitda - ndOwn[1]) / SHARES; // street multiple on our FY28E EBITDA and net debt
const moslAtOurs = 50 * epsSep; // MOSL's 50x on our 12-month-forward (Sep-28E) reported EPS

module.exports = { ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, shortDate, SRC, SA, SQ, QL, Q1, FY26, DEAL, b, YRS, sep, price, SHARES, OLD_SHARES, mcap, PPA, TSTAT, PATCH,
  BL, LINES, LBL, build, buildTot, indiaTot, jbTot, baseBiz, BASE_M, JB_M, mixM, GROSS_CASH, TY, FX, MISC, oiTreas, oiBuild, DTL_UNWIND, LEASES, nd0, ndOwn, grossDebt, KD, OTHER_FIN, intBuild, lev, ebitdaPF26,
  ppaPs, epsU, adjEps, adjSep, epsSep, ppaPat, FM, FMA, FMA_P25, FMA_P75, FM_P25, FM_P75, FY26_ADJ, medAdjFull, medExc, EXC_P25, EXC_P75, EXC_AT, epsExc, sExc, multAdjRep, medPre, medPostRep, medPostAdj, fwdRep, fwdAdj, peNowRep, peNowAdj, peNowSepAdj, fyOf,
  PEER_SET, EXCL, PEER_ALL, PEERS, P, MED5, derate, USED, sectorDrCalc, sectorDrAll, SECTOR_DR, k, MED5EV, derateEv, sectorEvCalc, sectorEvAll, SECTOR_EV, kev, shortName, medOf, MULT, repMultSens, EPSC, ENGINE, multOk, tpAdj,
  fwdEv, HEV, HEVpre, HEVpost, EVM, evOk, ebitdaSep, evNow, evNow27, treasSep, ndSepOwn, BM, mv, rating, buyBelow, sellAbove, epsCagrAdj, ebitdaCagr, salesCagrHist,
  ST, pl_, idir, mosl, postQ1, avgPost, streetEvAt, moslAtOurs };

if (require.main === module) {
  console.log('build', buildTot.map(n0), 'model', F.sales, '| mix margin', mixM.map(x => x.toFixed(2)));
  console.log('OI build', oiBuild.map(x => x.toFixed(1)), '| interest build', intBuild.map(n0), 'vs', AS.interest, '| own ND', ndOwn.map(n0), 'lev', lev.map(x => x.toFixed(2)));
  console.log('EPS rep', F.eps, 'adj', adjEps.map(x => x.toFixed(2)), 'Sep-28E rep', epsSep.toFixed(2), 'adj', adjSep.toFixed(2));
  console.log('FM rep', FM.median, FM.medianAll, FM.troughYears, 'p25/p75', FM_P25, FM_P75, '| FM adj', FMA.median, 'p25/p75', FMA_P25, FMA_P75, '| adj full', medAdjFull, 'ex-exc', medExc, EXC_P25, EXC_P75, JSON.stringify(EXC_AT), JSON.stringify(Object.fromEntries(Object.entries(epsExc).slice(-5).map(([a,b])=>[a,+b.toFixed(2)]))), 'pre-deal', medPre, 'post rep/adj', medPostRep, medPostAdj);
  console.log('sector calc', sectorDrCalc.toFixed(3), 'all', sectorDrAll.toFixed(3), USED.map(s => `${s} ${P[s].pe}/${MED5[s]}=${derate[s].toFixed(2)}`).join('; '));
  console.log('MULT', MULT, 'engine', ENGINE, 'assumptions ok?', multOk, 'tpAdj', tpAdj, 'rep-basis sens', repMultSens, '->', Math.round(repMultSens * epsSep));
  console.log('EV factor calc', sectorEvCalc.toFixed(3), 'all', sectorEvAll.toFixed(3), USED.map(s => `${s} ${P[s].evEbitda}/${MED5EV[s]}=${derateEv[s].toFixed(1)}`).join('; '));
  console.log('EV hist', HEV, 'pre', HEVpre, 'post', HEVpost, 'EVM', EVM, 'ok?', evOk, 'evNow', evNow.toFixed(1));
  console.log('TP', V.tp, 'upside', V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'scen', SC.bull.tp, SC.bear.tp);
}
