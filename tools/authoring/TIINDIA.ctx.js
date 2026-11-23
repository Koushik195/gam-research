// Tube Investments of India initiation: shared context for the Part B files. Loads the research JSONs and the built model,
// builds TII's standalone ("core", before subsidiary dividends) profit, derives the standalone P/E (own pre-CG forward P/E x
// auto-component sector de-rating), the holding-company discount on the listed stakes (TII's own history since Jun-2021,
// house method of GODREJIND) and the P/E cross-check. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'TIINDIA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'TIINDIA.json'), 'utf8'));
const scr = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const S = scr('TIINDIA');
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const med = a => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), ann = fy => SA.find(a => a.fy === fy);
const price = M.price.last, sh = C.shares.mar26, mcap = price * sh;
const CLOSE = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', `${ASOF}.json`), 'utf8')).closes;
const cgPx = CLOSE.CGPOWER, sgPx = CLOSE.SHANTIGEAR;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const ps = v => v / sh;

// 1) TII standalone core profit (before dividends from CG Power and Shanthi Gears), base and scenarios
const FY5 = C.standaloneFiveYear, B = AS.saBuild, T = B.taxRate / 100;
const coreHist = Object.fromEntries(FY5.years.map((y, i) => [y, FY5.pat[i] - FY5.subsidiaryDividends[i] * (1 - T)]));
const saSeg = AS.segments.find(s => s.key === 'sa');
const saPath = (gD = 0, mD = 0) => { let r = saSeg.base; return AS.years.map((y, i) => { r *= 1 + (saSeg.growth[i] + gD) / 100; const e = r * (saSeg.marginPct[i] + mD) / 100; const pbt = e - B.dep[i] + B.otherIncomeExDiv[i] - B.interest[i]; return { y, rev: r, ebitda: e, pbt, pat: pbt * (1 - T) }; }); };
const scenDelta = k => AS.scenarios[k]?.segments?.sa || {};
const saB = { base: saPath(), bull: saPath(scenDelta('bull').growthDelta, scenDelta('bull').marginDelta), bear: saPath(scenDelta('bear').growthDelta, scenDelta('bear').marginDelta) };
saB.base.forEach((r, i) => { if (Math.abs(r.ebitda / F.seg.sa.adjEbitda[i] - 1) > 0.003) throw new Error(`TIINDIA standalone build ${r.y}: ${n0(r.ebitda)} vs model ${n0(F.seg.sa.adjEbitda[i])}`); });
const saSepPat = k => sep(saB[k].map(r => r.pat)), saSepEps = k => saSepPat(k) / sh;
const ttmCore = coreHist.FY26 - C.q1fy27.standalone.patPy + C.q1fy27.standalone.pat; // Q1FY27 had no subsidiary dividend
const coreEps = { FY23: coreHist.FY23 / 19.32, FY24: coreHist.FY24 / 19.34, FY25: coreHist.FY25 / 19.35, FY26: coreHist.FY26 / sh, FY27E: saB.base[0].pat / sh, FY28E: saB.base[1].pat / sh };

// 2) Standalone multiple: TII's own one-year-forward P/E while the listed share was the standalone business only
// (listing in Nov-2017 to Mar-2020, before the CG Power acquisition), x the auto-component sector de-rating.
const EPS_PRE = { 2019: 13.02, 2020: 17.60, 2021: 14.44 }; // AR FY22 five-year table
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const PX = S.charts.price.Price;
const preSeries = PX.filter(([d]) => d >= '2017-11-01' && d <= '2020-03-31').map(([d, p]) => [d, Math.round(p / EPS_PRE[fyOf(d)] * 10) / 10]);
const preMed = med(preSeries.map(x => x[1])), preP25 = pct(preSeries.map(x => x[1]), 0.25), preP75 = pct(preSeries.map(x => x[1]), 0.75);

