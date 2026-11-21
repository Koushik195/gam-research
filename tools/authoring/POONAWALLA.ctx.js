// Poonawalla Fincorp initiation: shared context for the Part B files (research.js, part2-6). Loads the research
// JSONs and the built model, and computes the valuation inputs once: forward P/B history (all dates and with the
// FY25/FY26 trough windows left out), forward P/E on reported EPS and on EPS before one-offs, lender peers' P/B and
// P/E against their five-year medians (Poonawalla excluded), the multiple derivation, the street table inputs, the
// effect of the assumed FY28E equity raise, and the rating. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian, forwardMedianPb } = require('./valuation-blend');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { lenderHistory, baseOf, projectLender } = require('../../src/forecast-lender');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'POONAWALLA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'POONAWALLA.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios, fin = M.fin;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const SRC = 'Poonawalla Fincorp presentations and calls (Q4FY24-Q1FY27), Annual Reports FY25-FY26, Screener.in (consolidated), GAM Research';
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const fi = l => fin.labels.indexOf(l);
const b = A.labels.length - 1; // FY26 in actuals
const Q1 = C.q1fy27, G = C.guidance, QK = C.quarterlyKpis, AK = Object.fromEntries(C.annualKpis.map(k => [k.fy, k]));

// Price and model outputs
const price = M.price.last, shares = F.shares, sharesNow = shares + AS.newShares[0], mcap = price * sharesNow;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const pbMult = mv('pb').mult, bvSep28 = mv('pb').metric, peMult = mv('pe').mult, epsSep28 = mv('pe').metric;
const bvps26 = A.netWorth[b] / shares, eps26 = A.eps[b];
const roe24ex = C.annualKpis.find(k => k.fy === 'FY24') && 1045 / ((A.netWorth[b - 3] + A.netWorth[b - 2]) / 2) * 100; // FY24 ROE before exceptional items (Screener 'profit excl exceptional' ₹1,045 cr)

// Forward P/B and P/E history (price ÷ next full-year book / EPS), house window from Apr-2021
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const fwdPb = forwardSeries('POONAWALLA', M, 'bvps').filter(x => x[0] >= '2016-04-01');
const fwdPe = forwardSeries('POONAWALLA', M, 'eps').filter(x => x[0] >= '2016-04-01');
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const fmPb = forwardMedianPb('POONAWALLA', M), fmPe = forwardMedian('POONAWALLA', M);
const TROUGH_FY = fmPe.troughYears.map(t => 2000 + +t.slice(2)).concat([2025]); // FY25 (loss: no P/E points at all) and the house trough years
const PB21 = stat(fwdPb, '2021-04-01'), PBX = stat(fwdPb.filter(x => !TROUGH_FY.includes(fyOf(x[0]))), '2021-04-01');
const PB25 = stat(fwdPb, '2025-04-01'), PB2123 = stat(fwdPb, '2021-04-01', '2023-03-31'), PBT = stat(fwdPb.filter(x => TROUGH_FY.includes(fyOf(x[0]))), '2021-04-01');
const fwdPbNow = price / F.bvps[1], fwdPeNow = price / F.eps[1];
// forwardSeries keeps every 5th weekly point, so the 30-Sep close drops out of the series: add it for charts
const fwdPbChart = fwdPb.at(-1)[0] < ASOF ? [...fwdPb, [ASOF, Math.round(fwdPbNow * 10) / 10]] : fwdPb;
if (fmPb.median !== PB21.med) console.warn('POONAWALLA: house forward P/B median differs from the window stat');

