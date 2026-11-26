// Hindustan Petroleum initiation: shared context for the Part B files (as of 30-Sep-2026, Q1FY27 basis).
//
// ===== METHOD (follows the OMC template set in IOC.ctx.js) ==========================================================
// Primary method: sum of the parts on EV/EBITDA, the way the street values HPCL (MOSL 6x Dec-27E, BOB 6x Jun-28E, Emkay
//   6x Jun-28E, all on standalone EBITDA plus investments): consolidated EBITDA on Sep-28E (½ FY28E + ½ FY29E) × one derived
//   multiple, less net debt at Sep-27E (all investments at book inside, incl. HRRL and HMEL equity), plus MRPL and Oil
//   India at the 30-Sep-2026 close less 20% (PLAYBOOK §7c), plus the HRRL subordinated loan at book. No minorities.
// Multiple: own ONE-YEAR-FORWARD CORE EV/EBITDA since Apr-2021, on every weekly close: EV = price × 212.78 cr shares +
//   borrowings incl. leases − cash − ALL investments at the latest published book value; EBITDA = next full year's
//   consolidated operating profit (Screener basis; our FY27E/FY28E for recent dates). Trough years left out (§4 rule on
//   EBITDA: forward EBITDA a loss or below half the highest of the previous three years): FY23 (loss) and FY27E.
// Sector move: peers' trailing EV/EBITDA at the 30-Sep-2026 close vs their five-year medians (Screener, from 30-Sep-2021,
//   positive values), median of the OMC/refiner set IOC, BPCL, MRPL, CHENNPETRO (HPCL itself excluded; its 11.9x vs 5.7x
//   is the Q1 loss, not a re-rating). Widened oil & gas set, OMC-only subset and the P/E-based move are sensitivity rows.
//   Base = own median × (1 + move); bull = own median; bear = own 25th percentile × (1 + move); nearest half-turn.
// Distorted history (brief §4): realised forward EBITDA swings from −₹7,192 cr to +₹30,645 cr, so we also show the median
//   on a mid-cycle denominator (forward-year volume × ₹4,300/t) and with the trough years kept, as sensitivity rows only.
// =================================================================================================================
const fs = require('fs');
const path = require('path');
const { peersAsOf } = require('./asof-peers');
const { forwardMedian } = require('./valuation-blend');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'HINDPETRO', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'HINDPETRO.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'HINDPETRO', 'screener.json'), 'utf8'));
const CL = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', '2026-09-30.json'), 'utf8')).closes;
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2021-04-01', SH = 212.7822517; // crore shares (ar26)
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SA = SG.annual, yr = fy => SA.find(a => a.fy === fy), A26 = yr('FY26'), A25 = yr('FY25'), Q1 = SG.quarterly[SG.quarterly.length - 1];
const b = A.labels.length - 1, price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
if (Math.abs(shares / SH - 1) > 0.001) throw new Error(`HINDPETRO share check failed: model ${shares} vs ${SH}`);

// 1) Volume × realisation and volume × EBITDA per tonne vs the model's segment
const PB = AS.dpBuild, bld = [];
{ let v = PB.base.vol, r = PB.base.rev * 10 / PB.base.vol; // ₹ per tonne
  F.years.forEach((y, i) => { v *= 1 + PB.volGrowth[i] / 100; r *= 1 + PB.realGrowth[i] / 100;
    const rev = v * r / 10, e = v * PB.ebitdaPerTonne[i] / 10;
    bld.push({ y, vol: v, real: r, rev, ebitda: e, ept: PB.ebitdaPerTonne[i], mRev: F.seg.dp.revenue[i], mE: F.seg.dp.adjEbitda[i] }); }); }
bld.forEach(r => { if (Math.abs(r.mRev / r.rev - 1) > 0.005 || Math.abs(r.mE / r.ebitda - 1) > 0.005) throw new Error(`HINDPETRO build check failed ${r.y}: model rev ${n0(r.mRev)} vs ${n0(r.rev)}, EBITDA ${n0(r.mE)} vs ${n0(r.ebitda)}`); });
const FYH = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const EPT = Object.fromEntries(FYH.map(fy => [fy, yr(fy).ebitdaPerT]));
const eptAvg = FYH.reduce((s, f) => s + EPT[f], 0) / FYH.length, eptAvgX23 = FYH.filter(f => f !== 'FY23').reduce((s, f) => s + EPT[f], 0) / 4;

