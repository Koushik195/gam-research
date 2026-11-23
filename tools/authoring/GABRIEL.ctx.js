// Gabriel India initiation: shared context for the Part B files. Loads the research JSONs and the built model, runs the
// entity build (standalone; subsidiaries) and the JV/associate build, and derives the P/E and EV/EBITDA multiples
// (house rule, PLAYBOOK §4 and §7c) once. The business changed with the scheme ("Project Rise", announced 30-Jun-2025),
// so the own-history window starts at the announcement (1-Jul-2025, MOTHERSON / ASTERDM precedent) and, being ~15 months,
// is paired with the auto-component peers' move against their own medians over the same window (HYUNDAI precedent).
// sync*() write build outputs and multiples into assumptions.json; re-run node src/model.js GABRIEL after any change.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { SH, R: R26 } = require('./GABRIEL.patch');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'GABRIEL', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'GABRIEL.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'GABRIEL', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', SCHEME = '2025-07-01', JUPITER = '2026-07-21';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SA = SG.annual, SQ = SG.quarterly, Q1 = C.q1fy27, b = A.labels.length - 1;
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E

// 1) Entity build and JV build
function runBuild(BL) {
  let sa = BL.base.sa, sub = BL.base.sub, prev = sa + sub; const out = [];
  for (let i = 0; i < 3; i++) {
    sa *= 1 + BL.saGrowth[i] / 100; sub *= 1 + BL.subGrowth[i] / 100;
    const se = sa * BL.saMargin[i] / 100, ue = sub * BL.subMargin[i] / 100, rev = sa + sub;
    out.push({ y: ['FY27E', 'FY28E', 'FY29E'][i], sa, sub, se, ue, rev, ebitda: se + ue, growth: (rev / prev - 1) * 100, margin: (se + ue) / rev * 100 }); prev = rev;
  }
  return out;
}
function runJv(J) {
  return J.items.map(it => { let pat = it.basePat; const share = [], pat100 = [];
    for (let i = 0; i < 3; i++) { pat *= 1 + it.growth[i] / 100; pat100.push(pat); share.push(it.abs ? it.abs[i] : it.stake / 100 * pat * it.months[i] / 12); }
    return { key: it.key, name: it.name, pat100, share }; });
}
const BL = AS.build, bld = runBuild(BL), jv = runJv(AS.jvBuild);
const jvTot = [0, 1, 2].map(i => jv.reduce((s, x) => s + x.share[i], 0));
const jvOf = k => jv.find(x => x.key === k).share;
const oiBuilt = jvTot.map((t, i) => t + AS.recurringOI[i]);
const assertBuild = () => {
  bld.forEach((r, i) => { if (Math.abs(F.sales[i] / r.rev - 1) > 0.002 || Math.abs(F.ebitda[i] / r.ebitda - 1) > 0.003) throw new Error(`GABRIEL build ${r.y}: revenue ${n0(F.sales[i])} vs ${n0(r.rev)}, EBITDA ${n0(F.ebitda[i])} vs ${n0(r.ebitda)}`); });
  oiBuilt.forEach((o, i) => { if (Math.abs(o - F.otherIncome[i]) > 0.6) throw new Error(`GABRIEL other income ${i}: ${o} vs ${F.otherIncome[i]}`); });
};
const ncdInt = [1000 * 0.0815 * 6.7 / 12, 81.5, 81.5]; // 8.15% NCDs from 10-Sep-2026
const taxBuilt = [0, 1, 2].map(i => ((F.pbt[i] - jvTot[i]) * AS.opTaxRate[i] / 100 + AS.minorities[i]) / F.pbt[i] * 100);
const jvPctPbt = [0, 1, 2].map(i => jvTot[i] / F.pbt[i] * 100), jvPct26 = R26.jv / R26.pbt * 100;
// Earnings before Project Jupiter (what the market could price before 21-Jul-2026): drop HMAI and HL Klemove, add back
// the NCD interest after operating tax, on the 17.72 cr post-scheme shares.
const exJupPat = [0, 1, 2].map(i => F.pat[i] - jvOf('hmai')[i] - jvOf('klemove')[i] + ncdInt[i] * (1 - AS.opTaxRate[i] / 100));
const exJupEps = exJupPat.map(p => p / SH.postScheme), accretion = [0, 1, 2].map(i => (F.eps[i] / exJupEps[i] - 1) * 100);

