// Divi's Laboratories initiation: shared context for the Part B files (research.js, part2-6). Loads the research
// JSONs and the built model; checks the three-line revenue build; computes the forward P/E history (house
// forwardMedian, the same median on EPS before exceptional items, the ex-Covid window), Divi's own one-year-forward
// EV/EBITDA history, the pharma sector factor (PLAYBOOK §7c, peer by peer as in EICHERMOT.ctx.js), the derived
// multiples, sensitivity rows, the other-income build and the street table once. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'DIVISLAB', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'DIVISLAB.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'DIVISLAB', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?(?=[0-9])/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const cagr = (a, z, y) => (Math.pow(z / a, 1 / y) - 1) * 100;
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SRC = "Divi's annual reports, earnings calls and filings; Screener.in (consolidated); GAM Research";
const b = A.labels.length - 1; // FY26 index
const ai = fy => A.labels.indexOf(fy);
const price = M.price.last, sh = F.shares, mcap = price * sh;
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E

// 1) Three-line build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines, LINES = { generics: [], cs: [], nutra: [] };
{ let g = BL.base.generics, c = BL.base.cs, n = BL.base.nutra;
  for (let i = 0; i < 3; i++) { g *= 1 + BL.growth.generics[i] / 100; c *= 1 + BL.growth.cs[i] / 100; n *= 1 + BL.growth.nutra[i] / 100; LINES.generics.push(g); LINES.cs.push(c); LINES.nutra.push(n); } }
F.years.forEach((y, i) => { const t = LINES.generics[i] + LINES.cs[i] + LINES.nutra[i]; if (Math.abs(t / F.sales[i] - 1) > 0.005) throw new Error(`DIVISLAB build off model revenue in ${y}: ${n0(t)} vs ${n0(F.sales[i])}`); });
if (Math.abs(BL.base.generics + BL.base.cs + BL.base.nutra - A.sales[b]) > 1) throw new Error('DIVISLAB build base does not sum to FY26 revenue');
const csShare = i => LINES.cs[i] / F.sales[i] * 100;
// History of the three lines from the company split (generics include nutraceuticals in the company's %)
const HIST = SA.map(a => ({ fy: a.fy, rev: a.revenue, cs: a.revenue * a.csPct / 100, nutra: a.nutraRev, gen: a.revenue * a.genPct / 100 - a.nutraRev, cc: a.ccGrowthPct }));
const QH = SQ.map(q => ({ q: q.q, rev: q.revenue, cs: q.revenue * q.csPct / 100, nutra: q.nutraRev, gen: q.revenue * q.genPct / 100 - q.nutraRev, gm: q.grossMarginPct, em: q.ebitdaMarginPct, csPct: q.csPct }));

// 2) Forward P/E: house forwardMedian (reported EPS; trough years excluded) + variants
const FM = forwardMedian('DIVISLAB', M);
const fv = FM.series.map(x => x[1]);
const FMS = { med: FM.median, p25: pct(fv, 0.25), p75: pct(fv, 0.75), min: Math.min(...fv), max: Math.max(...fv), n: fv.length };
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const repEps = {}; A.labels.forEach((l, i) => (repEps[2000 + +l.slice(2, 4)] = A.eps[i]));
const UE = C.underlyingEps, adjEps = { ...repEps }; Object.entries(UE).forEach(([k, v]) => { if (/^FY\d\d$/.test(k)) adjEps[2000 + +k.slice(2)] = v; });
const preExc = FM.series.map(([d, x]) => { const fy = fyOf(d); return repEps[fy] && adjEps[fy] ? x * repEps[fy] / adjEps[fy] : x; });
const preExcMed = pct(preExc, 0.5);
const exCovidMed = pct(FM.series.filter(([d]) => d >= '2022-04-01').map(x => x[1]), 0.5);
const byFy = {}; FM.series.forEach(([d, x]) => (byFy[`FY${String(fyOf(d) - 1).slice(2)}`] ||= []).push(x));
const FYMED = Object.fromEntries(Object.entries(byFy).map(([k, v]) => [k, pct(v, 0.5)]));
const fwdPe = forwardSeries('DIVISLAB', M, 'eps').filter(x => x[0] >= '2016-04-01');
const preCovidMed = pct(fwdPe.filter(x => x[0] < '2020-04-01').map(x => x[1]), 0.5);
const fwdNow = price / F.eps[1], peFY27 = price / F.eps[0], peTrail = price / M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0);
const FY22EPS = repEps[2022], FY24EPS = repEps[2024];

