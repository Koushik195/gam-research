// Bajaj Housing Finance initiation: shared context for the Part B files (research.js, part2-6). Loads the
// research JSONs and the built model and computes the valuation inputs once: forward P/B and P/E history
// (since listing and over the last 12 months), housing-finance and lender peers' P/B and P/E against their
// own medians (five-year, since BHFL listed, last 12 months), the multiple derivation, the street table and
// the stake-sale overhang. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedianPb } = require('./valuation-blend');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'BAJAJHFL', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'BAJAJHFL.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios, fin = M.fin;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2024-09-16', R12 = '2025-10-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const SRC = 'Bajaj Housing Finance presentations, calls and annual reports (FY25-Q1FY27), Screener.in (standalone), GAM Research';
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const fi = l => fin.labels.indexOf(l);
const b = A.labels.length - 1; // FY26 in actuals
const Q1 = C.q1fy27, G27 = C.fy27Guidance, G26 = C.fy26Guidance, MPS = C.mps;

// Price and model outputs
const price = M.price.last, shares = F.shares, mcap = price * shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const pbMult = mv('pb').mult, bvSep28 = mv('pb').metric, peMult = mv('pe').mult, epsSep28 = mv('pe').metric;
const bvps26 = A.netWorth[b] / shares, eps26 = A.eps[b];
const bvJun26 = Q1.netWorth / shares;

// Forward P/B and P/E history (price ÷ next full-year book / EPS), from listing
const fwdPb = forwardSeries('BAJAJHFL', M, 'bvps').filter(x => x[0] >= LISTED);
const fwdPe = forwardSeries('BAJAJHFL', M, 'eps').filter(x => x[0] >= LISTED);
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const PBL = stat(fwdPb, LISTED), PB12 = stat(fwdPb, R12), PBD = stat(fwdPb, '2025-12-02');
const PEL = stat(fwdPe, LISTED), PE12 = stat(fwdPe, R12);
const fmPbL = forwardMedianPb('BAJAJHFL', M, { from: LISTED }), fmPb12 = forwardMedianPb('BAJAJHFL', M, { from: R12 });
if (fmPbL.median !== PBL.med || fmPb12.median !== PB12.med) console.warn('BAJAJHFL: forwardMedianPb differs from local stat');
const fwdPbNow = price / F.bvps[1], fwdPeNow = price / F.eps[1], trailPb = price / bvps26, trailPbJun = price / bvJun26;

