// DMart (Avenue Supermarts) initiation: shared context for the Part B files. Loads the research JSONs and the built model,
// checks the store build (effective area x revenue per sq ft + subsidiaries = model revenue and EBITDA) and derives the P/E
// and EV/EBITDA multiples (house rule, PLAYBOOK §4 and §7c) once. As of 30-Sep-2026 (Q1FY27 basis).
//
// RETAIL PEER SET (first retail report of the consumer-services batch; TRENT and later retail reports match it):
//   used:     DMART, TRENT, METROBRAND, BATAINDIA, PAGEIND   (each report excludes itself)
//   excluded: ABFRL (loss-making FY20-26, demerged 2025: no P/E history), SHOPERSTOP (FY25 profit Rs11 cr, FY26 loss: P/E ~258x
//             meaningless), VMM (listed Dec-2024: no five-year median; sensitivity row only)
//   factor:   median of the used peers' trailing P/E at the 30-Sep-2026 close vs their five-year median (Oct-2021 to Sep-2026,
//             Screener 'Price to Earning' series), excluding self. For DMART: -30.2% (TRENT -47.3, METROBRAND -29.1, BATAINDIA
//             -30.3, PAGEIND -30.1). Sub-sets (ex-Trent, ex-Bata, ex-both, +VMM, ex-Metro) all give -29.6% to -30.3%.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'DMART', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json'), AJ = rd('assumptions.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'DMART.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'DMART', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly, sa = fy => SA.find(r => r.fy === fy);
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const Q1 = C.q1fy27, FY26 = C.fy26, OI26 = C.otherIncomeFY26, BS = C.balanceMar26;

// 1) Store build: effective area x revenue per sq ft (standalone) + subsidiaries = model revenue; margins = model EBITDA
const BL = AJ.build;
const build = (() => { let area = BL.base.areaClose, rps = BL.base.standaloneRev * 1e7 / (BL.base.areaEff * 1e6), sub = BL.base.subsRev, stores = BL.base.stores;
  return F.years.map((y, i) => { const add = BL.storeAdds[i] * BL.sqftPerNewStore, eff = area + add * BL.phasing; area += add; stores += BL.storeAdds[i];
    rps *= 1 + BL.revPerSqftGrowth[i] / 100; const st = eff * 1e6 * rps / 1e7; sub *= 1 + BL.subsGrowth[i] / 100;
    const stE = st * BL.standaloneMargin[i] / 100, e = stE + BL.subsEbitda[i];
    return { y, stores, adds: BL.storeAdds[i], area, eff, rps, st, stE, stM: BL.standaloneMargin[i], sub, subE: BL.subsEbitda[i], rev: st + sub, e }; }); })();
build.forEach((r, i) => { if (Math.abs(r.rev / F.sales[i] - 1) > 0.002) throw new Error(`DMART build revenue ${n0(r.rev)} != model ${n0(F.sales[i])} in ${r.y}`);
  if (Math.abs(r.e / F.ebitda[i] - 1) > 0.002) throw new Error(`DMART build EBITDA ${n0(r.e)} != model ${n0(F.ebitda[i])} in ${r.y}`); });
const effPrev = [BL.base.areaEff, ...build.map(r => r.eff)], rpsBase = BL.base.standaloneRev * 1e7 / (BL.base.areaEff * 1e6);
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);
const cashMar26 = BS.cash + BS.otherBank + BS.investments, netDebt26 = BS.borrowings - cashMar26, netDebtLeases26 = netDebt26 + BS.leaseLiabilities;

// 2) Forward P/E history: house function on reported EPS (base); sensitivity on EPS before the FY23 / FY25 one-off tax gains
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const FM = forwardMedian('DMART', M);
const HS = FM.series, hv = HS.map(x => x[1]);
const HA = { med: FM.median, p25: pct(hv, 0.25), p75: pct(hv, 0.75), min: Math.min(...hv), max: Math.max(...hv) };
const byFy = {}; HS.forEach(([d, v]) => (byFy[fyOf(d)] ||= []).push(v));
const sh = fy => { const pl = S.tables['profit-loss'], i = pl.periods.indexOf(`Mar 20${fy}`); return pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]; };
const epsX = { 2023: 36.69 - C.oneOffs.FY23.taxGain / sh(23), 2025: 41.61 - C.oneOffs.FY25.taxGain / sh(25) };
const medExOneOff = pct(HS.map(([d, v]) => [d, epsX[fyOf(d)] ? v * (fyOf(d) === 2023 ? 36.69 : 41.61) / epsX[fyOf(d)] : v]).map(x => x[1]), 0.5);
const two = pct(HS.filter(([d]) => d >= '2024-10-01').map(x => x[1]), 0.5);
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps);

