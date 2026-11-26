// OneSource Specialty Pharma initiation: shared context, part A (inputs and builds). ONESOURCE.ctx.js adds the sector
// factor, derived multiples, checks, sensitivities and the street, and re-exports everything. Computed once here:
// the two-line revenue build (checked against model revenue), the engine net-debt path, the other-income build
// (6.5% on a ~Rs100 cr cash buffer + sourced recurring items), the interest build (8.25% on average gross borrowings +
// leases + bank charges - capitalised interest), adjusted EPS, and OneSource's one-year-forward EV/EBITDA and P/E
// histories on every weekly close plus the 30-Sep close, for the base window (since 13-May-2026) and two alternatives.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ONESOURCE', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = { ...rd('company.json'), ...rd('company2.json') }, D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ONESOURCE.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'ONESOURCE', 'screener.json'), 'utf8')); // unpatched
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2025-01-24';
const FROM = '2026-05-13', FROM_TXT = '13-May-2026'; // base window: Q4FY26 results, first of the profitable quarters
const ALT1 = '2026-04-01', ALT2 = '2025-05-05'; // forward year = FY28E throughout; FY25 results (full post-listing window)
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
const SRC = 'OneSource annual report FY26, results decks and calls; Screener.in (consolidated); GAM Research';
const b = A.labels.length - 1; // FY26 index
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const SQ = SG.quarterly, Q1 = C.q1fy27, FY26 = C.fy26, BS = C.balanceMar26;

// 1) Two-line build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines, KEYS = ['ddc', 'core'];
const LBL = { ddc: 'DDC & biologics', core: 'Base business (sterile injectables, soft gels)' };
const LINES = Object.fromEntries(KEYS.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => KEYS.reduce((s, k) => s + LINES[k][i], 0));
if (Math.abs(KEYS.reduce((s, k) => s + BL.base[k], 0) / A.sales[b] - 1) > 0.001) throw new Error('ONESOURCE build base != FY26 revenue');
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`ONESOURCE build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });

// 2) Net debt: engine path (Screener cash + investments - borrowings; leases sit in other liabilities) and published points
const ND0 = (A.cash[b] || 0) + (A.investments[b] || 0) - (A.borrowings[b] || 0); // Mar-26, engine (negative = net debt)
const cashPath = [ND0, ...F.treasury];
const NDP = C.netDebtPublished.filter(x => !/CARE/.test(x.basis)).map(x => [x.published, x.netDebt]);
const ndAt = d => NDP.filter(([x]) => x <= d).at(-1)[1];
const ndLease = sep(F.treasury) - BS.leases; // Sep-28E net debt if leases were counted as debt

// 3) Other income build: 6.5% on a ~Rs100 cr cash buffer + deposit unwinding + scrap + support services (promoter group)
const OIN = C.otherIncomeNote, BUF = 100, TY = 6.5, UNWIND = 0.7, SCRAP = 0.6, SUPPORT = 1.8;
const oiTreas = YRS.map(() => TY / 100 * BUF), oiBuild = oiTreas.map(t => t + UNWIND + SCRAP + SUPPORT);
const oiOk = YRS.every((y, i) => Math.abs(oiBuild[i] - AS.otherIncome[i]) <= 0.05);

// 4) Interest build: KD on average gross borrowings (engine net debt + cash buffer) + leases + bank charges - capitalised
const KD = 8.25, LEASE_INT = 20, BANK = 10, CAPZ = [10, 0, 0];
const intBuild = YRS.map((_, i) => KD / 100 * ((-cashPath[i] - cashPath[i + 1]) / 2 + BUF) + LEASE_INT + BANK - CAPZ[i]);
const intOk = YRS.every((y, i) => Math.abs(intBuild[i] - AS.interest[i]) <= 0.15);

// 5) EPS: reported (engine) and before scheme amortisation (after its tax effect; company 'adjusted' adds it back gross)
const AMORT = FY26.schemeAmort, epsU = F.pat.map(p => p / SHARES);
const epsAdj = F.pat.map((p, i) => (p + AMORT * (1 - AS.taxRate[i] / 100)) / SHARES);
const epsCo = F.pat.map(p => (p + AMORT) / SHARES);

// 6) Forward histories: EV = price x shares at the date + last published company net debt (excl. leases, like the engine);
//    forward = next full fiscal year (dates Apr-Mar of FY(t) -> FY(t+1)): FY27E or FY28E (our forecasts; no exceptional items)
const SH = [['2025-01-01', 11.4436021], ['2025-08-04', 11.4525216], ['2025-12-09', 11.4585136], ['2026-01-21', 11.4621201], ['2026-04-09', 11.4642651], ['2026-05-13', 11.4645801], ['2026-07-08', 11.4669991]];
const shAt = d => SH.filter(([x]) => x <= d).at(-1)[1];
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const ebBy = { 2027: F.ebitda[0], 2028: F.ebitda[1] }, epsBy = { 2027: epsU[0], 2028: epsU[1] };
const pxAll = RAW.charts.price.Price.filter(([d]) => d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const stat = s => { const v = s.map(x => x[1]); return { med: medOf(v), p25: pctl(v, 0.25), p75: pctl(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }; };
const evSeries = from => pxAll.filter(([d]) => d >= from && d >= '2025-05-05').map(([d, p]) => [d, Math.round((p * shAt(d) + ndAt(d)) / ebBy[fyOf(d)] * 10) / 10]);
const peSeries = from => pxAll.filter(([d]) => d >= from && d >= '2025-05-05').map(([d, p]) => [d, Math.round(p / epsBy[fyOf(d)] * 10) / 10]);
const sEv = evSeries(FROM), EVH = stat(sEv), sPe = peSeries(FROM), PEH = stat(sPe);
const sEv1 = evSeries(ALT1), EVH1 = stat(sEv1), sEv2 = evSeries(ALT2), EVH2 = stat(sEv2), PEH2 = stat(peSeries(ALT2));
const EVH2a = stat(sEv2.filter(([d]) => d < '2026-04-01')); // FY27E-forward points only
const evNowFwd = (mcap + ndAt(ASOF)) / F.ebitda[1], evNowFY27 = (mcap + ndAt(ASOF)) / F.ebitda[0];
const peNowFwd = price / epsU[1], peFY27 = price / epsU[0];
const trailEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), evTrail = (mcap + ndAt(ASOF)) / trailEbitda;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, LISTED, FROM, FROM_TXT, ALT1, ALT2, n0, n1, pc, pc1, rup, half, cagr, medOf, pctl, shortDate, SRC, b, YRS, sep, price, SHARES, mcap, SQ, Q1, FY26, BS,
  BL, KEYS, LBL, LINES, buildTot, ND0, cashPath, NDP, ndAt, ndLease, OIN, BUF, TY, UNWIND, SCRAP, SUPPORT, oiTreas, oiBuild, oiOk, KD, LEASE_INT, BANK, CAPZ, intBuild, intOk,
  AMORT, epsU, epsAdj, epsCo, SH, shAt, fyOf, pxAll, stat, sEv, EVH, sPe, PEH, sEv1, EVH1, sEv2, EVH2, PEH2, EVH2a, evNowFwd, evNowFY27, peNowFwd, peFY27, trailEbitda, evTrail };
