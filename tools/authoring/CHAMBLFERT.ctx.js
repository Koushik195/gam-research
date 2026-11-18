// Chambal Fertilisers initiation: shared context for the Part B files (research.js, part2-6). Loads the
// research JSONs and the built model and computes the valuation inputs once: the house forward P/E median
// (forwardMedian), the same median on EPS before Screener's exceptional tags, peer de-rating at the 30-Sep
// close, the urea build check and the street table. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'CHAMBLFERT', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'CHAMBLFERT.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'CHAMBLFERT', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pctChg = (a, b) => Math.round((a / b - 1) * 100);
const SRC = 'Chambal results presentations, earnings calls and annual reports, GAM Research';
const ai = l => A.labels.indexOf(l), b = ai('FY26');

// Segments
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const ann = fy => SA.find(a => a.fy === fy);
const A26 = ann('FY26'), A25 = ann('FY25'), A24 = ann('FY24'), A23 = ann('FY23');
const SEGY = SA.filter(a => a.ureaRev != null), SEGL = SEGY.map(a => a.fy);
const Q1 = C.q1fy27, FY = C.fy26;
const segF = k => F.years.map((_, i) => Math.round(F.seg[k].adjEbitda[i] / F.seg[k].revenue[i] * 1000) / 10);

// Urea build (assumptions.ureaBuild) must match the urea segment line
const UB = AS.ureaBuild, YRS = F.years;
const ubRev = YRS.map(y => UB.volumeLakhT[y] * UB.realisationPerT[y] / 100);
const ubEbitda = YRS.map(y => UB.volumeLakhT[y] * UB.ebitdaPerT[y] / 100);
YRS.forEach((y, i) => {
  const g1 = ubRev[i] / F.seg.urea.revenue[i] - 1, g2 = ubEbitda[i] / F.seg.urea.adjEbitda[i] - 1;
  if (Math.abs(g1) > 0.005 || Math.abs(g2) > 0.005) throw new Error(`urea build off segment line in ${y}: revenue ${(g1 * 100).toFixed(2)}%, EBITDA ${(g2 * 100).toFixed(2)}%`);
});
const g3Annual = UB.g3VolumeLakhT * UB.g3CutPerT / 100; // ₹ cr of EBITDA lost per full year
const g3Eps = g3Annual * (1 - AS.taxRate[1] / 100) / F.shares;

// Price, model outputs
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, ebitdaSep28 = mv('ev').metric, mult = mv('pe').mult, evMult = mv('ev').mult;
const pe27 = price / F.eps[0], pe28 = price / F.eps[1], pe29 = price / F.eps[2], peSep28 = price / epsSep28;
const dcfV = mv('dcf').value, evV = mv('ev').value;
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ureaPt = F.seg.urea.revenue[1] * 0.01 * (1 - AS.taxRate[1] / 100) / F.shares; // EPS per 1pt of urea margin, FY28E
const jvBook = FY.imacidBook, trueNc = i => F.treasury[i] - jvBook; // net cash excluding the IMACID stake
const epsCagr = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100;

// One-year-forward P/E: house rule (forwardMedian since Apr-2021, trough years excluded)
const FM = forwardMedian('CHAMBLFERT', M);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const medOf = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const byFy = {}; FM.series.forEach(([d, v]) => (byFy[fyOf(d)] ||= []).push(v));
const fwdYear = Object.fromEntries(Object.entries(byFy).map(([y, a]) => [`FY${String(y).slice(2)}`, medOf(a)]));
const fwdVals = FM.series.map(x => x[1]).sort((x, y) => x - y), fwdMin = fwdVals[0], fwdMax = fwdVals.at(-1);
// Same window on EPS before Screener's 'exceptional' tags (Profit excl Excep ÷ implied shares); forecasts unchanged
const pl = S.tables['profit-loss'], pex = S.schedules['profit-loss']['Net Profit']['Profit excl Excep'];
const epsAdj = {}; pl.periods.forEach((p, i) => { if (/^Mar/.test(p)) epsAdj[+p.slice(-4)] = pex[p] / (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]); });
F.years.forEach((y, i) => (epsAdj[2000 + +y.slice(2, 4)] = F.eps[i]));
const fwdAdj = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= '2021-04-01').map(([d, p]) => p / epsAdj[fyOf(d)]);
const fwdAdjMed = Math.round(medOf(fwdAdj) * 10) / 10;
const fwd = forwardSeries('CHAMBLFERT', M, 'eps');

// Peers at the 30-Sep-2026 close with five-year medians (Screener weekly trailing multiples)
const PEER_SYMS = ['CHAMBLFERT', 'COROMANDEL', 'PARADEEP', 'DEEPAKFERT', 'RCF', 'GSFC', 'GNFC', 'NFL'];
const OTHERS = PEER_SYMS.slice(1), UREA = ['RCF', 'NFL', 'GSFC', 'GNFC'];
const PEERS = Object.fromEntries(peersAsOf(PEER_SYMS, ASOF).map(p => [p.symbol, p]));
const med5 = (sym, chart, key) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return medOf((X.charts[chart]?.[key] || []).filter(([d, v]) => d >= '2021-09-30' && d <= ASOF && v > 0 && v < 300).map(x => x[1])); };
for (const s of PEER_SYMS) { const p = PEERS[s]; p.pe5 = med5(s, 'pe', 'Price to Earning'); p.ev5 = med5(s, 'evEbitda', 'EV Multiple'); p.peVs = (p.pe / p.pe5 - 1) * 100; p.evVs = (p.evEbitda / p.ev5 - 1) * 100; }
const sectorDerate = medOf(OTHERS.map(s => PEERS[s].peVs)), sectorDerateEv = medOf(OTHERS.map(s => PEERS[s].evVs));
const fertPe = medOf(OTHERS.map(s => PEERS[s].pe)), ureaPe = (s => (s[1] + s[2]) / 2)(UREA.map(s => PEERS[s].pe).sort((x, y) => x - y));
const CF = PEERS.CHAMBLFERT, afterDerate = FM.median * (1 + sectorDerate / 100);
if (Math.abs(afterDerate - mult) > 0.05) throw new Error(`target multiple ${mult}x differs from derivation ${afterDerate.toFixed(2)}x`);
const SHORT = { CHAMBLFERT: 'Chambal', COROMANDEL: 'Coromandel', PARADEEP: 'Paradeep Phosphates', DEEPAKFERT: 'Deepak Fertilisers', RCF: 'RCF', GSFC: 'GSFC', GNFC: 'GNFC', NFL: 'NFL' };
const pname = s => SHORT[s] || s;

// Street (latest note per broker by 30-Sep-2026)
const BR = D.street.brokers, br = n => BR.find(x => x.broker === n);
const streetEps = y => medOf(BR.filter(x => x.eps[y] != null).map(x => x.eps[y]));

module.exports = {
  fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pctChg, SRC, ai, b, SA, SQ, QL, ann, A26, A25, A24, A23, SEGY, SEGL, Q1, FY, segF,
  UB, ubRev, ubEbitda, g3Annual, g3Eps, price, mcap, BM, mv, epsSep28, ebitdaSep28, mult, evMult, pe27, pe28, pe29, peSep28, dcfV, evV, rating, buyBelow, sellAbove, ruleText,
  ureaPt, jvBook, trueNc, epsCagr, FM, fwdYear, fwdMin, fwdMax, fwdAdjMed, fwd, PEER_SYMS, OTHERS, UREA, PEERS, sectorDerate, sectorDerateEv, fertPe, ureaPe, CF, afterDerate, pname, medOf,
  BR, br, streetEps,
};
