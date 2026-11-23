// Laurus Labs initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and the
// built model and computes, once: the four-line revenue build (checked against model revenue), the other-income and
// interest builds (checked against assumptions), the forward P/E history (house forwardMedian on reported EPS; the base
// median on EPS before exceptional items, A18 practice; trough years FY24-FY25 left out), the forward EV/EBITDA history
// (cross-check), the pharma P/E sector factor and its EV/EBITDA analogue peer by peer (PLAYBOOK §7c; Laurus is outside
// the nine-peer set, so the set median applies), the derived multiples, sensitivity rows, a reverse-DCF test, peers and
// the street as it stood on 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'LAURUSLABS', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'LAURUSLABS.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'LAURUSLABS', 'screener.json'), 'utf8')); // unpatched
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
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SRC = 'Laurus Labs annual reports, presentations and earnings calls; Screener.in (consolidated); GAM Research';
const b = A.labels.length - 1; // FY26 index
const ai = fy => A.labels.indexOf(fy);
const price = M.price.last, sh = F.shares, mcap = price * sh;
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const YRS = F.years;

// 1) Four-line build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines, KEYS = ['cdmo', 'bio', 'api', 'fdf'];
const LINES = Object.fromEntries(KEYS.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => KEYS.reduce((s, k) => s + LINES[k][i], 0));
if (Math.abs(KEYS.reduce((s, k) => s + BL.base[k], 0) - A.sales[b]) > 1) throw new Error('LAURUSLABS build base does not sum to FY26 revenue');
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`LAURUSLABS build off model revenue in ${y}: ${n0(buildTot[i])} vs ${n0(F.sales[i])}`); });
const cdmoShare = i => (LINES.cdmo[i] + LINES.bio[i]) / buildTot[i] * 100;
const amTot = YRS.map((_, i) => LINES.api[i] + LINES.fdf[i]);

// 2) Other income build (sourced parts) and reconciliation
const OIN = C.otherIncomeNote;
const OI_BUILD = [
  { q1: 9.2, interest: 5.0, misc: 6.6, forex: 0 },
  { q1: 0, interest: 6.6, misc: 8.8, forex: 0 },
  { q1: 0, interest: 6.6, misc: 8.8, forex: 0 },
].map(x => ({ ...x, total: x.q1 + x.interest + x.misc + x.forex }));
YRS.forEach((y, i) => { if (Math.abs(OI_BUILD[i].total - AS.otherIncome[i]) > 1) throw new Error(`LAURUSLABS other income ${y}: build ${OI_BUILD[i].total} vs ${AS.otherIncome[i]}`); });
const oiExFx26 = OIN.FY26.total - OIN.FY26.forex, ttmOi = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);

// 3) Interest build: 5.9% on average loans + ~₹20 cr other finance costs; loans = engine net debt + cash + investments − leases
const LEASES = 121, CASH_HOLD = A.cash[b] || 0, INV = A.investments[b] || 0, KD = 5.9, OTHER_FIN = 20;
const loans0 = 611 + 1786; // Mar-26 term + working-capital loans (AR note 13)
const loans = [loans0, ...F.treasury.map(t => -t + CASH_HOLD + INV - LEASES)];
const intBuild = YRS.map((_, i) => KD / 100 * (loans[i] + loans[i + 1]) / 2 + OTHER_FIN);
YRS.forEach((y, i) => { if (Math.abs(intBuild[i] / AS.interest[i] - 1) > 0.04) throw new Error(`LAURUSLABS interest ${y}: build ${n0(intBuild[i])} vs ${AS.interest[i]}`); });
const netDebtCo = [FY26.netDebt, ...loans.slice(1).map(l => l - CASH_HOLD)]; // company basis: loans − cash (ex leases, ex investments)
const lev = netDebtCo.map((x, i) => x / (i ? F.ebitda[i - 1] : A.ebitda[b]));

