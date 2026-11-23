// ZF Commercial Vehicle Control Systems India initiation: shared context for the Part B files. Loads the research JSONs and
// the built model, checks the business-line build and the other-income build, and derives the P/E and EV/EBITDA multiples
// (house rule, PLAYBOOK §4 and §7c) once. As of 30-Sep-2026 (Q1FY27 basis). Per-share figures are after the 5:1 bonus.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ZFCVINDIA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ZFCVINDIA.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'ZFCVINDIA', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?(?=[0-9~])/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const yr = fy => SA.find(a => a.fy === fy);
const A26 = yr('FY26'), Q1 = C.q1fy27, T = C.treasuryMar26, OI26 = C.otherIncomeFY26, RP = C.relatedParty;
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E

// 1) Business-line build vs model revenue
const BL = AS.build, bld = [];
{ let o = BL.base.oem, am = BL.base.am, ex = BL.base.exports, sv = BL.base.services, ot = BL.base.other;
  F.years.forEach((y, i) => { o *= 1 + BL.oemGrowth[i] / 100; am *= 1 + BL.amGrowth[i] / 100; ex *= 1 + BL.exportsGrowth[i] / 100; sv *= 1 + BL.servicesGrowth[i] / 100; ot *= 1 + BL.otherGrowth[i] / 100;
    const rev = o + am + ex + sv + ot; bld.push({ y, o, am, ex, sv, ot, rev, model: F.sales[i], gap: (F.sales[i] / rev - 1) * 100 }); }); }
const baseRev = BL.base.oem + BL.base.am + BL.base.exports + BL.base.services + BL.base.other;
if (Math.abs(baseRev / A.sales[b] - 1) > 0.002) throw new Error(`ZFCVINDIA build base ${baseRev} vs ${A.sales[b]}`);
bld.forEach(r => { if (Math.abs(r.gap) > 0.3) throw new Error(`ZFCVINDIA build check failed ${r.y}: revenue ${n0(r.model)} vs ${n0(r.rev)}`); });
const domShare = i => (bld[i].o + bld[i].am) / bld[i].rev * 100;

// 2) Other income: yield on opening net treasury + small non-treasury income; reconcile to FY26 and the TTM
const tre0 = (A.cash[b] || 0) + (A.investments[b] || 0) - (A.borrowings[b] || 0);
if (Math.abs(tre0 - T.net) > 3) throw new Error(`ZFCVINDIA treasury ${tre0} vs AR ${T.net}`);
const tr = []; { let open = tre0; F.years.forEach((y, i) => { const oi = F.otherIncome[i], built = AS.treasuryYield[i] / 100 * open + AS.otherIncome[i];
  if (Math.abs(built - oi) > 0.5) throw new Error(`ZFCVINDIA other-income build ${y}: ${built} vs ${oi}`);
  tr.push({ y, open, close: F.treasury[i], oi, treasuryInc: oi - AS.otherIncome[i] }); open = F.treasury[i]; }); }
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);
const yld26 = OI26.treasuryIncome / ((T.net + T.mar25.net) / 2) * 100;

// 3) Forward P/E history (house forwardMedian from Apr-2021) and the same series on EPS before Screener's exceptional items
const FM = forwardMedian('ZFCVINDIA', M);
const fmP25 = pct(FM.series.map(x => x[1]), 0.25), fmP75 = pct(FM.series.map(x => x[1]), 0.75);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const PL = S.tables['profit-loss'], PEX = S.schedules['profit-loss']['Net Profit']['Profit excl Excep'];
const epsRep = {}, epsAdj = {};
PL.periods.forEach((p, i) => { if (!/^Mar \d{4}$/.test(p)) return; const y = +p.slice(-4), e = PL.rows['EPS in Rs'][i], np = PL.rows['Net Profit'][i]; epsRep[y] = e; epsAdj[y] = PEX[p] != null && np ? e * PEX[p] / np : e; });
F.years.forEach((y, i) => { epsRep[2000 + +y.slice(2, 4)] = F.eps[i]; epsAdj[2000 + +y.slice(2, 4)] = F.eps[i]; });
const adjSeries = FM.series.map(([d, pe]) => { const f = fyOf(d); return [d, Math.round(pe * epsRep[f] / epsAdj[f] * 10) / 10]; });
const adjMed = pct(adjSeries.map(x => x[1]), 0.5);
const fwdPe = forwardSeries('ZFCVINDIA', M, 'eps').filter(x => x[0] >= '2017-04-01');
const byBucket = {}; FM.series.forEach(([d, x]) => (byBucket[fyOf(d)] ||= []).push(x));
const buckets = Object.entries(byBucket).map(([fy, v]) => ({ fy: `FY${String(fy).slice(2)}`, n: v.length, med: pct(v, 0.5), lo: Math.min(...v), hi: Math.max(...v) }));
const twoYr = medOf(FM.series.filter(x => x[0] >= '2024-10-01').map(x => x[1]));
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps);

