// Hero MotoCorp initiation: shared context for the Part B files (research.js, part2-4b). Loads the research
// JSONs and the built model; rebuilds the volume x realisation build and checks it against model revenue;
// computes the forward P/E history (house forwardMedian, plus the same median on EPS before associates and
// one-offs), the auto-OEM sector de-rating, the stake values (HEROMOTOCO.stakes.js), EV/EBITDA history and the
// street table once. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { composite } = require('./HEROMOTOCO.stakes');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'HEROMOTOCO', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'HEROMOTOCO.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const lakh = v => (v / 1e5).toFixed(1);
const rup = s => String(s).replace(/Rs ?/g, '₹');
const half = v => Math.round(v * 2) / 2;
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const SRC = 'Hero MotoCorp filings, calls and annual reports; SIAM/VAHAN via Emkay Research; GAM Research';
const b = A.labels.length - 1; // FY26 index
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26;
const yr = fy => SA.find(a => a.fy === fy);

// ---------------------------------------------------------------- Volume x realisation build (assumptions.volumeBuild)
const VB = AS.volumeBuild;
const evSeg = VB.segments.find(s => s.key === 'ev'), iceSegs = VB.segments.filter(s => s.idx);
const iceRev26 = VB.twoWheelerRev26 - VB.exportRev26 - evSeg.units26 * evSeg.real26 / 1e7;
const baseReal = iceRev26 * 1e7 / iceSegs.reduce((t, s) => t + s.units26 * s.idx, 0);
const BUILD = VB.segments.map(s => {
  const u = [s.units26], r = [s.idx ? baseReal * s.idx : s.real26];
  for (let i = 0; i < 3; i++) { u.push(u[i] * (1 + s.growth[i] / 100)); r.push(r[i] * (1 + s.price[i] / 100)); }
  return { key: s.key, name: s.name, why: s.why || s._why, units: u, real: r, rev: u.map((x, i) => x * r[i] / 1e7), growth: s.growth, price: s.price };
});
const grow = (x0, g) => [x0, ...g.reduce((a, gg) => [...a, a[a.length - 1] * (1 + gg / 100)], [x0]).slice(1)];
const PARTS = grow(VB.parts.rev26, VB.parts.growth), OTHER = grow(VB.other.rev26, VB.other.growth);
const TOT = [0, 1, 2, 3].map(i => ({ units: BUILD.reduce((t, s) => t + s.units[i], 0), veh: BUILD.reduce((t, s) => t + s.rev[i], 0), parts: PARTS[i], other: OTHER[i] }));
TOT.forEach(t => (t.rev = t.veh + t.parts + t.other));
const buildCheck = [0, 1, 2].map(i => (TOT[i + 1].rev / TOT[0].rev * A.sales[b]) / F.sales[i] - 1);
if (buildCheck.some(x => Math.abs(x) > 0.005)) console.warn('WARNING: volume build does not reproduce model revenue:', buildCheck.map(x => (x * 100).toFixed(2) + '%').join(' '));
const seg = k => BUILD.find(s => s.key === k);
const domMc = i => ['entry', 'deluxe', 'm125', 'premium'].reduce((t, k) => t + seg(k).units[i], 0);

// ---------------------------------------------------------------- Price, model outputs
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult, evMult = mv('ev').mult;
const epsCagrHist = (Math.pow(A.eps[b] / A.eps[b - 5], 1 / 5) - 1) * 100;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100;
const ST8 = AS.stakes, CMP = composite(ST8, M), core = CMP.base;
const coreMult = ST8.coreMultiple.base, stakePs = core.stakesPerShare;
if (['base', 'bull', 'bear'].some(k => Math.abs(CMP[k].multiple - mv('pe').multiple[k]) > 0.0005)) console.warn('WARNING: composite P/E multiple stale - run node tools/authoring/HEROMOTOCO.stakes.js --sync, then src/model.js');
const priceExStakes = price - stakePs; // what the market pays for the core business

