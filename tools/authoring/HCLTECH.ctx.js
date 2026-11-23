// HCL Technologies initiation: shared context for the Part B files (research.js, part2-5). Loads the research
// JSONs and the built model, checks the USD revenue build and the segment-EBIT mapping, builds the other-income
// reconciliation, and computes the valuation inputs (forwardMedian, peer de-rating, street table). As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'HCLTECH', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'HCLTECH.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const SRC = 'HCLTech investor releases, calls and annual reports; GAM Research';
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };

// Segments (annual FY20-26, quarterly Q1FY25-Q1FY27)
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const yr = fy => SA.find(a => a.fy === fy);
const A26 = yr('FY26'), A25 = yr('FY25'), A24 = yr('FY24'), A23 = yr('FY23'), A22 = yr('FY22'), A21 = yr('FY21');
const Q1 = C.q1fy27, FY26 = C.fy26;
const b = A.labels.length - 1; // FY26 index in actuals

// USD build check: model segment revenue / rate must equal the USD build, and segments must sum to model revenue
const UB = AS.usdBuild, KEYS = ['itbs', 'ers', 'sw', 'elim'];
const usd = {}; for (const k of KEYS) { let u = UB.segments[k].baseUsd; usd[k] = UB.segments[k].usdGrowth.map(g => (u *= 1 + g / 100)); }
const usdTotal = [0, 1, 2].map(i => KEYS.reduce((s, k) => s + usd[k][i], 0));
const usdFromModel = [0, 1, 2].map(i => F.sales[i] * 10 / UB.rate[i]);
usdTotal.forEach((u, i) => { if (Math.abs(u / usdFromModel[i] - 1) > 0.002) throw new Error(`USD build ${Math.round(u)} vs model ${Math.round(usdFromModel[i])} in ${F.years[i]}`); });
const usdGrowth = usdTotal.map((u, i) => (u / (i ? usdTotal[i - 1] : A26.usdRev) - 1) * 100);
const ccGrowth = [0, 1, 2].map(i => KEYS.slice(0, 3).reduce((s, k) => s + (usd[k][i] / usdTotal[i]) * (UB.segments[k].ccGrowth[i] + UB.segments[k].acquisitions[i]), 0));
// Segment EBIT must equal engine EBIT (segment margins are EBIT; the unallocated line adds D&A back)
const segEbit = [0, 1, 2].map(i => KEYS.reduce((s, k) => s + F.seg[k].adjEbitda[i], 0));
segEbit.forEach((e, i) => { if (Math.abs(e - F.ebit[i]) > 3) throw new Error(`segment EBIT ${e} vs engine EBIT ${F.ebit[i]}`); });
const ebitM = F.ebit.map((e, i) => e / F.sales[i] * 100);
const segM = k => F.seg[k].adjEbitda.map((e, i) => e / F.seg[k].revenue[i] * 100);

// Other income build vs FY26 and TTM (Screener nets the Rs956 cr Labour Codes charge into other income)
const netTreasury0 = (A.cash[b] || 0) + (A.investments[b] || 0) + (AS.otherTreasury?.base || 0) - (A.borrowings[b] || 0);
const oiTreasury = [0, 1, 2].map(i => F.otherIncome[i] - AS.otherIncome[i]);
const ttmOi = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0), ttmOiExLc = ttmOi + 956;
const OI26 = { treasury: 1633, nonTreasury: 138, fx: -241, total: 1530 }; // AR FY26 note 3.20

// Price, model outputs
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult, evMult = mv('ev').mult;
const eps26n = 63.98; // FY26 EPS before the Labour Codes charge (Rs719 cr after tax / 271.37 cr shares)
const epsCagrHist = (Math.pow(A.eps[b] / A.eps[b - 5], 1 / 5) - 1) * 100; // FY21-26 reported
const epsCagrFwd = (Math.pow(F.eps[2] / eps26n, 1 / 3) - 1) * 100; // FY26 normalised - FY29E
const epsCagr2729 = (Math.pow(F.eps[2] / F.eps[0], 1 / 2) - 1) * 100;
const divYield = F.dps[1] / price * 100;

