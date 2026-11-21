// HDB Financial Services initiation: shared context for the Part B files (research.js, part2-6). Loads the
// research JSONs and the built model and computes the valuation inputs once: forward P/B and P/E history on
// every weekly close since listing (plus the 30-Sep-2026 close), lender peers' P/B and P/E against their own
// medians (five-year, since HDB listed, last 12 months; HDB itself excluded), the multiple derivation, the
// street table and the BPO build check. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardMedianPb, forwardMedian } = require('./valuation-blend');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'HDBFS', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'HDBFS.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios, fin = M.fin;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2025-07-02', R12 = '2025-10-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const SRC = 'HDB Financial Services presentations, calls and annual reports (FY23-Q1FY27), Screener.in (standalone), GAM Research';
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const fi = l => fin.labels.indexOf(l);
const b = A.labels.length - 1; // FY26 in actuals
const Q1 = C.q1fy27, F26 = C.fy26, GD = C.guidance;

// Price and model outputs
const price = M.price.last, shares = F.shares, mcap = price * shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const pbMult = mv('pb').mult, bvSep28 = mv('pb').metric, peMult = mv('pe').mult, epsSep28 = mv('pe').metric;
const bvps26 = A.netWorth[b] / shares, eps26 = A.eps[b], bvJun26 = Q1.bvps;

// Forward P/B and P/E on EVERY weekly close since listing (the house forwardSeries keeps every 5th point,
// i.e. 13 points for HDB's 14 months), with the 30-Sep-2026 close added. Next full fiscal year's book / EPS.
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'HDBFS', 'screener.json'), 'utf8'));
const byB = {}, byE = {};
A.labels.forEach((l, i) => { byB[2000 + +l.slice(2, 4)] = A.bvps[i]; byE[2000 + +l.slice(2, 4)] = A.eps[i]; });
F.years.forEach((y, i) => { byB[2000 + +y.slice(2, 4)] = F.bvps[i]; byE[2000 + +y.slice(2, 4)] = F.eps[i]; });
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const px = S.charts.price.Price.filter(([d]) => d <= ASOF);
if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const fwdPb = px.map(([d, p]) => [d, Math.round(p / byB[fyOf(d)] * 100) / 100]), fwdPe = px.map(([d, p]) => [d, Math.round(p / byE[fyOf(d)] * 10) / 10]);
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const PBL = stat(fwdPb, LISTED), PB12 = stat(fwdPb, R12), PBQ1 = stat(fwdPb, LISTED, '2025-09-30'), PB6 = stat(fwdPb, '2026-04-01');
const PEL = stat(fwdPe, LISTED), PE12 = stat(fwdPe, R12);
const fmPbL = forwardMedianPb('HDBFS', M, { from: LISTED }), fmPb12 = forwardMedianPb('HDBFS', M, { from: R12 }), fmPeL = forwardMedian('HDBFS', M, { from: LISTED });
const fwdPbNow = price / F.bvps[1], fwdPeNow = price / F.eps[1], trailPb = price / bvps26, trailPbJun = price / bvJun26;

