// IndiaMART initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks the
// legal-entity segment build and the other-income build, and derives the P/E (primary) and EV/EBITDA (cross-check)
// multiples once (PLAYBOOK §4 and §7c). As of 30-Sep-2026 (Q1FY27 basis).
// ONE-OFFS (§4): reported EPS includes fair-value gains on strategic (start-up) investments (Rs84 cr FY23, Rs29 cr FY24,
// Rs43 cr FY25, Rs78 cr FY26) and a Rs29 cr gain on selling an associate stake (FY25): 6-22% of EPS. They are not treasury
// income and are not forecast, so the base median uses EPS before them (A18 batch practice); the reported-EPS median from
// forwardMedian() is a sensitivity row. Treasury mark-to-market stays in (it is the return on the cash).
// SECTOR MOVE (BRIEF "Thin peer sets"): internet platforms with a usable five-year P/E history, excluding IndiaMART: Info
// Edge only. Widened to the online-classifieds group the market and brokers use for IndiaMART (Screener's peer group:
// Info Edge, Just Dial, Matrimony.com; CarTrade excluded, loss in FY22). Full set in the base; sub-sets are sensitivities.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'INDIAMART', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'INDIAMART.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'INDIAMART', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', WIN0 = '2021-09-30';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return `${+dd}-${mon}-${y.slice(2)}`; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = arr.filter(x => x != null && Number.isFinite(x)).sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly, yr = fy => SA.find(a => a.fy === fy), q = k => SQ.find(x => x.q === k);
const A26 = yr('FY26'), A25 = yr('FY25'), Q1 = C.q1fy27, Q1y = q('Q1FY26');
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const aIdx = fy => A.labels.indexOf(fy);

// 1) Segment build: segments − unallocated − ESOP = model EBITDA; FY26 base reconciles to Screener
const seg = F.seg, KEYS = Object.keys(seg);
F.years.forEach((y, i) => { const rev = KEYS.reduce((t, k) => t + seg[k].revenue[i], 0), e = KEYS.reduce((t, k) => t + seg[k].adjEbitda[i], 0) - AS.unallocated[i] - AS.esop[i];
  if (Math.abs(rev - F.sales[i]) > 0.5 || Math.abs(e - F.ebitda[i]) > 0.5) throw new Error(`INDIAMART segment check failed ${y}`); });
if (Math.abs(A26.imAdjEbitda + A26.busyEbitda - A26.esopSa - A26.unalloc - A.ebitda[b]) > 2) throw new Error('INDIAMART FY26 EBITDA bridge');
const coEbitda = F.years.map((_, i) => F.ebitda[i] + AS.assocShare[i]); // company basis = model EBITDA + associates' share (see _unallocWhy)
const coMargin = coEbitda.map((e, i) => e / F.sales[i] * 100);
const imM = seg.im.adjEbitda.map((e, i) => e / seg.im.revenue[i] * 100);

// 2) Other income: yield × opening net treasury (incl. strategic stakes) + fixed items; FY27E vs FY26 and TTM
const tre0 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - A.borrowings[b];
F.years.forEach((y, i) => { const built = AS.treasuryYield[i] / 100 * (i ? F.treasury[i - 1] : tre0) + AS.otherIncome[i];
  if (Math.abs(built - F.otherIncome[i]) > 0.6) throw new Error(`INDIAMART other-income build ${y}: ${built} vs ${F.otherIncome[i]}`); });
const OB = C.otherIncomeBuild, oi26 = OB.total[3], oi26ex = OB.total[3] - OB.oneOffs[3];
const ttmOI = SQ.filter(x => ['Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'].includes(x.q)).reduce((s, x) => s + x.otherIncome, 0);
const ttmEx = ttmOI - OB.oneOffs[3]; // FY26's strategic fair-value gain sits in Q2-Q4FY26 (inside the TTM)
if (Math.abs(F.otherIncome[0] / ttmEx - 1) > 0.75) throw new Error('INDIAMART other-income vs TTM');

