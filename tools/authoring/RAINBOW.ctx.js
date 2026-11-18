// Rainbow Children's Medicare initiation: shared context for the Part B files (research.js, part2-6). Loads
// the research JSONs and the built model, checks the bed build against model revenue, and computes the
// valuation inputs once: forward EV/EBITDA history since listing (post-Ind AS 116 EBITDA, lease liabilities
// in net debt), forward P/E (forwardMedian), peer de-rating, street table. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'RAINBOW', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'RAINBOW.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs /g, '₹');
const SRC = 'Rainbow Children\'s Medicare presentations, earnings calls and annual reports; GAM Research';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, AK = C.annualKpis;
const b = A.labels.length - 1; // FY26 index in actuals
const ix = fy => A.labels.indexOf(fy);
const YRS = F.years;

// Bed build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines;
const grpRev = (g, i) => g.opBeds[i] * 365 * g.occupancyPct[i] / 100 * g.arpob[i] / 1e7;
const matF = YRS.map((_, i) => grpRev(BL.mature, i)), newF = YRS.map((_, i) => grpRev(BL.newUnits, i));
const pipeF = YRS.map(y => Object.values(BL.pipeline[y]).reduce((s, x) => s + x, 0));
YRS.forEach((y, i) => { const s = matF[i] + newF[i] + pipeF[i]; if (Math.abs(s / F.sales[i] - 1) > 0.003) throw new Error(`RAINBOW bed build ${y}: ${n0(s)} != model revenue ${n0(F.sales[i])}`); });
const coreBeds = YRS.map((_, i) => BL.mature.opBeds[i] + BL.newUnits.opBeds[i]);
const coreOcc = YRS.map((_, i) => (BL.mature.opBeds[i] * BL.mature.occupancyPct[i] + BL.newUnits.opBeds[i] * BL.newUnits.occupancyPct[i]) / coreBeds[i]);
const coreArpob = YRS.map((_, i) => (matF[i] + newF[i]) * 1e7 / (coreBeds[i] * 365 * coreOcc[i] / 100));

// Rent and lease liabilities (GAM estimates; used only to translate pre-Ind AS figures)
const RENT = { FY26: 95.6, FY27E: 108, FY28E: 120, FY29E: 132 };
const LEASE = { FY26: 891, FY27E: 970, FY28E: 1066, FY29E: 1138 };
const preEbitda = YRS.map((y, i) => F.ebitda[i] - RENT[y]), preMargin = YRS.map((_, i) => preEbitda[i] / F.sales[i] * 100);

// Price, model outputs
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const evMult = mv('ev').mult, ebitdaSep28 = mv('ev').metric, peMult = mv('pe').mult, epsSep28 = mv('pe').metric;
const roll = arr => (arr[1] + arr[2]) / 2;
const treasurySep28 = roll(F.treasury), evTarget = evMult * ebitdaSep28;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, ebitdaCagrFwd = (Math.pow(F.ebitda[2] / A.ebitda[b], 1 / 3) - 1) * 100;
const ebitdaCagrHist = (Math.pow(A.ebitda[b] / A.ebitda[b - 3], 1 / 3) - 1) * 100, salesCagrHist = (Math.pow(A.sales[b] / A.sales[b - 3], 1 / 3) - 1) * 100;
const cashCo = C.cash.cashAndInvestmentsCr.at(-1).value; // Jun-26, company
const netDebtLeases = A.borrowings[b] - (A.cash[b] || 0) - (A.investments[b] || 0) - AS.otherTreasury.base; // Mar-26

// One-year-forward EV/EBITDA since listing: EV = price x shares + lease liabilities - cash, mutual funds and
// bank deposits (latest March balance sheet public by then; Mar-23 used from listing); EBITDA of the next
// full fiscal year (actual, then our estimates), as forwardSeries does for P/E.
const DEPOSITS = { 2023: 484, 2024: 188, 2025: 105, 2026: AS.otherTreasury.base }; // AR FY24, AR FY26
const ebBy = {}; A.labels.forEach((l, i) => (ebBy[2000 + +l.slice(2)] = A.ebitda[i])); YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ndFy = fy => { const i = ix('FY' + String(fy).slice(2)); return A.borrowings[i] - (A.cash[i] || 0) - (A.investments[i] || 0) - (DEPOSITS[fy] || 0); };
const ndAt = d => { let fy = +d.slice(0, 4); if (d < `${fy}-05-30`) fy -= 1; return ndFy(Math.max(fy, 2023)); };
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const fwdEv = M.price.series.filter(([d]) => d >= '2022-05-10' && d <= ASOF).filter((_, i, a) => i % 5 === 0 || i === a.length - 1)
  .map(([d, p]) => [d, Math.round((p * F.shares + ndAt(d)) / ebBy[fyOf(d)] * 10) / 10]);
