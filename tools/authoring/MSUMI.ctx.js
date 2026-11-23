// Motherson Sumi Wiring India (MSWIL) initiation: shared context for the Part B files. Loads the research JSONs and the
// built model, checks the business-line build (existing plants + greenfields = model revenue) and the other-income build,
// and derives the P/E and EV/EBITDA multiples (house rule, PLAYBOOK §4 and §7c) once. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'MSUMI', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'MSUMI.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'MSUMI', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2022-03-28';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const Q1 = C.q1fy27, RP = C.relatedParty;

// 1) Business-line build (single segment): existing plants + greenfields must equal model revenue; other income = treasury + recurring
const LB = AS.lineBuild, GF = LB.greenfield, EX = F.sales.map((s, i) => s - GF[i]);
F.years.forEach((y, i) => {
  if (!(EX[i] > 0) || Math.abs(EX[i] + GF[i] - F.sales[i]) > 0.5) throw new Error(`MSUMI line build ${y}`);
  const built = AS.treasuryYield[i] / 100 * Math.max(i ? F.treasury[i - 1] : (A.cash[b] || 0) + (A.investments[b] || 0) - (A.borrowings[b] || 0), 0) + AS.otherIncome[i];
  if (Math.abs(built - F.otherIncome[i]) > 0.5) throw new Error(`MSUMI other-income build ${y}: ${built} vs ${F.otherIncome[i]}`);
});
if (Math.abs(LB.fy26.existing + LB.fy26.greenfield - A.sales[b]) > 2) throw new Error('MSUMI FY26 line build vs model revenue');
const exGrowth = EX.map((x, i) => (x / (i ? EX[i - 1] : LB.fy26.existing) - 1) * 100);
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);
const A26 = SA.find(a => a.fy === 'FY26'), A25 = SA.find(a => a.fy === 'FY25');
const feesFy26 = RP.royaltyToSwsFy26 + RP.mgmtFeeToSamilFy26 + RP.samilFunctionalSupportFy26 + RP.swsDesignFy26; // Rs cr paid to the JV partners
const feesPct = feesFy26 / C.fy26.revenue * 100, feesOfEbitda = feesFy26 / C.fy26.ebitda * 100;
const rpPurchPct = RP.purchasesFromJvPartnersFy26 / RP.rawMaterialPurchasesFy26 * 100;
const cust1 = C.profile.customers.customer1Fy26 / C.profile.customers.revenueFy26 * 100, cust2 = C.profile.customers.customer2Fy26 / C.profile.customers.revenueFy26 * 100;

// 2) Forward P/E history from listing (house forwardMedian; PLAYBOOK §4, §7c). Listing-premium check: the first months after
//    listing traded at 32-34x forward, BELOW the later median, so no months are skipped. Same median on all weekly closes as a check.
const FM = forwardMedian('MSUMI', M, { from: LISTED });
const fmP25 = pct(FM.series.map(x => x[1]), 0.25), fmP75 = pct(FM.series.map(x => x[1]), 0.75);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsBy = {}; S.tables['profit-loss'].periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) epsBy[+p.slice(-4)] = S.tables['profit-loss'].rows['EPS in Rs'][i]; });
F.years.forEach((y, i) => { epsBy[2000 + +y.slice(2, 4)] = F.eps[i]; });
const pxAll = S.charts.price.Price.filter(([d]) => d >= LISTED && d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const allWk = pxAll.map(([d, p]) => [d, Math.round(p / epsBy[fyOf(d)] * 10) / 10]).filter(x => x[1] > 0);
const allMed = pct(allWk.map(x => x[1]), 0.5), allP25 = pct(allWk.map(x => x[1]), 0.25), firstQ = allWk.filter(x => x[0] < '2022-07-01').map(x => x[1]);
const byBucket = {}; FM.series.forEach(([d, x]) => (byBucket[fyOf(d)] ||= []).push(x));
const buckets = Object.entries(byBucket).map(([fy, v]) => ({ fy: `FY${String(fy).slice(2)}`, n: v.length, med: pct(v, 0.5), lo: Math.min(...v), hi: Math.max(...v) }));
const twoYr = medOf(allWk.filter(x => x[0] >= '2024-10-01').map(x => x[1]));
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps);
const fwdPe = forwardSeries('MSUMI', M, 'eps');