// 3) Own forward P/E, Apr-2021 to the as-of date. Reported (house function) and before one-offs (base).
const FM = forwardMedian('INDIAMART', M);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pl = S.tables['profit-loss'], epsRep = {}, epsClean = {}, oneOffEps = {};
pl.periods.forEach((p, i) => { const m = p.match(/^Mar (\d{4})/); if (m) { const y = +m[1]; epsRep[y] = epsClean[y] = pl.rows['EPS in Rs'][i]; } });
OB.years.forEach((fy, j) => { const y = 2000 + +fy.slice(2), sh = A.shares[aIdx(fy)]; oneOffEps[y] = OB.oneOffs[j] * 0.75 / sh; epsClean[y] = epsRep[y] - oneOffEps[y]; });
F.years.forEach((y, i) => { epsRep[2000 + +y.slice(2, 4)] = F.eps[i]; epsClean[2000 + +y.slice(2, 4)] = F.eps[i]; });
const pxAll = S.charts.price.Price.filter(([d]) => d <= ASOF), pxW = pxAll.filter((_, i) => i % 5 === 0);
if (pxW.at(-1)[0] < ASOF) pxW.push([ASOF, price]);
const own = (from, E) => pxW.filter(([d]) => d >= from && E[fyOf(d)] > 0).map(([d, p]) => [d, Math.round(p / E[fyOf(d)] * 10) / 10]);
const cleanS = own('2021-04-01', epsClean), repS = own('2021-04-01', epsRep);
const cleanMed = pct(cleanS.map(x => x[1]), 0.5), repMed = pct(repS.map(x => x[1]), 0.5);
const p25 = pct(cleanS.map(x => x[1]), 0.25), p75 = pct(cleanS.map(x => x[1]), 0.75);
const two = pct(cleanS.filter(x => x[0] >= '2024-10-01').map(x => x[1]), 0.5);
const byFy = {}; cleanS.forEach(([d, v]) => (byFy[fyOf(d)] ||= []).push(v));
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps);
// Ex-cash P/E: price less Jun-26 cash, treasury and stakes (net of leases) ÷ FY28E EPS less after-tax other income
const cashPs = (C.q1fy27.cashTreasury + C.q1fy27.strategic - 22) / shares, opEps28 = F.eps[1] - F.otherIncome[1] * (1 - AS.taxRate[1] / 100) / shares, exCashPe = (price - cashPs) / opEps28;

