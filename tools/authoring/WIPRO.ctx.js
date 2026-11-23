// Wipro initiation: shared context for the Part B files (research.js, part2-4). Loads the research JSONs and the
// built model, checks the US-dollar revenue build against model revenue, and computes the valuation inputs (forward
// P/E history via forwardMedian, peer de-rating, street table, reverse DCF) once. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'WIPRO', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'WIPRO.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const SRC = 'Wipro datasheets, investor decks, calls and annual reports; GAM Research';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const b = A.labels.length - 1; // FY26 index in actuals
const Q1 = C.q1fy27, FY26 = C.fy26, QR = C.quarterly.rows, SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);

// US-dollar revenue build (assumptions.usdBuild) -> must equal model revenue
const UB = AS.usdBuild, SMU = ['americas1', 'americas2', 'europe', 'apmea'];
const SMU_NAME = { americas1: 'Americas 1', americas2: 'Americas 2', europe: 'Europe', apmea: 'APMEA' };
const smuUsd = Object.fromEntries(SMU.map(k => { let v = UB.base.itsUsdM * UB.base.mixPct[k] / 100; return [k, [v, ...UB.growthPct[k].map(g => (v *= 1 + g / 100))]]; }));
const usdF = [0, 1, 2].map(i => SMU.reduce((s, k) => s + smuUsd[k][i + 1], 0)); // FY27-29E
const usdGrowth = usdF.map((u, i) => (u / (i ? usdF[i - 1] : UB.base.itsUsdM) - 1) * 100);
const revBuild = usdF.map((u, i) => u * UB.inrUsd[i] / 10 + UB.itProductsAndReconCr[i]);
revBuild.forEach((r, i) => { if (Math.abs(r / F.sales[i] - 1) > 0.005) throw new Error(`USD build Rs${n0(r)} cr != model revenue Rs${n0(F.sales[i])} cr in ${F.years[i]}`); });
if (Math.abs(SMU.reduce((s, k) => s + UB.base.mixPct[k], 0) - 100) > 0.05) throw new Error('SMU mix does not sum to 100');
const mixF = i => Object.fromEntries(SMU.map(k => [k, smuUsd[k][i + 1] / usdF[i] * 100]));
const itsEbit = i => F.ebit[i] / F.sales[i] * 100 + 0.3; // company-basis IT Services EBIT margin implied by the model

// Price and model outputs
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult, evMult = mv('ev').mult;
const epsReported26 = 12.58, epsPf26 = A.eps[b];
const epsCagrHist = (Math.pow(epsReported26 / A.eps[b - 5], 1 / 5) - 1) * 100; // FY21-26, reported (bonus-adjusted)
const epsCagrFwd = (Math.pow(F.eps[2] / epsPf26, 1 / 3) - 1) * 100; // FY26 pro-forma to FY29E
const netCashPf = (A.cash[b] || 0) + (A.investments[b] || 0) - (A.borrowings[b] || 0);
const netCashJun26 = Math.round((Q1.bsJun26M.cash + Q1.bsJun26M.investmentsCurrent + Q1.bsJun26M.investmentsNonCurrent + Q1.bsJun26M.equityMethod - Q1.bsJun26M.borrowingsCurrent - Q1.bsJun26M.borrowingsNonCurrent - Q1.bsJun26M.leases) / 10);

// Forward P/E history (house starting point: forwardMedian, Apr-2021 on, trough years excluded)
const FM = forwardMedian('WIPRO', M);
const fwdPe = forwardSeries('WIPRO', M, 'eps').filter(x => x[0] >= '2016-04-01');
const stat = (from, to = '9999') => { const v = fwdPe.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p10: v[Math.floor(v.length * 0.1)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1) }; };
const H21 = stat('2021-04-01'), H16 = stat('2016-04-01'), Hpre = stat('2016-04-01', '2020-03-31'), H2y = stat('2024-10-01');
const fwdNow = price / F.eps[1];

// Trailing EV/EBITDA and P/E history (Screener), same window
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'WIPRO', 'screener.json'), 'utf8'));
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]).sort((a, c) => a - c);
const evMed = evHist[Math.floor(evHist.length / 2)];
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);
const ebitdaSep28 = mv('ev').metric;

