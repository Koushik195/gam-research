// Tech Mahindra initiation: shared context for the Part B files (research.js, part2-6). Loads the research
// JSONs and the built model; computes the valuation inputs once: forward P/E history on REPORTED EPS (the
// engine's forwardMedian reads Screener's raw EPS, which counts the TML Benefit Trust's 9.42 cr treasury
// shares; see TECHM.patch.js), peer de-rating, EV/EBITDA history, street table, USD build check.
// Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const { TRUST } = require('./TECHM.patch');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'TECHM', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'TECHM.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const med = a => { const s = a.filter(x => x != null).slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const SQ = SG.quarterly, QL = SQ.map(q => q.q), SA = SG.annual, Q1 = C.q1fy27, FY26 = C.fy26;
const price = M.price.last, shares = F.shares, mcap = price * shares;
const b = A.labels.length - 1; // FY26 index

// ---- USD build check: USD revenue x INR/USD must equal model revenue (engine input revenueGrowth)
const UB = AS.usdBuild;
const usdCheck = F.sales.map((s, i) => ({ year: F.years[i], usd: UB.usdRev[i], rate: UB.inrUsdAvg[i], inr: UB.usdRev[i] * UB.inrUsdAvg[i] / 10, model: s }));
for (const u of usdCheck) if (Math.abs(u.inr / u.model - 1) > 0.002) throw new Error(`USD build ${u.year}: ${u.inr} vs model ${u.model}`);
const vert = (() => { let v = Object.fromEntries(Object.entries(UB.base.mixPct).map(([k, m]) => [k, UB.base.usdRev * m / 100])); const out = [v]; for (let i = 0; i < 3; i++) { v = Object.fromEntries(Object.entries(v).map(([k, x]) => [k, x * (1 + UB.verticalGrowthPct[k][i] / 100)])); out.push(v); } return out; })();
vert.slice(1).forEach((v, i) => { const s = Object.values(v).reduce((t, x) => t + x, 0); if (Math.abs(s / UB.usdRev[i] - 1) > 0.001) throw new Error(`vertical build ${F.years[i]} sums to ${s}`); });
const ebitM = F.ebit.map((e, i) => e / F.sales[i] * 100);

// ---- One-year-forward P/E on reported EPS (same rule as forwardMedian: every 5th weekly close, trough years out)
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'TECHM', 'screener.json'), 'utf8'));
const by = {}; A.labels.forEach((l, i) => (by[2000 + +l.slice(2)] = A.eps[i])); F.years.forEach((y, i) => (by[2000 + +y.slice(2, 4)] = F.eps[i]));
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const trough = fy => { const pk = Math.max(...[by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null)); return !(by[fy] > 0) || by[fy] < 0.5 * pk; };
const PX = M.price.series.filter(([d]) => d <= ASOF);
const fwdAll = PX.filter((_, i) => i % 5 === 0 || i === PX.length - 1).map(([d, p]) => [d, by[fyOf(d)] > 0 ? Math.round(p / by[fyOf(d)] * 10) / 10 : null, fyOf(d)]).filter(x => x[1] != null);
const w21 = fwdAll.filter(x => x[0] >= '2021-04-01'), kept = w21.filter(x => !trough(x[2]));
const FMR = { median: med(kept.map(x => x[1])), medianAll: med(w21.map(x => x[1])), troughYears: [...new Set(w21.filter(x => trough(x[2])).map(x => `FY${String(x[2]).slice(2)}`))], n: w21.length, nKept: kept.length };
const FMR2 = { median: med(w21.filter(x => x[2] !== 2024 && x[2] !== 2025).map(x => x[1])), n: w21.filter(x => x[2] !== 2024 && x[2] !== 2025).length, fy25: med(w21.filter(x => x[2] === 2025).map(x => x[1])), fy24: med(w21.filter(x => x[2] === 2024).map(x => x[1])) }; // FY24 and FY25 both out (sensitivity)
const fwdPe = fwdAll.filter(x => x[0] >= '2016-04-01').map(x => [x[0], x[1]]);
const since16 = med(fwdAll.filter(x => x[0] >= '2016-04-01' && !trough(x[2])).map(x => x[1]));
const pre21 = med(fwdAll.filter(x => x[0] >= '2016-04-01' && x[0] < '2021-04-01' && !trough(x[2])).map(x => x[1]));
const last2y = med(fwdAll.filter(x => x[0] >= '2024-10-01').map(x => x[1]));
// One-offs rule: same median on EPS before exceptional items (FY25 +Rs301 cr property gain after tax; FY26 -Rs184 cr
// Labour Code charge after tax; Screener "Exceptional items AT"), on the reported share count.
const exAT = { 2025: 301, 2026: -184 }, byAdj = { ...by };
for (const [y, x] of Object.entries(exAT)) { const i = A.labels.indexOf(`FY${String(y).slice(2)}`); byAdj[y] = (A.pat[i] - x) / (A.pat[i] / A.eps[i]); }
const keptAdj = w21.filter(x => !trough(x[2])).map(([d]) => { const p = PX.find(r => r[0] === d)?.[1] ?? price; return p / byAdj[fyOf(d)]; });
const FMadj = { median: med(keptAdj), eps25: byAdj[2025], eps26: byAdj[2026] };
const FMraw = forwardMedian('TECHM', M); // engine version on Screener's raw EPS (all ~98 cr shares)
const fwdNow = price / F.eps[1], trailRep = price / A.ttm.eps;

