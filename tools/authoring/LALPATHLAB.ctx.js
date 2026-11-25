// Dr Lal PathLabs initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and the
// built model and computes, once: the driver build (patients x revenue per patient, checked against model revenue), the
// tax-plus-minorities build (the engine has no minority line), the lease and interest builds, the gross-treasury path and
// the other-income build (checked against assumptions.json), the bottom-up D&A schedule vs the engine's single rate, EPS
// before exceptional items (the basis of the multiple's history), the trough test, the forward P/E history since Apr-2021
// (every weekly close plus the 30-Sep close), the diagnostics sector factor (P/E -0.6%, EV/EBITDA +21.5%, three peers,
// reproduced per peer exactly as tools/authoring/sector-factor.js), the target multiples, the forward EV/EBITDA cross-check,
// the SN Genelab pro-forma, peers and the street. As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'LALPATHLAB', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'LALPATHLAB.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'LALPATHLAB', 'screener.json'), 'utf8')); // unpatched
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2021-04-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pctl = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26;
const b = A.labels.length - 1; // FY26 index
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;

// 1) Driver build: patients x revenue per patient must reproduce model revenue
const RB = AS.revenueBuild;
const rpp0 = A.sales[b] * 10 / RB.patientsMn; // ₹ per patient (₹ cr x 1e7 / patients)
const patients = [], rpp = [];
YRS.forEach((_, i) => { patients.push((i ? patients[i - 1] : RB.patientsMn) * (1 + RB.patientGrowth[i] / 100)); rpp.push((i ? rpp[i - 1] : rpp0) * (1 + RB.rppGrowth[i] / 100)); });
const buildRev = YRS.map((_, i) => patients[i] * rpp[i] / 10);
YRS.forEach((y, i) => { if (Math.abs(buildRev[i] / F.sales[i] - 1) > 0.003) throw new Error(`LALPATHLAB build ${y}: ${n0(buildRev[i])} != model ${n0(F.sales[i])}`); });

// 2) Tax and minorities (assumptions.taxBuild): engine tax rate = (25.4% x PBT + minorities) / PBT
const TB = AS.taxBuild, MIN = TB.minorities;
const taxRateBuild = YRS.map((_, i) => Math.round((TB.taxOnPbt[i] / 100 * F.pbt[i] + MIN[i]) / F.pbt[i] * 10000) / 100);
const taxOk = YRS.every((_, i) => Math.abs(taxRateBuild[i] - AS.taxRate[i]) < 0.02);

// 3) Leases and interest (assumptions.leaseBuild)
const LB = AS.leaseBuild, LEASES = [LB.mar26, ...LB.closing];
const intBuild = YRS.map((_, i) => Math.round((LB.rate / 100 * (LEASES[i] + LEASES[i + 1]) / 2 + LB.otherFinance) * 10) / 10);
const intOk = YRS.every((_, i) => Math.abs(intBuild[i] - AS.interest[i]) <= 0.15);

// 4) Gross treasury and the other-income build. Engine treasury = cash + investments + non-current deposits − lease
//    liabilities (new leases are in capex), so gross treasury = engine net cash + lease liabilities on our path.
const nc0 = A.cash[b] + A.investments[b] + (AS.otherTreasury?.base || 0) - A.borrowings[b]; // Mar-26 engine net cash (~₹1,328 cr)
const T26 = FY26.treasury.total, T25 = C.fy26.treasuryMar25.total;
const grossCash = [T26, ...YRS.map((_, i) => F.treasury[i] + LEASES[i + 1])];
const TY = 6.75, MISC = 6;
const oiTreas = YRS.map((_, i) => TY / 100 * (grossCash[i] + grossCash[i + 1]) / 2);
const oiBuild = YRS.map((_, i) => Math.round(oiTreas[i] + MISC));
const oiOk = YRS.every((_, i) => Math.abs(oiBuild[i] - AS.otherIncome[i]) <= 1);
const OI = FY26.otherIncome, treas26 = OI.bankInterest + OI.fvtplGain + OI.saleGain, avgT26 = (T25 + T26) / 2, yld26 = treas26 / avgT26 * 100;
const oi26Basis = OI.total - OI.badDebtRecovered - OI.taxRefundInterest;
const OQ = RAW.schedules.quarters['Other Income']['Other income normal'];
const ttmOi = ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026'].reduce((s, p) => s + (OQ[p] || 0), 0);
const netCash = [nc0, ...F.treasury]; // after lease liabilities

