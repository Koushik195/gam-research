// ONGC initiation: shared context for the Part B files. Loads the research JSONs and the built model, runs the price x volume
// build, builds ONGC's standalone "core" profit (before dividends from the stakes and before one-offs), derives the core P/E
// from ONGC's own history (implied by its market value less the stakes at a 20% discount, OVL and unlisted at cost; PLAYBOOK
// §4/§7c), the oil-and-gas sector move, the SOTP per case and the P/E cross-check. As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ONGC', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json'), AS = rd('assumptions.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ONGC.json'), 'utf8'));
const scr = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const S = scr('ONGC');
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const med = a => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SA = SG.annual, SQ = SG.quarterly, ann = fy => SA.find(a => a.fy === fy);
const price = M.price.last, sh = C.shares.count, mcap = price * sh, ps = v => v / sh;
const CLOSE = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', `${ASOF}.json`), 'utf8')).closes;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const T = 0.2517; // statutory tax; dividends are deductible under s.80M
const CASES = ['base', 'bull', 'bear'];

// 1) Price x volume build (assumptions.json 'build'), the source of the segment growth and margin
const B = AS.build, b0 = B.base;
const build = AS.years.map((y, i) => {
  const crude = b0.crudeRev * (B.crudeSoldMmt[i] / b0.crudeSoldMmt) * (B.brent[i] / b0.brent) * (B.inrUsd[i] / b0.inrUsd);
  const gas = b0.gasRev * (B.gasSoldBcm[i] / b0.gasSoldBcm) * (B.gasUsd[i] / b0.gasUsd) * (B.inrUsd[i] / b0.inrUsd);
  const rev = crude + gas + B.vapRev[i] + B.otherOpRev[i];
  const cess = crude * B.cessPct[i] / 100, royalty = (crude + gas) * B.royaltyPct[i] / 100, levies = cess + royalty + B.otherLevies[i];
  const ebitda = rev - levies - B.opex[i] - B.explorationWo[i] - B.otherCosts[i];
  return { y, crude, gas, vap: B.vapRev[i], oth: B.otherOpRev[i], rev, cess, royalty, levies, opex: B.opex[i], expl: B.explorationWo[i], other: B.otherCosts[i], ebitda, margin: ebitda / rev * 100 };
});
const buildGrowth = build.map((r, i) => (r.rev / (i ? build[i - 1].rev : b0.rev) - 1) * 100);

// 2) Core profit (before dividends from the stakes; normalised tax) per case, from the segment path with scenario deltas
const seg = AS.segments[0], DIV = AS.dividendIncome;
const corePath = c => { const d = AS.scenarios[c]?.segments?.ep || {}; let r = seg.base; return AS.years.map((y, i) => { r *= 1 + (seg.growth[i] + (d.growthDelta || 0)) / 100; const e = r * (seg.marginPct[i] + (d.marginDelta || 0)) / 100; const pbt = e - F.dep[i] + AS.otherIncome[i] - AS.interest[i]; return { y, rev: r, ebitda: e, pbt, core: (pbt - DIV[i]) * (1 - T), pat: pbt - (pbt - DIV[i]) * T }; }); };
const CP = Object.fromEntries(CASES.map(c => [c, corePath(c)]));
const coreSep = c => sep(CP[c].map(r => r.core)), coreSepEps = c => coreSep(c) / sh;

// 3) Historic core profit: normalised = (PBT before exceptional items - dividends) x (1 - 25.17%); reported = PAT - dividends
const PL = S.tables['profit-loss'], col = p => PL.periods.indexOf(p), plv = (k, fy) => PL.rows[k][col(`Mar 20${fy.slice(2)}`)];
const EXC = { FY20: -4899, FY21: 1375, FY23: -9235 }; // AR FY26 ten-year table (FY23 restated figure)
const HFY = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const DIVH = { FY19: 3105, ...C.otherIncomeFy26.dividendHistoryCr };
const coreNorm = Object.fromEntries(HFY.map(fy => [fy, (plv('Profit before tax', fy) - (EXC[fy] || 0) - DIVH[fy]) * (1 - T)]));
const coreRep = Object.fromEntries(HFY.map(fy => [fy, plv('Net Profit', fy) - DIVH[fy]]));
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const fwdCore = (fy, basis = 'norm') => (fy <= 2026 ? (basis === 'norm' ? coreNorm : coreRep)[`FY${String(fy).slice(2)}`] : CP.base[fy - 2027].core);

