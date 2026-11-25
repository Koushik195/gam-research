// TBO Tek initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks the
// GTV segment build and the other-income build, and derives the P/E (primary) and EV/EBITDA (cross-check) multiples
// once (PLAYBOOK §4 and §7c; listed May-2024, so a 12-month window and a same-window sector move, as HYUNDAI/HDBFS).
// As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'TBOTEK', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'TBOTEK.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'TBOTEK', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2024-05-15', R12 = '2025-10-01', POSTIPO = '2024-11-15';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const yr = fy => SA.find(a => a.fy === fy);
const A26 = yr('FY26'), Q1 = C.q1fy27, q = k => SQ.find(x => x.q === k);
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E

// 1) Segment build: revenue = Σ GTV × take rate; EBITDA = Σ GP − SG&A − ESOP
const seg = F.seg, KEYS = Object.keys(seg);
const gp = F.years.map((_, i) => KEYS.reduce((t, k) => t + seg[k].adjEbitda[i], 0)), gtv = F.years.map((_, i) => KEYS.reduce((t, k) => t + seg[k].driver[i], 0));
F.years.forEach((y, i) => { const rev = KEYS.reduce((t, k) => t + seg[k].revenue[i], 0), e = gp[i] - AS.unallocated[i] - AS.esop[i];
  if (Math.abs(rev - F.sales[i]) > 0.5 || Math.abs(e - F.ebitda[i]) > 0.5) throw new Error(`TBOTEK segment check failed ${y}`); });
const gp26 = A26.gp, sga26 = A26.sgaExEsop, ebitdaToGp = F.years.map((_, i) => F.ebitda[i] / gp[i] * 100), take = F.years.map((_, i) => F.sales[i] / gtv[i] * 100);
const orgSga = [1145, 1145 * 1.1, 1145 * 1.21], cvSga = AS.unallocated.map((u, i) => u - orgSga[i]); // split stated in assumptions _unallocWhy
const cvEbitda = F.years.map((_, i) => seg.cv.adjEbitda[i] - cvSga[i]), cvEbitdaGtv = cvEbitda.map((e, i) => e / seg.cv.driver[i] * 100);

// 2) Other income: treasury yield on opening net treasury + non-treasury items; FY27E vs FY26 and Q1FY27 x4
const tre0 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - A.borrowings[b];
const oiTreas = F.otherIncome.map((x, i) => x - AS.otherIncome[i]), oi26 = C.fy26.otherIncome, oiQ1x4 = Q1.otherIncome * 4;
if (Math.abs(F.otherIncome[0] / oi26 - 1) > 0.1 || Math.abs(F.otherIncome[0] / oiQ1x4 - 1) > 0.1) throw new Error(`TBOTEK other-income check: FY27E ${n0(F.otherIncome[0])} vs FY26 ${oi26} and Q1x4 ${oiQ1x4}`);

// 3) Own forward P/E on EVERY weekly close (forwardSeries keeps every 5th point: too few for a short history), plus the
//    30-Sep close. Next full fiscal year's EPS: actual (FY25-26), then ours (FY27-28E). Base window: 12 months to 30-Sep.
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsBy = {}; A.labels.forEach((l, i) => { if (A.eps[i]) epsBy[2000 + +l.slice(2)] = A.eps[i]; }); F.years.forEach((y, i) => { epsBy[2000 + +y.slice(2, 4)] = F.eps[i]; });
const px = S.charts.price.Price.filter(([d]) => d >= LISTED && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const fwdPe = px.map(([d, p]) => [d, Math.round(p / epsBy[fyOf(d)] * 10) / 10]);
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const PE12 = stat(fwdPe, R12), PEX = stat(fwdPe, POSTIPO), PEL = stat(fwdPe, LISTED), PEH1 = stat(fwdPe, R12, '2026-03-31'), PEH2 = stat(fwdPe, '2026-04-01');
const FM = forwardMedian('TBOTEK', M, { from: R12 }), FMX = forwardMedian('TBOTEK', M, { from: POSTIPO }); // house function (every 5th week), shown
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps), trailEps = 22.5 - 5.80 + 7.68, trailPe = price / trailEps; // TTM to Jun-26: FY26 less Q1FY26 plus Q1FY27

