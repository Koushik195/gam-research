// Lenskart initiation: shared context for the Part B files. Loads the research JSONs and the built model, checks the
// segment build (India + International + inter-segment = model revenue), the India store build and the other-income
// build, and derives the P/E and EV/EBITDA multiples once (PLAYBOOK §4 and §7c). Recently listed (10-Nov-2025, 10.7
// months before the as-of date): the own window is listing to 30-Sep-2026 on every daily close, and the sector move is
// measured over the same window (TENNIND / HYUNDAI / HDBFS precedent). As of 30-Sep-2026 (Q1FY27 basis).
//
// SECTOR SET: the retail set fixed in DMART.ctx.js (consumer-services batch): DMART, TRENT, METROBRAND, BATAINDIA,
// PAGEIND used; ABFRL (no P/E history), SHOPERSTOP (P/E ~258x on near-zero profit) and VMM (listed Dec-2024, no five-year
// median) excluded, VMM shown as a sensitivity row. LENSKART itself is not in the set. Internet platforms (ETERNAL,
// NAUKRI, INDIAMART, NYKAA; SWIGGY loss-making) are shown as a sensitivity row only: the street covers Lenskart through
// its consumer/retail analysts and compares it with retailers and Titan's eyecare arm, not with platforms.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'LENSKART', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'LENSKART.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'LENSKART', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', LISTED = '2025-11-10', ISSUE = 402;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const SA = SG.annual, SQ = SG.quarterly, sa = fy => SA.find(r => r.fy === fy);
const b = A.labels.length - 1; // FY26 index
const price = M.price.last, shares = F.shares, mcap = price * shares;
const sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const Q1 = C.q1fy27, FY26 = C.fy26;

// 1) Segment build: India + International + inter-segment = model revenue (engine segments); EBITDA reconciles
const SEG = F.seg, segRev = F.years.map((_, i) => SEG.india.revenue[i] + SEG.intl.revenue[i] + SEG.elim.revenue[i]);
F.years.forEach((y, i) => { if (Math.abs(segRev[i] - F.sales[i]) > 1) throw new Error(`LENSKART segment build ${y}: ${segRev[i]} vs ${F.sales[i]}`);
  const e = SEG.india.adjEbitda[i] + SEG.intl.adjEbitda[i] - AS.unallocated[i] - AS.esop[i];
  if (Math.abs(e - F.ebitda[i]) > 1) throw new Error(`LENSKART EBITDA build ${y}`); });
const segM = k => F.years.map((_, i) => SEG[k].adjEbitda[i] / SEG[k].revenue[i] * 100);
const f26 = sa('FY26'), f25 = sa('FY25');
// India store build must reproduce India growth within 1.5 points
const SB = AS.storeBuild, storeRows = (() => { let st = SB.indiaStoresMar26, rps = f26.indiaRev / ((SB.indiaStoresMar25 + SB.indiaStoresMar26) / 2);
  return F.years.map((y, i) => { const open = st; st += SB.netAdds[i]; rps *= 1 + SB.revPerStoreGrowth[i] / 100; const rev = (open + st) / 2 * rps;
    const g = (rev / (i ? SEG.india.revenue[i - 1] : f26.indiaRev) - 1) * 100;
    if (Math.abs(g - AS.segments[0].growth[i]) > 1.5) throw new Error(`LENSKART store build ${y}: ${g.toFixed(1)}% vs ${AS.segments[0].growth[i]}%`);
    return { y, stores: st, adds: SB.netAdds[i], rps, rev, g }; }); })();
const rps26 = f26.indiaRev / ((SB.indiaStoresMar25 + SB.indiaStoresMar26) / 2), rps25 = f25.indiaRev / ((1785 + 2067) / 2);
// Other-income build: treasury yield x opening net treasury + the fixed other income (lease-offset income + recurring)
const treas0 = (A.cash[b] || 0) + (A.investments[b] || 0) + AS.otherTreasury.base - (A.borrowings[b] || 0);
F.years.forEach((y, i) => { const built = AS.treasuryYield[i] / 100 * Math.max(i ? F.treasury[i - 1] : treas0, 0) + AS.otherIncome[i];
  if (Math.abs(built - F.otherIncome[i]) > 0.5) throw new Error(`LENSKART other-income build ${y}: ${built} vs ${F.otherIncome[i]}`); });
const ttmOI = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);