// 2) Own one-year-forward core EV/EBITDA since Apr-2021 (every weekly close), trough years left out
const pl = S.tables['profit-loss'], bs = S.tables['balance-sheet'], cashS = S.schedules['balance-sheet']['Other Assets']['Cash Equivalents'];
const opBy = {}, bsBy = {}, epsBy = {}, volBy = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { opBy[+p.slice(-4)] = pl.rows['Operating Profit'][i]; epsBy[+p.slice(-4)] = pl.rows['EPS in Rs'][i]; } });
bs.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) bsBy[+p.slice(-4)] = { debt: bs.rows.Borrowings[i], inv: bs.rows.Investments[i], cash: cashS[p] }; });
F.years.forEach((y, i) => { opBy[2000 + +y.slice(2, 4)] = F.ebitda[i]; epsBy[2000 + +y.slice(2, 4)] = F.eps[i]; volBy[2000 + +y.slice(2, 4)] = bld[i].vol; });
SA.forEach(a => { if (a.dpVol) volBy[2000 + +a.fy.slice(2)] = a.dpVol; });
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const bsAt = d => bsBy[d.slice(5) >= '05-30' ? +d.slice(0, 4) : +d.slice(0, 4) - 1]; // FY results public by ~end-May
const trough = (o, fy) => { const pk = Math.max(o[fy - 1], o[fy - 2], o[fy - 3]); return !(o[fy] > 0) || o[fy] < 0.5 * pk; };
const MID = 4300; // ₹/t, FY22-26 average without FY23 (mid-cycle denominator for the sensitivity row)
const weekly = S.charts.price.Price.filter(([d]) => d >= FROM && d <= ASOF);
const evRows = weekly.map(([d, p]) => { const q = bsAt(d), fy = fyOf(d), ev = p * SH + q.debt - q.cash - q.inv; return { d, fy, p, ev, m: ev / opBy[fy], t: trough(opBy, fy), mid: ev / (volBy[fy] * MID / 10) }; });
const evKept = evRows.filter(r => !r.t), evVals = evKept.map(r => r.m);
const OWN = { med: pct(evVals, 0.5), p25: pct(evVals, 0.25), p75: pct(evVals, 0.75), n: evKept.length, all: pct(evRows.map(r => r.m).filter(x => x > 0), 0.5), mid: pct(evRows.map(r => r.mid), 0.5), midN: evRows.length };
const evTroughFy = [...new Set(evRows.filter(r => r.t).map(r => `FY${String(r.fy).slice(2)}`))];
const evByFy = Object.fromEntries([...new Set(evRows.map(r => r.fy))].map(fy => [`FY${String(fy).slice(2)}`, { med: medOf(evRows.filter(r => r.fy === fy).map(r => r.m)), eb: opBy[fy], n: evRows.filter(r => r.fy === fy).length, trough: trough(opBy, fy) }]));
const grossMed = pct(evKept.map(r => (r.ev + bsAt(r.d).inv) / opBy[r.fy]), 0.5); // EV without deducting investments
const qAsOf = bsBy[2026], evCoreNow = price * SH + qAsOf.debt - qAsOf.cash - qAsOf.inv;
const fwdEvNow = evCoreNow / F.ebitda[1], fwdEvSep = evCoreNow / sep(F.ebitda);
const chartRows = evRows.map(r => ({ d: r.d, m: r.t ? null : Math.round(r.m * 100) / 100 })); // trough weeks blanked (multiples of −10x to 36x)

