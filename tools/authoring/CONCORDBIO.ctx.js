// Concord Biotech initiation: shared context, part 1 (CONCORDBIO.ctx2.js adds the valuation layer and re-exports everything).
// Loads the research JSONs, the built model and the PATCHED Screener data (CONCORDBIO.patch.js: attributable profit, 1:1 bonus
// of Nov-2026 undone so prices and EPS are on the 10.46 cr shares that traded on 30-Sep-2026) and computes, once: the two-line
// revenue build (APIs, formulations; checked against model revenue), the cash path, the other-income build (6.0% on average
// yield-bearing cash + GSBTM incentives + write-backs + the Japan JV share; checked against assumptions.json), and the
// one-year-forward P/E history since 1-Jan-2024 (Concord listed 18-Aug-2023; post-listing months skipped) on every weekly close
// plus the 30-Sep close. valuation-blend.js reads the unpatched (bonus-adjusted) screener.json, so we do not use its
// forwardSeries/forwardMedian for Concord: they would divide post-bonus prices by our pre-bonus forecast EPS.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'CONCORDBIO', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'CONCORDBIO.json'), 'utf8'));
const { patchRaw, SHARES_PRE, BONUS } = require('./CONCORDBIO.patch');
const RAW = patchRaw(JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'CONCORDBIO', 'screener.json'), 'utf8')));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2023-08-18', FROM = '2024-01-01';
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
const SRC = 'Concord Biotech annual report, results presentations and calls; ICRA; Screener.in (consolidated); GAM Research';
const b = A.labels.length - 1, ai = fy => A.labels.indexOf(fy); // FY26 index
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES_PRE;
const SA = SG.annual, SQ = SG.quarterly, Q1 = C.q1fy27, FY26 = C.fy26, FY25 = C.fy25, TRE = C.treasury;
if (Math.abs(SHARES / SHARES_PRE - 1) > 0.002) throw new Error(`CONCORDBIO shares ${SHARES} vs ${SHARES_PRE}: check the patch`);

