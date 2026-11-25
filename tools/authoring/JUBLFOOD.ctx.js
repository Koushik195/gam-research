// Jubilant FoodWorks initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks
// the India build (Domino's stores x revenue per store + emerging brands), the capex and rent builds, and derives the
// EV/EBITDA (primary, SOTP with minorities) and P/E (cross-check) multiples once (PLAYBOOK §4 and §7c). As of 30-Sep-2026.
//
// QSR PEER SET (first QSR report of the consumer-services batch; DEVYANI and SAPPHIRE should match it):
//   WESTLIFE, DEVYANI, SAPPHIRE, RBA on EV/EBITDA (Screener, trailing, leases in EV) at the 30-Sep-2026 close vs five-year
//   medians (Oct-2021 to Sep-2026). Used: WESTLIFE, DEVYANI, SAPPHIRE (EBITDA positive throughout; net profits tiny or
//   negative, so no usable P/E). Excluded: RBA (EBITDA negative Oct-2021 to May-2022: no complete five-year median;
//   sensitivity row). JUBLFOOD itself excluded. P/E cross-check uses the retail set of DMART.ctx.js (QSR P/Es meaningless).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'JUBLFOOD', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'JUBLFOOD.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'JUBLFOOD', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', WIN = '2021-04-01', WIN5 = '2021-09-30';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const stat = arr => { const v = [...arr].sort((a, c) => a - c); return { med: medOf(v), p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const SA = SG.annual, SQ = SG.quarterly, sa = fy => SA.find(r => r.fy === fy), b = A.labels.length - 1, YRS = F.years, yi = y => YRS.indexOf(y);
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const Q1 = C.q1fy27, FY26 = C.fy26, CO = FY26.consolidated, f26 = sa('FY26'), f25 = sa('FY25');

// 1) Segment and India builds: India + International = model revenue and EBITDA; Domino's stores x revenue per store + emerging = India
const SEG = F.seg, segM = k => YRS.map((_, i) => SEG[k].adjEbitda[i] / SEG[k].revenue[i] * 100);
YRS.forEach((y, i) => { if (Math.abs(SEG.india.revenue[i] + SEG.intl.revenue[i] - F.sales[i]) > 1) throw new Error(`JUBLFOOD segment revenue ${y}`);
  if (Math.abs(SEG.india.adjEbitda[i] + SEG.intl.adjEbitda[i] - F.ebitda[i]) > 1) throw new Error(`JUBLFOOD segment EBITDA ${y}`); });
const BL = AS.businessLines, rpsAvg = (rev, a, c) => rev / ((a + c) / 2);
const rps26 = rpsAvg(BL.dominosRevFY26, BL.dominosStoresMar25, BL.dominosStoresMar26), rps25 = rpsAvg(f25.dominosIndiaRev, 1995, BL.dominosStoresMar25);
const indiaRows = (() => { let st = BL.dominosStoresMar26, rps = rps26, em = BL.emergingRevFY26;
  return YRS.map((y, i) => { const open = st; st += BL.netAdds[i]; rps *= 1 + BL.revPerStoreGrowth[i] / 100; em *= 1 + BL.emergingGrowth[i] / 100;
    const dom = (open + st) / 2 * rps, rev = dom + em, g = (rev / (i ? SEG.india.revenue[i - 1] : f26.indiaRev) - 1) * 100;
    if (Math.abs(g - AS.segments[0].growth[i]) > 0.3) throw new Error(`JUBLFOOD India build ${y}: ${g.toFixed(2)}% vs ${AS.segments[0].growth[i]}%`);
    return { y, stores: st, adds: BL.netAdds[i], rps, dom, em, rev, g }; }); })();
indiaRows.forEach((r, i) => (r.domG = (r.dom / (i ? indiaRows[i - 1].dom : BL.dominosRevFY26) - 1) * 100));
const CB = AS.capexBuild; YRS.forEach((y, i) => { if (Math.abs(CB.india[i] + CB.intl[i] + CB.leasePrincipal[i] - F.capex[i]) > 0.5) throw new Error(`JUBLFOOD capex build ${y}`);
  if (CB.leasePrincipal[i] !== AS.rentBuild.leasePrincipal[i]) throw new Error('JUBLFOOD lease principal mismatch'); });
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);

// 2) Rent: street basis is pre-Ind AS EBITDA (after rent) and EV without lease liabilities. Rent = lease principal + interest.
const RB = AS.rentBuild, rent = YRS.map((_, i) => RB.leasePrincipal[i] + RB.leaseInterest[i]), rent26 = RB.fy26.leasePrincipal + RB.fy26.leaseInterest;
const preEbitda = F.ebitda.map((e, i) => e - rent[i]), preEbitda26 = CO.ebitda - rent26, preSep28 = sep(preEbitda);
const leases = FY26.balance.leaseLiabilities, bankNetDebt26 = FY26.balance.borrowings - (A.cash[b] + A.investments[b]);

