// Tenneco Clean Air India initiation: shared context for the Part B files. Loads the research JSONs and the built model,
// checks the segment build (CA&PT VAR + ART VAR + substrates = model revenue) and the other-income build, and derives the
// P/E and EV/EBITDA multiples once (PLAYBOOK §4 and §7c). Recently listed (19-Nov-2025, 10.4 months before the as-of
// date): the own window is listing to 30-Sep-2026 on every daily close, and the sector move is measured over the same
// window (HYUNDAI / HDBFS precedent). As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'TENNIND', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'TENNIND.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'TENNIND', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2025-11-19', ISSUE = 397;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const Q1 = C.q1fy27, RP = C.relatedParty;

// 1) Segment build: CA&PT VAR + ART VAR + substrates (balance) = model revenue; substrates must stay 9-13% of VAR
const LB = AS.lineBuild, VAR = F.years.map((_, i) => LB.caVar[i] + LB.artVar[i]), SUB = F.sales.map((s, i) => s - VAR[i]);
F.years.forEach((y, i) => {
  const r = SUB[i] / VAR[i] * 100; if (!(r > 9 && r < 13)) throw new Error(`TENNIND substrate share ${y}: ${r.toFixed(1)}% of VAR`);
  const g = (x, p) => Math.abs(x - p) < 1.5; // stated growth vs build
  if (!g(LB.caVar[i], (i ? LB.caVar[i - 1] : LB.fy26.caVar) * (1 + LB.caGrowth[i] / 100)) || !g(LB.artVar[i], (i ? LB.artVar[i - 1] : LB.fy26.artVar) * (1 + LB.artGrowth[i] / 100))) throw new Error(`TENNIND segment growth ${y}`);
  const built = AS.treasuryYield[i] / 100 * Math.max(i ? F.treasury[i - 1] : (A.cash[b] || 0) + (A.investments[b] || 0) - (A.borrowings[b] || 0), 0) + AS.otherIncome[i];
  if (Math.abs(built - F.otherIncome[i]) > 0.5) throw new Error(`TENNIND other-income build ${y}: ${built} vs ${F.otherIncome[i]}`);
});
if (Math.abs(LB.fy26.caVar + LB.fy26.artVar + LB.fy26.substrates - A.sales[b]) > 2) throw new Error('TENNIND FY26 build vs model revenue');
const var26 = LB.fy26.caVar + LB.fy26.artVar, varG = VAR.map((v, i) => (v / (i ? VAR[i - 1] : var26) - 1) * 100);
const mVar = F.ebitda.map((e, i) => e / VAR[i] * 100), mVar26 = A.ebitda[b] / var26 * 100;
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);
const feesFy26 = RP.royaltyFy26 + RP.networkFeeFy26, feesFy25 = RP.royaltyFy25 + RP.mgmtSupportFy25 + RP.corpSupportFy25;
const feesPct = feesFy26 / A.sales[b] * 100, feesOfEbitda = feesFy26 / A.ebitda[b] * 100;

// 2) Own one-year-forward P/E on EVERY daily close since listing (forwardSeries keeps every 5th point: too few for a
//    10-month history), next full fiscal year's EPS (FY27E to Mar-2026, FY28E from Apr-2026: ours). IPO-premium check:
//    the listing weeks traded BELOW the later median (Nov-Dec 2025 average ~Rs485), so no months are skipped.
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsBy = {}; A.labels.forEach((l, i) => { if (A.eps[i]) epsBy[2000 + +l.slice(2)] = A.eps[i]; }); F.years.forEach((y, i) => { epsBy[2000 + +y.slice(2, 4)] = F.eps[i]; });
const px = S.charts.price.Price.filter(([d]) => d >= LISTED && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const fwdPe = px.map(([d, p]) => [d, Math.round(p / epsBy[fyOf(d)] * 10) / 10]);
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const PEL = stat(fwdPe, LISTED), PEA = stat(fwdPe, '2026-04-01'), PEB = stat(fwdPe, LISTED, '2026-03-31'), PEX = stat(fwdPe, '2026-01-01');
const FM = forwardMedian('TENNIND', M, { from: LISTED }); // house function (every 5th point), shown as a check
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps), trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;
const firstWeeks = fwdPe.filter(x => x[0] < '2026-01-01').map(x => x[1]);