// 4) Forward P/E: house forwardMedian (reported EPS) + base median on EPS before exceptional items (A18 practice)
const FM = forwardMedian('LAURUSLABS', M);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pl = S.tables['profit-loss'], ns = S.schedules['profit-loss']['Net Profit'];
const epsRep = {}, epsExc = {}, EXC_AT = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4), e = pl.rows['EPS in Rs'][i], ex = ns['Exceptional items AT'][p] || 0, pfe = ns['Profit for EPS'][p]; epsRep[y] = e; epsExc[y] = pfe ? e - ex / (pfe / e) : e; EXC_AT[y] = ex; } });
YRS.forEach((y, i) => { const fy = 2000 + +y.slice(2, 4); epsRep[fy] = F.eps[i]; epsExc[fy] = F.eps[i]; }); // forecasts carry no exceptionals
const troughOf = by => fy => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); const pk = prev.length ? Math.max(...prev) : null; return !(by[fy] > 0) || (pk > 0 && by[fy] < 0.5 * pk); };
const pxW = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= '2021-04-01'); // same sampling as forwardSeries
const exSeriesAll = pxW.map(([d, p]) => [d, Math.round(p / epsExc[fyOf(d)] * 10) / 10, troughOf(epsExc)(fyOf(d))]);
const exSeries = exSeriesAll.filter(x => !x[2]).map(x => [x[0], x[1]]);
const medH = a => { const s = a.map(x => x[1]).sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; }; // forwardMedian's median convention
const EXM = { med: medH(exSeries), all: medH(exSeriesAll), p25: pct(exSeries.map(x => x[1]), 0.25), p75: pct(exSeries.map(x => x[1]), 0.75), n: exSeries.length, troughs: [...new Set(exSeriesAll.filter(x => x[2]).map(x => `FY${String(fyOf(x[0])).slice(2)}`))] };
const fv = FM.series.map(x => x[1]);
const FMS = { med: FM.median, p25: pct(fv, 0.25), p75: pct(fv, 0.75), min: Math.min(...fv), max: Math.max(...fv), n: fv.length };
const byFy = {}; exSeries.forEach(([d, x]) => (byFy[`FY${String(fyOf(d) - 1).slice(2)}`] ||= []).push(x));
const FYMED = Object.fromEntries(Object.entries(byFy).map(([k, v]) => [k, pct(v, 0.5)]));
const byFyAll = {}; forwardSeries('LAURUSLABS', M, 'eps').filter(x => x[0] >= '2021-04-01').forEach(([d, x]) => (byFyAll[`FY${String(fyOf(d) - 1).slice(2)}`] ||= []).push(x));
const FYMED_ALL = Object.fromEntries(Object.entries(byFyAll).map(([k, v]) => [k, pct(v, 0.5)]));
const postBustMed = medH(exSeries.filter(([d]) => d >= '2024-04-01')), boomMed = medH(exSeries.filter(([d]) => d < '2022-04-01'));
const fwdPe = forwardSeries('LAURUSLABS', M, 'eps').filter(x => x[0] >= '2017-04-01');
const fwdNow = price / F.eps[1], peFY27 = price / F.eps[0], peSep = price / sep(F.eps), peTrail = price / M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0);
const FY21EPS = epsRep[2021], FY23EPS = epsRep[2023], FY24EPS = epsRep[2024], FY25EPS = epsRep[2025], FY22EPS = epsRep[2022];

// 5) Forward EV/EBITDA history (EV at the weekly close with net debt at the latest March published by end-May / next FY EBITDA)
const ebBy = {}, ndBy = {};
A.labels.forEach((l, i) => { const y = 2000 + +l.slice(2, 4); ebBy[y] = A.ebitda[i]; ndBy[y] = (A.borrowings[i] || 0) - (A.cash[i] || 0) - (A.investments[i] || 0); });
YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ndAt = d => { let y = +d.slice(0, 4); if (d < `${y}-05-31`) y -= 1; return ndBy[y]; };
const evTrough = fy => ebBy[fy] < 0.5 * Math.max(ebBy[fy - 1], ebBy[fy - 2], ebBy[fy - 3]);
const fwdEvAll = pxW.map(([d, p]) => [d, Math.round((p * sh + ndAt(d)) / ebBy[fyOf(d)] * 10) / 10, evTrough(fyOf(d))]);
const fwdEv = fwdEvAll.filter(x => !x[2]).map(x => [x[0], x[1]]);
const fe = fwdEv.map(x => x[1]);
const FEV = { med: pct(fe, 0.5), medAll: pct(fwdEvAll.map(x => x[1]), 0.5), p25: pct(fe, 0.25), p75: pct(fe, 0.75), troughs: [...new Set(fwdEvAll.filter(x => x[2]).map(x => `FY${String(fyOf(x[0])).slice(2)}`))], now: (mcap + ndBy[2026]) / F.ebitda[1], nowSep: (mcap + ndBy[2026]) / sep(F.ebitda) };

