// Belrise Industries initiation: shared context for the Part B files. Loads the research JSONs and the built model,
// checks the two-line build (manufacturing + trading = model revenue and EBITDA) and the other-income build, and derives
// the P/E and EV/EBITDA multiples once (house rule, PLAYBOOK §4 and §7c; recently listed: 12-month window with the
// same-window auto-component sector move, as HYUNDAI.ctx.js and ATHERENERG.ctx.js). As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'BELRISE', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'BELRISE.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'BELRISE', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2025-05-28', R12 = '2025-10-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const sd = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const A26 = SA.find(a => a.fy === 'FY26'), A25 = SA.find(a => a.fy === 'FY25'), Q1 = C.q1fy27;
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E

// 1) Two-line build: manufacturing + trading must equal model revenue and EBITDA; other income = treasury + recurring
const LB = AS.lineBuild, lines = [];
{ let m = LB.fy26.manufacturing, t = LB.fy26.trading;
  F.years.forEach((y, i) => { m *= 1 + LB.mfgGrowth[i] / 100; t *= 1 + LB.tradingGrowth[i] / 100;
    const e = m * LB.mfgMargin[i] / 100 + t * LB.tradingMargin[i] / 100;
    lines.push({ y, mfg: m, trading: t, mfgEbitda: m * LB.mfgMargin[i] / 100, tradingEbitda: t * LB.tradingMargin[i] / 100, ebitda: e });
    if (Math.abs(m + t - F.sales[i]) > 2) throw new Error(`BELRISE line build ${y}: ${n0(m + t)} vs model ${n0(F.sales[i])}`);
    if (Math.abs(e - F.ebitda[i]) > 2) throw new Error(`BELRISE EBITDA build ${y}: ${n0(e)} vs model ${n0(F.ebitda[i])}`);
    const built = AS.treasuryYield[i] / 100 * Math.max(i ? F.treasury[i - 1] : (A.cash[b] || 0) + (A.investments[b] || 0) - (A.borrowings[b] || 0), 0) + AS.otherIncome[i];
    if (Math.abs(built - F.otherIncome[i]) > 0.5) throw new Error(`BELRISE other-income build ${y}: ${built} vs ${F.otherIncome[i]}`); }); }
if (Math.abs(LB.fy26.manufacturing + LB.fy26.trading - A.sales[b]) > 2) throw new Error('BELRISE FY26 line build vs model revenue');
const treasury0 = (A.cash[b] || 0) + (A.investments[b] || 0) - (A.borrowings[b] || 0);
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);
const mfgShare26 = LB.fy26.manufacturing / A.sales[b] * 100, tradeMargin26 = LB.fy26.tradingEbitda / LB.fy26.trading * 100;

// 2) Forward P/E on EVERY weekly close since listing (forwardSeries keeps every 5th point), plus the 30-Sep close.
//    Next full fiscal year's EPS: actual (FY26 pro forma for the QIP), then ours. The 12-month window (Oct-2025 to
//    Sep-2026) skips the first four months after listing, when the stock re-rated from Rs94 to Rs157 (IPO-premium months).
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsBy = {}; A.labels.forEach((l, i) => { if (A.eps[i]) epsBy[2000 + +l.slice(2)] = A.eps[i]; }); F.years.forEach((y, i) => { epsBy[2000 + +y.slice(2, 4)] = F.eps[i]; });
const px = S.charts.price.Price.filter(([d]) => d >= LISTED && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const fwdPe = px.map(([d, p]) => [d, Math.round(p / epsBy[fyOf(d)] * 10) / 10]);
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: medOf(v), p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const PEL = stat(fwdPe, LISTED), PE12 = stat(fwdPe, R12), PE6 = stat(fwdPe, '2026-04-01'), PEH2 = stat(fwdPe, R12, '2026-03-31'), PEIPO = stat(fwdPe, LISTED, '2025-09-30');
const FM12 = forwardMedian('BELRISE', M, { from: R12 }); // house function (every 5th week): shown as a check
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps), trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0);
const trough = Object.entries(epsBy).filter(([y, e]) => { const prev = [1, 2, 3].map(k => epsBy[+y - k]).filter(x => x); return prev.length && (e <= 0 || e < Math.max(...prev) / 2); }).map(([y]) => `FY${String(y).slice(2)}`);

// 3) Sector move: auto-component peers' trailing P/E at the 30-Sep close vs their own medians over the same 12 months
//    (primary, so the window matches Belrise's own) and vs five-year medians (shown); Belrise itself excluded (§7c)
const PEER_SYMS = D.peers.set, EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const PEERS = peersAsOf(['BELRISE', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const peSeries = sym => (JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.pe?.['Price to Earning'] || []);
const medFrom = (sym, from) => medOf(peSeries(sym).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, medFrom(s, '2021-09-30')])), MED12 = Object.fromEntries(PEER_SYMS.map(s => [s, medFrom(s, R12)]));
const dr12 = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].pe / MED12[s] - 1) * 100])), dr5 = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].pe / MED5[s] - 1) * 100]));
const sector12 = medOf(USED.map(s => dr12[s])), sector12All = medOf(PEER_SYMS.map(s => dr12[s])), sector5 = medOf(USED.map(s => dr5[s]));
const ownMed12 = medFrom('BELRISE', R12), ownDr12 = P.BELRISE?.pe && ownMed12 ? (P.BELRISE.pe / ownMed12 - 1) * 100 : null;
const k = 1 + sector12 / 100, k5 = 1 + sector5 / 100;
const shortName = s => ({ BELRISE: 'Belrise', UNOMINDA: 'Uno Minda', MOTHERSON: 'Samvardhana Motherson', BOSCHLTD: 'Bosch', SONACOMS: 'Sona BLW', BHARATFORG: 'Bharat Forge', ENDURANCE: 'Endurance', MSUMI: 'Motherson Sumi Wiring', SCHAEFFLER: 'Schaeffler India', TIINDIA: 'Tube Investments', ZFCVINDIA: 'ZF CV Control', GABRIEL: 'Gabriel India' }[s] || s);

