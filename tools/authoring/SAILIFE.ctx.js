// Sai Life Sciences initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and the
// built model and computes, once: the two-line revenue build (CDMO + CRO, checked against model revenue), the net-debt path
// (engine basis: cash + investments + deposits in other financial assets - borrowings incl. leases) and our split of it into
// gross cash, bank debt and leases, the other-income build (realised FY26 deposit yield on the gross cash Sai keeps + small
// items; no forex) and the interest build (bank debt + leases + other), both checked against assumptions.json; the
// one-year-forward EV/EBITDA and P/E history since 1-Jul-2025 on every weekly close plus the 30-Sep close (Sai listed on
// 18-Dec-2024; IPO months skipped, as for EMCURE and MANKIND; forward EBITDA/EPS = our FY27E/FY28E, which carry no exceptional
// items), the pharma sector factor over the same window (nine peers, +9.1% EV/EBITDA / +18.5% P/E, reproduced peer by peer
// with the same method as tools/authoring/sector-factor.js), the derived multiples (must equal assumptions.json;
// SAILIFE.mult.js writes them), a reverse-DCF test, sensitivity rows, CDMO peers and the street as it stood on 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'SAILIFE', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'SAILIFE.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'SAILIFE', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2025-07-01', LISTED = '2024-12-18';
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
const SRC = 'Sai Life Sciences annual reports, results presentations and calls; Screener.in (consolidated); GAM Research';
const b = A.labels.length - 1; // FY26 index
const ai = fy => A.labels.indexOf(fy);
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const SA = SG.annual, SQ = SG.quarterly, Q1 = C.q1fy27, FY26 = C.fy26;

