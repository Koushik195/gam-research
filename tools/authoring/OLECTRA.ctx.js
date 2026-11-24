// Olectra Greentech initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks
// the two-segment build (Mobility = vehicles x revenue per vehicle; Energy = insulators; segment EBIT less a bridge equal to
// other income) against model revenue and EBITDA, reconciles other income, and derives the P/E and EV/EBITDA multiples
// once (house rule, PLAYBOOK §4 and §7c). syncBuild() writes revenue growth and EBITDA margin from the build into
// assumptions.json; syncMultiples() writes the derived multiples. Re-run node src/model.js OLECTRA after either changes.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'OLECTRA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'OLECTRA.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'OLECTRA', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2021-04-01', BREAK = '2022-04-01', R12 = '2025-10-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const yr = fy => SA.find(a => a.fy === fy);
const Q1 = C.q1fy27, b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E

// 1) Segment build vs model revenue and EBITDA
function runBuild(BL, dep, oi) {
  const out = []; let en = BL.base.enRev, prev = BL.base.mobRev + BL.base.enRev;
  for (let i = 0; i < 3; i++) {
    const units = BL.units[i], rpu = BL.revPerUnit[i], mob = units * rpu; en *= 1 + BL.enGrowth[i] / 100;
    const me = mob * BL.mobMargin[i] / 100, ee = en * BL.enMargin[i] / 100, seg = me + ee, bridge = oi[i], ebitda = seg - bridge + dep[i], rev = mob + en;
    out.push({ y: ['FY27E', 'FY28E', 'FY29E'][i], units, rpu, mob, en, rev, me, ee, seg, bridge, ebitda, growth: (rev / prev - 1) * 100, margin: ebitda / rev * 100 }); prev = rev;
  }
  return out;
}
const BL = AS.build, bld = runBuild(BL, F.dep, AS.otherIncome);
const baseGap = (A.sales[b] / (BL.base.mobRev + BL.base.enRev) - 1) * 100;
bld.forEach((r, i) => { r.gap = (F.sales[i] / r.rev - 1) * 100 - baseGap; r.gapE = (F.ebitda[i] / r.ebitda - 1) * 100; });
const assertBuild = () => bld.forEach((r, i) => { if (Math.abs(r.gap) > 0.3 || Math.abs(r.gapE) > 0.5) throw new Error(`OLECTRA build check failed ${r.y}: revenue ${n0(F.sales[i])} vs ${n0(r.rev)}, EBITDA ${n0(F.ebitda[i])} vs ${n0(r.ebitda)}. Run syncBuild().`); });
const mobShare = bld.map(r => r.mob / r.rev * 100);
// Bridge history: segment EBIT (both segments) less (Screener EBITDA - depreciation) ≈ other income incl. associates
const bridgeHist = ['FY24', 'FY25', 'FY26'].map(fy => { const a = yr(fy), i = A.labels.indexOf(fy); return { fy, v: a.mobEbit + a.enEbit - (A.ebitda[i] - A.dep[i]), oi: A.otherIncome[i] }; });

// 2) Other income: FY27E vs the run-rate (Q1FY27 x4, four quarters to Jun-26, FY26)
const QO = M.quarterly.otherIncome, ttmOI = QO.slice(-4).reduce((s, x) => s + x, 0);
const oiCheck = { fy27: F.otherIncome[0], q1x4: QO.at(-1) * 4, ttm: ttmOI, fy26: A.otherIncome[b] };
const assertOi = () => { if (F.otherIncome[0] < 0.8 * ttmOI || F.otherIncome[0] > 1.2 * Math.max(ttmOI, oiCheck.fy26)) throw new Error(`OLECTRA other income FY27E ${n0(F.otherIncome[0])} off the run-rate`); };
const nd0 = -((A.cash[b] || 0) + A.investments[b] - A.borrowings[b]); // net debt at Mar-26 (cash incl. margin money; SPV equity in investments)
const ndEbitda = F.treasury.map((t, i) => -t / F.ebitda[i]);

