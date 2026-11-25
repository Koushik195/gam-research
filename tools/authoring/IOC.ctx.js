// Indian Oil Corporation initiation: shared context for the Part B files (as of 30-Sep-2026, Q1FY27 basis).
//
// ===== OMC PEER SET AND METHOD (set here first; BPCL and HINDPETRO should match) =====================================
// Primary method: sum of the parts on EV/EBITDA, the way the street values the OMCs (MOSL 4.5x Dec-27E, BOB 5.5x Jun-28E,
//   ICICI Sec 5.5x FY28E, all plus investments): segment EBITDA on Sep-28E (½ FY28E + ½ FY29E) × one derived multiple,
//   less net debt at Sep-27E, plus listed stakes at the 30-Sep-2026 close less 20% (PLAYBOOK §7c), less minorities.
// Multiple: own ONE-YEAR-FORWARD CORE EV/EBITDA since Apr-2021, on every weekly close: EV = price × shares (net of
//   treasury shares) + borrowings incl. leases − cash − ALL investments at the latest published book value (so the
//   stakes, which we value separately, are not in the multiple); EBITDA = next full year's consolidated operating
//   profit (Screener basis, before other income; our FY27E/FY28E for recent dates). Trough years left out: forward
//   EBITDA below half the highest of the previous three years (the §4 trough rule applied to EBITDA; FY25 is one).
// Sector move: EV/EBITDA analogue of the house factor (as pharma names on EV/EBITDA do): peers' trailing EV/EBITDA at
//   the 30-Sep-2026 close vs their own five-year medians (Screener, from 30-Sep-2021, positive values), median of
//   the OMC/refiner set BPCL, HINDPETRO, MRPL, CHENNPETRO, EXCLUDING the company itself and HINDPETRO (distorted: the
//   Q1FY27 marketing loss collapsed its trailing EBITDA, 11.9x vs 5.7x median). Three usable names = the minimum, so
//   no widening; the widened oil & gas set (RELIANCE, ONGC, OIL, GAIL, PETRONET added), the set with HPCL and the
//   P/E-based move are sensitivity rows only. Base = own median × (1 + move); bull = own median; bear = own 25th
//   percentile × (1 + move); nearest half-turn. P/E cross-check: same construction on P/E (patched EPS).
// =================================================================================================================
const fs = require('fs');
const path = require('path');
const { peersAsOf } = require('./asof-peers');
const { forwardMedian } = require('./valuation-blend');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { SH_NET, SH_ISSUED } = require('./IOC.patch');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'IOC', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'IOC.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'IOC', 'screener.json'), 'utf8'));
const CL = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', '2026-09-30.json'), 'utf8')).closes;
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2021-04-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SA = SG.annual, yr = fy => SA.find(a => a.fy === fy), A26 = yr('FY26'), A25 = yr('FY25'), Q1 = SG.quarterly[0];
const b = A.labels.length - 1, price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const ix = fy => F.years.indexOf(fy);

// 1) Petroleum products build (volume × realisation; volume × EBITDA per tonne) vs the model's segment
const PB = AS.petBuild, bld = [];
{ let v = PB.base.vol, r = PB.base.rev * 10 / PB.base.vol; // ₹ per tonne (₹ cr × 1e7 / (MMT × 1e6))
  F.years.forEach((y, i) => { v *= 1 + PB.volGrowth[i] / 100; r *= 1 + PB.realGrowth[i] / 100;
    const rev = v * r / 10, e = v * PB.ebitdaPerTonne[i] / 10;
    bld.push({ y, vol: v, real: r, rev, ebitda: e, ept: PB.ebitdaPerTonne[i], mRev: F.seg.pet.revenue[i], mE: F.seg.pet.adjEbitda[i] }); }); }
