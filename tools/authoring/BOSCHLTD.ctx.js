// Bosch Ltd initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks the
// business-line build (Bosch + RBIC) against model revenue and EBITDA, checks the treasury yield, and derives the P/E
// and EV/EBITDA multiples (house rule, PLAYBOOK §4 and §7c) once. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { PF } = require('./BOSCHLTD.patch');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'BOSCHLTD', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'BOSCHLTD.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'BOSCHLTD', 'screener.json'), 'utf8'));
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
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const yr = fy => SA.find(a => a.fy === fy);
const A26 = yr('FY26'), Q1 = C.q1fy27, R = C.rbic, T = C.treasuryMar26;
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E

// 1) Business-line build vs model revenue and EBITDA
const BL = AS.build, bld = [];
{ let au = BL.base.auto, cg = BL.base.cg, ot = BL.base.others, rb = BL.base.rbic;
  F.years.forEach((y, i) => { au *= 1 + BL.autoGrowth[i] / 100; cg *= 1 + BL.cgGrowth[i] / 100; ot *= 1 + BL.othersGrowth[i] / 100; rb *= 1 + BL.rbicGrowth[i] / 100;
    const bosch = au + cg + ot, rev = bosch + rb, boschE = bosch * BL.boschMargin[i] / 100, rbicE = rb * BL.rbicMargin[i] / 100;
    bld.push({ y, au, cg, ot, bosch, rb, rev, boschE, rbicE, ebitda: boschE + rbicE, model: F.sales[i], modelE: F.ebitda[i], gap: (F.sales[i] / rev - 1) * 100, gapE: (F.ebitda[i] / (boschE + rbicE) - 1) * 100 }); }); }
bld.forEach(r => { if (Math.abs(r.gap) > 0.3 || Math.abs(r.gapE) > 0.3) throw new Error(`BOSCHLTD build check failed ${r.y}: revenue ${n0(r.model)} vs ${n0(r.rev)}, EBITDA ${n0(r.modelE)} vs ${n0(r.ebitda)}`); });

// 2) Treasury: pro forma Mar-26 and the yield on the interest-bearing part
const STRAT = T.strategicEquity + T.equityMethod; // HDFC Bank, ICICI Bank, start-ups, associates: dividends only
const DIV_INC = 20; // dividends on the strategic stakes (Rs19.1 cr in FY26)
const tre0 = (A.cash[b] || 0) + A.investments[b] + AS.otherTreasury.base - A.borrowings[b]; // pro forma (patched)
const inv26 = S.tables['balance-sheet'].rows.Investments[S.tables['balance-sheet'].periods.indexOf('Mar 2026')]; // unpatched
const cut = Math.min(PF.netOut, inv26), treBefore = tre0 + cut;
const tr = []; { let open = tre0; F.years.forEach((y, i) => { const oi = F.otherIncome[i], nonT = AS.otherIncome[i] || 0;
  tr.push({ y, open, close: F.treasury[i], oi, nonT, yieldIB: (oi - nonT - DIV_INC) / (open - STRAT) * 100 }); open = F.treasury[i]; }); }
tr.forEach(r => { if (r.yieldIB < 6.0 || r.yieldIB > 6.6) throw new Error(`BOSCHLTD treasury check ${r.y}: yield on interest-bearing treasury ${r.yieldIB.toFixed(2)}%`); });
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);

// 3) RBIC's contribution and the ex-RBIC (pre-deal) FY27E EPS used for dates before the 8-Apr-2026 announcement
const RB_OI = R.impliedCash * 0.0625, TAX = AS.taxRate[0] / 100;
const rbicPat = bld.map((r, i) => (r.rbicE - BL.rbicDep[i] + RB_OI) * (1 - TAX));
const preDealOI = C.fy26.otherIncome - C.otherIncomeFY26.otherInterestIncludesGstAmnestyReversal - C.otherIncomeFY26.taxRefundInterest - C.otherIncomeFY26.writeBacks; // FY26 recurring
const exRbicEps27 = (bld[0].boschE - (F.dep[0] - BL.rbicDep[0]) + preDealOI - F.interest[0]) * (1 - TAX) / shares;
const accretion27 = (F.eps[0] / exRbicEps27 - 1) * 100;

// 4) Forward P/E history: house (reported EPS) and clean (EPS before exceptional items; ex-RBIC FY27E before the deal)
const FM = forwardMedian('BOSCHLTD', M);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pl = S.tables['profit-loss'], exc = S.schedules['profit-loss']['Net Profit']['Profit excl Excep'];
const epsRep = {}, epsClean = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4), e = pl.rows['EPS in Rs'][i], np = pl.rows['Net Profit'][i]; epsRep[y] = e; epsClean[y] = exc[p] / (np / e); } });
F.years.forEach((y, i) => { epsRep[2000 + +y.slice(2, 4)] = F.eps[i]; epsClean[2000 + +y.slice(2, 4)] = F.eps[i]; });
const DEAL = '2026-04-08';
const cleanEpsOn = d => { const f = fyOf(d); return f === 2027 && d < DEAL ? exRbicEps27 : epsClean[f]; };
const troughC = f => { const prev = [epsClean[f - 1], epsClean[f - 2], epsClean[f - 3]].filter(v => v != null); const pk = prev.length ? Math.max(...prev) : null; return !(epsClean[f] > 0) || (pk > 0 && epsClean[f] < 0.5 * pk); };
const pxW = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= '2021-04-01');
const cleanSeries = pxW.filter(([d]) => !troughC(fyOf(d))).map(([d, p]) => [d, Math.round(p / cleanEpsOn(d) * 10) / 10]);
const cleanMed = pct(cleanSeries.map(x => x[1]), 0.5), cleanP25 = pct(cleanSeries.map(x => x[1]), 0.25), cleanP75 = pct(cleanSeries.map(x => x[1]), 0.75);
const houseP25 = pct(FM.series.map(x => x[1]), 0.25);
const fwdPe = forwardSeries('BOSCHLTD', M, 'eps').filter(x => x[0] >= '2016-04-01');
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps);
const two = medOf(cleanSeries.filter(x => x[0] >= '2024-10-01').map(x => x[1]));
const byFy = {}; cleanSeries.forEach(([d, v]) => (byFy[fyOf(d)] ||= []).push(v));
const houseByFy = {}; FM.series.forEach(([d, v]) => (houseByFy[fyOf(d)] ||= []).push(v));

