// JBM Auto initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks the
// three-segment build (components, tool room, EV business; segment EBIT less a bridge) against model revenue and EBITDA,
// reconciles other income, and derives the P/E and EV/EBITDA multiples (house rule, PLAYBOOK §4 and §7c) once.
// syncBuild() writes revenue growth and EBITDA margin from the build into assumptions.json (EBITDA = segment EBIT - bridge
// + model depreciation; depreciation does not depend on them, so one pass converges); syncMultiples() writes the derived
// multiples (EPS does not depend on them). Re-run node src/model.js JBMA after either changes anything.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'JBMA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'JBMA.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'JBMA', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2021-04-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const shortDate = d => { if (/^\d{4}$/.test(d)) return d; const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SA = SG.annual, SQ = SG.quarterly;
const yr = fy => SA.find(a => a.fy === fy);
const Q1 = C.q1fy27, b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E

// 1) Segment build vs model revenue and EBITDA
function runBuild(BL, dep) {
  const out = []; let co = BL.base.co, tr = BL.base.tr, ev = BL.base.ev, prev = co + tr + ev;
  for (let i = 0; i < 3; i++) {
    co *= 1 + BL.coGrowth[i] / 100; tr *= 1 + BL.trGrowth[i] / 100; ev *= 1 + BL.evGrowth[i] / 100;
    const ce = co * BL.coMargin[i] / 100, te = tr * BL.trMargin[i] / 100, ee = ev * BL.evMargin[i] / 100, seg = ce + te + ee, ebit = seg - BL.bridge[i];
    const rev = co + tr + ev, ebitda = ebit + dep[i];
    out.push({ y: ['FY27E', 'FY28E', 'FY29E'][i], co, tr, ev, rev, ce, te, ee, seg, ebit, ebitda, growth: (rev / prev - 1) * 100, margin: ebitda / rev * 100 }); prev = rev;
  }
  return out;
}
const BL = AS.build, bld = runBuild(BL, F.dep);
const baseGap = (A.sales[b] / (BL.base.co + BL.base.tr + BL.base.ev) - 1) * 100;
bld.forEach((r, i) => { r.gap = (F.sales[i] / r.rev - 1) * 100 - baseGap; r.gapE = (F.ebitda[i] / r.ebitda - 1) * 100; });
const assertBuild = () => bld.forEach((r, i) => { if (Math.abs(r.gap) > 0.3 || Math.abs(r.gapE) > 0.5) throw new Error(`JBMA build check failed ${r.y}: revenue ${n0(F.sales[i])} vs ${n0(r.rev)}, EBITDA ${n0(F.ebitda[i])} vs ${n0(r.ebitda)}. Run syncBuild().`); });
const evShare = bld.map(r => r.ev / r.rev * 100);
// History of the bridge: segment EBIT (three segments) less Screener EBITDA - depreciation
const bridgeHist = ['FY24', 'FY25', 'FY26'].map(fy => { const a = yr(fy), i = A.labels.indexOf(fy); return { fy, v: a.coEbit + a.trEbit + a.evEbit - (A.ebitda[i] - A.dep[i]) }; });

// 2) Other income: FY27E vs the run-rate (Q1FY27 x4 and the four quarters to Jun-26, before the Dec-25 exceptional)
const QO = M.quarterly.otherIncome, ttmOI = QO.slice(-4).reduce((s, x) => s + x, 0), ttmOIx = ttmOI + 9.6;
const oiCheck = { fy27: F.otherIncome[0], q1x4: QO.at(-1) * 4, ttm: ttmOI, ttmExExc: ttmOIx, fy26: A.otherIncome[b] };
const assertOi = () => { if (F.otherIncome[0] < 0.7 * oiCheck.ttmExExc || F.otherIncome[0] > 1.0 * oiCheck.q1x4) throw new Error(`JBMA other income FY27E ${n0(F.otherIncome[0])} off the run-rate`); };
const OT = AS.otherTreasury?.base || 0; // Rs410 cr repaid by the JV in Jun-2026 (pro forma)
const nd0 = -((A.cash[b] || 0) + A.investments[b] + OT - A.borrowings[b]); // pro forma net debt at Mar-26 (incl. JV preference shares in investments)
const ndEbitda = F.treasury.map((t, i) => -t / F.ebitda[i]);

