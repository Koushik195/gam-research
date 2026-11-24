// Ramkrishna Forgings initiation: shared context for the Part B files. Loads the research JSONs and the built model,
// checks the three-line revenue build (standalone domestic, standalone exports, subsidiaries/other net) against model
// revenue, reconciles other income, builds EPS before one-offs, and derives the P/E and EV/EBITDA multiples (house
// rule, PLAYBOOK §4 and §7c) once. syncBuild() writes revenue growth from the build into assumptions.json;
// syncMultiples() writes the derived multiples (EPS does not depend on them, so one pass converges). As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'RKFORGE', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'RKFORGE.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'RKFORGE', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2021-04-01';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const yr = fy => SA.find(a => a.fy === fy);
const Q1 = C.q1fy27, b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E

// 1) Revenue build vs model revenue
function runBuild(BL) {
  let dom = BL.base.dom, exp = BL.base.exp, oth = BL.base.oth, prev = dom + exp + oth; const out = [];
  for (let i = 0; i < 3; i++) {
    dom *= 1 + BL.domGrowth[i] / 100; exp *= 1 + BL.expGrowth[i] / 100; oth *= 1 + BL.othGrowth[i] / 100;
    const rev = dom + exp + oth; out.push({ y: ['FY27E', 'FY28E', 'FY29E'][i], dom, exp, oth, rev, growth: (rev / prev - 1) * 100 }); prev = rev;
  }
  return out;
}
const BL = AS.build, bld = runBuild(BL), baseGap = (A.sales[b] / (BL.base.dom + BL.base.exp + BL.base.oth) - 1) * 100;
bld.forEach((r, i) => { r.gap = (F.sales[i] / r.rev - 1) * 100 - baseGap; });
const assertBuild = () => bld.forEach((r, i) => { if (Math.abs(r.gap) > 0.3) throw new Error(`RKFORGE build check ${r.y}: revenue ${n0(F.sales[i])} vs ${n0(r.rev)}. Run syncBuild().`); });
const expShare = bld.map(r => r.exp / r.rev * 100);

// 2) Other income: recurring + JV share (built in assumptions); check FY27E against the run-rate before exceptional items
const OI_REC = [12, 12, 14], JV = F.otherIncome.map((x, i) => x - OI_REC[i]);
const oiCheck = { fy27: F.otherIncome[0], recurringFy26: 13.1, q1: 3, jv27: JV[0] };
const assertOi = () => { if (Math.abs(F.otherIncome[0] - (12 + JV[0])) > 0.5 || F.otherIncome[0] > 20) throw new Error(`RKFORGE other income FY27E ${F.otherIncome[0]} off the build`); };
const nd = F.treasury.map(t => -t), nd0 = A.borrowings[b] - (A.cash[b] || 0) - A.investments[b]; // engine basis (Mar-26 pro forma for the warrant money)
const ndEbitda = nd.map((x, i) => x / F.ebitda[i]);

// 3) EPS before one-offs and the forward P/E history (PLAYBOOK §4: base on EPS before one-offs; house median on reported EPS shown)
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const repBy = {}; S.tables['profit-loss'].periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) repBy[+p.slice(-4)] = S.tables['profit-loss'].rows['EPS in Rs'][i]; });
F.years.forEach((y, i) => { repBy[2000 + +y.slice(2, 4)] = F.eps[i]; });
const cleanBy = { ...repBy }; C.annualKpis.forEach(k => { cleanBy[2000 + +k.fy.slice(2, 4)] = k.cleanEps; });
const INV25 = 170.3 * (1 - 0.2517) / 18.08; // FY25 P&L charge for the inventory overstatement (Rs220.52 cr at Mar-25 less Rs50.22 cr at Mar-24), after tax, per share
const invBy = { ...cleanBy, 2025: cleanBy[2025] + INV25 };
const trough = (by, fy) => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); const pk = prev.length ? Math.max(...prev) : null; return !(by[fy] > 0) || (pk > 0 && by[fy] < 0.5 * pk); };
const pxW = S.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0); // the house grid (forwardSeries)
const onEps = (by, from = FROM) => { const all = pxW.filter(([d]) => d >= from).map(([d, p]) => [d, Math.round(p / by[fyOf(d)] * 10) / 10, fyOf(d)]);
  const kept = all.filter(x => !trough(by, x[2])); const v = kept.map(x => x[1]);
  return { all, kept, med: pct(v, 0.5), p25: pct(v, 0.25), p75: pct(v, 0.75), troughYears: [...new Set(all.filter(x => trough(by, x[2])).map(x => `FY${String(x[2]).slice(2)}`))] }; };
