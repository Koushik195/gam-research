// Anthem Biosciences initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and
// the built model and computes, once: the four-line revenue build (checked against model revenue), the other-income build
// (6.0% on average net cash + export incentives + misc, checked against assumptions.json), the interest build, the net-cash
// path, the one-year-forward P/E history since 1-Oct-2025 on every weekly close plus the 30-Sep close (Anthem listed on
// 21-Jul-2025; IPO months skipped; forward EPS = our FY27E/FY28E, which carry no exceptional items), the pharma sector
// factor over the same window (nine peers, +17.2% P/E / +6.7% EV/EBITDA, PLAYBOOK §7c A21, reproduced peer by peer), the
// derived multiples (must equal assumptions.json; ANTHEM.mult.js writes them), the forward EV/EBITDA cross-check, a
// reverse-DCF test, sensitivity rows, CRDMO peers and the street as it stood on 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ANTHEM', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ANTHEM.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'ANTHEM', 'screener.json'), 'utf8')); // unpatched
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2025-10-01', LISTED = '2025-07-21';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?(?=[0-9])/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const cagr = (a, z, y) => (Math.pow(z / a, 1 / y) - 1) * 100;
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pctl = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SRC = 'Anthem Biosciences annual report, results presentations and calls; Screener.in (consolidated); GAM Research';
const b = A.labels.length - 1; // FY26 index
const ai = fy => A.labels.indexOf(fy);
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26;

