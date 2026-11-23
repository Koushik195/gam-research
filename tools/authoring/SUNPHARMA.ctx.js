// Sun Pharma initiation: shared context for the Part B files (research.js, part2-6) and SUNPHARMA.sotp.js. Loads the
// research JSONs and the built model; checks the business-line build against model revenue; computes the forward P/E
// history (house forwardMedian on reported EPS, plus the same median on the company's adjusted EPS before exceptional
// items, which is the like-for-like basis for our pre-exceptional forecasts), the pharma sector factor (PLAYBOOK §7c),
// the derived multiples, the Organon sum-of-the-parts adjustment (pending deal valued at cost), the EV/EBITDA cross-check,
// the other-income build and the street table once. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'SUNPHARMA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'SUNPHARMA.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'SUNPHARMA', 'screener.json'), 'utf8'));
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s ?? '').replace(/Rs ?(?=[0-9])/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const cagr = (a, b, y) => (Math.pow(b / a, 1 / y) - 1) * 100;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const SRC = 'Sun Pharma presentations, calls and annual reports; Screener.in; GAM Research';
const b = A.labels.length - 1; // FY26 index
const ai = y => A.labels.indexOf(y);
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), Q1 = C.q1fy27, FY26 = C.fy26;
const yr = fy => SA.find(a => a.fy === fy);
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = 1/2 FY28E + 1/2 FY29E
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };

// ---------------------------------------------------------------- 1) Business-line build vs model revenue
const BL = AS.businessLines, LINES = ['india', 'us', 'em', 'row', 'api', 'other'];
const LINE_NAME = { india: 'India formulations', us: 'US formulations', em: 'Emerging Markets', row: 'Rest of World', api: 'API', other: 'Other sales and operating revenue' };
const build = Object.fromEntries(LINES.map(k => { let v = BL.base[k]; return [k, [v, ...BL.growth[k].map(g => (v *= 1 + g / 100))]]; }));
const buildTot = [0, 1, 2, 3].map(i => LINES.reduce((t, k) => t + build[k][i], 0));
const buildGap = [0, 1, 2].map(i => buildTot[i + 1] / F.sales[i] - 1);
if (Math.abs(buildTot[0] / A.sales[b] - 1) > 0.002 || buildGap.some(g => Math.abs(g) > 0.005)) throw new Error(`SUNPHARMA build check failed: base ${n0(buildTot[0])} vs ${n0(A.sales[b])}; gaps ${buildGap.map(g => (g * 100).toFixed(2) + '%').join(' ')}`);
const UL = BL.usdLines, usd = (b0, g) => { let v = b0; return [v, ...g.map(x => (v *= 1 + x / 100))]; };
const usdBuild = { us: usd(UL.usFy26M, UL.usGrowth), em: usd(UL.emFy26M, UL.emGrowth), row: usd(UL.rowFy26M, UL.rowGrowth) };
const indiaShare = i => build.india[i] / buildTot[i] * 100;

// ---------------------------------------------------------------- 2) Forward P/E history
const FM = forwardMedian('SUNPHARMA', M); // house rule: reported EPS, trough years excluded
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const EPS_ADJ = {}; SA.forEach(a => (EPS_ADJ[2000 + +a.fy.slice(2)] = a.adjEps));
F.years.forEach((y, i) => (EPS_ADJ[2000 + +y.slice(2, 4)] = F.eps[i]));
const pxAt = d => S.charts.price.Price.find(x => x[0] === d)?.[1];
const fwdAdj = FM.series.map(([d]) => [d, Math.round(pxAt(d) / EPS_ADJ[fyOf(d)] * 10) / 10]).filter(x => x[1] > 0);
const adjVals = fwdAdj.map(x => x[1]), houseVals = FM.series.map(x => x[1]);
const ADJ = { med: pct(adjVals, 0.5), p25: pct(adjVals, 0.25), p75: pct(adjVals, 0.75), min: Math.min(...adjVals), max: Math.max(...adjVals) };
const HOUSE = { med: FM.median, p25: pct(houseVals, 0.25), p75: pct(houseVals, 0.75) };
const byFy = ser => { const o = {}; ser.forEach(([d, v]) => (o[fyOf(d)] ||= []).push(v)); return Object.fromEntries(Object.entries(o).map(([k, v]) => [`FY${String(k).slice(2)}`, pct(v, 0.5)])); };
const adjByFy = byFy(fwdAdj);
const fwdPe = forwardSeries('SUNPHARMA', M, 'eps').filter(x => x[0] >= '2016-04-01');
const fwdNow = price / F.eps[1], fwdNowSep = price / sep(F.eps);

