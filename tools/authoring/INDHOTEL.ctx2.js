// Indian Hotels context, part 2: hotel peers and the sector move, multiple derivation checks, SOTP checks (minorities,
// Oriental Hotels, Brij), street table, rating from the house rule and the discount rate the price implies. Called from INDHOTEL.ctx.js.
const fs = require('fs');
const path = require('path');

module.exports = (X, L) => {
  const { ROOT, ASOF, WIN, WIN5, D, C, F, V, AS, HEV, HPE, price, mcap, sh, part, vpart, hotelSep28, acSep28, ebitdaSep28, netCashSep28, median, n1 } = X;
  // Peers at the 30-Sep-2026 close; move = trailing multiple vs its own median over the window (Screener)
  const PEER_SYMS = ['INDHOTEL', 'EIHOTEL', 'CHALET', 'LEMONTREE', 'ITCHOTELS'];
  const PEERS = L.peersAsOf(PEER_SYMS, ASOF), PR = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
  const scr = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
  const medFrom = (sym, chart, key, from) => { const v = (scr(sym).charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= from && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
  const MEDEV = {}, MEDPE = {}, MED5EV = {}, MED5PE = {};
  PEER_SYMS.forEach(s => { MEDEV[s] = medFrom(s, 'evEbitda', 'EV Multiple', WIN); MEDPE[s] = medFrom(s, 'pe', 'Price to Earning', WIN); MED5EV[s] = medFrom(s, 'evEbitda', 'EV Multiple', WIN5); MED5PE[s] = medFrom(s, 'pe', 'Price to Earning', WIN5); });
  const mv = (now, med) => (now / med - 1) * 100;
  const drEv = {}, drPe = {}, dr5Ev = {}, dr5Pe = {};
  PEER_SYMS.forEach(s => { drEv[s] = mv(PR[s].evEbitda, MEDEV[s]); drPe[s] = mv(PR[s].pe, MEDPE[s]); dr5Ev[s] = mv(PR[s].evEbitda, MED5EV[s]); dr5Pe[s] = mv(PR[s].pe, MED5PE[s]); });
  const CORE = ['EIHOTEL', 'LEMONTREE'], LEFT_OUT = ['CHALET', 'ITCHOTELS'], OTHERS = ['EIHOTEL', 'CHALET', 'LEMONTREE', 'ITCHOTELS'];
  const sectorDrEv = median(CORE.map(s => drEv[s])), sectorDrPe = median(CORE.map(s => drPe[s]));
  const sens = { five: median(CORE.map(s => dr5Ev[s])), withChalet: median(['EIHOTEL', 'CHALET', 'LEMONTREE'].map(s => drEv[s])), all4: median(OTHERS.map(s => drEv[s])) };
  const shortName = s => ({ INDHOTEL: 'IHCL', EIHOTEL: 'EIH (Oberoi)', CHALET: 'Chalet Hotels', LEMONTREE: 'Lemon Tree', ITCHOTELS: 'ITC Hotels' }[s] || s);

  // Derived multiples (nearest half-turn) must equal assumptions
  const half = v => Math.round(v * 2) / 2;
  const evAfter = HEV.med * (1 + sectorDrEv / 100), evBull = HEV.p75 * (1 + sectorDrEv / 100), evBear = HEV.p25 * (1 + sectorDrEv / 100);
  const peAfter = HPE.med * (1 + sectorDrPe / 100), peBull = HPE.p75 * (1 + sectorDrPe / 100), peBear = HPE.p25 * (1 + sectorDrPe / 100);
  const hm = vpart(/^Hotels/).multiple, pem = AS.valuation.blend.methods.find(m => m.key === 'pe').multiple;
  const CHECK = process.env.INDHOTEL_NOCHECK !== '1';
  if (CHECK && (half(evAfter) !== hm.base || half(evBull) !== hm.bull || half(evBear) !== hm.bear)) throw new Error(`EV/EBITDA not derived: ${n1(evAfter)} / ${n1(evBull)} / ${n1(evBear)} vs ${hm.base}/${hm.bull}/${hm.bear}`);
  if (CHECK && (half(peAfter) !== pem.base || half(peBull) !== pem.bull || half(peBear) !== pem.bear)) throw new Error(`P/E not derived: ${n1(peAfter)} / ${n1(peBull)} / ${n1(peBear)} vs ${pem.base}/${pem.bull}/${pem.bear}`);
  const tm = vpart(/^TajSATS/).multiple;
  ['base', 'bull', 'bear'].forEach(k => { if (CHECK && Math.abs(tm[k] - hm[k] * 0.51) > 0.001) throw new Error(`TajSATS multiple (${k}) out of line`); });

  // SOTP checks: hotel minorities = 5.0% of hotel EV per case; Oriental Hotels at market less 20/10/30%; Brij outflow
  const HOTEL_MIN_PCT = 5.0;
  const hotelSep28Case = k => { const Sg = AS.segments[0], d = (k === 'base' ? {} : AS.scenarios[k].segments.hotel) || {}; let r = Sg.base; const e = []; Sg.growth.forEach((g, i) => { r *= 1 + (g + (d.growthDelta || 0)) / 100; e.push(r * (Sg.marginPct[i] + (d.marginDelta || 0)) / 100); }); return (e[1] + e[2]) / 2; };
  const minWant = k => -HOTEL_MIN_PCT / 100 * hm[k] * hotelSep28Case(k);
  ['base', 'bull', 'bear'].forEach(k => { const h = vpart(/minorities in hotel/).adj[k]; if (CHECK && Math.abs(h / minWant(k) - 1) > 0.02) throw new Error(`minority value (${k}) ${h} vs ${Math.round(minWant(k))}`); });
  const OHL = C.ohlMerger, ohlClose = 142.36, ohlSh = C.listedStakes.ohl.shares, ohlMv = ohlSh * ohlClose;
  const ohlWant = { base: ohlMv * 0.8 - OHL.bookValue, bull: ohlMv * 0.9 - OHL.bookValue, bear: ohlMv * 0.7 - OHL.bookValue };
  ['base', 'bull', 'bear'].forEach(k => { if (Math.abs(vpart(/^Oriental/).adj[k] - ohlWant[k]) > 3) throw new Error(`OHL value (${k}) out of line: ${Math.round(ohlWant[k])}`); });
  const minorityTotal = part(/minorities in hotel/).value, minPs = -minorityTotal / sh;
  const ohlSwapValue = OHL.newShares * price; // value of IHCL shares to be issued to OHL's other holders, at today's price
  const mergedOhlEv = OHL.ohlFy26.opEbitda * hm.base; // what OHL's FY26 EBITDA is worth at our multiple, for the sensitivity

  // What the price pays: hotel EV/EBITDA implied by the 30-Sep price, holding the other SOTP parts
  const nonHotel = V.sotp.equity - part(/^Hotels/).value - part(/minorities in hotel/).value;
  const impliedHotelMult = (mcap - nonHotel) / (hotelSep28 * (1 - HOTEL_MIN_PCT / 100));
  const evAtPrice = (mcap - netCashSep28 - part(/^Oriental/).value - part(/^Brij|Less: Brij/).value) ; // equity value net of non-operating items

  // Rating from the house rule (never typed)
  const rating = L.ratingFor(V.upside);
  const buyBelow = Math.round(L.buyAt(V.tp) / 10) * 10, sellAbove = Math.round(L.sellAt(V.tp) / 10) * 10;

  // Street on 30-Sep-2026
  const ST = D.street.brokers, byB = n => ST.find(s => s.broker === n);
  const mosl = byB('Motilal Oswal'), isec = byB('ICICI Securities'), idir = byB('ICICI Direct'), axis = byB('Axis Securities'), ar = byB('Anand Rathi');
  const postQ1 = ST.filter(s => s.date >= '2026-07-21'), avgPost = postQ1.reduce((t, x) => t + x.tp, 0) / postQ1.length, medAll = median(ST.map(s => s.tp));
  const ourOnStreet = { idir: V.tp / idir.tp - 1, mosl: V.tp / mosl.tp - 1 };
  const streetMultOnOurs = m => (m * F.ebitda[1] + F.treasury[1]) / sh; // a street multiple on our FY28E EBITDA and FY28E net cash (no minority deduction, as ICICI Direct/Axis)
  const epsCagrFwd = (Math.pow(F.eps[2] / (C.fy26.patBei / sh), 1 / 3) - 1) * 100, ebitdaCagrFwd = (Math.pow(F.ebitda[2] / X.A.ebitda[X.b], 1 / 3) - 1) * 100;
  const ebitdaCagrHist = (Math.pow(X.A.ebitda[X.b] / X.A.ebitda[X.b - 3], 1 / 3) - 1) * 100;

  // DCF: discount rate at which our cash flows justify today's price
  const dcfAt = w => { const pv = V.rows.reduce((s, r, k) => s + r.fcff / Math.pow(1 + w / 100, k + 0.5), 0); const last = V.rows.at(-1); const tv = last.fcff * (1 + V.terminalGrowth / 100) / ((w - V.terminalGrowth) / 100) / Math.pow(1 + w / 100, V.rows.length); return (pv + tv + V.netCash) / F.shares * Math.pow(1 + V.ke / 100, 0.5); };
  const solve = target => { let lo = V.terminalGrowth + 0.3, hi = 20; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (dcfAt(m) > target) lo = m; else hi = m; } return (lo + hi) / 2; };
  const impliedWacc = solve(price);

  return { PEER_SYMS, PEERS, PR, MEDEV, MEDPE, MED5EV, MED5PE, drEv, drPe, dr5Ev, dr5Pe, CORE, LEFT_OUT, OTHERS, sectorDrEv, sectorDrPe, sens, shortName, half,
    evAfter, evBull, evBear, peAfter, peBull, peBear, hm, pem, HOTEL_MIN_PCT, hotelSep28Case, minorityTotal, minPs, OHL, ohlClose, ohlSh, ohlMv, ohlSwapValue, mergedOhlEv,
    nonHotel, impliedHotelMult, evAtPrice, rating, buyBelow, sellAbove, ruleText: L.ruleText, ST, byB, mosl, isec, idir, axis, ar, postQ1, avgPost, medAll, ourOnStreet, streetMultOnOurs,
    epsCagrFwd, ebitdaCagrFwd, ebitdaCagrHist, dcfAt, impliedWacc };
};

if (require.main === module) {
  process.env.INDHOTEL_NOCHECK = process.env.INDHOTEL_NOCHECK || '0';
  const X = require('./INDHOTEL.ctx');
  const r = v => Math.round(v * 10) / 10, J = o => JSON.stringify(Object.fromEntries(Object.entries(o).map(([k, v]) => [k, r(v)])));
  console.log('HEV', J(X.HEV), 'plain', J(X.HEVplain), 'since21', J(X.HEV21), 'trough', X.troughEv, 'now', r(X.evNow.gross), r(X.evNow.plain), 'm', r(X.evNow.m * 100));
  console.log('drEv', J(X.drEv), 'dr5Ev', J(X.dr5Ev), 'sector', r(X.sectorDrEv), 'sens', J(X.sens));
  console.log('evAfter', r(X.evAfter), 'bull', r(X.evBull), 'bear', r(X.evBear));
  console.log('HPE', J(X.HPE), 'rep', J(X.HPErep), 'FM', X.FM.median, X.FM.medianAll, 'drPe', J(X.drPe), 'sectorPe', r(X.sectorDrPe), 'peAfter', r(X.peAfter), r(X.peBull), r(X.peBear));
  console.log('TP', X.V.tp, X.rating, r(X.V.upside), 'impliedHotelMult', r(X.impliedHotelMult), 'impliedWacc', r(X.impliedWacc), 'avgPost', Math.round(X.avgPost), 'med', X.medAll, 'min', Math.round(X.minorityTotal));
}
