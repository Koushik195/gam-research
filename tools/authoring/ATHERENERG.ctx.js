// Ather Energy initiation: shared context for the Part B files. Loads the research JSONs and the built model,
// checks the Konarc / core-range mix build against model revenue, and derives the EV/Sales multiple once
// (house rule, PLAYBOOK §4 and §7c; recently listed: 12-month window, same-window sector move). As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { SHARES_FD, RAISE } = require('./ATHERENERG.patch');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ATHERENERG', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ATHERENERG.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2025-05-06', R12 = '2025-10-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const yr = fy => SA.find(a => a.fy === fy);
const A26 = yr('FY26'), A25 = yr('FY25'), A24 = yr('FY24'), Q1 = C.q1fy27, QK = C.quarterlyKpis;
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pct = (arr, q) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * q)]; };

// 1) Mix build vs model revenue (units '000 x Rs '000 per unit = Rs crore / 10)
const BL = AS.build, bld = F.years.map((y, i) => {
  const ku = BL.konarcUnits[i], cu = BL.coreUnits[i], rev = (ku * BL.konarcRpu[i] + cu * BL.coreRpu[i]) / 10;
  return { y, ku, cu, units: (ku + cu) * 1000, rpu: rev * 1e7 / ((ku + cu) * 1000), rev, model: F.sales[i], konarcShare: ku / (ku + cu) * 100 };
});
bld.forEach(r => { if (Math.abs(r.model / r.rev - 1) > 0.003 || Math.abs(F.volume[F.years.indexOf(r.y)] / r.units - 1) > 0.001) throw new Error(`ATHERENERG build check failed ${r.y}: model ${n0(r.model)} vs build ${n0(r.rev)}`); });

// 2) Treasury: pro forma net cash at Mar-26 (incl. the Rs2,500 cr raised in Jul/Aug-2026)
const T = C.fy26.treasury;
const grossCash26 = T.cashAndEq + T.otherBank + T.mutualFunds + T.termDepositsCurrent + T.termDepositsNonCurrent;
const debt26 = A.borrowings[b], netCash26 = grossCash26 - debt26, netCashPF = netCash26 + RAISE;

