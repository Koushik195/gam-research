// Bajaj Auto initiation: shared context for the Part B files. Loads the research JSONs and the built model and
// computes, once: standalone EPS (the street's basis, post-buyback count), the standalone one-year-forward P/E
// history and its median (own files) next to the house forwardMedian (consolidated), the auto-sector de-rating,
// BACL at peers' P/B, the KTM stake at market less a holding discount, the SOTP (base/bull/bear) and the implied
// multiple of consolidated Sep-28E EPS that BAJAJ-AUTO.sotp.js writes into assumptions.json. As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'BAJAJ-AUTO', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'BAJAJ-AUTO.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const half = x => Math.round(x * 2) / 2;
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const SRC = 'Bajaj Auto annual report, calls and sales releases; Bajaj Mobility AG reports; BACL results; GAM Research';

// Segment history
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const yr = fy => SA.find(a => a.fy === fy);
const A26 = yr('FY26'), A25 = yr('FY25'), A24 = yr('FY24'), A22 = yr('FY22');
const Q1 = C.q1fy27, FY26 = C.fy26, KTM = C.ktm, BACL = C.bacl;
const price = M.price.last, b = A.labels.length - 1;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);

// ---- Standalone EPS (street basis): standalone EBITDA (model segment) - dep - interest + treasury income, taxed
const ST = AS.standalone, SH = ST.sharesCr;
const treas = i => F.otherIncome[i] - AS.otherIncome[i];
const saLine = (rev, mPct, i) => { const e = rev * mPct / 100; const pbt = e - ST.dep[i] - ST.interest[i] + treas(i); return { rev, ebitda: e, pbt, pat: pbt * (1 - ST.taxRate[i] / 100) }; };
const seg = k => AS.segments.find(s => s.key === k);
const pathOf = (k, dG = 0, dM = 0) => { const s = seg(k); let d = s.base; return [0, 1, 2].map(i => { d *= 1 + (s.growth[i] + dG) / 100; return { rev: d, m: s.marginPct[i] + dM }; }); };
const saCase = kase => { const sc = kase === 'base' ? {} : (AS.scenarios[kase].segments?.sa || {}); return pathOf('sa', sc.growthDelta || 0, sc.marginDelta || 0).map((p, i) => saLine(p.rev, p.m, i)); };
const SAF = { base: saCase('base'), bull: saCase('bull'), bear: saCase('bear') };
const saEps = k => SAF[k].map(x => x.pat / SH);
const saEpsSep28 = k => (saEps(k)[1] + saEps(k)[2]) / 2;
const SAEPS = saEps('base');

// ---- BACL: PAT and book; value at peers' median P/B on Sep-27E book
const baclCase = kase => { const sc = kase === 'base' ? {} : (AS.scenarios[kase].segments?.bacl || {}); const p = pathOf('bacl', sc.growthDelta || 0, sc.marginDelta || 0); let bv = AS.sotp.baclBookMar26; return p.map((x, i) => { const pat = (x.rev * x.m / 100 - ST.baclDep[i]) * (1 - ST.taxRate[i] / 100); bv += pat; return { rev: x.rev, pat, bookEnd: bv }; }); };
const BACLF = { base: baclCase('base'), bull: baclCase('bull'), bear: baclCase('bear') };
const baclBookSep27 = k => (BACLF[k][0].bookEnd + BACLF[k][1].bookEnd) / 2;
const pbOf = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const s = (X.charts?.pb?.['Price to book value'] || []).filter(([d, v]) => d <= ASOF && v > 0); return s.length ? s[s.length - 1][1] : null; };
const BPB = Object.fromEntries(AS.sotp.baclPeers.map(s => [s, pbOf(s)]));
const baclPbBase = Math.round(med(Object.values(BPB)) * 10) / 10;
const BACL_PB = { base: baclPbBase, bull: 3.5, bear: 2.0 };

// ---- KTM: 74.94% of Bajaj Mobility at market (30-Sep close) less a holding discount
const KS = AS.sotp.ktm;
const ktmMkt = KS.sharesM * KS.priceEur * KS.stakePct / 100 * KS.eurInr / 10; // Rs crore
const ktmVal = k => ktmMkt * (1 - KS.discountPct[k] / 100);

