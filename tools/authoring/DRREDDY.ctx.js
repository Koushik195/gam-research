// Dr. Reddy's initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks the
// business-line revenue build, the other-income build and the tax-plus-minority line against the engine, and derives the
// P/E multiple once (house rule, PLAYBOOK §4 and §7c): Dr. Reddy's own one-year-forward P/E median since Apr-2021 on EPS
// before one-off items (A18 practice; reported-EPS median as a sensitivity), trough years excluded, x the pharma sector
// factor for names outside the nine-peer set (+8.2%, the median of all nine), nearest half-turn. EV/EBITDA cross-check
// on the forward EV/EBITDA history x the nine peers' EV/EBITDA factor. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'DRREDDY', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'DRREDDY.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'DRREDDY', 'screener.json'), 'utf8'));
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
const statOf = arr => ({ med: pctl(arr, 0.5), p25: pctl(arr, 0.25), p75: pctl(arr, 0.75), min: Math.min(...arr), max: Math.max(...arr), n: arr.length });
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, ACC = C.accounting;
const b = A.labels.length - 1, ix = l => A.labels.indexOf(l), YRS = F.years;
const price = M.price.last, mcap = price * F.shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);

// 1) Business-line build (US$ North America x Rs/$ + rupee markets + others + Ind AS bridge) must equal model revenue
const BL = AS.businessLines, bld = [];
{ const x = { europe: BL.base.europe, india: BL.base.india, em: BL.base.em, psai: BL.base.psai };
  YRS.forEach((y, i) => { for (const k of Object.keys(x)) x[k] *= 1 + BL[`${k}Growth`][i] / 100;
    const na = BL.naUsdMn[i] * BL.fx[i] / 10, rev = na + x.europe + x.india + x.em + x.psai + BL.others[i] + BL.indasRecon[i];
    bld.push({ y, usd: BL.naUsdMn[i], fx: BL.fx[i], na, ...x, others: BL.others[i], recon: BL.indasRecon[i], rev, model: F.sales[i], gapPct: (F.sales[i] / rev - 1) * 100 }); }); }
bld.forEach(r => { if (Math.abs(r.gapPct) > 0.5) throw new Error(`DRREDDY build ${r.y}: model ${n0(r.model)} vs build ${n0(r.rev)} (${r.gapPct.toFixed(2)}%)`); });
const baseSum = ['na', 'europe', 'india', 'em', 'psai', 'others', 'indasRecon'].reduce((s, k) => s + BL.base[k], 0);
if (Math.abs(baseSum - A.sales[b]) > 1) throw new Error(`DRREDDY base build ${n0(baseSum)} != FY26 Ind AS revenue ${A.sales[b]}`);
const ifrsRev = bld.map(r => r.rev - r.recon);

// 2) Other income = 6.5% x opening engine net cash + carry on borrowed cash + forex + recurring misc + JV share
const OB = AS.otherIncomeBuild, Y = OB.yieldPct / 100;
const net0 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - A.borrowings[b];
const openNet = YRS.map((_, i) => (i ? F.treasury[i - 1] : net0));
const carryCalc = Y * (OB.grossBorrowings - OB.nonYieldingStakes);
const oiRows = YRS.map((y, i) => { const onNet = Y * Math.max(openNet[i], 0), treas = onNet + OB.carry[i], tot = treas + OB.forex[i] + OB.misc[i] + OB.jv[i];
  return { y, onNet, carry: OB.carry[i], treas, forex: OB.forex[i], misc: OB.misc[i], jv: OB.jv[i], tot, model: F.otherIncome[i], gross: openNet[i] + OB.grossBorrowings - OB.nonYieldingStakes }; });
