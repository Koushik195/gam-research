// Infosys initiation: shared context for the Part B files (research.js, part2-4). Loads the research JSONs and the
// built model, checks the US$ revenue build against model revenue, and computes the valuation inputs once:
// forward P/E history (forwardMedian, plus the same median on EPS before tax-order one-offs), IT peer de-rating at
// the 30-Sep-2026 close, justified P/E, reverse DCF, street table, other-income reconciliation. As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'INFY', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'INFY.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'INFY', 'screener.json'), 'utf8'));
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const sg1 = v => `${v < 0 ? '−' : ''}${Math.abs(Math.round(v * 10) / 10).toFixed(1)}`; // signed, no plus
const rup = s => String(s).replace(/Rs ?(?=[0-9])/g, '₹');
const cagr = (a, b, y) => (Math.pow(b / a, 1 / y) - 1) * 100;
const medOf = a => { const s = a.filter(x => x != null).slice().sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SRC = 'Infosys fact sheets, results, earnings calls and annual reports; GAM Research';

// Model basics
const b = A.labels.length - 1; // FY26
const ai = y => A.labels.indexOf(y);
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult, evMult = mv('ev').mult, ebitdaSep28 = mv('ev').metric;
const ebitM = i => (F.ebitda[i] - F.dep[i]) / F.sales[i] * 100; // company-style EBIT margin, forecasts
const ebitHist = i => (A.ebitda[i] - A.dep[i]) / A.sales[i] * 100;
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), yr = fy => SA.find(a => a.fy === fy);
const A26 = yr('FY26'), A25 = yr('FY25'), A21 = yr('FY21'), A20 = yr('FY20'), Q1 = C.q1fy27, FY26 = C.fy26;

// US$ build (assumptions.usdBuild) x Rs/US$ must equal model revenue
const UB = AS.usdBuild, FX = AS.fx.inrPerUsd, VK = Object.keys(UB.base);
const usdV = Object.fromEntries(VK.map(k => { let v = UB.base[k]; return [k, UB.growth[k].map(g => (v *= 1 + g / 100))]; }));
const usdTot = [0, 1, 2].map(i => VK.reduce((s, k) => s + usdV[k][i], 0));
const usdBase = VK.reduce((s, k) => s + UB.base[k], 0);
if (Math.abs(usdBase / FY26.usdRev - 1) > 0.002) throw new Error(`US$ build base ${usdBase} != FY26 US$ revenue ${FY26.usdRev}`);
usdTot.forEach((u, i) => { const gap = u * FX[i] / 10 / F.sales[i] - 1; if (Math.abs(gap) > 0.005) throw new Error(`US$ build x FX off model revenue by ${(gap * 100).toFixed(2)}% in ${F.years[i]}`); });
const usdG = usdTot.map((u, i) => (u / (i ? usdTot[i - 1] : FY26.usdRev) - 1) * 100);
const fxG = FX.map((x, i) => (x / (i ? FX[i - 1] : A26.inrPerUsd) - 1) * 100);

// Growth and EPS
const epsCagrHist = cagr(A.eps[b - 5], A.eps[b], 5); // FY21-26 (Screener basis)
const epsCagrFwd = cagr(A.eps[b], F.eps[2], 3); // FY26-29E
const usdCagr2123 = cagr(A20.usdRev, yr('FY23').usdRev, 3), usdCagr2326 = cagr(yr('FY23').usdRev, A26.usdRev, 3);
const netCashScr = (A.cash[b] || 0) + (A.investments[b] || 0) - (A.borrowings[b] || 0);
const divYield = F.dps[0] / price * 100;

