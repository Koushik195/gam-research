// ITC Hotels context, part 2: hotel peers and the sector move (same window as the own history), multiple derivation checks,
// rating from the house rule, what the price implies, street table helpers. Called from ITCHOTELS.ctx.js.
const fs = require('fs');
const path = require('path');

module.exports = (X, L) => {
  const { ROOT, ASOF, WIN, LISTED, WIN5, D, C, F, V, AS, HEV, HEVlist, HPE, price, mcap, sh, part, vpart, hotelSep28, netCashSep28, median, n1, half } = X;
  // Peers at the 30-Sep-2026 close; move = trailing multiple (Screener) vs its own median over the window
  const PEER_SYMS = ['INDHOTEL', 'EIHOTEL', 'CHALET', 'LEMONTREE', 'ITCHOTELS'];
  const PEERS = L.peersAsOf(PEER_SYMS, ASOF), PR = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
  const scr = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
  const medFrom = (sym, chart, key, from) => median((scr(sym).charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= from && x > 0).map(x => x[1]));
  const mvOf = (now, med) => (now / med - 1) * 100;
  const MED = {}, drEv = {}, drPe = {}, drEvList = {}, dr5Ev = {}, dr5Pe = {};
  PEER_SYMS.forEach(s => {
    MED[s] = { ev: medFrom(s, 'evEbitda', 'EV Multiple', WIN), pe: medFrom(s, 'pe', 'Price to Earning', WIN), evList: medFrom(s, 'evEbitda', 'EV Multiple', LISTED), ev5: medFrom(s, 'evEbitda', 'EV Multiple', WIN5), pe5: medFrom(s, 'pe', 'Price to Earning', WIN5) };
    drEv[s] = mvOf(PR[s].evEbitda, MED[s].ev); drPe[s] = mvOf(PR[s].pe, MED[s].pe); drEvList[s] = mvOf(PR[s].evEbitda, MED[s].evList); dr5Ev[s] = mvOf(PR[s].evEbitda, MED[s].ev5); dr5Pe[s] = mvOf(PR[s].pe, MED[s].pe5);
  });
  const CORE = ['INDHOTEL', 'EIHOTEL', 'LEMONTREE'], LEFT_OUT = ['CHALET'];
  const sectorDrEv = median(CORE.map(s => drEv[s])), sectorDrPe = median(CORE.map(s => drPe[s]));
  const sens = { listing: median(CORE.map(s => drEvList[s])), five: median(CORE.map(s => dr5Ev[s])), withChalet: median([...CORE, 'CHALET'].map(s => drEv[s])), exIhcl: median(['EIHOTEL', 'LEMONTREE'].map(s => drEv[s])) };
  const shortName = s => ({ INDHOTEL: 'IHCL', EIHOTEL: 'EIH (Oberoi)', CHALET: 'Chalet Hotels', LEMONTREE: 'Lemon Tree', ITCHOTELS: 'ITC Hotels' }[s] || s);

  // Derived multiples (nearest half-turn) must equal assumptions
  const k = 1 + sectorDrEv / 100, kpe = 1 + sectorDrPe / 100;
  const evAfter = HEV.med * k, evBull = HEV.p75 * k, evBear = HEV.p25 * k;
  const peAfter = HPE.med * kpe, peBull = HPE.p75 * kpe, peBear = HPE.p25 * kpe;
  const hm = vpart(/^Hotels/).multiple, pem = AS.valuation.blend.methods.find(m => m.key === 'pe').multiple;
  const CHECK = process.env.ITCHOTELS_NOCHECK !== '1';
  if (CHECK && (half(evAfter) !== hm.base || half(evBull) !== hm.bull || half(evBear) !== hm.bear)) throw new Error(`EV/EBITDA not derived: ${n1(evAfter)} / ${n1(evBull)} / ${n1(evBear)} vs ${hm.base}/${hm.bull}/${hm.bear}`);
  if (CHECK && (half(peAfter) !== pem.base || half(peBull) !== pem.bull || half(peBear) !== pem.bear)) throw new Error(`P/E not derived: ${n1(peAfter)} / ${n1(peBull)} / ${n1(peBear)} vs ${pem.base}/${pem.bull}/${pem.bear}`);

  // What the price pays: hotel EV/EBITDA implied by the 30-Sep price, holding the other SOTP parts
  const nonHotel = V.sotp.equity - part(/^Hotels/).value;
  const impliedHotelMult = (mcap - nonHotel) / hotelSep28;
  const perTurn = hotelSep28 / sh; // Rs per share for each 1x on Sep-28E hotel EBITDA
  const tpAt = mult => Math.round((V.sotp.equity + (mult - hm.base) * hotelSep28) / sh / 5) * 5;

  // Rating from the house rule (never typed)
  const rating = L.ratingFor(V.upside);
  const buyBelow = Math.round(L.buyAt(V.tp) / 5) * 5, sellAbove = Math.round(L.sellAt(V.tp) / 5) * 5;

  // Street on 30-Sep-2026
  const ST = (D.street?.brokers || []).filter(s => s.tp);
  const byB = n => ST.find(s => s.broker === n);
  const medAll = ST.length ? median(ST.map(s => s.tp)) : null, postQ1 = ST.filter(s => s.date >= '2026-07-16');
  const avgPost = postQ1.length ? postQ1.reduce((t, x) => t + x.tp, 0) / postQ1.length : null;
  const streetMultOnOurs = m => (m * X.SEG.hotel.adjEbitda[1] + X.INV * 0.8 + F.treasury[1]) / sh; // a street multiple on our FY28E hotel EBITDA, apartments at 80%, FY28E net cash
  const ests = ST.filter(s => s.est?.FY28E?.ebitda);
  const vsStreet = y => ({ ebitda: ests.map(s => [s.broker, s.est[y].ebitda, F.ebitda[X.yi(y)] / s.est[y].ebitda - 1]), eps: ests.map(s => [s.broker, s.est[y].eps, F.eps[X.yi(y)] / s.est[y].eps - 1]), rev: ests.map(s => [s.broker, s.est[y].rev, F.sales[X.yi(y)] / s.est[y].rev - 1]) });
  const ebitdaCagrFwd = (Math.pow(F.ebitda[2] / X.A.ebitda[X.b], 1 / 3) - 1) * 100, epsCagrFwd = (Math.pow(F.eps[2] / (C.fy26.patBei / sh), 1 / 3) - 1) * 100;

  // DCF: discount rate at which our cash flows justify today's price
  const dcfAt = w => { const pv = V.rows.reduce((s, r, i) => s + r.fcff / Math.pow(1 + w / 100, i + 0.5), 0); const last = V.rows.at(-1); const tv = last.fcff * (1 + V.terminalGrowth / 100) / ((w - V.terminalGrowth) / 100) / Math.pow(1 + w / 100, V.rows.length); return (pv + tv + V.netCash) / F.shares * Math.pow(1 + V.ke / 100, 0.5); };
  const solve = target => { let lo = V.terminalGrowth + 0.3, hi = 20; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (dcfAt(m) > target) lo = m; else hi = m; } return (lo + hi) / 2; };
  const impliedWacc = solve(price);

  return { PEER_SYMS, PEERS, PR, MED, drEv, drPe, drEvList, dr5Ev, dr5Pe, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, sens, shortName, k, kpe,
    evAfter, evBull, evBear, peAfter, peBull, peBear, hm, pem, nonHotel, impliedHotelMult, perTurn, tpAt, rating, buyBelow, sellAbove, ruleText: L.ruleText,
    ST, byB, medAll, postQ1, avgPost, streetMultOnOurs, ests, vsStreet, ebitdaCagrFwd, epsCagrFwd, dcfAt, impliedWacc };
};

if (require.main === module) {
  const X = require('./ITCHOTELS.ctx');
  const r = v => Math.round(v * 100) / 100, J = o => JSON.stringify(Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'number' ? r(v) : v])));
  console.log('HEV', J(X.HEV), 'cons', J(X.HEVcons), 'list', J(X.HEVlist), 'now', r(X.evNow.hot), r(X.evNow.cons), r(X.evNow.pe));
  console.log('drEv', J(X.drEv), 'sector', r(X.sectorDrEv), 'sens', J(X.sens), 'evAfter', r(X.evAfter), r(X.evBull), r(X.evBear));
  console.log('HPE', J(X.HPE), 'FM', X.FM.median, X.FM.medianAll, 'drPe', J(X.drPe), 'sectorPe', r(X.sectorDrPe), 'peAfter', r(X.peAfter), r(X.peBull), r(X.peBear));
  console.log('TP', X.V.tp, X.rating, r(X.V.upside), 'impliedHotelMult', r(X.impliedHotelMult), 'impliedWacc', r(X.impliedWacc), 'perTurn', r(X.perTurn), 'street med', X.medAll, 'avgPost', X.avgPost);
}