// 6) Sector factor: nine pharma peers' trailing P/E (and EV/EBITDA) at the 30-Sep close vs five-year medians (PLAYBOOK §7c)
const SET = D.peers.set, EXCL = Object.keys(D.peers.excluded).filter(s => s !== 'LAURUSLABS'), CDMO = D.peers.cdmo;
const ALLP = [...SET, 'LAURUSLABS', ...EXCL];
const PEERS = peersAsOf([...new Set([...ALLP, ...CDMO])], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const raw = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
const med5 = (sym, ch, key) => pct((raw(sym).charts?.[ch]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5);
const MED5 = Object.fromEntries(ALLP.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const MED5EV = Object.fromEntries(ALLP.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const derate = Object.fromEntries(ALLP.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const derateEv = Object.fromEntries(ALLP.map(s => [s, P[s].evEbitda && MED5EV[s] ? (P[s].evEbitda / MED5EV[s] - 1) * 100 : null]));
const r1 = x => Math.round(x * 10) / 10;
const sectorDr = medOf(SET.map(s => r1(derate[s]))), sectorDrRaw = medOf(SET.map(s => derate[s])), sectorDrAll = medOf([...SET, ...EXCL].map(s => derate[s]));
const sectorEv = medOf(SET.map(s => r1(derateEv[s]))), sectorEvRaw = medOf(SET.map(s => derateEv[s]));
const K_SET = 1.082; // PLAYBOOK §7c: names outside the set use the median of all nine (+8.2%)
if (Math.abs(sectorDr - 8.2) > 0.05) console.warn(`WARNING: LAURUSLABS sector factor recomputes to ${sectorDr.toFixed(2)}% vs the +8.2% set in PLAYBOOK §7c`);
const K = K_SET, KEV = 1 + sectorEv / 100, ownDr = derate.LAURUSLABS, ownDrEv = derateEv.LAURUSLABS;
const shortName = s => ({ LAURUSLABS: 'Laurus Labs', SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo', ALKEM: 'Alkem', IPCALAB: 'Ipca', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind', NEULANDLAB: 'Neuland Labs', SAILIFE: 'Sai Life Sciences', SYNGENE: 'Syngene', PPLPHARMA: 'Piramal Pharma' }[s] || s);

// 7) Derived multiples (must match assumptions.json) and sensitivity rows
const MULT = { pe: { base: half(EXM.med * K), bull: half(EXM.p75 * K), bear: half(EXM.p25 * K) }, ev: { base: half(FEV.med * K), bull: half(FEV.p75 * K), bear: half(FEV.p25 * K) } };
const evAnalogueBase = half(FEV.med * KEV);
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const mismatch = [];
['pe', 'ev'].forEach(k => ['base', 'bull', 'bear'].forEach(c => { if (Math.abs(mv(k).multiple[c] - MULT[k][c]) > 1e-9) mismatch.push(`${k} ${c} ${mv(k).multiple[c]} vs derived ${MULT[k][c]}`); }));
if (mismatch.length) console.warn('WARNING: assumptions multiples differ from the derivation: ' + mismatch.join('; '));
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult, evMult = mv('ev').mult, ebitdaSep28 = mv('ev').metric;
const SENS = [
  { name: 'House base: median on EPS before exceptional items × sector factor', mult: MULT.pe.base, why: `${n1(EXM.med)}x × ${K} (A18 practice)` },
  { name: 'House forwardMedian on reported EPS', mult: half(FM.median * K), why: `${n1(FM.median)}x × ${K}` },
  { name: 'No trough exclusion (every date since Apr-2021)', mult: half(FM.medianAll * K), why: `${n1(FM.medianAll)}x × ${K}: keeps the FY23-24 dates priced on collapsed EPS` },
  { name: 'Post-bust window only (from Apr-2024)', mult: half(postBustMed * K), why: `${n1(postBustMed)}x × ${K}` },
  { name: 'All 14 other pharma names in the factor', mult: half(EXM.med * (1 + sectorDrAll / 100)), why: `${n1(EXM.med)}x × ${(1 + sectorDrAll / 100).toFixed(3)} (${pc1(sectorDrAll)})` },
  { name: "Blend with Laurus's own re-rating (not house policy)", mult: half(EXM.med * (1 + (sectorDr + ownDr) / 200)), why: `midpoint of ${pc1(sectorDr)} and Laurus's own ${pc1(ownDr)}` },
  { name: 'Growth view: Choice PEG 1.7x on our FY26-29E EPS growth', mult: half(1.7 * cagr(A.eps[b], F.eps[2], 3)), why: `1.7 × ${n1(cagr(A.eps[b], F.eps[2], 3))}% a year (not house policy)` },
  { name: 'Street P/E users (MOSL 65x, BOBCAPS 55x)', mult: 60, why: 'Average of the two disclosed P/E multiples' },
].map(r => ({ ...r, tp: Math.round(r.mult * epsSep28 / 10) * 10, up: (r.mult * epsSep28 / price - 1) * 100 }));
const impliedPeAtPrice = price / epsSep28;

// 8) Reverse-DCF test: same mechanics as src/forecast.js dcf(), with a flat growth rate for FY28-42E
const DC = AS.dcf, t = AS.taxRate[2] / 100, ke = V.ke;
const dcfAt = g => { let s = F.sales[0], pv = 0, last = null; const n = DC.years;
  for (let k = 1; k <= n; k++) { const sF = (k - 3 + 1) / (n - 3 + 1); const m = k < 3 ? F.ebitdaMargin[k] : F.ebitdaMargin[2] + (DC.fadeMarginTo - F.ebitdaMargin[2]) * sF; const cx = k < 3 ? F.capex[k] / F.sales[k] * 100 : F.capex[2] / F.sales[2] * 100 + (DC.fadeCapexPctTo - F.capex[2] / F.sales[2] * 100) * sF;
    s *= 1 + g / 100; const e = s * m / 100, dep = s * DC.depPctOfSales / 100, f = (e - dep) * (1 - t) + dep - s * cx / 100 - F.owcPct / 100 * s * (g / (100 + g)); pv += f / Math.pow(1 + ke / 100, k - 0.5); last = f; }
  const tv = last * (1 + DC.terminalGrowth / 100) / ((ke - DC.terminalGrowth) / 100) / Math.pow(1 + ke / 100, n);
  return (pv + tv + F.treasury[0]) / sh * Math.pow(1 + ke / 100, 0.5); };
let lo = 0, hi = 60; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (dcfAt(mid) < price) lo = mid; else hi = mid; }
const gNeeded = (lo + hi) / 2, dcfAt15 = dcfAt(15), dcfAt20 = dcfAt(20);

// 9) Rating from the house rule (never typed); street as it stood on 30-Sep-2026
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, br = n => ST.find(s => s.broker === n);
const postQ1 = ST.filter(s => s.date >= '2026-07-24');
const medTp = medOf(postQ1.map(s => s.tp)), avgTp = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length;
const withEps = postQ1.filter(s => s.eps && s.eps.FY27E && s.eps.FY28E), avgEps = y => withEps.reduce((s, x) => s + x.eps[y], 0) / withEps.length;
const nBuy = postQ1.filter(s => /^(Buy|Add|Accumulate)$/.test(s.rating)).length, nHold = postQ1.filter(s => /Hold|Neutral/.test(s.rating)).length, nSell = postQ1.filter(s => /Sell|Reduce/.test(s.rating)).length;
const aboveCmp = postQ1.filter(s => s.tp >= price).length, tpAbove = postQ1.filter(s => s.tp > price).length;

// 10) Growth, returns and capital intensity
const epsCagrFwd = cagr(A.eps[b], F.eps[2], 3), salesCagr10 = cagr(A.sales[ai('FY16')], A.sales[b], 10), salesCagr6 = cagr(A.sales[ai('FY20')], A.sales[b], 6);
const capexPct26 = A.capex[b] / A.sales[b] * 100;
const capex5 = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].reduce((s, y) => s + A.capex[ai(y)], 0), cfo5 = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].reduce((s, y) => s + A.cfo[ai(y)], 0);
const assetTurn = fy => A.sales[ai(fy)] / A.grossBlock[ai(fy)];
const divYield = F.dps[0] / price * 100;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, cagr, pct, medOf, shortDate, SRC, b, ai, price, sh, mcap, sep, YRS,
  SA, SQ, QL, Q1, FY26, BL, KEYS, LINES, buildTot, cdmoShare, amTot, OIN, OI_BUILD, oiExFx26, ttmOi, LEASES, KD, OTHER_FIN, loans, intBuild, netDebtCo, lev,
  FM, FMS, EXM, exSeries, epsRep, epsExc, EXC_AT, FYMED, FYMED_ALL, postBustMed, boomMed, fwdPe, fwdNow, peFY27, peSep, peTrail, FY21EPS, FY22EPS, FY23EPS, FY24EPS, FY25EPS, fyOf,
  fwdEv, FEV, SET, EXCL, CDMO, ALLP, PEERS, P, MED5, MED5EV, derate, derateEv, r1, sectorDr, sectorDrRaw, sectorDrAll, sectorEv, sectorEvRaw, K, KEV, ownDr, ownDrEv, shortName,
  MULT, evAnalogueBase, BM, mv, epsSep28, peMult, evMult, ebitdaSep28, SENS, impliedPeAtPrice, gNeeded, dcfAt15, dcfAt20,
  rating, ruleText, buyBelow, sellAbove, ST, br, postQ1, medTp, avgTp, withEps, avgEps, nBuy, nHold, nSell, aboveCmp, tpAbove,
  epsCagrFwd, salesCagr10, salesCagr6, capexPct26, capex5, cfo5, assetTurn, divYield };

if (require.main === module) {
  console.log('build', buildTot.map(n0), 'model', F.sales, 'CDMO share', YRS.map((_, i) => n1(cdmoShare(i))));
  console.log('OI build', OI_BUILD.map(x => x.total), 'interest build', intBuild.map(n0), 'vs', AS.interest, 'loans', loans.map(n0), 'ND/EBITDA', lev.map(x => x.toFixed(2)));
  console.log('FM rep', FM.median, FM.medianAll, FM.troughYears, FMS, '| pre-exc', EXM, '| byFY', FYMED, 'all', FYMED_ALL, 'postBust', postBustMed, 'boom', boomMed);
  console.log('EV', FEV, 'sector P/E', sectorDr, sectorDrRaw.toFixed(3), 'all14', sectorDrAll.toFixed(2), '| EV', sectorEv, sectorEvRaw.toFixed(3), 'own', ownDr.toFixed(1), ownDrEv.toFixed(1));
  console.log('MULT', JSON.stringify(MULT), 'evAnalogue', evAnalogueBase, 'mismatch', mismatch);
  console.log('SENS', SENS.map(r => `${r.name}: ${r.mult}x ${r.tp}`).join(' | '));
  console.log('TP', V.tp, V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'bull', SC.bull.tp, 'bear', SC.bear.tp, 'gNeeded', gNeeded.toFixed(1), 'dcf@15', Math.round(dcfAt15), 'dcf@20', Math.round(dcfAt20), 'engine dcf', V.intrinsicTp);
  console.log('street', postQ1.length, 'med', medTp, 'avg', Math.round(avgTp), nBuy, nHold, nSell, 'above CMP', aboveCmp, 'avgEps', n1(avgEps('FY27E')), n1(avgEps('FY28E')), 'implied P/E at price', n1(impliedPeAtPrice), 'fwd now', n1(fwdNow), n1(peFY27), n1(peSep), n1(peTrail));
}