// ---------------------------------------------------------------- One-year-forward P/E history
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'HEROMOTOCO', 'screener.json'), 'utf8'));
const FM = forwardMedian('HEROMOTOCO', M);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pxAt = d => S.charts.price.Price.find(x => x[0] === d)?.[1] ?? (d === ASOF ? price : null);
const med = a => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const pct = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
// EPS before associates and one-offs (AR FY24-26): FY24 + associates loss Rs120 cr + VRS Rs160 cr pre-tax (~Rs120 cr after tax);
// FY25 + associates loss Rs161 cr; FY26 - associates Rs385 cr (incl. Rs722 cr dilution gain) + labour code Rs89 cr after tax + Zero write-down Rs222 cr
const EPS_CORE = { 2023: 140.5, 2024: 199.4, 2025: 227.1, 2026: 283.3 };
const EPS_ONEOFF = { 2023: 140.61, 2024: 193.4, 2025: 218.91, 2026: 266.4 };
F.years.forEach((y, i) => { EPS_CORE[2000 + +y.slice(2, 4)] = F.eps[i]; EPS_ONEOFF[2000 + +y.slice(2, 4)] = F.eps[i]; });
const seriesOn = E => FM.series.map(([d]) => [d, pxAt(d) / E[fyOf(d)]]).filter(x => x[1] > 0);
const fwdCore = seriesOn(EPS_CORE), fwdOneoff = seriesOn(EPS_ONEOFF);
const medCore = med(fwdCore.map(x => x[1])), medOneoff = med(fwdOneoff.map(x => x[1]));
const coreP25 = pct(fwdCore.map(x => x[1]), 0.25), coreP75 = pct(fwdCore.map(x => x[1]), 0.75);
const fwdPe = forwardSeries('HEROMOTOCO', M, 'eps').filter(x => x[0] >= '2016-04-01');
const byFy = ser => { const o = {}; ser.forEach(([d, v]) => (o[fyOf(d)] ||= []).push(v)); return Object.fromEntries(Object.entries(o).map(([k, v]) => [`FY${String(k).slice(2)}`, med(v)])); };
const fwdNow = price / F.eps[1], fwdNowCore = priceExStakes / F.eps[1];

// ---------------------------------------------------------------- Peers at the 30-Sep close; de-rating vs five-year median trailing P/E
const PEER_SYMS = D.peers.list;
const PEERS = peersAsOf(PEER_SYMS, ASOF);
const P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return med((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1])); };
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const OTHERS = PEER_SYMS.filter(s => s !== 'HEROMOTOCO');
const sectorDr = med(OTHERS.map(s => derate[s]));
const afterCore = medCore * (1 + sectorDr / 100), afterHouse = FM.median * (1 + sectorDr / 100), afterOneoff = medOneoff * (1 + sectorDr / 100);
if (half(afterCore) !== coreMult) console.warn(`WARNING: derived core multiple ${half(afterCore)}x differs from assumptions (${coreMult}x)`);
const shortName = s => ({ MARUTI: 'Maruti Suzuki', 'M&M': 'Mahindra & Mahindra', 'BAJAJ-AUTO': 'Bajaj Auto', EICHERMOT: 'Eicher Motors', HEROMOTOCO: 'Hero MotoCorp', TVSMOTOR: 'TVS Motor', ASHOKLEY: 'Ashok Leyland', ESCORTS: 'Escorts Kubota' }[s] || s);

// ---------------------------------------------------------------- EV/EBITDA history (trailing), Sep-28E restatement
const evAll = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]);
const evMed = med(evAll), evP25 = pct(evAll, 0.25), evP75 = pct(evAll, 0.75);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);
const ebitdaSep28 = mv('ev').metric;

// ---------------------------------------------------------------- Rating and street
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, CONS = D.street.consensus;
const postQ1 = ST.filter(s => s.date >= '2026-08-07' && s.tp);
const tpSorted = postQ1.map(s => s.tp).sort((a, c) => a - c);
const medTp = (tpSorted[Math.floor((tpSorted.length - 1) / 2)] + tpSorted[Math.ceil((tpSorted.length - 1) / 2)]) / 2;
const avgTp = tpSorted.reduce((s, x) => s + x, 0) / tpSorted.length;
const pl = ST.find(s => s.broker === 'Prabhudas Lilladher'), emk = ST.find(s => s.broker === 'Emkay'), mosl = ST.find(s => s.broker === 'Motilal Oswal'), choice = ST.find(s => s.broker === 'Choice');

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, lakh, rup, half, shortDate, SRC, b, SA, SQ, QL, Q1, FY26, yr,
  VB, BUILD, TOT, PARTS, OTHER, baseReal, iceRev26, seg, domMc, buildCheck,
  price, mcap, mv, epsSep28, peMult, evMult, epsCagrHist, epsCagrFwd, ST8, CMP, core, coreMult, stakePs, priceExStakes,
  FM, fwdCore, fwdOneoff, medCore, medOneoff, coreP25, coreP75, fwdPe, byFy, fwdNow, fwdNowCore, EPS_CORE,
  PEER_SYMS, PEERS, P, MED5, derate, OTHERS, sectorDr, afterCore, afterHouse, afterOneoff, shortName, evMed, evP25, evP75, ttmEbitda, ebitdaSep28,
  rating, buyBelow, sellAbove, ST, CONS, postQ1, tpSorted, medTp, avgTp, pl, emk, mosl, choice };