// 3) Sector de-rating: auto-component peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c), MSWIL excluded
const PEER_SYMS = D.peers.set;
const PEERS = peersAsOf(['MSUMI', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const medFrom = (sym, from) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= from && x > 0).map(x => x[1]), 0.5); };
const ALL = ['MSUMI', ...PEER_SYMS];
const MED5 = Object.fromEntries(ALL.map(s => [s, medFrom(s, '2021-09-30')]));
const MEDL = Object.fromEntries(ALL.map(s => [s, medFrom(s, '2022-04-01')])); // same window as MSWIL's own history (sensitivity)
const derate = Object.fromEntries(ALL.map(s => [s, P[s]?.pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const derateL = Object.fromEntries(ALL.map(s => [s, P[s]?.pe && MEDL[s] ? (P[s].pe / MEDL[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.filter(s => derate[s] != null).map(s => derate[s]));
const sectorDrL = medOf(USED.map(s => derateL[s]));
const k = 1 + sectorDr / 100;
const shortName = s => ({ MSUMI: 'Motherson Sumi Wiring', MOTHERSON: 'Samvardhana Motherson', BOSCHLTD: 'Bosch', UNOMINDA: 'Uno Minda', SONACOMS: 'Sona BLW', BHARATFORG: 'Bharat Forge', ENDURANCE: 'Endurance', SCHAEFFLER: 'Schaeffler India', TIINDIA: 'Tube Investments', ZFCVINDIA: 'ZF CV Control', GABRIEL: 'Gabriel India' }[s] || s);

// 4) Multiples (nearest half-turn): base = own median x sector de-rating; bull = no de-rating; bear = 25th percentile de-rated
const MULT = { base: half(FM.median * k), bull: half(FM.median), bear: half(fmP25 * k) };
// Sep-28E EPS from the engine's own (unrounded) metric: the model JSON stores EPS rounded to 2 decimals (scenarios to 1)
const peM = blend => blend.methods.find(m => m.key === 'pe').metric;
const epsSep = { base: peM(V.blend), bull: peM(SC.bull.blend), bear: peM(SC.bear.blend) };
// EV/EBITDA cross-check: own trailing EV/EBITDA median since listing x de-rating, restated to Sep-28E EBITDA
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= LISTED && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda), evConv = ttmEbitda / ebitdaSep28;
const evMULT = { base: half(evMed * k * evConv), bull: half(evMed * evConv), bear: half(evP25 * k * evConv) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) * 10) / 10, sellAbove = Math.round(sellAt(V.tp) * 10) / 10;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, epsCagrHist = (Math.pow(A.eps[b] / A.eps[0], 1 / 4) - 1) * 100;
const salesCagrHist = (Math.pow(A.sales[b] / A.sales[0], 1 / 4) - 1) * 100;

// Street as it stood on 30-Sep-2026 (post-Q1 notes = on or after the 4-Aug-2026 results)
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-08-04' && s.tp);
const medTp = medOf(postQ1.map(s => s.tp)), medTpAll = medOf(ST.filter(s => s.tp).map(s => s.tp)), withEps = postQ1.filter(s => s.eps && s.eps.FY28E);
const medEps = y => medOf(withEps.filter(s => s.eps[y]).map(s => s.eps[y]));

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, LISTED, n0, n1, n2, pc, pc1, half, pct, medOf, SA, SQ, QL, b, price, shares, mcap, sep, Q1, RP,
  LB, GF, EX, exGrowth, ttmOI, A26, A25, feesFy26, feesPct, feesOfEbitda, rpPurchPct, cust1, cust2,
  FM, fmP25, fmP75, fyOf, allWk, allMed, allP25, firstQ, buckets, twoYr, fwdNow, sepNow, fwdPe,
  PEER_SYMS, PEERS, P, MED5, derate, derateL, EXCL, USED, sectorDr, sectorDrAll, sectorDrL, k, shortName,
  MULT, epsSep, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, epsCagrHist, salesCagrHist, ST, postQ1, medTp, medTpAll, withEps, medEps };

if (require.main === module) {
  console.log('line', F.years.map((y, i) => `${y}: ex ${n0(EX[i])} (${n1(exGrowth[i])}%) gf ${GF[i]}`).join(' | '), 'ttmOI', ttmOI, 'fees', n1(feesFy26), n2(feesPct), n1(feesOfEbitda), 'rp', n1(rpPurchPct), 'cust', n1(cust1), n1(cust2));
  console.log('FM', FM.median, FM.medianAll, FM.troughYears, FM.series.length, 'p25', fmP25, 'p75', fmP75, 'all', allMed, allP25, allWk.length, 'firstQ', firstQ.join(','), 'two', twoYr, 'now', n1(fwdNow), n1(sepNow), buckets.map(x => `${x.fy}:${x.med}`).join(' '));
  console.log('derate', Object.entries(derate).map(([s, v]) => `${s} ${v == null ? 'na' : v.toFixed(1)}`).join(', '), 'sector', sectorDr.toFixed(2), 'all', sectorDrAll.toFixed(2), 'sameWindow', sectorDrL.toFixed(2));
  console.log('MULT', MULT, 'ev', evMed, evP25, evConv.toFixed(3), evMULT, 'epsSep', epsSep, 'tp', V.tp, 'upside', V.upside.toFixed(1), rating, 'medTp', medTp, medTpAll, 'medEps', medEps('FY27E'), medEps('FY28E'), 'buy<', buyBelow, 'sell>', sellAbove);
}
