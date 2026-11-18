// Paradeep Phosphates initiation: shared context for the research parts (data, built model, peers,
// forward-multiple history on a merger-consistent EPS basis, street, derived numbers). As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'PARADEEP', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'PARADEEP.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, AS = M.forecast.assumptions, SC = M.forecast.scenarios, B = AS.build;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pctChg = (a, b) => Math.round((a / b - 1) * 100);
const r = v => Math.round(v);
const SRC = 'Paradeep results presentations, earnings calls and annual reports, GAM Research';

const A = M.annual, ai = l => A.labels.indexOf(l);
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const price = M.price.last, TRUE_SH = C.fy26.sharesYearEnd, mcap = price * TRUE_SH;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, ebitdaSep28 = mv('ev').metric, mult = mv('pe').mult;
const pe27 = price / F.eps[0], pe28 = price / F.eps[1], pe29 = price / F.eps[2], peSep28 = price / epsSep28;
const dcfV = mv('dcf').value, evV = mv('ev').value, peV = mv('pe').value;
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const Q1 = C.q1fy27, Y26 = C.fy26;

// Business build (assumptions.json) vs the engine: tonnes × revenue per tonne and EBITDA per tonne.
const buildRev = B.volumeMt.map((v, i) => v * B.revPerTonne[i] / 10), buildEbitda = B.volumeMt.map((v, i) => v * B.ebitdaPerTonne[i] / 10);
F.years.forEach((y, i) => {
  if (Math.abs(buildRev[i] / F.sales[i] - 1) > 0.01) console.warn(`PARADEEP build check: ${y} revenue build ₹${n0(buildRev[i])} cr vs model ₹${n0(F.sales[i])} cr`);
  if (Math.abs(buildEbitda[i] / F.ebitda[i] - 1) > 0.01) console.warn(`PARADEEP build check: ${y} EBITDA build ₹${n0(buildEbitda[i])} cr vs model ₹${n0(F.ebitda[i])} cr`);
});
const ept = i => F.ebitda[i] * 1e7 / (B.volumeMt[i] * 1e6); // EBITDA per tonne in the model

// Peers as of the 30-Sep-2026 close, with five-year medians (Screener, weekly).
const FERT = ['COROMANDEL', 'CHAMBLFERT', 'DEEPAKFERT', 'GSFC', 'GNFC', 'RCF', 'NFL'];
const PEER_SYMS = ['PARADEEP', ...FERT];
const PEERS = Object.fromEntries(peersAsOf(PEER_SYMS, ASOF).map(p => [p.symbol, p]));
const median = a => { const v = a.filter(x => x != null).slice().sort((x, y) => x - y); return v.length ? v[Math.floor(v.length / 2)] : null; };
const med5 = (sym, chart, key) => { const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return median((S.charts[chart]?.[key] || []).filter(([d, v]) => d >= '2021-09-30' && d <= ASOF && v > 0 && v < 300).map(x => x[1])); };
for (const s of PEER_SYMS) {
  const p = PEERS[s]; p.pe5 = med5(s, 'pe', 'Price to Earning'); p.ev5 = med5(s, 'evEbitda', 'EV Multiple');
  p.peVs = p.pe5 ? (p.pe / p.pe5 - 1) * 100 : null; p.evVs = p.ev5 ? (p.evEbitda / p.ev5 - 1) * 100 : null;
}
const sectorDerate = median(FERT.map(s => PEERS[s].peVs)), sectorDerateEv = median(FERT.map(s => PEERS[s].evVs));
const ex = (arr, s) => arr.filter(x => x !== s);
const derateExNfl = (() => { const v = ex(FERT, 'NFL').map(s => PEERS[s].peVs).sort((a, b) => a - b); return (v[2] + v[3]) / 2; })();
const fertPe = median(FERT.map(s => PEERS[s].pe));
const PP = PEERS.PARADEEP;
const SHORT = { COROMANDEL: 'Coromandel International', CHAMBLFERT: 'Chambal Fertilisers', DEEPAKFERT: 'Deepak Fertilisers', GSFC: 'GSFC', GNFC: 'GNFC', RCF: 'RCF', NFL: 'National Fertilizers', PARADEEP: 'Paradeep Phosphates' };
const pname = p => SHORT[p.symbol] || p.name.replace(/ Ltd\.?$/, '');