// 4) Sector de-rating: auto-component peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set;
const PEERS = peersAsOf(['ZFCVINDIA', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(['ZFCVINDIA', ...PEER_SYMS].map(s => [s, med5(s)]));
const derate = Object.fromEntries(['ZFCVINDIA', ...PEER_SYMS].map(s => [s, P[s]?.pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.filter(s => derate[s] != null).map(s => derate[s]));
const k = 1 + sectorDr / 100;
const shortName = s => ({ ZFCVINDIA: 'ZF CV India', ENDURANCE: 'Endurance', UNOMINDA: 'Uno Minda', MOTHERSON: 'Samvardhana Motherson', BOSCHLTD: 'Bosch', SONACOMS: 'Sona BLW', BHARATFORG: 'Bharat Forge', MSUMI: 'Motherson Sumi Wiring', SCHAEFFLER: 'Schaeffler India', TIINDIA: 'Tube Investments', GABRIEL: 'Gabriel India' }[s] || s);

// 5) Multiples (nearest half-turn): base = own median x sector de-rating; bull = no de-rating; bear = 25th pct de-rated
const MULT = { base: half(FM.median * k), bull: half(FM.median), bear: half(fmP25 * k) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
// EV/EBITDA cross-check: own trailing EV/EBITDA median since Apr-2021 (Screener series starts May-2022) x de-rating, restated to Sep-28E EBITDA
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda), evConv = ttmEbitda / ebitdaSep28;
const evMULT = { base: half(evMed * k * evConv), bull: half(evMed * evConv), bear: half(evP25 * k * evConv) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, epsCagrHist = (Math.pow(A.eps[b] / A.eps[b - 5], 1 / 5) - 1) * 100;
const salesCagrHist = (Math.pow(A.sales[b] / A.sales[b - 5], 1 / 5) - 1) * 100;

// Street as it stood on 30-Sep-2026: latest note per broker ('standing'); post-Q1 = on or after the 24-Jul-2026 results
const ST = D.street.brokers, standing = ST.filter(s => s.standing && s.tp), postQ1 = ST.filter(s => s.date >= '2026-07-24' && s.tp);
const medTp = medOf(standing.map(s => s.tp));
const arn = ST.find(s => s.broker === 'Anand Rathi');

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, shortDate, pct, medOf, SA, SQ, QL, yr, A26, Q1, T, OI26, RP, b, price, shares, mcap, sep,
  BL, bld, domShare, tre0, tr, ttmOI, yld26,
  FM, fmP25, fmP75, fyOf, epsRep, epsAdj, adjSeries, adjMed, fwdPe, buckets, twoYr, fwdNow, sepNow,
  PEER_SYMS, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, k, shortName,
  MULT, epsSep, evHist, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, epsCagrHist, salesCagrHist, ST, standing, postQ1, medTp, arn };

if (require.main === module) {
  console.log('build', bld.map(r => [r.y, Math.round(r.rev), r.gap.toFixed(2)]), 'tre0', n0(tre0), 'oi', tr.map(r => [r.y, Math.round(r.oi), Math.round(r.open)]), 'ttmOI', ttmOI, 'yld26', yld26.toFixed(2));
  console.log('FM', FM.median, FM.medianAll, FM.troughYears, 'p25', fmP25, 'p75', fmP75, 'adj', adjMed, 'two', twoYr, 'now', n1(fwdNow), n1(sepNow), buckets.map(x => `${x.fy}:${x.med}`).join(' '));
  console.log('derate', Object.entries(derate).map(([s, v]) => `${s} ${v == null ? 'na' : v.toFixed(1)}`).join(', '), 'sector', sectorDr.toFixed(2), 'all', sectorDrAll.toFixed(2));
  console.log('MULT', MULT, 'ev', evMed, evP25, evConv.toFixed(3), evMULT, 'epsSep', epsSep, 'tp', V.tp, 'upside', V.upside.toFixed(1), rating, 'medTp', medTp, 'eps', F.eps.map(n1));
}
