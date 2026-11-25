// Lemon Tree Hotels initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and the
// built model, checks the two-stream revenue build against the model, and computes the valuation inputs once: own one-year-
// forward EV/EBITDA (EV incl. minorities: market value grossed up by the minority share of profit, plus net debt) and P/E since
// 1-Apr-2022, the hotel sector move on EV/EBITDA (and P/E) over the same window, the SOTP checks. As of 30-Sep-2026 (Q1FY27).
//
// HOTEL PEER SET (set by INDHOTEL.ctx2.js, matched by ITCHOTELS.ctx2.js and EIHOTEL.ctx2.js): INDHOTEL, EIHOTEL, CHALET,
// LEMONTREE, ITCHOTELS. Used here: INDHOTEL, EIHOTEL, ITCHOTELS (three usable peers, so no widening is needed). Excluded:
// LEMONTREE (the company itself) and CHALET (Rs439 cr revenue / Rs163 cr EBITDA from 95 Vivarea flats booked in Q1FY26 sit in
// its trailing EBITDA), as in the three published hotel reports; Chalet is a sensitivity row. ITC Hotels (listed 29-Jan-2025) is
// measured from 1-Apr-2025 as in its own report (listing months skipped); since-listing is a sensitivity row.
// WINDOW: turnaround rule (PLAYBOOK 7c, as IHCL and EIH): EBITDA broke from the Covid trough (FY21 Rs57 cr, FY22 Rs119 cr) to
// Rs448 cr in FY23, so the own window starts 1-Apr-2022 and the peers' move is measured over the same window; since-2021 is a
// sensitivity row.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'LEMONTREE', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'LEMONTREE.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'LEMONTREE', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', WIN = '2022-04-01', WIN5 = '2021-09-30', ITC_WIN = '2025-04-01', ITC_LISTED = '2025-01-29';
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

// Revenue build (assumptions.businessLines.hotel) must equal the model's segment revenue (= consolidated revenue)
const BL = AS.businessLines.hotel, STREAMS = ['owned', 'fees'];
const stream = {}; STREAMS.forEach(k => { let v = BL.base[k]; stream[k] = BL.growth[k].map(g => (v *= 1 + g / 100)); });
const hotelBuild = YRS.map((_, i) => STREAMS.reduce((t, k) => t + stream[k][i], 0));
YRS.forEach((y, i) => { if (Math.abs(hotelBuild[i] / SEG.hotel.revenue[i] - 1) > 0.002) throw new Error(`LEMONTREE build ${y}: ${n0(hotelBuild[i])} != model ${n0(SEG.hotel.revenue[i])}`); });
YRS.forEach((y, i) => { if (Math.abs(SEG.hotel.revenue[i] / F.sales[i] - 1) > 0.001) throw new Error(`LEMONTREE segment ${y} does not equal revenue`); });

// Price and model outputs
const price = M.price.last, sh = F.shares, mcap = price * sh;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const P = V.sotp.parts, VP = AS.valuation.parts, part = re => P[VP.findIndex(p => re.test(p.name))], vpart = re => VP.find(p => re.test(p.name));
const hotelSep28 = sep28('hotel'), netCashSep28 = part(/^Net debt/).value;

// Own one-year-forward history (next full fiscal year, the house convention). EV = market value grossed up for that year's
// minority share of profit + net debt (borrowings incl. leases − cash − investments, last March balance sheet published by then).
const NPs = S.schedules['profit-loss']['Net Profit'];
const mFy = fy => { const p = `Mar ${fy}`, mi = -(NPs['Minority share'][p] || 0), pe = NPs['Profit for EPS'][p]; return !(pe > 0) || !(mi > 0) ? 0 : mi / (pe + mi); };
const ebBy = {}; A.labels.forEach((l, i) => (ebBy[2000 + +l.slice(2)] = A.ebitda[i])); YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ndFy = fy => { const i = A.labels.indexOf('FY' + String(fy).slice(2)); return A.borrowings[i] - (A.cash[i] || 0) - (A.investments[i] || 0); };
const pubFy = d => { let fy = +d.slice(0, 4); if (d < `${fy}-05-30`) fy -= 1; return fy; }; // Lemon Tree files March results in late May
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const troughFy = fy => { const pk = Math.max(...[ebBy[fy - 1], ebBy[fy - 2], ebBy[fy - 3]].filter(v => v != null)); return !(ebBy[fy] > 0) || ebBy[fy] < 0.5 * pk; };
const series = M.price.series.filter(([d]) => d >= '2021-04-01' && d <= ASOF);
const evRow = ([d, p]) => { const fy = fyOf(d), pf = pubFy(d), m = mFy(pf), cap = p * sh; return { d, p, fy, gross: (cap / (1 - m) + ndFy(pf)) / ebBy[fy], plain: (cap + ndFy(pf)) / ebBy[fy], m }; };
const evAll = series.map(evRow).filter(x => !troughFy(x.fy));
const evWin = evAll.filter(x => x.d >= WIN), HEV = stat(evWin.map(x => x.gross)), HEVplain = stat(evWin.map(x => x.plain)), HEV21 = stat(evAll.map(x => x.gross));
const troughEv = [...new Set(series.map(evRow).filter(x => troughFy(x.fy)).map(x => `FY${String(x.fy).slice(2)}`))];
const evNow = evRow(series.at(-1)), HEVy = y => stat(evWin.filter(x => x.d.startsWith(y)).map(x => x.gross));
const fwdEvChart = evAll.map(x => [x.d, Math.round(x.gross * 10) / 10]);

// Forward P/E: attributable EPS before exceptional items (Screener "Profit for PE") for FY23-26, our EPS for FY27-29E
const PPE = NPs['Profit for PE'], epsBei = {}, epsRep = {};
[2023, 2024, 2025, 2026].forEach(fy => { epsBei[fy] = PPE[`Mar ${fy}`] / sh; epsRep[fy] = A.eps[A.labels.indexOf('FY' + String(fy).slice(2))]; });
YRS.forEach((y, i) => { epsBei[2000 + +y.slice(2, 4)] = F.eps[i]; epsRep[2000 + +y.slice(2, 4)] = F.eps[i]; });
const peAll = series.filter(([d]) => d >= WIN).map(([d, p]) => ({ d, bei: p / epsBei[fyOf(d)], rep: p / epsRep[fyOf(d)] }));
const HPE = stat(peAll.map(x => x.bei)), HPErep = stat(peAll.map(x => x.rep)), FM = forwardMedian('LEMONTREE', M);
const peNow = price / F.eps[1];

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, WIN, WIN5, ITC_WIN, ITC_LISTED, n0, n1, pc, pc1, shortDate, SA, SQ, Q1, FY26, ann, b, YRS, yi, SEG, sep28, median, stat, half,
  BL, STREAMS, stream, hotelBuild, price, sh, mcap, BM, mv, P, VP, part, vpart, hotelSep28, netCashSep28,
  mFy, ebBy, ndFy, fyOf, evAll, evWin, HEV, HEVplain, HEV21, troughEv, evNow, HEVy, fwdEvChart, epsBei, epsRep, peAll, HPE, HPErep, FM, peNow };
Object.assign(module.exports, require('./LEMONTREE.ctx2')(module.exports, { peersAsOf, buyAt, sellAt, ratingFor, ruleText }));
