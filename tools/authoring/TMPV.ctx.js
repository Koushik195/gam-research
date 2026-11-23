// Tata Motors Passenger Vehicles initiation: shared context for the Part B files. Loads the research JSONs and the
// built model, checks the JLR (GBP x FX) and India PV (units x realisation) builds, and derives the SOTP multiples
// once (house rule, PLAYBOOK §4 and §7c). History before the Oct-2025 demerger includes commercial vehicles, so the
// stock's own multiples are measured only from the first full ex-CV week (17-Oct-2025) to 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'TMPV', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const scr = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'TMPV.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', FROM = '2025-10-17';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const at = (series, d) => { const s = (series || []).filter(([x, v]) => x <= d && v != null); return s.length ? s[s.length - 1][1] : null; };
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), yr = fy => SA.find(a => a.fy === fy);
const A26 = yr('FY26'), A25 = yr('FY25'), Q1 = C.q1fy27, b = A.labels.length - 1;
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const seg = k => F.seg[k];
const closes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', `${ASOF}.json`), 'utf8')).closes;

// 1) Builds: JLR GBP revenue x INR/GBP; India PV units x realisation -> must match the engine's segment revenue
const JB = AS.jlrBuild, PB = AS.pvBuild;
const jlrB = F.years.map((y, i) => ({ y, gbp: JB.revGbp[i], fx: JB.fx[i], inr: JB.revGbp[i] * JB.fx[i] / 10, model: seg('jlr').revenue[i], gbpG: (JB.revGbp[i] / (i ? JB.revGbp[i - 1] : JB.base.revGbp) - 1) * 100 }));
const pvB = []; { let u = PB.base.units, r = PB.base.realisation; F.years.forEach((y, i) => { u *= 1 + PB.unitGrowth[i] / 100; r *= 1 + PB.realisationGrowth[i] / 100; pvB.push({ y, units: u, real: r, rev: u * r / 1e7, model: seg('pv').revenue[i] }); }); }
[...jlrB.map(x => [x.y, x.inr, x.model, 'JLR']), ...pvB.map(x => [x.y, x.rev, x.model, 'PV'])].forEach(([y, a, m, k]) => { if (Math.abs(m / a - 1) > 0.003) throw new Error(`TMPV ${k} build ${y}: model ${n0(m)} vs build ${n0(a)}`); });
const segSum = F.years.map((_, i) => ['jlr', 'pv', 'oth'].reduce((s, k) => s + seg(k).adjEbitda[i], 0));
F.years.forEach((y, i) => { if (Math.abs(segSum[i] - AS.unallocated[i] - F.ebitda[i]) > 1) throw new Error(`TMPV EBITDA bridge ${y}`); });
const coEbitda = segSum; // company-definition EBITDA (incl. grants)