// 3) Sector move (EV/EBITDA and P/E) vs five-year medians, at the 30-Sep-2026 close
const SET = D.peers.set, EXCL = Object.keys(D.peers.excluded), USED = SET.filter(s => !EXCL.includes(s)), WIDE = [...SET, ...D.peers.widened];
const PEERS = peersAsOf(['HINDPETRO', ...WIDE], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const ser = (sym, ch, k) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.[ch]?.[k] || [];
const med5 = (sym, ch, k) => pct(ser(sym, ch, k).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5);
const ALL = ['HINDPETRO', ...WIDE];
const EVMED5 = Object.fromEntries(ALL.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const PEMED5 = Object.fromEntries(ALL.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const evMove = Object.fromEntries(ALL.map(s => [s, P[s]?.evEbitda && EVMED5[s] ? (P[s].evEbitda / EVMED5[s] - 1) * 100 : null]));
const peMove = Object.fromEntries(ALL.map(s => [s, P[s]?.pe && PEMED5[s] ? (P[s].pe / PEMED5[s] - 1) * 100 : null]));
const sectorMv = medOf(USED.map(s => evMove[s])), k = 1 + sectorMv / 100;
const SENSMV = { omc: medOf(['IOC', 'BPCL'].map(s => evMove[s])), wide: medOf(WIDE.filter(s => !EXCL.includes(s)).map(s => evMove[s])), pe: medOf(USED.map(s => peMove[s])) };
const shortName = s => ({ HINDPETRO: 'HPCL', IOC: 'Indian Oil', BPCL: 'BPCL', MRPL: 'MRPL', CHENNPETRO: 'Chennai Petroleum', RELIANCE: 'Reliance', ONGC: 'ONGC', OIL: 'Oil India', GAIL: 'GAIL', PETRONET: 'Petronet LNG' }[s] || s);

// 4) Multiples (nearest half-turn); P/E cross-check on Screener EPS (every weekly close) with the P/E-based move
const MULT = { base: half(OWN.med * k), bull: half(OWN.med), bear: half(OWN.p25 * k) };
const peRows = weekly.map(([d, p]) => ({ d, fy: fyOf(d), m: p / epsBy[fyOf(d)], t: trough(epsBy, fyOf(d)) }));
const peKept = peRows.filter(r => !r.t), PEOWN = { med: pct(peKept.map(r => r.m), 0.5), p25: pct(peKept.map(r => r.m), 0.25), n: peKept.length };
const peTroughFy = [...new Set(peRows.filter(r => r.t).map(r => `FY${String(r.fy).slice(2)}`))];
const kPe = 1 + SENSMV.pe / 100, PEMULT = { base: half(PEOWN.med * kPe), bull: Math.max(half(PEOWN.med * kPe), half(PEOWN.med)), bear: half(PEOWN.p25 * kPe) };
const FM = forwardMedian('HINDPETRO', M); // house function (same Screener EPS): reference

// 5) Listed stakes at the 30-Sep-2026 close; HRRL loan
const DISC = { base: 20, bull: 0, bear: 30 };
const STK = C.investments.listed.map(s => ({ ...s, px: CL[s.sym], mv: s.shares * CL[s.sym] }));
const listedMv = STK.reduce((t, s) => t + s.mv, 0), listedBook = STK.reduce((t, s) => t + s.carrying, 0);
const reval = Object.fromEntries(Object.entries(DISC).map(([c, d]) => [c, listedMv * (1 - d / 100) - listedBook]));
const HR = C.investments.hrrl, HM = C.investments.hmel;
const hrrlInvested = HR.equityInvested + HR.subDebt, hrrlBear = 0.8 * hrrlInvested - HR.carrying;

// Valuation outputs, street
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key), SP = (V.sotp || {}).parts || [];
const ebSep = sep(F.ebitda), epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const rating = ratingFor(V.upside), buyBelow = Math.round(buyAt(V.tp)), sellAbove = Math.round(sellAt(V.tp));
const ST = D.street.brokers, medTp = medOf(ST.map(s => s.tp)), POSTQ1 = ST.filter(s => s.date >= '2026-07-01'), medPost = medOf(POSTQ1.map(s => s.tp));
const trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), fwdPe = price / F.eps[1];
const netDebt26 = A.borrowings[b] - A.cash[b] - A.investments[b];

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, SH, n0, n1, pc, pc1, half, medOf, pct, SA, yr, A26, A25, Q1, b, price, shares, mcap, sep,
  PB, bld, FYH, EPT, eptAvg, eptAvgX23, MID, evRows, evKept, OWN, evTroughFy, evByFy, grossMed, evCoreNow, fwdEvNow, fwdEvSep, chartRows,
  SET, EXCL, USED, WIDE, PEERS, P, EVMED5, PEMED5, evMove, peMove, sectorMv, k, SENSMV, shortName, MULT,
  peRows, PEOWN, peTroughFy, kPe, PEMULT, FM, DISC, STK, listedMv, listedBook, reval, HR, HM, hrrlInvested, hrrlBear,
  BM, mv, SP, ebSep, epsSep, rating, buyBelow, sellAbove, ST, medTp, POSTQ1, medPost, trailEps, fwdPe, netDebt26 };
