// Kansai Nerolac initiation: shared context for the Part B files (research.js, part2-6). Loads the research
// JSONs and the built model, and computes the valuation inputs once: the house forward P/E median
// (forwardMedian), the same median on EPS before exceptional items (the FY24-25 land-sale gains distort the
// house figure), peer de-rating, relative P/E vs Asian Paints, street table. Written as of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'KANSAINER', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'KANSAINER.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?(?=[0-9])/g, '₹');
const cagr = (a, b, y) => (Math.pow(b / a, 1 / y) - 1) * 100;
const SRC = 'Kansai Nerolac presentations, calls and annual reports; Kansai Paint India briefings; GAM Research';
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'KANSAINER', 'screener.json'), 'utf8'));

// Model outputs and price
const b = A.labels.length - 1; // FY26
const ai = y => A.labels.indexOf(y);
const price = M.price.last, mcap = M.meta.marketCap || price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult, evMult = mv('ev').mult, ebitdaSep28 = mv('ev').metric;
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const Q1 = C.q1fy27, FY = C.fy26, UE = C.underlyingEps;
const cashMar26 = A.cashAndInvestments[b], netCashMar26 = cashMar26 - A.borrowings[b];
const cashPerShare = netCashMar26 / F.shares, cashShare = cashMar26 / mcap * 100;
const peFY28 = price / F.eps[1], peFY27 = price / F.eps[0], peExCash = (price - cashPerShare) / F.eps[1];
const divYield = F.dps[0] / price * 100;
const epsCagrHist = cagr(UE.FY21, UE.FY26, 5), epsCagrFwd = cagr(UE.FY26, F.eps[2], 3);
const landGains = 661.25 + 665.44;

// Business-line build (assumptions.json) must sum to model revenue.
const BL = AS.businessLines; const lines = { deco: [], ind: [] };
{ let d = BL.base.decorative, x = BL.base.industrial; for (let i = 0; i < 3; i++) { d *= 1 + BL.decorativeGrowth[i] / 100; x *= 1 + BL.industrialGrowth[i] / 100; lines.deco.push(d); lines.ind.push(x); } }
lines.deco.forEach((x, i) => { const gap = (x + lines.ind[i]) / F.sales[i] - 1; if (Math.abs(gap) > 0.005) throw new Error(`Business-line build off model revenue by ${(gap * 100).toFixed(2)}% in ${F.years[i]}`); });
const decoShare = i => lines.deco[i] / (lines.deco[i] + lines.ind[i]) * 100;

// One-year-forward P/E. (1) House rule: forwardMedian since Apr-2021 (reported EPS, trough years excluded).
const FM = forwardMedian('KANSAINER', M);
// (2) Same window and method on EPS before exceptional items (company.json underlyingEps; forecasts unchanged).
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsAdj = {}; Object.entries(UE).forEach(([k, v]) => { if (/^FY\d\d$/.test(k)) epsAdj[2000 + +k.slice(2)] = v; });
F.years.forEach((y, i) => (epsAdj[2000 + +y.slice(2, 4)] = F.eps[i]));
const fwdAdj = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= '2021-04-01').map(([d, p]) => [d, Math.round(p / epsAdj[fyOf(d)] * 10) / 10]).filter(x => x[1] > 0);
const fv = fwdAdj.map(x => x[1]).sort((a, c) => a - c), q = p => fv[Math.floor(fv.length * p)];
const HA = { med: q(0.5), p25: q(0.25), p75: q(0.75), min: fv[0], max: fv.at(-1) };
const fwdByFy = {}; fwdAdj.forEach(([d, x]) => (fwdByFy[fyOf(d)] ||= []).push(x));
const medOf = a => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const H24 = medOf(fwdAdj.filter(x => x[0] >= '2024-04-01').map(x => x[1]));

// Trailing EV/EBITDA history (Screener), same window
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]).sort((a, c) => a - c);
const evMed = evHist[Math.floor(evHist.length / 2)], evMin = evHist[0];
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);

// Peers at the 30-Sep-2026 close; de-rating vs each one's five-year median trailing P/E
const PEER_SYMS = ['KANSAINER', 'ASIANPAINT', 'BERGEPAINT', 'INDIGOPNTS', 'PIDILITIND'];
const PEERS = peersAsOf(PEER_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const ld = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
const peSer = sym => (ld(sym).charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && x > 0);
const med5 = sym => medOf(peSer(sym).filter(([d]) => d >= '2021-09-30').map(x => x[1]));
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const PAINT = ['ASIANPAINT', 'BERGEPAINT', 'INDIGOPNTS'];
const sectorDr = medOf(PAINT.map(s => derate[s])), ownDr = derate.KANSAINER;
const afterSector = HA.med * (1 + sectorDr / 100), afterOwn = HA.med * (1 + ownDr / 100), midpoint = (afterSector + afterOwn) / 2;
const shortName = s => ({ KANSAINER: 'Kansai Nerolac', ASIANPAINT: 'Asian Paints', BERGEPAINT: 'Berger Paints', INDIGOPNTS: 'Indigo Paints', PIDILITIND: 'Pidilite' }[s] || s);

// Nerolac's trailing P/E relative to Asian Paints (yearly medians since 2021)
const apMap = Object.fromEntries(peSer('ASIANPAINT')); const rel = peSer('KANSAINER').filter(([d]) => d >= '2021-01-01' && apMap[d]).map(([d, x]) => [d, x / apMap[d]]);
const relByYr = {}; rel.forEach(([d, x]) => (relByYr[d.slice(0, 4)] ||= []).push(x));
const RELY = Object.keys(relByYr).sort(), relYr = RELY.map(y => Math.round(medOf(relByYr[y]) * 100) / 100), relNow = Math.round(rel.at(-1)[1] * 100) / 100;

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const buyMult = Math.ceil(V.tp / 1.15 / epsSep28 * 10) / 10; // multiple at which the target is exactly +15% from today
const multForBuy = 1.15 * price / epsSep28;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, br = n => ST.find(s => s.broker === n);
const pl = br('Prabhudas Lilladher'), mncl = br('MNCL'), isec = br('ICICI Securities');
const current = ST.filter(s => s.date >= '2026-02');
const avgTp = current.reduce((s, x) => s + x.tp, 0) / current.length;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, cagr, SRC, shortDate, S, b, ai, price, mcap, BM, mv, epsSep28, peMult, evMult, ebitdaSep28,
  SA, SQ, QL, Q1, FY, UE, cashMar26, netCashMar26, cashPerShare, cashShare, peFY28, peFY27, peExCash, divYield, epsCagrHist, epsCagrFwd, landGains, BL, lines, decoShare,
  FM, fwdAdj, HA, fwdByFy, H24, evMed, evMin, ttmEbitda, PEER_SYMS, PEERS, P, MED5, derate, PAINT, sectorDr, ownDr, afterSector, afterOwn, midpoint, shortName, RELY, relYr, relNow,
  rating, ruleText, buyBelow, sellAbove, buyMult, multForBuy, ST, br, pl, mncl, isec, current, avgTp };
