// Shriram Finance initiation: shared context for the Part B files (research.js, part2-6). Loads the research
// JSONs and the built model, and computes the valuation inputs once: forward P/B and P/E history (adjusted for
// the MUFG issue and the FY25 Shriram Housing Finance gain), peer P/B / P/E against their five-year medians
// (Shriram excluded), the multiple derivation, the MUFG arithmetic, time-weighted FY27E ROE and the street
// table. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian, forwardMedianPb } = require('./valuation-blend');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'SHRIRAMFIN', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'SHRIRAMFIN.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'SHRIRAMFIN', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios, fin = M.fin;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const SRC = 'Shriram Finance results, investor updates and calls (Q4FY26-Q1FY27), annual reports, Screener.in (consolidated), GAM Research';
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const fi = l => fin.labels.indexOf(l);
const b = A.labels.length - 1; // FY26 in actuals
const Q1 = C.q1fy27, G27 = C.fy27Guidance, LT = C.longTermGuidance, MU = C.mufg;

// Price, share counts and model outputs
const price = M.price.last, shares26 = F.shares, sharesNow = Q1.sharesMn / 10, mcap = price * sharesNow; // 235.29 cr shares at Jun-26
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const pbMult = mv('pb').mult, bvSep28 = mv('pb').metric, peMult = mv('pe').mult, epsSep28 = mv('pe').metric;
const bvps26 = A.bvps[b], eps26 = A.eps[b], bvpsJun26 = Q1.bvps;
const nw26 = A.netWorth[b], raise = AS.capitalRaise[0];
const bvProForma = (nw26 + raise) / sharesNow; // Mar-26 book plus the MUFG money on the enlarged share count
const carry = raise * 0.0885 * (1 - AS.taxRate[0] / 100); // post-tax interest saved on ₹39,619 cr at ~8.85% (our basis)
const patEx27 = F.patAttrib[0] - carry, epsEx27 = patEx27 / shares26;
const nwEx27 = nw26 + patEx27 * (1 - AS.payout[0] / 100), bvEx27 = nwEx27 / shares26, roeEx27 = patEx27 / ((nw26 + nwEx27) / 2) * 100;
// FY27E ROE on time-weighted equity (the money came on 8-Apr-2026; the engine averages opening and closing equity)
const avgNwTw27 = (8 / 365) * nw26 + (357 / 365) * ((nw26 + raise) + F.netWorth[0]) / 2, roeTw27 = F.patAttrib[0] / avgNwTw27 * 100;
const epsGrowth3y = (Math.pow(F.eps[2] / eps26, 1 / 3) - 1) * 100;

