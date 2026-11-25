// Physicswallah initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks the
// channel build (online + offline + others − ESOP = model EBITDA) and the other-income build, and derives the EV/EBITDA
// (primary) and P/E (cross-check) multiples once (PLAYBOOK §4, §7c). As of 30-Sep-2026 (Q1FY27 basis).
//
// RECENTLY LISTED (18-Nov-2025, 10.4 months before the as-of date): no 12-month history exists. The own window skips the
// listing weeks and December (IPO premium: the stock traded ₹125-155 in Nov and ₹129-138 in Dec, against ₹80-150 later;
// analysts' quiet period ended ~24-Dec-2025) and runs 1-Jan-2026 to 30-Sep-2026 on every daily close: nine months, the
// MEESHO precedent. The listing-to-date median is shown as a sensitivity row.
// SECTOR MOVE (BRIEF "Thin peer sets": always in the base): there is no listed Indian edtech/test-prep peer of size
// (Screener's list: Jaro, Veranda, Robokidz ... all < ₹1,000 cr). The natural set, internet platforms with a usable
// five-year history (ETERNAL.ctx.js: Info Edge, IndiaMART), has only two names, so we widen to the next-closest group the
// brokers use (they cover PW as "India | Internet", next to Meesho and Eternal): every internet platform with positive
// EBITDA through the window (Eternal, Info Edge, IndiaMART, Nykaa, Paytm, PB Fintech; Swiggy excluded, EBITDA negative).
// Measure: trailing EV/EBITDA at the 30-Sep close vs each name's own median over the same window (1-Jan-2026 on).
// The two-name subset and no move are sensitivity rows.
const fs = require('fs');
const path = require('path');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'PWL', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'PWL.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'PWL', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2025-11-18', FROM = '2026-01-01', ISSUE = 109;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const medOf = arr => { const s = arr.filter(x => x != null && Number.isFinite(x)).sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly, sa = fy => SA.find(r => r.fy === fy), sq = q => SQ.find(r => r.q === q);
const f26 = sa('FY26'), f25 = sa('FY25'), q1 = sq('Q1FY27'), q1y = sq('Q1FY26');
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E

// 1) Channel build: online + offline + others = model revenue; channel EBITDA − unallocated − ESOP = model EBITDA
const SEG = F.seg, K = ['online', 'offline', 'others'];
F.years.forEach((y, i) => {
  const r = K.reduce((s, k) => s + SEG[k].revenue[i], 0), e = K.reduce((s, k) => s + SEG[k].adjEbitda[i], 0) - AS.unallocated[i] - AS.esop[i];
  if (Math.abs(r - F.sales[i]) > 1) throw new Error(`PWL channel revenue ${y}: ${r} vs ${F.sales[i]}`);
  if (Math.abs(e - F.ebitda[i]) > 1) throw new Error(`PWL EBITDA build ${y}: ${e} vs ${F.ebitda[i]}`);
});
const segM = k => F.years.map((_, i) => SEG[k].adjEbitda[i] / SEG[k].revenue[i] * 100);
// Pre-IndAS (company / street basis) = channel EBITDA − lease payments; group pre-IndAS also before ESOP
const lease = AS.rentBuild.lease, segSum = F.years.map((_, i) => K.reduce((s, k) => s + SEG[k].adjEbitda[i], 0));
const preIndAs = segSum.map((e, i) => e - lease[i]), preSep = sep(preIndAs);
const leaseShare = { online: q1.onlineLease / q1.lease, offline: q1.offlineLease / q1.lease }; // Q1FY27 split
const segPre = k => F.years.map((_, i) => SEG[k].adjEbitda[i] - lease[i] * (leaseShare[k] || 0));
// 2) Other-income build: yield × opening net treasury + fixed item (yield on the lease-funded part of gross treasury)
const treas0 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - (A.borrowings[b] || 0);
F.years.forEach((y, i) => { const built = AS.treasuryYield[i] / 100 * Math.max(i ? F.treasury[i - 1] : treas0, 0) + AS.otherIncome[i];
  if (Math.abs(built - F.otherIncome[i]) > 0.6) throw new Error(`PWL other-income build ${y}: ${built} vs ${F.otherIncome[i]}`); });

// 3) Own one-year-forward multiples on EVERY daily close (forwardSeries keeps every 5th point: too few here).
//    Forward year: FY27E for Jan-Mar 2026, FY28E from Apr-2026 (ours). EV = price × diluted shares − Mar-26 net treasury
//    after lease liabilities (₹treas0 cr; the IPO cash arrived in Nov-2025, before the window).
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const ebBy = { 2027: F.ebitda[0], 2028: F.ebitda[1], 2029: F.ebitda[2] }, epsBy = { 2027: F.eps[0], 2028: F.eps[1], 2029: F.eps[2] };
const px = S.charts.price.Price.filter(([d]) => d >= LISTED && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const fwdEv = px.map(([d, p]) => [d, Math.round((p * shares - treas0) / ebBy[fyOf(d)] * 10) / 10]);
const fwdPe = px.map(([d, p]) => [d, Math.round(p / epsBy[fyOf(d)] * 10) / 10]);
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: medOf(v), p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const EVX = stat(fwdEv, FROM), EVL = stat(fwdEv, LISTED), EVA = stat(fwdEv, '2026-04-01'), EVD = stat(fwdEv, '2025-12-01');
const PEX = stat(fwdPe, FROM), PEL = stat(fwdPe, LISTED);
const evNow = (mcap - treas0) / F.ebitda[1], evSepNow = (mcap - treas0) / sep(F.ebitda), peNow = price / F.eps[1], peSepNow = price / sep(F.eps);
const pxAll = px.map(x => x[1]), hi = Math.max(...pxAll), lo = Math.min(...pxAll), pxAt = d => px.filter(([x]) => x <= d).at(-1)[1];
const monthMed = m => medOf(px.filter(([d]) => d.startsWith(m)).map(x => x[1]));

// 4) Sector move over the same window: peers' EV/EBITDA (and P/E) at the 30-Sep close vs their own medians since 1-Jan-2026
const NET = D.peers.set, DR_SET = D.peers.drSet, EV_ALL = D.peers.evUsable;
const P = Object.fromEntries(peersAsOf(['PWL', ...NET], ASOF).map(p => [p.symbol, p]));
const ser = (sym, ch, key) => (JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.[ch]?.[key] || []);
const medFrom = (sym, from, ch, key) => { const v = ser(sym, ch, key).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]); return v.length ? medOf(v) : null; };
const mv = (sym, from, ch, key, now) => { const m = medFrom(sym, from, ch, key); return now > 0 && m ? (now / m - 1) * 100 : null; };
const evW = Object.fromEntries(NET.map(s => [s, mv(s, FROM, 'evEbitda', 'EV Multiple', P[s]?.evEbitda)]));
const peW = Object.fromEntries(NET.map(s => [s, mv(s, FROM, 'pe', 'Price to Earning', P[s]?.pe)]));
const ev5 = Object.fromEntries(NET.map(s => [s, mv(s, '2021-09-30', 'evEbitda', 'EV Multiple', P[s]?.evEbitda)]));
const sectorEv = medOf(DR_SET.map(s => evW[s])), sectorPe = medOf(DR_SET.map(s => peW[s])), sectorEvAll = medOf(EV_ALL.map(s => evW[s])), sectorEv5 = medOf(DR_SET.map(s => ev5[s]));
const shortName = s => ({ PWL: 'Physicswallah', ETERNAL: 'Eternal', SWIGGY: 'Swiggy', NAUKRI: 'Info Edge', INDIAMART: 'IndiaMART', NYKAA: 'Nykaa (FSN)', PAYTM: 'Paytm', POLICYBZR: 'PB Fintech' }[s] || s);

