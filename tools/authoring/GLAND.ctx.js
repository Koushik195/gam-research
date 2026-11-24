// Gland Pharma initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and the
// built model and computes, once: the two-line build (base business and Cenexi; revenue and EBITDA checked against the
// model), the other-income build (checked against assumptions), the forward P/E history (house forwardMedian since
// Apr-2021 and from the Cenexi completion on 27-Apr-2023, which is the base window so that history and forecast EPS are
// both Gland-plus-Cenexi; variants before exceptional items, on all weekly closes, from Apr-2024), the forward EV/EBITDA
// history, the pharma sector factor peer by peer over five years (PLAYBOOK 7c: +8.2% P/E, +7.5% EV/EBITDA for names
// outside the nine-peer set) and over the same window as the base (computed here), the derived multiples, sensitivity
// rows, a reverse-DCF test and the street as it stood on 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'GLAND', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'GLAND.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'GLAND', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', ACQ = '2023-04-27', ACQ_TXT = '27-Apr-2023', W24 = '2024-04-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?(?=[0-9])/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK 7c: nearest half-turn
const cagr = (a, z, y) => (Math.pow(z / a, 1 / y) - 1) * 100;
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const r1 = x => Math.round(x * 10) / 10;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SRC = 'Gland Pharma annual reports, investor presentations and earnings calls; Screener.in (consolidated); GAM Research';
const b = A.labels.length - 1; // FY26 index
const ai = fy => A.labels.indexOf(fy);
const price = M.price.last, sh = F.shares, mcap = price * sh;
const SA = SG.annual, SQ = SG.quarterly, Q1 = C.q1fy27, FY26 = C.fy26;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const YRS = F.years;

// 1) Two-line build (assumptions.businessLines): revenue and EBITDA must equal the model's
const BL = AS.businessLines, KEYS = ['base', 'cenexi'];
const LINES = Object.fromEntries(KEYS.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const LEB = Object.fromEntries(KEYS.map(k => [k, LINES[k].map((x, i) => x * BL.ebitdaMargin[k][i] / 100)]));
const buildTot = YRS.map((_, i) => KEYS.reduce((s, k) => s + LINES[k][i], 0));
const buildEb = YRS.map((_, i) => KEYS.reduce((s, k) => s + LEB[k][i], 0));
if (Math.abs(BL.base.base + BL.base.cenexi - A.sales[b]) > 1) throw new Error('GLAND build base does not sum to FY26 revenue');
YRS.forEach((y, i) => {
  if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`GLAND revenue build off model in ${y}: ${n0(buildTot[i])} vs ${n0(F.sales[i])}`);
  if (Math.abs(buildEb[i] / F.ebitda[i] - 1) > 0.005) throw new Error(`GLAND EBITDA build off model in ${y}: ${n0(buildEb[i])} vs ${n0(F.ebitda[i])}`);
});
const cenexiShare = i => LINES.cenexi[i] / buildTot[i] * 100;
const HB = SA.map(a => ({ fy: a.fy, base: a.baseRev / 10, cenexi: a.cenexiRev / 10, baseEb: a.baseEbitda / 10, cenexiEb: a.cenexiEbitda / 10, eur: a.cenexiEur }));

// 2) Other-income build (sourced parts) and reconciliation
const OIN = C.otherIncomeNote, BORR = A.borrowings[b], MISC = 15;
const treasOpen = [A.cash[b] + (A.investments[b] || 0) - BORR, F.treasury[0], F.treasury[1]];
const OI_BUILD = YRS.map((_, i) => { const y = AS.treasuryYield[i] / 100; return { treasury: y * treasOpen[i], grossUp: y * BORR, misc: MISC }; }).map(x => ({ ...x, total: x.treasury + x.grossUp + x.misc }));
YRS.forEach((yr, i) => {
  if (Math.abs(OI_BUILD[i].grossUp + OI_BUILD[i].misc - AS.otherIncome[i]) > 1) throw new Error(`GLAND non-treasury other income ${yr}: build ${n1(OI_BUILD[i].grossUp + OI_BUILD[i].misc)} vs ${AS.otherIncome[i]}`);
  if (Math.abs(OI_BUILD[i].total - F.otherIncome[i]) > 1.5) throw new Error(`GLAND other income ${yr}: build ${n1(OI_BUILD[i].total)} vs model ${F.otherIncome[i]}`);
});
const oiExFx26 = OIN.FY26.total - OIN.FY26.forex, oiExFx25 = OIN.FY25.total - OIN.FY25.forex;
const QOI = OIN.quarterlyOtherIncomeCompany, ttmOiCo = QOI.Q2FY26 + QOI.Q3FY26 + QOI.Q4FY26 + QOI.Q1FY27;
const ttmFx = OIN.quarterlyForex.Q2Q3FY26 + OIN.quarterlyForex.Q4FY26, ttmOiExFx = ttmOiCo - ttmFx;
const avgCash26 = (OIN.grossCash['Mar-25'] + OIN.grossCash['Mar-26']) / 2, yield26 = (OIN.FY26.interestDeposits + OIN.FY26.interestOther) / avgCash26 * 100;

