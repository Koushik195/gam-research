// Cholamandalam Investment & Finance initiation: shared context for the Part B files (research.js, part2-6).
// Loads the research JSONs and the built model, and computes the valuation inputs once: forward P/B and P/E
// history, lender peers' P/B / P/E against their five-year medians (excluding Chola), the multiple
// derivation, the street table inputs and the IRDAI insurance-commission sensitivity.
// Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian, forwardMedianPb } = require('./valuation-blend');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'CHOLAFIN', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'CHOLAFIN.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios, fin = M.fin;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const SRC = 'Chola presentations and calls (Q4FY24-Q1FY27), annual reports, Screener.in (consolidated), GAM Research';
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const fi = l => fin.labels.indexOf(l);
const b = A.labels.length - 1; // FY26 in actuals
const Q1 = C.q1fy27, G27 = C.fy27Guidance, G26 = C.fy26Guidance;

// Price and model outputs
const price = M.price.last, shares = F.shares, sharesNow = shares + AS.newShares[0], mcap = price * sharesNow;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const pbMult = mv('pb').mult, bvSep28 = mv('pb').metric, peMult = mv('pe').mult, epsSep28 = mv('pe').metric;
const bvps26 = A.bvps[b], eps26 = A.eps[b];
const epsCagrFwd = (Math.pow(F.eps[2] / eps26, 1 / 3) - 1) * 100;
const epsCagrHist = (Math.pow(A.eps[b] / A.eps[b - 5], 1 / 5) - 1) * 100; // FY21-26
const aumCagrHist = (Math.pow(fin.aum[fi('FY26')] / fin.aum[fi('FY21')], 1 / 5) - 1) * 100;

