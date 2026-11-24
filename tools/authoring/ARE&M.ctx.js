// Amara Raja Energy & Mobility initiation: shared context for the Part B files (as of 30-Sep-2026, Q1FY27 basis). Loads
// the research JSONs and the built (standalone) model, checks the business-line build and the cash / other-income /
// finance-cost build, derives the core P/E (own forward P/E on EPS before exceptional items, net of the subsidiaries the
// price also carries, x auto-component sector de-rating) and values the SOTP parts (core, ARACT, other subsidiaries) once.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const SYM = 'ARE&M';
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', SYM, 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json'), SCON = rd('screener-consolidated.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', `${SYM}.json`), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', SYM, 'screener.json'), 'utf8'));
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
const Q1 = C.q1fy27, BL = AS.build, TAX = AS.taxRate[0] / 100;
const CORE = AS.segments[0];

// 1) Business-line build vs model revenue (single segment; PLAYBOOK §7)
const LINES = ['automotive', 'industrial', 'others'];
const LN = { automotive: 'Automotive (OEM, aftermarket, home energy, auto exports)', industrial: 'Industrial (telecom, UPS, railways, power, solar)', others: 'Others (lubes, services, export incentives)' };
const bld = []; { const cur = { ...BL.base };
  F.years.forEach((y, i) => { LINES.forEach(k => (cur[k] *= 1 + BL.growth[k][i] / 100)); const rev = LINES.reduce((t, k) => t + cur[k], 0);
    bld.push({ y, ...Object.fromEntries(LINES.map(k => [k, cur[k]])), rev, model: F.sales[i], gap: (F.sales[i] / rev - 1) * 100 }); }); }
const base26 = LINES.reduce((t, k) => t + BL.base[k], 0);

// 2) Cash build: net liquid funds (cash less borrowings) after ARACT infusions; other income and finance cost from it
function cashBuild(Fx) { const out = []; let N = BL.netLiquidBase;
  Fx.years.forEach((y, i) => { const N1 = N + Fx.fcf[i] + Fx.otherIncome[i] * (1 - TAX) - Fx.dividends[i] - BL.aract.infusion[i];
    const pos = (Math.max(0, N) + Math.max(0, N1)) / 2, neg = (Math.max(0, -N) + Math.max(0, -N1)) / 2;
    const treasury = BL.treasuryRate / 100 * pos, debtCost = BL.borrowRate / 100 * neg;
    const oi = BL.fxGain[i] + BL.scrap[i] + BL.loanInterest[i] + BL.otherMisc[i] + treasury, fin = BL.fixedFinance[i] + debtCost;
    out.push({ y, open: N, close: N1, infusion: BL.aract.infusion[i], treasury, debtCost, fx: BL.fxGain[i], scrap: BL.scrap[i], loan: BL.loanInterest[i], misc: BL.otherMisc[i], oi, fin, modelOi: Fx.otherIncome[i], modelFin: Fx.interest[i] }); N = N1; });
  return out; }
const oiB = cashBuild(F);
const ttmOI = 88; // Screener standalone 'other income normal' TTM to Jun-2026 (before exceptional items)

// 3) EPS before exceptional items (FY23 fire charge, FY25-26 insurance income net of the FY26 labour-code charge), after tax
const PL = S.tables['profit-loss'], EXC = C.exceptional, EXTAX = 0.2517;
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsRep = {}, epsAdj = {};
PL.periods.forEach((p, i) => { if (!/^Mar \d{4}$/.test(p)) return; const y = +p.slice(-4), e = PL.rows['EPS in Rs'][i], pat = PL.rows['Net Profit'][i], ex = EXC[`FY${String(y).slice(2)}`] || 0;
  epsRep[y] = e; epsAdj[y] = ex ? e * (pat - ex * (1 - EXTAX)) / pat : e; });
F.years.forEach((y, i) => { epsRep[2000 + +y.slice(2, 4)] = F.eps[i]; epsAdj[2000 + +y.slice(2, 4)] = F.eps[i]; });
const FM = forwardMedian(SYM, M); // house series on reported EPS
const PXW = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0); // same sampling as forwardSeries
const adjSeries = PXW.filter(([d]) => d >= '2021-04-01').map(([d, px]) => [d, Math.round(px / epsAdj[fyOf(d)] * 10) / 10]);
const adjMed = pct(adjSeries.map(x => x[1]), 0.5), adjP25 = pct(adjSeries.map(x => x[1]), 0.25);

