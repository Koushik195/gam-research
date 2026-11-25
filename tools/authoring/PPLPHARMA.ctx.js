// Piramal Pharma initiation: shared context for the Part B files (research.js, part2-6) and PPLPHARMA.sotp.js. Loads the
// research JSONs and the built model and computes, once: the business-line build (CDMO, CHG, PCH, eliminations; revenue
// and EBITDA checked against the model), the other-income build (checked against assumptions), the interest check on the
// gross-debt path, the one-year-forward EV/EBITDA history since 1-May-2023 (post-listing months skipped; EV = market value
// + net debt on Screener's basis, looked through the AbbVie JV), the trough test (PLAYBOOK §4 analogue on EBITDA), the
// pharma sector factor peer by peer over the same window (PLAYBOOK §7c; reproduces tools/authoring/sector-factor.js),
// the derived multiples, the sum of the parts per case (operating businesses on the derived EV/EBITDA, the AbbVie JV on
// 10x its share of profit, Yapan and other investments at book, less net debt incl. leases), sensitivity rows, DCF
// variants, and the street as it stood on 30-Sep-2026. Set TP_NOCHECK=1 to load while assumptions lag the derivation.
const fs = require('fs');
const path = require('path');
const { peersAsOf } = require('./asof-peers');
const { buildForecast } = require('../../src/forecast');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'PPLPHARMA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'PPLPHARMA.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'PPLPHARMA', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', WIN = '2023-05-01', WIN_TXT = '1-May-2023';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?(?=[0-9])/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK 7c: nearest half-turn
const cagr = (a, z, y) => (Math.pow(z / a, 1 / y) - 1) * 100;
const q = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const r1 = x => Math.round(x * 10) / 10;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SRC = 'Piramal Pharma annual reports, investor presentations and earnings calls; Screener.in (consolidated); GAM Research';
const b = A.labels.length - 1; // FY26 index
const ai = fy => A.labels.indexOf(fy);
const price = M.price.last, sh = F.shares, mcap = price * sh;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const YRS = F.years;
const SA = SG.annual, SQ = SG.quarterly, Q1 = C.q1fy27, FY26 = C.fy26;
const CHECK = !process.env.TP_NOCHECK;

// 1) Business-line build (assumptions.businessLines): revenue and EBITDA must equal the model's
const BL = AS.businessLines, KEYS = ['cdmo', 'chg', 'pch'];
const LINES = Object.fromEntries(KEYS.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
LINES.elim = BL.elim.slice();
const LEB = Object.fromEntries(KEYS.map(k => [k, LINES[k].map((x, i) => x * BL.margin[k][i] / 100)]));
const buildTot = YRS.map((_, i) => KEYS.reduce((s, k) => s + LINES[k][i], 0) + LINES.elim[i]);
const buildEb = YRS.map((_, i) => KEYS.reduce((s, k) => s + LEB[k][i], 0));
if (Math.abs(BL.base.cdmo + BL.base.chg + BL.base.pch + BL.base.elim - A.sales[b]) > 1) throw new Error('PPLPHARMA build base does not sum to FY26 revenue');
YRS.forEach((y, i) => {
  if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`PPLPHARMA revenue build off model in ${y}: ${n0(buildTot[i])} vs ${n0(F.sales[i])}`);
  if (Math.abs(buildEb[i] / F.ebitda[i] - 1) > 0.005) throw new Error(`PPLPHARMA EBITDA build off model in ${y}: ${n0(buildEb[i])} vs ${n0(F.ebitda[i])}`);
});
const share = (k, i) => LINES[k][i] / buildTot[i] * 100;
// FY26 indicative split (GAM, anchored on JM Financial and CARE): CDMO ~7%, PCH ~3%, CHG the remainder
const EB26 = { cdmo: 0.07 * BL.base.cdmo, pch: 0.03 * BL.base.pch };
EB26.chg = A.ebitda[b] - EB26.cdmo - EB26.pch;
const M26 = { cdmo: 7, pch: 3, chg: EB26.chg / BL.base.chg * 100 };

