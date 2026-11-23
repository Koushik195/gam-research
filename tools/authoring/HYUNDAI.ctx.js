// Hyundai Motor India initiation: shared context for the Part B files. Loads the research JSONs and the built
// model, checks the domestic/export volume build against the model, and derives the P/E and EV/EBITDA
// multiples once (house rule, PLAYBOOK §4 and §7c; recently listed: 12-month window). As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'HYUNDAI', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'HYUNDAI.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2024-10-22', R12 = '2025-10-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const yr = fy => SA.find(a => a.fy === fy);
const A26 = yr('FY26'), A25 = yr('FY25'), A24 = yr('FY24'), Q1 = C.q1fy27;
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, mcap = price * F.shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };

// 1) Domestic / export build vs model volume and revenue
const BL = AS.build, bld = [];
{ let dom = BL.base.domestic, ex = BL.base.exports;
  F.years.forEach((y, i) => { dom *= 1 + BL.domesticGrowth[i] / 100; ex *= 1 + BL.exportGrowth[i] / 100;
    bld.push({ y, dom, ex, units: dom + ex, model: F.volume[i], rpu: F.revPerUnit[i], rev: F.sales[i] }); }); }
bld.forEach(r => { if (Math.abs(r.model / r.units - 1) > 0.001) throw new Error(`HYUNDAI build check failed ${r.y}: model volume ${n0(r.model)} vs build ${n0(r.units)}`); });
const rpu26 = A.sales[b] * 1e7 / A26.units;

// 2) Forward P/E on EVERY weekly close since listing (forwardSeries keeps every 5th point: too few for a
//    two-year history), plus the 30-Sep-2026 close. Next full fiscal year's EPS: actual, then ours.
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'HYUNDAI', 'screener.json'), 'utf8'));
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsBy = {}; A.labels.forEach((l, i) => { if (A.eps[i]) epsBy[2000 + +l.slice(2)] = A.eps[i]; }); F.years.forEach((y, i) => { epsBy[2000 + +y.slice(2, 4)] = F.eps[i]; });
const px = S.charts.price.Price.filter(([d]) => d >= LISTED && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const fwdPe = px.map(([d, p]) => [d, Math.round(p / epsBy[fyOf(d)] * 10) / 10]);
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const PEL = stat(fwdPe, LISTED), PE12 = stat(fwdPe, R12), PE6 = stat(fwdPe, '2026-04-01'), PEH2 = stat(fwdPe, R12, '2026-03-31');
const FM = forwardMedian('HYUNDAI', M, { from: LISTED }), FM12 = forwardMedian('HYUNDAI', M, { from: R12 }); // house function (every 5th week)
const fwdNow = price / F.eps[1], trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;

// 3) Sector move: auto-OEM peers' trailing P/E at the 30-Sep close vs their own medians over the same 12-month
//    window (primary, so the window matches Hyundai's own) and vs five-year medians (shown); PLAYBOOK §7c
const PEER_SYMS = D.peers.set, EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const PEERS = peersAsOf([...PEER_SYMS, 'TMPV', 'HYUNDAI'], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const peSeries = sym => (JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.pe?.['Price to Earning'] || []);
const medFrom = (sym, from) => medOf(peSeries(sym).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, medFrom(s, '2021-09-30')])), MED12 = Object.fromEntries(PEER_SYMS.map(s => [s, medFrom(s, R12)]));
const dr12 = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].pe / MED12[s] - 1) * 100])), dr5 = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].pe / MED5[s] - 1) * 100]));
const sector12 = medOf(USED.map(s => dr12[s])), sector12All = medOf(PEER_SYMS.map(s => dr12[s])), sector5 = medOf(USED.map(s => dr5[s]));
const k = 1 + sector12 / 100, k5 = 1 + sector5 / 100;
const shortName = s => ({ MARUTI: 'Maruti Suzuki', 'M&M': 'Mahindra & Mahindra', 'BAJAJ-AUTO': 'Bajaj Auto', EICHERMOT: 'Eicher Motors', HEROMOTOCO: 'Hero MotoCorp', TVSMOTOR: 'TVS Motor', ASHOKLEY: 'Ashok Leyland', ESCORTS: 'Escorts Kubota', TMPV: 'Tata Motors PV', HYUNDAI: 'Hyundai Motor India' }[s] || s);

// 4) Multiples (derived, nearest half-turn): base = own 12-month forward median x same-window sector move;
//    bull = no sector move; bear = own 25th percentile x sector move
const MULT = { base: half(PE12.med * k), bull: half(PE12.med), bear: half(PE12.p25 * k) };
const ALT = { listing5: half(PEL.med * k5), six: half(PE6.med * k), street: 26 };
// EV/EBITDA cross-check: own trailing EV/EBITDA median over the same window x the same sector move, restated
// from trailing (year to Jun-26) to Sep-28E EBITDA
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= R12 && d <= ASOF && x > 0).map(x => x[1]);
const evMed = medOf(evHist), evP25 = [...evHist].sort((x, y) => x - y)[Math.floor(evHist.length * 0.25)];
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda), rest = ttmEbitda / ebitdaSep28;
const evMULT = { base: half(evMed * k * rest), bull: half(evMed * rest), bear: half(evP25 * k * rest) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-07-30' && s.tp);
const medTp = medOf(postQ1.map(s => s.tp)), withEps = ST.filter(s => s.eps);
const avgEps = y => withEps.reduce((s, x) => s + x.eps[y], 0) / withEps.length;
const peMults = ST.map(s => parseFloat(s.multiple)).filter(x => x > 0), medStreetMult = medOf(peMults);

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, LISTED, R12, n0, n1, pc, pc1, rup, half, shortDate, SA, SQ, QL, yr, A26, A25, A24, Q1, b, price, mcap, sep, medOf,
  bld, rpu26, fwdPe, PEL, PE12, PE6, PEH2, FM, FM12, fwdNow, trailEps, trailPe, fyOf, epsBy,
  PEER_SYMS, EXCL, USED, PEERS, P, MED5, MED12, dr12, dr5, sector12, sector12All, sector5, k, k5, shortName,
  MULT, ALT, evMed, evP25, evMULT, ttmEbitda, ebitdaSep28, rest, BM, mv, epsSep, rating, buyBelow, sellAbove, epsCagrFwd, ST, postQ1, medTp, withEps, avgEps, medStreetMult };