// Peers at the 30-Sep-2026 close: trailing P/B and P/E vs their own medians. asof-peers.js has no P/B or ROA.
const closes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', `${ASOF}.json`), 'utf8')).closes;
const at = (s, d) => { const f = (s || []).filter(([x, v]) => x <= d && v != null); return f.length ? f[f.length - 1][1] : null; };
const numOf = s => Number(String(s).replace(/[^0-9.]/g, ''));
function peer(sym) {
  const P0 = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
  const wk = at(P0.charts.price.Price, ASOF), c = closes[sym] ?? wk, k = c / wk;
  const series = (ch, nm) => (P0.charts[ch]?.[nm] || []);
  const med = (s, from, minN) => { const v = s.filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]).sort((a, z) => a - z); return v.length >= minN ? v[Math.floor(v.length / 2)] : null; };
  const pbS = series('pb', 'Price to book value'), peS = series('pe', 'Price to Earning');
  const pb = at(pbS, ASOF), pe = at(peS, ASOF);
  const pl = P0.tables['profit-loss'], bs = P0.tables['balance-sheet'], i = pl.periods.indexOf('Mar 2026'), j = bs.periods.indexOf('Mar 2026'), j0 = bs.periods.indexOf('Mar 2025');
  const nw = jj => (bs.rows['Equity Capital']?.[jj] || 0) + (bs.rows.Reserves?.[jj] || 0), ta = jj => bs.rows['Total Assets']?.[jj];
  const pat = pl.rows['Net Profit']?.[i], rev = pl.rows.Revenue?.[i], rev0 = pl.rows.Revenue?.[i - 1];
  const o = { symbol: sym, basis: P0.basis, price: c, mcapCr: Math.round(numOf(P0.topRatios['Market Cap']) / numOf(P0.topRatios['Current Price']) * c), assetsCr: ta(j),
    pb: pb ? pb * k : null, pbMed5: med(pbS, '2021-09-30', 200), pbMedL: med(pbS, LISTED, 40), pbMed12: med(pbS, R12, 40),
    pe: pe ? pe * k : null, peMed5: med(peS, '2021-09-30', 200), peMedL: med(peS, LISTED, 40), peMed12: med(peS, R12, 40),
    roe: j0 >= 0 && i >= 0 ? pat / ((nw(j) + nw(j0)) / 2) * 100 : null, roa: j0 >= 0 && i >= 0 ? pat / ((ta(j) + ta(j0)) / 2) * 100 : null, revG: rev && rev0 ? (rev / rev0 - 1) * 100 : null, pat };
  const vs = (x, m) => (x && m ? (x / m - 1) * 100 : null);
  Object.assign(o, { pbVs5: vs(o.pb, o.pbMed5), pbVsL: vs(o.pb, o.pbMedL), pbVs12: vs(o.pb, o.pbMed12), peVs5: vs(o.pe, o.peMed5), peVsL: vs(o.pe, o.peMedL), peVs12: vs(o.pe, o.peMed12) });
  return o;
}
// De-rating set: ten lenders with five years of history, excluding HDB itself. Bajaj Housing Finance (listed
// Sep-2024, a mortgage lender) is shown but left out of the medians.
const DR_SYMS = ['BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'MUTHOOTFIN', 'SBICARD', 'MANAPPURAM', 'LTF', 'M&MFIN', 'POONAWALLA', 'ABCAPITAL'];
const PEERS = [...DR_SYMS, 'BAJAJHFL', 'HDBFS'].map(peer), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const medOf = a => { const s = a.filter(x => x != null).sort((x, y) => x - y), m = s.length / 2; return s.length ? (s.length % 2 ? s[Math.floor(m)] : (s[m - 1] + s[m]) / 2) : null; };
const sec = k => medOf(DR_SYMS.map(s => P[s][k]));
const secPb5 = sec('pbVs5'), secPbL = sec('pbVsL'), secPb12 = sec('pbVs12'), secPe5 = sec('peVs5'), secPeL = sec('peVsL'), secPe12 = sec('peVs12');
const shortName = s => ({ BAJFINANCE: 'Bajaj Finance', CHOLAFIN: 'Cholamandalam', SHRIRAMFIN: 'Shriram Finance', MUTHOOTFIN: 'Muthoot Finance', SBICARD: 'SBI Cards', MANAPPURAM: 'Manappuram', LTF: 'L&T Finance', 'M&MFIN': 'M&M Financial', POONAWALLA: 'Poonawalla Fincorp', ABCAPITAL: 'Aditya Birla Capital', BAJAJHFL: 'Bajaj Housing Finance', HDBFS: 'HDB Financial' }[s] || s);

// Multiple derivation (P/B primary, P/E cross-check): own forward multiple over the last 12 months × the
// lenders' move against their own 12-month medians (same window, so nothing is counted twice).
const pbDerived = Math.round(PB12.med * (1 + secPb12 / 100) * 10) / 10;
const peDerived = Math.round(PE12.med * (1 + secPe12 / 100) * 2) / 2;
if (Math.abs(pbDerived - pbMult) > 0.001) console.warn(`HDBFS: derived P/B ${pbDerived}x differs from assumptions ${pbMult}x`);
if (Math.abs(peDerived - peMult) > 0.001) console.warn(`HDBFS: derived P/E ${peDerived}x differs from assumptions ${peMult}x`);
const tpAt = x => Math.round(x * bvSep28);
const altListing = Math.round(PBL.med * (1 + secPbL / 100) * 10) / 10; // since-listing median × same-window sector move
const altLiteral = Math.round(PBL.med * (1 + secPb5 / 100) * 10) / 10; // since-listing median × five-year sector move

// BPO build check: feeIncomePct and opexPct must equal lending ratios + BPO rupees on the model's average AUM
const BB = AS.bpoBuild;
F.years.forEach((y, i) => {
  const a = F.avgAum[i], fee = (BB.lendingFeePct[i] / 100 * a + BB.bpoRevenue[i]) / a * 100;
  const opex = (BB.lendingOpexPct[i] / 100 * a + BB.bpoRevenue[i] - BB.bpoMargin[i] - BB.screenerReclass) / a * 100;
  if (Math.abs(fee - AS.feeIncomePct[i]) > 0.002 || Math.abs(opex - AS.opexPct[i]) > 0.002) console.warn(`HDBFS: BPO build ${y} fee ${fee.toFixed(3)} vs ${AS.feeIncomePct[i]}, opex ${opex.toFixed(3)} vs ${AS.opexPct[i]}`);
});
const lendFee = i => BB.lendingFeePct[i] / 100 * F.avgAum[i], lendOpex = i => BB.lendingOpexPct[i] / 100 * F.avgAum[i];

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp)), sellAbove = Math.round(sellAt(V.tp));

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, CONS = D.street.consensus, SE = D.street.streetEstimates;
const tps = ST.map(s => s.tp), tpHi = Math.max(...tps), tpLo = Math.min(...tps);
const mosl = ST.find(s => s.broker === 'Motilal Oswal'), emkay = ST.find(s => s.broker === 'Emkay'), nomura = ST.find(s => s.broker === 'Nomura');
const onSep28 = x => x * F.bvps[1] / bvSep28; // a multiple of Mar-28E book restated on Sep-28E book

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, fin, fi, ASOF, ASOF_TXT, LISTED, n0, n1, n2, pc, pc1, SRC, shortDate, b, Q1, F26, GD,
  price, shares, mcap, mv, pbMult, bvSep28, peMult, epsSep28, bvps26, eps26, bvJun26, fwdPb, fwdPe, PBL, PB12, PBQ1, PB6, PEL, PE12, fmPbL, fmPb12, fmPeL, fwdPbNow, fwdPeNow, trailPb, trailPbJun,
  PEERS, P, DR_SYMS, secPb5, secPbL, secPb12, secPe5, secPeL, secPe12, shortName, medOf, pbDerived, peDerived, tpAt, altListing, altLiteral, BB, lendFee, lendOpex,
  rating, buyBelow, sellAbove, ST, CONS, SE, tpHi, tpLo, mosl, emkay, nomura, onSep28 };
