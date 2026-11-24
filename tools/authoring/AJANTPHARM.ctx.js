// Ajanta Pharma initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and the
// built model and computes, once: the market build (checked against model revenue), the other-income build (FY26 treasury
// income on the Mar-26 book held flat + miscellaneous income + 7.5% on net cash added after Mar-26; checked against
// assumptions.json and the engine), EPS (Ajanta has no minorities: Screener's net profit = profit to shareholders, no
// patch), the one-year-forward P/E history since Apr-2021 on reported EPS (house forwardMedian; Screener's "EPS before
// exceptional items" as a sensitivity, see below), the trough test, the pharma sector factor (PLAYBOOK §7c A21: +8.2% P/E,
// +7.5% EV/EBITDA for names outside the nine-peer set; reproduced per peer), the target multiples, the EV/EBITDA
// cross-check, peers and the street. As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'AJANTPHARM', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'AJANTPHARM.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'AJANTPHARM', 'screener.json'), 'utf8')); // as fetched; Q2FY27 rows are never read below
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2021-04-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const cagr = (a, z, y) => (Math.pow(z / a, 1 / y) - 1) * 100;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pctl = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const statOf = arr => ({ med: pctl(arr, 0.5), p25: pctl(arr, 0.25), p75: pctl(arr, 0.75), min: Math.min(...arr), max: Math.max(...arr), n: arr.length });
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26;
const b = A.labels.length - 1; // FY26 index
const ix = fy => A.labels.indexOf(fy);
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
if (Math.abs(SHARES - FY26.shares) / FY26.shares > 0.002) throw new Error(`AJANTPHARM implied shares ${SHARES} vs actual ${FY26.shares}: a patch would be needed`);

