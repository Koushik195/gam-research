// Alkem Laboratories initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and
// the built model and computes, once: the business-line build (checked against model revenue), the other-income build
// (treasury yield on opening net cash + income on cash matched by borrowings + recurring items; checked against the
// engine), EPS to shareholders (engine profit less minorities: the engine has no minority line), the one-year-forward P/E
// history since Apr-2021 on EPS before exceptional items (A18; house sampling and median), the pharma sector factor
// (PLAYBOOK §7c A20: +10.25%, reproduced per peer) and its EV/EBITDA analogue, the target multiples and their translation
// into the engine's multiple on engine Sep-28E EPS, the EV/EBITDA cross-check, peers and the street. As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const PATCH = require('./ALKEM.patch');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ALKEM', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ALKEM.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'ALKEM', 'screener.json'), 'utf8')); // unpatched
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2021-04-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const cagr = (a, z, y) => (Math.pow(z / a, 1 / y) - 1) * 100;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pctl = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const statOf = arr => ({ med: pctl(arr, 0.5), p25: pctl(arr, 0.25), p75: pctl(arr, 0.75), min: Math.min(...arr), max: Math.max(...arr), n: arr.length });
const SRC = 'Alkem presentations, earnings calls and annual reports; GAM Research';
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26;
const b = A.labels.length - 1; // FY26 index
const ix = fy => A.labels.indexOf(fy);
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;

