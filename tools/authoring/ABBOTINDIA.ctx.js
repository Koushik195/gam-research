// Abbott India initiation: shared context for the Part B files (research.js, part2-6) and ABBOTINDIA.mult.js. Loads the
// research JSONs and the built model and computes, once: the business-line build (own brands vs Novo partner brands,
// checked against model revenue), the other-income build (treasury yield on the company's net cash + recurring items,
// checked against the engine), the house forward P/E median (forwardMedian, reported EPS; exceptional items are
// immaterial) with its sensitivities, the pharma sector factor (PLAYBOOK §7c: set at +10.25% for ABBOTINDIA, reproduced
// per peer at the 30-Sep close), the EV/EBITDA analogue, our own EV/EBITDA history (operating EBITDA, all treasury
// deducted: Screener's series includes other income and ignores long deposits), the derived multiples, the street and
// the rating. As of 30-Sep-2026 (Q1FY27 basis). Data after 30-Sep-2026 is never read: Screener series are cut at the
// as-of date and quarterly data at its release date.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ABBOTINDIA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ABBOTINDIA.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'ABBOTINDIA', 'screener.json'), 'utf8')); // raw: always cut at ASOF below
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const pc2 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}%`;
const rup = s => String(s ?? '').replace(/Rs ?(?=[0-9])/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const cagr = (a, b, y) => (Math.pow(b / a, 1 / y) - 1) * 100;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pctl = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const statOf = arr => ({ med: pctl(arr, 0.5), p25: pctl(arr, 0.25), p75: pctl(arr, 0.75), min: Math.min(...arr), max: Math.max(...arr), n: arr.length });
const SRC = 'Abbott India annual reports and results filings; Screener.in; GAM Research';
const b = A.labels.length - 1; // FY26 index
const ix = fy => A.labels.indexOf(fy);
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26, TR = C.treasury;
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const fyOf = d => { const t = new Date(d); return t.getMonth() >= 3 ? t.getFullYear() + 2 : t.getFullYear() + 1; };
const MON_END = { Mar: 2, Jun: 5, Sep: 8, Dec: 11 };
const releasedBy = (qEnd, asOf) => { const dt = new Date(qEnd); dt.setUTCDate(dt.getUTCDate() + (dt.getUTCMonth() === 2 ? 60 : 45)); return dt.toISOString().slice(0, 10) <= asOf; };

// ---------------------------------------------------------------- 1) Business-line build (assumptions.businessLines) = model revenue
const BL = AS.businessLines, LINES = ['own', 'partner'];
const LBL = { own: 'Own brands (incl. services to affiliates)', partner: 'Novo Nordisk partner brands' };
const build = Object.fromEntries(LINES.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => build.own[i] + build.partner[i]);
if (Math.abs(BL.base.own + BL.base.partner - A.sales[b]) > 1) throw new Error(`ABBOTINDIA business-line base ${BL.base.own + BL.base.partner} != FY26 revenue ${A.sales[b]}`);
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`ABBOTINDIA build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });
const ownShare = i => build.own[i] / buildTot[i] * 100;
const OWN_M = BL.ownMarginNote;

