// BLS International initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks
// the business-line / segment build and the other-income build, and derives the P/E (primary) and EV/EBITDA (cross-check)
// multiples once (PLAYBOOK §4 and §7c, thin-peer rule: TBO Tek's widened travel + internet set). As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'BLS', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'BLS.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'BLS', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', WIN0 = '2021-09-30', POST = '2023-04-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(x => x.q);
const yr = fy => SA.find(a => a.fy === fy), q = k => SQ.find(x => x.q === k);
const A26 = yr('FY26'), Q1 = C.q1fy27, BL = AS.businessLines || JSON.parse(fs.readFileSync(path.join(RD, 'assumptions.json'), 'utf8')).businessLines;
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E

// 1) Business lines -> segments -> model (revenue and company-basis EBITDA; Screener EBITDA adds back bank charges)
const seg = F.seg, KEYS = Object.keys(seg);
const lines = { core: [], aad: BL.aadhaar.revenue, org: [], aty: BL.atyati.revenue, coreE: [], aadE: [], orgE: [], atyE: [] };
let c = BL.visaCore.base, o = BL.digitalOrganic.base;
F.years.forEach((y, i) => {
  c *= 1 + BL.visaCore.growth[i] / 100; o *= 1 + BL.digitalOrganic.growth[i] / 100;
  lines.core.push(c); lines.org.push(o); lines.coreE.push(c * BL.visaCore.margin[i] / 100); lines.orgE.push(o * BL.digitalOrganic.margin[i] / 100);
  lines.aadE.push(BL.aadhaar.revenue[i] * BL.aadhaar.margin[i] / 100); lines.atyE.push(BL.atyati.revenue[i] * BL.atyati.margin[i] / 100);
  const chk = [[seg.visa.revenue[i], c + lines.aad[i]], [seg.visa.adjEbitda[i], lines.coreE[i] + lines.aadE[i]], [seg.dig.revenue[i], o + lines.aty[i]], [seg.dig.adjEbitda[i], lines.orgE[i] + lines.atyE[i]]];
  if (chk.some(([x, z]) => Math.abs(x - z) > 1)) throw new Error(`BLS business-line check failed ${y}: ${JSON.stringify(chk.map(p => p.map(Math.round)))}`);
  const rev = KEYS.reduce((t, k) => t + seg[k].revenue[i], 0), e = KEYS.reduce((t, k) => t + seg[k].adjEbitda[i], 0) - AS.unallocated[i];
  if (Math.abs(rev - F.sales[i]) > 0.5 || Math.abs(e - F.ebitda[i]) > 0.5) throw new Error(`BLS segment check failed ${y}`);
});
const ebitdaCo = F.years.map((_, i) => F.ebitda[i] + AS.unallocated[i]), marginCo = ebitdaCo.map((e, i) => e / F.sales[i] * 100);
const visaShare = F.years.map((_, i) => seg.visa.adjEbitda[i] / ebitdaCo[i] * 100);

// 2) Other income: treasury yield on opening net treasury + non-treasury items; FY27E vs FY26 and Q1FY27 x4
const tre0 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - A.borrowings[b];
const oiTreas = F.otherIncome.map((x, i) => x - AS.otherIncome[i]), oi26 = C.fy26.otherIncome, oiQ1x4 = Q1.otherIncome * 4;
const grossTre = [tre0, ...F.treasury.slice(0, 2)].map(t => t + 200 + 320.2); // + leases + minorities at book
const grossYield = oiTreas.map((x, i) => x / grossTre[i] * 100);
if (Math.abs(F.otherIncome[0] / oi26 - 1) > 0.1 || Math.abs(F.otherIncome[0] / oiQ1x4 - 1) > 0.1) throw new Error(`BLS other-income check: FY27E ${n0(F.otherIncome[0])} vs FY26 ${oi26} and Q1x4 ${oiQ1x4}`);

// 3) Own forward P/E (house function), Apr-2021 to the as-of date; plus a post-transition window (Apr-2023, the first year
//    after the move to self-managed centres) as a sensitivity row
const FM = forwardMedian('BLS', M);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const p25 = pct(FM.series.map(x => x[1]), 0.25), p75 = pct(FM.series.map(x => x[1]), 0.75);
const postMed = pct(FM.series.filter(x => x[0] >= POST).map(x => x[1]), 0.5);
const byFy = {}; FM.series.forEach(([d, v]) => (byFy[d.slice(0, 4)] ||= []).push(v));
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps), trailEps = A.eps[b] - 4.15 + 4.62, trailPe = price / trailEps; // TTM to Jun-26 (owners): FY26 less Q1FY26 plus Q1FY27

