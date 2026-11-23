// Eicher Motors initiation: shared context for the Part B files. Loads the research JSONs and the built model,
// checks the Royal Enfield revenue build, the VECV profit build, the treasury and tax workarounds, and derives
// the SOTP multiples (house rule, PLAYBOOK §4 and §7c) once. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'EICHERMOT', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'EICHERMOT.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const yr = fy => SA.find(a => a.fy === fy);
const A26 = yr('FY26'), A25 = yr('FY25'), Q1 = C.q1fy27;
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, mcap = price * F.shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E

// 1) Royal Enfield revenue build (volume × realisation + allied) vs model revenue
const BL = AS.build, bld = [];
{ let dom = BL.base.domestic, intl = BL.base.international, real = BL.base.motoRevenue * 1e7 / (dom + intl), al = BL.base.allied;
  F.years.forEach((y, i) => { dom *= 1 + BL.domesticGrowth[i] / 100; intl *= 1 + BL.internationalGrowth[i] / 100; real *= 1 + BL.motoRealisationGrowth[i] / 100; al *= 1 + BL.alliedGrowth[i] / 100;
    const moto = (dom + intl) * real / 1e7, rev = moto + al; bld.push({ y, dom, intl, units: dom + intl, real, moto, allied: al, rev, model: F.sales[i], modelUnits: F.volume[i], gapPct: (F.sales[i] / rev - 1) * 100 }); }); }
bld.forEach(r => { if (Math.abs(r.gapPct) > 0.5 || Math.abs(r.modelUnits / r.units - 1) > 0.005) throw new Error(`EICHERMOT build check failed ${r.y}: model ${n0(r.model)} vs build ${n0(r.rev)} (${r.gapPct.toFixed(2)}%)`); });
const real26 = BL.base.motoRevenue * 1e7 / (BL.base.domestic + BL.base.international);

// 2) VECV profit build -> Eicher's 54.4% share (enters otherIncome with recurring items)
const VB = AS.vecv, vb = [];
{ let vol = VB.base.volume, rpu = VB.base.revenue * 1e7 / VB.base.volume;
  F.years.forEach((y, i) => { vol *= 1 + VB.volumeGrowth[i] / 100; rpu *= 1 + VB.realisationGrowth[i] / 100;
    const rev = vol * rpu / 1e7, ebitda = rev * VB.ebitdaMargin[i] / 100, pbt = ebitda - VB.dep[i] - VB.finance[i] + VB.otherIncome[i], pat = pbt * (1 - VB.taxRate[i] / 100);
    vb.push({ y, vol, rpu, rev, ebitda, margin: VB.ebitdaMargin[i], pbt, pat, share: pat * VB.share / 100, misc: AS.otherIncome[i] - pat * VB.share / 100 }); }); }
vb.forEach(r => { if (r.misc < 80 || r.misc > 140) throw new Error(`EICHERMOT VECV check ${r.y}: otherIncome less VECV share = ${n0(r.misc)} (expected ~100-120)`); });
const vecvShareEps = vb.map(r => r.share / F.shares), vecvSep28 = sep(vecvShareEps);

// 3) Treasury and tax workarounds: true treasury = engine net cash − VECV carrying value − strategic equity
const VECV_BOOK26 = 3723.49, EQUITY_STAKES = 181.11, VECV_PAYOUT = 0.27; // AR FY26 notes 8 and 9; FY26 dividend Rs217.6 cr / share Rs797.8 cr
const tr = []; { let book = VECV_BOOK26, open = (A.cash[b] || 0) + A.investments[b] + AS.otherTreasury.base - A.borrowings[b] - VECV_BOOK26 - EQUITY_STAKES;
  F.years.forEach((y, i) => { book += vb[i].share * (1 - VECV_PAYOUT); const close = F.treasury[i] - book - EQUITY_STAKES, inc = F.otherIncome[i] - AS.otherIncome[i];
    tr.push({ y, open, close, book, income: inc, yieldOnTrue: inc / ((open + close) / 2) * 100, exJvTax: F.tax[i] / (F.pbt[i] - vb[i].share) * 100 }); open = close; }); }
tr.forEach(r => { if (r.yieldOnTrue < 6.0 || r.yieldOnTrue > 7.0 || Math.abs(r.exJvTax - 25.5) > 0.6) throw new Error(`EICHERMOT treasury/tax check ${r.y}: yield ${r.yieldOnTrue.toFixed(2)}%, ex-JV tax ${r.exJvTax.toFixed(2)}%`); });
const trueTreasury26 = tr[0].open;
const treasIncome26 = 473.86 + 745.55; // AR FY26 note 29: interest on deposits, bonds and bills + fund gains

