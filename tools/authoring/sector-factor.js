// Sector factor at the as-of date (PLAYBOOK §7c): each peer's multiple at the close vs its own median
// over a window, and the median of those moves across the peer set. Same method as the A18-A21 pharma
// factors (current multiple from asof-peers.js, scaled to the exchange close; median from Screener's
// weekly series, positive points only).
//   node tools/authoring/sector-factor.js [--from 2021-09-30] [--metric pe|ev] [--set A,B,C] [--exclude SYM] [--asof 2026-09-30]
// --from: start of the window (five-year default 2021-09-30; a recently listed or turnaround name uses
//         its own window start, so the peers' move is over the same window).
// --set:  peer symbols (default: the nine-name pharma set). --exclude: drop a name (the company itself).
const fs = require('fs');
const path = require('path');
const { peersAsOf } = require('./asof-peers');
const RAW = path.join(__dirname, '..', '..', 'data', 'raw');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ASOF = arg('--asof', '2026-09-30');
const FROM = arg('--from', '2021-09-30');
const METRIC = arg('--metric', 'pe');
const PHARMA = ['SUNPHARMA', 'DIVISLAB', 'TORNTPHARM', 'ZYDUSLIFE', 'CIPLA', 'AUROPHARMA', 'ALKEM', 'IPCALAB', 'ABBOTINDIA'];
const SET = arg('--set', PHARMA.join(',')).split(',').map(s => s.trim()).filter(Boolean);
const EXCL = arg('--exclude', '').split(',').filter(Boolean);
const SERIES = { pe: ['pe', 'Price to Earning', 'pe'], ev: ['evEbitda', 'EV Multiple', 'evEbitda'] }[METRIC];
if (!SERIES) throw new Error('--metric must be pe or ev');
const med = a => { const s = [...a].sort((x, y) => x - y); if (!s.length) return null; const i = (s.length - 1) / 2, lo = Math.floor(i); return s[lo] + (s[Math.ceil(i)] - s[lo]) * (i - lo); };

const now = Object.fromEntries(peersAsOf(SET, ASOF).map(p => [p.symbol, p]));
const rows = SET.map(s => {
  const f = path.join(RAW, s, 'screener.json');
  if (!fs.existsSync(f)) return { peer: s, note: 'no screener.json (fetch it first)' };
  const X = JSON.parse(fs.readFileSync(f, 'utf8'));
  const all = (X.charts?.[SERIES[0]]?.[SERIES[1]] || []).filter(([d]) => d >= FROM && d <= ASOF);
  const pos = all.filter(([, x]) => x > 0);
  const m = med(pos.map(x => x[1])), cur = now[s]?.[SERIES[2]];
  return {
    peer: s, current: cur, median: m && +m.toFixed(1), move: cur && m ? +((cur / m - 1) * 100).toFixed(1) : null,
    points: pos.length, negPoints: all.length - pos.length, first: pos[0]?.[0] || null,
    note: EXCL.includes(s) ? 'excluded' : (pos[0] && (new Date(pos[0][0]) - new Date(FROM)) / 864e5 > 21 ? 'history starts after the window start' : ''),
  };
});
console.log(`Sector ${METRIC === 'pe' ? 'P/E' : 'EV/EBITDA'} move at ${ASOF}, window from ${FROM}`);
console.table(rows);
const used = rows.filter(r => r.move != null && !EXCL.includes(r.peer));
console.log(`Factor (median of ${used.length} peers${EXCL.length ? ', excluding ' + EXCL.join('/') : ''}): ${med(used.map(r => r.move)).toFixed(2)}%`);
