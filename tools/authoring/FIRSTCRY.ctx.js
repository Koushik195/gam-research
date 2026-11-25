// FirstCry (Brainbees Solutions) initiation: shared context for the Part B files. Loads the research JSONs and the built
// model, checks the segment build, and derives the SOTP EV/sales multiple once (PLAYBOOK §4, §7c). As of 30-Sep-2026.
// RECENTLY LISTED (13-Aug-2024). The IPO-premium months (Aug-Oct-2024, when the stock traded at ₹650-700 against a ₹465
// issue price) are skipped. Base window: the last 12 months, 1-Oct-2025 to 30-Sep-2026 (BRIEF: recently listed → 12-month
// window + same-window sector move, HYUNDAI / HDBFS), on every weekly close Screener gives plus the 30-Sep NSE close. The
// since-Dec-2024 window (with its own same-window move) is a sensitivity row.
// OWN MULTIPLE: EV / one-year-forward revenue attributable to FirstCry. EV = fully diluted market value − net cash after
// leases + FirstCry's share of the Globalbees earn-outs (balances as last reported: Mar-25 until the FY26 results on
// 26-May-2026, then Mar-26). Attributable revenue = consolidated revenue − 48.32% of Globalbees revenue (the minorities'
// share), which is exactly how the SOTP applies the multiple (Globalbees at 100% less 48.32%). Forward = next full fiscal
// year: FY27E for Oct-2025 to Mar-2026, FY28E from Apr-2026 (ours).
// SECTOR MOVE (thin peer sets: always in the base): internet platforms with a usable P/E history are only Info Edge and
// IndiaMART, so the base uses the full seven-name internet set on market value ÷ trailing sales at the 30-Sep close vs each
// name's median over the same 12 months (URBANCO method). Sub-sets are sensitivity rows.
const fs = require('fs');
const path = require('path');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'FIRSTCRY', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'FIRSTCRY.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'FIRSTCRY', 'screener.json'), 'utf8'));
const CL = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', '2026-09-30.json'), 'utf8')).closes;
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios, SO = V.sotp;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2024-08-13', FROM = '2025-10-01', FROM_LONG = '2024-12-01', ISSUE = 465;
const NCI = 0.4832, EARN26 = 387.5 * (1 - NCI), EARN25 = 451.4 * (1 - NCI);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const r05 = x => Math.round(x * 20) / 20; // EV/sales to the nearest 0.05x (PLAYBOOK §7c)
const half = x => Math.round(x * 2) / 2;
const medOf = arr => { const s = arr.filter(x => x != null && Number.isFinite(x)).sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SA = SG.annual, SQ = SG.quarterly, Q5 = SQ.slice(-5), QL = Q5.map(q => q.q), qv = k => Q5.map(q => q[k] ?? null);
const ann = fy => SA.find(a => a.fy === fy), A25 = ann('FY25'), A26 = ann('FY26'), q1 = { ...SQ.at(-1), ...C.q1fy27 }, q1y = SQ.at(-5); // Q1FY27: segment table + company facts
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const SEG = F.seg, KEYS = ['imc', 'intl', 'gb', 'oth', 'elim'];
const b = A.labels.length - 1;

// 0) Checks: segment build = model revenue; EBITDA = Σ segments − unallocated − ESOP; diluted shares = 53.24 cr
F.years.forEach((y, i) => {
  const r = KEYS.reduce((t, k) => t + SEG[k].revenue[i], 0), e = KEYS.reduce((t, k) => t + SEG[k].adjEbitda[i], 0) - AS.unallocated[i] - AS.esop[i];
  if (Math.abs(r - F.sales[i]) > 1 || Math.abs(e - F.ebitda[i]) > 1) throw new Error(`FIRSTCRY segment build ${y}`);
});
if (Math.abs(shares - 53.24) > 0.01) throw new Error(`FIRSTCRY shares ${shares}`);
const segM = k => F.years.map((_, i) => SEG[k].adjEbitda[i] / SEG[k].revenue[i] * 100);
const adjE = F.years.map((_, i) => KEYS.reduce((t, k) => t + SEG[k].adjEbitda[i], 0) - AS.unallocated[i]);
const attRev = i => F.sales[i] - NCI * SEG.gb.revenue[i];
const treas0 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - (A.borrowings[b] || 0);

// 1) Own EV / forward attributable revenue on every weekly close since listing
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const revBy = { 2026: { s: A26.revenue, gb: A26.gbRev }, 2027: { s: F.sales[0], gb: SEG.gb.revenue[0] }, 2028: { s: F.sales[1], gb: SEG.gb.revenue[1] } };
const ncAt = d => (d >= '2026-05-26' ? 147.5 - EARN26 : 218.8 - EARN25); // net cash after leases less earn-out share
const px = S.charts.price.Price.filter(([d]) => d >= LISTED && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const fwd = px.map(([d, p]) => { const r = revBy[fyOf(d)]; return [d, Math.round((p * shares - ncAt(d)) / (r.s - NCI * r.gb) * 1000) / 1000, p]; });
const stat = (from, to = '9999') => { const w = fwd.filter(x => x[0] >= from && x[0] <= to), v = w.map(x => x[1]); return { med: medOf(v), p25: pct(v, 0.25), p75: pct(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length, pxMed: medOf(w.map(x => x[2])) }; };
const OWN = stat(FROM), OWN_LONG = stat(FROM_LONG), OWN_ALL = stat(LISTED), OWN_IPO = stat(LISTED, '2024-11-30'), OWN_FY28 = stat('2026-04-01'), OWN_FY27 = stat(FROM, '2026-03-31');
const fwdNow = fwd.at(-1)[1];

// 2) Sector move over the same window: market value / sales at the 30-Sep close vs each name's median since FROM
const NET = D.peers.set, PSUB = D.peers.peSubset, RET = D.peers.retail, RECENT = ['MEESHO', 'URBANCO', 'LENSKART'];
const PEERS = peersAsOf(['FIRSTCRY', ...NET, ...RECENT], ASOF), PR = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const SX = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const moveOf = (s, from, c, k) => {
  const X = SX(s), ser = (X.charts?.[c]?.[k] || []).filter(([d, x]) => d <= ASOF && x > 0), w = X.charts.price.Price.filter(([d]) => d <= ASOF).at(-1)[1];
  const kk = (CL[s] ?? w) / w, last = ser.at(-1)?.[1] * kk, med = medOf(ser.filter(([d]) => d >= from).map(x => x[1]));
  return last && med ? (last / med - 1) * 100 : null;
};
const MS = ['mcapSales', 'Market Cap to Sales'], PE = ['pe', 'Price to Earning'];
const drMs = Object.fromEntries([...NET, ...RECENT].map(s => [s, moveOf(s, FROM, ...MS)]));
const drMsLong = Object.fromEntries(NET.map(s => [s, moveOf(s, FROM_LONG, ...MS)]));
const drPe = Object.fromEntries(NET.map(s => [s, moveOf(s, FROM, ...PE)]));
const drRetPe = Object.fromEntries([...RET, 'VMM'].map(s => [s, moveOf(s, FROM, ...PE)]));
const drRetMs = Object.fromEntries([...RET, 'VMM', 'ABFRL', 'SHOPERSTOP'].map(s => [s, moveOf(s, FROM, ...MS)]));
const sectorMs = medOf(NET.map(s => drMs[s])), k = 1 + sectorMs / 100;
const SENS = { pe2: medOf(PSUB.map(s => drPe[s])), recent: medOf([...NET, ...RECENT].map(s => drMs[s])), retPe: medOf(RET.map(s => drRetPe[s])), retMs: medOf([...RET, 'ABFRL', 'SHOPERSTOP'].map(s => drRetMs[s])), long: medOf(NET.map(s => drMsLong[s])) };

// 3) Multiples (derived): base = own median × same-window move; bull = own median (no move); bear = own 25th pct × move
const MULT = { base: r05(OWN.med * k), bull: r05(OWN.med), bear: r05(OWN.p25 * k) };
const ALT = { none: r05(OWN.med), pe2: r05(OWN.med * (1 + SENS.pe2 / 100)), recent: r05(OWN.med * (1 + SENS.recent / 100)), retPe: r05(OWN.med * (1 + SENS.retPe / 100)), retMs: r05(OWN.med * (1 + SENS.retMs / 100)), long: r05(OWN_LONG.med * (1 + SENS.long / 100)), fy28only: r05(OWN_FY28.med * k) };
for (const p of AS.valuation.parts.filter(x => x.seg && x.multiple && x.multiple.base > 0)) {
  if (['base', 'bull', 'bear'].some(x => p.multiple[x] !== MULT[x])) throw new Error(`FIRSTCRY multiple not derived: ${p.name} ${JSON.stringify(p.multiple)} vs ${JSON.stringify(MULT)} — run: node <scratch>/assum.js ${MULT.base},${MULT.bull},${MULT.bear}`);
}
// Street-implied EV/EBITDA cross-check: JM's May-2026 target EV ÷ its FY28E reported EBITDA, nearest half-turn
const JM = D.street.brokers.find(x => x.parts), jmEv = 140 - JM.parts.cash[0], jmX = jmEv / (JM.est.ebitdaFY28E / 100);
if (AS.valuation.blend.methods.find(m => m.key === 'ev').multiple.base !== half(jmX)) throw new Error(`FIRSTCRY EV/EBITDA cross-check not derived: ${half(jmX)}`);

// 4) Valuation pieces, implied multiple at the price, rating, street
const part = re => SO.parts.find(p => re.test(p.name));
const PI = part(/^India/), PX = part(/^International/), PG = part(/^Globalbees \(/), PO = part(/^Others/), PE2 = part(/^Inter/), PN = part(/minorities/), PEO = part(/earn-outs/i), PC = part(/^Net cash/);
const attSep = sep([0, 1, 2].map(attRev));
const evNow = mcap - (treas0 - EARN26), impliedX = evNow / attSep; // EV/Sep-28E attributable sales the price implies
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp)), sellAbove = Math.round(sellAt(V.tp));
const ST = D.street, cur = ST.brokers.filter(x => x.current && x.tp), medNamed = medOf(cur.map(x => x.tp)), cons = D.consensus.at(-1), medTp = cons.avgTarget;
const vsIssue = (price / ISSUE - 1) * 100;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rent26 = C.fy26.leasePrincipal + C.fy26.leaseInterest;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, SO, ASOF, ASOF_TXT, LISTED, FROM, FROM_LONG, ISSUE, NCI, EARN26, n0, n1, n2, pc, pc1, r05, half, medOf, pct,
  SA, SQ, Q5, QL, qv, A25, A26, q1, q1y, price, shares, mcap, sep, SEG, KEYS, segM, adjE, attRev, treas0, b,
  fwd, OWN, OWN_LONG, OWN_ALL, OWN_IPO, OWN_FY28, OWN_FY27, fwdNow, NET, PSUB, RET, RECENT, PEERS, PR, drMs, drMsLong, drPe, drRetPe, drRetMs, sectorMs, k, SENS,
  MULT, ALT, JM, jmEv, jmX, PI, PX, PG, PO, PE2, PN, PEO, PC, attSep, evNow, impliedX, rating, buyBelow, sellAbove, ST, cur, medNamed, cons, medTp, vsIssue, BM, mv, rent26 };

if (require.main === module) {
  console.log('OWN', OWN, 'LONG', OWN_LONG, 'ALL', OWN_ALL, 'IPO', OWN_IPO, 'FY27', OWN_FY27, 'FY28', OWN_FY28, 'now', fwdNow);
  console.log('drMs', JSON.stringify(Object.fromEntries(Object.entries(drMs).map(([s, v]) => [s, v?.toFixed(1)]))), 'sectorMs', sectorMs.toFixed(2), 'SENS', JSON.stringify(Object.fromEntries(Object.entries(SENS).map(([s, v]) => [s, v?.toFixed(2)]))));
  console.log('MULT', MULT, 'ALT', ALT, 'jmX', jmX.toFixed(2), 'impliedX', impliedX.toFixed(2), 'tp', V.tp, 'up', V.upside.toFixed(1), rating, 'medTp', medTp, 'medNamed', medNamed, 'buy<', buyBelow, 'sell>', sellAbove);
  console.log('parts', SO.parts.map(p => [p.name, Math.round(p.metric), p.mult, Math.round(p.value), Math.round(p.perShare)]), 'methods', BM.map(m => [m.key, Math.round(m.value)]), 'scen', SC.bull.tp, SC.bear.tp, SC.bull.upside, SC.bear.upside);
}
