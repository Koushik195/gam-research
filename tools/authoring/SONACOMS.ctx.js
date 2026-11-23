// Sona Comstar initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks the
// business-line build (automotive + railway) against model revenue and EBITDA, reconciles other income, sizes the
// DENSO deal (not modelled), and derives the P/E and EV/EBITDA multiples (house rule, PLAYBOOK §4 and §7c) once.
// syncMultiples() writes the derived multiples into assumptions.json (EPS does not depend on them, so one pass
// converges; the next `node src/model.js SONACOMS` carries them into the report and Excel). As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'SONACOMS', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'SONACOMS.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'SONACOMS', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2021-06-24', SKIP_TO = '2022-06-24'; // first 12 months after listing left out (§7c)
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const yr = fy => SA.find(a => a.fy === fy);
const Q1 = C.q1fy27, b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E

// 1) Business-line build (automotive + railway) vs model revenue and EBITDA
const BL = AS.build, bld = [];
{ let au = BL.base.auto, ra = BL.base.rail;
  F.years.forEach((y, i) => { au *= 1 + BL.autoGrowth[i] / 100; ra *= 1 + BL.railGrowth[i] / 100;
    const ae = au * BL.autoMargin[i] / 100, re = ra * BL.railMargin[i] / 100;
    bld.push({ y, au, ra, rev: au + ra, ae, re, ebitda: ae + re, gap: (F.sales[i] / (au + ra) - 1) * 100, gapE: (F.ebitda[i] / (ae + re) - 1) * 100 }); }); }
bld.forEach(r => { if (Math.abs(r.gap) > 0.3 || Math.abs(r.gapE) > 0.3) throw new Error(`SONACOMS build check failed ${r.y}: ${n0(F.sales[F.years.indexOf(r.y)])} vs ${n0(r.rev)}`); });
const railShare = bld.map(r => r.ra / r.rev * 100);
const auto26M = (A.ebitda[b] - BL.base.rail * 0.2) / BL.base.auto * 100; // implied FY26 automotive margin at a 20% railway margin

// 2) Treasury and other income: FY27E vs the run-rate (Q1FY27 x4 and the four quarters to Jun-26)
const tre0 = (A.cash[b] || 0) + A.investments[b] + AS.otherTreasury.base - A.borrowings[b];
const QO = M.quarterly.otherIncome, qOI = QO.slice(-4), ttmOI = qOI.reduce((s, x) => s + x, 0);
const ttmOInormal = ttmOI + 40; // add back the Rs40 cr pre-tax labour-code charge booked in Dec-2025 (Rs30 cr after tax)
const oiCheck = { fy27: F.otherIncome[0], q1x4: QO.at(-1) * 4, ttm: ttmOI, ttmNormal: ttmOInormal, fy26: A.otherIncome[b] };
if (F.otherIncome[0] < 0.8 * oiCheck.ttmNormal || F.otherIncome[0] > 1.15 * oiCheck.q1x4) throw new Error(`SONACOMS other income FY27E ${n0(F.otherIncome[0])} off the run-rate`);

// 3) DENSO (not modelled; completion by 31-Mar-2027): cash in vs 49% minority in Sona eDrive
const DN = { cash: 857.5, ev: 1750, rev26: 385.5, nw26: 347.1, slump: 893.2 };
DN.oiPost = DN.cash * AS.treasuryYield[1] / 100 * (1 - AS.taxRate[1] / 100); // after-tax yield on the cash
DN.breakEvenPat = DN.oiPost / 0.49; // eDrive PAT at which DENSO's 49% equals the yield
DN.evSales = DN.ev / DN.rev26; DN.sonaEvSales = (mcap - tre0) / A.sales[b];
DN.rev28at40 = DN.rev26 * Math.pow(1.4, 2); DN.breakEvenMargin = DN.breakEvenPat / DN.rev28at40 * 100;

// 4) Forward P/E history (house forwardMedian), first 12 months after listing left out
const FM = forwardMedian('SONACOMS', M, { from: SKIP_TO });
const FMall = forwardMedian('SONACOMS', M, { from: LISTED }), FMapr = forwardMedian('SONACOMS', M, { from: '2022-04-01' });
const fmP25 = pct(FM.series.map(x => x[1]), 0.25), fmP75 = pct(FM.series.map(x => x[1]), 0.75);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsBy = {}; S.tables['profit-loss'].periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) epsBy[+p.slice(-4)] = S.tables['profit-loss'].rows['EPS in Rs'][i]; });
F.years.forEach((y, i) => { epsBy[2000 + +y.slice(2, 4)] = F.eps[i]; });
const pxAll = S.charts.price.Price.filter(([d]) => d >= LISTED && d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const fwdWeekly = pxAll.map(([d, p]) => [d, Math.round(p / epsBy[fyOf(d)] * 10) / 10]); // every weekly close (check on the house 5th-week series)
const weeklyMed = medOf(fwdWeekly.filter(x => x[0] >= SKIP_TO).map(x => x[1]));
const fwdPe = forwardSeries('SONACOMS', M, 'eps');
const byBucket = {}; fwdWeekly.forEach(([d, x]) => (byBucket[fyOf(d)] ||= []).push(x));
const buckets = Object.entries(byBucket).map(([fy, v]) => ({ fy: `FY${String(fy).slice(2)}`, period: `Apr-${String(fy - 2).slice(2)}–Mar-${String(fy - 1).slice(2)}`, n: v.length, med: medOf(v), lo: Math.min(...v), hi: Math.max(...v) }));
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps), fwd27 = price / F.eps[0];
const trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;

