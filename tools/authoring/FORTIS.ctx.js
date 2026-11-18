// Fortis Healthcare initiation: shared context for the Part B files (research.js, part2-6). Loads the research
// JSONs and the built model, checks the bed build against model hospital revenue, and computes the valuation
// inputs once: forward EV/EBITDA history since Apr-2021 (post-Ind AS EBITDA, lease liabilities and minorities in
// EV), forward P/E (forwardMedian), hospital and diagnostics peer de-rating, street table. As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'FORTIS', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'FORTIS.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs /g, '₹');
const SRC = 'Fortis Healthcare presentations, earnings calls and annual report; GAM Research';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, AK = C.annualKpis;
const b = A.labels.length - 1; // FY26 index in actuals
const ix = fy => A.labels.indexOf(fy);
const YRS = F.years;
const SEG = F.seg, HS = SEG.hosp, DG = SEG.diag, EL = SEG.elim;

// Bed build (assumptions.businessLines) must equal model hospital revenue
const BL = AS.businessLines, COH = ['mature', 'rampUp', 'newBeds'];
const occB = (g, i) => BL[g].opBeds[i] * BL[g].occupancyPct[i] / 100;
const cohRev = (g, i) => occB(g, i) * BL[g].arpob[i] * BL.conversion[i];
const REV = Object.fromEntries(COH.map(g => [g, YRS.map((_, i) => cohRev(g, i))]));
YRS.forEach((y, i) => { const s = COH.reduce((t, g) => t + REV[g][i], 0); if (Math.abs(s / HS.revenue[i] - 1) > 0.003) throw new Error(`FORTIS bed build ${y}: ${n0(s)} != model hospital revenue ${n0(HS.revenue[i])}`); });
const netBeds = YRS.map((_, i) => COH.reduce((t, g) => t + BL[g].opBeds[i], 0));
const netOccBeds = YRS.map((_, i) => COH.reduce((t, g) => t + occB(g, i), 0));
const netOcc = YRS.map((_, i) => netOccBeds[i] / netBeds[i] * 100);
const netArpob = YRS.map((_, i) => COH.reduce((t, g) => t + occB(g, i) * BL[g].arpob[i], 0) / netOccBeds[i]);
const hospM = YRS.map((_, i) => HS.adjEbitda[i] / HS.revenue[i] * 100), diagM = YRS.map((_, i) => DG.adjEbitda[i] / DG.revenue[i] * 100);
const ESOP = AS.esop, postEsopHospM = YRS.map((_, i) => (HS.adjEbitda[i] - ESOP[i]) / HS.revenue[i] * 100);
const ebitdaPerBed = YRS.map((_, i) => HS.adjEbitda[i] / netBeds[i] * 100); // ₹ lakh per operational bed

// Leases: pre-Ind AS view (lease cash outflow FY26 ₹99.6 cr, AR note 10; FY27-29E GAM estimate)
const RENT = { FY26: 99.6, FY27E: 104, FY28E: 108, FY29E: 112 };
const preEbitda = YRS.map((y, i) => F.ebitda[i] - RENT[y]), preMargin = YRS.map((_, i) => preEbitda[i] / F.sales[i] * 100);

// Price, SOTP pieces
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const SP = V.sotp.parts, part = re => SP.find(p => re.test(p.name));
const pHosp = part(/^Hospitals/), pEsop = part(/ESOP/), pDiag = part(/^Diagnostics/), pMin = part(/minority/), pNet = part(/Net debt/);
const hospMult = pHosp.mult, diagMult = pDiag.mult, peMult = mv('pe').mult, epsSep28 = mv('pe').metric;
const roll = arr => (arr[1] + arr[2]) / 2;
const hospSep28 = roll(HS.adjEbitda), diagSep28 = roll(DG.adjEbitda), esopSep28 = roll(ESOP), ebitdaSep28 = roll(F.ebitda);
const minCheck = -0.1168 * diagSep28 * diagMult;
if (Math.abs(minCheck - pMin.adj) > 15) console.warn(`FORTIS: Agilus minority adj ${pMin.adj} vs 11.68% x value ${Math.round(minCheck)} - update assumptions`);
const AGILUS = { stake: 88.32, minority: 11.68, buyoutCr: 1777.7, buyoutPct: 31.21, implied100: 1777.7 / 0.3121 };
const nciImplied = AGILUS.minority / 100 * AGILUS.implied100 + 20; // Agilus minority at the FY25 buyout value + ~₹20 cr of other minorities

