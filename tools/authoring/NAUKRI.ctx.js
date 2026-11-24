// Info Edge (India) initiation: shared context for the Part B files. Loads the research JSONs and the built model, builds the
// standalone segment paths (base / bull / bear), derives the segment multiples (street medians, internet-platform
// precedent), the holding-company discount on the Eternal and PB Fintech stakes (Info Edge's own history since Sep-2021,
// house method of TIINDIA / GODREJIND), the SOTP and the P/E cross-check. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'NAUKRI', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json'), ASJ = rd('assumptions.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'NAUKRI.json'), 'utf8'));
const scr = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, SC = M.forecast.scenarios, AS = ASJ;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const qtr = x => Math.round(x * 4) / 4; // EV/sales: nearest 0.25x
const med = a => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), ann = fy => SA.find(a => a.fy === fy);
const price = M.price.last, sh = C.shares.count, mcap = price * sh, ps = v => v / sh;
const CLOSE = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', `${ASOF}.json`), 'utf8')).closes;
const etPx = CLOSE.ETERNAL, pbPx = CLOSE.POLICYBZR;
const ST = C.stakes, etMv = ST.eternal.sharesGroup * etPx, pbMv = ST.pbFintech.sharesGroup * pbPx, listedMv = etMv + pbMv;
const UNL = ST.unlisted.infoEdgeShare + ST.unlisted.strategicCarrying, CASH = C.q1fy27.standalone.cash;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const T = AS.saBuild.taxRate / 100;

// 1) Standalone segment paths per case (engine logic: growth and margin deltas by scenario)
const segPath = (key, c) => { const s = AS.segments.find(x => x.key === key), d = AS.scenarios[c]?.segments?.[key] || {}; let r = s.base; return AS.years.map((_, i) => { r *= 1 + (s.growth[i] + (d.growthDelta || 0)) / 100; return { rev: r, res: r * (s.marginPct[i] + (d.marginDelta || 0)) / 100 }; }); };
const CASES = ['base', 'bull', 'bear'];
const P = Object.fromEntries(CASES.map(c => [c, { rec: segPath('rec', c), re: segPath('re', c), oth: segPath('oth', c) }]));
P.base.rec.forEach((r, i) => { if (Math.abs(r.res / F.seg.rec.adjEbitda[i] - 1) > 0.002) throw new Error(`NAUKRI rec path ${i}: ${r.res} vs model ${F.seg.rec.adjEbitda[i]}`); });
const recPat = (c, i) => (P[c].rec[i].res - AS.saBuild.unalloc[i]) * (1 - T); // Recruitment profit after all corporate costs and tax
const recPatSep = c => (recPat(c, 1) + recPat(c, 2)) / 2, reSep = c => sep(P[c].re.map(r => r.rev)), othSep = c => sep(P[c].oth.map(r => r.rev));
const histRecPat = fy => (ann(fy).recRes - ann(fy).unalloc) * (1 - T);
const FWD = { 2023: 'FY23', 2024: 'FY24', 2025: 'FY25', 2026: 'FY26' }; // actual years; FY27E-FY29E from the base path
const fwd = fy => (FWD[fy] ? { pat: histRecPat(FWD[fy]), re: ann(FWD[fy]).reRev, oth: ann(FWD[fy]).othRev } : { pat: recPat('base', fy - 2027), re: P.base.re[fy - 2027].rev, oth: P.base.oth[fy - 2027].rev });

// 2) Segment multiples: the street (internet-platform precedent: Swiggy / Eternal use the median of current broker multiples)
const MOSL = { naukri: 22200, re: 2500, oth: 3400 }; // Rs cr, Motilal Oswal SOTP (10-Aug-2026)
const moslRecX = MOSL.naukri / recPatSep('base'), moslReX = MOSL.re / reSep('base'), moslOthX = MOSL.oth / P.base.oth[0].rev;
const REC_STREET = [['JM Financial (Jul-2026)', 30], ['Motilal Oswal (DCF, implied on our Sep-28E)', moslRecX]];
const RE_STREET = [['JM Financial', 4], ['Motilal Oswal (DCF, implied on our Sep-28E)', moslReX]];
const RECX = { base: half(med(REC_STREET.map(x => x[1]))), bull: 30, bear: 20 };
const REX = { base: qtr(med(RE_STREET.map(x => x[1]))), bull: 4, bear: qtr(moslReX) };
const OTHX = { base: 2, bull: 2, bear: 1.5 };

