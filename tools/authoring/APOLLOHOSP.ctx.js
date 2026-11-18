// Apollo Hospitals initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs
// and the built model, checks the hospital bed build against model revenue, and computes the valuation inputs once:
// own one-year-forward EV/EBITDA since Apr-2021 (post-Ind AS EBITDA; lease liabilities and CCPS in net debt, as on
// Screener), forward P/E (forwardMedian), peer de-rating (hospitals, diagnostics, pharmacy), SOTP checks, street table.
// As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'APOLLOHOSP', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'APOLLOHOSP.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?(?=\d)/g, '₹');
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, AK = C.annualKpis;
const ann = fy => SA.find(a => a.fy === fy);
const b = A.labels.length - 1, YRS = F.years, yi = y => YRS.indexOf(y);
const SEG = F.seg, sep28 = k => (SEG[k].adjEbitda[yi('FY28E')] + SEG[k].adjEbitda[yi('FY29E')]) / 2;

// Hospital bed build (assumptions.businessLines.hcs) must equal the model's hospital revenue
const BH = AS.businessLines.hcs;
const disch = YRS.map((_, i) => BH.avgBeds[i] * BH.occupancyPct[i] / 100 * 365 / BH.alos[i]);
const ipRev = YRS.map((_, i) => disch[i] * BH.arpp[i] / 1e7), netRev = YRS.map((_, i) => ipRev[i] / BH.ipSharePct[i] * 100), hcsBuild = YRS.map((_, i) => netRev[i] * BH.consSharePct[i] / 100);
YRS.forEach((y, i) => { if (Math.abs(hcsBuild[i] / SEG.hcs.revenue[i] - 1) > 0.003) throw new Error(`APOLLOHOSP bed build ${y}: ${n0(hcsBuild[i])} != model hospital revenue ${n0(SEG.hcs.revenue[i])}`); });
const arpob = YRS.map((_, i) => BH.arpp[i] / BH.alos[i]);
const segSum = YRS.map((_, i) => SEG.hcs.revenue[i] + SEG.hco.revenue[i] + SEG.ahll.revenue[i]);
YRS.forEach((y, i) => { if (Math.abs(segSum[i] / F.sales[i] - 1) > 0.001) throw new Error(`APOLLOHOSP segments ${y} do not sum to revenue`); });

// Rent (lease payments) to translate post-Ind AS EBITDA to the pre-Ind AS view; FY27-29E are GAM estimates
const RENT = { FY26: 290.7, FY27E: 340, FY28E: 370, FY29E: 400 };
const preEbitda = YRS.map((y, i) => F.ebitda[i] - RENT[y]), preMargin = YRS.map((_, i) => preEbitda[i] / F.sales[i] * 100);

