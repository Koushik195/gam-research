// Acutaas Chemicals initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs and the
// built model and computes, once: the five-line revenue build (checked against model revenue), the other-income build (3.5% on
// average net cash + Rs0.5 cr, checked against assumptions.json), the interest build, the net-cash path, the one-year-forward P/E
// history since 1-Apr-2022 on every weekly close plus the 30-Sep close (listed Sep-2021; IPO months skipped; forward EPS = FY24
// before the Rs32.1 cr JV impairment, FY25-26 reported, our FY27E/FY28E), the pharma sector factor over the same window (nine
// peers, +7.8% P/E / +7.5% EV/EBITDA, reproduced peer by peer), the chemicals-set move (sensitivity), the derived multiples (must
// equal assumptions.json; ACUTAAS.mult.js writes them), the forward EV/EBITDA cross-check, a reverse-DCF test, sensitivity rows,
// peers and the street as it stood on 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ACUTAAS', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ACUTAAS.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'ACUTAAS', 'screener.json'), 'utf8')); // unpatched
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2022-04-01', LISTED = '2021-09-14', BREAK = '2025-04-01';
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
const SRC = 'Acutaas Chemicals annual report, results presentations and calls; Screener.in (consolidated); GAM Research';
const b = A.labels.length - 1; // FY26 index
const ai = fy => A.labels.indexOf(fy);
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const SA = SG.annual, SQ = SG.quarterly, Q1 = C.q1fy27, FY26 = C.fy26;