// 1) Four-line build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines, KEYS = ['commercial', 'development', 'rd', 'si'];
const LBL = { commercial: 'Commercial molecules (14)', development: 'Clinical development batches', rd: 'R&D / discovery services', si: 'Specialty ingredients' };
const LINES = Object.fromEntries(KEYS.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => KEYS.reduce((s, k) => s + LINES[k][i], 0));
const baseTot = KEYS.reduce((s, k) => s + BL.base[k], 0);
if (Math.abs(baseTot / A.sales[b] - 1) > 0.001) throw new Error(`ANTHEM build base ${baseTot} != FY26 ${A.sales[b]}`);
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`ANTHEM build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });
const crdmoTot = YRS.map((_, i) => LINES.commercial[i] + LINES.development[i] + LINES.rd[i]);
const mixPct = k => YRS.map((_, i) => LINES[k][i] / buildTot[i] * 100);

// 2) Net cash: engine path (gross cash + investments + non-current deposits − borrowings) and company basis
const ND0 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - (A.borrowings[b] || 0); // Mar-26 engine net cash
const cashPath = [ND0, ...F.treasury];
const TRE = C.treasury.mar26, CO_NC0 = FY26.netCashCompany;
const grossTreasury26 = TRE.bondsAndMlds + TRE.mutualFunds + TRE.cashAndDeposits + TRE.nonCurrentBankBalances;

// 3) Other income build: 6.0% on average net cash + export incentives + miscellaneous (checked against assumptions)
const TY = 6.0, RODTEP = 5, MISC = 3;
const oiTreas = YRS.map((_, i) => TY / 100 * (cashPath[i] + cashPath[i + 1]) / 2);
const oiBuild = YRS.map((_, i) => oiTreas[i] + RODTEP + MISC);
const oiOk = YRS.every((y, i) => Math.abs(oiBuild[i] - AS.otherIncome[i]) <= 0.5);
const OIN = C.otherIncomeNote, OI26 = OIN.FY26.total, ttmOi = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);
const yld26 = (OIN.FY26.interest + OIN.FY26.capitalGains + OIN.FY26.fvGainFunds) / ((grossTreasury26 + (C.treasury.mar25.bondsAndMlds + C.treasury.mar25.mutualFunds + C.treasury.mar25.cashAndDeposits + C.treasury.mar25.nonCurrentBankBalances)) / 2) * 100;
const yldQ1 = OIN.companySplitQ1FY27.financial * 4 / ((CO_NC0 + Q1.netCash) / 2) * 100;

// 4) Interest build: 7.5% on average borrowings + ~₹1 cr lease and other finance costs
const KD = 7.5, OTHER_FIN = 1.0, BORR = [C.treasury.mar26.borrowings, 35, 25, 20];
const intBuild = YRS.map((_, i) => KD / 100 * (BORR[i] + BORR[i + 1]) / 2 + OTHER_FIN);
const intOk = YRS.every((y, i) => Math.abs(intBuild[i] - AS.interest[i]) <= 0.15);

// 5) Forward P/E since 1-Oct-2025 on every weekly close (+ the 30-Sep close): price ÷ next full fiscal year's EPS
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pl = RAW.tables['profit-loss'], ns = RAW.schedules['profit-loss']['Net Profit'];
const epsRep = {}, EXC_AT = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4); epsRep[y] = pl.rows['EPS in Rs'][i]; EXC_AT[y] = ns['Exceptional items AT'][p] || 0; } });
const epsU = F.pat.map(p => p / SHARES); // engine EPS unrounded
const byFy = { 2026: epsRep[2026], 2027: epsU[0], 2028: epsU[1], 2029: epsU[2] };
const pxAll = RAW.charts.price.Price.filter(([d]) => d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const px = pxAll.filter(([d]) => d >= FROM);
const seriesOn = (pts, by) => pts.map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10]);
const stat = s => { const v = s.map(x => x[1]); return { med: medOf(v), p25: pctl(v, 0.25), p75: pctl(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }; };
const sPe = seriesOn(px, byFy), HB = stat(sPe);
const sPeAll = seriesOn(pxAll, byFy), HALL = stat(sPeAll); // incl. the IPO months (sensitivity)
const HB_h1 = stat(sPe.filter(([d]) => d < '2026-04-01')), HB_h2 = stat(sPe.filter(([d]) => d >= '2026-04-01'));
const FM = forwardMedian('ANTHEM', M, { from: FROM }); // house function: every 5th week, reported EPS
const fwdNow = price / epsU[1], peFY27 = price / epsU[0], peSep = price / sep(epsU);
const trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;
const epsFY26ex = epsRep[2026] - EXC_AT[2026] / (592 / epsRep[2026]); // before the labour-code charge

// 6) Sector factor (PLAYBOOK §7c): nine peers' trailing P/E (and EV/EBITDA) at the 30-Sep close vs their medians since 1-Oct-2025
const PEER_SET = D.peers.set, EXCL = Object.keys(D.peers.excluded), CDMO = D.peers.cdmo;
const PEERS = peersAsOf([...new Set([...PEER_SET, ...CDMO, 'ANTHEM'])], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const raw = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
const medFrom = (sym, ch, key, from) => medOf((raw(sym).charts?.[ch]?.[key] || []).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const ALLS = [...new Set([...PEER_SET, ...CDMO, 'ANTHEM'])];
const MEDW = Object.fromEntries(ALLS.map(s => [s, medFrom(s, 'pe', 'Price to Earning', FROM)]));
const MED5 = Object.fromEntries([...PEER_SET, ...CDMO].map(s => [s, medFrom(s, 'pe', 'Price to Earning', '2021-09-30')]));
const MEDWEV = Object.fromEntries(ALLS.map(s => [s, medFrom(s, 'evEbitda', 'EV Multiple', FROM)]));
const drW = Object.fromEntries(ALLS.map(s => [s, (P[s].pe / MEDW[s] - 1) * 100]));
const dr5 = Object.fromEntries([...PEER_SET, ...CDMO].map(s => [s, (P[s].pe / MED5[s] - 1) * 100]));
const drWev = Object.fromEntries(ALLS.map(s => [s, (P[s].evEbitda / MEDWEV[s] - 1) * 100]));
const sectorCalc = medOf(PEER_SET.map(s => drW[s])), sectorEvCalc = medOf(PEER_SET.map(s => drWev[s])), sector5 = medOf(PEER_SET.map(s => dr5[s]));
const SECTOR = 17.2, SECTOR_EV = 6.7; // set in PLAYBOOK §7c (A21, ANTHEM); our reproduction is sectorCalc / sectorEvCalc
const k = 1 + SECTOR / 100, kev = 1 + SECTOR_EV / 100;
if (Math.abs(sectorCalc - SECTOR) > 0.1 || Math.abs(sectorEvCalc - SECTOR_EV) > 0.1) console.warn(`WARNING: ANTHEM factor reproduces at ${sectorCalc.toFixed(2)}% / ${sectorEvCalc.toFixed(2)}% vs ${SECTOR}% / ${SECTOR_EV}% set in PLAYBOOK §7c`);
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma', SYNGENE: 'Syngene', SAILIFE: 'Sai Life Sciences', PPLPHARMA: 'Piramal Pharma', NEULANDLAB: 'Neuland Labs', ANTHEM: 'Anthem Biosciences' }[s] || s);

// 7) Target multiples (derived; the engine values reported EPS, which carries no adjustment here)
const MULT = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };

// 8) Forward EV/EBITDA since 1-Oct-2025: EV at each weekly close = price × shares − last published company net cash;
//    ÷ next full fiscal year's EBITDA (our FY27E/FY28E, Screener basis) × the peers' EV/EBITDA move over the same window
const NC_PUB = [['2025-05-19', 624.2], ['2025-08-14', 784.8], ['2025-11-10', 993.4], ['2026-02-05', 1231.2], ['2026-05-19', 1374.3], ['2026-07-21', 1719.7]];
const ncAt = d => NC_PUB.filter(([x]) => x <= d).at(-1)[1];
const ebBy = { 2027: F.ebitda[0], 2028: F.ebitda[1], 2029: F.ebitda[2] };
const sEv = px.map(([d, p]) => [d, Math.round((p * SHARES - ncAt(d)) / ebBy[fyOf(d)] * 10) / 10]), EVH = stat(sEv);
const EVM = { base: half(EVH.med * kev), bull: half(EVH.p75 * kev), bear: half(EVH.p25 * kev) };
const EVM_PEF = half(EVH.med * k), evNowFwd = (mcap - Q1.netCash) / F.ebitda[1];
const ebitdaSep = sep(F.ebitda), treasSep = sep(F.treasury);

// 9) Checks: assumptions multiples = derivation; engine P/E value = multiple × Sep-28E EPS; target = rounded P/E value
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const multOk = ['base', 'bull', 'bear'].every(c => PEM.multiple[c] === MULT[c]), evOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === EVM[c]);
const epsSep28 = mv('pe').metric;
if (!process.env.TP_NOCHECK) {
  if (!oiOk) throw new Error(`ANTHEM other income: build ${oiBuild.map(x => x.toFixed(1))} vs assumptions ${AS.otherIncome}`);
  if (!intOk) throw new Error(`ANTHEM interest: build ${intBuild.map(x => x.toFixed(2))} vs assumptions ${AS.interest}`);
  if (!multOk || !evOk) throw new Error(`ANTHEM: assumptions multiples differ from the derivation (P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}); run TP_NOCHECK=1 node tools/authoring/ANTHEM.mult.js`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'pe').value; if (tp !== Math.round(pv / 10) * 10) throw new Error(`ANTHEM ${c} target ${tp} is not the P/E value ${Math.round(pv)}`); });
}

// 10) Reverse-DCF test (same mechanics as src/forecast.js dcf(), flat growth FY28-41E): growth the price needs
const DC = AS.dcf, tTax = AS.taxRate[2] / 100, ke = V.ke;
const dcfAt = g => { let s = F.sales[0], pv = 0, last = null; const n = DC.years;
  for (let kk = 1; kk <= n; kk++) { const sF = (kk - 3 + 1) / (n - 3 + 1); const m = kk < 3 ? F.ebitdaMargin[kk] : F.ebitdaMargin[2] + (DC.fadeMarginTo - F.ebitdaMargin[2]) * sF; const cx = kk < 3 ? F.capex[kk] / F.sales[kk] * 100 : F.capex[2] / F.sales[2] * 100 + (DC.fadeCapexPctTo - F.capex[2] / F.sales[2] * 100) * sF;
    s *= 1 + g / 100; const e = s * m / 100, dep = s * DC.depPctOfSales / 100, f = (e - dep) * (1 - tTax) + dep - s * cx / 100 - F.owcPct / 100 * s * (g / (100 + g)); pv += f / Math.pow(1 + ke / 100, kk - 0.5); last = f; }
  const tv = last * (1 + DC.terminalGrowth / 100) / ((ke - DC.terminalGrowth) / 100) / Math.pow(1 + ke / 100, n);
  return (pv + tv + F.treasury[0]) / SHARES * Math.pow(1 + ke / 100, 0.5); };
let lo = 0, hi = 60; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (dcfAt(mid) < price) lo = mid; else hi = mid; }
const gNeeded = (lo + hi) / 2, dcfAt20 = dcfAt(20), dcfAt25 = dcfAt(25);

// 11) Sensitivity rows (not used in the base)
const peV = (m, e) => Math.round(m * e / 10) * 10;
const epsCagr = cagr(epsRep[2026], epsU[2], 3), epsCagrEx = cagr(epsFY26ex, epsU[2], 3), salesCagr = cagr(A.sales[b], F.sales[2], 3), ebitdaCagr = cagr(A.ebitda[b], F.ebitda[2], 3);
const SENS = [
  { name: `House base: median since 1-Oct-2025 (every weekly close) × ${k.toFixed(3)}`, mult: MULT.base, why: `${n1(HB.med)}x × ${k.toFixed(3)}` },
  { name: 'House forwardMedian (every 5th week since 1-Oct-2025)', mult: half(FM.median * k), why: `${n1(FM.median)}x × ${k.toFixed(3)}` },
  { name: 'Including the IPO months (from listing, 25-Jul-2025)', mult: half(HALL.med * k), why: `${n1(HALL.med)}x × ${k.toFixed(3)}` },
  { name: 'Last six months only (Apr-Sep 2026, FY28E EPS)', mult: half(HB_h2.med * k), why: `${n1(HB_h2.med)}x × ${k.toFixed(3)}` },
  { name: 'No sector factor (own median only)', mult: half(HB.med), why: `${n1(HB.med)}x` },
  { name: 'Five-year pharma factor (+8.2%, names outside the set)', mult: half(HB.med * 1.082), why: `${n1(HB.med)}x × 1.082` },
  { name: `Blend with Anthem's own move (${pc1(drW.ANTHEM)}; not house policy)`, mult: half(HB.med * (1 + (SECTOR + drW.ANTHEM) / 200)), why: `midpoint of ${pc1(SECTOR)} and ${pc1(drW.ANTHEM)}` },
  { name: `Growth view: PEG 3.0x on our FY26-29E EPS growth (${n1(epsCagr)}%; not house policy)`, mult: half(3.0 * epsCagr), why: `3.0 × ${n1(epsCagr)}` },
  { name: 'Street P/E users: Jefferies 65x / BOBCAPS 57x / PL 55x', mult: 59, why: 'Average of the three post-Q1 P/E multiples' },
].map(r => ({ ...r, tp: peV(r.mult, epsSep28), up: (r.mult * epsSep28 / price - 1) * 100 }));

