// Ipca Laboratories initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and
// the built model and computes, once: the business-line build (checked against model revenue), the minorities and tax
// build (the engine has no minority line: tax line = 26% tax + minorities, so the model's EPS is EPS to Ipca's
// shareholders), the gross-cash path and the other-income and interest builds (checked against assumptions.json), EPS
// before exceptional items and one-off gains (the basis of the multiple's history), the trough test on that basis and on
// reported EPS, the forward P/E history since the Unichem deal (25-Apr-2023; every weekly close plus the 30-Sep close),
// the pharma sector factor (+10.25% excluding Ipca, PLAYBOOK §7c A20, reproduced per peer) and its EV/EBITDA analogue,
// the target multiples, the forward EV/EBITDA cross-check, the Unichem stake at market, peers and the street.
// As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const PATCH = require('./IPCALAB.patch');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'IPCALAB', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'IPCALAB.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'IPCALAB', 'screener.json'), 'utf8')); // unpatched
const UNI = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'UNICHEMLAB', 'screener.json'), 'utf8'));
const CLOSES = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', '2026-09-30.json'), 'utf8')).closes;
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', DEAL_DAY = '2023-04-25'; // first trading day after the Unichem SPA (24-Apr-2023, after market)
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pctl = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, UD = C.unichem;
const b = A.labels.length - 1; // FY26 index
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;

