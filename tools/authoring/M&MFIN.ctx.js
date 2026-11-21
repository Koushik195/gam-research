// M&M Financial Services initiation: shared context for the Part B files (research.js, part2-6).
// Loads the research JSONs and the built model, and computes the valuation inputs once: forward P/B and P/E
// history, lender peers' P/B / P/E against their five-year medians (excluding M&M Finance), the multiple
// derivation (incl. the returns-regime factor), the street table inputs, the segment AUM build and the
// IRDAI / credit-cost sensitivities. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian, forwardMedianPb } = require('./valuation-blend');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const SYM = 'M&MFIN';
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', SYM, 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', `${SYM}.json`), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios, fin = M.fin;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const SRC = 'M&M Finance presentations and calls (Q4FY24-Q1FY27), annual reports, Screener.in (consolidated), GAM Research';
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const fi = l => fin.labels.indexOf(l);
const b = A.labels.length - 1; // FY26 in actuals
const Q1 = C.q1fy27, G = C.guidance, V25 = C.vision2025, AK = C.annualKpis, QK = C.quarterlyKpis;
if (A.labels[b] !== 'FY26') console.warn(`${SYM}: last actual year is ${A.labels[b]}, not FY26`);

// Price and model outputs
const price = M.price.last, shares = F.shares, mcap = price * shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const pbMult = mv('pb').mult, bvSep28 = mv('pb').metric, peMult = mv('pe').mult, epsSep28 = mv('pe').metric;
const bvps26 = A.bvps[b], eps26 = A.eps[b];
const epsCagrFwd = (Math.pow(F.eps[2] / eps26, 1 / 3) - 1) * 100;
const aumCagrHist = (Math.pow(fin.aum[fi('FY26')] / fin.aum[fi('FY21')], 1 / 5) - 1) * 100;
const roeHist = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => [l, fin.roe[fi(l)]]);
const avg = a => a.reduce((s, x) => s + x, 0) / a.length;
const roeWin = avg(['FY23', 'FY24', 'FY25', 'FY26'].map(l => fin.roe[fi(l)])), roeFwd = avg(F.roe);