// 4) Sector move (PLAYBOOK §7c, thin-peer rule): trailing P/E at the 30-Sep close vs each peer's five-year median.
const SET = D.peers.set, TRAVEL = D.peers.travel, NET = D.peers.internet, IRS = D.peers.irctcSet;
const SHOW = ['BLS', ...SET, 'CONCOR', 'RAILTEL', 'RITES', 'TBOTEK', 'IXIGO', 'EASEMYTRIP'];
const PEERS = peersAsOf(SHOW, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const peSeries = sym => (JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.pe?.['Price to Earning'] || []);
const medFrom = (sym, from) => medOf(peSeries(sym).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const MED5 = Object.fromEntries(SHOW.map(s => [s, medFrom(s, WIN0)])), MEDP = Object.fromEntries(SHOW.map(s => [s, medFrom(s, POST)]));
const dr = med => Object.fromEntries(SHOW.map(s => [s, P[s].pe > 0 && med[s] ? (P[s].pe / med[s] - 1) * 100 : null]));
const dr5 = dr(MED5), drP = dr(MEDP);
const move = (set, d = dr5) => medOf(set.map(s => d[s]));
const MV = { set: move(SET), travel: move(TRAVEL), net: move(NET), irctc: move(IRS), post: move(SET, drP) };
const k = 1 + MV.set / 100;
const shortName = s => ({ BLS: 'BLS International', IRCTC: 'IRCTC', THOMASCOOK: 'Thomas Cook (India)', NAUKRI: 'Info Edge (Naukri)', INDIAMART: 'IndiaMART', CONCOR: 'Container Corp', RAILTEL: 'RailTel', RITES: 'RITES', TBOTEK: 'TBO Tek', IXIGO: 'ixigo (Le Travenues)', EASEMYTRIP: 'Easy Trip Planners' }[s] || s);

// 5) Multiples (derived, nearest half-turn). Base: own median since 2021 x the four-name move. Bull: own median, no move.
//    Bear: own 25th percentile x the move.
const MULT = { base: half(FM.median * k), bull: half(FM.median), bear: half(p25 * k) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const at = m => Math.round(m * epsSep.base / 10) * 10;
const SENS = { none: half(FM.median), travel: half(FM.median * (1 + MV.travel / 100)), net: half(FM.median * (1 + MV.net / 100)), irctc: half(FM.median * (1 + MV.irctc / 100)), post: half(postMed * (1 + MV.post / 100)), all: half(FM.medianAll * k) };

// 6) EV/EBITDA cross-check: own forward EV/EBITDA (price x shares - net cash at the last March, / next-year EBITDA), same window
const cashSch = S.schedules['balance-sheet']['Other Assets']['Cash Equivalents'], ebitdaBy = {}, ncBy = {};
A.labels.forEach((l, i) => { const y = 2000 + +l.slice(2); ebitdaBy[y] = A.ebitda[i]; ncBy[y] = (cashSch[`Mar ${y}`] ?? A.cash[i] ?? 0) + (A.investments[i] || 0) - (A.borrowings[i] || 0); });
F.years.forEach((y, i) => (ebitdaBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const pxW = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0);
const evS = pxW.filter(([d]) => d >= '2021-04-01').map(([d, p]) => { const f = fyOf(d); return [d, Math.round((p * shares - ncBy[f - 2]) / ebitdaBy[f] * 10) / 10]; }).filter(x => x[1] > 0);
const evMed = pct(evS.map(x => x[1]), 0.5), evP25 = pct(evS.map(x => x[1]), 0.25);
const evMULT = { base: half(evMed * k), bull: half(evMed), bear: half(evP25 * k) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, cur = ST.filter(s => s.standing), medTp = medOf(cur.map(s => s.tp)), idbi = cur[0], idbiInit = ST.find(s => s.short === 'IDBI (init.)');
const epsCagrHist = (Math.pow(A.eps[b] / A.eps[b - 3], 1 / 3) - 1) * 100, epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100;

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, BL, ASOF, ASOF_TXT, WIN0, POST, n0, n1, pc, pc1, half, shortDate, pct, medOf, SA, SQ, QL, yr, q, A26, Q1, b, price, shares, mcap, sep,
  seg, KEYS, lines, ebitdaCo, marginCo, visaShare, tre0, oiTreas, oi26, oiQ1x4, grossTre, grossYield, FM, fyOf, p25, p75, postMed, byFy, fwdNow, sepNow, trailEps, trailPe,
  SET, TRAVEL, NET, IRS, SHOW, PEERS, P, MED5, MEDP, dr5, drP, MV, k, shortName, MULT, epsSep, at, SENS, evS, evMed, evP25, evMULT, BM, mv, rating, buyBelow, sellAbove, ST, cur, medTp, idbi, idbiInit, epsCagrHist, epsCagrFwd };

if (require.main === module) {
  console.log('lines', JSON.stringify(Object.fromEntries(Object.entries(lines).map(([kk, v]) => [kk, v.map(Math.round)]))), 'ebitdaCo', ebitdaCo.map(Math.round), 'marginCo', marginCo.map(n1), 'visaShare', visaShare.map(n1));
  console.log('tre0', n0(tre0), 'OI', F.otherIncome.map(Math.round), 'treasury part', oiTreas.map(Math.round), 'gross', grossTre.map(Math.round), 'grossYield', grossYield.map(n1), 'FY26', oi26, 'Q1x4', oiQ1x4);
  console.log('FM', FM.median, FM.medianAll, FM.troughYears, 'n', FM.series.length, 'p25', p25, 'p75', p75, 'post', postMed, 'byYear', Object.entries(byFy).map(([y, v]) => `${y}:${n1(medOf(v))}`).join(' '));
  console.log('fwdNow', n1(fwdNow), 'sepNow', n1(sepNow), 'trailPe', n1(trailPe), 'trailEps', n1(trailEps));
  console.log('dr5', SHOW.map(s => `${s} ${dr5[s] == null ? '-' : n1(dr5[s])} (pe ${P[s].pe} med ${MED5[s]?.toFixed(1)})`).join(', '));
  console.log('drP', SHOW.map(s => `${s} ${drP[s] == null ? '-' : n1(drP[s])}`).join(', '));
  console.log('MV', JSON.stringify(Object.fromEntries(Object.entries(MV).map(([kk, v]) => [kk, +n1(v)]))));
  console.log('MULT', MULT, 'SENS', SENS, 'ev', evMed, evP25, evMULT, 'epsSep', epsSep, 'tp', V.tp, n1(V.upside), rating, 'medTp', medTp, 'dcf', Math.round(mv('dcf').value), 'ev val', Math.round(mv('ev').value));
}
