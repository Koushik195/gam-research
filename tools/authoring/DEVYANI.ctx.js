// Devyani International initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks
// the India build (KFC stores x revenue per store + other brands), the capex and rent builds, and derives the EV/EBITDA
// multiple (primary, SOTP with minorities) once (PLAYBOOK §4 and §7c). As of 30-Sep-2026.
//
// QSR PEER SET (matches JUBLFOOD.ctx.js, the first QSR report of the batch): JUBLFOOD, WESTLIFE, SAPPHIRE, RBA on EV/EBITDA
// (Screener, trailing, leases in EV) at the 30-Sep-2026 close vs five-year medians (Oct-2021 to Sep-2026). Used: JUBLFOOD,
// WESTLIFE, SAPPHIRE. Excluded: DEVYANI itself; RBA (EBITDA negative Oct-2021 to May-2022: no complete five-year median;
// sensitivity row, as in JUBLFOOD). SAPPHIRE is kept in the base for consistency, but its price has tracked Devyani's through
// the 177:100 swap ratio since 1-Jan-2026, so an ex-Sapphire row is shown. P/E is not usable for Devyani (EPS near zero).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'DEVYANI', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'DEVYANI.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'DEVYANI', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', WIN = '2021-04-01', WIN5 = '2021-09-30', LISTED = '2021-08-16';
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

// 1) Segment and India builds: India + International = model revenue and EBITDA; KFC stores x revenue per store + other brands = India
const SEG = F.seg, segM = k => YRS.map((_, i) => SEG[k].adjEbitda[i] / SEG[k].revenue[i] * 100);
YRS.forEach((y, i) => { if (Math.abs(SEG.india.revenue[i] + SEG.intl.revenue[i] - F.sales[i]) > 1) throw new Error(`DEVYANI segment revenue ${y}`);
  if (Math.abs(SEG.india.adjEbitda[i] + SEG.intl.adjEbitda[i] - F.ebitda[i]) > 1) throw new Error(`DEVYANI segment EBITDA ${y}`); });
const BL = AS.businessLines, rps26 = BL.kfcRevFY26 / ((BL.kfcStoresMar25 + BL.kfcStoresMar26) / 2);
const indiaRows = (() => { let st = BL.kfcStoresMar26, rps = rps26, ph = BL.phRevFY26, own = BL.ownRevFY26, fr = BL.franchRevFY26, ot = BL.otherRevFY26;
  return YRS.map((y, i) => { const open = st; st += BL.netAdds[i]; rps *= 1 + BL.revPerStoreGrowth[i] / 100;
    ph *= 1 + BL.phGrowth[i] / 100; own *= 1 + BL.ownGrowth[i] / 100; fr *= 1 + BL.franchGrowth[i] / 100; ot *= 1 + BL.otherGrowth[i] / 100;
    const kfc = (open + st) / 2 * rps, rev = kfc + ph + own + fr + ot, g = (rev / (i ? SEG.india.revenue[i - 1] : f26.indiaRev) - 1) * 100;
    if (Math.abs(g - AS.segments[0].growth[i]) > 0.3) throw new Error(`DEVYANI India build ${y}: ${g.toFixed(2)}% vs ${AS.segments[0].growth[i]}%`);
    return { y, stores: st, adds: BL.netAdds[i], rps, kfc, ph, own, fr, ot, rev, g }; }); })();
indiaRows.forEach((r, i) => (r.kfcG = (r.kfc / (i ? indiaRows[i - 1].kfc : BL.kfcRevFY26) - 1) * 100));
const CB = AS.capexBuild; YRS.forEach((y, i) => { if (Math.abs(CB.cash[i] + CB.leasePrincipal[i] - F.capex[i]) > 0.5) throw new Error(`DEVYANI capex build ${y}`);
  if (CB.leasePrincipal[i] !== AS.rentBuild.leasePrincipal[i]) throw new Error('DEVYANI lease principal mismatch'); });
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);

// 2) Rent: street basis is pre-Ind AS EBITDA (after rent) and EV without lease liabilities. Rent = lease principal + interest.
const RB = AS.rentBuild, rent = YRS.map((_, i) => RB.leasePrincipal[i] + RB.leaseInterest[i]), rent26 = RB.fy26.leasePrincipal + RB.fy26.leaseInterest;
const preEbitda = F.ebitda.map((e, i) => e - rent[i]), preEbitda26 = CO.preIndAsEbitda, preSep28 = sep(preEbitda);
const leases = FY26.balance.leaseLiabilitiesTotal, bankNetDebt26 = FY26.balance.borrowings + FY26.balance.shortTerm - (A.cash[b] + A.investments[b]);