// Peers at the 30-Sep-2026 close, and de-rating vs each one's five-year median trailing P/E (Wipro excluded)
const PEER_SYMS = ['WIPRO', 'TCS', 'INFY', 'HCLTECH', 'TECHM', 'LTM', 'LTTS', 'MPHASIS', 'PERSISTENT', 'COFORGE'];
const PEERS = peersAsOf(PEER_SYMS, ASOF);
const P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const USED = ['TCS', 'INFY', 'HCLTECH', 'LTM', 'LTTS', 'MPHASIS', 'PERSISTENT', 'COFORGE'], LEFT_OUT = ['TECHM'], INCUMB = ['TCS', 'INFY', 'HCLTECH', 'LTM']; // batch rule: full IT set, Wipro and TechM excluded
const med = a => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const sectorDr = med(USED.map(s => derate[s]));
const incDr = med(INCUMB.map(s => derate[s])), withTm = med([...USED, 'TECHM'].map(s => derate[s]));
const afterDerate = FM.median * (1 + sectorDr / 100);
const shortName = s => ({ WIPRO: 'Wipro', TCS: 'TCS', INFY: 'Infosys', HCLTECH: 'HCLTech', TECHM: 'Tech Mahindra', LTM: 'LTIMindtree', LTTS: 'L&T Technology', MPHASIS: 'Mphasis', PERSISTENT: 'Persistent', COFORGE: 'Coforge' }[s] || s);

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, CONS = D.street.consensus;
const byB = n => ST.find(s => s.broker.startsWith(n));
const mosl = byB('Motilal'), pl = byB('Prabhudas'), emkay = byB('Emkay'), choice = byB('Choice'), dc = byB('Deven');
const withTp = ST.filter(s => s.tp), tpSorted = withTp.map(s => s.tp).sort((a, c) => a - c);
const medTp = med(tpSorted), avgTp = tpSorted.reduce((s, x) => s + x, 0) / tpSorted.length;
const PRE_BB = 1050.355 / 990.355; // MOSL/PL print EPS on ~10.5 bn shares
const postEq = (s, y) => (s && s.eps?.[y] ? s.eps[y] * (/pre-buyback|10\.5/.test(s.shareBasis || '') ? PRE_BB : 1) : null);

// Reverse DCF: the perpetual rupee growth (fade target = terminal) at which the engine's DCF equals the price
function dcfAt(g, ke = V.ke) {
  const d = AS.dcf, t = AS.taxRate[2] / 100, n = F.years.length, yrs = d.years; let s = F.sales[0], pv = 0, last = 0;
  for (let k = 1; k <= yrs; k++) {
    let gr, m, cx; if (k < n) { gr = F.salesGrowth[k]; m = F.ebitdaMargin[k]; cx = F.capex[k] / F.sales[k] * 100; }
    else { const w = (k - n + 1) / (yrs - n + 1), g0 = F.salesGrowth[n - 1], m0 = F.ebitdaMargin[n - 1], c0 = F.capex[n - 1] / F.sales[n - 1] * 100; gr = g0 + (g - g0) * w; m = m0 + (d.fadeMarginTo - m0) * w; cx = c0 + (d.fadeCapexPctTo - c0) * w; }
    s *= 1 + gr / 100; const dep = s * d.depPctOfSales / 100, f = (s * m / 100 - dep) * (1 - t) + dep - s * cx / 100 - F.owcPct / 100 * s * (gr / (100 + gr));
    pv += f / Math.pow(1 + ke / 100, k - 0.5); last = f;
  }
  const tv = last * (1 + g / 100) / ((ke - g) / 100) / Math.pow(1 + ke / 100, yrs);
  return (pv + tv + F.treasury[0]) / F.shares;
}
let lo = -5, hi = 9; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (dcfAt(mid) < price) lo = mid; else hi = mid; }
const impliedG = (lo + hi) / 2;

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, n2, pc, pc1, rup, SRC, shortDate, b, Q1, FY26, QR, SA, SQ, QL,
  UB, SMU, SMU_NAME, smuUsd, usdF, usdGrowth, revBuild, mixF, itsEbit, price, mcap, mv, epsSep28, peMult, evMult, epsReported26, epsPf26, epsCagrHist, epsCagrFwd, netCashPf, netCashJun26,
  FM, fwdPe, H21, H16, Hpre, H2y, fwdNow, evMed, ttmEbitda, ebitdaSep28, PEER_SYMS, PEERS, P, MED5, derate, USED, LEFT_OUT, INCUMB, sectorDr, incDr, withTm, med, afterDerate, shortName,
  rating, buyBelow, sellAbove, ST, CONS, mosl, pl, emkay, choice, dc, withTp, tpSorted, medTp, avgTp, PRE_BB, postEq, dcfAt, impliedG };