// 3) Forward P/E: house forwardMedian since Apr-2021 and from the Cenexi completion; variants
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const stat = v => ({ med: pct(v, 0.5), p25: pct(v, 0.25), p75: pct(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length });
const FM21 = forwardMedian('GLAND', M), FMA = forwardMedian('GLAND', M, { from: ACQ }), FM24 = forwardMedian('GLAND', M, { from: W24 });
const FMS = stat(FMA.series.map(x => x[1])), FMS21 = stat(FM21.series.map(x => x[1])), FMS24 = stat(FM24.series.map(x => x[1]));
const pl = S.tables['profit-loss'], ns = S.schedules['profit-loss']['Net Profit'];
const epsRep = {}, epsExc = {}, EXC_AT = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4), e = pl.rows['EPS in Rs'][i], ex = ns['Exceptional items AT'][p] || 0, pfe = ns['Profit for EPS'][p]; epsRep[y] = e; epsExc[y] = pfe ? e - ex / (pfe / e) : e; EXC_AT[y] = ex; } });
YRS.forEach((y, i) => { const fy = 2000 + +y.slice(2, 4); epsRep[fy] = F.eps[i]; epsExc[fy] = F.eps[i]; }); // forecasts carry no exceptionals
const s5dates = new Set(forwardSeries('GLAND', M, 'eps').map(x => x[0]));
const pxAll = S.charts.price.Price.filter(([d]) => d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const px5 = pxAll.filter(([d]) => s5dates.has(d));
const serOn = (arr, from, by) => arr.filter(([d]) => d >= from).map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10]);
const EXA = stat(serOn(px5, ACQ, epsExc).map(x => x[1])), EX21 = stat(serOn(px5, '2021-04-01', epsExc).map(x => x[1]));
const WKA = stat(serOn(pxAll, ACQ, epsRep).map(x => x[1])), WK21 = stat(serOn(pxAll, '2021-04-01', epsRep).map(x => x[1]));
const byFyOf = ser => { const o = {}; ser.forEach(([d, x]) => (o[`FY${String(fyOf(d) - 1).slice(2)}`] ||= []).push(x)); return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, pct(v, 0.5)])); };
const FYMED = byFyOf(FM21.series);
const fwdPe = forwardSeries('GLAND', M, 'eps').filter(x => x[0] >= '2021-01-01');
const fwdNow = price / F.eps[1], peFY27 = price / F.eps[0], peSep = price / sep(F.eps), peTrail = price / M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0);
const troughTest = fy => { const prev = [epsRep[fy - 1], epsRep[fy - 2], epsRep[fy - 3]]; return { eps: epsRep[fy], half: Math.max(...prev) / 2 }; };
const TR25 = troughTest(2025);
const excPct26 = Math.abs(EXC_AT[2026]) / (epsRep[2026] * sh) * 100, excPct23 = Math.abs(EXC_AT[2023]) / (epsRep[2023] * sh) * 100;

// 4) Forward EV/EBITDA (EV at the weekly close with net debt at the latest March published by end-May / next FY EBITDA)
const ebBy = {}, ndBy = {};
A.labels.forEach((l, i) => { const y = 2000 + +l.slice(2, 4); ebBy[y] = A.ebitda[i]; ndBy[y] = (A.borrowings[i] || 0) - (A.cash[i] || 0) - (A.investments[i] || 0); });
YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ndAt = d => { let y = +d.slice(0, 4); if (d < `${y}-05-31`) y -= 1; return ndBy[y]; };
const evSer = (arr, from) => arr.filter(([d]) => d >= from).map(([d, p]) => [d, Math.round((p * sh + ndAt(d)) / ebBy[fyOf(d)] * 10) / 10]);
const FEV = { ...stat(evSer(px5, ACQ).map(x => x[1])), now: (mcap + ndBy[2026]) / F.ebitda[1], nowSep: (mcap + ndBy[2026]) / sep(F.ebitda) };
const FEV21 = stat(evSer(px5, '2021-04-01').map(x => x[1]));