const OWN = onEps(cleanBy), INV = onEps(invBy), POST23 = onEps(cleanBy, '2023-04-01');
const FM = forwardMedian('RKFORGE', M); // house function, reported EPS
const buckets = [...new Set(OWN.all.map(x => x[2]))].map(fy => { const v = OWN.all.filter(x => x[2] === fy).map(x => x[1]), r = pxW.filter(([d]) => d >= FROM && fyOf(d) === fy).map(([d, p]) => Math.round(p / repBy[fy] * 10) / 10);
  return { fy: `FY${String(fy).slice(2)}`, period: `Apr-${String(fy - 2).slice(2)}–${fy - 1 > 2026 ? 'Sep-26' : 'Mar-' + String(fy - 1).slice(2)}`, n: v.length, clean: cleanBy[fy], rep: repBy[fy], med: medOf(v), repMed: medOf(r), trough: trough(cleanBy, fy), repTrough: trough(repBy, fy) }; });
const fwdPe = forwardSeries('RKFORGE', M, 'eps').filter(x => x[0] >= '2016-04-01');
const sepNow = price / sep(F.eps), fwd27 = price / F.eps[0], fwd28 = price / F.eps[1];
const trailEps = M.quarterly.pat.slice(-4).reduce((s, x) => s + x, 0) / shares, trailPe = price / trailEps;
const fy27Threshold = 0.5 * Math.max(repBy[2024], repBy[2025], repBy[2026]); // house trough test for FY27E (reported EPS)

// 4) Sector de-rating: auto-component peers' trailing P/E at the 30-Sep close vs five-year medians (§7c)
const PEER_SYMS = D.peers.set, FORG = D.peers.forging, ALL = [...new Set([...PEER_SYMS, ...FORG, 'RKFORGE'])];
const PEERS = peersAsOf(ALL, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]); return v.length ? pct(v, 0.5) : null; };
const MED5 = Object.fromEntries(ALL.map(s => [s, med5(s)]));
const derate = Object.fromEntries(ALL.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.map(s => derate[s])), sectorDrCr = medOf([...USED, 'CRAFTSMAN', 'CIEINDIA'].map(s => derate[s]));
const k = 1 + sectorDr / 100;
const shortName = s => ({ MOTHERSON: 'Samvardhana Motherson', BOSCHLTD: 'Bosch', SONACOMS: 'Sona BLW', UNOMINDA: 'Uno Minda', SCHAEFFLER: 'Schaeffler India', ENDURANCE: 'Endurance Tech', ZFCVINDIA: 'ZF CV Control', TIINDIA: 'Tube Investments', MSUMI: 'Motherson Sumi Wiring', GABRIEL: 'Gabriel India', BHARATFORG: 'Bharat Forge', HAPPYFORGE: 'Happy Forgings', GNA: 'GNA Axles', CIEINDIA: 'CIE Automotive', CRAFTSMAN: 'Craftsman Automation', RKFORGE: 'Ramkrishna Forgings' }[s] || s);

// 5) Multiples (nearest half-turn): base = own clean median x sector move; bull = no sector move; bear = 25th pct x move
const MULT = { base: half(OWN.med * k), bull: half(OWN.med), bear: half(OWN.p25 * k) };
const epsSep = { base: sep(F.eps), bull: sep(SC.bull.eps), bear: sep(SC.bear.eps) };
const SENS = { house: half(FM.median * k), inv: half(INV.med * k), post23: half(POST23.med * k), withCr: half(OWN.med * (1 + sectorDrCr / 100)), db: 27 };
const evAll = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= FROM && d <= ASOF && x > 0), evHist = evAll.map(x => x[1]);
const evMed = pct(evHist, 0.5), evP25 = pct(evHist, 0.25), evNow = P.RKFORGE.evEbitda;
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = sep(F.ebitda), evConv = ttmEbitda / ebitdaSep28;
const evMULT = { base: half(evMed * k * evConv), bull: half(evMed * evConv), bear: half(evP25 * k * evConv) };

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, CONS = D.street.consensus, medTp = medOf([...ST.map(s => s.tp), CONS.avgTp]);