// 3) Forward P/E history (house forwardMedian, from Apr-2021)
const FM = forwardMedian('JBMA', M, { from: FROM });
const FMapr22 = forwardMedian('JBMA', M, { from: '2022-04-01' });
const fmP25 = pct(FM.series.map(x => x[1]), 0.25), fmP75 = pct(FM.series.map(x => x[1]), 0.75);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsBy = {}; S.tables['profit-loss'].periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) epsBy[+p.slice(-4)] = S.tables['profit-loss'].rows['EPS in Rs'][i]; });
F.years.forEach((y, i) => { epsBy[2000 + +y.slice(2, 4)] = F.eps[i]; });
const pxAll = S.charts.price.Price.filter(([d]) => d >= FROM && d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const fwdWeekly = pxAll.map(([d, p]) => [d, Math.round(p / epsBy[fyOf(d)] * 10) / 10]);
const weeklyMed = medOf(fwdWeekly.map(x => x[1]));
// The e-bus re-rating: prices from Apr-2023 to Mar-2025 (forward years FY25-FY26) carried 50-114x forward P/E
const exHypeMed = medOf(FM.series.filter(([d]) => ![2025, 2026].includes(fyOf(d))).map(x => x[1]));
const byBucket = {}; fwdWeekly.forEach(([d, x]) => (byBucket[fyOf(d)] ||= []).push(x));
const buckets = Object.entries(byBucket).map(([fy, v]) => ({ fy: `FY${String(fy).slice(2)}`, period: `Apr-${String(fy - 2).slice(2)}–Mar-${String(fy - 1).slice(2)}`, n: v.length, med: medOf(v), lo: Math.min(...v), hi: Math.max(...v) }));
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps), fwd27 = price / F.eps[0];
const trailEps = M.quarterly.pat.slice(-4).reduce((s, x) => s + x, 0) / shares, trailPe = price / trailEps;
const px52 = S.charts.price.Price.filter(([d]) => d > '2025-09-30' && d <= ASOF).map(x => x[1]);
const hi52 = Math.max(...px52, price), lo52 = Math.min(...px52, price);

