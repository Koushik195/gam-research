// Zydus Lifesciences initiation: shared context for the Part B files. Loads the research JSONs and the built model,
// checks the business-line revenue build, the other-income, tax-plus-minorities and D&A workarounds, and derives the
// P/E multiple once (house rule, PLAYBOOK §4 and §7c): own one-year-forward P/E median since Apr-2021 on EPS before
// one-offs (FY22 animal-health sale gain, exceptional items) x the pharma sector factor (+5.45%), nearest half-turn,
// applied to EPS per post-buyback share. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ZYDUSLIFE', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ZYDUSLIFE.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'ZYDUSLIFE', 'screener.json'), 'utf8'));
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?(?=[0-9])/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, AK = C.annualKpis;
const yr = fy => SA.find(a => a.fy === fy);
const b = A.labels.length - 1, YRS = F.years;
const price = M.price.last;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const pctl = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };

// 1) Business-line build (US$ North America x Rs/$ + rupee businesses) must equal model revenue
const BL = AS.businessLines, bld = [];
{ let usd = BL.base.naUsdMn, x = { india: BL.base.india, im: BL.base.im, api: BL.base.api, alliances: BL.base.alliances, consumer: BL.base.consumer, medtech: BL.base.medtech };
  YRS.forEach((y, i) => { usd *= 1 + BL.naUsdGrowth[i] / 100; for (const k of Object.keys(x)) x[k] *= 1 + BL[`${k}Growth`][i] / 100;
    const na = usd * BL.fx[i] / 10, rev = na + Object.values(x).reduce((s, v) => s + v, 0) + BL.otherOp[i];
    bld.push({ y, usd, fx: BL.fx[i], na, ...x, otherOp: BL.otherOp[i], rev, model: F.sales[i], gapPct: (F.sales[i] / rev - 1) * 100 }); }); }
bld.forEach(r => { if (Math.abs(r.gapPct) > 0.5) throw new Error(`ZYDUSLIFE build ${r.y}: model ${n0(r.model)} vs build ${n0(r.rev)} (${r.gapPct.toFixed(2)}%)`); });

// 2) Other income = treasury and other + JV share - Mirabegron licence amortisation (engine workaround)
const OB = AS.otherIncomeBuild;
YRS.forEach((y, i) => { const want = OB.treasury[i] + OB.jv[i] - OB.licenceAmort[i]; if (Math.abs(want - AS.otherIncome[i]) > 1 || Math.abs(F.otherIncome[i] - want) > 1) throw new Error(`ZYDUSLIFE other income ${y}: ${F.otherIncome[i]} vs build ${want}`); });
const oiPre = YRS.map((_, i) => OB.treasury[i] + OB.jv[i]); // before the licence item: comparable with FY26 and the TTM
const oiFy26 = OB.fy26.total + OB.fy26.jv, oiTtm = OB.ttmJun26.otherIncome + OB.ttmJun26.jv;
const repDA = YRS.map((_, i) => F.dep[i] + OB.licenceAmort[i]); // reported-basis D&A

// 3) Tax line = tax on PBT ex-JV + minorities (the JV share is already after tax)
const TB = AS.taxBuild, taxRows = YRS.map((y, i) => { const pbt = F.pbt[i], tax = (pbt - OB.jv[i]) * TB.taxOnPbtExJv[i] / 100, min = TB.minorities[i];
  return { y, pbt, tax, min, pat: pbt - tax - min, rate: (tax + min) / pbt * 100, modelPat: F.pat[i] }; });
taxRows.forEach(r => { if (Math.abs(r.pat / r.modelPat - 1) > 0.002) throw new Error(`ZYDUSLIFE tax build ${r.y}: PAT ${n0(r.pat)} vs model ${n0(r.modelPat)}`); });
TB.minorities.forEach((m, i) => { if (Math.abs(m - TB.zwPat[i] * TB.zwMinorityPct / 100) > 2) throw new Error('ZYDUSLIFE minorities off Zydus Wellness PAT'); });

