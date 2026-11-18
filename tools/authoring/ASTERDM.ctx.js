// Aster DM Quality Care initiation: shared context for the Part B files (research.js, part2-6). Loads the research
// JSONs and the built model, checks the bed build against model revenue, and computes the valuation inputs once:
// look-through forward EV/EBITDA since the merger was announced (EV = price x post-merger shares + pro-forma net debt
// incl. leases; EBITDA = next full year's pro-forma post-Ind AS EBITDA after minorities), forward P/E on the same
// basis, the house forwardMedian output (distorted by the FY25 GCC gain), peer de-rating, street table and the
// standalone-Aster scenario. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { PF, SHARES } = require('./ASTERDM.patch');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ASTERDM', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ASTERDM.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'ASTERDM', 'screener.json'), 'utf8'));
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const rup = s => String(s ?? '').replace(/Rs ?(?=[0-9])/g, '₹');
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const SRC = 'Aster DM Quality Care presentations, earnings calls, annual report and scheme documents; GAM Research';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26;
const b = A.labels.length - 1; // FY26 (pro-forma) index
const ix = fy => A.labels.indexOf(fy);
const YRS = F.years;

// Reported (Aster alone) history, from the originals kept by ASTERDM.patch.js
const PL0 = RAW.tables['profit-loss'], i26 = PL0.periods.indexOf('Mar 2026');
const pfe = RAW.schedules['profit-loss']['Net Profit']['Profit for EPS'];
const REP = { sales: PL0.rows.Sales[i26], ebitdaScreener: PL0.rows['Operating Profit'][i26], ebitdaCo: FY26.aster.ebitdaPostIndAs, pat: pfe['Mar 2026'], eps: PL0.rows['EPS in Rs'][i26], shares: 51.8121029 };
const repSeries = key => PL0.periods.filter(p => /^Mar/.test(p)).map(p => [`FY${p.slice(-2)}`, key === 'pat' ? pfe[p] : PL0.rows[key][PL0.periods.indexOf(p)]]);

// Bed build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines;
const grp = (g, i) => g.opBeds[i] * 365 * g.occupancyPct[i] / 100 * g.arpob[i] / 1e7;
const exF = YRS.map((_, i) => grp(BL.existing, i)), nwF = YRS.map((_, i) => grp(BL.newBeds, i)), othF = BL.other;
YRS.forEach((y, i) => { const s = exF[i] + nwF[i] + othF[i]; if (Math.abs(s / F.sales[i] - 1) > 0.003) throw new Error(`ASTERDM bed build ${y}: ${n0(s)} != model revenue ${n0(F.sales[i])}`); });
const totBeds = YRS.map((_, i) => BL.existing.opBeds[i] + BL.newBeds.opBeds[i]);
const blOcc = YRS.map((_, i) => (BL.existing.opBeds[i] * BL.existing.occupancyPct[i] + BL.newBeds.opBeds[i] * BL.newBeds.occupancyPct[i]) / totBeds[i]);
const arpobQ1 = Q1.maturityTotal.revenue * 1e7 / (Q1.proForma.opBeds * 91 * Q1.proForma.occupancyPct / 100);
const hosp26 = PF.pl.Sales - 232, beds26 = 10350, arpob26 = hosp26 * 1e7 / (beds26 * 365 * 0.62);

// Rent (to translate pre-Ind AS figures): FY26 Aster Rs113 cr (deck: post 901 - pre 788); combined per PL
const RENT = { FY26: 164, FY27E: 174, FY28E: 186, FY29E: 199 }; // PL pro-forma FY26-28E; FY29E GAM (+7%)
const LEASE = 1785; // pro-forma lease liabilities, Mar-26
const MIN = AS.valuation.minorityShareOfEbitdaPct / 100; // minorities' share of EBITDA

// Price, model outputs
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const evMult = mv('ev').mult, ebitdaSep28 = mv('ev').metric, peMult = mv('pe').mult, epsSep28 = mv('pe').metric;
const evAttrMult = Math.round(evMult / (1 - MIN) * 10) / 10;
const roll = arr => (arr[1] + arr[2]) / 2;
const treasurySep28 = roll(F.treasury), evTarget = evMult * ebitdaSep28;
const netDebt26 = -(A.cash[b] + (A.investments[b] || 0) - A.borrowings[b]);
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, ebitdaCagrFwd = (Math.pow(F.ebitda[2] / A.ebitda[b], 1 / 3) - 1) * 100;
const pfCagrHist = (Math.pow(SA[2].pfOpEbitda / SA[0].pfOpEbitda, 1 / 2) - 1) * 100, pfRevCagrHist = (Math.pow(SA[2].pfRev / SA[0].pfRev, 1 / 2) - 1) * 100;