// 5) Sector de-rating: auto-component peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set;
const PEERS = peersAsOf(['BOSCHLTD', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(['BOSCHLTD', ...PEER_SYMS].map(s => [s, med5(s)]));
const derate = Object.fromEntries(['BOSCHLTD', ...PEER_SYMS].map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.map(s => derate[s]));
const k = 1 + sectorDr / 100;
const shortName = s => ({ BOSCHLTD: 'Bosch', MOTHERSON: 'Samvardhana Motherson', BHARATFORG: 'Bharat Forge', UNOMINDA: 'Uno Minda', SCHAEFFLER: 'Schaeffler India', SONACOMS: 'Sona BLW', TIINDIA: 'Tube Investments', ENDURANCE: 'Endurance Tech', ZFCVINDIA: 'ZF Commercial Vehicle', MSUMI: 'Motherson Sumi Wiring' }[s] || s);

// 6) Multiples (derived, nearest half-turn): P/E on the clean median; EV/EBITDA cross-check on the own trailing median
const MULT = { base: half(cleanMed * k), bull: half(cleanMed), bear: half(cleanP25 * k) };
const houseMult = half(FM.median * k);
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), rbicTtmEbitda = BL.base.rbic * BL.rbicMargin[0] / 100, ebitdaSep28 = sep(F.ebitda);
const evConv = (ttmEbitda + rbicTtmEbitda) / ebitdaSep28; // trailing (pro forma for RBIC) to Sep-28E
const evMULT = { base: half(evMed * k * evConv), bull: half(evMed * evConv), bear: half(evP25 * k * evConv) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrHistClean = (Math.pow(epsClean[2026] / epsClean[2021], 1 / 5) - 1) * 100, epsCagrFwd = (Math.pow(F.eps[2] / epsClean[2026], 1 / 3) - 1) * 100;

// Street as it stood on 30-Sep-2026 (post-Q1 notes)
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-08-10' && s.tp);
const medTp = medOf(postQ1.map(s => s.tp));
const mosl = ST.find(s => s.broker === 'Motilal Oswal');

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, shortDate, pct, medOf, SA, SQ, QL, yr, A26, Q1, R, T, b, price, shares, mcap, sep, PF, cut,
  bld, STRAT, tre0, treBefore, tr, ttmOI, rbicPat, preDealOI, exRbicEps27, accretion27,
  FM, fyOf, epsRep, epsClean, cleanSeries, cleanMed, cleanP25, cleanP75, houseP25, fwdPe, fwdNow, sepNow, two, byFy, houseByFy,
  PEER_SYMS, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, k, shortName,
  MULT, houseMult, evMed, evP25, evMULT, evConv, ttmEbitda, rbicTtmEbitda, ebitdaSep28, epsSep, BM, mv, rating, buyBelow, sellAbove, epsCagrHistClean, epsCagrFwd, ST, postQ1, medTp, mosl };

if (require.main === module) {
  const X = module.exports;
  console.log('build', bld.map(r => [r.y, Math.round(r.rev), Math.round(r.ebitda), r.gap.toFixed(2)]));
  console.log('treasury', n0(treBefore), '->', n0(tre0), tr.map(r => [r.y, Math.round(r.oi), r.yieldIB.toFixed(2)]), 'ttmOI', ttmOI);
  console.log('rbicPat', rbicPat.map(Math.round), 'exRbicEps27', n1(exRbicEps27), 'accretion', n1(accretion27));
  console.log('house', FM.median, FM.medianAll, FM.troughYears, 'clean', cleanMed, cleanP25, cleanP75, 'two', two);
  console.log('byFy clean', Object.entries(byFy).map(([f, v]) => `${f}:${medOf(v).toFixed(1)}`).join(' '), '| house', Object.entries(houseByFy).map(([f, v]) => `${f}:${medOf(v).toFixed(1)}`).join(' '));
  console.log('derate', Object.entries(derate).map(([s, v]) => `${s} ${v.toFixed(1)}`).join(', '), 'sector', sectorDr.toFixed(2), 'all', sectorDrAll.toFixed(2));
  console.log('MULT', MULT, 'house', houseMult, 'ev', evMed, evP25, evConv.toFixed(3), evMULT, 'epsSep', epsSep, 'tp', V.tp, 'upside', V.upside.toFixed(1), rating, 'medTp', medTp);
}
