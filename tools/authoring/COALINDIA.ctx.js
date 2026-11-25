// Coal India initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks the
// channel build (coal sold x realisation) against model revenue and EBITDA, checks the other-income build, and derives
// the EV/EBITDA (primary) and P/E (cross-check) multiples once (PLAYBOOK §4 and §7c). As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'COALINDIA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const rupee = o => (typeof o === 'string' ? o.replace(/Rs ?(?=[0-9~])/g, '₹') : Array.isArray(o) ? o.map(rupee) : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, rupee(v)])) : o);
Object.assign(D, rupee(D)); // display: Rs -> ₹ in deep.json text
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'COALINDIA.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'COALINDIA', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const fyIdx = fy => A.labels.indexOf(fy);

// 1) Channel build vs model revenue and EBITDA
const BL = AS.build, B0 = BL.base, bld = [];
{ let qty = B0.qty;
  const otherPerT0 = (B0.saleOfProducts - (B0.fsa * B0.pFsa + B0.ea * B0.pEa + B0.wash * B0.pWash) / 10) / B0.qty * 10;
  F.years.forEach((y, i) => { qty *= 1 + BL.qtyGrowth[i] / 100;
    const ea = qty * BL.eaSharePct[i] / 100, wash = BL.washMt[i], fsa = qty - ea - wash;
    const fsaRev = fsa * BL.pFsa[i] / 10, eaRev = ea * BL.pEa[i] / 10, washRev = wash * BL.pWash[i] / 10, other = qty * BL.otherChargesPerT[i] / 10, op = BL.services[i] + BL.strippingReversal[i];
    const rev = fsaRev + eaRev + washRev + other + op, ebitda = qty * BL.ebitdaPerT[i] / 10;
    bld.push({ y, qty, fsa, ea, wash, fsaRev, eaRev, washRev, coal: fsaRev + eaRev + washRev, other, op, rev, ebitda, realEx: (fsaRev + eaRev + washRev) * 10 / qty, premium: (BL.pEa[i] / BL.pFsa[i] - 1) * 100,
      model: F.sales[i], modelE: F.ebitda[i], gap: (F.sales[i] / rev - 1) * 100, gapE: (F.ebitda[i] / ebitda - 1) * 100 }); });
  bld.otherPerT0 = otherPerT0; }
bld.forEach(r => { if (Math.abs(r.gap) > 0.3 || Math.abs(r.gapE) > 0.3) throw new Error(`COALINDIA build check failed ${r.y}: revenue ${n0(r.model)} vs ${n0(r.rev)}, EBITDA ${n0(r.modelE)} vs ${n0(r.ebitda)}`); });
const ebitdaPerT26 = A.ebitda[b] / B0.qty * 10, ebitdaPerT26ex = (A.ebitda[b] + C.liabilities.payScaleProvisionQ3FY26) / B0.qty * 10;

// 2) Other income: treasury interest + built non-treasury items; reconcile to FY26 and TTM
const tre0 = (A.cash[b] || 0) + A.investments[b] - A.borrowings[b]; // engine's opening net treasury
const GROSSUP = A.borrowings[b] - C.treasuryMar26.nonCurrentInvestmentsMostlyJVs; // debt less JV equity
const oiRows = []; { let open = tre0; F.years.forEach((y, i) => { const tInt = AS.treasuryYield[i] / 100 * open;
  oiRows.push({ y, open, tInt, nonT: AS.otherIncome[i], total: F.otherIncome[i], yieldGross: (tInt + AS.treasuryYield[i] / 100 * GROSSUP) / (open + GROSSUP) * 100 }); open = F.treasury[i]; }); }
oiRows.forEach(r => { if (Math.abs(r.tInt + r.nonT - r.total) > 2) throw new Error(`COALINDIA other-income check ${r.y}`); });
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);

