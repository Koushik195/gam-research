// Lupin initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and the built
// model, checks the market build against model revenue and the other-income build against the engine, and computes the
// valuation inputs once: the house forward P/E median (forwardMedian, reported EPS, trough years left out), the same median
// on EPS before exceptional items (batch practice A18: the base), medians with the trough year and in the pre-windfall
// window, the pharma P/E and EV/EBITDA sector factors (PLAYBOOK §7c, peersAsOf at the 30-Sep close), the forward EV/EBITDA
// history (cross-check), the D&A sensitivity, street table and rating. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'LUPIN', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'LUPIN.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'LUPIN', 'screener.json'), 'utf8')); // unpatched, unfrozen
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?(?=[0-9])/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const cagr = (a, b, y) => (Math.pow(b / a, 1 / y) - 1) * 100;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, ACC = C.accounting;
const b = A.labels.length - 1; // FY26 index in actuals
const ix = fy => A.labels.indexOf(fy);
const YRS = F.years;
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const peMult = mv('pe').mult, epsSep28 = mv('pe').metric, evMult = mv('ev').mult, ebitdaSep28 = mv('ev').metric;
const pctl = (arr, p) => { const s = arr.slice().sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const statOf = arr => ({ med: pctl(arr, 0.5), p25: pctl(arr, 0.25), p75: pctl(arr, 0.75), min: Math.min(...arr), max: Math.max(...arr), n: arr.length });

// 1) Market build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines, LK = ['us', 'india', 'odm', 'em', 'api', 'otherOp'];
const LBL = { us: 'United States', india: 'India', odm: 'Other developed markets', em: 'Emerging markets', api: 'API', otherOp: 'Other operating income' };
const lines = Object.fromEntries(LK.map(k => [k, []]));
{ const v = { ...BL.base }; YRS.forEach((_, i) => {
  for (const k of ['india', 'odm', 'em', 'api']) v[k] *= 1 + BL.growth[k][i] / 100;
  v.us = BL.usdMn[i] * BL.fx[i] / 10; v.otherOp = BL.otherOp[i];
  for (const k of LK) lines[k].push(v[k]); }); }
const blTot = YRS.map((_, i) => LK.reduce((s, k) => s + lines[k][i], 0));
blTot.forEach((t, i) => { if (Math.abs(t / F.sales[i] - 1) > 0.003) throw new Error(`LUPIN market build ${YRS[i]}: ${n0(t)} != model revenue ${n0(F.sales[i])}`); });
if (Math.abs(LK.reduce((s, k) => s + BL.base[k], 0) - A.sales[b]) > 1) throw new Error('LUPIN market base does not sum to FY26 revenue');
const prodSales = YRS.map((_, i) => blTot[i] - lines.otherOp[i]);
const share = (k, i) => lines[k][i] / prodSales[i] * 100;
const fx26 = FY26.usSalesCr * 10 / FY26.usUsdMn;
const marginOnSales = YRS.map((_, i) => F.ebitda[i] / prodSales[i] * 100); // company basis (on product sales)

// 2) Other income build: yield x opening net cash (engine) + yield x opening gross debt + misc - yield on the VISUfarma payment
const CM = ACC.cashMar26, OI = ACC.otherIncomeFy26;
const grossCash26 = CM.currentInvestments + CM.cash + CM.otherBankBalances + CM.earmarkedDeposits;
const debt26 = CM.borrowingsNonCurrent + CM.borrowingsCurrent + CM.leases;
const netCash26 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - A.borrowings[b];
if (Math.abs(netCash26 - (grossCash26 - debt26)) > 15) throw new Error(`LUPIN opening net cash ${n0(netCash26)} != company basis ${n0(grossCash26 - debt26)}`);
const REPAY = 280, VISU = 1970, MISC = 20, Y = AS.treasuryYield;
const debtOpen = YRS.map((_, i) => debt26 - REPAY * i);
const openCash = YRS.map((_, i) => (i ? F.treasury[i - 1] : netCash26));
const oiNet = YRS.map((_, i) => Y[i] / 100 * openCash[i]);
const oiDebt = YRS.map((_, i) => Y[i] / 100 * debtOpen[i]);
const oiVisu = YRS.map((_, i) => (i ? 0 : -Y[i] / 100 * VISU));
YRS.forEach((y, i) => { const inp = oiDebt[i] + MISC + oiVisu[i]; if (Math.abs(inp - AS.otherIncome[i]) > 1) throw new Error(`LUPIN otherIncome input ${y}: build ${inp.toFixed(1)} vs ${AS.otherIncome[i]}`); if (Math.abs(oiNet[i] + inp - F.otherIncome[i]) > 2) throw new Error(`LUPIN other income ${y}`); });
const treas26 = OI.depositInterest + OI.cpDebentureInterest + OI.mfRealisedGains + OI.mfUnrealisedGains;
const oneOff26 = OI.divestmentGain + OI.assetSaleGain + OI.nonCurrentInvFv;
const grossCash25 = Object.entries(ACC.cashMar25).filter(([k]) => k !== 'src').reduce((s, [, v]) => s + v, 0);
const yield26 = treas26 / ((grossCash25 + grossCash26) / 2) * 100;
const OIN = S.schedules.quarters['Other Income']['Other income normal'];
const ttmOiCompany = 90.0 + 114.7 + 140.7 + Q1.otherIncome; // company other income Q2FY26-Q1FY27 (releases)
const intCheck = YRS.map((_, i) => 0.068 * (debtOpen[i] + debtOpen[i] - REPAY) / 2);
YRS.forEach((y, i) => { if (Math.abs(intCheck[i] / AS.interest[i] - 1) > 0.02) throw new Error(`LUPIN interest ${y}`); });

// 3) D&A: bottom-up vs engine (single rate) and the 7.2% sensitivity
const LIC = [434, 222, 0], BASE_DA = [1443, 1548, 1643], daBottom = YRS.map((_, i) => BASE_DA[i] + LIC[i]);
const gbOpen = YRS.map((_, i) => (i ? F.grossBlock[i - 1] : A.grossBlock[b]));
const avgGb = YRS.map((_, i) => (gbOpen[i] + F.grossBlock[i]) / 2);
const da72 = avgGb.map(g => 0.072 * g);
const epsDelta = (alt, i) => -(alt - F.dep[i]) * (1 - AS.taxRate[i] / 100) / SHARES;
const eps72Sep = sep(F.eps.map((e, i) => e + epsDelta(da72[i], i))), epsBuSep = sep(F.eps.map((e, i) => e + epsDelta(daBottom[i], i)));

// 4) One-year-forward P/E since Apr-2021: house median (reported EPS) and EPS before exceptional items (base, A18)
const FM = forwardMedian('LUPIN', M);
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const pl = S.tables['profit-loss'], epsRep = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) epsRep[+p.slice(-4)] = pl.rows['EPS in Rs'][i]; });
const sh26 = FY26.patOwnersCr / FY26.epsBasic, excAt26 = -FY26.exceptionalCr * (1 - FY26.etrPct / 100);
const epsExc = { ...epsRep, 2026: (FY26.patOwnersCr + excAt26) / sh26 };
YRS.forEach((y, i) => { epsExc[2000 + +y.slice(2, 4)] = F.eps[i]; epsRep[2000 + +y.slice(2, 4)] = F.eps[i]; });
const trough = (by, fy) => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); const pk = Math.max(...prev); return !(by[fy] > 0) || (pk > 0 && by[fy] < 0.5 * pk); };
const pxPts = forwardSeries('LUPIN', M, 'eps').filter(([d]) => d >= '2021-04-01').map(([d, pe]) => [d, pe * (epsRep[fyOf(d)] || 0)]); // same dates/prices as the house series
const RAWPTS = S.charts.price.Price.filter(([d]) => d <= ASOF).concat([[ASOF, price]]).filter((_, i) => i % 5 === 0).filter(([d]) => d >= '2021-04-01');
const allExc = RAWPTS.map(([d, p]) => [d, Math.round(p / epsExc[fyOf(d)] * 10) / 10, fyOf(d)]);
const fwdAdj = allExc.filter(x => !trough(epsExc, x[2])).map(x => [x[0], x[1]]);
const TROUGH = [...new Set(allExc.filter(x => trough(epsExc, x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const HA = statOf(fwdAdj.map(x => x[1])), HALL = statOf(allExc.map(x => x[1])), HR = statOf(FM.series.map(x => x[1]));
const byFwdFy = {}; fwdAdj.forEach(([d, x]) => (byFwdFy[fyOf(d)] ||= []).push(x));
const FWDFY = Object.keys(byFwdFy).sort().map(fy => ({ fy: `FY${String(fy).slice(2)}`, med: pctl(byFwdFy[fy], 0.5), n: byFwdFy[fy].length, eps: epsExc[fy] }));
const troughPe = statOf(allExc.filter(x => trough(epsExc, x[2])).map(x => x[1]));
const PRE = statOf(fwdAdj.filter(([d]) => fyOf(d) === 2024).map(x => x[1])); // forward year FY24: before Mirabegron and Tolvaptan
const fwdPe = forwardSeries('LUPIN', M, 'eps').filter(x => x[0] >= '2016-04-01');
const peFY27 = price / F.eps[0], peFY28 = price / F.eps[1], peSep28 = price / epsSep28;
const ttmEps = A.ttm.eps, peTtm = price / ttmEps;

// 5) Sector factors (PLAYBOOK §7c): nine-peer median of trailing P/E (and EV/EBITDA) at the 30-Sep close vs five-year medians
const PEER_SET = D.peers.set, EXCL = Object.keys(D.peers.excluded), PEER_ALL = [...PEER_SET, ...EXCL];
const PEERS = peersAsOf(PEER_ALL, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const ld = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const med5 = (s, ch, k) => pctl((ld(s).charts?.[ch]?.[k] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5);
const MED5 = Object.fromEntries(PEER_ALL.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const MED5EV = Object.fromEntries(PEER_ALL.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const derate = Object.fromEntries(PEER_ALL.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const derateEv = Object.fromEntries(PEER_ALL.map(s => [s, P[s].evEbitda && MED5EV[s] ? (P[s].evEbitda / MED5EV[s] - 1) * 100 : null]));
const sectorDrCalc = medOf(PEER_SET.map(s => derate[s])), sectorDrAll = medOf(PEER_ALL.filter(s => s !== 'LUPIN').map(s => derate[s]));
const sectorEv = medOf(PEER_SET.map(s => derateEv[s])), sectorEvAll = medOf(PEER_ALL.filter(s => s !== 'LUPIN').map(s => derateEv[s]));
const SECTOR_DR = 8.2, k = 1 + SECTOR_DR / 100, kev = 1 + sectorEv / 100; // P/E factor set in PLAYBOOK §7c; reproduction in sectorDrCalc
if (Math.abs(sectorDrCalc - SECTOR_DR) > 0.05) throw new Error(`LUPIN sector factor ${sectorDrCalc.toFixed(2)}% differs from the PLAYBOOK +8.2%`);
const LARGE = ['SUNPHARMA', 'DIVISLAB', 'TORNTPHARM', 'ZYDUSLIFE', 'CIPLA'], sectorDrLarge = medOf(LARGE.map(s => derate[s]));
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo', ALKEM: 'Alkem', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind' }[s] || s);

// 6) Multiple: derived and checked against assumptions (no tuning)
const derived = HA.med * k;
const PEM = AS.valuation.blend.methods.find(m => m.key === 'pe').multiple;
const MULT = { base: half(HA.med * k), bull: half(HA.p75 * k), bear: half(HA.p25 * k) };
if (!process.env.TP_NOCHECK) ["base", "bull", "bear"].forEach(c => { if (MULT[c] !== PEM[c]) throw new Error(`LUPIN P/E ${c} multiple ${PEM[c]} != derived ${MULT[c]}`); });
const SENS = { reported: half(FM.median * k), all: half(HALL.med * k), pre: half(PRE.med * k), own: half(HA.med * (1 + derate.LUPIN / 100)), allPeers: half(HA.med * (1 + sectorDrAll / 100)), large: half(HA.med * (1 + sectorDrLarge / 100)) };
const val = (m, e = epsSep28) => Math.round(m * e / 10) * 10;
const roeSus = F.roe[2], gSus = 7, keV = V.ke, justPe = (1 - gSus / roeSus) / ((keV - gSus) / 100);

// 7) One-year-forward EV/EBITDA since Apr-2021 (cross-check): EV = price x shares + Screener net debt at the latest March
const bs = S.tables['balance-sheet'], ebBy = {}, shBy = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4); ebBy[y] = pl.rows['Operating Profit'][i]; shBy[y] = S.schedules['profit-loss']['Net Profit']['Profit for EPS'][p] / pl.rows['EPS in Rs'][i]; } });
YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ndFy = fy => { const j = bs.periods.indexOf(`Mar ${fy}`); return bs.rows.Borrowings[j] - (S.schedules['balance-sheet']['Other Assets']['Cash Equivalents'][`Mar ${fy}`] || 0) - bs.rows.Investments[j]; };
const evAll = RAWPTS.map(([d, p]) => { let fyBs = +d.slice(0, 4); if (d < `${fyBs}-05-31`) fyBs -= 1; const f = fyOf(d); return [d, Math.round((p * shBy[Math.min(fyBs, 2026)] + ndFy(fyBs)) / ebBy[f] * 10) / 10, f]; });
const troughEv = fy => { const pk = Math.max(ebBy[fy - 1], ebBy[fy - 2], ebBy[fy - 3]); return !(ebBy[fy] > 0) || ebBy[fy] < 0.5 * pk; };
const fwdEv = evAll.filter(x => !troughEv(x[2])).map(x => [x[0], x[1]]);
const HEV = statOf(fwdEv.map(x => x[1]));
const EVM = { base: half(HEV.med * kev), bull: half(HEV.p75 * kev), bear: half(HEV.p25 * kev) };
const EVA = AS.valuation.blend.methods.find(m => m.key === 'ev').multiple;
if (!process.env.TP_NOCHECK) ["base", "bull", "bear"].forEach(c => { if (EVM[c] !== EVA[c]) throw new Error(`LUPIN EV/EBITDA ${c} multiple ${EVA[c]} != derived ${EVM[c]}`); });
const evNow = mcap - netCash26, evFy28 = evNow / F.ebitda[1], evFy27 = evNow / F.ebitda[0];

// 8) Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const sellLineTp = Math.round(price * 0.95); // target below this = SELL
const epsCagrFwd = cagr(epsExc[2026], F.eps[2], 3), epsCagrHist = cagr(epsRep[2021], epsExc[2026], 5);

// 9) Street as it stood on 30-Sep-2026
const ST = D.street.brokers, br = n => ST.find(s => s.broker === n);
const mosl = br('Motilal Oswal'), pl_ = br('Prabhudas Lilladher'), emkay = br('Emkay Global'), bob = br('BOB Capital Markets');
const postQ1 = ST.filter(s => s.date >= '2026-08-06' && s.tp);
const avgTp = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length, medTp = medOf(postQ1.map(s => s.tp));
const tpLo = Math.min(...postQ1.map(s => s.tp)), tpHi = Math.max(...postQ1.map(s => s.tp));
const buys = postQ1.filter(s => /Buy|Add|Accumulate|Outperform/.test(s.rating)).length, sells = postQ1.filter(s => /Sell/.test(s.rating)).length;
const CONS = { FY27E: 101, FY28E: 103 };

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, cagr, shortDate, SA, SQ, QL, Q1, FY26, ACC, b, ix, YRS,
  price, SHARES, mcap, sep, BM, mv, peMult, epsSep28, evMult, ebitdaSep28, pctl, medOf, BL, LK, LBL, lines, blTot, prodSales, share, fx26, marginOnSales,
  grossCash26, debt26, netCash26, REPAY, VISU, MISC, debtOpen, openCash, oiNet, oiDebt, oiVisu, treas26, oneOff26, grossCash25, yield26, ttmOiCompany, OI,
  LIC, BASE_DA, daBottom, da72, eps72Sep, epsBuSep, FM, fyOf, epsRep, epsExc, excAt26, allExc, fwdAdj, TROUGH, HA, HALL, HR, FWDFY, troughPe, PRE, fwdPe, peFY27, peFY28, peSep28, ttmEps, peTtm,
  PEER_SET, EXCL, PEER_ALL, PEERS, P, MED5, MED5EV, derate, derateEv, sectorDrCalc, sectorDrAll, sectorEv, sectorEvAll, SECTOR_DR, k, kev, LARGE, sectorDrLarge, shortName,
  derived, MULT, SENS, val, roeSus, gSus, keV, justPe, fwdEv, evAll, HEV, EVM, evNow, evFy28, evFy27, rating, ruleText, buyBelow, sellAbove, sellLineTp, epsCagrFwd, epsCagrHist,
  ST, br, mosl, pl_, emkay, bob, postQ1, avgTp, medTp, tpLo, tpHi, buys, sells, CONS };

if (require.main === module) {
  console.log('build', blTot.map(n0), 'model', F.sales, '| margin on sales', marginOnSales.map(n1));
  console.log('net cash26', n0(netCash26), 'gross', n0(grossCash26), 'debt', n0(debt26), '| OI', F.otherIncome, 'net', oiNet.map(n0), 'debt', oiDebt.map(n0), '| yield26', n1(yield26), 'ttm OI', n1(ttmOiCompany));
  console.log('D&A engine', F.dep, 'bottom-up', daBottom, '7.2%', da72.map(n0), '| Sep-28E EPS', n1(epsSep28), 'at 7.2%', n1(eps72Sep), 'bottom-up', n1(epsBuSep));
  console.log('FM rep', FM.median, FM.medianAll, FM.troughYears, '| exc', JSON.stringify(HA), 'all', HALL.med, 'troughs', TROUGH, 'trough pe', JSON.stringify(troughPe), 'pre', JSON.stringify(PRE));
  console.log('by fwd FY', FWDFY.map(f => `${f.fy} ${f.med}x (${f.n}) eps ${n1(f.eps)}`).join('; '));
  console.log('sector', sectorDrCalc.toFixed(3), 'all', sectorDrAll.toFixed(3), 'large', sectorDrLarge.toFixed(3), '| EV', sectorEv.toFixed(3), 'all', sectorEvAll.toFixed(3), '| Lupin own', derate.LUPIN.toFixed(1), derateEv.LUPIN.toFixed(1));
  console.log('MULT', MULT, 'SENS', SENS, '| EV hist', JSON.stringify(HEV), 'EVM', EVM, 'evNow FY27/28', n1(evFy27), n1(evFy28));
  console.log('TP', V.tp, 'upside', V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'scen', SC.bull.tp, SC.bear.tp, '| street avg', n0(avgTp), 'med', medTp, buys, sells, '| justPe', n1(justPe));
}
