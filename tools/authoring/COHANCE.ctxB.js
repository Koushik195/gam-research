// Cohance Lifesciences initiation, shared context part B: valuation. One-year-forward P/E history on every weekly close plus the
// 30-Sep close, on a post-merger per-share basis (FY25 restated EPS Rs12.68 diluted; FY19-24 Suven alone), with the trough rule.
// The post-merger window (from the 1-May-2025 effective date) holds two forward years, FY27E and FY28E, and BOTH are trough years
// (forward EPS below half of FY25's): it yields no usable median. The base therefore uses the since-Apr-2021 median of the listed
// share, trough years FY26-FY28 left out (that leaves the forward years FY23-FY25), on EPS before exceptional items, x the nine
// peers' move against their five-year medians (+8.2%, the house factor for names outside the set). Also: the forward EV/EBITDA
// cross-check on the same dates (x +7.5%), the peers' moves over the merger window (+17.5% / +9.5%, reproduced peer by peer), a
// reverse-DCF test, sensitivity rows, peers and the street as it stood on 30-Sep-2026.
const X = require('./COHANCE.ctxA');
const { fs, path, ROOT, D, M, RAW, F, V, A, AS, SC, n1, pc1, half, medOf, pctl, b, ai, sep, price, SHARES, mcap, TRE } = X;
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2021-04-01', MERGER = '2025-05-01', KEPT = '2026-04-01', FIVE = '2021-09-30';
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };

// 1) EPS by fiscal year (forward EPS = the next full fiscal year's), reported and before exceptional items
const epsU = F.pat.map(p => p / SHARES);
const pfe = RAW.schedules['profit-loss']['Net Profit'], pl = RAW.tables['profit-loss'];
const shOf = y => { const i = pl.periods.indexOf(`Mar ${y}`); return pfe['Profit for EPS'][`Mar ${y}`] / pl.rows['EPS in Rs'][i]; }; // Suven shares, FY20-24
const rep = { 2020: 12.45, 2021: 14.23, 2022: 17.83, 2023: 16.16, 2024: 11.8, 2025: 12.68, 2026: 4.68, 2027: epsU[0], 2028: epsU[1], 2029: epsU[2] };
const EXC25 = 15.78, EXC26 = 29.47, SH25 = 38.3714, SH26 = 38.2894;                 // AR FY26 notes 59, 61 (FY25 compounding fees: no tax relief)
const ex = { ...rep, 2021: pfe['Profit excl Excep']['Mar 2021'] / shOf(2021), 2022: pfe['Profit excl Excep']['Mar 2022'] / shOf(2022), 2023: pfe['Profit excl Excep']['Mar 2023'] / shOf(2023), 2024: pfe['Profit excl Excep']['Mar 2024'] / shOf(2024), 2025: (487.34 + EXC25) / SH25, 2026: (179.23 + EXC26 * (1 - 0.2517)) / SH26 };
const trough = (by, fy) => { const pk = Math.max(by[fy - 1], by[fy - 2], by[fy - 3]); return !(by[fy] > 0) || by[fy] < 0.5 * pk; };
const line = (by, fy) => 0.5 * Math.max(by[fy - 1], by[fy - 2], by[fy - 3]);

