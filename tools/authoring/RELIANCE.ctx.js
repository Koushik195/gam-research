// Reliance Industries initiation: shared context for the Part B files. Loads the research JSONs, the built model and the
// valuation derivations (RELIANCE.val.js), checks the segment bridge, and computes sensitivities and our own DCF once.
const fs = require('fs');
const path = require('path');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { forwardMedian } = require('./valuation-blend');
const VAL = require('./RELIANCE.val');
const SY = require('./RELIANCE.sync');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'RELIANCE', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'RELIANCE.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const lk = v => `₹${(v / 1e5).toFixed(2)} lakh cr`;
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const { medOf, half } = VAL;
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), yr = fy => SA.find(a => a.fy === fy);
const A26 = yr('FY26'), A25 = yr('FY25'), Q1 = C.q1fy27;
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = half FY28E + half FY29E
const seg = k => F.seg[k];
const KEYS = ['o2c', 'ep', 'jio', 'ret', 'oth'];
const SEGNAME = { o2c: 'O2C', ep: 'Oil & gas', jio: 'Jio (Digital)', ret: 'Retail', oth: 'Others' };

// 1) bridge: segments (company basis) - other income in company EBITDA = model (Screener) EBITDA
const coEbitda = F.years.map((_, i) => KEYS.reduce((s, k) => s + seg(k).adjEbitda[i], 0));
F.years.forEach((y, i) => { if (Math.abs(coEbitda[i] - AS.unallocated[i] - F.ebitda[i]) > 1) throw new Error(`RELIANCE EBITDA bridge ${y}`); });
const grossRev = F.years.map((_, i) => KEYS.reduce((s, k) => s + seg(k).revenue[i], 0));

// 2) SOTP pieces and sensitivities
const SP = V.sotp.parts, part = re => SP.find(p => re.test(p.name)), val = re => part(re).value;
const E = Object.fromEntries(['o2c', 'ep', 'jio', 'ret'].map(k => [k, sep(seg(k).adjEbitda)]));
const MULT = Object.fromEntries(['o2c', 'ep', 'jio', 'ret'].map(k => [k, AS.valuation.parts.find(p => p.seg === k && p.multiple.base > 0).multiple]));
const varying = [/^Oil to Chemicals/, /^Oil and Gas/, /^Jio Platforms/, /33\.57% of Jio/, /^Retail/, /16\.44% of Reliance Retail/];
const FIXED = SP.filter(p => !varying.some(re => re.test(p.name))).reduce((s, p) => s + p.value, 0) + part(/33\.57% of Jio/).adj;
const NE = val(/^New Energy/);
const sotpAt = ({ o2c = MULT.o2c.base, ep = MULT.ep.base, jio = MULT.jio.base, ret = MULT.ret.base, jioDisc = 0, ne = 1 } = {}) => {
  const jioAttr = E.jio * jio * (1 - SY.JIO_OUT) + part(/33\.57% of Jio/).adj;
  return Math.round((E.o2c * o2c + E.ep * ep + jioAttr * (1 - jioDisc) - part(/33\.57% of Jio/).adj + E.ret * ret * (1 - SY.RET_OUT) + FIXED + NE * (ne - 1)) / shares);
};
const netClaims = ['net debt at Sep-27E', 'investments at book', 'lease liabilities', 'spectrum deferred'].reduce((s, t) => s + SP.find(p => p.name.includes(t)).value, 0);
const B = SY.bridge(M, AS);