// 4) Net finance cost must fall with net debt and stay within debt cost x company net debt + fixed items
const COMPANY_ADJ = 440; // company net debt ~= -(engine treasury) + JV book Rs1,167 cr - leases Rs727 cr
const ndCo = [C.fy26.balance.borrowings - (C.fy26.balance.currentInvestments + C.fy26.balance.cash + C.fy26.balance.bankBalances), ...F.treasury.map(t => -t + COMPANY_ADJ)];
const FIXED_FIN = 120; // lease interest (~Rs55 cr on Rs727 cr) + unwinding of acquisition contingent consideration (~Rs65 cr)
const avgNdOf = i => (i === 0 ? (ndCo[0] + Q1.netDebtCo + ndCo[1]) / 3 : (ndCo[i] + ndCo[i + 1]) / 2); // FY27 includes the Jun-26 peak
const finRows = YRS.map((y, i) => { const net = AS.interest[i] - OB.treasury[i], avgNd = avgNdOf(i); return { y, interest: AS.interest[i], treasury: OB.treasury[i], net, avgNd, ceiling: 0.075 * Math.max(avgNd, 0) + FIXED_FIN }; });
finRows.forEach((r, i) => { if (r.net > r.ceiling || (i && r.net > finRows[i - 1].net)) throw new Error(`ZYDUSLIFE finance ${r.y}: net cost ${r.net} vs ceiling ${n0(r.ceiling)}`); });

// 5) Shares: engine count (FY26 profit / EPS) vs post-buyback count
const BB = C.buyback2026, SH_ENGINE = F.shares, SH_POST = BB.sharesAfter / 1e7, SH_ADJ = SH_ENGINE / SH_POST;
if (Math.abs(SH_ENGINE - BB.sharesBefore / 1e7) > 0.05) throw new Error(`ZYDUSLIFE engine shares ${SH_ENGINE} vs ${BB.sharesBefore / 1e7}`);
const epsPost = F.eps.map(e => e * SH_ADJ), mcap = price * SH_POST;

