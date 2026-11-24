// Meesho initiation: shared context for the Part B files. Loads the research JSONs and the built model and derives the
// marketplace EV/NMV multiple (PLAYBOOK §4 and §7c). Recently listed (10-Dec-2025, 9.7 months before the as-of date):
// the own window skips the listing month (Dec-2025 traded at an IPO premium, up to 1.9x forward NMV) and runs from
// 1-Jan-2026 to 30-Sep-2026 on every daily close: nine months, shorter than the usual 12. The sector move is measured
// over the same window on the internet peers with a usable P/E (Info Edge, IndiaMART; the set ETERNAL.ctx.js fixed).
// As of 30-Sep-2026 (Q1FY27 basis). The build fails if assumptions.json carries multiples other than the derived ones.
const fs = require('fs');
const path = require('path');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'MEESHO', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'MEESHO.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'MEESHO', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios, SO = V.sotp;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2025-12-10', FROM = '2026-01-01', ISSUE = 111;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const r05 = x => Math.round(x * 20) / 20; // EV/NMV rounded to 0.05x (PLAYBOOK §7c)
const medOf = arr => { const s = arr.filter(x => x != null && Number.isFinite(x)).sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), qv = k => SQ.map(q => q[k] ?? null);
const ann = fy => SA.find(a => a.fy === fy), A25 = ann('FY25'), A26 = ann('FY26'), q1 = SQ.at(-1), q1y = SQ[0];
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const MP = F.seg.mp, NI = F.seg.ni, nmvSep = sep(MP.driver), revSep = sep(F.sales);
const part = re => SO.parts.find(p => re.test(p.name)), PM = part(/^Marketplace/), PN = part(/^New/), PC = part(/^Net cash/);
const cashNow = q1.cash, evNow = mcap - cashNow;

// 1) Own EV / one-year-forward NMV on every daily close (EV = diluted market value − company cash balance; next full
//    fiscal year's NMV: FY27E for Jan-Mar 2026, FY28E from Apr-2026, our forecasts as in forwardSeries).
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const nmvBy = { 2026: A26.nmv, 2027: MP.driver[0], 2028: MP.driver[1], 2029: MP.driver[2] };
const cashAt = d => (d >= '2026-07-23' ? q1.cash : A26.cash); // Q1FY27 letter 23-Jul-2026
const px = S.charts.price.Price.filter(([d]) => d >= LISTED && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const fwd = px.map(([d, p]) => [d, Math.round((p * shares - cashAt(d)) / nmvBy[fyOf(d)] * 1000) / 1000]);
const stat = (from, to = '9999') => { const v = fwd.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]); return { med: medOf(v), p25: pct(v, 0.25), p75: pct(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }; };
const OWN = stat(FROM), OWN_ALL = stat(LISTED), OWN_DEC = stat(LISTED, '2025-12-31'), OWN_FY28 = stat('2026-04-01');
const fwdNow = fwd.at(-1)[1];

