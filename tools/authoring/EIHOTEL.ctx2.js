// EIH context, part 2: hotel peers and the sector move (same window as the own history), multiple derivation checks, SOTP
// checks (minorities, EIH Associated Hotels), rating from the house rule, what the price implies, street. Called from EIHOTEL.ctx.js.
const fs = require('fs');
const path = require('path');

module.exports = (X, L) => {
  const { ROOT, ASOF, WIN, WIN5, ITC_WIN, ITC_LISTED, D, C, F, V, AS, HEV, HPE, price, mcap, sh, part, vpart, hotelSep28, median, n1, half } = X;
  // Peers at the 30-Sep-2026 close; move = trailing multiple (Screener) vs its own median over the window
  const PEER_SYMS = ['EIHOTEL', 'INDHOTEL', 'ITCHOTELS', 'LEMONTREE', 'CHALET'];
  const PEERS = L.peersAsOf(PEER_SYMS, ASOF), PR = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
  const scr = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
  const medFrom = (sym, chart, key, from) => median((scr(sym).charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= from && x > 0).map(x => x[1]));
  const winOf = s => (s === 'ITCHOTELS' ? ITC_WIN : WIN); // ITC Hotels: the window it has, listing months skipped
  const mvOf = (now, med) => (now / med - 1) * 100;
  const MED = {}, drEv = {}, drPe = {}, dr5Ev = {}, drEvList = {};
  PEER_SYMS.forEach(s => {
    MED[s] = { ev: medFrom(s, 'evEbitda', 'EV Multiple', winOf(s)), pe: medFrom(s, 'pe', 'Price to Earning', winOf(s)), ev5: medFrom(s, 'evEbitda', 'EV Multiple', s === 'ITCHOTELS' ? ITC_WIN : WIN5), evList: medFrom(s, 'evEbitda', 'EV Multiple', s === 'ITCHOTELS' ? ITC_LISTED : WIN) };
    drEv[s] = mvOf(PR[s].evEbitda, MED[s].ev); drPe[s] = mvOf(PR[s].pe, MED[s].pe); dr5Ev[s] = mvOf(PR[s].evEbitda, MED[s].ev5); drEvList[s] = mvOf(PR[s].evEbitda, MED[s].evList);
  });
  const CORE = ['INDHOTEL', 'ITCHOTELS', 'LEMONTREE'], LEFT_OUT = ['CHALET'];
  if (CORE.length < 3) throw new Error('EIHOTEL: fewer than three usable hotel peers');
  const sectorDrEv = median(CORE.map(s => drEv[s])), sectorDrPe = median(CORE.map(s => drPe[s]));
  const sens = { five: median(CORE.map(s => dr5Ev[s])), itcListing: median(CORE.map(s => drEvList[s])), withChalet: median([...CORE, 'CHALET'].map(s => drEv[s])), exItc: median(['INDHOTEL', 'LEMONTREE'].map(s => drEv[s])), exIhcl: median(['ITCHOTELS', 'LEMONTREE'].map(s => drEv[s])) };
  const shortName = s => ({ INDHOTEL: 'IHCL', EIHOTEL: 'EIH (Oberoi)', CHALET: 'Chalet Hotels', LEMONTREE: 'Lemon Tree', ITCHOTELS: 'ITC Hotels' }[s] || s);

  // Derived multiples (nearest half-turn) must equal assumptions
  const k = 1 + sectorDrEv / 100, kpe = 1 + sectorDrPe / 100;
  const evAfter = HEV.med * k, evBull = HEV.p75 * k, evBear = HEV.p25 * k;
  const peAfter = HPE.med * kpe, peBull = HPE.p75 * kpe, peBear = HPE.p25 * kpe;
  const hm = vpart(/^Hotels/).multiple, pem = AS.valuation.blend.methods.find(m => m.key === 'pe').multiple;
  const CHECK = process.env.EIHOTEL_NOCHECK !== '1';
  if (CHECK && (half(evAfter) !== hm.base || half(evBull) !== hm.bull || half(evBear) !== hm.bear)) throw new Error(`EV/EBITDA not derived: ${n1(evAfter)} / ${n1(evBull)} / ${n1(evBear)} vs ${hm.base}/${hm.bull}/${hm.bear}`);
  if (CHECK && (half(peAfter) !== pem.base || half(peBull) !== pem.bull || half(peBear) !== pem.bear)) throw new Error(`P/E not derived: ${n1(peAfter)} / ${n1(peBull)} / ${n1(peBear)} vs ${pem.base}/${pem.bull}/${pem.bear}`);

  // SOTP checks: minorities = MIN_PCT of hotel EV per case; EIH Associated Hotels at market less 20/10/30% replacing book
  const MIN_PCT = 4.0;
  const hotelSep28Case = kk => { const Sg = AS.segments[0], d = (kk === 'base' ? {} : AS.scenarios[kk].segments.hotel) || {}; let r = Sg.base; const e = []; Sg.growth.forEach((g, i) => { r *= 1 + (g + (d.growthDelta || 0)) / 100; e.push(r * (Sg.marginPct[i] + (d.marginDelta || 0)) / 100); }); return (e[1] + e[2]) / 2; };
  const minWant = kk => -MIN_PCT / 100 * hm[kk] * hotelSep28Case(kk);
  const EA = C.listedStakes.eihahl, eaMv = EA.shares * EA.close30Sep, eaWant = { base: eaMv * 0.8 - EA.bookCr, bull: eaMv * 0.9 - EA.bookCr, bear: eaMv * 0.7 - EA.bookCr };
  ['base', 'bull', 'bear'].forEach(kk => {
    const h = vpart(/minorities/).adj[kk]; if (CHECK && Math.abs(h / minWant(kk) - 1) > 0.02) throw new Error(`minority value (${kk}) ${h} vs ${Math.round(minWant(kk))}`);
    if (Math.abs(vpart(/^EIH Associated/).adj[kk] - eaWant[kk]) > 2) throw new Error(`EIHAHL value (${kk}) out of line: ${Math.round(eaWant[kk])}`);
  });
  const minorityTotal = part(/minorities/).value, minPs = -minorityTotal / sh;

  // What the price pays: hotel EV/EBITDA implied by the 30-Sep price, holding the other SOTP parts
  const nonHotel = V.sotp.equity - part(/^Hotels/).value - part(/minorities/).value;
  const perTurnCr = hotelSep28 * (1 - MIN_PCT / 100), perTurn = perTurnCr / sh; // Rs per share for each 1x on Sep-28E EBITDA, net of minorities
  const impliedHotelMult = (mcap - nonHotel) / perTurnCr;
  const tpAt = mult => Math.round((V.sotp.equity + (mult - hm.base) * perTurnCr) / sh / 5) * 5;

  // Rating from the house rule (never typed)
  const rating = L.ratingFor(V.upside);
  const buyBelow = Math.round(L.buyAt(V.tp) / 5) * 5, sellAbove = Math.round(L.sellAt(V.tp) / 5) * 5;

  // Street on 30-Sep-2026
  const ST = (D.street?.brokers || []).filter(s => s.tp && s.date <= ASOF), byB = n => ST.find(s => s.broker === n);
  const medAll = ST.length ? median(ST.map(s => s.tp)) : null, axis = byB('Axis Capital');
  const streetMultFor = tp => (tp * sh - nonHotel) / perTurnCr; // the Sep-28E EV/EBITDA a street target implies on our numbers
  const ebitdaCagrFwd = (Math.pow(F.ebitda[2] / X.A.ebitda[X.b], 1 / 3) - 1) * 100, ebitdaCagrHist = (Math.pow(X.A.ebitda[X.b] / X.A.ebitda[X.b - 3], 1 / 3) - 1) * 100;
  const epsBei26 = X.epsBei[2026], epsCagrFwd = (Math.pow(F.eps[2] / epsBei26, 1 / 3) - 1) * 100;

  // DCF: discount rate at which our cash flows justify today's price
  const dcfAt = w => { const pv = V.rows.reduce((s, r, i) => s + r.fcff / Math.pow(1 + w / 100, i + 0.5), 0); const last = V.rows.at(-1); const tv = last.fcff * (1 + V.terminalGrowth / 100) / ((w - V.terminalGrowth) / 100) / Math.pow(1 + w / 100, V.rows.length); return (pv + tv + V.netCash) / F.shares * Math.pow(1 + V.ke / 100, 0.5); };
  const solve = target => { let lo = V.terminalGrowth + 0.3, hi = 20; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (dcfAt(m) > target) lo = m; else hi = m; } return (lo + hi) / 2; };
  const impliedWacc = solve(price);

  return { PEER_SYMS, PEERS, PR, MED, drEv, drPe, dr5Ev, drEvList, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, sens, shortName, k, kpe,
    evAfter, evBull, evBear, peAfter, peBull, peBear, hm, pem, MIN_PCT, hotelSep28Case, EA, eaMv, minorityTotal, minPs, nonHotel, perTurn, perTurnCr, impliedHotelMult, tpAt,
    rating, buyBelow, sellAbove, ruleText: L.ruleText, ST, byB, medAll, axis, streetMultFor, ebitdaCagrFwd, ebitdaCagrHist, epsBei26, epsCagrFwd, dcfAt, impliedWacc };
};