// 4) Multiples (derived, nearest half-turn): base = own 12-month forward median x same-window sector move;
//    bull = no sector move; bear = own 25th percentile x sector move
const MULT = { base: half(PE12.med * k), bull: half(PE12.med), bear: half(PE12.p25 * k) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
// EV/EBITDA cross-check: own trailing EV/EBITDA median over the same window x the same move, restated from trailing
// (year to Jun-26) to Sep-28E EBITDA
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= R12 && d <= ASOF && x > 0).map(x => x[1]);
const evMed = medOf(evHist), evP25 = [...evHist].sort((x, y) => x - y)[Math.floor(evHist.length * 0.25)];
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda), rest = ttmEbitda / ebitdaSep28;
const evMULT = { base: half(evMed * k * rest), bull: half(evMed * rest), bear: half(evP25 * k * rest) };

// 5) The pending merger of the two promoter companies (not in the base): FY25 profit Rs112 cr for 4.72 cr new shares
const MG = { pat: 79.3 + 33.0, shares: C.shares.mergerNew / 1e7 };
const patSep = sep(F.pat), epsMerged = (patSep + MG.pat) / (shares + MG.shares), mergerAccretion = (epsMerged / epsSep.base - 1) * 100;
const mergerPe = MG.shares * price / MG.pat; // price paid in Belrise shares at the as-of close
// Like-for-like with the May-2026 street (pre-QIP 88.99 cr shares, merger in): our FY28E PAT less after-tax yield on the
// QIP cash, plus the merged companies' FY25 profit (static) or grown 15% a year to FY28 (high)
const qipIncome = AS.treasuryYield[1] / 100 * 1657.26 * (1 - AS.taxRate[1] / 100);
const lfl28 = { lo: (F.pat[1] - qipIncome + MG.pat) / (88.99 + MG.shares), hi: (F.pat[1] - qipIncome + MG.pat * Math.pow(1.15, 3)) / (88.99 + MG.shares) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp)), sellAbove = Math.round(sellAt(V.tp));
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, patCagrFwd = (Math.pow(F.pat[2] / A.pat[b], 1 / 3) - 1) * 100;
const patCagrHist = (Math.pow(A.pat[b] / A.pat[0], 1 / 4) - 1) * 100, salesCagrHist = (Math.pow(A.sales[b] / A.sales[0], 1 / 4) - 1) * 100;

// Street as it stood on 30-Sep-2026 (latest note per house; Investec and LKP are a year old)
const ST = D.street.brokers.filter(s => !s.superseded), live = ST.filter(s => !s.stale);
const medTp = medOf(live.map(s => s.tp)), medTpAll = medOf(ST.map(s => s.tp)), streetEps28 = 250 / 26;

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, LISTED, R12, n0, n1, n2, pc, pc1, half, medOf, sd, SA, SQ, QL, A26, A25, Q1, b, price, shares, mcap, sep,
  LB, lines, treasury0, ttmOI, mfgShare26, tradeMargin26, fyOf, epsBy, fwdPe, PEL, PE12, PE6, PEH2, PEIPO, FM12, fwdNow, sepNow, trailEps, trough,
  PEER_SYMS, EXCL, USED, PEERS, P, MED5, MED12, dr12, dr5, sector12, sector12All, sector5, ownMed12, ownDr12, k, k5, shortName,
  MULT, epsSep, evMed, evP25, evMULT, ttmEbitda, ebitdaSep28, rest, MG, patSep, epsMerged, mergerAccretion, mergerPe, qipIncome, lfl28,
  BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, patCagrFwd, patCagrHist, salesCagrHist, ST, live, medTp, medTpAll, streetEps28 };

if (require.main === module) {
  console.log('lines', lines.map(r => `${r.y}: mfg ${n0(r.mfg)} tr ${n0(r.trading)} e ${n0(r.ebitda)}`).join(' | '), 'treasury0', n0(treasury0), 'ttmOI', ttmOI);
  console.log('PE12', PE12, 'PEL', PEL.med, 'PEIPO', PEIPO, 'PE6', PE6.med, 'PEH2', PEH2.med, 'FM12', FM12.median, FM12.medianAll, FM12.troughYears, 'trough', trough, 'now', n1(fwdNow), n1(sepNow), 'trail', n2(trailEps));
  console.log('dr12', USED.map(s => `${s} ${n1(dr12[s])}`).join(', '), '| excl', EXCL.map(s => `${s} ${n1(dr12[s])}`).join(', '), '| sector12', n1(sector12), 'all', n1(sector12All), 'sector5', n1(sector5), 'own', ownMed12, ownDr12 && n1(ownDr12));
  console.log('MULT', MULT, 'ev', evMed, evP25, rest.toFixed(3), evMULT, 'epsSep', epsSep, 'tp', V.tp, 'upside', n1(V.upside), rating, 'merger', n2(epsMerged), n1(mergerAccretion), n1(mergerPe), 'medTp', medTp, medTpAll, 'buy<', buyBelow, 'sell>', sellAbove);
}
