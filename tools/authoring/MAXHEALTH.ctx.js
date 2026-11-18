// Max Healthcare initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and
// the built model, checks the bed build against model revenue, and computes the valuation inputs once: forward EV/EBITDA
// history since Apr-2021 (MHIL consolidated EBITDA, post-Ind AS 116, net debt incl. lease liabilities), forward P/E on
// reported and one-off-adjusted EPS, peer de-rating, the street table translated from Network to consolidated EBITDA,
// and the discount rate the share price implies in our DCF. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'MAXHEALTH', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'MAXHEALTH.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'MAXHEALTH', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs /g, '₹');
const SRC = 'Max Healthcare presentations, earnings calls and annual reports; GAM Research';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, NP = C.networkPL, AK = C.annualKpis, QK = C.quarterlyKpis;
const b = A.labels.length - 1; // FY26 index in actuals
const ix = fy => A.labels.indexOf(fy);
const YRS = F.years;

// Bed build (assumptions.businessLines) must equal model revenue (MHIL consolidated)
const BL = AS.businessLines, NW = BL.network;
const obd = YRS.map((_, i) => NW.avgOpBeds[i] * 365 * NW.occupancyPct[i] / 100);
const hospGross = YRS.map((_, i) => obd[i] * NW.arpob[i] / 1e7);
const netGross = YRS.map((_, i) => hospGross[i] + BL.maxLab[i]);
const netNet = YRS.map((_, i) => netGross[i] * BL.grossToNet[i]);
const consRev = YRS.map((_, i) => netNet[i] * BL.consShare[i]);
YRS.forEach((y, i) => { if (Math.abs(consRev[i] / F.sales[i] - 1) > 0.003) throw new Error(`MAXHEALTH bed build ${y}: ${n0(consRev[i])} != model revenue ${n0(F.sales[i])}`); });
const OBD26 = (NP.FY26.gross - AK[3].maxLabNetRev) * 1e7 / AK[3].arpob, BEDS26 = OBD26 / 365 / (AK[3].occupancyPct / 100);
const OBD25 = (NP.FY25.gross - 175) * 1e7 / AK[2].arpob, BEDS25 = OBD25 / 365 / (AK[2].occupancyPct / 100); // Max Lab FY25 ~₹175 cr (deck chart)
const OBDQ1 = (Q1.grossRevenue - QK[4].maxLabNetRev) * 1e7 / Q1.arpob, BEDSQ1 = OBDQ1 / 91 / (Q1.occupancyPct / 100);

// Network-equivalent EBITDA: consolidated (Screener) EBITDA was 85.0% of Network operating EBITDA in FY26 (2,243 / 2,638)
// and 84.9% in Q1FY27 (598 / 704); used only to compare our forecasts with brokers' Network numbers.
const CONS_TO_NET = A.ebitda[b] / NP.FY26.opEbitda;
const netEqEbitda = F.ebitda.map(e => e / CONS_TO_NET);

// Price, model outputs
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const evMult = mv('ev').mult, ebitdaSep28 = mv('ev').metric, peMult = mv('pe').mult, epsSep28 = mv('pe').metric;
const roll = arr => (arr[1] + arr[2]) / 2;
const treasurySep28 = roll(F.treasury), evTarget = evMult * ebitdaSep28;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, ebitdaCagrFwd = (Math.pow(F.ebitda[2] / A.ebitda[b], 1 / 3) - 1) * 100;
const ebitdaCagrHist = (Math.pow(A.ebitda[b] / A.ebitda[b - 3], 1 / 3) - 1) * 100, salesCagrHist = (Math.pow(A.sales[b] / A.sales[b - 3], 1 / 3) - 1) * 100;
const netDebt26 = A.borrowings[b] - (A.cash[b] || 0) - (A.investments[b] || 0); // Mar-26, incl. leases
const EPS_ADJ = { FY23: (1104 - 244) / 97.14, FY24: 10.88, FY25: (1076 + 56 - 18) / 97.2, FY26: (1442 - 142 + 41) / 97.33 }; // ex one-offs (company notes)
const epsAdj26 = EPS_ADJ.FY26, epsCagrAdj = (Math.pow(F.eps[2] / epsAdj26, 1 / 3) - 1) * 100;

