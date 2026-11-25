// Natco Pharma initiation: shared context (part 1). Loads the research JSONs and the built model, checks the business-line
// revenue build, the other-income build (treasury + Adcock associate share) and the tax build against the engine, and
// derives the P/E multiple once (house rule, PLAYBOOK §4 and §7c): Natco's own one-year-forward P/E median since Apr-2021
// on reported EPS (house forwardMedian; the gRevlimid windfall is not a one-off, so no adjustment; trough years excluded
// as the rule is written) x the pharma sector factor for names outside the nine-peer set (+8.2%), nearest half-turn.
// Part 2 (NATCOPHARM.ctx2.js) adds the EV/EBITDA history, the street, the rating and the post-rights view.
// As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'NATCOPHARM', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'NATCOPHARM.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'NATCOPHARM', 'screener.json'), 'utf8'));
const { SHARES } = require('./NATCOPHARM.patch');
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const cagr = (a, b, y) => (Math.pow(b / a, 1 / y) - 1) * 100;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const pctl = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const statOf = arr => ({ med: pctl(arr, 0.5), p25: pctl(arr, 0.25), p75: pctl(arr, 0.75), min: Math.min(...arr), max: Math.max(...arr), n: arr.length });
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26;
const b = A.labels.length - 1, ix = l => A.labels.indexOf(l), YRS = F.years;
const price = M.price.last, mcap = price * F.shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);

// 1) Business-line build must equal model revenue (single-segment engine, PLAYBOOK §7)
const BL = AS.businessLines, LINES = ['us', 'brazil', 'canada', 'row', 'domestic', 'api', 'chs', 'otherOp'];
const baseSum = LINES.reduce((s, k) => s + BL.base[k], 0);
if (Math.abs(baseSum - BL.base.total) > 0.5 || Math.abs(BL.base.total - A.sales[b]) > 1) throw new Error(`NATCOPHARM base build ${baseSum} vs ${BL.base.total} vs Screener ${A.sales[b]}`);
const bld = YRS.map((y, i) => { const r = { y }; LINES.forEach(k => (r[k] = BL[k][i])); r.exports = r.us + r.brazil + r.canada + r.row; r.rev = LINES.reduce((s, k) => s + r[k], 0); r.model = F.sales[i]; r.gapPct = (r.model / r.rev - 1) * 100; return r; });
bld.forEach(r => { if (Math.abs(r.gapPct) > 0.5) throw new Error(`NATCOPHARM build ${r.y}: model ${n0(r.model)} vs build ${n0(r.rev)}`); });

// 2) Other income = 6.5% x engine opening treasury + otherIncome; otherIncome = Adcock share + forex + misc + carry
//    - 6.5% x (non-yielding Adcock stake + refund-liability offset)
const OB = AS.otherIncomeBuild, Y = OB.yieldPct / 100;
const tre0 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - A.borrowings[b];
const openT = YRS.map((_, i) => (i ? F.treasury[i - 1] : tre0));
const oiRows = YRS.map((y, i) => { const nonY = OB.nonYieldingOpen[i] + OB.refundOffset[i], yielding = openT[i] - nonY, onNet = Y * yielding, treas = onNet + OB.carry[i];
  return { y, open: openT[i], nonY, adcockBook: OB.nonYieldingOpen[i], refund: OB.refundOffset[i], yielding, onNet, carry: OB.carry[i], treas, forex: OB.forex[i], misc: OB.misc[i], assoc: OB.assoc[i], exAssoc: treas + OB.forex[i] + OB.misc[i], tot: treas + OB.forex[i] + OB.misc[i] + OB.assoc[i], model: F.otherIncome[i] }; });
oiRows.forEach((r, i) => { if (Math.abs(r.tot - r.model) > 2) throw new Error(`NATCOPHARM other income ${r.y}: build ${n0(r.tot)} vs model ${n0(r.model)}`);
  if (Math.abs(OB.carry[i] - Y * OB.grossBorrowings) > 0.5) throw new Error('NATCOPHARM carry != 6.5% x gross borrowings');
  if (i && Math.abs(OB.nonYieldingOpen[i] - (OB.nonYieldingOpen[i - 1] + 0.5 * OB.assoc[i - 1])) > 0.5) throw new Error('NATCOPHARM Adcock book roll-forward'); });
if (Math.abs(OB.nonYieldingOpen[0] - (FY26.balance.adcockCarrying + C.adcock.consideration13)) > 0.5) throw new Error('NATCOPHARM opening Adcock book');
if (Math.abs(tre0 - FY26.balance.adcockCarrying - 2391.9) > 5) throw new Error(`NATCOPHARM opening net cash ${n0(tre0 - FY26.balance.adcockCarrying)}`);
const owcRel = -F.owcChange[0];
if (Math.abs(OB.refundOffset[1] - Math.round(owcRel)) > 2) throw new Error(`NATCOPHARM refund offset ${OB.refundOffset[1]} vs engine FY27 working-capital release ${n0(owcRel)}`);

