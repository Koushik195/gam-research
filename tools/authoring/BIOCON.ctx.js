// Biocon initiation: shared context, part 1. Loads the research JSONs and the built model and computes, once: the
// segment build (revenue and EBITDA, checked against the model), Syngene's P&L and the minority deduction inside other
// income (checked against assumptions), our own net-debt path (the engine counts Syngene's minorities in its liabilities,
// so its working-capital ratio is too low; it also keeps minorities' retained profit out of cash), the interest check,
// the pharma P/E and EV/EBITDA sector factors (PLAYBOOK §7c, BIOCON outside the nine-name set), and the own-history
// multiples: (a) biosimilars from Biocon's look-through forward EV/EBITDA since Apr-2023 (Syngene stake out at market
// less 20%, generics out at the Aurobindo multiple, BBL minorities taken pro rata), (b) generics from Aurobindo's forward
// EV/EBITDA since Apr-2021 (stated peer basis), (c) Biocon's consolidated EV/EBITDA (cross-check). As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian, forwardSeries } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'BIOCON', 'research');
const rdj = f => { try { return JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8')); } catch { return {}; } };
const C = rdj('company.json'), D = rdj('deep.json'), SG = rdj('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'BIOCON.json'), 'utf8'));
const scr = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const S = scr('BIOCON'), SYN = scr('SYNGENE'), AUR = scr('AUROPHARMA');
const MA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'AUROPHARMA.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s ?? '').replace(/Rs ?(?=[0-9])/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const at = (series, d) => { let v = null; for (const [x, y] of series) { if (x <= d) v = y; else break; } return v; };
const SRC = 'Biocon annual reports, results filings and earnings calls; Syngene and Aurobindo data from Screener.in; GAM Research';
const b = A.labels.length - 1, YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; }; // next full fiscal year

// 1) Segment build: revenue and EBITDA (before other income) must equal the model
const BL = AS.businessLines, MG = BL.margin, SEGS = ['biosimilars', 'generics', 'services'];
const SEG_NAME = { biosimilars: 'Biosimilars', generics: 'Generics', services: 'Research services (Syngene)' };
const rev = Object.fromEntries(SEGS.map(k => { let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const revTot = YRS.map((_, i) => SEGS.reduce((s, k) => s + rev[k][i], 0));
const ebs = Object.fromEntries(SEGS.map(k => [k, YRS.map((_, i) => rev[k][i] * MG[k][i] / 100)]));
const corp = MG.corporate;
const ebTot = YRS.map((_, i) => SEGS.reduce((s, k) => s + ebs[k][i], 0) + corp[i]);
YRS.forEach((y, i) => {
  if (Math.abs(revTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`BIOCON revenue build ${y}: ${n0(revTot[i])} vs model ${n0(F.sales[i])}`);
  if (Math.abs(ebTot[i] / F.ebitda[i] - 1) > 0.004) throw new Error(`BIOCON EBITDA build ${y}: ${n0(ebTot[i])} vs model ${n0(F.ebitda[i])}`);
});
// FY24-FY26 segment EBITDA before other income (AR FY25/FY26 note 40, Rs cr) and external revenue
const SEGH = { FY24: { biosimilars: 2014.1, generics: 306.7, services: 1014.3, ext: { biosimilars: 8818.3, generics: 2500.1, services: 3437.3 } },
  FY25: { biosimilars: 1900.2, generics: 296.9, services: 1041.8, ext: { biosimilars: 8929.2, generics: 2746.8, services: 3585.7 } },
  FY26: { biosimilars: 2565.9, generics: 43.0, services: 918.5, ext: { biosimilars: 10379.8, generics: 2858.7, services: 3688.5 } } };

// 2) Syngene P&L and the minority deduction (assumptions.otherIncome = gross other income − minorities pre-tax)
const SY = AS.syngene, GROSS_OI = [220, 230, 240];
const synRev = YRS.map((_, i) => SY.revenue26 * rev.services[i] / BL.base.services);
const synEb = YRS.map((_, i) => synRev[i] * MG.services[i] / 100);
const synPbt = YRS.map((_, i) => synEb[i] - SY.dep[i] - SY.interest[i] + SY.otherIncome[i]);
const synPat = synPbt.map(p => p * (1 - SY.tax / 100));
const mi = synPat.map(p => p * SY.minority / 100), miPre = mi.map((m, i) => m / (1 - AS.taxRate[i] / 100));
const oiBuild = YRS.map((_, i) => GROSS_OI[i] - miPre[i]);
YRS.forEach((y, i) => { if (Math.abs(oiBuild[i] - AS.otherIncome[i]) > 3) throw new Error(`BIOCON other income ${y}: build ${oiBuild[i].toFixed(1)} vs assumptions ${AS.otherIncome[i]}`); });
const SYN_DPS = 1.25, miDiv = SY.shares * SYN_DPS * SY.minority / 100; // Syngene's FY26 dividend Rs1.25 (AR FY26)

// 3) Own net-debt path. Engine net debt (−treasury) + working capital the engine misses (its OWC ratio counts Syngene's
// minorities, Rs2,590 cr at Mar-26, as an operating liability: 6.0% of sales vs ~21% without them; we use 20% on extra sales)
// − minorities' retained share of Syngene profit (cash stays in the group). Gross cash and investments held at Mar-26.
const ND26 = A.borrowings[b] - A.cash[b] - A.investments[b]; // Rs10,461 cr (Screener basis, incl. Bicara at book)
const OWC_TRUE = ((A.otherAssets[b] - A.cash[b]) - (A.otherLiab[b] - 2590)) / A.sales[b] * 100, OWC_INC = 20;
const extraWc = YRS.map((_, i) => (OWC_INC - F.owcPct) / 100 * (F.sales[i] - (i ? F.sales[i - 1] : A.sales[b])));
const ndOwn = YRS.map((_, i) => -F.treasury[i] + extraWc.slice(0, i + 1).reduce((s, x) => s + x, 0) - mi.slice(0, i + 1).reduce((s, x) => s + x - miDiv, 0));
const LIQ = A.cash[b] + A.investments[b], KD = 5.5;
const grossDebt = [A.borrowings[b], ...ndOwn.map(x => x + LIQ)];
const intBuild = YRS.map((_, i) => KD / 100 * (grossDebt[i] + grossDebt[i + 1]) / 2);
YRS.forEach((y, i) => { if (Math.abs(intBuild[i] / AS.interest[i] - 1) > 0.05) throw new Error(`BIOCON interest ${y}: build ${n0(intBuild[i])} vs assumptions ${AS.interest[i]}`); });
const lev = [ND26 / A.ebitda[b], ...ndOwn.map((x, i) => x / F.ebitda[i])];
const synCash = [SY.netCash26]; YRS.forEach((_, i) => synCash.push(synCash[i] + synPat[i] + SY.dep[i] - 450 - SY.shares * SYN_DPS)); // Syngene capex ~Rs450 cr
const bicaraBook26 = 1027.1; // AR FY26 note 5: 5,523,897 Bicara shares at fair value Rs10,271 mn, inside investments
const ndBio = YRS.map((_, i) => ndOwn[i] + synCash[i + 1] + bicaraBook26); // biopharma net debt: Syngene's cash and Bicara are valued separately

// 4) Sector factors (PLAYBOOK §7c): nine-name pharma set, trailing P/E and EV/EBITDA at the 30-Sep close vs five-year medians
const NINE = ['SUNPHARMA', 'DIVISLAB', 'TORNTPHARM', 'ZYDUSLIFE', 'CIPLA', 'AUROPHARMA', 'ALKEM', 'IPCALAB', 'ABBOTINDIA'];
const ALL15 = [...NINE, 'LUPIN', 'GLENMARK', 'BIOCON', 'LAURUSLABS', 'DRREDDY', 'MANKIND'];
const PEERS = peersAsOf(ALL15, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = (sym, ch, key) => pct((scr(sym).charts?.[ch]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5);
const MED5 = Object.fromEntries(ALL15.map(s => [s, med5(s, 'pe', 'Price to Earning')])), MED5EV = Object.fromEntries(ALL15.map(s => [s, med5(s, 'evEbitda', 'EV Multiple')]));
const derate = Object.fromEntries(ALL15.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const derateEv = Object.fromEntries(ALL15.map(s => [s, P[s].evEbitda && MED5EV[s] ? (P[s].evEbitda / MED5EV[s] - 1) * 100 : null]));
const sectorDrCalc = medOf(NINE.map(s => derate[s])), sectorEvCalc = medOf(NINE.map(s => derateEv[s]));
const sectorDrAll = medOf(ALL15.filter(s => s !== 'BIOCON').map(s => derate[s])), sectorEvAll = medOf(ALL15.filter(s => s !== 'BIOCON').map(s => derateEv[s]));
const SECTOR_DR = 8.2, k = 1 + SECTOR_DR / 100; // settled for BIOCON (A20): median of all nine, BIOCON is outside the set
const SECTOR_EV = Math.round(sectorEvCalc * 100) / 100, kev = 1 + SECTOR_EV / 100; // EV/EBITDA analogue, reproduced as TORNTPHARM does
if (Math.abs(sectorDrCalc - SECTOR_DR) > 0.05) console.warn(`WARNING: derived P/E factor ${sectorDrCalc.toFixed(2)}% vs settled 8.2%`);
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma' }[s] || s);

// 5) Generics multiple, stated peer basis: Aurobindo's one-year-forward EV/EBITDA since Apr-2021 (EV = price x shares +
// Screener net debt at the latest March published by end-May; EBITDA = next full year, actuals then AUROPHARMA model forecasts)
const ndOf = (X, fy) => { const bs = X.tables['balance-sheet'], j = bs.periods.indexOf(`Mar ${fy}`); return bs.rows.Borrowings[j] - (X.schedules['balance-sheet']['Other Assets']['Cash Equivalents'][`Mar ${fy}`] || 0) - bs.rows.Investments[j]; };
const ebOf = X => { const o = {}; const pl = X.tables['profit-loss']; pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) o[+p.slice(-4)] = pl.rows['Operating Profit'][i]; }); return o; };
const audEb = ebOf(AUR); MA.forecast.F.years.forEach((y, i) => (audEb[2000 + +y.slice(2, 4)] = MA.forecast.F.ebitda[i]));
const audSh = d => (d < '2024-09-01' ? 58.59 : MA.forecast.F.shares); // ~58.6 cr shares before the 2024 buyback (Screener equity capital 59 -> 58)
const bsYear = d => { let y = +d.slice(0, 4); if (d < `${y}-05-31`) y -= 1; return y; };
const audPx = AUR.charts.price.Price.filter(([d]) => d >= '2021-04-01' && d <= ASOF); if (audPx.at(-1)[0] < ASOF) audPx.push([ASOF, P.AUROPHARMA.price]);
const audFwd = audPx.map(([d, px]) => [d, Math.round((px * audSh(d) + ndOf(AUR, bsYear(d))) / audEb[fyOf(d)] * 10) / 10]);
const AUD = { med: pct(audFwd.map(x => x[1]), 0.5), p25: pct(audFwd.map(x => x[1]), 0.25), p75: pct(audFwd.map(x => x[1]), 0.75), now: audFwd.at(-1)[1] };
const MGEN = { base: half(AUD.med * kev), bull: half(AUD.p75 * kev), bear: half(AUD.p25 * kev) };

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, SYN, AUR, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, rup, half, shortDate, pct, medOf, at, SRC, b, YRS, sep, price, SHARES, mcap, fyOf,
  BL, MG, SEGS, SEG_NAME, rev, revTot, ebs, corp, ebTot, SEGH, SY, GROSS_OI, synRev, synEb, synPbt, synPat, mi, miPre, oiBuild, miDiv, SYN_DPS,
  ND26, OWC_TRUE, OWC_INC, extraWc, ndOwn, LIQ, KD, grossDebt, intBuild, lev, synCash, bicaraBook26, ndBio,
  NINE, ALL15, PEERS, P, MED5, MED5EV, derate, derateEv, sectorDrCalc, sectorEvCalc, sectorDrAll, sectorEvAll, SECTOR_DR, k, SECTOR_EV, kev, shortName,
  ndOf, ebOf, bsYear, audFwd, AUD, MGEN };
