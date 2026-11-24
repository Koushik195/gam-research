// Emcure Pharmaceuticals initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs
// and the built model and computes, once: the geography build (checked against model revenue), our own net-debt path on
// the company basis (the engine starts from Screener's borrowings incl. leases and the Mantra earn-out payable, and does not
// see the Jul-2026 Gennova buyout, Cutimed or lease principal), gross debt and cash, the interest and other-income builds
// (checked against assumptions.json), the forward P/E history since 1-Jan-2025 on every weekly close (Emcure listed
// 10-Jul-2024; IPO months skipped; FY26 EPS before exceptional items and the earn-out true-up), the pharma sector factor
// over the same window (+16.0% P/E, +10.8% EV/EBITDA, PLAYBOOK §7c, reproduced per peer), the target multiples, the
// EV/EBITDA cross-check, peers and the street. As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'EMCURE', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'EMCURE.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'EMCURE', 'screener.json'), 'utf8')); // unpatched
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2025-01-01', LISTED = '2024-07-10';
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
const SRC = 'Emcure annual reports, results filings, investor presentations and earnings calls; GAM Research';
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, DEALS = C.deals;
const b = A.labels.length - 1; // FY26 index
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;

// 1) Geography build must sum to model revenue
const BL = AS.businessLines, LINES = Object.keys(BL.base);
const LBL = { india: 'India', europe: 'Europe', canada: 'Canada', row: 'Rest of world' };
const build = Object.fromEntries(LINES.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => LINES.reduce((s, k) => s + build[k][i], 0));
const baseTot = LINES.reduce((s, k) => s + BL.base[k], 0);
if (Math.abs(baseTot / A.sales[b] - 1) > 0.001) throw new Error(`EMCURE base lines ${baseTot} != FY26 ${A.sales[b]}`);
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`EMCURE build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });
const mixPct = k => YRS.map((_, i) => build[k][i] / buildTot[i] * 100);
const intlShare = YRS.map((_, i) => 100 - mixPct('india')[i]);

// 2) Net debt, company basis (ex-leases). Engine Mar-26 = borrowings incl. leases − cash − investments + Mantra earn-out
//    payable (otherTreasury). Company basis excludes leases (held flat) and, at Mar-26, the earn-out (paid Jul-2026, so in
//    debt from FY27). Extra cash outflows the engine does not see: Gennova minority ₹231.87 cr and Cutimed up to ₹33.75 cr
//    (FY27), and lease principal (~₹55 cr a year; the engine adds back right-of-use depreciation as if it were non-cash).
const EARNOUT = -(AS.otherTreasury?.base || 0); // 335.77
const GENNOVA = 231.87, CUTIMED = 33.75, LEASE_PRIN = 55;
const ACQ = [GENNOVA + CUTIMED, 0, 0];
const nd0 = A.borrowings[b] - (A.cash[b] || 0) - (A.investments[b] || 0) + EARNOUT; // engine basis, Mar-26
const ND_CO0 = FY26.netDebtCompany; // 1,053.8
const DIFF = ND_CO0 - (nd0 - EARNOUT); // leases and the cash/investment definition
const ndEngine = YRS.map((_, i) => -F.treasury[i]);
let cumX = 0;
const ndCo = [ND_CO0, ...ndEngine.map((x, i) => { cumX += ACQ[i] + LEASE_PRIN; return x + DIFF + cumX; })];
const CASH_MIN = 150, DEBT_FLOOR = 300; // operating cash kept in subsidiaries; Canadian term loans and working-capital lines that stay
const grossDebt = ndCo.map((x, i) => (i === 0 ? FY26.grossDebt : Math.max(x + CASH_MIN, DEBT_FLOOR)));
const grossCash = grossDebt.map((g, i) => g - ndCo[i]);
const lev = [ND_CO0 / FY26.ebitdaCompany, ...ndCo.slice(1).map((x, i) => x / F.ebitda[i])];
// FY27 path inside the year: Jun-26 actual ₹1,291 cr gross; ~₹1,600 cr at Sep-26 (net ~₹1,450 cr guided + ₹150 cr cash)
const GD_JUN26 = Q1.grossDebt, GD_SEP26 = 1600;
const gdDec26 = (GD_SEP26 + grossDebt[1]) / 2;
const avgGD = [((grossDebt[0] + GD_JUN26) / 2 + (GD_JUN26 + GD_SEP26) / 2 + (GD_SEP26 + gdDec26) / 2 + (gdDec26 + grossDebt[1]) / 2) / 4,
  (grossDebt[1] + grossDebt[2]) / 2, (grossDebt[2] + grossDebt[3]) / 2];
const avgGC = YRS.map((_, i) => (grossCash[i] + grossCash[i + 1]) / 2);

// 3) Interest build (assumptions.interest)
const KD = 7.5, LEASE_INT = 27, OTHER_FIN = 18, ADV_TAX = 3, UNWIND = [5, 0, 0];
const intBorrow = avgGD.map(g => KD / 100 * g);
const intBuild = YRS.map((_, i) => intBorrow[i] + LEASE_INT + OTHER_FIN + ADV_TAX + UNWIND[i]);
const intOk = YRS.every((y, i) => Math.abs(intBuild[i] - AS.interest[i]) <= 4);

// 4) Other income build (assumptions.otherIncome): treasury on operating cash + surplus cash, plus recurring misc.
const TY_OP = 2, TY_SURPLUS = 6.5, MISC = 6;
const oiTreas = avgGC.map(c => TY_OP / 100 * Math.min(c, CASH_MIN) + TY_SURPLUS / 100 * Math.max(c - CASH_MIN, 0));
const oiBuild = YRS.map((_, i) => oiTreas[i] + MISC);
const oiOk = YRS.every((y, i) => Math.abs(oiBuild[i] - AS.otherIncome[i]) <= 2);
const TTM_OI = RAW.schedules.quarters['Other Income']['Other income normal'];
const ttmOi = ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026'].reduce((s, p) => s + (TTM_OI[p] || 0), 0);

// 5) EPS (no minorities from FY27: Zuventus and Gennova are wholly owned)
const epsU = F.eps.slice(); // the model's EPS (2 dp), so text and live tokens show the same figures
const epsSep = sep(epsU);
const scenEps = key => sep(SC[key].eps);

// 6) Forward P/E history since 1-Jan-2025 on every weekly close (+ the 30-Sep close): next full fiscal year's EPS
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pl = RAW.tables['profit-loss'], ns = RAW.schedules['profit-loss']['Net Profit'];
const epsRep = {}, EXC_AT = {}, SHR = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4), e = pl.rows['EPS in Rs'][i]; epsRep[y] = e; EXC_AT[y] = ns['Exceptional items AT'][p] || 0; SHR[y] = ns['Profit for EPS'][p] / e; } });
const TRUEUP = FY26.earnoutTrueUp; // ₹42.86 cr, booked in expenses by Screener; fair-value change on contingent consideration, no tax
const excPs26 = (-EXC_AT[2026] + TRUEUP) / SHR[2026];
const byBase = { 2026: epsRep[2026] + excPs26, 2027: epsU[0], 2028: epsU[1], 2029: epsU[2] };
const byRep = { 2026: epsRep[2026], 2027: epsU[0], 2028: epsU[1], 2029: epsU[2] };
const px = RAW.charts.price.Price.filter(([d]) => d >= FROM && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const seriesOn = by => px.map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10]);
const stat = s => { const v = s.map(x => x[1]); return { med: medOf(v), p25: pctl(v, 0.25), p75: pctl(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }; };
const sBase = seriesOn(byBase), sRep = seriesOn(byRep);
const HB = stat(sBase), HR = stat(sRep);
const winStat = (s, a, z) => stat(s.filter(([d]) => d >= a && d <= z));
const HB_fy26 = winStat(sBase, FROM, '2025-03-31'), HB_fy27 = winStat(sBase, '2025-04-01', '2026-03-31'), HB_fy28 = winStat(sBase, '2026-04-01', ASOF);
const pxAll = RAW.charts.price.Price.filter(([d]) => d >= LISTED && d <= ASOF);
const sIpo = pxAll.filter(([d]) => d < FROM).map(([d, p]) => [d, Math.round(p / byBase[fyOf(d)] * 10) / 10]); // Jul-Dec 2024: next full year = FY26
const HB_ipo = stat(sIpo), HB_all = stat([...sIpo, ...sBase]);
const FM = forwardMedian('EMCURE', M, { from: FROM }); // house function: reported EPS, every 5th week
const fwdNow = price / epsU[1], fwdNowSep = price / epsSep, trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;

// 7) Sector factor (PLAYBOOK §7c): nine peers' trailing P/E at the 30-Sep close vs each peer's median since 1-Jan-2025
const PEER_SET = D.peers.set, EXCL = Object.keys(D.peers.excluded);
const PEERS = peersAsOf([...PEER_SET, 'MANKIND', 'EMCURE'], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const chart = (sym, a, k2) => (JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.[a]?.[k2] || []);
const peSer = sym => chart(sym, 'pe', 'Price to Earning'), evSer = sym => chart(sym, 'evEbitda', 'EV Multiple');
const medFrom = (ser, from) => medOf(ser.filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const ALLS = [...PEER_SET, 'MANKIND', 'EMCURE'];
const MEDW = Object.fromEntries(ALLS.map(s => [s, medFrom(peSer(s), FROM)]));
const MED5 = Object.fromEntries(ALLS.map(s => [s, medFrom(peSer(s), '2021-09-30')]));
const drW = Object.fromEntries(ALLS.map(s => [s, (P[s].pe / MEDW[s] - 1) * 100]));
const dr5 = Object.fromEntries(ALLS.map(s => [s, (P[s].pe / MED5[s] - 1) * 100]));
const sectorCalc = medOf(PEER_SET.map(s => drW[s])), sector5 = medOf(PEER_SET.map(s => dr5[s]));
const SECTOR = 16.0, k = 1 + SECTOR / 100; // set in PLAYBOOK §7c (A21, EMCURE); our reproduction is sectorCalc
const MEDWEV = Object.fromEntries(ALLS.map(s => [s, medFrom(evSer(s), FROM)]));
const drWev = Object.fromEntries(ALLS.map(s => [s, (P[s].evEbitda / MEDWEV[s] - 1) * 100]));
const sectorEvCalc = medOf(PEER_SET.map(s => drWev[s]));
const SECTOR_EV = 10.8, kev = 1 + SECTOR_EV / 100; // set in PLAYBOOK §7c (A21, EMCURE)
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma', EMCURE: 'Emcure' }[s] || s);

// 8) Target multiples (derived); forecasts carry no exceptional items, so the engine multiple is the derived multiple
const MULT = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };
const EPSC = { base: epsSep, bull: scenEps('bull'), bear: scenEps('bear') };
const tpCalc = Object.fromEntries(Object.entries(MULT).map(([c, m]) => [c, Math.round(m * EPSC[c] / 10) * 10]));
const multAll = half(HB_all.med * k), multRepSens = half(HR.med * k), multHouse = half(FM.median * k), multNoK = half(HB.med), mult5 = half(HB.med * 1.082), multOwnMid = half(HB.med * (1 + (SECTOR + drW.EMCURE) / 2 / 100));

// 9) EV/EBITDA cross-check: Emcure's trailing EV/EBITDA (Screener) since 1-Jan-2025 × the peers' EV/EBITDA move over the
//    same window (+10.8%), applied to trailing EBITDA at the target date (½ FY27E + ½ FY28E) less net debt at Sep-27E (engine)
const evAll = evSer('EMCURE').filter(([d, x]) => d >= FROM && d <= ASOF && x > 0);
const EVH = stat(evAll);
const EVM = { base: half(EVH.med * kev), bull: half(EVH.p75 * kev), bear: half(EVH.p25 * kev) };
const EVM_PEFACTOR = half(EVH.med * k);
const ebitdaT27 = (F.ebitda[0] + F.ebitda[1]) / 2, treasT27 = (F.treasury[0] + F.treasury[1]) / 2;
const ndCoSep27 = (ndCo[1] + ndCo[2]) / 2;
const evOwnPath = (EVM.base * ebitdaT27 - ndCoSep27) / SHARES; // same multiple, our company-basis net debt (ex-leases, incl. Gennova)
const evNowFwd = (mcap + ND_CO0 + EARNOUT + GENNOVA) / F.ebitda[1], evNowTtm = P.EMCURE.evEbitda;

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const multOk = ['base', 'bull', 'bear'].every(c => PEM.multiple[c] === MULT[c]);
const evOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === EVM[c]);
if (!process.env.TP_NOCHECK) {
  if (!oiOk) throw new Error(`EMCURE other income: build ${oiBuild.map(x => x.toFixed(1))} vs assumptions ${AS.otherIncome}; run node tools/authoring/EMCURE.mult.js`);
  if (!intOk) throw new Error(`EMCURE interest: build ${intBuild.map(x => x.toFixed(1))} vs assumptions ${AS.interest}; run node tools/authoring/EMCURE.mult.js`);
  if (!multOk || !evOk) throw new Error(`EMCURE: assumptions multiples differ from the derivation (P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}); run node tools/authoring/EMCURE.mult.js`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'pe').value; if (Math.abs(pv - MULT[c] * EPSC[c]) > 2) throw new Error(`EMCURE ${c} P/E value ${Math.round(pv)} != ${MULT[c]}x Sep-28E EPS (${n1(EPSC[c])})`); if (tp !== Math.round(pv / 10) * 10) throw new Error(`EMCURE ${c} target ${tp} is not the P/E value ${Math.round(pv)}`); });
}
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagr = (Math.pow(epsU[2] / byBase[2026], 1 / 3) - 1) * 100, epsCagrRep = (Math.pow(epsU[2] / epsRep[2026], 1 / 3) - 1) * 100;
const ebitdaCagr = (Math.pow(F.ebitda[2] / FY26.ebitdaCompany, 1 / 3) - 1) * 100, salesCagr = (Math.pow(F.sales[2] / A.sales[b], 1 / 3) - 1) * 100;
const marginPt = (F.sales[1] + F.sales[2]) / 2 / 100 * (1 - AS.taxRate[2] / 100) / SHARES; // ₹ of Sep-28E EPS per 1pp of margin

// 10) Street as it stood on 30-Sep-2026
const ST = D.street.brokers, byB = n => ST.find(s => s.broker.startsWith(n));
const icici = byB('ICICI'), mosl = byB('Motilal'), fb = byB('Foreign'), bob = byB('BOB'), jm = byB('JM');
const withTp = ST.filter(s => s.tp), medTp = medOf(withTp.map(s => s.tp));
const recentTp = withTp.filter(s => s.date >= '2026-06-01'), medRecent = medOf(recentTp.map(s => s.tp));
const moslAtOurs = 28 * (0.75 * epsU[1] + 0.25 * epsU[2]), iciciAtOurs = 30 * epsU[1], bobAtOurs = 25 * epsU[1];
const moslEps = { FY27E: mosl.patAdj.FY27E / SHARES, FY28E: mosl.patAdj.FY28E / SHARES };

module.exports = { ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, LISTED, n0, n1, pc, pc1, rup, half, shortDate, medOf, pctl, SRC, SA, SQ, QL, Q1, FY26, DEALS, b, YRS, sep, price, SHARES, mcap,
  BL, LINES, LBL, build, buildTot, mixPct, intlShare, EARNOUT, GENNOVA, CUTIMED, LEASE_PRIN, ACQ, nd0, ND_CO0, DIFF, ndEngine, ndCo, CASH_MIN, DEBT_FLOOR, grossDebt, grossCash, lev, GD_JUN26, GD_SEP26, avgGD, avgGC,
  KD, LEASE_INT, OTHER_FIN, ADV_TAX, UNWIND, intBorrow, intBuild, TY_OP, TY_SURPLUS, MISC, oiTreas, oiBuild, ttmOi, epsU, epsSep, scenEps, fyOf, epsRep, EXC_AT, SHR, TRUEUP, excPs26, byBase, byRep, sBase, sRep, HB, HR, HB_fy26, HB_fy27, HB_fy28, sIpo, HB_ipo, HB_all, multAll, FM, fwdNow, fwdNowSep, trailEps, trailPe,
  PEER_SET, EXCL, PEERS, P, MEDW, MED5, drW, dr5, sectorCalc, sector5, SECTOR, k, MEDWEV, drWev, sectorEvCalc, SECTOR_EV, kev, shortName, MULT, EPSC, tpCalc, multRepSens, multHouse, multNoK, mult5, multOwnMid,
  evAll, EVH, EVM, EVM_PEFACTOR, ebitdaT27, treasT27, ndCoSep27, evOwnPath, evNowFwd, evNowTtm, BM, mv, multOk, evOk, intOk, oiOk, rating, buyBelow, sellAbove, epsCagr, epsCagrRep, ebitdaCagr, salesCagr, marginPt,
  ST, icici, mosl, fb, bob, jm, withTp, medTp, recentTp, medRecent, moslAtOurs, iciciAtOurs, bobAtOurs, moslEps };

if (require.main === module) {
  console.log('build', buildTot.map(n0), 'model', F.sales.map(n0), '| intl share', intlShare.map(x => x.toFixed(1)));
  console.log('ND engine', ndEngine.map(n0), 'company', ndCo.map(n0), 'DIFF', DIFF.toFixed(1), 'gross debt', grossDebt.map(n0), 'avgGD', avgGD.map(n0), 'gross cash', grossCash.map(n0), 'lev', lev.map(x => x.toFixed(2)));
  console.log('interest build', intBuild.map(x => x.toFixed(1)), 'vs', AS.interest, intOk, '| OI build', oiBuild.map(x => x.toFixed(1)), 'vs', AS.otherIncome, oiOk, '| TTM OI', ttmOi);
  console.log('EPS', epsU.map(x => x.toFixed(2)), 'Sep-28E', epsSep.toFixed(2), '| byBase26', byBase[2026].toFixed(2), 'rep', epsRep[2026], 'EXC_AT', EXC_AT[2026], 'SHR', SHR[2026].toFixed(3));
  console.log('hist base', JSON.stringify(HB), '| rep', JSON.stringify(HR), '| windows', HB_fy26.med, HB_fy27.med, HB_fy28.med, '| IPO months', JSON.stringify(HB_ipo), '| house FM', FM.median, FM.medianAll, FM.troughYears);
  console.log('now fwd', fwdNow.toFixed(1), 'Sep28', fwdNowSep.toFixed(1), 'trail', trailPe.toFixed(1), '| sector calc', sectorCalc.toFixed(2), 'EV', sectorEvCalc.toFixed(2), '| own', drW.EMCURE.toFixed(2), 'Mankind', drW.MANKIND.toFixed(2));
  console.log(PEER_SET.map(s => `${s} ${P[s].pe}/${MEDW[s].toFixed(1)}=${drW[s].toFixed(1)} ev ${P[s].evEbitda}/${MEDWEV[s].toFixed(1)}=${drWev[s].toFixed(1)}`).join('; '));
  console.log('MULT', MULT, 'EPSC', JSON.stringify(EPSC), 'tpCalc', tpCalc, 'ok?', multOk, evOk, '| sens rep', multRepSens, 'house', multHouse, 'noK', multNoK, '5y', mult5, 'mid', multOwnMid);
  console.log('EV hist', JSON.stringify(EVH), 'EVM', EVM, 'EV own path', Math.round(evOwnPath), '| evNowFwd', evNowFwd.toFixed(1), 'ttm', evNowTtm);
  console.log('TP', V.tp, 'upside', V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'scen', SC.bull.tp, SC.bear.tp, '| buyBelow', buyBelow, 'sellAbove', sellAbove, '| street med', medTp, 'recent', medRecent, 'MOSL28 on ours', Math.round(moslAtOurs), 'ICICI30', Math.round(iciciAtOurs));
}