// 5) Multiples (derived, nearest half-turn). Base = own median since 1-Jan-2026; bull = 75th percentile; bear = 25th
//    percentile. Sensitivities (shown, never blended): × the two-peer same-window move, × all six positive-EBITDA internet
//    names, listing-to-date window, FY28E-forward months only.
const sectorPeAll = medOf(EV_ALL.map(s => peW[s])), kEv = 1 + sectorEvAll / 100, kPe = 1 + sectorPeAll / 100;
const MULT = { base: half(EVX.med * kEv), bull: half(EVX.med), bear: half(EVX.p25 * kEv) };
const peMULT = { base: half(PEX.med * kPe), bull: half(PEX.med), bear: half(PEX.p25 * kPe) };
const ALT = { sector: half(EVX.med * (1 + sectorEv / 100)), noMove: half(EVX.med), p75: half(EVX.p75 * kEv), listed: half(EVL.med * kEv), fy28only: half(EVA.med * kEv), fromDec: half(EVD.med * kEv), sector5: half(EVX.med * (1 + sectorEv5 / 100)) };
const evAt = (mult, kase = 'base') => { const sc = kase === 'base' ? V.blend : SC[kase].blend; const m = sc.methods.find(x => x.key === 'ev'); return (mult * m.metric + (m.value * shares - m.mult * m.metric)) / shares; };
const tpAt = mult => evAt(mult); // per-share value at another multiple, same EBITDA and net cash
const pickTreas = sep(F.treasury);
// Street basis: channel multiples on our pre-IndAS channel EBITDA (Sep-28E) plus net treasury before lease liabilities
const leasesNow = 1041.61, treasGross = pickTreas + leasesNow;
const streetSotp = (on, off) => (on * sep(segPre('online')) + off * sep(segPre('offline')) + treasGross) / shares;
const preMultAt = tp => (tp * shares - treasGross) / preSep;