// 5) D&A: bottom-up schedule vs the engine's single rate on gross block
const DA = AS.daBuild;
const daBuild = YRS.map((_, i) => DA.ppeSoftware[i] + DA.rou[i] + DA.investmentProperty[i] + DA.acquisitionIntangibles[i]);
const daDiff = YRS.map((_, i) => F.dep[i] - daBuild[i]); // engine − schedule
const daEpsEffect = YRS.map((_, i) => -daDiff[i] * (1 - TB.taxOnPbt[i] / 100) / SHARES); // + = engine EPS above the schedule's
const acq26 = FY26.intangiblesAmortisation.brand + FY26.intangiblesAmortisation.customerRelationships + FY26.intangiblesAmortisation.nonCompete + FY26.intangiblesAmortisation.trademarks;

// 6) EPS bases. History: Screener EPS (bonus-adjusted, after minorities). Base = before exceptional items: FY25 less the
//    ₹40.8 cr Suburban-liquidation tax credit, FY26 plus the ₹22.5 cr after-tax labour-code charge (company.json). Model EPS
//    is to shareholders (minorities in the tax line) and carries no exceptional items.
const pl = RAW.tables['profit-loss'];
const epsRep = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) epsRep[+p.slice(-4)] = pl.rows['EPS in Rs'][i]; });
const epsU = F.eps.slice(), epsSep = sep(epsU);
const epsBase = { ...epsRep, 2025: C.epsBeforeExceptional.FY25, 2026: C.epsBeforeExceptional.FY26, 2027: epsU[0], 2028: epsU[1], 2029: epsU[2] };
const epsRepAll = { ...epsRep, 2027: epsU[0], 2028: epsU[1], 2029: epsU[2] };
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
// Trough rule (PLAYBOOK §4): forward EPS a loss or below half the highest EPS of the previous three years
const troughOn = by => fy => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); const pk = Math.max(...prev); return !(by[fy] > 0) || by[fy] < 0.5 * pk; };
const troughList = by => [2022, 2023, 2024, 2025, 2026, 2027, 2028].filter(troughOn(by)).map(y => `FY${String(y).slice(2)}`);
const TROUGH_BASE = troughList(epsBase), TROUGH_REP = troughList(epsRepAll);
const troughRow = (by, fys) => fys.map(fy => { const pk = Math.max(by[fy - 1], by[fy - 2], by[fy - 3]); return { fy, eps: by[fy], peak: pk, half: 0.5 * pk }; });