// 3) Sector de-rating: retail peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set;
const PEERS = peersAsOf(['DMART', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(['DMART', ...PEER_SYMS].map(s => [s, med5(s)]));
const derate = Object.fromEntries(['DMART', ...PEER_SYMS].map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const sectorDr = medOf(USED.map(s => derate[s]));
const sens = { exTrent: medOf(USED.filter(s => s !== 'TRENT').map(s => derate[s])), exBata: medOf(USED.filter(s => s !== 'BATAINDIA').map(s => derate[s])),
  exBoth: medOf(USED.filter(s => !['TRENT', 'BATAINDIA'].includes(s)).map(s => derate[s])), exMetro: medOf(USED.filter(s => s !== 'METROBRAND').map(s => derate[s])),
  withVmm: medOf([...USED, 'VMM'].map(s => derate[s])) };
const k = 1 + sectorDr / 100;
const shortName = s => ({ DMART: 'DMart', TRENT: 'Trent', METROBRAND: 'Metro Brands', BATAINDIA: 'Bata India', PAGEIND: 'Page Industries', ABFRL: 'Aditya Birla Fashion', SHOPERSTOP: 'Shoppers Stop', VMM: 'Vishal Mega Mart' }[s] || s);

// 4) Multiples (derived, nearest half-turn): P/E primary; EV/EBITDA cross-check on the own trailing median since Apr-2021
const MULT = { base: half(HA.med * k), bull: half(HA.med), bear: half(HA.p25 * k) };
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda);
const evConv = ttmEbitda / ebitdaSep28; // trailing (year to Jun-26) to Sep-28E
const evMULT = { base: half(evMed * k * evConv), bull: half(evMed * evConv), bear: half(evP25 * k * evConv) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100;

// Street as it stood on 30-Sep-2026 (post-Q1 notes with a dated, named target, 13-Jul to 4-Aug-2026)
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-07' && s.tp && !s.pre);
const medTp = medOf(postQ1.map(s => s.tp));
const px = S.charts.price.Price.filter(([d]) => d <= ASOF), pxYr = px.filter(([d]) => d >= '2025-09-30').map(x => x[1]);
const hi52 = Math.max(...pxYr), lo52 = Math.min(...pxYr), ath = Math.max(...px.map(x => x[1]));
const pxAt = d => { const s = px.filter(([x]) => x <= d); return s[s.length - 1][1]; };

module.exports = { ROOT, RD, C, D, SG, AJ, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, half, pct, medOf, SA, SQ, sa, b, price, shares, mcap, sep, Q1, FY26, OI26, BS,
  BL, build, effPrev, rpsBase, ttmOI, cashMar26, netDebt26, netDebtLeases26, fyOf, FM, HS, HA, byFy, epsX, medExOneOff, two, fwdNow, sepNow,
  PEER_SYMS, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sens, k, shortName,
  MULT, evMed, evP25, evMULT, evConv, ttmEbitda, ebitdaSep28, epsSep, BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, ST, postQ1, medTp, hi52, lo52, ath, pxAt };

if (require.main === module) {
  console.log('build', build.map(r => [r.y, r.stores, r.area.toFixed(1), r.eff.toFixed(2), Math.round(r.rps), Math.round(r.st), Math.round(r.sub), Math.round(r.rev), Math.round(r.e)]));
  console.log('ttmOI', ttmOI, 'netDebt26', n0(netDebt26), 'incl leases', n0(netDebtLeases26));
  console.log('house', HA, 'trough', FM.troughYears, 'medianAll', FM.medianAll, 'exOneOff', medExOneOff, 'two', two, 'epsX', epsX);
  console.log('byFy', Object.entries(byFy).map(([f, v]) => `${f}:${medOf(v).toFixed(1)}(${v.length})`).join(' '));
  console.log('derate', Object.entries(derate).map(([s, v]) => `${s} ${P[s].pe}/${MED5[s]} ${v?.toFixed(1)}`).join(', '), 'sector', sectorDr.toFixed(2), 'sens', JSON.stringify(Object.fromEntries(Object.entries(sens).map(([a, v]) => [a, v.toFixed(2)]))));
  console.log('MULT', MULT, 'ev', evMed, evP25, evConv.toFixed(3), evMULT, 'epsSep', epsSep, 'tp', V.tp, 'upside', V.upside.toFixed(1), rating, 'medTp', medTp, 'fwdNow', n1(fwdNow), n1(sepNow), 'hi/lo', hi52, lo52, ath);
  console.log('methods', BM.map(m => [m.key, Math.round(m.value)]), 'buyBelow', buyBelow, 'sellAbove', sellAbove, 'eps', F.eps.map(n1), 'pat', F.pat.map(Math.round), 'scen', SC.bull.tp, SC.bear.tp, 'dcf', V.tp);
}