// 1) Market build must sum to model revenue
const BL = AS.businessLines, LINES = ['india', 'asia', 'africa', 'us', 'inst'];
const LBL = { india: 'India branded generics', asia: 'Asia branded generics', africa: 'Africa branded generics', us: 'US generics', inst: 'Africa institutional (anti-malarials)', otherOp: 'Other operating revenue' };
const build = Object.fromEntries(LINES.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
build.otherOp = BL.otherOp.slice();
const ALL_LINES = [...LINES, 'otherOp'];
const buildTot = YRS.map((_, i) => ALL_LINES.reduce((s, k) => s + build[k][i], 0));
const base26 = { ...BL.base, otherOp: FY26.otherOp };
const baseTot = ALL_LINES.reduce((s, k) => s + base26[k], 0);
if (Math.abs(baseTot - FY26.revenue) > 0.5) throw new Error(`AJANTPHARM market base ${baseTot} != FY26 revenue ${FY26.revenue}`);
const growthFromBuild = YRS.map((_, i) => Math.round(((buildTot[i] / (i ? buildTot[i - 1] : baseTot)) - 1) * 100000) / 1000);
const buildOk = YRS.every((y, i) => Math.abs(buildTot[i] / F.sales[i] - 1) < 0.002);
const mixPct = k => YRS.map((_, i) => build[k][i] / buildTot[i] * 100);
const brandedPct = YRS.map((_, i) => (build.india[i] + build.asia[i] + build.africa[i]) / buildTot[i] * 100);

// 2) Other income build (AR FY26 note 38): FY26 treasury income on the Mar-26 book held flat + misc income; the engine adds
//    TY x opening net cash, so its TY x Mar-26 net cash is deducted here (7.5% is earned only on cash added after Mar-26)
const OIN = FY26.otherIncome, TRS = FY26.treasury;
const OI_BOOK = OIN.treasuryInterest + OIN.bankInterest + OIN.redemptionGains; // ₹61.85 cr
const MISC = OIN.misc; // ₹13.05 cr
const TY = AS.treasuryYield[0];
const nc0 = (A.cash[b] || 0) + (A.investments[b] || 0) + (AS.otherTreasury?.base || 0) - (A.borrowings[b] || 0); // engine net cash Mar-26 (₹433 cr)
const OI_CARRY = Math.round((OI_BOOK + MISC - TY / 100 * nc0) * 10) / 10;
const openCash = YRS.map((_, i) => (i ? F.treasury[i - 1] : nc0));
const oiIncr = YRS.map((_, i) => TY / 100 * (openCash[i] - nc0));
const oiBuild = YRS.map((_, i) => OI_BOOK + MISC + oiIncr[i]);
const oiOk = YRS.every((y, i) => Math.abs(AS.otherIncome[i] - OI_CARRY) <= 0.05 && Math.abs(oiBuild[i] - F.otherIncome[i]) <= 1.5);
const GROSS26 = TRS.cash + TRS.currentInvestments + TRS.bankOther, GROSS25 = TRS.prevCash + TRS.prevCurrentInvestments + 1.12;
const YIELD26 = OI_BOOK / ((GROSS25 + GROSS26) / 2) * 100;
const MF_YIELD = OIN.redemptionGains / ((TRS.mutualFunds + 128.69) / 2) * 100;
const OIQ = RAW.schedules.quarters['Other Income']['Other income normal'];
const ttmOiRep = ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026'].reduce((s, p) => s + (OIQ[p] || 0), 0);
const FXQ = { 'Jun 2025': 9.38, 'Mar 2026': 44.37, 'Jun 2026': 50.47 }; // FX gains in other income (results notes)
const oi26exFx = OIN.total - OIN.fx; // ₹74.9 cr
const ttmOiExFx = oi26exFx - (OIQ['Jun 2025'] - FXQ['Jun 2025']) + (OIQ['Jun 2026'] - FXQ['Jun 2026']); // twelve months to Jun-26, excl. FX gains

// 3) EPS. Ajanta has no minorities: engine EPS = EPS to shareholders. History: Screener reported EPS; the company reports no
//    exceptional items. Screener's "EPS before exceptional items" removes the FY26 mark-to-market hedge loss (−₹73 cr after
//    tax) but keeps the FX gain it hedged, so it is a sensitivity only.
const epsU = F.pat.map(p => p / SHARES);
const epsSep = sep(epsU);
const pl = RAW.tables['profit-loss'], ns = RAW.schedules['profit-loss']['Net Profit'];
const epsRep = {}, epsExc = {}, EXC_AT = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4), e = pl.rows['EPS in Rs'][i]; epsRep[y] = e; EXC_AT[y] = ns['Exceptional items AT'][p] || 0; epsExc[y] = ns['Profit excl Excep'][p] / (ns['Profit for EPS'][p] / e); } });
YRS.forEach((y, i) => { const fy = 2000 + +y.slice(2, 4); epsRep[fy] = epsU[i]; epsExc[fy] = epsU[i]; });
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const trough = (by, fy) => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); const pk = prev.length ? Math.max(...prev) : null; return !(by[fy] > 0) || (pk > 0 && by[fy] < 0.5 * pk); };
const troughRows = [2022, 2023, 2024].map(fy => ({ fy, eps: epsRep[fy], peak: Math.max(epsRep[fy - 1], epsRep[fy - 2], epsRep[fy - 3]) }));