// 1) Business-line build must sum to model revenue
const BL = AS.businessLines, LINES = Object.keys(BL.base);
const LBL = { domForm: 'Domestic formulations', expBranded: 'Export branded formulations', expGeneric: 'Export generics (ex-tenders)', expInstitutional: 'Institutional (anti-malarial tenders)', api: 'APIs & intermediates', subsidiaries: 'Subsidiaries (mainly Unichem), net' };
const build = Object.fromEntries(LINES.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => LINES.reduce((s, k) => s + build[k][i], 0));
const baseTot = LINES.reduce((s, k) => s + BL.base[k], 0);
if (Math.abs(baseTot / A.sales[b] - 1) > 0.001) throw new Error(`IPCALAB base lines ${baseTot} != FY26 ${A.sales[b]}`);
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`IPCALAB build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });
const mixPct = k => YRS.map((_, i) => build[k][i] / buildTot[i] * 100);
const expFormTot = YRS.map((_, i) => build.expBranded[i] + build.expGeneric[i] + build.expInstitutional[i]);

// 2) Minorities and tax (assumptions.taxBuild): engine tax rate = (26% x PBT + minorities) / PBT
const TB = AS.taxBuild, MIN = TB.minorities;
TB.minorities.forEach((m, i) => { const c = TB.unichemPat[i] * TB.unichemMinorityPct / 100 + TB.trophicPat[i] * TB.trophicMinorityPct / 100; if (Math.abs(m - c) > 1.5) throw new Error(`IPCALAB minorities ${YRS[i]}: ${m} vs build ${c.toFixed(1)}`); });
const taxRateBuild = YRS.map((_, i) => Math.round((TB.taxOnPbt[i] / 100 * F.pbt[i] + MIN[i]) / F.pbt[i] * 10000) / 100);
const taxOk = YRS.every((_, i) => Math.abs(taxRateBuild[i] - AS.taxRate[i]) < 0.02);
const taxOnly = YRS.map((_, i) => TB.taxOnPbt[i] / 100 * F.pbt[i]);
const patPreMin = YRS.map((_, i) => F.pbt[i] - taxOnly[i]);
const minPs = MIN.map(m => m / SHARES);

// 3) Gross cash path and the other-income build. Engine net cash (Screener basis: cash + investments incl. the ₹184 cr
//    of equity-accounted Krebs/Lyka stakes − borrowings incl. leases) is reduced each year by the minorities carried in
//    the tax line; that cash in fact stays in Unichem/Trophic, so gross treasury = engine net cash + cumulative
//    minorities + gross borrowings − associate stakes.
const ASSOC_BOOK = FY26.balance.equityAccounted; // ₹183.61 cr
const UNI_DEBT = FY26.balance.unichemBorrowings; // Unichem's working-capital and term borrowings, held flat (₹469 cr at Mar-26)
const DEBT = [FY26.balance.borrowingsTotal, UNI_DEBT + 70 + FY26.balance.leases, UNI_DEBT + FY26.balance.leases, UNI_DEBT + FY26.balance.leases]; // Mar-26 actual; Ipca's term loans ₹235 cr → ~₹70 cr at Mar-27 (guided) → nil; leases flat
const cumMin = YRS.map((_, i) => MIN.slice(0, i + 1).reduce((s, x) => s + x, 0));
const nc0 = A.cash[b] + A.investments[b] + (AS.otherTreasury?.base || 0) - A.borrowings[b]; // Mar-26 engine net cash (₹600 cr)
const grossCash = [nc0 + DEBT[0] - ASSOC_BOOK, ...YRS.map((_, i) => F.treasury[i] + cumMin[i] + DEBT[i + 1] - ASSOC_BOOK)];
const TY = 7.0, MISC = 12, JV = -5;
const oiTreas = YRS.map((_, i) => TY / 100 * (grossCash[i] + grossCash[i + 1]) / 2);
const oiBuild = YRS.map((_, i) => Math.round(oiTreas[i] + MISC + JV));
const oiOk = YRS.every((y, i) => Math.abs(oiBuild[i] - AS.otherIncome[i]) <= 2);
const OI26 = FY26.otherIncome; // AR note 24
const TTM_OI = RAW.schedules.quarters['Other Income']['Other income normal'];
const ttmOi = ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026'].reduce((s, p) => s + (TTM_OI[p] || 0), 0);
const netCashOwn = YRS.map((_, i) => grossCash[i + 1] - DEBT[i + 1]); // net cash ex-associates, incl. leases, with minorities' cash

// 4) Interest build (assumptions.interest)
// Unichem ~₹30 cr a year (₹7-9 cr a quarter in FY26-Q1FY27, incl. its leases); Ipca's cheap term loans at 6.5% (₹193 cr at
// Jun-26 → ₹70 cr at Mar-27 → nil in FY28); Ipca's leases (₹73.8 cr) at 8.5%; other finance costs. FY27E = Q1 actual + nine months.
const UNI_INT = 30, KD = 6.5, LEASE_INT = 8.5, OTHER_FIN = [1.5, 2, 2], LEASE_IPCA = FY26.balance.ipcaLeases;
const intBuild = [Q1.interest + UNI_INT * 0.75 + KD / 100 * (193 + 70) / 2 * 0.75 + LEASE_INT / 100 * LEASE_IPCA * 0.75 + OTHER_FIN[0], UNI_INT + KD / 100 * 70 / 2 + LEASE_INT / 100 * LEASE_IPCA + OTHER_FIN[1], UNI_INT + LEASE_INT / 100 * LEASE_IPCA + OTHER_FIN[2]];
const intOk = YRS.every((_, i) => Math.abs(intBuild[i] - AS.interest[i]) <= 1.5);

// 5) EPS bases. Model EPS is to shareholders (minorities in the tax line). History: company EPS before exceptional items
//    (AR Ind AS 33 notes: FY23 18.58, FY24 25.82, FY25 35.14, FY26 46.94), FY26 also before the ₹60.04 cr one-off gain on
//    deconsolidating Bayshore (booked in other income, AR FY26 note 24); FY20-22 before Screener's exceptional items.
const epsU = F.pat.map(p => p / SHARES);
const epsSep = sep(epsU);
const pl = RAW.tables['profit-loss'], ns = RAW.schedules['profit-loss']['Net Profit'];
const epsRep = {}, excAt = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4); epsRep[y] = pl.rows['EPS in Rs'][i]; excAt[y] = ns['Exceptional items AT'][p] || 0; } });
const SH_ACT = 25.3704218;
const BAYSHORE_PS = FY26.bayshoreGain / SH_ACT;
const epsBase = { 2020: epsRep[2020] - excAt[2020] / SH_ACT, 2021: epsRep[2021] - excAt[2021] / SH_ACT, 2022: epsRep[2022] - excAt[2022] / SH_ACT, 2023: C.epsBeforeExceptional.FY23, 2024: C.epsBeforeExceptional.FY24, 2025: C.epsBeforeExceptional.FY25, 2026: C.epsBeforeExceptional.FY26 - BAYSHORE_PS, 2027: epsU[0], 2028: epsU[1], 2029: epsU[2] };
const epsCoBase = { ...epsBase, 2026: C.epsBeforeExceptional.FY26 };
const epsRepAll = { ...epsRep, 2027: epsU[0], 2028: epsU[1], 2029: epsU[2] };
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
// Trough rule (PLAYBOOK §4): forward EPS a loss or below half the highest EPS of the previous three years
const troughOn = by => fy => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); const pk = Math.max(...prev); return !(by[fy] > 0) || by[fy] < 0.5 * pk; };
const troughList = by => [2022, 2023, 2024, 2025, 2026, 2027, 2028].filter(troughOn(by)).map(y => `FY${String(y).slice(2)}`);
const TROUGH_BASE = troughList(epsBase), TROUGH_REP = troughList(epsRepAll);
const troughRow = by => [2023, 2024].map(fy => ({ fy, eps: by[fy], peak: Math.max(by[fy - 1], by[fy - 2], by[fy - 3]), half: 0.5 * Math.max(by[fy - 1], by[fy - 2], by[fy - 3]) }));

// 6) Forward P/E history on every weekly close (+ the 30-Sep close): price ÷ the next full fiscal year's EPS
const px = RAW.charts.price.Price.filter(([d]) => d >= '2021-04-01' && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const seriesOn = (by, from, to = ASOF) => px.filter(([d]) => d >= from && d <= to).map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10]);
const stat = s => { const v = s.map(x => x[1]); return { med: medOf(v), p25: pctl(v, 0.25), p75: pctl(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }; };
const sBase = seriesOn(epsBase, DEAL_DAY), HB = stat(sBase); // BASE: since the Unichem deal, EPS before exceptional items and one-offs
const HR = stat(seriesOn(epsRepAll, DEAL_DAY)); // reported EPS, same window
const HC = stat(seriesOn(epsCoBase, DEAL_DAY)); // company's EPS before exceptional items (FY26 incl. the Bayshore gain)
const sPre = seriesOn(epsBase, '2022-04-01', '2023-04-24'), HPRE = stat(sPre); // pre-deal year: not a trough on this basis, excluded for consistency
const H22 = stat(seriesOn(epsBase, '2022-04-01')); // trough rule alone on the base EPS (window from Apr-2022)
const HALL = stat(seriesOn(epsBase, '2021-04-01')); // whole window, no trough exclusion
const yearWin = [['2023-04-25', '2024-03-31', 'FY25'], ['2024-04-01', '2025-03-31', 'FY26'], ['2025-04-01', '2026-03-31', 'FY27E'], ['2026-04-01', ASOF, 'FY28E']].map(([a, z, fy]) => ({ a, z, fy, ...stat(seriesOn(epsBase, a, z)) }));
const FM = forwardMedian('IPCALAB', M); // house function: reported EPS, every 5th week, trough years left out
const fwdNow = price / epsU[1], fwdNow27 = price / epsU[0], fwdNowSep = price / epsSep;
const trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;

// 7) Sector factor (PLAYBOOK §7c, A20): eight peers' trailing P/E at the 30-Sep close vs five-year medians, excluding Ipca
const PEER_SET = D.peers.set, EXCL = Object.keys(D.peers.excluded), USED = PEER_SET.filter(s => s !== 'IPCALAB');
const PEERS = peersAsOf([...PEER_SET, ...EXCL, 'MANKIND'], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const ser = (sym, a, k2) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.[a]?.[k2] || [];
const med5 = (sym, a, k2) => pctl(ser(sym, a, k2).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5);
const MED5 = Object.fromEntries([...PEER_SET, ...EXCL].map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const dr5 = Object.fromEntries([...PEER_SET, ...EXCL].map(s => [s, (P[s].pe / MED5[s] - 1) * 100]));
const MED5EV = Object.fromEntries(PEER_SET.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const dr5ev = Object.fromEntries(PEER_SET.map(s => [s, (P[s].evEbitda / MED5EV[s] - 1) * 100]));
const sectorCalc = medOf(USED.map(s => dr5[s])), sectorAll9 = medOf(PEER_SET.map(s => dr5[s])), sectorAll = medOf([...PEER_SET, ...EXCL].filter(s => s !== 'IPCALAB').map(s => dr5[s]));
const SECTOR = 10.25, k = 1 + SECTOR / 100; // set in PLAYBOOK §7c (A20: IPCALAB +10.25%); our reproduction is sectorCalc
const sectorEv = medOf(USED.map(s => dr5ev[s])), kev = 1 + Math.round(sectorEv * 100) / 10000; // EV/EBITDA analogue (cross-check only)
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma' }[s] || s);

// 8) Target multiples (derived): base = median x factor; bull / bear = 75th / 25th percentile x factor; nearest half-turn.
//    The model's EPS is already EPS to shareholders on the same basis as the history (forecasts carry no exceptional items),
//    so the engine multiple is the derived multiple itself.
const MULT = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };
const multRep = half(HR.med * k), multCo = half(HC.med * k), mult22 = half(H22.med * k), multAll = half(HALL.med * k), multHouse = half(FM.median * k), multNoK = half(HB.med), multOwnMid = half(HB.med * (1 + (SECTOR + dr5.IPCALAB) / 2 / 100));
const EPSC = { base: epsSep, bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) }; // scenario EPS are rounded to ₹0.1 in the model JSON

// 9) Forward EV/EBITDA history since the deal (cross-check; ICICI Direct's method): EV = price x 25.37 cr + Screener net
//    debt at the latest March published by end-May (incl. leases; the minorities' claim is excluded, as in Screener's
//    EV); EBITDA = the next full fiscal year's (FY25-26 actual, FY27-28E ours). Applied to Sep-28E EBITDA plus the
//    engine's Sep-28E net cash (engine roll).
const bs = RAW.tables['balance-sheet'], cashSch = RAW.schedules['balance-sheet']['Other Assets']['Cash Equivalents'];
const ndFy = fy => { const j = bs.periods.indexOf(`Mar ${fy}`); return bs.rows.Borrowings[j] - (cashSch[`Mar ${fy}`] || 0) - bs.rows.Investments[j]; };
const ebBy = {}; pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) ebBy[+p.slice(-4)] = pl.rows['Operating Profit'][i]; });
YRS.forEach((y, i) => (ebBy[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const fwdEv = px.filter(([d]) => d >= DEAL_DAY).map(([d, p]) => { let fyBs = +d.slice(0, 4); if (d < `${fyBs}-05-31`) fyBs -= 1; return [d, Math.round((p * SH_ACT + ndFy(Math.min(fyBs, 2026))) / ebBy[fyOf(d)] * 10) / 10]; });
const HEV = stat(fwdEv);
const EVM = { base: half(HEV.med * kev), bull: half(HEV.p75 * kev), bear: half(HEV.p25 * kev) };
const EVM_PEFACTOR = half(HEV.med * k);
const ebitdaSep = sep(F.ebitda), treasSep = sep(F.treasury), evNowFwd = (mcap - nc0) / F.ebitda[1];
const icici18 = (18 * F.ebitda[1] + F.treasury[0]) / SHARES; // ICICI Direct's 18x FY28E EBITDA on our numbers (net cash Mar-27)

// 10) Unichem: the listed stake at the 30-Sep close (sensitivity: SOTP with the stake at market less 20%, PLAYBOOK §7c)
const uniShares = UD.sharesTotalCr, uniPx = CLOSES.UNICHEMLAB, uniMcap = uniShares * uniPx, stakeMv = uniMcap * UD.stakePct / 100, stakeNet = stakeMv * 0.8;
const uniSepPat = sep(TB.unichemPat), ipcaShareUniSep = uniSepPat * UD.stakePct / 100, exUniEpsSep = epsSep - ipcaShareUniSep / SHARES;
const sotpVal = MULT.base * exUniEpsSep + stakeNet / SHARES;
const uniAtOurMult = ipcaShareUniSep * MULT.base; // what the consolidated method implicitly pays for the stake
const uniPe = UNI.charts?.pe?.['Price to Earning']?.filter(([d]) => d <= ASOF).at(-1)?.[1];
const minMv = uniMcap * (100 - UD.stakePct) / 100; // the 47.33% Ipca does not own, at market

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const multOk = ['base', 'bull', 'bear'].every(c => PEM.multiple[c] === MULT[c]);
const evOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === EVM[c]);
if (!process.env.TP_NOCHECK) {
  if (!oiOk) throw new Error(`IPCALAB other income: build ${oiBuild} vs assumptions ${AS.otherIncome}; run TP_NOCHECK=1 node tools/authoring/IPCALAB.mult.js`);
  if (!intOk) throw new Error(`IPCALAB interest: build ${intBuild.map(x => x.toFixed(1))} vs assumptions ${AS.interest}`);
  if (!taxOk) throw new Error(`IPCALAB tax: build ${taxRateBuild} vs assumptions ${AS.taxRate}; run IPCALAB.mult.js`);
  if (!multOk || !evOk) throw new Error(`IPCALAB: assumptions multiples differ from the derivation (P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}); run IPCALAB.mult.js`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'pe').value; if (Math.abs(pv - MULT[c] * EPSC[c]) > (c === 'base' ? 1 : MULT[c] * 0.06)) throw new Error(`IPCALAB ${c} P/E value ${Math.round(pv)} != ${MULT[c]}x Sep-28E EPS`); if (tp !== Math.round(pv / 10) * 10) throw new Error(`IPCALAB ${c} target ${tp} is not the P/E value ${Math.round(pv)}`); });
}
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagr = (Math.pow(epsU[2] / epsBase[2026], 1 / 3) - 1) * 100, epsCagrRep = (Math.pow(epsU[2] / epsRep[2026], 1 / 3) - 1) * 100;
const ebitdaCagr = (Math.pow(F.ebitda[2] / A.ebitda[b], 1 / 3) - 1) * 100;

// 11) Street as it stood on 30-Sep-2026
const ST = D.street.brokers, byB = n => ST.find(s => s.broker === n);
const mosl = byB('Motilal Oswal'), pl_ = byB('Prabhudas Lilladher'), idir = byB('ICICI Direct'), emkay = byB('Emkay Global'), choice = byB('Choice Institutional Equities'), jm = byB('JM Financial'), nuv = byB('Nuvama'), nom = byB('Nomura'), axis = byB('Axis Capital'), hsie = byB('HDFC Securities'), shk = byB('Sharekhan');
const withTp = ST.filter(s => s.tp), postQ1 = ST.filter(s => s.date >= '2026-08-13' && s.tp), medTp = medOf(withTp.map(s => s.tp)), medPost = medOf(postQ1.map(s => s.tp));
const methodCount = ST.reduce((o, s) => { const m = s.method || 'n.d.'; o[m] = (o[m] || 0) + 1; return o; }, {});

module.exports = { ROOT, RD, C, D, SG, M, RAW, UNI, F, V, A, AS, SC, ASOF, ASOF_TXT, DEAL_DAY, n0, n1, n2, pc, pc1, rup, half, shortDate, medOf, pctl, SA, SQ, QL, Q1, FY26, UD, b, YRS, sep, price, SHARES, mcap, PATCH,
  BL, LINES, LBL, build, buildTot, mixPct, expFormTot, TB, MIN, taxRateBuild, taxOnly, patPreMin, minPs, ASSOC_BOOK, UNI_DEBT, DEBT, cumMin, nc0, grossCash, TY, MISC, JV, oiTreas, oiBuild, OI26, ttmOi, netCashOwn, UNI_INT, KD, LEASE_INT, OTHER_FIN, LEASE_IPCA, intBuild,
  epsU, epsSep, epsRep, excAt, BAYSHORE_PS, epsBase, epsCoBase, epsRepAll, fyOf, TROUGH_BASE, TROUGH_REP, troughRow, sBase, HB, HR, HC, HPRE, H22, HALL, yearWin, FM, fwdNow, fwdNow27, fwdNowSep, trailEps, trailPe,
  PEER_SET, EXCL, USED, PEERS, P, MED5, dr5, MED5EV, dr5ev, sectorCalc, sectorAll9, sectorAll, SECTOR, k, sectorEv, kev, shortName, MULT, multRep, multCo, mult22, multAll, multHouse, multNoK, multOwnMid, EPSC,
  fwdEv, HEV, EVM, EVM_PEFACTOR, ebitdaSep, treasSep, evNowFwd, icici18, uniShares, uniPx, uniMcap, stakeMv, stakeNet, uniSepPat, ipcaShareUniSep, exUniEpsSep, sotpVal, uniAtOurMult, uniPe, minMv,
  BM, mv, multOk, evOk, rating, buyBelow, sellAbove, epsCagr, epsCagrRep, ebitdaCagr, ST, mosl, pl_, idir, emkay, choice, jm, nuv, nom, axis, hsie, shk, withTp, postQ1, medTp, medPost, methodCount };

if (require.main === module) {
  console.log('build', buildTot.map(n0), 'model', F.sales.map(n0), '| dom mix', mixPct('domForm').map(x => x.toFixed(1)));
  console.log('tax build', taxRateBuild, 'vs', AS.taxRate, taxOk, '| PBT', F.pbt.map(n0), 'min', MIN);
  console.log('gross cash', grossCash.map(n0), 'OI build', oiBuild, 'vs', AS.otherIncome, oiOk, '| treas', oiTreas.map(x => x.toFixed(1)), 'TTM OI', ttmOi, '| net cash own', netCashOwn.map(n0), 'engine', F.treasury.map(n0));
  console.log('interest build', intBuild.map(x => x.toFixed(1)), 'vs', AS.interest, intOk);
  console.log('EPS model', epsU.map(n2), 'Sep-28E', n2(epsSep), '| base', JSON.stringify(Object.fromEntries(Object.entries(epsBase).map(([a, c]) => [a, +c.toFixed(2)]))));
  console.log('trough base', TROUGH_BASE, 'rep', TROUGH_REP, JSON.stringify(troughRow(epsBase)), JSON.stringify(troughRow(epsRepAll)));
  console.log('hist base', JSON.stringify(HB), '| rep', JSON.stringify(HR), '| co', JSON.stringify(HC), '| pre-deal', JSON.stringify(HPRE), '| from Apr-22', JSON.stringify(H22), '| all', JSON.stringify(HALL), '| house', FM.median, FM.medianAll, FM.troughYears);
  console.log('by year', yearWin.map(w => `${w.fy} ${w.med}`).join(' | '), '| now fwd FY28E', n1(fwdNow), 'FY27E', n1(fwdNow27), 'trail', n1(trailPe));
  console.log('sector calc', sectorCalc.toFixed(3), 'all9', sectorAll9.toFixed(3), 'all', sectorAll.toFixed(3), USED.map(s => `${s} ${P[s].pe}/${MED5[s]}=${dr5[s].toFixed(2)}`).join('; '), '| Ipca', dr5.IPCALAB.toFixed(2));
  console.log('EV factor', sectorEv.toFixed(2), kev, '| EV hist', JSON.stringify(HEV), 'EVM', JSON.stringify(EVM), 'alt', EVM_PEFACTOR, 'evNowFwd', n1(evNowFwd));
  console.log('MULT', MULT, 'ok?', multOk, evOk, '| sens rep', multRep, 'co', multCo, 'Apr22', mult22, 'all', multAll, 'house', multHouse, 'noK', multNoK, 'mid', multOwnMid);
  console.log('Unichem mcap', n0(uniMcap), 'stake', n0(stakeMv), 'net', n0(stakeNet), 'ex-Uni EPS', n2(exUniEpsSep), 'SOTP', n0(sotpVal), 'uni at our mult', n0(uniAtOurMult), 'uniPe', uniPe, 'minMv', n0(minMv));
  console.log('TP', V.tp, 'upside', V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'scen', SC.bull.tp, SC.bear.tp, '| ICICI18', n0(icici18), 'methods', JSON.stringify(methodCount), 'medTp', medTp, medPost);
}