// 1) Business-line build must sum to model revenue
const BL = AS.businessLines, LINES = ['india', 'us', 'row', 'occlutech', 'otherOp'];
const LBL = { india: 'India (branded + trade generics)', us: 'United States', row: 'Other international', occlutech: 'Occlutech (MedTech, from Jul-26)', otherOp: 'Other operating income' };
const build = { india: [], us: [], row: [], occlutech: BL.occlutech.slice(), otherOp: BL.otherOp.slice() };
{ const v = { ...BL.base }; YRS.forEach((_, i) => { for (const k of ['india', 'us', 'row']) { v[k] *= 1 + BL.growth[k][i] / 100; build[k].push(v[k]); } }); }
const buildTot = YRS.map((_, i) => LINES.reduce((s, k) => s + build[k][i], 0));
const base26 = { ...BL.base, occlutech: 0, otherOp: FY26.otherOp };
if (Math.abs(BL.base.india + BL.base.us + BL.base.row + FY26.otherOp - A.sales[b]) > 1) throw new Error('ALKEM business-line base does not sum to FY26 revenue');
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.002) throw new Error(`ALKEM build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });
const mixPct = k => YRS.map((_, i) => build[k][i] / buildTot[i] * 100);

// 2) Other income build: treasury yield x opening net cash (engine) + 6.9% on cash matched by borrowings and leases (gross-up,
//    held flat) + recurring items (FY26 write-backs + miscellaneous). Must equal assumptions.otherIncome and the engine.
const OI = FY26.otherIncome;
const TREAS26 = OI.bankInterest + OI.bondInterest + OI.saleOfInvestments + OI.fvLoss; // ₹445.4 cr
const GROSS25 = 5787.5, GROSS26 = FY26.grossTreasury, YIELD26 = TREAS26 / ((GROSS25 + GROSS26) / 2) * 100; // 6.88%
const GROSS_DEBT = A.borrowings[b]; // ₹2,047 cr incl. leases (Screener)
const TY = AS.treasuryYield, GROSSUP = TY.map(t => t / 100 * GROSS_DEBT), RECUR = OI.writeBacks + OI.misc;
const oiItems = YRS.map((_, i) => GROSSUP[i] + RECUR);
const nd0 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - A.borrowings[b]; // engine net cash Mar-26
const openCash = YRS.map((_, i) => (i ? F.treasury[i - 1] : nd0));
const oiTreas = YRS.map((_, i) => TY[i] / 100 * Math.max(openCash[i], 0));
const oiOk = YRS.every((y, i) => Math.abs(oiItems[i] - AS.otherIncome[i]) <= 0.5 && Math.abs(oiTreas[i] + AS.otherIncome[i] - F.otherIncome[i]) <= 2);
const OIN = RAW.schedules.quarters['Other Income']['Other income normal'];
const ttmOi = ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026'].reduce((s, p) => s + (OIN[p] || 0), 0);
const LEASES = FY26.leases, ndCo = [FY26.netCashCompany, ...F.treasury.map(t => t + LEASES)]; // company basis (ex-leases), Mar-26..Mar-29
if (Math.abs(nd0 + LEASES - FY26.netCashCompany) > 2) throw new Error(`ALKEM opening net cash ${n0(nd0 + LEASES)} != company ${FY26.netCashCompany}`);

// 3) EPS to shareholders: engine profit includes minorities (no minority line). FY26 ₹49.4 cr (Indchemie 49%, Cachet 39.4%);
//    Q1FY27 ₹1.5 cr (seasonally low quarter); from mid-Jul-2026 45% of Occlutech's losses go to minorities.
const MIN = [30, 45, 60];
const minPs = MIN.map(m => m / SHARES);
const epsU = F.pat.map(p => p / SHARES); // F.eps is rounded in the model JSON
const ownersEps = YRS.map((_, i) => epsU[i] - minPs[i]);
const epsSep = sep(epsU), ownersSep = sep(ownersEps);
const scenOwners = key => { const e = SC[key].eps; return { rep: sep(e), own: sep(e.map((x, i) => x - minPs[i])) }; };

// 4) One-year-forward P/E history since Apr-2021 (house sampling: every 5th weekly close; house median s[floor(n/2)]).
//    Base = EPS before exceptional items (A18: FY23 −₹89 cr, FY24 −₹99 cr, FY26 −₹138 cr after tax); forecasts = EPS to
//    shareholders (no exceptional items forecast). Reported-EPS median = sensitivity.
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const pl = RAW.tables['profit-loss'], ns = RAW.schedules['profit-loss']['Net Profit'];
const epsRep = {}, EXC_AT = {}, SHR = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4), e = pl.rows['EPS in Rs'][i]; epsRep[y] = e; EXC_AT[y] = ns['Exceptional items AT'][p] || 0; SHR[y] = ns['Profit for EPS'][p] / e; } });
const byBase = {}, byRep = {};
Object.keys(epsRep).forEach(y => { byRep[y] = epsRep[y]; byBase[y] = epsRep[y] - EXC_AT[y] / SHR[y]; });
YRS.forEach((y, i) => { const fy = 2000 + +y.slice(2, 4); byBase[fy] = ownersEps[i]; byRep[fy] = ownersEps[i]; });
const trough = (by, fy) => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); const pk = prev.length ? Math.max(...prev) : null; return !(by[fy] > 0) || (pk > 0 && by[fy] < 0.5 * pk); };
const pxAll = RAW.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= FROM);
const seriesOn = by => pxAll.filter(([d]) => !trough(by, fyOf(d))).map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10]);
const sBase = seriesOn(byBase), sRep = seriesOn(byRep);
const troughBase = [...new Set(pxAll.filter(([d]) => trough(byBase, fyOf(d))).map(([d]) => `FY${String(fyOf(d)).slice(2)}`))];
const HB = statOf(sBase.map(x => x[1])), HR = statOf(sRep.map(x => x[1]));
const byFwdFy = {}; sBase.forEach(([d, x]) => (byFwdFy[fyOf(d)] ||= []).push(x));
const FWDFY = Object.keys(byFwdFy).sort().map(fy => ({ fy: `FY${String(fy).slice(2)}${+fy >= 2027 ? 'E' : ''}`, med: pctl(byFwdFy[fy], 0.5), n: byFwdFy[fy].length, eps: byBase[fy] }));
const FM = forwardMedian('ALKEM', M); // house: reported EPS, engine EPS for forecast years (incl. minorities)
const peFy27 = price / ownersEps[0], peFy28 = price / ownersEps[1], peSep28 = price / ownersSep;
const ttmEps = A.ttm.eps, peTtm = price / ttmEps;
const ex26 = byBase[2026];

// 5) Sector factor (PLAYBOOK §7c A20): eight peers' trailing P/E at the 30-Sep close vs five-year median (since 30-Sep-2021),
//    excluding Alkem: set at +10.25%. EV/EBITDA analogue computed the same way (our reproduction; used for the cross-check).
const PEER_SET = D.peers.set, EXCL = Object.keys(D.peers.excluded);
const PEERS = peersAsOf([...PEER_SET, 'ALKEM'], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const ser = (sym, a, k) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.[a]?.[k] || [];
const med5 = (sym, a, k) => pctl(ser(sym, a, k).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5);
const ALL9 = [...PEER_SET, 'ALKEM'];
const MED5 = Object.fromEntries(ALL9.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const MED5EV = Object.fromEntries(ALL9.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const derate = Object.fromEntries(ALL9.map(s => [s, (P[s].pe / MED5[s] - 1) * 100]));
const derateEv = Object.fromEntries(ALL9.map(s => [s, (P[s].evEbitda / MED5EV[s] - 1) * 100]));
const sectorCalc = medOf(PEER_SET.map(s => derate[s])), sectorEv = medOf(PEER_SET.map(s => derateEv[s]));
const SECTOR = 10.25, k = 1 + SECTOR / 100, kev = 1 + Math.round(sectorEv * 100) / 10000;
if (Math.abs(sectorCalc - SECTOR) > 0.05) throw new Error(`ALKEM sector factor ${sectorCalc.toFixed(2)}% differs from the PLAYBOOK +10.25%`);
const LARGE = ['SUNPHARMA', 'DIVISLAB', 'TORNTPHARM', 'ZYDUSLIFE', 'CIPLA'], sectorLarge = medOf(LARGE.map(s => derate[s]));
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma' }[s] || s);

// 6) Target multiples (derived) and the engine's equivalent multiples on its Sep-28E EPS (which includes minorities)
const MULT = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };
const EPSC = { base: { rep: epsSep, own: ownersSep }, bull: scenOwners('bull'), bear: scenOwners('bear') };
const ENGINE = Object.fromEntries(Object.entries(MULT).map(([c, m]) => [c, Math.round(m * EPSC[c].own / EPSC[c].rep * 100) / 100]));
const tpOwn = Object.fromEntries(Object.entries(MULT).map(([c, m]) => [c, Math.round(m * EPSC[c].own / 10) * 10]));
const SENS = { reported: half(HR.med * k), house: half(FM.median * k), noFactor: half(HB.med), own: half(HB.med * (1 + derate.ALKEM / 100)), mid: half(HB.med * (1 + (SECTOR + derate.ALKEM) / 2 / 100)), large: half(HB.med * (1 + sectorLarge / 100)) };
const val = m => Math.round(m * ownersSep / 10) * 10;

// 7) EV/EBITDA cross-check: Alkem's trailing EV/EBITDA since Apr-2021 (Screener) x the EV analogue factor, on trailing
//    EBITDA at the target date (½ FY27E + ½ FY28E) plus net cash at Sep-27 (engine basis)
const evHist = ser('ALKEM', 'evEbitda', 'EV Multiple').filter(([d, x]) => d >= FROM && d <= ASOF && x > 0);
const HEV = statOf(evHist.map(x => x[1]));
const EVM = { base: half(HEV.med * kev), bull: half(HEV.p75 * kev), bear: half(HEV.p25 * kev) };
const EVM_PE = half(HEV.med * k);
const ebitdaT27 = (F.ebitda[0] + F.ebitda[1]) / 2, treasT27 = (F.treasury[0] + F.treasury[1]) / 2;
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);
const evNow = mcap - Q1.netCashCompany, evTtm = evNow / ttmEbitda, evFy28 = (mcap - ndCo[2]) / F.ebitda[1];

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const multOk = ['base', 'bull', 'bear'].every(c => Math.abs(PEM.multiple[c] - ENGINE[c]) < 0.03);
const evOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === EVM[c]);
if (!process.env.TP_NOCHECK) {
  if (!oiOk) throw new Error(`ALKEM other income: items ${oiItems.map(x => x.toFixed(1))} vs assumptions ${AS.otherIncome}; engine ${F.otherIncome}`);
  if (!multOk || !evOk) throw new Error(`ALKEM: assumptions multiples differ from the derivation (P/E ${JSON.stringify(ENGINE)}, EV ${JSON.stringify(EVM)}); run node tools/authoring/ALKEM.mult.js`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'pe').value; if (Math.abs(pv - tpOwn[c]) > 10) throw new Error(`ALKEM ${c} P/E value ${Math.round(pv)} != ${MULT[c]}x EPS to shareholders (${tpOwn[c]})`); if (tp !== Math.round(pv / 10) * 10) throw new Error(`ALKEM ${c} target ${tp} is not the P/E value ${Math.round(pv)}`); });
}
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagr = cagr(ex26, ownersEps[2], 3), epsCagrRep = cagr(epsRep[2026], ownersEps[2], 3), ebitdaCagr = cagr(A.ebitda[b], F.ebitda[2], 3), salesCagr = cagr(A.sales[b], F.sales[2], 3);
const roeSus = F.roe[2];

// 8) Street as it stood on 30-Sep-2026
const ST = D.street.brokers, br = n => ST.find(s => s.broker === n);
const mosl = br('Motilal Oswal'), bob = br('BOB Capital Markets'), choice = br('Choice Institutional Equities'), isec = br('ICICI Securities'), nuv = br('Nuvama');
const withTp = ST.filter(s => s.tp), medTp = medOf(withTp.map(s => s.tp)), postQ1 = ST.filter(s => s.date >= '2026-08-14');
const jun28 = 0.75 * ownersEps[1] + 0.25 * ownersEps[2];
const atOurs = { mosl: 27 * ownersSep, bob: 21 * jun28, choice: 25 * ownersEps[1] };

module.exports = { fs, path, ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, n0, n1, pc, pc1, half, cagr, shortDate, medOf, pctl, SRC, SA, SQ, QL, Q1, FY26, b, ix, YRS, sep, price, SHARES, mcap, PATCH,
  BL, LINES, LBL, build, buildTot, base26, mixPct, OI, TREAS26, GROSS25, GROSS26, YIELD26, GROSS_DEBT, TY, GROSSUP, RECUR, oiItems, nd0, openCash, oiTreas, ttmOi, LEASES, ndCo,
  MIN, minPs, epsU, ownersEps, epsSep, ownersSep, scenOwners, fyOf, epsRep, EXC_AT, SHR, byBase, byRep, sBase, sRep, troughBase, HB, HR, FWDFY, FM, peFy27, peFy28, peSep28, ttmEps, peTtm, ex26,
  PEER_SET, EXCL, PEERS, P, MED5, MED5EV, derate, derateEv, sectorCalc, sectorEv, SECTOR, k, kev, LARGE, sectorLarge, shortName, MULT, EPSC, ENGINE, tpOwn, SENS, val,
  evHist, HEV, EVM, EVM_PE, ebitdaT27, treasT27, ttmEbitda, evNow, evTtm, evFy28, BM, mv, multOk, evOk, rating, ruleText, buyBelow, sellAbove, epsCagr, epsCagrRep, ebitdaCagr, salesCagr, roeSus,
  ST, br, mosl, bob, choice, isec, nuv, withTp, medTp, postQ1, jun28, atOurs };

if (require.main === module) {
  console.log('build', buildTot.map(n0), 'model', F.sales.map(n0), '| mix occlutech', mixPct('occlutech').map(x => x.toFixed(1)));
  console.log('OI items', oiItems.map(x => x.toFixed(1)), 'vs', AS.otherIncome, '| treas', oiTreas.map(x => x.toFixed(1)), 'engine OI', F.otherIncome, 'ok', oiOk, '| yield26', YIELD26.toFixed(2), 'TTM OI', ttmOi);
  console.log('net cash company', ndCo.map(n0), 'nd0', n0(nd0));
  console.log('EPS engine', epsU.map(x => x.toFixed(2)), 'owners', ownersEps.map(x => x.toFixed(2)), 'Sep-28E eng/own', epsSep.toFixed(2), ownersSep.toFixed(2));
  console.log('byBase', JSON.stringify(Object.fromEntries(Object.entries(byBase).map(([a, c]) => [a, +c.toFixed(2)]))), 'troughs', troughBase);
  console.log('hist base', JSON.stringify(HB), '| rep', JSON.stringify(HR), '| house FM', FM.median, FM.medianAll, FM.troughYears, '| by fwd FY', JSON.stringify(FWDFY));
  console.log('sector calc', sectorCalc.toFixed(3), 'EV', sectorEv.toFixed(3), PEER_SET.map(s => `${s} ${P[s].pe}/${MED5[s]}=${derate[s].toFixed(2)} ev ${P[s].evEbitda}/${MED5EV[s]}=${derateEv[s].toFixed(1)}`).join('; '), '| ALKEM own', derate.ALKEM.toFixed(2), derateEv.ALKEM.toFixed(2));
  console.log('MULT', MULT, 'ENGINE', ENGINE, 'ok?', multOk, evOk, 'tpOwn', tpOwn, 'SENS', JSON.stringify(SENS));
  console.log('EV hist', JSON.stringify(HEV), 'EVM', EVM, 'EV at PE factor', EVM_PE, '| ev now ttm', evTtm.toFixed(1), 'fy28', evFy28.toFixed(1));
  console.log('TP', V.tp, 'upside', V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'scen', SC.bull.tp, SC.bear.tp, '| pe fy27/28/sep28', peFy27.toFixed(1), peFy28.toFixed(1), peSep28.toFixed(1), 'ttm', peTtm.toFixed(1), '| at ours', JSON.stringify(Object.fromEntries(Object.entries(atOurs).map(([a, c]) => [a, Math.round(c)]))));
}
