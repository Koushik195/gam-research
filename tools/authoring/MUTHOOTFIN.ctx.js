// Muthoot Finance initiation: shared context for the Part B files (research.js, part2-6). Loads the research
// JSONs and the built model, and computes the valuation inputs once: forward P/B and P/E history, lender
// peers' P/B / P/E against their five-year medians (excluding Muthoot itself), the multiple derivation, the
// gold price / tonnage / LTV decomposition of AUM growth, and the street table. As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian, forwardMedianPb } = require('./valuation-blend');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'MUTHOOTFIN', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'MUTHOOTFIN.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios, fin = M.fin;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const SRC = 'Muthoot Finance presentations and calls (Q4FY20-Q1FY27), Annual Report FY2025-26, Screener.in (consolidated), GAM Research';
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const fi = l => fin.labels.indexOf(l);
const b = A.labels.length - 1; // FY26 in actuals
const Q1 = C.q1fy27, F26 = C.fy26, G = C.guidance;

// Price and model outputs
const price = M.price.last, shares = F.shares, mcap = price * shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const pbMult = mv('pb').mult, bvSep28 = mv('pb').metric, peMult = mv('pe').mult, epsSep28 = mv('pe').metric;
const bvps26 = A.bvps[b], eps26 = A.eps[b];
const trailPb = price / bvps26, fwdPbNow = price / F.bvps[1], fwdPeNow = price / F.eps[1];

// Forward P/B and P/E history (price ÷ next full-year book / EPS)
const fwdPb = forwardSeries('MUTHOOTFIN', M, 'bvps').filter(x => x[0] >= '2016-04-01');
const fwdPe = forwardSeries('MUTHOOTFIN', M, 'eps').filter(x => x[0] >= '2016-04-01');
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const PB21 = stat(fwdPb, '2021-04-01'), PB23 = stat(fwdPb, '2023-04-01'), PB2y = stat(fwdPb, '2024-10-01'), PB16 = stat(fwdPb, '2016-04-01');
const PE21 = stat(fwdPe, '2021-04-01'), PE23 = stat(fwdPe, '2023-04-01');
const fmPb = forwardMedianPb('MUTHOOTFIN', M), fmPe = forwardMedian('MUTHOOTFIN', M);
const minDate = (s, from, v) => (s.find(x => x[0] >= from && x[1] === v) || [''])[0];