// 3) Forward P/E history (house forwardMedian from Apr-2021) and sensitivities on every weekly close
const FM = forwardMedian('OLECTRA', M, { from: FROM });
const fmP25 = pct(FM.series.map(x => x[1]), 0.25), fmP75 = pct(FM.series.map(x => x[1]), 0.75);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsBy = {}; S.tables['profit-loss'].periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) epsBy[+p.slice(-4)] = S.tables['profit-loss'].rows['EPS in Rs'][i]; });
F.years.forEach((y, i) => { epsBy[2000 + +y.slice(2, 4)] = F.eps[i]; });
const pxAll = S.charts.price.Price.filter(([d]) => d >= FROM && d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const fwdWeekly = pxAll.map(([d, p]) => [d, Math.round(p / epsBy[fyOf(d)] * 10) / 10]);
const wk = (from, to = '9999') => fwdWeekly.filter(([d]) => d >= from && d <= to).map(x => x[1]);
const weeklyMed = medOf(wk(FROM)), breakMed = medOf(wk(BREAK)), r12Med = medOf(wk(R12)), r12P25 = pct(wk(R12), 0.25);
const HYPE = [2024, 2025, 2026]; // forward years FY24-26 = prices Apr-2022 to Mar-2025 (the e-bus re-rating, 60-75x)
const exHypeMed = medOf(FM.series.filter(([d]) => !HYPE.includes(fyOf(d))).map(x => x[1]));
const byBucket = {}; fwdWeekly.forEach(([d, x]) => (byBucket[fyOf(d)] ||= []).push(x));
const buckets = Object.entries(byBucket).map(([fy, v]) => ({ fy: `FY${String(fy).slice(2)}`, period: `Apr-${String(fy - 2).slice(2)}–Mar-${String(fy - 1).slice(2)}`, n: v.length, med: medOf(v), lo: Math.min(...v), hi: Math.max(...v), eps: epsBy[fy] }));
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps), fwd27 = price / F.eps[0];
const trailEps = M.quarterly.pat.slice(-4).reduce((s, x) => s + x, 0) / shares, trailPe = price / trailEps;
const px52 = S.charts.price.Price.filter(([d]) => d > '2025-09-30' && d <= ASOF).map(x => x[1]);
const hi52 = Math.max(...px52, price), lo52 = Math.min(...px52, price);

// 4) Sector move: auto-OEM peers' trailing P/E at the 30-Sep close vs five-year medians (PLAYBOOK §7c), plus the same
//    peers vs medians over the sensitivity windows (since Apr-2022, last 12 months)
const PEER_SYMS = D.peers.set, EXTRA = D.peers.extra, EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const ALLS = ['OLECTRA', ...PEER_SYMS, ...EXTRA];
const PEERS = peersAsOf(ALLS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const peSer = sym => (JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.pe?.['Price to Earning'] || []);
const medFrom = (sym, from) => pct(peSer(sym).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]), 0.5);
const MED5 = Object.fromEntries(ALLS.map(s => [s, medFrom(s, '2021-09-30')]));
const drOn = from => Object.fromEntries(ALLS.map(s => { const m = medFrom(s, from); return [s, P[s].pe && m ? (P[s].pe / m - 1) * 100 : null]; }));
const derate = drOn('2021-09-30'), drBreak = drOn(BREAK), dr12 = drOn(R12);
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.map(s => derate[s]));
const sectorBreak = medOf(USED.map(s => drBreak[s])), sector12 = medOf(USED.map(s => dr12[s]));
const k = 1 + sectorDr / 100;
const shortName = s => ({ OLECTRA: 'Olectra Greentech', MARUTI: 'Maruti Suzuki', 'M&M': 'Mahindra & Mahindra', 'BAJAJ-AUTO': 'Bajaj Auto', EICHERMOT: 'Eicher Motors', HEROMOTOCO: 'Hero MotoCorp', TVSMOTOR: 'TVS Motor', ASHOKLEY: 'Ashok Leyland', ESCORTS: 'Escorts Kubota', JBMA: 'JBM Auto' }[s] || s);