// One-year-forward P/E (house rule), plus a version on EPS before one-offs
const FM = forwardMedian('HCLTECH', M);
const fwdPe = forwardSeries('HCLTECH', M, 'eps').filter(x => x[0] >= '2016-04-01');
const stat = (from, to = '9999', s = fwdPe) => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p10: v[Math.floor(v.length * 0.1)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1) }; };
const H21 = stat('2021-04-01'), H16 = stat('2016-04-01'), H1620 = stat('2016-04-01', '2020-03-31');
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const adjEps = { 2025: A.eps[b - 1] - 574 * 0.75 / F.shares, 2026: eps26n }; // FY25 ex State Street JV gain (25% tax assumed), FY26 ex Labour Codes
const exOneOff = (() => { const v = FM.series.map(([d, pe]) => { const fy = fyOf(d), e = adjEps[fy]; const orig = fy === 2025 ? A.eps[b - 1] : fy === 2026 ? A.eps[b] : null; return e ? pe * orig / e : pe; }).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; })();
const fwdNow = price / F.eps[1];

// Trailing EV/EBITDA history (Screener), same window
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'HCLTECH', 'screener.json'), 'utf8'));
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]).sort((a, c) => a - c);
const evMed = evHist[Math.floor(evHist.length / 2)];
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);
const ebitdaSep28 = mv('ev').metric;

// Peers at the 30-Sep-2026 close; de-rating vs each one's five-year median trailing P/E. HCLTech itself and
// Tech Mahindra (earnings trough and recovery distort both its median and its current P/E) are left out.
const PEER_SYMS = ['HCLTECH', 'TCS', 'INFY', 'WIPRO', 'TECHM', 'LTM', 'PERSISTENT', 'COFORGE', 'MPHASIS', 'LTTS'];
const PEERS = peersAsOf(PEER_SYMS, ASOF);
const P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const OTHERS = PEER_SYMS.filter(s => !['HCLTECH', 'TECHM'].includes(s));
const median = a => { const s = [...a].sort((x, y) => x - y), m = s.length; return m % 2 ? s[(m - 1) / 2] : (s[m / 2 - 1] + s[m / 2]) / 2; };
const sectorDr = median(OTHERS.map(s => derate[s])), sectorDrAll = median(PEER_SYMS.filter(s => s !== 'HCLTECH').map(s => derate[s]));
const tier1Dr = median(['TCS', 'INFY', 'WIPRO', 'LTM'].map(s => derate[s]));
const afterDerate = FM.median * (1 + sectorDr / 100);
const shortName = s => ({ HCLTECH: 'HCLTech', TCS: 'TCS', INFY: 'Infosys', WIPRO: 'Wipro', TECHM: 'Tech Mahindra', LTM: 'LTIMindtree', PERSISTENT: 'Persistent', COFORGE: 'Coforge', MPHASIS: 'Mphasis', LTTS: 'L&T Technology' }[s] || s);
const evDerived = evMed * (1 + sectorDr / 100) / (ebitdaSep28 / ttmEbitda);

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, withTp = ST.filter(s => s.tp), withEps = ST.filter(s => s.eps);
const tps = withTp.map(s => s.tp), medTp = median(tps), avgTp = tps.reduce((s, x) => s + x, 0) / tps.length;
const avgEps = y => { const e = withEps.filter(s => s.eps[y]); return e.reduce((t, s) => t + s.eps[y], 0) / e.length; };
const nBuy = withTp.filter(s => /Buy|Add/.test(s.rating || '')).length, nSell = withTp.filter(s => /Sell|Under|Reduce/.test(s.rating || '')).length;

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, SRC, shortDate, SA, SQ, QL, yr, A26, A25, A24, A23, A22, A21, Q1, FY26, b,
  UB, KEYS, usd, usdTotal, usdGrowth, ccGrowth, segEbit, ebitM, segM, netTreasury0, oiTreasury, ttmOi, ttmOiExLc, OI26,
  price, mcap, mv, epsSep28, peMult, evMult, eps26n, epsCagrHist, epsCagrFwd, epsCagr2729, divYield, FM, fwdPe, H21, H16, H1620, exOneOff, adjEps, fwdNow, evMed, ttmEbitda, ebitdaSep28, evDerived,
  PEER_SYMS, PEERS, P, MED5, derate, OTHERS, sectorDr, sectorDrAll, tier1Dr, afterDerate, shortName, median, rating, buyBelow, sellAbove, ST, withTp, withEps, medTp, avgTp, avgEps, nBuy, nSell };
