// CONCORDBIO: two corrections to Screener's consolidated data, applied in memory by src/model.js on every build (a fresh
// Screener fetch cannot undo them). Originals are kept under _gamPatch. Idempotent.
// 1) NET PROFIT ON THE ATTRIBUTABLE BASIS. Since Jul-2025 Concord owns 75% of Stellon Biotech Inc. (its US front end; AR FY26,
//    AOC-1: FY26 loss after tax Rs7.2 cr). Screener's "Net Profit" row is profit before the 25% minority share of that loss
//    (FY26 Rs259 cr = the company's Rs259.2 cr), while "EPS in Rs" is on profit attributable to owners (Rs261 cr). The engine
//    infers shares as Net Profit / EPS, so we use Screener's own "Profit for EPS" schedule, as EMCURE.patch.js and
//    MANKIND.patch.js do. Before FY26 the two are equal (no minorities).
// 2) THE 1:1 BONUS IS UNDONE, SO EVERY PER-SHARE FIGURE IS ON THE COUNT THAT TRADED ON 30-SEP-2026. The board approved a 1:1
//    bonus on 23-Sep-2026 (subject to shareholder approval); the shares were allotted only in Nov-2026, after our as-of date.
//    Screener (fetched 25-Nov-2026) has restated EPS, prices and book value for the bonus (FY26 EPS Rs12.47; weekly close on
//    25-Sep-2026 Rs726.8; implied 20.92 cr shares), but the exact NSE close on 30-Sep-2026 that the engine appends is the
//    pre-bonus Rs1,373.6 on 10,46,16,204 shares. Mixing the two would double every multiple. We therefore multiply EPS (annual,
//    TTM and quarterly), the weekly price series and moving averages, the TTM EPS and book-value chart series and the headline
//    price, book value and 52-week range by 2, and halve traded volume. Market value, profit, P/E and EV/EBITDA are unchanged.
//    FY26 EPS becomes Rs24.94 (AR FY26 basic EPS Rs24.78 on profit of Rs259.2 cr; Screener's Rs12.47 x 2).
// Not changed: sales, EBITDA, the balance sheet, the TTM profit column (the as-of freeze recomputes it from released quarters).
// Note for authoring: tools/authoring/valuation-blend.js (forwardSeries/forwardMedian) and asof-peers.js read the UNPATCHED
// screener.json (bonus-adjusted), so CONCORDBIO.ctx.js builds Concord's own forward P/E and peer row from patchRaw() output.
// Usage (check only): node tools/authoring/CONCORDBIO.patch.js
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'CONCORDBIO', 'screener.json');
const BONUS = 2;              // 1:1 bonus (one new share for each share held) allotted Nov-2026: 10,46,16,204 -> 20,92,32,408 shares
const SHARES_PRE = 10.4616204; // crore shares on 30-Sep-2026 (BSE allotment filing, Nov-2026; IPO prospectus, Aug-2023)
const num = s => (s ? Number(String(s).replace(/[^0-9.\-]/g, '')) : null);

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS" (attributable); 1:1 bonus (Nov-2026) undone on every per-share series. Originals below.', fetchedAt: S.fetchedAt, bonus: BONUS, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab], pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`CONCORDBIO patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'], eps = T.rows['EPS in Rs'];
    keep.original[`${tab}.Net Profit`] = row.slice(); keep.original[`${tab}.EPS`] = eps.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
    T.rows['EPS in Rs'] = eps.map(v => (typeof v === 'number' ? Math.round(v * BONUS * 100) / 100 : v));
  }
  const ch = S.charts || {}, mul = (arr, k) => (arr || []).map(([d, v]) => [d, typeof v === 'number' ? Math.round(v * k * 100) / 100 : v]);
  for (const k of ['Price', 'DMA50', 'DMA200']) if (ch.price?.[k]) ch.price[k] = mul(ch.price[k], BONUS);
  if (ch.price?.Volume) ch.price.Volume = mul(ch.price.Volume, 1 / BONUS);
  if (ch.pe?.EPS) ch.pe.EPS = mul(ch.pe.EPS, BONUS);
  if (ch.pb?.['Book value']) ch.pb['Book value'] = mul(ch.pb['Book value'], BONUS);
  // 3) Shareholding: Screener adds an off-cycle column ('Nov 2026', the post-bonus pattern). src/model.js freezeAsOf only drops
  //    quarter-end columns released after the as-of date and keeps any other month, so the report's "latest" shareholding would
  //    leak a Nov-2026 filing. We drop non-quarter-end columns (none existed before the bonus).
  const SQ = S.shareholding?.quarterly;
  if (SQ) { const keepIdx = SQ.periods.map(p => /^(Mar|Jun|Sep|Dec) \d{4}$/.test(p)); keep.original.shareholdingPeriods = SQ.periods.slice();
    SQ.periods = SQ.periods.filter((_, i) => keepIdx[i]); for (const r of Object.keys(SQ.rows)) SQ.rows[r] = SQ.rows[r].filter((_, i) => keepIdx[i]); }
  const top = S.topRatios || {};
  keep.original.topRatios = { ...top };
  if (num(top['Current Price'])) top['Current Price'] = `₹ ${Math.round(num(top['Current Price']) * BONUS * 100) / 100}`;
  if (num(top['Book Value'])) top['Book Value'] = `₹ ${Math.round(num(top['Book Value']) * BONUS * 100) / 100}`;
  const hl = String(top['High / Low'] || '').replace(/[₹,\s]/g, '').split('/').map(Number);
  if (hl.length === 2 && hl.every(Number.isFinite)) top['High / Low'] = `₹ ${hl[0] * BONUS} / ${hl[1] * BONUS}`;
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, BONUS, SHARES_PRE };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'], o = S._gamPatch.original;
  for (const p of ['Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p), np = pl.rows['Net Profit'][i], eps = pl.rows['EPS in Rs'][i];
    console.log(`${p} | Net Profit ${np} (was ${o['profit-loss.Net Profit'][i]}) | EPS ${eps} (was ${o['profit-loss.EPS'][i]}) | implied shares ${(np / eps).toFixed(3)} cr (actual ${SHARES_PRE.toFixed(3)})`);
  }
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log(`Q1FY27 | Net Profit ${q.rows['Net Profit'][j]} | EPS ${q.rows['EPS in Rs'][j]} | implied shares ${(q.rows['Net Profit'][j] / q.rows['EPS in Rs'][j]).toFixed(2)} cr`);
  const px = S.charts.price.Price.filter(([d]) => d <= '2026-09-30').at(-1);
  console.log(`Last weekly close to 30-Sep (pre-bonus) ${px[0]} Rs${px[1]} | headline ${S.topRatios['Current Price']} / mcap ${S.topRatios['Market Cap']} -> shares ${(num(S.topRatios['Market Cap']) / num(S.topRatios['Current Price'])).toFixed(3)} cr`);
}
