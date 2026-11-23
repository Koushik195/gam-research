// Apollo Tyres initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks the
// segment build (APMEA + Europe + Others less the other income inside segment results = model EBITDA), and derives the P/E
// and EV/EBITDA multiples (house rule, PLAYBOOK §4 and §7c) once. Apollo's reported EPS carries large exceptional items
// (Enschede closure FY25-26, Europe FY21) and a FY26 deferred-tax write-back, so the base forward P/E median uses EPS before
// one-offs (MOSL's adjusted EPS; batch practice A18) and the reported-EPS median (forwardMedian) is a sensitivity row.
// As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'APOLLOTYRE', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'APOLLOTYRE.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'APOLLOTYRE', 'screener.json'), 'utf8'));
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
const SA = SG.annual, SQ = SG.quarterly, sa = fy => SA.find(r => r.fy === fy);
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const Q1 = C.q1fy27, FY26 = C.fy26, OI26 = C.otherIncomeFY26, BS = C.balanceMar26;

// 1) Segment build: Σ segment EBITDA − other income inside segment results = model EBITDA; unallocated must equal other income
const SEGK = ['apmea', 'eur', 'oth'];
const segBuild = F.years.map((y, i) => { const rev = SEGK.reduce((s, k) => s + F.seg[k].revenue[i], 0), e = SEGK.reduce((s, k) => s + F.seg[k].adjEbitda[i], 0);
  return { y, rev, e, ebitda: F.ebitda[i], oi: F.otherIncome[i], unalloc: AS.unallocated[i], margin: F.ebitdaMargin[i] }; });
segBuild.forEach(r => { if (Math.abs(r.rev / F.sales[F.years.indexOf(r.y)] - 1) > 0.002) throw new Error(`APOLLOTYRE segment revenue check failed ${r.y}`);
  if (Math.abs(r.unalloc - r.oi) > 0.5) throw new Error(`APOLLOTYRE: unallocated (${r.unalloc}) must equal other income (${n1(r.oi)}) in ${r.y}`); });
const segMargin = (k, fy) => { const r = sa(fy); return r[`${k}Ebitda`] / r[`${k}Rev`] * 100; };
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0); // Screener basis (exceptionals netted)
const ttmExc = SQ.slice(-4).reduce((s, q) => s + q.exceptional, 0);
const netDebt26 = BS.borrowings - BS.cash - BS.investments, netDebtLeases26 = netDebt26 + BS.leases;

// 2) Forward P/E history. (a) Base: EPS before one-offs (MOSL adjusted EPS FY21-26; our forecasts after), same window, sampling
// and trough test as forwardMedian. (b) Sensitivity: the house function on reported EPS.
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsRep = {}; { const pl = S.tables['profit-loss']; pl.periods.forEach((p, i) => { if (/^Mar/.test(p)) epsRep[+p.slice(-4)] = pl.rows['EPS in Rs'][i]; }); }
const epsAdj = { ...epsRep }; Object.entries(C.adjEps).forEach(([k, v]) => { if (/^FY\d\d$/.test(k)) epsAdj[2000 + +k.slice(2)] = v; });
F.years.forEach((y, i) => { epsAdj[2000 + +y.slice(2, 4)] = F.eps[i]; epsRep[2000 + +y.slice(2, 4)] = F.eps[i]; });
const troughAdj = fy => { const prev = [epsAdj[fy - 1], epsAdj[fy - 2], epsAdj[fy - 3]].filter(v => v != null); const pk = Math.max(...prev); return !(epsAdj[fy] > 0) || epsAdj[fy] < 0.5 * pk; };
const fwdAll = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= '2021-04-01');
const HS = fwdAll.map(([d, p]) => [d, Math.round(p / epsAdj[fyOf(d)] * 10) / 10]).filter(([d, x]) => x > 0 && !troughAdj(fyOf(d)));
const hv = HS.map(x => x[1]), HA = { med: pct(hv, 0.5), p25: pct(hv, 0.25), p75: pct(hv, 0.75), min: Math.min(...hv), max: Math.max(...hv) };
const troughYearsAdj = [...new Set(fwdAll.filter(([d]) => troughAdj(fyOf(d))).map(([d]) => `FY${String(fyOf(d)).slice(2)}`))];
const byFy = {}; HS.forEach(([d, v]) => (byFy[fyOf(d)] ||= []).push(v));
const FM = forwardMedian('APOLLOTYRE', M); // reported EPS (sensitivity)
const fwdRep = forwardSeries('APOLLOTYRE', M, 'eps').filter(x => x[0] >= '2016-04-01');
const exFy25 = pct(HS.filter(([d]) => fyOf(d) !== 2025).map(x => x[1]), 0.5); // without the FY25 forward year (EPS dip)
const two = pct(HS.filter(([d]) => d >= '2024-10-01').map(x => x[1]), 0.5);
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps);