// 1) Five-line build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines, KEYS = ['cdmo', 'exCdmo', 'battery', 'semis', 'commodity'];
const LBL = { cdmo: 'CDMO (mainly darolutamide intermediates)', exCdmo: 'Pharma intermediates ex-CDMO', battery: 'Battery electrolyte additives', semis: 'Semiconductor chemicals (BFC + Indichem)', commodity: 'Commodity & other specialty chemicals' };
const LINES = Object.fromEntries(KEYS.map(k => { if (BL.levels?.[k]) return [k, BL.levels[k].slice()]; let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => KEYS.reduce((s, k) => s + LINES[k][i], 0));
const baseTot = KEYS.reduce((s, k) => s + BL.base[k], 0);
if (Math.abs(baseTot / A.sales[b] - 1) > 0.001) throw new Error(`ACUTAAS build base ${baseTot} != FY26 ${A.sales[b]}`);
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`ACUTAAS build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });
const pharmaTot = YRS.map((_, i) => LINES.cdmo[i] + LINES.exCdmo[i]), specTot = YRS.map((_, i) => LINES.battery[i] + LINES.semis[i] + LINES.commodity[i]);
const mixPct = k => YRS.map((_, i) => LINES[k][i] / buildTot[i] * 100);

// 2) Net cash: engine path (Screener cash + investments − borrowings incl. leases) and company basis
const ND0 = (A.cash[b] || 0) + (A.investments[b] || 0) - (A.borrowings[b] || 0); // Mar-26 engine net cash
const cashPath = [ND0, ...F.treasury];
const TRE = C.treasury, CO_NC0 = FY26.netCashCompany;

// 3) Other income build: 3.5% on average net cash + Rs0.5 cr miscellaneous (checked against assumptions)
const TY = 3.5, MISC = 0.5;
const oiTreas = YRS.map((_, i) => TY / 100 * (cashPath[i] + cashPath[i + 1]) / 2);
const oiBuild = YRS.map((_, i) => Math.round((oiTreas[i] + MISC) * 10) / 10);
const oiOk = YRS.every((y, i) => Math.abs(oiBuild[i] - AS.otherIncome[i]) <= 0.5);
const OIN = C.otherIncomeNote, OI26 = OIN.FY26.total, ttmOi = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);
const gross25 = TRE.mar25.cash + TRE.mar25.otherBank, gross26 = TRE.mar26.cash + TRE.mar26.otherBank;
const yld26 = OIN.FY26.interest / ((gross25 + gross26) / 2) * 100;
const yldQ1 = (OIN.Q1FY27.total - OIN.Q1FY27.forex) * 4 / ((CO_NC0 + Q1.netCash) / 2) * 100;

// 4) Interest build: 8.5% on average borrowings + ~Rs2 cr lease interest and other finance costs
const KD = 8.5, OTHER_FIN = 2.0, BORR = [TRE.mar26.borrowings, 20, 15, 10];
const intBuild = YRS.map((_, i) => KD / 100 * (BORR[i] + BORR[i + 1]) / 2 + OTHER_FIN);
const intOk = YRS.every((y, i) => Math.abs(intBuild[i] - AS.interest[i]) <= 0.15);

// 5) Forward P/E since 1-Apr-2022 on every weekly close (+ the 30-Sep close): price ÷ next full fiscal year's EPS
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const pl = RAW.tables['profit-loss'], ns = RAW.schedules['profit-loss']['Net Profit'];
const epsRep = {}, PFE = {};
pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) { const y = +p.slice(-4); epsRep[y] = pl.rows['EPS in Rs'][i]; PFE[y] = ns['Profit for EPS'][p]; } });
const EXC24 = 32.1; // FY24 exceptional item, pre-tax = post-tax (full impairment of the 50% JV Ami Oncotheranostics; company adjusted PAT Rs80.8 cr)
const eps24ex = epsRep[2024] * (PFE[2024] + EXC24) / PFE[2024];
const epsU = F.pat.map(p => p / SHARES); // engine EPS unrounded
const byEx = { 2023: epsRep[2023], 2024: eps24ex, 2025: epsRep[2025], 2026: epsRep[2026], 2027: epsU[0], 2028: epsU[1], 2029: epsU[2] };
const byRep = { ...byEx, 2024: epsRep[2024] };
const pxAll = RAW.charts.price.Price.filter(([d]) => d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const px = pxAll.filter(([d]) => d >= FROM);
const seriesOn = (pts, by) => pts.map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10]);
const stat = s => { const v = s.map(x => x[1]); return { med: medOf(v), p25: pctl(v, 0.25), p75: pctl(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length }; };
const sPe = seriesOn(px, byEx), HB = stat(sPe);                       // base: EPS before the FY24 exceptional item
const sPeRep = seriesOn(px, byRep), HREP = stat(sPeRep);             // reported EPS (sensitivity)
const sPeAll = seriesOn(pxAll.filter(([d]) => d >= LISTED), byEx), HALL = stat(sPeAll); // incl. the IPO months
const HBRK = stat(sPe.filter(([d]) => d >= BREAK));                  // from the earnings break (Apr-2025)
const byFy = fy => stat(sPe.filter(([d]) => fyOf(d) === fy));
const HFY = Object.fromEntries([2024, 2025, 2026, 2027, 2028].map(fy => [fy, byFy(fy)]));
const FM = forwardMedian('ACUTAAS', M, { from: FROM }); // house function: every 5th week, reported EPS, trough years left out
const troughFY24 = { rep: epsRep[2024], ex: eps24ex, line: 0.5 * Math.max(epsRep[2021], epsRep[2022], epsRep[2023]) };
const fwdNow = price / epsU[1], peFY27 = price / epsU[0], peSep = price / sep(epsU);
const trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;

// 6) Sector factors (PLAYBOOK §7c): peers' trailing multiple at the 30-Sep close vs their medians over a window
const PEER_SET = D.peers.set, CHEM = D.peers.chemSet, CTX = D.peers.context;
const ALLS = [...new Set([...PEER_SET, ...CHEM, ...CTX, 'ACUTAAS'])];
const PEERS = peersAsOf(ALLS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const raw = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
const medFrom = (sym, ch, key, from) => medOf((raw(sym).charts?.[ch]?.[key] || []).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const moveOf = (syms, metric, from) => Object.fromEntries(syms.map(s => { const m = metric === 'pe' ? medFrom(s, 'pe', 'Price to Earning', from) : medFrom(s, 'evEbitda', 'EV Multiple', from); const cur = metric === 'pe' ? P[s].pe : P[s].evEbitda; return [s, { cur, med: m, mv: (cur / m - 1) * 100 }]; }));
const MW = moveOf([...PEER_SET, 'ACUTAAS'], 'pe', FROM), MWEV = moveOf([...PEER_SET, 'ACUTAAS'], 'ev', FROM);
const M5 = moveOf(PEER_SET, 'pe', '2021-09-30'), MBRK = moveOf(PEER_SET, 'pe', BREAK);
const MCH = moveOf(CHEM, 'pe', FROM), MCHEV = moveOf(CHEM, 'ev', FROM);
const medMv = (obj, syms) => medOf(syms.map(s => obj[s].mv));
const sectorCalc = medMv(MW, PEER_SET), sectorEvCalc = medMv(MWEV, PEER_SET), sector5 = medMv(M5, PEER_SET), sectorBrk = medMv(MBRK, PEER_SET);
const chemCalc = medMv(MCH, CHEM), chemEvCalc = medMv(MCHEV, CHEM);
const chemByReport = Object.fromEntries(Object.entries(D.peers.chemSetsByReport).map(([r, syms]) => [r, medMv(MCH, syms)]));
const SECTOR = 7.8, SECTOR_EV = 7.5; // given in the brief for Acutaas's window (1-Apr-2022); our reproduction is sectorCalc / sectorEvCalc
const k = 1 + SECTOR / 100, kev = 1 + SECTOR_EV / 100;
if (Math.abs(sectorCalc - SECTOR) > 0.1 || Math.abs(sectorEvCalc - SECTOR_EV) > 0.1) console.warn(`WARNING: ACUTAAS factor reproduces at ${sectorCalc.toFixed(2)}% / ${sectorEvCalc.toFixed(2)}% vs ${SECTOR}% / ${SECTOR_EV}%`);
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', LUPIN: 'Lupin', GLENMARK: 'Glenmark', BIOCON: 'Biocon', LAURUSLABS: 'Laurus Labs', DRREDDY: "Dr Reddy's", MANKIND: 'Mankind Pharma', NEULANDLAB: 'Neuland Labs', SAILIFE: 'Sai Life Sciences', ANTHEM: 'Anthem Biosciences', NAVINFLUOR: 'Navin Fluorine', PIIND: 'PI Industries', CLEAN: 'Clean Science', VINATIORGA: 'Vinati Organics', ANURAS: 'Anupam Rasayan', TATVA: 'Tatva Chintan', SRF: 'SRF', FLUOROCHEM: 'Gujarat Fluorochem', AARTIIND: 'Aarti Industries', DEEPAKNTR: 'Deepak Nitrite', ATUL: 'Atul', HSCL: 'Himadri Speciality', EPIGRAL: 'Epigral', LXCHEM: 'Laxmi Organic', ALKYLAMINE: 'Alkyl Amines', ACUTAAS: 'Acutaas' }[s] || s);

// 7) Target multiples (derived; base on EPS before the FY24 exceptional item, which our forecasts do not carry)
const MULT = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };

// 8) Forward EV/EBITDA since 1-Apr-2022: EV at each weekly close = price × shares then outstanding − last published net cash;
//    ÷ next full fiscal year's EBITDA (Screener basis; our FY27E/FY28E) × the peers' EV/EBITDA move over the same window
const NC_PUB = [['2022-04-01', 99], ['2023-05-15', 55], ['2024-05-15', -164], ['2025-05-15', 236], ['2026-04-30', 198.3], ['2026-07-24', 314]];
const ncAt = d => NC_PUB.filter(([x]) => x <= d).at(-1)[1];
const sharesAt = d => (d < '2024-06-22' ? 7.376 : 8.187); // AR: Rs3,688.06 lakh (Mar-24) and Rs4,093.45 lakh (Mar-25) of Rs5 shares; QIP allotted Jun-2024
const ebBy = { 2024: A.ebitda[ai('FY24')], 2025: A.ebitda[ai('FY25')], 2026: A.ebitda[b], 2027: F.ebitda[0], 2028: F.ebitda[1] };
const sEv = px.map(([d, p]) => [d, Math.round((p * sharesAt(d) - ncAt(d)) / ebBy[fyOf(d)] * 10) / 10]), EVH = stat(sEv);
const EVM = { base: half(EVH.med * kev), bull: half(EVH.p75 * kev), bear: half(EVH.p25 * kev) };
const EVM_PEF = half(EVH.med * k), evNowFwd = (mcap - Q1.netCash) / F.ebitda[1];
const ebitdaSep = sep(F.ebitda), treasSep = sep(F.treasury);

// 9) Checks: assumptions multiples = derivation; engine P/E value = multiple × Sep-28E EPS; target = rounded P/E value
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const PEM = AS.valuation.blend.methods.find(x => x.key === 'pe'), EVA = AS.valuation.blend.methods.find(x => x.key === 'ev');
const multOk = ['base', 'bull', 'bear'].every(c => PEM.multiple[c] === MULT[c]), evOk = ['base', 'bull', 'bear'].every(c => EVA.multiple[c] === EVM[c]);
const epsSep28 = mv('pe').metric;
if (!process.env.TP_NOCHECK) {
  if (!oiOk) throw new Error(`ACUTAAS other income: build ${oiBuild} vs assumptions ${AS.otherIncome}; run TP_NOCHECK=1 node tools/authoring/ACUTAAS.mult.js`);
  if (!intOk) throw new Error(`ACUTAAS interest: build ${intBuild.map(x => x.toFixed(2))} vs assumptions ${AS.interest}`);
  if (!multOk || !evOk) throw new Error(`ACUTAAS: assumptions multiples differ from the derivation (P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}); run TP_NOCHECK=1 node tools/authoring/ACUTAAS.mult.js`);
  [['base', V.tp, V], ['bull', SC.bull.tp, SC.bull], ['bear', SC.bear.tp, SC.bear]].forEach(([c, tp, S]) => { const pv = S.blend.methods.find(m => m.key === 'pe').value; if (tp !== Math.round(pv / 10) * 10) throw new Error(`ACUTAAS ${c} target ${tp} is not the P/E value ${Math.round(pv)}`); });
}

// 10) Reverse-DCF test (same mechanics as src/forecast.js dcf(), flat growth FY28-41E): growth the price needs
const DC = AS.dcf, tTax = AS.taxRate[2] / 100, ke = V.ke;
const dcfAt = g => { let s = F.sales[0], pv = 0, last = null; const n = DC.years;
  for (let kk = 1; kk <= n; kk++) { const sF = (kk - 3 + 1) / (n - 3 + 1); const m = kk < 3 ? F.ebitdaMargin[kk] : F.ebitdaMargin[2] + (DC.fadeMarginTo - F.ebitdaMargin[2]) * sF; const cx = kk < 3 ? F.capex[kk] / F.sales[kk] * 100 : F.capex[2] / F.sales[2] * 100 + (DC.fadeCapexPctTo - F.capex[2] / F.sales[2] * 100) * sF;
    s *= 1 + g / 100; const e = s * m / 100, dep = s * DC.depPctOfSales / 100, f = (e - dep) * (1 - tTax) + dep - s * cx / 100 - F.owcPct / 100 * s * (g / (100 + g)); pv += f / Math.pow(1 + ke / 100, kk - 0.5); last = f; }
  const tv = last * (1 + DC.terminalGrowth / 100) / ((ke - DC.terminalGrowth) / 100) / Math.pow(1 + ke / 100, n);
  return (pv + tv + F.treasury[0]) / SHARES * Math.pow(1 + ke / 100, 0.5); };
let lo = 0, hi = 60; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (dcfAt(mid) < price) lo = mid; else hi = mid; }
const gNeeded = (lo + hi) / 2, dcfAt20 = dcfAt(20), dcfAt25 = dcfAt(25);

// 11) Sensitivity rows (not used in the base)
const peV = (m, e) => Math.round(m * e / 10) * 10;
const epsCagr = cagr(epsRep[2026], epsU[2], 3), salesCagr = cagr(A.sales[b], F.sales[2], 3), ebitdaCagr = cagr(A.ebitda[b], F.ebitda[2], 3);
const ownMv = MW.ACUTAAS.mv, ownEvMv = MWEV.ACUTAAS.mv;
const SENS = [
  { name: `House base: median since 1-Apr-2022 (every weekly close; FY24 EPS before the JV impairment) × ${k.toFixed(3)}`, mult: MULT.base, why: `${n1(HB.med)}x × ${k.toFixed(3)}` },
  { name: 'Reported EPS (FY24 ₹5.80 incl. the impairment), every weekly close', mult: half(HREP.med * k), why: `${n1(HREP.med)}x × ${k.toFixed(3)} (75th pct ${n1(HREP.p75)}x vs ${n1(HB.p75)}x)` },
  { name: 'House forwardMedian (every 5th week, reported EPS, trough rule applied)', mult: half(FM.median * k), why: `${n1(FM.median)}x × ${k.toFixed(3)}; trough years: ${FM.troughYears.length ? FM.troughYears.join(', ') : 'none'}` },
  { name: 'Including the IPO months (from listing, Sep-2021)', mult: half(HALL.med * k), why: `${n1(HALL.med)}x × ${k.toFixed(3)}` },
  { name: `Window from the earnings break (1-Apr-2025) × the peers' move over that window (${pc1(sectorBrk)})`, mult: half(HBRK.med * (1 + sectorBrk / 100)), why: `${n1(HBRK.med)}x × ${(1 + sectorBrk / 100).toFixed(3)}` },
  { name: 'No sector factor (own median only)', mult: half(HB.med), why: `${n1(HB.med)}x` },
  { name: `Chemicals set instead of pharma (15 names in the published chemicals reports, ${pc1(chemCalc)})`, mult: half(HB.med * (1 + chemCalc / 100)), why: `${n1(HB.med)}x × ${(1 + chemCalc / 100).toFixed(3)}` },
  { name: `Blend with Acutaas's own move (${pc1(ownMv)}; not house policy)`, mult: half(HB.med * (1 + (SECTOR + ownMv) / 200)), why: `midpoint of ${pc1(SECTOR)} and ${pc1(ownMv)}` },
  { name: `Growth view: PEG 2.0x on our FY26-29E EPS growth (${n1(epsCagr)}%; not house policy)`, mult: half(2.0 * epsCagr), why: `2.0 × ${n1(epsCagr)}` },
  { name: 'Street P/E user: PL 56x FY28E (applied to our Sep-28E EPS)', mult: 56, why: 'PL, 24-Jul-2026' },
].map(r => ({ ...r, tp: peV(r.mult, epsSep28), up: (r.mult * epsSep28 / price - 1) * 100 }));
const implPeAtPrice = price / epsSep28;

