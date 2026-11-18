// Solar Industries initiation: shared context for the Part B files (research.js, part2-4). Loads the
// research JSONs and the built model, and computes valuation inputs (forward P/E history via
// forwardMedian, peer re-rating, street table, Omnia pro forma) once. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'SOLARINDS', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'SOLARINDS.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const rup = s => String(s).replace(/Rs /g, '₹');
const SRC = 'Solar Industries fact sheets, calls and annual reports; GAM Research';
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };

// Customer-line history (annual FY20-26, quarterly Q1FY25-Q1FY27)
const SA = SG.annual.map(a => ({ ...a, domestic: a.cil + a.nonCil + a.housingInfra }));
const SQ = SG.quarterly, QL = SQ.map(q => q.q);
const A26 = SA.find(a => a.fy === 'FY26'), A25 = SA.find(a => a.fy === 'FY25'), A22 = SA.find(a => a.fy === 'FY22'), A21 = SA.find(a => a.fy === 'FY21');
const share = (a, k) => a[k] / a.total * 100;
const Q1 = C.q1fy27, OM = C.omnia;
const defExports = A26.geoOutside - A26.intl; // GAM inference: outside-India revenue less international explosives
const BL = AS.businessLines, YRS = ['FY27E', 'FY28E', 'FY29E'];
const blSum = y => Object.entries(BL[y]).reduce((s, [, v]) => s + v, 0);
YRS.forEach((y, i) => { const g = Math.abs(blSum(y) / F.sales[i] - 1); if (g > 0.003) throw new Error(`businessLines ${y} (${blSum(y)}) ≠ model revenue (${F.sales[i]})`); });
const defShare = y => BL[y].defence / blSum(y) * 100;
const volShare = SA.filter(a => a.domVolT).map(a => ({ fy: a.fy, pct: a.domVolT / (a.industryKt * 1000) * 100 }));

// Price, model outputs
const price = M.price.last;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult, evMult = mv('ev').mult;
const b = A.labels.length - 1; // FY26 index
const epsCagrHist = (Math.pow(A.eps[b] / A.eps[b - 5], 1 / 5) - 1) * 100; // FY21-26
const epsCagr3 = (Math.pow(A.eps[b] / A.eps[b - 3], 1 / 3) - 1) * 100; // FY23-26
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100; // FY26-29E
const netDebt26 = A.borrowings[b] - A.cashAndInvestments[b];
const nciShare = C.fy26.nci / C.fy26.pat * 100;

// One-year-forward P/E history (house window: Apr-2021 to the as-of date; trough years excluded)
const FM = forwardMedian('SOLARINDS', M);
const fwdPe = forwardSeries('SOLARINDS', M, 'eps').filter(x => x[0] >= '2016-04-01');
const pct = (arr, p) => arr[Math.floor(arr.length * p)];
const stat = (from, to = '9999') => { const v = fwdPe.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: pct(v, 0.5), p10: pct(v, 0.1), p25: pct(v, 0.25), p75: pct(v, 0.75), min: v[0], max: v.at(-1) }; };
const H21 = { ...stat('2021-04-01'), med: FM.median }, H16 = stat('2016-04-01'), H2y = stat('2024-10-01');
const fwdNow = price / F.eps[1];

// Trailing EV/EBITDA history (Screener), same window
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'SOLARINDS', 'screener.json'), 'utf8'));
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]).sort((a, c) => a - c);
const evMed = pct(evHist, 0.5);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);
const ebitdaSep28 = mv('ev').metric;

// Peers at the 30-Sep-2026 close, and re-rating vs each one's five-year median trailing P/E
const PEER_SYMS = ['SOLARINDS', 'BEL', 'HAL', 'BDL', 'PREMEXPLN'];
const PEERS = peersAsOf(PEER_SYMS, ASOF);
const P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return pct(v, 0.5); };
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s)]));
const rerate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const OTHERS = PEER_SYMS.filter(s => s !== 'SOLARINDS');
const rrSorted = OTHERS.map(s => rerate[s]).sort((a, c) => a - c);
const sectorRr = (rrSorted[1] + rrSorted[2]) / 2;
const afterRr = H21.med * (1 + sectorRr / 100);
const shortName = s => ({ SOLARINDS: 'Solar Industries', BEL: 'Bharat Electronics', HAL: 'Hindustan Aeronautics', BDL: 'Bharat Dynamics', PREMEXPLN: 'Premier Explosives' }[s] || s);

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers;
const pl = ST.find(s => s.broker === 'Prabhudas Lilladher'), mosl = ST.find(s => s.broker === 'Motilal Oswal');
const tps = ST.map(s => s.tp).sort((a, c) => a - c), tpMed = (tps[Math.floor((tps.length - 1) / 2)] + tps[Math.ceil((tps.length - 1) / 2)]) / 2;
const nBuy = ST.filter(s => /Buy|Overweight/.test(s.rating)).length, nSell = ST.filter(s => /Sell/.test(s.rating)).length;
const sepEps = s => (s.eps ? (s.eps.FY28E + s.eps.FY29E) / 2 : null);

// Omnia pro forma (inputs sourced in company.json; arithmetic is GAM's)
const fx = 12951 / 1355 * 10; // ₹ per US$ implied by the deal (₹12,951 cr = US$1.355 bn) ≈ 95.6
const omEbitda = 180 * fx / 10; // management's FY28 Omnia EBITDA, US$180 mn, in ₹ cr
const omNetCash = 110 * fx / 10; // PL: ~US$110 mn net cash
const omDa = 250; // combined D&A ~₹700 cr (management EBITDA ₹6,800-7,000 cr vs EBIT ₹6,200-6,300 cr) less our organic FY28E ~₹444 cr, rounded
const omInterest = 1050; // management and Kotak: ₹1,000-1,100 cr
const omPbt = omEbitda - omDa - omInterest;
const omValue = m => (m * omEbitda - (12951 - omNetCash)) / 9.049; // equity value per Solar share at EV/EBITDA m
const omAccretion = omPbt / F.pbt[1] * 100;
const sgn = v => `${v < 0 ? '−' : '+'}₹${n0(Math.abs(v))}`; // signed rupee amount

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, rup, SRC, shortDate, SA, SQ, QL, A26, A25, A22, A21, share, Q1, OM, defExports, BL, YRS, blSum, defShare, volShare,
  price, mv, epsSep28, peMult, evMult, b, epsCagrHist, epsCagr3, epsCagrFwd, netDebt26, nciShare, FM, fwdPe, H21, H16, H2y, fwdNow, evMed, ttmEbitda, ebitdaSep28,
  PEER_SYMS, PEERS, P, MED5, rerate, OTHERS, sectorRr, afterRr, shortName, rating, buyBelow, sellAbove, ST, pl, mosl, tps, tpMed, nBuy, nSell, sepEps,
  fx, omEbitda, omNetCash, omDa, omInterest, omPbt, omValue, omAccretion, sgn };