// 3) Tax line = tax on PBT before the associate share (engine has no associate line)
const TB = AS.taxBuild, taxRows = YRS.map((y, i) => { const pbt = F.pbt[i], ex = pbt - OB.assoc[i], tax = ex * TB.taxOnPbtExAssoc[i] / 100;
  return { y, pbt, ex, tax, pat: pbt - tax, patExAssoc: ex - tax, assoc: OB.assoc[i], rate: tax / pbt * 100, modelPat: F.pat[i] }; });
taxRows.forEach(r => { if (Math.abs(r.pat / r.modelPat - 1) > 0.003) throw new Error(`NATCOPHARM tax build ${r.y}: PAT ${n0(r.pat)} vs model ${n0(r.modelPat)}`); });
const assocPct = taxRows.map(r => r.assoc / r.pat * 100);

// 4) Shares: engine count vs 179,109,870 in issue
if (Math.abs(F.shares / SHARES - 1) > 0.001) throw new Error(`NATCOPHARM engine shares ${F.shares} vs ${SHARES}`);

// 5) Forward P/E since Apr-2021 on reported EPS (house forwardMedian, every 5th weekly close), trough years excluded as written
const FM = forwardMedian('NATCOPHARM', M);
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const rep = {}; S.tables['profit-loss'].periods.forEach((p, i) => { if (/Mar/.test(p)) rep[+p.slice(-4)] = S.tables['profit-loss'].rows['EPS in Rs'][i]; });
YRS.forEach((y, i) => (rep[2000 + +y.slice(2, 4)] = F.eps[i]));
const thr = fy => 0.5 * Math.max(rep[fy - 1], rep[fy - 2], rep[fy - 3]);
const ALL = forwardSeries('NATCOPHARM', M, 'eps').filter(([d]) => d >= '2021-04-01').map(([d, x]) => [d, x, fyOf(d)]);
const HR = statOf(FM.series.map(x => x[1])), HALL = statOf(ALL.map(x => x[1]));
if (Math.abs(HR.med - FM.median) > 1e-9) throw new Error('NATCOPHARM forwardMedian mismatch');
const byFy = {}; ALL.forEach(x => (byFy[x[2]] ||= []).push(x[1]));
const FWDFY = Object.keys(byFy).sort().map(fy => ({ fy: `FY${String(fy).slice(2)}`, y: +fy, med: pctl(byFy[fy], 0.5), n: byFy[fy].length, eps: rep[fy], thr: thr(+fy), trough: FM.troughYears.includes(`FY${String(fy).slice(2)}`) }));
const exWind = statOf(ALL.filter(x => x[2] >= 2027).map(x => x[1])); // sensitivity: forward years without gRevlimid in the denominator
const keepFY28 = statOf(ALL.filter(x => x[2] !== 2027).map(x => x[1])); // sensitivity: if FY28 were not a trough
// EPS before one-offs (sensitivity; one-offs judged not material, <10% of any year's profit): FY25 less the Rs90.1 cr
// land/PPE gain after tax, FY26 less the Rs115 cr deferred-tax credit, Screener EPS basis
const adj = { ...rep }; adj[2025] = rep[2025] * (1 - FY26.otherIncomeNote.fy25.ppeSaleGain * 0.8 / 1883); adj[2026] = S.tables['profit-loss'].rows['EPS in Rs'][S.tables['profit-loss'].periods.indexOf('Mar 2026')] * (1 - FY26.deferredTaxOneOff / 1418);
const trA = fy => { const pk = Math.max(adj[fy - 1], adj[fy - 2], adj[fy - 3]); return !(adj[fy] > 0) || adj[fy] < 0.5 * pk; };
const ALLA = ALL.map(([d, x, fy]) => [d, x * rep[fy] / adj[fy], fy]), HA = statOf(ALLA.filter(x => !trA(x[2])).map(x => x[1]));
const troughA = [...new Set(ALLA.filter(x => trA(x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const peFY27 = price / F.eps[0], peFY28 = price / F.eps[1], peSep = price / sep(F.eps), peTtm = price / A.ttm.eps;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, half, cagr, shortDate, pctl, medOf, statOf, SA, SQ, QL, Q1, FY26, b, ix, YRS, price, mcap, sep, BM, mv,
  BL, LINES, bld, OB, tre0, openT, oiRows, owcRel, TB, taxRows, assocPct, SHARES, peersAsOf, FM, fyOf, rep, thr, ALL, HR, HALL, FWDFY, exWind, keepFY28, adj, HA, troughA, peFY27, peFY28, peSep, peTtm };
