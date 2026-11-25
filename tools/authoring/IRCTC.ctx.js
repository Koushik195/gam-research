// IRCTC initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks the segment
// build and the other-income build, and derives the P/E (primary) and EV/EBITDA (cross-check) multiples once
// (PLAYBOOK §4 and §7c). As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'IRCTC', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'IRCTC.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'IRCTC', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const yr = fy => SA.find(a => a.fy === fy);
const A26 = yr('FY26'), A25 = yr('FY25'), Q1 = C.q1fy27, T = C.treasuryMar26;
const q = k => SQ.find(x => x.q === k);
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E

// 1) Segment build: model revenue and EBITDA must equal the segments (less the unallocated line)
const seg = M.forecast.F.seg, KEYS = Object.keys(seg);
F.years.forEach((y, i) => { const rev = KEYS.reduce((t, k) => t + seg[k].revenue[i], 0), e = KEYS.reduce((t, k) => t + seg[k].adjEbitda[i], 0) - AS.unallocated[i];
  if (Math.abs(rev - F.sales[i]) > 0.5 || Math.abs(e - F.ebitda[i]) > 0.5) throw new Error(`IRCTC segment check failed ${y}`); });
const segSep = k => sep(seg[k].adjEbitda), segShare = (k, i) => seg[k].adjEbitda[i] / KEYS.reduce((t, x) => t + Math.max(seg[x].adjEbitda[i], 0), 0) * 100;

// 2) Other income: treasury yield on opening net treasury + non-treasury items; FY27E vs FY26 and TTM (before exceptional items)
const tre0 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - A.borrowings[b];
const oiNormal = S.schedules['profit-loss']['Other Income']['Other income normal'], excA = S.schedules['profit-loss']['Other Income']['Exceptional items'];
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0), ttmExc = 5.8 + 10.9 + 0.1; // Q2-Q4FY26 exceptional items (PL)
const oi26 = C.fy26.otherIncome, oiTreas = F.otherIncome.map((x, i) => x - AS.otherIncome[i]);
if (Math.abs(F.otherIncome[0] / (ttmOI - ttmExc) - 1) > 0.06) throw new Error(`IRCTC other-income check: FY27E ${n0(F.otherIncome[0])} vs TTM ${n0(ttmOI - ttmExc)}`);

// 3) Own forward P/E (house function), Apr-2021 to the as-of date. The one-year-forward year for a date in Apr-2021 is FY23,
// so the Covid-hit FY21-FY22 EPS never enters the series and no year is a trough.
const FM = forwardMedian('IRCTC', M);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pl = S.tables['profit-loss'], epsRep = {}, epsClean = {};
pl.periods.forEach((p, i) => { const m = p.match(/^Mar (\d{4})/); if (m) { const y = +m[1], e = pl.rows['EPS in Rs'][i], np = pl.rows['Net Profit'][i]; epsRep[y] = e; epsClean[y] = (np - (excA[`Mar ${y}`] || 0) * 0.75) / (np / e); } });
F.years.forEach((y, i) => { epsRep[2000 + +y.slice(2, 4)] = F.eps[i]; epsClean[2000 + +y.slice(2, 4)] = F.eps[i]; });
const pxAll = S.charts.price.Price.filter(([d]) => d <= ASOF), pxW = pxAll.filter((_, i) => i % 5 === 0);
const own = (from, E) => pxW.filter(([d]) => d >= from && E[fyOf(d)] > 0).map(([d, p]) => [d, Math.round(p / E[fyOf(d)] * 10) / 10]);
const since22 = own('2022-04-01', epsRep), cleanS = own('2021-04-01', epsClean);
const med22 = pct(since22.map(x => x[1]), 0.5), cleanMed = pct(cleanS.map(x => x[1]), 0.5);
const p25 = pct(FM.series.map(x => x[1]), 0.25), p75 = pct(FM.series.map(x => x[1]), 0.75);
const two = pct(FM.series.filter(x => x[0] >= '2024-10-01').map(x => x[1]), 0.5);
const byFy = {}; FM.series.forEach(([d, v]) => (byFy[fyOf(d)] ||= []).push(v));
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps);
const WIN0 = '2021-09-30'; // five-year window for the peers' medians (the own window is Apr-2021 to Sep-2026)