bld.forEach(r => { if (Math.abs(r.mRev / r.rev - 1) > 0.005 || Math.abs(r.mE / r.ebitda - 1) > 0.005) throw new Error(`IOC build check failed ${r.y}: model rev ${n0(r.mRev)} vs ${n0(r.rev)}, EBITDA ${n0(r.mE)} vs ${n0(r.ebitda)}`); });
const ept = fy => { const a = yr(fy); return a?.petVol ? a.petEbitda * 10 / a.petVol : null; };
const EPT = Object.fromEntries(['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(fy => [fy, ept(fy)]));
const eptAvg = Object.values(EPT).reduce((s, x) => s + x, 0) / Object.values(EPT).length;

// 2) Own one-year-forward core EV/EBITDA since Apr-2021 (every weekly close), trough years left out
const pl = S.tables['profit-loss'], bs = S.tables['balance-sheet'], cashS = S.schedules['balance-sheet']['Other Assets']['Cash Equivalents'];
const opBy = {}, bsBy = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) opBy[+p.slice(-4)] = pl.rows['Operating Profit'][i]; });
bs.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) bsBy[+p.slice(-4)] = { debt: bs.rows.Borrowings[i], inv: bs.rows.Investments[i], cash: cashS[p] }; });
F.years.forEach((y, i) => { opBy[2000 + +y.slice(2, 4)] = F.ebitda[i]; });
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const bsAt = d => bsBy[d.slice(5) >= '05-30' ? +d.slice(0, 4) : +d.slice(0, 4) - 1]; // FY results public by ~end-May
const troughEb = fy => { const pk = Math.max(opBy[fy - 1], opBy[fy - 2], opBy[fy - 3]); return !(opBy[fy] > 0) || opBy[fy] < 0.5 * pk; };
const weekly = S.charts.price.Price.filter(([d]) => d >= FROM && d <= ASOF);
const evRows = weekly.map(([d, p]) => { const q = bsAt(d), fy = fyOf(d), ev = p * SH_NET + q.debt - q.cash - q.inv; return { d, fy, p, ev, m: ev / opBy[fy], t: troughEb(fy) }; });
const evKept = evRows.filter(r => !r.t), evVals = evKept.map(r => r.m);
const OWN = { med: pct(evVals, 0.5), p25: pct(evVals, 0.25), p75: pct(evVals, 0.75), n: evKept.length, all: pct(evRows.map(r => r.m), 0.5) };
const evTroughFy = [...new Set(evRows.filter(r => r.t).map(r => `FY${String(r.fy).slice(2)}`))];
const evByFy = Object.fromEntries([...new Set(evRows.map(r => r.fy))].map(fy => [`FY${String(fy).slice(2)}`, { med: medOf(evRows.filter(r => r.fy === fy).map(r => r.m)), eb: opBy[fy], n: evRows.filter(r => r.fy === fy).length, trough: troughEb(fy) }]));
const grossMed = pct(evKept.map(r => (r.ev + bsAt(r.d).inv) / opBy[r.fy]), 0.5); // EV without deducting investments (street-style gross)
const evNow = evRows[evRows.length - 1];
const qAsOf = bsBy[2026], evCoreNow = price * SH_NET + qAsOf.debt - qAsOf.cash - qAsOf.inv;
const fwdEvNow = evCoreNow / F.ebitda[1], fwdEvSep = evCoreNow / sep(F.ebitda);

