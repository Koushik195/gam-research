// Samvardhana Motherson initiation: shared context for the Part B files. Loads the research JSONs and the built
// model, checks the segment build, and derives the P/E and EV/EBITDA multiples (house rule, PLAYBOOK §4 and §7c)
// once. syncMultiples() writes the derived multiples into assumptions.json (EPS does not depend on them, so one
// pass converges; the next `node src/model.js MOTHERSON` carries them into the report and Excel). As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'MOTHERSON', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'MOTHERSON.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', REORG = '2022-01-24';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const yr = fy => SA.find(a => a.fy === fy);
const A26 = yr('FY26'), A25 = yr('FY25'), Q1 = C.q1fy27;
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, mcap = price * F.shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };

// 1) Segment build: sum of divisions less eliminations and JVs = model revenue and EBITDA
const SEGK = ['wh', 'mpp', 'vs', 'ia', 'eb', 'elim', 'jv'];
const segName = Object.fromEntries(AS.segments.map(s => [s.key, s.name]));
F.years.forEach((y, i) => {
  const rev = SEGK.reduce((t, k) => t + F.seg[k].revenue[i], 0), e = SEGK.reduce((t, k) => t + F.seg[k].adjEbitda[i], 0);
  if (Math.abs(rev / F.sales[i] - 1) > 0.002 || Math.abs(e / F.ebitda[i] - 1) > 0.002) throw new Error(`MOTHERSON segment check ${y}: ${n0(rev)} vs ${n0(F.sales[i])}; ${n0(e)} vs ${n0(F.ebitda[i])}`);
});
const econ = F.years.map((_, i) => SEGK.filter(k => k !== 'jv').reduce((t, k) => t + F.seg[k].revenue[i], 0));
const segRev = k => F.seg[k].revenue, segE = k => F.seg[k].adjEbitda, segM = (k, i) => F.seg[k].adjEbitda[i] / F.seg[k].revenue[i] * 100;

// 2) Inorganic revenue in FY27E (Nexans from 3-Jul, Yutaka from 21-Jul) and the organic remainder
const NEXANS27 = 6000, YUTAKA27 = 7350, NEXANS_FULL = 8200, YUTAKA_FULL = 10630;
const organic27 = ((F.sales[0] - NEXANS27 - YUTAKA27) / A.sales[b] - 1) * 100;

// 3) Forward P/E history (house forwardMedian), from the Jan-2022 reorganisation (PLAYBOOK §4: "or from demerger")
const FM = forwardMedian('MOTHERSON', M, { from: REORG });
const FMall = forwardMedian('MOTHERSON', M); // from Apr-2021, sensitivity only
const fmP25 = pct(FM.series.map(x => x[1]), 0.25), fmP75 = pct(FM.series.map(x => x[1]), 0.75);
// Same median on EPS before exceptional items (PLAYBOOK §4 "one-offs"): attributable profit less post-tax exceptionals
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'MOTHERSON', 'screener.json'), 'utf8'));
const PL = S.tables['profit-loss'], PFE = S.schedules['profit-loss']['Net Profit']['Profit for EPS'], EXAT = S.schedules['profit-loss']['Net Profit']['Exceptional items AT'];
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsAdj = {}, epsRep = {};
PL.periods.forEach((p, i) => { if (!/^Mar \d{4}$/.test(p)) return; const y = +p.slice(-4), e = PL.rows['EPS in Rs'][i]; epsRep[y] = e; epsAdj[y] = PFE[p] ? e * (PFE[p] - (EXAT[p] || 0)) / PFE[p] : e; });
F.years.forEach((y, i) => { epsRep[2000 + +y.slice(2, 4)] = F.eps[i]; epsAdj[2000 + +y.slice(2, 4)] = F.eps[i]; });
const adjSeries = FM.series.map(([d, pe]) => { const f = fyOf(d); return [d, Math.round(pe * epsRep[f] / epsAdj[f] * 10) / 10]; });
const adjMed = pct(adjSeries.map(x => x[1]), 0.5);
const fwdPe = forwardSeries('MOTHERSON', M, 'eps').filter(x => x[0] >= '2017-04-01');
const byBucket = {}; FM.series.forEach(([d, x]) => (byBucket[fyOf(d)] ||= []).push(x));
const buckets = Object.entries(byBucket).map(([fy, v]) => ({ fy: `FY${String(fy).slice(2)}`, n: v.length, med: pct(v, 0.5), lo: Math.min(...v), hi: Math.max(...v) }));