// Forward P/E on EPS before one-offs (FY22-FY24 exceptional items: Magma HDI stake, housing-sale gain net of legacy
// provisions), same dates and prices; trough rule re-applied on the adjusted EPS (§4 one-offs rule).
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'POONAWALLA', 'screener.json'), 'utf8'));
const pl = S.tables['profit-loss'], exc = S.schedules['profit-loss']['Net Profit']['Profit excl Excep'];
const byR = {}, byA = {};
pl.periods.forEach((p, i) => { if (!/Mar/.test(p)) return; const y = +p.slice(-4), e = pl.rows['EPS in Rs'][i], np = pl.rows['Net Profit'][i], sh = np / e; byR[y] = e; byA[y] = exc[p] != null && sh > 0 ? exc[p] / sh : e; });
F.years.forEach((y, i) => { byR[2000 + +y.slice(2, 4)] = F.eps[i]; byA[2000 + +y.slice(2, 4)] = F.eps[i]; });
const trough = (by, fy) => { const pv = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null), pk = pv.length ? Math.max(...pv) : null; return !(by[fy] > 0) || (pk > 0 && by[fy] < 0.5 * pk); };
const pxW = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0);
const peSer = by => pxW.map(([d, p]) => [d, by[fyOf(d)] > 0 ? Math.round(p / by[fyOf(d)] * 10) / 10 : null, fyOf(d)]).filter(x => x[1] != null && x[0] >= '2021-04-01');
const medArr = a => { const s = a.map(x => x[1]).sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const peA = peSer(byA), PEADJ = medArr(peA.filter(x => !trough(byA, x[2]))), PEADJ_ALL = medArr(peA);
const PE21 = { med: fmPe.median, all: fmPe.medianAll, troughs: fmPe.troughYears };
const PE25 = stat(fwdPe, '2025-04-01');
const epsAdj = y => byA[y];

// Peers at the 30-Sep-2026 close: trailing P/B and P/E vs their own five-year medians, FY26 ROE / ROA.
// asof-peers.js has no P/B or ROA, so they are computed here from each peer's Screener file.
const closes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', `${ASOF}.json`), 'utf8')).closes;
const at = (s, d) => { const f = (s || []).filter(([x, v]) => x <= d && v != null); return f.length ? f[f.length - 1][1] : null; };
const numOf = s => Number(String(s).replace(/[^0-9.]/g, ''));
function peer(sym) {
  const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
  const wk = at(P.charts.price.Price, ASOF), c = closes[sym] ?? wk, k = c / wk;
  const series = (ch, nm) => (P.charts[ch]?.[nm] || []);
  const med = s => { const v = s.filter(([d, x]) => d >= '2021-09-30' && d <= ASOF && x > 0).map(x => x[1]).sort((a, z) => a - z); return v.length > 50 ? v[Math.floor(v.length / 2)] : null; };
  const pb = at(series('pb', 'Price to book value'), ASOF), pe = at(series('pe', 'Price to Earning'), ASOF);
  const T = P.tables['profit-loss'], bs = P.tables['balance-sheet'], i = T.periods.indexOf('Mar 2026'), j = bs.periods.indexOf('Mar 2026'), j0 = bs.periods.indexOf('Mar 2025');
  const nw = jj => (bs.rows['Equity Capital']?.[jj] || 0) + (bs.rows['Reserves']?.[jj] || 0), ta = jj => bs.rows['Total Assets']?.[jj];
  const pat = T.rows['Net Profit']?.[i], rev = T.rows['Revenue']?.[i], rev0 = T.rows['Revenue']?.[i - 1];
  const ok = j >= 0 && j0 >= 0 && nw(j) > 0 && nw(j0) > 0;
  return { symbol: sym, basis: P.basis, price: c, mcapCr: Math.round(numOf(P.topRatios['Market Cap']) / numOf(P.topRatios['Current Price']) * c),
    pb: pb > 0 ? pb * k : null, pbMed: med(series('pb', 'Price to book value')), pe: pe > 0 ? pe * k : null, peMed: med(series('pe', 'Price to Earning')),
    roe: ok ? pat / ((nw(j) + nw(j0)) / 2) * 100 : null, roa: ok ? pat / ((ta(j) + ta(j0)) / 2) * 100 : null, revG: rev && rev0 ? (rev / rev0 - 1) * 100 : null, pat };
}
const PEER_SYMS = ['POONAWALLA', 'BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'MUTHOOTFIN', 'SBICARD', 'MANAPPURAM', 'LTF', 'M&MFIN', 'ABCAPITAL', 'BAJAJHFL', 'HDBFS'];
const PEERS = PEER_SYMS.map(peer), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
PEERS.forEach(p => { p.pbVs = p.pb && p.pbMed ? (p.pb / p.pbMed - 1) * 100 : null; p.peVs = p.pe && p.peMed ? (p.pe / p.peMed - 1) * 100 : null; });
// De-rating set: lenders with five years of history, excluding Poonawalla itself. Left out: Bajaj Housing Finance
// (listed Sep-2024) and HDB Financial (listed Jul-2025), which have no five-year median.
const DR_SYMS = ['BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'MUTHOOTFIN', 'SBICARD', 'MANAPPURAM', 'LTF', 'M&MFIN', 'ABCAPITAL'];
const medOf = a => { const s = a.filter(x => x != null).sort((x, y) => x - y), m = s.length / 2; return s.length % 2 ? s[Math.floor(m)] : (s[m - 1] + s[m]) / 2; };
const sectorPbDr = medOf(DR_SYMS.map(s => P[s].pbVs)), sectorPeDr = medOf(DR_SYMS.map(s => P[s].peVs));
const shortName = s => ({ POONAWALLA: 'Poonawalla Fincorp', BAJFINANCE: 'Bajaj Finance', CHOLAFIN: 'Cholamandalam', SHRIRAMFIN: 'Shriram Finance', MUTHOOTFIN: 'Muthoot Finance', SBICARD: 'SBI Cards', MANAPPURAM: 'Manappuram Finance', LTF: 'L&T Finance', 'M&MFIN': 'M&M Financial', ABCAPITAL: 'Aditya Birla Capital', BAJAJHFL: 'Bajaj Housing Finance', HDBFS: 'HDB Financial' }[s] || s);

// Multiple derivation (P/B primary, P/E cross-check): own ex-trough median × sector move × regime (1.00, see valuation)
const REGIME = 1.0;
const pbDerived = Math.round(PBX.med * (1 + sectorPbDr / 100) * REGIME * 10) / 10;
const peDerived = Math.round(PEADJ * (1 + sectorPeDr / 100) * REGIME);
if (Math.abs(pbDerived - pbMult) > 0.05) console.warn(`POONAWALLA: derived P/B ${pbDerived}x differs from assumptions ${pbMult}x`);
if (Math.abs(peDerived - peMult) > 0.5) console.warn(`POONAWALLA: derived P/E ${peDerived}x differs from assumptions ${peMult}x`);
const pbM = AS.valuation.blend.methods[0].multiple;
if (pbM.bull !== PB21.med || pbM.bear !== PB25.min) console.warn(`POONAWALLA: bull/bear P/B should be ${PB21.med}x / ${PB25.min}x`);

// The assumed FY28E equity raise (₹3,000 cr at the 30-Sep close): base case vs a no-raise run of the same engine
const asNo = JSON.parse(JSON.stringify(AS)); asNo.capitalRaise = [AS.capitalRaise[0], 0, 0]; asNo.newShares = [AS.newShares[0], 0, 0];
const Hh = lenderHistory(M, asNo), Bb = baseOf(M, asNo, Hh), FN = projectLender(M, asNo, Bb);
const bvSep28No = (FN.bvps[1] + FN.bvps[2]) / 2, epsSep28No = (FN.eps[1] + FN.eps[2]) / 2;
const NORAISE = { bvSep28: bvSep28No, tp: Math.round(bvSep28No * pbMult / 10) * 10, roe28: FN.roe[1], roe29: FN.roe[2], lev28: FN.leverage[1], lev29: FN.leverage[2], eqAum28: FN.equityToAum[1], eps28: FN.eps[1], eps29: FN.eps[2] };
const RAISE = AS.capitalRaise[1], raisePx = RAISE / AS.newShares[1];

// Sensitivities used in the text
const cc10 = F.avgAum[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100; // 10bp of credit cost, % of FY28E PAT
const rest27 = (F.pat[0] - Q1.pat) / 3; // FY27E PAT still needed per quarter after Q1

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, CONS = D.street.consensus, SE = D.street.estimates;
const tps = ST.map(s => s.tp), tpHi = Math.max(...tps), tpLo = Math.min(...tps), tpMed = medOf(tps);
const onSep28 = x => x * F.bvps[1] / bvSep28; // a multiple of FY28E book restated on Sep-28E book

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, fin, fi, ASOF, ASOF_TXT, n0, n1, n2, pc, pc1, SRC, shortDate, b, Q1, G, QK, AK,
  price, shares, sharesNow, mcap, mv, pbMult, bvSep28, peMult, epsSep28, bvps26, eps26, roe24ex,
  fwdPb, fwdPbChart, fwdPe, PB21, PBX, PB25, PB2123, PBT, PE21, PE25, PEADJ, PEADJ_ALL, epsAdj, fmPb, fmPe, fwdPbNow, fwdPeNow,
  PEERS, P, DR_SYMS, sectorPbDr, sectorPeDr, shortName, REGIME, pbDerived, peDerived, NORAISE, RAISE, raisePx, FN,
  cc10, rest27, rating, buyBelow, sellAbove, ST, CONS, SE, tpHi, tpLo, tpMed, onSep28 };
