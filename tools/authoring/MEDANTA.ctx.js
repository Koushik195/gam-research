// Global Health (Medanta) initiation: shared context for the Part B files (research.js, part2-6). Loads the
// research JSONs and the built model, checks the bed build against model revenue, and computes the valuation
// inputs once: forward EV/EBITDA history since listing (Nov-2022; post-Ind AS 116 EBITDA after ESOP, lease
// liabilities in net debt), forward P/E (forwardMedian), peer de-rating, street table. As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'MEDANTA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'MEDANTA.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2022-11-16';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs /g, '₹');
const SRC = 'Global Health (Medanta) presentations, earnings calls and annual report; GAM Research';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, AK = C.annualKpis, CL = C.clusters;
const b = A.labels.length - 1; // FY26 index in actuals
const ix = fy => A.labels.indexOf(fy);
const YRS = F.years;

// Bed build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines;
const grpRev = (g, i) => g.censusBeds[i] * 365 * g.occupancyPct[i] / 100 * g.arpob[i] / 1e7;
const c1F = YRS.map((_, i) => grpRev(BL.cluster1, i)), c2F = YRS.map((_, i) => grpRev(BL.cluster2, i)), otherF = BL.other;
YRS.forEach((y, i) => { const s = c1F[i] + c2F[i] + otherF[i]; if (Math.abs(s / F.sales[i] - 1) > 0.003) throw new Error(`MEDANTA bed build ${y}: ${n0(s)} != model revenue ${n0(F.sales[i])}`); });
const netBeds = YRS.map((_, i) => BL.cluster1.censusBeds[i] + BL.cluster2.censusBeds[i]);
const netOcc = YRS.map((_, i) => (BL.cluster1.censusBeds[i] * BL.cluster1.occupancyPct[i] + BL.cluster2.censusBeds[i] * BL.cluster2.occupancyPct[i]) / netBeds[i]);
const netArpob = YRS.map((_, i) => (c1F[i] + c2F[i]) * 1e7 / (netBeds[i] * 365 * netOcc[i] / 100));
const OBD26 = 614973; // FY26 occupied bed-days (Q4FY26 deck p.48)
const hospRev26 = OBD26 * AK.at(-1).arpob / 1e7; // = AR in-patient + out-patient revenue (₹4,093 cr)
const other26 = A.sales[b] - hospRev26;

// Rent and lease liabilities (FY26 from AR; FY27-29E GAM estimates; used only to translate between bases)
const RENT = { FY26: 46.7, FY27E: 52, FY28E: 57, FY29E: 62 };
const LEASE = { FY26: 559, FY27E: 590, FY28E: 620, FY29E: 650 };
const preEbitda = YRS.map((y, i) => F.ebitda[i] - RENT[y]), preMargin = YRS.map((_, i) => preEbitda[i] / F.sales[i] * 100);

// Price, model outputs
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const evMult = mv('ev').mult, ebitdaSep28 = mv('ev').metric, peMult = mv('pe').mult, epsSep28 = mv('pe').metric;
const treasurySep28 = (F.treasury[1] + F.treasury[2]) / 2, evTarget = evMult * ebitdaSep28;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, ebitdaCagrFwd = (Math.pow(F.ebitda[2] / A.ebitda[b], 1 / 3) - 1) * 100;
const ebitdaCagrHist = (Math.pow(A.ebitda[b] / A.ebitda[b - 3], 1 / 3) - 1) * 100, salesCagrHist = (Math.pow(A.sales[b] / A.sales[b - 3], 1 / 3) - 1) * 100;
const netDebtLeases = A.borrowings[b] - (A.cash[b] || 0) - (A.investments[b] || 0) - AS.otherTreasury.base; // Mar-26

// One-year-forward EV/EBITDA since listing: EV = price x shares + borrowings incl. lease liabilities - cash,
// investments and bank deposits in other financial assets (latest March balance sheet public by then; Mar-23
// used from listing); EBITDA (Screener basis) of the next full fiscal year (actual, then our estimates).
const DEPOSITS = { 2023: 33, 2024: 16, 2025: 15, 2026: AS.otherTreasury.base }; // company cash less Screener cash + investments
const ebBy = {}; A.labels.forEach((l, i) => (ebBy[2000 + +l.slice(2)] = A.ebitda[i])); YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ndFy = fy => { const i = ix('FY' + String(fy).slice(2)); return A.borrowings[i] - (A.cash[i] || 0) - (A.investments[i] || 0) - (DEPOSITS[fy] || 0); };
const ndAt = d => { let fy = +d.slice(0, 4); if (d < `${fy}-05-30`) fy -= 1; return ndFy(Math.max(fy, 2023)); };
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const fwdEv = M.price.series.filter(([d]) => d >= LISTED && d <= ASOF).filter((_, i, a) => i % 5 === 0 || i === a.length - 1)
  .map(([d, p]) => [d, Math.round((p * F.shares + ndAt(d)) / ebBy[fyOf(d)] * 10) / 10]);
