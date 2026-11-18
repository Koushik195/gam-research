// Max Healthcare context, part 2: peers and sector de-rating, street table and Network -> consolidated translation,
// rating from the house rule, and the discount rate implied by the share price in our DCF. Called from MAXHEALTH.ctx.js.
const fs = require('fs');
const path = require('path');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');

module.exports = X => {
  const { ROOT, ASOF, D, F, V, A, AS, HEV, FM, HPEA, price, mcap, evTarget, treasurySep28, netEqEbitda, CONS_TO_NET, b } = X;
  // Peers at the 30-Sep-2026 close; de-rating = trailing multiple vs its own five-year median (Screener)
  const PEER_SYMS = ['MAXHEALTH', 'APOLLOHOSP', 'FORTIS', 'NH', 'MEDANTA', 'KIMS', 'ASTERDM', 'RAINBOW', 'JLHL'];
  const PEERS = peersAsOf(PEER_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
  const med5 = (sym, chart, key) => { const Xs = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (Xs.charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
  const MED5EV = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')])), MED5PE = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
  const drEv = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].evEbitda / MED5EV[s] - 1) * 100])), drPe = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].pe / MED5PE[s] - 1) * 100]));
  const CORE = ['APOLLOHOSP', 'FORTIS', 'NH', 'MEDANTA', 'JLHL', 'RAINBOW'], LEFT_OUT = ['KIMS', 'ASTERDM'];
  const median = a => { const v = a.slice().sort((x, y) => x - y), k = v.length; return k % 2 ? v[(k - 1) / 2] : (v[k / 2 - 1] + v[k / 2]) / 2; };
  const sectorDrEv = median(CORE.map(s => drEv[s])), sectorDrPe = median(CORE.map(s => drPe[s])), allDrEv = median(PEER_SYMS.filter(s => s !== 'MAXHEALTH').map(s => drEv[s]));
  const evAfter = HEV.med * (1 + sectorDrEv / 100), peAfter = HPEA.med * (1 + sectorDrPe / 100), peAfterRep = FM.median * (1 + sectorDrPe / 100);
  const evBullAfter = HEV.p75 * (1 + sectorDrEv / 100), evBearAfter = HEV.p25 * (1 + sectorDrEv / 100);
  const shortName = s => ({ MAXHEALTH: 'Max Healthcare', APOLLOHOSP: 'Apollo Hospitals', FORTIS: 'Fortis', NH: 'Narayana Hrudayalaya', MEDANTA: 'Medanta (Global Health)', KIMS: 'KIMS', ASTERDM: 'Aster DM', RAINBOW: 'Rainbow Children\'s', JLHL: 'Jupiter Life Line' }[s] || s);

  // Rating from the house rule (never typed)
  const rating = ratingFor(V.upside);
  const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

  // Street as it stood on 30-Sep-2026 (Network basis); translation to our consolidated basis
  const ST = D.street.brokers, byB = n => ST.find(s => s.broker === n);
  const pl = byB('Prabhudas Lilladher'), mosl = byB('Motilal Oswal'), ar = byB('Anand Rathi'), antique = byB('Antique');
  const postQ1 = ST.filter(s => s.date >= '2026-08'), avgPost = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length;
  const plNetDebt28 = pl.netDebt.FY28E / 10, plEbitda28 = pl.ebitda.FY28E / 10; // ₹ cr
  const plEv = 30 * plEbitda28; // PL: 30x FY28E Network EBITDA
  const plOnOurs = (plEv - plNetDebt28 - F.treasury[1]) / F.ebitda[1]; // same equity value, our net debt (incl. leases), our consolidated FY28E EBITDA
  const ourInPl = (evTarget + treasurySep28 + plNetDebt28) / plEbitda28; // our target equity + PL net debt, on PL's FY28E Network EBITDA
  const ourOnFy28 = evTarget / F.ebitda[1];

  // DCF: discount rate at which our cash flows justify today's price (same rows, terminal growth and roll-forward)
  const dcfAt = w => { const pv = V.rows.reduce((s, r, k) => s + r.fcff / Math.pow(1 + w / 100, k + 0.5), 0); const last = V.rows.at(-1); const tv = last.fcff * (1 + V.terminalGrowth / 100) / ((w - V.terminalGrowth) / 100) / Math.pow(1 + w / 100, V.rows.length); return (pv + tv + V.netCash) / F.shares * Math.pow(1 + V.ke / 100, 0.5); };
  let lo = V.terminalGrowth + 0.3, hi = 20; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (dcfAt(mid) > price) lo = mid; else hi = mid; }
  const impliedWacc = (lo + hi) / 2, dcfAtTarget = (() => { let l = V.terminalGrowth + 0.3, h = 20; for (let i = 0; i < 60; i++) { const m = (l + h) / 2; if (dcfAt(m) > V.tp) l = m; else h = m; } return (l + h) / 2; })();

  return { PEER_SYMS, PEERS, P, MED5EV, MED5PE, drEv, drPe, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, allDrEv, evAfter, peAfter, peAfterRep, evBullAfter, evBearAfter, shortName,
    rating, buyBelow, sellAbove, ST, pl, mosl, ar, antique, postQ1, avgPost, plNetDebt28, plEbitda28, plEv, plOnOurs, ourInPl, ourOnFy28, dcfAt, impliedWacc, dcfAtTarget };
};

if (require.main === module) {
  const X = require('./MAXHEALTH.ctx');
  const r = v => Math.round(v * 10) / 10;
  console.log('bed build ok; FY26 implied beds', Math.round(X.BEDS26), 'FY25', Math.round(X.BEDS25), 'Q1', Math.round(X.BEDSQ1), 'consToNet', r(X.CONS_TO_NET * 100));
  console.log('HEV', JSON.stringify(X.HEV), 'evNow', r(X.evNow), 'evAfter', r(X.evAfter), 'bull/bear', r(X.evBullAfter), r(X.evBearAfter), 'trough', X.troughEv);
  console.log('PE rep', X.FM.median, 'adj', X.HPEA.med, 'peAfter', r(X.peAfter), 'drEv', r(X.sectorDrEv), 'drPe', r(X.sectorDrPe), 'all', r(X.allDrEv));
  console.log('TP', X.V.tp, X.rating, 'upside', r(X.V.upside), 'plOnOurs', r(X.plOnOurs), 'ourInPl', r(X.ourInPl), 'ourOnFy28', r(X.ourOnFy28), 'impliedWacc', r(X.impliedWacc), 'atTarget', r(X.dcfAtTarget), 'avgPost', Math.round(X.avgPost));
  console.log('netEq', X.netEqEbitda.map(Math.round), 'drEv', JSON.stringify(Object.fromEntries(Object.entries(X.drEv).map(([k, v]) => [k, r(v)]))));
}