// 4) One-year-forward P/E since Apr-2021. BASE = house forwardMedian (reported EPS; every 5th weekly close; median
//    s[floor(n/2)]; trough years left out: none). Bull / bear = 75th / 25th percentile of the same series.
const FM = forwardMedian('AJANTPHARM', M);
const sBase = FM.series, HB = statOf(sBase.map(x => x[1]));
if (Math.abs(HB.med - FM.median) > 1e-9) throw new Error('AJANTPHARM: base median differs from forwardMedian');
const pxAll = RAW.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= FROM);
const seriesOn = by => pxAll.filter(([d]) => !trough(by, fyOf(d))).map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10]);
const sExc = seriesOn(epsExc), HX = statOf(sExc.map(x => x[1]));
const pxWk = RAW.charts.price.Price.filter(([d]) => d >= FROM && d <= ASOF); if (pxWk.at(-1)[0] < ASOF) pxWk.push([ASOF, price]);
const HW = statOf(pxWk.map(([d, p]) => p / epsRep[fyOf(d)]));
const troughYrs = FM.troughYears;
const byFwdFy = {}; sBase.forEach(([d, x]) => (byFwdFy[fyOf(d)] ||= []).push(x));
const FWDFY = Object.keys(byFwdFy).sort().map(fy => ({ fy: `FY${String(fy).slice(2)}${+fy >= 2027 ? 'E' : ''}`, med: pctl(byFwdFy[fy], 0.5), n: byFwdFy[fy].length, eps: epsRep[fy] }));
const pre26 = statOf(sBase.filter(([d]) => d < '2025-04-01').map(x => x[1])); // windows on actual EPS only (FY22-FY26 forward)
const peFy27 = price / epsU[0], peFy28 = price / epsU[1], peSep28 = price / epsSep;
const ttmEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), peTtm = price / ttmEps;