// One-year-forward EV/EBITDA since Apr-2021: EV = price x shares + borrowings (incl. leases since FY20) - cash -
// investments + minorities (Agilus at the value implied by the FY25 buyout; book for the variant); EBITDA of the next
// full fiscal year (Screener operating profit, then our estimates), as forwardSeries does for P/E.
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'FORTIS', 'screener.json'), 'utf8'));
const nciBook = S.schedules['balance-sheet']['Other Liabilities']['Non controlling int'];
const ebBy = {}; A.labels.forEach((l, i) => (ebBy[2000 + +l.slice(2)] = A.ebitda[i])); YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ndFy = (fy, implied) => { const i = ix('FY' + String(fy).slice(2)); const book = nciBook[`Mar ${fy}`] || 0; const agl = fy <= 2024 ? 0.4289 * AGILUS.implied100 + 40 : nciImplied; return A.borrowings[i] - (A.cash[i] || 0) - (A.investments[i] || 0) + (implied ? Math.max(book, agl) : book); };
const ndAt = (d, implied) => { let fy = +d.slice(0, 4); if (d < `${fy}-05-30`) fy -= 1; return ndFy(fy, implied); };
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const pxs = M.price.series.filter(([d]) => d >= '2021-04-01' && d <= ASOF).filter((_, i, a) => i % 5 === 0 || i === a.length - 1);
const fwdEv = pxs.map(([d, p]) => [d, Math.round((p * F.shares + ndAt(d, true)) / ebBy[fyOf(d)] * 10) / 10]);
const fwdEvBook = pxs.map(([d, p]) => [d, Math.round((p * F.shares + ndAt(d, false)) / ebBy[fyOf(d)] * 10) / 10]);
const stat = arr => { const v = arr.slice().sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const HEV = stat(fwdEv.map(x => x[1])), HEVbook = stat(fwdEvBook.map(x => x[1]));
const HEVy = y => stat(fwdEv.filter(x => x[0].startsWith(y)).map(x => x[1]));
const troughEv = fwdEv.filter(([d]) => { const fy = fyOf(d), pk = Math.max(ebBy[fy - 1] || 0, ebBy[fy - 2] || 0, ebBy[fy - 3] || 0); return !(ebBy[fy] > 0) || ebBy[fy] < 0.5 * pk; }).length;
const netDebtMar26 = -((A.cash[b] || 0) + (A.investments[b] || 0) - A.borrowings[b]);
const evToday = mcap + netDebtMar26 + nciImplied;
const evNow = evToday / F.ebitda[1], evNow27 = evToday / F.ebitda[0], evNowSep28 = evToday / ebitdaSep28;
const FM = forwardMedian('FORTIS', M);
const fwdPe = forwardSeries('FORTIS', M, 'eps').filter(x => x[0] >= '2021-04-01');
const peNow = price / F.eps[1], peNow27 = price / F.eps[0];
const HPE = y => stat(fwdPe.filter(x => x[0].startsWith(y)).map(x => x[1]));

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, n2, pc, pc1, rup, SRC, shortDate, SA, SQ, QL, Q1, FY26, AK, b, ix, YRS, SEG, HS, DG, EL,
  BL, COH, REV, netBeds, netOccBeds, netOcc, netArpob, hospM, diagM, ESOP, postEsopHospM, ebitdaPerBed, RENT, preEbitda, preMargin, price, mcap, mv, SP, pHosp, pEsop, pDiag, pMin, pNet,
  hospMult, diagMult, peMult, epsSep28, hospSep28, diagSep28, esopSep28, ebitdaSep28, AGILUS, nciImplied, fwdEv, fwdEvBook, HEV, HEVbook, HEVy, troughEv, netDebtMar26, evToday, evNow, evNow27, evNowSep28,
  FM, fwdPe, peNow, peNow27, HPE, stat };
Object.assign(module.exports, require('./FORTIS.ctx2'));