// 5) Sector factor: nine pharma peers' trailing P/E (and EV/EBITDA) at the 30-Sep close vs their medians (PLAYBOOK 7c)
const SET = D.peers.set, EXCL = Object.keys(D.peers.excluded), CTX = D.peers.context;
const PEERS = peersAsOf([...new Set([...SET, 'GLAND', ...EXCL, ...CTX])], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const raw = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
const medFrom = (sym, ch, key, from) => pct((raw(sym).charts?.[ch]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= from && x > 0).map(x => x[1]), 0.5);
const factorOver = from => {
  const syms = [...SET, 'GLAND'];
  const med = Object.fromEntries(syms.map(s => [s, medFrom(s, 'pe', 'Price to Earning', from)]));
  const medEv = Object.fromEntries(syms.map(s => [s, medFrom(s, 'evEbitda', 'EV Multiple', from)]));
  const dr = Object.fromEntries(syms.map(s => [s, (P[s].pe / med[s] - 1) * 100]));
  const drEv = Object.fromEntries(syms.map(s => [s, (P[s].evEbitda / medEv[s] - 1) * 100]));
  return { med, medEv, dr, drEv, pe: medOf(SET.map(s => r1(dr[s]))), ev: medOf(SET.map(s => r1(drEv[s]))), peRaw: medOf(SET.map(s => dr[s])) };
};
const F5 = factorOver('2021-09-30'), FW = factorOver(ACQ), F24 = factorOver(W24);
const K5 = 1.082, K5EV = 1.075; // PLAYBOOK 7c (A21): GLAND outside the nine-peer set, five-year
if (Math.abs(F5.pe - 8.2) > 0.05 || Math.abs(F5.ev - 7.5) > 0.05) console.warn(`WARNING: GLAND five-year factor recomputes to ${F5.pe.toFixed(2)}% P/E, ${F5.ev.toFixed(2)}% EV/EBITDA vs +8.2% / +7.5% set in PLAYBOOK 7c`);
const KW = 1 + FW.pe / 100, KWEV = 1 + FW.ev / 100, K24 = 1 + F24.pe / 100; // same-window factors (PLAYBOOK 7c: shorter own window pairs with peers' move over that window)
const ownDr5 = F5.dr.GLAND, ownDrW = FW.dr.GLAND;
const sectorDrAll = medOf([...SET, ...EXCL].map(s => (P[s].pe && medFrom(s, 'pe', 'Price to Earning', '2021-09-30') ? (P[s].pe / medFrom(s, 'pe', 'Price to Earning', '2021-09-30') - 1) * 100 : null)).filter(x => x != null && Number.isFinite(x)));
const shortName = s => ({ GLAND: 'Gland', SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo', ALKEM: 'Alkem', IPCALAB: 'Ipca', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind', CAPLIPOINT: 'Caplin Point', SYNGENE: 'Syngene', SAILIFE: 'Sai Life Sciences', PPLPHARMA: 'Piramal Pharma' }[s] || s);

// 6) Derived multiples (must match assumptions.json) and sensitivity rows
const MULT = { pe: { base: half(FMA.median * KW), bull: half(FMS.p75 * KW), bear: half(FMS.p25 * KW) }, ev: { base: half(FEV.med * KWEV), bull: half(FEV.p75 * KWEV), bear: half(FEV.p25 * KWEV) } };
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const mismatch = [];
['pe', 'ev'].forEach(k => ['base', 'bull', 'bear'].forEach(c => { if (Math.abs(mv(k).multiple[c] - MULT[k][c]) > 1e-9) mismatch.push(`${k} ${c} ${mv(k).multiple[c]} vs derived ${MULT[k][c]}`); }));
if (mismatch.length) console.warn('WARNING: assumptions multiples differ from the derivation: ' + mismatch.join('; '));
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult, evMult = mv('ev').mult, ebitdaSep28 = mv('ev').metric;
const STREET_PE = [30, 33, 27.5, 30], streetPeAvg = STREET_PE.reduce((s, x) => s + x, 0) / STREET_PE.length;
const SENS = [
  { name: 'House base: own median since the Cenexi completion × same-window factor', mult: MULT.pe.base, why: `${n1(FMA.median)}x × ${KW.toFixed(3)} (nine peers' move since ${ACQ_TXT})` },
  { name: 'Same window, every weekly close', mult: half(WKA.med * KW), why: `${n1(WKA.med)}x × ${KW.toFixed(3)} (${WKA.n} closes instead of ${FMS.n})` },
  { name: 'Same window, EPS before exceptional items', mult: half(EXA.med * KW), why: `${n1(EXA.med)}x × ${KW.toFixed(3)}: FY26 Labour Codes charge added back` },
  { name: 'Window from Apr-2024 (Cenexi near breakeven in forward EPS)', mult: half(FM24.median * K24), why: `${n1(FM24.median)}x × ${K24.toFixed(3)} (peers' move since Apr-2024)` },
  { name: 'Since Apr-2021 × five-year factor (mixed basis)', mult: half(FM21.median * K5), why: `${n1(FM21.median)}x × ${K5}: pre-acquisition prices and FY22 dates at ~${Math.round(FYMED.FY22)}x` },
  { name: 'Since Apr-2021 on EPS before exceptional items × five-year factor', mult: half(EX21.med * K5), why: `${n1(EX21.med)}x × ${K5} (FY23 Athenex provision added back)` },
  { name: "Blend with Gland's own re-rating (not house policy)", mult: half(FMA.median * (1 + (FW.pe + ownDrW) / 200)), why: `midpoint of ${pc1(FW.pe)} and Gland's own ${pc1(ownDrW)} since ${ACQ_TXT}` },
  { name: 'Own history only (no sector factor)', mult: half(FMA.median), why: `${n1(FMA.median)}x` },
  { name: 'Street P/E users (MOSL 30x, ICICI Direct 33x, Nomura 27.5x, Equirus 30x)', mult: half(streetPeAvg), why: `Average of the four disclosed multiples (${n1(streetPeAvg)}x), applied to our Sep-28E EPS` },
].map(r => { const tp = Math.round(r.mult * epsSep28 / 10) * 10; return { ...r, tp, up: (tp / price - 1) * 100 }; });
const impliedPeAtPrice = price / epsSep28;

// 7) Reverse-DCF test: same mechanics as src/forecast.js dcf(), with a flat growth rate for FY28-42E
const DC = AS.dcf, tx = AS.taxRate[2] / 100, ke = V.ke;
const dcfAt = g => { let s = F.sales[0], pv = 0, last = null; const n = DC.years;
  for (let k = 1; k <= n; k++) { const sF = (k - 3 + 1) / (n - 3 + 1); const m = k < 3 ? F.ebitdaMargin[k] : F.ebitdaMargin[2] + (DC.fadeMarginTo - F.ebitdaMargin[2]) * sF; const cx = k < 3 ? F.capex[k] / F.sales[k] * 100 : F.capex[2] / F.sales[2] * 100 + (DC.fadeCapexPctTo - F.capex[2] / F.sales[2] * 100) * sF;
    s *= 1 + g / 100; const e = s * m / 100, dep = s * DC.depPctOfSales / 100, f = (e - dep) * (1 - tx) + dep - s * cx / 100 - F.owcPct / 100 * s * (g / (100 + g)); pv += f / Math.pow(1 + ke / 100, k - 0.5); last = f; }
  const tv = last * (1 + DC.terminalGrowth / 100) / ((ke - DC.terminalGrowth) / 100) / Math.pow(1 + ke / 100, n);
  return (pv + tv + F.treasury[0]) / sh * Math.pow(1 + ke / 100, 0.5); };
let lo = 0, hi = 60; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (dcfAt(mid) < price) lo = mid; else hi = mid; }
const gNeeded = (lo + hi) / 2, dcfAt12 = dcfAt(12), dcfAt16 = dcfAt(16);