// 7) Forward P/E history on every weekly close (+ the 30-Sep close): price ÷ the next full fiscal year's EPS
const px = RAW.charts.price.Price.filter(([d]) => d >= FROM && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const seriesOn = (by, from, to = ASOF) => px.filter(([d]) => d >= from && d <= to).map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10]);
const stat = s => { const v = s.map(x => x[1]); return { med: medOf(v), p25: pctl(v, 0.25), p75: pctl(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }; };
const sBase = seriesOn(epsBase, FROM), HB = stat(sBase); // BASE: since Apr-2021, EPS before exceptional items
const HR = stat(seriesOn(epsRepAll, FROM)); // reported EPS, same window
const H22 = stat(seriesOn(epsBase, '2022-04-01')); // sensitivity: window from Apr-2022 (drops the COVID-boom prices)
const H22R = stat(seriesOn(epsRepAll, '2022-04-01'));
const yearWin = [['2021-04-01', '2022-03-31'], ['2022-04-01', '2023-03-31'], ['2023-04-01', '2024-03-31'], ['2024-04-01', '2025-03-31'], ['2025-04-01', '2026-03-31'], ['2026-04-01', ASOF]].map(([a, z]) => ({ a, z, fy: `FY${String(fyOf(a)).slice(2)}${fyOf(a) >= 2027 ? 'E' : ''}`, ...stat(seriesOn(epsBase, a, z)) }));
const FM = forwardMedian('LALPATHLAB', M); // house function: reported EPS, every 5th week, trough years left out
const fwdNow = price / epsU[1], fwdNow27 = price / epsU[0], fwdNowSep = price / epsSep;
const trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;
const trailEpsEx = trailEps + C.exceptional.FY26.afterTax / SHARES; // Q3FY26 labour-code charge added back

// 8) Sector factor (PLAYBOOK §7c): the three diagnostics peers' P/E (EV/EBITDA) at the 30-Sep close vs their five-year
//    medians, excluding Dr Lal; same arithmetic as tools/authoring/sector-factor.js (positive weekly points from
//    30-Sep-2021, interpolated median, current multiple from asof-peers.js)
const PEER_SET = D.peers.set;
const PEERS = peersAsOf([...PEER_SET, 'LALPATHLAB'], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const medI = a => { const s = [...a].sort((x, y) => x - y); const i = (s.length - 1) / 2, lo = Math.floor(i); return s[lo] + (s[Math.ceil(i)] - s[lo]) * (i - lo); };
const ser = (sym, a, k2) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.[a]?.[k2] || [];
const med5 = (sym, a, k2) => medI(ser(sym, a, k2).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]));
const ALLS = [...PEER_SET, 'LALPATHLAB'];
const MED5 = Object.fromEntries(ALLS.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const dr5 = Object.fromEntries(ALLS.map(s => [s, +((P[s].pe / MED5[s] - 1) * 100).toFixed(1)]));
const MED5EV = Object.fromEntries(ALLS.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const dr5ev = Object.fromEntries(ALLS.map(s => [s, +((P[s].evEbitda / MED5EV[s] - 1) * 100).toFixed(1)]));
const sectorCalc = medOf(PEER_SET.map(s => dr5[s])), sectorEvCalc = medOf(PEER_SET.map(s => dr5ev[s]));
const SECTOR = -0.6, SECTOR_EV = 21.5; // the batch figures (brief, 30-Sep-2026); our reproduction is sectorCalc / sectorEvCalc
const k = 1 + SECTOR / 100, kev = 1 + SECTOR_EV / 100;
const shortName = s => ({ METROPOLIS: 'Metropolis Healthcare', VIJAYA: 'Vijaya Diagnostic', THYROCARE: 'Thyrocare', LALPATHLAB: 'Dr Lal PathLabs' }[s] || s);
// Why the two metrics disagree: profit vs EBITDA growth at each peer in its last full year (Screener)
const peerConv = Object.fromEntries(ALLS.map(s => { const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8')); const t = S.tables['profit-loss']; const i = t.periods.indexOf('Mar 2026'), j = t.periods.indexOf('Mar 2025'); return [s, { patG: (t.rows['Net Profit'][i] / t.rows['Net Profit'][j] - 1) * 100, ebitdaG: (t.rows['Operating Profit'][i] / t.rows['Operating Profit'][j] - 1) * 100 }]; }));

// 9) Target multiples (derived): base = median x factor; bull / bear = 75th / 25th percentile x factor; nearest half-turn.
const MULT = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };
const multRep = half(HR.med * k), mult22 = half(H22.med * k), mult22R = half(H22R.med * k), multHouse = half(FM.median * k), multNoK = half(HB.med), multOwnMid = half(HB.med * (1 + (SECTOR + dr5.LALPATHLAB) / 2 / 100)), multEvK = half(HB.med * kev), multGrowth = half(HB.med * k * 1.1);
const EPSC = { base: epsSep, bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) }; // scenario EPS are rounded to ₹0.1 in the model JSON

// 10) Forward EV/EBITDA history since Apr-2021 (cross-check): EV = price x 16.76 cr shares + net debt at the latest March
//     published by end-May (lease liabilities − cash − investments − non-current deposits where disclosed: Mar-25 ₹64 cr,
//     Mar-26 ₹194 cr); EBITDA = the next full fiscal year's (Screener actuals FY22-26, our FY27-28E). Applied to Sep-28E
//     EBITDA plus the engine's Sep-28E net cash (engine roll).
const SH_ACT = 16.755502;
const bs = RAW.tables['balance-sheet'], cashSch = RAW.schedules['balance-sheet']['Other Assets']['Cash Equivalents'];
const NC_DEP = { 2025: 63.98, 2026: 193.92 };
const ndFy = fy => { const j = bs.periods.indexOf(`Mar ${fy}`); return bs.rows.Borrowings[j] - (cashSch[`Mar ${fy}`] || 0) - bs.rows.Investments[j] - (NC_DEP[fy] || 0); };
const ebBy = {}; pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) ebBy[+p.slice(-4)] = pl.rows['Operating Profit'][i]; });
YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const fwdEv = px.map(([d, p]) => { let fyBs = +d.slice(0, 4); if (d < `${fyBs}-05-31`) fyBs -= 1; return [d, Math.round((p * SH_ACT + ndFy(Math.min(fyBs, 2026))) / ebBy[fyOf(d)] * 10) / 10]; });
const HEV = stat(fwdEv), HEV22 = stat(fwdEv.filter(([d]) => d >= '2022-04-01'));
const EVM = { base: half(HEV.med * kev), bull: half(HEV.p75 * kev), bear: half(HEV.p25 * kev) };
const EVM_PEFACTOR = half(HEV.med * k);
const ebitdaSep = sep(F.ebitda), treasSep = sep(F.treasury), evNowFwd = (mcap - nc0) / F.ebitda[1];
const evValAt = m => (m * ebitdaSep + treasSep) / SHARES;