// 2) Own one-year-forward P/E on EVERY daily close since listing (forwardSeries keeps every 5th point: too few for a
//    ten-month history); next full fiscal year's EPS (FY27E to Mar-2026, FY28E from Apr-2026: ours).
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsBy = {}; A.labels.forEach((l, i) => { if (A.eps[i]) epsBy[2000 + +l.slice(2)] = A.eps[i]; }); F.years.forEach((y, i) => { epsBy[2000 + +y.slice(2, 4)] = F.eps[i]; });
const px = S.charts.price.Price.filter(([d]) => d >= LISTED && d <= ASOF); if (px.at(-1)[0] < ASOF) px.push([ASOF, price]);
const fwdPe = px.map(([d, p]) => [d, Math.round(p / epsBy[fyOf(d)] * 10) / 10]);
const stat = (s, from, to = '9999') => { const v = s.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]).sort((a, c) => a - c); return { med: medOf(v), p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1), n: v.length }; };
const PEL = stat(fwdPe, LISTED), PEA = stat(fwdPe, '2026-04-01'), PEB = stat(fwdPe, LISTED, '2026-03-31'), PEX = stat(fwdPe, '2026-01-01');
const FM = forwardMedian('LENSKART', M, { from: LISTED }); // house function (every 5th point), shown as a check
const fwdNow = price / F.eps[1], sepNow = price / sep(F.eps), trailEps = M.quarterly.eps.slice(-4).reduce((s, x) => s + x, 0), trailPe = price / trailEps;
const firstWeeks = px.filter(x => x[0] < '2026-01-01'), firstMedPx = medOf(firstWeeks.map(x => x[1])), firstMedPe = medOf(fwdPe.filter(x => x[0] < '2026-01-01').map(x => x[1]));
const pxAll = px.map(x => x[1]), hi = Math.max(...pxAll), lo = Math.min(...pxAll), pxAt = d => px.filter(([x]) => x <= d).at(-1)[1];

