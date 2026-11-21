// L&T Finance initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and
// the built model, and computes the valuation inputs once: forward P/B and P/E history (whole window and the
// retail era), lender peers' P/B / P/E against their five-year medians (excluding LTF), the multiple derivation,
// the AUM build check, the IRDAI sensitivity and the street table inputs. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian, forwardMedianPb } = require('./valuation-blend');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'LTF', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'LTF.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'LTF', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios, fin = M.fin;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', RETAIL_FROM = '2024-04-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : m ? `${mon}-${y.slice(2)}` : y; };
const fi = l => fin.labels.indexOf(l);
const b = A.labels.length - 1; // FY26 in actuals
const Q1 = C.q1fy27, G27 = C.fy27Guidance, G26 = C.fy26Guidance, L31 = C.lakshya2031, L26 = C.lakshya2026;

// Price and model outputs
const price = M.price.last, shares = F.shares, mcap = price * shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const pbMult = mv('pb').mult, bvSep28 = mv('pb').metric, peMult = mv('pe').mult, epsSep28 = mv('pe').metric;
const bvps26 = A.bvps[b], eps26 = A.eps[b];
const epsCagrFwd = (Math.pow(F.eps[2] / eps26, 1 / 3) - 1) * 100;
const aumCagr2226 = (Math.pow(fin.aum[fi('FY26')] / fin.aum[fi('FY22')], 1 / 4) - 1) * 100;
const retailCagr2226 = (Math.pow(C.annualKpis.find(k => k.fy === 'FY26').retailBook / C.annualKpis.find(k => k.fy === 'FY22').retailBook, 1 / 4) - 1) * 100;

// Forward P/B and P/E history (price ÷ next full-year book / EPS)
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const fwdPb = forwardSeries('LTF', M, 'bvps').filter(x => x[0] >= '2016-04-01');
const fwdPeRaw = forwardSeries('LTF', M, 'eps').filter(x => x[0] >= '2016-04-01');
// One-off: FY23 EPS (₹6.55) includes the ₹2,575 cr mutual-fund sale gain; before one-offs FY23 was a loss (Screener
// 'Profit excl Excep' −₹157 cr), so dates whose forward year is FY23 are a trough and drop out of the adjusted P/E series.
const fwdPe = fwdPeRaw.filter(([d]) => fyOf(d) !== 2023);
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const PB21 = stat(fwdPb, '2021-04-01'), PBR = stat(fwdPb, RETAIL_FROM), PB25 = stat(fwdPb, '2025-04-01'), PB2123 = stat(fwdPb, '2021-04-01', '2024-03-31');
const PE21raw = stat(fwdPeRaw, '2021-04-01'), PE21 = stat(fwdPe, '2021-04-01'), PER = stat(fwdPe, RETAIL_FROM);
const fmPb21 = forwardMedianPb('LTF', M), fmPbR = forwardMedianPb('LTF', M, { from: RETAIL_FROM });
const fmPe21 = forwardMedian('LTF', M), fmPeR = forwardMedian('LTF', M, { from: RETAIL_FROM });
if (fmPbR.median !== PBR.med || fmPeR.median !== PER.med) console.warn('LTF: house forward medians differ from the window stats');
const fwdPbNow = price / F.bvps[1], fwdPeNow = price / F.eps[1], trailPbNow = price / Q1.bvps;
// forwardSeries keeps every 5th weekly point, so the 30-Sep close drops out: add it for charts
const fwdPbChart = fwdPb.at(-1)[0] < ASOF ? [...fwdPb, [ASOF, Math.round(fwdPbNow * 100) / 100]] : fwdPb;
const pxAt = d => { const s = S.charts.price.Price.filter(([x]) => x <= d); return s.length ? s.at(-1)[1] : null; };
const px18Sep = pxAt('2026-09-18');