// 3) Sector de-rating: tyre peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set;
const PEERS = peersAsOf(['APOLLOTYRE', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(['APOLLOTYRE', ...PEER_SYMS].map(s => [s, med5(s)]));
const derate = Object.fromEntries(['APOLLOTYRE', ...PEER_SYMS].map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.map(s => derate[s]));
const sectorDrExCeat = medOf(USED.filter(s => s !== 'CEATLTD').map(s => derate[s]));
const k = 1 + sectorDr / 100;
const shortName = s => ({ APOLLOTYRE: 'Apollo Tyres', MRF: 'MRF', CEATLTD: 'CEAT', BALKRISIND: 'Balkrishna (BKT)', JKTYRE: 'JK Tyre', TVSSRICHAK: 'TVS Srichakra' }[s] || s);

// 4) Multiples (derived, nearest half-turn): P/E primary on EPS before one-offs; EV/EBITDA cross-check on the own trailing median
const MULT = { base: half(HA.med * k), bull: half(HA.med), bear: half(HA.p25 * k) };
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda);
const evConv = ttmEbitda / ebitdaSep28; // trailing (year to Jun-26) to Sep-28E
const evMULT = { base: half(evMed * k * evConv), bull: half(evMed * evConv), bear: half(evP25 * k * evConv) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const adjOf = fy => C.adjEps[fy] ?? A.eps[A.labels.indexOf(fy)];
const epsCagrFwd = (Math.pow(F.eps[2] / C.adjEps.FY26, 1 / 3) - 1) * 100, epsCagr5 = (Math.pow(C.adjEps.FY26 / C.adjEps.FY21, 1 / 5) - 1) * 100;

// Street as it stood on 30-Sep-2026 (post-Q1 notes with a target, 7 to 23-Aug-2026)
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-08-07' && s.tp && !s.pre);
const medTp = medOf(postQ1.map(s => s.tp));
const mosl = ST.find(s => s.broker === 'Motilal Oswal'), emkay = ST.find(s => s.broker === 'Emkay'), idir = ST.find(s => s.broker === 'ICICI Direct');
const px = S.charts.price.Price.filter(([d]) => d <= ASOF), pxYr = px.filter(([d]) => d >= '2025-09-30').map(x => x[1]);
const hi52 = Math.max(...pxYr), lo52 = Math.min(...pxYr);

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, shortDate, pct, medOf, SA, SQ, sa, b, price, shares, mcap, sep, Q1, FY26, OI26, BS,
  SEGK, segBuild, segMargin, ttmOI, ttmExc, netDebt26, netDebtLeases26, fyOf, epsAdj, epsRep, HS, HA, troughYearsAdj, byFy, FM, fwdRep, exFy25, two, fwdNow, sepNow,
  PEER_SYMS, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, sectorDrExCeat, k, shortName,
  MULT, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, epsSep, BM, mv, rating, buyBelow, sellAbove, adjOf, epsCagrFwd, epsCagr5, ST, postQ1, medTp, mosl, emkay, idir, hi52, lo52 };

if (require.main === module) {
  console.log('segments', segBuild.map(r => [r.y, Math.round(r.rev), Math.round(r.e), Math.round(r.ebitda), r.margin.toFixed(2)]), 'hist margins FY26', SEGK.map(s => segMargin(s, 'FY26').toFixed(1)));
  console.log('ttmOI', ttmOI, 'ttmExc', n1(ttmExc), 'netDebt26', n0(netDebt26), 'incl leases', n0(netDebtLeases26));
  console.log('adj house', HA, 'trough', troughYearsAdj, 'reported', FM.median, FM.medianAll, FM.troughYears, 'exFY25', exFy25, 'two', two);
  console.log('byFy', Object.entries(byFy).map(([f, v]) => `${f}:${medOf(v).toFixed(1)}(${v.length})`).join(' '));
  console.log('derate', Object.entries(derate).map(([s, v]) => `${s} ${P[s].pe}/${MED5[s]} ${v.toFixed(1)}`).join(', '), 'sector', sectorDr.toFixed(2), 'all', sectorDrAll.toFixed(2), 'exCeat', sectorDrExCeat.toFixed(2));
  console.log('MULT', MULT, 'ev', evMed, evP25, evConv.toFixed(3), evMULT, 'epsSep', epsSep, 'tp', V.tp, 'upside', V.upside.toFixed(1), rating, 'medTp', medTp, 'fwdNow', n1(fwdNow), n1(sepNow), 'hi/lo', hi52, lo52);
  console.log('methods', BM.map(m => [m.key, Math.round(m.value)]), 'buyBelow', buyBelow, 'sellAbove', sellAbove, 'eps', F.eps.map(n1), 'pat', F.pat.map(Math.round));
}