oiRows.forEach((r, i) => { if (Math.abs(r.tot - r.model) > 3) throw new Error(`DRREDDY other income ${r.y}: build ${n0(r.tot)} vs model ${n0(r.model)}`);
  if (Math.abs(OB.carry[i] - carryCalc) > 1) throw new Error('DRREDDY carry != 6.5% x (borrowings - non-yielding stakes)');
  if (Math.abs(AS.otherIncome[i] - (OB.carry[i] + OB.forex[i] + OB.misc[i] + OB.jv[i])) > 1) throw new Error(`DRREDDY otherIncome ${r.y} != carry + forex + misc + jv`); });
const ON = FY26.otherIncomeNote, oiFy26Comp = ON.total + FY26.indas.jv - ON.divestmentGain - ON.litigationSettlement;
if (Math.abs(oiFy26Comp - OB.fy26Comparable) > 1) throw new Error('DRREDDY FY26 comparable other income');

// 3) Tax line = tax on PBT + minority share (negative = Nestle India absorbs JV losses)
const TB = AS.taxBuild, taxRows = YRS.map((y, i) => { const pbt = F.pbt[i], tax = pbt * TB.taxOnPbt[i] / 100, min = TB.minorities[i];
  return { y, pbt, tax, min, pat: pbt - tax - min, rate: (tax + min) / pbt * 100, modelPat: F.pat[i] }; });
taxRows.forEach(r => { if (Math.abs(r.pat / r.modelPat - 1) > 0.002) throw new Error(`DRREDDY tax build ${r.y}: PAT ${n0(r.pat)} vs model ${n0(r.modelPat)}`); });

// 4) Shares: engine count (FY26 profit for EPS / EPS) vs the 834.66 mn shares in issue
const SH_ACT = C.profile.shares / 1e7;
if (Math.abs(F.shares / SH_ACT - 1) > 0.002) throw new Error(`DRREDDY engine shares ${F.shares} vs ${SH_ACT}`);