// 6) Forward P/E history: house forwardMedian (reported EPS) and the one-offs median (EPS before exceptional items and
//    the FY22 animal-health gain), same window and sampling (every 5th weekly close from Apr-2021)
const FM = forwardMedian('ZYDUSLIFE', M);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const UE = C.underlyingEps, adj = {}; Object.entries(UE).forEach(([k, v]) => { if (/^FY\d\d$/.test(k)) adj[2000 + +k.slice(2)] = v; });
YRS.forEach((y, i) => (adj[2000 + +y.slice(2, 4)] = F.eps[i]));
const troughA = fy => { const prev = [adj[fy - 1], adj[fy - 2], adj[fy - 3]].filter(v => v != null); const pk = Math.max(...prev); return !(adj[fy] > 0) || adj[fy] < 0.5 * pk; };
const allAdj = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= '2021-04-01').map(([d, p]) => [d, Math.round(p / adj[fyOf(d)] * 10) / 10, fyOf(d)]);
const fwdAdj = allAdj.filter(x => !troughA(x[2])), troughAdj = [...new Set(allAdj.filter(x => troughA(x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const HA = (v => ({ med: pctl(v, 0.5), p25: pctl(v, 0.25), p75: pctl(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }))(fwdAdj.map(x => x[1]));
const HH = (v => ({ med: FM.median, p25: pctl(v, 0.25), p75: pctl(v, 0.75), n: v.length }))(FM.series.map(x => x[1]));
const byFy = {}; allAdj.forEach(x => (byFy[x[2]] ||= []).push(x[1]));
const fyMed = Object.fromEntries(Object.entries(byFy).map(([k, a]) => [`FY${String(k).slice(2)}`, { med: pctl(a, 0.5), min: Math.min(...a), max: Math.max(...a), n: a.length }]));
const fwdPe = forwardSeries('ZYDUSLIFE', M, 'eps').filter(x => x[0] >= '2016-04-01');
const fwdNow = price / epsPost[1], sepNow = price / sep(epsPost);

// 7) Sector factor: pharma peers' trailing P/E at the 30-Sep close vs their five-year medians (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set, EXCL_SYMS = Object.keys(D.peers.excluded), ALL_SYMS = [...PEER_SYMS, ...EXCL_SYMS];
const PEERS = peersAsOf(ALL_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pctl((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(ALL_SYMS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(ALL_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const USED = PEER_SYMS.filter(s => s !== 'ZYDUSLIFE');
const sectorCalc = medOf(USED.map(s => derate[s])), sectorCalcAll = medOf(ALL_SYMS.filter(s => s !== 'ZYDUSLIFE').map(s => derate[s]));
const SECTOR_SET = 5.45, k = 1 + SECTOR_SET / 100; // as settled in PLAYBOOK §7c; our reproduction is shown next to it
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo', ALKEM: 'Alkem', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind' }[s] || s);

// 8) The multiple: one-offs median x sector factor, nearest half-turn (bull p75, bear p25, both x factor); applied to
//    EPS per post-buyback share; the engine carries it as an implied multiple of its own EPS (ZYDUSLIFE.mult.js)
const MULT = { base: half(HA.med * k), bull: half(HA.p75 * k), bear: half(HA.p25 * k) };
const IMPLIED = Object.fromEntries(Object.entries(MULT).map(([c, m]) => [c, Math.round(m * SH_ADJ * 100) / 100]));
const houseMult = half(FM.median * k);
const epsSep = { base: sep(epsPost), bull: sep(SC.bull.eps) * SH_ADJ, bear: sep(SC.bear.eps) * SH_ADJ };
const tpRaw = c => MULT[c] * epsSep[c];
// EV/EBITDA cross-check: own trailing median since Apr-2021 x the same factor, restated from trailing to Sep-28E EBITDA
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pctl(evHist, 0.5), evP25 = pctl(evHist, 0.25), evP75 = pctl(evHist, 0.75);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda), restate = ttmEbitda / ebitdaSep28;
const evMULT = { base: half(evMed * k * restate), bull: half(evP75 * k * restate), bear: half(evP25 * k * restate) };

// 9) Zydus Wellness: market value of the 57.59% stake and of the 42.41% minority at the 30-Sep close
const ZW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'ZYDUSWELL', 'screener.json'), 'utf8'));
const zwClose = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', `${ASOF}.json`), 'utf8')).closes.ZYDUSWELL;
const num = s => Number(String(s).replace(/[^0-9.\-]/g, ''));
const zwShares = num(ZW.topRatios['Market Cap']) / num(ZW.topRatios['Current Price']), zwMcap = zwClose * zwShares;
const zwStake = zwMcap * 0.5759, zwMinMkt = zwMcap * 0.4241, zwMinBook = C.fy26.balance.nci;
const zwEpsSep = (TB.zwPat[1] + TB.zwPat[2]) / 2 * 0.5759 / SH_POST, zwAtMarketPs = zwStake / SH_POST, zwInPe = MULT.base * zwEpsSep;

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, adjEpsCagrHist = (Math.pow(UE.FY26 / UE.FY21, 1 / 5) - 1) * 100;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-08-01' && s.tp), withEps = ST.filter(s => s.eps && s.date >= '2026-08-01');
const medTp = medOf(postQ1.map(s => s.tp)), avgEps = y => withEps.reduce((s, x) => s + x.eps[y], 0) / withEps.length;

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, S, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, shortDate, SA, SQ, QL, Q1, FY26, AK, yr, b, YRS, price, mcap, sep, pctl, medOf,
  BL, bld, OB, oiPre, oiFy26, oiTtm, repDA, TB, taxRows, ndCo, finRows, BB, SH_ENGINE, SH_POST, SH_ADJ, epsPost,
  FM, UE, adj, fwdAdj, troughAdj, HA, HH, fyMed, fwdPe, fwdNow, sepNow, fyOf, PEER_SYMS, EXCL_SYMS, PEERS, P, MED5, derate, USED, sectorCalc, sectorCalcAll, SECTOR_SET, k, shortName,
  MULT, IMPLIED, houseMult, epsSep, tpRaw, evMed, evP25, evP75, evMULT, ttmEbitda, ebitdaSep28, restate, zwClose, zwShares, zwMcap, zwStake, zwMinMkt, zwMinBook, zwEpsSep, zwAtMarketPs, zwInPe,
  BM, mv, rating, ruleText, buyBelow, sellAbove, epsCagrFwd, adjEpsCagrHist, ST, postQ1, withEps, medTp, avgEps };