// 4) Core forward P/E since Apr-2021: price less the subsidiaries per share (ARACT and others at book), over EPS before one-offs
const ECD = { 'Mar-22': '2022-03-31', 'Mar-23': '2023-03-31', 'Mar-24': '2024-03-31', 'Mar-25': '2025-03-31', 'Mar-26': '2026-03-31', 'Aug-26': '2026-08-10' };
const steps = map => [['2022-03-31', 0], ...Object.entries(map).filter(([kk]) => ECD[kk]).map(([kk, v]) => [ECD[kk], v])];
const interp = EC => d => { if (d <= EC[0][0]) return 0; for (let i = 1; i < EC.length; i++) if (d <= EC[i][0]) { const [d0, v0] = EC[i - 1], [d1, v1] = EC[i], t = (new Date(d) - new Date(d0)) / (new Date(d1) - new Date(d0)); return v0 + (v1 - v0) * t; } return EC[EC.length - 1][1]; };
const subsBookAt = interp(steps(C.investments.book)), subsCostAt = interp(steps(C.investments.cost));
const sharesAt = d => (d < '2024-02-01' ? 17.0812500 : 18.3025364); // 1.22 cr shares allotted for the Mangal demerger in Feb-2024
const coreSeriesOn = at => PXW.filter(([d]) => d >= '2021-04-01').map(([d, px]) => { const inv = at(d) / sharesAt(d);
  return [d, Math.round((px - inv) / epsAdj[fyOf(d)] * 10) / 10, Math.round(inv * 10) / 10]; });
const coreSeries = coreSeriesOn(subsBookAt), coreMedCost = pct(coreSeriesOn(subsCostAt).map(x => x[1]), 0.5);
const coreMed = pct(coreSeries.map(x => x[1]), 0.5), coreP25 = pct(coreSeries.map(x => x[1]), 0.25), coreP75 = pct(coreSeries.map(x => x[1]), 0.75);
const byBucket = {}; coreSeries.forEach(([d, x]) => (byBucket[fyOf(d)] ||= []).push(x));
const buckets = Object.entries(byBucket).map(([fy, v]) => ({ fy: `FY${String(fy).slice(2)}`, n: v.length, med: pct(v, 0.5), lo: Math.min(...v), hi: Math.max(...v) }));
const invNow = C.investments.book['Aug-26'] / shares;
const coreNowFwd = (price - invNow) / F.eps[1], coreNowSep = (price - invNow) / sep(F.eps);

