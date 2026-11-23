// Balkrishna Industries (BKT) initiation: shared context for the Part B files. Loads the research JSONs and the built model,
// checks the business-line build (OHT tyres + third-party carbon black + on-highway) against model revenue, builds the
// other-income check, and derives the P/E and EV/EBITDA multiples (house rule, PLAYBOOK §4 and §7c) once.
// As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'BALKRISIND', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'BALKRISIND.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'BALKRISIND', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly;
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const Q1 = C.q1fy27, T = C.treasuryMar26, OI26 = C.otherIncomeFY26, FY26 = C.fy26;

// 1) Business-line build vs model revenue
const BL = AS.build, bld = [];
{ let oht = BL.base.oht, cb = BL.base.carbonBlack, vol = FY26.standalone.volumeMt;
  F.years.forEach((y, i) => { oht *= 1 + BL.ohtGrowth[i] / 100; cb *= 1 + BL.carbonBlackGrowth[i] / 100; vol *= 1 + BL.ohtVolumeGrowth[i] / 100;
    const oh = BL.onHighway[i], rev = oht + cb + oh;
    bld.push({ y, oht, cb, oh, rev, vol, realGrowth: ((1 + BL.ohtGrowth[i] / 100) / (1 + BL.ohtVolumeGrowth[i] / 100) - 1) * 100, model: F.sales[i], gap: (F.sales[i] / rev - 1) * 100 }); }); }
bld.forEach(r => { if (Math.abs(r.gap) > 0.2) throw new Error(`BALKRISIND build check failed ${r.y}: model ${n0(r.model)} vs build ${n0(r.rev)}`); });

// 2) Treasury book and the other-income build (AR FY26 note 30)
const STRAT = T.nseStake + T.otherStrategicEquity; // dividends only
const book26 = T.nonCurrentInvestments + T.currentInvestments + T.cash + T.otherBank - STRAT; // interest-bearing / MTM part, Mar-26
const book25 = 1561.57 + 1702.78 + 80.24 + 6.01 - (523.46 + 20.97); // Mar-25, same notes
const treasInc26 = OI26.interest + OI26.incomeNonCurrentInvestments + OI26.gainSaleNonCurrent + OI26.gainSaleCurrent + OI26.mtmGain;
const yield26 = treasInc26 / ((book25 + book26) / 2) * 100;
const OIB = { yieldPct: 7, books: [2300, 2300, 2600], dividends: 18, misc: 16 };
const oiBuild = F.years.map((y, i) => ({ y, treas: OIB.books[i] * OIB.yieldPct / 100, total: F.otherIncome[i] }));
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);
const netDebt26 = A.borrowings[b] - (A.cash[b] || 0) - A.investments[b];

// 3) Forward P/E history (house rule: reported EPS, trough years left out; none for BKT since Apr-2021)
const FM = forwardMedian('BALKRISIND', M);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const fpe = FM.series.map(x => x[1]);
const fP25 = pct(fpe, 0.25), fP75 = pct(fpe, 0.75), fMin = Math.min(...fpe), fMax = Math.max(...fpe);
const byFy = {}; FM.series.forEach(([d, v]) => (byFy[fyOf(d)] ||= []).push(v));
const fwdPe = forwardSeries('BALKRISIND', M, 'eps').filter(x => x[0] >= '2016-04-01');
const exFy26 = medOf(FM.series.filter(([d]) => fyOf(d) !== 2026).map(x => x[1])); // sensitivity: without the FX-hit FY26 forward year
const two = medOf(FM.series.filter(([d]) => d >= '2024-10-01').map(x => x[1]));
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps);