// 4) Sector move (PLAYBOOK §7c, thin-peer rule): peers' trailing P/E at the 30-Sep close vs their own medians over the
//    same 12-month window. The travel set has two usable names, so it is widened to the internet platforms with a usable
//    history; the full four-name set is the base, sub-sets are sensitivity rows.
const SET = D.peers.set, TRAVEL = D.peers.travel, NET = D.peers.internet, IRS = D.peers.irctcSet, SHOW = ['TBOTEK', ...SET, 'IXIGO', 'EASEMYTRIP', 'CONCOR', 'RAILTEL', 'RITES'];
const PEERS = peersAsOf(SHOW, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const peSeries = sym => (JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.pe?.['Price to Earning'] || []);
const medFrom = (sym, from) => medOf(peSeries(sym).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const MED12 = Object.fromEntries(SHOW.map(s => [s, medFrom(s, R12)])), MED5 = Object.fromEntries(SHOW.map(s => [s, medFrom(s, '2021-09-30')]));
const dr12 = Object.fromEntries(SHOW.map(s => [s, P[s].pe ? (P[s].pe / MED12[s] - 1) * 100 : null])), dr5 = Object.fromEntries(SHOW.map(s => [s, P[s].pe ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const move = (set, dr = dr12) => medOf(set.map(s => dr[s]));
const MV = { set: move(SET), travel: move(TRAVEL), net: move(NET), irctc: move(IRS), ixigo: move([...SET, 'IXIGO']), set5: move(SET, dr5) };
const k = 1 + MV.set / 100;
const shortName = s => ({ TBOTEK: 'TBO Tek', IRCTC: 'IRCTC', THOMASCOOK: 'Thomas Cook (India)', NAUKRI: 'Info Edge (Naukri)', INDIAMART: 'IndiaMART', IXIGO: 'ixigo (Le Travenues)', EASEMYTRIP: 'Easy Trip Planners', CONCOR: 'Container Corp', RAILTEL: 'RailTel', RITES: 'RITES' }[s] || s);

// 5) Multiples (derived, nearest half-turn). Base: own 12-month forward median × the four-name same-window move.
//    Bull: own median, no move. Bear: own 25th percentile × the move.
const MULT = { base: half(PE12.med * k), bull: half(PE12.med), bear: half(PE12.p25 * k) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const at = m => Math.round(m * epsSep.base / 10) * 10;
const SENS = { none: half(PE12.med), travel: half(PE12.med * (1 + MV.travel / 100)), net: half(PE12.med * (1 + MV.net / 100)), irctc: half(PE12.med * (1 + MV.irctc / 100)), ixigo: half(PE12.med * (1 + MV.ixigo / 100)), postIpo: half(PEX.med * k), h2: half(PEH2.med * k), street: 35 };

// 6) EV/EBITDA cross-check: own forward EV/EBITDA (price × shares − net cash at the last March, ÷ next-year EBITDA) on the same window
const cashSch = S.schedules['balance-sheet']['Other Assets']['Cash Equivalents'], ebitdaBy = {}, ncBy = {};
A.labels.forEach((l, i) => { const y = 2000 + +l.slice(2); ebitdaBy[y] = A.ebitda[i]; ncBy[y] = (A.cash[i] || 0) + (A.investments[i] || 0) - (A.borrowings[i] || 0); });
F.years.forEach((y, i) => (ebitdaBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const evS = px.filter(([d]) => d >= R12).map(([d, p]) => { const f = fyOf(d); return [d, Math.round((p * shares - ncBy[f - 2]) / ebitdaBy[f] * 10) / 10]; });
const evSt = stat(evS, R12), evMed = evSt.med, evP25 = evSt.p25;
const evMULT = { base: half(evMed * k), bull: half(evMed), bear: half(evP25 * k) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, medTp = medOf(ST.map(s => s.tp));
const choice = ST.find(s => s.short === 'Choice'), mosl = ST.find(s => s.short === 'MOSL');
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100;

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, LISTED, R12, POSTIPO, n0, n1, pc, pc1, half, shortDate, medOf, SA, SQ, QL, yr, A26, Q1, q, b, price, shares, mcap, sep,
  seg, KEYS, gp, gtv, gp26, sga26, ebitdaToGp, take, orgSga, cvSga, cvEbitda, cvEbitdaGtv, tre0, oiTreas, oi26, oiQ1x4, fyOf, epsBy, fwdPe, PE12, PEX, PEL, PEH1, PEH2, FM, FMX, fwdNow, sepNow, trailEps, trailPe,
  SET, TRAVEL, NET, IRS, SHOW, PEERS, P, MED12, MED5, dr12, dr5, MV, k, shortName, MULT, epsSep, at, SENS, evS, evSt, evMed, evP25, evMULT, BM, mv, rating, buyBelow, sellAbove, ST, medTp, choice, mosl, epsCagrFwd };

if (require.main === module) {
  console.log('gp', gp.map(Math.round), 'gtv', gtv.map(Math.round), 'ebitda/gp', ebitdaToGp.map(n1), 'take', take.map(n1), 'cvEbitda', cvEbitda.map(Math.round), cvEbitdaGtv.map(n1));
  console.log('tre0', n0(tre0), 'OI', F.otherIncome.map(Math.round), 'treasury part', oiTreas.map(Math.round), 'FY26', oi26, 'Q1x4', oiQ1x4);
  console.log('PE12', PE12, 'PEX', PEX, 'PEH1', PEH1.med, 'PEH2', PEH2.med, 'FM', FM.median, FM.troughYears, 'FMX', FMX.median, 'fwdNow', n1(fwdNow), 'sepNow', n1(sepNow), 'trailPe', n1(trailPe));
  console.log('dr12', Object.entries(dr12).map(([s, v]) => `${s} ${v == null ? '-' : n1(v)} (pe ${P[s].pe?.toFixed(1)} med ${MED12[s]?.toFixed(1)})`).join(', '));
  console.log('MV', JSON.stringify(Object.fromEntries(Object.entries(MV).map(([kk, v]) => [kk, +n1(v)]))));
  console.log('MULT', MULT, 'SENS', SENS, 'ev', evSt, evMULT, 'epsSep', epsSep, 'tp', V.tp, n1(V.upside), rating, 'medTp', medTp);
}