// 11) SN Genelab (70%, board approval 24-Sep-2026, close expected by 30-Nov-2026) and Ghana (80%, ~₹38 cr): not in the base.
//     Pro-forma Sep-28E: revenue ₹57.96 cr (FY26) +15% a year; EBITDA margin ~26% (Emkay: ~16x FY26 EV/EBITDA on the
//     ₹240 cr implied by ₹168 cr for 70%); D&A 3% of revenue (no PPA amortisation known); tax 25.4%; Dr Lal's 70% share;
//     less treasury income lost on the cash paid (6.75%, after tax).
const SNG = { rev26: 57.96, cash: 168, earnout: 31.5, stake: 0.7, evEbitda: 16, ghana: 38, g: 15, dep: 3 };
SNG.ev = SNG.cash / SNG.stake; SNG.ebitda26 = SNG.ev / SNG.evEbitda; SNG.margin = SNG.ebitda26 / SNG.rev26 * 100;
SNG.revSep = SNG.rev26 * Math.pow(1 + SNG.g / 100, 2.5); SNG.ebitdaSep = SNG.revSep * SNG.margin / 100;
SNG.patShareSep = (SNG.ebitdaSep - SNG.revSep * SNG.dep / 100) * (1 - 0.254) * SNG.stake;
SNG.lostOi = SNG.cash * TY / 100 * (1 - 0.254); SNG.lostOiGhana = SNG.ghana * TY / 100 * (1 - 0.254);
SNG.epsEffect = (SNG.patShareSep - SNG.lostOi) / SHARES; SNG.epsEffectAll = (SNG.patShareSep - SNG.lostOi - SNG.lostOiGhana) / SHARES;
SNG.cashPs = (SNG.cash + SNG.ghana) / SHARES;

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const multOk = ['base', 'bull', 'bear'].every(c => PEM.multiple[c] === MULT[c]);
const evOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === EVM[c]);
if (!process.env.TP_NOCHECK) {
  if (!oiOk) throw new Error(`LALPATHLAB other income: build ${oiBuild} vs assumptions ${AS.otherIncome}; run node tools/authoring/LALPATHLAB.mult.js`);
  if (!intOk) throw new Error(`LALPATHLAB interest: build ${intBuild} vs assumptions ${AS.interest}`);
  if (!taxOk) throw new Error(`LALPATHLAB tax: build ${taxRateBuild} vs assumptions ${AS.taxRate}; run LALPATHLAB.mult.js`);
  if (!multOk || !evOk) throw new Error(`LALPATHLAB: assumptions multiples differ from the derivation (P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}); run LALPATHLAB.mult.js`);
  if (Math.abs(sectorCalc - SECTOR) > 0.05 || Math.abs(sectorEvCalc - SECTOR_EV) > 0.05) throw new Error(`LALPATHLAB sector factor reproduction ${sectorCalc} / ${sectorEvCalc} differs from the batch ${SECTOR} / ${SECTOR_EV}`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'pe').value; if (Math.abs(pv - MULT[c] * EPSC[c]) > (c === 'base' ? 1 : MULT[c] * 0.06)) throw new Error(`LALPATHLAB ${c} P/E value ${Math.round(pv)} != ${MULT[c]}x Sep-28E EPS`); if (tp !== Math.round(pv / 10) * 10) throw new Error(`LALPATHLAB ${c} target ${tp} is not the P/E value ${Math.round(pv)}`); });
}
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagr = (Math.pow(epsU[2] / epsBase[2026], 1 / 3) - 1) * 100, epsCagrRep = (Math.pow(epsU[2] / epsRep[2026], 1 / 3) - 1) * 100;
const ebitdaCagr = (Math.pow(F.ebitda[2] / A.ebitda[b], 1 / 3) - 1) * 100, salesCagr = (Math.pow(F.sales[2] / A.sales[b], 1 / 3) - 1) * 100;
const histEpsCagr = (Math.pow(epsBase[2026] / epsRep[2022], 1 / 4) - 1) * 100; // FY22 (COVID peak) to FY26