// 8) Rating from the house rule (never typed); street as it stood on 30-Sep-2026
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, br = n => ST.find(s => s.broker === n);
const postQ1 = ST.filter(s => s.date >= '2026-08-10');
const medTp = medOf(postQ1.map(s => s.tp)), avgTp = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length;
const nBuy = postQ1.filter(s => /^(Buy|Add|Accumulate|Long)$/.test(s.rating)).length, nSell = postQ1.filter(s => /Sell|Reduce/.test(s.rating)).length, nNd = postQ1.filter(s => s.rating === 'n.d.').length;
const tpAbove = postQ1.filter(s => s.tp > price).length;
const idir = br('ICICI Direct'), elara = br('Elara');

// 9) Growth, returns and history
const epsCagrFwd = cagr(A.eps[b], F.eps[2], 3), epsCagr6 = cagr(A.eps[ai('FY20')], A.eps[b], 6), salesCagr6 = cagr(A.sales[ai('FY20')], A.sales[b], 6);
const baseCagr6 = cagr(A.sales[ai('FY20')], HB.find(h => h.fy === 'FY26').base, 6);
const capexPct26 = A.capex[b] / A.sales[b] * 100;
const assetTurn = fy => A.sales[ai(fy)] / A.grossBlock[ai(fy)];
const divYield = F.dps[0] / price * 100;
const cashPctNw = (A.cash[b] - A.borrowings[b]) / A.netWorth[b] * 100;
const pxAt = d => { const s = pxAll.filter(([x]) => x <= d); return s.length ? s.at(-1)[1] : null; };
const px = { mar26: pxAt('2026-03-31'), may15: pxAt('2026-05-15'), jun30: pxAt('2026-06-30'), dec25: pxAt('2025-12-31'), ipo: 1500 };
const ytd = (price / px.dec25 - 1) * 100;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, ACQ, ACQ_TXT, n0, n1, pc, pc1, rup, half, cagr, pct, medOf, r1, shortDate, SRC, b, ai, price, sh, mcap, sep, YRS,
  SA, SQ, Q1, FY26, BL, KEYS, LINES, LEB, buildTot, buildEb, cenexiShare, HB, OIN, BORR, MISC, treasOpen, OI_BUILD, oiExFx26, oiExFx25, ttmOiCo, ttmFx, ttmOiExFx, avgCash26, yield26,
  FM21, FMA, FM24, FMS, FMS21, FMS24, EXA, EX21, WKA, WK21, FYMED, fwdPe, fwdNow, peFY27, peSep, peTrail, epsRep, epsExc, EXC_AT, TR25, excPct26, excPct23, fyOf,
  FEV, FEV21, SET, EXCL, CTX, PEERS, P, F5, FW, F24, K5, K5EV, KW, KWEV, K24, ownDr5, ownDrW, sectorDrAll, shortName,
  MULT, BM, mv, epsSep28, peMult, evMult, ebitdaSep28, STREET_PE, streetPeAvg, SENS, impliedPeAtPrice, gNeeded, dcfAt12, dcfAt16,
  rating, ruleText, buyBelow, sellAbove, ST, br, postQ1, medTp, avgTp, nBuy, nSell, nNd, tpAbove, idir, elara,
  epsCagrFwd, epsCagr6, salesCagr6, baseCagr6, capexPct26, assetTurn, divYield, cashPctNw, px, ytd };

