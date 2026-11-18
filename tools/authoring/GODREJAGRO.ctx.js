// Godrej Agrovet initiation: shared context for the research parts (data, built model, SOTP, own
// forward-multiple history with trough years left out, peers, street, derived numbers). As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'GODREJAGRO', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'GODREJAGRO.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'GODREJAGRO', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, AS = M.forecast.assumptions, SC = M.forecast.scenarios, A = M.annual;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pctChg = (a, b) => Math.round((a / b - 1) * 100);
const SRC = 'Godrej Agrovet results presentations, earnings calls and annual reports, GAM Research';

const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), FYS = SA.map(a => a.fy);
const ann = fy => SA.find(a => a.fy === fy);
const A26 = ann('FY26'), A25 = ann('FY25'), A24 = ann('FY24'), A23 = ann('FY23'), A21 = ann('FY21');
const Q1 = C.q1fy27, QN = SQ.at(-1);
const price = M.price.last, sh = F.shares, TRUE_SH = 19.23, mcap = price * TRUE_SH;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const P = V.sotp.parts, VP = AS.valuation.parts;
const partIdx = re => VP.findIndex(p => re.test(p.name));
const yi = y => F.years.indexOf(y);
const sep28 = k => (F.seg[k].adjEbitda[yi('FY28E')] + F.seg[k].adjEbitda[yi('FY29E')]) / 2;
const OPS = ['an', 'veg', 'cc', 'dairy', 'food', 'oth'];
const opsEbitda = OPS.reduce((s, k) => s + sep28(k), 0);
const unallocSep28 = -(F.unalloc[1] + F.unalloc[2]) / 2; // positive cost
const opsValue = P.slice(0, 7).reduce((s, p) => s + p.value, 0); // six businesses less central costs
const opsMult = opsValue / (opsEbitda - unallocSep28);
const grossOpsMult = P.slice(0, 6).reduce((s, p) => s + p.value, 0) / opsEbitda;
const otherItems = V.sotp.equity - opsValue;
const impliedOpsMult = (price * sh - otherItems) / (opsEbitda - unallocSep28);
const netDebt26 = -(A.cash.at(-1) + A.investments.at(-1) - A.borrowings.at(-1));
const segShare26 = k => A26[k + 'Ebitda'] / A26.segEbitda * 100;