// 3) own DCF: the engine's FCFF rows without its working-capital release (RIL's 'other liabilities' include minority
// interest, deferred tax and spectrum dues, so the engine's -42.6% of sales would 'release' cash as crude lifts revenue)
const ke = V.ke, w = V.wacc / 100, g = V.terminalGrowth / 100;
const dcfRows = V.rows.map((r, k) => { const dWc = F.owcPct / 100 * r.sales * (r.growth / (100 + r.growth)); return { ...r, dWc, fcffOwn: r.fcff + dWc, discK: 1 / Math.pow(1 + w, k + 0.5) }; });
const dcfClaims = -B.mar27 + SY.INV_BOOK - SY.LEASES - SY.DPL;
const dcfAt = (ww, gg) => { const pv = dcfRows.reduce((s, r, k) => s + r.fcffOwn / Math.pow(1 + ww, k + 0.5), 0); const tv = dcfRows.at(-1).fcffOwn * (1 + gg) / (ww - gg) / Math.pow(1 + ww, dcfRows.length); return { pv, tv, ev: pv + tv, eq: pv + tv + dcfClaims, ps: (pv + tv + dcfClaims) / shares * Math.pow(1 + ke / 100, 0.5) }; };
const DCF = dcfAt(w, g), dcfTp = Math.round(DCF.ps / 10) * 10;
const dcfSens = { ws: [-1, -0.5, 0, 0.5, 1].map(x => V.wacc + x), gs: [-1, -0.5, 0, 0.5, 1].map(x => V.terminalGrowth + x) };
dcfSens.grid = dcfSens.ws.map(ww => dcfSens.gs.map(gg => Math.round(dcfAt(ww / 100, gg / 100).ps / 10) * 10));

// 4) own P/E history (cross-check) and rating
const FM = forwardMedian('RELIANCE', M), peM = AS.valuation.blend.methods.find(m => m.key === 'pe').multiple;
const mv = key => V.blend.methods.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const impliedPe = V.tp / sep(F.eps), impliedEv = (V.tp * shares + B.sep27) / sep(F.ebitda);

// 5) street as it stood on 30-Sep-2026
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-07-17' && s.tp), medTp = medOf(postQ1.map(s => s.tp)), medAll = medOf(ST.map(s => s.tp));
const streetAt = { 'Motilal Oswal': sotpAt({ o2c: 7.5, ep: 5, jio: 11.5, ret: 28, jioDisc: 0.25, ne: 174 * shares / NE }), 'Emkay Global': sotpAt({ o2c: 7, ep: 6, jio: 12, ret: 27, ne: 2 }), 'BOB Capital Markets': sotpAt({ o2c: 6, ep: 4.5, jio: 12, ret: 35 }) };
const SM = VAL.streetMed;
const streetMult = sotpAt({ o2c: SM('o2c'), ep: SM('ep'), jio: SM('jio'), ret: SM('ret') });

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, lk, shortDate, medOf, half, SA, SQ, QL, yr, A26, A25, Q1, price, shares, mcap, sep, seg, KEYS, SEGNAME,
  coEbitda, grossRev, SP, part, val, E, MULT, FIXED, NE, sotpAt, netClaims, B, VAL, SY, dcfRows, dcfClaims, DCF, dcfTp, dcfSens, ke, FM, peM, mv, rating, buyBelow, sellAbove, impliedPe, impliedEv,
  ST, postQ1, medTp, medAll, streetAt, streetMult };

if (require.main === module) {
  console.log('tp', V.tp, rating, 'upside', n1(V.upside), 'bull/bear', SC.bull.tp, SC.bear.tp, 'E', JSON.stringify(Object.fromEntries(Object.entries(E).map(([k, v]) => [k, Math.round(v)]))));
  console.log('check sotpAt base', sotpAt(), 'vs', Math.round(V.sotp.equity / shares), 'streetMult', streetMult, 'streetAt', JSON.stringify(streetAt));
  console.log('DCF', dcfTp, 'pv', n0(DCF.pv), 'tv', n0(DCF.tv), 'claims', n0(dcfClaims), 'FM', FM.median?.toFixed(1), FM.medianAll?.toFixed(1), FM.troughYears, 'PE', mv('pe').value.toFixed(0));
  console.log('medTp', medTp, 'n', postQ1.length, 'medAll', medAll, 'buyBelow', buyBelow, 'sellAbove', sellAbove, 'impliedPe', n1(impliedPe), 'impliedEv', n1(impliedEv), 'netClaims', n0(netClaims));
}