// Forward P/B and P/E history (price ÷ next full-year book / EPS), house window from Apr-2021
const fwdPb = forwardSeries('CHOLAFIN', M, 'bvps').filter(x => x[0] >= '2016-04-01');
const fwdPe = forwardSeries('CHOLAFIN', M, 'eps').filter(x => x[0] >= '2016-04-01');
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p10: v[Math.floor(v.length * 0.1)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const PB21 = stat(fwdPb, '2021-04-01'), PB23 = stat(fwdPb, '2023-04-01'), PB2y = stat(fwdPb, '2024-10-01'), PB2122 = stat(fwdPb, '2021-04-01', '2023-03-31');
const PE21 = stat(fwdPe, '2021-04-01'), PE23 = stat(fwdPe, '2023-04-01');
const fmPb = forwardMedianPb('CHOLAFIN', M), fmPe = forwardMedian('CHOLAFIN', M);
const fwdPbNow = price / F.bvps[1], fwdPeNow = price / F.eps[1];
// forwardSeries keeps every 5th weekly point, so the 30-Sep close can drop out of the series: add it for charts
const fwdPbChart = fwdPb.at(-1)[0] < ASOF ? [...fwdPb, [ASOF, Math.round(fwdPbNow * 10) / 10]] : fwdPb;

// Peers at the 30-Sep-2026 close: trailing P/B and P/E vs their own five-year medians, FY26 ROE / ROA.
// asof-peers.js has no P/B or ROA, so they are computed here from each peer's Screener file.
const closes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', `${ASOF}.json`), 'utf8')).closes;
const at = (s, d) => { const f = (s || []).filter(([x, v]) => x <= d && v != null); return f.length ? f[f.length - 1][1] : null; };
const numOf = s => Number(String(s).replace(/[^0-9.]/g, ''));
function peer(sym) {
  const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
  const wk = at(S.charts.price.Price, ASOF), c = closes[sym] ?? wk, k = c / wk;
  const series = (ch, nm) => (S.charts[ch]?.[nm] || []);
  const med = s => { const v = s.filter(([d, x]) => d >= '2021-09-30' && d <= ASOF && x > 0).map(x => x[1]).sort((a, z) => a - z); return v.length > 50 ? v[Math.floor(v.length / 2)] : null; };
  const pb = at(series('pb', 'Price to book value'), ASOF), pe = at(series('pe', 'Price to Earning'), ASOF);
  const pl = S.tables['profit-loss'], bs = S.tables['balance-sheet'], i = pl.periods.indexOf('Mar 2026'), j = bs.periods.indexOf('Mar 2026'), j0 = bs.periods.indexOf('Mar 2025');
  const nw = jj => (bs.rows['Equity Capital']?.[jj] || 0) + (bs.rows['Reserves']?.[jj] || 0), ta = jj => bs.rows['Total Assets']?.[jj];
  const pat = pl.rows['Net Profit']?.[i], rev = pl.rows['Revenue']?.[i], rev0 = pl.rows['Revenue']?.[i - 1];
  const ok = j >= 0 && j0 >= 0 && nw(j) > 0 && nw(j0) > 0;
  return { symbol: sym, name: S.name, price: c, mcapCr: Math.round(numOf(S.topRatios['Market Cap']) / numOf(S.topRatios['Current Price']) * c),
    pb: pb ? pb * k : null, pbMed: med(series('pb', 'Price to book value')), pe: pe ? pe * k : null, peMed: med(series('pe', 'Price to Earning')),
    roe: ok ? pat / ((nw(j) + nw(j0)) / 2) * 100 : null, roa: ok ? pat / ((ta(j) + ta(j0)) / 2) * 100 : null, revG: rev && rev0 ? (rev / rev0 - 1) * 100 : null, pat };
}
const PEER_SYMS = ['CHOLAFIN', 'BAJFINANCE', 'SHRIRAMFIN', 'MUTHOOTFIN', 'SBICARD', 'LTF', 'M&MFIN', 'POONAWALLA', 'ABCAPITAL', 'BAJAJHFL', 'HDBFS'];
const PEERS = PEER_SYMS.map(peer), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
PEERS.forEach(p => { p.pbVs = p.pb && p.pbMed ? (p.pb / p.pbMed - 1) * 100 : null; p.peVs = p.pe && p.peMed ? (p.pe / p.peMed - 1) * 100 : null; });
// De-rating set: lenders with five years of history, excluding Chola itself. Left out: Bajaj Housing Finance
// (listed Sep-2024) and HDB Financial (listed Jul-2025), which have no five-year median.
const DR_SYMS = ['BAJFINANCE', 'SHRIRAMFIN', 'MUTHOOTFIN', 'SBICARD', 'LTF', 'M&MFIN', 'POONAWALLA', 'ABCAPITAL'];
const medOf = a => { const s = a.filter(x => x != null).sort((x, y) => x - y), m = s.length / 2; return s.length % 2 ? s[Math.floor(m)] : (s[m - 1] + s[m]) / 2; };
const sectorPbDr = medOf(DR_SYMS.map(s => P[s].pbVs)), sectorPeDr = medOf(DR_SYMS.map(s => P[s].peVs));
const vehSyms = ['SHRIRAMFIN', 'M&MFIN', 'LTF'], vehPbDr = medOf(vehSyms.map(s => P[s].pbVs));
const shortName = s => ({ BAJFINANCE: 'Bajaj Finance', CHOLAFIN: 'Cholamandalam', SHRIRAMFIN: 'Shriram Finance', MUTHOOTFIN: 'Muthoot Finance', SBICARD: 'SBI Cards', LTF: 'L&T Finance', 'M&MFIN': 'M&M Financial', POONAWALLA: 'Poonawalla Fincorp', ABCAPITAL: 'Aditya Birla Capital', BAJAJHFL: 'Bajaj Housing Finance', HDBFS: 'HDB Financial' }[s] || s);

// Multiple derivation (P/B primary, P/E cross-check): own median × sector move × growth regime (1.00, see valuation)
const REGIME = 1.0;
if (fmPb.median !== PB21.med || fmPe.median !== PE21.med) console.warn('CHOLAFIN: house forward medians differ from the window stats');
const pbDerived = Math.round(fmPb.median * (1 + sectorPbDr / 100) * REGIME * 10) / 10;
const peDerived = Math.round(fmPe.median * (1 + sectorPeDr / 100) * REGIME);
if (Math.abs(pbDerived - pbMult) > 0.05) console.warn(`CHOLAFIN: derived P/B ${pbDerived}x differs from assumptions ${pbMult}x`);
if (Math.abs(peDerived - peMult) > 0.5) console.warn(`CHOLAFIN: derived P/E ${peDerived}x differs from assumptions ${peMult}x`);

// Segment AUM build (assumptions.aumBuild) must sum to the model's one AUM line within 1%
const SA26 = SG.annual.find(a => a.fy === 'FY26'), AB = AS.aumBuild;
const BUILD = [0, 1, 2].map(i => { const r = { year: F.years[i] }; for (const k of Object.keys(AB.growth)) r[k] = (i ? 0 : SA26[k]) ; return r; });
for (const k of Object.keys(AB.growth)) { let v = SA26[k]; [0, 1, 2].forEach(i => { v *= 1 + AB.growth[k][i] / 100; BUILD[i][k] = v; }); }
BUILD.forEach((r, i) => { r.gold = AB.goldCr[i]; r.total = Object.keys(AB.growth).reduce((s, k) => s + r[k], 0) + r.gold; r.model = F.aum[i]; r.gap = (r.total / r.model - 1) * 100;
  if (Math.abs(r.gap) > 1) console.warn(`CHOLAFIN: segment build ${r.year} ${r.total.toFixed(0)} vs model AUM ${r.model} (${r.gap.toFixed(1)}%)`); });

// IRDAI sensitivity: insurance commission (FY26 ₹1,136 cr) and the base-case haircut from FY28E
const insCom = C.fy26.insuranceCommission, insPctPbt = insCom / A.pbt[b] * 100, insPctAum = insCom / fin.avgAum[fi('FY26')] * 100;
const feeCut28 = (AS.feeIncomePct[0] - AS.feeIncomePct[1]) / 100 * F.avgAum[1]; // pre-tax ₹ cr removed in FY28E
const feeCutEps28 = feeCut28 * (1 - AS.taxRate[1] / 100) / F.sharesOut[1];
const cc10 = F.avgAum[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100; // 10bp of credit cost, % of FY28E PAT

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, CONS = D.street.consensus, SE = D.street.estimates;
const tps = ST.map(s => s.tp), tpHi = Math.max(...tps), tpLo = Math.min(...tps);
const streetAtOurBook = x => Math.round(x * bvSep28 / 10) * 10;

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, fin, fi, ASOF, ASOF_TXT, n0, n1, n2, pc, pc1, SRC, shortDate, b, Q1, G27, G26,
  price, shares, sharesNow, mcap, mv, pbMult, bvSep28, peMult, epsSep28, bvps26, eps26, epsCagrFwd, epsCagrHist, aumCagrHist,
  fwdPb, fwdPbChart, fwdPe, PB21, PB23, PB2y, PB2122, PE21, PE23, fmPb, fmPe, fwdPbNow, fwdPeNow, PEERS, P, DR_SYMS, sectorPbDr, sectorPeDr, vehPbDr, shortName, REGIME, pbDerived, peDerived,
  BUILD, SA26, insCom, insPctPbt, insPctAum, feeCut28, feeCutEps28, cc10, rating, buyBelow, sellAbove, ST, CONS, SE, tpHi, tpLo, streetAtOurBook };