// 3) Divi's own one-year-forward EV/EBITDA (EV at the weekly close / next full-year EBITDA; net cash at the last FY end)
const ebBy = {}, ncBy = {};
A.labels.forEach((l, i) => { const y = 2000 + +l.slice(2, 4); ebBy[y] = A.ebitda[i]; ncBy[y] = (A.cash[i] || 0) + (A.investments[i] || 0) - (A.borrowings[i] || 0); });
F.years.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const fwdEv = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= '2021-04-01')
  .map(([d, px]) => { const fy = fyOf(d); return [d, Math.round((px * sh - ncBy[fy - 2]) / ebBy[fy] * 10) / 10]; });
const fe = fwdEv.map(x => x[1]);
const FEV = { med: pct(fe, 0.5), p25: pct(fe, 0.25), p75: pct(fe, 0.75), now: (mcap - (A.cash[b] + A.investments[b] - A.borrowings[b])) / F.ebitda[1] };
const trailEv = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]);
const TEV = { med: pct(trailEv, 0.5) };

// 4) Sector factor: pharma peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c, EICHERMOT.ctx.js method)
const SET = D.peers.set, EXCL = Object.keys(D.peers.excluded), CDMO = D.peers.cdmo;
const PEER_SYMS = ['DIVISLAB', ...SET, ...EXCL];
const PEERS = peersAsOf([...PEER_SYMS, ...CDMO], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries([...PEER_SYMS, ...CDMO].map(s => [s, med5(s)]));
const derate = Object.fromEntries([...PEER_SYMS, ...CDMO].map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const dr1 = s => Math.round(derate[s] * 10) / 10; // per-peer, rounded to 0.1pt as in the batch derivation
const sectorDr = medOf(SET.map(dr1)), sectorDrRaw = medOf(SET.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.filter(s => s !== 'DIVISLAB' && derate[s] != null).map(s => derate[s]));
const K_SET = 1.0545; // PLAYBOOK §7c: DIVISLAB factor, set for the batch
if (Math.abs(sectorDr - 5.45) > 0.05) console.warn(`WARNING: DIVISLAB sector factor recomputes to ${sectorDr.toFixed(2)}% vs the +5.45% set in PLAYBOOK §7c`);
const K = K_SET, ownDr = derate.DIVISLAB;
const shortName = s => ({ DIVISLAB: "Divi's", SUNPHARMA: 'Sun Pharma', TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo', ALKEM: 'Alkem', IPCALAB: 'Ipca', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind', NEULANDLAB: 'Neuland Labs', SAILIFE: 'Sai Life Sciences', SYNGENE: 'Syngene', PPLPHARMA: 'Piramal Pharma' }[s] || s);

// 5) Derived multiples (must match assumptions.json) and sensitivity rows
const MULT = { pe: { base: half(FM.median * K), bull: half(FMS.p75 * K), bear: half(FMS.p25 * K) }, ev: { base: half(FEV.med * K), bull: half(FEV.p75 * K), bear: half(FEV.p25 * K) } };
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
['pe', 'ev'].forEach(k => ['base', 'bull', 'bear'].forEach(c => { if (Math.abs(mv(k).multiple[c] - MULT[k][c]) > 1e-9) console.warn(`WARNING: ${k} ${c} multiple ${mv(k).multiple[c]} in assumptions vs derived ${MULT[k][c]} - update assumptions.json`); }));
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult, evMult = mv('ev').mult, ebitdaSep28 = mv('ev').metric;
const SENS = [
  { name: 'House base: forwardMedian × sector factor', mult: MULT.pe.base, why: `${n1(FM.median)}x × ${K}` },
  { name: 'Median on EPS before exceptional items', mult: half(preExcMed * K), why: `${n1(preExcMed)}x × ${K} (FY26 Labour Codes charge added back)` },
  { name: 'Ex-Covid window (from Apr-2022)', mult: half(exCovidMed * K), why: `${n1(exCovidMed)}x × ${K}: drops the dates priced on the molnupiravir boom` },
  { name: "Blend with Divi's own re-rating (not house policy)", mult: half(FM.median * (1 + (sectorDr + ownDr) / 200)), why: `midpoint of ${pc1(sectorDr)} and Divi's own ${pc1(ownDr)}` },
  { name: 'Own history only (no sector factor)', mult: half(FM.median), why: `${n1(FM.median)}x` },
  { name: 'Street P/E users (MOSL 55x, BOBCAPS 56x)', mult: 55.5, why: 'Average of the two disclosed P/E multiples' },
].map(r => ({ ...r, tp: Math.round(r.mult * epsSep28 / 10) * 10, up: (r.mult * epsSep28 / price - 1) * 100 }));

// 6) Other-income build (sourced parts) and reconciliation
const OIN = C.otherIncomeNote;
const openNet26 = A.cash[b] + A.investments[b] - A.borrowings[b];
const oiFY27 = { treasury: AS.treasuryYield[0] / 100 * openNet26, misc: AS.otherIncome[0] };
oiFY27.total = oiFY27.treasury + oiFY27.misc;
const oiExFx26 = OIN.FY26.total - OIN.FY26.forex, ttmOi = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);
const ttmFx = SQ.slice(-4).reduce((s, q) => s + (q.forexGain || 0), 0), ttmExc = -74; // Q3FY26 Labour Codes sits in Screener's other income
const ttmOiExFx = ttmOi - ttmExc - ttmFx;
const cq = OIN.cashQuarterEnds, avgCash26 = (cq['Mar-25'] + cq['Jun-25'] + cq['Sep-25'] + cq['Dec-25'] + cq['Mar-26']) / 5;
const yield26 = OIN.FY26.interest / avgCash26 * 100;
if (Math.abs(oiFY27.total - F.otherIncome[0]) > 1) throw new Error(`DIVISLAB other-income build ${n0(oiFY27.total)} vs model ${n0(F.otherIncome[0])}`);

// 7) Rating from the house rule (never typed), street
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, br = n => ST.find(s => s.broker === n);
const postQ1 = ST.filter(s => s.date >= '2026-07-31');
const medTp = medOf(postQ1.map(s => s.tp)), avgTp = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length;
const withEps = ST.filter(s => s.eps && s.eps.FY27E && s.date >= '2026-07-31'), avgEps = y => withEps.reduce((s, x) => s + x.eps[y], 0) / withEps.length;
const nBuy = postQ1.filter(s => /Buy|Overweight|Outperform/.test(s.rating)).length, nHold = postQ1.filter(s => /Hold|Neutral|Accumulate/.test(s.rating)).length, nSell = postQ1.filter(s => /Sell|Reduce/.test(s.rating)).length;

// 8) Growth and returns history
const epsCagr10 = cagr(repEps[2016], repEps[2026], 10), epsCagr5 = cagr(repEps[2021], repEps[2026], 5), epsCagrFwd = cagr(A.eps[b], F.eps[2], 3);
const salesCagr10 = cagr(A.sales[ai('FY16')], A.sales[b], 10);
const capexPct26 = A.capex[b] / A.sales[b] * 100;
const capexPctHist = (() => { const xs = ['FY16', 'FY17', 'FY18', 'FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25'].map(y => A.capex[ai(y)] / A.sales[ai(y)] * 100).filter(x => x > 0); return xs.reduce((s, x) => s + x, 0) / xs.length; })();
const assetTurn = fy => A.sales[ai(fy)] / A.grossBlock[ai(fy)];
const divYield = F.dps[0] / price * 100;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, cagr, pct, medOf, shortDate, SRC, b, ai, price, sh, mcap, sep,
  SA, SQ, QL, Q1, FY26, BL, LINES, csShare, HIST, QH, FM, FMS, preExcMed, exCovidMed, FYMED, fwdPe, preCovidMed, fwdNow, peFY27, peTrail, FY22EPS, FY24EPS, UE,
  fwdEv, FEV, TEV, SET, EXCL, CDMO, PEER_SYMS, PEERS, P, MED5, derate, dr1, sectorDr, sectorDrRaw, sectorDrAll, K, ownDr, shortName,
  MULT, BM, mv, epsSep28, peMult, evMult, ebitdaSep28, SENS, OIN, openNet26, oiFY27, oiExFx26, ttmOi, ttmFx, ttmOiExFx, avgCash26, yield26,
  rating, ruleText, buyBelow, sellAbove, ST, br, postQ1, medTp, avgTp, withEps, avgEps, nBuy, nHold, nSell, epsCagr10, epsCagr5, epsCagrFwd, salesCagr10, capexPct26, capexPctHist, assetTurn, divYield };