// 5) Sector de-rating: auto-component peers + Exide, trailing P/E at the 30-Sep close vs five-year median (§7c)
const PEER_SYMS = D.peers.set;
const PEERS = peersAsOf([SYM, ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries([SYM, ...PEER_SYMS].map(s => [s, med5(s)]));
const derate = Object.fromEntries([SYM, ...PEER_SYMS].map(s => [s, P[s]?.pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.filter(s => derate[s] != null).map(s => derate[s]));
const sectorDrExExide = medOf(USED.filter(s => s !== 'EXIDEIND').map(s => derate[s]));
const k = 1 + sectorDr / 100;
const shortName = s => ({ EXIDEIND: 'Exide', 'ARE&M': 'Amara Raja', MOTHERSON: 'Samvardhana Motherson', BOSCHLTD: 'Bosch', UNOMINDA: 'Uno Minda', SONACOMS: 'Sona BLW', BHARATFORG: 'Bharat Forge', ENDURANCE: 'Endurance Tech', MSUMI: 'Motherson Sumi Wiring', SCHAEFFLER: 'Schaeffler India', TIINDIA: 'Tube Investments', ZFCVINDIA: 'ZF CV Control', GABRIEL: 'Gabriel India' }[s] || s);

// 6) Multiples (nearest half-turn): base = median x de-rating; bull = no de-rating; bear = 25th percentile de-rated
const MULT = { base: half(coreMed * k), bull: half(coreMed), bear: half(coreP25 * k) };       // core P/E (SOTP part)
const peMULT = { base: half(adjMed * k), bull: half(adjMed), bear: half(adjP25 * k) };        // whole standalone EPS (cross-check)
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const CASES = ['base', 'bull', 'bear'];

// 7) SOTP parts: core on Sep-28E EPS; ARACT at book at Sep-27E less PV of losses still to come; other subsidiaries at book
const coreVal = Object.fromEntries(CASES.map(c => [c, epsSep[c] * MULT[c] * shares]));
const AR = BL.aract, R = 1 + AR.pvRate / 100, BOOKX = { base: 1, bull: 1, bear: 0.5 };
const aract = Object.fromEntries(CASES.map(c => { const l = AR.loss[c];
  const book = AR.bookMar26 + AR.infusion[0] + 0.5 * AR.infusion[1] - l[0] - 0.5 * l[1];        // book equity at Sep-27E
  const pv = 0.5 * l[1] / Math.pow(R, 1 / 3) + l[2] / R + l[3] / Math.pow(R, 2);              // losses still to come, to breakeven
  return [c, { book, pv, mult: BOOKX[c], value: book * BOOKX[c] - pv, losses: l }]; }));
const otherVal = BL.otherSubsBook;
const parts = Object.fromEntries(CASES.map(c => [c, { core: coreVal[c], aract: aract[c].value, other: otherVal }]));

// Sensitivity: subsidiaries at COST (not book) in the core-P/E history; the rest of the SOTP unchanged
const atCost = (() => { const mult = half(coreMedCost * k), core = epsSep.base * mult * shares;
  const tp = Math.round((core + aract.base.value + otherVal) / shares / 10) * 10, up = (tp / price - 1) * 100;
  return { med: coreMedCost, mult, tp, upside: up, rating: ratingFor(up) }; })();
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrFwd = (Math.pow(F.eps[2] / epsAdj[2026], 1 / 3) - 1) * 100, salesCagrHist = (Math.pow(A.sales[b] / A.sales[b - 5], 1 / 5) - 1) * 100;
const epsCagrHist = (Math.pow(epsAdj[2026] / epsAdj[2021], 1 / 5) - 1) * 100;

// Street as it stood on 30-Sep-2026 (post-Q1 notes)
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-08-01' && s.tp);
const medTp = medOf(postQ1.map(s => s.tp)), withEps = ST.filter(s => s.eps && s.eps.FY28E);
const medEps = y => medOf(withEps.filter(s => s.eps[y]).map(s => s.eps[y]));

module.exports = { SYM, ROOT, RD, C, D, SG, SCON, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, half, shortDate, pct, medOf, SA, SQ, QL, b, price, shares, mcap, sep, Q1, BL, TAX, CORE,
  LINES, LN, bld, base26, cashBuild, oiB, ttmOI, EXC, fyOf, epsRep, epsAdj, FM, adjSeries, adjMed, adjP25,
  subsBookAt, sharesAt, coreSeries, coreMed, coreP25, coreP75, buckets, invNow, coreNowFwd, coreNowSep,
  PEER_SYMS, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, sectorDrExExide, k, shortName,
  atCost, MULT, peMULT, epsSep, CASES, coreVal, aract, otherVal, parts, BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, epsCagrHist, salesCagrHist, ST, postQ1, medTp, withEps, medEps };

if (require.main === module) {
  console.log('build', bld.map(r => [r.y, Math.round(r.rev), r.gap.toFixed(2)]), 'cash', oiB.map(r => [r.y, Math.round(r.open), Math.round(r.close), n1(r.oi), r.modelOi, n1(r.fin), r.modelFin]));
  console.log('epsAdj', Object.entries(epsAdj).map(([y, v]) => `${y}:${v.toFixed(1)}`).join(' '));
  console.log('FM house', FM.median, FM.medianAll, FM.troughYears, '| adj', adjMed, adjP25, '| core', coreMed, coreP25, coreP75, buckets.map(x => `${x.fy}:${x.med}`).join(' '), '| now core fwd', n1(coreNowFwd), 'sep', n1(coreNowSep), 'inv/sh', n1(invNow), 'costMed', coreMedCost);
  console.log('derate', Object.entries(derate).map(([s, v]) => `${s} ${v == null ? 'na' : v.toFixed(1)}`).join(', '), '| sector', sectorDr.toFixed(2), 'all', sectorDrAll.toFixed(2), 'exExide', sectorDrExExide.toFixed(2));
  console.log('MULT', MULT, 'peMULT', peMULT, 'epsSep', epsSep, 'parts', JSON.stringify(Object.fromEntries(CASES.map(c => [c, Object.fromEntries(Object.entries(parts[c]).map(([x, v]) => [x, Math.round(v)]))]))));
  console.log('aract', JSON.stringify(aract), 'tp', V.tp, 'upside', V.upside.toFixed(1), rating, 'medTp', medTp, 'medEps', medEps('FY27E'), medEps('FY28E'), 'atCost', JSON.stringify(atCost));
}