// 1) Two-line build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines, KEYS = ['cdmo', 'cro'];
const LBL = { cdmo: 'CDMO (development & manufacturing)', cro: 'CRO (discovery services)' };
const LINES = Object.fromEntries(KEYS.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => KEYS.reduce((s, k) => s + LINES[k][i], 0));
const baseTot = KEYS.reduce((s, k) => s + BL.base[k], 0);
if (Math.abs(baseTot / A.sales[b] - 1) > 0.001) throw new Error(`SAILIFE build base ${baseTot} != FY26 ${A.sales[b]}`);
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`SAILIFE build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });
const mixPct = k => YRS.map((_, i) => LINES[k][i] / buildTot[i] * 100);

// 2) Net debt: engine path (gross cash + investments + deposits in other financial assets − borrowings incl. leases) and our split
const OT = AS.otherTreasury.base;
const ND0 = (A.cash[b] || 0) + (A.investments[b] || 0) + OT - (A.borrowings[b] || 0); // Mar-26 engine net cash (negative = net debt)
const cashPath = [ND0, ...F.treasury];
const TRE = C.treasury.mar26;
const G0 = (A.cash[b] || 0) + (A.investments[b] || 0) + OT; // Mar-26 gross cash, deposits and funds
const GROSS = [G0, 200, 200, 200]; // assumption: Sai keeps ~₹200 cr of cash and deposits and borrows for the rest of its capex
const LEASES = 193; // lease liabilities held flat at the Mar-26 level (₹193.6 cr)
const BORR = GROSS.map((g, i) => g - cashPath[i] - LEASES); // bank debt implied by the engine's net-debt path
const netDebtEx = BORR.map((x, i) => x - GROSS[i]); // net bank debt excluding leases

// 3) Other income build: FY26 realised yield on average gross cash + small items; no forex (checked against assumptions)
const OIN = C.otherIncomeNote, TREA25 = C.treasury.mar25;
const G25 = TREA25.cashAndBank + TREA25.investments + TREA25.fdsInOtherFinancialAssets;
const TY = OIN.FY26.depositInterest / ((G25 + G0) / 2) * 100; // ~4.7%
const MISC = 0.5; // amortised-cost interest, fund gains and other (FY26 ₹0.9 cr)
const oiTreas = YRS.map((_, i) => TY / 100 * (GROSS[i] + GROSS[i + 1]) / 2);
const oiBuild = YRS.map((_, i) => oiTreas[i] + MISC);
const oiOk = YRS.every((y, i) => Math.abs(oiBuild[i] - AS.otherIncome[i]) <= 0.15);
const OI26 = OIN.FY26.total, ttmOi = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);

// 4) Interest build: 8.5% on average bank debt + lease interest at FY26's 11.1% + ~₹3 cr other finance costs
const FCN = C.financeCostNote.FY26;
const KD = 8.5, LR = FCN.leases / ((TREA25.leases + TRE.leases) / 2) * 100, LEASE_INT = LR / 100 * LEASES, OTHER_FIN = 3;
const intBorrow = YRS.map((_, i) => KD / 100 * (BORR[i] + BORR[i + 1]) / 2);
const intBuild = YRS.map((_, i) => intBorrow[i] + LEASE_INT + OTHER_FIN);
const intOk = YRS.every((y, i) => Math.abs(intBuild[i] - AS.interest[i]) <= 0.15);

// 5) Forward EV/EBITDA and P/E since 1-Jul-2025 on every weekly close (+ the 30-Sep close)
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pl = RAW.tables['profit-loss'], ns = RAW.schedules['profit-loss']['Net Profit'];
const epsRep = {}, EXC_AT = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4); epsRep[y] = pl.rows['EPS in Rs'][i]; EXC_AT[y] = ns['Exceptional items AT'][p] || 0; } });
const epsU = F.eps.slice();
const byFy = { 2026: epsRep[2026], 2027: epsU[0], 2028: epsU[1], 2029: epsU[2] };
const epsFY26ex = epsRep[2026] - EXC_AT[2026] / (A.pat[b] / epsRep[2026]); // before the labour-code charge
const byFyEx = { ...byFy, 2026: epsFY26ex };
const pxAll = RAW.charts.price.Price.filter(([d]) => d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const px = pxAll.filter(([d]) => d >= FROM);
const stat = s => { const v = s.map(x => x[1]); return { med: medOf(v), p25: pctl(v, 0.25), p75: pctl(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }; };
// engine-basis net cash as last published: Mar-25 (Q4FY25 results, May-2025), Mar-26 (Q4FY26 results, 15-May-2026)
const NC_PUB = [['2025-05-01', TREA25.cashAndBank + TREA25.investments + TREA25.fdsInOtherFinancialAssets - (A.borrowings[ai('FY25')] || 0)], ['2026-05-15', ND0]];
const ncAt = d => (NC_PUB.filter(([x]) => x <= d).at(-1) || NC_PUB[0])[1];
const ebBy = { 2027: F.ebitda[0], 2028: F.ebitda[1], 2029: F.ebitda[2] };
const sEv = px.map(([d, p]) => [d, Math.round((p * SHARES - ncAt(d)) / ebBy[fyOf(d)] * 10) / 10]), EVH = stat(sEv);
const sPe = px.map(([d, p]) => [d, Math.round(p / byFy[fyOf(d)] * 10) / 10]), HB = stat(sPe);
const winStat = (s, a, z) => stat(s.filter(([d]) => d >= a && d <= z));
const EVH_h1 = winStat(sEv, FROM, '2026-03-31'), EVH_h2 = winStat(sEv, '2026-04-01', ASOF);
// sensitivity: including the IPO months (listing to Jun-2025: forward year FY26 actual for Dec-24 to Mar-25, FY27E after)
const ebFY26 = A.ebitda[b];
const sEvIpo = pxAll.filter(([d]) => d < FROM).map(([d, p]) => [d, Math.round((p * SHARES - ncAt(d)) / (fyOf(d) === 2026 ? ebFY26 : ebBy[fyOf(d)]) * 10) / 10]);
const EVH_all = stat([...sEvIpo, ...sEv]);
const sPeIpoRep = pxAll.filter(([d]) => d < FROM).map(([d, p]) => [d, Math.round(p / byFy[fyOf(d)] * 10) / 10]);
const sPeIpoEx = pxAll.filter(([d]) => d < FROM).map(([d, p]) => [d, Math.round(p / byFyEx[fyOf(d)] * 10) / 10]);
const HB_allRep = stat([...sPeIpoRep, ...sPe]), HB_allEx = stat([...sPeIpoEx, ...sPe]);
const FM = forwardMedian('SAILIFE', M, { from: FROM }); // house function: every 5th week, reported EPS (P/E)
// trough check (PLAYBOOK §4): a forward year is a trough if EPS ≤ 0 or < half the best of the three years before
const troughYears = [2026, 2027, 2028].filter(fy => { const prev = [byFy[fy - 1], byFy[fy - 2], byFy[fy - 3]].filter(v => v != null); const pk = prev.length ? Math.max(...prev) : null; return !(byFy[fy] > 0) || (pk > 0 && byFy[fy] < 0.5 * pk); });
const evNowFwd = (mcap - ND0) / F.ebitda[1], evNowFY27 = (mcap - ND0) / F.ebitda[0], fwdNow = price / epsU[1], peFY27 = price / epsU[0], peSep = price / sep(epsU);
const trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;
const trailEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), trailEv = (mcap - ND0) / trailEbitda;

// 6) Sector factor (PLAYBOOK §7c): nine peers' trailing EV/EBITDA and P/E at the 30-Sep close vs their medians since 1-Jul-2025
const PEER_SET = D.peers.set, EXCL = Object.keys(D.peers.excluded), CDMO = D.peers.cdmo;
const ALLS = [...new Set([...PEER_SET, ...CDMO, 'SAILIFE'])];
const PEERS = peersAsOf(ALLS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const raw = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
const medFrom = (sym, ch, key, from) => medOf((raw(sym).charts?.[ch]?.[key] || []).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const MEDW = Object.fromEntries(ALLS.map(s => [s, medFrom(s, 'pe', 'Price to Earning', FROM)]));
const MEDWEV = Object.fromEntries(ALLS.map(s => [s, medFrom(s, 'evEbitda', 'EV Multiple', FROM)]));
const MED5EV = Object.fromEntries(PEER_SET.map(s => [s, medFrom(s, 'evEbitda', 'EV Multiple', '2021-09-30')]));
const drW = Object.fromEntries(ALLS.map(s => [s, (P[s].pe / MEDW[s] - 1) * 100]));
const drWev = Object.fromEntries(ALLS.map(s => [s, (P[s].evEbitda / MEDWEV[s] - 1) * 100]));
const dr5ev = Object.fromEntries(PEER_SET.map(s => [s, (P[s].evEbitda / MED5EV[s] - 1) * 100]));
const sectorCalc = medOf(PEER_SET.map(s => drW[s])), sectorEvCalc = medOf(PEER_SET.map(s => drWev[s])), sector5ev = medOf(PEER_SET.map(s => dr5ev[s]));
const SECTOR_EV = 9.1, SECTOR = 18.5; // the nine peers over Sai's window (sector-factor.js --from 2025-07-01); our reproduction is sectorEvCalc / sectorCalc
const kev = 1 + SECTOR_EV / 100, k = 1 + SECTOR / 100;
if (Math.abs(sectorCalc - SECTOR) > 0.1 || Math.abs(sectorEvCalc - SECTOR_EV) > 0.1) console.warn(`WARNING: SAILIFE factor reproduces at ${sectorCalc.toFixed(2)}% / ${sectorEvCalc.toFixed(2)}% vs ${SECTOR}% / ${SECTOR_EV}%`);
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma', SYNGENE: 'Syngene', SAILIFE: 'Sai Life Sciences', PPLPHARMA: 'Piramal Pharma', NEULANDLAB: 'Neuland Labs', ANTHEM: 'Anthem Biosciences', ACUTAAS: 'Acutaas Chemicals' }[s] || s);

// 7) Target multiples (derived): EV/EBITDA primary, P/E cross-check
const MULT = { base: half(EVH.med * kev), bull: half(EVH.p75 * kev), bear: half(EVH.p25 * kev) };
const PEM_D = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };

// 8) Checks: assumptions multiples = derivation; target = rounded EV/EBITDA value
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const EVA = AS.valuation.blend.methods.find(x => x.key === 'ev'), PEA = AS.valuation.blend.methods.find(x => x.key === 'pe');
const multOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === MULT[c]), peOk = ['base', 'bull', 'bear'].every(c => PEA.multiple[c] === PEM_D[c]);
const ebitdaSep = sep(F.ebitda), treasSep = sep(F.treasury), epsSep28 = sep(epsU);
if (!process.env.TP_NOCHECK) {
  if (!oiOk) throw new Error(`SAILIFE other income: build ${oiBuild.map(x => x.toFixed(2))} vs assumptions ${AS.otherIncome}`);
  if (!intOk) throw new Error(`SAILIFE interest: build ${intBuild.map(x => x.toFixed(2))} vs assumptions ${AS.interest}`);
  if (!multOk || !peOk) throw new Error(`SAILIFE: assumptions multiples differ from the derivation (EV ${JSON.stringify(MULT)}, P/E ${JSON.stringify(PEM_D)}); run node tools/authoring/SAILIFE.mult.js`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'ev').value; if (tp !== Math.round(pv / 10) * 10) throw new Error(`SAILIFE ${c} target ${tp} is not the EV/EBITDA value ${Math.round(pv)}`); });
}

// 9) Reverse-DCF test (same mechanics as src/forecast.js dcf(), flat growth FY28-41E): growth the price needs
const DC = AS.dcf, tTax = AS.taxRate[2] / 100, ke = V.ke;
const dcfAt = g => { let s = F.sales[0], pv = 0, last = null; const n = DC.years;
  for (let kk = 1; kk <= n; kk++) { const sF = (kk - 3 + 1) / (n - 3 + 1); const m = kk < 3 ? F.ebitdaMargin[kk] : F.ebitdaMargin[2] + (DC.fadeMarginTo - F.ebitdaMargin[2]) * sF; const cx = kk < 3 ? F.capex[kk] / F.sales[kk] * 100 : F.capex[2] / F.sales[2] * 100 + (DC.fadeCapexPctTo - F.capex[2] / F.sales[2] * 100) * sF;
    s *= 1 + g / 100; const e = s * m / 100, dep = s * DC.depPctOfSales / 100, f = (e - dep) * (1 - tTax) + dep - s * cx / 100 - F.owcPct / 100 * s * (g / (100 + g)); pv += f / Math.pow(1 + ke / 100, kk - 0.5); last = f; }
  const tv = last * (1 + DC.terminalGrowth / 100) / ((ke - DC.terminalGrowth) / 100) / Math.pow(1 + ke / 100, n);
  return (pv + tv + F.treasury[0]) / SHARES * Math.pow(1 + ke / 100, 0.5); };
let lo = 0, hi = 60; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (dcfAt(mid) < price) lo = mid; else hi = mid; }
const gNeeded = (lo + hi) / 2, dcfAt20 = dcfAt(20), dcfAt25 = dcfAt(25);

// 10) Sensitivity rows (not used in the base): EV/EBITDA value at a multiple; P/E value at a multiple
const evNetCashSep = mv('ev').value * SHARES - mv('ev').metric * mv('ev').mult; // the engine's Sep-28E net cash (exact)
const evVal = m => Math.round((m * mv('ev').metric + evNetCashSep) / SHARES / 10) * 10;
const peV = m => Math.round(m * mv('pe').metric / 10) * 10;
const epsCagr = cagr(epsRep[2026], epsU[2], 3), salesCagr = cagr(A.sales[b], F.sales[2], 3), ebitdaCagr = cagr(A.ebitda[b], F.ebitda[2], 3);
const SENS = [
  { name: `House base: forward EV/EBITDA median since 1-Jul-2025 (every weekly close) × ${kev.toFixed(3)}`, mult: MULT.base, why: `${n1(EVH.med)}x × ${kev.toFixed(3)}` },
  { name: 'Including the IPO months (from listing, Dec-2024)', mult: half(EVH_all.med * kev), why: `${n1(EVH_all.med)}x × ${kev.toFixed(3)}` },
  { name: 'Last six months only (Apr-Sep 2026, FY28E EBITDA)', mult: half(EVH_h2.med * kev), why: `${n1(EVH_h2.med)}x × ${kev.toFixed(3)}` },
  { name: 'No sector factor (own median only)', mult: half(EVH.med), why: `${n1(EVH.med)}x` },
  { name: `P/E factor applied to EV/EBITDA (+${SECTOR}%)`, mult: half(EVH.med * k), why: `${n1(EVH.med)}x × ${k.toFixed(3)}` },
  { name: `Blend with Sai's own EV/EBITDA move (${pc1(drWev.SAILIFE)}; not house policy)`, mult: half(EVH.med * (1 + (SECTOR_EV + drWev.SAILIFE) / 200)), why: `midpoint of ${pc1(SECTOR_EV)} and ${pc1(drWev.SAILIFE)}` },
  { name: 'HDFC Securities multiple (29x, Q3FY28E in its note)', mult: 29, why: 'Jan-2026 initiation' },
  { name: "JM Financial's Nov-2025 multiple (32x, Sep-27E in its note)", mult: 32, why: 'Nov-2025 note' },
].map(r => ({ ...r, tp: evVal(r.mult), up: (evVal(r.mult) / price - 1) * 100 }));

