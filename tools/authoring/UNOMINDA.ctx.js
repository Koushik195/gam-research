// Uno Minda initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks the
// division build and the other-income build (JV share and minorities grossed up for tax), and derives the P/E and
// EV/EBITDA multiples (house rule, PLAYBOOK §4 and §7c) once. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'UNOMINDA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'UNOMINDA.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'UNOMINDA', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const Q1 = C.q1fy27;

// 1) Division build vs model revenue (FY26 base = divisional sum ex prior-period income; model base = reported)
const BL = AS.build, DIV = ['switches', 'lighting', 'castings', 'greenMobility', 'seating', 'others'];
const DIVN = { switches: 'Switches', lighting: 'Lighting', castings: 'Castings', greenMobility: 'Green Mobility', seating: 'Seating', others: 'Others' };
const bld = []; { const cur = { ...BL.base };
  F.years.forEach((y, i) => { DIV.forEach(k => (cur[k] *= 1 + BL.growth[k][i] / 100)); const rev = DIV.reduce((t, k) => t + cur[k], 0);
    bld.push({ y, ...Object.fromEntries(DIV.map(k => [k, cur[k]])), rev, model: F.sales[i], gap: (F.sales[i] / rev - 1) * 100 }); }); }
bld.forEach(r => { if (Math.abs(r.gap) > 0.3) throw new Error(`UNOMINDA build check failed ${r.y}: revenue ${n0(r.model)} vs build ${n0(r.rev)}`); });
const base26 = DIV.reduce((t, k) => t + BL.base[k], 0);
const divCagr = k => (Math.pow(bld[2][k] / BL.base[k], 1 / 3) - 1) * 100;

// 2) Other income build: recurring + (JV share − minorities) / (1 − tax), so engine PAT = owners' PAT
const TAX = AS.taxRate[0] / 100;
const oiB = F.years.map((y, i) => ({ y, rec: BL.recurringOI[i], jv: BL.jv[i], mi: BL.minorities[i], gross: BL.recurringOI[i] + (BL.jv[i] - BL.minorities[i]) / (1 - TAX), model: F.otherIncome[i] }));
oiB.forEach(r => { if (Math.abs(r.gross - r.model) > 1) throw new Error(`UNOMINDA other-income check ${r.y}: ${r.gross} vs ${r.model}`); });
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);
const jvShareOfPat = F.years.map((_, i) => BL.jv[i] / F.pat[i] * 100);

// 3) Forward P/E history (house forwardMedian from Apr-2021) and the same median on EPS before exceptional items
const FM = forwardMedian('UNOMINDA', M);
const fmP25 = pct(FM.series.map(x => x[1]), 0.25), fmP75 = pct(FM.series.map(x => x[1]), 0.75);
const PL = S.tables['profit-loss'], PFE = S.schedules['profit-loss']['Net Profit']['Profit for EPS'], EXAT = S.schedules['profit-loss']['Net Profit']['Exceptional items AT'];
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsAdj = {}, epsRep = {};
PL.periods.forEach((p, i) => { if (!/^Mar \d{4}$/.test(p)) return; const y = +p.slice(-4), e = PL.rows['EPS in Rs'][i]; epsRep[y] = e; epsAdj[y] = PFE[p] ? e * (PFE[p] - (EXAT[p] || 0)) / PFE[p] : e; });
F.years.forEach((y, i) => { epsRep[2000 + +y.slice(2, 4)] = F.eps[i]; epsAdj[2000 + +y.slice(2, 4)] = F.eps[i]; });
const adjSeries = FM.series.map(([d, pe]) => { const f = fyOf(d); return [d, Math.round(pe * epsRep[f] / epsAdj[f] * 10) / 10]; });
const adjMed = pct(adjSeries.map(x => x[1]), 0.5);
const fwdPe = forwardSeries('UNOMINDA', M, 'eps').filter(x => x[0] >= '2016-04-01');
const byBucket = {}; FM.series.forEach(([d, x]) => (byBucket[fyOf(d)] ||= []).push(x));
const buckets = Object.entries(byBucket).map(([fy, v]) => ({ fy: `FY${String(fy).slice(2)}`, n: v.length, med: pct(v, 0.5), lo: Math.min(...v), hi: Math.max(...v) }));
const twoYr = medOf(FM.series.filter(x => x[0] >= '2024-10-01').map(x => x[1]));
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps);

