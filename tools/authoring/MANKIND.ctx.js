// Mankind Pharma initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and the
// built model and computes, once: the business-line build (checked against model revenue), our own net-debt path (the
// engine treats book tax as cash; the BSV amortisation is not tax-deductible, so ~₹113 cr a year of extra cash tax is
// added back), the gross-borrowing and gross-cash paths, the other-income and interest builds (checked against
// assumptions.json), EPS before the BSV acquisition amortisation and after minorities (the basis of the target), the
// forward P/E history since 1-Nov-2023 on every weekly close (Mankind listed May-2023; IPO months skipped), the pharma
// sector factor over the same window (+11.0%, PLAYBOOK §7c, reproduced per peer), the target multiples and their
// translation into the engine's reported-EPS multiples, the EV/EBITDA cross-check, peers and the street. As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const PATCH = require('./MANKIND.patch');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'MANKIND', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'MANKIND.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'MANKIND', 'screener.json'), 'utf8')); // unpatched
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2023-11-01', LISTED = '2023-05-09';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pctl = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SRC = 'Mankind Pharma annual reports, results filings and earnings calls; GAM Research';
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, DEAL = C.deal;
const b = A.labels.length - 1; // FY26 index
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const PPA = DEAL.ppa.amortisationPerYearCr, TSTAT = 25.168; // BSV purchase-price amortisation (₹ cr a year); statutory rate
const MIN = [27, 30, 33]; // minorities' share of profit (FY26 ₹25.17 cr, Q1FY27 ₹6 cr; +10% a year): the engine has no minority line

