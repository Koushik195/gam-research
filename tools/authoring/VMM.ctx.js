// Vishal Mega Mart initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks the
// store build (effective area x revenue per sq ft = model revenue) and derives the P/E and EV/EBITDA multiples once
// (house rule, PLAYBOOK §4 and §7c). As of 30-Sep-2026 (Q1FY27 basis).
//
// RECENTLY LISTED (18-Dec-2024; IPO a pure offer for sale at Rs78): own window = the 12 months from 1-Oct-2025 (the
// post-listing / IPO-premium months to Sep-2025 skipped, PLAYBOOK §7c; HYUNDAI, HDBFS, EMCURE precedent). One-year-forward
// P/E on EVERY weekly close (forwardSeries keeps every 5th point: too few for 12 months), plus the 30-Sep close.
// RETAIL PEER SET (set by DMART.ctx.js, matched by TRENT): used DMART, TRENT, METROBRAND, BATAINDIA, PAGEIND; excluded ABFRL
// (loss-making, demerged), SHOPERSTOP (P/E ~258x on near-zero profit). Sector move = median of the used peers' trailing P/E at
// the 30-Sep-2026 close vs their own medians over the SAME 12-month window; the five-year move is a sensitivity row.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'VMM', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json'), AJ = rd('assumptions.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'VMM.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'VMM', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2024-12-18', R12 = '2025-10-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, sa = fy => SA.find(r => r.fy === fy), sq = q => SQ.find(r => r.q === q);
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const Q1 = C.q1fy27, FY26 = C.fy26, OI26 = C.otherIncomeFY26, BS = C.balanceMar26;

// 1) Store build: effective area x revenue per sq ft = model revenue
const BL = AJ.build;
const build = (() => { let close = BL.base.areaClose, rps = BL.base.revenue * 1e7 / (BL.base.areaEff * 1e6), stores = BL.base.stores, prevEff = BL.base.areaEff;
  return F.years.map((y, i) => { const add = BL.netAdds[i] * BL.sqftPerNetStore, eff = close + add * BL.phasing; close += add; stores += BL.netAdds[i];
    rps *= 1 + BL.revPerSqftGrowth[i] / 100; const rev = eff * 1e6 * rps / 1e7, effG = (eff / prevEff - 1) * 100; prevEff = eff;
    return { y, adds: BL.netAdds[i], stores, area: close, eff, effG, rps, rev }; }); })();
build.forEach((r, i) => { if (Math.abs(r.rev / F.sales[i] - 1) > 0.001) throw new Error(`VMM build revenue ${n0(r.rev)} != model ${n0(F.sales[i])} in ${r.y}`); });
const rpsBase = BL.base.revenue * 1e7 / (BL.base.areaEff * 1e6);
AS.otherIncome.forEach((x, i) => { if (Math.abs(F.otherIncome[i] - x) > 0.5) throw new Error('VMM other-income build'); });
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);
const cash26 = BS.cash + BS.otherBank + BS.investments, netCash26 = cash26 - BS.leaseLiabilities;

// 2) Forward P/E on every weekly close: next full fiscal year's EPS (FY26 reported 1.79 on Jun-26 shares, then ours)
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsBy = { 2026: A.eps[b] }; F.years.forEach((y, i) => { epsBy[2000 + +y.slice(2, 4)] = F.eps[i]; });
const px = S.charts.price.Price.filter(([d]) => d >= LISTED && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const fwdPe = px.map(([d, p]) => [d, Math.round(p / epsBy[fyOf(d)] * 10) / 10]);
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]); return { med: medOf(v), p25: pct(v, 0.25), p75: pct(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }; };
const PE12 = stat(fwdPe, R12), PEL = stat(fwdPe, LISTED), PEH1 = stat(fwdPe, R12, '2026-03-31'), PEH2 = stat(fwdPe, '2026-04-01'), PEIPO = stat(fwdPe, LISTED, '2025-09-30');
const FM12 = forwardMedian('VMM', M, { from: R12 }), FML = forwardMedian('VMM', M, { from: LISTED }); // house function (every 5th week)
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps), trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;
const pxAt = d => { const s = px.filter(([x]) => x <= d); return s[s.length - 1][1]; };
const hi12 = Math.max(...px.filter(([d]) => d >= R12).map(x => x[1])), lo12 = Math.min(...px.filter(([d]) => d >= R12).map(x => x[1]));

