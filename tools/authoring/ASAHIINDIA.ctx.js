// Asahi India Glass initiation: shared context for the Part B files. Loads the research JSONs and the built model,
// checks the segment build, the other-income and interest builds, and derives the EV/EBITDA (primary) and P/E
// (cross-check) multiples once (house rule, PLAYBOOK §4 and §7c). As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { SHARES } = require('./ASAHIINDIA.patch');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ASAHIINDIA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ASAHIINDIA.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'ASAHIINDIA', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const Q1 = C.q1fy27, A26 = SA.find(a => a.fy === 'FY26');
if (Math.abs(shares / SHARES - 1) > 0.001) throw new Error(`ASAHIINDIA shares ${shares} vs ${SHARES}`);

// 1) Builds: segments add up to model revenue; other income and interest builds match assumptions
const SEGK = ['auto', 'float', 'other', 'elim'];
const SEGN = { auto: 'Automotive glass', float: 'Float glass', other: 'Consumer glass & unallocated', elim: 'Inter-segment eliminations' };
const seg = k => F.seg[k];
const segMargin = (k, i) => seg(k).adjEbitda[i] / seg(k).revenue[i] * 100;
const OB = AS.oiBuild;
const netDebt = i => -F.treasury[i]; // the engine's treasury is net cash in forecasts
const ND26 = A.borrowings[b] - (A.cash[b] || 0) - (A.investments[b] || 0);
const CASH = 320, KD = 8.3; // gross cash held (Mar-26 cash + investments Rs323 cr); cost of debt (FY26 Rs204 cr on ~Rs2,450 cr)
const grossDebt = [A.borrowings[b], ...F.years.map((_, i) => netDebt(i) + CASH)];
const intBuild = F.years.map((_, i) => KD / 100 * (grossDebt[i] + grossDebt[i + 1]) / 2);
F.years.forEach((y, i) => {
  const built = OB.treasury[i] + OB.recurring[i] + OB.assetSales[i];
  if (Math.abs(built - F.otherIncome[i]) > 0.5) throw new Error(`ASAHIINDIA other-income build ${y}: ${built} vs ${F.otherIncome[i]}`);
  const sum = SEGK.reduce((t, k) => t + seg(k).revenue[i], 0);
  if (Math.abs(sum / F.sales[i] - 1) > 0.001) throw new Error(`ASAHIINDIA segment sum ${y}`);
  if (Math.abs(intBuild[i] / F.interest[i] - 1) > 0.05) throw new Error(`ASAHIINDIA interest ${y}: build ${n0(intBuild[i])} vs ${F.interest[i]}`);
});
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);
const lev = [ND26 / A.ebitda[b], ...F.years.map((_, i) => netDebt(i) / F.ebitda[i])];
// Quarterly segment EBITDA estimate: quarterly D&A split in each year's annual segment-depreciation shares (not disclosed)
const depShare = fy => { const a = SA.find(x => x.fy === fy) || A26, t = a.autoDep + a.floatDep; return { auto: a.autoDep / t, float: a.floatDep / t, segTot: t / M.annual.dep[M.annual.labels.indexOf(a.fy)] }; };
const qDep = q => M.quarterly.dep[M.quarterly.labels.indexOf(q)];
const qEst = SQ.map(x => { const fy = 'FY' + (+x.q.slice(-2) > 26 ? '26' : x.q.slice(-2)), sh = depShare(fy), d = qDep(x.q) * sh.segTot;
  return { q: x.q, autoM: (x.autoEbit + d * sh.auto) / x.auto * 100, floatM: (x.floatEbit + d * sh.float) / x.float * 100, autoEbitM: x.autoEbit / x.auto * 100, floatEbitM: x.floatEbit / x.float * 100 }; });
const q1Est = qEst.at(-1);