// 12) Street as it stood on 30-Sep-2026
const ST = D.street.brokers, byB = n => ST.find(s => s.broker === n);
const emkay = byB('Emkay Global'), nom = byB('Nomura'), jm = byB('JM Financial'), kie = byB('Kotak Institutional Equities'), isec = byB('ICICI Securities'), one = byB('360 ONE'), hsie = byB('HDFC Securities');
const withTp = ST.filter(s => s.tp), postQ1 = ST.filter(s => s.date >= '2026-07-24' && s.tp), medTp = medOf(withTp.map(s => s.tp)), medPost = medOf(postQ1.map(s => s.tp));
const methodCount = ST.reduce((o, s) => { const m = s.method || 'n.d.'; o[m] = (o[m] || 0) + 1; return o; }, {});

module.exports = { ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, n0, n1, n2, pc, pc1, rup, half, shortDate, medOf, pctl, SA, SQ, QL, Q1, FY26, b, YRS, sep, price, SHARES, mcap,
  RB, rpp0, patients, rpp, buildRev, TB, MIN, taxRateBuild, LB, LEASES, intBuild, nc0, T26, T25, grossCash, TY, MISC, oiTreas, oiBuild, OI, treas26, avgT26, yld26, oi26Basis, ttmOi, netCash,
  DA, daBuild, daDiff, daEpsEffect, acq26, epsRep, epsU, epsSep, epsBase, epsRepAll, fyOf, TROUGH_BASE, TROUGH_REP, troughRow, sBase, HB, HR, H22, H22R, yearWin, FM, fwdNow, fwdNow27, fwdNowSep, trailEps, trailPe, trailEpsEx,
  PEER_SET, PEERS, P, MED5, dr5, MED5EV, dr5ev, sectorCalc, sectorEvCalc, SECTOR, SECTOR_EV, k, kev, shortName, peerConv, MULT, multRep, mult22, mult22R, multHouse, multNoK, multOwnMid, multEvK, multGrowth, EPSC,
  SH_ACT, fwdEv, HEV, HEV22, EVM, EVM_PEFACTOR, ebitdaSep, treasSep, evNowFwd, evValAt, SNG, BM, mv, multOk, evOk, rating, buyBelow, sellAbove, epsCagr, epsCagrRep, ebitdaCagr, salesCagr, histEpsCagr,
  ST, emkay, nom, jm, kie, isec, one, hsie, withTp, postQ1, medTp, medPost, methodCount };