// ---- Own forward P/E: (1) house forwardMedian on consolidated EPS; (2) standalone EPS, weekly closes, same trough rule
const FM = forwardMedian('BAJAJ-AUTO', M);
const SS = JSON.parse(fs.readFileSync(path.join(RD, 'screener-standalone.json'), 'utf8'));
const saBy = {}; SS.tables['profit-loss'].periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) saBy[+p.slice(-4)] = SS.tables['profit-loss'].rows['EPS in Rs'][i]; });
F.years.forEach((y, i) => (saBy[2000 + +y.slice(2, 4)] = SAEPS[i]));
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const troughSa = fy => { const prev = [saBy[fy - 1], saBy[fy - 2], saBy[fy - 3]].filter(v => v != null); const pk = prev.length ? Math.max(...prev) : null; return !(saBy[fy] > 0) || (pk > 0 && saBy[fy] < 0.5 * pk); };
const PX = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'BAJAJ-AUTO', 'screener.json'), 'utf8')).charts.price.Price.filter(([d]) => d <= ASOF);
if (PX.at(-1)[0] < ASOF) PX.push([ASOF, price]);
const fwdSaAll = PX.filter(([d]) => d >= '2016-04-01' && saBy[fyOf(d)] > 0).map(([d, p]) => [d, Math.round(p / saBy[fyOf(d)] * 10) / 10]);
const fwdSa = fwdSaAll.filter(([d]) => d >= '2021-04-01');
const fwdSaKept = fwdSa.filter(([d]) => !troughSa(fyOf(d)));
const qt = (a, f) => { const s = a.map(x => x[1]).sort((x, y) => x - y); return s[Math.floor(s.length * f)]; };
const SAPE = { med: qt(fwdSaKept, 0.5), p25: qt(fwdSaKept, 0.25), p75: qt(fwdSaKept, 0.75), min: qt(fwdSaKept, 0), max: qt(fwdSaKept, 0.999), n: fwdSaKept.length, troughs: [...new Set(fwdSa.filter(([d]) => troughSa(fyOf(d))).map(([d]) => `FY${String(fyOf(d)).slice(2)}`))] };
const byFwdFy = {}; fwdSa.forEach(([d, v]) => (byFwdFy[fyOf(d)] ||= []).push(v));
const fwdFyMed = Object.fromEntries(Object.entries(byFwdFy).map(([fy, v]) => [fy, med(v)]));
const fwdNow = price / saEpsSep28('base');

// ---- Sector de-rating: auto OEM peers' trailing P/E at 30-Sep vs their five-year median, excl. Bajaj and distorted peers
const PEER_SYMS = D.peers.syms;
const PEERS = peersAsOf(PEER_SYMS, ASOF);
const P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]); return med(v); };
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excludedFromDerating);
const OTHERS = PEER_SYMS.filter(s => s !== 'BAJAJ-AUTO' && !EXCL.includes(s));
const sectorDr = med(OTHERS.map(s => derate[s]));
const drAll = med(PEER_SYMS.filter(s => s !== 'BAJAJ-AUTO').map(s => derate[s]));
const drTwoWheelers = med(['EICHERMOT', 'HEROMOTOCO', 'TVSMOTOR'].map(s => derate[s]));
const k = 1 + sectorDr / 100;
const CORE = { base: half(SAPE.med * k), bull: half(SAPE.p75 * k), bear: half(SAPE.p25 * k) };
const houseAfter = FM.median * k;

// ---- SOTP per post-buyback share, and the implied multiple of the model's consolidated Sep-28E EPS
const consMetric = kase => (kase === 'base' ? mv('pe').metric : SC[kase].blend.methods.find(m => m.key === 'pe').metric);
const sotp = kase => {
  const core = CORE[kase] * saEpsSep28(kase), bacl = BACL_PB[kase] * baclBookSep27(kase) / SH, ktm = ktmVal(kase) / SH;
  const ps = core + bacl + ktm;
  return { core, bacl, ktm, ps, eps: saEpsSep28(kase), coreMult: CORE[kase], pb: BACL_PB[kase], book: baclBookSep27(kase), ktmCr: ktmVal(kase), implied: ps / consMetric(kase), consEps: consMetric(kase) };
};
const SOTP = { base: sotp('base'), bull: sotp('bull'), bear: sotp('bear') };