// 2) Own forward EV/EBITDA since Apr-2021 (primary method). EV = weekly price x shares at that date (24.31 cr before the
// 19-Sep-2025 QIP, 25.49 cr after) + Screener net debt at the latest March published by end-May (after the QIP: Mar-25
// less the Rs994 cr raised, until the Mar-26 balance sheet); EBITDA = the next full fiscal year's (actuals, then FY27E-FY28E).
const PL = S.tables['profit-loss'], BS = S.tables['balance-sheet'], SCB = S.schedules['balance-sheet'];
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const ebBy = {}; PL.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) ebBy[+p.slice(-4)] = PL.rows['Operating Profit'][i]; });
F.years.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ndFy = fy => { const j = BS.periods.indexOf(`Mar ${fy}`); return BS.rows.Borrowings[j] - (SCB['Other Assets']['Cash Equivalents'][`Mar ${fy}`] || 0) - BS.rows.Investments[j]; };
const QIP_DATE = C.shares.qipDate, PRE = C.shares.preQip / 1e7, POST = C.shares.post / 1e7;
const fwdEv = S.charts.price.Price.filter(([d]) => d >= '2021-04-01' && d <= ASOF).map(([d, p]) => {
  let fy = +d.slice(0, 4); if (d < `${fy}-05-31`) fy -= 1;
  const post = d >= QIP_DATE, nd = ndFy(fy) - (post && fy === 2025 ? C.shares.qipNetCashCr : 0);
  return [d, Math.round(((post ? POST : PRE) * p + nd) / ebBy[fyOf(d)] * 10) / 10];
});
const evTrough = fy => { const pk = Math.max(ebBy[fy - 1], ebBy[fy - 2], ebBy[fy - 3]); return !(ebBy[fy] > 0) || ebBy[fy] < 0.5 * pk; };
const evTroughYears = [...new Set(fwdEv.filter(([d]) => evTrough(fyOf(d))).map(([d]) => `FY${String(fyOf(d)).slice(2)}`))];
const evKept = fwdEv.filter(([d]) => !evTrough(fyOf(d))), evV = evKept.map(x => x[1]);
const HEV = { med: pct(evV, 0.5), p25: pct(evV, 0.25), p75: pct(evV, 0.75), min: Math.min(...evV), max: Math.max(...evV), n: evV.length };
const evBuckets = Object.entries(evKept.reduce((o, [d, x]) => ((o[fyOf(d)] ||= []).push(x), o), {})).map(([fy, v]) => ({ fy: `FY${String(fy).slice(2)}`, n: v.length, med: pct(v, 0.5) }));
const evTwoYr = pct(evKept.filter(x => x[0] >= '2024-10-01').map(x => x[1]), 0.5);
const evPreQip = pct(evKept.filter(x => x[0] < QIP_DATE).map(x => x[1]), 0.5);
const ebitdaSep = sep(F.ebitda), ndSep = (netDebt(1) + netDebt(2)) / 2;
const evNowSep = (mcap + ND26) / ebitdaSep, evNow28 = (mcap + ND26) / F.ebitda[1], evNowTtm = (mcap + ND26) / M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);

// 3) Forward P/E (house forwardMedian, cross-check)
const FM = forwardMedian('ASAHIINDIA', M);
const fmP25 = pct(FM.series.map(x => x[1]), 0.25), fmP75 = pct(FM.series.map(x => x[1]), 0.75);
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const peNowSep = price / epsSep.base;

