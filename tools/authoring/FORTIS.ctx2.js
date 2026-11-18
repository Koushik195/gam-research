// Fortis initiation, shared context part 2: peers at the 30-Sep-2026 close and their de-rating, diagnostics peers,
// the multiple derivation, street table and translation, other-income build. Loaded by FORTIS.ctx.js.
const fs = require('fs');
const path = require('path');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const X = require('./FORTIS.ctx');
const { ROOT, ASOF, D, C, F, V, A, AS, HS, DG, b, HEV, price, hospSep28, diagSep28, esopSep28, pNet, pMin, hospMult, diagMult, n0 } = X;

// Peers at the 30-Sep-2026 close; de-rating = trailing multiple vs its own five-year median (Screener)
const PEER_SYMS = ['FORTIS', 'APOLLOHOSP', 'MAXHEALTH', 'NH', 'MEDANTA', 'RAINBOW', 'JLHL', 'KIMS', 'ASTERDM'];
const DIAG_SYMS = ['LALPATHLAB', 'METROPOLIS', 'VIJAYA'];
const PEERS = peersAsOf(PEER_SYMS, ASOF), DPEERS = peersAsOf(DIAG_SYMS, ASOF);
const P = Object.fromEntries([...PEERS, ...DPEERS].map(p => [p.symbol, p]));
const med5 = (sym, chart, key) => { const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (S.charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
const ALL = [...PEER_SYMS, ...DIAG_SYMS];
const MED5EV = Object.fromEntries(ALL.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')])), MED5PE = Object.fromEntries(ALL.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const drEv = Object.fromEntries(ALL.map(s => [s, (P[s].evEbitda / MED5EV[s] - 1) * 100])), drPe = Object.fromEntries(ALL.map(s => [s, (P[s].pe / MED5PE[s] - 1) * 100]));
const CORE = ['APOLLOHOSP', 'MAXHEALTH', 'NH', 'MEDANTA', 'RAINBOW', 'JLHL'], LEFT_OUT = ['KIMS', 'ASTERDM'];
const median = a => { const v = a.slice().sort((x, y) => x - y), k = v.length; return k % 2 ? v[(k - 1) / 2] : (v[k / 2 - 1] + v[k / 2]) / 2; };
const sectorDrEv = median(CORE.map(s => drEv[s])), sectorDrPe = median(CORE.map(s => drPe[s])), allDrEv = median([...CORE, ...LEFT_OUT].map(s => drEv[s]));
const diagDrEv = median(DIAG_SYMS.map(s => drEv[s]));
const evAfter = HEV.med * (1 + sectorDrEv / 100), peAfter = X.FM.median * (1 + sectorDrPe / 100);
if (Math.abs(evAfter - hospMult) > 0.6) console.warn(`FORTIS: derived hospital multiple ${evAfter.toFixed(1)}x vs ${hospMult}x in assumptions`);
if (Math.abs(peAfter - X.peMult) > 1.5) console.warn(`FORTIS: derived P/E ${peAfter.toFixed(1)}x vs ${X.peMult}x in assumptions`);
const shortName = s => ({ FORTIS: 'Fortis', APOLLOHOSP: 'Apollo Hospitals', MAXHEALTH: 'Max Healthcare', NH: 'Narayana Hrudayalaya', MEDANTA: 'Medanta (Global Health)', KIMS: 'KIMS', ASTERDM: 'Aster DM', RAINBOW: 'Rainbow Children\'s', JLHL: 'Jupiter Life Line', LALPATHLAB: 'Dr Lal PathLabs', METROPOLIS: 'Metropolis', VIJAYA: 'Vijaya Diagnostic' }[s] || s);

// Peers' FY28E EV/EBITDA (MOSL estimates at 4-Sep-2026 prices) scaled to the 30-Sep-2026 close (EV ≈ market value)
const PF = D.peerForward, closes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', `${ASOF}.json`), 'utf8')).closes;
const PFW = PF.rows.map(([s, cmp, e27, e28, cg]) => ({ s, e27: e27 * closes[s] / cmp, e28: e28 * closes[s] / cmp, cg }));
const pfCore = median(PFW.filter(r => CORE.includes(r.s)).map(r => r.e28));
const ourFy28Equiv = hospMult * (hospSep28 - esopSep28) / (HS.adjEbitda[1] - AS.esop[1]); // our Sep-28E hospital multiple on FY28E post-ESOP

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026
const ST = D.street.brokers, byB = n => ST.find(s => s.broker === n);
const mosl = byB('Motilal Oswal'), isec = byB('ICICI Securities'), pl = byB('Prabhudas Lilladher');
const postQ1 = ST.filter(s => s.date >= '2026-08'), avgPost = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length;
const netDebtSep27 = -pNet.value; // model, incl. leases
// Street multiples on OUR estimates: hospitals FY28E EBITDA after ESOP, diagnostics FY28E at Fortis's 88.32%
const streetOnOurs = (h, d) => (h * (HS.adjEbitda[1] - AS.esop[1]) + d * DG.adjEbitda[1] * 0.8832 - netDebtSep27) / F.shares;
const isecOnOurs = streetOnOurs(27, 24), moslOnOurs = streetOnOurs(30, 23);
const buyoutFwd = X.AGILUS.implied100 / 352; // FY25 buyout price ÷ FY26 operating EBITDA excl. one-offs (₹352 cr)

// Other income, built (₹ cr; AR FY26 note 6(xxii); GAM estimates) - must sum to model other income
const OI = {
  rows: [
   ['Bank-deposit interest (4.25% on ~₹550-590 cr of cash)', 22.1, [23, 23, 25]],
   ['Interest on income-tax refunds (fading)', 13.2, [8, 4, 2]],
   ['Interest on other financial assets', 4.1, [4, 4, 4]],
   ['Recurring miscellaneous income', 7.2, [7, 7, 7]],
   ['Share of associates and JVs (Lanka Hospitals, RHT, C-Doc)', 16.4, [17, 18, 19]],
   ['One-offs (asset-sale, FX and fair-value gains)', 4.0, [0, 0, 0]],
  ],
};
OI.tot = [0, 1, 2].map(i => OI.rows.reduce((s, r) => s + r[2][i], 0));
OI.tot.forEach((t, i) => { if (Math.abs(t - F.otherIncome[i]) > 0.5) throw new Error(`FORTIS other income build ${t} != model ${F.otherIncome[i]}`); });
OI.fy26 = OI.rows.reduce((s, r) => s + r[1], 0);

module.exports = { PEER_SYMS, DIAG_SYMS, PEERS, DPEERS, P, MED5EV, MED5PE, drEv, drPe, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, allDrEv, diagDrEv, evAfter, peAfter, shortName,
  PFW, pfCore, ourFy28Equiv, rating, buyBelow, sellAbove, ST, mosl, isec, pl, postQ1, avgPost, netDebtSep27, isecOnOurs, moslOnOurs, buyoutFwd, OI };
