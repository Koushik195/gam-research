// Berger Paints initiation: shared context for the Part B files (research.js, part2-4). Loads the research
// JSONs and the built model, and computes the valuation inputs (forward P/E history, peer de-rating,
// street table, business-line check) once. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'BERGEPAINT', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'BERGEPAINT.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs /g, '₹');
const SRC = 'Berger Paints investor presentations, earnings calls and annual reports; GAM Research';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };

// Business lines and disclosed splits
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26;
const b = A.labels.length - 1; // FY26 index in actuals
const ix = fy => A.labels.indexOf(fy);
const BL = AS.businessLines;
const blRev = k => { let v = BL.base[k]; return BL.growth[k].map(g => (v *= 1 + g / 100)); };
const decoF = blRev('deco'), indF = blRev('industrial');
decoF.forEach((d, i) => { const s = d + indF[i]; if (Math.abs(s / F.sales[i] - 1) > 0.005) throw new Error(`business lines ${n0(s)} != model revenue ${n0(F.sales[i])} in ${F.years[i]}`); });
if (Math.abs(BL.base.deco + BL.base.industrial - A.sales[b]) > 1) throw new Error('business-line base does not sum to FY26 revenue');

// Price, model outputs
const price = M.price.last;
const mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult, evMult = mv('ev').mult;
const epsCagrHist = (Math.pow(A.eps[b] / A.eps[b - 5], 1 / 5) - 1) * 100; // FY21-26
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100; // FY26-29E
const epsCagr2729 = (Math.pow(F.eps[2] / F.eps[0], 1 / 2) - 1) * 100; // FY27-29E
const salesCagr3 = (Math.pow(A.sales[b] / A.sales[b - 3], 1 / 3) - 1) * 100; // FY23-26
const netCashScr = A.cashAndInvestments[b] - A.borrowings[b];

// One-year-forward P/E history; house starting point = forwardMedian (Apr-2021 on, trough years excluded)
const FM = forwardMedian('BERGEPAINT', M);
const fwdPe = forwardSeries('BERGEPAINT', M, 'eps').filter(x => x[0] >= '2016-04-01');
const stat = (from, to = '9999') => { const v = fwdPe.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p10: v[Math.floor(v.length * 0.1)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1) }; };
const H21 = stat('2021-04-01'), H16 = stat('2016-04-01'), H2y = stat('2024-10-01');
const fwdNow = price / F.eps[1];

// Trailing EV/EBITDA history (Screener), same window
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'BERGEPAINT', 'screener.json'), 'utf8'));
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]).sort((a, c) => a - c);
const evMed = evHist[Math.floor(evHist.length / 2)];
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);
const ebitdaSep28 = mv('ev').metric;

// Peers at the 30-Sep-2026 close, and de-rating vs each one's five-year median trailing P/E
const PEER_SYMS = ['BERGEPAINT', 'ASIANPAINT', 'KANSAINER', 'INDIGOPNTS', 'PIDILITIND'];
const PEERS = peersAsOf(PEER_SYMS, ASOF);
const P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const OTHERS = PEER_SYMS.filter(s => s !== 'BERGEPAINT');
const drSorted = OTHERS.map(s => derate[s]).sort((a, c) => a - c);
const sectorDr = (drSorted[1] + drSorted[2]) / 2; // median of four
const worstDr = drSorted[0];
const afterDerate = FM.median * (1 + sectorDr / 100);
const shortName = s => ({ BERGEPAINT: 'Berger Paints', ASIANPAINT: 'Asian Paints', KANSAINER: 'Kansai Nerolac', INDIGOPNTS: 'Indigo Paints', PIDILITIND: 'Pidilite' }[s] || s);

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers;
const byB = n => ST.find(s => s.broker === n);
const isec = byB('ICICI Securities'), equ = byB('Equirus'), nom = byB('Nomura'), mncl = byB('Monarch Networth');
const postQ1 = ST.filter(s => s.date && s.date >= '2026-08');
const avgPost = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length;
const avgAll = ST.reduce((s, x) => s + x.tp, 0) / ST.length;
const tpSorted = ST.map(s => s.tp).sort((a, c) => a - c);
const impliedEps = s => (s.multiple && /^\d/.test(s.multiple) ? s.tp / parseFloat(s.multiple) : null);

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, SRC, shortDate, SA, SQ, QL, Q1, FY26, b, ix, BL, decoF, indF,
  price, mcap, mv, epsSep28, peMult, evMult, epsCagrHist, epsCagrFwd, epsCagr2729, salesCagr3, netCashScr, FM, fwdPe, H21, H16, H2y, fwdNow, evMed, ttmEbitda, ebitdaSep28,
  PEER_SYMS, PEERS, P, MED5, derate, OTHERS, sectorDr, worstDr, afterDerate, shortName, rating, buyBelow, sellAbove, ST, isec, equ, nom, mncl, postQ1, avgPost, avgAll, tpSorted, impliedEps };
