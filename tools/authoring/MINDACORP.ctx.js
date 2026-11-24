// Minda Corporation initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks
// the vertical build and the other-income build (associates and minorities grossed up for tax), and derives the P/E and
// EV/EBITDA multiples (house rule, PLAYBOOK §4 and §7c) once. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'MINDACORP', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'MINDACORP.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'MINDACORP', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const Q1 = C.q1fy27;
const SH_OUT = C.shares.outstanding / 1e7, SH_DIL = C.shares.fullyDiluted / 1e7;

// 1) Vertical build vs model revenue
const BL = AS.build;
const bld = []; { let mech = BL.base.mechatronics, ics = BL.base.ics;
  F.years.forEach((y, i) => { mech *= 1 + BL.growth.mechatronics[i] / 100; ics *= 1 + BL.growth.ics[i] / 100; const vast = BL.vast[i], rev = mech + ics + vast;
    bld.push({ y, mech, ics, vast, rev, model: F.sales[i], gap: (F.sales[i] / rev - 1) * 100 }); }); }
bld.forEach(r => { if (Math.abs(r.gap) > 0.3) throw new Error(`MINDACORP build check failed ${r.y}: revenue ${n0(r.model)} vs build ${n0(r.rev)}`); });
const base26 = BL.base.mechatronics + BL.base.ics;
if (base26 !== A.sales[b]) throw new Error(`MINDACORP base check: verticals ${base26} vs reported ${A.sales[b]}`);
const organic27 = (bld[0].mech + bld[0].ics) / base26 * 100 - 100;

// 2) Other income build: recurring + (associates − minorities) / (1 − tax), so engine PAT = owners' PAT
const TAX = AS.taxRate[0] / 100;
const oiB = F.years.map((y, i) => ({ y, rec: BL.recurringOI[i], as: BL.associates[i], mi: BL.minorities[i], gross: BL.recurringOI[i] + (BL.associates[i] - BL.minorities[i]) / (1 - TAX), model: F.otherIncome[i] }));
oiB.forEach(r => { if (Math.abs(r.gross - r.model) > 1) throw new Error(`MINDACORP other-income check ${r.y}: ${r.gross} vs ${r.model}`); });
const assocShareOfPat = F.years.map((_, i) => BL.associates[i] / F.pat[i] * 100);
const epsBasic = F.eps.map(e => e * SH_DIL / SH_OUT); // same profit on the 23.91 cr shares the street uses

// 3) Forward P/E history (house forwardMedian from Apr-2021) and the same median on EPS before one-offs.
// FY22-FY23 one-offs (exceptional gain, KTSN tax benefit) from the company's normalised PAT; FY24-26 from Screener's
// exceptional items after tax. Forecast years carry none.
const FM = forwardMedian('MINDACORP', M);
const PL = S.tables['profit-loss'], PFE = S.schedules['profit-loss']['Net Profit']['Profit for EPS'], EXAT = S.schedules['profit-loss']['Net Profit']['Exceptional items AT'];
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsAdj = {}, epsRep = {};
PL.periods.forEach((p, i) => { if (!/^Mar \d{4}$/.test(p)) return; const y = +p.slice(-4), e = PL.rows['EPS in Rs'][i]; epsRep[y] = e;
  const norm = C.oneOffs.normalisedPat[`FY${String(y).slice(2)}`], rep = C.oneOffs.reportedPat[`FY${String(y).slice(2)}`];
  epsAdj[y] = norm != null ? e * norm / rep : PFE[p] ? e * (PFE[p] - (EXAT[p] || 0)) / PFE[p] : e; });
F.years.forEach((y, i) => { epsRep[2000 + +y.slice(2, 4)] = F.eps[i]; epsAdj[2000 + +y.slice(2, 4)] = F.eps[i]; });
const adjSeries = FM.series.map(([d, pe]) => { const f = fyOf(d); return [d, Math.round(pe * epsRep[f] / epsAdj[f] * 10) / 10]; });
const adjMed = pct(adjSeries.map(x => x[1]), 0.5), adjP25 = pct(adjSeries.map(x => x[1]), 0.25), adjP75 = pct(adjSeries.map(x => x[1]), 0.75);
const fmP25 = pct(FM.series.map(x => x[1]), 0.25);
const byBucket = {}; adjSeries.forEach(([d, x]) => (byBucket[fyOf(d)] ||= []).push(x));
const buckets = Object.entries(byBucket).map(([fy, v]) => ({ fy: `FY${String(fy).slice(2)}`, n: v.length, med: pct(v, 0.5), lo: Math.min(...v), hi: Math.max(...v) }));
const twoYr = medOf(adjSeries.filter(x => x[0] >= '2024-10-01').map(x => x[1]));
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps);

