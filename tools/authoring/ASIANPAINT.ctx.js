// Asian Paints initiation: shared context for the Part B files (research.js, part2-4). Loads the research
// JSONs and the built model, and computes the valuation inputs (forward P/E history via forwardMedian, peer
// de-rating, street table) once. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ASIANPAINT', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ASIANPAINT.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const SRC = 'Asian Paints investor presentations, calls and annual reports; GAM Research';
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };

// Business lines (annual FY20-26 and quarterly Q1FY25-Q1FY27; standalone vs subsidiaries & consolidation)
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const yr = fy => SA.find(a => a.fy === fy);
const A26 = yr('FY26'), A25 = yr('FY25'), A24 = yr('FY24'), A22 = yr('FY22'), A21 = yr('FY21'), A20 = yr('FY20');
const Q1 = C.q1fy27, FY26 = C.fy26, DT = C.decorativeTrend.filter(x => x.q);

// Price, model outputs
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult, evMult = mv('ev').mult;
const b = A.labels.length - 1; // FY26 index in actuals
const epsCagrHist = (Math.pow(A.eps[b] / A.eps[b - 5], 1 / 5) - 1) * 100; // FY21-26
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100; // FY26-29E
const epsCagr2829 = (Math.pow(F.eps[2] / F.eps[0], 1 / 2) - 1) * 100; // FY27-29E
const netCashBase = (A.cash[b] || 0) + (A.investments[b] || 0) + (AS.otherTreasury?.base || 0) - (A.borrowings[b] || 0);

// One-year-forward P/E: house starting point (forwardMedian, Apr-2021 to the as-of date, trough years excluded)
const FM = forwardMedian('ASIANPAINT', M);
const fwdPe = forwardSeries('ASIANPAINT', M, 'eps').filter(x => x[0] >= '2016-04-01');
const stat = (from, to = '9999') => { const v = fwdPe.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p10: v[Math.floor(v.length * 0.1)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1) }; };
const H21 = stat('2021-04-01'), H16 = stat('2016-04-01'), H2y = stat('2024-10-01');
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const exFy25 = (() => { const v = FM.series.filter(([d]) => fyOf(d) !== 2025).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; })();
const fy25Band = (() => { const v = FM.series.filter(([d]) => fyOf(d) === 2025).map(x => x[1]); return [Math.min(...v), Math.max(...v)]; })();
const fwdNow = price / F.eps[1];

// Trailing EV/EBITDA history (Screener), same window
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'ASIANPAINT', 'screener.json'), 'utf8'));
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]).sort((a, c) => a - c);
const evMed = evHist[Math.floor(evHist.length / 2)];
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);
const ebitdaSep28 = mv('ev').metric;

// Peers at the 30-Sep-2026 close, and de-rating vs each one's five-year median trailing P/E
const PEER_SYMS = ['ASIANPAINT', 'BERGEPAINT', 'KANSAINER', 'INDIGOPNTS', 'PIDILITIND', 'HINDUNILVR', 'ASTRAL'];
const PEERS = peersAsOf(PEER_SYMS, ASOF);
const P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const OTHERS = PEER_SYMS.filter(s => s !== 'ASIANPAINT');
const drSorted = OTHERS.map(s => derate[s]).sort((a, c) => a - c);
const sectorDr = (drSorted[2] + drSorted[3]) / 2;
const afterDerate = FM.median * (1 + sectorDr / 100);
const shortName = s => ({ ASIANPAINT: 'Asian Paints', BERGEPAINT: 'Berger Paints', KANSAINER: 'Kansai Nerolac', INDIGOPNTS: 'Indigo Paints', PIDILITIND: 'Pidilite', HINDUNILVR: 'Hindustan Unilever', ASTRAL: 'Astral', JSWDULUX: 'JSW Dulux' }[s] || s);

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, CONS = D.street.consensus;
const mosl = ST.find(s => s.broker === 'Motilal Oswal'), pl = ST.find(s => s.broker === 'Prabhudas Lilladher'), isec = ST.find(s => s.broker.startsWith('ICICI'));
const withEps = [mosl, pl, isec];
const postQ1 = ST.filter(s => s.date >= '2026-07-29' && s.tp);
const tpSorted = postQ1.map(s => s.tp).sort((a, c) => a - c);
const medTp = (tpSorted[Math.floor((tpSorted.length - 1) / 2)] + tpSorted[Math.ceil((tpSorted.length - 1) / 2)]) / 2;
const avgTp = tpSorted.reduce((s, x) => s + x, 0) / tpSorted.length;
const streetEps = y => withEps.map(s => s.eps[y]);
const avgEps = y => streetEps(y).reduce((s, x) => s + x, 0) / withEps.length;

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, SRC, shortDate, SA, SQ, QL, yr, A26, A25, A24, A22, A21, A20, Q1, FY26, DT,
  price, mcap, mv, epsSep28, peMult, evMult, b, epsCagrHist, epsCagrFwd, epsCagr2829, netCashBase, FM, fwdPe, H21, H16, H2y, exFy25, fy25Band, fwdNow, evMed, ttmEbitda, ebitdaSep28,
  PEER_SYMS, PEERS, P, MED5, derate, OTHERS, sectorDr, afterDerate, shortName, rating, buyBelow, sellAbove, ST, CONS, mosl, pl, isec, postQ1, tpSorted, medTp, avgTp, streetEps, avgEps };
