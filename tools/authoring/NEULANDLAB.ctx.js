// Neuland Laboratories initiation: shared context, part 1 (NEULANDLAB.ctx2.js adds the valuation layer and re-exports everything).
// Loads the research JSONs and the built model and computes, once: the four-line revenue build (CMS, Prime, Specialty, Others;
// checked against model revenue), the borrowing and gross-cash paths, the other-income build (5.0% on average gross cash +
// Rs1.5 cr write-backs; checked against assumptions.json), the interest build, and the one-year-forward P/E history since
// 1-Apr-2021 on every weekly close plus the 30-Sep close (forward EPS = FY25 before the Rs76.4 cr property gain, other years
// reported, our FY27E/FY28E). No patch: Neuland has no minorities, so Screener's Net Profit is attributable profit.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'NEULANDLAB', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'NEULANDLAB.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'NEULANDLAB', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2021-04-01', BREAK = '2022-04-01', BREAK2 = '2023-04-01', FIVE = '2021-09-30';
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
const SRC = 'Neuland Laboratories annual report, results presentations and calls; Screener.in (consolidated); GAM Research';
const b = A.labels.length - 1; // FY26 index
const ai = fy => A.labels.indexOf(fy);
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const SA = SG.annual, SQ = SG.quarterly, Q1 = C.q1fy27, FY26 = C.fy26, FY25 = C.fy25;

