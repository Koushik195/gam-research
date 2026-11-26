// Poly Medicure initiation: shared context, part 1 (loaded by POLYMED.ctx.js). Loads the research JSONs and the built model;
// computes the revenue build (checked against model revenue), the tax-plus-minorities and debt/interest builds, the gross
// treasury path and the other-income build (treasury + associate + recurring + forex, all sourced), EPS bases (attributable
// profit before the FY26 exceptional items), the share count at each date (QIP on 22-Aug-2024) and the one-year-forward P/E
// history since Apr-2021 on every weekly close plus the 30-Sep close (market value at that date ÷ next full year's profit,
// so per-share figures always use the share count at that date). As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'POLYMED', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'POLYMED.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'POLYMED', 'screener.json'), 'utf8')); // unpatched
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2021-04-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pctl = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, OIN = C.otherIncomeNote, SHR = C.shares;
const b = A.labels.length - 1; // FY26 index
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;

// 1) Revenue build: India + international organic + acquisitions + export incentives = model revenue
const RB = AS.revenueBuild, india = [], intl = [];
YRS.forEach((_, i) => { india.push((i ? india[i - 1] : RB.india) * (1 + RB.indiaGrowth[i] / 100)); intl.push((i ? intl[i - 1] : RB.intlOrganic) * (1 + RB.intlGrowth[i] / 100)); });
const buildRev = YRS.map((_, i) => india[i] + intl[i] + RB.acqLevel[i] + RB.otherOpLevel[i]);
const base26 = RB.india + RB.intlOrganic + RB.acquisitions + RB.otherOp;
const growthBuild = buildRev.map((v, i) => Math.round(((v / (i ? buildRev[i - 1] : A.sales[b])) - 1) * 10000) / 100);
const revOk = YRS.every((_, i) => Math.abs(buildRev[i] / F.sales[i] - 1) < 0.002);

// 2) Tax and minorities: engine rate = (tax on PBT + minorities) / PBT
const TB = AS.taxBuild, MIN = TB.minorities;
const taxRateBuild = YRS.map((_, i) => Math.round((TB.taxOnPbt[i] / 100 * F.pbt[i] + MIN[i]) / F.pbt[i] * 10000) / 100);
const taxOk = YRS.every((_, i) => Math.abs(taxRateBuild[i] - AS.taxRate[i]) < 0.02);

// 3) Debt and interest
const DB = AS.debtBuild, DEBT = [DB.mar26, ...DB.closing];
const intBuild = YRS.map((_, i) => Math.round(DB.rate / 100 * (DEBT[i] + DEBT[i + 1]) / 2 * 10) / 10);
const intOk = YRS.every((_, i) => Math.abs(intBuild[i] - AS.interest[i]) <= 0.1);

// 4) Gross treasury and other income. Engine treasury = cash + investments − borrowings (incl. leases), so gross treasury =
//    engine net cash + debt on our path. Parts: treasury yield 6.33% (FY26 mutual-fund return, AR FY26 key ratios) on average
//    gross treasury; Egyptian associate's share of profit (FY25 ₹5.2 cr, FY26 ₹5.7 cr; Screener carries it in other income),
//    +10% a year; recurring grants and miscellaneous income ₹10 cr (FY24-26 average of grants + misc); forex gains at the
//    FY24-26 average ratio to international organic revenue, the least certain part.
const nc0 = A.cash[b] + A.investments[b] - A.borrowings[b];
const grossCash = [A.cash[b] + A.investments[b], ...YRS.map((_, i) => F.treasury[i] + DEBT[i + 1])];
const TY = OIN.mfReturnPct.FY26, REC = 10, ASSOC = [6.3, 6.9, 7.6];
const sa = fy => SA.find(a => a.fy === fy);
const fxBase = { FY24: sa('FY24').europe + sa('FY24').row, FY25: sa('FY25').intlRev, FY26: RB.intlOrganic }; // FY24 incl. ~₹12 cr export incentives
const fx = Object.fromEntries(Object.keys(fxBase).map(y => [y, OIN[y].forex / fxBase[y]]));
const FXR = (fx.FY24 + fx.FY25 + fx.FY26) / 3;
const oiTreas = YRS.map((_, i) => TY / 100 * (grossCash[i] + grossCash[i + 1]) / 2), oiFx = YRS.map((_, i) => FXR * intl[i]);
const oiBuild = YRS.map((_, i) => Math.round(oiTreas[i] + ASSOC[i] + REC + oiFx[i]));
const oiOk = YRS.every((_, i) => Math.abs(oiBuild[i] - AS.otherIncome[i]) <= 1);
const treasPart = y => { const o = OIN[y]; return o.fdInterest + o.bondInterest + o.amortisedCostInterest + (o.dividend || 0) + o.mfRealised + o.mfUnrealised; };
const T26 = treasPart('FY26'), T25 = treasPart('FY25'), REC26 = OIN.FY26.grants + OIN.FY26.misc, avgT26 = (1226.9 + FY26.cash) / 2, yld26 = T26 / avgT26 * 100;
const OQ = RAW.schedules.quarters['Other Income']['Other income normal'];
const ttmOi = ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026'].reduce((s, p) => s + (OQ[p] || 0), 0);
const netCash = [nc0, ...F.treasury];