// Price, SOTP parts, model outputs
const price = M.price.last, sh = F.shares, mcap = price * sh;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const P = V.sotp.parts, VP = AS.valuation.parts, part = re => P[VP.findIndex(p => re.test(p.name))], vpart = re => VP.find(p => re.test(p.name));
const hospMult = part(/^Hospitals/).mult, hospSep28 = sep28('hcs'), hcoSep28 = sep28('hco'), ahllSep28 = sep28('ahll');
const NEWCO_PCT = C.restructuring.aheLookThroughPct / 100;
const newcoMult = { base: 18, bull: 24, bear: 13 };
const KEIMED_SEP28 = 705; // GAM estimate: Q1FY27 EBITDA Rs134 cr grown ~15% a year (see gaps)
['base', 'bull', 'bear'].forEach(k => {
  if (Math.abs(vpart(/^Apollo HealthCo/).multiple[k] - newcoMult[k] * NEWCO_PCT) > 0.01) throw new Error(`HealthCo effective multiple (${k}) out of line`);
  if (Math.abs(vpart(/^Keimed/).adj[k] - KEIMED_SEP28 * newcoMult[k] * NEWCO_PCT) > 5) throw new Error(`Keimed value (${k}) out of line`);
});
// Minorities: only those in parts valued at 100% (hospitals, AHLL step-downs). HealthCo's minority (Rs1.1 cr) is left out
// because NewCo is valued at Apollo's 59.6%. Hospital minorities = their FY26 share of hospital profit (before minorities)
// applied to hospital equity value (hospital EV less hospital net debt incl. leases), case by case.
const MIN = C.fy26.minorities, HOSP_MIN_KEYS = ['assam', 'lucknow', 'ahmedabad', 'imperial', 'indore', 'nellore', 'lavasa', 'kerala'];
const HOSP_MIN26 = HOSP_MIN_KEYS.reduce((t, k) => t + MIN[k], 0);
const HCS_PAT26 = 1628.0; // FY26 hospital segment PAT (Q4FY26 deck), after minorities: segment PATs sum to attributable PAT
const HOSP_PAT_PRE = HCS_PAT26 + HOSP_MIN26, HOSP_MIN_SHARE = HOSP_MIN26 / HOSP_PAT_PRE, PAT_TO_EBITDA = HOSP_PAT_PRE / C.segments[0].fy26Ebitda;
const HOSP_NET_DEBT = 3100; // Jun-26: hospital net debt Rs221 cr + all lease liabilities Rs2,877 cr (upper bound for the hospitals)
const AHLL_MIN26 = MIN.ahll;
const hospSep28Case = k => { const S = AS.segments[0], d = (k === 'base' ? {} : AS.scenarios[k].segments.hcs) || {}; let r = S.base; const e = []; S.growth.forEach((g, i) => { r *= 1 + (g + (d.growthDelta || 0)) / 100; e.push(r * (S.marginPct[i] + (d.marginDelta || 0)) / 100); }); return (e[1] + e[2]) / 2; };
const minHospWant = k => -HOSP_MIN_SHARE * (vpart(/^Hospitals/).multiple[k] * hospSep28Case(k) - HOSP_NET_DEBT);
const minAhllWant = k => -AHLL_MIN26 * vpart(/^AHLL/).multiple[k] / PAT_TO_EBITDA;
['base', 'bull', 'bear'].forEach(k => {
  const h = vpart(/minorities in hospital/).adj[k], a = vpart(/minorities in AHLL/).adj[k];
  if (!(Math.abs(h / minHospWant(k) - 1) <= 0.01) || !(Math.abs(a / minAhllWant(k) - 1) <= 0.02)) throw new Error(`minority value (${k}) ${h} / ${a} vs ${Math.round(minHospWant(k))} / ${Math.round(minAhllWant(k))}`);
});
if (Math.abs(hospSep28Case('base') / sep28('hcs') - 1) > 0.001) throw new Error('hospital Sep-28E case calc out of line');
const minorityTotal = P.filter((_, i) => /minorities/i.test(VP[i].name)).reduce((t, p) => t + p.value, 0), minPs = -minorityTotal / sh;
const minProfitSep28 = HOSP_MIN_SHARE * PAT_TO_EBITDA * sep28('hcs'), minImpliedPe = hospMult * (1 - HOSP_NET_DEBT / (hospMult * sep28('hcs'))) / PAT_TO_EBITDA;
const IMCL = C.investments, imclMv = IMCL.imclShares * IMCL.imclClose / 1e7;
const netDebtSep28 = -part(/^Net debt/).value;
const nonHosp = V.sotp.equity - part(/^Hospitals/).value; // everything except the hospital EV
const impliedHospMult = (mcap - nonHosp) / hospSep28; // what the share price pays for the hospitals
const newcoEq = (hcoSep28 + KEIMED_SEP28) * newcoMult.base; // NewCo EV at 100% (before NewCo debt)