// 12) Rating from the house rule; street as it stood on 30-Sep-2026
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, br = n => ST.find(s => s.broker.startsWith(n));
const withTp = ST.filter(s => s.tp), medTp = medOf(withTp.map(s => s.tp));
const pll = br('Prabhudas'), hsie = br('HDFC'), kie = br('Kotak'), jm = br('JM'), sbi = br('SBICAP'), idbi = br('IDBI'), drc = br('DRChoksey');
const atOurs = { pl: 56 * epsU[1], plSep: 56 * sep(epsU) };
const CONS = { FY27E: 54.9, FY28E: 72.7 }; // Bloomberg consensus EPS (HSIE, 21-Sep-2026)

// 13) Growth, returns, capital
const capY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const capex6 = capY.reduce((s, y) => s + (A.capex[ai(y)] || 0), 0), cfo6 = capY.reduce((s, y) => s + (A.cfo[ai(y)] || 0), 0);
const salesCagr6 = cagr(A.sales[ai('FY20')], A.sales[b], 6), divYield = F.dps[0] / price * 100;
const ptEbitda = sep(F.sales) / 100, ptEps = ptEbitda * (1 - AS.taxRate[1] / 100) / SHARES;
const cdmoShare26 = BL.base.cdmo / A.sales[b] * 100;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, LISTED, BREAK, n0, n1, pc, pc1, rup, half, cagr, medOf, pctl, shortDate, SRC, b, ai, YRS, sep, price, SHARES, mcap, SA, SQ, Q1, FY26,
  BL, KEYS, LBL, LINES, buildTot, pharmaTot, specTot, mixPct, ND0, cashPath, TRE, CO_NC0, TY, MISC, oiTreas, oiBuild, OIN, OI26, ttmOi, yld26, yldQ1, KD, OTHER_FIN, BORR, intBuild,
  fyOf, epsRep, PFE, EXC24, eps24ex, epsU, byEx, byRep, sPe, HB, sPeRep, HREP, sPeAll, HALL, HBRK, HFY, FM, troughFY24, fwdNow, peFY27, peSep, trailEps, trailPe,
  PEER_SET, CHEM, CTX, PEERS, P, MW, MWEV, M5, MBRK, MCH, MCHEV, sectorCalc, sectorEvCalc, sector5, sectorBrk, chemCalc, chemEvCalc, chemByReport, SECTOR, SECTOR_EV, k, kev, shortName, MULT,
  NC_PUB, sEv, EVH, EVM, EVM_PEF, evNowFwd, ebitdaSep, treasSep, BM, mv, multOk, evOk, epsSep28, gNeeded, dcfAt20, dcfAt25, peV, epsCagr, salesCagr, ebitdaCagr, ownMv, ownEvMv, SENS, implPeAtPrice,
  rating, ruleText, buyBelow, sellAbove, ST, br, withTp, medTp, pll, hsie, kie, jm, sbi, idbi, drc, atOurs, CONS, capex6, cfo6, salesCagr6, divYield, ptEbitda, ptEps, cdmoShare26 };