// 3) Forward EV/EBITDA history (house analogue of forwardMedian): weekly closes since Apr-2021; EV = market value less
//    net treasury (cash + investments − borrowings, Screener basis = the engine's) from the last March balance sheet
//    published by then; forward = the next full fiscal year (as forwardSeries); realised EBITDA (patched), then ours.
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const ebitdaBy = {}, ncBy = {};
A.labels.forEach((l, i) => { const y = 2000 + +l.slice(2, 4); ebitdaBy[y] = A.ebitda[i]; ncBy[y] = (A.cash[i] || 0) + (A.investments[i] || 0) - (A.borrowings[i] || 0); });
F.years.forEach((l, i) => { ebitdaBy[2000 + +l.slice(2, 4)] = F.ebitda[i]; });
const ncAt = d => { const y = +d.slice(0, 4), cut = d.slice(5) >= '05-31' ? y : y - 1; return ncBy[cut]; };
const troughE = f => { const prev = [ebitdaBy[f - 1], ebitdaBy[f - 2], ebitdaBy[f - 3]].filter(v => v != null); const pk = Math.max(...prev); return !(ebitdaBy[f] > 0) || ebitdaBy[f] < 0.5 * pk; };
const pxW = S.charts.price.Price.filter(([d]) => d >= '2021-04-01' && d <= ASOF);
if (pxW[pxW.length - 1][0] < ASOF) pxW.push([ASOF, price]);
const evAll = pxW.map(([d, p]) => [d, Math.round((p * shares - ncAt(d)) / ebitdaBy[fyOf(d)] * 100) / 100]);
const evTroughYears = [...new Set(pxW.filter(([d]) => troughE(fyOf(d))).map(([d]) => `FY${String(fyOf(d)).slice(2)}`))];
const evSeries = evAll.filter(([d]) => !troughE(fyOf(d)));
const evVals = evSeries.map(x => x[1]);
const evMed = medOf(evVals), evP25 = pct(evVals, 0.25), evP75 = pct(evVals, 0.75);
const evMed22 = medOf(evSeries.filter(x => x[0] >= '2022-04-01').map(x => x[1])), evMed24 = medOf(evSeries.filter(x => x[0] >= '2024-04-01').map(x => x[1]));
const evByFy = {}; evSeries.forEach(([d, v]) => (evByFy[fyOf(d)] ||= []).push(v));
const evNow = (mcap - (F.treasury[1] + F.treasury[2]) / 2) / sep(F.ebitda); // at the CMP on Sep-28E EBITDA and net cash
const evNowFy28 = (mcap - tre0) / F.ebitda[1];

// 4) Forward P/E (house function, reported EPS; no trough years expected)
const FM = forwardMedian('COALINDIA', M);
const peVals = FM.series.map(x => x[1]), peP25 = pct(peVals, 0.25), peP75 = pct(peVals, 0.75);

