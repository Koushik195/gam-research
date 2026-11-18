// KIMS initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and the built
// model, checks the cluster build against model revenue and EBITDA, and computes the valuation inputs once: forward
// EV/EBITDA history since listing (post-Ind AS EBITDA; lease liabilities and minorities at book in net debt), reported
// and before start-up losses, forward P/E (forwardMedian), peer de-rating, street table. As of 30-Sep-2026 (Q1FY27).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { PF } = require('./KIMS.patch');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'KIMS', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'KIMS.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'KIMS', 'screener.json'), 'utf8')); // unpatched, for reported history
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs /g, '₹');
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SRC = 'KIMS presentations, earnings calls and annual reports; GAM Research';
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, AK = C.annualKpis;
const b = A.labels.length - 1, ix = fy => A.labels.indexOf(fy), YRS = F.years;
const rawRow = (t, k) => { const T = RAW.tables[t]; return T.periods.filter(p => /^Mar/.test(p)).map(p => T.rows[k][T.periods.indexOf(p)]); };
const RPAT = rawRow('profit-loss', 'Net Profit'), REPS = rawRow('profit-loss', 'EPS in Rs'); // reported (before minorities / pre-QIP EPS)

// Cluster build (assumptions.businessLines) must sum to model revenue; cluster EBITDA must reconcile to model EBITDA
const BL = AS.businessLines, CLN = Object.keys(BL.clusters);
const clRev = Object.fromEntries(CLN.map(k => [k, YRS.map((_, i) => { const c = BL.clusters[k]; return c.opBeds[i] * 365 * c.occupancyPct[i] / 100 * c.arpob[i] / 1e7; })]));
const clEb = Object.fromEntries(CLN.map(k => [k, clRev[k].map((r, i) => r * BL.clusters[k].marginPct[i] / 100)]));
const buildRev = YRS.map((_, i) => CLN.reduce((s, k) => s + clRev[k][i], 0) + BL.other[i]);
YRS.forEach((y, i) => { if (Math.abs(buildRev[i] / F.sales[i] - 1) > 0.003) throw new Error(`KIMS cluster build ${y}: ${n0(buildRev[i])} != model revenue ${n0(F.sales[i])}`); });
const clEbSum = YRS.map((_, i) => CLN.reduce((s, k) => s + clEb[k][i], 0)), ebPlug = YRS.map((_, i) => F.ebitda[i] - clEbSum[i]);
YRS.forEach((y, i) => { if (Math.abs(ebPlug[i]) > 60) throw new Error(`KIMS cluster EBITDA ${y}: reconciling line ${n0(ebPlug[i])} too large`); });
const grpBeds = YRS.map((_, i) => CLN.reduce((s, k) => s + BL.clusters[k].opBeds[i], 0));
const grpOcc = YRS.map((_, i) => CLN.reduce((s, k) => s + BL.clusters[k].opBeds[i] * BL.clusters[k].occupancyPct[i] / 100, 0));
const grpOccPct = YRS.map((_, i) => grpOcc[i] / grpBeds[i] * 100);
const grpArpob = YRS.map((_, i) => CLN.reduce((s, k) => s + clRev[k][i], 0) * 1e7 / (grpOcc[i] * 365));
const SU = { FY25: C.newUnits.fy25.ebitdaCr * -1, FY26: C.newUnits.fy26.ebitdaCr * -1, FY27E: BL.startupLosses[0], FY28E: BL.startupLosses[1], FY29E: BL.startupLosses[2] };

// Rent and lease liabilities (FY27-29E = GAM estimates; used only to translate pre-Ind AS figures)
const RENT = { FY26: 43.6, FY27E: 75, FY28E: 85, FY29E: 95 };
const LEASE = { FY26: 1009, FY27E: 1040, FY28E: 1080, FY29E: 1120 };
const preEbitda = YRS.map((y, i) => F.ebitda[i] - RENT[y]), preMargin = YRS.map((_, i) => preEbitda[i] / F.sales[i] * 100);