// 5) Sector factor (PLAYBOOK §7c A21): AJANTPHARM is outside the nine-peer set, so the factor is the median of all nine
//    peers' trailing P/E at the 30-Sep close vs their five-year medians (since 30-Sep-2021): +8.2% (EV/EBITDA +7.5%).
const PEER_SET = D.peers.set, EXCL = Object.keys(D.peers.excluded), CONTEXT = ['JBCHEPHARM', 'MANKIND'];
const PEERS = peersAsOf([...PEER_SET, 'AJANTPHARM', ...CONTEXT], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const ser = (sym, a, k2) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.[a]?.[k2] || [];
const med5 = (sym, a, k2) => pctl(ser(sym, a, k2).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5);
const ALL10 = [...PEER_SET, 'AJANTPHARM'];
const MED5 = Object.fromEntries(ALL10.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const MED5EV = Object.fromEntries(ALL10.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const derate = Object.fromEntries(ALL10.map(s => [s, (P[s].pe / MED5[s] - 1) * 100]));
const derateEv = Object.fromEntries(ALL10.map(s => [s, (P[s].evEbitda / MED5EV[s] - 1) * 100]));
const sectorCalc = medOf(PEER_SET.map(s => derate[s])), sectorEvCalc = medOf(PEER_SET.map(s => derateEv[s]));
const SECTOR = 8.2, SECTOR_EV = 7.5, k = 1 + SECTOR / 100, kev = 1 + SECTOR_EV / 100; // PLAYBOOK §7c A21 (set)
if (Math.abs(sectorCalc - SECTOR) > 0.06 || Math.abs(sectorEvCalc - SECTOR_EV) > 0.06) throw new Error(`AJANTPHARM factor reproduction ${sectorCalc.toFixed(2)} / ${sectorEvCalc.toFixed(2)} differs from PLAYBOOK +8.2% / +7.5%`);
const LARGE = ['SUNPHARMA', 'DIVISLAB', 'TORNTPHARM', 'ZYDUSLIFE', 'CIPLA'], sectorLarge = medOf(LARGE.map(s => derate[s]));
const BRANDED = ['TORNTPHARM', 'ALKEM', 'IPCALAB', 'ABBOTINDIA'], sectorBranded = medOf(BRANDED.map(s => derate[s])); // India-branded-led sub-set (sensitivity)
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma', JBCHEPHARM: 'J.B. Chemicals', AJANTPHARM: 'Ajanta Pharma' }[s] || s);

// 6) Target multiples (derived): base = median x factor; bull / bear = 75th / 25th percentile x factor; nearest half-turn.
const MULT = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };
const EPSC = { base: epsSep, bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) }; // scenario EPS rounded to ₹0.1 in the model JSON
const val = m => Math.round(m * epsSep / 10) * 10;
const SENS = { exc: half(HX.med * k), weekly: half(HW.med * k), pre26: half(pre26.med * k), noFactor: half(HB.med), own: half(HB.med * (1 + derate.AJANTPHARM / 100)), mid: half(HB.med * (1 + (SECTOR + derate.AJANTPHARM) / 2 / 100)), large: half(HB.med * (1 + sectorLarge / 100)), branded: half(HB.med * (1 + sectorBranded / 100)) };

// 7) EV/EBITDA cross-check: Ajanta's trailing EV/EBITDA since Apr-2021 (Screener) x the EV analogue (+7.5%), on trailing
//    EBITDA at the target date (½ FY27E + ½ FY28E) plus net cash at Sep-27 (engine roll)
const evHist = ser('AJANTPHARM', 'evEbitda', 'EV Multiple').filter(([d, x]) => d >= FROM && d <= ASOF && x > 0);
const HEV = statOf(evHist.map(x => x[1]));
const EVM = { base: half(HEV.med * kev), bull: half(HEV.p75 * kev), bear: half(HEV.p25 * kev) };
const EVM_PE = half(HEV.med * k);
const ebitdaT27 = (F.ebitda[0] + F.ebitda[1]) / 2, treasT27 = (F.treasury[0] + F.treasury[1]) / 2;
const evNow = mcap - FY26.netCashCompany, evFy28 = (mcap - F.treasury[0]) / F.ebitda[1];

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const multOk = ['base', 'bull', 'bear'].every(c => PEM.multiple[c] === MULT[c]);
const evOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === EVM[c]);
const revOk = YRS.every((_, i) => Math.abs(AS.revenueGrowth[i] - growthFromBuild[i]) < 0.0015);
if (!process.env.TP_NOCHECK) {
  if (!revOk || !buildOk) throw new Error(`AJANTPHARM revenue: build growth ${growthFromBuild} vs assumptions ${AS.revenueGrowth}; run node tools/authoring/AJANTPHARM.mult.js`);
  if (!oiOk) throw new Error(`AJANTPHARM other income: carry ${OI_CARRY} vs assumptions ${AS.otherIncome}; build ${oiBuild.map(n1)} vs engine ${F.otherIncome}; run AJANTPHARM.mult.js`);
  if (!multOk || !evOk) throw new Error(`AJANTPHARM: assumptions multiples differ from the derivation (P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}); run node tools/authoring/AJANTPHARM.mult.js`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'pe').value; if (Math.abs(pv - MULT[c] * EPSC[c]) > (c === 'base' ? 1 : MULT[c] * 0.06)) throw new Error(`AJANTPHARM ${c} P/E value ${Math.round(pv)} != ${MULT[c]}x Sep-28E EPS`); if (tp !== Math.round(pv / 10) * 10) throw new Error(`AJANTPHARM ${c} target ${tp} is not the P/E value ${Math.round(pv)}`); });
}
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagr = cagr(epsRep[2026], epsU[2], 3), ebitdaCagr = cagr(A.ebitda[b], F.ebitda[2], 3), salesCagr = cagr(A.sales[b], F.sales[2], 3);

// 8) Street as it stood on 30-Sep-2026
const ST = D.street.brokers, br = n => ST.find(s => s.broker.startsWith(n));
const mosl = br('Motilal'), bob = br('BOB'), plb = br('Prabhudas'), isec = br('ICICI Securities'), jef = br('Jefferies'), idir = br('ICICI Direct');
const withTp = ST.filter(s => s.tp), medTp = medOf(withTp.map(s => s.tp));
const jun28 = 0.75 * epsU[1] + 0.25 * epsU[2];
const atOurs = { mosl: 32 * epsSep, pl: 32 * epsU[1], idir: 32 * epsU[1], bob: 30 * jun28, isec: 28 * epsU[1] };
const CONS = { FY27E: 96.9, FY28E: 111.2 }; // Bloomberg consensus via BOBCAPS (30-Jul-2026)