// One-year-forward EV/EBITDA since Apr-2021: EV = price x shares + borrowings (incl. lease liabilities) - cash and
// investments (latest March balance sheet public by then); EBITDA of the next full fiscal year (actual, then our
// estimates), as forwardSeries does for P/E.
const ebBy = {}; A.labels.forEach((l, i) => (ebBy[2000 + +l.slice(2)] = A.ebitda[i])); YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ndFy = fy => { const i = ix('FY' + String(fy).slice(2)); return A.borrowings[i] - (A.cash[i] || 0) - (A.investments[i] || 0); };
const ndAt = d => { let fy = +d.slice(0, 4); if (d < `${fy}-05-30`) fy -= 1; return ndFy(fy); };
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const fwdEvAll = M.price.series.filter(([d]) => d >= '2021-04-01' && d <= ASOF).map(([d, p]) => [d, Math.round((p * F.shares + ndAt(d)) / ebBy[fyOf(d)] * 10) / 10]);
const fwdEv = fwdEvAll.filter((_, i, a) => i % 5 === 0 || i === a.length - 1);
const stat = arr => { const v = arr.slice().sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const HEV = stat(fwdEvAll.map(x => x[1]));
const HEVy = y => stat(fwdEvAll.filter(x => x[0].startsWith(y)).map(x => x[1]));
const evNow = (mcap + netDebt26) / F.ebitda[1], evNow27 = (mcap + netDebt26) / F.ebitda[0];
const troughEv = fwdEvAll.filter(([d]) => { const fy = fyOf(d), pk = Math.max(ebBy[fy - 1] || 0, ebBy[fy - 2] || 0, ebBy[fy - 3] || 0); return !(ebBy[fy] > 0) || ebBy[fy] < 0.5 * pk; }).length;
const FM = forwardMedian('MAXHEALTH', M);
const fwdPe = forwardSeries('MAXHEALTH', M, 'eps').filter(x => x[0] >= '2021-04-01');
const epsAdjBy = { 2023: EPS_ADJ.FY23, 2024: EPS_ADJ.FY24, 2025: EPS_ADJ.FY25, 2026: EPS_ADJ.FY26 }; YRS.forEach((y, i) => (epsAdjBy[2000 + +y.slice(2, 4)] = F.eps[i]));
const fwdPeAdj = S.charts.price.Price.filter(([d]) => d >= '2021-04-01' && d <= ASOF).filter((_, i) => i % 5 === 0).map(([d, p]) => [d, Math.round(p / epsAdjBy[fyOf(d)] * 10) / 10]);
const HPEA = stat(fwdPeAdj.map(x => x[1]));
const peNow = price / F.eps[1];

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, SRC, shortDate, SA, SQ, QL, Q1, NP, AK, QK, b, ix, YRS,
  BL, NW, obd, hospGross, netGross, netNet, consRev, OBD26, BEDS26, OBD25, BEDS25, BEDSQ1, CONS_TO_NET, netEqEbitda, price, mcap, mv, evMult, ebitdaSep28, peMult, epsSep28,
  treasurySep28, evTarget, epsCagrFwd, ebitdaCagrFwd, ebitdaCagrHist, salesCagrHist, netDebt26, EPS_ADJ, epsAdj26, epsCagrAdj, fwdEv, fwdEvAll, HEV, HEVy, evNow, evNow27, troughEv,
  FM, fwdPe, fwdPeAdj, HPEA, peNow, stat };
Object.assign(module.exports, require('./MAXHEALTH.ctx2')(module.exports));