function syncBuild() {
  const FILE = path.join(RD, 'assumptions.json'), as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const g = runBuild(as.build).map(x => Math.round(x.growth * 1000) / 1000);
  if (JSON.stringify(g) === JSON.stringify(as.revenueGrowth)) { console.log('RKFORGE build unchanged'); return false; }
  as.revenueGrowth = g; fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  console.log(`RKFORGE build UPDATED: growth ${g}. Re-run node src/model.js RKFORGE.`); return true;
}
function syncMultiples() {
  const FILE = path.join(RD, 'assumptions.json'), as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(x => x.key === 'pe'), ev = as.valuation.blend.methods.find(x => x.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(x => a?.[x] === c[x]);
  if (same(pe.multiple, MULT) && same(ev.multiple, evMULT)) { console.log(`RKFORGE multiples unchanged: P/E ${JSON.stringify(MULT)}, EV/EBITDA ${JSON.stringify(evMULT)}`); return false; }
  pe.multiple = MULT; ev.multiple = evMULT; fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  console.log(`RKFORGE multiples UPDATED: P/E ${JSON.stringify(MULT)}, EV/EBITDA ${JSON.stringify(evMULT)}. Re-run node src/model.js RKFORGE, then node tools/authoring/RKFORGE.js.`); return true;
}

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, n0, n1, n2, pc, pc1, half, medOf, pct, SA, SQ, QL, yr, Q1, b, price, shares, mcap, sep,
  BL, bld, assertBuild, expShare, OI_REC, JV, oiCheck, assertOi, nd, nd0, ndEbitda, fyOf, repBy, cleanBy, INV25, OWN, INV, POST23, FM, buckets, fwdPe, sepNow, fwd27, fwd28, trailEps, trailPe, fy27Threshold,
  PEER_SYMS, FORG, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, sectorDrCr, k, shortName, MULT, epsSep, SENS, evHist, evAll, evMed, evP25, evNow, evConv, ttmEbitda, ebitdaSep28, evMULT,
  BM, mv, rating, buyBelow, sellAbove, ST, CONS, medTp, syncBuild, syncMultiples };

if (require.main === module) {
  console.log('build', bld.map(r => [r.y, Math.round(r.rev), n1(r.growth), r.gap.toFixed(2)]), 'baseGap', baseGap.toFixed(3), 'oi', oiCheck, 'JV', JV, 'nd0', n0(nd0), 'nd', nd.map(n0), 'nd/ebitda', ndEbitda.map(n2));
  console.log('OWN', OWN.med, OWN.p25, OWN.p75, OWN.troughYears, OWN.kept.length, '| INV', INV.med, INV.troughYears, '| post23', POST23.med, '| house', FM.median, FM.medianAll, FM.troughYears, 'fy27thr', n2(fy27Threshold), 'eps', F.eps);
  console.log(buckets.map(x => `${x.fy}: clean ${x.clean} ${n1(x.med)}x${x.trough ? ' T' : ''} | rep ${x.rep} ${n1(x.repMed)}x${x.repTrough ? ' T' : ''} (${x.n})`).join('\n'));
  console.log('derate', ALL.map(s => `${s} ${derate[s]?.toFixed(1)}`).join(', '), '| sector', sectorDr.toFixed(2), 'all', sectorDrAll.toFixed(2), '+CR/CIE', sectorDrCr.toFixed(2));
  console.log('MULT', MULT, 'SENS', SENS, 'ev', evMed, evP25, evNow, n2(evConv), evMULT, 'epsSep', epsSep, 'tp', V.tp, n1(V.upside), rating, 'medTp', medTp, 'fwd', n1(fwd27), n1(fwd28), n1(sepNow), 'trail', n1(trailPe));
}