module.exports = { fs, path, ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, n0, n1, n2, pc, pc1, half, cagr, shortDate, medOf, pctl, statOf, SA, SQ, QL, Q1, FY26, b, ix, YRS, sep, price, SHARES, mcap,
  BL, LINES, ALL_LINES, LBL, build, buildTot, base26, growthFromBuild, mixPct, brandedPct, OIN, TRS, OI_BOOK, MISC, TY, nc0, OI_CARRY, openCash, oiIncr, oiBuild, GROSS26, GROSS25, YIELD26, MF_YIELD, ttmOiRep, oi26exFx, ttmOiExFx,
  epsU, epsSep, epsRep, epsExc, EXC_AT, fyOf, troughRows, troughYrs, FM, sBase, HB, sExc, HX, HW, FWDFY, pre26, peFy27, peFy28, peSep28, ttmEps, peTtm,
  PEER_SET, EXCL, CONTEXT, PEERS, P, MED5, MED5EV, derate, derateEv, sectorCalc, sectorEvCalc, SECTOR, SECTOR_EV, k, kev, LARGE, sectorLarge, BRANDED, sectorBranded, shortName, MULT, EPSC, val, SENS,
  evHist, HEV, EVM, EVM_PE, ebitdaT27, treasT27, evNow, evFy28, BM, mv, multOk, evOk, revOk, rating, ruleText, buyBelow, sellAbove, epsCagr, ebitdaCagr, salesCagr,
  ST, br, mosl, bob, plb, isec, jef, idir, withTp, medTp, jun28, atOurs, CONS };

if (require.main === module) {
  console.log('build', buildTot.map(n0), 'model', F.sales.map(n0), 'growth', growthFromBuild, 'vs', AS.revenueGrowth, '| branded %', brandedPct.map(n1), 'US %', mixPct('us').map(n1));
  console.log('OI carry', OI_CARRY, 'vs', AS.otherIncome, '| build', oiBuild.map(n1), 'engine', F.otherIncome, 'ok', oiOk, '| nc0', nc0, 'yield26', n2(YIELD26), 'MF', n2(MF_YIELD), '| exFx FY26', n1(oi26exFx), 'TTM exFx', n1(ttmOiExFx), 'TTM rep', n1(ttmOiRep));
  console.log('EPS', epsU.map(n2), 'Sep-28E', n2(epsSep), '| exc basis', JSON.stringify(Object.fromEntries(Object.entries(epsExc).filter(([y]) => y >= 2021).map(([y, v]) => [y, +v.toFixed(2)]))), '| troughs', troughYrs);
  console.log('HB', JSON.stringify(HB), '| HX', JSON.stringify(HX), '| HW', JSON.stringify(HW), '| pre26', JSON.stringify(pre26), '| byFY', FWDFY.map(f => `${f.fy} ${f.med}`).join(' '));
  console.log('sector', sectorCalc.toFixed(3), 'EV', sectorEvCalc.toFixed(3), PEER_SET.map(s => `${s} ${P[s].pe}/${MED5[s]}=${derate[s].toFixed(2)} ev ${P[s].evEbitda}/${MED5EV[s]}=${derateEv[s].toFixed(1)}`).join('; '), '| own', derate.AJANTPHARM.toFixed(2), derateEv.AJANTPHARM.toFixed(2), '| large', sectorLarge.toFixed(2), 'branded', sectorBranded.toFixed(2));
  console.log('MULT', MULT, 'ok', multOk, evOk, revOk, '| SENS', JSON.stringify(SENS), '| EV hist', JSON.stringify(HEV), 'EVM', EVM, 'EV@PEk', EVM_PE);
  console.log('TP', V.tp, 'upside', V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'scen', SC.bull.tp, SC.bear.tp, '| PE fy27/28/sep28/ttm', n1(peFy27), n1(peFy28), n1(peSep28), n1(peTtm), '| at ours', JSON.stringify(Object.fromEntries(Object.entries(atOurs).map(([a, c]) => [a, Math.round(c)]))), 'medTp', medTp);
}