// 2) Other-income build (sourced parts) and reconciliation
const OB = AS.otherIncomeBuild, OIN = C.otherIncomeNote;
const JVPAT = YRS.map((_, i) => OB.abbvieJvPat26 * OB.abbvieGrowth.slice(0, i + 1).reduce((p, g) => p * (1 + g / 100), 1));
const OI_BUILD = YRS.map((_, i) => { const co = OB.interestFund[i] + OB.miscGrant[i] + OB.rentGains[i] + OB.writeBacks[i] + OB.forex[i]; const jv = JVPAT[i] * OB.abbvieStake / 100; return { co, jv, yapan: OB.yapan[i], total: co + jv + OB.yapan[i] }; });
YRS.forEach((y, i) => {
  if (Math.abs(OI_BUILD[i].total - AS.otherIncome[i]) > 1) throw new Error(`PPLPHARMA other income ${y}: build ${n1(OI_BUILD[i].total)} vs assumptions ${AS.otherIncome[i]}`);
  if (Math.abs(OI_BUILD[i].total - F.otherIncome[i]) > 1.5) throw new Error(`PPLPHARMA other income ${y}: build ${n1(OI_BUILD[i].total)} vs model ${F.otherIncome[i]}`);
});
const coOI26 = OIN.FY26.total, coOI25 = OIN.FY25.total, assoc26 = C.fy26.associates, assoc25 = C.fy25.associates;
const ttmCoOI = Object.values(OIN.quarterlyCompany).reduce((s, x) => s + x, 0), ttmAssoc = Object.values(OIN.quarterlyAssociates).reduce((s, x) => s + x, 0);

// 3) Interest check: gross debt = the model's net debt + cash and investments held at the Mar-26 level
const cashHeld = (A.cash[b] || 0) + (A.investments[b] || 0);
const grossDebt = [A.borrowings[b], ...F.treasury.map(t => cashHeld - t)];
const avgDebt = YRS.map((_, i) => (grossDebt[i] + grossDebt[i + 1]) / 2);
const intRate = YRS.map((_, i) => AS.interest[i] / avgDebt[i] * 100);
const rate26 = A.interest[b] / ((A.borrowings[b] + A.borrowings[b - 1]) / 2) * 100;
YRS.forEach((y, i) => { if (Math.abs(intRate[i] / rate26 - 1) > 0.08 && CHECK) console.warn(`WARNING: PPLPHARMA ${y} interest ${AS.interest[i]} implies ${n1(intRate[i])}% on average gross debt ${n0(avgDebt[i])} vs FY26 ${n1(rate26)}% (outside 8%)`); });

