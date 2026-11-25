// Caplin Point initiation: core context (part 1 of the shared context; CAPLIPOINT.ctx.js adds valuation and street).
// Loads the research JSONs and the built model and computes, once: the segment build (checked against model revenue), the
// other-income build (6.4% FY26 treasury yield on the whole gross treasury book + grants and miscellaneous income; the
// engine applies the yield to its net cash, which deducts the ₹216.6 cr Caplin Steriles CCPS that Screener files as
// borrowings, so the yield on that gap is carried in otherIncome), the tax-plus-minorities build, EPS (engine EPS = EPS to
// shareholders: patch for history, minorities in the tax line for forecasts) and the CCPS holders' claim on Caplin Steriles.
// As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'CAPLIPOINT', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'CAPLIPOINT.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'CAPLIPOINT', 'screener.json'), 'utf8')); // as fetched; Sep-2026 rows are never read below
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
if (Math.abs(SHARES - FY26.shares) / FY26.shares > 0.002) throw new Error(`CAPLIPOINT implied shares ${SHARES} vs actual ${FY26.shares}: check the patch`);

// 1) Segment build must sum to model revenue
const BL = AS.businessLines, LINES = ['row', 'us'];
const LBL = { row: 'Rest of the World (Latin America + Africa)', us: 'USA (Caplin Steriles)' };
const build = Object.fromEntries(LINES.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => LINES.reduce((s, k) => s + build[k][i], 0));
const baseTot = LINES.reduce((s, k) => s + BL.base[k], 0);
if (Math.abs(baseTot - FY26.revenue) > 0.5) throw new Error(`CAPLIPOINT segment base ${baseTot} != FY26 revenue ${FY26.revenue}`);
const growthFromBuild = YRS.map((_, i) => Math.round(((buildTot[i] / (i ? buildTot[i - 1] : baseTot)) - 1) * 100000) / 1000);
const buildOk = YRS.every((y, i) => Math.abs(buildTot[i] / F.sales[i] - 1) < 0.002);
const mixPct = k => YRS.map((_, i) => build[k][i] / buildTot[i] * 100);

// 2) Other income build (AR FY26 note 27)
const OIN = FY26.otherIncome, TRS = FY26.treasury;
const TREAS_INC26 = OIN.interest + OIN.realisedGain + OIN.fvGain; // ₹85.29 cr
const GROSS26 = TRS.gross, GROSS25 = TRS.prevGross;
const YIELD26 = TREAS_INC26 / ((GROSS25 + GROSS26) / 2) * 100; // 6.4%
const NONTREAS = OIN.grant + OIN.misc; // ₹11.63 cr
const TY = AS.treasuryYield[0];
const nc0 = (A.cash[b] || 0) + (A.investments[b] || 0) + (AS.otherTreasury?.base || 0) - (A.borrowings[b] || 0); // engine net cash Mar-26
const GAP = GROSS26 - nc0; // CCPS ₹216.6 cr + leases/loans ₹4.6 cr (+ rounding in Screener's columns)
const OI_CARRY = Math.round((TY / 100 * GAP + NONTREAS) * 10) / 10;
const openCash = YRS.map((_, i) => (i ? F.treasury[i - 1] : nc0));
const oiBuild = YRS.map((_, i) => TY / 100 * (openCash[i] + GAP) + NONTREAS);
const oiOk = YRS.every((y, i) => Math.abs(AS.otherIncome[i] - OI_CARRY) <= 0.05 && Math.abs(oiBuild[i] - F.otherIncome[i]) <= 1.5);
const OIQ = RAW.schedules.quarters['Other Income']['Other income normal'];
const ttmOiRep = ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026'].reduce((s, p) => s + (OIQ[p] || 0), 0);
const oi26exFx = OIN.total - OIN.fx; // ₹96.9 cr

// 3) Tax + minorities (engine has no minority line): engine rate = (tax on PBT + minorities) / PBT
const TB = AS.taxBuild;
const taxRateBuild = YRS.map((_, i) => Math.round((TB.taxOnPbt[i] / 100 * F.pbt[i] + TB.minorities[i]) / F.pbt[i] * 10000) / 100);
const taxOk = YRS.every((_, i) => Math.abs(AS.taxRate[i] - taxRateBuild[i]) < 0.011);
const minoritiesHist = { FY24: 4, FY25: 4.78, FY26: FY26.nci, Q1FY27: Q1.nci };

// 4) EPS to shareholders. History: Screener reported EPS (company reports no exceptional items); Screener's "EPS before
//    exceptional items" removes ~₹15 cr of FY26 other income (mostly realised investment gains) and is a sensitivity only.
const epsU = F.pat.map(p => p / SHARES); // the model JSON rounds EPS to ₹1 above ₹100
const epsSep = V.blend.methods.find(m => m.key === 'pe').metric; // engine's exact Sep-28E EPS (½ FY28E + ½ FY29E)
const pl = RAW.tables['profit-loss'], ns = RAW.schedules['profit-loss']['Net Profit'];
const epsRep = {}, epsExc = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4), e = pl.rows['EPS in Rs'][i]; epsRep[y] = e; epsExc[y] = (ns['Profit for EPS'][p] - (ns['Exceptional items AT'][p] || 0)) / (ns['Profit for EPS'][p] / e); } });
YRS.forEach((y, i) => { const fy = 2000 + +y.slice(2, 4); epsRep[fy] = epsU[i]; epsExc[fy] = epsU[i]; });

// 5) The CCPS holders' claim: at least 25.29% of Caplin Steriles on conversion (AR FY19 note 13); no profit attributed in the
//    accounts. CSL PAT FY26 ₹54.97 cr = 12.1% of USA segment revenue; we assume 15% for FY27-29E (Q1FY27 segment PBT margin
//    24.8% vs 12.4% in FY26; CSL EBITDA margin 30% in FY26, 33% in Q4FY26).
const CC = C.ccps, CSL_PAT_MARGIN = 15;
const cslPat = YRS.map((_, i) => build.us[i] * CSL_PAT_MARGIN / 100);
const ccpsEps = cslPat.map(p => p * CC.minStakePct / 100 / SHARES);
const ccpsEpsSep = sep(ccpsEps), ccpsEps26 = FY26.lines.cslPat * CC.minStakePct / 100 / SHARES;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, n0, n1, n2, pc, pc1, half, cagr, shortDate, medOf, pctl, statOf, SA, SQ, QL, Q1, FY26, b, ix, YRS, sep, price, SHARES, mcap,
  BL, LINES, LBL, build, buildTot, baseTot, growthFromBuild, buildOk, mixPct, OIN, TRS, TREAS_INC26, GROSS26, GROSS25, YIELD26, NONTREAS, TY, nc0, GAP, OI_CARRY, openCash, oiBuild, oiOk, ttmOiRep, oi26exFx,
  TB, taxRateBuild, taxOk, minoritiesHist, epsU, epsSep, epsRep, epsExc, CC, CSL_PAT_MARGIN, cslPat, ccpsEps, ccpsEpsSep, ccpsEps26 };