// 3) Sector move: retail peers' trailing P/E at the 30-Sep close vs their own medians over the same 12 months (base) and five years
const PEER_SYMS = D.peers.set, EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const PEERS = peersAsOf(['VMM', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const peSeries = sym => (JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.pe?.['Price to Earning'] || []);
const medFrom = (sym, from) => medOf(peSeries(sym).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const ALL = ['VMM', ...PEER_SYMS];
const MED12 = Object.fromEntries(ALL.map(s => [s, medFrom(s, R12)])), MED5 = Object.fromEntries(ALL.map(s => [s, medFrom(s, '2021-09-30')]));
const dr = (m, s) => (P[s]?.pe && m[s] ? (P[s].pe / m[s] - 1) * 100 : null);
const dr12 = Object.fromEntries(ALL.map(s => [s, dr(MED12, s)])), dr5 = Object.fromEntries(ALL.map(s => [s, dr(MED5, s)]));
const sector12 = medOf(USED.map(s => dr12[s])), sector5 = medOf(USED.map(s => dr5[s]));
const sens = { exDmart: medOf(USED.filter(s => s !== 'DMART').map(s => dr12[s])), exTrent: medOf(USED.filter(s => s !== 'TRENT').map(s => dr12[s])),
  exPage: medOf(USED.filter(s => s !== 'PAGEIND').map(s => dr12[s])), grocery: dr12.DMART };
const k = 1 + sector12 / 100, k5 = 1 + sector5 / 100;
const shortName = s => ({ VMM: 'Vishal Mega Mart', DMART: 'DMart', TRENT: 'Trent', METROBRAND: 'Metro Brands', BATAINDIA: 'Bata India', PAGEIND: 'Page Industries', ABFRL: 'Aditya Birla Fashion', SHOPERSTOP: 'Shoppers Stop' }[s] || s);

// 4) Multiples (derived, nearest half-turn): base = own 12-month forward median x same-window sector move; bull = no move;
//    bear = own 25th percentile x the move. EV/EBITDA cross-check on the own trailing EV/EBITDA median over the same window,
//    restated from Screener's trailing EBITDA at the as-of date to our Sep-28E EBITDA.
const MULT = { base: half(PE12.med * k), bull: half(PE12.med), bear: half(PE12.p25 * k) };
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= R12 && d <= ASOF && x > 0).map(x => x[1]);
const evMed = medOf(evHist), evP25 = pct(evHist, 0.25);
const scrEbitda = (S.charts.evEbitda.EBITDA || []).filter(([d]) => d <= ASOF).at(-1)[1]; // Screener trailing EBITDA (incl. other income) at the as-of date
const ebitdaSep28 = sep(F.ebitda), evConv = scrEbitda / ebitdaSep28, ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);
const evMULT = { base: half(evMed * k * evConv), bull: half(evMed * evConv), bear: half(evP25 * k * evConv) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp)), sellAbove = Math.round(sellAt(V.tp));
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100;

// Street as it stood on 30-Sep-2026 (post-Q1 notes with a dated, named target, 23-Jul to 25-Sep-2026)
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-07' && s.tp && !s.pre);
const medTp = medOf(postQ1.map(s => s.tp));

module.exports = { ROOT, RD, C, D, SG, AJ, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, LISTED, R12, n0, n1, n2, pc, pc1, half, pct, medOf, shortDate, SA, SQ, sa, sq, b, price, shares, mcap, sep,
  Q1, FY26, OI26, BS, BL, build, rpsBase, ttmOI, cash26, netCash26, fyOf, epsBy, fwdPe, PE12, PEL, PEH1, PEH2, PEIPO, FM12, FML, fwdNow, sepNow, trailEps, trailPe, pxAt, hi12, lo12,
  PEER_SYMS, EXCL, USED, PEERS, P, MED12, MED5, dr12, dr5, sector12, sector5, sens, k, k5, shortName,
  MULT, evMed, evP25, evMULT, evConv, scrEbitda, ebitdaSep28, ttmEbitda, epsSep, BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, ST, postQ1, medTp };

if (require.main === module) {
  console.log('build', build.map(r => [r.y, r.stores, n2(r.area), n2(r.eff), n1(r.effG), Math.round(r.rps), Math.round(r.rev)]));
  console.log('PE12', PE12, 'house12', FM12.median, 'PEL', PEL, 'houseL', FML.median, 'IPO months', PEIPO, 'H1', PEH1.med, 'H2', PEH2.med, 'fwdNow', n1(fwdNow), 'sepNow', n1(sepNow), 'trail', n1(trailPe));
  console.log('dr12', ALL.map(s => `${s} ${P[s]?.pe}/${MED12[s]} ${dr12[s]?.toFixed(1)}`).join(', '), '| sector12', sector12.toFixed(2), 'sector5', sector5.toFixed(2), 'sens', JSON.stringify(sens));
  console.log('dr5', ALL.map(s => `${s} ${MED5[s]} ${dr5[s]?.toFixed(1)}`).join(', '));
  console.log('MULT', MULT, 'ev', evMed, evP25, n2(evConv), evMULT, 'scrEbitda', scrEbitda, 'epsSep', epsSep, 'tp', V.tp, 'upside', V.upside.toFixed(1), rating, 'medTp', medTp, 'buy/sell', buyBelow, sellAbove);
  console.log('methods', BM.map(m => [m.key, Math.round(m.value)]), 'eps', F.eps.map(n2), 'scen', SC.bull.tp, SC.bear.tp, 'dcf', V.tp, 'hi/lo12', hi12, lo12, 'ttmOI', ttmOI);
}