if (require.main === module) {
  process.env.EIHOTEL_NOCHECK = process.env.EIHOTEL_NOCHECK || '0';
  const X = require('./EIHOTEL.ctx');
  const r = v => Math.round(v * 100) / 100, J = o => JSON.stringify(Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'number' ? r(v) : v])));
  console.log('HEV', J(X.HEV), 'plain', J(X.HEVplain), 'since21', J(X.HEV21), 'trough', X.troughEv, 'now', r(X.evNow.gross), r(X.evNow.plain), 'm', r(X.evNow.m * 100));
  console.log('drEv', J(X.drEv), 'dr5Ev', J(X.dr5Ev), 'drEvList', J(X.drEvList), 'sector', r(X.sectorDrEv), 'sens', J(X.sens));
  console.log('evAfter', r(X.evAfter), 'bull', r(X.evBull), 'bear', r(X.evBear), 'MED', JSON.stringify(X.MED));
  console.log('HPE', J(X.HPE), 'rep', J(X.HPErep), 'FM', X.FM.median, X.FM.medianAll, X.FM.troughYears, 'drPe', J(X.drPe), 'sectorPe', r(X.sectorDrPe), 'peAfter', r(X.peAfter), r(X.peBull), r(X.peBear));
  console.log('TP', X.V.tp, X.rating, r(X.V.upside), 'impliedHotelMult', r(X.impliedHotelMult), 'impliedWacc', r(X.impliedWacc), 'perTurn', r(X.perTurn), 'street med', X.medAll, 'axisMult', r(X.streetMultFor(385)), 'hotelSep28', r(X.hotelSep28), 'min', r(X.minWant || 0));
  console.log('minority want', ['base', 'bull', 'bear'].map(k => Math.round(-X.MIN_PCT / 100 * X.hm[k] * X.hotelSep28Case(k))), 'EA', Math.round(X.eaMv));
}
