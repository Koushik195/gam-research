// Peer metrics as of a date, from each peer's cached Screener data (data/raw/<SYM>/screener.json):
// price, market value, trailing P/E and EV/EBITDA on that date, plus last full-year revenue,
// EBITDA margin and ROE published by then. Keeps peer tables in a frozen report free of later data.
// Usage: const { peersAsOf } = require('./asof-peers'); peersAsOf(['PIIND', 'NAVINFLUOR'], '2026-09-30')
const fs = require('fs');
const path = require('path');
const RAW = path.join(__dirname, '..', '..', 'data', 'raw');
const num = s => (s ? Number(String(s).replace(/[^0-9.\-]/g, '')) : null);
const at = (series, d) => { const s = (series || []).filter(([x, v]) => x <= d && v != null); return s.length ? s[s.length - 1][1] : null; };

function peerAsOf(sym, asOf) {
  const f = path.join(RAW, sym, 'screener.json');
  if (!fs.existsSync(f)) return { symbol: sym, missing: true };
  const S = JSON.parse(fs.readFileSync(f, 'utf8'));
  // Exchange close on the date if on file (Screener's price/multiple series are weekly); multiples
  // are scaled to that close.
  let closes = null; try { closes = JSON.parse(fs.readFileSync(path.join(RAW, '..', 'market', 'closes', `${asOf}.json`), 'utf8')).closes; } catch {}
  const weekly = at(S.charts?.price?.Price, asOf), price = closes?.[sym] ?? weekly, k = weekly ? price / weekly : 1;
  const shares = num(S.topRatios?.['Market Cap']) / num(S.topRatios?.['Current Price']);
  // last fiscal year whose results were public by asOf (March year-end + 60 days)
  const pl = S.tables['profit-loss'], bs = S.tables['balance-sheet'];
  const fyCols = pl.periods.map((p, i) => [p, i]).filter(([p]) => /^Mar \d{4}$/.test(p) && `${p.slice(-4)}-05-30` <= asOf);
  const [fyP, i] = fyCols[fyCols.length - 1] || [];
  const row = (t, k) => t.rows[Object.keys(t.rows).find(x => x === k || x.startsWith(k + ' '))];
  const sales = i != null ? row(pl, 'Sales')?.[i] ?? row(pl, 'Revenue')?.[i] : null;
  const op = i != null ? row(pl, 'Operating Profit')?.[i] ?? row(pl, 'Financing Profit')?.[i] : null;
  const pat = i != null ? row(pl, 'Net Profit')?.[i] : null;
  const nw = p => { const j = bs.periods.indexOf(p); return j >= 0 ? (row(bs, 'Equity Capital')?.[j] ?? row(bs, 'Share Capital')?.[j] ?? 0) + (row(bs, 'Reserves')?.[j] ?? 0) : null; };
  const prevP = fyP ? `Mar ${+fyP.slice(-4) - 1}` : null;
  const avgNw = fyP && nw(fyP) != null && nw(prevP) != null ? (nw(fyP) + nw(prevP)) / 2 : null;
  return {
    symbol: sym, name: S.name, asOf, price, mcapCr: price && shares ? Math.round(price * shares) : null,
    pe: at(S.charts?.pe?.['Price to Earning'], asOf) != null ? Math.round(at(S.charts.pe['Price to Earning'], asOf) * k * 10) / 10 : null,
    evEbitda: at(S.charts?.evEbitda?.['EV Multiple'], asOf) != null ? Math.round(at(S.charts.evEbitda['EV Multiple'], asOf) * k * 10) / 10 : null,
    fy: fyP ? `FY${fyP.slice(-2)}` : null, revenue: sales ?? null, ebitdaMargin: sales && op != null ? Math.round(op / sales * 1000) / 10 : null,
    roe: pat != null && avgNw ? Math.round(pat / avgNw * 1000) / 10 : null,
  };
}
const peersAsOf = (syms, asOf) => syms.map(s => peerAsOf(s, asOf));
module.exports = { peersAsOf, peerAsOf };

if (require.main === module) {
  const [asOf, ...syms] = process.argv.slice(2);
  for (const p of peersAsOf(syms, asOf)) console.log(JSON.stringify(p));
}