// Lender peers at the 30-Sep-2026 close: trailing P/B and P/E vs their own five-year medians, FY26 ROE / ROA.
// asof-peers.js has no P/B or ROA, so they are computed here from each peer's screener.json (charts.pb).
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
  return { symbol: sym, name: S.name, price: c, mcapCr: Math.round(numOf(S.topRatios['Market Cap']) / numOf(S.topRatios['Current Price']) * c),
    pb: pb ? pb * k : null, pbMed: med(series('pb', 'Price to book value')), pe: pe ? pe * k : null, peMed: med(series('pe', 'Price to Earning')),
    roe: j0 >= 0 ? pat / ((nw(j) + nw(j0)) / 2) * 100 : null, roa: j0 >= 0 ? pat / ((ta(j) + ta(j0)) / 2) * 100 : null, revG: rev && rev0 ? (rev / rev0 - 1) * 100 : null, pat };
}
const PEER_SYMS = ['MUTHOOTFIN', 'MANAPPURAM', 'BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'SBICARD', 'LTF', 'M&MFIN', 'POONAWALLA', 'ABCAPITAL', 'HDBFS', 'BAJAJHFL'];
const PEERS = PEER_SYMS.map(peer), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
PEERS.forEach(p => { p.pbVs = p.pb && p.pbMed ? (p.pb / p.pbMed - 1) * 100 : null; p.peVs = p.pe && p.peMed ? (p.pe / p.peMed - 1) * 100 : null; });
// De-rating set: lender peers with five years of history, excluding Muthoot itself. HDBFS (listed Jul-2025) and
// BAJAJHFL (listed Sep-2024) have no five-year median. For P/E we also leave out Manappuram, whose FY26 EPS fell
// ~60% from its FY24 level (microfinance losses), so its P/E is a trough multiple, not a valuation signal.
const DR_SYMS = ['MANAPPURAM', 'BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'SBICARD', 'LTF', 'M&MFIN', 'POONAWALLA', 'ABCAPITAL'];
const DR_PE_SYMS = DR_SYMS.filter(s => s !== 'MANAPPURAM');
const medOf = a => { const s = a.filter(x => x != null).sort((x, y) => x - y), m = s.length / 2; return s.length % 2 ? s[Math.floor(m)] : (s[m - 1] + s[m]) / 2; };
const sectorPbDr = medOf(DR_SYMS.map(s => P[s].pbVs)), sectorPeDr = medOf(DR_PE_SYMS.map(s => P[s].peVs));
const shortName = s => ({ MUTHOOTFIN: 'Muthoot Finance', MANAPPURAM: 'Manappuram Finance', BAJFINANCE: 'Bajaj Finance', CHOLAFIN: 'Cholamandalam Inv.', SHRIRAMFIN: 'Shriram Finance', SBICARD: 'SBI Cards', LTF: 'L&T Finance', 'M&MFIN': 'M&M Financial', POONAWALLA: 'Poonawalla Fincorp', ABCAPITAL: 'Aditya Birla Capital', HDBFS: 'HDB Financial', BAJAJHFL: 'Bajaj Housing Finance' }[s] || s);

// Multiple derivation (P/B primary, P/E cross-check): own median × sector move × growth regime
const regimePb = PB23.med / PB21.med, regimePe = PE23.med / PE21.med;
const pbRaw = PB21.med * (1 + sectorPbDr / 100) * regimePb, peRaw = PE21.med * (1 + sectorPeDr / 100) * regimePe;
const pbDerived = Math.round(pbRaw * 20) / 20, peDerived = Math.round(peRaw * 2) / 2; // nearest 0.05x / 0.5x
if (Math.abs(pbDerived - pbMult) > 0.01) console.warn(`MUTHOOTFIN: derived P/B ${pbDerived}x (raw ${pbRaw.toFixed(3)}) differs from assumptions ${pbMult}x`);
if (Math.abs(peDerived - peMult) > 0.01) console.warn(`MUTHOOTFIN: derived P/E ${peDerived}x (raw ${peRaw.toFixed(3)}) differs from assumptions ${peMult}x`);

// Gold: growth of the standalone gold book split into gold price, tonnage and loan-to-value (AUM ÷ gold value)
const kp = fy => C.annualKpis.find(k => k.fy === fy);
const ltvOf = (aumCr, t, px) => aumCr * 1e7 / (t * 1e6 * px) * 100; // % of the market value of the gold pledged
const decomp = (a, z) => { const g = z.goldAum / a.goldAum, pr = z.px / a.px, tn = z.t / a.t, lv = (ltvOf(z.goldAum, z.t, z.px) / ltvOf(a.goldAum, a.t, a.px)); return { g: (g - 1) * 100, pr: (pr - 1) * 100, tn: (tn - 1) * 100, lv: (lv - 1) * 100, sharePrice: Math.log(pr) / Math.log(g) * 100 }; };
const gk = fy => ({ goldAum: kp(fy).goldAumSa, t: kp(fy).tonnes, px: kp(fy).goldPricePerGram });
const gq = q => { const r = SG.goldQuarterly.find(x => x.q === q); return { goldAum: r.goldAum, t: r.tonnes, px: r.pricePerGram }; };
const DEC = { fy20_26: decomp(gk('FY20'), gk('FY26')), fy25: decomp(gk('FY24'), gk('FY25')), fy26: decomp(gk('FY25'), gk('FY26')), q1: decomp(gq('Q4FY26'), gq('Q1FY27')), yoyQ1: decomp(gq('Q1FY26'), gq('Q1FY27')) };
const LTV = Object.fromEntries(C.annualKpis.map(k => [k.fy, ltvOf(k.goldAumSa, k.tonnes, k.goldPricePerGram)]));
LTV.Q1FY27 = ltvOf(Q1.goldAumSa, Q1.tonnesSa, 12942);
const gold30 = (C.gold30Sep.kerala22kPer10g + C.gold30Sep.chennai22kPer10g) / 20; // ₹/g, 22-carat, press
const goldMoveSinceJun = (gold30 / 12942 - 1) * 100, goldMoveSinceMar = (gold30 / 13441 - 1) * 100;
const ltvInt = 66.7; // management: LTV incl. accrued interest ~66-67% (Jun-26)
const fallTo75 = (1 - ltvInt / 75) * 100, fallTo100 = (1 - ltvInt / 100) * 100;

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, tps = ST.map(s => s.tp).filter(x => x), tpHi = Math.max(...tps), tpLo = Math.min(...tps), tpMed = medOf(tps);
const mosl = ST.find(s => s.broker === 'Motilal Oswal'), jef = ST.find(s => s.broker === 'Jefferies');
const streetEps = { moslFY27: 10580 / shares, moslFY28: 12690 / shares, moslBvFY28: 2850 / 2 };

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, fin, fi, ASOF, ASOF_TXT, n0, n1, n2, pc, pc1, SRC, shortDate, b, Q1, F26, G, kp,
  price, shares, mcap, mv, pbMult, bvSep28, peMult, epsSep28, bvps26, eps26, trailPb, fwdPbNow, fwdPeNow,
  fwdPb, fwdPe, PB21, PB23, PB2y, PB16, PE21, PE23, fmPb, fmPe, minDate, PEERS, P, DR_SYMS, DR_PE_SYMS, sectorPbDr, sectorPeDr, shortName, regimePb, regimePe, pbRaw, peRaw, pbDerived, peDerived,
  DEC, LTV, gold30, goldMoveSinceJun, goldMoveSinceMar, ltvInt, fallTo75, fallTo100, rating, buyBelow, sellAbove, ST, tpHi, tpLo, tpMed, mosl, jef, streetEps };