// 4) Sector moves (§7c): trailing P/E at the 30-Sep close vs each name's five-year median (Sep-2021 to Sep-2026)
const SET = D.peers.set, NET = D.peers.internet, CLS = D.peers.classifieds, SHOW = ['INDIAMART', ...D.peers.show];
const PEERS = peersAsOf(SHOW, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const medFrom = (sym, from) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= from && x > 0).map(x => x[1]); return v.length ? medOf(v) : null; };
const MED5 = Object.fromEntries(SHOW.map(s => [s, medFrom(s, WIN0)]));
const dr5 = Object.fromEntries(SHOW.map(s => [s, P[s]?.pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const move = set => medOf(set.map(s => dr5[s]));
const MV = { all: move(SET), net: move(NET), cls: move(CLS), exJd: move(SET.filter(s => s !== 'JUSTDIAL')) };
const kBase = 1 + MV.all / 100;
const shortName = s => ({ INDIAMART: 'IndiaMART', NAUKRI: 'Info Edge (Naukri)', JUSTDIAL: 'Just Dial', MATRIMONY: 'Matrimony.com', CARTRADE: 'CarTrade', ETERNAL: 'Eternal', NYKAA: 'Nykaa (FSN)', PAYTM: 'Paytm', POLICYBZR: 'PB Fintech', SWIGGY: 'Swiggy' }[s] || s);

// 5) Multiples (nearest half-turn). Base: own median before one-offs × the three-name move. Bull: own median, no move.
// Bear: own 25th percentile × the move.
const MULT = { base: half(cleanMed * kBase), bull: half(cleanMed), bear: half(p25 * kBase) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const at = m => Math.round(m * epsSep.base / 10) * 10;
const SENS = { none: half(cleanMed), net: half(cleanMed * (1 + MV.net / 100)), cls: half(cleanMed * (1 + MV.cls / 100)), exJd: half(cleanMed * (1 + MV.exJd / 100)), rep: half(repMed * kBase), two: half(two * kBase), house: half(FM.median * kBase) };

// 6) EV/EBITDA cross-check: price × shares − net treasury incl. strategic stakes at the last March, ÷ next-year model EBITDA
const ebBy = {}, ntBy = {};
A.labels.forEach((l, i) => { const y = 2000 + +l.slice(2); ebBy[y] = A.ebitda[i]; const s = yr(l); ntBy[y] = s ? s.cashTreasury + s.strategic - (A.borrowings[i] || 0) : null; });
F.years.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const evS = pxW.filter(([d]) => d >= '2021-04-01').map(([d, p]) => { const f = fyOf(d), sh = A.shares[Math.min(b, aIdx('FY' + String(f - 2).slice(2)))] || shares; return [d, Math.round((p * sh - ntBy[f - 2]) / ebBy[f] * 10) / 10]; }).filter(x => x[1] > 0);
const evMed = pct(evS.map(x => x[1]), 0.5), evP25 = pct(evS.map(x => x[1]), 0.25);
const evMULT = { base: half(evMed * kBase), bull: half(evMed), bear: half(evP25 * kBase) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, medTp = medOf(ST.map(s => s.tp)), nBuy = ST.filter(s => /Buy|Add/.test(s.rating)).length, nSell = ST.filter(s => /Reduce|Underperform|Sell/.test(s.rating)).length;
const epsCagrHist = (Math.pow(epsClean[2026] / epsClean[2023], 1 / 3) - 1) * 100, epsCagrFwd = (Math.pow(F.eps[2] / epsClean[2026], 1 / 3) - 1) * 100;

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, WIN0, n0, n1, pc, pc1, half, shortDate, pct, medOf, SA, SQ, yr, q, A26, A25, Q1, Q1y, b, price, shares, mcap, sep,
  seg, KEYS, coEbitda, coMargin, imM, tre0, OB, oi26, oi26ex, ttmOI, ttmEx, FM, fyOf, epsRep, epsClean, oneOffEps, cleanS, repS, cleanMed, repMed, p25, p75, two, byFy, fwdNow, sepNow, cashPs, opEps28, exCashPe,
  SET, NET, CLS, PEERS, P, MED5, dr5, MV, kBase, shortName, MULT, epsSep, at, SENS, evS, evMed, evP25, evMULT, BM, mv, rating, buyBelow, sellAbove, ST, medTp, nBuy, nSell, epsCagrHist, epsCagrFwd };

if (require.main === module) {
  console.log('tre0', n0(tre0), 'OI', F.otherIncome.map(Math.round), 'FY26', oi26, 'ex', n1(oi26ex), 'ttm', n1(ttmOI), 'ttmEx', n1(ttmEx), 'coMargin', coMargin.map(n1), 'imM', imM.map(n1));
  console.log('FM', FM.median, FM.medianAll, FM.troughYears, FM.series.length, '| own rep', repMed, 'clean', cleanMed, 'n', cleanS.length, 'p25', p25, 'p75', p75, 'two', two, 'epsClean', JSON.stringify(Object.fromEntries(Object.entries(epsClean).filter(([y]) => y >= 2021).map(([y, v]) => [y, +n1(v)]))));
  console.log('byFy', Object.entries(byFy).map(([f, v]) => `${f}:${n1(medOf(v))}`).join(' '));
  console.log('dr5', Object.entries(dr5).map(([s, v]) => `${s} ${v == null ? 'na' : n1(v)} (pe ${P[s]?.pe}, med ${MED5[s] && n1(MED5[s])})`).join(', '));
  console.log('MV', JSON.stringify(Object.fromEntries(Object.entries(MV).map(([k, v]) => [k, +n1(v)]))), 'MULT', MULT, 'SENS', SENS, 'epsSep', epsSep, 'at base', at(MULT.base));
  console.log('ev', evMed, evP25, evMULT, 'evNow', n1((mcap - (Q1.cashTreasury + Q1.strategic - 22)) / F.ebitda[1]), 'tp', V.tp, V.upside && n1(V.upside), rating, 'medTp', medTp, 'sepNow', n1(sepNow), 'fwdNow', n1(fwdNow), 'cagr', n1(epsCagrHist), n1(epsCagrFwd));
}
