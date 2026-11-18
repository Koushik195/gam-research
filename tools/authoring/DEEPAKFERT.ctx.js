// Deepak Fertilisers report: shared context for DEEPAKFERT.part2-6.js and DEEPAKFERT.research.js
// (as of 30-Sep-2026, Q1FY27 basis). Loads research JSONs and the built model and derives the numbers
// the prose uses (live where possible).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'DEEPAKFERT', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'DEEPAKFERT.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, S = M.forecast.scenarios, AS = M.forecast.assumptions;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const med = a => { const s = a.filter(x => x != null).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const ai = l => A.labels.indexOf(l);
const SA = SG.annual, SQ = SG.quarterly, ann = fy => SA.find(a => a.fy === fy), qtr = q => SQ.find(x => x.q === q);
const A26 = ann('FY26'), A25 = ann('FY25'), A21 = ann('FY21'), A23 = ann('FY23'), A24 = ann('FY24'), Q1 = qtr('Q1FY27');
const TRUE_SH = C.listing.shares / 1e7;
const price = M.price.last, mcap = price * TRUE_SH;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const PE_X = mv('pe').mult, epsSep28 = mv('pe').metric;
const SP = V.sotp.parts, part = n => SP.find(p => p.name.startsWith(n));
const pChem = part('Chemicals'), pFert = part('Fertilisers'), pCorp = part('Less: corporate'), pCcd = part('Less: DMSL'), pNd = part('Less: net debt');
const CHEM_X = pChem.mult, FERT_X = pFert.mult, CORP_X = pCorp.mult;
const segEv = pChem.value + pFert.value + pCorp.value, segEbitdaSep28 = pChem.metric + pFert.metric + pCorp.metric;
const blendX = segEv / segEbitdaSep28; // implied group EV/EBITDA in the SOTP
const sotpBull = S.bull.blend.methods.find(m => m.key === 'sotp'), sotpBear = S.bear.blend.methods.find(m => m.key === 'sotp');

// Net debt: history = Screener (borrowings incl. leases less cash and investments); company basis excludes leases and the CCD liability.
const ndHist = l => A.netDebt[ai(l)];
const ndF = i => -F.treasury[i];
const ndE = A.labels.map((l, i) => (A.netDebt[i] != null && A.ebitda[i] > 0 ? Math.round(A.netDebt[i] / A.ebitda[i] * 10) / 10 : null));

// Forward P/E (house window, trough years excluded) and forward EV/EBITDA history with regime medians.
const FM = forwardMedian('DEEPAKFERT', M);
const fwdPe = forwardSeries('DEEPAKFERT', M, 'eps').filter(x => x[0] >= '2021-04-01');
const fwdMed = FM.median, fwdMedAll = FM.medianAll, troughTxt = FM.troughYears.join(', ');
const reg = (a, from, to) => med(a.filter(x => x[0] >= from && x[0] < to).map(x => x[1]));
const pe23 = reg(FM.series, '2023-04-01', '2026-10-01'), pe24 = reg(FM.series, '2024-04-01', '2026-10-01');
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
  return { all: pts.map(x => [x[0], x[1]]), kept: pts.filter(x => !x[2]), troughs: pts.filter(x => x[2]).length };
}
const FEV = forwardEv(), fwdEv = FEV.all;
const fwdEvMed = med(FEV.kept.map(x => x[1])), ev21 = reg(fwdEv, '2021-04-01', '2023-04-01'), ev23 = reg(fwdEv, '2023-04-01', '2026-10-01'), ev24 = reg(fwdEv, '2024-04-01', '2026-10-01');
const fwdEvNow = fwdEv.at(-1)[1], fwdPeNow = fwdPe.at(-1)[1];

// Peers at the 30-Sep close, de-rating vs each one's own median since Oct-2021 (five years).
const PEER_SYMS = ['DEEPAKFERT', ...D.peers];
const SHORT = { DEEPAKFERT: 'Deepak Fertilisers', SOLARINDS: 'Solar Industries', CHAMBLFERT: 'Chambal Fertilisers', COROMANDEL: 'Coromandel', PARADEEP: 'Paradeep Phosphates', GNFC: 'GNFC', GSFC: 'GSFC', RCF: 'RCF', DEEPAKNTR: 'Deepak Nitrite' };
const PEERS = peersAsOf(PEER_SYMS, ASOF).map(p => {
  const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', p.symbol, 'screener.json'), 'utf8'));
  const w = s => (s || []).filter(([d, v]) => d >= '2021-10-01' && d <= ASOF && v > 0 && v < 300).map(x => x[1]);
  const pe5 = med(w(P.charts.pe?.['Price to Earning'])), ev5 = med(w(P.charts.evEbitda?.['EV Multiple']));
  return { ...p, short: SHORT[p.symbol] || p.symbol, pe5, ev5, peVs: p.pe && pe5 ? (p.pe / pe5 - 1) * 100 : null, evVs: p.evEbitda && ev5 ? (p.evEbitda / ev5 - 1) * 100 : null };
});
const peerOnly = PEERS.filter(p => p.symbol !== 'DEEPAKFERT');
const sectorDerate = med(peerOnly.map(p => p.peVs)), sectorDerateEv = med(peerOnly.map(p => p.evVs));
const FERT_PEERS = PEERS.filter(p => ['CHAMBLFERT', 'PARADEEP', 'GNFC', 'GSFC', 'RCF'].includes(p.symbol));
const fertPeerEv = med(FERT_PEERS.map(p => p.evEbitda)), fertPeerEv5 = med(FERT_PEERS.map(p => p.ev5));
const SELF = PEERS.find(p => p.symbol === 'DEEPAKFERT'), pv = s => PEERS.find(p => p.symbol === s);
// Mix: chemicals share of segment EBITDA in FY25-26 and FY28E; chemicals multiple implied by the de-rated group anchor.
const anchorX = fwdEvMed * (1 + sectorDerateEv / 100);
const chemShareHist = (A25.chemEbitda + A26.chemEbitda) / (A25.chemEbitda + A26.chemEbitda + A25.fertEbitda + A26.fertEbitda);
const chemImplied = (anchorX - (1 - chemShareHist) * FERT_X) / chemShareHist;
const chemShare28 = F.seg.chem.adjEbitda[1] / (F.seg.chem.adjEbitda[1] + F.seg.fert.adjEbitda[1]);

// Street
const ST = D.street.brokers, EMK = ST.find(s => s.broker === 'Emkay Global'), KEY = ST.find(s => s.broker === 'Keynote Capitals'), EE = D.street.estimates.emkay;
const ctx = { fs, path, C, D, SG, M, F, V, A, S, AS, ASOF, ASOF_TXT, n0, n1, pc, med, ai, SA, SQ, ann, qtr, A26, A25, A21, A23, A24, Q1, TRUE_SH, price, mcap, BM, mv,
  rating, buyBelow, sellAbove, ruleText, PE_X, epsSep28, SP, pChem, pFert, pCorp, pCcd, pNd, CHEM_X, FERT_X, CORP_X, segEv, segEbitdaSep28, blendX, sotpBull, sotpBear,
  ndHist, ndF, ndE, FM, fwdPe, fwdMed, fwdMedAll, troughTxt, pe23, pe24, fwdEv, fwdEvMed, ev21, ev23, ev24, fwdEvNow, fwdPeNow, PEERS, peerOnly, sectorDerate, sectorDerateEv,
  FERT_PEERS, fertPeerEv, fertPeerEv5, SELF, pv, anchorX, chemShareHist, chemImplied, chemShare28, ST, EMK, KEY, EE };
module.exports = { ctx };