const BM = V.blend.methods, mvk = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp)), sellAbove = Math.round(sellAt(V.tp));
const ST = D.street.brokers, cur = ST.filter(s => s.current && s.tp), post = cur.filter(s => !s.preQ1);
const medTp = medOf(cur.map(s => s.tp)), medPost = medOf(post.map(s => s.tp));
const nBuy = cur.filter(s => /Buy|Overweight|Add/.test(s.rating)).length;
const vsIssue = (price / ISSUE - 1) * 100, fromHigh = (price / hi - 1) * 100;

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, LISTED, FROM, ISSUE, n0, n1, n2, pc, pc1, half, medOf, SA, SQ, sa, sq, f26, f25, q1, q1y, b,
  price, shares, mcap, sep, SEG, K, segM, lease, segSum, preIndAs, preSep, segPre, treas0, fyOf, px, fwdEv, fwdPe, EVX, EVL, EVA, EVD, PEX, PEL, evNow, evSepNow, peNow, peSepNow,
  hi, lo, pxAt, monthMed, NET, DR_SET, EV_ALL, P, evW, peW, ev5, sectorEv, sectorPe, sectorEvAll, sectorPeAll, kEv, kPe, sectorEv5, shortName, MULT, peMULT, ALT, tpAt, pickTreas, leasesNow, treasGross,
  streetSotp, preMultAt, BM, mvk, rating, buyBelow, sellAbove, ST, cur, post, medTp, medPost, nBuy, vsIssue, fromHigh };

if (require.main === module) {
  console.log('segM', K.map(k => [k, segM(k).map(n1).join('/')]), 'pre', preIndAs.map(n0), 'preSep', n0(preSep), 'segPre on/off', segPre('online').map(n0), segPre('offline').map(n0), 'treas0', n0(treas0), 'OI', F.otherIncome);
  console.log('EVX', EVX, 'EVL', EVL, 'EVA', EVA, 'EVD', EVD, 'now', n1(evNow), n1(evSepNow));
  console.log('PEX', PEX, 'PEL', PEL, 'peNow', n1(peNow), n1(peSepNow), 'hi/lo', hi, lo, 'months', ['2025-11', '2025-12', '2026-01', '2026-03', '2026-06', '2026-09'].map(m => [m, monthMed(m)]));
  console.log('evW', NET.map(s => `${s} ${evW[s] == null ? 'na' : evW[s].toFixed(1)} (now ${P[s]?.evEbitda})`).join(', '), '| peW', NET.map(s => `${s} ${peW[s] == null ? 'na' : peW[s].toFixed(1)}`).join(', '));
  console.log('sectorEv', sectorEv.toFixed(2), 'sectorPe', sectorPe.toFixed(2), 'all', sectorEvAll.toFixed(2), 'peAll', sectorPeAll.toFixed(2), '5y', sectorEv5.toFixed(2));
  console.log('MULT', MULT, 'peMULT', peMULT, 'ALT', ALT, 'tp', V.tp, 'up', V.upside.toFixed(1), rating, 'methods', BM.map(m => [m.key, n1(m.value)]), 'scen', SC.bull.tp, SC.bear.tp);
  console.log('street JM 32/15', n1(streetSotp(32, 15)), 'MOSL 50/15', n1(streetSotp(50, 15)), 'JPM 30/10', n1(streetSotp(30, 10)), 'preMultAtTP', n1(preMultAt(V.tp)), 'medTp', medTp, 'medPost', medPost, 'nBuy', nBuy, cur.length, 'buy<', buyBelow, 'sell>', sellAbove);
}
