// Narayana Hrudayalaya initiation: shared context for the Part B files (research.js, part2-6). Loads the research
// JSONs and the built model, checks the business-line build against model revenue (segment by segment), and
// computes the valuation inputs once: forward EV/EBITDA history since Apr-2021 (post-Ind AS EBITDA, lease
// liabilities in net debt, adjusted for the Nov-2025 UK deal), forward P/E (forwardMedian), peer de-rating,
// the India/Cayman multiple split, SOTP parts and the street table. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'NH', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'NH.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs /g, '₹');
const SRC = 'Narayana Hrudayalaya presentations, earnings calls and annual reports; GAM Research';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26;
const ann = fy => SA.find(a => a.fy === fy), qtr = q => SQ.find(x => x.q === q);
const b = A.labels.length - 1, ix = fy => A.labels.indexOf(fy), YRS = F.years;
const SEG = F.seg, segE = k => SEG[k].adjEbitda, segR = k => SEG[k].revenue;

// Business-line build (assumptions.businessLines) must equal each segment's model revenue and sum to model revenue
const BL = AS.businessLines, FX = BL.fx;
const build = {
  ind: YRS.map((_, i) => BL.india.occupiedBeds[i] * BL.india.arpobMn[i] / 10 - BL.india.intercoCr[i]),
  cay: YRS.map((_, i) => BL.cayman.hospUsdMnNet[i] * FX.usd / 10), cihl: YRS.map((_, i) => BL.cihl.usdMn[i] * FX.usd / 10),
  uk: YRS.map((_, i) => BL.uk.gbpMn[i] * FX.gbp / 10), ic: YRS.map((_, i) => BL.indiaCare.clinicsCr[i] + BL.indiaCare.nhilCr[i]), elim: BL.elimCr,
};
for (const k of Object.keys(build)) YRS.forEach((y, i) => { if (Math.abs(build[k][i] - segR(k)[i]) > Math.max(1, Math.abs(segR(k)[i]) * 0.003)) throw new Error(`NH build ${k} ${y}: ${n0(build[k][i])} != model ${n0(segR(k)[i])}`); });
YRS.forEach((y, i) => { const s = Object.values(build).reduce((t, a) => t + a[i], 0); if (Math.abs(s / F.sales[i] - 1) > 0.003) throw new Error(`NH build total ${y}: ${n0(s)} != model revenue ${n0(F.sales[i])}`); });
const indHospCo = YRS.map((_, i) => BL.india.occupiedBeds[i] * BL.india.arpobMn[i] / 10); // company-basis India hospital revenue
const occPct = YRS.map((_, i) => BL.india.occupiedBeds[i] / BL.india.opBedsAvg[i] * 100);
YRS.forEach((y, i) => { const e = segE('cihl')[i] * 10 / FX.usd; if (Math.abs(e - BL.cihl.ebitdaUsdMn[i]) > 0.05) throw new Error(`NH CIHL EBITDA ${y}`); if (Math.abs(segE('ic')[i] - BL.indiaCare.ebitdaCr[i]) > 0.5) throw new Error(`NH India care EBITDA ${y}`); });

// Rent (lease payments) to translate post-Ind AS EBITDA to the pre-Ind AS basis: FY26 actual; FY27E = contractual
// rent due within one year (AR FY26 note 18); then +8% a year for new leases (GAM estimate)
const RENT = { FY26: 128.2, FY27E: 162, FY28E: 175, FY29E: 189 };
const LEASE = { FY26: 991.4 };
const preEbitda = YRS.map((y, i) => F.ebitda[i] - RENT[y]), preMargin = YRS.map((_, i) => preEbitda[i] / F.sales[i] * 100);