// 3) Sector move (§7c): internet peers with a five-year P/E history, excluding Info Edge: IndiaMART only
const PEER_SYMS = D.peers.set, PEERS = peersAsOf(['NAUKRI', ...PEER_SYMS], ASOF), PR = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = s => { const v = (scr(s).charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]); return v.length >= 200 ? med(v) : null; };
const MED5 = Object.fromEntries(D.peers.fiveYearSet.map(s => [s, med5(s)]));
const derate = Object.fromEntries(D.peers.fiveYearSet.map(s => [s, (PR[s].pe / MED5[s] - 1) * 100]));
const sectorDr = med(Object.values(derate)), k = 1 + sectorDr / 100;

// 4) Info Edge's own discount history: quarter-ends Sep-2021 to Jun-2026 and 30-Sep-2026, house convention:
// look-through = Recruitment at RECX.base x forward profit + 99acres and Jeevansathi/Shiksha at base EV/sales on forward revenue
// + cash (incl. wholly owned subsidiaries, at the preceding March) + unlisted at book; discount = 1 − (market value − those) ÷ listed stakes.
const at = (ser, d) => { let v = null; for (const [x, p] of ser) { if (x <= d) v = p; else break; } return v; };
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const NP = scr('NAUKRI').charts.price.Price, EP = scr('ETERNAL').charts.price.Price, PP = scr('POLICYBZR').charts.price.Price;
const cashAt = d => C.standalone.cashInclWos[Math.max(0, Math.min(4, +d.slice(0, 4) - 2022))]; // cash at the March of the quarter-end's calendar year (2021 dates use Mar-2022)
const coreAt = (d, x = RECX.base) => { const f = fwd(fyOf(d)); return x * f.pat + REX.base * f.re + OTHX.base * f.oth; };
const discRow = (d, nPx, ePx, pPx) => { const mc = nPx * sh, L = ePx * ST.eternal.sharesGroup + (pPx || 0) * ST.pbFintech.sharesGroup, core = coreAt(d), c = d === ASOF ? CASH : cashAt(d); return { d, nPx, mc, L, core, cash: c, implied: mc - core - c - UNL, disc: (1 - (mc - core - c - UNL) / L) * 100, impliedRecX: (mc - 0.75 * L - c - UNL - REX.base * fwd(fyOf(d)).re - OTHX.base * fwd(fyOf(d)).oth) / fwd(fyOf(d)).pat, impliedRecX0: (mc - L - c - UNL - REX.base * fwd(fyOf(d)).re - OTHX.base * fwd(fyOf(d)).oth) / fwd(fyOf(d)).pat }; };
const QE = []; for (let y = 2021; y <= 2026; y++) for (const m of ['03-31', '06-30', '09-30', '12-31']) { const d = `${y}-${m}`; if (d >= '2021-09-30' && d <= '2026-06-30') QE.push(d); }
const discHist = QE.map(d => discRow(d, at(NP, d), at(EP, d), d >= '2021-11-15' ? at(PP, d) : 0));
const discNow = discRow(ASOF, price, etPx, pbPx);
const RECENT_FROM = '2025-09-30';
const discRecent = discHist.filter(r => r.d >= RECENT_FROM);
const discMedAll = med(discHist.map(r => r.disc)), discMedRecent = med(discRecent.map(r => r.disc)), discMax = Math.max(...discRecent.map(r => r.disc));
const DISC = { base: Math.round(discMedRecent), bull: Math.max(0, Math.round(discMedAll)), bear: Math.round(discMax) };
const impMed25 = med(discHist.map(r => r.impliedRecX)), impMed0 = med(discHist.map(r => r.impliedRecX0));