// 4) Sector factors: auto-component peers at the 30-Sep close vs five-year medians (PLAYBOOK §7c), ASAHIINDIA excluded.
// Primary method is EV/EBITDA, so the factor is the EV/EBITDA analogue (as TORNTPHARM); the P/E factor drives the P/E cross-check.
const PEER_SYMS = D.peers.set, EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const PEERS = peersAsOf(['ASAHIINDIA', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = (sym, ch, key) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.[ch]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const ALL = ['ASAHIINDIA', ...PEER_SYMS];
const MED5 = Object.fromEntries(ALL.map(s => [s, med5(s, 'pe', 'Price to Earning')])), MED5EV = Object.fromEntries(ALL.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const derate = Object.fromEntries(ALL.map(s => [s, P[s]?.pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const derateEv = Object.fromEntries(ALL.map(s => [s, P[s]?.evEbitda && MED5EV[s] ? (P[s].evEbitda / MED5EV[s] - 1) * 100 : null]));
const sectorEv = medOf(USED.map(s => derateEv[s])), sectorEvAll = medOf(PEER_SYMS.map(s => derateEv[s]));
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.map(s => derate[s]));
const kev = 1 + sectorEv / 100, k = 1 + sectorDr / 100;
const shortName = s => ({ ASAHIINDIA: 'Asahi India Glass', UNOMINDA: 'Uno Minda', MOTHERSON: 'Samvardhana Motherson', BOSCHLTD: 'Bosch', SONACOMS: 'Sona BLW', BHARATFORG: 'Bharat Forge', MSUMI: 'Motherson Sumi Wiring', SCHAEFFLER: 'Schaeffler India', TIINDIA: 'Tube Investments', ZFCVINDIA: 'ZF CV Control', GABRIEL: 'Gabriel India', ENDURANCE: 'Endurance' }[s] || s);

// 5) Multiples (nearest half-turn): base = own median x sector factor; bull = no de-rating; bear = 25th percentile de-rated
const EVM = { base: half(HEV.med * kev), bull: half(HEV.med), bear: half(HEV.p25 * kev) };
const MULT = { base: half(FM.median * k), bull: half(FM.median), bear: half(fmP25 * k) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ebitdaCagrFwd = (Math.pow(F.ebitda[2] / A.ebitda[b], 1 / 3) - 1) * 100, ebitdaCagrHist = (Math.pow(A.ebitda[b] / A.ebitda[b - 5], 1 / 5) - 1) * 100;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, salesCagrHist = (Math.pow(A.sales[b] / A.sales[b - 5], 1 / 5) - 1) * 100;

// 6) Street as it stood on 30-Sep-2026
const ST = D.street.brokers, isec = ST[0], medTp = medOf(ST.map(s => s.tp));
const isecAtOurs = (22 * F.ebitda[1] - netDebt(1)) / shares; // ICICI's 22x on our FY28E EBITDA less our FY28E net debt

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, half, pct, medOf, SA, SQ, QL, b, price, shares, mcap, sep, Q1, A26,
  SEGK, SEGN, seg, segMargin, OB, netDebt, ND26, CASH, KD, grossDebt, intBuild, ttmOI, lev, qEst, q1Est,
  fyOf, fwdEv, HEV, evTroughYears, evBuckets, evTwoYr, evPreQip, ebitdaSep, ndSep, evNowSep, evNow28, evNowTtm,
  FM, fmP25, fmP75, epsSep, peNowSep, PEER_SYMS, EXCL, USED, PEERS, P, MED5, MED5EV, derate, derateEv, sectorEv, sectorEvAll, sectorDr, sectorDrAll, kev, k, shortName,
  EVM, MULT, BM, mv, rating, buyBelow, sellAbove, ebitdaCagrFwd, ebitdaCagrHist, epsCagrFwd, salesCagrHist, ST, isec, medTp, isecAtOurs };

if (require.main === module) {
  console.log('seg', SEGK.map(s => `${s}: ${seg(s).revenue.map(n0).join('/')} m ${[0, 1, 2].map(i => n1(segMargin(s, i))).join('/')}`).join(' | '));
  console.log('OI ttm', ttmOI, 'int build', intBuild.map(n0), 'vs', F.interest, 'ND', n0(ND26), F.years.map((_, i) => n0(netDebt(i))), 'lev', lev.map(x => x.toFixed(2)));
  console.log('qEst', qEst.map(x => `${x.q} a${n1(x.autoM)} f${n1(x.floatM)}`).join(' '));
  console.log('EV hist', HEV, 'trough', evTroughYears, 'two', evTwoYr, 'preQip', evPreQip, evBuckets.map(x => `${x.fy}:${x.med}`).join(' '), 'now sep', n1(evNowSep), 'fy28', n1(evNow28), 'ttm', n1(evNowTtm));
  console.log('FM', FM.median, FM.medianAll, FM.troughYears, 'p25', fmP25, 'p75', fmP75, 'pe now sep', n1(peNowSep));
  console.log('derateEv', USED.map(s => `${s} ${derateEv[s].toFixed(1)}`).join(', '), 'sectorEv', sectorEv.toFixed(2), 'all', sectorEvAll.toFixed(2), '| PE', sectorDr.toFixed(2), 'all', sectorDrAll.toFixed(2), 'self ev', derateEv.ASAHIINDIA.toFixed(1), 'pe', derate.ASAHIINDIA.toFixed(1));
  console.log('EVM', EVM, 'MULT', MULT, 'ebitdaSep', n0(ebitdaSep), 'ndSep', n0(ndSep), 'tp', V.tp, 'upside', V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'scen', SC.bull.tp, SC.bear.tp, 'isec@ours', n0(isecAtOurs));
}