// 4) Forward P/E history: consolidated (house forwardMedian) and Royal Enfield ex-VECV
const FM = forwardMedian('EICHERMOT', M);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsBy = {}, jvBy = {};
SA.forEach(a => { const i = A.labels.indexOf(a.fy); if (i >= 0) { epsBy[2000 + +a.fy.slice(2)] = A.eps[i]; jvBy[2000 + +a.fy.slice(2)] = a.jvShare / A.shares[i]; } });
F.years.forEach((y, i) => { epsBy[2000 + +y.slice(2, 4)] = F.eps[i]; jvBy[2000 + +y.slice(2, 4)] = vecvShareEps[i]; });
const ASHM = { meta: { asOf: ASOF }, forecast: { F: { years: [], eps: [] } } }; // actual EPS only: no forecasts for Ashok Leyland
const ASH = forwardMedian('ASHOKLEY', ASHM);
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const ashP25 = pct(ASH.series.map(x => x[1]), 0.25);
const reSeries = FM.series.map(([d, pe]) => { const f = fyOf(d), P = pe * epsBy[f]; return [d, Math.round((P - ASH.median * jvBy[f]) / (epsBy[f] - jvBy[f]) * 10) / 10]; });
const reMed = pct(reSeries.map(x => x[1]), 0.5), reP25 = pct(reSeries.map(x => x[1]), 0.25), reP75 = pct(reSeries.map(x => x[1]), 0.75);
const fwdPe = forwardSeries('EICHERMOT', M, 'eps').filter(x => x[0] >= '2016-04-01');
const fwdNow = price / F.eps[1];

// 5) Sector de-rating: auto-OEM peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c)
const PEER_SYMS = ['MARUTI', 'M&M', 'BAJAJ-AUTO', 'EICHERMOT', 'HEROMOTOCO', 'TVSMOTOR', 'ASHOKLEY', 'ESCORTS'];
const PEERS = peersAsOf(PEER_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => s !== 'EICHERMOT' && !EXCL.includes(s));
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.filter(s => s !== 'EICHERMOT').map(s => derate[s]));
const k = 1 + sectorDr / 100;
const shortName = s => ({ MARUTI: 'Maruti Suzuki', 'M&M': 'Mahindra & Mahindra', 'BAJAJ-AUTO': 'Bajaj Auto', EICHERMOT: 'Eicher Motors', HEROMOTOCO: 'Hero MotoCorp', TVSMOTOR: 'TVS Motor', ASHOKLEY: 'Ashok Leyland', ESCORTS: 'Escorts Kubota' }[s] || s);

// 6) SOTP multiples (derived, nearest half-turn) and values per case
const MULT = { re: { base: half(reMed * k), bull: half(reMed), bear: half(reP25 * k) }, vecv: { base: half(ASH.median * k), bull: half(ASH.median), bear: half(ashP25 * k) } };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const SOTP = Object.fromEntries(['base', 'bull', 'bear'].map(c => { const reEps = epsSep[c] - vecvSep28, re = reEps * MULT.re[c], ve = vecvSep28 * MULT.vecv[c];
  return [c, { reEps, re, ve, perShare: re + ve, implied: (re + ve) / epsSep[c], reMult: MULT.re[c], vecvMult: MULT.vecv[c] }]; }));
const consMultAlt = half(FM.median * k); // sensitivity: consolidated median applied to RE
// EV/EBITDA cross-check: own trailing median since Apr-2021 × de-rating, restated from trailing to Sep-28E EBITDA
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'EICHERMOT', 'screener.json'), 'utf8'));
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda);
const evDerived = half(evMed * k * ttmEbitda / ebitdaSep28), evMULT = { base: evDerived, bull: half(evMed * ttmEbitda / ebitdaSep28), bear: half(evP25 * k * ttmEbitda / ebitdaSep28) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrHist = (Math.pow(A.eps[b] / A.eps[b - 5], 1 / 5) - 1) * 100, epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-07-29' && s.tp);
const medTp = medOf(postQ1.map(s => s.tp)), withEps = ST.filter(s => s.eps);
const avgEps = y => withEps.reduce((s, x) => s + x.eps[y], 0) / withEps.length;

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, shortDate, SA, SQ, QL, yr, A26, A25, Q1, b, price, mcap, sep,
  bld, real26, vb, vecvShareEps, vecvSep28, tr, trueTreasury26, treasIncome26, VECV_BOOK26, EQUITY_STAKES, VECV_PAYOUT,
  FM, ASH, ashP25, reSeries, reMed, reP25, reP75, fwdPe, fwdNow, fyOf, epsBy, jvBy, PEER_SYMS, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, k, shortName,
  MULT, epsSep, SOTP, consMultAlt, evMed, evP25, evMULT, ttmEbitda, ebitdaSep28, evDerived, BM, mv, rating, buyBelow, sellAbove, epsCagrHist, epsCagrFwd, ST, postQ1, medTp, withEps, avgEps, medOf };