// 5) Multiples (nearest half-turn): base = own median × sector move; bull = no move; bear = 25th percentile × move
const MULT = { base: half(FM.median * k), bull: half(FM.median), bear: half(fmP25 * k) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= FROM && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25), evNow = P.OLECTRA.evEbitda;
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda), evConv = ttmEbitda / ebitdaSep28;
const evMULT = { base: half(evMed * k * evConv), bull: half(evMed * evConv), bear: half(evP25 * k * evConv) };
const SENS = { break: half(breakMed * (1 + sectorBreak / 100)), r12: half(r12Med * (1 + sector12 / 100)), weekly: half(weeklyMed * k), exHype: half(exHypeMed * k), jbma: half(P.JBMA.pe) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100;
const peg = MULT.base / epsCagrFwd;
const ST = D.street.brokers, standing = ST.filter(s => s.standing && s.tp), medTp = standing.length ? medOf(standing.map(s => s.tp)) : null;

function syncBuild() {
  const FILE = path.join(RD, 'assumptions.json'), as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const r = runBuild(as.build, F.dep, as.otherIncome), g = r.map(x => Math.round(x.growth * 1000) / 1000), m = r.map(x => Math.round(x.margin * 1000) / 1000);
  if (JSON.stringify(g) === JSON.stringify(as.revenueGrowth) && JSON.stringify(m) === JSON.stringify(as.ebitdaMargin)) { console.log('OLECTRA build unchanged'); return false; }
  as.revenueGrowth = g; as.ebitdaMargin = m; fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  console.log(`OLECTRA build UPDATED: growth ${g}, margin ${m}. Re-run node src/model.js OLECTRA.`); return true;
}
function syncMultiples() {
  const FILE = path.join(RD, 'assumptions.json'), as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(x => x.key === 'pe'), ev = as.valuation.blend.methods.find(x => x.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(x => a?.[x] === c[x]);
  if (same(pe.multiple, MULT) && same(ev.multiple, evMULT)) { console.log(`OLECTRA multiples unchanged: P/E ${JSON.stringify(MULT)}, EV/EBITDA ${JSON.stringify(evMULT)}`); return false; }
  pe.multiple = MULT; ev.multiple = evMULT; fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  console.log(`OLECTRA multiples UPDATED: P/E ${JSON.stringify(MULT)}, EV/EBITDA ${JSON.stringify(evMULT)}. Re-run node src/model.js OLECTRA, then node tools/authoring/OLECTRA.js.`); return true;
}

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, BREAK, R12, n0, n1, n2, pc, pc1, half, medOf, pct, SA, SQ, QL, yr, Q1, b, price, shares, mcap, sep,
  BL, bld, assertBuild, assertOi, mobShare, bridgeHist, oiCheck, nd0, ndEbitda, FM, fmP25, fmP75, fyOf, epsBy, fwdWeekly, weeklyMed, breakMed, r12Med, r12P25, exHypeMed, buckets, fwdNow, sepNow, fwd27, trailEps, trailPe, hi52, lo52,
  PEER_SYMS, EXTRA, PEERS, P, MED5, derate, drBreak, dr12, EXCL, USED, sectorDr, sectorDrAll, sectorBreak, sector12, k, shortName, MULT, epsSep, evHist, evMed, evP25, evNow, evMULT, evConv, ttmEbitda, ebitdaSep28, SENS,
  BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, peg, ST, standing, medTp, syncBuild, syncMultiples };

if (require.main === module) {
  console.log('build', bld.map(r => [r.y, Math.round(r.rev), n1(r.growth), n1(r.margin), r.gap.toFixed(2), r.gapE.toFixed(2)]), 'baseGap', baseGap.toFixed(3), 'bridge', bridgeHist.map(x => `${x.fy}:${n1(x.v)}/${n1(x.oi)}`).join(' '), 'oi', oiCheck, 'nd0', n0(nd0), 'ndEbitda', ndEbitda.map(n2));
  console.log('FM', FM.median, FM.medianAll, FM.troughYears, FM.series.length, 'p25/75', fmP25, fmP75, 'weekly', weeklyMed, 'break', breakMed, 'r12', r12Med, 'exHype', exHypeMed, buckets.map(x => `${x.fy}:${n1(x.med)}(${x.eps})`).join(' '));
  console.log('derate', USED.map(s => `${s} ${derate[s]?.toFixed(1)}`).join(', '), 'sector', sectorDr.toFixed(2), 'all', sectorDrAll.toFixed(2), 'break', sectorBreak.toFixed(2), '12m', sector12.toFixed(2), 'self', derate.OLECTRA.toFixed(1));
  console.log('MULT', MULT, 'ev', evMed, evP25, evNow, evConv.toFixed(3), evMULT, 'SENS', SENS, 'epsSep', epsSep, 'tp', V.tp, 'upside', V.upside.toFixed(1), rating, 'peg', peg.toFixed(2), 'fwd', n1(fwd27), n1(fwdNow), n1(sepNow), 'trail', n1(trailPe), '52w', hi52, lo52, 'methods', BM.map(m => [m.key, Math.round(m.value)]), 'medTp', medTp);
}