// ---------------------------------------------------------------- 3) Pharma sector factor (PLAYBOOK §7c)
const PEER_SYMS = D.peers.list, ALL15 = D.peers.allFifteen;
const PEERS = peersAsOf(ALL15, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5); };
const MED5 = Object.fromEntries(ALL15.map(s => [s, med5(s)]));
const derate = Object.fromEntries(ALL15.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const USED = D.peers.set, EXCL = Object.keys(D.peers.excluded);
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(ALL15.filter(s => s !== 'SUNPHARMA').map(s => derate[s]));
const SET_FACTOR = 10.25; // PLAYBOOK §7c, settled 23-Nov-2026: apply as set
if (Math.abs(sectorDr - SET_FACTOR) > 0.05) console.warn(`WARNING: derived pharma factor ${sectorDr.toFixed(2)}% differs from the settled +10.25%`);
const k = 1 + SET_FACTOR / 100;
const ownDr = derate.SUNPHARMA;
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma' }[s] || s);

// ---------------------------------------------------------------- 4) Derived P/E multiples (standalone Sun)
const MULT = { base: half(ADJ.med * k), bull: half(ADJ.p75 * k), bear: half(ADJ.p25 * k) };
const houseMult = half(HOUSE.med * k); // sensitivity: reported-EPS median
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };

// ---------------------------------------------------------------- 5) Organon: pending deal valued at cost (sum of the parts)
const OG = AS.organon, fx = OG.fx;
const cashUsedCr = OG.cashUsedUsdBn * fx * 100, cashUsedPs = cashUsedCr / shares;
const yld = AS.treasuryYield[1] / 100, tax = AS.taxRate[1] / 100;
const cashIncPs = cashUsedCr * yld * (1 - tax) / shares; // after-tax treasury income on the deal cash, inside standalone EPS
const dealMult = OG.dealEvUsdBn * 1000 / OG.ebitda2025UsdM; // 6.16x
const synergyPs = OG.synergiesUsdM * dealMult / Math.pow(1 + V.ke / 100, OG.synergyDiscountYears) * fx / 10 / shares; // $mn x Rs/$ / 10 = Rs cr
const shortfallPs = OG.ebitda2026GuideUsdM * OG.bearEbitdaShortfallPct / 100 * dealMult * fx / 10 / shares;
const ORG = Object.fromEntries(['base', 'bull', 'bear'].map(c => {
  const cashAdj = cashUsedPs - MULT[c] * cashIncPs; // cash leaves at face value; standalone P/E had capitalised its income
  const extra = c === 'bull' ? synergyPs : c === 'bear' ? -shortfallPs : 0;
  const standalone = MULT[c] * epsSep[c], adj = cashAdj + extra, total = standalone + adj;
  return [c, { mult: MULT[c], eps: epsSep[c], standalone, cashAdj, extra, adj, total, implied: total / epsSep[c] }];
}));
const pfEbitdaCr = OG.ebitda2026GuideUsdM * fx / 10; // Organon EBITDA in Rs cr at the as-of rupee
const evPaidCr = OG.dealEvUsdBn * fx * 100, equityPaidCr = OG.equityUsdBn * fx * 100;
// Illustrative pro-forma FY28E (first full year): Organon EBITDA at guidance (flat) + 1/3 of synergies; interest on ~$9.5 bn of net debt at
// Organon's ~5.5% cost (incl. the $1.75 bn of new debt for the equity); Sun loses the yield on the cash used; Organon depreciation ~$75 mn
// (implied by its 2025 adjusted net income); PPA amortisation not estimated (shown separately); tax at Sun's FY28E rate.
const PF = (() => { const ebitda = (OG.ebitda2026GuideUsdM + OG.synergiesUsdM / 3) * fx / 10, dep = 75 * fx / 10, int = 9.5 * 0.055 * fx * 100, lost = cashUsedCr * yld;
  const pbt = ebitda - dep - int - lost, pat = pbt * (1 - tax); return { ebitda, dep, int, lost, pbt, pat, eps: pat / shares, accretion: pat / F.pat[1] * 100 }; })();