// 2) Forward P/E: every weekly close since the scheme announcement (+ the as-of close)
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsPost = { 2027: F.eps[0], 2028: F.eps[1], 2029: F.eps[2] }, epsPre = { 2027: exJupEps[0], 2028: exJupEps[1] };
const pxAll = S.charts.price.Price.filter(([d]) => d <= ASOF); if (pxAll.at(-1)[0] < ASOF) pxAll.push([ASOF, price]);
const fwdScheme = pxAll.filter(([d]) => d >= SCHEME).map(([d, p]) => [d, Math.round(p / (d < JUPITER ? epsPre : epsPost)[fyOf(d)] * 10) / 10]);
const FMs = { median: medOf(fwdScheme.map(x => x[1])), p25: pct(fwdScheme.map(x => x[1]), 0.25), p75: pct(fwdScheme.map(x => x[1]), 0.75), n: fwdScheme.length };
const FMhouse = forwardMedian('GABRIEL', M, { from: SCHEME }); // house function: every 5th point, post-Jupiter EPS throughout
// Pre-scheme history (Apr-2021 to Jun-2025) on the old company's EPS: standalone FY22-23 (the group then), consolidated
// FY24-25, FY26 as reported before the scheme (Rs17.55); a sensitivity only.
const epsOld = { 2022: 6.23, 2023: 9.21, 2024: 12.44, 2025: 17.05, 2026: R26.epsBefore || 17.55, 2027: exJupEps[0] };
const fwdOld = pxAll.filter(([d]) => d >= '2021-04-01' && d < SCHEME).map(([d, p]) => [d, Math.round(p / epsOld[fyOf(d)] * 10) / 10]);
const oldMed = medOf(fwdOld.map(x => x[1])), fullMed = medOf([...fwdOld, ...fwdScheme].map(x => x[1]));
const fwdAll = [...fwdOld, ...fwdScheme];
const byBucket = {}; fwdScheme.forEach(([d, x]) => { const k = d < '2026-04-01' ? 'Jul-25–Mar-26 (FY27E, pre-Jupiter)' : d < JUPITER ? 'Apr-26–20-Jul-26 (FY28E, pre-Jupiter)' : '21-Jul-26–30-Sep-26 (FY28E, post-Jupiter)'; (byBucket[k] ||= []).push(x); });
const buckets = Object.entries(byBucket).map(([k, v]) => ({ k, n: v.length, med: medOf(v), lo: Math.min(...v), hi: Math.max(...v) }));
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps), fwd27 = price / F.eps[0];
const trailEps = M.quarterly.pat.slice(-4).reduce((s, x) => s + x, 0) / shares, trailPe = price / trailEps;
const px52 = S.charts.price.Price.filter(([d]) => d > '2025-09-30' && d <= ASOF).map(x => x[1]);
const hi52 = Math.max(...px52, price), lo52 = Math.min(...px52, price);

// 3) Sector move: peers' trailing P/E at the 30-Sep close vs their own medians over the same window (primary) and five years
const PEER_SYMS = D.peers.set, EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const PEERS = peersAsOf(['GABRIEL', ...PEER_SYMS], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const medFrom = (sym, from) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return pct((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= from && x > 0).map(x => x[1]), 0.5); };
const MEDW = Object.fromEntries(PEER_SYMS.map(s => [s, medFrom(s, SCHEME)])), MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, medFrom(s, '2021-09-30')]));
const drW = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].pe / MEDW[s] - 1) * 100])), dr5 = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].pe / MED5[s] - 1) * 100]));
const sectorW = medOf(USED.map(s => drW[s])), sectorWAll = medOf(PEER_SYMS.map(s => drW[s])), sector5 = medOf(USED.map(s => dr5[s]));
const k = 1 + sectorW / 100, k5 = 1 + sector5 / 100;
const shortName = s => ({ GABRIEL: 'Gabriel India', BOSCHLTD: 'Bosch', MOTHERSON: 'Samvardhana Motherson', BHARATFORG: 'Bharat Forge', UNOMINDA: 'Uno Minda', SCHAEFFLER: 'Schaeffler India', TIINDIA: 'Tube Investments', ENDURANCE: 'Endurance Tech', ZFCVINDIA: 'ZF CV Control', MSUMI: 'Motherson Sumi Wiring', SONACOMS: 'Sona Comstar', CRAFTSMAN: 'Craftsman' }[s] || s);

// 4) Multiples (nearest half-turn): base = own median since the scheme x same-window sector move; bull = no move; bear = 25th pct x move
const MULT = { base: half(FMs.median * k), bull: half(FMs.median), bear: half(FMs.p25 * k) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= SCHEME && d <= ASOF && x > 0).map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25), evNow = P.GABRIEL.evEbitda;
const scrEbitda = (S.charts.evEbitda.EBITDA || []).filter(([d]) => d <= ASOF).at(-1)[1]; // Screener's trailing EBITDA behind its multiple
const ebitdaSep28 = sep(F.ebitda), evConv = scrEbitda / ebitdaSep28;
const evMULT = { base: half(evMed * k * evConv), bull: half(evMed * evConv), bear: half(evP25 * k * evConv) };
const SENS = { house: half(FMhouse.median * k), full: half(fullMed * k5), old: half(oldMed * k5), five: half(FMs.median * k5), withBf: half(FMs.median * (1 + sectorWAll / 100)), mosl: 40, choice: 32 };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100;
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= JUPITER && s.tp), medTp = medOf(postQ1.map(s => s.tp));
const ndExJv = F.treasury.map((t, i) => t - (M.annual.investments[b])); // treasury less the opening stakes (rough net cash)