// 3) Sector de-rating: auto-component peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set, EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const PEERS = peersAsOf(['TIINDIA', 'CGPOWER', 'SHANTIGEAR', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = s => pct((scr(s).charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5);
const MED5 = Object.fromEntries(['TIINDIA', 'CGPOWER', 'SHANTIGEAR', ...PEER_SYMS].map(s => [s, med5(s)]));
const derate = Object.fromEntries(Object.keys(MED5).map(s => [s, P[s]?.pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const sectorDr = med(USED.map(s => derate[s])), sectorDrAll = med(PEER_SYMS.map(s => derate[s])), k = 1 + sectorDr / 100;
const SAM = { base: half(preMed * k), bull: half(preMed), bear: half(preP25 * k) };
const shortName = s => ({ BOSCHLTD: 'Bosch', MOTHERSON: 'Samvardhana Motherson', BHARATFORG: 'Bharat Forge', UNOMINDA: 'Uno Minda', SCHAEFFLER: 'Schaeffler India', SONACOMS: 'Sona BLW', ENDURANCE: 'Endurance Tech', ZFCVINDIA: 'ZF Commercial Vehicle', MSUMI: 'Motherson Sumi Wiring', TIINDIA: 'Tube Investments', CGPOWER: 'CG Power', SHANTIGEAR: 'Shanthi Gears' }[s] || s);

// 4) Holding-company discount on the listed stakes, quarter-ends Jun-2021 to Jun-2026 and at 30-Sep-2026.
// Discount = 1 − (TII market value − standalone at SAM.base x forward core EPS − unlisted at cost) ÷ listed stakes at market.
const at = (ser, d) => { let v = null; for (const [x, p] of ser) { if (x <= d) v = p; else break; } return v; };
const CGP = scr('CGPOWER').charts.price.Price, SGP = scr('SHANTIGEAR').charts.price.Price;
const ST = C.stakes, cgShOn = d => (d < '2022-03-31' ? ST.cg.history.mar21 : d < '2023-03-31' ? ST.cg.history.mar22 : ST.cg.shares);
const unlOn = d => { const u = ST.unlistedCostCr; if (d >= '2026-06-30') return u.jun26; const y = +d.slice(0, 4) - (d.slice(5, 7) < '03' || (d.slice(5, 7) === '03' && d.slice(8) < '31') ? 1 : 0); return u[`mar${String(Math.min(y, 2026)).slice(2)}`] ?? u.mar21; };
const fwdCore = d => coreEps[`FY${String(fyOf(d)).slice(2)}${fyOf(d) > 2026 ? 'E' : ''}`];
const discRow = (d, tPx, cPx, sPx) => { const mc = tPx * sh, L = cPx * cgShOn(d) + sPx * ST.sg.shares, SAv = SAM.base * fwdCore(d) * sh, U = unlOn(d); return { d, tPx, mc, L, SAv, U, implied: mc - SAv - U, disc: (1 - (mc - SAv - U) / L) * 100, toListed: mc / L * 100 }; };
const QE = []; for (let y = 2021; y <= 2026; y++) for (const m of ['03-31', '06-30', '09-30', '12-31']) { const d = `${y}-${m}`; if (d >= '2021-06-30' && d <= '2026-06-30') QE.push(d); }
const discHist = QE.map(d => discRow(d, at(PX, d), at(CGP, d), at(SGP, d)));
const discNow = discRow(ASOF, price, cgPx, sgPx);
const discRecent = discHist.filter(r => r.d >= '2024-09-30');
const discMedAll = med(discHist.map(r => r.disc)), discMedRecent = med(discRecent.map(r => r.disc));
const DISC = { base: Math.round(discMedRecent), bull: Math.max(0, Math.round(discMedAll)), bear: Math.round(discNow.disc) }; // bull floored at zero: no premium to look-through value assumed

// 5) SOTP inputs (₹ crore): standalone at P/E on Sep-28E core profit, listed stakes at 30-Sep closes, unlisted at cost
const cgMv = ST.cg.shares * cgPx, sgMv = ST.sg.shares * sgPx, listedMv = cgMv + sgMv;
const TIC = { base: C.ticmpl.tiiInvested, bull: C.ticmpl.tiiSeriesBFairValueMar26 + 250 + 250, bear: -Math.round(250 + 250 / 1.12) };
const OTHER_UNL = ST.unlistedCostCr.jun26 - C.ticmpl.tiiInvested;
const sotpCase = c => { const saV = SAM[c] * saSepPat(c), disc = -DISC[c] / 100 * listedMv; return { saV, cgMv, sgMv, disc, tic: TIC[c], oth: OTHER_UNL, total: saV + listedMv + disc + TIC[c] + OTHER_UNL }; };
const SOTP = { base: sotpCase('base'), bull: sotpCase('bull'), bear: sotpCase('bear') };

// 6) P/E cross-check on consolidated EPS: own forward median since Apr-2021 x sector de-rating
const FM = forwardMedian('TIINDIA', M);
const PEM = { base: half(FM.median * k), bull: half(FM.median), bear: half(pct(FM.series.map(x => x[1]), 0.25) * k) };

const BM = V.blend?.methods || [], mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const STR = D.street.brokers, current = STR.filter(s => /Current|Latest/.test(s.standing)), medTp = med(current.map(s => s.tp));

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, half, med, pct, SA, SQ, QL, ann, price, sh, mcap, sep, ps, cgPx, sgPx,
  FY5, B, coreHist, saB, saSepPat, saSepEps, ttmCore, coreEps, EPS_PRE, fyOf, preSeries, preMed, preP25, preP75,
  PEER_SYMS, EXCL, USED, PEERS, P, MED5, derate, sectorDr, sectorDrAll, k, SAM, shortName,
  discHist, discNow, discRecent, discMedAll, discMedRecent, DISC, cgMv, sgMv, listedMv, TIC, OTHER_UNL, SOTP, FM, PEM, BM, mv, rating, buyBelow, sellAbove, ruleText, STR, current, medTp };

if (require.main === module) {
  console.log('core', Object.entries(coreHist).map(([y, v]) => `${y}:${n0(v)}`).join(' '), 'ttm', n0(ttmCore), 'saPat', ['base', 'bull', 'bear'].map(c => `${c}:${saB[c].map(r => n0(r.pat)).join('/')}`).join(' '), 'sepEps', n1(saSepEps('base')));
  console.log('pre-CG fwd P/E med', preMed, 'p25', preP25, 'p75', preP75, 'n', preSeries.length, '| derate', Object.entries(derate).map(([s, v]) => `${s} ${v?.toFixed(1)}`).join(', '), 'sector', sectorDr.toFixed(2), 'all', sectorDrAll.toFixed(2), 'SAM', JSON.stringify(SAM));
  discHist.forEach(r => console.log(r.d, n0(r.tPx), n0(r.mc), n0(r.L), n0(r.SAv), n0(r.U), n1(r.disc)));
  console.log('NOW', n0(discNow.mc), n0(discNow.L), n0(discNow.SAv), n1(discNow.disc), 'medAll', n1(discMedAll), 'medRecent', n1(discMedRecent), 'DISC', JSON.stringify(DISC));
  for (const c of ['base', 'bull', 'bear']) { const s = SOTP[c]; console.log(c, 'SA', n0(s.saV), 'CG', n0(s.cgMv), 'SG', n0(s.sgMv), 'disc', n0(s.disc), 'TIC', n0(s.tic), 'oth', n0(s.oth), 'total', n0(s.total), 'ps', n0(ps(s.total)), pc((ps(s.total) / price - 1) * 100)); }
  console.log('FM', FM.median, FM.medianAll, FM.troughYears, 'PEM', JSON.stringify(PEM), 'peSep', n0(PEM.base * sep(F.eps)), '| TP', V.tp, V.upside && n1(V.upside), rating, 'medTp', medTp);
}
