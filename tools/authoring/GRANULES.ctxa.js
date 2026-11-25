// Granules India initiation: shared context, part A (loaded by GRANULES.ctx.js). Loads the research JSONs and the built model and
// computes: the four-line revenue build (checked against model revenue), the gross-loan and gross-cash paths, the other-income build
// (5.8% on gross cash above the Mar-26 level + recurring items; FY27 = Q1 actual + warrant money from mid-Sep), the interest build
// (4.45% on average loans + leases + other borrowing costs), the one-year-forward P/E history (house forwardMedian on reported EPS,
// every 5th week since Apr-2021; sensitivities on every weekly close, on EPS before exceptional items and on the pre-issue share
// count) and the pharma sector factor peer by peer (five-year, nine-name set; Granules is outside it, so +8.2% / +7.5% apply).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'GRANULES', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'GRANULES.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'GRANULES', 'screener.json'), 'utf8')); // unpatched
const { PF } = require('./GRANULES.patch');
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2021-04-01', FROM5 = '2021-09-30', ISSUE = '2026-02-23', CONV = '2026-09-16';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => { const r = Math.round(v); return `${r >= 0 ? '+' : '−'}${Math.abs(r)}%`; };
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const cagr = (a, z, y) => (Math.pow(z / a, 1 / y) - 1) * 100;
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medI = a => { const s = [...a].sort((x, y) => x - y); if (!s.length) return null; const i = (s.length - 1) / 2, lo = Math.floor(i); return s[lo] + (s[Math.ceil(i)] - s[lo]) * (i - lo); }; // sector-factor.js convention
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SRC = 'Granules India annual report, results presentations and calls; Screener.in (consolidated); GAM Research';
const b = A.labels.length - 1, ai = fy => A.labels.indexOf(fy);
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const SA = SG.annual, SQ = SG.quarterly, Q1 = C.q1fy27, FY26 = C.fy26, BS = C.balanceSheet;