// 1) Business-line build must sum to model revenue
const BL = AS.businessLines, LINES = Object.keys(BL.base);
const LBL = { domesticRx: 'Domestic prescription (incl. BSV India)', consumer: 'Consumer healthcare', exports: 'Exports (incl. BSV international)' };
const build = Object.fromEntries(LINES.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => LINES.reduce((s, k) => s + build[k][i], 0));
const baseTot = LINES.reduce((s, k) => s + BL.base[k], 0);
if (Math.abs(baseTot / A.sales[b] - 1) > 0.001) throw new Error(`MANKIND base lines ${baseTot} != FY26 ${A.sales[b]}`);
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`MANKIND build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });
const mixPct = k => YRS.map((_, i) => build[k][i] / buildTot[i] * 100);

// 2) Net debt: engine path (book tax treated as cash) and our own path (+ the cumulative extra cash tax: the BSV
//    amortisation is not deductible, so the ₹1,800 cr DTL unwinds by ~₹113 cr a year and cash tax exceeds book tax)
const DTL_UNWIND = PPA * TSTAT / 100;
const nd0 = A.borrowings[b] - (A.cash[b] || 0) - (A.investments[b] || 0) - (AS.otherTreasury?.base || 0); // Mar-26, Screener basis incl. leases
const ndEngine = YRS.map((_, i) => -F.treasury[i]);
const ndOwn = ndEngine.map((x, i) => x + DTL_UNWIND * (i + 1));
const ND_CO0 = FY26.netDebtCompany, DIFF = ND_CO0 - nd0; // company basis excludes leases and non-treasury investments
const ndCo = [ND_CO0, ...ndOwn.map(x => x + DIFF)];
// Gross borrowings (company basis, ex-leases): NCD series 2 and 3 (₹1,250 cr Apr-26 already repaid; ₹1,250 cr Oct-26; ₹2,500 cr Nov-27)
const OTHER_DEBT = FY26.borrowings.total - FY26.borrowings.ncdFace; // working-capital lines, related-party and term loans, accrued interest
const grossDebt = [FY26.borrowings.total, OTHER_DEBT + 2500, OTHER_DEBT, OTHER_DEBT];
const grossCash = grossDebt.map((g, i) => g - ndCo[i]);
const lev = [ND_CO0 / FY26.ebitdaAdjusted, ...ndCo.slice(1).map((x, i) => x / F.ebitda[i])];

// 3) Other income build (assumptions.otherIncome): treasury yield on gross cash + recurring items + associates
const TY = 6.25, GRANTS = 60, MISC = 35, ASSOC = 12;
const oiTreas = YRS.map((_, i) => TY / 100 * (grossCash[i] + grossCash[i + 1]) / 2);
const oiBuild = YRS.map((_, i) => oiTreas[i] + GRANTS + MISC + ASSOC);
const oiOk = YRS.every((y, i) => Math.abs(oiBuild[i] - AS.otherIncome[i]) <= 3);
const FY26_OI_CORE = FY26.otherIncome.total + FY26.associatesShare; // ₹370 cr = Screener's "other income normal"
const TTM_OI = SQ.length && RAW.schedules.quarters['Other Income']['Other income normal'];
const ttmOi = ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026'].reduce((s, p) => s + (TTM_OI[p] || 0), 0);

// 4) Interest build (assumptions.interest)
const NCD = [1250 * 7.99 / 100 * 15 / 365 + 1250 * 7.99 / 100 * 198 / 365 + 2500 * 7.97 / 100, 2500 * 7.97 / 100 * 229 / 365, 0];
const KD_OTHER = 7.5, LEASE_INT = 10, OTHER_FIN = 10;
const intBuild = YRS.map((_, i) => NCD[i] + KD_OTHER / 100 * OTHER_DEBT + LEASE_INT + OTHER_FIN);
const intOk = YRS.every((y, i) => Math.abs(intBuild[i] / AS.interest[i] - 1) <= 0.04);

// 5) EPS before the BSV amortisation (net of its deferred-tax credit) and after minorities: the basis of the target
const ppaPs = PPA * (1 - TSTAT / 100) / SHARES;
const minPs = MIN.map(m => m / SHARES);
const epsU = F.pat.map(p => p / SHARES); // engine EPS (F.eps is rounded in the model JSON); includes minorities
const adjEps = YRS.map((_, i) => epsU[i] - minPs[i] + ppaPs);
const ownersEps = YRS.map((_, i) => epsU[i] - minPs[i]); // reported basis, after minorities (comparable to the street)
const adjSep = sep(adjEps), epsSep = sep(epsU), ownersSep = sep(ownersEps);
const scenAdj = key => { const e = SC[key].eps; return { rep: sep(e), adj: sep(e.map((x, i) => x - minPs[i] + ppaPs)) }; };

// 6) Forward P/E history since 1-Nov-2023 on every weekly close (+ the 30-Sep close): next full fiscal year's EPS
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pl = RAW.tables['profit-loss'], ns = RAW.schedules['profit-loss']['Net Profit'];
const epsRep = {}, EXC_AT = {}, SHR = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4), e = pl.rows['EPS in Rs'][i]; epsRep[y] = e; EXC_AT[y] = ns['Exceptional items AT'][p] || 0; SHR[y] = ns['Profit for EPS'][p] / e; } });
const BSV_DAYS25 = 160; // 23-Oct-2024 to 31-Mar-2025
const amortPs = y => (y === 2025 ? PPA * BSV_DAYS25 / 365 : PPA) * (1 - TSTAT / 100) / SHR[y];
const byRep = { 2025: epsRep[2025], 2026: epsRep[2026], 2027: epsU[0], 2028: epsU[1], 2029: epsU[2] };
const byBase = { 2025: epsRep[2025] - EXC_AT[2025] / SHR[2025] + amortPs(2025), 2026: epsRep[2026] - EXC_AT[2026] / SHR[2026] + amortPs(2026), 2027: adjEps[0], 2028: adjEps[1], 2029: adjEps[2] };
const byInclExc = { 2025: epsRep[2025] + amortPs(2025), 2026: epsRep[2026] + amortPs(2026), 2027: adjEps[0], 2028: adjEps[1], 2029: adjEps[2] };
const px = RAW.charts.price.Price.filter(([d]) => d >= FROM && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const seriesOn = by => px.map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10]);
const stat = s => { const v = s.map(x => x[1]); return { med: medOf(v), p25: pctl(v, 0.25), p75: pctl(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }; };
const sBase = seriesOn(byBase), sRep = seriesOn(byRep), sIncl = seriesOn(byInclExc);
const HB = stat(sBase), HR = stat(sRep), HI = stat(sIncl);
const winStat = (s, a, z) => stat(s.filter(([d]) => d >= a && d <= z));
const HB_pre = winStat(sBase, FROM, '2024-07-24'), HB_mid = winStat(sBase, '2024-07-25', '2025-09-30'), HB_post = winStat(sBase, '2025-10-01', ASOF);
const FM = forwardMedian('MANKIND', M, { from: FROM }); // house function: reported EPS, every 5th week
const fwdNowAdj = price / adjEps[1], fwdNowRep = price / epsU[1], fwdNowSepAdj = price / adjSep, trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;

// 7) Sector factor (PLAYBOOK §7c): nine peers' trailing P/E at the 30-Sep close vs each peer's median since 1-Nov-2023
const PEER_SET = D.peers.set, EXCL = Object.keys(D.peers.excluded);
const PEERS = peersAsOf([...PEER_SET, 'MANKIND'], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const peSer = sym => (JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.pe?.['Price to Earning'] || []);
const evSer = sym => (JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.evEbitda?.['EV Multiple'] || []);
const medFrom = (ser, from) => medOf(ser.filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const MEDW = Object.fromEntries([...PEER_SET, 'MANKIND'].map(s => [s, medFrom(peSer(s), FROM)]));
const MED5 = Object.fromEntries([...PEER_SET, 'MANKIND'].map(s => [s, medFrom(peSer(s), '2021-09-30')]));
const drW = Object.fromEntries([...PEER_SET, 'MANKIND'].map(s => [s, (P[s].pe / MEDW[s] - 1) * 100]));
const dr5 = Object.fromEntries([...PEER_SET, 'MANKIND'].map(s => [s, (P[s].pe / MED5[s] - 1) * 100]));
const sectorCalc = medOf(PEER_SET.map(s => drW[s])), sector5 = medOf(PEER_SET.map(s => dr5[s]));
const SECTOR = 11.0, k = 1 + SECTOR / 100; // set in PLAYBOOK §7c (MANKIND); our reproduction is sectorCalc
const MEDWEV = Object.fromEntries([...PEER_SET, 'MANKIND'].map(s => [s, medFrom(evSer(s), FROM)]));
const drWev = Object.fromEntries([...PEER_SET, 'MANKIND'].map(s => [s, (P[s].evEbitda / MEDWEV[s] - 1) * 100]));
const sectorEv = medOf(PEER_SET.map(s => drWev[s])), kev = 1 + sectorEv / 100;
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma' }[s] || s);

// 8) Target multiples (derived) and the engine's equivalent multiples on its reported Sep-28E EPS
const MULT = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };
const EPSC = { base: { rep: epsSep, adj: adjSep }, bull: scenAdj('bull'), bear: scenAdj('bear') };
const ENGINE = Object.fromEntries(Object.entries(MULT).map(([c, m]) => [c, Math.round(m * EPSC[c].adj / EPSC[c].rep * 100) / 100]));
const tpAdj = Object.fromEntries(Object.entries(MULT).map(([c, m]) => [c, Math.round(m * EPSC[c].adj / 10) * 10]));
const multRepSens = half(HR.med * k), multInclSens = half(HI.med * k), multHouse = half(FM.median * k);

// 9) EV/EBITDA cross-check: Mankind's trailing EV/EBITDA (Screener) since 1-Nov-2023, leaving out the BSV transition
//    (23-Oct-2024 to 30-Sep-2025: EV carried all the deal debt while trailing EBITDA held less than four quarters of BSV),
//    x the peers' EV/EBITDA move over the same window; applied to trailing EBITDA at the target date (½ FY27E + ½ FY28E)
const evAll = evSer('MANKIND').filter(([d, x]) => d >= FROM && d <= ASOF && x > 0);
const evClean = evAll.filter(([d]) => d < '2024-10-23' || d > '2025-09-30');
const EVH = { all: stat(evAll), clean: stat(evClean) };
const EVM = { base: half(EVH.clean.med * kev), bull: half(EVH.clean.p75 * kev), bear: half(EVH.clean.p25 * kev) };
const EVM_PEFACTOR = half(EVH.clean.med * k), EVM_ALL = half(EVH.all.med * kev); // sensitivities: P/E factor; full window incl. the transition
const ebitdaT27 = (F.ebitda[0] + F.ebitda[1]) / 2, treasT27 = (F.treasury[0] + F.treasury[1]) / 2;
const evNowFwd = (mcap + ND_CO0) / F.ebitda[1], evNowTtm = P.MANKIND.evEbitda;
const jm22 = (22 * (0.75 * F.ebitda[1] + 0.25 * F.ebitda[2]) + (0.75 * F.treasury[1] + 0.25 * F.treasury[2])) / SHARES; // JM's 22x Jun-28E on our numbers

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const multOk = ['base', 'bull', 'bear'].every(c => Math.abs(PEM.multiple[c] - ENGINE[c]) < 0.03);
const evOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === EVM[c]);
if (!process.env.TP_NOCHECK) {
  if (!oiOk) throw new Error(`MANKIND other income: build ${oiBuild.map(x => x.toFixed(1))} vs assumptions ${AS.otherIncome}`);
  if (!intOk) throw new Error(`MANKIND interest: build ${intBuild.map(x => x.toFixed(1))} vs assumptions ${AS.interest}`);
  if (!multOk || !evOk) throw new Error(`MANKIND: assumptions multiples differ from the derivation (P/E ${JSON.stringify(ENGINE)}, EV ${JSON.stringify(EVM)}); run node tools/authoring/MANKIND.mult.js`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'pe').value; if (Math.abs(pv - tpAdj[c]) > 10) throw new Error(`MANKIND ${c} P/E value ${Math.round(pv)} != ${MULT[c]}x adjusted EPS (${tpAdj[c]})`); if (tp !== Math.round(pv / 10) * 10) throw new Error(`MANKIND ${c} target ${tp} is not the P/E value ${Math.round(pv)}`); });
}
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrAdj = (Math.pow(adjEps[2] / byBase[2026], 1 / 3) - 1) * 100, epsCagrRep = (Math.pow(ownersEps[2] / epsRep[2026], 1 / 3) - 1) * 100;
const ebitdaCagr = (Math.pow(F.ebitda[2] / A.ebitda[b], 1 / 3) - 1) * 100;

// 10) Street as it stood on 30-Sep-2026
const ST = D.street.brokers, byB = n => ST.find(s => s.broker === n);
const mosl = byB('Motilal Oswal'), jm = byB('JM Financial'), geo = byB('Geojit BNP Paribas'), hsie = byB('HDFC Securities');
const withTp = ST.filter(s => s.tp), medTp = medOf(withTp.map(s => s.tp));
const moslAtOurs = 40 * ownersSep, geoAtOurs = 37 * ownersEps[1];

module.exports = { ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, LISTED, n0, n1, pc, pc1, rup, half, shortDate, medOf, pctl, SRC, SA, SQ, QL, Q1, FY26, DEAL, b, YRS, sep, price, SHARES, mcap, PPA, TSTAT, MIN, PATCH,
  BL, LINES, LBL, build, buildTot, mixPct, DTL_UNWIND, nd0, ndEngine, ndOwn, ND_CO0, DIFF, ndCo, OTHER_DEBT, grossDebt, grossCash, lev, TY, GRANTS, MISC, ASSOC, oiTreas, oiBuild, FY26_OI_CORE, ttmOi, NCD, KD_OTHER, LEASE_INT, OTHER_FIN, intBuild,
  ppaPs, minPs, epsU, adjEps, ownersEps, adjSep, epsSep, ownersSep, scenAdj, fyOf, epsRep, EXC_AT, SHR, BSV_DAYS25, amortPs, byRep, byBase, byInclExc, sBase, sRep, sIncl, HB, HR, HI, HB_pre, HB_mid, HB_post, FM, fwdNowAdj, fwdNowRep, fwdNowSepAdj, trailEps, trailPe,
  PEER_SET, EXCL, PEERS, P, MEDW, MED5, drW, dr5, sectorCalc, sector5, SECTOR, k, MEDWEV, drWev, sectorEv, kev, shortName, MULT, EPSC, ENGINE, tpAdj, multRepSens, multInclSens, multHouse,
  evAll, evClean, EVH, EVM, EVM_PEFACTOR, EVM_ALL, ebitdaT27, treasT27, evNowFwd, evNowTtm, jm22, BM, mv, multOk, evOk, rating, buyBelow, sellAbove, epsCagrAdj, epsCagrRep, ebitdaCagr,
  ST, mosl, jm, geo, hsie, withTp, medTp, moslAtOurs, geoAtOurs };

if (require.main === module) {
  console.log('build', buildTot.map(n0), 'model', F.sales.map(n0), '| mix exports', mixPct('exports').map(x => x.toFixed(1)));
  console.log('ND engine', ndEngine.map(n0), 'own', ndOwn.map(n0), 'company', ndCo.map(n0), 'gross debt', grossDebt.map(n0), 'gross cash', grossCash.map(n0), 'lev', lev.map(x => x.toFixed(2)));
  console.log('OI build', oiBuild.map(x => x.toFixed(1)), 'vs', AS.otherIncome, oiOk, '| treas', oiTreas.map(x => x.toFixed(1)), '| FY26 core', FY26_OI_CORE, 'TTM', ttmOi);
  console.log('interest build', intBuild.map(x => x.toFixed(1)), 'vs', AS.interest, intOk);
  console.log('EPS engine', epsU.map(x => x.toFixed(2)), 'owners', ownersEps.map(x => x.toFixed(2)), 'adj', adjEps.map(x => x.toFixed(2)), 'Sep-28E rep/owners/adj', epsSep.toFixed(2), ownersSep.toFixed(2), adjSep.toFixed(2));
  console.log('byBase', JSON.stringify(Object.fromEntries(Object.entries(byBase).map(([a, c]) => [a, +c.toFixed(2)]))), 'EXC_AT', JSON.stringify(EXC_AT), 'SHR', SHR[2025].toFixed(2), SHR[2026].toFixed(2));
  console.log('hist base', JSON.stringify(HB), '| rep', JSON.stringify(HR), '| inclExc', JSON.stringify(HI), '| house FM', FM.median, FM.medianAll, FM.troughYears);
  console.log('windows base pre/mid/post', HB_pre.med, HB_mid.med, HB_post.med, '| now fwd adj', fwdNowAdj.toFixed(1), 'rep', fwdNowRep.toFixed(1), 'trail', trailPe.toFixed(1));
  console.log('sector calc', sectorCalc.toFixed(3), '5y', sector5.toFixed(3), PEER_SET.map(s => `${s} ${P[s].pe}/${MEDW[s]}=${drW[s].toFixed(2)}`).join('; '), '| Mankind own', drW.MANKIND.toFixed(2));
  console.log('EV factor', sectorEv.toFixed(2), '| EV hist all', JSON.stringify(EVH.all), 'clean', JSON.stringify(EVH.clean), 'EVM', JSON.stringify(EVM), 'EV-factor alt', EVM_PEFACTOR, EVM_ALL);
  console.log('MULT', MULT, 'ENGINE', ENGINE, 'ok?', multOk, evOk, 'tpAdj', tpAdj, 'sens rep', multRepSens, 'incl', multInclSens, 'house', multHouse);
  console.log('TP', V.tp, 'upside', V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'scen', SC.bull.tp, SC.bear.tp, '| JM22 on ours', Math.round(jm22), 'MOSL40', Math.round(moslAtOurs));
}