if (require.main === module) {
  console.log('build', buildTot.map(n0), 'model', F.sales, 'EBITDA build', buildEb.map(n0), 'model', F.ebitda, 'Cenexi share', YRS.map((_, i) => n1(cenexiShare(i))));
  console.log('OI build', OI_BUILD.map(x => `${n1(x.treasury)}+${n1(x.grossUp)}+${x.misc}=${n1(x.total)}`), 'model', F.otherIncome, 'FY26 exFx', oiExFx26, 'TTM exFx', n1(ttmOiExFx), 'yield26', n1(yield26));
  console.log('FM21', FM21.median, FM21.medianAll, FM21.troughYears, FMS21, '| FMA', FMA.median, FMA.troughYears, FMS, '| FM24', FM24.median, '| EXA', EXA.med, 'EX21', EX21.med, '| WKA', WKA.med, 'WK21', WK21.med, '| byFY', FYMED);
  console.log('EV', FEV, 'EV21', FEV21.med, '| F5', F5.pe, F5.ev, F5.peRaw.toFixed(2), '| FW', FW.pe, FW.ev, '| F24', F24.pe, '| own', ownDr5.toFixed(1), ownDrW.toFixed(1), 'all14', sectorDrAll.toFixed(2));
  console.log('MULT', JSON.stringify(MULT), 'mismatch', mismatch, 'trough FY25', TR25, 'exc% FY26', n1(excPct26), 'FY23', n1(excPct23));
  console.log('SENS', SENS.map(r => `${r.name}: ${r.mult}x ${r.tp}`).join(' | '));
  console.log('TP', V.tp, V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'bull', SC.bull.tp, 'bear', SC.bear.tp, 'gNeeded', gNeeded.toFixed(1), 'dcf@12', Math.round(dcfAt12), 'dcf@16', Math.round(dcfAt16), 'engine dcf', V.intrinsicTp);
  console.log('street', postQ1.length, 'med', medTp, 'avg', Math.round(avgTp), nBuy, nSell, nNd, 'above CMP', tpAbove, 'fwd now', n1(fwdNow), n1(peFY27), n1(peSep), n1(peTrail), 'px', px, 'ytd', n1(ytd), 'buy<', buyBelow, 'sell>', sellAbove);
}