const writeAs = fn => { const FILE = path.join(RD, 'assumptions.json'), as = JSON.parse(fs.readFileSync(FILE, 'utf8')), before = JSON.stringify(as); fn(as); if (JSON.stringify(as) === before) return false; fs.writeFileSync(FILE, JSON.stringify(as, null, 1)); return true; };
const r3 = v => Math.round(v * 1000) / 1000;
function syncBuild() { // revenue growth, EBITDA margin, other income (JV build), effective tax
  const ch = writeAs(as => { const r = runBuild(as.build), j = runJv(as.jvBuild);
    as.revenueGrowth = r.map(x => r3(x.growth)); as.ebitdaMargin = r.map(x => r3(x.margin));
    as.otherIncome = [0, 1, 2].map(i => r3(j.reduce((s, x) => s + x.share[i], 0) + as.recurringOI[i]));
    const jt = [0, 1, 2].map(i => j.reduce((s, x) => s + x.share[i], 0));
    as.taxRate = [0, 1, 2].map(i => r3(((F.pbt[i] - jt[i]) * as.opTaxRate[i] / 100 + as.minorities[i]) / F.pbt[i] * 100)); });
  console.log(ch ? 'GABRIEL build/OI/tax UPDATED: re-run node src/model.js GABRIEL' : 'GABRIEL build unchanged'); return ch;
}
function syncMultiples() {
  const ch = writeAs(as => { as.valuation.blend.methods.find(x => x.key === 'pe').multiple = MULT; as.valuation.blend.methods.find(x => x.key === 'ev').multiple = evMULT; });
  console.log(ch ? `GABRIEL multiples UPDATED: P/E ${JSON.stringify(MULT)}, EV/EBITDA ${JSON.stringify(evMULT)}` : 'GABRIEL multiples unchanged'); return ch;
}

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, SCHEME, JUPITER, SH, R26, n0, n1, n2, pc, pc1, half, shortDate, medOf, pct, SA, SQ, Q1, b, price, shares, mcap, sep,
  BL, bld, jv, jvTot, jvOf, oiBuilt, assertBuild, ncdInt, taxBuilt, jvPctPbt, jvPct26, exJupPat, exJupEps, accretion, fyOf, fwdScheme, FMs, FMhouse, fwdOld, oldMed, fullMed, fwdAll, buckets, fwdNow, sepNow, fwd27, trailEps, trailPe, hi52, lo52,
  PEER_SYMS, EXCL, USED, PEERS, P, MEDW, MED5, drW, dr5, sectorW, sectorWAll, sector5, k, k5, shortName, MULT, epsSep, evHist, evMed, evP25, evNow, scrEbitda, ebitdaSep28, evConv, evMULT, SENS,
  BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, ST, postQ1, medTp, ndExJv, syncBuild, syncMultiples };

if (require.main === module) {
  console.log('build', bld.map(r => [r.y, n0(r.rev), n1(r.growth), n1(r.margin)]), 'jv', jv.map(x => `${x.key} ${x.share.map(n1).join('/')}`).join(' | '), 'jvTot', jvTot.map(n1), 'oi', oiBuilt.map(n1), 'tax', taxBuilt.map(n2), 'jv%pbt', jvPctPbt.map(n1), n1(jvPct26));
  console.log('exJup eps', exJupEps.map(n2), 'post', F.eps.map(n2), 'accretion', accretion.map(n1));
  console.log('FMs', FMs, 'house', FMhouse.median, FMhouse.series.length, 'old', oldMed, 'full', fullMed, buckets.map(x => `${x.k}: ${n1(x.med)} (${x.lo}-${x.hi}, n${x.n})`).join(' | '));
  console.log('drW', USED.map(s => `${s} ${n1(drW[s])}`).join(', '), 'sectorW', n2(sectorW), 'all', n2(sectorWAll), 'sector5', n2(sector5));
  console.log('MULT', MULT, 'ev', evMed, evP25, evNow, n2(evConv), evMULT, 'SENS', SENS, 'epsSep', epsSep, 'tp', V.tp, n1(V.upside), rating, 'medTp', medTp, 'now', n1(fwd27), n1(fwdNow), n1(sepNow), 'trail', n1(trailPe), hi52, lo52, 'mv', BM.map(m => [m.key, Math.round(m.value)]));
}