// 4) Stakes and other parts
const ST = C.stakes.listed, LSYM = Object.keys(ST);
const stakeMv = Object.fromEntries(LSYM.map(s => [s, ST[s].sharesCr * CLOSE[s]]));
const listedMv = LSYM.reduce((t, s) => t + stakeMv[s], 0);
const DISC = { base: 20, bull: 20, bear: 25 }; // §7c: 20% unless the street clearly differs (JM, BOB 20%; MOSL, PL 25%; Geojit 50%)
const OVLPS = { base: (7 + 23) / 2, bull: 23, bear: 7 }; // street values per share: JM 7x FY28E EPS = Rs7; MOSL 0.5x FY25 book = Rs23
const OVL = Object.fromEntries(CASES.map(c => [c, OVLPS[c] * sh]));
const UC = C.stakes.unlistedCostCr, UNL_ALL = Object.entries(UC).filter(([k]) => k !== 'ONGC Videsh').reduce((t, [, v]) => t + v, 0);
const OPAL = UC['ONGC Petro additions (OPaL)'], UNL = { base: UNL_ALL, bull: UNL_ALL, bear: UNL_ALL - OPAL };

// 5) Core multiple from ONGC's own history: implied forward core P/E = (market value - listed stakes x 0.8 - OVL - unlisted at cost) / next-FY core profit
const at = (ser, d) => { let v = null; for (const [x, p] of ser) { if (x <= d) v = p; else break; } return v; };
const PX = S.charts.price.Price, SPX = Object.fromEntries(LSYM.map(s => [s, scr(s).charts.price.Price]));
const impliedAt = (d, oPx, basis = 'norm', disc = DISC.base) => { const mc = oPx * sh, L = LSYM.reduce((t, s) => t + ST[s].sharesCr * (d === ASOF ? CLOSE[s] : at(SPX[s], d)), 0), resid = mc - L * (1 - disc / 100) - OVL.base - UNL.base, fc = fwdCore(fyOf(d), basis); return { d, px: oPx, mc, L, resid, fc, pe: resid / fc }; };
const WK = PX.filter(([d]) => d >= '2021-04-01' && d <= ASOF);
const impl = WK.map(([d, p]) => impliedAt(d, p)), implRep = WK.map(([d, p]) => impliedAt(d, p, 'rep'));
const implMed = med(impl.map(r => r.pe)), implP25 = pct(impl.map(r => r.pe), 0.25), implP75 = pct(impl.map(r => r.pe), 0.75), implMedRep = med(implRep.map(r => r.pe));
const implNow = impliedAt(ASOF, price);
const implSepNow = (mcap - listedMv * (1 - DISC.base / 100) - OVL.base - UNL.base) / coreSep('base');
const troughCore = HFY.slice(3).filter(fy => { const i = HFY.indexOf(fy), pk = Math.max(...HFY.slice(i - 3, i).map(f => coreNorm[f])); return coreNorm[fy] < 0.5 * pk; });