// 11) Rating from the house rule; street as it stood on 30-Sep-2026
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, br = n => ST.find(s => s.broker.startsWith(n));
const withTp = ST.filter(s => s.tp), medTp = medOf(withTp.map(s => s.tp));
const postQ1 = ST.filter(s => s.date >= '2026-08-07'), medTpPost = medOf(postQ1.map(s => s.tp));
const jef = br('Jefferies'), kot = br('Kotak'), ms = br('Morgan'), jm = br('JM'), hsie = br('HDFC');
const atHsie = Math.round((29 * (0.25 * F.ebitda[0] + 0.75 * F.ebitda[1]) + (0.25 * F.treasury[0] + 0.75 * F.treasury[1])) / SHARES / 10) * 10; // 29x Q3FY28E ≈ ¼ FY27E + ¾ FY28E (trailing-four-quarter basis)
const atJm2 = Math.round((32 * sep([0, F.ebitda[0], F.ebitda[1]]) + sep([0, F.treasury[0], F.treasury[1]])) / SHARES / 10) * 10;
const implEvAtPrice = (mcap - treasSep) / ebitdaSep;

// 12) Growth, returns, capital
const capY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const capex6 = capY.reduce((s, y) => s + (A.capex[ai(y)] || 0), 0), cfo6 = capY.reduce((s, y) => s + (A.cfo[ai(y)] || 0), 0);
const salesCagr5 = cagr(A.sales[ai('FY21')], A.sales[b], 5);
const ptEbitda = sep(F.sales) / 100; // ₹ cr of Sep-28E EBITDA per point of margin
const ptPerShare = ptEbitda * MULT.base / SHARES;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, LISTED, n0, n1, pc, pc1, rup, half, cagr, medOf, pctl, shortDate, SRC, b, ai, YRS, sep, price, SHARES, mcap, SA, SQ, Q1, FY26,
  BL, KEYS, LBL, LINES, buildTot, mixPct, OT, ND0, cashPath, TRE, G0, GROSS, LEASES, BORR, netDebtEx, OIN, G25, TY, MISC, oiTreas, oiBuild, OI26, ttmOi, FCN, KD, LR, LEASE_INT, OTHER_FIN, intBorrow, intBuild,
  fyOf, epsRep, EXC_AT, epsU, byFy, epsFY26ex, NC_PUB, sEv, EVH, EVH_h1, EVH_h2, sEvIpo, EVH_all, sPe, HB, HB_allRep, HB_allEx, FM, troughYears, evNowFwd, evNowFY27, fwdNow, peFY27, peSep, trailEps, trailPe, trailEbitda, trailEv,
  PEER_SET, EXCL, CDMO, PEERS, P, MEDW, MEDWEV, MED5EV, drW, drWev, dr5ev, sectorCalc, sectorEvCalc, sector5ev, SECTOR, SECTOR_EV, k, kev, shortName, MULT, PEM_D,
  BM, mv, multOk, peOk, ebitdaSep, treasSep, evNetCashSep, epsSep28, gNeeded, dcfAt20, dcfAt25, evVal, peV, epsCagr, salesCagr, ebitdaCagr, SENS,
  rating, ruleText, buyBelow, sellAbove, ST, br, withTp, medTp, postQ1, medTpPost, jef, kot, ms, jm, hsie, atHsie, atJm2, implEvAtPrice, capex6, cfo6, salesCagr5, ptEbitda, ptPerShare };