// House rule: own one-year-forward P/E median since Apr-2021, trough years left out.
const peFm = forwardMedian('GODREJAGRO', M);
// Same window and trough rule on forward EV/EBITDA (EV = market value + borrowings - cash - investments).
const eb = {}; A.labels.forEach((l, i) => (eb[2000 + +l.slice(2)] = A.ebitda[i])); F.years.forEach((y, i) => (eb[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const nd = {}; A.labels.forEach((l, i) => (nd[2000 + +l.slice(2)] = (A.borrowings[i] || 0) - (A.cash[i] || 0) - (A.investments[i] || 0)));
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const bsYr = d => { const dt = new Date(d); return dt.getMonth() >= 5 ? dt.getFullYear() : dt.getFullYear() - 1; };
const troughFy = fy => { const pk = Math.max(...[eb[fy - 1], eb[fy - 2], eb[fy - 3]].filter(v => v != null)); return !(eb[fy] > 0) || eb[fy] < 0.5 * pk; };
const pxSeries = M.price.series.filter(([d]) => d >= '2021-04-01' && d <= ASOF);
const evAll = pxSeries.map(([d, px]) => [d, Math.round((px * sh + nd[bsYr(d)]) / eb[fyOf(d)] * 10) / 10, fyOf(d)]);
const evKept = evAll.filter(x => !troughFy(x[2]));
const medOf = a => { const s = a.map(x => x[1]).sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const evMed = medOf(evKept), evMedAll = medOf(evAll);
const evTroughYears = [...new Set(evAll.filter(x => troughFy(x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const evByFy = Object.fromEntries([...new Set(evAll.map(x => x[2]))].map(fy => [`FY${String(fy).slice(2)}`, medOf(evAll.filter(x => x[2] === fy))]));
const evChart = evAll.filter((_, i, a) => i % 2 === 0 || i === a.length - 1);
const peByFy = Object.fromEntries([...new Set(peFm.series.map(([d]) => fyOf(d)))].map(fy => [`FY${String(fy).slice(2)}`, medOf(peFm.series.filter(([d]) => fyOf(d) === fy))]));

// Peers at the 30-Sep-2026 close against their own five-year medians (Screener, weekly).
const FEED = ['AVANTIFEED', 'VENKEYS'], DAIRY = ['HERITGFOOD', 'DODLA'], OIL = ['PATANJALI', 'AWL'], AGRO = ['PIIND', 'UPL', 'BAYERCROP', 'SUMICHEM', 'DHANUKA', 'RALLIS'];
const OTHERS = [...FEED, ...DAIRY, ...OIL, ...AGRO];
const PEER_SYMS = ['GODREJAGRO', ...OTHERS, 'ASTEC'];
const PEERS = Object.fromEntries(peersAsOf(PEER_SYMS, ASOF).map(p => [p.symbol, p]));
const median = a => { const v = a.filter(x => x != null).slice().sort((x, y) => x - y); return v.length ? v[Math.floor(v.length / 2)] : null; };
const med5 = (sym, chart, key) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return median((X.charts[chart]?.[key] || []).filter(([d, v]) => d >= '2021-10-01' && d <= ASOF && v > 0 && v < 300).map(x => x[1])); };
for (const s of PEER_SYMS) { const p = PEERS[s]; p.pe5 = med5(s, 'pe', 'Price to Earning'); p.ev5 = med5(s, 'evEbitda', 'EV Multiple'); p.peVs = p.pe5 && p.pe > 0 ? (p.pe / p.pe5 - 1) * 100 : null; p.evVs = p.ev5 && p.evEbitda > 0 ? (p.evEbitda / p.ev5 - 1) * 100 : null; }
const sectorDerate = median(OTHERS.map(s => PEERS[s].peVs)), sectorDerateEv = median(OTHERS.map(s => PEERS[s].evVs));
const derivedPe = Math.round(peFm.median * (1 + sectorDerate / 100) * 10) / 10;
const derivedGroup = Math.round(evMed * (1 + sectorDerateEv / 100) * 10) / 10;
const GA = PEERS.GODREJAGRO;
const SHORT = { AVANTIFEED: 'Avanti Feeds', VENKEYS: "Venky's", HERITGFOOD: 'Heritage Foods', DODLA: 'Dodla Dairy', PATANJALI: 'Patanjali Foods', AWL: 'AWL Agri Business', PIIND: 'PI Industries', UPL: 'UPL', BAYERCROP: 'Bayer CropScience', SUMICHEM: 'Sumitomo Chemical India', DHANUKA: 'Dhanuka Agritech', RALLIS: 'Rallis India', ASTEC: 'Astec LifeSciences' };
const pname = p => SHORT[p.symbol] || p.name.replace(/ Ltd\.?$/, '');
const evAtClose = (price * sh + netDebt26) / F.ebitda[1]; // FY28E, model basis
const tpEvFy28 = (V.tp * sh + netDebt26) / F.ebitda[1];

// Street (latest note per broker standing on 30-Sep-2026).
const BR = D.street.brokers, ML = D.street.estimates.mosl;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dmy = d => { const [y, mo, da] = d.split('-'); return `${+da}-${MON[+mo - 1]}-${y.slice(2)}`; };
const owners = i => F.eps[i] * TRUE_SH;

const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const vegPt = F.seg.veg.revenue[1] * 0.01 * (1 - AS.taxRate[1] / 100) / sh; // EPS per 1pt of veg-oil margin, FY28E

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, AS, SC, A, ASOF, ASOF_TXT, n0, n1, pctChg, SRC, SA, SQ, QL, FYS, ann, A26, A25, A24, A23, A21, Q1, QN,
  price, sh, TRUE_SH, mcap, BM, mv, P, VP, partIdx, sep28, OPS, opsEbitda, unallocSep28, opsValue, opsMult, grossOpsMult, otherItems, impliedOpsMult, netDebt26, segShare26,
  peFm, peByFy, evAll, evKept, evMed, evMedAll, evTroughYears, evByFy, evChart, FEED, DAIRY, OIL, AGRO, OTHERS, PEER_SYMS, PEERS, median, sectorDerate, sectorDerateEv, derivedPe, derivedGroup, GA, pname,
  evAtClose, tpEvFy28, BR, ML, dmy, owners, rating, buyBelow, sellAbove, ruleText, vegPt };