// 6) Sector move (§7c): oil-and-gas set excluding ONGC and distorted names
const PEER_SYMS = D.peers.set, EXCL = Object.keys(D.peers.excluded).filter(s => s !== 'ONGC'), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const PEERS = peersAsOf(['ONGC', ...PEER_SYMS, 'MRPL'], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = s => med((scr(s).charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]));
const MED5 = Object.fromEntries(['ONGC', ...PEER_SYMS, 'MRPL'].map(s => [s, med5(s)]));
const derate = Object.fromEntries(Object.keys(MED5).map(s => [s, P[s]?.pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const sectorDr = med(USED.map(s => derate[s])), k = 1 + sectorDr / 100;
const subDr = Object.fromEntries(Object.entries(D.peers.subsets).map(([n, ss]) => [n, med(ss.filter(s => USED.includes(s)).map(s => derate[s]))]));
const CM = { base: half(implMed * k), bull: half(implP75 * k), bear: half(implP25 * k) };

// 7) SOTP per case (Rs crore)
const sotpCase = c => { const core = CM[c] * coreSep(c), disc = -DISC[c] / 100 * listedMv; return { core, ...stakeMv, disc, ovl: OVL[c], unl: UNL[c], total: core + listedMv + disc + OVL[c] + UNL[c] }; };
const SOTP = Object.fromEntries(CASES.map(c => [c, sotpCase(c)]));

// 8) P/E cross-check on reported standalone EPS: own forward median (trough years left out) x sector move
const FM = forwardMedian('ONGC', M);
const fmP25 = pct(FM.series.map(x => x[1]), 0.25), fmP75 = pct(FM.series.map(x => x[1]), 0.75);
const PEM = { base: half(FM.median * k), bull: half(fmP75 * k), bear: half(fmP25 * k) };

const BM = V.blend?.methods || [], mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const STR = D.street.brokers, current = STR.filter(s => /^Current/.test(s.standing) && s.tp), medTp = med(current.map(s => s.tp));
const shortName = s => ({ ONGC: 'ONGC', OIL: 'Oil India', COALINDIA: 'Coal India', IOC: 'Indian Oil', BPCL: 'BPCL', HINDPETRO: 'HPCL', GAIL: 'GAIL', PETRONET: 'Petronet LNG', MRPL: 'MRPL' }[s] || s);

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, half, med, pct, SA, SQ, ann, price, sh, mcap, ps, sep, T, CASES,
  build, buildGrowth, CP, coreSep, coreSepEps, coreNorm, coreRep, EXC, HFY, DIVH, fyOf, ST, LSYM, stakeMv, listedMv, DISC, OVLPS, OVL, UC, UNL_ALL, OPAL, UNL,
  impl, implRep, implMed, implP25, implP75, implMedRep, implNow, implSepNow, troughCore, impliedAt, PEER_SYMS, EXCL, USED, PEERS, P, MED5, derate, sectorDr, k, subDr, CM, SOTP,
  FM, fmP25, fmP75, PEM, BM, mv, rating, buyBelow, sellAbove, ruleText, STR, current, medTp, shortName, CLOSE };

if (require.main === module) {
  build.forEach((r, i) => console.log(r.y, 'rev', n0(r.rev), 'g', n1(buildGrowth[i]), 'ebitda', n0(r.ebitda), 'm', n1(r.margin), '| model', n0(F.sales[i]), n0(F.ebitda[i]), 'pat', n0(F.pat[i]), 'eps', n1(F.eps[i])));
  console.log('core', CASES.map(c => `${c}: ${CP[c].map(r => n0(r.core)).join('/')} sep ${n0(coreSep(c))} (${n1(coreSepEps(c))}/sh)`).join(' | '));
  console.log('coreNorm', HFY.map(f => `${f}:${n0(coreNorm[f])}`).join(' '), '| coreRep', HFY.map(f => `${f}:${n0(coreRep[f])}`).join(' '), 'trough', troughCore);
  console.log('implied core P/E: med', n1(implMed), 'p25', n1(implP25), 'p75', n1(implP75), 'medRep', n1(implMedRep), 'n', impl.length, '| now fwd', n1(implNow.pe), 'on Sep-28E', n1(implSepNow));
  console.log('derate', Object.entries(derate).map(([s, v]) => `${s} ${v?.toFixed(1)}`).join(', '), '| sector', n1(sectorDr), 'subs', JSON.stringify(subDr), 'CM', JSON.stringify(CM));
  console.log('stakes', Object.entries(stakeMv).map(([s, v]) => `${s} ${n0(v)}`).join(' '), 'total', n0(listedMv), `(${n1(ps(listedMv))}/sh)`, 'UNL', n0(UNL_ALL), 'OVL', n0(OVL.base));
  for (const c of CASES) { const s = SOTP[c]; console.log(c, 'core', n0(s.core), 'disc', n0(s.disc), 'ovl', n0(s.ovl), 'unl', n0(s.unl), 'total', n0(s.total), 'ps', n0(ps(s.total)), pc((ps(s.total) / price - 1) * 100)); }
  console.log('FM', n1(FM.median), n1(FM.medianAll), FM.troughYears, 'p25', n1(fmP25), 'p75', n1(fmP75), 'PEM', JSON.stringify(PEM), '| TP', V.tp, V.upside && n1(V.upside), rating, 'medTp', medTp);
}
