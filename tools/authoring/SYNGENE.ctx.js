// Syngene International initiation: shared context, part 1 (data, builds, histories). SYNGENE.ctx2.js adds the sector factor,
// multiples, checks, sensitivities, street and rating, and re-exports everything for the Part B files. Computes once: the
// two-line revenue build (research services + CDMO, checked against model revenue); the net-cash path (engine basis: cash +
// investments + bank deposits over 12 months - borrowings incl. leases) and the gross treasury that earns interest; the other-
// income build (FY26 realised yield on average gross treasury + lease-deposit interest; no forex, no tax-refund interest) and the
// interest build (lease interest at FY26's rate + small bank debt + other), both checked against assumptions.json; the one-year-
// forward EV/EBITDA history since 1-Apr-2021 on every weekly close plus the 30-Sep close (EV = price x shares then outstanding -
// net cash last published at the March year-end; forward EBITDA = the next full year's: actual FY23-26, our FY27E/FY28E) with the
// trough test on EBITDA; and the one-year-forward P/E history on EPS before exceptional items (cross-check) and on reported EPS.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'SYNGENE', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'SYNGENE.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'SYNGENE', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2021-04-01', FIVE = '2021-09-30';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const cagr = (a, z, y) => (Math.pow(z / a, 1 / y) - 1) * 100;
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pctl = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const b = A.labels.length - 1; // FY26 index
const ai = fy => A.labels.indexOf(fy);
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const SA = SG.annual, SQ = SG.quarterly, Q1 = C.q1fy27, FY26 = C.fy26, TRE = C.treasury;

