// SBI Cards initiation: shared context for the Part B files (research.js, part2-6). Loads the research
// JSONs and the built model and computes, once: the fee build check (spends × take rate), company-basis
// ratios, forward P/E history on reported and on credit-cycle-normalised EPS, forward P/B history,
// lender peers' P/B and P/E against their own five-year medians (SBI Card excluded), the multiple
// derivation, the street table and the rating. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian, forwardMedianPb } = require('./valuation-blend');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'SBICARD', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'SBICARD.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios, fin = M.fin;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const SRC = 'SBI Card presentations and calls (Q4FY25-Q1FY27), annual reports FY20-FY26, Screener.in (standalone), GAM Research';
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const fi = l => fin.labels.indexOf(l);
const b = A.labels.length - 1; // FY26 in actuals
const Q1 = C.q1fy27, G27 = C.fy27Guidance, K26 = C.fy26;
const AK = Object.fromEntries(C.annualKpis.map(k => [k.fy, k]));

// Price and model outputs
const price = M.price.last, shares = F.shares, mcap = price * shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const peMult = mv('pe').mult, epsSep28 = mv('pe').metric, pbMult = mv('pb').mult, bvSep28 = mv('pb').metric;
const bvps26 = A.bvps[b], eps26 = A.eps[b];
const epsCagr = (Math.pow(F.eps[2] / eps26, 1 / 3) - 1) * 100;

// Fee build (assumptions.feeBuild): spends × take rate + fee-based + membership + incentives + other
const FB = AS.feeBuild, fee = [];
{ let retail = FB.base.retail, fb = FB.base.feeBased, mem = FB.base.membership, bd = FB.base.bd;
  for (let i = 0; i < 3; i++) {
    retail *= 1 + FB.retailGrowth[i] / 100; const spends = retail / (1 - FB.corporateShare[i] / 100), corporate = spends - retail;
    const ic = spends * FB.takeRate[i] / 100; fb *= 1 + FB.feeBasedGrowth[i] / 100; mem *= 1 + FB.membershipGrowth[i] / 100; bd *= 1 + FB.bdGrowth[i] / 100;
    fee.push({ spends, retail, corporate, interchange: ic, feeBased: fb, membership: mem, bd, other: FB.other[i], total: ic + fb + mem + bd + FB.other[i] });
  } }
fee.forEach((f, i) => { if (Math.abs(f.total / F.feeIncome[i] - 1) > 0.005) console.warn(`SBICARD: fee build ${Math.round(f.total)} vs model fees ${F.feeIncome[i]} (${F.years[i]})`); });
const spends26 = SG.annual.at(-1).spends;
const oiBuild = F.avgAum.map(a => AS.otherBuild.recoveryPct / 100 * a + AS.otherBuild.sundry);
oiBuild.forEach((v, i) => { if (Math.abs(v - F.otherIncome[i]) > 3) console.warn(`SBICARD: other-income build ${Math.round(v)} vs model ${F.otherIncome[i]}`); });
// Company-basis cost-to-income (other income in the denominator), history and forecast
const ctiCo = i => fin.opex[i] / (fin.sales[i] + fin.otherIncome[i] - fin.interest[i]) * 100;

// Forward P/E history: (a) reported EPS (house forwardMedian), (b) EPS normalised to a through-cycle
// gross credit cost (median of the non-COVID years FY19, FY23-FY26), same dates and prices.
const ccYears = ['FY19', 'FY23', 'FY24', 'FY25', 'FY26'], ccv = ccYears.map(l => fin.creditCost[fi(l)]).sort((x, y) => x - y);
const CCN = Math.round(ccv[2] * 10) / 10;
const normEps = {};
fin.labels.forEach((l, i) => { if (fin.creditCost[i] == null || fin.avgAum[i] == null || fin.eps[i] == null) return; const t = (fin.taxRate[i] ?? 25.5) / 100, sh = fin.sharesOut[i] || shares; normEps[l] = fin.eps[i] + (fin.creditCost[i] - CCN) / 100 * fin.avgAum[i] * (1 - t) / sh; });
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'SBICARD', 'screener.json'), 'utf8'));
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pxW = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0);
const fwdPeN = pxW.map(([d, p]) => { const e = normEps[`FY${String(fyOf(d)).slice(2)}${fyOf(d) >= 2027 ? 'E' : ''}`]; return [d, e > 0 ? Math.round(p / e * 10) / 10 : null]; }).filter(x => x[1] != null);
const fwdPe = forwardSeries('SBICARD', M, 'eps'), fwdPb = forwardSeries('SBICARD', M, 'bvps');
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const PE21 = stat(fwdPe, '2021-04-01'), PE24 = stat(fwdPe, '2024-04-01'), PEN21 = stat(fwdPeN, '2021-04-01'), PEN24 = stat(fwdPeN, '2024-04-01');
const PB21 = stat(fwdPb, '2021-04-01'), PB24 = stat(fwdPb, '2024-04-01');
const fmPe = forwardMedian('SBICARD', M), fmPb = forwardMedianPb('SBICARD', M);
const fwdPeNow = price / F.eps[1], fwdPbNow = price / F.bvps[1], fwdPeNNow = price / normEps.FY28E, pe27 = price / F.eps[0];
const sep28n = (normEps.FY28E + normEps.FY29E) / 2;

