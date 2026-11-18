// Coromandel initiation: shared context for the research parts (data, built model, peers,
// forward-multiple history, street, derived numbers). Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries } = require('./valuation-blend');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'COROMANDEL', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'COROMANDEL.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pctChg = (a, b) => Math.round((a / b - 1) * 100);
const SRC = 'Coromandel results presentations, earnings calls and annual reports, GAM Research';

const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), FYS = SA.map(a => a.fy);
const ann = fy => SA.find(a => a.fy === fy);
const A26 = ann('FY26'), A25 = ann('FY25'), A24 = ann('FY24'), A23 = ann('FY23'), A21 = ann('FY21');
const price = M.price.last, TRUE_SH = 29.5, mcap = price * TRUE_SH;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, ebitdaSep28 = mv('ev').metric, mult = mv('pe').mult;
const pe27 = price / F.eps[0], pe28 = price / F.eps[1], pe29 = price / F.eps[2], peSep28 = price / epsSep28;
const ownersPat = i => F.eps[i] * TRUE_SH; // profit attributable to owners (model EPS × actual diluted shares)
const nc = i => F.treasury[i]; // net cash incl. ICDs (model)
const Q1 = C.q1fy27;
const nutPt = F.seg.nut.revenue[1] * 0.01 * 0.74 / TRUE_SH; // EPS per 1pt of Nutrient margin, FY28E
const dcfV = mv('dcf').value, evV = mv('ev').value;
const dcfAdj = (V.equity - C.fy26.nciEquity) / TRUE_SH * Math.pow(1 + V.ke / 100, 0.5); // DCF on true shares, less minorities at book
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Peers as of the 30-Sep-2026 close, with five-year medians (Screener, weekly).
const FERT = ['CHAMBLFERT', 'PARADEEP', 'DEEPAKFERT', 'RCF', 'GSFC'], AGRO = ['PIIND', 'UPL', 'SUMICHEM', 'BAYERCROP', 'DHANUKA', 'RALLIS'];
const PEER_SYMS = ['COROMANDEL', ...FERT, ...AGRO];
const PEERS = Object.fromEntries(peersAsOf(PEER_SYMS, ASOF).map(p => [p.symbol, p]));
const median = a => { const v = a.filter(x => x != null).slice().sort((x, y) => x - y); return v.length ? v[Math.floor(v.length / 2)] : null; };
const med5 = (sym, chart, key) => { const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return median((S.charts[chart]?.[key] || []).filter(([d, v]) => d >= '2021-09-30' && d <= ASOF && v > 0 && v < 300).map(x => x[1])); };
for (const s of PEER_SYMS) {
  const p = PEERS[s]; p.pe5 = med5(s, 'pe', 'Price to Earning'); p.ev5 = med5(s, 'evEbitda', 'EV Multiple');
  p.peVs = p.pe5 ? (p.pe / p.pe5 - 1) * 100 : null; p.evVs = p.ev5 ? (p.evEbitda / p.ev5 - 1) * 100 : null;
}
const OTHERS = [...FERT, ...AGRO];
const sectorDerate = median(OTHERS.map(s => PEERS[s].peVs)), sectorDerateEv = median(OTHERS.map(s => PEERS[s].evVs));
const fertPe = median(FERT.map(s => PEERS[s].pe)), agroPe = median(AGRO.map(s => PEERS[s].pe));
const CI = PEERS.COROMANDEL;
const SHORT = { CHAMBLFERT: 'Chambal Fertilisers', PARADEEP: 'Paradeep Phosphates', DEEPAKFERT: 'Deepak Fertilisers', RCF: 'RCF', GSFC: 'GSFC', PIIND: 'PI Industries', UPL: 'UPL', SUMICHEM: 'Sumitomo Chemical India', BAYERCROP: 'Bayer CropScience', DHANUKA: 'Dhanuka Agritech', RALLIS: 'Rallis India' };
const pname = p => SHORT[p.symbol] || p.name.replace(/ Ltd\.?$/, '');

// One-year-forward P/E history (reported EPS, then our estimates).
const fwd = forwardSeries('COROMANDEL', M, 'eps');
const fwd21 = fwd.filter(x => x[0] >= '2021-04-01');
const fwdMed21 = median(fwd21.map(x => x[1]));
const byYear = {}; fwd21.forEach(([d, v]) => (byYear[d.slice(0, 4)] ||= []).push(v));
const fwdYear = Object.fromEntries(Object.entries(byYear).map(([y, a]) => [y, median(a)]));

// Street (latest note per broker by 30-Sep-2026).
const BR = D.street.brokers, tpBrokers = BR.filter(b => b.tp);
const moslEps = D.street.estimates.mosl.FY28E.eps, shkE = D.street.estimates.sharekhanDec25;

// Net cash path (model basis incl. ICDs from FY26; history = cash + investments − borrowings, ICDs where disclosed).
const ncLabels = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...F.years];
const ncHist = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => -M.annual.netDebt[M.annual.labels.indexOf(l)]);
ncHist[5] += 784.64; ncHist[6] += AS.otherTreasury.base; // ICDs with Bajaj Finance (FY25 ₹785 cr, FY26 ₹1,564 cr; none in FY24)
const ncVals = [...ncHist.map(Math.round), ...F.years.map((_, i) => Math.round(nc(i)))];

module.exports = {
  fs, path, ROOT, RD, C, D, SG, M, F, V, AS, SC, ASOF, ASOF_TXT, n0, n1, pctChg, SRC, SA, SQ, QL, FYS, ann, A26, A25, A24, A23, A21,
  price, TRUE_SH, mcap, BM, mv, epsSep28, ebitdaSep28, mult, pe27, pe28, pe29, peSep28, ownersPat, nc, Q1, nutPt, dcfV, evV, dcfAdj,
  rating, buyBelow, sellAbove, ruleText, PEER_SYMS, FERT, AGRO, PEERS, median, sectorDerate, sectorDerateEv, fertPe, agroPe, CI, pname,
  fwd, fwd21, fwdMed21, fwdYear, BR, tpBrokers, moslEps, shkE, ncLabels, ncVals,
};