// Price, shares, net debt (borrowings incl. leases + minorities at book − cash − investments; Mar-26 pro forma for QIP + warrants)
const price = M.price.last, sharesDil = F.shares, sharesNow = M.meta.marketCap / price, mcapNow = M.meta.marketCap, mcapDil = price * sharesDil;
const NCI = C.cash.mar26.nciBookCr;
const ND = {}; RAW.tables['balance-sheet'].periods.forEach((p, i) => { if (!/^Mar/.test(p)) return; const sb = RAW.schedules['balance-sheet']; ND[+p.slice(-4)] = RAW.tables['balance-sheet'].rows.Borrowings[i] + (sb['Other Liabilities']['Non controlling int'][p] || 0) - (sb['Other Assets']['Cash Equivalents'][p] || 0) - RAW.tables['balance-sheet'].rows.Investments[i]; });
const ndMar26 = ND[2026], ndPf = ndMar26 - PF.cashCr;
if (Math.abs(-ndPf - (A.cash[b] + A.investments[b] + AS.otherTreasury.base - A.borrowings[b])) > 2) throw new Error('KIMS: pro forma net debt does not match the model');
const BV = V.blend.methods, mv = key => BV.find(m => m.key === key);
const evMult = mv('ev').mult, ebitdaSep28 = mv('ev').metric, peMult = mv('pe').mult, epsSep28 = mv('pe').metric;
const roll = arr => (arr[1] + arr[2]) / 2;
const treasurySep28 = roll(F.treasury), evTarget = evMult * ebitdaSep28;
const evNowDil = mcapDil + ndPf, evNow = evNowDil / F.ebitda[1], evNow27 = evNowDil / F.ebitda[0];
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, ebitdaCagrFwd = (Math.pow(F.ebitda[2] / A.ebitda[b], 1 / 3) - 1) * 100;
const ebitdaCagrHist = (Math.pow(A.ebitda[b] / A.ebitda[b - 3], 1 / 3) - 1) * 100, salesCagrHist = (Math.pow(A.sales[b] / A.sales[b - 3], 1 / 3) - 1) * 100;
const adjEb26 = A.ebitda[b] + SU.FY26, adjEb29 = F.ebitda[2] + SU.FY29E, adjEb23 = A.ebitda[b - 3];
const adjCagrFwd = (Math.pow(adjEb29 / adjEb26, 1 / 3) - 1) * 100, adjCagrHist = (Math.pow(adjEb26 / adjEb23, 1 / 3) - 1) * 100;