// 3) Sector move (EV/EBITDA and P/E) vs five-year medians, at the 30-Sep-2026 close
const SET = D.peers.set, EXCL = Object.keys(D.peers.excluded), USED = SET.filter(s => !EXCL.includes(s)), WIDE = [...SET, ...D.peers.widened];
const PEERS = peersAsOf(['IOC', ...WIDE], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const ser = (sym, ch, k) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.[ch]?.[k] || [];
const med5 = (sym, ch, k) => pct(ser(sym, ch, k).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5);
const EVMED5 = Object.fromEntries(['IOC', ...WIDE].map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const PEMED5 = Object.fromEntries(['IOC', ...WIDE].map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const evMove = Object.fromEntries(['IOC', ...WIDE].map(s => [s, P[s]?.evEbitda && EVMED5[s] ? (P[s].evEbitda / EVMED5[s] - 1) * 100 : null]));
const peMove = Object.fromEntries(['IOC', ...WIDE].map(s => [s, P[s]?.pe && PEMED5[s] ? (P[s].pe / PEMED5[s] - 1) * 100 : null]));
const sectorMv = medOf(USED.map(s => evMove[s])), k = 1 + sectorMv / 100;
const SENSMV = { withHpcl: medOf(SET.map(s => evMove[s])), wide: medOf(WIDE.filter(s => !EXCL.includes(s)).map(s => evMove[s])), pe: medOf(USED.map(s => peMove[s])) };
const shortName = s => ({ IOC: 'Indian Oil', BPCL: 'BPCL', HINDPETRO: 'HPCL', MRPL: 'MRPL', CHENNPETRO: 'Chennai Petroleum', RELIANCE: 'Reliance', ONGC: 'ONGC', OIL: 'Oil India', GAIL: 'GAIL', PETRONET: 'Petronet LNG' }[s] || s);

// 4) Multiples (nearest half-turn); P/E cross-check on patched EPS (every weekly close) with the P/E-based move
const MULT = { base: half(OWN.med * k), bull: half(OWN.med), bear: half(OWN.p25 * k) };
const epsBy = {}; pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) epsBy[+p.slice(-4)] = pl.rows['EPS in Rs'][i] * SH_ISSUED / SH_NET; });
F.years.forEach((y, i) => { epsBy[2000 + +y.slice(2, 4)] = F.eps[i]; });
const troughEps = fy => { const pk = Math.max(epsBy[fy - 1], epsBy[fy - 2], epsBy[fy - 3]); return !(epsBy[fy] > 0) || epsBy[fy] < 0.5 * pk; };
const peRows = weekly.map(([d, p]) => ({ d, fy: fyOf(d), m: p / epsBy[fyOf(d)], t: troughEps(fyOf(d)) }));
const peKept = peRows.filter(r => !r.t), PEOWN = { med: pct(peKept.map(r => r.m), 0.5), p25: pct(peKept.map(r => r.m), 0.25), n: peKept.length };
const peTroughFy = [...new Set(peRows.filter(r => r.t).map(r => `FY${String(r.fy).slice(2)}`))];
// bull = the larger of the base multiple and the own median (the P/E move is a re-rating, so 'no move' would sit below base)
const kPe = 1 + SENSMV.pe / 100, PEMULT = { base: half(PEOWN.med * kPe), bull: Math.max(half(PEOWN.med * kPe), half(PEOWN.med)), bear: half(PEOWN.p25 * kPe) };
const FM = forwardMedian('IOC', M); // house function on Screener's unpatched EPS (1,412 cr shares): reference only

// 5) Listed stakes at the 30-Sep-2026 close; minorities (CPCL at market, others at book)
const DISC = { base: 20, bull: 0, bear: 30 };
const STK = C.investments.listed.map(s => ({ ...s, px: CL[s.sym], mv: s.shares * CL[s.sym] }));
const listedMv = STK.reduce((t, s) => t + s.mv, 0), listedBook = STK.reduce((t, s) => t + s.carrying, 0);
const reval = Object.fromEntries(Object.entries(DISC).map(([c, d]) => [c, listedMv * (1 - d / 100) - listedBook]));
const cpclMcap = P.CHENNPETRO?.mcapCr ?? null, cpclMin = cpclMcap * C.investments.cpcl.minorityPct / 100;
const otherNci = C.investments.cpcl.nciTotalBook - C.investments.cpcl.nciBook, MINOR = -(cpclMin + otherNci);

// Valuation outputs, street
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key), SP = (V.sotp || {}).parts || [];
const ebSep = sep(F.ebitda), epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const rating = ratingFor(V.upside), buyBelow = Math.round(buyAt(V.tp)), sellAbove = Math.round(sellAt(V.tp));
const ST = D.street.brokers, medTp = medOf(ST.map(s => s.tp)), POSTQ1 = ST.filter(s => s.date >= '2026-08-01'), medPost = medOf(POSTQ1.map(s => s.tp));
const trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), fwdPe = price / F.eps[1];
const netDebt26 = A.borrowings[b] - A.cash[b] - A.investments[b];

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, n0, n1, pc, pc1, half, medOf, pct, SA, yr, A26, A25, Q1, b, price, shares, mcap, sep, ix,
  bld, EPT, eptAvg, evRows, evKept, OWN, evTroughFy, evByFy, grossMed, evNow, evCoreNow, fwdEvNow, fwdEvSep,
  SET, EXCL, USED, WIDE, PEERS, P, EVMED5, PEMED5, evMove, peMove, sectorMv, k, SENSMV, shortName, MULT,
  peRows, PEOWN, peTroughFy, kPe, PEMULT, FM, DISC, STK, listedMv, listedBook, reval, cpclMcap, cpclMin, otherNci, MINOR,
  BM, mv, SP, ebSep, epsSep, rating, buyBelow, sellAbove, ST, medTp, POSTQ1, medPost, trailEps, fwdPe, netDebt26, SH_NET, SH_ISSUED };