// 2) Sector move over the same window: P/E at the 30-Sep close (asof-peers) vs each peer's median since 1-Jan-2026
const NET = ['ETERNAL', 'SWIGGY', 'NAUKRI', 'INDIAMART', 'NYKAA', 'PAYTM', 'POLICYBZR'];
const DR_SET = ['NAUKRI', 'INDIAMART']; // as ETERNAL.ctx.js: the only internet peers with a usable P/E history
const PEERS = peersAsOf(['MEESHO', ...NET], ASOF), PR = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const chart = (sym, c, k) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.[c]?.[k] || [];
const medFrom = (sym, from, c = 'pe', k = 'Price to Earning') => { const v = chart(sym, c, k).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]); return v.length ? medOf(v) : null; };
const MEDW = Object.fromEntries(NET.map(s => [s, medFrom(s, FROM)])), MED5 = Object.fromEntries(NET.map(s => [s, medFrom(s, '2021-09-30')]));
const drW = Object.fromEntries(NET.map(s => [s, PR[s]?.pe && MEDW[s] ? (PR[s].pe / MEDW[s] - 1) * 100 : null]));
const dr5 = Object.fromEntries(NET.map(s => [s, PR[s]?.pe && MED5[s] ? (PR[s].pe / MED5[s] - 1) * 100 : null]));
const sectorW = medOf(DR_SET.map(s => drW[s])), sector5 = medOf(DR_SET.map(s => dr5[s])), k = 1 + sectorW / 100;
// sensitivity: market value / sales of all seven platforms vs their own medians over the same window
const msLast = s => { const v = chart(s, 'mcapSales', 'Market Cap to Sales').filter(([d, x]) => d <= ASOF && x > 0); return v.at(-1)?.[1]; };
const drMs = Object.fromEntries(NET.map(s => { const m = medFrom(s, FROM, 'mcapSales', 'Market Cap to Sales'), l = msLast(s); return [s, m && l ? (l / m - 1) * 100 : null]; }));
const sectorMs = medOf(NET.map(s => drMs[s]));

// 3) Multiples (derived): base = own median × same-window sector move; bull = own median (no move); bear = own 25th
//    percentile × the move. Rounded to 0.05x. Sensitivities are shown, never blended.
const MULT = { base: r05(OWN.med * k), bull: r05(OWN.med), bear: r05(OWN.p25 * k) };
const ALT = { withDec: r05(OWN_ALL.med * k), fy28only: r05(OWN_FY28.med * k), five: r05(OWN.med * (1 + sector5 / 100)), ms: r05(OWN.med * (1 + sectorMs / 100)) };
const pm = AS.valuation.parts.find(p => p.seg === 'mp').multiple;
if (['base', 'bull', 'bear'].some(x => pm[x] !== MULT[x])) throw new Error(`MEESHO marketplace multiple not derived: assumptions ${JSON.stringify(pm)} vs derived ${JSON.stringify(MULT)}`);
const impliedX = (evNow - (PN.value)) / nmvSep; // EV/Sep-28E NMV the price implies with new initiatives at our value

// 4) Rating, street
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp)), sellAbove = Math.round(sellAt(V.tp));
const ST = D.street, cur = ST.brokers.filter(b => !b.stale && b.tp), medTp = medOf(cur.map(b => b.tp));
const fromHigh = (price / M.price.high52 - 1) * 100, vsIssue = (price / ISSUE - 1) * 100;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, SO, ASOF, ASOF_TXT, LISTED, FROM, ISSUE, n0, n1, n2, pc, pc1, r05, medOf, pct,
  SA, SQ, QL, qv, A25, A26, q1, q1y, price, shares, mcap, sep, MP, NI, nmvSep, revSep, PM, PN, PC, cashNow, evNow,
  fwd, OWN, OWN_ALL, OWN_DEC, OWN_FY28, fwdNow, NET, DR_SET, PEERS, PR, MEDW, MED5, drW, dr5, sectorW, sector5, k, drMs, sectorMs,
  MULT, ALT, impliedX, rating, buyBelow, sellAbove, ST, cur, medTp, fromHigh, vsIssue, BM, mv };

if (require.main === module) {
  console.log('OWN', OWN, 'ALL', OWN_ALL, 'DEC', OWN_DEC, 'FY28', OWN_FY28, 'now', fwdNow);
  console.log('drW', JSON.stringify(drW), 'sectorW', sectorW.toFixed(2), 'dr5', JSON.stringify(dr5), 'sector5', sector5.toFixed(2), 'drMs', JSON.stringify(drMs), 'sectorMs', sectorMs.toFixed(2));
  console.log('MULT', MULT, 'ALT', ALT, 'impliedX', impliedX.toFixed(2), 'tp', V.tp, 'up', V.upside.toFixed(1), rating, 'medTp', medTp, 'buy<', buyBelow, 'sell>', sellAbove, 'nmvSep', n0(nmvSep));
}