// 4) Sector de-rating: auto-component peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c)
const PEER_SYMS = ['MOTHERSON', ...D.peers.set];
const PEERS = peersAsOf(PEER_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = D.peers.set.filter(s => !EXCL.includes(s));
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(D.peers.set.map(s => derate[s]));
const k = 1 + sectorDr / 100;
const shortName = s => ({ MOTHERSON: 'Samvardhana Motherson', BOSCHLTD: 'Bosch', UNOMINDA: 'Uno Minda', SONACOMS: 'Sona BLW', BHARATFORG: 'Bharat Forge', ENDURANCE: 'Endurance Tech', MSUMI: 'Motherson Sumi Wiring (MSWIL)', SCHAEFFLER: 'Schaeffler India', TIINDIA: 'Tube Investments', ZFCVINDIA: 'ZF CV Control', GABRIEL: 'Gabriel India' }[s] || s);

// 5) Multiples (nearest half-turn): base = own median x sector de-rating; bull = no de-rating; bear = 25th pct de-rated
const MULT = { base: half(FM.median * k), bull: half(FM.median), bear: half(fmP25 * k) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
// EV/EBITDA cross-check: own trailing EV/EBITDA median since the reorganisation x de-rating, restated to Sep-28E EBITDA
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= REORG && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda);
const evMULT = { base: half(evMed * k * ttmEbitda / ebitdaSep28), bull: half(evMed * ttmEbitda / ebitdaSep28), bear: half(evP25 * k * ttmEbitda / ebitdaSep28) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp)), sellAbove = Math.round(sellAt(V.tp));
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, epsCagrHist = (Math.pow(A.eps[b] / A.eps[b - 3], 1 / 3) - 1) * 100;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-08-06' && s.tp);
const medTp = medOf(postQ1.map(s => s.tp)), withEps = ST.filter(s => s.eps);
const avgEps = y => withEps.reduce((s, x) => s + x.eps[y], 0) / withEps.length;

function syncMultiples() {
  const FILE = path.join(RD, 'assumptions.json'), as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(x => a?.[x] === c[x]);
  if (same(pe.multiple, MULT) && same(ev.multiple, evMULT)) { console.log(`MOTHERSON multiples unchanged: P/E ${JSON.stringify(MULT)}, EV/EBITDA ${JSON.stringify(evMULT)}`); return false; }
  pe.multiple = MULT; ev.multiple = evMULT; fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  console.log(`MOTHERSON multiples UPDATED: P/E ${JSON.stringify(MULT)}, EV/EBITDA ${JSON.stringify(evMULT)}. Re-run node src/model.js MOTHERSON, then node tools/authoring/MOTHERSON.js.`);
  return true;
}

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, REORG, n0, n1, n2, pc, pc1, half, shortDate, SA, SQ, QL, yr, A26, A25, Q1, b, price, mcap, sep, medOf, pct,
  SEGK, segName, econ, segRev, segE, segM, NEXANS27, YUTAKA27, NEXANS_FULL, YUTAKA_FULL, organic27,
  FM, FMall, fmP25, fmP75, adjMed, adjSeries, epsAdj, epsRep, fwdPe, buckets, PEER_SYMS, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, k, shortName,
  MULT, epsSep, evMed, evP25, evMULT, ttmEbitda, ebitdaSep28, BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, epsCagrHist, ST, postQ1, medTp, withEps, avgEps, syncMultiples };

if (require.main === module) {
  console.log({ FM: [FM.median, FM.medianAll, FM.troughYears, fmP25, fmP75], FMall: FMall.median, adjMed, buckets, sectorDr, sectorDrAll, k, MULT, evMed, evP25, evMULT, ttmEbitda, ebitdaSep28, epsSep, organic27, medTp, tp: V.tp, upside: V.upside, rating });
  console.log(PEERS.map(p => `${p.symbol} pe ${p.pe} med5 ${MED5[p.symbol]} dr ${derate[p.symbol]?.toFixed(1)}`).join('\n'));
}