// 1) Four-line build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines, KEYS = ['fd', 'api', 'pfi', 'cdmo'];
const LBL = { fd: 'Finished dosages (FD)', api: 'API', pfi: 'Formulation intermediates (PFI)', cdmo: 'Peptide CDMO' };
const LINES = Object.fromEntries(KEYS.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => KEYS.reduce((s, k) => s + LINES[k][i], 0));
const baseTot = KEYS.reduce((s, k) => s + BL.base[k], 0);
if (Math.abs(baseTot / A.sales[b] - 1) > 0.001) throw new Error(`GRANULES build base ${baseTot} != FY26 ${A.sales[b]}`);
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`GRANULES build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });
const mixPct = k => YRS.map((_, i) => LINES[k][i] / buildTot[i] * 100);

// 2) Cash and debt paths. Engine net cash (Screener cash + investments − borrowings incl. leases; Mar-26 pro forma for the warrant money)
const ND0 = (A.cash[b] || 0) + (A.investments[b] || 0) - (A.borrowings[b] || 0);
const ND0_ACT = ND0 - PF.cashCr;                                   // actual Mar-26 (before the Sep-2026 money): −Rs562 cr
const cashPath = [ND0, ...F.treasury];
const LEASES = BS.mar26.leases, LOANS = [BS.mar26.loansTotal, 900, 850, 800];
const grossCash = cashPath.map((t, i) => t + LOANS[i] + LEASES);
const GROSS26 = BS.mar26.cash + BS.mar26.otherBank;                 // Rs949 cr actual gross cash at Mar-26
const coNetCash = cashPath.map(t => t + LEASES);                    // company basis (ex leases)

// 3) Other income build (AR FY26 notes 7B, 16): FY26 deposit yield; recurring items ex-forex; FY27 timing of the warrant money
const OIN = C.otherIncomeNote, FDY = 5.8;
const RECUR = OIN.FY26.depositInterest + OIN.FY26.otherInterest + OIN.FY26.otherNonOperating; // Rs11.1 cr
const fdYieldCalc = OIN.FY26.depositInterest / ((130.26 + 68.82) / 2) * 100;
const oi27 = { q1: OIN.Q1FY27.total, warrant: PF.cashCr * FDY / 100 * 6.5 / 12, recur: 0.75 * RECUR };
const oiTreas = [oi27.warrant, ...[1, 2].map(i => FDY / 100 * ((grossCash[i] + grossCash[i + 1]) / 2 - GROSS26))];
const oiBuild = [oi27.q1 + oi27.warrant + oi27.recur, oiTreas[1] + RECUR, oiTreas[2] + RECUR].map(x => Math.round(x * 10) / 10);
const oiOk = YRS.every((y, i) => Math.abs(oiBuild[i] - AS.otherIncome[i]) <= 0.5);
const ttmOi = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);

// 4) Interest build: 4.45% on average loans + lease interest + other borrowing costs at the Q1FY27 run-rate
const FCN = C.financeCostNote.FY26, KD = 4.45, LEASE_INT = FCN.leases, OTHER_BC = 20;
const kdCalc = (FCN.termLoan + FCN.workingCapital + FCN.others) / ((BS.mar25.loansTotal + BS.mar26.loansTotal) / 2) * 100;
const intBuild = YRS.map((_, i) => Math.round((KD / 100 * (LOANS[i] + LOANS[i + 1]) / 2 + LEASE_INT + OTHER_BC) * 10) / 10);
const intOk = YRS.every((y, i) => Math.abs(intBuild[i] - AS.interest[i]) <= 0.5);

// 5) One-year-forward P/E since Apr-2021 (price ÷ next full fiscal year's EPS): house forwardMedian = base (reported EPS, every 5th week)
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pl = RAW.tables['profit-loss'], ns = RAW.schedules['profit-loss']['Net Profit'];
const epsRep = {}, epsEx = {}, PFE = {}, EXC = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4), e = pl.rows['EPS in Rs'][i], x = ns['Exceptional items AT'][p] || 0, pf = ns['Profit for EPS'][p]; epsRep[y] = e; PFE[y] = pf; EXC[y] = x; epsEx[y] = pf ? e * (pf - x) / pf : e; } });
const epsU = F.pat.map(p => p / SHARES);
YRS.forEach((y, i) => { const fy = 2000 + +y.slice(2, 4); epsRep[fy] = F.eps[i]; epsEx[fy] = F.eps[i]; });
const FM = forwardMedian('GRANULES', M);                            // { median, medianAll, troughYears, series }
const fv = FM.series.map(x => x[1]);
const HB = { med: FM.median, p25: pct(fv, 0.25), p75: pct(fv, 0.75), min: Math.min(...fv), max: Math.max(...fv), n: fv.length };
const pxAll = RAW.charts.price.Price.filter(([d]) => d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const pxW = RAW.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).filter(([d]) => d >= FROM); // forwardSeries sampling
const ser = (pts, by) => pts.map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10]);
const st = s => { const v = s.map(x => x[1]); return { med: pct(v, 0.5), p25: pct(v, 0.25), p75: pct(v, 0.75), n: v.length }; };
const sAllW = ser(pxAll.filter(([d]) => d >= FROM), epsRep), HW = st(sAllW);   // every weekly close (sensitivity)
const sEx = ser(pxW, epsEx), HEX = st(sEx);                                     // EPS before exceptional items (sensitivity)
const RAISE_AT = 1762.5 * FDY / 100 * 0.75;                                      // after-tax interest on the full raise
const sharesPre = C.balanceSheet.preferential.sharesPre / 1e7;                 // 24.27 cr before the Feb-2026 issue
const byPre = { ...epsRep, [2027]: (F.pat[0] - RAISE_AT) / sharesPre };
const sPre = pxW.map(([d, p]) => [d, Math.round(p / (d < ISSUE && fyOf(d) === 2027 ? byPre[2027] : epsRep[fyOf(d)]) * 10) / 10]), HPRE = st(sPre);
const byFyMed = Object.fromEntries([2023, 2024, 2025, 2026, 2027, 2028].map(fy => [fy, st(sAllW.filter(([d]) => fyOf(d) === fy))]));
const troughLine = fy => 0.5 * Math.max(epsRep[fy - 1], epsRep[fy - 2], epsRep[fy - 3]);
const fwdNow = price / F.eps[1], peFY27 = price / F.eps[0], peSep = price / sep(F.eps), trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, RAW, PF, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, FROM5, ISSUE, CONV, n0, n1, pc, pc1, half, cagr, pct, medI, shortDate, SRC, b, ai, YRS, sep, price, SHARES, mcap, SA, SQ, Q1, FY26, BS,
  BL, KEYS, LBL, LINES, buildTot, mixPct, ND0, ND0_ACT, cashPath, LEASES, LOANS, grossCash, GROSS26, coNetCash, OIN, FDY, RECUR, fdYieldCalc, oi27, oiTreas, oiBuild, oiOk, ttmOi, FCN, KD, LEASE_INT, OTHER_BC, kdCalc, intBuild, intOk,
  fyOf, epsRep, epsEx, PFE, EXC, epsU, FM, HB, pxAll, pxW, sAllW, HW, sEx, HEX, RAISE_AT, sharesPre, byPre, sPre, HPRE, byFyMed, troughLine, fwdNow, peFY27, peSep, trailEps, trailPe, peersAsOf };