// 3) Own one-year-forward EV/EBITDA since Apr-2021 (EV grossed up for minorities, INDHOTEL method; net debt incl. leases from
//    the latest March balance sheet public by then); forward EBITDA = realised (Screener) then ours for FY27E-FY28E.
const NPs = S.schedules['profit-loss']['Net Profit'], mFy = fy => { const p = `Mar ${fy}`, mi = -(NPs['Minority share'][p] || 0), pe = NPs['Profit for EPS'][p]; return mi > 0 ? mi / (pe + mi) : 0; };
const ebBy = {}; A.labels.forEach((l, i) => (ebBy[2000 + +l.slice(2)] = A.ebitda[i])); YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ndFy = fy => { const i = A.labels.indexOf('FY' + String(fy).slice(2)); return A.borrowings[i] - (A.cash[i] || 0) - (A.investments[i] || 0); };
const pubFy = d => { let fy = +d.slice(0, 4); if (d < `${fy}-05-30`) fy -= 1; return fy; };
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const troughFy = fy => { const pk = Math.max(...[ebBy[fy - 1], ebBy[fy - 2], ebBy[fy - 3]]); return !(ebBy[fy] > 0) || ebBy[fy] < 0.5 * pk; };
const series = M.price.series.filter(([d]) => d >= WIN && d <= ASOF);
const evRow = ([d, p]) => { const fy = fyOf(d), pf = pubFy(d), m = mFy(pf); return { d, fy, p, ev: (p * shares / (1 - m) + ndFy(pf)) / ebBy[fy], plain: (p * shares + ndFy(pf)) / ebBy[fy] }; };
const evAll = series.map(evRow), troughEv = [...new Set(evAll.filter(x => troughFy(x.fy)).map(x => x.fy))];
const HEV = stat(evAll.filter(x => !troughFy(x.fy)).map(x => x.ev)), HEVplain = stat(evAll.map(x => x.plain)), HEV24 = stat(evAll.filter(x => x.d >= '2024-04-01').map(x => x.ev));
const HEVy = y => stat(evAll.filter(x => x.d.startsWith(y)).map(x => x.ev)), evNow = evAll.at(-1).ev;
const fwdEvChart = evAll.filter((_, i, a) => i % 2 === 0 || i === a.length - 1).map(x => [x.d, Math.round(x.ev * 10) / 10]);
const evSepNow = (mcap / (1 - AS.minorities.sharePct / 100) + ndFy(2026)) / sep(F.ebitda); // EV at the 30-Sep close on Sep-28E EBITDA

// 4) Own one-year-forward P/E on EPS before exceptional items and discontinued operations (Screener 'Profit for PE' FY22-24;
//    company continuing PAT before exceptional items less minorities FY25-26); house function on reported EPS as sensitivity.
const PFP = NPs['Profit for PE'], sh = fy => { const pl = S.tables['profit-loss'], i = pl.periods.indexOf(`Mar ${fy}`); return NPs['Profit for EPS'][`Mar ${fy}`] / pl.rows['EPS in Rs'][i]; }; // attributable shares (S is the raw fetch, not patched)
const ownersBei = { 2025: C.fy26.fy25Restated.patContinuingBei - C.fy26.fy25Restated.nci, 2026: CO.patContinuingBei - (CO.nci - 5.2) };
const epsBei = { 2022: PFP['Mar 2022'] / sh(2022), 2023: PFP['Mar 2023'] / sh(2023), 2024: PFP['Mar 2024'] / sh(2024), 2025: ownersBei[2025] / sh(2025), 2026: ownersBei[2026] / sh(2026) };
YRS.forEach((y, i) => (epsBei[2000 + +y.slice(2, 4)] = F.eps[i]));
const peTrough = fy => epsBei[fy] < 0.5 * Math.max(epsBei[fy - 1] || 0, epsBei[fy - 2] || 0, epsBei[fy - 3] || 0);
const peAll = series.map(([d, p]) => ({ d, fy: fyOf(d), pe: p / epsBei[fyOf(d)] })).filter(x => !peTrough(x.fy));
const HPE = stat(peAll.map(x => x.pe)), FM = forwardMedian('JUBLFOOD', M), peNow = price / F.eps[1];

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, WIN, WIN5, n0, n1, n2, pc, pc1, half, medOf, stat, SA, SQ, sa, b, YRS, yi, price, shares, mcap, sep, Q1, FY26, CO, f26, f25,
  SEG, segM, BL, rps26, rps25, indiaRows, CB, ttmOI, RB, rent, rent26, preEbitda, preEbitda26, preSep28, leases, bankNetDebt26,
  mFy, ebBy, ndFy, fyOf, evAll, troughEv, HEV, HEVplain, HEV24, HEVy, evNow, fwdEvChart, evSepNow, epsBei, ownersBei, peAll, HPE, FM, peNow };
Object.assign(module.exports, require('./JUBLFOOD.ctx2')(module.exports, { peersAsOf, buyAt, sellAt, ratingFor }));