// Peers at the 30-Sep-2026 close: trailing P/B and P/E vs their own five-year medians, FY26 ROE / ROA
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
  const pat = pl.rows['Net Profit']?.[i], rev = pl.rows['Revenue']?.[i], rev0 = pl.rows['Revenue']?.[i - 1];
  return { symbol: sym, name: P.name, price: c, mcapCr: Math.round(numOf(P.topRatios['Market Cap']) / numOf(P.topRatios['Current Price']) * c),
    pb: pb > 0 ? pb * k : null, pbMed: med(series('pb', 'Price to book value')), pe: pe > 0 ? pe * k : null, peMed: med(series('pe', 'Price to Earning')),
    roe: j0 >= 0 ? pat / ((nw(j) + nw(j0)) / 2) * 100 : null, roa: j0 >= 0 ? pat / ((ta(j) + ta(j0)) / 2) * 100 : null, revG: rev && rev0 ? (rev / rev0 - 1) * 100 : null, pat };
}
const PEER_SYMS = ['SBICARD', 'BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'MUTHOOTFIN', 'LTF', 'M&MFIN', 'POONAWALLA', 'ABCAPITAL', 'HDBFS', 'BAJAJHFL'];
const PEERS = PEER_SYMS.map(peer), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
PEERS.forEach(p => { p.pbVs = p.pb && p.pbMed ? (p.pb / p.pbMed - 1) * 100 : null; p.peVs = p.pe && p.peMed ? (p.pe / p.peMed - 1) * 100 : null; });
const DR_SYMS = ['BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'MUTHOOTFIN', 'LTF', 'M&MFIN', 'POONAWALLA', 'ABCAPITAL']; // five-year history, SBI Card itself excluded; HDBFS (2025) and BAJAJHFL (2024) listed too recently
const medOf = a => { const s = a.filter(x => x != null).sort((x, y) => x - y), m = s.length / 2; return s.length % 2 ? s[Math.floor(m)] : (s[m - 1] + s[m]) / 2; };
const sectorPbDr = medOf(DR_SYMS.map(s => P[s].pbVs)), sectorPeDr = medOf(DR_SYMS.map(s => P[s].peVs));
const shortName = s => ({ SBICARD: 'SBI Cards', BAJFINANCE: 'Bajaj Finance', CHOLAFIN: 'Cholamandalam Inv.', SHRIRAMFIN: 'Shriram Finance', MUTHOOTFIN: 'Muthoot Finance', LTF: 'L&T Finance', 'M&MFIN': 'M&M Financial', POONAWALLA: 'Poonawalla Fincorp', ABCAPITAL: 'Aditya Birla Capital', HDBFS: 'HDB Financial', BAJAJHFL: 'Bajaj Housing Finance' }[s] || s);

// Multiple derivation (P/E primary): normalised-EPS regime median × sector move, converted to our EPS
const peNorm = PEN24.med * (1 + sectorPeDr / 100);
const convK = sep28n / epsSep28;
const peDerivedRaw = peNorm * convK, peDerived = Math.round(peDerivedRaw);
const peReportedPath = PE21.med * (1 + sectorPeDr / 100) * (PE24.med / PE21.med);
const peBull = Math.round(PEN24.med * convK), peBear = Math.round(fwdPeNow);
const pbDerived = Math.round(PB21.med * (1 + sectorPbDr / 100) * (PB24.med / PB21.med) * 10) / 10;
if (Math.abs(peDerived - peMult) > 0.01) console.warn(`SBICARD: derived P/E ${peDerived}x differs from assumptions ${peMult}x`);
if (Math.abs(pbDerived - pbMult) > 0.05) console.warn(`SBICARD: derived P/B ${pbDerived}x differs from assumptions ${pbMult}x`);
if (AS.valuation.blend.methods[0].multiple.bull !== peBull || AS.valuation.blend.methods[0].multiple.bear !== peBear) console.warn(`SBICARD: bull/bear P/E should be ${peBull}x / ${peBear}x`);

// Sensitivities used in the text
const cc10 = F.avgAum[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100; // 10bp credit cost as % of FY28E PAT
const take10 = fee[1].spends * 0.0001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100; // 1bp interchange take rate as % of FY28E PAT

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, SE = D.street.streetEstimates;
const tps = ST.filter(s => s.tp).map(s => s.tp), tpHi = Math.max(...tps), tpLo = Math.min(...tps);
const postQ1 = ST.filter(s => s.date >= '2026-07-24' && s.tp), tpPostMed = medOf(postQ1.map(s => s.tp));
const streetEps = { mosl27: SE.moslPat.FY27E / shares, mosl28: SE.moslPat.FY28E / shares, emkay27: SE.emkayEps.FY27E, emkay28: SE.emkayEps.FY28E, emkay29: SE.emkayEps.FY29E };

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, fin, fi, ASOF, ASOF_TXT, n0, n1, n2, pc, pc1, SRC, shortDate, b, Q1, G27, K26, AK,
  price, shares, mcap, mv, peMult, epsSep28, pbMult, bvSep28, bvps26, eps26, epsCagr, fee, spends26, oiBuild, ctiCo,
  CCN, normEps, fwdPe, fwdPeN, fwdPb, PE21, PE24, PEN21, PEN24, PB21, PB24, fmPe, fmPb, fwdPeNow, fwdPbNow, fwdPeNNow, pe27, sep28n,
  PEERS, P, DR_SYMS, sectorPbDr, sectorPeDr, shortName, peNorm, convK, peDerived, peDerivedRaw, peReportedPath, peBull, peBear, pbDerived,
  cc10, take10, rating, buyBelow, sellAbove, ST, SE, tpHi, tpLo, postQ1, tpPostMed, streetEps };