if (require.main === module) {
  console.log('build', buildRev.map(n0), 'model', F.sales.map(n0), '| patients', patients.map(n1), 'rpp', rpp.map(n0), 'rpp0', n0(rpp0));
  console.log('tax build', taxRateBuild, 'vs', AS.taxRate, taxOk, '| PBT', F.pbt.map(n0));
  console.log('interest build', intBuild, 'vs', AS.interest, intOk);
  console.log('gross cash', grossCash.map(n0), 'OI build', oiBuild, 'vs', AS.otherIncome, oiOk, '| FY26 treasury yield', n2(yld26), 'OI basis', n1(oi26Basis), 'TTM', ttmOi, '| net cash', netCash.map(n0));
  console.log('D&A schedule', daBuild.map(n1), 'engine', F.dep.map(n1), 'diff', daDiff.map(n1), 'EPS effect', daEpsEffect.map(n2), 'acq26', n1(acq26));
  console.log('EPS model', epsU.map(n2), 'Sep-28E', n2(epsSep), '| base', JSON.stringify(Object.fromEntries(Object.entries(epsBase).filter(([y]) => y >= 2020).map(([a, c]) => [a, +c.toFixed(2)]))));
  console.log('trough base', TROUGH_BASE, 'rep', TROUGH_REP, JSON.stringify(troughRow(epsBase, [2023, 2024])));
  console.log('hist base', JSON.stringify(HB), '| rep', JSON.stringify(HR), '| Apr22', JSON.stringify(H22), '| Apr22 rep', H22R.med, '| house', FM.median, FM.medianAll, FM.troughYears);
  console.log('by year', yearWin.map(w => `${w.fy} ${n1(w.med)}`).join(' | '), '| now fwd FY28E', n1(fwdNow), 'FY27E', n1(fwdNow27), 'Sep28', n1(fwdNowSep), 'trail', n1(trailPe), 'trail ex', n1(price / trailEpsEx));
  console.log('sector', sectorCalc, 'ev', sectorEvCalc, ALLS.map(s => `${s} PE ${P[s].pe}/${n1(MED5[s])}=${dr5[s]} EV ${P[s].evEbitda}/${n1(MED5EV[s])}=${dr5ev[s]}`).join('; '));
  console.log('conv', JSON.stringify(Object.fromEntries(Object.entries(peerConv).map(([s, o]) => [s, `${n1(o.patG)}/${n1(o.ebitdaG)}`]))));
  console.log('MULT', MULT, 'ok?', multOk, evOk, '| sens rep', multRep, 'Apr22', mult22, mult22R, 'house', multHouse, 'noK', multNoK, 'mid', multOwnMid, 'evK', multEvK, 'growth', multGrowth);
  console.log('EV hist', JSON.stringify(HEV), 'Apr22', HEV22.med, 'EVM', JSON.stringify(EVM), 'alt', EVM_PEFACTOR, 'evNowFwd', n1(evNowFwd), 'EV at EVM', n0(evValAt(EVM.base)));
  console.log('SNG', JSON.stringify(Object.fromEntries(Object.entries(SNG).map(([a, c]) => [a, +(+c).toFixed(2)]))));
  console.log('TP', V.tp, 'upside', V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'scen', SC.bull.tp, SC.bear.tp, 'eps cagr', n1(epsCagr), 'hist', n1(histEpsCagr), 'methods', JSON.stringify(methodCount), 'medTp', medTp, medPost);
}