// 4) Sector de-rating: auto-component peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set;
const PEERS = peersAsOf(['MINDACORP', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(['MINDACORP', ...PEER_SYMS].map(s => [s, med5(s)]));
const derate = Object.fromEntries(['MINDACORP', ...PEER_SYMS].map(s => [s, P[s]?.pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.filter(s => derate[s] != null).map(s => derate[s]));
const k = 1 + sectorDr / 100;
const shortName = s => ({ MINDACORP: 'Minda Corp', MOTHERSON: 'Samvardhana Motherson', BOSCHLTD: 'Bosch', UNOMINDA: 'Uno Minda', SONACOMS: 'Sona BLW', BHARATFORG: 'Bharat Forge', ENDURANCE: 'Endurance Tech', MSUMI: 'Motherson Sumi Wiring', SCHAEFFLER: 'Schaeffler India', TIINDIA: 'Tube Investments', ZFCVINDIA: 'ZF CV Control', GABRIEL: 'Gabriel India' }[s] || s);

// 5) Multiples (nearest half-turn): base = own median (EPS before one-offs) x sector de-rating; bull = no de-rating;
// bear = 25th percentile de-rated. Reported-EPS median shown as a sensitivity row.
const MULT = { base: half(adjMed * k), bull: half(adjMed), bear: half(adjP25 * k) };
const multRep = half(FM.median * k);
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
// EV/EBITDA cross-check: own trailing EV/EBITDA median since Apr-2021 x de-rating, restated to Sep-28E EBITDA
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda), evConv = ttmEbitda / ebitdaSep28;
const evMULT = { base: half(evMed * k * evConv), bull: half(evMed * evConv), bear: half(evP25 * k * evConv) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, salesCagrHist = (Math.pow(A.sales[b] / A.sales[b - 5], 1 / 5) - 1) * 100;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-08-13' && s.tp);
const medTp = medOf(postQ1.map(s => s.tp)), medTpAll = medOf(ST.map(s => s.tp)), withEps = ST.filter(s => s.eps && s.eps.FY28E);
const medEps = y => medOf(withEps.filter(s => s.eps[y]).map(s => s.eps[y]));
// Flash look-through (for the text): street-style value of the 49% stake
const flashPat28 = BL.associates[1];

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, half, pct, medOf, SA, SQ, QL, b, price, shares, mcap, sep, Q1, SH_OUT, SH_DIL,
  BL, bld, base26, organic27, TAX, oiB, assocShareOfPat, epsBasic,
  FM, fmP25, fyOf, epsRep, epsAdj, adjSeries, adjMed, adjP25, adjP75, buckets, twoYr, fwdNow, sepNow,
  PEER_SYMS, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, k, shortName,
  MULT, multRep, epsSep, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, salesCagrHist, ST, postQ1, medTp, medTpAll, withEps, medEps, flashPat28 };

if (require.main === module) {
  console.log('build', bld.map(r => [r.y, Math.round(r.rev), r.gap.toFixed(2)]), 'organic27', organic27.toFixed(1), 'oi', oiB.map(r => [r.y, n1(r.gross), n1(r.model)]));
  console.log('FM', FM.median, FM.medianAll, FM.troughYears, 'p25', fmP25, 'adj', adjMed, adjP25, adjP75, 'two', twoYr, 'now', n1(fwdNow), n1(sepNow), buckets.map(x => `${x.fy}:${x.med}(${x.n})`).join(' '));
  console.log('derate', Object.entries(derate).map(([s, v]) => `${s} ${v == null ? 'na' : v.toFixed(1)} (pe ${P[s]?.pe} med ${MED5[s]})`).join(', '), 'sector', sectorDr.toFixed(2), 'all', sectorDrAll.toFixed(2));
  console.log('MULT', MULT, 'rep', multRep, 'ev', evMed, evP25, evConv.toFixed(3), evMULT, 'epsSep', epsSep, 'tp', V.tp, 'upside', V.upside.toFixed(1), rating, 'medTp', medTp, medTpAll, 'medEps', medEps('FY27E'), medEps('FY28E'), 'eps', F.eps.map(n1), 'basic', epsBasic.map(n1));
}
