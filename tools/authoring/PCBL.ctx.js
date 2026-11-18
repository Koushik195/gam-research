// PCBL Chemical report: shared context for PCBL.part2-4.js and PCBL.research.js (as of 30-Sep-2026).
// Loads research JSONs and the built model, and derives the numbers the prose uses (live where possible).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'PCBL', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'PCBL.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, S = M.forecast.scenarios, AS = M.forecast.assumptions;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const med = a => { const s = a.filter(x => x != null).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const ai = l => A.labels.indexOf(l);
const SA = SG.annual, SQ = SG.quarterly, ann = fy => SA.find(a => a.fy === fy);
const A26 = ann('FY26'), A25 = ann('FY25'), A24 = ann('FY24'), A21 = ann('FY21');
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, ebitdaSep28 = mv('ev').metric;
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const PE_X = mv('pe').mult, EV_X = mv('ev').mult;
const CBA = AS.segments.find(s => s.key === 'cb'), AQA = AS.segments.find(s => s.key === 'aq');

// Net debt: company definition (borrowings excl. leases less cash) and the engine's (incl. leases, less cash
// and group-company shares). Forecast F.treasury is net cash incl. the ₹464 cr of group shares.
const grpInv = C.balanceSheet.groupEquityInvestmentsMar26;
const ndEngine = i => -F.treasury[i];
const ndTrue = i => -F.treasury[i] + grpInv; // excluding group-company shares from "cash"
const ndHist = l => A.netDebt[ai(l)];
const ndE = A.labels.map((l, i) => (A.netDebt[i] != null && A.ebitda[i] > 0 ? Math.round(A.netDebt[i] / A.ebitda[i] * 10) / 10 : null));
const sepND = (ndEngine(1) + ndEngine(2)) / 2;

// Forward P/E history: house median since Apr-2021 excluding trough years; plus regime medians.
const FM = forwardMedian('PCBL', M);
const fwdPe = forwardSeries('PCBL', M, 'eps').filter(x => x[0] >= '2021-04-01');
const fwdMed = FM.median, fwdMedAll = FM.medianAll, troughTxt = FM.troughYears.join(', ');
const isTroughDate = d => d >= '2024-04-01' && d < '2025-04-01'; // forward year FY26 (EPS ₹5.0 vs ₹13.0 peak)
const preDeal = med(fwdPe.filter(x => x[0] < '2023-11-01').map(x => x[1]));
const postDeal = med(fwdPe.filter(x => x[0] >= '2023-11-01' && !isTroughDate(x[0])).map(x => x[1]));
const fwdPeNow = fwdPe.at(-1)[1];

// One-year-forward EV/EBITDA (price × shares + latest reported net debt) ÷ next full-year EBITDA.
function forwardEv() {
  const Sx = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
  const eb = {}, nd = {}, sh = A.shares.at(-1);
  A.labels.forEach((l, i) => { eb[2000 + +l.slice(2)] = A.ebitda[i]; nd[2000 + +l.slice(2)] = A.netDebt[i]; });
  F.years.forEach((y, i) => (eb[2000 + +y.slice(2, 4)] = F.ebitda[i]));
  const trough = fy => { const p = [eb[fy - 1], eb[fy - 2], eb[fy - 3]].filter(v => v != null); return !(eb[fy] > 0) || eb[fy] < 0.5 * Math.max(...p); };
  const pts = Sx.charts.price.Price.filter(([d]) => d <= ASOF && d >= '2021-04-01').filter((_, i) => i % 5 === 0).map(([d, px]) => {
    const dt = new Date(d), fy = dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1, lastFy = dt.getMonth() >= 5 ? dt.getFullYear() : dt.getFullYear() - 1;
    return [d, eb[fy] > 0 && nd[lastFy] != null ? Math.round((px * sh + nd[lastFy]) / eb[fy] * 10) / 10 : null, trough(fy)];
  }).filter(x => x[1] != null);
  return { all: pts, kept: pts.filter(x => !x[2]), troughs: pts.filter(x => x[2]).length };
}
const FEV = forwardEv();
const fwdEv = FEV.all.map(x => [x[0], x[1]]);
const fwdEvMed = med(FEV.kept.map(x => x[1]));
const fwdEvPre = med(fwdEv.filter(x => x[0] < '2023-11-01').map(x => x[1]));
const fwdEvPost = med(fwdEv.filter(x => x[0] >= '2023-11-01').map(x => x[1]));
const fwdEvNow = fwdEv.at(-1)[1];

// Peers at the 30-Sep close, and de-rating vs each one's own median since Oct-2021 (five years).
const PEER_SYMS = ['PCBL', ...D.peers];
const SHORT = { PCBL: 'PCBL', HSCL: 'Himadri', APOLLOTYRE: 'Apollo Tyres', CEATLTD: 'CEAT', AARTIIND: 'Aarti Inds', DEEPAKNTR: 'Deepak Nitrite', VINATIORGA: 'Vinati Organics' };
const PEERS = peersAsOf(PEER_SYMS, ASOF).map(p => {
  const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', p.symbol, 'screener.json'), 'utf8'));
  const w = s => (s || []).filter(([d]) => d >= '2021-10-01' && d <= ASOF).map(x => x[1]);
  const pe5 = med(w(P.charts.pe?.['Price to Earning'])), ev5 = med(w(P.charts.evEbitda?.['EV Multiple']));
  return { ...p, short: SHORT[p.symbol] || p.symbol, pe5, ev5, peVs: p.pe && pe5 ? (p.pe / pe5 - 1) * 100 : null, evVs: p.evEbitda && ev5 ? (p.evEbitda / ev5 - 1) * 100 : null };
});
const peerOnly = PEERS.filter(p => p.symbol !== 'PCBL');
const sectorDerate = med(peerOnly.map(p => p.peVs));
const SPEC = PEERS.filter(p => ['AARTIIND', 'DEEPAKNTR', 'VINATIORGA'].includes(p.symbol));
const specPe = med(SPEC.map(p => p.pe)), specEv = med(SPEC.map(p => p.evEbitda));
const specShare = C.business.specialtyShareOfEbitdaFY25Pct / 100;
const mixPe = (1 - specShare) * preDeal + specShare * specPe;
const mixEv = (1 - specShare) * fwdEvPre + specShare * specEv;
const HS = PEERS.find(p => p.symbol === 'HSCL'), SELF = PEERS.find(p => p.symbol === 'PCBL');

// Street
const ST = D.street, stAvg = ST.reduce((s, x) => s + x.tp, 0) / ST.length;
const PL = ST.find(s => s.broker === 'Prabhudas Lilladher'), IDIR = ST.find(s => s.broker === 'ICICI Direct');

const ctx = { fs, path, C, D, SG, M, F, V, A, S, AS, ASOF, ASOF_TXT, n0, n1, pc, med, ai, SA, SQ, ann, A26, A25, A24, A21, price, mcap, BM, mv,
  epsSep28, ebitdaSep28, rating, buyBelow, sellAbove, PE_X, EV_X, CBA, AQA, grpInv, ndEngine, ndTrue, ndHist, ndE, sepND, FM, fwdPe, fwdMed, fwdMedAll,
  troughTxt, preDeal, postDeal, fwdPeNow, fwdEv, fwdEvMed, fwdEvPre, fwdEvPost, fwdEvNow, PEERS, peerOnly, sectorDerate, SPEC, specPe, specEv, specShare,
  mixPe, mixEv, HS, SELF, ST, stAvg, PL, IDIR };
module.exports = { ctx };