// Forward P/B and P/E history (price ÷ next full-year book / EPS). Adjustments in our files:
//  - P/B: for dates before the MUFG announcement (19-Dec-2025) whose forward year is FY27, book = FY27E WITHOUT the issue.
//  - P/E: for dates whose forward year is FY25, EPS before the ₹1,489 cr SHFL gain (Screener 'profit excl. exceptional' ₹8,268 cr).
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const px = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0), pxAt = d => (px.find(x => x[0] === d) || [])[1];
const eps25ex = 8268 / A.shares[fi('FY25')];
const fwdPbRaw = forwardSeries('SHRIRAMFIN', M, 'bvps').filter(x => x[0] >= '2016-04-01');
const fwdPeRaw = forwardSeries('SHRIRAMFIN', M, 'eps').filter(x => x[0] >= '2016-04-01');
const fwdPb = fwdPbRaw.map(([d, v]) => (fyOf(d) === 2027 && d < MU.announced ? [d, Math.round(pxAt(d) / bvEx27 * 10) / 10] : [d, v]));
const fwdPe = fwdPeRaw.map(([d, v]) => (fyOf(d) === 2025 ? [d, Math.round(pxAt(d) / eps25ex * 10) / 10] : [d, v]));
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p10: v[Math.floor(v.length * 0.1)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const PB21 = stat(fwdPb, '2021-04-01'), PB23 = stat(fwdPb, '2023-04-01'), PB2y = stat(fwdPb, '2024-10-01'), PB16 = stat(fwdPb, '2016-04-01');
const PB21raw = stat(fwdPbRaw, '2021-04-01'), PE21raw = stat(fwdPeRaw, '2021-04-01');
const PE21 = stat(fwdPe, '2021-04-01'), PE23 = stat(fwdPe, '2023-04-01');
const fmPb = forwardMedianPb('SHRIRAMFIN', M), fmPe = forwardMedian('SHRIRAMFIN', M);
const fwdPbNow = price / F.bvps[1], fwdPeNow = price / F.eps[1], trailPbNow = price / bvpsJun26;
const pbPeakFeb26 = Math.max(...fwdPb.filter(x => x[0] >= '2026-01-01').map(x => x[1]));

// Peers at the 30-Sep-2026 close: trailing P/B and P/E vs their own five-year medians, FY26 ROE / ROA
const closes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', `${ASOF}.json`), 'utf8')).closes;
const at = (s, d) => { const f = (s || []).filter(([x, v]) => x <= d && v != null); return f.length ? f[f.length - 1][1] : null; };
const numOf = s => Number(String(s).replace(/[^0-9.]/g, ''));
function peer(sym) {
  const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
  const wk = at(P.charts.price.Price, ASOF), c = closes[sym] ?? wk, k = c / wk;
  const series = (ch, nm) => (P.charts[ch]?.[nm] || []);
  const med = s => { const v = s.filter(([d, x]) => d >= '2021-09-30' && d <= ASOF && x > 0).map(x => x[1]).sort((a, z) => a - z); return v.length > 150 ? v[Math.floor(v.length / 2)] : null; };
  const pb = at(series('pb', 'Price to book value'), ASOF), pe = at(series('pe', 'Price to Earning'), ASOF);
  const pl = P.tables['profit-loss'], bs = P.tables['balance-sheet'], i = pl.periods.indexOf('Mar 2026'), j = bs.periods.indexOf('Mar 2026'), j0 = bs.periods.indexOf('Mar 2025');
  const nw = jj => (bs.rows['Equity Capital']?.[jj] || 0) + (bs.rows['Reserves']?.[jj] || 0), ta = jj => bs.rows['Total Assets']?.[jj];
  const pat = pl.rows['Net Profit']?.[i], rev = pl.rows['Revenue']?.[i], rev0 = pl.rows['Revenue']?.[i - 1];
  return { symbol: sym, name: P.name, price: c, mcapCr: Math.round(numOf(P.topRatios['Market Cap']) / numOf(P.topRatios['Current Price']) * c),
    pb: pb ? pb * k : null, pbMed: med(series('pb', 'Price to book value')), pe: pe ? pe * k : null, peMed: med(series('pe', 'Price to Earning')),
    roe: j0 >= 0 && j >= 0 ? pat / ((nw(j) + nw(j0)) / 2) * 100 : null, roa: j0 >= 0 && j >= 0 ? pat / ((ta(j) + ta(j0)) / 2) * 100 : null, revG: rev && rev0 ? (rev / rev0 - 1) * 100 : null, pat };
}
const PEER_SYMS = ['SHRIRAMFIN', 'BAJFINANCE', 'CHOLAFIN', 'MUTHOOTFIN', 'SBICARD', 'LTF', 'M&MFIN', 'POONAWALLA', 'ABCAPITAL', 'HDBFS', 'BAJAJHFL'];
const PEERS = PEER_SYMS.map(peer), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
// Screener's SHRIRAMFIN P/B ignores the April MUFG issue (book per share not updated): use price ÷ Jun-26 book; market value on 235.3 cr shares
// and its trailing P/E divides old profits by the new share count: use price ÷ the last four quarterly EPS (Q2FY26-Q1FY27)
const qe = S.tables.quarters, eps4 = ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026'].reduce((a, p) => a + qe.rows['EPS in Rs'][qe.periods.indexOf(p)], 0);
Object.assign(P.SHRIRAMFIN, { pbScreener: P.SHRIRAMFIN.pb, peScreener: P.SHRIRAMFIN.pe, pb: trailPbNow, pe: price / eps4, mcapCr: Math.round(mcap) });
P.HDBFS.pb = null; // listed Jul-2025; no balance-sheet history on file
PEERS.forEach(p => { p.pbVs = p.pb && p.pbMed ? (p.pb / p.pbMed - 1) * 100 : null; p.peVs = p.pe && p.peMed ? (p.pe / p.peMed - 1) * 100 : null; });
const DR_SYMS = ['BAJFINANCE', 'CHOLAFIN', 'MUTHOOTFIN', 'SBICARD', 'LTF', 'M&MFIN', 'POONAWALLA', 'ABCAPITAL']; // five-year history; Shriram itself, HDBFS (listed 2025) and BAJAJHFL (2024) left out
const medOf = a => { const s = a.filter(x => x != null).sort((x, y) => x - y), m = s.length / 2; return s.length % 2 ? s[Math.floor(m)] : (s[m - 1] + s[m]) / 2; };
const sectorPbDr = medOf(DR_SYMS.map(s => P[s].pbVs)), sectorPeDr = medOf(DR_SYMS.map(s => P[s].peVs));
const VEH = ['CHOLAFIN', 'M&MFIN', 'LTF'], vehPbDr = medOf(VEH.map(s => P[s].pbVs));
const shortName = s => ({ BAJFINANCE: 'Bajaj Finance', CHOLAFIN: 'Cholamandalam Inv.', SHRIRAMFIN: 'Shriram Finance', MUTHOOTFIN: 'Muthoot Finance', SBICARD: 'SBI Cards', LTF: 'L&T Finance', 'M&MFIN': 'M&M Financial', POONAWALLA: 'Poonawalla Fincorp', ABCAPITAL: 'Aditya Birla Capital', HDBFS: 'HDB Financial', BAJAJHFL: 'Bajaj Housing Finance' }[s] || s);

// Multiple derivation (P/B primary, P/E cross-check): own median × sector move × post-merger regime
const regimePb = PB23.med / PB21.med, regimePe = PE23.med / PE21.med;
const pbDerived = Math.round(PB21.med * (1 + sectorPbDr / 100) * regimePb * 10) / 10;
const peDerived = Math.round(PE21.med * (1 + sectorPeDr / 100) * regimePe);
if (Math.abs(pbDerived - pbMult) > 0.05) console.warn(`SHRIRAMFIN: derived P/B ${pbDerived}x differs from assumptions ${pbMult}x`);
if (Math.abs(peDerived - peMult) > 0.5) console.warn(`SHRIRAMFIN: derived P/E ${peDerived}x differs from assumptions ${peMult}x`);

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const tpAt = x => Math.round(x * bvSep28 / 10) * 10;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, CONS = D.street.consensus, IB = D.street.impliedBook;
const tps = ST.map(s => s.tp), tpHi = Math.max(...tps), tpLo = Math.min(...tps), tpAvg = tps.reduce((a, c) => a + c, 0) / tps.length;
const streetEps = { plFY27: 58.2, plFY28: 62.3, emkayFY27: 61.9, emkayFY28: 78.7, emkayFY29: 93.5, idirectFY27: 14071 / sharesNow, idirectFY28: 16223 / sharesNow, moslFY28: 9998 * 1.29 * 1.29 / sharesNow };

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, fin, fi, ASOF, ASOF_TXT, n0, n1, n2, pc, pc1, SRC, shortDate, b, Q1, G27, LT, MU,
  price, shares26, sharesNow, mcap, mv, pbMult, bvSep28, peMult, epsSep28, bvps26, eps26, bvpsJun26, nw26, raise, bvProForma, carry, patEx27, epsEx27, bvEx27, roeEx27, avgNwTw27, roeTw27, epsGrowth3y,
  fwdPb, fwdPe, fwdPbRaw, PB21, PB23, PB2y, PB16, PB21raw, PE21raw, PE21, PE23, fmPb, fmPe, fwdPbNow, fwdPeNow, trailPbNow, pbPeakFeb26, eps25ex,
  PEERS, P, DR_SYMS, sectorPbDr, sectorPeDr, vehPbDr, shortName, regimePb, regimePe, pbDerived, peDerived, rating, buyBelow, sellAbove, tpAt, ST, CONS, IB, tpHi, tpLo, tpAvg, streetEps };