// Forward P/B and P/E history (price ÷ next full-year book / EPS), house window from Apr-2021
const fwdPb = forwardSeries(SYM, M, 'bvps').filter(x => x[0] >= '2016-04-01');
const fwdPe = forwardSeries(SYM, M, 'eps').filter(x => x[0] >= '2016-04-01');
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p10: v[Math.floor(v.length * 0.1)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const PB16 = stat(fwdPb, '2016-04-01', '2021-03-31'), PB21 = stat(fwdPb, '2021-04-01'), PB23 = stat(fwdPb, '2023-04-01'), PB2122 = stat(fwdPb, '2021-04-01', '2023-03-31');
const PE21 = stat(fwdPe, '2021-04-01'), PE23 = stat(fwdPe, '2023-04-01');
const fmPb = forwardMedianPb(SYM, M), fmPe = forwardMedian(SYM, M);
const fwdPbNow = price / F.bvps[1], fwdPeNow = price / F.eps[1], pbTrail = price / bvps26;
// forwardSeries keeps every 5th weekly point, so the 30-Sep close drops out of the series: add it for charts
const fwdPbChart = fwdPb.at(-1)[0] < ASOF ? [...fwdPb, [ASOF, Math.round(fwdPbNow * 100) / 100]] : fwdPb;

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
  const pat = pl.rows['Net Profit']?.[i];
  const ok = j >= 0 && j0 >= 0 && nw(j) > 0 && nw(j0) > 0;
  return { symbol: sym, name: S.name, price: c, mcapCr: Math.round(numOf(S.topRatios['Market Cap']) / numOf(S.topRatios['Current Price']) * c),
    pb: pb ? pb * k : null, pbMed: med(series('pb', 'Price to book value')), pe: pe ? pe * k : null, peMed: med(series('pe', 'Price to Earning')),
    roe: ok ? pat / ((nw(j) + nw(j0)) / 2) * 100 : null, roa: ok ? pat / ((ta(j) + ta(j0)) / 2) * 100 : null };
}
const PEER_SYMS = ['M&MFIN', 'BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'MUTHOOTFIN', 'SBICARD', 'MANAPPURAM', 'LTF', 'POONAWALLA', 'ABCAPITAL', 'BAJAJHFL', 'HDBFS'];
const PEERS = PEER_SYMS.map(peer), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
PEERS.forEach(p => { p.pbVs = p.pb && p.pbMed ? (p.pb / p.pbMed - 1) * 100 : null; p.peVs = p.pe && p.peMed ? (p.pe / p.peMed - 1) * 100 : null; });
// De-rating set: lenders with five years of history, excluding M&M Finance itself. Left out: Bajaj Housing Finance
// (listed Sep-2024) and HDB Financial (listed Jul-2025), which have no five-year median.
const NO5Y = ['BAJAJHFL', 'HDBFS'];
const DR_SYMS = ['BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'MUTHOOTFIN', 'SBICARD', 'MANAPPURAM', 'LTF', 'POONAWALLA', 'ABCAPITAL'];
const medOf = a => { const s = a.filter(x => x != null).sort((x, y) => x - y), m = s.length / 2; return s.length % 2 ? s[Math.floor(m)] : (s[m - 1] + s[m]) / 2; };
const sectorPbDr = medOf(DR_SYMS.map(s => P[s].pbVs)), sectorPeDr = medOf(DR_SYMS.map(s => P[s].peVs));
const sectorPbDrCore = medOf(DR_SYMS.filter(s => !['ABCAPITAL', 'MANAPPURAM'].includes(s)).map(s => P[s].pbVs)); // check: without the holdco and Manappuram
const vehSyms = ['CHOLAFIN', 'SHRIRAMFIN', 'LTF'], vehPbDr = medOf(vehSyms.map(s => P[s].pbVs));
const shortName = s => ({ BAJFINANCE: 'Bajaj Finance', CHOLAFIN: 'Cholamandalam', SHRIRAMFIN: 'Shriram Finance', MUTHOOTFIN: 'Muthoot Finance', SBICARD: 'SBI Cards', MANAPPURAM: 'Manappuram', LTF: 'L&T Finance', 'M&MFIN': 'M&M Finance', POONAWALLA: 'Poonawalla Fincorp', ABCAPITAL: 'Aditya Birla Capital', BAJAJHFL: 'Bajaj Housing Fin.', HDBFS: 'HDB Financial' }[s] || s);

// Multiple derivation (P/B primary, P/E cross-check), as in the other lender reports: own median since Apr-2021 ×
// sector move × regime (median since Apr-2023 ÷ full-window median). The ROE-scaled variant (our forecast ROE ÷ the
// FY23-26 ROE the window priced) is shown only as a sensitivity in the derivation table.
const regimePb = PB23.med / PB21.med, regimePe = PE23.med / PE21.med;
const roeScale = roeFwd / roeWin, pbRoeVariant = Math.round(fmPb.median * (1 + sectorPbDr / 100) * roeScale * 10) / 10;
if (fmPb.median !== PB21.med || fmPe.median !== PE21.med) console.warn(`${SYM}: house forward medians differ from the window stats`);
const pbDerived = Math.round(fmPb.median * (1 + sectorPbDr / 100) * regimePb * 10) / 10;
const peDerived = Math.round(fmPe.median * (1 + sectorPeDr / 100) * regimePe);
if (Math.abs(pbDerived - pbMult) > 0.05) console.warn(`${SYM}: derived P/B ${pbDerived}x differs from assumptions ${pbMult}x`);
if (Math.abs(peDerived - peMult) > 0.5) console.warn(`${SYM}: derived P/E ${peDerived}x differs from assumptions ${peMult}x`);

// Segment AUM build (assumptions.aumBuild) must sum to the model's one AUM line within 1%
const MIX26 = SG.mixPct.find(r => r.fy === 'FY26'), AB = AS.aumBuild, SEGK = Object.keys(AB.growth);
const SA26 = Object.fromEntries(SEGK.map(k => [k, k === 'mrhfl' ? MIX26.mrhfl : MIX26[k] / 100 * MIX26.businessAssets]));
SA26.total = SEGK.reduce((s, k) => s + SA26[k], 0);
const WHEELS = ['pv', 'cv', 'used', 'tractor', 'tw3'], NONW = ['sme', 'others', 'mrhfl'];
const BUILD = [0, 1, 2].map(i => ({ year: F.years[i] }));
for (const k of SEGK) { let v = SA26[k]; [0, 1, 2].forEach(i => { v *= 1 + AB.growth[k][i] / 100; BUILD[i][k] = v; }); }
BUILD.forEach((r, i) => { r.total = SEGK.reduce((s, k) => s + r[k], 0); r.wheels = WHEELS.reduce((s, k) => s + r[k], 0); r.nonw = NONW.reduce((s, k) => s + r[k], 0); r.model = F.aum[i]; r.gap = (r.total / r.model - 1) * 100;
  if (Math.abs(r.gap) > 1) console.warn(`${SYM}: segment build ${r.year} ${r.total.toFixed(0)} vs model AUM ${r.model.toFixed(0)} (${r.gap.toFixed(1)}%)`); });
SA26.wheels = WHEELS.reduce((s, k) => s + SA26[k], 0); SA26.nonw = NONW.reduce((s, k) => s + SA26[k], 0);

// IRDAI sensitivity: corporate-agency insurance commission (FY26 ₹507 cr) and the base-case haircut from FY28E
const insCom = C.fy26.insuranceCommissionLife + C.fy26.insuranceCommissionGeneral, insPctPbt = insCom / A.pbt[b] * 100, insPctAum = insCom / fin.avgAum[fi('FY26')] * 100;
const feeCut28 = (AS.feeIncomePct[0] - AS.feeIncomePct[1]) / 100 * F.avgAum[1];
const feeCutEps28 = feeCut28 * (1 - AS.taxRate[1] / 100) / F.sharesOut[1];
const cc10 = F.avgAum[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100; // 10bp of credit cost, % of FY28E PAT
const overlay = C.fy26.overlayQ3 + C.fy26.overlayQ4, overlayEps = overlay * (1 - AS.taxRate[0] / 100) / shares;

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, CONS = D.street.consensus, SE = D.street.estimates;
const tps = ST.map(s => s.tp), tpHi = Math.max(...tps), tpLo = Math.min(...tps);

module.exports = { SYM, ROOT, RD, C, D, SG, M, F, V, A, AS, SC, fin, fi, ASOF, ASOF_TXT, n0, n1, n2, pc, pc1, SRC, shortDate, b, Q1, G, V25, AK, QK,
  price, shares, mcap, mv, pbMult, bvSep28, peMult, epsSep28, bvps26, eps26, epsCagrFwd, aumCagrHist, roeHist, roeWin, roeFwd,
  fwdPb, fwdPbChart, fwdPe, PB16, PB21, PB23, PB2122, PE21, PE23, fmPb, fmPe, fwdPbNow, fwdPeNow, pbTrail, PEERS, P, NO5Y, DR_SYMS, sectorPbDr, sectorPbDrCore, sectorPeDr, vehPbDr, shortName, regimePb, regimePe, roeScale, pbRoeVariant, pbDerived, peDerived,
  BUILD, SA26, WHEELS, NONW, insCom, insPctPbt, insPctAum, feeCut28, feeCutEps28, cc10, overlay, overlayEps, rating, buyBelow, sellAbove, ST, CONS, SE, tpHi, tpLo };
