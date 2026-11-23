// Bharat Forge initiation: shared context for the Part B files. Loads the research JSONs and the built model,
// checks the segment build and the tax workaround, builds EPS before exceptional items, and derives the P/E and
// EV/EBITDA multiples (house rule, PLAYBOOK §4 and §7c) once. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'BHARATFORG', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'BHARATFORG.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'BHARATFORG', 'screener.json'), 'utf8'));
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
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SEGK = AS.segments.map(s => s.key), segName = Object.fromEntries(AS.segments.map(s => [s.key, s.name]));

// 1) Segment build: segments sum to model revenue; EBITDA = Σ segments − unallocated
F.years.forEach((y, i) => {
  const rev = SEGK.reduce((t, k) => t + F.seg[k].revenue[i], 0), e = SEGK.reduce((t, k) => t + F.seg[k].adjEbitda[i], 0) - AS.unallocated[i];
  if (Math.abs(rev / F.sales[i] - 1) > 0.002 || Math.abs(e / F.ebitda[i] - 1) > 0.002) throw new Error(`BHARATFORG segment check ${y}: ${n0(rev)} vs ${n0(F.sales[i])}, EBITDA ${n0(e)} vs ${n0(F.ebitda[i])}`);
});
const segRev = k => F.seg[k].revenue, segE = k => F.seg[k].adjEbitda;
const indiaRev = F.years.map((_, i) => ['bfl', 'kssl', 'othInd', 'elim'].reduce((t, k) => t + segRev(k)[i], 0));
const overseasE = F.years.map((_, i) => segE('eu')[i] + segE('us')[i]);

// 2) Tax workaround check: consolidated tax ≈ 25.5% of PBT excluding the loss-making units and the
//    non-deductible Q1FY27 CDP charge (overseas below-EBITDA costs ~₹530 cr a year: FY26 overseas EBITDA
//    ₹205 cr vs PBT −₹328 cr; e-mobility ~₹10 cr of depreciation and interest).
const EXC27 = -Q1.consolidated.exceptional; // 358
const OVS_BELOW = [530, 510, 470], EMOB_BELOW = 10;
const taxChk = F.years.map((y, i) => {
  const ovsPbt = overseasE[i] - OVS_BELOW[i], emPbt = segE('emob')[i] - EMOB_BELOW, exc = i === 0 ? EXC27 * 0.93 : 0; // ₹24.5 cr of the charge is Indian and deductible
  const base = F.pbt[i] - Math.min(ovsPbt, 0) - Math.min(emPbt, 0) + exc, implied = F.tax[i] / base * 100;
  return { y, ovsPbt, emPbt, base, implied };
});
taxChk.forEach(r => { if (r.implied < 23.5 || r.implied > 27.5) throw new Error(`BHARATFORG tax check ${r.y}: tax is ${r.implied.toFixed(1)}% of PBT ex losses`); });

// 3) EPS before exceptional items (the basis the street and our forecast years use)
const adjEps = { FY19: 21.9, FY20: 8.0, FY21: 4.8 }; C.history.annualKpis.forEach(k => (adjEps[k.fy] = k.adjEps));
const adj27 = F.eps[0] + EXC27 / F.shares; adjEps.FY27E = adj27; adjEps.FY28E = F.eps[1]; adjEps.FY29E = F.eps[2];
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };

// 4) Forward P/E history: house (reported EPS) and on EPS before exceptional items (used)
const FM = forwardMedian('BHARATFORG', M);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const aBy = Object.fromEntries(Object.entries(adjEps).map(([k, v]) => [2000 + +k.slice(2, 4), v]));
const troughA = fy => { const prev = [aBy[fy - 1], aBy[fy - 2], aBy[fy - 3]].filter(v => v != null); const pk = Math.max(...prev); return !(aBy[fy] > 0) || aBy[fy] < 0.5 * pk; };
const pxW = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0);
const adjAll = pxW.filter(([d]) => d >= '2021-04-01').map(([d, p]) => [d, Math.round(p / aBy[fyOf(d)] * 10) / 10]);
const adjSeries = adjAll.filter(([d]) => !troughA(fyOf(d)));
const adjTrough = [...new Set(adjAll.filter(([d]) => troughA(fyOf(d))).map(([d]) => `FY${String(fyOf(d)).slice(2)}`))];
const adjMed = pct(adjSeries.map(x => x[1]), 0.5), adjP25 = pct(adjSeries.map(x => x[1]), 0.25), adjP75 = pct(adjSeries.map(x => x[1]), 0.75);
const houseP25 = pct(FM.series.map(x => x[1]), 0.25);
const fwdPe = forwardSeries('BHARATFORG', M, 'eps').filter(x => x[0] >= '2016-04-01');
const fwdNow = price / sep(F.eps);
const two = medOf(adjSeries.filter(x => x[0] >= '2024-10-01').map(x => x[1]));