// 5) SOTP per case (Rs crore)
const sotpCase = c => { const rec = RECX[c] * recPatSep(c), re = REX[c] * reSep(c), oth = OTHX[c] * othSep(c), disc = -DISC[c] / 100 * listedMv; return { rec, re, oth, etMv, pbMv, disc, unl: UNL, cash: CASH, total: rec + re + oth + listedMv + disc + UNL + CASH }; };
const SOTP = Object.fromEntries(CASES.map(c => [c, sotpCase(c)]));
const ltv = SOTP.base.total - SOTP.base.disc;

// 6) P/E cross-check on consolidated EPS: own forward median (trough years left out) x sector move
const FM = forwardMedian('NAUKRI', M);
const fmP25 = (() => { const v = FM.series.map(x => x[1]).sort((a, b) => a - b); return v[Math.floor(v.length * 0.25)]; })();
const PEM = { base: half(FM.median * k), bull: half(FM.median), bear: half(fmP25 * k) };

const BM = V.blend?.methods || [], mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const STR = D.street.brokers, current = STR.filter(s => /^Current/.test(s.standing)), medTp = med(current.map(s => s.tp));

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S: scr('NAUKRI'), F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, half, med, SA, SQ, QL, ann, price, sh, mcap, ps, sep, T,
  etPx, pbPx, etMv, pbMv, listedMv, UNL, CASH, P, recPat, recPatSep, reSep, othSep, histRecPat, fwd, fyOf, MOSL, moslRecX, moslReX, moslOthX, REC_STREET, RE_STREET, RECX, REX, OTHX,
  PEER_SYMS, PEERS, PR, MED5, derate, sectorDr, k, discHist, discNow, discRecent, RECENT_FROM, discMedAll, discMedRecent, discMax, DISC, fmP25, impMed25, impMed0, SOTP, ltv, FM, PEM, BM, mv, rating, buyBelow, sellAbove, ruleText, STR, current, medTp };

if (require.main === module) {
  console.log('recPat', CASES.map(c => `${c}:${[0, 1, 2].map(i => n0(recPat(c, i))).join('/')} sep ${n0(recPatSep(c))}`).join(' | '), 'reSep', n0(reSep('base')), 'othSep', n0(othSep('base')));
  console.log('MOSL implied rec', n1(moslRecX), 're', n1(moslReX), 'oth FY27E', n1(moslOthX), '| RECX', JSON.stringify(RECX), 'REX', JSON.stringify(REX), 'OTHX', JSON.stringify(OTHX));
  console.log('sector', JSON.stringify(MED5), JSON.stringify(derate), n1(sectorDr), '| IndiaMART pe', PR.INDIAMART.pe);
  discHist.forEach(r => console.log(r.d, n0(r.nPx), n0(r.mc), n0(r.L), n0(r.core), n0(r.cash), n1(r.disc), 'impl25', n1(r.impliedRecX), 'impl0', n1(r.impliedRecX0)));
  console.log('NOW', n0(discNow.mc), n0(discNow.L), n0(discNow.core), n1(discNow.disc), 'impl25', n1(discNow.impliedRecX), 'impl0', n1(discNow.impliedRecX0), '| medAll', n1(discMedAll), 'medRecent', n1(discMedRecent), 'max', n1(discMax), 'DISC', JSON.stringify(DISC), 'impMed25', n1(impMed25), 'impMed0', n1(impMed0));
  for (const c of CASES) { const s = SOTP[c]; console.log(c, Object.entries(s).map(([k2, v]) => `${k2} ${n0(v)}`).join(' '), 'ps', n0(ps(s.total)), pc((ps(s.total) / price - 1) * 100)); }
  console.log('FM', FM.median, FM.medianAll, FM.troughYears, 'PEM', JSON.stringify(PEM), '| TP', V.tp, V.upside && n1(V.upside), rating, 'medTp', medTp);
}
