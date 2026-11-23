// TCS initiation: shared context for the Part B files (research.js, part2-4b). Loads the research JSONs and
// the built model, checks the USD revenue build against model revenue, and computes the valuation inputs
// (forward P/E history via forwardMedian, one-off-adjusted series, peer de-rating, street table) once.
// Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'TCS', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json'), ASJ = rd('assumptions.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'TCS.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const SRC = 'TCS fact sheets, press releases, earnings calls and annual reports; GAM Research';
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };

// Operating data (segments.json) and company facts
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const yr = fy => SA.find(a => a.fy === fy);
const A26 = yr('FY26'), A25 = yr('FY25'), A24 = yr('FY24'), A23 = yr('FY23'), Q1 = C.q1fy27, FY26 = C.fy26, EX = C.exceptionalItems;
const VERT = ['bfsi', 'cbg', 'lsh', 'mfg', 'tech', 'cmi', 'eru', 'rmo'], GEO = ['na', 'latam', 'uk', 'ce', 'apac', 'india', 'mea'];
const VN = { bfsi: 'BFSI', cbg: 'Consumer Business', lsh: 'Life Sciences & Healthcare', mfg: 'Manufacturing', tech: 'Technology & Services', cmi: 'Communication & Media', eru: 'Energy, Resources & Utilities', rmo: 'Regional Markets & Others' };
const GN = { na: 'North America', latam: 'Latin America', uk: 'UK', ce: 'Continental Europe', apac: 'Asia Pacific', india: 'India', mea: 'Middle East & Africa' };

// Model outputs (F values in the model file are rounded; recompute EPS for text)
const price = M.price.last, mcap = price * F.shares, b = A.labels.length - 1;
const eps = F.pat.map(p => p / F.shares);
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key), BMV = BM.map(m => m.value);
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult, evMult = mv('ev').mult;
const EPS26ADJ = FY26.epsExExceptional, EPS26 = A.eps[b];
const epsCagrHist = (Math.pow(EPS26ADJ / A.eps[b - 5], 1 / 5) - 1) * 100; // FY21 reported to FY26 before one-offs
const epsCagrFwd = (Math.pow(eps[2] / EPS26ADJ, 1 / 3) - 1) * 100; // FY26 (before one-offs) to FY29E
const netCashBase = (A.cash[b] || 0) + (A.investments[b] || 0) + (AS.otherTreasury?.base || 0) - (A.borrowings[b] || 0);

// USD build: FY26 mix x growth x INR/USD must equal model revenue (single-line model)
const UB = ASJ.usdBuild;
const usd = (() => { let lv = Object.fromEntries(VERT.map(k => [k, UB.baseUsdM * UB.mixPct[k] / 100])); return [0, 1, 2].map(i => { lv = Object.fromEntries(VERT.map(k => [k, lv[k] * (1 + UB.growthPct[k][i] / 100)])); const tot = VERT.reduce((s, k) => s + lv[k], 0); return { ...lv, tot, inr: tot * UB.inrPerUsd[i] / 10 }; }); })();
const usdGrowth = usd.map((u, i) => (u.tot / (i ? usd[i - 1].tot : UB.baseUsdM) - 1) * 100);
const fxGrowth = UB.inrPerUsd.map((x, i) => (x / (i ? UB.inrPerUsd[i - 1] : UB.inrPerUsdFy26) - 1) * 100);
usd.forEach((u, i) => { const gap = Math.abs(u.inr / F.sales[i] - 1); if (gap > 0.002) throw new Error(`TCS USD build ${F.years[i]}: Rs${Math.round(u.inr)} cr vs model revenue Rs${F.sales[i]} cr (${(gap * 100).toFixed(2)}% gap)`); });

// One-year-forward P/E: house forwardMedian (reported EPS), plus our series on EPS before the FY24/FY26 one-offs
const FM = forwardMedian('TCS', M);
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'TCS', 'screener.json'), 'utf8'));
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsBy = {}; S.tables['profit-loss'].periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) epsBy[+p.slice(-4)] = S.tables['profit-loss'].rows['EPS in Rs'][i]; });
F.years.forEach((y, i) => (epsBy[2000 + +y.slice(2, 4)] = eps[i]));
const epsAdj = { ...epsBy, 2024: epsBy[2024] * 46585 / 45908, 2026: EPS26ADJ }; // FY24: Epic settlement; FY26: restructuring, labour codes, CSC
const pxW = S.charts.price.Price.filter(([d]) => d <= ASOF).concat([[ASOF, price]]);
const fwdOn = E => pxW.filter((_, i) => i % 5 === 0).map(([d, p]) => [d, E[fyOf(d)] > 0 ? Math.round(p / E[fyOf(d)] * 10) / 10 : null]).filter(x => x[1] != null);
const fwdAdj = fwdOn(epsAdj).filter(x => x[0] >= '2016-04-01'), houseFwd = forwardSeries('TCS', M, 'eps').filter(x => x[0] >= '2016-04-01');
const stat = (ser, from, to = '9999') => { const v = ser.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p10: v[Math.floor(v.length * 0.1)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1) }; };
const HA = stat(fwdAdj, '2021-04-01'), H21 = stat(houseFwd, '2021-04-01'), H16 = stat(houseFwd, '2016-04-01'), H2y = stat(fwdAdj, '2024-10-01');
const fwdNow = price / eps[1], peFY27 = price / eps[0];
const fyMed = Object.entries(fwdAdj.reduce((o, [d, v]) => { const k = `FY${String(fyOf(d) - 1).slice(2)}`; (o[k] ||= []).push(v); return o; }, {})).map(([k, v]) => [k, v.sort((a, c) => a - c)[Math.floor(v.length / 2)]]);