// ---------------------------------------------------------------- 6) EV/EBITDA cross-check: own trailing median x factor, restated to Sep-28E
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25), evP75 = pct(evHist, 0.75);
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda);
const evMULT = { base: half(evMed * k * ttmEbitda / ebitdaSep28), bull: half(evP75 * k * ttmEbitda / ebitdaSep28), bear: half(evP25 * k * ttmEbitda / ebitdaSep28) };

// ---------------------------------------------------------------- 7) Other-income build (model) and reconciliation
const OI = F.years.map((y, i) => { const treas = F.otherIncome[i] - AS.otherIncome[i], open = i ? F.treasury[i - 1] : A.cash[b] + A.investments[b] - A.borrowings[b];
  return { y, open, treas, recurring: 150, forex: i === 0 ? 122 : 0, assoc: -100, total: F.otherIncome[i] }; });
OI.forEach(r => { if (Math.abs(r.recurring + r.forex + r.assoc - AS.otherIncome[F.years.indexOf(r.y)]) > 0.5) throw new Error('SUNPHARMA other-income build does not match assumptions'); });
const OIN = C.otherIncomeNote, ttmOiExFx = SQ.slice(-4).length && [470, 579, 458, 724].reduce((s, x) => s + x, 0); // Screener quarterly 'Other income normal' (before exceptional items and forex), Q2FY26-Q1FY27

// ---------------------------------------------------------------- 8) Rating, street
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-07-31' && s.tp);
const medTp = medOf(postQ1.map(s => s.tp)), avgTp = postQ1.reduce((t, s) => t + s.tp, 0) / postQ1.length;
const CONS = D.street.consensus;
const epsCagrHist = cagr(yr('FY23').adjEps, yr('FY26').adjEps, 3), epsCagrFwd = cagr(A.eps[b], F.eps[2], 3);
const divYield = F.dps[0] / price * 100;
const netCash26 = A.cash[b] + A.investments[b] - A.borrowings[b];

module.exports = { fs, path, ROOT, RD, C, D, SG, M, F, V, A, AS, SC, S, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, cagr, shortDate, SRC, b, ai, SA, SQ, QL, Q1, FY26, yr,
  price, shares, mcap, sep, medOf, pct, BL, LINES, LINE_NAME, build, buildTot, buildGap, usdBuild, indiaShare,
  FM, fyOf, EPS_ADJ, fwdAdj, ADJ, HOUSE, adjByFy, fwdPe, fwdNow, fwdNowSep,
  PEER_SYMS, ALL15, PEERS, P, MED5, derate, USED, EXCL, sectorDr, sectorDrAll, SET_FACTOR, k, ownDr, shortName,
  MULT, houseMult, epsSep, OG, fx, cashUsedCr, cashUsedPs, cashIncPs, dealMult, synergyPs, shortfallPs, ORG, pfEbitdaCr, evPaidCr, equityPaidCr, PF,
  evHist, evMed, evP25, evP75, ttmEbitda, ebitdaSep28, evMULT, OI, OIN, ttmOiExFx,
  BM, mv, rating, ruleText, buyBelow, sellAbove, ST, postQ1, medTp, avgTp, CONS, epsCagrHist, epsCagrFwd, divYield, netCash26 };
