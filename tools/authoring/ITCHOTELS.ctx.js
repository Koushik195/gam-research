// ITC Hotels initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and the built
// model, checks the hotel revenue build against the model, and computes the valuation inputs once: own one-year-forward hotel
// EV/EBITDA and P/E since 1-Apr-2025, the hotel sector move on EV/EBITDA (and P/E) over the same window, the SOTP checks.
// As of 30-Sep-2026 (Q1FY27).
//
// HOTEL PEER SET (set by INDHOTEL.ctx2.js): INDHOTEL, EIHOTEL, CHALET, LEMONTREE, ITCHOTELS. Used here: INDHOTEL, EIHOTEL,
// LEMONTREE (three peers). Excluded: ITCHOTELS (the company itself) and CHALET (Rs439 cr revenue / Rs163 cr EBITDA from 95
// Vivarea flats booked in Q1FY26 sit in its trailing EBITDA, so its trailing multiple understates the hotel multiple), as in
// IHCL's report; Chalet is shown as a sensitivity row.
// WINDOW: listed 29-Jan-2025 after the demerger from ITC (effective 1-Jan-2025); there is no pre-demerger price history.
// Recently-listed rule (PLAYBOOK §7c): the own window skips the listing months (Feb-Mar 2025: the post-listing exit of
// index funds and ITC holders who did not want a hotel stock, before the first stand-alone annual results) and starts on
// 1-Apr-2025; the peers' move is measured over the same window. Since-listing and five-year variants are sensitivity rows.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ITCHOTELS', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ITCHOTELS.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2025-01-29', WIN = '2025-04-01', WIN5 = '2021-09-30';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, Q1 = C.q1fy27, FY26 = C.fy26, ann = fy => SA.find(a => a.fy === fy);
const b = A.labels.length - 1, YRS = F.years, yi = y => YRS.indexOf(y);
const SEG = F.seg, sep28 = k => (SEG[k].adjEbitda[yi('FY28E')] + SEG[k].adjEbitda[yi('FY29E')]) / 2;
const median = a => { const v = a.slice().sort((x, y) => x - y), k = v.length; return k % 2 ? v[(k - 1) / 2] : (v[k / 2 - 1] + v[k / 2]) / 2; };
const stat = arr => { const v = arr.slice().sort((a, c) => a - c); return { med: median(v), p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const half = v => Math.round(v * 2) / 2;

// Hotel revenue build (assumptions.businessLines.hotel) must equal the model's hotel segment revenue
const BL = AS.businessLines.hotel, STREAMS = ['room', 'fnb', 'fees', 'others'];
const stream = {}; STREAMS.forEach(k => { let v = BL.base[k]; stream[k] = BL.growth[k].map(g => (v *= 1 + g / 100)); });
const hotelBuild = YRS.map((_, i) => STREAMS.reduce((t, k) => t + stream[k][i], 0));
YRS.forEach((y, i) => { if (Math.abs(hotelBuild[i] / SEG.hotel.revenue[i] - 1) > 0.002) throw new Error(`ITCHOTELS hotel build ${y}: ${n0(hotelBuild[i])} != model ${n0(SEG.hotel.revenue[i])}`); });
YRS.forEach((y, i) => { if (Math.abs((SEG.hotel.revenue[i] + SEG.re.revenue[i]) / F.sales[i] - 1) > 0.001) throw new Error(`ITCHOTELS segments ${y} do not sum to revenue`); });
const feeShare = YRS.map((_, i) => stream.fees[i] / hotelBuild[i] * 100);

// Price and model outputs
const price = M.price.last, sh = F.shares, mcap = price * sh;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const P = V.sotp.parts, VP = AS.valuation.parts, part = re => P[VP.findIndex(p => re.test(p.name))], vpart = re => VP.find(p => re.test(p.name));
const hotelSep28 = sep28('hotel'), reSep28 = sep28('re'), ebitdaSep28 = hotelSep28 + reSep28, netCashSep28 = part(/^Net cash/).value;
const INV = C.treasury.inventorySapphire.mar26, INV_DISC = { base: 0.8, bull: 0.9, bear: 0.7 };
['base', 'bull', 'bear'].forEach(k => { if (Math.abs(vpart(/^Sapphire/).adj[k] - INV * INV_DISC[k]) > 1) throw new Error(`ITCHOTELS Sapphire value (${k}) out of line`); });

// Own one-year-forward history (next full fiscal year, the house convention). EV = market value − net cash (cash, investments and
// long deposits less leases, at the last March balance sheet published by then) − Sapphire inventory at 80% of book (as in the SOTP);
// hotel EBITDA ex-real estate (FY26 actual, FY27E-28E ours). Consolidated EV/EBITDA and P/E alongside.
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const NC = { 2025: { cash: 1654 + 676 + 7.21 - 73, inv: 1241, from: '2025-01-01' }, 2026: { cash: 765 + 1956 + 528.5 - 74, inv: INV, from: '2026-05-15' } };
const ncAt = d => (d >= NC[2026].from ? NC[2026] : NC[2025]); // FY26 accounts published 15-May-2026; the demerged company's first accounts (Mar-25) in May-2025
const hotelBy = { 2026: ann('FY26').hotelEbitda }, consBy = { 2026: ann('FY26').consEbitda }, epsBy = { 2026: A.eps[b] };
YRS.forEach((y, i) => { const fy = 2000 + +y.slice(2, 4); hotelBy[fy] = SEG.hotel.adjEbitda[i]; consBy[fy] = F.ebitda[i]; epsBy[fy] = F.eps[i]; });
const series = M.price.series.filter(([d]) => d >= LISTED && d <= ASOF);
const row = ([d, p]) => { const fy = fyOf(d), n = ncAt(d), cap = p * sh; return { d, p, fy, hot: (cap - n.cash - INV_DISC.base * n.inv) / hotelBy[fy], cons: (cap - n.cash) / consBy[fy], pe: p / epsBy[fy] }; };
const all = series.map(row), win = all.filter(x => x.d >= WIN);
const HEV = stat(win.map(x => x.hot)), HEVcons = stat(win.map(x => x.cons)), HEVlist = stat(all.map(x => x.hot)), HPE = stat(win.map(x => x.pe)), HPElist = stat(all.map(x => x.pe));
const evNow = all.at(-1), HEVy = (a, z) => stat(win.filter(x => x.d >= a && x.d <= z).map(x => x.hot));
const fwdEvChart = all.map(x => [x.d, Math.round(x.hot * 10) / 10]);
const FM = forwardMedian('ITCHOTELS', M, { from: WIN });
const peNow = price / F.eps[1];

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, LISTED, WIN, WIN5, n0, n1, pc, pc1, shortDate, SA, SQ, Q1, FY26, ann, b, YRS, yi, SEG, sep28, median, stat, half,
  BL, STREAMS, stream, hotelBuild, feeShare, price, sh, mcap, BM, mv, P, VP, part, vpart, hotelSep28, reSep28, ebitdaSep28, netCashSep28, INV, INV_DISC,
  fyOf, NC, ncAt, hotelBy, consBy, epsBy, all, win, HEV, HEVcons, HEVlist, HPE, HPElist, evNow, HEVy, fwdEvChart, FM, peNow };
Object.assign(module.exports, require('./ITCHOTELS.ctx2')(module.exports, { peersAsOf, buyAt, sellAt, ratingFor, ruleText }));
