// Reliance Industries: valuation derivations (house rule, PLAYBOOK §4 and §7c), shared by RELIANCE.sync.js and the
// Part B files. Segment multiples come from the closest listed peer set's one-year-forward EV/EBITDA history:
//   O2C    <- refiners (IOC, BPCL, HPCL, MRPL, CPCL)
//   Jio    <- telecom (Bharti Airtel, Indus Towers, Tata Communications; Vodafone Idea excluded: losses every year)
//   Retail <- the consumer-services retail set (DMart, Trent, Metro Brands, Bata, Page; ABFRL, Shoppers Stop, VMM excluded
//             as in DMART.ctx.js)
// Level = median of the peers' own forward EV/EBITDA medians (weekly closes Apr-2021 to Mar-2025, so every forward year
// FY22-FY26 is reported: no look-ahead; trough years left out: forward EBITDA a loss or below half the best of the prior
// three years). Sector move = median of the peers' trailing EV/EBITDA at the 30-Sep-2026 close vs their own five-year
// median (Screener 'EV Multiple', Oct-2021 to Sep-2026), the EV/EBITDA analogue of the §7c factor (TORNTPHARM precedent),
// excluding distorted peers. Base = level x (1 + move), nearest half-turn; bull = level (no move); bear = median of the
// peers' 25th percentiles x (1 + move). E&P, New Energy, RCPL and JioStar are broker- or transaction-anchored.
const fs = require('fs');
const path = require('path');
const { peersAsOf } = require('./asof-peers');
const ROOT = path.join(__dirname, '..', '..'), ASOF = '2026-09-30';
const scr = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const medOf = a => { const s = a.filter(x => x != null && isFinite(x)).sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const half = x => Math.round(x * 2) / 2;
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const lastFy = d => { const y = +d.slice(0, 4); return d >= `${y}-05-30` ? y : y - 1; };

// One-year-forward EV/EBITDA on weekly closes. EV = price x shares (attributable profit / EPS) + borrowings + minority
// interest at book - cash - investments, at the last fiscal year-end published by that date (Screener consolidated).
function fwdEv(sym, from = '2021-04-01', to = '2025-03-31') {
  const S = scr(sym), pl = S.tables['profit-loss'], bs = S.tables['balance-sheet'];
  const by = (t, row) => Object.fromEntries(t.periods.map((p, i) => [p, t.rows[row]?.[i]]).filter(([p]) => /^Mar \d{4}$/.test(p)).map(([p, v]) => [+p.slice(-4), v]));
  const sch = (sec, a, b) => Object.fromEntries(Object.entries(S.schedules?.[sec]?.[a]?.[b] || {}).filter(([p]) => /^Mar \d{4}$/.test(p)).map(([p, v]) => [+p.slice(-4), v]));
  const E = by(pl, 'Operating Profit'), eps = by(pl, 'EPS in Rs'), np = by(pl, 'Net Profit'), pfe = sch('profit-loss', 'Net Profit', 'Profit for EPS');
  const bor = by(bs, 'Borrowings'), inv = by(bs, 'Investments'), cash = sch('balance-sheet', 'Other Assets', 'Cash Equivalents'), nci = sch('balance-sheet', 'Other Liabilities', 'Non controlling int');
  const trough = fy => { const pk = Math.max(...[1, 2, 3].map(j => E[fy - j]).filter(v => v != null)); return !(E[fy] > 0) || E[fy] < 0.5 * pk; };
  const ser = S.charts.price.Price.filter(([d]) => d >= from && d <= to).map(([d, px]) => {
    const fy = fyOf(d), L = lastFy(d), sh = (pfe[L] ?? np[L]) / eps[L], net = (cash[L] || 0) + (inv[L] || 0) - (bor[L] || 0) - (nci[L] || 0);
    return [d, fy, (px * sh - net) / E[fy]]; }).filter(([, fy, x]) => E[fy] > 0 && isFinite(x));
  const kept = ser.filter(([, fy]) => !trough(fy)), v = kept.map(x => x[2]);
  return { sym, med: pct(v, 0.5), p25: pct(v, 0.25), p75: pct(v, 0.75), n: kept.length, troughs: [...new Set(ser.filter(([, fy]) => trough(fy)).map(([, fy]) => `FY${String(fy).slice(2)}`))] };
}
// Trailing EV/EBITDA and P/E at the 30-Sep close vs five-year medians
function move(sym, P) {
  const S = scr(sym), f = (c, k) => (S.charts?.[c]?.[k] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]);
  const ev5 = pct(f('evEbitda', 'EV Multiple'), 0.5), pe5 = pct(f('pe', 'Price to Earning'), 0.5);
  return { ev: P.evEbitda, ev5, evMove: (P.evEbitda / ev5 - 1) * 100, pe: P.pe, pe5, peMove: (P.pe / pe5 - 1) * 100 };
}
const SETS = {
  o2c: { label: 'Refiners', syms: ['IOC', 'BPCL', 'HINDPETRO', 'MRPL', 'CHENNPETRO'], excl: { HINDPETRO: 'Trailing earnings collapsed on fuel under-recoveries (Q1FY27): P/E 44.6x vs a 5.0x five-year median, EV/EBITDA +109% - a distorted move, left out of the factor (its forward-multiple history stays in the level).' } },
  jio: { label: 'Telecom', syms: ['BHARTIARTL', 'INDUSTOWER', 'TATACOMM'], excl: {} },
  ret: { label: 'Retail', syms: ['DMART', 'TRENT', 'METROBRAND', 'BATAINDIA', 'PAGEIND'], excl: {} },
};
const NAMES = { IOC: 'Indian Oil', BPCL: 'BPCL', HINDPETRO: 'HPCL', MRPL: 'MRPL', CHENNPETRO: 'Chennai Petroleum', BHARTIARTL: 'Bharti Airtel', INDUSTOWER: 'Indus Towers', TATACOMM: 'Tata Communications', DMART: 'DMart', TRENT: 'Trent', METROBRAND: 'Metro Brands', BATAINDIA: 'Bata India', PAGEIND: 'Page Industries', RELIANCE: 'Reliance' };
const ALL = Object.values(SETS).flatMap(s => s.syms);
const PEERS = peersAsOf(['RELIANCE', ...ALL], ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const D = {};
for (const [k, s] of Object.entries(SETS)) {
  const rows = s.syms.map(sym => ({ sym, name: NAMES[sym], ...fwdEv(sym), ...move(sym, P[sym]), excluded: !!s.excl[sym] }));
  const used = rows.filter(r => !r.excluded);
  const level = medOf(rows.map(r => r.med)), p25 = medOf(rows.map(r => r.p25));
  const mv = medOf(used.map(r => r.evMove)), mvPe = medOf(used.map(r => r.peMove)), mvAll = medOf(rows.map(r => r.evMove));
  D[k] = { ...s, rows, level, p25, move: mv, movePe: mvPe, moveAll: mvAll, mult: { base: half(level * (1 + mv / 100)), bull: half(level), bear: half(p25 * (1 + mv / 100)) }, multPe: half(level * (1 + mvPe / 100)) };
}
const own = fwdEv('RELIANCE'), ownMove = move('RELIANCE', P.RELIANCE);
// Broker anchors (deep.json street table, notes of 18-20 Jul-2026)
const STREET = { o2c: [['MOSL', 7.5], ['Emkay', 7.0], ['BOBCAPS (refining 6.5x, petchem 5.5x)', 6.0]], ep: [['BOBCAPS', 4.5], ['MOSL', 5.0], ['Emkay', 6.0]], jio: [['MOSL (DCF-implied)', 11.5], ['Emkay', 12], ['BOBCAPS', 12], ['Antique', 12]], ret: [['Emkay', 27], ['MOSL (blended)', 28], ['BOBCAPS', 35]] };
const streetMed = k => medOf(STREET[k].map(x => x[1]));

module.exports = { ASOF, SETS, NAMES, D, P, PEERS, own, ownMove, STREET, streetMed, half, medOf, pct, fwdEv, move };
if (require.main === module) {
  for (const [k, d] of Object.entries(D)) console.log(k, 'level', d.level.toFixed(2), 'p25', d.p25.toFixed(2), 'move', d.move.toFixed(1), 'pe-move', d.movePe.toFixed(1), JSON.stringify(d.mult), d.rows.map(r => `${r.sym} ${r.med.toFixed(1)} [${r.troughs}] ev ${r.ev}/${r.ev5.toFixed(1)} ${r.evMove.toFixed(1)}`).join('; '));
  console.log('own fwd EV/EBITDA', own.med.toFixed(1), 'move', ownMove.evMove.toFixed(1), 'pe', ownMove.peMove.toFixed(1), 'street', Object.keys(STREET).map(k => k + ' ' + streetMed(k)).join(', '));
}