// 1) Two-line build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines, KEYS = ['research', 'cdmo'];
const LBL = { research: 'Research services (discovery, dedicated centres, clinical)', cdmo: 'CDMO (small and large molecules)' };
const LINES = Object.fromEntries(KEYS.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => KEYS.reduce((s, k) => s + LINES[k][i], 0));
const baseTot = KEYS.reduce((s, k) => s + BL.base[k], 0);
if (Math.abs(baseTot / A.sales[b] - 1) > 0.001) throw new Error(`SYNGENE build base ${baseTot} != FY26 ${A.sales[b]}`);
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`SYNGENE build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });
const mixPct = k => YRS.map((_, i) => LINES[k][i] / buildTot[i] * 100);

// 2) Net cash (engine basis, incl. leases) and the gross treasury that earns interest
const OT = AS.otherTreasury.base, LEASES = TRE.mar26.leases, BANK = TRE.mar26.borrowings, STRAT = TRE.mar26.strategicEquity;
const ND0 = (A.cash[b] || 0) + (A.investments[b] || 0) + OT - (A.borrowings[b] || 0); // Mar-26 net cash incl. leases
const cashPath = [ND0, ...F.treasury];
const GROSS = cashPath.map(x => x + LEASES + BANK - STRAT); // leases and bank debt held flat; strategic stakes earn nothing
const NC_CO = cashPath.map(x => x + LEASES - STRAT); // company definition: excl. leases and strategic stakes

// 3) Other income: FY26 realised yield (deposit/ICD interest + fund gains) on average year-end gross treasury + lease deposits
const OIN = C.otherIncomeNote, G25 = TRE.mar25.gross, G26 = TRE.mar26.gross;
const TY = (OIN.FY26.depositInterest + OIN.FY26.mfGains) / ((G25 + G26) / 2) * 100; // ~4.27%
const MISC = 1.0; // interest on lease/security deposits (FY26 Rs1.1 cr, FY25 Rs3.6 cr); tax-refund interest not repeated
const oiTreas = YRS.map((_, i) => TY / 100 * (GROSS[i] + GROSS[i + 1]) / 2);
const oiBuild = YRS.map((_, i) => oiTreas[i] + MISC);
const oiOk = YRS.every((y, i) => Math.abs(oiBuild[i] - AS.otherIncome[i]) <= 0.15);
const OQ = OIN.quarterly, ttmOiCo = 16 + OQ.Q3FY26 + OQ.Q4FY26 + OQ.Q1FY27; // Q2FY26 ~Rs16 cr (FY26 Rs70.7 cr less Q1, Q3, Q4)
const q2fy26Oi = OIN.FY26.total - OQ.Q1FY26 - OQ.Q3FY26 - OQ.Q4FY26;

// 4) Interest: lease interest at FY26's rate on flat leases + ~10% on the small bank/PCFC debt + other finance costs
const FCN = C.financeCostNote.FY26;
const LR = FCN.leases / ((TRE.mar25.leases + LEASES) / 2) * 100, LEASE_INT = LR / 100 * LEASES, KD = 10, OTHER_FIN = 1.5;
const intBuild = YRS.map(() => LEASE_INT + KD / 100 * BANK + OTHER_FIN);
const intOk = YRS.every((y, i) => Math.abs(intBuild[i] - AS.interest[i]) <= 0.15);

// 5) Histories since 1-Apr-2021 on every weekly close (+ the 30-Sep close)
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pxAll = RAW.charts.price.Price.filter(([d]) => d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const px = pxAll.filter(([d]) => d >= FROM);
const stat = s => { const v = s.map(x => x[1]); return { med: medOf(v), p25: pctl(v, 0.25), p75: pctl(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }; };
const ebBy = {}, shBy = {}, ncBy = {};
A.labels.forEach((l, i) => { const y = 2000 + +l.slice(2, 4); ebBy[y] = A.ebitda[i]; shBy[y] = A.shares[i]; ncBy[y] = (A.cash[i] || 0) + (A.investments[i] || 0) - (A.borrowings[i] || 0); });
ncBy[2026] = ND0; // Mar-26 incl. the Rs275 cr of long deposits (Rs2 cr at Mar-25, so earlier years are unaffected)
F.years.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const lastFy = d => { let y = +d.slice(0, 4); if (d < `${y}-04-30`) y -= 1; return y; }; // Q4 results come out in late April
const evAt = (d, p) => p * shBy[lastFy(d)] - ncBy[lastFy(d)];
const troughEb = fy => { const prev = [ebBy[fy - 1], ebBy[fy - 2], ebBy[fy - 3]].filter(v => v != null); const pk = Math.max(...prev); return !(ebBy[fy] > 0) || ebBy[fy] < 0.5 * pk; };
const sEvAll = px.map(([d, p]) => [d, Math.round(evAt(d, p) / ebBy[fyOf(d)] * 10) / 10, fyOf(d)]);
const troughYearsEv = [...new Set(sEvAll.filter(x => troughEb(x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const sEv = sEvAll.filter(x => !troughEb(x[2])), EVH = stat(sEv), EVH_all = stat(sEvAll);
const byFyStat = s => Object.fromEntries([...new Set(s.map(x => x[2]))].map(fy => [fy, stat(s.filter(x => x[2] === fy))]));
const EV_BYFY = byFyStat(sEvAll);
// P/E: EPS before exceptional items (company pre-exceptional PAT FY25-26; Screener 'Profit excl Excep' FY21-24) and reported EPS
const pnl = RAW.schedules['profit-loss']['Net Profit'], PRE = { 2025: 474.9, 2026: 379.9 };
const epsRep = {}, epsEx = {};
A.labels.forEach((l, i) => { const y = 2000 + +l.slice(2, 4); epsRep[y] = A.eps[i]; const pre = PRE[y] ?? pnl['Profit excl Excep'][`Mar ${y}`]; epsEx[y] = pre / shBy[y]; });
F.years.forEach((y, i) => { const fy = 2000 + +y.slice(2, 4); epsRep[fy] = F.eps[i]; epsEx[fy] = F.eps[i]; });
const troughEps = (by, fy) => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); return !(by[fy] > 0) || by[fy] < 0.5 * Math.max(...prev); };
const peSeries = by => px.map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10, fyOf(d)]);
const sPeExAll = peSeries(epsEx), sPeRepAll = peSeries(epsRep);
const troughYearsPe = [...new Set(sPeExAll.filter(x => troughEps(epsEx, x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const sPe = sPeExAll.filter(x => !troughEps(epsEx, x[2])), HB = stat(sPe);
const sPeRep = sPeRepAll.filter(x => !troughEps(epsRep, x[2])), HB_rep = stat(sPeRep), HB_exAll = stat(sPeExAll.filter(x => x[1] > 0));
const FM = forwardMedian('SYNGENE', M, { from: FROM }); // house function: every 5th week, reported EPS
const epsU = F.eps.slice(), epsFY26ex = epsEx[2026];
const evNowFwd = (mcap - ND0) / F.ebitda[1], evNowFY27 = (mcap - ND0) / F.ebitda[0], fwdNow = price / epsU[1], peFY27 = price / epsU[0], peSep = price / sep(epsU);
const trailEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), trailEv = (mcap - ND0) / trailEbitda;
const trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;
const px52 = pxAll.filter(([d]) => d > '2025-09-30').map(x => x[1]), hi52 = Math.max(...px52), lo52 = Math.min(...px52);

module.exports = { fs, path, ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, FIVE, n0, n1, pc, pc1, half, cagr, medOf, pctl, shortDate, b, ai, YRS, sep, price, SHARES, mcap, SA, SQ, Q1, FY26, TRE,
  BL, KEYS, LBL, LINES, buildTot, mixPct, OT, LEASES, BANK, STRAT, ND0, cashPath, GROSS, NC_CO, OIN, G25, G26, TY, MISC, oiTreas, oiBuild, oiOk, ttmOiCo, q2fy26Oi, FCN, LR, LEASE_INT, KD, OTHER_FIN, intBuild, intOk,
  fyOf, pxAll, px, stat, ebBy, shBy, ncBy, lastFy, evAt, troughEb, sEvAll, sEv, EVH, EVH_all, troughYearsEv, EV_BYFY, byFyStat, epsRep, epsEx, sPeExAll, sPeRepAll, sPe, HB, sPeRep, HB_rep, HB_exAll, troughYearsPe, FM, epsU, epsFY26ex,
  evNowFwd, evNowFY27, fwdNow, peFY27, peSep, trailEbitda, trailEv, trailEps, trailPe, hi52, lo52 };