// 1) Two-line build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines, KEYS = ['api', 'formulations'];
const LBL = { api: 'APIs (incl. CDMO)', formulations: 'Formulations (oral, soft gel, injectables)' };
const LINES = Object.fromEntries(KEYS.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => KEYS.reduce((s, k) => s + LINES[k][i], 0));
const baseTot = KEYS.reduce((s, k) => s + BL.base[k], 0);
if (Math.abs(baseTot / A.sales[b] - 1) > 0.001) throw new Error(`CONCORDBIO build base ${baseTot} != FY26 ${A.sales[b]}`);
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`CONCORDBIO build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });
const mixPct = k => YRS.map((_, i) => LINES[k][i] / buildTot[i] * 100);
const q1Share = Q1.revenue / F.sales[0] * 100, q2to4Need = F.sales[0] - Q1.revenue, q2to4Prev = FY26.revenue - 204.0;
const apiQ2to4Need = LINES.api[0] - Q1.api, apiQ2to4Prev = FY26.api - 153.8;

// 2) Cash: engine net cash (Screener cash + investments - lease liabilities); yield-bearing part excludes the Palvella
//    shares (Rs84.1 cr fair value, OCI) and the Japan JV (Rs3.7 cr), both held flat, and adds back the Rs2.3 cr of leases.
const ND0 = (A.cash[b] || 0) + (A.investments[b] || 0) - (A.borrowings[b] || 0);
const cashPath = [ND0, ...F.treasury];
const NONYIELD = TRE.mar26.palvella + TRE.mar26.jv, LEASES = A.borrowings[b] || 0;
const ybPath = cashPath.map(c => c - NONYIELD + LEASES);
const NC_JUN26 = Q1.cash + NONYIELD - LEASES; // company cash Rs442 cr + Palvella + JV - leases (engine basis)

// 3) Other income build: 6.0% on average yield-bearing cash + GSBTM incentives Rs7.9 cr + write-backs/misc Rs4.0 cr
//    + share of the Japan JV Rs2.0 cr; no forex gains, no Palvella gains (OCI)
const TY = 6.0, SUBSIDY = 7.9, MISC = 4.0, JV = 2.0;
const oiTreas = YRS.map((_, i) => TY / 100 * (ybPath[i] + ybPath[i + 1]) / 2);
const oiBuild = YRS.map((_, i) => Math.round((oiTreas[i] + SUBSIDY + MISC + JV) * 10) / 10);
const oiOk = YRS.every((y, i) => Math.abs(oiBuild[i] - AS.otherIncome[i]) <= 0.5);
const OIN = C.otherIncomeNote, ttmOi = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);
const tr26 = OIN.FY26.interestBank + OIN.FY26.interestInvest + OIN.FY26.gainOnSale + OIN.FY26.mfFairValue;
const yb25 = TRE.mar25.currentInvestments + TRE.mar25.cashBank, yb26 = TRE.mar26.yieldBearing;
const yld26 = tr26 / ((yb25 + yb26) / 2) * 100;
const oi26exFx = OIN.FY26.total - OIN.FY26.forex;

// 4) Forward P/E since 1-Jan-2024 on every weekly close (+ the 30-Sep close): price / next full fiscal year's EPS
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pl = RAW.tables['profit-loss'], ns = RAW.schedules['profit-loss']['Net Profit'];
const epsRep = {}, PFE = {}, PEX = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4); epsRep[y] = pl.rows['EPS in Rs'][i]; PFE[y] = ns['Profit for EPS']?.[p]; PEX[y] = ns['Profit excl Excep']?.[p]; } });
const epsU = F.pat.map(p => p / SHARES); // engine EPS unrounded
const byRep = { 2024: epsRep[2024], 2025: epsRep[2025], 2026: epsRep[2026], 2027: epsU[0], 2028: epsU[1], 2029: epsU[2] };
const exPs = y => (PFE[y] - PEX[y]) / SHARES_PRE; // Screener's 'exceptional' (mostly treasury and forex gains) per share
const byScrEx = { ...byRep, 2025: epsRep[2025] - exPs(2025), 2026: epsRep[2026] - exPs(2026) };
const pxAll = RAW.charts.price.Price.filter(([d]) => d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const seriesOn = (pts, by) => pts.map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10]);
const stat = s => { const v = s.map(x => x[1]); return { med: medOf(v), p25: pctl(v, 0.25), p75: pctl(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }; };
const sAll = seriesOn(pxAll, byRep), sPe = sAll.filter(([d]) => d >= FROM), HB = stat(sPe);
const winFrom = from => stat(sAll.filter(([d]) => d >= from));
const HLIST = winFrom(LISTED), HNOV = winFrom('2023-11-01'), HMAR = winFrom('2024-03-01'), HAPR25 = winFrom('2025-04-01');
const HEX26 = stat(sPe.filter(([d]) => fyOf(d) !== 2026)), HSCR = stat(seriesOn(pxAll.filter(([d]) => d >= FROM), byScrEx));
const H5W = stat(sPe.filter((_, i) => i % 5 === 0)); // house-style sampling (every 5th week) on the patched data
const HFY = Object.fromEntries([2025, 2026, 2027, 2028].map(fy => [fy, stat(sPe.filter(([d]) => fyOf(d) === fy))]));
const sIpo = sAll.filter(([d]) => d < FROM), HIPO = stat(sIpo);
const troughChk = Object.fromEntries([2025, 2026, 2027, 2028].map(fy => { const prev = [byRep[fy - 1], byRep[fy - 2], byRep[fy - 3]].filter(v => v != null); const line = 0.5 * Math.max(...prev); return [fy, { eps: byRep[fy], line, trough: !(byRep[fy] > line) }]; }));
const pxOn = d => pxAll.filter(([x]) => x <= d).at(-1)[1];
const px26 = pxAll.filter(([d]) => d >= FROM && fyOf(d) === 2026).map(x => x[1]), PX26 = { min: Math.min(...px26), max: Math.max(...px26) };
const fwdNow = price / epsU[1], peFY27 = price / epsU[0], peSep = price / sep(epsU);
const trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), trailEv = (mcap - NC_JUN26) / ttmEbitda;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, LISTED, FROM, n0, n1, pc, pc1, half, cagr, medOf, pctl, shortDate, SRC, b, ai, YRS, sep, price, SHARES, SHARES_PRE, BONUS, mcap, SA, SQ, Q1, FY26, FY25, TRE,
  BL, KEYS, LBL, LINES, buildTot, mixPct, q1Share, q2to4Need, q2to4Prev, apiQ2to4Need, apiQ2to4Prev, ND0, cashPath, NONYIELD, LEASES, ybPath, NC_JUN26, TY, SUBSIDY, MISC, JV, oiTreas, oiBuild, oiOk, OIN, ttmOi, tr26, yb25, yb26, yld26, oi26exFx,
  fyOf, epsRep, PFE, PEX, epsU, byRep, byScrEx, exPs, pxAll, sAll, sPe, stat, HB, winFrom, HLIST, HNOV, HMAR, HAPR25, HEX26, HSCR, H5W, HFY, sIpo, HIPO, troughChk, pxOn, PX26, fwdNow, peFY27, peSep, trailEps, trailPe, ttmEbitda, trailEv };