// 4) Sector moves (PLAYBOOK §7c): trailing P/E at the 30-Sep close vs each peer's five-year median
const NET = D.peers.set, RAIL = D.peers.railPsu, ALL = [...NET, ...RAIL], SHOW = ['IRCTC', ...NET, 'EASEMYTRIP', ...RAIL];
const PEERS = peersAsOf(SHOW, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const medFrom = (sym, from) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= from && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(SHOW.map(s => [s, medFrom(s, WIN0)]));
const dr5 = Object.fromEntries(SHOW.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const move = (set, dr) => medOf(set.map(s => dr[s]));
const MV = { net: move(NET, dr5), rail: move(RAIL, dr5), all: move(ALL, dr5) };
// Base set = all five names with a usable five-year P/E history: internet platforms (how brokers group IRCTC) and railway-PSU
// services (how the market trades it). Sub-sets are sensitivity rows (§7c: full peer set, no hand-picked sub-sets).
const THIN = false;
const kBase = 1 + MV.all / 100, kAll = 1 + MV.all / 100, kNet = 1 + MV.net / 100;
const shortName = s => ({ IRCTC: 'IRCTC', NAUKRI: 'Info Edge (Naukri)', INDIAMART: 'IndiaMART', EASEMYTRIP: 'Easy Trip Planners', CONCOR: 'Container Corp', RAILTEL: 'RailTel', RITES: 'RITES' }[s] || s);

// 5) Multiples (nearest half-turn). Base: own median × the five-name sector move. Bull: own median, no move.
// Bear: own 25th percentile × the five-name move.
const MULT = { base: half(FM.median * kBase), bull: half(FM.median), bear: half(p25 * kBase) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const at = m => Math.round(m * epsSep.base / 10) * 10;
const SENS = { none: half(FM.median), net: half(FM.median * kNet), rail: half(FM.median * (1 + MV.rail / 100)), all: half(FM.median * kAll), since22: half(med22 * kBase), clean: half(cleanMed * kBase), two: half(two * kBase) };

// 6) EV/EBITDA cross-check: own forward EV/EBITDA (price × shares − net cash at the last March, ÷ next-year EBITDA) over the same window
const cashSch = S.schedules['balance-sheet']['Other Assets']['Cash Equivalents'], ebitdaBy = {}, ncBy = {};
A.labels.forEach((l, i) => { const y = 2000 + +l.slice(2); ebitdaBy[y] = A.ebitda[i]; ncBy[y] = (cashSch[`Mar ${y}`] ?? A.cash[i] ?? 0) - (A.borrowings[i] || 0); });
F.years.forEach((y, i) => (ebitdaBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const evS = pxW.filter(([d]) => d >= WIN0).map(([d, p]) => { const f = fyOf(d); return [d, Math.round((p * shares - ncBy[f - 2]) / ebitdaBy[f] * 10) / 10]; }).filter(x => x[1] > 0);
const evMed = pct(evS.map(x => x[1]), 0.5), evP25 = pct(evS.map(x => x[1]), 0.25);
const evMULT = { base: half(evMed * kBase), bull: half(evMed), bear: half(evP25 * kBase) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, medTp = medOf(ST.map(s => s.tp)), pl26 = ST.find(s => s.short === 'PL');
const epsCagrHist = (Math.pow(epsRep[2026] / epsRep[2023], 1 / 3) - 1) * 100, epsCagrFwd = (Math.pow(F.eps[2] / epsRep[2026], 1 / 3) - 1) * 100;

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, shortDate, pct, medOf, SA, SQ, QL, yr, A26, A25, Q1, T, q, b, price, shares, mcap, sep,
  seg, KEYS, segSep, segShare, tre0, oiNormal, excA, ttmOI, ttmExc, oi26, oiTreas, FM, fyOf, epsRep, epsClean, since22, med22, cleanS, cleanMed, p25, p75, two, byFy, fwdNow, sepNow, WIN0,
  NET, RAIL, ALL, PEERS, P, MED5, dr5, MV, THIN, kBase, kAll, kNet, shortName, MULT, epsSep, at, SENS, evS, evMed, evP25, evMULT, BM, mv, rating, buyBelow, sellAbove, ST, medTp, pl26, epsCagrHist, epsCagrFwd };

if (require.main === module) {
  console.log('tre0', n0(tre0), 'OI', F.otherIncome.map(Math.round), 'treasury part', oiTreas.map(Math.round), 'ttm ex-exc', n0(ttmOI - ttmExc), 'FY26', oi26);
  console.log('FM', FM.median, FM.medianAll, FM.troughYears, 'from', WIN0, 'n', FM.series.length, 'p25', p25, 'p75', p75, 'since22', med22, 'clean', cleanMed, 'two', two);
  console.log('byFy', Object.entries(byFy).map(([f, v]) => `${f}:${n1(medOf(v))}`).join(' '));
  console.log('dr5', Object.entries(dr5).map(([s, v]) => `${s} ${n1(v)}`).join(', '));
  console.log('MV', JSON.stringify(Object.fromEntries(Object.entries(MV).map(([k, v]) => [k, +n1(v)]))), 'THIN', THIN);
  console.log('MULT', MULT, 'SENS', SENS, 'ev', evMed, evP25, evMULT, 'epsSep', epsSep, 'tp', V.tp, n1(V.upside), rating, 'medTp', medTp, 'sepNow', n1(sepNow));
}
