// Aurobindo Pharma initiation: shared context for the Part B files (research.js, part2-7). Loads the research JSONs and
// the built model, checks the business-line build, the other-income build (gross cash) and the interest build (gross debt)
// against the engine, converts per-share values to the post-buyback share count, and derives the valuation once (house rule,
// PLAYBOOK §4 and §7c): own one-year-forward P/E median since Apr-2021 on EPS before exceptional items (batch practice A18;
// the FY21 Natrol gain distorts the reported series and its trough test) x the pharma sector factor (+5.45%), nearest
// half-turn, applied to EPS per post-buyback share. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'AUROPHARMA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'AUROPHARMA.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'AUROPHARMA', 'screener.json'), 'utf8')); // raw (EPS row unaffected by the patch except Jun-2026)
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
const pctl = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, ACC = C.accounting;
const b = A.labels.length - 1, YRS = F.years, ix = fy => A.labels.indexOf(fy);
const price = M.price.last;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E

// 1) Business-line build must equal model revenue
const BL = AS.businessLines;
const lines = { us: [], europe: [], gm: [], arv: [], api: [] };
{ let api = BL.base.api; YRS.forEach((_, i) => { api *= 1 + BL.apiGrowth[i] / 100;
  lines.us.push(BL.usUsdMn[i] * BL.fxUsd[i] / 10); lines.europe.push(BL.europeEurMn[i] * BL.fxEur[i] / 10); lines.gm.push(BL.gmUsdMn[i] * BL.fxUsd[i] / 10); lines.arv.push(BL.arvUsdMn[i] * BL.fxUsd[i] / 10); lines.api.push(api); }); }
const blTot = YRS.map((_, i) => Object.keys(lines).reduce((s, k) => s + lines[k][i], 0));
blTot.forEach((t, i) => { if (Math.abs(t / F.sales[i] - 1) > 0.005) throw new Error(`AUROPHARMA business-line build ${YRS[i]}: ${n0(t)} != model ${n0(F.sales[i])}`); });
if (Math.abs(Object.values(BL.base).reduce((s, v) => s + v, 0) - A.sales[b]) > 1) throw new Error('AUROPHARMA business-line base does not sum to FY26 revenue');
const share = (k, i) => lines[k][i] / blTot[i] * 100;
const BASE_TOT = Object.values(BL.base).reduce((s, v) => s + v, 0);
const fxOnly27 = (BL.base.us / FY26.fxAvg * BL.fxUsd[0] - BL.base.us) + (BL.base.gm / FY26.fxAvg * BL.fxUsd[0] - BL.base.gm) + (BL.base.arv / FY26.fxAvg * BL.fxUsd[0] - BL.base.arv) + (BL.base.europe / (BL.base.europe / FY26.europeEurMn * 10) * BL.fxEur[0] - BL.base.europe); // FY26 volumes at FY27E rates
const fxPp27 = fxOnly27 / A.sales[b] * 100;
const lannett27 = 195 * BL.fxUsd[0] / 10, lannettPp27 = lannett27 / A.sales[b] * 100; // Q2-Q4 ~US$195mn (60/65/70)

// 2) Other income built on gross cash (company basis) and interest on gross debt
const OB = AS.otherIncomeBuild, IB = AS.interestBuild;
const grossCash = YRS.map((_, i) => F.treasury[i] + OB.basisAdj + IB.grossDebt[i]); // year-end
const oiTreas = YRS.map((_, i) => i === 0 ? OB.treasuryYieldPct / 100 * (OB.grossCashJun26 + grossCash[0]) / 2 * 0.75 : OB.treasuryYieldPct / 100 * (grossCash[i - 1] + grossCash[i]) / 2);
const oiMisc = YRS.map((_, i) => (i === 0 ? OB.misc[0] * 0.75 : OB.misc[i]));
const oiQ1 = [OB.q1Actual, 0, 0];
const oiBuild = YRS.map((_, i) => oiQ1[i] + oiTreas[i] + oiMisc[i]);
const avgDebt = YRS.map((_, i) => i === 0 ? ((IB.grossDebtMar26 + IB.grossDebtJun26) / 2 * 0.25 + (IB.grossDebtJun26 + IB.grossDebt[0]) / 2 * 0.75) : (IB.grossDebt[i - 1] + IB.grossDebt[i]) / 2);
const intBuild = YRS.map((_, i) => IB.costPct / 100 * avgDebt[i] + IB.leaseInterest);
const yield26 = OB.treasury26 / ((OB.grossCashMar26 + 8307) / 2) * 100; // Mar-25 company gross cash Rs8,307 cr (Q4FY26 presentation)
const OIN = S.schedules.quarters['Other Income']['Other income normal'];
const ttmOi = ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026'].reduce((s, p) => s + OIN[p], 0); // incl. forex (Screener)
const netCashCo = YRS.map((_, i) => F.treasury[i] + OB.basisAdj);