// 5) Sector de-rating: auto-component peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set;
const PEERS = peersAsOf(['SONACOMS', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(['SONACOMS', ...PEER_SYMS].map(s => [s, med5(s)]));
const derate = Object.fromEntries(['SONACOMS', ...PEER_SYMS].map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.map(s => derate[s])), sectorDrBf = medOf(PEER_SYMS.filter(s => s !== 'GABRIEL').map(s => derate[s]));
const k = 1 + sectorDr / 100;
const shortName = s => ({ SONACOMS: 'Sona Comstar', BOSCHLTD: 'Bosch', MOTHERSON: 'Samvardhana Motherson', BHARATFORG: 'Bharat Forge', UNOMINDA: 'Uno Minda', SCHAEFFLER: 'Schaeffler India', TIINDIA: 'Tube Investments', ENDURANCE: 'Endurance Tech', ZFCVINDIA: 'ZF CV Control', MSUMI: 'Motherson Sumi Wiring', GABRIEL: 'Gabriel India' }[s] || s);

// 6) Multiples (nearest half-turn): base = own median x sector de-rating; bull = no de-rating; bear = 25th pct de-rated
const MULT = { base: half(FM.median * k), bull: half(FM.median), bear: half(fmP25 * k) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= SKIP_TO && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda), evConv = ttmEbitda / ebitdaSep28;
const evMULT = { base: half(evMed * k * evConv), bull: half(evMed * evConv), bear: half(evP25 * k * evConv) };
const SENS = { listing: half(FMall.median * k), apr22: half(FMapr.median * k), weekly: half(weeklyMed * k), withBf: half(FM.median * (1 + sectorDrBf / 100)), jefAvg: half(44 * k), jef55: 55 };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, epsCagrHist = (Math.pow(A.eps[b] / A.eps[b - 4], 1 / 4) - 1) * 100;
const peg = MULT.base / epsCagrFwd;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-07-23' && s.tp);
const medTp = medOf(postQ1.map(s => s.tp));

function syncMultiples() {
  const FILE = path.join(RD, 'assumptions.json'), as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(x => a?.[x] === c[x]);
  if (same(pe.multiple, MULT) && same(ev.multiple, evMULT)) { console.log(`SONACOMS multiples unchanged: P/E ${JSON.stringify(MULT)}, EV/EBITDA ${JSON.stringify(evMULT)}`); return false; }
  pe.multiple = MULT; ev.multiple = evMULT; fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  console.log(`SONACOMS multiples UPDATED: P/E ${JSON.stringify(MULT)}, EV/EBITDA ${JSON.stringify(evMULT)}. Re-run node src/model.js SONACOMS, then node tools/authoring/SONACOMS.js.`);
  return true;
}

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, LISTED, SKIP_TO, n0, n1, n2, pc, pc1, half, shortDate, medOf, pct, SA, SQ, QL, yr, Q1, b, price, shares, mcap, sep,
  BL, bld, railShare, auto26M, tre0, ttmOI, ttmOInormal, oiCheck, DN, FM, FMall, FMapr, fmP25, fmP75, fyOf, epsBy, fwdWeekly, weeklyMed, fwdPe, buckets, fwdNow, sepNow, fwd27, trailEps, trailPe,
  PEER_SYMS, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, sectorDrBf, k, shortName, MULT, epsSep, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, SENS,
  BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, epsCagrHist, peg, ST, postQ1, medTp, syncMultiples };

if (require.main === module) {
  console.log('build', bld.map(r => [r.y, Math.round(r.au), Math.round(r.ra), r.gap.toFixed(2), r.gapE.toFixed(2)]), 'auto26M', n1(auto26M), 'tre0', n0(tre0), 'oi', oiCheck);
  console.log('DN', DN);
  console.log('FM', FM.median, FM.medianAll, FM.troughYears, FM.series.length, 'all', FMall.median, 'apr22', FMapr.median, 'weekly', weeklyMed, 'p25/75', fmP25, fmP75, buckets.map(x => `${x.fy}:${n1(x.med)}`).join(' '));
  console.log('derate', Object.entries(derate).map(([s, v]) => `${s} ${v?.toFixed(1)}`).join(', '), 'sector', sectorDr.toFixed(2), 'all', sectorDrAll.toFixed(2), 'withBF', sectorDrBf.toFixed(2));
  console.log('MULT', MULT, 'ev', evMed, evP25, evConv.toFixed(3), evMULT, 'SENS', SENS, 'epsSep', epsSep, 'tp', V.tp, 'upside', V.upside.toFixed(1), rating, 'medTp', medTp, 'peg', peg.toFixed(2), 'fwd', n1(fwd27), n1(fwdNow), n1(sepNow), 'trail', n1(trailPe));
}