// 3) Sector move: retail peers' trailing P/E at the 30-Sep close vs their own medians over the same window (primary)
//    and vs five-year medians (shown); LENSKART excluded (PLAYBOOK §7c)
const PEER_SYMS = D.peers.set, EXCL = Object.keys(D.peers.excluded), USED = PEER_SYMS.filter(s => !EXCL.includes(s));
const NET = D.peers.internet || [];
const PEERS = peersAsOf(['LENSKART', ...PEER_SYMS], ASOF), P = Object.fromEntries(peersAsOf(['LENSKART', ...PEER_SYMS, ...NET], ASOF).map(p => [p.symbol, p]));
const ser = (sym, ch, key) => (JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts?.[ch]?.[key] || []);
const medFrom = (sym, from, ch = 'pe', key = 'Price to Earning') => { const v = ser(sym, ch, key).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]); return v.length ? medOf(v) : null; };
const ALLS = [...PEER_SYMS, ...NET];
const MED5 = Object.fromEntries(ALLS.map(s => [s, medFrom(s, '2021-09-30')])), MEDL = Object.fromEntries(ALLS.map(s => [s, medFrom(s, LISTED)]));
const drL = Object.fromEntries(ALLS.map(s => [s, P[s]?.pe && MEDL[s] ? (P[s].pe / MEDL[s] - 1) * 100 : null]));
const dr5 = Object.fromEntries(ALLS.map(s => [s, P[s]?.pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const evMEDL = Object.fromEntries(ALLS.map(s => [s, medFrom(s, LISTED, 'evEbitda', 'EV Multiple')]));
const evDrL = Object.fromEntries(ALLS.map(s => [s, P[s]?.evEbitda > 0 && evMEDL[s] ? (P[s].evEbitda / evMEDL[s] - 1) * 100 : null]));
const sectorL = medOf(USED.map(s => drL[s])), sector5 = medOf(USED.map(s => dr5[s])), sectorLvmm = medOf([...USED, 'VMM'].filter(s => drL[s] != null).map(s => drL[s]));
const netUsed = NET.filter(s => drL[s] != null), sectorNet = netUsed.length ? medOf(netUsed.map(s => drL[s])) : null;
const evSectorL = medOf(USED.map(s => evDrL[s]));
const k = 1 + sectorL / 100, k5 = 1 + sector5 / 100, kEv = 1 + evSectorL / 100;
const shortName = s => ({ LENSKART: 'Lenskart', DMART: 'DMart', TRENT: 'Trent', METROBRAND: 'Metro Brands', BATAINDIA: 'Bata India', PAGEIND: 'Page Industries', ABFRL: 'Aditya Birla Fashion', SHOPERSTOP: 'Shoppers Stop', VMM: 'Vishal Mega Mart', ETERNAL: 'Eternal', NAUKRI: 'Info Edge', INDIAMART: 'IndiaMART', NYKAA: 'Nykaa (FSN)', SWIGGY: 'Swiggy' }[s] || s);

// 4) P/E multiple (CROSS-CHECK; derived, nearest half-turn): base = own forward P/E median since listing x same-window
//    sector P/E move; bull = no sector move; bear = own 25th percentile x the move. Sensitivities shown, never blended.
const MULT = { base: half(PEL.med * k), bull: half(PEL.med), bear: half(PEL.p25 * k) };
const ALT = { five: half(PEL.med * k5), fy28only: half(PEA.med * k), cal26: half(PEX.med * k), vmm: half(PEL.med * (1 + sectorLvmm / 100)), net: sectorNet != null ? half(PEL.med * (1 + sectorNet / 100)) : null };
const peM = blend => blend.methods.find(m => m.key === 'pe').metric;
const epsSep = { base: peM(V.blend), bull: peM(SC.bull.blend), bear: peM(SC.bear.blend) };
// 5) EV/EBITDA (PRIMARY: how the street values the stock). Own one-year-forward EV/EBITDA on every daily close since
//    listing: EV = price x shares less net cash after lease liabilities at Mar-2026 (₹treas0 cr; constant, the IPO cash was
//    in from Nov-2025), over the next full fiscal year's reported (post-IndAS) EBITDA (FY27E to Mar-2026, FY28E from
//    Apr-2026: ours). Sector move = retail peers' trailing EV/EBITDA at the 30-Sep close vs their medians over the same window.
const ebitdaBy = { 2027: F.ebitda[0], 2028: F.ebitda[1], 2029: F.ebitda[2] };
const fwdEv = px.map(([d, p]) => [d, Math.round((p * shares - treas0) / ebitdaBy[fyOf(d)] * 10) / 10]);
const EVL = stat(fwdEv, LISTED), EVA = stat(fwdEv, '2026-04-01'), EVX = stat(fwdEv, '2026-01-01');
const evMULT = { base: half(EVL.med * kEv), bull: half(EVL.med), bear: half(EVL.p25 * kEv) };
const evDr5 = Object.fromEntries(ALLS.map(s => { const m = medFrom(s, '2021-09-30', 'evEbitda', 'EV Multiple'); return [s, P[s]?.evEbitda > 0 && m ? (P[s].evEbitda / m - 1) * 100 : null]; }));
const evSector5 = medOf(USED.map(s => evDr5[s])), evSectorLvmm = medOf([...USED, 'VMM'].map(s => evDrL[s])), evSectorNet = netUsed.length ? medOf(netUsed.filter(s => evDrL[s] != null).map(s => evDrL[s])) : null;
const evALT = { five: half(EVL.med * (1 + evSector5 / 100)), fy28only: half(EVA.med * kEv), cal26: half(EVX.med * kEv), vmm: half(EVL.med * (1 + evSectorLvmm / 100)), net: evSectorNet != null ? half(EVL.med * (1 + evSectorNet / 100)) : null };
const ebitdaSep28 = sep(F.ebitda), evNow = (price * shares - treas0) / F.ebitda[1], evSepNow = (price * shares - treas0) / ebitdaSep28;
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0);
const evM = blend => blend.methods.find(m => m.key === 'ev').metric;
const ebitdaSepSc = { base: evM(V.blend), bull: evM(SC.bull.blend), bear: evM(SC.bear.blend) };
// Street basis: pre-IndAS EBITDA (after rent) and EV without lease liabilities. Rent = lease principal + lease interest.
const RB = AS.rentBuild, rent = F.years.map((_, i) => RB.leasePrincipal[i] + RB.leaseInterest[i]), rent26 = RB.fy26.leasePrincipal + RB.fy26.leaseInterest;
const preEbitda = F.ebitda.map((e, i) => e - rent[i]), preEbitda26 = A.ebitda[b] - rent26, preSep28 = sep(preEbitda);
const leases = FY26.leaseLiabilities, netCashExLeases = treas0 + leases; // company basis ≈ ₹3,880 cr + deposits detail
const pickTreas = sep(F.treasury); // what the engine adds to EV at the target date (net of leases)
const preMultAt = tp => (tp * shares - (pickTreas + leases)) / preSep28; // our target expressed on the street's basis
const streetAtOurs = mult => (mult * preSep28 + pickTreas + leases) / shares; // a street pre-IndAS multiple on our EBITDA

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const epsCagrFwd = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100;

// Street as it stood on 30-Sep-2026 (latest note per broker)
const ST = D.street.brokers, latest = ST.filter(s => s.current && s.tp && !s.exclMedian), post = latest.filter(s => s.postQ1);
const medAll = medOf(latest.map(s => s.tp)), medTp = medOf(post.map(s => s.tp)), withEps = latest.filter(s => s.eps && s.eps.FY28E);
const nBuy = post.filter(s => /Buy|Outperform|Overweight|Long/.test(s.rating)).length;

module.exports = { ROOT, RD, C, D, SG, M, S, F, V, A, AS, SC, ASOF, ASOF_TXT, LISTED, ISSUE, n0, n1, n2, pc, pc1, half, pct, medOf, SA, SQ, sa, b, price, shares, mcap, sep, Q1, FY26,
  SEG, segM, f26, f25, SB, storeRows, rps26, rps25, treas0, ttmOI,
  fyOf, epsBy, px, fwdPe, PEL, PEA, PEB, PEX, FM, fwdNow, sepNow, trailEps, trailPe, firstMedPx, firstMedPe, hi, lo, pxAt,
  PEER_SYMS, EXCL, USED, NET, PEERS, P, MED5, MEDL, drL, dr5, evDrL, sectorL, sector5, sectorLvmm, sectorNet, evSectorL, k, k5, kEv, shortName,
  MULT, ALT, epsSep, fwdEv, EVL, EVA, EVX, evMULT, evALT, evDr5, evSector5, evSectorLvmm, evSectorNet, evNow, evSepNow, ttmEbitda, ebitdaSep28, ebitdaSepSc, RB, rent, rent26, preEbitda, preEbitda26, preSep28, leases, netCashExLeases, pickTreas, preMultAt, streetAtOurs, BM, mv, rating, buyBelow, sellAbove, epsCagrFwd, ST, latest, post, medAll, medTp, withEps, nBuy };

if (require.main === module) {
  console.log('seg', F.years.map((y, i) => [y, n0(SEG.india.revenue[i]), n0(SEG.intl.revenue[i]), n1(segM('india')[i]), n1(segM('intl')[i])]), 'stores', storeRows.map(r => [r.y, r.stores, n2(r.rps), n1(r.g)]), 'rps', n2(rps25), n2(rps26));
  console.log('treas0', n0(treas0), 'OI', F.otherIncome.map(n0), 'ttmOI', ttmOI);
  console.log('PEL', PEL, 'PEA', PEA, 'PEB', PEB, 'PEX', PEX, 'FM', FM.median, FM.series.length, 'first', n0(firstMedPx), firstMedPe, 'now', n1(fwdNow), n1(sepNow), n1(trailPe), 'hi/lo', hi, lo);
  console.log('drL', ALLS.map(s => `${s} ${drL[s] == null ? 'na' : drL[s].toFixed(1)}`).join(', '), '| sectorL', sectorL.toFixed(2), 'vmm', sectorLvmm.toFixed(2), 'net', sectorNet?.toFixed(2), '| 5y', sector5.toFixed(2), '| evL', evSectorL.toFixed(2));
  console.log('EVL', EVL, 'EVA', EVA, 'EVX', EVX, 'evMULT', evMULT, 'evALT', evALT, 'ev5', evSector5.toFixed(2), 'evNow', n1(evNow), n1(evSepNow), 'pre', preEbitda.map(n0), n0(preEbitda26), n0(preSep28), 'preMultAtTP', n1(preMultAt(V.tp)), 'street49', n0(streetAtOurs(49)));
  console.log('MULT', MULT, 'ALT', ALT, 'epsSep', epsSep, 'tp', V.tp, 'up', V.upside.toFixed(1), rating, 'medTp', medTp, 'medAll', medAll, 'nPost', post.length, 'nBuy', nBuy, 'buy<', buyBelow, 'sell>', sellAbove);
  console.log('methods', BM.map(m => [m.key, Math.round(m.value)]), 'scen', SC.bull.tp, SC.bear.tp, 'eps', F.eps.map(n2));
}