// One-year-forward P/E: house forwardMedian (Apr-2021 on, trough years excluded) + the same on EPS before one-offs
const FM = forwardMedian('INFY', M);
const fwdPe = forwardSeries('INFY', M, 'eps').filter(x => x[0] >= '2016-04-01');
const stat = (arr, from, to = '9999') => { const v = arr.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1) }; };
const H21 = stat(fwdPe, '2021-04-01'), H16 = stat(fwdPe, '2016-04-01'), H2y = stat(fwdPe, '2024-10-01');
const ONEOFF = { 2024: C.fy26.taxOrders.epsImpactFy24, 2025: C.fy26.taxOrders.epsImpactFy25, 2026: 0.43 }; // FY26: tax orders less Labour Codes, net (company's adjusted EPS growth 12.1%)
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsBy = {}; S.tables['profit-loss'].periods.forEach((p, i) => { if (/^Mar/.test(p)) epsBy[+p.slice(-4)] = S.tables['profit-loss'].rows['EPS in Rs'][i]; });
F.years.forEach((y, i) => (epsBy[2000 + +y.slice(2, 4)] = F.eps[i]));
const epsAdjBy = Object.fromEntries(Object.entries(epsBy).map(([k, v]) => [k, v - (ONEOFF[k] || 0)]));
const fwdAdj = fwdPe.filter(x => x[0] >= '2021-04-01').map(([d]) => { const p = S.charts.price.Price.find(z => z[0] === d)?.[1] ?? M.price.series.find(z => z[0] === d)?.[1]; return [d, p ? Math.round(p / epsAdjBy[fyOf(d)] * 10) / 10 : null]; }).filter(x => x[1]);
const HA = stat(fwdAdj, '2021-04-01');
const fwdNow = price / F.eps[1];

// Trailing EV/EBITDA history (Screener), same window
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]).sort((a, c) => a - c);
const evMed = evHist[Math.floor(evHist.length / 2)], evMin = evHist[0];
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);

// IT peers at the 30-Sep-2026 close; de-rating vs each one's five-year median trailing P/E (Infosys itself excluded)
const PEER_SYMS = ['INFY', 'TCS', 'HCLTECH', 'WIPRO', 'TECHM', 'LTM', 'PERSISTENT', 'COFORGE', 'MPHASIS', 'LTTS'];
const PEERS = peersAsOf(PEER_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const ld = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
const med5 = sym => medOf((ld(sym).charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]));
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const INCUMBENTS = ['TCS', 'HCLTECH', 'WIPRO'], MIDCAPS = ['LTM', 'PERSISTENT', 'COFORGE', 'MPHASIS', 'LTTS'], ALL8 = [...INCUMBENTS, ...MIDCAPS];
// House rule for the IT reports: sector de-rating = median of the full IT peer set (TCS, HCLTech, Wipro, LTIMindtree, Persistent,
// Coforge, Mphasis, LTTS), excluding Infosys itself and Tech Mahindra (FY24-25 earnings trough). Incumbents-only is a sensitivity.
const allDr = medOf(ALL8.map(s => derate[s])), sectorDr = allDr, incDr = medOf(INCUMBENTS.map(s => derate[s])), all9Dr = medOf([...ALL8, 'TECHM'].map(s => derate[s])), midDr = medOf(MIDCAPS.map(s => derate[s]));
const afterInc = FM.median * (1 + incDr / 100), afterAll = FM.median * (1 + allDr / 100);
const shortName = s => ({ INFY: 'Infosys', TCS: 'TCS', HCLTECH: 'HCLTech', WIPRO: 'Wipro', TECHM: 'Tech Mahindra', LTM: 'LTIMindtree', PERSISTENT: 'Persistent', COFORGE: 'Coforge', MPHASIS: 'Mphasis', LTTS: 'L&T Technology Services' }[s] || s);
const qGrowth = sym => { const q = ld(sym).tables.quarters; const i = q.periods.indexOf('Jun 2026'), j = q.periods.indexOf('Jun 2025'); return i >= 0 && j >= 0 ? (q.rows.Sales[i] / q.rows.Sales[j] - 1) * 100 : null; };
const Q1G = Object.fromEntries(PEER_SYMS.map(s => [s, qGrowth(s)]));