// 5) Sector move: peers' EV/EBITDA and P/E at the 30-Sep close vs their five-year medians (PLAYBOOK §7c), self excluded
const SUB = D.peers.subsets, ALLP = [...new Set([...D.peers.set, ...Object.keys(D.peers.excluded), ...SUB.miners, ...SUB.refinersAdded, SUB.sail])];
const PEERS = peersAsOf(['COALINDIA', ...ALLP], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = (sym, chart, key) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = {}, MV = {};
for (const s of ['COALINDIA', ...ALLP]) { MED5[s] = { pe: med5(s, 'pe', 'Price to Earning'), ev: med5(s, 'evEbitda', 'EV Multiple') };
  MV[s] = { pe: (P[s].pe / MED5[s].pe - 1) * 100, ev: (P[s].evEbitda / MED5[s].ev - 1) * 100 }; }
const USED = D.peers.set, EXCL = Object.keys(D.peers.excluded);
const moveOf = (set, k) => medOf(set.map(s => MV[s][k]));
const evMove = moveOf(USED, 'ev'), peMove = moveOf(USED, 'pe');
const sens = { upstreamEv: moveOf(SUB.upstream, 'ev'), minersEv: moveOf(SUB.miners, 'ev'), minersSailEv: moveOf([...SUB.miners, SUB.sail], 'ev'), refinersEv: moveOf(SUB.refinersAdded, 'ev'), upstreamPe: moveOf(SUB.upstream, 'pe') };
const kEv = 1 + evMove / 100, kPe = 1 + peMove / 100;
const shortName = s => ({ COALINDIA: 'Coal India', ONGC: 'ONGC', OIL: 'Oil India', NMDC: 'NMDC', SAIL: 'SAIL', IOC: 'Indian Oil', BPCL: 'BPCL', HINDPETRO: 'HPCL', MRPL: 'MRPL', CHENNPETRO: 'Chennai Petroleum', GAIL: 'GAIL', PETRONET: 'Petronet LNG' }[s] || s);

// 6) Multiples (derived, nearest half-turn). Base = own median x sector move. Bull/bear = base ± 1 turn: the 75th
//    percentile x move is also 5.0x, but the 25th (2.0x) was set in 2021-23 when the market priced FY23-24's e-auction
//    windfall at ~2x; it is shown as a sensitivity row rather than used as the bear multiple.
const MULT = { base: half(evMed * kEv) }; MULT.bull = MULT.base + 1; MULT.bear = MULT.base - 1;
const peMULT = { base: half(FM.median * kPe) }; peMULT.bull = peMULT.base + 1; peMULT.bear = peMULT.base - 1;
const evP75k = half(evP75 * kEv), evP25k = half(evP25 * kEv), ev22k = half(evMed22 * kEv), ev24k = half(evMed24 * kEv);
const ebitdaSep = { base: sep(F.ebitda) }, ncSep = sep(F.treasury), epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const evAt = x => Math.round((x * sep(F.ebitda) + ncSep) / shares / 10) * 10; // value per share at a given multiple

// Street as it stood on 30-Sep-2026 (post-Q1 notes)
const ST = D.street.brokers, postQ1 = ST.filter(s => !s.stale && s.tp), medTp = medOf(postQ1.map(s => s.tp));

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, half, pct, medOf, b, price, shares, mcap, sep, fyIdx,
  bld, ebitdaPerT26, ebitdaPerT26ex, tre0, GROSSUP, oiRows, ttmOI,
  fyOf, ebitdaBy, ncBy, evAll, evSeries, evTroughYears, evMed, evP25, evP75, evMed22, evMed24, evByFy, evNow, evNowFy28, FM, peP25, peP75,
  PEERS, P, MED5, MV, USED, EXCL, SUB, evMove, peMove, sens, kEv, kPe, shortName,
  MULT, peMULT, evP75k, evP25k, ev22k, ev24k, ebitdaSep, ncSep, epsSep, BM, mv, rating, buyBelow, sellAbove, evAt, ST, postQ1, medTp };

if (require.main === module) {
  console.log('build', bld.map(r => [r.y, n1(r.qty), Math.round(r.rev), Math.round(r.ebitda), r.gap.toFixed(2), r.gapE.toFixed(2), Math.round(r.realEx), n1(r.premium)]), 'otherPerT0', n1(bld.otherPerT0), 'e/t26', n0(ebitdaPerT26), n0(ebitdaPerT26ex));
  console.log('OI', oiRows.map(r => [r.y, Math.round(r.open), Math.round(r.tInt), r.nonT, Math.round(r.total), r.yieldGross.toFixed(2)]), 'ttm', ttmOI, 'gross-up', GROSSUP);
  console.log('EV hist med', evMed, 'p25', evP25, 'p75', evP75, 'since22', evMed22, 'since24', evMed24, 'trough', evTroughYears, 'n', evSeries.length);
  console.log('EV byFy', Object.entries(evByFy).map(([f, v]) => `${f}:${medOf(v).toFixed(2)}(${v.length})`).join(' '), 'now Sep28', evNow.toFixed(2), 'FY28', evNowFy28.toFixed(2));
  console.log('PE', FM.median, FM.medianAll, FM.troughYears, peP25, peP75, 'n', FM.series.length);
  console.log('moves', Object.entries(MV).map(([s, v]) => `${s} ev ${v.ev.toFixed(1)} pe ${v.pe.toFixed(1)}`).join(' | '));
  console.log('evMove', evMove.toFixed(2), 'peMove', peMove.toFixed(2), 'sens', JSON.stringify(Object.fromEntries(Object.entries(sens).map(([k, v]) => [k, +v.toFixed(2)]))));
  console.log('MULT', MULT, 'pe', peMULT, 'ebitdaSep', Math.round(ebitdaSep.base), 'ncSep', Math.round(ncSep), 'tp', V.tp, 'up', V.upside.toFixed(1), rating, 'medTp', medTp, 'methods', BM.map(m => [m.key, Math.round(m.value)]));
}