// Own one-year-forward EV/EBITDA since Apr-2021: EV = price x shares + Screener borrowings (incl. leases since FY20 and
// CCPS since FY25) - cash - investments - long deposits, latest March balance sheet public by then; EBITDA of the next
// full fiscal year (actual, then ours). Trough years (forward EBITDA < half the best of the previous three) left out.
const DEPOSITS = { 2025: 48, 2026: AS.otherTreasury.base };
const ebBy = {}; A.labels.forEach((l, i) => (ebBy[2000 + +l.slice(2)] = A.ebitda[i])); YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const ndFy = fy => { const i = A.labels.indexOf('FY' + String(fy).slice(2)); return A.borrowings[i] - (A.cash[i] || 0) - (A.investments[i] || 0) - (DEPOSITS[fy] || 0); };
const ndAt = d => { let fy = +d.slice(0, 4); if (d < `${fy}-05-30`) fy -= 1; return ndFy(fy); };
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const troughFy = fy => { const pk = Math.max(...[ebBy[fy - 1], ebBy[fy - 2], ebBy[fy - 3]].filter(v => v != null)); return !(ebBy[fy] > 0) || ebBy[fy] < 0.5 * pk; };
const evAll = M.price.series.filter(([d]) => d >= '2021-04-01' && d <= ASOF).map(([d, p]) => [d, Math.round((p * sh + ndAt(d)) / ebBy[fyOf(d)] * 10) / 10, fyOf(d)]);
const fwdEv = evAll.filter(x => !troughFy(x[2])), troughEv = [...new Set(evAll.filter(x => troughFy(x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const stat = arr => { const v = arr.slice().sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const HEV = stat(fwdEv.map(x => x[1])), HEVy = y => stat(evAll.filter(x => x[0].startsWith(y)).map(x => x[1]));
const evNow = evAll.at(-1)[1];
const FM = forwardMedian('APOLLOHOSP', M), fwdPe = forwardSeries('APOLLOHOSP', M, 'eps').filter(x => x[0] >= '2021-04-01');
const HPE = stat(FM.series.map(x => x[1])), peNow = price / F.eps[1];

// Peers at the 30-Sep-2026 close; de-rating = trailing multiple vs its own five-year median (Screener)
const HOSP = ['APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'NH', 'MEDANTA', 'RAINBOW', 'JLHL', 'KIMS', 'ASTERDM'], DIAG = ['LALPATHLAB', 'METROPOLIS', 'VIJAYA'], PHARMA = ['ENTERO', 'MEDPLUS'];
const PEER_SYMS = [...HOSP, ...DIAG, ...PHARMA];
const PEERS = peersAsOf(PEER_SYMS, ASOF), PR = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = (sym, chart, key) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
const MED5EV = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')])), MED5PE = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const drEv = Object.fromEntries(PEER_SYMS.map(s => [s, (PR[s].evEbitda / MED5EV[s] - 1) * 100])), drPe = Object.fromEntries(PEER_SYMS.map(s => [s, (PR[s].pe / MED5PE[s] - 1) * 100]));
const CORE = ['MAXHEALTH', 'FORTIS', 'NH', 'MEDANTA', 'RAINBOW', 'JLHL'], LEFT_OUT = ['KIMS', 'ASTERDM'];
const median = a => { const v = a.slice().sort((x, y) => x - y), k = v.length; return k % 2 ? v[(k - 1) / 2] : (v[k / 2 - 1] + v[k / 2]) / 2; };
const sectorDrEv = median(CORE.map(s => drEv[s])), sectorDrPe = median(CORE.map(s => drPe[s])), allDrEv = median([...CORE, ...LEFT_OUT].map(s => drEv[s]));
const evAfter = HEV.med * (1 + sectorDrEv / 100), evBearDerived = HEV.p25 * (1 + sectorDrEv / 100), peAfter = FM.median * (1 + sectorDrPe / 100), peBearDerived = HPE.p25 * (1 + sectorDrPe / 100);
const hm = vpart(/^Hospitals/).multiple, pem = AS.valuation.blend.methods.find(m => m.key === 'pe').multiple;
if (Math.round(evAfter) !== hm.base || Math.round(HEV.p75) !== hm.bull || Math.round(evBearDerived) !== hm.bear) throw new Error(`hospital multiple not derived: ${n1(evAfter)} / ${n1(HEV.p75)} / ${n1(evBearDerived)} vs ${hm.base}/${hm.bull}/${hm.bear}`);
if (Math.round(peAfter) !== pem.base || Math.round(FM.median) !== pem.bull || Math.round(peBearDerived) !== pem.bear) throw new Error(`P/E multiple not derived: ${n1(peAfter)} / ${n1(FM.median)} / ${n1(peBearDerived)} vs ${pem.base}/${pem.bull}/${pem.bear}`);
const diagMed5 = median(DIAG.map(s => MED5EV[s])), diagNow = median(DIAG.map(s => PR[s].evEbitda));
const shortName = s => ({ APOLLOHOSP: 'Apollo', MAXHEALTH: 'Max Healthcare', FORTIS: 'Fortis', NH: 'Narayana Hrudayalaya', MEDANTA: 'Medanta', RAINBOW: 'Rainbow', JLHL: 'Jupiter Life Line', KIMS: 'KIMS', ASTERDM: 'Aster DM', LALPATHLAB: 'Dr Lal PathLabs', METROPOLIS: 'Metropolis', VIJAYA: 'Vijaya Diagnostic', ENTERO: 'Entero Healthcare', MEDPLUS: 'MedPlus' }[s] || s);

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street standing on 30-Sep-2026
const ST = D.street.brokers, byB = n => ST.find(s => s.broker === n);
const pl = byB('Prabhudas Lilladher'), isec = byB('ICICI Securities'), mosl = byB('Motilal Oswal'), antique = byB('Antique Stock Broking');
const postQ1 = ST.filter(s => s.date >= '2026-08'), avgPost = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length;
const isecOnOurs = 28 * isec.hospEbitdaFy28 / hospSep28; // ICICI's 28x FY28E, restated on our Sep-28E hospital EBITDA
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, ebitdaCagrFwd = (Math.pow(F.ebitda[2] / A.ebitda[b], 1 / 3) - 1) * 100;
const hospCagrHist = (Math.pow(ann('FY26').hcsEbitda / ann('FY23').hcsEbitda, 1 / 3) - 1) * 100, hospCagrFwd = (Math.pow(SEG.hcs.adjEbitda[2] / ann('FY26').hcsEbitda, 1 / 3) - 1) * 100;

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, shortDate, SA, SQ, QL, Q1, FY26, AK, ann, b, YRS, yi, SEG, sep28,
  BH, disch, ipRev, netRev, hcsBuild, arpob, RENT, preEbitda, preMargin, price, sh, mcap, BM, mv, P, VP, part, vpart, hospMult, hospSep28, hcoSep28, ahllSep28, NEWCO_PCT, newcoMult, KEIMED_SEP28,
  HOSP_MIN26, HOSP_PAT_PRE, HOSP_MIN_SHARE, PAT_TO_EBITDA, HOSP_NET_DEBT, AHLL_MIN26, minorityTotal, minPs, minProfitSep28, minImpliedPe, imclMv, netDebtSep28, nonHosp, impliedHospMult, newcoEq, evAll, fwdEv, troughEv, HEV, HEVy, evNow, FM, fwdPe, HPE, peNow,
  HOSP, DIAG, PHARMA, PEER_SYMS, PEERS, PR, MED5EV, MED5PE, drEv, drPe, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, allDrEv, evAfter, evBearDerived, peAfter, peBearDerived, diagMed5, diagNow, shortName,
  rating, buyBelow, sellAbove, ruleText, ST, pl, isec, mosl, antique, postQ1, avgPost, isecOnOurs, epsCagrFwd, ebitdaCagrFwd, hospCagrHist, hospCagrFwd };