// 4) Sector de-rating: auto-component peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set;
const PEERS = peersAsOf(['UNOMINDA', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(['UNOMINDA', ...PEER_SYMS].map(s => [s, med5(s)]));
const derate = Object.fromEntries(['UNOMINDA', ...PEER_SYMS].map(s => [s, P[s]?.pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.filter(s => derate[s] != null).map(s => derate[s]));
const k = 1 + sectorDr / 100;
const shortName = s => ({ UNOMINDA: 'Uno Minda', MOTHERSON: 'Samvardhana Motherson', BOSCHLTD: 'Bosch', SONACOMS: 'Sona BLW', BHARATFORG: 'Bharat Forge', ENDURANCE: 'Endurance Tech', MSUMI: 'Motherson Sumi Wiring', SCHAEFFLER: 'Schaeffler India', TIINDIA: 'Tube Investments', ZFCVINDIA: 'ZF CV Control', GABRIEL: 'Gabriel India' }[s] || s);

// 5) Multiples (nearest half-turn): base = own median x sector de-rating; bull = no de-rating; bear = 25th pct de-rated
const MULT = { base: half(FM.median * k), bull: half(FM.median), bear: half(fmP25 * k) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
// EV/EBITDA cross-check: own trailing EV/EBITDA median since Apr-2021 x de-rating, restated to Sep-28E EBITDA
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda), evConv = ttmEbitda / ebitdaSep28;
const evMULT = { base: half(evMed * k * evConv), bull: half(evMed * evConv), bear: half(evP25 * k * evConv) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, epsCagrHist = (Math.pow(A.eps[b] / A.eps[b - 5], 1 / 5) - 1) * 100;
const salesCagrHist = (Math.pow(A.sales[b] / A.sales[b - 5], 1 / 5) - 1) * 100;

// Street as it stood on 30-Sep-2026 (post-Q1 notes)
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-08-04' && s.tp);
const medTp = medOf(postQ1.map(s => s.tp)), withEps = ST.filter(s => s.eps && s.eps.FY28E);
const medEps = y => medOf(withEps.filter(s => s.eps[y]).map(s => s.eps[y]));

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, half, shortDate, pct, medOf, SA, SQ, QL, b, price, shares, mcap, sep, Q1,
  BL, DIV, DIVN, bld, base26, divCagr, TAX, oiB, ttmOI, jvShareOfPat,
  FM, fmP25, fmP75, fyOf, epsRep, epsAdj, adjSeries, adjMed, fwdPe, buckets, twoYr, fwdNow, sepNow,
  PEER_SYMS, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, k, shortName,
  MULT, epsSep, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, epsCagrHist, salesCagrHist, ST, postQ1, medTp, withEps, medEps };

if (require.main === module) {
  console.log('build', bld.map(r => [r.y, Math.round(r.rev), r.gap.toFixed(2)]), 'base26', base26, 'oi', oiB.map(r => [r.y, n1(r.gross), n1(r.model)]), 'ttmOI', ttmOI);
  console.log('FM', FM.median, FM.medianAll, FM.troughYears, 'p25', fmP25, 'p75', fmP75, 'adj', adjMed, 'two', twoYr, 'now', n1(fwdNow), n1(sepNow), buckets.map(x => `${x.fy}:${x.med}`).join(' '));
  console.log('derate', Object.entries(derate).map(([s, v]) => `${s} ${v == null ? 'na' : v.toFixed(1)}`).join(', '), 'sector', sectorDr.toFixed(2), 'all', sectorDrAll.toFixed(2));
  console.log('MULT', MULT, 'ev', evMed, evP25, evConv.toFixed(3), evMULT, 'epsSep', epsSep, 'tp', V.tp, 'upside', V.upside.toFixed(1), rating, 'medTp', medTp, 'medEps', medEps('FY27E'), medEps('FY28E'));
}