// 4) Sector de-rating: tyre peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set;
const PEERS = peersAsOf(['BALKRISIND', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(['BALKRISIND', ...PEER_SYMS].map(s => [s, med5(s)]));
const derate = Object.fromEntries(['BALKRISIND', ...PEER_SYMS].map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.map(s => derate[s]));
const sectorDrExCeat = medOf(USED.filter(s => s !== 'CEATLTD').map(s => derate[s]));
const k = 1 + sectorDr / 100;
const shortName = s => ({ BALKRISIND: 'Balkrishna (BKT)', MRF: 'MRF', APOLLOTYRE: 'Apollo Tyres', CEATLTD: 'CEAT', JKTYRE: 'JK Tyre', TVSSRICHAK: 'TVS Srichakra' }[s] || s);

// 5) Multiples (derived, nearest half-turn): P/E primary; EV/EBITDA cross-check on the own trailing median
const MULT = { base: half(FM.median * k), bull: half(FM.median), bear: half(fP25 * k) };
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda);
const evConv = ttmEbitda / ebitdaSep28; // trailing (year to Jun-26) to Sep-28E
const evMULT = { base: half(evMed * k * evConv), bull: half(evMed * evConv), bear: half(evP25 * k * evConv) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsHist = y => A.eps[A.labels.indexOf(y)];
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, epsCagr5 = (Math.pow(A.eps[b] / epsHist('FY21'), 1 / 5) - 1) * 100;
const epsCagrFrom25 = (Math.pow(F.eps[2] / epsHist('FY25'), 1 / 4) - 1) * 100;

// Street as it stood on 30-Sep-2026 (post-Q1 notes with a target, 30-Jul to 2-Aug-2026)
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-07-30' && s.tp && !s.pre);
const medTp = medOf(postQ1.map(s => s.tp));
const mosl = ST.find(s => s.broker === 'Motilal Oswal'), idir = ST.find(s => s.broker === 'ICICI Direct'), arathi = ST.find(s => s.broker === 'Anand Rathi');
const px = S.charts.price.Price.filter(([d]) => d <= ASOF), pxYr = px.filter(([d]) => d >= '2025-09-30').map(x => x[1]);
const hi52 = Math.max(...pxYr), lo52 = Math.min(...pxYr);

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, shortDate, pct, medOf, SA, SQ, b, price, shares, mcap, sep, Q1, T, OI26, FY26,
  bld, BL, STRAT, book25, book26, treasInc26, yield26, OIB, oiBuild, ttmOI, netDebt26, FM, fyOf, fP25, fP75, fMin, fMax, byFy, fwdPe, exFy26, two, fwdNow, sepNow,
  PEER_SYMS, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, sectorDrExCeat, k, shortName,
  MULT, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, epsSep, BM, mv, rating, buyBelow, sellAbove, epsHist, epsCagrFwd, epsCagr5, epsCagrFrom25, ST, postQ1, medTp, mosl, idir, arathi, hi52, lo52 };

if (require.main === module) {
  console.log('build', bld.map(r => [r.y, Math.round(r.rev), Math.round(r.vol), r.realGrowth.toFixed(1), r.gap.toFixed(2)]));
  console.log('treasury book', n0(book25), n0(book26), 'income', n1(treasInc26), 'yield', n1(yield26), 'oi', oiBuild.map(r => [r.y, Math.round(r.treas), r.total]), 'ttmOI', ttmOI, 'netDebt26', n0(netDebt26));
  console.log('house', FM.median, FM.medianAll, FM.troughYears, 'p25/p75', fP25, fP75, 'min/max', fMin, fMax, 'exFY26', exFy26, 'two', two);
  console.log('byFy', Object.entries(byFy).map(([f, v]) => `${f}:${medOf(v).toFixed(1)}(${v.length})`).join(' '));
  console.log('derate', Object.entries(derate).map(([s, v]) => `${s} ${P[s].pe}/${MED5[s]} ${v.toFixed(1)}`).join(', '), 'sector', sectorDr.toFixed(2), 'all', sectorDrAll.toFixed(2), 'exCeat', sectorDrExCeat.toFixed(2));
  console.log('MULT', MULT, 'ev', evMed, evP25, evConv.toFixed(3), evMULT, 'epsSep', epsSep, 'tp', V.tp, 'upside', V.upside.toFixed(1), rating, 'medTp', medTp, 'fwdNow', n1(fwdNow), n1(sepNow), 'hi/lo', hi52, lo52);
  console.log('methods', BM.map(m => [m.key, Math.round(m.value)]), 'buyBelow', buyBelow, 'sellAbove', sellAbove);
}