// 3) Own one-year-forward EV/Sales on EVERY weekly close (12 months to the as-of date) plus the as-of close.
//    Forward = next full fiscal year (FY27E for Oct-25..Mar-26, FY28E for Apr-26..Sep-26; our estimates).
//    Shares and net cash step up with the raise: QIP 20-Jul-2026, preferential + warrants 25-Aug-2026.
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'ATHERENERG', 'screener.json'), 'utf8'));
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const salesBy = { 2027: F.sales[0], 2028: F.sales[1], 2029: F.sales[2] };
const RZ = C.raise2026;
const capAt = d => (d >= RZ.warrants.date ? { sh: SHARES_FD, nc: netCashPF } : d >= RZ.qip.date ? { sh: RZ.sharesBefore25Aug / 1e7, nc: netCash26 + RZ.qip.cr } : { sh: C.raise2026.sharesMar26 / 1e7, nc: netCash26 });
const px = S.charts.price.Price.filter(([d]) => d >= LISTED && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const evs = px.map(([d, p]) => { const c = capAt(d), fy = fyOf(d); return [d, Math.round((p * c.sh - c.nc) / salesBy[fy] * 100) / 100, fy]; }).filter(x => x[0] >= R12);
const ev12 = evs.map(x => x[1]), EVS = { med: medOf(ev12), p25: pct(ev12, 0.25), p75: pct(ev12, 0.75), min: Math.min(...ev12), max: Math.max(...ev12), n: ev12.length };
const evH2 = evs.filter(x => x[2] === 2027).map(x => x[1]), evH1 = evs.filter(x => x[2] === 2028).map(x => x[1]);
const EVSH2 = medOf(evH2), EVSH1 = medOf(evH1);
const evNow = (mcap - netCashPF) / F.sales[1], evSep = (mcap - netCashPF) / sep(F.sales);
const ttmSales = M.quarterly.sales.slice(-4).reduce((s, x) => s + x, 0), evTtm = (mcap - netCashPF) / ttmSales;
const FM = forwardMedian('ATHERENERG', M, { from: LISTED }); // house P/E function: every year is a trough year

// 4) Sector move: auto-OEM peers' trailing P/E at the 30-Sep close vs their own medians over the same 12 months
const PEER_SYMS = D.peers.set, EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const TW = D.peers.twoWheelerSubset.filter(s => !EXCL.includes(s));
const PEERS = peersAsOf([...PEER_SYMS, 'OLAELEC', 'ATHERENERG'], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const peSeries = sym => (JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.pe?.['Price to Earning'] || []);
const medFrom = (sym, from) => medOf(peSeries(sym).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, medFrom(s, '2021-09-30')])), MED12 = Object.fromEntries(PEER_SYMS.map(s => [s, medFrom(s, R12)]));
const dr12 = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].pe / MED12[s] - 1) * 100])), dr5 = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].pe / MED5[s] - 1) * 100]));
const sector12 = medOf(USED.map(s => dr12[s])), sector12All = medOf(PEER_SYMS.map(s => dr12[s])), sector5 = medOf(USED.map(s => dr5[s])), sectorTW = medOf(TW.map(s => dr12[s]));
const k = 1 + sector12 / 100, k5 = 1 + sector5 / 100, kTW = 1 + sectorTW / 100;
const shortName = s => ({ MARUTI: 'Maruti Suzuki', 'M&M': 'Mahindra & Mahindra', 'BAJAJ-AUTO': 'Bajaj Auto', EICHERMOT: 'Eicher Motors', HEROMOTOCO: 'Hero MotoCorp', TVSMOTOR: 'TVS Motor', ASHOKLEY: 'Ashok Leyland', ESCORTS: 'Escorts Kubota', OLAELEC: 'Ola Electric', ATHERENERG: 'Ather Energy' }[s] || s);
const evSalesOf = p => (p.evEbitda > 0 && p.ebitdaMargin > 0 ? p.evEbitda * p.ebitdaMargin / 100 : null); // EV/EBITDA x margin

// 5) Multiples (derived, nearest half-turn): base = own 12-month forward EV/Sales median x same-window sector move;
//    bull = no sector move; bear = own 25th percentile x the move. EV/EBITDA cross-check = peers' median at 30-Sep.
const MULT = { base: half(EVS.med * k), bull: half(EVS.med), bear: half(EVS.p25 * k) };
const ALT = { tw: half(EVS.med * kTW), h1: half(EVSH1 * k), five: half(EVS.med * k5), streetMed: 6.5 };
const peerEv = medOf(USED.map(s => P[s].evEbitda)), evMULT = { base: half(peerEv), bull: half(peerEv), bear: half(peerEv) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const salesSep = { base: sep(F.sales) };
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const atMult = x => Math.round((x * salesSep.base + sep(F.treasury)) / shares / 10) * 10; // value/share at an EV/Sales multiple
const impliedMult = p => (p * shares - sep(F.treasury)) / salesSep.base; // EV/Sales a price implies on Sep-28E

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, medTp = medOf(ST.map(s => s.tp)), evsMults = ST.map(s => parseFloat(s.multiple)).filter(x => x > 0), medStreetMult = medOf(evsMults);

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, LISTED, R12, n0, n1, pc, pc1, rup, half, shortDate, SA, SQ, QL, yr, A26, A25, A24, Q1, QK, b, price, shares, mcap, sep, medOf,
  bld, grossCash26, debt26, netCash26, netCashPF, RAISE, SHARES_FD, evs, EVS, EVSH2, EVSH1, evNow, evSep, ttmSales, evTtm, FM, fyOf,
  PEER_SYMS, EXCL, USED, TW, PEERS, P, MED5, MED12, dr12, dr5, sector12, sector12All, sector5, sectorTW, k, k5, kTW, shortName, evSalesOf,
  MULT, ALT, peerEv, evMULT, BM, mv, salesSep, rating, buyBelow, sellAbove, atMult, impliedMult, ST, medTp, evsMults, medStreetMult };