// One-year-forward EV/EBITDA since listing (28-Jun-2021): EV = price x shares + net debt (latest March balance sheet public
// by then; Mar-22, the first after the IPO, used from listing); less the QIP money from 24-Jun-2026 and the warrant money from
// 19-Aug-2026 (shares 42.0 cr from 24-Jun-2026). EBITDA of the next full fiscal year (actual, then our estimates), as
// forwardSeries does for P/E; the adjusted series adds back new-unit (start-up) EBITDA losses of that year.
const ebBy = {}; A.labels.forEach((l, i) => (ebBy[2000 + +l.slice(2)] = A.ebitda[i])); YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const suBy = { 2025: SU.FY25, 2026: SU.FY26, 2027: SU.FY27E, 2028: SU.FY28E, 2029: SU.FY29E };
const ndAt = d => { let fy = +d.slice(0, 4); if (d < `${fy}-05-30`) fy -= 1; let v = ND[Math.max(fy, 2022)]; if (d >= '2026-06-24') v -= PF.qipNetCr; if (d >= '2026-08-19') v -= 150; return v; };
const shAt = d => (d >= '2026-06-24' ? (PF.sharesMar26 + PF.qipShares) / 1e7 : PF.sharesMar26 / 1e7);
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const pts = M.price.series.filter(([d]) => d >= '2021-06-28' && d <= ASOF).filter((_, i, a) => i % 5 === 0 || i === a.length - 1);
const fwdEv = pts.map(([d, p]) => [d, Math.round((p * shAt(d) + ndAt(d)) / ebBy[fyOf(d)] * 10) / 10]);
const fwdEvAdj = pts.map(([d, p]) => [d, Math.round((p * shAt(d) + ndAt(d)) / (ebBy[fyOf(d)] + (suBy[fyOf(d)] || 0)) * 10) / 10]);
const stat = arr => { const v = arr.slice().sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const HEV = stat(fwdEv.map(x => x[1])), HEVA = stat(fwdEvAdj.map(x => x[1]));
const HEVy = (y, s = fwdEv) => stat(s.filter(x => x[0].startsWith(y)).map(x => x[1]));
const troughEv = fwdEv.filter(([d]) => { const fy = fyOf(d), pk = Math.max(ebBy[fy - 1] || 0, ebBy[fy - 2] || 0, ebBy[fy - 3] || 0); return !(ebBy[fy] > 0) || ebBy[fy] < 0.5 * pk; }).length;
const FM = forwardMedian('KIMS', M, { from: '2021-06-28' });
const fwdPe = forwardSeries('KIMS', M, 'eps').filter(x => x[0] >= '2021-06-28');
const peNow = price / F.eps[1];
// forward P/E before start-up losses (after tax at 30%), for the one-offs comparison
const epsBy = {}; RAW.tables['profit-loss'].periods.forEach((p, i) => { if (/Mar/.test(p)) epsBy[+p.slice(-4)] = REPS[RAW.tables['profit-loss'].periods.filter(q => /^Mar/.test(q)).indexOf(p)]; });
YRS.forEach((y, i) => (epsBy[2000 + +y.slice(2, 4)] = F.eps[i]));
const epsAdjBy = Object.fromEntries(Object.entries(epsBy).map(([fy, e]) => [fy, e + (suBy[fy] || 0) * 0.7 / (+fy >= 2027 ? sharesDil : PF.sharesMar26 / 1e7)]));
const fwdPeAdj = pts.map(([d, p]) => [d, Math.round(p / epsAdjBy[fyOf(d)] * 10) / 10]);
const HPEA = stat(fwdPeAdj.map(x => x[1]));

// Peers at the 30-Sep-2026 close; de-rating = trailing multiple vs its own five-year median (Screener)
const PEER_SYMS = ['KIMS', 'APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'NH', 'MEDANTA', 'RAINBOW', 'ASTERDM', 'JLHL'];
const PEERS = peersAsOf(PEER_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = (sym, chart, key) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
const MED5EV = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')])), MED5PE = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const drEv = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].evEbitda / MED5EV[s] - 1) * 100])), drPe = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].pe / MED5PE[s] - 1) * 100]));
const CORE = ['APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'NH', 'MEDANTA', 'RAINBOW', 'JLHL'], LEFT_OUT = ['ASTERDM'];
const median = a => { const v = a.slice().sort((x, y) => x - y), k = v.length; return k % 2 ? v[(k - 1) / 2] : (v[k / 2 - 1] + v[k / 2]) / 2; };
const sectorDrEv = median(CORE.map(s => drEv[s])), sectorDrPe = median(CORE.map(s => drPe[s])), allDrEv = median(PEER_SYMS.filter(s => s !== 'KIMS').map(s => drEv[s]));
const evAfter = HEV.med * (1 + sectorDrEv / 100), evAfterAdj = HEVA.med * (1 + sectorDrEv / 100), peAfter = FM.median * (1 + sectorDrPe / 100);
const shortName = s => ({ KIMS: 'KIMS', APOLLOHOSP: 'Apollo Hospitals', MAXHEALTH: 'Max Healthcare', FORTIS: 'Fortis', NH: 'Narayana Hrudayalaya', MEDANTA: 'Medanta (Global Health)', RAINBOW: 'Rainbow Children\'s', ASTERDM: 'Aster DM', JLHL: 'Jupiter Life Line' }[s] || s);
const adjSep28 = ebitdaSep28 + (SU.FY28E + SU.FY29E) / 2, adjValue = (evAfterAdj * adjSep28 + treasurySep28) / sharesDil;

// Minorities: at book in net debt (as in the history); marking them to market is a sensitivity
const MIPCT = [3, 6, 7.5]; // minorities' share of PBT inside the tax line (assumptions._taxWhy)
const miProfit = YRS.map((_, i) => F.pbt[i] * MIPCT[i] / 100), miSep28 = roll(miProfit), miMarket = miSep28 * peMult, miPerShare = (miMarket - NCI) / sharesDil;

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026; PL's multiple translated to our basis (leases and minorities in debt)
const ST = D.street.brokers, byB = n => ST.find(s => s.broker === n);
const pl = byB('Prabhudas Lilladher'), axis = byB('Axis Securities');
const postQ1 = ST.filter(s => s.date >= '2026-08'), avgPost = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length;
const plOurBasis = (30 * pl.ebitda.FY28E + LEASE.FY28E + NCI) / pl.ebitda.FY28E;
const ourPlBasis = (evTarget - LEASE.FY28E - NCI) / F.ebitda[1], ourPostFy28 = evTarget / F.ebitda[1];
const streetAt = mult => (mult * F.ebitda[1] + F.treasury[1]) / sharesDil; // a street multiple on our FY28E EBITDA and net debt

module.exports = { ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, shortDate, SRC, SA, SQ, QL, Q1, FY26, AK, b, ix, YRS, RPAT, REPS, PF,
  BL, CLN, clRev, clEb, buildRev, clEbSum, ebPlug, grpBeds, grpOccPct, grpArpob, SU, RENT, LEASE, preEbitda, preMargin,
  price, sharesDil, sharesNow, mcapNow, mcapDil, NCI, ND, ndMar26, ndPf, mv, evMult, ebitdaSep28, peMult, epsSep28, treasurySep28, evTarget, evNowDil, evNow, evNow27,
  epsCagrFwd, ebitdaCagrFwd, ebitdaCagrHist, salesCagrHist, adjEb26, adjCagrFwd, adjCagrHist, fwdEv, fwdEvAdj, HEV, HEVA, HEVy, troughEv, FM, fwdPe, peNow, fwdPeAdj, HPEA,
  PEER_SYMS, PEERS, P, MED5EV, MED5PE, drEv, drPe, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, allDrEv, evAfter, evAfterAdj, peAfter, shortName, adjSep28, adjValue,
  MIPCT, miProfit, miSep28, miMarket, miPerShare, rating, buyBelow, sellAbove, ST, pl, axis, postQ1, avgPost, plOurBasis, ourPlBasis, ourPostFy28, streetAt };
