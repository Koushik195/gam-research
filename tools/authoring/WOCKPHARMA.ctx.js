// Wockhardt initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and the built
// model; checks the regional + Zaynich build against model revenue and EBITDA and the other-income build against the engine;
// restates EPS before exceptional items; derives the P/E multiple under the PLAYBOOK §7c turnaround rule (own one-year-forward
// P/E from the earnings break, 1-Oct-2025, on all weekly closes, x the nine pharma peers' P/E move over the same window,
// +17.2%, nearest half-turn) and the EV/EBITDA cross-check the same way (+6.7%); computes the since-2021 and 1-Apr-2025
// sensitivities, the street table and the rating. Zaynich NPV and other sensitivities are in WOCKPHARMA.ctx2.js.
// Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'WOCKPHARMA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'WOCKPHARMA.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'WOCKPHARMA', 'screener.json'), 'utf8')); // unpatched, unfrozen
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', BREAK = '2025-10-01', ALT = '2025-04-01', FROM21 = '2021-04-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const pctl = (arr, p) => { const s = arr.slice().sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const statOf = arr => ({ med: pctl(arr, 0.5), p25: pctl(arr, 0.25), p75: pctl(arr, 0.75), min: Math.min(...arr), max: Math.max(...arr), n: arr.length });
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26;
const b = A.labels.length - 1, ix = fy => A.labels.indexOf(fy), YRS = F.years;
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const peMult = mv('pe').mult, epsSep28 = mv('pe').metric, evMult = mv('ev').mult, ebitdaSep28 = mv('ev').metric;
if (Math.abs(price - 2116.3) > 0.01) throw new Error(`WOCKPHARMA price ${price} is not the 30-Sep close`);

// 1) Build: regions + Zaynich must equal model revenue and EBITDA (single-segment engine, PLAYBOOK §7)
const BL = AS.businessLines, LK = ['uk', 'europe', 'indiaBranded', 'indiaOthers', 'em', 'zaynich'];
const LBL = { uk: 'UK (CP Pharma, Wockhardt UK)', europe: 'Ireland and Europe', indiaBranded: 'India branded', indiaOthers: 'India others', em: 'Emerging markets', zaynich: 'Zaynich (all markets)' };
const lines = Object.fromEntries(LK.map(k => [k, []])), zParts = { india: [], us: [], euEm: [] };
{ let ib = BL.base.indiaBranded, em = BL.base.em; YRS.forEach((_, i) => {
  ib *= 1 + BL.growth.indiaBranded[i] / 100; em *= 1 + BL.growth.em[i] / 100;
  const z = BL.zaynich, zi = z.indiaCr[i], zu = z.usUsdMn[i] * z.usdInr[i] / 10, ze = z.euEmCr[i];
  zParts.india.push(zi); zParts.us.push(zu); zParts.euEm.push(ze);
  const v = { uk: BL.ukGbpMn[i] * BL.gbpInr[i] / 10, europe: BL.europeEurMn[i] * BL.eurInr[i] / 10, indiaBranded: ib, indiaOthers: BL.indiaOthers[i], em, zaynich: zi + zu + ze };
  LK.forEach(k => lines[k].push(v[k])); }); }
const blTot = YRS.map((_, i) => LK.reduce((s, k) => s + lines[k][i], 0));
blTot.forEach((t, i) => { if (Math.abs(t / F.sales[i] - 1) > 0.002) throw new Error(`WOCKPHARMA build ${YRS[i]}: ${n0(t)} != model revenue ${n0(F.sales[i])}`); });
if (Math.abs(LK.reduce((s, k) => s + BL.base[k], 0) - A.sales[b]) > 1) throw new Error('WOCKPHARMA regional base does not sum to FY26 revenue');
const baseRev = YRS.map((_, i) => blTot[i] - lines.zaynich[i]);
const baseEbitda = YRS.map((_, i) => baseRev[i] * BL.margin.baseMarginPct[i] / 100), zEbitda = BL.margin.zaynichEbitda;
YRS.forEach((y, i) => { if (Math.abs(baseEbitda[i] + zEbitda[i] - F.ebitda[i]) > 3) throw new Error(`WOCKPHARMA EBITDA build ${y}: ${n0(baseEbitda[i] + zEbitda[i])} != model ${n0(F.ebitda[i])}`); });
const share = (k, i) => lines[k][i] / blTot[i] * 100;

// 2) Other income build (AR FY26 note 28): recurring base FY25 Rs59 cr, FY26 Rs56 cr; FY27E = Q1 actual + 3 x run-rate
const OIN = FY26.otherIncome, REC26 = OIN.interestIncome + OIN.writeBacks + (OIN.otherNonOperating - OIN.writeBacks - OIN.assetSaleProfit);
const REC25 = OIN.fy25.interestIncome + OIN.fy25.writeBacks + (OIN.fy25.otherNonOperating - OIN.fy25.writeBacks - OIN.fy25.assetSaleProfit);
const RUNQ = (REC25 + REC26) / 2 / 4, OI_BUILD = [Math.round(Q1.screener.otherIncome + 3 * RUNQ), 60, 62];
YRS.forEach((y, i) => { if (Math.abs(OI_BUILD[i] - AS.otherIncome[i]) > 1) throw new Error(`WOCKPHARMA other income ${y}: build ${OI_BUILD[i]} vs input ${AS.otherIncome[i]}`); if (Math.abs(F.otherIncome[i] - AS.otherIncome[i]) > 1) throw new Error(`WOCKPHARMA engine other income ${y} != input (net cash should be negative)`); });
const oiSched = S.schedules.quarters['Other Income']['Other income normal'];
const ttmOi = ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026'].reduce((s, p) => s + oiSched[p], 0);

// 3) EPS: reported (patched model = attributable) and before exceptional items (Screener "Profit for PE" = attributable
//    profit excluding exceptional items, divided by that year's share count implied by the patched model)
const pl = S.tables['profit-loss'], PFPE = S.schedules['profit-loss']['Net Profit']['Profit for PE'];
const epsRep = {}, epsExc = {}, sharesBy = {};
A.labels.forEach((l, i) => { const y = 2000 + +l.slice(2); epsRep[y] = A.eps[i]; sharesBy[y] = A.shares[i]; if (PFPE[`Mar ${y}`] != null) epsExc[y] = PFPE[`Mar ${y}`] / A.shares[i]; });
YRS.forEach((y, i) => { const k = 2000 + +y.slice(2, 4); epsRep[k] = F.eps[i]; epsExc[k] = F.eps[i]; });
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; }; // next full fiscal year
const trough = (by, fy) => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); const pk = prev.length ? Math.max(...prev) : null; return !(by[fy] > 0) || (pk > 0 && by[fy] < 0.5 * pk); };
const WEEKLY = S.charts.price.Price.filter(([d]) => d <= ASOF);
const fwdOn = (by, from, grid = WEEKLY) => grid.filter(([d]) => d >= from).map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10, fyOf(d)]);
// (a) Turnaround window from the break, all weekly closes (short window: PLAYBOOK §7b note, HDBFS/CHOLAFIN/ANTHEM practice)
const winAll = fwdOn(epsExc, BREAK), win = winAll.filter(x => !trough(epsExc, x[2]));
if (win.length !== winAll.length) throw new Error('WOCKPHARMA: a trough year inside the turnaround window');
const OWN = statOf(win.map(x => x[1]));
const byFwd = fy => statOf(win.filter(x => x[2] === fy).map(x => x[1]));
const OWN27 = byFwd(2027), OWN28 = byFwd(2028);
// (b) Same from 1-Apr-2025 (sensitivity); (c) since Apr-2021 on the house grid (every 5th weekly close), EPS before
//     exceptional items, trough years left out; (d) the house forwardMedian on reported EPS
const ALTW = statOf(fwdOn(epsExc, ALT).filter(x => !trough(epsExc, x[2])).map(x => x[1]));
const GRID5 = WEEKLY.filter((_, i) => i % 5 === 0);
const all21 = fwdOn(epsExc, FROM21, GRID5), kept21 = all21.filter(x => !trough(epsExc, x[2]));
const S21 = statOf(kept21.map(x => x[1])), TROUGH21 = [...new Set(all21.filter(x => trough(epsExc, x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const FY26PTS = statOf(kept21.filter(x => x[2] === 2026).map(x => x[1]));
const FM = forwardMedian('WOCKPHARMA', M);
const fwdNow27 = price / F.eps[0], fwdNow28 = price / F.eps[1], peSep28 = price / epsSep28;
const ttmEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), peTtm = price / ttmEps;

// 4) Sector factors: nine pharma peers' trailing multiple at the 30-Sep close vs their own median over the same window
//    (sector-factor.js method: weekly Screener series, positive points, current scaled to the NSE close)
const PEER_SET = D.peers.set, EXCL = Object.keys(D.peers.excluded);
const PEERS = peersAsOf([...PEER_SET, ...EXCL, 'WOCKPHARMA'], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const ld = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const medFrom = (s, ch, k, from) => medOf((ld(s).charts?.[ch]?.[k] || []).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const moveTab = (from, metric) => PEER_SET.map(s => { const m = metric === 'pe' ? medFrom(s, 'pe', 'Price to Earning', from) : medFrom(s, 'evEbitda', 'EV Multiple', from); const cur = metric === 'pe' ? P[s].pe : P[s].evEbitda; return { s, cur, med: m, move: (cur / m - 1) * 100 }; });
const PEW = moveTab(BREAK, 'pe'), EVW = moveTab(BREAK, 'ev'), PEA = moveTab(ALT, 'pe'), PE5 = moveTab('2021-09-30', 'pe');
const facPe = medOf(PEW.map(r => r.move)), facEv = medOf(EVW.map(r => r.move)), facAlt = medOf(PEA.map(r => r.move)), fac5 = medOf(PE5.map(r => r.move));
const FAC = { pe: 17.2, ev: 6.7, alt: 17.3, five: 8.2 }; // published factors (PLAYBOOK §7c / brief); reproduction checked below
[['pe', facPe], ['ev', facEv], ['alt', facAlt], ['five', fac5]].forEach(([k, v]) => { if (Math.abs(+v.toFixed(1) - FAC[k]) > 0.051) throw new Error(`WOCKPHARMA sector factor ${k}: reproduced ${v.toFixed(2)}% vs published ${FAC[k]}%`); });
const k = 1 + FAC.pe / 100, kev = 1 + FAC.ev / 100;
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo', ALKEM: 'Alkem', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', DRREDDY: "Dr Reddy's", WOCKPHARMA: 'Wockhardt' }[s] || s);

// 5) Multiples (derived, never tuned): base = median x factor; bull = 75th percentile x factor; bear = 25th x factor
const derived = OWN.med * k;
const MULT = { base: half(OWN.med * k), bull: half(OWN.p75 * k), bear: half(OWN.p25 * k) };
const SENS = { since21: half(S21.med * (1 + FAC.five / 100)), since21rep: half(FM.median * (1 + FAC.five / 100)), alt: half(ALTW.med * (1 + FAC.alt / 100)), noFactor: half(OWN.med) };
const val = (m, e = epsSep28) => Math.round(m * e / 10) * 10;

// 6) EV/EBITDA cross-check: own one-year-forward EV/EBITDA from the break (all weekly closes). EV = price x 16.25 cr shares
//    + net debt on the model's definition (borrowings - cash - investments + Bio AG minority - net deferred tax - assets held
//    for sale) at the latest March reported by then (Mar-25 until 29-May-26, then Mar-26); forward EBITDA = FY27E / FY28E.
const ND = { 2025: 2021 - 191 - 422 + 304 - (549 - 35) - 104, 2026: -(A.cash[b] + A.investments[b] + AS.otherTreasury.base - A.borrowings[b]) };
const ebBy = {}; YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const evWin = WEEKLY.filter(([d]) => d >= BREAK).map(([d, p]) => [d, Math.round((p * SHARES + (d >= '2026-05-30' ? ND[2026] : ND[2025])) / ebBy[fyOf(d)] * 10) / 10, fyOf(d)]);
const HEV = statOf(evWin.map(x => x[1]));
const EVM = { base: half(HEV.med * kev), bull: half(HEV.p75 * kev), bear: half(HEV.p25 * kev) };
const netDebt26 = ND[2026], evNow = mcap + netDebt26, evFy27 = evNow / F.ebitda[0], evFy28 = evNow / F.ebitda[1];

// 7) Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// 8) Street as it stood on 30-Sep-2026
const ST = D.street.brokers;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, BREAK, ALT, FROM21, n0, n1, pc, pc1, half, shortDate, pctl, medOf, statOf, SA, SQ, QL, Q1, FY26, b, ix, YRS,
  price, SHARES, mcap, sep, BM, mv, peMult, epsSep28, evMult, ebitdaSep28, BL, LK, LBL, lines, zParts, blTot, baseRev, baseEbitda, zEbitda, share,
  OIN, REC25, REC26, RUNQ, OI_BUILD, ttmOi, epsRep, epsExc, sharesBy, fyOf, trough, WEEKLY, win, OWN, OWN27, OWN28, ALTW, S21, TROUGH21, FY26PTS, FM, fwdNow27, fwdNow28, peSep28, ttmEps, peTtm,
  PEER_SET, EXCL, PEERS, P, PEW, EVW, PEA, PE5, facPe, facEv, facAlt, fac5, FAC, k, kev, shortName, derived, MULT, SENS, val, ND, evWin, HEV, EVM, netDebt26, evNow, evFy27, evFy28,
  rating, ruleText, buyBelow, sellAbove, ST };

if (require.main === module) {
  console.log('build', blTot.map(n0), 'model', F.sales, '| base', baseRev.map(n0), 'zaynich', lines.zaynich.map(n0), '| EBITDA base', baseEbitda.map(n0), 'z', zEbitda);
  console.log('OI rec25', REC25, 'rec26', REC26, 'runQ', RUNQ, 'build', OI_BUILD, 'ttm', ttmOi);
  console.log('epsExc', Object.fromEntries(Object.entries(epsExc).filter(([y]) => y >= 2020).map(([y, v]) => [y, n1(v)])));
  console.log('OWN', JSON.stringify(OWN), 'FY27pts', JSON.stringify(OWN27), 'FY28pts', JSON.stringify(OWN28), '| ALT', JSON.stringify(ALTW));
  console.log('S21', JSON.stringify(S21), 'troughs', TROUGH21, 'FY26-fwd pts', JSON.stringify(FY26PTS), '| FM rep', FM.median, FM.medianAll, FM.troughYears);
  console.log('factors', facPe.toFixed(2), facEv.toFixed(2), facAlt.toFixed(2), fac5.toFixed(2), '| MULT', MULT, 'derived', n1(derived), 'SENS', SENS);
  console.log('EV hist', JSON.stringify(HEV), 'EVM', EVM, 'ND', ND, 'evNow FY27/28', n1(evFy27), n1(evFy28));
  console.log('PE now FY27/FY28/Sep28', n1(fwdNow27), n1(fwdNow28), n1(peSep28), 'ttm', n1(peTtm), '| TP', V.tp, n1(V.upside), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'scen', SC.bull.tp, SC.bear.tp);
}