// Look-through forward EV/EBITDA since the deal (29-Nov-2024): post-merger shares; pro-forma net debt incl. leases
// (Sep-25 combined Rs1,290 cr + Rs672 cr deferred Evercare consideration until the Mar-26 figure was published with
// Q4FY26 results; Mar-26 Rs763 cr + leases; Jun-26 Rs1,162 cr + leases from Q1FY27); EBITDA of the next full year
// (FY26 pro-forma, then our FY27-29E) after minorities.
const E = { 2026: A.ebitda[b], 2027: F.ebitda[0], 2028: F.ebitda[1], 2029: F.ebitda[2] };
const EP = { 2026: A.eps[b], 2027: F.eps[0], 2028: F.eps[1], 2029: F.eps[2] };
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const ND = d => (d < '2026-04-30' ? 1290 + 672 : d < '2026-08-05' ? 763 + LEASE : 1162 + LEASE);
const DEAL = '2024-11-29';
const px = M.price.series.filter(([d]) => d >= DEAL && d <= ASOF);
const fwdEv = px.map(([d, p]) => [d, Math.round((p * SHARES + ND(d)) / (E[fyOf(d)] * (1 - MIN)) * 10) / 10]);
const fwdPe = px.map(([d, p]) => [d, Math.round(p / EP[fyOf(d)] * 10) / 10]);
const stat = arr => { const v = arr.slice().sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const HEV = stat(fwdEv.map(x => x[1])), HPE = stat(fwdPe.map(x => x[1]));
const HEVy = y => stat(fwdEv.filter(x => x[0].startsWith(y)).map(x => x[1]));
const evNowAttr = (mcap + netDebt26) / (F.ebitda[1] * (1 - MIN)), evNowCons = (mcap + netDebt26) / F.ebitda[1], peNow = price / F.eps[1];
// Pre-deal Aster alone (Apr-Nov 2024): 49.95 cr shares, Mar-25 net debt incl. leases (642 + 1,376 - 1,381), FY25 EBITDA
const preDeal = M.price.series.filter(([d]) => d >= '2024-04-26' && d < DEAL).map(([d, p]) => [d, Math.round((p * 49.95 + 637) / 765 * 10) / 10]);
const HPD = stat(preDeal.map(x => x[1]));
// House tool (Screener EPS: FY25 Rs107.66 incl. the GCC gain makes every later year a 'trough')
const FM = forwardMedian('ASTERDM', M, { from: '2024-05-01' });

// Peers at the 30-Sep-2026 close; de-rating = trailing multiple vs its own five-year median (Screener)
const PEER_SYMS = ['ASTERDM', 'APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'NH', 'MEDANTA', 'KIMS', 'RAINBOW', 'JLHL'];
const PEERS = peersAsOf(PEER_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = (sym, chart, key) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
const MED5EV = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')])), MED5PE = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const drEv = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].evEbitda / MED5EV[s] - 1) * 100])), drPe = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].pe / MED5PE[s] - 1) * 100]));
const CORE = ['APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'NH', 'MEDANTA', 'JLHL', 'RAINBOW'], LEFT_OUT = ['KIMS'];
const median = a => { const v = a.slice().sort((x, y) => x - y), k = v.length; return k % 2 ? v[(k - 1) / 2] : (v[k / 2 - 1] + v[k / 2]) / 2; };
const sectorDrEv = median(CORE.map(s => drEv[s])), sectorDrPe = median(CORE.map(s => drPe[s])), allDrEv = median(PEER_SYMS.filter(s => s !== 'ASTERDM').map(s => drEv[s]));
const evAfter = HEV.med * (1 + sectorDrEv / 100), peAfter = HPE.med * (1 + sectorDrPe / 100);
const shortName = s => ({ ASTERDM: 'Aster DM', APOLLOHOSP: 'Apollo Hospitals', MAXHEALTH: 'Max Healthcare', FORTIS: 'Fortis', NH: 'Narayana Hrudayalaya', MEDANTA: 'Medanta (Global Health)', KIMS: 'KIMS', RAINBOW: 'Rainbow', JLHL: 'Jupiter Life Line' }[s] || s);

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026, translated to our basis (post-Ind AS EBITDA after minorities, leases in net debt)
const ST = D.street.brokers, byB = n => ST.find(s => s.broker === n);
const mo = byB('Motilal Oswal'), ic = byB('ICICI Securities (retail)'), pl = byB('Prabhudas Lilladher'), hd = byB('HDFC Securities');
const avgTp = ST.reduce((s, x) => s + x.tp, 0) / ST.length;
const plPostAttr = pl.ebitda.FY28E * (1 - (1 - 2483 / (pl.ebitda.FY28E - pl.rent.FY28E)));
const plOurBasis = (32 * 2483 + LEASE) / plPostAttr, icOurBasis = 28 / (1 - MIN);
const ourPreBasis = (evTarget - LEASE) / ((ebitdaSep28 - roll([0, RENT.FY28E, RENT.FY29E])) * (1 - MIN));

// Reported-basis FY27E memo (QCIL consolidated from 1-Jul-2026): pro-forma less QCIL's Q1FY27
const repFY27 = { sales: F.sales[0] - Q1.qcil.revenue, ebitda: F.ebitda[0] - Q1.qcil.opEbitda };

// Standalone Aster scenario (no merger): GAM estimates in assumptions.standalone
const SAL = AS.standalone;
const salE = SAL.revenue.map((r, i) => r * SAL.margin[i] / 100), salSep28 = (salE[1] + salE[2]) / 2;
const salValue = (salSep28 * (1 - SAL.minorityPct / 100) * evAttrMult - SAL.netDebtSep28) / REP.shares;

module.exports = { rup, ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, SRC, shortDate, SA, SQ, QL, Q1, FY26, b, ix, YRS, REP, repSeries, PF, SHARES,
  BL, exF, nwF, othF, totBeds, blOcc, arpobQ1, hosp26, beds26, arpob26, RENT, LEASE, MIN, price, mcap, mv, evMult, evAttrMult, ebitdaSep28, peMult, epsSep28, treasurySep28, evTarget, netDebt26,
  epsCagrFwd, ebitdaCagrFwd, pfCagrHist, pfRevCagrHist, fwdEv, fwdPe, HEV, HPE, HEVy, evNowAttr, evNowCons, peNow, preDeal, HPD, FM,
  PEER_SYMS, PEERS, P, MED5EV, MED5PE, drEv, drPe, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, allDrEv, evAfter, peAfter, shortName, rating, buyBelow, sellAbove,
  ST, mo, ic, pl, hd, avgTp, plOurBasis, icOurBasis, ourPreBasis, repFY27, SAL, salE, salSep28, salValue };