const stat = arr => { const v = arr.slice().sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const HEV = stat(fwdEv.map(x => x[1]));
const HEVy = y => stat(fwdEv.filter(x => x[0].startsWith(y)).map(x => x[1]));
const evNow = (mcap + netDebtLeases) / F.ebitda[1], evNow27 = (mcap + netDebtLeases) / F.ebitda[0];
const troughEv = fwdEv.filter(([d]) => { const fy = fyOf(d), pk = Math.max(ebBy[fy - 1] || 0, ebBy[fy - 2] || 0, ebBy[fy - 3] || 0); return !(ebBy[fy] > 0) || ebBy[fy] < 0.5 * pk; }).length;
const FM = forwardMedian('RAINBOW', M, { from: '2022-05-10' });
const fwdPe = forwardSeries('RAINBOW', M, 'eps').filter(x => x[0] >= '2022-05-10');
const peNow = price / F.eps[1];

// Peers at the 30-Sep-2026 close; de-rating = trailing multiple vs its own five-year median (Screener)
const PEER_SYMS = ['RAINBOW', 'APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'NH', 'MEDANTA', 'KIMS', 'ASTERDM', 'JLHL'];
const PEERS = peersAsOf(PEER_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = (sym, chart, key) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
const MED5EV = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')])), MED5PE = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const drEv = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].evEbitda / MED5EV[s] - 1) * 100])), drPe = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].pe / MED5PE[s] - 1) * 100]));
const CORE = ['APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'NH', 'MEDANTA', 'JLHL'], LEFT_OUT = ['KIMS', 'ASTERDM'];
const median = a => { const v = a.slice().sort((x, y) => x - y), k = v.length; return k % 2 ? v[(k - 1) / 2] : (v[k / 2 - 1] + v[k / 2]) / 2; };
const sectorDrEv = median(CORE.map(s => drEv[s])), sectorDrPe = median(CORE.map(s => drPe[s])), allDrEv = median(PEER_SYMS.filter(s => s !== 'RAINBOW').map(s => drEv[s]));
const evAfter = HEV.med * (1 + sectorDrEv / 100), peAfter = FM.median * (1 + sectorDrPe / 100);
const shortName = s => ({ RAINBOW: 'Rainbow', APOLLOHOSP: 'Apollo Hospitals', MAXHEALTH: 'Max Healthcare', FORTIS: 'Fortis', NH: 'Narayana Hrudayalaya', MEDANTA: 'Medanta (Global Health)', KIMS: 'KIMS', ASTERDM: 'Aster DM', JLHL: 'Jupiter Life Line' }[s] || s);

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026; pre-Ind AS multiples translated to our basis
const ST = D.street.brokers, byB = n => ST.find(s => s.broker === n);
const pl = byB('Prabhudas Lilladher'), isec = byB('ICICI Securities'), ar = byB('Anand Rathi');
const postQ1 = ST.filter(s => s.date >= '2026-08'), avgPost = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length;
const toPost = (mult, postEbitda) => (mult * (postEbitda - RENT.FY28E) + LEASE.FY28E) / postEbitda; // pre-Ind AS FY28E multiple -> post basis
const plPost = toPost(28, pl.ebitda.FY28E);
const ourPreFy28 = (evTarget - LEASE.FY28E) / preEbitda[1], ourPostFy28 = evTarget / F.ebitda[1];

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, SRC, shortDate, SA, SQ, QL, Q1, FY26, AK, b, ix, YRS,
  BL, matF, newF, pipeF, coreBeds, coreOcc, coreArpob, RENT, LEASE, preEbitda, preMargin, price, mcap, mv, evMult, ebitdaSep28, peMult, epsSep28, treasurySep28, evTarget,
  epsCagrFwd, ebitdaCagrFwd, ebitdaCagrHist, salesCagrHist, cashCo, netDebtLeases, fwdEv, HEV, HEVy, evNow, evNow27, troughEv, FM, fwdPe, peNow,
  PEER_SYMS, PEERS, P, MED5EV, MED5PE, drEv, drPe, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, allDrEv, evAfter, peAfter, shortName, rating, buyBelow, sellAbove,
  ST, pl, isec, ar, postQ1, avgPost, plPost, ourPreFy28, ourPostFy28 };