// 4) Forward EV/EBITDA history since 1-May-2023 (weekly closes + the 30-Sep close)
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const ebBy = {}, ndBy = {};
A.labels.forEach((l, i) => { const y = 2000 + +l.slice(2, 4); ebBy[y] = A.ebitda[i]; ndBy[y] = (A.borrowings[i] || 0) - (A.cash[i] || 0) - (A.investments[i] || 0); });
YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const RIGHTS = { date: '2023-08-28', cr: 1050 }; // rights shares listed ~28-Aug-2023; proceeds cut net debt before the Mar-24 balance sheet
const ndAt = d => { let y = +d.slice(0, 4); if (d < `${y}-05-31`) y -= 1; return ndBy[y] - (y === 2023 && d >= RIGHTS.date ? RIGHTS.cr : 0); };
const shAt = d => (d < RIGHTS.date ? 119.3 : d < '2026-04-01' ? 132.4 : sh); // crore shares: Mar-23 equity Rs1,193 cr; after the 5:46 rights issue
const JV = C.associates.abbvie;
const jvAdj = d => (d < '2026-05-31' ? 10 * JV.shareFY25 - 101.66 : 10 * JV.shareFY26 - JV.carrying); // JV at 10x PPL's share of profit less its book value (already in net debt)
const pxAll = S.charts.price.Price.filter(([d]) => d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const evPoint = (d, p, look = true) => (p * shAt(d) + ndAt(d) - (look ? jvAdj(d) : 0)) / ebBy[fyOf(d)];
const EVS = pxAll.filter(([d]) => d >= WIN).map(([d, p]) => [d, evPoint(d, p), fyOf(d)]);
const stat = v => ({ med: medOf(v), p25: q(v, 0.25), p75: q(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length });
const EVH = stat(EVS.map(x => x[1]));
const EVH_NOLOOK = stat(pxAll.filter(([d]) => d >= WIN).map(([d, p]) => evPoint(d, p, false)));
const EVH_BYFY = Object.fromEntries([...new Set(EVS.map(x => x[2]))].map(fy => [`FY${String(fy).slice(2)}`, stat(EVS.filter(x => x[2] === fy).map(x => x[1]))]));
const EVH_EX26 = stat(EVS.filter(x => x[2] !== 2026).map(x => x[1]));
const EVH_EXEARLY = stat(EVS.filter(x => x[2] !== 2025).map(x => x[1]));
const EVH_5TH = stat(EVS.filter((_, i) => i % 5 === 0).map(x => x[1]));
const trailEv = S.charts.evEbitda['EV Multiple'].filter(([d, x]) => d >= WIN && d <= ASOF && x > 0);
const EVH_TRAIL = stat(trailEv.map(x => x[1]));
const evNow = (mcap + ndBy[2026] - jvAdj(ASOF)) / F.ebitda[1], evNowSep = (mcap + ndBy[2026] - jvAdj(ASOF)) / sep(F.ebitda), evNowFY27 = (mcap + ndBy[2026] - jvAdj(ASOF)) / F.ebitda[0];
// Trough test, PLAYBOOK §4 as written (the house forwardMedian test): a date is left out when its forward EPS is a loss or
// below half the highest EPS of the previous three years (Screener EPS; FY21-22 have none as the company was not yet
// listed). EBITDA analogue (same half-of-peak test on EBITDA) shown alongside for the record.
const epsBy = {}; S.tables['profit-loss'].periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) epsBy[+p.slice(-4)] = S.tables['profit-loss'].rows['EPS in Rs'][i]; });
epsBy[2026] = A.eps[b]; YRS.forEach((y, i) => (epsBy[2000 + +y.slice(2, 4)] = F.eps[i]));
const troughEps = fy => { const prev = [epsBy[fy - 1], epsBy[fy - 2], epsBy[fy - 3]].filter(v => v != null); const pk = prev.length ? Math.max(...prev) : null; return !(epsBy[fy] > 0) || (pk > 0 && epsBy[fy] < 0.5 * pk); };
const TROUGH = [2025, 2026, 2027, 2028].map(fy => { const prevE = [ebBy[fy - 1], ebBy[fy - 2], ebBy[fy - 3]]; const prevP = [epsBy[fy - 1], epsBy[fy - 2], epsBy[fy - 3]].filter(v => v != null);
  return { fy: `FY${String(fy).slice(2)}${fy >= 2027 ? 'E' : ''}`, fyNum: fy, eps: epsBy[fy], epsHalfPeak: prevP.length ? Math.max(...prevP) / 2 : null, troughEps: troughEps(fy), eb: ebBy[fy], ebHalfPeak: Math.max(...prevE) / 2, troughEb: ebBy[fy] < Math.max(...prevE) / 2 }; });
// Reviewer decision (25-Nov-2026): an EV/EBITDA history uses the EBITDA version of the §4 test (house precedent: NH, FORTIS, MAXHEALTH, TORNTPHARM); the EPS reading is a sensitivity row.
const troughFys = TROUGH.filter(t => t.troughEb).map(t => t.fyNum), troughYears = TROUGH.filter(t => t.troughEb).map(t => t.fy);
const epsTroughYears = TROUGH.filter(t => t.troughEps).map(t => t.fy);
const EVS_BASE = EVS.filter(x => !troughFys.includes(x[2]));
const EVH_BASE = stat(EVS_BASE.map(x => x[1]));
const EVH_ONLYNEW = stat(EVS.filter(x => x[2] >= 2027).map(x => x[1]));
const EVH_5TH_BASE = stat(EVS_BASE.filter((_, i) => i % 5 === 0).map(x => x[1]));
const EVH_NOLOOK_BASE = stat(pxAll.filter(([d]) => d >= WIN && !troughFys.includes(fyOf(d))).map(([d, p]) => evPoint(d, p, false)));