const stat = arr => { const v = arr.slice().sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const HEV = stat(fwdEv.map(x => x[1]));
const HEVy = y => stat(fwdEv.filter(x => x[0].startsWith(y)).map(x => x[1]));
const evNow = (mcap + netDebtLeases) / F.ebitda[1], evNow27 = (mcap + netDebtLeases) / F.ebitda[0];
const troughEv = fwdEv.filter(([d]) => { const fy = fyOf(d), pk = Math.max(ebBy[fy - 1] || 0, ebBy[fy - 2] || 0, ebBy[fy - 3] || 0); return !(ebBy[fy] > 0) || ebBy[fy] < 0.5 * pk; }).length;
const FM = forwardMedian('MEDANTA', M, { from: LISTED });
const fwdPe = forwardSeries('MEDANTA', M, 'eps').filter(x => x[0] >= LISTED);
const peNow = price / F.eps[1];

// Peers at the 30-Sep-2026 close; de-rating = trailing multiple vs its own five-year median (Screener)
const PEER_SYMS = ['MEDANTA', 'APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'NH', 'RAINBOW', 'KIMS', 'ASTERDM', 'JLHL'];
const PEERS = peersAsOf(PEER_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = (sym, chart, key) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
const MED5EV = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')])), MED5PE = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const drEv = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].evEbitda / MED5EV[s] - 1) * 100])), drPe = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].pe / MED5PE[s] - 1) * 100]));
const CORE = ['APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'NH', 'RAINBOW', 'JLHL'], LEFT_OUT = ['KIMS', 'ASTERDM'];
const median = a => { const v = a.slice().sort((x, y) => x - y), k = v.length; return k % 2 ? v[(k - 1) / 2] : (v[k / 2 - 1] + v[k / 2]) / 2; };
const sectorDrEv = median(CORE.map(s => drEv[s])), sectorDrPe = median(CORE.map(s => drPe[s])), allDrEv = median(PEER_SYMS.filter(s => s !== 'MEDANTA').map(s => drEv[s]));
const evAfter = HEV.med * (1 + sectorDrEv / 100), peAfter = FM.median * (1 + sectorDrPe / 100);
const shortName = s => ({ MEDANTA: 'Medanta', APOLLOHOSP: 'Apollo Hospitals', MAXHEALTH: 'Max Healthcare', FORTIS: 'Fortis', NH: 'Narayana Hrudayalaya', KIMS: 'KIMS', ASTERDM: 'Aster DM', RAINBOW: 'Rainbow', JLHL: 'Jupiter Life Line' }[s] || s);

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026; PL's multiple (EV without leases) translated to our basis (EV with leases)
const ST = D.street.brokers, byB = n => ST.find(s => s.broker === n);
const pl = byB('Prabhudas Lilladher'), mosl = byB('Motilal Oswal'), choice = byB('Choice Institutional Equities'), ar = byB('Anand Rathi');
const postQ1 = ST.filter(s => s.date >= '2026-07-30'), avgPost = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length;
const plSep28 = (pl.ebitda.FY28E + pl.ebitda.FY29E) / 2, leaseSep28 = (LEASE.FY28E + LEASE.FY29E) / 2;
const plOurBasis = (28 * plSep28 + leaseSep28) / plSep28, ourExLease = (evTarget - leaseSep28) / ebitdaSep28;

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, LISTED, n0, n1, pc, pc1, rup, SRC, shortDate, SA, SQ, QL, Q1, FY26, AK, CL, b, ix, YRS,
  BL, c1F, c2F, otherF, netBeds, netOcc, netArpob, hospRev26, other26, RENT, LEASE, preEbitda, preMargin, price, mcap, mv, evMult, ebitdaSep28, peMult, epsSep28, treasurySep28, evTarget,
  epsCagrFwd, ebitdaCagrFwd, ebitdaCagrHist, salesCagrHist, netDebtLeases, fwdEv, HEV, HEVy, evNow, evNow27, troughEv, FM, fwdPe, peNow,
  PEER_SYMS, PEERS, P, MED5EV, MED5PE, drEv, drPe, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, allDrEv, evAfter, peAfter, shortName, rating, buyBelow, sellAbove,
  ST, pl, mosl, choice, ar, postQ1, avgPost, plSep28, leaseSep28, plOurBasis, ourExLease };