// ---- EV/EBITDA cross-check: own trailing median since Apr-2021 x sector de-rating, restated to Sep-28E (standalone TTM vs Sep-28E)
const SCR = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'BAJAJ-AUTO', 'screener.json'), 'utf8'));
const evS = (SCR.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0);
const evMed = med(evS.map(x => x[1])), evP25 = qt(evS, 0.25), evP75 = qt(evS, 0.75);
const saTtmEbitda = SQ.slice(-4).reduce((s, q) => s + q.saEbitda, 0);
const saSep28Ebitda = (SAF.base[1].ebitda + SAF.base[2].ebitda) / 2;
const restate = saTtmEbitda / saSep28Ebitda;
const EVX = { base: half(evMed * k * restate), bull: half(evP75 * k * restate), bear: half(evP25 * k * restate) };

// ---- Volume x realisation build check against model revenue
const BL = AS.businessLines;
const build = (() => {
  let dpu = BL.fy26.domRevCr * 1e7 / (BL.fy26.dom2w + BL.fy26.dom3w), upu = BL.fy26.expUsdM * 1e6 / (BL.fy26.exp2w + BL.fy26.exp3w);
  return [0, 1, 2].map(i => {
    dpu *= 1 + BL.domRealGrowthPct[i] / 100; upu *= 1 + BL.expUsdRealGrowthPct[i] / 100;
    const u = Object.fromEntries(Object.entries(BL.units).map(([kk, v]) => [kk, v[i]]));
    const domU = u.dom2w + u.dom3w, expU = u.exp2w + u.exp3w;
    const domRev = domU * dpu / 1e7, expUsd = expU * upu / 1e6, expRev = expUsd * BL.rsPerExportUsd[i] / 10;
    const rev = domRev + expRev + BL.otherOpRevCr[i];
    return { ...u, units: domU + expU, domPU: dpu, expUsdPU: upu, domRev, expUsd, expRev, oth: BL.otherOpRevCr[i], rev, model: F.seg.sa.revenue[i], diff: rev - F.seg.sa.revenue[i] };
  });
})();
const buildOk = build.every(x => Math.abs(x.diff) < 5);
if (!buildOk) console.warn('BAJAJ-AUTO build check: business-line build differs from model revenue', build.map(x => Math.round(x.diff)));

// Rating from the house rule
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026
const STR = D.street.brokers, CONS = D.street.consensus;
const withEps = STR.filter(s => s.eps);
const tpAll = STR.map(s => s.tp).filter(Boolean);
const medTp = med(tpAll), avgTp = tpAll.reduce((s, x) => s + x, 0) / tpAll.length;
const epsAdj = s => (s.broker === 'Prabhudas Lilladher' ? 279.5 / 274.8 : 1); // PL uses the pre-buyback count
const streetEps = y => withEps.filter(s => s.eps[y]).map(s => s.eps[y] * epsAdj(s));
const avgEps = y => { const v = streetEps(y); return v.reduce((s, x) => s + x, 0) / v.length; };
const avgOf = (f, y) => { const v = withEps.filter(s => s[f]?.[y]).map(s => s[f][y]); return v.reduce((s, x) => s + x, 0) / v.length; };
const shortName = s => ({ MARUTI: 'Maruti Suzuki', 'M&M': 'Mahindra & Mahindra', 'BAJAJ-AUTO': 'Bajaj Auto', EICHERMOT: 'Eicher Motors', HEROMOTOCO: 'Hero MotoCorp', TVSMOTOR: 'TVS Motor', ASHOKLEY: 'Ashok Leyland', ESCORTS: 'Escorts Kubota', CHOLAFIN: 'Cholamandalam', SHRIRAMFIN: 'Shriram Finance', 'M&MFIN': 'M&M Financial' }[s] || s);

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, med, shortDate, SRC, SA, SQ, QL, yr, A26, A25, A24, A22, Q1, FY26, KTM, BACL,
  price, b, mv, ST, SH, SAF, SAEPS, saEps, saEpsSep28, BACLF, baclBookSep27, BPB, BACL_PB, ktmMkt, ktmVal, KS, FM, fwdSa, fwdSaAll, SAPE, fwdFyMed, fwdNow,
  PEER_SYMS, PEERS, P, MED5, derate, EXCL, OTHERS, sectorDr, drAll, drTwoWheelers, CORE, houseAfter, SOTP, evMed, evP25, evP75, saTtmEbitda, saSep28Ebitda, restate, EVX,
  build, buildOk, rating, buyBelow, sellAbove, STR, CONS, withEps, medTp, avgTp, streetEps, avgEps, avgOf, epsAdj, shortName };