// ---------------------------------------------------------------- 2) Other income: treasury yield x opening net cash + recurring items
const netCash26 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - A.borrowings[b];
if (Math.abs(netCash26 - (TR.mar26.total - FY26.leaseLiabilities)) > 2) throw new Error(`ABBOTINDIA opening net cash ${n0(netCash26)} != company ${TR.mar26.total} - leases ${FY26.leaseLiabilities}`);
const openCash = YRS.map((_, i) => (i ? F.treasury[i - 1] : netCash26));
const oiTreas = YRS.map((_, i) => AS.treasuryYield[i] / 100 * openCash[i]);
YRS.forEach((y, i) => { if (Math.abs(oiTreas[i] + AS.otherIncome[i] - F.otherIncome[i]) > 1) throw new Error(`ABBOTINDIA other-income build ${y}`); });
const OIN = C.otherIncomeNote, oi26 = OIN.fy26, oi25 = OIN.fy25;
const recur26 = oi26.securityDepositInterest + oi26.otherInterest + oi26.rent + oi26.writtenBack + oi26.insuranceClaims + oi26.others;
const oneOff26 = oi26.taxRefundInterest + oi26.ppeGain + oi26.fxGain;
const avgDep26 = (TR.mar25.total + TR.mar26.total) / 2, yield26 = TR.fdInterestFy26 / avgDep26 * 100;
const OIQ = S.schedules.quarters['Other Income']['Other income normal'];
const ttmOi = ['Sep 2025', 'Dec 2025', 'Mar 2026', 'Jun 2026'].reduce((s, p) => s + (OIQ[p] || 0), 0); // twelve months to Jun-26

// ---------------------------------------------------------------- 3) One-year-forward P/E: house median (reported EPS) + sensitivities
const FM = forwardMedian('ABBOTINDIA', M); // every 5th week since Apr-2021; trough years excluded (none expected)
const HR = statOf(FM.series.map(x => x[1]));
const pl = S.tables['profit-loss'], nps = S.schedules['profit-loss']['Net Profit'];
const epsRep = {}, epsEx = {}, EXC = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4), e = pl.rows['EPS in Rs'][i], sh = nps['Profit for EPS'][p] / e; epsRep[y] = e; EXC[y] = nps['Exceptional items AT'][p] || 0; epsEx[y] = e - EXC[y] / sh; } });
YRS.forEach((y, i) => { epsRep[2000 + +y.slice(2, 4)] = F.eps[i]; epsEx[2000 + +y.slice(2, 4)] = F.eps[i]; });
const PX = S.charts.price.Price.filter(([d]) => d <= ASOF); if (PX.at(-1)[0] < ASOF) PX.push([ASOF, price]);
const fwdOn = (by, pts) => pts.filter(([d]) => d >= '2021-04-01').map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10]);
const every5 = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0);
const sEx = fwdOn(epsEx, every5), sAllWk = fwdOn(epsRep, PX);
const HX = statOf(sEx.map(x => x[1])), HW = statOf(sAllWk.map(x => x[1]));
const byFwdFy = {}; FM.series.forEach(([d, x]) => (byFwdFy[fyOf(d)] ||= []).push(x));
const FWDFY = Object.keys(byFwdFy).sort().map(fy => ({ fy: `FY${String(fy).slice(2)}`, med: pctl(byFwdFy[fy], 0.5), n: byFwdFy[fy].length, eps: epsRep[fy] }));
const fwdPe = forwardSeries('ABBOTINDIA', M, 'eps').filter(x => x[0] >= '2016-04-01');
const sinceApr21 = sAllWk; // all weekly points since Apr-2021 incl. the as-of close (chart)
const peFY27 = price / F.eps[0], peFY28 = price / F.eps[1], peSep28 = price / sep(F.eps);
const ttmEps = A.ttm?.eps ?? M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), peTtm = price / ttmEps;
const fwdNowVsMed = (peFY28 / HR.med - 1) * 100;
const troughCheck = [2022, 2023, 2024, 2025, 2026, 2027, 2028].map(fy => ({ fy: `FY${String(fy).slice(2)}`, eps: epsRep[fy], peak3: Math.max(epsRep[fy - 1], epsRep[fy - 2], epsRep[fy - 3]), ratio: epsRep[fy] / Math.max(epsRep[fy - 1], epsRep[fy - 2], epsRep[fy - 3]) }));