// 3) Shares: engine count (FY26 profit / EPS) vs post-buyback count
const SH_ENGINE = F.shares, SH_POST = D.ownership.shares / 1e7, SH_ADJ = SH_ENGINE / SH_POST;
if (Math.abs(SH_ENGINE - FY26.weightedShares / 1e7) > 0.05) throw new Error(`AUROPHARMA engine shares ${SH_ENGINE} vs ${FY26.weightedShares / 1e7}`);
const epsPost = F.eps.map(e => e * SH_ADJ), mcap = price * SH_POST;
const EPS_SEP = { base: sep(epsPost), bull: sep(SC.bull.eps) * SH_ADJ, bear: sep(SC.bear.eps) * SH_ADJ };

// 4) Forward P/E history since Apr-2021: house forwardMedian (reported EPS) and EPS before exceptional items (base, A18)
const FM = forwardMedian('AUROPHARMA', M);
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const pl = S.tables['profit-loss'], NS = S.schedules['profit-loss']['Net Profit'];
const epsRep = {}, epsExc = {}, EXC_AT = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4), e = pl.rows['EPS in Rs'][i], ex = NS['Exceptional items AT'][p] || 0, pfe = NS['Profit for EPS'][p]; epsRep[y] = e; epsExc[y] = pfe ? e - ex / (pfe / e) : e; EXC_AT[y] = ex; } });
YRS.forEach((y, i) => { epsExc[2000 + +y.slice(2, 4)] = F.eps[i]; epsRep[2000 + +y.slice(2, 4)] = F.eps[i]; });
const trough = (by, fy) => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); const pk = Math.max(...prev); return !(by[fy] > 0) || by[fy] < 0.5 * pk; };
const PX = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= '2021-04-01');
const exAll = PX.map(([d, p]) => [d, Math.round(p / epsExc[fyOf(d)] * 10) / 10, fyOf(d)]);
const troughExc = [...new Set(exAll.filter(x => trough(epsExc, x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const fwdAdj = exAll.filter(x => !trough(epsExc, x[2]));
const statOf = v => ({ med: pctl(v, 0.5), p25: pctl(v, 0.25), p75: pctl(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length });
const HA = statOf(fwdAdj.map(x => x[1])), HR = statOf(FM.series.map(x => x[1]));
const byFy = {}; exAll.forEach(x => (byFy[x[2]] ||= []).push(x[1]));
const FWDFY = Object.keys(byFy).sort().map(fy => ({ fy: `FY${String(fy).slice(2)}`, med: pctl(byFy[fy], 0.5), n: byFy[fy].length, eps: epsExc[fy] }));
const fy23Ratio = epsExc[2023] / Math.max(epsExc[2020], epsExc[2021], epsExc[2022]); // trough test on EPS before exceptional items
const fy23RatioRep = epsRep[2023] / Math.max(epsRep[2020], epsRep[2021], epsRep[2022]);
const fwdPe = forwardSeries('AUROPHARMA', M, 'eps').filter(x => x[0] >= '2016-04-01');
const peFY27 = price / epsPost[0], peFY28 = price / epsPost[1], peSep28 = price / EPS_SEP.base;
const ttmEps = A.ttm.eps, peTtm = price / ttmEps;

// 5) Sector factor: pharma peers' trailing P/E at the 30-Sep close vs their five-year medians (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set, EXCL = Object.keys(D.peers.excluded), ALL_SYMS = [...PEER_SYMS, ...EXCL];
const PEERS = peersAsOf(ALL_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = (sym, ch, key) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pctl((X.charts?.[ch]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(ALL_SYMS.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const MED5EV = Object.fromEntries(ALL_SYMS.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const derate = Object.fromEntries(ALL_SYMS.map(s => [s, (P[s].pe / MED5[s] - 1) * 100]));
const derateEv = Object.fromEntries(ALL_SYMS.map(s => [s, (P[s].evEbitda / MED5EV[s] - 1) * 100]));
const USED = PEER_SYMS.filter(s => s !== 'AUROPHARMA');
const sectorCalc = medOf(USED.map(s => derate[s])), sectorCalcAll = medOf(ALL_SYMS.filter(s => s !== 'AUROPHARMA').map(s => derate[s]));
const sectorEvCalc = medOf(USED.map(s => derateEv[s]));
const LARGE = ['SUNPHARMA', 'DIVISLAB', 'TORNTPHARM', 'ZYDUSLIFE', 'CIPLA'], sectorLarge = medOf(LARGE.map(s => derate[s]));
const SECTOR_SET = 5.45, k = 1 + SECTOR_SET / 100; // PLAYBOOK §7c; our reproduction (sectorCalc) is shown next to it
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo', ALKEM: 'Alkem', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind' }[s] || s);

// 6) The multiple (base on EPS before exceptional items; bull p75, bear p25, all x factor), and the engine's implied multiple
const MULT = { base: half(HA.med * k), bull: half(HA.p75 * k), bear: half(HA.p25 * k) };
const IMPLIED = Object.fromEntries(Object.entries(MULT).map(([c, m]) => [c, Math.round(m * SH_ADJ * 100) / 100]));
const derived = HA.med * k;
const SENS = { reported: half(FM.median * k), reportedAll: half(FM.medianAll * k), own: half(HA.med * (1 + derate.AUROPHARMA / 100)), large: half(HA.med * (1 + sectorLarge / 100)), noFactor: half(HA.med) };
const val = m => Math.round(m * EPS_SEP.base / 10) * 10;
// EV/EBITDA cross-check: own trailing median since Apr-2021 x the same factor
const evSeries = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0);
const HEV = statOf(evSeries.map(x => x[1]));
const evMULT = { base: half(HEV.med * k), bull: half(HEV.p75 * k), bear: half(HEV.p25 * k) };
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);
const evNow = mcap - Q1.netCash, evTtm = evNow / ttmEbitda, evFy28 = evNow / F.ebitda[1];

// 7) Payout check (dividend Rs4.5 a share + Rs800 cr buyback in FY27E)
const div27 = F.dividends[0], buyback = 800;
const roeSus = F.roe[2], gSus = 6, keV = V.ke, justPe = (1 - gSus / roeSus) / ((keV - gSus) / 100);

// 8) Valuation outputs, rating
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const tpRaw = c => MULT[c] * EPS_SEP[c];
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const dcfPost = mv('dcf').value * SH_ADJ, evPost = mv('ev').value * SH_ADJ;
const epsCagrFwd = cagr(A.eps[b], epsPost[2], 3), epsCagrExc = cagr(epsExc[2021], epsExc[2026], 5), epsCagrHist = cagr(A.eps[ix('FY21')] ? epsExc[2021] : 1, epsExc[2026], 5);
const roeHist = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => A.roe[ix(y)]);

// 9) Street as it stood on 30-Sep-2026
const ST = D.street.brokers, br = n => ST.find(s => s.broker === n);
const idir = br('ICICI Direct'), mosl = br('Motilal Oswal'), pl_ = br('Prabhudas Lilladher');
const postQ1 = ST.filter(s => s.date >= '2026-08-06' && s.tp), avgTp = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length, medTp = medOf(postQ1.map(s => s.tp));
const tpLo = Math.min(...postQ1.map(s => s.tp)), tpHi = Math.max(...postQ1.map(s => s.tp));
const buys = postQ1.filter(s => /Buy|Add|Accumulate/.test(s.rating)).length;
const moslEps = y => mosl.pat[y] / SH_POST;

// Checks that the assumptions are in sync (run by research.js; AUROPHARMA.mult.js writes them)
function assertSynced() {
  const pe = AS.valuation.blend.methods.find(m => m.key === 'pe'), ev = AS.valuation.blend.methods.find(m => m.key === 'ev');
  ['base', 'bull', 'bear'].forEach(c => {
    if (Math.abs(pe.multiple[c] - IMPLIED[c]) > 0.005) throw new Error(`AUROPHARMA P/E ${c} ${pe.multiple[c]} != implied ${IMPLIED[c]} (run AUROPHARMA.mult.js)`);
    if (ev.multiple[c] !== evMULT[c]) throw new Error(`AUROPHARMA EV/EBITDA ${c} ${ev.multiple[c]} != ${evMULT[c]}`);
  });
  YRS.forEach((y, i) => {
    if (Math.abs(oiBuild[i] - AS.otherIncome[i]) > 3) throw new Error(`AUROPHARMA other income ${y}: build ${oiBuild[i].toFixed(1)} vs ${AS.otherIncome[i]} (run AUROPHARMA.mult.js)`);
    if (Math.abs(intBuild[i] - AS.interest[i]) > 8) throw new Error(`AUROPHARMA interest ${y}: build ${intBuild[i].toFixed(1)} vs ${AS.interest[i]}`);
  });
  if (Math.abs(div27 - (4.5 * SH_POST + buyback)) > 40) throw new Error(`AUROPHARMA FY27E payout gives ${n0(div27)} vs dividend + buyback ${n0(4.5 * SH_POST + buyback)}`);
  if (Math.abs(sectorCalc - SECTOR_SET) > 0.1) throw new Error(`AUROPHARMA sector reproduction ${sectorCalc.toFixed(2)} far from ${SECTOR_SET}`);
  if (Math.abs(V.tp - Math.round(MULT.base * EPS_SEP.base / 10) * 10) > 10) throw new Error(`AUROPHARMA TP ${V.tp} != ${MULT.base}x x ${EPS_SEP.base.toFixed(2)}`);
}

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, cagr, shortDate, pctl, medOf, SA, SQ, QL, Q1, FY26, ACC, b, ix, YRS, price, mcap, sep,
  BL, lines, blTot, share, BASE_TOT, fxPp27, lannett27, lannettPp27, OB, IB, grossCash, oiTreas, oiMisc, oiQ1, oiBuild, avgDebt, intBuild, yield26, ttmOi, netCashCo,
  SH_ENGINE, SH_POST, SH_ADJ, epsPost, EPS_SEP, FM, fyOf, epsRep, epsExc, EXC_AT, troughExc, fwdAdj, exAll, HA, HR, FWDFY, fy23Ratio, fy23RatioRep, fwdPe, peFY27, peFY28, peSep28, ttmEps, peTtm,
  PEER_SYMS, EXCL, ALL_SYMS, PEERS, P, MED5, MED5EV, derate, derateEv, USED, sectorCalc, sectorCalcAll, sectorEvCalc, LARGE, sectorLarge, SECTOR_SET, k, shortName,
  MULT, IMPLIED, derived, SENS, val, HEV, evMULT, ttmEbitda, evNow, evTtm, evFy28, div27, buyback, roeSus, gSus, keV, justPe,
  BM, mv, tpRaw, rating, ruleText, buyBelow, sellAbove, dcfPost, evPost, epsCagrFwd, epsCagrExc, roeHist, ST, br, idir, mosl, pl_, postQ1, avgTp, medTp, tpLo, tpHi, buys, moslEps, assertSynced };

if (require.main === module) {
  console.log('build', blTot.map(n0), 'model', F.sales.map(n0), '| fx pp FY27', fxPp27.toFixed(1), 'lannett pp', lannettPp27.toFixed(1));
  console.log('OI build', oiBuild.map(x => x.toFixed(1)), 'vs', AS.otherIncome, '| gross cash', grossCash.map(n0), '| int build', intBuild.map(x => x.toFixed(1)), 'vs', AS.interest, '| yield26', yield26.toFixed(2), 'ttmOi', ttmOi);
  console.log('shares', SH_ENGINE.toFixed(3), SH_POST, SH_ADJ.toFixed(5), '| eps post', epsPost.map(x => x.toFixed(2)), 'Sep-28E', EPS_SEP);
  console.log('FM rep', FM.median, FM.medianAll, FM.troughYears, '| exc', HA, 'trough exc', troughExc, 'fy23 ratio exc', fy23Ratio.toFixed(3), 'rep', fy23RatioRep.toFixed(3));
  console.log('by FY', FWDFY.map(f => `${f.fy} ${f.med} (n${f.n}, eps ${f.eps.toFixed(1)})`).join('; '));
  console.log('sector calc', sectorCalc.toFixed(3), 'all', sectorCalcAll.toFixed(3), 'large', sectorLarge.toFixed(2), 'EV analogue', sectorEvCalc.toFixed(3));
  console.log('MULT', MULT, 'IMPLIED', IMPLIED, 'SENS', SENS, '| EV', HEV, evMULT, '| evTtm', evTtm.toFixed(1), 'evFy28', evFy28.toFixed(1));
  console.log('TP', V.tp, V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), '| post-buyback dcf', Math.round(dcfPost), 'ev', Math.round(evPost), '| scen', SC.bull.tp, SC.bear.tp, '| raw', Object.fromEntries(['base', 'bull', 'bear'].map(c => [c, Math.round(tpRaw(c))])));
  console.log('div27', n0(div27), 'target', n0(4.5 * SH_POST + buyback), '| justPe', justPe.toFixed(1), '| street avg', Math.round(avgTp), 'med', medTp, buys, '/', postQ1.length);
  try { assertSynced(); console.log('synced: yes'); } catch (e) { console.log('synced: NO -', e.message); }
}