// One-year-forward P/E. The house tool (forwardMedian) reads Screener's EPS, whose FY25 figure (₹8.12) divides the
// merger-restated profit by pre-merger shares. Our series uses the EPS investors could see: FY25 ₹6.77 (PPL alone,
// as reported) before the merger was announced (7-Feb-2024) and ₹6.39 (restated, post-merger shares) after it.
const FM = forwardMedian('PARADEEP', M); // tool output on unadjusted EPS
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'PARADEEP', 'screener.json'), 'utf8'));
const byFy = {}; S.tables['profit-loss'].periods.forEach((p, i) => { if (/Mar/.test(p)) byFy[+p.slice(-4)] = S.tables['profit-loss'].rows['EPS in Rs'][i]; });
F.years.forEach((y, i) => (byFy[2000 + +y.slice(2, 4)] = F.eps[i]));
const epsFor = (fy, d) => (fy === 2025 ? (d < '2024-02-07' ? C.fy25.epsOriginal : C.fy25.epsRestated) : byFy[fy]);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const trough = fy => { const prev = [byFy[fy - 1], byFy[fy - 2], byFy[fy - 3]].filter(v => v != null); const pk = prev.length ? Math.max(...prev) : null; return !(byFy[fy] > 0) || (pk > 0 && byFy[fy] < 0.5 * pk); };
const fwdAll = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).map(([d, px]) => { const fy = fyOf(d), e = epsFor(fy, d); return [d, e > 0 ? Math.round(px / e * 10) / 10 : null, fy]; }).filter(x => x[1] != null);
fwdAll.push([ASOF, Math.round(price / F.eps[1] * 10) / 10, 2028]);
const fwdKept = fwdAll.filter(x => !trough(x[2]));
const medOf = a => median(a.map(x => x[1]));
const fwdMed = medOf(fwdKept), fwdMedAll = medOf(fwdAll);
const troughYears = [...new Set(fwdAll.filter(x => trough(x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const byYear = {}; fwdKept.forEach(x => (byYear[`FY${String(x[2]).slice(2)}`] ||= []).push(x));
const fwdYear = Object.fromEntries(Object.entries(byYear).map(([y, a]) => [y, medOf(a)]));
const derived = fwdMed * (1 + sectorDerate / 100);

// Street (latest note per broker by 30-Sep-2026).
const BR = D.street.brokers, tpBrokers = BR.filter(b => b.tp), PLE = D.street.estimates.pl;

// Net debt (borrowings incl. leases less cash and investments): history from Screener, forecasts from the model.
const ndLabels = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...F.years];
const ndVals = [...ndLabels.slice(0, 8).map(l => Math.round(A.netDebt[ai(l)])), ...F.treasury.map(t => Math.round(-t))];
const nd = i => -F.treasury[i];
const ndEbitda = i => nd(i) / F.ebitda[i];
const nd26 = A.netDebt[ai('FY26')];

module.exports = {
  fs, path, ROOT, RD, C, D, SG, M, F, V, AS, SC, B, ASOF, ASOF_TXT, n0, n1, pctChg, r, SRC, A, ai, SA, SQ, QL, price, TRUE_SH, mcap,
  BM, mv, epsSep28, ebitdaSep28, mult, pe27, pe28, pe29, peSep28, dcfV, evV, peV, rating, buyBelow, sellAbove, ruleText, Q1, Y26,
  buildRev, buildEbitda, ept, FERT, PEER_SYMS, PEERS, median, sectorDerate, sectorDerateEv, derateExNfl, fertPe, PP, pname,
  FM, fwdAll, fwdKept, fwdMed, fwdMedAll, troughYears, fwdYear, derived, BR, tpBrokers, PLE, ndLabels, ndVals, nd, ndEbitda, nd26,
};