// 4) Sector de-rating: auto-component peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set, EBUS = D.peers.ebusPeers;
const PEERS = peersAsOf(['JBMA', ...PEER_SYMS, 'CRAFTSMAN', ...EBUS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const ALLS = ['JBMA', ...PEER_SYMS, 'CRAFTSMAN', ...EBUS];
const MED5 = Object.fromEntries(ALLS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(ALLS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.map(s => derate[s]));
const sectorDrCr = medOf([...USED, 'CRAFTSMAN'].map(s => derate[s]));
const k = 1 + sectorDr / 100;
const shortName = s => ({ JBMA: 'JBM Auto', BOSCHLTD: 'Bosch', MOTHERSON: 'Samvardhana Motherson', BHARATFORG: 'Bharat Forge', UNOMINDA: 'Uno Minda', SCHAEFFLER: 'Schaeffler India', TIINDIA: 'Tube Investments', ENDURANCE: 'Endurance Tech', ZFCVINDIA: 'ZF CV Control', MSUMI: 'Motherson Sumi Wiring', GABRIEL: 'Gabriel India', SONACOMS: 'Sona Comstar', CRAFTSMAN: 'Craftsman', OLECTRA: 'Olectra Greentech', ASHOKLEY: 'Ashok Leyland' }[s] || s);

// 5) Multiples (nearest half-turn): base = own median x sector de-rating; bull = no de-rating; bear = 25th pct de-rated
const MULT = { base: half(FM.median * k), bull: half(FM.median), bear: half(fmP25 * k) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= FROM && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25), evNow = P.JBMA.evEbitda;
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda), evConv = ttmEbitda / ebitdaSep28;
const evMULT = { base: half(evMed * k * evConv), bull: half(evMed * evConv), bear: half(evP25 * k * evConv) };
const SENS = { apr22: half(FMapr22.median * k), weekly: half(weeklyMed * k), exHype: half(exHypeMed * k), withCr: half(FM.median * (1 + sectorDrCr / 100)), olectra: half(P.OLECTRA.pe), allEleven: half(FM.median * (1 + sectorDrAll / 100)) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100;
const patCagrHist = (Math.pow(A.pat[b] / A.pat[b - 4], 1 / 4) - 1) * 100;
const peg = MULT.base / epsCagrFwd;

function syncBuild() {
  const FILE = path.join(RD, 'assumptions.json'), as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const r = runBuild(as.build, F.dep), g = r.map(x => Math.round(x.growth * 1000) / 1000), m = r.map(x => Math.round(x.margin * 1000) / 1000);
  if (JSON.stringify(g) === JSON.stringify(as.revenueGrowth) && JSON.stringify(m) === JSON.stringify(as.ebitdaMargin)) { console.log('JBMA build unchanged'); return false; }
  as.revenueGrowth = g; as.ebitdaMargin = m; fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  console.log(`JBMA build UPDATED: growth ${g}, margin ${m}. Re-run node src/model.js JBMA.`); return true;
}
function syncMultiples() {
  const FILE = path.join(RD, 'assumptions.json'), as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(x => x.key === 'pe'), ev = as.valuation.blend.methods.find(x => x.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(x => a?.[x] === c[x]);
  if (same(pe.multiple, MULT) && same(ev.multiple, evMULT)) { console.log(`JBMA multiples unchanged: P/E ${JSON.stringify(MULT)}, EV/EBITDA ${JSON.stringify(evMULT)}`); return false; }
  pe.multiple = MULT; ev.multiple = evMULT; fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  console.log(`JBMA multiples UPDATED: P/E ${JSON.stringify(MULT)}, EV/EBITDA ${JSON.stringify(evMULT)}. Re-run node src/model.js JBMA, then node tools/authoring/JBMA.js.`); return true;
}

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, n0, n1, n2, pc, pc1, half, shortDate, medOf, pct, SA, SQ, yr, Q1, b, price, shares, mcap, sep,
  BL, bld, assertBuild, assertOi, evShare, bridgeHist, oiCheck, nd0, ndEbitda, FM, FMapr22, fmP25, fmP75, fyOf, epsBy, fwdWeekly, weeklyMed, exHypeMed, buckets, fwdNow, sepNow, fwd27, trailEps, trailPe, hi52, lo52,
  PEER_SYMS, EBUS, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, sectorDrCr, k, shortName, MULT, epsSep, evHist, evMed, evP25, evNow, evMULT, evConv, ttmEbitda, ebitdaSep28, SENS,
  BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, patCagrHist, peg, syncBuild, syncMultiples };

if (require.main === module) {
  console.log('build', bld.map(r => [r.y, Math.round(r.rev), n1(r.growth), n1(r.margin), r.gap.toFixed(2), r.gapE.toFixed(2)]), 'baseGap', baseGap.toFixed(3), 'bridge', bridgeHist.map(x => `${x.fy}:${n1(x.v)}`).join(' '), 'oi', oiCheck, 'nd0', n0(nd0), 'ndEbitda', ndEbitda.map(n2));
  console.log('FM', FM.median, FM.medianAll, FM.troughYears, FM.series.length, 'apr22', FMapr22.median, 'weekly', weeklyMed, 'exHype', exHypeMed, 'p25/75', fmP25, fmP75, buckets.map(x => `${x.fy}:${n1(x.med)}`).join(' '));
  console.log('derate', Object.entries(derate).map(([s, v]) => `${s} ${v?.toFixed(1)}`).join(', '), 'sector', sectorDr.toFixed(2), 'all', sectorDrAll.toFixed(2), 'withCr', sectorDrCr.toFixed(2));
  console.log('MULT', MULT, 'ev', evMed, evP25, evNow, evConv.toFixed(3), evMULT, 'SENS', SENS, 'epsSep', epsSep, 'tp', V.tp, 'upside', V.upside.toFixed(1), rating, 'peg', peg.toFixed(2), 'fwd', n1(fwd27), n1(fwdNow), n1(sepNow), 'trail', n1(trailPe), '52w', hi52, lo52, 'methods', BM.map(m => [m.key, Math.round(m.value)]));
}