// 3) Minorities: Camas's 52.45% effective share of Thailand; Thailand = 91% of International. phi = minorities' share of group
//    EBITDA (and, on our leverage assumption, of equity value). Used for the SOTP deduction and to gross up historical EV.
const MI = AS.minorities, phiOf = (intl, tot) => MI.thaiNciPct / 100 * MI.thaiShareOfIntlPct / 100 * intl / tot;
const phi = YRS.map((_, i) => phiOf(SEG.intl.adjEbitda[i], F.ebitda[i])), phiSep = phiOf(sep(SEG.intl.adjEbitda), sep(F.ebitda));
const phiHist = { 2025: phiOf(f25.intlEbitda, f25.ebitda), 2026: phiOf(f26.intlEbitda, f26.ebitda) }; YRS.forEach((y, i) => (phiHist[2000 + +y.slice(2, 4)] = phi[i]));

// 4) Own one-year-forward EV/EBITDA since listing (EV grossed up for minorities from the Thai deal, INDHOTEL/JUBLFOOD method; net debt
//    incl. leases from the latest March balance sheet public by then, Mar-24 from the Thai deal date); forward EBITDA = realised
//    (company basis) then ours for FY27E-FY28E. Shares: 120.63 cr before the Sky Gate issue (10-Jun-2025), 123.29 cr after.
const ebBy = {}; SA.forEach(r => (ebBy[2000 + +r.fy.slice(2)] = r.ebitda)); YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ndFy = fy => { const i = A.labels.indexOf('FY' + String(fy).slice(2)); return A.borrowings[i] - (A.cash[i] || 0) - (A.investments[i] || 0); };
const pubFy = d => { let fy = +d.slice(0, 4); if (d < `${fy}-05-30`) fy -= 1; if (d >= '2024-01-17' && fy < 2024) fy = 2024; return fy; };
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const shAt = d => (d < '2025-06-10' ? FY26.shares.mar25 : FY26.shares.mar26);
const troughFy = fy => { const pk = Math.max(...[ebBy[fy - 1], ebBy[fy - 2], ebBy[fy - 3]].filter(Boolean)); return !(ebBy[fy] > 0) || ebBy[fy] < 0.5 * pk; };
const series = M.price.series.filter(([d]) => d >= WIN && d <= ASOF);
const evRow = ([d, p]) => { const fy = fyOf(d), m = phiHist[fy] || 0, nd = ndFy(pubFy(d)); return { d, fy, p, m, ev: (p * shAt(d) / (1 - m) + nd) / ebBy[fy], plain: (p * shAt(d) + nd) / ebBy[fy] }; };
const evAll = series.map(evRow), troughEv = [...new Set(evAll.filter(x => troughFy(x.fy)).map(x => x.fy))];
const kept = evAll.filter(x => !troughFy(x.fy));
const HEV = stat(kept.map(x => x.ev)), HEVplain = stat(kept.map(x => x.plain)), HEV22 = stat(kept.filter(x => x.d >= '2022-04-01').map(x => x.ev)), HEV24 = stat(kept.filter(x => x.d >= '2024-04-01').map(x => x.ev));
const HEVy = y => stat(evAll.filter(x => x.d.startsWith(y)).map(x => x.ev)), evNow = evAll.at(-1).ev;
const fwdEvChart = evAll.filter((_, i, a) => i % 2 === 0 || i === a.length - 1).map(x => [x.d, Math.round(x.ev * 10) / 10]);
const evSepNow = (mcap / (1 - phiSep) + ndFy(2026)) / sep(F.ebitda); // EV at the 30-Sep close on Sep-28E EBITDA

// 5) P/E: the house forward-P/E function on reported EPS (shown, not used: EPS near zero or negative since FY24)
const FM = forwardMedian('DEVYANI', M), peNow = price / F.eps[1], peSep = price / sep(F.eps);

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, WIN, WIN5, LISTED, n0, n1, n2, pc, pc1, half, medOf, stat, SA, SQ, sa, b, YRS, yi, price, shares, mcap, sep, Q1, FY26, CO, f26, f25,
  SEG, segM, BL, rps26, indiaRows, CB, ttmOI, RB, rent, rent26, preEbitda, preEbitda26, preSep28, leases, bankNetDebt26, MI, phi, phiSep, phiHist,
  ebBy, ndFy, fyOf, shAt, evAll, troughEv, HEV, HEVplain, HEV22, HEV24, HEVy, evNow, fwdEvChart, evSepNow, FM, peNow, peSep };
Object.assign(module.exports, require('./DEVYANI.ctx2')(module.exports, { peersAsOf, buyAt, sellAt, ratingFor }));