// 5) Forward P/E history since Apr-2021 (house sampling: every 5th weekly close): reported EPS (forwardMedian, shown) and
//    EPS before one-off items (used: MOSL adjusted EPS FY23-FY26; FY27E = our EPS + the Q1 semaglutide provision after tax)
const FM = forwardMedian('DRREDDY', M);
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const UE = ACC.underlyingEps, SEMA_AT = Q1.ifrs.semaProvision * (1 - TB.taxOnPbt[0] / 100) / F.shares;
const adj = {}; Object.entries(UE).forEach(([k, v]) => { if (/^FY\d\d$/.test(k)) adj[2000 + +k.slice(2)] = v; });
adj[2027] = F.eps[0] + SEMA_AT; adj[2028] = F.eps[1]; adj[2029] = F.eps[2];
const rep = {}; S.tables['profit-loss'].periods.forEach((p, i) => { if (/Mar/.test(p)) rep[+p.slice(-4)] = S.tables['profit-loss'].rows['EPS in Rs'][i]; });
YRS.forEach((y, i) => (rep[2000 + +y.slice(2, 4)] = F.eps[i]));
const troughOf = by => fy => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); const pk = Math.max(...prev); return !(by[fy] > 0) || by[fy] < 0.5 * pk; };
const PX = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= '2021-04-01');
const allAdj = PX.map(([d, p]) => [d, Math.round(p / adj[fyOf(d)] * 10) / 10, fyOf(d)]);
const trA = troughOf(adj), fwdAdj = allAdj.filter(x => !trA(x[2])), troughAdj = [...new Set(allAdj.filter(x => trA(x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const HA = statOf(fwdAdj.map(x => x[1])), HR = { ...statOf(FM.series.map(x => x[1])), med: FM.median };
const byFy = {}; allAdj.forEach(x => (byFy[x[2]] ||= []).push(x[1]));
const FWDFY = Object.keys(byFy).sort().map(fy => ({ fy: `FY${String(fy).slice(2)}`, med: pctl(byFy[fy], 0.5), n: byFy[fy].length, eps: adj[fy], epsRep: rep[fy] }));
const thrA = fy => 0.5 * Math.max(adj[fy - 1], adj[fy - 2], adj[fy - 3]), thrR = fy => 0.5 * Math.max(rep[fy - 1], rep[fy - 2], rep[fy - 3]);
const exFY27 = statOf(fwdAdj.filter(x => x[2] !== 2027).map(x => x[1])); // sensitivity: if FY27 were a trough year
const preCliff = statOf(fwdAdj.filter(x => x[2] <= 2026).map(x => x[1])); // forward years FY23-FY26 only (gRevlimid in the denominator)
const fwdPe = forwardSeries('DRREDDY', M, 'eps').filter(x => x[0] >= '2016-04-01');
const peFY27 = price / F.eps[0], peFY28 = price / F.eps[1], peSep = price / sep(F.eps), peTtm = price / A.ttm.eps;

// 6) Sector factor: the nine pharma peers' trailing P/E at the 30-Sep close vs their five-year medians (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set, EXCL_SYMS = Object.keys(D.peers.excluded), ALL_SYMS = [...PEER_SYMS, ...EXCL_SYMS];
const PEERS = peersAsOf(ALL_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = (sym, chart, key) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pctl((X.charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(ALL_SYMS.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const MED5EV = Object.fromEntries(ALL_SYMS.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const derate = Object.fromEntries(ALL_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const derateEv = Object.fromEntries(ALL_SYMS.map(s => [s, P[s].evEbitda && MED5EV[s] ? (P[s].evEbitda / MED5EV[s] - 1) * 100 : null]));
const USED = PEER_SYMS;
const sectorCalc = medOf(USED.map(s => derate[s])), sectorCalcAll = medOf(ALL_SYMS.filter(s => s !== 'DRREDDY').map(s => derate[s]));
const sectorEvCalc = medOf(USED.map(s => derateEv[s]));
const SECTOR_SET = D.peers.factorSet, k = 1 + SECTOR_SET / 100; // PLAYBOOK §7c: +8.2% for DRREDDY; our reproduction is shown next to it
if (Math.abs(sectorCalc - SECTOR_SET) > 0.05) throw new Error(`DRREDDY sector factor reproduction ${sectorCalc.toFixed(3)}% vs PLAYBOOK ${SECTOR_SET}%`);
const kev = 1 + Math.round(sectorEvCalc * 100) / 10000;
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo', ALKEM: 'Alkem', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind' }[s] || s);

// 7) The multiple: one-offs median x factor, nearest half-turn (bull p75, bear p25, both x factor)
const MULT = { base: half(HA.med * k), bull: half(HA.p75 * k), bear: half(HA.p25 * k) };
const SENS = { reported: half(HR.med * k), exFY27: half(exFY27.med * k), preCliff: half(preCliff.med * k), noFactor: half(HA.med), all14: half(HA.med * (1 + sectorCalcAll / 100)), own: half(HA.med * (1 + derate.DRREDDY / 100)) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const val = m => Math.round(m * epsSep.base / 10) * 10;

// 8) Forward EV/EBITDA history (cross-check): EV = price x shares + Screener net debt at the last reported year-end;
//    forward EBITDA on Screener's basis before impairments (and, for FY26, before the SSA, VAT and labour-code items);
//    FY27E adds back the Q1 semaglutide provision
const IMP = ACC.impairments, ebFwd = {};
['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].forEach(l => (ebFwd[2000 + +l.slice(2)] = A.ebitda[ix(l)] + (IMP[l] || 0)));
ebFwd[2026] += FY26.ifrs.ssa + 184 + 117; ebFwd[2027] = F.ebitda[0] + Q1.ifrs.semaProvision; ebFwd[2028] = F.ebitda[1]; ebFwd[2029] = F.ebitda[2];
const ndFy = fy => { const i = ix(`FY${String(fy).slice(2)}`); return A.borrowings[i] - (A.cash[i] || 0) - (A.investments[i] || 0); };
const lastFyBs = d => { const y = +d.slice(0, 4), md = d.slice(5); return md >= '05-30' ? y : y - 1; }; // FY results public ~60 days after March
const fwdEv = PX.map(([d, p]) => { const fy = fyOf(d), ev = p * F.shares + ndFy(lastFyBs(d)); return [d, Math.round(ev / ebFwd[fy] * 10) / 10, fy]; });
const HEV = statOf(fwdEv.map(x => x[1]));
const evMULT = { base: half(HEV.med * kev), bull: half(HEV.p75 * kev), bear: half(HEV.p25 * kev) };
const ebitdaSep = sep(F.ebitda);
const evNow = (mcap - net0) / F.ebitda[1], evTtm = (mcap - net0) / M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);

// 9) Rating from the house rule (never typed); street as it stood on 30-Sep-2026
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-07-22' && s.tp);
const medTp = medOf(postQ1.map(s => s.tp)), tpLo = Math.min(...postQ1.map(s => s.tp)), tpHi = Math.max(...postQ1.map(s => s.tp));
const withEps = ST.filter(s => s.eps && s.date >= '2026-07-22'), avgEps = y => { const a = withEps.filter(s => s.eps[y] != null); return a.reduce((t, s) => t + s.eps[y], 0) / a.length; };
const nEps = y => withEps.filter(s => s.eps[y] != null).length;
const epsCagrFwd = cagr(UE.FY26, F.eps[2], 3), epsCagrRep = cagr(A.eps[b], F.eps[2], 3);

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, cagr, shortDate, pctl, medOf, statOf, SA, SQ, QL, Q1, FY26, ACC, b, ix, YRS, price, mcap, sep, BM, mv,
  BL, bld, ifrsRev, OB, net0, openNet, oiRows, ON, oiFy26Comp, TB, taxRows, SH_ACT,
  FM, fyOf, UE, SEMA_AT, adj, rep, allAdj, fwdAdj, troughAdj, HA, HR, FWDFY, thrA, thrR, exFY27, preCliff, fwdPe, peFY27, peFY28, peSep, peTtm,
  PEER_SYMS, EXCL_SYMS, PEERS, P, MED5, MED5EV, derate, derateEv, USED, sectorCalc, sectorCalcAll, sectorEvCalc, SECTOR_SET, k, kev, shortName,
  MULT, SENS, epsSep, val, ebFwd, fwdEv, HEV, evMULT, ebitdaSep, evNow, evTtm, rating, ruleText, buyBelow, sellAbove, ST, postQ1, medTp, tpLo, tpHi, withEps, avgEps, nEps, epsCagrFwd, epsCagrRep };

if (require.main === module) {
  console.log('build', bld.map(r => `${r.y} ${n0(r.rev)} vs ${n0(r.model)}`).join('; '));
  console.log('OI', oiRows.map(r => `${r.y} ${n0(r.tot)} (net ${n0(openNet[YRS.indexOf(r.y)])})`).join('; '), '| FY26 comp', n0(oiFy26Comp));
  console.log('tax', taxRows.map(r => `${r.y} ${r.rate.toFixed(2)}%`).join('; '), '| shares', F.shares.toFixed(2), SH_ACT.toFixed(2));
  console.log('fwd adj', HA, 'troughs', troughAdj, '| house reported', FM.median, FM.troughYears, '| by FY', FWDFY.map(x => `${x.fy}:${n1(x.med)}(${x.n}) eps ${n1(x.eps)}`).join(' '));
  console.log('thresholds FY27', n1(thrA(2027)), n1(thrR(2027)), '| exFY27', exFY27.med, 'preCliff', preCliff.med);
  console.log('factor calc', sectorCalc.toFixed(3), 'all14', sectorCalcAll.toFixed(3), 'EV', sectorEvCalc.toFixed(3), 'kev', kev);
  console.log('MULT', MULT, 'SENS', SENS, 'epsSep', epsSep);
  console.log('EV hist', HEV, 'evMULT', evMULT, 'ebFwd', ebFwd);
  console.log('engine tp', V.tp, V.upside.toFixed(1), rating, 'street med', medTp, 'avg EPS', n1(avgEps('FY27E')), n1(avgEps('FY28E')));
}