// 12) Rating from the house rule; street as it stood on 30-Sep-2026
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, br = n => ST.find(s => s.broker.startsWith(n));
const withTp = ST.filter(s => s.tp), medTp = medOf(withTp.map(s => s.tp));
const postQ1 = ST.filter(s => s.date >= '2026-07-21'), medTpPost = medOf(postQ1.map(s => s.tp));
const jef = br('Jefferies'), pll = br('Prabhudas'), bob = br('BOB'), jm = br('JM'), hsie = br('HDFC'), nom = br('Nomura'), jpm = br('JPMorgan'), drc = br('DRChoksey');
const atOurs = { jef: 65 * sep(epsU), bob: 57 * (0.75 * epsU[1] + 0.25 * epsU[2]), pl: 55 * epsU[1] };
const implPeAtPrice = price / epsSep28;

// 13) Growth, returns, capital
const capex6 = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].reduce((s, y) => s + (A.capex[ai(y)] || 0), 0), cfo6 = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].reduce((s, y) => s + (A.cfo[ai(y)] || 0), 0);
const salesCagr6 = cagr(A.sales[ai('FY20')], A.sales[b], 6), divYield = F.dps[0] / price * 100;
const ptEbitda = sep(F.sales) / 100, ptEps = ptEbitda * (1 - AS.taxRate[1] / 100) / SHARES;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, LISTED, n0, n1, pc, pc1, rup, half, cagr, medOf, pctl, shortDate, SRC, b, ai, YRS, sep, price, SHARES, mcap, SA, SQ, QL, Q1, FY26,
  BL, KEYS, LBL, LINES, buildTot, crdmoTot, mixPct, ND0, cashPath, TRE, CO_NC0, grossTreasury26, TY, RODTEP, MISC, oiTreas, oiBuild, OIN, OI26, ttmOi, yld26, yldQ1, KD, OTHER_FIN, BORR, intBuild,
  fyOf, epsRep, EXC_AT, epsU, byFy, sPe, HB, sPeAll, HALL, HB_h1, HB_h2, FM, fwdNow, peFY27, peSep, trailEps, trailPe, epsFY26ex,
  PEER_SET, EXCL, CDMO, PEERS, P, MEDW, MED5, MEDWEV, drW, dr5, drWev, sectorCalc, sectorEvCalc, sector5, SECTOR, SECTOR_EV, k, kev, shortName, MULT,
  NC_PUB, sEv, EVH, EVM, EVM_PEF, evNowFwd, ebitdaSep, treasSep, BM, mv, multOk, evOk, epsSep28, gNeeded, dcfAt20, dcfAt25, peV, epsCagr, epsCagrEx, salesCagr, ebitdaCagr, SENS,
  rating, ruleText, buyBelow, sellAbove, ST, br, withTp, medTp, postQ1, medTpPost, jef, pll, bob, jm, hsie, nom, jpm, drc, atOurs, implPeAtPrice, capex6, cfo6, salesCagr6, divYield, ptEbitda, ptEps };