// 2) Forward P/E series on every weekly close plus the 30-Sep close
const pxAll = RAW.charts.price.Price.filter(([d]) => d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const seriesOn = (from, by) => pxAll.filter(([d]) => d >= from).map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10, fyOf(d)]);
const stat = s => { const v = s.map(x => x[1]); return v.length ? { med: medOf(v), p25: pctl(v, 0.25), p75: pctl(v, 0.75), min: Math.min(...v), max: Math.max(...v), n: v.length } : { med: null, n: 0 }; };
const sAllEx = seriesOn(FROM, ex), sAllRep = seriesOn(FROM, rep);
const sPe = sAllEx.filter(x => !trough(ex, x[2])), HB = stat(sPe);                   // base: since Apr-2021, ex-exceptional, trough years out
const sPeRep = sAllRep.filter(x => !trough(rep, x[2])), HREP = stat(sPeRep);          // reported EPS (sensitivity)
const troughYrs = [...new Set(sAllEx.filter(x => trough(ex, x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const sMrg = seriesOn(MERGER, ex), HMRG = stat(sMrg), HMRGKEPT = stat(sMrg.filter(x => !trough(ex, x[2])));
const sF28 = sMrg.filter(x => x[2] === 2028), HF28 = stat(sF28);
const HFY = Object.fromEntries([2023, 2024, 2025, 2026, 2027, 2028].map(fy => [fy, { ...stat(sAllEx.filter(x => x[2] === fy)), trough: trough(ex, fy), line: line(ex, fy), eps: ex[fy] }]));
const exSuven25 = { ...ex, 2025: 264.77 / 25.46 };                                    // Suven's own FY25 as first reported (sensitivity)
const HSUV = stat(seriesOn(FROM, exSuven25).filter(x => !trough(exSuven25, x[2])));
const FM = forwardMedian('COHANCE', M, { from: FROM });                               // house function: every 5th week, Screener EPS (unpatched FY25 Rs19.14)
const fwdNow = price / epsU[1], peFY27 = price / epsU[0], peSep = price / sep(epsU);
const trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;

// 3) Sector factors (PLAYBOOK §7c): nine peers' trailing multiple at the 30-Sep close vs their medians over a window
const PEER_SET = D.peers.set, CTX = D.peers.context;
const PEERS = peersAsOf([...new Set([...PEER_SET, ...CTX, 'COHANCE'])], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const raw = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8'));
const medFrom = (sym, ch, key, from) => medOf((raw(sym).charts?.[ch]?.[key] || []).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]));
const moveOf = (syms, metric, from) => Object.fromEntries(syms.map(s => { const m = metric === 'pe' ? medFrom(s, 'pe', 'Price to Earning', from) : medFrom(s, 'evEbitda', 'EV Multiple', from); const cur = metric === 'pe' ? P[s].pe : P[s].evEbitda; return [s, { cur, med: m, mv: (cur / m - 1) * 100 }]; }));
const medMv = (obj, syms) => medOf(syms.map(s => obj[s].mv));
const M5 = moveOf(PEER_SET, 'pe', FIVE), M5EV = moveOf(PEER_SET, 'ev', FIVE), MM = moveOf(PEER_SET, 'pe', MERGER), MMEV = moveOf(PEER_SET, 'ev', MERGER), MK = moveOf(PEER_SET, 'pe', KEPT);
const sector5 = medMv(M5, PEER_SET), sector5Ev = medMv(M5EV, PEER_SET), sectorM = medMv(MM, PEER_SET), sectorMEv = medMv(MMEV, PEER_SET), sectorK = medMv(MK, PEER_SET);
const SECTOR = 8.2, SECTOR_EV = 7.5, SECTOR_M = 17.5, SECTOR_MEV = 9.5;              // house values (sector-factor.js); reproductions above
const k = 1 + SECTOR / 100, kev = 1 + SECTOR_EV / 100, km = 1 + SECTOR_M / 100;
[[sector5, SECTOR], [sector5Ev, SECTOR_EV], [sectorM, SECTOR_M], [sectorMEv, SECTOR_MEV]].forEach(([c, h]) => { if (Math.abs(c - h) > 0.1) console.warn(`WARNING: COHANCE factor reproduces at ${c.toFixed(2)}% vs ${h}%`); });
const shortName = s => ({ SUNPHARMA: 'Sun Pharma', DIVISLAB: "Divi's Labs", TORNTPHARM: 'Torrent Pharma', ZYDUSLIFE: 'Zydus Lifesciences', CIPLA: 'Cipla', AUROPHARMA: 'Aurobindo Pharma', ALKEM: 'Alkem Labs', IPCALAB: 'Ipca Labs', ABBOTINDIA: 'Abbott India', SAILIFE: 'Sai Life Sciences', ACUTAAS: 'Acutaas', ANTHEM: 'Anthem Biosciences', NEULANDLAB: 'Neuland Labs', LAURUSLABS: 'Laurus Labs', SYNGENE: 'Syngene', PPLPHARMA: 'Piramal Pharma', COHANCE: 'Cohance' }[s] || s);

// 4) Target multiples (derived): base on EPS before exceptional items; bull/bear = 75th/25th percentile x the same factor
const MULT = { base: half(HB.med * k), bull: half(HB.p75 * k), bear: half(HB.p25 * k) };

// 5) Forward EV/EBITDA on the same kept dates: EV = price x shares then outstanding - last published net cash; / next year's EBITDA.
//    FY23-24 forward years: Suven (25.46 cr shares, Screener net cash); FY25 forward year: merged (38.37 cr shares, pro forma Mar-24
//    net cash Rs416.7 cr, Q4FY26 deck), on restated FY25 EBITDA.
const NC_SUV = [['2021-04-01', 166], ['2021-05-15', 409], ['2022-05-15', 548], ['2023-05-15', 534]];
const ncSuv = d => NC_SUV.filter(([x]) => x <= d).at(-1)[1];
const ebBy = { 2023: A.ebitda[ai('FY23')], 2024: A.ebitda[ai('FY24')], 2025: A.ebitda[ai('FY25')] };
const evAt = (d, p) => { const fy = fyOf(d); return fy === 2025 ? (p * 38.3714 - 416.7) / ebBy[2025] : (p * 25.46 - ncSuv(d)) / ebBy[fy]; };
const sEv = pxAll.filter(([d]) => d >= FROM && [2023, 2024, 2025].includes(fyOf(d))).map(([d, p]) => [d, Math.round(evAt(d, p) * 10) / 10]), EVH = stat(sEv);
const EVM = { base: half(EVH.med * kev), bull: half(EVH.p75 * kev), bear: half(EVH.p25 * kev) };
const ebitdaSep = sep(F.ebitda), treasSep = sep(F.treasury), evNowFwd = (mcap - F.treasury[0]) / F.ebitda[1];

module.exports = { ...X, ASOF, ASOF_TXT, FROM, MERGER, KEPT, FIVE, fyOf, epsU, rep, ex, EXC25, EXC26, trough, line, pxAll, sAllEx, sPe, HB, sPeRep, HREP, troughYrs, sMrg, HMRG, HMRGKEPT, sF28, HF28, HFY, HSUV, FM, fwdNow, peFY27, peSep, trailEps, trailPe,
  PEER_SET, CTX, PEERS, P, M5, M5EV, MM, MMEV, MK, sector5, sector5Ev, sectorM, sectorMEv, sectorK, SECTOR, SECTOR_EV, SECTOR_M, SECTOR_MEV, k, kev, km, shortName, MULT, sEv, EVH, EVM, ebitdaSep, treasSep, evNowFwd,
  forwardMedian, ratingFor, ruleText, buyAt, sellAt };