// 2) Sector de-rating: auto-OEM peers' trailing P/E at the 30-Sep close vs five-year median (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set, SHOWN = D.peers.shown;
const PEERS = peersAsOf([...PEER_SYMS, ...SHOWN], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = s => pct((scr(s).charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]), 0.5);
const MED5 = Object.fromEntries([...PEER_SYMS, ...SHOWN].map(s => [s, med5(s)]));
const derate = Object.fromEntries([...PEER_SYMS, ...SHOWN].map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const sectorDr = medOf(USED.map(s => derate[s])), sectorDrAll = medOf(PEER_SYMS.map(s => derate[s])), k = 1 + sectorDr / 100;
const shortName = s => ({ MARUTI: 'Maruti Suzuki', 'M&M': 'Mahindra & Mahindra', 'BAJAJ-AUTO': 'Bajaj Auto', EICHERMOT: 'Eicher Motors', HEROMOTOCO: 'Hero MotoCorp', TVSMOTOR: 'TVS Motor', ASHOKLEY: 'Ashok Leyland', ESCORTS: 'Escorts Kubota', HYUNDAI: 'Hyundai Motor India', TMPV: 'Tata Motors PV' }[s] || s);

// 3) India PV proxy: Maruti Suzuki's one-year-forward EV/EBITDA since Apr-2021, on dates whose forward-year EBITDA is
// reported (Apr-2021 to Mar-2025: FY22-FY26 actuals; no later forecasts, so no look-ahead). EV = market value less
// net cash (cash + investments - borrowings) at the last fiscal year-end published by that date.
const MS = scr('MARUTI'), mpl = MS.tables['profit-loss'], mbs = MS.tables['balance-sheet'];
const mBy = (t, row) => Object.fromEntries(t.periods.map((p, i) => [p, t.rows[row]?.[i]]).filter(([p]) => /^Mar \d{4}$/.test(p)).map(([p, v]) => [+p.slice(-4), v]));
const mE = mBy(mpl, 'Operating Profit'), mPat = mBy(mpl, 'Net Profit'), mEps = mBy(mpl, 'EPS in Rs'), mBor = mBy(mbs, 'Borrowings'), mInv = mBy(mbs, 'Investments');
const mCash = Object.fromEntries(Object.entries(MS.schedules['balance-sheet']['Other Assets']['Cash Equivalents']).filter(([p]) => /^Mar \d{4}$/.test(p)).map(([p, v]) => [+p.slice(-4), v]));
const lastFy = d => { const y = +d.slice(0, 4); return d >= `${y}-05-30` ? y : y - 1; };
const mTrough = fy => { const pk = Math.max(...[1, 2, 3].map(j => mE[fy - j]).filter(v => v != null)); return !(mE[fy] > 0) || mE[fy] < 0.5 * pk; };
const marSeries = MS.charts.price.Price.filter(([d]) => d >= '2021-04-01' && d <= '2025-03-31').filter((_, i) => i % 5 === 0).map(([d, px]) => {
  const fy = fyOf(d), L = lastFy(d), sh = mPat[L] / mEps[L], net = (mCash[L] || 0) + (mInv[L] || 0) - (mBor[L] || 0);
  return [d, fy, Math.round((px * sh - net) / mE[fy] * 10) / 10]; }).filter(([, fy]) => mE[fy] > 0);
const marKept = marSeries.filter(([, fy]) => !mTrough(fy)), marTroughs = [...new Set(marSeries.filter(([, fy]) => mTrough(fy)).map(([, fy]) => `FY${String(fy).slice(2)}`))];
const marMed = pct(marKept.map(x => x[2]), 0.5), marP25 = pct(marKept.map(x => x[2]), 0.25), marP75 = pct(marKept.map(x => x[2]), 0.75);

// 4) TMPV's own price since the demerger: implied JLR forward EV/EBITDA (India PV at the Maruti median, as the Eicher
// report strips VECV at its proxy median) and the consolidated forward EV/EBITDA (cross-check)
const TS = scr('TMPV'), TT = scr('TATATECH'), ttlShares = 40.61, ttlPct = C.profile.ttl.stakePct / 100;
const ND = C.netDebt, ndAt = d => { const order = ['Q1FY26', 'Q2FY26', 'Q3FY26', 'FY26', 'Q1FY27']; let v = ND.quarters.find(q => q[0] === 'Q1FY26')[1];
  for (const q of order) if (ND.published[q] <= d) v = ND.quarters.find(x => x[0] === q)[1]; return v * 1000; };
const INV_BOOK = ND.mar26.equityAccounted + ND.mar26.otherNonCurrentInv; // 7,728: valued at book (in engine treasury)
const valParts = AS.valuation.parts, MINOR = -valParts.find(p => /minority/i.test(p.name)).adj.base, TTL_VAL = ttlPct * ttlShares * closes.TATATECH;
const px = [...TS.charts.price.Price.filter(([d]) => d >= FROM && d < ASOF), [ASOF, price]];
const fwdIdx = d => (fyOf(d) === 2027 ? 0 : 1); // FY27E for Oct-25..Mar-26, FY28E for Apr-26..Sep-26
const own = px.map(([d, p]) => { const i = fwdIdx(d), ttl = ttlPct * ttlShares * (d === ASOF ? closes.TATATECH : at(TT.charts.price.Price, d)), nd = ndAt(d);
  const evOps = p * shares + nd + MINOR - INV_BOOK - ttl, jlrEv = evOps - seg('pv').adjEbitda[i] * marMed;
  return { d, p, nd, ttl, jlr: Math.round(jlrEv / seg('jlr').adjEbitda[i] * 100) / 100, cons: Math.round((p * shares + nd - INV_BOOK) / F.ebitda[i] * 10) / 10 }; });
const jlrMed = pct(own.map(x => x.jlr), 0.5), jlrP25 = pct(own.map(x => x.jlr), 0.25), jlrP75 = pct(own.map(x => x.jlr), 0.75);
const consMed = pct(own.map(x => x.cons), 0.5), consP25 = pct(own.map(x => x.cons), 0.25);
const jlrNow = own[own.length - 1].jlr, consNow = own[own.length - 1].cons;

// 5) Derived multiples (nearest half-turn) and SOTP per case
const MULT = { jlr: { base: half(jlrMed * k), bull: half(jlrMed), bear: half(jlrP25 * k) }, pv: { base: half(marMed * k), bull: half(marMed), bear: half(marP25 * k) }, ev: { base: half(consMed * k), bull: half(consMed), bear: half(consP25 * k) } };
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key), SP = V.sotp.parts;
const part = (re, kase = 'base') => { const S = kase === 'base' ? V.sotp : SC[kase].blend.methods.find(m => m.key === 'sotp'); return (kase === 'base' ? S.parts : null)?.find(p => re.test(p.name)); };
const jlrSep = sep(seg('jlr').adjEbitda), pvSep = sep(seg('pv').adjEbitda), netSep = SP.find(p => /net debt/i.test(p.name)).value;
const sotpAt = (mj, mp, ttlDisc = 0) => Math.round((jlrSep * mj + pvSep * mp + TTL_VAL * (1 - ttlDisc) - MINOR + netSep) / shares);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;

// 6) Street as it stood on 30-Sep-2026
const ST = D.street.brokers, postQ1 = ST.filter(s => s.date >= '2026-08-13' && s.tp), medTp = medOf(postQ1.map(s => s.tp));
const withEps = ST.filter(s => s.eps);
const streetPv = [14, 13, 11, 11], streetJlr = [1.5, 2, 2];

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, FROM, n0, n1, pc, pc1, rup, half, shortDate, pct, medOf, SA, SQ, QL, yr, A26, A25, Q1, b, price, shares, mcap, sep, seg,
  jlrB, pvB, coEbitda, PEER_SYMS, SHOWN, PEERS, P, MED5, derate, EXCL, USED, sectorDr, sectorDrAll, k, shortName,
  marSeries, marKept, marTroughs, marMed, marP25, marP75, own, jlrMed, jlrP25, jlrP75, consMed, consP25, jlrNow, consNow, INV_BOOK, MINOR, TTL_VAL, ttlPct, closes,
  MULT, BM, mv, SP, jlrSep, pvSep, netSep, sotpAt, rating, buyBelow, sellAbove, ST, postQ1, medTp, withEps, streetPv, streetJlr };