// 3) Sector move: auto-component peers' trailing P/E at the 30-Sep close vs their own medians over the same window
//    (listing to 30-Sep, primary) and vs five-year medians (shown); TENNIND excluded (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set, EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const PEERS = peersAsOf(['TENNIND', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const peSeries = sym => (JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.pe?.['Price to Earning'] || []);
const medFrom = (sym, from) => { const v = peSeries(sym).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]); return v.length ? medOf(v) : null; };
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, medFrom(s, '2021-09-30')])), MEDL = Object.fromEntries(PEER_SYMS.map(s => [s, medFrom(s, LISTED)]));
const drL = Object.fromEntries(PEER_SYMS.map(s => [s, P[s]?.pe && MEDL[s] ? (P[s].pe / MEDL[s] - 1) * 100 : null]));
const dr5 = Object.fromEntries(PEER_SYMS.map(s => [s, P[s]?.pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const sectorL = medOf(USED.map(s => drL[s])), sectorLAll = medOf(PEER_SYMS.filter(s => drL[s] != null).map(s => drL[s])), sector5 = medOf(USED.map(s => dr5[s]));
const k = 1 + sectorL / 100, k5 = 1 + sector5 / 100;
const shortName = s => ({ TENNIND: 'Tenneco Clean Air India', MOTHERSON: 'Samvardhana Motherson', BOSCHLTD: 'Bosch', UNOMINDA: 'Uno Minda', SONACOMS: 'Sona BLW', BHARATFORG: 'Bharat Forge', ENDURANCE: 'Endurance', MSUMI: 'Motherson Sumi Wiring', SCHAEFFLER: 'Schaeffler India', TIINDIA: 'Tube Investments', ZFCVINDIA: 'ZF CV Control', GABRIEL: 'Gabriel India' }[s] || s);

// 4) Multiples (derived, nearest half-turn): base = own median since listing x same-window sector move;
//    bull = no sector move; bear = own 25th percentile x the move. Sensitivities shown, never blended.
const MULT = { base: half(PEL.med * k), bull: half(PEL.med), bear: half(PEL.p25 * k) };
const ALT = { five: half(PEL.med * k5), fy28only: half(PEA.med * k), cal26: half(PEX.med * k) };
const peM = blend => blend.methods.find(m => m.key === 'pe').metric;
const epsSep = { base: peM(V.blend), bull: peM(SC.bull.blend), bear: peM(SC.bear.blend) };
// EV/EBITDA cross-check: own trailing EV/EBITDA median since listing x the same move, restated from trailing (year to
// Jun-26) to Sep-28E EBITDA
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= LISTED && d <= ASOF && x > 0).map(x => x[1]);
const evMed = medOf(evHist), evP25 = pct(evHist, 0.25);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda), rest = ttmEbitda / ebitdaSep28;
const evMULT = { base: half(evMed * k * rest), bull: half(evMed * rest), bear: half(evP25 * k * rest) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp)), sellAbove = Math.round(sellAt(V.tp));
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, epsCagrHist = (Math.pow(A.eps[b] / A.eps[0], 1 / 3) - 1) * 100;

// Street as it stood on 30-Sep-2026 (latest note per broker)
const ST = D.street.brokers, latest = ST.filter(s => s.current && s.tp);
const medTp = medOf(latest.map(s => s.tp)), withEps = latest.filter(s => s.eps && s.eps.FY28E);
const streetMults = latest.map(s => parseFloat(s.multiple)).filter(x => x > 0), medStreetMult = streetMults.length ? medOf(streetMults) : null;

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, LISTED, ISSUE, n0, n1, n2, pc, pc1, half, pct, medOf, SA, SQ, QL, b, price, shares, mcap, sep, Q1, RP,
  LB, VAR, SUB, var26, varG, mVar, mVar26, ttmOI, feesFy26, feesFy25, feesPct, feesOfEbitda,
  fyOf, epsBy, fwdPe, PEL, PEA, PEB, PEX, FM, fwdNow, sepNow, trailEps, trailPe, firstWeeks,
  PEER_SYMS, EXCL, USED, PEERS, P, MED5, MEDL, drL, dr5, sectorL, sectorLAll, sector5, k, k5, shortName,
  MULT, ALT, epsSep, evMed, evP25, evMULT, ttmEbitda, ebitdaSep28, rest, BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, epsCagrHist, ST, latest, medTp, withEps, medStreetMult };

if (require.main === module) {
  console.log('VAR', VAR, 'g', varG.map(n1), 'sub', SUB.map(n0), 'mVar', mVar.map(n1), n1(mVar26), 'ttmOI', ttmOI, 'fees', feesFy26, n2(feesPct), n1(feesOfEbitda));
  console.log('PEL', PEL, 'PEA', PEA, 'PEB', PEB, 'PEX', PEX, 'FM', FM.median, FM.series.length, 'first', firstWeeks.length, medOf(firstWeeks), 'now', n1(fwdNow), n1(sepNow), n1(trailPe));
  console.log('drL', Object.entries(drL).map(([s, v]) => `${s} ${v == null ? 'na' : v.toFixed(1)}`).join(', '), '| sectorL', sectorL.toFixed(2), 'all', sectorLAll.toFixed(2), '| 5y', sector5.toFixed(2));
  console.log('MULT', MULT, 'ALT', ALT, 'ev', evMed, evP25, rest.toFixed(3), evMULT, 'epsSep', epsSep, 'tp', V.tp, 'up', V.upside.toFixed(1), rating, 'medTp', medTp, 'buy<', buyBelow, 'sell>', sellAbove);
}