// Trailing EV/EBITDA history (Screener), same window
const evSer = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0);
const evHist = evSer.map(x => x[1]).sort((a, c) => a - c), evMed = evHist[Math.floor(evHist.length / 2)], evNow = evSer.at(-1)[1];
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = mv('ev').metric;

// IT-services peers at the 30-Sep-2026 close; de-rating vs each one's five-year median trailing P/E
const PEER_SYMS = ['TCS', 'INFY', 'HCLTECH', 'WIPRO', 'TECHM', 'LTM', 'PERSISTENT', 'COFORGE', 'MPHASIS', 'LTTS', 'OFSS'];
const PEERS = peersAsOf(PEER_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const OTHERS = ['INFY', 'HCLTECH', 'WIPRO', 'LTM', 'PERSISTENT', 'COFORGE', 'MPHASIS', 'LTTS']; // TCS (self), TECHM (FY24 trough), OFSS (products) left out
const drSorted = OTHERS.map(s => derate[s]).sort((a, c) => a - c);
const sectorDr = (drSorted[3] + drSorted[4]) / 2;
const incDr = ['INFY', 'HCLTECH', 'WIPRO'].map(s => derate[s]).sort((a, c) => a - c)[1]; // incumbents-only sensitivity (not the base)
const afterSector = HA.med * (1 + sectorDr / 100), afterOwn = HA.med * (1 + derate.TCS / 100), midpoint = (afterSector + afterOwn) / 2;
const PG = Object.fromEntries(PEER_SYMS.map(s => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8')); const q = X.tables.quarters, pl = X.tables['profit-loss'], i = q.periods.indexOf('Jun 2026'), j = pl.periods.indexOf('Mar 2026'), j3 = pl.periods.indexOf('Mar 2023');
  return [s, { q1yoy: (q.rows.Sales[i] / q.rows.Sales[i - 4] - 1) * 100, cagr3: (Math.pow(pl.rows.Sales[j] / pl.rows.Sales[j3], 1 / 3) - 1) * 100 }]; })); // INR revenue growth (Screener, consolidated)
const shortName = s => ({ TCS: 'TCS', INFY: 'Infosys', HCLTECH: 'HCLTech', WIPRO: 'Wipro', TECHM: 'Tech Mahindra', LTM: 'LTIMindtree (LTM)', PERSISTENT: 'Persistent', COFORGE: 'Coforge', MPHASIS: 'Mphasis', LTTS: 'L&T Technology Services', OFSS: 'Oracle Financial Services' }[s] || s);
const roeFwd = F.roe[1], justified = g => (1 - g / roeFwd) * (1 + g / 100) / ((V.ke - g) / 100);
const impliedG = (() => { let lo = 0, hi = V.ke - 0.5; for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (justified(mid) < price / epsSep28) lo = mid; else hi = mid; } return (lo + hi) / 2; })(); // perpetual growth the price implies

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, CONS = D.street.consensus, TONLY = D.street.targetOnly;
const br = name => ST.find(s => s.broker === name);
const withEps = ST.filter(s => s.eps);
const allTp = [...ST.map(s => s.tp), ...TONLY.map(t => t[1])].filter(Boolean).sort((a, c) => a - c);
const medTp = (allTp[Math.floor((allTp.length - 1) / 2)] + allTp[Math.ceil((allTp.length - 1) / 2)]) / 2;
const avgTp = allTp.reduce((s, x) => s + x, 0) / allTp.length;
const avgEps = y => withEps.reduce((s, x) => s + x.eps[y], 0) / withEps.length;
const cnt = re => ST.filter(s => re.test(s.rating || '')).length;
const ratingMix = { pos: cnt(/Buy|Add|Accumulate|Overweight/), neu: cnt(/Hold|Neutral|Equal/), neg: cnt(/Sell|Reduce|Under/) };

module.exports = { ROOT, RD, C, D, SG, ASJ, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, SRC, shortDate, SA, SQ, QL, yr, A26, A25, A24, A23, Q1, FY26, EX, VERT, GEO, VN, GN,
  price, mcap, b, eps, mv, BMV, epsSep28, peMult, evMult, EPS26ADJ, EPS26, epsCagrHist, epsCagrFwd, netCashBase, UB, usd, usdGrowth, fxGrowth,
  FM, fwdAdj, houseFwd, HA, H21, H16, H2y, fwdNow, peFY27, fyMed, evMed, evNow, ttmEbitda, ebitdaSep28,
  PEER_SYMS, PEERS, P, PG, MED5, derate, OTHERS, sectorDr, incDr, afterSector, afterOwn, midpoint, shortName, roeFwd, justified, impliedG,
  rating, buyBelow, sellAbove, ST, CONS, TONLY, br, withEps, allTp, medTp, avgTp, avgEps, ratingMix };