// ---- Peers at the 30-Sep-2026 close; de-rating vs each one's five-year median trailing P/E
const PEER_SYMS = ['TCS', 'INFY', 'HCLTECH', 'WIPRO', 'LTM', 'MPHASIS', 'COFORGE', 'PERSISTENT', 'LTTS'];
const PEERS = peersAsOf(['TECHM', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return med((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1])); };
const MED5 = Object.fromEntries(['TECHM', ...PEER_SYMS].map(s => [s, med5(s)]));
const derate = Object.fromEntries(Object.keys(MED5).map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const DR_SET = D.peers.deratingSet; // batch rule: nine IT peers (Tier-1, LTIMindtree, Persistent, Coforge, Mphasis, LTTS); Tech Mahindra excluded
const drS = DR_SET.map(s => derate[s]).sort((x, y) => x - y);
const sectorDr = drS.length % 2 ? drS[(drS.length - 1) / 2] : (drS[drS.length / 2 - 1] + drS[drS.length / 2]) / 2;
const afterDerate = FMR.median * (1 + sectorDr / 100);
const tier1Pe = med(['TCS', 'INFY', 'HCLTECH', 'WIPRO'].map(s => P[s].pe));
const medOf = a => { const s = a.slice().sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
const drInc4 = medOf(['TCS', 'INFY', 'HCLTECH', 'WIPRO'].map(s => derate[s])), drInc6 = medOf(['TCS', 'INFY', 'HCLTECH', 'WIPRO', 'LTM', 'MPHASIS'].map(s => derate[s]));
const shortName = s => ({ TECHM: 'Tech Mahindra', TCS: 'TCS', INFY: 'Infosys', HCLTECH: 'HCLTech', WIPRO: 'Wipro', LTM: 'LTIMindtree (LTM)', MPHASIS: 'Mphasis', COFORGE: 'Coforge', PERSISTENT: 'Persistent', LTTS: 'L&T Technology Services' }[s] || s);
// Tech Mahindra's own P/E on reported EPS (Screener's chart uses ~98 cr shares): trailing at the as-of close
const peTechmRep = trailRep;

// ---- EV/EBITDA history on economic EV (Screener EV less the trust's shares at market), Apr-2021 to as-of
const evS = S.charts.evEbitda, ebitdaAt = d => { const s = evS.EBITDA.filter(([x]) => x <= d); return s.length ? s.at(-1)[1] : null; };
const evHist = evS['EV Multiple'].filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(([d, x]) => { const p = PX.filter(([y]) => y <= d).at(-1)?.[1], e = ebitdaAt(d); return e && p ? (x * e - p * TRUST) / e : null; });
const evMed = med(evHist), ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);
// One-year-forward EV/EBITDA (EV = price x reported share count - net cash of the last published balance sheet)
const ebY = {}, ncY = {}, shY = {}; A.labels.forEach((l, i) => { const y = 2000 + +l.slice(2); ebY[y] = A.ebitda[i]; ncY[y] = (A.cash[i] || 0) + (A.investments[i] || 0) - (A.borrowings[i] || 0); shY[y] = A.pat[i] / A.eps[i]; });
F.years.forEach((y, i) => (ebY[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const bsY = d => { const dt = new Date(d); return Math.min(dt.getMonth() < 5 ? dt.getFullYear() - 1 : dt.getFullYear(), 2026); };
const fwdEv = PX.filter((_, i) => i % 5 === 0 || i === PX.length - 1).filter(([d]) => d >= '2021-04-01').map(([d, p]) => [d, (p * shY[bsY(d)] - ncY[bsY(d)]) / ebY[fyOf(d)], fyOf(d)]);
const fwdEvMed = med(fwdEv.filter(x => !trough(x[2])).map(x => x[1])), fwdEvNow = fwdEv.at(-1)[1];
const netCash0 = (A.cash[b] || 0) + (A.investments[b] || 0) - (A.borrowings[b] || 0);
const evNow = (mcap - netCash0) / ttmEbitda;

// ---- Valuation outputs, rating from the house rule
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult, ebitdaSep28 = mv('ev').metric;
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagr2629 = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, epsCagr2729 = (Math.pow(F.eps[2] / F.eps[0], 1 / 2) - 1) * 100;
const ke = V.ke, gJ = 6.5, justPe = AS.payout[1] / 100 * (1 + gJ / 100) / ((ke - gJ) / 100); // justified forward P/E at g = 6.5%

// ---- Street as it stood on 30-Sep-2026
const ST = D.street.brokers, CONS = D.street.consensus;
const withEps = ST.filter(s => s.eps?.FY28E), postQ1 = ST.filter(s => s.date >= '2026-07-16' && s.tp);
const tpS = postQ1.map(s => s.tp).sort((x, y) => x - y), medTp = med(tpS), avgTp = tpS.reduce((s, x) => s + x, 0) / tpS.length;
const avgEps = y => { const v = withEps.map(s => s.eps[y]).filter(x => x != null); return v.reduce((s, x) => s + x, 0) / v.length; };
const streetEbit = y => { const v = withEps.map(s => s.ebit?.[y]).filter(x => x != null); return v.length ? [Math.min(...v), Math.max(...v)] : null; };
const nSell = ST.filter(s => /sell|underperform|underweight|reduce/i.test(s.rating || '')).length + ST.filter(s => !s.rating && s.tp < 1400).length;

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, n0, n1, pc, pc1, med, SQ, QL, SA, Q1, FY26, price, shares, mcap, b, UB, usdCheck, vert, ebitM,
  FMR, FMR2, FMadj, FMraw, fwdPe, since16, pre21, last2y, fwdNow, trailRep, PEER_SYMS, PEERS, P, MED5, derate, DR_SET, sectorDr, afterDerate, tier1Pe, drInc4, drInc6, shortName, peTechmRep,
  evMed, evHist, fwdEvMed, fwdEvNow, ttmEbitda, netCash0, evNow, mv, epsSep28, peMult, ebitdaSep28, rating, ruleText, buyBelow, sellAbove, epsCagr2629, epsCagr2729, ke, gJ, justPe,
  ST, CONS, withEps, postQ1, tpS, medTp, avgTp, avgEps, streetEbit, nSell };

if (require.main === module) {
  const X = module.exports;
  console.log('FMR', JSON.stringify(FMR), 'adj', JSON.stringify(FMadj), 'raw', JSON.stringify({ median: FMraw.median, medianAll: FMraw.medianAll, trough: FMraw.troughYears }), 'since16', since16, 'pre21', pre21, 'last2y', last2y);
  console.log('derate', JSON.stringify(Object.fromEntries(Object.entries(derate).map(([k, v]) => [k, Math.round(v * 10) / 10]))), 'sectorDr', sectorDr.toFixed(1), 'afterDerate', afterDerate.toFixed(1), 'tier1Pe', tier1Pe, 'inc4', drInc4.toFixed(1), 'inc6', drInc6.toFixed(1), 'FMR2', JSON.stringify(FMR2), 'justPe', justPe.toFixed(1));
  console.log('fwdEvMed', fwdEvMed.toFixed(1), 'fwdEvNow', fwdEvNow.toFixed(1), 'evMed', evMed?.toFixed(1), 'evNow', evNow.toFixed(1), 'ttmEbitda', ttmEbitda, 'ebitdaSep28', Math.round(ebitdaSep28), 'fwdNow', fwdNow.toFixed(1), 'trailRep', trailRep.toFixed(1));
  console.log('tp', V.tp, 'up', V.upside.toFixed(1), rating, 'medTp', medTp, 'avgTp', Math.round(avgTp), 'avgEps', avgEps('FY27E').toFixed(1), avgEps('FY28E').toFixed(1), 'usd', JSON.stringify(usdCheck.map(u => Math.round(u.inr))));
}