// Peers at the 30-Sep-2026 close: trailing P/B and P/E vs their own medians (five-year, since BHFL listed, last 12 months)
const closes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', `${ASOF}.json`), 'utf8')).closes;
const at = (s, d) => { const f = (s || []).filter(([x, v]) => x <= d && v != null); return f.length ? f[f.length - 1][1] : null; };
const numOf = s => Number(String(s).replace(/[^0-9.]/g, ''));
function peer(sym) {
  const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
  const wk = at(S.charts.price.Price, ASOF), c = closes[sym] ?? wk, k = c / wk;
  const series = (ch, nm) => (S.charts[ch]?.[nm] || []);
  const med = (s, from, minN) => { const v = s.filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]).sort((a, z) => a - z); return v.length >= minN ? v[Math.floor(v.length / 2)] : null; };
  const pbS = series('pb', 'Price to book value'), peS = series('pe', 'Price to Earning');
  const pb = at(pbS, ASOF), pe = at(peS, ASOF);
  const pl = S.tables['profit-loss'], bs = S.tables['balance-sheet'], i = pl.periods.indexOf('Mar 2026'), j = bs.periods.indexOf('Mar 2026'), j0 = bs.periods.indexOf('Mar 2025');
  const nw = jj => (bs.rows['Equity Capital']?.[jj] || 0) + (bs.rows.Reserves?.[jj] || 0), ta = jj => bs.rows['Total Assets']?.[jj];
  const pat = pl.rows['Net Profit']?.[i], rev = pl.rows.Revenue?.[i], rev0 = pl.rows.Revenue?.[i - 1];
  const o = { symbol: sym, name: S.name, basis: S.basis, price: c, mcapCr: Math.round(numOf(S.topRatios['Market Cap']) / numOf(S.topRatios['Current Price']) * c), assetsCr: ta(j),
    pb: pb ? pb * k : null, pbMed5: med(pbS, '2021-09-30', 200), pbMedL: med(pbS, '2024-09-20', 80), pbMed12: med(pbS, R12, 40),
    pe: pe ? pe * k : null, peMed5: med(peS, '2021-09-30', 200), peMedL: med(peS, '2024-09-20', 80), peMed12: med(peS, R12, 40),
    roe: j0 >= 0 && i >= 0 ? pat / ((nw(j) + nw(j0)) / 2) * 100 : null, roa: j0 >= 0 && i >= 0 ? pat / ((ta(j) + ta(j0)) / 2) * 100 : null, revG: rev && rev0 ? (rev / rev0 - 1) * 100 : null, pat };
  const vs = (x, m) => (x && m ? (x / m - 1) * 100 : null);
  Object.assign(o, { pbVs5: vs(o.pb, o.pbMed5), pbVsL: vs(o.pb, o.pbMedL), pbVs12: vs(o.pb, o.pbMed12), peVs5: vs(o.pe, o.peMed5), peVs12: vs(o.pe, o.peMed12) });
  return o;
}
const HFC_SYMS = ['LICHSGFIN', 'PNBHOUSING', 'CANFINHOME', 'AAVAS', 'APTUS', 'HOMEFIRST', 'AADHARHFC'];
const LEND_SYMS = ['BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'MUTHOOTFIN', 'SBICARD', 'LTF', 'M&MFIN', 'POONAWALLA', 'ABCAPITAL', 'HDBFS'];
const PEERS = [...HFC_SYMS, ...LEND_SYMS, 'BAJAJHFL'].map(peer), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const medOf = a => { const s = a.filter(x => x != null).sort((x, y) => x - y), m = s.length / 2; return s.length ? (s.length % 2 ? s[Math.floor(m)] : (s[m - 1] + s[m]) / 2) : null; };
const HFC5 = HFC_SYMS.filter(s => P[s].pbMed5 != null); // five-year history (Aadhar listed May-2024)
const LEND5 = LEND_SYMS.filter(s => P[s].pbMed5 != null); // HDBFS listed Jul-2025, no P/B history on Screener
const hfcPb12 = medOf(HFC_SYMS.map(s => P[s].pbVs12)), hfcPe12 = medOf(HFC_SYMS.map(s => P[s].peVs12));
const hfcPbL = medOf(HFC_SYMS.map(s => P[s].pbVsL)), hfcPb5 = medOf(HFC5.map(s => P[s].pbVs5)), hfcPe5 = medOf(HFC5.map(s => P[s].peVs5));
const lendPb5 = medOf(LEND5.map(s => P[s].pbVs5)), lendPb12 = medOf(LEND_SYMS.map(s => P[s].pbVs12)), allPb5 = medOf([...HFC5, ...LEND5].map(s => P[s].pbVs5));
const shortName = s => ({ BAJFINANCE: 'Bajaj Finance', CHOLAFIN: 'Cholamandalam Inv.', SHRIRAMFIN: 'Shriram Finance', MUTHOOTFIN: 'Muthoot Finance', SBICARD: 'SBI Cards', LTF: 'L&T Finance', 'M&MFIN': 'M&M Financial', POONAWALLA: 'Poonawalla Fincorp', ABCAPITAL: 'Aditya Birla Capital', HDBFS: 'HDB Financial', BAJAJHFL: 'Bajaj Housing Finance', LICHSGFIN: 'LIC Housing Finance', PNBHOUSING: 'PNB Housing Finance', CANFINHOME: 'Can Fin Homes', AAVAS: 'Aavas Financiers', APTUS: 'Aptus Value Housing', HOMEFIRST: 'Home First Finance', AADHARHFC: 'Aadhar Housing Finance' }[s] || s);

// Multiple derivation (P/B primary, P/E cross-check): own forward multiple over the last 12 months × the
// housing-finance sector's move against its own last-12-month medians (same window, so nothing is counted twice)
const pbDerived = Math.round(PB12.med * (1 + hfcPb12 / 100) * 10) / 10;
const peDerived = Math.round(PE12.med * (1 + hfcPe12 / 100) * 2) / 2;
if (Math.abs(pbDerived - pbMult) > 0.001) console.warn(`BAJAJHFL: derived P/B ${pbDerived}x differs from assumptions ${pbMult}x`);
if (Math.abs(peDerived - peMult) > 0.001) console.warn(`BAJAJHFL: derived P/E ${peDerived}x differs from assumptions ${peMult}x`);
// Alternatives shown for transparency (not used)
const altLiteral = Math.round(PBL.med * (1 + hfcPb5 / 100) * 10) / 10; // since-listing median × HFC move vs five-year medians
const altTriple = Math.round(PBL.med * (1 + hfcPb5 / 100) * (PB12.med / PBL.med) * 10) / 10; // Bajaj Finance template (counts the sector move twice)
const tpAt = x => Math.round(x * bvSep28);

// Stake-sale overhang: Bajaj Finance must go from 86.70% to 75% by 15-Sep-2029
const toSellPct = 86.7 - 75, toSellSh = toSellPct / 100 * shares, toSellCr = toSellSh * price;
const floatNowCr = (100 - 86.7) / 100 * shares * price;
const adtvCr = 46; // Emkay: 3-month ADTV ₹459.5 mn (30-Jul-2026); Motilal 12-month average ₹769 mn
const daysOfVolume = toSellCr / adtvCr;

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp)), sellAbove = Math.round(sellAt(V.tp));

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, CONS = D.street.consensus, SE = D.street.streetEstimates;
const tps = ST.map(s => s.tp), tpHi = Math.max(...tps), tpLo = Math.min(...tps);
const mosl = ST.find(s => s.broker === 'Motilal Oswal'), emkay = ST.find(s => /Emkay/.test(s.broker)), jm = ST.find(s => /JM/.test(s.broker));
const moslSep28 = mosl.tp / SE.mosl.bvps.FY28E; // ₹95 ÷ ₹35 FY28E BVPS
const emkayFY28 = emkay.tp / SE.emkay.bvps.FY28E;

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, fin, fi, ASOF, ASOF_TXT, LISTED, n0, n1, n2, pc, pc1, SRC, shortDate, b, Q1, G27, G26, MPS,
  price, shares, mcap, mv, pbMult, bvSep28, peMult, epsSep28, bvps26, eps26, bvJun26, fwdPb, fwdPe, PBL, PB12, PBD, PEL, PE12, fwdPbNow, fwdPeNow, trailPb, trailPbJun,
  PEERS, P, HFC_SYMS, LEND_SYMS, HFC5, LEND5, hfcPb12, hfcPe12, hfcPbL, hfcPb5, hfcPe5, lendPb5, lendPb12, allPb5, shortName, medOf,
  pbDerived, peDerived, altLiteral, altTriple, tpAt, toSellPct, toSellSh, toSellCr, floatNowCr, adtvCr, daysOfVolume,
  rating, buyBelow, sellAbove, ST, CONS, SE, tpHi, tpLo, mosl, emkay, jm, moslSep28, emkayFY28 };