// 5) Sector de-rating: auto-component peers' trailing P/E at the 30-Sep close vs five-year medians (§7c)
const PEER_SYMS = D.peers.set, ALL = [...PEER_SYMS, 'BHARATFORG', ...D.peers.defence];
const PEERS = peersAsOf(ALL, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(ALL.map(s => [s, med5(s)]));
const derate = Object.fromEntries(ALL.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.map(s => derate[s]));
const k = 1 + sectorDr / 100;
const shortName = s => ({ MOTHERSON: 'Samvardhana Motherson', BOSCHLTD: 'Bosch', SONACOMS: 'Sona BLW', UNOMINDA: 'Uno Minda', SCHAEFFLER: 'Schaeffler India', ENDURANCE: 'Endurance Technologies', ZFCVINDIA: 'ZF Commercial Vehicle', TIINDIA: 'Tube Investments', RKFORGE: 'Ramkrishna Forgings', CIEINDIA: 'CIE Automotive India', CRAFTSMAN: 'Craftsman Automation', BHARATFORG: 'Bharat Forge', HAL: 'Hindustan Aeronautics', BEL: 'Bharat Electronics', BDL: 'Bharat Dynamics' }[s] || s);

// 6) Multiples (derived, nearest half-turn)
const MULT = { base: half(adjMed * k), bull: half(adjMed), bear: half(adjP25 * k) };
const houseMult = half(FM.median * k);
// EV/EBITDA cross-check: own one-year-forward EV/EBITDA since Apr-2021 (EV = price × shares + last reported net debt)
const evFwd = (() => {
  const bs = S.tables['balance-sheet'], pl = S.tables['profit-loss'], cashS = S.schedules['balance-sheet']['Other Assets']['Cash Equivalents'];
  const nd = {}; bs.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) nd[+p.slice(-4)] = bs.rows.Borrowings[i] - (cashS[p] || 0) - bs.rows.Investments[i]; });
  const eb = {}; pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) eb[+p.slice(-4)] = pl.rows['Operating Profit'][i]; });
  F.years.forEach((y, i) => (eb[2000 + +y.slice(2, 4)] = F.ebitda[i]));
  const sh = d => (d >= '2026-09-23' ? 48.87 : d >= '2024-12-10' ? 47.81 : 46.56);
  return pxW.filter(([d]) => d >= '2021-04-01').map(([d, p]) => { const dt = new Date(d), lastFy = dt.getMonth() >= 5 ? dt.getFullYear() : dt.getFullYear() - 1; return [d, (p * sh(d) + nd[lastFy]) / eb[fyOf(d)]]; });
})();
const evMed = pct(evFwd.map(x => x[1]), 0.5), evP25 = pct(evFwd.map(x => x[1]), 0.25);
const evMULT = { base: half(evMed * k), bull: half(evMed), bear: half(evP25 * k) };
const ebitdaSep28 = sep(F.ebitda), netDebtSep28 = -sep(F.treasury);
const QIP_CASH = 1980, qipPerShare = QIP_CASH / F.shares;

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrFwd = (Math.pow(F.eps[2] / A26adj(), 1 / 3) - 1) * 100;
function A26adj() { return 25.8 * 47.83 / F.shares; } // FY26 EPS before exceptional items on the post-QIP share count

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= D.street.postQ1From && s.tp);
const medTp = medOf(postQ1.map(s => s.tp)), withEps = ST.filter(s => s.eps);
const streetEps = y => medOf(withEps.map(s => s.eps[y]).filter(Boolean));
const dil = 47.81 / F.shares; // street EPS is on 47.81 cr pre-QIP shares

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, shortDate, SA, SQ, QL, yr, A26, A25, Q1, b, price, mcap, sep, pct, medOf,
  SEGK, segName, segRev, segE, indiaRev, overseasE, taxChk, EXC27, adjEps, adj27, epsSep, FM, adjSeries, adjAll, adjTrough, adjMed, adjP25, adjP75, houseP25, houseMult, fwdPe, fwdNow, two, fyOf,
  PEER_SYMS, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, k, shortName, MULT, evFwd, evMed, evP25, evMULT, ebitdaSep28, netDebtSep28, QIP_CASH, qipPerShare,
  BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, A26adj, ST, postQ1, medTp, withEps, streetEps, dil };