// 5) EPS bases and the share count at each date. History = Screener "Profit for EPS" (attributable); base = before the FY26
//    labour-code and acquisition costs (₹12.35 cr after tax). Forecasts carry no exceptional items.
const pl = RAW.tables['profit-loss'], PFE = RAW.schedules['profit-loss']['Net Profit']['Profit for EPS'];
const patRep = {}, epsScr = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { patRep[+p.slice(-4)] = PFE[p]; epsScr[+p.slice(-4)] = pl.rows['EPS in Rs'][i]; } });
YRS.forEach((y, i) => (patRep[2000 + +y.slice(2, 4)] = F.pat[i]));
const patBase = { ...patRep, 2026: patRep[2026] + C.exceptional.FY26.afterTax };
const shYE = { 2021: 9.596, 2022: 9.62, 2023: 9.58, 2024: SHR.mar24, 2025: SHR.mar25, 2026: SHR.mar26, 2027: SHARES, 2028: SHARES, 2029: SHARES };
const shAt = d => (d < SHR.qipDate ? SHR.mar24 : d < '2025-04-01' ? SHR.mar25 : SHR.mar26);
const epsOf = by => Object.fromEntries(Object.entries(by).map(([y, v]) => [y, v / (shYE[y] || SHARES)]));
const epsBase = epsOf(patBase), epsRepAll = epsOf(patRep), epsU = F.eps.slice(), epsSep = sep(epsU);
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const troughOn = by => fy => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); const pk = Math.max(...prev); return !(by[fy] > 0) || by[fy] < 0.5 * pk; };
const troughList = by => [2023, 2024, 2025, 2026, 2027, 2028].filter(troughOn(by)).map(y => `FY${String(y).slice(2)}`);
const TROUGH_BASE = troughList(epsBase), TROUGH_REP = troughList(epsRepAll);
const troughRow = (by, fys) => fys.map(fy => { const pk = Math.max(by[fy - 1], by[fy - 2], by[fy - 3]); return { fy, eps: by[fy], peak: pk, half: 0.5 * pk }; });

// 6) Forward P/E on every weekly close (+ the 30-Sep close): market value at the date ÷ next full fiscal year's profit
const px = RAW.charts.price.Price.filter(([d]) => d >= FROM && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const seriesOn = (by, from, to = ASOF, perShareYE = false) => px.filter(([d]) => d >= from && d <= to).map(([d, p]) => [d, Math.round((perShareYE ? p / (by[fyOf(d)] / (shYE[fyOf(d)] || SHARES)) : p * shAt(d) / by[fyOf(d)]) * 10) / 10]);
const stat = s => { const v = s.map(x => x[1]); return { med: medOf(v), p25: pctl(v, 0.25), p75: pctl(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }; };
const sBase = seriesOn(patBase, FROM), HB = stat(sBase); // BASE
const HR = stat(seriesOn(patRep, FROM)); // reported profit (FY26 after the one-offs)
const HY = stat(seriesOn(patBase, FROM, ASOF, true)); // EPS on year-end shares (Screener-style; ignores the QIP date)
const H22 = stat(seriesOn(patBase, '2022-04-01')); // sensitivity: window from Apr-2022
const H23 = stat(seriesOn(patBase, '2023-10-01')); // sensitivity: last three years
const yearWin = [2023, 2024, 2025, 2026, 2027, 2028].map(fy => { const s = sBase.filter(([d]) => fyOf(d) === fy); return { fy: `FY${String(fy).slice(2)}${fy >= 2027 ? 'E' : ''}`, from: s[0][0], ...stat(s) }; });
const FM = forwardMedian('POLYMED', M); // house function: Screener EPS, every 5th week, trough years left out
const fwdNow = price / epsU[1], fwdNow27 = price / epsU[0], fwdNowSep = price / epsSep;
const trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, n0, n1, n2, pc, pc1, half, shortDate, medOf, pctl, SA, SQ, QL, Q1, FY26, OIN, SHR, b, YRS, sep, price, SHARES, mcap,
  RB, india, intl, buildRev, base26, growthBuild, revOk, TB, MIN, taxRateBuild, taxOk, DB, DEBT, intBuild, intOk, nc0, grossCash, TY, REC, ASSOC, fx, fxBase, FXR, oiTreas, oiFx, oiBuild, oiOk, T26, T25, REC26, avgT26, yld26, ttmOi, netCash,
  patRep, patBase, epsScr, shYE, shAt, epsBase, epsRepAll, epsU, epsSep, fyOf, TROUGH_BASE, TROUGH_REP, troughRow, px, seriesOn, stat, sBase, HB, HR, HY, H22, H23, yearWin, FM, fwdNow, fwdNow27, fwdNowSep, trailEps, trailPe };