// Peers at the 30-Sep-2026 close: trailing P/B and P/E vs their own five-year medians; FY26 ROE / ROA from Screener
const closes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', `${ASOF}.json`), 'utf8')).closes;
const at = (s, d) => { const f = (s || []).filter(([x, v]) => x <= d && v != null); return f.length ? f[f.length - 1][1] : null; };
const numOf = s => Number(String(s).replace(/[^0-9.]/g, ''));
function peer(sym) {
  const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
  const wk = at(P.charts.price.Price, ASOF), c = closes[sym] ?? wk, k = c / wk;
  const series = (ch, nm) => (P.charts[ch]?.[nm] || []);
  const med = s => { const v = s.filter(([d, x]) => d >= '2021-09-30' && d <= ASOF && x > 0).map(x => x[1]).sort((a, z) => a - z); return v.length > 50 ? v[Math.floor(v.length / 2)] : null; };
  const pb = at(series('pb', 'Price to book value'), ASOF), pe = at(series('pe', 'Price to Earning'), ASOF);
  const pl = P.tables['profit-loss'], bs = P.tables['balance-sheet'], i = pl.periods.indexOf('Mar 2026'), j = bs.periods.indexOf('Mar 2026'), j0 = bs.periods.indexOf('Mar 2025');
  const nw = jj => (bs.rows['Equity Capital']?.[jj] || 0) + (bs.rows['Reserves']?.[jj] || 0), ta = jj => bs.rows['Total Assets']?.[jj];
  const pat = pl.rows['Net Profit']?.[i];
  const ok = j >= 0 && j0 >= 0 && nw(j) > 0 && nw(j0) > 0;
  return { symbol: sym, price: c, mcapCr: Math.round(numOf(P.topRatios['Market Cap']) / numOf(P.topRatios['Current Price']) * c),
    pb: pb ? pb * k : null, pbMed: med(series('pb', 'Price to book value')), pe: pe ? pe * k : null, peMed: med(series('pe', 'Price to Earning')),
    roe: ok ? pat / ((nw(j) + nw(j0)) / 2) * 100 : null, roa: ok ? pat / ((ta(j) + ta(j0)) / 2) * 100 : null };
}
const PEER_SYMS = ['LTF', 'BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'MUTHOOTFIN', 'SBICARD', 'M&MFIN', 'POONAWALLA', 'ABCAPITAL', 'BAJAJHFL', 'HDBFS'];
const PEERS = PEER_SYMS.map(peer), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
PEERS.forEach(p => { p.pbVs = p.pb && p.pbMed ? (p.pb / p.pbMed - 1) * 100 : null; p.peVs = p.pe && p.peMed ? (p.pe / p.peMed - 1) * 100 : null; });
// De-rating set: eight lenders with five years of history, excluding LTF itself. Left out: Bajaj Housing Finance (listed
// Sep-2024) and HDB Financial (Jul-2025), which have no five-year median; Manappuram is kept out so the set matches the
// one used across this batch of lender reports (MP below shows the median with it).
const DR_SYMS = ['BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'MUTHOOTFIN', 'SBICARD', 'M&MFIN', 'POONAWALLA', 'ABCAPITAL'];
const medOf = a => { const s = a.filter(x => x != null).sort((x, y) => x - y), m = s.length / 2; return s.length % 2 ? s[Math.floor(m)] : (s[m - 1] + s[m]) / 2; };
const sectorPbDr = medOf(DR_SYMS.map(s => P[s].pbVs)), sectorPeDr = medOf(DR_SYMS.map(s => P[s].peVs));
const MP = peer('MANAPPURAM'); MP.pbVs = (MP.pb / MP.pbMed - 1) * 100;
const sectorPbDrWithMp = medOf([...DR_SYMS.map(s => P[s].pbVs), MP.pbVs]);
const shortName = s => ({ LTF: 'L&T Finance', BAJFINANCE: 'Bajaj Finance', CHOLAFIN: 'Cholamandalam', SHRIRAMFIN: 'Shriram Finance', MUTHOOTFIN: 'Muthoot Finance', SBICARD: 'SBI Cards', 'M&MFIN': 'M&M Financial', POONAWALLA: 'Poonawalla Fincorp', ABCAPITAL: 'Aditya Birla Capital', BAJAJHFL: 'Bajaj Housing Finance', HDBFS: 'HDB Financial', MANAPPURAM: 'Manappuram' }[s] || s);

// Multiple derivation (P/B primary, P/E cross-check): retail-era median × sector move × growth regime (1.00, see valuation)
const REGIME = 1.0;
const pbDerived = Math.round(fmPbR.median * (1 + sectorPbDr / 100) * REGIME * 10) / 10;
const peDerived = Math.round(fmPeR.median * (1 + sectorPeDr / 100) * REGIME);
if (Math.abs(pbDerived - pbMult) > 0.05) console.warn(`LTF: derived P/B ${pbDerived}x differs from assumptions ${pbMult}x`);
if (Math.abs(peDerived - peMult) > 0.5) console.warn(`LTF: derived P/E ${peDerived}x differs from assumptions ${peMult}x`);

// Business AUM build (assumptions.aumBuild) must sum to the model's one AUM line within 1%
const SA26 = SG.annual.find(a => a.fy === 'FY26'), AB = AS.aumBuild, GK = Object.keys(AB.growth);
const BUILD = [0, 1, 2].map(i => ({ year: F.years[i] }));
for (const k of GK) { let v = SA26[k]; [0, 1, 2].forEach(i => { v *= 1 + AB.growth[k][i] / 100; BUILD[i][k] = v; }); }
BUILD.forEach((r, i) => { r.gold = AB.goldCr[i]; r.whl = AB.wholesaleCr[i]; r.total = GK.reduce((s, k) => s + r[k], 0) + r.gold + r.whl; r.model = F.aum[i]; r.gap = (r.total / r.model - 1) * 100;
  if (Math.abs(r.gap) > 1) console.warn(`LTF: AUM build ${r.year} ${r.total.toFixed(0)} vs model AUM ${r.model} (${r.gap.toFixed(1)}%)`); });
const unsec = r => (r.rgl + r.pl + r.sme) / r.total * 100;
const QN = SG.quarterly.find(q => q.q === 'Q1FY27'), QO = SG.quarterly.find(q => q.q === 'Q1FY26');

// IRDAI sensitivity: distribution (insurance) income FY26 and the base-case haircut from FY28E
const distInc = C.fy26.distributionIncome, distPctPbt = distInc / A.pbt[b] * 100, distPctAum = distInc / fin.avgAum[fi('FY26')] * 100;
const IRDAI_CUT = Math.round((AS.feeIncomePct[0] - AS.feeIncomePct[1]) * 100) / 100; // pp of book removed from FY28E
const feeCut28 = IRDAI_CUT / 100 * F.avgAum[1], feeCutEps28 = feeCut28 * (1 - AS.taxRate[1] / 100) / F.sharesOut[1];
const cc10 = F.avgAum[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100; // 10bp of credit cost, % of FY28E PAT
const brandFeePct = C.fy26.brandFeeToLT / A.pbt[b] * 100;

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, CONS = D.street.consensus, SE = D.street.estimates;
const tps = ST.map(s => s.tp), tpHi = Math.max(...tps), tpLo = Math.min(...tps);
const onSep28 = x => x * F.bvps[1] / bvSep28; // a multiple of Mar-28E book restated on Sep-28E book

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, fin, fi, ASOF, ASOF_TXT, RETAIL_FROM, n0, n1, n2, pc, pc1, shortDate, b, Q1, G27, G26, L31, L26,
  price, shares, mcap, mv, pbMult, bvSep28, peMult, epsSep28, bvps26, eps26, epsCagrFwd, aumCagr2226, retailCagr2226,
  fwdPb, fwdPbChart, fwdPe, fwdPeRaw, PB21, PBR, PB25, PB2123, PE21raw, PE21, PER, fmPb21, fmPbR, fmPe21, fmPeR, fwdPbNow, fwdPeNow, trailPbNow, px18Sep,
  PEERS, P, DR_SYMS, sectorPbDr, sectorPeDr, sectorPbDrWithMp, MP, shortName, REGIME, pbDerived, peDerived,
  BUILD, SA26, GK, unsec, QN, QO, distInc, distPctPbt, distPctAum, IRDAI_CUT, feeCut28, feeCutEps28, cc10, brandFeePct,
  rating, buyBelow, sellAbove, ST, CONS, SE, tpHi, tpLo, onSep28 };