// Price, model outputs
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const peMult = mv('pe').mult, epsSep28 = mv('pe').metric;
const SP = V.sotp.parts, part = n => SP.find(p => p.name.startsWith(n));
const pInd = part('India hospitals'), pIc = part('Less: India clinics'), pCay = part('Cayman hospitals'), pCihl = part('Less: Cayman insurance'), pUk = part('UK'), pNd = part('Less: net debt');
// Start-up losses: PV of losses still to come until breakeven (NH.losspv.js); check the adj values in assumptions.json
const { pvLosses } = require('./NH.losspv');
const LPV = Object.fromEntries(['ic', 'cihl'].map(k => [k, Object.fromEntries(['base', 'bull', 'bear'].map(c => [c, pvLosses(AS, k, c)]))]));
for (const k of ['ic', 'cihl']) for (const c of ['base', 'bull', 'bear']) { const p = AS.valuation.parts.find(x => x.lossKey === k); if (Math.abs(p.adj[c] - LPV[k][c].pv) > 0.2) throw new Error(`NH loss PV ${k} ${c}: adj ${p.adj[c]} vs ${LPV[k][c].pv.toFixed(1)}`); }
const roll = arr => (arr[1] + arr[2]) / 2, icSep28 = roll(segE('ic')), cihlSep28 = roll(segE('cihl'));
const lossPvTot = pIc.value + pCihl.value, oldLossCharge = icSep28 * 17 + cihlSep28 * 10.5; // memo: the perpetuity treatment this replaced
const IND_X = pInd.mult, CAY_X = pCay.mult, UK_X = pUk.mult;
const segEv = pInd.value + pCay.value + pUk.value, ebitdaSep28 = pInd.metric + pCay.metric + pUk.metric; // profitable businesses valued on multiples
const ebitdaSep28All = ebitdaSep28 + icSep28 + cihlSep28;
const blendX = segEv / ebitdaSep28;
const sotpBull = SC.bull.blend.methods.find(m => m.key === 'sotp'), sotpBear = SC.bear.blend.methods.find(m => m.key === 'sotp');
const netDebtMar26 = A.borrowings[b] - (A.cash[b] || 0) - (A.investments[b] || 0);
const evNow = mcap + netDebtMar26, evNow28 = evNow / F.ebitda[1], evNow27 = evNow / F.ebitda[0], evNowSep28 = evNow / ebitdaSep28All;
const impliedInd = (mcap + netDebtMar26 - pCay.value - pUk.value - lossPvTot) / pInd.metric; // what today's EV pays for India (Cayman, UK at our multiples)
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, ebitdaCagrFwd = (Math.pow(F.ebitda[2] / A.ebitda[b], 1 / 3) - 1) * 100;
const ebitdaCagrHist = (Math.pow(A.ebitda[b] / A.ebitda[b - 3], 1 / 3) - 1) * 100, salesCagrHist = (Math.pow(A.sales[b] / A.sales[b - 3], 1 / 3) - 1) * 100;
const segCagr = k => (Math.pow(segE(k)[2] / ann('FY26')[k + 'Ebitda'], 1 / 3) - 1) * 100;
const indCagr = segCagr('ind'), cayCagr = segCagr('cay'), growthRatio = cayCagr / indCagr;

// One-year-forward EV/EBITDA since Apr-2021: EV = price × shares + borrowings incl. leases − cash and investments
// (latest March balance sheet public by then; the Mar-26 balance sheet, which carries the UK acquisition debt and
// leases, is used from the deal date of 6-Nov-2025); EBITDA of the next full fiscal year (actual, then ours). For dates
// before the deal, forward EBITDA excludes the UK (FY26: UK EBITDA net of the one-time cost; FY27E: model UK).
const DEAL = '2025-11-06';
const ebBy = {}; A.labels.forEach((l, i) => (ebBy[2000 + +l.slice(2)] = A.ebitda[i])); YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ukBy = { 2026: ann('FY26').ukEbitda - FY26.oneTimeAcqCostCr, 2027: segE('uk')[0] };
const ndBy = {}; A.labels.forEach((l, i) => (ndBy[2000 + +l.slice(2)] = A.borrowings[i] - (A.cash[i] || 0) - (A.investments[i] || 0)));
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const ndAt = d => { if (d >= DEAL && d < '2026-05-30') return ndBy[2026]; let fy = +d.slice(0, 4); if (d < `${fy}-05-30`) fy -= 1; return ndBy[fy]; };
const ebAt = d => { const fy = fyOf(d); return d < DEAL && ukBy[fy] != null ? ebBy[fy] - ukBy[fy] : ebBy[fy]; };
const troughFy = fy => { const p = [ebBy[fy - 1], ebBy[fy - 2], ebBy[fy - 3]].filter(v => v != null); return !(ebBy[fy] > 0) || ebBy[fy] < 0.5 * Math.max(...p); };
const fwdEvAll = M.price.series.filter(([d]) => d >= '2021-04-01' && d <= ASOF).filter((_, i, a) => i % 5 === 0 || i === a.length - 1)
  .map(([d, p]) => [d, Math.round((p * F.shares + ndAt(d)) / ebAt(d) * 10) / 10, troughFy(fyOf(d))]);