if (require.main === module) {
  console.log('build', buildTot.map(n0), 'model', F.sales.map(n0), 'pharma', pharmaTot.map(n0), 'spec', specTot.map(n0), 'mix CDMO', mixPct('cdmo').map(n1));
  console.log('cash path', cashPath.map(n0), 'company NC Mar-26', CO_NC0, 'Jun-26', Q1.netCash);
  console.log('OI build', oiBuild, 'vs', AS.otherIncome, oiOk, 'treas', oiTreas.map(n1), 'FY26', OI26, 'TTM', ttmOi, 'yield FY26', n1(yld26), 'Q1', n1(yldQ1));
  console.log('interest', intBuild.map(x => x.toFixed(2)), 'vs', AS.interest, intOk);
  console.log('EPS', epsU.map(x => x.toFixed(2)), 'Sep-28E', epsSep28.toFixed(2), 'FY24 rep/ex', epsRep[2024], eps24ex.toFixed(2), 'trough line', troughFY24.line.toFixed(3), 'CAGR', n1(epsCagr));
  console.log('fwd P/E since Apr-22', JSON.stringify(HB), '| rep', JSON.stringify(HREP), '| all', HALL.med, '| break', JSON.stringify(HBRK), '| house', FM.median, FM.medianAll, FM.troughYears);
  console.log('by FY', Object.entries(HFY).map(([y, h]) => `${y}: ${h.n} pts med ${h.med} ${h.min}-${h.max}`).join(' | '));
  console.log('now: fwd FY28', n1(fwdNow), 'FY27', n1(peFY27), 'Sep28', n1(peSep), 'trail', n1(trailPe), trailEps.toFixed(2));
  console.log('factor P/E', sectorCalc.toFixed(3), 'EV', sectorEvCalc.toFixed(3), '5y', sector5.toFixed(2), 'break', sectorBrk.toFixed(2), PEER_SET.map(s => `${s} ${MW[s].cur}/${n1(MW[s].med)}=${MW[s].mv.toFixed(1)}`).join('; '));
  console.log('chem', chemCalc.toFixed(2), 'EV', chemEvCalc.toFixed(2), JSON.stringify(Object.fromEntries(Object.entries(chemByReport).map(([a, v]) => [a, v.toFixed(2)]))), '| own', ownMv.toFixed(2), ownEvMv.toFixed(2));
  console.log('EV hist', JSON.stringify(EVH), 'EVM', JSON.stringify(EVM), 'EV with P/E factor', EVM_PEF, 'EV now fwd', n1(evNowFwd));
  console.log('MULT', MULT, 'ok?', multOk, evOk, '| TP', V.tp, V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'bull', SC.bull.tp, 'bear', SC.bear.tp);
  console.log('gNeeded', n1(gNeeded), 'dcf@20', n0(dcfAt20), 'dcf@25', n0(dcfAt25), 'engine dcf', V.intrinsicTp);
  console.log('SENS', SENS.map(r => `${r.name}: ${r.mult}x ${r.tp}`).join(' | '));
  console.log('street med', medTp, 'impl P/E', n1(implPeAtPrice), 'buyBelow', buyBelow, 'sellAbove', sellAbove);
}