// Returns: justified forward P/E = cash payout x (1 + g) / (Ke - g); reverse DCF (terminal growth the price implies)
const cashPayout = 0.90; // ~85% of FCF, FCF ~106% of profit (FY26 adjusted)
const justPe = (g, ke = V.ke) => cashPayout * (1 + g / 100) / ((ke - g) / 100);
const gFor = (pe, ke = V.ke) => (pe * ke / 100 - cashPayout) / (pe + cashPayout) * 100; // long-run growth at which justified P/E = pe
const dcfAt = g => { const w = V.wacc, N = V.rows.length, last = V.rows.at(-1); const tv = last.fcff * (1 + g / 100) / ((w - g) / 100) / Math.pow(1 + w / 100, N); return (V.pvExplicit + tv + V.netCash) / F.shares * Math.pow(1 + V.ke / 100, (AS.dcf.rollForwardMonths ?? 6) / 12); };
let lo = -5, hi = V.wacc - 0.5; for (let k = 0; k < 50; k++) { const mid = (lo + hi) / 2; if (dcfAt(mid) < price) lo = mid; else hi = mid; }
const impliedG = (lo + hi) / 2;

// Other income: FY27E vs FY26 and the twelve months to Jun-26 (Screener basis), each made comparable
const OI = C.otherIncomeFy26;
const oiFy26Under = OI.total - OI.taxRefundInterest - OI.miscPropertyGain;
const oiTtm = A.ttm.otherIncome, oiTtmUnder = oiTtm + FY26.labourCodesCr - FY26.taxOrders.interestCr;
const treasuryInc = i => AS.treasuryYield[i] / 100 * (i ? F.treasury[i - 1] : netCashScr);
const leases = A.borrowings[b];
const grossYield = i => { const open = (i ? F.treasury[i - 1] : netCashScr) + leases, close = F.treasury[i] + leases; return treasuryInc(i) / ((open + close) / 2) * 100; };

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, br = n => ST.find(s => s.broker === n);
const post = ST.filter(s => s.date >= '2026-07-23' && s.tp);
const tpSorted = post.map(s => s.tp).sort((x, y) => x - y), medTp = medOf(tpSorted), avgTp = tpSorted.reduce((s, x) => s + x, 0) / tpSorted.length;
const withEps = ST.filter(s => s.eps), avgEps = y => withEps.reduce((s, x) => s + x.eps[y], 0) / withEps.length;
const peBrokers = ST.filter(s => s.method === 'P/E' && /^\d/.test(s.multiple || ''));
const impliedEps = s => (s.tp && /^\d/.test(s.multiple || '') ? s.tp / parseFloat(s.multiple) : null);
const ratingCount = r => ST.filter(s => s.date >= '2026-07-23' && r.includes(s.rating)).length;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, F, V, A, AS, SC, S, ASOF, ASOF_TXT, n0, n1, pc, pc1, sg1, rup, cagr, medOf, shortDate, SRC, b, ai, price, mcap, BM, mv, epsSep28, peMult, evMult, ebitdaSep28, ebitM, ebitHist,
  SA, SQ, QL, yr, A26, A25, A21, A20, Q1, FY26, UB, FX, VK, usdV, usdTot, usdG, fxG, epsCagrHist, epsCagrFwd, usdCagr2123, usdCagr2326, netCashScr, divYield,
  FM, fwdPe, H21, H16, H2y, ONEOFF, fwdAdj, HA, fwdNow, evMed, evMin, ttmEbitda, PEER_SYMS, PEERS, P, MED5, derate, INCUMBENTS, MIDCAPS, ALL8, sectorDr, allDr, incDr, all9Dr, midDr, afterInc, afterAll, shortName, Q1G,
  cashPayout, justPe, gFor, dcfAt, impliedG, OI, oiFy26Under, oiTtm, oiTtmUnder, treasuryInc, grossYield, leases, rating, ruleText, buyBelow, sellAbove, ST, br, post, tpSorted, medTp, avgTp, withEps, avgEps, peBrokers, impliedEps, ratingCount };