const fwdEv = fwdEvAll.map(x => [x[0], x[1]]), troughEv = fwdEvAll.filter(x => x[2]).length;
const stat = arr => { const v = arr.slice().sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const HEV = stat(fwdEvAll.filter(x => !x[2]).map(x => x[1]));
const HEVy = y => stat(fwdEv.filter(x => x[0].startsWith(y)).map(x => x[1]));
const HEVpost = stat(fwdEv.filter(x => x[0] >= DEAL).map(x => x[1]));
const FM = forwardMedian('NH', M);
const fwdPe = forwardSeries('NH', M, 'eps').filter(x => x[0] >= '2021-04-01');
const PEP = stat(fwdPe.map(x => x[1]));
const peNow = price / F.eps[1];

// Peers at the 30-Sep-2026 close; de-rating = trailing multiple vs its own five-year median (Screener)
const PEER_SYMS = ['NH', 'APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'MEDANTA', 'RAINBOW', 'JLHL', 'KIMS', 'ASTERDM'];
const PEERS = peersAsOf(PEER_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = (sym, chart, key) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
const MED5EV = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')])), MED5PE = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const drEv = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].evEbitda / MED5EV[s] - 1) * 100])), drPe = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].pe / MED5PE[s] - 1) * 100]));
const CORE = ['APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'MEDANTA', 'RAINBOW', 'JLHL'], LEFT_OUT = ['KIMS', 'ASTERDM'];
const median = a => { const v = a.slice().sort((x, y) => x - y), k = v.length; return k % 2 ? v[(k - 1) / 2] : (v[k / 2 - 1] + v[k / 2]) / 2; };
const sectorDrEv = median(CORE.map(s => drEv[s])), sectorDrPe = median(CORE.map(s => drPe[s])), allDrEv = median(PEER_SYMS.filter(s => s !== 'NH').map(s => drEv[s]));
const coreEvNow = median(CORE.map(s => P[s].evEbitda)), coreEv5 = median(CORE.map(s => MED5EV[s]));
const anchorX = HEV.med * (1 + sectorDrEv / 100), anchorBull = HEV.p75, anchorBear = HEV.p25, peAfter = FM.median * (1 + sectorDrPe / 100);
// India/Cayman split: FY25-26 EBITDA mix of the two businesses (PL basis, losses included) and Cayman at growthRatio × India
const a25 = ann('FY25'), a26 = ann('FY26');
const mixInd = (a25.indEbitda + a25.icEbitda + a26.indEbitda + a26.icEbitda) / (a25.indEbitda + a25.icEbitda + a26.indEbitda + a26.icEbitda + a25.cayEbitda + a26.cayEbitda + a26.cihlEbitda);
const RATIO = 0.6, indImplied = anchorX / (mixInd + (1 - mixInd) * RATIO), cayImplied = indImplied * RATIO;
const shortName = s => ({ NH: 'Narayana', APOLLOHOSP: 'Apollo', MAXHEALTH: 'Max', FORTIS: 'Fortis', MEDANTA: 'Medanta', RAINBOW: 'Rainbow', JLHL: 'Jupiter', KIMS: 'KIMS', ASTERDM: 'Aster DM' }[s] || s);

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, byB = n => ST.find(s => s.broker.startsWith(n));
const pl = byB('Prabhudas'), idir = byB('ICICI Direct'), kotak = byB('Kotak'), hsbc = byB('HSBC');
const postQ1 = ST.filter(s => s.date >= '2026-08'), avgPost = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length;
const CONS = D.street.consensus;
// ICICI Direct's FY28E SOTP on our basis: their EV less leases they leave out
const idirEv = idir.segEbitdaFY28E.india * 24 + idir.segEbitdaFY28E.cayman * 16 + idir.segEbitdaFY28E.uk * 4;

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, SRC, shortDate, SA, SQ, QL, Q1, FY26, ann, qtr, b, ix, YRS, SEG, segE, segR,
  BL, FX, build, indHospCo, occPct, RENT, LEASE, preEbitda, preMargin, price, mcap, BM, mv, peMult, epsSep28, SP, pInd, pIc, pCay, pCihl, pUk, pNd, LPV, icSep28, cihlSep28, lossPvTot, oldLossCharge, ebitdaSep28All, IND_X, CAY_X, UK_X, segEv, ebitdaSep28, blendX, sotpBull, sotpBear,
  netDebtMar26, evNow, evNow28, evNow27, evNowSep28, impliedInd, epsCagrFwd, ebitdaCagrFwd, ebitdaCagrHist, salesCagrHist, indCagr, cayCagr, growthRatio,
  DEAL, fwdEv, troughEv, HEV, HEVy, HEVpost, FM, fwdPe, PEP, peNow, PEER_SYMS, PEERS, P, MED5EV, MED5PE, drEv, drPe, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, allDrEv, coreEvNow, coreEv5,
  anchorX, anchorBull, anchorBear, peAfter, mixInd, RATIO, indImplied, cayImplied, shortName, rating, buyBelow, sellAbove, ruleText, ST, pl, idir, kotak, hsbc, postQ1, avgPost, CONS, idirEv };