// 5) Sector factor over the same window (same method as tools/authoring/sector-factor.js)
const SET = D.peers.set, EXCL = Object.keys(D.peers.excluded), CTX = D.peers.context;
const PEERS = peersAsOf([...new Set([...SET, 'PPLPHARMA', ...CTX])], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const raw = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
const medI = a => { const s = [...a].sort((x, y) => x - y); if (!s.length) return null; const i = (s.length - 1) / 2, lo = Math.floor(i); return s[lo] + (s[Math.ceil(i)] - s[lo]) * (i - lo); };
const medFrom = (sym, ch, key, from) => medI((raw(sym).charts?.[ch]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= from && x > 0).map(x => x[1]));
const factorOver = from => {
  const syms = [...SET, 'PPLPHARMA'];
  const med = Object.fromEntries(syms.map(s => [s, medFrom(s, 'pe', 'Price to Earning', from)]));
  const medEv = Object.fromEntries(syms.map(s => [s, medFrom(s, 'evEbitda', 'EV Multiple', from)]));
  const dr = Object.fromEntries(syms.map(s => [s, P[s].pe && med[s] ? +((P[s].pe / med[s] - 1) * 100).toFixed(1) : null]));
  const drEv = Object.fromEntries(syms.map(s => [s, P[s].evEbitda && medEv[s] ? +((P[s].evEbitda / medEv[s] - 1) * 100).toFixed(1) : null]));
  return { med, medEv, dr, drEv, pe: medI(SET.map(s => dr[s])), ev: medI(SET.map(s => drEv[s])) };
};
const FW = factorOver(WIN), F5 = factorOver('2021-09-30');
const SECTOR_EV = 5.1, SECTOR_PE = 9.5; // brief / PLAYBOOK 7c same-window rule: +5.1% EV/EBITDA, +9.5% P/E since 1-May-2023
if (Math.abs(FW.ev - SECTOR_EV) > 0.05 || Math.abs(FW.pe - SECTOR_PE) > 0.05) console.warn(`WARNING: PPLPHARMA same-window factor recomputes to ${FW.ev}% EV/EBITDA, ${FW.pe}% P/E vs +5.1% / +9.5%`);
const K = 1 + SECTOR_EV / 100;
const ownDrEv = FW.drEv.PPLPHARMA;
const shortName = s => ({ PPLPHARMA: 'Piramal Pharma', SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo', ALKEM: 'Alkem', IPCALAB: 'Ipca', ABBOTINDIA: 'Abbott India', SYNGENE: 'Syngene', SAILIFE: 'Sai Life Sciences', GLAND: 'Gland Pharma', ANTHEM: 'Anthem Biosciences', LAURUSLABS: 'Laurus Labs', NEULANDLAB: 'Neuland Labs' }[s] || s);

// 6) Derived multiples and the sum of the parts per case
const MULT = { base: half(EVH_BASE.med * K), bull: half(EVH_BASE.p75 * K), bear: half(EVH_BASE.p25 * K) };
const peerPe = SET.map(s => P[s].pe).filter(x => x > 0);
const PEM = { base: half(medOf(peerPe)), bull: half(q(peerPe, 0.75)), bear: half(q(peerPe, 0.25)) };
const JV_MULT = 10; // ICICI Direct (30-Jul-2026) values the AbbVie JV at 10x PAT; the only broker that discloses a basis
const jvShareSep28 = sep(JVPAT) * OB.abbvieStake / 100, JV_VALUE = JV_MULT * jvShareSep28, JV_BOOK = JV.carrying;
const scenF = name => {
  if (name === 'base') return F;
  const s = AS.scenarios[name], a2 = JSON.parse(JSON.stringify(AS));
  if (s.revenueGrowthDelta) a2.revenueGrowth = a2.revenueGrowth.map(g => g + s.revenueGrowthDelta);
  if (s.marginDelta) a2.ebitdaMargin = a2.ebitdaMargin.map(m => m + s.marginDelta);
  if (s.fadeMarginTo) a2.dcf.fadeMarginTo = s.fadeMarginTo;
  return buildForecast(M, a2).F;
};
const SOTP = Object.fromEntries(['base', 'bull', 'bear'].map(c => {
  const Fc = scenF(c), eb = sep(Fc.ebitda), tr = sep(Fc.treasury), ops = MULT[c] * eb;
  const parts = [
    { key: 'ops', name: `CDMO, CHG and PCH: ${MULT[c]}x Sep-28E EBITDA`, value: ops },
    { key: 'jv', name: `AbbVie Therapeutics India (49%): ${JV_MULT}x share of Sep-28E profit`, value: JV_VALUE },
    { key: 'nd', name: 'Net debt at Sep-28E incl. leases (Yapan Bio and other investments at book)', value: tr - JV_BOOK },
  ];
  const total = parts.reduce((s, p) => s + p.value, 0);
  return [c, { eb, tr, parts, total, perShare: total / sh, implied: (total - tr) / eb, eps: sep(Fc.eps) }];
}));
const EVM = { base: Math.round(SOTP.base.implied * 100) / 100, bull: Math.round(SOTP.bull.implied * 100) / 100, bear: Math.round(SOTP.bear.implied * 100) / 100 };
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const mismatch = [];
['base', 'bull', 'bear'].forEach(c => { if (Math.abs(mv('ev').multiple[c] - EVM[c]) > 1e-9) mismatch.push(`ev ${c} ${mv('ev').multiple[c]} vs ${EVM[c]}`); if (Math.abs(mv('pe').multiple[c] - PEM[c]) > 1e-9) mismatch.push(`pe ${c} ${mv('pe').multiple[c]} vs ${PEM[c]}`); });
if (mismatch.length && CHECK) throw new Error('PPLPHARMA: assumptions multiples differ from the derivation (run node tools/authoring/PPLPHARMA.sotp.js, then src/model.js): ' + mismatch.join('; '));
const ebitdaSep28 = sep(F.ebitda), epsSep28 = sep(F.eps), tSep28 = sep(F.treasury), ndSep28 = -(tSep28 - JV_BOOK);

// 7) Sensitivity rows (only the first is the house method)
const tpAt = (mult, extra = 0) => { const v = (mult * ebitdaSep28 + JV_VALUE + tSep28 - JV_BOOK + extra) / sh; return Math.round(v / 5) * 5; };
const segSotp = (mc, mh, mp) => (mc * LEB.cdmo[1] * 0.5 + mc * LEB.cdmo[2] * 0.5) + (mh * (LEB.chg[1] + LEB.chg[2]) / 2) + (mp * (LEB.pch[1] + LEB.pch[2]) / 2);
const segSotpIcici = 17 * (LEB.cdmo[1] + LEB.cdmo[2]) / 2 + 15 * (LEB.chg[1] + LEB.chg[2]) / 2 + 2 * (LINES.pch[1] + LINES.pch[2]) / 2;
const abbottPe = P.ABBOTINDIA?.pe;
const kenalogContingent = 65 * 95.81 / 10; // US$65 mn at 95.81 Rs/$ in Rs crore
const SENS = [
  { name: 'House base: forward EV/EBITDA since 1-May-2023 (EBITDA trough test: no year excluded) × same-window factor', mult: MULT.base, tp: tpAt(MULT.base), why: `${n1(EVH_BASE.med)}x × ${K.toFixed(3)}; every weekly point (FY26 EBITDA −36%, above half its peak)` },
  { name: 'EPS version of the trough test (FY26-forward dates left out)', mult: half(EVH_EX26.med * K), tp: tpAt(half(EVH_EX26.med * K)), why: `${n1(EVH_EX26.med)}x × ${K.toFixed(3)}; forward FY26 EPS a loss, so Apr-24 to Mar-25 dropped (median there ${n1(EVH_BYFY.FY26.med)}x)` },
  { name: 'Only dates whose forward year is FY27E-28E (our estimates)', mult: half(EVH_ONLYNEW.med * K), tp: tpAt(half(EVH_ONLYNEW.med * K)), why: `${n1(EVH_ONLYNEW.med)}x × ${K.toFixed(3)} (${EVH_ONLYNEW.n} points since Apr-2025)` },
  { name: 'Every 5th weekly point (house P/E sampling)', mult: half(EVH_5TH_BASE.med * K), tp: tpAt(half(EVH_5TH_BASE.med * K)), why: `${n1(EVH_5TH_BASE.med)}x × ${K.toFixed(3)} (${EVH_5TH_BASE.n} points)` },
  { name: 'No JV look-through in the history', mult: half(EVH_NOLOOK_BASE.med * K), tp: tpAt(half(EVH_NOLOOK_BASE.med * K)), why: `${n1(EVH_NOLOOK_BASE.med)}x × ${K.toFixed(3)}; would count the JV twice` },
  { name: "Screener's trailing EV/EBITDA since 1-May-2023 (EBITDA incl. other income)", mult: half(EVH_TRAIL.med * K), tp: tpAt(half(EVH_TRAIL.med * K)), why: `${n1(EVH_TRAIL.med)}x × ${K.toFixed(3)}; FY23-24's depressed trailing EBITDA sits in its early months` },
  { name: 'Own history only (no sector factor)', mult: half(EVH_BASE.med), tp: tpAt(half(EVH_BASE.med)), why: `${n1(EVH_BASE.med)}x` },
  { name: "Blend with Piramal's own re-rating (not house policy)", mult: half(EVH_BASE.med * (1 + (SECTOR_EV + ownDrEv) / 200)), tp: tpAt(half(EVH_BASE.med * (1 + (SECTOR_EV + ownDrEv) / 200))), why: `midpoint of +${SECTOR_EV}% and its own ${pc1(ownDrEv)} (trailing basis)` },
  { name: 'Street segment SOTP: MOSL multiples (23x / 11x / 13x) on our split', mult: r1(segSotp(23, 11, 13) / ebitdaSep28), tp: tpAt(segSotp(23, 11, 13) / ebitdaSep28), why: 'GAM segment EBITDA estimates; blended multiple shown' },
  { name: 'Street segment SOTP: ICICI Direct (17x / 15x / 2x PCH sales) on our split', mult: r1(segSotpIcici / ebitdaSep28), tp: tpAt(segSotpIcici / ebitdaSep28), why: 'GAM estimates; blended multiple shown' },
  { name: 'Choice: 24x consolidated', mult: 24, tp: tpAt(24), why: 'Choice uses FY28E; here on Sep-28E EBITDA' },
  { name: 'Base, less the full Kenalog contingent consideration', mult: MULT.base, tp: tpAt(MULT.base, -kenalogContingent), why: `US$65 mn ≈ ₹${n0(kenalogContingent)} cr deducted` },
  { name: `Base, AbbVie JV at Abbott India's P/E less 20% (${n1(abbottPe * 0.8)}x)`, mult: MULT.base, tp: tpAt(MULT.base, (abbottPe * 0.8 - JV_MULT) * jvShareSep28), why: `Abbott India trailing P/E ${n1(abbottPe)}x at the ${ASOF_TXT} close; listed-stake discount precedent` },
].map(r => ({ ...r, up: (r.tp / price - 1) * 100 }));

// 8) DCF variants (same mechanics as src/forecast.js dcf()): tax and margin at management's 'at scale' levels
const DC = AS.dcf, ke = V.ke;
const dcfVar = ({ tax = AS.taxRate[2], margin = DC.fadeMarginTo, g = null } = {}) => {
  let s = F.sales[0], pv = 0, last = null; const n = DC.years, t = tax / 100;
  for (let k = 1; k <= n; k++) {
    const sF = (k - 3 + 1) / (n - 3 + 1);
    const gr = g != null ? g : k < 3 ? F.salesGrowth[k] : F.salesGrowth[2] + (DC.fadeGrowthTo - F.salesGrowth[2]) * sF;
    const m = k < 3 ? F.ebitdaMargin[k] : F.ebitdaMargin[2] + (margin - F.ebitdaMargin[2]) * sF;
    const cx = k < 3 ? F.capex[k] / F.sales[k] * 100 : F.capex[2] / F.sales[2] * 100 + (DC.fadeCapexPctTo - F.capex[2] / F.sales[2] * 100) * sF;
    s *= 1 + gr / 100; const e = s * m / 100, dep = s * DC.depPctOfSales / 100;
    const f = (e - dep) * (1 - t) + dep - s * cx / 100 - F.owcPct / 100 * s * (gr / (100 + gr));
    pv += f / Math.pow(1 + ke / 100, k - 0.5); last = f;
  }
  const tv = last * (1 + DC.terminalGrowth / 100) / ((ke - DC.terminalGrowth) / 100) / Math.pow(1 + ke / 100, n);
  return (pv + tv + F.treasury[0]) / sh * Math.pow(1 + ke / 100, 0.5);
};
const DCFV = { engine: dcfVar(), tax25: dcfVar({ tax: 25 }), m25: dcfVar({ margin: 25 }), both: dcfVar({ tax: 25, margin: 25 }) };
if (Math.abs(DCFV.engine - V.perShare * Math.pow(1 + ke / 100, 0.5)) > 3) console.warn(`WARNING: PPLPHARMA DCF replica ${n1(DCFV.engine)} vs engine ${n1(V.perShare * Math.pow(1 + ke / 100, 0.5))}`);

// 9) Rating from the house rule (never typed); street as it stood on 30-Sep-2026
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const ST = D.street.brokers, br = n => ST.find(s => s.broker === n);
const postQ1 = ST.filter(s => s.date >= '2026-07-29');
const medTp = medOf(postQ1.map(s => s.tp)), avgTp = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length;
const idir = br('ICICI Direct'), mosl = br('Motilal Oswal'), choice = br('Choice Institutional Equities');
const ICICI_EST = { rev: [10263.5, 11616.5], ebitda: [1685.1, 2080.4], pat: [405.7, 599.2], eps: [3.1, 4.5] };

// 10) Growth, returns, history and price
const pxAt = d => { const s = pxAll.filter(([x]) => x <= d); return s.length ? s.at(-1)[1] : null; };
const px = { dec25: pxAt('2025-12-31'), mar26: pxAt('2026-03-31'), jun26: pxAt('2026-06-30'), jul24: pxAt('2026-07-24'), hi: Math.max(...pxAll.map(x => x[1])), lo52: Math.min(...pxAll.filter(([d]) => d >= '2025-09-30').map(x => x[1])), hi52: Math.max(...pxAll.filter(([d]) => d >= '2025-09-30').map(x => x[1])) };
const ytd = (price / px.dec25 - 1) * 100;
const ndCo26 = C.fy26.netDebtPpt;
const roce = S.tables.ratios.rows['ROCE %'];
const capexPct26 = A.capex[b] / A.sales[b] * 100;
const fixedAssets26 = A.fixedAssets[b] + A.cwip[b];

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, WIN, WIN_TXT, n0, n1, pc, pc1, rup, half, cagr, q, medOf, r1, shortDate, SRC, b, ai, price, sh, mcap, sep, YRS,
  SA, SQ, Q1, FY26, BL, KEYS, LINES, LEB, buildTot, buildEb, share, EB26, M26, OB, OIN, JVPAT, OI_BUILD, coOI26, coOI25, assoc26, assoc25, ttmCoOI, ttmAssoc,
  cashHeld, grossDebt, avgDebt, intRate, rate26, fyOf, ebBy, ndBy, epsBy, epsTroughYears, EVS, EVS_BASE, EVH, EVH_NOLOOK, EVH_BYFY, EVH_EX26, EVH_EXEARLY, EVH_5TH, EVH_TRAIL, EVH_BASE, EVH_ONLYNEW, EVH_5TH_BASE, EVH_NOLOOK_BASE, evNow, evNowSep, evNowFY27, TROUGH, troughYears, troughFys, RIGHTS, JV,
  SET, EXCL, CTX, PEERS, P, FW, F5, SECTOR_EV, SECTOR_PE, K, ownDrEv, shortName, MULT, PEM, JV_MULT, jvShareSep28, JV_VALUE, JV_BOOK, SOTP, EVM, BM, mv, mismatch, ebitdaSep28, epsSep28, tSep28, ndSep28,
  SENS, kenalogContingent, abbottPe, DCFV, rating, ruleText, buyBelow, sellAbove, ST, br, postQ1, medTp, avgTp, idir, mosl, choice, ICICI_EST, pxAt, px, ytd, ndCo26, roce, capexPct26, fixedAssets26 };

if (require.main === module) {
  console.log('build', buildTot.map(n0), 'model', F.sales, '| EBITDA build', buildEb.map(n0), 'model', F.ebitda, '| FY26 split', JSON.stringify(EB26), M26.chg.toFixed(1));
  console.log('OI build', OI_BUILD.map(x => `${x.co}+${n1(x.jv)}${x.yapan}=${n1(x.total)}`), 'model', F.otherIncome, '| FY26', coOI26, '+', assoc26, '| TTM', ttmCoOI, '+', ttmAssoc);
  console.log('interest rate', intRate.map(n1), 'FY26', n1(rate26), 'gross debt', grossDebt.map(n0));
  console.log('EVH', JSON.stringify(EVH), '| base', n1(EVH_BASE.med), '| nolook', n1(EVH_NOLOOK.med), '| ex26', n1(EVH_EX26.med), '| exEarly', n1(EVH_EXEARLY.med), '| 5th', n1(EVH_5TH.med), '| trail', n1(EVH_TRAIL.med));
  console.log('byFY', Object.entries(EVH_BYFY).map(([k, v]) => `${k} ${n1(v.med)} (${v.n})`).join(' | '), '| trough', JSON.stringify(TROUGH));
  console.log('factor EV', FW.ev, 'PE', FW.pe, '| own EV', ownDrEv, '| 5y', F5.ev, F5.pe, '| MULT', JSON.stringify(MULT), 'PEM', JSON.stringify(PEM), '| EVM', JSON.stringify(EVM), 'mismatch', mismatch.join('; '));
  console.log('SOTP', Object.entries(SOTP).map(([c, s]) => `${c}: eb ${n0(s.eb)} tr ${n0(s.tr)} ${s.parts.map(p => p.key + ' ' + n0(p.value)).join(' ')} = ${n0(s.total)} -> ${n1(s.perShare)} implied ${s.implied.toFixed(2)}`).join(' || '));
  console.log('SENS', SENS.map(r => `${r.name}: ${r.mult}x ${r.tp}`).join(' | '));
  console.log('DCF', JSON.stringify(Object.fromEntries(Object.entries(DCFV).map(([k, v]) => [k, Math.round(v)]))), 'engine', V.intrinsicTp, '| TP', V.tp, V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'bull', SC.bull.tp, 'bear', SC.bear.tp);
  console.log('street', postQ1.length, 'med', medTp, 'avg', Math.round(avgTp), 'evNow', n1(evNow), n1(evNowSep), n1(evNowFY27), 'px', JSON.stringify(px), 'ytd', n1(ytd), 'buy<', buyBelow, 'sell>', sellAbove);
}