// 1) Four-line build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines, KEYS = ['cms', 'prime', 'specialty', 'others'];
const LBL = { cms: 'Custom Manufacturing Solutions (CMS, CDMO)', prime: 'Prime APIs (generic, large-volume)', specialty: 'Specialty APIs (generic, complex)', others: 'Others (residual)' };
const LINES = Object.fromEntries(KEYS.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => KEYS.reduce((s, k) => s + LINES[k][i], 0));
const baseTot = KEYS.reduce((s, k) => s + BL.base[k], 0);
if (Math.abs(baseTot / A.sales[b] - 1) > 0.001) throw new Error(`NEULANDLAB build base ${baseTot} != FY26 ${A.sales[b]}`);
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`NEULANDLAB build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });
const gdsTot = YRS.map((_, i) => LINES.prime[i] + LINES.specialty[i]);
const mixPct = k => YRS.map((_, i) => LINES[k][i] / buildTot[i] * 100);
const cmsShare26 = BL.base.cms / A.sales[b] * 100;

// 2) Cash: engine net cash (Screener cash + investments − borrowings incl. leases), our borrowing path, gross cash
const ND0 = (A.cash[b] || 0) + (A.investments[b] || 0) - (A.borrowings[b] || 0); // Mar-26 engine net cash (after Rs105 cr of leases)
const cashPath = [ND0, ...F.treasury];
const TRE = C.treasury, CO_NC0 = FY26.netCashCompany;
const DEBT = [TRE.mar26.borrowings, 300, 350, 350], LEASE = [TRE.mar26.leases, 100, 95, 90]; // CRISIL: capex partly debt-funded (Rs522 cr proposed term loans; Rs130 cr R&D-centre loan tied up)
const borrPath = DEBT.map((d, i) => d + LEASE[i]);
const grossPath = cashPath.map((nc, i) => nc + borrPath[i]);

// 3) Other income build: 5.0% on average gross cash and deposits + Rs1.5 cr write-backs; no forex, no fair-value gains
const TY = 5.0, MISC = 1.5;
const oiTreas = YRS.map((_, i) => TY / 100 * (grossPath[i] + grossPath[i + 1]) / 2);
const oiBuild = YRS.map((_, i) => Math.round((oiTreas[i] + MISC) * 10) / 10);
const oiOk = YRS.every((y, i) => Math.abs(oiBuild[i] - AS.otherIncome[i]) <= 0.5);
const OIN = C.otherIncomeNote, OI26 = OIN.FY26.total, ttmOi = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);
const grossCash25 = TRE.mar25.cash + TRE.mar25.otherBank + TRE.mar25.mutualFunds, grossCash26 = TRE.mar26.cash + TRE.mar26.otherBank;
const yld26 = (OIN.FY26.interestFd + OIN.FY26.interestDeposits + OIN.FY26.mfGain) / ((grossCash25 + grossCash26) / 2) * 100;

// 4) Interest build: 7.5% on average bank debt + 7.5% on average lease liabilities + ~Rs5 cr other borrowing costs (net of capitalisation)
const KD = 7.5, KL = 7.5, OTHER_FIN = 5.0;
const intBuild = YRS.map((_, i) => KD / 100 * (DEBT[i] + DEBT[i + 1]) / 2 + KL / 100 * (LEASE[i] + LEASE[i + 1]) / 2 + OTHER_FIN);
const intOk = YRS.every((y, i) => Math.abs(intBuild[i] - AS.interest[i]) <= 0.15);

// 5) Forward P/E since 1-Apr-2021 on every weekly close (+ the 30-Sep close): price ÷ next full fiscal year's EPS
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pl = RAW.tables['profit-loss'], ns = RAW.schedules['profit-loss']['Net Profit'];
const epsRep = {}, PFE = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4); epsRep[y] = pl.rows['EPS in Rs'][i]; PFE[y] = ns['Profit for EPS'][p]; } });
const EXC25 = FY25.exceptionalGain, EXC25AT = FY25.exceptionalAfterTaxEst; // Rs76.4 cr pre-tax; ~Rs69.2 cr after tax (AR tax reconciliation)
const eps25ex = epsRep[2025] * (FY25.pat - EXC25AT) / FY25.pat;
const eps25scr = epsRep[2025] * ns['Profit excl Excep']['Mar 2025'] / PFE[2025]; // Screener's split (Rs86 cr after tax)
const eps25nuv = epsRep[2025] * (FY25.pat - EXC25) / FY25.pat;                 // Nuvama's adjusted basis (Rs76.4 cr removed)
const epsU = F.pat.map(p => p / SHARES); // engine EPS unrounded
const byEx = { 2022: epsRep[2022], 2023: epsRep[2023], 2024: epsRep[2024], 2025: eps25ex, 2026: epsRep[2026], 2027: epsU[0], 2028: epsU[1], 2029: epsU[2] };
const byRep = { ...byEx, 2025: epsRep[2025] }, byScr = { ...byEx, 2025: eps25scr };
const pxAll = RAW.charts.price.Price.filter(([d]) => d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const px = pxAll.filter(([d]) => d >= FROM);
const seriesOn = (pts, by) => pts.map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10]);
const stat = s => { const v = s.map(x => x[1]); return { med: medOf(v), p25: pctl(v, 0.25), p75: pctl(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }; };
const sPe = seriesOn(px, byEx), HB = stat(sPe);                 // base: FY25 EPS before the property gain
const HREP = stat(seriesOn(px, byRep)), HSCR = stat(seriesOn(px, byScr));
const HBRK = stat(sPe.filter(([d]) => d >= BREAK)), HBRK2 = stat(sPe.filter(([d]) => d >= BREAK2));
const HFY = Object.fromEntries([2023, 2024, 2025, 2026, 2027, 2028].map(fy => [fy, stat(sPe.filter(([d]) => fyOf(d) === fy))]));
const troughChk = { 2023: { eps: epsRep[2023], line: 0.5 * Math.max(epsRep[2020], epsRep[2021], epsRep[2022]) }, 2025: { eps: eps25ex, line: 0.5 * Math.max(epsRep[2022], epsRep[2023], epsRep[2024]) } };
const fwdNow = price / epsU[1], peFY27 = price / epsU[0], peSep = price / sep(epsU);
const trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, BREAK, BREAK2, FIVE, n0, n1, pc, pc1, rup, half, cagr, medOf, pctl, shortDate, SRC, b, ai, YRS, sep, price, SHARES, mcap, SA, SQ, Q1, FY26, FY25,
  BL, KEYS, LBL, LINES, buildTot, gdsTot, mixPct, cmsShare26, ND0, cashPath, TRE, CO_NC0, DEBT, LEASE, borrPath, grossPath, TY, MISC, oiTreas, oiBuild, oiOk, OIN, OI26, ttmOi, yld26, KD, KL, OTHER_FIN, intBuild, intOk,
  fyOf, epsRep, PFE, EXC25, EXC25AT, eps25ex, eps25scr, eps25nuv, epsU, byEx, byRep, px, pxAll, stat, sPe, HB, HREP, HSCR, HBRK, HBRK2, HFY, troughChk, fwdNow, peFY27, peSep, trailEps, trailPe };