if (require.main === module) {
  console.log('build', buildTot.map(n0), 'model', F.sales, 'CRDMO', crdmoTot.map(n0), 'mix SI', mixPct('si').map(n1));
  console.log('cash path', cashPath.map(n0), 'company NC Mar-26', CO_NC0, 'gross treasury', n0(grossTreasury26));
  console.log('OI build', oiBuild.map(n1), 'vs', AS.otherIncome, oiOk, 'treas', oiTreas.map(n1), 'FY26', OI26, 'TTM', ttmOi, 'yield FY26', n1(yld26), 'Q1', n1(yldQ1));
  console.log('interest', intBuild.map(x => x.toFixed(2)), 'vs', AS.interest, intOk);
  console.log('EPS', epsU.map(x => x.toFixed(2)), 'Sep-28E', epsSep28.toFixed(2), 'FY26 rep/ex', epsRep[2026], epsFY26ex.toFixed(2), 'CAGR', n1(epsCagr), n1(epsCagrEx));
  console.log('fwd P/E since Oct-25', JSON.stringify(HB), '| all', JSON.stringify(HALL), '| H1', HB_h1.med, 'H2', HB_h2.med, '| house', FM.median, FM.medianAll, FM.troughYears);
  console.log('now: fwd FY28', n1(fwdNow), 'FY27', n1(peFY27), 'Sep28', n1(peSep), 'trail', n1(trailPe), trailEps.toFixed(2));
  console.log('factor P/E', sectorCalc.toFixed(3), 'EV', sectorEvCalc.toFixed(3), '5y', sector5.toFixed(2), PEER_SET.map(s => `${s} ${P[s].pe}/${MEDW[s]}=${drW[s].toFixed(2)}`).join('; '), '| Anthem own', drW.ANTHEM.toFixed(2), drWev.ANTHEM.toFixed(2));
  console.log('EV hist', JSON.stringify(EVH), 'EVM', JSON.stringify(EVM), 'EV with P/E factor', EVM_PEF, 'EV now fwd', n1(evNowFwd));
  console.log('MULT', MULT, 'ok?', multOk, evOk, '| TP', V.tp, V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'bull', SC.bull.tp, 'bear', SC.bear.tp);
  console.log('gNeeded', n1(gNeeded), 'dcf@20', n0(dcfAt20), 'dcf@25', n0(dcfAt25), 'engine dcf', V.intrinsicTp);
  console.log('SENS', SENS.map(r => `${r.name}: ${r.mult}x ${r.tp}`).join(' | '));
  console.log('street med', medTp, 'post-Q1 med', medTpPost, 'at ours', JSON.stringify(Object.fromEntries(Object.entries(atOurs).map(([a, c]) => [a, Math.round(c)]))), 'impl P/E', n1(implPeAtPrice));
}