if (require.main === module) {
  console.log('build', buildTot.map(n0), 'model', F.sales.map(n0), 'mix CRO', mixPct('cro').map(n1));
  console.log('cash path', cashPath.map(n0), 'gross', GROSS.map(n0), 'borrow', BORR.map(n0), 'leases', LEASES);
  console.log('OI build', oiBuild.map(x => x.toFixed(2)), 'vs', AS.otherIncome, oiOk, 'TY', TY.toFixed(2), 'FY26', OI26, 'TTM', n1(ttmOi));
  console.log('interest', intBuild.map(x => x.toFixed(2)), 'vs', AS.interest, intOk, 'LR', LR.toFixed(2), 'lease int', LEASE_INT.toFixed(1));
  console.log('EPS', epsU.map(x => x.toFixed(2)), 'Sep-28E', epsSep28.toFixed(2), 'FY26 rep/ex', epsRep[2026], epsFY26ex.toFixed(2), 'CAGR', n1(epsCagr), 'troughs', troughYears);
  console.log('fwd EV since Jul-25', JSON.stringify(EVH), '| H1', EVH_h1.med, 'H2', EVH_h2.med, '| all', EVH_all.med, '| now FY28', n1(evNowFwd), 'FY27', n1(evNowFY27), 'trail', n1(trailEv));
  console.log('fwd PE since Jul-25', JSON.stringify(HB), '| allRep', HB_allRep.med, 'allEx', HB_allEx.med, '| house', FM.median, FM.medianAll, FM.troughYears, '| now FY28', n1(fwdNow), 'trail', n1(trailPe));
  console.log('factor PE', sectorCalc.toFixed(2), 'EV', sectorEvCalc.toFixed(2), '5y EV', sector5ev.toFixed(2), '| Sai own', drW.SAILIFE.toFixed(1), drWev.SAILIFE.toFixed(1), 'Sai P', JSON.stringify(P.SAILIFE));
  console.log('MULT EV', MULT, 'PE', PEM_D, 'ok?', multOk, peOk, '| TP', V.tp, V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'bull', SC.bull.tp, 'bear', SC.bear.tp);
  console.log('gNeeded', n1(gNeeded), 'dcf@20', n0(dcfAt20), 'dcf@25', n0(dcfAt25), 'engine dcf', V.intrinsicTp, '| impl EV at price', n1(implEvAtPrice));
  console.log('SENS', SENS.map(r => `${r.name}: ${r.mult}x ${r.tp}`).join(' | '));
  console.log('street med', medTp, 'post-Q1', medTpPost, 'at HSIE 29x', atHsie, 'at JM 32x', atJm2);
}
