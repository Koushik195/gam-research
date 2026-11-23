// Mahindra & Mahindra initiation: shared context, part 3. Sensitivities and chart data built on ctx2 (target vs
// holding discount, view-based sensitivity rows, core P/E history chart, adjusted DCF grid, street and peer rows).
const X = require('./M&M.ctx2');
const { F, V, AS, SC, D, price, sh, sep, t, SOTP, SB, MULT, DISC, KEPT, coreMed, derate, discSens, half, med, SUBS_NOW, n0, n1, invAtCost, PEERS, closes, NEWINV, ASOF } = X;
const c28 = SB.c28;
const subsGrossBase = SB.subsGross; // listed at market + unlisted at cost + new investment at cost

// Target vs holding discount: the core multiple is re-derived at each discount (history on the same basis)
const TPD = discSens.map(r => { const m = half(r.med * (1 + derate / 100)); return { disc: r.disc, med: r.med, mult: m, tp: (m * c28 * sh + subsGrossBase * (1 - r.disc / 100)) / sh }; });

// View-based sensitivity rows (not used in the base case; PLAYBOOK §7c)
const since23 = med(KEPT.filter(r => r.d >= '2023-04-01').map(r => r.pe));
const listedIdx = s => X.LISTED.findIndex(l => l[0] === s);
const techmAtGam = SUBS_NOW.listed[listedIdx('TECHM')] * (1430 / closes.TECHM - 1), mmfAtGam = SUBS_NOW.listed[listedIdx('M&MFIN')] * (330 / closes['M&MFIN'] - 1);
const mealTx = X.MEAL_TX.conversion2026 * X.MEAL_TX.mmStake / 100 - SUBS_NOW.meal;
const per = v => v / sh;
const SENS = [
  ['Base case', `${MULT.base}x core, ${DISC.base}% discount, unlisted at cost`, SB.perShare],
  ['Own median since Apr-2023 only (after the re-rating)', `${n1(since23)}x x (1 ${derate.toFixed(1)}%) = ${half(since23 * (1 + derate / 100))}x`, SB.perShare + (half(since23 * (1 + derate / 100)) - MULT.base) * c28],
  ['No sector de-rating', `${half(coreMed)}x core`, SB.perShare + (half(coreMed) - MULT.base) * c28],
  ['Street-style multiple on core EPS', '24x core (Motilal Oswal uses 24x autos / 26x tractors)', SB.perShare + (24 - MULT.base) * c28],
  ['MEAL at its CCPS conversion value', `92.45% x ₹40,400 cr instead of cost (net of ${DISC.base}%)`, SB.perShare + per(mealTx) * (1 - DISC.base / 100)],
  ['Tech Mahindra and M&M Finance at GAM targets', 'Rs1,430 (SELL) and Rs330 (HOLD) instead of the 30-Sep prices', SB.perShare + per(techmAtGam + mmfAtGam) * (1 - DISC.base / 100)],
  ['Headline P/E (house forwardMedian, no SOTP)', `${X.HEAD.median}x x (1 ${derate.toFixed(1)}%) = ${half(X.HEAD.median * (1 + derate / 100))}x standalone Sep-28E EPS incl. group dividends`, X.headPe.val],
].map(([k, how, v]) => ({ k, how, v, up: (v / price - 1) * 100 }));

// Core forward P/E history chart (every 2nd weekly point to keep the chart light)
const PE_CHART = KEPT.filter((_, i) => i % 2 === 0 || i === KEPT.length - 1).map(r => [r.d, Math.round(r.pe * 10) / 10]);
const HEAD_CHART = X.SERIES.filter((_, i) => i % 2 === 0 || i === X.SERIES.length - 1).map(r => [r.d, Math.round(r.head * 10) / 10]);

// DCF grid adjusted: engine cells carry group investments at cost; swap them for the SOTP value (net of discount)
const roll = Math.pow(1 + V.ke / 100, (AS.dcf.rollForwardMonths ?? 6) / 12);
const dcfShift = (SB.subsNet - invAtCost(0)) / sh * roll;
const DCF_GRID = V.sens ? V.sens.grid.map(row => row.map(c => Math.round((c + dcfShift) / 10) * 10)) : [];

// Street rows and peers
const ST = D.street.brokers, tps = ST.map(s => s.tp), tpMean = tps.reduce((s, x) => s + x, 0) / tps.length;
const streetRows = ST.map(s => [s.broker, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', s.thesis, s.date]);
const peerRows = PEERS.map(p => [p.symbol === 'M&M' ? '**M&M (standalone)**' : p.name.replace(/ Ltd$/, ''), n0(p.mcapCr), p.pe != null ? n1(p.pe) + 'x' : '–', p.pe5y != null ? n1(p.pe5y) + 'x' : '–', p.vs != null ? `${p.vs >= 0 ? '+' : ''}${p.vs.toFixed(1)}%` : '–', p.evEbitda != null ? n1(p.evEbitda) + 'x' : '–', p.ebitdaMargin != null ? n1(p.ebitdaMargin) + '%' : '–', p.roe != null ? n1(p.roe) + '%' : '–', p.symbol === 'M&M' ? 'excluded (own stock)' : p.excluded ? 'excluded' : 'in median']);

// Group stake table rows (30-Sep values)
const stakeRows = SB.parts.filter(p => p.key !== 'core').map(p => [p.name, p.method, n0(p.gross), n0(p.gross / sh), n0(p.net / sh)]);
const listedPs = SUBS_NOW.lv / sh, subsPs = SB.subsGross / sh;

// Price moves Aug-Sep 2026 (peers) from Screener weekly prices + 30-Sep closes
const move = s => { const ser = X.scr(s).charts.price.Price; const a = X.at(ser, '2026-07-31'); return a ? (closes[s] / a - 1) * 100 : null; };
const MOVES = ['M&M', 'MARUTI', 'BAJAJ-AUTO', 'EICHERMOT', 'HEROMOTOCO', 'TVSMOTOR', 'ASHOKLEY', 'ESCORTS'].map(s => [s, move(s)]);

module.exports = { ...X, X2: X, TPD, SENS, since23, PE_CHART, HEAD_CHART, DCF_GRID, dcfShift, ST, tpMean, streetRows, peerRows, stakeRows, listedPs, subsPs, MOVES, c28 };

if (require.main === module) {
  console.log('TP vs discount', TPD.map(r => `${r.disc}%: ${r.mult}x → ₹${n0(r.tp)}`).join(' | '));
  SENS.forEach(s => console.log(s.k, '|', s.how, '| ₹' + n0(s.v), s.up.toFixed(1) + '%'));
  console.log('street mean', n0(tpMean), '| moves', MOVES.map(([s, m]) => `${s} ${m?.toFixed(1)}`).join(' '), '| dcfShift', n0(dcfShift), 'grid mid', DCF_GRID[2]?.[2]);
}
