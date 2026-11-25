// Urban Company initiation: shared context for the Part B files. Loads the research JSONs and the built model and derives
// the core EV/NTV multiple and the InstaHelp PV factor (PLAYBOOK §4, §7c). As of 30-Sep-2026 (Q1FY27 basis).
// RECENTLY LISTED (17-Sep-2025, 12.5 months before the as-of date). The own window skips the IPO-premium months: the listing
// month (Sep-2025: 4.4-5.0x forward core NTV, peak ₹201) and October (3.8-4.6x), when the stock was still settling, until the
// 30-day anchor lock-in expiry (16-Oct), the first broker initiations (23-Oct) and the first results as a listed company
// (1-Nov-2025). It runs 1-Nov-2025 to 30-Sep-2026 on every daily close: 11 months, a little shorter than 12 (MEESHO/TENNIND
// precedent); the 12-month and since-listing medians are sensitivity rows.
// SECTOR MOVE (BRIEF "Thin peer sets": always in the base). Internet platforms with a usable P/E history: only Info Edge and
// IndiaMART (ETERNAL.ctx.js), fewer than three. We widen to the full seven-name internet set on the analogue of our own
// multiple (market value ÷ trailing sales, Screener series, scaled to the 30-Sep close as asof-peers.js does) vs each name's
// median over the same window. MEESHO excluded (listed 10-Dec-2025, inside the window). Two-name P/E move and no move are
// sensitivity rows. The build fails if assumptions.json carries multiples other than the derived ones.
const fs = require('fs');
const path = require('path');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'URBANCO', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'URBANCO.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'URBANCO', 'screener.json'), 'utf8'));
const CL = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', '2026-09-30.json'), 'utf8')).closes;
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios, SO = V.sotp;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2025-09-17', FROM = '2025-11-01', FROM12 = '2025-10-01', ISSUE = 103;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const r05 = x => Math.round(x * 20) / 20; // EV/NTV to the nearest 0.05x (PLAYBOOK §7c)
const r1 = x => Math.round(x * 10) / 10;
const medOf = arr => { const s = arr.filter(x => x != null && Number.isFinite(x)).sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SA = SG.annual, SQ = SG.quarterly, Q5 = SQ.slice(-5), QL = Q5.map(q => q.q), qv = k => Q5.map(q => q[k] ?? null);
const ann = fy => SA.find(a => a.fy === fy), A24 = ann('FY24'), A25 = ann('FY25'), A26 = ann('FY26'), q1 = SQ.at(-1), q1y = SQ.at(-5);
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const SEG = F.seg, CORE = ['ics', 'intl', 'native'];
const coreNtv = i => CORE.reduce((t, k) => t + SEG[k].driver[i], 0), coreSep = sep([0, 1, 2].map(coreNtv));
const part = re => SO.parts.find(p => re.test(p.name)), PI = part(/^India/), PX = part(/^International/), PN = part(/^Native/), PH = part(/^InstaHelp/), PC = part(/^Net cash/);
const LEASE = 136, netCashNow = q1.cash - LEASE, evNow = mcap - netCashNow;

// 1) Own EV / one-year-forward core NTV on every daily close. EV = fully diluted market value − (company cash − lease
//    liabilities), cash as last reported (Sep-25 balance from listing, then each results date). Forward = next full fiscal
//    year's core NTV: FY27E for Nov-2025 to Mar-2026, FY28E from Apr-2026 (our forecasts, as forwardSeries does).
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const ntvBy = { 2027: coreNtv(0), 2028: coreNtv(1), 2029: coreNtv(2) };
const cashAt = d => (d >= '2026-07-31' ? 2019 : d >= '2026-05-08' ? 2021 : d >= '2026-01-23' ? 2095 : 2136) - LEASE;
const px = S.charts.price.Price.filter(([d]) => d >= LISTED && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const fwd = px.map(([d, p]) => [d, Math.round((p * shares - cashAt(d)) / ntvBy[fyOf(d)] * 1000) / 1000]);
const stat = (from, to = '9999') => { const v = fwd.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]); return { med: medOf(v), p25: pct(v, 0.25), p75: pct(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }; };
const OWN = stat(FROM), OWN12 = stat(FROM12), OWN_ALL = stat(LISTED), OWN_SEP = stat(LISTED, '2025-09-30'), OWN_OCT = stat('2025-10-01', '2025-10-31'), OWN_FY28 = stat('2026-04-01');
const fwdNow = fwd.at(-1)[1];

// 2) Sector move, same window: market value / sales at the 30-Sep close vs each peer's median since 1-Nov-2025
const NET = D.peers.set, PSUB = D.peers.peSubset;
const PEERS = peersAsOf(['URBANCO', ...NET, 'MEESHO'], ASOF), PR = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const SX = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const moveOf = (s, from, c, k) => {
  const X = SX(s), ser = (X.charts?.[c]?.[k] || []).filter(([d, x]) => d <= ASOF && x > 0), w = X.charts.price.Price.filter(([d]) => d <= ASOF).at(-1)[1];
  const kk = (CL[s] ?? w) / w, last = ser.at(-1)?.[1] * kk, med = medOf(ser.filter(([d]) => d >= from).map(x => x[1]));
  return last && med ? (last / med - 1) * 100 : null;
};
const drMs = Object.fromEntries([...NET, 'MEESHO'].map(s => [s, moveOf(s, FROM, 'mcapSales', 'Market Cap to Sales')]));
const drPe = Object.fromEntries(NET.map(s => [s, moveOf(s, FROM, 'pe', 'Price to Earning')]));
const drMs12 = Object.fromEntries(NET.map(s => [s, moveOf(s, FROM12, 'mcapSales', 'Market Cap to Sales')]));
const sectorMs = medOf(NET.map(s => drMs[s])), sectorPe = medOf(PSUB.map(s => drPe[s])), sectorMs12 = medOf(NET.map(s => drMs12[s]));
const sectorMsM = medOf([...NET, 'MEESHO'].map(s => drMs[s])), k = 1 + sectorMs / 100;

// 3) Multiples (derived): base = own median × same-window sector move; bull = own median (no move); bear = own 25th
//    percentile × the move. Sensitivities are shown, never blended.
const MULT = { base: r05(OWN.med * k), bull: r05(OWN.med), bear: r05(OWN.p25 * k) };
const ALT = { twelve: r05(OWN12.med * (1 + sectorMs12 / 100)), all: r05(OWN_ALL.med * k), fy28only: r05(OWN_FY28.med * k), pe2: r05(OWN.med * (1 + sectorPe / 100)), withMeesho: r05(OWN.med * (1 + sectorMsM / 100)) };
for (const p of [PI, PX, PN]) { const a = AS.valuation.parts.find(x => x.name === p.name).multiple; if (['base', 'bull', 'bear'].some(x => a[x] !== MULT[x])) throw new Error(`URBANCO core multiple not derived: ${p.name} ${JSON.stringify(a)} vs ${JSON.stringify(MULT)}`); }

// 4) InstaHelp: PV at Mar-27 of the losses still to fund (mid-year discounting at the cost of equity), as a factor on FY28E
const ke = V.ke, ih = SEG.ih.adjEbitda.map(x => -x);
const pvf = path_ => path_.reduce((t, x, j) => t + x / Math.pow(1 + ke / 100, j + 0.5), 0) / path_[0];
const IH_PATH = { base: [ih[1], ih[2], 250, 100], bull: [ih[1], 300, 100], bear: [ih[1], ih[1], ih[1], ih[1], ih[1]] };
const IHF = Object.fromEntries(Object.entries(IH_PATH).map(([kk, p]) => [kk, r1(pvf(p))]));
const ihA = AS.valuation.parts.find(x => x.seg === 'ih').multiple;
if (['base', 'bull', 'bear'].some(x => ihA[x] !== IHF[x])) throw new Error(`URBANCO InstaHelp factor not derived: ${JSON.stringify(ihA)} vs ${JSON.stringify(IHF)}`);
const ihPvBase = -PH.value;

// 5) Implied multiple at the price, rating, street
const impliedX = (evNow + ihPvBase) / coreSep; // EV/Sep-28E core NTV the price implies with InstaHelp at our value
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp)), sellAbove = Math.round(sellAt(V.tp));
const ST = D.street, cur = ST.brokers.filter(b => !b.stale && b.tp), medTp = medOf(cur.map(b => b.tp));
const vsIssue = (price / ISSUE - 1) * 100;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const ntvG = (k_, i) => (SEG[k_].driver[i] / (i ? SEG[k_].driver[i - 1] : AS.segments.find(s => s.key === k_).base) - 1) * 100;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, SO, ASOF, ASOF_TXT, LISTED, FROM, FROM12, ISSUE, n0, n1, n2, pc, pc1, r05, medOf, pct,
  SA, SQ, Q5, QL, qv, A24, A25, A26, q1, q1y, price, shares, mcap, sep, SEG, CORE, coreNtv, coreSep, PI, PX, PN, PH, PC, LEASE, netCashNow, evNow,
  fwd, OWN, OWN12, OWN_ALL, OWN_SEP, OWN_OCT, OWN_FY28, fwdNow, NET, PSUB, PEERS, PR, drMs, drPe, drMs12, sectorMs, sectorPe, sectorMs12, sectorMsM, k,
  MULT, ALT, ke, IH_PATH, IHF, ihPvBase, impliedX, rating, buyBelow, sellAbove, ST, cur, medTp, vsIssue, BM, mv, ntvG };

if (require.main === module) {
  console.log('OWN', OWN, '12m', OWN12, 'ALL', OWN_ALL, 'SEP', OWN_SEP, 'OCT', OWN_OCT, 'FY28', OWN_FY28, 'now', fwdNow);
  console.log('drMs', JSON.stringify(drMs), 'sectorMs', sectorMs.toFixed(2), 'drPe', JSON.stringify(drPe), 'sectorPe', sectorPe.toFixed(2), 'ms12', sectorMs12.toFixed(2), 'withMeesho', sectorMsM.toFixed(2));
  console.log('MULT', MULT, 'ALT', ALT, 'IHF', IHF, 'ihPv', n0(ihPvBase), 'impliedX', impliedX.toFixed(2), 'tp', V.tp, 'up', V.upside.toFixed(1), rating, 'medTp', medTp, 'buy<', buyBelow, 'sell>', sellAbove, 'coreSep', n0(coreSep));
}