// ---------------------------------------------------------------- 4) Sector factor (PLAYBOOK §7c): eight peers ex-Abbott, trailing P/E at the 30-Sep close vs five-year median
const ALL15 = ['SUNPHARMA', 'DIVISLAB', 'TORNTPHARM', 'ZYDUSLIFE', 'CIPLA', 'AUROPHARMA', 'ALKEM', 'IPCALAB', 'ABBOTINDIA', 'LUPIN', 'GLENMARK', 'BIOCON', 'LAURUSLABS', 'DRREDDY', 'MANKIND'];
const PEERS = peersAsOf(ALL15, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const rawOf = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
const med5 = (sym, key, sub) => { const X = rawOf(sym); return pctl((X.charts?.[key]?.[sub] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(ALL15.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const MED5EV = Object.fromEntries(ALL15.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const derate = Object.fromEntries(ALL15.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const derateEv = Object.fromEntries(ALL15.map(s => [s, P[s].evEbitda && MED5EV[s] ? (P[s].evEbitda / MED5EV[s] - 1) * 100 : null]));
const SET = D.peers.set, USED = SET.filter(s => s !== 'ABBOTINDIA'), EXCL = Object.keys(D.peers.excluded);
const sectorCalc = medOf(USED.map(s => derate[s])), sectorEv = medOf(USED.map(s => derateEv[s]));
const sectorAll = medOf(ALL15.filter(s => s !== 'ABBOTINDIA' && derate[s] != null).map(s => derate[s]));
const SET_FACTOR = D.peers.factorSet; // +10.25%, PLAYBOOK §7c (A20): applied as set
const FACTOR_DIFF = Math.abs(sectorCalc - SET_FACTOR) > 0.05;
if (FACTOR_DIFF) console.warn(`WARNING: reproduced pharma factor ${sectorCalc.toFixed(2)}% differs from the settled +${SET_FACTOR}%`);
const k = 1 + SET_FACTOR / 100, kev = 1 + sectorEv / 100;
const ownDr = derate.ABBOTINDIA, ownDrEv = derateEv.ABBOTINDIA;
const LARGE = ['SUNPHARMA', 'DIVISLAB', 'TORNTPHARM', 'ZYDUSLIFE'], sectorLarge = medOf(LARGE.map(s => derate[s]));
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma' }[s] || s);

// ---------------------------------------------------------------- 5) Derived P/E multiples (base = house median x factor; bull/bear = 75th/25th percentile x factor)
const MULT = { base: half(HR.med * k), bull: half(HR.p75 * k), bear: half(HR.p25 * k) };
const derived = HR.med * k;
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const val = m => Math.round(m * epsSep.base / 10) * 10;
const epsCagrHist = cagr(epsRep[2021], epsRep[2026], 5), epsCagrFwd = cagr(epsRep[2026], F.eps[2], 3);
const keV = V.ke, roeSus = F.roe[2], gSus = 8.5, justPe = (1 - gSus / roeSus) / ((keV - gSus) / 100);
const pegWin = HR.med / epsCagrHist, pegMult = pegWin * epsCagrFwd;
const SENS = {
 preExc: half(HX.med * k), allWeeks: half(HW.med * k), noFactor: half(HR.med), own: half(HR.med * (1 + ownDr / 100)), mid: half(HR.med * (1 + (SET_FACTOR + ownDr) / 2 / 100)),
 all15: half(HR.med * (1 + sectorAll / 100)), large: half(HR.med * (1 + sectorLarge / 100)), peg: half(pegMult), gordon: half(justPe),
};

// ---------------------------------------------------------------- 6) Own EV/EBITDA history: (market value - company net cash) / trailing operating EBITDA
// Quarterly operating EBITDA = quarterly sales x OPM (Screener margins chart, before other income), counted only once released.
const QS = S.charts.margins['Quarter Sales'], QO = Object.fromEntries(S.charts.margins.OPM.map(([d, v]) => [d, v]));
const QE = QS.filter(([d]) => QO[d] != null).map(([d, s]) => [d, s * QO[d] / 100]);
// Company net cash at each March year-end (deposits incl. long-term, less lease liabilities), used from its release (+60 days).
// Mar-25 and Mar-26 from AR FY26; Mar-20 to Mar-24 approximated from Screener (cash equivalents + other asset items above ₹200 cr, less leases).
const bsv = (t, k2, yr) => { const T = S.tables['balance-sheet'], j = T.periods.indexOf(`Mar ${yr}`); return T.rows[k2][j]; };
const oai = yr => S.schedules['balance-sheet']['Other Assets']['Other asset items'][`Mar ${yr}`], ceq = yr => S.schedules['balance-sheet']['Other Assets']['Cash Equivalents'][`Mar ${yr}`];
const NC_YE = {};
[2020, 2021, 2022, 2023, 2024].forEach(y => (NC_YE[y] = ceq(y) + Math.max(0, oai(y) - 200) - bsv('balance-sheet', 'Borrowings', y)));
NC_YE[2025] = TR.mar25.total - bsv('balance-sheet', 'Borrowings', 2025); NC_YE[2026] = TR.mar26.total - FY26.leaseLiabilities;
const ncAt = d => { let v = null; for (const y of Object.keys(NC_YE).map(Number).sort()) if (`${y}-05-30` <= d) v = NC_YE[y]; return v; };
const ttmEbitdaAt = d => { const rel = QE.filter(([q]) => releasedBy(q, d)); if (rel.length < 4) return null; return rel.slice(-4).reduce((s, x) => s + x[1], 0); };
const evHist = PX.filter(([d]) => d >= '2021-04-01').map(([d, p]) => { const e = ttmEbitdaAt(d), nc = ncAt(d); return e && nc != null ? [d, Math.round((p * SHARES - nc) / e * 10) / 10] : null; }).filter(Boolean);
const HEV = statOf(evHist.map(x => x[1]));
const scrEv = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0), HEVS = statOf(scrEv.map(x => x[1]));
const EVM = { base: half(HEV.med * kev), bull: half(HEV.p75 * kev), bear: half(HEV.p25 * kev) };
const EVM_PEK = half(HEV.med * k), EVM_SCR = half(HEVS.med * kev);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), evNow = mcap - netCash26, evTtmNow = evNow / ttmEbitda, evFy28 = (mcap - F.treasury[0]) / F.ebitda[1];
const ebitdaT27 = (F.ebitda[0] + F.ebitda[1]) / 2, treasT27 = (F.treasury[0] + F.treasury[1]) / 2;

// ---------------------------------------------------------------- 7) Checks: assumptions carry the derived multiples; targets come from the P/E value
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const multOk = ['base', 'bull', 'bear'].every(c => PEM.multiple[c] === MULT[c]), evOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === EVM[c]);
if (!process.env.TP_NOCHECK) {
  if (!multOk || !evOk) throw new Error(`ABBOTINDIA: assumptions multiples differ from the derivation (P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}); run node tools/authoring/ABBOTINDIA.mult.js`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, X2]) => { const pv = X2.blend.methods.find(m => m.key === 'pe').value; if (tp !== Math.round(pv / 10) * 10) throw new Error(`ABBOTINDIA ${c} target ${tp} is not the P/E value ${Math.round(pv)}`); });
}

// ---------------------------------------------------------------- 8) Rating (house rule, never typed), street on 30-Sep-2026
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, br = n => ST.find(s => s.broker === n);
const bob = br('BOB Capital Markets'), idir = br('ICICI Direct'), isec = br('ICICI Securities (institutional)');
const withTp = ST.filter(s => s.tp), medTp = medOf(withTp.map(s => s.tp)), avgTp = withTp.reduce((s, x) => s + x.tp, 0) / withTp.length;
const CONS = D.street.consensus;
const divYield = F.dps[0] / price * 100, fcfYield = F.fcf[1] / mcap * 100;
const bobAtOurs = 32 * sep(F.eps), idirAtOurs = 36 * F.eps[1];

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, pc2, rup, half, cagr, shortDate, medOf, pctl, statOf, SRC, b, ix, SA, SQ, QL, Q1, FY26, TR, YRS, sep, price, SHARES, mcap, BM, mv, fyOf,
  BL, LINES, LBL, build, buildTot, ownShare, netCash26, openCash, oiTreas, OIN, oi26, oi25, recur26, oneOff26, avgDep26, yield26, ttmOi,
  FM, HR, epsRep, epsEx, EXC, HX, HW, sEx, sAllWk, sinceApr21, FWDFY, fwdPe, peFY27, peFY28, peSep28, ttmEps, peTtm, fwdNowVsMed, troughCheck,
  ALL15, PEERS, P, MED5, MED5EV, derate, derateEv, SET, USED, EXCL, sectorCalc, sectorEv, sectorAll, SET_FACTOR, FACTOR_DIFF, k, kev, ownDr, ownDrEv, LARGE, sectorLarge, shortName,
  MULT, derived, epsSep, val, epsCagrHist, epsCagrFwd, keV, roeSus, gSus, justPe, pegWin, pegMult, SENS,
  QE, NC_YE, evHist, HEV, scrEv, HEVS, EVM, EVM_PEK, EVM_SCR, ttmEbitda, evNow, evTtmNow, evFy28, ebitdaT27, treasT27, multOk, evOk,
  rating, ruleText, buyBelow, sellAbove, ST, br, bob, idir, isec, withTp, medTp, avgTp, CONS, divYield, fcfYield, bobAtOurs, idirAtOurs };

if (require.main === module) {
  console.log('build', buildTot.map(n0), 'model', F.sales.map(n0), 'own share', YRS.map((_, i) => ownShare(i).toFixed(1)));
  console.log('net cash 26', n0(netCash26), 'OI treas', oiTreas.map(n0), 'total', F.otherIncome.map(n0), '| FY26 recur', recur26.toFixed(1), 'one-off', oneOff26.toFixed(1), 'yield26', yield26.toFixed(2), 'TTM OI', ttmOi);
  console.log('FM', FM.median, FM.medianAll, FM.troughYears, JSON.stringify(HR), '| preExc', JSON.stringify(HX), '| all weeks', JSON.stringify(HW));
  console.log('by fwd FY', FWDFY.map(f => `${f.fy} ${f.med}x (${f.n})`).join(', '), '| now FY28E', n1(peFY28), 'Sep-28E', n1(peSep28), 'TTM', n1(peTtm), 'vs med', n1(fwdNowVsMed));
  console.log('trough', troughCheck.map(t => `${t.fy} ${t.ratio.toFixed(2)}`).join(' '));
  console.log('factor calc', sectorCalc.toFixed(3), 'set', SET_FACTOR, 'EV', sectorEv.toFixed(3), 'all15', sectorAll.toFixed(2), 'large', sectorLarge.toFixed(2), 'own', ownDr.toFixed(2), 'ownEV', ownDrEv.toFixed(2));
  console.log(USED.map(s => `${s} ${P[s].pe}/${MED5[s]}=${derate[s].toFixed(2)} ev ${P[s].evEbitda}/${MED5EV[s]}=${derateEv[s].toFixed(2)}`).join('\n'));
  console.log('MULT', MULT, 'derived', derived.toFixed(2), 'SENS', SENS, 'gordon', justPe.toFixed(1), 'peg', pegWin.toFixed(2), pegMult.toFixed(1), 'eps cagr hist/fwd', epsCagrHist.toFixed(1), epsCagrFwd.toFixed(1));
  console.log('NC_YE', JSON.stringify(NC_YE), 'EV own', JSON.stringify(HEV), 'scr', JSON.stringify(HEVS), 'EVM', EVM, 'alt', EVM_PEK, EVM_SCR, 'now ttm', n1(evTtmNow), 'fy28', n1(evFy28));
  console.log('TP', V.tp, 'upside', V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${m.mult} ${Math.round(m.value)}`).join(' | '), 'scen', SC.bull.tp, SC.bear.tp, 'ok', multOk, evOk, 'eps', F.eps.map(n1), 'sep', n1(epsSep.base));
}
